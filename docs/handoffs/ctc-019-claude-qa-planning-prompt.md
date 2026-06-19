# CTC-019 Claude adversarial QA planning prompt

Use Claude Chat for adversarial QA planning. Claude does not have repository or
filesystem access by default, so provide this prompt and attach the listed
files.

## Role

You are Claude acting as the independent adversarial QA planner for Chart the
Course task CTC-019.

Your job is to challenge the accepted CTC-019 specification baseline and
produce a concrete QA plan before implementation begins. Do not implement code.
Do not approve implementation unless the plan is specific enough for Codex to
turn into deterministic tests and runtime checks.

## Task

CTC-019 Implement Overpass cache and request identity policy.

Acceptance criteria:

- IndexedDB or equivalent browser cache stores fetched OSM course geometry.
- Default TTL is 7 days for public Overpass usage.
- UI has explicit `Refresh course data` action with rate limiting.
- Requests use app origin/referrer where available and prefix Overpass QL with
  an identifying comment.
- 429/Retry-After handling and exponential backoff are implemented.
- Cached OSM geometry is clearly marked ODbL-covered in exported source files.

Interpret the final criterion as internal durable cache provenance only. CTC-019
must not implement CTC-020 source export UI/schema or CTC-008 PDF behavior.

## Accepted baseline summary

Gemini Chat's corrected baseline is accepted for QA planning only, with Codex
corrections. It specifies:

- dedicated cache module `src/overpassCache.ts`;
- native IndexedDB database `ChartTheCourse`, version 1, object store
  `courseGeometry`, inline key path `key`;
- non-durable in-memory `Map` fallback when IndexedDB is unavailable;
- records keyed by existing `discoveryCacheKey(bbox, courseName)` and
  `detailCacheKey(bbox)` behavior;
- bbox comparison through existing `serializeBbox`;
- record `mode: "discovery" | "detail"`;
- exact `rawResponse` preservation as durable source evidence;
- source metadata preservation: `query`, `endpoint`, `completedAt`, `bbox`,
  and `copyrightUrl`;
- internal `license: "ODbL-1.0"` marker only;
- 7-day TTL: `expiresAt = storedAt + 604800000`;
- no automatic stale OSM rendering; visible user consent is required before
  stale data is shown;
- best-effort deletion for invalid, expired, corrupt, incompatible, or
  oversized records, with deletion failure still returning a cache miss;
- explicit `Refresh course data` button, one-active-request behavior, native
  disabled state during active fetch/cooldown, and static `role="status"` /
  `aria-atomic="true"` status output;
- browser request identity through the existing first-line Overpass QL comment:
  `/* chart-the-course/{APP_VERSION} contact:{CONTACT_URL} purpose:golf-course-{discovery|detail} */`;
- no attempt to set `User-Agent`, `Origin`, `Referer`, or other request
  identity headers;
- 429 `Retry-After` parsing for delta-seconds and HTTP-date values;
- bounded exponential backoff with deterministic timing;
- pre-check `AbortSignal.aborted` before storage/fetch work, check after async
  storage operations, clear retry timers on cancellation, pass the signal to
  fetch, and ignore late aborted/superseded results;
- no endpoint failover, provider expansion, API keys, accounts, servers,
  analytics, telemetry, cloud sync, or unrelated user-authored project
  persistence.

## Codex corrections that are part of the baseline

Treat these corrections as mandatory:

1. The baseline is ready for Claude QA planning, not implementation.
2. Fresh cache hits must validate every required field: `schemaVersion`, `key`,
   `mode`, exact `source.query`, exact `source.endpoint`, valid
   `source.completedAt`, `source.bbox` serialized via `serializeBbox`, exact
   `source.copyrightUrl`, non-empty `rawResponse`, parseable Overpass response
   shape, `license`, `storedAt`, `expiresAt`, `sizeBytes`, and TTL.
3. If deterministic `+10%` jitter is retained, cap the final computed delay
   after jitter. Conservative default: actual wait never exceeds 30 seconds.
4. Retry-After policy is: parse standards-valid delta-seconds or HTTP-date
   values; wait only up to 60 seconds; if the server asks for more than
   60 seconds, abort that attempt and surface a visible rate-limit state.
5. Browser storage and private-mode behavior are variable operational risks,
   not guaranteed facts. The implementation should catch open/write failures
   and degrade cleanly regardless of browser-specific reason.
6. `StorageManager.estimate()` is diagnostic-only and must not gate cache
   reads, writes, stale consent, or retry behavior.
7. Stale OSM data is never rendered automatically, including offline or
   `navigator.onLine === false` cases. `navigator.onLine` may inform copy only.
8. Unknown durable-record fields are ignored unless they conflict with required
   fields. Unknown fields are never trusted as evidence.
9. ODbL markers remain internal cache provenance only. CTC-019 must not define
   source-export filenames, schemas, download UI, PDF acknowledgements, or
   other CTC-020/CTC-008 behavior.

## Repository guardrails

- Original Chart the Course code remains Apache-2.0.
- Do not copy, modify, adapt, link, combine, incorporate, or distribute
  AGPL-3.0 code from `ace`.
- Treat `hacker-yardage` and `openyardage-web` as study-only unless permission
  or license is verified.
- Keep direct dependencies exact-pinned. Conservative default for CTC-019 is no
  new production or dev dependency.
- Use synthetic fixtures only; automated tests must remain network-isolated.
- Preserve exact raw OSM response/source evidence separately from normalized
  geometry and user-authored project state.
- Raw GIS source export remains CTC-020 and PDF export remains CTC-008.

## Attachments to provide

Attach these files if the chat UI allows them:

- `docs/handoffs/ctc-019-gemini-chat-corrected-baseline-review.md`
- `docs/handoffs/ctc-019-antigravity-spec-review.md`
- `docs/handoffs/ctc-019-gemini-chat-spec-review.md`
- `docs/overpass-query-contract.md`
- `ATTRIBUTION.md`
- `SECURITY.md`
- `src/overpass.ts`
- `src/overpass.test.ts`
- `src/App.tsx`
- `test/e2e/app.spec.ts`

If upload limits prevent all attachments, prioritize the first file, then
`src/overpass.ts`, `src/App.tsx`, `src/overpass.test.ts`, and
`docs/overpass-query-contract.md`.

## Required output

Produce exactly these sections:

1. Verdict: one of `READY FOR IMPLEMENTATION AFTER QA PLAN`, `NEEDS SPEC FIXES`,
   or `BLOCKED`.
2. Blocking specification issues, if any.
3. Adversarial QA plan grouped by unit tests, integration/state tests,
   Playwright tests, manual review checks, and documentation/compliance checks.
4. Security, privacy, licensing, and ODbL red lines.
5. Accessibility red lines for refresh, status output, stale consent, and
   keyboard/programmatic event paths.
6. Network and Overpass public-service safety red lines.
7. Minimal test matrix and fixtures required before implementation can be
   accepted.
8. Explicit non-goals that must not appear in CTC-019 implementation.
9. Final implementation gate: state whether Codex may move CTC-019 to
   `3. In Development (ChatGPT)` after applying your QA plan.

Distinguish blockers from minor fixes. Be adversarial: assume corrupt storage,
aborted signals, repeated clicks, malicious durable records, unavailable
IndexedDB, rate limits, invalid Retry-After headers, stale data pressure, and
future CTC-020/PDF scope leakage.
