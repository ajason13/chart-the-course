import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { verifyCompliance } from "./verify-compliance.mjs";

function evidence() {
  const path = "node_modules/react";
  const lockText = JSON.stringify({ packages: { [path]: { version: "19.2.7" } } });
  return {
    lockText,
    inventory: { lockSha256: createHash("sha256").update(lockText).digest("hex"),
      packages: [{ path, name: "react", version: "19.2.7" }] },
    sbom: { components: [{ name: "react", version: "19.2.7", licenses: [{ license: { id: "MIT" } }],
      properties: [{ name: "cdx:npm:package:path", value: path }] }] },
    licenses: { "react@19.2.7": { licenses: "MIT" } },
    audit: { auditReportVersion: 2, metadata: { vulnerabilities: { high: 0, critical: 0 } } }
  };
}

test("production evidence must cover every locked package at its exact version", () => {
  verifyCompliance(evidence());
  let data = evidence();
  data.sbom.components = [];
  assert.throws(() => verifyCompliance(data), /SBOM missing locked package/);
  data = evidence();
  data.sbom.components[0].version = "19.2.0";
  assert.throws(() => verifyCompliance(data), /SBOM missing locked package/);
  data = evidence();
  data.sbom.components[0].name = "other";
  assert.throws(() => verifyCompliance(data), /SBOM package identity mismatch/);
  data = evidence();
  data.licenses = {};
  assert.throws(() => verifyCompliance(data), /license evidence missing/);
  data = evidence();
  data.inventory.packages.push({ path: "node_modules/experiment", name: "experiment", version: "1.0.0" });
  assert.throws(() => verifyCompliance(data), /outside production evidence/);
  data = evidence();
  data.lockText += "\n";
  assert.throws(() => verifyCompliance(data), /must match the current lockfile/);
  data = evidence();
  data.audit.metadata.vulnerabilities.high = 1;
  assert.throws(() => verifyCompliance(data), /High production vulnerabilities/);
  data = evidence();
  data.audit = { error: { summary: "Registry unavailable" } };
  assert.throws(() => verifyCompliance(data), /failed production audit evidence/);
});
