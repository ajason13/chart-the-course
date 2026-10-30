# Artifact-aware production compliance

The only approved deployment entry is `index.html` and its reachable assets in
`dist/`. The production build checks the Vite manifest and rejects extra entries,
experiment modules, workers and unexpected artifacts. The approved
`dependency-licenses.txt` is emitted by the license packaging gate, which checks
all 26 exact production versions and retains their complete license texts,
including Pako’s Zlib terms and the reviewed Apache/MIT alternatives. Deploy only
`dist/`, including this license file.

`dist/.vite/runtime-dependencies.json` records the lockfile hash, package paths,
names and versions from the production module graph, plus package provenance for
each emitted JavaScript chunk. The inventory includes static and dynamic imports.
It conservatively includes loaded JavaScript modules even if removed or inlined during
optimization; relying only on chunk module lists can lose dependency provenance.
The application graph includes React/React DOM/Scheduler and the approved
jsPDF browser module and inventoried optional chunks.

A package used by that graph must be installed at its locked version and included
in npm's production dependency set. A package marked `dev` or `devOptional`, an
untracked package, a linked package or an external JavaScript import fails the
build. Production worker builds, including inline workers, are rejected because
Vite builds them in a separate graph. CSS `@import`, `url()`, `image-set()` and
escaped syntax are conservatively rejected before CSS processing: these inputs
can embed package content outside the JavaScript graph. The current app uses none
of these CSS features. Asset construction with `import.meta.url` is also rejected
because Vite can inline those resources without loading their source as a module.
The standard Vite preload helper may use `import.meta.url` for the inventoried
chunks. Computed dynamic imports in emitted JavaScript are rejected by AST
inspection because their target set cannot be reconciled.
The source HTML entry must remain a module bootstrap with only basic document
elements with canonical attributes and charset/viewport/description metadata.
Module script source paths use plain local path characters. Event handlers, encoded
script URLs, asset elements, other metadata,
resource attributes, inline styles and non-module scripts are rejected before HTML
asset processing, including meta content and link imagesrcset paths. Author
application content in the existing module graph so package origins are recorded.
Supporting these paths requires reviewed provenance coverage and
regression tests first. Declaring a browser runtime package as a devDependency does not exempt it
from compliance. Direct package pins and the existing production license allow
and deny policies remain unchanged.

Run under Node 24 and npm 11, after `npm ci`:

```sh
npm run check
npm run compliance
npm run audit:all
```

`compliance` rebuilds production, generates and validates a fresh production
CycloneDX SBOM, runs the production license allow/deny checks and production npm
audit, then reconciles every locked production package with the SBOM and license
inventory at the locked version. This covers the emitted runtime graph and the
conservative production dependency closure. The production audit uses that same
lockfile and `--omit=dev` selection; high/critical findings or registry failures
fail the command. Lower-severity findings remain visible in its JSON report.

Evidence is generated under ignored `.compliance/`: `sbom.json`, `licenses.json`
and `audit.json`, plus the separate `audit-full-tree.json` from `audit:all`.
CI uploads these files with the runtime inventory and Vite
manifest as `production-compliance`, including on failed checks so audit details
remain available (unless the run is cancelled). The historical root `sbom.json` is not used
as current validation evidence; `generate:sbom` and `build:sbom` now write the
fresh SBOM under `.compliance/`. Never deploy that evidence directory.

The CTC-008/CTC-014 outputs in `dist-experiments/` are local research artifacts,
not approved distributions. PDF.js, PDFKit and SVG translators remain excluded from the production
graph and output. jsPDF alone is adopted for the active-workspace renderer.
Browser checks build and test them separately; this is not license/security
approval to distribute those bundles. Any future experiment distribution needs
its own reviewed entry inventory and runtime SBOM/license/audit coverage before
shipping. Do not promote PDF packages merely to pass the production check.

The adopted [planning-to-print contract](pdf-export-contract.md) records #49's
approved dependency closure and the narrow jsPDF adoption path. Only
`jspdf/dist/jspdf.es.min.js` is admitted by the module gate. Other jsPDF builds,
PDF libraries, experiments and workers remain rejected. Optional jsPDF chunks
are inventoried even though the restricted renderer never calls HTML/image APIs.
All production packages pass the same artifact and production evidence gates.

Build tools, tests and other dev-only packages are outside the production SBOM
and license policy because they do not enter shipped output.
`npm run audit:all` runs npm audit without
`--omit=dev` as the separate full-tree tooling/experiment vulnerability check;
it does not establish production reachability or experiment distribution approval.
No new package exclusions or license exceptions are introduced here.

Regression checks include real controlled Vite builds that reject an arbitrary
static or dynamically imported dev-only package (including inlined code), accept
it only when covered by the production set, and reject external dynamic imports.
Additional negative builds reject HTML resources, CSS imports/assets, inlined
URL assets, computed imports and inline/emitted worker
graphs. Artifact tests reject an extra experiment entry, workers and experiment hooks.
Evidence tests remove or alter SBOM/license records, change the lockfile and
inject audit failures to prove reconciliation fails closed. These checks run in
CI through `npm run check` and `npm run compliance`.
