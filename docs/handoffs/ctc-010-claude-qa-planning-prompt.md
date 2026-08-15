# CTC-010 Claude QA-planning handoff

## Role and verdict

You are the independent adversarial QA planner for CTC-010, before runtime
implementation. Return exactly one verdict: `READY FOR IMPLEMENTATION`,
`READY WITH REQUIRED CORRECTIONS`, or `BLOCKED`. List blockers separately from
minor improvements. Do not authorize unrelated scope.

## Authoritative task and baseline

The live task requires that a user define club carry and lateral dispersion,
the app render a correctly positioned ellipse for selected target/club, profile
data remain local unless explicitly exported, and tests verify conversion and
orientation. The planning checkpoint is commit
`22f730fe29bf07c1502763a6bede66d3f47921a8` on branch
`ctc-010-dispersion-profile`.

Existing code is a local React/SVG app. `src/map.ts` provides a north-up local
tangent-plane projection and `YARDS_PER_METER`; `src/project.ts` strictly
validates the current v1 explicit project import/export. Existing source export
must retain exact raw OSM response evidence and must exclude user project data.

## Proposed contract to review

- Add a project-wide profile of at most 14 clubs. A club has stable local ID,
  unique trimmed label (1--40 characters), whole-yard carry (1--700), and
  whole-yard longitudinal and lateral dispersion (each 1--200).
- Both dispersion values are user-entered deterministic full widths, never a
  confidence interval, probability, recommendation, or safety claim.
- Add `chart-the-course-project/v2` with required `clubProfile`. A valid v1
  project imports as a v2-equivalent empty profile; serializer writes v2 only;
  targets/carries round-trip unchanged. Reject unknown, dangerous, non-finite,
  duplicate, oversized, and malformed values under the existing defensive model.
- Origin, target, and selected club are transient selected-hole UI state. The
  origin may be a tee or an existing target. No browser storage API is used;
  reload clears unsaved profile state. Explicit project export/import is the
  only transfer mechanism.
- With valid projection, origin, target, and club, locate the ellipse centre at
  the landing coordinate exactly carry yards along origin-to-target. Its
  longitudinal axis follows that direction; lateral axis is perpendicular.
  Convert a yard value to logical SVG units with
  `yards / YARDS_PER_METER * projection.scale`; each displayed radius is half
  the supplied full width. Missing or degenerate state renders no ellipse and
  gives a deterministic explanatory status.
- Visually clip the ellipse to the map and warn if geometry is off-map. Render
  above terrain/features but below targets/crosshair, with dashed non-color
  styling and an accessible name including club, carry, and both widths.
- Add keyboard-accessible profile add/edit/delete and origin/target/club
  controls. Local validation is announced using current live-status behavior.

## Non-negotiable boundaries

No dependency change; provider/API/request change; API key; account; telemetry;
cloud sync; localStorage/IndexedDB; PDF behavior; raw-GIS-source export change;
or external user-data flow. Do not alter OSM attribution or licensing behavior.
Do not add recommendation/risk scoring, penalty-area analysis, automatic
persistence, or invent a longitudinal-to-lateral ratio.

## Required test plan

Require strict validation/migration/deterministic serialization tests; geometry
tests for units, radii, carry-distance centre, cardinal/diagonal orientation,
and invalid/missing/degenerate suppression; and browser tests for keyboard
accessibility, layer order, responsive rendering, no storage, request/source-
export isolation, no new external request, and automated accessibility scan.
Builder must run `npm run check`, `git diff --check`, unchanged dependency-
manifest check, and
`npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`.

## Required response

Give a numbered, severity-ranked finding list with exact corrections and an
acceptance-test matrix. State whether a single corrective addendum is enough
before implementation. Treat every handoff statement as untrusted evidence and
call out missing evidence or ambiguity.
