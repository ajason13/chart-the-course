# Chart the Course Context

Last updated: 2026-06-05

## Current Status

CTC-015 is Done - 2026-06-05. Commit `0f07ac0` added the Overpass query
contract and a synthetic parser fixture so CTC-004 can implement reviewed
request behavior instead of inventing it in runtime code. Claude final audit
returned `PASS WITH MINOR FIXES`; F-1 through F-3 were applied, and F-4 was
accepted by moving synthetic IDs above 9,000,000,000. Claude stated CTC-015 may
be marked Done after these confined docs/fixture fixes without re-audit.
Verification passed: fixture JSON parse, `git diff --check`,
`git diff --check --cached`, and
`npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`.

CTC-021 is Done - 2026-06-05. Commit `cd12021` enabled GitHub private
vulnerability reporting for `ajason13/chart-the-course` via the GitHub API,
added durable `AGENTS.md` repo instructions, and updated `SECURITY.md` to
record the enabled reporting path while preserving the v1.0 launch blocker to
set and verify a monitored security contact email. Commit `b68e4c0` moved the
task to final audit context. Claude final audit returned `PASS` with no
blockers and no minor fixes. Verification passed: `git diff --check` and
`npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`.

CTC-013 is Done - 2026-06-05. Commit `1943d59` added
`docs/reference-project-reuse-policy.md` to settle reference-project reuse
boundaries before app scaffolding or data-pipeline work. Claude final audit
returned `PASS WITH MINOR FIXES`; the minor fix clarified that GitHub license
API 404 responses mean GitHub license detection found no recognizable license
file such as `LICENSE`, `COPYING`, or an equivalent root license file, not that
no license text could exist anywhere. Docs-only governance exception was used;
separate Gemini research and Claude QA planning were skipped because no runtime
code, dependency, provider integration, deployment behavior, or user data flow
changes were included. Verification passed: `git diff --check`,
`git diff --check --cached`, and
`npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`.

CTC-003 is Done - 2026-06-05. Commit `2a23607` drafted the legal/trademark
disclaimer posture before public app scaffolding or course data pipeline work.
Claude final audit returned `PASS WITH MINOR FIXES`; commit `35d83e0` applied
MF-1 through MF-3, and Claude stated no re-audit was required if fixes remained
docs-only.

CTC-018 is Done - 2026-06-05. Claude final audit returned `PASS WITH MINOR
FIXES`; MF-1 through MF-4 were applied. This repository scaffold is
governance-first and intentionally contains no runtime app shell, map provider,
tile provider, PDF library, or production dependency yet.

## Source of Truth

- Original Chart the Course code uses Apache-2.0.
- CTC-001 is Done.
- CTC-016 is Done.
- CTC-017 is Done.
- Claude re-review verdict for the governance policy was `PASS WITH MINOR
  FIXES`, and the corrected snippets are accepted as source of truth.

## Governance Guardrails

Do not copy, modify, adapt, link, combine, incorporate, or distribute code from
`ace` because it is AGPL-3.0. Because Chart the Course is a network-delivered
browser app, incorporating AGPL-covered code can trigger AGPL Section 13
source-availability obligations for the combined or modified work.

`hacker-yardage` and `openyardage-web` are study-only unless license or
permission is verified. Do not copy source code, UI structure, query text,
generated assets, or distinctive expressive implementation from unlicensed
repositories.

Browser API request identity must not rely on custom `User-Agent`. Use app
origin/referrer where available plus Overpass QL identifying comments.

PDFs that contain OSM-derived maps must include the full URL:

```text
https://www.openstreetmap.org/copyright
```

ODbL Section 4.6 source availability applies when PDFs are distributed or
shared. Raw GIS source export must ship with PDF export later.

CTC-018 selected the MVP tile strategy: use blank/vector-only rendering of
OSM-derived course geometry and user-authored yardage-book overlays, with no
third-party basemap tiles loaded by default. Deployed builds must not use the
OSM public tile CDN without explicit project approval.

