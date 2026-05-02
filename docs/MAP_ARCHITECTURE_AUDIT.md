# MAP_ARCHITECTURE_AUDIT

## 1) Executive summary

`components/MapClientMapLibre.tsx` is currently the single owner of most map behavior and much of map UI. It initializes MapLibre, owns map instance lifecycle, GPS watch behavior, Drive/Plan mode behavior, search, suggestions, pin filtering, pin rendering, pin selection, add-pin flow, dark/light style toggling, orientation-based heading rotation, recenter behavior, and several overlays/modals.

Practical impact:
- This concentration increases regression risk for core map behavior.
- The file mixes imperative map engine code and React UI state in one place.
- There are clear low-risk UI extraction opportunities that can improve maintainability without touching map behavior.
- Heading/bearing/rotation is still active in current Drive behavior, even if product direction says rotation is no longer required.

Low-risk direction:
- First extraction should be **pure UI only** (e.g., search input/suggestions panel component) with no MapLibre ownership move.
- Map instance ownership, listeners, geolocation watch lifecycle, and marker lifecycle should remain in place initially.

---

## 2) Current file inventory

### `components/MapClientMapLibre.tsx`
- **Main purpose:** Full interactive map screen and control surface.
- **Major responsibilities:**
  - MapLibre init/teardown, style switching, controls, interaction listeners.
  - Drive/Plan mode state machine and UI.
  - GPS watch tracking and recenter/snap-back.
  - Device orientation heading smoothing and map bearing updates.
  - Pins fetch/filter/render/select.
  - Search submit, search suggestions, suggestion application.
  - Add-pin modal workflow and submit API call.
  - Directions handoff to Google Maps.
- **Risk level:** **Very High**.
- **Coupling notes:**
  - Heavy coupling between `mode`, `following`, `tracking`, `latestLocationRef`, `headingRef`, and map `easeTo` calls.
  - Search behavior and category filtering interact via `visibleCategories` and `runSearch`.
  - Marker rendering is rebuilt from React state changes and relies on imperative marker refs.

### `app/map/MapLoader.tsx`
- **Main purpose:** Dynamically load map client and lock page scroll.
- **Major responsibilities:**
  - `next/dynamic` client-only loading of map component.
  - Loading UI while map bundle loads.
  - Document/body scroll lock while map page active.
- **Risk level:** **Medium**.
- **Coupling notes:**
  - CSS/document state side effects (`html/body` styles) can affect global page behavior if modified incorrectly.

### `app/map/MapSearchEnhancer.tsx`
- **Status:** **Not present** (confirmed missing).
- **Main purpose:** N/A currently.
- **Risk level:** N/A.
- **Coupling notes:** Repo map indicates it was removed and should not be treated as active architecture.

### `components/LocationProvider.tsx`
- **Main purpose:** App-wide location context with GPS/fallback state.
- **Major responsibilities:**
  - Defines fallback location (Todos Santos).
  - Reads/writes cached location from localStorage.
  - Performs one-shot `getCurrentPosition` when permission is granted/requested.
  - Tracks geolocation permission state and exposes `requestLocation`.
- **Risk level:** **High** (cross-cutting app context).
- **Coupling notes:**
  - Map component consumes provider location but also runs an independent GPS `watchPosition`, creating dual location logic.

---

## 3) Responsibility map

