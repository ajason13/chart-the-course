# CTC-020 Claude Final Audit Prompt

Act as final auditor for CTC-020, Implement ODbL source export for PDF workflow. Audit commit `ceb6f807da8a` (full commit `ceb6f807da8a68df0378d85da8b3e903ddfcd4ad`) on branch `ctc-020-odbl-source-export`. Claude Chat has no filesystem or GitHub access; this prompt embeds the relevant implementation files exactly as they exist at the audited commit.

## Required Verdict Format

Return exactly one verdict:

- `PASS`
- `PASS WITH MINOR FIXES`
- `FAIL`

Lead with blockers if any. Separate blockers from minor fixes. For each issue, cite the affected embedded file and behavior. State whether CTC-020 may move to Done after any minor fixes, and whether re-audit is required.

## Task Objective

CTC-020 Phase 1 implements a browser-local raw GIS source export for loaded course-detail OpenStreetMap/Overpass data. It supports the ODbL Section 4.6 source-availability mechanism for future PDF workflows while avoiding fake PDF UI and avoiding premature CTC-008 production PDF behavior.

## Accepted Scope

- Detail-mode-only raw GIS source export.
- No discovery-mode export surface.
- Preserve the exact raw Overpass response text separately from normalized geometry and user-authored project state.
- Track active source evidence in React state instead of re-reading private cache internals at export time.
- Allow stale export only when the visible detail result was rendered through explicit stale-data consent.
- Export deterministic JSON with MIME `application/json;charset=utf-8`, filename `ctc-gis-source-YYYYMMDDTHHmmssZ.json`, 2-space formatting, and a 1,048,576 byte cap measured against the final pretty-printed UTF-8 file.
- Emit primitive `osmElementsSummary` entries sorted by type order `node`, `relation`, `way`, then numeric ID, with shape `{ type, id, tagKeys }`.
- Exclude tag values, geometry, nodes, relation members, normalized geometry, project targets, carries, notes, accounts, telemetry, cloud sync, providers, endpoint failover, API keys, new dependencies, and production PDF behavior.

## Deferred / Out of Scope

- Direct visual adjacency to a real `Download PDF` control remains blocked until CTC-008 creates production PDF UI.
- PDF acknowledgements and written PDF footer attribution remain blocked until CTC-008.
- Same-release PDF/source release-gate verification remains a future CTC-008 integration gate.
- Do not treat the Phase 1 source export as full CTC-020 Done unless the accepted task boundary explicitly allows partial completion.

## Prior QA Decisions Claude Should Verify

Claude addendum review returned `READY FOR IMPLEMENTATION AFTER QA PLAN`. The final audit should specifically verify these implementation checkpoints:

- MC-1: `sourceAgeDays` is computed from `source.completedAt` to `exportedAt`, not from TTL expiry.
- MC-2: `consentState` and `isStaleSource` cannot disagree.
- MC-3: `osmElementsSummary` type-order tie-break is explicitly tested as `node`, `relation`, `way`.
- MC-4: active detail context/source matching is not implemented through a stale independent reference that can diverge from the active evidence.
- MC-5: discovery-mode source export is absent from the DOM, not merely an inert fake control.

## Verification Evidence

Executed on branch `ctc-020-odbl-source-export` before commit/push:

- `node_modules/.bin/playwright test test/e2e/app.spec.ts`: 16 passed.
- `npm run check`: scaffold verification passed, build passed, 67 Vitest tests passed, 17 Playwright tests passed.
- `git diff --check`: passed.
- `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`: passed; production license allow/deny checks passed; `npm audit --omit=dev --audit-level=high` reported 0 vulnerabilities.

## Source / Legal Context

External source checks recorded during CTC-020 selection on 2026-06-19:

- OpenStreetMap copyright and licence page: https://www.openstreetmap.org/copyright
- OpenStreetMap attribution guide: https://www.openstreetmap.org/copyright/attribution-guide/
- ODbL 1.0 text: https://opendatacommons.org/licenses/odbl/1-0/

The repo language intentionally says the raw export "supports" the ODbL Section 4.6 source-availability mechanism; it should not overstate that the implementation guarantees legal compliance.

## Changed Files at Audited Commit

Changed implementation and documentation files are embedded below.

### ATTRIBUTION.md

````md
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

CTC-020 Phase 1 adds a browser-local `Download Raw GIS Source (ODbL)` action
for loaded course-detail data. This source package supports the ODbL Section
4.6 source-availability mechanism described above by exporting the exact raw
Overpass JSON response text, exact query, endpoint, completion timestamp, bbox,
OSM element type/ID summaries, and the OpenStreetMap copyright URL. It is a
partial source-export capability only; final PDF adjacency and PDF
acknowledgements remain gated on real CTC-008 PDF export behavior.

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

CTC-019 implements browser-durable Overpass response caching in IndexedDB when
available. Cached records preserve exact raw Overpass response text, exact query
text, endpoint, completion timestamp, bbox, and the OpenStreetMap copyright URL.
Each durable record includes the internal marker `license: "ODbL-1.0"` to
identify OSM-derived cache content as ODbL-covered provenance. This marker is
not a user-facing export schema and does not satisfy the later CTC-020 raw GIS
source export requirement.

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

````

### CONTEXT.md

````md
# Chart the Course Context

Last updated: 2026-06-20

## Current Status

CTC-020 selected for Gemini specification drafting - 2026-06-19. Codex
confirmed clean synchronized `main` at
`fd901f07228396f128af36c4fbb28b62ed46088e`, confirmed PR #7 is merged with
CI `verify` successful, and confirmed CTC-019 remains `5. Done` in Notion.
Live Notion comparison confirmed CTC-020 and CTC-008 are still Backlog and
CTC-014 remains `5. Done`. CTC-020 is now the highest-value unblocked next
task because CTC-019 created durable exact raw Overpass response/source
evidence that can support source availability, while CTC-008 production PDF
export remains higher risk and still depends on same-release CTC-020 raw GIS
source availability, reviewed production PDF dependency adoption, a notes
decision, and rendered-page visual regression coverage. CTC-020 is selected
for specification only: do not create fake or inert `Download PDF` UI, do not
combine CTC-020 with CTC-008, and do not claim the full task Done unless the
PDF-adjacent and acknowledgement criteria are truthfully satisfied or a
recorded task decision changes the acceptance boundary. The specification must
resolve raw-source export schema, filename, MIME type, validation, dangerous-key
handling, size limits, Blob/object URL lifecycle, stale/missing/corrupt evidence
behavior, separation from user-authored project export and normalized geometry,
and the same-release PDF/source-export gate. Current OSM and ODbL primary
sources were checked on 2026-06-19:
`https://www.openstreetmap.org/copyright`,
`https://www.openstreetmap.org/copyright/attribution-guide/`, and
`https://opendatacommons.org/licenses/odbl/1-0/`. CTC-020 moved to
`1. Spec Drafting (Gemini)`. The Gemini prompt is
`docs/handoffs/ctc-020-gemini-specification-prompt.md`; attach the listed files
individually. Prompt SHA-256:
`6e220e520da0a7e1a5354bdd0f7004487950d9567981dbd7b949b4b5a193ec38`. Stop at
the specification gate until Gemini returns a report that Codex critically
reviews.

Gemini CTC-020 response review - 2026-06-19. Codex rejected the response as an
implementation baseline and recorded the review in
`docs/handoffs/ctc-020-gemini-specification-review.md`. Accepted direction is
limited to no fake PDF controls, Phase 1 source-export core as a possible
partial deliverable, JSON as a likely export format, and preserving the CTC-008
same-release source-export/PDF attribution gate. Blocking issues include the
wrong CTC-019 IndexedDB contract, non-exact `rawResponse` object instead of raw
text, malformed schema, false AGPL text in the example OSM payload, unapproved
Ajv/Jest/Web Worker/XML scope, vague PDF release gate, unsupported size limits,
oversimplified prototype-pollution handling, unresolved stale/empty export
behavior, and legal overstatement. CTC-020 remains in
`1. Spec Drafting (Gemini)`. Use
`docs/handoffs/ctc-020-gemini-revision-prompt.md` for the next Gemini revision;
do not advance to Claude QA planning or runtime implementation until Codex
accepts a corrected baseline.

