# CTC-006 Claude adversarial QA-planning handoff

## Role and gate

Act as the adversarial QA planner for CTC-006, Render selected hole map with
measurement controls. Critically challenge the corrected specification baseline
before implementation. Claude Chat has no filesystem or GitHub access; this
bundle is self-contained.

CTC-006 is not yet approved for implementation. Return an
implementation-readiness verdict and required specification corrections. Do
not write implementation code, create new epics, or broaden scope.

## Acceptance criteria

- Selected hole renders with tee, fairway, green, hazards, and scale indicator.
- User can click two points and see yards/meters.
- Map remains usable on desktop and mobile widths.
- Geometry fixtures verify distance tolerance.

## Binding boundaries

- CTC-006 owns browser-side selected-hole vector rendering, scale indication,
  and two-point yards/meters measurement only.
- Consume the existing CTC-005 `NormalizationResult` contract without
  weakening, mutating, healing, simplifying, or spatially re-associating it.
- Use dependency-free native React SVG with a fixed logical viewBox,
  blank/vector-only rendering, no basemap/provider/API key, and visible OSM
  attribution.
- No pan/zoom, pin dragging/snapping, durable cache, refresh/backoff/failover,
  geocoding, localStorage preference, PDF/export, target markers, carry arcs,
  notes, persistence, or new production dependency.
- CTC-019 owns durable request/cache policy. CTC-007 owns target markers,
  carry arcs, and the local project model.
- Use only synthetic fixtures. No prohibited reference-project reuse.

## Gemini response disposition

Gemini produced one relevant response and one failed final revision. The
relevant response correctly selected dependency-free React SVG and geodesic
measurement but contained contract and algorithm errors. Codex corrected those
errors in the first embedded file. The final Gemini revision was rejected in
full after it abandoned SVG for Canvas and reintroduced prohibited behavior.
Treat the corrected review as the sole specification baseline.

## Required review questions

1. Is native React SVG with zero new dependencies sufficient and correctly
   bounded for every acceptance criterion?
2. Is integration with the existing `NormalizationResult` precise, especially
   stable selection identity, null geometry, warnings, and unassociated
   features?
3. Resolve exact deterministic projection rules: logical viewBox, padding,
   minimum display extent, inverse, bounds, pole behavior, and typed failures.
4. Resolve exact measurement rules: Earth radius, safeguards, rounding,
   tolerance, both-unit display, and nice-distance scale bar.
5. Resolve Pointer Events and keyboard behavior: blank-space measurement,
   clamping/rejection, logical steps, third-point restart, clear, hole changes,
   resize, focus, announcements, and mobile usability.
6. Are layer inclusion/order and non-color styling deterministic for point,
   line, and polygon geometries?
7. Define warning matching/display without inferred causality or suppression.
8. Does the synthetic fixture and Vitest/Playwright matrix prove all acceptance
   criteria while preserving network isolation and existing behavior?
9. Identify any remaining CTC-007, CTC-019, provider, persistence, PDF/export,
   dependency, hidden diagnostics, or logging leakage.

## Required verdict format

Return:

1. **Verdict:** exactly `READY`, `READY WITH REQUIRED SPEC CORRECTIONS`, or
   `NOT READY`.
2. **Blocking findings:** numbered, with failure scenario and correction.
3. **Accepted baseline decisions.**
4. **Required corrected decisions:** exact deterministic rules suitable for
   implementation.
5. **Adversarial test matrix:** input/action, expected visual/measurement/state
   result, accessibility assertion, and source-contract assertion.
6. **Rejected/deferred recommendations.**
7. **Implementation gate:** state whether CTC-006 may move to
   `3. In Development (ChatGPT)` after corrections are recorded.

Treat invented contracts, unassociated-feature rendering, fabricated geometry,
pixel-based distance, nondeterministic projection, incorrect geodesic math,
hidden attribution/warnings, inaccessible interaction, mobile overflow,
external network access, real-course fixtures, new dependencies, and scope
leakage as blockers.

## Exact relevant repository file contents