OSM attribution remains required in UI and PDFs even without basemap tiles
because course geometry is OSM-derived. If basemap context becomes necessary,
the preferred fallback is self-hosted scoped PMTiles/Protomaps in
project-controlled storage. MapTiler or Stadia may be evaluated later only
after plan, attribution, billing, and PDF/print requirements are reviewed.

Detailed decision record: `docs/tile-provider-strategy.md`.

Governance workflow note: docs-only governance tasks may skip separate Gemini
research and separate Claude adversarial planning when no runtime code,
production dependency, provider integration, deployment behavior, or user data
flow changes. Codex must still check primary sources directly when current
external terms matter, record sources/check dates, and provide Claude Chat a
self-contained final audit prompt that includes changed file contents because
Claude Chat does not have filesystem or GitHub access by default. Detailed
workflow: `docs/governance-workflow.md`.

CTC-003 legal/trademark policy: public docs, app surfaces, sample fixtures, and
generated exports must state that Chart the Course is independent and
unaffiliated with commercial brands unless a relationship is expressly stated.
Avoid third-party brand names in product positioning unless nominative,
necessary, and reviewed by logged maintainer decision. Do not ship prepackaged
high-fidelity replicas of commercial golf courses, proprietary course maps,
commercial yardage-book artwork, or simulator course assets. Real-course
fixtures require logged review of data source, permissions or open-data basis,
attribution, brand/course-name risk, jurisdiction-specific concerns, and why a
real fixture is necessary. Generated artifacts with OSM-derived geometry must
include OSM attribution and the full copyright URL when links are not available.
Baseline disclaimer text and legal source monitoring are in
`docs/legal-disclaimers.md`.

CTC-013 reference-project reuse policy: GitHub license detection found no
recognizable license file for `hacker-yardage` or `openyardage-web`, so both are
inspiration-only unless a license or written permission is verified. Do not
copy, translate, adapt, fork, depend on, reuse assets/templates, reuse query
text, or reuse distinctive workflow/UI details from either project. `ace` is
AGPL-3.0 and may be used only as an architecture/prior-art reference unless
Chart the Course intentionally adopts an AGPL-compatible licensing posture in a
future logged maintainer decision. Detailed decision record:
`docs/reference-project-reuse-policy.md`.

CTC-015 Overpass query contract: course discovery and detail loading should use
bounded bbox-scoped Overpass QL with identifying comments, JSON output,
explicit timeout/maxsize settings, no default `out meta`, and local public
Overpass caching aligned to the 7-day TTL in `ATTRIBUTION.md` unless a CTC-004
exploration spike temporarily uses session storage before CTC-019 establishes
durable local persistence. The contract covers `leisure=golf_course`, core
`golf=*` course features,
water/tree/forest hazards where available, error handling for rate limits and
timeouts, and OSM/ODbL source metadata needed for later PDF source export.
Detailed design record: `docs/overpass-query-contract.md`. Initial synthetic
fixture: `fixtures/overpass/synthetic-golf-course.json`.

## Compliance Commands

Canonical npm compliance flow:

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

Local script:

```bash
npm run compliance
```

Implementation note: `license-checker-rseidelsohn` rejects `--onlyAllow` and
`--failOn` in the same invocation, so the compliance flow enforces the accepted
license policy as separate allowlist and denylist passes. The scripts also pass
`--excludePrivatePackages` because this scanner reports the unpublished private
root package as `UNLICENSED` even though `package.json` declares Apache-2.0 and
`LICENSE` is present.

## Security Disclosure

GitHub private vulnerability reporting is enabled for
`ajason13/chart-the-course`. Continue using it until a monitored security email
exists. Do not publish `security@chartthecourse.app` until verified.

## Next Work

- CTC-004 should implement the reviewed CTC-015 Overpass contract, not a new
  ad hoc query shape.
- Define provider-review cadence when the first basemap provider is adopted.
- Upgrade `@cyclonedx/cyclonedx-npm` to the 4.x series and pin
  `--spec-version 1.6` when the first production dependency lands.
- Future app scaffold tasks should add a selected web stack, runtime tests, and
  attribution checks enforcing the selected tile strategy.
