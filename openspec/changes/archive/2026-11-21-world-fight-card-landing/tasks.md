# Replace the world map with the World Fight Card landing: a poster bill of countries and a halftone globe

## 1. Globe data

- [x] 1.1 Add devDependencies `world-atlas@^2`, `topojson-client@^3`, `d3-geo@^3` and `i18n-iso-countries@^7` with `yarn add -D`
- [x] 1.2 Create `scripts/generate-globe-dots.mjs`. Follow `design.md` §3: Fibonacci sphere of `GLOBE_SPHERE_POINTS = 24000`, bbox prefilter plus `geoContains` against `countries-50m`, numeric id → alpha-2, and base64 land mask plus one owner byte per land dot.
- [x] 1.3 Make the script write `src/pages/Landing/HalftoneGlobe/globeDots.generated.ts`, exporting `GLOBE_SPHERE_POINTS`, `GLOBE_OWNER_CODES`, `GLOBE_LAND_MASK` and `GLOBE_LAND_OWNERS`. The script must print the land count and the Mexico, Thailand and United States dot counts.
- [x] 1.4 Add the `globe:dots` package script, which runs the generator and then `prettier --write` on the generated file. Run it, then commit-ready the output.
- [x] 1.5 Create `decodeGlobeDots.ts` (+ `.types.ts`). It rebuilds `{ lat, lng, ownerCode }` with the generator's formula and precomputes sin/cos once.
- [x] 1.6 Add `decodeGlobeDots.test.ts`:
  - land count equals the mask popcount;
  - dots within 2° of the three registry centres are owned by `MX`, `TH` and `US`;
  - a mid-Atlantic point has no dot;
  - owner indices are in range.

## 2. Registry and data plumbing

- [x] 2.1 In `src/pages/countries/registry.types.ts`:
  - replace `mapLayerId` with `isoCode`, `center: GeoPoint` and `disciplineKey: TranslationKey`;
  - make `accentColor` required;
  - add optional `portrait: CountryPortrait`.
- [x] 2.2 Update the three entries in `registry.ts` with the centres, disciplines and portraits from `design.md` §9. Import the portrait files from each country's resources folder.
- [x] 2.3 Add `country.<x>.discipline` keys for Mexico, Thailand and the United States to `es.ts` and `en.ts` (Boxeo/Boxing, Muay Thai, Lucha/Wrestling).
- [x] 2.4 Create `src/store/country/countryDataCache.ts` (+ `.types.ts` if needed):
  - move `readCache`/`writeCache` there from `thunks.ts`;
  - add `loadCountryData` with in-flight dedupe;
  - add `prefetchCountryData`, which swallows failures.

  Make `fetchCountry` use `loadCountryData`.
- [x] 2.5 Add `countryDataCache.test.ts`:
  - concurrent loads make one request;
  - a failed prefetch is swallowed and the next load retries;
  - a cache hit makes no request.

  Confirm `thunks.test.ts` passes unchanged.
- [x] 2.6 Create `src/pages/countries/lastVisitedCountry.ts` (`rememberLastVisitedCountry`, `readLastVisitedCountry`; `sessionStorage` key `lastVisitedCountry`; `try/catch`) with a test. Call `rememberLastVisitedCountry` from `CountryRouter` when the slug resolves to an entry.

## 3. Globe

- [x] 3.1 Create `globeMath.ts` (+ `.types.ts`) with pure functions for:
  - the orthographic projection and visibility;
  - the shortest-way target longitude;
  - the tilt from latitude (clamped to ±30°);
  - one spring step with a settled flag;
  - halftone dot radius and alpha from shade.

  Name every tuned constant.
- [x] 3.2 Add `globeMath.test.ts`:
  - the centre projects to the disc centre and the antipode is hidden;
  - Mexico→Thailand goes westward with `|Δ| < π`;
  - the spring settles;
  - the radius grows with shade.
- [x] 3.3 Create `useGlobeRenderer.ts`:
  - a rAF loop that runs only while a spring, drag, inertia or color transition is active;
  - batched fills per color and shade bucket, with no `shadowBlur`;
  - a selected-country glow pass;
  - DPR capped at 2;
  - `ResizeObserver` sizing;
  - a 200 ms ink/page color interpolation;
  - positioning the ring element and hiding it on the far side.
