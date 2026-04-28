# Readout Guide: Codex and Claude Code

This guide defines workflow/readout expectations for coding agents that can edit files and run commands.

## Required sequence

1. Review `updates-and-changes/README.md` and relevant recent logs.
2. Start or update a date-stamped task log in `updates-and-changes/`.
3. Make implementation changes outside this folder only when explicitly requested.
4. Continuously document changed files and rationale in the task log.
5. Run validation commands and capture exact outputs/status.
6. Before commit, confirm whether behavior changed.
7. After commit/PR, capture commit hash and PR reference.

## Verification policy

- Backfilled notes must be supported by commit history, PR history, or current repo state.
- Do not claim validation was run unless command output exists.
- If tools are unavailable, explicitly note the limitation.

## Required task-log sections

- `# Task title`
- `## Prompt summary`
- `## Files changed`
- `## Behavior changed`
- `## Validation`
- `## Risks / follow-up`
- `## PR / commit`

## Safety and scope

- Do not include secrets or sensitive data.
- Keep entries concise but complete for future audits.
- Treat this folder as durable process documentation.
