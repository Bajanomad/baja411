# README for Codex and Claude Code

This guide defines execution responsibilities for Codex and Claude Code in the Baja 411 workflow.

## Mandatory thinking order (not optional)

For every Baja 411 decision, review, prompt, UI idea, feature idea, bug fix, or code change, think in this exact order:

1. End user first
2. CEO/business strategy second
3. Engineer execution third

### 1) End user first
Ask:
- Who is using this?
- What are they trying to do?
- What pain does this remove?
- Does this help them find, decide, contact, navigate, trust, or stay informed?

### 2) CEO/business strategy second
Ask:
- Does this strengthen Baja 411 as a useful Baja Sur local intel app?
- Does it improve trust?
- Does it improve map, directory, or community value?
- Is it a distraction?

### 3) Engineer execution third
Only after user value and business value are clear, decide:
- The smallest safe code change
- The owning file
- Key risks
- Validation approach
- Required work-log updates in `updates-and-changes/`

## Role split (must be preserved)

Codex and Claude Code are for:
- Executing code changes
- Validating when possible
- Committing
- Opening PRs
- Creating/updating work logs
- Copying final readouts into `updates-and-changes/`

## Output capture rule (required)

When Codex or Claude Code finishes a task, it **must** copy its final readout into the relevant `updates-and-changes` markdown log.

This includes:
- Final summary
- Files changed
- Behavior changed
- Validation commands/results
- Build or lint errors
- Warnings
- Risks
- Follow-up recommendations
- PR link
- Commit hash
- Anything it would normally show David only in chat

David should not have to copy screenshots, terminal output, chat summaries, PR comments, validation results, warnings, commit hashes, or PR links manually.

The task is **not complete** until the final readout is copied into the log.
