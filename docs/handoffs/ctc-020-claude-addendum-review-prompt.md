# CTC-020 Claude addendum re-review prompt

Act as adversarial QA reviewer for CTC-020 after spec corrections. Claude Chat
has no repository access; use this prompt as the source of truth.

## Required Verdict

Return one of:

- `READY FOR IMPLEMENTATION`
- `READY WITH REQUIRED SPEC CORRECTIONS`
- `NEEDS SPEC FIXES`

State whether Codex may move CTC-020 to `3. In Development (ChatGPT)` after any
remaining corrections are recorded. Distinguish blockers from minor fixes.

## Prior QA Verdict

Claude previously returned `NEEDS SPEC FIXES`. Codex accepted all six blockers
and minor corrections in
`docs/handoffs/ctc-020-claude-qa-plan-review.md`.

Accepted blockers:

- B-1: active source evidence must be explicit React state; re-reading cache at
  export time is rejected as the primary mechanism.
- B-2: Phase 1 scope must be explicit; source export is detail-mode only.
- B-3: `osmElementsSummary` needs a concrete minimal deterministic shape.
- B-4: the size cap must apply to the final pretty-printed JSON file.
- B-5: stale consent must be captured in `renderStaleData()`.
- B-6: active evidence must be replaced or cleared atomically with
  request/display transitions.

## Addendum to Review

The following addendum is now authoritative for Phase 1 implementation:

```markdown
# CTC-020 specification addendum

Date: 2026-06-19

This addendum resolves Claude QA blockers from
`docs/handoffs/ctc-020-claude-qa-plan-review.md`. It amends the accepted
Gemini revised baseline and is authoritative for Phase 1 implementation.

## Phase 1 Scope

CTC-020 Phase 1 implements a partial browser-local raw GIS source export for
detail-mode Overpass results only.

- Detail-mode means `state.kind` is `success` or `empty` and
  `state.mode === "detail"`.
- Discovery-mode source export is out of scope for Phase 1.
- Phase 1 does not satisfy final PDF adjacency or PDF acknowledgement
  acceptance criteria.
- CTC-020 must not be marked Done until real CTC-008 PDF UI exists and the
  PDF-adjacent source export, PDF acknowledgement, and same-release gate are
  implemented and audited.

## Active Source Evidence

Phase 1 must add explicit React state for active source evidence. Re-reading
IndexedDB at export time is rejected as the primary mechanism because it cannot
represent whether stale data was rendered through explicit user consent and can
race render-time freshness.

Required active evidence shape:

```ts
type ActiveSourceEvidence = {
  mode: "detail";
  cacheKey: string;
  rawResponse: string;
  source: SourceMetadata;
  consentState: "fresh" | "stale-consented";
};
```

Implementation rules:

- Set active evidence whenever a detail result is displayed from a live fetch,
  fresh cache hit, or stale-consented render.
- Do not set active evidence for discovery results.
- Clear active evidence when a new request starts, when a request is cancelled,
  when a request fails without rendering replacement stale data, when parsing or
  response-shape validation fails, and when the active state no longer
  represents displayed detail source evidence.
- Hole-selector changes do not affect active source evidence because they do not
  change the active detail Overpass response.
- Any new `submitDiscovery`, `loadDetail`, `refreshCourseData`, or
  `renderStaleData` flow must replace or clear active evidence atomically with
  the displayed result transition.

`renderStaleData()` must set active evidence with
`consentState: "stale-consented"` at the same time it displays the stale result
and clears `staleCandidate`.

## Export Envelope

The Phase 1 export is versioned JSON with MIME type
`application/json;charset=utf-8`, 2-space formatting, deterministic root key
ordering, and filename pattern `ctc-gis-source-YYYYMMDDTHHmmssZ.json`.

The filename timestamp is derived from `exportedAt`, not
`source.completedAt`. Multiple downloads in the same second may receive a
browser-generated suffix such as `(1)`; that behavior is accepted.

Required root fields, in alphabetical order:

- `bbox`: exact `source.bbox` string in `south,west,north,east` order.
- `completedAt`: exact `source.completedAt`.
- `consentState`: `"fresh"` or `"stale-consented"`.
- `copyrightUrl`: exact `source.copyrightUrl`; must be
  `https://www.openstreetmap.org/copyright`.
- `endpoint`: exact `source.endpoint`.
- `exportVersion`: `"1.0.0"`.
- `exportedAt`: ISO 8601 UTC timestamp for file generation.
- `isStaleSource`: boolean; `true` only for stale-consented exports.
- `license`: `"ODbL-1.0"`.
- `osmElementsSummary`: deterministic primitive summary array.
- `query`: exact `source.query`.
- `rawResponse`: exact unmodified raw Overpass response text.
- `sourceAgeDays`: integer present only when `isStaleSource === true`.

