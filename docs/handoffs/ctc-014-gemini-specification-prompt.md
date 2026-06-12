# CTC-014: Specify and evaluate a vector PDF export pipeline

## Research target

Act as the specification architect and current-primary-source researcher for
CTC-014, Evaluate vector PDF export pipeline. Produce an implementation-ready
evaluation specification for critical review. Do not write full implementation
code, select a dependency without evidence, or claim production PDF export is
authorized.

Gemini has no filesystem or GitHub access. This bundle is self-contained. Base
all project-specific decisions on the exact repository contents embedded below.
Use current primary sources for package versions, licenses, maintenance,
browser support, PDF/SVG/font capabilities, security advisories, and relevant
standards. Include source URLs and access dates. Clearly separate sourced facts,
inferences, experiments, and project recommendations.

## Current project and gate state

- Repository: Chart the Course, Apache-2.0 browser app using React, TypeScript,
  Vite, Vitest, and Playwright.
- Current repository state: clean synchronized `main` at
  `b8536b7dafdd4d793d70ae26763523a1295305e2`.
- CTC-007 remains Done; PR #5 merged as
  `e0d9c8f5a92fbab91c76c402361b31e3af03e30a` with required CI successful.
- CTC-014 is `1. Spec Drafting (Gemini)`.
- CTC-005 supplies immutable normalized OSM geometry and source evidence.
- CTC-006 supplies dependency-free native React SVG selected-hole rendering,
  fixed logical coordinates, projection/inverse projection, Haversine
  measurement, scale indication, attribution, and synthetic fixture coverage.
- CTC-007 supplies memory-only user-authored targets and carry rings, strict
  local project JSON exchange, and existing SVG overlay contracts.
- CTC-018 selects blank/vector-only rendering with no third-party basemap tiles
  by default.
- CTC-008 and CTC-020 are downstream. Distributed/shared PDF export cannot ship
  unless raw GIS source availability ships in the same release.
- CTC-019 remains independent durable Overpass cache/request-identity work.
- No feature branch, PDF dependency installation, or runtime implementation may
  begin until this specification is critically reviewed and Claude adversarial
  QA planning is completed and critically reviewed.

## Acceptance criteria

- Compare pdfkit, jsPDF, and SVG/canvas-to-PDF approaches for browser
  compatibility, vector output, file size, fonts, and print precision.
- Produce one fixture hole page with map geometry, yardage markers, and notes.
- Define visual regression strategy for PDF output.
- Recommend final library with license and maintenance assessment.

## Binding scope boundaries

CTC-014 owns a reviewed pipeline decision and a narrowly specified
fixture-only experiment. It does not ship production PDF export.

- Compare current browser-capable pdfkit, jsPDF, and SVG/canvas-to-PDF options.
  Name exact packages and current versions where applicable. Do not treat
  similarly named packages as interchangeable.
- Preserve existing native SVG geometry and user-authored target/carry overlay
  contracts. Identify exactly what can remain vector and every required raster
  fallback.
- The fixture experiment must use only existing synthetic normalized geometry
  and deterministic fixture project state. It must make no network calls and
  must not use a real course.
- Resolve the notes acceptance criterion using static fixture text only. Do not
  add persistent or user-authored notes behavior.
- No production dependency is authorized merely because it is recommended.
  Decide whether later evaluation should install a dependency on an isolated
  branch, use temporary tooling, or use a no-dependency browser-print/SVG
  prototype. State the evidence needed before adoption.
- Do not add remote fonts, remote images, external asset tracking, imported
  HTML trust, executable PDF content, network upload, providers, API keys,
  accounts, servers, cloud sync, durable cache, analytics, or external
  user-data flows.
- Treat raw GIS source availability under CTC-020 as release-blocking for
  distributed/shared CTC-008 PDF export. CTC-014's local fixture experiment is
  not a production release and must not imply that gate is satisfied.
- Every PDF experiment containing OSM-derived geometry must visibly include:
  `Course geometry and map data © OpenStreetMap contributors.` and the full
  printed URL `https://www.openstreetmap.org/copyright`.
- Original Chart the Course code remains Apache-2.0. Do not copy or adapt AGPL
  or unlicensed reference-project PDF/export implementations, layouts, assets,
  or distinctive workflows.
- Keep direct dependencies exact-pinned. Any recommended dependency must have a
  license/notice/SBOM/vulnerability/compliance adoption plan.

## Mandatory research and specification questions

Resolve every question explicitly:

1. Compare current browser-capable pdfkit, jsPDF, and SVG/canvas-to-PDF
   approaches. For each viable option, identify exact package/version,
   official source/repository, license and notices, release/maintenance
   evidence, browser/runtime support, transitive dependency implications,
   approximate installed/bundled size using a reproducible method, vector
   preservation, SVG feature support, font embedding/subsetting, metadata,
   compression/file-size behavior, deterministic-output limitations, security
   posture, and print precision.
2. Distinguish architectural approaches from packages. Include direct PDF
   drawing, SVG-to-PDF conversion, browser print-to-PDF, Canvas/raster
   conversion, and hybrid vector/raster output. Explain which approaches meet
   the vector-output criterion and where they fail.
3. Recommend one pipeline for a later isolated CTC-014 experiment, with a
   ranked fallback and explicit rejection reasons. A recommendation is not
   dependency-adoption authorization.
4. Define the exact fixture-only hole page using the embedded CTC-006 synthetic
   fixture and deterministic CTC-007-like fixture state. Specify map layers,
   one or more yardage/carry markers, yardage table, static fixture note text,
   warnings/disclaimer content, and visible OSM attribution.
5. Define selected paper sizes, orientation, physical units, margins, map and
   table layout, coordinate transforms from the existing 800x600 SVG viewBox,
   clipping, pagination, line widths, minimum readable text, and stable-layout
   tolerances. Identify every environment-dependent choice.
6. Define font policy. Compare built-in PDF fonts, embedded project-controlled
   fonts, and browser/system fonts. Address license, deterministic metrics,
   subsetting, Unicode, fallback, CI portability, and remote-font prohibition.
7. Define deterministic visual regression: structural PDF assertions,
   extracted metadata/text checks, page count/size checks, vector-presence
   checks, rendered-page image comparison, renderer/tool choice, tolerances,
   font/environment pinning, CI portability, artifact retention, and how to
   avoid brittle byte-for-byte PDF assertions.
8. Define security/privacy behavior: local-only generation, no network upload
   or fetch, no remote assets, no imported HTML trust, no executable content or
   attachments, bounded inputs/resources, safe metadata, object-URL/download
   lifecycle if applicable, failure states, and dependency vulnerability
   review.
9. Define accessibility/usability expectations for any later evaluation
   controls and useful failure states. The PDF artifact should preserve useful
   readable text where feasible, but do not invent a full tagged-PDF
   accessibility commitment without evidence.
10. Define the license/SBOM/compliance changes and exact review gates required
    before any recommended dependency could be adopted. Address
    `THIRD_PARTY_NOTICES.md`, exact pinning, lockfile, production SBOM,
    license allow/deny checks, audit, and upstream notices/fonts.
11. Define likely files to add/change for the isolated experiment and which
    existing runtime contracts must remain unchanged. Keep CTC-008 production
    export UI, CTC-020 raw source export, persistent notes, and unrelated work
    out of scope.
12. Identify narrow unresolved maintainer decisions and recommend conservative
    defaults. Identify what Claude adversarial QA must challenge before an
    experiment is authorized.

## Required comparison rigor

- Prefer primary sources: official package documentation, package registries,
  official repositories/releases, licenses/notices, standards, and official
  security advisories. Clearly label any inference.
- Do not rely on marketing claims or generic PDF-library roundups.
- Do not claim exact bundle size without a reproducible configuration and
  measurement method.
- Do not claim deterministic PDF bytes when timestamps, object IDs,
  compression, fonts, or environment can vary.
- Do not call Canvas/raster screenshots vector output.
- Do not assume browser print-to-PDF behaves identically across browsers or CI.
- Do not assume SVG support is complete; enumerate relevant support for paths,
  polygons, polylines, text, clipping, strokes/dashes, transforms, and links.
- Do not propose copying PDF layouts or export logic from study-only or
  prohibited reference projects.

## Required response format

Return a self-contained specification with:

1. Scope/readiness verdict and blocking unknowns.
2. Evidence table with primary-source URLs and access dates.
3. Option comparison matrix with exact packages/versions and architectural
   approaches.
4. Recommended pipeline, fallback, rejected options, and explicit confidence.
5. Exact fixture-hole-page experiment and static-notes decision.
6. Paper/layout/vector/font/attribution specification.
7. Security, privacy, accessibility, and useful failure-state decisions.
8. Deterministic structural and visual-regression strategy.
9. Dependency adoption, license, notice, SBOM, vulnerability, and compliance
   gate.
10. File/change plan, verification plan, and non-goals.
11. Adversarial QA red lines.
12. Open maintainer decisions with conservative defaults.

## Completion test

The response is acceptable only if it compares the required options using
current primary evidence; defines a reproducible synthetic fixture experiment;
preserves vector geometry where feasible; resolves static fixture notes without
adding a notes model; defines physical layout, fonts, attribution, security,
and deterministic regression testing; and keeps all production dependency and
PDF-shipping decisions behind later reviewed gates.

## Exact relevant repository file contents

<!-- GENERATED EXACT FILES BELOW -->

<!-- BEGIN EXACT FILE 1/27: AGENTS.md -->

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

<!-- END EXACT FILE 1/27: AGENTS.md -->

<!-- BEGIN EXACT FILE 2/27: ATTRIBUTION.md -->

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

<!-- END EXACT FILE 2/27: ATTRIBUTION.md -->

<!-- BEGIN EXACT FILE 3/27: THIRD_PARTY_NOTICES.md -->

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

<!-- END EXACT FILE 3/27: THIRD_PARTY_NOTICES.md -->

<!-- BEGIN EXACT FILE 4/27: SECURITY.md -->

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

<!-- END EXACT FILE 4/27: SECURITY.md -->

<!-- BEGIN EXACT FILE 5/27: docs/governance-workflow.md -->

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

<!-- END EXACT FILE 5/27: docs/governance-workflow.md -->

<!-- BEGIN EXACT FILE 6/27: docs/legal-disclaimers.md -->

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

<!-- END EXACT FILE 6/27: docs/legal-disclaimers.md -->

<!-- BEGIN EXACT FILE 7/27: docs/reference-project-reuse-policy.md -->

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

<!-- END EXACT FILE 7/27: docs/reference-project-reuse-policy.md -->

<!-- BEGIN EXACT FILE 8/27: docs/tile-provider-strategy.md -->

### docs/tile-provider-strategy.md

``````text
# Tile Provider Strategy

Status: Selected for MVP on 2026-06-04 under CTC-018.

Chart the Course must choose a compliant base-map strategy before any deployed
map scaffold. The MVP must not depend on the OpenStreetMap public tile CDN for
deployed use, must keep attribution visible, and must leave room for a later
provider change without reshaping the yardage-book workflow.

## Decision

The selected MVP strategy is blank/vector-only rendering of OSM-derived course
geometry, user-authored target lines, yardage markers, hazards, notes, and
print/PDF overlays. The deployed MVP must not load third-party basemap tiles by
default.

Fallback path:

1. If users need geographic context beyond course geometry, self-host a scoped
   PMTiles/Protomaps basemap extract in project-controlled storage.
2. If operational burden is too high, evaluate MapTiler or Stadia under a paid
   or explicitly approved plan before enabling hosted basemap tiles.
3. If a provider's terms, attribution requirements, pricing, or service
   availability change materially, disable that provider in deployed builds
   until the policy is re-reviewed.

## Non-Negotiable Rules

- Do not use `https://tile.openstreetmap.org/{z}/{x}/{y}.png` or any other OSM
  public tile CDN endpoint in deployed Chart the Course builds without explicit
  project approval.
- Do not add prefetch, bulk-download, scraping, or offline tile caching features
  against public tile services unless the provider's plan and terms expressly
  allow them.
- Do not hide attribution behind app chrome, overlays, collapsed controls, or
  off-screen UI when a map or map-derived export is visible.
- Keep the tile provider configurable behind a provider adapter boundary when a
  map scaffold is introduced. Course geometry, yardage calculations, and PDF
  export must not assume a specific basemap vendor.

## Attribution Requirements

Even without third-party basemap tiles, Chart the Course uses OSM-derived course
geometry. OSM attribution remains required in UI views and PDFs that display or
export that geometry.

Required UI attribution for MVP geometry-only views:

```text
Course data © OpenStreetMap contributors
https://www.openstreetmap.org/copyright
```

Required PDF attribution for MVP geometry-only exports:

```text
Course geometry and map data © OpenStreetMap contributors.
OpenStreetMap copyright and license: https://www.openstreetmap.org/copyright
```

If a third-party basemap provider is enabled later, its attribution must appear
where the provider requires it:

- UI: visible on every map view using that provider, with links when the medium
  supports links.
- PDF/print: visible near the map, in a footer, citation, or acknowledgements
  block as permitted by the provider, including full URLs when links are not
  possible.
- Notices: listed in `THIRD_PARTY_NOTICES.md` with provider name, source data,
  plan or hosting mode, required attribution text, and verification date.

## Option Comparison

| Option | Fit | Attribution | Operational notes | Decision |
| --- | --- | --- | --- | --- |
| Blank/vector-only MVP | Best for first deployed app. Supports hole layout, yardage planning, target lines, notes, and PDF output without basemap tiles. | OSM attribution still required for OSM-derived course geometry in UI and PDFs. No provider attribution required. | Lowest vendor, cost, API-key, and availability risk. Less surrounding geographic context. | Selected for MVP. |
| Self-hosted PMTiles/Protomaps | Strong fallback when surrounding context becomes necessary. | Protomaps basemap downloads are OSM-derived Produced Works, so OSM attribution is required. Also preserve any Protomaps/OpenMapTiles/style notices that apply to selected assets. | Requires storage, CDN/range-request support, update workflow, integrity checks, and scoped extracts to avoid large planet-file operations. | Preferred fallback. |
| MapTiler | Viable hosted provider after plan review. | MapTiler docs require visible MapTiler and OpenStreetMap attribution; free accounts also require a MapTiler logo. Printed/static media need comparable visible attribution. | Requires API key, plan limits, billing review, and provider-specific UI/PDF attribution checks. | Defer until basemap need is proven. |
| Stadia Maps | Viable hosted provider after plan review. | Stadia requires Stadia Maps, OpenMapTiles, and OpenStreetMap attribution for most styles; Stamen-origin styles require "Map tiles by Stamen Design" with `stamen.com` URL in print. Print must include required URLs such as `stadiamaps.com` and `openstreetmap.org/copyright`. | Requires API key/domain configuration, plan review, and style-specific notices. | Defer until basemap need is proven. |
| Thunderforest | Viable niche/activity-map provider, not a first choice for MVP. | Terms require Thunderforest and OpenStreetMap contributor attribution, with printed-media text using provider and OSM copyright URLs. | Registration and subscription model; no caching proxies or redistribution; more style-specific than needed for yardage-book MVP. | Not selected. |
| OpenFreeMap | Interesting free hosted vector option, not conservative enough for MVP. | OSM-derived attribution still applies; provider terms are broad, as-is, and may change. | Free as-is service with no availability warranty and discontinuation risk. Suitable for experiments, not project default. | Not selected for deployed MVP. |
| Esri basemaps | Mature commercial ecosystem, but excess scope for MVP. | Esri basemaps require Esri/source attribution depending on layer. | Terms, account requirements, SDK/provider coupling, and non-OSM data sources add policy complexity. | Not selected. |

## Source Notes

Research was checked against official provider or project pages on 2026-06-04:

- OpenStreetMap Foundation Operations tile policy: public OSM tile servers have
  limited capacity, require visible attribution, valid browser referrer behavior,
  caching, and prohibit scraping or heavy inappropriate use.
  <https://operations.osmfoundation.org/policies/tiles/>
- OpenStreetMap copyright and attribution guide: OSM data use requires credit
  and ODbL clarity; printed media should include the full copyright URL.
  <https://www.openstreetmap.org/copyright/attribution-guide/>
- Protomaps basemap downloads: Protomaps basemap is OSM-derived, distributed as
  an ODbL Produced Work, and hotlinking downloads is discouraged in favor of
  copying to controlled cloud storage.
  <https://docs.protomaps.com/basemaps/downloads>
- MapTiler attribution guide and copyright page: MapTiler maps require visible
  MapTiler and OpenStreetMap attribution; free accounts require a MapTiler logo.
  <https://docs.maptiler.com/guides/map-design/attribution/add-attribution/>
  <https://www.maptiler.com/copyright/>
- Stadia Maps attribution guide: hosted maps require provider and source
  attribution; print/video outputs must include applicable provider/source URLs.
  <https://docs.stadiamaps.com/attribution/>
- Thunderforest terms: attribution must credit Thunderforest and OpenStreetMap,
  with separate printed-media wording.
  <https://www.thunderforest.com/terms/>
- OpenFreeMap terms: free service is provided as-is and may be discontinued.
  <https://openfreemap.org/tos/>
``````

<!-- END EXACT FILE 8/27: docs/tile-provider-strategy.md -->

<!-- BEGIN EXACT FILE 9/27: docs/overpass-query-contract.md -->

### docs/overpass-query-contract.md

``````text
# Overpass Query Contract

Status: Implemented as a bounded CTC-004 browser spike on 2026-06-06.

This contract defines the first Chart the Course Overpass API request shape for
course discovery and course-detail loading. CTC-004 implements the bounded
session-only browser spike; later durable cache and geometry work remain
separate tasks.

## Goals

- Find candidate golf courses inside a user-selected bounding box.
- Load the selected course boundary and golf-course features needed for a
  blank/vector-only MVP map.
- Keep public Overpass usage bounded, cacheable, attributable, and recoverable
  when the service rate-limits or sheds load.
- Preserve raw OSM entity IDs, tags, geometry, query text, bounding box, source
  URL, and source-check metadata for later ODbL source export.

## Inputs

All coordinates use WGS84 decimal degrees in Overpass order:
`south,west,north,east`.

| Field | Required | Contract |
| --- | --- | --- |
| `bbox` | Yes | User-selected or geocoded search extent. The client must reject global, country-scale, or otherwise unbounded boxes. |
| `courseName` | No | User-entered search text. Escape for Overpass regular-expression syntax before interpolation. |
| `selectedCourseBbox` | Yes for detail | Exact valid bounding box from the selected `leisure=golf_course` result. Bbox padding is deferred beyond CTC-004. |
| `appVersion` | Yes | Used in the identifying Overpass QL comment. |
| `contactUrl` | Yes | Public project or support URL in the identifying Overpass QL comment. |

Initial guardrail: accept only manually entered decimal coordinate syntax with
at most seven decimal places. Reject exponent notation, locale commas,
non-finite values, antimeridian crossing, invalid ordering, and bboxes wider
than 0.35 degrees longitude or 0.35 degrees latitude unless a future maintainer
decision records a different limit. Exactly 0.35 degrees is allowed. This keeps
browser requests scoped to a city/neighborhood-scale search instead of using
public Overpass as a bulk data backend.

`courseName` must be trimmed, limited to 200 Unicode code points, and rejected
if it contains ASCII control characters. Treat it as a literal string with a
single-pass encoder before interpolation into the regex filter: prefix `\`
before `"`, `\`, and each of `.`, `*`, `+`, `?`, `(`, `)`, `[`, `]`, `{`,
`}`, `|`, `^`, and `$`. Treat `*/` in a course name as ordinary quoted-string
content; it cannot terminate the separate leading comment. Do not concatenate
raw user input into Overpass QL.

## Request Identity

Browser JavaScript cannot reliably set a custom upstream `User-Agent`. Every
Overpass QL body must start with a project-identifying comment, and deployed
browser requests should allow the normal app origin/referrer to be sent where
browser policy permits it.

```overpassql
/* chart-the-course/{{appVersion}} contact:{{contactUrl}} purpose:golf-course-mvp */
```

If Chart the Course later uses a proxy, self-hosted Overpass, or commercial
provider, that server-side layer should also set a descriptive upstream
`User-Agent`.

For CTC-004, the app version and contact URL are fixed trusted constants from
`package.json` and the GitHub repository URL. Validate both constants before
query construction and reject control characters or `*/`.

## Course Discovery Query

Use this query to find candidate courses within the search bbox. If
`courseName` is empty, omit the first name-filtered block and keep only the
unfiltered `leisure=golf_course` block.

```overpassql
/* chart-the-course/{{appVersion}} contact:{{contactUrl}} purpose:golf-course-discovery */
[out:json][timeout:25][maxsize:536870912];
(
  nwr["leisure"="golf_course"]["name"~"{{escapedCourseName}}",i]({{south}},{{west}},{{north}},{{east}});
  nwr["leisure"="golf_course"]({{south}},{{west}},{{north}},{{east}});
);
out tags center bb;
```

Expected use:

- Show candidates from `leisure=golf_course` elements only.
- Prefer area or relation results when duplicate node/way/relation records
  describe the same facility.
- Preserve `id`, `type`, `tags.name`, `tags.operator`, `tags.website`,
  `bounds`, and `center` when present.
- Do not request `meta` for the MVP query path; parser tests can use static
  fixtures for metadata-specific cases if needed later.

## Course Detail Query

Use this query after the user selects a course. The bbox must be derived from
the selected course boundary when available, not from a full city or region.

```overpassql
/* chart-the-course/{{appVersion}} contact:{{contactUrl}} purpose:golf-course-detail */
[out:json][timeout:45][maxsize:536870912];
(
  nwr["leisure"="golf_course"]({{south}},{{west}},{{north}},{{east}});
  nwr["golf"~"^(hole|fairway|green|bunker|tee|water_hazard|lateral_water_hazard|rough|out_of_bounds|pin|cartpath)$"]({{south}},{{west}},{{north}},{{east}});
  nwr["natural"~"^(water|wood|tree|tree_row|scrub)$"]({{south}},{{west}},{{north}},{{east}});
  nwr["landuse"~"^(forest|reservoir|basin)$"]({{south}},{{west}},{{north}},{{east}});
  nwr["water"~"^(pond|lake|basin|reservoir)$"]({{south}},{{west}},{{north}},{{east}});
  nwr["waterway"]({{south}},{{west}},{{north}},{{east}});
);
out body geom;
```

Required feature handling:

- `leisure=golf_course`: course boundary, candidate facility metadata, and
  source bbox.
- `golf=hole`: hole routing line. Treat as the preferred hole-order source
  when `ref`, `name`, or relation membership is usable.
- `golf=fairway`, `golf=green`, `golf=bunker`, `golf=tee`: primary yardage-book
  geometry layers.
- `golf=water_hazard`, `golf=lateral_water_hazard`, `natural=water`,
  `water=*`, and `waterway=*`: candidate penalty/water hazard layers. The
  parser must keep original tags so later UI can distinguish golf-specific
  hazards from generic mapped water.
- `natural=wood`, `landuse=forest`, `natural=tree`, `natural=tree_row`,
  `natural=scrub`: candidate tree/vegetation hazards where available. These are
  advisory map layers, not proof of playable obstruction.

## Rate-Limit and Error Behavior

The public Overpass instances are shared infrastructure. Chart the Course must
treat them as a constrained public service, not a guaranteed production backend.

- Submit at most one active Overpass request per browser session.
- Cache successful public Overpass responses locally. The durable public
  Overpass cache target remains the 7-day TTL in `ATTRIBUTION.md`; if CTC-004
  ships before durable local persistence exists, session storage is acceptable
  only as a temporary CTC-004 exploration-spike constraint before CTC-019
  establishes durable local persistence.
- CTC-004 cache keys are
  `ctc:overpass:v1:discovery:{bbox}:{encoded-lowercase-name}` and
  `ctc:overpass:v1:detail:{bbox}`.
- Never query on keystrokes; require an explicit search action.
- On HTTP `429`, show a rate-limit state and back off before retrying. Do not
  retry automatically in a tight loop.
- On HTTP `504` or timeout, show a scoped-search prompt asking the user to
  narrow the area or try again later.
- On empty results, preserve the searched bbox and query text in diagnostics so
  future support can distinguish missing OSM data from parser failures.
- Keep request bodies small and avoid `out meta` in the default UI path.
- If expected traffic exceeds public Overpass safety guidance, switch to a
  self-hosted instance or approved provider before broad deployment.

