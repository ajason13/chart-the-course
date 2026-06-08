# CTC-005: Specify deterministic OSM golf geometry normalization

## Replace the current Deep Research plan

Discard any current or previously generated research plan. Do not continue,
adapt, or summarize a plan about open-source ecosystem trends, local-first
architecture, AI-agent integrations, privacy-first sync, product roadmaps,
epics, user stories, task decomposition, or Notion templates.

Use exactly this replacement research plan:

1. Research current primary OpenStreetMap documentation for the CTC-005 tags
   listed below and record only semantics needed to classify course boundaries,
   holes, tees, greens, fairways, bunkers, water, vegetation, and rough.
2. Research current primary Overpass documentation for JSON `out body geom`
   node, way, relation, and relation-member shapes, including partial or missing
   geometry. Determine which forms can be normalized without network lookups or
   multipolygon assembly.
3. Using the supplied repository contracts, specify the exact normalized
   TypeScript course, hole, feature, geometry, source-reference, and warning
   model.
4. Specify deterministic algorithms for classification, course selection, hole
   identification and ordering, feature-to-hole association, duplicate and
   conflict handling, malformed/incomplete inputs, and warning ordering.
5. Specify complete and incomplete synthetic Overpass fixtures plus Vitest
   assertions that prove the CTC-005 acceptance criteria.
6. Produce the required CTC-005 technical specification format below, clearly
   separating sourced OSM/Overpass facts from project design recommendations
   and explicitly deferring unsupported relation or multipolygon assumptions.

Do not propose an alternative plan. Do not ask what changes should be made to
another plan. Begin the research using this replacement plan and return only the
CTC-005 specification requested below.

## Research target

Research and specify only the technical decisions required to implement CTC-005:
convert the validated raw Overpass response described below into a deterministic
TypeScript course/hole/feature model.

Your response must directly resolve the listed CTC-005 planning questions using
the supplied repository contracts and, only where necessary, current primary
OpenStreetMap or Overpass documentation. Produce an implementation-ready
technical specification for critical review. Do not write full implementation
code.

This is not a request to research product management, AI development
methodologies, agent workflows, or documentation tools.

## Mandatory research focus

Research only these topics when external research is needed:

- Current OpenStreetMap semantics and common geometry forms for
  `leisure=golf_course`, `golf=hole`, `golf=tee`, `golf=green`,
  `golf=fairway`, `golf=bunker`, `golf=water_hazard`,
  `golf=lateral_water_hazard`, `golf=rough`, relevant generic water tags, and
  relevant vegetation tags.
- Overpass JSON `out body geom` response shapes for nodes, ways, relations,
  relation members, and missing or partial geometry.
- Deterministic normalization rules that can operate only on the supplied raw
  response without network lookups, rendering, or computational spatial
  inference.
- Data-quality warning design for incomplete, malformed, duplicate, or
  ambiguous OSM golf data.
- A synthetic complete/incomplete fixture and Vitest unit-test matrix for the
  proposed normalization contract.

Every researched fact or recommendation must state which numbered CTC-005
planning question it resolves. Prefer a conservative unsupported/deferred
decision when primary documentation or the supplied raw response cannot justify
an assumption.

## Prohibited research and output

Do not research, discuss, or produce recommendations about:

- vibe coding, conversational goal translation, or generic AI coding-agent
  task design;
- product-management workflows, Principal Product Manager frameworks,
  architectural-risk frameworks, roadmaps, epics, or task boards;
- Notion templates, Markdown schemas, documentation layouts, or governance
  workflow design;
- generic open-source compliance, security, or licensing programs;
- Claude, Codex, Gemini, or multi-agent orchestration practices;
- unrelated Chart the Course tasks or any feature outside the binding CTC-005
  scope below.

Do not broaden scope. Do not propose new dependencies unless a specific CTC-005
requirement cannot be met with TypeScript and existing project tooling, and
clearly mark that as requiring maintainer approval.

## Completion test

The response is acceptable only if it:

1. Defines the normalized TypeScript model and pure normalization boundary.
2. Resolves supported and rejected node/way/relation geometry forms.
3. Defines deterministic classification, hole identification/order,
   association, duplicate/conflict, and warning rules.
4. Defines exact expected behavior for complete and incomplete synthetic
   fixtures.
5. Keeps rendering, networking, caching, provider policy, product-management
   process, and generic AI-agent guidance out of the response.

## Current project and gate state

- Repository: Chart the Course, Apache-2.0 browser app using React, TypeScript, Vite, Vitest, and Playwright.
- Current branch/state: clean synchronized main at commit 918f80101ef1d6bd3ba3b91dfe1980717cff2182. Do not propose creating a feature branch before specification and QA-planning gates complete.
- CTC-015 is Done and defines the reviewed bounded Overpass query/raw-source contract.
- CTC-004 is Done. PR #2 merged as 50638ee and supplies a validated minimum raw Overpass response shape, exact raw response text, and source metadata. It intentionally displays raw entities and does not normalize geometry.
- CTC-005 is now 1. Spec Drafting (Gemini). No runtime implementation may begin until this response is critically reviewed and Claude adversarial QA planning is completed and critically reviewed.
- CTC-006 rendering and measurement depends on normalized geometry and remains downstream.
- CTC-019 durable cache/request identity policy is independent downstream work and is not a prerequisite for pure normalization.

## Acceptance criteria

- Parse tees, greens, fairways, bunkers, water, trees/rough when available, and hole metadata.
- Preserve original OSM IDs for attribution/debugging.
- Emit data-quality warnings for missing tees, greens, or ambiguous hole ordering.
- Unit tests cover complete and incomplete fixtures.

