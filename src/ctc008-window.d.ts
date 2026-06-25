import type * as pdf from "./ctc008Pdf";
import type * as scene from "./ctc008Scene";

declare global {
  interface Window {
    ctc008Experiment: {
      analyzeCtc008Pdf: typeof pdf.analyzeCtc008Pdf;
      createCtc008ExportScene: typeof scene.createCtc008ExportScene;
      ctc008DownloadFilename: typeof pdf.ctc008DownloadFilename;
      renderCtc008PageToCanvas: typeof pdf.renderCtc008PageToCanvas;
      renderCtc008Pdf: typeof pdf.renderCtc008Pdf;
    };
  }
}

export {};
