import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const script = fileURLToPath(new URL("./prepare-compliance.mjs", import.meta.url));

test("compliance preparation creates the directory and preserves existing evidence", () => {
  const directory = mkdtempSync(join(tmpdir(), "ctc-compliance-"));
  const run = () => spawnSync(process.execPath, [script], { cwd: directory, encoding: "utf8" });
  try {
    let result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.ok(statSync(join(directory, ".compliance")).isDirectory());
    const evidence = join(directory, ".compliance/audit.json");
    writeFileSync(evidence, "existing evidence");
    result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(evidence, "utf8"), "existing evidence");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("compliance preparation fails when its output path is a file", () => {
  const directory = mkdtempSync(join(tmpdir(), "ctc-compliance-"));
  try {
    writeFileSync(join(directory, ".compliance"), "blocked");
    const result = spawnSync(process.execPath, [script], { cwd: directory, encoding: "utf8" });
    assert.equal(result.status, 1, result.stderr);
    assert.equal(readFileSync(join(directory, ".compliance"), "utf8"), "blocked");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