Gemini CTC-020 revised baseline accepted for Claude QA planning - 2026-06-19.
Codex accepted Gemini's revised response as the corrected baseline with
mandatory corrections recorded in
`docs/handoffs/ctc-020-gemini-revised-baseline-review.md`. Accepted direction:
CTC-020 cannot be fully Done until real CTC-008 PDF UI exists; no fake PDF
controls; Phase 1 may implement a partial browser-local raw GIS source export
core; source export should be deterministic versioned JSON preserving exact
`rawResponse` text; valid empty responses are exportable; stale source is
exportable only when current visible data was rendered through explicit
CTC-019 stale consent; and CTC-008 must later prove same-release source export,
PDF attribution, and adjacency gates. Codex corrections require no private
`overpassCache.memory` access, explicit active source evidence state or a
reviewed public cache read API, a leading `1_048_576` byte serialized export
cap aligned with CTC-019 unless Claude recommends otherwise, existing
Vitest/Playwright tooling, exact source metadata validation, and separation
from `src/project.ts` user-authored export and normalized geometry. Claude QA
planning prompt: `docs/handoffs/ctc-020-claude-qa-planning-prompt.md`.
CTC-020 may move to `2. QA Planning (Claude)`, but runtime implementation
remains blocked until Claude returns a QA plan and Codex critically reviews it.
Claude prompt packaging update - 2026-06-19. Per maintainer request,
`docs/handoffs/ctc-020-claude-qa-planning-prompt.md` was rewritten as a
self-contained Claude Chat prompt with embedded repository file contents
instead of attachment instructions. It embeds 15 snapshots: `AGENTS.md`,
`CONTEXT.md`, `ATTRIBUTION.md`, `SECURITY.md`,
`docs/overpass-query-contract.md`,
`docs/experiments/ctc-014-vector-pdf-evaluation.md`,
`docs/handoffs/ctc-020-gemini-specification-review.md`,
`docs/handoffs/ctc-020-gemini-revised-baseline-review.md`, `src/App.tsx`,
`src/overpass.ts`, `src/overpassCache.ts`, `src/project.ts`,
`src/normalize.ts`, `test/e2e/app.spec.ts`, and
`fixtures/overpass/synthetic-golf-course-ctc006.json`, each with SHA-256
markers. Prompt SHA-256:
`780917835128b94c084866674dd1578e88716ed2d16bccf8c862060788bf03f4`.
Claude QA planning response - 2026-06-19. Claude returned `NEEDS SPEC FIXES`;
Codex accepts the verdict and recorded the disposition in
`docs/handoffs/ctc-020-claude-qa-plan-review.md`. The six blockers require
explicit active source evidence state, detail-mode-only Phase 1 scope, a
concrete deterministic `osmElementsSummary` shape, full pretty-printed export
size-cap semantics, stale-consent capture in `renderStaleData()`, and atomic
source-evidence replacement/clearing across request and display transitions.
Codex resolved the blockers and minor corrections in
`docs/handoffs/ctc-020-spec-addendum.md`: Phase 1 is detail-only and partial;
active evidence shape is `{ mode: "detail", cacheKey, rawResponse, source,
consentState }`; discovery export is out of scope; stale export requires
explicit consent state; `osmElementsSummary` is sorted `{ type, id, tagKeys }`
without tag values/geometry/nodes/members; the `1_048_576` byte cap applies to
the final pretty-printed JSON file; filename timestamps come from `exportedAt`;
and required Vitest/Playwright/doc coverage is enumerated. Re-review prompt:
`docs/handoffs/ctc-020-claude-addendum-review-prompt.md`. CTC-020 remains in
`2. QA Planning (Claude)` and runtime implementation remains blocked until
Claude accepts the addendum and Codex records the implementation gate.
Claude addendum review - 2026-06-20. Claude returned
`READY FOR IMPLEMENTATION AFTER QA PLAN`; Codex accepts the verdict and recorded
it in `docs/handoffs/ctc-020-claude-addendum-review.md`. CTC-020 may move to
`3. In Development (ChatGPT)`. Implementation must follow
`docs/handoffs/ctc-020-spec-addendum.md` and the minor implementation/audit
checkpoints: compute `sourceAgeDays` from `source.completedAt` to `exportedAt`,
test `isStaleSource`/`consentState` consistency, test `osmElementsSummary`
type order `node`, `relation`, `way`, keep source-context comparison atomic,
and make discovery-mode source export absent from the DOM. Final Claude audit
remains mandatory before CTC-020 can close.

CTC-020 Phase 1 implementation - 2026-06-20. Branch
`ctc-020-odbl-source-export` implements detail-mode-only raw GIS source export
without PDF behavior, fake PDF controls, new dependencies, providers, endpoint
failover, API keys, accounts, telemetry, cloud sync, or external user-data
flows. The app now tracks explicit active detail source evidence with exact
raw Overpass response text, source metadata, cache key, and consent state;
discovery-mode export is absent from the DOM; stale exports require
stale-render consent captured by `renderStaleData()`; hole-selector changes do
not invalidate source evidence; new request/cancel/error transitions clear or
replace it. `src/gisSourceExport.ts` produces deterministic
`application/json;charset=utf-8` downloads named
`ctc-gis-source-YYYYMMDDTHHmmssZ.json`, preserves `rawResponse` exactly as a
string, emits sorted `{ type, id, tagKeys }` summaries in type order `node`,
`relation`, `way`, excludes tag values and normalized/user-authored data,
computes stale `sourceAgeDays` from source completion to export time, and
enforces the 1,048,576 byte cap against the final pretty-printed UTF-8 JSON
file. Docs updated: `ATTRIBUTION.md`, `SECURITY.md`, and
`docs/overpass-query-contract.md`. Verification passed: `npm run check`
(scaffold verification, build, 67 Vitest tests, 17 Playwright tests),
`node_modules/.bin/playwright test test/e2e/app.spec.ts` (16 tests),
`git diff --check`, and
`npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`
with production audit reporting 0 vulnerabilities. CTC-020 remains in
`3. In Development (ChatGPT)` until final Claude audit is prepared and resolved.

