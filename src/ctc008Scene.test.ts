import { describe, expect, it } from "vitest";
import pdfSource from "./ctc008Pdf.ts?raw";
import sceneSource from "./ctc008Scene.ts?raw";
import mainSource from "./ctc008Main.ts?raw";
import {
  CTC008_ATTRIBUTION,
  CTC008_ATTRIBUTION_URL,
  CTC008_FILENAME_FALLBACK,
  CTC008_HOLE_SOURCE_KEY,
  CTC008_NOTE,
  CTC008_TITLE_FALLBACK,
  courseTitleFromTags,
  createCtc008ExportScene,
  formatCtc008PdfFilename,
} from "./ctc008Scene";

describe("CTC-008 export scene", () => {
  it("builds a deterministic dev-only scene from the pinned fixture", () => {
    const first = createCtc008ExportScene();
    const second = createCtc008ExportScene();
    expect(second).toEqual(first);
    expect(first.holeSourceKey).toBe(CTC008_HOLE_SOURCE_KEY);
    expect(first.targetHoleCount).toBe(1);
    expect(first.staticNote).toBe(CTC008_NOTE);
    expect(first.courseTitle).toBe("Synthetic CTC-006 Course");
  });

  it("includes required hole content, vector target, carry dash, and attribution", () => {
    const scene = createCtc008ExportScene();
    expect(scene.map.geometry.map(({ kind }) => kind)).toEqual(expect.arrayContaining([
      "vegetation", "generic-water", "golf-water", "rough", "fairway", "bunker", "green", "tee", "route", "carry-arc", "target",
    ]));
    expect(scene.map.geometry.find(({ kind }) => kind === "carry-arc")?.style.dash).toEqual([12, 5, 3, 5]);
    expect(scene.holeText.map(({ text }) => text)).toContain(CTC008_ATTRIBUTION);
    expect(scene.holeText.map(({ text }) => text)).toContain(CTC008_ATTRIBUTION_URL);
    expect(scene.coverText.map(({ text }) => text).join(" ")).toContain(CTC008_NOTE);
  });

  it("formats deterministic filenames with an invalid timestamp fallback", () => {
    expect(formatCtc008PdfFilename("2026-06-25T01:02:03.000Z")).toBe("ctc-yardage-prototype-20260625T010203Z.pdf");
    expect(formatCtc008PdfFilename("2026-06-25T01:02:03+00:00")).toBe(CTC008_FILENAME_FALLBACK);
  });

  it("keeps risky jsPDF and rejected PDFKit APIs out of the prototype source", () => {
    const source = `${pdfSource}\n${sceneSource}\n${mainSource}`;
    for (const blocked of ["addImage", "createAnnotation", "addJS", "AcroForm", "pdfkit", "svg-to-pdfkit", "blob-stream"]) {
      expect(source).not.toContain(blocked);
    }
    expect(source).not.toMatch(/[.]html\s*[(]/);
  });

  it("keeps live Overpass fetch and query helpers out of the prototype source", () => {
    const source = `${pdfSource}\n${sceneSource}\n${mainSource}`;
    for (const blocked of ["fetchOverpass", "buildDetailQuery", "buildDiscoveryQuery", "sourceMetadata", "serializeBbox", "overpassCache"]) {
      expect(source).not.toContain(blocked);
    }
  });

  it("falls back when the fixture title tag is missing or non-string", () => {
    expect(CTC008_TITLE_FALLBACK).toMatch(/fixture course/);
    expect(courseTitleFromTags({ name: "  " })).toBe(CTC008_TITLE_FALLBACK);
    expect(courseTitleFromTags({ name: 42 })).toBe(CTC008_TITLE_FALLBACK);
    expect(courseTitleFromTags({})).toBe(CTC008_TITLE_FALLBACK);
  });
});
