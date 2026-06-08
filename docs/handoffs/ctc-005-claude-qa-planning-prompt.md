# CTC-005 Claude adversarial QA-planning handoff

## Role and gate

Act as the adversarial QA planner for CTC-005, Normalize OSM golf geometry into app model. Critically challenge the corrected Gemini specification baseline before implementation. Claude Chat has no filesystem or GitHub access; this bundle is self-contained.

CTC-005 is not yet approved for implementation. Return an implementation-readiness verdict and required specification corrections. Do not write implementation code, create new epics, or broaden scope.

## Task acceptance criteria

- Parse tees, greens, fairways, bunkers, water, trees/rough when available, and hole metadata.
- Preserve original OSM IDs for attribution/debugging.
- Emit data-quality warnings for missing tees, greens, or ambiguous hole ordering.
- Unit tests cover complete and incomplete fixtures.

## Binding boundaries

CTC-005 owns only pure deterministic normalization from already validated raw Overpass entities into an app model. It must preserve original entity type/ID/tags/source metadata/raw geometry evidence and define deterministic incomplete/ambiguous handling.

No rendering, measurement, basemap, PDF behavior, geocoding, durable cache, refresh controls, retries/backoff, failover, providers, network changes, user data flows, new dependencies, computational spatial inference, geometry healing, relation/multipolygon assembly, or prohibited reference-project reuse.

CTC-019 owns durable cache/request policy. CTC-006 owns rendering and measurement. No feature branch or runtime implementation begins until this QA plan is critically reviewed.

## Gemini response disposition

Gemini produced relevant observations but also proposed prohibited or unsupported behavior including Turf.js/MapLibre, convex hulls, auto-closing polygons, multipolygon degradation, spatial containment/proximity association, a 150-meter threshold, area-based selection, loose ref coercion, merged source holes, rendering z-indexes, real-course fixtures, and PDF concerns. The exact authoritative disposition and corrected baseline is the first embedded file below.

## Required review questions

1. Is the corrected model boundary implementable and sufficiently precise without a dependency?
2. Which node/way/relation geometry forms must be accepted, rejected, or warned about without fabricating source geometry?
3. Are strict ref/par/tag/coordinate rules correct and complete?
4. Are course selection, hole ordering, feature association, duplicate/conflict handling, and warning ordering deterministic under arbitrary input order?
5. Does the fixture/test baseline cover all acceptance criteria and adversarial failure modes?
6. Resolve the five remaining questions in the corrected Gemini review.
7. Identify any proposal that still leaks CTC-006, CTC-019, rendering, storage, network, PDF, or provider scope.
8. Identify security, performance, attribution/debugging, and no-input-mutation red lines for implementation.

## Required verdict format

Return these sections:

1. **Verdict:** exactly one of `READY`, `READY WITH REQUIRED SPEC CORRECTIONS`, or `NOT READY`.
2. **Blocking findings:** numbered, with concrete failure scenario and required correction.
3. **Accepted baseline decisions.**
4. **Required corrected decisions:** exact deterministic rule text suitable for implementation.
5. **Adversarial test matrix:** input condition, expected normalized behavior, expected warning code/order, and source-evidence assertion.
6. **Rejected/deferred recommendations.**
7. **Implementation gate:** explicitly state whether CTC-005 may move to `3. In Development (ChatGPT)` after the listed corrections are recorded.

Treat fabricated/healed geometry, spatial heuristics, nondeterminism, destructive source loss, loose coercion, missing required warnings, side effects, new dependencies, and real-course fixtures as blockers.

## Exact relevant repository file contents

### docs/handoffs/ctc-005-gemini-specification-review.md

