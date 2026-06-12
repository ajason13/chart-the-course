import { describe, expect, it } from "vitest";
import {
  CTC014_ATTRIBUTION,
  CTC014_ATTRIBUTION_URL,
  CTC014_COURSE_SOURCE_KEY,
  CTC014_HOLE_SOURCE_KEY,
  MAP_REGION,
  createCtc014ExportScene,
} from "./ctc014Scene";

describe("CTC-014 export scene", () => {
  it("builds a deterministic pure scene from current fixture contracts", () => {
    const first = createCtc014ExportScene();
    const second = createCtc014ExportScene();
    expect(second).toEqual(first);
    expect(first.courseSourceKey).toBe(CTC014_COURSE_SOURCE_KEY);
    expect(first.holeSourceKey).toBe(CTC014_HOLE_SOURCE_KEY);
    expect(first.map.region).toEqual(MAP_REGION);
    expect(first.page).toEqual({ width: 612, height: 792, margin: 36 });
  });

  it("includes every selected-hole layer plus vector target and carry evidence", () => {
    const scene = createCtc014ExportScene();
    const kinds = scene.map.geometry.map(({ kind }) => kind);
    expect(kinds).toEqual(expect.arrayContaining([
      "vegetation", "generic-water", "golf-water", "rough", "fairway",
      "bunker", "green", "tee", "route", "carry-arc", "target",
    ]));
    expect(scene.map.geometry.every(({ style }) => style.strokeWidth > 0)).toBe(true);
    expect(scene.map.geometry.filter(({ kind }) => ["route", "carry-arc", "rough"].includes(kind))
      .every(({ style }) => style.dash.length > 0)).toBe(true);
  });

  it("keeps required static notes, disclaimer, and full attribution text", () => {
    const scene = createCtc014ExportScene();
    expect(scene.text.find(({ role }) => role === "attribution")?.text).toBe(CTC014_ATTRIBUTION);
    expect(scene.text.find(({ role }) => role === "attribution-url")?.text).toBe(CTC014_ATTRIBUTION_URL);
    expect(scene.text.find(({ role }) => role === "note")?.text).toMatch(/Synthetic/);
    expect(scene.text.find(({ role }) => role === "disclaimer")?.text).toMatch(/Verify before play/);
  });
});
