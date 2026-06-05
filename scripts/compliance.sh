#!/usr/bin/env sh
set -eu

npm ci
npx @cyclonedx/cyclonedx-npm \
  --omit dev \
  --output-format JSON \
  --output-file sbom.json \
  --validate
# license-checker-rseidelsohn rejects --onlyAllow and --failOn in one
# invocation, so the runnable gate enforces the accepted policy in two passes.
npx license-checker-rseidelsohn \
  --production \
  --excludePrivatePackages \
  --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;OFL-1.1;CC0-1.0;Unlicense;0BSD"
npx license-checker-rseidelsohn \
  --production \
  --excludePrivatePackages \
  --failOn "GPL-2.0-only;GPL-3.0-only;AGPL-3.0;UNLICENSED"
npm audit --omit=dev --audit-level=high
