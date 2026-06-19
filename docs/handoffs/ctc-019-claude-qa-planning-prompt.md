# CTC-019 Claude adversarial QA planning prompt

Use Claude Chat for adversarial QA planning. This prompt is self-contained and
embeds the repository context Claude needs; do not rely on filesystem, GitHub,
or separate file uploads.

Embedded snapshots were taken from repository commit `7c73d05dc68c56c8735fdbe11e07b4bdfac9d976` on
2026-06-19. Treat the embedded file contents as source-of-truth context for
QA planning.

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

## Accepted Baseline Summary

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

## Codex Corrections That Are Part Of The Baseline

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

## Repository Guardrails

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

## Embedded Snapshot Verification

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `docs/handoffs/ctc-019-gemini-chat-corrected-baseline-review.md` | 4609 | `0a7273199e1d9ac578c83c1044f06f36fde3410823ee348af114579e5fd5750f` |
| `docs/handoffs/ctc-019-antigravity-spec-review.md` | 5847 | `a291211a004a567bffa2dc446dacdf24e2c70debee67bfe148741c781a73ed0a` |
| `docs/handoffs/ctc-019-gemini-chat-spec-review.md` | 5255 | `b2d917e69cbe463869c3a648fb601c18c98c3776ae71cc9637c5c89f758e5a13` |
| `docs/overpass-query-contract.md` | 10318 | `20f32093a2253c1d0af20f249818abb7e56b5e5b0a0b652fa5e9066ec7c445a9` |
| `ATTRIBUTION.md` | 6010 | `65feea7eab65b273fe1ca0cc2534190e2741e453b8183acf533296e6bcd348c8` |
| `SECURITY.md` | 1184 | `430b3fde9efec030a4284eb292560b0f2b4529e206c69be919d7fdf4c7bd7135` |
| `src/overpass.ts` | 9455 | `c894f2f548e5668e91ac545751369e657509faa9531b7ba6b14af284461f3d37` |
| `src/overpass.test.ts` | 6360 | `ce722d97552be264f163dcb2d0e5b4ab77df82fcdf1b84b6b67e64a084111244` |
| `src/App.tsx` | 18601 | `ea044e66054de434b8f693fc358b53db22c009868e975600e32248346665503b` |
| `test/e2e/app.spec.ts` | 12845 | `86e9c1bfbae431f56430ef93e585f8b1778a6e1a6a7048cde4eb74b89438f1e7` |

## Required Output

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

## Embedded Repository Context

### docs/handoffs/ctc-019-gemini-chat-corrected-baseline-review.md

SHA-256: `0a7273199e1d9ac578c83c1044f06f36fde3410823ee348af114579e5fd5750f`

````````text
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

````````

### docs/handoffs/ctc-019-antigravity-spec-review.md

SHA-256: `a291211a004a567bffa2dc446dacdf24e2c70debee67bfe148741c781a73ed0a`

````````text
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

````````

### docs/handoffs/ctc-019-gemini-chat-spec-review.md

SHA-256: `b2d917e69cbe463869c3a648fb601c18c98c3776ae71cc9637c5c89f758e5a13`

````````text
# CTC-019 Gemini Chat specification review

Date: 2026-06-19

## Disposition

Gemini Chat's CTC-019 specification response is **not implementation-ready**
and is rejected as the CTC-019 corrected baseline.

The response is useful as another research attempt, but it does not satisfy
the required CTC-019 correction prompt or the repository contracts. CTC-019
must remain in `1. Spec Drafting (Gemini)` until Codex records an accepted
corrected baseline and Claude adversarial QA planning is completed and
critically reviewed.

## Blocking issues

1. It does not start with the mandatory sentence:
   `CTC-019 specifies a browser-durable Overpass cache and bounded request policy without implementing source export or PDF behavior.`
2. The durable record schema is incompatible with the accepted corrections:
   `mode` is defined as `"durable" | "memory"` instead of `"discovery" |
   "detail"`, and the schema omits required source metadata fields such as
   `endpoint` and `copyrightUrl`.
3. The schema stores parsed `geometry` instead of preserving exact
   `rawResponse` plus source metadata separately from normalized geometry.
   This conflicts with the ODbL/source-evidence boundary and current
   `CachedResponse` shape.
4. It replaces the accepted deterministic cache keys with a new hash/key
   design. CTC-019 must preserve current `discoveryCacheKey` and
   `detailCacheKey` behavior unless a reviewed maintainer decision changes it.
5. It proposes normalizing queries by stripping comments and whitespace. This
   conflicts with exact query preservation and destroys the identifying
   Overpass QL comment evidence required by the request-identity contract.
6. It invents request identity text with `admin@example.com` and suggests
   custom identity headers. Browser JavaScript must not try to set forbidden
   identity headers, and the existing repo contract already defines the
   `chart-the-course/{version} contact:{repo URL} purpose:golf-course-*`
   comment format.
7. It treats IndexedDB operations and upgrade blocking too much like abortable
   fetch work. IndexedDB transactions are not generally abortable in the way
   described, and `onblocked` does not provide a transaction to abort after a
   timer.
8. It proposes `fake-indexeddb` and a JSDOM unit-test environment even though
   the repository currently has no such dependency or JSDOM setup. Any dev
   dependency must be explicit, exact-pinned, and justified; the response does
   not do that.
9. It proposes Playwright coverage across Chromium, Firefox, and WebKit, while
   the current Playwright configuration is Chromium-only. Browser matrix
   expansion is not authorized by CTC-019 unless separately justified.
10. It adds a Notion epic/user-story/task matrix inside the implementation
    specification. That is product-management scope creep and was explicitly
    rejected in earlier Gemini plan review.
11. It uses a 5-second refresh cooldown without tying the choice to public
    Overpass safety, one-active-request behavior, or a reviewed rate-limit
    rationale.
12. It does not clearly state that stale OSM data is never rendered without
    visible user consent in every failure case; the prompt text is close but
    still frames stale fallback around a modal without specifying durable
    state-machine invariants.
13. It does not require deletion failure to still return a miss for invalid,
    corrupt, incompatible, oversized, or expired records.
14. It treats the internal `license` field as future export input and says
    downstream export functions must read it. CTC-019 must not define CTC-020
    export behavior or schema.
15. It includes unsupported or uncited storage quota claims as "critical
    blocking unknowns" instead of describing browser-variable behavior as
    non-guaranteed runtime variability with graceful degradation.

## Accepted fragments

These parts are directionally useful but need correction before implementation:

- A dedicated `src/overpassCache.ts` module is likely appropriate.
- Native IndexedDB remains the right durable storage direction.
- A non-durable in-memory fallback is acceptable as graceful degradation only.
- `StorageManager.estimate()` should remain diagnostic-only.
- `navigator.onLine` may inform copy only.
- A deterministic retry policy is preferable to random jitter for testability.
- Stale data requires visible user choice before rendering.

## Required next correction

Do not advance to Claude QA planning from this Gemini response.

The next corrected baseline must:

- Preserve exact raw Overpass response text and source metadata.
- Preserve existing cache-key contracts and `serializeBbox`.
- Define `mode` as discovery/detail, not durable/memory.
- Validate exact expected query, endpoint, completedAt, bbox, copyright URL,
  schema version, mode, key, raw response shape, size, TTL, and ODbL marker.
- Treat invalid/expired/corrupt records as misses even if deletion fails.
- Model IndexedDB cancellation as pre-checks plus ignoring late results, not as
  fetch-equivalent transaction cancellation.
- Avoid new dependencies unless explicitly justified and governed.
- Avoid product-management/user-story output.
- Keep CTC-020 source export and CTC-008 PDF behavior out of scope.

````````

### docs/overpass-query-contract.md

SHA-256: `20f32093a2253c1d0af20f249818abb7e56b5e5b0a0b652fa5e9066ec7c445a9`

````````text
# Overpass Query Contract

Status: Implemented as a bounded CTC-004 browser spike on 2026-06-06.

This contract defines the first Chart the Course Overpass API request shape for
course discovery and course-detail loading. CTC-004 implements the bounded
session-only browser spike; later durable cache and geometry work remain
separate tasks.

## Goals

- Find candidate golf courses inside a user-selected bounding box.
- Load the selected course boundary and golf-course features needed for a
  blank/vector-only MVP map.
- Keep public Overpass usage bounded, cacheable, attributable, and recoverable
  when the service rate-limits or sheds load.