A minimally valid raw response is an object with an `elements` array. Every
element must be an object with `type` equal to `node`, `way`, or `relation` and
an integer `id`. `elements: []` is an empty discovery or detail response. Any
non-empty valid elements array is success, even when expected feature types are
absent.

## Attribution and ODbL Records

Every successful detail response must be retained with enough source metadata
to support later ODbL source availability for PDFs and other generated outputs.

CTC-004 stores the exact response text plus source metadata in `sessionStorage`
and parses a separate in-memory representation for display. This session cache
does not satisfy later ODbL source-export obligations.

Persist or export alongside normalized geometry:

- Raw Overpass JSON response.
- Exact Overpass QL query body.
- Request URL or endpoint host.
- Request timestamp.
- Bbox values.
- OSM element type and ID for every normalized feature.
- Original tags for every normalized feature.
- OpenStreetMap copyright URL:
  `https://www.openstreetmap.org/copyright`.

UI and PDF attribution rules remain governed by `ATTRIBUTION.md` and
`docs/tile-provider-strategy.md`.

## Mock Fixture

`fixtures/overpass/synthetic-golf-course.json` is the initial parser-test
fixture for this contract. It is deliberately synthetic: coordinates, names,
and IDs are invented and do not represent a real golf course.

Future parser tests should assert that the fixture can produce:

- One course boundary.
- One numbered hole line.
- Tee, fairway, green, bunker, golf-specific water hazard, generic water, and
  vegetation feature layers.
- OSM IDs, source tags, bbox, and query metadata preserved in the normalized
  model.

## Source Notes

Primary sources checked on 2026-06-05:

- OpenStreetMap golf-course tagging guidance documents `leisure=golf_course`
  boundaries and common internal features such as `golf=tee`, `golf=hole`,
  `golf=fairway`, `golf=green`, `golf=bunker`, and water hazards.
  <https://wiki.openstreetmap.org/wiki/Golf_course>
- Overpass API manual describes public-instance scale, problematic heavy use,
  the broad safety guideline of about 10,000 requests and 1 GB download volume
  per day, slot-based rate limiting, HTTP `429` for rate-limit denials,
  `[timeout:*]`, `[maxsize:*]`, and HTTP `504` for resource denials.
  <https://dev.overpass-api.de/overpass-doc/en/preface/commons.html>
- Overpass QL documentation states settings must be in the first uncommented
  statement, supports `[out:json]`, `[timeout:*]`, `[maxsize:*]`, and notes that
  avoiding `meta` limits processing time.
  <https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL>
- OpenStreetMap attribution guidance requires credit to OpenStreetMap and clear
  ODbL notice; where links are not possible, printed works should include the
  full copyright URL.
  <https://www.openstreetmap.org/copyright/attribution-guide/>
``````

<!-- END EXACT FILE 9/27: docs/overpass-query-contract.md -->

<!-- BEGIN EXACT FILE 10/27: package.json -->

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

<!-- END EXACT FILE 10/27: package.json -->

<!-- BEGIN EXACT FILE 11/27: package-lock.json -->

### package-lock.json

