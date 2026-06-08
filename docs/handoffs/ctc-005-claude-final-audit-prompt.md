# CTC-005 Claude final audit handoff

## Role and stage

Act as final auditor for CTC-005, Normalize OSM golf geometry into app model. Audit commit `72f33f0` on branch `ctc-005-normalize-osm-geometry`. This bundle was generated from the audited commit using `git show 72f33f0:path`. Claude Chat has no filesystem or GitHub access.

## Required verdict

Return exactly one verdict: `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`. Separate blockers from minor fixes, identify exact affected files/behavior, and state whether CTC-005 may be marked Done after any fixes without re-audit.

## Acceptance criteria

- Parse tees, greens, fairways, bunkers, water, trees/rough when available, and hole metadata.
- Preserve original OSM IDs for attribution/debugging.
- Emit data-quality warnings for missing tees, greens, or ambiguous hole ordering.
- Unit tests cover complete and incomplete fixtures.

## Binding decisions and scope

- Pure dependency-free transformation from validated `OverpassResponse` plus `SourceMetadata`; no fetch, storage, logging, rendering, or input mutation.
- Preserve type-plus-ID source keys, original tags, raw geometry/node/member evidence, and source metadata.
- Strict consumed-tag guards, strict refs matching `/^[1-9][0-9]*$/` after trim, named `{ lat, lon }` coordinates, valid node points/way lines/exactly closed polygons only.
- No geometry healing, auto-closing, spatial inference, arbitrary thresholds, relation/multipolygon assembly, primary-course selection, or new dependency.
- Relevant relations remain source-linked with unsupported warnings. Features associate only through an unambiguous strict numeric ref; otherwise remain unassociated.
- Deterministic type-plus-ID conflict handling, classification, collection ordering, warning deduplication, and code-first warning ordering.
- Synthetic fixtures only; no real-course data or prohibited reference-project reuse.
- CTC-019 cache/request policy and CTC-006 rendering/measurement remain excluded.

## Claude QA-planning disposition

Claude QA planning returned `READY WITH REQUIRED SPEC CORRECTIONS`. B-1 through B-4 and Q1 through Q5 were recorded before implementation. Two internally inconsistent QA recommendations were corrected: conflict winners use canonical structural ordering instead of order-dependent first-seen behavior, and discarded duplicate course records do not count as multiple course candidates. Audit whether those corrections preserve the stronger shuffled-input determinism requirement.

## Verification evidence

- `npm run check`: passed scaffold policy, TypeScript/Vite build, 22 Vitest tests, and 12 route-isolated Playwright tests.
- `git diff --check`: passed.
- `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`: passed license allowlist/denylist and production audit with 0 vulnerabilities.
- No dependency was added.

## Changed-file manifest

Audited base: `918f801`
Audited commit: `72f33f0`
Changed files (9):

- `CONTEXT.md`
- `docs/handoffs/ctc-005-claude-qa-planning-prompt.md`
- `docs/handoffs/ctc-005-gemini-plan-correction.md`
- `docs/handoffs/ctc-005-gemini-specification-prompt.md`
- `docs/handoffs/ctc-005-gemini-specification-review.md`
- `fixtures/overpass/synthetic-golf-course-incomplete.json`
- `sbom.json`
- `src/normalize.test.ts`
- `src/normalize.ts`

## Audit focus

Challenge correctness, determinism, malformed-input safety, no-input-mutation, source-evidence preservation, warning completeness/order, classification precedence, geometry validation, explicit-ref-only association, duplicate/conflict behavior, fixture sufficiency, and scope containment. Treat fabricated geometry, nondeterminism, destructive source loss, missing required warnings, side effects, new dependencies, and real-course fixtures as blockers.

## Exact changed-file contents from audited commit

<!-- BEGIN AUDITED FILE 1/9: CONTEXT.md -->

```````
# Chart the Course Context

Last updated: 2026-06-06

## Current Status

CTC-005 is in Development (ChatGPT) - 2026-06-07. Codex selected CTC-005
after confirming `main` is clean and synchronized at `918f801`, CTC-015 is
Done and defines the raw Overpass/detail-query contract, and CTC-004 is Done
and merged as `50638ee` with validated raw entities and source metadata.
CTC-005 is the correct next task because pure deterministic normalization is
needed before CTC-006 rendering. CTC-019 durable cache/request policy is an
independent downstream task, not a prerequisite, and remains excluded.
Notion records the selection/dependency rationale and the status move from
Backlog to Spec Drafting. The self-contained Gemini prompt is at
`docs/handoffs/ctc-005-gemini-specification-prompt.md`. The prompt was revised
after Gemini interpreted its original role framing as a request for generic
product-management research; the active prompt now explicitly permits only
CTC-005 OSM/Overpass normalization research. A concise Deep Research
plan-confirmation correction is at
`docs/handoffs/ctc-005-gemini-plan-correction.md` because Gemini continued to
substitute an unrelated saved plan. Do not create a feature branch or implement
runtime code until the Gemini specification is critically reviewed and Claude
adversarial QA planning is completed and critically reviewed.

Gemini's CTC-005 specification response was critically reviewed on 2026-06-07.
Useful recommendations were retained for a pure deterministic normalization
boundary, preserved source evidence, unassociated features, stable warnings,
and synthetic tests. Scope-broadening or unsupported recommendations were
rejected, including Turf/MapLibre dependencies, rendering/z-index concerns,
convex hulls, geometry healing, auto-closing polygons, multipolygon assembly,
spatial containment/proximity association, arbitrary 150-meter thresholds,
area-based conflict resolution, loose hole-ref coercion, merged source holes,
real-course fixtures, and parser-owned PDF behavior. The corrected
specification baseline is recorded in
`docs/handoffs/ctc-005-gemini-specification-review.md`. CTC-005 must remain out
of implementation until Claude adversarial QA planning challenges and resolves
the remaining questions. The self-contained Claude QA-planning bundle is at
`docs/handoffs/ctc-005-claude-qa-planning-prompt.md`; its ten embedded relevant
repository files were verified byte-for-byte exact and its SHA-256 is
`50289cc86f65e835674516b514de245b9abb1d520b6c4a95cba37a2f76709b64`.
Claude QA planning returned `READY WITH REQUIRED SPEC CORRECTIONS`. B-1 through
B-4 and Q1 through Q5 were recorded before development. Codex corrected two
internally inconsistent audit recommendations: source-key conflict winners use
canonical structural ordering instead of order-dependent first-seen behavior,
and discarded duplicate course records do not count as multiple course
candidates. Implementation on branch `ctc-005-normalize-osm-geometry` adds a
pure dependency-free normalizer, strict geometry/tag/ref handling, explicit-ref
feature association, preserved source evidence, deterministic warnings, and
complete/incomplete synthetic Vitest coverage. No rendering, spatial inference,
geometry healing, relation assembly, storage/network behavior, or new
dependency was added. Verification passed: `npm run check` with scaffold
policy, build, 22 Vitest tests, and 12 Playwright tests; `git diff --check`; and
`npm_config_cache=/private/tmp/chart-the-course-npm-cache
scripts/compliance.sh` with 0 production vulnerabilities. Final Claude audit
bundle generation from the audited commit remains required before moving to
Final Audit.

CTC-004 is Done - 2026-06-07. PR #2 (`ctc-004-overpass-search-spike`) passed
required CI and merged into `main` as `50638ee`. It implements the reviewed
CTC-015 contract as a bounded manual-coordinate browser spike. Notion records
the Done verdict, fix commit, merged PR URL, and CTC-019 hardening advisories.
The implementation uses one reviewed Overpass endpoint, native
fetch/AbortController/sessionStorage, exact discovery/detail query shapes,
single-pass injection-safe course-name encoding, strict decimal bbox
validation, exact candidate bounds for explicit detail requests, minimum raw
entity-shape validation, exact raw response/source-metadata caching, stale
request protection, recoverable storage warnings, visible OSM attribution, and
no new dependency. Claude final audit returned `PASS WITH MINOR FIXES`. F-1
corrected exact 0.35-degree span handling at non-zero coordinates and added a
regression test. F-2 made error-state live announcements assertive and added a
429 accessibility assertion. Claude explicitly authorized Done after these
confined fixes without re-audit. Accepted CTC-019 hardening advisories are to
validate all cached source-metadata fields and pre-check already-aborted
signals; the deterministic trailing colon for an empty discovery-name cache key
requires no change. Verification passed after fixes: `npm run check` (scaffold
policy, build, 17 Vitest tests, and 12 route-isolated Playwright tests),
`git diff --check`, and
`npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`
with 0 production vulnerabilities.

CTC-002 is Done - 2026-06-05. PR #1
(`ctc-002-app-scaffold`) completed after a workflow correction:
Gemini Deep Research completed specification review, then Claude completed
adversarial QA planning before Codex resumed implementation. Accepted
architecture is React 19.2.7, React DOM 19.2.7, TypeScript 6.0.3, Vite 8.0.16,
Vitest 4.1.8, Playwright 1.60.0, and axe-playwright 4.11.3 on Node 24 LTS.
Direct dependencies are exact-pinned, CI actions are SHA-pinned with read-only
contents permission, and tests enforce synthetic non-geographic fixture data,
runtime network isolation, responsive smoke coverage, and an axe oracle test.
Map/geometry algorithms, Overpass behavior, basemap tiles, persistence, PDF
behavior, API keys, and user data flows remain out of scope. The tracked SBOM
and existing ODbL Section 4.6 PDF source-export policy remain authoritative.
Commit `71da9ed` applies the planning revisions. Verification passed:
`npm ci`, `npm run check` (policy verification, build, 3 unit tests, and 4
Playwright tests), `git diff --check`, `git diff --check --cached`, and
`npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`
with React/React DOM/Scheduler verified as MIT and 0 production
vulnerabilities. Claude final audit returned `PASS` with no blockers or minor
fixes and explicitly authorized immediate Done. Residual future-hardening notes
include broader Playwright browser coverage, safer local preview-server reuse,
and documenting the current Node-only Vitest environment.

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

- CTC-005 geometry normalization and CTC-019 durable cache/request policy remain
  downstream; do not absorb them into CTC-004.
- CTC-019 should validate every cached source-metadata field and pre-check
  already-aborted request signals as accepted CTC-004 audit hardening notes.
- Future test-harness hardening should evaluate Firefox/WebKit Playwright
  coverage, explicit local preview-server reuse behavior, and a documented
  transition path if DOM-focused Vitest tests are introduced.
- Define provider-review cadence when the first basemap provider is adopted.
- Upgrade `@cyclonedx/cyclonedx-npm` to the 4.x series and pin
  `--spec-version 1.6` when the first production dependency lands.
- Future app scaffold tasks should add a selected web stack, runtime tests, and
  attribution checks enforcing the selected tile strategy.
```````

<!-- END AUDITED FILE 1/9: CONTEXT.md -->

<!-- BEGIN AUDITED FILE 2/9: docs/handoffs/ctc-005-claude-qa-planning-prompt.md -->

