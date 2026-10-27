import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { isAbsolute, posix, relative, resolve } from "node:path";

// Include the complete loaded module graph as a conservative bound: bundlers
// may inline constants and omit their originating module from chunk.modules.
export function runtimeInventory() {
  let root;
  return {
    name: "production-runtime-inventory",
    enforce: "pre",
    apply: "build",
    transform(code, id) {
      // Vite can inline new URL(..., import.meta.url) assets without loading
      // them as modules. The current app has no such asset construction.
      if (id !== "\0vite/preload-helper.js") assert.doesNotMatch(code, /\bimport\s*\.\s*meta\s*\.\s*url/,
        `Asset URL construction is not covered by production inventory: ${id}`);
      if (/\.css(?:$|\?)/i.test(id)) {
        // These paths bypass the JS graph. Fail closed until provenance for
        // imported stylesheets and CSS assets is implemented and reviewed.
        assert.doesNotMatch(code, /@import|url\s*\(|image-set\s*\(|\\/i,
          `CSS dependency syntax is not covered by production inventory: ${id}`);
      }
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        // Keep the HTML entry a module bootstrap. Vite can inline resource
        // attributes without representing their package origins in the graph.
        const elements = {
          html: /^<html(?:\s+lang=(["'])[a-z-]+\1)?\s*>$/i,
          head: /^<head\s*>$/i,
          title: /^<title\s*>$/i,
          body: /^<body\s*>$/i,
          div: /^<div\s+id=(["'])app\1\s*>$/i
        };
        for (const [opening, tag] of html.matchAll(/<([a-z][\w:-]*)\b[^>]*>/gi)) {
          const name = tag.toLowerCase();
          if (name === "meta" || name === "script") continue;
          assert.ok(elements[name]?.test(opening),
            "HTML elements and attributes must remain bootstrap elements; resources need dependency provenance");
        }
        for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
          assert.match(tag,
            /^<meta\s+(?:charset=(["'])[^"']+\1|name=(["'])(?:viewport|description)\2\s+content=(["'])[^"']*\3)\s*\/?\s*>$/i,
            "HTML metadata must remain bootstrap metadata; asset metadata needs dependency provenance");
        }
        for (const [tag] of html.matchAll(/<script\b[^>]*>/gi)) {
          assert.match(tag,
            /^<script\s+type=(["'])module\1\s+src=(["'])(?:\/(?!\/)|\.\/)[a-z0-9_./-]+\2\s*>$/i,
            "Production HTML scripts must be local module bootstraps");
        }
        const bootstrapRemoved = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
        assert.doesNotMatch(bootstrapRemoved,
          /\b(?:src|srcset|href|poster|data|style)\s*=|<style\b/i,
          "HTML resource references require separate dependency provenance");
      }
    },
    configResolved(config) { root = config.root; },
    generateBundle(_options, bundle) {
      const lockText = readFileSync(resolve(root, "package-lock.json"), "utf8");
      const lock = JSON.parse(lockText);
      const packages = new Map();
      const chunks = {};
      const recordModule = (id) => {
        const cleanId = id.replace(/^\0/, "").split("?")[0];
        assert.ok(!isAbsolute(cleanId) || !relative(root, cleanId).startsWith("../"),
          `Runtime module outside the repository: ${id}`);
        if (!cleanId.includes("/node_modules/")) return;
        const match = relative(root, cleanId).replaceAll("\\", "/")
          .match(/^(.*node_modules\/(?:@[^/]+\/)?[^/]+)(?:\/|$)/);
        assert.ok(match && !match[1].startsWith("../"), `Untracked runtime module: ${id}`);
        const path = match[1];
        const entry = lock.packages[path];
        assert.ok(entry && !entry.link && !entry.dev && !entry.devOptional,
          `Runtime package omitted by production compliance: ${path}`);
        const installed = JSON.parse(readFileSync(resolve(root, path, "package.json"), "utf8"));
        assert.equal(installed.version, entry.version, `Installed/locked version mismatch: ${path}`);
        packages.set(path, { path, name: installed.name, version: entry.version });
        return path;
      };
      for (const id of this.getModuleIds()) recordModule(id);

      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") continue;
        const checkImports = (node) => {
          if (!node || typeof node !== "object") return;
          if (node.type === "ImportExpression") {
            const source = node.source;
            const target = source.type === "Literal" ? source.value
              : source.type === "TemplateLiteral" && source.expressions.length === 0
                ? source.quasis[0].value.cooked : undefined;
            assert.equal(typeof target, "string", `Computed runtime imports are not covered: ${output.fileName}`);
            const dependency = posix.normalize(posix.join(posix.dirname(output.fileName), target));
            assert.ok(target.startsWith(".") && bundle[dependency]?.type === "chunk",
              `External dynamic imports are not covered: ${target}`);
          }
          for (const value of Object.values(node)) {
            if (Array.isArray(value)) value.forEach(checkImports);
            else if (value && typeof value === "object") checkImports(value);
          }
        };
        checkImports(this.parse(output.code));
        assert.equal(output.imports.filter((id) => !bundle[id]).length, 0,
          `External runtime imports are not covered: ${output.fileName}`);
        assert.equal(output.dynamicImports.filter((id) => !bundle[id]).length, 0,
          `External dynamic imports are not covered: ${output.fileName}`);
        const paths = new Set();
        for (const id of Object.keys(output.modules)) {
          const path = recordModule(id);
          if (path) paths.add(path);
        }
        chunks[output.fileName] = [...paths].sort();
      }
      this.emitFile({ type: "asset", fileName: ".vite/runtime-dependencies.json", source: JSON.stringify({
        lockSha256: createHash("sha256").update(lockText).digest("hex"),
        chunks,
        packages: [...packages.values()].sort((a, b) => a.path.localeCompare(b.path))
      }, null, 2) + "\n" });
    }
  };
}
