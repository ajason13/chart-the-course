# CTC-019 Antigravity deep-research prompt

You are the Gemini / Antigravity Deep Researcher for Chart the Course task
CTC-019, Implement Overpass cache and request identity policy.

Run this from the repository root:

```text
/Users/jasonalvarez/gitHubRepos/chart-the-course
```

## Required output

Write your final research/specification output directly to:

```text
docs/handoffs/ctc-019-antigravity-research-spec.md
```

Do not rely on stdout as the durable artifact. Keep any temporary notes out of
the commit surface unless they are intentionally part of the final artifact.
Do not modify runtime source, tests, dependency files, generated SBOM files, or
task status files. The only file you should create or update is the required
output file above.

## Authoritative local context to read first

Read these files before researching or writing:

- `AGENTS.md`
- `CONTEXT.md`
- `ATTRIBUTION.md`
- `SECURITY.md`
- `THIRD_PARTY_NOTICES.md`
- `docs/governance-workflow.md`
- `docs/overpass-query-contract.md`
- `docs/tile-provider-strategy.md`
- `docs/handoffs/ctc-019-gemini-specification-prompt.md`
- `docs/handoffs/ctc-019-gemini-plan-correction.md`
- `package.json`
- `package-lock.json`
- `src/overpass.ts`
- `src/overpass.test.ts`
- `src/App.tsx`
- `src/normalize.ts`
- `test/e2e/app.spec.ts`
- `fixtures/overpass/synthetic-golf-course.json`

Use `rg` for codebase search. You may inspect additional repository files only
when they are directly relevant to CTC-019.

## Task state

- CTC-019 is in `1. Spec Drafting (Gemini)`.
- This is a research/specification handoff only.
- Do not implement runtime behavior.
- Do not create a feature branch.
- Do not add dependencies.
- Do not modify Notion; Codex will sync Notion after reviewing your artifact.
- No implementation decisions are accepted until Codex critically reviews this
  output and Claude adversarial QA planning is completed and critically
  reviewed.

## Acceptance criteria

CTC-019 acceptance criteria:

- IndexedDB or equivalent browser cache stores fetched OSM course geometry.
- Default TTL is 7 days for public Overpass usage.
- UI has explicit `Refresh course data` action with rate limiting.
- API requests use app origin/referrer where available and prefix Overpass QL
  body with an identifying comment.
- 429/Retry-After handling and exponential backoff are implemented.
- Cached OSM geometry is clearly marked ODbL-covered in exported source files.

Accepted CTC-004 hardening notes:

- Validate every cached source-metadata sub-field (`query`, `endpoint`,
  `completedAt`, `bbox`, and `copyrightUrl`) before treating a durable cache
  entry as a hit.
- Pre-check an incoming request `AbortSignal` before starting fetch work so an
  already-aborted signal cannot start an unnecessary request.
- Preserve the accepted deterministic trailing colon for empty-name discovery
  cache keys.

## Non-negotiable scope boundaries

- Prefer the native browser platform. Do not recommend adding a dependency
  unless primary-source evidence proves native IndexedDB cannot meet the
  reviewed contract and a later explicit review approves the dependency.
- Preserve exact raw Overpass response text separately from parsed/normalized
  geometry.
- Preserve current deterministic discovery/detail cache-key behavior.
- Keep normalized geometry and user-authored project state separate.
- Do not cache user-authored project data, notes, preferences, credentials, or
  unrelated state.
- Invalid, corrupt, incompatible, expired, oversized, or untrusted durable
  entries must not be fresh hits.
- The public Overpass default TTL is exactly 7 days.
- Define visible, accessible, rate-limited `Refresh course data`; do not query
  on keystrokes.
- Define bounded 429/Retry-After and exponential-backoff behavior. No hidden
  retry storms, automatic endpoint failover, proxy, or provider switch.
- Pre-check `AbortSignal.aborted` before cache/fetch work and define
  cancellation during storage, waits, backoff, fetch, and response body reads.
- Preserve identifying Overpass QL comments. Allow normal browser
  origin/referrer behavior where browser policy permits. Do not attempt to set
  or spoof forbidden browser `User-Agent`, `Origin`, or `Referer` headers.
- Keep no more than one active Overpass request per browser session.
- Do not implement CTC-020 source export, source-export schema, source-export
  download UI, production PDF behavior, CTC-008 behavior, providers, endpoint
  failover, API keys, accounts, servers, analytics, telemetry, cloud sync,
  service workers, background sync, external storage, or unrelated persistence.
- Original Chart the Course code remains Apache-2.0.
- Do not copy or adapt AGPL or unlicensed reference-project code, query text,
  caching behavior, UI, fixtures, assets, or workflows.