``````text
{
  "name": "chart-the-course",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "chart-the-course",
      "version": "0.0.0",
      "license": "Apache-2.0",
      "dependencies": {
        "react": "19.2.7",
        "react-dom": "19.2.7"
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
      "engines": {
        "node": ">=24 <25",
        "npm": ">=11 <12"
      }
    },
    "node_modules/@axe-core/playwright": {
      "version": "4.11.3",
      "resolved": "https://registry.npmjs.org/@axe-core/playwright/-/playwright-4.11.3.tgz",
      "integrity": "sha512-h/kfksv4F0cVIDlKpT4700OehdRgpvuVskuQ2nb7/JmtWUXpe9ftHAPtwyXGvVSsa6SJ64A9ER7Zrzc/sIvC4w==",
      "dev": true,
      "license": "MPL-2.0",
      "dependencies": {
        "axe-core": "~4.11.4"
      },
      "peerDependencies": {
        "playwright-core": ">= 1.0.0"
      }
    },
    "node_modules/@cyclonedx/cyclonedx-library": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/@cyclonedx/cyclonedx-library/-/cyclonedx-library-7.1.0.tgz",
      "integrity": "sha512-42Y5AzI6qlRT8Tk0lacLA2676BUQvhJJ6iC8u9SuzHqd8oi+9l4+7uiewZDsiMlVwi48P78EzTrSOEu/783CsQ==",
      "dev": true,
      "funding": [
        {
          "type": "individual",
          "url": "https://owasp.org/donate/?reponame=www-project-cyclonedx&title=OWASP+CycloneDX"
        }
      ],
      "dependencies": {
        "packageurl-js": "^2.0.1",
        "spdx-expression-parse": "^3.0.1 || ^4"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "optionalDependencies": {
        "ajv": "^8.12.0",
        "ajv-formats": "^3.0.1",
        "ajv-formats-draft2019": "^1.6.1",
        "libxmljs2": "^0.31 || ^0.32 || ^0.33 || ^0.35",
        "xmlbuilder2": "^3.0.2"
      }
    },
    "node_modules/@cyclonedx/cyclonedx-npm": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@cyclonedx/cyclonedx-npm/-/cyclonedx-npm-2.1.0.tgz",
      "integrity": "sha512-l2s8PsmNwvyE1Eaiqf/+kQsjxeKQfNwN6tTZG/WgmR1+2URm3XSzAsWU6D71QlenpBeXtldPfu2BtdAZZHizPw==",
      "dev": true,
      "funding": [
        {
          "type": "individual",
          "url": "https://owasp.org/donate/?reponame=www-project-cyclonedx&title=OWASP+CycloneDX"
        }
      ],
      "dependencies": {
        "@cyclonedx/cyclonedx-library": "^7.0.0",
        "commander": "^10.0.0",
        "normalize-package-data": "^3||^4||^5||^6",
        "xmlbuilder2": "^3.0.2"
      },
      "bin": {
        "cyclonedx-npm": "bin/cyclonedx-npm-cli.js"
      },
      "engines": {
        "node": ">=14",
        "npm": "6 - 11"
      }
    },
    "node_modules/@emnapi/core": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-1.10.0.tgz",
      "integrity": "sha512-yq6OkJ4p82CAfPl0u9mQebQHKPJkY7WrIuk205cTYnYe+k2Z8YBh11FrbRG/H6ihirqcacOgl2BIO8oyMQLeXw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/wasi-threads": "1.2.1",
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/runtime": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.10.0.tgz",
      "integrity": "sha512-ewvYlk86xUoGI0zQRNq/mC+16R1QeDlKQy21Ki3oSYXNgLb45GV1P6A0M+/s6nyCuNDqe5VpaY84BzXGwVbwFA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/wasi-threads": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-1.2.1.tgz",
      "integrity": "sha512-uTII7OYF+/Mes/MrcIOYp5yOtSMLBWSIoLPpcgwipoiKbli6k322tcoFsxoIIxPDqW01SQGAgko4EzZi2BNv2w==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@isaacs/cliui": {
      "version": "8.0.2",
      "resolved": "https://registry.npmjs.org/@isaacs/cliui/-/cliui-8.0.2.tgz",
      "integrity": "sha512-O8jcjabXaleOG9DQ0+ARXWZBTfnP4WNAqzuiJK7ll44AmxGKv/J2M4TPjxjY3znBCfvBXFzucm1twdyFybFqEA==",
      "dev": true,
      "dependencies": {
        "string-width": "^5.1.2",
        "string-width-cjs": "npm:string-width@^4.2.0",
        "strip-ansi": "^7.0.1",
        "strip-ansi-cjs": "npm:strip-ansi@^6.0.1",
        "wrap-ansi": "^8.1.0",
        "wrap-ansi-cjs": "npm:wrap-ansi@^7.0.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@napi-rs/wasm-runtime": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/@napi-rs/wasm-runtime/-/wasm-runtime-1.1.4.tgz",
      "integrity": "sha512-3NQNNgA1YSlJb/kMH1ildASP9HW7/7kYnRI2szWJaofaS1hWmbGI4H+d3+22aGzXXN9IJ+n+GiFVcGipJP18ow==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@tybys/wasm-util": "^0.10.1"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      },
      "peerDependencies": {
        "@emnapi/core": "^1.7.1",
        "@emnapi/runtime": "^1.7.1"
      }
    },
    "node_modules/@npmcli/agent": {
      "version": "2.2.2",
      "resolved": "https://registry.npmjs.org/@npmcli/agent/-/agent-2.2.2.tgz",
      "integrity": "sha512-OrcNPXdpSl9UX7qPVRWbmWMCSXrcDa2M9DvrbOTj7ao1S4PlqVFYv9/yLKMkrJKZ/V5A/kDBC690or307i26Og==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "agent-base": "^7.1.0",
        "http-proxy-agent": "^7.0.0",
        "https-proxy-agent": "^7.0.1",
        "lru-cache": "^10.0.1",
        "socks-proxy-agent": "^8.0.3"
      },
      "engines": {
        "node": "^16.14.0 || >=18.0.0"
      }
    },
    "node_modules/@npmcli/fs": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/@npmcli/fs/-/fs-3.1.1.tgz",
      "integrity": "sha512-q9CRWjpHCMIh5sVyefoD1cA7PkvILqCZsnSOEUUivORLjxCO/Irmue2DprETiNgEqktDBZaM1Bi+jrarx1XdCg==",
      "dev": true,
      "dependencies": {
        "semver": "^7.3.5"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/@oozcitak/dom": {
      "version": "1.15.10",
      "resolved": "https://registry.npmjs.org/@oozcitak/dom/-/dom-1.15.10.tgz",
      "integrity": "sha512-0JT29/LaxVgRcGKvHmSrUTEvZ8BXvZhGl2LASRUgHqDTC1M5g1pLmVv56IYNyt3bG2CUjDkc67wnyZC14pbQrQ==",
      "dev": true,
      "dependencies": {
        "@oozcitak/infra": "1.0.8",
        "@oozcitak/url": "1.0.4",
        "@oozcitak/util": "8.3.8"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/@oozcitak/infra": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/@oozcitak/infra/-/infra-1.0.8.tgz",
      "integrity": "sha512-JRAUc9VR6IGHOL7OGF+yrvs0LO8SlqGnPAMqyzOuFZPSZSXI7Xf2O9+awQPSMXgIWGtgUf/dA6Hs6X6ySEaWTg==",
      "dev": true,
      "dependencies": {
        "@oozcitak/util": "8.3.8"
      },
      "engines": {
        "node": ">=6.0"
      }
    },
    "node_modules/@oozcitak/url": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/@oozcitak/url/-/url-1.0.4.tgz",
      "integrity": "sha512-kDcD8y+y3FCSOvnBI6HJgl00viO/nGbQoCINmQ0h98OhnGITrWR3bOGfwYCthgcrV8AnTJz8MzslTQbC3SOAmw==",
      "dev": true,
      "dependencies": {
        "@oozcitak/infra": "1.0.8",
        "@oozcitak/util": "8.3.8"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/@oozcitak/util": {
      "version": "8.3.8",
      "resolved": "https://registry.npmjs.org/@oozcitak/util/-/util-8.3.8.tgz",
      "integrity": "sha512-T8TbSnGsxo6TDBJx/Sgv/BlVJL3tshxZP7Aq5R1mSnM5OcHY2dQaxLMu2+E8u3gN0MLOzdjurqN4ZRVuzQycOQ==",
      "dev": true,
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/@oxc-project/types": {
      "version": "0.133.0",
      "resolved": "https://registry.npmjs.org/@oxc-project/types/-/types-0.133.0.tgz",
      "integrity": "sha512-KzkdCd6Uxqnf6l3HOw1xfatAlUURA0g14cvBYFyJ5SaNOQbOUvBr9PKArcPcrNIeRsBdgcUzOGrhKveVpvOIGA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/Boshen"
      }
    },
    "node_modules/@pkgjs/parseargs": {
      "version": "0.11.0",
      "resolved": "https://registry.npmjs.org/@pkgjs/parseargs/-/parseargs-0.11.0.tgz",
      "integrity": "sha512-+1VkjdD0QBLPodGrJUeqarH8VAIvQODIbwh9XpP5Syisf7YoQgsJKPNFoqqLQlu+VQ/tVSshMR6loPMn8U+dPg==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@playwright/test": {
      "version": "1.60.0",
      "resolved": "https://registry.npmjs.org/@playwright/test/-/test-1.60.0.tgz",
      "integrity": "sha512-O71yZIbAh/PxDMNGns37GHBIfrVkEVyn+AXyIa5dOTfb4/xNvRWV+Vv/NMbNCtODB/pO7vLlF2OTmMVLhmr7Ag==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "playwright": "1.60.0"
      },
      "bin": {
        "playwright": "cli.js"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@rolldown/binding-android-arm64": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-android-arm64/-/binding-android-arm64-1.0.3.tgz",
      "integrity": "sha512-454rs7jHngixp/NMxd5srYD57OnzSlZ/eFTETjORQHLwJG1lRtmNOJcBerZlfu4GjKqeq8aCCIQrMdHyhI51Hw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-darwin-arm64": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-arm64/-/binding-darwin-arm64-1.0.3.tgz",
      "integrity": "sha512-PcAhP+ynjURNyy8SKGl5DQP94aGuB/7JrXJb/t7P+hanXvQVMWzUvRRhBAcg/lNRadBhoUPqSoP4xw5tR/KBEA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-darwin-x64": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-x64/-/binding-darwin-x64-1.0.3.tgz",
      "integrity": "sha512-9YpfeUvSE2RS7wysJ81uOZkXJz7f7Q55H2Gvp3VEw/EsahqDtrphrZ0EwDLK5vvKOzaCrBsjF8JmnMLcUt78Gg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-freebsd-x64": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-freebsd-x64/-/binding-freebsd-x64-1.0.3.tgz",
      "integrity": "sha512-yB1IlAsSNHncV6SCTL27/MVGR5htvQsoGxIv5KMGXALp+Ll1wYsn+x98M9MW7qa+NdSbvrrY7ANI4wLJ0n1e6g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm-gnueabihf": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm-gnueabihf/-/binding-linux-arm-gnueabihf-1.0.3.tgz",
      "integrity": "sha512-Yi30IVAAfLUCy2MseFjbB1jAMDl1VMCAas5StnYp8da9+CKvMd2H2cbEjWcw5NPaPqzvYkVIaF1nNUG+b7u/sw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm64-gnu": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-gnu/-/binding-linux-arm64-gnu-1.0.3.tgz",
      "integrity": "sha512-jsO7R8To+AdlYgUmN5sHSCZbfhtMBkO0WUx8iORQnPcMMdgr7qM2DQmMwgabs3GhNztdmoKkMKQFHD6DTMCIQw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm64-musl": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-musl/-/binding-linux-arm64-musl-1.0.3.tgz",
      "integrity": "sha512-VWkUHwWriDciit80wleYwKILoR/KMvxh/IdwS/paX+ZgpuRpCrKLUdadJbc0NpBEiyhpYawsJ73j9aCvOH+f7Q==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-ppc64-gnu": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-ppc64-gnu/-/binding-linux-ppc64-gnu-1.0.3.tgz",
      "integrity": "sha512-5f1laC0SlIR0yDbFCd8acUhvJIag6N3zC5P7oUPN6wX0aOma+uKJ0wBDH5aq7I1PVI2ttTlhJwzwRIBnLiSGEg==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-s390x-gnu": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-s390x-gnu/-/binding-linux-s390x-gnu-1.0.3.tgz",
      "integrity": "sha512-Iq4ko0r4XsgbrF/LunNgHtAGLRRVE2kXonAXQ/MV0mC6jQpMOhW1SvtZja2EhC/kd05++bP78dsqBeIQyYJ6Yg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-x64-gnu": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-gnu/-/binding-linux-x64-gnu-1.0.3.tgz",
      "integrity": "sha512-B8m6tD5+/N5FeNQFbKlLA/2yVq9ycQP1SeedyEYYKWBNR3ZQbkvIUcNnDNM03lO1l5F2roiiFJGgvoLLyZXtSg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-x64-musl": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-musl/-/binding-linux-x64-musl-1.0.3.tgz",
      "integrity": "sha512-pSdpdUJHkuCxun9LE7jvgUB9qsRgaiyNNCX7m/AvHTcq67AiT/Yhoxvw5zPfhrM8k/BfP8ce/hMOpthKDpEUow==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-openharmony-arm64": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-openharmony-arm64/-/binding-openharmony-arm64-1.0.3.tgz",
      "integrity": "sha512-OXXS3RKJgX2uLwM+gYyuH5omcH8fL1LJs96pZGgtetVCahON57+d4SJHzTgZiOjxgGkSnpXpOsWuPDGAKAigEg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-wasm32-wasi": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-wasm32-wasi/-/binding-wasm32-wasi-1.0.3.tgz",
      "integrity": "sha512-JTtb8BWFynicNSoPrehsCzBtOKjZ6jhMiPFEmOiuXg1Fl8dn2KHQob+GuPSGR0dryQa1PQJbzjF3dqO/whhjLg==",
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "1.10.0",
        "@emnapi/runtime": "1.10.0",
        "@napi-rs/wasm-runtime": "^1.1.4"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-win32-arm64-msvc": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-arm64-msvc/-/binding-win32-arm64-msvc-1.0.3.tgz",
      "integrity": "sha512-gEdFFEN70A/jxb2svrWsN3aDL7OUtmvlOy+6fa2jxG8K0wQ1ZbdeLGnidov6Yu5/733dI5ySfzFlQ/cb0bSz1g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-win32-x64-msvc": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-x64-msvc/-/binding-win32-x64-msvc-1.0.3.tgz",
      "integrity": "sha512-eXB7CHuaQdqmJcc3koCNtNPmT/bj2gc999kUFgBxG8Ac0NdgXc4rkCHhqrgrhN3zddvvvrgzj1e90SuSfmyIXA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/pluginutils": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.0.1.tgz",
      "integrity": "sha512-2j9bGt5Jh8hj+vPtgzPtl72j0yRxHAyumoo6TNfAjsLB04UtpSvPbPcDcBMxz7n+9CYB0c1GxQFxYRg2jimqGw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@standard-schema/spec": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@standard-schema/spec/-/spec-1.1.0.tgz",
      "integrity": "sha512-l2aFy5jALhniG5HgqrD6jXLi/rUWrKvqN/qJx6yoJsgKhblVd+iqqU4RCXavm/jPityDo5TCvKMnpjKnOriy0w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@tybys/wasm-util": {
      "version": "0.10.2",
      "resolved": "https://registry.npmjs.org/@tybys/wasm-util/-/wasm-util-0.10.2.tgz",
      "integrity": "sha512-RoBvJ2X0wuKlWFIjrwffGw1IqZHKQqzIchKaadZZfnNpsAYp2mM0h36JtPCjNDAHGgYez/15uMBpfGwchhiMgg==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@types/chai": {
      "version": "5.2.3",
      "resolved": "https://registry.npmjs.org/@types/chai/-/chai-5.2.3.tgz",
      "integrity": "sha512-Mw558oeA9fFbv65/y4mHtXDs9bPnFMZAL/jxdPFUpOHHIXX91mcgEHbS5Lahr+pwZFR8A7GQleRWeI6cGFC2UA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/deep-eql": "*",
        "assertion-error": "^2.0.1"
      }
    },
    "node_modules/@types/deep-eql": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/@types/deep-eql/-/deep-eql-4.0.2.tgz",
      "integrity": "sha512-c9h9dVVMigMPc4bwTvC5dxqtqJZwQPePsWjPlpSOnojbor6pGqdk541lfA7AqFQr5pB1BRdq0juY9db81BwyFw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/estree": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.9.tgz",
      "integrity": "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/react": {
      "version": "19.2.0",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-19.2.0.tgz",
      "integrity": "sha512-1LOH8xovvsKsCBq1wnT4ntDUdCJKmnEakhsuoUSy6ExlHCkGP2hqnatagYTgFk6oeL0VU31u7SNjunPN+GchtA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "csstype": "^3.0.2"
      }
    },
    "node_modules/@types/react-dom": {
      "version": "19.2.0",
      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.2.0.tgz",
      "integrity": "sha512-brtBs0MnE9SMx7px208g39lRmC5uHZs96caOJfTjFcYSLHNamvaSMfJNagChVNkup2SdtOxKX1FDBkRSJe1ZAg==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^19.2.0"
      }
    },
    "node_modules/@vitejs/plugin-react": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-6.0.2.tgz",
      "integrity": "sha512-DlSMqo4WhThw4vB8Mpn0Woe9J+Jfq1geJ61AKW0QEgLzGMNwtIMdxbDUzLxcun8W7NbJO0e2Jg/Nxm3cCSVzzg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@rolldown/pluginutils": "^1.0.0"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "peerDependencies": {
        "@rolldown/plugin-babel": "^0.1.7 || ^0.2.0",
        "babel-plugin-react-compiler": "^1.0.0",
        "vite": "^8.0.0"
      },
      "peerDependenciesMeta": {
        "@rolldown/plugin-babel": {
          "optional": true
        },
        "babel-plugin-react-compiler": {
          "optional": true
        }
      }
    },
    "node_modules/@vitest/expect": {
      "version": "4.1.8",
      "resolved": "https://registry.npmjs.org/@vitest/expect/-/expect-4.1.8.tgz",
      "integrity": "sha512-h3nDO677RDLEGlBxyQ5CW8RlMThSKSRLUePLOx09gNIWRL40edgA1GCZSZgf1W55MFAG6/Sw14KeaAnqv0NKdQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@standard-schema/spec": "^1.1.0",
        "@types/chai": "^5.2.2",
        "@vitest/spy": "4.1.8",
        "@vitest/utils": "4.1.8",
        "chai": "^6.2.2",
        "tinyrainbow": "^3.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/vitest"
      }
    },
    "node_modules/@vitest/mocker": {
      "version": "4.1.8",
      "resolved": "https://registry.npmjs.org/@vitest/mocker/-/mocker-4.1.8.tgz",
      "integrity": "sha512-LEiN/xe4OSIbKe9HQIp5OC24agGD9J5CnmMgsLohVVoOPWL9a2sBoR6VBx43jQZb7Kr1l4RCuyCJzcAa0+dojw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@vitest/spy": "4.1.8",
        "estree-walker": "^3.0.3",
        "magic-string": "^0.30.21"
      },
      "funding": {
        "url": "https://opencollective.com/vitest"
      },
      "peerDependencies": {
        "msw": "^2.4.9",
        "vite": "^6.0.0 || ^7.0.0 || ^8.0.0"
      },
      "peerDependenciesMeta": {
        "msw": {
          "optional": true
        },
        "vite": {
          "optional": true
        }
      }
    },
    "node_modules/@vitest/pretty-format": {
      "version": "4.1.8",
      "resolved": "https://registry.npmjs.org/@vitest/pretty-format/-/pretty-format-4.1.8.tgz",
      "integrity": "sha512-9GasEBxpZ1VYIpqHf/0+YGg121uSNwCKOJqIrTwWP/TB7DmFCiaBpNl3aPZzoLWfWkuqhbH8vJIVobZkvdo2cA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "tinyrainbow": "^3.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/vitest"
      }
    },
    "node_modules/@vitest/runner": {
      "version": "4.1.8",
      "resolved": "https://registry.npmjs.org/@vitest/runner/-/runner-4.1.8.tgz",
      "integrity": "sha512-EmVxeBAfMJvycdjd6Hm+RbFBbA9fKvo0Kx37hNpBYoYeavH3RNsBXWDooR1mgD52dCrxIIuP7UotpfiwOikvcg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@vitest/utils": "4.1.8",
        "pathe": "^2.0.3"
      },
      "funding": {
        "url": "https://opencollective.com/vitest"
      }
    },
    "node_modules/@vitest/snapshot": {
      "version": "4.1.8",
      "resolved": "https://registry.npmjs.org/@vitest/snapshot/-/snapshot-4.1.8.tgz",
      "integrity": "sha512-acfZboRmAIf05DEKcBQy33VXojFJjtUdLyo7oOmV9kebb2xdU01UknNiPuPZoJZQyO7DF0gZdTGTpeAzET9QPQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@vitest/pretty-format": "4.1.8",
        "@vitest/utils": "4.1.8",
        "magic-string": "^0.30.21",
        "pathe": "^2.0.3"
      },
      "funding": {
        "url": "https://opencollective.com/vitest"
      }
    },
    "node_modules/@vitest/spy": {
      "version": "4.1.8",
      "resolved": "https://registry.npmjs.org/@vitest/spy/-/spy-4.1.8.tgz",
      "integrity": "sha512-6EevtBp6OZOPF7bmz36HrGMeP3txgVSrgebWxHOafDXGkhIzfXK14f8KF6MuFfgXXUeHxmpD3BQxkV00/3s5mA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://opencollective.com/vitest"
      }
    },
    "node_modules/@vitest/utils": {
      "version": "4.1.8",
      "resolved": "https://registry.npmjs.org/@vitest/utils/-/utils-4.1.8.tgz",
      "integrity": "sha512-uOJamYALNhfJ6iolExyQM40yIQwDqYnkKtQ5VCiSe17E33H0aQ/u+1GlRuz4LZBk6Mm3sg90G9hEbmEt37C1Zg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@vitest/pretty-format": "4.1.8",
        "convert-source-map": "^2.0.0",
        "tinyrainbow": "^3.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/vitest"
      }
    },
    "node_modules/abbrev": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-2.0.0.tgz",
      "integrity": "sha512-6/mh1E2u2YgEsCHdY0Yx5oW+61gZU+1vXaoiHHrpKeuRNNgFvS+/jrwHiQhB5apAf5oB7UB7E19ol2R2LKH8hQ==",
      "dev": true,
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/agent-base": {
      "version": "7.1.4",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-7.1.4.tgz",
      "integrity": "sha512-MnA+YT8fwfJPgBx3m60MNqakm30XOkyIoH1y6huTQvC0PwZG7ki8NacLBcrPbNoo8vEZy7Jpuk7+jMO+CUovTQ==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/aggregate-error": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/aggregate-error/-/aggregate-error-3.1.0.tgz",
      "integrity": "sha512-4I7Td01quW/RpocfNayFdFVk1qSuoh0E7JrbRJ16nH01HhKFQ88INq9Sd+nd72zqRySlr9BmDA8xlEJ6vJMrYA==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "clean-stack": "^2.0.0",
        "indent-string": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/ajv": {
      "version": "8.20.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-8.20.0.tgz",
      "integrity": "sha512-Thbli+OlOj+iMPYFBVBfJ3OmCAnaSyNn4M1vz9T6Gka5Jt9ba/HIR56joy65tY6kx/FCF5VXNB819Y7/GUrBGA==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "fast-deep-equal": "^3.1.3",
        "fast-uri": "^3.0.1",
        "json-schema-traverse": "^1.0.0",
        "require-from-string": "^2.0.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/ajv-formats": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/ajv-formats/-/ajv-formats-3.0.1.tgz",
      "integrity": "sha512-8iUql50EUR+uUcdRQ3HDqa6EVyo3docL8g5WJ3FNcWmu62IbkGUue/pEyLBW8VGKKucTPgqeks4fIU1DA4yowQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "ajv": "^8.0.0"
      },
      "peerDependencies": {
        "ajv": "^8.0.0"
      },
      "peerDependenciesMeta": {
        "ajv": {
          "optional": true
        }
      }
    },
    "node_modules/ajv-formats-draft2019": {
      "version": "1.6.1",
      "resolved": "https://registry.npmjs.org/ajv-formats-draft2019/-/ajv-formats-draft2019-1.6.1.tgz",
      "integrity": "sha512-JQPvavpkWDvIsBp2Z33UkYCtXCSpW4HD3tAZ+oL4iEFOk9obQZffx0yANwECt6vzr6ET+7HN5czRyqXbnq/u0Q==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "punycode": "^2.1.1",
        "schemes": "^1.4.0",
        "smtp-address-parser": "^1.0.3",
        "uri-js": "^4.4.1"
      },
      "peerDependencies": {
        "ajv": "*"
      }
    },
    "node_modules/ansi-regex": {
      "version": "6.2.2",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-6.2.2.tgz",
      "integrity": "sha512-Bq3SmSpyFHaWjPk8If9yc6svM8c56dB5BAtW4Qbw5jHTwwXXcTLoRMkpDJp6VL0XzlWaCHTXrkFURMYmD0sLqg==",
      "dev": true,
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-regex?sponsor=1"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dev": true,
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/argparse": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-1.0.10.tgz",
      "integrity": "sha512-o5Roy6tNG4SL/FOkCAN6RzjiakZS25RLYFrcMttJqbdd8BWrnA+fGz57iN5Pb06pvBGvl5gQ0B48dJlslXvoTg==",
      "dev": true,
      "dependencies": {
        "sprintf-js": "~1.0.2"
      }
    },
    "node_modules/array-find-index": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/array-find-index/-/array-find-index-1.0.2.tgz",
      "integrity": "sha512-M1HQyIXcBGtVywBt8WVdim+lrNaK7VHp99Qt5pSNziXznKHViIBbXWtfRTpEFpF/c4FdfxNAsCCwPp5phBYJtw==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/assertion-error": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/assertion-error/-/assertion-error-2.0.1.tgz",
      "integrity": "sha512-Izi8RQcffqCeNVgFigKli1ssklIbpHnCYc6AknXGYoB6grJqyeby7jv12JUQgmTAnIDnbck1uxksT4dzN3PWBA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/axe-core": {
      "version": "4.11.4",
      "resolved": "https://registry.npmjs.org/axe-core/-/axe-core-4.11.4.tgz",
      "integrity": "sha512-KunSNx+TVpkAw/6ULfhnx+HWRecjqZGTOyquAoWHYLRSdK1tB5Ihce1ZW+UY3fj33bYAFWPu7W/GRSmmrCGuxA==",
      "dev": true,
      "license": "MPL-2.0",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
      "dev": true
    },
    "node_modules/base64-js": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz",
      "integrity": "sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "optional": true
    },
    "node_modules/bindings": {
      "version": "1.5.0",
      "resolved": "https://registry.npmjs.org/bindings/-/bindings-1.5.0.tgz",
      "integrity": "sha512-p2q/t/mhvuOj/UeLlV6566GD/guowlr0hHxClI0W9m7MWYkL1F0hLo+0Aexs9HSPCtR1SXQ0TD3MMKrXZajbiQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "file-uri-to-path": "1.0.0"
      }
    },
    "node_modules/bl": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/bl/-/bl-4.1.0.tgz",
      "integrity": "sha512-1W07cM9gS6DcLperZfFSj+bWLtaPGSOHWhPiGzXmvVJbRLdG82sH/Kn8EtW1VqWVA54AKf2h5k5BbnIbwF3h6w==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "buffer": "^5.5.0",
        "inherits": "^2.0.4",
        "readable-stream": "^3.4.0"
      }
    },
    "node_modules/brace-expansion": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-2.1.1.tgz",
      "integrity": "sha512-WR1cURNjuvBLMZBMbqM0UoE+WAfdUcEV1ccD8PVBVOI+Z3ND4+SZbN8RsfT2bMuG1qwz5RFvPukSZm5fF2D5eA==",
      "dev": true,
      "dependencies": {
        "balanced-match": "^1.0.0"
      }
    },
    "node_modules/buffer": {
      "version": "5.7.1",
      "resolved": "https://registry.npmjs.org/buffer/-/buffer-5.7.1.tgz",
      "integrity": "sha512-EHcyIPBQ4BSGlvjB16k5KgAJ27CIsHY/2JBmCRReo48y9rQ3MaUzWX3KVlBa4U7MyX02HdVj0K7C3WaB3ju7FQ==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "optional": true,
      "dependencies": {
        "base64-js": "^1.3.1",
        "ieee754": "^1.1.13"
      }
    },
    "node_modules/cacache": {
      "version": "18.0.4",
      "resolved": "https://registry.npmjs.org/cacache/-/cacache-18.0.4.tgz",
      "integrity": "sha512-B+L5iIa9mgcjLbliir2th36yEwPftrzteHYujzsx3dFP/31GCHcIeS8f5MGd80odLOjaOvSpU3EEAmRQptkxLQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "@npmcli/fs": "^3.1.0",
        "fs-minipass": "^3.0.0",
        "glob": "^10.2.2",
        "lru-cache": "^10.0.1",
        "minipass": "^7.0.3",
        "minipass-collect": "^2.0.1",
        "minipass-flush": "^1.0.5",
        "minipass-pipeline": "^1.2.4",
        "p-map": "^4.0.0",
        "ssri": "^10.0.0",
        "tar": "^6.1.11",
        "unique-filename": "^3.0.0"
      },
      "engines": {
        "node": "^16.14.0 || >=18.0.0"
      }
    },
    "node_modules/chai": {
      "version": "6.2.2",
      "resolved": "https://registry.npmjs.org/chai/-/chai-6.2.2.tgz",
      "integrity": "sha512-NUPRluOfOiTKBKvWPtSD4PhFvWCqOi0BGStNWs57X9js7XGTprSmFoz5F0tWhR4WPjNeR9jXqdC7/UpSJTnlRg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/chalk": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
      "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^4.1.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/chownr": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/chownr/-/chownr-2.0.0.tgz",
      "integrity": "sha512-bIomtDF5KGpdogkLd9VspvFzk9KfpyyGlS8YFVZl7TGPBHL5snIOnxeshwVgPteQ9b4Eydl+pVbIyE1DcvCWgQ==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/clean-stack": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/clean-stack/-/clean-stack-2.2.0.tgz",
      "integrity": "sha512-4diC9HaTE+KRAMWhDhrGOECgWZxoevMc5TlkObMqNSsVU62PYzXZ/SMTjzyGAFF1YusgxGcSWTEXBhp0CPwQ1A==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "dev": true,
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "dev": true
    },
    "node_modules/commander": {
      "version": "10.0.1",
      "resolved": "https://registry.npmjs.org/commander/-/commander-10.0.1.tgz",
      "integrity": "sha512-y4Mg2tXshplEbSGzx7amzPwKKOCGuoSRP/CjEdwwk0FOGlUbq6lKuoyDZTNZkmxHdJtp54hdfY/JUrdL7Xfdug==",
      "dev": true,
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "dev": true,
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/cross-spawn/node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "dev": true
    },
    "node_modules/cross-spawn/node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "dev": true,
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/csstype": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "dev": true,
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/decompress-response": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/decompress-response/-/decompress-response-6.0.0.tgz",
      "integrity": "sha512-aW35yZM6Bb/4oJlZncMH2LCoZtJXTRxES17vE3hoRiowU2kWHaJKFkSBDnDR+cm9J+9QhXmREyIfv0pji9ejCQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "mimic-response": "^3.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/deep-extend": {
      "version": "0.6.0",
      "resolved": "https://registry.npmjs.org/deep-extend/-/deep-extend-0.6.0.tgz",
      "integrity": "sha512-LOHxIOaPYdHlJRtCQfDIVZtfw/ufM8+rVj649RIHzcm/vGwQRXFt6OPqIFWsm2XEMrNIEtWR64sY1LEKD2vAOA==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=4.0.0"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/discontinuous-range": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/discontinuous-range/-/discontinuous-range-1.0.0.tgz",
      "integrity": "sha512-c68LpLbO+7kP/b1Hr1qs8/BJ09F5khZGTxqxZuhzxpmwJKOgRFHJWIb9/KmqnqHhLdO55aOxFH/EGBvUQbL/RQ==",
      "dev": true,
      "optional": true
    },
    "node_modules/eastasianwidth": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/eastasianwidth/-/eastasianwidth-0.2.0.tgz",
      "integrity": "sha512-I88TYZWc9XiYHRQ4/3c5rjjfgkjhLyW2luGIheGERbNQ6OY7yTybanSpDXZa8y7VUP9YmDcYa+eyq4ca7iLqWA==",
      "dev": true
    },
    "node_modules/emoji-regex": {
      "version": "9.2.2",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-9.2.2.tgz",
      "integrity": "sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==",
      "dev": true
    },
    "node_modules/encoding": {
      "version": "0.1.13",
      "resolved": "https://registry.npmjs.org/encoding/-/encoding-0.1.13.tgz",
      "integrity": "sha512-ETBauow1T35Y/WZMkio9jiM0Z5xjHHmJ4XmjZOq1l/dXz3lr2sRn87nJy20RupqSh1F2m3HHPSp8ShIPQJrJ3A==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "iconv-lite": "^0.6.2"
      }
    },
    "node_modules/end-of-stream": {
      "version": "1.4.5",
      "resolved": "https://registry.npmjs.org/end-of-stream/-/end-of-stream-1.4.5.tgz",
      "integrity": "sha512-ooEGc6HP26xXq/N+GCGOT0JKCLDGrq2bQUZrQ7gyrJiZANJ/8YDTxTpQBXGMn+WbIQXNVpyWymm7KYVICQnyOg==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "once": "^1.4.0"
      }
    },
    "node_modules/env-paths": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/env-paths/-/env-paths-2.2.1.tgz",
      "integrity": "sha512-+h1lkLKhZMTYjog1VEpJNG7NZJWcuc2DDk/qsqSTRRCOXiLjeQ1d1/udrUGhqMxUgAlwKNZ0cf2uqan5GLuS2A==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/err-code": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/err-code/-/err-code-2.0.3.tgz",
      "integrity": "sha512-2bmlRpNKBxT/CRmPOlyISQpNj+qSeYvcym/uT0Jx2bMOlKLtSy1ZmLuVxSEKKyor/N5yhvp/ZiG1oE3DEYMSFA==",
      "dev": true,
      "optional": true
    },
    "node_modules/es-module-lexer": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-module-lexer/-/es-module-lexer-2.1.0.tgz",
      "integrity": "sha512-n27zTYMjYu1aj4MjCWzSP7G9r75utsaoc8m61weK+W8JMBGGQybd43GstCXZ3WNmSFtGT9wi59qQTW6mhTR5LQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/esprima": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/esprima/-/esprima-4.0.1.tgz",
      "integrity": "sha512-eGuFFw7Upda+g4p+QHvnW0RyTX/SVeJBDM/gCtMARO0cLuT2HcEKnTPvhjV6aGeqrCB/sbNop0Kszm0jsaWU4A==",
      "dev": true,
      "bin": {
        "esparse": "bin/esparse.js",
        "esvalidate": "bin/esvalidate.js"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/estree-walker": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/estree-walker/-/estree-walker-3.0.3.tgz",
      "integrity": "sha512-7RUKfXgSMMkzt6ZuXmqapOurLGPPfgj6l9uRZ7lRGolvk0y2yocc35LdcxKC5PQZdn2DMqioAQ2NoWcrTKmm6g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/estree": "^1.0.0"
      }
    },
    "node_modules/expand-template": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/expand-template/-/expand-template-2.0.3.tgz",
      "integrity": "sha512-XYfuKMvj4O35f/pOXLObndIRvyQ+/+6AhODh+OKWj9S9498pHHn/IMszH+gt0fBCRWMNfk1ZSp5x3AifmnI2vg==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/expect-type": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/expect-type/-/expect-type-1.3.0.tgz",
      "integrity": "sha512-knvyeauYhqjOYvQ66MznSMs83wmHrCycNEN6Ao+2AeYEfxUIkuiVxdEa1qlGEPK+We3n0THiDciYSsCcgW/DoA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=12.0.0"
      }
    },
    "node_modules/exponential-backoff": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/exponential-backoff/-/exponential-backoff-3.1.3.tgz",
      "integrity": "sha512-ZgEeZXj30q+I0EN+CbSSpIyPaJ5HVQD18Z1m+u1FXbAeT94mr1zw50q4q6jiiC447Nl/YTcIYSAftiGqetwXCA==",
      "dev": true,
      "optional": true
    },
    "node_modules/extend": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/extend/-/extend-3.0.2.tgz",
      "integrity": "sha512-fjquC59cD7CyW6urNXK0FBufkZcoiGG80wTuPujX590cB5Ttln20E2UB4S/WARVqhXffZl2LNgS+gQdPIIim/g==",
      "dev": true,
      "optional": true
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "dev": true,
      "optional": true
    },
    "node_modules/fast-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/fast-uri/-/fast-uri-3.1.2.tgz",
      "integrity": "sha512-rVjf7ArG3LTk+FS6Yw81V1DLuZl1bRbNrev6Tmd/9RaroeeRRJhAt7jg/6YFxbvAQXUCavSoZhPPj6oOx+5KjQ==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fastify"
        },
        {
          "type": "opencollective",
          "url": "https://opencollective.com/fastify"
        }
      ],
      "optional": true
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/file-uri-to-path": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/file-uri-to-path/-/file-uri-to-path-1.0.0.tgz",
      "integrity": "sha512-0Zt+s3L7Vf1biwWZ29aARiVYLx7iMGnEUl9x33fbB/j3jR81u/O2LbqK+Bm1CDSNDKVtJ/YjwY7TUd5SkeLQLw==",
      "dev": true,
      "optional": true
    },
    "node_modules/foreground-child": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/foreground-child/-/foreground-child-3.3.1.tgz",
      "integrity": "sha512-gIXjKqtFuWEgzFRJA9WCQeSJLZDjgJUOMCMzxtvFq/37KojM1BFGufqsCy0r4qSQmYLsZYMeyRqzIWOMup03sw==",
      "dev": true,
      "dependencies": {
        "cross-spawn": "^7.0.6",
        "signal-exit": "^4.0.1"
      },
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/fs-constants": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/fs-constants/-/fs-constants-1.0.0.tgz",
      "integrity": "sha512-y6OAwoSIf7FyjMIv94u+b5rdheZEjzR63GTyZJm5qh4Bi+2YgwLCcI/fPFZkL5PSixOt6ZNKm+w+Hfp/Bciwow==",
      "dev": true,
      "optional": true
    },
    "node_modules/fs-minipass": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/fs-minipass/-/fs-minipass-3.0.3.tgz",
      "integrity": "sha512-XUBA9XClHbnJWSfBzjkm6RvPsyg3sryZt06BEQoXcF7EK/xpGaQYJgQKDJSUH5SGZ76Y7pFx1QBnXz09rU5Fbw==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "minipass": "^7.0.3"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.2.tgz",
      "integrity": "sha512-xiqMQR4xAeHTuB9uWm+fFRcIOgKBMiOBP+eXiyT7jsgVCq1bkVygt00oASowB7EdtpOHaaPgKt812P9ab+DDKA==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "dev": true,
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/github-from-package": {
      "version": "0.0.0",
      "resolved": "https://registry.npmjs.org/github-from-package/-/github-from-package-0.0.0.tgz",
      "integrity": "sha512-SyHy3T1v2NUXn29OsWdxmK6RwHD+vkj3v8en8AOBZ1wBQ/hCAQ5bAQTD02kW4W9tUp/3Qh6J8r9EvntiyCmOOw==",
      "dev": true,
      "optional": true
    },
    "node_modules/glob": {
      "version": "10.5.0",
      "resolved": "https://registry.npmjs.org/glob/-/glob-10.5.0.tgz",
      "integrity": "sha512-DfXN8DfhJ7NH3Oe7cFmu3NCu1wKbkReJ8TorzSAFbSKrlNaQSKfIzqYqVY8zlbs2NLBbWpRiU52GX2PbaBVNkg==",
      "deprecated": "Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
      "dev": true,
      "dependencies": {
        "foreground-child": "^3.1.0",
        "jackspeak": "^3.1.2",
        "minimatch": "^9.0.4",
        "minipass": "^7.1.2",
        "package-json-from-dist": "^1.0.0",
        "path-scurry": "^1.11.1"
      },
      "bin": {
        "glob": "dist/esm/bin.mjs"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.11",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
      "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
      "dev": true,
      "optional": true
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "dev": true,
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/hosted-git-info": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/hosted-git-info/-/hosted-git-info-7.0.2.tgz",
      "integrity": "sha512-puUZAUKT5m8Zzvs72XWy3HtvVbTWljRE66cP60bxJzAqf2DgICo7lYTY2IHUmLnNpjYvw5bvmoHvPc0QO2a62w==",
      "dev": true,
      "dependencies": {
        "lru-cache": "^10.0.1"
      },
      "engines": {
        "node": "^16.14.0 || >=18.0.0"
      }
    },
    "node_modules/http-cache-semantics": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/http-cache-semantics/-/http-cache-semantics-4.2.0.tgz",
      "integrity": "sha512-dTxcvPXqPvXBQpq5dUr6mEMJX4oIEFv6bwom3FDwKRDsuIjjJGANqhBuoAn9c1RQJIdAKav33ED65E2ys+87QQ==",
      "dev": true,
      "optional": true
    },
    "node_modules/http-proxy-agent": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/http-proxy-agent/-/http-proxy-agent-7.0.2.tgz",
      "integrity": "sha512-T1gkAiYYDWYx3V5Bmyu7HcfcvL7mUrTWiM6yOfa3PIphViJ/gFPbvidQ+veqSOHci/PxBcDabeUNCzpOODJZig==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "agent-base": "^7.1.0",
        "debug": "^4.3.4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/https-proxy-agent": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-7.0.6.tgz",
      "integrity": "sha512-vK9P5/iUfdl95AI+JVyUuIcVtd4ofvtrOr3HNtM2yxC9bnMbEdp3x01OhQNnjb8IJYi38VlTE3mBXwcfvywuSw==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "agent-base": "^7.1.2",
        "debug": "4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.6.3.tgz",
      "integrity": "sha512-4fCk79wshMdzMp2rH06qWrJE4iolqLhCUH+OiuIgU++RB0+94NlDL81atO7GX55uUKueo0txHNtvEyI6D7WdMw==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/ieee754": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/ieee754/-/ieee754-1.2.1.tgz",
      "integrity": "sha512-dcyqhDvX1C46lXZcVqCpK+FtMRQVdIMN6/Df5js2zouUsqG7I6sFxitIC+7KYK29KdXOLHdu9zL4sFnoVQnqaA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "optional": true
    },
    "node_modules/imurmurhash": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz",
      "integrity": "sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=0.8.19"
      }
    },
    "node_modules/indent-string": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/indent-string/-/indent-string-4.0.0.tgz",
      "integrity": "sha512-EdDDZu4A2OyIK7Lr/2zG+w5jmbuk1DVBnEwREQvBzspBJkCEbRa8GxU1lghYcaGJCnRWibjDXlq779X1/y5xwg==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "dev": true,
      "optional": true
    },
    "node_modules/ini": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/ini/-/ini-1.3.8.tgz",
      "integrity": "sha512-JV/yugV2uzW5iMRSiZAyDtQd+nxtUnjeLt0acNdw98kKLrvuRVyB80tsREOE7yvGVgalhZ6RNXCmEHkUKBKxew==",
      "dev": true,
      "optional": true
    },
    "node_modules/ip-address": {
      "version": "10.2.0",
      "resolved": "https://registry.npmjs.org/ip-address/-/ip-address-10.2.0.tgz",
      "integrity": "sha512-/+S6j4E9AHvW9SWMSEY9Xfy66O5PWvVEJ08O0y5JGyEKQpojb0K0GKpz/v5HJ/G0vi3D2sjGK78119oXZeE0qA==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.16.2",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.2.tgz",
      "integrity": "sha512-evOr8xfXKxE6qSR0hSXL2r3sd7ALj8+7jQEUvPYcm5sgZFdJ+AYzT6yNmJenvIYQBgIGwfwz08sL8zoL7yq2BA==",
      "dev": true,
      "dependencies": {
        "hasown": "^2.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz",
      "integrity": "sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-lambda": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/is-lambda/-/is-lambda-1.0.1.tgz",
      "integrity": "sha512-z7CMFGNrENq5iFB9Bqo64Xk6Y9sg+epq1myIcdHaGnbMTYOxvzsEtdYqQUylB7LxfkvgrrjP32T6Ywciio9UIQ==",
      "dev": true,
      "optional": true
    },
    "node_modules/isexe": {
      "version": "3.1.5",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-3.1.5.tgz",
      "integrity": "sha512-6B3tLtFqtQS4ekarvLVMZ+X+VlvQekbe4taUkf/rhVO3d/h0M2rfARm/pXLcPEsjjMsFgrFgSrhQIxcSVrBz8w==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/jackspeak": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/jackspeak/-/jackspeak-3.4.3.tgz",
      "integrity": "sha512-OGlZQpz2yfahA/Rd1Y8Cd9SIEsqvXkLVoSw/cgwhnhFMDbsQFeZYoJJ7bIZBS9BcamUW96asq/npPWugM+RQBw==",
      "dev": true,
      "dependencies": {
        "@isaacs/cliui": "^8.0.2"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      },
      "optionalDependencies": {
        "@pkgjs/parseargs": "^0.11.0"
      }
    },
    "node_modules/js-yaml": {
      "version": "3.14.1",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-3.14.1.tgz",
      "integrity": "sha512-okMH7OXXJ7YrN9Ok3/SXrnu4iX9yOk+25nqX4imS2npuvTYDmo/QEZoqwZkYaIDk3jVvBOTOIEgEhaLOynBS9g==",
      "dev": true,
      "dependencies": {
        "argparse": "^1.0.7",
        "esprima": "^4.0.0"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/json-parse-even-better-errors": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/json-parse-even-better-errors/-/json-parse-even-better-errors-3.0.2.tgz",
      "integrity": "sha512-fi0NG4bPjCHunUJffmLd0gxssIgkNmArMvis4iNah6Owg1MCJjWhEcDLmsK6iGkJq3tHwbDkTlce70/tmXN4cQ==",
      "dev": true,
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/json-schema-traverse": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-1.0.0.tgz",
      "integrity": "sha512-NM8/P9n3XjXhIZn1lLhkFaACTOURQXjWhV4BA/RnOv8xvgqtqpAX9IO4mRQxSx1Rlo4tqzeqb0sOlruaOy3dug==",
      "dev": true,
      "optional": true
    },
    "node_modules/libxmljs2": {
      "version": "0.35.0",
      "resolved": "https://registry.npmjs.org/libxmljs2/-/libxmljs2-0.35.0.tgz",
      "integrity": "sha512-SpVopqn4YNydnLjkGfL6yQwzjlipmEnCCsVrD/0hQmdgsQWb5rVmSJxxjQltHIUTto29vgX+PhLjXoc+gMeABQ==",
      "dev": true,
      "hasInstallScript": true,
      "optional": true,
      "dependencies": {
        "bindings": "~1.5.0",
        "nan": "~2.20.0",
        "node-gyp": "^10.2.0",
        "prebuild-install": "^7.1.2"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/license-checker-rseidelsohn": {
      "version": "4.4.2",
      "resolved": "https://registry.npmjs.org/license-checker-rseidelsohn/-/license-checker-rseidelsohn-4.4.2.tgz",
      "integrity": "sha512-Sf8WaJhd2vELvCne+frS9AXqnY/vv591s2/nZcJDwTnoNgltG4mAmoenffVb8L2YPRYbxARLyrHJBC38AVfpuA==",
      "dev": true,
      "dependencies": {
        "chalk": "4.1.2",
        "debug": "^4.3.4",
        "lodash.clonedeep": "^4.5.0",
        "mkdirp": "^1.0.4",
        "nopt": "^7.2.0",
        "read-installed-packages": "^2.0.1",
        "semver": "^7.3.5",
        "spdx-correct": "^3.1.1",
        "spdx-expression-parse": "^3.0.1",
        "spdx-satisfies": "^5.0.1",
        "treeify": "^1.1.0"
      },
      "bin": {
        "license-checker-rseidelsohn": "bin/license-checker-rseidelsohn.js"
      },
      "engines": {
        "node": ">=18",
        "npm": ">=8"
      }
    },
    "node_modules/license-checker-rseidelsohn/node_modules/spdx-expression-parse": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/spdx-expression-parse/-/spdx-expression-parse-3.0.1.tgz",
      "integrity": "sha512-cbqHunsQWnJNE6KhVSMsMeH5H/L9EpymbzqTQ3uLwNCLZ1Q481oWaofqH7nO6V07xlXwY6PhQdQ2IedWx/ZK4Q==",
      "dev": true,
      "dependencies": {
        "spdx-exceptions": "^2.1.0",
        "spdx-license-ids": "^3.0.0"
      }
    },
    "node_modules/lightningcss": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.32.0.tgz",
      "integrity": "sha512-NXYBzinNrblfraPGyrbPoD19C1h9lfI/1mzgWYvXUTe414Gz/X1FD2XBZSZM7rRTrMA8JL3OtAaGifrIKhQ5yQ==",
      "dev": true,
      "license": "MPL-2.0",
      "dependencies": {
        "detect-libc": "^2.0.3"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "lightningcss-android-arm64": "1.32.0",
        "lightningcss-darwin-arm64": "1.32.0",
        "lightningcss-darwin-x64": "1.32.0",
        "lightningcss-freebsd-x64": "1.32.0",
        "lightningcss-linux-arm-gnueabihf": "1.32.0",
        "lightningcss-linux-arm64-gnu": "1.32.0",
        "lightningcss-linux-arm64-musl": "1.32.0",
        "lightningcss-linux-x64-gnu": "1.32.0",
        "lightningcss-linux-x64-musl": "1.32.0",
        "lightningcss-win32-arm64-msvc": "1.32.0",
        "lightningcss-win32-x64-msvc": "1.32.0"
      }
    },
    "node_modules/lightningcss-android-arm64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.32.0.tgz",
      "integrity": "sha512-YK7/ClTt4kAK0vo6w3X+Pnm0D2cf2vPHbhOXdoNti1Ga0al1P4TBZhwjATvjNwLEBCnKvjJc2jQgHXH0NEwlAg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-arm64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.32.0.tgz",
      "integrity": "sha512-RzeG9Ju5bag2Bv1/lwlVJvBE3q6TtXskdZLLCyfg5pt+HLz9BqlICO7LZM7VHNTTn/5PRhHFBSjk5lc4cmscPQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-x64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.32.0.tgz",
      "integrity": "sha512-U+QsBp2m/s2wqpUYT/6wnlagdZbtZdndSmut/NJqlCcMLTWp5muCrID+K5UJ6jqD2BFshejCYXniPDbNh73V8w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-freebsd-x64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.32.0.tgz",
      "integrity": "sha512-JCTigedEksZk3tHTTthnMdVfGf61Fky8Ji2E4YjUTEQX14xiy/lTzXnu1vwiZe3bYe0q+SpsSH/CTeDXK6WHig==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm-gnueabihf": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.32.0.tgz",
      "integrity": "sha512-x6rnnpRa2GL0zQOkt6rts3YDPzduLpWvwAF6EMhXFVZXD4tPrBkEFqzGowzCsIWsPjqSK+tyNEODUBXeeVHSkw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-gnu": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.32.0.tgz",
      "integrity": "sha512-0nnMyoyOLRJXfbMOilaSRcLH3Jw5z9HDNGfT/gwCPgaDjnx0i8w7vBzFLFR1f6CMLKF8gVbebmkUN3fa/kQJpQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-musl": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.32.0.tgz",
      "integrity": "sha512-UpQkoenr4UJEzgVIYpI80lDFvRmPVg6oqboNHfoH4CQIfNA+HOrZ7Mo7KZP02dC6LjghPQJeBsvXhJod/wnIBg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-gnu": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.32.0.tgz",
      "integrity": "sha512-V7Qr52IhZmdKPVr+Vtw8o+WLsQJYCTd8loIfpDaMRWGUZfBOYEJeyJIkqGIDMZPwPx24pUMfwSxxI8phr/MbOA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-musl": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.32.0.tgz",
      "integrity": "sha512-bYcLp+Vb0awsiXg/80uCRezCYHNg1/l3mt0gzHnWV9XP1W5sKa5/TCdGWaR/zBM2PeF/HbsQv/j2URNOiVuxWg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-arm64-msvc": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.32.0.tgz",
      "integrity": "sha512-8SbC8BR40pS6baCM8sbtYDSwEVQd4JlFTOlaD3gWGHfThTcABnNDBda6eTZeqbofalIJhFx0qKzgHJmcPTnGdw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-x64-msvc": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.32.0.tgz",
      "integrity": "sha512-Amq9B/SoZYdDi1kFrojnoqPLxYhQ4Wo5XiL8EVJrVsB8ARoC1PWW6VGtT0WKCemjy8aC+louJnjS7U18x3b06Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lodash.clonedeep": {
      "version": "4.5.0",
      "resolved": "https://registry.npmjs.org/lodash.clonedeep/-/lodash.clonedeep-4.5.0.tgz",
      "integrity": "sha512-H5ZhCF25riFd9uB5UCkVKo61m3S/xZk1x4wA6yp/L3RFP6Z/eHH1ymQcGLo7J3GMPfm0V/7m1tryHuGVxpqEBQ==",
      "dev": true
    },
    "node_modules/lru-cache": {
      "version": "10.4.3",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-10.4.3.tgz",
      "integrity": "sha512-JNAzZcXrCt42VGLuYz0zfAzDfAvJWW6AfYlDBQyDV5DClI2m5sAmK+OIO7s59XfsRsWHp02jAJrRadPRGTt6SQ==",
      "dev": true
    },
    "node_modules/magic-string": {
      "version": "0.30.21",
      "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.21.tgz",
      "integrity": "sha512-vd2F4YUyEXKGcLHoq+TEyCjxueSeHnFxyyjNp80yg0XV4vUhnDer/lvvlqM/arB5bXQN5K2/3oinyCRyx8T2CQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.5"
      }
    },
    "node_modules/make-fetch-happen": {
      "version": "13.0.1",
      "resolved": "https://registry.npmjs.org/make-fetch-happen/-/make-fetch-happen-13.0.1.tgz",
      "integrity": "sha512-cKTUFc/rbKUd/9meOvgrpJ2WrNzymt6jfRDdwg5UCnVzv9dTpEj9JS5m3wtziXVCjluIXyL8pcaukYqezIzZQA==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "@npmcli/agent": "^2.0.0",
        "cacache": "^18.0.0",
        "http-cache-semantics": "^4.1.1",
        "is-lambda": "^1.0.1",
        "minipass": "^7.0.2",
        "minipass-fetch": "^3.0.0",
        "minipass-flush": "^1.0.5",
        "minipass-pipeline": "^1.2.4",
        "negotiator": "^0.6.3",
        "proc-log": "^4.2.0",
        "promise-retry": "^2.0.1",
        "ssri": "^10.0.0"
      },
      "engines": {
        "node": "^16.14.0 || >=18.0.0"
      }
    },
    "node_modules/mimic-response": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/mimic-response/-/mimic-response-3.1.0.tgz",
      "integrity": "sha512-z0yWI+4FDrrweS8Zmt4Ej5HdJmky15+L2e6Wgn3+iK5fWzb6T3fhNFq2+MeTRb064c6Wr4N/wv0DzQTjNzHNGQ==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/minimatch": {
      "version": "9.0.9",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-9.0.9.tgz",
      "integrity": "sha512-OBwBN9AL4dqmETlpS2zasx+vTeWclWzkblfZk7KTA5j3jeOONz/tRCnZomUyvNg83wL5Zv9Ss6HMJXAgL8R2Yg==",
      "dev": true,
      "dependencies": {
        "brace-expansion": "^2.0.2"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/minimist": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz",
      "integrity": "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==",
      "dev": true,
      "optional": true,
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/minipass": {
      "version": "7.1.3",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-7.1.3.tgz",
      "integrity": "sha512-tEBHqDnIoM/1rXME1zgka9g6Q2lcoCkxHLuc7ODJ5BxbP5d4c2Z5cGgtXAku59200Cx7diuHTOYfSBD8n6mm8A==",
      "dev": true,
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/minipass-collect": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/minipass-collect/-/minipass-collect-2.0.1.tgz",
      "integrity": "sha512-D7V8PO9oaz7PWGLbCACuI1qEOsq7UKfLotx/C0Aet43fCUB/wfQ7DYeq2oR/svFJGYDHPr38SHATeaj/ZoKHKw==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "minipass": "^7.0.3"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/minipass-fetch": {
      "version": "3.0.5",
      "resolved": "https://registry.npmjs.org/minipass-fetch/-/minipass-fetch-3.0.5.tgz",
      "integrity": "sha512-2N8elDQAtSnFV0Dk7gt15KHsS0Fyz6CbYZ360h0WTYV1Ty46li3rAXVOQj1THMNLdmrD9Vt5pBPtWtVkpwGBqg==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "minipass": "^7.0.3",
        "minipass-sized": "^1.0.3",
        "minizlib": "^2.1.2"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      },
      "optionalDependencies": {
        "encoding": "^0.1.13"
      }
    },
    "node_modules/minipass-flush": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/minipass-flush/-/minipass-flush-1.0.7.tgz",
      "integrity": "sha512-TbqTz9cUwWyHS2Dy89P3ocAGUGxKjjLuR9z8w4WUTGAVgEj17/4nhgo2Du56i0Fm3Pm30g4iA8Lcqctc76jCzA==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "minipass": "^3.0.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/minipass-flush/node_modules/minipass": {
      "version": "3.3.6",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-3.3.6.tgz",
      "integrity": "sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minipass-pipeline": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/minipass-pipeline/-/minipass-pipeline-1.2.4.tgz",
      "integrity": "sha512-xuIq7cIOt09RPRJ19gdi4b+RiNvDFYe5JH+ggNvBqGqpQXcru3PcRmOZuHBKWK1Txf9+cQ+HMVN4d6z46LZP7A==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "minipass": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minipass-pipeline/node_modules/minipass": {
      "version": "3.3.6",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-3.3.6.tgz",
      "integrity": "sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minipass-sized": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/minipass-sized/-/minipass-sized-1.0.3.tgz",
      "integrity": "sha512-MbkQQ2CTiBMlA2Dm/5cY+9SWFEN8pzzOXi6rlM5Xxq0Yqbda5ZQy9sU75a673FE9ZK0Zsbr6Y5iP6u9nktfg2g==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "minipass": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minipass-sized/node_modules/minipass": {
      "version": "3.3.6",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-3.3.6.tgz",
      "integrity": "sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minizlib": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/minizlib/-/minizlib-2.1.2.tgz",
      "integrity": "sha512-bAxsR8BVfj60DWXHE3u30oHzfl4G7khkSuPW+qvpd7jFRHm7dLxOjUk1EHACJ/hxLY8phGJ0YhYHZo7jil7Qdg==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "minipass": "^3.0.0",
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/minizlib/node_modules/minipass": {
      "version": "3.3.6",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-3.3.6.tgz",
      "integrity": "sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/mkdirp": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-1.0.4.tgz",
      "integrity": "sha512-vVqVZQyf3WLx2Shd0qJ9xuvqgAyKPLAiqITEtqW0oIUjzo3PePDd6fW9iFz30ef7Ysp/oiWqbhszeGWW2T6Gzw==",
      "dev": true,
      "bin": {
        "mkdirp": "bin/cmd.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/mkdirp-classic": {
      "version": "0.5.3",
      "resolved": "https://registry.npmjs.org/mkdirp-classic/-/mkdirp-classic-0.5.3.tgz",
      "integrity": "sha512-gKLcREMhtuZRwRAfqP3RFW+TK4JqApVBtOIftVgjuABpAtpxhPGaDcfvbhNvD0B8iD1oUr/txX35NjcaY6Ns/A==",
      "dev": true,
      "optional": true
    },
    "node_modules/moo": {
      "version": "0.5.3",
      "resolved": "https://registry.npmjs.org/moo/-/moo-0.5.3.tgz",
      "integrity": "sha512-m2fmM2dDm7GZQsY7KK2cme8agi+AAljILjQnof7p1ZMDe6dQ4bdnSMx0cPppudoeNv5hEFQirN6u+O4fDE0IWA==",
      "dev": true,
      "optional": true
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true
    },
    "node_modules/nan": {
      "version": "2.20.0",
      "resolved": "https://registry.npmjs.org/nan/-/nan-2.20.0.tgz",
      "integrity": "sha512-bk3gXBZDGILuuo/6sKtr0DQmSThYHLtNCdSdXk9YkxD/jK6X2vmCyyXBBxyqZ4XcnzTyYEAThfX3DCEnLf6igw==",
      "dev": true,
      "optional": true
    },
    "node_modules/nanoid": {
      "version": "3.3.12",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.12.tgz",
      "integrity": "sha512-ZB9RH/39qpq5Vu6Y+NmUaFhQR6pp+M2Xt76XBnEwDaGcVAqhlvxrl3B2bKS5D3NH3QR76v3aSrKaF/Kiy7lEtQ==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/napi-build-utils": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/napi-build-utils/-/napi-build-utils-2.0.0.tgz",
      "integrity": "sha512-GEbrYkbfF7MoNaoh2iGG84Mnf/WZfB0GdGEsM8wz7Expx/LlWf5U8t9nvJKXSp3qr5IsEbK04cBGhol/KwOsWA==",
      "dev": true,
      "optional": true
    },
    "node_modules/nearley": {
      "version": "2.20.1",
      "resolved": "https://registry.npmjs.org/nearley/-/nearley-2.20.1.tgz",
      "integrity": "sha512-+Mc8UaAebFzgV+KpI5n7DasuuQCHA89dmwm7JXw3TV43ukfNQ9DnBH3Mdb2g/I4Fdxc26pwimBWvjIw0UAILSQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "commander": "^2.19.0",
        "moo": "^0.5.0",
        "railroad-diagrams": "^1.0.0",
        "randexp": "0.4.6"
      },
      "bin": {
        "nearley-railroad": "bin/nearley-railroad.js",
        "nearley-test": "bin/nearley-test.js",
        "nearley-unparse": "bin/nearley-unparse.js",
        "nearleyc": "bin/nearleyc.js"
      },
      "funding": {
        "type": "individual",
        "url": "https://nearley.js.org/#give-to-nearley"
      }
    },
    "node_modules/nearley/node_modules/commander": {
      "version": "2.20.3",
      "resolved": "https://registry.npmjs.org/commander/-/commander-2.20.3.tgz",
      "integrity": "sha512-GpVkmM8vF2vQUkj2LvZmD35JxeJOLCwJ9cUkugyk2nuhbv3+mJvpLYYt+0+USMxE+oj+ey/lJEnhZw75x/OMcQ==",
      "dev": true,
      "optional": true
    },
    "node_modules/negotiator": {
      "version": "0.6.4",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.4.tgz",
      "integrity": "sha512-myRT3DiWPHqho5PrJaIRyaMv2kgYf0mUVgBNOYMuCH5Ki1yEiQaf/ZJuQ62nvpc44wL5WDbTX7yGJi1Neevw8w==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/node-abi": {
      "version": "3.92.0",
      "resolved": "https://registry.npmjs.org/node-abi/-/node-abi-3.92.0.tgz",
      "integrity": "sha512-KdHvFWZjEKDf0cakgFjebl371GPsISX2oZHcuyKqM7DtogIsHrqKeLTo8wBHxaXRAQlY2PsPlZmfo+9ZCxEREQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "semver": "^7.3.5"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/node-gyp": {
      "version": "10.3.1",
      "resolved": "https://registry.npmjs.org/node-gyp/-/node-gyp-10.3.1.tgz",
      "integrity": "sha512-Pp3nFHBThHzVtNY7U6JfPjvT/DTE8+o/4xKsLQtBoU+j2HLsGlhcfzflAoUreaJbNmYnX+LlLi0qjV8kpyO6xQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "env-paths": "^2.2.0",
        "exponential-backoff": "^3.1.1",
        "glob": "^10.3.10",
        "graceful-fs": "^4.2.6",
        "make-fetch-happen": "^13.0.0",
        "nopt": "^7.0.0",
        "proc-log": "^4.1.0",
        "semver": "^7.3.5",
        "tar": "^6.2.1",
        "which": "^4.0.0"
      },
      "bin": {
        "node-gyp": "bin/node-gyp.js"
      },
      "engines": {
        "node": "^16.14.0 || >=18.0.0"
      }
    },
    "node_modules/nopt": {
      "version": "7.2.1",
      "resolved": "https://registry.npmjs.org/nopt/-/nopt-7.2.1.tgz",
      "integrity": "sha512-taM24ViiimT/XntxbPyJQzCG+p4EKOpgD3mxFwW38mGjVUrfERQOeY4EDHjdnptttfHuHQXFx+lTP08Q+mLa/w==",
      "dev": true,
      "dependencies": {
        "abbrev": "^2.0.0"
      },
      "bin": {
        "nopt": "bin/nopt.js"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/normalize-package-data": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/normalize-package-data/-/normalize-package-data-6.0.2.tgz",
      "integrity": "sha512-V6gygoYb/5EmNI+MEGrWkC+e6+Rr7mTmfHrxDbLzxQogBkgzo76rkok0Am6thgSF7Mv2nLOajAJj5vDJZEFn7g==",
      "dev": true,
      "dependencies": {
        "hosted-git-info": "^7.0.0",
        "semver": "^7.3.5",
        "validate-npm-package-license": "^3.0.4"
      },
      "engines": {
        "node": "^16.14.0 || >=18.0.0"
      }
    },
    "node_modules/npm-normalize-package-bin": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/npm-normalize-package-bin/-/npm-normalize-package-bin-3.0.1.tgz",
      "integrity": "sha512-dMxCf+zZ+3zeQZXKxmyuCKlIDPGuv8EF940xbkC4kQVDTtqoh6rJFO+JTKSA6/Rwi0getWmtuy4Itup0AMcaDQ==",
      "dev": true,
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/obug": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/obug/-/obug-2.1.2.tgz",
      "integrity": "sha512-AWGB9WFcRXOQs48Z/udjI5ZcZMHXwX8XPByNpOydgcGsDLIzjGizhoMWJyKAWze7AVW/2W1i+/gPX4YtKe5cyg==",
      "dev": true,
      "funding": [
        "https://github.com/sponsors/sxzz",
        "https://opencollective.com/debug"
      ],
      "license": "MIT",
      "engines": {
        "node": ">=12.20.0"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/p-map": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/p-map/-/p-map-4.0.0.tgz",
      "integrity": "sha512-/bjOqmgETBYB5BoEeGVea8dmvHb2m9GLy1E9W43yeyfP6QQCZGFNa+XRceJEuDB6zqr+gKpIAmlLebMpykw/MQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "aggregate-error": "^3.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/package-json-from-dist": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/package-json-from-dist/-/package-json-from-dist-1.0.1.tgz",
      "integrity": "sha512-UEZIS3/by4OC8vL3P2dTXRETpebLI2NiI5vIrjaD/5UtrkFX/tNbwjTSRAGC/+7CAo2pIcBaRgWmcBBHcsaCIw==",
      "dev": true
    },
    "node_modules/packageurl-js": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/packageurl-js/-/packageurl-js-2.0.1.tgz",
      "integrity": "sha512-N5ixXjzTy4QDQH0Q9YFjqIWd6zH6936Djpl2m9QNFmDv5Fum8q8BjkpAcHNMzOFE0IwQrFhJWex3AN6kS0OSwg==",
      "dev": true
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-scurry": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/path-scurry/-/path-scurry-1.11.1.tgz",
      "integrity": "sha512-Xa4Nw17FS9ApQFJ9umLiJS4orGjm7ZzwUrwamcGQuHSzDyth9boKDaycYdDcZDuqYATXw4HFXgaqWTctW/v1HA==",
      "dev": true,
      "dependencies": {
        "lru-cache": "^10.2.0",
        "minipass": "^5.0.0 || ^6.0.2 || ^7.0.0"
      },
      "engines": {
        "node": ">=16 || 14 >=14.18"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/pathe": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/pathe/-/pathe-2.0.3.tgz",
      "integrity": "sha512-WUjGcAqP1gQacoQe+OBJsFA7Ld4DyXuUIjZ5cc75cLHvJ7dtNsTugphxIADwspS+AraAUePCKrSVtPLFj/F88w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.4.tgz",
      "integrity": "sha512-QP88BAKvMam/3NxH6vj2o21R6MjxZUAd6nlwAS/pnGvN9IVLocLHxGYIzFhg6fUQ+5th6P4dv4eW9jX3DSIj7A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/playwright": {
      "version": "1.60.0",
      "resolved": "https://registry.npmjs.org/playwright/-/playwright-1.60.0.tgz",
      "integrity": "sha512-hheHdokM8cdqCb0lcE3s+zT4t4W+vvjpGxsZlDnikarzx8tSzMebh3UiFtgqwFwnTnjYQcsyMF8ei2mCO/tpeA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "playwright-core": "1.60.0"
      },
      "bin": {
        "playwright": "cli.js"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "fsevents": "2.3.2"
      }
    },
    "node_modules/playwright-core": {
      "version": "1.60.0",
      "resolved": "https://registry.npmjs.org/playwright-core/-/playwright-core-1.60.0.tgz",
      "integrity": "sha512-9bW6zvX/m0lEbgTKJ6YppOKx8H3VOPBMOCFh2irXFOT4BbHgrx5hPjwJYLT40Lu+4qtD36qKc/Hn56StUW57IA==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "playwright-core": "cli.js"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.15",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.15.tgz",
      "integrity": "sha512-FfR8sjd4em2T6fb3I2MwAJU7HWVMr9zba+enmQeeWFfCbm+UOC/0X4DS8XtpUTMwWMGbjKYP7xjfNekzyGmB3A==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.12",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/prebuild-install": {
      "version": "7.1.3",
      "resolved": "https://registry.npmjs.org/prebuild-install/-/prebuild-install-7.1.3.tgz",
      "integrity": "sha512-8Mf2cbV7x1cXPUILADGI3wuhfqWvtiLA1iclTDbFRZkgRQS0NqsPZphna9V+HyTEadheuPmjaJMsbzKQFOzLug==",
      "deprecated": "No longer maintained. Please contact the author of the relevant native addon; alternatives are available.",
      "dev": true,
      "optional": true,
      "dependencies": {
        "detect-libc": "^2.0.0",
        "expand-template": "^2.0.3",
        "github-from-package": "0.0.0",
        "minimist": "^1.2.3",
        "mkdirp-classic": "^0.5.3",
        "napi-build-utils": "^2.0.0",
        "node-abi": "^3.3.0",
        "pump": "^3.0.0",
        "rc": "^1.2.7",
        "simple-get": "^4.0.0",
        "tar-fs": "^2.0.0",
        "tunnel-agent": "^0.6.0"
      },
      "bin": {
        "prebuild-install": "bin.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/proc-log": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-4.2.0.tgz",
      "integrity": "sha512-g8+OnU/L2v+wyiVK+D5fA34J7EH8jZ8DDlvwhRCMxmMj7UCBvxiO1mGeN+36JXIKF4zevU4kRBd8lVgG9vLelA==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/promise-retry": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/promise-retry/-/promise-retry-2.0.1.tgz",
      "integrity": "sha512-y+WKFlBR8BGXnsNlIHFGPZmyDf3DFMoLhaflAnyZgV6rG6xu+JwesTo2Q9R6XwYmtmwAFCkAk3e35jEdoeh/3g==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "err-code": "^2.0.2",
        "retry": "^0.12.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/pump": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/pump/-/pump-3.0.4.tgz",
      "integrity": "sha512-VS7sjc6KR7e1ukRFhQSY5LM2uBWAUPiOPa/A3mkKmiMwSmRFUITt0xuj+/lesgnCv+dPIEYlkzrcyXgquIHMcA==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "end-of-stream": "^1.1.0",
        "once": "^1.3.1"
      }
    },
    "node_modules/punycode": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/railroad-diagrams": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/railroad-diagrams/-/railroad-diagrams-1.0.0.tgz",
      "integrity": "sha512-cz93DjNeLY0idrCNOH6PviZGRN9GJhsdm9hpn1YCS879fj4W+x5IFJhhkRZcwVgMmFF7R82UA/7Oh+R8lLZg6A==",
      "dev": true,
      "optional": true
    },
    "node_modules/randexp": {
      "version": "0.4.6",
      "resolved": "https://registry.npmjs.org/randexp/-/randexp-0.4.6.tgz",
      "integrity": "sha512-80WNmd9DA0tmZrw9qQa62GPPWfuXJknrmVmLcxvq4uZBdYqb1wYoKTmnlGUchvVWe0XiLupYkBoXVOxz3C8DYQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "discontinuous-range": "1.0.0",
        "ret": "~0.1.10"
      },
      "engines": {
        "node": ">=0.12"
      }
    },
    "node_modules/rc": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/rc/-/rc-1.2.8.tgz",
      "integrity": "sha512-y3bGgqKj3QBdxLbLkomlohkvsA8gdAiUQlSBJnBhfn+BPxg4bc62d8TcBW15wavDfgexCgccckhcZvywyQYPOw==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "deep-extend": "^0.6.0",
        "ini": "~1.3.0",
        "minimist": "^1.2.0",
        "strip-json-comments": "~2.0.1"
      },
      "bin": {
        "rc": "cli.js"
      }
    },
    "node_modules/react": {
      "version": "19.2.7",
      "resolved": "https://registry.npmjs.org/react/-/react-19.2.7.tgz",
      "integrity": "sha512-HNe9WslTbXmFK8o8cmwgAeJFSBvt1bPdHCVKtaaV+WlAN36mpT4hcRpwbf3fY56ar2oIXzsBpOAiIRHAdY0OlQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "19.2.7",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.2.7.tgz",
      "integrity": "sha512-t0BRVXvbiE/o20Hfw669rLbMCDWtYZLvmJigy2f0MxsXF+71pxhR3xOkspmsO8h3ZlNzyibAmtCa3l4lYKk6gQ==",
      "license": "MIT",
      "dependencies": {
        "scheduler": "^0.27.0"
      },
      "peerDependencies": {
        "react": "^19.2.7"
      }
    },
    "node_modules/read-installed-packages": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/read-installed-packages/-/read-installed-packages-2.0.1.tgz",
      "integrity": "sha512-t+fJOFOYaZIjBpTVxiV8Mkt7yQyy4E6MSrrnt5FmPd4enYvpU/9DYGirDmN1XQwkfeuWIhM/iu0t2rm6iSr0CA==",
      "dev": true,
      "dependencies": {
        "@npmcli/fs": "^3.1.0",
        "debug": "^4.3.4",
        "read-package-json": "^6.0.0",
        "semver": "2 || 3 || 4 || 5 || 6 || 7",
        "slide": "~1.1.3"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      },
      "optionalDependencies": {
        "graceful-fs": "^4.1.2"
      }
    },
    "node_modules/read-package-json": {
      "version": "6.0.4",
      "resolved": "https://registry.npmjs.org/read-package-json/-/read-package-json-6.0.4.tgz",
      "integrity": "sha512-AEtWXYfopBj2z5N5PbkAOeNHRPUg5q+Nen7QLxV8M2zJq1ym6/lCz3fYNTCXe19puu2d06jfHhrP7v/S2PtMMw==",
      "deprecated": "This package is no longer supported. Please use @npmcli/package-json instead.",
      "dev": true,
      "dependencies": {
        "glob": "^10.2.2",
        "json-parse-even-better-errors": "^3.0.0",
        "normalize-package-data": "^5.0.0",
        "npm-normalize-package-bin": "^3.0.0"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/read-package-json/node_modules/hosted-git-info": {
      "version": "6.1.3",
      "resolved": "https://registry.npmjs.org/hosted-git-info/-/hosted-git-info-6.1.3.tgz",
      "integrity": "sha512-HVJyzUrLIL1c0QmviVh5E8VGyUS7xCFPS6yydaVd1UegW+ibV/CohqTH9MkOLDp5o+rb82DMo77PTuc9F/8GKw==",
      "dev": true,
      "dependencies": {
        "lru-cache": "^7.5.1"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/read-package-json/node_modules/lru-cache": {
      "version": "7.18.3",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-7.18.3.tgz",
      "integrity": "sha512-jumlc0BIUrS3qJGgIkWZsyfAM7NCWiBcCDhnd+3NNM5KbBmLTgHVfWBcg6W+rLUsIpzpERPsvwUP7CckAQSOoA==",
      "dev": true,
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/read-package-json/node_modules/normalize-package-data": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/normalize-package-data/-/normalize-package-data-5.0.0.tgz",
      "integrity": "sha512-h9iPVIfrVZ9wVYQnxFgtw1ugSvGEMOlyPWWtm8BMJhnwyEL/FLbYbTY3V3PpjI/BUK67n9PEWDu6eHzu1fB15Q==",
      "dev": true,
      "dependencies": {
        "hosted-git-info": "^6.0.0",
        "is-core-module": "^2.8.1",
        "semver": "^7.3.5",
        "validate-npm-package-license": "^3.0.4"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/readable-stream": {
      "version": "3.6.2",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-3.6.2.tgz",
      "integrity": "sha512-9u/sniCrY3D5WdsERHzHE4G2YCXqoG5FTHUiCC4SIbr6XcLZBY05ya9EKjYek9O5xOAwjGq+1JdGBAS7Q9ScoA==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "inherits": "^2.0.3",
        "string_decoder": "^1.1.1",
        "util-deprecate": "^1.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/require-from-string": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/require-from-string/-/require-from-string-2.0.2.tgz",
      "integrity": "sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/ret": {
      "version": "0.1.15",
      "resolved": "https://registry.npmjs.org/ret/-/ret-0.1.15.tgz",
      "integrity": "sha512-TTlYpa+OL+vMMNG24xSlQGEJ3B/RzEfUlLct7b5G/ytav+wPrplCpVMFuwzXbkecJrb6IYo1iFb0S9v37754mg==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=0.12"
      }
    },
    "node_modules/retry": {
      "version": "0.12.0",
      "resolved": "https://registry.npmjs.org/retry/-/retry-0.12.0.tgz",
      "integrity": "sha512-9LkiTwjUh6rT555DtE9rTX+BKByPfrMzEAtnlEtdEwr3Nkffwiihqe2bWADg+OQRjt9gl6ICdmB/ZFDCGAtSow==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/rolldown": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/rolldown/-/rolldown-1.0.3.tgz",
      "integrity": "sha512-i00lAJ2ks1BYr7rjNjKC7BcqAS7nVfiT3QX1SI5aY+AFHblCmaUf9OE9dbdzDvW6dJxbi2ZCZiy9v3CcwOiX3g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@oxc-project/types": "=0.133.0",
        "@rolldown/pluginutils": "^1.0.0"
      },
      "bin": {
        "rolldown": "bin/cli.mjs"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "optionalDependencies": {
        "@rolldown/binding-android-arm64": "1.0.3",
        "@rolldown/binding-darwin-arm64": "1.0.3",
        "@rolldown/binding-darwin-x64": "1.0.3",
        "@rolldown/binding-freebsd-x64": "1.0.3",
        "@rolldown/binding-linux-arm-gnueabihf": "1.0.3",
        "@rolldown/binding-linux-arm64-gnu": "1.0.3",
        "@rolldown/binding-linux-arm64-musl": "1.0.3",
        "@rolldown/binding-linux-ppc64-gnu": "1.0.3",
        "@rolldown/binding-linux-s390x-gnu": "1.0.3",
        "@rolldown/binding-linux-x64-gnu": "1.0.3",
        "@rolldown/binding-linux-x64-musl": "1.0.3",
        "@rolldown/binding-openharmony-arm64": "1.0.3",
        "@rolldown/binding-wasm32-wasi": "1.0.3",
        "@rolldown/binding-win32-arm64-msvc": "1.0.3",
        "@rolldown/binding-win32-x64-msvc": "1.0.3"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "optional": true
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "dev": true,
      "optional": true
    },
    "node_modules/scheduler": {
      "version": "0.27.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
      "integrity": "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q==",
      "license": "MIT"
    },
    "node_modules/schemes": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/schemes/-/schemes-1.4.0.tgz",
      "integrity": "sha512-ImFy9FbCsQlVgnE3TCWmLPCFnVzx0lHL/l+umHplDqAKd0dzFpnS6lFZIpagBlYhKwzVmlV36ec0Y1XTu8JBAQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "extend": "^3.0.0"
      }
    },
    "node_modules/semver": {
      "version": "7.8.2",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.2.tgz",
      "integrity": "sha512-c8jsqUZm3omBOI66G90z1Dyw5z622G8oLG+omfsHBJf3CWQTlOcwOjvOG6wtiNfW6anKm/eA39LMwMtMez2TiQ==",
      "dev": true,
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "dev": true,
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/siginfo": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/siginfo/-/siginfo-2.0.0.tgz",
      "integrity": "sha512-ybx0WO1/8bSBLEWXZvEd7gMW3Sn3JFlW3TvX1nREbDLRNQNaeNN8WK0meBwPdAaOI7TtRRRJn/Es1zhrrCHu7g==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/signal-exit": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-4.1.0.tgz",
      "integrity": "sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==",
      "dev": true,
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/simple-concat": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/simple-concat/-/simple-concat-1.0.1.tgz",
      "integrity": "sha512-cSFtAPtRhljv69IK0hTVZQ+OfE9nePi/rtJmw5UjHeVyVroEqJXP1sFztKUy1qU+xvz3u/sfYJLa947b7nAN2Q==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "optional": true
    },
    "node_modules/simple-get": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/simple-get/-/simple-get-4.0.1.tgz",
      "integrity": "sha512-brv7p5WgH0jmQJr1ZDDfKDOSeWWg+OVypG99A/5vYGPqJ6pxiaHLy8nxtFjBA7oMa01ebA9gfh1uMCFqOuXxvA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "optional": true,
      "dependencies": {
        "decompress-response": "^6.0.0",
        "once": "^1.3.1",
        "simple-concat": "^1.0.0"
      }
    },
    "node_modules/slide": {
      "version": "1.1.6",
      "resolved": "https://registry.npmjs.org/slide/-/slide-1.1.6.tgz",
      "integrity": "sha512-NwrtjCg+lZoqhFU8fOwl4ay2ei8PaqCBOUV3/ektPY9trO1yQ1oXEfmHAhKArUVUr/hOHvy5f6AdP17dCM0zMw==",
      "dev": true,
      "engines": {
        "node": "*"
      }
    },
    "node_modules/smart-buffer": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/smart-buffer/-/smart-buffer-4.2.0.tgz",
      "integrity": "sha512-94hK0Hh8rPqQl2xXc3HsaBoOXKV20MToPkcXvwbISWLEs+64sBq5kFgn2kJDHb1Pry9yrP0dxrCI9RRci7RXKg==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">= 6.0.0",
        "npm": ">= 3.0.0"
      }
    },
    "node_modules/smtp-address-parser": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/smtp-address-parser/-/smtp-address-parser-1.1.0.tgz",
      "integrity": "sha512-Gz11jbNU0plrReU9Sj7fmshSBxxJ9ShdD2q4ktHIHo/rpTH6lFyQoYHYKINPJtPe8aHFnsbtW46Ls0tCCBsIZg==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "nearley": "^2.20.1"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/socks": {
      "version": "2.8.9",
      "resolved": "https://registry.npmjs.org/socks/-/socks-2.8.9.tgz",
      "integrity": "sha512-LJhUYUvItdQ0LkJTmPeaEObWXAqFyfmP85x0tch/ez9cahmhlBBLbIqDFnvBnUJGagb0JbIQrkBs1wJ+yRYpEw==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "ip-address": "^10.1.1",
        "smart-buffer": "^4.2.0"
      },
      "engines": {
        "node": ">= 10.0.0",
        "npm": ">= 3.0.0"
      }
    },
    "node_modules/socks-proxy-agent": {
      "version": "8.0.5",
      "resolved": "https://registry.npmjs.org/socks-proxy-agent/-/socks-proxy-agent-8.0.5.tgz",
      "integrity": "sha512-HehCEsotFqbPW9sJ8WVYB6UbmIMv7kUUORIF2Nncq4VQvBfNBLibW9YZR5dlYCSUhwcD628pRllm7n+E+YTzJw==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "agent-base": "^7.1.2",
        "debug": "^4.3.4",
        "socks": "^2.8.3"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/spdx-compare": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/spdx-compare/-/spdx-compare-1.0.0.tgz",
      "integrity": "sha512-C1mDZOX0hnu0ep9dfmuoi03+eOdDoz2yvK79RxbcrVEG1NO1Ph35yW102DHWKN4pk80nwCgeMmSY5L25VE4D9A==",
      "dev": true,
      "dependencies": {
        "array-find-index": "^1.0.2",
        "spdx-expression-parse": "^3.0.0",
        "spdx-ranges": "^2.0.0"
      }
    },
    "node_modules/spdx-compare/node_modules/spdx-expression-parse": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/spdx-expression-parse/-/spdx-expression-parse-3.0.1.tgz",
      "integrity": "sha512-cbqHunsQWnJNE6KhVSMsMeH5H/L9EpymbzqTQ3uLwNCLZ1Q481oWaofqH7nO6V07xlXwY6PhQdQ2IedWx/ZK4Q==",
      "dev": true,
      "dependencies": {
        "spdx-exceptions": "^2.1.0",
        "spdx-license-ids": "^3.0.0"
      }
    },
    "node_modules/spdx-correct": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/spdx-correct/-/spdx-correct-3.2.0.tgz",
      "integrity": "sha512-kN9dJbvnySHULIluDHy32WHRUu3Og7B9sbY7tsFLctQkIqnMh3hErYgdMjTYuqmcXX+lK5T1lnUt3G7zNswmZA==",
      "dev": true,
      "dependencies": {
        "spdx-expression-parse": "^3.0.0",
        "spdx-license-ids": "^3.0.0"
      }
    },
    "node_modules/spdx-correct/node_modules/spdx-expression-parse": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/spdx-expression-parse/-/spdx-expression-parse-3.0.1.tgz",
      "integrity": "sha512-cbqHunsQWnJNE6KhVSMsMeH5H/L9EpymbzqTQ3uLwNCLZ1Q481oWaofqH7nO6V07xlXwY6PhQdQ2IedWx/ZK4Q==",
      "dev": true,
      "dependencies": {
        "spdx-exceptions": "^2.1.0",
        "spdx-license-ids": "^3.0.0"
      }
    },
    "node_modules/spdx-exceptions": {
      "version": "2.5.0",
      "resolved": "https://registry.npmjs.org/spdx-exceptions/-/spdx-exceptions-2.5.0.tgz",
      "integrity": "sha512-PiU42r+xO4UbUS1buo3LPJkjlO7430Xn5SVAhdpzzsPHsjbYVflnnFdATgabnLude+Cqu25p6N+g2lw/PFsa4w==",
      "dev": true
    },
    "node_modules/spdx-expression-parse": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/spdx-expression-parse/-/spdx-expression-parse-4.0.0.tgz",
      "integrity": "sha512-Clya5JIij/7C6bRR22+tnGXbc4VKlibKSVj2iHvVeX5iMW7s1SIQlqu699JkODJJIhh/pUu8L0/VLh8xflD+LQ==",
      "dev": true,
      "dependencies": {
        "spdx-exceptions": "^2.1.0",
        "spdx-license-ids": "^3.0.0"
      }
    },
    "node_modules/spdx-license-ids": {
      "version": "3.0.23",
      "resolved": "https://registry.npmjs.org/spdx-license-ids/-/spdx-license-ids-3.0.23.tgz",
      "integrity": "sha512-CWLcCCH7VLu13TgOH+r8p1O/Znwhqv/dbb6lqWy67G+pT1kHmeD/+V36AVb/vq8QMIQwVShJ6Ssl5FPh0fuSdw==",
      "dev": true
    },
    "node_modules/spdx-ranges": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/spdx-ranges/-/spdx-ranges-2.1.1.tgz",
      "integrity": "sha512-mcdpQFV7UDAgLpXEE/jOMqvK4LBoO0uTQg0uvXUewmEFhpiZx5yJSZITHB8w1ZahKdhfZqP5GPEOKLyEq5p8XA==",
      "dev": true
    },
    "node_modules/spdx-satisfies": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/spdx-satisfies/-/spdx-satisfies-5.0.1.tgz",
      "integrity": "sha512-Nwor6W6gzFp8XX4neaKQ7ChV4wmpSh2sSDemMFSzHxpTw460jxFYeOn+jq4ybnSSw/5sc3pjka9MQPouksQNpw==",
      "dev": true,
      "dependencies": {
        "spdx-compare": "^1.0.0",
        "spdx-expression-parse": "^3.0.0",
        "spdx-ranges": "^2.0.0"
      }
    },
    "node_modules/spdx-satisfies/node_modules/spdx-expression-parse": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/spdx-expression-parse/-/spdx-expression-parse-3.0.1.tgz",
      "integrity": "sha512-cbqHunsQWnJNE6KhVSMsMeH5H/L9EpymbzqTQ3uLwNCLZ1Q481oWaofqH7nO6V07xlXwY6PhQdQ2IedWx/ZK4Q==",
      "dev": true,
      "dependencies": {
        "spdx-exceptions": "^2.1.0",
        "spdx-license-ids": "^3.0.0"
      }
    },
    "node_modules/sprintf-js": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/sprintf-js/-/sprintf-js-1.0.3.tgz",
      "integrity": "sha512-D9cPgkvLlV3t3IzL0D0YLvGA9Ahk4PcvVwUbN0dSGr1aP0Nrt4AEnTUbuGvquEC0mA64Gqt1fzirlRs5ibXx8g==",
      "dev": true
    },
    "node_modules/ssri": {
      "version": "10.0.6",
      "resolved": "https://registry.npmjs.org/ssri/-/ssri-10.0.6.tgz",
      "integrity": "sha512-MGrFH9Z4NP9Iyhqn16sDtBpRRNJ0Y2hNa6D65h736fVSaPCHr4DM4sWUNvVaSuC+0OBGhwsrydQwmgfg5LncqQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "minipass": "^7.0.3"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/stackback": {
      "version": "0.0.2",
      "resolved": "https://registry.npmjs.org/stackback/-/stackback-0.0.2.tgz",
      "integrity": "sha512-1XMJE5fQo1jGH6Y/7ebnwPOBEkIEnT4QF32d5R1+VXdXveM0IBMJt8zfaxX1P3QhVwrYe+576+jkANtSS2mBbw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/std-env": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/std-env/-/std-env-4.1.0.tgz",
      "integrity": "sha512-Rq7ybcX2RuC55r9oaPVEW7/xu3tj8u4GeBYHBWCychFtzMIr86A7e3PPEBPT37sHStKX3+TiX/Fr/ACmJLVlLQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/string_decoder": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz",
      "integrity": "sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "safe-buffer": "~5.2.0"
      }
    },
    "node_modules/string-width": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-5.1.2.tgz",
      "integrity": "sha512-HnLOCR3vjcY8beoNLtcjZ5/nxn2afmME6lhrDrebokqMap+XbeW8n9TXpPDOqdGK5qcI3oT0GKTW6wC7EMiVqA==",
      "dev": true,
      "dependencies": {
        "eastasianwidth": "^0.2.0",
        "emoji-regex": "^9.2.2",
        "strip-ansi": "^7.0.1"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/string-width-cjs": {
      "name": "string-width",
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "dev": true,
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/string-width-cjs/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/string-width-cjs/node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "dev": true
    },
    "node_modules/string-width-cjs/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dev": true,
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-7.2.0.tgz",
      "integrity": "sha512-yDPMNjp4WyfYBkHnjIRLfca1i6KMyGCtsVgoKe/z1+6vukgaENdgGBZt+ZmKPc4gavvEZ5OgHfHdrazhgNyG7w==",
      "dev": true,
      "dependencies": {
        "ansi-regex": "^6.2.2"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/strip-ansi?sponsor=1"
      }
    },
    "node_modules/strip-ansi-cjs": {
      "name": "strip-ansi",
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dev": true,
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi-cjs/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-json-comments": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-2.0.1.tgz",
      "integrity": "sha512-4gB8na07fecVVkOI6Rs4e7T6NOTki5EmL7TUduTs6bu3EdnSycntVJ4re8kgZA+wx9IueI2Y11bfbgwtzuE0KQ==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "dev": true,
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/tar": {
      "version": "6.2.1",
      "resolved": "https://registry.npmjs.org/tar/-/tar-6.2.1.tgz",
      "integrity": "sha512-DZ4yORTwrbTj/7MZYq2w+/ZFdI6OZ/f9SFHR+71gIVUZhOQPHzVCLpvRnPgyaMpfWxxk/4ONva3GQSyNIKRv6A==",
      "deprecated": "Old versions of tar are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
      "dev": true,
      "optional": true,
      "dependencies": {
        "chownr": "^2.0.0",
        "fs-minipass": "^2.0.0",
        "minipass": "^5.0.0",
        "minizlib": "^2.1.1",
        "mkdirp": "^1.0.3",
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/tar-fs": {
      "version": "2.1.4",
      "resolved": "https://registry.npmjs.org/tar-fs/-/tar-fs-2.1.4.tgz",
      "integrity": "sha512-mDAjwmZdh7LTT6pNleZ05Yt65HC3E+NiQzl672vQG38jIrehtJk/J3mNwIg+vShQPcLF/LV7CMnDW6vjj6sfYQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "chownr": "^1.1.1",
        "mkdirp-classic": "^0.5.2",
        "pump": "^3.0.0",
        "tar-stream": "^2.1.4"
      }
    },
    "node_modules/tar-fs/node_modules/chownr": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/chownr/-/chownr-1.1.4.tgz",
      "integrity": "sha512-jJ0bqzaylmJtVnNgzTeSOs8DPavpbYgEr/b0YL8/2GO3xJEhInFmhKMUnEJQjZumK7KXGFhUy89PrsJWlakBVg==",
      "dev": true,
      "optional": true
    },
    "node_modules/tar-stream": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/tar-stream/-/tar-stream-2.2.0.tgz",
      "integrity": "sha512-ujeqbceABgwMZxEJnk2HDY2DlnUZ+9oEcb1KzTVfYHio0UE6dG71n60d8D2I4qNvleWrrXpmjpt7vZeF1LnMZQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "bl": "^4.0.3",
        "end-of-stream": "^1.4.1",
        "fs-constants": "^1.0.0",
        "inherits": "^2.0.3",
        "readable-stream": "^3.1.1"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/tar/node_modules/fs-minipass": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/fs-minipass/-/fs-minipass-2.1.0.tgz",
      "integrity": "sha512-V/JgOLFCS+R6Vcq0slCuaeWEdNC3ouDlJMNIsacH2VtALiu9mV4LPrHc5cDl8k5aw6J8jwgWWpiTo5RYhmIzvg==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "minipass": "^3.0.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/tar/node_modules/fs-minipass/node_modules/minipass": {
      "version": "3.3.6",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-3.3.6.tgz",
      "integrity": "sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/tar/node_modules/minipass": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-5.0.0.tgz",
      "integrity": "sha512-3FnjYuehv9k6ovOEbyOswadCDPX1piCfhV8ncmYtHOjuPwylVWsghTLo7rabjC3Rx5xD4HDx8Wm1xnMF7S5qFQ==",
      "dev": true,
      "optional": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/tinybench": {
      "version": "2.9.0",
      "resolved": "https://registry.npmjs.org/tinybench/-/tinybench-2.9.0.tgz",
      "integrity": "sha512-0+DUvqWMValLmha6lr4kD8iAMK1HzV0/aKnCtWb9v9641TnP/MFb7Pc2bxoxQjTXAErryXVgUOfv2YqNllqGeg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/tinyexec": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/tinyexec/-/tinyexec-1.2.4.tgz",
      "integrity": "sha512-SHf/r48b7vOrjve9PxJo3MN5v5yuyjHvdUcrQffT3WXMUfnGmHDVbC4k3sHJaJTgZCwpUplIaAo5ANtMyp3YHg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tinyrainbow": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/tinyrainbow/-/tinyrainbow-3.1.0.tgz",
      "integrity": "sha512-Bf+ILmBgretUrdJxzXM0SgXLZ3XfiaUuOj/IKQHuTXip+05Xn+uyEYdVg0kYDipTBcLrCVyUzAPz7QmArb0mmw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/treeify": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/treeify/-/treeify-1.1.0.tgz",
      "integrity": "sha512-1m4RA7xVAJrSGrrXGs0L3YTwyvBs2S8PbRHaLZAkFw7JR8oIFwYtysxlBZhYIa7xSyiYJKZ3iGrrk55cGA3i9A==",
      "dev": true,
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "dev": true,
      "license": "0BSD",
      "optional": true
    },
    "node_modules/tunnel-agent": {
      "version": "0.6.0",
      "resolved": "https://registry.npmjs.org/tunnel-agent/-/tunnel-agent-0.6.0.tgz",
      "integrity": "sha512-McnNiV1l8RYeY8tBgEpuodCC1mLUdbSN+CYBL7kJsJNInOP8UjDDEwdk6Mw60vdLLrr5NHKZhMAOSrR2NZuQ+w==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "safe-buffer": "^5.0.1"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/typescript": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-6.0.3.tgz",
      "integrity": "sha512-y2TvuxSZPDyQakkFRPZHKFm+KKVqIisdg9/CZwm9ftvKXLP8NRWj38/ODjNbr43SsoXqNuAisEf1GdCxqWcdBw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/unique-filename": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/unique-filename/-/unique-filename-3.0.0.tgz",
      "integrity": "sha512-afXhuC55wkAmZ0P18QsVE6kp8JaxrEokN2HGIoIVv2ijHQd419H0+6EigAFcIzXeMIkcIkNBpB3L/DXB3cTS/g==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "unique-slug": "^4.0.0"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/unique-slug": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/unique-slug/-/unique-slug-4.0.0.tgz",
      "integrity": "sha512-WrcA6AyEfqDX5bWige/4NQfPZMtASNVxdmWR76WESYQVAACSgWcR6e9i0mofqqBxYFtL4oAxPIptY73/0YE1DQ==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "imurmurhash": "^0.1.4"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/uri-js": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/uri-js/-/uri-js-4.4.1.tgz",
      "integrity": "sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "punycode": "^2.1.0"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
      "dev": true,
      "optional": true
    },
    "node_modules/validate-npm-package-license": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/validate-npm-package-license/-/validate-npm-package-license-3.0.4.tgz",
      "integrity": "sha512-DpKm2Ui/xN7/HQKCtpZxoRWBhZ9Z0kqtygG8XCgNQ8ZlDnxuQmWhj566j8fN4Cu3/JmbhsDo7fcAJq4s9h27Ew==",
      "dev": true,
      "dependencies": {
        "spdx-correct": "^3.0.0",
        "spdx-expression-parse": "^3.0.0"
      }
    },
    "node_modules/validate-npm-package-license/node_modules/spdx-expression-parse": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/spdx-expression-parse/-/spdx-expression-parse-3.0.1.tgz",
      "integrity": "sha512-cbqHunsQWnJNE6KhVSMsMeH5H/L9EpymbzqTQ3uLwNCLZ1Q481oWaofqH7nO6V07xlXwY6PhQdQ2IedWx/ZK4Q==",
      "dev": true,
      "dependencies": {
        "spdx-exceptions": "^2.1.0",
        "spdx-license-ids": "^3.0.0"
      }
    },
    "node_modules/vite": {
      "version": "8.0.16",
      "resolved": "https://registry.npmjs.org/vite/-/vite-8.0.16.tgz",
      "integrity": "sha512-h9bXPmJichP5fLmVQo3PyaGSDE2n3aPuomeAlVRm0JLmt4rY6zmPKd59HYI4LNW8oTK7tlTsuC7l/m7awx9Jcw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "lightningcss": "^1.32.0",
        "picomatch": "^4.0.4",
        "postcss": "^8.5.15",
        "rolldown": "1.0.3",
        "tinyglobby": "^0.2.17"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "@vitejs/devtools": "^0.1.18",
        "esbuild": "^0.27.0 || ^0.28.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "@vitejs/devtools": {
          "optional": true
        },
        "esbuild": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/vite/node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/vitest": {
      "version": "4.1.8",
      "resolved": "https://registry.npmjs.org/vitest/-/vitest-4.1.8.tgz",
      "integrity": "sha512-flY6ScbCIt9HThs+C5HS7jvGOB560DJtk/Z15IQROTA6zEy49Nh8T/dofWTQL+n3vswqn87sbJNiuqw1SDp5Ig==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@vitest/expect": "4.1.8",
        "@vitest/mocker": "4.1.8",
        "@vitest/pretty-format": "4.1.8",
        "@vitest/runner": "4.1.8",
        "@vitest/snapshot": "4.1.8",
        "@vitest/spy": "4.1.8",
        "@vitest/utils": "4.1.8",
        "es-module-lexer": "^2.0.0",
        "expect-type": "^1.3.0",
        "magic-string": "^0.30.21",
        "obug": "^2.1.1",
        "pathe": "^2.0.3",
        "picomatch": "^4.0.3",
        "std-env": "^4.0.0-rc.1",
        "tinybench": "^2.9.0",
        "tinyexec": "^1.0.2",
        "tinyglobby": "^0.2.15",
        "tinyrainbow": "^3.1.0",
        "vite": "^6.0.0 || ^7.0.0 || ^8.0.0",
        "why-is-node-running": "^2.3.0"
      },
      "bin": {
        "vitest": "vitest.mjs"
      },
      "engines": {
        "node": "^20.0.0 || ^22.0.0 || >=24.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/vitest"
      },
      "peerDependencies": {
        "@edge-runtime/vm": "*",
        "@opentelemetry/api": "^1.9.0",
        "@types/node": "^20.0.0 || ^22.0.0 || >=24.0.0",
        "@vitest/browser-playwright": "4.1.8",
        "@vitest/browser-preview": "4.1.8",
        "@vitest/browser-webdriverio": "4.1.8",
        "@vitest/coverage-istanbul": "4.1.8",
        "@vitest/coverage-v8": "4.1.8",
        "@vitest/ui": "4.1.8",
        "happy-dom": "*",
        "jsdom": "*",
        "vite": "^6.0.0 || ^7.0.0 || ^8.0.0"
      },
      "peerDependenciesMeta": {
        "@edge-runtime/vm": {
          "optional": true
        },
        "@opentelemetry/api": {
          "optional": true
        },
        "@types/node": {
          "optional": true
        },
        "@vitest/browser-playwright": {
          "optional": true
        },
        "@vitest/browser-preview": {
          "optional": true
        },
        "@vitest/browser-webdriverio": {
          "optional": true
        },
        "@vitest/coverage-istanbul": {
          "optional": true
        },
        "@vitest/coverage-v8": {
          "optional": true
        },
        "@vitest/ui": {
          "optional": true
        },
        "happy-dom": {
          "optional": true
        },
        "jsdom": {
          "optional": true
        },
        "vite": {
          "optional": false
        }
      }
    },
    "node_modules/which": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/which/-/which-4.0.0.tgz",
      "integrity": "sha512-GlaYyEb07DPxYCKhKzplCWBJtvxZcZMrL+4UkrTSJHHPyZU4mYYTv3qaOe77H7EODLSSopAUFAc6W8U4yqvscg==",
      "dev": true,
      "optional": true,
      "dependencies": {
        "isexe": "^3.1.1"
      },
      "bin": {
        "node-which": "bin/which.js"
      },
      "engines": {
        "node": "^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/why-is-node-running": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/why-is-node-running/-/why-is-node-running-2.3.0.tgz",
      "integrity": "sha512-hUrmaWBdVDcxvYqnyh09zunKzROWjbZTiNy8dBEjkS7ehEDQibXJ7XvlmtbwuTclUiIyN+CyXQD4Vmko8fNm8w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "siginfo": "^2.0.0",
        "stackback": "0.0.2"
      },
      "bin": {
        "why-is-node-running": "cli.js"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi": {
      "version": "8.1.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-8.1.0.tgz",
      "integrity": "sha512-si7QWI6zUMq56bESFvagtmzMdGOtoxfR+Sez11Mobfc7tm+VkUckk9bW2UeffTGVUbOksxmSw0AA2gs8g71NCQ==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^6.1.0",
        "string-width": "^5.0.1",
        "strip-ansi": "^7.0.1"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrap-ansi-cjs": {
      "name": "wrap-ansi",
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz",
      "integrity": "sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrap-ansi-cjs/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi-cjs/node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "dev": true
    },
    "node_modules/wrap-ansi-cjs/node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "dev": true,
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi-cjs/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dev": true,
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi/node_modules/ansi-styles": {
      "version": "6.2.3",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-6.2.3.tgz",
      "integrity": "sha512-4Dj6M28JB+oAH8kFkTLUo+a2jwOFkuqb3yucU0CANcRRUbxS0cP0nZYCGjcc3BNXwRIsUVmDGgzawme7zvJHvg==",
      "dev": true,
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "dev": true,
      "optional": true
    },
    "node_modules/xmlbuilder2": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/xmlbuilder2/-/xmlbuilder2-3.1.1.tgz",
      "integrity": "sha512-WCSfbfZnQDdLQLiMdGUQpMxxckeQ4oZNMNhLVkcekTu7xhD4tuUDyAPoY8CwXvBYE6LwBHd6QW2WZXlOWr1vCw==",
      "dev": true,
      "dependencies": {
        "@oozcitak/dom": "1.15.10",
        "@oozcitak/infra": "1.0.8",
        "@oozcitak/util": "8.3.8",
        "js-yaml": "3.14.1"
      },
      "engines": {
        "node": ">=12.0"
      }
    },
    "node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==",
      "dev": true,
      "optional": true
    }
  }
}
``````

