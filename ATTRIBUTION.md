# Attribution Policy

Chart the Course is an Apache-2.0 project that uses open map data and may
eventually use third-party rendering, geometry, PDF, font, and test
dependencies. This file records attribution requirements that must be preserved
in the product, generated exports, documentation, and release artifacts.

## OpenStreetMap and ODbL

OpenStreetMap data is licensed under the Open Database License. Any web map,
course-data view, printed page, or PDF generated from OSM-derived data must
include visible OpenStreetMap attribution.

Required URL for PDF and print outputs:

```text
https://www.openstreetmap.org/copyright
```

MVP PDF policy:

- Include an attribution or acknowledgements block in exported PDFs.
- Include the full URL `https://www.openstreetmap.org/copyright` in PDFs.
- Use a compact OSM attribution footer or note on map-bearing hole pages unless
  legal review approves a lighter layout.
- Keep OSM-derived course geometry separate from user-authored overlays, notes,
  and player profiles where practical. Merge layers only for display/export.

## ODbL Section 4.6 Source Availability

PDF exports are Produced Works. When a PDF is distributed or shared, Chart the
Course must make the source OSM geometry or the means to recreate it available.
The MVP mechanism is a `Download Raw GIS Source (ODbL)` action adjacent to PDF
export.

The raw GIS source export must include:

- Raw GeoJSON or OSM XML response.
- OSM IDs.
- Bounding box.
- Exact Overpass QL query.
- Source URL.
- `https://www.openstreetmap.org/copyright`.

Raw GIS export must ship in the same release as PDF export. This requirement
does not apply to purely private local previews that are not distributed or
shared.

## Tile Provider and Basemap Attribution

CTC-018 selects a blank/vector-only MVP. The deployed MVP must not load
third-party basemap tiles by default and must not use the OSM public tile CDN
without explicit project approval.

Even when no third-party basemap tiles are used, OSM attribution remains
required because the displayed course geometry is OSM-derived.

Required MVP UI attribution for geometry-only views:

```text
Course data © OpenStreetMap contributors
https://www.openstreetmap.org/copyright
```

Required MVP PDF attribution for geometry-only exports:

```text
Course geometry and map data © OpenStreetMap contributors.
OpenStreetMap copyright and license: https://www.openstreetmap.org/copyright
```

If a hosted or self-hosted basemap provider is enabled later, the provider's
required attribution must be visible in every UI map view that uses it, included
in PDFs or printed outputs when relevant, and recorded in
`THIRD_PARTY_NOTICES.md`.

Current fallback preference if basemap context becomes necessary:
self-hosted scoped PMTiles/Protomaps extracts in project-controlled storage,
followed by MapTiler or Stadia only after plan and attribution review.

## Overpass and Nominatim Request Identity

Browser JavaScript cannot reliably set a custom `User-Agent` header. Browser
API requests must use the deployed app origin/referrer where available and
prefix Overpass QL bodies with an identifying comment such as:

```text
/* chart-the-course/VERSION contact:https://github.com/[org]/chart-the-course */
```

If the project later uses a proxy, self-hosted Overpass, or commercial
provider, that server-side layer should set a descriptive upstream
`User-Agent`.

Default Overpass response cache TTL is 7 days for public Overpass usage. The UI
must provide an explicit "Refresh course data" action, rate-limited to prevent
repeated refetches. Operators using self-hosted or commercial providers may
configure a different TTL, with a minimum guardrail to prevent abuse.

Detailed tile-provider comparison and source notes are in
`docs/tile-provider-strategy.md`.

## Reference Projects

The following projects are study-only unless license compatibility or maintainer
permission is verified:

- `hacker-yardage`
- `openyardage-web`

Do not copy source code, UI structure, query text, generated assets, or
distinctive expressive implementation from unlicensed repositories. Generic
concepts, independently written Overpass queries, and independently derived
standard geometry math are allowed.

The `ace` project is AGPL-3.0 and may be used only for concept-level awareness.
Do not copy, modify, adapt, link, combine, incorporate, or distribute any `ace`
code in Chart the Course. Because Chart the Course is a network-delivered
browser app, incorporating AGPL-covered code can trigger AGPL Section 13
source-availability obligations for the combined or modified work.
