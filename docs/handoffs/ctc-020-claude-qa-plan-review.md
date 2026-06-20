# CTC-020 Claude QA plan review

Date: 2026-06-19

## Disposition

Claude returned `NEEDS SPEC FIXES`. Codex accepts the verdict. CTC-020 must not
move to `3. In Development (ChatGPT)` yet.

The findings identify real unresolved specification decisions around active
source evidence, stale consent, detail-mode scope, summary shape, size-cap
semantics, state invalidation, and tests. These are not implementation details
to discover later; they must be recorded before runtime work begins.

## Accepted Blockers

- **B-1 active source evidence:** accepted. Current `ViewState` stores parsed
  response and `SourceMetadata`, not exact `rawResponse`. CTC-020 Phase 1 must
  add explicit active source evidence state instead of re-reading cache as the
  primary export path.
- **B-2 mode scope:** accepted. Phase 1 raw GIS source export must be scoped to
  detail-mode results only. Discovery-mode export remains out of scope for the
  partial deliverable.
- **B-3 summary shape:** accepted. `osmElementsSummary` must have a concrete
  minimal deterministic shape rather than an implementer-defined one.
- **B-4 size cap semantics:** accepted. The export cap applies to the full
  UTF-8 byte length of the final pretty-printed JSON file.
- **B-5 stale consent capture:** accepted. `renderStaleData()` is the only
  point where stale consent is known and must set active evidence with
  `consentState: "stale-consented"`.
- **B-6 state invalidation:** accepted. Active evidence must be replaced or
  cleared atomically with request/display transitions.

## Accepted Minor Corrections

- Filename timestamp comes from `exportedAt`; browser auto-suffix behavior for
  same-second downloads is acceptable.
- Object URL lifecycle may follow the existing project export pattern, but tests
  must cover the near-cap source-export size assumption.
- Empty responses are exportable and need explicit tests.
- Dangerous-key handling is limited by the `tagKeys`-only summary shape; exact
  `rawResponse` is not mutated.
- The new GIS MIME type is intentionally
  `application/json;charset=utf-8` and must be tested as distinct from the
  project export MIME.

## Resolution

The accepted fixes are recorded in
`docs/handoffs/ctc-020-spec-addendum.md`.

Next step: submit `docs/handoffs/ctc-020-claude-addendum-review-prompt.md` to
Claude. Runtime implementation remains blocked until Claude accepts the
addendum and Codex records the implementation gate.
