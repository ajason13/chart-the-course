import fixture from "../fixtures/overpass/synthetic-golf-course-ctc006.json";
import { dispersionEllipse, DISPERSION_SAMPLES } from "./dispersion";
import { createProjection, holeCoordinates, inverseProject, YARDS_PER_METER, type Projection } from "./map";
import { normalizeGolfCourse } from "./normalize";
import type { OverpassResponse, SourceMetadata } from "./overpass";
import type { ClubV2, TargetV1 } from "./project";

const source: SourceMetadata = {
  query: "synthetic",
  endpoint: "https://example.invalid",
  completedAt: "2026-06-12T00:00:00Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: "https://www.openstreetmap.org/copyright",
};
const hole = normalizeGolfCourse(fixture as OverpassResponse, source).holes[0];
const projectionResult = createProjection(holeCoordinates(hole));
if ("kind" in projectionResult) throw new Error(projectionResult.kind);
const projection: Projection = projectionResult;
const club: ClubV2 = { id: "p-0123456789ab", label: "7 Iron", carry: 150, longitudinal: 30, lateral: 20 };

function target(id: string, x: number, y: number): TargetV1 {
  return { id, label: id, ...inverseProject(projection, { x, y }) };
}

function model(origin: TargetV1, destination: TargetV1, selectedClub = club) {
  return dispersionEllipse({
    club: selectedClub,
    origin: { kind: "target", targetId: origin.id },
    target: destination,
    hole,
    targets: [origin, destination],
    projection,
  });
}

describe("dispersion ellipse", () => {
  it("uses exact yard conversion, half-width radii, and 64 samples", () => {
    const result = model(target("t-000000000001", 200, 300), target("t-000000000002", 500, 300));
    expect("kind" in result).toBe(false);
    if ("kind" in result) return;
    expect(result.points).toHaveLength(DISPERSION_SAMPLES);
    expect(result.longitudinalRadius).toBeCloseTo(30 / YARDS_PER_METER / 2 * projection.scale, 10);
    expect(result.lateralRadius).toBeCloseTo(20 / YARDS_PER_METER / 2 * projection.scale, 10);
    expect(result.center.x).toBeCloseTo(200 + 150 / YARDS_PER_METER * projection.scale, 8);
    expect(result.center.y).toBeCloseTo(300, 8);
    expect(result.points[0].x - result.center.x).toBeCloseTo(result.longitudinalRadius, 10);
    expect(result.points[16].y - result.center.y).toBeCloseTo(result.lateralRadius, 10);
  });

  it("orients the longitudinal axis at cardinal and diagonal bearings", () => {
    const vertical = model(target("t-000000000001", 300, 200), target("t-000000000002", 300, 500));
    if ("kind" in vertical) throw new Error(vertical.kind);
    expect(vertical.center.x).toBeCloseTo(300, 8);
    expect(vertical.center.y).toBeGreaterThan(200);
    expect(vertical.points[0].x).toBeCloseTo(vertical.center.x, 10);
    expect(vertical.points[0].y - vertical.center.y).toBeCloseTo(vertical.longitudinalRadius, 10);

    const diagonal = model(target("t-000000000003", 200, 200), target("t-000000000004", 400, 400));
    if ("kind" in diagonal) throw new Error(diagonal.kind);
    expect(diagonal.center.x - 200).toBeCloseTo(diagonal.center.y - 200, 8);
    expect(diagonal.points[0].x - diagonal.center.x).toBeCloseTo(diagonal.points[0].y - diagonal.center.y, 8);
  });

  it("detects a rotated ellipse outside the inner map bounds", () => {
    const result = model(target("t-000000000001", 740, 300), target("t-000000000002", 750, 310),
      { ...club, carry: 1, longitudinal: 200, lateral: 200 });
    if ("kind" in result) throw new Error(result.kind);
    expect(result.offMap).toBe(true);
    expect(result.points.some(({ x }) => x > 760)).toBe(true);
  });

  it("returns deterministic suppression reasons", () => {
    const origin = target("t-000000000001", 300, 300);
    const destination = target("t-000000000002", 500, 300);
    const base = { club, origin: { kind: "target", targetId: origin.id } as const, target: destination, hole, targets: [origin, destination], projection };
    expect(dispersionEllipse({ ...base, club: null })).toEqual({ kind: "club-unavailable" });
    expect(dispersionEllipse({ ...base, projection: null })).toEqual({ kind: "projection-unavailable" });
    expect(dispersionEllipse({ ...base, target: null })).toEqual({ kind: "target-unavailable" });
    expect(dispersionEllipse({ ...base, origin: null })).toEqual({ kind: "origin-unavailable" });
    expect(dispersionEllipse({ ...base, origin: { kind: "target", targetId: "t-ffffffffffff" } })).toEqual({ kind: "origin-unavailable" });
    expect(dispersionEllipse({ ...base, target: origin })).toEqual({ kind: "degenerate-target-line" });
  });
});