- Preserve raw OSM entity IDs, tags, geometry, query text, bounding box, source
  URL, and source-check metadata for later ODbL source export.

## Inputs

All coordinates use WGS84 decimal degrees in Overpass order:
`south,west,north,east`.

| Field | Required | Contract |
| --- | --- | --- |
| `bbox` | Yes | User-selected or geocoded search extent. The client must reject global, country-scale, or otherwise unbounded boxes. |
| `courseName` | No | User-entered search text. Escape for Overpass regular-expression syntax before interpolation. |
| `selectedCourseBbox` | Yes for detail | Exact valid bounding box from the selected `leisure=golf_course` result. Bbox padding is deferred beyond CTC-004. |
| `appVersion` | Yes | Used in the identifying Overpass QL comment. |
| `contactUrl` | Yes | Public project or support URL in the identifying Overpass QL comment. |

Initial guardrail: accept only manually entered decimal coordinate syntax with
at most seven decimal places. Reject exponent notation, locale commas,
non-finite values, antimeridian crossing, invalid ordering, and bboxes wider
than 0.35 degrees longitude or 0.35 degrees latitude unless a future maintainer
decision records a different limit. Exactly 0.35 degrees is allowed. This keeps
browser requests scoped to a city/neighborhood-scale search instead of using
public Overpass as a bulk data backend.

`courseName` must be trimmed, limited to 200 Unicode code points, and rejected
if it contains ASCII control characters. Treat it as a literal string with a
single-pass encoder before interpolation into the regex filter: prefix `\`
before `"`, `\`, and each of `.`, `*`, `+`, `?`, `(`, `)`, `[`, `]`, `{`,
`}`, `|`, `^`, and `$`. Treat `*/` in a course name as ordinary quoted-string
content; it cannot terminate the separate leading comment. Do not concatenate
raw user input into Overpass QL.

## Request Identity

Browser JavaScript cannot reliably set a custom upstream `User-Agent`. Every
Overpass QL body must start with a project-identifying comment, and deployed
browser requests should allow the normal app origin/referrer to be sent where
browser policy permits it.

```overpassql
/* chart-the-course/{{appVersion}} contact:{{contactUrl}} purpose:golf-course-mvp */
```

If Chart the Course later uses a proxy, self-hosted Overpass, or commercial
provider, that server-side layer should also set a descriptive upstream
`User-Agent`.

For CTC-004, the app version and contact URL are fixed trusted constants from
`package.json` and the GitHub repository URL. Validate both constants before
query construction and reject control characters or `*/`.

## Course Discovery Query

Use this query to find candidate courses within the search bbox. If
`courseName` is empty, omit the first name-filtered block and keep only the
unfiltered `leisure=golf_course` block.

```overpassql
/* chart-the-course/{{appVersion}} contact:{{contactUrl}} purpose:golf-course-discovery */
[out:json][timeout:25][maxsize:536870912];
(
  nwr["leisure"="golf_course"]["name"~"{{escapedCourseName}}",i]({{south}},{{west}},{{north}},{{east}});
  nwr["leisure"="golf_course"]({{south}},{{west}},{{north}},{{east}});
);
out tags center bb;
```

Expected use:

- Show candidates from `leisure=golf_course` elements only.
- Prefer area or relation results when duplicate node/way/relation records
  describe the same facility.
- Preserve `id`, `type`, `tags.name`, `tags.operator`, `tags.website`,
  `bounds`, and `center` when present.
- Do not request `meta` for the MVP query path; parser tests can use static
  fixtures for metadata-specific cases if needed later.

## Course Detail Query

Use this query after the user selects a course. The bbox must be derived from
the selected course boundary when available, not from a full city or region.

```overpassql
/* chart-the-course/{{appVersion}} contact:{{contactUrl}} purpose:golf-course-detail */
[out:json][timeout:45][maxsize:536870912];
(
  nwr["leisure"="golf_course"]({{south}},{{west}},{{north}},{{east}});
  nwr["golf"~"^(hole|fairway|green|bunker|tee|water_hazard|lateral_water_hazard|rough|out_of_bounds|pin|cartpath)$"]({{south}},{{west}},{{north}},{{east}});
  nwr["natural"~"^(water|wood|tree|tree_row|scrub)$"]({{south}},{{west}},{{north}},{{east}});
  nwr["landuse"~"^(forest|reservoir|basin)$"]({{south}},{{west}},{{north}},{{east}});
  nwr["water"~"^(pond|lake|basin|reservoir)$"]({{south}},{{west}},{{north}},{{east}});
  nwr["waterway"]({{south}},{{west}},{{north}},{{east}});
);
out body geom;
```

Required feature handling:

- `leisure=golf_course`: course boundary, candidate facility metadata, and
  source bbox.
- `golf=hole`: hole routing line. Treat as the preferred hole-order source
  when `ref`, `name`, or relation membership is usable.
- `golf=fairway`, `golf=green`, `golf=bunker`, `golf=tee`: primary yardage-book
  geometry layers.
- `golf=water_hazard`, `golf=lateral_water_hazard`, `natural=water`,
  `water=*`, and `waterway=*`: candidate penalty/water hazard layers. The
  parser must keep original tags so later UI can distinguish golf-specific
  hazards from generic mapped water.
- `natural=wood`, `landuse=forest`, `natural=tree`, `natural=tree_row`,
  `natural=scrub`: candidate tree/vegetation hazards where available. These are
  advisory map layers, not proof of playable obstruction.

## Rate-Limit and Error Behavior

The public Overpass instances are shared infrastructure. Chart the Course must
treat them as a constrained public service, not a guaranteed production backend.

- Submit at most one active Overpass request per browser session.
- Cache successful public Overpass responses locally. The durable public
  Overpass cache target remains the 7-day TTL in `ATTRIBUTION.md`; if CTC-004
  ships before durable local persistence exists, session storage is acceptable
  only as a temporary CTC-004 exploration-spike constraint before CTC-019
  establishes durable local persistence.
- CTC-004 cache keys are
  `ctc:overpass:v1:discovery:{bbox}:{encoded-lowercase-name}` and
  `ctc:overpass:v1:detail:{bbox}`.
- Never query on keystrokes; require an explicit search action.
- On HTTP `429`, show a rate-limit state and back off before retrying. Do not
  retry automatically in a tight loop.
- On HTTP `504` or timeout, show a scoped-search prompt asking the user to
  narrow the area or try again later.
- On empty results, preserve the searched bbox and query text in diagnostics so
  future support can distinguish missing OSM data from parser failures.
- Keep request bodies small and avoid `out meta` in the default UI path.
- If expected traffic exceeds public Overpass safety guidance, switch to a
  self-hosted instance or approved provider before broad deployment.

A minimally valid raw response is an object with an `elements` array. Every
element must be an object with `type` equal to `node`, `way`, or `relation` and
an integer `id`. `elements: []` is an empty discovery or detail response. Any
non-empty valid elements array is success, even when expected feature types are
absent.

## Attribution and ODbL Records

Every successful detail response must be retained with enough source metadata
to support later ODbL source availability for PDFs and other generated outputs.

CTC-004 stores the exact response text plus source metadata in `sessionStorage`
and parses a separate in-memory representation for display. This session cache
does not satisfy later ODbL source-export obligations.

Persist or export alongside normalized geometry:

- Raw Overpass JSON response.
- Exact Overpass QL query body.
- Request URL or endpoint host.
- Request timestamp.
- Bbox values.
- OSM element type and ID for every normalized feature.
- Original tags for every normalized feature.
- OpenStreetMap copyright URL:
  `https://www.openstreetmap.org/copyright`.

UI and PDF attribution rules remain governed by `ATTRIBUTION.md` and
`docs/tile-provider-strategy.md`.

## Mock Fixture

`fixtures/overpass/synthetic-golf-course.json` is the initial parser-test
fixture for this contract. It is deliberately synthetic: coordinates, names,
and IDs are invented and do not represent a real golf course.

Future parser tests should assert that the fixture can produce:

- One course boundary.
- One numbered hole line.
- Tee, fairway, green, bunker, golf-specific water hazard, generic water, and
  vegetation feature layers.
- OSM IDs, source tags, bbox, and query metadata preserved in the normalized
  model.

## Source Notes

Primary sources checked on 2026-06-05:

- OpenStreetMap golf-course tagging guidance documents `leisure=golf_course`
  boundaries and common internal features such as `golf=tee`, `golf=hole`,
  `golf=fairway`, `golf=green`, `golf=bunker`, and water hazards.
  <https://wiki.openstreetmap.org/wiki/Golf_course>
