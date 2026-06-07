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
  if (values.north - values.south > 0.35 + Number.EPSILON) {
    return { ok: false, field: "north", message: "Latitude span cannot exceed 0.35 degrees." };
  }
  if (values.east - values.west > 0.35 + Number.EPSILON) {
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
