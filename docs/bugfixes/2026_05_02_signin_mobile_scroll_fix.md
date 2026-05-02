# Sign-in Mobile Scroll Fix Report

## 1) Date
- 2026-05-02

## 2) Bug summary
- On mobile after submitting the sign-in form, the success state rendered but the viewport stayed low on the page near the form's previous bottom area. Users could miss the “Check your inbox” message because it appeared above the current viewport.

## 3) File inspected
- `app/signin/page.tsx`
- `app/signin/layout.tsx`

## 4) Root cause
- The component switched from form view to confirmation view without resetting viewport position or moving focus.
- On mobile, the keyboard/input focus state can keep the viewport offset after submit, especially when content changes in place.

## 5) File changed
- `app/signin/page.tsx`

## 6) Behavior changed
- On successful sign-in link request, the active element is blurred before success state switch to help dismiss the mobile keyboard.
- After `submitted` becomes `true`, the sign-in card scrolls into view at the top (`scrollIntoView({ block: "start", behavior: "smooth" })`).
- The “Check your inbox” heading is now programmatically focusable (`tabIndex={-1}`) and is focused after scroll for accessibility and immediate context.
- “Try another email” behavior remains unchanged and returns the user to normal form usage.

## 7) Validation results
- `npm run lint` failed in this environment: `Cannot find package 'eslint' imported from /workspace/baja411/eslint.config.mjs`.
- `npm run build` failed in this environment: `next: not found`.

## 8) Mobile test notes
- Implemented mobile-safe submit success sequence:
  1. Blur active element.
  2. Set submitted state.
  3. On next animation frame, scroll container and focus confirmation heading.
- This sequence is intended to work on iPhone Safari and Chrome where keyboard and viewport offset behavior can differ.

## 9) Remaining risks
- Smooth scrolling behavior is browser-dependent; on some devices it may appear as instant scroll if reduced motion or browser behavior overrides smooth animations.
- If browser focus policies change, heading focus could be ignored, but confirmation remains visible due to explicit scroll.
