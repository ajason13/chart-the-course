# CTC-008 Gemini Revision Prompt

Use Gemini Chat Deep Research to revise the CTC-008 specification. This is a
revision request, not a new broad research task.

## Prior Response Disposition

Codex rejected the prior response as an implementation baseline. It is useful
only as limited research input. Your revision must address the blockers in
`docs/handoffs/ctc-008-gemini-specification-review.md`.

## Required Goal

Produce one corrected, implementation-ready CTC-008 specification baseline for
Codex to review. The spec must choose an explicit delivery path:

- production PDF feature;
- gated fixture-backed prototype; or
- smaller production-dependency adoption task before PDF UI.

Do not leave this as an open question. If you recommend the smaller adoption
task, state exactly what CTC-008 should not implement yet.

## Mandatory Corrections

- Ground the architecture in the current repository: `src/App.tsx`,
  `src/HoleMap.tsx`, `src/normalize.ts`, `src/project.ts`, CTC-014 export-scene
  evidence, and the existing CTC-020 raw GIS source export.
- If recommending direct `jspdf@4.2.1`, specify exact import/API boundaries and
  explain how the production path avoids optional heavy or risky APIs such as
  `html()`, `addImage`, annotations, forms, embedded JavaScript, remote images,
  `html2canvas`, `canvg`, and `dompurify`.
- Account for all current `jspdf@4.2.1` direct dependencies reported by npm:
  `@babel/runtime`, `fflate`, and `fast-png`.
- Preserve required PDF text, including `©` and
  `https://www.openstreetmap.org/copyright`; do not recommend blanket
  non-ASCII stripping.
- Define static fixture notes as the only authorized notes source unless you
  explicitly recommend a separate pre-CTC-008 notes-model task.
- Define a testable same-release gate for real `Download PDF` and
  `Download Raw GIS Source (ODbL)` adjacency, including Playwright assertions.
- Use the CTC-014 three-layer QA strategy: export-scene assertions, PDF.js
  structural inspection, and rendered-page snapshot comparison with tolerance
  derived from repeated local/CI runs. Do not hard-code a loose 1% mismatch
  threshold without evidence.
- Keep coordinate handling within current bounded fixture/app input contracts.
  Do not add antimeridian, near-pole, provider, or global-bbox requirements.
- Keep security/legal statements source-grounded. Say what the implementation
  supports or preserves; do not claim it guarantees legal compliance.
- Correct the AGPL guardrail wording: the study-only AGPL risk is the `ace`
  project, not a generic "ace editor" dependency.

## Required Output

Return:

1. Recommendation and selected delivery path.
2. Dependency movement decision and compliance checklist.
3. Exact implementation boundaries by current module or new module.
4. PDF content contract for cover, course summary, hole page, map, yardage
   table, targets/carries, static notes, and attribution.
5. Same-release source-export/PDF gate.
6. Test plan with unit, Playwright, accessibility, PDF.js structural, rendered
   visual regression, network-isolation, and compliance checks.
7. Security/privacy/license notes.
8. Remaining blockers, if any, that must be resolved before implementation.

Do not include generic Notion database templates, product-management epics,
roadmap advice, or downstream coding-agent story tables.
