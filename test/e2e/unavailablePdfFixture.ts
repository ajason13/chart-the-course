import type { PdfScene, PdfSceneText } from "../../src/pdfScene";
const text = (value: string, y: number, size = 10): PdfSceneText => ({ text: value, field: "defensive fixture", x: 36, y, size, width: 500 });
export const scene: PdfScene = {
  page: { width: 612, height: 792, margin: 36 }, courseSourceKey: "way/1", courseTitle: "Defensive renderer fixture",
  source: { kind: "synthetic", text: "", filename: "fixture.json", sha256: "", exportedAt: "2026-10-29T22:00:00.000Z" },
  holes: [], budgets: { pages: 1, vertices: 0, primitives: 5, maxPdfBytes: 10 * 1024 * 1024 },
  pages: [{ kind: "hole", number: 1, holeSourceKey: "way/2", header: [text("Hole 1 (way/2) | Item / details", 50)],
    map: { available: false, reason: "invalid-projection" },
    rows: [{ field: "target", text: "authored row", continuation: false, lines: [text("T1 target t-000000000000; straight-line distance unavailable", 506)] }],
    footer: [text("Synthetic demo - not live OSM data", 704, 8), text("Bundled synthetic geometry; Chart the Course project: Apache-2.0", 718, 8), text("Page 1 / 1", 732, 8)],
  }],
};
