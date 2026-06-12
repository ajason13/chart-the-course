# CTC-007 Gemini specification critical review

Date: 2026-06-11

## Review verdict

Gemini's response is relevant but not implementation-ready. It correctly keeps
the feature browser-local, proposes explicit interaction modes, recognizes the
need for strict import validation and visible accessibility feedback, and keeps
automated tests network-isolated.

However, it contradicts the embedded CTC-005/006 contracts, invents unsafe and
malformed data structures, exports and later trusts raw OSM data, and adds
multiple deferred features. CTC-007 remains in `1. Spec Drafting (Gemini)`.
No part of the response authorizes implementation or Claude QA planning.

## Accepted decisions

- Keep project editing and explicit JSON file exchange browser-local with no
  network upload, account, server, or cloud-sync behavior.
- Use explicit interaction modes so target placement/editing does not silently
  activate CTC-006 measurement.
- Preserve the current project when an import fails.
- Validate file size before parsing and return visible, useful import errors.
- Use browser `Blob`, object URL, download anchor, and object URL revocation
  for explicit export, subject to deterministic lifecycle tests.
- Provide keyboard-operable controls, minimum 44 CSS-pixel control targets,
  visible focus, live announcements, non-color distinctions, mobile coverage,
  axe checks, and network-isolated Playwright tests.
- Keep pure state/schema/geometry logic separate from React UI state.

## Rejected or corrected decisions

- Reject Canvas, offscreen Canvas, pixel-owned rendering, and a new canvas draw
  controller. Extend the existing native React SVG, fixed logical viewBox,
  projection, inverse projection, and Pointer Events contract.
- Reject replacing the existing Haversine `distanceMeters`,
  `EARTH_RADIUS_M = 6_371_000`, and exact yard conversion with a new
  equirectangular distance engine, a different Earth radius, or unsupported
  accuracy claims. Carry geometry may reuse local projection for display, but
  persisted coordinates and distance truth remain geographic.
- Reject offline-course-download claims. CTC-007 adds no durable OSM cache or
  offline course loading; those concerns remain with CTC-019.
- Reject "AGPL protection compliance." The actual rule is that original Chart
  the Course code remains Apache-2.0 and prohibited AGPL/unlicensed reference
  code must not be copied or adapted.
- Reject drag-and-drop marker movement, live 60-FPS recalculation, map pan,
  zoom, rotation, and sliders as silently selected behavior. These are not
  required by the acceptance criteria and conflict with the current bounded
  SVG interaction surface. Conservative editing uses explicit form fields and
  a reviewed placement/reposition mode.
- Reject notes, marker colors, arc colors, pixel stroke widths, view settings,
  canvas rotation, zoom scale, display-unit preferences, and target-to-tee
  derived values in persisted project data. Notes belong to later work; visual
  styling and derived distances are not user-authored portable state.
- Reject limiting carry arcs to three, default example distances, target-only
  origins, and marker-owned arc arrays without resolving the required selected
  tee or target origin model.
- Reject exporting complete normalized geometry, raw Overpass responses, exact
  query bodies, or imported source metadata in the CTC-007 project file.
  CTC-007 project JSON contains user-authored state plus minimal stable source
  identity references only. Loaded normalized OSM evidence remains the trusted
  in-memory source and is never replaced by imported data.
- Reject invented `GeographicCoordinate { latitude, longitude }`. Reuse the
  authoritative `{ lat, lon }` coordinate contract.
- Reject the proposed top-level marker list because it does not key user state
  by stable `hole.source.sourceKey`. Array indexes and hole numbers are not
  persisted identity.
- Reject arbitrary RFC4122 UUID requirements without a dependency-free ID
  generation and validation decision. Marker identity must be deterministic
  enough for project operations and strictly validated, but the exact format
  remains unresolved.
- Reject `any`, object spreading of imported objects, truthiness defaults, and
  an open migration registry. These permit prototype pollution, preserve
  unknown fields, and invent unsupported migration behavior.
- Reject accepting every positive schema version and automatic migration.
  Conservative v1 policy is exact version match; unsupported versions fail
  with a useful error until a reviewed migration exists.
- Reject the malformed JSON Schema. It has missing `required` arrays,
  inconsistent singular/array TypeScript declarations, no
  `additionalProperties: false`, no hole ownership, and no complete strict
  validation/error contract.
- Reject "HTML sanitization" as the primary imported-string control. Imported
  strings must be strictly length/type validated and rendered as React text,
  never interpreted as HTML.
- Reject generic alerts, logging state changes, garbage-collection claims, and
  unsupported Firefox/CSP assertions. Use visible structured errors, focus
  management, and deterministic pure/helper tests.
- Reject splitting CTC-007 into new project-management tickets or formatting it
  for Notion.

## Corrected specification baseline

### Project document and trust boundary

- Define exactly one supported project document version, represented by a
  literal identifier such as `chart-the-course-project/v1`.
- The document stores user-authored project metadata and per-hole state keyed
  by exact `SourceKey` strings. It does not store normalized geometry, raw OSM
  elements, query bodies, endpoints, imported source metadata, derived
  distances, or visual styling.
- A minimal course/source identity block may contain only reviewed scalar
  references needed to detect mismatch, such as the selected course source key
  and copyright URL literal. It is a reference, not trusted replacement source
  evidence.
- Imported projects are usable only against the currently loaded normalized
  result. Unknown course/hole source keys produce a visible mismatch error or
  unresolved-state result; they never create trusted normalized holes.
- Project state is memory-only. Explicit import replaces the current
  user-authored project only after complete successful validation. Failed
  import leaves current state unchanged.

### Strict import and export

