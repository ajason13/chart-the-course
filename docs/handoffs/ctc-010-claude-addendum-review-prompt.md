# CTC-010 Claude QA addendum re-review

You previously returned `BLOCKED` for CTC-010. Re-review only the corrected
planning artifacts on remote branch `ctc-010-dispersion-profile`; clone/fetch
the repository and verify all cited commits before trusting this prompt.

## Verifiable sequence

- Base: `b29893f67765706c6a1a944c70157014f053180e` (`ctc-009-fairway-width`),
  which includes completed fairway-width UI and its `HoleMap.tsx` layer slot.
- Rebased CTC-010 specification: `fd4585e193dacfa7a1bae9f08e6b06cdd23c259b`.
- Rebased original QA packet: `73f5afb86efc32263da95c6cef2a356869648a19`.
- Corrective addendum: `99c677b`.

The prior local-only commit references are superseded. The task remains in QA
planning; no CTC-010 runtime implementation is authorized or present.

## Corrections for required findings

`docs/handoffs/ctc-010-claude-qa-plan-addendum.md` is the controlling
correction. It explicitly: selects the CTC-009 base; mandates local planar
landing/ellipse formula rather than `carry.ts` geodesic rings; requires global
`clubProfile` App-to-HoleMap props separate from `HoleStateV1`; pins the
carry-arcs/fairway-width-to-targets layer slot and existing clip path; pins
64-point rotated-boundary off-map sampling; defines club ID/duplicate-label/
dangerous-key handling; requires reuse of `CarryOriginV1` and
`resolveCarryOrigin`; restores invalid-edit reversion; and accepts the defaults,
distinct dash, and non-recommendation hint minors.

## Re-review targets

Read these exact files from the verified branch:

- `docs/handoffs/ctc-010-club-profile-dispersion-spec.md`
- `docs/handoffs/ctc-010-claude-qa-planning-prompt.md`
- `docs/handoffs/ctc-010-claude-qa-plan-addendum.md`
- `src/map.ts`, `src/carry.ts`, `src/project.ts`, `src/App.tsx`, `src/HoleMap.tsx`
- CTC-009 `src/fairwayWidth.ts` and its `HoleMap.tsx` integration

Confirm the new contract is internally consistent with the actual repository,
including all prior acceptance tests. Specifically reject any remaining
ambiguity in the planar formula, schema-v2 migration, global state plumbing,
rotated off-map testability, or local-only privacy boundary.

Return exactly `READY FOR IMPLEMENTATION`, `READY WITH REQUIRED CORRECTIONS`,
or `BLOCKED`. Separate blockers and minors, give file-specific corrections, and
say whether implementation can begin. Do not expand scope to persistence,
networking, dependencies, PDFs, or recommendation/risk behavior.
