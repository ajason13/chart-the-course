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

export const CTC008_STYLES: Record<FeatureKind | "route" | "carry-arc" | "target", PdfStyle> = {
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
    return { type: "point", sourceKey, kind, point: projectCoordinate(projection, geometry.coordinate), radius: 4, style: CTC008_STYLES[kind] };
  }
  const points = geometryCoordinates(geometry).map((coordinate) => projectCoordinate(projection, coordinate));
  return geometry.type === "line"
    ? { type: "line", sourceKey, kind, points, style: CTC008_STYLES[kind] }
    : { type: "polygon", sourceKey, kind, points, style: CTC008_STYLES[kind] };
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
      style: CTC008_STYLES.route,
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
      style: CTC008_STYLES["carry-arc"],
    }));
  }
  for (const target of PROJECT.targets) {
    geometry.push({
      type: "point",
      sourceKey: target.id,
      kind: "target",
      point: projectCoordinate(projection, target),
      radius: 8,
      style: CTC008_STYLES.target,
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
