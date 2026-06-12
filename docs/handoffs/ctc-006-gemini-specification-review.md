# CTC-006 Gemini specification critical review

Date: 2026-06-11

## Review verdict

Gemini's corrected response is relevant and useful, but it is not
implementation-ready as written. It correctly selected dependency-free native
React SVG, preserved geographic coordinates for measurement, proposed
latitude-aware projection, chose geodesic two-point distance, and covered
pointer, touch, keyboard, responsive, attribution, and synthetic-test concerns.

The response also contradicts the existing CTC-005 contract, invents types and
fixture shapes, renders unassociated features as selected-hole fallbacks,
proposes an incorrect antipodal failure rule, and leaves projection, scale-bar,
interaction, and accessibility behavior insufficiently precise. The accepted
and corrected decisions below are the specification baseline for Claude
adversarial QA planning. CTC-006 is not approved for implementation until
Claude challenges this baseline and required corrections are recorded.

## Accepted decisions

- Use native React SVG with zero new production dependencies.
- Keep projection and distance math in pure dependency-free TypeScript helpers
  separate from React interaction state.
- Preserve every CTC-005 `{ lat, lon }` coordinate unchanged; projected SVG
  coordinates are derived values only.
- Use a latitude-aware local projection for visual geometry and geodesic
  distance for measurement.
- Render deterministic SVG layer groups and keep the measurement overlay last.
- Keep OSM attribution visible whenever OSM-derived geometry is visible.
- Provide explicit pointer/touch and keyboard two-point measurement behavior,
  a clear action, responsive layout, and live announcements.
- Use only synthetic fixtures and retain Playwright network isolation and axe
  checks.
- Clear measurement when the selected hole changes. Preserve geographic
  measurement points when only the viewport size changes.
- Return deterministic diagnostics from pure math helpers or visible UI state;
  do not add logging side effects.

## Rejected or corrected Gemini decisions

- Reject the invented `NormalizedGolfCourse`, `sourceEvidence`,
  `holeNumber`, `routeGeometry`, feature `type`, and feature `nodes` contracts.
  The authoritative input is the existing `NormalizationResult`,
  `NormalizedHole`, `NormalizedFeature`, and `Geometry` types in
  `src/normalize.ts`.
- Reject passing a course plus selected array index into the map as the core
  contract. Selection identity must use the stable hole
  `source.sourceKey`; an index may change when normalized results change.
- Reject rendering any `unassociatedFeatures` in a selected-hole view. CTC-005
  deliberately preserves those features because association is unknown.
  Rendering them as selected-hole context implies unsupported association.
- Reject using unassociated features or invented fallback geometry when a hole
  route is null. A selected hole may render its own associated non-null feature
  geometry without a route; if it has no renderable route or associated
  geometry, show an empty state.
- Reject claims about a hole "relying on an unsupported relation." Warnings are
  result-level structured records and may not prove that relationship. Display
  the exact relevant normalization warnings without inventing causality.
- Reject throwing merely because latitude and longitude could plausibly be
  swapped. Both may be valid in their ranges. Named fields and runtime range
  validation prevent order mistakes; invalid coordinates produce a
  deterministic non-renderable result instead of crashing the app.
- Reject degree-based `±0.001` geometry padding. Projection may create a
  deterministic minimum display extent for point-only or one-axis geometry,
  but it must not mutate or imply source geometry.
- Reject fixed browser-pixel projection as the canonical model. Use a fixed
  logical SVG viewBox and `preserveAspectRatio`; CSS handles responsive display.
  Pointer coordinates must convert through SVG's current screen transform.
- Reject a Haversine rule that returns `null` for antipodal points. Clamp the
  computed `a` value to `[0, 1]`; valid antipodal coordinates have a valid
  distance. Invalid/non-finite coordinates return a typed failure.
- Reject a fixed 100-pixel scale bar derived from DOM pixels. Scale indication
  must be deterministic in logical SVG units and select a labeled "nice"
  ground distance that fits a bounded portion of the logical viewport.
- Reject `onTouchStart` as a separate primary interaction path. Use Pointer
  Events for mouse, pen, and touch, with keyboard behavior implemented
  separately. Avoid duplicate touch/click selection.