```````
# CTC-005 Claude adversarial QA-planning handoff

## Role and gate

Act as the adversarial QA planner for CTC-005, Normalize OSM golf geometry into app model. Critically challenge the corrected Gemini specification baseline before implementation. Claude Chat has no filesystem or GitHub access; this bundle is self-contained.

CTC-005 is not yet approved for implementation. Return an implementation-readiness verdict and required specification corrections. Do not write implementation code, create new epics, or broaden scope.

## Task acceptance criteria

- Parse tees, greens, fairways, bunkers, water, trees/rough when available, and hole metadata.
- Preserve original OSM IDs for attribution/debugging.
- Emit data-quality warnings for missing tees, greens, or ambiguous hole ordering.
- Unit tests cover complete and incomplete fixtures.

## Binding boundaries

CTC-005 owns only pure deterministic normalization from already validated raw Overpass entities into an app model. It must preserve original entity type/ID/tags/source metadata/raw geometry evidence and define deterministic incomplete/ambiguous handling.

No rendering, measurement, basemap, PDF behavior, geocoding, durable cache, refresh controls, retries/backoff, failover, providers, network changes, user data flows, new dependencies, computational spatial inference, geometry healing, relation/multipolygon assembly, or prohibited reference-project reuse.

CTC-019 owns durable cache/request policy. CTC-006 owns rendering and measurement. No feature branch or runtime implementation begins until this QA plan is critically reviewed.

## Gemini response disposition

Gemini produced relevant observations but also proposed prohibited or unsupported behavior including Turf.js/MapLibre, convex hulls, auto-closing polygons, multipolygon degradation, spatial containment/proximity association, a 150-meter threshold, area-based selection, loose ref coercion, merged source holes, rendering z-indexes, real-course fixtures, and PDF concerns. The exact authoritative disposition and corrected baseline is the first embedded file below.

## Required review questions

1. Is the corrected model boundary implementable and sufficiently precise without a dependency?
2. Which node/way/relation geometry forms must be accepted, rejected, or warned about without fabricating source geometry?
3. Are strict ref/par/tag/coordinate rules correct and complete?
4. Are course selection, hole ordering, feature association, duplicate/conflict handling, and warning ordering deterministic under arbitrary input order?
5. Does the fixture/test baseline cover all acceptance criteria and adversarial failure modes?
6. Resolve the five remaining questions in the corrected Gemini review.
7. Identify any proposal that still leaks CTC-006, CTC-019, rendering, storage, network, PDF, or provider scope.
8. Identify security, performance, attribution/debugging, and no-input-mutation red lines for implementation.

## Required verdict format

Return these sections:

1. **Verdict:** exactly one of `READY`, `READY WITH REQUIRED SPEC CORRECTIONS`, or `NOT READY`.
2. **Blocking findings:** numbered, with concrete failure scenario and required correction.
3. **Accepted baseline decisions.**
4. **Required corrected decisions:** exact deterministic rule text suitable for implementation.
5. **Adversarial test matrix:** input condition, expected normalized behavior, expected warning code/order, and source-evidence assertion.
6. **Rejected/deferred recommendations.**
7. **Implementation gate:** explicitly state whether CTC-005 may move to `3. In Development (ChatGPT)` after the listed corrections are recorded.

Treat fabricated/healed geometry, spatial heuristics, nondeterminism, destructive source loss, loose coercion, missing required warnings, side effects, new dependencies, and real-course fixtures as blockers.

## Exact relevant repository file contents

### docs/handoffs/ctc-005-gemini-specification-review.md

`````markdown
# CTC-005 Gemini specification critical review

Date: 2026-06-07

## Review verdict

Gemini's response is useful as adversarial input but is not implementation-ready
as written. It identified relevant OSM/Overpass variability and the need for a
pure deterministic normalization boundary, source references, unassociated
features, and stable warnings. It also materially broadened scope and proposed
unsupported destructive inference.

The accepted and corrected decisions below are the specification baseline for
Claude adversarial QA planning. Claude must challenge them before CTC-005 can
move to implementation.

## Accepted decisions

- Implement CTC-005 as a pure deterministic transformation from the existing
  validated `OverpassResponse` plus `SourceMetadata` into a normalized model.
- Index the complete flat element array before classification; never depend on
  raw Overpass element order.
- Preserve original OSM element type, integer ID, original tags, source
  metadata, and raw geometry evidence needed for attribution/debugging.
- Represent features that cannot be deterministically associated with a hole
  as top-level unassociated features.
- Omit a classified feature from normalized geometry when required coordinates
  are missing or malformed, while preserving a source reference in a stable
  warning.
- Do not invent missing relation segments or stitch incomplete rings.
- Return deterministic structured warnings rather than logging side effects.
- Use only synthetic fixtures and Vitest unit tests for CTC-005.

## Rejected decisions

- Reject Turf.js, MapLibre GL JS, or any new dependency. Neither library exists
  in the repository, and rendering/spatial math adoption is outside CTC-005.
- Reject rendering priorities, z-indexes, visual occlusion rules, map behavior,
  PDF behavior, and parser-owned attribution display strings.
- Reject convex-hull fallback boundaries, area calculations, centroids,
  containment tests, nearest-neighbor association, the arbitrary 150-meter
  threshold, or any other computational spatial inference.
- Reject automatically closing open ways, discarding unresolved node
  references, healing truncated geometry, or treating partial relation members
  as independent polygons. These actions fabricate or destructively reinterpret
  source geometry.
- Reject multipolygon assembly and general relation geometry normalization in
  CTC-005. Unsupported relations must remain attributable through warnings and
  preserved source references.
- Reject choosing course boundaries or greens by largest area or number of
  intersecting features.
- Reject stripping non-numeric characters from hole refs. Values such as `9B`
  and `Hole 9` are not equivalent to the strict numeric ref `9`.
- Reject merging distinct `golf=hole` source entities that share a hole number.
  Preserve each source entity and report ambiguous ordering/conflict.
- Reject legacy cart-path translation, generic grass/heath expansion, dogleg
  semantics, pin/green spatial merging, and alternative-green inference.
- Reject real-course fixture names and coordinates. Fixtures must remain
  explicitly synthetic and invented.
- Reject splitting CTC-005 into new epics/user stories or unrelated roadmap
  tasks.

## Corrected specification baseline

### Pure API boundary

The likely public API is conceptually:

```typescript
normalizeGolfCourse(
  response: OverpassResponse,
  source: SourceMetadata,
): NormalizationResult
```

The function must not fetch, mutate input, access storage, log, render, or
perform provider/cache policy. `NormalizationResult` must preserve source
metadata and contain normalized course data plus a deterministically sorted
warning array. Exact type names remain reviewable by Claude, but all
collection-valued fields must be arrays, not the singular fields shown in
Gemini's malformed model.

### Raw validation boundary

`validateResponse` guarantees only:

- the response is an object with an `elements` array;
- every element is an object with `type` equal to `node`, `way`, or `relation`;
- every element has an integer `id`.

The normalizer must safely validate all tags and geometry fields it consumes.
It must not assume tags are strings, coordinates are finite/in-range, way
geometry aligns with `nodes`, or relation members are complete.

### Geometry support

- Node: support a point only when `lat` and `lon` are finite and within WGS84
  latitude/longitude ranges.
- Way: support a line only when every geometry coordinate is valid and at least
  two coordinates exist.
- Closed way: support a polygon only when every coordinate is valid, at least
  four coordinates exist, and first and last coordinates are exactly equal.
- Open or malformed area-classified ways: do not auto-close or downgrade into a
  misleading normalized area; omit normalized geometry and warn.
- Relation: preserve source identity/tags but do not normalize relation geometry
  or assemble multipolygons in CTC-005; emit an unsupported-relation warning
  when the relation classifies as a relevant feature/course.
- Preserve raw node-reference IDs and raw geometry coordinates from supported
  source entities as source evidence; do not silently discard mismatches.

Use named `{ lat, lon }` coordinates to prevent accidental GeoJSON `[lon, lat]`
confusion unless Claude identifies a downstream reason to choose differently.

### Classification

Classification is based only on exact consumed tag strings from the reviewed
CTC-015 detail query:

- course boundary: `leisure=golf_course`
- hole route/metadata: `golf=hole`
- primary features: `golf=tee|green|fairway|bunker|rough`
- golf-specific water:
  `golf=water_hazard|lateral_water_hazard`
- generic water: relevant `natural=water`, `water=*`, `waterway=*`, and
  `landuse=reservoir|basin`
- vegetation: relevant
  `natural=wood|tree|tree_row|scrub` and `landuse=forest`

Preserve golf-specific water versus generic water and the original
classification tags. Define deterministic precedence for multi-tagged entities
without erasing source tags. Unknown/non-relevant entities may be ignored
without warning unless they conflict with a consumed relevant tag.

### Course and hole rules

- A stable source key is `${type}/${id}`.
- Do not deduplicate entities solely by numeric ID because IDs are scoped by
  OSM entity type.
- Exact repeated records with the same source key may collapse only if deeply
  equivalent under an explicitly deterministic comparison. Conflicting records
  with the same source key must not be silently merged; choose a documented
  stable winner and warn while preserving conflict refs.
- Recognize a hole number only from a trimmed strict positive base-10 integer
  `ref`. Do not strip characters or infer from `name`.
- Sort unambiguous numbered holes numerically, with stable source-key tie
  ordering. Preserve non-numeric/unidentified holes after numbered holes in
  source-key order.
- Duplicate numeric refs, missing/gapped refs, and unidentified/non-numeric refs
  make hole ordering ambiguous and must emit stable warnings. Distinct source
  hole entities remain distinct.
- Parse optional `par` only as a strict valid positive integer; malformed values
  remain preserved in original tags and generate a warning rather than being
  coerced.

### Feature-to-hole association

- Associate only when a feature has a strict numeric `ref` matching exactly one
  unambiguous numbered hole.
- A feature ref matching zero or multiple holes remains unassociated and emits
  an appropriate warning.
- Features without a usable ref remain unassociated without spatial inference.
  Claude should decide whether every such feature warrants a warning or whether
  warnings should be limited to required completeness and explicit conflicts.
- Relation-membership association is deferred with relation normalization.

### Required warnings

At minimum define stable machine-readable codes for:

- missing tee for each identified hole;
- missing green for each identified hole;
- ambiguous hole ordering;
- duplicate/conflicting source key;
- malformed or missing relevant geometry;
- unsupported relevant relation geometry;
- malformed consumed tags;
- ambiguous feature-to-hole ref;
- missing or multiple course candidates.

Warnings must include severity, stable code, affected source refs and/or hole
identity, and deterministic ordering. Recommended sort key: `code`, then hole
number/identity, then source key. Severity-first ordering is not required unless
Claude identifies a consumer need.

### Course candidate handling

Do not compute area or spatial containment. Preserve all
`leisure=golf_course` candidates. Recommended deterministic primary metadata
candidate:

1. valid closed-way boundary candidates before unsupported relation candidates
   and other candidates;
2. stable source-key order as the tie-breaker;
3. warn when zero or multiple candidates exist.

Claude must challenge whether selecting a primary candidate is justified or
whether the normalized result should expose candidates without a primary.

## Fixture and test baseline

Extend the existing complete synthetic fixture or add a purpose-specific
complete fixture that includes multiple out-of-order holes; all required
feature classes; explicit refs; and preserved source metadata, IDs, tags, node
references, and geometry evidence.

Add a separate explicitly synthetic incomplete/ambiguous fixture containing:

- a hole missing a tee and a hole missing a green;
- duplicate numeric hole refs, a non-numeric ref, and malformed `par`;
- relevant feature with missing/malformed geometry;
- relevant unsupported relation;
- unreferenced and ambiguously referenced features;
- duplicate/conflicting source-key records;
- zero or multiple course candidate coverage.

Tests must assert exact deterministic normalized output slices, preserved source
evidence, no input mutation, exact warning codes/order, and repeated-call
equality. No test may make a network request or depend on real-course data.

## Claude QA-planning red lines

Claude must treat these as blockers if the implementation plan allows them:

- fabricated/healed geometry or destructive loss of raw source evidence;
- spatial association or arbitrary thresholds;
- relation/multipolygon assembly;
- nondeterminism from input ordering or unstable sorting;
- numeric-ID-only identity collisions between node/way/relation;
- loose coercion of refs, pars, tags, or coordinates;
- missing required tee/green/ambiguous-order warnings;
- mutation, network/storage/logging/rendering side effects;
- new dependencies or scope from CTC-006/CTC-019/PDF behavior;
- real-course fixtures or prohibited reference-project reuse.

## Remaining questions for Claude

1. Should missing/gapped numeric refs alone trigger ambiguous-order warnings, or
   only duplicate/unidentified refs?
