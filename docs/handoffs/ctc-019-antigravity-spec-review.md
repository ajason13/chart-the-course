# CTC-019 Antigravity specification review

Date: 2026-06-18

## Disposition

Antigravity's CTC-019 research specification is relevant but not
implementation-ready as written. It is accepted as research input for the
durable Overpass cache/request-policy task, subject to the corrections below.

Accepted direction:

- Use native IndexedDB for durable browser cache storage without adding a
  dependency.
- Cache both discovery and detail responses durably while preserving existing
  deterministic cache keys.
- Preserve exact raw Overpass response text and source metadata separately from
  normalized geometry and user-authored project data.
- Validate every durable source metadata field before a hit.
- Use an explicit `Refresh course data` action with per-key rate limiting.
- Implement bounded Retry-After/backoff behavior without endpoint failover.
- Preserve Overpass QL identifying comments and normal browser origin/referrer
  behavior; do not set forbidden browser headers.
- Keep CTC-020 source export and CTC-008 PDF behavior out of scope.
- Cover the work with deterministic unit tests and network-isolated
  Playwright tests.

## Required corrections before implementation

1. The artifact's `no blocking unknowns` claim is too strong. Browser storage
   durability, quota behavior, and private-mode IndexedDB behavior are
   inherently variable. Implementation must degrade cleanly without promising
   persistence or quota capacity.
2. `StorageManager.estimate()` is optional diagnostic context only. It must not
   become a prerequisite for cache reads, writes, or user-facing behavior.
3. The durable record schema must include explicit `mode` (`discovery` or
   `detail`) and `schemaVersion` or equivalent record-version naming. It must
   define dangerous/unexpected-key handling; unknown fields should be ignored
   unless they conflict with required fields, not treated as trusted evidence.
4. Query validation must be exact enough to bind the record to the requested
   cache key. A cached `query` merely starting with the identifying comment is
   too loose. The spec must require the expected query for the requested bbox
   and course name/detail mode, or a deterministic equivalent comparison.
5. Bbox validation must use the existing `serializeBbox` and current cache-key
   contracts. It should not rely on ad hoc extraction of decimal coordinates
   from arbitrary query text.
6. Invalid, corrupt, incompatible, oversized, or expired records must never be
   fresh hits. Best-effort deletion is acceptable, but deletion failure must not
   block treating the record as a miss.
7. Stale data must not be rendered automatically after a failed network request.
   The safer rule is visible user choice before any stale OSM data is shown,
   including offline/network-failure cases.
8. `navigator.onLine` is not a reliable authority for showing stale data. It
   may inform copy, but it must not bypass explicit stale-data consent.
9. Retry-After capping must be internally consistent. Do not say values up to
   300 seconds are used and then cap them at 30 seconds. Use one bounded policy:
   parse standards-compliant seconds/date values, cap actual client wait to the
   reviewed maximum, and show a visible rate-limit state when the server asks
   for more than the client will wait.
10. Random jitter is hard to test deterministically. If jitter is retained, the
    implementation must inject a deterministic jitter function in tests. A
    simpler no-jitter deterministic MVP is acceptable if it still avoids retry
    storms through low request volume, one active request, and strict caps.
11. `aria-disabled` is acceptable only with complete click and keyboard guards
    plus tests. Do not treat native `disabled` as categorically inaccessible;
    use the control state that best preserves focus and prevents duplicate
    requests in the implemented UI.
12. IndexedDB operations are not abortable like fetch. Cancellation must
    pre-check before starting storage work and ignore late storage results when
    aborted or superseded; it must not pretend IndexedDB transactions can always
    be cancelled.
13. Fallback to session or memory storage must be described as non-durable
    degradation. It must not be counted as satisfying the CTC-019 durable-cache
    acceptance criterion.
14. The `completedAt within 60 seconds of storedAt` check may be too strict for
    future migration/rewrite paths. For CTC-019 fresh writes it is reasonable,
    but the implementation spec should explain why the invariant is safe or
    relax it to valid timestamp plus TTL/source consistency.
15. The `odblLabel` value is acceptable as an internal marker only. User-facing
    attribution and later CTC-020 export text remain governed by
    `ATTRIBUTION.md`; this task must not invent a source-export schema.
16. The test plan's custom in-memory IndexedDB stub must be scoped carefully.
    It should verify project logic, not become an inaccurate browser API clone.
    Playwright coverage should exercise real browser IndexedDB behavior for at
    least persistence, reload, and degraded/unavailable paths where feasible.
17. The file plan should include a likely dedicated cache module, for example
    `src/overpassCache.ts`, instead of placing all IndexedDB logic in
    `src/overpass.ts`, unless implementation review shows the smaller module is
    unnecessary.

## Gate status

CTC-019 remains in `1. Spec Drafting (Gemini)`. The next step is either:

- revise the specification baseline using these corrections, then send the
  corrected spec to Claude for adversarial QA planning; or
- ask Antigravity for a corrected revision that addresses this review exactly.

No feature branch, runtime implementation, dependency change, provider,
source-export behavior, or PDF behavior is authorized by this review.
