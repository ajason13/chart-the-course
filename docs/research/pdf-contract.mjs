// Issue #49 research only: inspect the locked candidate closure and measure
// synthetic text with jsPDF. This is not the production scene builder/renderer.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { posix } from "node:path";
import { jsPDF } from "jspdf";

const lockText = readFileSync(new URL("../../package-lock.json", import.meta.url), "utf8");
const { packages } = JSON.parse(lockText);
assert.equal(packages["node_modules/jspdf"].version, "4.2.1");
const closure = new Map();
function resolve(from, name) {
  let directory = from;
  for (;;) {
    const key = posix.join(directory, "node_modules", name);
    if (packages[key]) return key;
    if (!directory || directory === ".") throw new Error(`Missing locked dependency ${name}`);
    directory = posix.dirname(directory);
    if (directory === ".") directory = "";
  }
}
function visit(key) {
  if (closure.has(key)) return;
  const entry = packages[key];
  const dependencies = { ...entry.dependencies, ...entry.optionalDependencies };
  const children = Object.keys(dependencies).sort().map((name) => resolve(key, name));
  closure.set(key, { path: key, version: entry.version, license: entry.license, children });
  children.forEach(visit);
}
visit("node_modules/jspdf");

// Proposed dynamic text policy: ASCII or a visible code-point escape. Fixed
// attribution's copyright glyph is covered by the existing browser prototype.
function printable(input) {
  const nfc = input.normalize("NFC").replace(/[\t\n\r]/g, " ");
  if (/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069\ud800-\udfff]/u.test(nfc)) {
    throw new Error("Unsupported control, bidi control or lone surrogate");
  }
  return [...nfc].map((c) => c.codePointAt(0) <= 126
    ? c : `[U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}]`).join("");
}
const doc = new jsPDF({ unit: "pt", format: [612, 792] });
doc.setFont("Helvetica", "normal");
doc.setFontSize(10);
const cases = [
  ["title-200", "Synthetic course ".repeat(12).padEnd(200, "W").slice(0, 200)],
  ["unbroken-title-200", "W".repeat(200)],
  ["target-40", "W".repeat(40)],
  ["unicode-target-40", "😀".repeat(40)],
  ["mixed-script", "Café 東京 العربية 😀"],
  ["inert-punctuation", "<script>(/JS) \\ file://example</script>"],
];
const layout = cases.map(([name, input]) => {
  const text = printable(input);
  const lines = doc.splitTextToSize(text, 540);
  const maxWidth = Math.max(...lines.map((line) => doc.getTextWidth(line)));
  assert.ok(maxWidth <= 540.01, `${name} overflows`);
  assert.match(text, /^[\x20-\x7e]*$/);
  return { name, codePoints: [...input].length, lines: lines.length, maxWidthPt: +maxWidth.toFixed(2), text };
});
assert.equal(printable("e\u0301"), "[U+00E9]");
for (const input of ["bad\0", "bad\u202e", "bad\u2066", "bad\ud800"]) assert.throws(() => printable(input));
assert.equal(printable("😀"), "[U+1F600]");
// A worst-case authored label in a full-width 10pt table row is wrapped,
// with 14pt leading. A map page has 10 lines, a continuation has 40.
const labelLines = layout.find(({ name }) => name === "unicode-target-40").lines;
const targetAndCarryLines = 10 * labelLines + 25 * 2;
const continuationPages = Math.ceil(Math.max(0, targetAndCarryLines - 10) / 40);
assert.ok(continuationPages > 0);
console.log(JSON.stringify({
  baselineLockSha256: createHash("sha256").update(lockText).digest("hex"),
  candidateClosure: [...closure.values()].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0),
  layout,
  rowCapacityProbe: { targetAndCarryLines, continuationPages },
  limitations: "Node font metrics and synthetic row arithmetic only; no production layout, browser glyph coverage, PDF topology or release certification.",
}, null, 2));
