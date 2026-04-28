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

## Workflow/readout rules for AI tools

- Before coding, read the latest relevant logs in this folder and summarize assumptions in the active task log.
- During coding, append concrete progress notes with exact files changed and why.
- Before commit/PR, include validation output (or explicit limitation notes) and whether app behavior changed.
- Keep entries factual and verifiable from repository state, commit history, or PR metadata.
- Do not record secrets, credentials, or private user data in logs.

## Scope

This folder is documentation/workflow support only. It should not be used to change product behavior, map logic, or UI directly.
