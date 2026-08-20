import type { Coordinate, SourceKey } from "./normalize";

export const PROJECT_SCHEMA_V1 = "chart-the-course-project/v1";
export const PROJECT_SCHEMA = "chart-the-course-project/v2";
export const PROJECT_FILENAME = "chart-the-course-project.json";
export const PROJECT_MIME = "application/json";
export const PROJECT_MAX_BYTES = 524_288;
export const OSM_COPYRIGHT_URL = "https://www.openstreetmap.org/copyright";

export type TargetV1 = Coordinate & { id: string; label: string };
export type CarryOriginV1 =
  | { kind: "tee"; sourceKey: SourceKey }
  | { kind: "target"; targetId: string };
export type CarryV1 = { id: string; origin: CarryOriginV1; distances: number[] };
export type HoleStateV1 = { targets: TargetV1[]; carries: CarryV1[] };

export type ClubV2 = {
  id: string;
  label: string;
  carry: number;
  longitudinal: number;
  lateral: number;
};
export type ClubProfileV2 = { clubs: ClubV2[] };

type ProjectBase = {
  exportedAt: string;
  courseSourceKey: SourceKey;
  courseCopyrightUrl: typeof OSM_COPYRIGHT_URL;
  holes: Partial<Record<SourceKey, HoleStateV1>>;
};
export type ProjectV1 = ProjectBase & { schema: typeof PROJECT_SCHEMA_V1 };
export type ProjectV2 = ProjectBase & {
  schema: typeof PROJECT_SCHEMA;
  clubProfile: ClubProfileV2;
};

export type ValidationErrorCode =
  | "INVALID_JSON" | "UNSUPPORTED_VERSION" | "WRONG_TYPE" | "MISSING_FIELD"
  | "UNKNOWN_FIELD" | "DANGEROUS_KEY" | "INVALID_FORMAT" | "OUT_OF_RANGE"
  | "NON_FINITE" | "EMPTY_STRING" | "STRING_TOO_LONG" | "DUPLICATE_ID"
  | "DUPLICATE_LABEL" | "EMPTY_ARRAY" | "ARRAY_TOO_LONG" | "NON_INTEGER"
  | "NON_ASCENDING" | "NON_UNIQUE_DISTANCES" | "COURSE_MISMATCH" | "HOLE_MISMATCH";
export type ValidationError = { code: ValidationErrorCode; path: string; message: string };
export type ValidationResult =
  | { ok: true; project: ProjectV2 }
  | { ok: false; errors: ValidationError[] };

const SOURCE_KEY = /^(node|way|relation)\/[1-9][0-9]{0,18}$/;
const TARGET_ID = /^t-[0-9a-f]{12}$/;
const CARRY_ID = /^c-[0-9a-f]{12}$/;
const CLUB_ID = /^p-[0-9a-f]{12}$/;
const DANGEROUS = new Set(["__proto__", "constructor", "prototype"]);
const MAX_ERRORS = 20;

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
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
    for (const key of required) if (!Object.hasOwn(object, key)) this.add("MISSING_FIELD", `${path}.${key}`, "Required property is missing.");
    return object;
  }
}

