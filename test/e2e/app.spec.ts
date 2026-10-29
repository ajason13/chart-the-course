import { expect, test, type Page, type Route } from "@playwright/test";
import type { ProjectV2 } from "../../src/project";
import type { OverpassResponse } from "../../src/overpass";
import AxeBuilder from "@axe-core/playwright";
import ctc006Detail from "../../fixtures/overpass/synthetic-golf-course-ctc006.json" with { type: "json" };

const endpoint = "https://overpass-api.de/api/interpreter";
const discovery = {
  elements: [
    {
      type: "way",
      id: 9000060001,
      bounds: { minlat: 35, minlon: -80, maxlat: 35.01, maxlon: -79.99 },
      tags: { leisure: "golf_course", name: "Synthetic Municipal Course" },
    },
    {
      type: "node",
      id: 9000000002,
      tags: { leisure: "golf_course", name: "Bounds unavailable" },
    },
  ],
};
const syntheticDetail = {
  elements: [
    discovery.elements[0],
    { type: "way", id: 9000000101, tags: { golf: "hole", ref: "1" } },
    { type: "node", id: 9000000201, tags: { golf: "tee", ref: "1" } },
  ],
};

async function isolateNetwork(page: Page, overpassHandler?: (route: Route) => Promise<void> | void) {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (["127.0.0.1", "localhost"].includes(url.hostname)) {
      await route.continue();
    } else if (route.request().url() === endpoint && overpassHandler) {
      await overpassHandler(route);
    } else {
      await route.abort("blockedbyclient");
      throw new Error(`Unexpected external request: ${route.request().url()}`);
    }
  });
}

async function fillBounds(page: Page) {
  await page.getByLabel("South").fill("35");
  await page.getByLabel("West").fill("-80");
  await page.getByLabel("North").fill("35.01");
  await page.getByLabel("East").fill("-79.99");
}

async function assertAxe(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
}

test("discovers candidates, loads detail explicitly, caches it, and shows attribution", async ({ page }) => {
  let discoveryRequests = 0;
  let detailRequests = 0;
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    expect(route.request().method()).toBe("POST");
    if (query.includes("purpose:golf-course-detail")) {
      detailRequests += 1;
      await route.fulfill({ json: syntheticDetail });
    } else {
      discoveryRequests += 1;
      await route.fulfill({ json: discovery });
    }
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("Synthetic.*");
  await page.getByRole("button", { name: "Search courses" }).click();

  await expect(page.getByText("Synthetic Municipal Course")).toBeVisible();
  await expect(page.getByRole("button", { name: "Course data unavailable" })).toBeDisabled();
  await expect(page.getByText(/Data © OpenStreetMap contributors/)).toBeVisible();
  expect(discoveryRequests).toBe(1);
  expect(detailRequests).toBe(0);

  await page.getByRole("button", { name: "Open course" }).click();
  await expect(page.getByText(/^Course data loaded(?: from cache)?\.$/)).toBeVisible();
  await page.getByText("Source diagnostics", { exact: true }).click();
  await expect(page.locator(".raw-list code").getByText("way/9000060001", { exact: true })).toBeVisible();
  expect(detailRequests).toBe(1);

  await page.reload();
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("Synthetic.*");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/course candidates loaded from cache/)).toBeVisible();
  expect(discoveryRequests).toBe(1);
});

test("expired detail requires explicit consent or cancellation and exports exact stale evidence", async ({ page }) => {
  const completedAt = "2026-10-01T00:00:00.000Z";
  const ttl = 7 * 24 * 60 * 60 * 1000;
  let detailRequests = 0;
  await page.clock.setFixedTime(new Date(completedAt));
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    if (!query.includes("purpose:golf-course-detail")) return route.fulfill({ json: discovery });
    detailRequests += 1;
    await route.fulfill(detailRequests === 1 ? { json: ctc006Detail } : { status: 500 });
  });
  const search = async () => {
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses", exact: true }).click();
    await expect(page.getByRole("button", { name: "Open course", exact: true })).toBeEnabled();
  };
  const open = () => page.getByRole("button", { name: "Open course", exact: true }).click();
  await page.goto("/");
  await search();
  await open();
  await expect(page.getByRole("heading", { name: "Selected-hole map", exact: true })).toBeVisible();
  const original = await downloadedJson(page, "Download Raw GIS Source (ODbL)");
  expect(original.completedAt).toBe(completedAt);
  expect(original.consentState).toBe("fresh");

  // Just before expiry, a new document must reuse durable detail without a request.
  await page.clock.setFixedTime(new Date(Date.parse(completedAt) + ttl - 1));
  await page.reload();
  await search();
  await open();
  await expect(page.getByText("Course data loaded from cache.", { exact: true }).first()).toBeVisible();
  expect(detailRequests).toBe(1);

  // Exact expiry forces retrieval; failure must not silently render stored detail.
  await page.clock.setFixedTime(new Date(Date.parse(completedAt) + ttl));
  await page.reload();
  await search();
  await open();
  const consent = page.getByRole("region", { name: "Stored course data available" });
  const map = page.getByRole("heading", { name: "Selected-hole map", exact: true });
  await expect(consent).toBeVisible();
  await expect(consent).toContainText(completedAt);
  await expect(map).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Download Raw GIS Source (ODbL)" })).toHaveCount(0);
  await consent.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(consent).toHaveCount(0);
  await expect(map).toHaveCount(0);
  expect(detailRequests).toBe(2);

  await open();
  await expect(consent).toBeVisible();
  await consent.getByRole("button", { name: "Render stored course data" }).click();
  await expect(map).toBeVisible();
  await expect(consent).toHaveCount(0);
  await expect(page.locator(".status .warning")).toContainText(`Showing stale OpenStreetMap data from ${completedAt}`);
  const exported = await downloadedJson(page, "Download Raw GIS Source (ODbL)");
  expect(exported).toEqual({
    ...original,
    exportedAt: exported.exportedAt,
    consentState: "stale-consented",
    isStaleSource: true,
    sourceAgeDays: 7,
  });
  expect(detailRequests).toBe(3);
});

for (const failure of ["missing", "blocked", "write failure"] as const) {
  test(`keeps planning usable with accurate non-durable fallback after IndexedDB ${failure}`, async ({ page }) => {
    await page.addInitScript((failure) => {
      if (failure === "missing") {
        Object.defineProperty(window, "indexedDB", { value: undefined });
      } else if (failure === "blocked") {
        // Deliver the open request's blocked event without relying on another tab.
        IDBFactory.prototype.open = function () {
          const request = {} as IDBOpenDBRequest;
          queueMicrotask(() => request.onblocked?.call(request, new Event("blocked") as IDBVersionChangeEvent));
          return request;
        };
      } else {
        IDBObjectStore.prototype.put = function () {
          throw new DOMException("Synthetic quota failure", "QuotaExceededError");
        };
      }
    }, failure);
    let requests = 0;
    await isolateNetwork(page, async (route) => {
      requests += 1;
      const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
      await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
    });
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses", exact: true }).click();
    const warning = page.locator(".status .warning");
    await expect(warning).toContainText("non-durable memory cache for this session");
    await page.getByRole("button", { name: "Open course", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Selected-hole map", exact: true })).toBeVisible();
    await expect(warning).toContainText("non-durable memory cache for this session");
    await page.getByRole("button", { name: "Add club", exact: true }).click();
    const project = await downloadedJson(page, "Export project");
    expect(project.clubProfile.clubs).toHaveLength(1);

    // Reuse the session cache with its warning, without claiming durability.
    await page.getByRole("button", { name: "Search courses", exact: true }).click();
    await expect(page.getByText(/course candidates loaded from cache/)).toBeVisible();
    await expect(warning).toContainText("non-durable memory cache for this session");
    await page.getByRole("button", { name: "Open course", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Selected-hole map", exact: true })).toBeVisible();
    await expect(warning).toContainText("non-durable memory cache for this session");
    expect(requests).toBe(2);
    await expect(page.locator(".status")).not.toContainText("from durable cache");

    // Memory fallback cannot survive a document reload.
    await page.reload();
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses", exact: true }).click();
    await expect(page.getByText(/course candidates loaded/)).toBeVisible();
    await expect(warning).toContainText("non-durable memory cache for this session");
    expect(requests).toBe(3);
  });
}

for (const width of [1280, 390]) {
  test(`course planning leads expandable source evidence at ${width}px`, async ({ page }, testInfo) => {
    let detailQuery = "";
    let requests = 0;
    await isolateNetwork(page, async (route) => {
      requests += 1;
      const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
      if (query.includes("purpose:golf-course-detail")) {
        detailQuery = query;
        await route.fulfill({ json: ctc006Detail });
      } else await route.fulfill({ json: discovery });
    });
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses", exact: true }).click();
    await page.getByRole("button", { name: "Open course", exact: true }).click();
    const heading = page.getByRole("heading", { name: "Selected-hole map", exact: true });
    await expect(heading).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("combobox", { name: "Hole", exact: true })).toBeFocused();
    const workspace = page.getByRole("region", { name: "Selected-hole map", exact: true });
    const diagnostics = page.getByText("Source diagnostics", { exact: true });
    const raw = page.getByRole("list", { name: "Raw OSM entities", includeHidden: true });
    await expect(page.getByTestId("hole-vector-map")).toBeVisible();
    await expect(raw).toBeHidden();
    await expect(page.getByText(/Selected course: Synthetic CTC-006 Course/)).toBeVisible();
    await expect(page.getByText(/Data © OpenStreetMap contributors/)).toBeVisible();
    await expect(page.getByText("All normalization warnings (0)", { exact: true })).toBeVisible();
    expect(await workspace.evaluate((element) => {
      const summary = [...document.querySelectorAll("summary")].find((node) => node.textContent === "Source diagnostics")!;
      return Boolean(element.compareDocumentPosition(summary) & Node.DOCUMENT_POSITION_FOLLOWING);
    })).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await heading.evaluate((element) => element.scrollIntoView({ block: "start" }));
    await page.screenshot({ path: testInfo.outputPath(`planning-${width}.png`) });
    await assertAxe(page);
    await diagnostics.focus();
    await page.keyboard.press("Enter");
    await expect(raw).toBeVisible();
    await expect(raw.getByRole("listitem")).toHaveCount(ctc006Detail.elements.length);
    await expect(raw.locator("code").first()).toHaveText("way/9000060001");
    const metadata = diagnostics.locator("..").locator(".diagnostics");
    await expect(metadata.locator("pre")).toHaveText(detailQuery);
    await expect(metadata).toContainText(endpoint);
    await expect(metadata).toContainText("35,-80,35.01,-79.99");
    await expect(metadata).toContainText("Completed");
    await diagnostics.scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`diagnostics-${width}.png`) });
    await assertAxe(page);
    await page.keyboard.press("Space");
    await expect(raw).toBeHidden();
    await expect(diagnostics).toBeFocused();
    expect(requests).toBe(2);
  });
}