2. Should unreferenced non-required features produce warnings, or remain
   silently unassociated to limit diagnostic noise?
3. Should the result expose a deterministic primary course candidate, or only
   preserve all candidates and require downstream explicit selection?
4. What exact warning severity and deterministic sort contract best supports
   downstream consumers without overfitting CTC-005?
5. Is strict deep-equivalence deduplication worth the complexity, or should all
   repeated source keys be treated as conflicts and warned?
`````

### docs/overpass-query-contract.md

`````markdown
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
`````

### src/overpass.ts

`````typescript
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
`````

### src/overpass.test.ts

`````typescript
import {
  buildDetailQuery,
  buildDiscoveryQuery,
  classifyHttpStatus,
  detailCacheKey,
  discoveryCacheKey,
  encodeCourseName,
  parseBbox,
  parseCandidateBounds,
  readCache,
  serializeBbox,
  sourceMetadata,
  validateResponse,
  validateTrustedIdentity,
  writeCache,
  type Bbox,
} from "./overpass";

const bbox: Bbox = { south: 37.3, west: -122.1, north: 37.5, east: -121.9 };

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  length = 0;
  clear() { this.values.clear(); this.length = 0; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); this.length = this.values.size; }
  setItem(key: string, value: string) { this.values.set(key, value); this.length = this.values.size; }
}

describe("Overpass query construction", () => {
  it("builds the exact reviewed discovery query", () => {
    expect(buildDiscoveryQuery(bbox, "Pine.* Hills")).toMatchInlineSnapshot(`
      "/* chart-the-course/0.0.0 contact:https://github.com/ajason13/chart-the-course purpose:golf-course-discovery */
      [out:json][timeout:25][maxsize:536870912];
      (
        nwr["leisure"="golf_course"]["name"~"Pine\\.\\* Hills",i](37.3,-122.1,37.5,-121.9);
        nwr["leisure"="golf_course"](37.3,-122.1,37.5,-121.9);
      );
      out tags center bb;"
    `);
    expect(buildDiscoveryQuery(bbox, "   ")).not.toContain('["name"~');
  });

  it("builds the exact reviewed detail query", () => {
    expect(buildDetailQuery(bbox)).toMatchInlineSnapshot(`
      "/* chart-the-course/0.0.0 contact:https://github.com/ajason13/chart-the-course purpose:golf-course-detail */
      [out:json][timeout:45][maxsize:536870912];
      (
        nwr["leisure"="golf_course"](37.3,-122.1,37.5,-121.9);
        nwr["golf"~"^(hole|fairway|green|bunker|tee|water_hazard|lateral_water_hazard|rough|out_of_bounds|pin|cartpath)$"](37.3,-122.1,37.5,-121.9);
        nwr["natural"~"^(water|wood|tree|tree_row|scrub)$"](37.3,-122.1,37.5,-121.9);
        nwr["landuse"~"^(forest|reservoir|basin)$"](37.3,-122.1,37.5,-121.9);
        nwr["water"~"^(pond|lake|basin|reservoir)$"](37.3,-122.1,37.5,-121.9);
        nwr["waterway"](37.3,-122.1,37.5,-121.9);
      );
      out body geom;"
    `);
  });

  it("encodes names in one pass and constrains identity constants", () => {
    expect(encodeCourseName('  "a\\.*+?()[]{}|^$*/é"  ')).toBe('\\"a\\\\\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\^\\$\\*/é\\"');
    expect(encodeCourseName("*/ remains text")).toBe("\\*/ remains text");
    expect(() => encodeCourseName("bad\nquery")).toThrow(/control/);
    expect(() => encodeCourseName("x".repeat(201))).toThrow(/200/);
    expect([...encodeCourseName("é".repeat(200))]).toHaveLength(200);
    expect(validateTrustedIdentity("0.0.0")).toBe("0.0.0");
    expect(() => validateTrustedIdentity("bad*/comment")).toThrow();
    expect(() => validateTrustedIdentity("bad\ncomment")).toThrow();
  });
});

describe("bbox validation", () => {
  it("accepts canonical bounded decimal input and normalizes negative zero", () => {
    const result = parseBbox({ south: "-0", west: "-0.0000000", north: "0.35", east: "0.3500000" });
    expect(result).toEqual({
      ok: true,
      bbox: { south: -0, west: -0, north: 0.35, east: 0.35 },
      serialized: "0,0,0.35,0.35",
    });
    expect(serializeBbox(bbox)).toBe("37.3,-122.1,37.5,-121.9");
  });

  it.each(["1e-2", "1,2", "Infinity", "NaN", "1.12345678"])("rejects invalid syntax %s", (south) => {
    expect(parseBbox({ south, west: "0", north: "1", east: "1" }).ok).toBe(false);
  });

  it("handles span, polar, ordering, and dateline edges", () => {
    expect(parseBbox({ south: "89.65", west: "10", north: "90", east: "10.35" }).ok).toBe(true);
    expect(parseBbox({ south: "37.0", west: "-122.1", north: "37.35", east: "-121.75" }).ok).toBe(true);
    expect(parseBbox({ south: "0", west: "0", north: "0.3500001", east: "0.35" }).ok).toBe(false);
    expect(parseBbox({ south: "1", west: "0", north: "0", east: "0.1" }).ok).toBe(false);
    expect(parseBbox({ south: "0", west: "179.9", north: "0.1", east: "-179.9" }).ok).toBe(false);
    expect(parseCandidateBounds({ minlat: 37.3, minlon: -122.1, maxlat: 37.5, maxlon: -121.9 })).toEqual(bbox);
    expect(parseCandidateBounds({ minlat: 37.3 })).toBeNull();
  });
});

describe("response, cache, and HTTP classification", () => {
  const rawResponse = '{"elements":[{"type":"way","id":42,"tags":{"name":"Test"}}]}';

  it("validates only the minimum raw entity shape and classifies empty results", () => {
    expect(validateResponse({ elements: [] })).toEqual({ elements: [] });
    expect(validateResponse(JSON.parse(rawResponse))?.elements).toHaveLength(1);
    expect(validateResponse({ elements: [{ type: "area", id: 1 }] })).toBeNull();
    expect(validateResponse({ elements: [{ type: "node", id: 1.5 }] })).toBeNull();
    expect(validateResponse({ nope: [] })).toBeNull();
  });

  it("generates deterministic distinct cache keys", () => {
    expect(discoveryCacheKey(bbox, " Pine.* ")).toBe("ctc:overpass:v1:discovery:37.3,-122.1,37.5,-121.9:pine\\.\\*");
    expect(detailCacheKey(bbox)).toBe("ctc:overpass:v1:detail:37.3,-122.1,37.5,-121.9");
  });

  it("round-trips exact raw text and reports corrupt or failed storage without eviction", () => {
    const storage = new MemoryStorage();
    const cached = { rawResponse, source: sourceMetadata("query", bbox) };
    expect(writeCache(storage, "key", cached)).toBeNull();
    expect(readCache(storage, "key")).toMatchObject({ kind: "hit", cached: { rawResponse } });
    storage.setItem("corrupt", "{");
    expect(readCache(storage, "corrupt").kind).toBe("warning");
    expect(storage.getItem("corrupt")).toBe("{");

    const failed = new MemoryStorage();
    failed.setItem = () => { throw new Error("quota"); };
    expect(writeCache(failed, "key", cached)).toMatch(/could not/);
    failed.getItem = () => { throw new Error("unavailable"); };
    expect(readCache(failed, "key").kind).toBe("warning");
  });

  it("classifies HTTP status without retry policy", () => {
    expect(classifyHttpStatus(429)).toBe("rate-limit");
    expect(classifyHttpStatus(504)).toBe("timeout");
    expect(classifyHttpStatus(500)).toBe("http");
  });
});
`````

### fixtures/overpass/synthetic-golf-course.json

`````json
{
  "version": 0.6,
  "generator": "Chart the Course synthetic Overpass fixture",
  "osm3s": {
    "timestamp_osm_base": "2026-06-05T00:00:00Z",
    "copyright": "Synthetic fixture for parser tests; not real OSM data."
  },
  "chartTheCourseFixture": {
    "contract": "docs/overpass-query-contract.md",
    "synthetic": true,
    "sourceCheckedDate": "2026-06-05",
    "sourceCopyrightUrl": "https://www.openstreetmap.org/copyright",
    "bbox": {
      "south": 35.0000,
      "west": -80.0000,
      "north": 35.0100,
      "east": -79.9900
    },
    "queryPurpose": "golf-course-detail"
  },
  "elements": [
    {
      "type": "way",
      "id": 9000000001,
      "bounds": {
        "minlat": 35.0000,
        "minlon": -80.0000,
        "maxlat": 35.0100,
        "maxlon": -79.9900
      },
      "nodes": [9100000001, 9100000002, 9100000003, 9100000004, 9100000001],
      "geometry": [
        { "lat": 35.0000, "lon": -80.0000 },
        { "lat": 35.0100, "lon": -80.0000 },
        { "lat": 35.0100, "lon": -79.9900 },
        { "lat": 35.0000, "lon": -79.9900 },
        { "lat": 35.0000, "lon": -80.0000 }
      ],
      "tags": {
        "leisure": "golf_course",
        "name": "Synthetic Municipal Course",
        "golf:course": "9_hole"
      }
    },
    {
      "type": "way",
      "id": 9000000101,
      "nodes": [9100000101, 9100000102, 9100000103],
      "geometry": [
        { "lat": 35.0010, "lon": -79.9990 },
        { "lat": 35.0040, "lon": -79.9965 },
        { "lat": 35.0070, "lon": -79.9940 }
      ],
      "tags": {
        "golf": "hole",
        "ref": "1",
        "par": "4"
      }
    },
    {
      "type": "way",
      "id": 9000000201,
      "nodes": [9100000201, 9100000202, 9100000203, 9100000204, 9100000201],
      "geometry": [
        { "lat": 35.0008, "lon": -79.9993 },
        { "lat": 35.0013, "lon": -79.9993 },
        { "lat": 35.0013, "lon": -79.9987 },
        { "lat": 35.0008, "lon": -79.9987 },
        { "lat": 35.0008, "lon": -79.9993 }
      ],
      "tags": {
        "golf": "tee",
        "ref": "1"
      }
    },
    {
      "type": "way",
      "id": 9000000301,
      "nodes": [9100000301, 9100000302, 9100000303, 9100000304, 9100000301],
      "geometry": [
        { "lat": 35.0020, "lon": -79.9982 },
        { "lat": 35.0056, "lon": -79.9960 },
        { "lat": 35.0052, "lon": -79.9951 },
        { "lat": 35.0018, "lon": -79.9973 },
        { "lat": 35.0020, "lon": -79.9982 }
      ],
      "tags": {
        "golf": "fairway",
        "ref": "1"
      }
    },
    {
      "type": "way",
      "id": 9000000401,
      "nodes": [9100000401, 9100000402, 9100000403, 9100000404, 9100000401],
      "geometry": [
        { "lat": 35.0065, "lon": -79.9945 },
        { "lat": 35.0073, "lon": -79.9942 },
        { "lat": 35.0071, "lon": -79.9935 },
        { "lat": 35.0064, "lon": -79.9937 },
        { "lat": 35.0065, "lon": -79.9945 }
      ],
      "tags": {
        "golf": "green",
        "ref": "1"
      }
    },
    {
      "type": "way",
      "id": 9000000501,
      "nodes": [9100000501, 9100000502, 9100000503, 9100000504, 9100000501],
      "geometry": [
        { "lat": 35.0058, "lon": -79.9948 },
        { "lat": 35.0061, "lon": -79.9947 },
        { "lat": 35.0060, "lon": -79.9943 },
        { "lat": 35.0057, "lon": -79.9944 },
        { "lat": 35.0058, "lon": -79.9948 }
      ],
      "tags": {
        "golf": "bunker"
      }
    },
    {
      "type": "way",
      "id": 9000000601,
      "nodes": [9100000601, 9100000602, 9100000603, 9100000604, 9100000601],
      "geometry": [
        { "lat": 35.0035, "lon": -79.9952 },
        { "lat": 35.0043, "lon": -79.9949 },
        { "lat": 35.0040, "lon": -79.9940 },
        { "lat": 35.0033, "lon": -79.9944 },
        { "lat": 35.0035, "lon": -79.9952 }
      ],
      "tags": {
        "natural": "water",
        "water": "pond"
      }
    },
    {
      "type": "way",
      "id": 9000000701,
      "nodes": [9100000701, 9100000702, 9100000703, 9100000704, 9100000701],
      "geometry": [
        { "lat": 35.0048, "lon": -79.9964 },
        { "lat": 35.0051, "lon": -79.9962 },
        { "lat": 35.0049, "lon": -79.9958 },
        { "lat": 35.0046, "lon": -79.9960 },
        { "lat": 35.0048, "lon": -79.9964 }
      ],
      "tags": {
        "golf": "water_hazard",
        "ref": "1"
      }
    },
    {
      "type": "way",
      "id": 9000000801,
      "nodes": [9100000801, 9100000802, 9100000803, 9100000804, 9100000801],
      "geometry": [
        { "lat": 35.0027, "lon": -79.9956 },
        { "lat": 35.0034, "lon": -79.9955 },
        { "lat": 35.0033, "lon": -79.9948 },
        { "lat": 35.0026, "lon": -79.9950 },
        { "lat": 35.0027, "lon": -79.9956 }
      ],
      "tags": {
        "natural": "wood"
      }
    }
  ]
}
`````

### src/course.ts

`````typescript
export type Coordinate = readonly number[];

