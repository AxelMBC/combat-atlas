---
paths: ['src/**/*.{ts,tsx,scss}']
---

# Code style

Shape only. Formatting is Prettier's job (`yarn format`) and lint rules are ESLint's (`yarn lint`); neither is repeated here.

## Functions and components

- Components and helpers are arrow functions (`const Foo = () => {}`), never `function` declarations. The only class is `ErrorBoundary`, because React error boundaries require one.
- Component files are PascalCase and named after the component (`FightCard.tsx`).

## Types

- Interfaces and types live in a colocated `*.types.ts` file named after the file they serve (`FightCard.tsx` → `FightCard.types.ts`, `formatActivePeriod.ts` → `formatActivePeriod.types.ts`), never inline.
- Exception: types derived from a value with `typeof`/`ReturnType` stay next to that value (`RootState` and `AppDispatch` in `store/index.ts`, `TranslationKey` in `locales/es.ts`).

## Imports

- Across folders, import through the `@/` alias (`@/styles/theme`, `@/types/fighter.types`). Relative imports are only `./` within the same folder; never `../`.

## Styling

- Style MUI components with the `sx` prop. SCSS under `src/styles/` or next to a component is for global and non-MUI styles.
- Responsive values use breakpoint objects in `sx` (`{ xs: …, sm: …, md: … }`) on MUI's default breakpoints; don't write raw width media queries in `sx`.
- Surface colors (page, surface, border, text) come from `theme.palette.surfaces` (`const { surfaces } = useTheme().palette;`, or the `SurfacePalette` helpers in `pages/countries/components/shared/sharedStyles.ts`), never from hardcoded hex or `useThemeMode()`, which only exposes `mode` and `toggleMode`. Country accents come from the country theme (`createCountryTheme`). Fixed black scrims and text shadows over photos/video are the exception.
