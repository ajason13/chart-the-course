# CTC-020 Gemini specification prompt

Use Gemini Chat Deep Research as the Spec Drafter for CTC-020, Implement ODbL
source export for PDF workflow. Produce a concrete implementation
specification for Chart the Course. Do not write code.

## Current task

Task: `CTC-020 Implement ODbL source export for PDF workflow`

Objective: Ensure PDF export ships with ODbL source availability support.

Live Notion status checked by Codex on 2026-06-19: `0. Backlog`.

Acceptance criteria:

- `Download Raw GIS Source (ODbL)` action appears adjacent to `Download PDF`.
- Export includes raw GeoJSON or OSM XML response, OSM IDs, bounding box, exact
  Overpass QL query, source URL, and `https://www.openstreetmap.org/copyright`.
- PDF acknowledgements include full printed OSM attribution URL.
- PDF export cannot ship unless raw GIS source export is available in the same
  release.

## Baseline facts

- CTC-019 is Done. PR #7 merged on 2026-06-19 as
  `fd901f07228396f128af36c4fbb28b62ed46088e`.
- CTC-019 created native IndexedDB durable Overpass cache records containing
  exact raw response text, exact query, endpoint, completion timestamp, bbox,
  copyright URL, and an internal `license: "ODbL-1.0"` marker.
- CTC-019 explicitly did not implement CTC-020 export UI, export schema,
  filename, MIME type, object URL lifecycle, or PDF behavior.
- CTC-014 is Done and recommends direct `jspdf@4.2.1` drawing for a later
  separate production-adoption review, but no production PDF dependency or PDF
  export UI is adopted.
- CTC-008 remains Backlog and must not ship distributed/shared PDF export
  without CTC-020 raw GIS source availability in the same release.
- The current app has a local project export for user-authored targets/carries.
  That project export is separate from raw OSM source evidence and must not be
  merged with CTC-020 raw GIS source export.

## Non-goals and guardrails

- Do not create or assume a fake, disabled, inert, hidden, or placeholder
  `Download PDF` control merely to satisfy adjacency wording.
- Do not combine CTC-020 and CTC-008 for convenience.
- Do not implement production PDF export behavior, move PDF packages into
  production dependencies, add providers, add API keys, add a server, add
  telemetry, add accounts, or add cloud sync.
- Do not export normalized geometry as if it were raw source evidence.
- Do not reconstruct invented raw source from parsed geometry.
- Do not include user-authored project data, targets, carries, notes, player
  profiles, or unrelated browser storage in the raw GIS source export.
- Do not copy, modify, adapt, link, combine, incorporate, or distribute AGPL
  code from `ace`.
- Treat `hacker-yardage` and `openyardage-web` as study-only unless license or
  permission is verified.
- Automated tests must stay network-isolated and use synthetic fixtures.
- Original Chart the Course code remains Apache-2.0.

## Source checks

Codex checked current primary sources on 2026-06-19:

- OpenStreetMap copyright and license page:
  `https://www.openstreetmap.org/copyright`
- OpenStreetMap attribution guidance:
  `https://www.openstreetmap.org/copyright/attribution-guide/`
- Open Data Commons ODbL 1.0 legal code:
  `https://opendatacommons.org/licenses/odbl/1-0/`

Relevant source facts to verify and cite in the report:

- OSM data is licensed under ODbL and requires credit plus clear ODbL notice.
- Where links are not possible, printed media should include the full URL
  `https://www.openstreetmap.org/copyright`.
- ODbL 4.6 requires machine-readable access to a derivative database or
  alteration file when a produced work from a derivative database is publicly
  used.

If you rely on legal interpretation beyond these project guardrails, mark it as
an assumption and recommend maintainer/legal review.

## Specification questions to answer

1. Decide whether the complete CTC-020 acceptance criteria are independently
   deliverable before CTC-008 exists. If not, define an honest two-phase
   implementation plan that does not create fake PDF UI and does not mark the
   full task Done prematurely.
2. Define the exact raw GIS source export schema. It must be versioned and must
   include exact raw Overpass response text, OSM element type/ID list, bbox,
   exact Overpass QL query, endpoint/source URL, completion timestamp, and full
   copyright URL.
3. Decide JSON versus another format. Define filename pattern, MIME type,
   top-level field names, deterministic field ordering expectations, and
   whether pretty-printing is required.
4. Define validation for source evidence before export. Cover missing,
   corrupt, stale, incompatible, oversized, mismatched-query, mismatched-bbox,
   and malformed raw-response states.
5. Define dangerous-key handling for raw OSM tags and JSON object fields,
   including `__proto__`, `constructor`, and `prototype`, without destroying
   exact raw response text.
6. Define maximum export size, visible errors, and whether size limits apply to
   the raw response, serialized export envelope, or both.
7. Define Blob and object URL lifecycle, download triggering, accessible button
   states, status copy, and testable behavior in Chromium.
