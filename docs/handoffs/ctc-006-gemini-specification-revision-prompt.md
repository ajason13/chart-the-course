# CTC-006 final Gemini specification revision

Revise your prior CTC-006 specification one final time. Your response was
relevant, but it is not implementation-ready because several recommendations
contradict the supplied repository contracts.

Use the original self-contained
`docs/handoffs/ctc-006-gemini-specification-prompt.md` and the following
mandatory corrections. Return a complete replacement specification, not a
commentary or change summary.

## Mandatory corrections

1. Use only the actual existing contracts from `src/normalize.ts`:
   `NormalizationResult`, `NormalizedHole`, `NormalizedFeature`, `Geometry`,
   `NormalizationWarning`, `Coordinate`, and `SourceMetadata`. Do not invent
   `NormalizedGolfCourse`, `sourceEvidence`, `holeNumber`, `routeGeometry`,
   feature `type`, or feature `nodes`.
2. Identify selected holes by stable `hole.source.sourceKey`, not array index.
3. Never render or measure `NormalizationResult.unassociatedFeatures` as
   selected-hole context. Do not use them as null-route fallbacks or infer that
   they belong to a hole.
4. A selected hole renders only its own non-null route and associated non-null
   feature geometry. If none exists, show a non-renderable empty state.
5. Display exact normalization warnings without inventing causal claims such as
   a hole relying on an unsupported relation.
6. Use a fixed logical SVG viewBox with responsive CSS and
   `preserveAspectRatio`. Do not make browser pixels the canonical projection
   coordinate system.
7. Define a deterministic local equirectangular projection and inverse using
   named `{ lat, lon }` fields. Invalid coordinates return a typed failure;
   never claim valid-range coordinates can reliably be detected as swapped.
8. Define deterministic point-only and one-axis minimum display extents without
   mutating or fabricating geographic geometry.
9. Use Haversine measurement with a documented Earth-radius constant, clamp
   `a` to `[0, 1]`, treat valid antipodal points as valid, and use the exact
   international conversion `1 yard = 0.9144 meters`.
10. Display both yards and meters. Do not require a unit toggle unless you can
    prove it is required by the acceptance criteria.
11. Define a deterministic logical-SVG scale bar using a documented nice-
    distance sequence. Do not use a fixed 100 browser-pixel bar.
12. Use Pointer Events for mouse, pen, and touch to avoid duplicate touch/click
    selection. Define keyboard behavior separately.
13. Do not require hover/live tracking. Define deterministic two-point select,
    third-point restart, clear, selected-hole change, resize, focus, arrow-key,
    Enter/Space, and Escape behavior.
14. Do not add hidden production JSON diagnostics. Prefer exported pure helper
    tests and visible user-relevant warning/measurement state.
15. Do not prescribe unreviewed exact colors or color-only distinctions.
    Require adequate contrast and non-color distinctions such as strokes or
    dashes.
16. Define fixtures using the actual CTC-005 types. Do not fabricate exact
    distance expectations; use independently calculated expected values with
    explicit tolerances.
17. Keep existing discovery/detail, cache, diagnostics, error, network-
    isolation, attribution, and axe behavior passing.
18. Add no production dependency, provider, basemap, network/cache policy,
    persistence, PDF/export, target marker, carry arc, or CTC-019 behavior.

## Decisions you must resolve

Return exact recommended defaults for:

1. Logical SVG viewBox dimensions, padding, and minimum projected extent.
2. Whether measurement positions outside the inner rendered bounds are clamped
   or rejected, and whether blank map space is measurable.
3. Keyboard logical-unit step and optional modified larger step.
4. Earth-radius constant, display rounding, distance-test tolerance, and nice-
   scale sequence.
5. Warning matching/display behavior without inferred causality.
6. Whether explicitly ref-associated generic-water and vegetation are included
   in selected-hole rendering and bounds.
7. Whether a provider-adapter placeholder is needed now. Conservative default:
   no provider code until a provider is adopted.

## Required output

Return the complete implementation-ready CTC-006 specification using the
original prompt's 14-section response format. The first sentence must be:

`CTC-006 specifies browser-side selected-hole vector rendering and two-point
measurement only.`

Do not discuss the prior Redis response, AI-agent workflows, roadmaps, epics,
or unrelated tasks. Do not write implementation code.
