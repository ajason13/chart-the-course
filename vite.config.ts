import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { productionLicenseAsset } from "./scripts/production-licenses.mjs";
import { runtimeInventory } from "./scripts/runtime-inventory.mjs";

export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === "experiments" ? [] : [runtimeInventory(), productionLicenseAsset()]), {
    name: "exclude-production-experiments",
    generateBundle() {
      if (mode === "experiments") return;
      for (const id of this.getModuleIds()) {
        if (/\/node_modules\/jspdf\//i.test(id) && !/\/node_modules\/jspdf\/dist\/jspdf\.es\.min\.js$/.test(id)) {
          this.error(`Only the approved jsPDF browser ES module is allowed: ${id}`);
        }
        if (/\/(?:ctc008|ctc014)[^/]*|\/node_modules\/(?:pdfjs-dist|pdfkit|svg-to-pdfkit|svg2pdf\.js|blob-stream)\//i.test(id)) {
          this.error(`Experiment module is forbidden in production: ${id}`);
        }
      }
    }
  }],
  worker: mode === "experiments" ? undefined : {
    plugins: () => [{
      name: "exclude-production-workers",
      buildStart() { this.error("Production worker builds require separate dependency provenance"); }
    }]
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: false
  },
  build: {
    outDir: mode === "experiments" ? "dist-experiments" : "dist",
    manifest: true,
    rollupOptions: {
      input: mode === "experiments"
        ? ["ctc014.html", "ctc008.html"]
        : "index.html"
    }
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"]
  }
}));
