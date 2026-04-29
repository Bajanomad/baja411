# Rules & Permits page

## Prompt summary
Added a new public `/rules-permits` page with official-source starter information cards, plus navigation and footer links.

## Files changed
- `baja411/app/rules-permits/page.tsx`
- `baja411/components/Nav.tsx`
- `baja411/components/Footer.tsx`
- `baja411/REPO_MAP.md`
- `updates-and-changes/PRODUCT_IDEAS.md`
- `updates-and-changes/2026-04-29-rules-permits-page.md`

## Behavior changed
Added a Rules & Permits page with official-source starter cards and menu/footer links. No map, auth, schema, API, or data behavior changed.

## Validation
Ran `npm run lint` and `npm run build` from `baja411/`.

- `npm run lint` failed because local dependency `eslint` is not available in this environment.
- `npm run build` failed because `next` is not available in this environment.

## Risks / follow-up
- Rules can change and source links must be rechecked.
- Future content must include official links and last-checked dates.
- Do not treat page copy as legal advice.
- Future tasks may add BCS-specific office cards after verification.
- Future tasks may add topic detail pages.

## PR / commit
- Commit hash: c9ac570
- PR link: created via make_pr tool
