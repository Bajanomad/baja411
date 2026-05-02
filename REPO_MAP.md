# Baja411 Repo Map

Repo: `Bajanomad/baja411`.

## Root rule

The app root is the repository root (not nested).

## Architecture

- App routes: `app/`
- Shared UI/components: `components/`
- Data/docs assets: `data/`
- Libraries/auth/db: `lib/`
- Prisma schema: `prisma/schema.prisma`
- Static assets: `public/`
- Vendor tarballs: `vendor/`
- Product docs: `docs/`

## High-risk ownership

- Map: `components/MapClientMapLibre.tsx`, `app/map/MapLoader.tsx`
- Location/GPS: `components/LocationProvider.tsx`
- Weather: `app/weather/page.tsx`, `components/HomeWeatherStrip.tsx`
- Emergency: `app/emergency/page.tsx`
- Directory/businesses: `app/businesses/*`, `lib/business-directory.ts`
- Prisma/Auth/API: `prisma/schema.prisma`, `app/api/*`, `lib/auth.ts`

Map regression checklist: `MAP_REGRESSION_CHECKLIST.md`.

## Validation

Run from repo root:
- `npm run lint`
- `npm run build`
