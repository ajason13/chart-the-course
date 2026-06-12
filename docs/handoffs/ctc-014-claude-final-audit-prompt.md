# CTC-014 Claude final audit handoff

## Role and stage

Act as final auditor for CTC-014, Evaluate vector PDF export pipeline. Audit commit `fc99982` on branch `ctc-014-pdf-evaluation`. This bundle was generated from the audited commit using `git show fc99982:path`. Claude Chat has no filesystem or GitHub access.

## Acceptance criteria

- Compare pdfkit, jsPDF, and SVG/canvas-to-PDF approaches for browser compatibility, vector output, file size, fonts, and print precision.
- Produce one fixture hole page with map geometry, yardage markers, and notes.
- Define visual regression strategy for PDF output.
- Recommend final library with license and maintenance assessment.

## Binding boundaries

This is an isolated fixture-only evaluation. It does not authorize a production PDF dependency, production export UI, persistent notes model, remote assets, network upload, provider, server, account, real-course fixture, or CTC-020 implementation. PDFs containing OSM-derived geometry require visible searchable attribution and the full printed URL. Distributed/shared PDF export under CTC-008 cannot ship without CTC-020 raw GIS source availability in the same release. Original code remains Apache-2.0; no AGPL or unlicensed reference-project reuse is allowed.

## Implementation and recommendation

The commit adds a pure typed export-scene model derived from existing synthetic normalized geometry and fixed CTC-007 target/carry state, an isolated multi-entry browser experiment, direct jsPDF and SVG-to-jsPDF paths, PDFKit controls, local PDF.js structural inspection, focused Vitest/Playwright coverage, and a measured decision record. It recommends direct `jspdf@4.2.1` drawing for a later production-adoption review. The SVG-to-jsPDF path also passes. Both tested PDFKit paths fail in the current Vite browser runtime because `blob-stream` requires Node-style `global`; Canvas is rejected as a vector-success path.

## Verification evidence

- `npm run check`: passed scaffold policy, build, 44 Vitest tests, and 15 Playwright tests.
- Focused PDF evidence: direct jsPDF 9,739 bytes / 12 path ops / 0 image ops; SVG-to-jsPDF 10,524 bytes / 13 path ops / 0 image ops; required searchable text including ©, scale text, and full OSM URL present; one 612 x 792 point page; direct path structurally stable across five runs; external requests blocked.
- `git diff --check`: passed after the audited commit.
- `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`: passed canonical production license checks and production audit with 0 vulnerabilities.
- Dev-inclusive license summary has no GPL, AGPL, or UNLICENSED result. Dev-inclusive audit has 9 pre-existing findings, all through `@cyclonedx/cyclonedx-npm@2.1.0`, not the newly installed PDF experiment packages.

## Required audit focus

1. Challenge whether the pure export scene faithfully represents current normalized point/line/polygon geometry, source identities, target/carry overlays, dash distinctions, scale, notes, disclaimer, and attribution without DOM scraping or mutable source geometry.
2. Challenge vector-preservation evidence, PDF.js operator/text inspection, five-run stability, page sizing/layout, © handling, scale-bar regression coverage, and any unsupported claim in the decision record.
3. Challenge browser isolation, forbidden/unsafe PDF APIs, remote/network behavior, dynamic PDFKit failure attribution, and whether any experiment code leaks into the production app path.
4. Challenge the direct-jsPDF recommendation against measured browser compatibility, PDF size, dependency/maintenance/license/security evidence, SVG alternative results, and unmeasured visual-regression limitations.
5. Verify CTC-008/CTC-020 release gates, visible full-URL OSM attribution, static-note boundary, exact dependency pins, production-vs-dev compliance distinction, and retained project guardrails.
6. Identify blockers, scope leakage, missing tests, misleading evidence, or minimal confined fixes needed before CTC-014 may be marked Done.

## Required verdict

Return `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`. Separate blockers from minor fixes, distinguish future production-adoption work from CTC-014 defects, and state whether CTC-014 may be marked Done after any confined fixes.

## Audited-file manifest

- `CONTEXT.md`
- `ctc014.html`
- `docs/experiments/ctc-014-vector-pdf-evaluation.md`
- `docs/handoffs/ctc-014-spec-corrections.md`
- `package-lock.json`
- `package.json`
- `src/ctc014-modules.d.ts`
- `src/ctc014-window.d.ts`
- `src/ctc014Experiment.ts`
- `src/ctc014Main.ts`
- `src/ctc014Scene.test.ts`
- `src/ctc014Scene.ts`
- `test/e2e/ctc014-pdf.spec.ts`
- `vite.config.ts`

## Exact audited file contents

<!-- BEGIN AUDITED FILE 1/14: CONTEXT.md -->

### CONTEXT.md

`````text
# Chart the Course Context

Last updated: 2026-06-12

## Current Status

CTC-014 is in Development pending final Claude audit - 2026-06-12. After CTC-007 integration, Codex
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
Gemini's proposed CTC-014 Deep Research plan was rejected before research
started because it replaced the concrete vector PDF pipeline evaluation with a
generic open-source product-management playbook covering prioritization,
roadmaps, community governance, epics/user stories, AI-agent task formats,
Notion templates/database schemas, generic application risks, telemetry, and
execution-process guidance. It did not plan the required current-primary-source
comparison of pdfkit, jsPDF, and SVG/canvas-to-PDF approaches; fixture hole
page; vector/font/print decisions; deterministic PDF regression strategy; or
license/maintenance recommendation. No decisions from that plan are accepted
and CTC-014 remains in Spec Drafting. Submit
`docs/handoffs/ctc-014-gemini-plan-correction.md` as the pasted instruction
together with the attached self-contained specification prompt.
Gemini's CTC-014 specification response was critically reviewed on 2026-06-12.
It is relevant but not implementation-ready. Accepted direction is limited to
browser-local generation, `jspdf@4.2.1` plus `svg2pdf.js@2.7.0` as the leading
experiment hypothesis, current `pdfkit@0.19.1` plus
`svg-to-pdfkit@0.1.8` as the required fallback comparison, Canvas as a negative
control, static fixture notes, visible full-URL OSM attribution, layered
structural/rendered regression evidence, and dependency compliance gates. The
response was corrected where it used outdated PDFKit, invented malformed
fixtures/types/paths, unmeasured bundle figures, overstated SVG/font support,
destructive sanitization, unsafe or irrelevant APIs, brittle binary/vector/
visual tests, immediate URL revocation, and an incorrect claim that CTC-008
cannot merge rather than cannot ship alone. The authoritative corrected
baseline is `docs/handoffs/ctc-014-gemini-specification-review.md`. CTC-014
moves to Claude adversarial QA planning; no feature branch, dependency
installation, experiment implementation, or production PDF behavior is
authorized until Claude's findings are critically reviewed. The self-contained
Claude QA-planning bundle is at
`docs/handoffs/ctc-014-claude-qa-planning-prompt.md`; its 20 embedded relevant
repository files were verified byte-for-byte exact and its SHA-256 is
`54dd2c3ae2f3a88dc13a4286bd71200d16fffc79682ed015c3f415622a5a125a`.
QA-handoff verification passed: `npm run check` with scaffold policy, build,
41 Vitest tests, and 14 Playwright tests; `git diff --check`; and the canonical
compliance flow with allowed production licenses and 0 production
vulnerabilities.
Claude QA planning returned `READY WITH REQUIRED SPEC CORRECTIONS` on
2026-06-12. Findings B-1 through B-6 and the experiment-oriented intent of
Decisions 1 through 12 are accepted with consistency and feasibility
corrections recorded in `docs/handoffs/ctc-014-spec-corrections.md`.
Corrections include separate course/hole source identity, all normalized
geometry variants, required non-color dash distinctions, rejection of
`pdf-lib` as an unproven preselected inspector, combined scene/operator/render
vector evidence, reproducible retained devDependencies, explicit dev/full-tree
license and vulnerability checks, exact named layout constants, tested font
glyph behavior, deterministic renderer requirements, narrow visual tolerance,
and established object-URL cleanup. Development is authorized on branch
`ctc-014-pdf-evaluation` for one isolated fixture experiment. No production
dependency, production PDF UI, CTC-020 implementation, persistent notes model,
or external user-data flow is authorized. Final Claude audit remains
mandatory.
The isolated CTC-014 fixture experiment is implemented on branch
`ctc-014-pdf-evaluation`. The pure export scene uses current normalized
geometry, projection, carry, and project contracts without DOM scraping or
production-app imports. Network-isolated Playwright evidence shows direct
`jspdf@4.2.1` and `jspdf@4.2.1` plus `svg2pdf.js@2.7.0` each produce one
612-by-792-point vector PDF with searchable required text, the © glyph, full
OSM URL, scale bar, and zero raster-image operations. Direct jsPDF produced
9,739 bytes; SVG translation produced 10,524 bytes. Both tested PDFKit paths
failed in the browser because `blob-stream@0.1.3` requires Node-style `global`;
Vite also externalized Node runtime modules. The evidence-based recommendation
is direct jsPDF drawing from the typed export scene for a later production
adoption review. Full results, compliance distinctions, visual-regression
strategy, and retained CTC-008/CTC-020 gates are in
`docs/experiments/ctc-014-vector-pdf-evaluation.md`. No production dependency
or PDF export UI is authorized. Prepare the self-contained final Claude audit
handoff after full verification.

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
- CTC-014 is in final-audit preparation. Do not adopt direct jsPDF as a
  production dependency or ship PDF export until Claude accepts the evaluation
  and a separate reviewed production-adoption scope is approved.
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
`````

<!-- END AUDITED FILE 1/14: CONTEXT.md -->

<!-- BEGIN AUDITED FILE 2/14: ctc014.html -->

### ctc014.html

`````text
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CTC-014 PDF experiment</title>
  </head>
  <body>
    <main>
      <h1>CTC-014 isolated PDF experiment</h1>
      <p>No production export control is provided by this experiment.</p>
    </main>
    <script type="module" src="/src/ctc014Main.ts"></script>
  </body>
</html>
`````

<!-- END AUDITED FILE 2/14: ctc014.html -->

<!-- BEGIN AUDITED FILE 3/14: docs/experiments/ctc-014-vector-pdf-evaluation.md -->

### docs/experiments/ctc-014-vector-pdf-evaluation.md

