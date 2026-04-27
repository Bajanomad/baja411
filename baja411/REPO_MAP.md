# Baja 411 Repo Map

This file is the first-stop context file for future AI/code sessions. Read this before making changes.

## Important root detail

The GitHub repository is `Bajanomad/baja411`, but the actual Next.js app is nested inside:

```txt
baja411/
```

Do not look for `app/page.tsx` at the repository root. The working app paths begin under `baja411/`.

## Verified app stack

From `baja411/package.json`:

- Next.js 16.2.4
- React 19.2.4
- TypeScript
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

This means imports resolve from the nested `baja411/` folder.

Examples:

```ts
import Nav from "@/components/Nav";
import { db } from "@/lib/db";
```

## Verified hierarchy

This is the verified working structure discovered through GitHub fetches and direct file reads:

```txt
Bajanomad/baja411
└── baja411/
    ├── app/
    │   ├── admin/
    │   │   └── page.tsx
    │   ├── api/
    │   │   └── admin/
    │   │       └── emails/
    │   ├── map/
    │   │   └── page.tsx
    │   ├── weather/
    │   │   └── page.tsx
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── Nav.tsx
    │   ├── ConditionalFooter.tsx
    │   ├── HeroCanvas.tsx
    │   ├── HeroWaves.tsx
    │   ├── WaveDivider.tsx
    │   ├── ScrollReveal.tsx
    │   ├── HomeWeatherStrip.tsx
    │   └── PageHero.tsx
    ├── lib/
    │   ├── auth.ts
    │   └── db.ts
    ├── prisma/
    │   └── schema.prisma
    ├── vendor/
    ├── package.json
    ├── next.config.ts
    └── tsconfig.json
```

There may be additional files and nested routes. Verify before editing.

## Current page/routing notes

### Home

Path:

```txt
baja411/app/page.tsx
```

Current homepage uses:

- `HeroCanvas`
- `HeroWaves`
- `WaveDivider`
- `ScrollReveal`
- `HomeWeatherStrip`

It includes the main hero, Open Map button, Weather button, Drive Mode section, and Plan Mode section.

### Layout

Path:

```txt
baja411/app/layout.tsx
```

The root layout:

- Imports `./globals.css`
- Uses `Plus_Jakarta_Sans`
- Mounts `Nav`
- Wraps pages in `<main className="flex-1">`
- Mounts `ConditionalFooter`

### Nav

Path:

```txt
baja411/components/Nav.tsx
```

Current nav links are controlled by a `links` array.

Current verified links:

```ts
const links = [
  { href: "/map", label: "Map" },
  { href: "/weather", label: "Weather" },
  { href: "/news", label: "News" },
];
```

To add the business directory to desktop and mobile nav, add:

```ts
{ href: "/businesses", label: "Businesses" }
```

### Map

Path:

```txt
baja411/app/map/page.tsx
```

The map route is a fixed full-screen view below the nav. It loads `MapLoader` inside `Suspense`.

Future business directory map links should likely route to:

```txt
/map?pin=PIN_ID
```

or, if using business IDs first:

```txt
/map?business=BUSINESS_SLUG
```

Preferred future route:

```txt
/map?pin=PIN_ID
```

### Weather

Path:

```txt
baja411/app/weather/page.tsx
```

Client page using:

- `PageHero`
- `ScrollReveal`
- collapsible weather panels
- Windy embeds
- NOAA/NHC imagery through `/api/satellite`

### Admin

Path:

```txt
baja411/app/admin/page.tsx
```

Current admin imports:

```ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import PinsAdmin from "./PinsAdmin";
import EmailsAdmin from "./EmailsAdmin";
```

Admin currently checks for a signed-in user and requires `ADMIN` role. It includes Pin Moderation and Subscribers sections.

Future business moderation should probably extend this admin pattern instead of creating a separate disconnected admin system.

## Styling notes

Path:

```txt
baja411/app/globals.css
```

Theme tokens currently include:

- `background`
- `foreground`
- `jade`
- `jade-light`
- `jade-dim`
- `sunset`
- `sunset-dim`
- `sand`
- `night`
- `muted`
- `border`

Useful shared classes:

- `label-tag`
- `reveal`
- `reveal-delay-1`
- `reveal-delay-2`
- `reveal-delay-3`
- `reveal-delay-4`

Business directory pages should reuse this existing design system.

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

Existing business directory schema:

