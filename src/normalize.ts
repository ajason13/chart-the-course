import type { OverpassElement, OverpassResponse, SourceMetadata } from "./overpass";

export type Coordinate = { lat: number; lon: number };
export type SourceKey = `${OverpassElement["type"]}/${number}`;

export type SourceRecord = {
  sourceKey: SourceKey;
  type: OverpassElement["type"];
  id: number;
  tags: Record<string, unknown>;
  rawNodes?: unknown;
  rawGeometry?: unknown;
  rawMembers?: unknown;
};

export type Geometry =
  | { type: "point"; coordinate: Coordinate }
  | { type: "line"; coordinates: Coordinate[] }
  | { type: "polygon"; coordinates: Coordinate[] };

export type FeatureKind =
  | "tee" | "green" | "fairway" | "bunker" | "rough"
  | "golf-water" | "generic-water" | "vegetation";

export type NormalizedFeature = {
  kind: FeatureKind;
  classifiedBy: readonly [string, string];
  source: SourceRecord;
  geometry: Geometry | null;
};

export type NormalizedHole = {
  number: number | null;
  par: number | null;
  source: SourceRecord;
  route: Geometry | null;
  features: NormalizedFeature[];
};

export type CourseCandidate = {
  classifiedBy: readonly ["leisure", "golf_course"];
  source: SourceRecord;
  geometry: Geometry | null;
};

export type WarningCode =
  | "AMBIGUOUS_FEATURE_REF"
  | "AMBIGUOUS_HOLE_ORDER"
  | "DUPLICATE_SOURCE_KEY"
  | "MALFORMED_CONSUMED_TAG"
  | "MISSING_GREEN"
  | "MISSING_OR_MALFORMED_GEOMETRY"
  | "MISSING_TEE"
  | "MULTIPLE_COURSE_CANDIDATES"
  | "UNSUPPORTED_RELATION"
  | "ZERO_COURSE_CANDIDATES";

export type NormalizationWarning = {
  code: WarningCode;
  severity: "error" | "warning";
  affectedIdentity: string;
  holeNumber?: number;
  sourceKey?: SourceKey;
  refs: SourceKey[];
};

export type NormalizationResult = {
  source: SourceMetadata;
  courseCandidates: CourseCandidate[];
  holes: NormalizedHole[];
  unassociatedFeatures: NormalizedFeature[];
  warnings: NormalizationWarning[];
};

type Classification =
  | { kind: "course"; classifiedBy: readonly ["leisure", "golf_course"] }
  | { kind: "hole"; classifiedBy: readonly ["golf", "hole"] }
  | { kind: FeatureKind; classifiedBy: readonly [string, string] };

const STRICT_POSITIVE_INTEGER = /^[1-9][0-9]*$/;
const GOLF_FEATURES = ["tee", "green", "fairway", "bunker", "rough"] as const;
const GOLF_WATER = ["water_hazard", "lateral_water_hazard"] as const;
const NATURAL_VEGETATION = ["wood", "tree", "tree_row", "scrub"] as const;
const LANDUSE_WATER = ["reservoir", "basin"] as const;

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sourceKey(element: OverpassElement): SourceKey {
  return `${element.type}/${element.id}`;
}