export interface SampleCourse {
  name: string;
  synthetic: boolean;
  coordinateSystem: string;
  source: string;
  notice: string;
  center: Coordinate;
  holes: Array<{
    number: number;
    par: number;
    tee: Coordinate;
    green: Coordinate;
  }>;
}

export function summarizeCourse(sample: SampleCourse): string {
  const holeCount = sample.holes.length;
  const par = sample.holes.reduce((total, hole) => total + hole.par, 0);
  return `${holeCount} placeholder holes / par ${par}`;
}

export function isSyntheticCourse(sample: SampleCourse): boolean {
  const coordinates = [
    sample.center,
    ...sample.holes.flatMap((hole) => [hole.tee, hole.green])
  ];

  return (
    sample.synthetic === true &&
    sample.coordinateSystem === "local-normalized" &&
    coordinates.every(
      (coordinate) =>
        coordinate.length === 2 &&
        coordinate.every(
          (value) =>
            typeof value === "number" &&
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 100
        )
    )
  );
}
`````

### src/main.test.ts

`````typescript
import sampleCourse from "../fixtures/courses/sample-course.json";
import { isSyntheticCourse, summarizeCourse } from "./course";

describe("sample course scaffold", () => {
  it("summarizes the placeholder fixture deterministically", () => {
    expect(summarizeCourse(sampleCourse)).toBe("3 placeholder holes / par 12");
  });

  it("uses explicitly synthetic non-geographic coordinates", () => {
    expect(isSyntheticCourse(sampleCourse)).toBe(true);
  });

  it("rejects fixture coordinates outside the local normalized space", () => {
    const invalidCourse = structuredClone(sampleCourse);
    invalidCourse.center = [-122.08, 37.42];

    expect(isSyntheticCourse(invalidCourse)).toBe(false);
  });
});
`````

### package.json

`````json
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
`````

### tsconfig.json

`````json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vitest/globals"],
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src", "test", "vite.config.ts", "playwright.config.ts"]
}
`````

### vite.config.ts

`````typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: false
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"]
  }
});
`````
```````

<!-- END AUDITED FILE 2/9: docs/handoffs/ctc-005-claude-qa-planning-prompt.md -->

<!-- BEGIN AUDITED FILE 3/9: docs/handoffs/ctc-005-gemini-plan-correction.md -->

```````
# CTC-005 Gemini Deep Research plan correction

Replace the entire current plan. It is unrelated to CTC-005.

Do not research open-source ecosystem trends, local-first architecture,
AI-agent integrations, privacy-first sync, generic compliance programs,
repository patterns, epics, user stories, task decomposition, roadmaps, or
Notion templates.

Use exactly this plan:

1. Research current primary OpenStreetMap documentation only for the CTC-005
   tags in the uploaded prompt: golf-course boundaries, holes, tees, greens,
   fairways, bunkers, golf-specific and generic water, vegetation, and rough.
2. Research current primary Overpass documentation only for JSON
   `out body geom` shapes for nodes, ways, relations, and relation members,
   including partial or missing geometry.
3. Use the uploaded repository contracts to define the normalized TypeScript
   course, hole, feature, geometry, source-reference, and warning model.
4. Define deterministic CTC-005 rules for classification, course selection,
   hole identification/order, feature association, duplicates/conflicts,
   malformed or incomplete input, and warning ordering.
5. Define complete and incomplete synthetic Overpass fixtures and exact Vitest
   assertions for the CTC-005 acceptance criteria.
6. Return the implementation-ready CTC-005 technical specification in the
   response format required by the uploaded prompt. Clearly distinguish sourced
   OSM/Overpass facts from project design recommendations and reject or defer
   unsupported relation/multipolygon assumptions.

Do not propose another plan and do not ask for further plan changes. Start this
replacement plan.
```````

<!-- END AUDITED FILE 3/9: docs/handoffs/ctc-005-gemini-plan-correction.md -->

<!-- BEGIN AUDITED FILE 4/9: docs/handoffs/ctc-005-gemini-specification-prompt.md -->

```````
# CTC-005: Specify deterministic OSM golf geometry normalization

## Replace the current Deep Research plan

Discard any current or previously generated research plan. Do not continue,
adapt, or summarize a plan about open-source ecosystem trends, local-first
architecture, AI-agent integrations, privacy-first sync, product roadmaps,
epics, user stories, task decomposition, or Notion templates.

Use exactly this replacement research plan:

1. Research current primary OpenStreetMap documentation for the CTC-005 tags
   listed below and record only semantics needed to classify course boundaries,
   holes, tees, greens, fairways, bunkers, water, vegetation, and rough.
2. Research current primary Overpass documentation for JSON `out body geom`
   node, way, relation, and relation-member shapes, including partial or missing
   geometry. Determine which forms can be normalized without network lookups or
   multipolygon assembly.
3. Using the supplied repository contracts, specify the exact normalized
   TypeScript course, hole, feature, geometry, source-reference, and warning
   model.
4. Specify deterministic algorithms for classification, course selection, hole
   identification and ordering, feature-to-hole association, duplicate and
   conflict handling, malformed/incomplete inputs, and warning ordering.
5. Specify complete and incomplete synthetic Overpass fixtures plus Vitest
   assertions that prove the CTC-005 acceptance criteria.
6. Produce the required CTC-005 technical specification format below, clearly
   separating sourced OSM/Overpass facts from project design recommendations
   and explicitly deferring unsupported relation or multipolygon assumptions.

Do not propose an alternative plan. Do not ask what changes should be made to
another plan. Begin the research using this replacement plan and return only the
CTC-005 specification requested below.

## Research target

Research and specify only the technical decisions required to implement CTC-005:
convert the validated raw Overpass response described below into a deterministic
TypeScript course/hole/feature model.

Your response must directly resolve the listed CTC-005 planning questions using
the supplied repository contracts and, only where necessary, current primary
OpenStreetMap or Overpass documentation. Produce an implementation-ready
technical specification for critical review. Do not write full implementation
code.

This is not a request to research product management, AI development
methodologies, agent workflows, or documentation tools.

## Mandatory research focus

Research only these topics when external research is needed:

- Current OpenStreetMap semantics and common geometry forms for
  `leisure=golf_course`, `golf=hole`, `golf=tee`, `golf=green`,
  `golf=fairway`, `golf=bunker`, `golf=water_hazard`,
  `golf=lateral_water_hazard`, `golf=rough`, relevant generic water tags, and
  relevant vegetation tags.
- Overpass JSON `out body geom` response shapes for nodes, ways, relations,
  relation members, and missing or partial geometry.
- Deterministic normalization rules that can operate only on the supplied raw
  response without network lookups, rendering, or computational spatial
  inference.
- Data-quality warning design for incomplete, malformed, duplicate, or
  ambiguous OSM golf data.
- A synthetic complete/incomplete fixture and Vitest unit-test matrix for the
  proposed normalization contract.

Every researched fact or recommendation must state which numbered CTC-005
planning question it resolves. Prefer a conservative unsupported/deferred
decision when primary documentation or the supplied raw response cannot justify
an assumption.

## Prohibited research and output

Do not research, discuss, or produce recommendations about:

- vibe coding, conversational goal translation, or generic AI coding-agent
  task design;
- product-management workflows, Principal Product Manager frameworks,
  architectural-risk frameworks, roadmaps, epics, or task boards;
- Notion templates, Markdown schemas, documentation layouts, or governance
  workflow design;
- generic open-source compliance, security, or licensing programs;
- Claude, Codex, Gemini, or multi-agent orchestration practices;
- unrelated Chart the Course tasks or any feature outside the binding CTC-005
  scope below.

Do not broaden scope. Do not propose new dependencies unless a specific CTC-005
requirement cannot be met with TypeScript and existing project tooling, and
clearly mark that as requiring maintainer approval.

## Completion test

The response is acceptable only if it:

1. Defines the normalized TypeScript model and pure normalization boundary.
2. Resolves supported and rejected node/way/relation geometry forms.
3. Defines deterministic classification, hole identification/order,
   association, duplicate/conflict, and warning rules.
4. Defines exact expected behavior for complete and incomplete synthetic
   fixtures.
5. Keeps rendering, networking, caching, provider policy, product-management
   process, and generic AI-agent guidance out of the response.

## Current project and gate state

- Repository: Chart the Course, Apache-2.0 browser app using React, TypeScript, Vite, Vitest, and Playwright.
- Current branch/state: clean synchronized main at commit 918f80101ef1d6bd3ba3b91dfe1980717cff2182. Do not propose creating a feature branch before specification and QA-planning gates complete.
- CTC-015 is Done and defines the reviewed bounded Overpass query/raw-source contract.
- CTC-004 is Done. PR #2 merged as 50638ee and supplies a validated minimum raw Overpass response shape, exact raw response text, and source metadata. It intentionally displays raw entities and does not normalize geometry.
- CTC-005 is now 1. Spec Drafting (Gemini). No runtime implementation may begin until this response is critically reviewed and Claude adversarial QA planning is completed and critically reviewed.
- CTC-006 rendering and measurement depends on normalized geometry and remains downstream.
- CTC-019 durable cache/request identity policy is independent downstream work and is not a prerequisite for pure normalization.

## Acceptance criteria

- Parse tees, greens, fairways, bunkers, water, trees/rough when available, and hole metadata.
- Preserve original OSM IDs for attribution/debugging.
- Emit data-quality warnings for missing tees, greens, or ambiguous hole ordering.
- Unit tests cover complete and incomplete fixtures.

## Binding scope boundaries

CTC-005 owns pure deterministic normalization from already validated raw Overpass entities into an app model. Preserve original entity type, ID, original tags, query/source metadata, and raw geometry references needed for attribution/debugging. Define deterministic handling for incomplete and ambiguous OSM data.

Do not add or specify rendering, measurement controls, basemap tiles, PDF behavior, geocoding, durable cache, refresh controls, retries/backoff, endpoint failover, new providers, network behavior changes, or user data flows. Do not add dependencies without an explicit reviewed decision. Prefer no new dependency. Do not copy or adapt code/query/UI structures from prohibited or unlicensed reference projects.

Relation geometry and multipolygon assembly are not silently assumed. Decide whether any relation geometry form can be normalized directly from the existing out body geom response, or explicitly reject/defer relation and multipolygon assembly with deterministic warnings. CTC-005 must not invent missing member geometry or perform network lookups.

## Existing raw input contract and ownership boundary

- validateResponse currently guarantees only that the response is an object with an elements array and each element has type node, way, or relation plus an integer ID. All other fields remain unknown and must be safely inspected by the normalizer.
- The detail query uses out body geom and may return nodes with lat/lon, ways with nodes and geometry, and relations with members whose geometry availability/shape may vary. Specify exactly which forms CTC-005 supports and how unsupported/malformed forms are warned about or skipped.
- SourceMetadata currently contains query, endpoint, completedAt, bbox, and copyrightUrl. CTC-005 must preserve this source record but must not implement durable storage or request policy.
- The current synthetic Overpass fixture is deliberately invented and non-real. Real-course fixtures require governance review and should not be proposed for this task.
- Existing src/course.ts is a scaffold-only local-normalized placeholder model. State whether it should remain separate, be replaced, or be extended, while preventing accidental mixing of local placeholder coordinates with WGS84 OSM geometry.
- CTC-004 App.tsx is included to show the integration boundary. CTC-005 should primarily specify a pure module plus unit tests/fixtures; avoid requiring UI expansion unless essential to acceptance criteria.

## Planning questions you must resolve

1. Define the normalized course, hole, feature, geometry, source-reference, and warning TypeScript model with clear ownership boundaries and discriminated unions where useful.
2. Define supported raw Overpass geometry forms for nodes, ways, and relations. State coordinate order and validation rules. Reject unsupported assumptions.
3. Define deterministic course selection/boundary handling when zero, one, or multiple leisure=golf_course entities exist in a detail response.
4. Define deterministic hole identification and ordering rules using tags such as ref, name, par, and usable relation membership only if explicitly supported. Explain numeric parsing, malformed values, duplicate numbers, gaps, non-numeric refs, and ambiguous order.
5. Define how features associate with holes, including features with matching ref, missing ref, conflicting ref, or ambiguous spatial context. Do not silently add computational geometry or nearest-feature inference unless explicitly justified inside scope.
6. Define duplicate and conflicting entity handling using stable entity keys of original type plus ID. Explain exact duplicate records versus conflicting duplicates.
7. Define classification precedence for golf-specific features, generic water/waterways, vegetation, and rough. Preserve distinctions rather than erasing original meaning.
8. Define warning taxonomy, stable machine-readable codes, severity, affected source references, and deterministic ordering. At minimum cover missing tees, missing greens, and ambiguous hole ordering.
9. Define behavior for missing/malformed geometry, malformed tags, empty responses, missing course boundary, orphan features, nodes versus lines versus closed rings, and relation/multipolygon cases.
10. Define preservation of OSM entity type/ID, original tags, raw geometry references, source metadata, and OSM attribution obligations without duplicating the exact raw response or creating durable cache policy inside the normalized model unless justified.
11. Define a complete and incomplete synthetic fixture/test matrix. Include precise expected warnings and deterministic output assertions. State whether to extend the existing complete fixture and add a separate incomplete fixture.
12. Identify observability/debugging needs for this pure transformation boundary. Prefer deterministic returned diagnostics over logging side effects.
13. Identify security, performance, and denial-of-service considerations for normalization of already bounded but potentially large raw element arrays, without inventing an arbitrary threshold lacking contract basis.
14. State exact files likely to be added or changed, while keeping runtime integration minimal and adding no dependency unless separately approved.

## Required response format

Return a self-contained specification with these sections:

1. Verdict on scope/readiness and any blocking unresolved decisions.
2. Accepted assumptions and explicitly rejected/deferred assumptions.
3. Proposed normalized TypeScript data model, including representative type declarations or pseudocode but no full implementation.
4. Deterministic normalization algorithm in ordered steps.
5. Geometry support matrix for node, way, and relation forms.
6. Classification and hole-association tables.
7. Warning taxonomy with code, severity, trigger, and affected entity/hole references.
8. Duplicate/conflict and deterministic ordering rules.
9. Complete/incomplete synthetic fixture and unit-test matrix with expected outputs/warnings.
10. File/change plan, dependency decision, observability decision, and non-goals.
11. Adversarial QA red lines for the later Claude planning handoff.
12. Open maintainer decisions, if any, stated as narrow questions with a recommended default.

Cite primary OpenStreetMap/Overpass documentation only when a decision truly depends on current external tagging or response semantics. Clearly distinguish sourced facts from design recommendations. Avoid unsupported quantitative claims.

## Exact relevant repository file contents

### docs/overpass-query-contract.md

`````markdown
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
`````

### src/overpass.ts

`````typescript
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
`````

### src/overpass.test.ts

`````typescript
import {
  buildDetailQuery,
  buildDiscoveryQuery,
  classifyHttpStatus,
  detailCacheKey,
  discoveryCacheKey,
  encodeCourseName,
  parseBbox,
  parseCandidateBounds,
  readCache,
  serializeBbox,
  sourceMetadata,
  validateResponse,
  validateTrustedIdentity,
  writeCache,
  type Bbox,
} from "./overpass";

