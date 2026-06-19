# Security Policy

## Reporting Vulnerabilities

Use GitHub private vulnerability reporting for Chart the Course security reports
until the project has a verified, monitored security contact.

GitHub private vulnerability reporting was enabled for
`ajason13/chart-the-course` on 2026-06-05.

Do not publish `security@chartthecourse.app` or any other project email address
until that mailbox exists, is monitored, and has an owner. Setting a monitored
security contact before v1.0 is a launch-blocking milestone item.

## Supported Versions

Chart the Course has not shipped a public release yet. Security fixes apply to
the active `main` branch once the repository is published.

## Security Scope

Security review should include:

- Browser-only handling of course selections, notes, and player profiles.
- OpenStreetMap, Overpass, Nominatim, tile-provider, and PDF-export request
  flows.
- Browser-local IndexedDB storage for Overpass raw responses and source
  metadata. This cache is same-origin browser storage, may be evicted or
  unavailable in restricted/private contexts, and must not store account data,
  telemetry identifiers, API keys, or unrelated user-authored project data.
- Dependency license and vulnerability gates.
- Generated PDF attribution and raw GIS source export behavior once PDF export
  ships.

The app must not rely on custom browser `User-Agent` headers for API identity.
Use app origin/referrer where available plus Overpass QL identifying comments.
If durable cache storage fails, the app may degrade to non-durable in-memory
storage for the active session only; this fallback must not be treated as
persistent source availability.