`````text
# CTC-014 vector PDF evaluation

Date: 2026-06-12

## Decision

Recommend direct drawing with `jspdf@4.2.1` for a later production-adoption
review. The typed export scene is the rendering contract; production code must
not scrape `HoleMap` DOM. `svg2pdf.js@2.7.0` remains a viable translation
option if a later task proves that maintaining direct primitive mapping is more
costly than its extra dependency and SVG-compatibility risk.

Do not recommend the tested PDFKit paths. Both `pdfkit@0.19.1` direct drawing
and `svg-to-pdfkit@0.1.8` translation failed in the current Vite browser build
because `blob-stream@0.1.3` requires the unavailable Node-style `global`
object. Vite also externalized Node `stream`, `zlib`, `fs`, `util`, `assert`,
and `buffer` imports. Adding browser polyfills was not authorized and would
increase complexity and bundle size. `svg-to-pdfkit` also fails the maintenance
recommendation gate.

This decision does not adopt a production dependency or ship PDF export.
CTC-008 remains blocked from release until CTC-020 raw GIS source availability
ships in the same release. CTC-014 uses static fixture text only and does not
add a persistent notes model.

## Fixture experiment

The isolated `/ctc014.html` entry constructs a pure export scene from
`fixtures/overpass/synthetic-golf-course-ctc006.json`, normalized hole
`way/9000060101`, course `way/9000060001`, tee `way/9000060201`, one fixed
target, and one fixed 150-yard tee carry.

The one-page fixture is US Letter portrait, 612 by 792 points, with 36-point
margins. It contains projected point, line, and polygon geometry; required
dash distinctions; route, target, carry, scale bar, yardage row, static note,
disclaimer, visible attribution, and the full printed URL
`https://www.openstreetmap.org/copyright`. It makes no network requests and
imports no production app entry.

## Measured results

| Candidate | Browser result | PDF bytes | Pages / box | Searchable required text | Vector / raster evidence |
| --- | --- | ---: | --- | --- | --- |
| `jspdf@4.2.1` direct draw | Pass | 9,739 | 1 / 612 x 792 pt | Pass, including © and scale bar | 12 PDF.js path operations; 0 image operations |
| `jspdf@4.2.1` + `svg2pdf.js@2.7.0` | Pass | 10,524 | 1 / 612 x 792 pt | Pass, including © and scale bar | 13 PDF.js path operations; 0 image operations |
| `pdfkit@0.19.1` direct draw | Fail | Not produced | Not produced | Not measured | Browser runtime error: `global is not defined` |
| `pdfkit@0.19.1` + `svg-to-pdfkit@0.1.8` | Fail | Not produced | Not produced | Not measured | Browser runtime error: `global is not defined` |
| Canvas/raster | Rejected control | Not measured | Not measured | Not acceptable | Fails vector requirement by definition |
| Browser print-to-PDF | Deferred control | Not measured | Not measured | Browser-dependent | Not a recommended project-controlled pipeline |

The direct jsPDF structural result was stable across five consecutive runs:
page count, page box, extracted text, path-operation count, and image-operation
count were identical. The focused Playwright test blocks all non-localhost
requests. PDF.js inspection uses a locally bundled worker.

The initial SVG experiment silently omitted the scale bar. The test caught the
drop; the SVG scene was corrected and the final result includes searchable
scale text plus a vector line. This demonstrates why export-scene fidelity and
structural assertions are both required.

## Build and dependency evidence

The clean production app baseline was approximately 237.06 kB minified and
74.88 kB gzip. With the isolated experiment retained, the production app entry
remains separate at 226.77 kB minified and 71.59 kB gzip. The isolated
experiment adds:

- experiment entry: 919.02 kB minified, 283.20 kB gzip;
- dynamically loaded PDFKit chunk: 559.69 kB minified, 218.68 kB gzip;
- local PDF.js worker: 1,245.44 kB.

These combined-build figures are not per-candidate production bundle claims.
They demonstrate that the experiment is isolated and that PDFKit plus PDF.js
inspection impose substantial research-only weight.

| Exact package | License | npm unpacked size | Registry modified |
| --- | --- | ---: | --- |
| `jspdf@4.2.1` | MIT | 30,192,058 bytes | 2026-03-17 |
| `svg2pdf.js@2.7.0` | MIT | 2,565,202 bytes | 2026-01-03 |
| `pdfkit@0.19.1` | MIT | 8,433,024 bytes | 2026-06-10 |
| `svg-to-pdfkit@0.1.8` | MIT | 4,200,055 bytes | 2022-06-27 |
| `pdfjs-dist@6.0.227` | Apache-2.0 | 35,550,455 bytes | 2026-05-30 |
| `blob-stream@0.1.3` | MIT | Not reported | 2022-06-13 |

All experiment packages are exact-pinned devDependencies. No PDF package is a
production dependency. The full installed license summary contains MIT, ISC,
Apache-2.0, BSD, MPL-2.0, BlueOak-1.0.0, CC0-1.0, CC-BY-3.0, Zlib, and 0BSD
expressions; it contains no GPL, AGPL, or UNLICENSED result. The canonical
production allowlist remains unchanged and passes.

`npm audit --omit=dev --audit-level=high` reports zero production
vulnerabilities. The dev-inclusive audit reports nine existing findings: two
moderate, four high, and three critical. Every reported path is through the
pre-existing `@cyclonedx/cyclonedx-npm@2.1.0` toolchain, not a newly installed
PDF candidate. Upgrading that tool remains separately recorded future work.

## Visual regression strategy

Production PDF work should use three layers:

1. Pure export-scene assertions for stable source identities, layer counts,
   layout bounds, non-color distinctions, and required text.
2. PDF.js structural inspection for one-page MediaBox, extracted required
   text, vector path operations, and absence of raster map images.
3. A PDF.js canvas render at a pinned worker/browser version compared with a
   reviewed fixture-page snapshot. Derive the narrowest stable pixel tolerance
   from repeated identical runs; do not use byte-identical PDF assertions or
   inflate tolerance to hide nondeterminism.

CTC-014 proves the first two layers and five-run structural stability. A
production-adoption task must add the reviewed rendered-page snapshot before
shipping PDF behavior.

## Production adoption gate

Before direct jsPDF can move from experiment devDependency to production
dependency:

- obtain Claude final-audit acceptance of this evaluation;
- open a separate reviewed adoption scope;
- update `THIRD_PARTY_NOTICES.md`, production SBOM, license evidence, and
  security review for the exact adopted tree;
- preserve plain-text attribution and full printed OSM copyright URL;
- keep generation browser-local with no remote fonts, images, uploads,
  executable PDF content, annotations, forms, or imported HTML;
- implement and verify CTC-020 in the same release as distributed/shared PDF
  export under CTC-008.
`````

<!-- END AUDITED FILE 3/14: docs/experiments/ctc-014-vector-pdf-evaluation.md -->

<!-- BEGIN AUDITED FILE 4/14: docs/handoffs/ctc-014-spec-corrections.md -->

### docs/handoffs/ctc-014-spec-corrections.md

`````text
# CTC-014 Claude QA-planning corrections

Date: 2026-06-12

## Disposition

Claude returned `READY WITH REQUIRED SPEC CORRECTIONS`. Findings B-1 through
B-6 and the experiment-oriented intent of Decisions 1 through 12 are accepted,
subject to the consistency and feasibility corrections below. These
corrections are authoritative and authorize one isolated CTC-014 evaluation
experiment. They do not authorize production PDF export or production
dependency adoption.

## Consistency and feasibility corrections

1. The export scene stores both identities correctly:
   `courseSourceKey = "way/9000060001"` and
   `holeSourceKey = "way/9000060101"`. A hole source key must never be labeled
   or persisted as the course source key.
2. The export-scene geometry union supports every current normalized
   `Geometry` variant: point, line, and polygon. It does not model all source
   layers as polygons. Geometry is projected through existing pure helpers and
   source-key ordering is preserved.
3. Existing non-color distinctions are required export intent. Dashed route,
   hazard, rough, bunker, vegetation, and carry styles must not silently become
   solid. A candidate that cannot preserve a required dash pattern records a
   fidelity failure; simplification is allowed only when explicitly approved
   after evidence, not as a default.
4. Reject `pdf-lib` as the preselected structural inspection tool. Its public
   high-level API does not provide the claimed reliable text extraction,
   operator-list, map-region attribution, or decompressed content-stream proof.
   The experiment must first perform a tool spike and select the smallest
   reviewed test-only mechanism that can actually extract text, inspect
   operators/XObjects, and render pages. `pdfjs-dist` is the leading hypothesis
   because PDF.js exposes text-content and operator-list/rendering behavior,
   but its exact current version, license, browser/Node compatibility, size,
   security posture, and worker configuration must be verified before
   installation. No structural tool is authorized merely by this document.
5. Operator presence alone does not prove one path per source feature or prove
   map-region ownership. Vector proof must combine:
   - export-scene counts and stable source identities;
   - parsed PDF operator/XObject evidence showing vector path/text operations
     and no raster map image;
   - rendered-page fidelity against the scene.
   Tests must not claim exact source-to-operator correspondence unless the
   chosen parser can prove it.
6. Keep all exact-pinned experiment and test dependencies together on branch
   `ctc-014-pdf-evaluation` for a reproducible comparison. Do not repeatedly
   install/uninstall and commit transient lockfiles. If the evaluated fixture,
   tests, and measurement scripts are merged as CTC-014 evidence, their
   devDependencies and lockfile entries remain so the evidence is reproducible.
   Moving any candidate to production `dependencies` remains prohibited until
   a separate adoption decision.
7. Because experiment candidates are devDependencies, production-only
   `npm run license:check`, `npm run audit:prod`, SBOM, and
   `npm ls --omit=dev` do not assess them. The experiment must add or document
   explicit full-tree/dev-inclusive license, vulnerability, and dependency-tree
   evidence in addition to preserving the canonical production compliance
   gate. Candidate transitive licenses and vulnerabilities are blockers even
   when omitted from the production SBOM.
8. Do not predeclare `svg-to-pdfkit@0.1.8` CJS-only without inspecting the
   installed package. Its last-published date and documented unsupported
   features are verified maintenance concerns. It remains a required fallback
   control and fails the maintenance recommendation gate unless stronger live
   evidence changes that conclusion.
9. The one-page fixture uses US Letter portrait, 612 by 792 points, with
   36-point margins and Claude's stacked content-region plan. Exact
   transforms are derived from named region constants in code; do not persist
   rounded `0.667` or `3.5` approximations as coordinate truth. Boundaries,
   clipping, minimum 0.5-point strokes, minimum 7-point text, and two-point
   position tolerance are tested.
