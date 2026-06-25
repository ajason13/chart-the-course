# CTC-008 Spec Addendum

Date: 2026-06-25

## Accepted Baseline

CTC-008 should implement a dev-only, fixture-backed yardage book PDF prototype.
It must not ship production PDF export behavior yet.

This path satisfies the "prototype" intent while preserving the current
dependency, attribution, source-export, and notes guardrails. Production PDF
export remains a later reviewed adoption task.

## Scope

Authorized:

- Add an isolated fixture-backed PDF prototype entry, analogous to the CTC-014
  experiment pattern.
- Use only the pinned synthetic fixture data from
  `fixtures/overpass/synthetic-golf-course-ctc006.json`.
- Use current devDependency `jspdf@4.2.1` through low-level vector/text APIs.
- Produce a downloadable PDF Blob in the browser for the synthetic fixture.
- Include a cover page, course summary page, and at least one hole page.
- Include a hole map, yardage table, existing project target/carry concepts,
  and literal static prototype notes.
- Include visible/searchable OSM attribution and the full printed URL
  `https://www.openstreetmap.org/copyright` on any page containing OSM-derived
  geometry.
- Add deterministic unit and Playwright coverage, including PDF.js structural
  inspection and rendered-page visual-regression evidence.

Not authorized:

- Moving `jspdf` or any PDF package from `devDependencies` to production
  `dependencies`.
- Adding new devDependencies beyond the existing CTC-014 PDF toolchain without
  a separate reviewed decision.
- Adding production `Download PDF` UI to `src/App.tsx`.
- Adding hidden, inert, query-flagged, or production-gated PDF controls to the
  main app.
- Treating the prototype as distributed/shared production PDF export.
- Adding persistent or user-authored notes.
- Loading remote fonts, images, tiles, styles, providers, endpoints, API keys,
  accounts, telemetry, cloud sync, server components, or external user-data
  flows.
- Copying or adapting AGPL-3.0 code from the `ace` project or study-only code
  from `hacker-yardage` or `openyardage-web`.

## Delivery Path

Implement as an isolated experiment page, for example `/ctc008.html`, with its
own source entry under `src/experiments/` or another clearly isolated path. The
production app entry must remain separate and must not import the PDF prototype
module.

The prototype may be built and tested by the normal Vite build because the
existing CTC-014 experiment already demonstrates an isolated devDependency PDF
bundle. Any bundle-size observations must be reported as experiment evidence,
not production app bundle claims.

Implementation verification must explicitly show:

- `package.json` production `dependencies` remains unchanged and limited to
  `react` and `react-dom`.
- No new devDependencies are added for CTC-008.
- New CTC-008 prototype code does not import or exercise the rejected CTC-014
  PDFKit paths: `pdfkit`, `svg-to-pdfkit`, or `blob-stream`.
- The production app entry and production app bundle remain separate from the
  CTC-008 prototype entry. Record bundle/import isolation evidence in the
  implementation handoff.

## Data and Type Boundaries

Use current repo contracts:

- `normalizeGolfCourse()` returns `NormalizationResult`.
- Hole-page rendering should consume `NormalizedHole`, `NormalizationResult`,
  and current normalized feature/source records from `src/normalize.ts`.
- User-authored overlay shape must use `HoleStateV1`, `TargetV1`, and
  `CarryV1` from `src/project.ts`.
- `project.ts` remains the strict local project-file validator. It is not a
  GIS projection module.
- `HoleMap.tsx` may be used as a behavioral reference, but PDF generation must
  use a pure export scene rather than scraping DOM/SVG output.

If new helper types are needed, define them in a PDF/export-scene module with
explicit conversion from current normalized/project types.

The prototype must render exactly the one hole present in the pinned fixture:
`way/9000060101`. Do not build generalized multi-hole PDF pagination for
CTC-008.

Course-title text must be derived defensively from
`CourseCandidate.source.tags.name` only when it is a string. Provide tested
fallback cover text when the name is missing or non-string.

Static notes must come from an explicit literal string or export-scene constant
owned by the prototype module, for example "Synthetic fixture - not a real
course." Do not assume `note` or `description` tags exist in the fixture, and
do not add notes fields to `NormalizedHole`, `HoleStateV1`, project files, or
durable storage.

The prototype must not call `fetchOverpass`, `buildDetailQuery`,
`buildDiscoveryQuery`, `sourceMetadata`, `serializeBbox`, `overpassCache`, or
other live Overpass/query/cache helpers. It may consume only the static fixture
and literal prototype source/context needed for rendering and tests.

## PDF Content Contract

Minimum output:

- Page 1: cover with synthetic course title, prototype label, and disclaimer
  that the fixture is not a real course.
- Page 2: course summary with hole count, selected hole identifiers, fixture
  source identity, and static notes.
- Page 3 or later: one rendered hole page with vector map layers, yardage
  table, target marker(s), carry arc(s), static notes, and OSM attribution.

The isolated prototype page may expose a `Download PDF` control for the
fixture-backed experiment. That control is authorized only outside the main app
entry. Production `src/App.tsx` must not add a PDF control in CTC-008.