- Reject invisible production JSON diagnostics and test-only UI contracts as
  observability. Test exported pure helpers directly and expose user-relevant
  warnings, measurement state, and attribution visibly.
- Reject exact unreviewed colors and color-only distinctions. Styling must use
  existing CSS conventions, sufficient contrast, and non-color distinctions
  such as strokes/dashes where needed.
- Reject exact 10-pixel keyboard movement until the logical viewport and
  keyboard step contract are defined. Keyboard movement must be deterministic,
  bounded, visible, and usable at mobile and desktop display sizes.
- Reject the fabricated fixture and the claim that the proposed 0.0009-degree
  latitude delta must equal exactly 100.1 meters. Test expected distances
  against independently calculated bounded values with explicit tolerance.

## Corrected specification baseline

### Module and input boundary

Add a small pure geometry/rendering module, likely `src/map.ts`, with types and
functions for:

- collecting renderable coordinates from one `NormalizedHole`;
- producing a deterministic local projection and inverse projection;
- projecting point, line, and polygon geometry into logical SVG coordinates;
- calculating geodesic meters and formatting meters/yards;
- calculating a deterministic scale-bar model.

The React map component consumes:

```typescript
type HoleMapProps = {
  hole: NormalizedHole;
  warnings: NormalizationWarning[];
  source: SourceMetadata;
};
```

Exact component/file names remain reviewable by Claude. The selected hole is
identified outside the component by `hole.source.sourceKey`. The app calls
`normalizeGolfCourse(response, source)` only for successful detail responses,
retains the `NormalizationResult`, and offers deterministic hole selection.

### Selected-hole rendering eligibility

- A hole is selectable even when its number is null; label it using its number
  when present and stable source key otherwise.
- Render only the selected hole's non-null `route` and its own associated
  features with non-null geometry.
- Never render `NormalizationResult.unassociatedFeatures` in the selected-hole
  map.
- Include all supported `Geometry` variants: point, line, and polygon.
- If the selected hole has no route and no associated non-null feature
  geometry, render a visible non-renderable empty state and no SVG map.
- Display result-level normalization warnings without changing or inferring
  their meaning. Provide a useful selected-hole subset by matching
  `sourceKey`, `holeNumber`, or refs only where the warning itself supplies
  that evidence; keep the complete warning list available.

### Projection

- Use a fixed logical SVG viewBox, with exact dimensions and padding resolved
  by Claude. Responsive CSS scales the SVG while preserving aspect ratio.
- Collect the selected hole's renderable coordinates without mutation.
- Validate finite/in-range named `{ lat, lon }` coordinates defensively.
- Use a local equirectangular projection centered at the coordinate-bounds
  midpoint. Longitude delta is multiplied by cosine of center latitude; north
  remains visually up.
- Fit the projected bounds uniformly into the padded logical viewport and
  center unused space.
- Define a deterministic minimum projected extent for point-only or one-axis
  geometry. This is display-only and must not add or alter geographic
  coordinates.
- Return a typed failure for no valid coordinates, invalid viewport/padding,
  non-finite math, or a near-zero longitude cosine that cannot produce a
  reliable inverse.
- Projection and inverse projection must round-trip within an explicit
  tolerance and remain deterministic under repeated calls.
- Resizing the CSS display does not recompute geographic projection or clear
  measurement because the logical viewBox is stable.

### Layers

Render groups in this back-to-front order:

1. vegetation
2. generic-water
3. golf-water
4. rough
5. fairway
6. bunker
7. green
8. tee
9. route
10. measurement overlay

Within a feature-kind group, preserve the existing deterministic
`hole.features` source-key order. Geometry-specific SVG primitives must be
deterministic. Styling must distinguish feature classes sufficiently without
depending on color alone.

### Measurement

- Store selected measurement anchors as original geographic `Coordinate`
  values obtained by inverse-projecting logical SVG positions.
- Pointer and keyboard input must be clamped or rejected consistently at the
  logical viewport boundary; Claude must resolve the exact rule.
- Use Haversine distance with a single documented Earth-radius constant and
  exact international conversion `1 yard = 0.9144 meters`.
