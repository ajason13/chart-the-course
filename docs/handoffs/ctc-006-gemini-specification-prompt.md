# CTC-006: Specify selected-hole vector rendering and measurement controls

## Research target

Act as the specification architect for CTC-006, Render selected hole map with
measurement controls. Produce an implementation-ready technical specification
for critical review. Do not write full implementation code.

Gemini has no filesystem or GitHub access. This bundle is self-contained. Base
all project-specific decisions on the exact repository contents embedded below.
Use current primary sources only where necessary for projection, geodesic
distance, SVG/Canvas/browser interaction, or accessibility facts. Clearly
separate sourced facts from project design recommendations.

## Current project and gate state

- Repository: Chart the Course, Apache-2.0 browser app using React, TypeScript,
  Vite, Vitest, and Playwright.
- Current repository state: clean synchronized `main` at commit
  `3449748c84495097abd7ba2cdee52488dfbfd9ef`.
- CTC-006 is `1. Spec Drafting (Gemini)`.
- CTC-005 is Done and supplies the pure normalized geometry model in
  `src/normalize.ts`.
- CTC-018 selected blank/vector-only rendering of OSM-derived geometry with no
  third-party basemap tiles by default.
- CTC-019 remains independent durable Overpass cache/request-identity work.
- No feature branch or runtime implementation may begin until this
  specification is critically reviewed and Claude adversarial QA planning is
  completed and critically reviewed.

## Acceptance criteria

- Selected hole renders with tee, fairway, green, hazards, and scale indicator.
- User can click two points and see yards/meters.
- Map remains usable on desktop and mobile widths.
- Geometry fixtures verify distance tolerance.

## Binding scope boundaries

CTC-006 owns selected-hole geometry rendering, visible scale indication, and
two-point yards/meters measurement only.

- Use the CTC-005 normalized model as input. Do not weaken, bypass, mutate, or
  reinterpret its strict `{ lat, lon }` geometry, warnings, source evidence,
  unsupported-relation decisions, or unassociated-feature decisions.
- Follow `docs/tile-provider-strategy.md`: blank/vector-only MVP, no public OSM
  tile CDN, no third-party basemap/provider/API key, and visible OSM
  attribution on every OSM-derived geometry view.
- Prefer native React, TypeScript, SVG, Canvas, or DOM using existing
  dependencies. Any new rendering or geospatial dependency requires an
  explicit reviewed justification and remains unapproved by default.
- Do not add durable cache, refresh controls, Retry-After/backoff, endpoint
  failover, geocoding, PDF/export behavior, target markers, carry arcs, notes,
  or local project persistence.
- CTC-019 owns durable Overpass request/cache policy.
- CTC-007 owns target markers, carry arcs, and the local project model.
- Use only explicitly synthetic invented fixtures. Do not propose real-course
  fixtures without governance review.
- Do not copy or adapt code, query text, UI structures, or assets from
  prohibited or unlicensed reference projects.

## Mandatory planning questions

Resolve each question explicitly:

1. Select the narrow rendering architecture for the blank/vector-only MVP.
   Compare native SVG, Canvas, and DOM against the existing React scaffold and
   recommend one. State whether a new dependency is needed; default to none.
2. Define how the app transitions from a successful detail response through
   `normalizeGolfCourse` to selection of one renderable normalized hole.
   Specify behavior for zero/multiple course candidates, no holes, null route
   geometry, missing tee/green warnings, unsupported relations, and
   unassociated features without hiding CTC-005 diagnostics.
3. Define a pure deterministic WGS84 `{ lat, lon }` to local viewport
   projection contract. Include bounds source, padding, aspect-ratio fitting,
   latitude-aware longitude scaling, degenerate bounds, coordinate-order
   safety, numeric validation, and resizing. Do not mutate source geometry.
4. Define deterministic rendering inclusion and layer order for route, tee,
   fairway, green, bunker, rough, golf-specific water, generic water, and
   vegetation. Explain whether and how unassociated features may appear when a
   selected-hole view cannot spatially infer association.
5. Define two-point measurement math and units. Compare an appropriate
   geodesic formula with local planar distance for the bounded course scale,
   select one, specify Earth-radius/unit constants, yards/meters rounding,
   accuracy/tolerance tests, antipodal/numeric edge cases, and coordinate-order
   protections.
6. Define scale-indicator behavior so it remains truthful under projection,
   viewport resizing, and latitude variation. State its calculation,
   placement, labeling, and test oracle.
7. Define interaction state and behavior for mouse/pointer, touch, and keyboard
   users: starting, completing, replacing, clearing, focus, hit targets,
   announcements, visible markers/line, and behavior during hole changes or
   resize.
8. Define responsive desktop/mobile behavior, minimum useful viewport,
   overflow/zoom policy if any, and accessibility requirements. Address SVG or
   Canvas semantics, keyboard operability, color independence, contrast,
   motion, and screen-reader output.