- Use synthetic fixtures only. Automated tests must remain network-isolated.
- Keep direct dependencies exact-pinned and preserve canonical compliance.

## Required primary-source research

Use current primary sources and cite URLs plus access date for:

- IndexedDB API behavior: database versions, object stores, transactions,
  upgrade/versionchange/blocked behavior, durability caveats, quota/storage
  failure behavior, and browser availability.
- Storage/quota behavior and private browsing caveats.
- Fetch API, AbortSignal, response body reads, and abort semantics.
- HTTP `Retry-After` semantics and allowed formats.
- Browser origin/referrer behavior and forbidden request headers.
- Official Overpass public-service/rate-limit guidance and request identity
  expectations where available.
- Accessibility guidance relevant to refresh controls, disabled states, live
  status, retry/wait announcements, focus behavior, and errors.

Prefer standards and official docs. Clearly label inferences and project
recommendations.

## Required specification decisions

Resolve every item:

1. Native durable-cache architecture: database name, version, stores, key paths,
   indexes, schema, upgrade transaction behavior, blocked/versionchange
   behavior, connection lifecycle, transaction boundaries, size limits,
   cleanup, and graceful degradation.
2. Durability scope: whether discovery and detail responses are both durable,
   how existing deterministic cache keys map to durable records, and how
   temporary session entries are retired or ignored without changing keys.
3. Strict versioned durable-entry validation: record version/key, raw response,
   parsed response shape, query, endpoint, completedAt, bbox, copyrightUrl,
   mode, timestamps, ODbL/source-evidence label, dangerous/unexpected keys,
   maximum record/response size, and corruption handling.
4. TTL/stale policy: exact 7-day TTL in milliseconds, boundary equality,
   invalid dates, future timestamps, clock rollback/forward, stale entries,
   visible stale-data decisions, cleanup cadence, quota/unavailable storage,
   failed upgrades/transactions, tab concurrency, and write failures after a
   valid network response.
5. `Refresh course data`: exact current-key scope, cooldown duration,
   enabled/disabled states, accessible name, status copy, focus behavior,
   loading/cancel behavior, stale/fresh replacement rules, failed-refresh
   behavior, and whether cached data remains visible.
6. 429/`Retry-After` and backoff: seconds/date/invalid/past/huge values,
   bounded exponential fallback, deterministic jitter or no-jitter test policy,
   max attempts, max per-delay, total delay budget, timeout interaction,
   visible status, cancellation during waits/fetch/body-read, and no endpoint
   failover.
7. Request identity: Overpass QL comments, normal browser origin/referrer
   behavior, forbidden headers, credentials/referrer policy, and exact code
   red lines.
8. ODbL evidence: how durable cached OSM evidence is marked ODbL-covered for
   later CTC-020 source export without implementing any export behavior or
   changing normalized geometry ownership.
9. React/App integration: async cache lookup, stale/fresh/refreshing/cooldown/
   retrying states, one-active-request behavior, stale request protection,
   useful errors, accessible announcements, and preserving existing detail,
   map, and project behavior.
10. Deterministic tests: Vitest fake clock/timer strategy, IndexedDB test
    strategy or justified test-only abstraction, database isolation/reset,
    schema upgrades, TTL boundaries, clock skew, corrupt entries, metadata
    validation, quota/unavailable storage, refresh cooldown, Retry-After
    variants, bounded backoff, cancellation, already-aborted signals, exact raw
    text preservation, request identity, and no external requests.
11. Network-isolated Playwright coverage: reload durability, refresh
    UI/cooldown, 429 retry behavior, cancellation during backoff/fetch, storage
    degradation where feasible, request body/comment identity, mobile layout,
    focus, live regions, axe checks, and no external requests.
12. Exact file/change plan and docs updates, including likely updates to
    `ATTRIBUTION.md`, `docs/overpass-query-contract.md`, `SECURITY.md`,
    `CONTEXT.md`, runtime modules, unit tests, and Playwright tests.

## Required output format

The first sentence of your artifact must be exactly:

```text
CTC-019 specifies a browser-durable Overpass cache and bounded request policy without implementing source export or PDF behavior.
```

Then return a self-contained specification with exactly these top-level
sections:

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

## Completion criteria

Your artifact is acceptable only if it defines an implementable
browser-durable cache and schema; strict validation; exact TTL/stale behavior;
accessible rate-limited refresh; bounded Retry-After/backoff/cancellation
behavior; request identity; ODbL evidence ownership; degradation behavior; and
deterministic tests while preserving all existing cache keys, raw evidence,
normalized/project boundaries, network isolation, and downstream release gates.
