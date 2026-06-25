import {
  analyzeCtc008Pdf,
  ctc008DownloadFilename,
  renderCtc008PageToCanvas,
  renderCtc008Pdf,
} from "./ctc008Pdf";
import { createCtc008ExportScene } from "./ctc008Scene";

function downloadPrototypePdf() {
  const pdf = renderCtc008Pdf();
  const bytes = new ArrayBuffer(pdf.byteLength);
  new Uint8Array(bytes).set(pdf);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = ctc008DownloadFilename("2026-06-25T00:00:00.000Z");
  document.body.appendChild(anchor);
  anchor.click();
  requestAnimationFrame(() => {
    URL.revokeObjectURL(url);
    anchor.remove();
  });
  document.getElementById("ctc008-status")!.textContent = "Prototype PDF export started.";
}

document.getElementById("ctc008-download")?.addEventListener("click", downloadPrototypePdf);

window.ctc008Experiment = {
  analyzeCtc008Pdf,
  createCtc008ExportScene,
  ctc008DownloadFilename,
  renderCtc008PageToCanvas,
  renderCtc008Pdf,
};
