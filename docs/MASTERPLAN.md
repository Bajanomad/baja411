# Baja411 Masterplan

## Purpose

This is the canonical Baja411 product build plan.

It defines product direction, build phase order, solved problems, current state, and what to build next.

This document is not an implementation prompt.

## Supporting docs

1. `REPO_MAP.md`
2. `MAP_REGRESSION_CHECKLIST.md`
3. `docs/MAP_ARCHITECTURE_AUDIT.md`
4. `MOBILE_ROADMAP.md`
5. `PROJECT_GUIDELINES.md`

## Operating hierarchy

1. User first
2. Engineer second
3. CEO third

User first means every feature starts with a real Baja field problem.

Engineer second means feasibility, risk, architecture, map safety, validation, and maintainability come before business fantasies.

CEO third means business strategy, monetization, growth, and positioning matter only after the user problem and engineering path are clear.

## Core thesis

Baja411 is a map first Baja California Sur field tool for travelers, locals, expats, boondockers, and people who need useful Baja information fast.

Baja411 should own Baja Sur field usefulness:

1. Local map intelligence
2. Verified services
3. Practical pins
4. Weather and storm awareness
5. Emergency access
6. Directory to map data
7. Local corrections
8. Weak signal usefulness over time

## Problems Baja411 solves

1. Baja information is scattered across Facebook, word of mouth, stale websites, and generic map apps.
2. Google Maps is strong globally but weak for local field context, Baja specific warnings, informal services, and practical traveler needs.
3. Waze only works well with dense live driver reporting and should not be copied as a routing engine.
4. iOverlander is useful but broader, traveler focused, and has user trust friction around pricing and clutter.
5. Local businesses are hard to verify, search, and connect to map locations.
6. Weather, storms, roads, emergency info, and services need to be reachable fast from one place.
7. Baja field users often have weak signal and need graceful stale data behavior.

## How Baja411 solves those problems

1. Map first interface
2. Drive Mode and Plan Mode
3. GPS with Todos Santos fallback
4. Approved map pins
5. Approved geocoded businesses in the map feed
6. Public business submissions with admin moderation
7. Native weather forecast powered by Open Meteo
8. Windy visual weather tools
9. SOS emergency page as a global safety layer
10. Directory that stays user facing, not sales first
11. Future verification and correction loops
12. Future weak signal and cached data behavior

## What has already been built

1. Next.js app inside `baja411/`
2. MapLibre map in `MapClientMapLibre.tsx`
3. Drive Mode and Plan Mode
4. `LocationProvider` and Todos Santos fallback
5. Weather page with native Open Meteo forecast
6. Windy visual tools
7. Emergency page
8. Business directory
9. Public business submission at `/businesses/submit`
10. Login required for submissions
11. `PENDING` business records for submissions
12. Admin moderation for businesses
13. Public directory shows `APPROVED` businesses only
14. Approved geocoded businesses now appear on the map through `/api/pins` combined feed
15. `MapSearchEnhancer.tsx` removed and should not be treated as current architecture
16. Morning and night audit docs exist under `docs/`

## Competitor lessons

### Google Maps

Steal map first layout, obvious search, mobile bottom sheet, clear actions, and progressive disclosure.

Do not copy global scope, ad first discovery, account heavy behavior, or commercial clutter before trust.

### Waze

Steal fast report actions, road and hazard awareness, and driver urgency.

Do not copy routing or fake live traffic without user density.

### iOverlander

Steal traveler field intel, practical categories, notes, verification, moderated community data, and trust before monetization.

Do not copy heavy paywall friction, cluttered cluster UX, or community trust erosion.

## Product principles

1. The map is the core product.
2. Map stays visible whenever possible.
3. Search must be forgiving.
4. Pins must explain themselves fast.
5. Business listings with real locations belong on the map.
6. Trust signals matter more than star ratings.
7. SOS stays separate from normal directory content.
8. Weather and storm tools stay useful inside Baja411.
9. Monetization comes after trust.
10. Working map behavior does not get changed casually.

## Build phases

### Phase 1: Map usefulness and trust foundation