const bbox: Bbox = { south: 37.3, west: -122.1, north: 37.5, east: -121.9 };

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  length = 0;
  clear() { this.values.clear(); this.length = 0; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); this.length = this.values.size; }
  setItem(key: string, value: string) { this.values.set(key, value); this.length = this.values.size; }
}

describe("Overpass query construction", () => {
  it("builds the exact reviewed discovery query", () => {
    expect(buildDiscoveryQuery(bbox, "Pine.* Hills")).toMatchInlineSnapshot(`
      "/* chart-the-course/0.0.0 contact:https://github.com/ajason13/chart-the-course purpose:golf-course-discovery */
      [out:json][timeout:25][maxsize:536870912];
      (
        nwr["leisure"="golf_course"]["name"~"Pine\\.\\* Hills",i](37.3,-122.1,37.5,-121.9);
        nwr["leisure"="golf_course"](37.3,-122.1,37.5,-121.9);
      );
      out tags center bb;"
    `);
    expect(buildDiscoveryQuery(bbox, "   ")).not.toContain('["name"~');
  });

  it("builds the exact reviewed detail query", () => {
    expect(buildDetailQuery(bbox)).toMatchInlineSnapshot(`
      "/* chart-the-course/0.0.0 contact:https://github.com/ajason13/chart-the-course purpose:golf-course-detail */
      [out:json][timeout:45][maxsize:536870912];
      (
        nwr["leisure"="golf_course"](37.3,-122.1,37.5,-121.9);
        nwr["golf"~"^(hole|fairway|green|bunker|tee|water_hazard|lateral_water_hazard|rough|out_of_bounds|pin|cartpath)$"](37.3,-122.1,37.5,-121.9);
        nwr["natural"~"^(water|wood|tree|tree_row|scrub)$"](37.3,-122.1,37.5,-121.9);
        nwr["landuse"~"^(forest|reservoir|basin)$"](37.3,-122.1,37.5,-121.9);
        nwr["water"~"^(pond|lake|basin|reservoir)$"](37.3,-122.1,37.5,-121.9);
        nwr["waterway"](37.3,-122.1,37.5,-121.9);
      );
      out body geom;"
    `);
  });

  it("encodes names in one pass and constrains identity constants", () => {
    expect(encodeCourseName('  "a\\.*+?()[]{}|^$*/é"  ')).toBe('\\"a\\\\\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\^\\$\\*/é\\"');
    expect(encodeCourseName("*/ remains text")).toBe("\\*/ remains text");
    expect(() => encodeCourseName("bad\nquery")).toThrow(/control/);
    expect(() => encodeCourseName("x".repeat(201))).toThrow(/200/);
    expect([...encodeCourseName("é".repeat(200))]).toHaveLength(200);
    expect(validateTrustedIdentity("0.0.0")).toBe("0.0.0");
    expect(() => validateTrustedIdentity("bad*/comment")).toThrow();
    expect(() => validateTrustedIdentity("bad\ncomment")).toThrow();
  });
});

describe("bbox validation", () => {
  it("accepts canonical bounded decimal input and normalizes negative zero", () => {
    const result = parseBbox({ south: "-0", west: "-0.0000000", north: "0.35", east: "0.3500000" });
    expect(result).toEqual({
      ok: true,
      bbox: { south: -0, west: -0, north: 0.35, east: 0.35 },
      serialized: "0,0,0.35,0.35",
    });
    expect(serializeBbox(bbox)).toBe("37.3,-122.1,37.5,-121.9");
  });

  it.each(["1e-2", "1,2", "Infinity", "NaN", "1.12345678"])("rejects invalid syntax %s", (south) => {
    expect(parseBbox({ south, west: "0", north: "1", east: "1" }).ok).toBe(false);
  });

  it("handles span, polar, ordering, and dateline edges", () => {
    expect(parseBbox({ south: "89.65", west: "10", north: "90", east: "10.35" }).ok).toBe(true);
    expect(parseBbox({ south: "37.0", west: "-122.1", north: "37.35", east: "-121.75" }).ok).toBe(true);
    expect(parseBbox({ south: "0", west: "0", north: "0.3500001", east: "0.35" }).ok).toBe(false);
    expect(parseBbox({ south: "1", west: "0", north: "0", east: "0.1" }).ok).toBe(false);
    expect(parseBbox({ south: "0", west: "179.9", north: "0.1", east: "-179.9" }).ok).toBe(false);
    expect(parseCandidateBounds({ minlat: 37.3, minlon: -122.1, maxlat: 37.5, maxlon: -121.9 })).toEqual(bbox);
    expect(parseCandidateBounds({ minlat: 37.3 })).toBeNull();
  });
});

