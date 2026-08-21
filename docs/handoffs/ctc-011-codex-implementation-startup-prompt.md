# Codex startup prompt: CTC-011 target risk scoring spike

You are Codex working in the Chart the Course repository. Take ownership of
CTC-011, **Implement target risk scoring spike**, using Gated Delivery. This
prompt starts the task; it does **not** authorize immediate runtime changes.

## Starting point

- Repository: `/Users/jasonalvarez/gitHubRepos/chart-the-course`
- Verified main baseline: `67245d3a50e835791b66477ec8bb41df8d737919`
- CTC-009 fairway-width estimation and CTC-010 club-profile/dispersion are
  already merged to `main` and their Notion tasks are Done.
- Create a fresh feature branch named `ctc-011-target-risk-scoring` from an
  updated, clean `origin/main`. Do not branch from an old CTC-009/010 feature
  branch.

CTC-011 is the next recommended product task because it is the remaining
tactical-planning item that directly depends on CTC-010's completed dispersion
geometry. CTC-012 remains a later cross-cutting QA task; its PDF-export
acceptance wording needs separate alignment with the existing development-only
PDF work before it is selected.

The live Notion acceptance intent is:

1. Compute a dispersion-overlap penalty against available mapped risk geometry,
   including explicitly represented out-of-bounds-like areas if the normalized
   model supports them.
2. Produce a deterministic, explainable lowest-risk target-line result.
3. Present the trade-off without professional coaching, rules, or safety
   advice.
4. Test safe, marginal, and unsafe cases.

## Mandatory first actions

1. Read `AGENTS.md`, `CONTEXT.md`, and `docs/governance-workflow.md` in full.
2. Fetch the live CTC-011 Notion page and project context. Move it to
   `1. Spec Drafting (Gemini)` only when beginning the specification phase;
   record that Codex is acting as the specification/research fallback if Gemini
   is not being used.
3. Run `git status --short --branch`, fetch `origin`, and record the exact
   base commit. Select Node 24 from `.nvmrc` before running JavaScript tooling.
4. Read the relevant implementation and tests before choosing an algorithm:

   - `src/normalize.ts`, `src/map.ts`, `src/dispersion.ts`, and their tests
   - `src/project.ts`, `src/carry.ts`, `src/fairwayWidth.ts`
   - `src/HoleMap.tsx`, `src/App.tsx`, `src/styles.css`
   - `test/e2e/app.spec.ts`
   - `fixtures/overpass/synthetic-golf-course*.json`
   - `docs/overpass-query-contract.md` and `docs/legal-disclaimers.md`
   - CTC-009 and CTC-010 specifications and final-audit handoffs

## Required gate before implementation

Act as the specification/research owner and create a self-contained CTC-011
specification plus a Claude QA-planning prompt. The specification must resolve
the items below with exact types, formulas, deterministic tie breaks, UI copy,
failure states, and tests. Push the planning branch so Claude can independently
inspect the actual checkpoint. Do not change runtime code until Claude returns
`READY FOR IMPLEMENTATION`, or `READY WITH REQUIRED CORRECTIONS` whose stated
corrections are applied and whose response explicitly authorizes implementation.

The Claude planning audit must be asked to challenge, at minimum:

- the relationship between the existing 64-boundary-point dispersion polygon
  and the risk-overlap calculation;
- geometry units, projection failure, degenerate polygons/lines, clipping, and
  out-of-map behavior;
- candidate target generation, score ordering, and all tie-breakers;
- mapped-feature classification, absent or incomplete data, and the distinction
  between golf-specific water and generic water;
- user-facing language, accessibility, state isolation, export/import scope,
  and the no-network/dependency boundaries;
- a test matrix that proves safe, marginal, unsafe, and deterministic outcomes.

## Non-negotiable product and safety boundaries

- The result is a local **mapped-risk planning indicator**, not a shot
  recommendation, playing instruction, professional coaching opinion, legal
  rules determination, or claim that an area is safe, playable, or
  out-of-bounds.
- Do not infer official penalty areas, out-of-bounds, local rules, or course
  conditions from generic geometry. Only score feature categories that the
  current normalized model can identify deterministically, and state exactly
  which categories are included.
