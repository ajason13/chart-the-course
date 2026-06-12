import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type {
  Coordinate,
  Geometry,
  NormalizationWarning,
  NormalizedHole,
  SourceKey,
} from "./normalize";
import type { SourceMetadata } from "./overpass";
import { carryRings, teeOrigins } from "./carry";
import { generateProjectId, type CarryOriginV1, type HoleStateV1, type TargetV1 } from "./project";
import {
  INNER_MAX_X,
  INNER_MAX_Y,
  INNER_MIN_X,
  INNER_MIN_Y,
  LAYER_ORDER,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  clampPoint,
  createProjection,
  distanceMeters,
  formatDistance,
  geometryCoordinates,
  holeCoordinates,
  inverseProject,
  projectCoordinate,
  scaleBar,
  validCoordinate,
  warningsForHole,
  type Projection,
  type ViewportPoint,
} from "./map";

type HoleMapProps = {
  hole: NormalizedHole;
  warnings: NormalizationWarning[];
  source: SourceMetadata;
  project: HoleStateV1;
  onProjectChange: (project: HoleStateV1) => void;
};

type Measurement = { start: Coordinate | null; end: Coordinate | null };
type Mode = "measure" | "place-target" | "reposition-target";

function geometryElement(
  geometry: Geometry,
  projection: Projection,
  key: string,
  className: string,
) {
  const points = geometryCoordinates(geometry).map((coordinate) => projectCoordinate(projection, coordinate));
  if (geometry.type === "point") {
    return <circle key={key} className={className} cx={points[0].x} cy={points[0].y} r="7" />;
  }
  const value = points.map(({ x, y }) => `${x},${y}`).join(" ");
  return geometry.type === "line"
    ? <polyline key={key} className={className} points={value} />
    : <polygon key={key} className={className} points={value} />;
}

function warningText(warning: NormalizationWarning): string {
  return `${warning.code}: ${warning.affectedIdentity}`;
}

