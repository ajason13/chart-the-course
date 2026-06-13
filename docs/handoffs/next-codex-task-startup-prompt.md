# Codex startup prompt: select and start the next Chart the Course task

Continue Chart the Course delivery after the completed CTC-014 integration.

Repository:
`/Users/jasonalvarez/gitHubRepos/chart-the-course`

## Current state

- Active branch: `main`.
- Integrated baseline before this handoff:
  `7ae4add861374af36814db1e02b478b6266d60fc`
  (`Record CTC-014 merge evidence`).
- The worktree was clean and synchronized with `origin/main` when this handoff
  was prepared on 2026-06-13.
- Final `main` CI passed for `7ae4add861374af36814db1e02b478b6266d60fc`.
- CTC-014 PR #6 passed required CI and merged as
  `33ac3cc6afd533a7c05fd6d3403c20b37c6037ea`.
- CTC-014 Notion page:
  `374834a0-c8a6-8168-b948-eccdbf84d17e`
- CTC-014 is `5. Done` in Notion after Claude returned
  `PASS WITH MINOR FIXES`, with no blockers and no re-audit required.
- Last local verification passed:
  - `npm run check`: scaffold policy, build, 44 Vitest tests, and 15
    Playwright tests.
  - `git diff --check`.
  - `npm_config_cache=/private/tmp/chart-the-course-npm-cache
    scripts/compliance.sh`: allowed production licenses and 0 production
    vulnerabilities.
- CTC-014 recommends direct `jspdf@4.2.1` drawing from a pure typed export
  scene for a later separate production-adoption review. It does not authorize
  or ship a production PDF dependency or production PDF export UI.
- Exact-pinned PDF candidate and inspection packages remain research-only
  `devDependencies`. The isolated `/ctc014.html` experiment is not imported by
  the production app.
- CTC-008 distributed/shared PDF export remains release-blocked until CTC-020
  raw GIS source availability ships in the same release.
- No durable OSM cache, persistent notes model, production PDF behavior,
  provider, basemap, API key, server, account, or external user-data flow
  exists.

## First priority: confirm the integration baseline

Do not start work from stale assumptions.

1. Run `git status --short --branch`, `git fetch origin`, and confirm local
   `main` is clean and synchronized with `origin/main`.
2. Read `AGENTS.md` and `CONTEXT.md`.
3. Confirm CTC-014 remains Done, PR #6 remains merged, and required CI remains
   successful.
4. Confirm the isolated CTC-014 experiment remains outside the production app
   import path.
5. Do not rewrite or reopen accepted CTC-014 behavior unless startup
   verification surfaces a real defect.

## Candidate next tasks

Fetch every candidate live from Notion before selecting. The statuses and
evidence below were checked on 2026-06-13 and may have changed.

### Leading candidate to verify critically: CTC-019

Name:
`CTC-019 Implement Overpass cache and request identity policy`

Notion page ID:
`375834a0-c8a6-811c-97bb-cf5682718468`

Live status checked on 2026-06-13:
`0. Backlog`

Acceptance criteria:

- IndexedDB or equivalent browser cache stores fetched OSM course geometry.
- Default TTL is 7 days for public Overpass usage.
- UI has explicit `Refresh course data` action with rate limiting.
- Requests use app origin/referrer where available and prefix Overpass QL with
  an identifying comment.
- 429/Retry-After handling and exponential backoff are implemented.
- Cached OSM geometry is clearly marked ODbL-covered in exported source files.

Accepted hardening requirements:

- Validate cached `query`, `endpoint`, `completedAt`, `bbox`, and
  `copyrightUrl` before treating a durable entry as a hit.
- Pre-check an incoming `AbortSignal` before starting fetch work.

Selection rationale to verify critically:

- CTC-019 is independently implementable and addresses the largest remaining
  production-data-pipeline gap without requiring premature PDF shipping.
- Current `src/overpass.ts` uses session storage, validates only
  `rawResponse` and `source.query` on cache reads, performs no TTL validation,
  and does not pre-check an already-aborted signal before beginning fetch work.
- The current Overpass queries already include an identifying comment, but
  CTC-019 must verify the full accepted request-identity contract rather than
  assume it is complete.
- Durable exact raw response plus validated source metadata supports later
  CTC-020 source export, but CTC-019 must not absorb CTC-020 export UI/schema
  work or claim to satisfy the PDF release gate.
- CTC-019 has security, persistence, request-rate, retry, and failure-state
  implications. It is a runtime task; the docs-only governance exception does
  not apply.

### Coupled PDF candidate: CTC-020

Name:
`CTC-020 Implement ODbL source export for PDF workflow`

Notion page ID:
`375834a0-c8a6-81d8-bf93-e0f07715ea09`

Live status checked on 2026-06-13:
`0. Backlog`

