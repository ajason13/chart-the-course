# CTC-007 Claude adversarial QA-planning handoff

## Role and gate

Act as the adversarial QA planner for CTC-007, Add target markers, carry arcs,
and local project model. Critically challenge and complete the corrected
specification baseline before implementation. Claude Chat has no filesystem or
GitHub access; this bundle is self-contained.

CTC-007 is not approved for implementation. Gemini produced one relevant but
unsafe specification and one failed mandatory revision. No decision from the
final revision is accepted. Treat the first embedded critical review as the
sole specification baseline, resolve its mandatory unresolved decisions, and
return an implementation-readiness verdict. Do not write full implementation
code, add dependencies, create new epics, or broaden scope.

## Acceptance criteria

- User can add, edit, and delete target markers per hole.
- Carry arcs render at configurable distances from selected tee or target.
- Project state can export and import as a local JSON file.
- Invalid project files fail gracefully with useful errors.

## Binding boundaries

- Extend the existing dependency-free native React SVG, fixed logical viewBox,
  projection/inverse projection, Haversine distance, Pointer Events, keyboard
  crosshair, attribution, warning, and network-isolated test contracts.
- Preserve CTC-005 normalized OSM geometry and source evidence as immutable.
  Persist user-authored state separately and key holes by exact
  `hole.source.sourceKey`, never array indexes or hole numbers.
- Project state is memory-only plus explicit local JSON import/export.
- No new production dependency, Zod, Canvas replacement, pan/zoom/rotation,
  dragging unless explicitly justified, notes, visual preferences, autosave,
  durable persistence, CTC-019 behavior, provider, API key, account, server,
  cloud sync, PDF/rendered export, or external user-data flow.
- Imported JSON is untrusted `unknown`; do not use `any`, unsafe object
  spreading/merging, automatic migration, partial import, or imported OSM
  geometry/source metadata as trusted runtime evidence.
- Use only synthetic fixtures. Automated tests remain network-isolated.

## Required deterministic decisions

Resolve these as exact implementation rules, correcting any inconsistency you
find in the baseline:

1. Exact strict v1 project JSON shape, literal schema identifier, minimal
   course/source reference, target and carry types, stable collection ordering,
   target ID format/generation, string bounds, filename, MIME type, final
   newline, and maximum file size.
2. Exact dependency-free validator: object/own-property rules, unknown and
   dangerous keys, source-key syntax, duplicates, finite/range checks,
   unsupported version, JSON parse failure, duplicate raw JSON object-key
   policy, structured error code/path/message, and maximum reported errors.
3. Exact import lifecycle: explicit file input, size/read/parse/validate/match
   stages, all-or-nothing state replacement, current-state preservation,
   loaded-course/hole mismatch behavior, focus management, announcements, and
   dirty-state replacement confirmation.
4. Exact deterministic export serialization and object URL cleanup timing that
   is testable and does not revoke before the download can begin.
5. Exact target model and CRUD: free `{ lat, lon }` coordinates, per-hole
   ownership, ordering, labels, placement/reposition modes, pointer/touch and
   keyboard behavior, crosshair reuse, cancel/save, selection, delete
   confirmation or undo, and measurement-mode coexistence.
6. Exact selected-tee origin eligibility for point/polygon/multiple/null/missing
   tee geometry and stable tee source identity. No spatial inference.
7. Exact carry model: selected tee or target origin, count, distance bounds,
   step, storage/display units, invalid-input behavior, deterministic
   geographic destination/sample algorithm using existing constants, sample
   count, closure, antimeridian/pole behavior, radius tolerance, and ordering.
8. Exact SVG rendering: projection-bound expansion or fixed bounds, clipping
   and off-map semantics, target/arc/route/measurement layer order, labels,
   focus semantics, color-independent styling, and mobile behavior.
9. Exact pure-function, Vitest, and Playwright adversarial test matrix proving
   every acceptance criterion, current measurement regressions, safe imports,
   accessibility, attribution, and network isolation.
10. Identify all remaining scope leakage, unsafe assumptions, contradictions,
    or observability needs. Prefer structured returned errors and visible UI
    states; no logging side effects.

## Required verdict format

Return:

1. **Verdict:** exactly `READY`, `READY WITH REQUIRED SPEC CORRECTIONS`, or
   `NOT READY`.
2. **Blocking findings:** numbered, with failure scenario and correction.
3. **Accepted baseline decisions.**
4. **Required corrected decisions:** exact deterministic rules suitable for
   implementation.
5. **Adversarial test matrix:** input/action, expected state/visual result,
   accessibility assertion, and source/security assertion.
6. **Rejected/deferred recommendations.**
7. **Implementation gate:** state whether CTC-007 may move to
   `3. In Development (ChatGPT)` after corrections are recorded.

Treat new dependencies, unsafe imports, raw/normalized OSM trust replacement,
invented contracts, persisted indexes or derived/SVG data, automatic migration,
partial import, flat-plane distance truth, inaccessible interaction, hidden
attribution/warnings, external network access, real-course fixtures, and scope
leakage as blockers.

## Exact relevant repository file contents

<!-- GENERATED EXACT FILES BELOW -->

<!-- BEGIN EXACT FILE 1/16: docs/handoffs/ctc-007-gemini-specification-review.md -->

### docs/handoffs/ctc-007-gemini-specification-review.md

``````text
# CTC-007 Gemini specification critical review

Date: 2026-06-11

## Review verdict

Gemini's response is relevant but not implementation-ready. It correctly keeps
the feature browser-local, proposes explicit interaction modes, recognizes the
need for strict import validation and visible accessibility feedback, and keeps
automated tests network-isolated.

However, it contradicts the embedded CTC-005/006 contracts, invents unsafe and
malformed data structures, exports and later trusts raw OSM data, and adds
multiple deferred features. CTC-007 remains in `1. Spec Drafting (Gemini)`.
No part of the response authorizes implementation or Claude QA planning.

## Accepted decisions

- Keep project editing and explicit JSON file exchange browser-local with no
  network upload, account, server, or cloud-sync behavior.
- Use explicit interaction modes so target placement/editing does not silently
  activate CTC-006 measurement.
- Preserve the current project when an import fails.
- Validate file size before parsing and return visible, useful import errors.
- Use browser `Blob`, object URL, download anchor, and object URL revocation
  for explicit export, subject to deterministic lifecycle tests.
- Provide keyboard-operable controls, minimum 44 CSS-pixel control targets,
  visible focus, live announcements, non-color distinctions, mobile coverage,
  axe checks, and network-isolated Playwright tests.
- Keep pure state/schema/geometry logic separate from React UI state.

## Rejected or corrected decisions

- Reject Canvas, offscreen Canvas, pixel-owned rendering, and a new canvas draw
  controller. Extend the existing native React SVG, fixed logical viewBox,
  projection, inverse projection, and Pointer Events contract.
- Reject replacing the existing Haversine `distanceMeters`,
  `EARTH_RADIUS_M = 6_371_000`, and exact yard conversion with a new
  equirectangular distance engine, a different Earth radius, or unsupported
  accuracy claims. Carry geometry may reuse local projection for display, but
  persisted coordinates and distance truth remain geographic.
- Reject offline-course-download claims. CTC-007 adds no durable OSM cache or
  offline course loading; those concerns remain with CTC-019.
- Reject "AGPL protection compliance." The actual rule is that original Chart
  the Course code remains Apache-2.0 and prohibited AGPL/unlicensed reference
  code must not be copied or adapted.
- Reject drag-and-drop marker movement, live 60-FPS recalculation, map pan,
  zoom, rotation, and sliders as silently selected behavior. These are not
  required by the acceptance criteria and conflict with the current bounded
  SVG interaction surface. Conservative editing uses explicit form fields and
  a reviewed placement/reposition mode.
- Reject notes, marker colors, arc colors, pixel stroke widths, view settings,
  canvas rotation, zoom scale, display-unit preferences, and target-to-tee
  derived values in persisted project data. Notes belong to later work; visual
  styling and derived distances are not user-authored portable state.
- Reject limiting carry arcs to three, default example distances, target-only
  origins, and marker-owned arc arrays without resolving the required selected
  tee or target origin model.
- Reject exporting complete normalized geometry, raw Overpass responses, exact
  query bodies, or imported source metadata in the CTC-007 project file.
  CTC-007 project JSON contains user-authored state plus minimal stable source
  identity references only. Loaded normalized OSM evidence remains the trusted
  in-memory source and is never replaced by imported data.
- Reject invented `GeographicCoordinate { latitude, longitude }`. Reuse the
  authoritative `{ lat, lon }` coordinate contract.
- Reject the proposed top-level marker list because it does not key user state
  by stable `hole.source.sourceKey`. Array indexes and hole numbers are not
  persisted identity.
- Reject arbitrary RFC4122 UUID requirements without a dependency-free ID
  generation and validation decision. Marker identity must be deterministic
  enough for project operations and strictly validated, but the exact format
  remains unresolved.
- Reject `any`, object spreading of imported objects, truthiness defaults, and
  an open migration registry. These permit prototype pollution, preserve
  unknown fields, and invent unsupported migration behavior.
- Reject accepting every positive schema version and automatic migration.
  Conservative v1 policy is exact version match; unsupported versions fail
  with a useful error until a reviewed migration exists.
- Reject the malformed JSON Schema. It has missing `required` arrays,
  inconsistent singular/array TypeScript declarations, no
  `additionalProperties: false`, no hole ownership, and no complete strict
  validation/error contract.
- Reject "HTML sanitization" as the primary imported-string control. Imported
  strings must be strictly length/type validated and rendered as React text,
  never interpreted as HTML.
- Reject generic alerts, logging state changes, garbage-collection claims, and
  unsupported Firefox/CSP assertions. Use visible structured errors, focus
  management, and deterministic pure/helper tests.
- Reject splitting CTC-007 into new project-management tickets or formatting it
  for Notion.

## Corrected specification baseline

### Project document and trust boundary

- Define exactly one supported project document version, represented by a
  literal identifier such as `chart-the-course-project/v1`.
