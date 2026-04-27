# Baja 411 Repo Map

This file is the first-stop context file for future AI/code sessions. Read this before making changes.

## Root rule

The GitHub repository is `Bajanomad/baja411`, but the actual Next.js app is nested inside:

```txt
baja411/
```

Do not look for `app/page.tsx` at the repository root. App paths begin under `baja411/`.

## Product rule

Think in this order before changing anything:

1. User need first
2. CEO/business strategy second
3. Engineering execution third

Current product direction:

```txt
GPS first when available.
Todos Santos fallback when GPS is denied, unavailable, or not yet granted.
Keep users inside Baja 411 whenever possible.
External links are attribution/source fallback, not the primary UX.
```

## Verified stack

From `baja411/package.json`:

- Next.js 16.2.4
- React 19.2.4
- TypeScript strict mode
- Tailwind CSS 4
- Prisma 7.8.0
- PostgreSQL adapter
- NextAuth beta, vendored locally under `vendor/`
- MapLibre GL 5.7.1
- Nodemailer

Scripts:

```txt
npm run dev      -> next dev
npm run build    -> next build
npm run start    -> next start
npm run lint     -> eslint
postinstall      -> prisma generate
```

## Path aliases

From `baja411/tsconfig.json`:

```json
"paths": {
  "@/*": ["./*"]
}
```

Imports resolve from the nested `baja411/` folder.

Example:

```ts
import Nav from "@/components/Nav";
```

means:

```txt
baja411/components/Nav.tsx
```

## Current architecture map

```txt
Bajanomad/baja411
└── baja411/
    ├── app/
    │   ├── admin/
    │   ├── api/
    │   │   ├── satellite/route.ts
    │   │   └── weather/storm-status/route.ts
    │   ├── businesses/
    │   ├── map/
    │   │   ├── page.tsx
    │   │   ├── MapLoader.tsx
    │   │   └── MapSearchEnhancer.tsx
    │   ├── weather/page.tsx
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── LocationProvider.tsx
    │   ├── MapClientMapLibre.tsx
    │   ├── BusinessDirectoryClient.tsx
    │   ├── HomeWeatherStrip.tsx
    │   ├── Nav.tsx
    │   ├── Footer.tsx
    │   ├── ConditionalFooter.tsx
    │   ├── PageHero.tsx
    │   ├── HeroCanvas.tsx
    │   ├── HeroWaves.tsx
    │   ├── WaveDivider.tsx
    │   └── ScrollReveal.tsx
    ├── data/
    ├── lib/
    ├── prisma/
    ├── vendor/
    ├── package.json
    ├── next.config.ts
    └── tsconfig.json
```

Verify exact files before editing. GitHub connector fetches can truncate large files.

## Global location system

Path:

```txt
baja411/components/LocationProvider.tsx
```

`LocationProvider` wraps the whole app in `app/layout.tsx`.

It exposes:

```ts
useBajaLocation()
```

Behavior:

```txt
Default location: Todos Santos
If stored GPS exists: load from localStorage
If browser permission is granted: refresh GPS
If user taps Use GPS: request current position
If GPS fails: keep fallback
```

Todos Santos fallback:

```txt
lat: 23.4464
lon: -110.2249
```

Known issue: stored GPS can be stale until refreshed. Later add freshness logic if needed.

## Layout

Path:

```txt
baja411/app/layout.tsx
```

Layout:

```tsx
<LocationProvider>
  <Nav />
  <main className="flex-1">{children}</main>
  <ConditionalFooter />
</LocationProvider>
```

## Home page

Path:

```txt
baja411/app/page.tsx
```

Homepage is separate from internal `PageHero`. It uses:

- `HeroCanvas`
- `HeroWaves`
- `WaveDivider`
- `ScrollReveal`
- `HomeWeatherStrip`

Current primary CTAs:

```txt
Open Map
Weather
```

Known issue: `HomeWeatherStrip` was hardcoded to Todos Santos coordinates and should use `LocationProvider`.

## Navigation

Path:

```txt
baja411/components/Nav.tsx
```

Current nav links:

```txt
Map
Businesses
Weather
News
```

Logo click behavior:

- On `/`, scrolls to top.
- Else routes to `/` and scrolls to top.

## Footer

Path:

```txt
baja411/components/Footer.tsx
```

Current footer is hidden on `/map` by `ConditionalFooter`.

Known issue: footer should include Businesses because nav does.

Footer currently says `Made in La Paz, BCS, México`. Consider changing later if Todos Santos becomes the public anchor.

## PageHero

Path:

```txt
baja411/components/PageHero.tsx
```

Now a compact internal banner. It intentionally avoids giant hero images on internal pages.

Known cleanup: props still include `image`, `alt`, and `pageBg`, but these are no longer used.

## Weather system

Page:

```txt
baja411/app/weather/page.tsx
```

APIs:

```txt
baja411/app/api/weather/storm-status/route.ts
baja411/app/api/satellite/route.ts
```

Weather page uses `useBajaLocation()`.

Behavior:

```txt
GPS available -> Forecast/Rain centered on user
No GPS -> Forecast/Rain centered on Todos Santos
```

Weather UI is button-panel based:

```txt
Forecast
Rain
Storms
Satellite
```

