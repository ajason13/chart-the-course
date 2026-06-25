# Chart the Course Context

Last updated: 2026-06-20

## Current Status

Claude QA planning for CTC-008 - 2026-06-25. Claude returned
`READY FOR IMPLEMENTATION AFTER QA PLAN` with no blockers and no second Claude
QA-planning round required after Codex records the required corrections. Codex
accepts the verdict and recorded the disposition in
`docs/handoffs/ctc-008-claude-qa-plan-review.md`; SHA-256:
`1efce8795476a79fd937ae22cc78445e557db4af790c2954aa23b9b7d97b5117`.
Required corrections RC-1 through RC-8 and minor corrections MC-1 through MC-4
were folded into `docs/handoffs/ctc-008-spec-addendum.md`; updated SHA-256:
`e4bf2c88e483e45d5004a411fbadf5135cec2c84df779aa45bcfbafc3a3ec84a`.
Implementation is authorized on a feature branch for a dev-only,
fixture-backed PDF prototype. Mandatory boundaries: no production dependency
movement; no new devDependencies; no production `Download PDF` UI in
`src/App.tsx`; use only
`fixtures/overpass/synthetic-golf-course-ctc006.json`; render exactly the
single fixture hole `way/9000060101`; use literal static prototype notes only;
validate course-title tag text with fallback; avoid live Overpass/query/cache
helpers; do not import or exercise `pdfkit`, `svg-to-pdfkit`, or
`blob-stream`; block high-risk jsPDF APIs; keep production app bundle isolated;
use existing Blob URL cleanup pattern; add deterministic PDF filename fallback;
and include network isolation, source-level API blocklist, attribution,
carry-dash, PDF.js structural, rendered visual, bundle-isolation, and
compliance evidence. CTC-008 may move to `3. In Development (ChatGPT)`.
Final Claude audit remains mandatory before Done.

Gemini CTC-008 revision rejected - 2026-06-25. Codex reviewed Gemini's revised
gated fixture-backed prototype response and rejected it as an implementation
baseline. Accepted research input: gated fixture-backed prototype direction,
browser-local/network-isolated generation, continued `jspdf@4.2.1` low-level
vector candidate status, explicit bans on high-risk jsPDF APIs, static fixture
notes only, visible/searchable full-URL OSM attribution, PDF/raw source
adjacency when real PDF behavior ships, and deferred Blob URL cleanup. Source
check on 2026-06-25 confirmed NVD `CVE-2026-25755` and `CVE-2026-25940` jsPDF
records, npm `jspdf@4.2.1` metadata, and current OSM copyright source.
Blockers remain: production dependency movement is unjustified while UI is
hidden/prototype-gated; hidden/query-flag PDF UI conflicts with the accepted
task boundary; typed boundaries reference nonexistent `NormalizedCourse` and
`CustomTarget` contracts and misstate `project.ts`; bundle optimization is an
incomplete placeholder; text sanitization remains ambiguous around required
`©`; fixture content fields are assumed rather than mapped; Playwright snippets
use nonexistent test IDs/routes; raw PDF byte scans are over-weighted; fixed
page/layout constants are premature; and the response still does not choose one
coherent implementation-ready acceptance boundary. Review artifact:
`docs/handoffs/ctc-008-gemini-revision-review.md`. CTC-008 remains in
`1. Spec Drafting (Gemini)`. Next recommended action is a Codex-owned spec
addendum choosing either a dev-only fixture-backed PDF prototype that keeps
jsPDF in devDependencies and avoids production PDF UI, or a fully reviewed
production PDF feature with production dependency movement and real
same-release source-export adjacency. Do not advance to Claude QA planning or
runtime implementation until that corrected baseline exists.
Gemini revision review artifact:
`docs/handoffs/ctc-008-gemini-revision-review.md`; SHA-256:
`c2e9599a0c77f6d667f96a86bd4c7a942db2edec5e90f4fe9cbc78a943c214f0`.

