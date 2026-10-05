# unify-theming — Tasks

## 1. Theme core (D1–D3)

- [x] 1.1 Add `src/styles/theme/muiPalette.types.ts` augmenting MUI `Palette`/`PaletteOptions` with `surfaces: SurfacePalette`; export the augmentation from the theme barrel
- [x] 1.2 Add `createAppTheme(mode)` in `src/styles/theme/createAppTheme.ts` returning a base theme with `palette.mode` + `palette.surfaces`
- [x] 1.3 Mount MUI `ThemeProvider` with the memoized base theme inside `ThemeModeProvider`
- [x] 1.4 Change `createCountryTheme(config)` to `createCountryTheme(config, mode)`, merging `palette.mode` + `surfaces` with the country accents
- [x] 1.5 Add `useCountryTheme(config)` hook in `src/styles/theme/useCountryTheme.ts` (memoized `createCountryTheme(config, mode)`); export from barrel

## 2. Consumer migration (D4)

- [x] 2.1 Remove `palette` from `ThemeModeContextValue` and `ThemeModeProvider`'s context value; update `themeMode.types.ts`
- [x] 2.2 Migrate `Mexico`, `Thailand`, `UnitedStates`, `_CountryTemplate` pages to `useCountryTheme(config)`; delete the four static `config/*Theme.ts` files
- [x] 2.3 Update `_CountryTemplate/CONTRIBUTING.md` and the `add-country` skill if they reference the deleted theme files
- [x] 2.4 Migrate `useThemeMode().palette` reads to `theme.palette.surfaces` in `CountryPage`, `CountryChipBar`, `TopFights`, `FightCard`, `FightInfoSection`, `TopFighters`, `FighterCard`; fix any test mocks stubbing `palette`
- [x] 2.5 Run `yarn build` to compile-verify no remaining `palette` consumers or missing augmentation

## 3. Mode-bug fixes (D5–D7)

- [x] 3.1 Publish `--surface-page` / `--surface-text-primary` CSS custom properties from `ThemeModeProvider` (effect keyed on mode)
- [x] 3.2 Make `Spinner.scss` overlay/label/tagline consume the CSS custom properties with current SCSS values as fallbacks
- [x] 3.3 Restyle `FeedbackModal` card/text from `theme.palette.surfaces` tokens, keeping `VARIANT_STYLES` accent constants and backdrop scrim
- [x] 3.4 Tokenize `ThemeModeToggle` colors from surface tokens (inverted block pair), keeping geometry and focus-visible treatment
- [x] 3.5 Tokenize `LanguageToggle` the same way, including selected-state inversion and divider

## 4. Shared primitives + hex sweep (D8–D9)

- [x] 4.1 Create `src/pages/countries/components/shared/sharedStyles.ts` exporting `pillSx`, `statLabelSx`, `statValueSx`, `cardSurfaceSx`, `cardActiveSx` (types in `*.types.ts` if needed)
- [x] 4.2 Consume the shared primitives in `FighterCard`, `FightInfoSection`, `FightCard`, deleting the local duplicates
- [x] 4.3 Sweep remaining raw hex where a token exists (`#fff` → `common.white` on primary buttons etc.); keep `YOUTUBE_RED` and photo scrims as named/literal by design

## 5. Verification

- [x] 5.1 `yarn build`, `yarn lint`, `yarn test:run`, and Prettier check all green
- [ ] 5.2 Click-through at `localhost:5173` in both modes: world map (explore bar, toggles), a country page (spinner, cards, pills, stats), admin form (feedback modals) — spinner overlay no longer flashes light in dark mode _(pending user visual verification — browser automation unavailable this session)_
- [x] 5.3 Run `graphify update .` and stage changes; suggest a single gitmoji commit title to the user (no commit)
