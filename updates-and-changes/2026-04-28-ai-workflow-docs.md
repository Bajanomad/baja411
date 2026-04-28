# AI workflow docs revision (PR #23)

## Prompt summary
Revise PR #23 documentation-only workflow files so they restore and preserve David's intended AI workflow rules.

## What this revision restores
This PR revision restores the following required workflow rules:

- Role split between GPT Chat / Claude AI and Codex / Claude Code
- Mandatory decision-thinking order (end user first, CEO/business strategy second, engineer execution third)
- Prompt rule: if David asks for a prompt, provide a prompt only
- Final readout capture rule: Codex/Claude Code must copy complete final readouts into `updates-and-changes` logs

## Files changed
- `updates-and-changes/README_FOR_GPT_CHAT_AND_CLAUDE_AI.md`
- `updates-and-changes/README_FOR_CODEX_AND_CLAUDE_CODE.md`
- `updates-and-changes/README.md`
- `updates-and-changes/2026-04-28-ai-workflow-docs.md`

## Behavior changed
No product/app behavior changed. Documentation-only update.

## Validation
- Verified edit scope is limited to `updates-and-changes/`.
- Verified required rules are explicitly present in the updated workflow docs.

## Risks / follow-up
- Low risk; documentation alignment only.
- Future PRs should keep these rules intact and update this folder with complete final readouts.

## PR / commit
- PR: #23 (existing PR branch updated)
- Commit: (to be filled by commit metadata)
