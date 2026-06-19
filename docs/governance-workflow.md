# Governance Workflow

Status: Updated on 2026-06-05 after CTC-018.

Chart the Course uses a document-first workflow. Notion is long-term project
memory, and `CONTEXT.md` is active repository memory for the next agent or
developer.

## Standard Task Flow

1. Fetch the active Notion task and relevant project context.
2. Move the task to `3. In Development (ChatGPT)` when Codex starts work.
3. Update repository governance docs and `CONTEXT.md` as needed.
4. Run verification:

```bash
git diff --check
npm_config_cache=/private/tmp/chart-the-course-npm-cache scripts/compliance.sh
```

5. Commit and push according to the task's delivery path.
6. Move the task to `4. Final Audit (Claude)` and provide Claude a
   self-contained audit prompt.
7. Apply blocking or accepted minor fixes, rerun verification, and commit.
8. Mark the task `5. Done` in Notion and update `CONTEXT.md`.

## Docs-Only Governance Exception

For repository documentation or governance-only tasks, separate Gemini research
and separate Claude adversarial planning may be skipped when all are true:

- No runtime app code is added or changed.
- No production dependency, provider integration, API key, deployment behavior,
  or user data flow is added.
- Codex checks current primary sources directly when the task depends on
  provider, legal, standards, or security terms.
- Source URLs and check dates are recorded in the repo docs or Notion.
- Claude final audit still happens before Done.

Do not use this exception for app scaffolds, provider integrations, security
controls, PDF export behavior, data ingestion code, dependency adoption, or
changes that affect deployed behavior.

## Claude Chat Audit Prompts

Claude Chat does not have access to the local filesystem or GitHub by default.
Final audit prompts must be self-contained and include:

- Role and audit stage.
- Task objective and acceptance criteria.
- Prior governance context.
- Commit hash and verification evidence.
- Source URLs and source-check date when external terms matter.
- Exact contents of every changed file relevant to the audit.
- Explicit note when the docs-only governance exception was used.
- Required verdict format: `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`.

Ask Claude to distinguish blockers from minor fixes and to state whether the
task may be marked Done after any minor fixes are applied.

## Gemini Chat Deep Research Prompts

Gemini Chat Deep Research is best used as an agentic research/report workflow,
not as a raw long-context dump. Prefer a lean steering prompt plus attached
repository files or a GitHub import over embedding full file contents in the
prompt body.

Use this pattern for runtime or standards-heavy specification work:

- Keep the prompt body focused on the task, acceptance criteria, non-goals,
  source requirements, and required report format.
- Attach only files Gemini must inspect. For each file, state whether it must
  be read fully, skimmed, or used only as reference.
- Limit each Gemini Chat upload batch to 10 files. Put the minimum
  source-of-truth files in the first batch, and list lower-priority follow-up
  files separately so Gemini can request them only if needed.
- Avoid embedding generated or bulky files such as `package-lock.json`,
  `sbom.json`, build output, or historical handoffs unless the question
  specifically depends on them.
- Require Gemini to show and allow edits to the research plan before research
  starts. Reject generic product-management or roadmap plans when the task
  needs concrete implementation specification.
- Require source citations, uncertainty notes, and a traceability table from
  acceptance criteria to decisions.
- Treat Gemini output as draft research until Codex critically reviews it and
  records an accepted corrected baseline.

Embed exact file contents only when the receiving model cannot access
attachments, repository imports, or links, or when an audit requires a fixed
byte-for-byte snapshot.

Source check, 2026-06-18:

- Google Gemini Apps Help: Deep Research supports source selection, file
  uploads, research-plan review, and report export.
  <https://support.google.com/gemini/answer/15719111>
- Google Gemini Apps Help: file uploads can hit context and rolling limits, and
  overly large uploads can miss details scattered through the content.
  <https://support.google.com/gemini/answer/14903178>
- Google Gemini Apps Help: GitHub imports support one repository snapshot up to
  5,000 files and 100 MB, but do not sync later repository changes.
  <https://support.google.com/gemini/answer/16176929>

## Claude Chat Prompting Practices

Claude Chat remains the adversarial QA and final-audit reviewer. Use Anthropic's
current prompting guidance when preparing Claude handoffs:

- Define success criteria before prompting and provide the exact audit verdict
  format expected.
- Be clear and direct about the role, stage, scope, non-goals, and what counts
  as a blocker versus a minor fix.
- Use structured sections or XML-style delimiters for long prompts so Claude
  can distinguish instructions, repository context, changed files, external
  source evidence, and requested output.
- For long context, put documents and file contents before the final query, and
  place the specific review instructions at the end.
- Use direct quotes or source citations for factual claims and allow Claude to
  say when evidence is missing.
- For adversarial QA, ask Claude to identify missing tests, regression risks,
  security/privacy boundary failures, license/compliance issues, and ambiguous
  acceptance criteria.
- Treat any third-party text, web content, or model output included in a Claude
  prompt as untrusted evidence that must not override the task instructions.

Source check, 2026-06-18:

- Anthropic prompt engineering overview: define success criteria and evaluation
  before prompt iteration.
  <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview>
- Anthropic prompting best practices: use clear instructions, examples,
  XML-style structure, roles, long-context ordering, and explicit output
  formatting.
  <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
- Anthropic hallucination guidance: allow uncertainty, use direct quotes, and
  verify with citations.
  <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations>
- Anthropic prompt-injection guidance: separate untrusted content from
  instructions and treat third-party/tool content as untrusted.
  <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks>