describe("response, cache, and HTTP classification", () => {
  const rawResponse = '{"elements":[{"type":"way","id":42,"tags":{"name":"Test"}}]}';

  it("validates only the minimum raw entity shape and classifies empty results", () => {
    expect(validateResponse({ elements: [] })).toEqual({ elements: [] });
    expect(validateResponse(JSON.parse(rawResponse))?.elements).toHaveLength(1);
    expect(validateResponse({ elements: [{ type: "area", id: 1 }] })).toBeNull();
    expect(validateResponse({ elements: [{ type: "node", id: 1.5 }] })).toBeNull();
    expect(validateResponse({ nope: [] })).toBeNull();
  });

  it("generates deterministic distinct cache keys", () => {
    expect(discoveryCacheKey(bbox, " Pine.* ")).toBe("ctc:overpass:v1:discovery:37.3,-122.1,37.5,-121.9:pine\\.\\*");
    expect(detailCacheKey(bbox)).toBe("ctc:overpass:v1:detail:37.3,-122.1,37.5,-121.9");
  });

  it("round-trips exact raw text and reports corrupt or failed storage without eviction", () => {
    const storage = new MemoryStorage();
    const cached = { rawResponse, source: sourceMetadata("query", bbox) };
    expect(writeCache(storage, "key", cached)).toBeNull();
    expect(readCache(storage, "key")).toMatchObject({ kind: "hit", cached: { rawResponse } });
    storage.setItem("corrupt", "{");
    expect(readCache(storage, "corrupt").kind).toBe("warning");
    expect(storage.getItem("corrupt")).toBe("{");

    const failed = new MemoryStorage();
    failed.setItem = () => { throw new Error("quota"); };
    expect(writeCache(failed, "key", cached)).toMatch(/could not/);
    failed.getItem = () => { throw new Error("unavailable"); };
    expect(readCache(failed, "key").kind).toBe("warning");
  });

  it("classifies HTTP status without retry policy", () => {
    expect(classifyHttpStatus(429)).toBe("rate-limit");
    expect(classifyHttpStatus(504)).toBe("timeout");
    expect(classifyHttpStatus(500)).toBe("http");
  });
});
`````

### fixtures/overpass/synthetic-golf-course.json

`````json
{
  "version": 0.6,
  "generator": "Chart the Course synthetic Overpass fixture",
  "osm3s": {
    "timestamp_osm_base": "2026-06-05T00:00:00Z",
    "copyright": "Synthetic fixture for parser tests; not real OSM data."
  },
  "chartTheCourseFixture": {
    "contract": "docs/overpass-query-contract.md",
    "synthetic": true,
    "sourceCheckedDate": "2026-06-05",
    "sourceCopyrightUrl": "https://www.openstreetmap.org/copyright",
    "bbox": {
      "south": 35.0000,
      "west": -80.0000,
      "north": 35.0100,
      "east": -79.9900
    },
    "queryPurpose": "golf-course-detail"
  },
  "elements": [
    {
      "type": "way",
      "id": 9000000001,
      "bounds": {
        "minlat": 35.0000,
        "minlon": -80.0000,
        "maxlat": 35.0100,
        "maxlon": -79.9900
      },
      "nodes": [9100000001, 9100000002, 9100000003, 9100000004, 9100000001],
      "geometry": [
        { "lat": 35.0000, "lon": -80.0000 },
        { "lat": 35.0100, "lon": -80.0000 },
        { "lat": 35.0100, "lon": -79.9900 },
        { "lat": 35.0000, "lon": -79.9900 },
        { "lat": 35.0000, "lon": -80.0000 }
      ],
      "tags": {
        "leisure": "golf_course",
        "name": "Synthetic Municipal Course",
        "golf:course": "9_hole"
      }
    },
    {
      "type": "way",
      "id": 9000000101,
      "nodes": [9100000101, 9100000102, 9100000103],
      "geometry": [
        { "lat": 35.0010, "lon": -79.9990 },
        { "lat": 35.0040, "lon": -79.9965 },
        { "lat": 35.0070, "lon": -79.9940 }
      ],
      "tags": {
        "golf": "hole",
        "ref": "1",
        "par": "4"
      }
    },
    {
      "type": "way",
      "id": 9000000201,
      "nodes": [9100000201, 9100000202, 9100000203, 9100000204, 9100000201],
      "geometry": [
        { "lat": 35.0008, "lon": -79.9993 },
        { "lat": 35.0013, "lon": -79.9993 },
        { "lat": 35.0013, "lon": -79.9987 },
        { "lat": 35.0008, "lon": -79.9987 },
        { "lat": 35.0008, "lon": -79.9993 }
      ],
      "tags": {
        "golf": "tee",
        "ref": "1"
      }
    },
    {
      "type": "way",
      "id": 9000000301,
      "nodes": [9100000301, 9100000302, 9100000303, 9100000304, 9100000301],
      "geometry": [
        { "lat": 35.0020, "lon": -79.9982 },
        { "lat": 35.0056, "lon": -79.9960 },
        { "lat": 35.0052, "lon": -79.9951 },
        { "lat": 35.0018, "lon": -79.9973 },
        { "lat": 35.0020, "lon": -79.9982 }
      ],
      "tags": {
        "golf": "fairway",
        "ref": "1"
      }
    },
    {
      "type": "way",
      "id": 9000000401,
      "nodes": [9100000401, 9100000402, 9100000403, 9100000404, 9100000401],
      "geometry": [
        { "lat": 35.0065, "lon": -79.9945 },
        { "lat": 35.0073, "lon": -79.9942 },
        { "lat": 35.0071, "lon": -79.9935 },
        { "lat": 35.0064, "lon": -79.9937 },
        { "lat": 35.0065, "lon": -79.9945 }
      ],
      "tags": {
        "golf": "green",
        "ref": "1"
      }
    },
    {
      "type": "way",
      "id": 9000000501,
      "nodes": [9100000501, 9100000502, 9100000503, 9100000504, 9100000501],
      "geometry": [
        { "lat": 35.0058, "lon": -79.9948 },
        { "lat": 35.0061, "lon": -79.9947 },
        { "lat": 35.0060, "lon": -79.9943 },
        { "lat": 35.0057, "lon": -79.9944 },
        { "lat": 35.0058, "lon": -79.9948 }
      ],
      "tags": {
        "golf": "bunker"
      }
    },
    {
      "type": "way",
      "id": 9000000601,
      "nodes": [9100000601, 9100000602, 9100000603, 9100000604, 9100000601],
      "geometry": [
        { "lat": 35.0035, "lon": -79.9952 },
        { "lat": 35.0043, "lon": -79.9949 },
        { "lat": 35.0040, "lon": -79.9940 },
        { "lat": 35.0033, "lon": -79.9944 },
        { "lat": 35.0035, "lon": -79.9952 }
      ],
      "tags": {
        "natural": "water",
        "water": "pond"
      }
    },
    {
      "type": "way",
      "id": 9000000701,
      "nodes": [9100000701, 9100000702, 9100000703, 9100000704, 9100000701],
      "geometry": [
        { "lat": 35.0048, "lon": -79.9964 },
        { "lat": 35.0051, "lon": -79.9962 },
        { "lat": 35.0049, "lon": -79.9958 },
        { "lat": 35.0046, "lon": -79.9960 },
        { "lat": 35.0048, "lon": -79.9964 }
      ],
      "tags": {
        "golf": "water_hazard",
        "ref": "1"
      }
    },
    {
      "type": "way",
      "id": 9000000801,
      "nodes": [9100000801, 9100000802, 9100000803, 9100000804, 9100000801],
      "geometry": [
        { "lat": 35.0027, "lon": -79.9956 },
        { "lat": 35.0034, "lon": -79.9955 },
        { "lat": 35.0033, "lon": -79.9948 },
        { "lat": 35.0026, "lon": -79.9950 },
        { "lat": 35.0027, "lon": -79.9956 }
      ],
      "tags": {
        "natural": "wood"
      }
    }
  ]
}
`````

### src/course.ts

`````typescript
export type Coordinate = readonly number[];

export interface SampleCourse {
  name: string;
  synthetic: boolean;
  coordinateSystem: string;
  source: string;
  notice: string;
  center: Coordinate;
  holes: Array<{
    number: number;
    par: number;
    tee: Coordinate;
    green: Coordinate;
  }>;
}

export function summarizeCourse(sample: SampleCourse): string {
  const holeCount = sample.holes.length;
  const par = sample.holes.reduce((total, hole) => total + hole.par, 0);
  return `${holeCount} placeholder holes / par ${par}`;
}

export function isSyntheticCourse(sample: SampleCourse): boolean {
  const coordinates = [
    sample.center,
    ...sample.holes.flatMap((hole) => [hole.tee, hole.green])
  ];

  return (
    sample.synthetic === true &&
    sample.coordinateSystem === "local-normalized" &&
    coordinates.every(
      (coordinate) =>
        coordinate.length === 2 &&
        coordinate.every(
          (value) =>
            typeof value === "number" &&
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 100
        )
    )
  );
}
`````

### src/main.test.ts

`````typescript
import sampleCourse from "../fixtures/courses/sample-course.json";
import { isSyntheticCourse, summarizeCourse } from "./course";

describe("sample course scaffold", () => {
  it("summarizes the placeholder fixture deterministically", () => {
    expect(summarizeCourse(sampleCourse)).toBe("3 placeholder holes / par 12");
  });

  it("uses explicitly synthetic non-geographic coordinates", () => {
    expect(isSyntheticCourse(sampleCourse)).toBe(true);
  });

  it("rejects fixture coordinates outside the local normalized space", () => {
    const invalidCourse = structuredClone(sampleCourse);
    invalidCourse.center = [-122.08, 37.42];

    expect(isSyntheticCourse(invalidCourse)).toBe(false);
  });
});
`````

### src/App.tsx

`````typescript
import { useEffect, useRef, useState, type FormEvent } from "react";
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
  const requestIdentity = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const fieldRefs = useRef<Record<keyof Bbox, HTMLInputElement | null>>({
    south: null, west: null, north: null, east: null,
  });
  const courseNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    requestIdentity.current += 1;
    controller.current?.abort();
  }, []);

  const loading = state.kind === "loading";

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
            <ul className="raw-list">
              {state.response.elements.map((element) => <li key={`${element.type}-${element.id}`}><code>{element.type}/{element.id}</code> {elementName(element)}</li>)}
            </ul>
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
`````

### package.json

`````json
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
`````

### tsconfig.json

`````json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vitest/globals"],
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src", "test", "vite.config.ts", "playwright.config.ts"]
}
`````

### vite.config.ts

`````typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: false
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"]
  }
});
`````
```````

<!-- END AUDITED FILE 4/9: docs/handoffs/ctc-005-gemini-specification-prompt.md -->

<!-- BEGIN AUDITED FILE 5/9: docs/handoffs/ctc-005-gemini-specification-review.md -->

