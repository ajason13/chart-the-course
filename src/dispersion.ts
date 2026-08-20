import { resolveCarryOrigin } from "./carry";
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

export const DISPERSION_SAMPLES = 64;

export type DispersionFailure = {
  kind: "projection-unavailable" | "origin-unavailable" | "target-unavailable" | "club-unavailable" | "degenerate-target-line";
};

export type DispersionEllipse = {
  center: ViewportPoint;
  points: ViewportPoint[];
  longitudinalRadius: number;
  lateralRadius: number;
  offMap: boolean;
};

type DispersionInput = {
  club: ClubV2 | null | undefined;
  origin: CarryOriginV1 | null | undefined;
  target: TargetV1 | null | undefined;
  hole: NormalizedHole;
  targets: TargetV1[];
  projection: Projection | null | undefined;
};

export function dispersionEllipse(input: DispersionInput): DispersionEllipse | DispersionFailure {
  if (!input.projection) return { kind: "projection-unavailable" };
  if (!input.club) return { kind: "club-unavailable" };
  if (!input.target || !validCoordinate(input.target)) return { kind: "target-unavailable" };
  if (!input.origin) return { kind: "origin-unavailable" };
  const origin = resolveCarryOrigin(input.origin, input.hole, input.targets);
  if ("kind" in origin) return { kind: "origin-unavailable" };

  const projectedOrigin = projectCoordinate(input.projection, origin);
  const projectedTarget = projectCoordinate(input.projection, input.target);
  const originMeters = { x: projectedOrigin.x / input.projection.scale, y: projectedOrigin.y / input.projection.scale };
  const targetMeters = { x: projectedTarget.x / input.projection.scale, y: projectedTarget.y / input.projection.scale };
  const delta = { x: targetMeters.x - originMeters.x, y: targetMeters.y - originMeters.y };
  const length = Math.hypot(delta.x, delta.y);
  if (!Number.isFinite(length) || length <= 0.01) return { kind: "degenerate-target-line" };

  const unit = { x: delta.x / length, y: delta.y / length };
  const normal = { x: -unit.y, y: unit.x };
  const carryMeters = input.club.carry / YARDS_PER_METER;
  const centerMeters = {
    x: originMeters.x + unit.x * carryMeters,
    y: originMeters.y + unit.y * carryMeters,
  };
  const longitudinalMeters = input.club.longitudinal / YARDS_PER_METER / 2;
  const lateralMeters = input.club.lateral / YARDS_PER_METER / 2;
  const points = Array.from({ length: DISPERSION_SAMPLES }, (_, index) => {
    const theta = index / DISPERSION_SAMPLES * 2 * Math.PI;
    return {
      x: (centerMeters.x + unit.x * longitudinalMeters * Math.cos(theta)
        + normal.x * lateralMeters * Math.sin(theta)) * input.projection!.scale,
      y: (centerMeters.y + unit.y * longitudinalMeters * Math.cos(theta)
        + normal.y * lateralMeters * Math.sin(theta)) * input.projection!.scale,
    };
  });
  return {
    center: { x: centerMeters.x * input.projection.scale, y: centerMeters.y * input.projection.scale },
    points,
    longitudinalRadius: longitudinalMeters * input.projection.scale,
    lateralRadius: lateralMeters * input.projection.scale,
    offMap: points.some(({ x, y }) => x < INNER_MIN_X || x > INNER_MAX_X || y < INNER_MIN_Y || y > INNER_MAX_Y),
  };
}
