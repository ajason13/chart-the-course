import { normalizeGolfCourse } from "./normalize";
import type { OverpassElement, OverpassResponse, SourceMetadata } from "./overpass";
import { createProjection, holeCoordinates } from "./map";
import { teeOrigins } from "./carry";
import { estimateFairwayWidth } from "./fairwayWidth";

const source: SourceMetadata = { query: "synthetic", endpoint: "https://example.invalid", bbox: "0,0,20,20", completedAt: "2026-10-29T00:00:00Z", copyrightUrl: "https://www.openstreetmap.org/copyright" };
const p = (lon: number, lat: number) => ({ lon, lat });
const ring = (x: number, y: number, X: number, Y: number) => [p(x,y),p(X,y),p(X,Y),p(x,Y),p(x,y)];
const way = (id: number, tags: Record<string,string>, geometry: ReturnType<typeof p>[]): OverpassElement => ({type:"way",id,tags,geometry});
const facility = way(1, {leisure:"golf_course"}, ring(0,0,10,10));
const route = way(2, {golf:"hole",ref:"1"}, [p(2,2),p(8,8)]);
const feature = (id: number, golf: string, ref?: string) => way(id,{golf,...(ref === undefined ? {} : {ref})},ring(1,1,9,9));
const normalize = (elements: OverpassElement[], key = "way/1" as const) => normalizeGolfCourse({elements},source,key);

