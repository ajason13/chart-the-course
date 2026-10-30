import { expect, test, type Page, type Route, type Locator } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import demo from "../../fixtures/overpass/synthetic-golf-course-ctc006.json" with { type: "json" };
import multi from "../../fixtures/overpass/synthetic-golf-course-multipolygon.json" with { type: "json" };
import type { OverpassResponse } from "../../src/overpass";
import { inspectPdf, readFile, buffer, sha256 } from "./pdfInspection.mjs";

const endpoint = "https://overpass-api.de/api/interpreter";
const fixedTime = "2026-10-29T22:00:00.000Z";
const holeKey = "way/9000060101";
declare global {
  interface Window { __pdfTest: { hold: boolean; failHash: boolean; failDownload: boolean; release: (() => void)[]; created: string[]; revoked: string[] } }
}
async function instrumentation(page: Page) {
  await page.addInitScript(() => {
    window.__pdfTest = { hold: false, failHash: false, failDownload: false, release: [], created: [], revoked: [] };
    const digest = crypto.subtle.digest.bind(crypto.subtle);
    crypto.subtle.digest = async (algorithm, data) => {
      if (window.__pdfTest.failHash) throw new Error("Injected hashing failure");
      if (window.__pdfTest.hold) await new Promise<void>(resolve => window.__pdfTest.release.push(resolve));
      return digest(algorithm, data);
    };
    const create = URL.createObjectURL.bind(URL); const revoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = blob => { if (window.__pdfTest.failDownload) throw new Error("Injected download failure"); const url = create(blob); window.__pdfTest.created.push(url); return url; };
    URL.revokeObjectURL = url => { window.__pdfTest.revoked.push(url); revoke(url); };
  });
}
async function isolated(page: Page, handler?: (route: Route) => Promise<void>) {
  const requests: string[] = [];
  await page.route("**/*", async route => {
    const url = route.request().url();
    requests.push(url);
    if (new URL(url).hostname === "127.0.0.1") return route.continue();
    if (url === endpoint && handler) return handler(route);
    throw new Error(`Unexpected external request: ${url}`);
  });
  return requests;
}
async function loadLive(page: Page, raw: string, options: { failAfterFirst?: boolean } = {}) {
  let details = 0;
  const requests = await isolated(page, async route => {
    const detail = (route.request().postData() ?? "").includes("purpose%3Agolf-course-detail");
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    if (detail || query.includes("purpose:golf-course-detail")) {
      details++;
      return route.fulfill(options.failAfterFirst && details > 1 ? { status: 500 } : { body: raw, contentType: "application/json" });
    }
    return route.fulfill({ json: { elements: [{ type: "way", id: 9000060001, bounds: { minlat: 35, minlon: -80, maxlat: 35.01, maxlon: -79.99 }, tags: { leisure: "golf_course", name: "Fixture course" } }] } });
  });
  await page.goto("/");
  await searchAndOpen(page);
  return requests;
}
async function searchAndOpen(page: Page, ready = true) {
  for (const [label, value] of [["South", "35"], ["West", "-80"], ["North", "35.01"], ["East", "-79.99"]]) await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByRole("button", { name: "Search courses", exact: true }).click();
  await page.getByRole("button", { name: "Open course", exact: true }).click();
  if (ready) await expect(page.getByRole("heading", { name: "Printable yardage book" })).toBeVisible();
}
async function bytes(page: Page, control: Locator) {
  const pending = page.waitForEvent("download"); await control.click(); const download = await pending;
  const path = await download.path(); if (!path) throw new Error("Missing downloaded file");
  return { data: await readFile(path), filename: download.suggestedFilename() };
}
async function prepare(page: Page) {
  await page.getByRole("button", { name: "Prepare yardage book", exact: true }).click();
  await expect(page.getByRole("button", { name: "Download PDF", exact: true })).toBeEnabled();
}
async function importAuthored(page: Page, count = 1) {
  const value = {
    schema: "chart-the-course-project/v2", exportedAt: fixedTime, courseSourceKey: "way/9000060001", courseCopyrightUrl: "https://www.openstreetmap.org/copyright",
    holes: { [holeKey]: {
      targets: Array.from({ length: count }, (_, i) => ({ id: `t-${i.toString(16).padStart(12, "0")}`, label: count > 1 ? "😀".repeat(40) : "Café (/JS) <script>", lat: 35.005, lon: -79.996 })),
      carries: [{ id: "c-000000000000", origin: { kind: "target", targetId: "t-000000000000" }, distances: [100, 150, 200, 250, 300] }],
    } }, clubProfile: { clubs: [{ id: "p-000000000000", label: "DO_NOT_PRINT_CLUB", carry: 150, longitudinal: 10, lateral: 10 }] },
  };
  page.once("dialog", dialog => dialog.accept());
  await page.getByLabel("Import project file (.json)").setInputFiles({ name: "project.json", mimeType: "application/json", buffer: buffer(JSON.stringify(value)) });
  await expect(page.getByText("Project imported successfully.", { exact: true })).toBeVisible();
}

