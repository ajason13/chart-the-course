# Tile Provider Strategy

Status: Selected for MVP on 2026-06-04 under CTC-018.

Chart the Course must choose a compliant base-map strategy before any deployed
map scaffold. The MVP must not depend on the OpenStreetMap public tile CDN for
deployed use, must keep attribution visible, and must leave room for a later
provider change without reshaping the yardage-book workflow.

## Decision

The selected MVP strategy is blank/vector-only rendering of OSM-derived course
geometry, user-authored target lines, yardage markers, hazards, notes, and
print/PDF overlays. The deployed MVP must not load third-party basemap tiles by
default.

Fallback path:

1. If users need geographic context beyond course geometry, self-host a scoped
   PMTiles/Protomaps basemap extract in project-controlled storage.
2. If operational burden is too high, evaluate MapTiler or Stadia under a paid
   or explicitly approved plan before enabling hosted basemap tiles.
3. If a provider's terms, attribution requirements, pricing, or service
   availability change materially, disable that provider in deployed builds
   until the policy is re-reviewed.

## Non-Negotiable Rules

- Do not use `https://tile.openstreetmap.org/{z}/{x}/{y}.png` or any other OSM
  public tile CDN endpoint in deployed Chart the Course builds without explicit
  project approval.
- Do not add prefetch, bulk-download, scraping, or offline tile caching features
  against public tile services unless the provider's plan and terms expressly
  allow them.
- Do not hide attribution behind app chrome, overlays, collapsed controls, or
  off-screen UI when a map or map-derived export is visible.
- Keep the tile provider configurable behind a provider adapter boundary when a
  map scaffold is introduced. Course geometry, yardage calculations, and PDF
  export must not assume a specific basemap vendor.

## Attribution Requirements

Even without third-party basemap tiles, Chart the Course uses OSM-derived course
geometry. OSM attribution remains required in UI views and PDFs that display or
export that geometry.

Required UI attribution for MVP geometry-only views:

```text
Course data (C) OpenStreetMap contributors
https://www.openstreetmap.org/copyright
```

Required PDF attribution for MVP geometry-only exports:

```text
Course geometry and map data (C) OpenStreetMap contributors.
OpenStreetMap copyright and license: https://www.openstreetmap.org/copyright
```

If a third-party basemap provider is enabled later, its attribution must appear
where the provider requires it:

- UI: visible on every map view using that provider, with links when the medium
  supports links.
- PDF/print: visible near the map, in a footer, citation, or acknowledgements
  block as permitted by the provider, including full URLs when links are not
  possible.
- Notices: listed in `THIRD_PARTY_NOTICES.md` with provider name, source data,
  plan or hosting mode, required attribution text, and verification date.

## Option Comparison

| Option | Fit | Attribution | Operational notes | Decision |
| --- | --- | --- | --- | --- |
| Blank/vector-only MVP | Best for first deployed app. Supports hole layout, yardage planning, target lines, notes, and PDF output without basemap tiles. | OSM attribution still required for OSM-derived course geometry in UI and PDFs. No provider attribution required. | Lowest vendor, cost, API-key, and availability risk. Less surrounding geographic context. | Selected for MVP. |
| Self-hosted PMTiles/Protomaps | Strong fallback when surrounding context becomes necessary. | Protomaps basemap downloads are OSM-derived Produced Works, so OSM attribution is required. Also preserve any Protomaps/OpenMapTiles/style notices that apply to selected assets. | Requires storage, CDN/range-request support, update workflow, integrity checks, and scoped extracts to avoid large planet-file operations. | Preferred fallback. |
| MapTiler | Viable hosted provider after plan review. | MapTiler docs require visible MapTiler and OpenStreetMap attribution; free accounts also require a MapTiler logo. Printed/static media need comparable visible attribution. | Requires API key, plan limits, billing review, and provider-specific UI/PDF attribution checks. | Defer until basemap need is proven. |
| Stadia Maps | Viable hosted provider after plan review. | Stadia requires Stadia Maps, OpenMapTiles, and OpenStreetMap attribution for most styles; Stamen styles add Stamen Design. Print must include required URLs such as `stadiamaps.com` and `openstreetmap.org/copyright`. | Requires API key/domain configuration, plan review, and style-specific notices. | Defer until basemap need is proven. |
| Thunderforest | Viable niche/activity-map provider, not a first choice for MVP. | Terms require Thunderforest and OpenStreetMap contributor attribution, with printed-media text using provider and OSM copyright URLs. | Registration and subscription model; no caching proxies or redistribution; more style-specific than needed for yardage-book MVP. | Not selected. |
| OpenFreeMap | Interesting free hosted vector option, not conservative enough for MVP. | OSM-derived attribution still applies; provider terms are broad, as-is, and may change. | Free as-is service with no availability warranty and discontinuation risk. Suitable for experiments, not project default. | Not selected for deployed MVP. |
| Esri basemaps | Mature commercial ecosystem, but excess scope for MVP. | Esri basemaps require Esri/source attribution depending on layer. | Terms, account requirements, SDK/provider coupling, and non-OSM data sources add policy complexity. | Not selected. |

## Source Notes

Research was checked against official provider or project pages on 2026-06-04:

- OpenStreetMap Foundation Operations tile policy: public OSM tile servers have
  limited capacity, require visible attribution, valid browser referrer behavior,
  caching, and prohibit scraping or heavy inappropriate use.
  <https://operations.osmfoundation.org/policies/tiles/>
- OpenStreetMap copyright and attribution guide: OSM data use requires credit
  and ODbL clarity; printed media should include the full copyright URL.
  <https://www.openstreetmap.org/copyright/attribution-guide/>
- Protomaps basemap downloads: Protomaps basemap is OSM-derived, distributed as
  an ODbL Produced Work, and hotlinking downloads is discouraged in favor of
  copying to controlled cloud storage.
  <https://docs.protomaps.com/basemaps/downloads>
- MapTiler attribution guide and copyright page: MapTiler maps require visible
  MapTiler and OpenStreetMap attribution; free accounts require a MapTiler logo.
  <https://docs.maptiler.com/guides/map-design/attribution/add-attribution/>
  <https://www.maptiler.com/copyright/>
- Stadia Maps attribution guide: hosted maps require provider and source
  attribution; print/video outputs must include applicable provider/source URLs.
  <https://docs.stadiamaps.com/attribution/>
- Thunderforest terms: attribution must credit Thunderforest and OpenStreetMap,
  with separate printed-media wording.
  <https://www.thunderforest.com/terms/>
- OpenFreeMap terms: free service is provided as-is and may be discontinued.
  <https://openfreemap.org/tos/>
