import { existsSync, readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const workflow = readFileSync(".github/workflows/ci.yml", "utf8");
const indexHtml = readFileSync("index.html", "utf8");

for (const group of ["dependencies", "devDependencies"]) {
  for (const [name, version] of Object.entries(packageJson[group] ?? {})) {
    if (!/^\d+\.\d+\.\d+(-[\w.-]+)?$/.test(version)) {
      throw new Error(`${group}.${name} must use an exact version; found ${version}`);
    }
  }
}

if (packageJson.engines?.node !== ">=24 <25") {
  throw new Error("package.json must enforce the Node 24 LTS baseline.");
}

if (!indexHtml.includes('src="/src/main.tsx"') || indexHtml.includes('src="/src/main.ts"')) {
  throw new Error("index.html must use only the React TSX bootstrap.");
}

if (existsSync("src/main.ts")) {
  throw new Error("The stale vanilla TypeScript bootstrap src/main.ts must be removed.");
}

if (!workflow.includes("permissions:\n  contents: read")) {
  throw new Error("CI must set read-only contents permissions.");
}

const actionReferences = [...workflow.matchAll(/uses:\s+[^@\s]+@([^\s#]+)/g)];
for (const reference of actionReferences) {
  if (!/^[a-f0-9]{40}$/.test(reference[1])) {
    throw new Error(`GitHub Action reference must be SHA-pinned; found ${reference[1]}`);
  }
}

console.log("Scaffold policy verification passed.");
