# CTC-014 vector PDF evaluation

Date: 2026-06-12

## Decision

Recommend direct drawing with `jspdf@4.2.1` for a later production-adoption
review. The typed export scene is the rendering contract; production code must
not scrape `HoleMap` DOM. `svg2pdf.js@2.7.0` remains a viable translation
option if a later task proves that maintaining direct primitive mapping is more
costly than its extra dependency and SVG-compatibility risk.

Do not recommend the tested PDFKit paths. Both `pdfkit@0.19.1` direct drawing
and `svg-to-pdfkit@0.1.8` translation failed in the current Vite browser build
because `blob-stream@0.1.3` requires the unavailable Node-style `global`
object. Vite also externalized Node `stream`, `zlib`, `fs`, `util`, `assert`,
and `buffer` imports. Adding browser polyfills was not authorized and would
increase complexity and bundle size. `svg-to-pdfkit` also fails the maintenance
recommendation gate.

This decision does not adopt a production dependency or ship PDF export.
CTC-008 remains blocked from release until CTC-020 raw GIS source availability
ships in the same release. CTC-014 uses static fixture text only and does not
add a persistent notes model.

## Fixture experiment

The isolated `/ctc014.html` entry constructs a pure export scene from
`fixtures/overpass/synthetic-golf-course-ctc006.json`, normalized hole
`way/9000060101`, course `way/9000060001`, tee `way/9000060201`, one fixed
target, and one fixed 150-yard tee carry.

The one-page fixture is US Letter portrait, 612 by 792 points, with 36-point
margins. It contains projected point, line, and polygon geometry; required
dash distinctions; route, target, carry, scale bar, yardage row, static note,
disclaimer, visible attribution, and the full printed URL
`https://www.openstreetmap.org/copyright`. It makes no network requests and
imports no production app entry.

## Measured results

| Candidate | Browser result | PDF bytes | Pages / box | Searchable required text | Vector / raster evidence |
| --- | --- | ---: | --- | --- | --- |
| `jspdf@4.2.1` direct draw | Pass | 9,739 | 1 / 612 x 792 pt | Pass, including © and scale bar | 12 PDF.js path operations; 0 image operations |
| `jspdf@4.2.1` + `svg2pdf.js@2.7.0` | Pass | 10,524 | 1 / 612 x 792 pt | Pass, including © and scale bar | 13 PDF.js path operations; 0 image operations |
| `pdfkit@0.19.1` direct draw | Fail | Not produced | Not produced | Not measured | Browser runtime error: `global is not defined` |
| `pdfkit@0.19.1` + `svg-to-pdfkit@0.1.8` | Fail | Not produced | Not produced | Not measured | Browser runtime error: `global is not defined` |
| Canvas/raster | Rejected control | Not measured | Not measured | Not acceptable | Fails vector requirement by definition |
| Browser print-to-PDF | Deferred control | Not measured | Not measured | Browser-dependent | Not a recommended project-controlled pipeline |

The direct jsPDF structural result was stable across five consecutive runs:
page count, page box, extracted text, path-operation count, and image-operation
count were identical. The focused Playwright test blocks all non-localhost
requests. PDF.js inspection uses a locally bundled worker.

The direct jsPDF path preserves the four-element carry dash intent. The scene
test fixes the logical pattern at `[12, 5, 3, 5]`, and PDF.js structural
inspection confirms jsPDF emits the scaled four-element PDF dash operator
`[8, 10/3, 2, 10/3]`. This is valid alternating on/off PDF dash syntax and is
not silently simplified to a two-element pattern.

The initial SVG experiment silently omitted the scale bar. The test caught the
drop; the SVG scene was corrected and the final result includes searchable
scale text plus a vector line. This demonstrates why export-scene fidelity and
structural assertions are both required.

## Build and dependency evidence

The clean production app baseline was approximately 237.06 kB minified and
74.88 kB gzip. With the isolated experiment retained, the production app entry
remains separate at 226.77 kB minified and 71.59 kB gzip. The isolated
experiment adds:

- experiment entry: 919.02 kB minified, 283.20 kB gzip;
- dynamically loaded PDFKit chunk: 559.69 kB minified, 218.68 kB gzip;
- local PDF.js worker: 1,245.44 kB.

These combined-build figures are not per-candidate production bundle claims.
They demonstrate that the experiment is isolated and that PDFKit plus PDF.js
inspection impose substantial research-only weight.

| Exact package | License | npm unpacked size | Registry modified |
| --- | --- | ---: | --- |
| `jspdf@4.2.1` | MIT | 30,192,058 bytes | 2026-03-17 |
| `svg2pdf.js@2.7.0` | MIT | 2,565,202 bytes | 2026-01-03 |
| `pdfkit@0.19.1` | MIT | 8,433,024 bytes | 2026-06-10 |
| `svg-to-pdfkit@0.1.8` | MIT | 4,200,055 bytes | 2022-06-27 |
| `pdfjs-dist@6.0.227` | Apache-2.0 | 35,550,455 bytes | 2026-05-30 |
| `blob-stream@0.1.3` | MIT | Not reported | 2022-06-13 |

All experiment packages are exact-pinned devDependencies. No PDF package is a
production dependency. The full installed license summary contains MIT, ISC,
Apache-2.0, BSD, MPL-2.0, BlueOak-1.0.0, CC0-1.0, CC-BY-3.0, Zlib, and 0BSD
expressions; it contains no GPL, AGPL, or UNLICENSED result. The canonical
production allowlist remains unchanged and passes.

`npm audit --omit=dev --audit-level=high` reports zero production
vulnerabilities. The dev-inclusive audit reports nine existing findings: two
moderate, four high, and three critical. Every reported path is through the
pre-existing `@cyclonedx/cyclonedx-npm@2.1.0` toolchain, not a newly installed
PDF candidate. Upgrading that tool remains separately recorded future work.

## Visual regression strategy

Production PDF work should use three layers:

1. Pure export-scene assertions for stable source identities, layer counts,
   layout bounds, non-color distinctions, and required text.
2. PDF.js structural inspection for one-page MediaBox, extracted required
   text, vector path operations, and absence of raster map images.
3. A PDF.js canvas render at a pinned worker/browser version compared with a
   reviewed fixture-page snapshot. Derive the narrowest stable pixel tolerance
   from repeated identical runs; do not use byte-identical PDF assertions or
   inflate tolerance to hide nondeterminism.

CTC-014 proves the first two layers and five-run structural stability. A
production-adoption task must add the reviewed rendered-page snapshot before
shipping PDF behavior.

## Production adoption gate

Before direct jsPDF can move from experiment devDependency to production
dependency:

- obtain Claude final-audit acceptance of this evaluation;
- open a separate reviewed adoption scope;
- update `THIRD_PARTY_NOTICES.md`, production SBOM, license evidence, and
  security review for the exact adopted tree;
- preserve plain-text attribution and full printed OSM copyright URL;
- keep generation browser-local with no remote fonts, images, uploads,
  executable PDF content, annotations, forms, or imported HTML;
- implement and verify CTC-020 in the same release as distributed/shared PDF
  export under CTC-008.
