# Claude QA checkpoint: CTC-009 blocker closure

You previously returned `READY WITH REQUIRED CORRECTIONS` for CTC-009. Codex
accepted every B-1–B-5 and RC-1–RC-8 in the attached repository artifact:
`docs/handoffs/ctc-009-claude-qa-plan-addendum.md`.

Please perform the requested narrow checkpoint re-review, not a full
implementation audit. Confirm specifically:

1. `0.001 m` vertex selection and downstream tie-break make dogleg behavior
   deterministic even with duplicate points.
2. `0.01 m` separates numerical degeneration from a legitimate narrow result.
3. collinearity is objectively tested by both signed endpoint deviations.
4. boundary station containment / interval merging uses a consistent epsilon.
5. `normalize.ts`'s single-ring polygon contract safely excludes multi-ring
   support from this task.
6. round-half-up, even-odd pairing, transient-state isolation, polite status,
   no-dependency rule, and expanded test matrix close RC-1–RC-8.

Hard boundaries remain unchanged: no providers/basemaps, Overpass runtime
changes, production dependencies, API/accounts/telemetry/cloud persistence,
PDF work, expanded user-data flows, or third-party/AGPL `ace` reuse.

Return exactly `READY FOR IMPLEMENTATION`, `READY WITH REQUIRED CORRECTIONS`,
or `BLOCKED`, then only any remaining blockers/corrections. State explicitly
whether Codex may move the ticket to `3. In Development (ChatGPT)`.
