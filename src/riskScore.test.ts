import { describe, expect, it } from "vitest";
import { createProjection, EARTH_RADIUS_M, type Projection } from "./map";
import { normalizeGolfCourse, type Coordinate, type NormalizedFeature, type NormalizedHole } from "./normalize";
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

  it("reports every shared unavailable prerequisite and missing mapped geometry", () => {
    const destination = target("t-000000000001", 300, 0);
    const targets = [target("t-000000000000", 0, 0), destination];
    for (const [input, warning] of [
      [{ projection: null }, "projection-unavailable"],
      [{ club: null }, "club-unavailable"],
      [{ origin: null }, "origin-unavailable"],
      [{ origin: { kind: "target", targetId: "t-ffffffffffff" } }, "origin-unavailable"],
      [{ hole: hole([]) }, "missing-risk-geometry"],
    ] as const) {
      const result = scoreTargetRisks({ club, origin: { kind: "target", targetId: targets[0].id }, projection, hole: hole([water(square(1000, 1000, 5))]), targets, ...input });
      expect(result.candidates.every((candidate) => candidate.penalty === null && candidate.warnings.includes(warning))).toBe(true);
    }
  });

  it("counts a boundary sample with a fixed metre tolerance on short and ordinary edges", () => {
    const origin = target("t-000000000000", 0, 0);
    const destination = target("t-000000000001", 300, 0);
    const edgeX = 100 * .9144 + 80 * .9144 / 2;
    const shortEdge = water([[edgeX, -.025], [edgeX, .025], [edgeX + .1, .025], [edgeX + .1, -.025], [edgeX, -.025]]);
    const ordinaryEdge = water([[edgeX + .005, -5], [edgeX + .005, 5], [edgeX + 1, 5], [edgeX + 1, -5], [edgeX + .005, -5]]);
    for (const feature of [shortEdge, ordinaryEdge]) {
      const result = scoreTargetRisks({ club, origin: { kind: "target", targetId: origin.id }, projection, hole: hole([feature]), targets: [origin, destination] });
      expect(result.candidates.find(({ targetId }) => targetId === destination.id)?.overlapSamples).toBeGreaterThan(0);
    }
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

describe("mapped-water contract regressions", () => {
  const origin = target("t-000000000000", 0, 0);
  const destination = target("t-000000000001", 300, 0);
  const base = { club, projection, origin: { kind: "target" as const, targetId: origin.id }, targets: [origin, destination] };
  const score = (features: NormalizedFeature[]) => scoreTargetRisks({ ...base, hole: hole(features) });
  const row = (features: NormalizedFeature[]) => score(features).candidates[1];

  it("locks marginal and unsafe interior-only weighted overlap and counts polygon unions once", () => {
    for (const [radiusFraction, penalty, status] of [[3.5 / 8, 14, "marginal"], [4.5 / 8, 25, "unsafe"]] as const) {
      const points: Array<[number, number]> = Array.from({ length: 64 }, (_, i) => {
        const angle = i / 64 * 2 * Math.PI;
        return [91.44 + 36.576 * radiusFraction * Math.cos(angle), 36.576 * radiusFraction * Math.sin(angle)];
      });
      points.push(points[0]);
      const polygon = water(points);
      expect(row([polygon])).toMatchObject({ penalty, status, sampleCount: 512 });
      expect(row([polygon, polygon])).toEqual(row([polygon]));
      expect(row([water([...points].reverse())])).toEqual(row([polygon]));
    }
  });

  it("excludes other geometry and reports invalid polygon evidence without suppressing valid water", () => {
    const polygon = water(square(91.44, 0, 100));
    const invalid = [
      water([[0, 0], [1, 1], [2, 2], [0, 0]]), // zero area
      water([[0, 0], [100, 100], [0, 100], [50, 0], [0, 0]]), // crossing, nonzero signed area
      water([[0, 0], [1, 1], [0, 0], [1, 1], [0, 0]]), // two vertices
      water([[0, 0], [1, 0], [1, 1], [0, 1]]), // open
      { ...polygon, geometry: { type: "polygon" as const, coordinates: [coordinate(0, 0), { lat: 91, lon: 0 }, coordinate(0, 2), coordinate(0, 0)] } },
      { ...polygon, geometry: { type: "polygon" as const, coordinates: [coordinate(0, 0), { lat: NaN, lon: 0 }, coordinate(0, 2), coordinate(0, 0)] } },
    ];
    const excluded: NormalizedFeature[] = [
      ...(["generic-water", "bunker", "vegetation", "fairway", "rough", "green", "tee"] as const).map((kind) => ({ ...polygon, kind })),
      { ...polygon, geometry: { type: "point", coordinate: coordinate(91.44, 0) } },
      { ...polygon, geometry: { type: "line", coordinates: [coordinate(0, 0), coordinate(200, 0)] } },
      { ...polygon, geometry: null },
    ];
    expect(row(excluded)).toMatchObject({ status: "unavailable", penalty: null, warnings: ["missing-risk-geometry"] });
    for (const bad of invalid) {
      expect(row([bad])).toMatchObject({ status: "unavailable", penalty: null, warnings: ["irregular-risk-polygon", "missing-risk-geometry"] });
      expect(row([bad, polygon])).toMatchObject({ penalty: 100, warnings: ["irregular-risk-polygon"] });
    }
    const repeated = water([[0, -100], [200, -100], [200, -100], [200, 100], [0, 100], [0, -100]]);
    expect(row([repeated])).toMatchObject({ penalty: 100, warnings: [] });
  });

  it("keeps endpoint tolerance in metres across edge lengths and viewport scales", () => {
    const edgeX = 91.44 + 36.576;
    for (const length of [.05, 10]) for (const scale of [.5, 1, 1.5]) {
      for (const [gap, expected] of [[.005, 1], [.009, 0], [.02, 0]]) {
        const polygon = water([[edgeX + gap, gap], [edgeX + .1, gap], [edgeX + .1, length + gap], [edgeX + gap, length + gap], [edgeX + gap, gap]]);
        const result = scoreTargetRisks({ ...base, projection: { ...projection, scale }, hole: hole([polygon]) });
        expect(result.candidates[1].overlapSamples).toBe(expected);
      }
    }
  });

  it("rejects origin, invalid and sub-centimetre target lines while preserving other candidates", () => {
    const result = scoreTargetRisks({ ...base, hole: hole([water(square(91.44, 0, 100))]), targets: [
      ...base.targets, target("t-000000000002", .005, 0), { ...target("t-000000000003", 0, 0), lat: NaN },
    ] });
    expect(result.candidates.filter(({ penalty }) => penalty === null)).toHaveLength(3);
    expect(result.candidates[1]).toMatchObject({ penalty: 100 });
    expect(result.candidates[0].warnings).toEqual(["degenerate-target-line"]);
    const polar = createProjection([{ lat: 90, lon: 0 }]);
    expect(polar).toEqual({ kind: "near-pole" });
    expect(scoreTargetRisks({ ...base, projection: "kind" in polar ? null : polar, hole: hole([]) }).candidates[1])
      .toMatchObject({ penalty: null, warnings: ["projection-unavailable"] });
  });

  it("does not score raw out-of-bounds or unassociated mapped water and does not mutate inputs", () => {
    const ring = square(91.44, 0, 100).map(([x, y]) => coordinate(x, y));
    const normalized = normalizeGolfCourse({ elements: [
      { type: "way", id: 99, tags: { leisure: "golf_course" }, geometry: square(150, 0, 500).map(([x,y])=>coordinate(x,y)) },
      { type: "way", id: 1, tags: { golf: "hole", ref: "1" }, geometry: [coordinate(0, 0), coordinate(300, 0)] },
      { type: "way", id: 2, tags: { golf: "out_of_bounds", ref: "1" }, geometry: ring },
      { type: "way", id: 3, tags: { golf: "water_hazard" }, geometry: ring },
    ] }, { query: "synthetic", endpoint: "https://example.invalid", completedAt: "2026-10-28T00:00:00Z", bbox: "0,0,1,1", copyrightUrl: "https://www.openstreetmap.org/copyright" });
    expect(normalized.unassociatedFeatures.map(({ kind }) => kind)).toEqual(["golf-water"]);
    const input = { ...base, hole: normalized.holes[0] };
    const before = structuredClone(input);
    expect(scoreTargetRisks(input).candidates[1]).toMatchObject({ penalty: null, warnings: ["missing-risk-geometry"] });
    expect(input).toEqual(before);
  });
});
