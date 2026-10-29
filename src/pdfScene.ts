import demoText from "../fixtures/overpass/synthetic-golf-course-ctc006.json?raw";
import legalText from "../docs/legal-disclaimers.md?raw";
import { carryRings, resolveCarryOrigin, teeOrigins } from "./carry";
import { buildGisSourceExport, GIS_SOURCE_EXPORT_MAX_BYTES, type ActiveSourceEvidence, type GisSourceExportEnvelope } from "./gisSourceExport";
import { createProjection, distanceMeters, formatDistance, holeCoordinates, LAYER_ORDER, projectCoordinate, scaleBar, type Projection, type ViewportPoint } from "./map";
import { normalizeGolfCourse, type Geometry, type NormalizationResult, type NormalizedHole, type SourceKey, type FeatureKind, type DisplayFeature } from "./normalize";
import { validateResponse, type Bbox } from "./overpass";
import { PROJECT_MAX_BYTES, projectMatchErrors, validateProjectFile, type ProjectV2 } from "./project";
import { areaParts } from "./simpleGeometry";
import { LETTER_WIDTH_PT, LETTER_HEIGHT_PT, MAP_REGION, PDF_LIMITS, PdfPreflightError, checkPdfBudget, pdfText, wrapPdfText, type PdfTextMetrics } from "./pdfLayout";

export type PdfSceneInput = {
  normalized: NormalizationResult;
  courseSourceKey: SourceKey;
  selectedHoleKeys: readonly SourceKey[];
  project: ProjectV2;
  source: { kind: "live"; envelope: GisSourceExportEnvelope; text: string; evidence: ActiveSourceEvidence; context: { query: string; bbox: Bbox } }
    | { kind: "synthetic"; fixtureId: "synthetic-golf-course-ctc006.json"; text: string };
  exportedAt: string;
  appVersion: string;
};
export type PdfMeasurement = { available: true; meters: number; text: string } | { available: false; reason: string };
type Basis = "source-associated" | DisplayFeature["basis"];
type Point = ViewportPoint;
export type PdfMapPrimitive = {
  identity: { kind: "source"; sourceKey: SourceKey; basis: Basis; candidateHoleKeys: SourceKey[] }
    | { kind: "authored"; id: string; reference: string };
  style: FeatureKind | "route" | "target" | "carry" | "scale";
  shape: { type: "point"; point: Point; radius: number } | { type: "polyline"; points: Point[] }
    | { type: "area"; parts: { exterior: Point[]; interiors: Point[][] }[]; fillRule: "evenodd" };
};
export type PdfSceneText = { text: string; field: string; x: number; y: number; size: number; width: number };
export type PdfSceneRow = { field: string; text: string; continuation: boolean; lines: PdfSceneText[] };
export type PdfHoleScene = {
  sourceKey: SourceKey; number: number | null; par: number | null;
  routeLength: PdfMeasurement;
  map: { available: false; reason: string } | {
    available: true; region: typeof MAP_REGION; clip: typeof MAP_REGION;
    transform: { scale: number; translateX: number; translateY: number };
    primitives: PdfMapPrimitive[]; labels: PdfSceneText[];
  };
  targets: { id: string; reference: string; label: string; coordinate: { lat: number; lon: number }; distances: { teeSourceKey: SourceKey; distance: PdfMeasurement }[] }[];
  carries: { id: string; reference: string; origin: import("./project").CarryOriginV1; distances: number[]; unavailable: string | null; clipped: boolean }[];
  warnings: string[];
};
export type PdfScenePage = {
  kind: "cover" | "summary" | "hole" | "continuation";
  holeSourceKey?: SourceKey;
  number: number;
  header: PdfSceneText[];
  rows: PdfSceneRow[];
  footer: PdfSceneText[];
  map?: PdfHoleScene["map"];
};
export type PdfScene = {
  page: { width: 612; height: 792; margin: 36 };
  courseSourceKey: SourceKey; courseTitle: string;
  source: { kind: "live" | "synthetic"; text: string; filename: string; sha256: string; exportedAt: string };
  holes: PdfHoleScene[]; pages: PdfScenePage[];
  budgets: { pages: number; vertices: number; primitives: number; maxPdfBytes: number };
};
export type PdfSceneResult = { ok: true; scene: PdfScene } | { ok: false; field: string; message: string };

