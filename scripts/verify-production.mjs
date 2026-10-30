import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { resolve, relative } from "node:path";
import { pathToFileURL } from "node:url";

export function verifyProduction(directory = "dist") {
  const manifest = JSON.parse(readFileSync(resolve(directory, ".vite/manifest.json"), "utf8"));
  assert.deepEqual(Object.entries(manifest).filter(([, item]) => item.isEntry).map(([key]) => key),
    ["index.html"], "Production must contain only the application entry");
  const allowed = new Set(["index.html", ".vite/manifest.json", ".vite/runtime-dependencies.json", "dependency-licenses.txt"]);
  const visited = new Set();
  function visit(key) {
    if (visited.has(key)) return;
    visited.add(key);
    const item = manifest[key];
    assert.ok(item, `Missing manifest entry: ${key}`);
    for (const file of [item.file, ...(item.css ?? []), ...(item.assets ?? [])]) allowed.add(file);
    for (const dependency of [...(item.imports ?? []), ...(item.dynamicImports ?? [])]) visit(dependency);
  }
  visit("index.html");
  assert.equal(visited.size, Object.keys(manifest).length, "Unreachable production manifest entries");
  for (const entry of readdirSync(directory, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const file = relative(resolve(directory), resolve(entry.parentPath, entry.name)).replaceAll("\\", "/");
    assert.ok(allowed.has(file), `Unexpected production artifact: ${file}`);
    assert.doesNotMatch(file, /ctc008|ctc014|worker|pdfkit|pdfjs|svg2pdf|svg-to-pdf/i, `Forbidden production artifact: ${file}`);
    if (/\.(?:html|js|css)$/.test(file)) {
      assert.doesNotMatch(readFileSync(resolve(directory, file), "utf8"),
        /ctc008Experiment|ctc014Experiment|pdf\.worker/i,
        `Experiment code in production: ${file}`);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  verifyProduction();
  console.log("Production output contains only the application and its reachable assets.");
}
