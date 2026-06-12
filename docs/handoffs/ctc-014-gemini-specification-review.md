# CTC-014 Gemini specification critical review

Date: 2026-06-12

## Review verdict

Gemini's response is relevant but not implementation-ready. It correctly
identifies `jspdf@4.2.1` plus `svg2pdf.js@2.7.0` as the leading browser-native
vector-pipeline hypothesis, keeps generation local, rejects Canvas as the
normal vector path, recognizes the OSM attribution and CTC-020 release gate,
and proposes layered structural and rendered-page regression checks.

The response also uses an outdated PDFKit version, invents malformed
fixture/runtime contracts and nonexistent repository paths, supplies bundle
figures without the required reproducible measurement, overstates SVG/font
support, proposes destructive text sanitization, and defines tests that cannot
prove vector preservation or deterministic cleanup. The accepted and corrected
decisions below are the sole baseline for Claude adversarial QA planning. No
dependency, feature branch, experiment implementation, or production PDF
behavior is authorized until Claude's findings are critically reviewed.

## Primary-source verification

Checked on 2026-06-12:

- npm reports current versions and MIT licenses:
  - `pdfkit@0.19.1`, unpacked package size 8,433,024 bytes:
    <https://www.npmjs.com/package/pdfkit>
  - `jspdf@4.2.1`, unpacked package size 30,192,058 bytes:
    <https://www.npmjs.com/package/jspdf>
  - `svg2pdf.js@2.7.0`, unpacked package size 2,565,202 bytes:
    <https://www.npmjs.com/package/svg2pdf.js>
  - `svg-to-pdfkit@0.1.8`, unpacked package size 4,200,055 bytes:
    <https://www.npmjs.com/package/svg-to-pdfkit>
- PDFKit `0.19.1` was released on 2026-06-10 and fixes an `0.19.0` RGB JPEG
  regression. PDFKit documents browser use through Browserify, webpack, or its
  prebuilt standalone file and requires an output stream such as
  `blob-stream` for browser Blob output:
  <https://github.com/foliojs/pdfkit/releases/tag/v0.19.1>
  <https://github.com/foliojs/pdfkit>
- jsPDF `4.2.1` was released on 2026-03-17 and fixes two security issues. Its
  official README documents modern ESM/browser builds, warns to sanitize user
  input, states that Standard 14 fonts are limited to an ASCII codepage, and
  documents optional dependencies for unused APIs such as `html`:
  <https://github.com/parallax/jsPDF/releases/tag/v4.2.1>
  <https://github.com/parallax/jsPDF>
- The jsPDF advisories relevant to `4.2.1` include patched HTML-output
  injection and PDF-object injection. The experiment must avoid annotation,
  AcroForm, JavaScript, HTML, image, and new-window output APIs rather than
  treating arbitrary character stripping as a complete defense:
  <https://github.com/parallax/jsPDF/security/advisories/GHSA-wfv2-pwc8-crg5>
  <https://github.com/parallax/jsPDF/security/advisories/GHSA-7x6v-j9x4-qf24>
- `svg2pdf.js@2.7.0` was released on 2026-01-03 with jsPDF 4.x compatibility.
  Its README says it is imperfect, requires fonts to be registered before
  conversion for non-basic characters, and notes that its own reference-PDF
  tests may differ across machines because of text measurement:
  <https://github.com/yWorks/svg2pdf.js/releases/tag/v2.7.0>
  <https://github.com/yWorks/svg2pdf.js>
- `svg-to-pdfkit@0.1.8` was last published on 2019-11-24. Its README documents
  broad SVG support but explicitly lists unsupported filters,
  `foreignObject`, `vector-effect`, and some text behavior and warns that bugs
  exist:
  <https://github.com/alafr/SVG-to-PDFKit>

The npm unpacked sizes above are not browser bundle sizes. Actual Vite
production bundle delta, generated PDF size, and transitive production
dependency/license impact remain experiment measurements.

## Accepted Gemini decisions