test("makes no requests on keystrokes, blocks duplicate submit, and cancels explicitly", async ({ page }) => {
  let requests = 0;
  let releaseRequest!: () => void;
  const pendingRequest = new Promise<void>((resolve) => { releaseRequest = resolve; });
  await isolateNetwork(page, async (route) => {
    requests += 1;
    await pendingRequest;
    await route.fulfill({ json: discovery });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("No automatic query");
  expect(requests).toBe(0);

  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByRole("button", { name: "Search courses" })).toBeDisabled();
  await expect.poll(() => requests).toBe(1);
  await page.getByRole("button", { name: "Cancel request" }).click();
  await expect(page.getByText("Request cancelled.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Search courses" })).toBeFocused();
  releaseRequest();
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(page.getByText("Request cancelled.")).toBeVisible();
  expect(requests).toBe(1);
});

// Delay delivery to the cache promise after IndexedDB has completed. The app
// must still reject obsolete work even when the underlying operation finishes.
async function installCacheGate(page: Page) {
  await page.addInitScript(() => {
    type Gate = {
      phase: "read" | "write" | null;
      fail: boolean;
      pending: boolean;
      release: () => void;
    };
    const gate: Gate = { phase: null, fail: false, pending: false, release: () => {} };
    Object.assign(window, { cacheGate: gate });
    const get = IDBObjectStore.prototype.get;
    IDBObjectStore.prototype.get = function (...args) {
      const request = get.apply(this, args);
      if (gate.phase !== "read") return request;
      gate.phase = null;
      Object.defineProperty(request, "onsuccess", {
        set(callback: (event: Event) => void) {
          request.addEventListener("success", (event) => {
            gate.pending = true;
            gate.release = () => {
              if (gate.fail) request.onerror?.call(request, event);
              else callback.call(request, event);
            };
          });
        },
      });
      return request;
    };
    const transaction = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (...args) {
      const result = transaction.apply(this, args);
      if (gate.phase !== "write" || result.mode !== "readwrite") return result;
      gate.phase = null;
      Object.defineProperty(result, "oncomplete", {
        set(callback: (event: Event) => void) {
          result.addEventListener("complete", (event) => {
            gate.pending = true;
            gate.release = () => {
              if (gate.fail) result.onerror?.call(result, event);
              else callback.call(result, event);
            };
          });
        },
      });
      return result;
    };
  });
}

async function armCacheGate(page: Page, phase: "read" | "write", fail = false) {
  await page.evaluate(({ phase, fail }) => {
    Object.assign((window as unknown as { cacheGate: object }).cacheGate, { phase, fail, pending: false });
  }, { phase, fail });
}

async function releaseCacheGate(page: Page) {
  await page.evaluate(() => (window as unknown as { cacheGate: { release: () => void } }).cacheGate.release());
  // Drain promise continuations and React rendering before negative assertions.
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

for (const outcome of ["hit", "miss", "warning"]) {
  test(`cancels delayed cache ${outcome} before a newer detail selection`, async ({ page }) => {
    let requests = 0;
    await installCacheGate(page);
    await isolateNetwork(page, async (route) => {
      requests += 1;
      const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
      await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? syntheticDetail : discovery });
    });
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect(page.getByText("Synthetic Municipal Course", { exact: true })).toBeVisible();
    if (outcome === "miss") await page.getByLabel(/Course name/).fill("Uncached search");
    await armCacheGate(page, "read", outcome === "warning");
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { cacheGate: { pending: boolean } }).cacheGate.pending)).toBe(true);
    await expect(page.getByRole("button", { name: "Search courses" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Open course" })).toBeDisabled();
    await page.getByRole("button", { name: "Cancel request" }).click();
    await expect(page.getByText("Request cancelled.", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Open course" }).click();
    await expect(page.getByText(/^Course data loaded(?: from cache)?\.$/)).toBeVisible();
    await releaseCacheGate(page);
    await expect(page.getByText(/^Course data loaded(?: from cache)?\.$/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Stored course data available" })).toHaveCount(0);
    await expect(page.locator(".status .warning")).toHaveCount(0);
    expect(requests).toBe(2);
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download Raw GIS Source (ODbL)" }).click();
    const download = await downloadPromise;
    const stream = await download.createReadStream();
    let text = "";
    for await (const chunk of stream!) text += chunk.toString();
    expect(JSON.parse(text).rawResponse).toBe(JSON.stringify(syntheticDetail));
  });
}

for (const fail of [false, true]) {
  test(`cancelled cache write ${fail ? "failure" : "success"} cannot update newer results or warnings`, async ({ page }) => {
    await installCacheGate(page);
    await isolateNetwork(page, async (route) => route.fulfill({ json: discovery }));
    await page.goto("/");
    await fillBounds(page);
    await armCacheGate(page, "write", fail);
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { cacheGate: { pending: boolean } }).cacheGate.pending)).toBe(true);
    await page.getByRole("button", { name: "Cancel request" }).click();
    await expect(page.getByText("Request cancelled.", { exact: true })).toBeVisible();
    if (fail) {
      await page.getByLabel(/Course name/).fill("Newer search");
      await page.getByRole("button", { name: "Search courses" }).click();
      await expect(page.getByText(/course candidates loaded/)).toBeVisible();
    }
    await releaseCacheGate(page);
    if (fail) {
      await expect(page.getByText(/course candidates loaded/)).toBeVisible();
      await expect(page.locator(".status .warning")).toHaveCount(0);
      return;
    }
    await expect(page.getByText("Request cancelled.", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Courses found" })).toHaveCount(0);
    await expect(page.locator(".status .warning")).toHaveCount(0);
    await page.getByLabel(/Course name/).fill("Newer search");
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect(page.getByText(/course candidates loaded/)).toBeVisible();
  });
}

test("cancelled stale fallback cannot restore its consent prompt after a newer selection", async ({ page }) => {
  let searches = 0;
  let releaseFailure!: () => void;
  const pendingFailure = new Promise<void>((resolve) => { releaseFailure = resolve; });
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    if (query.includes("purpose:golf-course-detail")) return route.fulfill({ json: syntheticDetail });
    searches += 1;
    if (searches === 1) return route.fulfill({ json: discovery });
    if (searches === 3) await pendingFailure;
    await route.fulfill({ status: 500, body: "error" });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/course candidates loaded/)).toBeVisible();
  await page.clock.setFixedTime(Date.now() + 8 * 24 * 60 * 60 * 1000);
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByRole("heading", { name: "Stored course data available" })).toBeVisible();
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect.poll(() => searches).toBe(3);
  await expect(page.getByRole("heading", { name: "Stored course data available" })).toHaveCount(0);
  await page.getByRole("button", { name: "Cancel request" }).click();
  await page.getByRole("button", { name: "Open course" }).click();
  await expect(page.getByText(/^Course data loaded(?: from cache)?\.$/)).toBeVisible();
  releaseFailure();
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(page.getByRole("heading", { name: "Stored course data available" })).toHaveCount(0);
  await expect(page.getByText(/^Course data loaded(?: from cache)?\.$/)).toBeVisible();
});

test("obsolete refresh cooldown expires without replacing the current cache status", async ({ page }) => {
  await page.clock.install();
  await installCacheGate(page);
  await isolateNetwork(page, async (route) => route.fulfill({ json: discovery }));
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/course candidates loaded/)).toBeVisible();
  await armCacheGate(page, "write");
  await page.getByRole("button", { name: "Refresh course data" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { cacheGate: { pending: boolean } }).cacheGate.pending)).toBe(true);
  await page.getByRole("button", { name: "Cancel request" }).click();
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText("Course data loaded from cache.")).toBeVisible();
  await releaseCacheGate(page);
  await page.clock.fastForward(5_000);
  await expect(page.getByText("Course data loaded from cache.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Refresh course data" })).toBeEnabled();
});

test("validates input before requests and focuses the first invalid field", async ({ page }) => {
  let requests = 0;
  await isolateNetwork(page, () => { requests += 1; });
  await page.goto("/");
  await page.getByLabel("South").fill("1e2");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/Use decimal degrees/)).toBeVisible();
  await expect(page.getByLabel("South")).toBeFocused();
  expect(requests).toBe(0);
});

for (const scenario of [
  { name: "rate limit", status: 429, expected: /longer rate-limit wait/ },
  { name: "gateway timeout", status: 504, expected: /timed out/ },
  { name: "generic HTTP", status: 500, expected: /HTTP 500/ },
]) {
  test(`shows ${scenario.name} state without retry or failover`, async ({ page }) => {
    let requests = 0;
    await isolateNetwork(page, async (route) => {
      requests += 1;
      await route.fulfill({
        status: scenario.status,
        headers: scenario.status === 429 ? {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Expose-Headers": "Retry-After",
          "Retry-After": "120",
        } : {},
        body: "error",
      });
    });
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect(page.getByText(scenario.expected)).toBeVisible();
    if (scenario.status === 429) {
      await expect(page.locator(".status")).toHaveAttribute("aria-live", "assertive");
    }
    expect(requests).toBe(1);
  });
}

