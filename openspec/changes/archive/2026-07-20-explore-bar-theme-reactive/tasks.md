## 1. Wire the explore bar into theme mode

- [x] 1.1 In `src/pages/WorldMap/CountryChipBar.tsx`, import `useThemeMode` from `@/styles/theme` and read `const { mode, palette } = useThemeMode();`

## 2. Drive bar colors from the palette

- [x] 2.1 Replace the bar `Box` `background: 'rgba(0,0,0,0.85)'` with `palette.surface`, and `borderTop` color with `palette.border`
- [x] 2.2 Add a color transition to the bar: `transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease'`
- [x] 2.3 Replace the prompt `Typography` color with `palette.textSecondary`
- [x] 2.4 Replace each `Chip`'s `color` with `palette.chipText`, `background` with `palette.chipBg`, and `border` with `1px solid ${palette.border}`; set the hover background to `palette.borderStrong`
- [x] 2.5 Keep the accent dot on `accentColor ?? <neutral fallback>` (mode-independent); confirm the fallback is visible on the light surface

## 3. Make the site credit mode-aware

- [x] 3.1 Change `<SiteCredit tone="onDark" />` to `<SiteCredit tone={mode === 'dark' ? 'onDark' : 'onLight'} />`

## 4. Verify

- [x] 4.1 Run `yarn build` (tsc + vite) and `yarn lint`; fix any type/lint issues
- [x] 4.2 In `yarn dev`, on the world map landing page, toggle the theme and confirm the explore bar background, prompt text, chips, and credit visibly switch between dark and light without navigating away
- [x] 4.3 Reload with `preferredTheme=light` persisted and confirm the bar renders light on first paint (no dark flash) and remains legible in both modes
