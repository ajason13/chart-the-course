import fixture from "../fixtures/overpass/synthetic-golf-course-ctc006.json";
import { normalizeGolfCourse } from "./normalize";
import {
  EARTH_RADIUS_M,
  INNER_MAX_X,
  INNER_MIN_X,
  LAYER_ORDER,
  clampPoint,
  createProjection,
  distanceMeters,
  formatDistance,
  holeCoordinates,
  inverseProject,
  projectCoordinate,
  scaleBar,
  warningsForHole,
} from "./map";
import type { OverpassResponse, SourceMetadata } from "./overpass";

const source: SourceMetadata = {
  query: "synthetic",
  endpoint: "https://example.invalid",
  completedAt: "2026-06-11T00:00:00Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: "https://www.openstreetmap.org/copyright",
};

const result = normalizeGolfCourse(fixture as OverpassResponse, source);
const hole = result.holes[0];

describe("selected-hole projection", () => {
  it("collects only selected-hole route and associated feature coordinates", () => {
    expect(hole.features.map(({ kind }) => kind).sort()).toEqual([...LAYER_ORDER].sort());
    expect(holeCoordinates(hole).length).toBeGreaterThan(20);
    expect(result.unassociatedFeatures).toHaveLength(1);
  });

  it("projects deterministically, north-up, and inverse-projects within tolerance", () => {
    const projection = createProjection(holeCoordinates(hole));
    expect("kind" in projection).toBe(false);
    if ("kind" in projection) return;
    const coordinate = holeCoordinates(hole)[0];
    const point = projectCoordinate(projection, coordinate);
    const recovered = inverseProject(projection, point);
    expect(recovered.lat).toBeCloseTo(coordinate.lat, 7);
    expect(recovered.lon).toBeCloseTo(coordinate.lon, 7);
    expect(projectCoordinate(projection, coordinate)).toEqual(point);
    expect(projectCoordinate(projection, { lat: coordinate.lat + 0.0001, lon: coordinate.lon }).y).toBeLessThan(point.y);
  });

  it("handles point-only geometry and invalid coordinate sets", () => {
    const projection = createProjection([{ lat: 35, lon: -80 }]);
    expect("kind" in projection).toBe(false);
    if ("kind" in projection) return;
    expect(projectCoordinate(projection, { lat: 35, lon: -80 })).toEqual({ x: 400, y: 300 });
    expect(createProjection([])).toEqual({ kind: "no-valid-coordinates" });
  });
});

describe("measurement helpers", () => {
  it("calculates and formats known, identical, antipodal, and invalid distances", () => {
    const latitudeDelta = distanceMeters({ lat: 35, lon: -80 }, { lat: 35.0009, lon: -80 });
    expect(latitudeDelta).toBeTypeOf("number");
    expect(latitudeDelta as number).toBeCloseTo(100.06, 1);
    expect(formatDistance(latitudeDelta as number)).toBe("109 yd / 100 m");
    expect(distanceMeters({ lat: 35, lon: -80 }, { lat: 35, lon: -80 })).toBe(0);
    expect(distanceMeters({ lat: 90, lon: 0 }, { lat: -90, lon: 0 })).toBeCloseTo(Math.PI * EARTH_RADIUS_M, 5);
    expect(distanceMeters({ lat: Number.NaN, lon: 0 }, { lat: 0, lon: 0 })).toEqual({ kind: "invalid-coordinates" });
  });

  it("clamps interaction points and selects a fitting truthful scale", () => {
    expect(clampPoint({ x: -1, y: 1000 })).toEqual({ x: INNER_MIN_X, y: 560 });
    const projection = createProjection(holeCoordinates(hole));
    if ("kind" in projection) throw new Error(projection.kind);
    const model = scaleBar(projection);
    expect(model.logicalLength).toBeLessThanOrEqual(288);
    expect(model.label).toBe(formatDistance(model.meters));
    expect(INNER_MAX_X).toBe(760);
  });

  it("matches selected-hole warnings only through structured evidence", () => {
    expect(warningsForHole(hole, result.warnings)).toEqual([]);
    expect(warningsForHole(hole, [{
      code: "MISSING_GREEN",
      severity: "error",
      affectedIdentity: hole.source.sourceKey,
      sourceKey: hole.source.sourceKey,
      refs: [hole.source.sourceKey],
    }])).toHaveLength(1);
  });
});
