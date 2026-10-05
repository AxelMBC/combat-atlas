## Why

The world map landing page hosts the theme (dark/light) toggle, but the "Explore a country" bar pinned to the bottom of that page is styled with hard-coded dark values. Toggling the theme on the landing page produces no visible change until the user navigates into a country page, making the toggle feel broken on the very screen where it lives.

## What Changes

- Make `CountryChipBar` (the bottom "explore a country" bar) subscribe to the active theme mode and drive its surface, border, prompt text, and chip colors from the shared `SurfacePalette` instead of hard-coded `rgba` dark values.
- Switch the bar's `SiteCredit` from a fixed `tone="onDark"` to a mode-aware tone so the credit remains legible in both themes.
- Ensure the color transition reads as an intentional, smooth response to the toggle (consistent with the existing palette-driven country components).

## Capabilities

### New Capabilities

- `explore-bar-theming`: The world map's bottom country-explorer bar reacts to the dark/light theme toggle, using the shared surface palette for all of its colors.

### Modified Capabilities

<!-- None — no existing spec governs the explore bar or world map theming. -->

## Impact

- **Code**: `src/pages/WorldMap/CountryChipBar.tsx` (primary); `src/components/SiteCredit/SiteCredit.tsx` usage via its existing `tone` prop.
- **Consumes**: existing `useThemeMode()` hook and `SurfacePalette` tokens from `src/styles/theme` (already used by country components) — no new theme infrastructure.
- **No API, dependency, or routing changes.** Purely presentational on the landing page.
