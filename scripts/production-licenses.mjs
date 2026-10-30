import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Approved #49/#51 production closure. A new version/package needs fresh review.
export const productionLicenses = {
  "@babel/runtime": ["7.29.7", "LICENSE"], "@types/pako": ["2.0.4", "LICENSE"],
  "@types/raf": ["3.4.3", "LICENSE"], "@types/trusted-types": ["2.0.7", "LICENSE"],
  "base64-arraybuffer": ["1.0.2", "LICENSE"], canvg: ["3.0.11", "LICENSE"],
  "core-js": ["3.49.0", "LICENSE"], "css-line-break": ["2.1.0", "LICENSE"],
  dompurify: ["3.4.17", "LICENSE"], "fast-png": ["6.4.0", "LICENSE"],
  fflate: ["0.8.3", "LICENSE"], html2canvas: ["1.4.1", "LICENSE"],
  iobuffer: ["5.4.0", "LICENSE"], jspdf: ["4.2.1", "LICENSE"],
  pako: ["2.1.0", "LICENSE", "lib/zlib/README"], "performance-now": ["2.1.0", "license.txt"],
  raf: ["3.4.1", "LICENSE"], react: ["19.2.7", "LICENSE"], "react-dom": ["19.2.7", "LICENSE"],
  "regenerator-runtime": ["0.13.11", "LICENSE"], rgbcolor: ["1.0.1", "LICENSE.md"],
  scheduler: ["0.27.0", "LICENSE"], "stackblur-canvas": ["2.7.0", "LICENSE-MIT.txt"],
  "svg-pathdata": ["6.0.3", "LICENSE"], "text-segmentation": ["1.0.3", "LICENSE"], utrie: ["1.0.2", "LICENSE"],
};
export function dependencyLicenseText(root) {
  const lock = JSON.parse(readFileSync(resolve(root, "package-lock.json"), "utf8"));
  const production = Object.entries(lock.packages).filter(([path, entry]) => path && !entry.dev && !entry.devOptional && !entry.link);
  assert.deepEqual(production.map(([path]) => path).sort(), Object.keys(productionLicenses).map(name => `node_modules/${name}`).sort(), "Production license closure requires review");
  let text = readFileSync(resolve(root, "THIRD_PARTY_NOTICES.md"), "utf8") + "\n\nComplete dependency license texts\n";
  for (const [path, entry] of production) {
    const name = path.slice("node_modules/".length);
    const [version, ...files] = productionLicenses[name];
    assert.equal(entry.version, version, `Unreviewed production license version: ${name}`);
    assert.equal(JSON.parse(readFileSync(resolve(root, path, "package.json"))).version, version, `Installed license version mismatch: ${name}`);
    text += `\n${name}@${version}\n`;
    for (const file of files) text += `\n--- ${file} ---\n${readFileSync(resolve(root, path, file), "utf8")}\n`;
  }
  return text;
}
export function productionLicenseAsset() {
  let root;
  return { name: "approved-production-licenses", configResolved(config) { root = config.root; },
    generateBundle() { this.emitFile({ type: "asset", fileName: "dependency-licenses.txt", source: dependencyLicenseText(root) }); } };
}
