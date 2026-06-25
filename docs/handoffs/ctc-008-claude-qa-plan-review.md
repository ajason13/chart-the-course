# CTC-008 Claude QA Plan Review

Date: 2026-06-25

## Verdict

Claude returned `READY FOR IMPLEMENTATION AFTER QA PLAN`.

Codex accepts the verdict. There are no blockers, and no second Claude
QA-planning round is required after recording the required corrections. Runtime
implementation may begin only after the spec addendum is updated with the
corrections below and the task is moved to `3. In Development (ChatGPT)`.

## Required Corrections Accepted

- Verify `package.json` production `dependencies` remains limited to
  `react`/`react-dom`, and do not add new devDependencies beyond the existing
  CTC-014 PDF toolchain.
- Do not import or exercise rejected CTC-014 PDFKit paths:
  `pdfkit`, `svg-to-pdfkit`, or `blob-stream`.
- Pin the prototype fixture to
  `fixtures/overpass/synthetic-golf-course-ctc006.json`.
- Use an explicit static notes source: a literal prototype/export-scene string,
  not assumed OSM `note` or `description` tags and not normalized/project data.
- Validate the course title from `CourseCandidate.source.tags.name` as a string
  and provide tested fallback text.
- Render exactly the single hole in the pinned fixture, `way/9000060101`, and
  do not build generalized multi-hole pagination for CTC-008.
- Test that the prototype does not call live Overpass/query/cache modules.
- Define visual-regression baseline review/storage expectations.

## Minor Corrections Accepted

- Record bundle/import isolation evidence showing the production app entry is
  unaffected.
- Reuse the existing `requestAnimationFrame()` Blob URL cleanup pattern.
- Permit a download control on the isolated prototype page only; production
  `src/App.tsx` remains forbidden from adding PDF UI. Add deterministic PDF
  filename generation and fallback behavior.
- Carry-arc dash-pattern fidelity must be structurally asserted.

## Additional Test Requirements

- Playwright network isolation must block all non-localhost requests while the
  prototype runs.
- State explicitly that OSM attribution is required on map-bearing hole pages;
  cover and summary pages do not need attribution unless they render
  OSM-derived geometry.
- Add a source-level static check blocking high-risk jsPDF APIs in the
  prototype source.

## Implementation Gate

CTC-008 may move to `3. In Development (ChatGPT)` after
`docs/handoffs/ctc-008-spec-addendum.md`, `CONTEXT.md`, and Notion record these
corrections. Final Claude audit remains mandatory before CTC-008 can close.
