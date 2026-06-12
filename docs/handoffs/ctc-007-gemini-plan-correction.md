# CTC-007 Gemini Deep Research plan correction

Replace the entire proposed `Open-Source PM Research Request` plan. It is
unrelated to CTC-007.

Do not research generic product-management methodologies, translating concepts
into epics or user stories, downstream AI-agent task formatting, Principal
Product Manager templates, Notion schemas, roadmaps, generic architecture
documentation, or success-metric formats.

The attached `docs/handoffs/ctc-007-gemini-specification-prompt.md` is the sole
project-specific authority. Read its instructions and embedded repository files
before researching. The task is to produce the implementation-ready CTC-007
technical specification required by that file, not to explain how technical
specifications should generally be written.

Use exactly this replacement research plan:

1. Use the attached repository contracts to define a strict versioned local
   project JSON schema that keeps user-authored targets and carry settings
   separate from immutable normalized OSM geometry and source evidence. Persist
   hole identity using `hole.source.sourceKey`, never array indexes.
2. Research current primary browser-platform and security guidance only as
   needed to define safe local JSON file import/export, deterministic download
   behavior, file-size limits, strict validation, useful structured errors,
   unknown-field policy, prototype-pollution defenses, and safe rendering of
   imported strings.
3. Define target-marker identity, data, and add/edit/delete interactions for
   pointer, touch, and keyboard users without silently activating or breaking
   CTC-006 two-point measurement.
4. Define carry-arc origins, configurable distances, units, validation,
   geographic math, SVG projection/rendering, clipping/off-map behavior,
   deterministic styling, accessibility, and bounded test tolerances.
5. Define memory-only runtime project-state behavior plus explicit local JSON
   import/export. Keep IndexedDB, localStorage, autosave, cloud sync, accounts,
   server storage, CTC-019 durable Overpass caching, PDF/rendered export, and
   CTC-008+ features out of scope.
6. Define exact synthetic pure-function, Vitest, and Playwright coverage for
   schema validation, adversarial files, import/export round trips,
   add/edit/delete flows, carry arcs, measurement regressions, mobile,
   accessibility, attribution, and network isolation.
7. Return only the implementation-ready CTC-007 technical specification using
   the 14-section response format required by the attached prompt.

Do not propose another research plan, ask for a broader product brief, write
full implementation code, or broaden scope. The first sentence of the response
must be:

`CTC-007 specifies browser-side target markers, carry arcs, and explicit local
JSON project import/export only.`

Start this replacement plan and return only the CTC-007 specification.
