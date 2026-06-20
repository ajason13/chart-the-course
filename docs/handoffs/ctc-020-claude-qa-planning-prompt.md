# CTC-020 Claude QA planning prompt

Act as adversarial QA planner for CTC-020, Implement ODbL source export for PDF
workflow. Claude Chat has no repository or GitHub access unless this prompt and
the listed attached files provide it.

Your job is to find blockers, missing decisions, ambiguous acceptance criteria,
security/compliance risks, and missing tests before implementation begins. Do
not write implementation code.

## Required Verdict

Return one of:

- `READY FOR IMPLEMENTATION`
- `READY WITH REQUIRED SPEC CORRECTIONS`
- `NEEDS SPEC FIXES`

Classify findings as blockers or minor/spec corrections. State whether Codex
may move CTC-020 to `3. In Development (ChatGPT)` after applying any required
spec corrections.

## Task

CTC-020: Implement ODbL source export for PDF workflow.

Current Notion status: `2. QA Planning (Claude)`.

Objective: Ensure PDF export ships with ODbL source availability support.

Acceptance criteria:

- `Download Raw GIS Source (ODbL)` action appears adjacent to `Download PDF`.
- Export includes raw GeoJSON or OSM XML response, OSM IDs, bounding box, exact
  Overpass QL query, source URL, and `https://www.openstreetmap.org/copyright`.
- PDF acknowledgements include full printed OSM attribution URL.
- PDF export cannot ship unless raw GIS source export is available in the same
  release.

## Current Decision Baseline

Use `docs/handoffs/ctc-020-gemini-revised-baseline-review.md` as the corrected
baseline. Summary:

- CTC-020 cannot be fully Done until real CTC-008 production PDF UI exists.
- No fake, hidden, disabled, inert, or placeholder `Download PDF` controls.
- Phase 1 may implement a partial browser-local raw GIS source export core, but
  it cannot satisfy final PDF adjacency or PDF acknowledgement criteria.
- Source export should be versioned JSON with
  `application/json;charset=utf-8`, deterministic root key ordering,
  2-space formatting, and filename pattern
  `ctc-gis-source-YYYYMMDDTHHmmssZ.json`.
- The envelope must preserve exact `rawResponse` text as a string and derive a
  safe primitive `osmElementsSummary` from parsed JSON.
- Required envelope fields: `exportVersion`, `exportedAt`, `license`,
  `copyrightUrl`, `query`, `endpoint`, `completedAt`, `bbox`,
  `osmElementsSummary`, and `rawResponse`.
- Valid empty Overpass responses are exportable source evidence.
- Stale source may be exported only when it corresponds to data explicitly
  rendered after CTC-019 stale-data consent.
- The export must stay separate from user-authored project export and
  normalized geometry.
- No new dependencies, Jest, Ajv, Web Workers, XML support, providers, API
  keys, servers, telemetry, accounts, cloud sync, production PDF behavior, or
  PDF dependency movement.
- Phase 1 should cap serialized source export at `1_048_576` bytes unless
  Claude identifies a better reviewed policy.

## Mandatory Corrections Already Applied by Codex

- Do not access private `overpassCache.memory`; use a reviewed public cache API
  or explicit active source evidence state.
- Current `ViewState` lacks exact raw response text, so implementation must
  add active source evidence state or re-read a validated cache record before
  export.
- Stale cache records are exportable only when current visible data was rendered
  through CTC-019 explicit stale consent.
- Tests must use existing Vitest and Playwright tooling and current accessible
  UI selectors, not Jest or invented IDs.
- `extractSafeElementSummary` returns an array.
- Export validation must require exact source metadata fields and reject
  endpoint, copyright URL, bbox, and query mismatches.

## Repository Context

Relevant implemented facts:

- CTC-019 is Done and merged as PR #7.
- CTC-019 added native IndexedDB durable cache in `src/overpassCache.ts`.
- The cache database is `ChartTheCourse`, schema version `1`, object store
  `courseGeometry`, inline key path `key`.
