# Tooling advisory triage — issue #84

Assessment date: 2026-11-05 (America/Los_Angeles). Baseline: `25ee70d`.
Outcome: **findings remain unresolved**. Retain the current exact direct pins
and lockfile pending a compatible upstream fix or a separately verified tooling
migration. This is a bounded development-tooling residual-risk assessment, not
remediation, an audit suppression, or release approval.

## Reproduction and affected paths

Node 24.22.1 / npm 11.21.1 `npm run audit:all` reports nine moderate entries,
zero low/high/critical. These are two underlying advisories plus propagation
through seven parent packages, not nine independent defects:

| Advisory | Locked package | Affected range | Published patch |
| --- | --- | --- | --- |
| [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) | glob 10.5.0 | >=9.0.0 <=14.0.1 | 14.0.2 |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) | minimatch 9.0.9 | >=7.0.0 <11.0.1 | 11.0.1 |

Primary advisory pages and npm registry metadata were checked on the assessment
date. The first defect permits filesystem traversal after cancellation; the
second can amplify attacker-controlled patterns at optimization level 2 or above.

`npm explain glob` and `npm explain read-package-json`, corroborated by the
lockfile, identify both paths to the same root `node_modules/glob` and its
`node_modules/minimatch` dependency:

```text
license-checker-rseidelsohn 4.4.2 (dev)
  → read-installed-packages 2.0.1
  → read-package-json 6.0.4
  → glob 10.5.0 → minimatch 9.0.9

@cyclonedx/cyclonedx-npm 6.0.1 (dev)
  → libxmljs2 0.37.0 (optional)
  → node-gyp 11.5.0
  → make-fetch-happen 14.0.3
  → cacache 19.0.1
  → glob 10.5.0 → minimatch 9.0.9
```

CycloneDX also reaches optional libxmljs2 through
`@cyclonedx/cyclonedx-library@10.1.1`'s optional peer. The nine audit entries are
these two CycloneDX packages, libxmljs2, node-gyp, make-fetch-happen, cacache,
read-package-json, glob and minimatch. The license-checker branch is not optional;
omitting optional packages would not resolve both findings and would change the
installed tool capabilities.

## Reachability and residual risk

Production and experiment source imports do not reference these packages.
They are development-only lockfile entries. The production inventory and
SBOM/license reconciliation enforce the separate distribution boundary described
in [artifact compliance](artifact-compliance.md). The production closure remains
26 packages, including optional production packages; npm audit's `prod` count
alone is not that complete inventory. Production audit reports zero advisories.
Neither application nor experiment input is passed to these tooling call sites.

The license checks execute read-package-json. Its `lib/read-json.js` calls glob
with fixed patterns (`*.gyp`, `{README,README.*}`, `**/*.[0-9]`, `**`), using
package directories as `cwd`, without `signal`. Package metadata can influence
the directories traversed, so this is not a general claim of safe handling of
untrusted packages.

The optional native libxmljs2 install/build path includes node-gyp's fetch/cache
dependencies. CycloneDX's XML validator uses libxmljs2; the repository generates
and validates JSON SBOMs. Cacache's `lib/verify.js` and `lib/rm.js` construct glob
patterns from cache paths with fixed suffixes and do not supply `signal`.
Node-gyp's own build globs use tinyglobby, a different package. A dependency path
does not prove that every routine in it executes during this repository's checks.

Glob 10.5.0 internally sets minimatch `optimizationLevel: 2`; the vulnerable
optimization is therefore reachable in these glob consumers. No inspected call
accepts a browser-supplied pattern or relies on AbortSignal to bound traversal.
The cancellation precondition and attacker-controlled pattern route were not
demonstrated in the current workflow. Cache paths and dependency metadata remain
local-tooling inputs, and malicious workspaces/packages could change that risk.
The unresolved impact is potential local CPU/memory/filesystem work, not proven
browser runtime exposure. Use the tools on the reviewed project/dependency tree;
this assessment does not certify arbitrary untrusted input.

## Why no resolution override or forced audit fix

Registry metadata on the assessment date lists glob 10.5.0 and minimatch 9.0.9
as the latest releases in their installed major lines. Both read-package-json
6.0.4 and cacache 19.0.1 require glob `^10.2.2`; glob requires minimatch `^9.0.4`.
Neither published patch satisfies these ranges. Even read-package-json's latest
7.0.1 still declares glob `^10.2.2`; libxmljs2's latest 0.37.0 retains node-gyp
`^11.2.0`. CycloneDX's latest direct release remains 6.0.1. License-checker's
latest release is 5.0.1, a major migration rather than a compatible transitive
resolution update; replacing that tool alone would not remove the optional
CycloneDX path.

An override to glob 14/minimatch 11 would bypass upstream compatibility ranges.
No such cross-major compatibility has been established here. npm audit proposes
a CycloneDX major downgrade to 4.0.1 for that branch; it is not a verified fix for
the repository's current evidence contract. Do not apply `npm audit fix --force`
or remove validation to make the report green. No dependency, audit threshold,
license exception or production exclusion changes are made by this assessment.

## Revalidation and next action

Keep the existing full-tree audit visible in CI; its high/critical failure
threshold is unchanged and a successful exit does not mean zero advisories.
Reassess when a patched compatible major-line release or parent migration is
available, when tool call sites/input trust change, or before release readiness
in #52. The scoped follow-up is to verify upgraded license/SBOM tooling together,
including their exact glob/minimatch closure, rather than silently accepting a
cross-major override. [Follow-up #86](https://github.com/ajason13/chart-the-course/issues/86)
tracks that migration; no implementation of it has started.

For every candidate, run Node 24/npm 11 clean `npm ci`, `npm run check`,
`npm run compliance`, `npm run audit:all` and `git diff --check`. Compare the
complete production lockfile set, runtime inventory and SBOM/license evidence;
require fresh-context Codex security review. Current verification evidence and
the PR/CI links belong in #84; generated reports remain ignored in `.compliance/`.