`````markdown
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
classification tags. Define deterministic precedence for multi-tagged entities
without erasing source tags. Unknown/non-relevant entities may be ignored
without warning unless they conflict with a consumed relevant tag.

### Course and hole rules

- A stable source key is `${type}/${id}`.
- Do not deduplicate entities solely by numeric ID because IDs are scoped by
  OSM entity type.
- Exact repeated records with the same source key may collapse only if deeply
  equivalent under an explicitly deterministic comparison. Conflicting records
  with the same source key must not be silently merged; choose a documented
  stable winner and warn while preserving conflict refs.
- Recognize a hole number only from a trimmed strict positive base-10 integer
  `ref`. Do not strip characters or infer from `name`.
- Sort unambiguous numbered holes numerically, with stable source-key tie
  ordering. Preserve non-numeric/unidentified holes after numbered holes in
  source-key order.
- Duplicate numeric refs, missing/gapped refs, and unidentified/non-numeric refs
  make hole ordering ambiguous and must emit stable warnings. Distinct source
  hole entities remain distinct.
- Parse optional `par` only as a strict valid positive integer; malformed values
  remain preserved in original tags and generate a warning rather than being
  coerced.

### Feature-to-hole association

- Associate only when a feature has a strict numeric `ref` matching exactly one
  unambiguous numbered hole.
- A feature ref matching zero or multiple holes remains unassociated and emits
  an appropriate warning.
- Features without a usable ref remain unassociated without spatial inference.
  Claude should decide whether every such feature warrants a warning or whether
  warnings should be limited to required completeness and explicit conflicts.
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

Warnings must include severity, stable code, affected source refs and/or hole
identity, and deterministic ordering. Recommended sort key: `code`, then hole
number/identity, then source key. Severity-first ordering is not required unless
Claude identifies a consumer need.

### Course candidate handling

Do not compute area or spatial containment. Preserve all
`leisure=golf_course` candidates. Recommended deterministic primary metadata
candidate:

1. valid closed-way boundary candidates before unsupported relation candidates
   and other candidates;
2. stable source-key order as the tie-breaker;
3. warn when zero or multiple candidates exist.

Claude must challenge whether selecting a primary candidate is justified or
whether the normalized result should expose candidates without a primary.

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

## Remaining questions for Claude

1. Should missing/gapped numeric refs alone trigger ambiguous-order warnings, or
   only duplicate/unidentified refs?
2. Should unreferenced non-required features produce warnings, or remain
   silently unassociated to limit diagnostic noise?
3. Should the result expose a deterministic primary course candidate, or only
   preserve all candidates and require downstream explicit selection?
4. What exact warning severity and deterministic sort contract best supports
   downstream consumers without overfitting CTC-005?
5. Is strict deep-equivalence deduplication worth the complexity, or should all
   repeated source keys be treated as conflicts and warned?
`````

### docs/overpass-query-contract.md

`````markdown
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

### src/overpass.ts

`````typescript
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

### src/overpass.test.ts

