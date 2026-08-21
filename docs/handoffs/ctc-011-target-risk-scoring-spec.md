# CTC-011 target risk scoring spike specification

Status: Codex is the specification/research owner because Gemini is not used
for this task. Prepared 2026-08-20 from clean `origin/main`
`d8103c37ba8785098ae2835f6c7a08891ac1516e`. Runtime implementation is blocked
until the independent Claude QA-planning verdict authorizes it.

## Decision and boundaries

CTC-011 adds a deterministic, local **mapped-risk planning indicator** for the
existing dispersion guide. It compares only user-authored existing targets; it
does not create implicit targets, recommend a shot, give coaching or rules
advice, or claim an area is safe, playable, or out of bounds. The panel must
continue to say: `Mapped geometry may be incomplete or inaccurate. Verify
yardages, hazards, boundaries, and local course rules before play.`

All arithmetic is native TypeScript over CTC-010's existing tangent-plane
metres. No network request, provider/tile change, Overpass change, API key,
dependency, account, telemetry, browser persistence, PDF, import/export, raw
GIS-source export, or mutable user-data-flow change is allowed. Club profiles
remain project-wide; the existing origin/club selection and any risk display
selection remain transient `HoleMap` state.

## Exact eligible geometry

`NormalizedHole.features` is the sole source. An eligible mapped-risk area is
exactly a feature that is associated with the selected hole, has
`kind === "golf-water"`, `geometry.type === "polygon"`, and a valid single
explicitly closed exterior ring with at least three distinct projected vertices.
Its source key is retained for deterministic diagnostics. Its tag evidence is
limited by normalization to `golf=water_hazard` or
`golf=lateral_water_hazard`; the UI calls either `mapped golf-water geometry`,
not a penalty area.

Points and lines, null/invalid/degenerate polygons, relation geometry, and
unassociated features are not scored. `generic-water`, bunkers, vegetation,
rough, fairway, tees, greens, course bounds, and all other feature kinds are
excluded. In particular, the current `FeatureKind` has no out-of-bounds-like
member: although the query contract can request `golf=out_of_bounds`,
`normalize.ts` currently ignores it. CTC-011 must not infer a boundary from
that tag, generic geometry, or missing data. A later approved normalization
contract may add a separately named mapped category.

If no eligible valid polygon remains, result status is `unavailable` (not
`safe`) with `No usable mapped golf-water geometry is available for this hole.`
If at least one otherwise eligible polygon is invalid, ignore it, retain valid
ones, and add `Some mapped golf-water outlines were not usable.` If none is
valid, use the unavailable result plus that warning.

## Types and pure contract

Add `src/riskScore.ts`, importing only current local types/helpers. Export:

```ts
export const RISK_BOUNDARY_SAMPLES = 64;
export const RISK_RADIAL_RINGS = 8;
export const RISK_SAMPLE_COUNT = 512;
export const RISK_EPSILON_M = 0.01;
export type RiskStatus = "safe" | "marginal" | "unsafe" | "unavailable";
export type RiskWarning = "missing-risk-geometry" | "irregular-risk-polygon"
  | "projection-unavailable" | "origin-unavailable" | "club-unavailable"
  | "candidate-unavailable" | "degenerate-target-line" | "off-map";
export type TargetRisk = {
  targetId: string; targetLabel: string; status: RiskStatus;
  penalty: number | null; overlapSamples: number; sampleCount: number;
  warnings: RiskWarning[];
};
export type RiskComparison = {
  candidates: TargetRisk[]; lowestRiskTargetId: string | null;
  warnings: RiskWarning[];
};
```

The helper accepts the selected `NormalizedHole`, `Projection | null`, resolved
`ClubV2 | null`, `CarryOriginV1 | null`, and `TargetV1[]`, and returns a new
value without mutation. Targets are copied and sorted by bytewise ascending
ASCII `id`; labels never affect ordering. IDs must be unique already under the
project contract. A candidate that is the resolved origin target is
`unavailable` with `degenerate-target-line`; other invalid prerequisites yield
every candidate unavailable with the appropriate shared warning. The helper
must use `resolveCarryOrigin`, `projectCoordinate`, and `YARDS_PER_METER` like
`dispersionEllipse`; it must not parse SVG coordinates.

## Dispersion and overlap algorithm

For each candidate, compute CTC-010's local-metre origin-to-target unit vector
`u`, normal `n`, landing centre `C = origin + u * (club.carry / YARDS_PER_METER)`,
and radii `a = club.longitudinal / YARDS_PER_METER / 2`,
`b = club.lateral / YARDS_PER_METER / 2`. Reject a line length `<= 0.01 m`.
The visible 64-boundary-point dispersion polygon remains unchanged. Risk
sampling uses its same angular sequence `theta = 2*pi*k/64`, `k=0..63`, plus
eight homothetic rings `r=i/8`, `i=1..8`:

```text
S(i,k) = C + u * (a * r * cos(theta)) + n * (b * r * sin(theta))
```

This produces exactly 512 points. Ring 8 is byte-for-byte the conceptual
64-point visible boundary in local metres; the seven inner rings prevent a
boundary-only false negative. Each point on ring `i` has weight
`(i*i - (i-1)*(i-1)) / (8*8*64)`, the represented equal-area annulus fraction.
`overlapSamples` is the unweighted count in a risk polygon; `penalty` is
`roundHalfUpNonnegative(100 * sum(weights of overlapped samples))`, clamped to
integer 0..100. A sample in the union of any risk polygons counts once.