for (const scenario of [
  { name: "malformed JSON", body: "{", expected: /malformed JSON/ },
  { name: "invalid shape", body: '{"elements":[{"type":"area","id":1}]}', expected: /invalid entity shape/ },
  { name: "empty response", body: '{"elements":[]}', expected: /No courses/ },
]) {
  test(`shows ${scenario.name} state`, async ({ page }) => {
    await isolateNetwork(page, async (route) => route.fulfill({ body: scenario.body, contentType: "application/json" }));
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect(page.getByText(scenario.expected)).toBeVisible();
  });
}

test("retries one transient network failure without endpoint failover", async ({ page }) => {
  let requests = 0;
  await isolateNetwork(page, async (route) => {
    requests += 1;
    if (requests === 1) await route.abort("internetdisconnected");
    else await route.fulfill({ json: discovery });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/course candidates loaded/)).toBeVisible({ timeout: 5000 });
  expect(requests).toBe(2);
});

test("refreshes loaded course data with cooldown and durable cache replacement", async ({ page }) => {
  let detailRequests = 0;
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    if (query.includes("purpose:golf-course-detail")) {
      detailRequests += 1;
      await route.fulfill({ json: { elements: [discovery.elements[0], { type: "way", id: 9000000100 + detailRequests, tags: {} }] } });
    } else {
      await route.fulfill({ json: discovery });
    }
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Open course" }).click();
  await page.getByText("Source diagnostics", { exact: true }).click();
  await expect(page.getByText("way/9000000101")).toBeVisible();

  const refresh = page.getByRole("button", { name: "Refresh course data" });
  await refresh.click();
  await expect(refresh).toBeDisabled();
  await expect(page.getByText("way/9000000102")).toBeVisible();
  await expect(page.getByText(/Refresh complete/)).toBeVisible();
  expect(detailRequests).toBe(2);

  await page.reload();
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Open course" }).click();
  await page.getByText("Source diagnostics", { exact: true }).click();
  await expect(page.getByText("way/9000000102")).toBeVisible();
  expect(detailRequests).toBe(2);
});

// Two holes make a reset to the first hole observable during refresh.
const refreshDetail = {
  elements: [
    ...ctc006Detail.elements,
    { ...ctc006Detail.elements[1], id: 9000060102, tags: { golf: "hole", ref: "2", par: "4" } },
    ...ctc006Detail.elements.filter((element) => element.tags.golf === "tee").map((element) => ({
      ...element, id: 9000060202, tags: { golf: "tee", ref: "2" },
    })),
  ],
} as OverpassResponse;

async function prepareGuardWorkspace(page: Page, discoveryResponse?: (route: Route) => Promise<void>) {
  await page.addInitScript(() => {
    const original = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (blob) => {
      if (blob instanceof Blob) (window as typeof window & { __ctcLastBlob: Promise<string> }).__ctcLastBlob = blob.text();
      return original(blob);
    };
  });
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    if (query.includes("purpose:golf-course-detail")) return route.fulfill({ json: refreshDetail });
    if (discoveryResponse) return discoveryResponse(route);
    return route.fulfill({ json: discovery });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Open course" }).click();
  await expect(page.getByTestId("hole-vector-map")).toBeVisible();
}

async function expectProjectDirty(page: Page, dirty: boolean) {
  await expect(page.getByText(dirty ? "Unsaved project changes." : "No unsaved project changes.", { exact: true })).toBeVisible();
  // A cancelable event also verifies that the listener is removed when clean,
  // without relying on the browser's discretionary native-dialog policy.
  await expect.poll(() => page.evaluate(() => {
    const event = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(event);
    return event.defaultPrevented;
  })).toBe(dirty);
}

for (const kind of ["target", "carry", "club"] as const) {
  test(`tracks unsaved ${kind} creation, edits, deletion and export baselines`, async ({ page }) => {
    await prepareGuardWorkspace(page);
    await expectProjectDirty(page, false);
    const map = page.getByTestId("hole-vector-map");
    await map.click({ position: { x: 180, y: 180 } });
    await map.click({ position: { x: 240, y: 240 } });
    await expectProjectDirty(page, false); // Measurement is not authored state.
    await page.getByRole("button", { name: `Add ${kind}`, exact: true }).click();
    if (kind === "target") await map.click({ position: { x: 180, y: 180 } });
    await expectProjectDirty(page, true);
    await downloadedJson(page, "Download Raw GIS Source (ODbL)");
    await expectProjectDirty(page, true);
    await downloadedJson(page, "Export project");
    await expectProjectDirty(page, false);
    const editor = page.getByLabel(kind === "target" ? "Target label" : kind === "carry" ? "Distances in yards" : "Club name", { exact: true });
    const original = await editor.inputValue();
    await editor.fill(kind === "carry" ? "175" : "Edited name");
    await editor.blur();
    await expectProjectDirty(page, true);
    await editor.fill(original);
    await editor.blur();
    await expectProjectDirty(page, false); // Exact content reversion restores baseline.
    await page.getByRole("button", { name: kind === "target" ? "Delete" : `Delete ${kind}`, exact: true }).click();
    await expectProjectDirty(page, true); // Deletion of exported content is an edit.
    if (kind === "target") {
      await page.getByRole("button", { name: "Undo delete", exact: true }).click();
      await expectProjectDirty(page, false);
    } else {
      await downloadedJson(page, "Export project");
      await expectProjectDirty(page, false);
    }
  });
}

for (const cached of [true, false]) {
  test(`retains exact dirty project and selection when cancelling ${cached ? "cached" : "pending network"} replacement`, async ({ page }) => {
    let discoveries = 0;
    let release!: () => void;
    const pending = new Promise<void>((resolve) => { release = resolve; });
    await prepareGuardWorkspace(page, async (route) => {
      discoveries += 1;
      if (discoveries > 1) await pending;
      await route.fulfill({ json: discovery });
    });
    const hole = page.getByRole("combobox", { name: /^Hole/ });
    await hole.selectOption("way/9000060102");
    await page.getByRole("button", { name: "Add club", exact: true }).click();
    const before = await downloadedJson(page, "Export project");
    if (!cached) await page.getByLabel(/Course name/).fill("Uncached search");
    if (cached) {
      await page.getByLabel("Club name", { exact: true }).fill("Retain this club");
      await page.getByLabel("Club name", { exact: true }).blur();
    }
    const dialog = page.waitForEvent("dialog");
    const submitting = page.getByRole("button", { name: "Search courses", exact: true }).click();
    if (!cached) {
      await submitting;
      await expect(page.getByText("Searching courses.", { exact: true })).toBeVisible();
      // Edits made after request start must still be protected at commit time.
      await page.getByLabel("Club name", { exact: true }).fill("Retain this club");
      await page.getByLabel("Club name", { exact: true }).blur();
      release();
    }
    const confirmation = await dialog;
    expect(confirmation.type()).toBe("confirm");
    expect(confirmation.message()).toContain("Discard unsaved project changes");
    await confirmation.dismiss();
    await submitting;
    await expect(page.getByText("Replacement cancelled. Existing course, project and selection were retained.", { exact: true })).toBeVisible();
    await expect(hole).toHaveValue("way/9000060102");
    await expectProjectDirty(page, true);
    const retained = await downloadedJson(page, "Export project");
    expect(retained).toEqual({ ...before, exportedAt: retained.exportedAt, clubProfile: {
      clubs: [{ ...before.clubProfile.clubs[0], label: "Retain this club" }],
    } });
    await expectProjectDirty(page, false);
    await page.getByRole("button", { name: "Add carry", exact: true }).click();
    page.once("dialog", (confirmation) => confirmation.accept());
    await page.getByRole("button", { name: "Search courses", exact: true }).click();
    await expect(page.getByRole("button", { name: "Open course", exact: true })).toBeVisible();
    await expect(page.getByTestId("hole-vector-map")).toHaveCount(0);
    await page.getByRole("button", { name: "Open course", exact: true }).click();
    await expectProjectDirty(page, false);
    await expect(page.getByText("No clubs added.", { exact: true })).toBeVisible();
    await expect(hole).toHaveValue("way/9000060101");
    expect(discoveries).toBe(cached ? 1 : 2);
    await assertAxe(page);
  });
}

test("import establishes a baseline only after validation and replacement consent", async ({ page }) => {
  await prepareGuardWorkspace(page);
  await page.getByRole("button", { name: "Add club", exact: true }).click();
  const saved = await downloadedJson(page, "Export project");
  const input = page.getByLabel("Import project file (.json)");
  const importSaved = () => input.evaluate((element: HTMLInputElement, text) => {
    const files = new DataTransfer();
    files.items.add(new File([text], "saved.json", { type: "application/json" }));
    element.files = files.files;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }, JSON.stringify(saved));
  await page.getByLabel("Club name", { exact: true }).fill("Unsaved club");
  await page.getByLabel("Club name", { exact: true }).blur();
  await input.setInputFiles("fixtures/projects/synthetic-project-wrong-course.json");
  await expect(page.getByRole("alert")).toContainText("COURSE_MISMATCH");
  await expectProjectDirty(page, true);
  page.once("dialog", (dialog) => dialog.dismiss());
  await importSaved();
  await expect(page.getByLabel("Club name", { exact: true })).toHaveValue("Unsaved club");
  await expectProjectDirty(page, true);
  page.once("dialog", (dialog) => dialog.accept());
  await importSaved();
  await expect(page.getByText("Project imported successfully.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Club name", { exact: true })).toHaveValue("Club 1");
  await expectProjectDirty(page, false);
  await page.getByRole("button", { name: "Delete club", exact: true }).click();
  await expectProjectDirty(page, true);
  page.once("dialog", (dialog) => dialog.dismiss());
  await importSaved();
  await expect(page.getByText("No clubs added.", { exact: true })).toBeVisible();
  await expectProjectDirty(page, true); // Unsaved deletion is protected even when empty.
  const dialog = page.waitForEvent("dialog");
  const reload = page.reload();
  const warning = await dialog;
  expect(warning.type()).toBe("beforeunload");
  await warning.accept();
  await reload;
  await expect(page.getByRole("heading", { name: "Course discovery", exact: true })).toBeVisible();
});