Storm status route fetches the NHC widget HTML server-side, strips text, and classifies:

```txt
low      -> no tropical cyclones found
monitor  -> uncertain / source unavailable
alert    -> hurricane / tropical storm / tropical cyclone terms found
```

Product rule: do not make the main storm flow send users out of Baja 411. If no storms, show a simple internal tile. If storms exist, surface internal storm tools/images where possible.

Known weather issues:

- Storm status should auto-refresh every 5 to 10 minutes later.
- API wording should avoid telling users to leave for NHC as the primary action.
- If alert state shows the NHC iframe, it will still look ugly. Prefer clean proxied images/data later.

Satellite proxy:

```txt
baja411/app/api/satellite/route.ts
```

Allowed hosts:

```txt
cdn.star.nesdis.noaa.gov
www.nhc.noaa.gov
www.ospo.noaa.gov
```

This supports in-app NOAA/NHC imagery without sending users away.

## Map system

Map shell:

```txt
baja411/app/map/page.tsx
```

Dynamic loader:

```txt
baja411/app/map/MapLoader.tsx
```

Enhancer:

```txt
baja411/app/map/MapSearchEnhancer.tsx
```

Main map:

```txt
baja411/components/MapClientMapLibre.tsx
```

Map route is fixed full-screen below the nav using:

```txt
top: var(--nav-height)
height: calc(100dvh - var(--nav-height))
```

`MapLoader` disables SSR for MapLibre and locks page/body scroll.

### MapClientMapLibre responsibilities

- MapLibre map initialization
- Carto raster tile style
- dark/light tile toggle
- Drive/Plan mode
- geolocation watchPosition tracking
- recenter
- location marker
- pin fetch/render
- category filtering
- search submit logic
- add pin modal and submit flow
- selected pin UI

Known issue: the map currently uses its own GPS logic and is not yet fully wired to `LocationProvider`.

Current generic map center found in reviewed code:

```ts
const MAP_CENTER: LngLatLike = [-110.0, 23.5];
```

This should become provider-driven:

```txt
GPS from LocationProvider if available
Todos Santos fallback if not
```

Recenter should use best available location:

```txt
live tracking -> latest GPS
no tracking -> LocationProvider location
fallback -> Todos Santos
```

### MapSearchEnhancer warning

Despite the name, `MapSearchEnhancer.tsx` does more than search:

- collapsible search UI
- search suggestions
- GPS/recenter button enhancement
- heading rotation button
- device orientation permission
- MapLibre `easeTo` monkey patch
- heading cadence timer

This file patches `maplibregl.Map.prototype.easeTo` and strips normal `bearing` values so heading rotation is controlled separately.

Do not casually edit heading/bearing logic. Map rotation currently has two brains:

```txt
MapClientMapLibre.tsx orientation listener
MapSearchEnhancer.tsx orientation/rotation patch
```

Long-term cleanup: move enhancer behavior into React map component. Not urgent, but document before changing.

### Map CSS warnings

`globals.css` contains map behavior, not just styles.

It hides the Drive status pill:

```css
div.absolute.bottom-5.left-3.z-\[1000\].rounded-full {
  display: none !important;
}
```

It also controls the collapsible Plan search classes:

```txt
.map-plan-search
.map-plan-search-open
.map-search-suggestions
```

Need to add collapsed attribution CSS so MapLibre attribution loads as a small info button instead of spreading across the bottom.

## Business directory

Current direction: user utility first, not paid business sales first.

User problem:

People in Baja need to quickly find food, fuel, mechanics, water, propane, medical help, rentals, tours, supplies, and other services without digging through stale Facebook posts, dead links, or random guesswork.

Core user flow:

```txt
Search directory -> find useful business -> call/WhatsApp/directions -> later open exact Baja 411 map pin
```

Known pieces:

- `/businesses`
- `/businesses/[slug]`
- `components/BusinessDirectoryClient.tsx`
- `data/businesses.ts`
- `lib/business-directory.ts`

Known next business layer:

```txt
last verified
needs update
report bad info
suggest correction
community verified
admin moderation
map pin linking
```

Do not start with payments. Build usefulness, coverage, and trust first.

## Prisma/database notes

Path:

```txt
baja411/prisma/schema.prisma
```

Existing models include:

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `PendingOptIn`
- `MapPin`
- `Business`
- `Classified`
- `Event`
- `BlogPost`
- `Review`
- `Report`

Business has optional coordinates already. Future choice:

### Option A: Business as its own map layer

Render business pins directly from business records.

### Option B: Business links to MapPin

Add `mapPinId` later if every map item should be a `MapPin`.

Do not migrate until map/directory behavior is settled.

## Current phase-one checklist

Safe foundation fixes:

1. Add collapsed MapLibre attribution CSS.
2. Wire `HomeWeatherStrip` to `LocationProvider`.
3. Clean storm-status wording so it does not tell users to leave as the main action.
4. Add Businesses to footer.
5. Keep map location provider wiring as the next focused phase.

## Working rule

No full-file rewrites on giant files unless the full file is visible.

Before changing a system:

```txt
Read the file.
Understand who owns the behavior.
Patch the smallest safe part.
Do not stack new behavior on mystery behavior.
Update this repo map when architecture changes.
```