- Overpass API manual describes public-instance scale, problematic heavy use,
  the broad safety guideline of about 10,000 requests and 1 GB download volume
  per day, slot-based rate limiting, HTTP `429` for rate-limit denials,
  `[timeout:*]`, `[maxsize:*]`, and HTTP `504` for resource denials.
  <https://dev.overpass-api.de/overpass-doc/en/preface/commons.html>
- Overpass QL documentation states settings must be in the first uncommented
  statement, supports `[out:json]`, `[timeout:*]`, `[maxsize:*]`, and notes that
  avoiding `meta` limits processing time.
  <https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL>
- OpenStreetMap attribution guidance requires credit to OpenStreetMap and clear
  ODbL notice; where links are not possible, printed works should include the
  full copyright URL.
  <https://www.openstreetmap.org/copyright/attribution-guide/>

````````

### ATTRIBUTION.md

SHA-256: `65feea7eab65b273fe1ca0cc2534190e2741e453b8183acf533296e6bcd348c8`

````````text
# Attribution Policy

Chart the Course is an Apache-2.0 project that uses open map data and may
eventually use third-party rendering, geometry, PDF, font, and test
dependencies. This file records attribution requirements that must be preserved
in the product, generated exports, documentation, and release artifacts.

## OpenStreetMap and ODbL

OpenStreetMap data is licensed under the Open Database License. Any web map,
course-data view, printed page, or PDF generated from OSM-derived data must
include visible OpenStreetMap attribution.

Required URL for PDF and print outputs:

```text
https://www.openstreetmap.org/copyright
```

MVP PDF policy:

- Include an attribution or acknowledgements block in exported PDFs.
- Include the full URL `https://www.openstreetmap.org/copyright` in PDFs.
- Use a compact OSM attribution footer or note on map-bearing hole pages unless
  legal review approves a lighter layout.
- Keep OSM-derived course geometry separate from user-authored overlays, notes,
  and player profiles where practical. Merge layers only for display/export.

## ODbL Section 4.6 Source Availability

PDF exports are Produced Works. When a PDF is distributed or shared, Chart the
Course must make the source OSM geometry or the means to recreate it available.
The MVP mechanism is a `Download Raw GIS Source (ODbL)` action adjacent to PDF
export.

The raw GIS source export must include:

- Raw GeoJSON or OSM XML response.
- OSM IDs.
- Bounding box.
- Exact Overpass QL query.
- Source URL.
- `https://www.openstreetmap.org/copyright`.

Raw GIS export must ship in the same release as PDF export. This requirement
does not apply to purely private local previews that are not distributed or
shared.

## Tile Provider and Basemap Attribution

CTC-018 selects a blank/vector-only MVP. The deployed MVP must not load
third-party basemap tiles by default and must not use the OSM public tile CDN
without explicit project approval.

Even when no third-party basemap tiles are used, OSM attribution remains
required because the displayed course geometry is OSM-derived.

Required MVP UI attribution for geometry-only views:

```text
Course data © OpenStreetMap contributors
https://www.openstreetmap.org/copyright
```

Required MVP PDF attribution for geometry-only exports:

```text
Course geometry and map data © OpenStreetMap contributors.
OpenStreetMap copyright and license: https://www.openstreetmap.org/copyright
```

If a hosted or self-hosted basemap provider is enabled later, the provider's
required attribution must be visible in every UI map view that uses it, included
in PDFs or printed outputs when relevant, and recorded in
`THIRD_PARTY_NOTICES.md`.

Current fallback preference if basemap context becomes necessary:
self-hosted scoped PMTiles/Protomaps extracts in project-controlled storage,
followed by MapTiler or Stadia only after plan and attribution review.

## Overpass and Nominatim Request Identity

Browser JavaScript cannot reliably set a custom `User-Agent` header. Browser
API requests must use the deployed app origin/referrer where available and
prefix Overpass QL bodies with an identifying comment such as:

```text
/* chart-the-course/VERSION contact:https://github.com/[org]/chart-the-course */
```

If the project later uses a proxy, self-hosted Overpass, or commercial
provider, that server-side layer should set a descriptive upstream
`User-Agent`.

Default Overpass response cache TTL is 7 days for public Overpass usage. The UI
must provide an explicit "Refresh course data" action, rate-limited to prevent
repeated refetches. Operators using self-hosted or commercial providers may
configure a different TTL, with a minimum guardrail to prevent abuse.

Detailed tile-provider comparison and source notes are in
`docs/tile-provider-strategy.md`.

## Reference Projects

The following projects are study-only unless license compatibility or maintainer
permission is verified:

- `hacker-yardage`
- `openyardage-web`

Do not copy source code, UI structure, query text, generated assets, or
distinctive expressive implementation from unlicensed repositories. Generic
concepts, independently written Overpass queries, and independently derived
standard geometry math are allowed.

The `ace` project is AGPL-3.0 and may be used only for concept-level awareness.
Do not copy, modify, adapt, link, combine, incorporate, or distribute any `ace`
code in Chart the Course. Because Chart the Course is a network-delivered
browser app, incorporating AGPL-covered code can trigger AGPL Section 13
source-availability obligations for the combined or modified work.

## Legal and Trademark Disclaimers

Public docs, app surfaces, sample data, and generated exports must not imply
that Chart the Course is affiliated with, sponsored by, endorsed by, or approved
by any golf course, golf governing body, GPS app, launch-monitor vendor,
simulator platform, map provider, or other commercial brand unless that
relationship is stated expressly.

Avoid third-party brand names in product positioning unless the reference is
nominative, necessary, and reviewed. Reviewed means a logged maintainer decision
with rationale, source or brand being referenced, where the reference appears,
and why it is nominative and necessary.

Do not bundle prepackaged high-fidelity commercial course replicas, proprietary
course maps, commercial yardage-book artwork, or simulator course assets.
Real-course fixtures require a logged review of data source, permission or
open-data basis, attribution, brand/course-name risk, jurisdiction-specific
concerns, and why a real fixture is necessary instead of a synthetic course.

Any generated PDF, print output, source export, or downloadable artifact that
contains OSM-derived course geometry must include OSM attribution in the
artifact, including the full URL `https://www.openstreetmap.org/copyright` when
links are not available.

Baseline disclaimer text and monitored legal/trademark source URLs are recorded
in `docs/legal-disclaimers.md`.

````````

### SECURITY.md

SHA-256: `430b3fde9efec030a4284eb292560b0f2b4529e206c69be919d7fdf4c7bd7135`

````````text
# Security Policy

## Reporting Vulnerabilities

Use GitHub private vulnerability reporting for Chart the Course security reports
until the project has a verified, monitored security contact.

GitHub private vulnerability reporting was enabled for
`ajason13/chart-the-course` on 2026-06-05.

Do not publish `security@chartthecourse.app` or any other project email address
until that mailbox exists, is monitored, and has an owner. Setting a monitored
security contact before v1.0 is a launch-blocking milestone item.

## Supported Versions

Chart the Course has not shipped a public release yet. Security fixes apply to
the active `main` branch once the repository is published.

## Security Scope

Security review should include:

- Browser-only handling of course selections, notes, and player profiles.
- OpenStreetMap, Overpass, Nominatim, tile-provider, and PDF-export request
  flows.
- Dependency license and vulnerability gates.
- Generated PDF attribution and raw GIS source export behavior once PDF export
  ships.

The app must not rely on custom browser `User-Agent` headers for API identity.
Use app origin/referrer where available plus Overpass QL identifying comments.

````````

### src/overpass.ts

SHA-256: `c894f2f548e5668e91ac545751369e657509faa9531b7ba6b14af284461f3d37`

````````text
import packageMetadata from "../package.json";

export const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";
export const APP_VERSION = packageMetadata.version;
export const CONTACT_URL = "https://github.com/ajason13/chart-the-course";
export const OSM_COPYRIGHT_URL = "https://www.openstreetmap.org/copyright";

export type Bbox = {
  south: number;
  west: number;
  north: number;
  east: number;
};

export type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  tags?: Record<string, unknown>;
  bounds?: Partial<Bbox>;
  center?: { lat?: unknown; lon?: unknown };
  [key: string]: unknown;
};

export type OverpassResponse = {
  elements: OverpassElement[];
  [key: string]: unknown;
};

export type SourceMetadata = {
  query: string;
  endpoint: string;
  completedAt: string;
  bbox: string;
  copyrightUrl: string;
};