9. Define exact synthetic fixture changes and the Vitest/Playwright test
   matrix. Include projection determinism, layer inclusion/order, distance
   tolerance, scale truthfulness, pointer/touch/keyboard behavior, responsive
   layout, attribution, warning/error states, network isolation, and axe scans.
10. Define observability/debugging for projection, selection, and measurement.
    Prefer deterministic returned diagnostics or visible states over logging
    side effects.
11. Define exact likely files to add/change and ownership boundaries. Keep the
    implementation small and avoid unrelated refactors.
12. Identify narrow unresolved maintainer decisions, with a recommended
    conservative default for each.

## Decisions that must not be silently invented

- Do not assume every normalized hole is renderable.
- Do not spatially associate unassociated features to a hole inside CTC-006
  unless the specification explicitly justifies a deterministic, reviewed
  ownership change; conservative default is not to infer.
- Do not heal, auto-close, simplify, or otherwise alter CTC-005 source
  geometry.
- Do not treat local placeholder coordinates from `fixtures/courses` as WGS84.
- Do not add pan/zoom, a basemap, map-provider adapters, export, or persistence
  merely because a map library supports them.
- Do not let a visual SVG/Canvas coordinate be mistaken for geographic
  coordinates when computing measurement.
- Do not hide OSM attribution or normalization warnings.

## Required response format

Return a self-contained specification with these sections:

1. Verdict on scope/readiness and blocking unresolved decisions.
2. Accepted assumptions and explicitly rejected/deferred assumptions.
3. Recommended rendering architecture and dependency decision.
4. Proposed module/type/API boundaries, with representative declarations or
   pseudocode but no full implementation.
5. Detail-response normalization and selected-hole state flow.
6. Projection algorithm, viewport fitting, resize behavior, and failure modes.
7. Deterministic layer inclusion/order/style semantics.
8. Measurement algorithm, constants, units, rounding, tolerance, and scale
   indicator.
9. Pointer, touch, keyboard, responsive, and accessibility behavior.
10. Warning/error/empty-state behavior and observability decision.
11. Synthetic fixture and Vitest/Playwright test matrix with exact or bounded
    expected results.
12. File/change plan and non-goals.
13. Adversarial QA red lines for the later Claude planning handoff.
14. Open maintainer decisions, if any, with recommended defaults.

## Completion test

The response is acceptable only if it:

1. Chooses a narrow renderer and states an explicit dependency decision.
2. Defines a deterministic projection that preserves CTC-005 geometry.
3. Defines truthful distance and scale calculations with test tolerances.
4. Defines complete pointer, touch, keyboard, mobile, and accessibility
   behavior.
5. Defines exact synthetic test coverage and preserves visible OSM attribution.
6. Keeps CTC-007, CTC-019, basemaps/providers, PDF/export, and persistence out
   of scope.

## Exact relevant repository file contents

<!-- BEGIN EXACT FILE 1/13: AGENTS.md -->

### AGENTS.md

`````text
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
`````

<!-- END EXACT FILE 1/13: AGENTS.md -->

<!-- BEGIN EXACT FILE 2/13: docs/tile-provider-strategy.md -->

### docs/tile-provider-strategy.md

`````text
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
`````

<!-- END EXACT FILE 2/13: docs/tile-provider-strategy.md -->

<!-- BEGIN EXACT FILE 3/13: docs/overpass-query-contract.md -->

### docs/overpass-query-contract.md

`````text
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
`````

<!-- END EXACT FILE 3/13: docs/overpass-query-contract.md -->

<!-- BEGIN EXACT FILE 4/13: docs/handoffs/ctc-005-gemini-specification-review.md -->

### docs/handoffs/ctc-005-gemini-specification-review.md

