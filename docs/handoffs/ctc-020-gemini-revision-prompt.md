# CTC-020 Gemini revision prompt

Use Gemini Chat Deep Research to revise the CTC-020 specification. The prior
response is rejected as an implementation baseline. Produce one corrected,
implementation-ready baseline for Codex review.

## Task

CTC-020: Implement ODbL source export for PDF workflow.

Current status: `1. Spec Drafting (Gemini)`.

Do not write code.

## Prior Response Disposition

The prior Gemini response is accepted only for these points:

- CTC-020 cannot fully satisfy PDF adjacency before real CTC-008 PDF UI exists.
- Do not create fake, hidden, disabled, or inert `Download PDF` controls.
- A Phase 1 source-export core may be useful if it is explicitly partial.
- JSON export is a reasonable leading format.
- CTC-008 must retain a same-release source-export gate and full printed OSM
  copyright URL.

Everything else must be reconsidered against the repository files.

## Required Corrections

Address every blocker from
`docs/handoffs/ctc-020-gemini-specification-review.md`:

1. Use the real CTC-019 storage contract: IndexedDB database
   `ChartTheCourse`, version `1`, object store `courseGeometry`, inline key
   path `key`, existing CTC-004 discovery/detail cache keys, and durable record
   fields from `src/overpassCache.ts`.
2. Preserve exact `rawResponse` as a string in the source export. Parsed JSON
   may be used only to derive summaries and validation.
3. Provide a complete, internally consistent export schema. No malformed JSON
   Schema snippets. If you recommend TypeScript validators instead of JSON
   Schema, define them clearly.
4. Remove the false AGPL example. OSM source data is ODbL-covered. Do not add
   AGPL language except to repeat the project guardrail that `ace` code is not
   allowed.
5. Do not propose Ajv, Jest, Web Workers, XML support, or other new
   dependencies/tooling unless you justify them under the exact-pinned
   dependency policy and explain why existing Vitest/Playwright/local
   validators are insufficient.
6. Define Phase 1 UI placement without implying final PDF adjacency. Keep it
   visually and semantically separate from local project export.
7. Define a real Phase 2 release gate for CTC-008 that is testable, not merely
   an import statement.
8. Define a conservative export-size policy tied to the current app constraints
   and visible user behavior.
9. Define prototype-pollution and dangerous-key handling without altering exact
   raw response text.
10. Define stale-data export behavior based on CTC-019 explicit stale consent.
11. Define whether valid empty Overpass responses are exportable.
12. Keep legal language precise and source-cited; mark legal interpretation as
    a maintainer/legal-review question when needed.

## Required Report Format

Return these sections:

1. Revised executive decision: whether Phase 1 may be implemented now and what
   acceptance criteria remain blocked until CTC-008.
2. Acceptance criteria traceability table with `Phase 1`, `Phase 2`, or
   `Blocked until CTC-008`.
3. Correct export envelope definition with one complete conforming JSON
   example. `rawResponse` must be exact response text.
4. Source-evidence read path from current app state and CTC-019 cache records.
5. Validation rules for missing, corrupt, stale, empty, mismatched, oversized,
   and malformed evidence.
6. Dangerous-key and security handling.
7. UI behavior for Phase 1 and Phase 2, including accessible states and object
   URL lifecycle.
8. Same-release PDF/source-export gate for CTC-008.
9. Vitest and Playwright test plan using existing tooling and synthetic
   fixtures.
10. Required repository documentation updates.
11. Explicit non-goals.
12. Open decisions for Codex/maintainers.

Avoid product-management, roadmap, community, or generic compliance boilerplate.
Focus only on Chart the Course implementation decisions.

## Files to attach

Attach the original first-batch files from
`docs/handoffs/ctc-020-gemini-specification-prompt.md`, plus:

- `docs/handoffs/ctc-020-gemini-specification-review.md`

If Gemini asks for more context, attach the original follow-up files listed in
the CTC-020 prompt.
