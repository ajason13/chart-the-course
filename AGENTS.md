# Chart the Course Repository Guidance

## Scope

Chart the Course is a fixture-backed browser application. Runtime code is in
`src/`, Playwright smoke tests in `test/e2e/`, deterministic fixtures in
`fixtures/`, and focused decisions in `docs/`.

Do not add runtime map providers, basemap tiles, Overpass calls, PDF export,
production dependencies, API keys, or user-data flows unless the task explicitly
includes the corresponding product, licensing, and compliance decision.
Do not reuse AGPL-3.0 code from `ace`; treat `hacker-yardage` and
`openyardage-web` as study-only until permissions are verified.

## Commands

- `npm run build`: type-check and build.
- `npm run test:unit`: unit tests.
- `npm run test:e2e`: browser smoke tests.
- `npm run check`: scaffold verification, build, and tests.
- `npm run compliance`: SBOM, license, and production dependency audit.
- `git diff --check`: whitespace check.

Use Node 24 and npm 11 as declared by the repository. Keep direct dependencies
exact-pinned. Run the checks that cover the changed surface; run `npm run check`
and `npm run compliance` for material application, dependency, or policy work.

## Working loop

Check `git status --short --branch`, inspect only the files relevant to the
task, make the smallest complete change, verify it, and review the final diff.
For security, licensing, public-contract, release, or requested-review work,
run a fresh-context Codex review after implementation. Do not require Notion,
Claude, Gemini, or external-model handoffs.

Historical handoffs live in `docs/history/` and are not default task context.
Read a specific historical record only when it is relevant to the task.