| Responsibility | Current file | Main functions/hooks/state | User visible behavior | Risk | Notes |
|---|---|---|---|---|---|
| Map initialization | `MapClientMapLibre.tsx` | `useEffect` init map, `mapRef` | Map appears/interacts | Very High | Core ownership here |
| Map style | `MapClientMapLibre.tsx` | `dark`, `createRasterStyle`, `map.setStyle` | Dark/light base map toggle | Medium | Uses localStorage key |
| Markers | `MapClientMapLibre.tsx` | `markersRef`, marker rebuild effect | Emoji pins on map | High | Imperative lifecycle |
| Pin data loading | `MapClientMapLibre.tsx` | `refreshPins`, `fetch('/api/pins')` | Pin list available | Medium | No centralized data layer |
| Pin rendering | `MapClientMapLibre.tsx` | `visiblePins`, marker effect | Filtered pins show/hide | High | Driven by search+category state |
| Pin selection | `MapClientMapLibre.tsx` | marker click handler, `selectedPin` | Bottom card opens | High | Also changes mode/following |
| Add pin flow | `MapClientMapLibre.tsx` | `showAddModal`, `pendingLatLng`, `handleSubmitPin` | Warning + placement + form | High | Tied to map click mode |
| Filters | `MapClientMapLibre.tsx` | `visibleCategories`, `toggleCategory` | Category filter chips/menu | Medium | Coupled to search results |
| Categories | `MapClientMapLibre.tsx` | constants/labels/emojis/terms | Category names/icons/search match | Low | Could become shared module later |
| Search input | `MapClientMapLibre.tsx` | `search`, input handlers | Plan Mode search box | Medium | Pure UI mostly |
| Search results | `MapClientMapLibre.tsx` | `runSearch`, `fitPins`, `lastSearchHint` | Center/focus or result hint | High | Mutates map view |
| Search suggestions | `MapClientMapLibre.tsx` | `searchSuggestions` memo, `applySuggestion` | Suggestion list and tap behavior | Medium | UI + behavior mixed |
| Plan Mode | `MapClientMapLibre.tsx` | `mode`, `switchToPlan` | Plan controls enabled | High | Drives many conditional branches |
| Drive Mode | `MapClientMapLibre.tsx` | `mode`, `switchToDrive`, snap-back | Tracking mode behavior | Very High | Tied to heading/recenter |
| GPS location | `MapClientMapLibre.tsx` + `LocationProvider.tsx` | `watchPosition` + provider `getCurrentPosition` | Live location/tracking badge | Very High | Dual source pattern |
| Fallback location | `LocationProvider.tsx` | `TODOS_SANTOS` | Initial non-GPS center | Medium | Used via context in map |
| Recenter control | `MapClientMapLibre.tsx` | `recenter` | Center-me behavior | Very High | Bearing/zoom/mode dependent |
| Directions handoff | `MapClientMapLibre.tsx` | Google Maps URL in pin card | Opens Google Maps directions | Low | Simple external link |
| Device orientation | `MapClientMapLibre.tsx` | orientation listeners effect | Heading-based bearing updates | High | Active in Drive+following |
| Heading | `MapClientMapLibre.tsx` | `headingRef`, `smoothHeading`, `getHeading` | Map rotates toward heading | High | Potentially legacy vs product direction |
| Bearing | `MapClientMapLibre.tsx` | `map.easeTo({bearing})` in several flows | Camera bearing changes | High | Embedded in recenter/tracking |
| Rotation | `MapClientMapLibre.tsx` | `dragRotate`, `touchZoomRotate.enableRotation` | User map rotation gestures | High | Still explicitly enabled |
| Mobile touch behavior | `MapClientMapLibre.tsx` + `MapLoader.tsx` | touch listeners + scroll lock | Touch map gestures & no page scroll | High | Sensitive UX coupling |
| Weather related map interaction | None found in these files | N/A | N/A | Low | No direct weather coupling in map component |

---

## 4) Safe extraction candidates

