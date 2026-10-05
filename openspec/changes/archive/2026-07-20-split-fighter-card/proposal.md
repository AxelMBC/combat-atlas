# split-fighter-card — Proposal

## Why

`FighterCard.tsx` is a single 443-line component holding two full layout variants (`feature` and `compact`) built from five closure render-helpers (`portrait`, `statsBlock`, `cornerBadge`, `rankBadge`, `profileCta`) and a dozen inline `sx` blocks. The audit flagged it as the worst Component Design offender (6/10): the two layouts are hard to read side-by-side, the render-helpers re-create their JSX on every render, and the only unit-testable logic (`formatActivePeriod`) is trapped inside the closure. Change 1 (`unify-theming`) already extracted the shared pill/stat/card primitives this component now consumes, so the groundwork for a clean split is in place.

## What Changes

- Split `FighterCard` into two focused variant components — `FighterCardFeature` and `FighterCardCompact` — that compose shared subcomponents rather than branching inside one function.
- Extract shared subcomponents: `FighterCardShell` (the interactive/focus/scroll-focus wrapper), `FighterPortrait` (image + gradient + rank/corner/exhausted badges), and `FighterStats` (the stat grid/list).
- Extract `formatActivePeriod` to a pure, translator-agnostic util with a colocated Vitest test.
- Keep the **public API unchanged**: `FighterCardProps` (including `variant`) is untouched, and `FighterCard/index.tsx` remains the single entry point that dispatches on `variant`. `TopFighters` and every other caller import exactly as before.
- Preserve every behavior exactly: keyboard activation (`role="button"`, Enter/Space, `focus-visible`), disabled state (no `role`/`tabIndex`, dimmed card, exhausted overlay), `useScrollFocus` hover-on-scroll for touch, image `onError` fallback, and the `.fighter-portrait` hover-target contract.
- Hoist static `sx` objects to module scope; reuse the `shared/` primitives from Change 1 instead of re-declaring them.

## Capabilities

### New Capabilities

- `fighter-card-composition`: the fighter card is composed from a variant dispatcher plus shared subcomponents while preserving its public API and interaction behaviors; the active-period formatter is a pure, unit-tested util.

### Modified Capabilities

None. This is an internal refactor; the keyboard-access and scroll-focus behaviors already covered by `card-keyboard-access` and `scroll-focus-cards` are preserved unchanged.

## Impact

- **Refactored:** `src/pages/countries/components/TopFighters/FighterCard/` — `FighterCard.tsx` (removed/reduced), new `FighterCardFeature.tsx`, `FighterCardCompact.tsx`, `FighterCardShell.tsx`, `FighterPortrait.tsx`, `FighterStats.tsx`, colocated `*.types.ts`, `formatActivePeriod.ts` + `formatActivePeriod.test.ts`; `index.tsx` becomes the variant dispatcher.
- **Unchanged callers:** `TopFighters.tsx` and `TopFighters.test.ts` — no edits; the test must stay green as-is.
- **Reused:** `src/pages/countries/components/shared/` primitives (`overlayPillSx`, `statLabelSx`, `statValueSx`, `cardSurfaceSx`, `cardActiveSx`) from `unify-theming`.
- **No dependency, API, or i18n changes.** Depends on `unify-theming` having landed (shared primitives + `theme.palette.surfaces`).