<!-- END EXACT FILE 11/27: package-lock.json -->

<!-- BEGIN EXACT FILE 12/27: src/overpass.ts -->

### src/overpass.ts

``````text
import packageMetadata from "../package.json";

export const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";
export const APP_VERSION = packageMetadata.version;
export const CONTACT_URL = "https://github.com/ajason13/chart-the-course";
export const OSM_COPYRIGHT_URL = "https://www.openstreetmap.org/copyright";

export type Bbox = {
  south: number;
  west: number;
  north: number;
  east: number;
};

export type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  tags?: Record<string, unknown>;
  bounds?: Partial<Bbox>;
  center?: { lat?: unknown; lon?: unknown };
  [key: string]: unknown;
};

export type OverpassResponse = {
  elements: OverpassElement[];
  [key: string]: unknown;
};

export type SourceMetadata = {
  query: string;
  endpoint: string;
  completedAt: string;
  bbox: string;
  copyrightUrl: string;
};

export type CachedResponse = {
  rawResponse: string;
  source: SourceMetadata;
};

export type RequestFailure =
  | { kind: "cancelled" }
  | { kind: "timeout" }
  | { kind: "network"; message: string }
  | { kind: "http"; status: number };

const DECIMAL_PATTERN = /^-?\d+(?:\.\d{1,7})?$/;
const ASCII_CONTROL_PATTERN = /[\u0000-\u001f\u007f]/;
const TRUSTED_COMMENT_PATTERN = /[\u0000-\u001f\u007f]|\*\//;
const NAME_ESCAPE_PATTERN = /["\\.*+?()[\]{}|^$]/;

function canonicalCoordinate(value: number): string {
  const normalized = Object.is(value, -0) ? 0 : value;
  return normalized.toFixed(7).replace(/\.?0+$/, "");
}

export function serializeBbox(bbox: Bbox): string {
  return [bbox.south, bbox.west, bbox.north, bbox.east]
    .map(canonicalCoordinate)
    .join(",");
}

export function parseBbox(fields: Record<keyof Bbox, string>):
  | { ok: true; bbox: Bbox; serialized: string }
  | { ok: false; field: keyof Bbox; message: string } {
  const keys: (keyof Bbox)[] = ["south", "west", "north", "east"];
  const values = {} as Bbox;

  for (const key of keys) {
    const input = fields[key].trim();
    if (!DECIMAL_PATTERN.test(input)) {
      return {
        ok: false,
        field: key,
        message: "Use decimal degrees with at most seven decimal places.",
      };
    }
    values[key] = Number(input);
  }

  if (values.south < -90 || values.south >= values.north || values.north > 90) {
    return { ok: false, field: "south", message: "South must be below north within -90 to 90." };
  }
  if (values.west < -180 || values.west >= values.east || values.east > 180) {
    return { ok: false, field: "west", message: "West must be below east within -180 to 180." };
  }
  if (Number((values.north - values.south).toFixed(7)) > 0.35) {
    return { ok: false, field: "north", message: "Latitude span cannot exceed 0.35 degrees." };
  }
  if (Number((values.east - values.west).toFixed(7)) > 0.35) {
    return { ok: false, field: "east", message: "Longitude span cannot exceed 0.35 degrees." };
  }

  return { ok: true, bbox: values, serialized: serializeBbox(values) };
}

export function parseCandidateBounds(value: unknown): Bbox | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const candidate = {
    south: source.south ?? source.minlat,
    west: source.west ?? source.minlon,
    north: source.north ?? source.maxlat,
    east: source.east ?? source.maxlon,
  };
  if (Object.values(candidate).some((coordinate) => typeof coordinate !== "number" || !Number.isFinite(coordinate))) {
    return null;
  }
  const bbox = candidate as Bbox;
  const parsed = parseBbox({
    south: canonicalCoordinate(bbox.south),
    west: canonicalCoordinate(bbox.west),
    north: canonicalCoordinate(bbox.north),
    east: canonicalCoordinate(bbox.east),
  });
  return parsed.ok ? parsed.bbox : null;
}