```````
# CTC-005 Gemini specification critical review

Date: 2026-06-07

## Review verdict

Gemini's response is useful as adversarial input but is not implementation-ready
as written. It identified relevant OSM/Overpass variability and the need for a
pure deterministic normalization boundary, source references, unassociated
features, and stable warnings. It also materially broadened scope and proposed
unsupported destructive inference.

The accepted and corrected decisions below are the specification baseline for
Claude adversarial QA planning. Claude must challenge them before CTC-005 can
move to implementation.

## Accepted decisions

- Implement CTC-005 as a pure deterministic transformation from the existing
  validated `OverpassResponse` plus `SourceMetadata` into a normalized model.
- Index the complete flat element array before classification; never depend on
  raw Overpass element order.
- Preserve original OSM element type, integer ID, original tags, source
  metadata, and raw geometry evidence needed for attribution/debugging.
- Represent features that cannot be deterministically associated with a hole
  as top-level unassociated features.
- Omit a classified feature from normalized geometry when required coordinates
  are missing or malformed, while preserving a source reference in a stable
  warning.
- Do not invent missing relation segments or stitch incomplete rings.
- Return deterministic structured warnings rather than logging side effects.
- Use only synthetic fixtures and Vitest unit tests for CTC-005.

## Rejected decisions

- Reject Turf.js, MapLibre GL JS, or any new dependency. Neither library exists
  in the repository, and rendering/spatial math adoption is outside CTC-005.
- Reject rendering priorities, z-indexes, visual occlusion rules, map behavior,
  PDF behavior, and parser-owned attribution display strings.
- Reject convex-hull fallback boundaries, area calculations, centroids,
  containment tests, nearest-neighbor association, the arbitrary 150-meter
  threshold, or any other computational spatial inference.
- Reject automatically closing open ways, discarding unresolved node
  references, healing truncated geometry, or treating partial relation members
  as independent polygons. These actions fabricate or destructively reinterpret
  source geometry.
- Reject multipolygon assembly and general relation geometry normalization in
  CTC-005. Unsupported relations must remain attributable through warnings and
  preserved source references.
- Reject choosing course boundaries or greens by largest area or number of
  intersecting features.
- Reject stripping non-numeric characters from hole refs. Values such as `9B`
  and `Hole 9` are not equivalent to the strict numeric ref `9`.
- Reject merging distinct `golf=hole` source entities that share a hole number.
  Preserve each source entity and report ambiguous ordering/conflict.
- Reject legacy cart-path translation, generic grass/heath expansion, dogleg
  semantics, pin/green spatial merging, and alternative-green inference.
- Reject real-course fixture names and coordinates. Fixtures must remain
  explicitly synthetic and invented.
- Reject splitting CTC-005 into new epics/user stories or unrelated roadmap
  tasks.

## Corrected specification baseline

### Pure API boundary

The likely public API is conceptually:

```typescript
normalizeGolfCourse(
  response: OverpassResponse,
  source: SourceMetadata,
): NormalizationResult
```

The function must not fetch, mutate input, access storage, log, render, or
perform provider/cache policy. `NormalizationResult` must preserve source
metadata and contain normalized course data plus a deterministically sorted
warning array. Exact type names remain reviewable by Claude, but all
collection-valued fields must be arrays, not the singular fields shown in
Gemini's malformed model.

### Raw validation boundary

`validateResponse` guarantees only:

- the response is an object with an `elements` array;
- every element is an object with `type` equal to `node`, `way`, or `relation`;
- every element has an integer `id`.

The normalizer must safely validate all tags and geometry fields it consumes.
It must not assume tags are strings, coordinates are finite/in-range, way
geometry aligns with `nodes`, or relation members are complete.

### Geometry support

- Node: support a point only when `lat` and `lon` are finite and within WGS84
  latitude/longitude ranges.
- Way: support a line only when every geometry coordinate is valid and at least
  two coordinates exist.
- Closed way: support a polygon only when every coordinate is valid, at least
  four coordinates exist, and first and last coordinates are exactly equal.
- Open or malformed area-classified ways: do not auto-close or downgrade into a
  misleading normalized area; omit normalized geometry and warn.
- Relation: preserve source identity/tags but do not normalize relation geometry
  or assemble multipolygons in CTC-005; emit an unsupported-relation warning
  when the relation classifies as a relevant feature/course.
- Preserve raw node-reference IDs and raw geometry coordinates from supported
  source entities as source evidence; do not silently discard mismatches.

Use named `{ lat, lon }` coordinates to prevent accidental GeoJSON `[lon, lat]`
confusion unless Claude identifies a downstream reason to choose differently.

### Classification

Classification is based only on exact consumed tag strings from the reviewed
CTC-015 detail query:

- course boundary: `leisure=golf_course`
- hole route/metadata: `golf=hole`
- primary features: `golf=tee|green|fairway|bunker|rough`
- golf-specific water:
  `golf=water_hazard|lateral_water_hazard`
- generic water: relevant `natural=water`, `water=*`, `waterway=*`, and
  `landuse=reservoir|basin`
- vegetation: relevant
  `natural=wood|tree|tree_row|scrub` and `landuse=forest`

Preserve golf-specific water versus generic water and the original
classification tags. Each relevant entity receives exactly one classification
using this precedence from highest to lowest:

1. `golf=hole`
2. `golf=tee|green|fairway|bunker|rough`
3. `golf=water_hazard|lateral_water_hazard`
4. `leisure=golf_course`
5. generic water: relevant `natural=water`, `waterway=*`, `water=*`, and
   `landuse=reservoir|basin`
6. vegetation: relevant `natural=wood|tree|tree_row|scrub` and
   `landuse=forest`

Record the winning exact tag pair as `classifiedBy` and preserve every original
tag. Unknown/non-relevant entities, including queried
`golf=out_of_bounds|pin|cartpath`, are ignored silently.

### Course and hole rules

- A stable source key is `${type}/${id}`.
- Do not deduplicate entities solely by numeric ID because IDs are scoped by
  OSM entity type.
- Any repeated source key is a conflict and emits one `DUPLICATE_SOURCE_KEY`
  warning. Select a deterministic winner by comparing a canonical structural
  serialization of the complete records lexicographically; do not use
  first-seen order because normalized output must remain invariant when input
  elements are shuffled. Preserve all conflicting source refs in the warning.
- Recognize a hole number only when a string `ref`, after trimming, matches
  `/^[1-9][0-9]*$/` exactly. Leading zeros, signs, embedded spaces, decimal
  points, and non-digit characters are non-numeric. Do not strip characters or
  infer from `name`.
- Sort unambiguous numbered holes numerically, with stable source-key tie
  ordering. Preserve non-numeric/unidentified holes after numbered holes in
  source-key order.
- Duplicate numeric refs make hole ordering ambiguous. A mix of identified
  numeric holes and unidentified/non-numeric holes also emits
  `AMBIGUOUS_HOLE_ORDER`. Numeric gaps alone do not imply ambiguity. Distinct
  source hole entities remain distinct.
- Parse optional `par` only as a strict valid positive integer; malformed values
  remain preserved in original tags and generate a warning rather than being
  coerced.

### Feature-to-hole association

- Associate only when a feature has a strict numeric `ref` matching exactly one
  unambiguous numbered hole.
- A feature ref matching zero or multiple holes remains unassociated and emits
  an appropriate warning.
- Features without a usable ref remain unassociated without spatial inference.
  Unreferenced non-required features are silent. A numeric feature ref matching
  zero or multiple holes emits `AMBIGUOUS_FEATURE_REF`. Missing refs on tees and
  greens are represented through hole-level `MISSING_TEE` and `MISSING_GREEN`
  warnings rather than an additional feature warning.
- Golf-specific water hazards participate in the same strict ref association
  rule as other classified features. Generic water and vegetation without a
  usable matching ref remain unassociated.
- Relation-membership association is deferred with relation normalization.

### Required warnings

At minimum define stable machine-readable codes for:

- missing tee for each identified hole;
- missing green for each identified hole;
- ambiguous hole ordering;
- duplicate/conflicting source key;
- malformed or missing relevant geometry;
- unsupported relevant relation geometry;
- malformed consumed tags;
- ambiguous feature-to-hole ref;
- missing or multiple course candidates.

Warnings use only `error` and `warning` severities. `error` applies to
structurally incomplete or unreliable normalized output:
`MISSING_TEE`, `MISSING_GREEN`, `MISSING_OR_MALFORMED_GEOMETRY`,
`DUPLICATE_SOURCE_KEY`, and `ZERO_COURSE_CANDIDATES`. `warning` applies to
`AMBIGUOUS_HOLE_ORDER`, `MULTIPLE_COURSE_CANDIDATES`,
`MALFORMED_CONSUMED_TAG`, `AMBIGUOUS_FEATURE_REF`, and
`UNSUPPORTED_RELATION`.

Emit exactly one warning per unique `(code, affected identity)` tuple. A
duplicate-source warning covers every conflicting record for that source key.
Sort warnings by `code` ascending, then numeric hole identity ascending with
non-numeric/absent identities after numeric identities, then source key
lexicographically. Severity is not a sort key.

### Course candidate handling

Do not compute area, spatial containment, or select a primary course. Expose
all unique `leisure=golf_course` candidates in deterministic order: valid
closed-way candidates before unsupported relation candidates before other
candidates, then source key lexicographically. Emit `ZERO_COURSE_CANDIDATES`
when empty and `MULTIPLE_COURSE_CANDIDATES` when more than one unique candidate
remains after source-key conflict resolution. Active course selection belongs
downstream.

### Coordinate and source contract

Use `{ lat: number; lon: number }` as the canonical normalized coordinate type.
GeoJSON array coordinates are deferred. Every output record carries its stable
source key and original source identity/tags/evidence. Pass `SourceMetadata`
through verbatim without mutation or abbreviation. The normalizer must not
mutate, fetch, access browser globals/storage, render, log, or evaluate tag
values.

## Fixture and test baseline

Extend the existing complete synthetic fixture or add a purpose-specific
complete fixture that includes multiple out-of-order holes; all required
feature classes; explicit refs; and preserved source metadata, IDs, tags, node
references, and geometry evidence.

Add a separate explicitly synthetic incomplete/ambiguous fixture containing:

- a hole missing a tee and a hole missing a green;
- duplicate numeric hole refs, a non-numeric ref, and malformed `par`;
- relevant feature with missing/malformed geometry;
- relevant unsupported relation;
- unreferenced and ambiguously referenced features;
- duplicate/conflicting source-key records;
- zero or multiple course candidate coverage.

Tests must assert exact deterministic normalized output slices, preserved source
evidence, no input mutation, exact warning codes/order, and repeated-call
equality. No test may make a network request or depend on real-course data.

## Claude QA-planning red lines

Claude must treat these as blockers if the implementation plan allows them:

- fabricated/healed geometry or destructive loss of raw source evidence;
- spatial association or arbitrary thresholds;
- relation/multipolygon assembly;
- nondeterminism from input ordering or unstable sorting;
- numeric-ID-only identity collisions between node/way/relation;
- loose coercion of refs, pars, tags, or coordinates;
- missing required tee/green/ambiguous-order warnings;
- mutation, network/storage/logging/rendering side effects;
- new dependencies or scope from CTC-006/CTC-019/PDF behavior;
- real-course fixtures or prohibited reference-project reuse.

## Claude QA-planning disposition

Claude returned `READY WITH REQUIRED SPEC CORRECTIONS`. B-1 through B-4 and
Q1 through Q5 are incorporated above. Development is authorized after these
corrections are recorded.

Two Claude recommendations were corrected during critical review:

- Rejected first-seen conflict winners because they contradict the required
  shuffled-input determinism test. Canonical structural ordering selects the
  stable winner instead.
- A discarded duplicate course record does not also count toward
  `MULTIPLE_COURSE_CANDIDATES`; candidate count is evaluated after source-key
  conflict resolution.
```````

<!-- END AUDITED FILE 5/9: docs/handoffs/ctc-005-gemini-specification-review.md -->

<!-- BEGIN AUDITED FILE 6/9: fixtures/overpass/synthetic-golf-course-incomplete.json -->

```````
{
  "elements": [
    {
      "type": "way",
      "id": 9000001001,
      "geometry": [
        { "lat": 35, "lon": -80 },
        { "lat": 35.01, "lon": -80 },
        { "lat": 35.01, "lon": -79.99 },
        { "lat": 35, "lon": -79.99 },
        { "lat": 35, "lon": -80 }
      ],
      "tags": { "leisure": "golf_course", "name": "Synthetic Incomplete Course" }
    },
    {
      "type": "way",
      "id": 9000001101,
      "geometry": [{ "lat": 35.001, "lon": -79.999 }, { "lat": 35.007, "lon": -79.994 }],
      "tags": { "golf": "hole", "ref": "1", "par": "four" }
    },
    {
      "type": "way",
      "id": 9000001102,
      "geometry": [{ "lat": 35.002, "lon": -79.998 }, { "lat": 35.008, "lon": -79.993 }],
      "tags": { "golf": "hole", "ref": "1" }
    },
    {
      "type": "way",
      "id": 9000001103,
      "geometry": [{ "lat": 35.003, "lon": -79.997 }, { "lat": 35.009, "lon": -79.992 }],
      "tags": { "golf": "hole", "ref": "9B" }
    },
    {
      "type": "way",
      "id": 9000001201,
      "geometry": [{ "lat": 35.001, "lon": -79.999 }, { "lat": 35.002, "lon": -79.998 }],
      "tags": { "golf": "tee", "ref": "1" }
    },
    {
      "type": "relation",
      "id": 9000001301,
      "members": [],
      "tags": { "golf": "green", "ref": "1" }
    },
    {
      "type": "node",
      "id": 9000001401,
      "lat": 35.004,
      "lon": -79.996,
      "tags": { "golf": "bunker", "ref": "19" }
    },
    {
      "type": "node",
      "id": 9000001401,
      "lat": 35.005,
      "lon": -79.995,
      "tags": { "golf": "bunker", "ref": "19" }
    }
  ]
}
```````

<!-- END AUDITED FILE 6/9: fixtures/overpass/synthetic-golf-course-incomplete.json -->

<!-- BEGIN AUDITED FILE 7/9: sbom.json -->

