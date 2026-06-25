# CTC-008 Claude Final Audit Prompt

## Role

You are Claude performing the final adversarial audit for Chart the Course task CTC-008. Review the implementation committed on branch `ctc-008-pdf-prototype`. Focus on correctness, security, licensing/attribution, governance compliance, test adequacy, and whether the task can move from `4. Final Audit (Claude)` to Done after any minor fixes.

## Verdict Format

Return exactly one of:

- `PASS`
- `PASS WITH MINOR FIXES`
- `FAIL`

Lead with blockers, then minor findings, missing tests, residual risks, and final disposition. State explicitly whether CTC-008 may be marked Done after fixes if the verdict is not FAIL.

## Task And Governance Context

CTC-008 implements a dev-only, fixture-backed browser-local PDF yardage book prototype. It must not ship production PDF export behavior or production PDF UI in `src/App.tsx`. It must keep `jspdf@4.2.1` as an existing devDependency only; no production dependency movement and no new devDependencies are authorized. The prototype must use only `fixtures/overpass/synthetic-golf-course-ctc006.json`, render exactly the single fixture hole `way/9000060101`, and use literal static prototype notes. It must include searchable OSM attribution and `https://www.openstreetmap.org/copyright` on the map-bearing PDF page.

Claude QA planning previously returned `READY FOR IMPLEMENTATION AFTER QA PLAN` with no blockers. Codex recorded RC-1 through RC-8 and MC-1 through MC-4 before implementation. Final Claude audit remains mandatory.

## Implementation Commit

Branch: `ctc-008-pdf-prototype`
Implementation commit: `75d8e12` (`Implement CTC-008 PDF prototype`)

## Verification Evidence

Passed locally on 2026-06-25:

- `npm run test:unit -- ctc008` -> 1 file, 6 tests passed.
- `npm run build` -> passed. Build output included isolated `dist/ctc008.html` and `dist/assets/ctc008-BbpsE5uR.js`; main app output remained `dist/assets/app-jUx2FHFt.js`.
- `node_modules/.bin/playwright test test/e2e/ctc008-pdf.spec.ts` -> 2 tests passed.
- `npm run check` -> scaffold verification, build, 74 Vitest tests, 19 Playwright tests passed.
- `git diff --check` -> passed.
- `git diff -- package.json package-lock.json` -> empty.
- `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh` -> passed; production audit found 0 vulnerabilities.

The CTC-008 Playwright evidence reported: 11,484 PDF bytes, 3 pages, 612x792 page size, searchable text containing the synthetic course, course summary, hole page, static note, target, carry arc, OSM attribution, and copyright URL; 18 vector/path operations; 0 image operations; no `/JS`, `/JavaScript`, `/Launch`, or `/AcroForm`; and a four-element carry dash pattern `[7.8, 3.25, 1.95, 3.25]`.

Visual baseline snapshot:

- Path: `test/e2e/ctc008-pdf.spec.ts-snapshots/ctc008-hole-page-chromium-darwin.png`
- SHA-256: `5c8efdc6ed8d4201f8694434bc31917ce43617d4261684f63aaa347e7a79df7a`

## Changed File Contents

### ctc008.html

SHA-256: `1d1894c8e525b4d49d2208d8088a1a1828782058ed3c8c000b81e6be6b5f9e37`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CTC-008 PDF prototype</title>
  </head>
  <body>
    <main>
      <h1>CTC-008 isolated PDF prototype</h1>
      <p>Dev-only fixture-backed yardage book PDF prototype.</p>
      <button type="button" id="ctc008-download">Download prototype PDF</button>
      <p id="ctc008-status" role="status" aria-live="polite">Ready.</p>
      <canvas id="ctc008-rendered-page" data-testid="ctc008-rendered-page" width="612" height="792"></canvas>
    </main>
    <script type="module" src="/src/ctc008Main.ts"></script>
  </body>
</html>

