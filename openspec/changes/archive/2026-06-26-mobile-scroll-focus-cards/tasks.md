## 1. Scroll-focus hook

- [x] 1.1 Create `src/hooks/useScrollFocus.types.ts` with the hook's return type (`{ ref, isFocused }`) and any options type (e.g. configurable `rootMargin`)
- [x] 1.2 Create `src/hooks/useScrollFocus.ts` as an arrow-function hook that returns `{ ref, isFocused }`
- [x] 1.3 In the hook, no-op on hover-capable pointers: read `window.matchMedia('(hover: none)')`; when false, never create an observer and keep `isFocused` false
- [x] 1.4 On touch, set up an `IntersectionObserver` on the ref with `rootMargin: '-47% 0px -47% 0px'`, `threshold: 0`, toggling `isFocused` from `entry.isIntersecting`; disconnect on cleanup

## 2. FightCard two-trigger active state

- [x] 2.1 Consume `useScrollFocus` in `FightCard` and spread `ref` onto the root `Box`
- [x] 2.2 Extract the existing hover styles (lift, `borderColor`, `.fightCardImg` brightness/scale) into a single named `activeStyles` object
- [x] 2.3 Apply `activeStyles` under `@media (hover: hover)` `&:hover` (desktop) and under `@media (hover: none)` when `isFocused` (touch)
- [x] 2.4 Under `@media (hover: none)`, shorten the card and image transitions to ~150ms

## 3. FighterCard two-trigger active state

- [x] 3.1 Consume `useScrollFocus` in `FighterCard` and spread `ref` onto the root `Box` (both `feature` and `compact` variants)
- [x] 3.2 Extract the existing hover styles (lift, `borderColor`, `.fighter-portrait img` grayscale→color/scale) into a single named `activeStyles` object, preserving the `disabled` guard
- [x] 3.3 Apply `activeStyles` under `@media (hover: hover)` `&:hover` (desktop) and under `@media (hover: none)` when `isFocused` (touch), skipping it when `disabled`
- [x] 3.4 Under `@media (hover: none)`, shorten the card and portrait-image transitions to ~150ms

## 4. Motion and verification

- [x] 4.1 Gate the lift/scale transforms behind `prefers-reduced-motion: reduce` (keep color/border) in both cards
- [ ] 4.2 Verify on a touch viewport: exactly one card activates while scrolling, handoff across the 24px gutter shows no "nothing active" flicker, and the transition tracks the scroll
- [ ] 4.3 Verify desktop is unchanged: hover still activates cards, scrolling without hover activates nothing
- [x] 4.4 Run `yarn lint` and `yarn build` (tsc) clean
