# CTC-010: Club profile and dispersion overlay specification

Status: Codex specification/research owner baseline, 2026-08-15.

## Decision

Implement a local-only club profile and selected-target dispersion ellipse in
the existing SVG hole map. Profile data is included only in the explicit
project export; it is never requested, automatically persisted, or included in
the raw GIS-source export. Use the existing tangent-plane projection and native
TypeScript only.

The profile is project-wide; origin, target, and club selection are transient
selected-hole UI state. A profile has at most 14 clubs. Each club has a stable
local ID, unique trimmed name (1--40 characters), integer carry (1--700 yards),
and integer longitudinal and lateral dispersion (each 1--200 yards). The two
dispersion values are deterministic full widths, not confidence intervals,
probability, recommendation, or safety claims.

## Project-format contract

Introduce `chart-the-course-project/v2`, retaining v1's course identity,
copyright URL, holes, targets, and carries, and adding required `clubProfile`.
The importer accepts valid v1 as an empty v2 profile; it serializes v2 only.
Existing targets/carries must round-trip unchanged. No browser storage API is
used: reload clears unsaved profile values, and explicit export is the only
transfer mechanism.

## Geometry and UI contract

1. Render only with valid projection, selected valid origin, target, and club;
   otherwise state why the overlay is absent. The user can select a tee or
   existing target as origin.
2. Centre the ellipse at the projected landing coordinate exactly `carry` yards
   from origin toward target. Its longitudinal axis follows origin-to-target;
   its lateral axis is perpendicular. Convert yards to logical SVG units with
   `yards / YARDS_PER_METER * projection.scale`; each displayed radius is half
   its declared full width.
3. Visually clip the ellipse to the map and state when its geometry extends
   beyond the map. It is above terrain/features and below targets/crosshair,
   has a dashed non-color cue, and an accessible label with club, carry, and
   both dispersion values.
4. Add keyboard-accessible profile add/edit/delete controls and selected
   target/club controls. Local validation is announced using existing live
   status; invalid input cannot corrupt valid state.

## Required verification

- Strict v2 validation and deterministic export; valid v1 migration; rejection
  of malformed, non-finite, duplicate, oversized, and unknown profile fields.
- Unit tests for units, radii, carry-distance landing centre, cardinal and
  diagonal orientation, and missing/degenerate origin/target/club/projection
  suppression.
- Browser tests for accessible controls, layering, responsive output, no storage
  API, no profile data in requests/raw source export, and no new external request.
- Run `npm run check`, `git diff --check`, and
  `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`.

## Rejected alternatives and boundaries

No geometry/chart/map/storage dependency; localStorage/IndexedDB; per-hole
club duplication; deriving longitudinal width from a made-up lateral ratio;
confidence-based statistics; recommendation/risk scoring; PDF changes;
providers, APIs, accounts, telemetry, cloud sync, or source-export changes.
No mutable external term, library, provider, standard, or advisory is needed
for this local-math scope. On 2026-08-15, Codex inspected the live CTC-010 task
plus `src/map.ts`, `src/HoleMap.tsx`, `src/project.ts`, and tests.
