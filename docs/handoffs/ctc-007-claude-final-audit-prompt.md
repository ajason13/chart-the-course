# CTC-007 Claude final audit handoff

## Role and stage

Act as the final adversarial auditor for CTC-007, Add target markers, carry
arcs, and local project model. Audit commit
`af93ee0` (`Implement CTC-007 targets carry arcs and projects`) against the
accepted corrected specification and repository contracts embedded below.
Claude Chat has no filesystem or GitHub access; this bundle is self-contained.

Return exactly one verdict: `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`.
Distinguish blockers from minor fixes and state whether CTC-007 may be marked
Done after any confined minor fixes without re-audit.

## Acceptance criteria

- User can add, edit, and delete target markers per hole.
- Carry arcs render at configurable distances from selected tee or target.
- Project state can export and import as a local JSON file.
- Invalid project files fail gracefully with useful errors.

## Audit focus and boundaries

- Verify strict dependency-free v1 project validation, deterministic
  serialization, safe all-or-nothing import, loaded-course/hole matching, and
  memory-only state separation from immutable normalized OSM evidence.
- Verify target add/reposition/label/delete/undo interactions, explicit mode
  coexistence with CTC-006 measurement, pointer/touch/keyboard accessibility,
  and mobile behavior.
- Verify deterministic tee/target carry origins, 64-bearing geographic rings
  using existing constants, clipping/off-map/origin errors, SVG layer order,
  and color-independent semantics.
- Verify no new dependency, Canvas replacement, pan/zoom/dragging,
  notes/preferences, automatic migration, durable persistence, CTC-019
  behavior, PDF/rendered export, provider, API key, account, server, external
  user-data flow, unsafe imported-object merge, trusted imported OSM geometry,
  logging side effect, or prohibited reference-project reuse.
- Treat security-boundary violations, source-trust substitution, inaccessible
  CRUD, acceptance-criteria failures, and test/network-isolation regressions as
  blockers.

## Verification evidence

- `npm run check` passed: scaffold policy, build, 39 Vitest tests, and 14
  Playwright tests.
- `git diff --check` passed.
- `npm_config_cache=/private/tmp/chart-the-course-npm-cache
  scripts/compliance.sh` passed with allowed production licenses and 0
  production vulnerabilities.
- No production dependency changed.

## Required response format

1. **Verdict:** `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`.
2. **Blocking findings:** numbered with file/behavior evidence, or `None`.
3. **Minor findings:** numbered with exact confined corrections, or `None`.
4. **Acceptance-criteria assessment.**
5. **Security, privacy, attribution, and scope assessment.**
6. **Test and verification assessment.**
7. **Completion disposition:** state whether CTC-007 may be marked Done, may be
   marked Done after confined fixes without re-audit, or requires re-audit.

## Exact relevant repository file contents at audited commit

<!-- GENERATED EXACT FILES BELOW -->

<!-- BEGIN EXACT FILE 1/12: docs/handoffs/ctc-007-gemini-specification-review.md -->

### docs/handoffs/ctc-007-gemini-specification-review.md

``````text
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

## Final Gemini revision disposition

Gemini received a mandatory revision prompt with nine explicit corrections.
The revision is rejected in full because it:

- introduced an unapproved Zod production dependency and generated types
  instead of defining dependency-free strict validation;
- retained `any`, object spreading/merging of imported objects, automatic
  migrations, unknown legacy input defaults, and unsafe partial update types;
- retained notes, colors, display-unit preferences, global settings, pan,
  dragging, automatic course switching, and error-boundary logging;
- invented course geometry/state contracts, tuple coordinates, source keys,
  file/module structure, and OSM IDs that contradict the embedded repository;
- again replaced existing projection/Haversine constants with new Earth radii,
  flat-plane distance assumptions, browser-pixel math, and unsupported
  precision/performance claims;
- persisted or trusted OSM-derived course identity and attribution fields
  without resolving the minimal source-reference trust boundary;
- proposed malformed schemas, fixtures, reducer initializers, and examples
  that would not compile or validate;
- failed to resolve exact target ID, strict v1 shape, duplicate-key policy,
  course/hole mismatch behavior, tee-origin eligibility, carry sample count,
  geographic sampling, layer order, clipping, and accessible destructive
  actions while claiming zero blockers.

No decisions from the final revision are accepted. The corrected baseline and
mandatory unresolved decisions in this document are the sole specification
authority for Claude adversarial QA planning.
``````

<!-- END EXACT FILE 1/12: docs/handoffs/ctc-007-gemini-specification-review.md -->

<!-- BEGIN EXACT FILE 2/12: docs/handoffs/ctc-007-spec-corrections.md -->

### docs/handoffs/ctc-007-spec-corrections.md

``````text
# CTC-007 Claude QA-planning corrections

Date: 2026-06-12

## Disposition

Claude returned `READY WITH REQUIRED SPEC CORRECTIONS`. BF-1 through BF-8 and
Decisions 1 through 10 are accepted except for the consistency corrections
below. These corrections preserve Claude's intent and authorize development.
The rejected Gemini revision remains rejected in full.

## Consistency corrections

1. Target IDs use `/^t-[0-9a-f]{12}$/`; carry IDs use
   `/^c-[0-9a-f]{12}$/`. Both use six bytes from `crypto.getRandomValues`
   encoded as lowercase hexadecimal. Separate prefixes avoid ambiguous ID
   namespaces.
2. V1 does not detect duplicate raw JSON object keys because `JSON.parse`
   resolves them before validation. Remove `DUPLICATE_KEY` as a claimed
   post-parse check. Duplicate semantic target and carry IDs are rejected
   across the complete project.
3. The maximum returned validation-error count is 20 including the
   too-many-errors sentinel. Collect at most 19 field errors, then append one
   sentinel error.
4. Carry sampling returns exactly 65 valid coordinates: 64 bearings plus a
   closing copy of sample zero. Any invalid generated coordinate returns a
   typed carry-generation failure; samples are never silently dropped.
5. Normalize longitude to `[-180, 180)` degrees. Split rendered carry segments
   where two consecutive normalized sample longitudes differ by more than 180
   degrees. The antimeridian test uses a valid maximum 700-yard carry near the
   antimeridian, not the out-of-range 5,000-yard example.
6. Import confirmation occurs after the file-input change event but before
   file reading. Cancel clears the input value, returns focus to the import
   control, and leaves project state unchanged.
7. The success announcement receives programmatic focus through
   `tabIndex={-1}` in addition to `aria-live="polite"`. The error-summary
   heading is likewise focusable.
8. Target placement announces target-specific text; it must not reuse
   CTC-006's measurement announcement `"First point placed"`.
9. The current course source key is the first deterministic normalized course
   candidate. Import/export controls are unavailable when no course candidate
   exists. This does not mutate or replace normalized source evidence.
10. SVG target markers use `role="button"` when they are keyboard/click
    selectable. Ordinary target-list controls remain the primary edit/delete
    interface.
11. Imported dangling target-origin carry records remain structurally valid
    and produce the specified visible error state. They are not silently
    dropped or treated as trusted geometry.
12. Deterministic serialization means fixed property/collection ordering and
    formatting. `exportedAt` intentionally changes between exports and is not
    included in byte-identical repeated-export assertions.

## Accepted implementation rules

- Use Claude's exact v1 project shape, 512 KiB maximum, strict unknown-field
  rejection, dangerous-key rejection, exact schema version, all-or-nothing
  import, course/hole matching, fixed filename/MIME/final newline, and
  requestAnimationFrame object-URL cleanup, subject to the corrections above.
- Use memory-only project state, explicit `measure`, `place-target`, and
  `reposition-target` modes, free geographic targets, explicit label editing,
  immediate delete with single-level undo, and existing pointer/keyboard
  projection behavior.
- Use deterministic tee-origin eligibility, 0–5 carry records per hole,
  1–5 unique ascending integer-yard distances from 1–700, 64-bearing
  geographic rings using existing `EARTH_RADIUS_M`, fixed hole projection,
  clipped carry rendering, visible off-map/origin errors, and the accepted SVG
  layer order.
- Use no new production dependency, no Zod, no Canvas replacement, no
  pan/zoom/rotation/dragging, no notes/preferences, no automatic migration, no
  durable persistence, no CTC-019 behavior, and no logging side effects.
- Final Claude audit remains mandatory after implementation.
``````

<!-- END EXACT FILE 2/12: docs/handoffs/ctc-007-spec-corrections.md -->

<!-- BEGIN EXACT FILE 3/12: package.json -->

### package.json

``````text
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
``````

<!-- END EXACT FILE 3/12: package.json -->

<!-- BEGIN EXACT FILE 4/12: fixtures/projects/synthetic-project-wrong-course.json -->

### fixtures/projects/synthetic-project-wrong-course.json

``````text
{
  "schema": "chart-the-course-project/v1",
  "exportedAt": "2026-06-12T00:00:00.000Z",
  "courseSourceKey": "way/9000069999",
  "courseCopyrightUrl": "https://www.openstreetmap.org/copyright",
  "holes": {}
}
``````

<!-- END EXACT FILE 4/12: fixtures/projects/synthetic-project-wrong-course.json -->

<!-- BEGIN EXACT FILE 5/12: src/project.ts -->

### src/project.ts

``````text
import type { Coordinate, SourceKey } from "./normalize";

export const PROJECT_SCHEMA = "chart-the-course-project/v1";
export const PROJECT_FILENAME = "chart-the-course-project.json";
export const PROJECT_MIME = "application/json";
export const PROJECT_MAX_BYTES = 524_288;
export const OSM_COPYRIGHT_URL = "https://www.openstreetmap.org/copyright";

export type TargetV1 = Coordinate & {
  id: string;
  label: string;
};

export type CarryOriginV1 =
  | { kind: "tee"; sourceKey: SourceKey }
  | { kind: "target"; targetId: string };

export type CarryV1 = {
  id: string;
  origin: CarryOriginV1;
  distances: number[];
};

