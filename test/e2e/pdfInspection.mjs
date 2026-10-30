import { createHash } from "node:crypto";
import { expect } from "@playwright/test";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "@napi-rs/canvas";
import { inflateSync } from "node:zlib";
/** Parse the classic xref/object syntax produced by our restricted jsPDF path.
 * Strings (including hostile-looking labels) and stream bytes are not names.
 * Reject unsupported object streams rather than overlooking hidden objects. */
export function inspectObjects(bytes) {
    const raw = Buffer.from(bytes).toString("latin1");
    const xrefAt = Number(/startxref\s+(\d+)\s+%%EOF\s*$/.exec(raw)?.[1]);
    expect(raw.slice(xrefAt, xrefAt + 4)).toBe("xref");
    const table = /^xref\s+0 (\d+)\s+([\s\S]*?)trailer\s*(<<[\s\S]*?>>)/.exec(raw.slice(xrefAt));
    expect(table).not.toBeNull();
    const entries = table[2].trim().split(/\r?\n/);
    expect(entries).toHaveLength(Number(table[1]));
    const forbidden = new Set(["OpenAction", "AA", "A", "JS", "JavaScript", "Launch", "AcroForm", "Annots", "EmbeddedFiles", "EmbeddedFile", "Filespec", "RichMedia", "XFA", "URI", "GoToR", "GoToE", "SubmitForm", "ImportData", "Encrypt", "ObjStm", "XRef", "Image", "Movie", "Sound", "Collection"]);
    function names(syntax) {
        const found = [];
        let depth = 0;
        for (let i = 0; i < syntax.length;) {
            const char = syntax[i];
            if (/\s/.test(char)) {
                i++;
                continue;
            }
            if (char === "%") {
                while (i < syntax.length && !/[\r\n]/.test(syntax[i]))
                    i++;
                continue;
            }
            if (char === "(") {
                let nested = 1;
                i++;
                while (nested && i < syntax.length) {
                    const c = syntax[i++];
                    if (c === "\\")
                        i++;
                    else if (c === "(")
                        nested++;
                    else if (c === ")")
                        nested--;
                }
                expect(nested).toBe(0);
                continue;
            }
            if (syntax.slice(i, i + 2) === "<<") {
                depth++;
                i += 2;
                continue;
            }
            if (syntax.slice(i, i + 2) === ">>") {
                depth--;
                expect(depth).toBeGreaterThanOrEqual(0);
                i += 2;
                continue;
            }
            if (char === "<") {
                const end = syntax.indexOf(">", i + 1);
                expect(end).toBeGreaterThan(i);
                expect(syntax.slice(i + 1, end)).toMatch(/^[\da-f\s]*$/i);
                i = end + 1;
                continue;
            }
            if (char === "/") {
                const match = /^\/([^\s/<>\[\](){}%]+)/.exec(syntax.slice(i));
                expect(match).not.toBeNull();
                const name = match[1].replace(/#([\da-f]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
                expect(forbidden.has(name), `Forbidden object name ${name}`).toBe(false);
                found.push(name);
                i += match[0].length;
                continue;
            }
            i++;
        }
        expect(depth).toBe(0);
        return found;
    }
    names(table[3]);
    let inspected = 0;
    for (let i = 1; i < entries.length; i++) {
        expect(entries[i]).toMatch(/^\d{10} 00000 n\s*$/);
        const offset = Number(entries[i].slice(0, 10));
        const tail = raw.slice(offset);
        expect(tail.startsWith(`${i} 0 obj`)).toBe(true);
        let body = tail.slice(tail.indexOf("obj") + 3);
        const stream = /^([\s\S]*?)\bstream\r?\n/.exec(body);
        if (stream && stream.index < body.indexOf("endobj") && stream[0].length < body.indexOf("endobj")) {
            const dictionary = stream[1];
            names(dictionary);
            const length = /\/Length\s+(\d+)\s*(?:\/|>>)/.exec(dictionary);
            expect(length).not.toBeNull();
            const payload = body.slice(stream[0].length, stream[0].length + Number(length[1]));
            expect(body.slice(stream[0].length + payload.length)).toMatch(/^\r?\nendstream\s+endobj/);
            // Only page content streams are supported. Decompression also validates
            // lengths/filter encoding; content isn't reinterpreted as object syntax.
            if (/\/Filter/.test(dictionary)) {
                expect(dictionary).toContain("/FlateDecode");
                inflateSync(Buffer.from(payload, "latin1"));
            }
        }
        else {
            const end = body.indexOf("endobj");
            expect(end).toBeGreaterThan(0);
            body = body.slice(0, end);
            names(body);
        }
        inspected++;
    }
    expect(inspected).toBeGreaterThan(5);
    return inspected;
}
export async function inspectPdf(bytes) {
    const objects = inspectObjects(bytes);
    const task = getDocument({ data: new Uint8Array(bytes), standardFontDataUrl: `${process.cwd()}/node_modules/pdfjs-dist/standard_fonts/` });
    const pdf = await task.promise;
    expect(await pdf.getJSActions()).toBeNull();
    expect(await pdf.getOpenAction()).toBeNull();
    expect(await pdf.getAttachments()).toBeNull();
    expect(await pdf.getFieldObjects()).toBeNull();
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        expect([viewport.width, viewport.height]).toEqual([612, 792]);
        expect(await page.getAnnotations()).toEqual([]);
        expect(await page.getJSActions()).toBeNull();
        const content = await page.getTextContent();
        const text = content.items.map(item => "str" in item ? item.str : "").join("");
        const operators = await page.getOperatorList();
        const paths = operators.fnArray.filter(op => op === OPS.constructPath).length;
        const images = operators.fnArray.filter(op => [OPS.paintImageXObject, OPS.paintInlineImageXObject, OPS.paintImageMaskXObject, OPS.paintImageXObjectRepeat, OPS.paintImageMaskXObjectRepeat].includes(op)).length;
        // PDF.js 6 folds fill/stroke into constructPath's first operand.
        const evenOdd = operators.fnArray.filter((op, n) => op === OPS.eoFillStroke || op === OPS.eoFill || op === OPS.constructPath && [OPS.eoFill, OPS.eoFillStroke].includes(operators.argsArray[n][0])).length;
        const dashes = operators.argsArray.filter((_, n) => operators.fnArray[n] === OPS.setDash).map(args => args[0]);
        const canvas = createCanvas(612, 792);
        await page.render({ canvas: canvas, canvasContext: canvas.getContext("2d"), viewport }).promise;
        pages.push({ text, paths, images, evenOdd, dashes, png: canvas.toBuffer("image/png"), interiorGray: canvas.getContext("2d").getImageData(260, 380, 1, 1).data[0], areaGray: canvas.getContext("2d").getImageData(300, 380, 1, 1).data[0] });
    }
    await task.destroy();
    return { objects, pages, text: pages.map(p => p.text).join("\n") };
}
export { readFile } from "node:fs/promises";
export const buffer = value => Buffer.from(value);
export const sha256 = value => createHash("sha256").update(value).digest("hex");
