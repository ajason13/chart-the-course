import { jsPDF } from "jspdf";
import "svg2pdf.js";
import { getDocument, GlobalWorkerOptions, OPS } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type PDFDocument from "pdfkit";
import { createCtc014ExportScene, type Ctc014ExportScene, type ExportGeometry, type ExportStyle } from "./ctc014Scene";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type PdfEvidence = {
  bytes: number;
  pages: number;
  width: number;
  height: number;
  text: string;
  pathOperations: number;
  imageOperations: number;
  dashPatterns: number[][];
};

function hex(value: string | null): [number, number, number] | null {
  if (!value) return null;
  const match = /^#([0-9a-f]{6})$/i.exec(value);
  if (!match) throw new Error(`Unsupported color ${value}`);
  return [0, 2, 4].map((index) => Number.parseInt(match[1].slice(index, index + 2), 16)) as [number, number, number];
}

function setStyle(doc: jsPDF, style: ExportStyle, scale: number) {
  const stroke = hex(style.stroke);
  const fill = hex(style.fill);
  if (stroke) doc.setDrawColor(...stroke);
  if (fill) doc.setFillColor(...fill);
  doc.setLineWidth(Math.max(0.5, style.strokeWidth * scale));
  doc.setLineDashPattern(style.dash.map((value) => value * scale), 0);
}

function pagePoint(scene: Ctc014ExportScene, point: { x: number; y: number }) {
  return {
    x: scene.map.transform.translateX + point.x * scene.map.transform.scale,
    y: scene.map.transform.translateY + point.y * scene.map.transform.scale,
  };
}

function drawGeometry(doc: jsPDF, scene: Ctc014ExportScene, geometry: ExportGeometry) {
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

export function renderJsPdfDirect(scene = createCtc014ExportScene()): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: [scene.page.width, scene.page.height], orientation: "portrait", compress: false });
  doc.setFont("Helvetica", "normal");
  scene.map.geometry.forEach((geometry) => drawGeometry(doc, scene, geometry));
  scene.map.labels.forEach((label) => {
    const point = pagePoint(scene, label);
    doc.setFontSize(Math.max(7, label.size * scene.map.transform.scale));
    doc.text(label.text, point.x, point.y);
  });
  const scaleStart = pagePoint(scene, scene.map.scaleBar.start);
  const scaleEnd = pagePoint(scene, scene.map.scaleBar.end);
  doc.line(scaleStart.x, scaleStart.y, scaleEnd.x, scaleEnd.y);
  doc.setFontSize(7);
  doc.text(scene.map.scaleBar.label, scaleStart.x, scaleStart.y - 4);
  scene.text.forEach((entry) => {
    doc.setFontSize(entry.size);
    doc.text(entry.text, entry.x, entry.y);
  });
  return new Uint8Array(doc.output("arraybuffer"));
}

function svgForScene(scene: Ctc014ExportScene): SVGSVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 800 600");
  svg.setAttribute("width", String(800 * scene.map.transform.scale));
  svg.setAttribute("height", String(600 * scene.map.transform.scale));
  for (const geometry of scene.map.geometry) {
    let element: SVGElement;
    if (geometry.type === "point") {
      element = document.createElementNS(ns, "circle");
      element.setAttribute("cx", String(geometry.point.x));
      element.setAttribute("cy", String(geometry.point.y));
      element.setAttribute("r", String(geometry.radius));
    } else {
      element = document.createElementNS(ns, geometry.type === "polygon" ? "polygon" : "polyline");
      element.setAttribute("points", geometry.points.map(({ x, y }) => `${x},${y}`).join(" "));
    }
    element.setAttribute("fill", geometry.style.fill ?? "none");
    element.setAttribute("stroke", geometry.style.stroke ?? "none");
    element.setAttribute("stroke-width", String(geometry.style.strokeWidth));
    if (geometry.style.dash.length) element.setAttribute("stroke-dasharray", geometry.style.dash.join(" "));
    svg.appendChild(element);
  }
  for (const label of scene.map.labels) {
    const text = document.createElementNS(ns, "text");
    text.setAttribute("x", String(label.x));
    text.setAttribute("y", String(label.y));
    text.setAttribute("font-size", String(label.size));
    text.textContent = label.text;
    svg.appendChild(text);
  }
  const scaleBar = document.createElementNS(ns, "line");
  scaleBar.setAttribute("x1", String(scene.map.scaleBar.start.x));
  scaleBar.setAttribute("y1", String(scene.map.scaleBar.start.y));
  scaleBar.setAttribute("x2", String(scene.map.scaleBar.end.x));
  scaleBar.setAttribute("y2", String(scene.map.scaleBar.end.y));
  scaleBar.setAttribute("stroke", "#17211b");
  scaleBar.setAttribute("stroke-width", "2");
  svg.appendChild(scaleBar);
  const scaleLabel = document.createElementNS(ns, "text");
  scaleLabel.setAttribute("x", String(scene.map.scaleBar.start.x));
  scaleLabel.setAttribute("y", String(scene.map.scaleBar.start.y - 6));
  scaleLabel.setAttribute("font-size", "12");
  scaleLabel.textContent = scene.map.scaleBar.label;
  svg.appendChild(scaleLabel);
  return svg;
}

