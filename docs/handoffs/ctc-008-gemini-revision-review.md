# CTC-008 Gemini Revision Review

Date: 2026-06-25

## Verdict

Rejected as an implementation baseline.

Gemini's revision is materially closer because it chooses a gated
fixture-backed prototype path, preserves static fixture notes, keeps server and
remote-asset scope out, and recognizes the same-release PDF/source-export gate.
It still cannot advance to Claude QA planning or runtime implementation because
key parts conflict with the current repository contract.

CTC-008 remains in `1. Spec Drafting (Gemini)`.

## Accepted as Research Input

- A gated fixture-backed prototype is the preferred direction over immediately
  shipping distributed/shared production PDF behavior.
- CTC-008 must remain browser-local and network-isolated.
- `jspdf@4.2.1` remains the leading low-level vector drawing candidate from
  CTC-014.
- CTC-008 must avoid jsPDF high-risk APIs: `html()`, `addImage()`,
  `createAnnotation()`, `addJS()`, AcroForm/forms, embedded JavaScript,
  annotations, remote images, remote fonts, and imported HTML.
- Static fixture notes are the only currently authorized notes source.
- PDF pages containing OSM-derived geometry must include visible/searchable
  attribution and the full printed URL
  `https://www.openstreetmap.org/copyright`.
- PDF/raw GIS source controls must be adjacent when real PDF behavior ships.
- PDF Blob/object URL cleanup should be deferred after triggering download.

## Source Checks

Source check date: 2026-06-25.

- NVD `CVE-2026-25755`: jsPDF before 4.2.0 allowed PDF object injection through
  user-controlled `addJS` input; fixed in 4.2.0.
  <https://nvd.nist.gov/vuln/detail/CVE-2026-25755>
- NVD `CVE-2026-25940`: jsPDF before 4.2.0 allowed PDF object injection through
  AcroForm properties/methods; fixed in 4.2.0.
  <https://nvd.nist.gov/vuln/detail/CVE-2026-25940>
- `npm view jspdf@4.2.1` reports MIT license, unpacked size 30,192,058 bytes,
  and direct dependencies `@babel/runtime`, `fflate`, and `fast-png`.
- OpenStreetMap copyright source remains
  <https://www.openstreetmap.org/copyright>.

## Blocking Issues

1. **Production dependency movement is still unjustified.** The response says
   `jspdf@4.2.1` will be added to production `dependencies`, while the
   resulting PDF UI is hidden or development/prototype-gated until a later
   production-adoption review. That imports production supply-chain and bundle
   risk without shipping a reviewed production feature. A corrected baseline
   must either keep jsPDF as a dev-only fixture experiment or explicitly
   authorize production dependency adoption with a real reviewed user-facing
   release gate.

2. **Hidden or query-flag PDF UI conflicts with the task boundary.** CTC-020
   explicitly avoided fake/inert PDF controls. CTC-008 can have a prototype
   route or local fixture harness, but it must not create production UI that is
   hidden, inert, or enabled only by `?prototype=true` while claiming the PDF
   acceptance criteria are satisfied.

3. **The proposed typed boundary is wrong for the current repo.** The response
   references `NormalizedCourse`, `CustomTarget`, and a `project.ts` WGS84
   transform role that do not exist. Current exports include
   `NormalizationResult`, `NormalizedHole`, `CourseCandidate`,
   `HoleStateV1`, `TargetV1`, and `CarryV1`; `project.ts` validates
   user-authored project exchange, and `HoleMap.tsx` currently owns viewport
   projection/UI rendering.

4. **The bundle-optimization requirement is incomplete.** The Vite snippet is
   syntactically incomplete and does not prove that optional heavy jsPDF paths
   are excluded. The corrected baseline must name the exact import path and
   build/test evidence needed, not a placeholder `external:` configuration.

5. **The `doc.text` sanitization statement remains ambiguous.** The response
   says text should be "strictly sanitized to plain ASCII and necessary UTF-8
   typography." The implementation must preserve `©` and the full URL in
   searchable text, reject or normalize only unsafe/control characters, and
   avoid high-risk jsPDF APIs rather than stripping required attribution.

6. **The content contract over-specifies unverified fixture fields.** The
   response names `courseData.name`, `courseData.operator`,
   `courseData.note`, and `courseData.description` without mapping them to
   current normalized course candidate/tag structures or the synthetic fixture.
   Static notes need an explicit repo-owned fixture source or literal
   prototype text, not assumed OSM tags.

7. **The same-release gate is not aligned with current tests.** The Playwright
   snippet uses nonexistent `data-testid` names and assumes a `?prototype=true`
   route. A corrected baseline must either define those test IDs as part of the
   accepted implementation or use current accessible roles and existing
   detail-mode/source-export behavior.

8. **QA references raw stream keyword scanning too strongly.** Searching the
   raw PDF byte stream for `/JS`, `/Launch`, or `/AcroForm` is useful as a
   guardrail, but PDF.js structural inspection and API-scope tests should be
   primary. Raw byte scans alone can be brittle or miss encoded object content.

9. **Page and layout constants are premature.** Exactly three pages, fixed
   `x = 12.7 mm, y = 203.2 mm` attribution placement, and page-specific copy
   should be decisions in the accepted export-scene contract. The current
   response does not prove those constants fit current synthetic fixture data
   or CTC-014 evidence.

10. **The response still does not define an implementation-ready acceptance
    boundary.** It oscillates between "gated prototype", "added to production
    dependencies", "production build hidden/disabled", and "separate
    production-adoption review." CTC-008 needs one coherent path.

## Required Correction

Codex should not request another broad Gemini research pass. If CTC-008
continues, prepare a Codex-owned spec addendum that chooses one of these
coherent paths:

- **Recommended:** a dev-only fixture-backed PDF prototype that keeps jsPDF in
  devDependencies and does not add production PDF UI; or
- a production PDF feature with a real reviewed production dependency movement,
  real user-facing `Download PDF`, and same-release source-export adjacency.

Do not advance CTC-008 to Claude QA planning until that corrected baseline is
written and reviewed.
