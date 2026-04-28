# Plan Mode GPS drift cleanup

## Prompt summary
Original task prompt text is not available from repo history.

Based on merge and commit metadata, this work appears to have fixed Plan mode drift by moving behavior into the map owner and removing guard/patch layers that intercepted map behavior externally.

## Files changed

baja411/app/map/MapLoader.tsx

- Commit `b5db30a` removed `MapPlanGpsGuard` from map loader render path.

baja411/app/map/MapPlanGpsGuard.tsx

- Commit `b5db30a` deleted the file, removing a global guard that monkey-patched map easing and geolocation behavior.

baja411/components/MapClientMapLibre.tsx

- Commit `b5db30a` added Plan-mode branch handling inside the map component to avoid snap-back camera behavior while preserving tracking state updates.

## Behavior changed

- Plan mode no longer relies on a DOM/global guard layer for GPS camera behavior.
- Plan mode camera-follow behavior is handled directly in `MapClientMapLibre`, reducing drift/snap-back side effects.

## Validation

No explicit lint/build/test command output was found in local git metadata for this cleanup.

Validation status: not verified from available repo history.

## Final agent readout

Original Codex final readout not available from repo history.

Verified from repo history:

- PR merge commit: `862b7ce` (Merge pull request #19).
- Implementation commit: `b5db30a`.
- Deleted temporary guard file: `baja411/app/map/MapPlanGpsGuard.tsx`.

## Risks and follow up

- Plan vs Drive transitions should be manually validated on mobile GPS devices.
- No preserved lint/build output was found for this specific PR in local history.

## PR and commit

- PR number: #19
- PR title: Fix Plan mode GPS drift and remove temporary map guard
- Branch: `codex/clean-up-gps/plan-mode-workaround` (from merge commit subject)
- Commits: `862b7ce`, `b5db30a`
- PR link: https://github.com/Bajanomad/baja411/pull/19
