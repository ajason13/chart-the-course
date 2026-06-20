# Overpass Query Contract

Status: Implemented as a bounded CTC-004 browser spike on 2026-06-06 and
durable-cache/request-policy hardened by CTC-019 on 2026-06-19.

This contract defines the Chart the Course Overpass API request shape for
course discovery and course-detail loading. CTC-004 implemented the bounded
browser spike; CTC-019 adds durable browser caching, explicit refresh, and
bounded retry behavior without adding source-export or PDF behavior.

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
- Cache successful public Overpass responses locally in IndexedDB where
  available. Non-durable memory fallback is allowed only as graceful
  degradation when IndexedDB is unavailable, blocked, or fails.
- CTC-004 cache keys are
  `ctc:overpass:v1:discovery:{bbox}:{encoded-lowercase-name}` and
  `ctc:overpass:v1:detail:{bbox}`.
- Never query on keystrokes; require an explicit search action.
- On HTTP `429`, parse `Retry-After` delta-seconds or HTTP-date values when the
  browser exposes the header. Wait only up to 60 seconds; a longer value is a
  terminal visible rate-limit state for that user action. Missing, malformed,
  or unexposed `Retry-After` falls back to deterministic capped backoff.
- Bounded backoff uses deterministic timing capped after jitter at 30 seconds
  and at most three retries after the initial request.
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

CTC-019 stores successful discovery and detail responses in browser IndexedDB
when available. The database name is `ChartTheCourse`, schema version is `1`,
the object store is `courseGeometry`, and the inline key path is `key`.
Records preserve exact raw Overpass response text as `rawResponse` and keep
source metadata separate from normalized geometry and user-authored project
state.

Durable records include:

- `schemaVersion: 1`.
- `key`: existing discovery/detail cache key.
- `mode`: `discovery` or `detail`.
- `storedAt` and `expiresAt`, where `expiresAt = storedAt + 604800000`.
- `rawResponse`: exact response text.
- `source.query`, `source.endpoint`, `source.completedAt`, `source.bbox`, and
  `source.copyrightUrl`.
- `license: "ODbL-1.0"` as an internal provenance marker only.
- `sizeBytes`: UTF-8 byte length of the normalized serialized record with
  `sizeBytes: 0`.

Fresh cache hits validate every required field, exact query, endpoint, bbox,
copyright URL, TTL, response shape, size, and ODbL marker. Invalid,
incompatible, corrupt, oversized, or expired entries are not fresh hits.
Deletion is best-effort and deletion failure still returns a miss. Entries over
1 MiB are not written durably.

Expired OSM data is never rendered automatically. If a live refresh fails and
stale data exists, the user must make an explicit visible choice before stale
data is rendered. `navigator.onLine` may inform copy only and must not bypass
consent.

The durable cache is internal provenance only. It does not implement CTC-020
raw GIS source export, exported file schemas, download UI, or CTC-008 PDF
behavior.

CTC-020 Phase 1 exports loaded detail-mode source evidence through a browser
download action. Discovery-mode export is out of scope. The app tracks explicit
active source evidence for detail results instead of re-reading private cache
internals at download time. Active source evidence contains:

- detail cache key;
- exact `rawResponse` text;
- exact `source.query`, `source.endpoint`, `source.completedAt`,
  `source.bbox`, and `source.copyrightUrl`;
- consent state: `fresh` or `stale-consented`.

The export envelope is versioned JSON with MIME type
`application/json;charset=utf-8`, filename pattern
`ctc-gis-source-YYYYMMDDTHHmmssZ.json`, 2-space formatting, deterministic root
field ordering, and a 1,048,576 byte cap measured against the final
pretty-printed UTF-8 file. This cap includes envelope metadata, summary fields,
and exact raw response text; a rendered cache record near the durable-cache
ceiling may therefore be too large to export and must produce a visible error.

Exported root fields are:

- `bbox`;
- `completedAt`;
- `consentState`;
- `copyrightUrl`;
- `endpoint`;
- `exportVersion`;
- `exportedAt`;
- `isStaleSource`;
- `license`;
- `osmElementsSummary`;
- `query`;
- `rawResponse`;
- `sourceAgeDays` for stale-consented exports only.

`osmElementsSummary` contains deterministic primitive entries sorted by type
order `node`, `relation`, `way` and numeric ID:

```json
{
  "type": "way",
  "id": 123,
  "tagKeys": ["golf", "ref"]
}
```

The summary excludes tag values, geometry, nodes, members, bounds, center, and
all other raw element fields. Exact source evidence remains in `rawResponse`.
Valid empty Overpass responses are exportable with `osmElementsSummary: []`.
Stale source is exportable only when the currently visible detail result was
rendered through explicit stale-data consent.

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
