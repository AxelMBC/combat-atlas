# unify-theming — Design

## Context

Two theming systems coexist:

1. **MUI country themes** — `createCountryTheme(config)` (`src/styles/theme/createCountryTheme.ts`) builds a static `Theme` from `CountryPageConfig.colorPalette`. Each country exports it at module scope (`src/pages/Mexico/config/mexicoTheme.ts` etc.) and passes it as a `theme` prop to `CountryPage` and `ErrorFallback`, which mount local `ThemeProvider`s. It knows nothing about light/dark mode.
2. **SurfacePalette context** — `ThemeModeProvider` (`src/styles/theme/ThemeModeProvider.tsx`, mounted above the router in `main.tsx`) holds `mode` + `toggleMode` and exposes `palette: DARK_PALETTE | LIGHT_PALETTE` via `useThemeMode()`. Eight components consume `useThemeMode().palette` directly in `sx`.

There is **no MUI `ThemeProvider` at all** on WorldMap, `/admin/fights/new`, or the `CountryRouter` Suspense fallback — components there get MUI's default theme. On top of that, hardcoded colors ignore mode entirely: `Spinner.scss` overlay uses `$bg: #f0f0f0` (light flash in dark mode), `FeedbackModal` is a frozen dark card (`#0b0b0f`, `#f5f5f7`), and both toggles are hardcoded black (user confirmed 2026-07-19 this is _not_ intentional — tokenize).

Constraints: arrow functions only; types in colocated `*.types.ts`; `@/*` imports; MUI v7 + SCSS; strings in both locales (no new strings expected); Vitest 2.x untouched.

## Goals / Non-Goals

**Goals:**

- One source of truth at the component level: `theme.palette.surfaces` (plus standard MUI slots), available on **every** route.
- `useThemeMode()` slims to `{ mode, toggleMode }`.
- Spinner overlay, FeedbackModal, and both toggles react to mode.
- Shared pill/stat/card-active `sx` primitives extracted for reuse by Change 2 (`split-fighter-card`).

**Non-Goals:**

- No visual redesign — colors re-sourced, layout/shape/motion untouched.
- No `CssBaseline` introduction (would alter global styles beyond scope).
- No splitting of `FighterCard` (Change 2) and no WorldMap hover perf work (Change 3).
- No changes to country accent palettes (`colorPalette` in configs) or to the SCSS variable file beyond what Spinner needs.

## Decisions

### D1 — Expose `SurfacePalette` as `theme.palette.surfaces` via module augmentation

New `src/styles/theme/muiPalette.types.ts` augments `@mui/material/styles`:

```ts
declare module '@mui/material/styles' {
  interface Palette {
    surfaces: SurfacePalette;
  }
  interface PaletteOptions {
    surfaces?: SurfacePalette;
  }
}
```

Components read it with `sx={(theme) => ({ bgcolor: theme.palette.surfaces.surface })}` or `useTheme()`. _Alternative considered:_ keeping the context palette and only fixing the hardcoded components — rejected; it preserves the dual-source problem the audit flagged.

### D2 — Global mode-aware base theme mounted by `ThemeModeProvider`

New `createAppTheme(mode)` in `src/styles/theme/createAppTheme.ts` returns `createTheme({ palette: { mode, surfaces: mode === 'dark' ? DARK_PALETTE : LIGHT_PALETTE } })`. `ThemeModeProvider` wraps children in MUI's `ThemeProvider` with this theme (memoized on `mode`). This makes `theme.palette.surfaces` valid on WorldMap, the admin form, Suspense fallbacks, and inside `FeedbackModal`/`Spinner` wherever they render. _Alternative:_ per-route providers — rejected, leaves gaps and repeats the current fragmentation.

### D3 — `createCountryTheme(config, mode)` + `useCountryTheme(config)` hook; delete static theme files

`createCountryTheme` gains a `mode` parameter and merges `palette.mode` + `surfaces` alongside the country accents. Because it now depends on runtime state, the static `export const theme = createCountryTheme(config)` modules (`mexicoTheme.ts`, `thailandTheme.ts`, `unitedStatesTheme.ts`, `_CountryTemplate/config/countryTheme.ts`) are deleted and replaced by a hook in `src/styles/theme/useCountryTheme.ts`:

```ts
const useCountryTheme = (config: CountryPageConfig): Theme => {
  const { mode } = useThemeMode();
  return useMemo(() => createCountryTheme(config, mode), [config, mode]);
};
```

Country pages call it once and keep passing the resulting `Theme` to `CountryPage`/`ErrorFallback`, so `CountryPageProps` and `ErrorFallbackProps` are unchanged. _Alternative:_ building the theme inside `CountryPage` — rejected because `ErrorFallback` needs the same theme on the error path and the prop API would churn for no gain. Update `_CountryTemplate/CONTRIBUTING.md` and the `add-country` skill only if they name `countryTheme.ts` (verify during implementation).

### D4 — `useThemeMode()` drops `palette`

