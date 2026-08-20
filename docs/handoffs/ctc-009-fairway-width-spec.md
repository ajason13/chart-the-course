# CTC-009 fairway width estimator specification

Status: Codex-owned specification, 2026-08-11. This is a runtime feature and
requires Claude QA-plan approval before implementation. The Notion status may
retain `1. Spec Drafting (Gemini)` solely because that is the legacy schema
label; Gemini has no role in this work.

## Scope and existing architecture

The app is a local-first React/SVG application. `normalize.ts` emits a
`NormalizedHole` with an ordered `route` (`Geometry` line) and associated
`fairway` feature polygons. `map.ts` supplies a local equirectangular tangent
plane projection in metres (`createProjection` / `projectCoordinate`), and
`HoleMap.tsx` owns selected-hole controls and SVG overlays. Carries currently
represent circular distance rings and are unrelated to this estimator.

CTC-009 adds a separate width readout and overlay for the selected hole. It
does not change the project-file schema or save estimator state.

## Definition

For a selected carry distance `d` yards, the **fairway width** is the length in
metres of the one continuous fairway-polygon interval on the line perpendicular
to the target line at the `d`-yard station that contains the station itself.
The displayed yard value is `round(metres / 0.9144)`; the metre value is
`round(metres)`. It is an outline-derived local geometric estimate, not a
guarantee of playable or hazard-free width.

"Safe zone" means that same selected connected interval only. It does not
subtract bunkers, water, trees, rough, slopes, out-of-bounds, or other hazards.
Those data contracts are intentionally outside CTC-009.

## Target line and carry station

1. Use `hole.route` only. It must be a `line` with at least two consecutive,
   distinct, valid coordinates after projecting into the local metre plane.
   Its coordinate order is authoritative: first coordinate is the tee-side
   origin and the final coordinate is the target-side end. CTC-009 does not
   infer a route from tees, greens, centroids, or a straight line.
2. Convert the chosen whole-yard distance to `d_m = d * 0.9144` metres.
3. Walk route segments in their stored order, accumulating Euclidean planar
   lengths. The station is the point `d_m` along that polyline. At an exact
   interior vertex, use the following non-zero (downstream) segment tangent;
   at the final endpoint use the preceding segment tangent. A zero-length
   segment is skipped.
4. If `d_m` is greater than the route length (with a `0.01 m` comparison
   tolerance), return `carry-beyond-target-line`, render no width, and say
   `This carry is beyond the mapped target line.`
5. The unit tangent `u` of the selected segment defines the local target-line
   direction. The estimator line is `P(t) = station + n*t`, where
   `n = (-u.y, u.x)` and `t` is signed metres. Reversing route direction is
   therefore not a benign implementation change: it moves every station.

This defines doglegs as a route polyline rather than a tee-to-green chord:
the station follows the dogleg and its width line is perpendicular to the local
segment at that station, including the deterministic downstream rule above.

## Fairway polygon and intersection algorithm

The pure helper proposed as `src/fairwayWidth.ts` accepts a normalized hole and
one carry value and returns a discriminated result plus optional display-line
endpoints. It must use the same local projection as the map, in metres; it must
not calculate widths from SVG pixels or latitude/longitude degrees. Extract
only `feature.kind === "fairway"` values whose geometry is a polygon.

For each candidate polygon:

1. Require a finite projected ring containing at least three distinct vertices;
   accept either explicit closure or implicit closure, closing it once locally.
   Otherwise record `irregular-fairway-polygon` with the source key and exclude
   that polygon.
2. Intersect every non-zero boundary edge with `P(t)`. Use a fixed `0.01 m`
   epsilon for parallel, endpoint, duplicate, and interval comparisons. A
   boundary edge collinear with `P(t)` is `unstable-line-fairway-overlap`:
   exclude that polygon and return no estimate if it is the only candidate.
3. Coalesce intersections within epsilon. A vertex touch whose incident edges
   remain on the same side of the estimator line is a **tangent**; discard it
   from interval pairing and record `tangent-fairway-boundary`. A proper
   crossing at a vertex is counted once.
4. Sort proper crossings by `t`; pair them `[0,1]`, `[2,3]`, and so on to form
   interior intervals. An odd number of proper crossings is
   `irregular-fairway-intersections`; exclude that polygon. Never manufacture
   an interval by pairing an unmatched crossing.
5. Union overlapping/touching intervals across all valid polygons. Choose the
   union interval that contains `t = 0` (epsilon-inclusive). Its width is
   `end - start`. A result is valid only when this width is greater than
   `0.01 m`; a zero/narrower interval is `unstable-degenerate-width` and has
   no numeric estimate.

