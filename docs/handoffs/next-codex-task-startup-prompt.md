# Codex startup prompt: integrate CTC-006 and start the next Chart the Course task

Continue Chart the Course delivery from the completed CTC-006 audit.

Repository:
`/Users/jasonalvarez/gitHubRepos/chart-the-course`

## Current state

- Active branch: `ctc-006-selected-hole-map`.
- Branch head: `6a2135e` (`Resolve CTC-006 audit minor fixes`).
- `main` is still at `3449748` and does **not** contain CTC-006.
- CTC-006 Notion page:
  `374834a0-c8a6-81f1-8606-ffee0d58ecad`
- CTC-006 is marked `5. Done` in Notion after Claude returned
  `PASS WITH MINOR FIXES`, with no blockers and no re-audit required.
- CTC-006 implementation commits:
  - `ca1656b` (`Implement CTC-006 selected hole map`)
  - `4e46338` (`Prepare CTC-006 final audit`)
  - `6a2135e` (`Resolve CTC-006 audit minor fixes`)
- The branch adds dependency-free native React SVG selected-hole rendering,
  local equirectangular projection, two-point Haversine measurement, pointer
  and keyboard controls, warnings, attribution, a synthetic all-layers fixture,
  and focused Vitest/Playwright coverage.
- Last verification passed:
  - `npm run check`: scaffold policy, build, 30 Vitest tests, and 13
    Playwright tests.
  - `git diff --check`.
  - `npm_config_cache=/private/tmp/chart-the-course-npm-cache
    scripts/compliance.sh`: 0 production vulnerabilities.
- No new production dependency, provider, basemap, persistence, PDF/export,
  target-marker, carry-arc, or CTC-019 cache-policy behavior was added.

## First priority: integrate CTC-006

Do not start another task on top of an unmerged feature branch.

1. Run `git status --short --branch` and confirm the worktree is clean.
2. Read `AGENTS.md` and `CONTEXT.md`.
3. Inspect `main...ctc-006-selected-hole-map` and confirm the audited commits
   and final verification evidence remain intact.
4. Push the branch if needed, create a focused CTC-006 pull request, and include:
   - implementation summary;
   - Claude final verdict;
   - verification commands/results;
   - governance and scope notes.
5. Wait for required CI checks and resolve failures without expanding scope.
6. Merge the pull request only after checks pass.
7. Synchronize local `main`, update CTC-006 Notion with the PR/merge evidence,
   and update `CONTEXT.md` with the merged commit.
8. Confirm `main` is clean and synchronized before selecting the next task.

Do not rewrite or reopen accepted CTC-006 behavior unless integration checks
surface a real defect.

## Candidate next tasks

### Leading candidate: CTC-007

Name:
`CTC-007 Add target markers, carry arcs, and local project model`

Notion page ID:
`374834a0-c8a6-8189-96b6-e11042a288b0`

Live status checked on 2026-06-11:
`0. Backlog`

Acceptance criteria:

- User can add/edit/delete target markers per hole.
- Carry arcs render at configurable distances from selected tee or target.
- Project state can export/import as a local JSON file.
- Invalid project files fail gracefully with useful errors.

Selection rationale to verify critically:

- CTC-006 supplies the selected-hole SVG, stable projection/inverse-projection,
  geographic measurement math, pointer/keyboard interaction patterns, and
  responsive map surface that CTC-007 needs.
- CTC-007 is the direct next dependency in Epic C, Map and Measurement Engine.
- CTC-007 must preserve CTC-005 normalized OSM geometry as immutable source
  evidence and keep user-authored project data separate.
- Local JSON import/export is a user data flow and requires explicit schema,
  validation, versioning, error, accessibility, and security decisions before
  implementation.

### Competing candidate: CTC-019

Name:
`CTC-019 Implement Overpass cache and request identity policy`

Notion page ID:
`375834a0-c8a6-811c-97bb-cf5682718468`

Live status checked on 2026-06-11:
`0. Backlog`

Acceptance criteria:

- IndexedDB or equivalent browser cache stores fetched OSM course geometry.
- Default TTL is 7 days for public Overpass usage.
- UI has explicit `Refresh course data` action with rate limiting.
- API requests use app origin/referrer where available and prefix Overpass QL
  body with an identifying comment.
- 429/Retry-After handling and exponential backoff are implemented.
- Cached OSM geometry is clearly marked ODbL-covered in exported source files.

Accepted CTC-019 hardening requirements:

