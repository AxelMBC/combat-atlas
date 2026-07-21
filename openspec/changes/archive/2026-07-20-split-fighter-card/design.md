## Context

`FighterCard.tsx` (443 lines) is `memo`-wrapped and branches on `variant === 'feature'`. Inside it declares five closure render-helpers (`cornerBadge`, `rankBadge`, `portrait(size)`, `statsBlock(size)`, `profileCta`), the `stats` array, `formatActivePeriod`, and the `cardSx`/`activeStyles`/`interactiveProps` objects, then returns one of two JSX trees. It already consumes the `shared/` primitives and `theme.palette.surfaces` (post `unify-theming`).

Key contracts that must survive the split:

- **Public API:** `FighterCardProps { boxer, rank, remaining, variant, onSelect }` and the default export from `FighterCard/index.tsx`. `TopFighters` renders `<FighterCard variant="feature|compact" .../>`.
- **Interaction:** when `remaining > 0` the card is a `role="button"` with `tabIndex=0`, Enter/Space activation, and `focus-visible` styling; when `remaining <= 0` it drops `role`/`tabIndex`, dims to `opacity .55`, shows the exhausted overlay, and is not activatable.
- **Touch focus:** `useScrollFocus` applies the active styles under `@media (hover: none)` when the card is centered in the viewport. The hover/active styles reach the image via the descendant selector `.fighter-portrait img`, so that className is a structural contract between shell and portrait.
- **Image fallback:** `onError` swaps to `/placeholders/no-fighter-placeholder.png` with `objectFit: contain`.

Constraints: arrow-function components; types in colocated `*.types.ts`; `@/*` across module boundaries; Vitest 2.x; no behavior/visual change.

## Goals / Non-Goals

**Goals:**

- Two readable variant components composed from shared subcomponents; no file over ~180 lines.
- `formatActivePeriod` extracted as a pure util with a unit test.
- Byte-for-byte visual and behavioral parity in both modes and both variants.
- `TopFighters.test.ts` untouched and green.

**Non-Goals:**

- No changes to `FighterCardProps`, `TopFighters`, or any caller.
- No restyling, no palette changes, no new i18n keys.
- No change to `useScrollFocus`, `card-keyboard-access`, or `scroll-focus-cards` behavior.
- Not extracting name/city identity into a shared component (the two variants' type ramps and spacing differ enough that inlining keeps parity obvious).

## Decisions

### D1 — `index.tsx` becomes the variant dispatcher

`FighterCard/index.tsx` stops re-exporting and instead defines the dispatcher: `memo` component reading `variant` and returning `<FighterCardFeature {...props} />` or `<FighterCardCompact {...props} />`, default-exported. `FighterCardProps` stays in `FighterCard.types.ts`. Callers importing `@/pages/countries/components/TopFighters/FighterCard` are unaffected. _Alternative:_ a `FighterCard.tsx` dispatcher with `index.tsx` re-export — rejected; the folder-import convention makes `index.tsx` the natural entry, and it removes the now-empty `FighterCard.tsx`.

### D2 — `FighterCardShell` owns interaction + card chrome

`FighterCardShell` renders the outer `Box`, owns `useScrollFocus`, builds `interactiveProps` (role/tabIndex/onClick/onKeyDown or `{}` when disabled), and holds `cardSx` + `activeStyles` (from `cardSurfaceSx`/`cardActiveSx` plus the `.fighter-portrait img` descendant rules). Props: `{ disabled, onActivate, layoutSx, children }` where `onActivate` is the `() => onSelect(boxer)` callback and `layoutSx` supplies the variant's `display`/`flexDirection`/`alignItems` deltas. It forwards its internal `ref` to the outer Box. _Rationale:_ the focus/keyboard/scroll logic is identical across variants and is exactly what the audit wants isolated. _Alternative:_ a `useFighterCardShell` hook returning props — rejected; a component keeps the JSX wrapper and the descendant-selector styles in one place.

### D3 — `FighterPortrait` owns image + badges

`FighterPortrait` renders the `.fighter-portrait` Box, the `img` (with `onError`), the gradient scrim, and the three badges (corner "fights remaining"/"no fights", rank, and the centered exhausted overlay when disabled). Props: `{ boxer, rankLabel, remaining, disabled, size: { width, height }, emphasis }` where `emphasis` (`'feature' | 'compact'`) drives the rank/exhausted font sizes. Badge styling reuses `overlayPillSx`. It keeps the `.fighter-portrait` className so `FighterCardShell`'s hover/active rules continue to target the image. _Alternative:_ separate `RankBadge`/`CornerBadge` components — rejected as over-decomposition; they are only used here and are a few lines each.

### D4 — `FighterStats` owns the stat grid/list + consumes the util

`FighterStats` builds the `stats` array from `boxer` and renders either the 4-column grid (`size="sm"`) or the label/value rows (`size="lg"`), using `statLabelSx`/`statValueSx`. It calls `formatActivePeriod(boxer.activePeriod, { activeSince: t('fighter.activeSince'), notAvailable: na })`. Props: `{ boxer, size }`. _Rationale:_ the stats markup is the largest duplicated block and the only place the util is needed.

### D5 — `formatActivePeriod` is a pure util with a test

New `formatActivePeriod.ts`:

```ts
export const formatActivePeriod = (
  period: string | undefined,
  labels: { activeSince: string; notAvailable: string },
): string => {
  /* same logic: undefined → notAvailable; trailing "-" → `${activeSince} ${start}`; else period */
};
```

Translator-agnostic so `formatActivePeriod.test.ts` covers the three branches (missing, open-ended `"2015-"`, closed `"2010-2015"`) with plain strings. _Alternative:_ passing `t` into the util — rejected; passing resolved label strings keeps the util free of i18n imports and trivially testable.

### D6 — Static `sx` to module scope; reuse `shared/`

Static objects (portrait wrapper, gradient, badge overrides, identity typography per variant, stat containers) become module-scope `const … as const` where they don't depend on `surfaces`; anything depending on `surfaces` stays a small `(surfaces) => …` builder or an inline `sx` callback. No re-declaration of the `shared/` primitives.

## Risks / Trade-offs

- [Descendant-selector coupling: Shell styles `.fighter-portrait img` but Portrait renders it] → the `.fighter-portrait` className is documented as a contract in both files' regions; a test-render still exercises hover indirectly, and visual QA confirms.
- [`memo` placement change alters re-render behavior] → keep `memo` on the dispatcher (or on each variant); props are identical primitives/callbacks, so memoization behaves as before.
- [Prop-drilling `disabled`/`emphasis` introduces subtle divergence between variants] → both variants pass the same computed `disabled = remaining <= 0`; parity is asserted by keeping the exhausted/enabled logic in Shell+Portrait, not per-variant.
- [Visual regression] → acceptance requires a both-modes/both-variants click-through (or screenshot compare) plus the untouched `TopFighters.test.ts` staying green.

## Migration Plan

Single change, single commit (user commits). Depends on `unify-theming` being committed first (shared primitives + `theme.palette.surfaces`). Order: util + test → subcomponents (Shell, Portrait, Stats) → variant components → dispatcher `index.tsx` + delete old `FighterCard.tsx` body → gates. Rollback = revert the one commit; public API is unchanged so no caller churn either way.

## Open Questions

None.
