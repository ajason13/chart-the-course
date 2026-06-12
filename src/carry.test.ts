import fixture from "../fixtures/overpass/synthetic-golf-course-ctc006.json";
import { carryCoordinates, carryRings, resolveCarryOrigin, teeOrigins } from "./carry";
import { createProjection, distanceMeters, holeCoordinates } from "./map";
import { normalizeGolfCourse } from "./normalize";
import type { OverpassResponse, SourceMetadata } from "./overpass";

const source: SourceMetadata = {
  query: "synthetic",
  endpoint: "https://example.invalid",
  completedAt: "2026-06-12T00:00:00Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: "https://www.openstreetmap.org/copyright",
};
const result = normalizeGolfCourse(fixture as OverpassResponse, source);
const hole = result.holes[0];

describe("carry geometry", () => {
  it("resolves deterministic tee and target origins", () => {
    const tees = teeOrigins(hole);
    expect(tees).toHaveLength(1);
    expect(resolveCarryOrigin({ kind: "tee", sourceKey: tees[0].sourceKey }, hole, [])).toEqual(tees[0].coordinate);
    expect(resolveCarryOrigin({ kind: "target", targetId: "t-0123456789ab" }, hole,
      [{ id: "t-0123456789ab", label: "Target", lat: 35, lon: -80 }])).toEqual({ lat: 35, lon: -80 });
    expect(resolveCarryOrigin({ kind: "target", targetId: "t-ffffffffffff" }, hole, [])).toEqual({ kind: "origin-unavailable" });
  });

  it("generates a closed 64-bearing ring using the existing distance contract", () => {
    const origin = { lat: 35, lon: -80 };
    const coordinates = carryCoordinates(origin, 150);
    expect(Array.isArray(coordinates)).toBe(true);
    if (!Array.isArray(coordinates)) return;
    expect(coordinates).toHaveLength(65);
    expect(coordinates.at(-1)).toEqual(coordinates[0]);
    for (const coordinate of coordinates.slice(0, 64)) {
      const measured = distanceMeters(origin, coordinate);
      expect(measured).toBeTypeOf("number");
      expect(measured as number).toBeCloseTo(150 * 0.9144, 5);
    }
  });

  it("normalizes and splits an antimeridian-crossing maximum-distance ring", () => {
    const coordinates = carryCoordinates({ lat: 0, lon: 179.999 }, 700);
    expect(Array.isArray(coordinates)).toBe(true);
    if (!Array.isArray(coordinates)) return;
    expect(coordinates.some(({ lon }) => lon < -179)).toBe(true);
    expect(coordinates.every(({ lon }) => lon >= -180 && lon < 180)).toBe(true);
  });

  it("projects clipped carry rings and rejects invalid distances", () => {
    const projection = createProjection(holeCoordinates(hole));
    if ("kind" in projection) throw new Error(projection.kind);
    const tee = teeOrigins(hole)[0];
    const rings = carryRings({ id: "c-0123456789ab", origin: { kind: "tee", sourceKey: tee.sourceKey }, distances: [150] },
      hole, [], projection);
    expect(Array.isArray(rings)).toBe(true);
    if (Array.isArray(rings)) {
      expect(rings[0].segments.length).toBeGreaterThan(0);
      expect(rings[0].offMap).toBeTypeOf("boolean");
    }
    expect(carryCoordinates({ lat: 35, lon: -80 }, 0)).toEqual({ kind: "invalid-distance" });
    expect(carryCoordinates({ lat: 35, lon: -80 }, 701)).toEqual({ kind: "invalid-distance" });
  });
});
