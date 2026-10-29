# Production planning-to-print contract

Issue: [#49](https://github.com/ajason13/chart-the-course/issues/49).
Status: **Adopted by the maintainer on 2026-10-29**, recorded in [#49](https://github.com/ajason13/chart-the-course/issues/49#issuecomment-6504532399)
after explicit approval of PR #78. Adoption covers this dependency tree and print
contract for the separately reviewed implementation in #50/#51.
Evidence checked 2026-10-29 against `51e92a4` (PR #77). This is a decision
for implementation in #50/#51, not shipped PDF functionality or permission to
publish a release. No dependency, persisted project schema, acquisition flow,
font asset or production entry changes in this issue.

## Decision and dependency boundary

Select direct vector drawing with exact `jspdf@4.2.1`, using its browser ES
module build and built-in Helvetica normal/bold. Keep PDF.js, SVG translation,
PDFKit and browser polyfills out of production. The existing
[evaluation](experiments/ctc-014-vector-pdf-evaluation.md) and three-page
CTC-008 prototype establish feasibility for fixed synthetic simple geometry;
they do not establish active-project, multipolygon, Unicode or release support.

The approved adoption scope includes the following **locked closure**, including
optional dependencies conservatively even when a restricted drawing path does
not call them. Versions come from `package-lock.json`, SHA-256
`60504b95d1cef9794f2e912bf4397424285ac36baa5654e9352421622ff8d0ab`.
Existing React/React DOM/Scheduler stay unchanged and are additional production
packages. Dependency edges are reproduced by the research command below.

| Candidate package | Version | Declared license / reviewed choice |
| --- | --- | --- |
| jspdf | 4.2.1 | MIT |
| @babel/runtime | 7.29.7 | MIT |
| fast-png | 6.4.0 | MIT |
| fflate | 0.8.3 | MIT |
| @types/pako | 2.0.4 | MIT |
| iobuffer | 5.4.0 | MIT |
| pako | 2.1.0 | MIT AND Zlib; retain both |
| canvg | 3.0.11 | MIT |
| core-js | 3.49.0 | MIT |
| dompurify | 3.4.17 | MPL-2.0 OR Apache-2.0; select Apache-2.0 |
| html2canvas | 1.4.1 | MIT |
| @types/raf | 3.4.3 | MIT |
| @types/trusted-types | 2.0.7 | MIT |
| base64-arraybuffer | 1.0.2 | MIT |
| css-line-break | 2.1.0 | MIT |
| performance-now | 2.1.0 | MIT |
| raf | 3.4.1 | MIT |
| regenerator-runtime | 0.13.11 | MIT |
| rgbcolor | 1.0.1 | MIT OR SEE LICENSE IN FEEL-FREE.md; select MIT |
| stackblur-canvas | 2.7.0 | MIT |
| svg-pathdata | 6.0.3 | MIT |
| text-segmentation | 1.0.3 | MIT |
| utrie | 1.0.2 | MIT |

A temporary copy of the repository manifest/lock moved only jsPDF from dev to
production, recalculated dependency flags offline with npm 11, and installed
with `--omit=dev --ignore-scripts`. It retained these exact versions and produced
26 installed production packages including the existing three. Its production
audit reported zero advisories and the existing license allow scan passed.
These are candidate-tree results, not production adoption evidence.

Manual inspection of the locked package artifacts confirmed Pako's root MIT
license and Zlib terms in `lib/zlib/README`, DOMPurify's Apache alternative, and
rgbcolor's MIT `LICENSE.md` (the scanner reports `MIT*`). Preserve complete
copyright/license texts, Zlib origin/restrictions and any applicable NOTICE
files. Scanner acceptance does not discard the Zlib obligation or authorize
arbitrary future compound licenses. No blanket license exception is proposed.

In #51, move only the exact jsPDF pin, preserve the reviewed transitive versions
in the lock, and update `THIRD_PARTY_NOTICES.md` with the whole installed
production closure and these license choices. Publish complete dependency
license/notice text with the app distribution, not just package names. Re-run
the [artifact compliance](artifact-compliance.md) gates with fresh production
SBOM, license and audit evidence from the **actual** head and emitted graph.
Every optional/dynamic chunk remains inventoried. Change the PDF-package build
ban narrowly for approved jsPDF modules; retain experiment-entry/module,
PDF.js/worker, other PDF-library and untracked asset bans. No package exclusion
or compliance bypass. New versions, new fonts or a different tree require a
fresh reviewed decision before adoption; a newly reported advisory requires
reassessment even if these versions have not changed.

Upstream sources checked on the evidence date:

- [4.2.1 package metadata](https://github.com/parallax/jsPDF/blob/v4.2.1/package.json)
  and [MIT license](https://github.com/parallax/jsPDF/blob/v4.2.1/LICENSE).
- [4.2.1 release](https://github.com/parallax/jsPDF/releases/tag/v4.2.1),
  [output-method HTML injection](https://github.com/parallax/jsPDF/security/advisories/GHSA-wfv2-pwc8-crg5)
  and [annotation object injection](https://github.com/parallax/jsPDF/security/advisories/GHSA-7x6v-j9x4-qf24):
  both advisories identify 4.2.1 as patched. This does not prove absence of
  other defects; both affected API families remain forbidden here.
- [Upstream font guidance](https://github.com/parallax/jsPDF/blob/v4.2.1/README.md#use-of-unicode-characters--utf-8)
  requires appropriate custom fonts for general Unicode. No such asset is
  adopted; use the explicit text policy below.

## Browser-local security boundary

Allow only application-owned typed primitives, fixed styles/fonts/page sizes,
plain text and `output("arraybuffer")`, then local Blob downloads. Allow
vector paths with even-odd compound fills and clipping, strokes/dashes,
circles, rectangles, measured text and fixed plain-text document metadata.
Validate all numeric operands as finite and within the scene budgets before
calling jsPDF. The renderer accepts neither raw PDF commands nor arbitrary
jsPDF options, plugin names, callbacks, styles or URLs from source/project data.

Do not import HTML/DOM/SVG documents, images, fonts, existing PDFs or remote
assets. No fetch, upload, telemetry, external viewer, new-window/data-URL output,
filesystem access, scripts, launch/open actions, links/annotations, forms,
attachments, embedded files, multimedia or encryption. Print copyright URLs
as inert searchable text. PDF.js remains a local test/experiment inspector,
not a production preview or download dependency. Keep source tag values and
labels inert even when they contain markup, PDF syntax or path-like text.

No new persistence: use an immutable snapshot of the loaded workspace, including
current unsaved edits. Notes are excluded entirely; static prototype notes are
not a model. Club profiles, dispersion selections, width tables and sampled
water-overlap scores are also excluded from this first print contract. Include
targets and carries only, so no transient club/analysis selection must be
persisted or inferred. Adding these omitted surfaces needs its own decision.

## Selection, ordering and content

The export panel selects 1–36 distinct holes belonging to the explicitly
selected course. Default to the currently selected hole. Do not export all
returned facilities or silently substitute the first course. Sort selected
holes by positive numeric hole number ascending; ties use source key in ASCII
order; null numbers follow numbered holes, then source key. Duplicate or missing
numbers retain separate identities and show their source keys. Selection order
is not print order. Stable targets/carries retain project array order and IDs.

Use US Letter portrait, 612×792 pt, 36 pt margins. Required pages in order:

1. Cover: course name (fallback `Course <sourceKey>`), course identity, ordered
   hole list/count, UTC export timestamp, source completion timestamp and stale
   state, app version, and the complete public disclaimer from
   [legal disclaimers](legal-disclaimers.md#public-disclaimer-text).
2. Summary, with continuation as needed: one row per selected hole, number/key,
   par or unavailable, mapped route length or unavailable, target/carry counts,
   data-quality warnings. Include acknowledgements, printed OSM copyright URL,
   source filename/SHA-256 and the instruction to share that source file with
   the PDF. Do not sum unknown yardages as zero or claim measured course length.
3. One map page per selected hole, followed immediately by that hole's text/table
   continuations: number/key, mapped route length, source-associated geometry,
   separately styled inferred/shared/context geometry, route, targets and carry
   arcs/labels, scale bar, legend, warnings, and authored target/carry table.
   Each row identifies the target or carry ID, label/origin and relevant yards;
   distinguish mapped route length from straight-line target distances. Use
   existing distance/rounding/origin helpers; unavailable values stay unavailable.

The map region is `(36,96,540,390)` pt; reserve text below it and footers from
y=684 to 756. Use at least 10 pt body text/14 pt leading, 8 pt map labels and
footers, and sufficient contrast/dash distinctions for grayscale. Wrap long
tokens by measured width. Never shrink below these sizes, ellipsize values,
overprint, or lose rows. Continue tables/warnings onto subsequent pages with
repeated hole identity/column headers, attribution and page numbers. Move an
entire row to a continuation if needed; split a row taller than a page into
explicitly marked continuation blocks. Keep each block within x=36…576,
y=36…756, with no overlap with map/footer regions. Preflight the whole book;
an unresolvable collision or capacity failure blocks the download.

No global north-up/rotation change: retain the existing projection orientation
and scale. Apply the same fit from `holeCoordinates` as the selected-hole map;
display candidates/context and authored overlays never enlarge that fit.
Preserve [geometry-contract](course-geometry-contract.md) parts/interiors,
scope/association basis and independent tagged features. Clip context/overlays
to the map region; indicate clipped/off-map guides and retain their table rows.
Use even-odd compound paths for each exterior and its interior rings, with
separate parts. Do not flatten areas, duplicate member fills, infer missing
geometry, or promote display candidates into analytic inputs. Map labels use
short stable references (T1…T10 / C1…C5) with full labels in the table, avoiding
label collisions without changing target identity.

Missing/unusable features or route produce explicit warnings and unavailable
measurements. A selected hole with no usable projection still receives its
page, with a `Map unavailable` panel and authored rows; do not omit it. An
unresolvable carry origin produces a row warning, not an invented arc. If the
renderer cannot preserve a supported normalized shape (including interiors),
fail the export rather than degrading it to a filled outline.

## Text and resource limits

Keep original strings unchanged in source/project data. For **dynamic PDF text**,
normalize a copy to NFC, replace tabs/CR/LF with spaces, and reject remaining
C0/C1 controls, bidi embedding/override/isolate controls and lone surrogates.
Print ASCII U+0020…U+007E directly. Render every other code point as a visible
ASCII escape, e.g. `Café` → `Caf[U+00E9]`, `😀` → `[U+1F600]`. Show an export
warning/legend explaining escapes and their field identities. This is an
explicit first-release limitation, not full Unicode shaping or transliteration.
Fixed attribution may use the prototype-verified © glyph; include it in PDF.js
text/render checks. Use no font download or user-provided font.

Titles have a 200-code-point input limit after NFC, with empty/missing names
using the source-key fallback. Authored labels retain the existing 40-point
limit. Over-limit or forbidden text causes a field-specific preflight error;
never mutate project validation or silently truncate. Escape expansion is
measured/wrapped just like other text. Source identifiers, hashes and printed
URLs must remain complete and searchable after joining wrapped lines.

Bound work to 36 holes, 128 total pages, 100,000 projected vertices, 20,000
drawing primitives and 10 MiB of finished PDF bytes. Existing source export
1 MiB and project limits (10 targets, 5 carries/5 distances per hole) stay in
force. Exceeding any limit produces a specific error suggesting fewer holes
or a smaller source area, never a partial book. These are product caps to test,
not evidence that arbitrary real courses fit them.

## Matching source evidence and downloads

For live data, build the existing `buildGisSourceExport` envelope with the exact
active raw response, query, endpoint, bounds, completion timestamp and stale
consent. The validated normalized result and project must match that same
selected course and detail response. Check source identity/context, not merely
hole numbers or equal-looking geometry. Preserve raw response text exactly;
do not put targets, carries, profiles or normalized geometry into this file.

Freeze source/package, selected holes, project and options together before any
async hashing/rendering. Compute SHA-256 over the UTF-8 bytes of the final source
download (including its terminating newline), and print its full hash and exact
filename in the PDF. Use one captured UTC `exportedAt` for both artifacts. The
source envelope format stays unchanged. Name the PDF
`ctc-yardage-<YYYYMMDDTHHmmssZ>.pdf`; use the existing source filename formatter.
Never derive filesystem names from course names or labels.

Provide adjacent keyboard-accessible PDF and `Download Raw GIS Source (ODbL)`
controls backed by the **same frozen package**. PDF remains disabled until
source construction/size/provenance validation succeeds. Both artifacts must be
available in that release. A course switch, refresh, project change, selection
change or consent change invalidates pending generation and both artifacts;
an older async result must never replace a newer package. No network refresh
occurs as an export side effect. Fresh data needs no extra consent; previously
consented stale data prints `Stale source`, completion date and age, without
silently refreshing or treating it as fresh.

The synthetic demo is a separate evidence branch: download the exact bundled
fixture text as `ctc-synthetic-source-<YYYYMMDDTHHmmssZ>.json` beside the PDF,
print its hash and fixture ID, and mark every page `Synthetic demo — not live
OSM data`. Do not forge an Overpass endpoint/query, freshness consent or ODbL
envelope for the fixture. Keep a visible statement of synthetic provenance and
the project license. This is a local bundled fixture download, not a provider
or acquisition flow; the live source schema/action remains unchanged.

OSM-derived pages need the policy attribution footer and full printed
`https://www.openstreetmap.org/copyright`, including map continuations. Summary
acknowledgements identify ODbL source and separate authored overlays. This
implements the project's conservative [attribution policy](../ATTRIBUTION.md).
[OSMF guidance](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines#Books,_magazines,_and_printed_maps)
requires printed attribution/URL for PDFs; the
[Produced Work guideline](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Produced_Work_-_Guideline)
and [ODbL §4.6](https://opendatacommons.org/licenses/odbl/1-0/)
inform source availability. Section 4.6 concerns public use of derivative
databases/works from them; the project's paired-source rule is deliberately
conservative, not a legal claim that every private PDF triggers that section.
Sharing a PDF requires offering its source to recipients; local availability
does not automatically publish or deliver it. Keep the reminder in the UI/PDF.

Prepare both byte arrays before enabling downloads. Download with object URLs
and revoke them after use/replacement/unmount. Report generation/download
failures accessibly; retain edits and permit retry. A browser download-start
event is not proof the user saved or shared the file. Do not claim source
delivery or successful PDF export if validation, generation or download setup
failed; do not silently fall back to the fixed prototype.

## Scene boundary for #50 and renderer boundary for #51

Use a small pure builder accepting an immutable, validated input equivalent to:

```ts
type ExportInput = {
  normalized: NormalizationResult;
  courseSourceKey: SourceKey;
  selectedHoleKeys: readonly SourceKey[];
  project: ProjectV2;
  source: { kind: "live"; envelope: GisSourceExportEnvelope; text: string }
    | { kind: "synthetic"; fixtureId: string; text: string };
  exportedAt: string;
  appVersion: string;
};
```

Validate this boundary; TypeScript types alone are insufficient. Reject absent,
foreign or duplicate hole keys, mismatched course/project/source, discovery-only
data and malformed/non-finite operands before rendering. Validate live `text`
against the envelope and active detail context; synthetic identity must match
the bundled fixture. Source digest/filename are derived from those exact bytes
by orchestration and bound to the scene, never supplied as unrelated UI values.
Do not let callers declare arbitrary data “validated”.

Return a discriminated success/failure, not a partial scene. A successful scene
contains ordered pages, fixed page/map/clip bounds, validated styled text/point/
polyline/compound-area primitives, source identities/association basis, distinct
authored IDs, warning rows, available/unavailable measurements, source pairing
metadata, and budget counts. Use page points with one explicit map transform;
keep all source geometry distinct from authored overlays. Explicit absent-map
and absent-origin states must survive into pages. No DOM, fixture-only IDs,
jsPDF object or side effects in the builder; the renderer only draws this
closed primitive vocabulary and returns bytes. Helpers may be shared with
experiments where practical, without relaxing their synthetic-only assertions.

## Required acceptance evidence

| Owner | Checkable evidence before merge |
| --- | --- |
| #50 | Pure deterministic scenes for one/multiple holes; repeated/missing numbers; shuffled source order; distinct selected-course identity; populated/empty v2 project and migrated v1; foreign/duplicate keys and source mismatch rejected. |
| #50 | Targets/carries keep IDs/order/values; no profile/notes/analysis leakage. Projection failure retains page/rows; invalid origin retains warning. Inferred/shared/context geometry remains display-only and clipped. |
| #50 | Multiple parts/interiors and independent tagged inner areas survive; invalid/unsupported topology stays unavailable. Width/route/distance helpers are reused only within their existing contracts. |
| #50 | 200-point titles, 40-point Unicode labels, unbroken tokens, combining/astral characters, malicious punctuation, controls and 10-target/25-distance tables exercise escaping, wrapping, continuations and rejection. Check every text box and budget at/above limits. |
| #51 | Network-isolated browser generation from actual active live-fixture and demo workspaces; no network/asset request caused by export; actual downloaded bytes inspected, with page sizes/order and full searchable attribution/source references. |
| #51 | PDF.js inspects all pages: vector paths/dashes and even-odd interiors; zero raster-image operations. Review rendered baselines including interior pixels, grayscale distinctions, absent-map panel and overflow continuations. No executable actions, annotations/forms, attachments, remote references or viewer launch. Parse document objects/actions, not only a raw substring scan. |
| #51 | Download/hash comparison proves exact source bytes and PDF references match; fresh/stale-consented, missing/mismatched/oversized source, source/project switches during hashing/rendering, failed generation/download setup, retry and URL cleanup. Source contains no authored data. Keyboard/live-region flow covered. |
| #51 | Actual production dependency closure/notices/SBOM/license/audit match the reviewed tree and emitted graph; unrelated experiments stay excluded. Full check/compliance/audit plus fresh-context licensing/security/export review pass. |
| #52 | End-to-end candidate evidence after #51 merge, actual printed-page inspection and current release/security/legal decisions. This contract grants no release/deployment authority. |

## Reproducible research and limits

Run `node docs/research/pdf-contract.mjs` under Node 24 after `npm ci`. It reports
the baseline lock hash and exact jsPDF dependency edges, measures synthetic
Helvetica text, and checks the proposed escape/control policy. It is a research
probe, not the future production builder or browser-layout certification.

Measured at 10 pt in a 540 pt column: 200-character prose title wraps to two
lines; 200 unbroken `W`s to four; 40 `W`s to one; 40 escaped emoji to four.
All measured lines fit. Ten worst-case labels plus 25 two-line distance rows
need 90 lines, so one map page's 10-line allowance needs two 40-line
continuations even before extra warning/header overhead. This disproves a
fixed one-page-per-hole text assumption; #50 must measure actual complete rows.

The current full checks reproduce the existing fixed synthetic PDF evidence;
they do not satisfy the future acceptance matrix. Unsupported topology in the
old experiments still rejects rather than rendering interiors. General Unicode
glyphs/shaping, real-course prevalence, all desktop OS/browser combinations and
print-driver behavior remain unverified. Those limits must not become claims
of universal course compatibility or PDF accessibility conformance.