- Parse only a user-selected local `.json` file through an explicit file input.
  Drag-and-drop import is unnecessary for acceptance and deferred by default.
- Resolve and test a conservative maximum UTF-8 file size. Check `File.size`
  before reading and reject oversized content.
- Parse JSON as untrusted `unknown`. Recursively validate exact object shapes,
  own properties, primitive types, finite/ranged numbers, string lengths,
  exact schema version, exact source-key syntax, arrays, duplicate marker IDs,
  duplicate hole keys, carry origins, and coordinate bounds.
- Reject unknown properties at every schema-owned object level, dangerous keys
  such as `__proto__`, `prototype`, and `constructor`, unsupported versions,
  non-finite numbers, and all partial/ambiguous input. Do not spread or merge
  imported objects into application state.
- Return deterministic structured validation errors containing a stable code,
  JSON-style path, and user-facing message. Show an error summary, move focus
  to it, and keep current state unchanged.
- Export deterministic JSON with stable property and collection ordering,
  `application/json`, a reviewed filename, and a final newline. Revoke the
  object URL after activation using a deterministic cleanup path.

### Target model and interactions

- Targets are free user-authored geographic `{ lat, lon }` coordinates owned by
  one stable hole `SourceKey`. No snapping, feature linking, spatial
  association, inferred ownership, or imported source geometry is allowed.
- Define strict target identity, bounded label behavior, ordering, and
  coordinate validation. Do not persist derived distances or visual style.
- Extend the existing SVG with explicit mutually exclusive modes:
  `measure`, `place-target`, and `reposition-target` only if repositioning is
  accepted after review. The default remains measurement.
- Pointer input converts through the existing SVG screen transform and inverse
  projection. Persist only the resulting valid geographic coordinate.
- Keyboard target placement/repositioning reuses a visible bounded logical
  crosshair and documented steps. Escape cancels the active edit without
  mutating state.
- Target edit and delete use ordinary accessible controls outside the SVG.
  Resolve a clear destructive-action policy. Do not silently select dragging,
  pan, zoom, notes, or appearance customization.

### Carry model and rendering

- Carry settings are user-authored per-hole records with an explicit origin:
  either a stable target ID or a strictly resolved selected tee source key.
  Gemini must still resolve deterministic tee eligibility when a hole has zero,
  one, or multiple associated tee features/geometries.
- Define bounded positive carry distances and exact unit storage. Conservative
  default is store integer yards and display yards/meters without a persisted
  unit preference.
- Carry rings/arcs render in new deterministic SVG groups between route/source
  geometry and targets/measurement overlays. Styling uses reviewed
  color-independent strokes/dashes and accessible textual settings/results.
- Define geographic circle sampling from the origin with the existing Earth
  radius, then project samples through the existing projection. Resolve sample
  count, closure, antimeridian/pole behavior, viewport clipping, off-map
  semantics, projection-bound expansion policy, labels, and bounded tests.
- Never persist SVG/logical coordinates or claim a projected circle is
  geodesically exact.

### Tests and security

- Add pure tests for exact schema validation, deterministic serialization,
  source-key/hole mismatch, duplicate IDs/keys, finite/range checks, unknown
  fields, dangerous keys, unsupported versions, oversized files, and
  all-or-nothing import.
- Add pure carry tests for origin resolution, geographic samples, radius
  tolerance using existing Haversine distance, projection, ordering, and
  invalid inputs.
- Extend Playwright for explicit modes, pointer/keyboard target CRUD,
  measurement regression, carry settings/rendering, import/export round trip,
  invalid-file focus/errors, mobile layout, axe, attribution, and network
  isolation.
- Imported strings render only as text. No `innerHTML`, dynamic code,
  executable content, unsafe merge, logging side effects, or network upload.

## Mandatory unresolved decisions for Gemini revision

1. Exact v1 JSON shape, source-reference fields, target ID format, label
   bounds, collection ordering, filename, MIME, final-newline rule, maximum
   file size, and structured validation error codes/paths.
2. Whether duplicate JSON object keys must be detected before `JSON.parse`, or
   whether strict post-parse validation plus duplicate semantic IDs/keys is the
   accepted v1 boundary.
3. Exact loaded-course/hole mismatch behavior and whether unresolved imported
   hole state is rejected or retained but inactive.
4. Exact target repositioning interaction. Conservative default is explicit
   mode with pointer/keyboard placement, not unconstrained dragging.
5. Delete confirmation versus immediate delete plus undo, with accessible
   focus/live behavior.
6. Exact selected-tee eligibility and origin identity for point, polygon,
   multiple, null, or missing tee geometry.
7. Carry-distance count, bounds, step, storage unit, geographic sample
   algorithm/count, clipping, labels, off-map behavior, and whether target/arc
   coordinates expand projection bounds.
8. Exact SVG layer order and measurement/target mode coexistence.

## Red lines for later Claude QA planning

Treat these as blockers:

- Canvas replacement, new production dependencies, pan/zoom/rotation, notes,
  visual preferences, autosave, durable persistence, CTC-019 behavior, PDF, or
  external user-data flows;
- imported or exported raw/normalized OSM geometry being trusted as current
  source evidence;
- persisted array indexes, hole numbers as identity, derived distance, SVG
  coordinates, or unsafe imported objects;
- `any`, object spreading/merging of imported data, unknown-field acceptance,
  prototype-pollution exposure, partial import, or automatic unreviewed
  migration;
- replacing existing Haversine/projection constants or fabricating accuracy or
  performance claims;
- target editing that silently activates measurement, inaccessible
  pointer-only CRUD, hidden attribution, color-only semantics, or networked
  tests.
