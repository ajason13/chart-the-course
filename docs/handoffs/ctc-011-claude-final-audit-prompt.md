# CTC-011 Claude final-audit prompt

You are the independent final auditor for CTC-011. Audit implementation commit `bb7ad46040464e0cfabbc0b798ea3393d68066b9` on branch `ctc-011-target-risk-scoring`, against planning checkpoint `b61c67075ab25797061a6f2d1957efe6b26df366`.

Return exactly one leading verdict: `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`. List blockers before minor findings and state whether CTC-011 may be marked Done.

## Acceptance and safety contract

- Use only associated, polygonal normalized `golf-water` geometry; do not infer penalty areas, official boundaries, generic water, bunkers, vegetation, fairway bounds, or unnormalized `golf=out_of_bounds`.
- Compare existing targets deterministically; use weighted 8 × 64 local-metre samples aligned with CTC-010's ellipse. Lowest overlap resolves by penalty then target ID.
- This is a mapped-risk planning indicator only, never a recommendation, coaching, safety guarantee, playable-area assertion, or rules determination. Missing/invalid/off-map data must be unavailable, not safe.
- Preserve no-network, no-provider, no dependency, no persistence, no PDF/export, no account/telemetry, and project-format boundaries.
- Verify state isolation, accessible live messaging, responsive UI, SVG layer order, reload/import/export/raw-source isolation, and synthetic-only tests.

## Verification evidence

Under Node 24.15.0 / npm 11.17.0:

- `npm run check`: passed — scaffold policy, build, 97 Vitest tests, 21 Playwright tests.
- `git diff --check`: passed.
- `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`: passed; production audit reported 0 vulnerabilities.
- `package.json` and `package-lock.json` are unchanged.

No external source is material to this local geometry implementation. The CTC-011 planning audit was independently approved after its required corrections.

## Exact relevant implementation diff

