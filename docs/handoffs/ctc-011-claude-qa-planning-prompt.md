# CTC-011 Claude QA-planning audit

You are the independent QA planner. Review the pushed branch
`ctc-011-target-risk-scoring` at its stated commit. This is a planning-only
checkpoint: no runtime implementation is authorized yet.

## Required verdict

Return exactly one leading verdict: `READY FOR IMPLEMENTATION`, `READY WITH
REQUIRED CORRECTIONS`, or `BLOCKED`. For corrections/blockers, identify the
spec section, severity, exact replacement decision, and required test. State
explicitly whether runtime implementation is authorized after any listed
corrections are applied.

## Authoritative scope

Read `docs/handoffs/ctc-011-target-risk-scoring-spec.md` together with current
`src/normalize.ts`, `src/map.ts`, `src/dispersion.ts`, `src/project.ts`,
`src/HoleMap.tsx`, their tests, `test/e2e/app.spec.ts`, fixtures,
`docs/overpass-query-contract.md`, and `docs/legal-disclaimers.md`. The
specification was written by Codex acting as the specification/research
fallback; Gemini is not part of this gate.

The feature must remain a deterministic local mapped-risk planning indicator,
not a shot recommendation, coaching/safety claim, legal/rules outcome, or
assertion of playable/out-of-bounds status. It must not add requests, provider
or Overpass behavior, dependencies, keys, accounts, telemetry, persistence,
PDFs, exports, analytics, or mutable user flows. Project-wide club profiles
and all selected controls retain their existing contracts.

## Decisions to challenge

Adversarially examine whether the plan fully and safely resolves:

1. The displayed 64-point ellipse versus the 8-by-64 interior-and-boundary
   weighted sampling method, its units, endpoint/boundary semantics, weighting,
   tolerance, clipping choice, degenerate geometry, near-pole/projection
   failures, and off-map behavior.
2. Candidate generation: only existing targets; prerequisites; duplicate/ID
   handling; unavailable candidates; ID ordering; score ordering; every
   tie-breaker; and whether “lowest mapped-overlap” could be misread as advice.
3. Feature classification: only associated polygonal `golf-water`; explicit
   exclusion of generic water, bunkers, vegetation, fairway boundaries,
   points/lines, unassociated/invalid inputs, and the current absence of an
   out-of-bounds normalized type despite the Overpass query.
4. Empty or partial mapped data, invalid polygon handling, score range/bands,
   the non-guarantee wording, current legal disclaimer compatibility, and
   whether `safe` is sufficiently qualified.
5. React state isolation, existing dispersion selector relationship, SVG layer
   ordering, accessibility/live-region behavior, keyboard focus, responsive
   layout, course/hole/load/reload resets, project import/export, raw GIS
   source isolation, and no-request boundaries.
6. The test matrix: deterministic synthetic safe, marginal, unsafe,
   interior-only overlap, boundary contact, tie, missing/incomplete data,
   generic-water exclusion, ignored raw out-of-bounds input, geometry/projection
   failures, selected-club/target failures, off-map behavior, axe/mobile, and
   network isolation.

Reject ambiguous formulas, unstated rounding, unsafe inference from map data,
or any runtime/API/dependency/persistence scope expansion. Do not write code;
approve only an implementation-ready specification.
