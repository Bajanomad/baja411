# 2026-04-29 Close stale Speed Insights PR

## Task
Close stale draft PR #1, `Install and Configure Vercel Speed Insights`, without merging it or changing app/package code.

## Reason
PR #1 was bot-generated, remained open as a draft, touched package files, and was no longer aligned with the current Baja411 workflow or product priorities.

Speed Insights is not rejected permanently. If it becomes useful later, it should be reintroduced from a fresh branch based on current `main`, with current dependencies and normal validation.

## Actions taken
- Added a closing comment to PR #1 explaining why it was being closed.
- Closed PR #1 without merging.
- No app code was changed.
- No package files were changed.
- No dependencies were installed.

## Files changed
- `updates-and-changes/2026-04-29-close-stale-speed-insights-pr.md`

## Validation
No lint or build validation was required because this was a PR state change plus a documentation-only repo log.

## Risk / follow-up
- If Speed Insights becomes a priority, create a new PR from current `main` instead of reviving the stale bot PR.
- Keep performance instrumentation secondary to the current map, weather, directory, and reliability priorities.

## Final readout
- PR #1 closed as stale.
- No code behavior changed.
- No package behavior changed.
