# Baja411 Agent Instructions

The actual Next.js app is nested in:

baja411/

Do not assume the app is at repo root.

Before code changes, read:

PROJECT_GUIDELINES.md
baja411/REPO_MAP.md
baja411/AGENTS.md

Core working order:

1. End user need first
2. CEO/business strategy second
3. Engineering execution third

Agent role split:

ChatGPT handles product strategy, architecture review, Codex prompts, diff review, UX critique, and decision support.

Codex handles focused code execution, small safe patches, commits, build fixes, and scoped refactors only.

Claude and Claude Code handle deep investigation, careful implementation, and code review, following baja411/CLAUDE.md.

Coding rules:

Read the relevant file before editing.
Patch the smallest safe part.
Do not do broad rewrites.
Do not casually edit map heading, bearing, recenter, Drive Mode, or Plan Mode behavior.
Do not add MutationObserver hacks, polling loops, injected fake controls, or hidden CSS pretending to be architecture.
Run lint and build when practical.
Update baja411/REPO_MAP.md when architecture changes.
For every code change, create or update a task log in updates-and-changes/.

Deployment rule:

GitHub is source of truth.
Vercel is deployment path.
Be careful with builds, routes, auth, env vars, Prisma, and database behavior.