10. Standard 14 Helvetica is an experiment hypothesis, not guaranteed
    Windows-1252 behavior. Required attribution text and the copyright symbol
    must be extracted and rendered correctly. If the leading candidate fails,
    record the failure; do not silently add a font. A project-controlled font
    requires a separate recorded license/notice/size decision before use.
11. Use fixed valid target/carry IDs and static fixture text. The fixture may
    use a deterministic synthetic `SourceMetadata` record, but it must keep the
    actual OSM copyright URL and must not imply `example.invalid` is a fetched
    source. No network operation occurs.
12. Browser print-to-PDF is a Chromium control, not a browser-local library
    candidate and not a production recommendation. Canvas remains a negative
    raster control. Neither control needs to satisfy every candidate-library
    pass gate.
13. Do not rely on navigating Chromium's built-in PDF viewer through `file:`
    URLs or on an unspecified browser-bundled PDF.js. The selected test
    renderer must expose a deterministic programmatic completion signal and
    work under the repository's network-isolated Playwright environment.
14. Visual tolerance is derived from repeated identical runs but may not be
    inflated by an arbitrary extra percentage point. Use the smallest stable
    documented tolerance plus a narrow reviewed allowance. Unexpected
    nondeterminism remains evidence against a candidate.
15. Object URL cleanup follows the established tested project pattern unless
    the experiment proves it inadequate: click a temporary download anchor,
    then revoke/remove it in a later scheduled callback. Tests assert ordering
    and exactly-once cleanup, never garbage collection.
16. The experiment harness exposes user-relevant generation status and useful
    failures without stack traces in visible UI. Diagnostic errors may be
    retained in test output or structured experiment evidence without logging
    secrets or adding production logging.
17. CTC-014 may recommend a final library only from measured evidence. The
    recommendation may be "no viable candidate." It must explicitly separate
    experiment devDependency retention from any later production-dependency
    adoption and keep CTC-008/CTC-020 release gates intact.

## Accepted experiment rules

- Build a pure dependency-free export-scene model before candidate renderers.
- Derive the scene from the existing synthetic normalized fixture, current
  projection/carry/project contracts, and exact stable source identities.
- Export only associated selected-hole geometry, deterministic target/carry
  overlays, scale, yardage table, static fixture note, disclaimer, visible OSM
  attribution, and full printed copyright URL.
- Exclude interactive DOM state, hit targets, crosshair, measurement overlay,
  controls, ARIA-only elements, unassociated features, HTML, annotations,
  forms, scripts, attachments, imported images, remote assets, and network
  calls.
- Measure exact candidate versions, installed/transitive tree, licenses,
  vulnerabilities, Vite bundle delta, PDF size, page box, searchable text,
  copyright glyph, vector/raster evidence, fixture fidelity, layout,
  repeatability, and maintenance posture.
- Keep standard repository checks and production compliance passing. Add
  explicit dev/full-tree checks for experiment dependencies.
- Use focused Vitest and network-isolated Playwright coverage. Final Claude
  audit remains mandatory after the experiment and recommendation are complete.

## Development authorization