export function HoleMap({ hole, warnings, source, project, onProjectChange }: HoleMapProps) {
  const projection = useMemo(() => createProjection(holeCoordinates(hole)), [hole]);
  const [measurement, setMeasurement] = useState<Measurement>({ start: null, end: null });
  const [crosshair, setCrosshair] = useState<ViewportPoint>({ x: 400, y: 300 });
  const [announcement, setAnnouncement] = useState("");
  const [mode, setMode] = useState<Mode>("measure");
  const [repositionId, setRepositionId] = useState<string | null>(null);
  const [lastDeleted, setLastDeleted] = useState<{ target: TargetV1; index: number } | null>(null);
  const [carryErrors, setCarryErrors] = useState<Record<string, string>>({});
  const [targetErrors, setTargetErrors] = useState<Record<string, string>>({});
  const undoButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMeasurement({ start: null, end: null });
    setCrosshair({ x: 400, y: 300 });
    setMode("measure");
    setRepositionId(null);
    setLastDeleted(null);
    setAnnouncement("Selected hole changed. Measurement cleared.");
  }, [hole.source.sourceKey]);

  useEffect(() => {
    if (lastDeleted) requestAnimationFrame(() => undoButton.current?.focus());
  }, [lastDeleted]);

  if ("kind" in projection) {
    return <p className="map-empty" role="status">No renderable geometry is available for this selected hole.</p>;
  }

  const selectedWarnings = warningsForHole(hole, warnings);
  const bar = scaleBar(projection);
  const distance = measurement.start && measurement.end
    ? distanceMeters(measurement.start, measurement.end)
    : null;
  const distanceLabel = typeof distance === "number" ? formatDistance(distance) : null;

  function placeAnchor(point: ViewportPoint) {
    if ("kind" in projection) return;
    const coordinate = inverseProject(projection, clampPoint(point));
    setMeasurement((current) => {
      if (!current.start || current.end) {
        setAnnouncement(current.end ? "Measurement restarted. First point placed." : "First point placed.");
        return { start: coordinate, end: null };
      }
      const measured = distanceMeters(current.start, coordinate);
      setAnnouncement(typeof measured === "number" ? `Distance: ${formatDistance(measured)}.` : "Measurement failed.");
      return { start: current.start, end: coordinate };
    });
  }

  function confirmTarget(point: ViewportPoint) {
    if ("kind" in projection) return;
    const coordinate = inverseProject(projection, clampPoint(point));
    if (!validCoordinate(coordinate)) {
      setAnnouncement("Placement coordinates out of range.");
      return;
    }
    if (mode === "place-target") {
      if (project.targets.length >= 10) {
        setAnnouncement("At most ten targets are allowed per hole.");
        return;
      }
      const target: TargetV1 = {
        id: generateProjectId("target"),
        label: `Target ${project.targets.length + 1}`,
        ...coordinate,
      };
      onProjectChange({ ...project, targets: [...project.targets, target] });
      setLastDeleted(null);
      setMode("measure");
      setAnnouncement(`${target.label} added.`);
    } else if (mode === "reposition-target" && repositionId) {
      const target = project.targets.find(({ id }) => id === repositionId);
      onProjectChange({
        ...project,
        targets: project.targets.map((entry) => entry.id === repositionId ? { ...entry, ...coordinate } : entry),
      });
      setLastDeleted(null);
      setMode("measure");
      setRepositionId(null);
      setAnnouncement(`${target?.label ?? "Target"} repositioned.`);
    }
  }

  function pointerPoint(event: PointerEvent<SVGSVGElement>): ViewportPoint | null {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return null;
    const point = event.currentTarget.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const logical = point.matrixTransform(matrix.inverse());
    return clampPoint({ x: logical.x, y: logical.y });
  }

  function handlePointer(event: PointerEvent<SVGSVGElement>) {
    if (!event.isPrimary) return;
    const point = pointerPoint(event);
    if (!point) return;
    setCrosshair(point);
    if (mode === "measure") placeAnchor(point);
    else confirmTarget(point);
  }

  function clearMeasurement() {
    setMeasurement({ start: null, end: null });
    setCrosshair({ x: 400, y: 300 });
    setAnnouncement("Measurement cleared.");
  }

  function handleKey(event: KeyboardEvent<SVGSVGElement>) {
    const steps: Record<string, ViewportPoint> = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
    };
    const direction = steps[event.key];
    if (direction) {
      event.preventDefault();
      const step = event.shiftKey ? 20 : 4;
      setCrosshair((current) => clampPoint({
        x: current.x + direction.x * step,
        y: current.y + direction.y * step,
      }));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (mode === "measure") placeAnchor(crosshair);
      else confirmTarget(crosshair);
    } else if (event.key === "Escape") {
      event.preventDefault();
      if (mode === "measure") clearMeasurement();
      else {
        setMode("measure");
        setRepositionId(null);
        setAnnouncement("Target placement cancelled.");
      }
    }
  }

  const startPoint = measurement.start ? projectCoordinate(projection, measurement.start) : null;
  const endPoint = measurement.end ? projectCoordinate(projection, measurement.end) : null;
  const carryModels = project.carries.map((carry) => ({ carry, rings: carryRings(carry, hole, project.targets, projection) }));
  const clipId = `map-inner-clip-${hole.source.sourceKey.replace("/", "-")}`;
  const availableTees = teeOrigins(hole);

  function changeTargetLabel(id: string, label: string): boolean {
    const trimmed = label.trim();
    if (!trimmed || [...trimmed].length > 40) {
      setTargetErrors((current) => ({ ...current, [id]: "Use a label from 1 to 40 characters." }));
      return false;
    }
    onProjectChange({ ...project, targets: project.targets.map((target) => target.id === id ? { ...target, label: trimmed } : target) });
    setTargetErrors((current) => ({ ...current, [id]: "" }));
    setLastDeleted(null);
    return true;
  }

  function deleteTarget(id: string) {
    const index = project.targets.findIndex((entry) => entry.id === id);
    if (index === -1) return;
    const target = project.targets[index];
    onProjectChange({ ...project, targets: project.targets.filter((entry) => entry.id !== id) });
    setLastDeleted({ target, index });
    setAnnouncement(`${target.label} deleted. Undo available.`);
  }

  function addCarry() {
    if (project.carries.length >= 5) return;
    const origin: CarryOriginV1 | null = availableTees[0]
      ? { kind: "tee", sourceKey: availableTees[0].sourceKey }
      : project.targets[0] ? { kind: "target", targetId: project.targets[0].id } : null;
    if (!origin) {
      setAnnouncement("Add a target or load tee geometry before adding carry arcs.");
      return;
    }
    onProjectChange({ ...project, carries: [...project.carries, { id: generateProjectId("carry"), origin, distances: [150] }] });
    setLastDeleted(null);
    setAnnouncement("Carry arc added.");
  }

  function updateCarryOrigin(id: string, value: string) {
    const separator = value.indexOf(":");
    const kind = value.slice(0, separator);
    const identity = value.slice(separator + 1);
    const origin: CarryOriginV1 = kind === "tee"
      ? { kind: "tee", sourceKey: identity as SourceKey }
      : { kind: "target", targetId: identity };
    onProjectChange({ ...project, carries: project.carries.map((carry) => carry.id === id ? { ...carry, origin } : carry) });
    setLastDeleted(null);
  }

  function updateCarryDistances(id: string, value: string): boolean {
    const distances = value.split(",").map((item) => Number(item.trim()));
    if (distances.length < 1 || distances.length > 5 || distances.some((distance) => !Number.isInteger(distance) || distance < 1 || distance > 700)
      || new Set(distances).size !== distances.length || distances.some((distance, index) => index > 0 && distance <= distances[index - 1])) {
      setCarryErrors((current) => ({ ...current, [id]: "Use 1 to 5 unique ascending whole-yard distances from 1 to 700." }));
      return false;
    }
    onProjectChange({ ...project, carries: project.carries.map((carry) => carry.id === id ? { ...carry, distances } : carry) });
    setCarryErrors((current) => ({ ...current, [id]: "" }));
    setLastDeleted(null);
    return true;
  }

  return (
    <section className="hole-map-panel" aria-labelledby="hole-map-title">
      <div className="map-heading">
        <div>
          <p className="eyebrow">Selected hole</p>
          <h3 id="hole-map-title">{hole.number === null ? hole.source.sourceKey : `Hole ${hole.number}`}</h3>
        </div>
        <button className="secondary" type="button" onClick={clearMeasurement}
          disabled={!measurement.start && !measurement.end}>Clear measurement</button>
      </div>
      <div className="map-tools" aria-label="Map interaction mode">
        <button className={mode === "measure" ? "" : "secondary"} type="button" onClick={() => setMode("measure")}>Measure</button>
        <button className={mode === "place-target" ? "" : "secondary"} type="button"
          onClick={() => { setMode("place-target"); setRepositionId(null); setAnnouncement("Place target mode."); }}>Add target</button>
      </div>
      <p className="map-instructions">{mode === "measure" ? "Click or tap two map points." : "Click, tap, or use the keyboard crosshair to place the target."} Keyboard: arrows move the crosshair, Enter or Space selects, Escape clears or cancels.</p>
      <svg className="hole-map" data-testid="hole-vector-map"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="xMidYMid meet"
        tabIndex={0} role="group" aria-label="Selected hole vector map and measurement surface"
        onPointerDown={handlePointer} onKeyDown={handleKey}>
        <title>Selected hole vector map</title>
        <desc>Blank vector-only OpenStreetMap-derived golf hole geometry with two-point measurement controls.</desc>
        <defs><clipPath id={clipId}><rect x={INNER_MIN_X} y={INNER_MIN_Y}
          width={INNER_MAX_X - INNER_MIN_X} height={INNER_MAX_Y - INNER_MIN_Y} /></clipPath></defs>
        <rect className="map-inner-boundary" x={INNER_MIN_X} y={INNER_MIN_Y}
          width={INNER_MAX_X - INNER_MIN_X} height={INNER_MAX_Y - INNER_MIN_Y} />
        {LAYER_ORDER.map((kind) => (
          <g key={kind} data-layer={kind} className={`map-layer layer-${kind}`}>
            {hole.features.filter((feature) => feature.kind === kind && feature.geometry)
              .map((feature) => geometryElement(feature.geometry!, projection, feature.source.sourceKey, "map-feature"))}
          </g>
        ))}
        <g data-layer="route" className="map-layer layer-route">
          {hole.route && geometryElement(hole.route, projection, hole.source.sourceKey, "map-route")}
        </g>
        <g data-layer="carry-arcs" className="map-layer layer-carry-arcs" clipPath={`url(#${clipId})`}>
          {carryModels.flatMap(({ carry, rings }) => Array.isArray(rings) ? rings.flatMap((ring) => {
            const label = ring.points.reduce((top, point) => point.y < top.y ? point : top);
            return [
              ...ring.segments.map((segment, index) => <polyline key={`${carry.id}-${ring.yards}-${index}`} data-carry-id={carry.id}
                className="carry-arc" points={segment.map(({ x, y }) => `${x},${y}`).join(" ")} />),
              <text key={`${carry.id}-${ring.yards}-label`} className="carry-label" x={label.x} y={label.y - 6}>
                {ring.yards} yd
              </text>,
            ];
          }) : [])}
        </g>
        <g data-layer="targets" className="map-layer layer-targets">
          {project.targets.map((target) => {
            const point = projectCoordinate(projection, target);
            return <g key={target.id} className="target-marker" data-target-id={target.id} role="button" tabIndex={0}
              aria-label={`${target.label}, target`} onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => { event.stopPropagation(); setAnnouncement(`${target.label} selected.`); }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault(); event.stopPropagation(); setAnnouncement(`${target.label} selected.`);
                }
              }}>
              <circle className="target-hit" cx={point.x} cy={point.y} r="22" />
              <circle className="target-outer" cx={point.x} cy={point.y} r="8" />
              <circle className="target-inner" cx={point.x} cy={point.y} r="3" />
            </g>;
          })}
        </g>
        <g data-layer="measurement" className={`map-layer layer-measurement ${mode === "measure" ? "" : "inactive"}`}>
          {startPoint && endPoint && <line className="measurement-line" x1={startPoint.x} y1={startPoint.y} x2={endPoint.x} y2={endPoint.y} />}
          {startPoint && <circle className="measurement-anchor" cx={startPoint.x} cy={startPoint.y} r="8" />}
          {endPoint && <circle className="measurement-anchor" cx={endPoint.x} cy={endPoint.y} r="8" />}
          <path className="keyboard-crosshair" d={`M ${crosshair.x - 8} ${crosshair.y} H ${crosshair.x + 8} M ${crosshair.x} ${crosshair.y - 8} V ${crosshair.y + 8}`} />
        </g>
        <g className="scale-bar" aria-label={`Scale ${bar.label}`}>
          <line x1={INNER_MIN_X} y1={INNER_MAX_Y - 18} x2={INNER_MIN_X + bar.logicalLength} y2={INNER_MAX_Y - 18} />
          <text x={INNER_MIN_X} y={INNER_MAX_Y - 24}>{bar.label}</text>
        </g>
      </svg>
      <p className="measurement-result" aria-live="polite">
        {distanceLabel ? `Distance: ${distanceLabel}` : measurement.start ? "Select the second point." : "No measurement selected."}
      </p>
      <span className="sr-only" aria-live="polite">{announcement}</span>
      <section className="project-panel" aria-labelledby="targets-title">
        <div className="map-heading">
          <h4 id="targets-title">Targets</h4>
          {lastDeleted && <button ref={undoButton} className="secondary" type="button" onClick={() => {
            onProjectChange({
              ...project,
              targets: [
                ...project.targets.slice(0, lastDeleted.index),
                lastDeleted.target,
                ...project.targets.slice(lastDeleted.index),
              ],
            });
            setAnnouncement(`${lastDeleted.target.label} restored.`);
            setLastDeleted(null);
          }}>Undo delete</button>}
        </div>
        {project.targets.length === 0 ? <p>No targets added.</p> : <ul className="target-list">
          {project.targets.map((target) => <li key={target.id}>
            <label>Target label<input key={`${target.id}-${target.label}`} defaultValue={target.label} maxLength={40}
              onBlur={(event) => { if (!changeTargetLabel(target.id, event.currentTarget.value)) event.currentTarget.value = target.label; }}
              onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} /></label>
            {targetErrors[target.id] && <p className="warning">{targetErrors[target.id]}</p>}
            <div className="actions">
              <button className="secondary" type="button" onClick={() => {
                setMode("reposition-target"); setRepositionId(target.id);
                setCrosshair(projectCoordinate(projection, target)); setAnnouncement(`Repositioning ${target.label}.`);
              }}>Reposition</button>
              <button className="secondary danger" type="button" onClick={() => deleteTarget(target.id)}>Delete</button>
            </div>
          </li>)}
        </ul>}
      </section>
      <section className="project-panel" aria-labelledby="carry-title">
        <div className="map-heading"><h4 id="carry-title">Carry arcs</h4>
          <button className="secondary" type="button" disabled={project.carries.length >= 5} onClick={addCarry}>Add carry</button></div>
        {availableTees.length === 0 && <p className="warning">No tee geometry available for this hole.</p>}
        {project.carries.length === 0 ? <p>No carry arcs added.</p> : <ul className="carry-list">
          {project.carries.map((carry) => {
            const model = carryModels.find((entry) => entry.carry.id === carry.id)?.rings;
            return <li key={carry.id}>
              <label>Origin<select value={`${carry.origin.kind}:${carry.origin.kind === "tee" ? carry.origin.sourceKey : carry.origin.targetId}`}
                onChange={(event) => updateCarryOrigin(carry.id, event.target.value)}>
                {availableTees.map((tee) => <option key={tee.sourceKey} value={`tee:${tee.sourceKey}`}>Tee {tee.sourceKey}</option>)}
                {project.targets.map((target) => <option key={target.id} value={`target:${target.id}`}>{target.label}</option>)}
              </select></label>
              <label>Distances in yards<input key={`${carry.id}-${carry.distances.join("-")}`} defaultValue={carry.distances.join(", ")}
                onBlur={(event) => { if (!updateCarryDistances(carry.id, event.currentTarget.value)) event.currentTarget.value = carry.distances.join(", "); }} /></label>
              {carryErrors[carry.id] && <p className="warning">{carryErrors[carry.id]}</p>}
              {!Array.isArray(model) && <p className="warning">Carry origin no longer available.</p>}
              {Array.isArray(model) && model.some(({ offMap }) => offMap) && <p className="warning">Part of this carry arc is outside the map view.</p>}
              <button className="secondary danger" type="button" onClick={() =>
                onProjectChange({ ...project, carries: project.carries.filter((entry) => entry.id !== carry.id) })}>Delete carry</button>
            </li>;
          })}
        </ul>}
      </section>
      {selectedWarnings.length > 0 && (
        <div className="map-warnings">
          <strong>Selected-hole data warnings</strong>
          <ul>{selectedWarnings.map((warning) => <li key={`${warning.code}-${warning.affectedIdentity}`}>{warningText(warning)}</li>)}</ul>
        </div>
      )}
      <details>
        <summary>All normalization warnings ({warnings.length})</summary>
        {warnings.length === 0 ? <p>No normalization warnings.</p>
          : <ul>{warnings.map((warning) => <li key={`${warning.code}-${warning.affectedIdentity}`}>{warningText(warning)}</li>)}</ul>}
      </details>
      <p className="attribution">Course data © OpenStreetMap contributors. <a href={source.copyrightUrl}>OpenStreetMap copyright and license</a>.</p>
    </section>
  );
}
