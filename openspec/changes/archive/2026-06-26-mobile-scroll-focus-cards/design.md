## Context

`FightCard` and `FighterCard` both encode their "active" look as a `&:hover` block inside their MUI `sx` (lift via `translateY(-4px)`, `borderColor: palette.borderHover`, and an image animation — grayscale→color for fighters, brightness+scale for fights). Touch devices have no hover, so on mobile the grids — which collapse to a single stacked column at the `xs` breakpoint — never surface that affordance. We want the centered card to look "active" as the user scrolls, reusing the exact desktop recipe rather than designing a new one.

## Goals / Non-Goals

**Goals:**

- On touch devices, activate the card crossing the vertical center of the viewport, updating live on scroll.
- Reuse the existing hover style recipe verbatim as the active treatment.
- Leave desktop hover behavior completely unchanged.
- Keep the scroll path cheap (no per-frame scroll math) and robust on iOS Safari.

**Non-Goals:**

- No new visual design for the active state (no extra glow/shadow tuned for mobile).
- No horizontal carousels or snap scrolling.
- No change to routing, data, i18n, or the desktop grid layout.

## Decisions

### Detection: `IntersectionObserver` with a negative `rootMargin` band

Use one `IntersectionObserver` per card with `rootMargin: '-47% 0px -47% 0px'` and `threshold: 0`. This shrinks the observer root to a thin horizontal sliver (~6% of viewport height) at the screen's vertical center; a card reports `isIntersecting` only while its box overlaps that sliver.

- **Why over a scroll listener + distance math:** the browser computes intersection off the main thread, so there is no per-frame cost and no need for rAF throttling.
- **Why over CSS `animation-timeline: view()`:** scroll-driven CSS animations still have unreliable iOS Safari support as of 2026, and mobile Safari is the primary target.

### Band thickness: `-47%` (≈42px on a ~700px viewport)

The inter-card gutter is `spacing={3}` = 24px. The band must be **taller than the gutter**, otherwise it can sit entirely in the gap and leave zero cards active (flicker). `-47%` keeps the band comfortably above 24px while staying thin enough that two adjacent cards rarely share it. `-48%`/`-49%` are thinner but risk the gutter flicker; treat `-47%` as the default and the exact value as a device-tuning knob.

### Gating: `(hover: none)` rather than a width breakpoint

The hook reads `window.matchMedia('(hover: none)')`. On hover-capable pointers it returns `isFocused: false` and never creates an observer, so desktop is untouched even when the window is narrow. The cards' `:hover` block is wrapped in `@media (hover: hover)` so the sticky/janky synthetic hover on touch is suppressed and replaced by the scroll band.

### Two-trigger active state via a named style object

Extract the active styles into one object per card and apply it under both triggers:

```
'@media (hover: hover)': { '&:hover': activeStyles },
'@media (hover: none)':  { ...(isFocused && activeStyles), /* shorter transitions */ },
```

This guarantees desktop and touch share one recipe; there is no second source of truth for the look.

### Shorter transition on touch

The base/hover transition stays ~300ms. Inside `@media (hover: none)` the card (and its image) get ~150ms transitions so the active state tracks a scroll/flick instead of smearing behind it. Final value is a taste-tune in the 120–180ms range on a real device.

### Hook shape and home

`useScrollFocus()` returns `{ ref, isFocused }`, co-located at `src/hooks/useScrollFocus.ts` with types in `src/hooks/useScrollFocus.types.ts`, following the project's arrow-function and types-in-separate-files conventions. Both cards consume it and spread `ref` onto their root `Box`.

## Risks / Trade-offs

- **Brief double-highlight at handoff** → thin `-47%` band makes two-card overlap rare and momentary; escalate to parent-coordinated "closest to center" only if it reads poorly on device.
- **Gutter flicker if band too thin** → band height is kept above the 24px gutter; documented as the lower bound for any future tuning.
- **Motion sensitivity** → lift/scale on every centered card during scroll could bother some users; gate the transform behind `prefers-reduced-motion: reduce` (color/border can remain).
- **`matchMedia('(hover: none)')` evaluated once on mount** → acceptable; input capability rarely changes within a session, and a listener can be added later if needed.

## Open Questions

- Does the tall feature-variant `FighterCard` need a slightly different band, or is the shared `-47%` fine? Verify on device; default to shared.
- Final transition duration within 120–180ms — confirm on a real phone.
