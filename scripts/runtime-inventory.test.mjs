import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { build } from "vite";
import configFactory from "../vite.config.ts";
import { runtimeInventory } from "./runtime-inventory.mjs";

test("real bundle rejects dev-only runtime packages, including dynamic chunks", async () => {
  const root = mkdtempSync(join(tmpdir(), "ctc-runtime-"));
  const write = (path, value) => writeFileSync(join(root, path),
    typeof value === "string" ? value : JSON.stringify(value));
  const run = () => build({ root, configFile: false, logLevel: "silent", plugins: [runtimeInventory()],
    build: { write: false, minify: true, rollupOptions: { input: join(root, "index.html") } } });
  try {
    mkdirSync(join(root, "node_modules/unreviewed"), { recursive: true });
    write("index.html", '<script type="module" src="/main.js"></script>');
    write("main.js", 'import("unreviewed").then(m => console.log(m.value));');
    write("node_modules/unreviewed/package.json", { name: "unreviewed", version: "1.0.0", main: "index.js" });
    write("node_modules/unreviewed/index.js", "export const value = 42;");
    const lock = { packages: { "node_modules/unreviewed": { version: "1.0.0", dev: true } } };
    write("package-lock.json", lock);
    await assert.rejects(run, /Runtime package omitted by production compliance: node_modules\/unreviewed/);
    // The same emitted package is admitted only once production tools include it.
    delete lock.packages["node_modules/unreviewed"].dev;
    write("package-lock.json", lock);
    const result = await run();
    assert.ok(!Array.isArray(result) && "output" in result);
    const asset = result.output.find(item => item.fileName === ".vite/runtime-dependencies.json");
    assert.ok(asset && asset.type === "asset");
    const inventory = JSON.parse(String(asset.source));
    assert.deepEqual(inventory.packages, [{ path: "node_modules/unreviewed", name: "unreviewed", version: "1.0.0" }]);
    assert.ok(Object.values(inventory.chunks).some(paths => paths.includes("node_modules/unreviewed")));
    write("main.js", 'import { value } from "unreviewed"; console.log(value);');
    write("package-lock.json", { packages: { "node_modules/unreviewed": { version: "1.0.0", dev: true } } });
    await assert.rejects(run, /Runtime package omitted by production compliance/);
    write("main.js", 'import("https://example.invalid/runtime.js").then(console.log);');
    await assert.rejects(run, /External dynamic imports are not covered/);
    write("main.js", 'import(/* @vite-ignore */ "https://example.invalid/a${0}.js");');
    await assert.rejects(run, /External dynamic imports are not covered/);
    write("main.js", 'const url = globalThis.runtimeModuleUrl || "https://example.invalid/runtime.js"; import(url);');
    await assert.rejects(run, /Computed runtime imports are not covered/);
    write("node_modules/unreviewed/data.txt", "unreviewed package content");
    write("main.js", 'console.log(new URL("./node_modules/unreviewed/data.txt?inline", import.meta.url).href);');
    await assert.rejects(run, /Asset URL construction is not covered/);
    write("main.js", 'import "./styles.css";');
    write("styles.css", '@import "unreviewed/style.css";');
    write("node_modules/unreviewed/style.css", 'body { color: red; }');
    await assert.rejects(run, /CSS dependency syntax is not covered/);
    write("styles.css", 'body { background: url("unreviewed/icon.svg"); }');
    write("node_modules/unreviewed/icon.svg", '<svg xmlns="http://www.w3.org/2000/svg"><rect width="2" height="2"/></svg>');
    await assert.rejects(run, /CSS dependency syntax is not covered/);
    write("main.js", 'console.log("app");');
    for (const tag of [
      '<img src="/node_modules/unreviewed/icon.svg">',
      '<link rel="icon" imagesrcset="/node_modules/unreviewed/icon.svg">',
      '<meta property="og:image" content="/node_modules/unreviewed/icon.svg">'
    ]) {
      write("index.html", '<script type="module" src="/main.js"></script>' + tag);
      await assert.rejects(run, /HTML (?:elements and attributes|metadata) must remain bootstrap/);
    }
    write("index.html", '<script data-type="module" src="https://example.invalid/runtime.js"></script>');
    await assert.rejects(run, /Production HTML scripts must be local module bootstraps/);
    write("index.html", '<script type="module" src="/&#47;example.invalid/runtime.js"></script>');
    await assert.rejects(run, /Production HTML scripts must be local module bootstraps/);
    write("index.html", `<body onload="import('https://example.invalid/runtime.js')"><script type="module" src="/main.js"></script></body>`);
    await assert.rejects(run, /HTML elements and attributes must remain bootstrap/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});


test("production config rejects inline and emitted worker graphs", async () => {
  const root = mkdtempSync(join(tmpdir(), "ctc-worker-"));
  try {
    writeFileSync(join(root, "index.html"), '<script type="module" src="/main.js"></script>');
    writeFileSync(join(root, "worker.js"), 'self.onmessage = () => self.postMessage("worker");');
    const config = configFactory({ command: "build", mode: "production" });
    for (const suffix of ["?worker&inline", "?worker"]) {
      writeFileSync(join(root, "main.js"), `import Worker from "./worker.js${suffix}"; new Worker();`);
      await assert.rejects(() => build({ ...config, root, configFile: false, logLevel: "silent",
        build: { ...config.build, write: false } }), /Production worker builds require separate dependency provenance/);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});


test("production admits only the approved jsPDF browser module and retains other PDF bans", () => {
  const config = configFactory({ command: "build", mode: "production" });
  const boundary = config.plugins.find(plugin => plugin?.name === "exclude-production-experiments");
  const check = id => boundary.generateBundle.call({ getModuleIds: () => [id], error: message => { throw new Error(message); } });
  check("/repo/node_modules/jspdf/dist/jspdf.es.min.js");
  for (const id of ["jspdf/dist/jspdf.node.min.js", "jspdf/dist/jspdf.umd.min.js", "pdfjs-dist/build/pdf.mjs", "pdfkit/js/pdfkit.js", "svg2pdf.js/dist/svg2pdf.es.min.js", "svg-to-pdfkit/source.js", "blob-stream/index.js"]) {
    assert.throws(() => check(`/repo/node_modules/${id}`), /forbidden|Only the approved/);
  }
  assert.throws(() => check("/repo/src/ctc008Pdf.ts"), /forbidden/);
});
