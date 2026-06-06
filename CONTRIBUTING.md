# Contributing

Thanks for helping build Chart the Course. Keep changes focused, source-linked,
and aligned with the governance docs in this repository.

## Before You Start

1. Read `AGENTS.md`, `CONTEXT.md`, `SECURITY.md`, and `ATTRIBUTION.md`.
2. Review the relevant decision records under `docs/`.
3. Confirm the selected task has acceptance criteria in Notion.

## Development

```bash
npm ci
npm run dev
```

Use deterministic local checks before review:

```bash
npm run check
git diff --check
npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh
```

## Pull Requests

Pull requests should include:

- Summary of scoped changes.
- Task or issue link.
- Verification commands and results.
- Governance impact, including attribution, security, license, data-source,
  provider, or privacy changes.
- Screenshots only when UI changes exist.

## Guardrails

- Do not copy or adapt AGPL-3.0 code from `ace`.
- Do not copy source code, UI structure, query text, generated assets, or
  distinctive expressive implementation from unlicensed reference projects.
- Do not add production dependencies, third-party map providers, API keys,
  deployed OSM public tile CDN use, PDF export behavior, or user data flows
  without updating governance docs and compliance posture.
- Keep browser behavior deterministic and local-first unless a task explicitly
  approves a new data flow.