## OSM Element Summary

`osmElementsSummary` is an array of:

```ts
type OsmElementSummary = {
  type: "node" | "way" | "relation";
  id: number;
  tagKeys: string[];
};
```

Rules:

- Include one entry per valid OSM element in `rawResponse.elements`.
- Exclude tag values, geometry, nodes, members, bounds, center, and all other
  raw element fields.
- `tagKeys` contains only string keys from the element's `tags` object.
- Sort `tagKeys` lexicographically.
- Sort `osmElementsSummary` by `type` then numeric `id` ascending. Type order is
  lexical (`node`, `relation`, `way`) unless implementation defines and tests a
  different explicit order.
- A valid empty Overpass response exports `osmElementsSummary: []`.
- Because Phase 1 exports tag keys only and never merges parsed objects into
  application objects, prototype-pollution handling is not load-bearing for tag
  values. Dangerous keys are kept as inert strings only if they appear as tag
  keys; they must not be assigned as object properties outside the parsed raw
  response object.

## Validation and Error Behavior

Before download, validate:

- active evidence exists;
- `mode === "detail"`;
- exact required source metadata fields are present;
- `source.endpoint` matches the approved Overpass endpoint;
- `source.copyrightUrl` equals `https://www.openstreetmap.org/copyright`;
- `source.bbox` matches the active detail context;
- `source.query` matches the active detail query;
- `rawResponse` parses as valid Overpass JSON;
- parsed response shape passes the existing `validateResponse` contract;
- final serialized export file is within the size cap.

Corrupt durable records should not normally become active evidence because
CTC-019 cache reads already classify corrupt records as misses. CTC-020 still
must validate active evidence defensively before export.

Valid empty responses are exportable. Oversized exports are blocked with a
visible named error. Stale cache records that were not rendered through explicit
CTC-019 consent are not exportable because no active evidence exists for them.

## Size Cap

The export cap is `1_048_576` bytes and applies to the UTF-8 byte length of the
final pretty-printed JSON file, including envelope metadata, summary, and exact
`rawResponse`.

This can make a rendered CTC-019 cache record near the durable-cache ceiling
unexportable after envelope overhead is added. That is accepted for Phase 1 and
must be presented as a visible source-export size error, not as silent failure.

Use a deterministic measurement helper similar in spirit to
`recordSizeBytes()` in `src/overpassCache.ts`: build the exact candidate export
string, measure UTF-8 bytes, and compare to the cap before constructing the
Blob.

## Object URL Lifecycle

The download flow may follow the existing project export pattern:

1. Construct the JSON string.
2. Construct a Blob with `application/json;charset=utf-8`.
3. Create an object URL.
4. Create and click a temporary anchor with the structured filename.
5. Defer `URL.revokeObjectURL(url)` and anchor removal using the existing
   request-animation-frame or equivalent deferred lifecycle.

Tests must verify this lifecycle at near-cap export size rather than assuming
the project-export pattern is automatically sufficient.

## Tests Required Before Implementation Acceptance

Vitest coverage:

- envelope required fields, alphabetical root ordering, and 2-space formatting;
- exact `rawResponse` string preservation;
- `osmElementsSummary` shape, tag-key sorting, and type/id sorting;
- empty `elements: []` exports a valid empty summary;
- dangerous tag keys remain inert and do not affect object prototypes;
- filename timestamp formatting from `exportedAt`;
- full serialized export size at the cap and one byte over the cap;
- detail-only validation rejects discovery evidence;
- stale-consented evidence includes `isStaleSource`, `sourceAgeDays`, and
  `consentState`.

Playwright coverage:

- source-export control is absent or disabled for discovery-mode results;
- source-export control is available for eligible detail-mode results;
- download filename pattern and Blob MIME are correct;
- exported JSON preserves exact raw response text and excludes project targets,
  carries, notes, and normalized geometry;
- stale-consented export includes stale metadata and visible warning;
- new searches/loads/refreshes disable or replace prior export eligibility
  during loading and after failures;
- hole-selector changes do not invalidate export eligibility;
- oversized export shows the visible named error;
- axe coverage includes the new control in default and error states.

## Documentation Updates

Update `docs/overpass-query-contract.md` with the Phase 1 export envelope,
detail-only scope, size cap, and active-evidence behavior. Update
`ATTRIBUTION.md` only as needed to say the export supports the ODbL Section 4.6
source-availability mechanism described there. Do not claim that the export
guarantees legal compliance.

Future CTC-008 work must add tests proving no production PDF export control can
render or execute unless matching raw GIS source export and visible/searchable
full-URL OSM attribution are available in the same release.
```

## Review Focus

Check whether this addendum fully resolves B-1 through B-6 and the minor
findings. If more spec corrections are needed, list them concretely. Do not ask
for implementation code.
