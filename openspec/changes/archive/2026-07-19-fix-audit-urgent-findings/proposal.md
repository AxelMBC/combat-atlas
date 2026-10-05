# Proposal: fix-audit-urgent-findings

## Why

The 2026-07-19 codebase audit (`audit-reports/audit-2026-07-19_21-51-24_full-src.md`, overall 6.7/10) surfaced four user-visible bugs (hero renders "UnitedStates"/untranslated "Thailand", fights without a year display a fabricated "'90", admins cannot ingest United States events, a debug `console.log` ships to production) plus a cluster of cheap, high-leverage defects: an `any`-typed API boundary, three copy-pasted country pages, a selector that re-renders the admin form on every keystroke, mixed-language hardcoded error strings, mouse-only content cards, and dead code. Additionally, country pages render section headings ("Thailand's Wars") even when the section has no content. This change fixes all of them in one pass.

## What Changes

- Country hero always shows the localized country name (`countryNameKey` required; Thailand → "Tailandia" in Spanish, United States → "United States"/"Estados Unidos", never "UnitedStates").
- `TopFights` and `TopFighters` sections (heading included) render only when they have at least one item to show; empty sections disappear entirely.
- Delete the `FightCard.fallbacks.ts` fabricated-data mechanism; fights with no `year` show no year instead of "'90".
- Delete the debug `console.log` in `src/store/country/thunks.ts`.
- Admin event-form country options are derived from `countryRegistry` (adds the missing United States option; future countries appear automatically).
- Type the country-data API boundary: `getCountryData` returns a declared `CountryDataResponse`; both thunks get typed `rejectValue`; the `as string` casts in slices go away.
- Consolidate `Mexico.tsx` / `Thailand.tsx` / `UnitedStates.tsx` into a shared `useCountryPageData(slug, imageResolvers)` hook (arrow function, per project convention); each page becomes config + resource wiring only. The `createCountryPage` factory is explicitly deferred.
- Fix `selectSubmitStatus` to stop returning a fresh object per call (per-field selectors or `createSelector`).
- Make `updateField` generic per field so mismatched field/value pairs no longer compile.
- All user-visible error messages resolve through i18n keys (replace hardcoded "Error fetching country data", "Respuesta inesperada del servidor.", "Error al cargar peleadores", "Error al enviar el evento").
- Fighter and fight cards become keyboard-operable (focusable, Enter/Space activation, visible focus), reusing the pattern from `CinematicHero`.
- Dead-code sweep: `selectedFighter`/`setSelectedFighter` (and their tests), `themeClassName`/`headerTitleKey`/`headerTitleFont` config fields, unused `fightCard.round` locale key, empty `<Typography>` in `FightCard`.
- Run `yarn format` across the repo and add a Prettier check so the single-quote config is actually enforced.
- All new/edited functions and components are arrow functions only (existing project convention, re-affirmed by the user).

Out of scope (deliberate, separate future changes): `FighterCard` split, SurfacePalette/MUI theming unification, WorldMap hover-tooltip performance rework.

## Capabilities

### New Capabilities

- `country-page-data`: typed contract for country data (`CountryDataResponse`), shared fetch/reset/loading behavior for country pages via one hook, session-cache behavior preserved.
- `country-page-sections`: conditional rendering of country page sections — localized hero name, empty sections (TopFighters, TopFights) hidden entirely, no fabricated fallback fight data.
- `event-ingestion-countries`: admin form country options derived from the single country registry.
- `localized-errors`: every user-visible error message resolves through the typed i18n layer in the active language.
- `card-keyboard-access`: fighter and fight cards operable by keyboard with visible focus state.

### Modified Capabilities

<!-- none — existing specs (explore-bar-theming, hero-fullscreen, scroll-focus-cards, youtube-attribution) are unaffected -->

## Impact

- **Pages**: `src/pages/Mexico/Mexico.tsx`, `src/pages/Thailand/Thailand.tsx`, `src/pages/UnitedStates/UnitedStates.tsx` (shrink to wiring), `src/pages/_CountryTemplate/` (template + CONTRIBUTING.md follow the new hook), all five `*.config.ts` files (`countryNameKey` required, dead fields removed).
- **Components**: `CountryPage.tsx`, `CinematicHero` (unchanged API, receives guaranteed-localized name), `TopFighters.tsx`, `TopFights.tsx`, `FighterCard.tsx`, `FightCard.tsx` (+ delete `FightCard.fallbacks.ts`).
- **State/services**: `src/services/country.service.ts`, `src/services/event.service.ts`, `src/store/country/*`, `src/store/eventIngestion/*` (typed payloads, selector fix, generic `updateField`, i18n error keys, dead state removed).
- **Config/i18n**: `src/pages/EventIngestion/eventIngestion.config.ts` (derive from registry), `src/i18n/locales/{es,en}.ts` (new error keys, remove `fightCard.round`).
- **Tests**: `countrySlice.test.ts` (drop `selectedFighter` cases), `thunks.test.ts` (typed payloads, error-key rejections); new coverage for the hook and conditional sections.
- **Tooling**: `package.json` (`format:check` script), formatting-only diff across ~30 double-quoted files.
- **Behavior note**: error UI stops parroting raw backend message text; users see translated, stable messages instead. Backend detail remains available in the console/network tab only.
