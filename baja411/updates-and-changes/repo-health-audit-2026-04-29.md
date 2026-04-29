# Repo Health Audit — 2026-04-29

## 1) Executive summary
- **Current health status: at risk due to missing runtime/tooling dependencies in this environment.** `npm run lint` and `npm run build` both fail before app code validation begins.
- **Biggest operational risk:** deployment/build reproducibility if dependencies are not installed consistently (ESLint package resolution and `next` binary missing).
- **Highest product-risk surfaces (by impact):** map behavior concentration, weather external embed dependencies, and directory fallback data quality.

## 2) What looks healthy
- App shell is clean and consistent: layout wraps navigation, global location provider, content, and conditional footer in one place. (`app/layout.tsx`)
- TypeScript strict mode is enabled, path aliases are clear, and noEmit setup is standard for Next.js apps. (`tsconfig.json`)
- Map route is isolated into a route-level shell + loader + client map split, with dynamic import and suspense fallback. (`app/map/page.tsx`, `app/map/MapLoader.tsx`)
- Directory route is structured server+client appropriately (server data load, client interactivity). (`app/businesses/page.tsx`, `components/BusinessDirectoryClient.tsx`, `lib/business-directory.ts`)
- Emergency page is intentionally conservative with limited, clearly labeled contact surface instead of broad unverified lists. (`app/emergency/page.tsx`)

## 3) What looks risky
- **Build/lint dependency integrity risk:**
  - Lint fails with `Cannot find package 'eslint'` from `eslint.config.mjs` resolution path.
  - Build fails with `next: not found`.
  - This indicates missing or incomplete dependency install in this environment and should be treated as a release pipeline risk if reproducible in CI.
- **Map single-file concentration risk:** major map behavior remains centralized in one large client component, increasing change risk and regression blast radius. (`components/MapClientMapLibre.tsx`)
- **Location fallback mismatch risk:** REPO_MAP documents fallback longitude `-110.2265`, but provider code uses `-110.2249`.
  - Doc/code drift can cause debugging confusion and trust issues during geo QA. (`REPO_MAP.md`, `components/LocationProvider.tsx`)
- **Directory data quality risk:** seed directory entries are explicit placeholders dated 2026-04-27 and can appear in production if DB is empty or query fails. (`data/businesses.ts`, `lib/business-directory.ts`)
- **Weather dependency fragility risk:** weather UI depends heavily on third-party embeds/images (Windy, NOAA assets proxied through `/api/satellite`) and may degrade on slow/blocked networks. (`app/weather/page.tsx`, `components/HomeWeatherStrip.tsx`)

## 4) Likely bugs or broken behavior
- **Potential false-positive geolocation freshness UX:** status labels may show fallback/updating states frequently when permissions are not granted or stale GPS stored values expire, which can feel inconsistent to users.
  - Not a guaranteed bug, but likely UX confusion pattern. (`components/LocationProvider.tsx`, `components/HomeWeatherStrip.tsx`)
- **Directory WhatsApp mapping likely inaccurate:** current transformation maps `business.phone` into `whatsapp` for DB-derived records.
  - This can render WhatsApp links for non-WhatsApp numbers. (`lib/business-directory.ts`, `components/BusinessDirectoryClient.tsx`)
- **Storm panel default level behavior:** defaulting to `monitor` when fetch fails can mask API failures as neutral state.
  - Consider explicit “status unavailable” presentation in future work. (`app/weather/page.tsx`)

## 5) Dead or duplicate code
- `tsconfig.json` excludes `components/MapClient.tsx` and `components/MapClientCdnMapLibre.tsx`; these appear to be legacy map artifacts and should be verified as intentionally retained or removed in a cleanup pass.
- The repo has both `/directory` and `/businesses` routes present in structure; review whether `/directory` is intentional aliasing or stale route debt. (`app/directory/page.tsx`, `app/businesses/page.tsx`)
- Multiple files contain placeholder language (“coming soon”, “placeholder”, “Map soon”), signaling partially staged product content that should be tracked to avoid shipping stale UI copy. (`app/emergency/page.tsx`, `data/businesses.ts`, `components/BusinessDirectoryClient.tsx`)

## 6) High risk files
- `components/MapClientMapLibre.tsx` — concentrated map logic + UX controls + state transitions.
- `app/map/MapLoader.tsx` — page-wide scroll lock and body style mutation; sensitive to mobile UX regressions.
- `components/LocationProvider.tsx` — global geolocation state and permission handling.
- `app/weather/page.tsx` — multi-embed external dependency surface and storm status interpretation.
- `lib/business-directory.ts` — DB/seed fallback behavior and listing normalization rules.
- `prisma/schema.prisma` — auth/domain schema centrality.

## 7) Recommended fixes ranked by priority
1. **P0 — Restore deterministic install/build/lint in CI and local docs**
   - Confirm lockfile + install path are present and `next`/`eslint` binaries resolve in clean environment.
2. **P1 — Add explicit outage-state UX for weather/storm APIs**
   - Differentiate “no storms” vs “storm API unavailable”.
3. **P1 — Separate real phone vs WhatsApp fields in directory mapping**
   - Avoid generating incorrect WhatsApp links from phone-only records.
4. **P1 — Align REPO_MAP fallback coordinates with code**
   - Remove doc/code mismatch and reduce operational confusion.
5. **P2 — Replace or gate placeholder seed listings in production contexts**
   - Prevent trust erosion from obvious placeholder business cards.
6. **P2 — Create a targeted map regression checklist before any map refactors**
   - Drive mode, recenter, heading, plan mode search, and pin render checks.

## 8) What not to touch casually
- `components/MapClientMapLibre.tsx`
- `app/map/MapLoader.tsx`
- `components/LocationProvider.tsx`
- `app/weather/page.tsx`
- `app/emergency/page.tsx`
- `prisma/schema.prisma`
- auth and deployment pathways (`app/api/auth/[...nextauth]/route.ts`, Vercel settings outside this audit)

## 9) Validation results
Commands run from `baja411/`:
- `npm run lint` → **failed**: `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'eslint' imported from /workspace/The-Baja-Nomad/baja411/eslint.config.mjs`
- `npm run build` → **failed**: `sh: 1: next: not found`

Validation could not complete in this Codex environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.

## 10) Suggested next Codex tasks
1. Environment reproducibility task: verify `npm ci`/install path and ensure lint/build can run in clean CI-like container.
2. Directory trust task: add guardrails so placeholder seed data cannot silently appear in production mode.
3. Weather resilience task: add explicit UI states for satellite/storm API downtime and stale fetch failures.
4. Map safety task: write a map behavior regression checklist/playbook before future map feature work.
5. Docs hygiene task: sync REPO_MAP fallback coordinate and audit stale route/docs references.