- The document stores user-authored project metadata and per-hole state keyed
  by exact `SourceKey` strings. It does not store normalized geometry, raw OSM
  elements, query bodies, endpoints, imported source metadata, derived
  distances, or visual styling.
- A minimal course/source identity block may contain only reviewed scalar
  references needed to detect mismatch, such as the selected course source key
  and copyright URL literal. It is a reference, not trusted replacement source
  evidence.
- Imported projects are usable only against the currently loaded normalized
  result. Unknown course/hole source keys produce a visible mismatch error or
  unresolved-state result; they never create trusted normalized holes.
- Project state is memory-only. Explicit import replaces the current
  user-authored project only after complete successful validation. Failed
  import leaves current state unchanged.

### Strict import and export

- Parse only a user-selected local `.json` file through an explicit file input.
  Drag-and-drop import is unnecessary for acceptance and deferred by default.
- Resolve and test a conservative maximum UTF-8 file size. Check `File.size`
  before reading and reject oversized content.
- Parse JSON as untrusted `unknown`. Recursively validate exact object shapes,
  own properties, primitive types, finite/ranged numbers, string lengths,
  exact schema version, exact source-key syntax, arrays, duplicate marker IDs,
  duplicate hole keys, carry origins, and coordinate bounds.
- Reject unknown properties at every schema-owned object level, dangerous keys
  such as `__proto__`, `prototype`, and `constructor`, unsupported versions,
  non-finite numbers, and all partial/ambiguous input. Do not spread or merge
  imported objects into application state.
- Return deterministic structured validation errors containing a stable code,
  JSON-style path, and user-facing message. Show an error summary, move focus
  to it, and keep current state unchanged.
- Export deterministic JSON with stable property and collection ordering,
  `application/json`, a reviewed filename, and a final newline. Revoke the
  object URL after activation using a deterministic cleanup path.

### Target model and interactions

- Targets are free user-authored geographic `{ lat, lon }` coordinates owned by
  one stable hole `SourceKey`. No snapping, feature linking, spatial
  association, inferred ownership, or imported source geometry is allowed.
- Define strict target identity, bounded label behavior, ordering, and
  coordinate validation. Do not persist derived distances or visual style.
- Extend the existing SVG with explicit mutually exclusive modes:
  `measure`, `place-target`, and `reposition-target` only if repositioning is
  accepted after review. The default remains measurement.
- Pointer input converts through the existing SVG screen transform and inverse
  projection. Persist only the resulting valid geographic coordinate.
- Keyboard target placement/repositioning reuses a visible bounded logical
  crosshair and documented steps. Escape cancels the active edit without
  mutating state.
- Target edit and delete use ordinary accessible controls outside the SVG.
  Resolve a clear destructive-action policy. Do not silently select dragging,
  pan, zoom, notes, or appearance customization.

### Carry model and rendering

- Carry settings are user-authored per-hole records with an explicit origin:
  either a stable target ID or a strictly resolved selected tee source key.
  Gemini must still resolve deterministic tee eligibility when a hole has zero,
  one, or multiple associated tee features/geometries.
- Define bounded positive carry distances and exact unit storage. Conservative
  default is store integer yards and display yards/meters without a persisted
  unit preference.
- Carry rings/arcs render in new deterministic SVG groups between route/source
  geometry and targets/measurement overlays. Styling uses reviewed
  color-independent strokes/dashes and accessible textual settings/results.
- Define geographic circle sampling from the origin with the existing Earth
  radius, then project samples through the existing projection. Resolve sample
  count, closure, antimeridian/pole behavior, viewport clipping, off-map
  semantics, projection-bound expansion policy, labels, and bounded tests.
- Never persist SVG/logical coordinates or claim a projected circle is
  geodesically exact.

### Tests and security

- Add pure tests for exact schema validation, deterministic serialization,
  source-key/hole mismatch, duplicate IDs/keys, finite/range checks, unknown
  fields, dangerous keys, unsupported versions, oversized files, and
  all-or-nothing import.
- Add pure carry tests for origin resolution, geographic samples, radius
  tolerance using existing Haversine distance, projection, ordering, and
  invalid inputs.
- Extend Playwright for explicit modes, pointer/keyboard target CRUD,
  measurement regression, carry settings/rendering, import/export round trip,
  invalid-file focus/errors, mobile layout, axe, attribution, and network
  isolation.
- Imported strings render only as text. No `innerHTML`, dynamic code,
  executable content, unsafe merge, logging side effects, or network upload.

## Mandatory unresolved decisions for Gemini revision

1. Exact v1 JSON shape, source-reference fields, target ID format, label
   bounds, collection ordering, filename, MIME, final-newline rule, maximum
   file size, and structured validation error codes/paths.
2. Whether duplicate JSON object keys must be detected before `JSON.parse`, or
   whether strict post-parse validation plus duplicate semantic IDs/keys is the
   accepted v1 boundary.
3. Exact loaded-course/hole mismatch behavior and whether unresolved imported
   hole state is rejected or retained but inactive.
4. Exact target repositioning interaction. Conservative default is explicit
   mode with pointer/keyboard placement, not unconstrained dragging.
5. Delete confirmation versus immediate delete plus undo, with accessible
   focus/live behavior.
6. Exact selected-tee eligibility and origin identity for point, polygon,
   multiple, null, or missing tee geometry.
7. Carry-distance count, bounds, step, storage unit, geographic sample
   algorithm/count, clipping, labels, off-map behavior, and whether target/arc
   coordinates expand projection bounds.
8. Exact SVG layer order and measurement/target mode coexistence.

## Red lines for later Claude QA planning

Treat these as blockers:

- Canvas replacement, new production dependencies, pan/zoom/rotation, notes,
  visual preferences, autosave, durable persistence, CTC-019 behavior, PDF, or
  external user-data flows;
- imported or exported raw/normalized OSM geometry being trusted as current
  source evidence;
- persisted array indexes, hole numbers as identity, derived distance, SVG
  coordinates, or unsafe imported objects;
- `any`, object spreading/merging of imported data, unknown-field acceptance,
  prototype-pollution exposure, partial import, or automatic unreviewed
  migration;
- replacing existing Haversine/projection constants or fabricating accuracy or
  performance claims;
- target editing that silently activates measurement, inaccessible
  pointer-only CRUD, hidden attribution, color-only semantics, or networked
  tests.

## Final Gemini revision disposition

Gemini received a mandatory revision prompt with nine explicit corrections.
The revision is rejected in full because it:

- introduced an unapproved Zod production dependency and generated types
  instead of defining dependency-free strict validation;
- retained `any`, object spreading/merging of imported objects, automatic
  migrations, unknown legacy input defaults, and unsafe partial update types;
- retained notes, colors, display-unit preferences, global settings, pan,
  dragging, automatic course switching, and error-boundary logging;
- invented course geometry/state contracts, tuple coordinates, source keys,
  file/module structure, and OSM IDs that contradict the embedded repository;
- again replaced existing projection/Haversine constants with new Earth radii,
  flat-plane distance assumptions, browser-pixel math, and unsupported
  precision/performance claims;
- persisted or trusted OSM-derived course identity and attribution fields
  without resolving the minimal source-reference trust boundary;
- proposed malformed schemas, fixtures, reducer initializers, and examples
  that would not compile or validate;
- failed to resolve exact target ID, strict v1 shape, duplicate-key policy,
  course/hole mismatch behavior, tee-origin eligibility, carry sample count,
  geographic sampling, layer order, clipping, and accessible destructive
  actions while claiming zero blockers.

No decisions from the final revision are accepted. The corrected baseline and
mandatory unresolved decisions in this document are the sole specification
authority for Claude adversarial QA planning.
``````

<!-- END EXACT FILE 1/16: docs/handoffs/ctc-007-gemini-specification-review.md -->

<!-- BEGIN EXACT FILE 2/16: AGENTS.md -->

### AGENTS.md

``````text
# Repository Guidelines

## Project Structure & Module Organization

This repository contains the initial Chart the Course browser app scaffold plus governance docs. Runtime source lives in `src/`, Playwright smoke tests live in `test/e2e/`, and deterministic fixtures live in `fixtures/`. Root documents define project policy and status: `README.md`, `CONTRIBUTING.md`, `CONTEXT.md`, `SECURITY.md`, `ATTRIBUTION.md`, `THIRD_PARTY_NOTICES.md`, and `LICENSE`. Focused decision records live in `docs/`, including tile-provider, governance-workflow, legal-disclaimer, reference-reuse, and Overpass-contract guidance. Automation lives in `scripts/`; `scripts/compliance.sh` delegates to the canonical npm compliance flow. Dependency metadata is tracked in `package.json`, `package-lock.json`, and generated `sbom.json`.

## Build, Test, and Development Commands

- `npm ci`: install dependencies from the lockfile.
- `npm run dev`: start the Vite app on `127.0.0.1`.
- `npm run verify:scaffold`: enforce exact direct dependency pins, Node 24,
  React bootstrap, and SHA-pinned/read-only CI policy.
- `npm run build`: type-check and build the browser app.
- `npm run test:unit`: run Vitest unit tests.
- `npm run test:e2e`: run Playwright smoke tests against the local preview server.
- `npm run check`: run app build, unit tests, and Playwright smoke tests.
- `npm run generate:sbom`: regenerate `sbom.json` with CycloneDX.
- `npm run license:check`: run production dependency allowlist and denylist checks.
- `npm run audit:prod`: run `npm audit --omit=dev --audit-level=high`.
- `npm run compliance`: run SBOM generation, license checks, and production audit.
- `scripts/compliance.sh`: shell wrapper for the same compliance flow.
- `git diff --check`: catch whitespace errors before review.

The current React app shell is intentionally local-first and fixture-backed.
Use Node 24 LTS and npm 11 as declared in `.nvmrc` and `package.json`. Keep
direct dependencies exact-pinned. Do not add Overpass runtime calls, map
providers, basemap tiles, PDF export behavior, additional production
dependencies, API keys, or user data flows unless the selected task explicitly
covers them and governance docs are updated.

## Agent Workflow

