## Context

The dark/light toggle (`ThemeModeToggle`) and its provider (`ThemeModeProvider`) are already in place and fully functional. `useThemeMode()` exposes `{ mode, toggleMode, palette }`, where `palette` is a `SurfacePalette` (`DARK_PALETTE` / `LIGHT_PALETTE`) with tokens like `page`, `surface`, `border`, `borderStrong`, `textSecondary`, `chipBg`, `chipText`.

Country page components (`FightCard`, `FighterCard`, `FightInfoSection`, `TopFights`, `TopFighters`) already consume `useThemeMode()` and style themselves from `palette.*`. That is why the toggle "works" once you enter a country.

`CountryChipBar` (`src/pages/WorldMap/CountryChipBar.tsx`), however, hard-codes dark values: `background: 'rgba(0,0,0,0.85)'`, white-on-black text, `rgba(255,255,255,...)` chips, and a fixed `<SiteCredit tone="onDark" />`. It never calls `useThemeMode()`, so it is invisible to the toggle. The map canvas itself is a MapTiler raster style and is intentionally out of scope.

## Goals / Non-Goals

**Goals:**

- Make `CountryChipBar` visibly respond to the theme toggle on the landing page.
- Reuse the existing `useThemeMode()` / `SurfacePalette` pattern already established by country components — no new theme plumbing.
- Keep the bar legible and on-brand in both modes.

**Non-Goals:**

- Theming the MapTiler map style / canvas.
- Introducing new palette tokens or changing `SurfacePalette`'s shape.
- Changing the toggle, provider, storage key, or default-mode behavior.
- Restyling other landing-page overlays (hover label, country dialog) — those are map-anchored and read against the map, not the bar.

## Decisions

**Decision: Drive `CountryChipBar` colors from `palette` via `useThemeMode()`.**
Map each hard-coded value to a token:

- Bar `background` → `palette.surface` (with the existing `borderTop` → `palette.border`).
- Prompt `Typography` color → `palette.textSecondary`.
- Chip `color` → `palette.chipText`; chip `background` → `palette.chipBg`; chip `border` → `palette.border`; hover background → `palette.borderStrong` (or `chipBg` layered) for a subtle lift.
- Chip accent dot keeps `accentColor` (country-specific, mode-independent), with the same neutral fallback.

_Alternative considered:_ wrapping the bar in a MUI `ThemeProvider` and reading `theme.palette`. Rejected — the app deliberately uses the lightweight `SurfacePalette` context for surface theming outside country pages, and every sibling component already uses `useThemeMode()`. Consistency wins.

**Decision: Make `SiteCredit` tone mode-aware.**
`SiteCredit` already supports `tone: 'onDark' | 'onLight'`. Pass `tone={mode === 'dark' ? 'onDark' : 'onLight'}` instead of the fixed `onDark`.

**Decision: Add a color transition.**
Add `transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease'` to the bar (and rely on inherited/explicit color transitions for text) so the toggle reads as intentional, matching the `transition` already present on `SiteCredit`.

## Risks / Trade-offs

- **Light-mode chip contrast may read faint** → the light palette's `chipBg`/`chipText`/`border` tokens are already tuned and used by country chips; reuse them rather than inventing new values, and verify visually on the landing page.
- **Accent dot on a light surface** → dots use each country's `accentColor`, which are saturated brand colors chosen to sit on light and dark; keep the existing neutral fallback but confirm no low-contrast dot on the light bar.
- **Only-file change is presentational** → low blast radius; no state, routing, or data paths touched. Verification is visual (toggle on the landing page) plus existing type-check/lint.

## Migration Plan

Not applicable — single presentational component change, no data or API migration. Rollback is reverting the component edit.