- Clamp Haversine `a` to `[0, 1]`. Identical valid points return zero. Invalid
  coordinates return a typed failure; antipodal coordinates remain valid.
- Display both yards and meters to satisfy the acceptance criterion. A unit
  toggle is unnecessary unless Claude finds the phrase requires switchable
  primary units; conservative default is one result showing both rounded
  whole-unit values.
- The scale bar uses the same projection/measurement contract. Choose a
  deterministic nice distance from a documented sequence and a bar length that
  fits a bounded fraction of the logical viewport. Label the represented
  ground distance, not raw pixels.

### Interaction and accessibility

- Use Pointer Events for mouse, pen, and touch. First activation sets anchor
  one, second sets anchor two, and a third starts a new measurement. A visible
  clear button resets both.
- Do not require hover/live tracking for acceptance; it may be omitted to keep
  the interaction deterministic and touch-equivalent.
- The SVG or its containing interaction surface is keyboard focusable. A
  visible bounded logical crosshair starts at the viewport center; arrow keys
  move it by a documented logical-unit step, Enter/Space select, and Escape
  clears.
- Prevent page scrolling only for handled map keys while the interaction
  surface has focus.
- Measurement points and line must remain visually distinguishable independent
  of color and have adequate touch visibility.
- Provide an accessible map name/description, visible instructions, visible
  result text showing both units, polite live announcements for completed
  actions, and clear focus styling.
- Keep visible attribution adjacent to every rendered map. The full copyright
  URL remains linked.
- Clear measurement on selected-hole identity change; retain it across CSS
  resize because anchors are geographic.

### Tests and fixture

- Prefer pure Vitest tests in `src/map.test.ts` for coordinate collection,
  projection/inverse round trips, north-up orientation, aspect fit, minimum
  extent, invalid input, all geometry variants, layer ordering, Haversine known
  values/tolerance, yards conversion, antipodal/identical cases, and nice scale
  selection.
- Extend or add an explicitly synthetic normalized/detail fixture that matches
  the actual CTC-005 types. Ensure at least one selectable hole has route, tee,
  fairway, green, bunker, golf-water, rough, generic-water, and vegetation
  associated by explicit strict ref if every layer must be tested. Do not
  spatially infer association.
- Add focused component tests only if the existing Vitest Node environment can
  support them without a new dependency; otherwise cover component behavior in
  Playwright.
- Extend the existing Playwright network-isolated flow to load synthetic detail,
  select a hole, verify deterministic layers/attribution/warnings, measure using
  pointer and keyboard, clear/restart, switch holes, and test mobile overflow,
  focus, live result text, and axe behavior.
- Keep existing search, raw diagnostics, cache behavior, and error-state tests
  passing. Do not introduce external requests.

## Remaining questions for Claude

1. Resolve exact logical viewBox dimensions, padding, and deterministic minimum
   projected extent without fabricating geographic geometry.
2. Resolve whether pointer/keyboard positions outside the inner rendered
   bounds are clamped or rejected, and whether measurement may target blank map
   space.
3. Resolve the exact keyboard logical-unit step and whether a modified larger
   step is needed.
4. Resolve the exact Earth-radius constant, display rounding, distance
   tolerance, and nice-scale sequence.
5. Resolve whether selected-hole warnings plus an expandable complete warning
   list are sufficient, and define warning matching without inferred
   causality.
6. Resolve whether associated generic-water and vegetation should be included
   in selected-hole bounds/rendering when explicit refs caused CTC-005 to
   associate them. Recommended default: yes.
7. Resolve whether the map component needs a provider-adapter placeholder now.
   Recommended default: no provider code until a provider is actually adopted.

## Claude QA-planning red lines

Treat these as blockers:

- any new production dependency, basemap/provider, network, cache, persistence,
  PDF/export, target-marker, carry-arc, or CTC-019 behavior;
- invented normalized types or fixture contracts that do not compile against
  `src/normalize.ts`;
- rendering or measuring unassociated features as selected-hole context;
- mutation, healing, simplification, or spatial inference over CTC-005
  geometry;
- measurement performed from SVG/pixel coordinates without inverse projection
  to geographic coordinates;
- swapped coordinate order, invalid/non-finite math, nondeterministic
  projection, or incorrect antipodal handling;
