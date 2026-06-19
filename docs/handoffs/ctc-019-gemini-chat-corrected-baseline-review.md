# CTC-019 Gemini Chat corrected baseline review

Date: 2026-06-19

## Disposition

Gemini Chat's corrected CTC-019 baseline is **accepted for Claude QA planning
with Codex corrections**.

This is not implementation authorization. CTC-019 may move from
`1. Spec Drafting (Gemini)` to `2. QA Planning (Claude)` so Claude can produce
an adversarial QA plan against the accepted baseline and the correction notes
below. Runtime work remains blocked until Claude QA planning is completed and
Codex critically reviews the resulting plan.

## Accepted baseline direction

The corrected response resolves the prior blocking failures well enough for the
next gate:

- Uses a dedicated `src/overpassCache.ts` module.
- Keeps `mode` as `"discovery" | "detail"`.
- Preserves `rawResponse` as the durable source of truth.
- Preserves `source.query`, `source.endpoint`, `source.completedAt`,
  `source.bbox`, and `source.copyrightUrl`.
- Preserves the existing `discoveryCacheKey`, `detailCacheKey`, and
  `serializeBbox` contracts.
- Preserves the current Overpass QL identity comment format based on
  `APP_VERSION`, `CONTACT_URL`, and request purpose.
- Rejects custom request-identity headers such as `User-Agent`, `Origin`, and
  `Referer`.
- Requires visible user consent before rendering stale OSM data.
- Treats deletion failure as isolated from cache-hit decisions.
- Treats memory/session fallback as non-durable degradation only.
- Keeps CTC-020 source export and CTC-008 PDF behavior out of scope.
- Keeps the test plan within existing repository patterns: Vitest plus
  Chromium Playwright, with no new test dependency by default.

## Codex corrections required before implementation

Claude QA planning must treat these as part of the accepted baseline:

1. The Gemini phrase `Conditionally Ready for Implementation` is too strong.
   Correct status is **ready for Claude QA planning**, not implementation.
2. Strict durable-entry validation must include every required metadata field,
   not only the fields listed in Gemini section 4. A fresh hit must validate:
   `schemaVersion`, `key`, `mode`, exact `source.query`, exact
   `source.endpoint`, valid `source.completedAt`, `source.bbox` serialized via
   `serializeBbox`, exact `source.copyrightUrl`, non-empty `rawResponse`,
   parseable Overpass response shape, `license`, `storedAt`, `expiresAt`,
   `sizeBytes`, and TTL.
3. The retry formula must not exceed its advertised maximum delay. If
   deterministic `+10%` jitter is retained, cap the final computed delay after
   jitter or explicitly define the maximum final delay. The conservative
   default is: compute base backoff, add deterministic jitter, then cap the
   actual wait at 30 seconds.
4. The Retry-After policy must use one consistent rule: parse standards-valid
   delta-seconds or HTTP-date values; wait only up to 60 seconds; if the server
   asks for more than 60 seconds, abort that attempt and surface a visible
   rate-limit state instead of silently using a shorter wait.
5. Storage and private-mode claims must remain soft operational risks. Do not
   encode claims such as Safari private browsing always having exactly zero
   quota as implementation facts. The implementation should catch open/write
   failures and degrade cleanly regardless of browser-specific reason.
6. `StorageManager.estimate()` remains diagnostic-only. It must not gate cache
   reads, writes, stale consent, or retry behavior.
7. Stale OSM data is never rendered automatically, including offline or
   `navigator.onLine === false` cases. `navigator.onLine` may inform copy only.
8. Unknown durable-record fields are ignored unless they conflict with required
   fields. Unknown fields are never trusted as evidence.
9. ODbL markers remain internal cache provenance only. CTC-019 must not define
   source-export filenames, schemas, download UI, PDF acknowledgements, or
   other CTC-020/CTC-008 behavior.

## Remaining QA focus

Claude should stress the baseline around:

- corrupt durable records that partially satisfy validation;
- already-aborted signals before cache work starts;
- aborts during storage reads, retry waits, fetches, and post-fetch writes;
- stale-data consent under network failure and rate-limit failure;
- one-active-request and cooldown bypass attempts from pointer, keyboard, and
  programmatic events;
- Retry-After seconds/date parsing, invalid headers, long server waits, and
  deterministic backoff timing;
- private/restricted IndexedDB failures and non-durable fallback visibility;
- multi-tab `versionchange`/`onblocked` behavior;
- accidental CTC-020 export leakage.