export type CachedResponse = {
  rawResponse: string;
  source: SourceMetadata;
};

export type RequestFailure =
  | { kind: "cancelled" }
  | { kind: "timeout" }
  | { kind: "network"; message: string }
  | { kind: "http"; status: number };

const DECIMAL_PATTERN = /^-?\d+(?:\.\d{1,7})?$/;
const ASCII_CONTROL_PATTERN = /[\u0000-\u001f\u007f]/;
const TRUSTED_COMMENT_PATTERN = /[\u0000-\u001f\u007f]|\*\//;
const NAME_ESCAPE_PATTERN = /["\\.*+?()[\]{}|^$]/;

function canonicalCoordinate(value: number): string {
  const normalized = Object.is(value, -0) ? 0 : value;
  return normalized.toFixed(7).replace(/\.?0+$/, "");
}

export function serializeBbox(bbox: Bbox): string {
  return [bbox.south, bbox.west, bbox.north, bbox.east]
    .map(canonicalCoordinate)
    .join(",");
}

export function parseBbox(fields: Record<keyof Bbox, string>):
  | { ok: true; bbox: Bbox; serialized: string }
  | { ok: false; field: keyof Bbox; message: string } {
  const keys: (keyof Bbox)[] = ["south", "west", "north", "east"];
  const values = {} as Bbox;

  for (const key of keys) {
    const input = fields[key].trim();
    if (!DECIMAL_PATTERN.test(input)) {
      return {
        ok: false,
        field: key,
        message: "Use decimal degrees with at most seven decimal places.",
      };
    }
    values[key] = Number(input);
  }

  if (values.south < -90 || values.south >= values.north || values.north > 90) {
    return { ok: false, field: "south", message: "South must be below north within -90 to 90." };
  }
  if (values.west < -180 || values.west >= values.east || values.east > 180) {
    return { ok: false, field: "west", message: "West must be below east within -180 to 180." };
  }
  if (Number((values.north - values.south).toFixed(7)) > 0.35) {
    return { ok: false, field: "north", message: "Latitude span cannot exceed 0.35 degrees." };
  }
  if (Number((values.east - values.west).toFixed(7)) > 0.35) {
    return { ok: false, field: "east", message: "Longitude span cannot exceed 0.35 degrees." };
  }

  return { ok: true, bbox: values, serialized: serializeBbox(values) };
}

export function parseCandidateBounds(value: unknown): Bbox | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const candidate = {
    south: source.south ?? source.minlat,
    west: source.west ?? source.minlon,
    north: source.north ?? source.maxlat,
    east: source.east ?? source.maxlon,
  };
  if (Object.values(candidate).some((coordinate) => typeof coordinate !== "number" || !Number.isFinite(coordinate))) {
    return null;
  }
  const bbox = candidate as Bbox;
  const parsed = parseBbox({
    south: canonicalCoordinate(bbox.south),
    west: canonicalCoordinate(bbox.west),
    north: canonicalCoordinate(bbox.north),
    east: canonicalCoordinate(bbox.east),
  });
  return parsed.ok ? parsed.bbox : null;
}

export function encodeCourseName(input: string): string {
  const trimmed = input.trim();
  if (ASCII_CONTROL_PATTERN.test(trimmed)) {
    throw new Error("Course name cannot contain control characters.");
  }
  if ([...trimmed].length > 200) {
    throw new Error("Course name cannot exceed 200 characters.");
  }
  return [...trimmed].map((character) => NAME_ESCAPE_PATTERN.test(character) ? `\\${character}` : character).join("");
}

export function validateTrustedIdentity(value: string): string {
  if (!value || TRUSTED_COMMENT_PATTERN.test(value)) {
    throw new Error("Invalid trusted query identity constant.");
  }
  return value;
}

function comment(purpose: "discovery" | "detail"): string {
  return `/* chart-the-course/${validateTrustedIdentity(APP_VERSION)} contact:${validateTrustedIdentity(CONTACT_URL)} purpose:golf-course-${purpose} */`;
}

export function buildDiscoveryQuery(bbox: Bbox, courseName: string): string {
  const bounds = serializeBbox(bbox);
  const encodedName = encodeCourseName(courseName);
  const nameBlock = encodedName
    ? `  nwr["leisure"="golf_course"]["name"~"${encodedName}",i](${bounds});\n`
    : "";
  return `${comment("discovery")}
[out:json][timeout:25][maxsize:536870912];
(
${nameBlock}  nwr["leisure"="golf_course"](${bounds});
);
out tags center bb;`;
}

export function buildDetailQuery(bbox: Bbox): string {
  const bounds = serializeBbox(bbox);
  return `${comment("detail")}
[out:json][timeout:45][maxsize:536870912];
(
  nwr["leisure"="golf_course"](${bounds});
  nwr["golf"~"^(hole|fairway|green|bunker|tee|water_hazard|lateral_water_hazard|rough|out_of_bounds|pin|cartpath)$"](${bounds});
  nwr["natural"~"^(water|wood|tree|tree_row|scrub)$"](${bounds});
  nwr["landuse"~"^(forest|reservoir|basin)$"](${bounds});
  nwr["water"~"^(pond|lake|basin|reservoir)$"](${bounds});
  nwr["waterway"](${bounds});
);
out body geom;`;
}

export function validateResponse(value: unknown): OverpassResponse | null {
  if (!value || typeof value !== "object" || !Array.isArray((value as OverpassResponse).elements)) {
    return null;
  }
  const response = value as OverpassResponse;
  const valid = response.elements.every((element) =>
    Boolean(element)
    && typeof element === "object"
    && ["node", "way", "relation"].includes(element.type)
    && Number.isInteger(element.id));
  return valid ? response : null;
}

export function classifyHttpStatus(status: number): "rate-limit" | "timeout" | "http" {
  if (status === 429) return "rate-limit";
  if (status === 504) return "timeout";
  return "http";
}

export function discoveryCacheKey(bbox: Bbox, courseName: string): string {
  return `ctc:overpass:v1:discovery:${serializeBbox(bbox)}:${encodeCourseName(courseName).toLocaleLowerCase("en-US")}`;
}

export function detailCacheKey(bbox: Bbox): string {
  return `ctc:overpass:v1:detail:${serializeBbox(bbox)}`;
}

export function readCache(storage: Storage, key: string):
  | { kind: "miss" }
  | { kind: "hit"; cached: CachedResponse; response: OverpassResponse }
  | { kind: "warning"; message: string } {
  try {
    const value = storage.getItem(key);
    if (value === null) return { kind: "miss" };
    const cached = JSON.parse(value) as CachedResponse;
    if (!cached || typeof cached.rawResponse !== "string" || !cached.source || typeof cached.source.query !== "string") {
      return { kind: "warning", message: "Session cache entry was invalid and was ignored." };
    }
    const response = validateResponse(JSON.parse(cached.rawResponse));
    return response
      ? { kind: "hit", cached, response }
      : { kind: "warning", message: "Session cache entry was invalid and was ignored." };
  } catch {
    return { kind: "warning", message: "Session cache is unavailable or contains invalid data." };
  }
}

export function writeCache(storage: Storage, key: string, cached: CachedResponse): string | null {
  try {
    storage.setItem(key, JSON.stringify(cached));
    return null;
  } catch {
    return "Result displayed, but session cache could not be updated.";
  }
}

export async function fetchOverpass(
  query: string,
  timeoutSeconds: number,
  signal: AbortSignal,
): Promise<{ ok: true; rawResponse: string } | { ok: false; failure: RequestFailure }> {
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  const timeout = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, (timeoutSeconds + 5) * 1000);

  try {
    const response = await fetch(OVERPASS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({ data: query }),
      signal: controller.signal,
    });
    if (!response.ok) return { ok: false, failure: { kind: "http", status: response.status } };
    return { ok: true, rawResponse: await response.text() };
  } catch (error) {
    if (timedOut) return { ok: false, failure: { kind: "timeout" } };
    if (signal.aborted || (error instanceof DOMException && error.name === "AbortError")) {
      return { ok: false, failure: { kind: "cancelled" } };
    }
    return { ok: false, failure: { kind: "network", message: error instanceof Error ? error.message : "Network request failed." } };
  } finally {
    window.clearTimeout(timeout);
    signal.removeEventListener("abort", abort);
  }
}

export function sourceMetadata(query: string, bbox: Bbox): SourceMetadata {
  return {
    query,
    endpoint: OVERPASS_ENDPOINT,
    completedAt: new Date().toISOString(),
    bbox: serializeBbox(bbox),
    copyrightUrl: OSM_COPYRIGHT_URL,
  };
}

