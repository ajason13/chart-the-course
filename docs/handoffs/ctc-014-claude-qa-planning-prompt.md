# CTC-014 Claude adversarial QA-planning handoff

## Role and gate

Act as the adversarial QA planner for CTC-014, Evaluate vector PDF export
pipeline. Critically challenge and complete the corrected evaluation baseline
before any isolated experiment is authorized. Claude Chat has no filesystem or
GitHub access; this bundle is self-contained.

Gemini produced a relevant but unsafe and internally inconsistent
specification. Treat the first embedded critical review as the sole
specification baseline. Do not write full implementation code, approve a
production dependency, implement CTC-008/CTC-020, create new epics, or broaden
scope.

## Acceptance criteria

- Compare pdfkit, jsPDF, and SVG/canvas-to-PDF approaches for browser
  compatibility, vector output, file size, fonts, and print precision.
- Produce one fixture hole page with map geometry, yardage markers, and notes.
- Define visual regression strategy for PDF output.
- Recommend final library with license and maintenance assessment.

## Current verified primary-source facts

Checked on 2026-06-12:

- npm current versions/licenses/unpacked sizes:
  - pdfkit 0.19.1, MIT, 8,433,024 bytes
  - jspdf 4.2.1, MIT, 30,192,058 bytes
  - svg2pdf.js 2.7.0, MIT, 2,565,202 bytes
  - svg-to-pdfkit 0.1.8, MIT, 4,200,055 bytes
- PDFKit 0.19.1 released 2026-06-10:
  https://github.com/foliojs/pdfkit/releases/tag/v0.19.1
- jsPDF 4.2.1 released 2026-03-17 and fixes security issues:
  https://github.com/parallax/jsPDF/releases/tag/v4.2.1
  https://github.com/parallax/jsPDF/security/advisories/GHSA-wfv2-pwc8-crg5
  https://github.com/parallax/jsPDF/security/advisories/GHSA-7x6v-j9x4-qf24
- svg2pdf.js 2.7.0 released 2026-01-03 with jsPDF 4.x compatibility:
  https://github.com/yWorks/svg2pdf.js/releases/tag/v2.7.0
- svg-to-pdfkit 0.1.8 was last published 2019-11-24.
- npm unpacked size is not browser bundle size. No candidate has been installed,
  built, or measured in this repository.

## Binding boundaries

- CTC-014 owns one isolated synthetic fixture experiment and the evidence-based
  final pipeline recommendation only. It does not ship production PDF export.
- Leading hypothesis is exact-pinned jspdf 4.2.1 plus svg2pdf.js 2.7.0.
  Required fallback comparison is exact-pinned pdfkit 0.19.1 plus
  svg-to-pdfkit 0.1.8. Direct drawing, browser print-to-PDF, and Canvas/raster
  are required control comparisons.
- No package is authorized for installation or adoption until this QA plan is
  critically reviewed. Production-dependency adoption remains a later gate.
- Use only the existing synthetic normalized fixture and deterministic project
  state matching current types. Static fixture text may satisfy notes. No
  persistent or user-authored notes model.
- Build a pure export-scene model from existing contracts. Do not scrape the
  interactive DOM or export focus targets, crosshair, controls, ARIA-only
  elements, measurement state, or unassociated features.
- Every PDF experiment containing OSM-derived geometry must visibly include the
  required OSM attribution text and full printed copyright URL.
- Distributed/shared CTC-008 PDF export cannot ship without CTC-020 raw GIS
  source availability in the same release. The CTC-014 experiment does not
  satisfy CTC-020.
- No remote assets, fonts, images, providers, API keys, accounts, servers,
  analytics, durable cache, external user-data flow, imported HTML, executable
  content, forms, annotations, attachments, scripts, or untrusted binary assets.
- Original code remains Apache-2.0. Do not reuse AGPL or unlicensed
  reference-project PDF/export code, layouts, assets, or workflows.

## Required deterministic decisions

Resolve these as exact experiment rules, correcting any inconsistency:

1. Select the exact single paper size/orientation, physical units, margins,
   content regions, coordinate transform, clipping policy, minimum stroke/text
   sizes, and physical-layout tolerances for the one-page fixture.
2. Define the exact export-scene TypeScript shape and deterministic mapping for
   current normalized layers, route, target, carry ring/label, scale bar,
   yardage table, static note, disclaimer, and attribution. Define what is
   vector-required, allowed to simplify, or allowed to rasterize.
3. Define exact deterministic fixture state using hole source key
   way/9000060101 and current ProjectV1/TargetV1/CarryV1/HoleStateV1 contracts.
4. Resolve Standard 14 font behavior, ASCII fixture restrictions, the required
   copyright symbol, searchable attribution, and whether a project-controlled
   font is necessary for the experiment.
5. Define candidate setup isolation: whether both candidate dependency pairs
   coexist on one experiment branch or are measured through separate temporary
   installs/worktrees. Define exact lockfile, cleanup, and no-production-
   adoption rules.
6. Define reproducible measurements for Vite bundle delta, transitive
   dependency/license tree, generated PDF size, browser success, page box,
   visible text, fixture fidelity, unsupported/silent drops, and print/layout
   precision.
7. Define structural proof that required paths/strokes/text remain vector.
   Select the minimal reviewed PDF inspection mechanism and state whether it
   adds a dependency. Raw binary substring scanning and Canvas screenshots do
   not prove vector preservation.
8. Define the rendered-page regression renderer/tool, exact pinning/license
   gate, repeated-run method, tolerance derivation, CI environment, artifacts,
   and anti-flake rules. Do not invent a universal pixel threshold.
9. Define safe jsPDF/PDFKit API subsets, bounded plain-text handling, forbidden
   APIs, object URL/download lifecycle if tested, visible failure states, and
   network-isolation assertions.
10. Define objective candidate pass/fail and final-recommendation rules. Resolve
    how CTC-014 can recommend a final library while keeping actual production
    adoption behind a later governance gate.
11. Define the exact file/change plan, Vitest/Playwright matrix, verification
    commands, observability/debug evidence, and cleanup expectations.
12. Identify all remaining scope leakage, unsupported claims, security,
    attribution, licensing, accessibility, or test blockers.

## Required verdict format

Return:

1. **Verdict:** exactly `READY`, `READY WITH REQUIRED SPEC CORRECTIONS`, or
   `NOT READY`.
2. **Blocking findings:** numbered, with failure scenario and correction.
3. **Accepted baseline decisions.**
4. **Required corrected decisions:** exact deterministic rules suitable for
   the isolated experiment.
5. **Candidate measurement and pass/fail matrix.**
6. **Adversarial test matrix:** input/action, expected PDF/visual result,
   structural/vector assertion, accessibility/usability assertion, and
   source/security assertion.
7. **Rejected/deferred recommendations.**
8. **Implementation gate:** state whether CTC-014 may move to
   `3. In Development (ChatGPT)` for an isolated experiment after corrections
   are recorded.

Treat production PDF UI, CTC-020 implementation, production dependency
adoption, fabricated fixtures/types/paths, DOM scraping, real-course data,
persistent notes, silent vector/style drops, Canvas-only success, remote or
untrusted assets, executable PDF features, missing attribution/disclaimer,
unreviewed test dependencies, unmeasured claims, brittle equality/thresholds,
networked tests, and scope leakage as blockers.

## Exact relevant repository file contents

<!-- GENERATED EXACT FILES BELOW -->

<!-- BEGIN EXACT FILE 1/20: docs/handoffs/ctc-014-gemini-specification-review.md -->

### docs/handoffs/ctc-014-gemini-specification-review.md

``````text
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
``````

<!-- END EXACT FILE 1/20: docs/handoffs/ctc-014-gemini-specification-review.md -->

<!-- BEGIN EXACT FILE 2/20: AGENTS.md -->

### AGENTS.md

``````text
# Repository Guidelines

## Project Structure & Module Organization

This repository contains the initial Chart the Course browser app scaffold plus governance docs. Runtime source lives in `src/`, Playwright smoke tests live in `test/e2e/`, and deterministic fixtures live in `fixtures/`. Root documents define project policy and status: `README.md`, `CONTRIBUTING.md`, `CONTEXT.md`, `SECURITY.md`, `ATTRIBUTION.md`, `THIRD_PARTY_NOTICES.md`, and `LICENSE`. Focused decision records live in `docs/`, including tile-provider, governance-workflow, legal-disclaimer, reference-reuse, and Overpass-contract guidance. Automation lives in `scripts/`; `scripts/compliance.sh` delegates to the canonical npm compliance flow. Dependency metadata is tracked in `package.json`, `package-lock.json`, and generated `sbom.json`.

## Build, Test, and Development Commands

- `npm ci`: install dependencies from the lockfile.
- `npm run dev`: start the Vite app on `127.0.0.1`.
- `npm run verify:scaffold`: enforce exact direct dependency pins, Node 24,
  React bootstrap, and SHA-pinned/read-only CI policy.
- `npm run build`: type-check and build the browser app.
- `npm run test:unit`: run Vitest unit tests.
- `npm run test:e2e`: run Playwright smoke tests against the local preview server.
- `npm run check`: run app build, unit tests, and Playwright smoke tests.
- `npm run generate:sbom`: regenerate `sbom.json` with CycloneDX.
- `npm run license:check`: run production dependency allowlist and denylist checks.
- `npm run audit:prod`: run `npm audit --omit=dev --audit-level=high`.
- `npm run compliance`: run SBOM generation, license checks, and production audit.
- `scripts/compliance.sh`: shell wrapper for the same compliance flow.
- `git diff --check`: catch whitespace errors before review.

The current React app shell is intentionally local-first and fixture-backed.
Use Node 24 LTS and npm 11 as declared in `.nvmrc` and `package.json`. Keep
direct dependencies exact-pinned. Do not add Overpass runtime calls, map
providers, basemap tiles, PDF export behavior, additional production
dependencies, API keys, or user data flows unless the selected task explicitly
covers them and governance docs are updated.

## Agent Workflow

Before starting a task, run `git status --short --branch`, read `CONTEXT.md`,
and fetch the current Notion task. Notion is long-term memory; `CONTEXT.md` is
active repo memory. Move active Codex work to `3. In Development (ChatGPT)`,
then to `4. Final Audit (Claude)` for review, and only mark `5. Done` after
Claude findings are resolved or explicitly accepted. For docs-only governance
tasks, the Gemini/Claude planning handoff may be skipped only under
`docs/governance-workflow.md`; final Claude audit is still required.

## Coding Style & Naming Conventions

Keep Markdown concise, source-linked where policy depends on external terms, and specific to Chart the Course. Use sentence-case prose, fenced command examples, and relative paths such as `docs/tile-provider-strategy.md`. Shell scripts should use POSIX `sh` unless a stronger shell is required; keep `set -eu` for fail-fast behavior. Package scripts should remain explicit and composable.

## Testing Guidelines

Unit tests use Vitest and should sit next to the source as `*.test.ts`. Browser smoke tests use Playwright under `test/e2e/`. For current changes, run `npm run check`, `git diff --check`, and `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh` before review.

## Commit & Pull Request Guidelines

Recent commits use short imperative subjects, often referencing CTC task IDs, for example `Document CTC-018 tile provider strategy` and `Resolve CTC-003 audit minor fixes`. Keep commits focused on one task. Pull requests should include a brief summary, verification commands and results, linked task or issue, governance impact, and screenshots only when UI changes exist.

## Security & Governance Notes

Do not copy or adapt AGPL-3.0 code from `ace`. Treat `hacker-yardage` and `openyardage-web` as study-only unless permissions are verified. Do not add map providers, production dependencies, API keys, PDF export behavior, or user data flows without updating the relevant docs and compliance posture. Use GitHub private vulnerability reporting until a monitored security email exists.
``````

<!-- END EXACT FILE 2/20: AGENTS.md -->

<!-- BEGIN EXACT FILE 3/20: ATTRIBUTION.md -->

### ATTRIBUTION.md

``````text
# Attribution Policy

Chart the Course is an Apache-2.0 project that uses open map data and may
eventually use third-party rendering, geometry, PDF, font, and test
dependencies. This file records attribution requirements that must be preserved
in the product, generated exports, documentation, and release artifacts.

## OpenStreetMap and ODbL

OpenStreetMap data is licensed under the Open Database License. Any web map,
course-data view, printed page, or PDF generated from OSM-derived data must
include visible OpenStreetMap attribution.

Required URL for PDF and print outputs:

```text
https://www.openstreetmap.org/copyright
```

MVP PDF policy:

- Include an attribution or acknowledgements block in exported PDFs.
- Include the full URL `https://www.openstreetmap.org/copyright` in PDFs.
- Use a compact OSM attribution footer or note on map-bearing hole pages unless
  legal review approves a lighter layout.
- Keep OSM-derived course geometry separate from user-authored overlays, notes,
  and player profiles where practical. Merge layers only for display/export.

## ODbL Section 4.6 Source Availability

PDF exports are Produced Works. When a PDF is distributed or shared, Chart the
Course must make the source OSM geometry or the means to recreate it available.
The MVP mechanism is a `Download Raw GIS Source (ODbL)` action adjacent to PDF
export.

The raw GIS source export must include:

- Raw GeoJSON or OSM XML response.
- OSM IDs.
- Bounding box.
- Exact Overpass QL query.
- Source URL.
- `https://www.openstreetmap.org/copyright`.

Raw GIS export must ship in the same release as PDF export. This requirement
does not apply to purely private local previews that are not distributed or
shared.

## Tile Provider and Basemap Attribution

CTC-018 selects a blank/vector-only MVP. The deployed MVP must not load
third-party basemap tiles by default and must not use the OSM public tile CDN
without explicit project approval.

Even when no third-party basemap tiles are used, OSM attribution remains
required because the displayed course geometry is OSM-derived.

Required MVP UI attribution for geometry-only views:

```text
Course data © OpenStreetMap contributors
https://www.openstreetmap.org/copyright
```

Required MVP PDF attribution for geometry-only exports:

```text
Course geometry and map data © OpenStreetMap contributors.
OpenStreetMap copyright and license: https://www.openstreetmap.org/copyright
```

If a hosted or self-hosted basemap provider is enabled later, the provider's
required attribution must be visible in every UI map view that uses it, included
in PDFs or printed outputs when relevant, and recorded in
`THIRD_PARTY_NOTICES.md`.

Current fallback preference if basemap context becomes necessary:
self-hosted scoped PMTiles/Protomaps extracts in project-controlled storage,
followed by MapTiler or Stadia only after plan and attribution review.

## Overpass and Nominatim Request Identity

Browser JavaScript cannot reliably set a custom `User-Agent` header. Browser
API requests must use the deployed app origin/referrer where available and
prefix Overpass QL bodies with an identifying comment such as:

```text
/* chart-the-course/VERSION contact:https://github.com/[org]/chart-the-course */
```

If the project later uses a proxy, self-hosted Overpass, or commercial
provider, that server-side layer should set a descriptive upstream
`User-Agent`.

Default Overpass response cache TTL is 7 days for public Overpass usage. The UI
must provide an explicit "Refresh course data" action, rate-limited to prevent
repeated refetches. Operators using self-hosted or commercial providers may
configure a different TTL, with a minimum guardrail to prevent abuse.

Detailed tile-provider comparison and source notes are in
`docs/tile-provider-strategy.md`.

## Reference Projects

The following projects are study-only unless license compatibility or maintainer
permission is verified:

- `hacker-yardage`
- `openyardage-web`

Do not copy source code, UI structure, query text, generated assets, or
distinctive expressive implementation from unlicensed repositories. Generic
concepts, independently written Overpass queries, and independently derived
standard geometry math are allowed.

The `ace` project is AGPL-3.0 and may be used only for concept-level awareness.
Do not copy, modify, adapt, link, combine, incorporate, or distribute any `ace`
code in Chart the Course. Because Chart the Course is a network-delivered
browser app, incorporating AGPL-covered code can trigger AGPL Section 13
source-availability obligations for the combined or modified work.

## Legal and Trademark Disclaimers

Public docs, app surfaces, sample data, and generated exports must not imply
that Chart the Course is affiliated with, sponsored by, endorsed by, or approved
by any golf course, golf governing body, GPS app, launch-monitor vendor,
simulator platform, map provider, or other commercial brand unless that
relationship is stated expressly.

Avoid third-party brand names in product positioning unless the reference is
nominative, necessary, and reviewed. Reviewed means a logged maintainer decision
with rationale, source or brand being referenced, where the reference appears,
and why it is nominative and necessary.

