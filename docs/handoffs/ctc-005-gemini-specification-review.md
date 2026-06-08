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
