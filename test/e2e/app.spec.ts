import { expect, test, type Page, type Route } from "@playwright/test";
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
  await expect(page.getByRole("button", { name: "Detail unavailable" })).toBeDisabled();
  await expect(page.getByText(/Data © OpenStreetMap contributors/)).toBeVisible();
  expect(discoveryRequests).toBe(1);
  expect(detailRequests).toBe(0);

  await page.getByRole("button", { name: "Load raw detail" }).click();
  await expect(page.getByText(/raw detail entities loaded/)).toBeVisible();
  await expect(page.locator(".raw-list code").getByText("way/9000060001", { exact: true })).toBeVisible();
  expect(detailRequests).toBe(1);

  await page.reload();
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("Synthetic.*");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/raw discovery entities loaded from durable cache/)).toBeVisible();
  expect(discoveryRequests).toBe(1);
});

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
    await expect(page.getByRole("button", { name: "Load raw detail" })).toBeDisabled();
    await page.getByRole("button", { name: "Cancel request" }).click();
    await expect(page.getByText("Request cancelled.", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Load raw detail" }).click();
    await expect(page.getByText(/raw detail entities loaded/)).toBeVisible();
    await releaseCacheGate(page);
    await expect(page.getByText(/raw detail entities loaded/)).toBeVisible();
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
      await expect(page.getByText(/raw discovery entities loaded/)).toBeVisible();
    }
    await releaseCacheGate(page);
    if (fail) {
      await expect(page.getByText(/raw discovery entities loaded/)).toBeVisible();
      await expect(page.locator(".status .warning")).toHaveCount(0);
      return;
    }
    await expect(page.getByText("Request cancelled.", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Raw OSM entities" })).toHaveCount(0);
    await expect(page.locator(".status .warning")).toHaveCount(0);
    await page.getByLabel(/Course name/).fill("Newer search");
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect(page.getByText(/raw discovery entities loaded/)).toBeVisible();
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
  await expect(page.getByText(/raw discovery entities loaded/)).toBeVisible();
  await page.clock.setFixedTime(Date.now() + 8 * 24 * 60 * 60 * 1000);
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByRole("heading", { name: "Stored course data available" })).toBeVisible();
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect.poll(() => searches).toBe(3);
  await expect(page.getByRole("heading", { name: "Stored course data available" })).toHaveCount(0);
  await page.getByRole("button", { name: "Cancel request" }).click();
  await page.getByRole("button", { name: "Load raw detail" }).click();
  await expect(page.getByText(/raw detail entities loaded/)).toBeVisible();
  releaseFailure();
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(page.getByRole("heading", { name: "Stored course data available" })).toHaveCount(0);
  await expect(page.getByText(/raw detail entities loaded/)).toBeVisible();
});