1. Convert selected pin UI into a mobile bottom sheet.
2. Show business details clearly.
3. Add directions, call, WhatsApp, website actions.
4. Show source type.
5. Add last updated or last verified metadata.
6. Add report correction or suggest edit.
7. Preserve approved business pins in `/api/pins` without duplicating businesses into `MapPin`.

### Phase 2: Plan Mode search suggestions

1. Suggestions for towns.
2. Suggestions for categories.
3. Suggestions for businesses.
4. Suggestions for field pins.
5. Support common terms like gas, fuel, diesel, Pemex, mechanic, taller, tires, llanta, pharmacy, farmacia, doctor, hospital, water, agua, dump, camp, beach, playa, Todos, La Paz, Cabo.
6. Do not reintroduce DOM enhancer hacks.
7. Do not change Drive Mode, recenter, heading, bearing, snap back, GPS, or map initialization.

### Phase 3: Better categories and filters

Needed categories:

1. Fuel
2. Mechanic
3. Tires
4. Medical
5. Pharmacy
6. Food
7. Grocery
8. Lodging
9. Water
10. Dump station
11. Camping
12. Beach
13. Road warning
14. Emergency information
15. Other

### Phase 4: Verification and correction loop

1. Verify this place
2. Report closed
3. Report wrong location
4. Report bad phone
5. Report wrong hours
6. Report road access changed
7. Report duplicate
8. Admin review queue
9. Last verified date
10. Verified by admin, local, or user type

### Phase 5: Baja field reports

Report types:

1. Road closed
2. Washout
3. Flooding
4. Checkpoint
5. Accident
6. Construction
7. Bad fuel warning
8. Storm damage
9. Cell dead zone
10. Business closed
11. Water unavailable
12. Dump station unavailable

Rules:

1. Reports should expire or require verification.
2. Reports should be moderated or trust weighted.
3. Do not build routing.
4. Directions handoff can continue using Google Maps.

### Phase 6: Mobile and weak signal mode

1. Strengthen mobile web behavior on iPhone Safari and Android Chrome.
2. Add PWA basics.
3. Cache last loaded pins.
4. Cache emergency page.
5. Cache saved places.
6. Cache last weather response.
7. Show last updated time clearly.
8. Never pretend stale data is live.
9. Evaluate Capacitor only after the web app is strong enough.

### Phase 7: Weather and storm depth

1. Preserve native Open Meteo forecast UI.
2. Preserve Windy visual tools.
3. Keep hurricane and storm status understandable.
4. Add clearer updated time and stale data states.
5. Avoid making external NOAA or NHC links the primary user flow unless no better internal option exists.

### Phase 8: Directory usefulness before monetization

1. Improve verified business data.
2. Improve phone, WhatsApp, hours, website, service area, and map linking.
3. Keep public submissions moderated.
4. Keep public directory `APPROVED` only.
5. Add correction flow before paid business features.
6. Avoid business owner dashboards, ads, or payments until trust and usefulness are solid.

### Phase 9: Monetization after trust

Allowed later:

1. Clearly labeled sponsored listings.
2. Featured businesses only after useful organic directory works.
3. Business profile upgrades after verification and corrections are solid.

Not yet:

1. Paywalls around core field data.
2. Business owner dashboards before user usefulness.
3. Ads that distort map trust.
4. Paid placement that overrides verified usefulness.

## Current next best tasks

1. Selected pin bottom sheet
2. Plan Mode search suggestions
3. Better business and category display on map
4. Report correction flow
5. Verification metadata
6. Better filters
7. Weak signal cache plan

## Build rules

Before map work, read:

1. `REPO_MAP.md`
2. `MAP_REGRESSION_CHECKLIST.md`
3. `components/MapClientMapLibre.tsx`
4. Exact files being changed

Protected map behavior:

1. Drive Mode
2. Plan Mode
3. GPS tracking
4. Recenter
5. Heading and bearing
6. Snap back
7. Search submit
8. Pin rendering
9. Selected pin UI
10. Add pin flow

Validation:

Documentation only changes do not require lint or build unless app code changed.

If app code changes, run:

- `npm run lint`
- `npm run build`

Do not claim validation passed unless it actually passed.