function validSourceKey(value: unknown): value is SourceKey {
  return typeof value === "string" && SOURCE_KEY.test(value);
}
function validDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}/.test(value) && Number.isFinite(Date.parse(value));
}
function validateLabel(value: unknown, path: string, errors: Errors, normalize = false): string | null {
  if (typeof value !== "string") {
    errors.add("WRONG_TYPE", path, "Expected a string.");
    return null;
  }
  const trimmed = value.trim();
  const label = normalize ? trimmed.normalize("NFC") : trimmed;
  if (!label) errors.add("EMPTY_STRING", path, "Label must not be empty.");
  if ([...label].length > 40) errors.add("STRING_TOO_LONG", path, "Label must be 40 characters or fewer.");
  return label && [...label].length <= 40 ? label : null;
}
function validateNumber(value: unknown, path: string, minimum: number, maximum: number, errors: Errors): number | null {
  if (typeof value !== "number") {
    errors.add("WRONG_TYPE", path, "Expected a number.");
    return null;
  }
  if (!Number.isFinite(value)) errors.add("NON_FINITE", path, "Number must be finite.");
  else if (!Number.isInteger(value)) errors.add("NON_INTEGER", path, "Number must be an integer.");
  else if (value < minimum || value > maximum) errors.add("OUT_OF_RANGE", path, `Number must be between ${minimum} and ${maximum}.`);
  return Number.isFinite(value) && Number.isInteger(value) && value >= minimum && value <= maximum ? value : null;
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
    ? { id: object.id, label, lat, lon } : null;
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
    const validated = validateNumber(distance, `${path}.distances[${index}]`, 1, 700, errors);
    if (validated !== null) distances.push(validated);
  });
  if (new Set(distances).size !== distances.length) errors.add("NON_UNIQUE_DISTANCES", `${path}.distances`, "Carry distances must be unique.");
  if (distances.some((distance, index) => index > 0 && distance <= distances[index - 1])) errors.add("NON_ASCENDING", `${path}.distances`, "Carry distances must be ascending.");
  return typeof object.id === "string" && CARRY_ID.test(object.id) && origin && distances.length === object.distances.length
    && distances.length >= 1 && distances.length <= 5 && new Set(distances).size === distances.length
    && !distances.some((distance, index) => index > 0 && distance <= distances[index - 1])
    ? { id: object.id, origin, distances } : null;
}
function registerId(item: unknown, path: string, ids: Set<string>, errors: Errors) {
  const id = record(item)?.id;
  if (typeof id !== "string") return;
  if (ids.has(id)) errors.add("DUPLICATE_ID", path, `Duplicate project ID: ${id}.`);
  ids.add(id);
}
function validateHole(value: unknown, path: string, errors: Errors, ids: Set<string>): HoleStateV1 | null {
  const object = errors.shape(value, ["targets", "carries"], ["targets", "carries"], path);
  if (!object) return null;
  if (!Array.isArray(object.targets)) errors.add("WRONG_TYPE", `${path}.targets`, "Expected an array.");
  if (!Array.isArray(object.carries)) errors.add("WRONG_TYPE", `${path}.carries`, "Expected an array.");
  if (Array.isArray(object.targets) && object.targets.length > 10) errors.add("ARRAY_TOO_LONG", `${path}.targets`, "At most ten targets are allowed per hole.");
  if (Array.isArray(object.carries) && object.carries.length > 5) errors.add("ARRAY_TOO_LONG", `${path}.carries`, "At most five carry records are allowed per hole.");
  for (const item of [...(Array.isArray(object.targets) ? object.targets : []), ...(Array.isArray(object.carries) ? object.carries : [])]) registerId(item, path, ids, errors);
  const targets = Array.isArray(object.targets) ? object.targets.map((item, index) => validateTarget(item, `${path}.targets[${index}]`, errors)).filter((item): item is TargetV1 => item !== null) : [];
  const carries = Array.isArray(object.carries) ? object.carries.map((item, index) => validateCarry(item, `${path}.carries[${index}]`, errors)).filter((item): item is CarryV1 => item !== null) : [];
  return Array.isArray(object.targets) && Array.isArray(object.carries) && targets.length === object.targets.length
    && carries.length === object.carries.length && targets.length <= 10 && carries.length <= 5 ? { targets, carries } : null;
}
function validateClub(value: unknown, path: string, errors: Errors): ClubV2 | null {
  const object = errors.shape(value, ["id", "label", "carry", "longitudinal", "lateral"], ["id", "label", "carry", "longitudinal", "lateral"], path);
  if (!object) return null;
  if (typeof object.id !== "string" || !CLUB_ID.test(object.id)) errors.add("INVALID_FORMAT", `${path}.id`, "Invalid club ID.");
  const label = validateLabel(object.label, `${path}.label`, errors, true);
  const carry = validateNumber(object.carry, `${path}.carry`, 1, 700, errors);
  const longitudinal = validateNumber(object.longitudinal, `${path}.longitudinal`, 1, 200, errors);
  const lateral = validateNumber(object.lateral, `${path}.lateral`, 1, 200, errors);
  return typeof object.id === "string" && CLUB_ID.test(object.id) && label !== null && carry !== null && longitudinal !== null && lateral !== null
    ? { id: object.id, label, carry, longitudinal, lateral } : null;
}
function validateClubProfile(value: unknown, errors: Errors, ids: Set<string>): ClubProfileV2 | null {
  const object = errors.shape(value, ["clubs"], ["clubs"], "$.clubProfile");
  if (!object) return null;
  if (!Array.isArray(object.clubs)) {
    errors.add("WRONG_TYPE", "$.clubProfile.clubs", "Expected an array.");
    return null;
  }
  if (object.clubs.length > 14) errors.add("ARRAY_TOO_LONG", "$.clubProfile.clubs", "At most fourteen clubs are allowed.");
  object.clubs.forEach((club, index) => registerId(club, `$.clubProfile.clubs[${index}]`, ids, errors));
  const clubs = object.clubs.map((club, index) => validateClub(club, `$.clubProfile.clubs[${index}]`, errors)).filter((club): club is ClubV2 => club !== null);
  const labels = new Set<string>();
  clubs.forEach((club, index) => {
    const comparison = club.label.toLowerCase();
    if (labels.has(comparison)) errors.add("DUPLICATE_LABEL", `$.clubProfile.clubs[${index}].label`, `Duplicate club label: ${club.label}.`);
    labels.add(comparison);
  });
  return clubs.length === object.clubs.length && clubs.length <= 14 && labels.size === clubs.length ? { clubs } : null;
}

