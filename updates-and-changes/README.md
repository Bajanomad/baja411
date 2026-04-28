# Baja 411 Updates And Changes

This folder stores durable AI workflow files, task logs, final agent readouts, validation notes, risks, and follow up notes for Baja 411.

The goal is simple:

David should not have to keep repeating the workflow every new session.

David should not have to copy screenshots, paste long terminal readouts, or manually preserve agent summaries.

If an AI agent does important work or says something important at the end of a task, that information belongs in this folder.

## Standing workflow files

Read these first:

1. updates-and-changes/README_FOR_GPT_CHAT_AND_CLAUDE_AI.md
2. updates-and-changes/README_FOR_CODEX_AND_CLAUDE_CODE.md
3. baja411/REPO_MAP.md

## Task logs

Every Codex or Claude Code task that changes code must create or update a task log in this folder.

Use this naming pattern:

updates-and-changes/YYYY-MM-DD-short-task-name.md

Each task log must include:

# Task title

## Prompt summary
What the task was asked to do.

## Files changed
List every changed file and explain why it changed.

## Behavior changed
Explain what the user will experience differently.

## Validation
List commands run and results.

If validation failed because dependencies, tools, permissions, or environment access were missing, say that plainly.

## Final agent readout
Copy the final Codex or Claude Code readout here.

This includes summaries, warnings, build results, lint results, risks, follow up notes, PR links, branch names, and commit hashes.

## Risks and follow up
List anything uncertain, mobile only, permission dependent, not validated, or needing review.

## PR and commit
Include PR number, PR link, branch, and commit hash if available.

## Output capture rule

If Codex or Claude Code says something important on screen, it belongs in the task log too.

Do not leave important information only in chat, screenshots, terminal output, PR comments, or memory.

The task is not complete until the work log contains the final readout.
