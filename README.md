# Baja411

Baja411 is a map-first field utility for Baja California Sur travelers, locals, expats, and overland drivers.

## Repository structure

The repository root is now the **actual Next.js app root**.

- App routes: `app/`
- Components: `components/`
- Prisma: `prisma/`
- Shared libs: `lib/`
- Static assets: `public/`
- Docs: `docs/`

## Source of truth

- GitHub is code source of truth.
- Vercel is live deployment path.
- Read `REPO_MAP.md` first for architecture and guardrails.

## Validation

Run from repository root:

```bash
npm run lint
npm run build
```
