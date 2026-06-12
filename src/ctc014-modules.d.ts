declare module "blob-stream" {
  type BlobStream = NodeJS.WritableStream & {
    toBlob(type: string): Blob;
    on(event: "finish" | "error", callback: (...args: unknown[]) => void): BlobStream;
  };
  export default function blobStream(): BlobStream;
}

declare module "svg-to-pdfkit" {
  import type PDFDocument from "pdfkit";
  export default function SVGtoPDF(
    document: PDFDocument,
    svg: string | SVGElement,
    x?: number,
    y?: number,
    options?: Record<string, unknown>,
  ): void;
}

declare module "pdfkit" {
  export default class PDFDocument {
    constructor(options?: Record<string, unknown>);
    pipe<T>(stream: T): T;
    end(): void;
    font(name: string): this;
    fontSize(size: number): this;
    text(text: string, x: number, y: number, options?: Record<string, unknown>): this;
    strokeColor(color: string): this;
    fillColor(color: string): this;
    lineWidth(width: number): this;
    dash(length: number, options?: Record<string, unknown>): this;
    circle(x: number, y: number, radius: number): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    closePath(): this;
    fillAndStroke(): this;
    fill(): this;
    stroke(): this;
  }
}
