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