Do not bundle prepackaged high-fidelity commercial course replicas, proprietary
course maps, commercial yardage-book artwork, or simulator course assets.
Real-course fixtures require a logged review of data source, permission or
open-data basis, attribution, brand/course-name risk, jurisdiction-specific
concerns, and why a real fixture is necessary instead of a synthetic course.

Any generated PDF, print output, source export, or downloadable artifact that
contains OSM-derived course geometry must include OSM attribution in the
artifact, including the full URL `https://www.openstreetmap.org/copyright` when
links are not available.

Baseline disclaimer text and monitored legal/trademark source URLs are recorded
in `docs/legal-disclaimers.md`.
``````

<!-- END EXACT FILE 3/20: ATTRIBUTION.md -->

<!-- BEGIN EXACT FILE 4/20: THIRD_PARTY_NOTICES.md -->

### THIRD_PARTY_NOTICES.md

``````text
# Third-Party Notices

This scaffold contains the following reviewed production runtime dependencies:

| Package | Version | License | Purpose |
| --- | --- | --- | --- |
| `react` | 19.2.7 | MIT | Declarative application UI |
| `react-dom` | 19.2.7 | MIT | Browser DOM rendering |
| `scheduler` | 0.27.0 | MIT | Transitive React scheduling runtime |

These packages were verified through the production SBOM and license checks on
2026-06-05. Their upstream license files are preserved in installed package
artifacts and represented in `sbom.json`.

## Current Map and Tile Provider Policy

CTC-018 selects a blank/vector-only MVP with no third-party basemap tiles loaded
by default. No MapTiler, Stadia, Protomaps, Thunderforest, OpenFreeMap, Esri, or
OSM public tile CDN runtime dependency is currently adopted.

The deployed MVP must not use the OSM public tile CDN without explicit project
approval. If a basemap provider is adopted later, this file must be updated
before release with:

- Provider name and plan or self-hosting mode.
- Tile/data source and license or terms URL.
- Required UI attribution text.
- Required PDF/print attribution text, including full URLs where links are not
  possible.
- Whether provider attribution is needed in PDFs.
- Whether the provider's data is an ODbL Produced Work and source availability
  applies.
- Verification date and owner.

OSM attribution is still required for OSM-derived course geometry even when no
third-party basemap tiles are used:

```text
Course data © OpenStreetMap contributors
https://www.openstreetmap.org/copyright
```

## Original Project License

Original Chart the Course code is licensed under Apache-2.0. See `LICENSE`.

## Dependency Notice Policy

Production dependencies must be reviewed before adoption and tracked through the
SBOM and license scanner. Preserve upstream copyright notices, license files,
NOTICE files, and attribution text required by dependency licenses.

Allowed production dependency licenses for the automated compliance gate:

```text
MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;OFL-1.1;CC0-1.0;Unlicense;0BSD
```

The scanner must fail on:

```text
GPL-2.0-only;GPL-3.0-only;AGPL-3.0;UNLICENSED
```

Packages reporting bare `Public Domain` require manual review and must not be
treated as automatically allowed.

## Current Compliance Command

```bash
npm ci
npx @cyclonedx/cyclonedx-npm \
  --omit dev \
  --output-format JSON \
  --output-file sbom.json \
  --validate

# Pass 1 - allowlist
npx license-checker-rseidelsohn \
  --production \
  --excludePrivatePackages \
  --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;OFL-1.1;CC0-1.0;Unlicense;0BSD"

# Pass 2 - denylist
npx license-checker-rseidelsohn \
  --production \
  --excludePrivatePackages \
  --failOn "GPL-2.0-only;GPL-3.0-only;AGPL-3.0;UNLICENSED"
npm audit --omit=dev --audit-level=high
```

Do not run `npm ci --omit=dev` before invoking a devDependency SBOM tool. Do not
use `--package-lock-only` in the authoritative SBOM command.

`license-checker-rseidelsohn` does not support `--onlyAllow` and `--failOn` in
the same invocation, so these must run as separate passes. They also pass
`--excludePrivatePackages` because this scanner reports the unpublished private
root package as `UNLICENSED` even though `package.json` declares Apache-2.0 and
`LICENSE` is present.

## Future Production Dependencies

Before adding MapLibre, Turf, PDF libraries, fonts, map tiles, geocoding
providers, or analytics tooling, update this file with:

- Package or provider name.
- Version or provider plan.
- License and notice obligations.
- Attribution text shown in-app or in generated PDFs.
- Compliance verification date.
``````

<!-- END EXACT FILE 4/20: THIRD_PARTY_NOTICES.md -->

<!-- BEGIN EXACT FILE 5/20: SECURITY.md -->

### SECURITY.md

``````text
# Security Policy

## Reporting Vulnerabilities

Use GitHub private vulnerability reporting for Chart the Course security reports
until the project has a verified, monitored security contact.

GitHub private vulnerability reporting was enabled for
`ajason13/chart-the-course` on 2026-06-05.

Do not publish `security@chartthecourse.app` or any other project email address
until that mailbox exists, is monitored, and has an owner. Setting a monitored
security contact before v1.0 is a launch-blocking milestone item.

## Supported Versions

Chart the Course has not shipped a public release yet. Security fixes apply to
the active `main` branch once the repository is published.

## Security Scope

Security review should include:

- Browser-only handling of course selections, notes, and player profiles.
- OpenStreetMap, Overpass, Nominatim, tile-provider, and PDF-export request
  flows.
- Dependency license and vulnerability gates.
- Generated PDF attribution and raw GIS source export behavior once PDF export
  ships.

The app must not rely on custom browser `User-Agent` headers for API identity.
Use app origin/referrer where available plus Overpass QL identifying comments.
``````

<!-- END EXACT FILE 5/20: SECURITY.md -->

<!-- BEGIN EXACT FILE 6/20: docs/governance-workflow.md -->

### docs/governance-workflow.md

``````text
# Governance Workflow

Status: Updated on 2026-06-05 after CTC-018.

Chart the Course uses a document-first workflow. Notion is long-term project
memory, and `CONTEXT.md` is active repository memory for the next agent or
developer.

## Standard Task Flow

1. Fetch the active Notion task and relevant project context.
2. Move the task to `3. In Development (ChatGPT)` when Codex starts work.
3. Update repository governance docs and `CONTEXT.md` as needed.
4. Run verification:

```bash
git diff --check
npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh
```

5. Commit and push according to the task's delivery path.
6. Move the task to `4. Final Audit (Claude)` and provide Claude a
   self-contained audit prompt.
7. Apply blocking or accepted minor fixes, rerun verification, and commit.
8. Mark the task `5. Done` in Notion and update `CONTEXT.md`.

## Docs-Only Governance Exception

For repository documentation or governance-only tasks, separate Gemini research
and separate Claude adversarial planning may be skipped when all are true:

- No runtime app code is added or changed.
- No production dependency, provider integration, API key, deployment behavior,
  or user data flow is added.
- Codex checks current primary sources directly when the task depends on
  provider, legal, standards, or security terms.
- Source URLs and check dates are recorded in the repo docs or Notion.
- Claude final audit still happens before Done.

Do not use this exception for app scaffolds, provider integrations, security
controls, PDF export behavior, data ingestion code, dependency adoption, or
changes that affect deployed behavior.

## Claude Chat Audit Prompts

Claude Chat does not have access to the local filesystem or GitHub by default.
Final audit prompts must be self-contained and include:

- Role and audit stage.
- Task objective and acceptance criteria.
- Prior governance context.
- Commit hash and verification evidence.
- Source URLs and source-check date when external terms matter.
- Exact contents of every changed file relevant to the audit.
- Explicit note when the docs-only governance exception was used.
- Required verdict format: `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`.

Ask Claude to distinguish blockers from minor fixes and to state whether the
task may be marked Done after any minor fixes are applied.
``````

<!-- END EXACT FILE 6/20: docs/governance-workflow.md -->

<!-- BEGIN EXACT FILE 7/20: docs/legal-disclaimers.md -->

### docs/legal-disclaimers.md

``````text
# Legal and Trademark Disclaimers

Status: Drafted for CTC-003 on 2026-06-05.

This document records the public legal, trademark, and course-replica posture
for Chart the Course. It is project governance documentation, not legal advice.
Project maintainers and contributors should get advice from qualified counsel
before relying on this document for commercialization, licensing disputes,
brand-clearance decisions, or high-fidelity course recreation.

## Public Disclaimer Text

Use this baseline disclaimer in public-facing docs, app about pages, generated
exports, and release materials until counsel approves alternative wording:

```text
Chart the Course is an independent open-source project and is not affiliated
with, sponsored by, endorsed by, or approved by any golf course, golf governing
body, launch-monitor vendor, GPS app, simulator platform, map provider, or other
commercial brand unless that relationship is stated expressly.

Course layouts, yardages, hazards, and tactical recommendations may be
incomplete or inaccurate because they are generated from public/open map data
and user-authored inputs. Verify all yardages, hazards, boundaries, and local
course rules before play.

Chart the Course is not legal advice. Copyright, trademark, database-right, and
course-design rules vary by jurisdiction and may change. Do not use this project
to create or distribute prepackaged high-fidelity replicas of commercial golf
courses unless you have the rights or permissions needed for that use.
```

## Trademark and Brand Rules

Chart the Course must avoid suggesting sponsorship, affiliation, endorsement, or
approval by third-party brands.

- Do not use third-party brand names in product positioning, navigation,
  feature names, comparison copy, screenshots, examples, or generated exports
  unless the reference is nominative, necessary, and reviewed.
- Prefer generic terms such as `GPS app`, `launch monitor`, `simulator
  platform`, `course operator`, `map provider`, `tile provider`, or `governing
  body`.
- When a third-party name is necessary for attribution, compatibility, source
  identification, legal monitoring, or a provider notice, use the minimum text
  needed and avoid logos, trade dress, slogans, and marketing claims.
- In this policy, `reviewed` means a logged maintainer decision with the
  rationale, source or brand being referenced, where the reference will appear,
  and why the reference is nominative and necessary.
- Do not imply that a named course, club, tournament, governing body, equipment
  vendor, GPS app, or simulator platform approves or validates Chart the Course.
- Do not use famous course names or commercial brand names as bundled demo data,
  example fixtures, seeded screenshots, or default yardage-book content without
  explicit review.

## Course-Design and Replica Rules

Chart the Course is designed to generate user-requested planning artifacts from
open/public map data and user-authored overlays. It must not ship prepackaged
high-fidelity commercial course replicas.

- Do not bundle or market named commercial-course replicas as project assets.
- Do not copy copyrighted maps, yardage books, pin sheets, scorecard artwork,
  course photography, proprietary routing diagrams, simulator course assets, or
  commercial strategy-book layouts.
- Do not trace or reconstruct a proprietary commercial course product when OSM
  or user-authored data is unavailable.
- Demo fixtures should use synthetic courses, permissioned data, or heavily
  simplified generic examples unless a real course has been reviewed for
  permission, attribution, and jurisdiction-specific risk.
- A real-course fixture review must be logged before merge and must identify
  the data source, permission or open-data basis, required attribution, brand or
  course-name risk, jurisdiction-specific concerns, and why the fixture is
  necessary instead of a synthetic course.
- If the project later adds import, PDF, fixture, or marketplace features, those
  features must preserve this no-prepackaged-replica rule before release.

## Data Accuracy Disclaimer

Generated yardages and course geometry are planning aids only. OSM contributors
and user inputs may be incomplete, stale, approximate, or inconsistent with
course conditions. The app must keep data-quality warnings visible when geometry
is missing or ambiguous, and generated PDFs should remind users to verify
yardages and hazards before play.

Any generated PDF, print output, source export, or downloadable artifact that
contains OSM-derived course geometry must include OSM attribution near the
map-bearing page, export metadata, acknowledgements block, or source-download
notice as appropriate for the artifact, including the full URL
`https://www.openstreetmap.org/copyright` when links are not available.

## Source Monitoring

Primary sources checked on 2026-06-05:

- U.S. Congress, H.R. 7228, 118th Congress, BIRDIE Act: the bill was introduced
  on 2024-02-05 and referred to the House Judiciary Committee; Congress.gov
  listed no enacted-law status for that bill when checked.
  <https://www.congress.gov/bill/118th-congress/house-bill/7228/all-info>
- U.S. Copyright Office, Circular 33, `Works Not Protected by Copyright`:
  project policy should continue treating ideas, systems, methods, layouts,
  names, titles, slogans, and short phrases as outside ordinary copyright
  protection while recognizing that expressive materials can still be protected.
  <https://www.copyright.gov/circs/circ33.pdf>
- U.S. Copyright Office FAQ, `What Does Copyright Protect?`: copyright does not
  protect ideas, concepts, systems, or methods of doing something, and names or
  short phrases may instead raise trademark issues.
  <https://www.copyright.gov/help/faq/faq-protect.html>
- USPTO, `About Trademark Infringement`: trademark risk centers on unauthorized
  use that is likely to cause confusion, deception, or mistake about source,
  sponsorship, or services.
  <https://www.uspto.gov/page/about-trademark-infringement>
- USPTO, `Likelihood of confusion`: public branding should avoid confusingly
  similar marks and related-goods/services contexts that could imply a common
  source.
  <https://www.uspto.gov/trademarks/search/likelihood-confusion>
- OpenStreetMap copyright and license page: OSM-derived maps and printed media
  require visible attribution, with the full URL when links are not possible.
  <https://www.openstreetmap.org/copyright>

Review these sources before v1.0, before any monetization, before publishing
named real-course fixtures, before using third-party marks in marketing, and
after any material change to U.S. or international course-design law.
``````

<!-- END EXACT FILE 7/20: docs/legal-disclaimers.md -->

<!-- BEGIN EXACT FILE 8/20: docs/reference-project-reuse-policy.md -->

### docs/reference-project-reuse-policy.md

``````text
# Reference Project Reuse Policy

Status: Adopted for CTC-013 on 2026-06-05.

This policy records how Chart the Course may use three known golf-mapping
reference projects. It is a governance decision, not legal advice.

## Decision

| Project | Observed license status | Allowed use | Blocked use |
| --- | --- | --- | --- |
| `npilk/hacker-yardage` | GitHub license detection found no recognizable license file such as `LICENSE`, `COPYING`, or an equivalent root license file; the GitHub license API returned 404 on 2026-06-05. | Product and architecture inspiration only. Public README behavior may inform problem framing, provided implementation remains original. | Dependency, fork, code copy, translation, adaptation, asset/template reuse, query text reuse, or distinctive workflow/UI reuse without written permission or a later verified license. |
| `npilk/openyardage-web` | GitHub license detection found no recognizable license file such as `LICENSE`, `COPYING`, or an equivalent root license file; the GitHub license API returned 404 on 2026-06-05. | Product and architecture inspiration only. Public README behavior may inform problem framing, provided implementation remains original. | Dependency, fork, code copy, translation, adaptation, asset reuse, query text reuse, PDF/export implementation reuse, or distinctive workflow/UI reuse without written permission or a later verified license. |
| `bdlucas1/ace` | GitHub identifies `LICENSE.txt` as GNU Affero General Public License v3.0 (`AGPL-3.0`). | Architecture and prior-art reference only. High-level concepts may be studied, then independently designed and implemented. | Copying, modifying, adapting, linking, combining, incorporating, distributing, forking, or using as a dependency unless Chart the Course intentionally adopts an AGPL-compatible licensing posture and records that decision first. |

## Rationale

An absent detected license is not permission to reuse code. A GitHub license API
404 means GitHub did not detect a recognizable license file in the expected
repository locations; it does not prove that no license text exists anywhere in
the repository or in another communication channel. Until a license or written
permission is verified, `hacker-yardage` and `openyardage-web` are treated as
copyrighted source-available references only. Chart the Course may learn from
their public behavior and broad product ideas, but implementation must be
independently authored.

`ace` has an explicit AGPL-3.0 license. The GNU AGPL is a copyleft license
designed for software used over a network, and Section 13 requires modified
network-interactive versions to offer users Corresponding Source. Section 5 also
requires modified source versions to license the whole work under the AGPL when
the work is based on the covered program. Chart the Course is currently
Apache-2.0 and browser-delivered, so incorporating `ace` code would conflict
with the current permissive licensing plan unless the project intentionally
changes license strategy.

## Contributor Rules

- Do not copy source code, generated assets, templates, query strings, test
  fixtures, UI structure, or distinctive implementation details from any
  reference project listed here.
- If a future task proposes reuse beyond inspiration, stop and create a
  governance task to verify the exact upstream license or written permission.
- If a future task proposes AGPL-compatible reuse, record the licensing impact,
  source-availability obligations, notice requirements, and maintainer decision
  before implementation.
- Generated code must be reviewed for similarity against these references when
  the prompt or implementation was influenced by them.

