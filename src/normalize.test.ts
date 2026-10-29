import completeFixture from "../fixtures/overpass/synthetic-golf-course.json";
import incompleteFixture from "../fixtures/overpass/synthetic-golf-course-incomplete.json";
import { normalizeGolfCourse } from "./normalize";
import type { OverpassResponse, SourceMetadata } from "./overpass";

const source: SourceMetadata = {
  query: "synthetic detail query",
  endpoint: "https://example.invalid/overpass",
  completedAt: "2026-06-07T00:00:00Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: "https://www.openstreetmap.org/copyright",
};

function normalized(fixture: unknown) {
  return normalizeGolfCourse(fixture as OverpassResponse, source);
}

describe("normalizeGolfCourse complete synthetic fixture", () => {
  it("classifies, associates, and preserves source evidence", () => {
    const result = normalized(completeFixture);
    expect(result.source).toBe(source);
    expect(result.courseCandidates.map(({ source: record }) => record.sourceKey)).toEqual(["way/9000000001"]);
    expect(result.holes).toHaveLength(1);
    expect(result.holes[0].number).toBe(1);
    expect(result.holes[0].par).toBe(4);
    expect(result.holes[0].features.map(({ kind }) => kind)).toEqual([
      "tee", "fairway", "green", "golf-water",
    ]);
    expect(result.holes[0].features[0].source.rawNodes).toBeDefined();
    expect(result.unassociatedFeatures.map(({ kind }) => kind)).toEqual([
      "bunker", "generic-water", "vegetation",
    ]);
    expect(result.warnings).toEqual([]);
  });

  it("is invariant to element order and does not mutate frozen input", () => {
    const frozen = structuredClone(completeFixture) as OverpassResponse;
    for (const element of frozen.elements) {
      if (element.tags) Object.freeze(element.tags);
      if (Array.isArray(element.geometry)) Object.freeze(element.geometry);
      Object.freeze(element);
    }
    Object.freeze(frozen.elements);
    Object.freeze(frozen);

    const expected = normalizeGolfCourse(frozen, source);
    const shuffled = { ...completeFixture, elements: [...completeFixture.elements].reverse() } as OverpassResponse;
    expect(normalizeGolfCourse(shuffled, source)).toEqual(expected);
    expect(normalizeGolfCourse(frozen, source)).toEqual(expected);
  });
});

describe("normalizeGolfCourse incomplete synthetic fixture", () => {
  it("preserves ambiguity and reports deterministic warnings without healing", () => {
    const result = normalized(incompleteFixture);
    expect(result.holes.map(({ number }) => number)).toEqual([1, 1, null]);
    expect(result.holes.every(({ features }) => features.length === 0)).toBe(true);
    expect(result.unassociatedFeatures.map(({ source: record }) => record.sourceKey)).toEqual([
      "node/9000001401",
      "relation/9000001301",
      "way/9000001201",
    ]);
    expect(result.warnings.map(({ code }) => code)).toEqual(expect.arrayContaining([
      "AMBIGUOUS_HOLE_ORDER", "DUPLICATE_SOURCE_KEY", "FEATURE_SCOPE_UNRESOLVED",
      "MALFORMED_CONSUMED_TAG", "MISSING_GREEN", "MISSING_OR_MALFORMED_GEOMETRY",
      "MISSING_TEE", "UNSUPPORTED_RELATION",
    ]));
    expect(result.warnings.filter(({ code }) => code === "DUPLICATE_SOURCE_KEY")).toHaveLength(1);
    expect(result.unassociatedFeatures.find(({ source: record }) => record.sourceKey === "relation/9000001301")?.geometry).toBeNull();
  });

  it("uses strict refs, exact classification precedence, and scoped IDs", () => {
    const fixture: OverpassResponse = {
      elements: [
        completeFixture.elements[0] as OverpassResponse["elements"][number],
        { type: "node", id: 42, lat: 35, lon: -80, tags: { golf: "water_hazard", natural: "water" } },
        { type: "way", id: 42, geometry: [{ lat: 35.001, lon: -79.999 }, { lat: 35.009, lon: -79.991 }], tags: { golf: "hole", ref: "01" } },
      ],
    };
    const result = normalizeGolfCourse(fixture, source);
    expect(result.holes[0].number).toBeNull();
    expect(result.unassociatedFeatures[0].kind).toBe("golf-water");
    expect(result.unassociatedFeatures[0].classifiedBy).toEqual(["golf", "water_hazard"]);
    expect(result.warnings.some(({ code }) => code === "DUPLICATE_SOURCE_KEY")).toBe(false);
  });

  it("parses rough and tree features when available", () => {
    const fixture: OverpassResponse = {
      elements: [
        {
          type: "way",
          id: 9000002001,
          geometry: [
            { lat: 35, lon: -80 },
            { lat: 35.001, lon: -80 },
            { lat: 35.001, lon: -79.999 },
            { lat: 35, lon: -80 },
          ],
          tags: { golf: "rough" },
        },
        { type: "node", id: 9000002002, lat: 35, lon: -80, tags: { natural: "tree" } },
      ],
    };
    const result = normalizeGolfCourse(fixture, source);
    expect(result.unassociatedFeatures.map(({ kind }) => kind)).toEqual(["vegetation", "rough"]);
  });

  it("emits ZERO_COURSE_CANDIDATES for input with no leisure=golf_course elements", () => {
    const result = normalizeGolfCourse({ elements: [] }, source);
    expect(result.courseCandidates).toHaveLength(0);
    expect(result.warnings.map(({ code }) => code)).toContain("ZERO_COURSE_CANDIDATES");
    expect(result.warnings.find(({ code }) => code === "ZERO_COURSE_CANDIDATES")?.severity).toBe("error");
  });

  it("emits MULTIPLE_COURSE_CANDIDATES for two distinct leisure=golf_course elements", () => {
    const fixture: OverpassResponse = {
      elements: [
        {
          type: "way",
          id: 9000009001,
          geometry: [
            { lat: 35, lon: -80 },
            { lat: 35.01, lon: -80 },
            { lat: 35.01, lon: -79.99 },
            { lat: 35, lon: -79.99 },
            { lat: 35, lon: -80 },
          ],
          tags: { leisure: "golf_course", name: "Synthetic Course A" },
        },
        {
          type: "way",
          id: 9000009002,
          geometry: [
            { lat: 35, lon: -80 },
            { lat: 35.01, lon: -80 },
            { lat: 35.01, lon: -79.99 },
            { lat: 35, lon: -79.99 },
            { lat: 35, lon: -80 },
          ],
          tags: { leisure: "golf_course", name: "Synthetic Course B" },
        },
      ],
    };
    const result = normalizeGolfCourse(fixture, source);
    expect(result.courseCandidates).toHaveLength(2);
    expect(result.warnings.map(({ code }) => code)).toContain("MULTIPLE_COURSE_CANDIDATES");
    expect(result.warnings.find(({ code }) => code === "MULTIPLE_COURSE_CANDIDATES")?.severity).toBe("warning");
  });
});

