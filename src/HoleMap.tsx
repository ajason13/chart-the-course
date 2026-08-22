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
import { dispersionEllipse } from "./dispersion";
import { estimateFairwayWidth, roundHalfUpNonnegative } from "./fairwayWidth";
import { scoreTargetRisks } from "./riskScore";
import { generateProjectId, type CarryOriginV1, type ClubProfileV2, type ClubV2, type HoleStateV1, type TargetV1 } from "./project";
import {
  INNER_MAX_X,
  INNER_MAX_Y,
  INNER_MIN_X,
  INNER_MIN_Y,
  LAYER_ORDER,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  YARDS_PER_METER,
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
  clubProfile: ClubProfileV2;
  onClubProfileChange: (profile: ClubProfileV2) => void;
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

export function HoleMap({ hole, warnings, source, project, onProjectChange, clubProfile, onClubProfileChange }: HoleMapProps) {
  const projection = useMemo(() => createProjection(holeCoordinates(hole)), [hole]);
  const [measurement, setMeasurement] = useState<Measurement>({ start: null, end: null });
  const [crosshair, setCrosshair] = useState<ViewportPoint>({ x: 400, y: 300 });
  const [announcement, setAnnouncement] = useState("");
  const [mode, setMode] = useState<Mode>("measure");
  const [repositionId, setRepositionId] = useState<string | null>(null);
  const [lastDeleted, setLastDeleted] = useState<{ target: TargetV1; index: number } | null>(null);
  const [carryErrors, setCarryErrors] = useState<Record<string, string>>({});
  const [targetErrors, setTargetErrors] = useState<Record<string, string>>({});
  const [clubErrors, setClubErrors] = useState<Record<string, string>>({});
  const [dispersionOrigin, setDispersionOrigin] = useState<CarryOriginV1 | null>(null);
  const [dispersionTargetId, setDispersionTargetId] = useState<string | null>(null);
  const [dispersionClubId, setDispersionClubId] = useState<string | null>(null);
  const [fairwayYards, setFairwayYards] = useState(250);
  const undoButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMeasurement({ start: null, end: null });
    setCrosshair({ x: 400, y: 300 });
    setMode("measure");
    setRepositionId(null);
    setLastDeleted(null);
    setFairwayYards(250);
    setDispersionOrigin(null);
    setDispersionTargetId(null);
    setDispersionClubId(null);
    setAnnouncement("Selected hole changed. Measurement cleared.");
  }, [hole.source.sourceKey]);

  useEffect(() => {
    setDispersionClubId((current) => clubProfile.clubs.some(({ id }) => id === current) ? current : clubProfile.clubs[0]?.id ?? null);
  }, [clubProfile.clubs]);

  useEffect(() => {
    setDispersionTargetId((current) => project.targets.some(({ id }) => id === current) ? current : project.targets[0]?.id ?? null);
    setDispersionOrigin((current) => {
      if (current?.kind === "tee" && teeOrigins(hole).some(({ sourceKey }) => sourceKey === current.sourceKey)) return current;
      if (current?.kind === "target" && project.targets.some(({ id }) => id === current.targetId)) return current;
      const tee = teeOrigins(hole)[0];
      return tee ? { kind: "tee", sourceKey: tee.sourceKey } : project.targets[0] ? { kind: "target", targetId: project.targets[0].id } : null;
    });
  }, [hole, project.targets]);

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
  const selectedClub = clubProfile.clubs.find(({ id }) => id === dispersionClubId);
  const selectedDispersionTarget = project.targets.find(({ id }) => id === dispersionTargetId);
  const dispersion = dispersionEllipse({
    club: selectedClub,
    origin: dispersionOrigin,
    target: selectedDispersionTarget,
    hole,
    targets: project.targets,
    projection,
  });
  const dispersionStatus: Record<string, string> = {
    "projection-unavailable": "Dispersion unavailable because map projection is unavailable.",
    "origin-unavailable": "Select an available tee or target as the dispersion origin.",
    "target-unavailable": "Select a target for the dispersion guide.",
    "club-unavailable": "Add or select a club for the dispersion guide.",
    "degenerate-target-line": "Dispersion unavailable because the origin and target are too close together.",
  };
  const riskComparison = scoreTargetRisks({
    club: selectedClub,
    origin: dispersionOrigin,
    hole,
    projection,
    targets: project.targets,
  });
  const fairwayWidth = estimateFairwayWidth(hole, fairwayYards);
  const fairwayOverlay = fairwayWidth.start && fairwayWidth.end ? {
    start: projectCoordinate(projection, fairwayWidth.start), end: projectCoordinate(projection, fairwayWidth.end),
  } : null;
  const fairwayWarningCopy: Record<string, string> = {
    "missing-fairway": "No usable fairway polygon is mapped for this hole.",
    "invalid-target-line": "The mapped target line is not usable for a fairway-width estimate.",
    "carry-beyond-target-line": "This carry is beyond the mapped target line.",
    "target-line-outside-fairway": "The target line at this carry does not fall inside a mapped fairway.",
    "irregular-fairway-polygon": "Some mapped fairway outlines are irregular; their width was not used.",
    "irregular-fairway-intersections": "Some mapped fairway outlines are irregular; their width was not used.",
    "tangent-fairway-boundary": "The fairway boundary only touches or overlaps this width line; the estimate may be unavailable.",
    "unstable-line-fairway-overlap": "The fairway boundary only touches or overlaps this width line; the estimate may be unavailable.",
    "unstable-degenerate-width": "The mapped fairway crossing is too small to estimate reliably at this carry.",
    "split-fairway": "Multiple fairway sections cross this line; only the section containing the target line is measured.",
  };

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

  function addClub() {
    if (clubProfile.clubs.length >= 14) return;
    const used = new Set(clubProfile.clubs.map(({ label }) => label.normalize("NFC").toLowerCase()));
    let number = clubProfile.clubs.length + 1;
    while (used.has(`club ${number}`)) number += 1;
    const club: ClubV2 = { id: generateProjectId("club"), label: `Club ${number}`, carry: 150, longitudinal: 30, lateral: 20 };
    onClubProfileChange({ clubs: [...clubProfile.clubs, club] });
    setDispersionClubId(club.id);
    setAnnouncement(`${club.label} added to the club profile.`);
  }

  function updateClub(id: string, field: keyof Omit<ClubV2, "id">, raw: string): boolean {
    const key = `${id}-${field}`;
    let value: string | number;
    if (field === "label") {
      value = raw.trim().normalize("NFC");
      const comparison = value.toLowerCase();
      if (!value || [...value].length > 40 || clubProfile.clubs.some((club) => club.id !== id && club.label.normalize("NFC").toLowerCase() === comparison)) {
        const message = !value || [...value].length > 40
          ? "Use a club name from 1 to 40 characters."
          : "Club names must be unique, ignoring case.";
        setClubErrors((current) => ({ ...current, [key]: message }));
        setAnnouncement(message);
        return false;
      }
    } else {
      value = Number(raw.trim());
      const maximum = field === "carry" ? 700 : 200;
      if (!/^\d+$/.test(raw.trim()) || !Number.isInteger(value) || value < 1 || value > maximum) {
        const message = `Use a whole-yard ${field} value from 1 to ${maximum}.`;
        setClubErrors((current) => ({ ...current, [key]: message }));
        setAnnouncement(message);
        return false;
      }
    }
    onClubProfileChange({ clubs: clubProfile.clubs.map((club) => club.id === id ? { ...club, [field]: value } : club) });
    setClubErrors((current) => ({ ...current, [key]: "" }));
    setAnnouncement("Club profile updated.");
    return true;
  }

  function changeDispersionOrigin(value: string) {
    const separator = value.indexOf(":");
    const identity = value.slice(separator + 1);
    setDispersionOrigin(value.startsWith("tee:")
      ? { kind: "tee", sourceKey: identity as SourceKey }
      : { kind: "target", targetId: identity });
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
        <g data-layer="fairway-width" className="map-layer layer-fairway-width" clipPath={`url(#${clipId})`}>
          {fairwayOverlay && <>
            <line className="fairway-width-line" x1={fairwayOverlay.start.x} y1={fairwayOverlay.start.y} x2={fairwayOverlay.end.x} y2={fairwayOverlay.end.y} />
            <line className="fairway-width-tick" x1={fairwayOverlay.start.x - 5} y1={fairwayOverlay.start.y - 5} x2={fairwayOverlay.start.x + 5} y2={fairwayOverlay.start.y + 5} />
            <line className="fairway-width-tick" x1={fairwayOverlay.end.x - 5} y1={fairwayOverlay.end.y - 5} x2={fairwayOverlay.end.x + 5} y2={fairwayOverlay.end.y + 5} />
          </>}
        </g>
        <g data-layer="dispersion" className="map-layer layer-dispersion" clipPath={`url(#${clipId})`}>
          {!("kind" in dispersion) && <polygon className="dispersion-ellipse"
            points={dispersion.points.map(({ x, y }) => `${x},${y}`).join(" ")}
            role="img" aria-label={`${selectedClub!.label} dispersion guide: ${selectedClub!.carry} yard carry, ${selectedClub!.longitudinal} yard longitudinal full width, ${selectedClub!.lateral} yard lateral full width`} />}
        </g>
        <g data-layer="targets" className="map-layer layer-targets">
          {project.targets.map((target) => {
            const point = projectCoordinate(projection, target);
            return <g key={target.id} className="target-marker" data-target-id={target.id} role="button" tabIndex={0}
              aria-label={`${target.label}, target`} onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => { event.stopPropagation(); setDispersionTargetId(target.id); setAnnouncement(`${target.label} selected.`); }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault(); event.stopPropagation(); setDispersionTargetId(target.id); setAnnouncement(`${target.label} selected.`);
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
      <section className="project-panel fairway-width-panel" aria-labelledby="fairway-width-title">
        <h4 id="fairway-width-title">Fairway width</h4>
        <div className="map-tools" aria-label="Fairway width carry distance">
          {[220, 250, 280].map((yards) => <button key={yards} type="button" className={fairwayYards === yards ? "" : "secondary"}
            aria-pressed={fairwayYards === yards} onClick={() => setFairwayYards(yards)}>{yards} yd</button>)}
        </div>
        {typeof fairwayWidth.widthMeters === "number"
          ? <p className="measurement-result">Fairway width at {fairwayYards} yd: {roundHalfUpNonnegative(fairwayWidth.widthMeters * YARDS_PER_METER)} yd ({roundHalfUpNonnegative(fairwayWidth.widthMeters)} m).</p>
          : <p className="measurement-result">No fairway-width estimate at {fairwayYards} yd.</p>}
        <div className="fairway-width-status" role="status" aria-live="polite">
          {fairwayWidth.warnings.map((warning) => <p className="warning" key={warning}>{fairwayWarningCopy[warning]}</p>)}
        </div>
        <p className="hint">Outline-derived local estimate only; it does not account for hazards or playability.</p>
      </section>
      <section className="project-panel dispersion-panel" aria-labelledby="dispersion-title">
        <div className="map-heading"><h4 id="dispersion-title">Club profile and dispersion</h4>
          <button className="secondary" type="button" disabled={clubProfile.clubs.length >= 14} onClick={addClub}>Add club</button></div>
        <p className="hint">Local dispersion guide only; it is not a shot recommendation or confidence estimate.</p>
        <p className="hint">The club profile is saved only in an exported project file. Loading a different course clears unsaved profile data.</p>
        {clubProfile.clubs.length === 0 ? <p>No clubs added.</p> : <ul className="club-list">
          {clubProfile.clubs.map((club) => <li key={club.id}>
            <label>Club name<input key={`${club.id}-label-${club.label}`} defaultValue={club.label} maxLength={40}
              onBlur={(event) => { if (!updateClub(club.id, "label", event.currentTarget.value)) event.currentTarget.value = club.label; }}
              onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} /></label>
            {clubErrors[`${club.id}-label`] && <p className="warning">{clubErrors[`${club.id}-label`]}</p>}
            {(["carry", "longitudinal", "lateral"] as const).map((field) => <label key={field}>
              {field === "carry" ? "Carry yards" : field === "longitudinal" ? "Longitudinal full width yards" : "Lateral full width yards"}
              <input key={`${club.id}-${field}-${club[field]}`} inputMode="numeric" defaultValue={club[field]}
                onBlur={(event) => { if (!updateClub(club.id, field, event.currentTarget.value)) event.currentTarget.value = String(club[field]); }}
                onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} />
              {clubErrors[`${club.id}-${field}`] && <span className="warning">{clubErrors[`${club.id}-${field}`]}</span>}
            </label>)}
            <button className="secondary danger" type="button" onClick={() => {
              onClubProfileChange({ clubs: clubProfile.clubs.filter(({ id }) => id !== club.id) });
              setAnnouncement(`${club.label} deleted from the club profile.`);
            }}>Delete club</button>
          </li>)}
        </ul>}
        <div className="dispersion-controls">
          <label>Dispersion origin<select value={dispersionOrigin ? `${dispersionOrigin.kind}:${dispersionOrigin.kind === "tee" ? dispersionOrigin.sourceKey : dispersionOrigin.targetId}` : ""}
            onChange={(event) => changeDispersionOrigin(event.target.value)} disabled={availableTees.length === 0 && project.targets.length === 0}>
            <option value="" disabled>Select origin</option>
            {availableTees.map((tee) => <option key={tee.sourceKey} value={`tee:${tee.sourceKey}`}>Tee {tee.sourceKey}</option>)}
            {project.targets.map((target) => <option key={target.id} value={`target:${target.id}`}>{target.label}</option>)}
          </select></label>
          <label>Dispersion target<select value={dispersionTargetId ?? ""} onChange={(event) => setDispersionTargetId(event.target.value)} disabled={project.targets.length === 0}>
            <option value="" disabled>Select target</option>
            {project.targets.map((target) => <option key={target.id} value={target.id}>{target.label}</option>)}
          </select></label>
          <label>Dispersion club<select value={dispersionClubId ?? ""} onChange={(event) => setDispersionClubId(event.target.value)} disabled={clubProfile.clubs.length === 0}>
            <option value="" disabled>Select club</option>
            {clubProfile.clubs.map((club) => <option key={club.id} value={club.id}>{club.label}</option>)}
          </select></label>
        </div>
        <div className="dispersion-status" role="status" aria-live="polite">
          {"kind" in dispersion
            ? <p>{dispersionStatus[dispersion.kind]}</p>
            : dispersion.offMap ? <p className="warning">Part of this dispersion guide is outside the map view.</p>
              : <p>{selectedClub!.label} dispersion guide shown.</p>}
        </div>
      </section>
      <section className="project-panel risk-panel" aria-labelledby="risk-title">
        <h4 id="risk-title">Mapped-risk indicator</h4>
        <p className="hint">This comparison uses the selected dispersion origin and club.</p>
        <div className="risk-status" role="status" aria-live="polite" aria-atomic="true">
          {riskComparison.candidates.length === 0
            ? <p>Add a target to compare mapped-risk indicators.</p>
            : riskComparison.warnings.includes("missing-risk-geometry")
              ? <p className="warning">No usable mapped golf-water geometry is available for this hole.</p>
              : riskComparison.warnings.some((warning) => ["projection-unavailable", "origin-unavailable", "club-unavailable"].includes(warning))
                ? <p>{"kind" in dispersion ? `${dispersionStatus[dispersion.kind]} Mapped-risk comparison is unavailable.` : "Mapped-risk comparison is unavailable."}</p>
                : <p>{riskComparison.lowestRiskTargetId === null
                  ? "Mapped-risk comparison is unavailable."
                  : "Mapped-risk comparison shown."}</p>}
          {riskComparison.warnings.includes("irregular-risk-polygon") && <p className="warning">Some mapped golf-water outlines were not usable.</p>}
        </div>
        {riskComparison.candidates.length > 0 && <ul className="risk-list">
          {riskComparison.candidates.map((candidate) => <li key={candidate.targetId}>
            <strong>{candidate.targetLabel}<span className="sr-only">, target {candidate.targetId}</span></strong>
            {candidate.penalty !== null
              ? <p>{candidate.targetId === riskComparison.lowestRiskTargetId && <strong>Lowest mapped-overlap target. </strong>}
                Mapped golf-water overlap: {candidate.penalty}%. {candidate.status} mapped-risk indicator.</p>
              : candidate.warnings.includes("off-map")
                ? <p className="warning">{candidate.targetLabel}: mapped-risk overlap is unavailable because this dispersion guide extends outside the map view.</p>
                : <p>Mapped-risk overlap is unavailable.</p>}
          </li>)}
        </ul>}
        <p className="hint">This local indicator considers only mapped golf-water geometry. It is not a shot recommendation, coaching, safety, or rules determination. Mapped geometry may be incomplete or inaccurate. Verify yardages, hazards, boundaries, and local course rules before play.</p>
      </section>
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