export function encodeCourseName(input: string): string {
  const trimmed = input.trim();
  if (ASCII_CONTROL_PATTERN.test(trimmed)) {
    throw new Error("Course name cannot contain control characters.");
  }
  if ([...trimmed].length > 200) {
    throw new Error("Course name cannot exceed 200 characters.");
  }
  return [...trimmed].map((character) => NAME_ESCAPE_PATTERN.test(character) ? `\\${character}` : character).join("");
}

export function validateTrustedIdentity(value: string): string {
  if (!value || TRUSTED_COMMENT_PATTERN.test(value)) {
    throw new Error("Invalid trusted query identity constant.");
  }
  return value;
}

function comment(purpose: "discovery" | "detail"): string {
  return `/* chart-the-course/${validateTrustedIdentity(APP_VERSION)} contact:${validateTrustedIdentity(CONTACT_URL)} purpose:golf-course-${purpose} */`;
}

export function buildDiscoveryQuery(bbox: Bbox, courseName: string): string {
  const bounds = serializeBbox(bbox);
  const encodedName = encodeCourseName(courseName);
  const nameBlock = encodedName
    ? `  nwr["leisure"="golf_course"]["name"~"${encodedName}",i](${bounds});\n`
    : "";
  return `${comment("discovery")}
[out:json][timeout:25][maxsize:536870912];
(
${nameBlock}  nwr["leisure"="golf_course"](${bounds});
);
out tags center bb;`;
}