- Mapped course data may be incomplete or inaccurate. The UI must disclose
  that the score considers only mapped geometry and must preserve the existing
  instruction to verify yardages, hazards, boundaries, and local course rules.
- Keep all computation client-side and deterministic. Do not add network calls,
  map/tile providers, Overpass calls, API keys, telemetry, accounts, browser
  persistence, PDFs, exports, analytics, production dependencies, or mutable
  user data flows.
- Keep club profiles project-wide and selected risk controls transient unless a
  later approved specification deliberately changes that contract.
- Do not use live course fixtures or third-party golf/course branding.

If the specification uses a golf-rules term or makes a current external claim,
check the relevant primary source, record its URL and check date, and limit the
claim to what that source supports. Prefer neutral language such as “mapped
risk geometry” when a rules term is unnecessary.

## Decisions the specification must make explicitly

Do not leave any of these for the implementer to guess:

1. **Input geometry.** Identify the exact `NormalizedHole` feature kinds and
   geometry types eligible for the score. Say how points, lines, polygons,
   invalid geometry, unassociated features, and generic water are handled.
2. **Overlap method.** Define a pure local algorithm that can be tested without
   an external geometry package. Specify whether it samples the existing
   dispersion boundary, its interior, or both; its fixed sample count/grid;
   boundary semantics; tolerance; and what the penalty numerically represents.
3. **Candidate targets.** Define the source of candidate target lines. Existing
   user targets alone may be too sparse; creating implicit candidates may be
   misleading. Specify creation, ordering, label/ID exposure, duplicate
   handling, and deterministic tie-breaking, or deliberately limit the spike
   to an explainable scored comparison with no generated “best” target.
4. **Score and status contract.** Pin score range, weighting, bands such as
   safe/marginal/unsafe, unavailable/indeterminate states, empty-risk behavior,
   and exact explanatory copy. Never present a low score as a guarantee.
5. **UI state and rendering.** Specify placement and SVG layer ordering; how it
   relates to the dispersion panel; keyboard and screen-reader behavior; and
   responsive behavior. Preserve reset/reload/export semantics unless a change
   is explicitly justified and tested.
6. **Test fixtures.** Add only synthetic deterministic fixtures. Cover expected
   risk classes, projection/geometry failure, deterministic ties, missing or
   incomplete geometry, selected-club/target failure, off-map behavior, and
   accessibility/no-request behavior.

## Rejected approaches

Record these as rejected unless a later approved addendum changes scope:

- Calling a live provider, Overpass, or routing engine to obtain hazards,
  terrain, rules, or recommendations.
- Machine-learning, optimization APIs, opaque scoring, or non-deterministic
  candidate selection.
- Treating generic water, bunkers, vegetation, fairway boundaries, or missing
  data as definitive rules-based penalty/out-of-bounds geometry.
- Persisting the user's selected risk configuration or adding it to raw GIS
  source exports.
- Expanding CTC-011 into PDF production/export, account, coaching, or rules
  functionality.

## Implementation phase (only after the planning gate)

Implement only the Claude-approved specification. Prefer a small pure TypeScript
module (with adjacent unit tests) for scoring and keep React/SVG code limited to
rendering and transient control state. Reuse CTC-010's planar projection and
dispersion contract rather than introducing a competing geodesic model. Do not
modify dependency manifests unless the approved addendum explicitly requires
it; a native deterministic algorithm is the default.

Before the final audit, run under Node 24:

```sh
source "$HOME/.nvm/nvm.sh" && nvm use
npm run check
git diff --check
npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh
```

Record exact results, changed files, source checks, rejected alternatives, and
any remaining uncertainty in `CONTEXT.md` and Notion. Move the task to
`4. Final Audit (Claude)` only after implementation verification. Prepare a
self-contained Claude final-audit prompt containing the exact commit hash,
relevant changed-file contents, acceptance criteria, test evidence, and the
required verdict format (`PASS`, `PASS WITH MINOR FIXES`, or `FAIL`). Do not
mark CTC-011 Done until Claude authorizes it and all blockers are resolved or
explicitly accepted.
