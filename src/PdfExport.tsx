import { useEffect, useRef, useState } from "react";
import demoText from "../fixtures/overpass/synthetic-golf-course-ctc006.json?raw";
import { buildGisSourceExport, type ActiveSourceEvidence } from "./gisSourceExport";
import type { Bbox } from "./overpass";
import type { NormalizationResult, SourceKey } from "./normalize";
import type { ProjectV2 } from "./project";
import { createPdfScene, type PdfSceneInput } from "./pdfScene";
import { pdfFontMetrics, renderPdf } from "./pdfRenderer";

type Props = {
  normalized: NormalizationResult; courseSourceKey: SourceKey; selectedHoleKey: string;
  project: ProjectV2; synthetic: boolean; evidence: ActiveSourceEvidence | null;
  context: { query: string; bbox: Bbox } | null; refreshing: boolean;
};
type Package = { pdf: ArrayBuffer; source: string; sourceFilename: string; pdfFilename: string };

export function PdfExport(props: Props) {
  const [selection, setSelection] = useState<SourceKey[]>([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [prepared, setPrepared] = useState<{ key: string; package: Package } | null>(null);
  // Serialize the full workspace, not only authored content: refresh/consent and
  // source changes invalidate even when the visible geometry looks identical.
  const workspace = JSON.stringify(props);
  const selectionScope = JSON.stringify([props.courseSourceKey, props.selectedHoleKey, props.normalized.source, props.normalized.holes.map(h => h.source.sourceKey)]);
  const [selectionWorkspace, setSelectionWorkspace] = useState("");
  const selected = selectionWorkspace === selectionScope ? selection : props.selectedHoleKey ? [props.selectedHoleKey as SourceKey] : [];
  const key = JSON.stringify([workspace, selected]);
  const current = useRef(key);
  current.current = key;
  const generation = useRef(0);
  useEffect(() => {
    generation.current++;
    setPrepared(null); setBusy(false); setStatus("");
    return () => { generation.current++; };
  }, [key]);
  const urls = useRef(new Set<string>());
  useEffect(() => {
    const activeUrls = urls.current;
    return () => { activeUrls.forEach(url => URL.revokeObjectURL(url)); activeUrls.clear(); };
  }, [key]);
  const ready = prepared?.key === key ? prepared.package : null;
  const source = props.synthetic ? null : buildGisSourceExport(props.evidence, props.context);
  const available = props.synthetic || source?.ok === true;

  async function prepare() {
    const capturedKey = key;
    const id = ++generation.current;
    setPrepared(null); setBusy(true); setStatus("Preparing PDF and matching source locally.");
    try {
      const exportedAt = new Date().toISOString();
      const built = props.synthetic ? null : buildGisSourceExport(props.evidence, props.context, exportedAt);
      let sourceInput: PdfSceneInput["source"];
      if (props.synthetic) sourceInput = { kind: "synthetic", fixtureId: "synthetic-golf-course-ctc006.json", text: demoText };
      else {
        if (!built?.ok || !props.evidence || !props.context) throw new Error(built && !built.ok ? built.message : "Source unavailable.");
        sourceInput = { kind: "live", envelope: built.envelope, text: built.text, evidence: props.evidence, context: props.context };
      }
      const result = await createPdfScene({ normalized: props.normalized, courseSourceKey: props.courseSourceKey,
        selectedHoleKeys: selected, project: props.project, source: sourceInput, exportedAt, appVersion: "0.0.0" }, pdfFontMetrics());
      if (current.current !== capturedKey || generation.current !== id) return;
      if (!result.ok) throw new Error(`${result.field}: ${result.message}`);
      const pdf = renderPdf(result.scene);
      if (current.current !== capturedKey || generation.current !== id) return;
      const compact = exportedAt.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
      setPrepared({ key: capturedKey, package: { pdf, source: result.scene.source.text,
        sourceFilename: result.scene.source.filename, pdfFilename: `ctc-yardage-${compact}.pdf` } });
      setStatus("PDF and matching source are ready. Download both files and share the source with PDF recipients.");
    } catch (error) {
      if (current.current === capturedKey && generation.current === id) setStatus(`Export failed: ${error instanceof Error ? error.message : "Unable to prepare files."} Your edits are retained; retry when ready.`);
    } finally {
      if (current.current === capturedKey && generation.current === id) setBusy(false);
    }
  }
  function download(kind: "pdf" | "source") {
    if (!ready || props.refreshing) return;
    let url: string | undefined;
    let anchor: HTMLAnchorElement | undefined;
    try {
      const blob = kind === "pdf" ? new Blob([ready.pdf], { type: "application/pdf" })
        : new Blob([ready.source], { type: "application/json;charset=utf-8" });
      url = URL.createObjectURL(blob); urls.current.add(url);
      anchor = document.createElement("a");
      anchor.href = url; anchor.download = kind === "pdf" ? ready.pdfFilename : ready.sourceFilename;
      document.body.appendChild(anchor); anchor.click();
      setStatus(`${kind === "pdf" ? "PDF" : "Matching source"} download started. Confirm the file was saved; download and share both files together.`);
    } catch (error) {
      setStatus(`Download failed: ${error instanceof Error ? error.message : "Unable to start download."} Your edits and prepared files are retained; retry.`);
    } finally {
      const downloadUrl = url;
      const downloadAnchor = anchor;
      setTimeout(() => {
        downloadAnchor?.remove();
        if (downloadUrl && urls.current.delete(downloadUrl)) URL.revokeObjectURL(downloadUrl);
      }, 1000);
    }
  }
  return <section className="project-io" aria-labelledby="pdf-export-title">
    <h3 id="pdf-export-title">Printable yardage book</h3>
    <p>Select up to 36 holes. The PDF includes current targets and carries; clubs, notes and analysis are excluded. Non-ASCII names use visible code-point escapes.</p>
    <fieldset><legend>Holes to print</legend>{props.normalized.holes.map(hole => {
      const holeKey = hole.source.sourceKey;
      return <label key={holeKey}><input type="checkbox" checked={selected.includes(holeKey)}
        onChange={event => { setSelectionWorkspace(selectionScope); setSelection(event.target.checked ? [...selected, holeKey] : selected.filter(k => k !== holeKey)); }} />
        Hole {hole.number ?? "unnumbered"} ({holeKey})</label>;
    })}</fieldset>
    <p>{props.synthetic ? "Synthetic demo — not live OSM data. The matching download is the exact bundled fixture (Apache-2.0 project)."
      : "Download both the PDF and its matching raw GIS source. Share that exact source file with PDF recipients; downloads do not automatically deliver it to others."}</p>
    {props.evidence?.consentState === "stale-consented" && <p className="warning">Stale source from {props.evidence.source.completedAt}; the PDF records the completion date and source age.</p>}
    {!available && <p role="status">{source && !source.ok ? source.message : "Source unavailable."}</p>}
    <div className="actions">
      <button type="button" onClick={() => void prepare()} disabled={busy || props.refreshing || !available || selected.length < 1 || selected.length > 36}>Prepare yardage book</button>
      <button type="button" onClick={() => download("pdf")} disabled={!ready || props.refreshing}>Download PDF</button>
      <button type="button" onClick={() => download("source")} disabled={!ready || props.refreshing}>{props.synthetic ? "Download matching synthetic source" : "Download matching Raw GIS Source (ODbL)"}</button>
    </div>
    <p role="status" aria-live="polite">{status}</p>
  </section>;
}