function canonical(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "number") {
    if (Number.isNaN(value)) return '"NaN"';
    if (value === Infinity) return '"Infinity"';
    if (value === -Infinity) return '"-Infinity"';
    return JSON.stringify(Object.is(value, -0) ? 0 : value);
  }
  if (typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => compareText(left, right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${canonical(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(String(value));
}

function tagsOf(element: OverpassElement): Record<string, unknown> {
  return element.tags && typeof element.tags === "object" && !Array.isArray(element.tags)
    ? element.tags
    : {};
}

function recordOf(element: OverpassElement): SourceRecord {
  return {
    sourceKey: sourceKey(element),
    type: element.type,
    id: element.id,
    tags: tagsOf(element),
    ...("nodes" in element ? { rawNodes: element.nodes } : {}),
    ...("geometry" in element ? { rawGeometry: element.geometry } : {}),
    ...("members" in element ? { rawMembers: element.members } : {}),
  };
}

function tag(element: OverpassElement, key: string): string | null {
  const value = tagsOf(element)[key];
  return typeof value === "string" ? value : null;
}

function oneOf<T extends readonly string[]>(value: string | null, values: T): value is T[number] {
  return value !== null && values.includes(value);
}

function classify(element: OverpassElement): Classification | null {
  const golf = tag(element, "golf");
  if (golf === "hole") return { kind: "hole", classifiedBy: ["golf", "hole"] };
  if (oneOf(golf, GOLF_FEATURES)) return { kind: golf, classifiedBy: ["golf", golf] };
  if (oneOf(golf, GOLF_WATER)) return { kind: "golf-water", classifiedBy: ["golf", golf] };
  if (tag(element, "leisure") === "golf_course") {
    return { kind: "course", classifiedBy: ["leisure", "golf_course"] };
  }
  if (tag(element, "natural") === "water") return { kind: "generic-water", classifiedBy: ["natural", "water"] };
  const waterway = tag(element, "waterway");
  if (waterway !== null) return { kind: "generic-water", classifiedBy: ["waterway", waterway] };
  const water = tag(element, "water");
  if (water !== null) return { kind: "generic-water", classifiedBy: ["water", water] };
  const landuse = tag(element, "landuse");
  if (oneOf(landuse, LANDUSE_WATER)) return { kind: "generic-water", classifiedBy: ["landuse", landuse] };
  const natural = tag(element, "natural");
  if (oneOf(natural, NATURAL_VEGETATION)) return { kind: "vegetation", classifiedBy: ["natural", natural] };
  if (landuse === "forest") return { kind: "vegetation", classifiedBy: ["landuse", "forest"] };
  return null;
}

function validCoordinate(value: unknown): value is Coordinate {
  if (!value || typeof value !== "object") return false;
  const coordinate = value as Record<string, unknown>;
  return typeof coordinate.lat === "number"
    && Number.isFinite(coordinate.lat)
    && coordinate.lat >= -90
    && coordinate.lat <= 90
    && typeof coordinate.lon === "number"
    && Number.isFinite(coordinate.lon)
    && coordinate.lon >= -180
    && coordinate.lon <= 180;
}

function isArea(classification: Classification): boolean {
  if (classification.kind === "course") return true;
  if (["tee", "green", "fairway", "bunker", "rough", "golf-water"].includes(classification.kind)) return true;
  if (classification.kind === "generic-water") return classification.classifiedBy[0] !== "waterway";
  if (classification.kind === "vegetation") return classification.classifiedBy[1] !== "tree"
    && classification.classifiedBy[1] !== "tree_row";
  return false;
}

function geometryOf(element: OverpassElement, classification: Classification): Geometry | null {
  if (element.type === "relation") return null;
  if (element.type === "node") {
    return validCoordinate(element) ? { type: "point", coordinate: { lat: element.lat, lon: element.lon } } : null;
  }
  const raw = element.geometry;
  if (!Array.isArray(raw) || !raw.every(validCoordinate)) return null;
  const coordinates = raw.map(({ lat, lon }) => ({ lat, lon }));
  if (isArea(classification)) {
    if (coordinates.length < 4) return null;
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    return first.lat === last.lat && first.lon === last.lon ? { type: "polygon", coordinates } : null;
  }
  return coordinates.length >= 2 ? { type: "line", coordinates } : null;
}

function strictInteger(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return STRICT_POSITIVE_INTEGER.test(trimmed) ? Number(trimmed) : null;
}

function warning(
  code: WarningCode,
  severity: NormalizationWarning["severity"],
  affectedIdentity: string,
  refs: SourceKey[] = [],
  holeNumber?: number,
  key?: SourceKey,
): NormalizationWarning {
  return {
    code,
    severity,
    affectedIdentity,
    refs: [...refs].sort(),
    ...(holeNumber === undefined ? {} : { holeNumber }),
    ...(key === undefined ? {} : { sourceKey: key }),
  };
}

function compareWarnings(left: NormalizationWarning, right: NormalizationWarning): number {
  return compareText(left.code, right.code)
    || (left.holeNumber ?? Number.POSITIVE_INFINITY) - (right.holeNumber ?? Number.POSITIVE_INFINITY)
    || compareText(left.sourceKey ?? "", right.sourceKey ?? "")
    || compareText(left.affectedIdentity, right.affectedIdentity);
}

function deduplicateElements(elements: OverpassElement[], warnings: NormalizationWarning[]): OverpassElement[] {
  const grouped = new Map<SourceKey, OverpassElement[]>();
  for (const element of elements) {
    const key = sourceKey(element);
    grouped.set(key, [...(grouped.get(key) ?? []), element]);
  }
  return [...grouped.entries()]
    .sort(([left], [right]) => compareText(left, right))
    .map(([key, records]) => {
      if (records.length > 1) warnings.push(warning("DUPLICATE_SOURCE_KEY", "error", key, records.map(sourceKey), undefined, key));
      return [...records].sort((left, right) => compareText(canonical(left), canonical(right)))[0];
    });
}

export function normalizeGolfCourse(response: OverpassResponse, source: SourceMetadata): NormalizationResult {
  const warnings: NormalizationWarning[] = [];
  const elements = deduplicateElements(response.elements, warnings);
  const courseCandidates: CourseCandidate[] = [];
  const holes: NormalizedHole[] = [];
  const features: Array<{ feature: NormalizedFeature; ref: number | null }> = [];

  for (const element of elements) {
    const classification = classify(element);
    if (!classification) continue;
    const sourceRecord = recordOf(element);
    const geometry = geometryOf(element, classification);
    if (element.type === "relation") {
      warnings.push(warning("UNSUPPORTED_RELATION", "warning", sourceRecord.sourceKey, [sourceRecord.sourceKey], undefined, sourceRecord.sourceKey));
    } else if (!geometry) {
      warnings.push(warning("MISSING_OR_MALFORMED_GEOMETRY", "error", sourceRecord.sourceKey, [sourceRecord.sourceKey], undefined, sourceRecord.sourceKey));
    }

    if (classification.kind === "course") {
      courseCandidates.push({ classifiedBy: classification.classifiedBy, source: sourceRecord, geometry });
      continue;
    }
    if (classification.kind === "hole") {
      const number = strictInteger(sourceRecord.tags.ref);
      const par = strictInteger(sourceRecord.tags.par);
      if ("par" in sourceRecord.tags && par === null) {
        warnings.push(warning("MALFORMED_CONSUMED_TAG", "warning", `${sourceRecord.sourceKey}:par`, [sourceRecord.sourceKey], undefined, sourceRecord.sourceKey));
      }
      holes.push({ number, par, source: sourceRecord, route: geometry, features: [] });
      continue;
    }
    if (!geometry && element.type !== "relation") continue;
    features.push({
      feature: { kind: classification.kind, classifiedBy: classification.classifiedBy, source: sourceRecord, geometry },
      ref: strictInteger(sourceRecord.tags.ref),
    });
  }

  courseCandidates.sort((left, right) => {
    const rank = (candidate: CourseCandidate) => candidate.geometry?.type === "polygon" ? 0 : candidate.source.type === "relation" ? 1 : 2;
    return rank(left) - rank(right) || compareText(left.source.sourceKey, right.source.sourceKey);
  });
  holes.sort((left, right) => (left.number ?? Number.POSITIVE_INFINITY) - (right.number ?? Number.POSITIVE_INFINITY)
    || compareText(left.source.sourceKey, right.source.sourceKey));

  if (courseCandidates.length === 0) warnings.push(warning("ZERO_COURSE_CANDIDATES", "error", "course-candidates"));
  if (courseCandidates.length > 1) {
    warnings.push(warning("MULTIPLE_COURSE_CANDIDATES", "warning", "course-candidates", courseCandidates.map(({ source: record }) => record.sourceKey)));
  }

  const holesByNumber = new Map<number, NormalizedHole[]>();
  for (const hole of holes) {
    if (hole.number !== null) holesByNumber.set(hole.number, [...(holesByNumber.get(hole.number) ?? []), hole]);
  }
  const duplicateNumbers = [...holesByNumber.entries()].filter(([, matches]) => matches.length > 1);
  if (duplicateNumbers.length > 0 || (holes.some(({ number }) => number !== null) && holes.some(({ number }) => number === null))) {
    warnings.push(warning("AMBIGUOUS_HOLE_ORDER", "warning", "holes", holes.map(({ source: record }) => record.sourceKey)));
  }

  const unassociatedFeatures: NormalizedFeature[] = [];
  for (const { feature, ref } of features.sort((left, right) => compareText(left.feature.source.sourceKey, right.feature.source.sourceKey))) {
    const matches = ref === null ? [] : holesByNumber.get(ref) ?? [];
    if (matches.length === 1) matches[0].features.push(feature);
    else {
      unassociatedFeatures.push(feature);
      if (ref !== null) {
        warnings.push(warning("AMBIGUOUS_FEATURE_REF", "warning", feature.source.sourceKey, [feature.source.sourceKey], undefined, feature.source.sourceKey));
      }
    }
  }

  for (const hole of holes) {
    hole.features.sort((left, right) => compareText(left.source.sourceKey, right.source.sourceKey));
    if (hole.number === null) continue;
    if (!hole.features.some(({ kind }) => kind === "tee")) {
      warnings.push(warning("MISSING_TEE", "error", hole.source.sourceKey, [hole.source.sourceKey], hole.number, hole.source.sourceKey));
    }
    if (!hole.features.some(({ kind }) => kind === "green")) {
      warnings.push(warning("MISSING_GREEN", "error", hole.source.sourceKey, [hole.source.sourceKey], hole.number, hole.source.sourceKey));
    }
  }

  const uniqueWarnings = new Map<string, NormalizationWarning>();
  for (const entry of warnings) uniqueWarnings.set(`${entry.code}:${entry.affectedIdentity}`, entry);

  return {
    source,
    courseCandidates,
    holes,
    unassociatedFeatures,
    warnings: [...uniqueWarnings.values()].sort(compareWarnings),
  };
}