<!-- BEGIN EXACT FILE 1/12: docs/handoffs/ctc-006-gemini-specification-review.md -->

### docs/handoffs/ctc-006-gemini-specification-review.md

`````text
# CTC-006 Gemini specification critical review

Date: 2026-06-11

## Review verdict

Gemini's corrected response is relevant and useful, but it is not
implementation-ready as written. It correctly selected dependency-free native
React SVG, preserved geographic coordinates for measurement, proposed
latitude-aware projection, chose geodesic two-point distance, and covered
pointer, touch, keyboard, responsive, attribution, and synthetic-test concerns.

The response also contradicts the existing CTC-005 contract, invents types and
fixture shapes, renders unassociated features as selected-hole fallbacks,
proposes an incorrect antipodal failure rule, and leaves projection, scale-bar,
interaction, and accessibility behavior insufficiently precise. The accepted
and corrected decisions below are the specification baseline for Claude
adversarial QA planning. CTC-006 is not approved for implementation until
Claude challenges this baseline and required corrections are recorded.

## Accepted decisions

- Use native React SVG with zero new production dependencies.
- Keep projection and distance math in pure dependency-free TypeScript helpers
  separate from React interaction state.
- Preserve every CTC-005 `{ lat, lon }` coordinate unchanged; projected SVG
  coordinates are derived values only.
- Use a latitude-aware local projection for visual geometry and geodesic
  distance for measurement.
- Render deterministic SVG layer groups and keep the measurement overlay last.
- Keep OSM attribution visible whenever OSM-derived geometry is visible.
- Provide explicit pointer/touch and keyboard two-point measurement behavior,
  a clear action, responsive layout, and live announcements.
- Use only synthetic fixtures and retain Playwright network isolation and axe
  checks.
- Clear measurement when the selected hole changes. Preserve geographic
  measurement points when only the viewport size changes.
- Return deterministic diagnostics from pure math helpers or visible UI state;
  do not add logging side effects.

## Rejected or corrected Gemini decisions

- Reject the invented `NormalizedGolfCourse`, `sourceEvidence`,
  `holeNumber`, `routeGeometry`, feature `type`, and feature `nodes` contracts.
  The authoritative input is the existing `NormalizationResult`,
  `NormalizedHole`, `NormalizedFeature`, and `Geometry` types in
  `src/normalize.ts`.
- Reject passing a course plus selected array index into the map as the core
  contract. Selection identity must use the stable hole
  `source.sourceKey`; an index may change when normalized results change.
- Reject rendering any `unassociatedFeatures` in a selected-hole view. CTC-005
  deliberately preserves those features because association is unknown.
  Rendering them as selected-hole context implies unsupported association.
- Reject using unassociated features or invented fallback geometry when a hole
  route is null. A selected hole may render its own associated non-null feature
  geometry without a route; if it has no renderable route or associated
  geometry, show an empty state.
- Reject claims about a hole "relying on an unsupported relation." Warnings are
  result-level structured records and may not prove that relationship. Display
  the exact relevant normalization warnings without inventing causality.
- Reject throwing merely because latitude and longitude could plausibly be
  swapped. Both may be valid in their ranges. Named fields and runtime range
  validation prevent order mistakes; invalid coordinates produce a
  deterministic non-renderable result instead of crashing the app.
- Reject degree-based `±0.001` geometry padding. Projection may create a
  deterministic minimum display extent for point-only or one-axis geometry,
  but it must not mutate or imply source geometry.
- Reject fixed browser-pixel projection as the canonical model. Use a fixed
  logical SVG viewBox and `preserveAspectRatio`; CSS handles responsive display.
  Pointer coordinates must convert through SVG's current screen transform.
- Reject a Haversine rule that returns `null` for antipodal points. Clamp the
  computed `a` value to `[0, 1]`; valid antipodal coordinates have a valid
  distance. Invalid/non-finite coordinates return a typed failure.
- Reject a fixed 100-pixel scale bar derived from DOM pixels. Scale indication
  must be deterministic in logical SVG units and select a labeled "nice"
  ground distance that fits a bounded portion of the logical viewport.
- Reject `onTouchStart` as a separate primary interaction path. Use Pointer
  Events for mouse, pen, and touch, with keyboard behavior implemented
  separately. Avoid duplicate touch/click selection.
- Reject invisible production JSON diagnostics and test-only UI contracts as
  observability. Test exported pure helpers directly and expose user-relevant
  warnings, measurement state, and attribution visibly.
- Reject exact unreviewed colors and color-only distinctions. Styling must use
  existing CSS conventions, sufficient contrast, and non-color distinctions
  such as strokes/dashes where needed.
- Reject exact 10-pixel keyboard movement until the logical viewport and
  keyboard step contract are defined. Keyboard movement must be deterministic,
  bounded, visible, and usable at mobile and desktop display sizes.
- Reject the fabricated fixture and the claim that the proposed 0.0009-degree
  latitude delta must equal exactly 100.1 meters. Test expected distances
  against independently calculated bounded values with explicit tolerance.

## Corrected specification baseline

### Module and input boundary

Add a small pure geometry/rendering module, likely `src/map.ts`, with types and
functions for:

- collecting renderable coordinates from one `NormalizedHole`;
- producing a deterministic local projection and inverse projection;
- projecting point, line, and polygon geometry into logical SVG coordinates;
- calculating geodesic meters and formatting meters/yards;
- calculating a deterministic scale-bar model.

The React map component consumes:

```typescript
type HoleMapProps = {
  hole: NormalizedHole;
  warnings: NormalizationWarning[];
  source: SourceMetadata;
};
```

Exact component/file names remain reviewable by Claude. The selected hole is
identified outside the component by `hole.source.sourceKey`. The app calls
`normalizeGolfCourse(response, source)` only for successful detail responses,
retains the `NormalizationResult`, and offers deterministic hole selection.

### Selected-hole rendering eligibility

- A hole is selectable even when its number is null; label it using its number
  when present and stable source key otherwise.
- Render only the selected hole's non-null `route` and its own associated
  features with non-null geometry.
- Never render `NormalizationResult.unassociatedFeatures` in the selected-hole
  map.
- Include all supported `Geometry` variants: point, line, and polygon.
- If the selected hole has no route and no associated non-null feature
  geometry, render a visible non-renderable empty state and no SVG map.
- Display result-level normalization warnings without changing or inferring
  their meaning. Provide a useful selected-hole subset by matching
  `sourceKey`, `holeNumber`, or refs only where the warning itself supplies
  that evidence; keep the complete warning list available.

### Projection

- Use a fixed logical SVG viewBox, with exact dimensions and padding resolved
  by Claude. Responsive CSS scales the SVG while preserving aspect ratio.
- Collect the selected hole's renderable coordinates without mutation.
- Validate finite/in-range named `{ lat, lon }` coordinates defensively.
- Use a local equirectangular projection centered at the coordinate-bounds
  midpoint. Longitude delta is multiplied by cosine of center latitude; north
  remains visually up.
- Fit the projected bounds uniformly into the padded logical viewport and
  center unused space.
- Define a deterministic minimum projected extent for point-only or one-axis
  geometry. This is display-only and must not add or alter geographic
  coordinates.
- Return a typed failure for no valid coordinates, invalid viewport/padding,
  non-finite math, or a near-zero longitude cosine that cannot produce a
  reliable inverse.
- Projection and inverse projection must round-trip within an explicit
  tolerance and remain deterministic under repeated calls.
- Resizing the CSS display does not recompute geographic projection or clear
  measurement because the logical viewBox is stable.

### Layers

Render groups in this back-to-front order:

1. vegetation
2. generic-water
3. golf-water
4. rough
5. fairway
6. bunker
7. green
8. tee
9. route
10. measurement overlay

Within a feature-kind group, preserve the existing deterministic
`hole.features` source-key order. Geometry-specific SVG primitives must be
deterministic. Styling must distinguish feature classes sufficiently without
depending on color alone.

### Measurement

- Store selected measurement anchors as original geographic `Coordinate`
  values obtained by inverse-projecting logical SVG positions.
- Pointer and keyboard input must be clamped or rejected consistently at the
  logical viewport boundary; Claude must resolve the exact rule.
- Use Haversine distance with a single documented Earth-radius constant and
  exact international conversion `1 yard = 0.9144 meters`.
- Clamp Haversine `a` to `[0, 1]`. Identical valid points return zero. Invalid
  coordinates return a typed failure; antipodal coordinates remain valid.
- Display both yards and meters to satisfy the acceptance criterion. A unit
  toggle is unnecessary unless Claude finds the phrase requires switchable
  primary units; conservative default is one result showing both rounded
  whole-unit values.
- The scale bar uses the same projection/measurement contract. Choose a
  deterministic nice distance from a documented sequence and a bar length that
  fits a bounded fraction of the logical viewport. Label the represented
  ground distance, not raw pixels.

### Interaction and accessibility

- Use Pointer Events for mouse, pen, and touch. First activation sets anchor
  one, second sets anchor two, and a third starts a new measurement. A visible
  clear button resets both.
- Do not require hover/live tracking for acceptance; it may be omitted to keep
  the interaction deterministic and touch-equivalent.
- The SVG or its containing interaction surface is keyboard focusable. A
  visible bounded logical crosshair starts at the viewport center; arrow keys
  move it by a documented logical-unit step, Enter/Space select, and Escape
  clears.
- Prevent page scrolling only for handled map keys while the interaction
  surface has focus.
- Measurement points and line must remain visually distinguishable independent
  of color and have adequate touch visibility.
- Provide an accessible map name/description, visible instructions, visible
  result text showing both units, polite live announcements for completed
  actions, and clear focus styling.
- Keep visible attribution adjacent to every rendered map. The full copyright
  URL remains linked.
- Clear measurement on selected-hole identity change; retain it across CSS
  resize because anchors are geographic.

### Tests and fixture

- Prefer pure Vitest tests in `src/map.test.ts` for coordinate collection,
  projection/inverse round trips, north-up orientation, aspect fit, minimum
  extent, invalid input, all geometry variants, layer ordering, Haversine known
  values/tolerance, yards conversion, antipodal/identical cases, and nice scale
  selection.
- Extend or add an explicitly synthetic normalized/detail fixture that matches
  the actual CTC-005 types. Ensure at least one selectable hole has route, tee,
  fairway, green, bunker, golf-water, rough, generic-water, and vegetation
  associated by explicit strict ref if every layer must be tested. Do not
  spatially infer association.
- Add focused component tests only if the existing Vitest Node environment can
  support them without a new dependency; otherwise cover component behavior in
  Playwright.
- Extend the existing Playwright network-isolated flow to load synthetic detail,
  select a hole, verify deterministic layers/attribution/warnings, measure using
  pointer and keyboard, clear/restart, switch holes, and test mobile overflow,
  focus, live result text, and axe behavior.
- Keep existing search, raw diagnostics, cache behavior, and error-state tests
  passing. Do not introduce external requests.

## Remaining questions for Claude

1. Resolve exact logical viewBox dimensions, padding, and deterministic minimum
   projected extent without fabricating geographic geometry.
2. Resolve whether pointer/keyboard positions outside the inner rendered
   bounds are clamped or rejected, and whether measurement may target blank map
   space.
3. Resolve the exact keyboard logical-unit step and whether a modified larger
   step is needed.
4. Resolve the exact Earth-radius constant, display rounding, distance
   tolerance, and nice-scale sequence.
5. Resolve whether selected-hole warnings plus an expandable complete warning
   list are sufficient, and define warning matching without inferred
   causality.
6. Resolve whether associated generic-water and vegetation should be included
   in selected-hole bounds/rendering when explicit refs caused CTC-005 to
   associate them. Recommended default: yes.
7. Resolve whether the map component needs a provider-adapter placeholder now.
   Recommended default: no provider code until a provider is actually adopted.

## Claude QA-planning red lines

Treat these as blockers:

- any new production dependency, basemap/provider, network, cache, persistence,
  PDF/export, target-marker, carry-arc, or CTC-019 behavior;
- invented normalized types or fixture contracts that do not compile against
  `src/normalize.ts`;
- rendering or measuring unassociated features as selected-hole context;
- mutation, healing, simplification, or spatial inference over CTC-005
  geometry;
- measurement performed from SVG/pixel coordinates without inverse projection
  to geographic coordinates;
- swapped coordinate order, invalid/non-finite math, nondeterministic
  projection, or incorrect antipodal handling;
- hidden attribution, suppressed warnings, color-only semantics, inaccessible
  pointer-only interaction, or mobile overflow;
- hidden production test diagnostics or logging side effects;
- external network access or real-course fixtures in tests.

## Final Gemini revision disposition

Gemini received one final revision opportunity with 18 explicit mandatory
corrections and seven decisions to resolve. The final response was rejected in
full because it:

- abandoned native React SVG for layered Canvas/SVG/DOM rendering;
- reintroduced pan, zoom, pin dragging, snapping, multi-touch gestures,
  localStorage preferences, and out-of-bounds styling outside CTC-006;
- invented `RawGPSCoordinate`, normalized `[0,1]` types, and other contracts
  instead of using `src/normalize.ts`;
- prescribed console logging, Jest, Cypress, browser-pixel/DPR math, and
  unsupported sub-millisecond/sub-millimeter/60-FPS claims;
- failed to resolve the required fixed logical viewBox, deterministic minimum
  extent, warning matching, actual CTC-005 fixture contract, and bounded
  keyboard behavior.

No decisions from the final Gemini revision supersede this corrected baseline.
Proceed to Claude adversarial QA planning using this document as authority.
`````

