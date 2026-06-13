import { expect, test, type Page, type Route } from "@playwright/test";

async function isolateNetwork(page: Page) {
  await page.route("**/*", async (route: Route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") await route.continue();
    else throw new Error(`Unexpected external request: ${url.href}`);
  });
}

test("CTC-014 candidates produce independently attributable browser evidence", async ({ page }, testInfo) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await isolateNetwork(page);
  await page.goto("/ctc014.html");
  await expect
    .poll(async () => ({
      ready: await page.evaluate(() => typeof window.ctc014Experiment?.renderJsPdfDirect === "function"),
      pageErrors,
    }))
    .toEqual({ ready: true, pageErrors: [] });

  const evidence = await page.evaluate(async () => {
    const experiment = window.ctc014Experiment;
    async function measure(render: () => Uint8Array | Promise<Uint8Array>) {
      try {
        const pdf = await render();
        const bytes = pdf.byteLength;
        return { evidence: { ...await experiment.analyzePdf(pdf), bytes }, error: null };
      } catch (error) {
        return { evidence: null, error: error instanceof Error ? error.message : String(error) };
      }
    }
    return {
      direct: await measure(() => experiment.renderJsPdfDirect()),
      svg: await measure(() => experiment.renderJsPdfSvg()),
      pdfkitDirect: await measure(() => experiment.renderPdfKitDirect()),
      pdfkitSvg: await measure(() => experiment.renderPdfKitSvg()),
    };
  });
  await testInfo.attach("ctc014-candidate-evidence", {
    body: JSON.stringify(evidence, null, 2),
    contentType: "application/json",
  });
  console.log(JSON.stringify(evidence, null, 2));

  for (const result of [evidence.direct, evidence.svg]) {
    expect(result.error).toBeNull();
    const candidate = result.evidence!;
    expect(candidate.bytes).toBeGreaterThan(0);
    expect(candidate.pages).toBe(1);
    expect(candidate.width).toBeCloseTo(612, 1);
    expect(candidate.height).toBeCloseTo(792, 1);
    expect(candidate.text).toContain("Course geometry and map data © OpenStreetMap contributors.");
    expect(candidate.text).toContain("https://www.openstreetmap.org/copyright");
    expect(candidate.text).toContain("219 yd / 200 m");
    expect(candidate.pathOperations).toBeGreaterThan(0);
    expect(candidate.imageOperations).toBe(0);
  }
  const carryDash = evidence.direct.evidence!.dashPatterns.find((pattern) => pattern.length === 4);
  expect(carryDash).toHaveLength(4);
  [8, 10 / 3, 2, 10 / 3].forEach((value, index) => expect(carryDash![index]).toBeCloseTo(value, 10));
  for (const result of [evidence.pdfkitDirect, evidence.pdfkitSvg]) {
    expect(result.evidence).toBeNull();
    expect(result.error).toContain("global is not defined");
  }

  const repeated = await page.evaluate(async () => {
    const experiment = window.ctc014Experiment;
    const runs = [];
    for (let index = 0; index < 5; index += 1) {
      const pdf = experiment.renderJsPdfDirect();
      const evidence = await experiment.analyzePdf(pdf);
      runs.push({
        pages: evidence.pages,
        width: evidence.width,
        height: evidence.height,
        text: evidence.text,
        pathOperations: evidence.pathOperations,
        imageOperations: evidence.imageOperations,
        dashPatterns: evidence.dashPatterns,
      });
    }
    return runs;
  });
  expect(repeated).toEqual(Array.from({ length: 5 }, () => repeated[0]));
});