test("active demo PDF and exact fixture download are frozen, keyboard accessible and network isolated", async ({ page }, testInfo) => {
  await instrumentation(page); await page.clock.setFixedTime(new Date(fixedTime)); const requests = await isolated(page);
  await page.goto("/"); await page.getByRole("button", { name: "Open synthetic demo", exact: true }).click();
  await importAuthored(page);
  const count = requests.length;
  const button = page.getByRole("button", { name: "Prepare yardage book", exact: true });
  await button.focus(); await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Download PDF", exact: true })).toBeEnabled();
  const pdf = await bytes(page, page.getByRole("button", { name: "Download PDF", exact: true }));
  const source = await bytes(page, page.getByRole("button", { name: "Download matching synthetic source", exact: true }));
  expect(source.data.toString()).toBe(await readFile("fixtures/overpass/synthetic-golf-course-ctc006.json", "utf8"));
  expect(pdf.filename).toBe("ctc-yardage-20261029T220000Z.pdf");
  expect(source.filename).toBe("ctc-synthetic-source-20261029T220000Z.json");
  const evidence = await inspectPdf(pdf.data);
  expect(evidence.text).toContain(sha256(source.data));
  expect(evidence.text).toContain(source.filename);
  expect(evidence.text).toContain("Caf[U+00E9] (/JS) <script>");
  expect(evidence.text).not.toContain("DO_NOT_PRINT_CLUB");
  expect(evidence.pages[0].text).toContain("Yardage book");
  expect(evidence.pages[1].text).toContain("Course summary");
  for (const p of evidence.pages) { expect(p.text).toContain("Synthetic demo - not live OSM data"); expect(p.images).toBe(0); }
  expect(evidence.pages.some(p => p.paths > 0)).toBe(true);
  expect(evidence.pages.some(p => p.dashes.some(d => d.length === 4))).toBe(true);
  await testInfo.attach("demo-map", { body: evidence.pages[2].png, contentType: "image/png" });
  expect(evidence.pages[2].png).toMatchSnapshot("demo-map.png", { maxDiffPixelRatio: 0.002 });
  expect(requests).toHaveLength(count);
  const axe = await new AxeBuilder({ page }).include("main").analyze(); expect(axe.violations).toEqual([]);
  await expect.poll(() => page.evaluate(() => [window.__pdfTest.created.length, window.__pdfTest.revoked.length])).toEqual([2, 2]);
  await page.getByRole("checkbox", { name: /Hole 1/ }).uncheck();
  await expect(page.getByRole("button", { name: "Download PDF", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Download matching synthetic source" })).toBeDisabled();
});

test("live multipolygon PDF retains vector interiors, selected holes, full attribution and exact raw evidence", async ({ page }, testInfo) => {
  await instrumentation(page); await page.clock.setFixedTime(new Date(fixedTime));
  const raw = ` ${JSON.stringify(multi)}\n`; const requests = await loadLive(page, raw);
  const count = requests.length; await prepare(page);
  const pdf = await bytes(page, page.getByRole("button", { name: "Download PDF", exact: true }));
  const source = await bytes(page, page.getByRole("button", { name: "Download matching Raw GIS Source (ODbL)", exact: true }));
  const envelope = JSON.parse(source.data.toString());
  expect(envelope.rawResponse).toBe(raw); expect(envelope.exportedAt).toBe(fixedTime); expect(envelope.isStaleSource).toBe(false);
  expect(source.data.toString()).not.toContain('"targets"'); expect(source.data.toString()).not.toContain('"clubProfile"');
  const evidence = await inspectPdf(pdf.data);
  expect(evidence.text).toContain(source.filename); expect(evidence.text).toContain(sha256(source.data));
  for (const p of evidence.pages) { expect(p.text).toContain("© OpenStreetMap contributors"); expect(p.text).toContain("https://www.openstreetmap.org/copyright"); expect(p.images).toBe(0); }
  expect(evidence.pages[2].evenOdd).toBeGreaterThan(0);
  expect(evidence.pages[2].interiorGray).toBe(255);
  expect(evidence.pages[2].areaGray).toBe(222);
  expect(evidence.pages[2].png).toMatchSnapshot("live-interiors.png", { maxDiffPixelRatio: 0.002 });
  await testInfo.attach("live-interiors", { body: evidence.pages[2].png, contentType: "image/png" });
  expect(requests).toHaveLength(count);
});

test("active export preserves overflow, escapes and all authored rows across adjacent continuations", async ({ page }) => {
  const raw = structuredClone(demo); raw.elements.find(e => e.id === 9000060001)!.tags!.name = "W".repeat(200);
  await page.clock.setFixedTime(new Date(fixedTime)); await loadLive(page, JSON.stringify(raw)); await importAuthored(page, 10); await prepare(page);
  const pdf = await bytes(page, page.getByRole("button", { name: "Download PDF", exact: true }));
  const evidence = await inspectPdf(pdf.data);
  expect(evidence.pages.length).toBeGreaterThan(4);
  expect(evidence.text).toContain("W".repeat(200));
  for (let i = 0; i < 10; i++) expect(evidence.text).toContain(`t-${i.toString(16).padStart(12, "0")}`);
  expect(evidence.text).toContain("[U+1F600]".repeat(40));
  expect(evidence.text).toContain("300 yd");
  const continuation = evidence.pages.find(p => p.text.includes("continued | Item / details")); expect(continuation).toBeDefined();
  expect(continuation!.png).toMatchSnapshot("overflow-continuation.png", { maxDiffPixelRatio: 0.002 });
});

for (const mutation of ["selection", "project", "source", "refresh"] as const) {
  test(`invalidates pending hashing and both prepared files on ${mutation} change`, async ({ page }) => {
    await instrumentation(page); await loadLive(page, JSON.stringify(demo));
    await page.evaluate(() => { window.__pdfTest.hold = true; });
    await page.getByRole("button", { name: "Prepare yardage book", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.__pdfTest.release.length)).toBe(1);
    if (mutation === "selection") await page.getByRole("checkbox", { name: /Hole 1/ }).uncheck();
    if (mutation === "project") await importAuthored(page);
    if (mutation === "source") await page.getByRole("button", { name: "Open synthetic demo", exact: true }).click();
    if (mutation === "refresh") await page.getByRole("button", { name: "Refresh course data", exact: true }).click();
    await page.evaluate(() => { window.__pdfTest.hold = false; window.__pdfTest.release.forEach(release => release()); });
    await expect(page.getByRole("button", { name: "Download PDF", exact: true })).toBeDisabled();
    await expect(page.getByRole("button", { name: /Download matching/ })).toBeDisabled();
    if (mutation === "selection") await page.getByRole("checkbox", { name: /Hole 1/ }).check();
    await prepare(page);
    if (mutation === "project") {
      const pdf = await bytes(page, page.getByRole("button", { name: "Download PDF", exact: true }));
      expect((await inspectPdf(pdf.data)).text).toContain("t-000000000000");
    }
  });
}

test("hashing and download setup failures retain edits and allow retry with URL cleanup", async ({ page }) => {
  await instrumentation(page); await loadLive(page, JSON.stringify(demo)); await importAuthored(page);
  await page.evaluate(() => { window.__pdfTest.failHash = true; });
  await page.getByRole("button", { name: "Prepare yardage book", exact: true }).click();
  await expect(page.getByText(/Export failed:.*Injected hashing failure/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Download PDF", exact: true })).toBeDisabled();
  await page.evaluate(() => { window.__pdfTest.failHash = false; }); await prepare(page);
  await page.evaluate(() => { window.__pdfTest.failDownload = true; });
  await page.getByRole("button", { name: "Download PDF", exact: true }).click();
  await expect(page.getByText(/Download failed:.*Injected download failure/)).toBeVisible();
  await page.evaluate(() => { window.__pdfTest.failDownload = false; });
  await bytes(page, page.getByRole("button", { name: "Download PDF", exact: true }));
  // Replacement revokes an outstanding URL even before its deferred cleanup.
  await page.getByRole("checkbox", { name: /Hole 1/ }).uncheck();
  await expect.poll(() => page.evaluate(() => [window.__pdfTest.created.length, window.__pdfTest.revoked.length])).toEqual([1, 1]);
});

test("stale consent pairs the exact stored source and discloses completion and age without export requests", async ({ page }) => {
  const completedAt = "2026-10-01T00:00:00.000Z";
  await page.clock.setFixedTime(new Date(completedAt));
  const requests = await loadLive(page, JSON.stringify(demo), { failAfterFirst: true });
  await page.clock.setFixedTime(new Date("2026-10-09T00:00:00.000Z"));
  await page.reload(); await searchAndOpen(page, false);
  await expect(page.getByRole("region", { name: "Stored course data available" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Prepare yardage book" })).toHaveCount(0);
  await page.getByRole("button", { name: "Render stored course data", exact: true }).click();
  const count = requests.length; await prepare(page);
  const pdf = await bytes(page, page.getByRole("button", { name: "Download PDF", exact: true }));
  const source = await bytes(page, page.getByRole("button", { name: "Download matching Raw GIS Source (ODbL)", exact: true }));
  const envelope = JSON.parse(source.data.toString());
  expect(envelope).toMatchObject({ completedAt, consentState: "stale-consented", isStaleSource: true, sourceAgeDays: 8, rawResponse: JSON.stringify(demo) });
  const evidence = await inspectPdf(pdf.data);
  expect(evidence.text).toContain(`Stale source; age 8 days; completed ${completedAt}`);
  expect(evidence.text).toContain(sha256(source.data)); expect(requests).toHaveLength(count);
});

test("oversized source blocks both artifacts without changing the workspace", async ({ page }) => {
  await loadLive(page, JSON.stringify(demo) + " ".repeat(1_048_576));
  await expect(page.getByRole("button", { name: "Prepare yardage book" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Download PDF", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Download matching Raw GIS Source (ODbL)", exact: true })).toBeDisabled();
  await expect(page.getByRole("heading", { name: "Selected-hole map", exact: true })).toBeVisible();
});

test("multiple selected holes print in numeric order and selection changes invalidate ready artifacts", async ({ page }) => {
  const raw = structuredClone(demo) as OverpassResponse;
  const route = raw.elements.find(e => e.id === 9000060101)!;
  raw.elements.push({ ...route, id: 9000060102, tags: { golf: "hole", ref: "2" } });
  await loadLive(page, JSON.stringify(raw));
  await prepare(page);
  await page.getByRole("checkbox", { name: /Hole 2/ }).check();
  await expect(page.getByRole("button", { name: "Download PDF", exact: true })).toBeDisabled();
  await prepare(page);
  const pdf = await bytes(page, page.getByRole("button", { name: "Download PDF", exact: true }));
  const evidence = await inspectPdf(pdf.data);
  const maps = evidence.pages.filter(p => p.paths > 0);
  expect(maps).toHaveLength(2);
  expect(maps[0].text).toContain("Hole 1 (way/9000060101)");
  expect(maps[1].text).toContain("Hole 2 (way/9000060102)");
  await page.getByRole("button", { name: "Open synthetic demo", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: /Hole 1/ })).toBeChecked();
  await prepare(page);
});


test("independently tagged inner water stays filled through an even-odd fairway exclusion", async ({ page }) => {
  const raw = structuredClone(multi);
  const relation = raw.elements.find(e => e.id === 9000070301)!;
  const inner = relation.members!.find(m => m.role === "inner")!;
  // Preserve member provenance while adding its independent source semantics.
  const response = { ...raw, elements: [...raw.elements, { type: "way", id: inner.ref, tags: { golf: "water_hazard", ref: "1" }, geometry: inner.geometry }] };
  await loadLive(page, JSON.stringify(response)); await prepare(page);
  const pdf = await bytes(page, page.getByRole("button", { name: "Download PDF", exact: true }));
  const evidence = await inspectPdf(pdf.data);
  // jsPDF quantizes 190/255 to the two-decimal PDF gray value 0.75.
  expect(evidence.pages[2].interiorGray).toBe(191);
  expect(evidence.pages[2].areaGray).toBe(222);
});

// The current normalizer excludes unusable routes before workspace selection.
// Exercise the renderer's defensive no-projection branch with a closed scene
// fixture, without adding a production fault-injection API.
test("defensive unavailable-map page renders an explicit panel and retains authored rows", async () => {
  const { renderPdf } = await import("../../src/pdfRenderer");
  const { scene } = await import("./unavailablePdfFixture");
  const evidence = await inspectPdf(new Uint8Array(renderPdf(scene)));
  expect(evidence.pages).toHaveLength(1);
  expect(evidence.text).toContain("Map unavailable");
  expect(evidence.text).toContain("t-000000000000; straight-line distance unavailable");
  expect(evidence.pages[0].png).toMatchSnapshot("map-unavailable.png", { maxDiffPixelRatio: 0.002 });
});