Development is authorized on branch `ctc-014-pdf-evaluation` for the isolated
experiment only. Before installing candidate packages, record the clean
baseline build and compliance evidence. Verify exact current versions and
licenses immediately before installation. No production dependency, production
export UI, CTC-020 implementation, persistent notes model, or external
user-data flow is authorized.
`````

<!-- END AUDITED FILE 4/14: docs/handoffs/ctc-014-spec-corrections.md -->

<!-- BEGIN AUDITED FILE 5/14: package-lock.json -->

### package-lock.json

`````text
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
        "blob-stream": "0.1.3",
        "jspdf": "4.2.1",
        "license-checker-rseidelsohn": "4.4.2",
        "pdfjs-dist": "6.0.227",
        "pdfkit": "0.19.1",
        "svg-to-pdfkit": "0.1.8",
        "svg2pdf.js": "2.7.0",
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
    "node_modules/@babel/runtime": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.29.7.tgz",
      "integrity": "sha512-Nq8OhGWiZIZGV6hLHoyAKLLcJihP/xFeBMGJoUrxTX2psI8dCifzLhZISFb+VWS3wFMRDmCGw5R+dOySCqPLhw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
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
    "node_modules/@napi-rs/canvas": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@napi-rs/canvas/-/canvas-1.0.0.tgz",
      "integrity": "sha512-Jqxcy1XOIqj+lH9sl1GT+il6GR3uQv13vI2mrwubP3uT8Olak2ClDrK2RnxlQKjwv8BRr4b3ug0YR7c6hBX8wg==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "workspaces": [
        "e2e/*"
      ],
      "engines": {
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      },
      "optionalDependencies": {
        "@napi-rs/canvas-android-arm64": "1.0.0",
        "@napi-rs/canvas-darwin-arm64": "1.0.0",
        "@napi-rs/canvas-darwin-x64": "1.0.0",
        "@napi-rs/canvas-linux-arm-gnueabihf": "1.0.0",
        "@napi-rs/canvas-linux-arm64-gnu": "1.0.0",
        "@napi-rs/canvas-linux-arm64-musl": "1.0.0",
        "@napi-rs/canvas-linux-riscv64-gnu": "1.0.0",
        "@napi-rs/canvas-linux-x64-gnu": "1.0.0",
        "@napi-rs/canvas-linux-x64-musl": "1.0.0",
        "@napi-rs/canvas-win32-arm64-msvc": "1.0.0",
        "@napi-rs/canvas-win32-x64-msvc": "1.0.0"
      }
    },
    "node_modules/@napi-rs/canvas-android-arm64": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@napi-rs/canvas-android-arm64/-/canvas-android-arm64-1.0.0.tgz",
      "integrity": "sha512-3hNKJObUK7JsCF9aJlVCs1J0/KE/gGfZNeK8MO1ge6bB3aicr5walGme9t9No1f/oyk9GgvdAT/rjSdsx3gbIw==",
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
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      }
    },
    "node_modules/@napi-rs/canvas-darwin-arm64": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@napi-rs/canvas-darwin-arm64/-/canvas-darwin-arm64-1.0.0.tgz",
      "integrity": "sha512-ZIja19/BiGz2puhki+WUYSRriwFeFJ8Mi9eK3hZdSS85w4Y60cuEAJVhMCfKwswQkKkUtrnzdKMBuO7TupvexA==",
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
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      }
    },
    "node_modules/@napi-rs/canvas-darwin-x64": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@napi-rs/canvas-darwin-x64/-/canvas-darwin-x64-1.0.0.tgz",
      "integrity": "sha512-hImggWc82jqZVpEsFR9S7PE9OQYjq/H/D7vwCGB6X1jRH+UVBP1+1niJTPBOat1B154T6GKK7/kcFtoWgjgFzQ==",
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
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      }
    },
    "node_modules/@napi-rs/canvas-linux-arm-gnueabihf": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@napi-rs/canvas-linux-arm-gnueabihf/-/canvas-linux-arm-gnueabihf-1.0.0.tgz",
      "integrity": "sha512-hlJRy6d+kWLKVOG/+1rEvNQVURZ0DxxRPJsLmEWwhwiXZUJc0BF5o9esALHSEP4CoJK4wChRtj3hnyBgVx2oWA==",
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
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      }
    },
    "node_modules/@napi-rs/canvas-linux-arm64-gnu": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@napi-rs/canvas-linux-arm64-gnu/-/canvas-linux-arm64-gnu-1.0.0.tgz",
      "integrity": "sha512-5Hru4T3RXkosRQafcjelv7AUzw9mXqmGYsxnzeDDOWveFCJyEPMSJltvGCM+jfH98seOCbfwm9KyFg6Jm5FhAA==",
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
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      }
    },
    "node_modules/@napi-rs/canvas-linux-arm64-musl": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@napi-rs/canvas-linux-arm64-musl/-/canvas-linux-arm64-musl-1.0.0.tgz",
      "integrity": "sha512-LTUl9jS8WsLSUGaxQZKQkxfluOJRpgvBuxxdM4pYcjib+di8AU4OzQc6+L6SzGMLcKc9H0RAjojRatBhTMqYdg==",
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
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      }
    },
    "node_modules/@napi-rs/canvas-linux-riscv64-gnu": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@napi-rs/canvas-linux-riscv64-gnu/-/canvas-linux-riscv64-gnu-1.0.0.tgz",
      "integrity": "sha512-Iz931SAZf+WVDzpjk52Q3ffW3zw0YflFwEZMgs036Wfu1kX/LrwT9wGjsuSqyduqefUkl91/vTdAjn8hQu5ezA==",
      "cpu": [
        "riscv64"
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
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      }
    },
    "node_modules/@napi-rs/canvas-linux-x64-gnu": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@napi-rs/canvas-linux-x64-gnu/-/canvas-linux-x64-gnu-1.0.0.tgz",
      "integrity": "sha512-pFEQ5eFK4JusgN1K6KkO9DKP/Hi1WMJOkF8Ch03/khTc4bFbCKkCCsJG4YcOMOW9bI4XbT2/eMAWxhO0xaWgPA==",
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
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      }
    },
    "node_modules/@napi-rs/canvas-linux-x64-musl": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@napi-rs/canvas-linux-x64-musl/-/canvas-linux-x64-musl-1.0.0.tgz",
      "integrity": "sha512-jnvr8NrLHiZ3NCiOKWqDbkI4Ah+QDrqtZ+sddPZBltEb1mQ2coSvCSJYfict+oAwcm0c970oTmVySpjKP/lnaA==",
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
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      }
    },
    "node_modules/@napi-rs/canvas-win32-arm64-msvc": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@napi-rs/canvas-win32-arm64-msvc/-/canvas-win32-arm64-msvc-1.0.0.tgz",
      "integrity": "sha512-y2j9/Gfd5joqiqxdP/L1smqjQ+uAx3C4N0EC7bDHrnZEEH8ToM/OC5p3uHvtj4Lq591aHj+ArL01UDLNwT5HgQ==",
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
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      }
    },
    "node_modules/@napi-rs/canvas-win32-x64-msvc": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@napi-rs/canvas-win32-x64-msvc/-/canvas-win32-x64-msvc-1.0.0.tgz",
      "integrity": "sha512-qwdhh9N6Gge/hC4pL9S1tQp0iKwhSl/dYjg7+RGp9k26iRGRi5MqqUyKGOXIWli0zOcuy5Y2wIH/jk2ry6i/jA==",
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
        "node": ">= 10"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      }
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
    "node_modules/@noble/ciphers": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/@noble/ciphers/-/ciphers-1.3.0.tgz",
      "integrity": "sha512-2I0gnIVPtfnMw9ee9h1dJG7tp81+8Ob3OJb3Mv37rx5L40/b0i7djjCVvGOVqc9AEIQyvyu1i6ypKdFw8R8gQw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^14.21.3 || >=16"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      }
    },
    "node_modules/@noble/hashes": {
      "version": "1.8.0",
      "resolved": "https://registry.npmjs.org/@noble/hashes/-/hashes-1.8.0.tgz",
      "integrity": "sha512-jCs9ldd7NwzpgXDIf6P3+NrHh9/sD6CQdxHyjQI+h/6rDNo88ypBxxz45UDuZHz9r3tNz7N/VInSVoVdtXEI4A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^14.21.3 || >=16"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
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
    "node_modules/@swc/helpers": {
      "version": "0.5.23",
      "resolved": "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.23.tgz",
      "integrity": "sha512-5lSsMOTXURePglDfvuAQUqkGek9Hg2kksOYay2m0+XR++b2NWYL/4sWyuvVBIs8oKnJaxkdi9whaL/sqN13afw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.8.0"
      }
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
    "node_modules/@types/pako": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/@types/pako/-/pako-2.0.4.tgz",
      "integrity": "sha512-VWDCbrLeVXJM9fihYodcLiIv0ku+AlOa/TQ1SvYOaBuyrSKgEcro95LJyIsJ4vSo6BXIxOKxiJAat04CmST9Fw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/raf": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/@types/raf/-/raf-3.4.3.tgz",
      "integrity": "sha512-c4YAvMedbPZ5tEyxzQdMoOhhJ4RD3rngZIdwC2/qDN3d7JpEhB6fiBRKVY1lg5B7Wk+uPBjn5f39j1/2MY1oOw==",
      "dev": true,
      "license": "MIT",
      "optional": true
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
    "node_modules/@types/trusted-types": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/@types/trusted-types/-/trusted-types-2.0.7.tgz",
      "integrity": "sha512-ScaPdn1dQczgbl0QFTeTOmVHFULt394XJgOQNoyVhZ6r2vLnMLJfBPd53SB52T/3G36VI1/g2MZaX0cwDuXsfw==",
      "dev": true,
      "license": "MIT",
      "optional": true
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
    "node_modules/base64-arraybuffer": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/base64-arraybuffer/-/base64-arraybuffer-1.0.2.tgz",
      "integrity": "sha512-I3yl4r9QB5ZRY3XuJVEPfc2XhZO6YweFPI+UovAzn+8/hb3oJ6lnysaFcjVpkCPfVWFUDvoZ8kmVDP7WyRtYtQ==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">= 0.6.0"
      }
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
      ]
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
    "node_modules/blob": {
      "version": "0.0.4",
      "resolved": "https://registry.npmjs.org/blob/-/blob-0.0.4.tgz",
      "integrity": "sha512-YRc9zvVz4wNaxcXmiSgb9LAg7YYwqQ2xd0Sj6osfA7k/PKmIGVlnOYs3wOFdkRC9/JpQu8sGt/zHgJV7xzerfg==",
      "dev": true
    },
    "node_modules/blob-stream": {
      "version": "0.1.3",
      "resolved": "https://registry.npmjs.org/blob-stream/-/blob-stream-0.1.3.tgz",
      "integrity": "sha512-xXwyhgVmPsFVFFvtM5P0syI17/oae+MIjLn5jGhuD86mmSJ61EWMWmbPrV/0+bdcH9jQ2CzIhmTQKNUJL7IPog==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "blob": "0.0.4"
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
    "node_modules/brotli": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/brotli/-/brotli-1.3.3.tgz",
      "integrity": "sha512-oTKjJdShmDuGW94SyyaoQvAjf30dZaHnjJ8uAF+u2/vGJkJbJPJAT1gDiOJP5v1Zb6f9KEyW/1HpuaWIXtGHPg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "base64-js": "^1.1.2"
      }
    },
    "node_modules/browserify-zlib": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/browserify-zlib/-/browserify-zlib-0.2.0.tgz",
      "integrity": "sha512-Z942RysHXmJrhqk88FmKBVq/v5tqmSkDz7p54G/MGyjMnCFFnC79XWNbg+Vta8W6Wb2qtSZTSxIGkJrRpCFEiA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "pako": "~1.0.5"
      }
    },
    "node_modules/browserify-zlib/node_modules/pako": {
      "version": "1.0.11",
      "resolved": "https://registry.npmjs.org/pako/-/pako-1.0.11.tgz",
      "integrity": "sha512-4hLB8Py4zZce5s4yd9XzopqwVv/yGNhV1Bl8NTmCq1763HeK2+EwVTv+leGeL13Dnh2wfbqowVPXCIO0z4taYw==",
      "dev": true,
      "license": "(MIT AND Zlib)"
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
    "node_modules/canvg": {
      "version": "3.0.11",
      "resolved": "https://registry.npmjs.org/canvg/-/canvg-3.0.11.tgz",
      "integrity": "sha512-5ON+q7jCTgMp9cjpu4Jo6XbvfYwSB2Ow3kzHKfIyJfaCAOHLbdKPQqGKgfED/R5B+3TFFfe8pegYA+b423SRyA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@babel/runtime": "^7.12.5",
        "@types/raf": "^3.4.0",
        "core-js": "^3.8.3",
        "raf": "^3.4.1",
        "regenerator-runtime": "^0.13.7",
        "rgbcolor": "^1.0.1",
        "stackblur-canvas": "^2.0.0",
        "svg-pathdata": "^6.0.3"
      },
      "engines": {
        "node": ">=10.0.0"
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
    "node_modules/clone": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/clone/-/clone-2.1.2.tgz",
      "integrity": "sha512-3Pe/CF1Nn94hyhIYpjtiLhdCoEoz0DqQ+988E9gmeEdQZlojxnOb74wctFyuwWQHzqyf9X7C7MG8juUpqBJT8w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.8"
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
    "node_modules/core-js": {
      "version": "3.49.0",
      "resolved": "https://registry.npmjs.org/core-js/-/core-js-3.49.0.tgz",
      "integrity": "sha512-es1U2+YTtzpwkxVLwAFdSpaIMyQaq0PBgm3YD1W3Qpsn1NAmO3KSgZfu+oGSWVu6NvLHoHCV/aYcsE5wiB7ALg==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/core-js"
      }
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
    "node_modules/css-line-break": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/css-line-break/-/css-line-break-2.1.0.tgz",
      "integrity": "sha512-FHcKFCZcAha3LwfVBhCQbW2nCNbkZXn7KVUJcsT5/P8YmfsVja0FMPJr0B903j/E69HUphKiV9iQArX8SDYA4w==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "utrie": "^1.0.2"
      }
    },
    "node_modules/cssesc": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/cssesc/-/cssesc-3.0.0.tgz",
      "integrity": "sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "cssesc": "bin/cssesc"
      },
      "engines": {
        "node": ">=4"
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
    "node_modules/dfa": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/dfa/-/dfa-1.2.0.tgz",
      "integrity": "sha512-ED3jP8saaweFTjeGX8HQPjeC1YYyZs98jGNZx6IiBvxW7JG5v492kamAQB3m2wop07CvU/RQmzcKr6bgcC5D/Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/discontinuous-range": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/discontinuous-range/-/discontinuous-range-1.0.0.tgz",
      "integrity": "sha512-c68LpLbO+7kP/b1Hr1qs8/BJ09F5khZGTxqxZuhzxpmwJKOgRFHJWIb9/KmqnqHhLdO55aOxFH/EGBvUQbL/RQ==",
      "dev": true,
      "optional": true
    },
    "node_modules/dompurify": {
      "version": "3.4.10",
      "resolved": "https://registry.npmjs.org/dompurify/-/dompurify-3.4.10.tgz",
      "integrity": "sha512-0xzNv0e7oYC6yyuOGZIABPM4qtg3QxLFniDNPP4ZP90wR8Yq3zgwpRbrNiT4N3IKqDbbYFEJLV+JWEs19aZ//w==",
      "dev": true,
      "license": "(MPL-2.0 OR Apache-2.0)",
      "optional": true,
      "optionalDependencies": {
        "@types/trusted-types": "^2.0.7"
      }
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
      "dev": true
    },
    "node_modules/fast-png": {
      "version": "6.4.0",
      "resolved": "https://registry.npmjs.org/fast-png/-/fast-png-6.4.0.tgz",
      "integrity": "sha512-kAqZq1TlgBjZcLr5mcN6NP5Rv4V2f22z00c3g8vRrwkcqjerx7BEhPbOnWCPqaHUl2XWQBJQvOT/FQhdMT7X/Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/pako": "^2.0.3",
        "iobuffer": "^5.3.2",
        "pako": "^2.1.0"
      }
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
    "node_modules/fflate": {
      "version": "0.8.3",
      "resolved": "https://registry.npmjs.org/fflate/-/fflate-0.8.3.tgz",
      "integrity": "sha512-tbZNuJrLwGUp3zshBtdy4W+ORxZuIh8a5ilyIEQDC5rY1f3U20JMry0Ll3WBzU58EZKsEuJFXhb5gwv8CsPvgA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/file-uri-to-path": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/file-uri-to-path/-/file-uri-to-path-1.0.0.tgz",
      "integrity": "sha512-0Zt+s3L7Vf1biwWZ29aARiVYLx7iMGnEUl9x33fbB/j3jR81u/O2LbqK+Bm1CDSNDKVtJ/YjwY7TUd5SkeLQLw==",
      "dev": true,
      "optional": true
    },
    "node_modules/font-family-papandreou": {
      "version": "0.2.0-patch2",
      "resolved": "https://registry.npmjs.org/font-family-papandreou/-/font-family-papandreou-0.2.0-patch2.tgz",
      "integrity": "sha512-l/YiRdBSH/eWv6OF3sLGkwErL+n0MqCICi9mppTZBOCL5vixWGDqCYvRcuxB2h7RGCTzaTKOHT2caHvCXQPRlw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fontkit": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/fontkit/-/fontkit-2.0.4.tgz",
      "integrity": "sha512-syetQadaUEDNdxdugga9CpEYVaQIxOwk7GlwZWWZ19//qW4zE5bknOKeMBDYAASwnpaSHKJITRLMF9m1fp3s6g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@swc/helpers": "^0.5.12",
        "brotli": "^1.3.2",
        "clone": "^2.1.2",
        "dfa": "^1.2.0",
        "fast-deep-equal": "^3.1.3",
        "restructure": "^3.0.0",
        "tiny-inflate": "^1.0.3",
        "unicode-properties": "^1.4.0",
        "unicode-trie": "^2.0.0"
      }
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
    "node_modules/html2canvas": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/html2canvas/-/html2canvas-1.4.1.tgz",
      "integrity": "sha512-fPU6BHNpsyIhr8yyMpTLLxAbkaK8ArIBcmZIRiBLiDhjeqvXolaEmDGmELFuX9I4xDcaKKcJl+TKZLqruBbmWA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "css-line-break": "^2.1.0",
        "text-segmentation": "^1.0.3"
      },
      "engines": {
        "node": ">=8.0.0"
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
    "node_modules/iobuffer": {
      "version": "5.4.0",
      "resolved": "https://registry.npmjs.org/iobuffer/-/iobuffer-5.4.0.tgz",
      "integrity": "sha512-DRebOWuqDvxunfkNJAlc3IzWIPD5xVxwUNbHr7xKB8E6aLJxIPfNX3CoMJghcFjpv6RWQsrcJbghtEwSPoJqMA==",
      "dev": true,
      "license": "MIT"
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
    "node_modules/js-md5": {
      "version": "0.8.3",
      "resolved": "https://registry.npmjs.org/js-md5/-/js-md5-0.8.3.tgz",
      "integrity": "sha512-qR0HB5uP6wCuRMrWPTrkMaev7MJZwJuuw4fnwAzRgP4J4/F8RwtodOKpGp4XpqsLBFzzgqIO42efFAyz2Et6KQ==",
      "dev": true,
      "license": "MIT"
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
    "node_modules/jspdf": {
      "version": "4.2.1",
      "resolved": "https://registry.npmjs.org/jspdf/-/jspdf-4.2.1.tgz",
      "integrity": "sha512-YyAXyvnmjTbR4bHQRLzex3CuINCDlQnBqoSYyjJwTP2x9jDLuKDzy7aKUl0hgx3uhcl7xzg32agn5vlie6HIlQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.28.6",
        "fast-png": "^6.2.0",
        "fflate": "^0.8.1"
      },
      "optionalDependencies": {
        "canvg": "^3.0.11",
        "core-js": "^3.6.0",
        "dompurify": "^3.3.1",
        "html2canvas": "^1.0.0-rc.5"
      }
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
    "node_modules/linebreak": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/linebreak/-/linebreak-1.1.0.tgz",
      "integrity": "sha512-MHp03UImeVhB7XZtjd0E4n6+3xr5Dq/9xI/5FptGk5FrbDR3zagPa2DS6U8ks/3HjbKWG9Q1M2ufOzxV2qLYSQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "base64-js": "0.0.8",
        "unicode-trie": "^2.0.0"
      }
    },
    "node_modules/linebreak/node_modules/base64-js": {
      "version": "0.0.8",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-0.0.8.tgz",
      "integrity": "sha512-3XSA2cR/h/73EzlXXdU6YNycmYI7+kicTxks4eJg2g39biHR84slg2+des+p7iHYhbRg/udIS4TD53WabcOUkw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
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
    "node_modules/pako": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/pako/-/pako-2.1.0.tgz",
      "integrity": "sha512-w+eufiZ1WuJYgPXbV/PO3NCMEc3xqylkKHzp8bxp1uW4qaSNQUkwmLLEc3kKsfz8lpV1F8Ht3U1Cm+9Srog2ug==",
      "dev": true,
      "license": "(MIT AND Zlib)"
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
    "node_modules/pdfjs-dist": {
      "version": "6.0.227",
      "resolved": "https://registry.npmjs.org/pdfjs-dist/-/pdfjs-dist-6.0.227.tgz",
      "integrity": "sha512-/P6M4SXw+70waMVLUM7rdRtvo+dEzqE1t6W/zQNvBETo2MaRa5rrvCcAYdfWGiUzadTgM0lJmRApUrW0d9zgKg==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=22.13.0 || >=24"
      },
      "optionalDependencies": {
        "@napi-rs/canvas": "^1.0.0"
      }
    },
    "node_modules/pdfkit": {
      "version": "0.19.1",
      "resolved": "https://registry.npmjs.org/pdfkit/-/pdfkit-0.19.1.tgz",
      "integrity": "sha512-6Gzk+wDwTs4VSxsR5rCMTnIl5nlmkye1oWB0l2hDB1EX6ZNSIBroKQEv+2+fPPn+stVjyqzmsqRJVDfB9fo5DA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@noble/ciphers": "^1.0.0",
        "@noble/hashes": "^1.6.0",
        "fontkit": "^2.0.4",
        "js-md5": "^0.8.3",
        "linebreak": "^1.1.0",
        "png-js": "^1.1.0"
      }
    },
    "node_modules/performance-now": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/performance-now/-/performance-now-2.1.0.tgz",
      "integrity": "sha512-7EAHlyLHI56VEIdK57uwHdHKIaAGbnXPiw0yWbarQZOKaKpvUIgW0jWRVLiatnM+XXlSwsanIBH/hzGMJulMow==",
      "dev": true,
      "license": "MIT",
      "optional": true
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
    "node_modules/png-js": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/png-js/-/png-js-1.1.0.tgz",
      "integrity": "sha512-PM/uYGzGdNSzqeOgly68+6wKQDL1SY0a/N+OEa/+br6LnHWOAJB0Npiamnodfq3jd2LS/i2fMeOKSAILjA+m5Q==",
      "dev": true,
      "dependencies": {
        "browserify-zlib": "^0.2.0"
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
    "node_modules/raf": {
      "version": "3.4.1",
      "resolved": "https://registry.npmjs.org/raf/-/raf-3.4.1.tgz",
      "integrity": "sha512-Sq4CW4QhwOHE8ucn6J34MqtZCeWFP2aQSmrlroYgqAV1PjStIhJXxYuTgUIfkEk7zTLjmIjLmU5q+fbD1NnOJA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "performance-now": "^2.1.0"
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
    "node_modules/regenerator-runtime": {
      "version": "0.13.11",
      "resolved": "https://registry.npmjs.org/regenerator-runtime/-/regenerator-runtime-0.13.11.tgz",
      "integrity": "sha512-kY1AZVr2Ra+t+piVaJ4gxaFaReZVH40AKNo7UCX6W+dEwBo/2oZJzqfuN1qLq1oL45o56cPaTXELwrTh8Fpggg==",
      "dev": true,
      "license": "MIT",
      "optional": true
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
    "node_modules/restructure": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/restructure/-/restructure-3.0.2.tgz",
      "integrity": "sha512-gSfoiOEA0VPE6Tukkrr7I0RBdE0s7H1eFCDBk05l1KIQT1UIKNc5JZy6jdyW6eYH3aR3g5b3PuL77rq0hvwtAw==",
      "dev": true,
      "license": "MIT"
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
    "node_modules/rgbcolor": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/rgbcolor/-/rgbcolor-1.0.1.tgz",
      "integrity": "sha512-9aZLIrhRaD97sgVhtJOW6ckOEh6/GnvQtdVNfdZ6s67+3/XwLS9lBcQYzEEhYVeUowN7pRzMLsyGhK2i/xvWbw==",
      "dev": true,
      "license": "MIT OR SEE LICENSE IN FEEL-FREE.md",
      "optional": true,
      "engines": {
        "node": ">= 0.8.15"
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
    "node_modules/specificity": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/specificity/-/specificity-0.4.1.tgz",
      "integrity": "sha512-1klA3Gi5PD1Wv9Q0wUoOQN1IWAuPu0D1U03ThXTr0cJ20+/iq2tHSDnK7Kk/0LXJ1ztUB2/1Os0wKmfyNgUQfg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "specificity": "bin/specificity"
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
    "node_modules/stackblur-canvas": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/stackblur-canvas/-/stackblur-canvas-2.7.0.tgz",
      "integrity": "sha512-yf7OENo23AGJhBriGx0QivY5JP6Y1HbrrDI6WLt6C5auYZXlQrheoY8hD4ibekFKz1HOfE48Ww8kMWMnJD/zcQ==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=0.1.14"
      }
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
    "node_modules/svg-pathdata": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/svg-pathdata/-/svg-pathdata-6.0.3.tgz",
      "integrity": "sha512-qsjeeq5YjBZ5eMdFuUa4ZosMLxgr5RZ+F+Y1OrDhuOCEInRMA3x74XdBtggJcj9kOeInz0WE+LgCPDkZFlBYJw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=12.0.0"
      }
    },
    "node_modules/svg-to-pdfkit": {
      "version": "0.1.8",
      "resolved": "https://registry.npmjs.org/svg-to-pdfkit/-/svg-to-pdfkit-0.1.8.tgz",
      "integrity": "sha512-QItiGZBy5TstGy+q8mjQTMGRlDDOARXLxH+sgVm1n/LYeo0zFcQlcCh8m4zi8QxctrxB9Kue/lStc/RD5iLadQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "pdfkit": ">=0.8.1"
      }
    },
    "node_modules/svg2pdf.js": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/svg2pdf.js/-/svg2pdf.js-2.7.0.tgz",
      "integrity": "sha512-nXK4Wx28H0KtOktanm5nsphl1KMEoLNMelAT/776qxPAj9DshwYcqgdpKuBnY1nrcYOriQFHVQLE4tIag+aDJA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "cssesc": "^3.0.0",
        "font-family-papandreou": "^0.2.0-patch1",
        "specificity": "^0.4.1",
        "svgpath": "^2.3.0"
      },
      "peerDependencies": {
        "jspdf": "^4.0.0 || ^3.0.0 || ^2.0.0"
      }
    },
    "node_modules/svgpath": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/svgpath/-/svgpath-2.6.0.tgz",
      "integrity": "sha512-OIWR6bKzXvdXYyO4DK/UWa1VA1JeKq8E+0ug2DG98Y/vOmMpfZNj+TIG988HjfYSqtcy/hFOtZq/n/j5GSESNg==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/fontello/svg2ttf?sponsor=1"
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
    "node_modules/text-segmentation": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/text-segmentation/-/text-segmentation-1.0.3.tgz",
      "integrity": "sha512-iOiPUo/BGnZ6+54OsWxZidGCsdU8YbE4PSpdPinp7DeMtUJNJBoJ/ouUSTJjHkh1KntHaltHl/gDs2FC4i5+Nw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "utrie": "^1.0.2"
      }
    },
    "node_modules/tiny-inflate": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/tiny-inflate/-/tiny-inflate-1.0.3.tgz",
      "integrity": "sha512-pkY1fj1cKHb2seWDy0B16HeWyczlJA9/WW3u3c4z/NiWDsO3DOU5D7nhTLE9CF0yXv/QZFY7sEJmj24dK+Rrqw==",
      "dev": true,
      "license": "MIT"
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
      "license": "0BSD"
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
    "node_modules/unicode-properties": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/unicode-properties/-/unicode-properties-1.4.1.tgz",
      "integrity": "sha512-CLjCCLQ6UuMxWnbIylkisbRj31qxHPAurvena/0iwSVbQ2G1VY5/HjV0IRabOEbDHlzZlRdCrD4NhB0JtU40Pg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "base64-js": "^1.3.0",
        "unicode-trie": "^2.0.0"
      }
    },
    "node_modules/unicode-trie": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/unicode-trie/-/unicode-trie-2.0.0.tgz",
      "integrity": "sha512-x7bc76x0bm4prf1VLg79uhAzKw8DVboClSN5VxJuQ+LKDOVEW9CdH+VY7SP+vX7xCYQqzzgQpFqz15zeLvAtZQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "pako": "^0.2.5",
        "tiny-inflate": "^1.0.0"
      }
    },
    "node_modules/unicode-trie/node_modules/pako": {
      "version": "0.2.9",
      "resolved": "https://registry.npmjs.org/pako/-/pako-0.2.9.tgz",
      "integrity": "sha512-NUcwaKxUxWrZLpDG+z/xZaCgQITkA/Dv4V/T6bw7VON6l1Xz/VnrBqrYjZQ12TamKHzITTfOEIYUj48y2KXImA==",
      "dev": true,
      "license": "MIT"
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
    "node_modules/utrie": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/utrie/-/utrie-1.0.2.tgz",
      "integrity": "sha512-1MLa5ouZiOmQzUbjbu9VmjLzn1QLXBhwpUa7kdLUQK+KQ5KA9I1vk5U4YHe/X2Ch7PYnJfWuWT+VbuxbGwljhw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "base64-arraybuffer": "^1.0.2"
      }
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
`````

<!-- END AUDITED FILE 5/14: package-lock.json -->

<!-- BEGIN AUDITED FILE 6/14: package.json -->

### package.json

`````text
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
    "blob-stream": "0.1.3",
    "jspdf": "4.2.1",
    "license-checker-rseidelsohn": "4.4.2",
    "pdfjs-dist": "6.0.227",
    "pdfkit": "0.19.1",
    "svg-to-pdfkit": "0.1.8",
    "svg2pdf.js": "2.7.0",
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

