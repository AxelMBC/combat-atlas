## Why

The world map landing does not do its one job on phones. At 390×844 none of the three countries is on screen, and no zoom level can fit all three at a tappable size: they span about 200° of longitude, and at that zoom Thailand would be about 17 px wide. On desktop, entering a country takes two clicks through a popup that closes itself after 3 s. The map is also the most expensive and most fragile part of the app:

- a 277 kB gzip maplibre chunk;
- 18–30 MapTiler requests (3.4–5.1 MB) per visit;
- 69 kB of maplibre CSS on every route;
- a paint call on every frame, forever;
- WebGL context workarounds and a dedicated failure page.

Its style ignores the light theme and nothing about it matches the fight-poster language the country pages now speak.

## What Changes

- **BREAKING** (internal): the index route renders a new landing, the **World Fight Card**, instead of the MapLibre world map. `src/pages/WorldMap/` (including `CountryChipBar`) is deleted.
- The landing is a fight-poster bill of countries. Each country is a real link with:
  - a number;
  - a skewed discipline ribbon (★ BOXEO ★);
  - its name in Anton, outlined when idle and filled when selected.

  One click, tap or Enter enters the country through a short "walkout" wipe in its accent color.
- Behind the bill, a halftone globe drawn on a 2D canvas turns to the selected country:
  - land is drawn as dots;
  - each registered country's land is drawn in its accent color.

  The globe tours the countries on its own, can be dragged, and a lit country on it can be clicked or tapped to enter.
- A "Gira el mundo" control spins the globe like a roulette, lands on a random country and enters it.
- Each country can show a fighter portrait (Canelo Álvarez, Saenchai, Kyle Snyder). The portrait is an accent-tinted halftone duotone with the fighter's name, and it loads only once its country is first selected.
- The stage shows the selected country's ISO code as an outlined watermark, its accent glow and its coordinates.
- Hovering, focusing or pressing a country prefetches its page chunk and its data. A second request for the same country reuses the one already in flight.
- After visiting a country, the landing starts with that country selected.
- The landing follows the theme toggle: a dark stage in dark mode, a newsprint stage (dark ink dots on paper) in light mode.
- Registry entries change:
  - `mapLayerId` is replaced by `isoCode`, `center` and `disciplineKey`;
  - `accentColor` becomes required;
  - `portrait` is optional.

  Adding a country still touches only the registry, and no longer needs an edit in the MapTiler-hosted style. **BREAKING** for `CountryEntry`.
- Globe land data is generated once from Natural Earth by `scripts/generate-globe-dots.mjs` (dev-only dependencies) and committed as a ~13 kB module.
- `maplibre-gl` and `react-map-gl` are removed, and so is `VITE_MAPTILER_KEY`.
- `MapFallback` becomes `LandingFallback`. It is still the landing's error-boundary fallback, but with no soft-retry path, since there is no map left to fail.
- Copy changes:
  - new es/en keys for disciplines and landing labels;
  - `nav.backToWorldMap` becomes `nav.backToLanding` ("← Todos los países");
  - the "…en un mapa" spinner tagline and the `index.html` description and OG text are updated.

## Capabilities

### New Capabilities

- `landing-fight-card`: the landing's country bill: links, selection, single-activation walkout, prefetch, spin control, portraits, theme reactivity, phone layout, return-to-last-country, and no third-party map resources.
- `landing-globe`: the halftone globe: how it draws land and registered countries, turning to the selection, auto-tour, drag, pointing at countries on it, idle cost, and degradation without canvas.

### Modified Capabilities

- `explore-bar-theming`: all requirements removed. The explore bar no longer exists, and its theme contract moves to `landing-fight-card`.
- `backend-cold-start`: wording only. The "Landing on the world map" scenario becomes "Landing on the home page".
- `theme-surface-tokens`: wording only. "the world map" becomes "the landing page" in the surface-palette requirement.

## Out of Scope

- Per-country counts on the bill (fights, idols). They need a new `GET /countries` summary endpoint in `combat-atlas-backend` and belong to a separate change.
- Any backend change.
- Changes to country pages beyond the back-link copy and recording the last visited country.
- Lazy-loading the landing route itself; it stays in the main chunk.
- A slippy map, zoom, or country shapes beyond dots.

## Impact

- New `src/pages/Landing/`: page, bill, globe (component, render loop, math, generated data, decoder), portrait, walkout, tour, tests.
- Deleted `src/pages/WorldMap/` and `src/styles/WorldMap/styles.scss`.
- `src/main.tsx`: index route element and its fallback.
- `src/pages/countries/registry.ts` and `registry.types.ts`: new fields.
- `src/pages/countries/CountryRouter.tsx`: records the last visited country.
- `src/store/country/`: new `countryDataCache.ts` (cache, in-flight dedupe, prefetch). `thunks.ts` uses it.
- `src/components/MapFallback/` is renamed to `src/components/LandingFallback/`. `NotFound`, `ErrorFallback` and `CountryPage` use the renamed back-link key.
- `src/i18n/locales/{es,en}.ts`: new and renamed keys.
- `index.html`: meta description and OG description.
- `package.json` and `yarn.lock`:
  - removes `maplibre-gl` and `react-map-gl`;
  - adds devDependencies `world-atlas`, `topojson-client`, `d3-geo` and `i18n-iso-countries`;
  - adds the `globe:dots` script.
- New `scripts/generate-globe-dots.mjs`.
- Docs: `CLAUDE.md`, `src/pages/_CountryTemplate/CONTRIBUTING.md`, `.claude/commands/add-country.md`.
- Owner-side: remove `VITE_MAPTILER_KEY` from `.env.example`, the local `.env` and the Vercel project settings.
