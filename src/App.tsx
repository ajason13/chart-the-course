import sampleCourse from "../fixtures/courses/sample-course.json";
import { isSyntheticCourse, summarizeCourse, type SampleCourse } from "./course";

const course = sampleCourse as SampleCourse;

export function App() {
  if (!isSyntheticCourse(course)) {
    throw new Error("The scaffold fixture must use synthetic local coordinates.");
  }

  return (
    <main className="shell">
      <section className="workspace" aria-labelledby="app-title">
        <div className="intro">
          <p className="eyebrow">Open-source yardage book builder</p>
          <h1 id="app-title">Chart the Course</h1>
          <p className="lede">
            Plan course strategy from public course geometry, local player notes,
            and deterministic browser calculations.
          </p>
          <div className="actions" aria-label="Primary scaffold actions">
            <button type="button" disabled>Search courses</button>
            <button type="button" disabled>Open fixture</button>
          </div>
        </div>
        <aside className="status-panel" aria-label="Scaffold status">
          <dl>
            <div>
              <dt>Runtime LLM</dt>
              <dd>None</dd>
            </div>
            <div>
              <dt>Basemap tiles</dt>
              <dd>Not loaded by default</dd>
            </div>
            <div>
              <dt>Sample fixture</dt>
              <dd>{course.name}</dd>
            </div>
            <div>
              <dt>Fixture summary</dt>
              <dd>{summarizeCourse(course)}</dd>
            </div>
          </dl>
        </aside>
      </section>
      <section className="map-placeholder" aria-label="Vector-only map placeholder">
        <div className="hole-line" aria-hidden="true"></div>
        <span className="tee">Tee</span>
        <span className="green">Green</span>
      </section>
      <p className="attribution">{course.notice}</p>
    </main>
  );
}
