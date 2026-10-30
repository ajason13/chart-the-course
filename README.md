# Chart the Course

Chart the Course is an open-source, browser-based golf course planning app.
It uses OpenStreetMap course geometry, deterministic client-side spatial math,
and user-authored planning overlays. Printable yardage books use local vector
PDFs paired with matching source downloads.

No LLM is required at runtime. The app is designed to run as deterministic
browser software, with LLMs used only as development aids under repository
governance review.

## Current Scope

The merged React/TypeScript application supports:

- Course discovery through Overpass using manually entered south, west, north
  and east bounds in decimal degrees, with an optional course-name filter.
- Explicit course selection and detail loading, normalized holes/features,
  raw-entity diagnostics and geometry warnings.
- An explicit **Open synthetic demo** action that loads a bundled fictional
  course without course-data requests, using the same planning tools.
- A selected-hole SVG map with distance measurement, editable targets and
  carries, fairway-width estimates, and club profiles with dispersion guides.
  A local mapped-risk panel compares existing targets against associated mapped
  golf-water polygons using 512 fixed, area-weighted samples. Missing usable
  water geometry and off-map guides are unavailable. Percentages describe sampled
  geometric overlap, not shot probability; small areas between samples may be missed.
- Project JSON export/import for authored targets, carries and clubs, separate
  from raw GIS source downloads containing the loaded Overpass response and
  provenance.
- A seven-day IndexedDB response cache when browser storage is available,
  explicit refresh, and consent before using expired data after a failed request.

To use the app, enter bounds (each span at most 0.35 degrees), search, choose a
course with **Open course**, then select a hole. The selected-hole map leads the
planning workspace; expand **Source diagnostics** below it to inspect raw entities,
source bounds, timestamp, and the exact query. Discovery and uncached detail
loading require network access to Overpass. To try the tools without
coordinates or course-data network access, choose **Open synthetic demo**.
The app itself must still be loaded; this does not install an offline app.
The demo is clearly labeled synthetic, disables course refresh and raw GIS
source export, and never enters the OSM response cache. Save edits with project
export, then open the demo again before importing its project; its synthetic
course and hole IDs remain stable. Unsaved-change confirmation also applies
when switching between a live course and the demo.

Geometry supports validated points, lines, simple polygons and bounded,
relation-tagged multipolygons assembled from complete outer/inner way members.
Multiple exteriors and interior exclusions remain separate in the map, width
estimates and mapped-water overlap. Missing/conflicting members, ambiguous joins,
invalid or touching/nested topology and unsupported projections make the entire
relation unavailable; no repair or extra fetching occurs. Per relation the limits
are 1,000 members, 10,000 supplied coordinate positions and 256 rings. Duplicate
member fills are suppressed with diagnostics while raw evidence is retained.
Relation tees render but have no analytic origin pending a separate origin policy;
target origins remain usable. Incomplete potentially applicable golf-water makes
comparison unavailable even when other water is mapped. Other relation families,
tag inheritance and course/hole membership remain unsupported. Whole routes
and features must be strictly inside the selected facility boundary and outside
other returned facilities before numeric `ref` tags can associate features.
Missing/invalid boundaries, boundary contact, overlapping facilities or conflicting
source records leave scope unresolved; request bounds do not establish ownership.
Facility containment is inferred, and a bounded response may omit neighbors or
playing-course membership. Duplicate hole numbers are never resolved by order.

Missing-ref tees at route starts, greens at route ends and fairways intersecting
route interiors appear as inferred or shared candidates. Other in-scope geometry
appears as clipped course context. **Feature association evidence** distinguishes
these display-only layers from source-ref assertions. Candidates/context do not
change map fit, tee origins, fairway width or mapped-water calculations. Invalid,
unmatched or duplicate explicit refs never fall back to candidates. Missing tees,
greens or usable geometry may prevent estimates or map rendering; unavailable
mapped evidence does not mean no hazards exist. Coverage depends on the source
data; dispersion guides are not shot recommendations or confidence estimates.

The default map is blank/vector-only with no third-party basemap tiles.
OSM-derived geometry still requires attribution; see
[attribution](ATTRIBUTION.md) and the
[tile-provider decision](docs/tile-provider-strategy.md).

Targets, carries and clubs stay in memory until project JSON export. The local
project panel marks changes since the last successful import or export action;
returning to that authored content clears the warning. Export starts a download
and establishes a baseline, but the browser cannot confirm that you saved the
file. Raw GIS source export does not save authored work. Unsaved changes require
confirmation before search results or another course replace the workspace;
cancel retains the project and selection. Same-course refresh retains edits.
While changes are unsaved, the app requests a browser navigation/reload warning.
Browsers control this warning and may suppress it (especially on mobile or
without user interaction); it cannot guarantee recovery. There is no autosave.
Project JSON contains authored planning data, not a course-geometry snapshot;
load the matching course before importing it. The raw GIS source download
contains source evidence, not authored targets, carries or clubs.

## Local Setup

Use Node.js 24 LTS and npm 11. The checked-in `.nvmrc` and `package.json`
engine constraints define the supported local and CI runtime.

```bash
npm ci
npx playwright install chromium
npm run dev
```

Run these commands from the repository root. If you use nvm, run `nvm use`
first. Open the local URL printed by Vite (normally `http://127.0.0.1:5173`).
On Linux/CI, use `npx playwright install --with-deps chromium` to install
browser system dependencies as well. No API key or local backend is required.

## Deterministic Checks

