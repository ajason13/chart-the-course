import type * as experiment from "./ctc014Experiment";

declare global {
  interface Window {
    ctc014Experiment: {
      analyzePdf: typeof experiment.analyzePdf;
      renderJsPdfDirect: typeof experiment.renderJsPdfDirect;
      renderJsPdfSvg: typeof experiment.renderJsPdfSvg;
      renderPdfKitDirect: typeof experiment.renderPdfKitDirect;
      renderPdfKitSvg: typeof experiment.renderPdfKitSvg;
    };
  }
}

export {};