export function buildDetailQuery(bbox: Bbox): string {
  const bounds = serializeBbox(bbox);
  return `${comment("detail")}
[out:json][timeout:45][maxsize:536870912];
(
  nwr["leisure"="golf_course"](${bounds});
  nwr["golf"~"^(hole|fairway|green|bunker|tee|water_hazard|lateral_water_hazard|rough|out_of_bounds|pin|cartpath)$"](${bounds});
  nwr["natural"~"^(water|wood|tree|tree_row|scrub)$"](${bounds});
  nwr["landuse"~"^(forest|reservoir|basin)$"](${bounds});
  nwr["water"~"^(pond|lake|basin|reservoir)$"](${bounds});
  nwr["waterway"](${bounds});
);
out body geom;`;
}

export function validateResponse(value: unknown): OverpassResponse | null {
  if (!value || typeof value !== "object" || !Array.isArray((value as OverpassResponse).elements)) {
    return null;
  }
  const response = value as OverpassResponse;
  const valid = response.elements.every((element) =>
    Boolean(element)
    && typeof element === "object"
    && ["node", "way", "relation"].includes(element.type)
    && Number.isInteger(element.id));
  return valid ? response : null;
}

export function classifyHttpStatus(status: number): "rate-limit" | "timeout" | "http" {
  if (status === 429) return "rate-limit";
  if (status === 504) return "timeout";
  return "http";
}

export function discoveryCacheKey(bbox: Bbox, courseName: string): string {
  return `ctc:overpass:v1:discovery:${serializeBbox(bbox)}:${encodeCourseName(courseName).toLocaleLowerCase("en-US")}`;
}

export function detailCacheKey(bbox: Bbox): string {
  return `ctc:overpass:v1:detail:${serializeBbox(bbox)}`;
}

export function readCache(storage: Storage, key: string):
  | { kind: "miss" }
  | { kind: "hit"; cached: CachedResponse; response: OverpassResponse }
  | { kind: "warning"; message: string } {
  try {
    const value = storage.getItem(key);
    if (value === null) return { kind: "miss" };
    const cached = JSON.parse(value) as CachedResponse;
    if (!cached || typeof cached.rawResponse !== "string" || !cached.source || typeof cached.source.query !== "string") {
      return { kind: "warning", message: "Session cache entry was invalid and was ignored." };
    }
    const response = validateResponse(JSON.parse(cached.rawResponse));
    return response
      ? { kind: "hit", cached, response }
      : { kind: "warning", message: "Session cache entry was invalid and was ignored." };
  } catch {
    return { kind: "warning", message: "Session cache is unavailable or contains invalid data." };
  }
}

export function writeCache(storage: Storage, key: string, cached: CachedResponse): string | null {
  try {
    storage.setItem(key, JSON.stringify(cached));
    return null;
  } catch {
    return "Result displayed, but session cache could not be updated.";
  }
}

export async function fetchOverpass(
  query: string,
  timeoutSeconds: number,
  signal: AbortSignal,
): Promise<{ ok: true; rawResponse: string } | { ok: false; failure: RequestFailure }> {
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  const timeout = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, (timeoutSeconds + 5) * 1000);

  try {
    const response = await fetch(OVERPASS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({ data: query }),
      signal: controller.signal,
    });
    if (!response.ok) return { ok: false, failure: { kind: "http", status: response.status } };
    return { ok: true, rawResponse: await response.text() };
  } catch (error) {
    if (timedOut) return { ok: false, failure: { kind: "timeout" } };
    if (signal.aborted || (error instanceof DOMException && error.name === "AbortError")) {
      return { ok: false, failure: { kind: "cancelled" } };
    }
    return { ok: false, failure: { kind: "network", message: error instanceof Error ? error.message : "Network request failed." } };
  } finally {
    window.clearTimeout(timeout);
    signal.removeEventListener("abort", abort);
  }
}

export function sourceMetadata(query: string, bbox: Bbox): SourceMetadata {
  return {
    query,
    endpoint: OVERPASS_ENDPOINT,
    completedAt: new Date().toISOString(),
    bbox: serializeBbox(bbox),
    copyrightUrl: OSM_COPYRIGHT_URL,
  };
}
``````

<!-- END EXACT FILE 12/27: src/overpass.ts -->

<!-- BEGIN EXACT FILE 13/27: src/normalize.ts -->

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

<!-- END EXACT FILE 13/27: src/normalize.ts -->

<!-- BEGIN EXACT FILE 14/27: src/map.ts -->

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

<!-- END EXACT FILE 14/27: src/map.ts -->

<!-- BEGIN EXACT FILE 15/27: src/project.ts -->

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

<!-- END EXACT FILE 15/27: src/project.ts -->

<!-- BEGIN EXACT FILE 16/27: src/carry.ts -->

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

<!-- END EXACT FILE 16/27: src/carry.ts -->

<!-- BEGIN EXACT FILE 17/27: src/HoleMap.tsx -->

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

<!-- END EXACT FILE 17/27: src/HoleMap.tsx -->

<!-- BEGIN EXACT FILE 18/27: src/App.tsx -->

### src/App.tsx

``````text
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { HoleMap } from "./HoleMap";
import { normalizeGolfCourse } from "./normalize";
import {
  buildDetailQuery,
  buildDiscoveryQuery,
  detailCacheKey,
  discoveryCacheKey,
  fetchOverpass,
  OSM_COPYRIGHT_URL,
  parseBbox,
  parseCandidateBounds,
  readCache,
  sourceMetadata,
  validateResponse,
  writeCache,
  type Bbox,
  type CachedResponse,
  type OverpassElement,
  type OverpassResponse,
  type RequestFailure,
} from "./overpass";
import {
  PROJECT_FILENAME,
  PROJECT_MAX_BYTES,
  PROJECT_MIME,
  emptyProject,
  parseProjectText,
  projectMatchErrors,
  serializeProject,
  type HoleStateV1,
  type ValidationError,
} from "./project";
import type { SourceKey } from "./normalize";

type ViewState =
  | { kind: "idle" }
  | { kind: "invalid"; message: string }
  | { kind: "loading"; mode: "discovery" | "detail" }
  | { kind: "cancelled" }
  | { kind: "empty"; mode: "discovery" | "detail"; cached: boolean; source: CachedResponse["source"] }
  | { kind: "success"; mode: "discovery" | "detail"; cached: boolean; response: OverpassResponse; source: CachedResponse["source"] }
  | { kind: "rate-limit" }
  | { kind: "timeout" }
  | { kind: "network"; message: string }
  | { kind: "http"; status: number }
  | { kind: "parse" }
  | { kind: "shape" };

