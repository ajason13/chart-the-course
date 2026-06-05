import sampleCourse from "../fixtures/courses/sample-course.json";
import { summarizeCourse, type SampleCourse } from "./course";
import "./styles.css";

const course = sampleCourse as SampleCourse;

function renderApp(root: HTMLElement): void {
  root.innerHTML = `
    <main class="shell">
      <section class="workspace" aria-labelledby="app-title">
        <div class="intro">
          <p class="eyebrow">Open-source yardage book builder</p>
          <h1 id="app-title">Chart the Course</h1>
          <p class="lede">
            Plan course strategy from public course geometry, local player notes,
            and deterministic browser calculations.
          </p>
          <div class="actions" aria-label="Primary scaffold actions">
            <button type="button" disabled>Search courses</button>
            <button type="button" disabled>Open fixture</button>
          </div>
        </div>
        <aside class="status-panel" aria-label="Scaffold status">
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
              <dd>${course.name}</dd>
            </div>
            <div>
              <dt>Fixture summary</dt>
              <dd>${summarizeCourse(course)}</dd>
            </div>
          </dl>
        </aside>
      </section>
      <section class="map-placeholder" aria-label="Vector-only map placeholder">
        <div class="hole-line" aria-hidden="true"></div>
        <span class="tee">Tee</span>
        <span class="green">Green</span>
      </section>
      <p class="attribution">${course.attribution}</p>
    </main>
  `;
}

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("App root element #app was not found.");
}

renderApp(root);