CTC-019 selected for Gemini specification drafting - 2026-06-13. Codex
confirmed clean synchronized `main` at
`f9b3f4ff670cd370b3a48a5b6e5623dd93c84fcf`, with latest `main` CI
successful. CTC-014 remains `5. Done`; PR #6 remains merged as
`33ac3cc6afd533a7c05fd6d3403c20b37c6037ea` with required CI successful,
and the isolated CTC-014 experiment remains outside the production app import
path. Live Notion comparison confirmed CTC-019, CTC-020, and CTC-008 were
Backlog before selection. CTC-019 is the highest-value independently
deliverable task because the runtime still uses temporary session storage,
validates only raw response plus `source.query` on cache reads, has no TTL
enforcement, explicit refresh/cooldown, Retry-After/backoff policy, or
already-aborted-signal pre-check. CTC-020 remains downstream because its
accepted PDF-adjacency and acknowledgement criteria depend on production PDF
behavior that does not exist. CTC-008 remains downstream because production
jsPDF adoption, rendered-page regression, notes behavior, and same-release
CTC-020 source availability remain unresolved reviewed gates. CTC-019 must
preserve deterministic CTC-004 cache keys and exact raw response/source
evidence, keep normalized geometry and user-authored project state separate,
and must not implement CTC-020 source export, production PDF behavior,
providers, endpoint failover, API keys, accounts, servers, analytics,
telemetry, cloud sync, or unrelated persistence. CTC-019 moved to
`1. Spec Drafting (Gemini)`. Stop at the Gemini specification gate until the
response is critically reviewed and Claude adversarial QA planning is
completed and critically reviewed. The self-contained Gemini specification
prompt is at `docs/handoffs/ctc-019-gemini-specification-prompt.md`; its 18
embedded relevant repository files were verified byte-for-byte exact and its
SHA-256 is
`1835861987cc2f26508f24b7272dcfbad467b1e436821ecfbe7abd50e045c536`.
Startup-gate verification passed: `npm run check` with scaffold policy, build,
44 Vitest tests, and 15 Playwright tests; `git diff --check`; and the canonical
compliance flow with allowed production licenses and 0 production
vulnerabilities.
Gemini's proposed CTC-019 Deep Research plan was rejected before research
started because it replaced the concrete durable Overpass cache/request-policy
specification with a generic open-source product-management playbook covering
community alignment, roadmaps, vibe-coding translation, epics/user stories,
AI-agent task formatting, generic architecture/compliance risks, and Notion
templates/database layouts. It did not plan the required current-primary-source
research or exact decisions for IndexedDB schema/upgrades, strict durable-entry
validation, 7-day TTL/stale behavior, accessible refresh cooldown, bounded
Retry-After/backoff, cancellation, request identity, ODbL evidence ownership,
or deterministic tests. No decisions from that plan are accepted and CTC-019
remains in Spec Drafting. Submit
`docs/handoffs/ctc-019-gemini-plan-correction.md` as the pasted instruction
together with the attached self-contained specification prompt.
Gemini's corrected CTC-019 Deep Research plan was accepted on 2026-06-17
because it now tracks the required durable Overpass cache/request-policy
specification: native IndexedDB and storage behavior, strict versioned entry
validation, 7-day TTL and stale-data policy, accessible refresh action,
bounded 429/Retry-After backoff, request identity, security/privacy
boundaries, ODbL evidence marking for later CTC-020, App/state-machine
integration, repository doc updates, and deterministic Vitest/Playwright
coverage. This accepts the research plan only; no implementation decisions are
accepted until the full 12-section Gemini specification is returned and
critically reviewed. CTC-019 remains in `1. Spec Drafting (Gemini)`.
Antigravity deep research was run from the repository on 2026-06-18 using
`docs/handoffs/ctc-019-antigravity-research-prompt.md`. It produced
`docs/handoffs/ctc-019-antigravity-research-spec.md`. Codex critically reviewed
the result in `docs/handoffs/ctc-019-antigravity-spec-review.md`. The research
is relevant but not implementation-ready as written. Accepted direction is
limited to native IndexedDB, durable discovery/detail cache entries preserving
exact raw responses/source metadata, strict metadata validation, explicit
refresh with per-key rate limiting, bounded Retry-After/backoff, preserved
request identity, no forbidden browser headers, clear ODbL evidence boundaries,
and deterministic unit/Playwright coverage. Required corrections include no
automatic stale-data rendering without visible user choice, no persistence/quota
guarantees, exact query/key validation, consistent Retry-After caps,
deterministic jitter or no-jitter policy, realistic IndexedDB cancellation
semantics, session/memory fallback as non-durable degradation only, and no
CTC-020 source-export schema. CTC-019 remains in `1. Spec Drafting (Gemini)`;
no feature branch, runtime implementation, dependency change, provider,
source-export behavior, or PDF behavior is authorized.
Project workflow update - 2026-06-18. Gemini Chat in Deep Research mode is the
active Spec Drafter path for CTC-019. The task remains in
`1. Spec Drafting (Gemini)`, and the next gate is a Gemini Chat corrected
specification baseline that addresses
`docs/handoffs/ctc-019-antigravity-spec-review.md` and the accepted Gemini
plan-correction scope. Antigravity was diagnosed as unsuitable for the current
CTC-019 correction loop because the local CLI requires unsandboxed log and
localhost access, the previously used `gemini-3.1-pro` flag is not a valid
local model label, Gemini model routes are quota-exhausted, and the CLI exits
0 without surfacing the quota failure to stdout. The prior Antigravity research
and Codex review remain useful research input, but they are not an accepted
implementation baseline. Do not send raw Antigravity output directly to Claude.
Do not create a feature branch or implement runtime behavior until Gemini Chat
Deep Research returns the corrected CTC-019 spec, Codex critically reviews it,
and Claude adversarial QA planning is completed and critically reviewed.
Prompting workflow update - 2026-06-18. Google Gemini documentation confirms
that Deep Research works through a research-plan, source-selection, and report
workflow, and Google warns that overly large file uploads can miss connections
or details across the content. For CTC-019, prefer the lean Gemini Chat prompt
at `docs/handoffs/ctc-019-gemini-chat-correction-prompt.md` plus file
attachments over the older 302 KB prompt with 18 embedded files. Attach the
listed source-of-truth files, require Gemini to show a CTC-019-specific
research plan before starting, and reject generic product-management plans.
`docs/governance-workflow.md` now records Gemini Chat and Claude Chat prompting
rules. Claude handoffs should use clear success criteria, structured sections
or XML-style delimiters, source-grounded claims, long documents before the
final query, and explicit blocker/minor-fix verdict instructions.
Gemini attachment update - 2026-06-18. Gemini Chat did not accept the focused
CTC-019 ZIP workflow, so use normal individual file uploads for the next Deep
Research attempt. The ZIP artifact from the trial is superseded and should not
be uploaded. The prompt at
`docs/handoffs/ctc-019-gemini-chat-correction-prompt.md` lists the files to
attach individually and still avoids pasting full file contents into the prompt
body.
Gemini Chat CTC-019 response review - 2026-06-19. The returned specification is
not implementation-ready and is rejected as the corrected baseline. Review is
recorded in `docs/handoffs/ctc-019-gemini-chat-spec-review.md`. Blocking issues
include a wrong record `mode` contract, missing exact raw response/source
metadata, new incompatible cache-key/query-normalization behavior, invented
request identity headers/contact text, unrealistic IndexedDB cancellation and
upgrade semantics, ungoverned `fake-indexeddb`/JSDOM/browser-matrix proposals,
product-management scope creep, and CTC-020 export leakage. Do not advance to
Claude QA planning from this response. CTC-019 remains in
`1. Spec Drafting (Gemini)` until a corrected baseline is accepted.
Gemini Chat baseline revision prompt - 2026-06-19. Use
`docs/handoffs/ctc-019-gemini-chat-baseline-revision-prompt.md` for the next
Gemini Chat Deep Research attempt. This prompt is revision-only: it requires a
single corrected baseline, explicitly forbids the prior Gemini mistakes, and
requires traceability to both the 17 Antigravity review corrections and the 15
Gemini Chat review blockers. Gemini Chat currently accepts at most 10 uploaded
files per prompt, so attach only the prompt's required 10-file first batch at
startup. Use the listed follow-up files only in a second upload batch if Gemini
asks for more context. Do not advance to Claude QA planning until Codex accepts
the returned baseline.
Gemini Chat corrected CTC-019 baseline accepted for Claude QA planning -
2026-06-19. Codex reviewed the corrected Gemini Chat response and accepted it
for the next gate with mandatory corrections recorded in
`docs/handoffs/ctc-019-gemini-chat-corrected-baseline-review.md`. The accepted
direction includes dedicated `src/overpassCache.ts`, native IndexedDB
`ChartTheCourse` v1 `courseGeometry` storage, non-durable memory fallback,
existing discovery/detail cache keys, exact `rawResponse` and source metadata,
7-day TTL, visible stale-data consent, native refresh button disabled during
active fetch/cooldown, bounded Retry-After/backoff, realistic AbortSignal and
IndexedDB semantics, normal browser origin/referrer behavior plus existing
Overpass QL identity comments, and internal-only `license: "ODbL-1.0"`
provenance. Codex corrections require strict validation of every required
metadata field (`query`, `endpoint`, `completedAt`, `bbox`, `copyrightUrl`),
final backoff delay capping after deterministic jitter, one consistent
Retry-After cap/visible rate-limit policy, diagnostic-only StorageManager
usage, no automatic stale rendering even when offline, soft handling of
browser/private-mode storage variability, and no CTC-020/CTC-008 leakage.
Claude QA planning prompt is at
`docs/handoffs/ctc-019-claude-qa-planning-prompt.md`. On 2026-06-19 this
prompt was rewritten as a self-contained Claude Chat prompt with embedded
contents from the 10 relevant repository files, because Claude Chat handles
long pasted file content reliably and this avoids upload/context ambiguity.
The embedded snapshots were verified against the current repository using
SHA-256 markers in the prompt. CTC-019 may move to
`2. QA Planning (Claude)`, but runtime implementation remains blocked until
Claude returns an adversarial QA plan and Codex critically reviews it.
Claude QA planning response - 2026-06-19. Claude returned `NEEDS SPEC FIXES`.
Codex accepts the QA plan but not implementation authorization. Claude's six
blockers are narrow missing decisions: numeric `schemaVersion` and mismatch
policy, `sizeBytes` computation, oversized-record threshold, IndexedDB
`versionchange`/`onblocked` policy, refresh cooldown scope, and explicit
refresh behavior when a fresh cache entry exists. Claude also requested a hard
retry-attempt cap. Codex recorded the response disposition in
`docs/handoffs/ctc-019-claude-qa-plan-review.md` and resolved the gaps in
`docs/handoffs/ctc-019-spec-addendum.md`: `schemaVersion: 1`, no v1 migration,
full serialized-record UTF-8 `sizeBytes`, 1 MiB durable-record ceiling,
close-on-`versionchange` with non-durable memory fallback, per-cache-key
refresh cooldown with global one-active-live-request guard, explicit refresh as
a cache bypass even for fresh entries, and at most three retries after the
initial request. Claude addendum re-review prompt is at
`docs/handoffs/ctc-019-claude-addendum-review-prompt.md`. CTC-019 remains in
`2. QA Planning (Claude)`; do not implement runtime behavior until Claude
accepts the addendum and Codex records the implementation gate.
Claude addendum re-review - 2026-06-19. Claude returned
`READY FOR IMPLEMENTATION AFTER QA PLAN` with no blockers. Minor
implementation/audit checkpoints are recorded in
`docs/handoffs/ctc-019-claude-addendum-review.md` and folded into
`docs/handoffs/ctc-019-spec-addendum.md`: over-cap `Retry-After` is terminal
for the user action and does not consume retry slots; hit-time `sizeBytes`
recomputation must reset `sizeBytes: 0` before serializing/measuring; and
already-consented stale data may remain visible after later refresh failure
only with visible stale/rate-limit/error state, while newly rendering stale
data still requires explicit consent. CTC-019 may move to
`3. In Development (ChatGPT)`. Implementation must follow the accepted Gemini
baseline, Codex corrections, Claude QA plan, and the addendum; no CTC-020
source export, CTC-008 PDF behavior, provider expansion, dependency addition,
endpoint failover, account/server/telemetry/cloud sync, or unrelated
persistence is authorized.
CTC-019 is Done - 2026-06-19. Codex added native IndexedDB
durable Overpass caching in `src/overpassCache.ts`, removed the runtime
session-storage cache path, preserved existing discovery/detail cache keys and
exact raw response/source metadata, added strict versioned durable-record
validation with internal `license: "ODbL-1.0"`, implemented 7-day TTL,
non-durable memory fallback, explicit `Refresh course data`, per-key cooldown,
global one-active-live-request behavior, stale-data consent, terminal
over-cap `Retry-After`, deterministic capped backoff, and max three retries
after the initial request. Documentation updates are in
`docs/overpass-query-contract.md`, `ATTRIBUTION.md`, and `SECURITY.md`.
Local verification passed during development: `npm run build`,
`npm run test:unit`, `npm run test:e2e`, `npm run check`, `git diff --check`,
and `npm_config_cache=/private/tmp/chart-the-course-npm-cache
scripts/compliance.sh` with 0 production vulnerabilities. Claude final audit
returned `PASS WITH MINOR FIXES` with no blockers and no re-audit required.
The only required fix, MF-1, restored conditional assertive error-state
announcements on the status live region and restored the Playwright assertion
that catches 429 error states. Post-fix verification passed:
`npm run build && node_modules/.bin/playwright test test/e2e/app.spec.ts
--grep "rate limit"`, `npm run check`, `git diff --check`, and
`npm_config_cache=/private/tmp/chart-the-course-npm-cache
scripts/compliance.sh` with 0 production vulnerabilities. PR #7:
`https://github.com/ajason13/chart-the-course/pull/7`. The final Claude
audit prompt is `docs/handoffs/ctc-019-claude-final-audit-prompt.md`.

