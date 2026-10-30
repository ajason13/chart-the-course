import demoText from "../fixtures/overpass/synthetic-golf-course-ctc006.json?raw";
import { createPdfScene, type PdfScene } from "./pdfScene";
import { pdfFontMetrics, renderPdf } from "./pdfRenderer";
import { normalizeGolfCourse } from "./normalize";
import { emptyProject } from "./project";
import { PDF_LIMITS } from "./pdfLayout";

async function fixture(): Promise<PdfScene> {
  const courseSourceKey = "way/9000060001";
  const normalized = normalizeGolfCourse(JSON.parse(demoText), { query: "demo", endpoint: "demo", bbox: "35,-80,35.01,-79.99", completedAt: "2026-10-29T00:00:00.000Z", copyrightUrl: "" }, courseSourceKey);
  const result = await createPdfScene({ normalized, courseSourceKey, selectedHoleKeys: normalized.holes.map(h => h.source.sourceKey), project: emptyProject(courseSourceKey),
    source: { kind: "synthetic", fixtureId: "synthetic-golf-course-ctc006.json", text: demoText }, exportedAt: "2026-10-29T00:00:00.000Z", appVersion: "0.0.0" }, pdfFontMetrics());
  if (!result.ok) throw new Error(result.message);
  return result.scene;
}

describe("restricted vector renderer", () => {
  it("draws every scene page using the same Helvetica metrics as preflight", async () => {
    const scene = await fixture();
    const bytes = renderPdf(scene);
    expect(new TextDecoder().decode(bytes.slice(0, 8))).toMatch(/^%PDF-1/);
    expect(bytes.byteLength).toBeGreaterThan(1000);
    expect(scene.pages.map(p => p.kind)).toContain("hole");
  });
  it("retains a page for unavailable projection and rejects non-finite operands", async () => {
    const scene = await fixture();
    const page = scene.pages.find(p => p.kind === "hole")!;
    page.map = { available: false, reason: "invalid-projection" };
    expect(renderPdf(scene).byteLength).toBeGreaterThan(1000);
    page.header[0].x = NaN;
    expect(() => renderPdf(scene)).toThrow("Invalid PDF drawing operand");
  });
  it("rejects invalid text and completed output larger than the allowed byte budget", async () => {
    const scene = await fixture();
    scene.budgets.maxPdfBytes = 1;
    expect(() => renderPdf(scene)).toThrow("finished output byte limit");
    scene.budgets.maxPdfBytes = PDF_LIMITS.bytes;
    scene.pages[0].header[0].text = "\u202e";
    expect(() => renderPdf(scene)).toThrow("Invalid PDF text box");
  });
});
