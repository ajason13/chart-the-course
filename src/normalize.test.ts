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
    ]);
    expect(result.warnings.map(({ code }) => code)).toEqual([
      "AMBIGUOUS_FEATURE_REF",
      "AMBIGUOUS_FEATURE_REF",
      "AMBIGUOUS_HOLE_ORDER",
      "DUPLICATE_SOURCE_KEY",
      "MALFORMED_CONSUMED_TAG",
      "MISSING_GREEN",
      "MISSING_GREEN",
      "MISSING_OR_MALFORMED_GEOMETRY",
      "MISSING_TEE",
      "MISSING_TEE",
      "UNSUPPORTED_RELATION",
    ]);
    expect(result.warnings.filter(({ code }) => code === "DUPLICATE_SOURCE_KEY")).toHaveLength(1);
    expect(result.unassociatedFeatures.find(({ source: record }) => record.sourceKey === "relation/9000001301")?.geometry).toBeNull();
  });

  it("uses strict refs, exact classification precedence, and scoped IDs", () => {
    const fixture: OverpassResponse = {
      elements: [
        { type: "node", id: 42, lat: 35, lon: -80, tags: { golf: "water_hazard", natural: "water" } },
        { type: "way", id: 42, geometry: [{ lat: 35, lon: -80 }, { lat: 35.01, lon: -79.99 }], tags: { golf: "hole", ref: "01" } },
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
