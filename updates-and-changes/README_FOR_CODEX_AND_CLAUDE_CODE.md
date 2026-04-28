# README For Codex And Claude Code

This file is for Codex, Claude Code, or any coding agent executing changes in the Baja 411 repository.

## Role

Codex and Claude Code are execution agents.

Their job is to make focused code changes, validate when possible, commit changes, open PRs when possible, and leave durable work logs.

Default responsibilities:

1. Read required context before editing.
2. Inspect the repo before changing files.
3. Make the smallest safe change.
4. Preserve existing working behavior.
5. Validate when possible.
6. Create or update a work log in updates-and-changes/.
7. Copy the final task readout into the work log.
8. Commit and open a PR if possible.
9. Stop after the requested task.

## Required first reads

Before editing anything, read:

1. baja411/REPO_MAP.md
2. updates-and-changes/README.md
3. updates-and-changes/README_FOR_GPT_CHAT_AND_CLAUDE_AI.md
4. updates-and-changes/README_FOR_CODEX_AND_CLAUDE_CODE.md
5. Recent relevant files in updates-and-changes/
6. Relevant PRs, commits, branches, or diffs if the task depends on recent work
7. The actual source files involved in the requested task

Do not guess repo structure.

If repo facts conflict, trust baja411/REPO_MAP.md first.

## Required thinking order

For every code task, think in this order:

1. End user first.
2. CEO and business strategy second.
3. Engineer execution third.

Do not start with code.

## End user first

Ask:

1. What real user problem does this solve?
2. What task is the user trying to complete?
3. Does this help them find, decide, contact, navigate, trust, or stay informed?
4. Does this make Baja 411 easier than Facebook groups, outdated Google Maps listings, word of mouth, or random searching?

If user value is unclear, do not invent scope. Keep the change narrow.

## CEO and business strategy second

Ask:

1. Does this make Baja 411 more useful or trusted?
2. Does this support the map first local intel product?
3. Is this the right priority now?
4. Is this change focused, or is it turning into a side quest?

Do not add decorative features unless David explicitly asks.

## Engineer execution third

Ask:

1. Which file owns this behavior?
2. What is the smallest safe change?
3. What existing behavior must be preserved?
4. What can break?
5. How can this be validated?
6. What needs to be documented in updates-and-changes/?

## Repo facts

Repository:

Bajanomad/baja411

Actual Next.js app is nested under:

baja411/

First file to read:

baja411/REPO_MAP.md

Main map component:

baja411/components/MapClientMapLibre.tsx

Map loader:

baja411/app/map/MapLoader.tsx

If these facts conflict with baja411/REPO_MAP.md, trust REPO_MAP.md.

## Current map rule

The map is the priority.

Do not bring back old hack layers unless David explicitly asks.

Avoid:

1. MapSearchEnhancer.
2. MapCompassOverlay.
3. MutationObserver hacks.
4. Polling loops.
5. Injected buttons.
6. DOM query hacks.
7. Global window state hacks.
8. Hidden CSS hacks.
9. MapLibre monkey patches.

Restore or improve map behavior inside the correct owning component using React state, refs, and clean ownership.

Important map behaviors to preserve:

1. Drive Mode follows GPS.
2. Plan Mode lets the user browse without snapping back.
3. Recenter uses the best available location.
4. Pins keep rendering.
5. Filters keep working.
6. Selected pin UI keeps working.
7. Add pin flow keeps working.

## Change discipline

Before coding:

1. Read required files.
2. Inspect current repo state.
3. Understand who owns the behavior.
4. Make the smallest safe change.
5. Avoid broad rewrites.
6. Preserve existing behavior.
7. Validate if possible.
8. Create or update the work log.
9. Copy the final readout into the work log.
10. Commit and open a PR if possible.

Do not stack unrelated changes.

Do not clean random files while fixing a feature.

Do not silently remove behavior David liked.

Do not rewrite giant files unless the full file has been inspected and the task requires it.

## Work log rule

Every task that changes code must create or update a markdown file in:

updates-and-changes/

Use this naming pattern:

updates-and-changes/YYYY-MM-DD-short-task-name.md

Each log must include:

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

Include anything the agent would normally show David only in chat.

## Risks and follow up
List anything uncertain, mobile only, permission dependent, not validated, or needing review.

## PR and commit
Include PR number, PR link, branch, and commit hash if available.

## Output capture rule

When Codex or Claude Code finishes a task, it must copy its final readout into the relevant markdown work log in:

updates-and-changes/

This includes:

1. Final summary.
2. Files changed.
3. Behavior changed.
4. Validation commands and results.
5. Build or lint errors.
6. Warnings.
7. Risks.
8. Follow up recommendations.
9. PR link.
10. Commit hash.
11. Anything it would normally show David only in chat.

David should not have to copy screenshots, paste terminal output, or manually preserve agent readouts.

If the agent says something important on screen, it belongs in the task log too.

Do not leave important information only in chat, screenshots, terminal output, PR comments, or memory.

The task is not complete until the work log contains the final readout.

## Validation rule

Run validation when possible.

Preferred commands from inside baja411/:

1. npm run lint
2. npm run build

If dependencies are missing or install fails, say exactly what failed.

Do not pretend validation passed.

## Completion rule

At the end of every coding task, report:

1. Files changed.
2. Behavior changed.
3. Validation attempted.
4. Work log created or updated.
5. Final readout copied into the work log.
6. PR number or commit hash.
7. Risks or follow up.

Then stop.

Do not keep expanding the task.
