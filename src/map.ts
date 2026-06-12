import type {
  Coordinate,
  Geometry,
  NormalizationWarning,
  NormalizedHole,
} from "./normalize";

export const VIEWBOX_WIDTH = 800;
export const VIEWBOX_HEIGHT = 600;
export const VIEWBOX_PADDING = 40;
export const INNER_MIN_X = VIEWBOX_PADDING;
export const INNER_MAX_X = VIEWBOX_WIDTH - VIEWBOX_PADDING;
export const INNER_MIN_Y = VIEWBOX_PADDING;
export const INNER_MAX_Y = VIEWBOX_HEIGHT - VIEWBOX_PADDING;
export const INNER_WIDTH = INNER_MAX_X - INNER_MIN_X;
export const INNER_HEIGHT = INNER_MAX_Y - INNER_MIN_Y;
export const MIN_EXTENT_M = 20;
export const EARTH_RADIUS_M = 6_371_000;
export const YARDS_PER_METER = 1 / 0.9144;

export type ViewportPoint = { x: number; y: number };

export type Projection = {
  center: Coordinate;
  cosLat: number;
  scale: number;
  minX: number;
  minY: number;
  offsetX: number;
  offsetY: number;
};

export type ProjectionFailure =
  | { kind: "no-valid-coordinates" }
  | { kind: "near-pole" }
  | { kind: "invalid-projection" };

export type DistanceFailure = { kind: "invalid-coordinates" };

export type ScaleBar = {
  meters: number;
  logicalLength: number;
  label: string;
};

export const LAYER_ORDER = [
  "vegetation",
  "generic-water",
  "golf-water",
  "rough",
  "fairway",
  "bunker",
  "green",
  "tee",
] as const;

export function validCoordinate(value: unknown): value is Coordinate {
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

export function geometryCoordinates(geometry: Geometry): Coordinate[] {
  return geometry.type === "point" ? [geometry.coordinate] : geometry.coordinates;
}

export function holeCoordinates(hole: NormalizedHole): Coordinate[] {
  return [
    ...(hole.route ? geometryCoordinates(hole.route) : []),
    ...hole.features.flatMap(({ geometry }) => geometry ? geometryCoordinates(geometry) : []),
  ].filter(validCoordinate);
}

export function createProjection(coordinates: Coordinate[]): Projection | ProjectionFailure {
  const valid = coordinates.filter(validCoordinate);
  if (valid.length === 0) return { kind: "no-valid-coordinates" };

  const lats = valid.map(({ lat }) => lat);
  const lons = valid.map(({ lon }) => lon);
  const center = {
    lat: (Math.min(...lats) + Math.max(...lats)) / 2,
    lon: (Math.min(...lons) + Math.max(...lons)) / 2,
  };
  const cosLat = Math.cos(center.lat * Math.PI / 180);
  if (!Number.isFinite(cosLat) || Math.abs(cosLat) < 1e-6) return { kind: "near-pole" };

  const local = valid.map((coordinate) => toLocalMeters(coordinate, center, cosLat));
  let minX = Math.min(...local.map(({ x }) => x));
  let maxX = Math.max(...local.map(({ x }) => x));
  let minY = Math.min(...local.map(({ y }) => y));
  let maxY = Math.max(...local.map(({ y }) => y));
  [minX, maxX] = minimumExtent(minX, maxX);
  [minY, maxY] = minimumExtent(minY, maxY);

  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const scale = Math.min(INNER_WIDTH / spanX, INNER_HEIGHT / spanY);
  const offsetX = INNER_MIN_X + (INNER_WIDTH - spanX * scale) / 2;
  const offsetY = INNER_MIN_Y + (INNER_HEIGHT - spanY * scale) / 2;
  if (![scale, minX, minY, offsetX, offsetY].every(Number.isFinite) || scale <= 0) {
    return { kind: "invalid-projection" };
  }
  return { center, cosLat, scale, minX, minY, offsetX, offsetY };
}

function minimumExtent(minimum: number, maximum: number): [number, number] {
  const span = maximum - minimum;
  if (span >= MIN_EXTENT_M) return [minimum, maximum];
  const center = (minimum + maximum) / 2;
  return [center - MIN_EXTENT_M / 2, center + MIN_EXTENT_M / 2];
}

function toLocalMeters(coordinate: Coordinate, center: Coordinate, cosLat: number): ViewportPoint {
  return {
    x: (coordinate.lon - center.lon) * cosLat * Math.PI / 180 * EARTH_RADIUS_M,
    y: -(coordinate.lat - center.lat) * Math.PI / 180 * EARTH_RADIUS_M,
  };
}

export function projectCoordinate(projection: Projection, coordinate: Coordinate): ViewportPoint {
  const local = toLocalMeters(coordinate, projection.center, projection.cosLat);
  return {
    x: projection.offsetX + (local.x - projection.minX) * projection.scale,
    y: projection.offsetY + (local.y - projection.minY) * projection.scale,
  };
}

export function inverseProject(projection: Projection, point: ViewportPoint): Coordinate {
  const localX = (point.x - projection.offsetX) / projection.scale + projection.minX;
  const localY = (point.y - projection.offsetY) / projection.scale + projection.minY;
  return {
    lat: projection.center.lat - localY / EARTH_RADIUS_M * 180 / Math.PI,
    lon: projection.center.lon + localX / (projection.cosLat * EARTH_RADIUS_M) * 180 / Math.PI,
  };
}

export function clampPoint(point: ViewportPoint): ViewportPoint {
  return {
    x: Math.max(INNER_MIN_X, Math.min(INNER_MAX_X, point.x)),
    y: Math.max(INNER_MIN_Y, Math.min(INNER_MAX_Y, point.y)),
  };
}

export function distanceMeters(start: Coordinate, end: Coordinate): number | DistanceFailure {
  if (!validCoordinate(start) || !validCoordinate(end)) return { kind: "invalid-coordinates" };
  const lat1 = start.lat * Math.PI / 180;
  const lat2 = end.lat * Math.PI / 180;
  const deltaLat = (end.lat - start.lat) * Math.PI / 180;
  const deltaLon = (end.lon - start.lon) * Math.PI / 180;
  const raw = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  const a = Math.max(0, Math.min(1, raw));
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

export function formatDistance(meters: number): string {
  return `${Math.round(meters * YARDS_PER_METER)} yd / ${Math.round(meters)} m`;
}

export function scaleBar(projection: Projection): ScaleBar {
  const maximumMeters = 0.4 * INNER_WIDTH / projection.scale;
  const exponent = Math.floor(Math.log10(maximumMeters));
  const candidates: number[] = [];
  for (let power = exponent - 1; power <= exponent + 1; power += 1) {
    for (const multiplier of [1, 2, 5]) candidates.push(multiplier * 10 ** power);
  }
  // Defensive fallback; finite positive projection scales always yield a fitting candidate.
  const meters = candidates.filter((candidate) => candidate > 0 && candidate <= maximumMeters)
    .sort((left, right) => right - left)[0] ?? 1;
  return { meters, logicalLength: meters * projection.scale, label: formatDistance(meters) };
}

export function warningsForHole(
  hole: NormalizedHole,
  warnings: NormalizationWarning[],
): NormalizationWarning[] {
  const featureKeys = new Set(hole.features.map(({ source }) => source.sourceKey));
  return warnings.filter((warning) =>
    warning.sourceKey === hole.source.sourceKey
    || (hole.number !== null && warning.holeNumber === hole.number)
    || warning.refs.includes(hole.source.sourceKey)
    || warning.refs.some((ref) => featureKeys.has(ref)));
}
