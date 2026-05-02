# Local Directory UI copy update

## Prompt summary
Update user-facing `/businesses` language to present Baja411 as a broader Local Directory (services, offices, resources, and practical help), while keeping route/data/behavior unchanged.

## Files changed
- `app/businesses/page.tsx`
- `components/BusinessDirectoryClient.tsx`
- `components/Nav.tsx`
- `components/Footer.tsx`

## Behavior changed
UI copy only. Route and data behavior unchanged.

## Validation
- `npm run lint` failed because local tooling/dependencies are unavailable in this environment (`eslint` package not found).
- `npm run build` failed because local tooling/dependencies are unavailable in this environment (`next` command not found).

## Risks / follow-up
- Route remains `/businesses`.
- Data is still placeholder until real listings are collected.
- Future task may map broader Local Directory categories into schema.
- Future task may build a Suggest a listing flow.

## PR / commit
- Commit: `1526c3b`
- PR: created via `make_pr` tool (URL not returned by tool output)

## Final readout
- Updated `/businesses` metadata, hero title/body, and primary CTA to Local Directory language.
- Added concise helper copy near filters to highlight practical local needs.
- Updated empty state message to suggest useful local resources.
- Updated Nav/Footer visible "Businesses" labels to "Directory" while keeping `href="/businesses"`.
- No routing, schema, query, or data behavior changes.
