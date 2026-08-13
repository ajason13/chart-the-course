import { describe, expect, it } from "vitest";
import { estimateFairwayWidth, roundHalfUpNonnegative } from "./fairwayWidth";
import type { Coordinate, NormalizedHole } from "./normalize";

const METERS_PER_DEGREE = 6_371_000 * Math.PI / 180;
const point = (x: number, y: number): Coordinate => ({ lat: y / METERS_PER_DEGREE, lon: x / METERS_PER_DEGREE });
const polygon = (corners: Array<[number, number]>) => corners.map(([x, y]) => point(x, y));

function hole(route: Array<[number, number]>, fairways: Array<Array<[number, number]>>): NormalizedHole {
  return {
    number: 1, par: 4,
    source: { sourceKey: "way/1", type: "way", id: 1, tags: {} },
    route: { type: "line", coordinates: route.map(([x, y]) => point(x, y)) },
    features: fairways.map((corners, index) => ({ kind: "fairway" as const, classifiedBy: ["golf", "fairway"] as const,
      source: { sourceKey: `way/${index + 2}` as "way/2", type: "way" as const, id: index + 2, tags: {} }, geometry: { type: "polygon" as const, coordinates: polygon(corners) } })),
  };
}

const rectangle = (left: number, bottom: number, right: number, top: number): Array<[number, number]> =>
  [[left, bottom], [right, bottom], [right, top], [left, top], [left, bottom]];

describe("fairway width estimator", () => {
  it("measures straight fairways at 220, 250, and 280 yards", () => {
    const selected = hole([[0, 0], [0, 320]], [rectangle(-18, 0, 18, 320)]);
    for (const yards of [220, 250, 280]) {
      const result = estimateFairwayWidth(selected, yards);
      expect(result.widthMeters).toBeCloseTo(36, 5);
      expect(result.warnings).toEqual([]);
    }
  });

  it("follows a dogleg and uses the downstream tangent at its vertex", () => {
    const selected = hole([[0, 0], [0, 200], [240, 200]], [rectangle(0, 180, 240, 220)]);
    const result = estimateFairwayWidth(selected, roundHalfUpNonnegative(200 / 0.9144));
    expect(result.widthMeters).toBeCloseTo(40, 3);
    expect(result.warnings).toEqual([]);
  });

  it("uses the downstream tangent at an exact or epsilon-adjacent carry station vertex", () => {
    const carry250m = 250 * 0.9144;
    for (const offset of [-0.0005, 0, 0.0005]) {
      const selected = hole([[0, 0], [0, carry250m + offset], [240, carry250m + offset]], [rectangle(-120, carry250m - 20, 120, carry250m + 20)]);
      const result = estimateFairwayWidth(selected, 250);
      expect(result.widthMeters).toBeCloseTo(40, 4);
      expect(result.warnings).toEqual([]);
    }
  });

  it("returns a truthful narrow result and distinguishes a sub-epsilon degeneration", () => {
    const narrow = estimateFairwayWidth(hole([[0, 0], [0, 300]], [rectangle(-6.858, 0, 6.858, 300)]), 250);
    expect(narrow.widthMeters).toBeCloseTo(13.716, 3);
    expect(narrow.warnings).toEqual([]);
    const degenerate = estimateFairwayWidth(hole([[0, 0], [0, 300]], [rectangle(-0.004, 0, 0.004, 300)]), 250);
    expect(degenerate.widthMeters).toBeUndefined();
    expect(degenerate.warnings).toContain("unstable-degenerate-width");
  });

  it("measures only the target-line interval in a split fairway and warns for a gap", () => {
    const containing = estimateFairwayWidth(hole([[0, 0], [0, 300]], [rectangle(-10, 0, 10, 300), rectangle(30, 0, 50, 300)]), 250);
    expect(containing.widthMeters).toBeCloseTo(20, 4);
    expect(containing.warnings).toEqual(["split-fairway"]);
    const gap = estimateFairwayWidth(hole([[0, 0], [0, 300]], [rectangle(-50, 0, -30, 300), rectangle(30, 0, 50, 300)]), 250);
    expect(gap.widthMeters).toBeUndefined();
    expect(gap.warnings).toEqual(expect.arrayContaining(["target-line-outside-fairway", "split-fairway"]));
  });

  it("returns typed failures for missing, beyond-route, tangent, and overlapping outlines", () => {
    expect(estimateFairwayWidth(hole([[0, 0], [0, 300]], []), 250).warnings).toEqual(["missing-fairway"]);
    expect(estimateFairwayWidth(hole([[0, 0], [0, 100]], [rectangle(-10, 0, 10, 100)]), 250).warnings).toEqual(["carry-beyond-target-line"]);
    const tangent = estimateFairwayWidth(hole([[0, 0], [0, 300]], [[[0, 228.6], [10, 240], [20, 240], [0, 228.6]]]), 250);
    expect(tangent.warnings).toContain("tangent-fairway-boundary");
    const overlap = estimateFairwayWidth(hole([[0, 0], [0, 300]], [[[-10, 228.6], [10, 228.6], [10, 260], [-10, 260], [-10, 228.6]]]), 250);
    expect(overlap.warnings).toContain("unstable-line-fairway-overlap");
  });

  it("handles concave, overlapping, endpoint, boundary, and mixed-validity fairways", () => {
    const vertical = [[0, 0], [0, 300]] as Array<[number, number]>;
    const concave = estimateFairwayWidth(hole(vertical, [[[-30, 0], [30, 0], [30, 300], [10, 300], [10, 240], [-10, 240], [-10, 300], [-30, 300], [-30, 0]]]), 250);
    expect(concave.widthMeters).toBeCloseTo(60, 4);
    const overlapping = estimateFairwayWidth(hole(vertical, [rectangle(-20, 0, 5, 300), rectangle(-5, 0, 20, 300)]), 250);
    expect(overlapping.widthMeters).toBeCloseTo(40, 4);
    const endpoint = estimateFairwayWidth(hole([[0, 0], [0, 228.6]], [rectangle(-12, 0, 12, 250)]), 250);
    expect(endpoint.widthMeters).toBeCloseTo(24, 4);
    const boundary = estimateFairwayWidth(hole(vertical, [rectangle(0, 0, 20, 300)]), 250);
    expect(boundary.widthMeters).toBeCloseTo(20, 4);
    const mixed = estimateFairwayWidth(hole(vertical, [rectangle(-12, 0, 12, 300), [[-10, 228.6], [10, 228.6], [10, 260], [-10, 260], [-10, 228.6]]]), 250);
    expect(mixed.widthMeters).toBeCloseTo(24, 4);
    expect(mixed.warnings).toContain("unstable-line-fairway-overlap");
  });

  it("rounds non-negative display values half up", () => {
    expect([1.49, 1.5, 1.51].map(roundHalfUpNonnegative)).toEqual([1, 2, 2]);
  });
});