<!-- END AUDITED FILE 6/14: package.json -->

<!-- BEGIN AUDITED FILE 7/14: src/ctc014-modules.d.ts -->

### src/ctc014-modules.d.ts

`````text
declare module "blob-stream" {
  type BlobStream = NodeJS.WritableStream & {
    toBlob(type: string): Blob;
    on(event: "finish" | "error", callback: (...args: unknown[]) => void): BlobStream;
  };
  export default function blobStream(): BlobStream;
}

declare module "svg-to-pdfkit" {
  import type PDFDocument from "pdfkit";
  export default function SVGtoPDF(
    document: PDFDocument,
    svg: string | SVGElement,
    x?: number,
    y?: number,
    options?: Record<string, unknown>,
  ): void;
}

declare module "pdfkit" {
  export default class PDFDocument {
    constructor(options?: Record<string, unknown>);
    pipe<T>(stream: T): T;
    end(): void;
    font(name: string): this;
    fontSize(size: number): this;
    text(text: string, x: number, y: number, options?: Record<string, unknown>): this;
    strokeColor(color: string): this;
    fillColor(color: string): this;
    lineWidth(width: number): this;
    dash(length: number, options?: Record<string, unknown>): this;
    circle(x: number, y: number, radius: number): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    closePath(): this;
    fillAndStroke(): this;
    fill(): this;
    stroke(): this;
  }
}
`````