export type HoleStateV1 = {
  targets: TargetV1[];
  carries: CarryV1[];
};

export type ProjectV1 = {
  schema: typeof PROJECT_SCHEMA;
  exportedAt: string;
  courseSourceKey: SourceKey;
  courseCopyrightUrl: typeof OSM_COPYRIGHT_URL;
  holes: Partial<Record<SourceKey, HoleStateV1>>;
};

export type ValidationErrorCode =
  | "INVALID_JSON" | "UNSUPPORTED_VERSION" | "WRONG_TYPE" | "MISSING_FIELD"
  | "UNKNOWN_FIELD" | "DANGEROUS_KEY" | "INVALID_FORMAT" | "OUT_OF_RANGE"
  | "NON_FINITE" | "EMPTY_STRING" | "STRING_TOO_LONG" | "DUPLICATE_ID"
  | "EMPTY_ARRAY" | "ARRAY_TOO_LONG" | "NON_INTEGER" | "NON_ASCENDING"
  | "NON_UNIQUE_DISTANCES" | "COURSE_MISMATCH" | "HOLE_MISMATCH";

export type ValidationError = {
  code: ValidationErrorCode;
  path: string;
  message: string;
};

export type ValidationResult =
  | { ok: true; project: ProjectV1 }
  | { ok: false; errors: ValidationError[] };

const SOURCE_KEY = /^(node|way|relation)\/[1-9][0-9]{0,18}$/;
const TARGET_ID = /^t-[0-9a-f]{12}$/;
const CARRY_ID = /^c-[0-9a-f]{12}$/;
const DANGEROUS = new Set(["__proto__", "constructor", "prototype"]);
const MAX_ERRORS = 20;

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

class Errors {
  values: ValidationError[] = [];

  add(code: ValidationErrorCode, path: string, message: string) {
    if (this.values.length >= MAX_ERRORS) return;
    if (this.values.length === MAX_ERRORS - 1) {
      this.values.push({ code: "WRONG_TYPE", path: "$", message: "Too many errors - remaining fields not validated." });
      return;
    }
    this.values.push({ code, path, message });
  }

  shape(value: unknown, allowed: string[], required: string[], path: string): Record<string, unknown> | null {
    const object = record(value);
    if (!object) {
      this.add("WRONG_TYPE", path, "Expected an object.");
      return null;
    }
    for (const key of Object.keys(object)) {
      if (DANGEROUS.has(key)) {
        this.add("DANGEROUS_KEY", `${path}.${key}`, "Unsupported or insecure property.");
        return null;
      }
      if (!allowed.includes(key)) this.add("UNKNOWN_FIELD", `${path}.${key}`, "Unknown property.");
    }
    for (const key of required) {
      if (!Object.hasOwn(object, key)) this.add("MISSING_FIELD", `${path}.${key}`, "Required property is missing.");
    }
    return object;
  }
}

function validSourceKey(value: unknown): value is SourceKey {
  return typeof value === "string" && SOURCE_KEY.test(value);
}

function validDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}/.test(value) && Number.isFinite(Date.parse(value));
}

function validateLabel(value: unknown, path: string, errors: Errors): string | null {
  if (typeof value !== "string") {
    errors.add("WRONG_TYPE", path, "Expected a string.");
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) errors.add("EMPTY_STRING", path, "Label must not be empty.");
  if ([...trimmed].length > 40) errors.add("STRING_TOO_LONG", path, "Label must be 40 characters or fewer.");
  return trimmed && [...trimmed].length <= 40 ? trimmed : null;
}

function validateCoordinate(value: unknown, path: string, minimum: number, maximum: number, errors: Errors): number | null {
  if (typeof value !== "number") {
    errors.add("WRONG_TYPE", path, "Expected a number.");
    return null;
  }
  if (!Number.isFinite(value)) errors.add("NON_FINITE", path, "Number must be finite.");
  else if (value < minimum || value > maximum) errors.add("OUT_OF_RANGE", path, `Number must be between ${minimum} and ${maximum}.`);
  return Number.isFinite(value) && value >= minimum && value <= maximum ? value : null;
}

function validateTarget(value: unknown, path: string, errors: Errors): TargetV1 | null {
  const object = errors.shape(value, ["id", "label", "lat", "lon"], ["id", "label", "lat", "lon"], path);
  if (!object) return null;
  if (typeof object.id !== "string" || !TARGET_ID.test(object.id)) errors.add("INVALID_FORMAT", `${path}.id`, "Invalid target ID.");
  const label = validateLabel(object.label, `${path}.label`, errors);
  const lat = validateCoordinate(object.lat, `${path}.lat`, -90, 90, errors);
  const lon = validateCoordinate(object.lon, `${path}.lon`, -180, 180, errors);
  return typeof object.id === "string" && TARGET_ID.test(object.id) && label !== null && lat !== null && lon !== null
    ? { id: object.id, label, lat, lon }
    : null;
}

function validateOrigin(value: unknown, path: string, errors: Errors): CarryOriginV1 | null {
  const object = record(value);
  if (!object || typeof object.kind !== "string") {
    errors.add("WRONG_TYPE", path, "Expected a carry origin object.");
    return null;
  }
  if (object.kind === "tee") {
    const shaped = errors.shape(object, ["kind", "sourceKey"], ["kind", "sourceKey"], path);
    if (!shaped || !validSourceKey(shaped.sourceKey)) {
      errors.add("INVALID_FORMAT", `${path}.sourceKey`, "Invalid tee source key.");
      return null;
    }
    return { kind: "tee", sourceKey: shaped.sourceKey };
  }
  if (object.kind === "target") {
    const shaped = errors.shape(object, ["kind", "targetId"], ["kind", "targetId"], path);
    if (!shaped || typeof shaped.targetId !== "string" || !TARGET_ID.test(shaped.targetId)) {
      errors.add("INVALID_FORMAT", `${path}.targetId`, "Invalid target ID.");
      return null;
    }
    return { kind: "target", targetId: shaped.targetId };
  }
  errors.add("INVALID_FORMAT", `${path}.kind`, "Origin kind must be tee or target.");
  return null;
}

function validateCarry(value: unknown, path: string, errors: Errors): CarryV1 | null {
  const object = errors.shape(value, ["id", "origin", "distances"], ["id", "origin", "distances"], path);
  if (!object) return null;
  if (typeof object.id !== "string" || !CARRY_ID.test(object.id)) errors.add("INVALID_FORMAT", `${path}.id`, "Invalid carry ID.");
  const origin = validateOrigin(object.origin, `${path}.origin`, errors);
  if (!Array.isArray(object.distances)) {
    errors.add("WRONG_TYPE", `${path}.distances`, "Expected an array.");
    return null;
  }
  if (object.distances.length === 0) errors.add("EMPTY_ARRAY", `${path}.distances`, "At least one carry distance is required.");
  if (object.distances.length > 5) errors.add("ARRAY_TOO_LONG", `${path}.distances`, "At most five carry distances are allowed.");
  const distances: number[] = [];
  object.distances.forEach((distance, index) => {
    const itemPath = `${path}.distances[${index}]`;
    if (typeof distance !== "number" || !Number.isInteger(distance)) errors.add("NON_INTEGER", itemPath, "Carry distance must be an integer.");
    else if (distance < 1 || distance > 700) errors.add("OUT_OF_RANGE", itemPath, "Carry distance must be between 1 and 700 yards.");
    else distances.push(distance);
  });
  if (new Set(distances).size !== distances.length) errors.add("NON_UNIQUE_DISTANCES", `${path}.distances`, "Carry distances must be unique.");
  if (distances.some((distance, index) => index > 0 && distance <= distances[index - 1])) {
    errors.add("NON_ASCENDING", `${path}.distances`, "Carry distances must be ascending.");
  }
  return typeof object.id === "string" && CARRY_ID.test(object.id) && origin && distances.length === object.distances.length
    && distances.length >= 1 && distances.length <= 5 && new Set(distances).size === distances.length
    && !distances.some((distance, index) => index > 0 && distance <= distances[index - 1])
    ? { id: object.id, origin, distances }
    : null;
}

function validateHole(value: unknown, path: string, errors: Errors, ids: Set<string>): HoleStateV1 | null {
  const object = errors.shape(value, ["targets", "carries"], ["targets", "carries"], path);
  if (!object) return null;
  if (!Array.isArray(object.targets)) errors.add("WRONG_TYPE", `${path}.targets`, "Expected an array.");
  if (!Array.isArray(object.carries)) errors.add("WRONG_TYPE", `${path}.carries`, "Expected an array.");
  for (const item of [
    ...(Array.isArray(object.targets) ? object.targets : []),
    ...(Array.isArray(object.carries) ? object.carries : []),
  ]) {
    const id = record(item)?.id;
    if (typeof id !== "string") continue;
    if (ids.has(id)) errors.add("DUPLICATE_ID", path, `Duplicate project ID: ${id}.`);
    ids.add(id);
  }
  const targets = Array.isArray(object.targets)
    ? object.targets.map((target, index) => validateTarget(target, `${path}.targets[${index}]`, errors)).filter((target): target is TargetV1 => target !== null)
    : [];
  const carries = Array.isArray(object.carries)
    ? object.carries.map((carry, index) => validateCarry(carry, `${path}.carries[${index}]`, errors)).filter((carry): carry is CarryV1 => carry !== null)
    : [];
  if (targets.length > 10) errors.add("ARRAY_TOO_LONG", `${path}.targets`, "At most ten targets are allowed per hole.");
  if (carries.length > 5) errors.add("ARRAY_TOO_LONG", `${path}.carries`, "At most five carry records are allowed per hole.");
  return Array.isArray(object.targets) && Array.isArray(object.carries)
    && targets.length === object.targets.length && carries.length === object.carries.length
    && targets.length <= 10 && carries.length <= 5 ? { targets, carries } : null;
}

