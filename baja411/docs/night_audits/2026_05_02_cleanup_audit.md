# 2026-05-02 Cleanup Audit

## Date

2026-05-02

## Purpose

Clean up and document the repo mess created by the attempted Baja411/BajaSur411 migration, root restructure attempts, scaffold attempts, and closed Codex PR branches.

This report is documentation-only. It records what was verified from GitHub and Vercel and what still needs manual or Codex cleanup because the ChatGPT GitHub connector does not expose a branch-delete operation.

## Recent merged PR summary

Recent relevant PRs checked:

1. PR #76 `Add migration discovery report for BajaSur411` was merged.
2. PR #77 `Initialize BajaSur411 skeleton workspace structure` was merged by mistake.
3. PR #78 `Revert mistaken PR #77 skeleton setup` was merged and restored the repo back to the post-PR #76 state.
4. PR #79 `Migrate nested Baja411 app to root layout and update docs/paths` was closed unmerged.
5. PR #80 `Move Next.js app to repository root and sync docs/paths` was closed unmerged.
6. PR #81 `feat: scaffold Sur Compass map-first Baja field utility app` was closed unmerged.

## Open PR status

GitHub search found no open pull requests in `Bajanomad/baja411` at cleanup time.

## Deployment and Vercel status checked

Vercel project checked:

- Project: `baja411`
- Team: `David 's projects`
- Project ID: `prj_Ln5zRqGwY0glqniJ71DyWmvpH6mI`

Deployment status observed:

1. Latest production deployment is from `main` at commit `533a97ac20ee54aea2265def313a76530055aa6d`, the merge commit for PR #78 revert.
2. Production deployment state was `READY`.
3. Closed branch preview deployments exist from PRs #79, #80, and #81.
4. PR #79 and #80 preview deployments showed `ERROR`.
5. PR #81 preview deployment showed `READY`, but it was a preview deployment from closed branch `codex/create-comprehensive-baja-sur-utility-app`, not production.
6. Vercel cleanup/deletion was not performed because the available Vercel connector does not expose a delete deployment or prune preview deployment tool.

## Files inspected

1. `baja411/REPO_MAP.md`
2. `README.md`
3. `baja411/README.md`
4. GitHub PR metadata for recent PRs #62 through #81
5. GitHub branch search results for Codex, Claude, revert, and Baja-related branches
6. Vercel deployment list for project `baja411`

## Bugs found

No confirmed runtime bug was found during this cleanup pass.

The main safety problem was workflow/repo hygiene:

1. Several migration/restructure branches were created against the live source repo instead of a clean org repo.
2. PR #77 was merged and then correctly reverted by PR #78.
3. Closed branch previews still exist in Vercel history.
4. Many old Codex/Claude branches remain visible in GitHub.
5. The `BajaSur411` GitHub app installation exists, but no org repository is visible through the connector.

## Dead or duplicate code found

No app-code scan was performed in this cleanup because the cleanup target was repo/PR/deployment hygiene, not source-code refactor.

Dead branch candidates found:

### High-priority branch cleanup candidates

These are directly tied to the accidental migration/restructure/scaffold mess and should be deleted if no longer needed:

1. `codex/create-comprehensive-baja-sur-utility-app`
2. `codex/migrate-baja411-app-to-new-org-repo`
3. `codex/restructure-baja411-repository-root`
4. `revert/pr-77-bajasur411-skeleton`

### Other stale automation branch candidates

Review before deleting if you want to keep old work references, otherwise these are likely safe cleanup candidates after confirming their PRs are merged or closed:

1. `codex/clean-up-gps/plan-mode-workaround`
2. `codex/clean-up-repo-documentation-for-ai-agents`
3. `codex/cleanup-footer-link-structure`
4. `codex/create-ai-workflow-documentation-structure`
5. `codex/create-codex-work-log-system`
6. `codex/create-new-branch-and-pr-from-main`
7. `codex/finish-baja411-documentation-cleanup`
8. `codex/fix-map-visibility-for-approved-businesses`
9. `codex/fix-phase-2-map-location-wiring`
10. `codex/investigate-codex-validation-failures`
11. `codex/patch-mapclientmaplibre-with-location-provider`
12. `codex/replace-windy-iframe-with-open-meteo-panel`
13. `codex/rollback-failed-search-behavior-fix-from-pr-#51`
14. `codex/run-repo-wide-debug-and-refactor-scan`
15. `codex/search-repository-for-planning-documents`
16. `codex/update-documentation-for-current-codebase`
17. `codex/update-pr-#15-and-resolve-conflicts`
18. `codex/update-pr-#23-documentation-for-ai-workflow`
19. `Bajanomad-patch-1`
20. `Bajanomad-patch-2`
21. `Bajanomad-patch-2-1`
22. `claude/baja411-folder-app-gSAW9`
23. `claude/baja411-work-PyJMe`
24. `claude/baja-411-ZL1Et`

## Validation results

No app code changed in this cleanup report.

Lint and build were not run because this was a documentation-only cleanup audit and no app source files were changed.

## Recommended next task

Delete stale closed PR branches, starting with the high-priority migration/scaffold branches:

1. `codex/create-comprehensive-baja-sur-utility-app`
2. `codex/migrate-baja411-app-to-new-org-repo`
3. `codex/restructure-baja411-repository-root`
4. `revert/pr-77-bajasur411-skeleton`

Then decide whether to prune the older Codex/Claude branches listed above.

The ChatGPT GitHub connector can inspect PRs and branches but does not currently expose a delete-branch operation. Use GitHub UI, GitHub CLI, or Codex with explicit branch deletion commands.

Suggested Codex command set after confirming it is in `Bajanomad/baja411` and on `main`:

```bash
git fetch --prune origin

git push origin --delete codex/create-comprehensive-baja-sur-utility-app
git push origin --delete codex/migrate-baja411-app-to-new-org-repo
git push origin --delete codex/restructure-baja411-repository-root
git push origin --delete revert/pr-77-bajasur411-skeleton
```

Only after that, optionally prune the older stale branches.

## Files changed

1. `baja411/docs/night_audits/2026_05_02_cleanup_audit.md`