CTC-014 is Done - 2026-06-13. After CTC-007 integration, Codex
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
Implementation commit `fc99982` passed pre-audit verification: `npm run check`
with scaffold policy, build, 44 Vitest tests, and 15 Playwright tests;
`git diff --check`; and canonical compliance with allowed production licenses
and 0 production vulnerabilities. The self-contained Claude final-audit bundle
is at `docs/handoffs/ctc-014-claude-final-audit-prompt.md`; its 14 embedded
relevant repository files were verified byte-for-byte against `fc99982` and
its SHA-256 is
`aa48e21c06b9082cdb69b0f168f18addd2ab9563fccf232f95a3e1e385df14be`.
Stop at the final-audit gate until Claude returns a verdict.
Claude final audit returned `PASS WITH MINOR FIXES` with no blockers and no
re-audit required for confined fixes. MF-1 passes the already-computed scene
scale into direct-jsPDF style rendering instead of rebuilding the scene for
each geometry. MF-2 retains and explicitly verifies the four-element carry
dash contract: PDF.js confirms direct jsPDF emits the scaled four-element dash
operator. MF-3 asserts the complete required attribution string including ©.
Run the full verification and compliance gates, then integrate the branch and
mark CTC-014 Done.
Post-fix verification passed: `npm run check` with scaffold policy, build, 44
Vitest tests, and 15 Playwright tests; `git diff --check`; and canonical
compliance with allowed production licenses and 0 production vulnerabilities.
PR #6 passed required CI and merged into `main` as
`33ac3cc6afd533a7c05fd6d3403c20b37c6037ea`. Direct jsPDF drawing from the
typed export scene is the accepted evidence-based recommendation for a later
production-adoption review. No production PDF dependency or export UI is
adopted by CTC-014, and CTC-008/CTC-020 release coupling remains mandatory.

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
- CTC-014 is Done and recommends direct jsPDF drawing for a later separate
  production-adoption review. Do not adopt it as a production dependency or
  ship PDF export without that reviewed scope and the CTC-020 release gate.
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

````

### SECURITY.md

````md
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
- Browser-local IndexedDB storage for Overpass raw responses and source
  metadata. This cache is same-origin browser storage, may be evicted or
  unavailable in restricted/private contexts, and must not store account data,
  telemetry identifiers, API keys, or unrelated user-authored project data.
- Dependency license and vulnerability gates.
- Generated PDF attribution and raw GIS source export behavior once PDF export
  ships.

The app must not rely on custom browser `User-Agent` headers for API identity.
Use app origin/referrer where available plus Overpass QL identifying comments.
If durable cache storage fails, the app may degrade to non-durable in-memory
storage for the active session only; this fallback must not be treated as
persistent source availability.

Raw GIS source export must preserve exact Overpass response text while deriving
only a primitive OSM element summary. The Phase 1 summary records element type,
ID, and sorted tag keys only; it does not copy tag values, geometry, node lists,
relation members, user-authored project data, or normalized geometry. Dangerous
property names from OSM tags are treated as inert strings only and must not be
assigned into application objects.

````

### docs/overpass-query-contract.md

````md
# Overpass Query Contract

Status: Implemented as a bounded CTC-004 browser spike on 2026-06-06 and
durable-cache/request-policy hardened by CTC-019 on 2026-06-19.

This contract defines the Chart the Course Overpass API request shape for
course discovery and course-detail loading. CTC-004 implemented the bounded
browser spike; CTC-019 adds durable browser caching, explicit refresh, and
bounded retry behavior without adding source-export or PDF behavior.

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
- Cache successful public Overpass responses locally in IndexedDB where
  available. Non-durable memory fallback is allowed only as graceful
  degradation when IndexedDB is unavailable, blocked, or fails.
- CTC-004 cache keys are
  `ctc:overpass:v1:discovery:{bbox}:{encoded-lowercase-name}` and
  `ctc:overpass:v1:detail:{bbox}`.
- Never query on keystrokes; require an explicit search action.
- On HTTP `429`, parse `Retry-After` delta-seconds or HTTP-date values when the
  browser exposes the header. Wait only up to 60 seconds; a longer value is a
  terminal visible rate-limit state for that user action. Missing, malformed,
  or unexposed `Retry-After` falls back to deterministic capped backoff.
- Bounded backoff uses deterministic timing capped after jitter at 30 seconds
  and at most three retries after the initial request.
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

CTC-019 stores successful discovery and detail responses in browser IndexedDB
when available. The database name is `ChartTheCourse`, schema version is `1`,
the object store is `courseGeometry`, and the inline key path is `key`.
Records preserve exact raw Overpass response text as `rawResponse` and keep
source metadata separate from normalized geometry and user-authored project
state.

Durable records include:

- `schemaVersion: 1`.
- `key`: existing discovery/detail cache key.
- `mode`: `discovery` or `detail`.
- `storedAt` and `expiresAt`, where `expiresAt = storedAt + 604800000`.
- `rawResponse`: exact response text.
- `source.query`, `source.endpoint`, `source.completedAt`, `source.bbox`, and
  `source.copyrightUrl`.
- `license: "ODbL-1.0"` as an internal provenance marker only.
- `sizeBytes`: UTF-8 byte length of the normalized serialized record with
  `sizeBytes: 0`.

Fresh cache hits validate every required field, exact query, endpoint, bbox,
copyright URL, TTL, response shape, size, and ODbL marker. Invalid,
incompatible, corrupt, oversized, or expired entries are not fresh hits.
Deletion is best-effort and deletion failure still returns a miss. Entries over
1 MiB are not written durably.

Expired OSM data is never rendered automatically. If a live refresh fails and
stale data exists, the user must make an explicit visible choice before stale
data is rendered. `navigator.onLine` may inform copy only and must not bypass
consent.

The durable cache is internal provenance only. It does not implement CTC-020
raw GIS source export, exported file schemas, download UI, or CTC-008 PDF
behavior.

CTC-020 Phase 1 exports loaded detail-mode source evidence through a browser
download action. Discovery-mode export is out of scope. The app tracks explicit
active source evidence for detail results instead of re-reading private cache
internals at download time. Active source evidence contains:

- detail cache key;
- exact `rawResponse` text;
- exact `source.query`, `source.endpoint`, `source.completedAt`,
  `source.bbox`, and `source.copyrightUrl`;
- consent state: `fresh` or `stale-consented`.