- Validate every cached source-metadata sub-field before treating a durable
  entry as a hit: `query`, `endpoint`, `completedAt`, `bbox`, and
  `copyrightUrl`.
- Pre-check an incoming `AbortSignal` before starting fetch work.

CTC-019 is independent pipeline hardening. Do not absorb it into CTC-007.

## Required next-task startup workflow

After CTC-006 is merged and local `main` is synchronized:

1. Fetch the live CTC-007 and CTC-019 Notion tasks again. Verify statuses,
   acceptance criteria, and any newly recorded dependency evidence.
2. Read:
   - `AGENTS.md`
   - `CONTEXT.md`
   - `docs/governance-workflow.md`
   - `docs/tile-provider-strategy.md`
   - `docs/overpass-query-contract.md`
   - `src/normalize.ts` and `src/normalize.test.ts`
   - `src/map.ts`, `src/map.test.ts`, and `src/HoleMap.tsx`
   - `src/App.tsx`, `src/styles.css`, and relevant Playwright tests
   - CTC-006 specification review, Claude QA-planning handoff, and final-audit
     handoff where they constrain downstream behavior
3. Critically select the correct next task from live evidence. Prefer CTC-007
   only if it remains the highest-value unblocked dependency. Do not select
   based only on task number.
4. Record the selection and dependency rationale in Notion and `CONTEXT.md`.
5. Move the selected runtime task to `1. Spec Drafting (Gemini)`.
6. Prepare a self-contained Gemini Deep Research/specification prompt. Gemini
   has no filesystem or GitHub access, so include exact relevant file contents,
   contracts, acceptance criteria, scope boundaries, and unresolved decisions.
7. Verify every embedded file byte-for-byte and record the prompt SHA-256.
8. Run the startup verification gate:
   - `npm run check`
   - `git diff --check`
   - `npm_config_cache=/private/tmp/chart-the-course-npm-cache
     scripts/compliance.sh`
9. Stop at the Gemini specification gate unless a Gemini response is already
   available. Do not create a feature branch or implement runtime code before
   Gemini specification review and Claude adversarial QA planning are completed
   and critically reviewed.

## CTC-007 specification questions, if selected

Gemini must resolve these narrowly and against the actual repository contracts:

- Define a versioned local project JSON schema and strict import validator.
- Separate immutable normalized OSM source geometry/evidence from user-authored
  targets, carry settings, and project metadata.
- Define stable hole identity using `hole.source.sourceKey`; do not use array
  indexes as persisted identity.
- Define marker add/edit/delete interaction for pointer, touch, and keyboard
  users without breaking CTC-006 measurement controls.
- Define whether targets are free geographic coordinates, feature-linked
  coordinates, or both; reject unsupported snapping/inference unless explicitly
  justified.
- Define carry-arc origin, radius math, geographic projection, clipping,
  display semantics, units, bounds, and invalid-input behavior.
- Define import/export filename, MIME type, schema version, migration policy,
  maximum file size, unknown-field policy, duplicate handling, and useful
  validation errors.
- Define whether project state is memory-only or locally persisted. Do not add
  IndexedDB/localStorage persistence unless explicitly selected and kept
  separate from CTC-019's OSM cache.
- Define safe local-file parsing. No network upload, executable content,
  HTML injection, prototype pollution, or trust in imported source metadata.
- Preserve visible OSM attribution whenever OSM-derived geometry is rendered or
  included in exported source data.
- Define responsive/mobile and accessibility behavior, including focus order,
  touch targets, live announcements, clear destructive-action semantics, and
  color-independent arc/marker styling.
- Define deterministic synthetic fixtures, pure-function tests, Playwright
  flows, invalid-file adversarial cases, and network isolation.
- Keep CTC-008+, PDF/export, basemaps/providers, geocoding, collaboration,
  accounts, server storage, and CTC-019 durable Overpass caching out of scope.

## Non-negotiable guardrails

- Original Chart the Course code remains Apache-2.0.
- Do not copy, modify, adapt, link, combine, incorporate, or distribute
  AGPL-3.0 code from `ace`.
- Treat `hacker-yardage` and `openyardage-web` as study-only unless permission
  or license is verified.
- Do not add production dependencies, providers, API keys, server components,
  PDF behavior, or external user-data flows without explicit reviewed scope and
  governance updates.
- Keep direct dependencies exact-pinned.
- Use synthetic fixtures only; automated tests must remain network-isolated.
- Notion is long-term memory; `CONTEXT.md` is active repository memory.
