# Claude final audit: CTC-009 fairway width estimator

You are Claude Chat, independent final auditor. Audit commit `ce1cb84ed44fc0f59ce610e202f9417ae2a0b21d` on branch `ctc-009-fairway-width` against baseline `6a3a3ac75a495f69086bbc794c53914dbbe82001`.

## Acceptance criteria

- User chooses 220, 250, or 280 yards.
- Width is measured perpendicular to the mapped ordered target line.
- Missing/irregular fairway polygons yield clear warnings.
- Unit coverage includes straight, dogleg, narrow, and split fairways.

## Non-negotiable scope

Local React/SVG and existing normalized data only. No map/basemap/provider or Overpass-runtime change; no production dependency; no API, account, telemetry, cloud persistence, PDF behavior, or user-data-flow expansion. No third-party/AGPL `ace` reuse. Estimator state must remain transient and must not mutate carries, project JSON, IndexedDB, or export.

## Approved technical decisions

The station follows the route polyline in existing local metre projection; 220/250/280 are fixed UI choices. At an interior vertex within 0.001 m it uses the downstream retained tangent. The width line is perpendicular to that tangent. Crossings use even-odd pairing; intervals union at 0.01 m and only the interval containing the station is measured. Split intervals never bridge gaps. Legitimate narrow fairways return a number; sub-0.01 m results are `unstable-degenerate-width`. Typed no-estimate states must remain truthful and no overlay must render without numeric width. Single-ring normalized polygons only.

## Verification evidence

- `npm run check`: PASS — scaffold policy, build, 82 Vitest tests, 19 Playwright tests.
- Focused `npm run test:unit -- fairwayWidth`: PASS — 6 tests.
- Focused selected-hole Playwright check: PASS.
- `git diff --check`: PASS.
- `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`: PASS — license allow/deny and production audit (0 vulnerabilities).
- `package.json` and `package-lock.json` are unchanged. The compliance-generated SBOM timestamp/tooling churn was deliberately restored and not committed.

## Exact relevant diff

```diff
diff --git a/CONTEXT.md b/CONTEXT.md
index 18486da..7f7f46d 100644
--- a/CONTEXT.md
+++ b/CONTEXT.md
@@ -4,6 +4,82 @@ Last updated: 2026-06-26
 
 ## Current Status
 
+CTC-009 Claude QA checkpoint pending - 2026-08-11. Clean synchronized `main` at
+`6a3a3ac75a495f69086bbc794c53914dbbe82001` was inspected along with the live
+Notion task. Codex is the specification/research owner under the current
+workflow; the legacy `1. Spec Drafting (Gemini)` label was used only because
+the Notion schema retains it. Codex created the implementation-ready local,
+dependency-free estimator specification at
+`docs/handoffs/ctc-009-fairway-width-spec.md` (SHA-256
+`f5aaa2a1cbd7154237bafd74e4459a939d0e5398d537e8ec4e25b95aca2d27f0`) and
+the self-contained Claude QA-planning prompt at
+`docs/handoffs/ctc-009-claude-qa-planning-prompt.md` (SHA-256
+`4089c7f50f1b40889e5b2a9ce57bb52db54657b9ea41aac2f09715b83ef4dd3b`). Claude
+returned `READY WITH REQUIRED CORRECTIONS`; Codex accepted B-1--B-5 and
+RC-1--RC-8 in `docs/handoffs/ctc-009-claude-qa-plan-addendum.md` (SHA-256
+`158624d649cac7bc204758cd102c1ffd27b03e68bd8af45fe947a1cafbb2d84c`). The
+addendum makes vertex tolerance, narrow-vs-degenerate outcomes, collinearity,
+boundary containment, single-ring normalized geometry, rounding, even-odd
+pairing, UI state isolation, accessibility, and no-dependency implementation
+rules explicit. Checkpoint prompt:
+`docs/handoffs/ctc-009-claude-qa-checkpoint-prompt.md` (SHA-256
+`fe7c3521c959833159ad226e414c826d3830fa382d913859246a9b1c9b377e9d`). The
+algorithm uses only local tangent-plane metres and the existing ordered hole
+route/fairway polygons; it forbids provider, Overpass, dependency, API,
+account, telemetry, persistence, PDF, and user-data-flow expansion. Notion is
+`2. QA Planning (Claude)`. No runtime code has changed and implementation is
+blocked until Claude accepts the checkpoint. `git diff --check` passed.
+
+CTC-009 QA artifact correction - 2026-08-11. Claude independently confirmed
+all substantive algorithmic blockers closed but found the pre-implementation
+warning-copy docs were not yet in repository history. Codex corrected the
+premature wording and committed the handoff bundle on feature branch
+`ctc-009-fairway-width` in `e5beea4` (`Document CTC-009 fairway width
+specification`); commit `7f927d9` adds explicit copy for invalid target line,
+beyond route, missing, outside, irregular/degenerate/odd geometry,
+tangent/overlap, unstable-degenerate width, and split fairway. The remaining
+Claude check is mechanical only, via
+`docs/handoffs/ctc-009-claude-warning-copy-confirmation-prompt.md`. Keep
+Notion at `2. QA Planning (Claude)` and do not begin runtime work until Claude
+returns `READY FOR IMPLEMENTATION`.
+
+CTC-009 QA artifact remote access resolved - 2026-08-11. Claude correctly
+blocked verification because the requested CTC-009 documentation commits were
+local only. Branch `ctc-009-fairway-width` is now pushed and tracks
+`origin/ctc-009-fairway-width` at
+`https://github.com/ajason13/chart-the-course/tree/ctc-009-fairway-width`.
+Claude must inspect the committed specification and QA addendum on that remote
+branch and return the requested mechanical artifact confirmation before runtime
+implementation is authorized.
+
+CTC-009 warning-copy consistency correction - 2026-08-11. Claude found that
+the committed base spec's algorithm and acceptance matrix retained the rejected
+`narrow-fairway` label even though the UI copy and addendum correctly separated
+legitimate narrow widths from degenerate crossings. Commit `523e4a6`
+(`Correct CTC-009 narrow width specification`) changes the sub-1 cm result to
+`unstable-degenerate-width` and adds the required legitimate ~15 yd
+narrow-success row. Claude requested only a diff-level confirmation of that
+commit; do not move from `2. QA Planning (Claude)` or begin runtime work until
+it returns ready.
+
+CTC-009 implementation in development - 2026-08-11. Claude independently
+confirmed the pushed specification is internally consistent and returned
+`READY FOR IMPLEMENTATION`; Notion moved to `3. In Development (ChatGPT)`.
+Branch `ctc-009-fairway-width` now implements a local, native-TypeScript
+fairway-width estimator in `src/fairwayWidth.ts` and selected-hole UI in
+`src/HoleMap.tsx`. It stations 220/250/280 yd along the ordered mapped route,
+uses the local perpendicular tangent-plane line, reports only the fairway
+interval containing the target line, and emits typed warnings for absent,
+irregular, tangent/overlap, degenerate, split, outside, and beyond-route
+states. No project/carry persistence, request, provider, production dependency,
+or user-data-flow behavior changes. Unit tests cover straight, dogleg, narrow
+success, sub-epsilon degeneration, split/gap, missing, beyond-route, tangent,
+and collinear overlap; the existing network-isolated Playwright selected-hole
+test verifies controls, live-status semantics, responsive map layout, and no
+new external request. `npm run check` passed (82 Vitest tests, 19 Playwright
+tests), as did `git diff --check` and compliance (production audit: 0
+vulnerabilities). Final Claude audit remains required before Done.
+
 Workflow role update - 2026-06-26. Gemini Chat/Deep Research is currently
 treated as degraded or unreliable for deep implementation research. Codex may
 take over the former Gemini specification/research role for Chart the Course