````````

### src/overpass.test.ts

SHA-256: `ce722d97552be264f163dcb2d0e5b4ab77df82fcdf1b84b6b67e64a084111244`

````````text
import {
  buildDetailQuery,
  buildDiscoveryQuery,
  classifyHttpStatus,
  detailCacheKey,
  discoveryCacheKey,
  encodeCourseName,
  parseBbox,
  parseCandidateBounds,
  readCache,
  serializeBbox,
  sourceMetadata,
  validateResponse,
  validateTrustedIdentity,
  writeCache,
  type Bbox,
} from "./overpass";

const bbox: Bbox = { south: 37.3, west: -122.1, north: 37.5, east: -121.9 };

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  length = 0;
  clear() { this.values.clear(); this.length = 0; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); this.length = this.values.size; }
  setItem(key: string, value: string) { this.values.set(key, value); this.length = this.values.size; }
}

describe("Overpass query construction", () => {
  it("builds the exact reviewed discovery query", () => {
    expect(buildDiscoveryQuery(bbox, "Pine.* Hills")).toMatchInlineSnapshot(`
      "/* chart-the-course/0.0.0 contact:https://github.com/ajason13/chart-the-course purpose:golf-course-discovery */
      [out:json][timeout:25][maxsize:536870912];
      (
        nwr["leisure"="golf_course"]["name"~"Pine\\.\\* Hills",i](37.3,-122.1,37.5,-121.9);
        nwr["leisure"="golf_course"](37.3,-122.1,37.5,-121.9);
      );
      out tags center bb;"
    `);
    expect(buildDiscoveryQuery(bbox, "   ")).not.toContain('["name"~');
  });

  it("builds the exact reviewed detail query", () => {
    expect(buildDetailQuery(bbox)).toMatchInlineSnapshot(`
      "/* chart-the-course/0.0.0 contact:https://github.com/ajason13/chart-the-course purpose:golf-course-detail */
      [out:json][timeout:45][maxsize:536870912];
      (
        nwr["leisure"="golf_course"](37.3,-122.1,37.5,-121.9);
        nwr["golf"~"^(hole|fairway|green|bunker|tee|water_hazard|lateral_water_hazard|rough|out_of_bounds|pin|cartpath)$"](37.3,-122.1,37.5,-121.9);
        nwr["natural"~"^(water|wood|tree|tree_row|scrub)$"](37.3,-122.1,37.5,-121.9);
        nwr["landuse"~"^(forest|reservoir|basin)$"](37.3,-122.1,37.5,-121.9);
        nwr["water"~"^(pond|lake|basin|reservoir)$"](37.3,-122.1,37.5,-121.9);
        nwr["waterway"](37.3,-122.1,37.5,-121.9);
      );
      out body geom;"
    `);
  });

  it("encodes names in one pass and constrains identity constants", () => {
    expect(encodeCourseName('  "a\\.*+?()[]{}|^$*/é"  ')).toBe('\\"a\\\\\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\^\\$\\*/é\\"');
    expect(encodeCourseName("*/ remains text")).toBe("\\*/ remains text");
    expect(() => encodeCourseName("bad\nquery")).toThrow(/control/);
    expect(() => encodeCourseName("x".repeat(201))).toThrow(/200/);
    expect([...encodeCourseName("é".repeat(200))]).toHaveLength(200);
    expect(validateTrustedIdentity("0.0.0")).toBe("0.0.0");
    expect(() => validateTrustedIdentity("bad*/comment")).toThrow();
    expect(() => validateTrustedIdentity("bad\ncomment")).toThrow();
  });
});

describe("bbox validation", () => {
  it("accepts canonical bounded decimal input and normalizes negative zero", () => {
    const result = parseBbox({ south: "-0", west: "-0.0000000", north: "0.35", east: "0.3500000" });
    expect(result).toEqual({
      ok: true,
      bbox: { south: -0, west: -0, north: 0.35, east: 0.35 },
      serialized: "0,0,0.35,0.35",
    });
    expect(serializeBbox(bbox)).toBe("37.3,-122.1,37.5,-121.9");
  });

  it.each(["1e-2", "1,2", "Infinity", "NaN", "1.12345678"])("rejects invalid syntax %s", (south) => {
    expect(parseBbox({ south, west: "0", north: "1", east: "1" }).ok).toBe(false);
  });

  it("handles span, polar, ordering, and dateline edges", () => {
    expect(parseBbox({ south: "89.65", west: "10", north: "90", east: "10.35" }).ok).toBe(true);
    expect(parseBbox({ south: "37.0", west: "-122.1", north: "37.35", east: "-121.75" }).ok).toBe(true);
    expect(parseBbox({ south: "0", west: "0", north: "0.3500001", east: "0.35" }).ok).toBe(false);
    expect(parseBbox({ south: "1", west: "0", north: "0", east: "0.1" }).ok).toBe(false);
    expect(parseBbox({ south: "0", west: "179.9", north: "0.1", east: "-179.9" }).ok).toBe(false);
    expect(parseCandidateBounds({ minlat: 37.3, minlon: -122.1, maxlat: 37.5, maxlon: -121.9 })).toEqual(bbox);
    expect(parseCandidateBounds({ minlat: 37.3 })).toBeNull();
  });
});

describe("response, cache, and HTTP classification", () => {
  const rawResponse = '{"elements":[{"type":"way","id":42,"tags":{"name":"Test"}}]}';

  it("validates only the minimum raw entity shape and classifies empty results", () => {
    expect(validateResponse({ elements: [] })).toEqual({ elements: [] });
    expect(validateResponse(JSON.parse(rawResponse))?.elements).toHaveLength(1);
    expect(validateResponse({ elements: [{ type: "area", id: 1 }] })).toBeNull();
    expect(validateResponse({ elements: [{ type: "node", id: 1.5 }] })).toBeNull();
    expect(validateResponse({ nope: [] })).toBeNull();
  });

  it("generates deterministic distinct cache keys", () => {
    expect(discoveryCacheKey(bbox, " Pine.* ")).toBe("ctc:overpass:v1:discovery:37.3,-122.1,37.5,-121.9:pine\\.\\*");
    expect(detailCacheKey(bbox)).toBe("ctc:overpass:v1:detail:37.3,-122.1,37.5,-121.9");
  });

  it("round-trips exact raw text and reports corrupt or failed storage without eviction", () => {
    const storage = new MemoryStorage();
    const cached = { rawResponse, source: sourceMetadata("query", bbox) };
    expect(writeCache(storage, "key", cached)).toBeNull();
    expect(readCache(storage, "key")).toMatchObject({ kind: "hit", cached: { rawResponse } });
    storage.setItem("corrupt", "{");
    expect(readCache(storage, "corrupt").kind).toBe("warning");
    expect(storage.getItem("corrupt")).toBe("{");

    const failed = new MemoryStorage();
    failed.setItem = () => { throw new Error("quota"); };
    expect(writeCache(failed, "key", cached)).toMatch(/could not/);
    failed.getItem = () => { throw new Error("unavailable"); };
    expect(readCache(failed, "key").kind).toBe("warning");
  });

  it("classifies HTTP status without retry policy", () => {
    expect(classifyHttpStatus(429)).toBe("rate-limit");
    expect(classifyHttpStatus(504)).toBe("timeout");
    expect(classifyHttpStatus(500)).toBe("http");
  });
});

````````

### src/App.tsx

SHA-256: `ea044e66054de434b8f693fc358b53db22c009868e975600e32248346665503b`

````````text
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { HoleMap } from "./HoleMap";
import { normalizeGolfCourse } from "./normalize";
import {
  buildDetailQuery,
  buildDiscoveryQuery,
  detailCacheKey,
  discoveryCacheKey,
  fetchOverpass,
  OSM_COPYRIGHT_URL,
  parseBbox,
  parseCandidateBounds,
  readCache,
  sourceMetadata,
  validateResponse,
  writeCache,
  type Bbox,
  type CachedResponse,
  type OverpassElement,
  type OverpassResponse,
  type RequestFailure,
} from "./overpass";
import {
  PROJECT_FILENAME,
  PROJECT_MAX_BYTES,
  PROJECT_MIME,
  emptyProject,
  parseProjectText,
  projectMatchErrors,
  serializeProject,
  type HoleStateV1,
  type ValidationError,
} from "./project";
import type { SourceKey } from "./normalize";

