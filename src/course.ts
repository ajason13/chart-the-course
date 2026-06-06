export type Coordinate = readonly number[];

export interface SampleCourse {
  name: string;
  synthetic: boolean;
  coordinateSystem: string;
  source: string;
  notice: string;
  center: Coordinate;
  holes: Array<{
    number: number;
    par: number;
    tee: Coordinate;
    green: Coordinate;
  }>;
}

export function summarizeCourse(sample: SampleCourse): string {
  const holeCount = sample.holes.length;
  const par = sample.holes.reduce((total, hole) => total + hole.par, 0);
  return `${holeCount} placeholder holes / par ${par}`;
}

export function isSyntheticCourse(sample: SampleCourse): boolean {
  const coordinates = [
    sample.center,
    ...sample.holes.flatMap((hole) => [hole.tee, hole.green])
  ];

  return (
    sample.synthetic === true &&
    sample.coordinateSystem === "local-normalized" &&
    coordinates.every(
      (coordinate) =>
        coordinate.length === 2 &&
        coordinate.every(
          (value) =>
            typeof value === "number" &&
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 100
        )
    )
  );
}
