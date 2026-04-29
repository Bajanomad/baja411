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

1. End user need first
2. CEO/business strategy second
3. Engineering execution third

## Verified stack

From `baja411/package.json` and `baja411/tsconfig.json`:

- Next.js 16.2.4
- React 19.2.4
- TypeScript strict mode
- Tailwind CSS 4
- Prisma 7.8.0
- NextAuth beta vendored under `vendor/`
- MapLibre GL 5.7.1

Path alias:

```json
"@/*": ["./*"]
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
    │   │   └── MapLoader.tsx
    │   ├── weather/page.tsx
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── LocationProvider.tsx
    │   ├── MapClientMapLibre.tsx
    │   ├── HomeWeatherStrip.tsx
    │   ├── Footer.tsx
    │   └── ...
    ├── prisma/
    ├── vendor/
    ├── package.json
    └── tsconfig.json
```

`baja411/app/map/MapSearchEnhancer.tsx` is removed and should not be referenced as current architecture.

## Global location system

`baja411/components/LocationProvider.tsx` wraps the app in `baja411/app/layout.tsx`.

Current status:
- `HomeWeatherStrip` already uses `LocationProvider`.
- Weather page already uses `LocationProvider`.
- `MapClientMapLibre` imports `useBajaLocation` and starts from provider location.
- `MapClientMapLibre` still also owns its own `geolocation.watchPosition` behavior.

Todos Santos fallback coordinates (current canonical values):

```txt
lat: 23.4464
lon: -110.2249
```

## Map system

Map shell:

```txt
baja411/app/map/page.tsx
```

Map loader:

```txt
baja411/app/map/MapLoader.tsx
```

`MapLoader` currently:
- disables SSR for MapLibre client loading
- renders loading UI while map client hydrates
- locks page/body scroll for map-page full-screen behavior

Primary map ownership:

```txt
baja411/components/MapClientMapLibre.tsx
```

`MapClientMapLibre` currently owns:
- MapLibre initialization
- Carto raster tile style
- dark/light map style toggle
- Drive/Plan mode
- geolocation `watchPosition` tracking
- recenter
- snap-back behavior
- device orientation heading updates
- location marker
- pin fetch/render
- category filtering
- search submit logic
- add pin modal and submit flow
- selected pin UI

Risk note:
`MapClientMapLibre.tsx` is a high-risk file because several map behaviors are currently concentrated in one file.

## Map search status

Current reality:
- Plan Mode has search submit logic for towns/categories/pins.
- Plan Mode search suggestions are not currently implemented as a clean React suggestion UI.
- Do not reintroduce DOM enhancer hacks.

Next safe map task:
- implement suggestions inside `MapClientMapLibre` or a proper React child component.

## Completed items

- Collapsed MapLibre attribution CSS exists in `baja411/app/globals.css`.
- `HomeWeatherStrip` uses `LocationProvider`.
- `Footer` includes Businesses.
- `MapSearchEnhancer` has been removed.

## Current next safe tasks

1. Create root `AGENTS.md`.
2. Restore Plan Mode search suggestions as clean React behavior inside the map system.
3. Keep Drive Mode heading/bearing/recenter behavior stable.
4. Verify GPS, fallback, and recenter behavior on mobile Safari and Android Chrome.
5. Improve real business directory content and verification fields.
6. Add `MOBILE_ROADMAP.md` before any mobile architecture work.
7. Decide whether `/directory` should redirect to `/businesses` or be removed later.
