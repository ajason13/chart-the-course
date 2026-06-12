# Chart the Course Context

Last updated: 2026-06-12

## Current Status

CTC-014 is in Spec Drafting - 2026-06-12. After CTC-007 integration, Codex
confirmed clean synchronized `main` at
`b8536b7dafdd4d793d70ae26763523a1295305e2`, confirmed CTC-007 remains
`5. Done`, and confirmed PR #5 remains merged as
`e0d9c8f5a92fbab91c76c402361b31e3af03e30a` with required CI successful.
Live Notion comparison confirmed CTC-014, CTC-008, CTC-020, and CTC-019 were
all Backlog before selection. CTC-014 is the highest-value unblocked
prerequisite because no reviewed PDF pipeline, dependency decision, font
policy, print-layout contract, or deterministic PDF regression strategy exists,
while CTC-006 and CTC-007 now supply native SVG geometry, measurement, targets,
and carry overlays suitable for its fixture-only experiment. CTC-008 remains
downstream because it would introduce broader PDF export behavior before the
pipeline decision and requires unresolved notes behavior. CTC-020 remains a
distinct downstream task coupled to the selected PDF workflow; raw GIS source
availability and visible full-URL OSM attribution remain release-blocking for
distributed/shared PDF export in the same release as CTC-008. CTC-019 remains
valuable independent Overpass cache/request-identity hardening and must not be
absorbed into PDF work. CTC-014 is runtime/research, not docs-only. Static
fixture text may satisfy the experiment's notes criterion, but no persistent
or user-authored notes model, production PDF behavior, production dependency,
font, remote asset, provider, account, server, durable cache, or external
user-data flow is authorized. CTC-014 moved to
`1. Spec Drafting (Gemini)`. Stop at the Gemini specification gate until the
response is critically reviewed and Claude adversarial QA planning is
completed and critically reviewed. The self-contained Gemini specification
prompt is at `docs/handoffs/ctc-014-gemini-specification-prompt.md`; its 27
embedded relevant repository files were verified byte-for-byte exact and its
SHA-256 is
`8752064f3b63f711c95c2c5e866264580397d4744bdb5af0c6dfa4cfdc0e91d2`.
Startup-gate verification passed: `npm run check` with scaffold policy, build,
41 Vitest tests, and 14 Playwright tests; `git diff --check`; and the canonical
compliance flow with allowed production licenses and 0 production
vulnerabilities.

