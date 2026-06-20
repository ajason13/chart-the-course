import {
  buildGisSourceExport,
  extractOsmElementSummary,
  formatGisSourceExportFilename,
  GIS_SOURCE_EXPORT_MAX_BYTES,
  GIS_SOURCE_EXPORT_MIME,
  serializeGisSourceEnvelope,
  type ActiveSourceEvidence,
} from "./gisSourceExport";
import { buildDetailQuery, serializeBbox, sourceMetadata, type Bbox } from "./overpass";

const bbox: Bbox = { south: 35, west: -80, north: 35.01, east: -79.99 };
const query = buildDetailQuery(bbox);
const rawResponse = `{"elements":[{"type":"way","id":3,"tags":{"name":"Fairway","golf":"fairway"},"geometry":[{"lat":35,"lon":-80}]},{"type":"node","id":2,"tags":{"__proto__":"inert","golf":"tee"},"lat":35,"lon":-80},{"type":"relation","id":1,"tags":{"type":"multipolygon","leisure":"golf_course"},"members":[]}]}`;

function evidence(overrides: Partial<ActiveSourceEvidence> = {}): ActiveSourceEvidence {
  return {
    mode: "detail",
    cacheKey: `ctc:overpass:v1:detail:${serializeBbox(bbox)}`,
    rawResponse,
    source: sourceMetadata(query, bbox),
    consentState: "fresh",
    ...overrides,
  };
}

describe("GIS source export", () => {
  it("builds deterministic JSON with exact raw response text and expected MIME", () => {
    const result = buildGisSourceExport(evidence(), { query, bbox }, "2026-06-20T01:02:03.000Z");
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.message);
    expect(GIS_SOURCE_EXPORT_MIME).toBe("application/json;charset=utf-8");
    expect(result.filename).toBe("ctc-gis-source-20260620T010203Z.json");
    expect(result.envelope.rawResponse).toBe(rawResponse);
    expect(Object.keys(result.envelope)).toEqual([...Object.keys(result.envelope)].sort());
    expect(result.text).toBe(`${JSON.stringify(JSON.parse(result.text), null, 2)}\n`);
    expect(result.envelope.osmElementsSummary).toEqual([
      { type: "node", id: 2, tagKeys: ["__proto__", "golf"] },
      { type: "relation", id: 1, tagKeys: ["leisure", "type"] },
      { type: "way", id: 3, tagKeys: ["golf", "name"] },
    ]);
    const summaryText = JSON.stringify(result.envelope.osmElementsSummary);
    expect(summaryText).not.toContain("Fairway");
    expect(summaryText).not.toContain("geometry");
    expect(summaryText).not.toContain("members");
  });

  it("uses a sentinel filename component for unexpected timestamp shapes", () => {
    expect(formatGisSourceExportFilename("2026-06-20T01:02:03+00:00")).toBe("ctc-gis-source-invalid-timestamp.json");
  });

  it("exports valid empty responses with an empty summary", () => {
    const result = buildGisSourceExport(evidence({ rawResponse: '{"elements":[]}' }), { query, bbox }, "2026-06-20T01:02:03.000Z");
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.message);
    expect(result.envelope.osmElementsSummary).toEqual([]);
    expect(result.envelope.rawResponse).toBe('{"elements":[]}');
  });

  it("keeps stale metadata consistent and computes age from completedAt to exportedAt", () => {
    const source = sourceMetadata(query, bbox);
    const stale = evidence({
      source: { ...source, completedAt: "2026-06-10T00:00:00.000Z" },
      consentState: "stale-consented",
    });
    const result = buildGisSourceExport(stale, { query, bbox }, "2026-06-20T12:00:00.000Z");
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.message);
    expect(result.envelope.consentState).toBe("stale-consented");
    expect(result.envelope.isStaleSource).toBe(true);
    expect(result.envelope.sourceAgeDays).toBe(10);
    expect(result.envelope.isStaleSource).toBe(result.envelope.consentState !== "fresh");
  });

  it("rejects mismatched source metadata and discovery evidence", () => {
    expect(buildGisSourceExport(evidence({ source: { ...sourceMetadata(query, bbox), endpoint: "https://example.test/api" } }), { query, bbox }))
      .toMatchObject({ ok: false, code: "SOURCE_MISMATCH" });
    expect(buildGisSourceExport(evidence({ source: { ...sourceMetadata(query, bbox), copyrightUrl: "https://example.test" } }), { query, bbox }))
      .toMatchObject({ ok: false, code: "SOURCE_MISMATCH" });
    expect(buildGisSourceExport(evidence({ source: { ...sourceMetadata(`${query}\nchanged`, bbox) } }), { query, bbox }))
      .toMatchObject({ ok: false, code: "SOURCE_MISMATCH" });
  });

  it("treats dangerous tag names as inert summary strings", () => {
    expect(extractOsmElementSummary("{")).toBeNull();
    expect(buildGisSourceExport(evidence({ rawResponse: '{"elements":[{"type":"area","id":1}]}' }), { query, bbox }))
      .toMatchObject({ ok: false, code: "INVALID_RESPONSE" });
    expect(extractOsmElementSummary(rawResponse)?.[0].tagKeys).toContain("__proto__");
    expect(extractOsmElementSummary(rawResponse)?.[0]).not.toHaveProperty("tags");
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it("measures the full pretty-printed export size at the cap and one byte over", () => {
    const minimal = evidence({ rawResponse: '{"elements":[],"padding":""}' });
    const ok = buildGisSourceExport(minimal, { query, bbox }, "2026-06-20T01:02:03.000Z");
    expect(ok.ok).toBe(true);
    if (!ok.ok) throw new Error(ok.message);
    const atCapRaw = `{"elements":[],"padding":"${"x".repeat(GIS_SOURCE_EXPORT_MAX_BYTES - ok.sizeBytes)}"}`;
    const atCap = buildGisSourceExport(evidence({ rawResponse: atCapRaw }), { query, bbox }, "2026-06-20T01:02:03.000Z");
    expect(atCap.ok).toBe(true);
    if (!atCap.ok) throw new Error(atCap.message);
    expect(atCap.sizeBytes).toBe(GIS_SOURCE_EXPORT_MAX_BYTES);

    const overCapRaw = `{"elements":[],"padding":"${"x".repeat(GIS_SOURCE_EXPORT_MAX_BYTES - ok.sizeBytes + 1)}"}`;
    expect(buildGisSourceExport(evidence({ rawResponse: overCapRaw }), { query, bbox }, "2026-06-20T01:02:03.000Z"))
      .toMatchObject({ ok: false, code: "OVERSIZED_EXPORT" });
  });

  it("serializes stale sourceAgeDays only for stale exports", () => {
    const fresh = buildGisSourceExport(evidence(), { query, bbox }, "2026-06-20T01:02:03.000Z");
    expect(fresh.ok).toBe(true);
    if (!fresh.ok) throw new Error(fresh.message);
    expect(fresh.text).not.toContain("sourceAgeDays");

    const text = serializeGisSourceEnvelope({ ...fresh.envelope, isStaleSource: true, consentState: "stale-consented", sourceAgeDays: 1 });
    expect(Object.keys(JSON.parse(text)).at(-1)).toBe("sourceAgeDays");
  });
});