- Use browser-local generation only, with no upload, remote font/image fetch,
  basemap/provider call, external asset tracking, account, server, or analytics.
- Treat `jspdf@4.2.1` plus `svg2pdf.js@2.7.0` as the leading experiment
  hypothesis because it is browser-oriented, ESM-compatible, and reuses the
  current declarative SVG surface.
- Compare that hypothesis against current `pdfkit@0.19.1` plus
  `svg-to-pdfkit@0.1.8`, direct drawing, browser print-to-PDF, and
  Canvas/raster output. Canvas remains a negative control or explicitly
  labeled fallback, not acceptable vector success.
- Use Standard 14 Helvetica only for the first isolated ASCII fixture, while
  recording that it does not satisfy general Unicode or future
  user-authored-note requirements.
- Preserve OSM attribution as searchable text, including:
  `Course geometry and map data © OpenStreetMap contributors.` and the full
  printed URL `https://www.openstreetmap.org/copyright`.
- Use layered regression evidence: structural PDF checks plus a pinned
  rendered-page comparison. Do not rely on byte-identical PDFs.
- Require exact dependency pins, license/notice review, production SBOM,
  vulnerability audit, and `THIRD_PARTY_NOTICES.md` updates before any
  production dependency adoption.

## Rejected or corrected Gemini decisions

- Reject `pdfkit@0.19.0`; the current version is `0.19.1`.
- Reject the claimed `~250 KB`, `~320 KB`, `~1.2 MB`, and `~1.3 MB` browser
  bundle sizes. No reproducible Vite builds were run. npm unpacked size is also
  not bundle size.
- Reject claiming `svg2pdf.js` has full or native support for the current SVG
  surface before testing every used primitive, clipping rule, CSS class,
  dash, text, paint-order, and grouped interactive marker. Upstream explicitly
  says conversion is imperfect.
- Reject the fabricated hole-14 JSON, pin flag, `carryArcs`, malformed empty
  arrays, invented geometry, colors, and layout. The experiment must derive
  normalized hole 1 from `fixtures/overpass/synthetic-golf-course-ctc006.json`
  through `normalizeGolfCourse`, `createProjection`, and existing render
  contracts. Static project state must match `ProjectV1`, `TargetV1`,
  `CarryV1`, and `HoleStateV1`.
- Reject rendering directly from the interactive `HoleMap` DOM without a
  decision. It contains focus hit targets, keyboard crosshair, measurement
  state, ARIA-only semantics, and controls that do not belong in a fixture PDF.
  Define a pure export-scene boundary reusing geometry/projection data and
  reviewed visual styles.
- Reject A4 portrait and landscape as silently final. Claude must select the
  exact experiment page size and orientation. The experiment needs one selected
  paper size, not a production print-settings matrix.
- Reject scaling the full 800 by 600 interactive SVG to consume the whole
  printable area. The one-page fixture must reserve deterministic space for
  title/summary, map, yardage table, static fixture note, disclaimer, and
  attribution.
- Reject fixed lower-right attribution coordinates and exact colors/font sizes
  until the selected page layout is resolved and tested for clipping and
  readability.
- Reject claiming built-in Helvetica is embedded, universally identical, or a
  future Unicode solution. jsPDF states Standard 14 fonts are limited to an
  ASCII codepage. The fixture must use ASCII-only static content or prove every
  required glyph; the OSM copyright symbol requires an explicit tested policy.
- Reject stripping `/`, parentheses, brackets, angle brackets, or other normal
  text characters. Text must be passed through the chosen library's safe text
  API and bounded as plain text. The experiment must not invoke annotations,
  AcroForms, JavaScript, HTML, imported image, attachment, or new-window output
  APIs.
- Reject a sandboxed rich-text parser; CTC-014 uses fixed static fixture text
  only and adds no rich-text or user-authored notes model.
- Reject immediate object-URL revocation and garbage-collection assertions.
  Cleanup timing must follow a deterministic tested lifecycle that does not
  revoke before download/preview use, and tests can assert revocation calls but
  not garbage collection.