export async function renderJsPdfSvg(scene = createCtc014ExportScene()): Promise<Uint8Array> {
  const doc = new jsPDF({ unit: "pt", format: [scene.page.width, scene.page.height], orientation: "portrait", compress: false });
  await doc.svg(svgForScene(scene), {
    x: scene.map.transform.translateX,
    y: scene.map.transform.translateY,
    width: 800 * scene.map.transform.scale,
    height: 600 * scene.map.transform.scale,
  });
  doc.setFont("Helvetica", "normal");
  scene.text.forEach((entry) => {
    doc.setFontSize(entry.size);
    doc.text(entry.text, entry.x, entry.y);
  });
  return new Uint8Array(doc.output("arraybuffer"));
}

async function pdfKitBytes(render: (doc: PDFDocument) => void): Promise<Uint8Array> {
  const [{ default: PdfKitDocument }, { default: blobStream }] = await Promise.all([
    import("pdfkit"),
    import("blob-stream"),
  ]);
  return new Promise((resolve, reject) => {
    const doc = new PdfKitDocument({ size: [612, 792], margin: 0, autoFirstPage: true });
    const stream = doc.pipe(blobStream());
    stream.on("finish", async () => resolve(new Uint8Array(await stream.toBlob("application/pdf").arrayBuffer())));
    stream.on("error", reject);
    render(doc);
    doc.end();
  });
}

function setPdfKitStyle(doc: PDFDocument, style: ExportStyle, scale: number) {
  if (style.stroke) doc.strokeColor(style.stroke);
  if (style.fill) doc.fillColor(style.fill);
  doc.lineWidth(Math.max(0.5, style.strokeWidth * scale));
  doc.dash(style.dash.length ? style.dash[0] * scale : 0, { space: (style.dash[1] ?? style.dash[0] ?? 0) * scale });
}

export function renderPdfKitDirect(scene = createCtc014ExportScene()): Promise<Uint8Array> {
  return pdfKitBytes((doc) => {
    for (const geometry of scene.map.geometry) {
      setPdfKitStyle(doc, geometry.style, scene.map.transform.scale);
      if (geometry.type === "point") {
        const point = pagePoint(scene, geometry.point);
        doc.circle(point.x, point.y, geometry.radius * scene.map.transform.scale);
      } else {
        const points = geometry.points.map((point) => pagePoint(scene, point));
        doc.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach((point) => doc.lineTo(point.x, point.y));
        if (geometry.type === "polygon") doc.closePath();
      }
      if (geometry.style.fill && geometry.style.stroke) doc.fillAndStroke();
      else if (geometry.style.fill) doc.fill();
      else doc.stroke();
    }
    doc.font("Helvetica");
    scene.text.forEach((entry) => doc.fontSize(entry.size).fillColor("#17211b").text(entry.text, entry.x, entry.y, { lineBreak: false }));
  });
}

export async function renderPdfKitSvg(scene = createCtc014ExportScene()): Promise<Uint8Array> {
  const { default: SVGtoPDF } = await import("svg-to-pdfkit");
  return pdfKitBytes((doc) => {
    SVGtoPDF(doc, svgForScene(scene).outerHTML, scene.map.transform.translateX, scene.map.transform.translateY, {
      width: 800 * scene.map.transform.scale,
      height: 600 * scene.map.transform.scale,
      assumePt: true,
    });
    doc.font("Helvetica");
    scene.text.forEach((entry) => doc.fontSize(entry.size).fillColor("#17211b").text(entry.text, entry.x, entry.y, { lineBreak: false }));
  });
}

export async function analyzePdf(data: Uint8Array): Promise<PdfEvidence> {
  const bytes = data.byteLength;
  const task = getDocument({ data });
  const pdf = await task.promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1 });
  const text = await page.getTextContent();
  const operators = await page.getOperatorList();
  const pathIds = new Set([OPS.constructPath, OPS.stroke, OPS.fill, OPS.eoFill, OPS.fillStroke, OPS.eoFillStroke]);
  const imageIds = new Set([OPS.paintImageXObject, OPS.paintInlineImageXObject, OPS.paintImageMaskXObject]);
  const dashPatterns = operators.fnArray.flatMap((operation, index) => {
    if (operation !== OPS.setDash) return [];
    const pattern = operators.argsArray[index]?.[0];
    return Array.isArray(pattern) ? [pattern.map(Number)] : [];
  });
  return {
    bytes,
    pages: pdf.numPages,
    width: viewport.width,
    height: viewport.height,
    text: text.items.map((item) => "str" in item ? item.str : "").join(" "),
    pathOperations: operators.fnArray.filter((operation) => pathIds.has(operation)).length,
    imageOperations: operators.fnArray.filter((operation) => imageIds.has(operation)).length,
    dashPatterns,
  };
}
