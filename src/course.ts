export type Coordinate = readonly number[];

export interface SampleCourse {
  name: string;
  source: string;
  attribution: string;
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
