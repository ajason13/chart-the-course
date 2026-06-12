# CTC-007 mandatory Gemini specification revision

Revise the prior CTC-007 response. It is relevant but not implementation-ready
and does not authorize development.

Use these two attached files as authority:

- `docs/handoffs/ctc-007-gemini-specification-prompt.md`
- `docs/handoffs/ctc-007-gemini-specification-review.md`

The critical review accepts only the explicitly listed accepted decisions and
provides the corrected baseline. Resolve every mandatory unresolved decision.

Mandatory corrections:

1. Extend the existing native React SVG and CTC-006 projection/Haversine
   helpers. Do not replace them with Canvas, offscreen Canvas, pixel-owned
   rendering, a new Earth radius, or equirectangular distance truth.
2. Define an exact strict v1 JSON document containing user-authored project
   state keyed by stable `hole.source.sourceKey`. Do not export/import raw OSM
   responses, normalized geometry, query bodies, derived distances, visual
   preferences, notes, or trusted source metadata.
3. Define the complete strict validator and structured error model. Treat input
   as `unknown`; reject unknown fields, dangerous keys, duplicates,
   non-finite/out-of-range values, unsupported versions, and partial input.
   Never use `any`, object spreading/merging, or automatic migrations.
4. Define memory-only lifecycle, deterministic export, explicit file-input
   import, maximum size, course/hole mismatch behavior, all-or-nothing
   replacement, focus management, and object URL cleanup.
5. Define free geographic `{ lat, lon }` targets owned by stable hole source
   keys. Resolve target ID, label, ordering, explicit add/edit/delete modes,
   pointer/touch/keyboard behavior, cancel/save/delete semantics, and
   measurement-mode coexistence. Do not silently add dragging, pan, or zoom.
6. Define selected-tee or target carry origins, exact settings, validation,
   geographic sampling with existing constants, SVG projection/layering,
   closure/clipping/off-map behavior, color-independent styling, labels, and
   bounded test tolerances.
7. Define exact pure-function, Vitest, and Playwright tests, including
   adversarial import files, source-key mismatch, target CRUD, carry math,
   measurement regression, mobile, axe, attribution, and network isolation.
8. Keep CTC-008+, CTC-019, offline course caching, notes, PDF/rendered export,
   providers, new dependencies, autosave, durable persistence, accounts,
   server storage, and external user-data flows out of scope.
9. Return the revised implementation-ready specification in the original
   required 14-section format. Do not produce project-management tickets.

The first sentence must be:

`CTC-007 extends the existing React SVG map with strict hole-keyed user project
state, target markers, carry arcs, and explicit local JSON exchange only.`

Return only the revised CTC-007 specification.
