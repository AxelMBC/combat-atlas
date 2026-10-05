# unify-theming — Proposal

## Why

The app runs two parallel theming systems that don't talk to each other: per-country MUI themes (`createCountryTheme`) and the `SurfacePalette` context (`useThemeMode`), with a third layer of hardcoded hex values sprinkled through components that ignore the light/dark mode entirely. This is the biggest scoring drag in the 2026-07-19 audit (Styling 5/10) and produces real UX bugs — a blinding light spinner overlay between navigations in dark mode, a feedback modal frozen in dark styling, and toggles that never adapt.

## What Changes

- `SurfacePalette` is routed through the MUI theme as a custom `theme.palette.surfaces` slot (module augmentation), so components read one source — `theme.palette.*` — instead of mixing `useThemeMode().palette` with `sx` literals.
- A global mode-aware MUI base theme is mounted by `ThemeModeProvider`, so `theme.palette.surfaces` (and correct `palette.mode`) is available on every route — including WorldMap, the admin form, and Suspense fallbacks that currently render outside any `ThemeProvider`.
- **BREAKING (internal API)** `createCountryTheme(config)` becomes `createCountryTheme(config, mode)`; static per-country `config/*Theme.ts` modules are replaced by a render-time hook, and `useThemeMode()` no longer exposes `palette` (only `mode`/`toggleMode`). All 8 in-repo consumers are migrated in this change.
- Spinner overlay becomes mode-aware via CSS custom properties published by `ThemeModeProvider` (fixes the light flash in dark mode).
- `FeedbackModal` keeps its visual design but sources surface/text colors from theme tokens; success/error gradients stay as named semantic constants.
- `ThemeModeToggle` and `LanguageToggle` are tokenized to adapt to light/dark mode (user decision 2026-07-19: the always-black look was not intentional), keeping the brutalist shape/shadow language.
- Duplicated pill/stat/card-active `sx` blocks in `FighterCard`, `FightInfoSection`, `FightCard` are hoisted to shared primitives under `src/pages/countries/components/shared/`.
- Remaining raw hex in components is swept where a token exists (`#fff` → `common.white`, etc.); `YOUTUBE_RED` stays as a named brand constant.

## Capabilities

### New Capabilities

- `theme-surface-tokens`: the surface palette is exposed as MUI theme tokens (`theme.palette.surfaces`) on every route; mode toggling updates spinner overlay, feedback modals, toggles, and cards consistently; no component reads surface colors from both the context palette and hardcoded hex.

### Modified Capabilities

- `explore-bar-theming`: the requirement currently mandates obtaining the `SurfacePalette` "via `useThemeMode()`"; it changes to reading the palette from the MUI theme (`theme.palette.surfaces`), behavior otherwise unchanged.

## Impact

- **Theme core:** `src/styles/theme/` (`createCountryTheme.ts`, `ThemeModeProvider.tsx`, `useThemeMode.ts`, `themeMode.types.ts`, new MUI palette augmentation types, new base-theme builder + `useCountryTheme` hook, barrel `index.ts`).
- **Palette consumers migrated:** `CountryPage`, `CountryChipBar`, `TopFights`, `FightCard`, `FightInfoSection`, `TopFighters`, `FighterCard`, `ThemeModeToggle`.
- **Mode-bug fixes:** `src/components/Spinner/Spinner.scss`, `src/components/FeedbackModal/FeedbackModal.tsx` (+ `.types.ts`), `src/components/ThemeModeToggle/`, `src/components/LanguageToggle/`.
- **Country pages:** `Mexico`, `Thailand`, `UnitedStates`, `_CountryTemplate` swap static `config/*Theme.ts` imports for the hook; the static theme files are deleted; `_CountryTemplate/CONTRIBUTING.md` and the `add-country` skill updated if they reference the theme file.
- **New shared primitives:** `src/pages/countries/components/shared/` (pill, stat label/value, card surface + active styles).
- **No dependency changes; no backend/API impact.** Change 2 (`split-fighter-card`) will reuse the shared primitives, so this lands first.
