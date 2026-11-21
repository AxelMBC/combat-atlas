## MODIFIED Requirements

### Requirement: Surface palette is exposed through the MUI theme on every route

The active `SurfacePalette` SHALL be available as `theme.palette.surfaces` (with matching `palette.mode`) from a MUI theme on every route — the landing page, country pages, the admin ingestion form, and loading/error fallbacks. Components MUST read surface colors from the theme (or CSS custom properties derived from it) rather than from `useThemeMode()` or hardcoded surface hex values. `useThemeMode()` SHALL expose only `mode` and `toggleMode`.

#### Scenario: Surfaces resolve outside country pages

- **WHEN** a component on the landing page or `/admin/fights/new` reads `theme.palette.surfaces`
- **THEN** it receives the palette matching the active mode, without a country-page `ThemeProvider` in its tree

#### Scenario: Country theme carries surfaces and mode

- **WHEN** a country page builds its theme via `createCountryTheme(config, mode)`
- **THEN** the resulting theme contains the country accent palette, the mode-matching `surfaces`, and the correct `palette.mode`, and it updates when the user toggles mode

#### Scenario: No dual-source components

- **WHEN** the codebase is inspected after the change
- **THEN** no component consumes `useThemeMode().palette`, and no component mixes theme surface tokens with hardcoded surface hex for the same UI element
