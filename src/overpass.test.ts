import {
  buildDetailQuery,
  buildDiscoveryQuery,
  classifyHttpStatus,
  detailCacheKey,
  discoveryCacheKey,
  encodeCourseName,
  parseBbox,
  parseCandidateBounds,
  readCache,
  serializeBbox,
  sourceMetadata,
  validateResponse,
  validateTrustedIdentity,
  writeCache,
  type Bbox,
} from "./overpass";

const bbox: Bbox = { south: 37.3, west: -122.1, north: 37.5, east: -121.9 };

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  length = 0;
  clear() { this.values.clear(); this.length = 0; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); this.length = this.values.size; }
  setItem(key: string, value: string) { this.values.set(key, value); this.length = this.values.size; }
}

describe("Overpass query construction", () => {
  it("builds the exact reviewed discovery query", () => {
    expect(buildDiscoveryQuery(bbox, "Pine.* Hills")).toMatchInlineSnapshot(`
      "/* chart-the-course/0.0.0 contact:https://github.com/ajason13/chart-the-course purpose:golf-course-discovery */
      [out:json][timeout:25][maxsize:536870912];
      (
        nwr["leisure"="golf_course"]["name"~"Pine\\.\\* Hills",i](37.3,-122.1,37.5,-121.9);
        nwr["leisure"="golf_course"](37.3,-122.1,37.5,-121.9);
      );
      out tags center bb;"
    `);
    expect(buildDiscoveryQuery(bbox, "   ")).not.toContain('["name"~');
  });

  it("builds the exact reviewed detail query", () => {
    expect(buildDetailQuery(bbox)).toMatchInlineSnapshot(`
      "/* chart-the-course/0.0.0 contact:https://github.com/ajason13/chart-the-course purpose:golf-course-detail */
      [out:json][timeout:45][maxsize:536870912];
      (
        nwr["leisure"="golf_course"](37.3,-122.1,37.5,-121.9);
        nwr["golf"~"^(hole|fairway|green|bunker|tee|water_hazard|lateral_water_hazard|rough|out_of_bounds|pin|cartpath)$"](37.3,-122.1,37.5,-121.9);
        nwr["natural"~"^(water|wood|tree|tree_row|scrub)$"](37.3,-122.1,37.5,-121.9);
        nwr["landuse"~"^(forest|reservoir|basin)$"](37.3,-122.1,37.5,-121.9);
        nwr["water"~"^(pond|lake|basin|reservoir)$"](37.3,-122.1,37.5,-121.9);
        nwr["waterway"](37.3,-122.1,37.5,-121.9);
      );
      out body geom;"
    `);
  });

  it("encodes names in one pass and constrains identity constants", () => {
    expect(encodeCourseName('  "a\\.*+?()[]{}|^$*/é"  ')).toBe('\\"a\\\\\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\^\\$\\*/é\\"');
    expect(encodeCourseName("*/ remains text")).toBe("\\*/ remains text");
    expect(() => encodeCourseName("bad\nquery")).toThrow(/control/);
    expect(() => encodeCourseName("x".repeat(201))).toThrow(/200/);
    expect([...encodeCourseName("é".repeat(200))]).toHaveLength(200);
    expect(validateTrustedIdentity("0.0.0")).toBe("0.0.0");
    expect(() => validateTrustedIdentity("bad*/comment")).toThrow();
    expect(() => validateTrustedIdentity("bad\ncomment")).toThrow();
  });
});

describe("bbox validation", () => {
  it("accepts canonical bounded decimal input and normalizes negative zero", () => {
    const result = parseBbox({ south: "-0", west: "-0.0000000", north: "0.35", east: "0.3500000" });
    expect(result).toEqual({
      ok: true,
      bbox: { south: -0, west: -0, north: 0.35, east: 0.35 },
      serialized: "0,0,0.35,0.35",
    });
    expect(serializeBbox(bbox)).toBe("37.3,-122.1,37.5,-121.9");
  });

  it.each(["1e-2", "1,2", "Infinity", "NaN", "1.12345678"])("rejects invalid syntax %s", (south) => {
    expect(parseBbox({ south, west: "0", north: "1", east: "1" }).ok).toBe(false);
  });

  it("handles span, polar, ordering, and dateline edges", () => {
    expect(parseBbox({ south: "89.65", west: "10", north: "90", east: "10.35" }).ok).toBe(true);
    expect(parseBbox({ south: "37.0", west: "-122.1", north: "37.35", east: "-121.75" }).ok).toBe(true);
    expect(parseBbox({ south: "0", west: "0", north: "0.3500001", east: "0.35" }).ok).toBe(false);
    expect(parseBbox({ south: "1", west: "0", north: "0", east: "0.1" }).ok).toBe(false);
    expect(parseBbox({ south: "0", west: "179.9", north: "0.1", east: "-179.9" }).ok).toBe(false);
    expect(parseCandidateBounds({ minlat: 37.3, minlon: -122.1, maxlat: 37.5, maxlon: -121.9 })).toEqual(bbox);
    expect(parseCandidateBounds({ minlat: 37.3 })).toBeNull();
  });
});

describe("response, cache, and HTTP classification", () => {
  const rawResponse = '{"elements":[{"type":"way","id":42,"tags":{"name":"Test"}}]}';

  it("validates only the minimum raw entity shape and classifies empty results", () => {
    expect(validateResponse({ elements: [] })).toEqual({ elements: [] });
    expect(validateResponse(JSON.parse(rawResponse))?.elements).toHaveLength(1);
    expect(validateResponse({ elements: [{ type: "area", id: 1 }] })).toBeNull();
    expect(validateResponse({ elements: [{ type: "node", id: 1.5 }] })).toBeNull();
    expect(validateResponse({ nope: [] })).toBeNull();
  });

  it("generates deterministic distinct cache keys", () => {
    expect(discoveryCacheKey(bbox, " Pine.* ")).toBe("ctc:overpass:v1:discovery:37.3,-122.1,37.5,-121.9:pine\\.\\*");
    expect(detailCacheKey(bbox)).toBe("ctc:overpass:v1:detail:37.3,-122.1,37.5,-121.9");
  });

  it("round-trips exact raw text and reports corrupt or failed storage without eviction", () => {
    const storage = new MemoryStorage();
    const cached = { rawResponse, source: sourceMetadata("query", bbox) };
    expect(writeCache(storage, "key", cached)).toBeNull();
    expect(readCache(storage, "key")).toMatchObject({ kind: "hit", cached: { rawResponse } });
    storage.setItem("corrupt", "{");
    expect(readCache(storage, "corrupt").kind).toBe("warning");
    expect(storage.getItem("corrupt")).toBe("{");

    const failed = new MemoryStorage();
    failed.setItem = () => { throw new Error("quota"); };
    expect(writeCache(failed, "key", cached)).toMatch(/could not/);
    failed.getItem = () => { throw new Error("unavailable"); };
    expect(readCache(failed, "key").kind).toBe("warning");
  });

  it("classifies HTTP status without retry policy", () => {
    expect(classifyHttpStatus(429)).toBe("rate-limit");
    expect(classifyHttpStatus(504)).toBe("timeout");
    expect(classifyHttpStatus(500)).toBe("http");
  });
});
