import { resolveCarryOrigin } from "./carry";
import { roundHalfUpNonnegative } from "./fairwayWidth";
import {
  INNER_MAX_X,
  INNER_MAX_Y,
  INNER_MIN_X,
  INNER_MIN_Y,
  YARDS_PER_METER,
  projectCoordinate,
  validCoordinate,
  type Projection,
  type ViewportPoint,
} from "./map";
import type { NormalizedHole } from "./normalize";
import type { CarryOriginV1, ClubV2, TargetV1 } from "./project";

export const RISK_BOUNDARY_SAMPLES = 64;
export const RISK_RADIAL_RINGS = 8;
export const RISK_SAMPLE_COUNT = RISK_BOUNDARY_SAMPLES * RISK_RADIAL_RINGS;
export const RISK_EPSILON_M = 0.01;

export type RiskStatus = "safe" | "marginal" | "unsafe" | "unavailable";
export type RiskWarning = "missing-risk-geometry" | "irregular-risk-polygon"
  | "projection-unavailable" | "origin-unavailable" | "club-unavailable"
  | "degenerate-target-line" | "off-map";
export type TargetRisk = {
  targetId: string;
  targetLabel: string;
  status: RiskStatus;
  penalty: number | null;
  overlapSamples: number;
  sampleCount: number;
  warnings: RiskWarning[];
};
export type RiskComparison = {
  candidates: TargetRisk[];
  lowestRiskTargetId: string | null;
  warnings: RiskWarning[];
};

export type RiskScoreInput = {
  club: ClubV2 | null | undefined;
  origin: CarryOriginV1 | null | undefined;
  hole: NormalizedHole;
  projection: Projection | null | undefined;
  targets: TargetV1[];
};

type MeterPoint = ViewportPoint;

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function meterPoint(projection: Projection, coordinate: TargetV1 | { lat: number; lon: number }): MeterPoint {
  const point = projectCoordinate(projection, coordinate);
  return { x: point.x / projection.scale, y: point.y / projection.scale };
}

function samePoint(left: MeterPoint, right: MeterPoint): boolean {
  return Math.hypot(left.x - right.x, left.y - right.y) <= RISK_EPSILON_M;
}

function polygonArea(points: MeterPoint[]): number {
  return points.reduce((area, point, index) => {
    const next = points[(index + 1) % points.length];
    return area + point.x * next.y - point.y * next.x;
  }, 0) / 2;
}

function usableRiskPolygons(hole: NormalizedHole, projection: Projection): {
  polygons: MeterPoint[][];
  warnings: RiskWarning[];
} {
  const polygons: MeterPoint[][] = [];
  let irregular = false;
  for (const feature of hole.features) {
    if (feature.kind !== "golf-water" || feature.geometry?.type !== "polygon") continue;
    const coordinates = feature.geometry.coordinates;
    if (coordinates.length < 4 || !validCoordinate(coordinates[0])
      || !validCoordinate(coordinates[coordinates.length - 1])
      || coordinates[0].lat !== coordinates[coordinates.length - 1].lat
      || coordinates[0].lon !== coordinates[coordinates.length - 1].lon) {
      irregular = true;
      continue;
    }
    const ring = coordinates.slice(0, -1).map((coordinate) => meterPoint(projection, coordinate));
    if (!ring.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y))
      || ring.filter((point, index) => ring.slice(0, index).every((other) => !samePoint(point, other))).length < 3
      || Math.abs(polygonArea(ring)) <= RISK_EPSILON_M * RISK_EPSILON_M) {
      irregular = true;
      continue;
    }
    polygons.push(ring);
  }
  return { polygons, warnings: irregular ? ["irregular-risk-polygon"] : [] };
}

function pointOnSegment(point: MeterPoint, start: MeterPoint, end: MeterPoint): boolean {
  const delta = { x: end.x - start.x, y: end.y - start.y };
  const length = Math.hypot(delta.x, delta.y);
  if (length <= RISK_EPSILON_M) return samePoint(point, start);
  const cross = Math.abs((point.x - start.x) * delta.y - (point.y - start.y) * delta.x) / length;
  if (cross > RISK_EPSILON_M) return false;
  const dot = (point.x - start.x) * delta.x + (point.y - start.y) * delta.y;
  return dot >= -RISK_EPSILON_M && dot <= length * length + RISK_EPSILON_M;
}

function containsPoint(polygon: MeterPoint[], point: MeterPoint): boolean {
  let inside = false;
  for (let index = 0; index < polygon.length; index += 1) {
    const start = polygon[index];
    const end = polygon[(index + 1) % polygon.length];
    if (pointOnSegment(point, start, end)) return true;
    if ((start.y > point.y) !== (end.y > point.y)) {
      const crossingX = (end.x - start.x) * (point.y - start.y) / (end.y - start.y) + start.x;
      if (point.x < crossingX) inside = !inside;
    }
  }
  return inside;
}

