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
  sourceMetadata,
  validateResponse,
  type Bbox,
  type CachedResponse,
  type OverpassElement,
  type OverpassResponse,
  type RequestFailure,
} from "./overpass";
import { overpassCache, type CacheLookup, type OverpassCacheMode } from "./overpassCache";
import {
  buildGisSourceExport,
  GIS_SOURCE_EXPORT_MIME,
  type ActiveSourceEvidence,
  type SourceConsentState,
} from "./gisSourceExport";
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
  | { kind: "empty"; mode: "discovery" | "detail"; cached: boolean; response: OverpassResponse; source: CachedResponse["source"] }
  | { kind: "success"; mode: "discovery" | "detail"; cached: boolean; response: OverpassResponse; source: CachedResponse["source"] }
  | { kind: "rate-limit"; retryAfterMs?: number }
  | { kind: "timeout" }
  | { kind: "network"; message: string }
  | { kind: "http"; status: number }
  | { kind: "parse" }
  | { kind: "shape" };

const INITIAL_FIELDS = { south: "", west: "", north: "", east: "" };
const REFRESH_COOLDOWN_MS = 5_000;

type RequestOptions = {
  bypassCache?: boolean;
  manualRefresh?: boolean;
};

type RequestContext = {
  mode: OverpassCacheMode;
  bbox: Bbox;
  query: string;
  cacheKey: string;
  timeout: number;
};

type StaleCandidate = {
  context: RequestContext;
  cached: CachedResponse;
  response: OverpassResponse;
  recordDate: string;
};

