import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("renders the scaffolded app shell", async ({ page }) => {
  const externalRequests: string[] = [];

  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) {
      externalRequests.push(request.url());
    }
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Chart the Course" })).toBeVisible();
  await expect(page.getByText("Runtime LLM")).toBeVisible();
  await expect(page.getByText("None")).toBeVisible();
  await expect(page.getByText("Basemap tiles")).toBeVisible();
  await expect(page.getByText("Not loaded by default")).toBeVisible();
  await expect(page.getByText("3 placeholder holes / par 12")).toBeVisible();
  await expect(page.getByText("Generated non-geographic placeholder geometry")).toBeVisible();
  expect(externalRequests).toEqual([]);
});

test("has no detectable accessibility violations", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});

test("renders the scaffold at a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Chart the Course" })).toBeVisible();
  await expect(page.getByLabel("Scaffold status")).toBeVisible();
  await expect(page.getByLabel("Vector-only map placeholder")).toBeVisible();
});

test("accessibility scan detects a known injected violation", async ({ page }) => {
  await page.goto("/");
  await page.locator("main").evaluate((main) => {
    main.insertAdjacentHTML("beforeend", '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==">');
  });

  const results = await new AxeBuilder({ page }).include("main").analyze();

  expect(results.violations.map((violation) => violation.id)).toContain("image-alt");
});
