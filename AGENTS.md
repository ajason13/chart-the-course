# Repository Guidelines

## Project Structure & Module Organization

This repository is currently a governance scaffold for Chart the Course, not a runtime app. Root documents define project policy and status: `CONTEXT.md`, `SECURITY.md`, `ATTRIBUTION.md`, `THIRD_PARTY_NOTICES.md`, and `LICENSE`. Focused decision records live in `docs/`, including tile-provider, governance-workflow, and legal-disclaimer guidance. Automation lives in `scripts/`; `scripts/compliance.sh` delegates to the canonical npm compliance flow. Dependency metadata is tracked in `package.json`, `package-lock.json`, and generated `sbom.json`.

## Build, Test, and Development Commands

- `npm ci`: install dependencies from the lockfile.
- `npm run generate:sbom`: regenerate `sbom.json` with CycloneDX.
- `npm run license:check`: run production dependency allowlist and denylist checks.
- `npm run audit:prod`: run `npm audit --omit=dev --audit-level=high`.
- `npm run compliance`: run SBOM generation, license checks, and production audit.
- `scripts/compliance.sh`: shell wrapper for the same compliance flow.
- `git diff --check`: catch whitespace errors before review.

There is no app build or local dev server yet. Add those commands only when runtime source is introduced.

## Agent Workflow

Before starting a task, run `git status --short --branch`, read `CONTEXT.md`,
and fetch the current Notion task. Notion is long-term memory; `CONTEXT.md` is
active repo memory. Move active Codex work to `3. In Development (ChatGPT)`,
then to `4. Final Audit (Claude)` for review, and only mark `5. Done` after
Claude findings are resolved or explicitly accepted. For docs-only governance
tasks, the Gemini/Claude planning handoff may be skipped only under
`docs/governance-workflow.md`; final Claude audit is still required.

## Coding Style & Naming Conventions

Keep Markdown concise, source-linked where policy depends on external terms, and specific to Chart the Course. Use sentence-case prose, fenced command examples, and relative paths such as `docs/tile-provider-strategy.md`. Shell scripts should use POSIX `sh` unless a stronger shell is required; keep `set -eu` for fail-fast behavior. Package scripts should remain explicit and composable.

## Testing Guidelines

No unit or integration test framework is present yet. For current changes, run `git diff --check` and `npm run compliance` before review. When app code is added, place tests near the source or in a clearly named `tests/` tree, and document the framework and naming pattern here.

## Commit & Pull Request Guidelines

Recent commits use short imperative subjects, often referencing CTC task IDs, for example `Document CTC-018 tile provider strategy` and `Resolve CTC-003 audit minor fixes`. Keep commits focused on one task. Pull requests should include a brief summary, verification commands and results, linked task or issue, governance impact, and screenshots only when UI changes exist.

## Security & Governance Notes

Do not copy or adapt AGPL-3.0 code from `ace`. Treat `hacker-yardage` and `openyardage-web` as study-only unless permissions are verified. Do not add map providers, production dependencies, API keys, PDF export behavior, or user data flows without updating the relevant docs and compliance posture. Use GitHub private vulnerability reporting until a monitored security email exists.