Acceptance criteria:

- `Download Raw GIS Source (ODbL)` appears adjacent to `Download PDF`.
- Source export includes raw GeoJSON or OSM XML response, OSM IDs, bounding
  box, exact Overpass QL query, source URL, and
  `https://www.openstreetmap.org/copyright`.
- PDF acknowledgements include the full printed OSM attribution URL.
- PDF export cannot ship unless raw GIS source export is available in the same
  release.

Why it is not automatically the next task:

- CTC-020 is release-blocking for CTC-008, but two acceptance criteria refer
  directly to a production PDF action and PDF acknowledgements that do not yet
  exist.
- Selecting CTC-020 now is valid only if live evidence and the specification
  define a truthful independently deliverable source-export slice without a
  fake `Download PDF` action, premature PDF shipping, or combining CTC-020 and
  CTC-008 for convenience.
- The current app retains exact raw Overpass response text and source metadata
  in session state/cache, but the specification must define strict export
  schema, filename, MIME type, validation, size limits, lifecycle, ODbL
  labeling, and behavior when source evidence is unavailable.
- CTC-020 must not be claimed Done if its accepted PDF-adjacency and
  acknowledgement criteria remain unsatisfied or deferred without a recorded
  task decision.

### Coupled PDF candidate: CTC-008

Name:
`CTC-008 Create PDF yardage book export prototype`

Notion page ID:
`374834a0-c8a6-8156-9735-cb39df6b33f3`

Live status checked on 2026-06-13:
`0. Backlog`

Acceptance criteria:

- Export includes cover, course summary, and at least one rendered hole page.
- Hole page includes map, yardage table, custom targets, and notes.
- Export works from fixture data without network calls.
- PDF layout is stable at selected paper size.

Why it is not automatically the next task:

- CTC-014 recommends direct jsPDF only for a later separate
  production-adoption review. Selecting CTC-008 must explicitly authorize and
  govern any move of `jspdf@4.2.1` from experiment `devDependencies` to
  production `dependencies`, including notices, SBOM, license, security, and
  bundle-impact review.
- `ATTRIBUTION.md` requires CTC-020 raw GIS source availability in the same
  release as distributed/shared PDF export. CTC-008 must not ship alone.
- CTC-008's notes criterion remains unresolved. CTC-014 used static fixture
  text only; no persistent or user-authored notes model is authorized.
- A production-adoption scope must add the rendered-page visual regression
  layer that CTC-014 explicitly deferred before shipping PDF behavior.

## Required next-task startup workflow

After confirming clean synchronized `main`:

1. Fetch live CTC-019, CTC-020, CTC-008, and CTC-014 Notion tasks. Verify
   statuses, acceptance criteria, dependencies, and newly recorded evidence.
2. Read:
   - `AGENTS.md`
   - `CONTEXT.md`
   - `docs/governance-workflow.md`
   - `ATTRIBUTION.md`
   - `THIRD_PARTY_NOTICES.md`
   - `SECURITY.md`
   - `docs/legal-disclaimers.md`
   - `docs/reference-project-reuse-policy.md`
   - `docs/tile-provider-strategy.md`
   - `docs/overpass-query-contract.md`
   - `docs/experiments/ctc-014-vector-pdf-evaluation.md`
   - `docs/handoffs/ctc-014-spec-corrections.md`
   - `docs/handoffs/ctc-014-claude-final-audit-prompt.md`
   - `package.json`, `package-lock.json`, and `sbom.json`
   - `src/overpass.ts`, `src/overpass.test.ts`, `src/App.tsx`,
     `src/normalize.ts`, `src/map.ts`, `src/project.ts`, `src/carry.ts`,
     `src/HoleMap.tsx`, `src/ctc014Scene.ts`, `src/ctc014Experiment.ts`, and
     `src/styles.css`
   - relevant Playwright tests and synthetic fixtures
   - CTC-004, CTC-007, and CTC-014 accepted specification corrections,
     QA-planning handoffs, and final-audit handoffs where they constrain the
     selected task
3. Critically select the highest-value unblocked task from live evidence.
   Prefer CTC-019 only if it remains the best independently deliverable task.
   Do not select based only on this handoff's ranking.
4. Record the selection, rejected alternatives, dependency rationale, and
   scope boundaries in Notion and `CONTEXT.md`.
5. Move the selected runtime task to `1. Spec Drafting (Gemini)`.
6. Prepare a self-contained Gemini Deep Research/specification prompt. Gemini
   has no filesystem or GitHub access, so include exact relevant repository
   file contents, contracts, acceptance criteria, governance constraints, and
   unresolved decisions.