Before starting a task, run `git status --short --branch`, read `CONTEXT.md`,
and fetch the current Notion task. Notion is long-term memory; `CONTEXT.md` is
active repo memory. Move active Codex work to `3. In Development (ChatGPT)`,
then to `4. Final Audit (Claude)` for review, and only mark `5. Done` after
Claude findings are resolved or explicitly accepted. For docs-only governance
tasks, the Gemini/Claude planning handoff may be skipped only under
`docs/governance-workflow.md`; final Claude audit is still required.

## Coding Style & Naming Conventions

Keep Markdown concise, source-linked where policy depends on external terms, and specific to Chart the Course. Use sentence-case prose, fenced command examples, and relative paths such as `docs/tile-provider-strategy.md`. Shell scripts should use POSIX `sh` unless a stronger shell is required; keep `set -eu` for fail-fast behavior. Package scripts should remain explicit and composable.

## Testing Guidelines

Unit tests use Vitest and should sit next to the source as `*.test.ts`. Browser smoke tests use Playwright under `test/e2e/`. For current changes, run `npm run check`, `git diff --check`, and `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh` before review.

## Commit & Pull Request Guidelines

Recent commits use short imperative subjects, often referencing CTC task IDs, for example `Document CTC-018 tile provider strategy` and `Resolve CTC-003 audit minor fixes`. Keep commits focused on one task. Pull requests should include a brief summary, verification commands and results, linked task or issue, governance impact, and screenshots only when UI changes exist.

## Security & Governance Notes

Do not copy or adapt AGPL-3.0 code from `ace`. Treat `hacker-yardage` and `openyardage-web` as study-only unless permissions are verified. Do not add map providers, production dependencies, API keys, PDF export behavior, or user data flows without updating the relevant docs and compliance posture. Use GitHub private vulnerability reporting until a monitored security email exists.
``````

<!-- END EXACT FILE 2/16: AGENTS.md -->

<!-- BEGIN EXACT FILE 3/16: docs/governance-workflow.md -->

### docs/governance-workflow.md

``````text
# Governance Workflow

Status: Updated on 2026-06-05 after CTC-018.

Chart the Course uses a document-first workflow. Notion is long-term project
memory, and `CONTEXT.md` is active repository memory for the next agent or
developer.

## Standard Task Flow

1. Fetch the active Notion task and relevant project context.
2. Move the task to `3. In Development (ChatGPT)` when Codex starts work.
3. Update repository governance docs and `CONTEXT.md` as needed.
4. Run verification:

```bash
git diff --check
npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh
```

5. Commit and push according to the task's delivery path.
6. Move the task to `4. Final Audit (Claude)` and provide Claude a
   self-contained audit prompt.
7. Apply blocking or accepted minor fixes, rerun verification, and commit.
8. Mark the task `5. Done` in Notion and update `CONTEXT.md`.

## Docs-Only Governance Exception

For repository documentation or governance-only tasks, separate Gemini research
and separate Claude adversarial planning may be skipped when all are true:

- No runtime app code is added or changed.
- No production dependency, provider integration, API key, deployment behavior,
  or user data flow is added.
- Codex checks current primary sources directly when the task depends on
  provider, legal, standards, or security terms.
- Source URLs and check dates are recorded in the repo docs or Notion.
- Claude final audit still happens before Done.

Do not use this exception for app scaffolds, provider integrations, security
controls, PDF export behavior, data ingestion code, dependency adoption, or
changes that affect deployed behavior.

## Claude Chat Audit Prompts

Claude Chat does not have access to the local filesystem or GitHub by default.
Final audit prompts must be self-contained and include:

- Role and audit stage.
- Task objective and acceptance criteria.
- Prior governance context.
- Commit hash and verification evidence.
- Source URLs and source-check date when external terms matter.
- Exact contents of every changed file relevant to the audit.
- Explicit note when the docs-only governance exception was used.
- Required verdict format: `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`.

Ask Claude to distinguish blockers from minor fixes and to state whether the
task may be marked Done after any minor fixes are applied.
``````

<!-- END EXACT FILE 3/16: docs/governance-workflow.md -->

<!-- BEGIN EXACT FILE 4/16: docs/tile-provider-strategy.md -->

### docs/tile-provider-strategy.md

``````text
# Tile Provider Strategy

Status: Selected for MVP on 2026-06-04 under CTC-018.

Chart the Course must choose a compliant base-map strategy before any deployed
map scaffold. The MVP must not depend on the OpenStreetMap public tile CDN for
deployed use, must keep attribution visible, and must leave room for a later
provider change without reshaping the yardage-book workflow.

## Decision

The selected MVP strategy is blank/vector-only rendering of OSM-derived course
geometry, user-authored target lines, yardage markers, hazards, notes, and
print/PDF overlays. The deployed MVP must not load third-party basemap tiles by
default.

Fallback path:

1. If users need geographic context beyond course geometry, self-host a scoped
   PMTiles/Protomaps basemap extract in project-controlled storage.
2. If operational burden is too high, evaluate MapTiler or Stadia under a paid
   or explicitly approved plan before enabling hosted basemap tiles.
3. If a provider's terms, attribution requirements, pricing, or service
   availability change materially, disable that provider in deployed builds
   until the policy is re-reviewed.

## Non-Negotiable Rules

- Do not use `https://tile.openstreetmap.org/{z}/{x}/{y}.png` or any other OSM
  public tile CDN endpoint in deployed Chart the Course builds without explicit
  project approval.
- Do not add prefetch, bulk-download, scraping, or offline tile caching features
  against public tile services unless the provider's plan and terms expressly
  allow them.
- Do not hide attribution behind app chrome, overlays, collapsed controls, or
  off-screen UI when a map or map-derived export is visible.
- Keep the tile provider configurable behind a provider adapter boundary when a
  map scaffold is introduced. Course geometry, yardage calculations, and PDF
  export must not assume a specific basemap vendor.

## Attribution Requirements

Even without third-party basemap tiles, Chart the Course uses OSM-derived course
geometry. OSM attribution remains required in UI views and PDFs that display or
export that geometry.

Required UI attribution for MVP geometry-only views:

```text
Course data © OpenStreetMap contributors
https://www.openstreetmap.org/copyright
```

Required PDF attribution for MVP geometry-only exports:

```text
Course geometry and map data © OpenStreetMap contributors.
OpenStreetMap copyright and license: https://www.openstreetmap.org/copyright
```

If a third-party basemap provider is enabled later, its attribution must appear
where the provider requires it:

- UI: visible on every map view using that provider, with links when the medium
  supports links.
- PDF/print: visible near the map, in a footer, citation, or acknowledgements
  block as permitted by the provider, including full URLs when links are not
  possible.
- Notices: listed in `THIRD_PARTY_NOTICES.md` with provider name, source data,
  plan or hosting mode, required attribution text, and verification date.

## Option Comparison

| Option | Fit | Attribution | Operational notes | Decision |
| --- | --- | --- | --- | --- |
| Blank/vector-only MVP | Best for first deployed app. Supports hole layout, yardage planning, target lines, notes, and PDF output without basemap tiles. | OSM attribution still required for OSM-derived course geometry in UI and PDFs. No provider attribution required. | Lowest vendor, cost, API-key, and availability risk. Less surrounding geographic context. | Selected for MVP. |
| Self-hosted PMTiles/Protomaps | Strong fallback when surrounding context becomes necessary. | Protomaps basemap downloads are OSM-derived Produced Works, so OSM attribution is required. Also preserve any Protomaps/OpenMapTiles/style notices that apply to selected assets. | Requires storage, CDN/range-request support, update workflow, integrity checks, and scoped extracts to avoid large planet-file operations. | Preferred fallback. |
| MapTiler | Viable hosted provider after plan review. | MapTiler docs require visible MapTiler and OpenStreetMap attribution; free accounts also require a MapTiler logo. Printed/static media need comparable visible attribution. | Requires API key, plan limits, billing review, and provider-specific UI/PDF attribution checks. | Defer until basemap need is proven. |
| Stadia Maps | Viable hosted provider after plan review. | Stadia requires Stadia Maps, OpenMapTiles, and OpenStreetMap attribution for most styles; Stamen-origin styles require "Map tiles by Stamen Design" with `stamen.com` URL in print. Print must include required URLs such as `stadiamaps.com` and `openstreetmap.org/copyright`. | Requires API key/domain configuration, plan review, and style-specific notices. | Defer until basemap need is proven. |
| Thunderforest | Viable niche/activity-map provider, not a first choice for MVP. | Terms require Thunderforest and OpenStreetMap contributor attribution, with printed-media text using provider and OSM copyright URLs. | Registration and subscription model; no caching proxies or redistribution; more style-specific than needed for yardage-book MVP. | Not selected. |
| OpenFreeMap | Interesting free hosted vector option, not conservative enough for MVP. | OSM-derived attribution still applies; provider terms are broad, as-is, and may change. | Free as-is service with no availability warranty and discontinuation risk. Suitable for experiments, not project default. | Not selected for deployed MVP. |
| Esri basemaps | Mature commercial ecosystem, but excess scope for MVP. | Esri basemaps require Esri/source attribution depending on layer. | Terms, account requirements, SDK/provider coupling, and non-OSM data sources add policy complexity. | Not selected. |

## Source Notes

Research was checked against official provider or project pages on 2026-06-04:

- OpenStreetMap Foundation Operations tile policy: public OSM tile servers have
  limited capacity, require visible attribution, valid browser referrer behavior,
  caching, and prohibit scraping or heavy inappropriate use.
  <https://operations.osmfoundation.org/policies/tiles/>
- OpenStreetMap copyright and attribution guide: OSM data use requires credit
  and ODbL clarity; printed media should include the full copyright URL.
  <https://www.openstreetmap.org/copyright/attribution-guide/>
- Protomaps basemap downloads: Protomaps basemap is OSM-derived, distributed as
  an ODbL Produced Work, and hotlinking downloads is discouraged in favor of
  copying to controlled cloud storage.
  <https://docs.protomaps.com/basemaps/downloads>