Codex CTC-008 spec addendum ready for Claude QA planning - 2026-06-25. Codex
resolved the repeated Gemini baseline blockers in
`docs/handoffs/ctc-008-spec-addendum.md`; SHA-256:
`e8fc3384eae27e57cd03adcc72ea4759c7edefceb871101d0e6626cb14391391`.
Corrected direction: CTC-008 should implement a dev-only, fixture-backed
yardage book PDF prototype, not production PDF export behavior. The addendum
keeps `jspdf@4.2.1` as a devDependency, forbids production `Download PDF` UI
or hidden/query-flagged controls in the main app, uses the existing synthetic
fixture and current normalized/project types, preserves static fixture notes
only, blocks high-risk jsPDF APIs, and defers final PDF/raw-source adjacency
to a later real production PDF task. Claude QA planning prompt:
`docs/handoffs/ctc-008-claude-qa-planning-prompt.md`; SHA-256:
`f845af19406fbd550dff374a0aba0bcfa58da4b3e7ade4d96f08802170f47724`.
CTC-008 may move to `2. QA Planning (Claude)`, but runtime implementation
remains blocked until Claude reviews the addendum and Codex records accepted
corrections. Per maintainer request, the Claude QA prompt was rewritten on
2026-06-25 as a self-contained Claude Chat bundle with embedded repository file
contents. Updated prompt SHA-256:
`5d0b3c342a4be5acff3f6958b21d1c5a0084c6762297b9639fc9a674924831fd`.

Gemini CTC-008 response rejected - 2026-06-24. Codex reviewed the Gemini
specification response and rejected it as an implementation baseline. Accepted
research input is limited to browser-local PDF generation, continued direct
`jspdf@4.2.1` production-adoption consideration, relevant current jsPDF
vulnerability context, visible/searchable full-URL OSM attribution, PDF/raw
source UI adjacency when real PDF behavior ships, static fixture notes only,
and deferred Blob/object URL cleanup. Source check on 2026-06-24 confirmed
NVD records for `CVE-2026-31898`, `CVE-2026-31938`, and `CVE-2026-25535`;
`npm view jspdf@4.2.1` reports MIT license, unpacked size 30,192,058 bytes,
and direct dependencies `@babel/runtime`, `fflate`, and `fast-png`. Blocking
issues: no explicit delivery path, incomplete dependency/tree-shaking claims,
blanket non-ASCII sanitization that conflicts with `©` attribution, loose
visual-regression thresholds, architecture not grounded in current modules,
irrelevant coordinate edge cases, under-specified same-release PDF/source gate,
overstated legal wording, security scope drift into blocked PDF APIs, and
wrong AGPL `ace` wording. Review artifact:
`docs/handoffs/ctc-008-gemini-specification-review.md`; SHA-256:
`1962d09cf5e59a26be47ef86d16145cb7976f955d44cb167caf88215bdba4296`.
Revision prompt: `docs/handoffs/ctc-008-gemini-revision-prompt.md`;
SHA-256: `9b319f443213f31e50afb7bb5e3574eda3afc59657890408fc342917f2176fda`.
CTC-008 remains in `1. Spec Drafting (Gemini)`; do not advance to Claude QA
planning or runtime implementation until Codex accepts a corrected baseline.

