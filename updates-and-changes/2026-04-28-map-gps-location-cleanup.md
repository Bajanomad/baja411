# Map/GPS location cleanup recap (PRs #14, #15, #16, #19)

## Prompt summary
Document the recent map/GPS-related Codex work so future sessions have one durable reference for what changed, how it was validated, and what still requires manual/mobile verification.

## PR-by-PR summary

### PR #14 — Wire MapLibre center/recenter to LocationProvider
- **Title:** `Wire MapLibre center/recenter to LocationProvider`
- **Primary file(s):**
  - `components/MapClientMapLibre.tsx`
- **Behavior changed:**
  - Map center and recenter logic were wired to `LocationProvider` values instead of relying on generic/default map center behavior.
  - This aligned map startup/recenter behavior with app-level location state.
- **Validation results:**
  - Validation command output is not preserved in commit metadata; no durable command log found in git history for this PR.
- **Risks / follow-up (manual/phone testing):**
  - Verify first-load centering on physical devices with location permission states: granted, denied, prompt/not-decided.
  - Verify recenter consistency when GPS becomes available after initial load.

### PR #15 — Improve map recenter/tracking/provider sync behavior
- **Title:** `Wire map to LocationProvider sync` (provider-sync and recenter/tracking behavior improvement)
- **Primary file(s):**
  - `components/MapClientMapLibre.tsx`
- **Behavior changed:**
  - Tightened synchronization between map behavior and provider state so recenter/tracking flows follow app-level location updates more reliably.
- **Validation results:**
  - No explicit command transcript stored in commit metadata for this PR.
- **Risks / follow-up (manual/phone testing):**
  - Validate transitions between plan/drive or passive/tracking states while GPS updates are in flight.
  - Confirm no camera jumps or stale-provider snaps after long background/foreground cycles.

### PR #16 — Remove unused map imports/constants and note local validation dependency failures
- **Title:** `chore: remove unused maplibre typings constant`
- **Primary file(s):**
  - `components/MapClientMapLibre.tsx`
- **Behavior changed:**
  - Cleanup-only change removing unused map-related typing constant/import surface.
  - Intended to reduce clutter and keep map component easier to maintain.
- **Validation results:**
  - PR context noted local validation/dependency issues; exact failing command output is not included in git commit metadata.
- **Risks / follow-up (manual/phone testing):**
  - Low runtime risk (cleanup-only), but a full local lint/typecheck/build should still be re-run in a fully provisioned environment.

### PR #19 — Fix Plan Mode GPS drift and remove temporary map guard
- **Title:** `Fix plan mode GPS behavior at source`
- **Primary file(s):**
  - `app/map/MapLoader.tsx`
  - `app/map/MapPlanGpsGuard.tsx`
  - `components/MapClientMapLibre.tsx`
- **Behavior changed:**
  - Addressed Plan Mode GPS drift behavior at source.
  - Removed temporary guard-based workaround in favor of source-level correction.
- **Validation results:**
  - Commit history does not contain a durable command transcript for this PR.
- **Risks / follow-up (manual/phone testing):**
  - High-priority mobile verification while walking/driving to confirm drift reduction under real GPS noise.
  - Verify heading/orientation interplay remains stable when permission is granted late.
  - Re-check recenter behavior after toggling modes repeatedly.

## Validation
For this documentation task (current change), no app behavior was changed and no map logic/UI was modified.

## Risks / follow-up
- Historical PR validation details were only partially recoverable from git metadata; future tasks should always log exact commands/results in this folder at the time of change.
- If needed, backfill past PR logs with links to CI checks once available.

## PR / commit
- This file serves as a retrospective log entry; see repository history for merged PRs #14, #16, and #19 and related map sync commit for #15.
