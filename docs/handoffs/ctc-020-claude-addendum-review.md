# CTC-020 Claude addendum review

Date: 2026-06-20

## Verdict

Claude returned `READY FOR IMPLEMENTATION AFTER QA PLAN`.

Codex accepts the verdict. CTC-020 may move to
`3. In Development (ChatGPT)`.

## Resolution

Claude confirmed that blockers B-1 through B-6 are resolved by
`docs/handoffs/ctc-020-spec-addendum.md`:

- active source evidence as explicit state;
- detail-mode-only Phase 1 scope;
- concrete deterministic `osmElementsSummary` shape;
- final pretty-printed export size-cap semantics;
- stale consent capture in `renderStaleData()`;
- atomic active-evidence replacement and clearing across request/display
  transitions.

No further spec re-review is required before implementation.

## Minor Implementation and Audit Checkpoints

These checkpoints are not blockers but must guide implementation and final
Claude audit:

- `sourceAgeDays` should be computed from `source.completedAt` to `exportedAt`
  using `Math.floor((exportedAt - completedAt) / 86_400_000)`.
- Add an invariant test that `isStaleSource` and `consentState` cannot
  disagree.
- Add an explicit type-order test for `osmElementsSummary` order:
  `node`, `relation`, `way`.
- Define source-context comparison clearly and avoid comparing against stale
  non-atomic references.
- Discovery-mode source export should be absent from the DOM, not merely
  disabled.

Final Claude audit remains mandatory before CTC-020 can close. The audit must
also verify no CTC-008 PDF behavior, no new dependencies, no discovery-mode
export surface, network-isolated tests, and exact `rawResponse` preservation.