test("obsolete refresh cooldown expires without replacing the current cache status", async ({ page }) => {
  await page.clock.install();
  await installCacheGate(page);
  await isolateNetwork(page, async (route) => route.fulfill({ json: discovery }));
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/raw discovery entities loaded/)).toBeVisible();
  await armCacheGate(page, "write");
  await page.getByRole("button", { name: "Refresh course data" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { cacheGate: { pending: boolean } }).cacheGate.pending)).toBe(true);
  await page.getByRole("button", { name: "Cancel request" }).click();
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText("Course data loaded from durable cache.")).toBeVisible();
  await releaseCacheGate(page);
  await page.clock.fastForward(5_000);
  await expect(page.getByText("Course data loaded from durable cache.")).toBeVisible();
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
  { name: "empty response", body: '{"elements":[]}', expected: /No discovery results/ },
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
  await expect(page.getByText(/raw discovery entities loaded/)).toBeVisible({ timeout: 5000 });
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
  await page.getByRole("button", { name: "Load raw detail" }).click();
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
  await page.getByRole("button", { name: "Load raw detail" }).click();
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
  await page.getByRole("button", { name: "Load raw detail" }).click();
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
      await expect(page.getByText("Loading discovery results.", { exact: true })).toBeVisible();
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
    await expect(page.getByRole("button", { name: "Load raw detail", exact: true })).toBeVisible();
    await expect(page.getByTestId("hole-vector-map")).toHaveCount(0);
    await page.getByRole("button", { name: "Load raw detail", exact: true }).click();
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
  return JSON.parse(await page.evaluate(() => (window as typeof window & { __ctcLastBlob: Promise<string> }).__ctcLastBlob));
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
  await expect(page.getByRole("heading", { name: "Synthetic course entities", exact: true })).toBeVisible();
  await expect(page.getByRole("combobox", { name: /^Hole/ })).toHaveValue("way/9000060101");
  await expect(page.getByText("No clubs added.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download Raw GIS Source (ODbL)", exact: true })).toBeDisabled();
  await expectProjectDirty(page, false);
  await page.getByRole("button", { name: "Add club", exact: true }).click();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Search courses", exact: true }).click();
  await expect(page.getByText("Replacement cancelled. Existing course, project and selection were retained.", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Synthetic course entities", exact: true })).toBeVisible();
  await expect(page.getByLabel("Club name", { exact: true })).toHaveValue("Club 1");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Search courses", exact: true }).click();
  await page.getByRole("button", { name: "Load raw detail", exact: true }).click();
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
  await expect(page.getByRole("heading", { name: "Synthetic course entities", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Load raw detail", exact: true })).toHaveCount(0);
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
    await page.getByRole("button", { name: "Load raw detail" }).click();
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
    await expect(page.getByText("Loading detail results.")).toBeVisible();
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

  await page.getByRole("button", { name: "Load raw detail" }).click();
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
  await expect(page.getByText("Loading discovery results.")).toBeVisible();
  await assertAxe(page);
  resolveRequest?.();
  await expect(page.getByText("Synthetic Municipal Course")).toBeVisible();
  await assertAxe(page);
  const detailButton = page.getByRole("button", { name: "Load raw detail" });
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
  await page.getByRole("button", { name: "Load raw detail" }).click();

  const map = page.getByTestId("hole-vector-map");
  await expect(map).toBeVisible();
  await expect(page.getByText("Course data © OpenStreetMap contributors.")).toBeVisible();
  for (const layer of ["vegetation", "generic-water", "golf-water", "rough", "fairway", "bunker", "green", "tee", "route", "measurement", "fairway-width", "dispersion"]) {
    await expect(map.locator(`[data-layer="${layer}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-layer="vegetation"] circle')).toHaveCount(0);
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
  await page.getByRole("button", { name: "Load raw detail" }).click();

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

test("keeps club profile and dispersion selections transient across reload", async ({ page }) => {
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Load raw detail" }).click();
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
  await page.getByRole("button", { name: "Load raw detail" }).click();
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
  await page.getByRole("button", { name: "Load raw detail" }).click();

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
      await expect(page.getByRole("button", { name: "Load raw detail" })).toHaveCount(2);
    };
    const choose = async (index: number) => page.getByRole("button", { name: "Load raw detail" }).nth(index).click();
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
    await page.getByRole("button", { name: "Load raw detail" }).click();
    await expect(page.getByText(/Selected course evidence is missing or ambiguous/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Export project", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Load raw detail" })).toBeEnabled();
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
    await page.getByRole("button", { name: "Load raw detail" }).nth(0).click();
    await expect(page.getByText(/Selected course:.*\(way\/9000060000\)/)).toBeVisible();
    await page.getByRole("button", { name: "Search courses" }).click();
    await page.getByRole("button", { name: "Load raw detail" }).nth(1).click();
    await expect(page.getByText(/Selected course:.*\(way\/9000060001\)/)).toBeVisible();
    expect(detailRequests).toBe(2);
    await expect(page.getByRole("button", { name: "Export project", exact: true })).toBeEnabled();
  });
}