## Sources Checked

Checked on 2026-06-05:

- `https://github.com/npilk/hacker-yardage`
- `https://api.github.com/repos/npilk/hacker-yardage/license`
- `https://github.com/npilk/openyardage-web`
- `https://api.github.com/repos/npilk/openyardage-web/license`
- `https://github.com/bdlucas1/ace`
- `https://api.github.com/repos/bdlucas1/ace/license`
- `https://www.gnu.org/licenses/agpl-3.0.en.html`
``````

<!-- END EXACT FILE 8/20: docs/reference-project-reuse-policy.md -->

<!-- BEGIN EXACT FILE 9/20: package.json -->

### package.json

``````text
{
  "name": "chart-the-course",
  "version": "0.0.0",
  "private": true,
  "description": "Browser-based yardage book and course layout generator.",
  "license": "Apache-2.0",
  "type": "module",
  "engines": {
    "node": ">=24 <25",
    "npm": ">=11 <12"
  },
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "test": "npm run test:unit && npm run test:e2e",
    "verify:scaffold": "node scripts/verify-scaffold.mjs",
    "check": "npm run verify:scaffold && npm run build && npm run test",
    "install:ci": "npm ci",
    "generate:sbom": "npx @cyclonedx/cyclonedx-npm --omit dev --output-format JSON --output-file sbom.json --validate",
    "build:sbom": "npm run install:ci && npm run generate:sbom",
    "license:allow": "npx license-checker-rseidelsohn --production --excludePrivatePackages --onlyAllow \"MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;OFL-1.1;CC0-1.0;Unlicense;0BSD\"",
    "license:deny": "npx license-checker-rseidelsohn --production --excludePrivatePackages --failOn \"GPL-2.0-only;GPL-3.0-only;AGPL-3.0;UNLICENSED\"",
    "license:check": "npm run license:allow && npm run license:deny",
    "audit:prod": "npm audit --omit=dev --audit-level=high",
    "compliance": "npm run generate:sbom && npm run license:check && npm run audit:prod"
  },
  "devDependencies": {
    "@axe-core/playwright": "4.11.3",
    "@cyclonedx/cyclonedx-npm": "2.1.0",
    "@playwright/test": "1.60.0",
    "@types/react": "19.2.0",
    "@types/react-dom": "19.2.0",
    "@vitejs/plugin-react": "6.0.2",
    "license-checker-rseidelsohn": "4.4.2",
    "typescript": "6.0.3",
    "vite": "8.0.16",
    "vitest": "4.1.8"
  },
  "dependencies": {
    "react": "19.2.7",
    "react-dom": "19.2.7"
  }
}
``````

<!-- END EXACT FILE 9/20: package.json -->

<!-- BEGIN EXACT FILE 10/20: src/normalize.ts -->

### src/normalize.ts

``````text
import type { OverpassElement, OverpassResponse, SourceMetadata } from "./overpass";

export type Coordinate = { lat: number; lon: number };
export type SourceKey = `${OverpassElement["type"]}/${number}`;

export type SourceRecord = {
  sourceKey: SourceKey;
  type: OverpassElement["type"];
  id: number;
  tags: Record<string, unknown>;
  rawNodes?: unknown;
  rawGeometry?: unknown;
  rawMembers?: unknown;
};

export type Geometry =
  | { type: "point"; coordinate: Coordinate }
  | { type: "line"; coordinates: Coordinate[] }
  | { type: "polygon"; coordinates: Coordinate[] };

export type FeatureKind =
  | "tee" | "green" | "fairway" | "bunker" | "rough"
  | "golf-water" | "generic-water" | "vegetation";

export type NormalizedFeature = {
  kind: FeatureKind;
  classifiedBy: readonly [string, string];
  source: SourceRecord;
  geometry: Geometry | null;
};

export type NormalizedHole = {
  number: number | null;
  par: number | null;
  source: SourceRecord;
  route: Geometry | null;
  features: NormalizedFeature[];
};

export type CourseCandidate = {
  classifiedBy: readonly ["leisure", "golf_course"];
  source: SourceRecord;
  geometry: Geometry | null;
};

export type WarningCode =
  | "AMBIGUOUS_FEATURE_REF"
  | "AMBIGUOUS_HOLE_ORDER"
  | "DUPLICATE_SOURCE_KEY"
  | "MALFORMED_CONSUMED_TAG"
  | "MISSING_GREEN"
  | "MISSING_OR_MALFORMED_GEOMETRY"
  | "MISSING_TEE"
  | "MULTIPLE_COURSE_CANDIDATES"
  | "UNSUPPORTED_RELATION"
  | "ZERO_COURSE_CANDIDATES";

export type NormalizationWarning = {
  code: WarningCode;
  severity: "error" | "warning";
  affectedIdentity: string;
  holeNumber?: number;
  sourceKey?: SourceKey;
  refs: SourceKey[];
};

export type NormalizationResult = {
  source: SourceMetadata;
  courseCandidates: CourseCandidate[];
  holes: NormalizedHole[];
  unassociatedFeatures: NormalizedFeature[];
  warnings: NormalizationWarning[];
};

type Classification =
  | { kind: "course"; classifiedBy: readonly ["leisure", "golf_course"] }
  | { kind: "hole"; classifiedBy: readonly ["golf", "hole"] }
  | { kind: FeatureKind; classifiedBy: readonly [string, string] };

const STRICT_POSITIVE_INTEGER = /^[1-9][0-9]*$/;
const GOLF_FEATURES = ["tee", "green", "fairway", "bunker", "rough"] as const;
const GOLF_WATER = ["water_hazard", "lateral_water_hazard"] as const;
const NATURAL_VEGETATION = ["wood", "tree", "tree_row", "scrub"] as const;
const LANDUSE_WATER = ["reservoir", "basin"] as const;

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sourceKey(element: OverpassElement): SourceKey {
  return `${element.type}/${element.id}`;
}

