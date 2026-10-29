# Course geometry compatibility contract

Issue: [#46](https://github.com/ajason13/chart-the-course/issues/46).
Status: **Recommendation awaiting maintainer adoption**. Research baseline:
`1953da0` (PR #71). This document does not change runtime behavior or approve a
persisted schema, provider, data acquisition flow or production PDF dependency.
Dependent implementation remains Backlog until adoption is recorded in #46.

## Evidence and limits

Primary OSM guidance checked 2026-10-29 UTC (2026-10-28 in the maintainer’s
America/Los_Angeles timezone):

- [Fairways](https://wiki.openstreetmap.org/wiki/Tag:golf%3Dfairway) are mapped
  as areas; the mapping instructions do not require a hole-number ref. The
  guidance also describes multipolygons for complex fairway outlines.
- [Hole routes](https://wiki.openstreetmap.org/wiki/Tag:golf%3Dhole) run from tee
  to green and may carry the hole number in `ref`. Shared route/feature nodes
  are discouraged, so node membership cannot substitute for spatial evidence.
- [Facilities](https://wiki.openstreetmap.org/wiki/Tag:leisure%3Dgolf_course#Courses_in_a_facility)
  may contain multiple playing courses. The documented `type=sport`,
  `golf=course` relation groups holes; a facility boundary alone does not
  identify a playing course. Disjoint facility areas can use multipolygons.
- [Multipolygons](https://wiki.openstreetmap.org/wiki/Relation:multipolygon)
  represent multiple exteriors and interior exclusions using outer/inner way
  members, including rings assembled from several ways.
- [Legacy golf relations](https://wiki.openstreetmap.org/wiki/Relation:golf)
  are marked deprecated in favor of sport relations. Course membership is not
  in itself feature-to-hole membership.

These sources establish possible structures, not prevalence, completeness,
accuracy or real-course compatibility. All research inputs below are invented;
no real-course downloads, third-party code or new licensed datasets were used.
Association and release choices below are project recommendations, not OSM rules.

Run `node docs/research/course-geometry.mjs` under Node 24. It imports only the
existing normalizer and uses existing synthetic data plus invented neighboring
objects and local-unit rectangles. This is a baseline research probe, outside
runtime and the test suite; update its baseline assertions if normalization
changes rather than treating today's limitations as permanent requirements.

| Observation at baseline | Reproduced result | Implication |
| --- | --- | --- |
| Existing CTC-006 synthetic fixture | 8 associated features | Numeric refs work in this controlled example. |
| Remove all non-hole refs | 0 associated features | Missing refs hide otherwise usable geometry. |
| Add adjacent facility and duplicate hole 1 | 0 associated features | Global number matching cannot resolve course scope. |
| Omit adjacent route but retain its ref-1 tee | Neighbor's tee associates to original hole | A unique returned number is insufficient course evidence. |
| Reverse element order | Identical normalization | Preserve determinism without selecting a first winner. |
| Relation with two exteriors and one interior | Null geometry; members retained; unsupported warning | Provenance exists, but topology is unrepresented. |
| Remove an interior member's geometry | Null geometry | Partial geometry must never become a filled exterior. |
| 10×10 exterior, 4×4 interior, separate 2×2 part | Occupied area 88 square units, versus exterior-only 100 | Flattening both loses area and invents filled area. |
| Cross-section through that interior | Occupied intervals [0,3], [7,10]; station x=5 outside area | Total occupied length 6 is not a width through the station; exterior-only width 10 is false. |
| Schematic shared rectangular fairway, routes (4,1)–(4,9) and (6,1)–(6,9) | Two positive-length intersections | Proximity or source ordering cannot establish ownership. |

The adjacent-course leak is evidence for #47's scope, not a runtime fix in #46.
The simple arithmetic examples explain topology consequences; they are not a
prototype spatial association or ring-assembly algorithm. The shared-feature schematic asserts full segment
containment in a convex rectangle, not execution of the proposed candidate policy.

## Recommended support matrix

“Source-associated” means a recorded mapping assertion, not verified truth.
“Candidate” and “context” are display-only and must be separate from analytic
inputs. All states preserve original tags, geometry and identities.

| Case | Required first-release behavior after dependent implementation | Explicitly deferred |
| --- | --- | --- |
| Unique numeric feature ref within one resolved course scope | Source-ref association, with source identity and scope basis visible | Parsing names, multi-value refs or leading-zero refs as numbers |
| Missing feature ref | Conservative route-intersection candidates and course context, visibly inferred; no automatic promotion to analytic association | Nearest-hole assignment or numeric confidence |
| Duplicate hole numbers | Keep distinct source-key hole identities; ref alone resolves neither; expose ambiguity and withhold contested features from analytics | Renumbering or choosing the first source |
| Adjacent/disjoint facilities | Scope both holes and features before refs; outside/crossing/overlapping scope is unavailable or ambiguous | Using request bbox or selected facility name as ownership |
| Multiple playing courses inside one facility | Warn that facility selection does not resolve playing-course membership; duplicates remain unresolved | Reading sport/legacy course membership and adding a playing-course selector |
| Shared green, tee or fairway | Multiple route candidates stay shared/context only, one source record; no exclusive owner | Persisted manual assignment or duplication into independent source features |
| Generic water | Separate generic-water context; never reclassify as golf-water or add to existing risk indicator | Inferring golf penalty/rules status from water tags |
| Complete multipolygon area | Preserve multiple exteriors and interiors; support valid bounded topology in #48 | Flattening, convex hulls, snapping or repairing topology |
| Unsupported, partial, touching or invalid relation topology | Preserve raw members; explicit unsupported/invalid/unavailable diagnostics; no partial analytic shape | Nested relations, legacy tag inheritance, boundary/route/sport relation geometry assembly |
| Course boundary absent or unsupported | Raw diagnostics and explicitly unavailable course association; retain existing authored project state | Treating bbox containment as a boundary or inventing one |

## Association precedence and ambiguity

Apply these steps to a derived view, without mutating the normalized raw
source records. Identity is always `type/id`; hole numbers are display/order
metadata. Proposed derived association fields belong to #47's reviewed internal
contract, not the authored project JSON.

1. **Resolve selected facility scope first.** Use its supported, validated area,
   subtracting interiors. A route or feature is spatially in scope only if its
   entire geometry is strictly inside that area and outside every other
   returned facility area. Touching/crossing boundaries, overlapping facilities,
   incomplete boundaries and conflicting source records yield explicit scope
   ambiguity. Do not infer completeness from absence of another facility in a
   bounded response. Label containment as inferred facility scope, not ownership.
   Do not clip or repair source geometry to make it pass.
2. **Membership is typed evidence, never a generic override.** Multipolygon
   outer/inner membership describes area topology, not golf ownership. Known
   course-group membership could resolve course scope in a later approved
   extension; it cannot assign every member feature to every hole. For this
   first release, sport/legacy/custom feature-to-hole relations are retained
   as evidence with an unsupported-membership diagnostic. Do not invent role
   meanings or recursively fetch missing members. This is an explicit deferral,
   not an implemented precedence tier.
3. **Use explicit numeric feature refs only within resolved scope.** Retain the
   existing trimmed strictly positive integer syntax. Exactly one matching
   in-scope hole yields a source-ref association. An explicit ref that is
   invalid, unmatched or duplicated produces a diagnostic and no spatial
   fallback association. A ref conflicting with scope is unresolved. Source-ref
   associations remain mapping assertions with inferred scope disclosed.
4. **Missing refs may yield spatial display candidates.** Use validated geometry
   in the same resolved facility scope. Tee candidates contain the route start;
   green candidates contain the route end; fairway candidates intersect a
   positive-length portion of the route inside their occupied area. A point tee
   must equal the route start; no radius or nearest-neighbor threshold is
   approved. Boundary-only contact is ambiguous, not an interior hit. Compare
   against every in-scope route, retaining all matching source keys in sorted
   order. One candidate is still inferred; several are ambiguous/shared; none
   remains unassociated. No candidate enters tee origins, width or risk inputs.
5. **Display other in-scope layers as course context.** Bunkers, rough, water and
   vegetation without an association may be clipped visually to the existing
   selected-hole viewport. They must not enlarge its projection bounds or be
   relabeled as belonging to that hole. With no route/resolved geometry to
   establish a viewport, show an unavailable state. Keep source geometry intact;
   visual clipping is not a new source polygon. Use distinct accessible text for
   source-ref, inferred candidate, shared/ambiguous and course context.

Warnings must distinguish missing geometry, unsupported topology, unresolved
course scope, invalid/unmatched ref and multiple candidates. No warning may
suggest that an empty result means a hole has no hazards. Stable sorting is
for presentation only and must never break an ambiguity tie. Existing map
measurement/targets can remain usable wherever a valid projection exists.
Manual assignment is deferred: adding it later requires an explicit authored
schema/version, source binding, import/export and undo decision.

## Relation topology and downstream contract

Recommendation: **bounded multipolygons, including interiors, are required for
the first usable release**, through #48. A simple-ring-only release would
exclude documented valid mapping structures; there is no prevalence evidence
supporting a broader claim. Unsupported cases remain honest partial coverage,
not a guarantee of compatibility with every course.

The logical area representation is a list of parts, each containing one closed
exterior ring and zero or more closed interior rings. Retain point/line forms;
a legacy polygon maps to one part with no interiors. Coordinates remain WGS84
`{lat, lon}`. Never flatten parts or rings into a single coordinate path. The
relation source key identifies the feature; retain member keys, roles, original
ordering and raw supplied geometry as provenance. Derived canonical order may
change without rewriting that evidence. Concrete TypeScript changes are #48.

Support `type=multipolygon` with area classification tags on the relation,
way members with explicit outer/inner roles, and complete supplied coordinates.
Allow closed ways and uniquely stitchable open way fragments. Join by shared
endpoint node IDs where supplied (coordinates must agree), otherwise by exact
coordinate equality inside this relation; no proximity snapping. Require a
unique cycle decomposition, closed nonzero-area simple rings, disjoint
exteriors, each interior strictly inside exactly one exterior, and no touching,
crossing, overlapping or nested interior rings. Unsupported roles, absent
geometry, conflicting endpoint identities, branching, nesting and malformed
rings make the entire relation unavailable. Independently tagged member ways
must retain provenance; do not render a member as a duplicate filled area of its
parent or suppress a genuinely distinct feature without explicit diagnostics.

Bound processing before topology work: at most 1,000 members, 10,000 supplied
coordinate positions and 256 assembled rings per relation. Exceeding any cap
makes that relation unavailable with a limit diagnostic. These are proposed
application limits, not OSM limits; test exact boundaries and avoid exponential
cycle search. No additional network request is authorized to complete topology.
Near-pole, antimeridian-crossing or otherwise unsupported projection cases
remain unavailable. Do not reuse these numeric caps as permission for unbounded
whole-response work.

| Consumer | Required contract when #47/#48 change it |
| --- | --- |
| `normalize.ts`, `App.tsx` | Pass selected identity into the derived course view; preserve raw multi-course response. Separate associated features from candidates/context and expose scope/topology diagnostics. |
| `map.ts`, `HoleMap.tsx` | Enumerate coordinates for bounds without joining rings. Draw compound SVG paths with even-odd fill and per-ring strokes; course context cannot affect analytic input or fit. |
| `fairwayWidth.ts` | Intersect each part's exterior minus its interiors, union occupied intervals, then select the interval containing the route station. Station in an interior returns unavailable; do not span gaps or sum disjoint widths. Candidate-only fairways remain unavailable. |
| `carry.ts`, `dispersion.ts` | Resolve only source-associated tees. Keep existing simple-polygon first-vertex behavior in #47; do not silently choose the first member/ring of a relation tee. Relation tees render but have unavailable analytic origins until #53 approves an origin policy; target origins remain usable. |
| `riskScore.ts` | Use only associated golf-water occupied areas, subtract interiors, union parts to avoid double counting; preserve 512-sample and boundary-tolerance disclosures. Display candidates/generic water cannot silently change the score. If an associated golf-water area is unsupported or invalid, mark comparison unavailable instead of presenting a deceptively complete score. |
| `project.ts` | Preserve v2 course/hole source keys and authored coordinates. No geometry or assignment persistence added. Scoping may make prior imported hole keys unavailable: retain existing project mismatch validation and dirty replacement safeguards; never silently drop existing authored state. |
| `ctc008Scene.ts`, `ctc014Scene.ts`, future #50 | Current experiments remain fixed synthetic evidence. Future scene input must carry parts/interiors, association basis, unavailable states and provenance. Renderer must preserve holes or reject unsupported output; never silently fill them. #49 still owns production PDF approval. |
| `gisSourceExport.ts`, `overpassCache.ts` | Preserve exact raw source response/query/metadata, including member evidence. Derived associations do not rewrite cached source or enter the raw GIS envelope. |

This is a proposed normalized/scene contract extension, not a project-file
migration. Every affected consumer must change together before relation shapes
are enabled; rendering support alone does not authorize analytic support.

## Dependent acceptance criteria and execution

On adoption and merge of #46, reconcile these additions into the existing issues
without erasing their problem statements, evidence or verification requirements.
This issue authorizes no implementation of them.

- **#47, then reassess Ready:** implement the five association steps for existing
  point/line/simple-ring geometry only. Show missing-ref candidates/context in a
  browser case without promoting them into calculation inputs. Test the research
  neighbor leak, duplicate numbers, shared features, scope/ref conflicts, missing
  boundary, invalid versus absent refs and deterministic source-key ordering.
  Keep unsupported relations explicit until #48; preserve project matching and
  dirty-state safeguards. Membership and manual assignment stay deferred.
- **#48, require #47 first:** implement the bounded multipolygon contract and all
  consumer changes above. Cover one/multiple exteriors, an interior, uniquely
  stitched/reversed fragments, member-order invariance, missing/conflicting
  members, ambiguous joins, touching/crossing rings, exact resource caps and
  duplicate member rendering. Verify visual holes, width through an interior,
  risk samples in interiors, unsupported golf-water unavailable behavior,
  relation tee-origin unavailability, and raw evidence/project round trips.
  It is required for release, while unsupported relation families stay deferred.
- **#50:** retain #49/#38/#46 dependencies and add #47/#48 before full geometry
  scene acceptance. Carry candidate/context labels and area topology into scene
  assertions, retain unavailable states, and verify no source/authored mixing.
  No PDF dependency or UI adoption follows from this geometry decision.
- **#52:** release evidence must explicitly identify the supported subset,
  deferred multi-course membership/manual assignment, incomplete geometry and
  real-course prevalence uncertainty. Do not describe synthetic success as
  production course coverage. Existing release requirements remain unchanged.

Verification for implementations remains focused geometry/browser regressions,
`npm run check`, `npm run compliance`, whitespace checks and fresh-context Codex
public-contract/safety review. This research document itself needs its probe,
link checks and a fresh-context architecture/schema review. Record adoption or
an explicit maintainer deferral in #46 before closing it; never infer that
approval from a passing test or reviewer recommendation.

Non-goals: runtime work here, map providers, basemaps, live research requests,
real-course fixtures, generic GIS frameworks, nearest-hole coaching, topology
repair, persisted manual assignment, tee-origin redesign, PDF adoption or release
publication. Revisit deferred membership or assignment only in a separately
scoped decision, with new acquisition/project contracts reviewed as necessary.
