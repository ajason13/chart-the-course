import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { HoleMap } from "./HoleMap";
import { normalizeGolfCourse } from "./normalize";
import {
  buildDetailQuery,
  buildDiscoveryQuery,
  detailCacheKey,
  discoveryCacheKey,
  fetchOverpass,
  OSM_COPYRIGHT_URL,
  parseBbox,
  parseCandidateBounds,
  readCache,
  sourceMetadata,
  validateResponse,
  writeCache,
  type Bbox,
  type CachedResponse,
  type OverpassElement,
  type OverpassResponse,
  type RequestFailure,
} from "./overpass";
import {
  PROJECT_FILENAME,
  PROJECT_MAX_BYTES,
  PROJECT_MIME,
  emptyProject,
  parseProjectText,
  projectMatchErrors,
  serializeProject,
  type HoleStateV1,
  type ValidationError,
} from "./project";
import type { SourceKey } from "./normalize";

type ViewState =
  | { kind: "idle" }
  | { kind: "invalid"; message: string }
  | { kind: "loading"; mode: "discovery" | "detail" }
  | { kind: "cancelled" }
  | { kind: "empty"; mode: "discovery" | "detail"; cached: boolean; source: CachedResponse["source"] }
  | { kind: "success"; mode: "discovery" | "detail"; cached: boolean; response: OverpassResponse; source: CachedResponse["source"] }
  | { kind: "rate-limit" }
  | { kind: "timeout" }
  | { kind: "network"; message: string }
  | { kind: "http"; status: number }
  | { kind: "parse" }
  | { kind: "shape" };

const INITIAL_FIELDS = { south: "", west: "", north: "", east: "" };

function stateMessage(state: ViewState): string {
  switch (state.kind) {
    case "idle": return "Enter a bounded location and submit when ready.";
    case "invalid": return state.message;
    case "loading": return `Loading ${state.mode} results.`;
    case "cancelled": return "Request cancelled.";
    case "empty": return `No ${state.mode} results were returned${state.cached ? " from session cache" : ""}.`;
    case "success": return `${state.response.elements.length} raw ${state.mode} entities loaded${state.cached ? " from session cache" : ""}.`;
    case "rate-limit": return "Overpass rate-limited this request. Try again later.";
    case "timeout": return "The request timed out. Narrow the area or try again later.";
    case "network": return `Network request failed: ${state.message}`;
    case "http": return `Overpass returned HTTP ${state.status}.`;
    case "parse": return "Overpass returned malformed JSON.";
    case "shape": return "Overpass returned JSON with an invalid entity shape.";
  }
}

function elementName(element: OverpassElement): string {
  const name = element.tags?.name;
  return typeof name === "string" && name.trim() ? name : `Unnamed ${element.type} ${element.id}`;
}

function EntitySummary({ response }: { response: OverpassResponse }) {
  const counts = response.elements.reduce<Record<string, number>>((result, element) => {
    result[element.type] = (result[element.type] ?? 0) + 1;
    return result;
  }, {});
  return (
    <dl className="entity-summary" aria-label="Raw entity summary">
      {["node", "way", "relation"].map((type) => (
        <div key={type}><dt>{type}s</dt><dd>{counts[type] ?? 0}</dd></div>
      ))}
    </dl>
  );
}

