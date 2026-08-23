# CTC-011 Claude follow-up final-audit prompt

You previously returned `FAIL` for CTC-011 implementation commit `bb7ad46040464e0cfabbc0b798ea3393d68066b9`. Re-audit only the corrective commit `058e666b54e998102cadc83eb888e915a540334e` on branch `ctc-011-target-risk-scoring`, unless it exposes a cross-cutting concern.

Return exactly one leading verdict: `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`. Separate blockers from minor fixes and state whether CTC-011 may be marked Done.

## Required resolution

- B-1: verify `pointOnSegment` now converts the dot product to an along-edge metre distance before applying the fixed `0.01 m` endpoint tolerance.
- B-2: verify added tests cover unavailable prerequisites and fixed metre tolerance on both short and ordinary edges. Identify any remaining mandatory-matrix gap that still blocks release.
- MF-1: verify every unavailable candidate row has approved target-labelled copy.
- Confirm no dependencies, networking, persistence, provider, export/PDF, telemetry, project-schema, or safety-scope changes.

## Fresh verification

Under Node 24.15.0 / npm 11.17.0:

- `npm run check`: passed — 99 Vitest tests and 21 Playwright tests.
- `git diff --check`: passed.
- `npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`: passed; production audit 0 vulnerabilities.
- Dependency manifests unchanged.

## Exact correction diff

```diff
## ctc-011-target-risk-scoring...origin/ctc-011-target-risk-scoring
 M sbom.json
diff --git a/docs/handoffs/ctc-011-target-risk-scoring-spec.md b/docs/handoffs/ctc-011-target-risk-scoring-spec.md
index 5e4561b..67d687c 100644
--- a/docs/handoffs/ctc-011-target-risk-scoring-spec.md
+++ b/docs/handoffs/ctc-011-target-risk-scoring-spec.md
@@ -151,6 +151,7 @@ Use these exact messages:
 - invalid prerequisite: reuse the specific existing dispersion unavailable
   message, then `Mapped-risk comparison is unavailable.`
 - off map row: `{targetLabel}: mapped-risk overlap is unavailable because this dispersion guide extends outside the map view.`
+- other unavailable row: `{targetLabel}: mapped-risk overlap is unavailable.`
 - footer: `This local indicator considers only mapped golf-water geometry. It is not a shot recommendation, coaching, safety, or rules determination. Mapped geometry may be incomplete or inaccurate. Verify yardages, hazards, boundaries, and local course rules before play.`
 
 Use `role="status" aria-live="polite" aria-atomic="true"` for the single
diff --git a/src/HoleMap.tsx b/src/HoleMap.tsx
index 5d93526..7acd3f4 100644
--- a/src/HoleMap.tsx
+++ b/src/HoleMap.tsx
@@ -562,7 +562,7 @@ export function HoleMap({ hole, warnings, source, project, onProjectChange, club
                 Mapped golf-water overlap: {candidate.penalty}%. {candidate.status} mapped-risk indicator.</p>
               : candidate.warnings.includes("off-map")
                 ? <p className="warning">{candidate.targetLabel}: mapped-risk overlap is unavailable because this dispersion guide extends outside the map view.</p>
-                : <p>Mapped-risk overlap is unavailable.</p>}
+                : <p>{candidate.targetLabel}: mapped-risk overlap is unavailable.</p>}
           </li>)}
         </ul>}
         <p className="hint">This local indicator considers only mapped golf-water geometry. It is not a shot recommendation, coaching, safety, or rules determination. Mapped geometry may be incomplete or inaccurate. Verify yardages, hazards, boundaries, and local course rules before play.</p>
diff --git a/src/riskScore.test.ts b/src/riskScore.test.ts
index 5a1c806..8723be7 100644
--- a/src/riskScore.test.ts
+++ b/src/riskScore.test.ts
@@ -68,6 +68,33 @@ describe("scoreTargetRisks", () => {
     expect(result.lowestRiskTargetId).toBe(first.id);
   });
 
+  it("reports every shared unavailable prerequisite and missing mapped geometry", () => {
+    const destination = target("t-000000000001", 300, 0);
+    const targets = [target("t-000000000000", 0, 0), destination];
+    for (const [input, warning] of [
+      [{ projection: null }, "projection-unavailable"],
+      [{ club: null }, "club-unavailable"],
+      [{ origin: null }, "origin-unavailable"],
+      [{ origin: { kind: "target", targetId: "t-ffffffffffff" } }, "origin-unavailable"],
+      [{ hole: hole([]) }, "missing-risk-geometry"],
+    ] as const) {
+      const result = scoreTargetRisks({ club, origin: { kind: "target", targetId: targets[0].id }, projection, hole: hole([water(square(1000, 1000, 5))]), targets, ...input });
+      expect(result.candidates.every((candidate) => candidate.penalty === null && candidate.warnings.includes(warning))).toBe(true);
+    }
+  });
+
+  it("counts a boundary sample with a fixed metre tolerance on short and ordinary edges", () => {
+    const origin = target("t-000000000000", 0, 0);
+    const destination = target("t-000000000001", 300, 0);
+    const edgeX = 100 * .9144 + 80 * .9144 / 2;
+    const shortEdge = water([[edgeX, -.025], [edgeX, .025], [edgeX + .1, .025], [edgeX + .1, -.025], [edgeX, -.025]]);
+    const ordinaryEdge = water([[edgeX + .005, -5], [edgeX + .005, 5], [edgeX + 1, 5], [edgeX + 1, -5], [edgeX + .005, -5]]);
+    for (const feature of [shortEdge, ordinaryEdge]) {
+      const result = scoreTargetRisks({ club, origin: { kind: "target", targetId: origin.id }, projection, hole: hole([feature]), targets: [origin, destination] });
+      expect(result.candidates.find(({ targetId }) => targetId === destination.id)?.overlapSamples).toBeGreaterThan(0);
+    }
+  });
+
   it("keeps an off-map target unavailable without suppressing a scoreable target", () => {
     const origin = target("t-000000000000", 0, 0);
     const onMap = target("t-000000000001", 300, 0);
diff --git a/src/riskScore.ts b/src/riskScore.ts
index 1fad9c1..182464c 100644
--- a/src/riskScore.ts
+++ b/src/riskScore.ts
@@ -103,7 +103,8 @@ function pointOnSegment(point: MeterPoint, start: MeterPoint, end: MeterPoint):
   const cross = Math.abs((point.x - start.x) * delta.y - (point.y - start.y) * delta.x) / length;
   if (cross > RISK_EPSILON_M) return false;
   const dot = (point.x - start.x) * delta.x + (point.y - start.y) * delta.y;
-  return dot >= -RISK_EPSILON_M && dot <= length * length + RISK_EPSILON_M;
+  const along = dot / length;
+  return along >= -RISK_EPSILON_M && along <= length + RISK_EPSILON_M;
 }
 
 function containsPoint(polygon: MeterPoint[], point: MeterPoint): boolean {

```

