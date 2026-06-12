import { useEffect, useMemo, useState, type KeyboardEvent, type PointerEvent } from "react";
import type {
  Coordinate,
  Geometry,
  NormalizationWarning,
  NormalizedHole,
} from "./normalize";
import type { SourceMetadata } from "./overpass";
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
  warningsForHole,
  type Projection,
  type ViewportPoint,
} from "./map";

type HoleMapProps = {
  hole: NormalizedHole;
  warnings: NormalizationWarning[];
  source: SourceMetadata;
};

type Measurement = { start: Coordinate | null; end: Coordinate | null };

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

export function HoleMap({ hole, warnings, source }: HoleMapProps) {
  const projection = useMemo(() => createProjection(holeCoordinates(hole)), [hole]);
  const [measurement, setMeasurement] = useState<Measurement>({ start: null, end: null });
  const [crosshair, setCrosshair] = useState<ViewportPoint>({ x: 400, y: 300 });
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    setMeasurement({ start: null, end: null });
    setCrosshair({ x: 400, y: 300 });
    setAnnouncement("Selected hole changed. Measurement cleared.");
  }, [hole.source.sourceKey]);

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
    placeAnchor(point);
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
      placeAnchor(crosshair);
    } else if (event.key === "Escape") {
      event.preventDefault();
      clearMeasurement();
    }
  }

  const startPoint = measurement.start ? projectCoordinate(projection, measurement.start) : null;
  const endPoint = measurement.end ? projectCoordinate(projection, measurement.end) : null;

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
      <p className="map-instructions">Click or tap two map points. Keyboard: arrows move the crosshair, Enter or Space selects, Escape clears.</p>
      <svg className="hole-map" data-testid="hole-vector-map"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="xMidYMid meet"
        tabIndex={0} role="group" aria-label="Selected hole vector map and measurement surface"
        onPointerDown={handlePointer} onKeyDown={handleKey}>
        <title>Selected hole vector map</title>
        <desc>Blank vector-only OpenStreetMap-derived golf hole geometry with two-point measurement controls.</desc>
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
        <g data-layer="measurement" className="map-layer layer-measurement">
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
