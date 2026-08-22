import { describe, expect, it } from "vitest";
import { EARTH_RADIUS_M, type Projection } from "./map";
import type { Coordinate, NormalizedFeature, NormalizedHole } from "./normalize";
import type { ClubV2, TargetV1 } from "./project";
import { RISK_SAMPLE_COUNT, scoreTargetRisks } from "./riskScore";

const projection: Projection = {
  center: { lat: 0, lon: 0 }, cosLat: 1, scale: 1,
  minX: 0, minY: 0, offsetX: 400, offsetY: 300,
};
const club: ClubV2 = { id: "p-000000000001", label: "Test club", carry: 100, longitudinal: 80, lateral: 80 };

function coordinate(x: number, y: number): Coordinate {
  return { lat: -y / EARTH_RADIUS_M * 180 / Math.PI, lon: x / EARTH_RADIUS_M * 180 / Math.PI };
}
function target(id: string, x: number, y: number): TargetV1 {
  return { id, label: id, ...coordinate(x, y) };
}
function water(points: Array<[number, number]>, kind: NormalizedFeature["kind"] = "golf-water"): NormalizedFeature {
  const coordinates = points.map(([x, y]) => coordinate(x, y));
  return {
    kind, classifiedBy: kind === "golf-water" ? ["golf", "water_hazard"] : ["natural", "water"],
    source: { sourceKey: "way/7", type: "way", id: 7, tags: {} },
    geometry: { type: "polygon", coordinates },
  };
}
function hole(features: NormalizedFeature[]): NormalizedHole {
  return {
    number: 1, par: 4, source: { sourceKey: "way/1", type: "way", id: 1, tags: {} },
    route: { type: "line", coordinates: [coordinate(0, 0), coordinate(300, 0)] }, features,
  };
}
function square(x: number, y: number, radius: number): Array<[number, number]> {
  return [[x - radius, y - radius], [x + radius, y - radius], [x + radius, y + radius], [x - radius, y + radius], [x - radius, y - radius]];
}

describe("scoreTargetRisks", () => {
  it("returns the specified empty comparison before evaluating prerequisites", () => {
    expect(scoreTargetRisks({ club: null, origin: null, hole: hole([]), projection: null, targets: [] }))
      .toEqual({ candidates: [], lowestRiskTargetId: null, warnings: [] });
  });

  it("scores safe and unsafe mapped golf-water cases without treating generic water as risk", () => {
    const destination = target("t-000000000001", 300, 0);
    const landingX = 100 * 0.9144;
    const safe = scoreTargetRisks({
      club, origin: { kind: "target", targetId: "t-000000000000" }, projection,
      hole: hole([water(square(landingX, 150, 5)), water(square(landingX, 0, 100), "generic-water")]),
      targets: [target("t-000000000000", 0, 0), destination],
    });
    expect(safe.candidates.find(({ targetId }) => targetId === destination.id)).toMatchObject({ penalty: 0, status: "safe", sampleCount: RISK_SAMPLE_COUNT });

    const unsafe = scoreTargetRisks({
      club, origin: { kind: "target", targetId: "t-000000000000" }, projection,
      hole: hole([water(square(landingX, 0, 100))]),
      targets: [target("t-000000000000", 0, 0), destination],
    });
    expect(unsafe.candidates.find(({ targetId }) => targetId === destination.id)).toMatchObject({ penalty: 100, status: "unsafe" });
  });

  it("uses target ID order for deterministic ties", () => {
    const origin = target("t-000000000000", 0, 0);
    const first = target("t-000000000001", 300, 0);
    const second = target("t-000000000002", 300, 50);
    const result = scoreTargetRisks({ club, origin: { kind: "target", targetId: origin.id }, projection,
      hole: hole([water(square(1000, 1000, 5))]), targets: [second, first, origin] });
    expect(result.candidates.map(({ targetId }) => targetId)).toEqual([origin.id, first.id, second.id]);
    expect(result.lowestRiskTargetId).toBe(first.id);
  });

  it("keeps an off-map target unavailable without suppressing a scoreable target", () => {
    const origin = target("t-000000000000", 0, 0);
    const onMap = target("t-000000000001", 300, 0);
    const offMap = target("t-000000000002", 0, 300);
    const result = scoreTargetRisks({ ...{ club: { ...club, carry: 300 }, origin: { kind: "target" as const, targetId: origin.id }, projection },
      hole: hole([water(square(674.32, 300, 100)), water(square(400, 574.32, 100))]), targets: [origin, onMap, offMap] });
    expect(result.candidates.find(({ targetId }) => targetId === onMap.id)?.penalty).not.toBeNull();
    expect(result.candidates.find(({ targetId }) => targetId === offMap.id)).toMatchObject({ penalty: null, warnings: ["off-map"] });
  });

  it("documents the disclosed fixed-grid radial and angular sampling limit", () => {
    const origin = target("t-000000000000", 0, 0);
    const destination = target("t-000000000001", 300, 0);
    const landingX = 100 * 0.9144;
    const longitudinalRadius = 80 * 0.9144 / 2;
    // This thin polygon overlaps the ellipse between r=0.5 and r=0.625, but no fixed sample hits it.
    const gap = water([[landingX + longitudinalRadius * .56 - .05, -.05], [landingX + longitudinalRadius * .56 + .05, -.05], [landingX + longitudinalRadius * .56 + .05, .05], [landingX + longitudinalRadius * .56 - .05, .05], [landingX + longitudinalRadius * .56 - .05, -.05]]);
    const result = scoreTargetRisks({ club, origin: { kind: "target", targetId: origin.id }, projection, hole: hole([gap]), targets: [origin, destination] });
    expect(result.candidates.find(({ targetId }) => targetId === destination.id)).toMatchObject({ penalty: 0, status: "safe" });
  });
});
