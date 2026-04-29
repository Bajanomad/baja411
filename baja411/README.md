# Baja411 App (Nested Next.js Project)

**Actual app folder:** `baja411/`

This directory contains the real Baja411 application.

## Stack

From `package.json` and current project configuration:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- MapLibre
- NextAuth (vendored locally under `vendor/`)

## Scripts

Run these from inside `baja411/`:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Import paths

Path aliases use:

```json
"@/*": ["./*"]
```

So imports like `@/components/Nav` resolve from this nested `baja411/` folder.

## Before changing code

Agents should read `REPO_MAP.md` first to understand ownership, architecture, and high-risk behavior areas before editing application files.
