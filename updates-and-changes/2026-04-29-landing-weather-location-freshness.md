# 2026-04-29 Landing weather freshness and location clarity

## Task
Fix misleading landing page weather temperature on the Baja411 home page by making stored GPS location staleness-aware and clarifying source status text.

## Changes made
- `components/LocationProvider.tsx`
  - Added a 30-minute freshness policy for stored GPS coordinates.
  - Stored fallback locations still hydrate from localStorage.
  - Stale GPS entries now default to Todos Santos until fresh GPS is obtained.
  - Existing permission-based refresh behavior on load is preserved.
- `components/HomeWeatherStrip.tsx`
  - Added validation for Open-Meteo `current` values before showing Temp/Wind/Humidity.
  - Suspicious or missing values now render dash/error state instead of misleading numbers.
  - Added compact location/weather status line with explicit states:
    - Your location · updated HH:MM
    - Your location · updating…
    - Todos Santos fallback
    - Weather unavailable

## Notes
- No map behavior files were touched.
- Weather page was reviewed for consistency but not redesigned.
