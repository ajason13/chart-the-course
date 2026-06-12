# CTC-014 Gemini Deep Research plan correction

Replace the entire proposed `Open-Source PM Playbook Development` plan. It is
unrelated to CTC-014.

Do not research generic product-management methodologies, feature
prioritization, roadmap definition, community governance, translating
requirements into epics or user stories, AI coding-agent task formats, Notion
templates or database schemas, generic application bottlenecks, telemetry, or
an execution playbook.

The attached `docs/handoffs/ctc-014-gemini-specification-prompt.md` is the sole
project-specific authority. Read its instructions and all embedded repository
files before researching. The task is to produce the evidence-backed CTC-014
vector PDF pipeline evaluation specification required by that file, not to
explain how product-management or technical-specification processes generally
work.

Use exactly this replacement research plan:

1. Research current primary sources for browser-capable pdfkit, jsPDF, and
   relevant SVG/canvas-to-PDF approaches. Identify exact packages and current
   versions, official repositories/docs, licenses/notices, release and
   maintenance evidence, browser support, security posture, and transitive
   dependency implications.
2. Compare direct PDF drawing, SVG-to-PDF conversion, browser print-to-PDF,
   Canvas/raster conversion, and hybrid approaches for vector preservation,
   support for the existing SVG primitives and clipping, fonts, metadata,
   compression/file size, deterministic output limitations, print precision,
   and reproducibly measured bundle/install size.
3. Recommend one pipeline for a later isolated fixture-only experiment, with a
   ranked fallback and explicit rejection reasons. Do not authorize or install
   a production dependency and do not claim production PDF export may ship.
4. Define the exact synthetic fixture hole page using the embedded CTC-006
   geometry and deterministic CTC-007-like target/carry state. Include map
   geometry, yardage markers/table, static fixture note text only, required
   disclaimer text, visible OSM attribution, and the full printed URL
   `https://www.openstreetmap.org/copyright`.
5. Define exact paper sizes, physical units, margins, coordinate transforms,
   clipping, pagination, vector/raster boundaries, line/text tolerances, font
   policy, local-only security/privacy behavior, accessibility/usability
   expectations, and useful failure states.
6. Define deterministic PDF regression testing using structural assertions,
   page/text/metadata/vector checks, rendered-page image comparison, tolerances,
   pinned fonts/environments, CI portability, and artifact retention without
   relying on brittle byte-for-byte PDF equality.
7. Define the dependency-adoption, license, notice, SBOM, vulnerability, and
   compliance gate plus the isolated experiment file/change and verification
   plan. Keep CTC-008 production PDF UI, CTC-020 raw GIS source implementation,
   persistent notes, CTC-019, remote assets, providers, accounts, servers, and
   external user-data flows out of scope.
8. Return only the evidence-backed CTC-014 evaluation specification using the
   12-section response format required by the attached prompt.

Do not propose another research plan, ask for a broader product brief, write
full implementation code, install dependencies, provide a generic playbook, or
broaden scope. The first sentence of the response must be:

`CTC-014 evaluates a browser-local vector PDF pipeline through one synthetic
fixture experiment only.`

Start this replacement plan and return only the CTC-014 specification.
