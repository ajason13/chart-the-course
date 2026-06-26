import { jsPDF } from "jspdf";
import { getDocument, GlobalWorkerOptions, OPS } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  createCtc008ExportScene,
  formatCtc008PdfFilename,
  type Ctc008ExportScene,
  type PdfGeometry,
  type PdfStyle,
  type PdfText,
} from "./ctc008Scene";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export type Ctc008PdfEvidence = {
  bytes: number;
  pages: number;
  width: number;
  height: number;
  text: string;
  pathOperations: number;
  imageOperations: number;
  dashPatterns: number[][];
  rawText: string;
};

function hex(value: string | null): [number, number, number] | null {
  if (!value) return null;
  const match = /^#([0-9a-f]{6})$/i.exec(value);
  if (!match) throw new Error(`Unsupported color ${value}`);
  return [0, 2, 4].map((index) => Number.parseInt(match[1].slice(index, index + 2), 16)) as [number, number, number];
}

function setStyle(doc: jsPDF, style: PdfStyle, scale = 1) {
  const stroke = hex(style.stroke);
  const fill = hex(style.fill);
  if (stroke) doc.setDrawColor(...stroke);
  if (fill) doc.setFillColor(...fill);
  doc.setLineWidth(Math.max(0.5, style.strokeWidth * scale));
  doc.setLineDashPattern(style.dash.map((value) => value * scale), 0);
}

function pagePoint(scene: Ctc008ExportScene, point: { x: number; y: number }) {
  return {
    x: scene.map.transform.translateX + point.x * scene.map.transform.scale,
    y: scene.map.transform.translateY + point.y * scene.map.transform.scale,
  };
}

function safeText(text: string): string {
  // The prototype scene is static fixture text only. Future dynamic text must
  // normalize or reject before reaching this renderer instead of crashing export.
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) {
    throw new Error("PDF prototype text contains unsupported control characters.");
  }
  return text;
}

function pdfJsBytes(data: Uint8Array): Uint8Array {
  const copy = new Uint8Array(data.byteLength);
  copy.set(data);
  return copy;
}

function drawText(doc: jsPDF, entry: PdfText) {
  doc.setFont("Helvetica", entry.style ?? "normal");
  doc.setFontSize(entry.size);
  doc.text(safeText(entry.text), entry.x, entry.y);
  doc.setFont("Helvetica", "normal");
}

function drawGeometry(doc: jsPDF, scene: Ctc008ExportScene, geometry: PdfGeometry) {
  setStyle(doc, geometry.style, scene.map.transform.scale);
  if (geometry.type === "point") {
    const point = pagePoint(scene, geometry.point);
    doc.circle(point.x, point.y, geometry.radius * scene.map.transform.scale, geometry.style.fill ? "FD" : "S");
    return;
  }
  const points = geometry.points.map((point) => pagePoint(scene, point));
  doc.lines(points.slice(1).map((point, index) => [point.x - points[index].x, point.y - points[index].y]),
    points[0].x, points[0].y, [1, 1], geometry.type === "polygon" ? "FD" : "S", geometry.type === "polygon");
}

function drawFrame(doc: jsPDF, scene: Ctc008ExportScene) {
  doc.setDrawColor(30, 38, 32);
  doc.setLineWidth(1);
  doc.setLineDashPattern([], 0);
  doc.rect(scene.page.margin, scene.page.margin, scene.page.width - scene.page.margin * 2, scene.page.height - scene.page.margin * 2, "S");
}

export function renderCtc008Pdf(scene = createCtc008ExportScene()): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: [scene.page.width, scene.page.height], orientation: "portrait", compress: false });
  doc.setProperties({ title: "CTC-008 fixture yardage book prototype", creator: "Chart the Course" });
  drawFrame(doc, scene);
  scene.coverText.forEach((entry) => drawText(doc, entry));

  doc.addPage([scene.page.width, scene.page.height], "portrait");
  drawFrame(doc, scene);
  scene.summaryText.forEach((entry) => drawText(doc, entry));
  let rowY = 210;
  for (const row of scene.yardageRows) {
    doc.line(36, rowY - 12, 360, rowY - 12);
    drawText(doc, { text: row.label, x: 42, y: rowY, size: 10, style: "bold" });
    drawText(doc, { text: row.value, x: 180, y: rowY, size: 10 });
    rowY += 26;
  }

  doc.addPage([scene.page.width, scene.page.height], "portrait");
  drawFrame(doc, scene);
  scene.holeText.slice(0, 2).forEach((entry) => drawText(doc, entry));
  scene.map.geometry.forEach((geometry) => drawGeometry(doc, scene, geometry));
  scene.map.labels.forEach((label) => {
    const point = pagePoint(scene, label);
    drawText(doc, { ...label, x: point.x, y: point.y, size: Math.max(7, label.size * scene.map.transform.scale) });
  });
  const scaleStart = pagePoint(scene, scene.map.scaleBar.start);
  const scaleEnd = pagePoint(scene, scene.map.scaleBar.end);
  doc.setLineDashPattern([], 0);
  doc.line(scaleStart.x, scaleStart.y, scaleEnd.x, scaleEnd.y);
  drawText(doc, { text: scene.map.scaleBar.label, x: scaleStart.x, y: scaleStart.y - 4, size: 7 });
  scene.holeText.slice(2).forEach((entry) => drawText(doc, entry));

  return new Uint8Array(doc.output("arraybuffer"));
}

export function ctc008DownloadFilename(exportedAt = new Date().toISOString()): string {
  return formatCtc008PdfFilename(exportedAt);
}

export async function analyzeCtc008Pdf(data: Uint8Array): Promise<Ctc008PdfEvidence> {
  const bytes = data.byteLength;
  const rawText = new TextDecoder("latin1").decode(data);
  const pdf = await getDocument({ data: pdfJsBytes(data) }).promise;
  let text = "";
  let pathOperations = 0;
  let imageOperations = 0;
  const dashPatterns: number[][] = [];
  let width = 0;
  let height = 0;
  const pathIds = new Set([OPS.constructPath, OPS.stroke, OPS.fill, OPS.eoFill, OPS.fillStroke, OPS.eoFillStroke]);
  const imageIds = new Set([OPS.paintImageXObject, OPS.paintInlineImageXObject, OPS.paintImageMaskXObject]);
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    if (pageNumber === 1) {
      width = viewport.width;
      height = viewport.height;
    }
    const content = await page.getTextContent();
    text += ` ${content.items.map((item) => "str" in item ? item.str : "").join(" ")}`;
    const operators = await page.getOperatorList();
    pathOperations += operators.fnArray.filter((operation) => pathIds.has(operation)).length;
    imageOperations += operators.fnArray.filter((operation) => imageIds.has(operation)).length;
    operators.fnArray.forEach((operation, index) => {
      if (operation !== OPS.setDash) return;
      const pattern = operators.argsArray[index]?.[0];
      if (Array.isArray(pattern)) dashPatterns.push(pattern.map(Number));
    });
  }
  return { bytes, pages: pdf.numPages, width, height, text: text.trim(), pathOperations, imageOperations, dashPatterns, rawText };
}

export async function renderCtc008PageToCanvas(data: Uint8Array, pageNumber: number, canvas: HTMLCanvasElement): Promise<void> {
  const pdf = await getDocument({ data: pdfJsBytes(data) }).promise;
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1 });
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context unavailable.");
  await page.render({ canvas, canvasContext: context, viewport }).promise;
}
