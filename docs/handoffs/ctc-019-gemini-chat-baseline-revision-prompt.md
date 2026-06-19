# CTC-019 Gemini Chat corrected baseline revision prompt

Use Gemini Chat in Deep Research mode only if it will follow the requested
output format. This is a **revision-only** prompt. Do not produce another broad
research report, product-management plan, user-story matrix, implementation
task database, or generic roadmap.

## Role

You are revising the CTC-019 durable Overpass cache/request-policy
specification after Codex rejected the prior Gemini Chat response.

Your job is to produce one corrected specification baseline that Codex can
critically review for possible advancement to Claude QA planning.

## Required attachments

Gemini Chat currently accepts at most 10 file uploads per prompt. Attach only
this required first batch before starting Deep Research, and use these files as
source-of-truth context:

- `CONTEXT.md`
- `docs/handoffs/ctc-019-gemini-chat-spec-review.md`
- `docs/handoffs/ctc-019-antigravity-spec-review.md`
- `docs/handoffs/ctc-019-gemini-plan-correction.md`
- `docs/overpass-query-contract.md`
- `ATTRIBUTION.md`
- `SECURITY.md`
- `src/overpass.ts`
- `src/overpass.test.ts`
- `src/App.tsx`

Do not upload more than 10 files in the initial prompt. If Gemini asks for
additional repository context, use a second upload batch with only the specific
files it requests. Preferred follow-up references are:

- `test/e2e/app.spec.ts`
- `package.json`
- `docs/handoffs/ctc-019-antigravity-research-spec.md`
- `docs/experiments/ctc-014-vector-pdf-evaluation.md`
- `package-lock.json`
- `sbom.json`

Do not ask for pasted full-file contents. If a needed detail is missing from
the initial 10-file batch and a follow-up upload is not available, state the
missing detail and choose the conservative repository-compatible default.

## Non-negotiable repository contracts

The corrected baseline must preserve these contracts:

- Existing cache keys:
  - `discoveryCacheKey(bbox, courseName)`
  - `detailCacheKey(bbox)`
- Existing bbox serialization through `serializeBbox(bbox)`.
- Exact Overpass QL query preservation, including the leading identifying
  comment.
- Exact raw Overpass response text preservation as `rawResponse`.
- Source metadata preservation:
  - `query`
  - `endpoint`
  - `completedAt`
  - `bbox`
  - `copyrightUrl`
- Request identity through normal browser origin/referrer behavior plus the
  existing Overpass QL comment pattern:
  `/* chart-the-course/{APP_VERSION} contact:{CONTACT_URL} purpose:golf-course-{discovery|detail} */`
- No browser attempt to set `User-Agent`, `Origin`, `Referer`, or other
  forbidden/request-identity headers.
- No CTC-020 raw source export schema, export UI, download behavior, or file
  format.
- No CTC-008 PDF behavior.
- No provider, endpoint failover, API key, account, server, analytics,
  telemetry, cloud sync, or unrelated project/user-data persistence.
- No production or dev dependency unless the baseline explicitly justifies the
  dependency, exact pin, license, security, SBOM, and test benefit. Conservative
  default: no new dependency.
- Do not expand Playwright beyond the repository's current browser matrix
  unless explicitly justified as a separate maintainer decision. Conservative
  default: Chromium-only Playwright remains sufficient for CTC-019.

## Corrections that must be fixed from the rejected Gemini response

Do not repeat these mistakes:

1. Do not define record `mode` as `"durable" | "memory"`. It must be
   `"discovery" | "detail"`.
2. Do not store parsed `geometry` as the durable source of truth. Preserve
   exact `rawResponse` and source metadata; normalized geometry remains
   separate runtime output.
3. Do not replace existing deterministic cache keys with hashes or new key
   schemes.
4. Do not strip comments or normalize away the exact query. Exact query
   preservation is required evidence.
5. Do not invent `admin@example.com` or alternate request identity text.
6. Do not propose custom identity headers.
7. Do not claim IndexedDB operations are abortable like fetch. Use pre-checks,
   supersession checks, and ignored late results.
8. Do not claim `onblocked` exposes an upgrade transaction that can be aborted
   after a timer.
9. Do not propose `fake-indexeddb`, JSDOM, Firefox, WebKit, or other new test
   infrastructure unless explicitly justified as a governed dependency/scope
   expansion. Conservative default: no new dependency and current Chromium
   Playwright matrix.
10. Do not include Notion epic/user-story/task matrices.
11. Do not choose a refresh cooldown without rationale. Tie the value to one
    active request, public Overpass politeness, and deterministic tests.
12. Do not allow any stale OSM data rendering without visible user consent.
13. Do not let deletion failure block treating invalid/expired/corrupt records
    as misses.
14. Do not define future CTC-020 export functions, schema, or UI.
15. Do not present browser storage quota/durability as guaranteed.

