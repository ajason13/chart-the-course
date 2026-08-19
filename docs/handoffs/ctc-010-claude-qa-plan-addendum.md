# CTC-010 QA-plan correction addendum

Status: Accepted response to Claude QA-planning `BLOCKED` verdict, 2026-08-15.

## B-1: verifiable baseline and sequencing

The initial handoff was invalid for independent verification because its commits
existed only locally. CTC-010 is rebased onto the completed CTC-009 branch at
`b29893f` (`Close CTC-009 after Claude audit`), not stale `main` at `6a3a3ac`.
That branch adds the fairway-width layer to `HoleMap.tsx`; CTC-010 therefore
uses the same integrated map surface and avoids a deferred insertion conflict.
The corrected branch and every cited commit must be pushed before re-review.

## B-2: canonical planar landing and ellipse formula

CTC-010 deliberately does **not** use `carryCoordinates()`' geodesic ring
algorithm. It uses the local tangent-plane representation already used by
CTC-009's `routeStation()` so the landing centre and ellipse are internally
consistent with the rendered map.

Given projected SVG points `o = projectCoordinate(projection, origin)` and
`t = projectCoordinate(projection, target)`, use local-metre vectors
`O = o / projection.scale` and `T = t / projection.scale`. Let
`d = T - O`, `length = hypot(d.x, d.y)`, and reject `length <= 0.01 m` as a
deterministic `degenerate-target-line` outcome. Let `u = d / length`,
`n = (-u.y, u.x)`, and `carryM = carryYards / YARDS_PER_METER`. The landing
centre in local metres is `C = O + carryM * u`, converted to SVG by multiplying
by `projection.scale`. For a parameter `θ` in `[0, 2π)`, with longitudinal and
lateral full widths `L` and `W` in yards, the boundary point is:

`C + u * (L / YARDS_PER_METER / 2 * cos θ) + n * (W / YARDS_PER_METER / 2 * sin θ)`.

The whole boundary-point expression above is in local metres. Multiply that
complete expression by `projection.scale` exactly once to produce SVG
coordinates; do not treat the SVG-converted centre as `C` while leaving the
two radius offsets unscaled.

This intentionally differs slightly from an existing geodesic carry ring at
long distances. The UI must describe both as local planning estimates, without
claiming they coincide exactly.

## B-3: project-wide state plumbing

`App.tsx` owns `clubProfile` separately from `projectHoles`, resets it with a
newly loaded course, writes it to/reads it from `ProjectV2`, and passes
`clubProfile` plus `onClubProfileChange` to `HoleMap`. `HoleMap` keeps only
selected origin, target ID, and club ID as transient component state. It must
never add profile data to `HoleStateV1` or duplicate it per hole.

## RC-1 and RC-2: layer and off-map behavior

Render `<g data-layer="dispersion" ... clipPath={\`url(#${clipId})\`}>` directly
after `carry-arcs`/`fairway-width` and before `targets`, reusing the existing
inner-rectangle clip path. For the independent warning, sample exactly 64
boundary points using the formula above at `θ = index / 64 * 2π`; set `offMap`
when any un-clipped SVG point is outside `INNER_MIN_X..INNER_MAX_X` or
`INNER_MIN_Y..INNER_MAX_Y`. The fixed count is part of the test contract.

## RC-3 through RC-7: profile and UI contract

- Extend `generateProjectId` with `"club"`, returning `p-` plus twelve lower-
  case hexadecimal characters. Club IDs share the global project ID set with
  target/carry IDs; duplicates are rejected across profile and every hole.
- Club-label uniqueness is required after `trim()` and Unicode NFC
  normalization, using locale-independent Unicode lowercase comparison. Add
  `DUPLICATE_LABEL` to `ValidationErrorCode`; retain the original trimmed NFC
  display label. No other label type gains this new uniqueness rule.
- Reuse `Errors.shape()` and its existing `DANGEROUS_KEY` mechanism for every
  profile and club object. Do not duplicate the dangerous-key policy.
- Reuse `CarryOriginV1`, `resolveCarryOrigin()`, `teeOrigins()`, and the
  established tee/target select encoding for the transient origin selection.
- New clubs default to `Club N`, carry `150`, longitudinal width `30`, and
  lateral width `20`, selecting the newly added club. The ellipse stroke uses a
  dash distinct from carry arcs (`12 5 3 5`), e.g. `6 3 1 3`.
- Invalid edit handlers return `false`, preserve the last valid profile exactly,
  restore the input's valid value on blur, set a local inline error, and announce
  it through the existing live region. Test serialized profile equality before
  and after every rejected edit.
- Include a visible hint: “Local dispersion guide only; it is not a shot
  recommendation or confidence estimate.”

## Claude re-review disposition

Claude returned `READY WITH REQUIRED CORRECTIONS` on 2026-08-18. RC-8 is the
documentation clarification immediately above; Claude explicitly authorized
implementation after that correction and did not require a further planning
review. Club profile state resets on course load, matching the existing
single-course target/carry project model; the UI must say unsaved profile data
is cleared when a different course is loaded.

## Re-review acceptance matrix

The re-review must require the full prior matrix plus: exact planar formula;
64-sample rotated off-map detection; integration after CTC-009 fairway-width;
project-wide App-to-HoleMap prop flow; profile ID collision; NFC/case-folded
label collision; selected defaults/dash/hint; and rejected-edit byte-stability.
No runtime implementation is authorized until Claude returns
`READY FOR IMPLEMENTATION`.
