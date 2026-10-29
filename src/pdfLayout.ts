// Shared page constants are also used by the fixed synthetic PDF experiment.
export const LETTER_WIDTH_PT = 612;
export const LETTER_HEIGHT_PT = 792;
export const PAGE_MARGIN_PT = 36;
export const MAP_REGION = { x: 36, y: 96, width: 540, height: 390 } as const;
export const PDF_LIMITS = { holes: 36, pages: 128, vertices: 100_000, primitives: 20_000, bytes: 10 * 1024 * 1024 } as const;

export type TextWeight = "normal" | "bold";
// Application-owned font metrics, never deserialized from project/source data.
export type PdfTextMetrics = { width(text: string, size: number, weight: TextWeight): number };

export class PdfPreflightError extends Error {
  constructor(public field: string, message: string) { super(message); }
}

export function checkPdfBudget(field: "holes" | "pages" | "vertices" | "primitives" | "bytes", count: number): void {
  if (!Number.isSafeInteger(count) || count < 0 || count > PDF_LIMITS[field]) {
    throw new PdfPreflightError(field, `Export exceeds ${PDF_LIMITS[field]} ${field}; select fewer holes or a smaller source area.`);
  }
}

export function pdfText(value: string, field: string, maximum = 10_000): { text: string; escaped: boolean } {
  if (typeof value !== "string") throw new PdfPreflightError(field, "Expected text.");
  const normalized = value.normalize("NFC").replace(/[\t\r\n]/g, " ");
  if ([...normalized].length > maximum) throw new PdfPreflightError(field, `Text exceeds ${maximum} code points.`);
  if (/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069\ud800-\udfff]/u.test(normalized)) {
    throw new PdfPreflightError(field, "Unsupported control, bidi control or lone surrogate.");
  }
  const text = [...normalized].map(c => c.codePointAt(0)! <= 126 ? c
    : `[U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}]`).join("");
  return { text, escaped: text !== normalized };
}

// Character wrapping preserves every character, including long identifiers.
// Joining the lines reproduces the complete searchable row without ellipsis.
export function wrapPdfText(text: string, metrics: PdfTextMetrics, size = 10, weight: TextWeight = "normal", width = 540): string[] {
  const lines: string[] = [];
  let line = "";
  for (const char of text) {
    const measured = metrics.width(line + char, size, weight);
    if (!Number.isFinite(measured) || measured < 0) throw new PdfPreflightError("metrics", "Invalid font measurement.");
    if (measured > width) {
      if (!line || metrics.width(char, size, weight) > width) throw new PdfPreflightError("layout", "A character cannot fit the text column.");
      lines.push(line);
      line = char;
    } else line += char;
  }
  lines.push(line);
  return lines;
}