export function validateProjectFile(raw: unknown): ValidationResult {
  const rawRecord = record(raw);
  const schema = rawRecord?.schema;
  if (schema !== PROJECT_SCHEMA && schema !== PROJECT_SCHEMA_V1) {
    return { ok: false, errors: [{ code: "UNSUPPORTED_VERSION", path: "$.schema", message: `Only ${PROJECT_SCHEMA} and ${PROJECT_SCHEMA_V1} are supported.` }] };
  }
  const errors = new Errors();
  const isV1 = schema === PROJECT_SCHEMA_V1;
  const allowed = isV1 ? ["schema", "exportedAt", "courseSourceKey", "courseCopyrightUrl", "holes"]
    : ["schema", "exportedAt", "courseSourceKey", "courseCopyrightUrl", "holes", "clubProfile"];
  const object = errors.shape(raw, allowed, allowed, "$");
  if (!object) return { ok: false, errors: errors.values };
  if (!validDate(object.exportedAt)) errors.add("INVALID_FORMAT", "$.exportedAt", "Invalid export timestamp.");
  if (!validSourceKey(object.courseSourceKey)) errors.add("INVALID_FORMAT", "$.courseSourceKey", "Invalid course source key.");
  if (object.courseCopyrightUrl !== OSM_COPYRIGHT_URL) errors.add("INVALID_FORMAT", "$.courseCopyrightUrl", "Invalid copyright URL.");
  const holesObject = errors.shape(object.holes, Object.keys(record(object.holes) ?? {}), [], "$.holes");
  const holes: Partial<Record<SourceKey, HoleStateV1>> = {};
  const ids = new Set<string>();
  const clubProfile = isV1 ? { clubs: [] } : validateClubProfile(object.clubProfile, errors, ids);
  if (holesObject) for (const key of Object.keys(holesObject).sort()) {
    if (!validSourceKey(key)) errors.add("INVALID_FORMAT", `$.holes.${key}`, "Invalid hole source key.");
    else {
      const hole = validateHole(holesObject[key], `$.holes.${key}`, errors, ids);
      if (hole) holes[key] = hole;
    }
  }
  return errors.values.length === 0 && validDate(object.exportedAt) && validSourceKey(object.courseSourceKey)
    && object.courseCopyrightUrl === OSM_COPYRIGHT_URL && clubProfile
    ? { ok: true, project: { schema: PROJECT_SCHEMA, exportedAt: object.exportedAt, courseSourceKey: object.courseSourceKey, courseCopyrightUrl: OSM_COPYRIGHT_URL, holes, clubProfile } }
    : { ok: false, errors: errors.values };
}
export function parseProjectText(text: string): ValidationResult {
  try { return validateProjectFile(JSON.parse(text) as unknown); }
  catch { return { ok: false, errors: [{ code: "INVALID_JSON", path: "$", message: "File is not valid JSON." }] }; }
}
export function projectMatchErrors(project: ProjectV2, courseSourceKey: SourceKey, holeKeys: SourceKey[]): ValidationError[] {
  const errors: ValidationError[] = [];
  if (project.courseSourceKey !== courseSourceKey) errors.push({ code: "COURSE_MISMATCH", path: "$.courseSourceKey", message: `Project course ${project.courseSourceKey} does not match loaded course ${courseSourceKey}.` });
  const known = new Set(holeKeys);
  for (const key of Object.keys(project.holes).sort()) if (!known.has(key as SourceKey)) errors.push({ code: "HOLE_MISMATCH", path: `$.holes.${key}`, message: `Project hole ${key} is not available in the loaded course.` });
  return errors.slice(0, MAX_ERRORS);
}
export function emptyProject(courseSourceKey: SourceKey, exportedAt = new Date().toISOString()): ProjectV2 {
  return { schema: PROJECT_SCHEMA, exportedAt, courseSourceKey, courseCopyrightUrl: OSM_COPYRIGHT_URL, holes: {}, clubProfile: { clubs: [] } };
}
export function serializeProject(project: ProjectV2): string {
  const holes = Object.fromEntries(Object.entries(project.holes).sort(([left], [right]) => left.localeCompare(right)));
  return `${JSON.stringify({ schema: PROJECT_SCHEMA, exportedAt: project.exportedAt, courseSourceKey: project.courseSourceKey,
    courseCopyrightUrl: project.courseCopyrightUrl, holes, clubProfile: project.clubProfile }, null, 2)}\n`;
}
export function generateProjectId(kind: "target" | "carry" | "club"): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const value = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${kind === "target" ? "t" : kind === "carry" ? "c" : "p"}-${value}`;
}