diff --git a/docs/handoffs/ctc-009-claude-qa-plan-addendum.md b/docs/handoffs/ctc-009-claude-qa-plan-addendum.md
new file mode 100644
index 0000000..9f586ca
--- /dev/null
+++ b/docs/handoffs/ctc-009-claude-qa-plan-addendum.md
@@ -0,0 +1,103 @@
+# CTC-009 QA-plan correction addendum
+
+Status: Codex response to Claude's 2026-08-11 `READY WITH REQUIRED
+CORRECTIONS` verdict. All five blockers and RC-1 through RC-8 are accepted.
+This addendum amends, rather than replaces,
+`docs/handoffs/ctc-009-fairway-width-spec.md`. Claude checkpoint re-review is
+required before implementation.
+
+## Accepted blocker corrections
+
+### B-1: station/vertex tolerance
+
+Define `STATION_VERTEX_EPSILON_M = 0.001` metres. After removing zero-length
+route segments (length `<= 0.01 m`), calculate cumulative endpoints. A station
+matches an interior cumulative endpoint when its absolute difference is at most
+that epsilon; choose the first such endpoint in route order and use the first
+following retained segment as the tangent. Thus duplicate source points cannot
+change the tangent. At the final cumulative endpoint, use the final retained
+segment. If more than one vertex could match due to a route segment shorter than
+the station epsilon, select the downstream-most matching vertex; this is
+equivalent to following the route and deterministic. Unit tests must exercise
+an exact vertex and values `±0.0005 m` from it.
+
+### B-2: legitimate narrow width versus degenerate geometry
+
+`0.01 m` is solely `INTERSECTION_EPSILON_M`, a numerical-stability floor. A
+selected interval with computed width `<= 0.01 m` produces no numeric estimate
+and typed warning `unstable-degenerate-width`; it is not called narrow.
+
+Every width greater than `0.01 m`, including a legitimately narrow 15-yard
+fairway, is a normal successful estimate. The required “narrow fairway” test
+therefore asserts a truthful small numeric result (approximately 15 yd); a
+separate sub-epsilon fixture asserts `unstable-degenerate-width` and no overlay.
+
+### B-3: collinearity predicate
+
+For a projected non-zero edge with endpoint signed coordinates `t0`, `t1` on
+the estimator normal, the edge is collinear/overlapping exactly when
+`abs(t0) <= 0.01 m && abs(t1) <= 0.01 m`. This perpendicular-deviation test is
+the only collinearity predicate; no angle threshold is used. Such an edge makes
+its polygon `unstable-line-fairway-overlap`, excludes it from pairing, and
+never supplies a numeric estimate by itself.
+
+### B-4: station on boundary
+
+Containment is epsilon-inclusive: when `0` is within `0.01 m` of either end of
+a valid union interval, the station is inside that interval. If it adjoins two
+intervals that were not unioned, first merge them because their gap is within
+the same epsilon. This removes a floating-point-dependent outside result.
+
+### B-5: polygon ring contract
+
+Confirmed from `src/normalize.ts` on 2026-08-11: `Geometry` has only
+`{ type: "polygon"; coordinates: Coordinate[] }`; it has no multi-ring or
+interior-hole representation, and normalization accepts an area only as one
+explicitly closed coordinate sequence. CTC-009 therefore supports one exterior
+ring per normalized fairway feature only. It cannot silently include a mapped
+interior ring because such data cannot enter the normalized geometry contract.
+Any future multi-ring geometry contract requires a separate reviewed task and
+explicit even-odd hole subtraction. This task must not infer or reconstruct
+holes from raw Overpass data.
+
+## Accepted required corrections
+
+- **RC-1:** Formatting uses `roundHalfUpNonnegative(x) = floor(x + 0.5)` for
+  metres and yards. Widths are non-negative; this deliberately avoids an
+  engine-dependent negative-rounding question. Tests include values directly
+  below, at, and directly above `.5`.
+- **RC-2:** The original specification and this addendum contain final warning
+  copy and must be committed before development begins. At this addendum's
+  drafting time they are working-tree artifacts, not committed history. The
+  final audit must include both exact files.
+- **RC-3:** Pairing uses the even-odd (crossing-number) fill rule exclusively.
+  Polygon winding/order has no semantic effect.
+- **RC-4:** Selected yardage, result, warnings, and overlay are transient
+  `HoleMap` UI state only. They must never be added to `ProjectV1`, passed to
+  `onProjectChange`, written to IndexedDB, or included in project export.
+- **RC-5:** The warning container intentionally uses `role="status"` and
+  `aria-live="polite"`, never `role="alert"`, because switching carry choices
+  is an expected user action and should not interrupt assistive technology.
+- **RC-6:** Union merges intervals when `next.start - current.end <= 0.01 m`.
+- **RC-7:** `invalid-target-line` means route is not a line, has fewer than two
+  valid finite projected points, has no retained segment longer than `0.01 m`,
+  or produces non-finite projected values/tangent. It yields no estimate.
+- **RC-8:** `src/fairwayWidth.ts` will hand-roll these finite line-segment
+  operations in native TypeScript using existing `map.ts` projection helpers.
+  No geometry package, production dependency, or raw Overpass access is
+  permitted.
+
+## Expanded mandatory test matrix
+
+In addition to the original straight, dogleg, 15-yard narrow-success, split,
+missing, malformed, and beyond-route tests, add: concave (>2 crossings),
+overlapping polygon union, vertex touch without crossing, route endpoint,
+mixed valid/degenerate polygons, collinear overlap, sub-epsilon result,
+station-on-boundary, and station-within vertex epsilon. UI coverage must assert
+`role=status` + `aria-live=polite`, overlay omission on failures, rapid carry
+selection does not duplicate status nodes, no network request, and byte-equal
+project export / unchanged carry data before and after width interaction.
+
+The final diff must keep `package.json` and `package-lock.json` unchanged; the
+existing compliance SBOM/license-deny/audit flow is the dependency and AGPL
+provenance evidence.
diff --git a/docs/handoffs/ctc-009-fairway-width-spec.md b/docs/handoffs/ctc-009-fairway-width-spec.md
new file mode 100644
index 0000000..568d080
--- /dev/null
+++ b/docs/handoffs/ctc-009-fairway-width-spec.md
@@ -0,0 +1,176 @@
+# CTC-009 fairway width estimator specification
+
+Status: Codex-owned specification, 2026-08-11. This is a runtime feature and
+requires Claude QA-plan approval before implementation. The Notion status may
+retain `1. Spec Drafting (Gemini)` solely because that is the legacy schema
+label; Gemini has no role in this work.
+
+## Scope and existing architecture
+
+The app is a local-first React/SVG application. `normalize.ts` emits a
+`NormalizedHole` with an ordered `route` (`Geometry` line) and associated
+`fairway` feature polygons. `map.ts` supplies a local equirectangular tangent
+plane projection in metres (`createProjection` / `projectCoordinate`), and
+`HoleMap.tsx` owns selected-hole controls and SVG overlays. Carries currently
+represent circular distance rings and are unrelated to this estimator.
+
+CTC-009 adds a separate width readout and overlay for the selected hole. It
+does not change the project-file schema or save estimator state.
+
+## Definition
+
+For a selected carry distance `d` yards, the **fairway width** is the length in
+metres of the one continuous fairway-polygon interval on the line perpendicular
+to the target line at the `d`-yard station that contains the station itself.
+The displayed yard value is `round(metres / 0.9144)`; the metre value is
+`round(metres)`. It is an outline-derived local geometric estimate, not a
+guarantee of playable or hazard-free width.
+
+"Safe zone" means that same selected connected interval only. It does not
+subtract bunkers, water, trees, rough, slopes, out-of-bounds, or other hazards.
+Those data contracts are intentionally outside CTC-009.
+
+## Target line and carry station
+
+1. Use `hole.route` only. It must be a `line` with at least two consecutive,
+   distinct, valid coordinates after projecting into the local metre plane.
+   Its coordinate order is authoritative: first coordinate is the tee-side
+   origin and the final coordinate is the target-side end. CTC-009 does not
+   infer a route from tees, greens, centroids, or a straight line.
+2. Convert the chosen whole-yard distance to `d_m = d * 0.9144` metres.
+3. Walk route segments in their stored order, accumulating Euclidean planar
+   lengths. The station is the point `d_m` along that polyline. At an exact
+   interior vertex, use the following non-zero (downstream) segment tangent;
+   at the final endpoint use the preceding segment tangent. A zero-length
+   segment is skipped.
+4. If `d_m` is greater than the route length (with a `0.01 m` comparison
+   tolerance), return `carry-beyond-target-line`, render no width, and say
+   `This carry is beyond the mapped target line.`
+5. The unit tangent `u` of the selected segment defines the local target-line
+   direction. The estimator line is `P(t) = station + n*t`, where
+   `n = (-u.y, u.x)` and `t` is signed metres. Reversing route direction is
+   therefore not a benign implementation change: it moves every station.
+
+This defines doglegs as a route polyline rather than a tee-to-green chord:
+the station follows the dogleg and its width line is perpendicular to the local
+segment at that station, including the deterministic downstream rule above.
+
+## Fairway polygon and intersection algorithm
+
+The pure helper proposed as `src/fairwayWidth.ts` accepts a normalized hole and
+one carry value and returns a discriminated result plus optional display-line
+endpoints. It must use the same local projection as the map, in metres; it must
+not calculate widths from SVG pixels or latitude/longitude degrees. Extract
+only `feature.kind === "fairway"` values whose geometry is a polygon.
+
+For each candidate polygon:
+
+1. Require a finite projected ring containing at least three distinct vertices;
+   accept either explicit closure or implicit closure, closing it once locally.
+   Otherwise record `irregular-fairway-polygon` with the source key and exclude
+   that polygon.
+2. Intersect every non-zero boundary edge with `P(t)`. Use a fixed `0.01 m`
+   epsilon for parallel, endpoint, duplicate, and interval comparisons. A
+   boundary edge collinear with `P(t)` is `unstable-line-fairway-overlap`:
+   exclude that polygon and return no estimate if it is the only candidate.
+3. Coalesce intersections within epsilon. A vertex touch whose incident edges
+   remain on the same side of the estimator line is a **tangent**; discard it
+   from interval pairing and record `tangent-fairway-boundary`. A proper
+   crossing at a vertex is counted once.
+4. Sort proper crossings by `t`; pair them `[0,1]`, `[2,3]`, and so on to form
+   interior intervals. An odd number of proper crossings is
+   `irregular-fairway-intersections`; exclude that polygon. Never manufacture
+   an interval by pairing an unmatched crossing.
+5. Union overlapping/touching intervals across all valid polygons. Choose the
+   union interval that contains `t = 0` (epsilon-inclusive). Its width is
+   `end - start`. A result is valid only when this width is greater than
+   `0.01 m`; a zero/narrower interval is `unstable-degenerate-width` and has
+   no numeric estimate.
+
+No candidate polygons yields `missing-fairway`. Valid polygons with no interval
+containing `t=0` yield `target-line-outside-fairway`. Both have no numeric
+width. If one or more other union intervals exist, add `split-fairway` and
+retain only the interval containing `t=0`; never report the distance between
+outermost intersections as width. A split fairway whose target line falls in a
+gap reports `target-line-outside-fairway` plus `split-fairway` and no estimate.
+
+When valid and irregular/tangent polygons coexist, return the width from valid
+polygons and surface a non-blocking caution that one or more outlines were
+ignored. This is more truthful than failing a usable estimate due to unrelated
+bad geometry. All failures are typed and deterministic; warnings must not be
+derived from free-form parser warning text.
+
+## UI and accessibility
+
+Place a `Fairway width` panel beside the selected-hole carry controls. It offers
+three labelled buttons or a labelled select for exactly `220 yd`, `250 yd`, and
+`280 yd`, with `250 yd` initially selected on each selected hole. Selecting a
+distance recomputes immediately; it neither creates a carry ring nor mutates
+the project export. The successful text is, for example, `Fairway width at 250
+yd: 32 yd (29 m).` Render the chosen interval as a clipped, dashed line with
+short end ticks and an accessible label. Do not render an endpoint line when
+there is no numeric result.
+
+Warnings appear in the panel with `role="status"` / `aria-live="polite"`:
+
+- missing: `No usable fairway polygon is mapped for this hole.`
+- invalid target line: `The mapped target line is not usable for a fairway-width estimate.`
+- beyond route: `This carry is beyond the mapped target line.`
+- outside: `The target line at this carry does not fall inside a mapped fairway.`
+- irregular/degenerate/odd: `Some mapped fairway outlines are irregular; their width was not used.`
+- tangent/overlap: `The fairway boundary only touches or overlaps this width line; the estimate may be unavailable.`
+- unstable-degenerate width: `The mapped fairway crossing is too small to estimate reliably at this carry.`
+- split: `Multiple fairway sections cross this line; only the section containing the target line is measured.`
+
+Do not describe the result as a recommendation, precise course measurement, or
+hazard clearance. Preserve the existing selected-hole reset and keyboard/SVG
+interaction behavior.
+
+## Acceptance and verification matrix
+
+Unit tests in `src/fairwayWidth.test.ts` must use small deterministic local
+coordinate fixtures (converted through the shared projection boundary or a
+documented pure planar test seam) and cover:
+
+| Case | Required assertion |
+| --- | --- |
+| Straight fairway | 220/250/280 stations produce the known perpendicular width. |
+| Dogleg | station follows route length, and exact-vertex station uses downstream tangent. |
+| Narrow fairway (legitimate) | a mapped fairway about 15 yd wide returns a truthful small numeric width, not a warning. |
+| Sub-epsilon degeneracy | a width below/equal to 0.01 m yields `unstable-degenerate-width`, no number. |
+| Split fairway | only the interval containing station is measured; a gap returns outside + split. |
+| Missing/non-polygon | typed missing warning and no overlay. |
+| Degenerate/odd/tangent/collinear | deterministic warning/failure; no fabricated width. |
+| Beyond route | typed beyond-target result. |
+
+Add a focused Playwright check only if the existing selected-hole fixture can
+exercise the panel without expanding network scope: choose 220/250/280, assert
+the visible result/warning, and assert no external request. Run `npm run check`,
+`git diff --check`, and
+`npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`.
+
+## Boundaries, security, licensing, and research
+
+Explicitly out of scope: map provider or basemap changes; Overpass runtime
+changes; production dependency additions; APIs; accounts; telemetry; cloud
+persistence; PDF production behavior; and user-data-flow expansion. The helper
+uses only existing normalized data and local arithmetic, so it introduces no
+network, credentials, persistence, third-party code, or new license surface.
+Do not copy, adapt, or incorporate AGPL-3.0 code from `ace`; do not reuse
+study-only `hacker-yardage` or `openyardage-web` code.
+
+No changeable external fact is material to this geometry-only implementation;
+therefore no external source was consulted on 2026-08-11. Existing OSM-derived
+fixture attribution and local-first guardrails remain unchanged.
+
+Rejected alternatives: a tee-to-green chord (incorrect for doglegs); width in
+SVG pixels/degree coordinates (not physical units); a fixed circular carry
+ring intersection (not perpendicular target-line width); choosing outermost
+split-fairway crossings (measures unsafe gaps); inferring missing fairways from
+rough/imagery/remote services (untruthful and out of scope); and adding a
+geometry library (unnecessary production dependency).
+
+Uncertainty: OSM fairway boundaries can be incomplete, overlapping, or
+topologically imperfect. The displayed number is limited to the local mapped
+outline at one station, and warnings deliberately take precedence over a
+plausible-looking fabricated measurement.
diff --git a/src/HoleMap.tsx b/src/HoleMap.tsx
index a6154ca..4ae22bd 100644
--- a/src/HoleMap.tsx
+++ b/src/HoleMap.tsx
@@ -8,6 +8,7 @@ import type {
 } from "./normalize";
 import type { SourceMetadata } from "./overpass";
 import { carryRings, teeOrigins } from "./carry";
+import { estimateFairwayWidth, roundHalfUpNonnegative } from "./fairwayWidth";
 import { generateProjectId, type CarryOriginV1, type HoleStateV1, type TargetV1 } from "./project";
 import {
   INNER_MAX_X,
@@ -17,6 +18,7 @@ import {
   LAYER_ORDER,
   VIEWBOX_HEIGHT,
   VIEWBOX_WIDTH,
+  YARDS_PER_METER,
   clampPoint,
   createProjection,
   distanceMeters,
@@ -73,6 +75,7 @@ export function HoleMap({ hole, warnings, source, project, onProjectChange }: Ho
   const [lastDeleted, setLastDeleted] = useState<{ target: TargetV1; index: number } | null>(null);
   const [carryErrors, setCarryErrors] = useState<Record<string, string>>({});
   const [targetErrors, setTargetErrors] = useState<Record<string, string>>({});
+  const [fairwayYards, setFairwayYards] = useState(250);
   const undoButton = useRef<HTMLButtonElement>(null);
 
   useEffect(() => {
@@ -81,6 +84,7 @@ export function HoleMap({ hole, warnings, source, project, onProjectChange }: Ho
     setMode("measure");
     setRepositionId(null);
     setLastDeleted(null);
+    setFairwayYards(250);
     setAnnouncement("Selected hole changed. Measurement cleared.");
   }, [hole.source.sourceKey]);
 
@@ -209,6 +213,22 @@ export function HoleMap({ hole, warnings, source, project, onProjectChange }: Ho
   const carryModels = project.carries.map((carry) => ({ carry, rings: carryRings(carry, hole, project.targets, projection) }));
   const clipId = `map-inner-clip-${hole.source.sourceKey.replace("/", "-")}`;
   const availableTees = teeOrigins(hole);
+  const fairwayWidth = estimateFairwayWidth(hole, fairwayYards);
+  const fairwayOverlay = fairwayWidth.start && fairwayWidth.end ? {
+    start: projectCoordinate(projection, fairwayWidth.start), end: projectCoordinate(projection, fairwayWidth.end),
+  } : null;
+  const fairwayWarningCopy: Record<string, string> = {
+    "missing-fairway": "No usable fairway polygon is mapped for this hole.",
+    "invalid-target-line": "The mapped target line is not usable for a fairway-width estimate.",
+    "carry-beyond-target-line": "This carry is beyond the mapped target line.",
+    "target-line-outside-fairway": "The target line at this carry does not fall inside a mapped fairway.",
+    "irregular-fairway-polygon": "Some mapped fairway outlines are irregular; their width was not used.",
+    "irregular-fairway-intersections": "Some mapped fairway outlines are irregular; their width was not used.",
+    "tangent-fairway-boundary": "The fairway boundary only touches or overlaps this width line; the estimate may be unavailable.",
+    "unstable-line-fairway-overlap": "The fairway boundary only touches or overlaps this width line; the estimate may be unavailable.",
+    "unstable-degenerate-width": "The mapped fairway crossing is too small to estimate reliably at this carry.",
+    "split-fairway": "Multiple fairway sections cross this line; only the section containing the target line is measured.",
+  };
 
   function changeTargetLabel(id: string, label: string): boolean {
     const trimmed = label.trim();
@@ -316,6 +336,13 @@ export function HoleMap({ hole, warnings, source, project, onProjectChange }: Ho
             ];
           }) : [])}
         </g>
+        <g data-layer="fairway-width" className="map-layer layer-fairway-width" clipPath={`url(#${clipId})`}>
+          {fairwayOverlay && <>
+            <line className="fairway-width-line" x1={fairwayOverlay.start.x} y1={fairwayOverlay.start.y} x2={fairwayOverlay.end.x} y2={fairwayOverlay.end.y} />
+            <line className="fairway-width-tick" x1={fairwayOverlay.start.x - 5} y1={fairwayOverlay.start.y - 5} x2={fairwayOverlay.start.x + 5} y2={fairwayOverlay.start.y + 5} />
+            <line className="fairway-width-tick" x1={fairwayOverlay.end.x - 5} y1={fairwayOverlay.end.y - 5} x2={fairwayOverlay.end.x + 5} y2={fairwayOverlay.end.y + 5} />
+          </>}
+        </g>
         <g data-layer="targets" className="map-layer layer-targets">
           {project.targets.map((target) => {
             const point = projectCoordinate(projection, target);
@@ -348,6 +375,20 @@ export function HoleMap({ hole, warnings, source, project, onProjectChange }: Ho
         {distanceLabel ? `Distance: ${distanceLabel}` : measurement.start ? "Select the second point." : "No measurement selected."}
       </p>
       <span className="sr-only" aria-live="polite">{announcement}</span>
+      <section className="project-panel fairway-width-panel" aria-labelledby="fairway-width-title">
+        <h4 id="fairway-width-title">Fairway width</h4>
+        <div className="map-tools" aria-label="Fairway width carry distance">
+          {[220, 250, 280].map((yards) => <button key={yards} type="button" className={fairwayYards === yards ? "" : "secondary"}
+            aria-pressed={fairwayYards === yards} onClick={() => setFairwayYards(yards)}>{yards} yd</button>)}
+        </div>
+        {typeof fairwayWidth.widthMeters === "number"
+          ? <p className="measurement-result">Fairway width at {fairwayYards} yd: {roundHalfUpNonnegative(fairwayWidth.widthMeters * YARDS_PER_METER)} yd ({roundHalfUpNonnegative(fairwayWidth.widthMeters)} m).</p>
+          : <p className="measurement-result">No fairway-width estimate at {fairwayYards} yd.</p>}
+        <div className="fairway-width-status" role="status" aria-live="polite">
+          {fairwayWidth.warnings.map((warning) => <p className="warning" key={warning}>{fairwayWarningCopy[warning]}</p>)}
+        </div>
+        <p className="hint">Outline-derived local estimate only; it does not account for hazards or playability.</p>
+      </section>
       <section className="project-panel" aria-labelledby="targets-title">
         <div className="map-heading">
           <h4 id="targets-title">Targets</h4>
diff --git a/src/fairwayWidth.test.ts b/src/fairwayWidth.test.ts
new file mode 100644
index 0000000..9435552
--- /dev/null
+++ b/src/fairwayWidth.test.ts
@@ -0,0 +1,69 @@
+import { describe, expect, it } from "vitest";
+import { estimateFairwayWidth, roundHalfUpNonnegative } from "./fairwayWidth";
+import type { Coordinate, NormalizedHole } from "./normalize";
+
+const METERS_PER_DEGREE = 6_371_000 * Math.PI / 180;
+const point = (x: number, y: number): Coordinate => ({ lat: y / METERS_PER_DEGREE, lon: x / METERS_PER_DEGREE });
+const polygon = (corners: Array<[number, number]>) => corners.map(([x, y]) => point(x, y));
+
+function hole(route: Array<[number, number]>, fairways: Array<Array<[number, number]>>): NormalizedHole {
+  return {
+    number: 1, par: 4,
+    source: { sourceKey: "way/1", type: "way", id: 1, tags: {} },
+    route: { type: "line", coordinates: route.map(([x, y]) => point(x, y)) },
+    features: fairways.map((corners, index) => ({ kind: "fairway" as const, classifiedBy: ["golf", "fairway"] as const,
+      source: { sourceKey: `way/${index + 2}` as "way/2", type: "way" as const, id: index + 2, tags: {} }, geometry: { type: "polygon" as const, coordinates: polygon(corners) } })),
+  };
+}
+
+const rectangle = (left: number, bottom: number, right: number, top: number): Array<[number, number]> =>
+  [[left, bottom], [right, bottom], [right, top], [left, top], [left, bottom]];
+
+describe("fairway width estimator", () => {
+  it("measures straight fairways at 220, 250, and 280 yards", () => {
+    const selected = hole([[0, 0], [0, 320]], [rectangle(-18, 0, 18, 320)]);
+    for (const yards of [220, 250, 280]) {
+      const result = estimateFairwayWidth(selected, yards);
+      expect(result.widthMeters).toBeCloseTo(36, 5);
+      expect(result.warnings).toEqual([]);
+    }
+  });
+
+  it("follows a dogleg and uses the downstream tangent at its vertex", () => {
+    const selected = hole([[0, 0], [0, 200], [240, 200]], [rectangle(0, 180, 240, 220)]);
+    const result = estimateFairwayWidth(selected, roundHalfUpNonnegative(200 / 0.9144));
+    expect(result.widthMeters).toBeCloseTo(40, 3);
+    expect(result.warnings).toEqual([]);
+  });
+
+  it("returns a truthful narrow result and distinguishes a sub-epsilon degeneration", () => {
+    const narrow = estimateFairwayWidth(hole([[0, 0], [0, 300]], [rectangle(-6.858, 0, 6.858, 300)]), 250);
+    expect(narrow.widthMeters).toBeCloseTo(13.716, 3);
+    expect(narrow.warnings).toEqual([]);
+    const degenerate = estimateFairwayWidth(hole([[0, 0], [0, 300]], [rectangle(-0.004, 0, 0.004, 300)]), 250);
+    expect(degenerate.widthMeters).toBeUndefined();
+    expect(degenerate.warnings).toContain("unstable-degenerate-width");
+  });
+
+  it("measures only the target-line interval in a split fairway and warns for a gap", () => {
+    const containing = estimateFairwayWidth(hole([[0, 0], [0, 300]], [rectangle(-10, 0, 10, 300), rectangle(30, 0, 50, 300)]), 250);
+    expect(containing.widthMeters).toBeCloseTo(20, 4);
+    expect(containing.warnings).toEqual(["split-fairway"]);
+    const gap = estimateFairwayWidth(hole([[0, 0], [0, 300]], [rectangle(-50, 0, -30, 300), rectangle(30, 0, 50, 300)]), 250);
+    expect(gap.widthMeters).toBeUndefined();
+    expect(gap.warnings).toEqual(expect.arrayContaining(["target-line-outside-fairway", "split-fairway"]));
+  });
+
+  it("returns typed failures for missing, beyond-route, tangent, and overlapping outlines", () => {
+    expect(estimateFairwayWidth(hole([[0, 0], [0, 300]], []), 250).warnings).toEqual(["missing-fairway"]);
+    expect(estimateFairwayWidth(hole([[0, 0], [0, 100]], [rectangle(-10, 0, 10, 100)]), 250).warnings).toEqual(["carry-beyond-target-line"]);
+    const tangent = estimateFairwayWidth(hole([[0, 0], [0, 300]], [[[0, 228.6], [10, 240], [20, 240], [0, 228.6]]]), 250);
+    expect(tangent.warnings).toContain("tangent-fairway-boundary");
+    const overlap = estimateFairwayWidth(hole([[0, 0], [0, 300]], [[[-10, 228.6], [10, 228.6], [10, 260], [-10, 260], [-10, 228.6]]]), 250);
+    expect(overlap.warnings).toContain("unstable-line-fairway-overlap");
+  });
+
+  it("rounds non-negative display values half up", () => {
+    expect([1.49, 1.5, 1.51].map(roundHalfUpNonnegative)).toEqual([1, 2, 2]);
+  });
+});
diff --git a/src/fairwayWidth.ts b/src/fairwayWidth.ts
new file mode 100644
index 0000000..b33fec3
--- /dev/null
+++ b/src/fairwayWidth.ts
@@ -0,0 +1,156 @@
+import type { Coordinate, NormalizedHole } from "./normalize";
+import {
+  YARDS_PER_METER,
+  createProjection,
+  holeCoordinates,
+  inverseProject,
+  projectCoordinate,
+  validCoordinate,
+  type Projection,
+} from "./map";
+
+export const INTERSECTION_EPSILON_M = 0.01;
+export const STATION_VERTEX_EPSILON_M = 0.001;
+
+type Point = { x: number; y: number };
+type Segment = { start: Point; end: Point; length: number };
+type Interval = { start: number; end: number };
+
+export type FairwayWidthWarning =
+  | "missing-fairway"
+  | "invalid-target-line"
+  | "carry-beyond-target-line"
+  | "target-line-outside-fairway"
+  | "irregular-fairway-polygon"
+  | "irregular-fairway-intersections"
+  | "tangent-fairway-boundary"
+  | "unstable-line-fairway-overlap"
+  | "unstable-degenerate-width"
+  | "split-fairway";
+
+export type FairwayWidthResult = {
+  yards: number;
+  warnings: FairwayWidthWarning[];
+  widthMeters?: number;
+  station?: Coordinate;
+  start?: Coordinate;
+  end?: Coordinate;
+};
+
+function localPoint(projection: Projection, coordinate: Coordinate): Point {
+  const point = projectCoordinate(projection, coordinate);
+  return { x: point.x / projection.scale, y: point.y / projection.scale };
+}
+
+function length(segment: Omit<Segment, "length">): number {
+  return Math.hypot(segment.end.x - segment.start.x, segment.end.y - segment.start.y);
+}
+
+function routeStation(hole: NormalizedHole, projection: Projection, yards: number):
+  | { station: Point; unit: Point }
+  | { warning: "invalid-target-line" | "carry-beyond-target-line" } {
+  if (!Number.isInteger(yards) || yards < 1 || !hole.route || hole.route.type !== "line") {
+    return { warning: "invalid-target-line" };
+  }
+  const points = hole.route.coordinates.filter(validCoordinate).map((coordinate) => localPoint(projection, coordinate));
+  if (points.length < 2 || points.some(({ x, y }) => !Number.isFinite(x) || !Number.isFinite(y))) return { warning: "invalid-target-line" };
+  const segments = points.slice(1).map((end, index) => {
+    const segment = { start: points[index], end };
+    return { ...segment, length: length(segment) };
+  }).filter((segment) => segment.length > INTERSECTION_EPSILON_M);
+  if (segments.length === 0) return { warning: "invalid-target-line" };
+  const requested = yards / YARDS_PER_METER;
+  const total = segments.reduce((sum, segment) => sum + segment.length, 0);
+  if (requested > total + INTERSECTION_EPSILON_M) return { warning: "carry-beyond-target-line" };
+  const distance = Math.min(requested, total);
+  let cumulative = 0;
+  for (let index = 0; index < segments.length; index += 1) {
+    const segment = segments[index];
+    const endpoint = cumulative + segment.length;
+    if (index < segments.length - 1 && Math.abs(distance - endpoint) <= STATION_VERTEX_EPSILON_M) {
+      const next = segments[index + 1];
+      return { station: next.start, unit: { x: (next.end.x - next.start.x) / next.length, y: (next.end.y - next.start.y) / next.length } };
+    }
+    if (distance <= endpoint || index === segments.length - 1) {
+      const fraction = (distance - cumulative) / segment.length;
+      return {
+        station: { x: segment.start.x + (segment.end.x - segment.start.x) * fraction, y: segment.start.y + (segment.end.y - segment.start.y) * fraction },
+        unit: { x: (segment.end.x - segment.start.x) / segment.length, y: (segment.end.y - segment.start.y) / segment.length },
+      };
+    }
+    cumulative = endpoint;
+  }
+  return { warning: "invalid-target-line" };
+}
+
+function polygonIntervals(points: Point[], station: Point, unit: Point): { intervals: Interval[]; warnings: FairwayWidthWarning[] } {
+  const warnings: FairwayWidthWarning[] = [];
+  const distinct = new Set(points.map(({ x, y }) => `${x}:${y}`));
+  if (points.length < 3 || distinct.size < 3 || points.some(({ x, y }) => !Number.isFinite(x) || !Number.isFinite(y))) {
+    return { intervals: [], warnings: ["irregular-fairway-polygon"] };
+  }
+  const ring = points[0].x === points.at(-1)!.x && points[0].y === points.at(-1)!.y ? points.slice(0, -1) : points;
+  const normal = { x: -unit.y, y: unit.x };
+  const relative = ring.map((point) => {
+    const delta = { x: point.x - station.x, y: point.y - station.y };
+    return { q: delta.x * unit.x + delta.y * unit.y, t: delta.x * normal.x + delta.y * normal.y };
+  });
+  const crossings: number[] = [];
+  let tangent = false;
+  for (let index = 0; index < relative.length; index += 1) {
+    const current = relative[index];
+    const next = relative[(index + 1) % relative.length];
+    if (Math.abs(current.q) <= INTERSECTION_EPSILON_M && Math.abs(next.q) <= INTERSECTION_EPSILON_M) {
+      return { intervals: [], warnings: ["unstable-line-fairway-overlap"] };
+    }
+    if ((current.q > INTERSECTION_EPSILON_M && next.q < -INTERSECTION_EPSILON_M)
+      || (current.q < -INTERSECTION_EPSILON_M && next.q > INTERSECTION_EPSILON_M)) {
+      const fraction = current.q / (current.q - next.q);
+      crossings.push(current.t + (next.t - current.t) * fraction);
+    }
+    if (Math.abs(current.q) <= INTERSECTION_EPSILON_M) {
+      const previous = relative[(index - 1 + relative.length) % relative.length];
+      if (Math.abs(previous.q) > INTERSECTION_EPSILON_M && Math.abs(next.q) > INTERSECTION_EPSILON_M) {
+        if (Math.sign(previous.q) !== Math.sign(next.q)) crossings.push(current.t);
+        else tangent = true;
+      }
+    }
+  }
+  const ordered = crossings.sort((a, b) => a - b);
+  if (tangent) warnings.push("tangent-fairway-boundary");
+  if (ordered.length % 2 !== 0) return { intervals: [], warnings: [...warnings, "irregular-fairway-intersections"] };
+  const intervals = Array.from({ length: ordered.length / 2 }, (_, index) => ({ start: ordered[index * 2], end: ordered[index * 2 + 1] }));
+  return { intervals, warnings };
+}
+
+function uniqueWarnings(warnings: FairwayWidthWarning[]): FairwayWidthWarning[] {
+  return [...new Set(warnings)];
+}
+
+export function roundHalfUpNonnegative(value: number): number { return Math.floor(value + 0.5); }
+
+export function estimateFairwayWidth(hole: NormalizedHole, yards: number): FairwayWidthResult {
+  const projection = createProjection(holeCoordinates(hole));
+  if ("kind" in projection) return { yards, warnings: ["invalid-target-line"] };
+  const route = routeStation(hole, projection, yards);
+  if ("warning" in route) return { yards, warnings: [route.warning] };
+  const fairways = hole.features.flatMap((feature) => feature.kind === "fairway" && feature.geometry?.type === "polygon"
+    ? [feature.geometry.coordinates] : []);
+  if (fairways.length === 0) return { yards, warnings: ["missing-fairway"] };
+  const collected = fairways.map((coordinates) => polygonIntervals(coordinates.map((coordinate) => localPoint(projection, coordinate)), route.station, route.unit));
+  const warnings = collected.flatMap((entry) => entry.warnings);
+  const intervals = collected.flatMap((entry) => entry.intervals).sort((a, b) => a.start - b.start);
+  if (intervals.length === 0) return { yards, warnings: uniqueWarnings(warnings) };
+  const union = intervals.reduce<Interval[]>((result, interval) => {
+    const current = result.at(-1);
+    if (current && interval.start - current.end <= INTERSECTION_EPSILON_M) current.end = Math.max(current.end, interval.end);
+    else result.push({ ...interval });
+    return result;
+  }, []);
+  const containing = union.find((interval) => interval.start <= INTERSECTION_EPSILON_M && interval.end >= -INTERSECTION_EPSILON_M);
+  if (!containing) return { yards, warnings: uniqueWarnings([...warnings, "target-line-outside-fairway", ...(union.length > 1 ? ["split-fairway" as const] : [])]) };
+  if (containing.end - containing.start <= INTERSECTION_EPSILON_M) return { yards, warnings: uniqueWarnings([...warnings, "unstable-degenerate-width"]) };
+  const normal = { x: -route.unit.y, y: route.unit.x };
+  const coordinate = (t: number) => inverseProject(projection, { x: (route.station.x + normal.x * t) * projection.scale, y: (route.station.y + normal.y * t) * projection.scale });
+  return { yards, warnings: uniqueWarnings([...warnings, ...(union.length > 1 ? ["split-fairway" as const] : [])]), widthMeters: containing.end - containing.start, station: coordinate(0), start: coordinate(containing.start), end: coordinate(containing.end) };
+}
diff --git a/src/styles.css b/src/styles.css
index f28a8eb..d4c299d 100644
--- a/src/styles.css
+++ b/src/styles.css
@@ -80,6 +80,9 @@ pre { background: #18221c; border-radius: 5px; color: #eef4ed; font-size: .8rem;
 .layer-tee { fill: #d9e7bd; stroke: #244e30; stroke-width: 3; }
 .layer-route { fill: none; stroke: #6d351d; stroke-dasharray: 8 5; stroke-width: 4; }
 .layer-carry-arcs { fill: none; stroke: #713b89; stroke-dasharray: 12 5 3 5; stroke-width: 3; }
+.layer-fairway-width { fill: none; stroke: #a34f16; stroke-width: 4; }
+.fairway-width-line { stroke-dasharray: 8 4; }
+.fairway-width-tick { stroke-width: 3; }
 .carry-label { fill: #3f2050; font-size: 14px; font-weight: 800; paint-order: stroke; stroke: #fffdf8; stroke-width: 4; }
 .target-hit { fill: transparent; }
 .target-outer { fill: #fffdf8; stroke: #512c68; stroke-width: 4; }
diff --git a/test/e2e/app.spec.ts b/test/e2e/app.spec.ts
index ba4c897..019bc31 100644
--- a/test/e2e/app.spec.ts
+++ b/test/e2e/app.spec.ts
@@ -322,10 +322,16 @@ test("renders and measures the selected hole with pointer, keyboard, mobile, and
   const map = page.getByTestId("hole-vector-map");
   await expect(map).toBeVisible();
   await expect(page.getByText("Course data © OpenStreetMap contributors.")).toBeVisible();
-  for (const layer of ["vegetation", "generic-water", "golf-water", "rough", "fairway", "bunker", "green", "tee", "route", "measurement"]) {
+  for (const layer of ["vegetation", "generic-water", "golf-water", "rough", "fairway", "bunker", "green", "tee", "route", "measurement", "fairway-width"]) {
     await expect(map.locator(`[data-layer="${layer}"]`)).toHaveCount(1);
   }
   await expect(map.locator('[data-layer="vegetation"] circle')).toHaveCount(0);
+  await expect(page.getByRole("heading", { name: "Fairway width" })).toBeVisible();
+  await page.getByRole("button", { name: "220 yd" }).click();
+  await expect(page.getByText(/at 220 yd/i)).toBeVisible();
+  await page.getByRole("button", { name: "280 yd" }).click();
+  await expect(page.getByText(/at 280 yd/i)).toBeVisible();
+  await expect(page.locator('.fairway-width-status[role="status"][aria-live="polite"]')).toHaveCount(1);
   expect(await map.evaluate((element) => element.getBoundingClientRect().right <= window.innerWidth)).toBe(true);
 
   await map.click({ position: { x: 60, y: 60 } });

```

Return exactly one verdict: `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`. List severity-ranked blockers and minor fixes separately. State explicitly whether CTC-009 may be marked Done after any fixes; do not approve a scope expansion.

