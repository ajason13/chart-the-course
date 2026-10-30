# Third-Party Notices

The application contains the following reviewed production runtime dependencies:

| Package | Version | License | Purpose |
| --- | --- | --- | --- |
| `react` | 19.2.7 | MIT | Declarative application UI |
| `react-dom` | 19.2.7 | MIT | Browser DOM rendering |
| `scheduler` | 0.27.0 | MIT | Transitive React scheduling runtime |

Production PDF adoption follows the maintainer-approved [contract](docs/pdf-export-contract.md). Exact jsPDF 4.2.1 is used only for local vector drawing. Its conservative installed closure (including optional packages) is:

| Package | Version | License choice |
| --- | --- | --- |
| `@babel/runtime` | 7.29.7 | MIT |
| `@types/pako` | 2.0.4 | MIT |
| `@types/raf` | 3.4.3 | MIT |
| `@types/trusted-types` | 2.0.7 | MIT |
| `base64-arraybuffer` | 1.0.2 | MIT |
| `canvg` | 3.0.11 | MIT |
| `core-js` | 3.49.0 | MIT |
| `css-line-break` | 2.1.0 | MIT |
| `dompurify` | 3.4.17 | Apache-2.0 alternative |
| `fast-png` | 6.4.0 | MIT |
| `fflate` | 0.8.3 | MIT |
| `html2canvas` | 1.4.1 | MIT |
| `iobuffer` | 5.4.0 | MIT |
| `jspdf` | 4.2.1 | MIT |
| `pako` | 2.1.0 | MIT AND Zlib (both preserved) |
| `performance-now` | 2.1.0 | MIT |
| `raf` | 3.4.1 | MIT |
| `regenerator-runtime` | 0.13.11 | MIT |
| `rgbcolor` | 1.0.1 | MIT alternative |
| `stackblur-canvas` | 2.7.0 | MIT |
| `svg-pathdata` | 6.0.3 | MIT |
| `text-segmentation` | 1.0.3 | MIT |
| `utrie` | 1.0.2 | MIT |

Every production build emits `dependency-licenses.txt` with complete reviewed license texts for all 26 packages, including Pako’s zlib origin/restrictions. DOMPurify uses its Apache-2.0 alternative and rgbcolor its MIT alternative; no blanket compound-license exception applies. Ship this file with the application. Version/closure changes fail the license-asset build gate until reviewed. Production SBOM/license/audit evidence is regenerated for the actual build under `.compliance/`; the scanner is not a substitute for these preserved texts.

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

The adopted [PDF dependency and export contract](docs/pdf-export-contract.md)
records the approved jsPDF closure, license choices and restricted rendering APIs adopted above.

Before adding MapLibre, Turf, PDF libraries, fonts, map tiles, geocoding
providers, or analytics tooling, update this file with:

- Package or provider name.
- Version or provider plan.
- License and notice obligations.
- Attribution text shown in-app or in generated PDFs.
- Compliance verification date.
