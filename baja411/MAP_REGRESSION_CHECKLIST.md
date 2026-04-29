# Baja411 Map Regression Checklist

Use this checklist before and after any map-related change.

The map is the killer feature. Do not casually change Drive Mode, Plan Mode, heading rotation, recenter behavior, GPS tracking, search, pin rendering, add pin flow, or selected pin behavior.

## Before editing map code

1. Read `REPO_MAP.md`.
2. Read `components/MapClientMapLibre.tsx`.
3. Read `app/map/MapLoader.tsx` if the change touches map page shell, scroll locking, loading, or layout.
4. Read `components/LocationProvider.tsx` if the change touches GPS, fallback, stale location, or permission behavior.
5. Identify the smallest safe patch.
6. Do not use MutationObserver hacks, polling loops, injected fake buttons, hidden CSS hacks, or broad rewrites.

## Must not regress

1. Map page loads on mobile.
2. Map page does not scroll the body behind the map.
3. Drive Mode can center on the user.
4. Drive Mode keeps heading and bearing behavior stable.
5. Center me button recenters cleanly.
6. Snap back behavior still works after manual panning.
7. Plan Mode can still pan and explore without fighting the user.
8. Plan Mode search submit still works for known towns, categories, and pins.
9. Search UI does not block critical map controls on mobile.
10. Existing pins render.
11. Category filters still affect visible pins.
12. Selected pin UI still opens and closes.
13. Add pin modal still opens when scoped behavior allows it.
14. Add pin submit flow still works.
15. GPS denied state does not crash the map.
16. GPS unavailable state falls back gracefully.
17. Stale GPS state falls back gracefully.
18. Todos Santos fallback remains usable.
19. Map controls remain tappable on iPhone Safari.
20. Map controls remain tappable on Android Chrome.

## Manual mobile checks

Test these on real mobile when possible:

1. Open `/map` fresh.
2. Deny GPS and confirm fallback behavior is usable.
3. Allow GPS and confirm current location updates.
4. Tap center me once and confirm it recenters without repeated taps.
5. Rotate the phone and confirm heading behavior does not feel stuck or wild.
6. Pan the map in Drive Mode and confirm snap back behavior still makes sense.
7. Switch to Plan Mode and confirm the map stops fighting manual exploration.
8. Search for `Todos Santos`.
9. Search for a known category such as gas or medical if seeded data exists.
10. Tap a pin and confirm selected pin UI works.
11. Close selected pin UI.
12. Open add pin flow if available.
13. Return to home/weather/emergency pages and confirm global nav still works.

## Desktop checks

1. Open `/map` in a desktop browser.
2. Confirm map fills the intended viewport.
3. Confirm header/nav does not overlap unusably.
4. Confirm keyboard input in search works.
5. Confirm filters and selected pin UI remain usable.

## Validation

For code changes, attempt:

```bash
cd baja411 && npm run lint
cd baja411 && npm run build
```

Do not claim validation passed unless it actually passed.

If tooling is missing, report:

```txt
Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.
```

## Safe next map work

Plan Mode search suggestions should be implemented as clean React behavior inside the map system, either in `MapClientMapLibre.tsx` or a proper React child component.

Do not reintroduce the old DOM enhancer approach.