```

### vite.config.ts

SHA-256: `a3a42ba5395764f88b50d24d8e8b63c214cd5be61beaa00357e5ceb0dbfb8819`

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: false
  },
  build: {
    rollupOptions: {
      input: {
        app: "index.html",
        ctc014: "ctc014.html",
        ctc008: "ctc008.html"
      }
    }
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"]
  }
});

```

### src/ctc008-window.d.ts

SHA-256: `b2181c936e03a970a31858c1aa84353e9bebe37e2e602a6b3b9a16796a6fa8f3`

```ts
import type * as pdf from "./ctc008Pdf";
import type * as scene from "./ctc008Scene";

declare global {
  interface Window {
    ctc008Experiment: {
      analyzeCtc008Pdf: typeof pdf.analyzeCtc008Pdf;
      createCtc008ExportScene: typeof scene.createCtc008ExportScene;
      ctc008DownloadFilename: typeof pdf.ctc008DownloadFilename;
      renderCtc008PageToCanvas: typeof pdf.renderCtc008PageToCanvas;
      renderCtc008Pdf: typeof pdf.renderCtc008Pdf;
    };
  }
}

export {};

```

### src/ctc008Main.ts

SHA-256: `67c42215dd8e31a0ce62ecfd0daabe49305a67a5b8845b8878f1386983812ad9`

```ts
import {
  analyzeCtc008Pdf,
  ctc008DownloadFilename,
  renderCtc008PageToCanvas,
  renderCtc008Pdf,
} from "./ctc008Pdf";
import { createCtc008ExportScene } from "./ctc008Scene";

function downloadPrototypePdf() {
  const pdf = renderCtc008Pdf();
  const bytes = new ArrayBuffer(pdf.byteLength);
  new Uint8Array(bytes).set(pdf);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = ctc008DownloadFilename("2026-06-25T00:00:00.000Z");
  document.body.appendChild(anchor);
  anchor.click();
  requestAnimationFrame(() => {
    URL.revokeObjectURL(url);
    anchor.remove();
  });
  document.getElementById("ctc008-status")!.textContent = "Prototype PDF export started.";
}

document.getElementById("ctc008-download")?.addEventListener("click", downloadPrototypePdf);

window.ctc008Experiment = {
  analyzeCtc008Pdf,
  createCtc008ExportScene,
  ctc008DownloadFilename,
  renderCtc008PageToCanvas,
  renderCtc008Pdf,
};

```

### src/ctc008Scene.ts

SHA-256: `19e9716f2b31edffa34aad00bd8ddb0822b009fff7b95c9d25d53fa8746983dc`