function canonical(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "number") {
    if (Number.isNaN(value)) return '"NaN"';
    if (value === Infinity) return '"Infinity"';
    if (value === -Infinity) return '"-Infinity"';
    return JSON.stringify(Object.is(value, -0) ? 0 : value);
  }
  if (typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => compareText(left, right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${canonical(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(String(value));
}

function tagsOf(element: OverpassElement): Record<string, unknown> {
  return element.tags && typeof element.tags === "object" && !Array.isArray(element.tags)
    ? element.tags
    : {};
}

function recordOf(element: OverpassElement): SourceRecord {
  return {
    sourceKey: sourceKey(element),
    type: element.type,
    id: element.id,
    tags: tagsOf(element),
    ...("nodes" in element ? { rawNodes: element.nodes } : {}),
    ...("geometry" in element ? { rawGeometry: element.geometry } : {}),
    ...("members" in element ? { rawMembers: element.members } : {}),
  };
}

function tag(element: OverpassElement, key: string): string | null {
  const value = tagsOf(element)[key];
  return typeof value === "string" ? value : null;
}

function oneOf<T extends readonly string[]>(value: string | null, values: T): value is T[number] {
  return value !== null && values.includes(value);
}

function classify(element: OverpassElement): Classification | null {
  const golf = tag(element, "golf");
  if (golf === "hole") return { kind: "hole", classifiedBy: ["golf", "hole"] };
  if (oneOf(golf, GOLF_FEATURES)) return { kind: golf, classifiedBy: ["golf", golf] };
  if (oneOf(golf, GOLF_WATER)) return { kind: "golf-water", classifiedBy: ["golf", golf] };
  if (tag(element, "leisure") === "golf_course") {
    return { kind: "course", classifiedBy: ["leisure", "golf_course"] };
  }
  if (tag(element, "natural") === "water") return { kind: "generic-water", classifiedBy: ["natural", "water"] };
  const waterway = tag(element, "waterway");
  if (waterway !== null) return { kind: "generic-water", classifiedBy: ["waterway", waterway] };
  const water = tag(element, "water");
  if (water !== null) return { kind: "generic-water", classifiedBy: ["water", water] };
  const landuse = tag(element, "landuse");
  if (oneOf(landuse, LANDUSE_WATER)) return { kind: "generic-water", classifiedBy: ["landuse", landuse] };
  const natural = tag(element, "natural");
  if (oneOf(natural, NATURAL_VEGETATION)) return { kind: "vegetation", classifiedBy: ["natural", natural] };
  if (landuse === "forest") return { kind: "vegetation", classifiedBy: ["landuse", "forest"] };
  return null;
}

function validCoordinate(value: unknown): value is Coordinate {
  if (!value || typeof value !== "object") return false;
  const coordinate = value as Record<string, unknown>;
  return typeof coordinate.lat === "number"
    && Number.isFinite(coordinate.lat)
    && coordinate.lat >= -90
    && coordinate.lat <= 90
    && typeof coordinate.lon === "number"
    && Number.isFinite(coordinate.lon)
    && coordinate.lon >= -180
    && coordinate.lon <= 180;
}

function isArea(classification: Classification): boolean {
  if (classification.kind === "course") return true;
  if (["tee", "green", "fairway", "bunker", "rough", "golf-water"].includes(classification.kind)) return true;
  if (classification.kind === "generic-water") return classification.classifiedBy[0] !== "waterway";
  if (classification.kind === "vegetation") return classification.classifiedBy[1] !== "tree"
    && classification.classifiedBy[1] !== "tree_row";
  return false;
}

function geometryOf(element: OverpassElement, classification: Classification): Geometry | null {
  if (element.type === "relation") return null;
  if (element.type === "node") {
    return validCoordinate(element) ? { type: "point", coordinate: { lat: element.lat, lon: element.lon } } : null;
  }
  const raw = element.geometry;
  if (!Array.isArray(raw) || !raw.every(validCoordinate)) return null;
  const coordinates = raw.map(({ lat, lon }) => ({ lat, lon }));
  if (isArea(classification)) {
    if (coordinates.length < 4) return null;
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    return first.lat === last.lat && first.lon === last.lon ? { type: "polygon", coordinates } : null;
  }
  return coordinates.length >= 2 ? { type: "line", coordinates } : null;
}

function strictInteger(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return STRICT_POSITIVE_INTEGER.test(trimmed) ? Number(trimmed) : null;
}

function warning(
  code: WarningCode,
  severity: NormalizationWarning["severity"],
  affectedIdentity: string,
  refs: SourceKey[] = [],
  holeNumber?: number,
  key?: SourceKey,
): NormalizationWarning {
  return {
    code,
    severity,
    affectedIdentity,
    refs: [...refs].sort(),
    ...(holeNumber === undefined ? {} : { holeNumber }),
    ...(key === undefined ? {} : { sourceKey: key }),
  };
}

function compareWarnings(left: NormalizationWarning, right: NormalizationWarning): number {
  return compareText(left.code, right.code)
    || (left.holeNumber ?? Number.POSITIVE_INFINITY) - (right.holeNumber ?? Number.POSITIVE_INFINITY)
    || compareText(left.sourceKey ?? "", right.sourceKey ?? "")
    || compareText(left.affectedIdentity, right.affectedIdentity);
}

function deduplicateElements(elements: OverpassElement[], warnings: NormalizationWarning[]): OverpassElement[] {
  const grouped = new Map<SourceKey, OverpassElement[]>();
  for (const element of elements) {
    const key = sourceKey(element);
    grouped.set(key, [...(grouped.get(key) ?? []), element]);
  }
  return [...grouped.entries()]
    .sort(([left], [right]) => compareText(left, right))
    .map(([key, records]) => {
      if (records.length > 1) warnings.push(warning("DUPLICATE_SOURCE_KEY", "error", key, records.map(sourceKey), undefined, key));
      return [...records].sort((left, right) => compareText(canonical(left), canonical(right)))[0];
    });
}

export function normalizeGolfCourse(response: OverpassResponse, source: SourceMetadata): NormalizationResult {
  const warnings: NormalizationWarning[] = [];
  const elements = deduplicateElements(response.elements, warnings);
  const courseCandidates: CourseCandidate[] = [];
  const holes: NormalizedHole[] = [];
  const features: Array<{ feature: NormalizedFeature; ref: number | null }> = [];

  for (const element of elements) {
    const classification = classify(element);
    if (!classification) continue;
    const sourceRecord = recordOf(element);
    const geometry = geometryOf(element, classification);
    if (element.type === "relation") {
      warnings.push(warning("UNSUPPORTED_RELATION", "warning", sourceRecord.sourceKey, [sourceRecord.sourceKey], undefined, sourceRecord.sourceKey));
    } else if (!geometry) {
      warnings.push(warning("MISSING_OR_MALFORMED_GEOMETRY", "error", sourceRecord.sourceKey, [sourceRecord.sourceKey], undefined, sourceRecord.sourceKey));
    }

    if (classification.kind === "course") {
      courseCandidates.push({ classifiedBy: classification.classifiedBy, source: sourceRecord, geometry });
      continue;
    }
    if (classification.kind === "hole") {
      const number = strictInteger(sourceRecord.tags.ref);
      const par = strictInteger(sourceRecord.tags.par);
      if ("par" in sourceRecord.tags && par === null) {
        warnings.push(warning("MALFORMED_CONSUMED_TAG", "warning", `${sourceRecord.sourceKey}:par`, [sourceRecord.sourceKey], undefined, sourceRecord.sourceKey));
      }
      holes.push({ number, par, source: sourceRecord, route: geometry, features: [] });
      continue;
    }
    if (!geometry && element.type !== "relation") continue;
    features.push({
      feature: { kind: classification.kind, classifiedBy: classification.classifiedBy, source: sourceRecord, geometry },
      ref: strictInteger(sourceRecord.tags.ref),
    });
  }

  courseCandidates.sort((left, right) => {
    const rank = (candidate: CourseCandidate) => candidate.geometry?.type === "polygon" ? 0 : candidate.source.type === "relation" ? 1 : 2;
    return rank(left) - rank(right) || compareText(left.source.sourceKey, right.source.sourceKey);
  });
  holes.sort((left, right) => (left.number ?? Number.POSITIVE_INFINITY) - (right.number ?? Number.POSITIVE_INFINITY)
    || compareText(left.source.sourceKey, right.source.sourceKey));

  if (courseCandidates.length === 0) warnings.push(warning("ZERO_COURSE_CANDIDATES", "error", "course-candidates"));
  if (courseCandidates.length > 1) {
    warnings.push(warning("MULTIPLE_COURSE_CANDIDATES", "warning", "course-candidates", courseCandidates.map(({ source: record }) => record.sourceKey)));
  }

  const holesByNumber = new Map<number, NormalizedHole[]>();
  for (const hole of holes) {
    if (hole.number !== null) holesByNumber.set(hole.number, [...(holesByNumber.get(hole.number) ?? []), hole]);
  }
  const duplicateNumbers = [...holesByNumber.entries()].filter(([, matches]) => matches.length > 1);
  if (duplicateNumbers.length > 0 || (holes.some(({ number }) => number !== null) && holes.some(({ number }) => number === null))) {
    warnings.push(warning("AMBIGUOUS_HOLE_ORDER", "warning", "holes", holes.map(({ source: record }) => record.sourceKey)));
  }

  const unassociatedFeatures: NormalizedFeature[] = [];
  for (const { feature, ref } of features.sort((left, right) => compareText(left.feature.source.sourceKey, right.feature.source.sourceKey))) {
    const matches = ref === null ? [] : holesByNumber.get(ref) ?? [];
    if (matches.length === 1) matches[0].features.push(feature);
    else {
      unassociatedFeatures.push(feature);
      if (ref !== null) {
        warnings.push(warning("AMBIGUOUS_FEATURE_REF", "warning", feature.source.sourceKey, [feature.source.sourceKey], undefined, feature.source.sourceKey));
      }
    }
  }

  for (const hole of holes) {
    hole.features.sort((left, right) => compareText(left.source.sourceKey, right.source.sourceKey));
    if (hole.number === null) continue;
    if (!hole.features.some(({ kind }) => kind === "tee")) {
      warnings.push(warning("MISSING_TEE", "error", hole.source.sourceKey, [hole.source.sourceKey], hole.number, hole.source.sourceKey));
    }
    if (!hole.features.some(({ kind }) => kind === "green")) {
      warnings.push(warning("MISSING_GREEN", "error", hole.source.sourceKey, [hole.source.sourceKey], hole.number, hole.source.sourceKey));
    }
  }

  const uniqueWarnings = new Map<string, NormalizationWarning>();
  for (const entry of warnings) uniqueWarnings.set(`${entry.code}:${entry.affectedIdentity}`, entry);

  return {
    source,
    courseCandidates,
    holes,
    unassociatedFeatures,
    warnings: [...uniqueWarnings.values()].sort(compareWarnings),
  };
}
``````

<!-- END EXACT FILE 10/20: src/normalize.ts -->

<!-- BEGIN EXACT FILE 11/20: src/map.ts -->

### src/map.ts

``````text
import type {
  Coordinate,
  Geometry,
  NormalizationWarning,
  NormalizedHole,
} from "./normalize";

export const VIEWBOX_WIDTH = 800;
export const VIEWBOX_HEIGHT = 600;
export const VIEWBOX_PADDING = 40;
export const INNER_MIN_X = VIEWBOX_PADDING;
export const INNER_MAX_X = VIEWBOX_WIDTH - VIEWBOX_PADDING;
export const INNER_MIN_Y = VIEWBOX_PADDING;
export const INNER_MAX_Y = VIEWBOX_HEIGHT - VIEWBOX_PADDING;
export const INNER_WIDTH = INNER_MAX_X - INNER_MIN_X;
export const INNER_HEIGHT = INNER_MAX_Y - INNER_MIN_Y;
export const MIN_EXTENT_M = 20;
export const EARTH_RADIUS_M = 6_371_000;
export const YARDS_PER_METER = 1 / 0.9144;

export type ViewportPoint = { x: number; y: number };

export type Projection = {
  center: Coordinate;
  cosLat: number;
  scale: number;
  minX: number;
  minY: number;
  offsetX: number;
  offsetY: number;
};

export type ProjectionFailure =
  | { kind: "no-valid-coordinates" }
  | { kind: "near-pole" }
  | { kind: "invalid-projection" };

export type DistanceFailure = { kind: "invalid-coordinates" };

export type ScaleBar = {
  meters: number;
  logicalLength: number;
  label: string;
};

export const LAYER_ORDER = [
  "vegetation",
  "generic-water",
  "golf-water",
  "rough",
  "fairway",
  "bunker",
  "green",
  "tee",
] as const;

export function validCoordinate(value: unknown): value is Coordinate {
  if (!value || typeof value !== "object") return false;
  const coordinate = value as Record<string, unknown>;
  return typeof coordinate.lat === "number"
    && Number.isFinite(coordinate.lat)
    && coordinate.lat >= -90
    && coordinate.lat <= 90
    && typeof coordinate.lon === "number"
    && Number.isFinite(coordinate.lon)
    && coordinate.lon >= -180
    && coordinate.lon <= 180;
}

export function geometryCoordinates(geometry: Geometry): Coordinate[] {
  return geometry.type === "point" ? [geometry.coordinate] : geometry.coordinates;
}

export function holeCoordinates(hole: NormalizedHole): Coordinate[] {
  return [
    ...(hole.route ? geometryCoordinates(hole.route) : []),
    ...hole.features.flatMap(({ geometry }) => geometry ? geometryCoordinates(geometry) : []),
  ].filter(validCoordinate);
}

export function createProjection(coordinates: Coordinate[]): Projection | ProjectionFailure {
  const valid = coordinates.filter(validCoordinate);
  if (valid.length === 0) return { kind: "no-valid-coordinates" };

  const lats = valid.map(({ lat }) => lat);
  const lons = valid.map(({ lon }) => lon);
  const center = {
    lat: (Math.min(...lats) + Math.max(...lats)) / 2,
    lon: (Math.min(...lons) + Math.max(...lons)) / 2,
  };
  const cosLat = Math.cos(center.lat * Math.PI / 180);
  if (!Number.isFinite(cosLat) || Math.abs(cosLat) < 1e-6) return { kind: "near-pole" };

  const local = valid.map((coordinate) => toLocalMeters(coordinate, center, cosLat));
  let minX = Math.min(...local.map(({ x }) => x));
  let maxX = Math.max(...local.map(({ x }) => x));
  let minY = Math.min(...local.map(({ y }) => y));
  let maxY = Math.max(...local.map(({ y }) => y));
  [minX, maxX] = minimumExtent(minX, maxX);
  [minY, maxY] = minimumExtent(minY, maxY);

  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const scale = Math.min(INNER_WIDTH / spanX, INNER_HEIGHT / spanY);
  const offsetX = INNER_MIN_X + (INNER_WIDTH - spanX * scale) / 2;
  const offsetY = INNER_MIN_Y + (INNER_HEIGHT - spanY * scale) / 2;
  if (![scale, minX, minY, offsetX, offsetY].every(Number.isFinite) || scale <= 0) {
    return { kind: "invalid-projection" };
  }
  return { center, cosLat, scale, minX, minY, offsetX, offsetY };
}

function minimumExtent(minimum: number, maximum: number): [number, number] {
  const span = maximum - minimum;
  if (span >= MIN_EXTENT_M) return [minimum, maximum];
  const center = (minimum + maximum) / 2;
  return [center - MIN_EXTENT_M / 2, center + MIN_EXTENT_M / 2];
}

function toLocalMeters(coordinate: Coordinate, center: Coordinate, cosLat: number): ViewportPoint {
  return {
    x: (coordinate.lon - center.lon) * cosLat * Math.PI / 180 * EARTH_RADIUS_M,
    y: -(coordinate.lat - center.lat) * Math.PI / 180 * EARTH_RADIUS_M,
  };
}

export function projectCoordinate(projection: Projection, coordinate: Coordinate): ViewportPoint {
  const local = toLocalMeters(coordinate, projection.center, projection.cosLat);
  return {
    x: projection.offsetX + (local.x - projection.minX) * projection.scale,
    y: projection.offsetY + (local.y - projection.minY) * projection.scale,
  };
}

export function inverseProject(projection: Projection, point: ViewportPoint): Coordinate {
  const localX = (point.x - projection.offsetX) / projection.scale + projection.minX;
  const localY = (point.y - projection.offsetY) / projection.scale + projection.minY;
  return {
    lat: projection.center.lat - localY / EARTH_RADIUS_M * 180 / Math.PI,
    lon: projection.center.lon + localX / (projection.cosLat * EARTH_RADIUS_M) * 180 / Math.PI,
  };
}

export function clampPoint(point: ViewportPoint): ViewportPoint {
  return {
    x: Math.max(INNER_MIN_X, Math.min(INNER_MAX_X, point.x)),
    y: Math.max(INNER_MIN_Y, Math.min(INNER_MAX_Y, point.y)),
  };
}

export function distanceMeters(start: Coordinate, end: Coordinate): number | DistanceFailure {
  if (!validCoordinate(start) || !validCoordinate(end)) return { kind: "invalid-coordinates" };
  const lat1 = start.lat * Math.PI / 180;
  const lat2 = end.lat * Math.PI / 180;
  const deltaLat = (end.lat - start.lat) * Math.PI / 180;
  const deltaLon = (end.lon - start.lon) * Math.PI / 180;
  const raw = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  const a = Math.max(0, Math.min(1, raw));
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

export function formatDistance(meters: number): string {
  return `${Math.round(meters * YARDS_PER_METER)} yd / ${Math.round(meters)} m`;
}

export function scaleBar(projection: Projection): ScaleBar {
  const maximumMeters = 0.4 * INNER_WIDTH / projection.scale;
  const exponent = Math.floor(Math.log10(maximumMeters));
  const candidates: number[] = [];
  for (let power = exponent - 1; power <= exponent + 1; power += 1) {
    for (const multiplier of [1, 2, 5]) candidates.push(multiplier * 10 ** power);
  }
  // Defensive fallback; finite positive projection scales always yield a fitting candidate.
  const meters = candidates.filter((candidate) => candidate > 0 && candidate <= maximumMeters)
    .sort((left, right) => right - left)[0] ?? 1;
  return { meters, logicalLength: meters * projection.scale, label: formatDistance(meters) };
}

export function warningsForHole(
  hole: NormalizedHole,
  warnings: NormalizationWarning[],
): NormalizationWarning[] {
  const featureKeys = new Set(hole.features.map(({ source }) => source.sourceKey));
  return warnings.filter((warning) =>
    warning.sourceKey === hole.source.sourceKey
    || (hole.number !== null && warning.holeNumber === hole.number)
    || warning.refs.includes(hole.source.sourceKey)
    || warning.refs.some((ref) => featureKeys.has(ref)));
}
``````

<!-- END EXACT FILE 11/20: src/map.ts -->

<!-- BEGIN EXACT FILE 12/20: src/project.ts -->

### src/project.ts

``````text
import type { Coordinate, SourceKey } from "./normalize";

export const PROJECT_SCHEMA = "chart-the-course-project/v1";
export const PROJECT_FILENAME = "chart-the-course-project.json";
export const PROJECT_MIME = "application/json";
export const PROJECT_MAX_BYTES = 524_288;
export const OSM_COPYRIGHT_URL = "https://www.openstreetmap.org/copyright";

export type TargetV1 = Coordinate & {
  id: string;
  label: string;
};

export type CarryOriginV1 =
  | { kind: "tee"; sourceKey: SourceKey }
  | { kind: "target"; targetId: string };

export type CarryV1 = {
  id: string;
  origin: CarryOriginV1;
  distances: number[];
};

export type HoleStateV1 = {
  targets: TargetV1[];
  carries: CarryV1[];
};

export type ProjectV1 = {
  schema: typeof PROJECT_SCHEMA;
  exportedAt: string;
  courseSourceKey: SourceKey;
  courseCopyrightUrl: typeof OSM_COPYRIGHT_URL;
  holes: Partial<Record<SourceKey, HoleStateV1>>;
};

export type ValidationErrorCode =
  | "INVALID_JSON" | "UNSUPPORTED_VERSION" | "WRONG_TYPE" | "MISSING_FIELD"
  | "UNKNOWN_FIELD" | "DANGEROUS_KEY" | "INVALID_FORMAT" | "OUT_OF_RANGE"
  | "NON_FINITE" | "EMPTY_STRING" | "STRING_TOO_LONG" | "DUPLICATE_ID"
  | "EMPTY_ARRAY" | "ARRAY_TOO_LONG" | "NON_INTEGER" | "NON_ASCENDING"
  | "NON_UNIQUE_DISTANCES" | "COURSE_MISMATCH" | "HOLE_MISMATCH";

export type ValidationError = {
  code: ValidationErrorCode;
  path: string;
  message: string;
};

export type ValidationResult =
  | { ok: true; project: ProjectV1 }
  | { ok: false; errors: ValidationError[] };

const SOURCE_KEY = /^(node|way|relation)\/[1-9][0-9]{0,18}$/;
const TARGET_ID = /^t-[0-9a-f]{12}$/;
const CARRY_ID = /^c-[0-9a-f]{12}$/;
const DANGEROUS = new Set(["__proto__", "constructor", "prototype"]);
const MAX_ERRORS = 20;

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

class Errors {
  values: ValidationError[] = [];

  add(code: ValidationErrorCode, path: string, message: string) {
    if (this.values.length >= MAX_ERRORS) return;
    if (this.values.length === MAX_ERRORS - 1) {
      this.values.push({ code: "WRONG_TYPE", path: "$", message: "Too many errors - remaining fields not validated." });
      return;
    }
    this.values.push({ code, path, message });
  }

  shape(value: unknown, allowed: string[], required: string[], path: string): Record<string, unknown> | null {
    const object = record(value);
    if (!object) {
      this.add("WRONG_TYPE", path, "Expected an object.");
      return null;
    }
    for (const key of Object.keys(object)) {
      if (DANGEROUS.has(key)) {
        this.add("DANGEROUS_KEY", `${path}.${key}`, "Unsupported or insecure property.");
        return null;
      }
      if (!allowed.includes(key)) this.add("UNKNOWN_FIELD", `${path}.${key}`, "Unknown property.");
    }
    for (const key of required) {
      if (!Object.hasOwn(object, key)) this.add("MISSING_FIELD", `${path}.${key}`, "Required property is missing.");
    }
    return object;
  }
}

function validSourceKey(value: unknown): value is SourceKey {
  return typeof value === "string" && SOURCE_KEY.test(value);
}

function validDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}/.test(value) && Number.isFinite(Date.parse(value));
}

function validateLabel(value: unknown, path: string, errors: Errors): string | null {
  if (typeof value !== "string") {
    errors.add("WRONG_TYPE", path, "Expected a string.");
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) errors.add("EMPTY_STRING", path, "Label must not be empty.");
  if ([...trimmed].length > 40) errors.add("STRING_TOO_LONG", path, "Label must be 40 characters or fewer.");
  return trimmed && [...trimmed].length <= 40 ? trimmed : null;
}

function validateCoordinate(value: unknown, path: string, minimum: number, maximum: number, errors: Errors): number | null {
  if (typeof value !== "number") {
    errors.add("WRONG_TYPE", path, "Expected a number.");
    return null;
  }
  if (!Number.isFinite(value)) errors.add("NON_FINITE", path, "Number must be finite.");
  else if (value < minimum || value > maximum) errors.add("OUT_OF_RANGE", path, `Number must be between ${minimum} and ${maximum}.`);
  return Number.isFinite(value) && value >= minimum && value <= maximum ? value : null;
}

function validateTarget(value: unknown, path: string, errors: Errors): TargetV1 | null {
  const object = errors.shape(value, ["id", "label", "lat", "lon"], ["id", "label", "lat", "lon"], path);
  if (!object) return null;
  if (typeof object.id !== "string" || !TARGET_ID.test(object.id)) errors.add("INVALID_FORMAT", `${path}.id`, "Invalid target ID.");
  const label = validateLabel(object.label, `${path}.label`, errors);
  const lat = validateCoordinate(object.lat, `${path}.lat`, -90, 90, errors);
  const lon = validateCoordinate(object.lon, `${path}.lon`, -180, 180, errors);
  return typeof object.id === "string" && TARGET_ID.test(object.id) && label !== null && lat !== null && lon !== null
    ? { id: object.id, label, lat, lon }
    : null;
}

function validateOrigin(value: unknown, path: string, errors: Errors): CarryOriginV1 | null {
  const object = record(value);
  if (!object || typeof object.kind !== "string") {
    errors.add("WRONG_TYPE", path, "Expected a carry origin object.");
    return null;
  }
  if (object.kind === "tee") {
    const shaped = errors.shape(object, ["kind", "sourceKey"], ["kind", "sourceKey"], path);
    if (!shaped || !validSourceKey(shaped.sourceKey)) {
      errors.add("INVALID_FORMAT", `${path}.sourceKey`, "Invalid tee source key.");
      return null;
    }
    return { kind: "tee", sourceKey: shaped.sourceKey };
  }
  if (object.kind === "target") {
    const shaped = errors.shape(object, ["kind", "targetId"], ["kind", "targetId"], path);
    if (!shaped || typeof shaped.targetId !== "string" || !TARGET_ID.test(shaped.targetId)) {
      errors.add("INVALID_FORMAT", `${path}.targetId`, "Invalid target ID.");
      return null;
    }
    return { kind: "target", targetId: shaped.targetId };
  }
  errors.add("INVALID_FORMAT", `${path}.kind`, "Origin kind must be tee or target.");
  return null;
}

function validateCarry(value: unknown, path: string, errors: Errors): CarryV1 | null {
  const object = errors.shape(value, ["id", "origin", "distances"], ["id", "origin", "distances"], path);
  if (!object) return null;
  if (typeof object.id !== "string" || !CARRY_ID.test(object.id)) errors.add("INVALID_FORMAT", `${path}.id`, "Invalid carry ID.");
  const origin = validateOrigin(object.origin, `${path}.origin`, errors);
  if (!Array.isArray(object.distances)) {
    errors.add("WRONG_TYPE", `${path}.distances`, "Expected an array.");
    return null;
  }
  if (object.distances.length === 0) errors.add("EMPTY_ARRAY", `${path}.distances`, "At least one carry distance is required.");
  if (object.distances.length > 5) errors.add("ARRAY_TOO_LONG", `${path}.distances`, "At most five carry distances are allowed.");
  const distances: number[] = [];
  object.distances.forEach((distance, index) => {
    const itemPath = `${path}.distances[${index}]`;
    if (typeof distance !== "number" || !Number.isInteger(distance)) errors.add("NON_INTEGER", itemPath, "Carry distance must be an integer.");
    else if (distance < 1 || distance > 700) errors.add("OUT_OF_RANGE", itemPath, "Carry distance must be between 1 and 700 yards.");
    else distances.push(distance);
  });
  if (new Set(distances).size !== distances.length) errors.add("NON_UNIQUE_DISTANCES", `${path}.distances`, "Carry distances must be unique.");
  if (distances.some((distance, index) => index > 0 && distance <= distances[index - 1])) {
    errors.add("NON_ASCENDING", `${path}.distances`, "Carry distances must be ascending.");
  }
  return typeof object.id === "string" && CARRY_ID.test(object.id) && origin && distances.length === object.distances.length
    && distances.length >= 1 && distances.length <= 5 && new Set(distances).size === distances.length
    && !distances.some((distance, index) => index > 0 && distance <= distances[index - 1])
    ? { id: object.id, origin, distances }
    : null;
}

function validateHole(value: unknown, path: string, errors: Errors, ids: Set<string>): HoleStateV1 | null {
  const object = errors.shape(value, ["targets", "carries"], ["targets", "carries"], path);
  if (!object) return null;
  if (!Array.isArray(object.targets)) errors.add("WRONG_TYPE", `${path}.targets`, "Expected an array.");
  if (!Array.isArray(object.carries)) errors.add("WRONG_TYPE", `${path}.carries`, "Expected an array.");
  if (Array.isArray(object.targets) && object.targets.length > 10) {
    errors.add("ARRAY_TOO_LONG", `${path}.targets`, "At most ten targets are allowed per hole.");
  }
  if (Array.isArray(object.carries) && object.carries.length > 5) {
    errors.add("ARRAY_TOO_LONG", `${path}.carries`, "At most five carry records are allowed per hole.");
  }
  for (const item of [
    ...(Array.isArray(object.targets) ? object.targets : []),
    ...(Array.isArray(object.carries) ? object.carries : []),
  ]) {
    const id = record(item)?.id;
    if (typeof id !== "string") continue;
    if (ids.has(id)) errors.add("DUPLICATE_ID", path, `Duplicate project ID: ${id}.`);
    ids.add(id);
  }
  const targets = Array.isArray(object.targets)
    ? object.targets.map((target, index) => validateTarget(target, `${path}.targets[${index}]`, errors)).filter((target): target is TargetV1 => target !== null)
    : [];
  const carries = Array.isArray(object.carries)
    ? object.carries.map((carry, index) => validateCarry(carry, `${path}.carries[${index}]`, errors)).filter((carry): carry is CarryV1 => carry !== null)
    : [];
  return Array.isArray(object.targets) && Array.isArray(object.carries)
    && targets.length === object.targets.length && carries.length === object.carries.length
    && targets.length <= 10 && carries.length <= 5 ? { targets, carries } : null;
}

export function validateProjectFile(raw: unknown): ValidationResult {
  const errors = new Errors();
  const object = errors.shape(raw, ["schema", "exportedAt", "courseSourceKey", "courseCopyrightUrl", "holes"],
    ["schema", "exportedAt", "courseSourceKey", "courseCopyrightUrl", "holes"], "$");
  if (!object) return { ok: false, errors: errors.values };
  if (object.schema !== PROJECT_SCHEMA) {
    return { ok: false, errors: [{ code: "UNSUPPORTED_VERSION", path: "$.schema", message: `Only ${PROJECT_SCHEMA} is supported.` }] };
  }
  if (!validDate(object.exportedAt)) errors.add("INVALID_FORMAT", "$.exportedAt", "Invalid export timestamp.");
  if (!validSourceKey(object.courseSourceKey)) errors.add("INVALID_FORMAT", "$.courseSourceKey", "Invalid course source key.");
  if (object.courseCopyrightUrl !== OSM_COPYRIGHT_URL) errors.add("INVALID_FORMAT", "$.courseCopyrightUrl", "Invalid copyright URL.");
  const holesObject = errors.shape(object.holes, Object.keys(record(object.holes) ?? {}), [], "$.holes");
  const holes: Partial<Record<SourceKey, HoleStateV1>> = {};
  const ids = new Set<string>();
  if (holesObject) {
    for (const key of Object.keys(holesObject).sort()) {
      if (!validSourceKey(key)) {
        errors.add("INVALID_FORMAT", `$.holes.${key}`, "Invalid hole source key.");
        continue;
      }
      const hole = validateHole(holesObject[key], `$.holes.${key}`, errors, ids);
      if (hole) holes[key] = hole;
    }
  }
  return errors.values.length === 0 && validDate(object.exportedAt) && validSourceKey(object.courseSourceKey)
    && object.courseCopyrightUrl === OSM_COPYRIGHT_URL
    ? { ok: true, project: { schema: PROJECT_SCHEMA, exportedAt: object.exportedAt, courseSourceKey: object.courseSourceKey, courseCopyrightUrl: OSM_COPYRIGHT_URL, holes } }
    : { ok: false, errors: errors.values };
}

export function parseProjectText(text: string): ValidationResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, errors: [{ code: "INVALID_JSON", path: "$", message: "File is not valid JSON." }] };
  }
  return validateProjectFile(raw);
}

