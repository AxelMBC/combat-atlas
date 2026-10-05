# theme-surface-tokens — Delta Spec

## ADDED Requirements

### Requirement: Surface palette is exposed through the MUI theme on every route

The active `SurfacePalette` SHALL be available as `theme.palette.surfaces` (with matching `palette.mode`) from a MUI theme on every route — the world map, country pages, the admin ingestion form, and loading/error fallbacks. Components MUST read surface colors from the theme (or CSS custom properties derived from it) rather than from `useThemeMode()` or hardcoded surface hex values. `useThemeMode()` SHALL expose only `mode` and `toggleMode`.

#### Scenario: Surfaces resolve outside country pages

- **WHEN** a component on the world map or `/admin/fights/new` reads `theme.palette.surfaces`
- **THEN** it receives the palette matching the active mode, without a country-page `ThemeProvider` in its tree

#### Scenario: Country theme carries surfaces and mode

- **WHEN** a country page builds its theme via `createCountryTheme(config, mode)`
- **THEN** the resulting theme contains the country accent palette, the mode-matching `surfaces`, and the correct `palette.mode`, and it updates when the user toggles mode

#### Scenario: No dual-source components

- **WHEN** the codebase is inspected after the change
- **THEN** no component consumes `useThemeMode().palette`, and no component mixes theme surface tokens with hardcoded surface hex for the same UI element

### Requirement: Spinner overlay reacts to theme mode

The fullscreen spinner overlay SHALL derive its background and text colors from the active surface palette so that navigating between pages in dark mode produces no light flash. The palette SHALL reach the SCSS layer via CSS custom properties published by `ThemeModeProvider`, with the current light values as fallbacks.

#### Scenario: Dark-mode navigation shows a dark overlay

- **WHEN** the user navigates between pages in dark mode and the spinner overlay appears
- **THEN** the overlay background uses the dark palette's page color and the label/tagline text remains legible against it

#### Scenario: Light mode preserved

- **WHEN** the spinner renders in light mode
- **THEN** the overlay renders with light-palette colors equivalent to today's appearance

### Requirement: FeedbackModal sources surface and text colors from theme tokens

`FeedbackModal` SHALL source its card background and text colors from `theme.palette.surfaces`, adapting to the active mode, while keeping its composition, motion, and the success/error accent gradients, glows, and icon colors as named semantic constants.

#### Scenario: Modal adapts to mode

- **WHEN** a feedback modal opens in light mode
- **THEN** the card renders on the light surface with dark text, and in dark mode on the dark surface with light text, with the variant accent colors unchanged in both

### Requirement: Header toggles adapt to theme mode

`ThemeModeToggle` and `LanguageToggle` SHALL derive their colors from surface palette tokens so they adapt when the mode changes, while preserving the brutalist shape language (square corners, hard offset shadow, existing typography).

#### Scenario: Toggles restyle on mode change

- **WHEN** the user switches between dark and light mode
- **THEN** both toggles update their block, text, and shadow colors from the palette while keeping their geometry, and their labels/glyphs remain legible in both modes

### Requirement: Shared card style primitives

Duplicated pill, stat-typography, and card surface/active `sx` blocks used by `FighterCard`, `FightInfoSection`, and `FightCard` SHALL be defined once as shared exports under `src/pages/countries/components/shared/` and consumed from there.

#### Scenario: Single definition, identical rendering

- **WHEN** the pill badges, stat labels/values, and card hover/focus styles render after the extraction
- **THEN** they are visually identical to before in both modes and both card variants, and each style block has exactly one definition in the codebase
