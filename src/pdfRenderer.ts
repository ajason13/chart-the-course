import { jsPDF } from "jspdf";
import { checkPdfBudget, type PdfTextMetrics } from "./pdfLayout";
import type { PdfMapPrimitive, PdfScene, PdfSceneText } from "./pdfScene";

function document() {
  return new jsPDF({ unit: "pt", format: "letter", orientation: "portrait", compress: true, putOnlyUsedFonts: true });
}

export function pdfFontMetrics(): PdfTextMetrics {
  const doc = document();
  return { width(text, size, weight) {
    doc.setFont("helvetica", weight);
    doc.setFontSize(size);
    return doc.getTextWidth(text);
  } };
}

// Fixed application styles. Source tags never become PDF options or commands.
const styles = {
  vegetation: [235, 80], "generic-water": [215, 90], "golf-water": [190, 45],
  rough: [240, 110], fairway: [222, 80], bunker: [250, 70], green: [195, 40], tee: [170, 30],
  route: [255, 20], target: [255, 0], carry: [255, 30], scale: [255, 0],
} as const;
function finite(...values: number[]) {
  if (!values.every(v => Number.isFinite(v) && Math.abs(v) <= 1e9)) throw new Error("Invalid PDF drawing operand.");
}
function point(p: { x: number; y: number }) { finite(p.x, p.y); }

/** jsPDF 4.2.1 unconditionally writes a view destination into the catalog.
 * Blank that one fixed entry without changing byte offsets or touching content
 * streams. Locate the catalog through trailer/xref, never through user text.
 * Fail closed if the pinned writer changes its catalog or xref syntax. */
function removeDefaultOpenAction(buffer: ArrayBuffer): ArrayBuffer {
  const bytes = new Uint8Array(buffer);
  const raw = new TextDecoder("latin1").decode(bytes);
  const xrefAt = Number(/startxref\s+(\d+)\s+%%EOF\s*$/.exec(raw)?.[1]);
  const xref = /^xref\s+0 (\d+)\s+([\s\S]*?)trailer\s*<<([\s\S]*?)>>/.exec(raw.slice(xrefAt));
  if (!xref) throw new Error("Unsupported PDF xref; no files prepared.");
  const root = Number(/\/Root (\d+) 0 R/.exec(xref[3])?.[1]);
  const entries = xref[2].trim().split(/\r?\n/);
  const entry = entries[root];
  if (!root || !/^\d{10} 00000 n\s*$/.test(entry ?? "")) throw new Error("Invalid PDF catalog reference.");
  const offset = Number(entry.slice(0, 10));
  const catalog = /^(\d+) 0 obj\s*<<\s*\/Type \/Catalog\s+\/Pages \d+ 0 R\s+(\/OpenAction \[3 0 R \/FitH null\])\s+\/PageLayout \/OneColumn\s*>>\s*endobj/.exec(raw.slice(offset));
  if (!catalog || Number(catalog[1]) !== root) throw new Error("Unexpected PDF catalog; no files prepared.");
  const start = offset + catalog[0].indexOf(catalog[2]);
  bytes.fill(32, start, start + catalog[2].length);
  return buffer;
}

/** Draw only the scene vocabulary, with no raw command, HTML, image or URL API. */
export function renderPdf(scene: PdfScene): ArrayBuffer {
  checkPdfBudget("pages", scene.pages.length);
  checkPdfBudget("vertices", scene.budgets.vertices);
  checkPdfBudget("primitives", scene.budgets.primitives);
  const doc = document();
  doc.setProperties({ title: "Chart the Course yardage book", creator: "Chart the Course" });
  doc.setCreationDate(new Date(scene.source.exportedAt));
  const text = (item: PdfSceneText) => {
    finite(item.x, item.y, item.size, item.width);
    if (item.size < 8 || item.x < 36 || item.x + item.width > 576.001 || item.y - item.size < 36 || item.y > 756
      || /[^\x20-\x7e©]/u.test(item.text)) throw new Error("Invalid PDF text box.");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(item.size);
    doc.setTextColor(0);
    doc.text(item.text, item.x, item.y);
  };
  const draw = (primitive: PdfMapPrimitive) => {
    const style = styles[primitive.style];
    if (!style) throw new Error("Unsupported PDF style.");
    const basis = primitive.identity.kind === "source" ? primitive.identity.basis : "source-associated";
    const dash = primitive.style === "carry" ? [6, 2.5, 1.5, 2.5]
      : primitive.style === "route" ? [6, 3]
      : basis === "inferred-candidate" ? [3, 2] : basis === "shared-candidate" ? [6, 2, 1, 2]
      : basis === "course-context" ? [1, 3] : [];
    doc.setFillColor(style[0], style[0], style[0]);
    doc.setDrawColor(style[1]);
    doc.setLineWidth(primitive.style === "target" ? 1.5 : 0.8);
    doc.setLineDashPattern(dash, 0);
    const shape = primitive.shape;
    if (shape.type === "point") {
      point(shape.point); finite(shape.radius);
      if (shape.radius <= 0 || shape.radius > 100) throw new Error("Invalid PDF point radius.");
      doc.circle(shape.point.x, shape.point.y, shape.radius, "FD");
      return;
    }
    const path = (points: { x: number; y: number }[], close: boolean) => {
      if (points.length < (close ? 3 : 2)) throw new Error("Invalid PDF path.");
      points.forEach(point);
      doc.path(points.map((p, i) => ({ op: i === 0 ? "m" : "l", c: [p.x, p.y] })));
      if (close) doc.close();
    };
    if (shape.type === "polyline") { path(shape.points, false); doc.stroke(); }
    else if (shape.type === "area" && shape.fillRule === "evenodd") {
      for (const part of shape.parts) {
        path(part.exterior, true);
        for (const interior of part.interiors) path(interior, true);
        doc.fillStrokeEvenOdd();
      }
    } else throw new Error("Unsupported PDF shape.");
  };
  for (const [index, page] of scene.pages.entries()) {
    if (index) doc.addPage("letter", "portrait");
    page.header.forEach(text);
    if (page.map) {
      doc.setLineDashPattern([], 0);
      doc.setDrawColor(80);
      doc.setLineWidth(0.5);
      doc.rect(36, 96, 540, 390);
      if (page.map.available) {
        doc.saveGraphicsState();
        doc.rect(36, 96, 540, 390, null);
        doc.clip(); doc.discardPath();
        page.map.primitives.forEach(draw);
        page.map.labels.forEach(text);
        doc.restoreGraphicsState();
      } else {
        text({ text: "Map unavailable", field: "map", x: 52, y: 130, width: 100, size: 10 });
      }
    }
    page.rows.forEach(row => row.lines.forEach(text));
    page.footer.forEach(text);
  }
  const bytes = doc.output("arraybuffer");
  checkPdfBudget("bytes", bytes.byteLength);
  if (bytes.byteLength > scene.budgets.maxPdfBytes) throw new Error("PDF exceeds the finished output byte limit; select fewer holes.");
  return removeDefaultOpenAction(bytes);
}
