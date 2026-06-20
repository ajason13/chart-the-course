# CTC-020 Gemini revised baseline review

Date: 2026-06-19

## Disposition

Codex accepts Gemini's revised CTC-020 response as the corrected baseline for
Claude QA planning, with mandatory corrections below. It is not direct
implementation text.

CTC-020 may advance to `2. QA Planning (Claude)`. Runtime implementation remains
blocked until Claude returns an adversarial QA plan and Codex critically reviews
it.

## Accepted Baseline

- CTC-020 cannot be fully Done until real CTC-008 production PDF UI exists.
- Do not create fake, hidden, disabled, inert, or placeholder `Download PDF`
  controls.
- Phase 1 may implement an independently useful browser-local raw GIS source
  export core, but it must be recorded as a partial deliverable and must not
  claim final PDF adjacency or PDF acknowledgement acceptance.
- Phase 1 source export should use versioned JSON with
  `application/json;charset=utf-8`, deterministic root ordering, 2-space
  formatting, and filename pattern `ctc-gis-source-YYYYMMDDTHHmmssZ.json`.
- The export envelope must preserve exact `rawResponse` text as a string and
  derive only a safe primitive `osmElementsSummary` from parsed JSON.
- The export must include `exportVersion`, `exportedAt`, `license`,
  `copyrightUrl`, `query`, `endpoint`, `completedAt`, `bbox`,
  `osmElementsSummary`, and `rawResponse`.
- Valid empty Overpass responses are exportable source evidence with an empty
  `osmElementsSummary`.
- Stale source may be exported only when it corresponds to data explicitly
  rendered after CTC-019 stale-data consent; the export must include stale
  metadata and the UI must warn clearly.
- CTC-020 must remain separate from `src/project.ts` user-authored project
  export and from normalized geometry.
- No Ajv, Jest, Web Workers, XML support, API keys, providers, servers,
  telemetry, accounts, cloud sync, production PDF behavior, or PDF dependency
  movement is authorized by this baseline.
- CTC-008 must later include testable release gates so production PDF export UI
  cannot be presented or executed unless matching raw GIS source export and
  full printed OSM copyright URL behavior are available in the same release.

## Mandatory Codex Corrections

1. **Do not access private cache internals.** Gemini's diagram says Phase 1 can
   fall back to `overpassCache.memory`. That field is private and must not be
   read externally. The implementation must either expose a reviewed
   source-evidence API on `OverpassCache` or retain the exact active
   `CachedResponse` in `App` state.

2. **Current app state lacks exact raw response text.** `ViewState` stores the
   parsed response and source metadata only. Phase 1 must add explicit active
   source evidence state, or it must re-read a validated cache record through a
   public cache API before export. Do not reconstruct raw source from parsed
   geometry.

3. **Size policy must align with CTC-019.** CTC-019 does not durably store
   records over `1_048_576` bytes. Gemini's `1.5 MiB` export cap is rejected
   unless Claude and Codex accept a separate reason. Leading correction: Phase 1
   should cap serialized source export at `1_048_576` bytes and show a visible
   error for larger source evidence.

4. **Export stale only from explicit rendered state.** A stale cache record that
   exists but was not rendered through the CTC-019 consent flow is not
   exportable. The implementation must track whether current visible data is
   fresh, stale-with-consent, or absent.

5. **Use existing tooling and selectors.** Test examples using
   `#btn-execute-query`, `#map-canvas`, or Jest are illustrative only and must
   be rewritten for the current app's accessible roles/text and Vitest plus
   Playwright.

6. **Fix type signatures and examples.** `extractSafeElementSummary` returns an
   array, not one element or `undefined`. Tests must address
   `parsed.elements[0].tags`, not `parsed.elements.tags`, if checking parsed
   objects.

7. **Validate exact source metadata.** Export validation must require
   `source.query`, `source.endpoint`, `source.completedAt`, `source.bbox`, and
   `source.copyrightUrl`, and it must reject endpoint/copyright/bbox/query
   mismatches just as CTC-019 cache reads do.

8. **Keep legal text precise.** Repository docs should cite OSM and ODbL
   requirements, not assert legal conclusions beyond project guardrails.

## Claude QA Focus

Claude should challenge:

- Whether Phase 1 can be implemented without creating a misleading "Done"
  state for CTC-020.
- Whether the source-evidence read path preserves exact raw response text across
  fresh cache hits, live fetches, non-durable fallback, stale consent, and
  oversized responses.
- Whether the schema and validation rules are sufficient for source
  availability without mixing user-authored project state or normalized
  geometry.
- Whether object URL lifecycle, accessibility, file naming, dangerous-key
  handling, and deterministic tests are precise enough.
- Whether the future CTC-008 same-release release gate is testable rather than
  aspirational.

## Next Step

Prepare and submit the CTC-020 Claude QA planning prompt. Do not implement
runtime behavior until Claude's QA plan is returned and Codex records the
implementation gate.