CTC-007 passed final Claude audit with minor fixes resolved - 2026-06-12.
Codex selected CTC-007
after PR #4 merged CTC-006 into `main` as `52395ea`, the repository-memory
update was pushed as `cb640e1`, and clean synchronized `main` was confirmed.
The live CTC-007 and CTC-019 Notion tasks both remain Backlog with unchanged
acceptance criteria. CTC-007 is the highest-value unblocked dependency because
CTC-006 now supplies stable hole identity, projection/inverse projection,
geographic distance math, accessible pointer/keyboard interaction patterns,
and a responsive SVG surface needed by target markers and carry arcs. CTC-007
must preserve CTC-005 normalized OSM geometry and source evidence as immutable,
separate user-authored project data, and specify strict versioned local JSON
import/export before implementation. CTC-019 remains independent Overpass
cache/request-identity hardening and must not be absorbed into CTC-007. No
feature branch or runtime implementation is authorized until Gemini
specification review and Claude adversarial QA planning are completed and
critically reviewed. The self-contained Gemini specification prompt is at
`docs/handoffs/ctc-007-gemini-specification-prompt.md`; its 18 embedded
relevant repository files were verified byte-for-byte exact and its SHA-256 is
`cf1473a61d221faf79851d6543993c410eabdd03538824cdd57e6b4dc16089a9`.
Startup-gate verification passed: `npm run check` with scaffold policy, build,
30 Vitest tests, and 13 Playwright tests; `git diff --check`; and the canonical
compliance flow with 0 production vulnerabilities.
Gemini's proposed CTC-007 Deep Research plan was rejected before research
started because it replaced the concrete CTC-007 task with generic
product-management methods, AI-agent task formatting, Principal Product
Manager templates, Notion schemas, roadmaps, and architecture-documentation
guidance. No decisions from that plan are accepted and CTC-007 remains in
Spec Drafting. Submit
`docs/handoffs/ctc-007-gemini-plan-correction.md` as the pasted instruction
together with the attached self-contained specification prompt.
Gemini's first CTC-007 specification response was critically reviewed on
2026-06-11. It is relevant but not implementation-ready. Accepted fragments are
limited to browser-local explicit file exchange, explicit interaction modes,
all-or-nothing failed-import behavior, file-size validation, Blob/object-URL
export, accessible controls/live feedback, pure helper boundaries, and
network-isolated tests. The response was rejected where it replaced the
existing React SVG/Haversine contracts with Canvas/equirectangular math,
exported and trusted raw OSM data, omitted stable hole-keyed project ownership,
used malformed/unsafe schema and `any` migration patterns, or added notes,
colors, zoom/pan/rotation, dragging, automatic migrations, and unsupported
offline/performance claims. The corrected baseline is at
`docs/handoffs/ctc-007-gemini-specification-review.md`; the mandatory revision
prompt is at
`docs/handoffs/ctc-007-gemini-specification-revision-prompt.md`. CTC-007
remains in Spec Drafting and must not advance to Claude QA planning or
implementation until the revision is critically reviewed.
Gemini's mandatory CTC-007 revision was rejected in full on 2026-06-11. It
repeated the prohibited Zod dependency, `any`/spread migrations, automatic
migration, notes/colors/preferences, pan/drag/global settings, invented
contracts, new Earth radii, flat-plane distance truth, pixel math, unsafe OSM
trust, malformed examples, and unsupported accuracy/performance claims. It
also left the mandatory deterministic decisions unresolved while declaring
zero blockers. No decisions from the revision are accepted. The corrected
Codex baseline remains authoritative and CTC-007 moves to Claude adversarial
QA planning; implementation remains prohibited until Claude's findings are
critically reviewed. The self-contained Claude QA-planning bundle is at
`docs/handoffs/ctc-007-claude-qa-planning-prompt.md`; its 16 embedded relevant
repository files were verified byte-for-byte exact and its SHA-256 is
`5cc18c73fac708a0f998ad7c9b3e57c8e4db25b9a79334369c3861d6f426ceb4`.
Claude QA planning returned `READY WITH REQUIRED SPEC CORRECTIONS` on
2026-06-12. BF-1 through BF-8 and Decisions 1 through 10 are accepted with
consistency corrections recorded in
`docs/handoffs/ctc-007-spec-corrections.md`: separate target/carry ID
namespaces, explicit v1 duplicate-key limitation, a true 20-error cap,
all-or-failure 65-point carry sampling, corrected antimeridian rules, feasible
import confirmation/focus behavior, target-specific announcements, explicit
current-course identity, interactive SVG target semantics, dangling-origin
behavior, and deterministic-serialization scope. Development is authorized on
branch `ctc-007-targets-carry-project`; final Claude audit remains mandatory.
Implementation adds dependency-free strict v1 project validation and
serialization, memory-only hole-keyed user state, explicit local JSON
import/export, target add/reposition/label/delete/undo controls, tee/target
carry origins, 64-bearing geographic carry rings, clipped SVG overlays,
structured visible import/edit errors, and focused synthetic Vitest/Playwright
coverage. Existing normalized OSM evidence remains immutable and trusted only
from the loaded result. No Zod/new dependency, Canvas, pan/zoom/dragging,
notes/preferences, automatic migration, durable persistence, CTC-019 behavior,
PDF/rendered export, provider, API key, account, server, or external user-data
flow was added. Pre-audit verification passed: `npm run check` with scaffold
policy, build, 39 Vitest tests, and 14 Playwright tests; `git diff --check`;
and the canonical compliance flow with 0 production vulnerabilities.
Implementation commit `af93ee0` is the final-audit target. The self-contained
final Claude audit bundle is at
`docs/handoffs/ctc-007-claude-final-audit-prompt.md`; all 12 embedded relevant
repository files were generated from the audited commit with `git show`,
verified byte-for-byte exact, and the bundle SHA-256 is
`06cc7f4f0c6990332b0c8f0a3d5fc2e4e1cda0f5c89509ff64b4ef30b48ea2a1`.
Claude returned `PASS WITH MINOR FIXES` with no blockers and no re-audit
required. The confined fixes explicitly order serialized project properties,
render carry labels as yard-only settings, validate raw target/carry array
bounds before filtering invalid entries, restore deleted targets at their
original index, reuse named map-boundary constants, and defensively parse carry
origin values at the first separator. Focused tests cover serialization order,
raw array bounds, and the carry-label contract. Post-fix verification passed:
`npm run check` with scaffold policy, build, 41 Vitest tests, and 14 Playwright
tests; `git diff --check`; and the canonical compliance flow with 0 production
vulnerabilities. Claude authorized CTC-007 to move to Done after these fixes
without re-audit. Required CI passed and PR #5 merged CTC-007 into `main` as
`e0d9c8f5a92fbab91c76c402361b31e3af03e30a` on 2026-06-12. Local `main` was
clean and synchronized to the merge commit before this repository-memory
update.