export function validateProjectFile(raw: unknown): ValidationResult {
  const errors = new Errors();
  const object = errors.shape(raw, ["schema", "exportedAt", "courseSourceKey", "courseCopyrightUrl", "holes"],
    ["schema", "exportedAt", "courseSourceKey", "courseCopyrightUrl", "holes"], "$");
  if (!object) return { ok: false, errors: errors.values };
  if (object.schema !== PROJECT_SCHEMA) {
    return { ok: false, errors: [{ code: "UNSUPPORTED_VERSION", path: "$.schema", message: `Only ${PROJECT_SCHEMA} is supported.` }] };
  }
  if (!validDate(object.exportedAt)) errors.add("INVALID_FORMAT", "$.exportedAt", "Invalid export timestamp.");
  if (!validSourceKey(object.courseSourceKey)) errors.add("INVALID_FORMAT", "$.courseSourceKey", "Invalid course source key.");
  if (object.courseCopyrightUrl !== OSM_COPYRIGHT_URL) errors.add("INVALID_FORMAT", "$.courseCopyrightUrl", "Invalid copyright URL.");
  const holesObject = errors.shape(object.holes, Object.keys(record(object.holes) ?? {}), [], "$.holes");
  const holes: Partial<Record<SourceKey, HoleStateV1>> = {};
  const ids = new Set<string>();
  if (holesObject) {
    for (const key of Object.keys(holesObject).sort()) {
      if (!validSourceKey(key)) {
        errors.add("INVALID_FORMAT", `$.holes.${key}`, "Invalid hole source key.");
        continue;
      }
      const hole = validateHole(holesObject[key], `$.holes.${key}`, errors, ids);
      if (hole) holes[key] = hole;
    }
  }
  return errors.values.length === 0 && validDate(object.exportedAt) && validSourceKey(object.courseSourceKey)
    && object.courseCopyrightUrl === OSM_COPYRIGHT_URL
    ? { ok: true, project: { schema: PROJECT_SCHEMA, exportedAt: object.exportedAt, courseSourceKey: object.courseSourceKey, courseCopyrightUrl: OSM_COPYRIGHT_URL, holes } }
    : { ok: false, errors: errors.values };
}

export function parseProjectText(text: string): ValidationResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, errors: [{ code: "INVALID_JSON", path: "$", message: "File is not valid JSON." }] };
  }
  return validateProjectFile(raw);
}

export function projectMatchErrors(project: ProjectV1, courseSourceKey: SourceKey, holeKeys: SourceKey[]): ValidationError[] {
  const errors: ValidationError[] = [];
  if (project.courseSourceKey !== courseSourceKey) {
    errors.push({ code: "COURSE_MISMATCH", path: "$.courseSourceKey", message: `Project course ${project.courseSourceKey} does not match loaded course ${courseSourceKey}.` });
  }
  const known = new Set(holeKeys);
  for (const key of Object.keys(project.holes).sort()) {
    if (!known.has(key as SourceKey)) errors.push({ code: "HOLE_MISMATCH", path: `$.holes.${key}`, message: `Project hole ${key} is not available in the loaded course.` });
  }
  return errors.slice(0, MAX_ERRORS);
}

export function emptyProject(courseSourceKey: SourceKey, exportedAt = new Date().toISOString()): ProjectV1 {
  return { schema: PROJECT_SCHEMA, exportedAt, courseSourceKey, courseCopyrightUrl: OSM_COPYRIGHT_URL, holes: {} };
}

export function serializeProject(project: ProjectV1): string {
  const holes = Object.fromEntries(Object.entries(project.holes).sort(([left], [right]) => left.localeCompare(right)));
  return `${JSON.stringify({ ...project, holes }, null, 2)}\n`;
}