`````text
# CTC-005 Gemini specification critical review

Date: 2026-06-07

## Review verdict

Gemini's response is useful as adversarial input but is not implementation-ready
as written. It identified relevant OSM/Overpass variability and the need for a
pure deterministic normalization boundary, source references, unassociated
features, and stable warnings. It also materially broadened scope and proposed
unsupported destructive inference.

The accepted and corrected decisions below are the specification baseline for
Claude adversarial QA planning. Claude must challenge them before CTC-005 can
move to implementation.

## Accepted decisions

- Implement CTC-005 as a pure deterministic transformation from the existing
  validated `OverpassResponse` plus `SourceMetadata` into a normalized model.
- Index the complete flat element array before classification; never depend on
  raw Overpass element order.
- Preserve original OSM element type, integer ID, original tags, source
  metadata, and raw geometry evidence needed for attribution/debugging.
- Represent features that cannot be deterministically associated with a hole
  as top-level unassociated features.
- Omit a classified feature from normalized geometry when required coordinates
  are missing or malformed, while preserving a source reference in a stable
  warning.
- Do not invent missing relation segments or stitch incomplete rings.
- Return deterministic structured warnings rather than logging side effects.
- Use only synthetic fixtures and Vitest unit tests for CTC-005.

## Rejected decisions

- Reject Turf.js, MapLibre GL JS, or any new dependency. Neither library exists
  in the repository, and rendering/spatial math adoption is outside CTC-005.
- Reject rendering priorities, z-indexes, visual occlusion rules, map behavior,
  PDF behavior, and parser-owned attribution display strings.
- Reject convex-hull fallback boundaries, area calculations, centroids,
  containment tests, nearest-neighbor association, the arbitrary 150-meter
  threshold, or any other computational spatial inference.
- Reject automatically closing open ways, discarding unresolved node
  references, healing truncated geometry, or treating partial relation members
  as independent polygons. These actions fabricate or destructively reinterpret
  source geometry.
- Reject multipolygon assembly and general relation geometry normalization in
  CTC-005. Unsupported relations must remain attributable through warnings and
  preserved source references.
- Reject choosing course boundaries or greens by largest area or number of
  intersecting features.
- Reject stripping non-numeric characters from hole refs. Values such as `9B`
  and `Hole 9` are not equivalent to the strict numeric ref `9`.
- Reject merging distinct `golf=hole` source entities that share a hole number.
  Preserve each source entity and report ambiguous ordering/conflict.
- Reject legacy cart-path translation, generic grass/heath expansion, dogleg
  semantics, pin/green spatial merging, and alternative-green inference.
- Reject real-course fixture names and coordinates. Fixtures must remain
  explicitly synthetic and invented.
- Reject splitting CTC-005 into new epics/user stories or unrelated roadmap
  tasks.

## Corrected specification baseline

### Pure API boundary

The likely public API is conceptually:

```typescript
normalizeGolfCourse(
  response: OverpassResponse,
  source: SourceMetadata,
): NormalizationResult
```

The function must not fetch, mutate input, access storage, log, render, or
perform provider/cache policy. `NormalizationResult` must preserve source
metadata and contain normalized course data plus a deterministically sorted
warning array. Exact type names remain reviewable by Claude, but all
collection-valued fields must be arrays, not the singular fields shown in
Gemini's malformed model.

### Raw validation boundary

`validateResponse` guarantees only:

- the response is an object with an `elements` array;
- every element is an object with `type` equal to `node`, `way`, or `relation`;
- every element has an integer `id`.

The normalizer must safely validate all tags and geometry fields it consumes.
It must not assume tags are strings, coordinates are finite/in-range, way
geometry aligns with `nodes`, or relation members are complete.

### Geometry support

- Node: support a point only when `lat` and `lon` are finite and within WGS84
  latitude/longitude ranges.
- Way: support a line only when every geometry coordinate is valid and at least
  two coordinates exist.
- Closed way: support a polygon only when every coordinate is valid, at least
  four coordinates exist, and first and last coordinates are exactly equal.
- Open or malformed area-classified ways: do not auto-close or downgrade into a
  misleading normalized area; omit normalized geometry and warn.
- Relation: preserve source identity/tags but do not normalize relation geometry
  or assemble multipolygons in CTC-005; emit an unsupported-relation warning
  when the relation classifies as a relevant feature/course.
- Preserve raw node-reference IDs and raw geometry coordinates from supported
  source entities as source evidence; do not silently discard mismatches.

Use named `{ lat, lon }` coordinates to prevent accidental GeoJSON `[lon, lat]`
confusion unless Claude identifies a downstream reason to choose differently.

### Classification

Classification is based only on exact consumed tag strings from the reviewed
CTC-015 detail query:

- course boundary: `leisure=golf_course`
- hole route/metadata: `golf=hole`
- primary features: `golf=tee|green|fairway|bunker|rough`
- golf-specific water:
  `golf=water_hazard|lateral_water_hazard`
- generic water: relevant `natural=water`, `water=*`, `waterway=*`, and
  `landuse=reservoir|basin`
- vegetation: relevant
  `natural=wood|tree|tree_row|scrub` and `landuse=forest`

Preserve golf-specific water versus generic water and the original
classification tags. Each relevant entity receives exactly one classification
using this precedence from highest to lowest:

1. `golf=hole`
2. `golf=tee|green|fairway|bunker|rough`
3. `golf=water_hazard|lateral_water_hazard`
4. `leisure=golf_course`
5. generic water: relevant `natural=water`, `waterway=*`, `water=*`, and
   `landuse=reservoir|basin`
6. vegetation: relevant `natural=wood|tree|tree_row|scrub` and
   `landuse=forest`

Record the winning exact tag pair as `classifiedBy` and preserve every original
tag. Unknown/non-relevant entities, including queried
`golf=out_of_bounds|pin|cartpath`, are ignored silently.

### Course and hole rules

- A stable source key is `${type}/${id}`.
- Do not deduplicate entities solely by numeric ID because IDs are scoped by
  OSM entity type.
- Any repeated source key is a conflict and emits one `DUPLICATE_SOURCE_KEY`
  warning. Select a deterministic winner by comparing a canonical structural
  serialization of the complete records lexicographically; do not use
  first-seen order because normalized output must remain invariant when input
  elements are shuffled. Preserve all conflicting source refs in the warning.
- Recognize a hole number only when a string `ref`, after trimming, matches
  `/^[1-9][0-9]*$/` exactly. Leading zeros, signs, embedded spaces, decimal
  points, and non-digit characters are non-numeric. Do not strip characters or
  infer from `name`.
- Sort unambiguous numbered holes numerically, with stable source-key tie
  ordering. Preserve non-numeric/unidentified holes after numbered holes in
  source-key order.
- Duplicate numeric refs make hole ordering ambiguous. A mix of identified
  numeric holes and unidentified/non-numeric holes also emits
  `AMBIGUOUS_HOLE_ORDER`. Numeric gaps alone do not imply ambiguity. Distinct
  source hole entities remain distinct.
- Parse optional `par` only as a strict valid positive integer; malformed values
  remain preserved in original tags and generate a warning rather than being
  coerced.

### Feature-to-hole association

- Associate only when a feature has a strict numeric `ref` matching exactly one
  unambiguous numbered hole.
- A feature ref matching zero or multiple holes remains unassociated and emits
  an appropriate warning.
- Features without a usable ref remain unassociated without spatial inference.
  Unreferenced non-required features are silent. A numeric feature ref matching
  zero or multiple holes emits `AMBIGUOUS_FEATURE_REF`. Missing refs on tees and
  greens are represented through hole-level `MISSING_TEE` and `MISSING_GREEN`
  warnings rather than an additional feature warning.
- Golf-specific water hazards participate in the same strict ref association
  rule as other classified features. Generic water and vegetation without a
  usable matching ref remain unassociated.
- Relation-membership association is deferred with relation normalization.

### Required warnings

At minimum define stable machine-readable codes for:

- missing tee for each identified hole;
- missing green for each identified hole;
- ambiguous hole ordering;
- duplicate/conflicting source key;
- malformed or missing relevant geometry;
- unsupported relevant relation geometry;
- malformed consumed tags;
- ambiguous feature-to-hole ref;
- missing or multiple course candidates.

Warnings use only `error` and `warning` severities. `error` applies to
structurally incomplete or unreliable normalized output:
`MISSING_TEE`, `MISSING_GREEN`, `MISSING_OR_MALFORMED_GEOMETRY`,
`DUPLICATE_SOURCE_KEY`, and `ZERO_COURSE_CANDIDATES`. `warning` applies to
`AMBIGUOUS_HOLE_ORDER`, `MULTIPLE_COURSE_CANDIDATES`,
`MALFORMED_CONSUMED_TAG`, `AMBIGUOUS_FEATURE_REF`, and
`UNSUPPORTED_RELATION`.

Emit exactly one warning per unique `(code, affected identity)` tuple. A
duplicate-source warning covers every conflicting record for that source key.
Sort warnings by `code` ascending, then numeric hole identity ascending with
non-numeric/absent identities after numeric identities, then source key
lexicographically. Severity is not a sort key.

### Course candidate handling

Do not compute area, spatial containment, or select a primary course. Expose
all unique `leisure=golf_course` candidates in deterministic order: valid
closed-way candidates before unsupported relation candidates before other
candidates, then source key lexicographically. Emit `ZERO_COURSE_CANDIDATES`
when empty and `MULTIPLE_COURSE_CANDIDATES` when more than one unique candidate
remains after source-key conflict resolution. Active course selection belongs
downstream.

### Coordinate and source contract

Use `{ lat: number; lon: number }` as the canonical normalized coordinate type.
GeoJSON array coordinates are deferred. Every output record carries its stable
source key and original source identity/tags/evidence. Pass `SourceMetadata`
through verbatim without mutation or abbreviation. The normalizer must not
mutate, fetch, access browser globals/storage, render, log, or evaluate tag
values.

## Fixture and test baseline

Extend the existing complete synthetic fixture or add a purpose-specific
complete fixture that includes multiple out-of-order holes; all required
feature classes; explicit refs; and preserved source metadata, IDs, tags, node
references, and geometry evidence.

Add a separate explicitly synthetic incomplete/ambiguous fixture containing:

- a hole missing a tee and a hole missing a green;
- duplicate numeric hole refs, a non-numeric ref, and malformed `par`;
- relevant feature with missing/malformed geometry;
- relevant unsupported relation;
- unreferenced and ambiguously referenced features;
- duplicate/conflicting source-key records;
- zero or multiple course candidate coverage.

Tests must assert exact deterministic normalized output slices, preserved source
evidence, no input mutation, exact warning codes/order, and repeated-call
equality. No test may make a network request or depend on real-course data.

## Claude QA-planning red lines

Claude must treat these as blockers if the implementation plan allows them:

- fabricated/healed geometry or destructive loss of raw source evidence;
- spatial association or arbitrary thresholds;
- relation/multipolygon assembly;
- nondeterminism from input ordering or unstable sorting;
- numeric-ID-only identity collisions between node/way/relation;
- loose coercion of refs, pars, tags, or coordinates;
- missing required tee/green/ambiguous-order warnings;
- mutation, network/storage/logging/rendering side effects;
- new dependencies or scope from CTC-006/CTC-019/PDF behavior;
- real-course fixtures or prohibited reference-project reuse.

## Claude QA-planning disposition

Claude returned `READY WITH REQUIRED SPEC CORRECTIONS`. B-1 through B-4 and
Q1 through Q5 are incorporated above. Development is authorized after these
corrections are recorded.

Two Claude recommendations were corrected during critical review:

- Rejected first-seen conflict winners because they contradict the required
  shuffled-input determinism test. Canonical structural ordering selects the
  stable winner instead.
- A discarded duplicate course record does not also count toward
  `MULTIPLE_COURSE_CANDIDATES`; candidate count is evaluated after source-key
  conflict resolution.
`````