- Reject unspecified PDF.js and PDF parser additions. Any test-only tool is a
  dependency requiring exact pinning, license/security review, and explicit
  authorization. Prefer existing Playwright Chromium PDF rendering only if it
  is reliable and can be proven network-isolated; otherwise Claude must name
  the minimal reviewed test tool.
- Reject binary text scanning as a reliable attribution/metadata assertion when
  streams may be compressed or encoded. Use a reviewed structural parser or a
  deterministic library-level export scene assertion plus rendered evidence.
- Reject claiming Canvas-rendered output proves vector element presence. Vector
  preservation requires PDF-structure/content-stream evidence, not only pixels.
- Reject mandatory compression headers, static creation timestamp, exact vector
  count, `0.05%` screenshot threshold, and memory profiling. These values are
  unsupported and some conflict with library/environment behavior.
- Reject saying CTC-008 cannot merge. The binding rule is that
  distributed/shared PDF export cannot ship without CTC-020 raw GIS source
  availability in the same release.
- Reject invented `src/components`, `src/experiments/.../index.html`,
  `tests/visual`, and `feature/ctc-014-pdf-evaluation`. Existing tests live
  beside source and under `test/e2e`; branch name and exact files must follow
  the reviewed experiment design.

## Corrected specification baseline

### Evaluation outcome and dependency gate

- CTC-014 must run one isolated, fixture-only experiment before recommending a
  final library for later adoption.
- Leading hypothesis: exact-pinned `jspdf@4.2.1` and `svg2pdf.js@2.7.0`.
- Required fallback comparison: exact-pinned `pdfkit@0.19.1` and
  `svg-to-pdfkit@0.1.8`.
- Required negative/control comparisons: direct drawing, browser print-to-PDF,
  and Canvas/raster.
- No option is adopted until measured evidence proves fixture fidelity,
  vector preservation, browser/Vite compatibility, file size, bundle delta,
  font behavior, print layout, security constraints, license posture, and
  deterministic test feasibility.
- Any experiment dependency must be isolated on the later reviewed experiment
  branch. Moving a package to production dependencies is a separate reviewed
  decision after CTC-014 evidence.

### Fixture and export-scene boundary

- Load `fixtures/overpass/synthetic-golf-course-ctc006.json`, validate and
  normalize it through the existing contracts, and select exact hole source key
  `way/9000060101`.
- Use deterministic fixture project state matching current types:
  - one free geographic target with valid `t-...` ID and ASCII label;
  - one tee-origin carry record with valid `c-...` ID and distances `[150]`;
  - static ASCII fixture note text held only in the experiment fixture;
  - no persistent/user-authored notes model and no imported project file.
- Build a pure, serializable export-scene model from current normalized
  geometry, `createProjection`, project state, and carry helpers. Do not scrape
  or export the interactive DOM and do not include hit targets, crosshair,
  measurement anchors, controls, ARIA-only elements, or unassociated features.
- Preserve deterministic layer order and style intent from current SVG/CSS.
  The experiment must explicitly record any unsupported primitive/style and
  whether it is converted, simplified for export, or rasterized. Silent drops
  fail the experiment.

### Page and content

- Produce exactly one PDF page at one Claude-selected paper size/orientation.
- Reserve deterministic regions for:
  - fixture title/course/hole summary;
  - vector map geometry with route, selected associated features, carry ring,
    target marker, and yardage labels;
  - a small yardage table derived from deterministic fixture values;
  - static fixture note text;
  - baseline accuracy disclaimer;
  - visible OSM attribution and full printed copyright URL.
- Use PDF points for physical layout and an explicit aspect-preserving transform
  from the existing 800 by 600 logical viewBox into the map region.
- Define measurable bounds for margins, clipping, minimum stroke width,
  minimum text size, and allowed physical-position variance. Do not claim print
  precision beyond what the generated PDF and selected renderer/printer can
  prove.

