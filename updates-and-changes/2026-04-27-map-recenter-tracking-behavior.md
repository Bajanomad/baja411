# Map recenter and tracking behavior updates

## Prompt summary
Original task prompt text is not available from repo history.

Based on commit history, this work appears to have synchronized map tracking/follow behavior with shared location state and refined recenter logic for drive/plan workflows.

## Files changed

baja411/components/MapClientMapLibre.tsx

- Commit `93fa380` added provider-sync behavior for the location marker and map camera updates when in drive mode.
- Commit `93fa380` updated tracking state handling (`setFollowing`) so it reflects GPS/provider availability instead of always forcing follow mode.
- Commit `93fa380` refined recenter zoom fallback logic based on whether GPS center is available.

## Behavior changed

- Drive mode camera sync now reacts to provider location updates more explicitly.
- Recenter behavior uses provider location fallback when no live GPS point is available.
- Follow mode and zoom selection are conditioned on actual GPS availability.

## Validation

No explicit lint/build/test command output was found in local git commit metadata for this work area.

Validation status: not verified from available repo history.

## Final agent readout

Original Codex final readout not available from repo history.

Verified from repo history:

- Commit `93fa380` (“Wire map to LocationProvider sync”) contains the recenter/tracking follow-state adjustments.
- A referenced PR #15 was provided in task context, but a merge commit explicitly labeled `#15` is not visible in local git history.

## Risks and follow up

- PR mapping for this change set is partial; PR #15 details are not fully verifiable from available repo history.
- Mobile behavior in mixed permission states should be manually tested.

## PR and commit

- PR number: #15 (referenced by task prompt; exact merge commit not verified from available repo history)
- PR title: Wire map to LocationProvider and improve recenter/tracking behavior (referenced by task prompt)
- Branch: not verified from available repo history
- Commit: `93fa380`
- PR link: https://github.com/Bajanomad/baja411/pull/15