<!-- END AUDITED FILE 7/14: src/ctc014-modules.d.ts -->

<!-- BEGIN AUDITED FILE 8/14: src/ctc014-window.d.ts -->

### src/ctc014-window.d.ts

`````text
import type * as experiment from "./ctc014Experiment";

declare global {
  interface Window {
    ctc014Experiment: {
      analyzePdf: typeof experiment.analyzePdf;
      renderJsPdfDirect: typeof experiment.renderJsPdfDirect;
      renderJsPdfSvg: typeof experiment.renderJsPdfSvg;
      renderPdfKitDirect: typeof experiment.renderPdfKitDirect;
      renderPdfKitSvg: typeof experiment.renderPdfKitSvg;
    };
  }
}

export {};
`````

<!-- END AUDITED FILE 8/14: src/ctc014-window.d.ts -->

<!-- BEGIN AUDITED FILE 9/14: src/ctc014Experiment.ts -->

### src/ctc014Experiment.ts

`````text
import { jsPDF } from "jspdf";
import "svg2pdf.js";
import { getDocument, GlobalWorkerOptions, OPS } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type PDFDocument from "pdfkit";
import { createCtc014ExportScene, type Ctc014ExportScene, type ExportGeometry, type ExportStyle } from "./ctc014Scene";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type PdfEvidence = {
  bytes: number;
  pages: number;
  width: number;
  height: number;
  text: string;
  pathOperations: number;
  imageOperations: number;
};

function hex(value: string | null): [number, number, number] | null {
  if (!value) return null;
  const match = /^#([0-9a-f]{6})$/i.exec(value);
  if (!match) throw new Error(`Unsupported color ${value}`);
  return [0, 2, 4].map((index) => Number.parseInt(match[1].slice(index, index + 2), 16)) as [number, number, number];
}

function setStyle(doc: jsPDF, style: ExportStyle) {
  const stroke = hex(style.stroke);
  const fill = hex(style.fill);
  if (stroke) doc.setDrawColor(...stroke);
  if (fill) doc.setFillColor(...fill);
  doc.setLineWidth(Math.max(0.5, style.strokeWidth * createCtc014ExportScene().map.transform.scale));
  doc.setLineDashPattern(style.dash.map((value) => value * createCtc014ExportScene().map.transform.scale), 0);
}

function pagePoint(scene: Ctc014ExportScene, point: { x: number; y: number }) {
  return {
    x: scene.map.transform.translateX + point.x * scene.map.transform.scale,
    y: scene.map.transform.translateY + point.y * scene.map.transform.scale,
  };
}

function drawGeometry(doc: jsPDF, scene: Ctc014ExportScene, geometry: ExportGeometry) {
  setStyle(doc, geometry.style);
  if (geometry.type === "point") {
    const point = pagePoint(scene, geometry.point);
    doc.circle(point.x, point.y, geometry.radius * scene.map.transform.scale, geometry.style.fill ? "FD" : "S");
    return;
  }
  const points = geometry.points.map((point) => pagePoint(scene, point));
  doc.lines(points.slice(1).map((point, index) => [point.x - points[index].x, point.y - points[index].y]),
    points[0].x, points[0].y, [1, 1], geometry.type === "polygon" ? "FD" : "S", geometry.type === "polygon");
}

export function renderJsPdfDirect(scene = createCtc014ExportScene()): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: [scene.page.width, scene.page.height], orientation: "portrait", compress: false });
  doc.setFont("Helvetica", "normal");
  scene.map.geometry.forEach((geometry) => drawGeometry(doc, scene, geometry));
  scene.map.labels.forEach((label) => {
    const point = pagePoint(scene, label);
    doc.setFontSize(Math.max(7, label.size * scene.map.transform.scale));
    doc.text(label.text, point.x, point.y);
  });
  const scaleStart = pagePoint(scene, scene.map.scaleBar.start);
  const scaleEnd = pagePoint(scene, scene.map.scaleBar.end);
  doc.line(scaleStart.x, scaleStart.y, scaleEnd.x, scaleEnd.y);
  doc.setFontSize(7);
  doc.text(scene.map.scaleBar.label, scaleStart.x, scaleStart.y - 4);
  scene.text.forEach((entry) => {
    doc.setFontSize(entry.size);
    doc.text(entry.text, entry.x, entry.y);
  });
  return new Uint8Array(doc.output("arraybuffer"));
}

function svgForScene(scene: Ctc014ExportScene): SVGSVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 800 600");
  svg.setAttribute("width", String(800 * scene.map.transform.scale));
  svg.setAttribute("height", String(600 * scene.map.transform.scale));
  for (const geometry of scene.map.geometry) {
    let element: SVGElement;
    if (geometry.type === "point") {
      element = document.createElementNS(ns, "circle");
      element.setAttribute("cx", String(geometry.point.x));
      element.setAttribute("cy", String(geometry.point.y));
      element.setAttribute("r", String(geometry.radius));
    } else {
      element = document.createElementNS(ns, geometry.type === "polygon" ? "polygon" : "polyline");
      element.setAttribute("points", geometry.points.map(({ x, y }) => `${x},${y}`).join(" "));
    }
    element.setAttribute("fill", geometry.style.fill ?? "none");
    element.setAttribute("stroke", geometry.style.stroke ?? "none");
    element.setAttribute("stroke-width", String(geometry.style.strokeWidth));
    if (geometry.style.dash.length) element.setAttribute("stroke-dasharray", geometry.style.dash.join(" "));
    svg.appendChild(element);
  }
  for (const label of scene.map.labels) {
    const text = document.createElementNS(ns, "text");
    text.setAttribute("x", String(label.x));
    text.setAttribute("y", String(label.y));
    text.setAttribute("font-size", String(label.size));
    text.textContent = label.text;
    svg.appendChild(text);
  }
  const scaleBar = document.createElementNS(ns, "line");
  scaleBar.setAttribute("x1", String(scene.map.scaleBar.start.x));
  scaleBar.setAttribute("y1", String(scene.map.scaleBar.start.y));
  scaleBar.setAttribute("x2", String(scene.map.scaleBar.end.x));
  scaleBar.setAttribute("y2", String(scene.map.scaleBar.end.y));
  scaleBar.setAttribute("stroke", "#17211b");
  scaleBar.setAttribute("stroke-width", "2");
  svg.appendChild(scaleBar);
  const scaleLabel = document.createElementNS(ns, "text");
  scaleLabel.setAttribute("x", String(scene.map.scaleBar.start.x));
  scaleLabel.setAttribute("y", String(scene.map.scaleBar.start.y - 6));
  scaleLabel.setAttribute("font-size", "12");
  scaleLabel.textContent = scene.map.scaleBar.label;
  svg.appendChild(scaleLabel);
  return svg;
}

export async function renderJsPdfSvg(scene = createCtc014ExportScene()): Promise<Uint8Array> {
  const doc = new jsPDF({ unit: "pt", format: [scene.page.width, scene.page.height], orientation: "portrait", compress: false });
  await doc.svg(svgForScene(scene), {
    x: scene.map.transform.translateX,
    y: scene.map.transform.translateY,
    width: 800 * scene.map.transform.scale,
    height: 600 * scene.map.transform.scale,
  });
  doc.setFont("Helvetica", "normal");
  scene.text.forEach((entry) => {
    doc.setFontSize(entry.size);
    doc.text(entry.text, entry.x, entry.y);
  });
  return new Uint8Array(doc.output("arraybuffer"));
}

async function pdfKitBytes(render: (doc: PDFDocument) => void): Promise<Uint8Array> {
  const [{ default: PdfKitDocument }, { default: blobStream }] = await Promise.all([
    import("pdfkit"),
    import("blob-stream"),
  ]);
  return new Promise((resolve, reject) => {
    const doc = new PdfKitDocument({ size: [612, 792], margin: 0, autoFirstPage: true });
    const stream = doc.pipe(blobStream());
    stream.on("finish", async () => resolve(new Uint8Array(await stream.toBlob("application/pdf").arrayBuffer())));
    stream.on("error", reject);
    render(doc);
    doc.end();
  });
}

function setPdfKitStyle(doc: PDFDocument, style: ExportStyle, scale: number) {
  if (style.stroke) doc.strokeColor(style.stroke);
  if (style.fill) doc.fillColor(style.fill);
  doc.lineWidth(Math.max(0.5, style.strokeWidth * scale));
  doc.dash(style.dash.length ? style.dash[0] * scale : 0, { space: (style.dash[1] ?? style.dash[0] ?? 0) * scale });
}

export function renderPdfKitDirect(scene = createCtc014ExportScene()): Promise<Uint8Array> {
  return pdfKitBytes((doc) => {
    for (const geometry of scene.map.geometry) {
      setPdfKitStyle(doc, geometry.style, scene.map.transform.scale);
      if (geometry.type === "point") {
        const point = pagePoint(scene, geometry.point);
        doc.circle(point.x, point.y, geometry.radius * scene.map.transform.scale);
      } else {
        const points = geometry.points.map((point) => pagePoint(scene, point));
        doc.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach((point) => doc.lineTo(point.x, point.y));
        if (geometry.type === "polygon") doc.closePath();
      }
      if (geometry.style.fill && geometry.style.stroke) doc.fillAndStroke();
      else if (geometry.style.fill) doc.fill();
      else doc.stroke();
    }
    doc.font("Helvetica");
    scene.text.forEach((entry) => doc.fontSize(entry.size).fillColor("#17211b").text(entry.text, entry.x, entry.y, { lineBreak: false }));
  });
}

export async function renderPdfKitSvg(scene = createCtc014ExportScene()): Promise<Uint8Array> {
  const { default: SVGtoPDF } = await import("svg-to-pdfkit");
  return pdfKitBytes((doc) => {
    SVGtoPDF(doc, svgForScene(scene).outerHTML, scene.map.transform.translateX, scene.map.transform.translateY, {
      width: 800 * scene.map.transform.scale,
      height: 600 * scene.map.transform.scale,
      assumePt: true,
    });
    doc.font("Helvetica");
    scene.text.forEach((entry) => doc.fontSize(entry.size).fillColor("#17211b").text(entry.text, entry.x, entry.y, { lineBreak: false }));
  });
}

export async function analyzePdf(data: Uint8Array): Promise<PdfEvidence> {
  const bytes = data.byteLength;
  const task = getDocument({ data });
  const pdf = await task.promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1 });
  const text = await page.getTextContent();
  const operators = await page.getOperatorList();
  const pathIds = new Set([OPS.constructPath, OPS.stroke, OPS.fill, OPS.eoFill, OPS.fillStroke, OPS.eoFillStroke]);
  const imageIds = new Set([OPS.paintImageXObject, OPS.paintInlineImageXObject, OPS.paintImageMaskXObject]);
  return {
    bytes,
    pages: pdf.numPages,
    width: viewport.width,
    height: viewport.height,
    text: text.items.map((item) => "str" in item ? item.str : "").join(" "),
    pathOperations: operators.fnArray.filter((operation) => pathIds.has(operation)).length,
    imageOperations: operators.fnArray.filter((operation) => imageIds.has(operation)).length,
  };
}
`````

