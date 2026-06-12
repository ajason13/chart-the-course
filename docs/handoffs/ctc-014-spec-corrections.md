# CTC-014 Claude QA-planning corrections

Date: 2026-06-12

## Disposition

Claude returned `READY WITH REQUIRED SPEC CORRECTIONS`. Findings B-1 through
B-6 and the experiment-oriented intent of Decisions 1 through 12 are accepted,
subject to the consistency and feasibility corrections below. These
corrections are authoritative and authorize one isolated CTC-014 evaluation
experiment. They do not authorize production PDF export or production
dependency adoption.

## Consistency and feasibility corrections

1. The export scene stores both identities correctly:
   `courseSourceKey = "way/9000060001"` and
   `holeSourceKey = "way/9000060101"`. A hole source key must never be labeled
   or persisted as the course source key.
2. The export-scene geometry union supports every current normalized
   `Geometry` variant: point, line, and polygon. It does not model all source
   layers as polygons. Geometry is projected through existing pure helpers and
   source-key ordering is preserved.
3. Existing non-color distinctions are required export intent. Dashed route,
   hazard, rough, bunker, vegetation, and carry styles must not silently become
   solid. A candidate that cannot preserve a required dash pattern records a
   fidelity failure; simplification is allowed only when explicitly approved
   after evidence, not as a default.
4. Reject `pdf-lib` as the preselected structural inspection tool. Its public
   high-level API does not provide the claimed reliable text extraction,
   operator-list, map-region attribution, or decompressed content-stream proof.
   The experiment must first perform a tool spike and select the smallest
   reviewed test-only mechanism that can actually extract text, inspect
   operators/XObjects, and render pages. `pdfjs-dist` is the leading hypothesis
   because PDF.js exposes text-content and operator-list/rendering behavior,
   but its exact current version, license, browser/Node compatibility, size,
   security posture, and worker configuration must be verified before
   installation. No structural tool is authorized merely by this document.
5. Operator presence alone does not prove one path per source feature or prove
   map-region ownership. Vector proof must combine:
   - export-scene counts and stable source identities;
   - parsed PDF operator/XObject evidence showing vector path/text operations
     and no raster map image;
   - rendered-page fidelity against the scene.
   Tests must not claim exact source-to-operator correspondence unless the
   chosen parser can prove it.
6. Keep all exact-pinned experiment and test dependencies together on branch
   `ctc-014-pdf-evaluation` for a reproducible comparison. Do not repeatedly
   install/uninstall and commit transient lockfiles. If the evaluated fixture,
   tests, and measurement scripts are merged as CTC-014 evidence, their
   devDependencies and lockfile entries remain so the evidence is reproducible.
   Moving any candidate to production `dependencies` remains prohibited until
   a separate adoption decision.
7. Because experiment candidates are devDependencies, production-only
   `npm run license:check`, `npm run audit:prod`, SBOM, and
   `npm ls --omit=dev` do not assess them. The experiment must add or document
   explicit full-tree/dev-inclusive license, vulnerability, and dependency-tree
   evidence in addition to preserving the canonical production compliance
   gate. Candidate transitive licenses and vulnerabilities are blockers even
   when omitted from the production SBOM.
8. Do not predeclare `svg-to-pdfkit@0.1.8` CJS-only without inspecting the
   installed package. Its last-published date and documented unsupported
   features are verified maintenance concerns. It remains a required fallback
   control and fails the maintenance recommendation gate unless stronger live
   evidence changes that conclusion.
9. The one-page fixture uses US Letter portrait, 612 by 792 points, with
   36-point margins and Claude's stacked content-region plan. Exact
   transforms are derived from named region constants in code; do not persist
   rounded `0.667` or `3.5` approximations as coordinate truth. Boundaries,
   clipping, minimum 0.5-point strokes, minimum 7-point text, and two-point
   position tolerance are tested.
10. Standard 14 Helvetica is an experiment hypothesis, not guaranteed
    Windows-1252 behavior. Required attribution text and the copyright symbol
    must be extracted and rendered correctly. If the leading candidate fails,
    record the failure; do not silently add a font. A project-controlled font
    requires a separate recorded license/notice/size decision before use.
11. Use fixed valid target/carry IDs and static fixture text. The fixture may
    use a deterministic synthetic `SourceMetadata` record, but it must keep the
    actual OSM copyright URL and must not imply `example.invalid` is a fetched
    source. No network operation occurs.
12. Browser print-to-PDF is a Chromium control, not a browser-local library
    candidate and not a production recommendation. Canvas remains a negative
    raster control. Neither control needs to satisfy every candidate-library
    pass gate.
13. Do not rely on navigating Chromium's built-in PDF viewer through `file:`
    URLs or on an unspecified browser-bundled PDF.js. The selected test
    renderer must expose a deterministic programmatic completion signal and
    work under the repository's network-isolated Playwright environment.
14. Visual tolerance is derived from repeated identical runs but may not be
    inflated by an arbitrary extra percentage point. Use the smallest stable
    documented tolerance plus a narrow reviewed allowance. Unexpected
    nondeterminism remains evidence against a candidate.
15. Object URL cleanup follows the established tested project pattern unless
    the experiment proves it inadequate: click a temporary download anchor,
    then revoke/remove it in a later scheduled callback. Tests assert ordering
    and exactly-once cleanup, never garbage collection.
16. The experiment harness exposes user-relevant generation status and useful
    failures without stack traces in visible UI. Diagnostic errors may be
    retained in test output or structured experiment evidence without logging
    secrets or adding production logging.
17. CTC-014 may recommend a final library only from measured evidence. The
    recommendation may be "no viable candidate." It must explicitly separate
    experiment devDependency retention from any later production-dependency
    adoption and keep CTC-008/CTC-020 release gates intact.

## Accepted experiment rules

- Build a pure dependency-free export-scene model before candidate renderers.
- Derive the scene from the existing synthetic normalized fixture, current
  projection/carry/project contracts, and exact stable source identities.
- Export only associated selected-hole geometry, deterministic target/carry
  overlays, scale, yardage table, static fixture note, disclaimer, visible OSM
  attribution, and full printed copyright URL.
- Exclude interactive DOM state, hit targets, crosshair, measurement overlay,
  controls, ARIA-only elements, unassociated features, HTML, annotations,
  forms, scripts, attachments, imported images, remote assets, and network
  calls.
- Measure exact candidate versions, installed/transitive tree, licenses,
  vulnerabilities, Vite bundle delta, PDF size, page box, searchable text,
  copyright glyph, vector/raster evidence, fixture fidelity, layout,
  repeatability, and maintenance posture.
- Keep standard repository checks and production compliance passing. Add
  explicit dev/full-tree checks for experiment dependencies.
- Use focused Vitest and network-isolated Playwright coverage. Final Claude
  audit remains mandatory after the experiment and recommendation are complete.

## Development authorization

Development is authorized on branch `ctc-014-pdf-evaluation` for the isolated
experiment only. Before installing candidate packages, record the clean
baseline build and compliance evidence. Verify exact current versions and
licenses immediately before installation. No production dependency, production
export UI, CTC-020 implementation, persistent notes model, or external
user-data flow is authorized.