const INITIAL_FIELDS = { south: "", west: "", north: "", east: "" };

function stateMessage(state: ViewState): string {
  switch (state.kind) {
    case "idle": return "Enter a bounded location and submit when ready.";
    case "invalid": return state.message;
    case "loading": return `Loading ${state.mode} results.`;
    case "cancelled": return "Request cancelled.";
    case "empty": return `No ${state.mode} results were returned${state.cached ? " from session cache" : ""}.`;
    case "success": return `${state.response.elements.length} raw ${state.mode} entities loaded${state.cached ? " from session cache" : ""}.`;
    case "rate-limit": return "Overpass rate-limited this request. Try again later.";
    case "timeout": return "The request timed out. Narrow the area or try again later.";
    case "network": return `Network request failed: ${state.message}`;
    case "http": return `Overpass returned HTTP ${state.status}.`;
    case "parse": return "Overpass returned malformed JSON.";
    case "shape": return "Overpass returned JSON with an invalid entity shape.";
  }
}

function elementName(element: OverpassElement): string {
  const name = element.tags?.name;
  return typeof name === "string" && name.trim() ? name : `Unnamed ${element.type} ${element.id}`;
}

function EntitySummary({ response }: { response: OverpassResponse }) {
  const counts = response.elements.reduce<Record<string, number>>((result, element) => {
    result[element.type] = (result[element.type] ?? 0) + 1;
    return result;
  }, {});
  return (
    <dl className="entity-summary" aria-label="Raw entity summary">
      {["node", "way", "relation"].map((type) => (
        <div key={type}><dt>{type}s</dt><dd>{counts[type] ?? 0}</dd></div>
      ))}
    </dl>
  );
}