```prisma
model Business {
  id           String           @id @default(cuid())
  name         String
  category     BusinessCategory
  town         Town
  address      String?
  phone        String?
  website      String?
  description  String?
  photos       String[]
  lat          Float?
  lng          Float?
  status       PinStatus        @default(PENDING)
  authorId     String
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt
  lastVerified DateTime?

  author       User             @relation(fields: [authorId], references: [id])
  reviews      Review[]
  reports      Report[]
}
```

Existing business categories:

```prisma
enum BusinessCategory {
  RESTAURANT
  BAR
  BAKERY
  BREWERY
  HOTEL
  RENTAL
  MECHANIC
  TIRE_SHOP
  FUEL
  MEDICAL
  DENTAL
  PHARMACY
  GROCERY
  OTHER
}
```

Existing towns:

```prisma
enum Town {
  CERRITOS
  PESCADERO
  TODOS_SANTOS
  LA_PAZ
  CABO_SAN_LUCAS
  SAN_JOSE_DEL_CABO
  LORETO
  OTHER
}
```

## Business directory product direction

Always think in this order:

1. User need first
2. CEO/business strategy second
3. Engineering execution third

The business directory is for users, not for selling businesses yet.

User problem:

People in Baja need to quickly find food, fuel, mechanics, water, propane, medical help, rentals, tours, real estate, supplies, and other local services without digging through stale Facebook posts, dead links, or random guesswork.

Core user flow:

```txt
Search directory -> find useful business -> call/WhatsApp/directions -> later open exact Baja 411 map pin
```

Recommended first route:

```txt
/businesses
```

Recommended future routes:

```txt
/businesses/[slug]
/api/businesses
/api/businesses/suggest
/admin/businesses
/map?pin=PIN_ID
```

Recommended build sequence:

1. Create visible `/businesses` landing/directory page with static data.
2. Add nav link to `components/Nav.tsx`.
3. Add a simple static data file such as `baja411/data/businesses.ts`.
4. Add search/filter UI on the client or simple server-rendered filter structure.
5. Add detail route `/businesses/[slug]`.
6. Wire to Prisma/API once the front-end shape is proven.
7. Add real businesses.
8. Link approved businesses to map pins.

Do not start by building payments or paid placement. Build usefulness and directory inventory first.

## Future business to map relationship

Current `Business` has optional `lat` and `lng`, but no direct `mapPinId` relation.

Possible future choices:

### Option A: Business as its own map layer

Keep coordinates on `Business` and render business pins directly from business records.

Simpler.

### Option B: Business links to MapPin

Add a nullable relation later:

```prisma
mapPinId String?
mapPin   MapPin? @relation(fields: [mapPinId], references: [id])
```

Cleaner if all map items should be `MapPin` records.

Do not migrate this until the directory page and map behavior are clear.

## Suggested first business directory files

Create:

```txt
baja411/app/businesses/page.tsx
baja411/data/businesses.ts
```

Then update:

```txt
baja411/components/Nav.tsx
```

First version should include:

- Hero explaining why the directory is useful
- Search input UI
- Category chips
- Town chips
- Static seeded business cards
- Call / Website / Directions actions
- Disabled or future-state `View on Map` button when no pin exists
- Suggest Business CTA

Suggested page headline:

```txt
Find Local Businesses in Baja Sur
```

Suggested supporting copy:

```txt
Need food, fuel, repairs, supplies, rentals, medical help, or local services? Baja 411 helps you search useful businesses across Cerritos, El Pescadero, Todos Santos, La Paz, Cabo, and the Baja corridor. The directory starts here, and soon listings will connect directly to map pins so you can find the place and guide yourself there.
```

## GitHub connector notes for future AI sessions

If directory listing is unavailable, use GitHub `fetch` on tree URLs as a workaround.

Examples:

```txt
https://github.com/Bajanomad/baja411/tree/main/baja411
https://github.com/Bajanomad/baja411/tree/main/baja411/app
https://github.com/Bajanomad/baja411/tree/main/baja411/app/api
https://github.com/Bajanomad/baja411/tree/main/baja411/components
https://github.com/Bajanomad/baja411/tree/main/baja411/lib
https://github.com/Bajanomad/baja411/tree/main/baja411/prisma
```

Use direct file fetches for exact content:

```txt
baja411/app/page.tsx
baja411/app/layout.tsx
baja411/components/Nav.tsx
baja411/app/globals.css
baja411/prisma/schema.prisma
baja411/package.json
baja411/tsconfig.json
baja411/next.config.ts
```

## Working rule

Do not make repo-level assumptions from the repository root. The app is nested. Start from `baja411/REPO_MAP.md`, then inspect the exact files you plan to modify.
