# explore-bar-theming Specification

## Purpose

Ensure the world map's bottom country-explorer bar (`CountryChipBar`) is fully theme-reactive, deriving its colors from the active theme's `SurfacePalette` so it stays legible and transitions smoothly across dark and light modes.

## Requirements

### Requirement: Explore bar reacts to theme mode

The world map's bottom country-explorer bar (`CountryChipBar`) SHALL derive all of its colors from the active theme's `SurfacePalette`, obtained via `useThemeMode()`. It MUST NOT use hard-coded dark color values for its background, borders, prompt text, or chips.

#### Scenario: Toggling to light mode on the landing page

- **WHEN** the user is on the world map landing page in dark mode and clicks the theme toggle
- **THEN** the explore bar's background, border, prompt text, and chips immediately update to their light-mode palette values without requiring navigation to a country page

#### Scenario: Toggling back to dark mode

- **WHEN** the user is on the world map landing page in light mode and clicks the theme toggle
- **THEN** the explore bar returns to its dark-mode palette values

#### Scenario: Initial render honors the persisted preference

- **WHEN** the landing page first renders with a persisted `preferredTheme` of `light`
- **THEN** the explore bar renders in its light-mode palette values on first paint, with no dark-styled flash

### Requirement: Explore bar contents remain legible in both modes

The explore bar's prompt label, country chips, and site credit SHALL maintain readable contrast against the bar surface in both dark and light modes.

#### Scenario: Chips are readable in light mode

- **WHEN** the bar is rendered in light mode
- **THEN** the chip background, chip text, and chip border use the light palette's chip and border tokens so the chip labels remain readable

#### Scenario: Site credit adapts to mode

- **WHEN** the theme mode changes between dark and light
- **THEN** the `SiteCredit` in the bar switches its `tone` (`onDark` in dark mode, `onLight` in light mode) so it stays legible against the bar surface

### Requirement: Explore bar color changes are perceptibly smooth

The explore bar SHALL animate its color change on toggle rather than snapping abruptly, consistent with the palette-driven transitions used elsewhere in the app.

#### Scenario: Smooth transition on toggle

- **WHEN** the user toggles the theme
- **THEN** the bar's surface and text colors transition smoothly rather than changing instantaneously
