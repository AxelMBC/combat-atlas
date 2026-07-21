# explore-bar-theming — Delta Spec

## MODIFIED Requirements

### Requirement: Explore bar reacts to theme mode

The world map's bottom country-explorer bar (`CountryChipBar`) SHALL derive all of its colors from the active theme's `SurfacePalette`, obtained from the MUI theme (`theme.palette.surfaces`). It MUST NOT use hard-coded dark color values for its background, borders, prompt text, or chips, and it MUST NOT read the palette from `useThemeMode()`.

#### Scenario: Toggling to light mode on the landing page

- **WHEN** the user is on the world map landing page in dark mode and clicks the theme toggle
- **THEN** the explore bar's background, border, prompt text, and chips immediately update to their light-mode palette values without requiring navigation to a country page

#### Scenario: Toggling back to dark mode

- **WHEN** the user is on the world map landing page in light mode and clicks the theme toggle
- **THEN** the explore bar returns to its dark-mode palette values

#### Scenario: Initial render honors the persisted preference

- **WHEN** the landing page first renders with a persisted `preferredTheme` of `light`
- **THEN** the explore bar renders in its light-mode palette values on first paint, with no dark-styled flash