- MapTiler attribution guide and copyright page: MapTiler maps require visible
  MapTiler and OpenStreetMap attribution; free accounts require a MapTiler logo.
  <https://docs.maptiler.com/guides/map-design/attribution/add-attribution/>
  <https://www.maptiler.com/copyright/>
- Stadia Maps attribution guide: hosted maps require provider and source
  attribution; print/video outputs must include applicable provider/source URLs.
  <https://docs.stadiamaps.com/attribution/>
- Thunderforest terms: attribution must credit Thunderforest and OpenStreetMap,
  with separate printed-media wording.
  <https://www.thunderforest.com/terms/>
- OpenFreeMap terms: free service is provided as-is and may be discontinued.
  <https://openfreemap.org/tos/>
``````

<!-- END EXACT FILE 4/16: docs/tile-provider-strategy.md -->

<!-- BEGIN EXACT FILE 5/16: ATTRIBUTION.md -->

### ATTRIBUTION.md

``````text
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
``````

<!-- END EXACT FILE 5/16: ATTRIBUTION.md -->

<!-- BEGIN EXACT FILE 6/16: SECURITY.md -->

### SECURITY.md

``````text
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
``````

<!-- END EXACT FILE 6/16: SECURITY.md -->

<!-- BEGIN EXACT FILE 7/16: package.json -->

### package.json

``````text
{
  "name": "chart-the-course",
  "version": "0.0.0",
  "private": true,
  "description": "Browser-based yardage book and course layout generator.",
  "license": "Apache-2.0",
  "type": "module",
  "engines": {
    "node": ">=24 <25",
    "npm": ">=11 <12"
  },
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "test": "npm run test:unit && npm run test:e2e",
    "verify:scaffold": "node scripts/verify-scaffold.mjs",
    "check": "npm run verify:scaffold && npm run build && npm run test",
    "install:ci": "npm ci",
    "generate:sbom": "npx @cyclonedx/cyclonedx-npm --omit dev --output-format JSON --output-file sbom.json --validate",
    "build:sbom": "npm run install:ci && npm run generate:sbom",
    "license:allow": "npx license-checker-rseidelsohn --production --excludePrivatePackages --onlyAllow \"MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;OFL-1.1;CC0-1.0;Unlicense;0BSD\"",
    "license:deny": "npx license-checker-rseidelsohn --production --excludePrivatePackages --failOn \"GPL-2.0-only;GPL-3.0-only;AGPL-3.0;UNLICENSED\"",
    "license:check": "npm run license:allow && npm run license:deny",
    "audit:prod": "npm audit --omit=dev --audit-level=high",
    "compliance": "npm run generate:sbom && npm run license:check && npm run audit:prod"
  },
  "devDependencies": {
    "@axe-core/playwright": "4.11.3",
    "@cyclonedx/cyclonedx-npm": "2.1.0",
    "@playwright/test": "1.60.0",
    "@types/react": "19.2.0",
    "@types/react-dom": "19.2.0",
    "@vitejs/plugin-react": "6.0.2",
    "license-checker-rseidelsohn": "4.4.2",
    "typescript": "6.0.3",
    "vite": "8.0.16",
    "vitest": "4.1.8"
  },
  "dependencies": {
    "react": "19.2.7",
    "react-dom": "19.2.7"
  }
}
``````

<!-- END EXACT FILE 7/16: package.json -->

<!-- BEGIN EXACT FILE 8/16: src/overpass.ts -->

### src/overpass.ts

``````text
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
``````

<!-- END EXACT FILE 8/16: src/overpass.ts -->

<!-- BEGIN EXACT FILE 9/16: src/normalize.ts -->

### src/normalize.ts

``````text
import type { OverpassElement, OverpassResponse, SourceMetadata } from "./overpass";

export type Coordinate = { lat: number; lon: number };
export type SourceKey = `${OverpassElement["type"]}/${number}`;

export type SourceRecord = {
  sourceKey: SourceKey;
  type: OverpassElement["type"];
  id: number;
  tags: Record<string, unknown>;
  rawNodes?: unknown;
  rawGeometry?: unknown;
  rawMembers?: unknown;
};

export type Geometry =
  | { type: "point"; coordinate: Coordinate }
  | { type: "line"; coordinates: Coordinate[] }
  | { type: "polygon"; coordinates: Coordinate[] };

export type FeatureKind =
  | "tee" | "green" | "fairway" | "bunker" | "rough"
  | "golf-water" | "generic-water" | "vegetation";

export type NormalizedFeature = {
  kind: FeatureKind;
  classifiedBy: readonly [string, string];
  source: SourceRecord;
  geometry: Geometry | null;
};

export type NormalizedHole = {
  number: number | null;
  par: number | null;
  source: SourceRecord;
  route: Geometry | null;
  features: NormalizedFeature[];
};

export type CourseCandidate = {
  classifiedBy: readonly ["leisure", "golf_course"];
  source: SourceRecord;
  geometry: Geometry | null;
};

export type WarningCode =
  | "AMBIGUOUS_FEATURE_REF"
  | "AMBIGUOUS_HOLE_ORDER"
  | "DUPLICATE_SOURCE_KEY"
  | "MALFORMED_CONSUMED_TAG"
  | "MISSING_GREEN"
  | "MISSING_OR_MALFORMED_GEOMETRY"
  | "MISSING_TEE"
  | "MULTIPLE_COURSE_CANDIDATES"
  | "UNSUPPORTED_RELATION"
  | "ZERO_COURSE_CANDIDATES";

export type NormalizationWarning = {
  code: WarningCode;
  severity: "error" | "warning";
  affectedIdentity: string;
  holeNumber?: number;
  sourceKey?: SourceKey;
  refs: SourceKey[];
};

export type NormalizationResult = {
  source: SourceMetadata;
  courseCandidates: CourseCandidate[];
  holes: NormalizedHole[];
  unassociatedFeatures: NormalizedFeature[];
  warnings: NormalizationWarning[];
};

type Classification =
  | { kind: "course"; classifiedBy: readonly ["leisure", "golf_course"] }
  | { kind: "hole"; classifiedBy: readonly ["golf", "hole"] }
  | { kind: FeatureKind; classifiedBy: readonly [string, string] };

const STRICT_POSITIVE_INTEGER = /^[1-9][0-9]*$/;
const GOLF_FEATURES = ["tee", "green", "fairway", "bunker", "rough"] as const;
const GOLF_WATER = ["water_hazard", "lateral_water_hazard"] as const;
const NATURAL_VEGETATION = ["wood", "tree", "tree_row", "scrub"] as const;
const LANDUSE_WATER = ["reservoir", "basin"] as const;

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sourceKey(element: OverpassElement): SourceKey {
  return `${element.type}/${element.id}`;
}

