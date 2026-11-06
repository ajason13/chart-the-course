import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const script = fileURLToPath(new URL("./verify-scaffold.mjs", import.meta.url));
const root = new URL("../", import.meta.url);
const workflow = readFileSync(new URL(".github/workflows/ci.yml", root), "utf8").replace(/\r\n/g, "\n");

for (const [name, newline] of [["LF", "\n"], ["CRLF", "\r\n"]]) {
  test(`scaffold accepts ${name} and still rejects unsafe workflow settings`, () => {
    const directory = mkdtempSync(join(tmpdir(), "ctc-scaffold-"));
    try {
      mkdirSync(join(directory, ".github/workflows"), { recursive: true });
      for (const path of ["package.json", "package-lock.json", "index.html"]) {
        writeFileSync(join(directory, path), readFileSync(new URL(path, root)));
      }
      const run = (text) => {
        writeFileSync(join(directory, ".github/workflows/ci.yml"), text.replace(/\n/g, newline));
        return spawnSync(process.execPath, [script], { cwd: directory, encoding: "utf8" });
      };
      const valid = run(workflow);
      assert.equal(valid.status, 0, valid.stderr);
      for (const permissions of ["", "permissions:\n  contents: write"]) {
        const invalid = run(workflow.replace("permissions:\n  contents: read", permissions));
        assert.equal(invalid.status, 1);
        assert.match(invalid.stderr, /CI must set read-only contents permissions/);
      }
      const unpinned = run(workflow.replace(/(uses:\s+[^@\s]+@)[a-f0-9]{40}/, "$1v4"));
      assert.equal(unpinned.status, 1);
      assert.match(unpinned.stderr, /GitHub Action reference must be SHA-pinned/);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}
