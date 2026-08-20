import {
  OSM_COPYRIGHT_URL,
  PROJECT_SCHEMA,
  PROJECT_SCHEMA_V1,
  emptyProject,
  generateProjectId,
  parseProjectText,
  projectMatchErrors,
  serializeProject,
  validateProjectFile,
  type CarryV1,
  type ProjectV1,
  type ProjectV2,
} from "./project";

const valid: ProjectV2 = {
  schema: PROJECT_SCHEMA,
  exportedAt: "2026-06-12T00:00:00.000Z",
  courseSourceKey: "way/9000000001",
  courseCopyrightUrl: OSM_COPYRIGHT_URL,
  holes: {
    "way/9000000101": {
      targets: [{ id: "t-0123456789ab", label: "Layup", lat: 35, lon: -80 }],
      carries: [{ id: "c-0123456789ab", origin: { kind: "target", targetId: "t-0123456789ab" }, distances: [150, 200] }],
    },
  },
  clubProfile: {
    clubs: [{ id: "p-0123456789ab", label: "7 Iron", carry: 150, longitudinal: 30, lateral: 20 }],
  },
};

describe("project v2 validation", () => {
  it("validates and deterministically round-trips targets, carries, and the club profile", () => {
    const serialized = serializeProject(valid);
    expect(serialized.endsWith("\n")).toBe(true);
    expect(parseProjectText(serialized)).toEqual({ ok: true, project: valid });
    expect(Object.keys(JSON.parse(serialized))).toEqual([
      "schema", "exportedAt", "courseSourceKey", "courseCopyrightUrl", "holes", "clubProfile",
    ]);
  });

  it("migrates a valid v1 import to an empty v2 profile without changing holes", () => {
    const legacy: ProjectV1 = {
      schema: PROJECT_SCHEMA_V1,
      exportedAt: valid.exportedAt,
      courseSourceKey: valid.courseSourceKey,
      courseCopyrightUrl: OSM_COPYRIGHT_URL,
      holes: structuredClone(valid.holes),
    };
    const result = validateProjectFile(legacy);
    expect(result).toEqual({ ok: true, project: { ...legacy, schema: PROJECT_SCHEMA, clubProfile: { clubs: [] } } });
    if (result.ok) expect(parseProjectText(serializeProject(result.project))).toEqual(result);
  });

  it("rejects unknown and dangerous profile fields", () => {
    const unknown = validateProjectFile({ ...valid, clubProfile: { clubs: valid.clubProfile.clubs, extra: true } });
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.errors.map(({ code }) => code)).toContain("UNKNOWN_FIELD");
    const dangerous = parseProjectText(serializeProject(valid).replace('"clubs": [', '"__proto__": {}, "clubs": ['));
    expect(dangerous.ok).toBe(false);
    if (!dangerous.ok) expect(dangerous.errors.map(({ code }) => code)).toContain("DANGEROUS_KEY");
  });

  it("rejects malformed, non-finite, out-of-range, and oversized clubs", () => {
    const clubs = Array.from({ length: 15 }, (_, index) => ({
      id: `p-${index.toString(16).padStart(12, "0")}`,
      label: index === 0 ? "" : `Club ${index}`,
      carry: index === 1 ? Number.NaN : index === 2 ? 0 : 150,
      longitudinal: index === 3 ? 201 : 30,
      lateral: index === 4 ? 1.5 : 20,
    }));
    const result = validateProjectFile({ ...valid, clubProfile: { clubs } });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.map(({ code }) => code)).toEqual(expect.arrayContaining([
      "ARRAY_TOO_LONG", "EMPTY_STRING", "NON_FINITE", "OUT_OF_RANGE", "NON_INTEGER",
    ]));
  });

  it("normalizes club labels to NFC and rejects trimmed case-insensitive duplicates", () => {
    const result = validateProjectFile({ ...valid, clubProfile: { clubs: [
      { ...valid.clubProfile.clubs[0], label: "  E\u0301lite  " },
      { ...valid.clubProfile.clubs[0], id: "p-abcdefabcdef", label: "élite" },
    ] } });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toContainEqual(expect.objectContaining({ code: "DUPLICATE_LABEL" }));
    const single = validateProjectFile({ ...valid, clubProfile: { clubs: [{ ...valid.clubProfile.clubs[0], label: "  E\u0301lite  " }] } });
    expect(single.ok && single.project.clubProfile.clubs[0].label).toBe("Élite");
  });

  it("rejects duplicate IDs across clubs, targets, and carries", () => {
    const duplicate = structuredClone(valid) as unknown as Record<string, unknown>;
    const profile = duplicate.clubProfile as { clubs: Array<Record<string, unknown>> };
    profile.clubs[0].id = "t-0123456789ab";
    const result = validateProjectFile(duplicate);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.map(({ code }) => code)).toContain("DUPLICATE_ID");
  });

  it("rejects invalid JSON, unsupported versions, unknown fields, and dangerous hole keys", () => {
    expect(parseProjectText("{").ok).toBe(false);
    expect(validateProjectFile({ ...valid, schema: "chart-the-course-project/v3" })).toEqual({
      ok: false,
      errors: [{ code: "UNSUPPORTED_VERSION", path: "$.schema", message: "Only chart-the-course-project/v2 and chart-the-course-project/v1 are supported." }],
    });
    const unknown = validateProjectFile({ ...valid, extra: true });
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.errors.map(({ code }) => code)).toContain("UNKNOWN_FIELD");
    const dangerous = parseProjectText(serializeProject(valid).replace('"holes": {', '"holes": {"__proto__": {},'));
    expect(dangerous.ok).toBe(false);
    if (!dangerous.ok) expect(dangerous.errors.map(({ code }) => code)).toContain("DANGEROUS_KEY");
  });

  it("rejects bad coordinates, IDs, duplicate IDs, and invalid carries", () => {
    const broken = structuredClone(valid) as ProjectV2;
    const hole = broken.holes["way/9000000101"]!;
    hole.targets.push({ id: "t-0123456789ab", label: "x".repeat(41), lat: 91, lon: Number.NaN });
    hole.carries[0].distances = [200, 150, 150, 701];
    const result = validateProjectFile(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.map(({ code }) => code)).toEqual(expect.arrayContaining([
      "DUPLICATE_ID", "STRING_TOO_LONG", "OUT_OF_RANGE", "NON_FINITE", "NON_ASCENDING", "NON_UNIQUE_DISTANCES",
    ]));
  });

  it("reports raw target and carry array bounds even when entries are invalid", () => {
    const broken = structuredClone(valid) as ProjectV2;
    const hole = broken.holes["way/9000000101"]!;
    hole.targets = Array.from({ length: 11 }, (_, index) => ({ id: `bad-${index}`, label: "", lat: 91, lon: 181 }));
    hole.carries = Array.from({ length: 6 }, (_, index) => ({ id: `bad-${index}`, origin: { kind: "target", targetId: "bad" }, distances: [] })) as CarryV1[];
    const result = validateProjectFile(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.filter(({ code }) => code === "ARRAY_TOO_LONG")).toEqual([
      expect.objectContaining({ path: "$.holes.way/9000000101.targets" }),
      expect.objectContaining({ path: "$.holes.way/9000000101.carries" }),
    ]);
  });

  it("caps validation output at twenty errors including the sentinel", () => {
    const result = validateProjectFile(Object.fromEntries([
      ["schema", PROJECT_SCHEMA], ["exportedAt", "bad"], ["courseSourceKey", "bad"], ["courseCopyrightUrl", "bad"],
      ["holes", {}], ["clubProfile", { clubs: [] }], ...Array.from({ length: 30 }, (_, index) => [`extra${index}`, index]),
    ]));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toHaveLength(20);
      expect(result.errors.at(-1)?.message).toContain("Too many errors");
    }
  });

  it("reports mismatches, creates an empty v2 project, and generates club IDs", () => {
    expect(projectMatchErrors(valid, "way/9000000002", ["way/9000000102"])).toEqual([
      expect.objectContaining({ code: "COURSE_MISMATCH" }), expect.objectContaining({ code: "HOLE_MISMATCH" }),
    ]);
    expect(emptyProject("way/9000000001", valid.exportedAt)).toEqual({
      schema: PROJECT_SCHEMA, exportedAt: valid.exportedAt, courseSourceKey: "way/9000000001",
      courseCopyrightUrl: OSM_COPYRIGHT_URL, holes: {}, clubProfile: { clubs: [] },
    });
    expect(generateProjectId("club")).toMatch(/^p-[0-9a-f]{12}$/);
  });
});