```diff
diff --git a/CONTEXT.md b/CONTEXT.md
index af1905c..a2eb487 100644
--- a/CONTEXT.md
+++ b/CONTEXT.md
@@ -32,6 +32,20 @@ runtime implementation once this corrected checkpoint is pushed; no further
 planning re-audit is needed because the selected per-target off-map path is its
 authorized option.
 
+CTC-011 implementation ready for final audit - 2026-08-21. The approved
+local-only implementation adds `src/riskScore.ts`, a transient `Mapped-risk
+indicator` panel, and deterministic unit/browser coverage. It samples the
+existing 64-point dispersion boundary plus seven weighted interior rings,
+scores only associated polygonal `golf-water`, and makes generic water,
+unmapped out-of-bounds tags, missing data, and off-map candidate geometry
+unavailable rather than safe. Existing targets are ID-sorted with a
+penalty-then-ID lowest-overlap tie-break; all controls and exports remain
+unchanged. Node 24 verification passed: `npm run check` (97 Vitest, 21
+Playwright), `git diff --check`, and compliance (production audit: 0
+vulnerabilities). Prepare the required self-contained Claude final-audit
+prompt, move Notion to `4. Final Audit (Claude)`, and do not mark Done until
+Claude authorizes it.
+
 CTC-009 Claude QA checkpoint pending - 2026-08-11. Clean synchronized `main` at
 `6a3a3ac75a495f69086bbc794c53914dbbe82001` was inspected along with the live
 Notion task. Codex is the specification/research owner under the current
diff --git a/src/HoleMap.tsx b/src/HoleMap.tsx
index 56a5f61..5d93526 100644
--- a/src/HoleMap.tsx
+++ b/src/HoleMap.tsx
@@ -10,6 +10,7 @@ import type { SourceMetadata } from "./overpass";
 import { carryRings, teeOrigins } from "./carry";
 import { dispersionEllipse } from "./dispersion";
 import { estimateFairwayWidth, roundHalfUpNonnegative } from "./fairwayWidth";
+import { scoreTargetRisks } from "./riskScore";
 import { generateProjectId, type CarryOriginV1, type ClubProfileV2, type ClubV2, type HoleStateV1, type TargetV1 } from "./project";
 import {
   INNER_MAX_X,
@@ -254,6 +255,13 @@ export function HoleMap({ hole, warnings, source, project, onProjectChange, club
     "club-unavailable": "Add or select a club for the dispersion guide.",
     "degenerate-target-line": "Dispersion unavailable because the origin and target are too close together.",
   };
+  const riskComparison = scoreTargetRisks({
+    club: selectedClub,
+    origin: dispersionOrigin,
+    hole,
+    projection,
+    targets: project.targets,
+  });
   const fairwayWidth = estimateFairwayWidth(hole, fairwayYards);
   const fairwayOverlay = fairwayWidth.start && fairwayWidth.end ? {
     start: projectCoordinate(projection, fairwayWidth.start), end: projectCoordinate(projection, fairwayWidth.end),
@@ -531,6 +539,34 @@ export function HoleMap({ hole, warnings, source, project, onProjectChange, club
               : <p>{selectedClub!.label} dispersion guide shown.</p>}
         </div>
       </section>
+      <section className="project-panel risk-panel" aria-labelledby="risk-title">
+        <h4 id="risk-title">Mapped-risk indicator</h4>
+        <p className="hint">This comparison uses the selected dispersion origin and club.</p>
+        <div className="risk-status" role="status" aria-live="polite" aria-atomic="true">
+          {riskComparison.candidates.length === 0
+            ? <p>Add a target to compare mapped-risk indicators.</p>
+            : riskComparison.warnings.includes("missing-risk-geometry")
+              ? <p className="warning">No usable mapped golf-water geometry is available for this hole.</p>
+              : riskComparison.warnings.some((warning) => ["projection-unavailable", "origin-unavailable", "club-unavailable"].includes(warning))
+                ? <p>{"kind" in dispersion ? `${dispersionStatus[dispersion.kind]} Mapped-risk comparison is unavailable.` : "Mapped-risk comparison is unavailable."}</p>
+                : <p>{riskComparison.lowestRiskTargetId === null
+                  ? "Mapped-risk comparison is unavailable."
+                  : "Mapped-risk comparison shown."}</p>}
+          {riskComparison.warnings.includes("irregular-risk-polygon") && <p className="warning">Some mapped golf-water outlines were not usable.</p>}
+        </div>
+        {riskComparison.candidates.length > 0 && <ul className="risk-list">
+          {riskComparison.candidates.map((candidate) => <li key={candidate.targetId}>
+            <strong>{candidate.targetLabel}<span className="sr-only">, target {candidate.targetId}</span></strong>
+            {candidate.penalty !== null
+              ? <p>{candidate.targetId === riskComparison.lowestRiskTargetId && <strong>Lowest mapped-overlap target. </strong>}
+                Mapped golf-water overlap: {candidate.penalty}%. {candidate.status} mapped-risk indicator.</p>
+              : candidate.warnings.includes("off-map")
+                ? <p className="warning">{candidate.targetLabel}: mapped-risk overlap is unavailable because this dispersion guide extends outside the map view.</p>
+                : <p>Mapped-risk overlap is unavailable.</p>}
+          </li>)}
+        </ul>}
+        <p className="hint">This local indicator considers only mapped golf-water geometry. It is not a shot recommendation, coaching, safety, or rules determination. Mapped geometry may be incomplete or inaccurate. Verify yardages, hazards, boundaries, and local course rules before play.</p>
+      </section>
       <section className="project-panel" aria-labelledby="targets-title">
         <div className="map-heading">
           <h4 id="targets-title">Targets</h4>
diff --git a/src/riskScore.test.ts b/src/riskScore.test.ts
new file mode 100644
index 0000000..5a1c806
--- /dev/null
+++ b/src/riskScore.test.ts
@@ -0,0 +1,91 @@
+import { describe, expect, it } from "vitest";
+import { EARTH_RADIUS_M, type Projection } from "./map";
+import type { Coordinate, NormalizedFeature, NormalizedHole } from "./normalize";
+import type { ClubV2, TargetV1 } from "./project";
+import { RISK_SAMPLE_COUNT, scoreTargetRisks } from "./riskScore";
+
+const projection: Projection = {
+  center: { lat: 0, lon: 0 }, cosLat: 1, scale: 1,
+  minX: 0, minY: 0, offsetX: 400, offsetY: 300,
+};
+const club: ClubV2 = { id: "p-000000000001", label: "Test club", carry: 100, longitudinal: 80, lateral: 80 };
+
+function coordinate(x: number, y: number): Coordinate {
+  return { lat: -y / EARTH_RADIUS_M * 180 / Math.PI, lon: x / EARTH_RADIUS_M * 180 / Math.PI };
+}
+function target(id: string, x: number, y: number): TargetV1 {
+  return { id, label: id, ...coordinate(x, y) };
+}
+function water(points: Array<[number, number]>, kind: NormalizedFeature["kind"] = "golf-water"): NormalizedFeature {
+  const coordinates = points.map(([x, y]) => coordinate(x, y));
+  return {
+    kind, classifiedBy: kind === "golf-water" ? ["golf", "water_hazard"] : ["natural", "water"],
+    source: { sourceKey: "way/7", type: "way", id: 7, tags: {} },
+    geometry: { type: "polygon", coordinates },
+  };
+}
+function hole(features: NormalizedFeature[]): NormalizedHole {
+  return {
+    number: 1, par: 4, source: { sourceKey: "way/1", type: "way", id: 1, tags: {} },
+    route: { type: "line", coordinates: [coordinate(0, 0), coordinate(300, 0)] }, features,
+  };
+}
+function square(x: number, y: number, radius: number): Array<[number, number]> {
+  return [[x - radius, y - radius], [x + radius, y - radius], [x + radius, y + radius], [x - radius, y + radius], [x - radius, y - radius]];
+}
+
+describe("scoreTargetRisks", () => {
+  it("returns the specified empty comparison before evaluating prerequisites", () => {
+    expect(scoreTargetRisks({ club: null, origin: null, hole: hole([]), projection: null, targets: [] }))
+      .toEqual({ candidates: [], lowestRiskTargetId: null, warnings: [] });
+  });
+
+  it("scores safe and unsafe mapped golf-water cases without treating generic water as risk", () => {
+    const destination = target("t-000000000001", 300, 0);
+    const landingX = 100 * 0.9144;
+    const safe = scoreTargetRisks({
+      club, origin: { kind: "target", targetId: "t-000000000000" }, projection,
+      hole: hole([water(square(landingX, 150, 5)), water(square(landingX, 0, 100), "generic-water")]),
+      targets: [target("t-000000000000", 0, 0), destination],
+    });
+    expect(safe.candidates.find(({ targetId }) => targetId === destination.id)).toMatchObject({ penalty: 0, status: "safe", sampleCount: RISK_SAMPLE_COUNT });
+
+    const unsafe = scoreTargetRisks({
+      club, origin: { kind: "target", targetId: "t-000000000000" }, projection,
+      hole: hole([water(square(landingX, 0, 100))]),
+      targets: [target("t-000000000000", 0, 0), destination],
+    });
+    expect(unsafe.candidates.find(({ targetId }) => targetId === destination.id)).toMatchObject({ penalty: 100, status: "unsafe" });
+  });
+
+  it("uses target ID order for deterministic ties", () => {
+    const origin = target("t-000000000000", 0, 0);
+    const first = target("t-000000000001", 300, 0);
+    const second = target("t-000000000002", 300, 50);
+    const result = scoreTargetRisks({ club, origin: { kind: "target", targetId: origin.id }, projection,
+      hole: hole([water(square(1000, 1000, 5))]), targets: [second, first, origin] });
+    expect(result.candidates.map(({ targetId }) => targetId)).toEqual([origin.id, first.id, second.id]);
+    expect(result.lowestRiskTargetId).toBe(first.id);
+  });
+
+  it("keeps an off-map target unavailable without suppressing a scoreable target", () => {
+    const origin = target("t-000000000000", 0, 0);
+    const onMap = target("t-000000000001", 300, 0);
+    const offMap = target("t-000000000002", 0, 300);
+    const result = scoreTargetRisks({ ...{ club: { ...club, carry: 300 }, origin: { kind: "target" as const, targetId: origin.id }, projection },
+      hole: hole([water(square(674.32, 300, 100)), water(square(400, 574.32, 100))]), targets: [origin, onMap, offMap] });
+    expect(result.candidates.find(({ targetId }) => targetId === onMap.id)?.penalty).not.toBeNull();
+    expect(result.candidates.find(({ targetId }) => targetId === offMap.id)).toMatchObject({ penalty: null, warnings: ["off-map"] });
+  });
+
+  it("documents the disclosed fixed-grid radial and angular sampling limit", () => {
+    const origin = target("t-000000000000", 0, 0);
+    const destination = target("t-000000000001", 300, 0);
+    const landingX = 100 * 0.9144;
+    const longitudinalRadius = 80 * 0.9144 / 2;
+    // This thin polygon overlaps the ellipse between r=0.5 and r=0.625, but no fixed sample hits it.
+    const gap = water([[landingX + longitudinalRadius * .56 - .05, -.05], [landingX + longitudinalRadius * .56 + .05, -.05], [landingX + longitudinalRadius * .56 + .05, .05], [landingX + longitudinalRadius * .56 - .05, .05], [landingX + longitudinalRadius * .56 - .05, -.05]]);
+    const result = scoreTargetRisks({ club, origin: { kind: "target", targetId: origin.id }, projection, hole: hole([gap]), targets: [origin, destination] });
+    expect(result.candidates.find(({ targetId }) => targetId === destination.id)).toMatchObject({ penalty: 0, status: "safe" });
+  });
+});
diff --git a/src/riskScore.ts b/src/riskScore.ts
new file mode 100644
index 0000000..1fad9c1
--- /dev/null
+++ b/src/riskScore.ts
@@ -0,0 +1,212 @@
+import { resolveCarryOrigin } from "./carry";
+import { roundHalfUpNonnegative } from "./fairwayWidth";
+import {
+  INNER_MAX_X,
+  INNER_MAX_Y,
+  INNER_MIN_X,
+  INNER_MIN_Y,
+  YARDS_PER_METER,
+  projectCoordinate,
+  validCoordinate,
+  type Projection,
+  type ViewportPoint,
+} from "./map";
+import type { NormalizedHole } from "./normalize";
+import type { CarryOriginV1, ClubV2, TargetV1 } from "./project";
+
+export const RISK_BOUNDARY_SAMPLES = 64;
+export const RISK_RADIAL_RINGS = 8;
+export const RISK_SAMPLE_COUNT = RISK_BOUNDARY_SAMPLES * RISK_RADIAL_RINGS;
+export const RISK_EPSILON_M = 0.01;
+
+export type RiskStatus = "safe" | "marginal" | "unsafe" | "unavailable";
+export type RiskWarning = "missing-risk-geometry" | "irregular-risk-polygon"
+  | "projection-unavailable" | "origin-unavailable" | "club-unavailable"
+  | "degenerate-target-line" | "off-map";
+export type TargetRisk = {
+  targetId: string;
+  targetLabel: string;
+  status: RiskStatus;
+  penalty: number | null;
+  overlapSamples: number;
+  sampleCount: number;
+  warnings: RiskWarning[];
+};
+export type RiskComparison = {
+  candidates: TargetRisk[];
+  lowestRiskTargetId: string | null;
+  warnings: RiskWarning[];
+};
+
+export type RiskScoreInput = {
+  club: ClubV2 | null | undefined;
+  origin: CarryOriginV1 | null | undefined;
+  hole: NormalizedHole;
+  projection: Projection | null | undefined;
+  targets: TargetV1[];
+};
+
+type MeterPoint = ViewportPoint;
+
+function compareText(left: string, right: string): number {
+  return left < right ? -1 : left > right ? 1 : 0;
+}
+
+function meterPoint(projection: Projection, coordinate: TargetV1 | { lat: number; lon: number }): MeterPoint {
+  const point = projectCoordinate(projection, coordinate);
+  return { x: point.x / projection.scale, y: point.y / projection.scale };
+}
+
+function samePoint(left: MeterPoint, right: MeterPoint): boolean {
+  return Math.hypot(left.x - right.x, left.y - right.y) <= RISK_EPSILON_M;
+}
+
+function polygonArea(points: MeterPoint[]): number {
+  return points.reduce((area, point, index) => {
+    const next = points[(index + 1) % points.length];
+    return area + point.x * next.y - point.y * next.x;
+  }, 0) / 2;
+}
+
+function usableRiskPolygons(hole: NormalizedHole, projection: Projection): {
+  polygons: MeterPoint[][];
+  warnings: RiskWarning[];
+} {
+  const polygons: MeterPoint[][] = [];
+  let irregular = false;
+  for (const feature of hole.features) {
+    if (feature.kind !== "golf-water" || feature.geometry?.type !== "polygon") continue;
+    const coordinates = feature.geometry.coordinates;
+    if (coordinates.length < 4 || !validCoordinate(coordinates[0])
+      || !validCoordinate(coordinates[coordinates.length - 1])
+      || coordinates[0].lat !== coordinates[coordinates.length - 1].lat
+      || coordinates[0].lon !== coordinates[coordinates.length - 1].lon) {
+      irregular = true;
+      continue;
+    }
+    const ring = coordinates.slice(0, -1).map((coordinate) => meterPoint(projection, coordinate));
+    if (!ring.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y))
+      || ring.filter((point, index) => ring.slice(0, index).every((other) => !samePoint(point, other))).length < 3
+      || Math.abs(polygonArea(ring)) <= RISK_EPSILON_M * RISK_EPSILON_M) {
+      irregular = true;
+      continue;
+    }
+    polygons.push(ring);
+  }
+  return { polygons, warnings: irregular ? ["irregular-risk-polygon"] : [] };
+}
+
+function pointOnSegment(point: MeterPoint, start: MeterPoint, end: MeterPoint): boolean {
+  const delta = { x: end.x - start.x, y: end.y - start.y };
+  const length = Math.hypot(delta.x, delta.y);
+  if (length <= RISK_EPSILON_M) return samePoint(point, start);
+  const cross = Math.abs((point.x - start.x) * delta.y - (point.y - start.y) * delta.x) / length;
+  if (cross > RISK_EPSILON_M) return false;
+  const dot = (point.x - start.x) * delta.x + (point.y - start.y) * delta.y;
+  return dot >= -RISK_EPSILON_M && dot <= length * length + RISK_EPSILON_M;
+}
+
+function containsPoint(polygon: MeterPoint[], point: MeterPoint): boolean {
+  let inside = false;
+  for (let index = 0; index < polygon.length; index += 1) {
+    const start = polygon[index];
+    const end = polygon[(index + 1) % polygon.length];
+    if (pointOnSegment(point, start, end)) return true;
+    if ((start.y > point.y) !== (end.y > point.y)) {
+      const crossingX = (end.x - start.x) * (point.y - start.y) / (end.y - start.y) + start.x;
+      if (point.x < crossingX) inside = !inside;
+    }
+  }
+  return inside;
+}
+
+function unavailable(target: TargetV1, warnings: RiskWarning[]): TargetRisk {
+  return {
+    targetId: target.id, targetLabel: target.label, status: "unavailable",
+    penalty: null, overlapSamples: 0, sampleCount: 0, warnings,
+  };
+}
+
+function statusFor(penalty: number): RiskStatus {
+  return penalty <= 4 ? "safe" : penalty <= 24 ? "marginal" : "unsafe";
+}
+
+export function scoreTargetRisks(input: RiskScoreInput): RiskComparison {
+  const targets = [...input.targets].sort((left, right) => compareText(left.id, right.id));
+  if (targets.length === 0) return { candidates: [], lowestRiskTargetId: null, warnings: [] };
+  if (!input.projection) {
+    const warnings: RiskWarning[] = ["projection-unavailable"];
+    return { candidates: targets.map((target) => unavailable(target, warnings)), lowestRiskTargetId: null, warnings };
+  }
+  if (!input.club) {
+    const warnings: RiskWarning[] = ["club-unavailable"];
+    return { candidates: targets.map((target) => unavailable(target, warnings)), lowestRiskTargetId: null, warnings };
+  }
+  if (!input.origin) {
+    const warnings: RiskWarning[] = ["origin-unavailable"];
+    return { candidates: targets.map((target) => unavailable(target, warnings)), lowestRiskTargetId: null, warnings };
+  }
+  const origin = resolveCarryOrigin(input.origin, input.hole, input.targets);
+  if ("kind" in origin) {
+    const warnings: RiskWarning[] = ["origin-unavailable"];
+    return { candidates: targets.map((target) => unavailable(target, warnings)), lowestRiskTargetId: null, warnings };
+  }
+  const risks = usableRiskPolygons(input.hole, input.projection);
+  if (risks.polygons.length === 0) {
+    const warnings: RiskWarning[] = [...risks.warnings, "missing-risk-geometry"];
+    return { candidates: targets.map((target) => unavailable(target, warnings)), lowestRiskTargetId: null, warnings };
+  }
+
+  const originMeters = meterPoint(input.projection, origin);
+  const candidates = targets.map((target) => {
+    if (!validCoordinate(target)) return unavailable(target, ["degenerate-target-line"]);
+    const targetMeters = meterPoint(input.projection!, target);
+    const delta = { x: targetMeters.x - originMeters.x, y: targetMeters.y - originMeters.y };
+    const length = Math.hypot(delta.x, delta.y);
+    if (!Number.isFinite(length) || length <= RISK_EPSILON_M) return unavailable(target, ["degenerate-target-line"]);
+    const unit = { x: delta.x / length, y: delta.y / length };
+    const normal = { x: -unit.y, y: unit.x };
+    const center = {
+      x: originMeters.x + unit.x * input.club!.carry / YARDS_PER_METER,
+      y: originMeters.y + unit.y * input.club!.carry / YARDS_PER_METER,
+    };
+    const longitudinal = input.club!.longitudinal / YARDS_PER_METER / 2;
+    const lateral = input.club!.lateral / YARDS_PER_METER / 2;
+    let overlapSamples = 0;
+    let weightedOverlap = 0;
+    let offMap = false;
+    for (let ring = 1; ring <= RISK_RADIAL_RINGS; ring += 1) {
+      const radius = ring / RISK_RADIAL_RINGS;
+      const weight = (ring * ring - (ring - 1) * (ring - 1))
+        / (RISK_RADIAL_RINGS * RISK_RADIAL_RINGS * RISK_BOUNDARY_SAMPLES);
+      for (let index = 0; index < RISK_BOUNDARY_SAMPLES; index += 1) {
+        const theta = index / RISK_BOUNDARY_SAMPLES * 2 * Math.PI;
+        const point = {
+          x: center.x + unit.x * longitudinal * radius * Math.cos(theta) + normal.x * lateral * radius * Math.sin(theta),
+          y: center.y + unit.y * longitudinal * radius * Math.cos(theta) + normal.y * lateral * radius * Math.sin(theta),
+        };
+        if (ring === RISK_RADIAL_RINGS) {
+          const svg = { x: point.x * input.projection!.scale, y: point.y * input.projection!.scale };
+          if (svg.x < INNER_MIN_X || svg.x > INNER_MAX_X || svg.y < INNER_MIN_Y || svg.y > INNER_MAX_Y) offMap = true;
+        }
+        if (risks.polygons.some((polygon) => containsPoint(polygon, point))) {
+          overlapSamples += 1;
+          weightedOverlap += weight;
+        }
+      }
+    }
+    if (offMap) return unavailable(target, ["off-map"]);
+    const penalty = Math.max(0, Math.min(100, roundHalfUpNonnegative(100 * weightedOverlap)));
+    return {
+      targetId: target.id, targetLabel: target.label, status: statusFor(penalty), penalty,
+      overlapSamples, sampleCount: RISK_SAMPLE_COUNT, warnings: [...risks.warnings],
+    };
+  });
+  const available = candidates.filter((candidate) => candidate.penalty !== null)
+    .sort((left, right) => left.penalty! - right.penalty! || compareText(left.targetId, right.targetId));
+  return {
+    candidates,
+    lowestRiskTargetId: available[0]?.targetId ?? null,
+    warnings: risks.warnings,
+  };
+}
diff --git a/src/styles.css b/src/styles.css
index 936bed9..44eea57 100644
--- a/src/styles.css
+++ b/src/styles.css
@@ -103,8 +103,9 @@ pre { background: #18221c; border-radius: 5px; color: #eef4ed; font-size: .8rem;
 .project-panel, .project-io, .source-export { background: #f5f7f1; border: 1px solid #cbd5c5; border-radius: 6px; display: grid; gap: .75rem; padding: 1rem; }
 .source-export { background: #fffdf8; border-color: #d3c48d; }
 .project-panel h4, .project-io h3, .source-export h3, .project-errors h4, .project-panel p { margin: 0; }
-.target-list, .carry-list, .club-list { display: grid; gap: .75rem; list-style: none; margin: 0; padding: 0; }
-.target-list li, .carry-list li, .club-list li { background: #fffdf8; border: 1px solid #dbe2d7; border-radius: 5px; display: grid; gap: .75rem; padding: .75rem; }
+.target-list, .carry-list, .club-list, .risk-list { display: grid; gap: .75rem; list-style: none; margin: 0; padding: 0; }
+.target-list li, .carry-list li, .club-list li, .risk-list li { background: #fffdf8; border: 1px solid #dbe2d7; border-radius: 5px; display: grid; gap: .75rem; padding: .75rem; }
+.risk-list p { margin: 0; }
 .dispersion-controls { display: grid; gap: .75rem; grid-template-columns: repeat(3, minmax(0, 1fr)); }
 .danger { border-color: #8b3028; color: #8b3028; }
 .file-label { align-content: center; border: 1px solid #2f6241; border-radius: 6px; color: #2f6241; cursor: pointer; min-height: 44px; padding: .7rem 1rem; }
diff --git a/test/e2e/app.spec.ts b/test/e2e/app.spec.ts
index fec0f97..ebf9c83 100644
--- a/test/e2e/app.spec.ts
+++ b/test/e2e/app.spec.ts
@@ -389,6 +389,8 @@ test("manages targets, carry arcs, and strict local project exchange", async ({
   await page.getByRole("button", { name: "Add club" }).click();
   await expect(page.getByLabel("Club name")).toHaveValue("Club 1");
   await expect(map.locator('[data-layer="dispersion"] .dispersion-ellipse')).toHaveCount(1);
+  await expect(page.getByRole("heading", { name: "Mapped-risk indicator" })).toBeVisible();
+  await expect(page.locator('.risk-status[role="status"][aria-live="polite"]')).toHaveCount(1);
   const layers = await map.locator("[data-layer]").evaluateAll((elements) => elements.map((element) => element.getAttribute("data-layer")));
   expect(layers.indexOf("dispersion")).toBeGreaterThan(layers.indexOf("fairway-width"));
   expect(layers.indexOf("dispersion")).toBeLessThan(layers.indexOf("targets"));

```

Adversarially inspect the projection/scale conversion, annular weighting, polygon boundary containment, every unavailable path, candidate tie order, generic-water/OOB exclusion, off-map isolation, accessibility copy, and absence of scope creep.

