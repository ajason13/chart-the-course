import type { Coordinate, NormalizedHole } from "./normalize";
import {
  YARDS_PER_METER,
  createProjection,
  holeCoordinates,
  inverseProject,
  projectCoordinate,
  validCoordinate,
  type Projection,
} from "./map";

export const INTERSECTION_EPSILON_M = 0.01;
export const STATION_VERTEX_EPSILON_M = 0.001;

type Point = { x: number; y: number };
type Segment = { start: Point; end: Point; length: number };
type Interval = { start: number; end: number };

export type FairwayWidthWarning =
  | "missing-fairway"
  | "invalid-target-line"
  | "carry-beyond-target-line"
  | "target-line-outside-fairway"
  | "irregular-fairway-polygon"
  | "irregular-fairway-intersections"
  | "tangent-fairway-boundary"
  | "unstable-line-fairway-overlap"
  | "unstable-degenerate-width"
  | "split-fairway";

export type FairwayWidthResult = {
  yards: number;
  warnings: FairwayWidthWarning[];
  widthMeters?: number;
  station?: Coordinate;
  start?: Coordinate;
  end?: Coordinate;
};

function localPoint(projection: Projection, coordinate: Coordinate): Point {
  const point = projectCoordinate(projection, coordinate);
  return { x: point.x / projection.scale, y: point.y / projection.scale };
}

function length(segment: Omit<Segment, "length">): number {
  return Math.hypot(segment.end.x - segment.start.x, segment.end.y - segment.start.y);
}

function routeStation(hole: NormalizedHole, projection: Projection, yards: number):
  | { station: Point; unit: Point }
  | { warning: "invalid-target-line" | "carry-beyond-target-line" } {
  if (!Number.isInteger(yards) || yards < 1 || !hole.route || hole.route.type !== "line") {
    return { warning: "invalid-target-line" };
  }
  const points = hole.route.coordinates.filter(validCoordinate).map((coordinate) => localPoint(projection, coordinate));
  if (points.length < 2 || points.some(({ x, y }) => !Number.isFinite(x) || !Number.isFinite(y))) return { warning: "invalid-target-line" };
  const segments = points.slice(1).map((end, index) => {
    const segment = { start: points[index], end };
    return { ...segment, length: length(segment) };
  }).filter((segment) => segment.length > INTERSECTION_EPSILON_M);
  if (segments.length === 0) return { warning: "invalid-target-line" };
  const requested = yards / YARDS_PER_METER;
  const total = segments.reduce((sum, segment) => sum + segment.length, 0);
  if (requested > total + INTERSECTION_EPSILON_M) return { warning: "carry-beyond-target-line" };
  const distance = Math.min(requested, total);
  let cumulative = 0;
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const endpoint = cumulative + segment.length;
    if (index < segments.length - 1 && Math.abs(distance - endpoint) <= STATION_VERTEX_EPSILON_M) {
      const next = segments[index + 1];
      return { station: next.start, unit: { x: (next.end.x - next.start.x) / next.length, y: (next.end.y - next.start.y) / next.length } };
    }
    if (distance <= endpoint || index === segments.length - 1) {
      const fraction = (distance - cumulative) / segment.length;
      return {
        station: { x: segment.start.x + (segment.end.x - segment.start.x) * fraction, y: segment.start.y + (segment.end.y - segment.start.y) * fraction },
        unit: { x: (segment.end.x - segment.start.x) / segment.length, y: (segment.end.y - segment.start.y) / segment.length },
      };
    }
    cumulative = endpoint;
  }
  return { warning: "invalid-target-line" };
}