<!-- END EXACT FILE 4/13: docs/handoffs/ctc-005-gemini-specification-review.md -->

<!-- BEGIN EXACT FILE 5/13: src/overpass.ts -->

### src/overpass.ts

`````text
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
`````

<!-- END EXACT FILE 5/13: src/overpass.ts -->

<!-- BEGIN EXACT FILE 6/13: src/normalize.ts -->

### src/normalize.ts

`````text
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
`````

<!-- END EXACT FILE 6/13: src/normalize.ts -->

<!-- BEGIN EXACT FILE 7/13: src/normalize.test.ts -->

### src/normalize.test.ts

`````text
import completeFixture from "../fixtures/overpass/synthetic-golf-course.json";
import incompleteFixture from "../fixtures/overpass/synthetic-golf-course-incomplete.json";
import { normalizeGolfCourse } from "./normalize";
import type { OverpassResponse, SourceMetadata } from "./overpass";

const source: SourceMetadata = {
  query: "synthetic detail query",
  endpoint: "https://example.invalid/overpass",
  completedAt: "2026-06-07T00:00:00Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: "https://www.openstreetmap.org/copyright",
};

function normalized(fixture: unknown) {
  return normalizeGolfCourse(fixture as OverpassResponse, source);
}

describe("normalizeGolfCourse complete synthetic fixture", () => {
  it("classifies, associates, and preserves source evidence", () => {
    const result = normalized(completeFixture);
    expect(result.source).toBe(source);
    expect(result.courseCandidates.map(({ source: record }) => record.sourceKey)).toEqual(["way/9000000001"]);
    expect(result.holes).toHaveLength(1);
    expect(result.holes[0].number).toBe(1);
    expect(result.holes[0].par).toBe(4);
    expect(result.holes[0].features.map(({ kind }) => kind)).toEqual([
      "tee", "fairway", "green", "golf-water",
    ]);
    expect(result.holes[0].features[0].source.rawNodes).toBeDefined();
    expect(result.unassociatedFeatures.map(({ kind }) => kind)).toEqual([
      "bunker", "generic-water", "vegetation",
    ]);
    expect(result.warnings).toEqual([]);
  });

  it("is invariant to element order and does not mutate frozen input", () => {
    const frozen = structuredClone(completeFixture) as OverpassResponse;
    for (const element of frozen.elements) {
      if (element.tags) Object.freeze(element.tags);
      if (Array.isArray(element.geometry)) Object.freeze(element.geometry);
      Object.freeze(element);
    }
    Object.freeze(frozen.elements);
    Object.freeze(frozen);

    const expected = normalizeGolfCourse(frozen, source);
    const shuffled = { ...completeFixture, elements: [...completeFixture.elements].reverse() } as OverpassResponse;
    expect(normalizeGolfCourse(shuffled, source)).toEqual(expected);
    expect(normalizeGolfCourse(frozen, source)).toEqual(expected);
  });
});

describe("normalizeGolfCourse incomplete synthetic fixture", () => {
  it("preserves ambiguity and reports deterministic warnings without healing", () => {
    const result = normalized(incompleteFixture);
    expect(result.holes.map(({ number }) => number)).toEqual([1, 1, null]);
    expect(result.holes.every(({ features }) => features.length === 0)).toBe(true);
    expect(result.unassociatedFeatures.map(({ source: record }) => record.sourceKey)).toEqual([
      "node/9000001401",
      "relation/9000001301",
    ]);
    expect(result.warnings.map(({ code }) => code)).toEqual([
      "AMBIGUOUS_FEATURE_REF",
      "AMBIGUOUS_FEATURE_REF",
      "AMBIGUOUS_HOLE_ORDER",
      "DUPLICATE_SOURCE_KEY",
      "MALFORMED_CONSUMED_TAG",
      "MISSING_GREEN",
      "MISSING_GREEN",
      "MISSING_OR_MALFORMED_GEOMETRY",
      "MISSING_TEE",
      "MISSING_TEE",
      "UNSUPPORTED_RELATION",
    ]);
    expect(result.warnings.filter(({ code }) => code === "DUPLICATE_SOURCE_KEY")).toHaveLength(1);
    expect(result.unassociatedFeatures.find(({ source: record }) => record.sourceKey === "relation/9000001301")?.geometry).toBeNull();
  });

  it("uses strict refs, exact classification precedence, and scoped IDs", () => {
    const fixture: OverpassResponse = {
      elements: [
        { type: "node", id: 42, lat: 35, lon: -80, tags: { golf: "water_hazard", natural: "water" } },
        { type: "way", id: 42, geometry: [{ lat: 35, lon: -80 }, { lat: 35.01, lon: -79.99 }], tags: { golf: "hole", ref: "01" } },
      ],
    };
    const result = normalizeGolfCourse(fixture, source);
    expect(result.holes[0].number).toBeNull();
    expect(result.unassociatedFeatures[0].kind).toBe("golf-water");
    expect(result.unassociatedFeatures[0].classifiedBy).toEqual(["golf", "water_hazard"]);
    expect(result.warnings.some(({ code }) => code === "DUPLICATE_SOURCE_KEY")).toBe(false);
  });

  it("parses rough and tree features when available", () => {
    const fixture: OverpassResponse = {
      elements: [
        {
          type: "way",
          id: 9000002001,
          geometry: [
            { lat: 35, lon: -80 },
            { lat: 35.001, lon: -80 },
            { lat: 35.001, lon: -79.999 },
            { lat: 35, lon: -80 },
          ],
          tags: { golf: "rough" },
        },
        { type: "node", id: 9000002002, lat: 35, lon: -80, tags: { natural: "tree" } },
      ],
    };
    const result = normalizeGolfCourse(fixture, source);
    expect(result.unassociatedFeatures.map(({ kind }) => kind)).toEqual(["vegetation", "rough"]);
  });

  it("emits ZERO_COURSE_CANDIDATES for input with no leisure=golf_course elements", () => {
    const result = normalizeGolfCourse({ elements: [] }, source);
    expect(result.courseCandidates).toHaveLength(0);
    expect(result.warnings.map(({ code }) => code)).toContain("ZERO_COURSE_CANDIDATES");
    expect(result.warnings.find(({ code }) => code === "ZERO_COURSE_CANDIDATES")?.severity).toBe("error");
  });

  it("emits MULTIPLE_COURSE_CANDIDATES for two distinct leisure=golf_course elements", () => {
    const fixture: OverpassResponse = {
      elements: [
        {
          type: "way",
          id: 9000009001,
          geometry: [
            { lat: 35, lon: -80 },
            { lat: 35.01, lon: -80 },
            { lat: 35.01, lon: -79.99 },
            { lat: 35, lon: -79.99 },
            { lat: 35, lon: -80 },
          ],
          tags: { leisure: "golf_course", name: "Synthetic Course A" },
        },
        {
          type: "way",
          id: 9000009002,
          geometry: [
            { lat: 35, lon: -80 },
            { lat: 35.01, lon: -80 },
            { lat: 35.01, lon: -79.99 },
            { lat: 35, lon: -79.99 },
            { lat: 35, lon: -80 },
          ],
          tags: { leisure: "golf_course", name: "Synthetic Course B" },
        },
      ],
    };
    const result = normalizeGolfCourse(fixture, source);
    expect(result.courseCandidates).toHaveLength(2);
    expect(result.warnings.map(({ code }) => code)).toContain("MULTIPLE_COURSE_CANDIDATES");
    expect(result.warnings.find(({ code }) => code === "MULTIPLE_COURSE_CANDIDATES")?.severity).toBe("warning");
  });
});
`````