describe("multipolygon normalization boundaries", () => {
  it("retains member provenance, avoids duplicate fills and keeps distinct tagged members", async () => {
    const { default: fixture } = await import("../fixtures/overpass/synthetic-golf-course-multipolygon.json");
    const input = structuredClone(fixture) as OverpassResponse;
    const before = structuredClone(input);
    const result = normalizeGolfCourse(input,source,"way/9000060001");
    const hole = result.holes[0];
    expect(hole.features.filter(f=>f.geometry?.type==="multipolygon")).toHaveLength(2);
    expect(hole.features.some(f=>f.source.sourceKey==="way/9000060301")).toBe(false);
    expect(result.warnings.filter(w=>w.code==="DUPLICATE_MEMBER_FILL")).toHaveLength(2);
    const relation = input.elements.find(e=>e.type==="relation" && e.tags?.golf==="fairway")!;
    expect(hole.features.find(f=>f.source.id===relation.id)?.source.rawMembers).toEqual(relation.members);
    expect(input).toEqual(before);
    const reversed = structuredClone(input);
    reversed.elements.reverse();
    for (const e of reversed.elements) if(Array.isArray(e.members)) e.members.reverse();
    const reversedResult = normalizeGolfCourse(reversed,source,"way/9000060001");
    expect(reversedResult.holes.map(h=>h.features.map(f=>({key:f.source.sourceKey,geometry:f.geometry})))).toEqual(result.holes.map(h=>h.features.map(f=>({key:f.source.sourceKey,geometry:f.geometry}))));
    const member = input.elements.find(e=>e.id===9000060301 && e.type==="way")!;
    member.tags={golf:"rough",ref:"1"};
    const distinct=normalizeGolfCourse(input,source,"way/9000060001");
    expect(distinct.holes[0].features.some(f=>f.source.sourceKey==="way/9000060301")).toBe(true);
    expect(distinct.warnings.some(w=>w.code==="DISTINCT_MEMBER_FEATURE")).toBe(true);
  });

  it("supports a relation facility and excludes its interior and inter-part gap", () => {
    const p=(x:number,y:number)=>({lat:y/100000,lon:x/100000});
    const ring=(x:number,y:number,n:number)=>[p(x,y),p(x+n,y),p(x+n,y+n),p(x,y+n),p(x,y)];
    const facility={type:"relation" as const,id:1,tags:{leisure:"golf_course",type:"multipolygon"},members:[
      {type:"way",ref:11,role:"outer",geometry:ring(0,0,20)},
      {type:"way",ref:12,role:"inner",geometry:ring(5,5,5)},
      {type:"way",ref:13,role:"outer",geometry:ring(30,0,20)},
    ]};
    const response={elements:[facility,...[[1,1],[6,6],[25,1],[31,1]].map(([x,y],i)=>({type:"way" as const,id:20+i,tags:{golf:"hole",ref:String(i+1)},geometry:[p(x,y),p(x+1,y+1)]}))]};
    expect(normalizeGolfCourse(response,source,"relation/1").holes.map(h=>h.number)).toEqual([1,4]);
    const bad={type:"relation" as const,id:40,tags:{type:"multipolygon",golf:"water_hazard",ref:"1"},members:[{type:"way",ref:99,role:"outer"}]};
    const result=normalizeGolfCourse({elements:[...response.elements,bad]},source,"relation/1");
    expect(result.holes[0].riskGeometryUnavailable).toBe(true);
    expect(result.holes[1].riskGeometryUnavailable).toBeUndefined();
    expect(result.warnings.some(w=>w.code==="INVALID_RELATION_TOPOLOGY")).toBe(true);
  });
});