The export envelope is versioned JSON with MIME type
`application/json;charset=utf-8`, filename pattern
`ctc-gis-source-YYYYMMDDTHHmmssZ.json`, 2-space formatting, deterministic root
field ordering, and a 1,048,576 byte cap measured against the final
pretty-printed UTF-8 file. This cap includes envelope metadata, summary fields,
and exact raw response text; a rendered cache record near the durable-cache
ceiling may therefore be too large to export and must produce a visible error.

Exported root fields are:

- `bbox`;
- `completedAt`;
- `consentState`;
- `copyrightUrl`;
- `endpoint`;
- `exportVersion`;
- `exportedAt`;
- `isStaleSource`;
- `license`;
- `osmElementsSummary`;
- `query`;
- `rawResponse`;
- `sourceAgeDays` for stale-consented exports only.

`osmElementsSummary` contains deterministic primitive entries sorted by type
order `node`, `relation`, `way` and numeric ID:

```json
{
  "type": "way",
  "id": 123,
  "tagKeys": ["golf", "ref"]
}
```

The summary excludes tag values, geometry, nodes, members, bounds, center, and
all other raw element fields. Exact source evidence remains in `rawResponse`.
Valid empty Overpass responses are exportable with `osmElementsSummary: []`.
Stale source is exportable only when the currently visible detail result was
rendered through explicit stale-data consent.

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

````

### src/App.tsx

````tsx
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
  sourceMetadata,
  validateResponse,
  type Bbox,
  type CachedResponse,
  type OverpassElement,
  type OverpassResponse,
  type RequestFailure,
} from "./overpass";
import { overpassCache, type CacheLookup, type OverpassCacheMode } from "./overpassCache";
import {
  buildGisSourceExport,
  GIS_SOURCE_EXPORT_MIME,
  type ActiveSourceEvidence,
  type SourceConsentState,
} from "./gisSourceExport";
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
  | { kind: "empty"; mode: "discovery" | "detail"; cached: boolean; response: OverpassResponse; source: CachedResponse["source"] }
  | { kind: "success"; mode: "discovery" | "detail"; cached: boolean; response: OverpassResponse; source: CachedResponse["source"] }
  | { kind: "rate-limit"; retryAfterMs?: number }
  | { kind: "timeout" }
  | { kind: "network"; message: string }
  | { kind: "http"; status: number }
  | { kind: "parse" }
  | { kind: "shape" };

const INITIAL_FIELDS = { south: "", west: "", north: "", east: "" };
const REFRESH_COOLDOWN_MS = 5_000;

type RequestOptions = {
  bypassCache?: boolean;
  manualRefresh?: boolean;
};

type RequestContext = {
  mode: OverpassCacheMode;
  bbox: Bbox;
  query: string;
  cacheKey: string;
  timeout: number;
};

type StaleCandidate = {
  context: RequestContext;
  cached: CachedResponse;
  response: OverpassResponse;
  recordDate: string;
};