`````typescript
import {
  buildDetailQuery,
  buildDiscoveryQuery,
  classifyHttpStatus,
  detailCacheKey,
  discoveryCacheKey,
  encodeCourseName,
  parseBbox,
  parseCandidateBounds,
  readCache,
  serializeBbox,
  sourceMetadata,
  validateResponse,
  validateTrustedIdentity,
  writeCache,
  type Bbox,
} from "./overpass";

const bbox: Bbox = { south: 37.3, west: -122.1, north: 37.5, east: -121.9 };

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  length = 0;
  clear() { this.values.clear(); this.length = 0; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); this.length = this.values.size; }
  setItem(key: string, value: string) { this.values.set(key, value); this.length = this.values.size; }
}

describe("Overpass query construction", () => {
  it("builds the exact reviewed discovery query", () => {
    expect(buildDiscoveryQuery(bbox, "Pine.* Hills")).toMatchInlineSnapshot(`
      "/* chart-the-course/0.0.0 contact:https://github.com/ajason13/chart-the-course purpose:golf-course-discovery */
      [out:json][timeout:25][maxsize:536870912];
      (
        nwr["leisure"="golf_course"]["name"~"Pine\\.\\* Hills",i](37.3,-122.1,37.5,-121.9);
        nwr["leisure"="golf_course"](37.3,-122.1,37.5,-121.9);
      );
      out tags center bb;"
    `);
    expect(buildDiscoveryQuery(bbox, "   ")).not.toContain('["name"~');
  });

  it("builds the exact reviewed detail query", () => {
    expect(buildDetailQuery(bbox)).toMatchInlineSnapshot(`
      "/* chart-the-course/0.0.0 contact:https://github.com/ajason13/chart-the-course purpose:golf-course-detail */
      [out:json][timeout:45][maxsize:536870912];
      (
        nwr["leisure"="golf_course"](37.3,-122.1,37.5,-121.9);
        nwr["golf"~"^(hole|fairway|green|bunker|tee|water_hazard|lateral_water_hazard|rough|out_of_bounds|pin|cartpath)$"](37.3,-122.1,37.5,-121.9);
        nwr["natural"~"^(water|wood|tree|tree_row|scrub)$"](37.3,-122.1,37.5,-121.9);
        nwr["landuse"~"^(forest|reservoir|basin)$"](37.3,-122.1,37.5,-121.9);
        nwr["water"~"^(pond|lake|basin|reservoir)$"](37.3,-122.1,37.5,-121.9);
        nwr["waterway"](37.3,-122.1,37.5,-121.9);
      );
      out body geom;"
    `);
  });

  it("encodes names in one pass and constrains identity constants", () => {
    expect(encodeCourseName('  "a\\.*+?()[]{}|^$*/é"  ')).toBe('\\"a\\\\\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\^\\$\\*/é\\"');
    expect(encodeCourseName("*/ remains text")).toBe("\\*/ remains text");
    expect(() => encodeCourseName("bad\nquery")).toThrow(/control/);
    expect(() => encodeCourseName("x".repeat(201))).toThrow(/200/);
    expect([...encodeCourseName("é".repeat(200))]).toHaveLength(200);
    expect(validateTrustedIdentity("0.0.0")).toBe("0.0.0");
    expect(() => validateTrustedIdentity("bad*/comment")).toThrow();
    expect(() => validateTrustedIdentity("bad\ncomment")).toThrow();
  });
});

describe("bbox validation", () => {
  it("accepts canonical bounded decimal input and normalizes negative zero", () => {
    const result = parseBbox({ south: "-0", west: "-0.0000000", north: "0.35", east: "0.3500000" });
    expect(result).toEqual({
      ok: true,
      bbox: { south: -0, west: -0, north: 0.35, east: 0.35 },
      serialized: "0,0,0.35,0.35",
    });
    expect(serializeBbox(bbox)).toBe("37.3,-122.1,37.5,-121.9");
  });

  it.each(["1e-2", "1,2", "Infinity", "NaN", "1.12345678"])("rejects invalid syntax %s", (south) => {
    expect(parseBbox({ south, west: "0", north: "1", east: "1" }).ok).toBe(false);
  });

  it("handles span, polar, ordering, and dateline edges", () => {
    expect(parseBbox({ south: "89.65", west: "10", north: "90", east: "10.35" }).ok).toBe(true);
    expect(parseBbox({ south: "37.0", west: "-122.1", north: "37.35", east: "-121.75" }).ok).toBe(true);
    expect(parseBbox({ south: "0", west: "0", north: "0.3500001", east: "0.35" }).ok).toBe(false);
    expect(parseBbox({ south: "1", west: "0", north: "0", east: "0.1" }).ok).toBe(false);
    expect(parseBbox({ south: "0", west: "179.9", north: "0.1", east: "-179.9" }).ok).toBe(false);
    expect(parseCandidateBounds({ minlat: 37.3, minlon: -122.1, maxlat: 37.5, maxlon: -121.9 })).toEqual(bbox);
    expect(parseCandidateBounds({ minlat: 37.3 })).toBeNull();
  });
});

describe("response, cache, and HTTP classification", () => {
  const rawResponse = '{"elements":[{"type":"way","id":42,"tags":{"name":"Test"}}]}';

  it("validates only the minimum raw entity shape and classifies empty results", () => {
    expect(validateResponse({ elements: [] })).toEqual({ elements: [] });
    expect(validateResponse(JSON.parse(rawResponse))?.elements).toHaveLength(1);
    expect(validateResponse({ elements: [{ type: "area", id: 1 }] })).toBeNull();
    expect(validateResponse({ elements: [{ type: "node", id: 1.5 }] })).toBeNull();
    expect(validateResponse({ nope: [] })).toBeNull();
  });

  it("generates deterministic distinct cache keys", () => {
    expect(discoveryCacheKey(bbox, " Pine.* ")).toBe("ctc:overpass:v1:discovery:37.3,-122.1,37.5,-121.9:pine\\.\\*");
    expect(detailCacheKey(bbox)).toBe("ctc:overpass:v1:detail:37.3,-122.1,37.5,-121.9");
  });

  it("round-trips exact raw text and reports corrupt or failed storage without eviction", () => {
    const storage = new MemoryStorage();
    const cached = { rawResponse, source: sourceMetadata("query", bbox) };
    expect(writeCache(storage, "key", cached)).toBeNull();
    expect(readCache(storage, "key")).toMatchObject({ kind: "hit", cached: { rawResponse } });
    storage.setItem("corrupt", "{");
    expect(readCache(storage, "corrupt").kind).toBe("warning");
    expect(storage.getItem("corrupt")).toBe("{");

    const failed = new MemoryStorage();
    failed.setItem = () => { throw new Error("quota"); };
    expect(writeCache(failed, "key", cached)).toMatch(/could not/);
    failed.getItem = () => { throw new Error("unavailable"); };
    expect(readCache(failed, "key").kind).toBe("warning");
  });

  it("classifies HTTP status without retry policy", () => {
    expect(classifyHttpStatus(429)).toBe("rate-limit");
    expect(classifyHttpStatus(504)).toBe("timeout");
    expect(classifyHttpStatus(500)).toBe("http");
  });
});
`````