const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
function canonical(value: unknown): string {
  if (typeof value === "number" && !Number.isFinite(value)) throw new PdfPreflightError("input", "Non-finite operand.");
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => compare(a, b)).map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  return JSON.stringify(value) ?? "undefined";
}
function requireMatch(condition: boolean, field: string, message: string): asserts condition {
  if (!condition) throw new PdfPreflightError(field, message);
}
function routeLength(hole: NormalizedHole): PdfMeasurement {
  if (hole.route?.type !== "line" || hole.route.coordinates.length < 2) return { available: false, reason: "Mapped route unavailable" };
  let meters = 0;
  for (let i = 1; i < hole.route.coordinates.length; i++) {
    const distance = distanceMeters(hole.route.coordinates[i - 1], hole.route.coordinates[i]);
    if (typeof distance !== "number") return { available: false, reason: "Mapped route unavailable" };
    meters += distance;
  }
  return { available: true, meters, text: formatDistance(meters) };
}
const measurementText = (value: PdfMeasurement) => value.available ? value.text : value.reason;

/** Validate raw provenance before any hashing. Never trust a caller's normalized
 * geometry or envelope alone. Re-normalization also prevents foreign holes and
 * display candidates from entering source-associated analytic inputs. */
function validateInput(input: PdfSceneInput): { filename: string; normalized: NormalizationResult; project: ProjectV2 } {
  requireMatch(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(input.exportedAt)
    && Number.isFinite(Date.parse(input.exportedAt)) && new Date(input.exportedAt).toISOString() === input.exportedAt, "exportedAt", "Expected a canonical UTC timestamp.");
  requireMatch(new TextEncoder().encode(input.source.text).length <= GIS_SOURCE_EXPORT_MAX_BYTES, "source", "Source exceeds 1 MiB; choose a smaller source area.");
  let raw: string;
  let filename: string;
  const compact = input.exportedAt.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  if (input.source.kind === "live") {
    requireMatch(input.source.evidence.mode === "detail" && ["fresh", "stale-consented"].includes(input.source.evidence.consentState), "source", "Detail evidence and explicit freshness state are required.");
    const built = buildGisSourceExport(input.source.evidence, input.source.context, input.exportedAt);
    requireMatch(built.ok, "source", built.ok ? "" : built.message);
    requireMatch(built.text === input.source.text && canonical(built.envelope) === canonical(input.source.envelope), "source", "Source text/envelope does not match active detail evidence.");
    requireMatch(canonical(input.source.evidence.source) === canonical(input.normalized.source), "source", "Normalized source metadata mismatch.");
    raw = built.envelope.rawResponse;
    filename = built.filename;
  } else {
    requireMatch(input.source.kind === "synthetic" && input.source.fixtureId === "synthetic-golf-course-ctc006.json" && input.source.text === demoText, "source", "Synthetic source must be the exact bundled fixture.");
    raw = demoText;
    filename = `ctc-synthetic-source-${compact}.json`;
  }
  const response = validateResponse(JSON.parse(raw));
  requireMatch(response !== null, "source", "Invalid source response.");
  const normalized = normalizeGolfCourse(response, input.normalized.source, input.courseSourceKey);
  requireMatch(canonical(normalized) === canonical(input.normalized), "normalized", "Normalized course does not match the exact selected source response.");
  requireMatch(normalized.courseCandidates.some(c => c.source.sourceKey === input.courseSourceKey), "courseSourceKey", "Selected course is absent.");
  requireMatch(input.selectedHoleKeys.length >= 1 && input.selectedHoleKeys.length <= PDF_LIMITS.holes, "selectedHoleKeys", "Select 1–36 holes.");
  requireMatch(new Set(input.selectedHoleKeys).size === input.selectedHoleKeys.length, "selectedHoleKeys", "Duplicate hole selection.");
  requireMatch(input.selectedHoleKeys.every(key => normalized.holes.some(h => h.source.sourceKey === key)), "selectedHoleKeys", "Missing or foreign selected hole.");
  requireMatch(new TextEncoder().encode(JSON.stringify(input.project)).length <= PROJECT_MAX_BYTES, "project", "Project exceeds the existing size limit.");
  const validated = validateProjectFile(input.project);
  requireMatch(validated.ok, "project", validated.ok ? "" : validated.errors.map(e => `${e.path}: ${e.message}`).join(" "));
  requireMatch(projectMatchErrors(validated.project, input.courseSourceKey, normalized.holes.map(h => h.source.sourceKey)).length === 0, "project", "Project course or hole identity mismatch.");
  return { filename, normalized, project: validated.project };
}

