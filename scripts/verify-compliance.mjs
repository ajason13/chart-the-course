import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function verifyCompliance({ inventory, lockText, sbom, licenses, audit }) {
  assert.equal(inventory.lockSha256, createHash("sha256").update(lockText).digest("hex"),
    "Runtime inventory must match the current lockfile; rebuild production");
  const lock = JSON.parse(lockText);
  const production = Object.entries(lock.packages).filter(([path, item]) =>
    path && !item.dev && !item.devOptional && !item.link);
  const sbomPaths = new Map((sbom.components ?? []).flatMap((item) =>
    (item.properties ?? []).filter((p) => p.name === "cdx:npm:package:path")
      .map((p) => [p.value, item])));
  for (const [path, entry] of production) {
    const component = sbomPaths.get(path);
    assert.equal(component?.version, entry.version, `Production SBOM missing locked package: ${path}`);
    const name = path.split("node_modules/").at(-1);
    const componentName = component.group ? `${component.group}/${component.name}` : component.name;
    assert.equal(componentName, name, `Production SBOM package identity mismatch: ${path}`);
    const license = licenses[`${name}@${entry.version}`];
    assert.ok(license?.licenses, `Production license evidence missing: ${path}`);
    assert.ok(component.licenses?.length, `SBOM license evidence missing: ${path}`);
  }
  for (const pkg of inventory.packages) {
    const entry = lock.packages[pkg.path];
    assert.ok(entry && !entry.dev && !entry.devOptional && !entry.link,
      `Runtime package outside production evidence: ${pkg.path}`);
    assert.equal(entry.version, pkg.version, `Runtime version mismatch: ${pkg.path}`);
    assert.equal(pkg.name, pkg.path.split("node_modules/").at(-1), `Runtime package name mismatch: ${pkg.path}`);
  }
  assert.ok(!audit.error && audit.auditReportVersion === 2 && audit.metadata?.vulnerabilities,
    "Missing or failed production audit evidence");
  assert.equal(audit.metadata.vulnerabilities.high, 0, "High production vulnerabilities");
  assert.equal(audit.metadata.vulnerabilities.critical, 0, "Critical production vulnerabilities");
  console.log(`Production evidence covers ${inventory.packages.length} emitted runtime packages and ${production.length} locked production packages.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const json = (path) => JSON.parse(readFileSync(path, "utf8"));
  verifyCompliance({
    inventory: json("dist/.vite/runtime-dependencies.json"),
    lockText: readFileSync("package-lock.json", "utf8"),
    sbom: json(".compliance/sbom.json"),
    licenses: json(".compliance/licenses.json"),
    audit: json(".compliance/audit.json")
  });
}
