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
