# CTC-009 QA-plan correction addendum

Status: Codex response to Claude's 2026-08-11 `READY WITH REQUIRED
CORRECTIONS` verdict. All five blockers and RC-1 through RC-8 are accepted.
This addendum amends, rather than replaces,
`docs/handoffs/ctc-009-fairway-width-spec.md`. Claude checkpoint re-review is
required before implementation.

## Accepted blocker corrections

### B-1: station/vertex tolerance

Define `STATION_VERTEX_EPSILON_M = 0.001` metres. After removing zero-length
route segments (length `<= 0.01 m`), calculate cumulative endpoints. A station
matches an interior cumulative endpoint when its absolute difference is at most
that epsilon; choose the first such endpoint in route order and use the first
following retained segment as the tangent. Thus duplicate source points cannot
change the tangent. At the final cumulative endpoint, use the final retained
segment. If more than one vertex could match due to a route segment shorter than
the station epsilon, select the downstream-most matching vertex; this is
equivalent to following the route and deterministic. Unit tests must exercise
an exact vertex and values `±0.0005 m` from it.

### B-2: legitimate narrow width versus degenerate geometry

`0.01 m` is solely `INTERSECTION_EPSILON_M`, a numerical-stability floor. A
selected interval with computed width `<= 0.01 m` produces no numeric estimate
and typed warning `unstable-degenerate-width`; it is not called narrow.

Every width greater than `0.01 m`, including a legitimately narrow 15-yard
fairway, is a normal successful estimate. The required “narrow fairway” test
therefore asserts a truthful small numeric result (approximately 15 yd); a
separate sub-epsilon fixture asserts `unstable-degenerate-width` and no overlay.

### B-3: collinearity predicate

For a projected non-zero edge with endpoint signed coordinates `t0`, `t1` on
the estimator normal, the edge is collinear/overlapping exactly when
`abs(t0) <= 0.01 m && abs(t1) <= 0.01 m`. This perpendicular-deviation test is
the only collinearity predicate; no angle threshold is used. Such an edge makes
its polygon `unstable-line-fairway-overlap`, excludes it from pairing, and
never supplies a numeric estimate by itself.

### B-4: station on boundary

Containment is epsilon-inclusive: when `0` is within `0.01 m` of either end of
a valid union interval, the station is inside that interval. If it adjoins two
intervals that were not unioned, first merge them because their gap is within
the same epsilon. This removes a floating-point-dependent outside result.

### B-5: polygon ring contract

Confirmed from `src/normalize.ts` on 2026-08-11: `Geometry` has only
`{ type: "polygon"; coordinates: Coordinate[] }`; it has no multi-ring or
interior-hole representation, and normalization accepts an area only as one
explicitly closed coordinate sequence. CTC-009 therefore supports one exterior
ring per normalized fairway feature only. It cannot silently include a mapped
interior ring because such data cannot enter the normalized geometry contract.
Any future multi-ring geometry contract requires a separate reviewed task and
explicit even-odd hole subtraction. This task must not infer or reconstruct
holes from raw Overpass data.

## Accepted required corrections

- **RC-1:** Formatting uses `roundHalfUpNonnegative(x) = floor(x + 0.5)` for
  metres and yards. Widths are non-negative; this deliberately avoids an
  engine-dependent negative-rounding question. Tests include values directly
  below, at, and directly above `.5`.
- **RC-2:** The original specification and this addendum contain final warning
  copy and must be committed before development begins. At this addendum's
  drafting time they are working-tree artifacts, not committed history. The
  final audit must include both exact files.
- **RC-3:** Pairing uses the even-odd (crossing-number) fill rule exclusively.
  Polygon winding/order has no semantic effect.
- **RC-4:** Selected yardage, result, warnings, and overlay are transient
  `HoleMap` UI state only. They must never be added to `ProjectV1`, passed to
  `onProjectChange`, written to IndexedDB, or included in project export.
- **RC-5:** The warning container intentionally uses `role="status"` and
  `aria-live="polite"`, never `role="alert"`, because switching carry choices
  is an expected user action and should not interrupt assistive technology.
- **RC-6:** Union merges intervals when `next.start - current.end <= 0.01 m`.
- **RC-7:** `invalid-target-line` means route is not a line, has fewer than two
  valid finite projected points, has no retained segment longer than `0.01 m`,
  or produces non-finite projected values/tangent. It yields no estimate.
- **RC-8:** `src/fairwayWidth.ts` will hand-roll these finite line-segment
  operations in native TypeScript using existing `map.ts` projection helpers.
  No geometry package, production dependency, or raw Overpass access is
  permitted.

## Expanded mandatory test matrix

In addition to the original straight, dogleg, 15-yard narrow-success, split,
missing, malformed, and beyond-route tests, add: concave (>2 crossings),
overlapping polygon union, vertex touch without crossing, route endpoint,
mixed valid/degenerate polygons, collinear overlap, sub-epsilon result,
station-on-boundary, and station-within vertex epsilon. UI coverage must assert
`role=status` + `aria-live=polite`, overlay omission on failures, rapid carry
selection does not duplicate status nodes, no network request, and byte-equal
project export / unchanged carry data before and after width interaction.

The final diff must keep `package.json` and `package-lock.json` unchanged; the
existing compliance SBOM/license-deny/audit flow is the dependency and AGPL
provenance evidence.