```````
{
  "$schema": "http://cyclonedx.org/schema/bom-1.6.schema.json",
  "bomFormat": "CycloneDX",
  "specVersion": "1.6",
  "version": 1,
  "serialNumber": "urn:uuid:be1b6ac8-d087-41e8-a4a0-f8ae58179e9c",
  "metadata": {
    "timestamp": "2026-06-08T01:06:42.377Z",
    "tools": {
      "components": [
        {
          "type": "application",
          "name": "npm",
          "version": "11.16.0"
        },
        {
          "type": "application",
          "name": "cyclonedx-npm",
          "group": "@cyclonedx",
          "version": "2.1.0",
          "author": "Jan Kowalleck",
          "description": "Create CycloneDX Software Bill of Materials (SBOM) from NPM projects.",
          "licenses": [
            {
              "license": {
                "id": "Apache-2.0"
              }
            }
          ],
          "externalReferences": [
            {
              "url": "git+https://github.com/CycloneDX/cyclonedx-node-npm.git",
              "type": "vcs",
              "comment": "as detected from PackageJson property \"repository.url\""
            },
            {
              "url": "https://github.com/CycloneDX/cyclonedx-node-npm#readme",
              "type": "website",
              "comment": "as detected from PackageJson property \"homepage\""
            },
            {
              "url": "https://github.com/CycloneDX/cyclonedx-node-npm/issues",
              "type": "issue-tracker",
              "comment": "as detected from PackageJson property \"bugs.url\""
            }
          ]
        },
        {
          "type": "library",
          "name": "cyclonedx-library",
          "group": "@cyclonedx",
          "version": "7.1.0",
          "author": "Jan Kowalleck",
          "description": "Core functionality of CycloneDX for JavaScript (Node.js or WebBrowser).",
          "licenses": [
            {
              "license": {
                "id": "Apache-2.0"
              }
            }
          ],
          "externalReferences": [
            {
              "url": "git+https://github.com/CycloneDX/cyclonedx-javascript-library.git",
              "type": "vcs",
              "comment": "as detected from PackageJson property \"repository.url\""
            },
            {
              "url": "https://github.com/CycloneDX/cyclonedx-javascript-library#readme",
              "type": "website",
              "comment": "as detected from PackageJson property \"homepage\""
            },
            {
              "url": "https://github.com/CycloneDX/cyclonedx-javascript-library/issues",
              "type": "issue-tracker",
              "comment": "as detected from PackageJson property \"bugs.url\""
            }
          ]
        }
      ]
    },
    "component": {
      "type": "application",
      "name": "chart-the-course",
      "version": "0.0.0",
      "bom-ref": "chart-the-course@0.0.0",
      "description": "Browser-based yardage book and course layout generator.",
      "licenses": [
        {
          "license": {
            "id": "Apache-2.0",
            "acknowledgement": "declared"
          }
        }
      ],
      "purl": "pkg:npm/chart-the-course@0.0.0",
      "properties": [
        {
          "name": "cdx:npm:package:path",
          "value": ""
        },
        {
          "name": "cdx:npm:package:private",
          "value": "true"
        }
      ]
    }
  },
  "components": [
    {
      "type": "library",
      "name": "react-dom",
      "version": "19.2.7",
      "bom-ref": "react-dom@19.2.7",
      "description": "React package for working with the DOM.",
      "licenses": [
        {
          "license": {
            "id": "MIT",
            "acknowledgement": "declared"
          }
        }
      ],
      "purl": "pkg:npm/react-dom@19.2.7#packages/react-dom",
      "externalReferences": [
        {
          "url": "git+https://github.com/facebook/react.git#packages/react-dom",
          "type": "vcs",
          "comment": "as detected from PackageJson property \"repository.url\" and \"repository.directory\""
        },
        {
          "url": "https://react.dev/",
          "type": "website",
          "comment": "as detected from PackageJson property \"homepage\""
        },
        {
          "url": "https://github.com/facebook/react/issues",
          "type": "issue-tracker",
          "comment": "as detected from PackageJson property \"bugs.url\""
        },
        {
          "url": "https://registry.npmjs.org/react-dom/-/react-dom-19.2.7.tgz",
          "type": "distribution",
          "comment": "as detected from npm-ls property \"resolved\""
        }
      ],
      "properties": [
        {
          "name": "cdx:npm:package:path",
          "value": "node_modules/react-dom"
        }
      ]
    },
    {
      "type": "library",
      "name": "react",
      "version": "19.2.7",
      "bom-ref": "react@19.2.7",
      "description": "React is a JavaScript library for building user interfaces.",
      "licenses": [
        {
          "license": {
            "id": "MIT",
            "acknowledgement": "declared"
          }
        }
      ],
      "purl": "pkg:npm/react@19.2.7?vcs_url=git%2Bhttps%3A%2F%2Fgithub.com%2Ffacebook%2Freact.git#packages/react",
      "externalReferences": [
        {
          "url": "git+https://github.com/facebook/react.git#packages/react",
          "type": "vcs",
          "comment": "as detected from PackageJson property \"repository.url\" and \"repository.directory\""
        },
        {
          "url": "https://react.dev/",
          "type": "website",
          "comment": "as detected from PackageJson property \"homepage\""
        },
        {
          "url": "https://github.com/facebook/react/issues",
          "type": "issue-tracker",
          "comment": "as detected from PackageJson property \"bugs.url\""
        }
      ],
      "properties": [
        {
          "name": "cdx:npm:package:path",
          "value": "node_modules/react"
        }
      ]
    },
    {
      "type": "library",
      "name": "scheduler",
      "version": "0.27.0",
      "bom-ref": "scheduler@0.27.0",
      "description": "Cooperative scheduler for the browser environment.",
      "licenses": [
        {
          "license": {
            "id": "MIT",
            "acknowledgement": "declared"
          }
        }
      ],
      "purl": "pkg:npm/scheduler@0.27.0#packages/scheduler",
      "externalReferences": [
        {
          "url": "git+https://github.com/facebook/react.git#packages/scheduler",
          "type": "vcs",
          "comment": "as detected from PackageJson property \"repository.url\" and \"repository.directory\""
        },
        {
          "url": "https://react.dev/",
          "type": "website",
          "comment": "as detected from PackageJson property \"homepage\""
        },
        {
          "url": "https://github.com/facebook/react/issues",
          "type": "issue-tracker",
          "comment": "as detected from PackageJson property \"bugs.url\""
        },
        {
          "url": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
          "type": "distribution",
          "comment": "as detected from npm-ls property \"resolved\""
        }
      ],
      "properties": [
        {
          "name": "cdx:npm:package:path",
          "value": "node_modules/scheduler"
        }
      ]
    }
  ],
  "dependencies": [
    {
      "ref": "chart-the-course@0.0.0",
      "dependsOn": [
        "react-dom@19.2.7",
        "react@19.2.7"
      ]
    },
    {
      "ref": "react-dom@19.2.7",
      "dependsOn": [
        "react@19.2.7",
        "scheduler@0.27.0"
      ]
    },
    {
      "ref": "react@19.2.7"
    },
    {
      "ref": "scheduler@0.27.0"
    }
  ]
}
```````

<!-- END AUDITED FILE 7/9: sbom.json -->

<!-- BEGIN AUDITED FILE 8/9: src/normalize.test.ts -->

```````
import completeFixture from "../fixtures/overpass/synthetic-golf-course.json";
import incompleteFixture from "../fixtures/overpass/synthetic-golf-course-incomplete.json";
import { normalizeGolfCourse } from "./normalize";
import type { OverpassResponse, SourceMetadata } from "./overpass";

const source: SourceMetadata = {
  query: "synthetic detail query",
  endpoint: "https://example.invalid/overpass",
  completedAt: "2026-06-07T00:00:00Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: "https://www.openstreetmap.org/copyright",
};

function normalized(fixture: unknown) {
  return normalizeGolfCourse(fixture as OverpassResponse, source);
}

describe("normalizeGolfCourse complete synthetic fixture", () => {
  it("classifies, associates, and preserves source evidence", () => {
    const result = normalized(completeFixture);
    expect(result.source).toBe(source);
    expect(result.courseCandidates.map(({ source: record }) => record.sourceKey)).toEqual(["way/9000000001"]);
    expect(result.holes).toHaveLength(1);
    expect(result.holes[0].number).toBe(1);
    expect(result.holes[0].par).toBe(4);
    expect(result.holes[0].features.map(({ kind }) => kind)).toEqual([
      "tee", "fairway", "green", "golf-water",
    ]);
    expect(result.holes[0].features[0].source.rawNodes).toBeDefined();
    expect(result.unassociatedFeatures.map(({ kind }) => kind)).toEqual([
      "bunker", "generic-water", "vegetation",
    ]);
    expect(result.warnings).toEqual([]);
  });

  it("is invariant to element order and does not mutate frozen input", () => {
    const frozen = structuredClone(completeFixture) as OverpassResponse;
    for (const element of frozen.elements) {
      if (element.tags) Object.freeze(element.tags);
      if (Array.isArray(element.geometry)) Object.freeze(element.geometry);
      Object.freeze(element);
    }
    Object.freeze(frozen.elements);
    Object.freeze(frozen);

    const expected = normalizeGolfCourse(frozen, source);
    const shuffled = { ...completeFixture, elements: [...completeFixture.elements].reverse() } as OverpassResponse;
    expect(normalizeGolfCourse(shuffled, source)).toEqual(expected);
    expect(normalizeGolfCourse(frozen, source)).toEqual(expected);
  });
});

describe("normalizeGolfCourse incomplete synthetic fixture", () => {
  it("preserves ambiguity and reports deterministic warnings without healing", () => {
    const result = normalized(incompleteFixture);
    expect(result.holes.map(({ number }) => number)).toEqual([1, 1, null]);
    expect(result.holes.every(({ features }) => features.length === 0)).toBe(true);
    expect(result.unassociatedFeatures.map(({ source: record }) => record.sourceKey)).toEqual([
      "node/9000001401",
      "relation/9000001301",
    ]);
    expect(result.warnings.map(({ code }) => code)).toEqual([
      "AMBIGUOUS_FEATURE_REF",
      "AMBIGUOUS_FEATURE_REF",
      "AMBIGUOUS_HOLE_ORDER",
      "DUPLICATE_SOURCE_KEY",
      "MALFORMED_CONSUMED_TAG",
      "MISSING_GREEN",
      "MISSING_GREEN",
      "MISSING_OR_MALFORMED_GEOMETRY",
      "MISSING_TEE",
      "MISSING_TEE",
      "UNSUPPORTED_RELATION",
    ]);
    expect(result.warnings.filter(({ code }) => code === "DUPLICATE_SOURCE_KEY")).toHaveLength(1);
    expect(result.unassociatedFeatures.find(({ source: record }) => record.sourceKey === "relation/9000001301")?.geometry).toBeNull();
  });

  it("uses strict refs, exact classification precedence, and scoped IDs", () => {
    const fixture: OverpassResponse = {
      elements: [
        { type: "node", id: 42, lat: 35, lon: -80, tags: { golf: "water_hazard", natural: "water" } },
        { type: "way", id: 42, geometry: [{ lat: 35, lon: -80 }, { lat: 35.01, lon: -79.99 }], tags: { golf: "hole", ref: "01" } },
      ],
    };
    const result = normalizeGolfCourse(fixture, source);
    expect(result.holes[0].number).toBeNull();
    expect(result.unassociatedFeatures[0].kind).toBe("golf-water");
    expect(result.unassociatedFeatures[0].classifiedBy).toEqual(["golf", "water_hazard"]);
    expect(result.warnings.some(({ code }) => code === "DUPLICATE_SOURCE_KEY")).toBe(false);
  });

  it("parses rough and tree features when available", () => {
    const fixture: OverpassResponse = {
      elements: [
        {
          type: "way",
          id: 9000002001,
          geometry: [
            { lat: 35, lon: -80 },
            { lat: 35.001, lon: -80 },
            { lat: 35.001, lon: -79.999 },
            { lat: 35, lon: -80 },
          ],
          tags: { golf: "rough" },
        },
        { type: "node", id: 9000002002, lat: 35, lon: -80, tags: { natural: "tree" } },
      ],
    };
    const result = normalizeGolfCourse(fixture, source);
    expect(result.unassociatedFeatures.map(({ kind }) => kind)).toEqual(["vegetation", "rough"]);
  });
});
```````

<!-- END AUDITED FILE 8/9: src/normalize.test.ts -->

<!-- BEGIN AUDITED FILE 9/9: src/normalize.ts -->

```````
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
```````

<!-- END AUDITED FILE 9/9: src/normalize.ts -->