<!-- END EXACT FILE 1/12: docs/handoffs/ctc-006-gemini-specification-review.md -->

<!-- BEGIN EXACT FILE 2/12: docs/handoffs/ctc-006-gemini-specification-revision-prompt.md -->

### docs/handoffs/ctc-006-gemini-specification-revision-prompt.md

`````text
# CTC-006 final Gemini specification revision

Revise your prior CTC-006 specification one final time. Your response was
relevant, but it is not implementation-ready because several recommendations
contradict the supplied repository contracts.

Use the original self-contained
`docs/handoffs/ctc-006-gemini-specification-prompt.md` and the following
mandatory corrections. Return a complete replacement specification, not a
commentary or change summary.

## Mandatory corrections

1. Use only the actual existing contracts from `src/normalize.ts`:
   `NormalizationResult`, `NormalizedHole`, `NormalizedFeature`, `Geometry`,
   `NormalizationWarning`, `Coordinate`, and `SourceMetadata`. Do not invent
   `NormalizedGolfCourse`, `sourceEvidence`, `holeNumber`, `routeGeometry`,
   feature `type`, or feature `nodes`.
2. Identify selected holes by stable `hole.source.sourceKey`, not array index.
3. Never render or measure `NormalizationResult.unassociatedFeatures` as
   selected-hole context. Do not use them as null-route fallbacks or infer that
   they belong to a hole.
4. A selected hole renders only its own non-null route and associated non-null
   feature geometry. If none exists, show a non-renderable empty state.
5. Display exact normalization warnings without inventing causal claims such as
   a hole relying on an unsupported relation.
6. Use a fixed logical SVG viewBox with responsive CSS and
   `preserveAspectRatio`. Do not make browser pixels the canonical projection
   coordinate system.
7. Define a deterministic local equirectangular projection and inverse using
   named `{ lat, lon }` fields. Invalid coordinates return a typed failure;
   never claim valid-range coordinates can reliably be detected as swapped.
8. Define deterministic point-only and one-axis minimum display extents without
   mutating or fabricating geographic geometry.
9. Use Haversine measurement with a documented Earth-radius constant, clamp
   `a` to `[0, 1]`, treat valid antipodal points as valid, and use the exact
   international conversion `1 yard = 0.9144 meters`.
10. Display both yards and meters. Do not require a unit toggle unless you can
    prove it is required by the acceptance criteria.
11. Define a deterministic logical-SVG scale bar using a documented nice-
    distance sequence. Do not use a fixed 100 browser-pixel bar.
12. Use Pointer Events for mouse, pen, and touch to avoid duplicate touch/click
    selection. Define keyboard behavior separately.
13. Do not require hover/live tracking. Define deterministic two-point select,
    third-point restart, clear, selected-hole change, resize, focus, arrow-key,
    Enter/Space, and Escape behavior.
14. Do not add hidden production JSON diagnostics. Prefer exported pure helper
    tests and visible user-relevant warning/measurement state.
15. Do not prescribe unreviewed exact colors or color-only distinctions.
    Require adequate contrast and non-color distinctions such as strokes or
    dashes.
16. Define fixtures using the actual CTC-005 types. Do not fabricate exact
    distance expectations; use independently calculated expected values with
    explicit tolerances.
17. Keep existing discovery/detail, cache, diagnostics, error, network-
    isolation, attribution, and axe behavior passing.
18. Add no production dependency, provider, basemap, network/cache policy,
    persistence, PDF/export, target marker, carry arc, or CTC-019 behavior.

## Decisions you must resolve

Return exact recommended defaults for:

1. Logical SVG viewBox dimensions, padding, and minimum projected extent.
2. Whether measurement positions outside the inner rendered bounds are clamped
   or rejected, and whether blank map space is measurable.
3. Keyboard logical-unit step and optional modified larger step.
4. Earth-radius constant, display rounding, distance-test tolerance, and nice-
   scale sequence.
5. Warning matching/display behavior without inferred causality.
6. Whether explicitly ref-associated generic-water and vegetation are included
   in selected-hole rendering and bounds.
7. Whether a provider-adapter placeholder is needed now. Conservative default:
   no provider code until a provider is adopted.

## Required output

Return the complete implementation-ready CTC-006 specification using the
original prompt's 14-section response format. The first sentence must be:

`CTC-006 specifies browser-side selected-hole vector rendering and two-point
measurement only.`

Do not discuss the prior Redis response, AI-agent workflows, roadmaps, epics,
or unrelated tasks. Do not write implementation code.
`````