```ts
import fixture from "../fixtures/overpass/synthetic-golf-course-ctc006.json";
import { carryRings } from "./carry";
import {
  LAYER_ORDER,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  createProjection,
  distanceMeters,
  formatDistance,
  geometryCoordinates,
  holeCoordinates,
  projectCoordinate,
  scaleBar,
  type Projection,
  type ViewportPoint,
} from "./map";
import {
  normalizeGolfCourse,
  type CourseCandidate,
  type FeatureKind,
  type Geometry,
  type NormalizationResult,
  type NormalizedHole,
  type SourceKey,
} from "./normalize";
import type { OverpassResponse, SourceMetadata } from "./overpass";
import type { HoleStateV1 } from "./project";

export const CTC008_COURSE_SOURCE_KEY = "way/9000060001" as const;
export const CTC008_HOLE_SOURCE_KEY = "way/9000060101" as const;
export const CTC008_TEE_SOURCE_KEY = "way/9000060201" as const;
export const CTC008_NOTE = "Synthetic fixture - not a real course." as const;
export const CTC008_TITLE_FALLBACK = "Synthetic CTC-008 fixture course" as const;
export const CTC008_ATTRIBUTION = "Course geometry and map data © OpenStreetMap contributors." as const;
export const CTC008_ATTRIBUTION_URL = "https://www.openstreetmap.org/copyright" as const;
export const CTC008_FILENAME_FALLBACK = "ctc-yardage-prototype-invalid-timestamp.pdf" as const;

export const LETTER_WIDTH_PT = 612;
export const LETTER_HEIGHT_PT = 792;
export const PAGE_MARGIN_PT = 36;
export const MAP_REGION = { x: 36, y: 96, width: 540, height: 390 } as const;
export const MAP_SCALE = Math.min(MAP_REGION.width / VIEWBOX_WIDTH, MAP_REGION.height / VIEWBOX_HEIGHT);
export const MAP_TRANSLATE_X = MAP_REGION.x + (MAP_REGION.width - VIEWBOX_WIDTH * MAP_SCALE) / 2;
export const MAP_TRANSLATE_Y = MAP_REGION.y;

export type PdfStyle = {
  fill: string | null;
  stroke: string | null;
  strokeWidth: number;
  dash: number[];
};

export type PdfGeometry =
  | { type: "point"; sourceKey: SourceKey | string; kind: FeatureKind | "target"; point: ViewportPoint; radius: number; style: PdfStyle }
  | { type: "line"; sourceKey: SourceKey | string; kind: FeatureKind | "route" | "carry-arc"; points: ViewportPoint[]; style: PdfStyle }
  | { type: "polygon"; sourceKey: SourceKey | string; kind: FeatureKind; points: ViewportPoint[]; style: PdfStyle };

export type PdfText = {
  text: string;
  x: number;
  y: number;
  size: number;
  style?: "normal" | "bold";
};

export type Ctc008ExportScene = {
  page: { width: number; height: number; margin: number };
  courseTitle: string;
  courseSourceKey: typeof CTC008_COURSE_SOURCE_KEY;
  holeSourceKey: typeof CTC008_HOLE_SOURCE_KEY;
  targetHoleCount: 1;
  staticNote: typeof CTC008_NOTE;
  map: {
    region: typeof MAP_REGION;
    transform: { translateX: number; translateY: number; scale: number };
    geometry: PdfGeometry[];
    labels: PdfText[];
    scaleBar: { start: ViewportPoint; end: ViewportPoint; label: string };
  };
  coverText: PdfText[];
  summaryText: PdfText[];
  holeText: PdfText[];
  yardageRows: Array<{ label: string; value: string }>;
};

const SOURCE: SourceMetadata = {
  query: "synthetic-ctc008-fixture",
  endpoint: "synthetic-local-fixture",
  completedAt: "2026-01-01T00:00:00.000Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: CTC008_ATTRIBUTION_URL,
};

const PROJECT: HoleStateV1 = {
  targets: [{ id: "ctc008-target-1", label: "Layup A", lat: 35.005, lon: -79.996 }],
  carries: [{ id: "ctc008-carry-1", origin: { kind: "tee", sourceKey: CTC008_TEE_SOURCE_KEY }, distances: [150] }],
};

const STYLES: Record<FeatureKind | "route" | "carry-arc" | "target", PdfStyle> = {
  vegetation: { fill: "#a9c49b", stroke: "#3d6540", strokeWidth: 2, dash: [4, 3] },
  "generic-water": { fill: "#a8d5e5", stroke: "#245f78", strokeWidth: 2, dash: [6, 3] },
  "golf-water": { fill: "#70b6d2", stroke: "#174f69", strokeWidth: 3, dash: [] },
  rough: { fill: "#c6d6ae", stroke: "#667d4b", strokeWidth: 2, dash: [3, 3] },
  fairway: { fill: "#b8d59f", stroke: "#41653d", strokeWidth: 2, dash: [] },
  bunker: { fill: "#ead9a0", stroke: "#735e28", strokeWidth: 2, dash: [2, 2] },
  green: { fill: "#82b980", stroke: "#285c35", strokeWidth: 3, dash: [] },
  tee: { fill: "#d9e7bd", stroke: "#244e30", strokeWidth: 3, dash: [] },
  route: { fill: null, stroke: "#6d351d", strokeWidth: 4, dash: [8, 5] },
  "carry-arc": { fill: null, stroke: "#713b89", strokeWidth: 3, dash: [12, 5, 3, 5] },
  target: { fill: "#512c68", stroke: "#fffdf8", strokeWidth: 4, dash: [] },
};

export function courseTitleFromTags(tags: Record<string, unknown> | undefined): string {
  const name = tags?.name;
  return typeof name === "string" && name.trim() ? name : CTC008_TITLE_FALLBACK;
}

function titleFromCandidate(candidate: CourseCandidate | undefined): string {
  return courseTitleFromTags(candidate?.source.tags);
}

function projectGeometry(geometry: Geometry, projection: Projection, sourceKey: SourceKey, kind: FeatureKind): PdfGeometry {
  if (geometry.type === "point") {
    return { type: "point", sourceKey, kind, point: projectCoordinate(projection, geometry.coordinate), radius: 4, style: STYLES[kind] };
  }
  const points = geometryCoordinates(geometry).map((coordinate) => projectCoordinate(projection, coordinate));
  return geometry.type === "line"
    ? { type: "line", sourceKey, kind, points, style: STYLES[kind] }
    : { type: "polygon", sourceKey, kind, points, style: STYLES[kind] };
}

function selectedFixture(): { result: NormalizationResult; hole: NormalizedHole; projection: Projection } {
  const result = normalizeGolfCourse(fixture as OverpassResponse, SOURCE);
  const hole = result.holes.find(({ source }) => source.sourceKey === CTC008_HOLE_SOURCE_KEY);
  if (!hole) throw new Error("CTC-008 pinned fixture hole is missing.");
  const projection = createProjection(holeCoordinates(hole));
  if ("kind" in projection) throw new Error(`CTC-008 projection failed: ${projection.kind}`);
  return { result, hole, projection };
}

function routeYardage(hole: NormalizedHole): string {
  const route = hole.route ? geometryCoordinates(hole.route) : [];
  if (route.length < 2) return "No route yardage";
  let meters = 0;
  for (let index = 1; index < route.length; index += 1) {
    const segment = distanceMeters(route[index - 1], route[index]);
    if (typeof segment === "number") meters += segment;
  }
  return formatDistance(meters);
}

export function formatCtc008PdfFilename(exportedAt: string): string {
  const match = exportedAt.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.\d{3}Z$/);
  if (!match) return CTC008_FILENAME_FALLBACK;
  const [, year, month, day, hour, minute, second] = match;
  return `ctc-yardage-prototype-${year}${month}${day}T${hour}${minute}${second}Z.pdf`;
}

export function createCtc008ExportScene(): Ctc008ExportScene {
  const { result, hole, projection } = selectedFixture();
  const geometry: PdfGeometry[] = [];
  for (const kind of LAYER_ORDER) {
    for (const feature of hole.features.filter((entry) => entry.kind === kind && entry.geometry !== null)) {
      geometry.push(projectGeometry(feature.geometry!, projection, feature.source.sourceKey, feature.kind));
    }
  }
  if (hole.route) {
    geometry.push({
      type: "line",
      sourceKey: hole.source.sourceKey,
      kind: "route",
      points: geometryCoordinates(hole.route).map((coordinate) => projectCoordinate(projection, coordinate)),
      style: STYLES.route,
    });
  }
  const rings = carryRings(PROJECT.carries[0], hole, PROJECT.targets, projection);
  if (!Array.isArray(rings)) throw new Error(`CTC-008 carry failed: ${rings.kind}`);
  for (const ring of rings) {
    ring.segments.forEach((points, index) => geometry.push({
      type: "line",
      sourceKey: `${ring.carryId}/${index}`,
      kind: "carry-arc",
      points,
      style: STYLES["carry-arc"],
    }));
  }
  for (const target of PROJECT.targets) {
    geometry.push({
      type: "point",
      sourceKey: target.id,
      kind: "target",
      point: projectCoordinate(projection, target),
      radius: 8,
      style: STYLES.target,
    });
  }
  const bar = scaleBar(projection);
  const carryTop = rings[0].points.reduce((top, point) => point.y < top.y ? point : top);
  const courseTitle = titleFromCandidate(result.courseCandidates.find(({ source }) => source.sourceKey === CTC008_COURSE_SOURCE_KEY));
  return {
    page: { width: LETTER_WIDTH_PT, height: LETTER_HEIGHT_PT, margin: PAGE_MARGIN_PT },
    courseTitle,
    courseSourceKey: CTC008_COURSE_SOURCE_KEY,
    holeSourceKey: CTC008_HOLE_SOURCE_KEY,
    targetHoleCount: 1,
    staticNote: CTC008_NOTE,
    map: {
      region: MAP_REGION,
      transform: { translateX: MAP_TRANSLATE_X, translateY: MAP_TRANSLATE_Y, scale: MAP_SCALE },
      geometry,
      labels: [{ text: "150 yd", x: carryTop.x, y: carryTop.y - 6, size: 14 }],
      scaleBar: { start: { x: 40, y: 542 }, end: { x: 40 + bar.logicalLength, y: 542 }, label: bar.label },
    },
    coverText: [
      { text: courseTitle, x: 36, y: 84, size: 24, style: "bold" },
      { text: "Chart the Course CTC-008 Prototype", x: 36, y: 118, size: 14 },
      { text: CTC008_NOTE, x: 36, y: 150, size: 11 },
    ],
    summaryText: [
      { text: "Course summary", x: 36, y: 64, size: 18, style: "bold" },
      { text: `Course source: ${CTC008_COURSE_SOURCE_KEY}`, x: 36, y: 100, size: 10 },
      { text: `Rendered hole: ${CTC008_HOLE_SOURCE_KEY}`, x: 36, y: 118, size: 10 },
      { text: "Fixture hole count: 1", x: 36, y: 136, size: 10 },
      { text: `Static notes: ${CTC008_NOTE}`, x: 36, y: 164, size: 10 },
    ],
    holeText: [
      { text: "Hole 1 yardage page", x: 36, y: 48, size: 18, style: "bold" },
      { text: `Hole source: ${CTC008_HOLE_SOURCE_KEY}`, x: 36, y: 70, size: 10 },
      { text: `Route yardage: ${routeYardage(hole)}`, x: 36, y: 520, size: 10 },
      { text: "Target Layup A: synthetic marker", x: 36, y: 540, size: 9 },
      { text: "Carry arc: 150 yd from tee way/9000060201", x: 36, y: 556, size: 9 },
      { text: CTC008_NOTE, x: 36, y: 610, size: 8 },
      { text: CTC008_ATTRIBUTION, x: 36, y: 704, size: 7 },
      { text: CTC008_ATTRIBUTION_URL, x: 36, y: 718, size: 7 },
    ],
    yardageRows: [
      { label: "Route", value: routeYardage(hole) },
      { label: "Carry", value: "150 yd" },
      { label: "Target", value: "Layup A" },
    ],
  };
}

```

