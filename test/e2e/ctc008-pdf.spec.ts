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

  // 0.2% was stable across two local runs and the PR CI rerun after the
  // platform-neutral baseline fix; keep this tight unless new evidence says otherwise.
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