Map-bearing pages must include searchable text containing:

```text
Course geometry and map data © OpenStreetMap contributors.
OpenStreetMap copyright and license: https://www.openstreetmap.org/copyright
```

The `©` symbol must be preserved. Do not apply blanket ASCII-only sanitization.
Normalize or reject control characters and dangerous unexpected input, but keep
required attribution text and static fixture copy.

Attribution is required on pages that display OSM-derived geometry. In the
minimum CTC-008 document, this means the rendered hole page. Cover and summary
pages do not require OSM attribution unless they also render OSM-derived
geometry.

## jsPDF API Boundary

Allowed for the prototype:

- Page creation and metadata needed for a static PDF.
- Low-level drawing primitives such as lines, polygons/paths, rectangles,
  circles, fills, strokes, dash patterns, colors, and text.
- Blob/ArrayBuffer output for local download and test inspection.

Blocked:

- `html()`.
- `addImage()` and raster map/image imports.
- `createAnnotation()`.
- `addJS()`.
- AcroForm or any interactive form APIs.
- Embedded JavaScript, annotations, remote URLs as executable actions,
  imported HTML, remote fonts, remote images, and executable PDF features.

Rationale: Current NVD records for jsPDF vulnerabilities are relevant even
though `jspdf@4.2.1` includes upstream fixes. The prototype should avoid the
affected API families entirely so future production adoption has a narrow,
auditable surface.

## Download Lifecycle

Use the same browser-local Blob download pattern as existing project/source
exports, including the existing `requestAnimationFrame()` cleanup pattern used
by `App.tsx`. Do not leave object URLs or temporary anchor nodes mounted
indefinitely.

PDF filename generation must be deterministic enough for tests and include a
documented fallback for invalid timestamp input, following the defensive
filename discipline established by CTC-020.

## Same-Release Source-Export Gate

Because this addendum selects a dev-only fixture prototype with no production
PDF UI, it does not need to satisfy final production adjacency yet.

The gate remains mandatory for any later production PDF task:

- A real `Download PDF` control must appear adjacent to
  `Download Raw GIS Source (ODbL)`.
- Both controls must be present in the DOM, visible, enabled only when their
  prerequisites are satisfied, and reachable by accessible name.
- Playwright must assert the controls share the same action group or immediate
  parent and remain adjacent on desktop and mobile layouts.
- Production PDF behavior must not ship if raw GIS source export is absent or
  disabled for the same loaded detail source.

Do not add a fake or hidden `Download PDF` control in CTC-008 just to satisfy
this future gate.

## QA Plan

Unit tests:

- Export-scene construction from the synthetic fixture.
- Projection and layout bounds using current normalized geometry.
- Static notes source and required attribution text.
- Target/carry mapping from `HoleStateV1`.
- Rejection or normalization of control characters while preserving `©`.
- Course-title fallback when `tags.name` is missing or non-string.
- Deterministic PDF filename generation and invalid-timestamp fallback.
- Static/source-level blocklist check that the prototype source does not
  reference `html(`, `addImage`, `createAnnotation`, `addJS`, `AcroForm`,
  `pdfkit`, `svg-to-pdfkit`, or `blob-stream`.

Playwright tests:

- Prototype page generates a PDF from fixture data without network calls.
- Network isolation blocks all non-`127.0.0.1`/`localhost` requests while the
  prototype runs.
- Download MIME type is `application/pdf`.
- PDF filename is deterministic enough for tests.
- Repeated downloads clean up Blob URLs/anchors.
- Accessibility scan for the prototype page controls.
- Production `src/App.tsx` remains unaffected: no production PDF control is
  present in the main app.

PDF.js structural tests:

- Page count and page boxes.
- Extracted searchable text includes cover, summary labels, static notes,
  target/carry text, and full OSM attribution URL.
- Map-bearing pages contain vector path operations and no raster map images.
- Guardrail checks for absent `/JS`, `/JavaScript`, `/Launch`, and `/AcroForm`
  signatures, with API-scope tests treated as the primary control.
- Carry-arc dash pattern preserves the four-element dash intent established by
  CTC-014.

Rendered visual regression:

- Render the hole page through pinned local `pdfjs-dist`.
- Establish the narrowest stable tolerance from repeated local and CI runs.
- Do not use arbitrary loose thresholds or byte-identical PDF assertions.
- Store baseline image(s) under the Playwright snapshot convention already used
  by the test suite, or another explicit reviewed test fixture path.
- Commit baseline image(s) in the same PR as the implementation, include a
  documented reason for any regeneration in the PR description, and include the
  baseline(s) in final Claude audit materials.

Compliance:

- `npm run check`.
- `git diff --check`.
- `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`.
- Production audit must remain clean. Dev-inclusive PDF-toolchain audit
  findings, if any, must be documented separately and not confused with
  production dependency adoption.
- Verify `package.json` production `dependencies` remains unchanged and no new
  dependency or devDependency is added.

## Implementation Gate

Before runtime work begins, send this addendum to Claude for adversarial QA
planning. Implementation remains blocked until Claude returns a QA verdict and
Codex records accepted corrections.