### src/ctc008Pdf.ts

SHA-256: `7b1339192f6681075821a74e03021f1e629416ff3123443765a81103777d2b44`

```ts
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

```

### src/ctc008Scene.test.ts

SHA-256: `97d8738bf851320b07e841db74125bc81a3fbb6c3f4b35b89bd0169f9fc994be`

```ts
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

```

### test/e2e/ctc008-pdf.spec.ts

SHA-256: `9cab5b9a5e2f9ccb7f33ca62f6903215fb0f998190dfe14d0570cba98a041d21`

```ts
import { expect, test, type Page, type Route } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function isolateNetwork(page: Page) {
  await page.route("**/*", async (route: Route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") await route.continue();
    else throw new Error(`Unexpected external request: ${url.href}`);
  });
}

test("CTC-008 prototype generates isolated attributable PDF evidence", async ({ page }, testInfo) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    const created: string[] = [];
    const revoked: string[] = [];
    const originalCreate = URL.createObjectURL.bind(URL);
    const originalRevoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (object) => {
      const url = originalCreate(object);
      created.push(url);
      return url;
    };
    URL.revokeObjectURL = (url) => {
      revoked.push(url);
      return originalRevoke(url);
    };
    (window as typeof window & { __ctc008Urls: { created: string[]; revoked: string[] } }).__ctc008Urls = { created, revoked };
  });
  await isolateNetwork(page);
  await page.goto("/ctc008.html");
  await expect
    .poll(async () => ({
      ready: await page.evaluate(() => typeof window.ctc008Experiment?.renderCtc008Pdf === "function"),
      pageErrors,
    }))
    .toEqual({ ready: true, pageErrors: [] });

  await expect(page.getByRole("button", { name: "Download prototype PDF" })).toBeVisible();
  const axe = await new AxeBuilder({ page }).include("main").analyze();
  expect(axe.violations).toEqual([]);

  const evidence = await page.evaluate(async () => {
    const pdf = window.ctc008Experiment.renderCtc008Pdf();
    const evidence = await window.ctc008Experiment.analyzeCtc008Pdf(pdf);
    const canvas = document.querySelector<HTMLCanvasElement>("#ctc008-rendered-page");
    if (!canvas) throw new Error("Rendered page canvas missing.");
    await window.ctc008Experiment.renderCtc008PageToCanvas(pdf, 3, canvas);
    return {
      bytes: evidence.bytes,
      pages: evidence.pages,
      width: evidence.width,
      height: evidence.height,
      text: evidence.text,
      pathOperations: evidence.pathOperations,
      imageOperations: evidence.imageOperations,
      dashPatterns: evidence.dashPatterns,
      hasJs: evidence.rawText.includes("/JS") || evidence.rawText.includes("/JavaScript"),
      hasLaunch: evidence.rawText.includes("/Launch"),
      hasAcroForm: evidence.rawText.includes("/AcroForm"),
    };
  });
  await testInfo.attach("ctc008-pdf-evidence", {
    body: JSON.stringify(evidence, null, 2),
    contentType: "application/json",
  });
  console.log(JSON.stringify(evidence, null, 2));

  expect(evidence.bytes).toBeGreaterThan(0);
  expect(evidence.pages).toBe(3);
  expect(evidence.width).toBeCloseTo(612, 1);
  expect(evidence.height).toBeCloseTo(792, 1);
  expect(evidence.text).toContain("Synthetic CTC-006 Course");
  expect(evidence.text).toContain("Course summary");
  expect(evidence.text).toContain("Hole 1 yardage page");
  expect(evidence.text).toContain("Synthetic fixture - not a real course.");
  expect(evidence.text).toContain("Target Layup A");
  expect(evidence.text).toContain("Carry arc: 150 yd");
  expect(evidence.text).toContain("Course geometry and map data © OpenStreetMap contributors.");
  expect(evidence.text).toContain("https://www.openstreetmap.org/copyright");
  expect(evidence.pathOperations).toBeGreaterThan(0);
  expect(evidence.imageOperations).toBe(0);
  expect(evidence.hasJs).toBe(false);
  expect(evidence.hasLaunch).toBe(false);
  expect(evidence.hasAcroForm).toBe(false);
  const carryDash = evidence.dashPatterns.find((pattern) => pattern.length === 4);
  expect(carryDash).toHaveLength(4);
  [7.8, 3.25, 1.95, 3.25].forEach((value, index) => expect(carryDash![index]).toBeCloseTo(value, 10));

  await expect(page.getByTestId("ctc008-rendered-page")).toHaveScreenshot("ctc008-hole-page.png", {
    maxDiffPixelRatio: 0.002,
  });

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download prototype PDF" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("ctc-yardage-prototype-20260625T000000Z.pdf");
  await expect(page.getByText("Prototype PDF export started.")).toBeVisible();
  await expect.poll(() => page.evaluate(() => {
    const urls = (window as typeof window & { __ctc008Urls: { created: string[]; revoked: string[] } }).__ctc008Urls;
    return { created: urls.created.length, revoked: urls.revoked.length };
  })).toEqual({ created: 1, revoked: 1 });
});

test("CTC-008 does not add production PDF UI to the main app", async ({ page }) => {
  await isolateNetwork(page);
  await page.goto("/");
  await expect(page.getByRole("button", { name: /Download PDF/i })).toHaveCount(0);
  await expect(page.getByText("CTC-008 isolated PDF prototype")).toHaveCount(0);
});

```


