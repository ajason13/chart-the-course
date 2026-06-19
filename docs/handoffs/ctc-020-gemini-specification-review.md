# CTC-020 Gemini specification review

Date: 2026-06-19

## Disposition

Gemini's CTC-020 response is rejected as an implementation baseline. It
contains useful high-level direction, but it does not satisfy the repository
contracts closely enough to advance to Claude QA planning.

Accepted direction is limited to:

- CTC-020 cannot be completed as a single full acceptance pass until CTC-008
  introduces real production PDF UI.
- Do not create fake, disabled, hidden, or inert PDF controls.
- A Phase 1 source-export core may be useful if it is explicitly scoped as a
  partial deliverable and does not mark CTC-020 Done.
- Source export should be JSON, versioned, deterministic, browser-local, and
  separate from user-authored project export.
- CTC-008 must keep same-release source availability and full printed OSM URL
  requirements.

Do not implement from the Gemini response as written.

## Blocking Issues

1. **Wrong CTC-019 storage contract.** Gemini refers to IndexedDB
   `overpass-cache` and query-hash keys. The accepted and implemented contract
   is database `ChartTheCourse`, schema version `1`, object store
   `courseGeometry`, inline key path `key`, and existing CTC-004 cache keys.

2. **Exact raw response is not preserved.** The proposed envelope changes
   `rawResponse` into a parsed object. CTC-019 and CTC-020 require exact raw
   Overpass response text to remain available separately from parsed metadata.

3. **Schema is malformed and inconsistent.** The JSON Schema has incomplete
   `enum` and `required` fields, uses `$schemaVersion` without a clear
   repository convention, and does not define how `source.bbox` string metadata
   maps to a numeric bbox object.

4. **False license text in the example payload.** The sample `osm3s.copyright`
   says OSM data is available under GNU Affero General Public License. That is
   wrong and dangerous for this project. OSM data is governed by ODbL, and the
   project must not introduce AGPL confusion.

5. **Unapproved dependencies and test runner drift.** Gemini proposes Ajv,
   Jest, and JSON Schema validation without justifying new dependencies against
   the existing exact-pinned dependency policy and Vitest suite. CTC-020 should
   prefer local typed validators unless a dependency is separately justified
   and reviewed.

6. **Unsupported UI placement.** Placing the source action adjacent to the
   existing project export risks user confusion and does not satisfy the final
   PDF-adjacency criterion. A Phase 1 placement must be honest, visually
   separated from project export, and documented as a partial source-export
   capability.

7. **Build-time PDF gate is hand-wavy.** Importing a source-export component
   from a future PDF component is not a sufficient release gate. CTC-008 needs
   explicit tests and acceptance checks that PDF export UI cannot be presented
   without source export availability and PDF attribution.

8. **Size limits are invented and too broad.** Gemini proposes 50 MB exports,
   15 MB worker thresholds, and Web Worker offload without source evidence,
   implementation scope, or relation to the existing 1 MiB durable-cache record
   cap. CTC-020 needs a reviewed export-size limit and visible error behavior.

9. **XML support and regex XML parsing are scope creep.** Current Overpass UI
   requests JSON. Supporting future XML output and extracting IDs with regex is
   not justified for this task.

10. **Prototype-pollution handling is oversimplified.** A JSON reviver can help
    parsed metadata extraction, but the raw response must remain an exact string
    and parsed objects should avoid dangerous object merging. The proposed
    example test is also wrong (`parsed.elements.tags` should be
    `parsed.elements[0].tags`).

11. **Stale export policy is under-specified.** Gemini says stale rendered data
    can be exported with flags, but does not tie this to CTC-019's explicit
    stale-consent state or define when stale-but-not-rendered records may not
    be exported.

12. **Empty response behavior is questionable.** Disabling export for
    `elements: []` may hide source evidence for an actual query result. The
    corrected spec must decide whether empty but valid responses are exportable
    and how OSM ID summary behaves.

13. **Dangerous legal overstatement.** Gemini asserts license termination and
    copyright liability as direct conclusions. Repository docs should stay
    precise: cite OSM/ODbL requirements and keep legal conclusions as guardrails
    or legal-review questions.

## Required Corrections

A revised CTC-020 baseline must:

- Use the real CTC-019 cache record shape or current active response state:
  `rawResponse` string plus `source.query`, `source.endpoint`,
  `source.completedAt`, `source.bbox`, and `source.copyrightUrl`.
- Define whether Phase 1 is a partial task state or requires a Notion
  acceptance-boundary decision before implementation.
- Keep full CTC-020 Done status blocked until PDF-adjacency and PDF
  acknowledgement criteria are satisfied by real CTC-008 behavior.
- Define exact envelope fields, version, filename, MIME type, ordering,
  pretty-printing, and validation without malformed schema snippets.
- Preserve exact raw response text in the export while safely deriving OSM
  element summaries from parsed JSON.
- Avoid new dependencies unless explicitly justified and separately reviewed.
- Keep tests in Vitest and Playwright unless the project intentionally changes
  tooling.
- Specify object URL lifecycle using the existing project export pattern unless
  a different lifecycle is justified.
- Define missing, corrupt, stale, empty, oversized, and source-mismatch
  behavior.
- Define separation from `src/project.ts` user-authored export and normalized
  geometry.
- Update docs without claiming that every digital map state already provides
  source export before implementation.

## Source Check

Primary sources rechecked by Codex on 2026-06-19:

- OpenStreetMap copyright page confirms OSM data is licensed under ODbL and
  requires credit plus clear ODbL notice:
  <https://www.openstreetmap.org/copyright>
- OSM copyright guidance says printed or non-link media should include the full
  URL `https://www.openstreetmap.org/copyright`:
  <https://www.openstreetmap.org/copyright>
- ODbL 4.3 and 4.6 define produced-work notice and machine-readable access
  obligations for derivative databases or alteration files:
  <https://opendatacommons.org/licenses/odbl/1-0/>

## Next Step

Keep CTC-020 in `1. Spec Drafting (Gemini)`. Submit a correction prompt that
asks Gemini for a focused revised baseline addressing the blockers above. Do
not advance to Claude QA planning and do not implement runtime behavior until
Codex accepts the revised baseline.
