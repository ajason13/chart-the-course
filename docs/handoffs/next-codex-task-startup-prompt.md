# Codex startup prompt: select and start the next Chart the Course task

Continue Chart the Course delivery after the completed CTC-007 integration.

Repository:
`/Users/jasonalvarez/gitHubRepos/chart-the-course`

## Current state

- Active branch: `main`.
- CTC-007 integration baseline before this handoff:
  `a5b16402c8c8ddc2fbcd8221241745340ebe3aa5`
  (`Record CTC-007 merge evidence`).
- The worktree was clean and synchronized with `origin/main` when this handoff
  was prepared on 2026-06-12.
- CTC-007 PR #5 passed required CI and merged as
  `e0d9c8f5a92fbab91c76c402361b31e3af03e30a`.
- CTC-007 Notion page:
  `374834a0-c8a6-8189-96b6-e11042a288b0`
- CTC-007 is `5. Done` in Notion after Claude returned
  `PASS WITH MINOR FIXES`, with no blockers and no re-audit required.
- Last verification passed:
  - `npm run check`: scaffold policy, build, 41 Vitest tests, and 14
    Playwright tests.
  - `git diff --check`.
  - `npm_config_cache=/private/tmp/chart-the-course-npm-cache
    scripts/compliance.sh`: allowed production licenses and 0 production
    vulnerabilities.
- CTC-007 adds dependency-free memory-only project state, target CRUD and
  repositioning, tee/target-origin carry rings, strict local JSON exchange,
  visible errors, and focused synthetic/network-isolated tests.
- Normalized OSM source geometry/evidence remains immutable. No PDF pipeline,
  PDF library, raw GIS source export, notes model, new production dependency,
  durable OSM cache, provider, basemap, API key, server, account, or external
  user-data flow exists.

## First priority: confirm the integration baseline

Do not start work from stale assumptions.

1. Run `git status --short --branch`, `git fetch origin`, and confirm local
   `main` is clean and synchronized with `origin/main`.
2. Read `AGENTS.md` and `CONTEXT.md`.
3. Confirm CTC-007 remains Done and PR #5 remains merged.
4. Do not rewrite or reopen accepted CTC-007 behavior unless startup
   verification surfaces a real defect.

## Candidate next tasks

Fetch every candidate live from Notion before selecting. The statuses below
were checked on 2026-06-12 and may have changed.

### Leading candidate: CTC-014

Name:
`CTC-014 Evaluate vector PDF export pipeline`

Notion page ID:
`374834a0-c8a6-8168-b948-eccdbf84d17e`

Live status checked on 2026-06-12:
`0. Backlog`

Acceptance criteria:

- Compare pdfkit, jsPDF, and SVG/canvas-to-PDF approaches for browser
  compatibility, vector output, file size, fonts, and print precision.
- Produce one fixture hole page with map geometry, yardage markers, and notes.
- Define visual regression strategy for PDF output.
- Recommend final library with license and maintenance assessment.

Selection rationale to verify critically:

- No PDF library, rendering pipeline, dependency decision, font policy, or
  visual-regression contract exists.
- CTC-008 would introduce PDF behavior before the pipeline and dependency are
  reviewed. CTC-014 is the focused decision/prototype task that should reduce
  that risk first.
- CTC-006 and CTC-007 now supply native SVG map geometry, measurements, and
  target/carry overlays that a PDF-pipeline evaluation can exercise.
- CTC-014 must not silently ship production PDF behavior or select/add a
  production dependency before specification, license, maintenance, security,
  and governance review.
- Its fixture-hole-page criterion means the docs-only governance exception does
  not apply automatically. Treat it as a runtime/research task unless live
  evidence proves a narrower accepted delivery path.

### Downstream coupled tasks: CTC-008 and CTC-020

CTC-008:
`CTC-008 Create PDF yardage book export prototype`

Notion page ID:
`374834a0-c8a6-8156-9735-cb39df6b33f3`

Live status checked on 2026-06-12:
`0. Backlog`

Acceptance criteria:

- Export includes cover, course summary, and at least one rendered hole page.
- Hole page includes map, yardage table, custom targets, and notes.
- Export works from fixture data without network calls.
- PDF layout is stable at selected paper size.

CTC-020:
`CTC-020 Implement ODbL source export for PDF workflow`

Notion page ID:
`375834a0-c8a6-81d8-bf93-e0f07715ea09`

Live status checked on 2026-06-12:
`0. Backlog`

Acceptance criteria:

- `Download Raw GIS Source (ODbL)` appears adjacent to `Download PDF`.
- Source export includes raw GeoJSON or OSM XML response, OSM IDs, bounding
  box, exact Overpass QL query, source URL, and
  `https://www.openstreetmap.org/copyright`.
- PDF acknowledgements include the full printed OSM attribution URL.
- PDF export cannot ship unless raw GIS source export is available in the same
  release.

Critical dependency constraints:

- `ATTRIBUTION.md` requires raw GIS source export to ship in the same release
  as distributed/shared PDF export. Do not implement or ship CTC-008 alone in a
  way that violates this gate.