function canonical(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "number") {
    if (Number.isNaN(value)) return '"NaN"';
    if (value === Infinity) return '"Infinity"';
    if (value === -Infinity) return '"-Infinity"';
    return JSON.stringify(Object.is(value, -0) ? 0 : value);
  }
  if (typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => compareText(left, right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${canonical(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(String(value));
}

function tagsOf(element: OverpassElement): Record<string, unknown> {
  return element.tags && typeof element.tags === "object" && !Array.isArray(element.tags)
    ? element.tags
    : {};
}

function recordOf(element: OverpassElement): SourceRecord {
  return {
    sourceKey: sourceKey(element),
    type: element.type,
    id: element.id,
    tags: tagsOf(element),
    ...("nodes" in element ? { rawNodes: element.nodes } : {}),
    ...("geometry" in element ? { rawGeometry: element.geometry } : {}),
    ...("members" in element ? { rawMembers: element.members } : {}),
  };
}

function tag(element: OverpassElement, key: string): string | null {
  const value = tagsOf(element)[key];
  return typeof value === "string" ? value : null;
}

function oneOf<T extends readonly string[]>(value: string | null, values: T): value is T[number] {
  return value !== null && values.includes(value);
}

function classify(element: OverpassElement): Classification | null {
  const golf = tag(element, "golf");
  if (golf === "hole") return { kind: "hole", classifiedBy: ["golf", "hole"] };
  if (oneOf(golf, GOLF_FEATURES)) return { kind: golf, classifiedBy: ["golf", golf] };
  if (oneOf(golf, GOLF_WATER)) return { kind: "golf-water", classifiedBy: ["golf", golf] };
  if (tag(element, "leisure") === "golf_course") {
    return { kind: "course", classifiedBy: ["leisure", "golf_course"] };
  }
  if (tag(element, "natural") === "water") return { kind: "generic-water", classifiedBy: ["natural", "water"] };
  const waterway = tag(element, "waterway");
  if (waterway !== null) return { kind: "generic-water", classifiedBy: ["waterway", waterway] };
  const water = tag(element, "water");
  if (water !== null) return { kind: "generic-water", classifiedBy: ["water", water] };
  const landuse = tag(element, "landuse");
  if (oneOf(landuse, LANDUSE_WATER)) return { kind: "generic-water", classifiedBy: ["landuse", landuse] };
  const natural = tag(element, "natural");
  if (oneOf(natural, NATURAL_VEGETATION)) return { kind: "vegetation", classifiedBy: ["natural", natural] };
  if (landuse === "forest") return { kind: "vegetation", classifiedBy: ["landuse", "forest"] };
  return null;
}

function validCoordinate(value: unknown): value is Coordinate {
  if (!value || typeof value !== "object") return false;
  const coordinate = value as Record<string, unknown>;
  return typeof coordinate.lat === "number"
    && Number.isFinite(coordinate.lat)
    && coordinate.lat >= -90
    && coordinate.lat <= 90
    && typeof coordinate.lon === "number"
    && Number.isFinite(coordinate.lon)
    && coordinate.lon >= -180
    && coordinate.lon <= 180;
}

function isArea(classification: Classification): boolean {
  if (classification.kind === "course") return true;
  if (["tee", "green", "fairway", "bunker", "rough", "golf-water"].includes(classification.kind)) return true;
  if (classification.kind === "generic-water") return classification.classifiedBy[0] !== "waterway";
  if (classification.kind === "vegetation") return classification.classifiedBy[1] !== "tree"
    && classification.classifiedBy[1] !== "tree_row";
  return false;
}

function geometryOf(element: OverpassElement, classification: Classification): Geometry | null {
  if (element.type === "relation") return null;
  if (element.type === "node") {
    return validCoordinate(element) ? { type: "point", coordinate: { lat: element.lat, lon: element.lon } } : null;
  }
  const raw = element.geometry;
  if (!Array.isArray(raw) || !raw.every(validCoordinate)) return null;
  const coordinates = raw.map(({ lat, lon }) => ({ lat, lon }));
  if (isArea(classification)) {
    if (coordinates.length < 4) return null;
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    return first.lat === last.lat && first.lon === last.lon ? { type: "polygon", coordinates } : null;
  }
  return coordinates.length >= 2 ? { type: "line", coordinates } : null;
}

function strictInteger(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return STRICT_POSITIVE_INTEGER.test(trimmed) ? Number(trimmed) : null;
}

function warning(
  code: WarningCode,
  severity: NormalizationWarning["severity"],
  affectedIdentity: string,
  refs: SourceKey[] = [],
  holeNumber?: number,
  key?: SourceKey,
): NormalizationWarning {
  return {
    code,
    severity,
    affectedIdentity,
    refs: [...refs].sort(),
    ...(holeNumber === undefined ? {} : { holeNumber }),
    ...(key === undefined ? {} : { sourceKey: key }),
  };
}

function compareWarnings(left: NormalizationWarning, right: NormalizationWarning): number {
  return compareText(left.code, right.code)
    || (left.holeNumber ?? Number.POSITIVE_INFINITY) - (right.holeNumber ?? Number.POSITIVE_INFINITY)
    || compareText(left.sourceKey ?? "", right.sourceKey ?? "")
    || compareText(left.affectedIdentity, right.affectedIdentity);
}

function deduplicateElements(elements: OverpassElement[], warnings: NormalizationWarning[]): OverpassElement[] {
  const grouped = new Map<SourceKey, OverpassElement[]>();
  for (const element of elements) {
    const key = sourceKey(element);
    grouped.set(key, [...(grouped.get(key) ?? []), element]);
  }
  return [...grouped.entries()]
    .sort(([left], [right]) => compareText(left, right))
    .map(([key, records]) => {
      if (records.length > 1) warnings.push(warning("DUPLICATE_SOURCE_KEY", "error", key, records.map(sourceKey), undefined, key));
      return [...records].sort((left, right) => compareText(canonical(left), canonical(right)))[0];
    });
}

export function normalizeGolfCourse(response: OverpassResponse, source: SourceMetadata): NormalizationResult {
  const warnings: NormalizationWarning[] = [];
  const elements = deduplicateElements(response.elements, warnings);
  const courseCandidates: CourseCandidate[] = [];
  const holes: NormalizedHole[] = [];
  const features: Array<{ feature: NormalizedFeature; ref: number | null }> = [];

  for (const element of elements) {
    const classification = classify(element);
    if (!classification) continue;
    const sourceRecord = recordOf(element);
    const geometry = geometryOf(element, classification);
    if (element.type === "relation") {
      warnings.push(warning("UNSUPPORTED_RELATION", "warning", sourceRecord.sourceKey, [sourceRecord.sourceKey], undefined, sourceRecord.sourceKey));
    } else if (!geometry) {
      warnings.push(warning("MISSING_OR_MALFORMED_GEOMETRY", "error", sourceRecord.sourceKey, [sourceRecord.sourceKey], undefined, sourceRecord.sourceKey));
    }

    if (classification.kind === "course") {
      courseCandidates.push({ classifiedBy: classification.classifiedBy, source: sourceRecord, geometry });
      continue;
    }
    if (classification.kind === "hole") {
      const number = strictInteger(sourceRecord.tags.ref);
      const par = strictInteger(sourceRecord.tags.par);
      if ("par" in sourceRecord.tags && par === null) {
        warnings.push(warning("MALFORMED_CONSUMED_TAG", "warning", `${sourceRecord.sourceKey}:par`, [sourceRecord.sourceKey], undefined, sourceRecord.sourceKey));
      }
      holes.push({ number, par, source: sourceRecord, route: geometry, features: [] });
      continue;
    }
    if (!geometry && element.type !== "relation") continue;
    features.push({
      feature: { kind: classification.kind, classifiedBy: classification.classifiedBy, source: sourceRecord, geometry },
      ref: strictInteger(sourceRecord.tags.ref),
    });
  }

  courseCandidates.sort((left, right) => {
    const rank = (candidate: CourseCandidate) => candidate.geometry?.type === "polygon" ? 0 : candidate.source.type === "relation" ? 1 : 2;
    return rank(left) - rank(right) || compareText(left.source.sourceKey, right.source.sourceKey);
  });
  holes.sort((left, right) => (left.number ?? Number.POSITIVE_INFINITY) - (right.number ?? Number.POSITIVE_INFINITY)
    || compareText(left.source.sourceKey, right.source.sourceKey));

  if (courseCandidates.length === 0) warnings.push(warning("ZERO_COURSE_CANDIDATES", "error", "course-candidates"));
  if (courseCandidates.length > 1) {
    warnings.push(warning("MULTIPLE_COURSE_CANDIDATES", "warning", "course-candidates", courseCandidates.map(({ source: record }) => record.sourceKey)));
  }

  const holesByNumber = new Map<number, NormalizedHole[]>();
  for (const hole of holes) {
    if (hole.number !== null) holesByNumber.set(hole.number, [...(holesByNumber.get(hole.number) ?? []), hole]);
  }
  const duplicateNumbers = [...holesByNumber.entries()].filter(([, matches]) => matches.length > 1);
  if (duplicateNumbers.length > 0 || (holes.some(({ number }) => number !== null) && holes.some(({ number }) => number === null))) {
    warnings.push(warning("AMBIGUOUS_HOLE_ORDER", "warning", "holes", holes.map(({ source: record }) => record.sourceKey)));
  }

  const unassociatedFeatures: NormalizedFeature[] = [];
  for (const { feature, ref } of features.sort((left, right) => compareText(left.feature.source.sourceKey, right.feature.source.sourceKey))) {
    const matches = ref === null ? [] : holesByNumber.get(ref) ?? [];
    if (matches.length === 1) matches[0].features.push(feature);
    else {
      unassociatedFeatures.push(feature);
      if (ref !== null) {
        warnings.push(warning("AMBIGUOUS_FEATURE_REF", "warning", feature.source.sourceKey, [feature.source.sourceKey], undefined, feature.source.sourceKey));
      }
    }
  }

  for (const hole of holes) {
    hole.features.sort((left, right) => compareText(left.source.sourceKey, right.source.sourceKey));
    if (hole.number === null) continue;
    if (!hole.features.some(({ kind }) => kind === "tee")) {
      warnings.push(warning("MISSING_TEE", "error", hole.source.sourceKey, [hole.source.sourceKey], hole.number, hole.source.sourceKey));
    }
    if (!hole.features.some(({ kind }) => kind === "green")) {
      warnings.push(warning("MISSING_GREEN", "error", hole.source.sourceKey, [hole.source.sourceKey], hole.number, hole.source.sourceKey));
    }
  }

  const uniqueWarnings = new Map<string, NormalizationWarning>();
  for (const entry of warnings) uniqueWarnings.set(`${entry.code}:${entry.affectedIdentity}`, entry);

  return {
    source,
    courseCandidates,
    holes,
    unassociatedFeatures,
    warnings: [...uniqueWarnings.values()].sort(compareWarnings),
  };
}
``````

<!-- END EXACT FILE 9/16: src/normalize.ts -->

<!-- BEGIN EXACT FILE 10/16: src/map.ts -->

### src/map.ts

``````text
import type {
  Coordinate,
  Geometry,
  NormalizationWarning,
  NormalizedHole,
} from "./normalize";

export const VIEWBOX_WIDTH = 800;
export const VIEWBOX_HEIGHT = 600;
export const VIEWBOX_PADDING = 40;
export const INNER_MIN_X = VIEWBOX_PADDING;
export const INNER_MAX_X = VIEWBOX_WIDTH - VIEWBOX_PADDING;
export const INNER_MIN_Y = VIEWBOX_PADDING;
export const INNER_MAX_Y = VIEWBOX_HEIGHT - VIEWBOX_PADDING;
export const INNER_WIDTH = INNER_MAX_X - INNER_MIN_X;
export const INNER_HEIGHT = INNER_MAX_Y - INNER_MIN_Y;
export const MIN_EXTENT_M = 20;
export const EARTH_RADIUS_M = 6_371_000;
export const YARDS_PER_METER = 1 / 0.9144;

export type ViewportPoint = { x: number; y: number };

export type Projection = {
  center: Coordinate;
  cosLat: number;
  scale: number;
  minX: number;
  minY: number;
  offsetX: number;
  offsetY: number;
};

export type ProjectionFailure =
  | { kind: "no-valid-coordinates" }
  | { kind: "near-pole" }
  | { kind: "invalid-projection" };

export type DistanceFailure = { kind: "invalid-coordinates" };

export type ScaleBar = {
  meters: number;
  logicalLength: number;
  label: string;
};

export const LAYER_ORDER = [
  "vegetation",
  "generic-water",
  "golf-water",
  "rough",
  "fairway",
  "bunker",
  "green",
  "tee",
] as const;

export function validCoordinate(value: unknown): value is Coordinate {
  if (!value || typeof value !== "object") return false;
  const coordinate = value as Record<string, unknown>;
  return typeof coordinate.lat === "number"
    && Number.isFinite(coordinate.lat)
    && coordinate.lat >= -90
    && coordinate.lat <= 90
    && typeof coordinate.lon === "number"
    && Number.isFinite(coordinate.lon)
    && coordinate.lon >= -180
    && coordinate.lon <= 180;
}

export function geometryCoordinates(geometry: Geometry): Coordinate[] {
  return geometry.type === "point" ? [geometry.coordinate] : geometry.coordinates;
}

export function holeCoordinates(hole: NormalizedHole): Coordinate[] {
  return [
    ...(hole.route ? geometryCoordinates(hole.route) : []),
    ...hole.features.flatMap(({ geometry }) => geometry ? geometryCoordinates(geometry) : []),
  ].filter(validCoordinate);
}

export function createProjection(coordinates: Coordinate[]): Projection | ProjectionFailure {
  const valid = coordinates.filter(validCoordinate);
  if (valid.length === 0) return { kind: "no-valid-coordinates" };

  const lats = valid.map(({ lat }) => lat);
  const lons = valid.map(({ lon }) => lon);
  const center = {
    lat: (Math.min(...lats) + Math.max(...lats)) / 2,
    lon: (Math.min(...lons) + Math.max(...lons)) / 2,
  };
  const cosLat = Math.cos(center.lat * Math.PI / 180);
  if (!Number.isFinite(cosLat) || Math.abs(cosLat) < 1e-6) return { kind: "near-pole" };

  const local = valid.map((coordinate) => toLocalMeters(coordinate, center, cosLat));
  let minX = Math.min(...local.map(({ x }) => x));
  let maxX = Math.max(...local.map(({ x }) => x));
  let minY = Math.min(...local.map(({ y }) => y));
  let maxY = Math.max(...local.map(({ y }) => y));
  [minX, maxX] = minimumExtent(minX, maxX);
  [minY, maxY] = minimumExtent(minY, maxY);

  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const scale = Math.min(INNER_WIDTH / spanX, INNER_HEIGHT / spanY);
  const offsetX = INNER_MIN_X + (INNER_WIDTH - spanX * scale) / 2;
  const offsetY = INNER_MIN_Y + (INNER_HEIGHT - spanY * scale) / 2;
  if (![scale, minX, minY, offsetX, offsetY].every(Number.isFinite) || scale <= 0) {
    return { kind: "invalid-projection" };
  }
  return { center, cosLat, scale, minX, minY, offsetX, offsetY };
}

function minimumExtent(minimum: number, maximum: number): [number, number] {
  const span = maximum - minimum;
  if (span >= MIN_EXTENT_M) return [minimum, maximum];
  const center = (minimum + maximum) / 2;
  return [center - MIN_EXTENT_M / 2, center + MIN_EXTENT_M / 2];
}

function toLocalMeters(coordinate: Coordinate, center: Coordinate, cosLat: number): ViewportPoint {
  return {
    x: (coordinate.lon - center.lon) * cosLat * Math.PI / 180 * EARTH_RADIUS_M,
    y: -(coordinate.lat - center.lat) * Math.PI / 180 * EARTH_RADIUS_M,
  };
}

export function projectCoordinate(projection: Projection, coordinate: Coordinate): ViewportPoint {
  const local = toLocalMeters(coordinate, projection.center, projection.cosLat);
  return {
    x: projection.offsetX + (local.x - projection.minX) * projection.scale,
    y: projection.offsetY + (local.y - projection.minY) * projection.scale,
  };
}

export function inverseProject(projection: Projection, point: ViewportPoint): Coordinate {
  const localX = (point.x - projection.offsetX) / projection.scale + projection.minX;
  const localY = (point.y - projection.offsetY) / projection.scale + projection.minY;
  return {
    lat: projection.center.lat - localY / EARTH_RADIUS_M * 180 / Math.PI,
    lon: projection.center.lon + localX / (projection.cosLat * EARTH_RADIUS_M) * 180 / Math.PI,
  };
}

export function clampPoint(point: ViewportPoint): ViewportPoint {
  return {
    x: Math.max(INNER_MIN_X, Math.min(INNER_MAX_X, point.x)),
    y: Math.max(INNER_MIN_Y, Math.min(INNER_MAX_Y, point.y)),
  };
}

export function distanceMeters(start: Coordinate, end: Coordinate): number | DistanceFailure {
  if (!validCoordinate(start) || !validCoordinate(end)) return { kind: "invalid-coordinates" };
  const lat1 = start.lat * Math.PI / 180;
  const lat2 = end.lat * Math.PI / 180;
  const deltaLat = (end.lat - start.lat) * Math.PI / 180;
  const deltaLon = (end.lon - start.lon) * Math.PI / 180;
  const raw = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  const a = Math.max(0, Math.min(1, raw));
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

export function formatDistance(meters: number): string {
  return `${Math.round(meters * YARDS_PER_METER)} yd / ${Math.round(meters)} m`;
}

export function scaleBar(projection: Projection): ScaleBar {
  const maximumMeters = 0.4 * INNER_WIDTH / projection.scale;
  const exponent = Math.floor(Math.log10(maximumMeters));
  const candidates: number[] = [];
  for (let power = exponent - 1; power <= exponent + 1; power += 1) {
    for (const multiplier of [1, 2, 5]) candidates.push(multiplier * 10 ** power);
  }
  // Defensive fallback; finite positive projection scales always yield a fitting candidate.
  const meters = candidates.filter((candidate) => candidate > 0 && candidate <= maximumMeters)
    .sort((left, right) => right - left)[0] ?? 1;
  return { meters, logicalLength: meters * projection.scale, label: formatDistance(meters) };
}

export function warningsForHole(
  hole: NormalizedHole,
  warnings: NormalizationWarning[],
): NormalizationWarning[] {
  const featureKeys = new Set(hole.features.map(({ source }) => source.sourceKey));
  return warnings.filter((warning) =>
    warning.sourceKey === hole.source.sourceKey
    || (hole.number !== null && warning.holeNumber === hole.number)
    || warning.refs.includes(hole.source.sourceKey)
    || warning.refs.some((ref) => featureKeys.has(ref)));
}
``````

<!-- END EXACT FILE 10/16: src/map.ts -->

<!-- BEGIN EXACT FILE 11/16: src/map.test.ts -->

### src/map.test.ts

``````text
import fixture from "../fixtures/overpass/synthetic-golf-course-ctc006.json";
import { normalizeGolfCourse } from "./normalize";
import {
  EARTH_RADIUS_M,
  INNER_MAX_X,
  INNER_MIN_X,
  LAYER_ORDER,
  clampPoint,
  createProjection,
  distanceMeters,
  formatDistance,
  holeCoordinates,
  inverseProject,
  projectCoordinate,
  scaleBar,
  warningsForHole,
} from "./map";
import type { OverpassResponse, SourceMetadata } from "./overpass";

const source: SourceMetadata = {
  query: "synthetic",
  endpoint: "https://example.invalid",
  completedAt: "2026-06-11T00:00:00Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: "https://www.openstreetmap.org/copyright",
};

const result = normalizeGolfCourse(fixture as OverpassResponse, source);
const hole = result.holes[0];

describe("selected-hole projection", () => {
  it("collects only selected-hole route and associated feature coordinates", () => {
    expect(hole.features.map(({ kind }) => kind).sort()).toEqual([...LAYER_ORDER].sort());
    expect(holeCoordinates(hole).length).toBeGreaterThan(20);
    expect(result.unassociatedFeatures).toHaveLength(1);
  });

  it("projects deterministically, north-up, and inverse-projects within tolerance", () => {
    const projection = createProjection(holeCoordinates(hole));
    expect("kind" in projection).toBe(false);
    if ("kind" in projection) return;
    const coordinate = holeCoordinates(hole)[0];
    const point = projectCoordinate(projection, coordinate);
    const recovered = inverseProject(projection, point);
    expect(recovered.lat).toBeCloseTo(coordinate.lat, 7);
    expect(recovered.lon).toBeCloseTo(coordinate.lon, 7);
    expect(projectCoordinate(projection, coordinate)).toEqual(point);
    expect(projectCoordinate(projection, { lat: coordinate.lat + 0.0001, lon: coordinate.lon }).y).toBeLessThan(point.y);
  });

  it("handles point-only geometry and invalid coordinate sets", () => {
    const projection = createProjection([{ lat: 35, lon: -80 }]);
    expect("kind" in projection).toBe(false);
    if ("kind" in projection) return;
    expect(projectCoordinate(projection, { lat: 35, lon: -80 })).toEqual({ x: 400, y: 300 });
    expect(createProjection([])).toEqual({ kind: "no-valid-coordinates" });
  });
});

describe("measurement helpers", () => {
  it("calculates and formats known, identical, antipodal, and invalid distances", () => {
    const latitudeDelta = distanceMeters({ lat: 35, lon: -80 }, { lat: 35.0009, lon: -80 });
    expect(latitudeDelta).toBeTypeOf("number");
    expect(latitudeDelta as number).toBeCloseTo(100.06, 1);
    expect(formatDistance(latitudeDelta as number)).toBe("109 yd / 100 m");
    expect(distanceMeters({ lat: 35, lon: -80 }, { lat: 35, lon: -80 })).toBe(0);
    expect(distanceMeters({ lat: 90, lon: 0 }, { lat: -90, lon: 0 })).toBeCloseTo(Math.PI * EARTH_RADIUS_M, 5);
    expect(distanceMeters({ lat: Number.NaN, lon: 0 }, { lat: 0, lon: 0 })).toEqual({ kind: "invalid-coordinates" });
  });

  it("clamps interaction points and selects a fitting truthful scale", () => {
    expect(clampPoint({ x: -1, y: 1000 })).toEqual({ x: INNER_MIN_X, y: 560 });
    const projection = createProjection(holeCoordinates(hole));
    if ("kind" in projection) throw new Error(projection.kind);
    const model = scaleBar(projection);
    expect(model.logicalLength).toBeLessThanOrEqual(288);
    expect(model.label).toBe(formatDistance(model.meters));
    expect(INNER_MAX_X).toBe(760);
  });

  it("matches selected-hole warnings only through structured evidence", () => {
    expect(warningsForHole(hole, result.warnings)).toEqual([]);
    expect(warningsForHole(hole, [{
      code: "MISSING_GREEN",
      severity: "error",
      affectedIdentity: hole.source.sourceKey,
      sourceKey: hole.source.sourceKey,
      refs: [hole.source.sourceKey],
    }])).toHaveLength(1);
  });
});
``````

<!-- END EXACT FILE 11/16: src/map.test.ts -->

<!-- BEGIN EXACT FILE 12/16: src/HoleMap.tsx -->

### src/HoleMap.tsx

``````text
import { useEffect, useMemo, useState, type KeyboardEvent, type PointerEvent } from "react";
import type {
  Coordinate,
  Geometry,
  NormalizationWarning,
  NormalizedHole,
} from "./normalize";
import type { SourceMetadata } from "./overpass";
import {
  INNER_MAX_X,
  INNER_MAX_Y,
  INNER_MIN_X,
  INNER_MIN_Y,
  LAYER_ORDER,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  clampPoint,
  createProjection,
  distanceMeters,
  formatDistance,
  geometryCoordinates,
  holeCoordinates,
  inverseProject,
  projectCoordinate,
  scaleBar,
  warningsForHole,
  type Projection,
  type ViewportPoint,
} from "./map";

type HoleMapProps = {
  hole: NormalizedHole;
  warnings: NormalizationWarning[];
  source: SourceMetadata;
};

type Measurement = { start: Coordinate | null; end: Coordinate | null };

function geometryElement(
  geometry: Geometry,
  projection: Projection,
  key: string,
  className: string,
) {
  const points = geometryCoordinates(geometry).map((coordinate) => projectCoordinate(projection, coordinate));
  if (geometry.type === "point") {
    return <circle key={key} className={className} cx={points[0].x} cy={points[0].y} r="7" />;
  }
  const value = points.map(({ x, y }) => `${x},${y}`).join(" ");
  return geometry.type === "line"
    ? <polyline key={key} className={className} points={value} />
    : <polygon key={key} className={className} points={value} />;
}

function warningText(warning: NormalizationWarning): string {
  return `${warning.code}: ${warning.affectedIdentity}`;
}

export function HoleMap({ hole, warnings, source }: HoleMapProps) {
  const projection = useMemo(() => createProjection(holeCoordinates(hole)), [hole]);
  const [measurement, setMeasurement] = useState<Measurement>({ start: null, end: null });
  const [crosshair, setCrosshair] = useState<ViewportPoint>({ x: 400, y: 300 });
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    setMeasurement({ start: null, end: null });
    setCrosshair({ x: 400, y: 300 });
    setAnnouncement("Selected hole changed. Measurement cleared.");
  }, [hole.source.sourceKey]);

  if ("kind" in projection) {
    return <p className="map-empty" role="status">No renderable geometry is available for this selected hole.</p>;
  }

  const selectedWarnings = warningsForHole(hole, warnings);
  const bar = scaleBar(projection);
  const distance = measurement.start && measurement.end
    ? distanceMeters(measurement.start, measurement.end)
    : null;
  const distanceLabel = typeof distance === "number" ? formatDistance(distance) : null;

  function placeAnchor(point: ViewportPoint) {
    if ("kind" in projection) return;
    const coordinate = inverseProject(projection, clampPoint(point));
    setMeasurement((current) => {
      if (!current.start || current.end) {
        setAnnouncement(current.end ? "Measurement restarted. First point placed." : "First point placed.");
        return { start: coordinate, end: null };
      }
      const measured = distanceMeters(current.start, coordinate);
      setAnnouncement(typeof measured === "number" ? `Distance: ${formatDistance(measured)}.` : "Measurement failed.");
      return { start: current.start, end: coordinate };
    });
  }

  function pointerPoint(event: PointerEvent<SVGSVGElement>): ViewportPoint | null {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return null;
    const point = event.currentTarget.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const logical = point.matrixTransform(matrix.inverse());
    return clampPoint({ x: logical.x, y: logical.y });
  }

  function handlePointer(event: PointerEvent<SVGSVGElement>) {
    if (!event.isPrimary) return;
    const point = pointerPoint(event);
    if (!point) return;
    setCrosshair(point);
    placeAnchor(point);
  }

  function clearMeasurement() {
    setMeasurement({ start: null, end: null });
    setCrosshair({ x: 400, y: 300 });
    setAnnouncement("Measurement cleared.");
  }

  function handleKey(event: KeyboardEvent<SVGSVGElement>) {
    const steps: Record<string, ViewportPoint> = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
    };
    const direction = steps[event.key];
    if (direction) {
      event.preventDefault();
      const step = event.shiftKey ? 20 : 4;
      setCrosshair((current) => clampPoint({
        x: current.x + direction.x * step,
        y: current.y + direction.y * step,
      }));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      placeAnchor(crosshair);
    } else if (event.key === "Escape") {
      event.preventDefault();
      clearMeasurement();
    }
  }

  const startPoint = measurement.start ? projectCoordinate(projection, measurement.start) : null;
  const endPoint = measurement.end ? projectCoordinate(projection, measurement.end) : null;

  return (
    <section className="hole-map-panel" aria-labelledby="hole-map-title">
      <div className="map-heading">
        <div>
          <p className="eyebrow">Selected hole</p>
          <h3 id="hole-map-title">{hole.number === null ? hole.source.sourceKey : `Hole ${hole.number}`}</h3>
        </div>
        <button className="secondary" type="button" onClick={clearMeasurement}
          disabled={!measurement.start && !measurement.end}>Clear measurement</button>
      </div>
      <p className="map-instructions">Click or tap two map points. Keyboard: arrows move the crosshair, Enter or Space selects, Escape clears.</p>
      <svg className="hole-map" data-testid="hole-vector-map"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="xMidYMid meet"
        tabIndex={0} role="group" aria-label="Selected hole vector map and measurement surface"
        onPointerDown={handlePointer} onKeyDown={handleKey}>
        <title>Selected hole vector map</title>
        <desc>Blank vector-only OpenStreetMap-derived golf hole geometry with two-point measurement controls.</desc>
        <rect className="map-inner-boundary" x={INNER_MIN_X} y={INNER_MIN_Y}
          width={INNER_MAX_X - INNER_MIN_X} height={INNER_MAX_Y - INNER_MIN_Y} />
        {LAYER_ORDER.map((kind) => (
          <g key={kind} data-layer={kind} className={`map-layer layer-${kind}`}>
            {hole.features.filter((feature) => feature.kind === kind && feature.geometry)
              .map((feature) => geometryElement(feature.geometry!, projection, feature.source.sourceKey, "map-feature"))}
          </g>
        ))}
        <g data-layer="route" className="map-layer layer-route">
          {hole.route && geometryElement(hole.route, projection, hole.source.sourceKey, "map-route")}
        </g>
        <g data-layer="measurement" className="map-layer layer-measurement">
          {startPoint && endPoint && <line className="measurement-line" x1={startPoint.x} y1={startPoint.y} x2={endPoint.x} y2={endPoint.y} />}
          {startPoint && <circle className="measurement-anchor" cx={startPoint.x} cy={startPoint.y} r="8" />}
          {endPoint && <circle className="measurement-anchor" cx={endPoint.x} cy={endPoint.y} r="8" />}
          <path className="keyboard-crosshair" d={`M ${crosshair.x - 8} ${crosshair.y} H ${crosshair.x + 8} M ${crosshair.x} ${crosshair.y - 8} V ${crosshair.y + 8}`} />
        </g>
        <g className="scale-bar" aria-label={`Scale ${bar.label}`}>
          <line x1={INNER_MIN_X} y1={INNER_MAX_Y - 18} x2={INNER_MIN_X + bar.logicalLength} y2={INNER_MAX_Y - 18} />
          <text x={INNER_MIN_X} y={INNER_MAX_Y - 24}>{bar.label}</text>
        </g>
      </svg>
      <p className="measurement-result" aria-live="polite">
        {distanceLabel ? `Distance: ${distanceLabel}` : measurement.start ? "Select the second point." : "No measurement selected."}
      </p>
      <span className="sr-only" aria-live="polite">{announcement}</span>
      {selectedWarnings.length > 0 && (
        <div className="map-warnings">
          <strong>Selected-hole data warnings</strong>
          <ul>{selectedWarnings.map((warning) => <li key={`${warning.code}-${warning.affectedIdentity}`}>{warningText(warning)}</li>)}</ul>
        </div>
      )}
      <details>
        <summary>All normalization warnings ({warnings.length})</summary>
        {warnings.length === 0 ? <p>No normalization warnings.</p>
          : <ul>{warnings.map((warning) => <li key={`${warning.code}-${warning.affectedIdentity}`}>{warningText(warning)}</li>)}</ul>}
      </details>
      <p className="attribution">Course data © OpenStreetMap contributors. <a href={source.copyrightUrl}>OpenStreetMap copyright and license</a>.</p>
    </section>
  );
}
``````

<!-- END EXACT FILE 12/16: src/HoleMap.tsx -->

<!-- BEGIN EXACT FILE 13/16: src/App.tsx -->

### src/App.tsx

``````text
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
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
  const requestIdentity = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const fieldRefs = useRef<Record<keyof Bbox, HTMLInputElement | null>>({
    south: null, west: null, north: null, east: null,
  });
  const courseNameRef = useRef<HTMLInputElement>(null);

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
  }, [normalized]);

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
                    <HoleMap key={hole.source.sourceKey} hole={hole} warnings={normalized.warnings} source={normalized.source} />
                  ))}
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
``````

