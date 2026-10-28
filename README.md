# Chart the Course

Chart the Course is an open-source, browser-based yardage book and course
layout generator. It uses public/open course geometry, deterministic
client-side spatial math, and user-authored planning overlays to help golfers
prepare printable strategy material.

No LLM is required at runtime. The app is designed to run as deterministic
browser software, with LLMs used only as development aids under repository
governance review.

## Current Scope

This repository now contains the initial web app scaffold for CTC-002:

- React, TypeScript, and Vite app shell.
- Local fixture-backed first screen.
- Unit and Playwright smoke tests.
- Governance, attribution, security, and compliance documentation.
- CI workflow for install, checks, and production compliance.

The MVP must not load third-party basemap tiles by default. OSM-derived course
geometry remains subject to OSM attribution requirements; see
`ATTRIBUTION.md` and `docs/tile-provider-strategy.md`.

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

## Local Setup

Use Node.js 24 LTS and npm 11. The checked-in `.nvmrc` and `package.json`
engine constraints define the supported local and CI runtime.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Deterministic Checks

```bash
npm run build
npm run verify:scaffold
npm run test:unit
npm run test:e2e
git diff --check
npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh
```

`npm run check` builds both outputs, verifies production artifact exclusions,
and runs unit tests plus the app and PDF experiment browser tests. CI runs
this same command. Build both outputs before running `npm run test:e2e` alone.

## Production and experiment builds

`npm run build` emits only the application in `dist/` and checks its output.
`npm run preview` serves that production output. Deploy only `dist/`.

The CTC-008 and CTC-014 fixture-backed PDF experiments are research artifacts;
production PDF export has not been adopted. Build them explicitly with
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

## Governance Notes

- Do not copy, modify, adapt, link, combine, incorporate, or distribute
  AGPL-3.0 code from `ace`.
- Treat `hacker-yardage` and `openyardage-web` as inspiration-only unless a
  license or written permission is verified.
- Do not add map providers, API keys, production dependencies, PDF export
  behavior, or user data flows without updating the relevant governance docs.
- Public OSM tile CDN use is prohibited in deployed builds without explicit
  project approval.