export function projectMatchErrors(project: ProjectV1, courseSourceKey: SourceKey, holeKeys: SourceKey[]): ValidationError[] {
  const errors: ValidationError[] = [];
  if (project.courseSourceKey !== courseSourceKey) {
    errors.push({ code: "COURSE_MISMATCH", path: "$.courseSourceKey", message: `Project course ${project.courseSourceKey} does not match loaded course ${courseSourceKey}.` });
  }
  const known = new Set(holeKeys);
  for (const key of Object.keys(project.holes).sort()) {
    if (!known.has(key as SourceKey)) errors.push({ code: "HOLE_MISMATCH", path: `$.holes.${key}`, message: `Project hole ${key} is not available in the loaded course.` });
  }
  return errors.slice(0, MAX_ERRORS);
}

export function emptyProject(courseSourceKey: SourceKey, exportedAt = new Date().toISOString()): ProjectV1 {
  return { schema: PROJECT_SCHEMA, exportedAt, courseSourceKey, courseCopyrightUrl: OSM_COPYRIGHT_URL, holes: {} };
}

export function serializeProject(project: ProjectV1): string {
  const holes = Object.fromEntries(Object.entries(project.holes).sort(([left], [right]) => left.localeCompare(right)));
  return `${JSON.stringify({
    schema: project.schema,
    exportedAt: project.exportedAt,
    courseSourceKey: project.courseSourceKey,
    courseCopyrightUrl: project.courseCopyrightUrl,
    holes,
  }, null, 2)}\n`;
}