```bash
npm run check
npm run compliance
npm run audit:all
git diff --check
```

`npm run check` builds both outputs, verifies production artifact exclusions,
and runs unit tests plus the app and PDF experiment browser tests. CI runs
this same command. Build both outputs before running `npm run test:e2e` alone.

For focused checks, `npm run verify:scaffold` checks dependency pins and scaffold
policy, `npm run build` type-checks and verifies the production build,
`npm run test:unit` runs Vitest, and `npm run test:e2e` runs Playwright.
Browser coverage currently uses Chromium, including mobile viewport checks;
it does not certify Safari/WebKit or Firefox.

`npm run compliance` rebuilds production and verifies its SBOM, license and
vulnerability evidence. `npm run audit:all` separately audits development and
experiment dependencies too. CI runs both. `scripts/compliance.sh` delegates
to `npm run compliance`; generated evidence is written under `.compliance/`.

## Production and experiment builds

`npm run build` emits only the application in `dist/` and checks its output.
`npm run preview` serves that production output. Deploy only `dist/`.

The CTC-008 and CTC-014 fixture-backed PDF experiments are research artifacts;
the active-project export is separate. Build experiments explicitly with
`npm run build:experiments`, then serve `dist-experiments/` with
`npm run preview:experiments`. Open `/ctc008.html` or `/ctc014.html` on the
printed URL. Keep this separate output out of application deployments.
`npm run dev` is a source development server and can serve the experiment
HTML files; it does not represent the production artifact boundary.

Playwright uses separate preview servers: application tests run on port 4173,
and `experiments-chromium` runs the existing PDF checks on port 4174.
For only PDF checks after building both outputs, use
`npm run test:e2e -- --project=experiments-chromium`.

Production compliance remains in `scripts/compliance.sh`. It rebuilds the app
and reconciles its package inventory with fresh production SBOM, license and
audit evidence. See [artifact compliance](docs/artifact-compliance.md) for the
artifact boundary, CI evidence and separate experiment/tooling checks.

## Print the active workspace

After opening a course or the synthetic demo, use **Printable yardage book**.
Choose 1–36 holes (the current hole is selected initially), then **Prepare yardage
book**. Download both the PDF and its adjacent matching source file. Share that
exact source file with PDF recipients; starting downloads does not confirm files
were saved or delivered. Preparation is local and requests no new course data.

The Letter-size vector book includes a cover, summary, hole maps and measured
continuations for current unsaved targets/carries. Clubs, notes and analysis are
excluded. Non-ASCII dynamic names are printed as visible `[U+XXXX]` escapes;
original source/project strings stay unchanged. Missing map data and unavailable
distances remain explicit. Previously consented stale data is disclosed with
completion date and age. Changing the workspace, source, print selection or
refresh state invalidates both prepared files; prepare again. Errors preserve
edits and allow retry. Export supports at most 128 pages, 100,000 projected
vertices, 20,000 primitives, 1 MiB source and 10 MiB PDF; exceeding a limit blocks
the entire download rather than producing a partial book.

Live PDFs print OpenStreetMap attribution and its complete copyright URL on
every page, and bind the exact raw-source download by filename and SHA-256.
Demo PDFs are marked synthetic on every page and pair the exact bundled fixture,
without an ODbL envelope or an invented endpoint. The app uses jsPDF 4.2.1 with
built-in Helvetica and no remote fonts, images or PDF viewer. Deploy
`dist/dependency-licenses.txt` alongside the app to retain complete dependency
licenses. PDF inspection/rendering tests use local test-only PDF.js; they do not
establish universal real-course or print-driver compatibility, or PDF accessibility
conformance. Release/printed-page readiness remains issue #52.

## Governance Notes

See the [GitHub roadmap](https://github.com/ajason13/chart-the-course/issues/32)
for execution order and dependencies, and the
[open issues](https://github.com/ajason13/chart-the-course/issues) for current
status. Release readiness and optional future work remain tracked there.

For development, read [repository guidance](AGENTS.md),
[contributing](CONTRIBUTING.md) and the [Codex session entry point](docs/codex-sessions.md).
The [course geometry contract](docs/course-geometry-contract.md) records research,
adopted support and explicit deferrals for the geometry follow-ups; it does
not describe shipped behavior.
The adopted [planning-to-print contract](docs/pdf-export-contract.md) specifies
the PDF dependency, selected-hole content, text limits and matching source
evidence adopted for the active-project PDF export.
The active-project scene preparation API in `src/pdfScene.ts` now validates an
immutable source/project snapshot, binds its exact source bytes to SHA-256, and
builds typed vector pages with measured text continuations. Its font metrics
must come from application-owned Helvetica metrics. `src/pdfRenderer.ts` draws
only that closed scene vocabulary. Focused regressions run with
`npm run test:unit -- src/pdfScene.test.ts src/pdfRenderer.test.ts`.
Focused policies cover [security](SECURITY.md),
[reference reuse](docs/reference-project-reuse-policy.md) and
[legal disclaimers](docs/legal-disclaimers.md).

- Do not copy, modify, adapt, link, combine, incorporate, or distribute
  AGPL-3.0 code from `ace`.
- Treat `hacker-yardage` and `openyardage-web` as inspiration-only unless a
  license or written permission is verified.
- Do not add map providers, API keys, production dependencies, PDF export
  behavior, or user data flows without updating the relevant governance docs.
- Public OSM tile CDN use is prohibited in deployed builds without explicit
  project approval.