<!-- END EXACT FILE 2/12: docs/handoffs/ctc-006-gemini-specification-revision-prompt.md -->

<!-- BEGIN EXACT FILE 3/12: docs/tile-provider-strategy.md -->

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

<!-- END EXACT FILE 3/12: docs/tile-provider-strategy.md -->

<!-- BEGIN EXACT FILE 4/12: src/overpass.ts -->

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

<!-- END EXACT FILE 4/12: src/overpass.ts -->

<!-- BEGIN EXACT FILE 5/12: src/normalize.ts -->

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

<!-- END EXACT FILE 5/12: src/normalize.ts -->

<!-- BEGIN EXACT FILE 6/12: src/normalize.test.ts -->

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

<!-- END EXACT FILE 6/12: src/normalize.test.ts -->

<!-- BEGIN EXACT FILE 7/12: fixtures/overpass/synthetic-golf-course.json -->

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

<!-- END EXACT FILE 7/12: fixtures/overpass/synthetic-golf-course.json -->

<!-- BEGIN EXACT FILE 8/12: fixtures/overpass/synthetic-golf-course-incomplete.json -->

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

<!-- END EXACT FILE 8/12: fixtures/overpass/synthetic-golf-course-incomplete.json -->

<!-- BEGIN EXACT FILE 9/12: src/App.tsx -->

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

<!-- END EXACT FILE 9/12: src/App.tsx -->

<!-- BEGIN EXACT FILE 10/12: src/styles.css -->

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

<!-- END EXACT FILE 10/12: src/styles.css -->

<!-- BEGIN EXACT FILE 11/12: test/e2e/app.spec.ts -->

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

<!-- END EXACT FILE 11/12: test/e2e/app.spec.ts -->

<!-- BEGIN EXACT FILE 12/12: package.json -->

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

<!-- END EXACT FILE 12/12: package.json -->