type ViewState =
  | { kind: "idle" }
  | { kind: "invalid"; message: string }
  | { kind: "loading"; mode: "discovery" | "detail" }
  | { kind: "cancelled" }
  | { kind: "empty"; mode: "discovery" | "detail"; cached: boolean; source: CachedResponse["source"] }
  | { kind: "success"; mode: "discovery" | "detail"; cached: boolean; response: OverpassResponse; source: CachedResponse["source"] }
  | { kind: "rate-limit" }
  | { kind: "timeout" }
  | { kind: "network"; message: string }
  | { kind: "http"; status: number }
  | { kind: "parse" }
  | { kind: "shape" };

const INITIAL_FIELDS = { south: "", west: "", north: "", east: "" };

function stateMessage(state: ViewState): string {
  switch (state.kind) {
    case "idle": return "Enter a bounded location and submit when ready.";
    case "invalid": return state.message;
    case "loading": return `Loading ${state.mode} results.`;
    case "cancelled": return "Request cancelled.";
    case "empty": return `No ${state.mode} results were returned${state.cached ? " from session cache" : ""}.`;
    case "success": return `${state.response.elements.length} raw ${state.mode} entities loaded${state.cached ? " from session cache" : ""}.`;
    case "rate-limit": return "Overpass rate-limited this request. Try again later.";
    case "timeout": return "The request timed out. Narrow the area or try again later.";
    case "network": return `Network request failed: ${state.message}`;
    case "http": return `Overpass returned HTTP ${state.status}.`;
    case "parse": return "Overpass returned malformed JSON.";
    case "shape": return "Overpass returned JSON with an invalid entity shape.";
  }
}

function elementName(element: OverpassElement): string {
  const name = element.tags?.name;
  return typeof name === "string" && name.trim() ? name : `Unnamed ${element.type} ${element.id}`;
}

function EntitySummary({ response }: { response: OverpassResponse }) {
  const counts = response.elements.reduce<Record<string, number>>((result, element) => {
    result[element.type] = (result[element.type] ?? 0) + 1;
    return result;
  }, {});
  return (
    <dl className="entity-summary" aria-label="Raw entity summary">
      {["node", "way", "relation"].map((type) => (
        <div key={type}><dt>{type}s</dt><dd>{counts[type] ?? 0}</dd></div>
      ))}
    </dl>
  );
}

