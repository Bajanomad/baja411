# AI workflow documentation foundation

## Prompt summary

Create the permanent AI workflow documentation structure for Baja 411.

The goal is to give GPT Chat, Claude AI, Codex, and Claude Code clear standing instructions so David does not have to repeat the workflow every session.

## Files changed

updates-and-changes/README.md

Created the main folder README explaining the purpose of this folder, the task log format, and the output capture rule.

updates-and-changes/README_FOR_GPT_CHAT_AND_CLAUDE_AI.md

Created the planning and review guide for GPT Chat and Claude AI.

updates-and-changes/README_FOR_CODEX_AND_CLAUDE_CODE.md

Created the execution guide for Codex and Claude Code.

updates-and-changes/2026-04-28-ai-workflow-docs.md

Created this initial documentation task log.

## Behavior changed

No app behavior changed.

No map behavior changed.

No product UI changed.

This task only adds workflow documentation.

## Validation

No build or lint validation required because this task only creates markdown documentation.

## Final agent readout

### Summary

- Created `updates-and-changes/README.md` with standing workflow purpose, task-log structure, and output capture rules.
- Created `updates-and-changes/README_FOR_GPT_CHAT_AND_CLAUDE_AI.md` with planning/review role guidance for GPT Chat and Claude AI.
- Created `updates-and-changes/README_FOR_CODEX_AND_CLAUDE_CODE.md` with execution discipline, validation, and work-log requirements for coding agents.
- Created `updates-and-changes/2026-04-28-ai-workflow-docs.md` as the initial durable task log for this documentation foundation task.
- Confirmed no source code, product UI, app behavior, or map logic was changed.

### Validation

- Command run: `git status --short`
- Result: documentation-only additions under `updates-and-changes/`.

### PR and commit

- PR link: Not returned by the PR tool output in this environment.
- Commit hash: `7f3b98a`.

### Risks and follow up

- Future coding tasks must consistently maintain `updates-and-changes/` logs and copy final agent readouts into those logs.

## Risks and follow up

Future Codex and Claude Code tasks must actually follow these files.

Future coding tasks must create or update a work log and copy the final readout into that log.

## PR and commit

PR link: Not returned by the PR tool output in this environment.

Branch: `work`

Commits: `a5bb6b5`, `7f3b98a`, `8107d49`