`ThemeModeContextValue` becomes `{ mode, toggleMode }`. All eight `useThemeMode().palette` consumers (`CountryPage`, `CountryChipBar`, `TopFights`, `FightCard`, `FightInfoSection`, `TopFighters`, `FighterCard`) migrate to `theme.palette.surfaces`. Compile-time enforcement: any missed consumer fails `tsc`. _Alternative:_ keeping `palette` as a deprecated re-export — rejected; the acceptance criterion is that no component mixes the two sources, and leaving the field invites regression.

### D5 — Spinner via CSS custom properties published by `ThemeModeProvider`

`ThemeModeProvider` sets, in an effect keyed on `mode`, CSS custom properties on `document.documentElement` from the active `SurfacePalette`: `--surface-page`, `--surface-text-primary` (extend only as needed). `Spinner.scss` switches `background-color: var(--surface-page, #{$bg})` and label/tagline `color: var(--surface-text-primary, #{$black})`; the red bars and black bar-borders stay (brand look, legible on both surfaces). SCSS fallbacks preserve today's rendering if the provider ever isn't mounted. _Alternative:_ a mode modifier class passed as prop — rejected; Spinner renders in Suspense fallbacks where threading props is awkward, and CSS vars also serve any future SCSS.

### D6 — `FeedbackModal` sources surfaces from theme; variant colors stay semantic constants

Card `bgcolor: '#0b0b0f'` → `theme.palette.surfaces.surface`; title `#f5f5f7` → `surfaces.textPrimary`; message → `surfaces.textSecondary`; button label `#0b0b0f` → contrast-appropriate token (`common.white`-on-variant works for both variants; verify visually). The success/error gradients, glows, and icon colors remain in `VARIANT_STYLES` as named semantic constants — they are feedback colors, not surfaces. The backdrop scrim stays a literal (a scrim is intentionally mode-independent). Visual result: dark card in dark mode, light card in light mode, same composition and motion.

### D7 — Tokenize `ThemeModeToggle` + `LanguageToggle` (user decision)

Keep the brutalist geometry (square corners, hard offset shadow, Anton font) but source colors from `theme.palette.surfaces`: block background `chipBg`→ no — use `textPrimary` as the block color and `page`/`surface` for the pressed/selected inversion, i.e. dark mode: near-white block with dark glyphs inverted from today; light mode: near-black block. Concretely: background `surfaces.textPrimary`, glyph/label `surfaces.page` (inverted pair guarantees contrast in both modes), shadow/border from `surfaces.borderStrong`-derived color. Exact mapping is refined visually during implementation; requirement is only "derives from tokens, adapts on toggle, keeps the shape language".

### D8 — Shared style primitives in `src/pages/countries/components/shared/`

New folder with `sharedStyles.ts` (+ `sharedStyles.types.ts` if types needed) exporting:

- `pillSx` — the static pill block (padding, radius, blur, type ramp) currently duplicated in `FighterCard` and `FightInfoSection`'s tag chips.
- `statLabelSx` / `statValueSx` — theme-callback variants of the stat typography duplicated in `FighterCard.statsBlock` and `FightInfoSection`'s stats grid.
- `cardSurfaceSx(theme)` and `cardActiveSx(theme)` — the surface-card shell (surface bg, border, radius, overflow) and hover/focus "active" styles duplicated between `FighterCard` and `FightCard`.

Static parts are module-scope `as const` objects; mode-dependent parts are `(theme: Theme) => SxProps` callbacks. Size/position overrides stay local via spread. Change 2 will consume these when splitting `FighterCard`.

### D9 — Raw hex sweep

`#fff` on primary-colored buttons → `common.white`; `rgba(0,0,0,0.65)`-style overlays on imagery stay as literals (scrims over photos are mode-independent by design) unless a token exists (`pillScrim`). `YOUTUBE_RED` stays, named. `_variables.scss` keeps `$bg`/`$black` as fallbacks only.

## Risks / Trade-offs

- [Nested `ThemeProvider` on country pages replaces the base theme] → `createCountryTheme` itself now injects `mode` + `surfaces`, so the country theme is self-sufficient; nothing relies on theme merging.
- [Module augmentation not picked up → `surfaces` type errors] → the augmentation file is exported from the theme barrel (`src/styles/theme/index.ts`) so it's always in the compilation graph; `yarn build` gates it.
- [FeedbackModal in light mode may look off (glow tuned for dark)] → acceptance includes a real click-through of the admin form in both modes; adjust glow alpha per mode if needed, still token-sourced.
- [Toggles' new inverted look may read differently than expected] → geometry unchanged; verify against user in click-through, easy to remap since colors are now tokens.
- [Deleting `config/*Theme.ts` breaks the `add-country` scaffold] → grep the skill + `CONTRIBUTING.md` for `Theme.ts` references and update in the same change.
- [Tests referencing removed `palette` from `useThemeMode`] → `yarn test:run` gates; `TopFighters.test.ts` and `TopFights.test.ts` mention the hook — update mocks if they stub `palette`.

## Migration Plan

Single change, single commit (user commits). Order inside the change: theme core (D1–D4) → compile-driven consumer migration → mode-bug fixes (D5–D7) → shared primitives + hex sweep (D8–D9). Rollback = revert the one commit; no data or API surface involved.

## Open Questions

None — the two user-owned decisions (tokenize toggles; delete stale change) were resolved 2026-07-19.
