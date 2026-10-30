import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { test } from "node:test";
import { dependencyLicenseText, productionLicenses } from "./production-licenses.mjs";

test("distribution includes every reviewed production license and both Pako licenses", () => {
  const text = dependencyLicenseText(process.cwd());
  for (const [name, [version]] of Object.entries(productionLicenses)) assert.ok(text.includes(`${name}@${version}`));
  assert.ok(text.includes("lib/zlib/README"));
  assert.ok(text.includes("Apache License"));
  assert.ok(text.includes("Copyright (c) 2016 Stoyan Stefanov"));
});
test("license packaging rejects missing, extra or changed production packages", () => {
  const root = mkdtempSync(resolve(tmpdir(), "ctc-license-"));
  try {
    const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
    delete lock.packages["node_modules/jspdf"];
    writeFileSync(resolve(root, "package-lock.json"), JSON.stringify(lock));
    assert.throws(() => dependencyLicenseText(root), /closure requires review/);
    lock.packages["node_modules/jspdf"] = { version: "4.2.2" };
    writeFileSync(resolve(root, "package-lock.json"), JSON.stringify(lock));
    writeFileSync(resolve(root, "THIRD_PARTY_NOTICES.md"), "notices");
    // Version failure is checked before any filesystem license reads.
    const first = Object.keys(lock.packages).find(path => path && !lock.packages[path].dev && !lock.packages[path].devOptional);
    mkdirSync(resolve(root, first), { recursive: true });
    lock.packages[first].version = "0.0.0";
    writeFileSync(resolve(root, "package-lock.json"), JSON.stringify(lock));
    assert.throws(() => dependencyLicenseText(root), /Unreviewed production license version/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