8. Define how the export reads CTC-019 durable cache evidence and/or current
   in-memory loaded source evidence. Be explicit about whether durable cache is
   required for the first deliverable slice.
9. Define stale-data behavior: when stale data has been explicitly rendered
   under CTC-019 consent, can it be exported, and what warning or metadata must
   be included?
10. Define the relationship to PDF UI. The same release gate must be preserved,
    but the app must not show a fake PDF action before CTC-008.
11. Define how PDF acknowledgements must later consume or mirror the source
    export attribution requirement without implementing PDF generation now.
12. Define tests: unit tests, Playwright smoke tests, synthetic fixtures,
    object URL mocking/assertions, network isolation, schema validation,
    stale/corrupt/missing evidence, size cap, dangerous keys, and separation
    from project export.
13. Define required docs updates for `ATTRIBUTION.md`,
    `docs/overpass-query-contract.md`, `SECURITY.md`, `CONTEXT.md`, and any
    source-export-specific doc if one should be created.
14. Identify blockers, open decisions, and acceptance criteria that cannot be
    closed until CTC-008 production PDF UI exists.

## Required report format

Return a report with these sections:

1. Executive decision: whether CTC-020 can be implemented now, and if so what
   limited slice is independently deliverable.
2. Acceptance criteria traceability table.
3. Source and legal/compliance findings with citations.
4. Proposed export schema with example JSON.
5. UI and workflow behavior.
6. Validation, security, privacy, and dangerous-key handling.
7. Cache/source-evidence integration.
8. PDF release-gate and adjacency plan.
9. Test plan.
10. Required repository doc updates.
11. Explicit non-goals.
12. Blockers and questions for Codex/maintainers.

Avoid generic product-management, roadmap, community, or Notion-template
content. Focus on concrete engineering and governance decisions for this
repository.

## Files to attach

Attach the first batch of files individually in Gemini Chat:

- `AGENTS.md`
- `CONTEXT.md`
- `docs/governance-workflow.md`
- `ATTRIBUTION.md`
- `SECURITY.md`
- `docs/overpass-query-contract.md`
- `docs/experiments/ctc-014-vector-pdf-evaluation.md`
- `src/App.tsx`
- `src/overpass.ts`
- `src/overpassCache.ts`

If Gemini asks for more context, attach the follow-up batch:

- `src/project.ts`
- `src/normalize.ts`
- `src/HoleMap.tsx`
- `test/e2e/app.spec.ts`
- `fixtures/overpass/synthetic-golf-course-ctc006.json`
- `package.json`

Attachment SHA-256 values from local `main` at
`fd901f07228396f128af36c4fbb28b62ed46088e`:

```text
f85031bec4338dcbbd08f217829b7492655d4fe72568fdbc7b9148b16b279929  AGENTS.md
a62907db1a8d2d93f51ba3e79bbc46af671661b2585de0fa37f1d7a3708d05b1  CONTEXT.md
db8e4be00234bb28b9047a5b8d6593cb5acb33e25c72f4b312a4cc7f9e6ae944  docs/governance-workflow.md
cdacd67d9853e5704f33cc5f2a631ca2768ef9bd37ec8c146457936767c5b3cf  ATTRIBUTION.md
2a6eb5f647666236eb7603a9d05ee6ac6a48d203d7a00298c9de0cb30d9eb7bf  SECURITY.md
38defdc9aa0e06700433083206cc8d3ca7fceebc9f680baa1fa4c9d89162b751  docs/overpass-query-contract.md
655a351bec9d110d50d38ca12a4ef32c5c14c500ac555e113a610f686fddcfc7  docs/experiments/ctc-014-vector-pdf-evaluation.md
03741ab78b3d4aba37cd0edcd0677031f85a53494c8eb82bb7021d7ed7737bc3  src/App.tsx
3cb789bbbe4c41b70d672f19a9cee1868784824d9878eea7849ec3b47d2deba4  src/overpass.ts
b5cb73410430f3a1c0ef90ee967253c0055cc82c49a68d5f4a148c7a3dd49a2a  src/overpassCache.ts
e1b574770a8af07e548ee703d9d4c9c6850a7e556d7e398f5ed9b9717b9a4135  src/project.ts
d4da528c92eef33eea9df600b92ffd543cf2e49110918f33a3c055918fad3881  src/normalize.ts
1f8425be0431ac38b0d7f26ccd0cfa61b4acff1944c07dcd042726d330b02a66  src/HoleMap.tsx
78379b29ed68eea751594b245bc929cd40a4a8cf2367c3921e946fe66c6c41e3  test/e2e/app.spec.ts
cc1bbb503206cbb82de4a62a3f356fb7fe0707a730b6abb7db9e73eb802ba786  fixtures/overpass/synthetic-golf-course-ctc006.json
06c0c579f7543c8a13d427e561b5311c5f7373921e41e08a0f7318b73baf014c  package.json
```
