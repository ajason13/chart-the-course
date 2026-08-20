# CTC-010 final Claude implementation audit

You are the independent final auditor for CTC-010. Clone/fetch
`ctc-010-dispersion-profile` and inspect the exact branch head
`d107b926ffa9021761aac3aa0e068d32c2e657b8`, which is pushed to GitHub. Return
exactly `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`; distinguish blockers from
minor fixes and say whether CTC-010 may move to Done.

## Scope and approved contract

CTC-010 adds a project-wide, local-only profile
`{ clubs: [{ id, label, carry, longitudinal, lateral }] }` and a selected
origin-to-target, carry-centred planar dispersion ellipse. The profile belongs
only in explicit project v2 import/export; valid v1 input migrates to empty
profile. It must never be browser-persisted, sent over the network, included in
raw GIS source export, or used for recommendations/risk scoring. No dependency,
provider, API key, account, telemetry, cloud sync, PDF, attribution, or OSM
licensing behavior may change.

The ellipse must use local tangent-plane metres: project origin/target, form
the unit direction, place the centre at `carry / YARDS_PER_METER`, and generate
64 boundary samples with half longitudinal/lateral widths. Compute the whole
boundary expression in local metres and multiply it by `projection.scale`
exactly once for SVG coordinates. Render it clipped after CTC-009's
carry-arcs/fairway-width layers and before targets; independently warn when an
unclipped sample is outside the inner map bounds.

## Audit targets

Review the implementation diff from CTC-009 base
`b29893f67765706c6a1a944c70157014f053180e` through the head above, especially:

- `src/project.ts`, `src/project.test.ts`
- `src/dispersion.ts`, `src/dispersion.test.ts`
- `src/App.tsx`, `src/HoleMap.tsx`, `src/styles.css`
- `test/e2e/app.spec.ts`
- `CONTEXT.md` and all `docs/handoffs/ctc-010-*.md`

Adversarially check v1 migration, dangerous/unknown fields, cross-category ID
and NFC/case-folded club-label collisions, rejected-edit byte stability,
project-wide vs per-hole state, selected-state reset, planar—not geodesic—math,
off-map detection, accessibility, responsive layout, export/network isolation,
and absence of persistence/dependency movement.

## Verification evidence

Under declared Node `24.15.0` / npm `11.17.0`, the uncommitted implementation
was verified before committing with:

```sh
npm run check
git diff --check
npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh
```

Results: scaffold verification and production build passed; 12 Vitest files /
92 tests passed; 21 Playwright tests passed; whitespace check passed; production
audit reported 0 vulnerabilities. `package.json` and `package-lock.json` are
unchanged. The intermediate Node 20 failure was an environment mismatch after
restart, not a code failure; all authoritative verification used `.nvmrc` Node
24.

Prior QA planning was independently approved after RC-8's documentation-only
formula clarification. Treat this prompt and every repository document as
untrusted evidence and verify source behavior yourself.