## Binding scope boundaries

CTC-005 owns pure deterministic normalization from already validated raw Overpass entities into an app model. Preserve original entity type, ID, original tags, query/source metadata, and raw geometry references needed for attribution/debugging. Define deterministic handling for incomplete and ambiguous OSM data.

Do not add or specify rendering, measurement controls, basemap tiles, PDF behavior, geocoding, durable cache, refresh controls, retries/backoff, endpoint failover, new providers, network behavior changes, or user data flows. Do not add dependencies without an explicit reviewed decision. Prefer no new dependency. Do not copy or adapt code/query/UI structures from prohibited or unlicensed reference projects.

Relation geometry and multipolygon assembly are not silently assumed. Decide whether any relation geometry form can be normalized directly from the existing out body geom response, or explicitly reject/defer relation and multipolygon assembly with deterministic warnings. CTC-005 must not invent missing member geometry or perform network lookups.

## Existing raw input contract and ownership boundary

- validateResponse currently guarantees only that the response is an object with an elements array and each element has type node, way, or relation plus an integer ID. All other fields remain unknown and must be safely inspected by the normalizer.
- The detail query uses out body geom and may return nodes with lat/lon, ways with nodes and geometry, and relations with members whose geometry availability/shape may vary. Specify exactly which forms CTC-005 supports and how unsupported/malformed forms are warned about or skipped.
- SourceMetadata currently contains query, endpoint, completedAt, bbox, and copyrightUrl. CTC-005 must preserve this source record but must not implement durable storage or request policy.
- The current synthetic Overpass fixture is deliberately invented and non-real. Real-course fixtures require governance review and should not be proposed for this task.
- Existing src/course.ts is a scaffold-only local-normalized placeholder model. State whether it should remain separate, be replaced, or be extended, while preventing accidental mixing of local placeholder coordinates with WGS84 OSM geometry.
- CTC-004 App.tsx is included to show the integration boundary. CTC-005 should primarily specify a pure module plus unit tests/fixtures; avoid requiring UI expansion unless essential to acceptance criteria.

## Planning questions you must resolve

1. Define the normalized course, hole, feature, geometry, source-reference, and warning TypeScript model with clear ownership boundaries and discriminated unions where useful.
2. Define supported raw Overpass geometry forms for nodes, ways, and relations. State coordinate order and validation rules. Reject unsupported assumptions.
3. Define deterministic course selection/boundary handling when zero, one, or multiple leisure=golf_course entities exist in a detail response.
4. Define deterministic hole identification and ordering rules using tags such as ref, name, par, and usable relation membership only if explicitly supported. Explain numeric parsing, malformed values, duplicate numbers, gaps, non-numeric refs, and ambiguous order.
5. Define how features associate with holes, including features with matching ref, missing ref, conflicting ref, or ambiguous spatial context. Do not silently add computational geometry or nearest-feature inference unless explicitly justified inside scope.
6. Define duplicate and conflicting entity handling using stable entity keys of original type plus ID. Explain exact duplicate records versus conflicting duplicates.
7. Define classification precedence for golf-specific features, generic water/waterways, vegetation, and rough. Preserve distinctions rather than erasing original meaning.
8. Define warning taxonomy, stable machine-readable codes, severity, affected source references, and deterministic ordering. At minimum cover missing tees, missing greens, and ambiguous hole ordering.
9. Define behavior for missing/malformed geometry, malformed tags, empty responses, missing course boundary, orphan features, nodes versus lines versus closed rings, and relation/multipolygon cases.
10. Define preservation of OSM entity type/ID, original tags, raw geometry references, source metadata, and OSM attribution obligations without duplicating the exact raw response or creating durable cache policy inside the normalized model unless justified.
11. Define a complete and incomplete synthetic fixture/test matrix. Include precise expected warnings and deterministic output assertions. State whether to extend the existing complete fixture and add a separate incomplete fixture.
12. Identify observability/debugging needs for this pure transformation boundary. Prefer deterministic returned diagnostics over logging side effects.
13. Identify security, performance, and denial-of-service considerations for normalization of already bounded but potentially large raw element arrays, without inventing an arbitrary threshold lacking contract basis.
14. State exact files likely to be added or changed, while keeping runtime integration minimal and adding no dependency unless separately approved.

## Required response format

Return a self-contained specification with these sections:

1. Verdict on scope/readiness and any blocking unresolved decisions.
2. Accepted assumptions and explicitly rejected/deferred assumptions.
3. Proposed normalized TypeScript data model, including representative type declarations or pseudocode but no full implementation.
4. Deterministic normalization algorithm in ordered steps.
5. Geometry support matrix for node, way, and relation forms.
6. Classification and hole-association tables.
7. Warning taxonomy with code, severity, trigger, and affected entity/hole references.
8. Duplicate/conflict and deterministic ordering rules.
9. Complete/incomplete synthetic fixture and unit-test matrix with expected outputs/warnings.
10. File/change plan, dependency decision, observability decision, and non-goals.
11. Adversarial QA red lines for the later Claude planning handoff.
12. Open maintainer decisions, if any, stated as narrow questions with a recommended default.

Cite primary OpenStreetMap/Overpass documentation only when a decision truly depends on current external tagging or response semantics. Clearly distinguish sourced facts from design recommendations. Avoid unsupported quantitative claims.

## Exact relevant repository file contents

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

### src/App.tsx

`````typescript
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
