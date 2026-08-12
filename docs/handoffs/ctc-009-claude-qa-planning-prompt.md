# Claude QA-planning handoff: CTC-009 fairway width estimator

You are Claude Chat, the independent QA planner. Review this pre-implementation
specification only; do not write code. Return exactly one verdict:
`READY FOR IMPLEMENTATION`, `READY WITH REQUIRED CORRECTIONS`, or `BLOCKED`.
Then list severity-ranked blockers, required corrections, adversarial tests,
and an explicit statement whether Codex may move CTC-009 to development after
recording the corrections. Distinguish correctness blockers from optional
improvements.

## Task and hard boundaries

CTC-009 must let a user choose 220, 250, or 280 yards; calculate fairway or
safe-zone width perpendicular to a target line; clearly warn for missing or
irregular polygons; and unit-test straight, dogleg, narrow, and split fairways.
It is a local React/SVG feature. Do not approve map/basemap/provider changes,
Overpass runtime changes, production dependency additions, APIs, accounts,
telemetry, cloud persistence, PDF production behavior, or expanded user-data
flows. No third-party source or study-only code may be copied; in particular,
never incorporate AGPL-3.0 `ace` code.

## Repository facts relevant to review

- `NormalizedHole.route` is the ordered mapped `golf=hole` line.
- Associated `NormalizedHole.features` include `kind: "fairway"` polygons.
- `map.ts` projects latitude/longitude into a local equirectangular tangent
  plane in metres. `projectCoordinate` maps metres through a screen scale;
  the approved helper must calculate in metres, never pixels/degrees.
- `HoleMap.tsx` is the selected-hole UI/SVG owner. Existing carries are
  persistent circular overlays and must remain separate from this transient
  estimate. The project JSON schema must not change.

## Codex specification (authoritative proposed scope)

The estimator takes a whole-yard selection, converts it with `0.9144 m/yd`,
walks the ordered route polyline from its first point, and obtains the station
at that cumulative distance. A dogleg follows that polyline—not a chord. At an
exact interior vertex it uses the next non-zero segment tangent; at route end,
the prior one. Beyond the mapped route returns no width.

At the station, use the infinite local line perpendicular to that tangent.
For every valid fairway polygon, intersect the line against non-zero closed
edges in metre coordinates. Coalesce crossings at `0.01 m`; discard a vertex
touch whose incident edges remain on the same side as a tangent; count a proper
vertex crossing once. Collinear estimator-line/boundary overlaps are unstable.
Pair ordered proper crossings to form interiors, excluding a polygon with an
odd count. Union intervals across valid fairway polygons. The reported safe
zone is only the union interval containing station (`t=0`), with width greater
than `0.01 m`. The result must never be the outermost span across gaps.

Missing fairways, invalid route, beyond-route station, target line outside a
fairway, unstable overlaps, tangencies, degenerate polygons, odd crossings,
narrow zones, and split fairways are typed states/warnings—not guessed numbers.
If usable and bad polygons coexist, show usable width plus caution that bad
outlines were ignored. Split means two or more disjoint intervals: retain only
the interval at the target line; if it lies in a gap, show outside + split.

UI: a `Fairway width` panel with exactly 220/250/280 yd controls (250 default),
the successful text `Fairway width at 250 yd: 32 yd (29 m).`, a clipped dashed
cross-line/endpoint ticks only for valid estimates, and polite live warnings.
It must call this an outline-derived estimate, not a hazard-free recommendation.
The required warning language is recorded in
`docs/handoffs/ctc-009-fairway-width-spec.md`.

## Review questions

1. Are the route station, exact-vertex, dogleg, split, tangent, and collinear
   rules unambiguous and testable?
2. Could the stated epsilon or crossing pairing produce a misleading numeric
   answer? Identify precise corrections rather than replacing determinism with
   heuristic behavior.
3. Which unit tests are essential beyond straight/dogleg/narrow/split,
   especially concave, overlapping, vertex-touch, endpoint, malformed ring,
   and mixed-validity cases?
4. Are UI warning states and no-overlay behavior sufficiently accessible and
   resistant to accidentally mutating carries/project state or network scope?
5. Call out any violation of hard boundaries or missing security/license test.
