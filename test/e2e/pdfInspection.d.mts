// Node-only inspection keeps ambient Node types out of the browser application.
export function readFile(path: string, encoding?: string): Promise<any>;
export function buffer(value: string): any;
export function sha256(value: Uint8Array): string;
export function inspectObjects(bytes: Uint8Array): number;
export function inspectPdf(bytes: Uint8Array): Promise<{
  objects: number; text: string;
  pages: { text: string; paths: number; images: number; evenOdd: number; dashes: number[][]; png: any; interiorGray: number; areaGray: number }[];
}>;
