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

- Vanilla TypeScript and Vite app shell.
- Local fixture-backed first screen.
- Unit and Playwright smoke tests.
- Governance, attribution, security, and compliance documentation.
- CI workflow for install, checks, and production compliance.

The MVP must not load third-party basemap tiles by default. OSM-derived course
geometry remains subject to OSM attribution requirements; see
`ATTRIBUTION.md` and `docs/tile-provider-strategy.md`.

## Local Setup

Use Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Deterministic Checks

```bash
npm run build
npm run test:unit
npm run test:e2e
git diff --check
npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh
```

`npm run check` runs the app build, unit tests, and Playwright smoke test.
Production compliance remains in `scripts/compliance.sh`.

## Governance Notes

- Do not copy, modify, adapt, link, combine, incorporate, or distribute
  AGPL-3.0 code from `ace`.
- Treat `hacker-yardage` and `openyardage-web` as inspiration-only unless a
  license or written permission is verified.
- Do not add map providers, API keys, production dependencies, PDF export
  behavior, or user data flows without updating the relevant governance docs.
- Public OSM tile CDN use is prohibited in deployed builds without explicit
  project approval.
