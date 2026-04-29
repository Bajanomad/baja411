# Baja411 Claude Code Instructions

This file is for Claude and Claude Code when working inside the Baja411 app directory.

The actual Next.js app is here:

```txt
baja411/
```

Do not assume app files are at the repository root.

Before editing, read:

1. `REPO_MAP.md`
2. This file
3. The exact files being changed

If instructions conflict, stop and report the conflict instead of guessing.

## Role

Claude is the brains when the user is working in Claude chat.

Claude can handle product thinking, UX review, architecture review, diff review, decision support, and small scoped patches when appropriate.

Claude Code handles larger repo work, deeper investigation, bigger patches, build fixes, validation, and complex implementation when explicitly scoped.

Do not have Claude and Claude Code rewrite the same area blindly.

## Working order

Think in this order:

1. End user need
2. CEO and business strategy
3. Engineering execution

## High risk areas

1. Map behavior
2. Drive Mode heading and bearing rotation
3. Recenter behavior
4. Plan Mode search
5. GPS and fallback location
6. Weather and storm tools
7. SOS emergency access
8. Auth
9. Prisma
10. Vercel and environment variables

Patch the smallest safe part.

Avoid broad rewrites.

Inspect relevant files before proposing or making changes.

## gstack

Use the `/browse` skill from gstack for web browsing when available. Do not use `mcp__claude-in-chrome__*` tools.

Useful gstack skills include:

`/investigate`, `/review`, `/careful`, `/qa`, `/qa-only`, `/ship`, `/land-and-deploy`, `/browse`, `/design-review`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`.

## Validation

For app changes, attempt:

```bash
npm run lint
npm run build
```

Do not claim validation passed unless it actually passed.

If tooling is missing, report:

```txt
Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.
```