CTC-006 is Done - 2026-06-11. Codex selected CTC-006
after confirming `main` is clean and synchronized at `3449748`, the live
CTC-006 and CTC-019 Notion tasks both remain Backlog with unchanged acceptance
criteria, CTC-005 is Done and supplies the normalized WGS84 geometry contract,
and CTC-018 selects blank/vector-only rendering with no third-party basemap
tiles by default. CTC-006 is the correct next dependency because selected-hole
rendering and two-point measurement now have normalized input and unlock later
map workflows. CTC-019 remains independent Overpass cache/request-policy
hardening and must not be absorbed into CTC-006. The self-contained Gemini
specification prompt is at
`docs/handoffs/ctc-006-gemini-specification-prompt.md`; its 13 embedded
relevant repository files were verified byte-for-byte exact and its SHA-256 is
`4b70fbda3decd646df805a36351e98f67a5020f3769b00fab485a1390e4eef2b`.
Startup-gate verification passed: `npm run check` with scaffold policy, build,
24 Vitest tests, and 12 Playwright tests; `git diff --check`; and the canonical
compliance flow with 0 production vulnerabilities.

Gemini's final CTC-006 revision was rejected on 2026-06-11. Despite the exact
mandatory correction prompt, it abandoned the required React SVG architecture
for layered Canvas/SVG/DOM rendering and reintroduced prohibited pan/zoom,
pin dragging/snapping, multi-touch gestures, localStorage preferences,
out-of-bounds styling, invented coordinate contracts, console logging,
Jest/Cypress tooling, and unsupported accuracy/performance claims. It also
failed to resolve the requested logical viewBox, minimum extent, warning
matching, exact CTC-005 fixture contract, and deterministic keyboard behavior.
No decisions from the final revision were accepted. The authoritative baseline
remains `docs/handoffs/ctc-006-gemini-specification-review.md`. The
self-contained Claude QA-planning bundle is at
`docs/handoffs/ctc-006-claude-qa-planning-prompt.md`; its 12 embedded relevant
repository files were verified byte-for-byte exact and its SHA-256 is
`1d4d40adce5601c83c5d1cb1837b4c51d6a1456a3740d5f86a40d6f9e62d2cd0`.
Do not create a feature branch or implement runtime code until Claude QA
planning is critically reviewed.

Claude QA planning returned `READY WITH REQUIRED SPEC CORRECTIONS` on
2026-06-11. B-1 through B-7 were recorded in
`docs/handoffs/ctc-006-gemini-specification-review.md`. Codex corrected two
internally inconsistent recommendations before development: the circular
minimum-extent algorithm was replaced with a fixed display-only 20-meter
minimum per axis, and the finite nice-scale sequence with an overflowing
fallback was replaced by a generated 1/2/5 sequence that always fits within
40% of the inner logical viewport. Development is authorized on branch
`ctc-006-selected-hole-map`; final Claude audit remains mandatory.
Implementation adds dependency-free local equirectangular projection,
Haversine yards/meters measurement, deterministic scale indication, a native
React SVG selected-hole map, pointer and keyboard controls, structured warning
display, a CTC-006 all-layers synthetic fixture, and focused Vitest/Playwright
coverage. Unassociated features remain excluded, existing CTC-005 fixtures are
unchanged, and no provider, basemap, persistence, export, cache policy, or new
dependency was added.
Pre-audit verification passed: `npm run check` with scaffold policy, build, 30
Vitest tests, and 13 Playwright tests; `git diff --check`; and the canonical
compliance flow with 0 production vulnerabilities.
Implementation commit `ca1656b` is the final-audit target. The self-contained
final Claude audit bundle is at
`docs/handoffs/ctc-006-claude-final-audit-prompt.md`; all 13 changed files were
generated from the audited commit with `git show`, verified byte-for-byte
exact, and the bundle SHA-256 is
`00fe0f0ade2bbb2d05d49976fc5c727492871913d92a4ab60e42b1e2d2efcaac`.
Claude final audit returned `PASS WITH MINOR FIXES` with no blockers and
authorized Done after confined fixes without re-audit. MF-1 was confirmed
already satisfied: every area feature in the committed CTC-006 fixture has at
least four coordinates and closes with its final coordinate equal to its
first, matching `normalize.ts`. MF-2 changed the defensive scale-bar fallback
to a one-meter nice value. MF-3 added the established contract, copyright,
bbox, and query-purpose governance metadata to the CTC-006 fixture. Post-fix
verification passed: `npm run check` with scaffold policy, build, 30 Vitest
tests, and 13 Playwright tests; `git diff --check`; and the canonical
compliance flow with 0 production vulnerabilities.
PR #4 passed required CI and merged into `main` as `52395ea` on 2026-06-11.
Notion records the merged PR, audited implementation and fix commits, final
Claude verdict, and Done status.

