# CTC-008 Claude QA Planning Prompt

Act as adversarial QA planner for CTC-008, Create PDF yardage book export
prototype. Claude Chat has no filesystem or GitHub access, so this prompt
contains the relevant task context and corrected baseline.

## Required Output

Return one of:

- `READY FOR IMPLEMENTATION AFTER QA PLAN`
- `NEEDS SPEC FIXES`

Lead with blockers. Separate blockers from minor corrections. For each finding,
cite the section of the corrected baseline and explain the concrete risk. State
whether CTC-008 may move from `1. Spec Drafting (Gemini)` to
`3. In Development (ChatGPT)` after Codex records any required corrections, or
whether another QA review is required.

## Task Objective

CTC-008 creates a browser-local PDF yardage book export prototype.

Acceptance criteria:

- Export includes cover, course summary, and at least one rendered hole page.
- Hole page includes map, yardage table, custom targets, and notes.
- Export works from fixture data without network calls.
- PDF layout is stable at selected paper size.

## Governance Context

- Original Chart the Course code is Apache-2.0.
- Do not copy, modify, adapt, link, combine, incorporate, or distribute
  AGPL-3.0 code from the `ace` project.
- Treat `hacker-yardage` and `openyardage-web` as study-only unless
  permission/license is verified.
- Do not add providers, basemap tiles, API keys, accounts, telemetry, cloud
  sync, server components, remote assets, or external user-data flows.
- CTC-014 is Done and recommends direct `jspdf@4.2.1` drawing from a pure typed
  export scene for later production-adoption review. It did not authorize
  production PDF behavior.
- CTC-020 is Done and ships browser-local raw GIS source export for loaded
  detail data. Production PDF export later must ship with same-release raw GIS
  source availability and real UI adjacency.
- The notes criterion is unresolved for production. Static fixture notes are
  authorized for this prototype; persistent/user-authored notes are not.

## Source Checks

Source check date: 2026-06-25.

- NVD `CVE-2026-31898`: jsPDF before 4.2.1 PDF object injection via
  `createAnnotation`; fixed in 4.2.1.
- NVD `CVE-2026-31938`: jsPDF before 4.2.1 HTML injection via `output`
  options; fixed in 4.2.1.
- NVD `CVE-2026-25535`: jsPDF before 4.2.0 denial of service through GIF/image
  processing in `addImage`/`html`; fixed in 4.2.0.
- NVD `CVE-2026-25755`: jsPDF before 4.2.0 PDF object injection via `addJS`;
  fixed in 4.2.0.
- NVD `CVE-2026-25940`: jsPDF before 4.2.0 PDF object injection through
  AcroForm APIs; fixed in 4.2.0.
- `npm view jspdf@4.2.1` reports MIT license, unpacked size 30,192,058 bytes,
  and direct dependencies `@babel/runtime`, `fflate`, and `fast-png`.
- Required OSM attribution URL:
  `https://www.openstreetmap.org/copyright`.

## Prior Gemini Disposition

Gemini's first response was rejected because it did not choose a delivery path,
made incomplete dependency claims, proposed ASCII-only sanitization that would
strip required `©`, used loose visual-regression thresholds, invented
architecture not grounded in the app, and under-specified the PDF/source-export
release gate.

Gemini's revision was also rejected. It chose a gated fixture-backed prototype,
but still proposed production dependency movement while hiding or
query-flag-gating the UI, referenced nonexistent `NormalizedCourse` and
`CustomTarget` contracts, misstated `project.ts`, included incomplete Vite
configuration, assumed fixture fields, used nonexistent test IDs/routes, and
left the implementation boundary incoherent.

## Corrected Baseline To Audit

The corrected baseline is `docs/handoffs/ctc-008-spec-addendum.md`. Review it
as the implementation contract:

- Dev-only fixture-backed PDF prototype.
- No production PDF UI.
- No production dependency movement.
- Existing synthetic fixture only.
- Current normalized/project types only.
- Static notes only.
- Low-level jsPDF vector/text APIs only.
- PDF.js structural and rendered visual evidence before implementation can be
  accepted.
- Later production PDF/source-export adjacency remains mandatory but is not
  implemented by this prototype.

## Review Focus

Please look specifically for:

- Any hidden production dependency or production PDF behavior risk.
- Whether the dev-only fixture prototype path can truthfully satisfy CTC-008's
  acceptance criteria.
- Missing tests for PDF security, attribution, network isolation, visual
  stability, source-export release gating, or notes boundaries.
- License/compliance gaps.
- Ambiguous implementation boundaries that could lead Codex to touch the main
  app or production dependency graph.