CTC-008 selected for Gemini specification drafting - 2026-06-20. Codex
confirmed clean synchronized `main` at
`186a14e3d3c78b7cff5d641c9591e9891fe40f74`, which is after the CTC-020 merge
baseline `16fd9051610d1149e79680257f7dda232ed99745` and includes the
post-CTC-020 startup handoff commit. PR #8 remains merged at
`2026-06-20T06:44:25Z` with merge commit
`16fd9051610d1149e79680257f7dda232ed99745`; main CI run `27863255281`
completed successfully. Notion auth worked on retry, and CTC-020 was marked
`5. Done` with the merge closeout note. Live Notion comparison confirmed
CTC-020, CTC-019, and CTC-014 are `5. Done`, while CTC-008 remains
`0. Backlog`. The broader backlog search did not surface a more valuable
unblocked candidate than CTC-008; direct Notion database querying was
unavailable on this workspace plan. CTC-008 is now the highest-value next task
because CTC-014 provides the reviewed PDF pipeline experiment and CTC-020
provides the raw GIS source availability foundation. Selection is for
specification only: do not add production PDF behavior, a `Download PDF` UI,
production dependency movement, persistent notes, providers, basemap tiles,
API keys, accounts, server components, telemetry, cloud sync, remote assets, or
external user-data flows until the specification and QA gates are reviewed.
The specification must resolve whether CTC-008 ships as a production PDF
feature, a gated fixture-backed prototype, or a smaller production-adoption
task; it must explicitly handle direct `jspdf@4.2.1` adoption from research
status, visible/searchable full-URL OSM attribution, same-release PDF/source
export adjacency, static versus persistent notes, and rendered PDF visual
regression coverage. CTC-008 moved to `1. Spec Drafting (Gemini)`. Gemini
prompt: `docs/handoffs/ctc-008-gemini-specification-prompt.md`. Prompt
SHA-256:
`f7c071423c49235dc14ad1e4387652d9ac025a658f9175c868082a712ad77e7b`. Stop at
this gate until Gemini returns a report that Codex critically reviews.

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

CTC-020 final audit handoff - 2026-06-20. Implementation commit
`ceb6f807da8a68df0378d85da8b3e903ddfcd4ad` was pushed on branch
`ctc-020-odbl-source-export`. PR #8 is
`https://github.com/ajason13/chart-the-course/pull/8`. The self-contained
Claude final-audit prompt is
`docs/handoffs/ctc-020-claude-final-audit-prompt.md`; it embeds the changed
implementation and documentation files from the audited commit and instructs
Claude to verify the accepted Phase 1 scope plus MC-1 through MC-5 from the
addendum review. Prompt SHA-256:
`036e2eff64d2a0912fb8d6d15b36bb44be0c481a841d603090f255483a150b59`.
Move CTC-020 to `4. Final Audit (Claude)` and do not mark Done until Claude
findings are resolved or explicitly accepted.
PR #8 CI `verify` passed on GitHub Actions run `27862930301` for head commit
`2312bc7bd66e1d6295d4f682a2b6a569638c710b`, including app checks and
production compliance. GitHub emitted a non-blocking Node.js 20 deprecation
annotation for pinned actions forced onto Node 24, but the required check
completed successfully.

Claude final audit for CTC-020 - 2026-06-20. Claude returned `PASS WITH MINOR
FIXES` with no blockers and no re-audit required. Minor fixes applied on PR #8:
documented the intentional source evidence/context mismatch double-check in
`src/gisSourceExport.ts`; added a deterministic invalid-timestamp filename
fallback plus unit coverage; clarified `ATTRIBUTION.md` so Phase 1
`osmElementsSummary` framing appears before the final source-export requirement
list; and tightened the dangerous-tag-name unit test wording/assertions.
Verification after fixes passed: `npm run test:unit -- gisSourceExport`,
`npm run check`, `git diff --check`, and
`npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`
with production audit reporting 0 vulnerabilities.

CTC-020 merged - 2026-06-20. PR #8 merged at `2026-06-20T06:44:25Z` with
merge commit `16fd9051610d1149e79680257f7dda232ed99745`. Local `main` was
fast-forwarded to `origin/main` at that commit. Main CI `verify` passed on run
`27863255281` for the merge commit. CTC-020 should be marked `5. Done` in
Notion with PR `https://github.com/ajason13/chart-the-course/pull/8`, but the
Notion update failed in this session due to OAuth authorization required. Retry
the Notion status update at next startup before selecting new work.

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