- hidden attribution, suppressed warnings, color-only semantics, inaccessible
  pointer-only interaction, or mobile overflow;
- hidden production test diagnostics or logging side effects;
- external network access or real-course fixtures in tests.

## Final Gemini revision disposition

Gemini received one final revision opportunity with 18 explicit mandatory
corrections and seven decisions to resolve. The final response was rejected in
full because it:

- abandoned native React SVG for layered Canvas/SVG/DOM rendering;
- reintroduced pan, zoom, pin dragging, snapping, multi-touch gestures,
  localStorage preferences, and out-of-bounds styling outside CTC-006;
- invented `RawGPSCoordinate`, normalized `[0,1]` types, and other contracts
  instead of using `src/normalize.ts`;
- prescribed console logging, Jest, Cypress, browser-pixel/DPR math, and
  unsupported sub-millisecond/sub-millimeter/60-FPS claims;
- failed to resolve the required fixed logical viewBox, deterministic minimum
  extent, warning matching, actual CTC-005 fixture contract, and bounded
  keyboard behavior.

No decisions from the final Gemini revision supersede this corrected baseline.
Proceed to Claude adversarial QA planning using this document as authority.

## Claude QA-planning disposition

Claude returned `READY WITH REQUIRED SPEC CORRECTIONS`. B-1 through B-7 are
accepted and recorded below, with two necessary consistency corrections:

- Replace Claude's circular minimum-extent algorithm with a fixed display-only
  `MIN_EXTENT_M = 20`. The proposed rule derives minimum meters from a scale
  that is undefined when both spans are zero and can produce different results
  depending on evaluation order.
- Replace the finite scale sequence plus overflowing 10-meter fallback with a
  generated 1/2/5 sequence across powers of ten. The proposed fallback violates
  its own rule that the bar fit within 40% of the inner viewport.

These corrections preserve Claude's intent while making the rules deterministic
for point-only and very small/large geometry.

### Final implementation constants

- Logical SVG viewBox: `800 × 600`.
- Uniform logical padding: `40`; inner bounds are
  `x ∈ [40, 760]`, `y ∈ [40, 560]`.
- Display-only minimum projected extent: `MIN_EXTENT_M = 20` on each axis,
  symmetrically centered without adding or moving geographic coordinates.
- Pointer and keyboard positions clamp to the inner bounds. Blank space inside
  the inner bounds is measurable; padding outside it is not.
- Keyboard step: `4` logical units; `Shift+Arrow` step: `20`.
- `EARTH_RADIUS_M = 6_371_000`.
- Exact yards conversion: `YARDS_PER_METER = 1 / 0.9144`.
- Display both units using `Math.round`: `"NNN yd / NNN m"`.
- Distance test tolerance: `max(0.5 meters, expectedMeters × 0.005)`.
- Scale bar selects the largest positive value from
  `{1, 2, 5} × 10^n meters` whose logical length is at most `288` units
  (40% of inner width). Generate candidates across the finite positive range
  needed by the current scale; this guarantees a fitting value without an
  overflowing fallback.
- Selected-hole warning subset uses only exact structured evidence:
  matching hole source key, matching defined non-null hole number, refs
  containing the hole source key, or refs containing an associated feature
  source key. The complete unfiltered warning list remains available.
- Explicitly associated generic-water and vegetation in `hole.features` are
  included in bounds and rendering. `unassociatedFeatures` are never rendered.
- Add a CTC-006-specific synthetic fixture with route plus all eight associated
  feature kinds. Do not change the existing CTC-005 fixture assertions.

### Final interaction rules

- First activation sets anchor one, second sets anchor two, and third starts a
  new measurement with anchor two cleared.
- Clear button and Escape clear anchors and reset the keyboard crosshair to
  `{ x: 400, y: 300 }`.
- Pointer coordinates convert through the SVG screen transform and clamp to the
  inner bounds before inverse projection.
- Keyboard crosshair starts centered, clamps identically, and handled keys
  prevent default only while the map interaction surface has focus.
- Measurement clears on selected-hole identity change and remains unchanged
  across CSS-only resize.

Claude authorized development after recording B-1 through B-7. The standard
post-implementation final Claude audit remains mandatory.
