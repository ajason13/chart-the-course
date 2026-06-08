# Codex startup prompt: select and start the next Chart the Course task

Start the next Chart the Course task.

Repository:
`/Users/jasonalvarez/gitHubRepos/chart-the-course`

## Current state

- `main` should be clean and synchronized with `origin/main`.
- Latest repository-memory commit: `3a30c64` (`Record CTC-005 merge`).
- CTC-005 is Done. PR #3 passed CI and merged as `a624fec`.
- CTC-005 implementation commits:
  - `72f33f0` (`Implement CTC-005 geometry normalization`)
  - `b2b4764` (`Resolve CTC-005 audit minor fixes`)
- Claude final audit for CTC-005 returned `PASS WITH MINOR FIXES`, with no
  blockers. The two authorized test-only fixes were applied.
- Last verification passed:
  - `npm run check`: scaffold policy, build, 24 Vitest tests, and 12 Playwright
    tests.
  - `git diff --check`.
  - `npm_config_cache=/private/tmp/chart-the-course-npm-cache
    scripts/compliance.sh`: 0 production vulnerabilities.
- CTC-005 added the pure dependency-free normalized geometry model in
  `src/normalize.ts`, focused tests in `src/normalize.test.ts`, and an
  incomplete synthetic fixture.

## Candidate next tasks

### Leading candidate: CTC-006

Name: `CTC-006 Render selected hole map with measurement controls`

Notion page ID:
`374834a0-c8a6-81f1-8606-ffee0d58ecad`

Current status should be:
`0. Backlog`

Acceptance criteria:

- Selected hole renders with tee, fairway, green, hazards, and scale indicator.
- User can click two points and see yards/meters.
- Map remains usable on desktop and mobile widths.
- Geometry fixtures verify distance tolerance.

Selection rationale to verify critically:

- CTC-005 now supplies normalized holes, features, strict `{ lat, lon }`
  geometry, warnings, and source evidence.
- CTC-006 is the next dependency in the map and measurement sequence and
  unlocks CTC-007 and later map workflows.
- CTC-018 already selected the MVP map strategy: blank/vector-only rendering
  with no third-party basemap tiles by default.

### Competing candidate: CTC-019

Name: `CTC-019 Implement Overpass cache and request identity policy`

Notion page ID:
`375834a0-c8a6-811c-97bb-cf5682718468`

Current status should be:
`0. Backlog`

CTC-019 is independent pipeline hardening for durable caching, refresh,
rate-limit/backoff, request identity, and ODbL-covered exported source files.
Do not absorb it into CTC-006.

## Required startup workflow

1. Run `git status --short --branch`.
2. Read:
   - `AGENTS.md`
   - `CONTEXT.md`
   - `docs/governance-workflow.md`
   - `docs/tile-provider-strategy.md`
   - `docs/overpass-query-contract.md`
   - `src/normalize.ts`
   - `src/normalize.test.ts`
   - existing complete/incomplete fixtures
   - `src/App.tsx`, `src/styles.css`, and relevant Playwright tests
   - CTC-005 specification review and Claude handoffs where they constrain
     downstream geometry/rendering assumptions
3. Fetch the live CTC-006 and CTC-019 Notion tasks and verify their statuses,
   acceptance criteria, and dependency evidence.
4. Critically confirm which task is correct next. Prefer CTC-006 only if the
   live evidence still supports it. Do not silently select based only on task
   number.
5. Record the selection and dependency rationale in Notion and `CONTEXT.md`.
6. Move the selected runtime task to `1. Spec Drafting (Gemini)`.
7. Prepare a self-contained Gemini Deep Research/specification prompt. Gemini
   has no filesystem or GitHub access, so include exact relevant file contents,
   contracts, acceptance criteria, scope boundaries, and unresolved design
   questions.
8. Stop at the Gemini specification gate unless a Gemini response is already
   available. Do not implement runtime code before Gemini specification review
   and Claude adversarial QA planning are completed and critically reviewed.

## CTC-006 planning questions, if selected

Gemini must resolve:

- The narrow rendering architecture for the blank/vector-only MVP.
- Whether CTC-006 can use native SVG/Canvas/DOM with existing dependencies or
  requires a reviewed map/rendering dependency. No dependency may be added
  without an explicit reviewed decision.
- How a user selects a normalized hole and how unsupported/null geometry and
  normalization warnings affect rendering.
- Coordinate projection from WGS84 `{ lat, lon }` into a stable local viewport
  without changing CTC-005 source geometry.
- Deterministic layer order and styling for tee, fairway, green, bunker,
  golf-specific water, generic water, rough, and vegetation.
- Measurement math and units, including distance algorithm, accuracy/tolerance,
  coordinate-order safety, scale indicator behavior, and whether geodesic or
  local planar calculations are appropriate.
- Two-point interaction behavior for pointer, touch, and keyboard users.
- Responsive desktop/mobile behavior and accessibility requirements.
- OSM attribution visibility on every OSM-derived geometry view.
- Synthetic geometry fixture and unit/Playwright test matrix.
- Observability/debugging needs for projection, selection, and measurement.
- Exact boundaries between CTC-006 and CTC-007 target markers/carry arcs.

## CTC-006 scope boundaries, if selected

- Own selected-hole geometry rendering, scale indication, and two-point
  yards/meters measurement only.
- Use CTC-005 normalized geometry as input. Do not weaken or bypass its
  warnings, strict geometry rules, source evidence, or unsupported-relation
  decisions.
- Follow `docs/tile-provider-strategy.md`: blank/vector-only MVP, no public OSM
  tile CDN, no third-party basemap/provider/API key.
- Keep OSM attribution visible.
- Do not add durable cache, refresh controls, Retry-After/backoff, endpoint
  failover, geocoding, PDF/export behavior, target markers, carry arcs, notes,
  or local project persistence.
- CTC-019 owns durable Overpass request/cache policy.
- CTC-007 owns target markers, carry arcs, and the local project model.
- Do not copy or adapt code/query/UI structures from prohibited or unlicensed
  reference projects.
- Do not use real-course fixtures without the required governance review.

## Governance requirements

- Use the `chart-the-course-governance`,
  `multi-agent-sdlc-orchestration`, and `app-scaffold-review` workflows where
  applicable.
- Update Notion and `CONTEXT.md` as gates change.
- Use a feature branch only after Gemini specification and Claude QA-planning
  gates are complete and critically reviewed.
- Final Claude audit is mandatory before Done.

## Claude handoff enforcement

- Claude Chat has no filesystem or GitHub access.
- Every Claude QA/final-audit handoff must be a generated self-contained
  Markdown bundle.
- Include role, acceptance criteria, decisions, verification evidence,
  required verdict, changed-file manifest, and exact relevant file contents.
- For final audit, generate every changed file from the audited commit using
  `git show COMMIT:path`.
- Verify every relevant changed file is included and record the bundle SHA-256.
- Do not move to `4. Final Audit (Claude)` until the bundle-generation check
  passes.

Stay with the selected task through the current governance gate, update all
required records, and clearly report the generated Gemini prompt location and
the exact next external action required.