- CTC-020 is coupled to PDF workflow behavior and should not be improvised
  before the CTC-014 pipeline decision.
- CTC-008 requires notes, but CTC-007 explicitly kept notes out of scope. The
  next specification must decide whether fixture-only/static notes satisfy the
  prototype or whether a separate user-authored notes task is a prerequisite.
- Do not merge CTC-008 and CTC-020 into one task merely for convenience.
  Record explicit dependency/order decisions in Notion.

### Independent competing candidate: CTC-019

Name:
`CTC-019 Implement Overpass cache and request identity policy`

Notion page ID:
`375834a0-c8a6-811c-97bb-cf5682718468`

Live status checked on 2026-06-12:
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

CTC-019 remains valuable independent pipeline hardening. Do not absorb it into
PDF work. Select it only if live evidence shows CTC-014 is blocked or lower
value.

## Required next-task startup workflow

After confirming clean synchronized `main`:

1. Fetch the live CTC-014, CTC-008, CTC-020, and CTC-019 Notion tasks. Verify
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
   - `package.json` and `package-lock.json`
   - `src/overpass.ts`, `src/normalize.ts`, `src/map.ts`, `src/project.ts`,
     `src/carry.ts`, `src/HoleMap.tsx`, `src/App.tsx`, and `src/styles.css`
   - relevant Vitest, Playwright, and synthetic fixture files
   - CTC-006 and CTC-007 accepted specification corrections, QA-planning
     handoffs, and final-audit handoffs where they constrain downstream work
3. Critically select the highest-value unblocked task from live evidence.
   Prefer CTC-014 only if it remains the correct prerequisite. Do not select
   based only on task number or this handoff's ranking.
4. Record the selection, rejected alternatives, dependency rationale, and scope
   boundaries in Notion and `CONTEXT.md`.
5. Move the selected runtime/research task to `1. Spec Drafting (Gemini)`.
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
    available. Do not create a feature branch, install a PDF dependency, or
    implement runtime behavior before Gemini specification review and Claude
    adversarial QA planning are completed and critically reviewed.

## CTC-014 specification questions, if selected

Gemini must resolve these narrowly against current repository contracts and
current primary sources:

- Compare current browser-capable pdfkit, jsPDF, and SVG/canvas-to-PDF options,
  including exact packages/versions, licenses, maintenance status, bundle size,
  browser support, vector preservation, SVG feature support, font embedding,
  deterministic output, metadata, security posture, and print precision.
- Decide whether the evaluation installs any dependency on an isolated branch,
  uses temporary tooling only, or produces a no-dependency browser-print/SVG
  prototype. No production dependency is authorized merely because Gemini
  recommends one.
- Define the exact fixture-only hole-page experiment using existing synthetic
  normalized geometry and CTC-007 target/carry state. No real-course fixture or
  network call.
- Resolve the acceptance-criterion reference to notes without silently adding a
  persistent notes model. Distinguish static fixture text from user-authored
  note behavior.
- Define selected paper sizes, margins, coordinate transforms, clipping,
  pagination, map/yardage-table layout, and stability tolerances.
- Preserve geometry as vector output where feasible and identify any raster
  fallback explicitly.
- Define deterministic visual regression strategy: structural PDF assertions,
  rendered-page image comparison, tolerances, font/environment pinning, and
  CI portability.
- Define accessibility and usability expectations for export controls and
  useful failure states.
- Define PDF security/privacy behavior: no network upload, remote font fetch,
  executable content, external asset tracking, or imported HTML trust.
- Require visible PDF attribution and the full printed URL
  `https://www.openstreetmap.org/copyright`.
- Treat CTC-020 raw GIS source availability as a release-blocking dependency
  for CTC-008. Do not claim the CTC-014 experiment itself ships production PDF
  export.
- Define license/SBOM/compliance changes required before any recommended
  dependency can be adopted. Keep direct dependencies exact-pinned.
- Keep CTC-019 durable caching, providers/basemaps, accounts, servers, cloud
  sync, real-course fixtures, collaboration, and unrelated analytics out of
  scope.

## Non-negotiable guardrails

- Original Chart the Course code remains Apache-2.0.
- Do not copy, modify, adapt, link, combine, incorporate, or distribute
  AGPL-3.0 code from `ace`.
- Treat `hacker-yardage` and `openyardage-web` as study-only unless permission
  or license is verified. Do not copy their PDF/export implementation, layouts,
  assets, or distinctive workflows.
- Do not add production dependencies, providers, API keys, server components,
  PDF shipping behavior, or external user-data flows without explicit reviewed
  scope and governance updates.
- Raw GIS source availability must ship in the same release as distributed PDF
  export.
- PDFs containing OSM-derived geometry must include visible OSM attribution and
  the full URL `https://www.openstreetmap.org/copyright`.
- Keep direct dependencies exact-pinned.
- Use synthetic fixtures only; automated tests must remain network-isolated.
- Notion is long-term memory; `CONTEXT.md` is active repository memory.