## CTC-019 acceptance criteria

- IndexedDB or equivalent browser cache stores fetched OSM course geometry.
- Default TTL is 7 days for public Overpass usage.
- UI has explicit `Refresh course data` action with rate limiting.
- Requests use app origin/referrer where available and prefix Overpass QL with
  an identifying comment.
- 429/Retry-After handling and exponential backoff are implemented.
- Cached OSM geometry is clearly marked ODbL-covered in exported source files.

Interpret the final criterion as an internal durable-evidence marker for OSM
content, not as a user-facing source-export feature.

## Required design decisions

Resolve these decisions narrowly against the attached repository contracts and
current primary sources:

- Native durable cache architecture:
  - database name
  - schema version
  - object store name
  - key path
  - indexes
  - upgrade behavior
  - blocked/versionchange behavior
  - transaction boundaries
  - degraded behavior when IndexedDB is unavailable
- Durable record schema with:
  - `schemaVersion`
  - `key`
  - `mode: "discovery" | "detail"`
  - `storedAt`
  - `expiresAt`
  - `rawResponse`
  - `source.query`
  - `source.endpoint`
  - `source.completedAt`
  - `source.bbox`
  - `source.copyrightUrl`
  - internal ODbL marker
  - optional size accounting
- Strict validation of key, mode, query, endpoint, completedAt, bbox,
  copyright URL, raw response shape, schema version, size, TTL, and ODbL
  marker.
- Handling for unknown or dangerous record fields:
  unknown fields are ignored unless they conflict with required fields; they
  are never trusted evidence.
- Exact 7-day TTL calculation and stale retention behavior.
- Stale-data rule:
  stale data is never rendered automatically; visible user choice is required
  before any stale OSM content is shown.
- Cleanup strategy:
  expired/corrupt/incompatible/oversized entries are best-effort deleted, but
  deletion failure still returns a cache miss.
- Quota/unavailable storage behavior:
  user-visible warning plus non-durable memory/session degradation only; this
  degradation does not satisfy the durable-cache acceptance criterion.
- Refresh action:
  scope, accessible label, control state, cooldown, one-active-request behavior,
  cancellation, visible errors, and cache replacement rules.
- Retry policy:
  429 handling, `Retry-After` seconds/date parsing, invalid header behavior,
  bounded exponential backoff, max attempts, max delay, total wait budget,
  deterministic no-jitter or injected deterministic jitter, timeout
  interaction, and cancellation.
- Abort/cancellation:
  pre-check incoming `AbortSignal.aborted` before cache/fetch work, check after
  asynchronous storage operations, ignore late results when aborted or
  superseded, clear backoff timers, and pass the signal to fetch.
- ODbL/source-evidence boundary:
  internal marker only; no CTC-020 source export schema/UI.
- Privacy/security:
  no accounts, cloud sync, analytics, telemetry, external storage, hidden retry
  storms, unrelated user-authored project data persistence, endpoint failover,
  or provider expansion.
- Deterministic tests:
  focused Vitest and current Playwright coverage using existing repo patterns.
  Avoid new test dependencies unless explicitly justified.

## Required response format

Start with exactly this sentence:

```text
CTC-019 specifies a browser-durable Overpass cache and bounded request policy without implementing source export or PDF behavior.
```

Then output exactly these sections:

1. Scope/readiness verdict and blocking unknowns.
2. Evidence table with primary-source URLs and access dates.
3. Durable-cache architecture and exact versioned schema.
4. Validation, TTL, stale, cleanup, quota, upgrade, and concurrency decisions.
5. Refresh action and accessible UI/state-machine contract.
6. Retry-After, bounded backoff, timeout, cancellation, and request-identity contract.
7. ODbL/source-evidence ownership and explicit CTC-020 boundary.
8. Security, privacy, failure-state, and no-network-expansion decisions.
9. Deterministic Vitest and network-isolated Playwright plan.
10. Exact file/change plan, documentation updates, verification plan, and non-goals.
11. Adversarial QA red lines.
12. Open maintainer decisions with conservative defaults.
13. Codex correction traceability matrix.

## Traceability requirements

The traceability matrix must include:

- The 17 corrections from `docs/handoffs/ctc-019-antigravity-spec-review.md`.
- The 15 blockers from `docs/handoffs/ctc-019-gemini-chat-spec-review.md`.
- For each item, state the section where it is resolved.

## Output constraints

- Return only the corrected baseline specification.
- Do not include a research plan in the final answer.
- Do not include product-management epics, user stories, task matrices, or
  implementation checklists beyond the requested exact file/change plan.
- Do not claim implementation is authorized.
- Do not claim Claude QA planning is authorized. Codex will decide after
  critical review.
- If a source does not prove a claim, mark the claim as a conservative
  maintainer decision rather than a fact.