Gemini's first CTC-006 response was rejected on 2026-06-10 because it ignored
the supplied CTC-006 prompt and replaced the selected-hole rendering task with
an unapproved Fastify/Redis geohash caching proxy and multi-quarter enterprise
infrastructure roadmap. It did not resolve CTC-006 rendering, projection,
measurement, scale-indicator, selected-hole interaction, responsive,
accessibility, or geometry-tolerance decisions. It also proposed out-of-scope
CTC-019 and unrelated work including Redis, geohash tiling, stale-while-
revalidate, distributed locks, upstream aggregation/backoff/failover, XML
normalization, PostGIS, MCP, OIDC/SPIRE, KG-TRACES/PyTorch, new dependencies,
epics, agent workflows, and performance targets unsupported by the repository.
The response is not a CTC-006 specification baseline and does not advance the
gate. The exact replacement instruction is at
`docs/handoffs/ctc-006-gemini-plan-correction.md`. Keep CTC-006 in
`1. Spec Drafting (Gemini)` and resubmit the correction together with the
original self-contained CTC-006 prompt.

Gemini's corrected CTC-006 response was critically reviewed on 2026-06-11. It
correctly selected dependency-free native React SVG, preserved geographic
coordinates for measurement, proposed latitude-aware projection, chose
geodesic two-point distance, and addressed pointer/touch/keyboard, responsive,
attribution, and synthetic-test concerns. The response was not accepted as
written because it invented normalized types and fixture shapes, rendered
unassociated features as selected-hole fallbacks, proposed incorrect antipodal
handling, and left projection, scale-bar, warning, interaction, and
accessibility rules insufficiently precise. The corrected specification
baseline is at `docs/handoffs/ctc-006-gemini-specification-review.md`. At the
maintainer's direction, Gemini receives one final revision opportunity before
Claude QA planning. The exact revision prompt is at
`docs/handoffs/ctc-006-gemini-specification-revision-prompt.md`. CTC-006 must
remain out of implementation until the final Gemini revision is critically
reviewed and Claude adversarial QA planning is completed and critically
reviewed.

CTC-005 is Done - 2026-06-07. Codex selected CTC-005
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
dependency was added. Verification passed before audit: `npm run check` with
scaffold policy, build, 22 Vitest tests, and 12 Playwright tests;
`git diff --check`; and `npm_config_cache=/private/tmp/chart-the-course-npm-cache
scripts/compliance.sh` with 0 production vulnerabilities. Claude final audit
returned `PASS WITH MINOR FIXES` with no blockers and authorized Done after two
test-only additions without re-audit. MF-1 added explicit
`ZERO_COURSE_CANDIDATES` coverage. MF-2 added explicit
`MULTIPLE_COURSE_CANDIDATES` coverage for two distinct unique candidates. No
normalization logic, fixture, dependency, or scope changed. Post-fix
verification passed: `npm run check` with scaffold policy, build, 24 Vitest
tests, and 12 Playwright tests; `git diff --check`; and the canonical compliance
flow with 0 production vulnerabilities. CTC-006 rendering and CTC-019 durable
cache/request policy remain downstream.
PR #3 passed required CI and merged into `main` as `a624fec` on 2026-06-07.
Notion records the merged PR, implementation commit, audit-fix commit, final
Claude verdict, and Done status.

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

- Start from clean synchronized `main` and use
  `docs/handoffs/next-codex-task-startup-prompt.md` to select the next task
  against live Notion evidence.
- CTC-014 is the leading candidate because no PDF pipeline, library,
  dependency, font, or visual-regression decision exists. Verify this
  critically against CTC-008, CTC-020, and CTC-019 before selection.
- Do not ship CTC-008 PDF behavior without CTC-020 raw GIS source availability
  in the same release. Resolve CTC-008's notes criterion without silently
  reopening the notes model that CTC-007 deferred.
- Keep CTC-019 durable cache/request policy separate from PDF pipeline work.
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
