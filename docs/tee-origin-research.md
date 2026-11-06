# Polygon tee origins: research and proposed deferral

Issue: [#53](https://github.com/ajason13/chart-the-course/issues/53).
Baseline: `a7e146c23fc7e6af94f6feaae975779be483df8b`.
Status: proposal awaiting maintainer decision. No runtime change is authorized
by this document. The existing [geometry contract](course-geometry-contract.md)
continues to govern shipped origin behavior.

## Recommendation for approval

Explicitly defer an automatic polygon-origin replacement. Retain current
source-associated simple-tee behavior and relation-tee unavailability until a
separate behavior-change proposal resolves compatibility. Use an existing
user-authored target as the origin when a chosen planning location is needed.
This does not establish the location of an actual tee marker or player.

The synthetic results demonstrate a material order sensitivity, but establish
neither real-course prevalence nor the correct representative point. An area
centroid can lie outside a concave tee; an interior point is geometrically
contained but does not identify a playing location. No new implementation issue
should be created until an origin policy and its acceptance tests are agreed.

## Current consumers and persisted identity

[`teeOrigins`](../src/carry.ts) takes the first geometry coordinate of each
source-associated simple tee, including point tees, and excludes multipolygons.
Inferred/shared display candidates do not enter this list. A simple polygon's
first vertex is a boundary coordinate, not a defined representative location.
Current coordinate validation alone does not establish a valid polygon area;
degenerate simple input must not be represented as having a meaningful center.

`resolveCarryOrigin` supplies the coordinate to carry rings,
[`dispersionEllipse`](../src/dispersion.ts) and
[`scoreTargetRisks`](../src/riskScore.ts). Changing it moves carry-ring centers,
changes the origin-to-target bearing used for dispersion and sampled water
overlap, and can change off-map availability. This research does not quantify
the resulting overlap percentages or equate them with shot probabilities.

The [project types](../src/project.ts) persist tee origins as a source key and
target origins as a target ID, not a saved resolved tee coordinate or policy
version. Changing automatic resolution could therefore move an existing
project's derived geometry on reopen without a schema error. A schema field is
not mechanically required to replace the resolver, but compatibility must be
decided explicitly before implementation. Raw source evidence must remain exact.

## Reproducible synthetic comparison

Run `node docs/research/tee-origins.mjs` under Node 24. The dependency-free probe
uses invented local Cartesian metres, open vertex lists with implicit closing
edges, area-weighted centroids and a deliberately limited interior algorithm:
take the midpoint of the longest occupied span on the bounding-box horizontal
midline, choosing the leftmost span on a tie. It is an illustrative alternative,
not a general geographic/topology algorithm or adopted policy.

| Shape in metres | Area centroid | Interior point | Maximum first-vertex shift across cyclic starts (yards) | First vertex to centroid (yards) | Change in distance to fixed target (100,0) (yards) |
| --- | --- | --- | ---: | ---: | ---: |
| Rectangle, 24 × 12 | (12,6), inside | (12,6) | 29.345 | 14.672 | -12.900 |
| Elongated rectangle, 60 × 10 | (30,5), inside | (30,5) | 66.522 | 33.261 | -32.613 |
| L shape, arms 10 × 2 | (3.222,3.222), outside | (1,5) | 11.153 | 4.983 | -3.465 |
| Collinear vertices at x=0,10,20 | Undefined | Unavailable | 21.872 | Unavailable | Unavailable |

Shift is measured from the listed first vertex (0,0), not maximum pairwise
diameter or guaranteed yardage error. Distance change compares centroid to
first-vertex distance; negative means shorter. In particular the L centroid is
an invalid contained-origin candidate despite its computable distance.
One metre is converted using 0.9144 metres per yard. These are analytic plane
distances, not measurements from the app's geographic projection.

Assertions cover cyclic starts and reversed winding, centroid/interior stability,
interior containment for these valid examples, undefined degenerate centers,
and collinear edge densification. Densifying the rectangle preserves its area
centroid/interior point but moves an unweighted vertex average by more than two
metres. The selected (4,4) point remains inside regardless of ring start. Point
and shared-point checks are illustrative identities; existing app tests provide
the actual target/source-resolution coverage. The probe does not implement
relation topology, source association or a user-selection flow.

| Choice | Benefit | Limitation |
| --- | --- | --- |
| First vertex | Preserves current resolution and old projects | Changes with digitization order; boundary location |
| Area centroid | Stable under tested starts/winding/densification | Can be outside concave geometry; undefined at zero area |
| Interior representative | Contained for the tested simple shapes; stable under tested reordering | Algorithm/tie/projection dependent; no evidence of real marker position |
| Explicit selection using an existing target | User chooses a coordinate; independent of tee boundary order | Manual placement accuracy unverified; deleting the target makes the origin unavailable |

## Scope of the proposed deferral

- Point tees keep their source coordinate. Do not infer an origin from invalid
  coordinates or replace unavailable data with (0,0).
- Simple polygon tees retain their current first vertex, including its known
  order sensitivity. This deferral does not certify degenerate input as usable
  area or add new filtering behavior.
- Relation tees remain visible where supported and unavailable as analytic tee
  origins. Do not silently pick a member, ring or largest part.
- Shared/inferred display candidates stay display-only. Any future automatic
  policy must reuse one source-coordinate decision across consumers/holes where
  that source is legitimately associated; it must not create exclusive ownership.
- User-selected origins can already use target IDs with the current v2 project
  schema. A separately persisted tee-specific selection, automatic-policy
  version, or migrated historical coordinate needs a separate schema/compatibility
  review. No such data flow is introduced here.

## Reopening the automatic-policy question

A later proposal must define supported geometry, projection/precision,
degenerate and missing-data behavior, relation parts/interiors and tie-breaking.
Require invariance to cyclic start, winding, redundant closing coordinate and
collinear densification, with shared source identity preserved. Verify all three
consumers resolve the same coordinate and document reopened-project semantics.
Measure practical impact before choosing centroid/interior algorithms; do not
claim a geometric representative point is an actual playing position.

Maintainer approval of the explicit deferral above would satisfy #53's decision
outcome without an implementation follow-up. Until approval is recorded, the
issue remains open. No release, provider, geolocation or persistence decision is
made here.
