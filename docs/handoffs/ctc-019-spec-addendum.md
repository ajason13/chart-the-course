# CTC-019 specification addendum

Date: 2026-06-19

This addendum resolves the narrow blockers Claude identified in the CTC-019 QA
planning response. It amends the accepted CTC-019 baseline and Codex correction
review. It does not authorize implementation by itself.

## 1. Schema version

Durable cache records use:

```ts
schemaVersion: 1
```

The value is a JavaScript number, not a string.

Read policy:

- A record with `schemaVersion !== 1` is incompatible.
- Incompatible records are never fresh hits.
- Incompatible records trigger best-effort deletion for the requested key.
- Deletion failure does not block returning a cache miss.

Migration policy:

- CTC-019 implements no record migration logic beyond creating the v1 store.
- Future schema changes must use a later IndexedDB version and a separately
  reviewed migration policy.
- CTC-019 must not partially trust or rewrite older/unknown schema records.

## 2. Size accounting

`sizeBytes` records the UTF-8 byte length of the full serialized durable cache
record that is written to IndexedDB.

Implementation rule:

1. Build the record with `sizeBytes: 0`.
2. Serialize it with `JSON.stringify(record)`.
3. Compute `sizeBytes` with `new TextEncoder().encode(serialized).length`.
4. Set the computed `sizeBytes`.
5. Serialize the final record for writing.

Validation rule:

- `sizeBytes` must be a finite non-negative integer.
- A cache hit must recompute the current serialized record size and require it
  to match stored `sizeBytes`.
- A mismatch is treated as corrupt evidence and returns a miss with
  best-effort deletion.

The size value is used only for local validation and oversized-record
protection. It is not a CTC-020 export schema field.

## 3. Oversized record threshold

Maximum durable record size is 1 MiB:

```ts
MAX_OVERPASS_CACHE_RECORD_BYTES = 1_048_576
```

Boundary behavior:

- A record with `sizeBytes <= 1_048_576` may be stored if all other validation
  passes.
- A record with `sizeBytes > 1_048_576` is oversized.
- Oversized records are not written durably.
- Existing oversized records are never fresh hits and trigger best-effort
  deletion.
- If a fresh network response would exceed the threshold, the app may render
  the result for the active session but must surface a visible non-durable
  cache warning.

## 4. IndexedDB versionchange and blocked upgrades

Each open database connection must register an `onversionchange` handler.

Policy:

- On `versionchange`, close the current database connection with `db.close()`.
- After closing due to `versionchange`, the active page degrades to the
  non-durable in-memory cache for the rest of the session.
- No user-facing modal is required for CTC-019 v1.
- A non-blocking status/warning message may be shown if cache persistence is
  unavailable after the connection closes.

`onblocked` policy:

- CTC-019 does not attempt to abort an upgrade transaction from `onblocked`.
- If opening/upgrading remains blocked or fails, catch the failure and degrade
  to the non-durable in-memory cache.
- Blocked/open failures must not crash the UI or start retry loops.

## 5. Refresh cooldown scope

`Refresh course data` cooldown is per cache key.

Policy:

- Discovery refresh cooldown is keyed by `discoveryCacheKey(bbox, courseName)`.
- Detail refresh cooldown is keyed by `detailCacheKey(bbox)`.
- One active live Overpass request is still enforced globally for the browser
  session.
- A cooldown hit for the same key is a no-op and must not cancel or restart the
  in-flight/current request.
- A request for a different key must still respect the global one-active-live
  request guard.

Cooldown timing:

- The 5-second cooldown starts when a manual refresh live request is started.
- Fast failures do not allow immediate repeated requests for the same key.
- After the cooldown expires, a new manual refresh for that key is allowed if
  no global live request is active.

## 6. Explicit refresh versus fresh cache entries

`Refresh course data` is an explicit user action to bypass a fresh cache hit.

Policy:

- If a valid cache entry is still within its 7-day TTL, normal course loading
  may use it as a fresh hit.
- Activating `Refresh course data` bypasses the fresh hit for the active key
  and attempts a live Overpass request, subject to the per-key cooldown and
  global one-active-request guard.
- On successful refresh, the durable record for that key is replaced
  atomically from the new exact `rawResponse` and source metadata.
- On refresh failure, the current rendered geometry remains unchanged.
- A stale or expired cached record is not rendered after refresh failure unless
  the user gives explicit visible consent.
- A fresh pre-existing record may remain rendered after refresh failure because
  it was already the current non-stale view; the failure must not silently
  replace it with stale data.

## 7. Retry attempt count

Bounded backoff uses at most three retry attempts after the initial live
request:

```ts
MAX_OVERPASS_RETRY_ATTEMPTS = 3
```

This means one user action can produce at most four live Overpass requests:
the initial attempt plus three retries.

Retry rules remain:

- `Retry-After` values requiring more than 60 seconds are not silently
  truncated into a retry; the attempt aborts and surfaces a visible
  rate-limit state.
- Deterministic backoff waits are capped after applying deterministic jitter,
  so actual wait never exceeds 30 seconds.
- Aborting during backoff clears the scheduled timer and prevents further
  retry attempts.

## Gate status

This addendum resolves the six Claude QA planning blockers plus the retry-count
minor fix. CTC-019 remains in `2. QA Planning (Claude)` pending a brief Claude
re-review of this addendum. Runtime implementation remains blocked until the
addendum is accepted.