export function App() {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [courseName, setCourseName] = useState("");
  const [state, setState] = useState<ViewState>({ kind: "idle" });
  const [warning, setWarning] = useState("");
  const [invalidField, setInvalidField] = useState<keyof Bbox | "courseName" | null>(null);
  const [selectedHoleKey, setSelectedHoleKey] = useState("");
  const [projectHoles, setProjectHoles] = useState<Partial<Record<SourceKey, HoleStateV1>>>({});
  const [projectErrors, setProjectErrors] = useState<ValidationError[]>([]);
  const [projectMessage, setProjectMessage] = useState("");
  const requestIdentity = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const fieldRefs = useRef<Record<keyof Bbox, HTMLInputElement | null>>({
    south: null, west: null, north: null, east: null,
  });
  const courseNameRef = useRef<HTMLInputElement>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const projectNotice = useRef<HTMLParagraphElement>(null);
  const projectErrorHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => () => {
    requestIdentity.current += 1;
    controller.current?.abort();
  }, []);

  const loading = state.kind === "loading";
  const normalized = useMemo(() =>
    state.kind === "success" && state.mode === "detail"
      ? normalizeGolfCourse(state.response, state.source)
      : null, [state]);

  useEffect(() => {
    setSelectedHoleKey(normalized?.holes[0]?.source.sourceKey ?? "");
    setProjectHoles({});
    setProjectErrors([]);
    setProjectMessage("");
  }, [normalized]);

  const courseSourceKey = normalized?.courseCandidates[0]?.source.sourceKey ?? null;
  const holeKeys = normalized?.holes.map(({ source }) => source.sourceKey) ?? [];

  function holeProject(key: SourceKey): HoleStateV1 {
    return projectHoles[key] ?? { targets: [], carries: [] };
  }

  function setHoleProject(key: SourceKey, project: HoleStateV1) {
    setProjectHoles((current) => ({ ...current, [key]: project }));
    setProjectMessage("");
  }

  function exportProject() {
    if (!courseSourceKey) return;
    const project = emptyProject(courseSourceKey);
    project.holes = projectHoles;
    const blob = new Blob([serializeProject(project)], { type: PROJECT_MIME });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = PROJECT_FILENAME;
    document.body.appendChild(anchor);
    anchor.click();
    requestAnimationFrame(() => {
      URL.revokeObjectURL(url);
      anchor.remove();
    });
    setProjectMessage("Project export started.");
  }

  async function importProject(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !courseSourceKey) return;
    const hasState = Object.values(projectHoles).some((hole) => hole && (hole.targets.length > 0 || hole.carries.length > 0));
    if (hasState && !window.confirm("Importing will replace your current project. Continue?")) {
      event.target.value = "";
      importInput.current?.focus();
      return;
    }
    setProjectErrors([]);
    setProjectMessage("");
    if (file.size > PROJECT_MAX_BYTES) {
      setProjectErrors([{ code: "OUT_OF_RANGE", path: "$", message: "File exceeds 512 KiB limit." }]);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      setProjectErrors([{ code: "INVALID_JSON", path: "$", message: "File could not be read." }]);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    const validated = parseProjectText(text);
    if (!validated.ok) {
      setProjectErrors(validated.errors);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    const mismatches = projectMatchErrors(validated.project, courseSourceKey, holeKeys);
    if (mismatches.length > 0) {
      setProjectErrors(mismatches);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    setProjectHoles(validated.project.holes);
    setProjectMessage("Project imported successfully.");
    event.target.value = "";
    requestAnimationFrame(() => projectNotice.current?.focus());
  }

  function setField(field: keyof Bbox, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
  }

  function classifyFailure(failure: RequestFailure) {
    if (failure.kind === "cancelled") setState({ kind: "cancelled" });
    else if (failure.kind === "timeout" || (failure.kind === "http" && failure.status === 504)) setState({ kind: "timeout" });
    else if (failure.kind === "http" && failure.status === 429) setState({ kind: "rate-limit" });
    else if (failure.kind === "http") setState({ kind: "http", status: failure.status });
    else setState({ kind: "network", message: failure.message });
  }

  async function runRequest(mode: "discovery" | "detail", bbox: Bbox, query: string, cacheKey: string, timeout: number) {
    setWarning("");
    let cache;
    try {
      cache = readCache(window.sessionStorage, cacheKey);
    } catch {
      cache = { kind: "warning" as const, message: "Session cache is unavailable." };
    }
    if (cache.kind === "hit") {
      setState(cache.response.elements.length
        ? { kind: "success", mode, cached: true, response: cache.response, source: cache.cached.source }
        : { kind: "empty", mode, cached: true, source: cache.cached.source });
      return;
    }
    if (cache.kind === "warning") setWarning(cache.message);

    const id = ++requestIdentity.current;
    const activeController = new AbortController();
    controller.current = activeController;
    setState({ kind: "loading", mode });
    const result = await fetchOverpass(query, timeout, activeController.signal);
    if (requestIdentity.current !== id) return;
    controller.current = null;

    if (!result.ok) {
      classifyFailure(result.failure);
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(result.rawResponse);
    } catch {
      setState({ kind: "parse" });
      return;
    }
    const response = validateResponse(parsed);
    if (!response) {
      setState({ kind: "shape" });
      return;
    }
    const source = sourceMetadata(query, bbox);
    let cacheWarning: string | null;
    try {
      cacheWarning = writeCache(window.sessionStorage, cacheKey, { rawResponse: result.rawResponse, source });
    } catch {
      cacheWarning = "Result displayed, but session cache is unavailable.";
    }
    if (cacheWarning) setWarning(cacheWarning);
    setState(response.elements.length
      ? { kind: "success", mode, cached: false, response, source }
      : { kind: "empty", mode, cached: false, source });
  }

  function submitDiscovery(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setInvalidField(null);
    const parsed = parseBbox(fields);
    if (!parsed.ok) {
      setState({ kind: "invalid", message: parsed.message });
      setInvalidField(parsed.field);
      requestAnimationFrame(() => fieldRefs.current[parsed.field]?.focus());
      return;
    }
    let query;
    try {
      query = buildDiscoveryQuery(parsed.bbox, courseName);
    } catch (error) {
      setState({ kind: "invalid", message: error instanceof Error ? error.message : "Invalid course name." });
      setInvalidField("courseName");
      requestAnimationFrame(() => courseNameRef.current?.focus());
      return;
    }
    void runRequest("discovery", parsed.bbox, query, discoveryCacheKey(parsed.bbox, courseName), 25);
  }

  function loadDetail(element: OverpassElement) {
    const bbox = parseCandidateBounds(element.bounds);
    if (!bbox || loading) return;
    void runRequest("detail", bbox, buildDetailQuery(bbox), detailCacheKey(bbox), 45);
  }

  function cancel() {
    requestIdentity.current += 1;
    controller.current?.abort();
    controller.current = null;
    setState({ kind: "cancelled" });
    requestAnimationFrame(() => submitButton.current?.focus());
  }

  const showsOsmResult = state.kind === "success" || state.kind === "empty";
  const errorState = ["invalid", "rate-limit", "timeout", "network", "http", "parse", "shape"].includes(state.kind);

  return (
    <main className="shell">
      <header>
        <p className="eyebrow">Open-source yardage book builder</p>
        <h1>Chart the Course</h1>
        <p className="lede">Search raw OpenStreetMap golf-course entities inside a small manually entered bounding box.</p>
      </header>

      <section className="search-panel" aria-labelledby="search-title">
        <h2 id="search-title">Course discovery</h2>
        <form onSubmit={submitDiscovery}>
          <label>Course name <span>(optional)</span>
            <input ref={courseNameRef} name="courseName" value={courseName} onChange={(event) => setCourseName(event.target.value)}
              aria-invalid={invalidField === "courseName"} />
          </label>
          <fieldset>
            <legend>Manual location bounds in decimal degrees</legend>
            <div className="coordinate-grid">
              {(Object.keys(fields) as (keyof Bbox)[]).map((field) => (
                <label key={field}>{field[0].toUpperCase() + field.slice(1)}
                  <input ref={(node) => { fieldRefs.current[field] = node; }} name={field} inputMode="decimal"
                    value={fields[field]} onChange={(event) => setField(field, event.target.value)}
                    aria-invalid={invalidField === field} placeholder={field === "south" ? "37.30" : field === "west" ? "-122.10" : field === "north" ? "37.50" : "-121.90"} />
                </label>
              ))}
            </div>
            <p className="hint">South, west, north, east. Each span must be 0.35 degrees or less.</p>
          </fieldset>
          <div className="actions">
            <button ref={submitButton} type="submit" disabled={loading}>Search courses</button>
            <button className="secondary" type="button" onClick={cancel} disabled={!loading}>Cancel request</button>
          </div>
        </form>
      </section>

      <section className={`status ${errorState ? "error" : ""}`} aria-live={errorState ? "assertive" : "polite"} aria-atomic="true">
        <strong>Status</strong>
        <p>{stateMessage(state)}</p>
        {warning && <p className="warning">{warning}</p>}
      </section>

      {state.kind === "success" && (
        <section className="results" aria-labelledby="results-title">
          <div>
            <p className="eyebrow">{state.mode} response</p>
            <h2 id="results-title">Raw OSM entities</h2>
          </div>
          <EntitySummary response={state.response} />
          {state.mode === "discovery" && (
            <ul className="candidate-list">
              {state.response.elements.map((element) => {
                const bounds = parseCandidateBounds(element.bounds);
                return (
                  <li key={`${element.type}-${element.id}`}>
                    <div><strong>{elementName(element)}</strong><span>{element.type} {element.id}</span></div>
                    <button type="button" disabled={!bounds || loading} onClick={() => loadDetail(element)}>
                      {bounds ? "Load raw detail" : "Detail unavailable"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {state.mode === "detail" && (
            <>
              <ul className="raw-list">
                {state.response.elements.map((element) => <li key={`${element.type}-${element.id}`}><code>{element.type}/{element.id}</code> {elementName(element)}</li>)}
              </ul>
              {normalized && normalized.holes.length > 0 ? (
                <section className="map-workspace" aria-labelledby="map-workspace-title">
                  <div className="map-selection">
                    <h3 id="map-workspace-title">Selected-hole map</h3>
                    <label>Hole
                      <select value={selectedHoleKey} onChange={(event) => setSelectedHoleKey(event.target.value)}>
                        {normalized.holes.map((hole) => (
                          <option key={hole.source.sourceKey} value={hole.source.sourceKey}>
                            {hole.number === null ? hole.source.sourceKey : `Hole ${hole.number}`}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  {normalized.holes.filter((hole) => hole.source.sourceKey === selectedHoleKey).map((hole) => (
                    <HoleMap key={hole.source.sourceKey} hole={hole} warnings={normalized.warnings} source={normalized.source}
                      project={holeProject(hole.source.sourceKey)}
                      onProjectChange={(project) => setHoleProject(hole.source.sourceKey, project)} />
                  ))}
                  <section className="project-io" aria-labelledby="project-io-title">
                    <h3 id="project-io-title">Local project file</h3>
                    <p className="hint">Project files contain user-authored targets and carry settings only. Import replaces current project state when valid.</p>
                    <div className="actions">
                      <button type="button" onClick={exportProject} disabled={!courseSourceKey}>Export project</button>
                      <label className="file-label">Import project file (.json)
                        <input ref={importInput} type="file" accept=".json,application/json" onChange={(event) => void importProject(event)} />
                      </label>
                    </div>
                    {projectMessage && <p ref={projectNotice} tabIndex={-1} aria-live="polite">{projectMessage}</p>}
                    {projectErrors.length > 0 && <div className="project-errors" role="alert">
                      <h4 ref={projectErrorHeading} tabIndex={-1}>Import failed - {projectErrors.length} error(s)</h4>
                      <ul>{projectErrors.map((error, index) => <li key={`${error.code}-${error.path}-${index}`}>
                        <strong>{error.code}</strong>: {error.message} <code>{error.path}</code>
                      </li>)}</ul>
                    </div>}
                  </section>
                </section>
              ) : <p className="map-empty" role="status">No normalized holes are available to render.</p>}
            </>
          )}
          <details>
            <summary>Source diagnostics</summary>
            <dl className="diagnostics">
              <div><dt>Endpoint</dt><dd>{state.source.endpoint}</dd></div>
              <div><dt>Bbox</dt><dd>{state.source.bbox}</dd></div>
              <div><dt>Completed</dt><dd>{state.source.completedAt}</dd></div>
              <div><dt>Query</dt><dd><pre>{state.source.query}</pre></dd></div>
            </dl>
          </details>
        </section>
      )}

      {showsOsmResult && (
        <p className="attribution">Data © OpenStreetMap contributors, available under ODbL. <a href={OSM_COPYRIGHT_URL}>OpenStreetMap copyright and license</a>. Session cache does not satisfy later source-export obligations.</p>
      )}
    </main>
  );
}

````````

### test/e2e/app.spec.ts

SHA-256: `86e9c1bfbae431f56430ef93e585f8b1778a6e1a6a7048cde4eb74b89438f1e7`

````````text
import { expect, test, type Page, type Route } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import ctc006Detail from "../../fixtures/overpass/synthetic-golf-course-ctc006.json" with { type: "json" };

const endpoint = "https://overpass-api.de/api/interpreter";
const discovery = {
  elements: [
    {
      type: "way",
      id: 9000000001,
      bounds: { minlat: 35, minlon: -80, maxlat: 35.01, maxlon: -79.99 },
      tags: { leisure: "golf_course", name: "Synthetic Municipal Course" },
    },
    {
      type: "node",
      id: 9000000002,
      tags: { leisure: "golf_course", name: "Bounds unavailable" },
    },
  ],
};
const syntheticDetail = {
  elements: [
    discovery.elements[0],
    { type: "way", id: 9000000101, tags: { golf: "hole", ref: "1" } },
    { type: "node", id: 9000000201, tags: { golf: "tee", ref: "1" } },
  ],
};

async function isolateNetwork(page: Page, overpassHandler?: (route: Route) => Promise<void> | void) {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (["127.0.0.1", "localhost"].includes(url.hostname)) {
      await route.continue();
    } else if (route.request().url() === endpoint && overpassHandler) {
      await overpassHandler(route);
    } else {
      await route.abort("blockedbyclient");
      throw new Error(`Unexpected external request: ${route.request().url()}`);
    }
  });
}

async function fillBounds(page: Page) {
  await page.getByLabel("South").fill("35");
  await page.getByLabel("West").fill("-80");
  await page.getByLabel("North").fill("35.01");
  await page.getByLabel("East").fill("-79.99");
}

async function assertAxe(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
}

test("discovers candidates, loads detail explicitly, caches it, and shows attribution", async ({ page }) => {
  let discoveryRequests = 0;
  let detailRequests = 0;
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    expect(route.request().method()).toBe("POST");
    if (query.includes("purpose:golf-course-detail")) {
      detailRequests += 1;
      await route.fulfill({ json: syntheticDetail });
    } else {
      discoveryRequests += 1;
      await route.fulfill({ json: discovery });
    }
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("Synthetic.*");
  await page.getByRole("button", { name: "Search courses" }).click();

  await expect(page.getByText("Synthetic Municipal Course")).toBeVisible();
  await expect(page.getByRole("button", { name: "Detail unavailable" })).toBeDisabled();
  await expect(page.getByText(/Data © OpenStreetMap contributors/)).toBeVisible();
  expect(discoveryRequests).toBe(1);
  expect(detailRequests).toBe(0);

  await page.getByRole("button", { name: "Load raw detail" }).click();
  await expect(page.getByText(/raw detail entities loaded/)).toBeVisible();
  await expect(page.getByText("way/9000000001")).toBeVisible();
  expect(detailRequests).toBe(1);

  await page.reload();
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("Synthetic.*");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/raw discovery entities loaded from session cache/)).toBeVisible();
  expect(discoveryRequests).toBe(1);
});

test("makes no requests on keystrokes, blocks duplicate submit, and cancels explicitly", async ({ page }) => {
  let requests = 0;
  await isolateNetwork(page, async (route) => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({ json: discovery });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("No automatic query");
  expect(requests).toBe(0);

  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByRole("button", { name: "Search courses" })).toBeDisabled();
  expect(requests).toBe(1);
  await page.getByRole("button", { name: "Cancel request" }).click();
  await expect(page.getByText("Request cancelled.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Search courses" })).toBeFocused();
  await page.waitForTimeout(600);
  await expect(page.getByText("Request cancelled.")).toBeVisible();
  expect(requests).toBe(1);
});

test("validates input before requests and focuses the first invalid field", async ({ page }) => {
  let requests = 0;
  await isolateNetwork(page, () => { requests += 1; });
  await page.goto("/");
  await page.getByLabel("South").fill("1e2");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/Use decimal degrees/)).toBeVisible();
  await expect(page.getByLabel("South")).toBeFocused();
  expect(requests).toBe(0);
});

for (const scenario of [
  { name: "rate limit", status: 429, expected: /rate-limited/ },
  { name: "gateway timeout", status: 504, expected: /timed out/ },
  { name: "generic HTTP", status: 500, expected: /HTTP 500/ },
]) {
  test(`shows ${scenario.name} state without retry or failover`, async ({ page }) => {
    let requests = 0;
    await isolateNetwork(page, async (route) => {
      requests += 1;
      await route.fulfill({ status: scenario.status, body: "error" });
    });
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect(page.getByText(scenario.expected)).toBeVisible();
    if (scenario.status === 429) {
      await expect(page.locator(".status")).toHaveAttribute("aria-live", "assertive");
    }
    expect(requests).toBe(1);
  });
}

for (const scenario of [
  { name: "malformed JSON", body: "{", expected: /malformed JSON/ },
  { name: "invalid shape", body: '{"elements":[{"type":"area","id":1}]}', expected: /invalid entity shape/ },
  { name: "empty response", body: '{"elements":[]}', expected: /No discovery results/ },
]) {
  test(`shows ${scenario.name} state`, async ({ page }) => {
    await isolateNetwork(page, async (route) => route.fulfill({ body: scenario.body, contentType: "application/json" }));
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect(page.getByText(scenario.expected)).toBeVisible();
  });
}

test("shows a network failure without retry", async ({ page }) => {
  let requests = 0;
  await isolateNetwork(page, async (route) => {
    requests += 1;
    await route.abort("internetdisconnected");
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/Network request failed/)).toBeVisible();
  expect(requests).toBe(1);
});

test("supports keyboard flow, mobile layout, and axe scans across states", async ({ page }) => {
  let resolveRequest: (() => void) | undefined;
  await isolateNetwork(page, async (route) => {
    await new Promise<void>((resolve) => { resolveRequest = resolve; });
    await route.fulfill({ json: discovery });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await assertAxe(page);
  await fillBounds(page);
  await page.getByLabel("East").press("Enter");
  await expect(page.getByText("Loading discovery results.")).toBeVisible();
  await assertAxe(page);
  resolveRequest?.();
  await expect(page.getByText("Synthetic Municipal Course")).toBeVisible();
  await assertAxe(page);
  const detailButton = page.getByRole("button", { name: "Load raw detail" });
  await expect(detailButton).toBeVisible();
  expect(await detailButton.evaluate((button) => button.getBoundingClientRect().right <= window.innerWidth)).toBe(true);

  await page.getByLabel("South").fill("bad");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/Use decimal degrees/)).toBeVisible();
  await assertAxe(page);
});

test("accessibility oracle detects a known injected violation", async ({ page }) => {
  await isolateNetwork(page);
  await page.goto("/");
  await page.locator("main").evaluate((main) => {
    main.insertAdjacentHTML("beforeend", '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==">');
  });
  const results = await new AxeBuilder({ page }).include("main").analyze();
  expect(results.violations.map((violation) => violation.id)).toContain("image-alt");
});

test("renders and measures the selected hole with pointer, keyboard, mobile, and attribution support", async ({ page }) => {
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Load raw detail" }).click();

  const map = page.getByTestId("hole-vector-map");
  await expect(map).toBeVisible();
  await expect(page.getByText("Course data © OpenStreetMap contributors.")).toBeVisible();
  for (const layer of ["vegetation", "generic-water", "golf-water", "rough", "fairway", "bunker", "green", "tee", "route", "measurement"]) {
    await expect(map.locator(`[data-layer="${layer}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-layer="vegetation"] circle')).toHaveCount(0);
  expect(await map.evaluate((element) => element.getBoundingClientRect().right <= window.innerWidth)).toBe(true);

  await map.click({ position: { x: 60, y: 60 } });
  await expect(page.getByText("Select the second point.")).toBeVisible();
  await map.click({ position: { x: 250, y: 180 } });
  await expect(page.getByText(/^Distance: \d+ yd \/ \d+ m$/)).toBeVisible();
  await map.click({ position: { x: 150, y: 120 } });
  await expect(page.getByText("Select the second point.")).toBeVisible();

  await map.focus();
  await map.press("Escape");
  await expect(page.getByText("No measurement selected.")).toBeVisible();
  await map.press("ArrowRight");
  await map.press("Enter");
  await map.press("Shift+ArrowDown");
  await map.press("Enter");
  await expect(page.getByText(/^Distance: \d+ yd \/ \d+ m$/)).toBeVisible();
  await expect(map).toBeFocused();
  await assertAxe(page);
});

test("manages targets, carry arcs, and strict local project exchange", async ({ page }) => {
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Load raw detail" }).click();

  const map = page.getByTestId("hole-vector-map");
  await page.getByRole("button", { name: "Add target" }).click();
  await map.click({ position: { x: 180, y: 180 } });
  await expect(page.locator('input[value="Target 1"]')).toBeVisible();
  await expect(map.locator('[data-layer="targets"] [data-target-id]')).toHaveCount(1);

  await page.getByRole("button", { name: "Add carry" }).click();
  await expect(map.locator('[data-layer="carry-arcs"] [data-carry-id]')).toHaveCount(1);
  await expect(map.locator('[data-layer="carry-arcs"] text')).toHaveText("150 yd");
  await expect(page.getByText(/outside the map view/)).toBeVisible();

  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("button", { name: "Undo delete" })).toBeVisible();
  await page.getByRole("button", { name: "Undo delete" }).click();
  await expect(page.locator('input[value="Target 1"]')).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export project" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("chart-the-course-project.json");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByLabel("Import project file (.json)").setInputFiles("fixtures/projects/synthetic-project-wrong-course.json");
  await expect(page.getByRole("alert")).toContainText("COURSE_MISMATCH");
  await expect(page.locator('input[value="Target 1"]')).toBeVisible();
  await expect(page.getByText("Course data © OpenStreetMap contributors.")).toBeVisible();
  await assertAxe(page);
});

````````
