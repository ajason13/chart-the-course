# CTC-019 Gemini Chat Deep Research correction prompt

Use Gemini Chat in Deep Research mode. This is a lean steering prompt; attach
the listed repository files individually instead of pasting large file contents
into the prompt body.

## Task

You are the Deep Research Spec Drafter for Chart the Course task CTC-019,
`Implement Overpass cache and request identity policy`.

Produce a corrected implementation specification for a browser-durable
Overpass cache and bounded request policy. This is specification work only. Do
not propose runtime implementation work, production dependencies, providers,
source export UI, PDF behavior, accounts, servers, analytics, telemetry, cloud
sync, endpoint failover, or unrelated persistence.

## Current gate

CTC-019 remains in `1. Spec Drafting (Gemini)`. Prior Antigravity research is
useful input but was not accepted as implementation-ready. The corrected
baseline must address every issue in
`docs/handoffs/ctc-019-antigravity-spec-review.md` and the accepted scope in
`docs/handoffs/ctc-019-gemini-plan-correction.md`.

## Acceptance criteria

- IndexedDB or equivalent browser cache stores fetched OSM course geometry.
- Default TTL is 7 days for public Overpass usage.
- UI has explicit `Refresh course data` action with rate limiting.
- Requests use app origin/referrer where available and prefix Overpass QL with
  an identifying comment.
- 429/Retry-After handling and exponential backoff are implemented.
- Cached OSM geometry is clearly marked ODbL-covered in exported source files.

## Required file attachments

Gemini Chat did not accept the focused ZIP workflow for this task. Attach the
files below individually to the Gemini Chat Deep Research request and use them
as the repository source of truth:

- Read fully: `CONTEXT.md`
- Read fully: `docs/handoffs/ctc-019-gemini-plan-correction.md`
- Read fully: `docs/handoffs/ctc-019-antigravity-spec-review.md`
- Read fully: `docs/overpass-query-contract.md`
- Read fully: `ATTRIBUTION.md`
- Read fully: `SECURITY.md`
- Read fully: `src/overpass.ts`
- Read fully: `src/overpass.test.ts`
- Read fully: `src/App.tsx`
- Read fully: `test/e2e/app.spec.ts`
- Skim/reference only: `docs/handoffs/ctc-019-antigravity-research-spec.md`
- Skim/reference only: `package.json`
- Skim/reference only: `package-lock.json`
- Skim/reference only: `sbom.json`
- Skim/reference only: `docs/experiments/ctc-014-vector-pdf-evaluation.md`

Do not ask for full pasted contents for generated or bulky files. If a needed
detail is missing from the attachments, state the missing detail instead of
inventing it. Treat the attachments as a fixed context snapshot; they may not
include repository changes made after they were selected.

## Required source research

Use current primary sources where possible for:

- Native browser IndexedDB behavior, upgrade lifecycle, quota/storage limits,
  and private/restricted storage behavior.
- Fetch, AbortSignal, response body cancellation, and browser forbidden
  request headers/referrer behavior.
- HTTP 429 and `Retry-After` parsing.
- Public Overpass usage guidance and rate-limit behavior.
- Accessibility guidance for status messages, refresh controls, disabled
  controls, and visible error states.

## Required corrections

The corrected specification must explicitly resolve all 17 Codex review items
from `docs/handoffs/ctc-019-antigravity-spec-review.md`, including:

- No broad `no blocking unknowns` claim.
- StorageManager as optional diagnostic context only.
- Explicit durable record `schemaVersion` and `mode`.
- Exact query validation bound to deterministic cache keys.
- Bbox validation using existing `serializeBbox` and cache-key contracts.
- Invalid/corrupt/incompatible/oversized/expired records are never fresh hits.
- No automatic stale-data rendering without visible user choice.
- `navigator.onLine` may inform copy only.
- One internally consistent Retry-After cap policy.
- Deterministic no-jitter or injected deterministic jitter.
- Native `disabled` versus `aria-disabled` chosen based on the implemented UI
  and tested interaction guards.
- Realistic IndexedDB cancellation semantics.
- Session/memory fallback is non-durable degradation only.
- Valid `completedAt` handling based on timestamp, TTL, and source consistency.
- ODbL label is internal evidence only, not CTC-020 export schema.
- In-memory IndexedDB test double is scoped; Playwright should exercise real
  browser IndexedDB where feasible.
- Likely dedicated cache module, such as `src/overpassCache.ts`.

## Required response format

Start the final report with this exact sentence:

```text
CTC-019 specifies a browser-durable Overpass cache and bounded request policy without implementing source export or PDF behavior.
```

Then return exactly these top-level sections:

1. Scope/readiness verdict and blocking unknowns.
2. Evidence table with primary-source URLs and access dates.
3. Durable-cache architecture and exact versioned schema.
4. Validation, TTL, stale, cleanup, quota, upgrade, and concurrency decisions.
5. Refresh action and accessible UI/state-machine contract.
6. Retry-After, bounded backoff, timeout, cancellation, and request-identity contract.
7. ODbL/source-evidence ownership and explicit CTC-020 boundary.
8. Security, privacy, failure-state, and no-network-expansion decisions.
9. Deterministic Vitest and network-isolated Playwright plan.
10. Exact file/change plan, documentation updates, verification plan, and non-goals.
11. Adversarial QA red lines.
12. Open maintainer decisions with conservative defaults.
13. Codex correction traceability matrix.

## Plan gate

Before starting research, show the research plan. The plan must be specific to
CTC-019. If it drifts into generic open-source product management, roadmap
planning, AI-agent task formatting, or Notion templates, stop and ask for plan
correction.

## Grounding rules

- Cite primary sources for browser, HTTP, Overpass, and accessibility claims.
- Mark every source-inferred or maintainer-choice decision clearly.
- Do not claim browser storage durability, quota, private-mode behavior, or
  public Overpass availability are guaranteed.
- Do not invent repository files, APIs, state names, tests, source-export
  schema, or PDF behavior.
- If evidence is insufficient, say so and provide the conservative default.
