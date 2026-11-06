# Native Windows verification

Issue [#75](https://github.com/ajason13/chart-the-course/issues/75) adds native
Windows verification alongside Linux. CI runs the same installation, scaffold,
build, unit/browser, compliance and full-tree audit gates on Ubuntu 24.04 and
Windows Server 2025. Windows uses PowerShell and npm's default Windows command
shell, without Git Bash, WSL or a custom npm `script-shell`. Both jobs install
Chromium and WebKit, retain the existing assertions and use separate OS-named
compliance and failure artifacts. The environment step records kernel version,
architecture, Node/npm versions and npm shell configuration in the job log.

## Windows 11 desktop evidence

Verified on 2026-11-05 (America/Los_Angeles), from a clean `npm ci` at the issue
#75 implementation based on main `68bd6f0`:

| Surface | Observed environment/result |
| --- | --- |
| Desktop OS | Windows 11 Pro 25H2, build 26200.9711, x64 |
| Runtime | Node 24.22.1, npm 11.19.1; npm `script-shell` returned `null` (default) |
| Installation | `npm ci` and `npx playwright install chromium webkit` passed |
| Full checks | `npm run check`: 154 unit tests and 90 browser tests passed, including WebKit and existing Chromium PDF assertions |
| Compliance | `npm run compliance` passed: 18 emitted runtime packages, 26 locked production packages, zero production advisories |
| Tooling audit | `npm run audit:all` passed at the existing high threshold: nine moderate entries, zero high/critical; residual risk remains tracked in [#86](https://github.com/ajason13/chart-the-course/issues/86) |
| Desktop browser | Microsoft Edge 156.0.4314.58, headed Playwright-controlled session, 1365 × 900 viewport |
| Development | `npm run dev -- --port 5173 --strictPort`; printed URL `http://127.0.0.1:5173/`; smoke passed |
| Production preview | `npm run preview -- --port 4173 --strictPort`; printed URL `http://127.0.0.1:4173/`; same smoke passed |

For each desktop smoke run, external network requests were blocked. Opened the
synthetic demo, selected its single hole (`way/9000060101`), confirmed the map,
added a named target, carry and club, and downloaded the project JSON. Reloaded,
reopened the demo, verified authored targets were cleared, imported the actual
downloaded file, then downloaded again and compared all project fields except
the export timestamp. Both runs restored the target, carry and club exactly and
reported no browser page errors. The full browser suite separately covers
switching among multiple fixture-backed holes and mobile layouts.

The bundled headed Chromium executable failed to launch with `spawn UNKNOWN`
in this session; installed Edge supplied the headed desktop evidence. The full
automated Chromium and WebKit suites passed. No PDF baseline or semantic
assertion was changed. Local verification logs and screenshots were retained in
the ignored `.compliance/` directory; PR CI logs and OS-specific artifacts supply
the hosted-runner evidence.

## Windows temporary-path regression

The first hosted Windows run exposed a fixture-only path mismatch in
`scripts/runtime-inventory.test.mjs`: Windows TEMP used an 8.3 alias
(`RUNNER~1`), while Vite canonicalized the build root. The explicit HTML input
still contained the alias, so the emitted HTML filename escaped the root and
Rolldown rejected it. On 2026-11-06, running the focused test with TEMP/TMP set
to an existing 8.3 directory alias reproduced the failure locally; the ordinary
long-path run passed.

Both temporary Vite fixture roots now use `realpathSync.native` before building.
The same three focused tests pass with long and short TEMP paths, preserving
the positive inventory case and every negative compliance/worker/PDF assertion.
The hosted Windows job continues to exercise its native TEMP configuration;
no CI environment workaround, baseline change or assertion relaxation is used.

The next Windows run passed those build checks and exposed a raw Markdown
input difference: default Windows Git checkout converted the legal disclaimer
to CRLF, while the PDF parser expects LF fenced-text delimiters. Git checkout
filters reproduced the 14 failing PDF tests locally. A targeted `.gitattributes`
rule now preserves LF for `docs/legal-disclaimers.md`, matching the committed
source and Linux build input. With Windows checkout filters applied, the bytes
match the original LF input and all 16 focused PDF scene/renderer tests pass.
Legal wording, runtime parsing and PDF assertions remain unchanged.

Hosted Windows Server results do not certify Windows 10/11 desktop support.
This desktop run supplies one Windows 11 x64 observation, not Windows 10, ARM64,
Safari/iOS, arbitrary hardware or print-driver certification. Windows setup and
Windows 10 workflow validation remain separately tracked in
[#76](https://github.com/ajason13/chart-the-course/issues/76).