<!-- END EXACT FILE 7/13: src/normalize.test.ts -->

<!-- BEGIN EXACT FILE 8/13: fixtures/overpass/synthetic-golf-course.json -->

### fixtures/overpass/synthetic-golf-course.json

`````text
{
  "version": 0.6,
  "generator": "Chart the Course synthetic Overpass fixture",
  "osm3s": {
    "timestamp_osm_base": "2026-06-05T00:00:00Z",
    "copyright": "Synthetic fixture for parser tests; not real OSM data."
  },
  "chartTheCourseFixture": {
    "contract": "docs/overpass-query-contract.md",
    "synthetic": true,
    "sourceCheckedDate": "2026-06-05",
    "sourceCopyrightUrl": "https://www.openstreetmap.org/copyright",
    "bbox": {
      "south": 35.0000,
      "west": -80.0000,
      "north": 35.0100,
      "east": -79.9900
    },
    "queryPurpose": "golf-course-detail"
  },
  "elements": [
    {
      "type": "way",
      "id": 9000000001,
      "bounds": {
        "minlat": 35.0000,
        "minlon": -80.0000,
        "maxlat": 35.0100,
        "maxlon": -79.9900
      },
      "nodes": [9100000001, 9100000002, 9100000003, 9100000004, 9100000001],
      "geometry": [
        { "lat": 35.0000, "lon": -80.0000 },
        { "lat": 35.0100, "lon": -80.0000 },
        { "lat": 35.0100, "lon": -79.9900 },
        { "lat": 35.0000, "lon": -79.9900 },
        { "lat": 35.0000, "lon": -80.0000 }
      ],
      "tags": {
        "leisure": "golf_course",
        "name": "Synthetic Municipal Course",
        "golf:course": "9_hole"
      }
    },
    {
      "type": "way",
      "id": 9000000101,
      "nodes": [9100000101, 9100000102, 9100000103],
      "geometry": [
        { "lat": 35.0010, "lon": -79.9990 },
        { "lat": 35.0040, "lon": -79.9965 },
        { "lat": 35.0070, "lon": -79.9940 }
      ],
      "tags": {
        "golf": "hole",
        "ref": "1",
        "par": "4"
      }
    },
    {
      "type": "way",
      "id": 9000000201,
      "nodes": [9100000201, 9100000202, 9100000203, 9100000204, 9100000201],
      "geometry": [
        { "lat": 35.0008, "lon": -79.9993 },
        { "lat": 35.0013, "lon": -79.9993 },
        { "lat": 35.0013, "lon": -79.9987 },
        { "lat": 35.0008, "lon": -79.9987 },
        { "lat": 35.0008, "lon": -79.9993 }
      ],
      "tags": {
        "golf": "tee",
        "ref": "1"
      }
    },
    {
      "type": "way",
      "id": 9000000301,
      "nodes": [9100000301, 9100000302, 9100000303, 9100000304, 9100000301],
      "geometry": [
        { "lat": 35.0020, "lon": -79.9982 },
        { "lat": 35.0056, "lon": -79.9960 },
        { "lat": 35.0052, "lon": -79.9951 },
        { "lat": 35.0018, "lon": -79.9973 },
        { "lat": 35.0020, "lon": -79.9982 }
      ],
      "tags": {
        "golf": "fairway",
        "ref": "1"
      }
    },
    {
      "type": "way",
      "id": 9000000401,
      "nodes": [9100000401, 9100000402, 9100000403, 9100000404, 9100000401],
      "geometry": [
        { "lat": 35.0065, "lon": -79.9945 },
        { "lat": 35.0073, "lon": -79.9942 },
        { "lat": 35.0071, "lon": -79.9935 },
        { "lat": 35.0064, "lon": -79.9937 },
        { "lat": 35.0065, "lon": -79.9945 }
      ],
      "tags": {
        "golf": "green",
        "ref": "1"
      }
    },
    {
      "type": "way",
      "id": 9000000501,
      "nodes": [9100000501, 9100000502, 9100000503, 9100000504, 9100000501],
      "geometry": [
        { "lat": 35.0058, "lon": -79.9948 },
        { "lat": 35.0061, "lon": -79.9947 },
        { "lat": 35.0060, "lon": -79.9943 },
        { "lat": 35.0057, "lon": -79.9944 },
        { "lat": 35.0058, "lon": -79.9948 }
      ],
      "tags": {
        "golf": "bunker"
      }
    },
    {
      "type": "way",
      "id": 9000000601,
      "nodes": [9100000601, 9100000602, 9100000603, 9100000604, 9100000601],
      "geometry": [
        { "lat": 35.0035, "lon": -79.9952 },
        { "lat": 35.0043, "lon": -79.9949 },
        { "lat": 35.0040, "lon": -79.9940 },
        { "lat": 35.0033, "lon": -79.9944 },
        { "lat": 35.0035, "lon": -79.9952 }
      ],
      "tags": {
        "natural": "water",
        "water": "pond"
      }
    },
    {
      "type": "way",
      "id": 9000000701,
      "nodes": [9100000701, 9100000702, 9100000703, 9100000704, 9100000701],
      "geometry": [
        { "lat": 35.0048, "lon": -79.9964 },
        { "lat": 35.0051, "lon": -79.9962 },
        { "lat": 35.0049, "lon": -79.9958 },
        { "lat": 35.0046, "lon": -79.9960 },
        { "lat": 35.0048, "lon": -79.9964 }
      ],
      "tags": {
        "golf": "water_hazard",
        "ref": "1"
      }
    },
    {
      "type": "way",
      "id": 9000000801,
      "nodes": [9100000801, 9100000802, 9100000803, 9100000804, 9100000801],
      "geometry": [
        { "lat": 35.0027, "lon": -79.9956 },
        { "lat": 35.0034, "lon": -79.9955 },
        { "lat": 35.0033, "lon": -79.9948 },
        { "lat": 35.0026, "lon": -79.9950 },
        { "lat": 35.0027, "lon": -79.9956 }
      ],
      "tags": {
        "natural": "wood"
      }
    }
  ]
}
`````

