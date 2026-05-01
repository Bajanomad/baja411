# Baja411 Root Agent Instructions

The actual app is inside `baja411/`. Do not assume app files are at the repository root.

## Required reading

Before repo advice, prompts, code review, patches, or implementation guidance, read:

1. `baja411/REPO_MAP.md`
2. `baja411/AGENTS.md` when using Codex or OpenAI coding agents
3. `baja411/CLAUDE.md` when using Claude Code
4. The exact files being changed

If instructions conflict, stop and report the conflict instead of guessing.

## Workflow model

ChatGPT or Claude is the product brain for strategy, UX review, architecture review, prompt writing, diff review, decision support, and small scoped patches when appropriate.

Codex or Claude Code handles larger repo work, bigger patches, build fixes, validation, implementation, and deeper file editing.

Do not have multiple agents rewrite the same area blindly.

## Working order

Think in this order: end user need, CEO and business strategy, engineering execution. Start with why a real person would care.

## Current priorities

Keep SOS emergency access clean and reliable; protect map behavior; keep weather and storm tools useful inside Baja411; improve Plan Mode search suggestions only when scoped; preserve Drive Mode heading, bearing, recenter, and snap-back behavior; improve Local Directory usefulness with verified data; keep navigation and footer clean; keep the directory user-facing, not sales-first.

## Guardrails

Patch the smallest safe part. Avoid broad rewrites.

Do not casually edit map heading, bearing, recenter, Drive Mode, Plan Mode, search, GPS tracking, pin rendering, SOS access, weather, auth, Prisma, Vercel config, or environment variables.

Do not use DOM patching tricks, polling loops, injected controls, hidden styling behavior, or fake architecture.

`baja411/app/map/MapSearchEnhancer.tsx` was removed and should not be treated as current architecture.

Update `baja411/REPO_MAP.md` when architecture changes.

## Audit documentation

For Baja411 morning checklists, night audits, repo audits, daily cleanup, end-of-day reviews, status summaries, or “what did we do today” workflows, require a permanent dated markdown report unless the user explicitly says not to write files.

Default paths: morning audits at `baja411/docs/morning_audits/YYYY_MM_DD_morning_audit.md`; night audits at `baja411/docs/night_audits/YYYY_MM_DD_night_audit.md`.

The prompt must require creating the folder if missing, writing completed findings, committing the file, not rerunning the audit if only the file is missing, and final response with file path, commit SHA, docs-only/app-code status, and summary.

Required audit sections: date, purpose, recent merged PR summary, open PR status, deployment/Vercel status if checked, files inspected, bugs found, dead or duplicate code found, validation results, recommended next task, files changed.

## Validation

For app changes, attempt:

```bash
cd baja411 && npm run lint
cd baja411 && npm run build
```

Documentation-only changes do not require lint/build unless app code changed.

Do not claim validation passed unless it actually passed.

If tooling is missing, report exactly:

```txt
Validation could not complete in this environment because required local tooling was unavailable. This is an environment/tooling failure, not confirmed app breakage.
```

GitHub is source of truth. Vercel is the live deployment path.
