# CTC-008 Gemini Specification Prompt

Use Gemini Chat Deep Research as the Spec Drafter for CTC-008, Create PDF
yardage book export prototype.

## Research Plan Gate

Before starting research, show a concise CTC-008-specific plan and wait for
approval. Reject or revise the plan if it drifts into generic product
management, roadmap templates, Notion schemas, AI-agent workflow advice, or
unrelated open-source governance.

## Task Objective

Specify a browser-local PDF yardage book export prototype for Chart the Course.
The implementation must work from existing synthetic fixture/course data without
network calls and must preserve current governance boundaries.

## Acceptance Criteria

- Export includes cover, course summary, and at least one rendered hole page.
- Hole page includes map, yardage table, custom targets, and notes.
- Export works from fixture data without network calls.
- PDF layout is stable at selected paper size.

## Current Dependency Context

CTC-014 is Done and recommends direct drawing with `jspdf@4.2.1` from a pure
typed export scene for a later production-adoption review. That recommendation
does not itself authorize a production dependency or production PDF behavior.

CTC-020 is Done and ships Phase 1 browser-local raw GIS source export for loaded
detail data. CTC-008 must still prove the same-release gate: distributed/shared
PDF export cannot ship unless raw GIS source export is available in the same
release and the real PDF UI places `Download Raw GIS Source (ODbL)` adjacent to
`Download PDF`.

## Non-Goals and Guardrails

- Do not propose copying or adapting AGPL-3.0 code from `ace`.
- Treat `hacker-yardage` and `openyardage-web` as study-only unless permission
  or compatible licensing is verified.
- Do not add providers, basemap tiles, API keys, accounts, telemetry, cloud
  sync, server components, remote fonts, remote images, or external user-data
  flows.
- Do not invent a persistent notes model. The notes acceptance criterion must
  be resolved explicitly: static fixture notes may be acceptable for the first
  prototype, but user-authored persistent notes require a separate reviewed
  data-model decision.
- Do not assume direct `jspdf@4.2.1` can move from devDependency/research status
  into production runtime without a reviewed production-adoption plan.
- Do not use byte-identical PDF assertions as the primary stability proof.
- Automated tests must remain network-isolated and use synthetic fixtures.

## Required Specification Decisions

Produce a concrete specification that addresses:

1. Whether CTC-008 should first ship as a production PDF feature, a gated
   fixture-backed prototype, or a smaller pre-production adoption task.
2. Exact dependency movement, if any, from current devDependencies to production
   dependencies, including license, SBOM, notices, audit, bundle, and security
   implications.
3. Export-scene contract: typed inputs, source identities, paper size, margins,
   map bounds, layers, yardage table, target/carry overlay mapping, and notes
   source.
4. PDF attribution: visible/searchable OSM attribution and the full URL
   `https://www.openstreetmap.org/copyright` on PDFs containing OSM-derived
   geometry.
5. Same-release PDF/source-export UI gate and testable adjacency requirement.
6. Layout stability and visual regression plan, including PDF.js structural
   inspection and a reviewed rendered-page snapshot/tolerance strategy.
7. Blob/object URL lifecycle and browser-local privacy/security behavior.
8. Unit, Playwright, accessibility, compliance, and final Claude-audit gates.
9. Explicit non-goals to keep providers, accounts, telemetry, remote assets,
   server code, and unrelated persistence out of scope.

## Attached Repository Files

Attach these files in the first upload batch and require Gemini to inspect them:

- `AGENTS.md`
- `CONTEXT.md`
- `docs/governance-workflow.md`
- `ATTRIBUTION.md`
- `SECURITY.md`
- `docs/overpass-query-contract.md`
- `docs/experiments/ctc-014-vector-pdf-evaluation.md`
- `src/App.tsx`
- `src/gisSourceExport.ts`
- `test/e2e/app.spec.ts`

If Gemini needs additional implementation detail, it may request follow-up
files such as `src/HoleMap.tsx`, `src/normalize.ts`, `src/project.ts`,
`src/gisSourceExport.test.ts`, `package.json`, or the synthetic fixtures.

## Required Output Format

Return a specification report with:

- Summary recommendation.
- Dependency and production-adoption decision.
- Acceptance-criteria traceability table.
- Implementation plan by module.
- Test and QA plan.
- Security, privacy, attribution, and license/compliance notes.
- Open questions or maintainer decisions required before implementation.
- Explicit statement of what remains blocked from runtime implementation.
