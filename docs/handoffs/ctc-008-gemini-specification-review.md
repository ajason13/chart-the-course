# CTC-008 Gemini Specification Review

Date: 2026-06-24

## Verdict

Rejected as an implementation baseline.

Gemini's response contains useful research input, but it is not specific or
safe enough to advance CTC-008 to Claude QA planning. CTC-008 remains in
`1. Spec Drafting (Gemini)`.

## Accepted as Research Input

- Browser-local PDF generation remains the target; no server components,
  accounts, telemetry, cloud sync, remote assets, providers, or external
  user-data flows are needed for the prototype.
- `jspdf@4.2.1` remains the leading production-adoption candidate from
  CTC-014, but adopting it into production runtime still requires a separate
  reviewed dependency movement.
- Current jsPDF vulnerability context is relevant to the production-adoption
  decision. Source check on 2026-06-24:
  - NVD `CVE-2026-31898`: jsPDF before 4.2.1 allowed PDF object injection
    through `createAnnotation` color input; fixed in 4.2.1.
    <https://nvd.nist.gov/vuln/detail/CVE-2026-31898>
  - NVD `CVE-2026-31938`: jsPDF before 4.2.1 allowed HTML injection through
    `output` options; fixed in 4.2.1.
    <https://nvd.nist.gov/vuln/detail/CVE-2026-31938>
  - NVD `CVE-2026-25535`: jsPDF before 4.2.0 allowed denial of service through
    untrusted GIF/image input passed to `addImage` or `html`; fixed in 4.2.0.
    <https://nvd.nist.gov/vuln/detail/CVE-2026-25535>
  - `npm view jspdf@4.2.1` reports MIT license, unpacked size 30,192,058
    bytes, and direct dependencies `@babel/runtime`, `fflate`, and `fast-png`.
- PDF pages containing OSM-derived geometry must include visible/searchable OSM
  attribution and the full printed URL
  `https://www.openstreetmap.org/copyright`.
- The real `Download PDF` control must be adjacent to the existing
  `Download Raw GIS Source (ODbL)` control when PDF behavior ships.
- Static fixture notes are the only currently authorized notes source.
  Persistent or user-authored notes require a separate reviewed data-model
  decision.
- PDF Blob/object URL cleanup must be deferred until after the browser has
  consumed the download URL.

## Blocking Issues

1. **No concrete production-adoption decision.** The response says CTC-014
   restricts PDF libraries to development and integration channels, but then
   outlines production modules and UI work without choosing one delivery path:
   production feature, gated fixture-backed prototype, or smaller dependency
   adoption task. CTC-008 cannot move forward until that path is explicit.

2. **Dependency claims are incomplete or over-specified.** The response lists
   `fflate` and `fast-png` but omits `@babel/runtime` from the current
   `jspdf@4.2.1` direct dependency set. It also treats bundle-size targets and
   tree-shaking exclusions as requirements without proving them in this repo.
   `html2canvas`, `canvg`, and `dompurify` are optional jsPDF dependencies in
   the lockfile, so the corrected spec must say exactly whether and how the
   production import path avoids them.

3. **Text sanitization conflicts with required attribution.** The proposed
   rule to scrub non-ASCII characters would remove `©`, which CTC-014
   explicitly verified in searchable PDF attribution. Sanitization must be
   context-specific: avoid vulnerable APIs and untrusted options, restrict PDF
   features such as annotations/forms/JavaScript, and preserve required text.

4. **Visual regression guidance is too loose.** Gemini proposes fixed
   tolerance values and masked snapshots. CTC-014 requires deriving the
   narrowest stable rendered-page tolerance from repeated runs and combining it
   with export-scene and PDF.js structural evidence. A blanket 1% mismatch
   threshold is not accepted.

5. **Implementation modules are not grounded in the current app.** The response
   proposes `src/pdfCompiler.ts`, `src/pdfCoordinateProjector.ts`,
   `src/pdfVectorRenderer.ts`, and `src/pdfDownloader.ts` without mapping them
   to existing `HoleMap`, `normalize`, `project`, CTC-014 export-scene work,
   or current `App.tsx` state. The corrected spec must define typed boundaries
   using current source data rather than inventing a parallel architecture.

6. **Coordinate scope includes irrelevant cases.** The current Overpass
   contract rejects antimeridian-crossing, unbounded, and large bboxes. CTC-008
   should specify behavior for existing bounded synthetic fixture geometry, not
   spend acceptance scope on near-pole or antimeridian handling unless a future
   task changes the input contract.

7. **Same-release source-export gate is under-specified.** The response
   mentions UI adjacency but does not define a testable release gate that
   prevents PDF export from shipping without the raw GIS source export in the
   same release. It must cover visible UI adjacency, DOM presence, enabled
   state, and a Playwright assertion against the real controls.

8. **ODbL/legal wording is too absolute.** The response asserts strict legal
   classification and compliance conclusions. Repo docs should stay
   source-grounded and avoid pretending implementation details guarantee legal
   compliance.

9. **Security scope includes blocked or irrelevant features.** AcroForm future
   input, annotations, embedded JavaScript, remote images, `html()`, and
   `addImage` should remain blocked for CTC-008 unless a reviewed task later
   authorizes them. The corrected spec should use these vulnerabilities to
   justify narrow API usage, not expand the feature set.

10. **Wrong AGPL reference wording.** The repo guardrail concerns the AGPL-3.0
    `ace` project, not "the ace editor" as a generic component.

## Required Revision

Use `docs/handoffs/ctc-008-gemini-revision-prompt.md` for the next Gemini
revision. Do not advance to Claude QA planning or runtime implementation until
Codex accepts a corrected CTC-008 baseline.
