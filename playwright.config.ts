import { defineConfig, devices } from "@playwright/test";

const experimentTests = /ctc(?:008|014)-pdf\.spec\.ts/;

export default defineConfig({
  testDir: "test/e2e",
  fullyParallel: true,
  reporter: "list",
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  use: { trace: "on-first-retry" },
  webServer: [
    {
      command: "npm run preview -- --port 4173 --strictPort",
      url: "http://127.0.0.1:4173"
    },
    {
      command: "npm run preview:experiments -- --port 4174 --strictPort",
      url: "http://127.0.0.1:4174/ctc008.html"
    }
  ],
  projects: [
    {
      name: "chromium",
      testIgnore: experimentTests,
      use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:4173" }
    },
    {
      name: "experiments-chromium",
      testMatch: experimentTests,
      use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:4174" }
    }
  ]
});