### Candidate A (Top priority): `components/map/PlanSearchPanel.tsx`
1. **Proposed file:** `components/map/PlanSearchPanel.tsx`
2. **Current source:** `components/MapClientMapLibre.tsx`
3. **Would own:** Plan search input form + clear/go buttons + suggestion list rendering.
4. **Must not own:** `runSearch`, `applySuggestion` map-side effects, map refs, pin filtering logic.
5. **Props needed:** `search`, `setSearch`, `showSuggestions`, `searchSuggestions`, `onSubmit`, `onApplySuggestion`, `onClear`, theme classes/flags.
6. **Callbacks needed:** `onSearchChange`, `onSubmit`, `onSuggestionSelect`, `onClear`.
7. **Shared types needed:** `SearchSuggestion` type export.
8. **Why safe:** Mostly presentational; behavior remains injected from parent.
9. **What could go wrong:** Event ordering (Enter/blur/click), focus handling, suggestion visibility toggles.
10. **Risk:** Low.
11. **Manual tests:** Enter submit, click suggestion, clear search, plan/drive toggle.

### Candidate B: `components/map/CategoryFilterSheet.tsx`
1. **Proposed file:** `components/map/CategoryFilterSheet.tsx`
2. **Current source:** `components/MapClientMapLibre.tsx`
3. **Would own:** Filter panel UI, category buttons, all/none/close buttons.
4. **Must not own:** Actual `visibleCategories` state logic shape or pin filtering algorithm.
5. **Props needed:** `isOpen`, `categories`, `visibleCategories`, `visibleCount`, `onToggle`, `onAll`, `onNone`, `onClose`, `dark`.
6. **Callbacks:** `onToggleCategory`, `onShowAll`, `onShowNone`, `onClose`.
7. **Shared types:** category key union optional later.
8. **Why safe:** UI-only extraction with callback contract.
9. **Risks:** Visual regressions, wrong key mapping causing category mismatch.
10. **Risk:** Low-Medium.
11. **Tests:** Toggle each category, all/none, verify marker updates.

### Candidate C: `components/map/SelectedPinCard.tsx`
- Safe if extracted as pure presentational card.
- Keep selection state and navigation URL creation in parent initially.
- Risk low.

### Candidate D: `components/map/AddPinModals.tsx`
- Could combine warning modal + placement prompt + form modal UI.
- Keep map click/add-mode lifecycle in parent.
- Risk medium because flow branches and auth redirect timing.

### Candidate E: `components/map/FloatingMapControls.tsx`
- Owns top-right style toggle and bottom-right action buttons UI only.
- Keep `recenter`, mode switch handlers, add/filter toggles in parent.
- Risk low-medium.

---

## 5) Things not safe to extract yet

1. **MapLibre map instance ownership (`mapRef`)**
   - **Why risky:** Central imperative object with listeners and cleanup.
   - **Coupled to:** tracking, markers, orientation, add pin click mode, recenter.
   - **Missing knowledge:** full regression coverage around listener timing.
   - **Needed tests:** map load/unmount/remount, no leaked listeners, no duplicate events.

2. **Map event listeners + snap-back timer logic**
   - **Why risky:** User interaction directly affects Drive follow/snap-back behavior.
   - **Coupled to:** `following`, `modeRef`, `latestLocationRef`, `headingRef`.
   - **Needed tests:** drag/rotate/pitch and verify delayed snap-back in Drive only.

3. **Marker lifecycle effect**
   - **Why risky:** Marker add/remove is imperative and tied to visibility filters.
   - **Coupled to:** `visiblePins`, selection behavior.
   - **Needed tests:** category/search changes, marker count consistency, click selection still works.

4. **GPS watch lifecycle (`watchPosition`)**
   - **Why risky:** Browser API lifecycle, permissions, first-fix behavior.
   - **Coupled to:** status indicator, follow mode, recenter.
   - **Needed tests:** allow/deny GPS, pending state, plan vs drive transitions.

5. **Orientation heading effect**
   - **Why risky:** Affects bearing and user camera.
   - **Coupled to:** Drive/following recenter logic.
   - **Needed tests:** moving heading with phone orientation; ensure no jitter/over-rotation.

---

## 6) Heading, bearing, compass, rotation audit

