# CTC-019 Gemini Chat specification review

Date: 2026-06-19

## Disposition

Gemini Chat's CTC-019 specification response is **not implementation-ready**
and is rejected as the CTC-019 corrected baseline.

The response is useful as another research attempt, but it does not satisfy
the required CTC-019 correction prompt or the repository contracts. CTC-019
must remain in `1. Spec Drafting (Gemini)` until Codex records an accepted
corrected baseline and Claude adversarial QA planning is completed and
critically reviewed.

## Blocking issues

1. It does not start with the mandatory sentence:
   `CTC-019 specifies a browser-durable Overpass cache and bounded request policy without implementing source export or PDF behavior.`
2. The durable record schema is incompatible with the accepted corrections:
   `mode` is defined as `"durable" | "memory"` instead of `"discovery" |
   "detail"`, and the schema omits required source metadata fields such as
   `endpoint` and `copyrightUrl`.
3. The schema stores parsed `geometry` instead of preserving exact
   `rawResponse` plus source metadata separately from normalized geometry.
   This conflicts with the ODbL/source-evidence boundary and current
   `CachedResponse` shape.
4. It replaces the accepted deterministic cache keys with a new hash/key
   design. CTC-019 must preserve current `discoveryCacheKey` and
   `detailCacheKey` behavior unless a reviewed maintainer decision changes it.
5. It proposes normalizing queries by stripping comments and whitespace. This
   conflicts with exact query preservation and destroys the identifying
   Overpass QL comment evidence required by the request-identity contract.
6. It invents request identity text with `admin@example.com` and suggests
   custom identity headers. Browser JavaScript must not try to set forbidden
   identity headers, and the existing repo contract already defines the
   `chart-the-course/{version} contact:{repo URL} purpose:golf-course-*`
   comment format.
7. It treats IndexedDB operations and upgrade blocking too much like abortable
   fetch work. IndexedDB transactions are not generally abortable in the way
   described, and `onblocked` does not provide a transaction to abort after a
   timer.
8. It proposes `fake-indexeddb` and a JSDOM unit-test environment even though
   the repository currently has no such dependency or JSDOM setup. Any dev
   dependency must be explicit, exact-pinned, and justified; the response does
   not do that.
9. It proposes Playwright coverage across Chromium, Firefox, and WebKit, while
   the current Playwright configuration is Chromium-only. Browser matrix
   expansion is not authorized by CTC-019 unless separately justified.
10. It adds a Notion epic/user-story/task matrix inside the implementation
    specification. That is product-management scope creep and was explicitly
    rejected in earlier Gemini plan review.
11. It uses a 5-second refresh cooldown without tying the choice to public
    Overpass safety, one-active-request behavior, or a reviewed rate-limit
    rationale.
12. It does not clearly state that stale OSM data is never rendered without
    visible user consent in every failure case; the prompt text is close but
    still frames stale fallback around a modal without specifying durable
    state-machine invariants.
13. It does not require deletion failure to still return a miss for invalid,
    corrupt, incompatible, oversized, or expired records.
14. It treats the internal `license` field as future export input and says
    downstream export functions must read it. CTC-019 must not define CTC-020
    export behavior or schema.
15. It includes unsupported or uncited storage quota claims as "critical
    blocking unknowns" instead of describing browser-variable behavior as
    non-guaranteed runtime variability with graceful degradation.

## Accepted fragments

These parts are directionally useful but need correction before implementation:

- A dedicated `src/overpassCache.ts` module is likely appropriate.
- Native IndexedDB remains the right durable storage direction.
- A non-durable in-memory fallback is acceptable as graceful degradation only.
- `StorageManager.estimate()` should remain diagnostic-only.
- `navigator.onLine` may inform copy only.
- A deterministic retry policy is preferable to random jitter for testability.
- Stale data requires visible user choice before rendering.

## Required next correction

Do not advance to Claude QA planning from this Gemini response.

The next corrected baseline must:

- Preserve exact raw Overpass response text and source metadata.
- Preserve existing cache-key contracts and `serializeBbox`.
- Define `mode` as discovery/detail, not durable/memory.
- Validate exact expected query, endpoint, completedAt, bbox, copyright URL,
  schema version, mode, key, raw response shape, size, TTL, and ODbL marker.
- Treat invalid/expired/corrupt records as misses even if deletion fails.
- Model IndexedDB cancellation as pre-checks plus ignoring late results, not as
  fetch-equivalent transaction cancellation.
- Avoid new dependencies unless explicitly justified and governed.
- Avoid product-management/user-story output.
- Keep CTC-020 source export and CTC-008 PDF behavior out of scope.