No candidate polygons yields `missing-fairway`. Valid polygons with no interval
containing `t=0` yield `target-line-outside-fairway`. Both have no numeric
width. If one or more other union intervals exist, add `split-fairway` and
retain only the interval containing `t=0`; never report the distance between
outermost intersections as width. A split fairway whose target line falls in a
gap reports `target-line-outside-fairway` plus `split-fairway` and no estimate.

When valid and irregular/tangent polygons coexist, return the width from valid
polygons and surface a non-blocking caution that one or more outlines were
ignored. This is more truthful than failing a usable estimate due to unrelated
bad geometry. All failures are typed and deterministic; warnings must not be
derived from free-form parser warning text.

## UI and accessibility

Place a `Fairway width` panel beside the selected-hole carry controls. It offers
three labelled buttons or a labelled select for exactly `220 yd`, `250 yd`, and
`280 yd`, with `250 yd` initially selected on each selected hole. Selecting a
distance recomputes immediately; it neither creates a carry ring nor mutates
the project export. The successful text is, for example, `Fairway width at 250
yd: 32 yd (29 m).` Render the chosen interval as a clipped, dashed line with
short end ticks and an accessible label. Do not render an endpoint line when
there is no numeric result.

Warnings appear in the panel with `role="status"` / `aria-live="polite"`:

- missing: `No usable fairway polygon is mapped for this hole.`
- invalid target line: `The mapped target line is not usable for a fairway-width estimate.`
- beyond route: `This carry is beyond the mapped target line.`
- outside: `The target line at this carry does not fall inside a mapped fairway.`
- irregular/degenerate/odd: `Some mapped fairway outlines are irregular; their width was not used.`
- tangent/overlap: `The fairway boundary only touches or overlaps this width line; the estimate may be unavailable.`
- unstable-degenerate width: `The mapped fairway crossing is too small to estimate reliably at this carry.`
- split: `Multiple fairway sections cross this line; only the section containing the target line is measured.`

Do not describe the result as a recommendation, precise course measurement, or
hazard clearance. Preserve the existing selected-hole reset and keyboard/SVG
interaction behavior.

## Acceptance and verification matrix

Unit tests in `src/fairwayWidth.test.ts` must use small deterministic local
coordinate fixtures (converted through the shared projection boundary or a
documented pure planar test seam) and cover:

| Case | Required assertion |
| --- | --- |
| Straight fairway | 220/250/280 stations produce the known perpendicular width. |
| Dogleg | station follows route length, and exact-vertex station uses downstream tangent. |
| Narrow fairway (legitimate) | a mapped fairway about 15 yd wide returns a truthful small numeric width, not a warning. |
| Sub-epsilon degeneracy | a width below/equal to 0.01 m yields `unstable-degenerate-width`, no number. |
| Split fairway | only the interval containing station is measured; a gap returns outside + split. |
| Missing/non-polygon | typed missing warning and no overlay. |
| Degenerate/odd/tangent/collinear | deterministic warning/failure; no fabricated width. |
| Beyond route | typed beyond-target result. |

Add a focused Playwright check only if the existing selected-hole fixture can
exercise the panel without expanding network scope: choose 220/250/280, assert
the visible result/warning, and assert no external request. Run `npm run check`,
`git diff --check`, and
`npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`.

## Boundaries, security, licensing, and research

Explicitly out of scope: map provider or basemap changes; Overpass runtime
changes; production dependency additions; APIs; accounts; telemetry; cloud
persistence; PDF production behavior; and user-data-flow expansion. The helper
uses only existing normalized data and local arithmetic, so it introduces no
network, credentials, persistence, third-party code, or new license surface.
Do not copy, adapt, or incorporate AGPL-3.0 code from `ace`; do not reuse
study-only `hacker-yardage` or `openyardage-web` code.

No changeable external fact is material to this geometry-only implementation;
therefore no external source was consulted on 2026-08-11. Existing OSM-derived
fixture attribution and local-first guardrails remain unchanged.

Rejected alternatives: a tee-to-green chord (incorrect for doglegs); width in
SVG pixels/degree coordinates (not physical units); a fixed circular carry
ring intersection (not perpendicular target-line width); choosing outermost
split-fairway crossings (measures unsafe gaps); inferring missing fairways from
rough/imagery/remote services (untruthful and out of scope); and adding a
geometry library (unnecessary production dependency).

Uncertainty: OSM fairway boundaries can be incomplete, overlapping, or
topologically imperfect. The displayed number is limited to the local mapped
outline at one station, and warnings deliberately take precedence over a
plausible-looking fabricated measurement.