export function generateProjectId(kind: "target" | "carry"): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const value = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${kind === "target" ? "t" : "c"}-${value}`;
}
``````

<!-- END EXACT FILE 12/20: src/project.ts -->

<!-- BEGIN EXACT FILE 13/20: src/carry.ts -->

### src/carry.ts

``````text
import {
  EARTH_RADIUS_M,
  INNER_MAX_X,
  INNER_MAX_Y,
  INNER_MIN_X,
  INNER_MIN_Y,
  YARDS_PER_METER,
  projectCoordinate,
  type Projection,
  type ViewportPoint,
} from "./map";
import { geometryCoordinates, validCoordinate } from "./map";
import type { Coordinate, NormalizedHole, SourceKey } from "./normalize";
import type { CarryOriginV1, CarryV1, TargetV1 } from "./project";

export type CarryRing = {
  carryId: string;
  yards: number;
  coordinates: Coordinate[];
  points: ViewportPoint[];
  segments: ViewportPoint[][];
  offMap: boolean;
};

export type CarryFailure = { kind: "origin-unavailable" | "invalid-distance" | "invalid-sample" };

export function teeOrigins(hole: NormalizedHole): Array<{ sourceKey: SourceKey; coordinate: Coordinate }> {
  return hole.features.filter(({ kind, geometry }) => kind === "tee" && geometry !== null)
    .map((feature) => ({ sourceKey: feature.source.sourceKey, coordinate: geometryCoordinates(feature.geometry!)[0] }))
    .filter(({ coordinate }) => validCoordinate(coordinate));
}

export function resolveCarryOrigin(origin: CarryOriginV1, hole: NormalizedHole, targets: TargetV1[]): Coordinate | CarryFailure {
  if (origin.kind === "target") {
    const target = targets.find(({ id }) => id === origin.targetId);
    return target && validCoordinate(target) ? { lat: target.lat, lon: target.lon } : { kind: "origin-unavailable" };
  }
  return teeOrigins(hole).find(({ sourceKey }) => sourceKey === origin.sourceKey)?.coordinate ?? { kind: "origin-unavailable" };
}

export function carryCoordinates(origin: Coordinate, yards: number): Coordinate[] | CarryFailure {
  if (!validCoordinate(origin) || !Number.isInteger(yards) || yards < 1 || yards > 700) return { kind: "invalid-distance" };
  const distance = yards / YARDS_PER_METER;
  const angular = distance / EARTH_RADIUS_M;
  const lat0 = origin.lat * Math.PI / 180;
  const lon0 = origin.lon * Math.PI / 180;
  const coordinates: Coordinate[] = [];
  for (let index = 0; index < 64; index += 1) {
    const bearing = index / 64 * 2 * Math.PI;
    const lat = Math.asin(Math.sin(lat0) * Math.cos(angular)
      + Math.cos(lat0) * Math.sin(angular) * Math.cos(bearing));
    const rawLon = lon0 + Math.atan2(
      Math.sin(bearing) * Math.sin(angular) * Math.cos(lat0),
      Math.cos(angular) - Math.sin(lat0) * Math.sin(lat),
    );
    const lon = ((rawLon + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    const coordinate = { lat: lat * 180 / Math.PI, lon: lon * 180 / Math.PI };
    if (!validCoordinate(coordinate)) return { kind: "invalid-sample" };
    coordinates.push(coordinate);
  }
  return [...coordinates, coordinates[0]];
}

function splitSegments(coordinates: Coordinate[], points: ViewportPoint[]): ViewportPoint[][] {
  const segments: ViewportPoint[][] = [[points[0]]];
  for (let index = 1; index < points.length; index += 1) {
    if (Math.abs(coordinates[index].lon - coordinates[index - 1].lon) > 180) segments.push([]);
    segments[segments.length - 1].push(points[index]);
  }
  return segments.filter((segment) => segment.length > 1);
}

export function carryRings(carry: CarryV1, hole: NormalizedHole, targets: TargetV1[], projection: Projection): CarryRing[] | CarryFailure {
  const origin = resolveCarryOrigin(carry.origin, hole, targets);
  if ("kind" in origin) return origin;
  const rings: CarryRing[] = [];
  for (const yards of carry.distances) {
    const coordinates = carryCoordinates(origin, yards);
    if (!Array.isArray(coordinates)) return coordinates;
    const points = coordinates.map((coordinate) => projectCoordinate(projection, coordinate));
    rings.push({
      carryId: carry.id,
      yards,
      coordinates,
      points,
      segments: splitSegments(coordinates, points),
      offMap: points.some(({ x, y }) => x < INNER_MIN_X || x > INNER_MAX_X || y < INNER_MIN_Y || y > INNER_MAX_Y),
    });
  }
  return rings;
}
``````

<!-- END EXACT FILE 13/20: src/carry.ts -->

<!-- BEGIN EXACT FILE 14/20: src/HoleMap.tsx -->

### src/HoleMap.tsx

``````text
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type {
  Coordinate,
  Geometry,
  NormalizationWarning,
  NormalizedHole,
  SourceKey,
} from "./normalize";
import type { SourceMetadata } from "./overpass";
import { carryRings, teeOrigins } from "./carry";
import { generateProjectId, type CarryOriginV1, type HoleStateV1, type TargetV1 } from "./project";
import {
  INNER_MAX_X,
  INNER_MAX_Y,
  INNER_MIN_X,
  INNER_MIN_Y,
  LAYER_ORDER,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  clampPoint,
  createProjection,
  distanceMeters,
  formatDistance,
  geometryCoordinates,
  holeCoordinates,
  inverseProject,
  projectCoordinate,
  scaleBar,
  validCoordinate,
  warningsForHole,
  type Projection,
  type ViewportPoint,
} from "./map";

type HoleMapProps = {
  hole: NormalizedHole;
  warnings: NormalizationWarning[];
  source: SourceMetadata;
  project: HoleStateV1;
  onProjectChange: (project: HoleStateV1) => void;
};

type Measurement = { start: Coordinate | null; end: Coordinate | null };
type Mode = "measure" | "place-target" | "reposition-target";

function geometryElement(
  geometry: Geometry,
  projection: Projection,
  key: string,
  className: string,
) {
  const points = geometryCoordinates(geometry).map((coordinate) => projectCoordinate(projection, coordinate));
  if (geometry.type === "point") {
    return <circle key={key} className={className} cx={points[0].x} cy={points[0].y} r="7" />;
  }
  const value = points.map(({ x, y }) => `${x},${y}`).join(" ");
  return geometry.type === "line"
    ? <polyline key={key} className={className} points={value} />
    : <polygon key={key} className={className} points={value} />;
}

function warningText(warning: NormalizationWarning): string {
  return `${warning.code}: ${warning.affectedIdentity}`;
}

export function HoleMap({ hole, warnings, source, project, onProjectChange }: HoleMapProps) {
  const projection = useMemo(() => createProjection(holeCoordinates(hole)), [hole]);
  const [measurement, setMeasurement] = useState<Measurement>({ start: null, end: null });
  const [crosshair, setCrosshair] = useState<ViewportPoint>({ x: 400, y: 300 });
  const [announcement, setAnnouncement] = useState("");
  const [mode, setMode] = useState<Mode>("measure");
  const [repositionId, setRepositionId] = useState<string | null>(null);
  const [lastDeleted, setLastDeleted] = useState<{ target: TargetV1; index: number } | null>(null);
  const [carryErrors, setCarryErrors] = useState<Record<string, string>>({});
  const [targetErrors, setTargetErrors] = useState<Record<string, string>>({});
  const undoButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMeasurement({ start: null, end: null });
    setCrosshair({ x: 400, y: 300 });
    setMode("measure");
    setRepositionId(null);
    setLastDeleted(null);
    setAnnouncement("Selected hole changed. Measurement cleared.");
  }, [hole.source.sourceKey]);

  useEffect(() => {
    if (lastDeleted) requestAnimationFrame(() => undoButton.current?.focus());
  }, [lastDeleted]);

  if ("kind" in projection) {
    return <p className="map-empty" role="status">No renderable geometry is available for this selected hole.</p>;
  }

  const selectedWarnings = warningsForHole(hole, warnings);
  const bar = scaleBar(projection);
  const distance = measurement.start && measurement.end
    ? distanceMeters(measurement.start, measurement.end)
    : null;
  const distanceLabel = typeof distance === "number" ? formatDistance(distance) : null;

  function placeAnchor(point: ViewportPoint) {
    if ("kind" in projection) return;
    const coordinate = inverseProject(projection, clampPoint(point));
    setMeasurement((current) => {
      if (!current.start || current.end) {
        setAnnouncement(current.end ? "Measurement restarted. First point placed." : "First point placed.");
        return { start: coordinate, end: null };
      }
      const measured = distanceMeters(current.start, coordinate);
      setAnnouncement(typeof measured === "number" ? `Distance: ${formatDistance(measured)}.` : "Measurement failed.");
      return { start: current.start, end: coordinate };
    });
  }

  function confirmTarget(point: ViewportPoint) {
    if ("kind" in projection) return;
    const coordinate = inverseProject(projection, clampPoint(point));
    if (!validCoordinate(coordinate)) {
      setAnnouncement("Placement coordinates out of range.");
      return;
    }
    if (mode === "place-target") {
      if (project.targets.length >= 10) {
        setAnnouncement("At most ten targets are allowed per hole.");
        return;
      }
      const target: TargetV1 = {
        id: generateProjectId("target"),
        label: `Target ${project.targets.length + 1}`,
        ...coordinate,
      };
      onProjectChange({ ...project, targets: [...project.targets, target] });
      setLastDeleted(null);
      setMode("measure");
      setAnnouncement(`${target.label} added.`);
    } else if (mode === "reposition-target" && repositionId) {
      const target = project.targets.find(({ id }) => id === repositionId);
      onProjectChange({
        ...project,
        targets: project.targets.map((entry) => entry.id === repositionId ? { ...entry, ...coordinate } : entry),
      });
      setLastDeleted(null);
      setMode("measure");
      setRepositionId(null);
      setAnnouncement(`${target?.label ?? "Target"} repositioned.`);
    }
  }

  function pointerPoint(event: PointerEvent<SVGSVGElement>): ViewportPoint | null {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return null;
    const point = event.currentTarget.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const logical = point.matrixTransform(matrix.inverse());
    return clampPoint({ x: logical.x, y: logical.y });
  }

  function handlePointer(event: PointerEvent<SVGSVGElement>) {
    if (!event.isPrimary) return;
    const point = pointerPoint(event);
    if (!point) return;
    setCrosshair(point);
    if (mode === "measure") placeAnchor(point);
    else confirmTarget(point);
  }

  function clearMeasurement() {
    setMeasurement({ start: null, end: null });
    setCrosshair({ x: 400, y: 300 });
    setAnnouncement("Measurement cleared.");
  }

  function handleKey(event: KeyboardEvent<SVGSVGElement>) {
    const steps: Record<string, ViewportPoint> = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
    };
    const direction = steps[event.key];
    if (direction) {
      event.preventDefault();
      const step = event.shiftKey ? 20 : 4;
      setCrosshair((current) => clampPoint({
        x: current.x + direction.x * step,
        y: current.y + direction.y * step,
      }));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (mode === "measure") placeAnchor(crosshair);
      else confirmTarget(crosshair);
    } else if (event.key === "Escape") {
      event.preventDefault();
      if (mode === "measure") clearMeasurement();
      else {
        setMode("measure");
        setRepositionId(null);
        setAnnouncement("Target placement cancelled.");
      }
    }
  }

  const startPoint = measurement.start ? projectCoordinate(projection, measurement.start) : null;
  const endPoint = measurement.end ? projectCoordinate(projection, measurement.end) : null;
  const carryModels = project.carries.map((carry) => ({ carry, rings: carryRings(carry, hole, project.targets, projection) }));
  const clipId = `map-inner-clip-${hole.source.sourceKey.replace("/", "-")}`;
  const availableTees = teeOrigins(hole);

  function changeTargetLabel(id: string, label: string): boolean {
    const trimmed = label.trim();
    if (!trimmed || [...trimmed].length > 40) {
      setTargetErrors((current) => ({ ...current, [id]: "Use a label from 1 to 40 characters." }));
      return false;
    }
    onProjectChange({ ...project, targets: project.targets.map((target) => target.id === id ? { ...target, label: trimmed } : target) });
    setTargetErrors((current) => ({ ...current, [id]: "" }));
    setLastDeleted(null);
    return true;
  }

  function deleteTarget(id: string) {
    const index = project.targets.findIndex((entry) => entry.id === id);
    if (index === -1) return;
    const target = project.targets[index];
    onProjectChange({ ...project, targets: project.targets.filter((entry) => entry.id !== id) });
    setLastDeleted({ target, index });
    setAnnouncement(`${target.label} deleted. Undo available.`);
  }

  function addCarry() {
    if (project.carries.length >= 5) return;
    const origin: CarryOriginV1 | null = availableTees[0]
      ? { kind: "tee", sourceKey: availableTees[0].sourceKey }
      : project.targets[0] ? { kind: "target", targetId: project.targets[0].id } : null;
    if (!origin) {
      setAnnouncement("Add a target or load tee geometry before adding carry arcs.");
      return;
    }
    onProjectChange({ ...project, carries: [...project.carries, { id: generateProjectId("carry"), origin, distances: [150] }] });
    setLastDeleted(null);
    setAnnouncement("Carry arc added.");
  }

  function updateCarryOrigin(id: string, value: string) {
    const separator = value.indexOf(":");
    const kind = value.slice(0, separator);
    const identity = value.slice(separator + 1);
    const origin: CarryOriginV1 = kind === "tee"
      ? { kind: "tee", sourceKey: identity as SourceKey }
      : { kind: "target", targetId: identity };
    onProjectChange({ ...project, carries: project.carries.map((carry) => carry.id === id ? { ...carry, origin } : carry) });
    setLastDeleted(null);
  }

  function updateCarryDistances(id: string, value: string): boolean {
    const distances = value.split(",").map((item) => Number(item.trim()));
    if (distances.length < 1 || distances.length > 5 || distances.some((distance) => !Number.isInteger(distance) || distance < 1 || distance > 700)
      || new Set(distances).size !== distances.length || distances.some((distance, index) => index > 0 && distance <= distances[index - 1])) {
      setCarryErrors((current) => ({ ...current, [id]: "Use 1 to 5 unique ascending whole-yard distances from 1 to 700." }));
      return false;
    }
    onProjectChange({ ...project, carries: project.carries.map((carry) => carry.id === id ? { ...carry, distances } : carry) });
    setCarryErrors((current) => ({ ...current, [id]: "" }));
    setLastDeleted(null);
    return true;
  }

  return (
    <section className="hole-map-panel" aria-labelledby="hole-map-title">
      <div className="map-heading">
        <div>
          <p className="eyebrow">Selected hole</p>
          <h3 id="hole-map-title">{hole.number === null ? hole.source.sourceKey : `Hole ${hole.number}`}</h3>
        </div>
        <button className="secondary" type="button" onClick={clearMeasurement}
          disabled={!measurement.start && !measurement.end}>Clear measurement</button>
      </div>
      <div className="map-tools" aria-label="Map interaction mode">
        <button className={mode === "measure" ? "" : "secondary"} type="button" onClick={() => setMode("measure")}>Measure</button>
        <button className={mode === "place-target" ? "" : "secondary"} type="button"
          onClick={() => { setMode("place-target"); setRepositionId(null); setAnnouncement("Place target mode."); }}>Add target</button>
      </div>
      <p className="map-instructions">{mode === "measure" ? "Click or tap two map points." : "Click, tap, or use the keyboard crosshair to place the target."} Keyboard: arrows move the crosshair, Enter or Space selects, Escape clears or cancels.</p>
      <svg className="hole-map" data-testid="hole-vector-map"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="xMidYMid meet"
        tabIndex={0} role="group" aria-label="Selected hole vector map and measurement surface"
        onPointerDown={handlePointer} onKeyDown={handleKey}>
        <title>Selected hole vector map</title>
        <desc>Blank vector-only OpenStreetMap-derived golf hole geometry with two-point measurement controls.</desc>
        <defs><clipPath id={clipId}><rect x={INNER_MIN_X} y={INNER_MIN_Y}
          width={INNER_MAX_X - INNER_MIN_X} height={INNER_MAX_Y - INNER_MIN_Y} /></clipPath></defs>
        <rect className="map-inner-boundary" x={INNER_MIN_X} y={INNER_MIN_Y}
          width={INNER_MAX_X - INNER_MIN_X} height={INNER_MAX_Y - INNER_MIN_Y} />
        {LAYER_ORDER.map((kind) => (
          <g key={kind} data-layer={kind} className={`map-layer layer-${kind}`}>
            {hole.features.filter((feature) => feature.kind === kind && feature.geometry)
              .map((feature) => geometryElement(feature.geometry!, projection, feature.source.sourceKey, "map-feature"))}
          </g>
        ))}
        <g data-layer="route" className="map-layer layer-route">
          {hole.route && geometryElement(hole.route, projection, hole.source.sourceKey, "map-route")}
        </g>
        <g data-layer="carry-arcs" className="map-layer layer-carry-arcs" clipPath={`url(#${clipId})`}>
          {carryModels.flatMap(({ carry, rings }) => Array.isArray(rings) ? rings.flatMap((ring) => {
            const label = ring.points.reduce((top, point) => point.y < top.y ? point : top);
            return [
              ...ring.segments.map((segment, index) => <polyline key={`${carry.id}-${ring.yards}-${index}`} data-carry-id={carry.id}
                className="carry-arc" points={segment.map(({ x, y }) => `${x},${y}`).join(" ")} />),
              <text key={`${carry.id}-${ring.yards}-label`} className="carry-label" x={label.x} y={label.y - 6}>
                {ring.yards} yd
              </text>,
            ];
          }) : [])}
        </g>
        <g data-layer="targets" className="map-layer layer-targets">
          {project.targets.map((target) => {
            const point = projectCoordinate(projection, target);
            return <g key={target.id} className="target-marker" data-target-id={target.id} role="button" tabIndex={0}
              aria-label={`${target.label}, target`} onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => { event.stopPropagation(); setAnnouncement(`${target.label} selected.`); }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault(); event.stopPropagation(); setAnnouncement(`${target.label} selected.`);
                }
              }}>
              <circle className="target-hit" cx={point.x} cy={point.y} r="22" />
              <circle className="target-outer" cx={point.x} cy={point.y} r="8" />
              <circle className="target-inner" cx={point.x} cy={point.y} r="3" />
            </g>;
          })}
        </g>
        <g data-layer="measurement" className={`map-layer layer-measurement ${mode === "measure" ? "" : "inactive"}`}>
          {startPoint && endPoint && <line className="measurement-line" x1={startPoint.x} y1={startPoint.y} x2={endPoint.x} y2={endPoint.y} />}
          {startPoint && <circle className="measurement-anchor" cx={startPoint.x} cy={startPoint.y} r="8" />}
          {endPoint && <circle className="measurement-anchor" cx={endPoint.x} cy={endPoint.y} r="8" />}
          <path className="keyboard-crosshair" d={`M ${crosshair.x - 8} ${crosshair.y} H ${crosshair.x + 8} M ${crosshair.x} ${crosshair.y - 8} V ${crosshair.y + 8}`} />
        </g>
        <g className="scale-bar" aria-label={`Scale ${bar.label}`}>
          <line x1={INNER_MIN_X} y1={INNER_MAX_Y - 18} x2={INNER_MIN_X + bar.logicalLength} y2={INNER_MAX_Y - 18} />
          <text x={INNER_MIN_X} y={INNER_MAX_Y - 24}>{bar.label}</text>
        </g>
      </svg>
      <p className="measurement-result" aria-live="polite">
        {distanceLabel ? `Distance: ${distanceLabel}` : measurement.start ? "Select the second point." : "No measurement selected."}
      </p>
      <span className="sr-only" aria-live="polite">{announcement}</span>
      <section className="project-panel" aria-labelledby="targets-title">
        <div className="map-heading">
          <h4 id="targets-title">Targets</h4>
          {lastDeleted && <button ref={undoButton} className="secondary" type="button" onClick={() => {
            onProjectChange({
              ...project,
              targets: [
                ...project.targets.slice(0, lastDeleted.index),
                lastDeleted.target,
                ...project.targets.slice(lastDeleted.index),
              ],
            });
            setAnnouncement(`${lastDeleted.target.label} restored.`);
            setLastDeleted(null);
          }}>Undo delete</button>}
        </div>
        {project.targets.length === 0 ? <p>No targets added.</p> : <ul className="target-list">
          {project.targets.map((target) => <li key={target.id}>
            <label>Target label<input key={`${target.id}-${target.label}`} defaultValue={target.label} maxLength={40}
              onBlur={(event) => { if (!changeTargetLabel(target.id, event.currentTarget.value)) event.currentTarget.value = target.label; }}
              onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} /></label>
            {targetErrors[target.id] && <p className="warning">{targetErrors[target.id]}</p>}
            <div className="actions">
              <button className="secondary" type="button" onClick={() => {
                setMode("reposition-target"); setRepositionId(target.id);
                setCrosshair(projectCoordinate(projection, target)); setAnnouncement(`Repositioning ${target.label}.`);
              }}>Reposition</button>
              <button className="secondary danger" type="button" onClick={() => deleteTarget(target.id)}>Delete</button>
            </div>
          </li>)}
        </ul>}
      </section>
      <section className="project-panel" aria-labelledby="carry-title">
        <div className="map-heading"><h4 id="carry-title">Carry arcs</h4>
          <button className="secondary" type="button" disabled={project.carries.length >= 5} onClick={addCarry}>Add carry</button></div>
        {availableTees.length === 0 && <p className="warning">No tee geometry available for this hole.</p>}
        {project.carries.length === 0 ? <p>No carry arcs added.</p> : <ul className="carry-list">
          {project.carries.map((carry) => {
            const model = carryModels.find((entry) => entry.carry.id === carry.id)?.rings;
            return <li key={carry.id}>
              <label>Origin<select value={`${carry.origin.kind}:${carry.origin.kind === "tee" ? carry.origin.sourceKey : carry.origin.targetId}`}
                onChange={(event) => updateCarryOrigin(carry.id, event.target.value)}>
                {availableTees.map((tee) => <option key={tee.sourceKey} value={`tee:${tee.sourceKey}`}>Tee {tee.sourceKey}</option>)}
                {project.targets.map((target) => <option key={target.id} value={`target:${target.id}`}>{target.label}</option>)}
              </select></label>
              <label>Distances in yards<input key={`${carry.id}-${carry.distances.join("-")}`} defaultValue={carry.distances.join(", ")}
                onBlur={(event) => { if (!updateCarryDistances(carry.id, event.currentTarget.value)) event.currentTarget.value = carry.distances.join(", "); }} /></label>
              {carryErrors[carry.id] && <p className="warning">{carryErrors[carry.id]}</p>}
              {!Array.isArray(model) && <p className="warning">Carry origin no longer available.</p>}
              {Array.isArray(model) && model.some(({ offMap }) => offMap) && <p className="warning">Part of this carry arc is outside the map view.</p>}
              <button className="secondary danger" type="button" onClick={() =>
                onProjectChange({ ...project, carries: project.carries.filter((entry) => entry.id !== carry.id) })}>Delete carry</button>
            </li>;
          })}
        </ul>}
      </section>
      {selectedWarnings.length > 0 && (
        <div className="map-warnings">
          <strong>Selected-hole data warnings</strong>
          <ul>{selectedWarnings.map((warning) => <li key={`${warning.code}-${warning.affectedIdentity}`}>{warningText(warning)}</li>)}</ul>
        </div>
      )}
      <details>
        <summary>All normalization warnings ({warnings.length})</summary>
        {warnings.length === 0 ? <p>No normalization warnings.</p>
          : <ul>{warnings.map((warning) => <li key={`${warning.code}-${warning.affectedIdentity}`}>{warningText(warning)}</li>)}</ul>}
      </details>
      <p className="attribution">Course data © OpenStreetMap contributors. <a href={source.copyrightUrl}>OpenStreetMap copyright and license</a>.</p>
    </section>
  );
}
``````

<!-- END EXACT FILE 14/20: src/HoleMap.tsx -->

<!-- BEGIN EXACT FILE 15/20: src/styles.css -->

### src/styles.css

