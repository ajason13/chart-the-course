import type { Coordinate, Geometry } from "./normalize";

// Planar predicates for bounded WGS84 simple geometry. No snapping or repair.
const cross = (a: Coordinate, b: Coordinate, c: Coordinate) =>
  (b.lon - a.lon) * (c.lat - a.lat) - (b.lat - a.lat) * (c.lon - a.lon);
export const samePoint = (a: Coordinate, b: Coordinate) => a.lat === b.lat && a.lon === b.lon;
const onSegment = (a: Coordinate, b: Coordinate, p: Coordinate) => cross(a, b, p) === 0
  && p.lon >= Math.min(a.lon, b.lon) && p.lon <= Math.max(a.lon, b.lon)
  && p.lat >= Math.min(a.lat, b.lat) && p.lat <= Math.max(a.lat, b.lat);
function touches(a: Coordinate, b: Coordinate, c: Coordinate, d: Coordinate): boolean {
  const abC = cross(a, b, c), abD = cross(a, b, d), cdA = cross(c, d, a), cdB = cross(c, d, b);
  return (abC * abD < 0 && cdA * cdB < 0)
    || onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b);
}
const coordinates = (g: Geometry) => g.type === "point" ? [g.coordinate] : g.coordinates;
const segments = (points: Coordinate[]) => points.slice(1).map((end, i) => [points[i], end] as const);

export function usableSimpleGeometry(g: Geometry | null): g is Geometry {
  if (!g) return false;
  const points = coordinates(g);
  if (points.some(p => !Number.isFinite(p.lat) || !Number.isFinite(p.lon)
    || Math.abs(p.lat) >= 89.9999 || Math.abs(p.lon) > 180)) return false;
  if (points.some(p => Math.abs(p.lon - points[0].lon) >= 180)) return false;
  if (g.type === "point") return true;
  if (points.length < 2 || segments(points).some(([a, b]) => samePoint(a, b))) return false;
  if (g.type === "line") return true;
  if (points.length < 4 || !samePoint(points[0], points.at(-1)!)) return false;
  const edges = segments(points);
  const origin = points[0];
  if (edges.reduce((sum, [a, b]) => sum + cross(origin, a, b), 0) === 0) return false;
  for (let i = 0; i < edges.length; i++) {
    // Adjacent backtracking edges overlap and are not a simple ring.
    const [a, b] = edges[i], c = edges[(i + 1) % edges.length][1];
    if (cross(a, b, c) === 0 && (onSegment(a, b, c) || onSegment(b, c, a))) return false;
    for (let j = i + 1; j < edges.length; j++) {
      if (j === i + 1 || (i === 0 && j === edges.length - 1)) continue;
      if (touches(...edges[i], ...edges[j])) return false;
    }
  }
  return true;
}

export function pointLocation(p: Coordinate, ring: Coordinate[]): "inside" | "outside" | "boundary" {
  let inside = false;
  for (const [a, b] of segments(ring)) {
    if (onSegment(a, b, p)) return "boundary";
    if ((a.lat > p.lat) !== (b.lat > p.lat)
      && p.lon < a.lon + (b.lon - a.lon) * (p.lat - a.lat) / (b.lat - a.lat)) inside = !inside;
  }
  return inside ? "inside" : "outside";
}
export function strictlyInside(g: Geometry, ring: Coordinate[]): boolean {
  return coordinates(g).every(p => pointLocation(p, ring) === "inside")
    && !segments(coordinates(g)).some(([a, b]) => segments(ring).some(([c, d]) => touches(a, b, c, d)));
}
export function disjointFrom(g: Geometry, ring: Coordinate[]): boolean {
  return coordinates(g).every(p => pointLocation(p, ring) === "outside")
    && !segments(coordinates(g)).some(([a, b]) => segments(ring).some(([c, d]) => touches(a, b, c, d)))
    && (g.type !== "polygon" || ring.every(p => pointLocation(p, g.coordinates) === "outside"));
}

// Split each route segment at polygon edges; test open intervals, not samples.
export function routeAreaHit(route: Coordinate[], ring: Coordinate[]): "inside" | "boundary" | "outside" {
  let boundary = false;
  for (const [a, b] of segments(route)) {
    if (samePoint(a, b)) continue;
    const cuts = [0, 1];
    for (const [c, d] of segments(ring)) {
      if (!touches(a, b, c, d)) continue;
      boundary = true;
      const denominator = (b.lon - a.lon) * (d.lat - c.lat) - (b.lat - a.lat) * (d.lon - c.lon);
      if (denominator !== 0) {
        const t = ((c.lon - a.lon) * (d.lat - c.lat) - (c.lat - a.lat) * (d.lon - c.lon)) / denominator;
        if (t >= 0 && t <= 1) cuts.push(t);
      } else {
        for (const p of [c, d]) if (onSegment(a, b, p)) cuts.push(
          b.lon !== a.lon ? (p.lon - a.lon) / (b.lon - a.lon) : (p.lat - a.lat) / (b.lat - a.lat));
      }
    }
    cuts.sort((x, y) => x - y);
    for (let i = 1; i < cuts.length; i++) {
      if (cuts[i] <= cuts[i - 1]) continue;
      const t = (cuts[i] + cuts[i - 1]) / 2;
      if (pointLocation({ lon: a.lon + (b.lon - a.lon) * t, lat: a.lat + (b.lat - a.lat) * t }, ring) === "inside") return "inside";
    }
  }
  return boundary ? "boundary" : "outside";
}