<!-- END AUDITED FILE 9/14: src/ctc014Experiment.ts -->

<!-- BEGIN AUDITED FILE 10/14: src/ctc014Main.ts -->

### src/ctc014Main.ts

`````text
import {
  analyzePdf,
  renderJsPdfDirect,
  renderJsPdfSvg,
  renderPdfKitDirect,
  renderPdfKitSvg,
} from "./ctc014Experiment";

window.ctc014Experiment = {
  analyzePdf,
  renderJsPdfDirect,
  renderJsPdfSvg,
  renderPdfKitDirect,
  renderPdfKitSvg,
};
`````

<!-- END AUDITED FILE 10/14: src/ctc014Main.ts -->

<!-- BEGIN AUDITED FILE 11/14: src/ctc014Scene.test.ts -->

### src/ctc014Scene.test.ts

`````text
import { describe, expect, it } from "vitest";
import {
  CTC014_ATTRIBUTION,
  CTC014_ATTRIBUTION_URL,
  CTC014_COURSE_SOURCE_KEY,
  CTC014_HOLE_SOURCE_KEY,
  MAP_REGION,
  createCtc014ExportScene,
} from "./ctc014Scene";

describe("CTC-014 export scene", () => {
  it("builds a deterministic pure scene from current fixture contracts", () => {
    const first = createCtc014ExportScene();
    const second = createCtc014ExportScene();
    expect(second).toEqual(first);
    expect(first.courseSourceKey).toBe(CTC014_COURSE_SOURCE_KEY);
    expect(first.holeSourceKey).toBe(CTC014_HOLE_SOURCE_KEY);
    expect(first.map.region).toEqual(MAP_REGION);
    expect(first.page).toEqual({ width: 612, height: 792, margin: 36 });
  });

  it("includes every selected-hole layer plus vector target and carry evidence", () => {
    const scene = createCtc014ExportScene();
    const kinds = scene.map.geometry.map(({ kind }) => kind);
    expect(kinds).toEqual(expect.arrayContaining([
      "vegetation", "generic-water", "golf-water", "rough", "fairway",
      "bunker", "green", "tee", "route", "carry-arc", "target",
    ]));
    expect(scene.map.geometry.every(({ style }) => style.strokeWidth > 0)).toBe(true);
    expect(scene.map.geometry.filter(({ kind }) => ["route", "carry-arc", "rough"].includes(kind))
      .every(({ style }) => style.dash.length > 0)).toBe(true);
  });

  it("keeps required static notes, disclaimer, and full attribution text", () => {
    const scene = createCtc014ExportScene();
    expect(scene.text.find(({ role }) => role === "attribution")?.text).toBe(CTC014_ATTRIBUTION);
    expect(scene.text.find(({ role }) => role === "attribution-url")?.text).toBe(CTC014_ATTRIBUTION_URL);
    expect(scene.text.find(({ role }) => role === "note")?.text).toMatch(/Synthetic/);
    expect(scene.text.find(({ role }) => role === "disclaimer")?.text).toMatch(/Verify before play/);
  });
});
`````

<!-- END AUDITED FILE 11/14: src/ctc014Scene.test.ts -->

<!-- BEGIN AUDITED FILE 12/14: src/ctc014Scene.ts -->

### src/ctc014Scene.ts