``````text
:root {
  color: #17211b;
  background: #f4f3ed;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; }
button, input, select { font: inherit; }
button {
  border: 1px solid #2f6241; border-radius: 6px; background: #2f6241; color: white;
  cursor: pointer; font-weight: 750; min-height: 44px; padding: .7rem 1rem;
}
button.secondary { background: white; color: #2f6241; }
button:disabled { cursor: not-allowed; opacity: .55; }
button:focus-visible, input:focus-visible, select:focus-visible, summary:focus-visible, .hole-map:focus-visible { outline: 3px solid #d18b38; outline-offset: 2px; }

.shell { display: grid; gap: 1rem; margin: 0 auto; max-width: 78rem; min-height: 100vh; padding: clamp(1rem, 3vw, 2.5rem); }
header, .search-panel, .status, .results {
  background: #fffdf8; border: 1px solid #cbd5c5; border-radius: 8px; padding: clamp(1rem, 3vw, 2rem);
}
header { background: #1f3a2a; color: white; }
.eyebrow { color: #9d472b; font-size: .78rem; font-weight: 850; letter-spacing: .04em; margin: 0; text-transform: uppercase; }
header .eyebrow { color: #f5bc7e; }
h1 { font-size: clamp(2.5rem, 7vw, 5.5rem); line-height: .95; margin: .7rem 0; }
h2 { margin: 0 0 1rem; }
.lede { line-height: 1.5; margin: 0; max-width: 52rem; }
form { display: grid; gap: 1rem; }
label { display: grid; font-weight: 750; gap: .35rem; }
label span, .hint { color: #5b685d; font-size: .88rem; font-weight: 450; }
input, select { border: 1px solid #748276; border-radius: 5px; min-height: 44px; padding: .65rem; width: 100%; }
input[aria-invalid="true"] { border-color: #a1261b; }
fieldset { border: 1px solid #cbd5c5; border-radius: 6px; margin: 0; padding: 1rem; }
legend { font-weight: 800; padding: 0 .35rem; }
.coordinate-grid { display: grid; gap: .75rem; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.hint { margin: .75rem 0 0; }
.actions, .map-tools { display: flex; flex-wrap: wrap; gap: .75rem; }
.status { padding-block: 1rem; }
.status p { margin: .25rem 0 0; }
.status.error { border-color: #b85d52; }
.warning { color: #7a4b0e; font-weight: 700; }
.results { display: grid; gap: 1rem; }
.entity-summary { display: grid; gap: .75rem; grid-template-columns: repeat(3, 1fr); margin: 0; }
.entity-summary div { background: #edf2e9; border-radius: 6px; padding: .75rem; }
dt { color: #526054; font-size: .76rem; font-weight: 800; text-transform: uppercase; }
dd { font-weight: 750; margin: .15rem 0 0; }
.candidate-list, .raw-list { display: grid; gap: .6rem; list-style: none; margin: 0; padding: 0; }
.candidate-list li { align-items: center; border-top: 1px solid #dbe2d7; display: flex; gap: 1rem; justify-content: space-between; padding-top: .75rem; }
.candidate-list span { color: #5b685d; display: block; font-size: .85rem; margin-top: .2rem; }
.raw-list li { border-top: 1px solid #dbe2d7; padding-top: .6rem; }
summary { cursor: pointer; font-weight: 800; padding: .5rem 0; }
.diagnostics { display: grid; gap: .75rem; margin: .5rem 0 0; }
.diagnostics dd { overflow-wrap: anywhere; }
pre { background: #18221c; border-radius: 5px; color: #eef4ed; font-size: .8rem; overflow: auto; padding: .75rem; white-space: pre-wrap; }
.attribution { color: #4e5d50; font-size: .88rem; line-height: 1.5; margin: 0; }
.attribution a { color: #245e39; }
.map-workspace { border-top: 1px solid #dbe2d7; display: grid; gap: 1rem; padding-top: 1rem; }
.map-selection, .map-heading { align-items: end; display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; }
.map-selection h3, .map-heading h3 { margin: 0; }
.map-selection label { min-width: 12rem; }
.hole-map-panel { display: grid; gap: .75rem; }
.map-instructions, .measurement-result, .map-empty { margin: 0; }
.hole-map {
  background: #f8f7ef; border: 1px solid #748276; border-radius: 7px; display: block;
  height: auto; touch-action: none; width: 100%;
}
.map-inner-boundary { fill: #eef1e8; stroke: #667268; stroke-dasharray: 7 5; stroke-width: 1; }
.map-feature { stroke-linejoin: round; stroke-width: 2; }
.layer-vegetation { fill: #a9c49b; stroke: #3d6540; stroke-dasharray: 4 3; }
.layer-generic-water { fill: #a8d5e5; stroke: #245f78; stroke-dasharray: 6 3; }
.layer-golf-water { fill: #70b6d2; stroke: #174f69; stroke-width: 3; }
.layer-rough { fill: #c6d6ae; stroke: #667d4b; stroke-dasharray: 3 3; }
.layer-fairway { fill: #b8d59f; stroke: #41653d; }
.layer-bunker { fill: #ead9a0; stroke: #735e28; stroke-dasharray: 2 2; }
.layer-green { fill: #82b980; stroke: #285c35; stroke-width: 3; }
.layer-tee { fill: #d9e7bd; stroke: #244e30; stroke-width: 3; }
.layer-route { fill: none; stroke: #6d351d; stroke-dasharray: 8 5; stroke-width: 4; }
.layer-carry-arcs { fill: none; stroke: #713b89; stroke-dasharray: 12 5 3 5; stroke-width: 3; }
.carry-label { fill: #3f2050; font-size: 14px; font-weight: 800; paint-order: stroke; stroke: #fffdf8; stroke-width: 4; }
.target-hit { fill: transparent; }
.target-outer { fill: #fffdf8; stroke: #512c68; stroke-width: 4; }
.target-inner { fill: #512c68; }
.target-marker:focus-visible { outline: none; }
.target-marker:focus-visible .target-hit { fill: none; stroke: #d18b38; stroke-width: 4; }
.measurement-line { stroke: #932b20; stroke-dasharray: 6 4; stroke-width: 4; }
.measurement-anchor { fill: #fffdf8; stroke: #932b20; stroke-width: 4; }
.keyboard-crosshair { fill: none; stroke: #111; stroke-width: 3; }
.scale-bar line { stroke: #111; stroke-width: 5; }
.scale-bar text { fill: #111; font-size: 16px; font-weight: 800; }
.measurement-result { font-size: 1.1rem; font-weight: 800; }
.layer-measurement.inactive { opacity: .4; }
.map-warnings { border-left: 4px solid #a86619; padding-left: .75rem; }
.map-warnings ul, .hole-map-panel details ul { margin-bottom: 0; }
.project-panel, .project-io { background: #f5f7f1; border: 1px solid #cbd5c5; border-radius: 6px; display: grid; gap: .75rem; padding: 1rem; }
.project-panel h4, .project-io h3, .project-errors h4, .project-panel p { margin: 0; }
.target-list, .carry-list { display: grid; gap: .75rem; list-style: none; margin: 0; padding: 0; }
.target-list li, .carry-list li { background: #fffdf8; border: 1px solid #dbe2d7; border-radius: 5px; display: grid; gap: .75rem; padding: .75rem; }
.danger { border-color: #8b3028; color: #8b3028; }
.file-label { align-content: center; border: 1px solid #2f6241; border-radius: 6px; color: #2f6241; cursor: pointer; min-height: 44px; padding: .7rem 1rem; }
.file-label input { height: 1px; min-height: 0; opacity: 0; padding: 0; position: absolute; width: 1px; }
.file-label:focus-within { outline: 3px solid #d18b38; outline-offset: 2px; }
.project-errors { border-left: 4px solid #a1261b; padding-left: .75rem; }
.project-errors code { overflow-wrap: anywhere; }
.sr-only {
  clip: rect(0, 0, 0, 0); clip-path: inset(50%); height: 1px; overflow: hidden;
  position: absolute; white-space: nowrap; width: 1px;
}

@media (max-width: 700px) {
  .coordinate-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .candidate-list li { align-items: stretch; flex-direction: column; }
  .candidate-list button { width: 100%; }
  .map-heading button, .map-selection label { width: 100%; }
}
``````

<!-- END EXACT FILE 15/20: src/styles.css -->

<!-- BEGIN EXACT FILE 16/20: fixtures/overpass/synthetic-golf-course-ctc006.json -->

### fixtures/overpass/synthetic-golf-course-ctc006.json

``````text
{
  "chartTheCourseFixture": {
    "synthetic": true,
    "purpose": "CTC-006 all selected-hole layers",
    "contract": "docs/overpass-query-contract.md",
    "sourceCopyrightUrl": "https://www.openstreetmap.org/copyright",
    "bbox": { "south": 35, "west": -80, "north": 35.01, "east": -79.99 },
    "queryPurpose": "golf-course-detail"
  },
  "elements": [
    {
      "type": "way",
      "id": 9000060001,
      "geometry": [
        { "lat": 35, "lon": -80 },
        { "lat": 35.01, "lon": -80 },
        { "lat": 35.01, "lon": -79.99 },
        { "lat": 35, "lon": -79.99 },
        { "lat": 35, "lon": -80 }
      ],
      "tags": { "leisure": "golf_course", "name": "Synthetic CTC-006 Course" }
    },
    {
      "type": "way",
      "id": 9000060101,
      "geometry": [
        { "lat": 35.001, "lon": -79.999 },
        { "lat": 35.004, "lon": -79.9965 },
        { "lat": 35.008, "lon": -79.993 }
      ],
      "tags": { "golf": "hole", "ref": "1", "par": "4" }
    },
    {
      "type": "way",
      "id": 9000060201,
      "geometry": [
        { "lat": 35.0008, "lon": -79.9993 },
        { "lat": 35.0013, "lon": -79.9993 },
        { "lat": 35.0013, "lon": -79.9987 },
        { "lat": 35.0008, "lon": -79.9993 }
      ],
      "tags": { "golf": "tee", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060301,
      "geometry": [
        { "lat": 35.002, "lon": -79.9982 },
        { "lat": 35.006, "lon": -79.9958 },
        { "lat": 35.0055, "lon": -79.9948 },
        { "lat": 35.002, "lon": -79.9982 }
      ],
      "tags": { "golf": "fairway", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060401,
      "geometry": [
        { "lat": 35.0075, "lon": -79.9935 },
        { "lat": 35.0082, "lon": -79.9933 },
        { "lat": 35.008, "lon": -79.9926 },
        { "lat": 35.0075, "lon": -79.9935 }
      ],
      "tags": { "golf": "green", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060501,
      "geometry": [
        { "lat": 35.0068, "lon": -79.994 },
        { "lat": 35.0071, "lon": -79.9938 },
        { "lat": 35.0069, "lon": -79.9935 },
        { "lat": 35.0068, "lon": -79.994 }
      ],
      "tags": { "golf": "bunker", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060601,
      "geometry": [
        { "lat": 35.0015, "lon": -79.9988 },
        { "lat": 35.0064, "lon": -79.9955 },
        { "lat": 35.006, "lon": -79.9945 },
        { "lat": 35.0015, "lon": -79.9988 }
      ],
      "tags": { "golf": "rough", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060701,
      "geometry": [
        { "lat": 35.0046, "lon": -79.9962 },
        { "lat": 35.005, "lon": -79.996 },
        { "lat": 35.0048, "lon": -79.9956 },
        { "lat": 35.0046, "lon": -79.9962 }
      ],
      "tags": { "golf": "water_hazard", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060801,
      "geometry": [
        { "lat": 35.0034, "lon": -79.9952 },
        { "lat": 35.004, "lon": -79.995 },
        { "lat": 35.0037, "lon": -79.9945 },
        { "lat": 35.0034, "lon": -79.9952 }
      ],
      "tags": { "natural": "water", "water": "pond", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000060901,
      "geometry": [
        { "lat": 35.0025, "lon": -79.996 },
        { "lat": 35.003, "lon": -79.9958 },
        { "lat": 35.0027, "lon": -79.9954 },
        { "lat": 35.0025, "lon": -79.996 }
      ],
      "tags": { "natural": "wood", "ref": "1" }
    },
    {
      "type": "node",
      "id": 9000060999,
      "lat": 35.009,
      "lon": -79.991,
      "tags": { "natural": "tree" }
    }
  ]
}
``````

<!-- END EXACT FILE 16/20: fixtures/overpass/synthetic-golf-course-ctc006.json -->

<!-- BEGIN EXACT FILE 17/20: src/map.test.ts -->

### src/map.test.ts

``````text
import fixture from "../fixtures/overpass/synthetic-golf-course-ctc006.json";
import { normalizeGolfCourse } from "./normalize";
import {
  EARTH_RADIUS_M,
  INNER_MAX_X,
  INNER_MIN_X,
  LAYER_ORDER,
  clampPoint,
  createProjection,
  distanceMeters,
  formatDistance,
  holeCoordinates,
  inverseProject,
  projectCoordinate,
  scaleBar,
  warningsForHole,
} from "./map";
import type { OverpassResponse, SourceMetadata } from "./overpass";

const source: SourceMetadata = {
  query: "synthetic",
  endpoint: "https://example.invalid",
  completedAt: "2026-06-11T00:00:00Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: "https://www.openstreetmap.org/copyright",
};

const result = normalizeGolfCourse(fixture as OverpassResponse, source);
const hole = result.holes[0];

describe("selected-hole projection", () => {
  it("collects only selected-hole route and associated feature coordinates", () => {
    expect(hole.features.map(({ kind }) => kind).sort()).toEqual([...LAYER_ORDER].sort());
    expect(holeCoordinates(hole).length).toBeGreaterThan(20);
    expect(result.unassociatedFeatures).toHaveLength(1);
  });

  it("projects deterministically, north-up, and inverse-projects within tolerance", () => {
    const projection = createProjection(holeCoordinates(hole));
    expect("kind" in projection).toBe(false);
    if ("kind" in projection) return;
    const coordinate = holeCoordinates(hole)[0];
    const point = projectCoordinate(projection, coordinate);
    const recovered = inverseProject(projection, point);
    expect(recovered.lat).toBeCloseTo(coordinate.lat, 7);
    expect(recovered.lon).toBeCloseTo(coordinate.lon, 7);
    expect(projectCoordinate(projection, coordinate)).toEqual(point);
    expect(projectCoordinate(projection, { lat: coordinate.lat + 0.0001, lon: coordinate.lon }).y).toBeLessThan(point.y);
  });

  it("handles point-only geometry and invalid coordinate sets", () => {
    const projection = createProjection([{ lat: 35, lon: -80 }]);
    expect("kind" in projection).toBe(false);
    if ("kind" in projection) return;
    expect(projectCoordinate(projection, { lat: 35, lon: -80 })).toEqual({ x: 400, y: 300 });
    expect(createProjection([])).toEqual({ kind: "no-valid-coordinates" });
  });
});

describe("measurement helpers", () => {
  it("calculates and formats known, identical, antipodal, and invalid distances", () => {
    const latitudeDelta = distanceMeters({ lat: 35, lon: -80 }, { lat: 35.0009, lon: -80 });
    expect(latitudeDelta).toBeTypeOf("number");
    expect(latitudeDelta as number).toBeCloseTo(100.06, 1);
    expect(formatDistance(latitudeDelta as number)).toBe("109 yd / 100 m");
    expect(distanceMeters({ lat: 35, lon: -80 }, { lat: 35, lon: -80 })).toBe(0);
    expect(distanceMeters({ lat: 90, lon: 0 }, { lat: -90, lon: 0 })).toBeCloseTo(Math.PI * EARTH_RADIUS_M, 5);
    expect(distanceMeters({ lat: Number.NaN, lon: 0 }, { lat: 0, lon: 0 })).toEqual({ kind: "invalid-coordinates" });
  });

  it("clamps interaction points and selects a fitting truthful scale", () => {
    expect(clampPoint({ x: -1, y: 1000 })).toEqual({ x: INNER_MIN_X, y: 560 });
    const projection = createProjection(holeCoordinates(hole));
    if ("kind" in projection) throw new Error(projection.kind);
    const model = scaleBar(projection);
    expect(model.logicalLength).toBeLessThanOrEqual(288);
    expect(model.label).toBe(formatDistance(model.meters));
    expect(INNER_MAX_X).toBe(760);
  });

  it("matches selected-hole warnings only through structured evidence", () => {
    expect(warningsForHole(hole, result.warnings)).toEqual([]);
    expect(warningsForHole(hole, [{
      code: "MISSING_GREEN",
      severity: "error",
      affectedIdentity: hole.source.sourceKey,
      sourceKey: hole.source.sourceKey,
      refs: [hole.source.sourceKey],
    }])).toHaveLength(1);
  });
});
``````

<!-- END EXACT FILE 17/20: src/map.test.ts -->

<!-- BEGIN EXACT FILE 18/20: src/project.test.ts -->

### src/project.test.ts

``````text
import {
  OSM_COPYRIGHT_URL,
  PROJECT_SCHEMA,
  emptyProject,
  parseProjectText,
  projectMatchErrors,
  serializeProject,
  validateProjectFile,
  type ProjectV1,
  type CarryV1,
} from "./project";

const valid: ProjectV1 = {
  schema: PROJECT_SCHEMA,
  exportedAt: "2026-06-12T00:00:00.000Z",
  courseSourceKey: "way/9000000001",
  courseCopyrightUrl: OSM_COPYRIGHT_URL,
  holes: {
    "way/9000000101": {
      targets: [{ id: "t-0123456789ab", label: "Layup", lat: 35, lon: -80 }],
      carries: [{
        id: "c-0123456789ab",
        origin: { kind: "target", targetId: "t-0123456789ab" },
        distances: [150, 200],
      }],
    },
  },
};

describe("project v1 validation", () => {
  it("validates and deterministically round-trips a project", () => {
    const serialized = serializeProject(valid);
    expect(serialized.endsWith("\n")).toBe(true);
    expect(parseProjectText(serialized)).toEqual({ ok: true, project: valid });
    expect(Object.keys(JSON.parse(serialized).holes)).toEqual(["way/9000000101"]);
  });

  it("serializes fixed top-level property order regardless of input insertion order", () => {
    const reordered = {
      holes: valid.holes,
      courseCopyrightUrl: valid.courseCopyrightUrl,
      courseSourceKey: valid.courseSourceKey,
      exportedAt: valid.exportedAt,
      schema: valid.schema,
    } as ProjectV1;
    expect(Object.keys(JSON.parse(serializeProject(reordered)))).toEqual([
      "schema", "exportedAt", "courseSourceKey", "courseCopyrightUrl", "holes",
    ]);
  });

  it("rejects invalid JSON, unsupported versions, unknown fields, and dangerous keys", () => {
    expect(parseProjectText("{").ok).toBe(false);
    expect(validateProjectFile({ ...valid, schema: "chart-the-course-project/v2" })).toEqual({
      ok: false,
      errors: [{ code: "UNSUPPORTED_VERSION", path: "$.schema", message: "Only chart-the-course-project/v1 is supported." }],
    });
    const unknown = validateProjectFile({ ...valid, extra: true });
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.errors.map(({ code }) => code)).toContain("UNKNOWN_FIELD");
    const dangerous = parseProjectText(JSON.stringify(valid).replace('"holes":{', '"holes":{"__proto__":{},'));
    expect(dangerous.ok).toBe(false);
    if (!dangerous.ok) expect(dangerous.errors.map(({ code }) => code)).toContain("DANGEROUS_KEY");
  });

  it("rejects bad coordinates, IDs, duplicate IDs, and invalid carries", () => {
    const broken = structuredClone(valid) as ProjectV1;
    const hole = broken.holes["way/9000000101"]!;
    hole.targets.push({ id: "t-0123456789ab", label: "x".repeat(41), lat: 91, lon: Number.NaN });
    hole.carries[0].distances = [200, 150, 150, 701];
    const result = validateProjectFile(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map(({ code }) => code)).toEqual(expect.arrayContaining([
        "DUPLICATE_ID", "STRING_TOO_LONG", "OUT_OF_RANGE", "NON_FINITE",
        "NON_ASCENDING", "NON_UNIQUE_DISTANCES",
      ]));
    }
  });

  it("reports raw target and carry array bounds even when entries are invalid", () => {
    const broken = structuredClone(valid) as ProjectV1;
    const hole = broken.holes["way/9000000101"]!;
    hole.targets = Array.from({ length: 11 }, (_, index) => ({
      id: `bad-${index}`,
      label: "",
      lat: 91,
      lon: 181,
    }));
    hole.carries = Array.from({ length: 6 }, (_, index) => ({
      id: `bad-${index}`,
      origin: { kind: "target", targetId: "bad" },
      distances: [],
    })) as CarryV1[];
    const result = validateProjectFile(broken);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.filter(({ code }) => code === "ARRAY_TOO_LONG")).toEqual([
        expect.objectContaining({ path: "$.holes.way/9000000101.targets" }),
        expect.objectContaining({ path: "$.holes.way/9000000101.carries" }),
      ]);
    }
  });

  it("caps validation output at twenty errors including the sentinel", () => {
    const result = validateProjectFile(Object.fromEntries([
      ["schema", PROJECT_SCHEMA],
      ["exportedAt", "bad"],
      ["courseSourceKey", "bad"],
      ["courseCopyrightUrl", "bad"],
      ["holes", {}],
      ...Array.from({ length: 30 }, (_, index) => [`extra${index}`, index]),
    ]));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toHaveLength(20);
      expect(result.errors.at(-1)?.message).toContain("Too many errors");
    }
  });

  it("reports course and hole mismatches without changing project data", () => {
    expect(projectMatchErrors(valid, "way/9000000002", ["way/9000000102"])).toEqual([
      expect.objectContaining({ code: "COURSE_MISMATCH" }),
      expect.objectContaining({ code: "HOLE_MISMATCH" }),
    ]);
    expect(emptyProject("way/9000000001", valid.exportedAt)).toEqual({
      schema: PROJECT_SCHEMA,
      exportedAt: valid.exportedAt,
      courseSourceKey: "way/9000000001",
      courseCopyrightUrl: OSM_COPYRIGHT_URL,
      holes: {},
    });
  });
});
``````

<!-- END EXACT FILE 18/20: src/project.test.ts -->

<!-- BEGIN EXACT FILE 19/20: src/carry.test.ts -->

### src/carry.test.ts

``````text
import fixture from "../fixtures/overpass/synthetic-golf-course-ctc006.json";
import { carryCoordinates, carryRings, resolveCarryOrigin, teeOrigins } from "./carry";
import { createProjection, distanceMeters, holeCoordinates } from "./map";
import { normalizeGolfCourse } from "./normalize";
import type { OverpassResponse, SourceMetadata } from "./overpass";

const source: SourceMetadata = {
  query: "synthetic",
  endpoint: "https://example.invalid",
  completedAt: "2026-06-12T00:00:00Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: "https://www.openstreetmap.org/copyright",
};
const result = normalizeGolfCourse(fixture as OverpassResponse, source);
const hole = result.holes[0];

describe("carry geometry", () => {
  it("resolves deterministic tee and target origins", () => {
    const tees = teeOrigins(hole);
    expect(tees).toHaveLength(1);
    expect(resolveCarryOrigin({ kind: "tee", sourceKey: tees[0].sourceKey }, hole, [])).toEqual(tees[0].coordinate);
    expect(resolveCarryOrigin({ kind: "target", targetId: "t-0123456789ab" }, hole,
      [{ id: "t-0123456789ab", label: "Target", lat: 35, lon: -80 }])).toEqual({ lat: 35, lon: -80 });
    expect(resolveCarryOrigin({ kind: "target", targetId: "t-ffffffffffff" }, hole, [])).toEqual({ kind: "origin-unavailable" });
  });

  it("generates a closed 64-bearing ring using the existing distance contract", () => {
    const origin = { lat: 35, lon: -80 };
    const coordinates = carryCoordinates(origin, 150);
    expect(Array.isArray(coordinates)).toBe(true);
    if (!Array.isArray(coordinates)) return;
    expect(coordinates).toHaveLength(65);
    expect(coordinates.at(-1)).toEqual(coordinates[0]);
    for (const coordinate of coordinates.slice(0, 64)) {
      const measured = distanceMeters(origin, coordinate);
      expect(measured).toBeTypeOf("number");
      expect(measured as number).toBeCloseTo(150 * 0.9144, 5);
    }
  });

  it("normalizes and splits an antimeridian-crossing maximum-distance ring", () => {
    const coordinates = carryCoordinates({ lat: 0, lon: 179.999 }, 700);
    expect(Array.isArray(coordinates)).toBe(true);
    if (!Array.isArray(coordinates)) return;
    expect(coordinates.some(({ lon }) => lon < -179)).toBe(true);
    expect(coordinates.every(({ lon }) => lon >= -180 && lon < 180)).toBe(true);
  });

  it("projects clipped carry rings and rejects invalid distances", () => {
    const projection = createProjection(holeCoordinates(hole));
    if ("kind" in projection) throw new Error(projection.kind);
    const tee = teeOrigins(hole)[0];
    const rings = carryRings({ id: "c-0123456789ab", origin: { kind: "tee", sourceKey: tee.sourceKey }, distances: [150] },
      hole, [], projection);
    expect(Array.isArray(rings)).toBe(true);
    if (Array.isArray(rings)) {
      expect(rings[0].segments.length).toBeGreaterThan(0);
      expect(rings[0].offMap).toBeTypeOf("boolean");
    }
    expect(carryCoordinates({ lat: 35, lon: -80 }, 0)).toEqual({ kind: "invalid-distance" });
    expect(carryCoordinates({ lat: 35, lon: -80 }, 701)).toEqual({ kind: "invalid-distance" });
  });
});
``````

<!-- END EXACT FILE 19/20: src/carry.test.ts -->

<!-- BEGIN EXACT FILE 20/20: test/e2e/app.spec.ts -->

### test/e2e/app.spec.ts

``````text
import { expect, test, type Page, type Route } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import ctc006Detail from "../../fixtures/overpass/synthetic-golf-course-ctc006.json" with { type: "json" };

const endpoint = "https://overpass-api.de/api/interpreter";
const discovery = {
  elements: [
    {
      type: "way",
      id: 9000000001,
      bounds: { minlat: 35, minlon: -80, maxlat: 35.01, maxlon: -79.99 },
      tags: { leisure: "golf_course", name: "Synthetic Municipal Course" },
    },
    {
      type: "node",
      id: 9000000002,
      tags: { leisure: "golf_course", name: "Bounds unavailable" },
    },
  ],
};
const syntheticDetail = {
  elements: [
    discovery.elements[0],
    { type: "way", id: 9000000101, tags: { golf: "hole", ref: "1" } },
    { type: "node", id: 9000000201, tags: { golf: "tee", ref: "1" } },
  ],
};

async function isolateNetwork(page: Page, overpassHandler?: (route: Route) => Promise<void> | void) {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (["127.0.0.1", "localhost"].includes(url.hostname)) {
      await route.continue();
    } else if (route.request().url() === endpoint && overpassHandler) {
      await overpassHandler(route);
    } else {
      await route.abort("blockedbyclient");
      throw new Error(`Unexpected external request: ${route.request().url()}`);
    }
  });
}

async function fillBounds(page: Page) {
  await page.getByLabel("South").fill("35");
  await page.getByLabel("West").fill("-80");
  await page.getByLabel("North").fill("35.01");
  await page.getByLabel("East").fill("-79.99");
}

async function assertAxe(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
}

test("discovers candidates, loads detail explicitly, caches it, and shows attribution", async ({ page }) => {
  let discoveryRequests = 0;
  let detailRequests = 0;
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    expect(route.request().method()).toBe("POST");
    if (query.includes("purpose:golf-course-detail")) {
      detailRequests += 1;
      await route.fulfill({ json: syntheticDetail });
    } else {
      discoveryRequests += 1;
      await route.fulfill({ json: discovery });
    }
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("Synthetic.*");
  await page.getByRole("button", { name: "Search courses" }).click();

  await expect(page.getByText("Synthetic Municipal Course")).toBeVisible();
  await expect(page.getByRole("button", { name: "Detail unavailable" })).toBeDisabled();
  await expect(page.getByText(/Data © OpenStreetMap contributors/)).toBeVisible();
  expect(discoveryRequests).toBe(1);
  expect(detailRequests).toBe(0);

  await page.getByRole("button", { name: "Load raw detail" }).click();
  await expect(page.getByText(/raw detail entities loaded/)).toBeVisible();
  await expect(page.getByText("way/9000000001")).toBeVisible();
  expect(detailRequests).toBe(1);

  await page.reload();
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("Synthetic.*");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/raw discovery entities loaded from session cache/)).toBeVisible();
  expect(discoveryRequests).toBe(1);
});

test("makes no requests on keystrokes, blocks duplicate submit, and cancels explicitly", async ({ page }) => {
  let requests = 0;
  await isolateNetwork(page, async (route) => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({ json: discovery });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByLabel(/Course name/).fill("No automatic query");
  expect(requests).toBe(0);

  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByRole("button", { name: "Search courses" })).toBeDisabled();
  expect(requests).toBe(1);
  await page.getByRole("button", { name: "Cancel request" }).click();
  await expect(page.getByText("Request cancelled.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Search courses" })).toBeFocused();
  await page.waitForTimeout(600);
  await expect(page.getByText("Request cancelled.")).toBeVisible();
  expect(requests).toBe(1);
});

test("validates input before requests and focuses the first invalid field", async ({ page }) => {
  let requests = 0;
  await isolateNetwork(page, () => { requests += 1; });
  await page.goto("/");
  await page.getByLabel("South").fill("1e2");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/Use decimal degrees/)).toBeVisible();
  await expect(page.getByLabel("South")).toBeFocused();
  expect(requests).toBe(0);
});

for (const scenario of [
  { name: "rate limit", status: 429, expected: /rate-limited/ },
  { name: "gateway timeout", status: 504, expected: /timed out/ },
  { name: "generic HTTP", status: 500, expected: /HTTP 500/ },
]) {
  test(`shows ${scenario.name} state without retry or failover`, async ({ page }) => {
    let requests = 0;
    await isolateNetwork(page, async (route) => {
      requests += 1;
      await route.fulfill({ status: scenario.status, body: "error" });
    });
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect(page.getByText(scenario.expected)).toBeVisible();
    if (scenario.status === 429) {
      await expect(page.locator(".status")).toHaveAttribute("aria-live", "assertive");
    }
    expect(requests).toBe(1);
  });
}

for (const scenario of [
  { name: "malformed JSON", body: "{", expected: /malformed JSON/ },
  { name: "invalid shape", body: '{"elements":[{"type":"area","id":1}]}', expected: /invalid entity shape/ },
  { name: "empty response", body: '{"elements":[]}', expected: /No discovery results/ },
]) {
  test(`shows ${scenario.name} state`, async ({ page }) => {
    await isolateNetwork(page, async (route) => route.fulfill({ body: scenario.body, contentType: "application/json" }));
    await page.goto("/");
    await fillBounds(page);
    await page.getByRole("button", { name: "Search courses" }).click();
    await expect(page.getByText(scenario.expected)).toBeVisible();
  });
}

test("shows a network failure without retry", async ({ page }) => {
  let requests = 0;
  await isolateNetwork(page, async (route) => {
    requests += 1;
    await route.abort("internetdisconnected");
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/Network request failed/)).toBeVisible();
  expect(requests).toBe(1);
});

test("supports keyboard flow, mobile layout, and axe scans across states", async ({ page }) => {
  let resolveRequest: (() => void) | undefined;
  await isolateNetwork(page, async (route) => {
    await new Promise<void>((resolve) => { resolveRequest = resolve; });
    await route.fulfill({ json: discovery });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await assertAxe(page);
  await fillBounds(page);
  await page.getByLabel("East").press("Enter");
  await expect(page.getByText("Loading discovery results.")).toBeVisible();
  await assertAxe(page);
  resolveRequest?.();
  await expect(page.getByText("Synthetic Municipal Course")).toBeVisible();
  await assertAxe(page);
  const detailButton = page.getByRole("button", { name: "Load raw detail" });
  await expect(detailButton).toBeVisible();
  expect(await detailButton.evaluate((button) => button.getBoundingClientRect().right <= window.innerWidth)).toBe(true);

  await page.getByLabel("South").fill("bad");
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/Use decimal degrees/)).toBeVisible();
  await assertAxe(page);
});

test("accessibility oracle detects a known injected violation", async ({ page }) => {
  await isolateNetwork(page);
  await page.goto("/");
  await page.locator("main").evaluate((main) => {
    main.insertAdjacentHTML("beforeend", '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==">');
  });
  const results = await new AxeBuilder({ page }).include("main").analyze();
  expect(results.violations.map((violation) => violation.id)).toContain("image-alt");
});

test("renders and measures the selected hole with pointer, keyboard, mobile, and attribution support", async ({ page }) => {
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Load raw detail" }).click();

  const map = page.getByTestId("hole-vector-map");
  await expect(map).toBeVisible();
  await expect(page.getByText("Course data © OpenStreetMap contributors.")).toBeVisible();
  for (const layer of ["vegetation", "generic-water", "golf-water", "rough", "fairway", "bunker", "green", "tee", "route", "measurement"]) {
    await expect(map.locator(`[data-layer="${layer}"]`)).toHaveCount(1);
  }
  await expect(map.locator('[data-layer="vegetation"] circle')).toHaveCount(0);
  expect(await map.evaluate((element) => element.getBoundingClientRect().right <= window.innerWidth)).toBe(true);

  await map.click({ position: { x: 60, y: 60 } });
  await expect(page.getByText("Select the second point.")).toBeVisible();
  await map.click({ position: { x: 250, y: 180 } });
  await expect(page.getByText(/^Distance: \d+ yd \/ \d+ m$/)).toBeVisible();
  await map.click({ position: { x: 150, y: 120 } });
  await expect(page.getByText("Select the second point.")).toBeVisible();

  await map.focus();
  await map.press("Escape");
  await expect(page.getByText("No measurement selected.")).toBeVisible();
  await map.press("ArrowRight");
  await map.press("Enter");
  await map.press("Shift+ArrowDown");
  await map.press("Enter");
  await expect(page.getByText(/^Distance: \d+ yd \/ \d+ m$/)).toBeVisible();
  await expect(map).toBeFocused();
  await assertAxe(page);
});

test("manages targets, carry arcs, and strict local project exchange", async ({ page }) => {
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    await route.fulfill({ json: query.includes("purpose:golf-course-detail") ? ctc006Detail : discovery });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Load raw detail" }).click();

  const map = page.getByTestId("hole-vector-map");
  await page.getByRole("button", { name: "Add target" }).click();
  await map.click({ position: { x: 180, y: 180 } });
  await expect(page.locator('input[value="Target 1"]')).toBeVisible();
  await expect(map.locator('[data-layer="targets"] [data-target-id]')).toHaveCount(1);

  await page.getByRole("button", { name: "Add carry" }).click();
  await expect(map.locator('[data-layer="carry-arcs"] [data-carry-id]')).toHaveCount(1);
  await expect(map.locator('[data-layer="carry-arcs"] text')).toHaveText("150 yd");
  await expect(page.getByText(/outside the map view/)).toBeVisible();

  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("button", { name: "Undo delete" })).toBeVisible();
  await page.getByRole("button", { name: "Undo delete" }).click();
  await expect(page.locator('input[value="Target 1"]')).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export project" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("chart-the-course-project.json");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByLabel("Import project file (.json)").setInputFiles("fixtures/projects/synthetic-project-wrong-course.json");
  await expect(page.getByRole("alert")).toContainText("COURSE_MISMATCH");
  await expect(page.locator('input[value="Target 1"]')).toBeVisible();
  await expect(page.getByText("Course data © OpenStreetMap contributors.")).toBeVisible();
  await assertAxe(page);
});
``````

<!-- END EXACT FILE 20/20: test/e2e/app.spec.ts -->
