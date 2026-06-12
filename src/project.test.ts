import {
  OSM_COPYRIGHT_URL,
  PROJECT_SCHEMA,
  emptyProject,
  parseProjectText,
  projectMatchErrors,
  serializeProject,
  validateProjectFile,
  type ProjectV1,
  type CarryV1,
} from "./project";

const valid: ProjectV1 = {
  schema: PROJECT_SCHEMA,
  exportedAt: "2026-06-12T00:00:00.000Z",
  courseSourceKey: "way/9000000001",
  courseCopyrightUrl: OSM_COPYRIGHT_URL,
  holes: {
    "way/9000000101": {
      targets: [{ id: "t-0123456789ab", label: "Layup", lat: 35, lon: -80 }],
      carries: [{
        id: "c-0123456789ab",
        origin: { kind: "target", targetId: "t-0123456789ab" },
        distances: [150, 200],
      }],
    },
  },
};

describe("project v1 validation", () => {
  it("validates and deterministically round-trips a project", () => {
    const serialized = serializeProject(valid);
    expect(serialized.endsWith("\n")).toBe(true);
    expect(parseProjectText(serialized)).toEqual({ ok: true, project: valid });
    expect(Object.keys(JSON.parse(serialized).holes)).toEqual(["way/9000000101"]);
  });

  it("serializes fixed top-level property order regardless of input insertion order", () => {
    const reordered = {
      holes: valid.holes,
      courseCopyrightUrl: valid.courseCopyrightUrl,
      courseSourceKey: valid.courseSourceKey,
      exportedAt: valid.exportedAt,
      schema: valid.schema,
    } as ProjectV1;
    expect(Object.keys(JSON.parse(serializeProject(reordered)))).toEqual([
      "schema", "exportedAt", "courseSourceKey", "courseCopyrightUrl", "holes",
    ]);
  });

  it("rejects invalid JSON, unsupported versions, unknown fields, and dangerous keys", () => {
    expect(parseProjectText("{").ok).toBe(false);
    expect(validateProjectFile({ ...valid, schema: "chart-the-course-project/v2" })).toEqual({
      ok: false,
      errors: [{ code: "UNSUPPORTED_VERSION", path: "$.schema", message: "Only chart-the-course-project/v1 is supported." }],
    });
    const unknown = validateProjectFile({ ...valid, extra: true });
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.errors.map(({ code }) => code)).toContain("UNKNOWN_FIELD");
    const dangerous = parseProjectText(JSON.stringify(valid).replace('"holes":{', '"holes":{"__proto__":{},'));
    expect(dangerous.ok).toBe(false);
    if (!dangerous.ok) expect(dangerous.errors.map(({ code }) => code)).toContain("DANGEROUS_KEY");
  });

  it("rejects bad coordinates, IDs, duplicate IDs, and invalid carries", () => {
    const broken = structuredClone(valid) as ProjectV1;
    const hole = broken.holes["way/9000000101"]!;
    hole.targets.push({ id: "t-0123456789ab", label: "x".repeat(41), lat: 91, lon: Number.NaN });
    hole.carries[0].distances = [200, 150, 150, 701];
    const result = validateProjectFile(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map(({ code }) => code)).toEqual(expect.arrayContaining([
        "DUPLICATE_ID", "STRING_TOO_LONG", "OUT_OF_RANGE", "NON_FINITE",
        "NON_ASCENDING", "NON_UNIQUE_DISTANCES",
      ]));
    }
  });

  it("reports raw target and carry array bounds even when entries are invalid", () => {
    const broken = structuredClone(valid) as ProjectV1;
    const hole = broken.holes["way/9000000101"]!;
    hole.targets = Array.from({ length: 11 }, (_, index) => ({
      id: `bad-${index}`,
      label: "",
      lat: 91,
      lon: 181,
    }));
    hole.carries = Array.from({ length: 6 }, (_, index) => ({
      id: `bad-${index}`,
      origin: { kind: "target", targetId: "bad" },
      distances: [],
    })) as CarryV1[];
    const result = validateProjectFile(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.filter(({ code }) => code === "ARRAY_TOO_LONG")).toEqual([
        expect.objectContaining({ path: "$.holes.way/9000000101.targets" }),
        expect.objectContaining({ path: "$.holes.way/9000000101.carries" }),
      ]);
    }
  });

  it("caps validation output at twenty errors including the sentinel", () => {
    const result = validateProjectFile(Object.fromEntries([
      ["schema", PROJECT_SCHEMA],
      ["exportedAt", "bad"],
      ["courseSourceKey", "bad"],
      ["courseCopyrightUrl", "bad"],
      ["holes", {}],
      ...Array.from({ length: 30 }, (_, index) => [`extra${index}`, index]),
    ]));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toHaveLength(20);
      expect(result.errors.at(-1)?.message).toContain("Too many errors");
    }
  });

  it("reports course and hole mismatches without changing project data", () => {
    expect(projectMatchErrors(valid, "way/9000000002", ["way/9000000102"])).toEqual([
      expect.objectContaining({ code: "COURSE_MISMATCH" }),
      expect.objectContaining({ code: "HOLE_MISMATCH" }),
    ]);
    expect(emptyProject("way/9000000001", valid.exportedAt)).toEqual({
      schema: PROJECT_SCHEMA,
      exportedAt: valid.exportedAt,
      courseSourceKey: "way/9000000001",
      courseCopyrightUrl: OSM_COPYRIGHT_URL,
      holes: {},
    });
  });
});