<!-- END EXACT FILE 13/16: src/App.tsx -->

<!-- BEGIN EXACT FILE 14/16: src/styles.css -->

### src/styles.css

``````text
:root {
  color: #17211b;
  background: #f4f3ed;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; }
button, input, select { font: inherit; }
button {
  border: 1px solid #2f6241; border-radius: 6px; background: #2f6241; color: white;
  cursor: pointer; font-weight: 750; min-height: 44px; padding: .7rem 1rem;
}
button.secondary { background: white; color: #2f6241; }
button:disabled { cursor: not-allowed; opacity: .55; }
button:focus-visible, input:focus-visible, select:focus-visible, summary:focus-visible, .hole-map:focus-visible { outline: 3px solid #d18b38; outline-offset: 2px; }

.shell { display: grid; gap: 1rem; margin: 0 auto; max-width: 78rem; min-height: 100vh; padding: clamp(1rem, 3vw, 2.5rem); }
header, .search-panel, .status, .results {
  background: #fffdf8; border: 1px solid #cbd5c5; border-radius: 8px; padding: clamp(1rem, 3vw, 2rem);
}
header { background: #1f3a2a; color: white; }
.eyebrow { color: #9d472b; font-size: .78rem; font-weight: 850; letter-spacing: .04em; margin: 0; text-transform: uppercase; }
header .eyebrow { color: #f5bc7e; }
h1 { font-size: clamp(2.5rem, 7vw, 5.5rem); line-height: .95; margin: .7rem 0; }
h2 { margin: 0 0 1rem; }
.lede { line-height: 1.5; margin: 0; max-width: 52rem; }
form { display: grid; gap: 1rem; }
label { display: grid; font-weight: 750; gap: .35rem; }
label span, .hint { color: #5b685d; font-size: .88rem; font-weight: 450; }
input, select { border: 1px solid #748276; border-radius: 5px; min-height: 44px; padding: .65rem; width: 100%; }
input[aria-invalid="true"] { border-color: #a1261b; }
fieldset { border: 1px solid #cbd5c5; border-radius: 6px; margin: 0; padding: 1rem; }
legend { font-weight: 800; padding: 0 .35rem; }
.coordinate-grid { display: grid; gap: .75rem; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.hint { margin: .75rem 0 0; }
.actions { display: flex; flex-wrap: wrap; gap: .75rem; }
.status { padding-block: 1rem; }
.status p { margin: .25rem 0 0; }
.status.error { border-color: #b85d52; }
.warning { color: #7a4b0e; font-weight: 700; }
.results { display: grid; gap: 1rem; }
.entity-summary { display: grid; gap: .75rem; grid-template-columns: repeat(3, 1fr); margin: 0; }
.entity-summary div { background: #edf2e9; border-radius: 6px; padding: .75rem; }
dt { color: #526054; font-size: .76rem; font-weight: 800; text-transform: uppercase; }
dd { font-weight: 750; margin: .15rem 0 0; }
.candidate-list, .raw-list { display: grid; gap: .6rem; list-style: none; margin: 0; padding: 0; }
.candidate-list li { align-items: center; border-top: 1px solid #dbe2d7; display: flex; gap: 1rem; justify-content: space-between; padding-top: .75rem; }
.candidate-list span { color: #5b685d; display: block; font-size: .85rem; margin-top: .2rem; }
.raw-list li { border-top: 1px solid #dbe2d7; padding-top: .6rem; }
summary { cursor: pointer; font-weight: 800; padding: .5rem 0; }
.diagnostics { display: grid; gap: .75rem; margin: .5rem 0 0; }
.diagnostics dd { overflow-wrap: anywhere; }
pre { background: #18221c; border-radius: 5px; color: #eef4ed; font-size: .8rem; overflow: auto; padding: .75rem; white-space: pre-wrap; }
.attribution { color: #4e5d50; font-size: .88rem; line-height: 1.5; margin: 0; }
.attribution a { color: #245e39; }
.map-workspace { border-top: 1px solid #dbe2d7; display: grid; gap: 1rem; padding-top: 1rem; }
.map-selection, .map-heading { align-items: end; display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; }
.map-selection h3, .map-heading h3 { margin: 0; }
.map-selection label { min-width: 12rem; }
.hole-map-panel { display: grid; gap: .75rem; }
.map-instructions, .measurement-result, .map-empty { margin: 0; }
.hole-map {
  background: #f8f7ef; border: 1px solid #748276; border-radius: 7px; display: block;
  height: auto; touch-action: none; width: 100%;
}
.map-inner-boundary { fill: #eef1e8; stroke: #667268; stroke-dasharray: 7 5; stroke-width: 1; }
.map-feature { stroke-linejoin: round; stroke-width: 2; }
.layer-vegetation { fill: #a9c49b; stroke: #3d6540; stroke-dasharray: 4 3; }
.layer-generic-water { fill: #a8d5e5; stroke: #245f78; stroke-dasharray: 6 3; }
.layer-golf-water { fill: #70b6d2; stroke: #174f69; stroke-width: 3; }
.layer-rough { fill: #c6d6ae; stroke: #667d4b; stroke-dasharray: 3 3; }
.layer-fairway { fill: #b8d59f; stroke: #41653d; }
.layer-bunker { fill: #ead9a0; stroke: #735e28; stroke-dasharray: 2 2; }
.layer-green { fill: #82b980; stroke: #285c35; stroke-width: 3; }
.layer-tee { fill: #d9e7bd; stroke: #244e30; stroke-width: 3; }
.layer-route { fill: none; stroke: #6d351d; stroke-dasharray: 8 5; stroke-width: 4; }
.measurement-line { stroke: #932b20; stroke-dasharray: 6 4; stroke-width: 4; }
.measurement-anchor { fill: #fffdf8; stroke: #932b20; stroke-width: 4; }
.keyboard-crosshair { fill: none; stroke: #111; stroke-width: 3; }
.scale-bar line { stroke: #111; stroke-width: 5; }
.scale-bar text { fill: #111; font-size: 16px; font-weight: 800; }
.measurement-result { font-size: 1.1rem; font-weight: 800; }
.map-warnings { border-left: 4px solid #a86619; padding-left: .75rem; }
.map-warnings ul, .hole-map-panel details ul { margin-bottom: 0; }
.sr-only {
  clip: rect(0, 0, 0, 0); clip-path: inset(50%); height: 1px; overflow: hidden;
  position: absolute; white-space: nowrap; width: 1px;
}

@media (max-width: 700px) {
  .coordinate-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .candidate-list li { align-items: stretch; flex-direction: column; }
  .candidate-list button { width: 100%; }
  .map-heading button, .map-selection label { width: 100%; }
}
``````

<!-- END EXACT FILE 14/16: src/styles.css -->

<!-- BEGIN EXACT FILE 15/16: test/e2e/app.spec.ts -->

### test/e2e/app.spec.ts

``````text
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
``````

<!-- END EXACT FILE 15/16: test/e2e/app.spec.ts -->

<!-- BEGIN EXACT FILE 16/16: fixtures/overpass/synthetic-golf-course-ctc006.json -->

### fixtures/overpass/synthetic-golf-course-ctc006.json

``````text
{
  "chartTheCourseFixture": {
    "synthetic": true,
    "purpose": "CTC-006 all selected-hole layers",
    "contract": "docs/overpass-query-contract.md",
    "sourceCopyrightUrl": "https://www.openstreetmap.org/copyright",
    "bbox": { "south": 35, "west": -80, "north": 35.01, "east": -79.99 },
    "queryPurpose": "golf-course-detail"
  },
  "elements": [
    {
      "type": "way",
      "id": 9000060001,
      "geometry": [
        { "lat": 35, "lon": -80 },
        { "lat": 35.01, "lon": -80 },
        { "lat": 35.01, "lon": -79.99 },
        { "lat": 35, "lon": -79.99 },
        { "lat": 35, "lon": -80 }
      ],
      "tags": { "leisure": "golf_course", "name": "Synthetic CTC-006 Course" }
    },
    {
      "type": "way",
      "id": 9000060101,
      "geometry": [
        { "lat": 35.001, "lon": -79.999 },
        { "lat": 35.004, "lon": -79.9965 },
        { "lat": 35.008, "lon": -79.993 }
      ],
      "tags": { "golf": "hole", "ref": "1", "par": "4" }
    },
    {
      "type": "way",
      "id": 9000060201,
      "geometry": [
        { "lat": 35.0008, "lon": -79.9993 },
        { "lat": 35.0013, "lon": -79.9993 },
        { "lat": 35.0013, "lon": -79.9987 },
        { "lat": 35.0008, "lon": -79.9993 }
      ],
      "tags": { "golf": "tee", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060301,
      "geometry": [
        { "lat": 35.002, "lon": -79.9982 },
        { "lat": 35.006, "lon": -79.9958 },
        { "lat": 35.0055, "lon": -79.9948 },
        { "lat": 35.002, "lon": -79.9982 }
      ],
      "tags": { "golf": "fairway", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060401,
      "geometry": [
        { "lat": 35.0075, "lon": -79.9935 },
        { "lat": 35.0082, "lon": -79.9933 },
        { "lat": 35.008, "lon": -79.9926 },
        { "lat": 35.0075, "lon": -79.9935 }
      ],
      "tags": { "golf": "green", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060501,
      "geometry": [
        { "lat": 35.0068, "lon": -79.994 },
        { "lat": 35.0071, "lon": -79.9938 },
        { "lat": 35.0069, "lon": -79.9935 },
        { "lat": 35.0068, "lon": -79.994 }
      ],
      "tags": { "golf": "bunker", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060601,
      "geometry": [
        { "lat": 35.0015, "lon": -79.9988 },
        { "lat": 35.0064, "lon": -79.9955 },
        { "lat": 35.006, "lon": -79.9945 },
        { "lat": 35.0015, "lon": -79.9988 }
      ],
      "tags": { "golf": "rough", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060701,
      "geometry": [
        { "lat": 35.0046, "lon": -79.9962 },
        { "lat": 35.005, "lon": -79.996 },
        { "lat": 35.0048, "lon": -79.9956 },
        { "lat": 35.0046, "lon": -79.9962 }
      ],
      "tags": { "golf": "water_hazard", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060801,
      "geometry": [
        { "lat": 35.0034, "lon": -79.9952 },
        { "lat": 35.004, "lon": -79.995 },
        { "lat": 35.0037, "lon": -79.9945 },
        { "lat": 35.0034, "lon": -79.9952 }
      ],
      "tags": { "natural": "water", "water": "pond", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060901,
      "geometry": [
        { "lat": 35.0025, "lon": -79.996 },
        { "lat": 35.003, "lon": -79.9958 },
        { "lat": 35.0027, "lon": -79.9954 },
        { "lat": 35.0025, "lon": -79.996 }
      ],
      "tags": { "natural": "wood", "ref": "1" }
    },
    {
      "type": "node",
      "id": 9000060999,
      "lat": 35.009,
      "lon": -79.991,
      "tags": { "natural": "tree" }
    }
  ]
}
``````

<!-- END EXACT FILE 16/16: fixtures/overpass/synthetic-golf-course-ctc006.json -->
