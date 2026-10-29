import { jsPDF } from "jspdf";
import demoText from "../fixtures/overpass/synthetic-golf-course-ctc006.json?raw";
import multi from "../fixtures/overpass/synthetic-golf-course-multipolygon.json";
import { createPdfScene, type PdfScene, type PdfSceneInput } from "./pdfScene";
import { pdfText, wrapPdfText, PDF_LIMITS, checkPdfBudget } from "./pdfLayout";
import * as mapHelpers from "./map";
import { normalizeGolfCourse, type SourceKey } from "./normalize";
import { buildGisSourceExport } from "./gisSourceExport";
import { emptyProject, PROJECT_SCHEMA_V1, validateProjectFile } from "./project";
import { OVERPASS_ENDPOINT, type OverpassResponse, type SourceMetadata } from "./overpass";

const exportedAt = "2026-10-29T19:00:00.000Z";
const courseKey = "way/9000060001";
const holeKey = "way/9000060101";
const source: SourceMetadata = { query: "synthetic-detail-test", endpoint: OVERPASS_ENDPOINT, bbox: "35,-80,35.01,-79.99", completedAt: "2026-10-28T00:00:00.000Z", copyrightUrl: "https://www.openstreetmap.org/copyright" };
const context = { query: source.query, bbox: { south: 35, west: -80, north: 35.01, east: -79.99 } };
const doc = new jsPDF({ unit: "pt" });
const metrics = { width(value: string, size: number, weight: "normal" | "bold") { doc.setFont("Helvetica", weight); doc.setFontSize(size); return doc.getTextWidth(value); } };
function input(response: OverpassResponse = JSON.parse(demoText), selectedCourse: SourceKey = courseKey, metadata = source): PdfSceneInput {
  const normalized = normalizeGolfCourse(response, metadata, selectedCourse);
  const evidence = { mode: "detail" as const, cacheKey: "detail", rawResponse: JSON.stringify(response), source: metadata, consentState: "fresh" as const };
  const built = buildGisSourceExport(evidence, { ...context, query: metadata.query }, exportedAt);
  if (!built.ok) throw new Error(built.message);
  return { normalized, courseSourceKey: selectedCourse, selectedHoleKeys: normalized.holes.map(h => h.source.sourceKey), project: emptyProject(selectedCourse, exportedAt), source: { kind: "live", envelope: built.envelope, text: built.text, evidence, context: { ...context, query: metadata.query } }, exportedAt, appVersion: "0.0.0" };
}
async function scene(value: PdfSceneInput): Promise<PdfScene> {
  const result = await createPdfScene(value, metrics);
  if (!result.ok) throw new Error(`${result.field}: ${result.message}`);
  return result.scene;
}
function authored(value: PdfSceneInput, count = 1) {
  value.project.holes[holeKey] = {
    targets: Array.from({ length: count }, (_, i) => ({ id: `t-${i.toString(16).padStart(12, "0")}`, label: "😀".repeat(40), lat: 35.005, lon: -79.996 })),
    carries: Array.from({ length: 5 }, (_, i) => ({ id: `c-${i.toString(16).padStart(12, "0")}`, origin: { kind: "target", targetId: "t-000000000000" }, distances: [100, 150, 200, 250, 300] })),
  };
  return value;
}
function pageText(value: PdfScene): string { return value.pages.flatMap(p => [...p.header, ...p.rows.flatMap(r => r.lines), ...p.footer]).map(t => t.text).join(""); }