<!-- END EXACT FILE 8/13: fixtures/overpass/synthetic-golf-course.json -->

<!-- BEGIN EXACT FILE 9/13: fixtures/overpass/synthetic-golf-course-incomplete.json -->

### fixtures/overpass/synthetic-golf-course-incomplete.json

`````text
{
  "elements": [
    {
      "type": "way",
      "id": 9000001001,
      "geometry": [
        { "lat": 35, "lon": -80 },
        { "lat": 35.01, "lon": -80 },
        { "lat": 35.01, "lon": -79.99 },
        { "lat": 35, "lon": -79.99 },
        { "lat": 35, "lon": -80 }
      ],
      "tags": { "leisure": "golf_course", "name": "Synthetic Incomplete Course" }
    },
    {
      "type": "way",
      "id": 9000001101,
      "geometry": [{ "lat": 35.001, "lon": -79.999 }, { "lat": 35.007, "lon": -79.994 }],
      "tags": { "golf": "hole", "ref": "1", "par": "four" }
    },
    {
      "type": "way",
      "id": 9000001102,
      "geometry": [{ "lat": 35.002, "lon": -79.998 }, { "lat": 35.008, "lon": -79.993 }],
      "tags": { "golf": "hole", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000001103,
      "geometry": [{ "lat": 35.003, "lon": -79.997 }, { "lat": 35.009, "lon": -79.992 }],
      "tags": { "golf": "hole", "ref": "9B" }
    },
    {
      "type": "way",
      "id": 9000001201,
      "geometry": [{ "lat": 35.001, "lon": -79.999 }, { "lat": 35.002, "lon": -79.998 }],
      "tags": { "golf": "tee", "ref": "1" }
    },
    {
      "type": "relation",
      "id": 9000001301,
      "members": [],
      "tags": { "golf": "green", "ref": "1" }
    },
    {
      "type": "node",
      "id": 9000001401,
      "lat": 35.004,
      "lon": -79.996,
      "tags": { "golf": "bunker", "ref": "19" }
    },
    {
      "type": "node",
      "id": 9000001401,
      "lat": 35.005,
      "lon": -79.995,
      "tags": { "golf": "bunker", "ref": "19" }
    }
  ]
}
`````

