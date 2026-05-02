# Sign in layout fix

## Prompt summary
Fix `/signin` mobile layout clipping where the sign in card top is cut off by the fixed nav/header by adjusting page wrapper spacing only.

## Files changed
- `app/signin/page.tsx`
- `updates-and-changes/2026-04-29-signin-layout-fix.md`

## Behavior changed
Visual spacing only: the sign in page main wrapper now accounts for fixed nav height with top padding and uses `100svh` with balanced bottom padding. Auth behavior unchanged.

## Validation
- Ran `npm run lint` from `baja411/`.
- Ran `npm run build` from `baja411/`.

## Risks / follow-up
Low risk. Change is limited to wrapper utility classes in `/signin`. Verify on a small-screen device that card top is fully visible below fixed nav.

## PR / commit
- Commit message: `Fix sign in page top spacing`
