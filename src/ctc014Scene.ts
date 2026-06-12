import fixture from "../fixtures/overpass/synthetic-golf-course-ctc006.json";
import { carryRings } from "./carry";
import {
  LAYER_ORDER,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  createProjection,
  geometryCoordinates,
  holeCoordinates,
  projectCoordinate,
  scaleBar,
  type Projection,
  type ViewportPoint,
} from "./map";
import {
  normalizeGolfCourse,
  type FeatureKind,
  type Geometry,
  type NormalizedHole,
  type SourceKey,
} from "./normalize";
import type { OverpassResponse, SourceMetadata } from "./overpass";
import type { HoleStateV1 } from "./project";

export const CTC014_COURSE_SOURCE_KEY = "way/9000060001" as const;
export const CTC014_HOLE_SOURCE_KEY = "way/9000060101" as const;
export const CTC014_TEE_SOURCE_KEY = "way/9000060201" as const;
export const CTC014_ATTRIBUTION = "Course geometry and map data © OpenStreetMap contributors." as const;
export const CTC014_ATTRIBUTION_URL = "https://www.openstreetmap.org/copyright" as const;
export const CTC014_NOTE = "Synthetic CTC-014 fixture. Not a real course." as const;
export const CTC014_DISCLAIMER = "Yardages are estimates from open map data. Verify before play." as const;

export const LETTER_WIDTH_PT = 612;
export const LETTER_HEIGHT_PT = 792;
export const PAGE_MARGIN_PT = 36;
export const MAP_REGION = { x: 36, y: 111, width: 540, height: 400 } as const;
export const MAP_SCALE = Math.min(MAP_REGION.width / VIEWBOX_WIDTH, MAP_REGION.height / VIEWBOX_HEIGHT);
export const MAP_TRANSLATE_X = MAP_REGION.x + (MAP_REGION.width - VIEWBOX_WIDTH * MAP_SCALE) / 2;
export const MAP_TRANSLATE_Y = MAP_REGION.y;

export type ExportStyle = {
  fill: string | null;
  stroke: string | null;
  strokeWidth: number;
  dash: number[];
};

export type ExportGeometry =
  | { type: "point"; sourceKey: SourceKey | string; kind: FeatureKind | "target"; point: ViewportPoint; radius: number; style: ExportStyle }
  | { type: "line"; sourceKey: SourceKey | string; kind: FeatureKind | "route" | "carry-arc"; points: ViewportPoint[]; style: ExportStyle }
  | { type: "polygon"; sourceKey: SourceKey | string; kind: FeatureKind; points: ViewportPoint[]; style: ExportStyle };

export type ExportText = {
  role: "title" | "subtitle" | "carry-label" | "yardage" | "note" | "disclaimer" | "attribution" | "attribution-url";
  text: string;
  x: number;
  y: number;
  size: number;
};

export type Ctc014ExportScene = {
  page: { width: number; height: number; margin: number };
  courseSourceKey: typeof CTC014_COURSE_SOURCE_KEY;
  holeSourceKey: typeof CTC014_HOLE_SOURCE_KEY;
  map: {
    region: typeof MAP_REGION;
    transform: { translateX: number; translateY: number; scale: number };
    geometry: ExportGeometry[];
    labels: ExportText[];
    scaleBar: { start: ViewportPoint; end: ViewportPoint; label: string };
  };
  yardageRows: Array<{ origin: string; yards: number }>;
  text: ExportText[];
};

const SOURCE: SourceMetadata = {
  query: "synthetic-ctc014-experiment",
  endpoint: "synthetic-local-fixture",
  completedAt: "2026-01-01T00:00:00.000Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: CTC014_ATTRIBUTION_URL,
};

const PROJECT: HoleStateV1 = {
  targets: [{ id: "t-000000000001", label: "Layup A", lat: 35.005, lon: -79.996 }],
  carries: [{ id: "c-000000000001", origin: { kind: "tee", sourceKey: CTC014_TEE_SOURCE_KEY }, distances: [150] }],
};

const STYLES: Record<FeatureKind | "route" | "carry-arc" | "target", ExportStyle> = {
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

function projectGeometry(geometry: Geometry, projection: Projection, sourceKey: SourceKey, kind: FeatureKind): ExportGeometry {
  if (geometry.type === "point") {
    return { type: "point", sourceKey, kind, point: projectCoordinate(projection, geometry.coordinate), radius: 4, style: STYLES[kind] };
  }
  const points = geometryCoordinates(geometry).map((coordinate) => projectCoordinate(projection, coordinate));
  return geometry.type === "line"
    ? { type: "line", sourceKey, kind, points, style: STYLES[kind] }
    : { type: "polygon", sourceKey, kind, points, style: STYLES[kind] };
}

function selectedHole(): { hole: NormalizedHole; projection: Projection } {
  const result = normalizeGolfCourse(fixture as OverpassResponse, SOURCE);
  const hole = result.holes.find(({ source }) => source.sourceKey === CTC014_HOLE_SOURCE_KEY);
  if (!hole) throw new Error("CTC-014 fixture hole is missing.");
  const projection = createProjection(holeCoordinates(hole));
  if ("kind" in projection) throw new Error(`CTC-014 projection failed: ${projection.kind}`);
  return { hole, projection };
}

export function createCtc014ExportScene(): Ctc014ExportScene {
  const { hole, projection } = selectedHole();
  const geometry: ExportGeometry[] = [];
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
  if (!Array.isArray(rings)) throw new Error(`CTC-014 carry failed: ${rings.kind}`);
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
  return {
    page: { width: LETTER_WIDTH_PT, height: LETTER_HEIGHT_PT, margin: PAGE_MARGIN_PT },
    courseSourceKey: CTC014_COURSE_SOURCE_KEY,
    holeSourceKey: CTC014_HOLE_SOURCE_KEY,
    map: {
      region: MAP_REGION,
      transform: { translateX: MAP_TRANSLATE_X, translateY: MAP_TRANSLATE_Y, scale: MAP_SCALE },
      geometry,
      labels: [{ role: "carry-label", text: "150 yd", x: carryTop.x, y: carryTop.y - 6, size: 14 }],
      scaleBar: { start: { x: 40, y: 542 }, end: { x: 40 + bar.logicalLength, y: 542 }, label: bar.label },
    },
    yardageRows: [{ origin: `Tee ${CTC014_TEE_SOURCE_KEY}`, yards: 150 }],
    text: [
      { role: "title", text: "Synthetic CTC-014 Course", x: 36, y: 48, size: 18 },
      { role: "subtitle", text: "Hole 1 | Par 4 | way/9000060101", x: 36, y: 70, size: 10 },
      { role: "yardage", text: "Tee way/9000060201: 150 yd carry", x: 36, y: 540, size: 9 },
      { role: "note", text: CTC014_NOTE, x: 36, y: 620, size: 8 },
      { role: "disclaimer", text: CTC014_DISCLAIMER, x: 36, y: 684, size: 7 },
      { role: "attribution", text: CTC014_ATTRIBUTION, x: 36, y: 710, size: 7 },
      { role: "attribution-url", text: CTC014_ATTRIBUTION_URL, x: 36, y: 724, size: 7 },
    ],
  };
}