### Fonts and text

- First experiment uses only a reviewed Standard 14 font path and fixed fixture
  text. Claude must resolve how the required copyright symbol is represented
  and verified.
- Do not fetch fonts. Any future embedded font requires project-controlled
  bytes, license/notice review, exact glyph/metric tests, bundle/file-size
  measurement, and explicit adoption approval.
- Pass bounded plain text through safe library text APIs. Do not use HTML,
  annotations, AcroForms, JavaScript, attachments, imported images, or
  new-window output methods.

### Measurement evidence

For each candidate pipeline, capture:

- exact package versions, lockfile/transitive tree, licenses/notices, audit
  result, and npm unpacked sizes;
- clean Vite production build output and delta from the same baseline;
- generated PDF byte size;
- generation success/failure in the pinned Playwright Chromium environment;
- page count and physical page box;
- visible/readable required text and attribution;
- supported, changed, rasterized, or silently dropped fixture elements;
- PDF content-stream evidence that map paths/strokes/text remain vector where
  required;
- generated-page rendered image and measured layout/clipping evidence;
- deterministic behavior across repeated runs, distinguishing stable semantic
  output from varying metadata/object ordering.

### Regression and security

- Unit-test pure export-scene construction, page-region transforms, bounds,
  content ordering, static note/disclaimer/attribution presence, and rejection
  of invalid scene values.
- Structural PDF tests must use a specifically reviewed mechanism that can
  inspect page boxes, text, and content streams. Do not use raw binary substring
  assumptions.
- Rendered regression must use one pinned renderer/environment and a tolerance
  derived from observed repeat runs, not an invented universal threshold.
- Tests remain network-isolated and must fail on any request.
- No remote assets, imported HTML, dynamic code, annotations, forms, scripts,
  attachments, user-controlled output options, or unbounded image data.
- Object URL/download behavior, if included in the experiment, must reuse the
  reviewed local-download lifecycle and test explicit cleanup calls.

## Remaining questions for Claude

1. Select the exact single paper size/orientation, margins, content regions,
   minimum text/stroke sizes, and physical-layout tolerances for the fixture.
2. Resolve whether the experiment should compare both dependency pairs in one
   branch or use temporary package archives/build worktrees to avoid retaining
   both trees.
3. Define the exact export-scene TypeScript shape and mapping for every current
   SVG layer, target, carry ring, label, scale bar, disclaimer, and attribution.
4. Resolve the required copyright-symbol/font behavior under Standard 14
   Helvetica and whether a project-controlled font is needed for the
   experiment.
5. Select the minimum reviewed PDF structural-inspection and rendered-page
   tools, exact pinning/licensing requirements, and network-isolated CI path.
6. Define vector-preservation proof, repeated-run semantic stability method,
   screenshot tolerance derivation, and artifact-retention expectations.
7. Define objective pass/fail thresholds that produce CTC-014's final library
   recommendation without silently adopting the dependency.
8. Identify all remaining security, license, attribution, accessibility,
   observability, and scope-leakage blockers.

## Claude QA-planning red lines

Treat these as blockers:

- implementing production CTC-008 export UI or CTC-020 raw source export;
- installing/adopting a production dependency before measured CTC-014 evidence;
- fabricated fixtures/types/paths, DOM scraping, unassociated-feature export,
  real-course data, or persistent/user-authored notes;
- silent vector/style drops, Canvas-only success, or claims of vector output
  without structural proof;
- remote fonts/images/assets, network calls, HTML, annotations, forms,
  JavaScript, attachments, imported binary assets, or user-controlled output
  options;
- destructive text sanitization, hidden/missing attribution or disclaimer, or
  treating CTC-020 as satisfied;
- unreviewed PDF parser/renderer/test dependencies, unmeasured bundle claims,
  brittle binary/byte equality, invented visual thresholds, or GC assertions;
- AGPL/unlicensed reference-project reuse, providers, API keys, accounts,
  servers, durable cache, analytics, or external user-data flows.