export function generateProjectId(kind: "target" | "carry"): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const value = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${kind === "target" ? "t" : "c"}-${value}`;
}
``````

<!-- END EXACT FILE 5/12: src/project.ts -->

<!-- BEGIN EXACT FILE 6/12: src/project.test.ts -->

### src/project.test.ts

``````text
import {
  OSM_COPYRIGHT_URL,
  PROJECT_SCHEMA,
  emptyProject,
  parseProjectText,
  projectMatchErrors,
  serializeProject,
  validateProjectFile,
  type ProjectV1,
} from "./project";

const valid: ProjectV1 = {
  schema: PROJECT_SCHEMA,
  exportedAt: "2026-06-12T00:00:00.000Z",
  courseSourceKey: "way/9000000001",
  courseCopyrightUrl: OSM_COPYRIGHT_URL,
  holes: {
    "way/9000000101": {
      targets: [{ id: "t-0123456789ab", label: "Layup", lat: 35, lon: -80 }],
      carries: [{
        id: "c-0123456789ab",
        origin: { kind: "target", targetId: "t-0123456789ab" },
        distances: [150, 200],
      }],
    },
  },
};

describe("project v1 validation", () => {
  it("validates and deterministically round-trips a project", () => {
    const serialized = serializeProject(valid);
    expect(serialized.endsWith("\n")).toBe(true);
    expect(parseProjectText(serialized)).toEqual({ ok: true, project: valid });
    expect(Object.keys(JSON.parse(serialized).holes)).toEqual(["way/9000000101"]);
  });

  it("rejects invalid JSON, unsupported versions, unknown fields, and dangerous keys", () => {
    expect(parseProjectText("{").ok).toBe(false);
    expect(validateProjectFile({ ...valid, schema: "chart-the-course-project/v2" })).toEqual({
      ok: false,
      errors: [{ code: "UNSUPPORTED_VERSION", path: "$.schema", message: "Only chart-the-course-project/v1 is supported." }],
    });
    const unknown = validateProjectFile({ ...valid, extra: true });
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.errors.map(({ code }) => code)).toContain("UNKNOWN_FIELD");
    const dangerous = parseProjectText(JSON.stringify(valid).replace('"holes":{', '"holes":{"__proto__":{},'));
    expect(dangerous.ok).toBe(false);
    if (!dangerous.ok) expect(dangerous.errors.map(({ code }) => code)).toContain("DANGEROUS_KEY");
  });

  it("rejects bad coordinates, IDs, duplicate IDs, and invalid carries", () => {
    const broken = structuredClone(valid) as ProjectV1;
    const hole = broken.holes["way/9000000101"]!;
    hole.targets.push({ id: "t-0123456789ab", label: "x".repeat(41), lat: 91, lon: Number.NaN });
    hole.carries[0].distances = [200, 150, 150, 701];
    const result = validateProjectFile(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map(({ code }) => code)).toEqual(expect.arrayContaining([
        "DUPLICATE_ID", "STRING_TOO_LONG", "OUT_OF_RANGE", "NON_FINITE",
        "NON_ASCENDING", "NON_UNIQUE_DISTANCES",
      ]));
    }
  });

  it("caps validation output at twenty errors including the sentinel", () => {
    const result = validateProjectFile(Object.fromEntries([
      ["schema", PROJECT_SCHEMA],
      ["exportedAt", "bad"],
      ["courseSourceKey", "bad"],
      ["courseCopyrightUrl", "bad"],
      ["holes", {}],
      ...Array.from({ length: 30 }, (_, index) => [`extra${index}`, index]),
    ]));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toHaveLength(20);
      expect(result.errors.at(-1)?.message).toContain("Too many errors");
    }
  });

  it("reports course and hole mismatches without changing project data", () => {
    expect(projectMatchErrors(valid, "way/9000000002", ["way/9000000102"])).toEqual([
      expect.objectContaining({ code: "COURSE_MISMATCH" }),
      expect.objectContaining({ code: "HOLE_MISMATCH" }),
    ]);
    expect(emptyProject("way/9000000001", valid.exportedAt)).toEqual({
      schema: PROJECT_SCHEMA,
      exportedAt: valid.exportedAt,
      courseSourceKey: "way/9000000001",
      courseCopyrightUrl: OSM_COPYRIGHT_URL,
      holes: {},
    });
  });
});
``````

<!-- END EXACT FILE 6/12: src/project.test.ts -->

<!-- BEGIN EXACT FILE 7/12: src/carry.ts -->

### src/carry.ts

``````text
import { EARTH_RADIUS_M, YARDS_PER_METER, projectCoordinate, type Projection, type ViewportPoint } from "./map";
import { geometryCoordinates, validCoordinate } from "./map";
import type { Coordinate, NormalizedHole, SourceKey } from "./normalize";
import type { CarryOriginV1, CarryV1, TargetV1 } from "./project";

export type CarryRing = {
  carryId: string;
  yards: number;
  coordinates: Coordinate[];
  points: ViewportPoint[];
  segments: ViewportPoint[][];
  offMap: boolean;
};

export type CarryFailure = { kind: "origin-unavailable" | "invalid-distance" | "invalid-sample" };

export function teeOrigins(hole: NormalizedHole): Array<{ sourceKey: SourceKey; coordinate: Coordinate }> {
  return hole.features.filter(({ kind, geometry }) => kind === "tee" && geometry !== null)
    .map((feature) => ({ sourceKey: feature.source.sourceKey, coordinate: geometryCoordinates(feature.geometry!)[0] }))
    .filter(({ coordinate }) => validCoordinate(coordinate));
}

export function resolveCarryOrigin(origin: CarryOriginV1, hole: NormalizedHole, targets: TargetV1[]): Coordinate | CarryFailure {
  if (origin.kind === "target") {
    const target = targets.find(({ id }) => id === origin.targetId);
    return target && validCoordinate(target) ? { lat: target.lat, lon: target.lon } : { kind: "origin-unavailable" };
  }
  return teeOrigins(hole).find(({ sourceKey }) => sourceKey === origin.sourceKey)?.coordinate ?? { kind: "origin-unavailable" };
}

export function carryCoordinates(origin: Coordinate, yards: number): Coordinate[] | CarryFailure {
  if (!validCoordinate(origin) || !Number.isInteger(yards) || yards < 1 || yards > 700) return { kind: "invalid-distance" };
  const distance = yards / YARDS_PER_METER;
  const angular = distance / EARTH_RADIUS_M;
  const lat0 = origin.lat * Math.PI / 180;
  const lon0 = origin.lon * Math.PI / 180;
  const coordinates: Coordinate[] = [];
  for (let index = 0; index < 64; index += 1) {
    const bearing = index / 64 * 2 * Math.PI;
    const lat = Math.asin(Math.sin(lat0) * Math.cos(angular)
      + Math.cos(lat0) * Math.sin(angular) * Math.cos(bearing));
    const rawLon = lon0 + Math.atan2(
      Math.sin(bearing) * Math.sin(angular) * Math.cos(lat0),
      Math.cos(angular) - Math.sin(lat0) * Math.sin(lat),
    );
    const lon = ((rawLon + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    const coordinate = { lat: lat * 180 / Math.PI, lon: lon * 180 / Math.PI };
    if (!validCoordinate(coordinate)) return { kind: "invalid-sample" };
    coordinates.push(coordinate);
  }
  return [...coordinates, coordinates[0]];
}

function splitSegments(coordinates: Coordinate[], points: ViewportPoint[]): ViewportPoint[][] {
  const segments: ViewportPoint[][] = [[points[0]]];
  for (let index = 1; index < points.length; index += 1) {
    if (Math.abs(coordinates[index].lon - coordinates[index - 1].lon) > 180) segments.push([]);
    segments[segments.length - 1].push(points[index]);
  }
  return segments.filter((segment) => segment.length > 1);
}

export function carryRings(carry: CarryV1, hole: NormalizedHole, targets: TargetV1[], projection: Projection): CarryRing[] | CarryFailure {
  const origin = resolveCarryOrigin(carry.origin, hole, targets);
  if ("kind" in origin) return origin;
  const rings: CarryRing[] = [];
  for (const yards of carry.distances) {
    const coordinates = carryCoordinates(origin, yards);
    if (!Array.isArray(coordinates)) return coordinates;
    const points = coordinates.map((coordinate) => projectCoordinate(projection, coordinate));
    rings.push({
      carryId: carry.id,
      yards,
      coordinates,
      points,
      segments: splitSegments(coordinates, points),
      offMap: points.some(({ x, y }) => x < 40 || x > 760 || y < 40 || y > 560),
    });
  }
  return rings;
}
``````

<!-- END EXACT FILE 7/12: src/carry.ts -->

<!-- BEGIN EXACT FILE 8/12: src/carry.test.ts -->

### src/carry.test.ts

``````text
import fixture from "../fixtures/overpass/synthetic-golf-course-ctc006.json";
import { carryCoordinates, carryRings, resolveCarryOrigin, teeOrigins } from "./carry";
import { createProjection, distanceMeters, holeCoordinates } from "./map";
import { normalizeGolfCourse } from "./normalize";
import type { OverpassResponse, SourceMetadata } from "./overpass";

const source: SourceMetadata = {
  query: "synthetic",
  endpoint: "https://example.invalid",
  completedAt: "2026-06-12T00:00:00Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: "https://www.openstreetmap.org/copyright",
};
const result = normalizeGolfCourse(fixture as OverpassResponse, source);
const hole = result.holes[0];

describe("carry geometry", () => {
  it("resolves deterministic tee and target origins", () => {
    const tees = teeOrigins(hole);
    expect(tees).toHaveLength(1);
    expect(resolveCarryOrigin({ kind: "tee", sourceKey: tees[0].sourceKey }, hole, [])).toEqual(tees[0].coordinate);
    expect(resolveCarryOrigin({ kind: "target", targetId: "t-0123456789ab" }, hole,
      [{ id: "t-0123456789ab", label: "Target", lat: 35, lon: -80 }])).toEqual({ lat: 35, lon: -80 });
    expect(resolveCarryOrigin({ kind: "target", targetId: "t-ffffffffffff" }, hole, [])).toEqual({ kind: "origin-unavailable" });
  });

  it("generates a closed 64-bearing ring using the existing distance contract", () => {
    const origin = { lat: 35, lon: -80 };
    const coordinates = carryCoordinates(origin, 150);
    expect(Array.isArray(coordinates)).toBe(true);
    if (!Array.isArray(coordinates)) return;
    expect(coordinates).toHaveLength(65);
    expect(coordinates.at(-1)).toEqual(coordinates[0]);
    for (const coordinate of coordinates.slice(0, 64)) {
      const measured = distanceMeters(origin, coordinate);
      expect(measured).toBeTypeOf("number");
      expect(measured as number).toBeCloseTo(150 * 0.9144, 5);
    }
  });

  it("normalizes and splits an antimeridian-crossing maximum-distance ring", () => {
    const coordinates = carryCoordinates({ lat: 0, lon: 179.999 }, 700);
    expect(Array.isArray(coordinates)).toBe(true);
    if (!Array.isArray(coordinates)) return;
    expect(coordinates.some(({ lon }) => lon < -179)).toBe(true);
    expect(coordinates.every(({ lon }) => lon >= -180 && lon < 180)).toBe(true);
  });

  it("projects clipped carry rings and rejects invalid distances", () => {
    const projection = createProjection(holeCoordinates(hole));
    if ("kind" in projection) throw new Error(projection.kind);
    const tee = teeOrigins(hole)[0];
    const rings = carryRings({ id: "c-0123456789ab", origin: { kind: "tee", sourceKey: tee.sourceKey }, distances: [150] },
      hole, [], projection);
    expect(Array.isArray(rings)).toBe(true);
    if (Array.isArray(rings)) {
      expect(rings[0].segments.length).toBeGreaterThan(0);
      expect(rings[0].offMap).toBeTypeOf("boolean");
    }
    expect(carryCoordinates({ lat: 35, lon: -80 }, 0)).toEqual({ kind: "invalid-distance" });
    expect(carryCoordinates({ lat: 35, lon: -80 }, 701)).toEqual({ kind: "invalid-distance" });
  });
});
``````

<!-- END EXACT FILE 8/12: src/carry.test.ts -->

<!-- BEGIN EXACT FILE 9/12: src/App.tsx -->

### src/App.tsx

``````text
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { HoleMap } from "./HoleMap";
import { normalizeGolfCourse } from "./normalize";
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
import {
  PROJECT_FILENAME,
  PROJECT_MAX_BYTES,
  PROJECT_MIME,
  emptyProject,
  parseProjectText,
  projectMatchErrors,
  serializeProject,
  type HoleStateV1,
  type ValidationError,
} from "./project";
import type { SourceKey } from "./normalize";

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
  const [selectedHoleKey, setSelectedHoleKey] = useState("");
  const [projectHoles, setProjectHoles] = useState<Partial<Record<SourceKey, HoleStateV1>>>({});
  const [projectErrors, setProjectErrors] = useState<ValidationError[]>([]);
  const [projectMessage, setProjectMessage] = useState("");
  const requestIdentity = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const fieldRefs = useRef<Record<keyof Bbox, HTMLInputElement | null>>({
    south: null, west: null, north: null, east: null,
  });
  const courseNameRef = useRef<HTMLInputElement>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const projectNotice = useRef<HTMLParagraphElement>(null);
  const projectErrorHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => () => {
    requestIdentity.current += 1;
    controller.current?.abort();
  }, []);

  const loading = state.kind === "loading";
  const normalized = useMemo(() =>
    state.kind === "success" && state.mode === "detail"
      ? normalizeGolfCourse(state.response, state.source)
      : null, [state]);

  useEffect(() => {
    setSelectedHoleKey(normalized?.holes[0]?.source.sourceKey ?? "");
    setProjectHoles({});
    setProjectErrors([]);
    setProjectMessage("");
  }, [normalized]);

  const courseSourceKey = normalized?.courseCandidates[0]?.source.sourceKey ?? null;
  const holeKeys = normalized?.holes.map(({ source }) => source.sourceKey) ?? [];

  function holeProject(key: SourceKey): HoleStateV1 {
    return projectHoles[key] ?? { targets: [], carries: [] };
  }

  function setHoleProject(key: SourceKey, project: HoleStateV1) {
    setProjectHoles((current) => ({ ...current, [key]: project }));
    setProjectMessage("");
  }

  function exportProject() {
    if (!courseSourceKey) return;
    const project = emptyProject(courseSourceKey);
    project.holes = projectHoles;
    const blob = new Blob([serializeProject(project)], { type: PROJECT_MIME });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = PROJECT_FILENAME;
    document.body.appendChild(anchor);
    anchor.click();
    requestAnimationFrame(() => {
      URL.revokeObjectURL(url);
      anchor.remove();
    });
    setProjectMessage("Project export started.");
  }

  async function importProject(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !courseSourceKey) return;
    const hasState = Object.values(projectHoles).some((hole) => hole && (hole.targets.length > 0 || hole.carries.length > 0));
    if (hasState && !window.confirm("Importing will replace your current project. Continue?")) {
      event.target.value = "";
      importInput.current?.focus();
      return;
    }
    setProjectErrors([]);
    setProjectMessage("");
    if (file.size > PROJECT_MAX_BYTES) {
      setProjectErrors([{ code: "OUT_OF_RANGE", path: "$", message: "File exceeds 512 KiB limit." }]);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      setProjectErrors([{ code: "INVALID_JSON", path: "$", message: "File could not be read." }]);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    const validated = parseProjectText(text);
    if (!validated.ok) {
      setProjectErrors(validated.errors);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    const mismatches = projectMatchErrors(validated.project, courseSourceKey, holeKeys);
    if (mismatches.length > 0) {
      setProjectErrors(mismatches);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    setProjectHoles(validated.project.holes);
    setProjectMessage("Project imported successfully.");
    event.target.value = "";
    requestAnimationFrame(() => projectNotice.current?.focus());
  }

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
            <>
              <ul className="raw-list">
                {state.response.elements.map((element) => <li key={`${element.type}-${element.id}`}><code>{element.type}/{element.id}</code> {elementName(element)}</li>)}
              </ul>
              {normalized && normalized.holes.length > 0 ? (
                <section className="map-workspace" aria-labelledby="map-workspace-title">
                  <div className="map-selection">
                    <h3 id="map-workspace-title">Selected-hole map</h3>
                    <label>Hole
                      <select value={selectedHoleKey} onChange={(event) => setSelectedHoleKey(event.target.value)}>
                        {normalized.holes.map((hole) => (
                          <option key={hole.source.sourceKey} value={hole.source.sourceKey}>
                            {hole.number === null ? hole.source.sourceKey : `Hole ${hole.number}`}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  {normalized.holes.filter((hole) => hole.source.sourceKey === selectedHoleKey).map((hole) => (
                    <HoleMap key={hole.source.sourceKey} hole={hole} warnings={normalized.warnings} source={normalized.source}
                      project={holeProject(hole.source.sourceKey)}
                      onProjectChange={(project) => setHoleProject(hole.source.sourceKey, project)} />
                  ))}
                  <section className="project-io" aria-labelledby="project-io-title">
                    <h3 id="project-io-title">Local project file</h3>
                    <p className="hint">Project files contain user-authored targets and carry settings only. Import replaces current project state when valid.</p>
                    <div className="actions">
                      <button type="button" onClick={exportProject} disabled={!courseSourceKey}>Export project</button>
                      <label className="file-label">Import project file (.json)
                        <input ref={importInput} type="file" accept=".json,application/json" onChange={(event) => void importProject(event)} />
                      </label>
                    </div>
                    {projectMessage && <p ref={projectNotice} tabIndex={-1} aria-live="polite">{projectMessage}</p>}
                    {projectErrors.length > 0 && <div className="project-errors" role="alert">
                      <h4 ref={projectErrorHeading} tabIndex={-1}>Import failed - {projectErrors.length} error(s)</h4>
                      <ul>{projectErrors.map((error, index) => <li key={`${error.code}-${error.path}-${index}`}>
                        <strong>{error.code}</strong>: {error.message} <code>{error.path}</code>
                      </li>)}</ul>
                    </div>}
                  </section>
                </section>
              ) : <p className="map-empty" role="status">No normalized holes are available to render.</p>}
            </>
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
``````

<!-- END EXACT FILE 9/12: src/App.tsx -->

<!-- BEGIN EXACT FILE 10/12: src/HoleMap.tsx -->

### src/HoleMap.tsx

``````text
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type {
  Coordinate,
  Geometry,
  NormalizationWarning,
  NormalizedHole,
  SourceKey,
} from "./normalize";
import type { SourceMetadata } from "./overpass";
import { carryRings, teeOrigins } from "./carry";
import { generateProjectId, type CarryOriginV1, type HoleStateV1, type TargetV1 } from "./project";
import {
  INNER_MAX_X,
  INNER_MAX_Y,
  INNER_MIN_X,
  INNER_MIN_Y,
  LAYER_ORDER,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  clampPoint,
  createProjection,
  distanceMeters,
  formatDistance,
  geometryCoordinates,
  holeCoordinates,
  inverseProject,
  projectCoordinate,
  scaleBar,
  validCoordinate,
  warningsForHole,
  type Projection,
  type ViewportPoint,
} from "./map";

type HoleMapProps = {
  hole: NormalizedHole;
  warnings: NormalizationWarning[];
  source: SourceMetadata;
  project: HoleStateV1;
  onProjectChange: (project: HoleStateV1) => void;
};

type Measurement = { start: Coordinate | null; end: Coordinate | null };
type Mode = "measure" | "place-target" | "reposition-target";

function geometryElement(
  geometry: Geometry,
  projection: Projection,
  key: string,
  className: string,
) {
  const points = geometryCoordinates(geometry).map((coordinate) => projectCoordinate(projection, coordinate));
  if (geometry.type === "point") {
    return <circle key={key} className={className} cx={points[0].x} cy={points[0].y} r="7" />;
  }
  const value = points.map(({ x, y }) => `${x},${y}`).join(" ");
  return geometry.type === "line"
    ? <polyline key={key} className={className} points={value} />
    : <polygon key={key} className={className} points={value} />;
}

function warningText(warning: NormalizationWarning): string {
  return `${warning.code}: ${warning.affectedIdentity}`;
}

export function HoleMap({ hole, warnings, source, project, onProjectChange }: HoleMapProps) {
  const projection = useMemo(() => createProjection(holeCoordinates(hole)), [hole]);
  const [measurement, setMeasurement] = useState<Measurement>({ start: null, end: null });
  const [crosshair, setCrosshair] = useState<ViewportPoint>({ x: 400, y: 300 });
  const [announcement, setAnnouncement] = useState("");
  const [mode, setMode] = useState<Mode>("measure");
  const [repositionId, setRepositionId] = useState<string | null>(null);
  const [lastDeleted, setLastDeleted] = useState<TargetV1 | null>(null);
  const [carryErrors, setCarryErrors] = useState<Record<string, string>>({});
  const [targetErrors, setTargetErrors] = useState<Record<string, string>>({});
  const undoButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMeasurement({ start: null, end: null });
    setCrosshair({ x: 400, y: 300 });
    setMode("measure");
    setRepositionId(null);
    setLastDeleted(null);
    setAnnouncement("Selected hole changed. Measurement cleared.");
  }, [hole.source.sourceKey]);

  useEffect(() => {
    if (lastDeleted) requestAnimationFrame(() => undoButton.current?.focus());
  }, [lastDeleted]);

  if ("kind" in projection) {
    return <p className="map-empty" role="status">No renderable geometry is available for this selected hole.</p>;
  }

  const selectedWarnings = warningsForHole(hole, warnings);
  const bar = scaleBar(projection);
  const distance = measurement.start && measurement.end
    ? distanceMeters(measurement.start, measurement.end)
    : null;
  const distanceLabel = typeof distance === "number" ? formatDistance(distance) : null;

  function placeAnchor(point: ViewportPoint) {
    if ("kind" in projection) return;
    const coordinate = inverseProject(projection, clampPoint(point));
    setMeasurement((current) => {
      if (!current.start || current.end) {
        setAnnouncement(current.end ? "Measurement restarted. First point placed." : "First point placed.");
        return { start: coordinate, end: null };
      }
      const measured = distanceMeters(current.start, coordinate);
      setAnnouncement(typeof measured === "number" ? `Distance: ${formatDistance(measured)}.` : "Measurement failed.");
      return { start: current.start, end: coordinate };
    });
  }

  function confirmTarget(point: ViewportPoint) {
    if ("kind" in projection) return;
    const coordinate = inverseProject(projection, clampPoint(point));
    if (!validCoordinate(coordinate)) {
      setAnnouncement("Placement coordinates out of range.");
      return;
    }
    if (mode === "place-target") {
      if (project.targets.length >= 10) {
        setAnnouncement("At most ten targets are allowed per hole.");
        return;
      }
      const target: TargetV1 = {
        id: generateProjectId("target"),
        label: `Target ${project.targets.length + 1}`,
        ...coordinate,
      };
      onProjectChange({ ...project, targets: [...project.targets, target] });
      setLastDeleted(null);
      setMode("measure");
      setAnnouncement(`${target.label} added.`);
    } else if (mode === "reposition-target" && repositionId) {
      const target = project.targets.find(({ id }) => id === repositionId);
      onProjectChange({
        ...project,
        targets: project.targets.map((entry) => entry.id === repositionId ? { ...entry, ...coordinate } : entry),
      });
      setLastDeleted(null);
      setMode("measure");
      setRepositionId(null);
      setAnnouncement(`${target?.label ?? "Target"} repositioned.`);
    }
  }

  function pointerPoint(event: PointerEvent<SVGSVGElement>): ViewportPoint | null {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return null;
    const point = event.currentTarget.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const logical = point.matrixTransform(matrix.inverse());
    return clampPoint({ x: logical.x, y: logical.y });
  }

  function handlePointer(event: PointerEvent<SVGSVGElement>) {
    if (!event.isPrimary) return;
    const point = pointerPoint(event);
    if (!point) return;
    setCrosshair(point);
    if (mode === "measure") placeAnchor(point);
    else confirmTarget(point);
  }

  function clearMeasurement() {
    setMeasurement({ start: null, end: null });
    setCrosshair({ x: 400, y: 300 });
    setAnnouncement("Measurement cleared.");
  }

  function handleKey(event: KeyboardEvent<SVGSVGElement>) {
    const steps: Record<string, ViewportPoint> = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
    };
    const direction = steps[event.key];
    if (direction) {
      event.preventDefault();
      const step = event.shiftKey ? 20 : 4;
      setCrosshair((current) => clampPoint({
        x: current.x + direction.x * step,
        y: current.y + direction.y * step,
      }));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (mode === "measure") placeAnchor(crosshair);
      else confirmTarget(crosshair);
    } else if (event.key === "Escape") {
      event.preventDefault();
      if (mode === "measure") clearMeasurement();
      else {
        setMode("measure");
        setRepositionId(null);
        setAnnouncement("Target placement cancelled.");
      }
    }
  }

  const startPoint = measurement.start ? projectCoordinate(projection, measurement.start) : null;
  const endPoint = measurement.end ? projectCoordinate(projection, measurement.end) : null;
  const carryModels = project.carries.map((carry) => ({ carry, rings: carryRings(carry, hole, project.targets, projection) }));
  const clipId = `map-inner-clip-${hole.source.sourceKey.replace("/", "-")}`;
  const availableTees = teeOrigins(hole);

  function changeTargetLabel(id: string, label: string): boolean {
    const trimmed = label.trim();
    if (!trimmed || [...trimmed].length > 40) {
      setTargetErrors((current) => ({ ...current, [id]: "Use a label from 1 to 40 characters." }));
      return false;
    }
    onProjectChange({ ...project, targets: project.targets.map((target) => target.id === id ? { ...target, label: trimmed } : target) });
    setTargetErrors((current) => ({ ...current, [id]: "" }));
    setLastDeleted(null);
    return true;
  }

  function deleteTarget(id: string) {
    const target = project.targets.find((entry) => entry.id === id);
    if (!target) return;
    onProjectChange({ ...project, targets: project.targets.filter((entry) => entry.id !== id) });
    setLastDeleted(target);
    setAnnouncement(`${target.label} deleted. Undo available.`);
  }

  function addCarry() {
    if (project.carries.length >= 5) return;
    const origin: CarryOriginV1 | null = availableTees[0]
      ? { kind: "tee", sourceKey: availableTees[0].sourceKey }
      : project.targets[0] ? { kind: "target", targetId: project.targets[0].id } : null;
    if (!origin) {
      setAnnouncement("Add a target or load tee geometry before adding carry arcs.");
      return;
    }
    onProjectChange({ ...project, carries: [...project.carries, { id: generateProjectId("carry"), origin, distances: [150] }] });
    setLastDeleted(null);
    setAnnouncement("Carry arc added.");
  }

  function updateCarryOrigin(id: string, value: string) {
    const [kind, identity] = value.split(":");
    const origin: CarryOriginV1 = kind === "tee"
      ? { kind: "tee", sourceKey: identity as SourceKey }
      : { kind: "target", targetId: identity };
    onProjectChange({ ...project, carries: project.carries.map((carry) => carry.id === id ? { ...carry, origin } : carry) });
    setLastDeleted(null);
  }

  function updateCarryDistances(id: string, value: string): boolean {
    const distances = value.split(",").map((item) => Number(item.trim()));
    if (distances.length < 1 || distances.length > 5 || distances.some((distance) => !Number.isInteger(distance) || distance < 1 || distance > 700)
      || new Set(distances).size !== distances.length || distances.some((distance, index) => index > 0 && distance <= distances[index - 1])) {
      setCarryErrors((current) => ({ ...current, [id]: "Use 1 to 5 unique ascending whole-yard distances from 1 to 700." }));
      return false;
    }
    onProjectChange({ ...project, carries: project.carries.map((carry) => carry.id === id ? { ...carry, distances } : carry) });
    setCarryErrors((current) => ({ ...current, [id]: "" }));
    setLastDeleted(null);
    return true;
  }

  return (
    <section className="hole-map-panel" aria-labelledby="hole-map-title">
      <div className="map-heading">
        <div>
          <p className="eyebrow">Selected hole</p>
          <h3 id="hole-map-title">{hole.number === null ? hole.source.sourceKey : `Hole ${hole.number}`}</h3>
        </div>
        <button className="secondary" type="button" onClick={clearMeasurement}
          disabled={!measurement.start && !measurement.end}>Clear measurement</button>
      </div>
      <div className="map-tools" aria-label="Map interaction mode">
        <button className={mode === "measure" ? "" : "secondary"} type="button" onClick={() => setMode("measure")}>Measure</button>
        <button className={mode === "place-target" ? "" : "secondary"} type="button"
          onClick={() => { setMode("place-target"); setRepositionId(null); setAnnouncement("Place target mode."); }}>Add target</button>
      </div>
      <p className="map-instructions">{mode === "measure" ? "Click or tap two map points." : "Click, tap, or use the keyboard crosshair to place the target."} Keyboard: arrows move the crosshair, Enter or Space selects, Escape clears or cancels.</p>
      <svg className="hole-map" data-testid="hole-vector-map"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="xMidYMid meet"
        tabIndex={0} role="group" aria-label="Selected hole vector map and measurement surface"
        onPointerDown={handlePointer} onKeyDown={handleKey}>
        <title>Selected hole vector map</title>
        <desc>Blank vector-only OpenStreetMap-derived golf hole geometry with two-point measurement controls.</desc>
        <defs><clipPath id={clipId}><rect x={INNER_MIN_X} y={INNER_MIN_Y}
          width={INNER_MAX_X - INNER_MIN_X} height={INNER_MAX_Y - INNER_MIN_Y} /></clipPath></defs>
        <rect className="map-inner-boundary" x={INNER_MIN_X} y={INNER_MIN_Y}
          width={INNER_MAX_X - INNER_MIN_X} height={INNER_MAX_Y - INNER_MIN_Y} />
        {LAYER_ORDER.map((kind) => (
          <g key={kind} data-layer={kind} className={`map-layer layer-${kind}`}>
            {hole.features.filter((feature) => feature.kind === kind && feature.geometry)
              .map((feature) => geometryElement(feature.geometry!, projection, feature.source.sourceKey, "map-feature"))}
          </g>
        ))}
        <g data-layer="route" className="map-layer layer-route">
          {hole.route && geometryElement(hole.route, projection, hole.source.sourceKey, "map-route")}
        </g>
        <g data-layer="carry-arcs" className="map-layer layer-carry-arcs" clipPath={`url(#${clipId})`}>
          {carryModels.flatMap(({ carry, rings }) => Array.isArray(rings) ? rings.flatMap((ring) => {
            const label = ring.points.reduce((top, point) => point.y < top.y ? point : top);
            return [
              ...ring.segments.map((segment, index) => <polyline key={`${carry.id}-${ring.yards}-${index}`} data-carry-id={carry.id}
                className="carry-arc" points={segment.map(({ x, y }) => `${x},${y}`).join(" ")} />),
              <text key={`${carry.id}-${ring.yards}-label`} className="carry-label" x={label.x} y={label.y - 6}>
                {formatDistance(ring.yards * 0.9144)}
              </text>,
            ];
          }) : [])}
        </g>
        <g data-layer="targets" className="map-layer layer-targets">
          {project.targets.map((target) => {
            const point = projectCoordinate(projection, target);
            return <g key={target.id} className="target-marker" data-target-id={target.id} role="button" tabIndex={0}
              aria-label={`${target.label}, target`} onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => { event.stopPropagation(); setAnnouncement(`${target.label} selected.`); }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault(); event.stopPropagation(); setAnnouncement(`${target.label} selected.`);
                }
              }}>
              <circle className="target-hit" cx={point.x} cy={point.y} r="22" />
              <circle className="target-outer" cx={point.x} cy={point.y} r="8" />
              <circle className="target-inner" cx={point.x} cy={point.y} r="3" />
            </g>;
          })}
        </g>
        <g data-layer="measurement" className={`map-layer layer-measurement ${mode === "measure" ? "" : "inactive"}`}>
          {startPoint && endPoint && <line className="measurement-line" x1={startPoint.x} y1={startPoint.y} x2={endPoint.x} y2={endPoint.y} />}
          {startPoint && <circle className="measurement-anchor" cx={startPoint.x} cy={startPoint.y} r="8" />}
          {endPoint && <circle className="measurement-anchor" cx={endPoint.x} cy={endPoint.y} r="8" />}
          <path className="keyboard-crosshair" d={`M ${crosshair.x - 8} ${crosshair.y} H ${crosshair.x + 8} M ${crosshair.x} ${crosshair.y - 8} V ${crosshair.y + 8}`} />
        </g>
        <g className="scale-bar" aria-label={`Scale ${bar.label}`}>
          <line x1={INNER_MIN_X} y1={INNER_MAX_Y - 18} x2={INNER_MIN_X + bar.logicalLength} y2={INNER_MAX_Y - 18} />
          <text x={INNER_MIN_X} y={INNER_MAX_Y - 24}>{bar.label}</text>
        </g>
      </svg>
      <p className="measurement-result" aria-live="polite">
        {distanceLabel ? `Distance: ${distanceLabel}` : measurement.start ? "Select the second point." : "No measurement selected."}
      </p>
      <span className="sr-only" aria-live="polite">{announcement}</span>
      <section className="project-panel" aria-labelledby="targets-title">
        <div className="map-heading">
          <h4 id="targets-title">Targets</h4>
          {lastDeleted && <button ref={undoButton} className="secondary" type="button" onClick={() => {
            onProjectChange({ ...project, targets: [...project.targets, lastDeleted] });
            setAnnouncement(`${lastDeleted.label} restored.`);
            setLastDeleted(null);
          }}>Undo delete</button>}
        </div>
        {project.targets.length === 0 ? <p>No targets added.</p> : <ul className="target-list">
          {project.targets.map((target) => <li key={target.id}>
            <label>Target label<input key={`${target.id}-${target.label}`} defaultValue={target.label} maxLength={40}
              onBlur={(event) => { if (!changeTargetLabel(target.id, event.currentTarget.value)) event.currentTarget.value = target.label; }}
              onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} /></label>
            {targetErrors[target.id] && <p className="warning">{targetErrors[target.id]}</p>}
            <div className="actions">
              <button className="secondary" type="button" onClick={() => {
                setMode("reposition-target"); setRepositionId(target.id);
                setCrosshair(projectCoordinate(projection, target)); setAnnouncement(`Repositioning ${target.label}.`);
              }}>Reposition</button>
              <button className="secondary danger" type="button" onClick={() => deleteTarget(target.id)}>Delete</button>
            </div>
          </li>)}
        </ul>}
      </section>
      <section className="project-panel" aria-labelledby="carry-title">
        <div className="map-heading"><h4 id="carry-title">Carry arcs</h4>
          <button className="secondary" type="button" disabled={project.carries.length >= 5} onClick={addCarry}>Add carry</button></div>
        {availableTees.length === 0 && <p className="warning">No tee geometry available for this hole.</p>}
        {project.carries.length === 0 ? <p>No carry arcs added.</p> : <ul className="carry-list">
          {project.carries.map((carry) => {
            const model = carryModels.find((entry) => entry.carry.id === carry.id)?.rings;
            return <li key={carry.id}>
              <label>Origin<select value={`${carry.origin.kind}:${carry.origin.kind === "tee" ? carry.origin.sourceKey : carry.origin.targetId}`}
                onChange={(event) => updateCarryOrigin(carry.id, event.target.value)}>
                {availableTees.map((tee) => <option key={tee.sourceKey} value={`tee:${tee.sourceKey}`}>Tee {tee.sourceKey}</option>)}
                {project.targets.map((target) => <option key={target.id} value={`target:${target.id}`}>{target.label}</option>)}
              </select></label>
              <label>Distances in yards<input key={`${carry.id}-${carry.distances.join("-")}`} defaultValue={carry.distances.join(", ")}
                onBlur={(event) => { if (!updateCarryDistances(carry.id, event.currentTarget.value)) event.currentTarget.value = carry.distances.join(", "); }} /></label>
              {carryErrors[carry.id] && <p className="warning">{carryErrors[carry.id]}</p>}
              {!Array.isArray(model) && <p className="warning">Carry origin no longer available.</p>}
              {Array.isArray(model) && model.some(({ offMap }) => offMap) && <p className="warning">Part of this carry arc is outside the map view.</p>}
              <button className="secondary danger" type="button" onClick={() =>
                onProjectChange({ ...project, carries: project.carries.filter((entry) => entry.id !== carry.id) })}>Delete carry</button>
            </li>;
          })}
        </ul>}
      </section>
      {selectedWarnings.length > 0 && (
        <div className="map-warnings">
          <strong>Selected-hole data warnings</strong>
          <ul>{selectedWarnings.map((warning) => <li key={`${warning.code}-${warning.affectedIdentity}`}>{warningText(warning)}</li>)}</ul>
        </div>
      )}
      <details>
        <summary>All normalization warnings ({warnings.length})</summary>
        {warnings.length === 0 ? <p>No normalization warnings.</p>
          : <ul>{warnings.map((warning) => <li key={`${warning.code}-${warning.affectedIdentity}`}>{warningText(warning)}</li>)}</ul>}
      </details>
      <p className="attribution">Course data © OpenStreetMap contributors. <a href={source.copyrightUrl}>OpenStreetMap copyright and license</a>.</p>
    </section>
  );
}
``````