describe("active-project PDF scene", () => {
  it("builds deterministic source-paired scenes without mutating raw evidence or authored state", async () => {
    const value = authored(input());
    value.project.clubProfile.clubs = [{ id: "p-000000000000", label: "SECRET_PROFILE", carry: 150, longitudinal: 10, lateral: 10 }];
    const before = structuredClone(value);
    const result = await scene(value);
    expect(await scene(value)).toEqual(result);
    expect(value).toEqual(before);
    expect(result.source.text).toBe(value.source.text);
    const digest = await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value.source.text));
    expect(result.source.sha256).toBe([...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,"0")).join(""));
    expect(result.source.filename).toBe("ctc-gis-source-20261029T190000Z.json");
    expect(result.holes[0].targets[0]).toMatchObject({ id: "t-000000000000", reference: "T1", label: "[U+1F600]".repeat(40) });
    expect(result.holes[0].carries.map(c => c.id)).toEqual(value.project.holes[holeKey]!.carries.map(c => c.id));
    expect(result.holes[0].carries[0].distances).toEqual([100, 150, 200, 250, 300]);
    expect(pageText(result)).not.toContain("SECRET_PROFILE");
    expect(pageText(result)).toContain("independent open-source project");
    expect(pageText(result)).toContain("https://www.openstreetmap.org/copyright");
    expect(pageText(result)).toContain(result.source.sha256);
    // The snapshot is captured before async hashing yields.
    const pending = createPdfScene(value, metrics);
    value.project.holes[holeKey]!.targets[0].label = "changed";
    expect(await pending).toEqual({ ok: true, scene: result });
  });

  it("orders repeated/missing numbers and selected identities independently of source and selection order", async () => {
    const raw = JSON.parse(demoText) as OverpassResponse;
    const route = raw.elements.find(e => e.id === 9000060101)!;
    raw.elements.push({ ...route, id: 9000060103, tags: { golf: "hole" } }, { ...route, id: 9000060102 });
    const a = input(raw);
    const b = input({ ...raw, elements: [...raw.elements].reverse() });
    b.selectedHoleKeys = [...b.selectedHoleKeys].reverse();
    const first = await scene(a);
    const second = await scene(b);
    expect(first.holes).toEqual(second.holes);
    expect(first.holes.map(h => [h.number, h.sourceKey])).toEqual([[1, holeKey], [1, "way/9000060102"], [null, "way/9000060103"]]);
    expect(first.pages.filter(p => p.kind === "hole").map(p => p.holeSourceKey)).toEqual(first.holes.map(h => h.sourceKey));
    a.selectedHoleKeys = ["way/9000060103"];
    expect((await scene(a)).holes).toHaveLength(1);
  });

  it("accepts empty and migrated v1 projects and rejects foreign, duplicate and malformed input", async () => {
    expect((await scene(input())).holes[0].targets).toEqual([]);
    const value = input();
    const { clubProfile: _clubs, ...base } = value.project;
    const migrated = validateProjectFile({ ...base, schema: PROJECT_SCHEMA_V1 });
    if (!migrated.ok) throw new Error("migration failed");
    value.project = migrated.project;
    expect((await scene(value)).holes[0].carries).toEqual([]);
    const mutations = [
      (v: PdfSceneInput) => { v.selectedHoleKeys = [holeKey, holeKey]; },
      (v: PdfSceneInput) => { v.selectedHoleKeys = ["way/999"]; },
      (v: PdfSceneInput) => { v.selectedHoleKeys = []; },
      (v: PdfSceneInput) => { v.project.courseSourceKey = "way/999"; },
      (v: PdfSceneInput) => { v.normalized.holes[0].route = null; },
      (v: PdfSceneInput) => { if (v.source.kind === "live") v.source.text += " "; },
      (v: PdfSceneInput) => { if (v.source.kind === "live") v.source.evidence.mode = "discovery" as "detail"; },
      (v: PdfSceneInput) => { v.normalized.source.query = "different"; },
      (v: PdfSceneInput) => { v.project.holes[holeKey] = { targets: [{ id: "t-000000000000", label: "x", lat: NaN, lon: 0 }], carries: [] }; },
    ];
    for (const mutate of mutations) {
      const bad = input(); mutate(bad);
      expect(await createPdfScene(bad, metrics)).toMatchObject({ ok: false });
    }
  });

  it("supports a selected second facility without substituting the first course", async () => {
    const raw = JSON.parse(demoText) as OverpassResponse;
    const first = raw.elements.find(e => e.id === 9000060001)!;
    const route = raw.elements.find(e => e.id === 9000060101)!;
    const shift = (e: typeof first, id: number) => ({ ...e, id, geometry: (e.geometry as {lat:number;lon:number}[]).map(p => ({ lat:p.lat, lon:p.lon + 1 })) });
    raw.elements.push(shift(first, 99), shift(route, 100));
    const value = input(raw, "way/99");
    const result = await scene(value);
    expect(result.courseSourceKey).toBe("way/99");
    expect(result.holes.map(h => h.sourceKey)).toEqual(["way/100"]);
    value.selectedHoleKeys = [holeKey];
    expect(await createPdfScene(value, metrics)).toMatchObject({ ok:false, field:"selectedHoleKeys" });
  });

  it("preserves parts, interiors, independent fills, source basis and clipped display-only context", async () => {
    const independent = structuredClone(multi) as OverpassResponse;
    const parent = independent.elements.find(e => e.id === 9000070301)!;
    const inner = (parent.members as {ref:number;role:string;geometry:unknown}[]).find(m => m.role === "inner")!;
    independent.elements.push({type:"way",id:inner.ref,tags:{golf:"water_hazard",ref:"1"},geometry:inner.geometry});
    const value = input(independent);
    const result = await scene(value);
    const map = result.holes[0].map;
    if (!map.available) throw new Error("missing map");
    const areas = map.primitives.filter(p => p.shape.type === "area");
    expect(areas.some(p => p.shape.type === "area" && p.shape.parts.some(part => part.interiors.length > 0))).toBe(true);
    expect(areas.some(p => p.shape.type === "area" && p.shape.parts.length > 1)).toBe(true);
    expect(map.clip).toEqual({ x:36, y:96, width:540, height:390 });
    expect(areas.every(p => p.shape.type === "area" && p.shape.fillRule === "evenodd")).toBe(true);
    expect(areas.some(p => p.identity.kind === "source" && p.identity.sourceKey === `way/${inner.ref}` && p.style === "golf-water")).toBe(true);
    const raw = JSON.parse(demoText) as OverpassResponse;
    raw.elements.forEach(e => { if (e.tags?.golf !== "hole" && e.tags) delete e.tags.ref; });
    const display = await scene(authored(input(raw)));
    const displayMap = display.holes[0].map;
    if (!displayMap.available) throw new Error("missing display map");
    expect(displayMap.primitives.some(p => p.identity.kind === "source" && p.identity.basis === "inferred-candidate")).toBe(true);
    expect(display.holes[0].targets[0].distances).toEqual([]);
    const originalMap = (await scene(authored(input()))).holes[0].map;
    expect(displayMap.transform).toEqual(originalMap.available ? originalMap.transform : null);
  });

  it("retains unsupported geometry warnings and unavailable carry origins without inventing arcs", async () => {
    const raw = structuredClone(multi) as OverpassResponse;
    const relation = raw.elements.find(e => e.type === "relation" && e.tags?.golf === "fairway")!;
    relation.members = [];
    const value = authored(input(raw));
    value.project.holes[holeKey]!.carries[0].origin = { kind: "tee", sourceKey: "relation/999" };
    const result = await scene(value);
    expect(result.holes[0].warnings.join(" ")).toContain("INVALID_RELATION_TOPOLOGY");
    expect(result.holes[0].carries[0].unavailable).toBe("origin-unavailable");
    const map = result.holes[0].map;
    expect(map.available && map.primitives.some(p => p.style === "carry" && p.identity.kind === "authored" && p.identity.id === "c-000000000000")).toBe(false);
  });

  it("retains a selected hole and authored rows on projection-helper failure", async () => {
    // Current normalization excludes invalid/near-pole routes before they can
    // be selected. Inject a helper failure to verify defensive page retention.
    const failure = vi.spyOn(mapHelpers,"createProjection").mockReturnValue({kind:"invalid-projection"});
    try {
      const result = await scene(authored(input()));
      expect(result.holes[0].map).toEqual({available:false, reason:"invalid-projection"});
      expect(result.pages.some(p => p.kind === "hole" && p.map?.available === false)).toBe(true);
      expect(pageText(result)).toContain("t-000000000000");
    } finally { failure.mockRestore(); }
  });

  it("wraps full worst-case authored rows and identifiers within measured boxes with adjacent continuations", async () => {
    const raw = JSON.parse(demoText) as OverpassResponse;
    raw.elements.find(e => e.id === 9000060001)!.tags!.name = "W".repeat(200);
    const value = authored(input(raw), 10);
    const result = await scene(value);
    expect(result.pages.filter(p => p.kind === "continuation").length).toBeGreaterThan(1);
    for (const page of result.pages) {
      for (const entry of [...page.header,...page.rows.flatMap(r => r.lines),...page.footer]) {
        expect(entry.x + entry.width).toBeLessThanOrEqual(576.001);
        expect(entry.y - entry.size).toBeGreaterThanOrEqual(36);
        expect(entry.y).toBeLessThanOrEqual(756);
        expect(metrics.width(entry.text,entry.size,"normal")).toBe(entry.width);
      }
      const baselines = page.rows.flatMap(r => r.lines.map(l => l.y));
      expect(new Set(baselines).size).toBe(baselines.length);
      expect(baselines.every(y => y <= 660 && y >= (page.kind === "hole" ? 506 : 106))).toBe(true);
    }
    expect(result.pages.flatMap(p => p.rows).filter(r => r.field === "t-000000000009").flatMap(r=>r.lines).map(l=>l.text).join("")).toContain("[U+1F600]".repeat(40));
    expect(result.budgets.pages).toBe(result.pages.length);
    expect(result.budgets.primitives).toBeLessThanOrEqual(PDF_LIMITS.primitives);
    expect(result.budgets.vertices).toBeLessThanOrEqual(PDF_LIMITS.vertices);
    expect(result.budgets.maxPdfBytes).toBe(10*1024*1024);
  });

  it("validates title/label limits, NFC/astral escapes, inert punctuation and forbidden text", async () => {
    expect(pdfText("Cafe\u0301 😀", "test").text).toBe("Caf[U+00E9] [U+1F600]");
    expect(pdfText("<script>(/JS) \\ file://x", "test").text).toBe("<script>(/JS) \\ file://x");
    expect(pdfText("a\tb\nc\rd", "test").text).toBe("a b c d");
    for (const bad of ["\0", "\u0085", "\u202e", "\u2066", "\ud800"]) expect(() => pdfText(bad, "label")).toThrow();
    expect(wrapPdfText("W".repeat(200),metrics).join("")).toBe("W".repeat(200));
    const raw = JSON.parse(demoText) as OverpassResponse;
    raw.elements.find(e=>e.id===9000060001)!.tags!.name = "W".repeat(201);
    expect(await createPdfScene(input(raw),metrics)).toMatchObject({ok:false,field:"courseTitle"});
    const badLabel = authored(input());
    badLabel.project.holes[holeKey]!.targets[0].label = "\u202e";
    expect(await createPdfScene(badLabel,metrics)).toMatchObject({ok:false,field:`${holeKey}.t-000000000000.label`});
    expect(await createPdfScene(input(),{width:()=>NaN})).toMatchObject({ok:false});
  });

  it("validates synthetic identity, exact bundled bytes and distinct per-page provenance", async () => {
    const value = input();
    value.source = {kind:"synthetic",fixtureId:"synthetic-golf-course-ctc006.json",text:demoText};
    const result = await scene(value);
    expect(result.source.filename).toBe("ctc-synthetic-source-20261029T190000Z.json");
    expect(result.pages.every(p=>p.footer.some(t=>t.text === "Synthetic demo - not live OSM data"))).toBe(true);
    expect(pageText(result)).not.toContain("Fresh source");
    value.source.text += "\n";
    expect(await createPdfScene(value,metrics)).toMatchObject({ok:false,field:"source"});
  });

  it("prints stale consent/age and binds the digest to the exact final newline", async () => {
    const value = input();
    if (value.source.kind !== "live") throw new Error("live required");
    value.source.evidence.consentState = "stale-consented";
    const built = buildGisSourceExport(value.source.evidence,value.source.context,exportedAt);
    if (!built.ok) throw new Error(built.message);
    value.source.envelope = built.envelope;
    value.source.text = built.text;
    expect(pageText(await scene(value))).toContain("Stale source; age 1 days");
    value.source.envelope.isStaleSource = false;
    expect(await createPdfScene(value,metrics)).toMatchObject({ok:false,field:"source"});
  });

  it("enforces exact numeric caps and rejects excessive holes, pages and oversized evidence without a partial scene", async () => {
    for (const field of ["holes","pages","vertices","primitives","bytes"] as const) {
      expect(()=>checkPdfBudget(field,PDF_LIMITS[field])).not.toThrow();
      expect(()=>checkPdfBudget(field,PDF_LIMITS[field]+1)).toThrow(/fewer holes|smaller source/);
    }
    const raw = JSON.parse(demoText) as OverpassResponse;
    const route = raw.elements.find(e=>e.id===9000060101)!;
    for (let i=1;i<36;i++) raw.elements.push({...route,id:9000060101+i,tags:{golf:"hole",ref:String(i+1)}});
    const value = input(raw);
    expect((await scene(value)).holes).toHaveLength(36);
    value.selectedHoleKeys = [...value.selectedHoleKeys,"way/999"];
    expect(await createPdfScene(value,metrics)).toMatchObject({ok:false,field:"selectedHoleKeys"});
    value.selectedHoleKeys = value.normalized.holes.map(h=>h.source.sourceKey);
    const template = authored(input(),10).project.holes[holeKey]!;
    for (const [i,key] of value.selectedHoleKeys.entries()) value.project.holes[key] = {
      targets: template.targets.map((t,j)=>({...t,id:`t-${(i*10+j).toString(16).padStart(12,"0")}`})),
      carries: template.carries.map((c,j)=>({...c,id:`c-${(i*5+j).toString(16).padStart(12,"0")}`,origin:{kind:"target",targetId:`t-${(i*10).toString(16).padStart(12,"0")}`}})),
    };
    expect(await createPdfScene(value,metrics)).toMatchObject({ok:false,field:"pages"});
    const oversized = input();
    oversized.source.text = " ".repeat(1_048_577);
    expect(await createPdfScene(oversized,metrics)).toMatchObject({ok:false,field:"source"});
  }, 30_000);

  it("caps repeated context geometry across a 36-hole book before returning pages", async () => {
    const raw = JSON.parse(demoText) as OverpassResponse;
    const route = raw.elements.find(e=>e.id===9000060101)!;
    for (let i=1;i<36;i++) raw.elements.push({...route,id:9000060101+i,tags:{golf:"hole",ref:String(i+1)}});
    const manyVertices = structuredClone(raw);
    manyVertices.elements.push({type:"way",id:999,tags:{natural:"tree_row"},geometry:Array.from({length:2800},(_,i)=>({lat:35.001+i/1_000_000,lon:-79.999}))});
    expect(await createPdfScene(input(manyVertices),metrics)).toMatchObject({ok:false,field:"vertices"});
    const manyPrimitives = structuredClone(raw);
    manyPrimitives.elements.push(...Array.from({length:600},(_,i)=>({type:"node" as const,id:10000+i,tags:{natural:"tree"},lat:35.001+i/1_000_000,lon:-79.999})));
    expect(await createPdfScene(input(manyPrimitives),metrics)).toMatchObject({ok:false,field:"primitives"});
  },30_000);
});
