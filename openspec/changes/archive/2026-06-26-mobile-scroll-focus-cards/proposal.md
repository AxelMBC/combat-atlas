## Why

On desktop, hovering a fight or fighter card reveals an "active" state — the card lifts, its border lights up, and its image animates to full color/brightness. Touch devices have no pointer hover, so mobile users never get that affordance and the card grids feel flat and undifferentiated while scrolling. We want to recreate the same sense of focus on mobile by activating whichever card is centered in the viewport as the user scrolls.

## What Changes

- Add a shared `useScrollFocus` hook that reports whether an element is centered in the viewport, using an `IntersectionObserver` with a center "focus band" (`rootMargin: '-47% 0px -47% 0px'`).
- The hook is a no-op on pointer/hover devices (`(hover: none)` check), so desktop behavior is unchanged.
- Refactor `FightCard` and `FighterCard` so the existing hover style recipe is named once and applied under two triggers: `:hover` (desktop, inside `@media (hover: hover)`) and the scroll-focus state (touch).
- On touch, the active-state transition is shortened (~150ms) so it keeps pace with scrolling, while desktop hover keeps its slower timing.
- The thin focus band keeps exactly one card active most of the time and is sized to exceed the 24px inter-card gutter to avoid "nothing highlighted" flicker.

## Capabilities

### New Capabilities

- `scroll-focus-cards`: On touch devices, the card whose box crosses the vertical center of the viewport receives the same active visual treatment that hover produces on desktop, updating as the user scrolls.

### Modified Capabilities

<!-- No existing spec requirements change. -->

## Impact

- New: `src/hooks/useScrollFocus.ts` (+ `useScrollFocus.types.ts`).
- Modified: `src/pages/countries/components/TopFights/FightCard/FightCard.tsx` and `src/pages/countries/components/TopFighters/FighterCard/FighterCard.tsx` — two-trigger active state.
- No new dependencies; `IntersectionObserver` and `matchMedia` are native browser APIs.
- No backend, routing, or i18n changes. Desktop hover behavior is unchanged.