function stateMessage(state: ViewState): string {
  switch (state.kind) {
    case "idle": return "Enter a bounded location and submit when ready.";
    case "invalid": return state.message;
    case "loading": return `Loading ${state.mode} results.`;
    case "cancelled": return "Request cancelled.";
    case "empty": return `No ${state.mode} results were returned${state.cached ? " from durable cache" : ""}.`;
    case "success": return `${state.response.elements.length} raw ${state.mode} entities loaded${state.cached ? " from durable cache" : ""}.`;
    case "rate-limit": return state.retryAfterMs && state.retryAfterMs > 60_000
      ? "Overpass requested a longer rate-limit wait than this app will hold. Try again later."
      : "Overpass rate-limited this request. Try again later.";
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
  const [refreshStatus, setRefreshStatus] = useState("Refresh course data is available after loading results.");
  const [staleCandidate, setStaleCandidate] = useState<StaleCandidate | null>(null);
  const [activeContext, setActiveContext] = useState<RequestContext | null>(null);
  const [activeSourceEvidence, setActiveSourceEvidence] = useState<ActiveSourceEvidence | null>(null);
  const refreshCooldowns = useRef(new Map<string, number>());
  const [invalidField, setInvalidField] = useState<keyof Bbox | "courseName" | null>(null);
  const [selectedHoleKey, setSelectedHoleKey] = useState("");
  const [projectHoles, setProjectHoles] = useState<Partial<Record<SourceKey, HoleStateV1>>>({});
  const [projectErrors, setProjectErrors] = useState<ValidationError[]>([]);
  const [projectMessage, setProjectMessage] = useState("");
  const [sourceExportMessage, setSourceExportMessage] = useState("");
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

  function exportGisSource() {
    const result = buildGisSourceExport(activeSourceEvidence, activeContext);
    if (!result.ok) {
      setSourceExportMessage(result.message);
      return;
    }
    const blob = new Blob([result.text], { type: GIS_SOURCE_EXPORT_MIME });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = result.filename;
    document.body.appendChild(anchor);
    anchor.click();
    requestAnimationFrame(() => {
      URL.revokeObjectURL(url);
      anchor.remove();
    });
    setSourceExportMessage(result.envelope.isStaleSource
      ? `Raw GIS source export started with stale OpenStreetMap data from ${result.envelope.completedAt}.`
      : "Raw GIS source export started.");
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
    setActiveSourceEvidence(null);
    if (failure.kind === "cancelled") setState({ kind: "cancelled" });
    else if (failure.kind === "timeout" || (failure.kind === "http" && failure.status === 504)) setState({ kind: "timeout" });
    else if (failure.kind === "rate-limit") setState({ kind: "rate-limit", retryAfterMs: failure.retryAfterMs });
    else if (failure.kind === "http") setState({ kind: "http", status: failure.status });
    else setState({ kind: "network", message: failure.message });
  }

  function displayResult(
    mode: "discovery" | "detail",
    cached: boolean,
    response: OverpassResponse,
    source: CachedResponse["source"],
    context: RequestContext,
    rawResponse?: string,
    consentState: SourceConsentState = "fresh",
  ) {
    setActiveContext(context);
    setActiveSourceEvidence(mode === "detail" && rawResponse
      ? { mode, cacheKey: context.cacheKey, rawResponse, source, consentState }
      : null);
    setSourceExportMessage("");
    setState(response.elements.length
      ? { kind: "success", mode, cached, response, source }
      : { kind: "empty", mode, cached, response, source });
  }

  function cacheKeyForCurrentResult(): string | null {
    return state.kind === "success" || state.kind === "empty" ? activeContext?.cacheKey ?? null : null;
  }

  function cooldownRemaining(cacheKey: string): number {
    return Math.max(0, (refreshCooldowns.current.get(cacheKey) ?? 0) - Date.now());
  }

  function startRefreshCooldown(cacheKey: string) {
    refreshCooldowns.current.set(cacheKey, Date.now() + REFRESH_COOLDOWN_MS);
    setRefreshStatus("Refresh cooldown active. Please wait 5 seconds.");
    window.setTimeout(() => {
      if (cooldownRemaining(cacheKey) === 0) setRefreshStatus("Refresh course data is available.");
    }, REFRESH_COOLDOWN_MS);
  }

  async function runRequest(
    mode: "discovery" | "detail",
    bbox: Bbox,
    query: string,
    cacheKey: string,
    timeout: number,
    options: RequestOptions = {},
  ) {
    setWarning("");
    setStaleCandidate(null);
    setActiveSourceEvidence(null);
    setSourceExportMessage("");

    let stale: Extract<CacheLookup, { kind: "stale" }> | null = null;
    if (!options.bypassCache) {
      const cache = await overpassCache.read({ key: cacheKey, mode, query, bbox });
      if (cache.kind === "hit") {
        displayResult(mode, true, cache.response, cache.cached.source, { mode, bbox, query, cacheKey, timeout }, cache.cached.rawResponse);
        setRefreshStatus("Course data loaded from durable cache.");
        return;
      }
      if (cache.kind === "stale") stale = cache;
      if (cache.kind === "warning") setWarning(cache.message);
    }

    const id = ++requestIdentity.current;
    const activeController = new AbortController();
    controller.current = activeController;
    setState({ kind: "loading", mode });
    if (options.manualRefresh) {
      startRefreshCooldown(cacheKey);
      setRefreshStatus("Refreshing course data from OpenStreetMap.");
    }
    const result = await fetchOverpass(query, timeout, activeController.signal);
    if (requestIdentity.current !== id) return;
    controller.current = null;

    if (!result.ok) {
      classifyFailure(result.failure);
      if (stale) {
        setStaleCandidate({
          context: { mode, bbox, query, cacheKey, timeout },
          cached: stale.cached,
          response: stale.response,
          recordDate: stale.cached.source.completedAt,
        });
      }
      if (options.manualRefresh) setRefreshStatus("Refresh failed. Existing course view was left unchanged.");
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(result.rawResponse);
    } catch {
      setActiveSourceEvidence(null);
      setState({ kind: "parse" });
      return;
    }
    const response = validateResponse(parsed);
    if (!response) {
      setActiveSourceEvidence(null);
      setState({ kind: "shape" });
      return;
    }
    const source = sourceMetadata(query, bbox);
    try {
      const cacheResult = await overpassCache.write({
        key: cacheKey,
        mode,
        cached: { rawResponse: result.rawResponse, source },
        signal: activeController.signal,
      });
      if (cacheResult.kind === "warning") setWarning(cacheResult.message);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setWarning("Result displayed, but durable cache could not be updated.");
      }
    }
    displayResult(mode, false, response, source, { mode, bbox, query, cacheKey, timeout }, result.rawResponse);
    if (options.manualRefresh) setRefreshStatus("Refresh complete.");
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

  function refreshCourseData() {
    if (loading) return;
    let context: RequestContext | null = null;
    if (state.kind === "success" || state.kind === "empty") context = activeContext;
    if (!context) return;
    const remaining = cooldownRemaining(context.cacheKey);
    if (remaining > 0) {
      setRefreshStatus(`Refresh cooldown active. Please wait ${Math.ceil(remaining / 1000)} seconds.`);
      return;
    }
    void runRequest(context.mode, context.bbox, context.query, context.cacheKey, context.timeout, { bypassCache: true, manualRefresh: true });
  }

  function renderStaleData() {
    if (!staleCandidate) return;
    displayResult(
      staleCandidate.context.mode,
      true,
      staleCandidate.response,
      staleCandidate.cached.source,
      staleCandidate.context,
      staleCandidate.cached.rawResponse,
      "stale-consented",
    );
    setWarning(`Showing stale OpenStreetMap data from ${staleCandidate.recordDate}. Refresh when Overpass is available.`);
    setStaleCandidate(null);
  }

  function cancel() {
    requestIdentity.current += 1;
    controller.current?.abort();
    controller.current = null;
    setActiveSourceEvidence(null);
    setSourceExportMessage("");
    setState({ kind: "cancelled" });
    requestAnimationFrame(() => submitButton.current?.focus());
  }

  const showsOsmResult = state.kind === "success" || state.kind === "empty";
  const errorState = ["invalid", "rate-limit", "timeout", "network", "http", "parse", "shape"].includes(state.kind);
  const canRefresh = showsOsmResult && !loading;
  const canExportGisSource = (state.kind === "success" || state.kind === "empty")
    && state.mode === "detail"
    && activeSourceEvidence?.mode === "detail";

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
            <button className="secondary" type="button" onClick={refreshCourseData} disabled={!canRefresh || (cacheKeyForCurrentResult() ? cooldownRemaining(cacheKeyForCurrentResult()!) > 0 : false)}>
              Refresh course data
            </button>
          </div>
        </form>
      </section>

      <section className={`status ${errorState ? "error" : ""}`} role="status" aria-live={errorState ? "assertive" : "polite"} aria-atomic="true">
        <strong>Status</strong>
        <p>{stateMessage(state)}</p>
        <p>{refreshStatus}</p>
        {warning && <p className="warning">{warning}</p>}
      </section>

      {staleCandidate && (
        <section className="stale-consent" aria-labelledby="stale-consent-title">
          <h2 id="stale-consent-title">Stored course data available</h2>
          <p>Current course data could not be retrieved. Stored OpenStreetMap data from {staleCandidate.recordDate} is available but may be stale.</p>
          <div className="actions">
            <button type="button" onClick={renderStaleData}>Render stored course data</button>
            <button className="secondary" type="button" onClick={() => setStaleCandidate(null)}>Cancel</button>
          </div>
        </section>
      )}

      {(state.kind === "success" || state.kind === "empty") && (
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
              <section className="map-workspace" aria-labelledby="map-workspace-title">
                <div className="map-selection">
                  <h3 id="map-workspace-title">Selected-hole map</h3>
                  {normalized && normalized.holes.length > 0 && (
                    <label>Hole
                      <select value={selectedHoleKey} onChange={(event) => setSelectedHoleKey(event.target.value)}>
                        {normalized.holes.map((hole) => (
                          <option key={hole.source.sourceKey} value={hole.source.sourceKey}>
                            {hole.number === null ? hole.source.sourceKey : `Hole ${hole.number}`}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
                {normalized && normalized.holes.length > 0 ? (
                  <>
                    {normalized.holes.filter((hole) => hole.source.sourceKey === selectedHoleKey).map((hole) => (
                      <HoleMap key={hole.source.sourceKey} hole={hole} warnings={normalized.warnings} source={normalized.source}
                        project={holeProject(hole.source.sourceKey)}
                        onProjectChange={(project) => setHoleProject(hole.source.sourceKey, project)} />
                    ))}
                  </>
                ) : <p className="map-empty" role="status">No normalized holes are available to render.</p>}
                {normalized && normalized.holes.length > 0 && (
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
                )}
                <section className="source-export" aria-labelledby="source-export-title">
                  <h3 id="source-export-title">OpenStreetMap source data</h3>
                  <p className="hint">Raw GIS source exports contain exact OpenStreetMap response evidence only. They do not include project targets, carries, notes, or normalized map geometry.</p>
                  {activeSourceEvidence?.consentState === "stale-consented" && (
                    <p className="warning">This export will contain stale OpenStreetMap data rendered with your consent.</p>
                  )}
                  <div className="actions">
                    <button type="button" onClick={exportGisSource} disabled={!canExportGisSource}>Download Raw GIS Source (ODbL)</button>
                  </div>
                  {sourceExportMessage && <p aria-live="polite">{sourceExportMessage}</p>}
                </section>
              </section>
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
        <p className="attribution">Data © OpenStreetMap contributors, available under ODbL. <a href={OSM_COPYRIGHT_URL}>OpenStreetMap copyright and license</a>. Durable cache marks OSM geometry as ODbL-covered for internal provenance only and does not satisfy later source-export obligations.</p>
      )}
    </main>
  );
}

````

### src/gisSourceExport.ts

````ts
import {
  OSM_COPYRIGHT_URL,
  OVERPASS_ENDPOINT,
  serializeBbox,
  validateResponse,
  type Bbox,
  type SourceMetadata,
} from "./overpass";

export const GIS_SOURCE_EXPORT_VERSION = "1.0.0";
export const GIS_SOURCE_EXPORT_MIME = "application/json;charset=utf-8";
export const GIS_SOURCE_EXPORT_MAX_BYTES = 1_048_576;
export const GIS_SOURCE_EXPORT_LICENSE = "ODbL-1.0";

export type SourceConsentState = "fresh" | "stale-consented";

export type ActiveSourceEvidence = {
  mode: "detail";
  cacheKey: string;
  rawResponse: string;
  source: SourceMetadata;
  consentState: SourceConsentState;
};

export type OsmElementSummary = {
  type: "node" | "way" | "relation";
  id: number;
  tagKeys: string[];
};

export type GisSourceExportEnvelope = {
  bbox: string;
  completedAt: string;
  consentState: SourceConsentState;
  copyrightUrl: typeof OSM_COPYRIGHT_URL;
  endpoint: typeof OVERPASS_ENDPOINT;
  exportVersion: typeof GIS_SOURCE_EXPORT_VERSION;
  exportedAt: string;
  isStaleSource: boolean;
  license: typeof GIS_SOURCE_EXPORT_LICENSE;
  osmElementsSummary: OsmElementSummary[];
  query: string;
  rawResponse: string;
  sourceAgeDays?: number;
};

export type GisSourceExportErrorCode =
  | "MISSING_EVIDENCE"
  | "WRONG_MODE"
  | "SOURCE_MISMATCH"
  | "INVALID_SOURCE"
  | "INVALID_RESPONSE"
  | "OVERSIZED_EXPORT";

export type GisSourceExportResult =
  | { ok: true; envelope: GisSourceExportEnvelope; text: string; filename: string; sizeBytes: number }
  | { ok: false; code: GisSourceExportErrorCode; message: string; sizeBytes?: number };

type ExportContext = {
  query: string;
  bbox: Bbox;
};

const TYPE_ORDER: Record<OsmElementSummary["type"], number> = {
  node: 0,
  relation: 1,
  way: 2,
};

function utf8Bytes(value: string): number {
  return new TextEncoder().encode(value).length;
}

function validDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

export function formatGisSourceExportFilename(exportedAt: string): string {
  const compact = exportedAt.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return `ctc-gis-source-${compact}.json`;
}

export function extractOsmElementSummary(rawResponse: string): OsmElementSummary[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawResponse);
  } catch {
    return null;
  }
  const response = validateResponse(parsed);
  if (!response) return null;
  return response.elements.map((element) => {
    const tags = element.tags && typeof element.tags === "object" && !Array.isArray(element.tags)
      ? Object.keys(element.tags).sort((left, right) => left.localeCompare(right))
      : [];
    return { type: element.type, id: element.id, tagKeys: tags };
  }).sort((left, right) => TYPE_ORDER[left.type] - TYPE_ORDER[right.type] || left.id - right.id);
}

export function serializeGisSourceEnvelope(envelope: GisSourceExportEnvelope): string {
  const ordered = envelope.isStaleSource
    ? {
      bbox: envelope.bbox,
      completedAt: envelope.completedAt,
      consentState: envelope.consentState,
      copyrightUrl: envelope.copyrightUrl,
      endpoint: envelope.endpoint,
      exportVersion: envelope.exportVersion,
      exportedAt: envelope.exportedAt,
      isStaleSource: envelope.isStaleSource,
      license: envelope.license,
      osmElementsSummary: envelope.osmElementsSummary,
      query: envelope.query,
      rawResponse: envelope.rawResponse,
      sourceAgeDays: envelope.sourceAgeDays,
    }
    : {
      bbox: envelope.bbox,
      completedAt: envelope.completedAt,
      consentState: envelope.consentState,
      copyrightUrl: envelope.copyrightUrl,
      endpoint: envelope.endpoint,
      exportVersion: envelope.exportVersion,
      exportedAt: envelope.exportedAt,
      isStaleSource: envelope.isStaleSource,
      license: envelope.license,
      osmElementsSummary: envelope.osmElementsSummary,
      query: envelope.query,
      rawResponse: envelope.rawResponse,
    };
  return `${JSON.stringify(ordered, null, 2)}\n`;
}

export function buildGisSourceExport(
  evidence: ActiveSourceEvidence | null,
  context: ExportContext | null,
  exportedAt = new Date().toISOString(),
): GisSourceExportResult {
  if (!evidence || !context) {
    return { ok: false, code: "MISSING_EVIDENCE", message: "No active detail source data is available for export." };
  }
  if (evidence.mode !== "detail") {
    return { ok: false, code: "WRONG_MODE", message: "Raw GIS source export is available only for loaded course detail data." };
  }
  if (
    evidence.source.query !== context.query
    || evidence.source.bbox !== serializeBbox(context.bbox)
    || evidence.source.endpoint !== OVERPASS_ENDPOINT
    || evidence.source.copyrightUrl !== OSM_COPYRIGHT_URL
  ) {
    return { ok: false, code: "SOURCE_MISMATCH", message: "Source data does not match the active detail view." };
  }
  if (!validDate(evidence.source.completedAt) || !validDate(exportedAt)) {
    return { ok: false, code: "INVALID_SOURCE", message: "Source data has invalid timestamp metadata." };
  }
  const summary = extractOsmElementSummary(evidence.rawResponse);
  if (!summary) {
    return { ok: false, code: "INVALID_RESPONSE", message: "Source data is not valid Overpass JSON." };
  }
  const isStaleSource = evidence.consentState === "stale-consented";
  const envelope: GisSourceExportEnvelope = {
    bbox: evidence.source.bbox,
    completedAt: evidence.source.completedAt,
    consentState: evidence.consentState,
    copyrightUrl: OSM_COPYRIGHT_URL,
    endpoint: OVERPASS_ENDPOINT,
    exportVersion: GIS_SOURCE_EXPORT_VERSION,
    exportedAt,
    isStaleSource,
    license: GIS_SOURCE_EXPORT_LICENSE,
    osmElementsSummary: summary,
    query: evidence.source.query,
    rawResponse: evidence.rawResponse,
  };
  if (isStaleSource) {
    envelope.sourceAgeDays = Math.max(0, Math.floor((Date.parse(exportedAt) - Date.parse(evidence.source.completedAt)) / 86_400_000));
  }
  const text = serializeGisSourceEnvelope(envelope);
  const sizeBytes = utf8Bytes(text);
  if (sizeBytes > GIS_SOURCE_EXPORT_MAX_BYTES) {
    return {
      ok: false,
      code: "OVERSIZED_EXPORT",
      message: "Raw GIS source export exceeds the 1 MiB limit. Refresh with a smaller detail area.",
      sizeBytes,
    };
  }
  return { ok: true, envelope, text, filename: formatGisSourceExportFilename(exportedAt), sizeBytes };
}

````

### src/gisSourceExport.test.ts

````ts
import {
  buildGisSourceExport,
  extractOsmElementSummary,
  GIS_SOURCE_EXPORT_MAX_BYTES,
  GIS_SOURCE_EXPORT_MIME,
  serializeGisSourceEnvelope,
  type ActiveSourceEvidence,
} from "./gisSourceExport";
import { buildDetailQuery, serializeBbox, sourceMetadata, type Bbox } from "./overpass";

const bbox: Bbox = { south: 35, west: -80, north: 35.01, east: -79.99 };
const query = buildDetailQuery(bbox);
const rawResponse = `{"elements":[{"type":"way","id":3,"tags":{"name":"Fairway","golf":"fairway"},"geometry":[{"lat":35,"lon":-80}]},{"type":"node","id":2,"tags":{"__proto__":"inert","golf":"tee"},"lat":35,"lon":-80},{"type":"relation","id":1,"tags":{"type":"multipolygon","leisure":"golf_course"},"members":[]}]}`;

function evidence(overrides: Partial<ActiveSourceEvidence> = {}): ActiveSourceEvidence {
  return {
    mode: "detail",
    cacheKey: `ctc:overpass:v1:detail:${serializeBbox(bbox)}`,
    rawResponse,
    source: sourceMetadata(query, bbox),
    consentState: "fresh",
    ...overrides,
  };
}

describe("GIS source export", () => {
  it("builds deterministic JSON with exact raw response text and expected MIME", () => {
    const result = buildGisSourceExport(evidence(), { query, bbox }, "2026-06-20T01:02:03.000Z");
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.message);
    expect(GIS_SOURCE_EXPORT_MIME).toBe("application/json;charset=utf-8");
    expect(result.filename).toBe("ctc-gis-source-20260620T010203Z.json");
    expect(result.envelope.rawResponse).toBe(rawResponse);
    expect(Object.keys(result.envelope)).toEqual([...Object.keys(result.envelope)].sort());
    expect(result.text).toBe(`${JSON.stringify(JSON.parse(result.text), null, 2)}\n`);
    expect(result.envelope.osmElementsSummary).toEqual([
      { type: "node", id: 2, tagKeys: ["__proto__", "golf"] },
      { type: "relation", id: 1, tagKeys: ["leisure", "type"] },
      { type: "way", id: 3, tagKeys: ["golf", "name"] },
    ]);
    const summaryText = JSON.stringify(result.envelope.osmElementsSummary);
    expect(summaryText).not.toContain("Fairway");
    expect(summaryText).not.toContain("geometry");
    expect(summaryText).not.toContain("members");
  });

  it("exports valid empty responses with an empty summary", () => {
    const result = buildGisSourceExport(evidence({ rawResponse: '{"elements":[]}' }), { query, bbox }, "2026-06-20T01:02:03.000Z");
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.message);
    expect(result.envelope.osmElementsSummary).toEqual([]);
    expect(result.envelope.rawResponse).toBe('{"elements":[]}');
  });

  it("keeps stale metadata consistent and computes age from completedAt to exportedAt", () => {
    const source = sourceMetadata(query, bbox);
    const stale = evidence({
      source: { ...source, completedAt: "2026-06-10T00:00:00.000Z" },
      consentState: "stale-consented",
    });
    const result = buildGisSourceExport(stale, { query, bbox }, "2026-06-20T12:00:00.000Z");
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.message);
    expect(result.envelope.consentState).toBe("stale-consented");
    expect(result.envelope.isStaleSource).toBe(true);
    expect(result.envelope.sourceAgeDays).toBe(10);
    expect(result.envelope.isStaleSource).toBe(result.envelope.consentState !== "fresh");
  });

  it("rejects mismatched source metadata and discovery evidence", () => {
    expect(buildGisSourceExport(evidence({ source: { ...sourceMetadata(query, bbox), endpoint: "https://example.test/api" } }), { query, bbox }))
      .toMatchObject({ ok: false, code: "SOURCE_MISMATCH" });
    expect(buildGisSourceExport(evidence({ source: { ...sourceMetadata(query, bbox), copyrightUrl: "https://example.test" } }), { query, bbox }))
      .toMatchObject({ ok: false, code: "SOURCE_MISMATCH" });
    expect(buildGisSourceExport(evidence({ source: { ...sourceMetadata(`${query}\nchanged`, bbox) } }), { query, bbox }))
      .toMatchObject({ ok: false, code: "SOURCE_MISMATCH" });
  });

  it("rejects invalid Overpass JSON without mutating Object prototype", () => {
    expect(extractOsmElementSummary("{")).toBeNull();
    expect(buildGisSourceExport(evidence({ rawResponse: '{"elements":[{"type":"area","id":1}]}' }), { query, bbox }))
      .toMatchObject({ ok: false, code: "INVALID_RESPONSE" });
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it("measures the full pretty-printed export size at the cap and one byte over", () => {
    const minimal = evidence({ rawResponse: '{"elements":[],"padding":""}' });
    const ok = buildGisSourceExport(minimal, { query, bbox }, "2026-06-20T01:02:03.000Z");
    expect(ok.ok).toBe(true);
    if (!ok.ok) throw new Error(ok.message);
    const atCapRaw = `{"elements":[],"padding":"${"x".repeat(GIS_SOURCE_EXPORT_MAX_BYTES - ok.sizeBytes)}"}`;
    const atCap = buildGisSourceExport(evidence({ rawResponse: atCapRaw }), { query, bbox }, "2026-06-20T01:02:03.000Z");
    expect(atCap.ok).toBe(true);
    if (!atCap.ok) throw new Error(atCap.message);
    expect(atCap.sizeBytes).toBe(GIS_SOURCE_EXPORT_MAX_BYTES);

    const overCapRaw = `{"elements":[],"padding":"${"x".repeat(GIS_SOURCE_EXPORT_MAX_BYTES - ok.sizeBytes + 1)}"}`;
    expect(buildGisSourceExport(evidence({ rawResponse: overCapRaw }), { query, bbox }, "2026-06-20T01:02:03.000Z"))
      .toMatchObject({ ok: false, code: "OVERSIZED_EXPORT" });
  });

  it("serializes stale sourceAgeDays only for stale exports", () => {
    const fresh = buildGisSourceExport(evidence(), { query, bbox }, "2026-06-20T01:02:03.000Z");
    expect(fresh.ok).toBe(true);
    if (!fresh.ok) throw new Error(fresh.message);
    expect(fresh.text).not.toContain("sourceAgeDays");

    const text = serializeGisSourceEnvelope({ ...fresh.envelope, isStaleSource: true, consentState: "stale-consented", sourceAgeDays: 1 });
    expect(Object.keys(JSON.parse(text)).at(-1)).toBe("sourceAgeDays");
  });
});

````

### src/styles.css

````css
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
header, .search-panel, .status, .results, .stale-consent {
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
.stale-consent { border-color: #d18b38; }
.stale-consent h2 { margin-top: 0; }
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
.project-panel, .project-io, .source-export { background: #f5f7f1; border: 1px solid #cbd5c5; border-radius: 6px; display: grid; gap: .75rem; padding: 1rem; }
.source-export { background: #fffdf8; border-color: #d3c48d; }
.project-panel h4, .project-io h3, .source-export h3, .project-errors h4, .project-panel p { margin: 0; }
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

````

### test/e2e/app.spec.ts

````ts
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
  await expect(page.getByText(/raw discovery entities loaded from durable cache/)).toBeVisible();
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
  { name: "rate limit", status: 429, expected: /longer rate-limit wait/ },
  { name: "gateway timeout", status: 504, expected: /timed out/ },
  { name: "generic HTTP", status: 500, expected: /HTTP 500/ },
]) {
  test(`shows ${scenario.name} state without retry or failover`, async ({ page }) => {
    let requests = 0;
    await isolateNetwork(page, async (route) => {
      requests += 1;
      await route.fulfill({
        status: scenario.status,
        headers: scenario.status === 429 ? {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Expose-Headers": "Retry-After",
          "Retry-After": "120",
        } : {},
        body: "error",
      });
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

test("retries one transient network failure without endpoint failover", async ({ page }) => {
  let requests = 0;
  await isolateNetwork(page, async (route) => {
    requests += 1;
    if (requests === 1) await route.abort("internetdisconnected");
    else await route.fulfill({ json: discovery });
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByText(/raw discovery entities loaded/)).toBeVisible({ timeout: 5000 });
  expect(requests).toBe(2);
});

test("refreshes loaded course data with cooldown and durable cache replacement", async ({ page }) => {
  let detailRequests = 0;
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    if (query.includes("purpose:golf-course-detail")) {
      detailRequests += 1;
      await route.fulfill({ json: { elements: [{ type: "way", id: 9000000100 + detailRequests, tags: { leisure: "golf_course" } }] } });
    } else {
      await route.fulfill({ json: discovery });
    }
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Load raw detail" }).click();
  await expect(page.getByText("way/9000000101")).toBeVisible();

  const refresh = page.getByRole("button", { name: "Refresh course data" });
  await refresh.click();
  await expect(refresh).toBeDisabled();
  await expect(page.getByText("way/9000000102")).toBeVisible();
  await expect(page.getByText(/Refresh complete/)).toBeVisible();
  expect(detailRequests).toBe(2);

  await page.reload();
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await page.getByRole("button", { name: "Load raw detail" }).click();
  await expect(page.getByText("way/9000000102")).toBeVisible();
  expect(detailRequests).toBe(2);
});

test("exports raw GIS source only for loaded detail data", async ({ page }) => {
  const rawDetailText = JSON.stringify(ctc006Detail);
  await page.addInitScript(() => {
    const original = URL.createObjectURL.bind(URL);
    (window as typeof window & { __ctcBlobTexts?: string[]; __ctcBlobTypes?: string[] }).__ctcBlobTexts = [];
    (window as typeof window & { __ctcBlobTexts?: string[]; __ctcBlobTypes?: string[] }).__ctcBlobTypes = [];
    URL.createObjectURL = (blob) => {
      if (blob instanceof Blob) {
        (window as typeof window & { __ctcBlobTexts: string[]; __ctcBlobTypes: string[] }).__ctcBlobTypes.push(blob.type);
        void blob.text().then((text) => {
          (window as typeof window & { __ctcBlobTexts: string[]; __ctcBlobTypes: string[] }).__ctcBlobTexts.push(text);
        });
      }
      return original(blob);
    };
  });
  await isolateNetwork(page, async (route) => {
    const query = new URLSearchParams(route.request().postData() ?? "").get("data") ?? "";
    if (query.includes("purpose:golf-course-detail")) {
      await route.fulfill({ body: rawDetailText, contentType: "application/json" });
    } else {
      await route.fulfill({ json: discovery });
    }
  });
  await page.goto("/");
  await fillBounds(page);
  await page.getByRole("button", { name: "Search courses" }).click();
  await expect(page.getByRole("button", { name: "Download Raw GIS Source (ODbL)" })).toHaveCount(0);

  await page.getByRole("button", { name: "Load raw detail" }).click();
  const sourceButton = page.getByRole("button", { name: "Download Raw GIS Source (ODbL)" });
  await expect(sourceButton).toBeVisible();
  await expect(sourceButton).toBeEnabled();

  const downloadPromise = page.waitForEvent("download");
  await sourceButton.click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^ctc-gis-source-\d{8}T\d{6}Z\.json$/);
  expect(await page.evaluate(() => (window as typeof window & { __ctcBlobTypes: string[] }).__ctcBlobTypes.at(-1)))
    .toBe("application/json;charset=utf-8");

  await page.waitForFunction(() => (window as typeof window & { __ctcBlobTexts: string[] }).__ctcBlobTexts.length > 0);
  const text = await page.evaluate(() => (window as typeof window & { __ctcBlobTexts: string[] }).__ctcBlobTexts.at(-1) ?? "");
  const exported = JSON.parse(text);
  expect(exported.rawResponse).toBe(rawDetailText);
  expect(exported.license).toBe("ODbL-1.0");
  expect(exported.copyrightUrl).toBe("https://www.openstreetmap.org/copyright");
  expect(exported.consentState).toBe("fresh");
  expect(exported.isStaleSource).toBe(false);
  expect(exported.osmElementsSummary[0]).toEqual({ type: "node", id: 9000060999, tagKeys: ["natural"] });
  expect(exported.osmElementsSummary).toContainEqual({ type: "way", id: 9000060001, tagKeys: ["leisure", "name"] });
  expect(text).not.toContain("targets");
  expect(text).not.toContain("carries");
  await expect(page.getByText("Raw GIS source export started.")).toBeVisible();
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

````

## Audit Request

Review the embedded files adversarially against the accepted CTC-020 Phase 1 scope and guardrails. Focus on correctness, accessibility, stale-consent behavior, exact raw-response preservation, deterministic export schema, size-limit enforcement, project/user-data separation, dangerous-key handling, test adequacy, docs accuracy, and forbidden scope leakage.

Return the required verdict and distinguish blockers from minor fixes.