<!-- END EXACT FILE 10/12: src/HoleMap.tsx -->

<!-- BEGIN EXACT FILE 11/12: src/styles.css -->

### src/styles.css

``````text
:root {
  color: #17211b;
  background: #f4f3ed;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; }
button, input, select { font: inherit; }
button {
  border: 1px solid #2f6241; border-radius: 6px; background: #2f6241; color: white;
  cursor: pointer; font-weight: 750; min-height: 44px; padding: .7rem 1rem;
}
button.secondary { background: white; color: #2f6241; }
button:disabled { cursor: not-allowed; opacity: .55; }
button:focus-visible, input:focus-visible, select:focus-visible, summary:focus-visible, .hole-map:focus-visible { outline: 3px solid #d18b38; outline-offset: 2px; }

.shell { display: grid; gap: 1rem; margin: 0 auto; max-width: 78rem; min-height: 100vh; padding: clamp(1rem, 3vw, 2.5rem); }
header, .search-panel, .status, .results {
  background: #fffdf8; border: 1px solid #cbd5c5; border-radius: 8px; padding: clamp(1rem, 3vw, 2rem);
}
header { background: #1f3a2a; color: white; }
.eyebrow { color: #9d472b; font-size: .78rem; font-weight: 850; letter-spacing: .04em; margin: 0; text-transform: uppercase; }
header .eyebrow { color: #f5bc7e; }
h1 { font-size: clamp(2.5rem, 7vw, 5.5rem); line-height: .95; margin: .7rem 0; }
h2 { margin: 0 0 1rem; }
.lede { line-height: 1.5; margin: 0; max-width: 52rem; }
form { display: grid; gap: 1rem; }
label { display: grid; font-weight: 750; gap: .35rem; }
label span, .hint { color: #5b685d; font-size: .88rem; font-weight: 450; }
input, select { border: 1px solid #748276; border-radius: 5px; min-height: 44px; padding: .65rem; width: 100%; }
input[aria-invalid="true"] { border-color: #a1261b; }
fieldset { border: 1px solid #cbd5c5; border-radius: 6px; margin: 0; padding: 1rem; }
legend { font-weight: 800; padding: 0 .35rem; }
.coordinate-grid { display: grid; gap: .75rem; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.hint { margin: .75rem 0 0; }
.actions, .map-tools { display: flex; flex-wrap: wrap; gap: .75rem; }
.status { padding-block: 1rem; }
.status p { margin: .25rem 0 0; }
.status.error { border-color: #b85d52; }
.warning { color: #7a4b0e; font-weight: 700; }
.results { display: grid; gap: 1rem; }
.entity-summary { display: grid; gap: .75rem; grid-template-columns: repeat(3, 1fr); margin: 0; }
.entity-summary div { background: #edf2e9; border-radius: 6px; padding: .75rem; }
dt { color: #526054; font-size: .76rem; font-weight: 800; text-transform: uppercase; }
dd { font-weight: 750; margin: .15rem 0 0; }
.candidate-list, .raw-list { display: grid; gap: .6rem; list-style: none; margin: 0; padding: 0; }
.candidate-list li { align-items: center; border-top: 1px solid #dbe2d7; display: flex; gap: 1rem; justify-content: space-between; padding-top: .75rem; }
.candidate-list span { color: #5b685d; display: block; font-size: .85rem; margin-top: .2rem; }
.raw-list li { border-top: 1px solid #dbe2d7; padding-top: .6rem; }
summary { cursor: pointer; font-weight: 800; padding: .5rem 0; }
.diagnostics { display: grid; gap: .75rem; margin: .5rem 0 0; }
.diagnostics dd { overflow-wrap: anywhere; }
pre { background: #18221c; border-radius: 5px; color: #eef4ed; font-size: .8rem; overflow: auto; padding: .75rem; white-space: pre-wrap; }
.attribution { color: #4e5d50; font-size: .88rem; line-height: 1.5; margin: 0; }
.attribution a { color: #245e39; }
.map-workspace { border-top: 1px solid #dbe2d7; display: grid; gap: 1rem; padding-top: 1rem; }
.map-selection, .map-heading { align-items: end; display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; }
.map-selection h3, .map-heading h3 { margin: 0; }
.map-selection label { min-width: 12rem; }
.hole-map-panel { display: grid; gap: .75rem; }
.map-instructions, .measurement-result, .map-empty { margin: 0; }
.hole-map {
  background: #f8f7ef; border: 1px solid #748276; border-radius: 7px; display: block;
  height: auto; touch-action: none; width: 100%;
}
.map-inner-boundary { fill: #eef1e8; stroke: #667268; stroke-dasharray: 7 5; stroke-width: 1; }
.map-feature { stroke-linejoin: round; stroke-width: 2; }
.layer-vegetation { fill: #a9c49b; stroke: #3d6540; stroke-dasharray: 4 3; }
.layer-generic-water { fill: #a8d5e5; stroke: #245f78; stroke-dasharray: 6 3; }
.layer-golf-water { fill: #70b6d2; stroke: #174f69; stroke-width: 3; }
.layer-rough { fill: #c6d6ae; stroke: #667d4b; stroke-dasharray: 3 3; }
.layer-fairway { fill: #b8d59f; stroke: #41653d; }
.layer-bunker { fill: #ead9a0; stroke: #735e28; stroke-dasharray: 2 2; }
.layer-green { fill: #82b980; stroke: #285c35; stroke-width: 3; }
.layer-tee { fill: #d9e7bd; stroke: #244e30; stroke-width: 3; }
.layer-route { fill: none; stroke: #6d351d; stroke-dasharray: 8 5; stroke-width: 4; }
.layer-carry-arcs { fill: none; stroke: #713b89; stroke-dasharray: 12 5 3 5; stroke-width: 3; }
.carry-label { fill: #3f2050; font-size: 14px; font-weight: 800; paint-order: stroke; stroke: #fffdf8; stroke-width: 4; }
.target-hit { fill: transparent; }
.target-outer { fill: #fffdf8; stroke: #512c68; stroke-width: 4; }
.target-inner { fill: #512c68; }
.target-marker:focus-visible { outline: none; }
.target-marker:focus-visible .target-hit { fill: none; stroke: #d18b38; stroke-width: 4; }
.measurement-line { stroke: #932b20; stroke-dasharray: 6 4; stroke-width: 4; }
.measurement-anchor { fill: #fffdf8; stroke: #932b20; stroke-width: 4; }
.keyboard-crosshair { fill: none; stroke: #111; stroke-width: 3; }
.scale-bar line { stroke: #111; stroke-width: 5; }
.scale-bar text { fill: #111; font-size: 16px; font-weight: 800; }
.measurement-result { font-size: 1.1rem; font-weight: 800; }
.layer-measurement.inactive { opacity: .4; }
.map-warnings { border-left: 4px solid #a86619; padding-left: .75rem; }
.map-warnings ul, .hole-map-panel details ul { margin-bottom: 0; }
.project-panel, .project-io { background: #f5f7f1; border: 1px solid #cbd5c5; border-radius: 6px; display: grid; gap: .75rem; padding: 1rem; }
.project-panel h4, .project-io h3, .project-errors h4, .project-panel p { margin: 0; }
.target-list, .carry-list { display: grid; gap: .75rem; list-style: none; margin: 0; padding: 0; }
.target-list li, .carry-list li { background: #fffdf8; border: 1px solid #dbe2d7; border-radius: 5px; display: grid; gap: .75rem; padding: .75rem; }
.danger { border-color: #8b3028; color: #8b3028; }
.file-label { align-content: center; border: 1px solid #2f6241; border-radius: 6px; color: #2f6241; cursor: pointer; min-height: 44px; padding: .7rem 1rem; }
.file-label input { height: 1px; min-height: 0; opacity: 0; padding: 0; position: absolute; width: 1px; }
.file-label:focus-within { outline: 3px solid #d18b38; outline-offset: 2px; }
.project-errors { border-left: 4px solid #a1261b; padding-left: .75rem; }
.project-errors code { overflow-wrap: anywhere; }
.sr-only {
  clip: rect(0, 0, 0, 0); clip-path: inset(50%); height: 1px; overflow: hidden;
  position: absolute; white-space: nowrap; width: 1px;
}

@media (max-width: 700px) {
  .coordinate-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .candidate-list li { align-items: stretch; flex-direction: column; }
  .candidate-list button { width: 100%; }
  .map-heading button, .map-selection label { width: 100%; }
}
``````

<!-- END EXACT FILE 11/12: src/styles.css -->

<!-- BEGIN EXACT FILE 12/12: test/e2e/app.spec.ts -->

### test/e2e/app.spec.ts

``````text
import { expect, test, type Page, type Route } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import ctc006Detail from "../../fixtures/overpass/synthetic-golf-course-ctc006.json" with { type: "json" };

const endpoint = "https://overpass-api.de/api/interpreter";
const discovery = {
  elements: [
    {
      type: "way",
      id: 9000000001,
      bounds: { minlat: 35, minlon: -80, maxlat: 35.01, maxlon: -79.99 },
      tags: { leisure: "golf_course", name: "Synthetic Municipal Course" },
    },
    {
      type: "node",
      id: 9000000002,
      tags: { leisure: "golf_course", name: "Bounds unavailable" },
    },
  ],
};
const syntheticDetail = {
  elements: [
    discovery.elements[0],
    { type: "way", id: 9000000101, tags: { golf: "hole", ref: "1" } },
    { type: "node", id: 9000000201, tags: { golf: "tee", ref: "1" } },
  ],
};

async function isolateNetwork(page: Page, overpassHandler?: (route: Route) => Promise<void> | void) {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (["127.0.0.1", "localhost"].includes(url.hostname)) {
      await route.continue();
    } else if (route.request().url() === endpoint && overpassHandler) {
      await overpassHandler(route);
    } else {
      await route.abort("blockedbyclient");
      throw new Error(`Unexpected external request: ${route.request().url()}`);
    }
  });
}

async function fillBounds(page: Page) {
  await page.getByLabel("South").fill("35");
  await page.getByLabel("West").fill("-80");
  await page.getByLabel("North").fill("35.01");
  await page.getByLabel("East").fill("-79.99");
}

async function assertAxe(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
}

test("discovers candidates, loads detail explicitly, caches it, and shows attribution", async ({ page }) => {
  let discoveryRequests = 0;
  let detailRequests = 0;
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    expect(route.request().method()).toBe("POST");
    if (query.includes("purpose:golf-course-detail")) {
      detailRequests += 1;
      await route.fulfill({ json: syntheticDetail });
    } else {
      discoveryRequests += 1;
      await route.fulfill({ json: discovery });
    }
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("Synthetic.*");
  await page.getByRole("button", { name: "Search courses" }).click();

  await expect(page.getByText("Synthetic Municipal Course")).toBeVisible();
  await expect(page.getByRole("button", { name: "Detail unavailable" })).toBeDisabled();
  await expect(page.getByText(/Data © OpenStreetMap contributors/)).toBeVisible();
  expect(discoveryRequests).toBe(1);
  expect(detailRequests).toBe(0);

  await page.getByRole("button", { name: "Load raw detail" }).click();
  await expect(page.getByText(/raw detail entities loaded/)).toBeVisible();
  await expect(page.getByText("way/9000000001")).toBeVisible();
  expect(detailRequests).toBe(1);

  await page.reload();
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("Synthetic.*");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/raw discovery entities loaded from session cache/)).toBeVisible();
  expect(discoveryRequests).toBe(1);
});

test("makes no requests on keystrokes, blocks duplicate submit, and cancels explicitly", async ({ page }) => {
  let requests = 0;
  await isolateNetwork(page, async (route) => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({ json: discovery });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("No automatic query");
  expect(requests).toBe(0);

  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByRole("button", { name: "Search courses" })).toBeDisabled();
  expect(requests).toBe(1);
  await page.getByRole("button", { name: "Cancel request" }).click();
  await expect(page.getByText("Request cancelled.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Search courses" })).toBeFocused();
  await page.waitForTimeout(600);
  await expect(page.getByText("Request cancelled.")).toBeVisible();
  expect(requests).toBe(1);
});

test("validates input before requests and focuses the first invalid field", async ({ page }) => {
  let requests = 0;
  await isolateNetwork(page, () => { requests += 1; });
  await page.goto("/");
  await page.getByLabel("South").fill("1e2");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/Use decimal degrees/)).toBeVisible();
  await expect(page.getByLabel("South")).toBeFocused();
  expect(requests).toBe(0);
});

for (const scenario of [
  { name: "rate limit", status: 429, expected: /rate-limited/ },
  { name: "gateway timeout", status: 504, expected: /timed out/ },
  { name: "generic HTTP", status: 500, expected: /HTTP 500/ },
]) {
  test(`shows ${scenario.name} state without retry or failover`, async ({ page }) => {
    let requests = 0;
    await isolateNetwork(page, async (route) => {
      requests += 1;
      await route.fulfill({ status: scenario.status, body: "error" });
    });
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect(page.getByText(scenario.expected)).toBeVisible();
    if (scenario.status === 429) {
      await expect(page.locator(".status")).toHaveAttribute("aria-live", "assertive");
    }
    expect(requests).toBe(1);
  });
}

for (const scenario of [
  { name: "malformed JSON", body: "{", expected: /malformed JSON/ },
  { name: "invalid shape", body: '{"elements":[{"type":"area","id":1}]}', expected: /invalid entity shape/ },
  { name: "empty response", body: '{"elements":[]}', expected: /No discovery results/ },
]) {
  test(`shows ${scenario.name} state`, async ({ page }) => {
    await isolateNetwork(page, async (route) => route.fulfill({ body: scenario.body, contentType: "application/json" }));
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect(page.getByText(scenario.expected)).toBeVisible();
  });
}

test("shows a network failure without retry", async ({ page }) => {
  let requests = 0;
  await isolateNetwork(page, async (route) => {
    requests += 1;
    await route.abort("internetdisconnected");
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/Network request failed/)).toBeVisible();
  expect(requests).toBe(1);
});

test("supports keyboard flow, mobile layout, and axe scans across states", async ({ page }) => {
  let resolveRequest: (() => void) | undefined;
  await isolateNetwork(page, async (route) => {
    await new Promise<void>((resolve) => { resolveRequest = resolve; });
    await route.fulfill({ json: discovery });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await assertAxe(page);
  await fillBounds(page);
  await page.getByLabel("East").press("Enter");
  await expect(page.getByText("Loading discovery results.")).toBeVisible();
  await assertAxe(page);
  resolveRequest?.();
  await expect(page.getByText("Synthetic Municipal Course")).toBeVisible();
  await assertAxe(page);
  const detailButton = page.getByRole("button", { name: "Load raw detail" });
  await expect(detailButton).toBeVisible();
  expect(await detailButton.evaluate((button) => button.getBoundingClientRect().right <= window.innerWidth)).toBe(true);

  await page.getByLabel("South").fill("bad");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/Use decimal degrees/)).toBeVisible();
  await assertAxe(page);
});

test("accessibility oracle detects a known injected violation", async ({ page }) => {
  await isolateNetwork(page);
  await page.goto("/");
  await page.locator("main").evaluate((main) => {
    main.insertAdjacentHTML("beforeend", '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==">');
  });
  const results = await new AxeBuilder({ page }).include("main").analyze();
  expect(results.violations.map((violation) => violation.id)).toContain("image-alt");
});

test("renders and measures the selected hole with pointer, keyboard, mobile, and attribution support", async ({ page }) => {
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Load raw detail" }).click();

  const map = page.getByTestId("hole-vector-map");
  await expect(map).toBeVisible();
  await expect(page.getByText("Course data © OpenStreetMap contributors.")).toBeVisible();
  for (const layer of ["vegetation", "generic-water", "golf-water", "rough", "fairway", "bunker", "green", "tee", "route", "measurement"]) {
    await expect(map.locator(`[data-layer="${layer}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-layer="vegetation"] circle')).toHaveCount(0);
  expect(await map.evaluate((element) => element.getBoundingClientRect().right <= window.innerWidth)).toBe(true);

  await map.click({ position: { x: 60, y: 60 } });
  await expect(page.getByText("Select the second point.")).toBeVisible();
  await map.click({ position: { x: 250, y: 180 } });
  await expect(page.getByText(/^Distance: \d+ yd \/ \d+ m$/)).toBeVisible();
  await map.click({ position: { x: 150, y: 120 } });
  await expect(page.getByText("Select the second point.")).toBeVisible();

  await map.focus();
  await map.press("Escape");
  await expect(page.getByText("No measurement selected.")).toBeVisible();
  await map.press("ArrowRight");
  await map.press("Enter");
  await map.press("Shift+ArrowDown");
  await map.press("Enter");
  await expect(page.getByText(/^Distance: \d+ yd \/ \d+ m$/)).toBeVisible();
  await expect(map).toBeFocused();
  await assertAxe(page);
});

test("manages targets, carry arcs, and strict local project exchange", async ({ page }) => {
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Load raw detail" }).click();

  const map = page.getByTestId("hole-vector-map");
  await page.getByRole("button", { name: "Add target" }).click();
  await map.click({ position: { x: 180, y: 180 } });
  await expect(page.locator('input[value="Target 1"]')).toBeVisible();
  await expect(map.locator('[data-layer="targets"] [data-target-id]')).toHaveCount(1);

  await page.getByRole("button", { name: "Add carry" }).click();
  await expect(map.locator('[data-layer="carry-arcs"] [data-carry-id]')).toHaveCount(1);
  await expect(page.getByText(/outside the map view/)).toBeVisible();

  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("button", { name: "Undo delete" })).toBeVisible();
  await page.getByRole("button", { name: "Undo delete" }).click();
  await expect(page.locator('input[value="Target 1"]')).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export project" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("chart-the-course-project.json");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByLabel("Import project file (.json)").setInputFiles("fixtures/projects/synthetic-project-wrong-course.json");
  await expect(page.getByRole("alert")).toContainText("COURSE_MISMATCH");
  await expect(page.locator('input[value="Target 1"]')).toBeVisible();
  await expect(page.getByText("Course data © OpenStreetMap contributors.")).toBeVisible();
  await assertAxe(page);
});
``````

<!-- END EXACT FILE 12/12: test/e2e/app.spec.ts -->
