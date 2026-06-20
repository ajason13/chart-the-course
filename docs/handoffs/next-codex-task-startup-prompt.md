# Codex Startup Prompt: Continue Chart the Course After CTC-020

Repository:
`/Users/jasonalvarez/gitHubRepos/chart-the-course`

## Current Handoff State

- Current date for this handoff: 2026-06-20.
- Local `main` was fast-forwarded to `origin/main` after CTC-020 merged.
- Current merged baseline:
  `16fd9051610d1149e79680257f7dda232ed99745`
- PR #8:
  `https://github.com/ajason13/chart-the-course/pull/8`
- PR #8 state: merged.
- PR #8 merged at:
  `2026-06-20T06:44:25Z`
- PR #8 head before merge:
  `ad788cbed87eed69cf886e4e6a9d1361c6da32ea`
- Main CI after merge:
  - workflow: `CI`
  - run ID: `27863255281`
  - head SHA: `16fd9051610d1149e79680257f7dda232ed99745`
  - conclusion: success
- Claude final audit verdict for CTC-020:
  `PASS WITH MINOR FIXES`
- Claude said:
  - no blockers;
  - no re-audit required;
  - CTC-020 may move to Done after the minor fixes.
- Claude minor fixes were applied in commit:
  `ad788cbed87eed69cf886e4e6a9d1361c6da32ea`
- Post-fix verification passed:
  - `npm run test:unit -- gisSourceExport`
  - `npm run check`
  - `git diff --check`
  - `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`
  - production audit reported 0 vulnerabilities.
- PR #8 CI `verify` also passed after the minor fixes.

## Important Notion Follow-Up

The previous session attempted to mark CTC-020 Done in Notion, but the Notion
tool failed with:

```text
OAuth authorization required
```

Before selecting new work, retry the Notion update:

- CTC-020 page ID:
  `375834a0-c8a6-81d8-bf93-e0f07715ea09`
- Set `Handshake Status` to:
  `5. Done`
- Keep branch:
  `ctc-020-odbl-source-export`
- Keep PR:
  `https://github.com/ajason13/chart-the-course/pull/8`
- Add a short merge note if Notion auth works:
  PR #8 merged at `2026-06-20T06:44:25Z` with merge commit
  `16fd9051610d1149e79680257f7dda232ed99745`; main CI run `27863255281`
  passed; Claude final audit was `PASS WITH MINOR FIXES`; minor fixes were
  applied; no re-audit was required.

If Notion auth still fails, continue with repository work only after recording
the failed Notion update in `CONTEXT.md`.

## What CTC-020 Shipped

CTC-020 Phase 1 shipped:

- detail-mode-only `Download Raw GIS Source (ODbL)` export;
- explicit active detail source evidence state;
- exact raw Overpass response preservation as a string;
- deterministic JSON export with MIME `application/json;charset=utf-8`;
- filename pattern `ctc-gis-source-YYYYMMDDTHHmmssZ.json`;
- 2-space pretty printing;
- 1,048,576 byte cap measured against the final UTF-8 JSON file;
- primitive sorted `{ type, id, tagKeys }` OSM element summaries;
- stale source export only after explicit stale-render consent;
- discovery-mode export absent from the DOM;
- docs updates in `ATTRIBUTION.md`, `SECURITY.md`, and
  `docs/overpass-query-contract.md`;
- self-contained Claude final audit prompt:
  `docs/handoffs/ctc-020-claude-final-audit-prompt.md`.

CTC-020 did not ship:

- production PDF export behavior;
- fake or inert PDF controls;
- final adjacency to a real `Download PDF` control;
- PDF acknowledgements/footer behavior;
- production dependencies;
- providers, endpoint failover, API keys, accounts, server components,
  telemetry, cloud sync, or external user-data flows.

Future CTC-008 work remains responsible for real PDF behavior, visible/searchable
PDF attribution, and proving same-release PDF/source-export gates.

## First Priority: Confirm Baseline

Do not start from stale assumptions.

1. Run:
   - `git status --short --branch`
   - `git fetch origin`
   - switch to `main` if needed
   - `git pull --ff-only`
   - confirm local `main` is clean and synchronized with `origin/main`
2. Confirm `origin/main` is at or after:
   `16fd9051610d1149e79680257f7dda232ed99745`
3. Confirm PR #8 remains merged and main CI run `27863255281` succeeded, or
   identify any newer main commit/CI state.
