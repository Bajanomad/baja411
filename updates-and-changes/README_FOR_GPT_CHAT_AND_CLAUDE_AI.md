# Readout Guide: GPT Chat and Claude AI

This guide defines how chat-style AI sessions should maintain updates in `updates-and-changes/`.

## Primary objective

Produce durable, human-readable logs that explain:

- what was requested
- what changed
- how it was validated
- whether behavior changed

## Required workflow

1. Read `updates-and-changes/README.md` before starting.
2. Create or update `updates-and-changes/YYYY-MM-DD-short-task-name.md` for the task.
3. Record prompt summary and decisions before implementation.
4. Record exact files changed as work progresses.
5. Record validation commands and outcomes.
6. Record risks and follow-up items.
7. Record PR number and commit hash after opening/submitting PR.

## Readout format checklist

Each task log should include these headings:

- `# Task title`
- `## Prompt summary`
- `## Files changed`
- `## Behavior changed`
- `## Validation`
- `## Risks / follow-up`
- `## PR / commit`

## Guardrails

- Keep entries factual and verifiable from repo state, commit history, or PR metadata.
- If a result cannot be verified, label it as unverified and avoid asserting it as fact.
- Never include secrets, API keys, tokens, or personal data.
- Keep this folder documentation-only; no product behavior, UI, or map logic changes here.
