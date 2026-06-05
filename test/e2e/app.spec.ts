import { expect, test } from "@playwright/test";

test("renders the scaffolded app shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Chart the Course" })).toBeVisible();
  await expect(page.getByText("Runtime LLM")).toBeVisible();
  await expect(page.getByText("None")).toBeVisible();
  await expect(page.getByText("Basemap tiles")).toBeVisible();
  await expect(page.getByText("Not loaded by default")).toBeVisible();
  await expect(page.getByText("3 placeholder holes / par 12")).toBeVisible();
});