## CONTEXT.md Update Diff

```diff
diff --git a/CONTEXT.md b/CONTEXT.md
index 14b6650..60432f1 100644
--- a/CONTEXT.md
+++ b/CONTEXT.md
@@ -1,66 +1,96 @@
 # Chart the Course Context
 
-Last updated: 2026-06-20
+Last updated: 2026-06-25
 
 ## Current Status
 
+CTC-008 implementation ready for final Claude audit - 2026-06-25. Branch
+`ctc-008-pdf-prototype` implements the approved dev-only, fixture-backed PDF
+prototype behind isolated `ctc008.html` and does not add production PDF UI to
+`src/App.tsx`. The prototype pins itself to
+`fixtures/overpass/synthetic-golf-course-ctc006.json`, renders exactly the
+single fixture hole `way/9000060101`, uses the literal static note
+`Synthetic fixture - not a real course.`, validates course-title text with a
+fallback, generates deterministic fallback-safe PDF filenames, and uses the
+existing `requestAnimationFrame` Blob URL cleanup pattern. PDF generation uses
+`jspdf@4.2.1` only as an existing devDependency and low-level vector/text APIs;
+no dependencies or devDependencies changed. Source-level tests block high-risk
+jsPDF APIs, rejected CTC-014 candidates (`pdfkit`, `svg-to-pdfkit`,
+`blob-stream`), and live Overpass/query/cache helpers. Browser tests verify
+network isolation, searchable OSM attribution plus
+`https://www.openstreetmap.org/copyright`, three-page PDF structure, vector
+path evidence, zero image operators, absence of `/JS`, `/JavaScript`,
+`/Launch`, and `/AcroForm`, the scaled four-element carry dash operator
+`[7.8, 3.25, 1.95, 3.25]`, rendered-page visual baseline, Blob URL cleanup,
+and absence of production app PDF UI. Build evidence from `npm run check`
+showed isolated outputs including `dist/ctc008.html` and
+`dist/assets/ctc008-BbpsE5uR.js` while the main app output remained
+`dist/assets/app-jUx2FHFt.js`; `git diff -- package.json package-lock.json`
+was empty. Verification passed: `npm run test:unit -- ctc008`,
+`npm run build`, `node_modules/.bin/playwright test
+test/e2e/ctc008-pdf.spec.ts`, `npm run check` (scaffold verification, build,
+74 Vitest tests, 19 Playwright tests), `git diff --check`, and
+`npm_config_cache=/private/tmp/chart-the-course-npm-cache
+scripts/compliance.sh` (production audit: 0 vulnerabilities). Final Claude
+audit remains mandatory before CTC-008 may move to Done.
+
 Claude QA planning for CTC-008 - 2026-06-25. Claude returned
 `READY FOR IMPLEMENTATION AFTER QA PLAN` with no blockers and no second Claude
 QA-planning round required after Codex records the required corrections. Codex
 accepts the verdict and recorded the disposition in
 `docs/handoffs/ctc-008-claude-qa-plan-review.md`; SHA-256:
 `1efce8795476a79fd937ae22cc78445e557db4af790c2954aa23b9b7d97b5117`.
 Required corrections RC-1 through RC-8 and minor corrections MC-1 through MC-4
 were folded into `docs/handoffs/ctc-008-spec-addendum.md`; updated SHA-256:
 `e4bf2c88e483e45d5004a411fbadf5135cec2c84df779aa45bcfbafc3a3ec84a`.
 Implementation is authorized on a feature branch for a dev-only,
 fixture-backed PDF prototype. Mandatory boundaries: no production dependency
 movement; no new devDependencies; no production `Download PDF` UI in
 `src/App.tsx`; use only
 `fixtures/overpass/synthetic-golf-course-ctc006.json`; render exactly the
 single fixture hole `way/9000060101`; use literal static prototype notes only;
 validate course-title tag text with fallback; avoid live Overpass/query/cache
 helpers; do not import or exercise `pdfkit`, `svg-to-pdfkit`, or
 `blob-stream`; block high-risk jsPDF APIs; keep production app bundle isolated;
 use existing Blob URL cleanup pattern; add deterministic PDF filename fallback;
 and include network isolation, source-level API blocklist, attribution,
 carry-dash, PDF.js structural, rendered visual, bundle-isolation, and
 compliance evidence. CTC-008 may move to `3. In Development (ChatGPT)`.
 Final Claude audit remains mandatory before Done.
 
 Gemini CTC-008 revision rejected - 2026-06-25. Codex reviewed Gemini's revised
 gated fixture-backed prototype response and rejected it as an implementation
 baseline. Accepted research input: gated fixture-backed prototype direction,
 browser-local/network-isolated generation, continued `jspdf@4.2.1` low-level
 vector candidate status, explicit bans on high-risk jsPDF APIs, static fixture
 notes only, visible/searchable full-URL OSM attribution, PDF/raw source
 adjacency when real PDF behavior ships, and deferred Blob URL cleanup. Source
 check on 2026-06-25 confirmed NVD `CVE-2026-25755` and `CVE-2026-25940` jsPDF
 records, npm `jspdf@4.2.1` metadata, and current OSM copyright source.
 Blockers remain: production dependency movement is unjustified while UI is
 hidden/prototype-gated; hidden/query-flag PDF UI conflicts with the accepted
 task boundary; typed boundaries reference nonexistent `NormalizedCourse` and
 `CustomTarget` contracts and misstate `project.ts`; bundle optimization is an
 incomplete placeholder; text sanitization remains ambiguous around required
 `©`; fixture content fields are assumed rather than mapped; Playwright snippets
 use nonexistent test IDs/routes; raw PDF byte scans are over-weighted; fixed
 page/layout constants are premature; and the response still does not choose one
 coherent implementation-ready acceptance boundary. Review artifact:
 `docs/handoffs/ctc-008-gemini-revision-review.md`. CTC-008 remains in
 `1. Spec Drafting (Gemini)`. Next recommended action is a Codex-owned spec
 addendum choosing either a dev-only fixture-backed PDF prototype that keeps
 jsPDF in devDependencies and avoids production PDF UI, or a fully reviewed
 production PDF feature with production dependency movement and real
 same-release source-export adjacency. Do not advance to Claude QA planning or
 runtime implementation until that corrected baseline exists.
 Gemini revision review artifact:
 `docs/handoffs/ctc-008-gemini-revision-review.md`; SHA-256:
 `c2e9599a0c77f6d667f96a86bd4c7a942db2edec5e90f4fe9cbc78a943c214f0`.
 
 Codex CTC-008 spec addendum ready for Claude QA planning - 2026-06-25. Codex
 resolved the repeated Gemini baseline blockers in
 `docs/handoffs/ctc-008-spec-addendum.md`; SHA-256:
 `e8fc3384eae27e57cd03adcc72ea4759c7edefceb871101d0e6626cb14391391`.
 Corrected direction: CTC-008 should implement a dev-only, fixture-backed
 yardage book PDF prototype, not production PDF export behavior. The addendum
 keeps `jspdf@4.2.1` as a devDependency, forbids production `Download PDF` UI

```
