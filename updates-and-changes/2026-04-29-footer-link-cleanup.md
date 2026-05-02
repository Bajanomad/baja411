# Footer link cleanup

## Prompt summary
Requested a small footer-only cleanup to support map-first utility flows without clutter: remove the `/news` link, rename `Interactive Map` to `Map`, rename `Rules & Permits` to `Rules`, and keep the remaining footer href destinations unchanged.

## Files inspected
- `REPO_MAP.md`
- `PROJECT_GUIDELINES.md`
- `updates-and-changes/README.md`
- `components/Footer.tsx`
- `baja411/AGENTS.md`

## Files changed
- `components/Footer.tsx`
- `updates-and-changes/2026-04-29-footer-link-cleanup.md`

## Exact footer link changes
Updated `links` array to exactly this order and content:
1. `{ href: "/map", label: "Map" }`
2. `{ href: "/businesses", label: "Directory" }`
3. `{ href: "/weather", label: "Weather" }`
4. `{ href: "/rules-permits", label: "Rules" }`
5. `{ href: "/signin", label: "Sign In" }`

Specific edits made:
- Removed `{ href: "/news", label: "Local News" }`
- Changed map label from `Interactive Map` → `Map`
- Changed rules label from `Rules & Permits` → `Rules`

## Validation results
- `npm run lint` → failed in this environment because `eslint` package is not installed/resolvable (`ERR_MODULE_NOT_FOUND`).
- `npm run build` → failed in this environment because `next` binary is not available (`sh: 1: next: not found`).

## Risks/follow-up
- Low risk; change is data-only in the footer links array and does not alter layout, styles, routing structure, or destinations for retained links.

## Final readout
Completed requested footer cleanup with a minimal patch to `components/Footer.tsx` and added this dated task log. Validation commands were run, but both failed due to missing local dependencies/binaries:
- `npm run lint` (`ERR_MODULE_NOT_FOUND` for `eslint`)
- `npm run build` (`next: not found`)

Commit: `Simplify footer links`
PR: created via MCP make_pr after commit.