| Item | Location | Status | Notes |
|---|---|---|---|
| `headingRef` | `MapClientMapLibre.tsx` | Active | Stores smoothed heading for bearing updates/recenter |
| `normalizeDegrees` | same | Active utility | Used in heading calculations |
| `headingDifference` | same | Active utility | Used for smoothing/min delta logic |
| `smoothHeading` | same | Active utility | Smoothing factor 0.22 |
| `getHeading` | same | Active utility | Uses `webkitCompassHeading` and `alpha` |
| Orientation listeners (`deviceorientationabsolute`, `deviceorientation`) | same effect | Active | Registered on mount; removed on unmount |
| Device orientation permission call | none found | Not present | No explicit `requestPermission()` call |
| `map.easeTo({ bearing: smoothed })` | orientation effect | Active | Drive + following gated |
| `map.easeTo({ bearing: ... })` in recenter/tracking/snap-back | multiple | Active | Bearing used widely |
| Map interaction rotation settings (`dragRotate`, `pitchWithRotate`, `touchPitch`, `touchZoomRotate.enableRotation`) | map init | Active | Manual user rotation enabled |
| UI compass/heading element | none explicit | Likely absent | No visible compass button/needle |

Cross-impact findings:
- **Affects recenter:** Yes (bearing included in recenter/ease flows).
- **Affects search:** Indirectly (search recenters map but doesn’t directly update heading state).
- **Affects Google Maps handoff:** No (directions link only uses lat/lng).
- **Likely removable later:** Possibly, but only after proving no Drive UX dependency.
- **Tests before removal:** Drive tracking with GPS, drag then snap-back, recenter behavior, touch rotation gestures, no unexpected bearing lock.

Dead/legacy suspicion:
- Not clearly dead today; rotation pipeline is still active code path.
- Product says no longer required, but implementation remains live and integrated.

---

## 7) Search audit

1. **Search input lives:** `MapClientMapLibre.tsx` Plan-mode JSX form.
2. **Search state lives:** `search`, `lastSearchHint`, `showSuggestions`, derived `searchSuggestions`.
3. **Suggestions generated:** `useMemo searchSuggestions` using towns/categories/visible pins.
4. **Suggestions displayed:** Inline JSX `map-search-suggestions` block.
5. **Enter behavior:** `handleSearchSubmit` → `runSearch(search)`.
6. **Suggestion click behavior:** `applySuggestion`; pin suggestion directly selects pin + recenters, others call `runSearch`.
7. **Search failure behavior:** Hint becomes `No results yet`.
8. **Plan Mode tie:** Yes, search UI/suggestions only render in Plan mode.
9. **Map center/zoom mutation:** Yes (`easeTo`, `fitBounds`).
10. **Touches pins/filters:** Yes. `runSearch` may auto-set `visibleCategories` when category term detected.
11. **Can UI be safely extracted first?:** Yes, if extraction is presentational and callbacks keep behavior in parent.
12. **Awkwardness/bugs seen in code:**
   - Mixed concerns: suggestion composition + map mutation + UI all co-located.
   - Search filtering applies globally to `visiblePins` via `pinMatchesSearch(pin, search)`, so typing affects marker visibility in real time before submit.
   - Category-detected searches mutate category visibility, which may surprise users after subsequent searches.

Recommendation: extract search **UI shell first**, keep behavior local, then adjust behavior in a later dedicated phase.

---

## 8) Location and fallback audit

1. **GPS source of truth:** Dual.
   - Provider offers context location.
   - Map runs own `watchPosition` and uses `latestLocationRef`.
2. **LocationProvider used?:** Yes, map imports `useBajaLocation()`.
3. **Fallback location defined:** `LocationProvider.tsx` `TODOS_SANTOS` constant.
4. **Fallback is Todos Santos?:** Yes.
5. **Fallback coords match required?:** Yes, lat `23.4464`, lon `-110.2265`.
6. **GPS denied behavior:**
   - Provider request failure keeps current/fallback.
   - Map watch error sets `tracking=false`, `following=false`.