// All layout/geometry work below is pure. Only createPdfScene's immutable
// snapshot and Web Crypto digest are asynchronous; no network or DOM is used.
function buildScene(input: PdfSceneInput, metrics: PdfTextMetrics, filename: string, sha256: string): PdfScene {
  const escapedFields = new Set<string>();
  const text = (value: string, field: string, max?: number) => {
    const result = pdfText(value, field, max);
    if (result.escaped) escapedFields.add(field);
    return result.text;
  };
  const course = input.normalized.courseCandidates.find(c => c.source.sourceKey === input.courseSourceKey)!;
  const name = course.source.tags.name;
  const title = text(typeof name === "string" && name.trim() ? name : `Course ${input.courseSourceKey}`, "courseTitle", 200);
  const pages: PdfScenePage[] = [];
  let vertices = 0;
  let primitives = 0;
  const addPage = (kind: PdfScenePage["kind"], heading: string, holeSourceKey?: SourceKey, map?: PdfHoleScene["map"]): PdfScenePage => {
    checkPdfBudget("pages", pages.length + 1);
    const header = wrapPdfText(heading, metrics).map((line, i) => box(line, "header", 36, 50 + i * 14, 10));
    requireMatch(header.length <= 3, "header", "Page identity does not fit.");
    const page: PdfScenePage = { kind, holeSourceKey, number: pages.length + 1, header, rows: [], footer: [], ...(map ? { map } : {}) };
    pages.push(page);
    return page;
  };
  function box(value: string, field: string, x: number, y: number, size: number): PdfSceneText {
    const width = metrics.width(value, size, "normal");
    requireMatch(Number.isFinite(width) && width >= 0 && x >= 36 && x + width <= 576.001 && y - size >= 36 && y <= 756, field, "Text exceeds page bounds.");
    return { text: value, field, x, y, size, width };
  }
  function rows(page: PdfScenePage, entries: { field: string; text: string }[], heading: string) {
    let current = page;
    let y = page.kind === "hole" ? 506 : 106;
    const capacity = Math.floor((660 - 106) / 14) + 1;
    for (const entry of entries) {
      let lines = wrapPdfText(entry.text, metrics);
      let continued = false;
      while (lines.length) {
        const slots = Math.floor((660 - y) / 14) + 1;
        if (slots <= 0 || lines.length > slots && lines.length <= capacity) {
          current = addPage("continuation", `${heading} | continued | Item / details`, page.holeSourceKey);
          y = 106;
          continue;
        }
        // Oversized rows use an explicit continuation marker on every block.
        const split: boolean = lines.length > capacity || continued;
        const marker = split ? ["Row continuation: " + entry.field] : [];
        const take = Math.min(lines.length, slots - marker.length);
        if (take <= 0) { y = 674; continue; }
        const block = [...marker, ...lines.splice(0, take)];
        current.rows.push({ ...entry, continuation: split, lines: block.map((line, i) => box(line, entry.field, 36, y + i * 14, 10)) });
        y += (block.length + 1) * 14;
        continued = split;
      }
    }
  }
  const sorted = input.normalized.holes.filter(h => input.selectedHoleKeys.includes(h.source.sourceKey)).sort((a, b) =>
    (a.number ?? Infinity) - (b.number ?? Infinity) || compare(a.source.sourceKey, b.source.sourceKey));
  const holes: PdfHoleScene[] = sorted.map(hole => {
    const key = hole.source.sourceKey;
    const state = input.project.holes[key] ?? { targets: [], carries: [] };
    const warnings = input.normalized.warnings.filter(w => !w.holeNumber || w.holeNumber === hole.number || w.sourceKey === key)
      .map(w => `${w.code}: ${w.affectedIdentity}; ${w.refs.join(", ")}`);
    const route = routeLength(hole);
    if (!route.available) warnings.push(route.reason);
    const projection = createProjection(holeCoordinates(hole));
    const transform = { scale: 0.65, translateX: 46, translateY: 96 };
    const map: PdfHoleScene["map"] = "kind" in projection ? { available: false, reason: projection.kind }
      : { available: true, region: MAP_REGION, clip: MAP_REGION, transform, primitives: [], labels: [] };
    function point(coordinate: { lat: number; lon: number }): Point {
      const p = projectCoordinate(projection as Projection, coordinate);
      const result = { x: transform.translateX + p.x * transform.scale, y: transform.translateY + p.y * transform.scale };
      requireMatch(Object.values(result).every(v => Number.isFinite(v) && Math.abs(v) <= 1e9), key, "Invalid projected operand.");
      return result;
    }
    function add(primitive: PdfMapPrimitive) {
      vertices += primitive.shape.type === "point" ? 1 : primitive.shape.type === "polyline" ? primitive.shape.points.length
        : primitive.shape.parts.reduce((n, part) => n + part.exterior.length + part.interiors.reduce((m, ring) => m + ring.length, 0), 0);
      checkPdfBudget("vertices", vertices);
      checkPdfBudget("primitives", ++primitives);
      if (map.available) map.primitives.push(primitive);
    }
    function shape(g: Geometry): PdfMapPrimitive["shape"] {
      if (g.type === "point") return { type: "point", point: point(g.coordinate), radius: 3 };
      if (g.type === "line") return { type: "polyline", points: g.coordinates.map(point) };
      return { type: "area", parts: areaParts(g).map(part => ({ exterior: part.exterior.map(point), interiors: part.interiors.map(ring => ring.map(point)) })), fillRule: "evenodd" };
    }
    function label(value: string, anchor: Point) {
      if (!map.available) return;
      const width = metrics.width(value, 8, "normal");
      const candidates = [{ x: anchor.x + 5, y: anchor.y - 5 }];
      for (let y = 110; y <= 470; y += 12) for (let x = 42; x <= 540; x += 60) candidates.push({ x, y });
      const position = candidates.find(p => p.x >= 36 && p.x + width <= 576 && p.y - 8 >= 96 && p.y <= 486
        && map.labels.every(other => p.x + width + 2 < other.x || other.x + other.width + 2 < p.x || p.y + 2 < other.y - 8 || other.y + 2 < p.y - 8));
      requireMatch(!!position, key, "Map labels cannot fit without overlap.");
      map.labels.push(box(value, `${key}.mapLabel`, position.x, position.y, 8));
    }
    if (map.available) {
      for (const kind of LAYER_ORDER) {
        const entries = [
          ...hole.features.map(feature => ({ feature, basis: "source-associated" as Basis, candidateHoleKeys: [] as SourceKey[] })),
          ...(hole.displayFeatures ?? []),
        ].filter(e => e.feature.kind === kind).sort((a, b) => compare(a.feature.source.sourceKey, b.feature.source.sourceKey));
        for (const entry of entries) {
          if (!entry.feature.geometry) { warnings.push(`Geometry unavailable: ${entry.feature.source.sourceKey}`); continue; }
          add({ identity: { kind: "source", sourceKey: entry.feature.source.sourceKey, basis: entry.basis, candidateHoleKeys: [...entry.candidateHoleKeys] }, style: kind, shape: shape(entry.feature.geometry) });
        }
      }
      if (hole.route) add({ identity: { kind: "source", sourceKey: key, basis: "source-associated", candidateHoleKeys: [] }, style: "route", shape: shape(hole.route) });
      const bar = scaleBar(projection as Projection);
      const start = { x: 72, y: 460 };
      add({ identity: { kind: "source", sourceKey: key, basis: "source-associated", candidateHoleKeys: [] }, style: "scale", shape: { type: "polyline", points: [start, { x: start.x + bar.logicalLength * transform.scale, y: start.y }] } });
      label(bar.label, start);
    } else warnings.push(`Map unavailable: ${map.reason}`);
    const outside = (p: Point) => p.x < 36 || p.x > 576 || p.y < 96 || p.y > 486;
    const targets = state.targets.map((target, i) => {
      const reference = `T${i + 1}`;
      const targetLabel = text(target.label, `${key}.${target.id}.label`, 40);
      if (map.available) {
        const p = point(target);
        add({ identity: { kind: "authored", id: target.id, reference }, style: "target", shape: { type: "point", point: p, radius: 5 } });
        label(reference, p);
        if (outside(p)) warnings.push(`${reference} ${target.id}: off-map target; guide clipped`);
      }
      return { id: target.id, reference, label: targetLabel, coordinate: { lat: target.lat, lon: target.lon }, distances: teeOrigins(hole).map(tee => {
        const meters = distanceMeters(tee.coordinate, target);
        return { teeSourceKey: tee.sourceKey, distance: typeof meters === "number" ? { available: true as const, meters, text: formatDistance(meters) }
          : { available: false as const, reason: "Straight-line distance unavailable" } };
      }) };
    });
    const carries = state.carries.map((carry, i) => {
      const reference = `C${i + 1}`;
      const origin = resolveCarryOrigin(carry.origin, hole, state.targets);
      let unavailable = "kind" in origin ? origin.kind : null;
      let clipped = false;
      if (map.available) {
        const rings = carryRings(carry, hole, state.targets, projection as Projection);
        if (!Array.isArray(rings)) unavailable = rings.kind;
        else for (const ring of rings) {
          clipped ||= ring.offMap;
          for (const segment of ring.segments) {
            const points = segment.map(p => {
              const result = { x: transform.translateX + p.x * transform.scale, y: transform.translateY + p.y * transform.scale };
              requireMatch(Object.values(result).every(v => Number.isFinite(v) && Math.abs(v) <= 1e9), carry.id, "Invalid carry operand.");
              return result;
            });
            add({ identity: { kind: "authored", id: carry.id, reference }, style: "carry", shape: { type: "polyline", points } });
          }
          label(`${reference} ${ring.yards} yd`, point(ring.coordinates[0]));
        }
      }
      if (unavailable) warnings.push(`${reference} ${carry.id}: ${unavailable}`);
      if (clipped) warnings.push(`${reference} ${carry.id}: off-map carry; guide clipped`);
      return { id: carry.id, reference, origin: structuredClone(carry.origin), distances: [...carry.distances], unavailable, clipped };
    });
    // Overlay drawing order: source layers, route/scale, carries, then targets.
    if (map.available) map.primitives.sort((a, b) => (a.style === "target" ? 2 : a.style === "carry" ? 1 : 0) - (b.style === "target" ? 2 : b.style === "carry" ? 1 : 0));
    return { sourceKey: key, number: hole.number, par: hole.par, routeLength: route, map, targets, carries, warnings };
  });
  const cover = addPage("cover", "Chart the Course | Yardage book");
  const disclaimer = legalText.match(/```text\n([\s\S]*?)\n```/)![1].replace(/\s+/g, " ");
  const sourceState = input.source.kind === "live" ? `${input.source.envelope.isStaleSource ? `Stale source; age ${input.source.envelope.sourceAgeDays} days` : "Fresh source"}; completed ${input.source.envelope.completedAt}`
    : `Synthetic fixture: ${input.source.fixtureId}; Apache-2.0 project license`;
  rows(cover, [
    { field: "courseTitle", text: title },
    { field: "courseIdentity", text: `Course ${input.courseSourceKey}; ${holes.length} selected holes: ${holes.map(h => `${h.number ?? "unnumbered"} (${h.sourceKey})`).join(", ")}` },
    { field: "exportMetadata", text: `Exported ${input.exportedAt}; app ${text(input.appVersion, "appVersion", 100)}` },
    { field: "sourceState", text: text(sourceState, "sourceState") },
    { field: "disclaimer", text: disclaimer },
  ], "Chart the Course | Cover");
  const summary = addPage("summary", "Course summary | Hole / par / mapped route / authored counts");
  rows(summary, [
    ...holes.map(h => ({ field: h.sourceKey, text: `Hole ${h.number ?? "unavailable"} (${h.sourceKey}); par ${h.par ?? "unavailable"}; mapped route ${measurementText(h.routeLength)}; ${h.targets.length} targets; ${h.carries.length} carries. ${h.warnings.join("; ")}` })),
    { field: "acknowledgements", text: input.source.kind === "live" ? "OSM source: ODbL-1.0. Authored targets/carries are separate from source data." : "Synthetic demo - not live OSM data. Bundled geometry; Apache-2.0 project. Authored targets/carries are separate." },
    { field: "sourcePair", text: `Source filename: ${filename}; SHA-256: ${sha256}. Share this exact source file with the PDF.` },
  ], "Course summary | Hole / par / mapped route / authored counts");
  for (const hole of holes) {
    const heading = `Hole ${hole.number ?? "unavailable"} (${hole.sourceKey}) | Item / details`;
    const page = addPage("hole", heading, hole.sourceKey, hole.map);
    rows(page, [
      { field: "mappedRoute", text: `Mapped route length: ${measurementText(hole.routeLength)}` },
      ...hole.targets.map(t => ({ field: t.id, text: `${t.reference} target ${t.id}; label: ${t.label}; straight-line distance: ${t.distances.length ? t.distances.map(d => `tee ${d.teeSourceKey}: ${measurementText(d.distance)}`).join("; ") : "unavailable (no supported source-associated tee origin)"}` })),
      ...hole.carries.map(c => ({ field: c.id, text: `${c.reference} carry ${c.id}; origin ${c.origin.kind === "tee" ? c.origin.sourceKey : c.origin.targetId}; distances ${c.distances.map(d => `${d} yd`).join(", ")}${c.unavailable ? `; unavailable: ${c.unavailable}` : ""}${c.clipped ? "; off-map guide clipped" : ""}` })),
      ...hole.warnings.map((warning, i) => ({ field: `${hole.sourceKey}.warning${i}`, text: `Warning: ${warning}` })),
      { field: "legend", text: "Legend: source-associated geometry; inferred-candidate / shared-candidate / course-context are display only with distinct dashed outlines; route dashed; targets T1-T10; carries C1-C5 dash-dot. All guides clipped to map. Full authored values appear in this table." },
    ], heading);
  }
  if (escapedFields.size) rows(addPage("continuation", "Text encoding warnings | Field / explanation"), [...escapedFields].map(field => ({ field, text: `Field ${field}: non-ASCII text uses visible [U+XXXX] code-point escapes after NFC normalization; original source/project unchanged.` })), "Text encoding warnings | Field / explanation");
  for (const page of pages) {
    const footers = input.source.kind === "live"
      ? ["Course geometry and map data © OpenStreetMap contributors.", "https://www.openstreetmap.org/copyright"]
      : ["Synthetic demo - not live OSM data", "Bundled synthetic geometry; Chart the Course project: Apache-2.0"];
    page.footer = [...footers, `Page ${page.number} / ${pages.length}`].map((line, i) => box(line, "footer", 36, 704 + 14 * i, 8));
  }
  const textPrimitives = pages.reduce((n, p) => n + p.header.length + p.footer.length + p.rows.reduce((a, r) => a + r.lines.length, 0), 0)
    + holes.reduce((n, h) => n + (h.map.available ? h.map.labels.length : 0), 0);
  primitives += textPrimitives;
  checkPdfBudget("primitives", primitives);
  return { page: { width: LETTER_WIDTH_PT, height: LETTER_HEIGHT_PT, margin: 36 }, courseSourceKey: input.courseSourceKey, courseTitle: title,
    source: { kind: input.source.kind, text: input.source.text, filename, sha256, exportedAt: input.exportedAt }, holes, pages,
    budgets: { pages: pages.length, vertices, primitives, maxPdfBytes: PDF_LIMITS.bytes } };
}

/** Capture before the only await; mutations during hashing cannot change this
 * package. #51 owns workspace-generation invalidation and finished-byte limits. */
export async function createPdfScene(input: PdfSceneInput, metrics: PdfTextMetrics): Promise<PdfSceneResult> {
  try {
    const snapshot = structuredClone(input);
    const { filename, normalized, project } = validateInput(snapshot);
    snapshot.normalized = normalized;
    // Validation can trim labels; preserve original authored strings for the
    // export text policy instead of silently altering the active snapshot.
    snapshot.project = { ...project, holes: snapshot.project.holes };
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(snapshot.source.text));
    const sha256 = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
    return { ok: true, scene: buildScene(snapshot, metrics, filename, sha256) };
  } catch (error) {
    return { ok: false, field: error instanceof PdfPreflightError ? error.field : "input", message: error instanceof Error ? error.message : "Invalid export input." };
  }
}