4. Retry the CTC-020 Notion Done update described above.
5. Read:
   - `AGENTS.md`
   - `CONTEXT.md`
   - `docs/governance-workflow.md`
   - `ATTRIBUTION.md`
   - `SECURITY.md`
   - `docs/overpass-query-contract.md`
   - `docs/handoffs/ctc-020-claude-final-audit-prompt.md`
   - relevant source/test files changed by CTC-020:
     `src/App.tsx`, `src/gisSourceExport.ts`,
     `src/gisSourceExport.test.ts`, `test/e2e/app.spec.ts`

## Candidate Next-Task Selection

Critically select the highest-value unblocked task from live Notion evidence.
Do not select based only on this prompt.

Fetch live Notion pages before deciding:

- CTC-020:
  `375834a0-c8a6-81d8-bf93-e0f07715ea09`
- CTC-008:
  `374834a0-c8a6-8156-9735-cb39df6b33f3`
- CTC-014:
  `374834a0-c8a6-8168-b948-eccdbf84d17e`
- CTC-019:
  `375834a0-c8a6-811c-97bb-cf5682718468`

Also search/fetch the live Notion backlog for other candidate tasks if CTC-008
is still blocked or poorly scoped.

### Likely Candidate: CTC-008 Create PDF Yardage Book Export Prototype

CTC-008 may now be the highest-value candidate because CTC-019 and CTC-020
have shipped the durable raw Overpass evidence and raw GIS source export
foundation needed before distributed/shared PDF export.

Do not assume CTC-008 is automatically unblocked. Evaluate live Notion and repo
state first.

Key concerns to resolve before implementation:

- CTC-014 recommended direct jsPDF only for later reviewed production adoption;
  selecting CTC-008 must explicitly authorize any dependency movement from
  research/dev-only status into production runtime.
- CTC-020 Phase 1 source export exists, but CTC-008 must still preserve the
  same-release gate and real UI adjacency to source export when PDF UI ships.
- PDFs containing OSM-derived geometry must include visible, searchable OSM
  attribution and the full URL:
  `https://www.openstreetmap.org/copyright`
- The notes acceptance criterion remains unresolved. Do not silently invent a
  persistent notes model.
- Visual regression coverage for rendered PDF pages must be specified before
  shipping production PDF behavior.
- Do not add production dependencies, PDF behavior, or bundle-heavy code without
  a reviewed specification and QA plan.

### Other Candidate Paths

If CTC-008 remains blocked, evaluate other live Notion backlog tasks. Prefer
tasks that are:

- independently deliverable;
- aligned with the local-first fixture-backed product direction;
- not dependent on unreviewed providers, API keys, accounts, telemetry, server
  components, or cloud sync;
- not dependent on AGPL, study-only, or unverified third-party code.

## Required Startup Workflow

After confirming clean synchronized `main`:

1. Fetch live Notion candidates and current project context.
2. Read relevant repository docs and source files for the candidate.
3. Critically select the highest-value unblocked task.
4. Record selection, rejected alternatives, dependency rationale, and scope
   boundaries in Notion and `CONTEXT.md`.
5. Move the selected task to the correct handshake status.
6. For runtime work, do not implement before the spec/QA gates required by
   `docs/governance-workflow.md`.
7. If a specification prompt is needed, create a self-contained prompt for the
   accepted Spec Drafter path.
8. Verify prompt artifacts and record hashes.
9. Run startup verification:
   - `npm run check`
   - `git diff --check`
   - `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`
10. Commit/push only appropriate docs/governance startup artifacts to `main`;
    use a branch/PR for runtime implementation.

## Non-Negotiable Guardrails

- Original Chart the Course code remains Apache-2.0.
- Do not copy, modify, adapt, link, combine, incorporate, or distribute
  AGPL-3.0 code from `ace`.
- Treat `hacker-yardage` and `openyardage-web` as study-only unless
  permission/license is verified.
- Do not add providers, API keys, server components, production dependencies,
  production PDF behavior, telemetry, accounts, cloud sync, or external
  user-data flows without explicit reviewed scope.
- Raw GIS source availability must ship in the same release as
  distributed/shared PDF export.
- PDFs containing OSM-derived geometry must include visible searchable OSM
  attribution and the full URL:
  `https://www.openstreetmap.org/copyright`
- Keep direct dependencies exact-pinned.
- Use synthetic fixtures only; automated tests must remain network-isolated.
- Preserve exact raw OSM response/source evidence separately from normalized
  geometry and user-authored project state.
- Notion is long-term memory; `CONTEXT.md` is active repository memory.