async function downloadedJson(page: Page, button: string) {
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: button, exact: true }).click();
  const download = await downloading;
  expect(await download.failure()).toBeNull();
  const stream = await download.createReadStream();
  let text = "";
  for await (const chunk of stream!) text += chunk.toString();
  return JSON.parse(text);
}

for (const width of [1280, 390]) {
  test(`synthetic demo supports offline planning and project round trips at ${width}px`, async ({ page }) => {
    await isolateNetwork(page); // Any external request fails this test, including Overpass.
    await page.addInitScript(() => {
      const original = URL.createObjectURL.bind(URL);
      URL.createObjectURL = (blob) => {
        if (blob instanceof Blob) (window as typeof window & { __ctcLastBlob: Promise<string> }).__ctcLastBlob = blob.text();
        return original(blob);
      };
    });
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const demo = page.getByRole("button", { name: "Open synthetic demo", exact: true });
    await expect(demo).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(demo).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Selected-hole map", exact: true })).toBeFocused();
    const map = page.getByTestId("hole-vector-map");
    await expect(map).toBeVisible();
    await expect(page.getByText("Synthetic demo geometry from Chart the Course fixtures. Not a real golf course.")).toBeVisible();
    await expect(map.locator("desc")).toContainText("synthetic demo");
    await expect(page.getByText(/Data © OpenStreetMap contributors/)).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Download Raw GIS Source (ODbL)", exact: true })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Refresh course data", exact: true })).toBeDisabled();
    expect(await map.evaluate((element) => element.getBoundingClientRect().right <= window.innerWidth)).toBe(true);
    await map.focus();
    await map.press("Enter");
    await map.press("Shift+ArrowDown");
    await map.press("Enter");
    await expect(page.getByText(/^Distance: \d+ yd \/ \d+ m$/)).toBeVisible();
    await page.getByRole("button", { name: "Add target", exact: true }).click();
    await map.focus();
    await map.press("Enter");
    await page.getByLabel("Target label", { exact: true }).fill("Demo landing");
    await page.getByLabel("Target label", { exact: true }).blur();
    await page.getByRole("button", { name: "Add carry", exact: true }).click();
    await page.getByLabel("Distances in yards", { exact: true }).fill("175, 200");
    await page.getByLabel("Distances in yards", { exact: true }).blur();
    await page.getByRole("button", { name: "Add club", exact: true }).click();
    await page.getByLabel("Club name", { exact: true }).fill("Demo iron");
    await page.getByLabel("Club name", { exact: true }).blur();
    await expect(map.locator('[data-layer="dispersion"] .dispersion-ellipse')).toHaveCount(1);
    await expectProjectDirty(page, true);
    await demo.click(); // Reopening the same demo retains authored work.
    await expect(page.getByLabel("Target label", { exact: true })).toHaveValue("Demo landing");
    const saved = await downloadedJson(page, "Export project");
    expect(saved.courseSourceKey).toBe("way/9000060001");
    expect(saved.holes["way/9000060101"].targets[0].label).toBe("Demo landing");
    expect(saved.holes["way/9000060101"].carries[0].distances).toEqual([175, 200]);
    expect(saved.clubProfile.clubs[0].label).toBe("Demo iron");
    await expectProjectDirty(page, false);
    await assertAxe(page);
    expect(await page.evaluate(() => indexedDB.databases())).toEqual([]);
    await page.reload();
    await demo.click();
    await expect(page.getByText("No clubs added.", { exact: true })).toBeVisible();
    await page.getByLabel("Import project file (.json)").evaluate((element: HTMLInputElement, text) => {
      const files = new DataTransfer();
      files.items.add(new File([text], "demo-project.json", { type: "application/json" }));
      element.files = files.files;
      element.dispatchEvent(new Event("change", { bubbles: true }));
    }, JSON.stringify(saved));
    await expect(page.getByText("Project imported successfully.", { exact: true })).toBeVisible();
    const restored = await downloadedJson(page, "Export project");
    expect(restored).toEqual({ ...saved, exportedAt: restored.exportedAt });
    await expect(map.locator('[data-layer="targets"] [data-target-id]')).toHaveCount(1);
    await expect(map.locator('[data-layer="carry-arcs"] text')).toHaveText(["175 yd", "200 yd"]);
    await assertAxe(page);
  });
}

test("switching live course to synthetic demo protects unsaved work and clears source evidence", async ({ page }) => {
  await prepareGuardWorkspace(page);
  await page.getByRole("button", { name: "Add club", exact: true }).click();
  await page.getByRole("combobox", { name: /^Hole/ }).selectOption("way/9000060102");
  const demo = page.getByRole("button", { name: "Open synthetic demo", exact: true });
  page.once("dialog", (dialog) => dialog.dismiss());
  await demo.click();
  await expect(page.getByRole("combobox", { name: /^Hole/ })).toHaveValue("way/9000060102");
  await expect(page.getByLabel("Club name", { exact: true })).toHaveValue("Club 1");
  await expect(page.getByRole("button", { name: "Download Raw GIS Source (ODbL)", exact: true })).toBeEnabled();
  page.once("dialog", (dialog) => dialog.accept());
  await demo.click();
  await expect(page.getByText(/^Synthetic demo geometry, not a real course or live OpenStreetMap evidence/)).toBeVisible();
  await expect(page.getByRole("combobox", { name: /^Hole/ })).toHaveValue("way/9000060101");
  await expect(page.getByText("No clubs added.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download Raw GIS Source (ODbL)", exact: true })).toBeDisabled();
  await expectProjectDirty(page, false);
  await page.getByRole("button", { name: "Add club", exact: true }).click();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Search courses", exact: true }).click();
  await expect(page.getByText("Replacement cancelled. Existing course, project and selection were retained.", { exact: true })).toBeVisible();
  await expect(page.getByText(/^Synthetic demo geometry, not a real course or live OpenStreetMap evidence/)).toBeVisible();
  await expect(page.getByLabel("Club name", { exact: true })).toHaveValue("Club 1");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Search courses", exact: true }).click();
  await page.getByRole("button", { name: "Open course", exact: true }).click();
  await expect(page.getByRole("button", { name: "Download Raw GIS Source (ODbL)", exact: true })).toBeEnabled();
  await expect(page.getByText("Course data © OpenStreetMap contributors.")).toBeVisible();
});

