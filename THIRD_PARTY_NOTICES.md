# Third-Party Notices

This scaffold contains no production runtime dependencies yet.

## Original Project License

Original Chart the Course code is licensed under Apache-2.0. See `LICENSE`.

## Dependency Notice Policy

Production dependencies must be reviewed before adoption and tracked through the
SBOM and license scanner. Preserve upstream copyright notices, license files,
NOTICE files, and attribution text required by dependency licenses.

Allowed production dependency licenses for the automated compliance gate:

```text
MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;OFL-1.1;CC0-1.0;Unlicense;0BSD
```

The scanner must fail on:

```text
GPL-2.0-only;GPL-3.0-only;AGPL-3.0;UNLICENSED
```

Packages reporting bare `Public Domain` require manual review and must not be
treated as automatically allowed.

## Current Compliance Command

```bash
npm ci
npx @cyclonedx/cyclonedx-npm \
  --omit dev \
  --output-format JSON \
  --output-file sbom.json \
  --validate
npx license-checker-rseidelsohn \
  --production \
  --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;OFL-1.1;CC0-1.0;Unlicense;0BSD" \
  --failOn "GPL-2.0-only;GPL-3.0-only;AGPL-3.0;UNLICENSED"
npm audit --omit=dev --audit-level=high
```

Do not run `npm ci --omit=dev` before invoking a devDependency SBOM tool. Do not
use `--package-lock-only` in the authoritative SBOM command.

The runnable npm scripts enforce the license policy in two
`license-checker-rseidelsohn` passes because the tool rejects `--onlyAllow` and
`--failOn` in the same invocation. They also pass `--excludePrivatePackages`
because this scanner reports the unpublished private root package as
`UNLICENSED` even though `package.json` declares Apache-2.0 and `LICENSE` is
present.

## Future Production Dependencies

Before adding MapLibre, Turf, PDF libraries, fonts, map tiles, geocoding
providers, or analytics tooling, update this file with:

- Package or provider name.
- Version or provider plan.
- License and notice obligations.
- Attribution text shown in-app or in generated PDFs.
- Compliance verification date.
