import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { verifyProduction } from "./verify-production.mjs";

test("production inventory rejects experiment entries, workers and bundled hooks", () => {
  const directory = mkdtempSync(join(tmpdir(), "ctc-production-"));
  const manifest = { "index.html": { file: "assets/app.js", isEntry: true } };
  const writeManifest = (value) => writeFileSync(join(directory, ".vite/manifest.json"), JSON.stringify(value));
  try {
    mkdirSync(join(directory, ".vite"));
    mkdirSync(join(directory, "assets"));
    writeFileSync(join(directory, "index.html"), "<html></html>");
    writeFileSync(join(directory, "assets/app.js"), "console.log('app');");
    writeManifest(manifest);
    verifyProduction(directory);
    writeManifest({ ...manifest, "ctc014.html": { file: "assets/ctc014.js", isEntry: true } });
    assert.throws(() => verifyProduction(directory), /only the application entry/);
    writeManifest(manifest);
    const worker = join(directory, "assets/pdf.worker.js");
    writeFileSync(worker, "worker");
    assert.throws(() => verifyProduction(directory), /Unexpected production artifact/);
    rmSync(worker);
    writeFileSync(join(directory, "assets/app.js"), "window.ctc008Experiment = {};");
    assert.throws(() => verifyProduction(directory), /Experiment code in production/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
