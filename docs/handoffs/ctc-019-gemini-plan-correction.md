# CTC-019 Gemini Deep Research plan correction

Replace the entire proposed `OSS PM Research and Specification` plan. It is
unrelated to CTC-019.

Do not research generic open-source product-management roles, community
alignment, public roadmaps, translating vibe-coding ideas into epics or user
stories, AI/LLM coding-agent task formats, generic application risks, or Notion
templates/database layouts.

The attached `docs/handoffs/ctc-019-gemini-specification-prompt.md` is the sole
project-specific authority. Read its instructions and all 18 embedded
repository files before researching. The task is to produce the evidence-backed
CTC-019 durable Overpass cache and request-identity specification required by
that file, not to explain how product-management or specification processes
generally work.

Use exactly this replacement research plan:

1. Research current primary sources for native browser IndexedDB, storage
   durability/quota/failure behavior, schema upgrades and concurrency, Fetch
   and AbortSignal behavior, HTTP `Retry-After`, normal browser
   origin/referrer behavior, official Overpass public-service guidance, and
   applicable accessibility guidance. Include source URLs and access dates.
2. Define the exact native durable-cache architecture: database name, version,
   stores, key paths, indexes, record schema, upgrade transactions,
   blocked/versionchange behavior, connection lifecycle, transaction
   boundaries, response-size bounds, cleanup, and graceful degradation. Do not
   add a dependency unless evidence proves the native platform inadequate.
3. Decide whether discovery and detail responses are both durable while
   preserving the existing deterministic CTC-004 cache keys. Preserve exact raw
   response text separately from parsed/normalized geometry and user-authored
   project state.
4. Define strict versioned durable-entry validation for the record/key, raw
   response, query, endpoint, completedAt, bbox, copyrightUrl, mode, timestamps,
   and ODbL/source-evidence label. Invalid, corrupt, incompatible, oversized,
   or expired entries must not be fresh hits.
5. Define exact 7-day TTL, boundary and clock-skew behavior, stale handling,
   visible stale-data decisions, cleanup cadence, quota/unavailable storage,
   failed upgrades/transactions, tab concurrency, and write-failure behavior.
6. Define the accessible `Refresh course data` action, including exact current
   key scope, cooldown/rate limit, enabled and disabled states, focus/live
   status, loading/cancel behavior, replacement rules, failed-refresh behavior,
   and whether existing cached data remains visible.
7. Define bounded 429/`Retry-After` and exponential-backoff behavior, including
   accepted header formats, invalid/past/huge values, deterministic jitter
   policy, maximum attempts/delays/total budget, timeout interaction, visible
   status, cancellation during wait/fetch/body-read work, and no endpoint
   failover.
8. Verify request identity and security/privacy boundaries: preserve leading
   identifying Overpass QL comments and normal browser origin/referrer behavior;
   do not set or spoof `User-Agent`, `Origin`, or `Referer`; do not add a proxy,
   provider, API key, account, server, analytics, telemetry, cloud sync,
   background sync, service worker, external storage, or unrelated persistence.
9. Define how durable cached OSM evidence is marked ODbL-covered for later
   CTC-020 source export without implementing any export schema, download UI,
   production PDF behavior, or claiming the CTC-008/CTC-020 release gate is
   satisfied.
10. Define exact App/state-machine integration, repository documentation
    updates, deterministic Vitest coverage, and network-isolated Playwright
    coverage for IndexedDB isolation/upgrades, strict validation, TTL/clock
    edges, corruption/quota failures, refresh cooldown, Retry-After variants,
    bounded backoff, already-aborted signals, cancellation, request identity,
    accessibility, and no external requests.
11. Return only the evidence-backed CTC-019 implementation specification using
    the 12-section response format required by the attached prompt.

Do not propose another research plan, ask for a broader product brief, write
full implementation code, add dependencies, provide a generic playbook, or
broaden scope. The first sentence of the response must be:

`CTC-019 specifies a browser-durable Overpass cache and bounded request policy
without implementing source export or PDF behavior.`

Start this replacement plan and return only the CTC-019 specification.