export function App() {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [courseName, setCourseName] = useState("");
  const [state, setState] = useState<ViewState>({ kind: "idle" });
  const [warning, setWarning] = useState("");
  const [invalidField, setInvalidField] = useState<keyof Bbox | "courseName" | null>(null);
  const [selectedHoleKey, setSelectedHoleKey] = useState("");
  const [projectHoles, setProjectHoles] = useState<Partial<Record<SourceKey, HoleStateV1>>>({});
  const [projectErrors, setProjectErrors] = useState<ValidationError[]>([]);
  const [projectMessage, setProjectMessage] = useState("");
  const requestIdentity = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const fieldRefs = useRef<Record<keyof Bbox, HTMLInputElement | null>>({
    south: null, west: null, north: null, east: null,
  });
  const courseNameRef = useRef<HTMLInputElement>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const projectNotice = useRef<HTMLParagraphElement>(null);
  const projectErrorHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => () => {
    requestIdentity.current += 1;
    controller.current?.abort();
  }, []);

  const loading = state.kind === "loading";
  const normalized = useMemo(() =>
    state.kind === "success" && state.mode === "detail"
      ? normalizeGolfCourse(state.response, state.source)
      : null, [state]);

  useEffect(() => {
    setSelectedHoleKey(normalized?.holes[0]?.source.sourceKey ?? "");
    setProjectHoles({});
    setProjectErrors([]);
    setProjectMessage("");
  }, [normalized]);

  const courseSourceKey = normalized?.courseCandidates[0]?.source.sourceKey ?? null;
  const holeKeys = normalized?.holes.map(({ source }) => source.sourceKey) ?? [];

  function holeProject(key: SourceKey): HoleStateV1 {
    return projectHoles[key] ?? { targets: [], carries: [] };
  }

  function setHoleProject(key: SourceKey, project: HoleStateV1) {
    setProjectHoles((current) => ({ ...current, [key]: project }));
    setProjectMessage("");
  }

  function exportProject() {
    if (!courseSourceKey) return;
    const project = emptyProject(courseSourceKey);
    project.holes = projectHoles;
    const blob = new Blob([serializeProject(project)], { type: PROJECT_MIME });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = PROJECT_FILENAME;
    document.body.appendChild(anchor);
    anchor.click();
    requestAnimationFrame(() => {
      URL.revokeObjectURL(url);
      anchor.remove();
    });
    setProjectMessage("Project export started.");
  }

  async function importProject(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !courseSourceKey) return;
    const hasState = Object.values(projectHoles).some((hole) => hole && (hole.targets.length > 0 || hole.carries.length > 0));
    if (hasState && !window.confirm("Importing will replace your current project. Continue?")) {
      event.target.value = "";
      importInput.current?.focus();
      return;
    }
    setProjectErrors([]);
    setProjectMessage("");
    if (file.size > PROJECT_MAX_BYTES) {
      setProjectErrors([{ code: "OUT_OF_RANGE", path: "$", message: "File exceeds 512 KiB limit." }]);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      setProjectErrors([{ code: "INVALID_JSON", path: "$", message: "File could not be read." }]);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    const validated = parseProjectText(text);
    if (!validated.ok) {
      setProjectErrors(validated.errors);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    const mismatches = projectMatchErrors(validated.project, courseSourceKey, holeKeys);
    if (mismatches.length > 0) {
      setProjectErrors(mismatches);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    setProjectHoles(validated.project.holes);
    setProjectMessage("Project imported successfully.");
    event.target.value = "";
    requestAnimationFrame(() => projectNotice.current?.focus());
  }

  function setField(field: keyof Bbox, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
  }

  function classifyFailure(failure: RequestFailure) {
    if (failure.kind === "cancelled") setState({ kind: "cancelled" });
    else if (failure.kind === "timeout" || (failure.kind === "http" && failure.status === 504)) setState({ kind: "timeout" });
    else if (failure.kind === "http" && failure.status === 429) setState({ kind: "rate-limit" });
    else if (failure.kind === "http") setState({ kind: "http", status: failure.status });
    else setState({ kind: "network", message: failure.message });
  }

  async function runRequest(mode: "discovery" | "detail", bbox: Bbox, query: string, cacheKey: string, timeout: number) {
    setWarning("");
    let cache;
    try {
      cache = readCache(window.sessionStorage, cacheKey);
    } catch {
      cache = { kind: "warning" as const, message: "Session cache is unavailable." };
    }
    if (cache.kind === "hit") {
      setState(cache.response.elements.length
        ? { kind: "success", mode, cached: true, response: cache.response, source: cache.cached.source }
        : { kind: "empty", mode, cached: true, source: cache.cached.source });
      return;
    }
    if (cache.kind === "warning") setWarning(cache.message);

    const id = ++requestIdentity.current;
    const activeController = new AbortController();
    controller.current = activeController;
    setState({ kind: "loading", mode });
    const result = await fetchOverpass(query, timeout, activeController.signal);
    if (requestIdentity.current !== id) return;
    controller.current = null;

    if (!result.ok) {
      classifyFailure(result.failure);
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(result.rawResponse);
    } catch {
      setState({ kind: "parse" });
      return;
    }
    const response = validateResponse(parsed);
    if (!response) {
      setState({ kind: "shape" });
      return;
    }
    const source = sourceMetadata(query, bbox);
    let cacheWarning: string | null;
    try {
      cacheWarning = writeCache(window.sessionStorage, cacheKey, { rawResponse: result.rawResponse, source });
    } catch {
      cacheWarning = "Result displayed, but session cache is unavailable.";
    }
    if (cacheWarning) setWarning(cacheWarning);
    setState(response.elements.length
      ? { kind: "success", mode, cached: false, response, source }
      : { kind: "empty", mode, cached: false, source });
  }

  function submitDiscovery(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setInvalidField(null);
    const parsed = parseBbox(fields);
    if (!parsed.ok) {
      setState({ kind: "invalid", message: parsed.message });
      setInvalidField(parsed.field);
      requestAnimationFrame(() => fieldRefs.current[parsed.field]?.focus());
      return;
    }
    let query;
    try {
      query = buildDiscoveryQuery(parsed.bbox, courseName);
    } catch (error) {
      setState({ kind: "invalid", message: error instanceof Error ? error.message : "Invalid course name." });
      setInvalidField("courseName");
      requestAnimationFrame(() => courseNameRef.current?.focus());
      return;
    }
    void runRequest("discovery", parsed.bbox, query, discoveryCacheKey(parsed.bbox, courseName), 25);
  }

  function loadDetail(element: OverpassElement) {
    const bbox = parseCandidateBounds(element.bounds);
    if (!bbox || loading) return;
    void runRequest("detail", bbox, buildDetailQuery(bbox), detailCacheKey(bbox), 45);
  }

  function cancel() {
    requestIdentity.current += 1;
    controller.current?.abort();
    controller.current = null;
    setState({ kind: "cancelled" });
    requestAnimationFrame(() => submitButton.current?.focus());
  }

  const showsOsmResult = state.kind === "success" || state.kind === "empty";
  const errorState = ["invalid", "rate-limit", "timeout", "network", "http", "parse", "shape"].includes(state.kind);

  return (
    <main className="shell">
      <header>
        <p className="eyebrow">Open-source yardage book builder</p>
        <h1>Chart the Course</h1>
        <p className="lede">Search raw OpenStreetMap golf-course entities inside a small manually entered bounding box.</p>
      </header>

      <section className="search-panel" aria-labelledby="search-title">
        <h2 id="search-title">Course discovery</h2>
        <form onSubmit={submitDiscovery}>
          <label>Course name <span>(optional)</span>
            <input ref={courseNameRef} name="courseName" value={courseName} onChange={(event) => setCourseName(event.target.value)}
              aria-invalid={invalidField === "courseName"} />
          </label>
          <fieldset>
            <legend>Manual location bounds in decimal degrees</legend>
            <div className="coordinate-grid">
              {(Object.keys(fields) as (keyof Bbox)[]).map((field) => (
                <label key={field}>{field[0].toUpperCase() + field.slice(1)}
                  <input ref={(node) => { fieldRefs.current[field] = node; }} name={field} inputMode="decimal"
                    value={fields[field]} onChange={(event) => setField(field, event.target.value)}
                    aria-invalid={invalidField === field} placeholder={field === "south" ? "37.30" : field === "west" ? "-122.10" : field === "north" ? "37.50" : "-121.90"} />
                </label>
              ))}
            </div>
            <p className="hint">South, west, north, east. Each span must be 0.35 degrees or less.</p>
          </fieldset>
          <div className="actions">
            <button ref={submitButton} type="submit" disabled={loading}>Search courses</button>
            <button className="secondary" type="button" onClick={cancel} disabled={!loading}>Cancel request</button>
          </div>
        </form>
      </section>

      <section className={`status ${errorState ? "error" : ""}`} aria-live={errorState ? "assertive" : "polite"} aria-atomic="true">
        <strong>Status</strong>
        <p>{stateMessage(state)}</p>
        {warning && <p className="warning">{warning}</p>}
      </section>

      {state.kind === "success" && (
        <section className="results" aria-labelledby="results-title">
          <div>
            <p className="eyebrow">{state.mode} response</p>
            <h2 id="results-title">Raw OSM entities</h2>
          </div>
          <EntitySummary response={state.response} />
          {state.mode === "discovery" && (
            <ul className="candidate-list">
              {state.response.elements.map((element) => {
                const bounds = parseCandidateBounds(element.bounds);
                return (
                  <li key={`${element.type}-${element.id}`}>
                    <div><strong>{elementName(element)}</strong><span>{element.type} {element.id}</span></div>
                    <button type="button" disabled={!bounds || loading} onClick={() => loadDetail(element)}>
                      {bounds ? "Load raw detail" : "Detail unavailable"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {state.mode === "detail" && (
            <>
              <ul className="raw-list">
                {state.response.elements.map((element) => <li key={`${element.type}-${element.id}`}><code>{element.type}/{element.id}</code> {elementName(element)}</li>)}
              </ul>
              {normalized && normalized.holes.length > 0 ? (
                <section className="map-workspace" aria-labelledby="map-workspace-title">
                  <div className="map-selection">
                    <h3 id="map-workspace-title">Selected-hole map</h3>
                    <label>Hole
                      <select value={selectedHoleKey} onChange={(event) => setSelectedHoleKey(event.target.value)}>
                        {normalized.holes.map((hole) => (
                          <option key={hole.source.sourceKey} value={hole.source.sourceKey}>
                            {hole.number === null ? hole.source.sourceKey : `Hole ${hole.number}`}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  {normalized.holes.filter((hole) => hole.source.sourceKey === selectedHoleKey).map((hole) => (
                    <HoleMap key={hole.source.sourceKey} hole={hole} warnings={normalized.warnings} source={normalized.source}
                      project={holeProject(hole.source.sourceKey)}
                      onProjectChange={(project) => setHoleProject(hole.source.sourceKey, project)} />
                  ))}
                  <section className="project-io" aria-labelledby="project-io-title">
                    <h3 id="project-io-title">Local project file</h3>
                    <p className="hint">Project files contain user-authored targets and carry settings only. Import replaces current project state when valid.</p>
                    <div className="actions">
                      <button type="button" onClick={exportProject} disabled={!courseSourceKey}>Export project</button>
                      <label className="file-label">Import project file (.json)
                        <input ref={importInput} type="file" accept=".json,application/json" onChange={(event) => void importProject(event)} />
                      </label>
                    </div>
                    {projectMessage && <p ref={projectNotice} tabIndex={-1} aria-live="polite">{projectMessage}</p>}
                    {projectErrors.length > 0 && <div className="project-errors" role="alert">
                      <h4 ref={projectErrorHeading} tabIndex={-1}>Import failed - {projectErrors.length} error(s)</h4>
                      <ul>{projectErrors.map((error, index) => <li key={`${error.code}-${error.path}-${index}`}>
                        <strong>{error.code}</strong>: {error.message} <code>{error.path}</code>
                      </li>)}</ul>
                    </div>}
                  </section>
                </section>
              ) : <p className="map-empty" role="status">No normalized holes are available to render.</p>}
            </>
          )}
          <details>
            <summary>Source diagnostics</summary>
            <dl className="diagnostics">
              <div><dt>Endpoint</dt><dd>{state.source.endpoint}</dd></div>
              <div><dt>Bbox</dt><dd>{state.source.bbox}</dd></div>
              <div><dt>Completed</dt><dd>{state.source.completedAt}</dd></div>
              <div><dt>Query</dt><dd><pre>{state.source.query}</pre></dd></div>
            </dl>
          </details>
        </section>
      )}

      {showsOsmResult && (
        <p className="attribution">Data © OpenStreetMap contributors, available under ODbL. <a href={OSM_COPYRIGHT_URL}>OpenStreetMap copyright and license</a>. Session cache does not satisfy later source-export obligations.</p>
      )}
    </main>
  );
}
``````

<!-- END EXACT FILE 18/27: src/App.tsx -->

<!-- BEGIN EXACT FILE 19/27: src/styles.css -->

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

<!-- END EXACT FILE 19/27: src/styles.css -->

<!-- BEGIN EXACT FILE 20/27: src/map.test.ts -->

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

<!-- END EXACT FILE 20/27: src/map.test.ts -->

<!-- BEGIN EXACT FILE 21/27: src/project.test.ts -->

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

<!-- END EXACT FILE 21/27: src/project.test.ts -->

<!-- BEGIN EXACT FILE 22/27: src/carry.test.ts -->

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

<!-- END EXACT FILE 22/27: src/carry.test.ts -->

<!-- BEGIN EXACT FILE 23/27: test/e2e/app.spec.ts -->

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

<!-- END EXACT FILE 23/27: test/e2e/app.spec.ts -->

<!-- BEGIN EXACT FILE 24/27: fixtures/overpass/synthetic-golf-course-ctc006.json -->

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

<!-- END EXACT FILE 24/27: fixtures/overpass/synthetic-golf-course-ctc006.json -->

<!-- BEGIN EXACT FILE 25/27: docs/handoffs/ctc-006-gemini-specification-review.md -->

### docs/handoffs/ctc-006-gemini-specification-review.md

``````text
# CTC-006 Gemini specification critical review

Date: 2026-06-11

## Review verdict

Gemini's corrected response is relevant and useful, but it is not
implementation-ready as written. It correctly selected dependency-free native
React SVG, preserved geographic coordinates for measurement, proposed
latitude-aware projection, chose geodesic two-point distance, and covered
pointer, touch, keyboard, responsive, attribution, and synthetic-test concerns.

The response also contradicts the existing CTC-005 contract, invents types and
fixture shapes, renders unassociated features as selected-hole fallbacks,
proposes an incorrect antipodal failure rule, and leaves projection, scale-bar,
interaction, and accessibility behavior insufficiently precise. The accepted
and corrected decisions below are the specification baseline for Claude
adversarial QA planning. CTC-006 is not approved for implementation until
Claude challenges this baseline and required corrections are recorded.

## Accepted decisions

- Use native React SVG with zero new production dependencies.
- Keep projection and distance math in pure dependency-free TypeScript helpers
  separate from React interaction state.
- Preserve every CTC-005 `{ lat, lon }` coordinate unchanged; projected SVG
  coordinates are derived values only.
- Use a latitude-aware local projection for visual geometry and geodesic
  distance for measurement.
- Render deterministic SVG layer groups and keep the measurement overlay last.
- Keep OSM attribution visible whenever OSM-derived geometry is visible.
- Provide explicit pointer/touch and keyboard two-point measurement behavior,
  a clear action, responsive layout, and live announcements.
- Use only synthetic fixtures and retain Playwright network isolation and axe
  checks.
- Clear measurement when the selected hole changes. Preserve geographic
  measurement points when only the viewport size changes.
- Return deterministic diagnostics from pure math helpers or visible UI state;
  do not add logging side effects.

## Rejected or corrected Gemini decisions

- Reject the invented `NormalizedGolfCourse`, `sourceEvidence`,
  `holeNumber`, `routeGeometry`, feature `type`, and feature `nodes` contracts.
  The authoritative input is the existing `NormalizationResult`,
  `NormalizedHole`, `NormalizedFeature`, and `Geometry` types in
  `src/normalize.ts`.
- Reject passing a course plus selected array index into the map as the core
  contract. Selection identity must use the stable hole
  `source.sourceKey`; an index may change when normalized results change.
- Reject rendering any `unassociatedFeatures` in a selected-hole view. CTC-005
  deliberately preserves those features because association is unknown.
  Rendering them as selected-hole context implies unsupported association.
- Reject using unassociated features or invented fallback geometry when a hole
  route is null. A selected hole may render its own associated non-null feature
  geometry without a route; if it has no renderable route or associated
  geometry, show an empty state.
- Reject claims about a hole "relying on an unsupported relation." Warnings are
  result-level structured records and may not prove that relationship. Display
  the exact relevant normalization warnings without inventing causality.
- Reject throwing merely because latitude and longitude could plausibly be
  swapped. Both may be valid in their ranges. Named fields and runtime range
  validation prevent order mistakes; invalid coordinates produce a
  deterministic non-renderable result instead of crashing the app.
- Reject degree-based `±0.001` geometry padding. Projection may create a
  deterministic minimum display extent for point-only or one-axis geometry,
  but it must not mutate or imply source geometry.
- Reject fixed browser-pixel projection as the canonical model. Use a fixed
  logical SVG viewBox and `preserveAspectRatio`; CSS handles responsive display.
  Pointer coordinates must convert through SVG's current screen transform.
- Reject a Haversine rule that returns `null` for antipodal points. Clamp the
  computed `a` value to `[0, 1]`; valid antipodal coordinates have a valid
  distance. Invalid/non-finite coordinates return a typed failure.
- Reject a fixed 100-pixel scale bar derived from DOM pixels. Scale indication
  must be deterministic in logical SVG units and select a labeled "nice"
  ground distance that fits a bounded portion of the logical viewport.
- Reject `onTouchStart` as a separate primary interaction path. Use Pointer
  Events for mouse, pen, and touch, with keyboard behavior implemented
  separately. Avoid duplicate touch/click selection.
- Reject invisible production JSON diagnostics and test-only UI contracts as
  observability. Test exported pure helpers directly and expose user-relevant
  warnings, measurement state, and attribution visibly.
- Reject exact unreviewed colors and color-only distinctions. Styling must use
  existing CSS conventions, sufficient contrast, and non-color distinctions
  such as strokes/dashes where needed.
- Reject exact 10-pixel keyboard movement until the logical viewport and
  keyboard step contract are defined. Keyboard movement must be deterministic,
  bounded, visible, and usable at mobile and desktop display sizes.
- Reject the fabricated fixture and the claim that the proposed 0.0009-degree
  latitude delta must equal exactly 100.1 meters. Test expected distances
  against independently calculated bounded values with explicit tolerance.

## Corrected specification baseline

### Module and input boundary

Add a small pure geometry/rendering module, likely `src/map.ts`, with types and
functions for:

- collecting renderable coordinates from one `NormalizedHole`;
- producing a deterministic local projection and inverse projection;
- projecting point, line, and polygon geometry into logical SVG coordinates;
- calculating geodesic meters and formatting meters/yards;
- calculating a deterministic scale-bar model.

The React map component consumes:

```typescript
type HoleMapProps = {
  hole: NormalizedHole;
  warnings: NormalizationWarning[];
  source: SourceMetadata;
};
```

Exact component/file names remain reviewable by Claude. The selected hole is
identified outside the component by `hole.source.sourceKey`. The app calls
`normalizeGolfCourse(response, source)` only for successful detail responses,
retains the `NormalizationResult`, and offers deterministic hole selection.

### Selected-hole rendering eligibility

- A hole is selectable even when its number is null; label it using its number
  when present and stable source key otherwise.
- Render only the selected hole's non-null `route` and its own associated
  features with non-null geometry.
- Never render `NormalizationResult.unassociatedFeatures` in the selected-hole
  map.
- Include all supported `Geometry` variants: point, line, and polygon.
- If the selected hole has no route and no associated non-null feature
  geometry, render a visible non-renderable empty state and no SVG map.
- Display result-level normalization warnings without changing or inferring
  their meaning. Provide a useful selected-hole subset by matching
  `sourceKey`, `holeNumber`, or refs only where the warning itself supplies
  that evidence; keep the complete warning list available.

### Projection

- Use a fixed logical SVG viewBox, with exact dimensions and padding resolved
  by Claude. Responsive CSS scales the SVG while preserving aspect ratio.
- Collect the selected hole's renderable coordinates without mutation.
- Validate finite/in-range named `{ lat, lon }` coordinates defensively.
- Use a local equirectangular projection centered at the coordinate-bounds
  midpoint. Longitude delta is multiplied by cosine of center latitude; north
  remains visually up.
- Fit the projected bounds uniformly into the padded logical viewport and
  center unused space.
- Define a deterministic minimum projected extent for point-only or one-axis
  geometry. This is display-only and must not add or alter geographic
  coordinates.
- Return a typed failure for no valid coordinates, invalid viewport/padding,
  non-finite math, or a near-zero longitude cosine that cannot produce a
  reliable inverse.
- Projection and inverse projection must round-trip within an explicit
  tolerance and remain deterministic under repeated calls.
- Resizing the CSS display does not recompute geographic projection or clear
  measurement because the logical viewBox is stable.

### Layers

Render groups in this back-to-front order:

1. vegetation
2. generic-water
3. golf-water
4. rough
5. fairway
6. bunker
7. green
8. tee
9. route
10. measurement overlay

Within a feature-kind group, preserve the existing deterministic
`hole.features` source-key order. Geometry-specific SVG primitives must be
deterministic. Styling must distinguish feature classes sufficiently without
depending on color alone.

### Measurement

- Store selected measurement anchors as original geographic `Coordinate`
  values obtained by inverse-projecting logical SVG positions.
- Pointer and keyboard input must be clamped or rejected consistently at the
  logical viewport boundary; Claude must resolve the exact rule.
- Use Haversine distance with a single documented Earth-radius constant and
  exact international conversion `1 yard = 0.9144 meters`.
- Clamp Haversine `a` to `[0, 1]`. Identical valid points return zero. Invalid
  coordinates return a typed failure; antipodal coordinates remain valid.
- Display both yards and meters to satisfy the acceptance criterion. A unit
  toggle is unnecessary unless Claude finds the phrase requires switchable
  primary units; conservative default is one result showing both rounded
  whole-unit values.
- The scale bar uses the same projection/measurement contract. Choose a
  deterministic nice distance from a documented sequence and a bar length that
  fits a bounded fraction of the logical viewport. Label the represented
  ground distance, not raw pixels.

### Interaction and accessibility

- Use Pointer Events for mouse, pen, and touch. First activation sets anchor
  one, second sets anchor two, and a third starts a new measurement. A visible
  clear button resets both.
- Do not require hover/live tracking for acceptance; it may be omitted to keep
  the interaction deterministic and touch-equivalent.
- The SVG or its containing interaction surface is keyboard focusable. A
  visible bounded logical crosshair starts at the viewport center; arrow keys
  move it by a documented logical-unit step, Enter/Space select, and Escape
  clears.
- Prevent page scrolling only for handled map keys while the interaction
  surface has focus.
- Measurement points and line must remain visually distinguishable independent
  of color and have adequate touch visibility.
- Provide an accessible map name/description, visible instructions, visible
  result text showing both units, polite live announcements for completed
  actions, and clear focus styling.
- Keep visible attribution adjacent to every rendered map. The full copyright
  URL remains linked.
- Clear measurement on selected-hole identity change; retain it across CSS
  resize because anchors are geographic.

### Tests and fixture

- Prefer pure Vitest tests in `src/map.test.ts` for coordinate collection,
  projection/inverse round trips, north-up orientation, aspect fit, minimum
  extent, invalid input, all geometry variants, layer ordering, Haversine known
  values/tolerance, yards conversion, antipodal/identical cases, and nice scale
  selection.
- Extend or add an explicitly synthetic normalized/detail fixture that matches
  the actual CTC-005 types. Ensure at least one selectable hole has route, tee,
  fairway, green, bunker, golf-water, rough, generic-water, and vegetation
  associated by explicit strict ref if every layer must be tested. Do not
  spatially infer association.
- Add focused component tests only if the existing Vitest Node environment can
  support them without a new dependency; otherwise cover component behavior in
  Playwright.
- Extend the existing Playwright network-isolated flow to load synthetic detail,
  select a hole, verify deterministic layers/attribution/warnings, measure using
  pointer and keyboard, clear/restart, switch holes, and test mobile overflow,
  focus, live result text, and axe behavior.
- Keep existing search, raw diagnostics, cache behavior, and error-state tests
  passing. Do not introduce external requests.

## Remaining questions for Claude

1. Resolve exact logical viewBox dimensions, padding, and deterministic minimum
   projected extent without fabricating geographic geometry.
2. Resolve whether pointer/keyboard positions outside the inner rendered
   bounds are clamped or rejected, and whether measurement may target blank map
   space.
3. Resolve the exact keyboard logical-unit step and whether a modified larger
   step is needed.
4. Resolve the exact Earth-radius constant, display rounding, distance
   tolerance, and nice-scale sequence.
5. Resolve whether selected-hole warnings plus an expandable complete warning
   list are sufficient, and define warning matching without inferred
   causality.
6. Resolve whether associated generic-water and vegetation should be included
   in selected-hole bounds/rendering when explicit refs caused CTC-005 to
   associate them. Recommended default: yes.
7. Resolve whether the map component needs a provider-adapter placeholder now.
   Recommended default: no provider code until a provider is actually adopted.

## Claude QA-planning red lines

Treat these as blockers:

- any new production dependency, basemap/provider, network, cache, persistence,
  PDF/export, target-marker, carry-arc, or CTC-019 behavior;
- invented normalized types or fixture contracts that do not compile against
  `src/normalize.ts`;
- rendering or measuring unassociated features as selected-hole context;
- mutation, healing, simplification, or spatial inference over CTC-005
  geometry;
- measurement performed from SVG/pixel coordinates without inverse projection
  to geographic coordinates;
- swapped coordinate order, invalid/non-finite math, nondeterministic
  projection, or incorrect antipodal handling;
- hidden attribution, suppressed warnings, color-only semantics, inaccessible
  pointer-only interaction, or mobile overflow;
- hidden production test diagnostics or logging side effects;
- external network access or real-course fixtures in tests.

## Final Gemini revision disposition

Gemini received one final revision opportunity with 18 explicit mandatory
corrections and seven decisions to resolve. The final response was rejected in
full because it:

- abandoned native React SVG for layered Canvas/SVG/DOM rendering;
- reintroduced pan, zoom, pin dragging, snapping, multi-touch gestures,
  localStorage preferences, and out-of-bounds styling outside CTC-006;
- invented `RawGPSCoordinate`, normalized `[0,1]` types, and other contracts
  instead of using `src/normalize.ts`;
- prescribed console logging, Jest, Cypress, browser-pixel/DPR math, and
  unsupported sub-millisecond/sub-millimeter/60-FPS claims;
- failed to resolve the required fixed logical viewBox, deterministic minimum
  extent, warning matching, actual CTC-005 fixture contract, and bounded
  keyboard behavior.

No decisions from the final Gemini revision supersede this corrected baseline.
Proceed to Claude adversarial QA planning using this document as authority.

## Claude QA-planning disposition

Claude returned `READY WITH REQUIRED SPEC CORRECTIONS`. B-1 through B-7 are
accepted and recorded below, with two necessary consistency corrections:

- Replace Claude's circular minimum-extent algorithm with a fixed display-only
  `MIN_EXTENT_M = 20`. The proposed rule derives minimum meters from a scale
  that is undefined when both spans are zero and can produce different results
  depending on evaluation order.
- Replace the finite scale sequence plus overflowing 10-meter fallback with a
  generated 1/2/5 sequence across powers of ten. The proposed fallback violates
  its own rule that the bar fit within 40% of the inner viewport.

These corrections preserve Claude's intent while making the rules deterministic
for point-only and very small/large geometry.

### Final implementation constants

- Logical SVG viewBox: `800 × 600`.
- Uniform logical padding: `40`; inner bounds are
  `x ∈ [40, 760]`, `y ∈ [40, 560]`.
- Display-only minimum projected extent: `MIN_EXTENT_M = 20` on each axis,
  symmetrically centered without adding or moving geographic coordinates.
- Pointer and keyboard positions clamp to the inner bounds. Blank space inside
  the inner bounds is measurable; padding outside it is not.
- Keyboard step: `4` logical units; `Shift+Arrow` step: `20`.
- `EARTH_RADIUS_M = 6_371_000`.
- Exact yards conversion: `YARDS_PER_METER = 1 / 0.9144`.
- Display both units using `Math.round`: `"NNN yd / NNN m"`.
- Distance test tolerance: `max(0.5 meters, expectedMeters × 0.005)`.
- Scale bar selects the largest positive value from
  `{1, 2, 5} × 10^n meters` whose logical length is at most `288` units
  (40% of inner width). Generate candidates across the finite positive range
  needed by the current scale; this guarantees a fitting value without an
  overflowing fallback.
- Selected-hole warning subset uses only exact structured evidence:
  matching hole source key, matching defined non-null hole number, refs
  containing the hole source key, or refs containing an associated feature
  source key. The complete unfiltered warning list remains available.
- Explicitly associated generic-water and vegetation in `hole.features` are
  included in bounds and rendering. `unassociatedFeatures` are never rendered.
- Add a CTC-006-specific synthetic fixture with route plus all eight associated
  feature kinds. Do not change the existing CTC-005 fixture assertions.

### Final interaction rules

- First activation sets anchor one, second sets anchor two, and third starts a
  new measurement with anchor two cleared.
- Clear button and Escape clear anchors and reset the keyboard crosshair to
  `{ x: 400, y: 300 }`.
- Pointer coordinates convert through the SVG screen transform and clamp to the
  inner bounds before inverse projection.
- Keyboard crosshair starts centered, clamps identically, and handled keys
  prevent default only while the map interaction surface has focus.
- Measurement clears on selected-hole identity change and remains unchanged
  across CSS-only resize.

Claude authorized development after recording B-1 through B-7. The standard
post-implementation final Claude audit remains mandatory.
``````

<!-- END EXACT FILE 25/27: docs/handoffs/ctc-006-gemini-specification-review.md -->

<!-- BEGIN EXACT FILE 26/27: docs/handoffs/ctc-007-gemini-specification-review.md -->

### docs/handoffs/ctc-007-gemini-specification-review.md

``````text
# CTC-007 Gemini specification critical review

Date: 2026-06-11

## Review verdict

Gemini's response is relevant but not implementation-ready. It correctly keeps
the feature browser-local, proposes explicit interaction modes, recognizes the
need for strict import validation and visible accessibility feedback, and keeps
automated tests network-isolated.

However, it contradicts the embedded CTC-005/006 contracts, invents unsafe and
malformed data structures, exports and later trusts raw OSM data, and adds
multiple deferred features. CTC-007 remains in `1. Spec Drafting (Gemini)`.
No part of the response authorizes implementation or Claude QA planning.

## Accepted decisions

- Keep project editing and explicit JSON file exchange browser-local with no
  network upload, account, server, or cloud-sync behavior.
- Use explicit interaction modes so target placement/editing does not silently
  activate CTC-006 measurement.
- Preserve the current project when an import fails.
- Validate file size before parsing and return visible, useful import errors.
- Use browser `Blob`, object URL, download anchor, and object URL revocation
  for explicit export, subject to deterministic lifecycle tests.
- Provide keyboard-operable controls, minimum 44 CSS-pixel control targets,
  visible focus, live announcements, non-color distinctions, mobile coverage,
  axe checks, and network-isolated Playwright tests.
- Keep pure state/schema/geometry logic separate from React UI state.

## Rejected or corrected decisions

- Reject Canvas, offscreen Canvas, pixel-owned rendering, and a new canvas draw
  controller. Extend the existing native React SVG, fixed logical viewBox,
  projection, inverse projection, and Pointer Events contract.
- Reject replacing the existing Haversine `distanceMeters`,
  `EARTH_RADIUS_M = 6_371_000`, and exact yard conversion with a new
  equirectangular distance engine, a different Earth radius, or unsupported
  accuracy claims. Carry geometry may reuse local projection for display, but
  persisted coordinates and distance truth remain geographic.
- Reject offline-course-download claims. CTC-007 adds no durable OSM cache or
  offline course loading; those concerns remain with CTC-019.
- Reject "AGPL protection compliance." The actual rule is that original Chart
  the Course code remains Apache-2.0 and prohibited AGPL/unlicensed reference
  code must not be copied or adapted.
- Reject drag-and-drop marker movement, live 60-FPS recalculation, map pan,
  zoom, rotation, and sliders as silently selected behavior. These are not
  required by the acceptance criteria and conflict with the current bounded
  SVG interaction surface. Conservative editing uses explicit form fields and
  a reviewed placement/reposition mode.
- Reject notes, marker colors, arc colors, pixel stroke widths, view settings,
  canvas rotation, zoom scale, display-unit preferences, and target-to-tee
  derived values in persisted project data. Notes belong to later work; visual
  styling and derived distances are not user-authored portable state.
- Reject limiting carry arcs to three, default example distances, target-only
  origins, and marker-owned arc arrays without resolving the required selected
  tee or target origin model.
- Reject exporting complete normalized geometry, raw Overpass responses, exact
  query bodies, or imported source metadata in the CTC-007 project file.
  CTC-007 project JSON contains user-authored state plus minimal stable source
  identity references only. Loaded normalized OSM evidence remains the trusted
  in-memory source and is never replaced by imported data.
- Reject invented `GeographicCoordinate { latitude, longitude }`. Reuse the
  authoritative `{ lat, lon }` coordinate contract.
- Reject the proposed top-level marker list because it does not key user state
  by stable `hole.source.sourceKey`. Array indexes and hole numbers are not
  persisted identity.
- Reject arbitrary RFC4122 UUID requirements without a dependency-free ID
  generation and validation decision. Marker identity must be deterministic
  enough for project operations and strictly validated, but the exact format
  remains unresolved.
- Reject `any`, object spreading of imported objects, truthiness defaults, and
  an open migration registry. These permit prototype pollution, preserve
  unknown fields, and invent unsupported migration behavior.
- Reject accepting every positive schema version and automatic migration.
  Conservative v1 policy is exact version match; unsupported versions fail
  with a useful error until a reviewed migration exists.
- Reject the malformed JSON Schema. It has missing `required` arrays,
  inconsistent singular/array TypeScript declarations, no
  `additionalProperties: false`, no hole ownership, and no complete strict
  validation/error contract.
- Reject "HTML sanitization" as the primary imported-string control. Imported
  strings must be strictly length/type validated and rendered as React text,
  never interpreted as HTML.
- Reject generic alerts, logging state changes, garbage-collection claims, and
  unsupported Firefox/CSP assertions. Use visible structured errors, focus
  management, and deterministic pure/helper tests.
- Reject splitting CTC-007 into new project-management tickets or formatting it
  for Notion.

## Corrected specification baseline

### Project document and trust boundary

- Define exactly one supported project document version, represented by a
  literal identifier such as `chart-the-course-project/v1`.
- The document stores user-authored project metadata and per-hole state keyed
  by exact `SourceKey` strings. It does not store normalized geometry, raw OSM
  elements, query bodies, endpoints, imported source metadata, derived
  distances, or visual styling.
- A minimal course/source identity block may contain only reviewed scalar
  references needed to detect mismatch, such as the selected course source key
  and copyright URL literal. It is a reference, not trusted replacement source
  evidence.
- Imported projects are usable only against the currently loaded normalized
  result. Unknown course/hole source keys produce a visible mismatch error or
  unresolved-state result; they never create trusted normalized holes.
- Project state is memory-only. Explicit import replaces the current
  user-authored project only after complete successful validation. Failed
  import leaves current state unchanged.

### Strict import and export

- Parse only a user-selected local `.json` file through an explicit file input.
  Drag-and-drop import is unnecessary for acceptance and deferred by default.
- Resolve and test a conservative maximum UTF-8 file size. Check `File.size`
  before reading and reject oversized content.
- Parse JSON as untrusted `unknown`. Recursively validate exact object shapes,
  own properties, primitive types, finite/ranged numbers, string lengths,
  exact schema version, exact source-key syntax, arrays, duplicate marker IDs,
  duplicate hole keys, carry origins, and coordinate bounds.
- Reject unknown properties at every schema-owned object level, dangerous keys
  such as `__proto__`, `prototype`, and `constructor`, unsupported versions,
  non-finite numbers, and all partial/ambiguous input. Do not spread or merge
  imported objects into application state.
- Return deterministic structured validation errors containing a stable code,
  JSON-style path, and user-facing message. Show an error summary, move focus
  to it, and keep current state unchanged.
- Export deterministic JSON with stable property and collection ordering,
  `application/json`, a reviewed filename, and a final newline. Revoke the
  object URL after activation using a deterministic cleanup path.

### Target model and interactions

- Targets are free user-authored geographic `{ lat, lon }` coordinates owned by
  one stable hole `SourceKey`. No snapping, feature linking, spatial
  association, inferred ownership, or imported source geometry is allowed.
- Define strict target identity, bounded label behavior, ordering, and
  coordinate validation. Do not persist derived distances or visual style.
- Extend the existing SVG with explicit mutually exclusive modes:
  `measure`, `place-target`, and `reposition-target` only if repositioning is
  accepted after review. The default remains measurement.
- Pointer input converts through the existing SVG screen transform and inverse
  projection. Persist only the resulting valid geographic coordinate.
- Keyboard target placement/repositioning reuses a visible bounded logical
  crosshair and documented steps. Escape cancels the active edit without
  mutating state.
- Target edit and delete use ordinary accessible controls outside the SVG.
  Resolve a clear destructive-action policy. Do not silently select dragging,
  pan, zoom, notes, or appearance customization.

### Carry model and rendering

- Carry settings are user-authored per-hole records with an explicit origin:
  either a stable target ID or a strictly resolved selected tee source key.
  Gemini must still resolve deterministic tee eligibility when a hole has zero,
  one, or multiple associated tee features/geometries.
- Define bounded positive carry distances and exact unit storage. Conservative
  default is store integer yards and display yards/meters without a persisted
  unit preference.
- Carry rings/arcs render in new deterministic SVG groups between route/source
  geometry and targets/measurement overlays. Styling uses reviewed
  color-independent strokes/dashes and accessible textual settings/results.
- Define geographic circle sampling from the origin with the existing Earth
  radius, then project samples through the existing projection. Resolve sample
  count, closure, antimeridian/pole behavior, viewport clipping, off-map
  semantics, projection-bound expansion policy, labels, and bounded tests.
- Never persist SVG/logical coordinates or claim a projected circle is
  geodesically exact.

### Tests and security

- Add pure tests for exact schema validation, deterministic serialization,
  source-key/hole mismatch, duplicate IDs/keys, finite/range checks, unknown
  fields, dangerous keys, unsupported versions, oversized files, and
  all-or-nothing import.
- Add pure carry tests for origin resolution, geographic samples, radius
  tolerance using existing Haversine distance, projection, ordering, and
  invalid inputs.
- Extend Playwright for explicit modes, pointer/keyboard target CRUD,
  measurement regression, carry settings/rendering, import/export round trip,
  invalid-file focus/errors, mobile layout, axe, attribution, and network
  isolation.
- Imported strings render only as text. No `innerHTML`, dynamic code,
  executable content, unsafe merge, logging side effects, or network upload.

## Mandatory unresolved decisions for Gemini revision

1. Exact v1 JSON shape, source-reference fields, target ID format, label
   bounds, collection ordering, filename, MIME, final-newline rule, maximum
   file size, and structured validation error codes/paths.
2. Whether duplicate JSON object keys must be detected before `JSON.parse`, or
   whether strict post-parse validation plus duplicate semantic IDs/keys is the
   accepted v1 boundary.
3. Exact loaded-course/hole mismatch behavior and whether unresolved imported
   hole state is rejected or retained but inactive.
4. Exact target repositioning interaction. Conservative default is explicit
   mode with pointer/keyboard placement, not unconstrained dragging.
5. Delete confirmation versus immediate delete plus undo, with accessible
   focus/live behavior.
6. Exact selected-tee eligibility and origin identity for point, polygon,
   multiple, null, or missing tee geometry.
7. Carry-distance count, bounds, step, storage unit, geographic sample
   algorithm/count, clipping, labels, off-map behavior, and whether target/arc
   coordinates expand projection bounds.
8. Exact SVG layer order and measurement/target mode coexistence.

## Red lines for later Claude QA planning

Treat these as blockers:

- Canvas replacement, new production dependencies, pan/zoom/rotation, notes,
  visual preferences, autosave, durable persistence, CTC-019 behavior, PDF, or
  external user-data flows;
- imported or exported raw/normalized OSM geometry being trusted as current
  source evidence;
- persisted array indexes, hole numbers as identity, derived distance, SVG
  coordinates, or unsafe imported objects;
- `any`, object spreading/merging of imported data, unknown-field acceptance,
  prototype-pollution exposure, partial import, or automatic unreviewed
  migration;
- replacing existing Haversine/projection constants or fabricating accuracy or
  performance claims;
- target editing that silently activates measurement, inaccessible
  pointer-only CRUD, hidden attribution, color-only semantics, or networked
  tests.

## Final Gemini revision disposition

Gemini received a mandatory revision prompt with nine explicit corrections.
The revision is rejected in full because it:

- introduced an unapproved Zod production dependency and generated types
  instead of defining dependency-free strict validation;
- retained `any`, object spreading/merging of imported objects, automatic
  migrations, unknown legacy input defaults, and unsafe partial update types;
- retained notes, colors, display-unit preferences, global settings, pan,
  dragging, automatic course switching, and error-boundary logging;
- invented course geometry/state contracts, tuple coordinates, source keys,
  file/module structure, and OSM IDs that contradict the embedded repository;
- again replaced existing projection/Haversine constants with new Earth radii,
  flat-plane distance assumptions, browser-pixel math, and unsupported
  precision/performance claims;
- persisted or trusted OSM-derived course identity and attribution fields
  without resolving the minimal source-reference trust boundary;
- proposed malformed schemas, fixtures, reducer initializers, and examples
  that would not compile or validate;
- failed to resolve exact target ID, strict v1 shape, duplicate-key policy,
  course/hole mismatch behavior, tee-origin eligibility, carry sample count,
  geographic sampling, layer order, clipping, and accessible destructive
  actions while claiming zero blockers.

No decisions from the final revision are accepted. The corrected baseline and
mandatory unresolved decisions in this document are the sole specification
authority for Claude adversarial QA planning.
``````

<!-- END EXACT FILE 26/27: docs/handoffs/ctc-007-gemini-specification-review.md -->

<!-- BEGIN EXACT FILE 27/27: docs/handoffs/ctc-007-spec-corrections.md -->

### docs/handoffs/ctc-007-spec-corrections.md

``````text
# CTC-007 Claude QA-planning corrections

Date: 2026-06-12

## Disposition

Claude returned `READY WITH REQUIRED SPEC CORRECTIONS`. BF-1 through BF-8 and
Decisions 1 through 10 are accepted except for the consistency corrections
below. These corrections preserve Claude's intent and authorize development.
The rejected Gemini revision remains rejected in full.

## Consistency corrections

1. Target IDs use `/^t-[0-9a-f]{12}$/`; carry IDs use
   `/^c-[0-9a-f]{12}$/`. Both use six bytes from `crypto.getRandomValues`
   encoded as lowercase hexadecimal. Separate prefixes avoid ambiguous ID
   namespaces.
2. V1 does not detect duplicate raw JSON object keys because `JSON.parse`
   resolves them before validation. Remove `DUPLICATE_KEY` as a claimed
   post-parse check. Duplicate semantic target and carry IDs are rejected
   across the complete project.
3. The maximum returned validation-error count is 20 including the
   too-many-errors sentinel. Collect at most 19 field errors, then append one
   sentinel error.
4. Carry sampling returns exactly 65 valid coordinates: 64 bearings plus a
   closing copy of sample zero. Any invalid generated coordinate returns a
   typed carry-generation failure; samples are never silently dropped.
5. Normalize longitude to `[-180, 180)` degrees. Split rendered carry segments
   where two consecutive normalized sample longitudes differ by more than 180
   degrees. The antimeridian test uses a valid maximum 700-yard carry near the
   antimeridian, not the out-of-range 5,000-yard example.
6. Import confirmation occurs after the file-input change event but before
   file reading. Cancel clears the input value, returns focus to the import
   control, and leaves project state unchanged.
7. The success announcement receives programmatic focus through
   `tabIndex={-1}` in addition to `aria-live="polite"`. The error-summary
   heading is likewise focusable.
8. Target placement announces target-specific text; it must not reuse
   CTC-006's measurement announcement `"First point placed"`.
9. The current course source key is the first deterministic normalized course
   candidate. Import/export controls are unavailable when no course candidate
   exists. This does not mutate or replace normalized source evidence.
10. SVG target markers use `role="button"` when they are keyboard/click
    selectable. Ordinary target-list controls remain the primary edit/delete
    interface.
11. Imported dangling target-origin carry records remain structurally valid
    and produce the specified visible error state. They are not silently
    dropped or treated as trusted geometry.
12. Deterministic serialization means fixed property/collection ordering and
    formatting. `exportedAt` intentionally changes between exports and is not
    included in byte-identical repeated-export assertions.

## Accepted implementation rules

- Use Claude's exact v1 project shape, 512 KiB maximum, strict unknown-field
  rejection, dangerous-key rejection, exact schema version, all-or-nothing
  import, course/hole matching, fixed filename/MIME/final newline, and
  requestAnimationFrame object-URL cleanup, subject to the corrections above.
- Use memory-only project state, explicit `measure`, `place-target`, and
  `reposition-target` modes, free geographic targets, explicit label editing,
  immediate delete with single-level undo, and existing pointer/keyboard
  projection behavior.
- Use deterministic tee-origin eligibility, 0–5 carry records per hole,
  1–5 unique ascending integer-yard distances from 1–700, 64-bearing
  geographic rings using existing `EARTH_RADIUS_M`, fixed hole projection,
  clipped carry rendering, visible off-map/origin errors, and the accepted SVG
  layer order.
- Use no new production dependency, no Zod, no Canvas replacement, no
  pan/zoom/rotation/dragging, no notes/preferences, no automatic migration, no
  durable persistence, no CTC-019 behavior, and no logging side effects.
- Final Claude audit remains mandatory after implementation.
``````

<!-- END EXACT FILE 27/27: docs/handoffs/ctc-007-spec-corrections.md -->
