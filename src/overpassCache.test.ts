import {
  createOverpassCacheRecord,
  MAX_OVERPASS_CACHE_RECORD_BYTES,
  ODBL_CACHE_LICENSE,
  OVERPASS_CACHE_SCHEMA_VERSION,
  OVERPASS_CACHE_TTL_MS,
  recordSizeBytes,
  validateOverpassCacheRecord,
  type OverpassCacheRecord,
} from "./overpassCache";
import { buildDetailQuery, OSM_COPYRIGHT_URL, OVERPASS_ENDPOINT, serializeBbox, sourceMetadata, type Bbox } from "./overpass";

const bbox: Bbox = { south: 35, west: -80, north: 35.01, east: -79.99 };
const query = buildDetailQuery(bbox);
const rawResponse = '{"elements":[{"type":"way","id":9000000001,"tags":{"leisure":"golf_course"}}]}';
const storedAt = Date.parse("2026-06-19T00:00:00.000Z");

function validRecord(overrides: Partial<OverpassCacheRecord> = {}): OverpassCacheRecord {
  const created = createOverpassCacheRecord("ctc:overpass:v1:detail:35,-80,35.01,-79.99", "detail", {
    rawResponse,
    source: sourceMetadata(query, bbox),
  }, storedAt);
  if ("kind" in created) throw new Error("fixture unexpectedly oversized");
  const merged = { ...created, ...overrides };
  if (!("sizeBytes" in overrides)) return { ...merged, sizeBytes: recordSizeBytes(merged) };
  return merged;
}

describe("durable Overpass cache records", () => {
  it("creates a versioned ODbL-marked record with exact source metadata and deterministic sizing", () => {
    const record = validRecord();
    expect(record.schemaVersion).toBe(OVERPASS_CACHE_SCHEMA_VERSION);
    expect(record.mode).toBe("detail");
    expect(record.source.query).toBe(query);
    expect(record.source.endpoint).toBe(OVERPASS_ENDPOINT);
    expect(record.source.bbox).toBe(serializeBbox(bbox));
    expect(record.source.copyrightUrl).toBe(OSM_COPYRIGHT_URL);
    expect(record.license).toBe(ODBL_CACHE_LICENSE);
    expect(record.expiresAt).toBe(storedAt + OVERPASS_CACHE_TTL_MS);
    expect(record.sizeBytes).toBe(recordSizeBytes({ ...record, sizeBytes: 999999 }));
  });

  it("accepts fresh records and returns stale records only after the exact TTL boundary", () => {
    const record = validRecord();
    expect(validateOverpassCacheRecord(record, {
      key: record.key,
      mode: "detail",
      query,
      bbox,
      now: record.expiresAt - 1,
    })).toMatchObject({ ok: true, freshness: "fresh" });
    expect(validateOverpassCacheRecord(record, {
      key: record.key,
      mode: "detail",
      query,
      bbox,
      now: record.expiresAt,
    })).toMatchObject({ ok: true, freshness: "stale" });
  });

  it.each([
    ["schemaVersion", { schemaVersion: 2 }],
    ["key", { key: "wrong" }],
    ["mode", { mode: "discovery" }],
    ["query", { source: { ...validRecord().source, query: `${query}\n// changed` } }],
    ["endpoint", { source: { ...validRecord().source, endpoint: "https://example.test/api" } }],
    ["completedAt", { source: { ...validRecord().source, completedAt: "not a date" } }],
    ["bbox", { source: { ...validRecord().source, bbox: "35,-80,35.0100001,-79.99" } }],
    ["copyrightUrl", { source: { ...validRecord().source, copyrightUrl: "https://example.test/copyright" } }],
    ["rawResponse", { rawResponse: '{"elements":"wrong"}' }],
    ["license", { license: "other" }],
    ["storedAt", { storedAt: storedAt + 1, expiresAt: storedAt + 1 + OVERPASS_CACHE_TTL_MS }],
    ["expiresAt", { expiresAt: storedAt + OVERPASS_CACHE_TTL_MS + 1 }],
    ["sizeBytes", { sizeBytes: 1 }],
  ])("rejects records with invalid %s", (_name, overrides) => {
    const record = validRecord(overrides as Partial<OverpassCacheRecord>);
    expect(validateOverpassCacheRecord(record, {
      key: validRecord().key,
      mode: "detail",
      query,
      bbox,
      now: storedAt,
    })).toMatchObject({ ok: false });
  });

  it("ignores unknown fields but rejects future clock and oversized entries", () => {
    const withUnknown = { ...validRecord(), extra: "ignored", source: { ...validRecord().source, extra: "ignored" } };
    expect(validateOverpassCacheRecord(withUnknown, {
      key: validRecord().key,
      mode: "detail",
      query,
      bbox,
      now: storedAt,
    })).toMatchObject({ ok: true });

    const future = validRecord({ storedAt: storedAt + 1, expiresAt: storedAt + 1 + OVERPASS_CACHE_TTL_MS });
    future.sizeBytes = recordSizeBytes(future);
    expect(validateOverpassCacheRecord(future, {
      key: future.key,
      mode: "detail",
      query,
      bbox,
      now: storedAt,
    })).toMatchObject({ ok: false });

    const oversized = validRecord({ sizeBytes: MAX_OVERPASS_CACHE_RECORD_BYTES + 1 });
    expect(validateOverpassCacheRecord(oversized, {
      key: oversized.key,
      mode: "detail",
      query,
      bbox,
      now: storedAt,
    })).toMatchObject({ ok: false, reason: "oversized" });
  });
});
