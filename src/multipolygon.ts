import type { AreaPart, Coordinate, Geometry } from "./normalize";
import type { OverpassElement } from "./overpass";
import { disjointFrom, samePoint, strictlyInside, usableSimpleGeometry } from "./simpleGeometry.ts";

export const RELATION_LIMITS = { members: 1000, positions: 10000, rings: 256 } as const;
type Result = { geometry: Extract<Geometry, { type: "multipolygon" }> }
  | { error: "UNSUPPORTED_RELATION" | "INVALID_RELATION_TOPOLOGY" | "RELATION_GEOMETRY_LIMIT" };
type Fragment = { role: "outer" | "inner"; points: Coordinate[]; endpoints: [string, string] };
const key = (p: Coordinate) => `${p.lat},${p.lon}`;
const valid = (p: unknown): p is Coordinate => !!p && typeof p === "object"
  && Number.isFinite((p as Coordinate).lat) && Math.abs((p as Coordinate).lat) < 89.9999
  && Number.isFinite((p as Coordinate).lon) && Math.abs((p as Coordinate).lon) <= 180;
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const signature = (points: Coordinate[]) => points.map(key).join(";");
function canonicalRing(points: Coordinate[]): Coordinate[] {
  const ring = points.slice(0, -1);
  let start = 0;
  for (let i = 1; i < ring.length; i++) if (key(ring[i]) < key(ring[start])) start = i;
  const forward = ring.map((_, i) => ring[(start + i) % ring.length]);
  const reverse = ring.map((_, i) => ring[(start - i + ring.length) % ring.length]);
  const ordered = signature(forward) < signature(reverse) ? forward : reverse;
  return [...ordered, ordered[0]];
}

// No repair or cycle search: a usable endpoint graph has degree two everywhere.
export function assembleMultipolygon(relation: OverpassElement, ways: Map<number, OverpassElement>, conflicts: Set<string> = new Set()): Result {
  const invalid: Result = { error: "INVALID_RELATION_TOPOLOGY" };
  const limit: Result = { error: "RELATION_GEOMETRY_LIMIT" };
  if (relation.tags?.type !== "multipolygon") return { error: "UNSUPPORTED_RELATION" };
  if (!Array.isArray(relation.members) || !relation.members.length) return invalid;
  if (relation.members.length > RELATION_LIMITS.members) return limit;
  // Count supplied positions before coordinate validation, stitching or spatial predicates.
  let count = 0;
  for (const member of relation.members) {
    if (!object(member)) return invalid;
    const supplied = member.geometry ?? ways.get(Number(member.ref))?.geometry;
    if (!Array.isArray(supplied)) return invalid;
    count += supplied.length;
    if (count > RELATION_LIMITS.positions) return limit;
  }
  const fragments: Fragment[] = [];
  const seen = new Set<number>();
  const coordinateIds = new Map<string, number>();
  const idCoordinates = new Map<number, string>();
  for (const member of relation.members) {
    if (!object(member) || member.type !== "way" || !Number.isSafeInteger(member.ref)
      || (member.role !== "outer" && member.role !== "inner") || seen.has(member.ref as number)
      || conflicts.has(`way/${member.ref}`)) return invalid;
    seen.add(member.ref as number);
    const way = ways.get(member.ref as number);
    const supplied = member.geometry ?? way?.geometry;
    if (!Array.isArray(supplied) || supplied.length < 2 || !supplied.every(valid)) return invalid;
    const points = supplied.map(({ lat, lon }) => ({ lat, lon }));
    if (member.geometry !== undefined && way?.geometry !== undefined
      && (!Array.isArray(way.geometry) || !way.geometry.every(valid) || signature(way.geometry) !== signature(points))) return invalid;
    if (member.nodes !== undefined && way?.nodes !== undefined
      && JSON.stringify(member.nodes) !== JSON.stringify(way.nodes)) return invalid;
    const nodes = member.nodes ?? way?.nodes;
    if (nodes !== undefined) {
      if (!Array.isArray(nodes) || nodes.length !== points.length || !nodes.every(n => Number.isSafeInteger(n) && n > 0)) return invalid;
      for (let i = 0; i < nodes.length; i++) {
        const coordinate = key(points[i]), id = nodes[i] as number;
        if ((idCoordinates.has(id) && idCoordinates.get(id) !== coordinate)
          || (coordinateIds.has(coordinate) && coordinateIds.get(coordinate) !== id)) return invalid;
        coordinateIds.set(coordinate, id);
        idCoordinates.set(id, coordinate);
      }
    }
    fragments.push({ role: member.role, points, endpoints: [key(points[0]), key(points.at(-1)!)] });
  }
  const rings: { role: "outer" | "inner"; points: Coordinate[] }[] = [];
  for (const role of ["outer", "inner"] as const) {
    const open = fragments.filter(f => f.role === role && !samePoint(f.points[0], f.points.at(-1)!));
    for (const fragment of fragments.filter(f => f.role === role && samePoint(f.points[0], f.points.at(-1)!))) {
      rings.push({ role, points: canonicalRing(fragment.points) });
      if (rings.length > RELATION_LIMITS.rings) return limit;
    }
    const adjacency = new Map<string, number[]>();
    open.forEach((f, i) => f.endpoints.forEach(endpoint => adjacency.set(endpoint, [...(adjacency.get(endpoint) ?? []), i])));
    if ([...adjacency.values()].some(edges => edges.length !== 2)) return invalid;
    const used = new Set<number>();
    for (let i = 0; i < open.length; i++) {
      if (used.has(i)) continue;
      const points = [...open[i].points];
      used.add(i);
      const start = key(points[0]);
      while (key(points.at(-1)!) !== start) {
        const next = adjacency.get(key(points.at(-1)!))!.find(index => !used.has(index));
        if (next === undefined) return invalid;
        used.add(next);
        const fragment = open[next];
        const ordered = key(fragment.points[0]) === key(points.at(-1)!) ? fragment.points : [...fragment.points].reverse();
        points.push(...ordered.slice(1));
      }
      rings.push({ role, points: canonicalRing(points) });
      if (rings.length > RELATION_LIMITS.rings) return limit;
    }
  }
  if (!rings.length || rings.some(r => !usableSimpleGeometry({ type: "polygon", coordinates: r.points }))) return invalid;
  rings.sort((a, b) => signature(a.points).localeCompare(signature(b.points), "en"));
  const parts: AreaPart[] = rings.filter(r => r.role === "outer").map(r => ({ exterior: r.points, interiors: [] }));
  if (!parts.length) return invalid;
  for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
    if (!disjointFrom({ type: "polygon", coordinates: parts[i].exterior }, parts[j].exterior)) return invalid;
  }
  for (const ring of rings.filter(r => r.role === "inner")) {
    const containers = parts.filter(part => strictlyInside({ type: "polygon", coordinates: ring.points }, part.exterior));
    if (containers.length !== 1) return invalid;
    const part = containers[0];
    if (part.interiors.some(other => !disjointFrom({ type: "polygon", coordinates: ring.points }, other))) return invalid;
    part.interiors.push(ring.points);
  }
  const geometry = { type: "multipolygon" as const, parts };
  return usableSimpleGeometry(geometry) ? { geometry } : invalid;
}
