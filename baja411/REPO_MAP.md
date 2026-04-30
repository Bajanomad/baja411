# Baja 411 Repo Map

This is the first stop context file for future AI and code sessions. Read this before making changes.

## Root rule

The GitHub repository is:

```txt
Bajanomad/baja411
```

The actual Next.js app is nested inside:

```txt
baja411/
```

Do not look for `app/page.tsx` at the repository root. App paths begin under `baja411/`.

## Product rule

Think in this order before changing anything:

1. End user need
2. CEO and business strategy
3. Engineering execution

## Verified stack

From `baja411/package.json` and `baja411/tsconfig.json`:

1. Next.js 16.2.4
2. React 19.2.4
3. TypeScript strict mode
4. Tailwind CSS 4
5. Prisma 7.8.0
6. NextAuth beta vendored under `vendor/`
7. MapLibre GL 5.7.1

Path alias:

```json
"@/*": ["./*"]
```

## Agent and guideline files

Shared repo guidelines:

```txt
PROJECT_GUIDELINES.md
```

Codex and OpenAI coding agents:

```txt
AGENTS.md
baja411/AGENTS.md
```

Claude and Claude Code:

```txt
baja411/CLAUDE.md
```

Everyone should read this `REPO_MAP.md` first.

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
    │   ├── emergency/page.tsx
    │   ├── map/
    │   │   ├── page.tsx
    │   │   └── MapLoader.tsx
    │   ├── rules-permits/page.tsx
    │   ├── weather/page.tsx
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── Footer.tsx
    │   ├── HomeWeatherStrip.tsx
    │   ├── LocationProvider.tsx
    │   ├── MapClientMapLibre.tsx
    │   ├── Nav.tsx
    │   └── ...
    ├── data/
    ├── prisma/
    ├── vendor/
    ├── MAP_REGRESSION_CHECKLIST.md
    ├── package.json
    └── tsconfig.json
```

`baja411/app/map/MapSearchEnhancer.tsx` was removed and should not be referenced as current architecture. If it reappears, treat it as high risk.

## Current product priorities

1. Keep SOS emergency access clean and reliable.
2. Protect map behavior.
3. Keep weather and storm tools useful inside Baja411.
4. Improve Plan Mode search suggestions when scoped.
5. Preserve Drive Mode heading, bearing, recenter, and snap back behavior.
6. Improve Local Directory usefulness with verified data.
7. Keep navigation and footer clean.
8. Keep the directory user facing, not sales first.

## Global location system

`baja411/components/LocationProvider.tsx` wraps the app in `baja411/app/layout.tsx`.

Current status:

1. `HomeWeatherStrip` uses `LocationProvider`.
2. Weather page uses `LocationProvider`.
3. `MapClientMapLibre` imports `useBajaLocation` and starts from provider location.
4. `MapClientMapLibre` still owns its own `geolocation.watchPosition` behavior.

Todos Santos fallback coordinates:

```txt
lat: 23.4464
lon: -110.2265
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

Primary map ownership:

```txt
baja411/components/MapClientMapLibre.tsx
```

Map regression checklist:

```txt
baja411/MAP_REGRESSION_CHECKLIST.md
```

Use the checklist before and after any map-related change.

`MapClientMapLibre` currently owns:

1. MapLibre initialization
2. Carto raster tile style
3. Dark and light map style toggle
4. Drive and Plan mode
5. Geolocation `watchPosition` tracking
6. Recenter behavior
7. Snap back behavior
8. Device orientation heading updates
9. Location marker
10. Pin fetch and render
11. Category filtering
12. Search submit logic
13. Add pin modal and submit flow
14. Selected pin UI

Risk note:

`MapClientMapLibre.tsx` is high risk because several map behaviors are concentrated in one file.

## Map search status

Current reality:

1. Plan Mode has search submit logic for towns, categories, and pins.
2. Plan Mode search suggestions are not currently implemented as a clean React suggestion UI.
3. Do not reintroduce DOM enhancer hacks.

Next safe map task:

Implement suggestions inside `MapClientMapLibre` or a proper React child component.

## Emergency system

Emergency access is a global safety layer, not a directory category.

Emergency route:

```txt
baja411/app/emergency/page.tsx
```

SOS access should open the emergency page first and should not auto call emergency services.

Emergency information must be verified before publishing. Do not publish guessed phone numbers or unverified municipal numbers.

## Directory system

Local Directory route:

```txt
baja411/app/businesses/page.tsx
```

`baja411/app/directory/page.tsx` redirects to `/businesses`.

Local Directory intake docs:

```txt
DIRECTORY_INTAKE.md
baja411/data/DIRECTORY_FIELDS.md
baja411/data/directory-intake-template.csv
baja411/data/directory-intake-staging.md
```

Directory rules:

1. Keep main categories light.
2. Use subcategories and tags for detail.
3. Build usefulness, trust, verification, corrections, WhatsApp and phone access, hours, service area, and map linking first.
4. Do not start with payments, ads, or business owner dashboards.

Directory UX note:

- On iPhone, Enter/Search now dismisses the keyboard by blurring the real input in `components/BusinessDirectoryClient.tsx`.

## Weather system

Weather route:

```txt
baja411/app/weather/page.tsx
```

Current weather architecture:

1. Forecast is native Baja411 UI inside `app/weather/page.tsx`.
2. Forecast data source is Open-Meteo.
3. Forecast modes are Today, 7 Day, and 16 Day.
4. Windy remains for visual tools: rain, wind, storms, and satellite map layers.
5. Do not replace the native forecast panel with the old Windy forecast iframe.

Weather support:

```txt
baja411/components/HomeWeatherStrip.tsx
baja411/app/api/weather/storm-status/route.ts
baja411/app/api/satellite/route.ts
```

Satellite note:

- Satellite proxy behavior in `app/api/satellite/route.ts` was rolled back to known working behavior after stricter hardening broke satellite tools.

Weather should stay useful inside Baja411. Prioritize forecast, rain, storms, satellite, and hurricane tracking.

## Rules and Permits page

Rules route:

```txt
baja411/app/rules-permits/page.tsx
```

Rules and regulation explanations belong there. Directory should only include actionable places or services, such as license offices or permit locations.

## Validation

For app changes, agents should attempt:

```bash
cd baja411 && npm run lint
cd baja411 && npm run build
```

Do not claim validation passed unless it actually passed.

If tooling is missing, report:

```txt
Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.
```
