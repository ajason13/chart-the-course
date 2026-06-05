import sampleCourse from "../fixtures/courses/sample-course.json";
import { summarizeCourse } from "./course";

describe("sample course scaffold", () => {
  it("summarizes the placeholder fixture deterministically", () => {
    expect(summarizeCourse(sampleCourse)).toBe("3 placeholder holes / par 12");
  });
});
