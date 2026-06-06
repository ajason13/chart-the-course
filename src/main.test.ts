import sampleCourse from "../fixtures/courses/sample-course.json";
import { isSyntheticCourse, summarizeCourse } from "./course";

describe("sample course scaffold", () => {
  it("summarizes the placeholder fixture deterministically", () => {
    expect(summarizeCourse(sampleCourse)).toBe("3 placeholder holes / par 12");
  });

  it("uses explicitly synthetic non-geographic coordinates", () => {
    expect(isSyntheticCourse(sampleCourse)).toBe(true);
  });

  it("rejects fixture coordinates outside the local normalized space", () => {
    const invalidCourse = structuredClone(sampleCourse);
    invalidCourse.center = [-122.08, 37.42];

    expect(isSyntheticCourse(invalidCourse)).toBe(false);
  });
});