- [x] 3.4 Add drag to the renderer: pointer capture, `Δλ = dx / R`, inertia with friction, `touch-action: pan-y` on the globe container, and a 6 px tap threshold.
- [x] 3.5 Add hit-testing on the last frame's projected registered-country dots. Mouse hover reports `onPointCountry` and sets the pointer cursor; a tap or click without drag reports `onEnterCountry`.
- [x] 3.6 Add the spin: a request `{ id, isoCode }` adds 2 turns and uses the softer spring, and `onSpinSettled` fires once it settles. Under reduced motion: jump to target, static ring, no inertia.
- [x] 3.7 Create `HalftoneGlobe.tsx` (+ `.types.ts`): canvas and ring element with the CSS pulse keyframe. Render nothing when `getContext('2d')` returns `null`.

## 4. Landing page

- [x] 4.1 Create `src/pages/Landing/` (`Landing.tsx`, `Landing.types.ts`, `index.tsx`) with:
  - selection state, initialised from `readLastVisitedCountry()` or else the first entry;
  - the stage: accent glow, halftone texture, outlined `isoCode` watermark, coordinates with localized hemisphere letters;
  - import of `@/styles/fonts/default.scss`.
- [x] 4.2 Create `FightCardBilling/` (+ types). It is a `<nav>` with an `<ol>` of `<Link to="/<slug>">` rows, each with:
  - an outlined number;
  - a skewed discipline ribbon whose text color comes from `getContrastText`;
  - the Anton name, outlined when idle and filled with the accent offset outline when selected;
  - the "enter" cue, shown on the selected row under `(hover: hover)` and as an arrow on every row under `(hover: none)`;
  - `aria-label` "<name> — <discipline>", with decorations `aria-hidden`;
  - a visible accent focus outline.
- [x] 4.3 Wire intent on rows and the globe. Mouse `pointerenter` and `focus` select and prefetch; `pointerdown` prefetches. Prefetch is `entry.loader()` plus `prefetchCountryData(slug)`. Selection is frozen while spinning or walking out.
- [x] 4.4 Create `useCountryTour.ts`: next country every 4.5 s, paused by pointer, focus or drag activity on the landing and resumed 4.5 s after it ends. Cleared while the document is hidden; disabled with reduced motion.
- [x] 4.5 Create `isPlainPrimaryClick.ts` (+ test), `useWalkout.ts` (`WALKOUT_MS = 380`, ignores re-entry, clears the timer on unmount) and `WalkoutWipe/` (skewed accent panel with the country name). Rows intercept only plain primary clicks, and never under reduced motion.
- [x] 4.6 Create `pickRandomCountry.ts` (+ test) and the "Gira el mundo" control. It is disabled while spinning; it spins and then walks out; under reduced motion it navigates directly.
- [x] 4.7 Create `StagePortrait/` (+ types):
  - mount `<img>` only for countries selected at least once;
  - crossfade on load;
  - hide on error;
  - render nothing when there is no portrait;
  - accent duotone, halftone overlay and edge mask;
  - fighter-name caption;
  - all `aria-hidden`.

  Tune the blend visually in both modes.
- [x] 4.8 Lay out the page:
  - md and up: two-column grid;
  - below md: globe first at `min(88vw, 44svh)` and a "COMBAT ATLAS" eyebrow top-left;
  - name size `clamp(2.3rem, min(5.6vw, 9vh), 6.2rem)`;
  - `SiteCredit` tone by mode;
  - surfaces from `theme.palette.surfaces` with `0.2s` transitions;
  - row stagger entrance, none under reduced motion.
- [x] 4.9 Add `landing.*` keys to `es.ts` and `en.ts`: `tagline`, `enter`, `spin`, `countriesAria`, `hemisphere.{north,south,east,west}`.
- [x] 4.10 Add `Landing.test.tsx` covering the cases listed in `design.md` §13, with `getContext` stubbed to `null`.

## 5. Remove the map and rename leftovers

- [x] 5.1 Point the index route in `src/main.tsx` at `Landing`.
- [x] 5.2 Delete `src/pages/WorldMap/` and `src/styles/WorldMap/styles.scss`. Run `yarn remove maplibre-gl react-map-gl`.
- [x] 5.3 Rename `src/components/MapFallback/` to `LandingFallback/`:
  - drop `onRetry` and `canSoftRetry` (retry reloads);
  - rename the `mapFallback.*` keys to `landingFallback.*` with copy that does not mention a map;
  - use it as the index route's fallback in `main.tsx`.
- [x] 5.4 Rename the remaining keys and copy:
  - `nav.backToWorldMap` → `nav.backToLanding` ("← Todos los países" / "← All countries") in `CountryPage`, `NotFound`, `ErrorFallback` and both locales;
  - remove the `worldMap.*` keys;
  - reword `spinner.tagline.exploreWorld` without "map" in both locales.