function polygonIntervals(points: Point[], station: Point, unit: Point): { intervals: Interval[]; warnings: FairwayWidthWarning[] } {
  const warnings: FairwayWidthWarning[] = [];
  const distinct = new Set(points.map(({ x, y }) => `${x}:${y}`));
  if (points.length < 3 || distinct.size < 3 || points.some(({ x, y }) => !Number.isFinite(x) || !Number.isFinite(y))) {
    return { intervals: [], warnings: ["irregular-fairway-polygon"] };
  }
  const ring = points[0].x === points.at(-1)!.x && points[0].y === points.at(-1)!.y ? points.slice(0, -1) : points;
  const normal = { x: -unit.y, y: unit.x };
  const relative = ring.map((point) => {
    const delta = { x: point.x - station.x, y: point.y - station.y };
    return { q: delta.x * unit.x + delta.y * unit.y, t: delta.x * normal.x + delta.y * normal.y };
  });
  const crossings: number[] = [];
  let tangent = false;
  for (let index = 0; index < relative.length; index += 1) {
    const current = relative[index];
    const next = relative[(index + 1) % relative.length];
    if (Math.abs(current.q) <= INTERSECTION_EPSILON_M && Math.abs(next.q) <= INTERSECTION_EPSILON_M) {
      return { intervals: [], warnings: ["unstable-line-fairway-overlap"] };
    }
    if ((current.q > INTERSECTION_EPSILON_M && next.q < -INTERSECTION_EPSILON_M)
      || (current.q < -INTERSECTION_EPSILON_M && next.q > INTERSECTION_EPSILON_M)) {
      const fraction = current.q / (current.q - next.q);
      crossings.push(current.t + (next.t - current.t) * fraction);
    }
    if (Math.abs(current.q) <= INTERSECTION_EPSILON_M) {
      const previous = relative[(index - 1 + relative.length) % relative.length];
      if (Math.abs(previous.q) > INTERSECTION_EPSILON_M && Math.abs(next.q) > INTERSECTION_EPSILON_M) {
        if (Math.sign(previous.q) !== Math.sign(next.q)) crossings.push(current.t);
        else tangent = true;
      }
    }
  }
  const ordered = crossings.sort((a, b) => a - b);
  if (tangent) warnings.push("tangent-fairway-boundary");
  if (ordered.length % 2 !== 0) return { intervals: [], warnings: [...warnings, "irregular-fairway-intersections"] };
  const intervals = Array.from({ length: ordered.length / 2 }, (_, index) => ({ start: ordered[index * 2], end: ordered[index * 2 + 1] }));
  return { intervals, warnings };
}

function uniqueWarnings(warnings: FairwayWidthWarning[]): FairwayWidthWarning[] {
  return [...new Set(warnings)];
}

export function roundHalfUpNonnegative(value: number): number { return Math.floor(value + 0.5); }

export function estimateFairwayWidth(hole: NormalizedHole, yards: number): FairwayWidthResult {
  const projection = createProjection(holeCoordinates(hole));
  if ("kind" in projection) return { yards, warnings: ["invalid-target-line"] };
  const route = routeStation(hole, projection, yards);
  if ("warning" in route) return { yards, warnings: [route.warning] };
  const fairways = hole.features.flatMap((feature) => feature.kind === "fairway" && feature.geometry?.type === "polygon"
    ? [feature.geometry.coordinates] : []);
  if (fairways.length === 0) return { yards, warnings: ["missing-fairway"] };
  const collected = fairways.map((coordinates) => polygonIntervals(coordinates.map((coordinate) => localPoint(projection, coordinate)), route.station, route.unit));
  const warnings = collected.flatMap((entry) => entry.warnings);
  const intervals = collected.flatMap((entry) => entry.intervals).sort((a, b) => a.start - b.start);
  if (intervals.length === 0) return { yards, warnings: uniqueWarnings(warnings) };
  const union = intervals.reduce<Interval[]>((result, interval) => {
    const current = result.at(-1);
    if (current && interval.start - current.end <= INTERSECTION_EPSILON_M) current.end = Math.max(current.end, interval.end);
    else result.push({ ...interval });
    return result;
  }, []);
  const containing = union.find((interval) => interval.start <= INTERSECTION_EPSILON_M && interval.end >= -INTERSECTION_EPSILON_M);
  if (!containing) return { yards, warnings: uniqueWarnings([...warnings, "target-line-outside-fairway", ...(union.length > 1 ? ["split-fairway" as const] : [])]) };
  if (containing.end - containing.start <= INTERSECTION_EPSILON_M) return { yards, warnings: uniqueWarnings([...warnings, "unstable-degenerate-width"]) };
  const normal = { x: -route.unit.y, y: route.unit.x };
  const coordinate = (t: number) => inverseProject(projection, { x: (route.station.x + normal.x * t) * projection.scale, y: (route.station.y + normal.y * t) * projection.scale });
  return { yards, warnings: uniqueWarnings([...warnings, ...(union.length > 1 ? ["split-fairway" as const] : [])]), widthMeters: containing.end - containing.start, station: coordinate(0), start: coordinate(containing.start), end: coordinate(containing.end) };
}