### fixtures/overpass/synthetic-golf-course.json

`````json
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

### src/course.ts

`````typescript
export type Coordinate = readonly number[];

export interface SampleCourse {
  name: string;
  synthetic: boolean;
  coordinateSystem: string;
  source: string;
  notice: string;
  center: Coordinate;
  holes: Array<{
    number: number;
    par: number;
    tee: Coordinate;
    green: Coordinate;
  }>;
}

export function summarizeCourse(sample: SampleCourse): string {
  const holeCount = sample.holes.length;
  const par = sample.holes.reduce((total, hole) => total + hole.par, 0);
  return `${holeCount} placeholder holes / par ${par}`;
}

export function isSyntheticCourse(sample: SampleCourse): boolean {
  const coordinates = [
    sample.center,
    ...sample.holes.flatMap((hole) => [hole.tee, hole.green])
  ];

  return (
    sample.synthetic === true &&
    sample.coordinateSystem === "local-normalized" &&
    coordinates.every(
      (coordinate) =>
        coordinate.length === 2 &&
        coordinate.every(
          (value) =>
            typeof value === "number" &&
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 100
        )
    )
  );
}
`````

### src/main.test.ts

`````typescript
import sampleCourse from "../fixtures/courses/sample-course.json";
import { isSyntheticCourse, summarizeCourse } from "./course";

describe("sample course scaffold", () => {
  it("summarizes the placeholder fixture deterministically", () => {
    expect(summarizeCourse(sampleCourse)).toBe("3 placeholder holes / par 12");
  });

  it("uses explicitly synthetic non-geographic coordinates", () => {
    expect(isSyntheticCourse(sampleCourse)).toBe(true);
  });

  it("rejects fixture coordinates outside the local normalized space", () => {
    const invalidCourse = structuredClone(sampleCourse);
    invalidCourse.center = [-122.08, 37.42];

    expect(isSyntheticCourse(invalidCourse)).toBe(false);
  });
});
`````

### package.json

`````json
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

### tsconfig.json

`````json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vitest/globals"],
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src", "test", "vite.config.ts", "playwright.config.ts"]
}
`````

### vite.config.ts

`````typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: false
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"]
  }
});
`````