function unavailable(target: TargetV1, warnings: RiskWarning[]): TargetRisk {
  return {
    targetId: target.id, targetLabel: target.label, status: "unavailable",
    penalty: null, overlapSamples: 0, sampleCount: 0, warnings,
  };
}

function statusFor(penalty: number): RiskStatus {
  return penalty <= 4 ? "safe" : penalty <= 24 ? "marginal" : "unsafe";
}

export function scoreTargetRisks(input: RiskScoreInput): RiskComparison {
  const targets = [...input.targets].sort((left, right) => compareText(left.id, right.id));
  if (targets.length === 0) return { candidates: [], lowestRiskTargetId: null, warnings: [] };
  if (!input.projection) {
    const warnings: RiskWarning[] = ["projection-unavailable"];
    return { candidates: targets.map((target) => unavailable(target, warnings)), lowestRiskTargetId: null, warnings };
  }
  if (!input.club) {
    const warnings: RiskWarning[] = ["club-unavailable"];
    return { candidates: targets.map((target) => unavailable(target, warnings)), lowestRiskTargetId: null, warnings };
  }
  if (!input.origin) {
    const warnings: RiskWarning[] = ["origin-unavailable"];
    return { candidates: targets.map((target) => unavailable(target, warnings)), lowestRiskTargetId: null, warnings };
  }
  const origin = resolveCarryOrigin(input.origin, input.hole, input.targets);
  if ("kind" in origin) {
    const warnings: RiskWarning[] = ["origin-unavailable"];
    return { candidates: targets.map((target) => unavailable(target, warnings)), lowestRiskTargetId: null, warnings };
  }
  const risks = usableRiskPolygons(input.hole, input.projection);
  if (risks.polygons.length === 0) {
    const warnings: RiskWarning[] = [...risks.warnings, "missing-risk-geometry"];
    return { candidates: targets.map((target) => unavailable(target, warnings)), lowestRiskTargetId: null, warnings };
  }

  const originMeters = meterPoint(input.projection, origin);
  const candidates = targets.map((target) => {
    if (!validCoordinate(target)) return unavailable(target, ["degenerate-target-line"]);
    const targetMeters = meterPoint(input.projection!, target);
    const delta = { x: targetMeters.x - originMeters.x, y: targetMeters.y - originMeters.y };
    const length = Math.hypot(delta.x, delta.y);
    if (!Number.isFinite(length) || length <= RISK_EPSILON_M) return unavailable(target, ["degenerate-target-line"]);
    const unit = { x: delta.x / length, y: delta.y / length };
    const normal = { x: -unit.y, y: unit.x };
    const center = {
      x: originMeters.x + unit.x * input.club!.carry / YARDS_PER_METER,
      y: originMeters.y + unit.y * input.club!.carry / YARDS_PER_METER,
    };
    const longitudinal = input.club!.longitudinal / YARDS_PER_METER / 2;
    const lateral = input.club!.lateral / YARDS_PER_METER / 2;
    let overlapSamples = 0;
    let weightedOverlap = 0;
    let offMap = false;
    for (let ring = 1; ring <= RISK_RADIAL_RINGS; ring += 1) {
      const radius = ring / RISK_RADIAL_RINGS;
      const weight = (ring * ring - (ring - 1) * (ring - 1))
        / (RISK_RADIAL_RINGS * RISK_RADIAL_RINGS * RISK_BOUNDARY_SAMPLES);
      for (let index = 0; index < RISK_BOUNDARY_SAMPLES; index += 1) {
        const theta = index / RISK_BOUNDARY_SAMPLES * 2 * Math.PI;
        const point = {
          x: center.x + unit.x * longitudinal * radius * Math.cos(theta) + normal.x * lateral * radius * Math.sin(theta),
          y: center.y + unit.y * longitudinal * radius * Math.cos(theta) + normal.y * lateral * radius * Math.sin(theta),
        };
        if (ring === RISK_RADIAL_RINGS) {
          const svg = { x: point.x * input.projection!.scale, y: point.y * input.projection!.scale };
          if (svg.x < INNER_MIN_X || svg.x > INNER_MAX_X || svg.y < INNER_MIN_Y || svg.y > INNER_MAX_Y) offMap = true;
        }
        if (risks.polygons.some((polygon) => containsPoint(polygon, point))) {
          overlapSamples += 1;
          weightedOverlap += weight;
        }
      }
    }
    if (offMap) return unavailable(target, ["off-map"]);
    const penalty = Math.max(0, Math.min(100, roundHalfUpNonnegative(100 * weightedOverlap)));
    return {
      targetId: target.id, targetLabel: target.label, status: statusFor(penalty), penalty,
      overlapSamples, sampleCount: RISK_SAMPLE_COUNT, warnings: [...risks.warnings],
    };
  });
  const available = candidates.filter((candidate) => candidate.penalty !== null)
    .sort((left, right) => left.penalty! - right.penalty! || compareText(left.targetId, right.targetId));
  return {
    candidates,
    lowestRiskTargetId: available[0]?.targetId ?? null,
    warnings: risks.warnings,
  };
}
