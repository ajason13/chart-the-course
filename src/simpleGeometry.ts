import type { AreaGeometry, AreaPart, Coordinate, Geometry } from "./normalize";

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
export const isAreaGeometry = (g: Geometry | null): g is AreaGeometry => g?.type === "polygon" || g?.type === "multipolygon";
export const areaParts = (g: AreaGeometry): AreaPart[] => g.type === "polygon"
  ? [{ exterior: g.coordinates, interiors: [] }] : g.parts;
export const geometryPaths = (g: Geometry): Coordinate[][] => g.type === "point" ? [[g.coordinate]]
  : g.type === "multipolygon" ? g.parts.flatMap(p => [p.exterior, ...p.interiors]) : [g.coordinates];
const coordinates = (g: Geometry) => geometryPaths(g).flat();
const edgesOf = (g: Geometry) => geometryPaths(g).flatMap(segments);
const segments = (points: Coordinate[]) => points.slice(1).map((end, i) => [points[i], end] as const);

export function usableSimpleGeometry(g: Geometry | null): g is Geometry {
  if (!g) return false;
  if (g.type === "multipolygon") {
    const parts = g.parts;
    const rings = parts.flatMap(p => [p.exterior, ...p.interiors]);
    if (!parts.length || rings.length > 256 || rings.some(r => !usableSimpleGeometry({ type: "polygon", coordinates: r }))) return false;
    const points = rings.flat();
    if (points.some(p => Math.abs(p.lon - points[0].lon) >= 180)) return false;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.interiors.some(r => !strictlyInside({ type: "polygon", coordinates: r }, part.exterior))) return false;
      for (let j = 0; j < part.interiors.length; j++) for (let k = j + 1; k < part.interiors.length; k++) {
        if (!disjointFrom({ type: "polygon", coordinates: part.interiors[j] }, part.interiors[k])) return false;
      }
      for (let j = i + 1; j < parts.length; j++) {
        if (!disjointFrom({ type: "polygon", coordinates: part.exterior }, parts[j].exterior)) return false;
      }
    }
    return true;
  }
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
type AreaInput = Coordinate[] | AreaGeometry;
const asArea = (area: AreaInput): AreaGeometry => Array.isArray(area) ? { type: "polygon", coordinates: area } : area;
export function areaLocation(p: Coordinate, area: AreaInput): "inside" | "outside" | "boundary" {
  for (const part of areaParts(asArea(area))) {
    const exterior = pointLocation(p, part.exterior);
    if (exterior === "boundary") return "boundary";
    if (exterior === "outside") continue;
    let excluded = false;
    for (const interior of part.interiors) {
      const location = pointLocation(p, interior);
      if (location === "boundary") return "boundary";
      if (location === "inside") excluded = true;
    }
    if (!excluded) return "inside";
  }
  return "outside";
}
const boundariesTouch = (g: Geometry, area: AreaGeometry) => {
  const edges = edgesOf(area);
  return edgesOf(g).some(([a, b]) => edges.some(([c, d]) => touches(a, b, c, d)));
};
export function strictlyInside(g: Geometry, input: AreaInput): boolean {
  const area = asArea(input);
  return coordinates(g).every(p => areaLocation(p, area) === "inside")
    && !boundariesTouch(g, area)
    // Vertex containment alone would allow an area to fill a facility's excluded interior.
    && (!isAreaGeometry(g) || areaParts(area).every(part => part.interiors.every(r => areaLocation(r[0], g) === "outside")));
}
export function disjointFrom(g: Geometry, input: AreaInput): boolean {
  const area = asArea(input);
  const left = coordinates(g), right = coordinates(area);
  const bounds = (points: Coordinate[]) => points.reduce((b, p) => ({
    minX: Math.min(b.minX,p.lon), maxX: Math.max(b.maxX,p.lon), minY: Math.min(b.minY,p.lat), maxY: Math.max(b.maxY,p.lat),
  }), {minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity});
  const a = bounds(left), b = bounds(right);
  if (a.maxX < b.minX || b.maxX < a.minX || a.maxY < b.minY || b.maxY < a.minY) return true;
  return left.every(p => areaLocation(p, area) === "outside")
    && !boundariesTouch(g, area)
    && (!isAreaGeometry(g) || areaParts(area).every(part => areaLocation(part.exterior[0], g) === "outside"));
}

// Split each route segment at polygon edges; test open intervals, not samples.
export function routeAreaHit(route: Coordinate[], area: AreaInput): "inside" | "boundary" | "outside" {
  let boundary = false;
  for (const [a, b] of segments(route)) {
    if (samePoint(a, b)) continue;
    const cuts = [0, 1];
    for (const [c, d] of edgesOf(asArea(area))) {
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
      if (areaLocation({ lon: a.lon + (b.lon - a.lon) * t, lat: a.lat + (b.lat - a.lat) * t }, area) === "inside") return "inside";
    }
  }
  return boundary ? "boundary" : "outside";
}
