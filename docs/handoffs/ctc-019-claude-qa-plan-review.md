# CTC-019 Claude QA plan review

Date: 2026-06-19

## Disposition

Claude returned `NEEDS SPEC FIXES` for the CTC-019 adversarial QA planning
gate.

The response is accepted as the adversarial QA plan for CTC-019, but it does
not authorize runtime implementation yet. Claude identified six narrow
specification gaps that must be resolved before CTC-019 can move to
`3. In Development (ChatGPT)`.

## Blocking specification fixes

Claude requires explicit written decisions for:

1. `schemaVersion` value and mismatch policy.
2. `sizeBytes` computation method.
3. Oversized-record byte threshold and boundary behavior.
4. IndexedDB `onversionchange` and `onblocked` behavior.
5. Refresh cooldown scope: per-key or global.
6. Interaction between fresh-TTL cache entries and explicit
   `Refresh course data`.

Claude also flagged one network-safety detail as a minor spec fix: set a hard
maximum retry count for the bounded backoff loop.

## Accepted QA plan scope

The QA plan is binding for implementation after the spec addendum is accepted.
It requires coverage for:

- complete durable-record validation, including one-missing-field cases;
- exact query, bbox, endpoint, timestamp, TTL, ODbL marker, raw response, and
  size validation;
- unknown-field tolerance without trusting unknown fields as evidence;
- TTL boundary behavior and future-clock handling;
- invalid/corrupt/expired/oversized deletion failure still returning a miss;
- non-durable memory fallback when IndexedDB open/write paths fail;
- already-aborted signals and aborts during storage reads, backoff waits,
  fetches, and post-fetch handling;
- retry-after seconds/date parsing, malformed headers, long server waits, and
  deterministic post-jitter delay caps;
- refresh cooldown and one-active-request behavior across click, keyboard, and
  programmatic activation paths;
- stale-data consent under network, timeout, offline-copy, and rate-limit
  failures;
- network-isolated Chromium Playwright coverage proving durable cache reuse
  after reload and no external requests;
- accessibility checks for refresh, status output, stale consent, and new
  failure states;
- security, privacy, licensing, ODbL, and CTC-020/CTC-008 scope red lines.

## Gate status

CTC-019 remains in `2. QA Planning (Claude)`. The next artifact is a Codex
specification addendum resolving the six blockers above, followed by a brief
Claude re-review of that addendum. Runtime implementation remains blocked.
