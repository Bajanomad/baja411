# Baja411 Root Agent Instructions

The actual app is inside:

```txt
baja411/
```

Do not assume app files are at the repository root.

## Required reading

Before editing code, read:

1. `baja411/REPO_MAP.md`
2. `baja411/AGENTS.md` when using Codex or OpenAI coding agents
3. The exact files being changed

If instructions conflict, stop and report the conflict instead of guessing.

## Workflow model

ChatGPT or Claude is the brains, depending on which chat is being used.

The chat assistant handles product strategy, UX review, architecture review, prompt writing, diff review, decision support, and small scoped patches when appropriate.

Codex or Claude Code handles larger repo work, bigger patches, build fixes, validation, and complex implementation.

Do not have multiple agents rewrite the same area blindly.

## Working order

Think in this order:

1. End user need
2. CEO and business strategy
3. Engineering execution

## Guardrails

Patch the smallest safe part.

Avoid broad rewrites.

Do not casually edit map heading, bearing, recenter, Drive Mode, Plan Mode, search, GPS tracking, pin rendering, SOS access, weather, auth, Prisma, or Vercel behavior.

Do not add MutationObserver hacks, polling loops, injected fake controls, hidden CSS hacks, or fake architecture.

Update `baja411/REPO_MAP.md` when architecture changes.

## Validation

For app changes, attempt:

```bash
cd baja411 && npm run lint
cd baja411 && npm run build
```

Do not claim validation passed unless it actually passed.

If tooling is missing, report:

```txt
Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.
```

GitHub is source of truth.

Vercel is the live deployment path.
