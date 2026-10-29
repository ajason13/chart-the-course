import { describe, expect, it } from "vitest";
import { assembleMultipolygon } from "./multipolygon";
import { areaLocation, disjointFrom, routeAreaHit, strictlyInside } from "./simpleGeometry";
import type { Coordinate } from "./normalize";
import type { OverpassElement } from "./overpass";

const p = (x: number, y: number): Coordinate => ({ lon: x / 100000, lat: y / 100000 });
const box = (x = 0, y = 0, size = 10) => [p(x,y),p(x+size,y),p(x+size,y+size),p(x,y+size),p(x,y)];
const member = (ref: number, geometry: Coordinate[], role = "outer", nodes?: number[]) => ({ type: "way", ref, role, geometry, ...(nodes ? { nodes } : {}) });
const relation = (members: unknown[]): OverpassElement => ({ type: "relation", id: 1, tags: { type: "multipolygon" }, members });
const assemble = (members: unknown[]) => assembleMultipolygon(relation(members), new Map());
function shape(members: unknown[]) {
  const result = assemble(members);
  if (!("geometry" in result)) throw new Error(result.error);
  return result.geometry;
}

describe("bounded multipolygon assembly", () => {
  it("preserves interiors and multiple exteriors, independently of member/ring direction and ordering", () => {
    const members = [member(1, box()), member(2, box(3,3,4), "inner"), member(3, box(20,0,2))];
    const result = shape(members);
    expect(result.parts).toHaveLength(2);
    expect(result.parts.flatMap(p => p.interiors)).toHaveLength(1);
    expect(shape([...members].reverse().map(m => ({ ...m, geometry: [...m.geometry].reverse() })))).toEqual(result);
    expect(areaLocation(p(1,1), result)).toBe("inside");
    expect(areaLocation(p(5,5), result)).toBe("outside");
    expect(areaLocation(p(3,5), result)).toBe("boundary");
    expect(areaLocation(p(15,1), result)).toBe("outside");
    expect(areaLocation(p(21,1), result)).toBe("inside");
    expect(routeAreaHit([p(4,4),p(6,6)], result)).toBe("outside");
    expect(routeAreaHit([p(-1,5),p(11,5)], result)).toBe("inside");
    expect(routeAreaHit([p(3,3),p(7,3)], result)).toBe("boundary");
    // Filling a facility exclusion is not whole-geometry containment.
    expect(strictlyInside({ type: "polygon", coordinates: box(1,1,8) }, result)).toBe(false);
    expect(disjointFrom({ type: "polygon", coordinates: box(4,4,1) }, result)).toBe(true);
    expect(strictlyInside({ type: "line", coordinates: [p(1,5),p(9,5)] }, result)).toBe(false);
  });

  it("stitches uniquely by supplied nodes or exact coordinates, with no mutation", () => {
    const ring = box();
    const members = [member(1, ring.slice(0,3), "outer", [1,2,3]), member(2, [ring[0],ring[3],ring[2]], "outer", [1,4,3])];
    const before = structuredClone(members);
    expect(shape(members)).toEqual(shape([member(3, ring)]));
    expect(shape([...members].reverse())).toEqual(shape(members));
    expect(members).toEqual(before);
    expect(shape(members.map(({ nodes: _nodes, ...m }) => m))).toEqual(shape(members));
    expect(assemble([members[0], { ...members[1], nodes: [9,4,3] }])).toEqual({ error: "INVALID_RELATION_TOPOLOGY" });
    expect(assemble([members[0], { ...members[1], geometry: [p(0,1),ring[3],ring[2]] }])).toEqual({ error: "INVALID_RELATION_TOPOLOGY" });
    expect(assemble([member(1,[p(0,0),p(1,0)]),member(2,[p(1.00000001,0),p(0,0)])])).toEqual({ error: "INVALID_RELATION_TOPOLOGY" });
  });

  it("resolves complete supplied ways and rejects conflicting or duplicate evidence", () => {
    const way: OverpassElement = { type: "way", id: 4, geometry: box(), nodes: [1,2,3,4,1] };
    const parent = relation([{ type: "way", ref: 4, role: "outer" }]);
    expect(assembleMultipolygon(parent,new Map([[4,way]]))).toHaveProperty("geometry");
    expect(assembleMultipolygon(parent,new Map([[4,way]]),new Set(["way/4"]))).toHaveProperty("error");
    expect(assembleMultipolygon(relation([member(4,box(1,1))]),new Map([[4,way]]))).toHaveProperty("error");
    expect(assemble([member(1,box()),member(1,box())])).toHaveProperty("error");
  });

  it.each([
    [member(1,box()),{type:"way",ref:2,role:"inner"}], // partial
    [member(1,box()),member(2,box(3,3,4),"label")],
    [member(1,box()),{type:"relation",ref:2,role:"outer",geometry:box(20,0)}],
    [member(1,box()),member(2,box(10,0))], // touching
    [member(1,box()),member(2,box(5,5))], // crossing
    [member(1,box()),member(2,box(2,2,2))], // nested exteriors
    [member(1,box()),member(2,box(20,20,2),"inner")],
    [member(1,box()),member(2,box(0,2,2),"inner")], // touching interior
    [member(1,box()),member(2,box(2,2,6),"inner"),member(3,box(3,3,1),"inner")],
    [member(1,[p(0,0),p(10,10),p(0,10),p(5,0),p(0,0)])], // self crossing
    [member(1,[p(0,0),p(0,1)])], // open
    [member(1,[p(0,0),p(1,0)]),member(2,[p(1,0),p(0,0)]),member(3,[p(0,0),p(0,1)])], // branching
    [member(1,[{lat:0,lon:179},{lat:1,lon:-179},{lat:0,lon:-179},{lat:0,lon:179}])],
  ])("rejects whole malformed/unsupported topology %#", (...members) => {
    expect(assemble(members)).toEqual({ error: "INVALID_RELATION_TOPOLOGY" });
  });

  const circle = (vertices: number, x = 0) => {
    const points = Array.from({length:vertices},(_,i)=>p(x+10*Math.cos(i/vertices*2*Math.PI),10*Math.sin(i/vertices*2*Math.PI)));
    return [...points, points[0]];
  };
  it("accepts exactly 1000 fragments and rejects 1001 before graph work", () => {
    const ring = circle(1000);
    const members = ring.slice(1).map((end,i)=>member(i+1,[ring[i],end]));
    expect(assemble(members)).toHaveProperty("geometry");
    expect(assemble([...members,member(1001,box(30,0))])).toEqual({error:"RELATION_GEOMETRY_LIMIT"});
  });
  it("accepts exactly 256 rings and rejects 257 before topology work", () => {
    const members = Array.from({length:256},(_,i)=>member(i+1,box(i*20,0)));
    expect(assemble(members)).toHaveProperty("geometry");
    expect(assemble([...members,member(257,box(6000,0))])).toEqual({error:"RELATION_GEOMETRY_LIMIT"});
  });
  it("accepts exactly 10000 positions and rejects 10001 before topology work", () => {
    const members = Array.from({length:10},(_,i)=>member(i+1,circle(999,i*30)));
    expect(assemble(members)).toHaveProperty("geometry");
    members[0].geometry = circle(1000);
    expect(assemble(members)).toEqual({error:"RELATION_GEOMETRY_LIMIT"});
  },30000);
});
