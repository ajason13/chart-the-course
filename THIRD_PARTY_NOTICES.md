# Third-Party Notices

This scaffold contains the following reviewed production runtime dependencies:

| Package | Version | License | Purpose |
| --- | --- | --- | --- |
| `react` | 19.2.7 | MIT | Declarative application UI |
| `react-dom` | 19.2.7 | MIT | Browser DOM rendering |
| `scheduler` | 0.27.0 | MIT | Transitive React scheduling runtime |

These packages were verified through the production SBOM and license checks on
2026-06-05. Their upstream license files are preserved in installed package
artifacts and represented in `sbom.json`.

## Current Map and Tile Provider Policy

CTC-018 selects a blank/vector-only MVP with no third-party basemap tiles loaded
by default. No MapTiler, Stadia, Protomaps, Thunderforest, OpenFreeMap, Esri, or
OSM public tile CDN runtime dependency is currently adopted.

The deployed MVP must not use the OSM public tile CDN without explicit project
approval. If a basemap provider is adopted later, this file must be updated
before release with:

- Provider name and plan or self-hosting mode.
- Tile/data source and license or terms URL.
- Required UI attribution text.
- Required PDF/print attribution text, including full URLs where links are not
  possible.
- Whether provider attribution is needed in PDFs.
- Whether the provider's data is an ODbL Produced Work and source availability
  applies.
- Verification date and owner.

OSM attribution is still required for OSM-derived course geometry even when no
third-party basemap tiles are used:

```text
Course data © OpenStreetMap contributors
https://www.openstreetmap.org/copyright
```

## Original Project License

Original Chart the Course code is licensed under Apache-2.0. See `LICENSE`.

## Dependency Notice Policy

Production dependencies must be reviewed before adoption and tracked through the
SBOM and license scanner. Preserve upstream copyright notices, license files,
NOTICE files, and attribution text required by dependency licenses.

Allowed production dependency licenses for the automated compliance gate:

```text
MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;OFL-1.1;CC0-1.0;Unlicense;0BSD
```

The scanner must fail on:

```text
GPL-2.0-only;GPL-3.0-only;AGPL-3.0;UNLICENSED
```

Packages reporting bare `Public Domain` require manual review and must not be
treated as automatically allowed.

## Current Compliance Command

```bash
npm ci
npx @cyclonedx/cyclonedx-npm \
  --omit dev \
  --output-format JSON \
  --output-file sbom.json \
  --validate

# Pass 1 - allowlist
npx license-checker-rseidelsohn \
  --production \
  --excludePrivatePackages \
  --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;OFL-1.1;CC0-1.0;Unlicense;0BSD"

# Pass 2 - denylist
npx license-checker-rseidelsohn \
  --production \
  --excludePrivatePackages \
  --failOn "GPL-2.0-only;GPL-3.0-only;AGPL-3.0;UNLICENSED"
npm audit --omit=dev --audit-level=high
```

Do not run `npm ci --omit=dev` before invoking a devDependency SBOM tool. Do not
use `--package-lock-only` in the authoritative SBOM command.

`license-checker-rseidelsohn` does not support `--onlyAllow` and `--failOn` in
the same invocation, so these must run as separate passes. They also pass
`--excludePrivatePackages` because this scanner reports the unpublished private
root package as `UNLICENSED` even though `package.json` declares Apache-2.0 and
`LICENSE` is present.

## Future Production Dependencies

Before adding MapLibre, Turf, PDF libraries, fonts, map tiles, geocoding
providers, or analytics tooling, update this file with:

- Package or provider name.
- Version or provider plan.
- License and notice obligations.
- Attribution text shown in-app or in generated PDFs.
- Compliance verification date.