7. Verify every embedded file byte-for-byte and record the prompt SHA-256.
8. Run the startup verification gate:
   - `npm run check`
   - `git diff --check`
   - `npm_config_cache=/private/tmp/chart-the-course-npm-cache
     scripts/compliance.sh`
9. Commit and push the selection, memory update, and verified Gemini prompt to
   `main` only if the changes are docs/governance handoff artifacts and the
   worktree remains clean after verification.
10. Stop at the Gemini specification gate unless a Gemini response is already
    available. Do not create a feature branch or implement runtime behavior
    before Gemini specification review and Claude adversarial QA planning are
    completed and critically reviewed.

## CTC-019 specification questions, if selected

Gemini must resolve these narrowly against current repository contracts and
current primary sources:

- Select IndexedDB or another browser-durable cache mechanism and define the
  exact schema version, stores, keys, indexes, upgrade behavior, transaction
  boundaries, and failure behavior. Do not add a dependency unless justified
  against the native API and explicitly reviewed.
- Define whether discovery and detail responses are both durable. Preserve
  exact raw response text separately from parsed/normalized geometry and
  preserve deterministic existing cache-key behavior.
- Define strict durable-entry validation for raw response and every source
  metadata field: `query`, `endpoint`, `completedAt`, `bbox`, and
  `copyrightUrl`. Invalid or expired entries must not be treated as hits.
- Define the exact 7-day TTL calculation, clock-skew behavior, stale-entry
  handling, cleanup strategy, and whether stale data may be shown only after a
  visible user decision.
- Define `Refresh course data` scope, accessible UI state, per-key rate limit,
  disabled/cooldown behavior, abort behavior, cache replacement rules, and
  useful visible errors.
- Define public Overpass 429 and `Retry-After` handling, bounded exponential
  backoff, jitter policy, maximum attempts/delay, cancellation, timeout
  interaction, and no automatic endpoint failover.
- Pre-check incoming `AbortSignal.aborted` before cache/fetch work and define
  cancellation behavior during wait/backoff/fetch.
- Preserve identifying Overpass QL comments and browser origin/referrer
  behavior. Do not attempt to set a forbidden browser `User-Agent`.
- Define how durable cached OSM content is marked ODbL-covered for later source
  export without implementing CTC-020 export behavior or changing normalized
  geometry ownership.
- Define privacy/security boundaries: no accounts, cloud sync, analytics,
  telemetry, external storage, hidden retry storms, or storage of unrelated
  user-authored project data.
- Define deterministic Vitest and network-isolated Playwright coverage,
  including fake clock strategy, IndexedDB isolation/reset, corrupt entries,
  quota/unavailable storage, refresh cooldown, Retry-After variants, backoff,
  already-aborted signals, and no external requests.
- Define any required updates to `ATTRIBUTION.md`,
  `docs/overpass-query-contract.md`, `SECURITY.md`, and active repository
  memory.

## CTC-020 specification questions, if selected

- Decide whether the complete acceptance criteria are independently
  deliverable before CTC-008 exists. Do not create a fake or inert PDF action
  merely to satisfy adjacency wording.
- Define a strict versioned raw-source export schema containing exact raw
  response text, OSM IDs, bounding box, exact query, endpoint/source URL,
  completion timestamp, and full copyright URL.
- Define validation, dangerous-key handling, maximum size, filename, MIME type,
  deterministic ordering, Blob/object-URL lifecycle, visible errors, and
  behavior when source evidence is missing or corrupt.
- Keep raw OSM evidence separate from user-authored project export and
  normalized geometry. Do not export invented or reconstructed source as raw.
- Resolve whether durable-cache availability from CTC-019 is a prerequisite or
  whether current in-memory/session exact raw evidence is sufficient for the
  accepted independently deliverable slice.
- Preserve the same-release CTC-008/CTC-020 release gate without combining the
  tasks.

## Non-negotiable guardrails

- Original Chart the Course code remains Apache-2.0.
- Do not copy, modify, adapt, link, combine, incorporate, or distribute
  AGPL-3.0 code from `ace`.
- Treat `hacker-yardage` and `openyardage-web` as study-only unless permission
  or license is verified. Do not copy their export, caching, layouts, assets,
  query text, or distinctive workflows.
- Do not add production dependencies, providers, API keys, server components,
  production PDF shipping behavior, or external user-data flows without
  explicit reviewed scope and governance updates.
- Raw GIS source availability must ship in the same release as
  distributed/shared PDF export.
- PDFs containing OSM-derived geometry must include visible searchable OSM
  attribution and the full URL
  `https://www.openstreetmap.org/copyright`.
- Keep direct dependencies exact-pinned.
- Use synthetic fixtures only; automated tests must remain network-isolated.
- Preserve exact raw OSM response/source evidence separately from normalized
  geometry and user-authored project state.
- Notion is long-term memory; `CONTEXT.md` is active repository memory.