export function App() {
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [courseName, setCourseName] = useState("");
  const [state, setState] = useState<ViewState>({ kind: "idle" });
  const [warning, setWarning] = useState("");
  const [invalidField, setInvalidField] = useState<keyof Bbox | "courseName" | null>(null);
  const [selectedHoleKey, setSelectedHoleKey] = useState("");
  const [projectHoles, setProjectHoles] = useState<Partial<Record<SourceKey, HoleStateV1>>>({});
  const [projectErrors, setProjectErrors] = useState<ValidationError[]>([]);
  const [projectMessage, setProjectMessage] = useState("");
  const requestIdentity = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const fieldRefs = useRef<Record<keyof Bbox, HTMLInputElement | null>>({
    south: null, west: null, north: null, east: null,
  });
  const courseNameRef = useRef<HTMLInputElement>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const projectNotice = useRef<HTMLParagraphElement>(null);
  const projectErrorHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => () => {
    requestIdentity.current += 1;
    controller.current?.abort();
  }, []);

  const loading = state.kind === "loading";
  const normalized = useMemo(() =>
    state.kind === "success" && state.mode === "detail"
      ? normalizeGolfCourse(state.response, state.source)
      : null, [state]);

  useEffect(() => {
    setSelectedHoleKey(normalized?.holes[0]?.source.sourceKey ?? "");
    setProjectHoles({});
    setProjectErrors([]);
    setProjectMessage("");
  }, [normalized]);

  const courseSourceKey = normalized?.courseCandidates[0]?.source.sourceKey ?? null;
  const holeKeys = normalized?.holes.map(({ source }) => source.sourceKey) ?? [];

  function holeProject(key: SourceKey): HoleStateV1 {
    return projectHoles[key] ?? { targets: [], carries: [] };
  }

  function setHoleProject(key: SourceKey, project: HoleStateV1) {
    setProjectHoles((current) => ({ ...current, [key]: project }));
    setProjectMessage("");
  }

  function exportProject() {
    if (!courseSourceKey) return;
    const project = emptyProject(courseSourceKey);
    project.holes = projectHoles;
    const blob = new Blob([serializeProject(project)], { type: PROJECT_MIME });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = PROJECT_FILENAME;
    document.body.appendChild(anchor);
    anchor.click();
    requestAnimationFrame(() => {
      URL.revokeObjectURL(url);
      anchor.remove();
    });
    setProjectMessage("Project export started.");
  }

  async function importProject(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !courseSourceKey) return;
    const hasState = Object.values(projectHoles).some((hole) => hole && (hole.targets.length > 0 || hole.carries.length > 0));
    if (hasState && !window.confirm("Importing will replace your current project. Continue?")) {
      event.target.value = "";
      importInput.current?.focus();
      return;
    }
    setProjectErrors([]);
    setProjectMessage("");
    if (file.size > PROJECT_MAX_BYTES) {
      setProjectErrors([{ code: "OUT_OF_RANGE", path: "$", message: "File exceeds 512 KiB limit." }]);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      setProjectErrors([{ code: "INVALID_JSON", path: "$", message: "File could not be read." }]);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    const validated = parseProjectText(text);
    if (!validated.ok) {
      setProjectErrors(validated.errors);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    const mismatches = projectMatchErrors(validated.project, courseSourceKey, holeKeys);
    if (mismatches.length > 0) {
      setProjectErrors(mismatches);
      requestAnimationFrame(() => projectErrorHeading.current?.focus());
      return;
    }
    setProjectHoles(validated.project.holes);
    setProjectMessage("Project imported successfully.");
    event.target.value = "";
    requestAnimationFrame(() => projectNotice.current?.focus());
  }

  function setField(field: keyof Bbox, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
  }

  function classifyFailure(failure: RequestFailure) {
    if (failure.kind === "cancelled") setState({ kind: "cancelled" });
    else if (failure.kind === "timeout" || (failure.kind === "http" && failure.status === 504)) setState({ kind: "timeout" });
    else if (failure.kind === "http" && failure.status === 429) setState({ kind: "rate-limit" });
    else if (failure.kind === "http") setState({ kind: "http", status: failure.status });
    else setState({ kind: "network", message: failure.message });
  }

  async function runRequest(mode: "discovery" | "detail", bbox: Bbox, query: string, cacheKey: string, timeout: number) {
    setWarning("");
    let cache;
    try {
      cache = readCache(window.sessionStorage, cacheKey);
    } catch {
      cache = { kind: "warning" as const, message: "Session cache is unavailable." };
    }
    if (cache.kind === "hit") {
      setState(cache.response.elements.length
        ? { kind: "success", mode, cached: true, response: cache.response, source: cache.cached.source }
        : { kind: "empty", mode, cached: true, source: cache.cached.source });
      return;
    }
    if (cache.kind === "warning") setWarning(cache.message);

    const id = ++requestIdentity.current;
    const activeController = new AbortController();
    controller.current = activeController;
    setState({ kind: "loading", mode });
    const result = await fetchOverpass(query, timeout, activeController.signal);
    if (requestIdentity.current !== id) return;
    controller.current = null;

    if (!result.ok) {
      classifyFailure(result.failure);
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(result.rawResponse);
    } catch {
      setState({ kind: "parse" });
      return;
    }
    const response = validateResponse(parsed);
    if (!response) {
      setState({ kind: "shape" });
      return;
    }
    const source = sourceMetadata(query, bbox);
    let cacheWarning: string | null;
    try {
      cacheWarning = writeCache(window.sessionStorage, cacheKey, { rawResponse: result.rawResponse, source });
    } catch {
      cacheWarning = "Result displayed, but session cache is unavailable.";
    }
    if (cacheWarning) setWarning(cacheWarning);
    setState(response.elements.length
      ? { kind: "success", mode, cached: false, response, source }
      : { kind: "empty", mode, cached: false, source });
  }

  function submitDiscovery(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setInvalidField(null);
    const parsed = parseBbox(fields);
    if (!parsed.ok) {
      setState({ kind: "invalid", message: parsed.message });
      setInvalidField(parsed.field);
      requestAnimationFrame(() => fieldRefs.current[parsed.field]?.focus());
      return;
    }
    let query;
    try {
      query = buildDiscoveryQuery(parsed.bbox, courseName);
    } catch (error) {
      setState({ kind: "invalid", message: error instanceof Error ? error.message : "Invalid course name." });
      setInvalidField("courseName");
      requestAnimationFrame(() => courseNameRef.current?.focus());
      return;
    }
    void runRequest("discovery", parsed.bbox, query, discoveryCacheKey(parsed.bbox, courseName), 25);
  }

  function loadDetail(element: OverpassElement) {
    const bbox = parseCandidateBounds(element.bounds);
    if (!bbox || loading) return;
    void runRequest("detail", bbox, buildDetailQuery(bbox), detailCacheKey(bbox), 45);
  }

  function cancel() {
    requestIdentity.current += 1;
    controller.current?.abort();
    controller.current = null;
    setState({ kind: "cancelled" });
    requestAnimationFrame(() => submitButton.current?.focus());
  }

  const showsOsmResult = state.kind === "success" || state.kind === "empty";
  const errorState = ["invalid", "rate-limit", "timeout", "network", "http", "parse", "shape"].includes(state.kind);

  return (
    <main className="shell">
      <header>
        <p className="eyebrow">Open-source yardage book builder</p>
        <h1>Chart the Course</h1>
        <p className="lede">Search raw OpenStreetMap golf-course entities inside a small manually entered bounding box.</p>
      </header>

      <section className="search-panel" aria-labelledby="search-title">
        <h2 id="search-title">Course discovery</h2>
        <form onSubmit={submitDiscovery}>
          <label>Course name <span>(optional)</span>
            <input ref={courseNameRef} name="courseName" value={courseName} onChange={(event) => setCourseName(event.target.value)}
              aria-invalid={invalidField === "courseName"} />
          </label>
          <fieldset>
            <legend>Manual location bounds in decimal degrees</legend>
            <div className="coordinate-grid">
              {(Object.keys(fields) as (keyof Bbox)[]).map((field) => (
                <label key={field}>{field[0].toUpperCase() + field.slice(1)}
                  <input ref={(node) => { fieldRefs.current[field] = node; }} name={field} inputMode="decimal"
                    value={fields[field]} onChange={(event) => setField(field, event.target.value)}
                    aria-invalid={invalidField === field} placeholder={field === "south" ? "37.30" : field === "west" ? "-122.10" : field === "north" ? "37.50" : "-121.90"} />
                </label>
              ))}
            </div>
            <p className="hint">South, west, north, east. Each span must be 0.35 degrees or less.</p>
          </fieldset>
          <div className="actions">
            <button ref={submitButton} type="submit" disabled={loading}>Search courses</button>
            <button className="secondary" type="button" onClick={cancel} disabled={!loading}>Cancel request</button>
          </div>
        </form>
      </section>

      <section className={`status ${errorState ? "error" : ""}`} aria-live={errorState ? "assertive" : "polite"} aria-atomic="true">
        <strong>Status</strong>
        <p>{stateMessage(state)}</p>
        {warning && <p className="warning">{warning}</p>}
      </section>

      {state.kind === "success" && (
        <section className="results" aria-labelledby="results-title">
          <div>
            <p className="eyebrow">{state.mode} response</p>
            <h2 id="results-title">Raw OSM entities</h2>
          </div>
          <EntitySummary response={state.response} />
          {state.mode === "discovery" && (
            <ul className="candidate-list">
              {state.response.elements.map((element) => {
                const bounds = parseCandidateBounds(element.bounds);
                return (
                  <li key={`${element.type}-${element.id}`}>
                    <div><strong>{elementName(element)}</strong><span>{element.type} {element.id}</span></div>
                    <button type="button" disabled={!bounds || loading} onClick={() => loadDetail(element)}>
                      {bounds ? "Load raw detail" : "Detail unavailable"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {state.mode === "detail" && (
            <>
              <ul className="raw-list">
                {state.response.elements.map((element) => <li key={`${element.type}-${element.id}`}><code>{element.type}/{element.id}</code> {elementName(element)}</li>)}
              </ul>
              {normalized && normalized.holes.length > 0 ? (
                <section className="map-workspace" aria-labelledby="map-workspace-title">
                  <div className="map-selection">
                    <h3 id="map-workspace-title">Selected-hole map</h3>
                    <label>Hole
                      <select value={selectedHoleKey} onChange={(event) => setSelectedHoleKey(event.target.value)}>
                        {normalized.holes.map((hole) => (
                          <option key={hole.source.sourceKey} value={hole.source.sourceKey}>
                            {hole.number === null ? hole.source.sourceKey : `Hole ${hole.number}`}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  {normalized.holes.filter((hole) => hole.source.sourceKey === selectedHoleKey).map((hole) => (
                    <HoleMap key={hole.source.sourceKey} hole={hole} warnings={normalized.warnings} source={normalized.source}
                      project={holeProject(hole.source.sourceKey)}
                      onProjectChange={(project) => setHoleProject(hole.source.sourceKey, project)} />
                  ))}
                  <section className="project-io" aria-labelledby="project-io-title">
                    <h3 id="project-io-title">Local project file</h3>
                    <p className="hint">Project files contain user-authored targets and carry settings only. Import replaces current project state when valid.</p>
                    <div className="actions">
                      <button type="button" onClick={exportProject} disabled={!courseSourceKey}>Export project</button>
                      <label className="file-label">Import project file (.json)
                        <input ref={importInput} type="file" accept=".json,application/json" onChange={(event) => void importProject(event)} />
                      </label>
                    </div>
                    {projectMessage && <p ref={projectNotice} tabIndex={-1} aria-live="polite">{projectMessage}</p>}
                    {projectErrors.length > 0 && <div className="project-errors" role="alert">
                      <h4 ref={projectErrorHeading} tabIndex={-1}>Import failed - {projectErrors.length} error(s)</h4>
                      <ul>{projectErrors.map((error, index) => <li key={`${error.code}-${error.path}-${index}`}>
                        <strong>{error.code}</strong>: {error.message} <code>{error.path}</code>
                      </li>)}</ul>
                    </div>}
                  </section>
                </section>
              ) : <p className="map-empty" role="status">No normalized holes are available to render.</p>}
            </>
          )}
          <details>
            <summary>Source diagnostics</summary>
            <dl className="diagnostics">
              <div><dt>Endpoint</dt><dd>{state.source.endpoint}</dd></div>
              <div><dt>Bbox</dt><dd>{state.source.bbox}</dd></div>
              <div><dt>Completed</dt><dd>{state.source.completedAt}</dd></div>
              <div><dt>Query</dt><dd><pre>{state.source.query}</pre></dd></div>
            </dl>
          </details>
        </section>
      )}

      {showsOsmResult && (
        <p className="attribution">Data © OpenStreetMap contributors, available under ODbL. <a href={OSM_COPYRIGHT_URL}>OpenStreetMap copyright and license</a>. Session cache does not satisfy later source-export obligations.</p>
      )}
    </main>
  );
}