- CTC-019 cache records preserve exact `rawResponse` text plus
  `source.query`, `source.endpoint`, `source.completedAt`, `source.bbox`, and
  `source.copyrightUrl`.
- CTC-019 records include internal `license: "ODbL-1.0"` provenance marker.
- Fresh cache reads validate schema, key, mode, exact query, endpoint, bbox,
  copyright URL, TTL, response shape, size, and ODbL marker.
- Records over `1_048_576` bytes are not written durably.
- Expired data is never rendered automatically; stale rendering requires
  explicit visible user consent.
- CTC-019 does not implement CTC-020 export schema, download UI, filename,
  MIME type, object URL lifecycle, or PDF behavior.
- CTC-014 is Done and recommends direct `jspdf@4.2.1` drawing for a later
  production-adoption review, but no production PDF dependency or production
  PDF UI is adopted.
- CTC-008 remains Backlog.

## Non-Negotiable Guardrails

- Original Chart the Course code remains Apache-2.0.
- Do not copy, modify, adapt, link, combine, incorporate, or distribute AGPL
  code from `ace`.
- Treat `hacker-yardage` and `openyardage-web` as study-only unless permission
  or license is verified.
- Do not add production dependencies, providers, API keys, server components,
  production PDF behavior, telemetry, accounts, cloud sync, or external
  user-data flows without explicit reviewed scope.
- Raw GIS source availability must ship in the same release as
  distributed/shared PDF export.
- PDFs containing OSM-derived geometry must include visible searchable OSM
  attribution and the full URL `https://www.openstreetmap.org/copyright`.
- Use synthetic fixtures only; automated tests must remain network-isolated.
- Preserve exact raw OSM response/source evidence separately from normalized
  geometry and user-authored project state.

## Source Evidence Checked

Source check date: 2026-06-19.

- OpenStreetMap copyright page: <https://www.openstreetmap.org/copyright>
- OSM attribution guidance: <https://www.openstreetmap.org/copyright>
- ODbL 1.0 legal code: <https://opendatacommons.org/licenses/odbl/1-0/>

Use these as source evidence, but do not give legal advice. Flag legal
sufficiency questions for maintainer/legal review.

## Review Questions

1. Is Phase 1 source export safe to implement as a partial deliverable while
   keeping CTC-020 out of Done until CTC-008 PDF adjacency and acknowledgement
   criteria are satisfied?
2. Is the proposed envelope complete enough for ODbL source availability while
   preserving exact raw response text?
3. Should the serialized export cap be exactly `1_048_576` bytes, or should a
   different cap be required and justified?
4. What exact active source-evidence state should the app track so exports work
   after live fetch, fresh cache hit, stale-with-consent render, and
   non-durable fallback without reading private internals?
5. What should happen for valid empty responses, oversized live responses,
   corrupt durable records, mismatched active context, stale records not
   rendered by consent, and user switching between discovery/detail views?
6. Are dangerous-key handling and parsed summary extraction sufficient without
   mutating `rawResponse`?
7. Is object URL lifecycle acceptable if it follows the existing project export
   pattern, or should it use a different deferral?
8. What Vitest and Playwright tests are required before implementation can be
   accepted?
9. What docs updates are required, and what wording should avoid overstating
   legal conclusions?
10. What future CTC-008 tests must prove the PDF/source-export same-release
    gate and adjacency requirement?

## Files to Review

Attach these files or paste their contents with this prompt:

- `AGENTS.md`
- `CONTEXT.md`
- `ATTRIBUTION.md`
- `SECURITY.md`
- `docs/overpass-query-contract.md`
- `docs/experiments/ctc-014-vector-pdf-evaluation.md`
- `docs/handoffs/ctc-020-gemini-specification-review.md`
- `docs/handoffs/ctc-020-gemini-revised-baseline-review.md`
- `src/App.tsx`
- `src/overpass.ts`
- `src/overpassCache.ts`
- `src/project.ts`
- `src/normalize.ts`
- `test/e2e/app.spec.ts`
- `fixtures/overpass/synthetic-golf-course-ctc006.json`

Focus on adversarial gaps. Do not summarize back the prompt unless needed for
findings.
