# Codex / AI Work Log

This folder stores durable task logs for Codex/AI work so future sessions and ChatGPT reviews can quickly understand what changed and why.

## What belongs here

Use this folder for task-level documentation such as:

- task notes and prompt summaries
- code and configuration change summaries
- validation/test commands and results
- known risks, caveats, and follow-up items
- PR/commit references

## Required logging rule (all future code changes)

From now on, every Codex task that changes code **must** create or update a Markdown log file in this folder.

Use this filename pattern:

- `updates-and-changes/YYYY-MM-DD-short-task-name.md`

Each task log should include:

- `# Task title`
- `## Prompt summary`
- `## Files changed`
- `## Behavior changed`
- `## Validation`
- `## Risks / follow-up`
- `## PR / commit`

If validation fails due to missing dependencies or unavailable local tools, state that plainly in the log.

## Output capture rule (required)

When Codex or Claude Code finishes a task, it **must** copy its final readout into the relevant `updates-and-changes` markdown log.

This includes:
- final summary
- files changed
- behavior changed
- validation commands/results
- build or lint errors
- warnings
- risks
- follow-up recommendations
- PR link
- commit hash
- anything it would normally show David only in chat

David should not have to copy screenshots, terminal output, chat summaries, PR comments, validation results, warnings, commit hashes, or PR links manually.

The task is not complete until the final readout is copied into the log.

## Scope

This folder is documentation/workflow support only. It should not be used to change product behavior, map logic, or UI directly.