7. **GPS unavailable behavior:** tracking never starts; map relies on provider/fallback center.
8. **GPS pending behavior:** map sets `locating=true` until watch callback or error.
9. **Stale location behavior:** Provider uses freshness window (30 min) for stored GPS before fallback.
10. **Duplication:** Yes, map duplicates location concerns that could later be rationalized with provider strategy (high-risk refactor; not phase 1).

---

## 9) Recommended refactor path

### Phase 1 (tiny, low risk)
- **Goal:** Extract pure UI-only Plan search panel.
- **Likely files:** `components/MapClientMapLibre.tsx`, new `components/map/PlanSearchPanel.tsx`.
- **User-visible change:** None intended.
- **Risk:** Low.
- **Why first:** Best maintainability gain with minimal map behavior risk.
- **Manual tests:** Plan search typing/enter/suggestion tap/clear; drive-plan toggle.
- **Stop when:** UI renders identical and behavior unchanged.

### Phase 2 (search structure)
- **Goal:** Separate search domain logic (query parsing/suggestions) from render tree.
- **Likely files:** map component + new search utility/hook file.
- **User-visible change:** None or very minor copy/state stabilization.
- **Risk:** Medium.
- **Why before next:** Improves confidence before touching heading/rotation paths.
- **Manual tests:** Full search matrix (town/category/pin/no results, category side effects).
- **Stop when:** Behavior parity confirmed.

### Phase 3 (heading/bearing/rotation cleanup)
- **Goal:** Prove what is product-unneeded and isolate/remove cautiously.
- **Likely files:** mainly `MapClientMapLibre.tsx`.
- **User-visible change:** Potentially reduced auto-rotation in Drive (if approved).
- **Risk:** High.
- **Why after phase 2:** Need clearer map/search structure and stable baseline first.
- **Manual tests:** Drive tracking, recenter, snap-back, touch rotate, denied GPS.
- **Stop when:** Any regression in recenter/snap-back/tracking feel is observed.

### Phase 4 (deeper cleanup)
- **Goal:** Reassess location duplication and marker/event isolation only if prior phases clean.
- **Likely files:** map component + `LocationProvider` and potential new hooks.
- **Risk:** Very High.
- **Why last:** Core behavior coupling and high regression potential.
- **Manual tests:** Full map regression checklist on phone + desktop.
- **Stop when:** Unknown coupling appears or test confidence drops.

---

## 10) Manual test checklist

Desktop + phone checklist:
1. Open home page.
2. Open map.
3. Confirm map loads.
4. Pan map.
5. Zoom map.
6. Select pin.
7. Close pin details.
8. Run add pin flow (if enabled/account available).
9. Filter pins.
10. Switch to Plan Mode and search.
11. Type query.
12. Press Enter.
13. Tap suggestion (if shown).
14. Clear search.
15. Use center/recenter button.
16. Allow GPS.
17. Deny GPS.
18. Confirm fallback location behavior.
19. Confirm fallback is Todos Santos.
20. Confirm directions button opens Google Maps handoff.
21. Confirm touch gestures feel smooth on phone.
22. Confirm no unexpected snap-back outside intended Drive behavior.
23. Confirm no console errors.
24. Confirm no hydration errors.
25. Confirm no build errors.

---

## 11) Validation

Commands attempted:
- `npm run lint`
- `npm run build`

(Results recorded after command execution in this environment.)

---

## 12) Final recommendation

1. **Safest first extraction candidate:** Plan search UI component (`PlanSearchPanel`) with behavior callbacks passed from parent.
2. **Most likely to break if handled badly:** Map instance/listener lifecycle + recenter/follow/snap-back interplay.
3. **Looks legacy but needs proof before removal:** Heading/bearing/rotation pipeline (orientation listeners + bearing `easeTo`) since it is still active.
4. **Exact next Codex task:** “Extract Plan-mode search form + suggestion list into `components/map/PlanSearchPanel.tsx` as a pure presentational component, with zero behavior changes and full manual regression checklist execution.”