Project every risk ring to local metres using the candidate projection. Reject
a ring with non-finite coordinates, fewer than three distinct vertices, or
area magnitude `<= RISK_EPSILON_M * RISK_EPSILON_M`; never repair it. Point in
polygon uses ray casting with an epsilon-inclusive boundary rule: a sample is
inside when its distance to any edge is `<= 0.01 m`, otherwise use the
half-open upward-crossing test. A zero-length edge is only a boundary point;
it cannot flip parity. This keeps boundary contact conservative and
deterministic. No polygon clipping is performed.

Before polygon testing, project every ring-8 sample to SVG using the existing
scale. If any is outside the inclusive inner map rectangle, return that
candidate `unavailable`, `penalty: null`, `off-map`; do not score only the
visible fraction. Projection failure is likewise unavailable. Invalid risk
geometry never becomes zero risk.

Status bands are exact: `safe` for 0--4, `marginal` for 5--24, and `unsafe`
for 25--100. These are display bands for mapped overlap only, not safety
claims. Candidates with `penalty: null` never participate in lowest-risk
selection. The lowest result is the available candidate sorted by ascending
penalty then ascending target ID. `lowestRiskTargetId` is null when none are
available. Empty valid risk polygons still produce a 0/safe score only if at
least one eligible valid mapped golf-water polygon exists and all other
preconditions hold.

## UI, rendering, and copy

Add a `Mapped-risk indicator` panel immediately after the dispersion panel.
It reuses the selected dispersion origin and club; there is no extra persisted
configuration. It compares all existing targets and shows each target's label,
stable ID in a visually-hidden accessible qualifier, mapped-overlap percentage,
and band. The lowest eligible row says `Lowest mapped-overlap target`.

Use these exact messages:

- success: `Mapped golf-water overlap: {penalty}%. {band} mapped-risk indicator.`
- no targets: `Add a target to compare mapped-risk indicators.`
- no geometry: `No usable mapped golf-water geometry is available for this hole.`
- invalid prerequisite: reuse the specific existing dispersion unavailable
  message, then `Mapped-risk comparison is unavailable.`
- off map: `This dispersion guide extends outside the map view, so mapped-risk overlap is unavailable.`
- footer: `This local indicator considers only mapped golf-water geometry. It is not a shot recommendation, coaching, safety, or rules determination. Mapped geometry may be incomplete or inaccurate. Verify yardages, hazards, boundaries, and local course rules before play.`

Use `role="status" aria-live="polite" aria-atomic="true"` for the single
panel result region; ordinary candidate rows must not create duplicate live
announcements. The SVG does not add a new risk fill or click target in this
spike; the existing clipped dispersion layer remains after fairway width and
before targets. Controls retain keyboard operation, focus order, and 320px
responsive single-column behavior. Hole change, target deletion, club deletion,
course load, reset, reload, and import must leave no selected risk state behind.
Project v2 export/import and raw GIS source export remain structurally and
byte-for-byte unaffected.

## Required tests and synthetic fixtures

Add adjacent `src/riskScore.test.ts` using local synthetic normalized holes or
small deterministic coordinates only; add a new synthetic fixture only when it
is necessary to exercise normalization of associated `golf-water` polygons.
Do not modify live data or add brands. Cover:

| Case | Required proof |
| --- | --- |
| Safe | A valid mapped golf-water polygon away from all 512 samples returns 0 and `safe`, not a guarantee. |
| Marginal / unsafe | Fixed polygons produce locked integer penalties in 5--24 and 25--100; include an interior-only hit that boundary-only sampling would miss. |
| Boundary | A sample on a polygon edge counts; repeated and zero-length edges stay deterministic. |
| Candidate / tie | Targets are ID-sorted; same penalty selects lexical-lowest ID regardless of input order/labels. |
| Missing / incomplete | No eligible geometry is unavailable; generic water, bunker, vegetation, point/line, unassociated and invalid geometry never count. |
| OOB model | An ignored `golf=out_of_bounds` raw element cannot become a score category until normalization changes. |
| Failures | Missing projection/origin/club, selected-origin target, short line, off-map ellipse, near-pole projection, invalid polygon, and no target yield typed unavailable results. |
| Isolation | Existing unit/project tests prove no schema/export mutation; focused browser test proves panel behavior, axe, mobile layout, reload reset, and no request after detail load. |

Run Node 24 `npm run check`, `git diff --check`, and
`npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh`.

## Research, rejected alternatives, and uncertainty

No golf-rules term or mutable external factual claim is used; no external
source was required or consulted on 2026-08-20. `docs/overpass-query-contract.md`
and `docs/legal-disclaimers.md` were reviewed. This is deliberately limited to
the normalized model and its existing OSM-data warning posture.

Rejected: live hazard/routing/rules providers; generic water or bunkers as
penalty/out-of-bounds evidence; inferred official boundaries; generated target
locations; opaque/ML optimisation; boundary-only overlap; SVG-pixel or
geodesic competing geometry; clipping an off-map ellipse into a misleading
score; persistence of risk selection; additions to exports/PDFs; dependencies;
and AGPL/study-only code reuse. Remaining uncertainty is inherent mapped-data
coverage and simplified equal-area sampling; the unavailable states and exact
disclosure prevent presenting either as a course or playing truth.
