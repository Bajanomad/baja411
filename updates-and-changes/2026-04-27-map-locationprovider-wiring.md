# Map LocationProvider wiring

## Prompt summary
Original task prompt text is not available from repo history.

Based on commit and PR metadata, this work appears to have wired `MapClientMapLibre` map center and recenter behavior to the shared `LocationProvider` so map initialization and recentering use a common location source.

## Files changed

baja411/components/MapClientMapLibre.tsx

- Commit `849c123` replaced a generic map center constant with a Todos Santos fallback center, imported `useBajaLocation`, initialized map center from provider coordinates, and adjusted initial zoom based on location source.
- Commit `849c123` also changed recenter behavior to use latest GPS location when available and provider location as fallback.

## Behavior changed

- Map startup center now follows shared location state instead of a hardcoded generic center.
- Recenter behavior falls back to provider location when live GPS tracking data is not available.
- Initial zoom differentiates GPS-driven and fallback location modes.

## Validation

No explicit lint/build/test command output was found in local git commit metadata for this task.

Validation status: not verified from available repo history.

## Final agent readout

Original Codex final readout not available from repo history.

Verified from repo history:

- PR merge commit: `8eb15a3` (Merge pull request #14).
- Main implementation commit: `849c123`.
- Primary file touched: `baja411/components/MapClientMapLibre.tsx`.

## Risks and follow up

- Mobile GPS permission states and first-load fallback interactions should be manually verified on device.
- No build/lint pass evidence was preserved in commit metadata for this specific change.

## PR and commit

- PR number: #14
- PR title: Wire MapLibre map center to shared LocationProvider
- Branch: `codex/patch-mapclientmaplibre-with-location-provider` (from merge commit subject)
- Commits: `8eb15a3`, `849c123`
- PR link: https://github.com/Bajanomad/baja411/pull/14
