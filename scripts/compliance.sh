#!/usr/bin/env sh
set -eu

# Delegate to package.json so the compliance flow has one maintained source.
# Run `npm ci` first, or use `npm run build:sbom` for a clean install path.
npm run compliance