`````text
import fixture from "../fixtures/overpass/synthetic-golf-course-ctc006.json";
import { carryRings } from "./carry";
import {
  LAYER_ORDER,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  createProjection,
  geometryCoordinates,
  holeCoordinates,
  projectCoordinate,
  scaleBar,
  type Projection,
  type ViewportPoint,
} from "./map";
import {
  normalizeGolfCourse,
  type FeatureKind,
  type Geometry,
  type NormalizedHole,
  type SourceKey,
} from "./normalize";
import type { OverpassResponse, SourceMetadata } from "./overpass";
import type { HoleStateV1 } from "./project";

export const CTC014_COURSE_SOURCE_KEY = "way/9000060001" as const;
export const CTC014_HOLE_SOURCE_KEY = "way/9000060101" as const;
export const CTC014_TEE_SOURCE_KEY = "way/9000060201" as const;
export const CTC014_ATTRIBUTION = "Course geometry and map data © OpenStreetMap contributors." as const;
export const CTC014_ATTRIBUTION_URL = "https://www.openstreetmap.org/copyright" as const;
export const CTC014_NOTE = "Synthetic CTC-014 fixture. Not a real course." as const;
export const CTC014_DISCLAIMER = "Yardages are estimates from open map data. Verify before play." as const;

export const LETTER_WIDTH_PT = 612;
export const LETTER_HEIGHT_PT = 792;
export const PAGE_MARGIN_PT = 36;
export const MAP_REGION = { x: 36, y: 111, width: 540, height: 400 } as const;
export const MAP_SCALE = Math.min(MAP_REGION.width / VIEWBOX_WIDTH, MAP_REGION.height / VIEWBOX_HEIGHT);
export const MAP_TRANSLATE_X = MAP_REGION.x + (MAP_REGION.width - VIEWBOX_WIDTH * MAP_SCALE) / 2;
export const MAP_TRANSLATE_Y = MAP_REGION.y;

export type ExportStyle = {
  fill: string | null;
  stroke: string | null;
  strokeWidth: number;
  dash: number[];
};

export type ExportGeometry =
  | { type: "point"; sourceKey: SourceKey | string; kind: FeatureKind | "target"; point: ViewportPoint; radius: number; style: ExportStyle }
  | { type: "line"; sourceKey: SourceKey | string; kind: FeatureKind | "route" | "carry-arc"; points: ViewportPoint[]; style: ExportStyle }
  | { type: "polygon"; sourceKey: SourceKey | string; kind: FeatureKind; points: ViewportPoint[]; style: ExportStyle };

export type ExportText = {
  role: "title" | "subtitle" | "carry-label" | "yardage" | "note" | "disclaimer" | "attribution" | "attribution-url";
  text: string;
  x: number;
  y: number;
  size: number;
};

export type Ctc014ExportScene = {
  page: { width: number; height: number; margin: number };
  courseSourceKey: typeof CTC014_COURSE_SOURCE_KEY;
  holeSourceKey: typeof CTC014_HOLE_SOURCE_KEY;
  map: {
    region: typeof MAP_REGION;
    transform: { translateX: number; translateY: number; scale: number };
    geometry: ExportGeometry[];
    labels: ExportText[];
    scaleBar: { start: ViewportPoint; end: ViewportPoint; label: string };
  };
  yardageRows: Array<{ origin: string; yards: number }>;
  text: ExportText[];
};

const SOURCE: SourceMetadata = {
  query: "synthetic-ctc014-experiment",
  endpoint: "synthetic-local-fixture",
  completedAt: "2026-01-01T00:00:00.000Z",
  bbox: "35,-80,35.01,-79.99",
  copyrightUrl: CTC014_ATTRIBUTION_URL,
};

const PROJECT: HoleStateV1 = {
  targets: [{ id: "t-000000000001", label: "Layup A", lat: 35.005, lon: -79.996 }],
  carries: [{ id: "c-000000000001", origin: { kind: "tee", sourceKey: CTC014_TEE_SOURCE_KEY }, distances: [150] }],
};

const STYLES: Record<FeatureKind | "route" | "carry-arc" | "target", ExportStyle> = {
  vegetation: { fill: "#a9c49b", stroke: "#3d6540", strokeWidth: 2, dash: [4, 3] },
  "generic-water": { fill: "#a8d5e5", stroke: "#245f78", strokeWidth: 2, dash: [6, 3] },
  "golf-water": { fill: "#70b6d2", stroke: "#174f69", strokeWidth: 3, dash: [] },
  rough: { fill: "#c6d6ae", stroke: "#667d4b", strokeWidth: 2, dash: [3, 3] },
  fairway: { fill: "#b8d59f", stroke: "#41653d", strokeWidth: 2, dash: [] },
  bunker: { fill: "#ead9a0", stroke: "#735e28", strokeWidth: 2, dash: [2, 2] },
  green: { fill: "#82b980", stroke: "#285c35", strokeWidth: 3, dash: [] },
  tee: { fill: "#d9e7bd", stroke: "#244e30", strokeWidth: 3, dash: [] },
  route: { fill: null, stroke: "#6d351d", strokeWidth: 4, dash: [8, 5] },
  "carry-arc": { fill: null, stroke: "#713b89", strokeWidth: 3, dash: [12, 5, 3, 5] },
  target: { fill: "#512c68", stroke: "#fffdf8", strokeWidth: 4, dash: [] },
};

function projectGeometry(geometry: Geometry, projection: Projection, sourceKey: SourceKey, kind: FeatureKind): ExportGeometry {
  if (geometry.type === "point") {
    return { type: "point", sourceKey, kind, point: projectCoordinate(projection, geometry.coordinate), radius: 4, style: STYLES[kind] };
  }
  const points = geometryCoordinates(geometry).map((coordinate) => projectCoordinate(projection, coordinate));
  return geometry.type === "line"
    ? { type: "line", sourceKey, kind, points, style: STYLES[kind] }
    : { type: "polygon", sourceKey, kind, points, style: STYLES[kind] };
}

function selectedHole(): { hole: NormalizedHole; projection: Projection } {
  const result = normalizeGolfCourse(fixture as OverpassResponse, SOURCE);
  const hole = result.holes.find(({ source }) => source.sourceKey === CTC014_HOLE_SOURCE_KEY);
  if (!hole) throw new Error("CTC-014 fixture hole is missing.");
  const projection = createProjection(holeCoordinates(hole));
  if ("kind" in projection) throw new Error(`CTC-014 projection failed: ${projection.kind}`);
  return { hole, projection };
}

export function createCtc014ExportScene(): Ctc014ExportScene {
  const { hole, projection } = selectedHole();
  const geometry: ExportGeometry[] = [];
  for (const kind of LAYER_ORDER) {
    for (const feature of hole.features.filter((entry) => entry.kind === kind && entry.geometry !== null)) {
      geometry.push(projectGeometry(feature.geometry!, projection, feature.source.sourceKey, feature.kind));
    }
  }
  if (hole.route) {
    geometry.push({
      type: "line",
      sourceKey: hole.source.sourceKey,
      kind: "route",
      points: geometryCoordinates(hole.route).map((coordinate) => projectCoordinate(projection, coordinate)),
      style: STYLES.route,
    });
  }

  const rings = carryRings(PROJECT.carries[0], hole, PROJECT.targets, projection);
  if (!Array.isArray(rings)) throw new Error(`CTC-014 carry failed: ${rings.kind}`);
  for (const ring of rings) {
    ring.segments.forEach((points, index) => geometry.push({
      type: "line",
      sourceKey: `${ring.carryId}/${index}`,
      kind: "carry-arc",
      points,
      style: STYLES["carry-arc"],
    }));
  }
  for (const target of PROJECT.targets) {
    geometry.push({
      type: "point",
      sourceKey: target.id,
      kind: "target",
      point: projectCoordinate(projection, target),
      radius: 8,
      style: STYLES.target,
    });
  }

  const bar = scaleBar(projection);
  const carryTop = rings[0].points.reduce((top, point) => point.y < top.y ? point : top);
  return {
    page: { width: LETTER_WIDTH_PT, height: LETTER_HEIGHT_PT, margin: PAGE_MARGIN_PT },
    courseSourceKey: CTC014_COURSE_SOURCE_KEY,
    holeSourceKey: CTC014_HOLE_SOURCE_KEY,
    map: {
      region: MAP_REGION,
      transform: { translateX: MAP_TRANSLATE_X, translateY: MAP_TRANSLATE_Y, scale: MAP_SCALE },
      geometry,
      labels: [{ role: "carry-label", text: "150 yd", x: carryTop.x, y: carryTop.y - 6, size: 14 }],
      scaleBar: { start: { x: 40, y: 542 }, end: { x: 40 + bar.logicalLength, y: 542 }, label: bar.label },
    },
    yardageRows: [{ origin: `Tee ${CTC014_TEE_SOURCE_KEY}`, yards: 150 }],
    text: [
      { role: "title", text: "Synthetic CTC-014 Course", x: 36, y: 48, size: 18 },
      { role: "subtitle", text: "Hole 1 | Par 4 | way/9000060101", x: 36, y: 70, size: 10 },
      { role: "yardage", text: "Tee way/9000060201: 150 yd carry", x: 36, y: 540, size: 9 },
      { role: "note", text: CTC014_NOTE, x: 36, y: 620, size: 8 },
      { role: "disclaimer", text: CTC014_DISCLAIMER, x: 36, y: 684, size: 7 },
      { role: "attribution", text: CTC014_ATTRIBUTION, x: 36, y: 710, size: 7 },
      { role: "attribution-url", text: CTC014_ATTRIBUTION_URL, x: 36, y: 724, size: 7 },
    ],
  };
}
`````

<!-- END AUDITED FILE 12/14: src/ctc014Scene.ts -->

<!-- BEGIN AUDITED FILE 13/14: test/e2e/ctc014-pdf.spec.ts -->

### test/e2e/ctc014-pdf.spec.ts

`````text
import { expect, test, type Page, type Route } from "@playwright/test";

async function isolateNetwork(page: Page) {
  await page.route("**/*", async (route: Route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") await route.continue();
    else throw new Error(`Unexpected external request: ${url.href}`);
  });
}

test("CTC-014 candidates produce independently attributable browser evidence", async ({ page }, testInfo) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await isolateNetwork(page);
  await page.goto("/ctc014.html");
  await expect
    .poll(async () => ({
      ready: await page.evaluate(() => typeof window.ctc014Experiment?.renderJsPdfDirect === "function"),
      pageErrors,
    }))
    .toEqual({ ready: true, pageErrors: [] });

  const evidence = await page.evaluate(async () => {
    const experiment = window.ctc014Experiment;
    async function measure(render: () => Uint8Array | Promise<Uint8Array>) {
      try {
        const pdf = await render();
        const bytes = pdf.byteLength;
        return { evidence: { ...await experiment.analyzePdf(pdf), bytes }, error: null };
      } catch (error) {
        return { evidence: null, error: error instanceof Error ? error.message : String(error) };
      }
    }
    return {
      direct: await measure(() => experiment.renderJsPdfDirect()),
      svg: await measure(() => experiment.renderJsPdfSvg()),
      pdfkitDirect: await measure(() => experiment.renderPdfKitDirect()),
      pdfkitSvg: await measure(() => experiment.renderPdfKitSvg()),
    };
  });
  await testInfo.attach("ctc014-candidate-evidence", {
    body: JSON.stringify(evidence, null, 2),
    contentType: "application/json",
  });
  console.log(JSON.stringify(evidence, null, 2));

  for (const result of [evidence.direct, evidence.svg]) {
    expect(result.error).toBeNull();
    const candidate = result.evidence!;
    expect(candidate.bytes).toBeGreaterThan(0);
    expect(candidate.pages).toBe(1);
    expect(candidate.width).toBeCloseTo(612, 1);
    expect(candidate.height).toBeCloseTo(792, 1);
    expect(candidate.text).toContain("Course geometry and map data");
    expect(candidate.text).toContain("https://www.openstreetmap.org/copyright");
    expect(candidate.text).toContain("219 yd / 200 m");
    expect(candidate.pathOperations).toBeGreaterThan(0);
    expect(candidate.imageOperations).toBe(0);
  }
  for (const result of [evidence.pdfkitDirect, evidence.pdfkitSvg]) {
    expect(result.evidence).toBeNull();
    expect(result.error).toContain("global is not defined");
  }

  const repeated = await page.evaluate(async () => {
    const experiment = window.ctc014Experiment;
    const runs = [];
    for (let index = 0; index < 5; index += 1) {
      const pdf = experiment.renderJsPdfDirect();
      const evidence = await experiment.analyzePdf(pdf);
      runs.push({
        pages: evidence.pages,
        width: evidence.width,
        height: evidence.height,
        text: evidence.text,
        pathOperations: evidence.pathOperations,
        imageOperations: evidence.imageOperations,
      });
    }
    return runs;
  });
  expect(repeated).toEqual(Array.from({ length: 5 }, () => repeated[0]));
});
`````

<!-- END AUDITED FILE 13/14: test/e2e/ctc014-pdf.spec.ts -->

<!-- BEGIN AUDITED FILE 14/14: vite.config.ts -->

### vite.config.ts

`````text
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
  build: {
    rollupOptions: {
      input: {
        app: "index.html",
        ctc014: "ctc014.html"
      }
    }
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"]
  }
});
`````

<!-- END AUDITED FILE 14/14: vite.config.ts -->
