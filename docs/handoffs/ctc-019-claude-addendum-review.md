# CTC-019 Claude addendum re-review

Date: 2026-06-19

## Disposition

Claude returned `READY FOR IMPLEMENTATION AFTER QA PLAN` for the CTC-019
specification addendum.

Claude found no blockers. CTC-019 may move to `3. In Development (ChatGPT)`
using the accepted Gemini baseline, Codex corrections, the Claude QA plan, and
the Codex addendum as the implementation contract.

## Minor implementation/audit checkpoints

Claude identified three non-blocking clarifications to track during
implementation and post-implementation audit:

1. A `Retry-After` value over the 60-second cap is terminal for that user
   action. It does not consume a retry slot and then continue the retry
   sequence.
2. Hit-time `sizeBytes` recomputation must mirror write-time sizing by
   reconstructing the record with `sizeBytes: 0` before serializing and
   measuring. Re-serializing the stored record with its non-zero `sizeBytes`
   would double-count and fail valid entries.
3. If stale data was already explicitly consented to and rendered earlier in
   the same session, a later refresh failure may leave that already-consented
   stale view in place with visible stale/rate-limit/error state. The
   implementation must not newly render stale data without consent.

## Gate status

CTC-019 may move to `3. In Development (ChatGPT)`. Runtime work must implement
the accepted baseline, Codex corrections, `docs/handoffs/ctc-019-spec-addendum.md`,
and Claude's QA plan/red lines. The minor checkpoints above should be verified
during implementation and final audit.