describe("selected facility association contract", () => {
  it("scopes before refs, excludes the research neighbor leak and is element-order invariant", () => {
    const neighbor = way(10,{leisure:"golf_course"},ring(11,0,20,10));
    const neighborTee = way(11,{golf:"tee",ref:"1"},ring(12,1,13,2));
    for (const extra of [[],[way(12,{golf:"hole",ref:"1"},[p(12,2),p(18,8)])]]) {
      const elements = [facility,route,feature(3,"tee","1"),neighbor,neighborTee,...extra];
      const result = normalize(elements);
      expect(result.holes.map(h=>h.source.sourceKey)).toEqual(["way/2"]);
      expect(result.holes[0].features.map(f=>f.source.sourceKey)).toEqual(["way/3"]);
      expect(result.unassociatedFeatures.map(f=>f.source.sourceKey)).toContain("way/11");
      expect(normalize([...elements].reverse())).toEqual(result);
      expect(normalizeGolfCourse({elements},source,"way/10").holes.map(h=>h.source.sourceKey)).toEqual(extra.length ? ["way/12"] : []);
    }
  });

  it("keeps duplicate refs unresolved and separates invalid, unmatched and absent refs", () => {
    const elements = [facility,route,way(4,{golf:"hole",ref:"1"},[p(3,2),p(7,8)]),
      feature(5,"fairway","1"),feature(6,"fairway","01"),feature(7,"fairway","9"),feature(8,"fairway")];
    const result = normalize(elements);
    expect(result.holes.every(h=>h.features.length === 0)).toBe(true);
    expect(result.warnings.map(w=>w.code)).toEqual(expect.arrayContaining(["AMBIGUOUS_FEATURE_REF","INVALID_FEATURE_REF","UNMATCHED_FEATURE_REF","MULTIPLE_FEATURE_CANDIDATES"]));
    expect(result.holes[0].displayFeatures?.map(d=>[d.feature.source.sourceKey,d.basis,d.candidateHoleKeys])).toEqual([
      ["way/5","course-context",[]],["way/6","course-context",[]],["way/7","course-context",[]],
      ["way/8","shared-candidate",["way/2","way/4"]],
    ]);
    expect(normalize(elements.reverse())).toEqual(result);
  });

  it("shows missing-ref candidates without changing analytic input or projection bounds", () => {
    const raw = [facility,route,feature(3,"tee"),feature(4,"green"),feature(5,"fairway"),feature(6,"water_hazard")];
    const snapshot = structuredClone(raw);
    const result = normalize(raw);
    const hole = result.holes[0];
    expect(hole.features).toEqual([]);
    expect(hole.displayFeatures?.map(d=>d.basis)).toEqual(["inferred-candidate","inferred-candidate","inferred-candidate","course-context"]);
    expect(teeOrigins(hole)).toEqual([]);
    expect(estimateFairwayWidth(hole,1).warnings).toContain("missing-fairway");
    expect(createProjection(holeCoordinates(hole))).toEqual(createProjection(holeCoordinates(normalize([facility,route]).holes[0])));
    expect(raw).toEqual(snapshot);
    // Raw geometry/tags survive; derived labels do not rewrite evidence.
    expect(hole.displayFeatures?.[0].feature.source.rawGeometry).toEqual(raw[2].geometry);
  });

  it("requires exact point tees, endpoint interior hits, and positive-length fairway interior", () => {
    const horizontal = way(2,{golf:"hole",ref:"1"},[p(2,5),p(8,5)]);
    const result = normalize([facility,horizontal,
      {type:"node",id:3,lat:5,lon:2,tags:{golf:"tee"}},
      {type:"node",id:4,lat:5,lon:2.00001,tags:{golf:"tee"}},
      way(5,{golf:"green"},ring(8,4,9,6)), // endpoint on edge
      way(6,{golf:"fairway"},ring(3,4,4,6)), // crossings, neither endpoint inside
      way(7,{golf:"fairway"},ring(3,5,4,6)), // boundary interval only
      way(8,{golf:"fairway"},ring(8,5,9,6)), // corner only
    ]);
    expect(result.holes[0].displayFeatures?.map(d=>[d.feature.source.sourceKey,d.basis])).toEqual([
      ["node/3","inferred-candidate"],["node/4","course-context"],["way/5","course-context"],
      ["way/6","inferred-candidate"],["way/7","course-context"],["way/8","course-context"],
    ]);
    expect(result.warnings.filter(w=>w.code === "BOUNDARY_ONLY_CANDIDATE")).toHaveLength(3);
  });

  it("withholds absent, unsupported, overlapping, touched and conflicted scope", () => {
    for (const boundaries of [[], [{...facility,geometry:undefined}],
      [facility,way(10,{leisure:"golf_course"},ring(1,1,9,9))],
      // Partial overlap and boundary touch invalidate even an exclusive corner.
      [facility,way(10,{leisure:"golf_course"},ring(9,9,15,15))],
      [facility,way(10,{leisure:"golf_course"},ring(10,0,15,10))],
      [facility,{...facility,geometry:ring(0,0,11,11)}],
      [facility,{type:"relation",id:10,tags:{leisure:"golf_course",type:"multipolygon"},members:[]} as OverpassElement],
    ]) {
      const result = normalize([...boundaries,route,feature(3,"tee","1")]);
      expect(result.holes).toEqual([]);
      expect(result.unassociatedFeatures).toHaveLength(1);
      expect(result.warnings.some(w=>["COURSE_SCOPE_UNAVAILABLE","HOLE_SCOPE_UNRESOLVED"].includes(w.code))).toBe(true);
    }
    const result = normalize([facility,route,way(3,{golf:"tee",ref:"1"},ring(0,1,3,3))]);
    expect(result.holes[0].features).toEqual([]);
    expect(result.warnings.some(w=>w.code === "FEATURE_SCOPE_UNRESOLVED")).toBe(true);
  });

  it("tests entire segments and polygon interiors rather than bbox or vertex containment", () => {
    const concave = way(1,{leisure:"golf_course"},[p(0,0),p(10,0),p(10,10),p(6,10),p(6,4),p(4,4),p(4,10),p(0,10),p(0,0)]);
    const crossing = way(2,{golf:"hole",ref:"1"},[p(2,8),p(8,8)]);
    expect(normalize([concave,crossing]).holes).toEqual([]);
    const island = way(10,{leisure:"golf_course"},ring(4,4,6,6));
    const result = normalize([facility,way(2,{golf:"hole",ref:"1"},[p(1,1),p(2,2)]),island,feature(3,"fairway","1")]);
    expect(result.holes).toEqual([]); // selected boundary encloses another facility
    expect(result.warnings.map(w=>w.code)).toContain("COURSE_SCOPE_UNAVAILABLE");
  });

  it("retains unsupported memberships and relations as raw evidence without assignment", () => {
    const response: OverpassResponse = {elements:[facility,route,
      {type:"relation",id:20,tags:{type:"sport",golf:"course"},members:[{type:"way",ref:2,role:"hole"}]},
      {type:"relation",id:21,tags:{type:"multipolygon",golf:"green",ref:"1"},members:[]}]};
    const result = normalize(response.elements);
    expect(result.holes[0].features).toEqual([]);
    expect(result.unassociatedFeatures[0].source.rawMembers).toEqual([]);
    expect(result.warnings.map(w=>w.code)).toEqual(expect.arrayContaining(["UNSUPPORTED_MEMBERSHIP","UNSUPPORTED_RELATION","FEATURE_SCOPE_UNRESOLVED"]));
  });
});