<!-- END EXACT FILE 9/13: fixtures/overpass/synthetic-golf-course-incomplete.json -->

<!-- BEGIN EXACT FILE 10/13: src/App.tsx -->

### src/App.tsx

`````text
import { useEffect, useRef, useState, type FormEvent } from "react";
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
            <ul className="raw-list">
              {state.response.elements.map((element) => <li key={`${element.type}-${element.id}`}><code>{element.type}/{element.id}</code> {elementName(element)}</li>)}
            </ul>
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
`````

<!-- END EXACT FILE 10/13: src/App.tsx -->

<!-- BEGIN EXACT FILE 11/13: src/styles.css -->

### src/styles.css

`````text
:root {
  color: #17211b;
  background: #f4f3ed;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; }
button, input { font: inherit; }
button {
  border: 1px solid #2f6241; border-radius: 6px; background: #2f6241; color: white;
  cursor: pointer; font-weight: 750; min-height: 44px; padding: .7rem 1rem;
}
button.secondary { background: white; color: #2f6241; }
button:disabled { cursor: not-allowed; opacity: .55; }
button:focus-visible, input:focus-visible, summary:focus-visible { outline: 3px solid #d18b38; outline-offset: 2px; }

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
input { border: 1px solid #748276; border-radius: 5px; min-height: 44px; padding: .65rem; width: 100%; }
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

@media (max-width: 700px) {
  .coordinate-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .candidate-list li { align-items: stretch; flex-direction: column; }
  .candidate-list button { width: 100%; }
}
`````

<!-- END EXACT FILE 11/13: src/styles.css -->

<!-- BEGIN EXACT FILE 12/13: test/e2e/app.spec.ts -->

### test/e2e/app.spec.ts

`````text
import { expect, test, type Page, type Route } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
`````

<!-- END EXACT FILE 12/13: test/e2e/app.spec.ts -->

<!-- BEGIN EXACT FILE 13/13: package.json -->

### package.json

`````text
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
`````

<!-- END EXACT FILE 13/13: package.json -->