- [x] 5.5 Update `index.html` `description` and `og:description` to describe an interactive atlas of combat sports, country by country.
- [x] 5.6 Grep `src`, `index.html`, `CLAUDE.md`, `README.md` and `.github/` for `maplibre`, `MapTiler`, `mapLayerId`, `WorldMap`, `CountryChipBar`, `MapFallback` and `VITE_MAPTILER_KEY`. Resolve every hit outside archived changes and `graphify-out/`.

## 6. Docs

- [x] 6.1 Update `CLAUDE.md`:
  - drop `VITE_MAPTILER_KEY` from Environment;
  - routing now renders `Landing` at the index route;
  - the country registry fields are the new ones;
  - replace the Map section with a Landing section (bill, canvas globe, generated dots, `yarn globe:dots`).
- [x] 6.2 Update the registry example in `src/pages/_CountryTemplate/CONTRIBUTING.md` (new fields, portrait optional) and its closing sentence about what derives from the registry.
- [x] 6.3 Update Step 4 of `.claude/commands/add-country.md`. The registry entry needs `nameKey`, `disciplineKey` (plus its es/en keys), `isoCode`, `center`, `accentColor`, an optional `portrait`, and `loader`.
- [x] 6.4 (owner) Remove `VITE_MAPTILER_KEY` from `.env.example`, the local `.env` and the Vercel project settings. Claude cannot read `.env*` files.

## 7. Verification

- [x] 7.1 Run `/axl:verify`
- [x] 7.2 Run `yarn build` and report the output:
  - no `maplibre-gl` chunk;
  - the main CSS and JS sizes before (CSS 74.8 kB, JS 882 kB) and after.
- [x] 7.3 Open `/` at 1440×900 in dark mode and check the layout:
  - bill on the left, globe on the right;
  - Mexico selected with red dots, "MX" watermark and Canelo's duotone portrait.

  Then hover Thailand and the United States. Each time:
  - the globe turns the shorter way;
  - the row fills;
  - glow, watermark, coordinates and portrait change;
  - the ring pulses on the country.
- [x] 7.4 Leave the mouse off the landing. The tour selects the next country every ~4.5 s and stops while the pointer rests on a row.
- [x] 7.5 Drag the globe sideways: it follows and coasts. Hover the United States' dots: pointer cursor, United States selected. Click Mexico's dots without dragging: the walkout plays and `/mexico` opens.
- [x] 7.6 Click a row:
  - the accent wipe with the name covers the screen and the country page opens in under half a second;
  - the network panel shows one `GET /countries/<slug>`, sent on hover, and none after the click.

  Ctrl-click a row: a new tab opens and the landing stays put.
- [x] 7.7 Press "Gira el mundo": the globe spins at least one turn, lands on a different country, its row is selected, and the walkout enters it.
- [x] 7.8 Toggle to light mode on the landing:
  - paper stage, dark ink dots and text, accents unchanged, smooth transition with no reload;
  - the Thailand ribbon text is dark on amber.

  Reload: light mode paints with no dark flash.
- [x] 7.9 Open `/` at 390×844 with touch emulation:
  - eyebrow, globe, three rows and the spin control are visible without scrolling;
  - tapping a row enters in one tap;
  - a vertical swipe starting on the globe scrolls the page;
  - a horizontal drag spins it.
- [x] 7.10 Open `/` at 1366×600: no name overflows its row, and every row and the spin control can be reached.
- [x] 7.11 Enter `/thailand` from the landing and press the browser back button: Thailand is selected on the first frame. Open `/united-states` directly and use the "← Todos los países" link: the United States is selected.
- [x] 7.12 Check the network panel:
  - a fresh load of `/` makes no request to `api.maptiler.com` or any tile host;
  - only the selected country's portrait image is requested until another country is selected.
- [x] 7.13 Emulate `prefers-reduced-motion: reduce`:
  - no tour, no spring, a static ring, no entrance or wipe;
  - row clicks navigate immediately;
  - "Gira el mundo" navigates straight to another country.
- [x] 7.14 Tab through the landing: each row shows a focus outline and turns the globe; Enter enters; the spin control is reachable and works with Enter.
- [x] 7.15 In the Performance panel, record 10 s on a settled landing with reduced motion emulated: no animation-frame callbacks. Then record a tour transition with 4× CPU throttling: no frame over about 20 ms.