function stateMessage(state: ViewState): string {
  switch (state.kind) {
    case "idle": return "Enter a bounded location and submit when ready.";
    case "invalid": return state.message;
    case "loading": return `Loading ${state.mode} results.`;
    case "cancelled": return "Request cancelled.";
    case "empty": return `No ${state.mode} results were returned${state.cached ? " from durable cache" : ""}.`;
    case "success": return `${state.response.elements.length} raw ${state.mode} entities loaded${state.cached ? " from durable cache" : ""}.`;
    case "rate-limit": return state.retryAfterMs && state.retryAfterMs > 60_000
      ? "Overpass requested a longer rate-limit wait than this app will hold. Try again later."
      : "Overpass rate-limited this request. Try again later.";
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
  const [refreshStatus, setRefreshStatus] = useState("Refresh course data is available after loading results.");
  const [staleCandidate, setStaleCandidate] = useState<StaleCandidate | null>(null);
  const [activeContext, setActiveContext] = useState<RequestContext | null>(null);
  const [activeSourceEvidence, setActiveSourceEvidence] = useState<ActiveSourceEvidence | null>(null);
  const refreshCooldowns = useRef(new Map<string, number>());
  const [invalidField, setInvalidField] = useState<keyof Bbox | "courseName" | null>(null);
  const [selectedHoleKey, setSelectedHoleKey] = useState("");
  const [projectHoles, setProjectHoles] = useState<Partial<Record<SourceKey, HoleStateV1>>>({});
  const [projectErrors, setProjectErrors] = useState<ValidationError[]>([]);
  const [projectMessage, setProjectMessage] = useState("");
  const [sourceExportMessage, setSourceExportMessage] = useState("");
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

  function exportGisSource() {
    const result = buildGisSourceExport(activeSourceEvidence, activeContext);
    if (!result.ok) {
      setSourceExportMessage(result.message);
      return;
    }
    const blob = new Blob([result.text], { type: GIS_SOURCE_EXPORT_MIME });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = result.filename;
    document.body.appendChild(anchor);
    anchor.click();
    requestAnimationFrame(() => {
      URL.revokeObjectURL(url);
      anchor.remove();
    });
    setSourceExportMessage(result.envelope.isStaleSource
      ? `Raw GIS source export started with stale OpenStreetMap data from ${result.envelope.completedAt}.`
      : "Raw GIS source export started.");
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
    setActiveSourceEvidence(null);
    if (failure.kind === "cancelled") setState({ kind: "cancelled" });
    else if (failure.kind === "timeout" || (failure.kind === "http" && failure.status === 504)) setState({ kind: "timeout" });
    else if (failure.kind === "rate-limit") setState({ kind: "rate-limit", retryAfterMs: failure.retryAfterMs });
    else if (failure.kind === "http") setState({ kind: "http", status: failure.status });
    else setState({ kind: "network", message: failure.message });
  }

  function displayResult(
    mode: "discovery" | "detail",
    cached: boolean,
    response: OverpassResponse,
    source: CachedResponse["source"],
    context: RequestContext,
    rawResponse?: string,
    consentState: SourceConsentState = "fresh",
  ) {
    setActiveContext(context);
    setActiveSourceEvidence(mode === "detail" && rawResponse
      ? { mode, cacheKey: context.cacheKey, rawResponse, source, consentState }
      : null);
    setSourceExportMessage("");
    setState(response.elements.length
      ? { kind: "success", mode, cached, response, source }
      : { kind: "empty", mode, cached, response, source });
  }

  function cacheKeyForCurrentResult(): string | null {
    return state.kind === "success" || state.kind === "empty" ? activeContext?.cacheKey ?? null : null;
  }

  function cooldownRemaining(cacheKey: string): number {
    return Math.max(0, (refreshCooldowns.current.get(cacheKey) ?? 0) - Date.now());
  }

  function startRefreshCooldown(cacheKey: string) {
    refreshCooldowns.current.set(cacheKey, Date.now() + REFRESH_COOLDOWN_MS);
    setRefreshStatus("Refresh cooldown active. Please wait 5 seconds.");
    window.setTimeout(() => {
      if (cooldownRemaining(cacheKey) === 0) setRefreshStatus("Refresh course data is available.");
    }, REFRESH_COOLDOWN_MS);
  }

  async function runRequest(
    mode: "discovery" | "detail",
    bbox: Bbox,
    query: string,
    cacheKey: string,
    timeout: number,
    options: RequestOptions = {},
  ) {
    setWarning("");
    setStaleCandidate(null);
    setActiveSourceEvidence(null);
    setSourceExportMessage("");

    let stale: Extract<CacheLookup, { kind: "stale" }> | null = null;
    if (!options.bypassCache) {
      const cache = await overpassCache.read({ key: cacheKey, mode, query, bbox });
      if (cache.kind === "hit") {
        displayResult(mode, true, cache.response, cache.cached.source, { mode, bbox, query, cacheKey, timeout }, cache.cached.rawResponse);
        setRefreshStatus("Course data loaded from durable cache.");
        return;
      }
      if (cache.kind === "stale") stale = cache;
      if (cache.kind === "warning") setWarning(cache.message);
    }

    const id = ++requestIdentity.current;
    const activeController = new AbortController();
    controller.current = activeController;
    setState({ kind: "loading", mode });
    if (options.manualRefresh) {
      startRefreshCooldown(cacheKey);
      setRefreshStatus("Refreshing course data from OpenStreetMap.");
    }
    const result = await fetchOverpass(query, timeout, activeController.signal);
    if (requestIdentity.current !== id) return;
    controller.current = null;

    if (!result.ok) {
      classifyFailure(result.failure);
      if (stale) {
        setStaleCandidate({
          context: { mode, bbox, query, cacheKey, timeout },
          cached: stale.cached,
          response: stale.response,
          recordDate: stale.cached.source.completedAt,
        });
      }
      if (options.manualRefresh) setRefreshStatus("Refresh failed. Existing course view was left unchanged.");
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(result.rawResponse);
    } catch {
      setActiveSourceEvidence(null);
      setState({ kind: "parse" });
      return;
    }
    const response = validateResponse(parsed);
    if (!response) {
      setActiveSourceEvidence(null);
      setState({ kind: "shape" });
      return;
    }
    const source = sourceMetadata(query, bbox);
    try {
      const cacheResult = await overpassCache.write({
        key: cacheKey,
        mode,
        cached: { rawResponse: result.rawResponse, source },
        signal: activeController.signal,
      });
      if (cacheResult.kind === "warning") setWarning(cacheResult.message);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setWarning("Result displayed, but durable cache could not be updated.");
      }
    }
    displayResult(mode, false, response, source, { mode, bbox, query, cacheKey, timeout }, result.rawResponse);
    if (options.manualRefresh) setRefreshStatus("Refresh complete.");
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

  function refreshCourseData() {
    if (loading) return;
    let context: RequestContext | null = null;
    if (state.kind === "success" || state.kind === "empty") context = activeContext;
    if (!context) return;
    const remaining = cooldownRemaining(context.cacheKey);
    if (remaining > 0) {
      setRefreshStatus(`Refresh cooldown active. Please wait ${Math.ceil(remaining / 1000)} seconds.`);
      return;
    }
    void runRequest(context.mode, context.bbox, context.query, context.cacheKey, context.timeout, { bypassCache: true, manualRefresh: true });
  }

  function renderStaleData() {
    if (!staleCandidate) return;
    displayResult(
      staleCandidate.context.mode,
      true,
      staleCandidate.response,
      staleCandidate.cached.source,
      staleCandidate.context,
      staleCandidate.cached.rawResponse,
      "stale-consented",
    );
    setWarning(`Showing stale OpenStreetMap data from ${staleCandidate.recordDate}. Refresh when Overpass is available.`);
    setStaleCandidate(null);
  }

  function cancel() {
    requestIdentity.current += 1;
    controller.current?.abort();
    controller.current = null;
    setActiveSourceEvidence(null);
    setSourceExportMessage("");
    setState({ kind: "cancelled" });
    requestAnimationFrame(() => submitButton.current?.focus());
  }

  const showsOsmResult = state.kind === "success" || state.kind === "empty";
  const errorState = ["invalid", "rate-limit", "timeout", "network", "http", "parse", "shape"].includes(state.kind);
  const canRefresh = showsOsmResult && !loading;
  const canExportGisSource = (state.kind === "success" || state.kind === "empty")
    && state.mode === "detail"
    && activeSourceEvidence?.mode === "detail";

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
            <button className="secondary" type="button" onClick={refreshCourseData} disabled={!canRefresh || (cacheKeyForCurrentResult() ? cooldownRemaining(cacheKeyForCurrentResult()!) > 0 : false)}>
              Refresh course data
            </button>
          </div>
        </form>
      </section>

      <section className={`status ${errorState ? "error" : ""}`} role="status" aria-live={errorState ? "assertive" : "polite"} aria-atomic="true">
        <strong>Status</strong>
        <p>{stateMessage(state)}</p>
        <p>{refreshStatus}</p>
        {warning && <p className="warning">{warning}</p>}
      </section>

      {staleCandidate && (
        <section className="stale-consent" aria-labelledby="stale-consent-title">
          <h2 id="stale-consent-title">Stored course data available</h2>
          <p>Current course data could not be retrieved. Stored OpenStreetMap data from {staleCandidate.recordDate} is available but may be stale.</p>
          <div className="actions">
            <button type="button" onClick={renderStaleData}>Render stored course data</button>
            <button className="secondary" type="button" onClick={() => setStaleCandidate(null)}>Cancel</button>
          </div>
        </section>
      )}

      {(state.kind === "success" || state.kind === "empty") && (
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
              <section className="map-workspace" aria-labelledby="map-workspace-title">
                <div className="map-selection">
                  <h3 id="map-workspace-title">Selected-hole map</h3>
                  {normalized && normalized.holes.length > 0 && (
                    <label>Hole
                      <select value={selectedHoleKey} onChange={(event) => setSelectedHoleKey(event.target.value)}>
                        {normalized.holes.map((hole) => (
                          <option key={hole.source.sourceKey} value={hole.source.sourceKey}>
                            {hole.number === null ? hole.source.sourceKey : `Hole ${hole.number}`}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
                {normalized && normalized.holes.length > 0 ? (
                  <>
                    {normalized.holes.filter((hole) => hole.source.sourceKey === selectedHoleKey).map((hole) => (
                      <HoleMap key={hole.source.sourceKey} hole={hole} warnings={normalized.warnings} source={normalized.source}
                        project={holeProject(hole.source.sourceKey)}
                        onProjectChange={(project) => setHoleProject(hole.source.sourceKey, project)} />
                    ))}
                  </>
                ) : <p className="map-empty" role="status">No normalized holes are available to render.</p>}
                {normalized && normalized.holes.length > 0 && (
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
                )}
                <section className="source-export" aria-labelledby="source-export-title">
                  <h3 id="source-export-title">OpenStreetMap source data</h3>
                  <p className="hint">Raw GIS source exports contain exact OpenStreetMap response evidence only. They do not include project targets, carries, notes, or normalized map geometry.</p>
                  {activeSourceEvidence?.consentState === "stale-consented" && (
                    <p className="warning">This export will contain stale OpenStreetMap data rendered with your consent.</p>
                  )}
                  <div className="actions">
                    <button type="button" onClick={exportGisSource} disabled={!canExportGisSource}>Download Raw GIS Source (ODbL)</button>
                  </div>
                  {sourceExportMessage && <p aria-live="polite">{sourceExportMessage}</p>}
                </section>
              </section>
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
        <p className="attribution">Data © OpenStreetMap contributors, available under ODbL. <a href={OSM_COPYRIGHT_URL}>OpenStreetMap copyright and license</a>. Durable cache marks OSM geometry as ODbL-covered for internal provenance only and does not satisfy later source-export obligations.</p>
      )}
    </main>
  );
}