test("synthetic demo supersedes a pending course-data request", async ({ page }) => {
  let release!: () => void;
  let started!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  const requested = new Promise<void>((resolve) => { started = resolve; });
  await isolateNetwork(page, async (route) => {
    started();
    await pending;
    await route.fulfill({ json: discovery }).catch(() => {}); // Request may already be aborted.
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses", exact: true }).click();
  await requested;
  await page.getByRole("button", { name: "Open synthetic demo", exact: true }).click();
  release();
  await expect(page.getByText(/^Synthetic demo geometry, not a real course or live OpenStreetMap evidence/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Open course", exact: true })).toHaveCount(0);
  await expect(page.getByTestId("hole-vector-map")).toBeVisible();
});

for (const scenario of ["success", "HTTP failure", "network failure", "malformed JSON", "invalid shape", "cancellation", "missing hole", "changed hole", "changed course", "empty detail"]) {
  test(`preserves populated planning state during same-course refresh: ${scenario}`, async ({ page }) => {
    await page.addInitScript(() => {
      const original = URL.createObjectURL.bind(URL);
      URL.createObjectURL = (blob) => {
        if (blob instanceof Blob) (window as typeof window & { __ctcLastBlob: Promise<string> }).__ctcLastBlob = blob.text();
        return original(blob);
      };
    });
    let detailRequests = 0;
    let releaseRefresh: () => void = () => {};
    const refreshPending = new Promise<void>((resolve) => { releaseRefresh = resolve; });
    const updated = structuredClone(refreshDetail);
    // The raw evidence changes while the project identities remain stable.
    updated.elements[0].tags = { ...updated.elements[0].tags, name: "Refreshed synthetic course" };
    if (scenario === "missing hole") updated.elements = updated.elements.filter((element) => element.id !== 9000060102);
    if (scenario === "changed hole") updated.elements.find((element) => element.id === 9000060102)!.id = 9000060199;
    if (scenario === "changed course") updated.elements[0].id = 9000060099;
    if (scenario === "empty detail") updated.elements = [];
    await isolateNetwork(page, async (route) => {
      const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
      if (!query.includes("purpose:golf-course-detail")) {
        await route.fulfill({ json: discovery });
        return;
      }
      detailRequests += 1;
      if (detailRequests === 1) {
        await route.fulfill({ json: refreshDetail });
        return;
      }
      await refreshPending;
      if (scenario === "HTTP failure") await route.fulfill({ status: 500, body: "error" });
      else if (scenario === "network failure") await route.abort("internetdisconnected");
      else if (scenario === "malformed JSON") await route.fulfill({ body: "{" });
      else if (scenario === "invalid shape") await route.fulfill({ json: { elements: [{ type: "area", id: 1 }] } });
      else await route.fulfill({ json: updated });
    });
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses" }).click();
    await page.getByRole("button", { name: "Open course" }).click();
    const hole = page.getByRole("combobox", { name: /^Hole/ });
    await hole.selectOption("way/9000060102");
    const map = page.getByTestId("hole-vector-map");
    await page.getByRole("button", { name: "Add target" }).click();
    await map.click({ position: { x: 180, y: 180 } });
    await page.getByRole("button", { name: "Add carry" }).click();
    await page.getByRole("button", { name: "Add club" }).click();
    const before = await downloadedJson(page, "Export project");
    expect(Object.values(before.holes)).toEqual([expect.objectContaining({
      targets: [expect.anything()], carries: [expect.anything()],
    })]);
    expect(before.clubProfile.clubs).toHaveLength(1);
    await page.getByLabel("Club name", { exact: true }).fill("Unsaved profile");
    await page.getByLabel("Club name", { exact: true }).blur();
    before.clubProfile.clubs[0].label = "Unsaved profile";
    await expectProjectDirty(page, true);
    const oldSource = await downloadedJson(page, "Download Raw GIS Source (ODbL)");

    await page.getByRole("button", { name: "Refresh course data", exact: true }).click();
    await expect(page.getByText("Loading course data.")).toBeVisible();
    await expect(hole).toHaveValue("way/9000060102");
    await expect(page.getByLabel("Club name")).toHaveValue("Unsaved profile");
    if (scenario === "cancellation") {
      await page.getByRole("button", { name: "Cancel request" }).click();
      await expect(page.getByText("Request cancelled.", { exact: true })).toBeVisible();
    }
    releaseRefresh();
    if (scenario === "success") await expect(page.getByText("Refresh complete.", { exact: true })).toBeVisible();
    else if (["missing hole", "changed hole", "changed course", "empty detail"].includes(scenario)) {
      await expect(page.getByText(/Course or hole identities changed/)).toBeVisible();
    } else if (scenario !== "cancellation") {
      await expect(page.getByText("Refresh failed. Existing course view was left unchanged.", { exact: true })).toBeVisible({ timeout: 15_000 });
    }
    await expect(hole).toHaveValue("way/9000060102");
    await expectProjectDirty(page, true);
    const after = await downloadedJson(page, "Export project");
    expect(after).toEqual({ ...before, exportedAt: after.exportedAt });
    const source = await downloadedJson(page, "Download Raw GIS Source (ODbL)");
    if (scenario === "success") {
      expect(JSON.parse(source.rawResponse)).toEqual(updated);
      expect(source.rawResponse).not.toBe(oldSource.rawResponse);
    } else {
      expect(source).toEqual({ ...oldSource, exportedAt: source.exportedAt });
    }
    expect(detailRequests).toBe(scenario === "network failure" ? 5 : 2);
  });
}

test("exports raw GIS source only for loaded detail data", async ({ page }) => {
  const rawDetailText = JSON.stringify(ctc006Detail);
  await page.addInitScript(() => {
    const original = URL.createObjectURL.bind(URL);
    (window as typeof window & { __ctcBlobTexts?: string[]; __ctcBlobTypes?: string[] }).__ctcBlobTexts = [];
    (window as typeof window & { __ctcBlobTexts?: string[]; __ctcBlobTypes?: string[] }).__ctcBlobTypes = [];
    URL.createObjectURL = (blob) => {
      if (blob instanceof Blob) {
        (window as typeof window & { __ctcBlobTexts: string[]; __ctcBlobTypes: string[] }).__ctcBlobTypes.push(blob.type);
        void blob.text().then((text) => {
          (window as typeof window & { __ctcBlobTexts: string[]; __ctcBlobTypes: string[] }).__ctcBlobTexts.push(text);
        });
      }
      return original(blob);
    };
  });
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    if (query.includes("purpose:golf-course-detail")) {
      await route.fulfill({ body: rawDetailText, contentType: "application/json" });
    } else {
      await route.fulfill({ json: discovery });
    }
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByRole("button", { name: "Download Raw GIS Source (ODbL)" })).toHaveCount(0);

  await page.getByRole("button", { name: "Open course" }).click();
  const sourceButton = page.getByRole("button", { name: "Download Raw GIS Source (ODbL)" });
  await expect(sourceButton).toBeVisible();
  await expect(sourceButton).toBeEnabled();

  const downloadPromise = page.waitForEvent("download");
  await sourceButton.click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^ctc-gis-source-\d{8}T\d{6}Z\.json$/);
  expect(await page.evaluate(() => (window as typeof window & { __ctcBlobTypes: string[] }).__ctcBlobTypes.at(-1)))
    .toBe("application/json;charset=utf-8");

  await page.waitForFunction(() => (window as typeof window & { __ctcBlobTexts: string[] }).__ctcBlobTexts.length > 0);
  const text = await page.evaluate(() => (window as typeof window & { __ctcBlobTexts: string[] }).__ctcBlobTexts.at(-1) ?? "");
  const exported = JSON.parse(text);
  expect(exported.rawResponse).toBe(rawDetailText);
  expect(exported.license).toBe("ODbL-1.0");
  expect(exported.copyrightUrl).toBe("https://www.openstreetmap.org/copyright");
  expect(exported.consentState).toBe("fresh");
  expect(exported.isStaleSource).toBe(false);
  expect(exported.osmElementsSummary[0]).toEqual({ type: "node", id: 9000060999, tagKeys: ["natural"] });
  expect(exported.osmElementsSummary).toContainEqual({ type: "way", id: 9000060001, tagKeys: ["leisure", "name"] });
  expect(text).not.toContain("targets");
  expect(text).not.toContain("carries");
  expect(text).not.toContain("clubProfile");
  await expect(page.getByText("Raw GIS source export started.")).toBeVisible();
});

test("supports keyboard flow, mobile layout, and axe scans across states", async ({ page }) => {
  let resolveRequest: (() => void) | undefined;
  await isolateNetwork(page, async (route) => {
    await new Promise<void>((resolve) => { resolveRequest = resolve; });
    await route.fulfill({ json: discovery });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await assertAxe(page);
  await fillBounds(page);
  await page.getByLabel("East").press("Enter");
  await expect(page.getByText("Searching courses.")).toBeVisible();
  await assertAxe(page);
  resolveRequest?.();
  await expect(page.getByText("Synthetic Municipal Course")).toBeVisible();
  await assertAxe(page);
  const detailButton = page.getByRole("button", { name: "Open course" });
  await expect(detailButton).toBeVisible();
  expect(await detailButton.evaluate((button) => button.getBoundingClientRect().right <= window.innerWidth)).toBe(true);

  await page.getByLabel("South").fill("bad");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/Use decimal degrees/)).toBeVisible();
  await assertAxe(page);
});

test("accessibility oracle detects a known injected violation", async ({ page }) => {
  await isolateNetwork(page);
  await page.goto("/");
  await page.locator("main").evaluate((main) => {
    main.insertAdjacentHTML("beforeend", '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==">');
  });
  const results = await new AxeBuilder({ page }).include("main").analyze();
  expect(results.violations.map((violation) => violation.id)).toContain("image-alt");
});

test("renders and measures the selected hole with pointer, keyboard, mobile, and attribution support", async ({ page }) => {
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Open course" }).click();

  const map = page.getByTestId("hole-vector-map");
  await expect(map).toBeVisible();
  await expect(page.getByText("Course data © OpenStreetMap contributors.")).toBeVisible();
  for (const layer of ["vegetation", "generic-water", "golf-water", "rough", "fairway", "bunker", "green", "tee", "route", "measurement", "fairway-width", "dispersion"]) {
    await expect(map.locator(`[data-layer="${layer}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-layer="vegetation"] circle')).toHaveCount(1); // in-scope context, clipped without affecting fit
  await expect(page.getByRole("heading", { name: "Fairway width" })).toBeVisible();
  await page.getByRole("button", { name: "220 yd" }).click();
  await expect(page.getByText(/at 220 yd/i)).toBeVisible();
  await page.getByRole("button", { name: "280 yd" }).click();
  await expect(page.getByText(/at 280 yd/i)).toBeVisible();
  await expect(page.locator('.fairway-width-status[role="status"][aria-live="polite"]')).toHaveCount(1);
  expect(await map.evaluate((element) => element.getBoundingClientRect().right <= window.innerWidth)).toBe(true);

  await map.click({ position: { x: 60, y: 60 } });
  await expect(page.getByText("Select the second point.")).toBeVisible();
  await map.click({ position: { x: 250, y: 180 } });
  await expect(page.getByText(/^Distance: \d+ yd \/ \d+ m$/)).toBeVisible();
  await map.click({ position: { x: 150, y: 120 } });
  await expect(page.getByText("Select the second point.")).toBeVisible();

  await map.focus();
  await map.press("Escape");
  await expect(page.getByText("No measurement selected.")).toBeVisible();
  await map.press("ArrowRight");
  await map.press("Enter");
  await map.press("Shift+ArrowDown");
  await map.press("Enter");
  await expect(page.getByText(/^Distance: \d+ yd \/ \d+ m$/)).toBeVisible();
  await expect(map).toBeFocused();
  await assertAxe(page);
});

test("manages targets, carry arcs, and strict local project exchange", async ({ page }) => {
  await page.addInitScript(() => {
    const original = URL.createObjectURL.bind(URL);
    (window as typeof window & { __ctcProjectTexts?: string[] }).__ctcProjectTexts = [];
    URL.createObjectURL = (blob) => {
      if (blob instanceof Blob && blob.type === "application/json") void blob.text().then((text) => {
        (window as typeof window & { __ctcProjectTexts: string[] }).__ctcProjectTexts.push(text);
      });
      return original(blob);
    };
  });
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Open course" }).click();

  const map = page.getByTestId("hole-vector-map");
  await page.getByRole("button", { name: "Add target" }).click();
  await map.click({ position: { x: 180, y: 180 } });
  await expect(page.locator('input[value="Target 1"]')).toBeVisible();
  await expect(map.locator('[data-layer="targets"] [data-target-id]')).toHaveCount(1);

  await page.getByRole("button", { name: "Add carry" }).click();
  await expect(map.locator('[data-layer="carry-arcs"] [data-carry-id]')).toHaveCount(1);
  await expect(map.locator('[data-layer="carry-arcs"] text')).toHaveText("150 yd");
  await expect(page.getByText(/outside the map view/)).toBeVisible();

  await page.getByRole("button", { name: "Add club" }).click();
  await expect(page.getByLabel("Club name")).toHaveValue("Club 1");
  await expect(map.locator('[data-layer="dispersion"] .dispersion-ellipse')).toHaveCount(1);
  const layers = await map.locator("[data-layer]").evaluateAll((elements) => elements.map((element) => element.getAttribute("data-layer")));
  expect(layers.indexOf("dispersion")).toBeGreaterThan(layers.indexOf("fairway-width"));
  expect(layers.indexOf("dispersion")).toBeLessThan(layers.indexOf("targets"));

  const beforeDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export project" }).click();
  await beforeDownloadPromise;
  await page.waitForFunction(() => (window as typeof window & { __ctcProjectTexts: string[] }).__ctcProjectTexts.length === 1);
  const beforeProfile = await page.evaluate(() => JSON.parse((window as typeof window & { __ctcProjectTexts: string[] }).__ctcProjectTexts[0]).clubProfile);

  const carryInput = page.getByLabel("Carry yards");
  await carryInput.fill("0");
  await carryInput.blur();
  await expect(carryInput).toHaveValue("150");
  await expect(page.locator(".dispersion-panel .warning").getByText(/whole-yard carry value/)).toBeVisible();

  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("button", { name: "Undo delete" })).toBeVisible();
  await page.getByRole("button", { name: "Undo delete" }).click();
  await expect(page.locator('input[value="Target 1"]')).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export project" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("chart-the-course-project.json");
  await page.waitForFunction(() => (window as typeof window & { __ctcProjectTexts: string[] }).__ctcProjectTexts.length === 2);
  const afterProfile = await page.evaluate(() => JSON.parse((window as typeof window & { __ctcProjectTexts: string[] }).__ctcProjectTexts[1]).clubProfile);
  expect(afterProfile).toEqual(beforeProfile);

  await page.getByLabel("Import project file (.json)").setInputFiles("fixtures/projects/synthetic-project-wrong-course.json");
  await expect(page.getByRole("alert")).toContainText("COURSE_MISMATCH");
  await expect(page.locator('input[value="Target 1"]')).toBeVisible();
  await expect(page.getByText("Course data © OpenStreetMap contributors.")).toBeVisible();
  await assertAxe(page);
});

// Use the live-detail workflow so source and authored project downloads coexist.
async function preparePopulatedProject(page: Page): Promise<ProjectV2> {
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses", exact: true }).click();
  await page.getByRole("button", { name: "Open course", exact: true }).click();
  await page.getByRole("button", { name: "Add target", exact: true }).click();
  await page.getByTestId("hole-vector-map").click({ position: { x: 180, y: 180 } });
  await page.getByRole("button", { name: "Add carry", exact: true }).click();
  await page.getByRole("button", { name: "Add club", exact: true }).click();
  for (const [label, value] of [
    ["Target label", "Exchange landing"], ["Distances in yards", "125, 175"],
    ["Club name", "Exchange iron"], ["Carry yards", "165"],
    ["Longitudinal full width yards", "28"], ["Lateral full width yards", "18"],
  ]) {
    await page.getByLabel(label, { exact: true }).fill(value);
    await page.getByLabel(label, { exact: true }).blur();
  }
  const saved: ProjectV2 = await downloadedJson(page, "Export project");
  expect(saved.schema).toBe("chart-the-course-project/v2");
  expect(saved.courseSourceKey).toBe("way/9000060001");
  const hole = saved.holes["way/9000060101"]!;
  expect(hole.targets).toEqual([{
    id: expect.stringMatching(/^t-[0-9a-f]{12}$/), label: "Exchange landing",
    lat: expect.any(Number), lon: expect.any(Number),
  }]);
  expect(hole.carries).toEqual([{
    id: expect.stringMatching(/^c-[0-9a-f]{12}$/),
    origin: { kind: "tee", sourceKey: "way/9000060201" }, distances: [125, 175],
  }]);
  expect(saved.clubProfile.clubs).toEqual([{
    id: expect.stringMatching(/^p-[0-9a-f]{12}$/), label: "Exchange iron",
    carry: 165, longitudinal: 28, lateral: 18,
  }]);
  return saved;
}

async function importProjectJson(page: Page, project: unknown) {
  await page.getByLabel("Import project file (.json)").evaluate((input: HTMLInputElement, text) => {
    const files = new DataTransfer();
    files.items.add(new File([text], "exchange-project.json", { type: "application/json" }));
    input.files = files.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, JSON.stringify(project));
}

test("restores a populated live-course project download and keeps raw GIS source separate", async ({ page }) => {
  const saved = await preparePopulatedProject(page);
  const source = await downloadedJson(page, "Download Raw GIS Source (ODbL)");
  expect(source.rawResponse).toBe(JSON.stringify(ctc006Detail));
  const sourceText = JSON.stringify(source);
  for (const field of ["targets", "carries", "clubProfile", "Exchange landing", "Exchange iron",
    saved.holes["way/9000060101"]!.targets[0].id, saved.holes["way/9000060101"]!.carries[0].id,
    saved.clubProfile.clubs[0].id]) expect(sourceText).not.toContain(field);

  // Replace every authored collection, rather than importing over identical state.
  const replacement = { ...saved, holes: {}, clubProfile: { clubs: [] } };
  page.once("dialog", (dialog) => dialog.accept());
  await importProjectJson(page, replacement);
  await expect(page.getByText("Project imported successfully.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Target label", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Distances in yards", { exact: true })).toHaveCount(0);
  await expect(page.getByText("No clubs added.", { exact: true })).toBeVisible();
  const emptied = await downloadedJson(page, "Export project");
  expect(emptied).toEqual({ ...replacement, exportedAt: emptied.exportedAt });
  const emptySource = await downloadedJson(page, "Download Raw GIS Source (ODbL)");
  expect(source).toEqual({ ...emptySource, exportedAt: source.exportedAt });

  await importProjectJson(page, saved);
  await expect(page.getByLabel("Target label", { exact: true })).toHaveValue("Exchange landing");
  await expect(page.getByLabel("Distances in yards", { exact: true })).toHaveValue("125, 175");
  await expect(page.getByLabel("Club name", { exact: true })).toHaveValue("Exchange iron");
  const restored = await downloadedJson(page, "Export project");
  expect(restored).toEqual({ ...saved, exportedAt: restored.exportedAt });
  const map = page.getByTestId("hole-vector-map");
  await expect(map.locator('[data-layer="targets"] [data-target-id]'))
    .toHaveAttribute("data-target-id", saved.holes["way/9000060101"]!.targets[0].id);
  await expect(map.locator('[data-layer="carry-arcs"] text')).toHaveText(["125 yd", "175 yd"]);
  await expect(map.locator('[data-layer="dispersion"] polygon[role="img"]'))
    .toHaveAttribute("aria-label", /Exchange iron.*165 yard carry, 28 yard longitudinal full width, 18 yard lateral full width/);
});

test("rejects invalid project replacements atomically and migrates supported v1 downloads", async ({ page }) => {
  const saved = await preparePopulatedProject(page);
  const invalid = structuredClone(saved);
  invalid.holes["way/9000060101"]!.targets[0].label = "Must not be applied";
  invalid.clubProfile.clubs[0].carry = 0; // A bad club must not partially apply the changed target.
  const wrongCourse = { ...saved, courseSourceKey: "way/9000000001", clubProfile: { clubs: [] } };
  const wrongHole = { ...saved, holes: { "way/9000000101": saved.holes["way/9000060101"] }, clubProfile: { clubs: [] } };
  let confirmations = 0;
  page.on("dialog", async (dialog) => { confirmations += 1; await dialog.dismiss(); });
  for (const [candidate, code] of [[invalid, "OUT_OF_RANGE"], [wrongCourse, "COURSE_MISMATCH"], [wrongHole, "HOLE_MISMATCH"]] as const) {
    await importProjectJson(page, candidate);
    await expect(page.getByRole("alert")).toContainText(code);
    const retained = await downloadedJson(page, "Export project");
    expect(retained).toEqual({ ...saved, exportedAt: retained.exportedAt });
  }
  expect(confirmations).toBe(0); // Validation must precede replacement consent.
  page.removeAllListeners("dialog");

  const { clubProfile: _profile, ...legacyFields } = saved;
  const legacy = { ...legacyFields, schema: "chart-the-course-project/v1" };
  page.once("dialog", (dialog) => dialog.accept());
  await importProjectJson(page, legacy);
  await expect(page.getByText("Project imported successfully.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Target label", { exact: true })).toHaveValue("Exchange landing");
  await expect(page.getByLabel("Distances in yards", { exact: true })).toHaveValue("125, 175");
  await expect(page.getByText("No clubs added.", { exact: true })).toBeVisible();
  const migrated = await downloadedJson(page, "Export project");
  expect(migrated).toEqual({ ...saved, exportedAt: migrated.exportedAt, clubProfile: { clubs: [] } });
});

test("keeps club profile and dispersion selections transient across reload", async ({ page }) => {
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Open course" }).click();
  const map = page.getByTestId("hole-vector-map");
  await page.getByRole("button", { name: "Add target" }).click();
  await map.click({ position: { x: 180, y: 180 } });
  await page.getByRole("button", { name: "Add club" }).click();
  await expect(page.getByLabel("Dispersion origin")).toBeEnabled();
  await expect(page.getByLabel("Dispersion target")).toHaveValue(/t-[0-9a-f]{12}/);
  await expect(page.getByLabel("Dispersion club")).toHaveValue(/p-[0-9a-f]{12}/);
  await expect(map.locator('[data-layer="dispersion"] polygon[role="img"]')).toHaveAttribute("aria-label", /150 yard carry, 30 yard longitudinal full width, 20 yard lateral full width/);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await assertAxe(page);

  page.once("dialog", (dialog) => dialog.accept());
  await page.reload();
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Open course" }).click();
  await expect(page.getByText("No clubs added.")).toBeVisible();
  await expect(page.getByTestId("hole-vector-map").locator('[data-layer="dispersion"] polygon')).toHaveCount(0);
});

test("keeps fairway-width selection transient without duplicating its status region", async ({ page }) => {
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Open course" }).click();

  const map = page.getByTestId("hole-vector-map");
  await page.getByRole("button", { name: "Add target" }).click();
  await map.click({ position: { x: 180, y: 180 } });
  await page.getByRole("button", { name: "Add carry" }).click();
  const carries = map.locator('[data-layer="carry-arcs"] [data-carry-id]');
  await expect(carries).toHaveCount(1);
  for (const yards of [220, 250, 280, 220, 280]) await page.getByRole("button", { name: `${yards} yd` }).click();
  await expect(page.locator('.fairway-width-status[role="status"][aria-live="polite"]')).toHaveCount(1);
  await expect(carries).toHaveCount(1);
  await expect(page.locator('input[value="Target 1"]')).toHaveCount(1);
});

for (const stale of [false, true]) {
  test(`retains selected course identity through ${stale ? "stale consent" : "live, refresh and shared cache"} and project matching`, async ({ page }) => {
    const { default: multiple } = await import("../../fixtures/overpass/synthetic-multiple-courses.json", { with: { type: "json" } });
    const courseA = { ...discovery.elements[0], id: 9000060000, tags: { leisure: "golf_course", name: "Synthetic Course A" } };
    const choices = { elements: [courseA, discovery.elements[0]] };
    let detailRequests = 0;
    let offlineDetail = false;
    await page.addInitScript(() => {
      const original = URL.createObjectURL.bind(URL);
      URL.createObjectURL = (blob) => {
        if (blob instanceof Blob) (window as typeof window & { __ctcLastBlob: Promise<string> }).__ctcLastBlob = blob.text();
        return original(blob);
      };
    });
    await isolateNetwork(page, async (route) => {
      const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
      if (!query.includes("purpose:golf-course-detail")) return route.fulfill({ json: choices });
      detailRequests += 1;
      if (offlineDetail) return route.fulfill({ status: 500 });
      // Alternate response order without changing the selected identity.
      return route.fulfill({ json: { elements: detailRequests % 2 ? multiple.elements : [...multiple.elements].reverse() } });
    });
    const search = async () => {
      await fillBounds(page);
      await page.getByRole("button", { name: "Search courses" }).click();
      await expect(page.getByRole("button", { name: "Open course" })).toHaveCount(2);
    };
    const choose = async (index: number) => page.getByRole("button", { name: "Open course" }).nth(index).click();
    await page.goto("/");
    await search();
    await choose(1);
    const selectedB = page.getByText(/Selected course:.*\(way\/9000060001\)/);
    await expect(selectedB).toBeVisible();
    await page.getByRole("button", { name: "Add club" }).click();
    const projectB = await downloadedJson(page, "Export project");
    expect(projectB.courseSourceKey).toBe("way/9000060001");
    if (!stale) {
      await page.getByRole("button", { name: "Refresh course data", exact: true }).click();
      await expect(page.getByText("Refresh complete.", { exact: true })).toBeVisible();
      await expect(selectedB).toBeVisible();
      const refreshed = await downloadedJson(page, "Export project");
      expect(refreshed).toEqual({ ...projectB, exportedAt: refreshed.exportedAt });
    }
    await page.reload();
    if (stale) {
      await page.clock.setFixedTime(Date.now() + 8 * 24 * 60 * 60 * 1000);
      offlineDetail = true;
    }
    await search();
    await choose(1);
    if (stale) {
      await expect(page.getByRole("heading", { name: "Stored course data available" })).toBeVisible();
      await expect(selectedB).toHaveCount(0);
      await page.getByRole("button", { name: "Render stored course data" }).click();
    }
    await expect(selectedB).toBeVisible();
    const importB = async () => page.getByLabel("Import project file (.json)").evaluate((input: HTMLInputElement, text) => {
      const files = new DataTransfer();
      files.items.add(new File([text], "b.json", { type: "application/json" }));
      input.files = files.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }, JSON.stringify(projectB));
    await importB();
    await expect(page.getByText("Project imported successfully.", { exact: true })).toBeVisible();
    const roundTrip = await downloadedJson(page, "Export project");
    expect(roundTrip).toEqual({ ...projectB, exportedAt: roundTrip.exportedAt });
    if (stale) {
      const source = await downloadedJson(page, "Download Raw GIS Source (ODbL)");
      expect(source.consentState).toBe("stale-consented");
      expect(JSON.parse(source.rawResponse)).toEqual({ elements: multiple.elements });
    } else {
      await search();
      await choose(0);
      await expect(page.getByText(/Selected course:.*\(way\/9000060000\)/)).toBeVisible();
      await importB();
      await expect(page.getByText("COURSE_MISMATCH", { exact: true })).toBeVisible();
      expect((await downloadedJson(page, "Export project")).courseSourceKey).toBe("way/9000060000");
    }
    expect(detailRequests).toBe(2);
  });
}

for (const evidence of ["missing", "duplicate"]) {
  test(`rejects ${evidence} selected course evidence without guessing another course`, async ({ page }) => {
    const elements = evidence === "missing"
      ? [...ctc006Detail.elements.filter((element) => element.id !== 9000060001), { ...ctc006Detail.elements[0], id: 9000060000 }]
      : [...ctc006Detail.elements, ctc006Detail.elements[0]];
    await isolateNetwork(page, async (route) => {
      const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
      await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? { elements } : discovery });
    });
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses" }).click();
    await page.getByRole("button", { name: "Open course" }).click();
    await expect(page.getByText(/Selected course evidence is missing or ambiguous/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Export project", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Open course" })).toBeEnabled();
  });
}

for (const cachedEvidence of ["missing", "duplicate"]) {
  test(`retries selected course from live data when shared cache has ${cachedEvidence} evidence`, async ({ page }) => {
    const { default: multiple } = await import("../../fixtures/overpass/synthetic-multiple-courses.json", { with: { type: "json" } });
    const courseA = { ...discovery.elements[0], id: 9000060000, tags: { leisure: "golf_course", name: "Synthetic Course A" } };
    let detailRequests = 0;
    await isolateNetwork(page, async (route) => {
      const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
      if (!query.includes("purpose:golf-course-detail")) return route.fulfill({ json: { elements: [courseA, discovery.elements[0]] } });
      detailRequests += 1;
      const elements = detailRequests > 1 ? multiple.elements : cachedEvidence === "missing"
        ? multiple.elements.filter((element) => element.id !== 9000060001)
        : [...multiple.elements, multiple.elements[0]];
      return route.fulfill({ json: { elements } });
    });
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses" }).click();
    await page.getByRole("button", { name: "Open course" }).nth(0).click();
    await expect(page.getByText(/Selected course:.*\(way\/9000060000\)/)).toBeVisible();
    await page.getByRole("button", { name: "Search courses" }).click();
    await page.getByRole("button", { name: "Open course" }).nth(1).click();
    await expect(page.getByText(/Selected course:.*\(way\/9000060001\)/)).toBeVisible();
    expect(detailRequests).toBe(2);
    await expect(page.getByRole("button", { name: "Export project", exact: true })).toBeEnabled();
  });
}

for (const genericWater of [false, true]) {
  test(`compares mapped-water candidates locally with ${genericWater ? "generic-only unavailable evidence" : "mobile accessible results and isolated off-map rows"}`, async ({ page }) => {
    // Metre-based synthetic geometry: origin at x=0, landing at x=91.44.
    const coordinate = (x: number, y: number) => ({ lat: -y / 6_371_000 * 180 / Math.PI, lon: x / 6_371_000 * 180 / Math.PI });
    const waterRing = [[51.44, -40], [131.44, -40], [131.44, 40], [51.44, 40], [51.44, -40]]
      .map(([x, y]) => coordinate(x, y));
    const detail = { elements: [
      { ...discovery.elements[0], geometry: [[-100,-100],[400,-100],[400,100],[-100,100],[-100,-100]].map(([x,y])=>coordinate(x,y)) },
      { type: "way", id: 1, tags: { golf: "hole", ref: "1" }, geometry: [coordinate(0, 0), coordinate(300, 0)] },
      { type: "node", id: 2, tags: { golf: "tee", ref: "1" }, ...coordinate(0, 0) },
      { type: "way", id: 3, tags: genericWater ? { natural: "water", ref: "1" } : { golf: "water_hazard", ref: "1" }, geometry: waterRing },
      { type: "way", id: 4, tags: { golf: "hole", ref: "2" }, geometry: [coordinate(0, 0), coordinate(300, 0)] },
    ] };
    let requests = 0;
    await isolateNetwork(page, async (route) => {
      requests += 1;
      const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
      await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? detail : discovery });
    });
    await page.setViewportSize({ width: genericWater ? 1280 : 320, height: 844 });
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses", exact: true }).click();
    await page.getByRole("button", { name: "Open course", exact: true }).click();
    const panel = page.getByRole("region", { name: "Mapped-risk indicator", exact: true });
    await expect(panel).toContainText("Add a target to compare mapped-risk indicators.");
    const project: ProjectV2 = await downloadedJson(page, "Export project");
    project.holes = { "way/1": { targets: [
      { id: "t-000000000001", label: "Water landing", ...coordinate(300, 0) },
      { id: "t-000000000002", label: "Outside guide", ...coordinate(-300, 0) },
    ], carries: [] } };
    project.clubProfile = { clubs: [{ id: "p-000000000001", label: "Synthetic club", carry: 100, longitudinal: 80, lateral: 80 }] };
    await importProjectJson(page, project);
    await expect(page.getByText("Project imported successfully.", { exact: true })).toBeVisible();
    const rows = panel.getByRole("listitem");
    await expect(rows).toHaveCount(2);
    await expect(panel.locator('[role="status"][aria-live="polite"][aria-atomic="true"] .risk-list')).toHaveCount(1);
    await expect(panel).toContainText("512 fixed, area-weighted samples");
    await expect(panel).toContainText("Thin or small water areas between samples can be missed");
    await expect(panel).toContainText("not shot probability");
    if (genericWater) {
      await expect(panel).toContainText("No usable mapped golf-water geometry is available for this hole.");
      await expect(rows.nth(0)).toContainText("Water landing: mapped-risk overlap is unavailable.");
      await expect(panel).not.toContainText("safe mapped-risk indicator");
    } else {
      await expect(rows.nth(0)).toContainText("Mapped golf-water overlap: 100%. unsafe mapped-risk indicator.");
      await expect(rows.nth(0)).toContainText("Lowest mapped-overlap target.");
      await expect(rows.nth(1)).toContainText("Outside guide: mapped-risk overlap is unavailable because this dispersion guide extends outside the map view.");
      await page.getByLabel("Dispersion origin").selectOption("target:t-000000000001");
      await expect(rows.nth(0)).toContainText("Water landing: mapped-risk overlap is unavailable.");
      await page.getByLabel("Dispersion origin").selectOption("tee:node/2");
      await expect(rows.nth(0)).toContainText("overlap: 100%");
      await page.getByRole("button", { name: "Delete club", exact: true }).focus();
      await page.keyboard.press("Enter");
      await expect(panel).toContainText("Add or select a club for the dispersion guide. Mapped-risk comparison is unavailable.");
      await expect(rows.nth(0)).toContainText("Water landing: mapped-risk overlap is unavailable.");
      await page.getByRole("button", { name: "Add club", exact: true }).click();
      await page.getByRole("combobox", { name: "Hole", exact: true }).selectOption("way/4");
      await expect(panel).toContainText("Add a target to compare mapped-risk indicators.");
      await page.getByRole("combobox", { name: "Hole", exact: true }).selectOption("way/1");
      await expect(rows).toHaveCount(2);
      await assertAxe(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
    expect(requests).toBe(2); // All scoring/selection/edit operations remain local.
    page.once("dialog", (dialog) => void dialog.accept());
    await page.reload();
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses", exact: true }).click();
    await page.getByRole("button", { name: "Open course", exact: true }).click();
    await expect(panel).toContainText("Add a target to compare mapped-risk indicators.");
    await expect(page.getByText("No clubs added.", { exact: true })).toBeVisible();
    expect(requests).toBe(2); // Reload reuses source cache, never authored state.
  });
}

for (const shared of [false, true]) {
  test(`renders ${shared ? "shared" : "inferred"} missing-ref candidates only as display evidence`, async ({ page }) => {
    const detail = structuredClone(ctc006Detail) as OverpassResponse;
    for (const element of detail.elements) if (element.tags?.golf !== "hole" && element.tags) delete element.tags.ref;
    // Existing triangular tee does not contain the route start; use an explicit
    // synthetic interior-start case rather than assuming ref implies proximity.
    const tee = detail.elements.find(e => e.tags?.golf === "tee")!;
    tee.geometry = [{lat:35.0008,lon:-79.9993},{lat:35.0013,lon:-79.9993},
      {lat:35.0013,lon:-79.9987},{lat:35.0008,lon:-79.9987},{lat:35.0008,lon:-79.9993}];
    if (shared) {
      const route = structuredClone(detail.elements.find(e => e.tags?.golf === "hole")!);
      route.id = 9900000047;
      route.tags = { ...route.tags, ref: "2" };
      detail.elements.push(route);
    }
    let invalidScope = false;
    await isolateNetwork(page, async route => {
      const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
      const response = structuredClone(detail);
      if (invalidScope) response.elements = response.elements.filter(e => e.tags?.leisure !== "golf_course");
      await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? response : discovery });
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses", exact: true }).click();
    await page.getByRole("button", { name: "Open course", exact: true }).click();
    const map = page.getByTestId("hole-vector-map");
    await expect(map).toBeVisible();
    const basis = shared ? "shared-candidate" : "inferred-candidate";
    await expect(map.locator(`[data-association="${basis}"]`)).toHaveCount(3);
    await expect(map.locator('[data-association="course-context"]')).toHaveCount(6);
    await expect(page.getByText("No tee geometry available for this hole.", { exact: true })).toBeVisible();
    await expect(page.locator(".fairway-width-status")).toContainText("No usable fairway polygon");
    await page.getByText("Feature association evidence", { exact: true }).click();
    await expect(page.locator(".association-evidence")).toContainText(shared ? "Shared/ambiguous candidate" : "Inferred candidate");
    await expect(page.locator(".association-evidence")).toContainText("excluded from tee origins, fairway width and mapped-water calculations");
    expect(await map.locator('[data-association]').first().locator('..').getAttribute('clip-path')).toMatch(/^url\(#/);
    await assertAxe(page);
    await map.focus();
    await map.press("Enter");
    await map.press("ArrowRight");
    await map.press("Enter");
    await expect(page.locator(".hole-map-panel > p.measurement-result")).toHaveText(/^Distance:/);
    await page.getByRole("button", { name: "Add target", exact: true }).click();
    await map.press("Enter");
    const project = await downloadedJson(page,"Export project");
    expect(Object.values((project as ProjectV2).holes).flatMap(h => h?.targets ?? [])).toHaveLength(1);
    await page.getByRole("button", { name: "Add club", exact: true }).click();
    await expect(page.getByText("No usable mapped golf-water geometry is available for this hole.", { exact: true })).toBeVisible();
    // Same-course scope loss cannot discard authored state or the selected hole.
    invalidScope = true;
    await page.getByRole("button", { name: "Refresh course data", exact: true }).click();
    await expect(page.getByText(/Existing course and project were retained/)).toBeVisible();
    await expect(map).toBeVisible();
    const retained = await downloadedJson(page,"Export project");
    expect(retained.holes).toEqual(project.holes);
    expect(retained.clubProfile.clubs).toHaveLength(1);
  });
}

test("withholds overlapping facility geometry and exposes unavailable-scope diagnostics", async ({ page }) => {
  const detail = structuredClone(ctc006Detail) as OverpassResponse;
  const facility = structuredClone(detail.elements.find(e=>e.tags?.leisure === "golf_course")!);
  facility.id = 9900000047;
  detail.elements.push(facility);
  await isolateNetwork(page, async route => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? detail : discovery });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses", exact: true }).click();
  await page.getByRole("button", { name: "Open course", exact: true }).click();
  await expect(page.getByText(/No in-scope holes are available/)).toBeVisible();
  await expect(page.getByTestId("hole-vector-map")).toHaveCount(0);
  await page.getByText("Normalization diagnostics", { exact: true }).click();
  await expect(page.getByText("HOLE_SCOPE_UNRESOLVED: way/9000060101", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download Raw GIS Source (ODbL)", exact: true })).toBeEnabled();
});

for (const mobile of [false,true]) {
  test(`preserves multipolygon interiors, relation tee limits and project/source exchange on ${mobile ? "mobile" : "desktop"}`, async ({page}) => {
    const { default: detail } = await import("../../fixtures/overpass/synthetic-golf-course-multipolygon.json", { with: { type: "json" } });
    await isolateNetwork(page,async route=>{
      const query=new URLSearchParams(route.request().postData()??"").get("data")??"";
      await route.fulfill({json:query.includes("purpose:golf-course-detail") ? detail : discovery});
    });
    if (mobile) await page.setViewportSize({width:390,height:844});
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button",{name:"Search courses",exact:true}).click();
    await page.getByRole("button",{name:"Open course",exact:true}).click();
    const map=page.getByTestId("hole-vector-map");
    await expect(map).toBeVisible();
    const fairway=map.locator('[data-layer="fairway"] > path');
    await expect(fairway).toHaveCount(1);
    await expect(map.locator('[data-layer="fairway"] polygon')).toHaveCount(0);
    await expect(fairway).toHaveAttribute("fill-rule","evenodd");
    // The browser's actual fill predicate must exclude the interior and the gap,
    // while retaining both exterior parts; this catches visually filled holes.
    const fill=await fairway.evaluate((path:SVGPathElement)=>{
      const d=path.getAttribute("d")!;
      const rings=d.split(" Z").filter(s=>s.trim()).map(s=>[...s.matchAll(/[ML]([\d.e+-]+),([\d.e+-]+)/g)].map(m=>({x:Number(m[1]),y:Number(m[2])})));
      const center=(r:{x:number;y:number}[])=>{const points=r.slice(0,-1);return new DOMPoint(points.reduce((v,p)=>v+p.x,0)/points.length,points.reduce((v,p)=>v+p.y,0)/points.length);};
      // Identify interior by bounding-box containment, independent of canonical order.
      const bounds=rings.map(r=>({minX:Math.min(...r.map(p=>p.x)),maxX:Math.max(...r.map(p=>p.x)),minY:Math.min(...r.map(p=>p.y)),maxY:Math.max(...r.map(p=>p.y))}));
      const inner=bounds.findIndex((b,i)=>bounds.some((o,j)=>j!==i && b.minX>o.minX && b.maxX<o.maxX && b.minY>o.minY && b.maxY<o.maxY));
      const second=bounds.findIndex((_,i)=>i!==inner && !bounds.some((b,j)=>j!==i && b.minX>bounds[i].minX && b.maxX<bounds[i].maxX));
      return {rings:rings.length,interior:path.isPointInFill(center(rings[inner])),second:path.isPointInFill(center(rings[second]))};
    });
    expect(fill).toEqual({rings:3,interior:false,second:true});
    await expect(map.locator('[data-layer="tee"] > path')).toHaveCount(1);
    await expect(page.getByText("No tee geometry available for this hole.",{exact:true})).toBeVisible();
    await expect(page.getByText(/Relation tee is displayable/).first()).toBeVisible();
    await map.focus();
    await map.press("Enter");
    await map.press("ArrowRight");
    await map.press("Enter");
    await expect(page.locator(".hole-map-panel > p.measurement-result")).toHaveText(/^Distance:/);
    await page.getByRole("button",{name:"Add target",exact:true}).click();
    await map.press("Enter");
    await page.getByRole("button",{name:"Add carry",exact:true}).click();
    await page.getByRole("button",{name:"Add club",exact:true}).click();
    const project:ProjectV2=await downloadedJson(page,"Export project");
    expect(project.courseSourceKey).toBe("way/9000060001");
    const state=project.holes["way/9000060101"]!;
    expect(state.targets).toHaveLength(1);
    expect(state.carries[0].origin).toEqual({kind:"target",targetId:state.targets[0].id});
    const source=await downloadedJson(page,"Download Raw GIS Source (ODbL)");
    expect(source.rawResponse).toBe(JSON.stringify(detail));
    expect(JSON.stringify(source)).not.toContain(state.targets[0].id);
    page.once("dialog",dialog=>void dialog.accept());
    await importProjectJson(page,{...project,holes:{},clubProfile:{clubs:[]}});
    await expect(page.getByText("Project imported successfully.",{exact:true})).toBeVisible();
    await importProjectJson(page,project);
    await expect(page.getByLabel("Target label",{exact:true})).toHaveCount(1);
    const restored=await downloadedJson(page,"Export project");
    expect(restored).toEqual({...project,exportedAt:restored.exportedAt});
    await assertAxe(page);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  });
}
