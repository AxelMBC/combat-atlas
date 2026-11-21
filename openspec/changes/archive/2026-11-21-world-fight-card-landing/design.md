## Context

The index route renders `WorldMap` (`src/pages/WorldMap/WorldMap.tsx`). It is a `react-map-gl/maplibre` map with a MapTiler-hosted style. Registered countries are matched by `mapLayerId` against fill layers in that style. A bottom `CountryChipBar` lists the countries as MUI `Chip`s with `onClick` (rendered as `div role="button"`, not links).

Measured on 2026-11-20 with the dev server and Playwright:

- **Phone:** at 390×844 the initial view (`WorldMap.tsx:242-248`, `minZoom` 2) shows Europe and Africa, and none of the three countries.
- **Desktop:** entering a country takes a click, then a popup that closes after 3 s (`:166-169`), then a second click.
- **Network:** 18–30 MapTiler requests per visit, 3.4 MB (phone) to 5.1 MB (desktop). This is the sum of `Content-Length`, so it is a lower bound.
- **Bundle:** `maplibre-gl` is a 1,024 kB / 277 kB gzip chunk, fetched as soon as `/` mounts. `maplibre-gl.css` (69 kB raw) is imported statically at `WorldMap.tsx:1`, so every route ships it.
- **Idle cost:** the pulse calls `setPaintProperty` on every animation frame forever (`:191-202`).
- **WebGL workarounds:** an HMR self-invalidate (`:369`), `loseContext` on `pagehide` (`:209`), two auto-retries (`:265`), and `MapFallback` as the error UI.
- **Theme:** the map style ignores the theme mode (out of scope in the archived `explore-bar-theme-reactive` design).

Constraints:

- Code style (`.claude/rules/code-style.md`): arrow functions, colocated `*.types.ts`, `@/` imports, `sx` styling, surface colors from `theme.palette.surfaces`.
- No code comments (owner preference); use names instead.
- Bold, poster-rooted UI (Anton / Merriweather, halftone, skewed ribbons, outlined watermarks) as in `FightTitleCard`.
- Vitest 2.x with jsdom, where `HTMLCanvasElement.getContext` is not implemented.

A throwaway prototype of this design was built and screenshot at desktop and phone sizes during exploration. It ran at 61 fps in headless Chrome. It is not part of the change.

## Goals / Non-Goals

**Goals:**

- One-tap entry to any country on every viewport.
- Geography kept as the identity ("Atlas").
- A landing that speaks the fight-poster language and reacts to theme mode.
- Zero third-party map cost.
- Faster country entry through prefetch.
- A globe that is fun to touch but costs nothing when idle.

**Non-Goals:**

- Backend changes and per-country counts.
- Slippy-map features (zoom, pan, borders).
- Lazy-loading the landing route.
- Redesigning country pages.

## Decisions

### 1. Separate the control from the context

The country **bill** is the navigation: real `<Link>`s, large targets, keyboard and screen-reader friendly, crawlable. The **globe** is context and play. It turns to the selection, tours, can be dragged, and it doubles as a pointer target, but nothing depends on it. If it fails, the landing still works.

Alternatives it beat:

- **Fixing the MapLibre map:** phone geometry makes it impossible to show all countries at a tappable size, and it keeps every cost listed above.
- **Bill only, no globe:** cheapest, but it drops the geography the product name and meta description promise. The globe costs about 13 kB.
- **One full-screen section per country with scroll:** it hides country 2..n below the fold.
- **An arcade-style select screen:** it fits the editorial poster tone worse.

### 2. Canvas 2D halftone renderer, no library

The globe is a hand-written orthographic projection drawn on a 2D canvas.

Alternatives it beat:

- **`cobe`** (WebGL dotted globe, about 5 kB): it can only place markers, it cannot paint a country's land in its accent, it brings WebGL back, and its look is the generic product-landing globe.
- **`d3-geo` + topojson at runtime:** about 40 kB of JS plus geometry to do work that can be precomputed.

Rendering rules:

- **Halftone dots:** dot radius = `pitch × (base + gain × shade)`, with `shade = cosc^0.55`, where `cosc` is the cosine of the angle from the view centre. Opacity follows the same shade. These are tuned constants, named in code.
- **Batched drawing:** for each color (ink, each registered accent), dots are grouped into about 6 shade buckets. Each bucket is one `beginPath` with many `moveTo`/`arc` calls and a single `fill`. There is no `shadowBlur`. The selected country's glow is a second pass of larger, low-alpha dots.
- **Resolution:** device pixel ratio is capped at 2. The canvas resizes with a `ResizeObserver` on its container.
- **Missing canvas:** if `getContext('2d')` returns `null`, the component renders nothing and reports nothing.

### 3. Globe data: Fibonacci-sphere bitmask plus one owner byte per land dot

`scripts/generate-globe-dots.mjs` runs once and is re-run only to change density. It works as follows:

1. Place `GLOBE_SPHERE_POINTS = 24000` points on a Fibonacci sphere: point `i` has `lat = asin(1 − 2i/(N−1))` and `lng` equal to `i × goldenAngle`, wrapped to ±180°.
2. Find each point's Natural Earth admin-0 country (`world-atlas/countries-50m.json`) with a bounding-box prefilter plus `d3-geo.geoContains`.
3. Map the ISO numeric id to alpha-2 with `i18n-iso-countries`. The five features without an id (Kosovo, Somaliland and three others) become unowned land.
4. Emit `src/pages/Landing/HalftoneGlobe/globeDots.generated.ts` with:
   - `GLOBE_SPHERE_POINTS`;
   - `GLOBE_OWNER_CODES`, alpha-2 codes where index 0 means unowned;
   - `GLOBE_LAND_MASK`, base64 with one bit per sphere point;
   - `GLOBE_LAND_OWNERS`, base64 with one byte per land point, as an index into the codes.
5. Run Prettier on the emitted file. The `globe:dots` package script chains both steps.

Measured at N = 24000:

- 6,885 land dots: Mexico 92, Thailand 25, United States 440;
- 3.9 kB gzip as binary;
- about 13 kB raw as base64 in the bundle.

`decodeGlobeDots()` rebuilds `{ lat, lng, ownerCode }` with the same formula and precomputes the trig values once at module load.

Alternatives it beat:

- **A lat/lng JSON list:** about 29 kB gzip.
- **Highlighting only the registered countries:** it would need a regeneration for every new country. Owning every dot means a new registry `isoCode` lights up immediately.

The four generator packages are **devDependencies only** and add no runtime bytes. They keep the data reproducible instead of committing an opaque blob. The formula appears in both the script and the decoder. The decoder test pins that they agree (decision 13).

### 4. React owns the selection; a render loop owns the motion

`HalftoneGlobe` receives:

- the registered countries (`isoCode`, `center`, `accentColor`);
- `selectedIsoCode`;
- a `spin` request (`{ id, isoCode }`);
- theme colors (`ink`, `page`);
- `reduceMotion`;
- the callbacks `onPointCountry(iso | null)`, `onEnterCountry(iso)` and `onSpinSettled()`.

`useGlobeRenderer` keeps the view (`λ`, `φ`), the velocity, the target, the drag state and the color transition in refs, and runs a `requestAnimationFrame` loop **only while something moves**:

- the spring has not settled;
- a drag or its inertia is active;
- a color transition is running.

It stops when `|target − view| < 0.002 rad` and `|v| < 0.01 rad/s`. React re-renders only on selection changes, never per frame.

Motion constants, all named in code:

| Motion | Value |
|---|---|
| Selection spring | k = 60, damping ratio 0.9 |
| Spin | adds 2 extra turns, k = 10, damping ratio 1 |
| Tilt | `−clamp(lat × 0.7, ±30°)` |
| Drag | `Δλ = dx / R`, so the point under the pointer follows it |
| Inertia | exponential friction |
| Tap threshold | 6 px of movement |
| Hit radius | `max(10 px, 1.6 × pitch)` from the last frame's projected registered-country dots |

The shorter way around is the target longitude wrapped through `atan2(sin Δ, cos Δ)`.

The **pulsing ring** is a DOM element positioned absolutely over the canvas. Its pulse is a CSS keyframe on `transform` and `opacity`. The loop only updates its position, or hides it on the far hemisphere. That keeps the loop free to stop while the ring keeps pulsing. With reduced motion, the ring is static, the spring jumps straight to its target, and drag has no inertia.

**Theme colors** reach the canvas as props. When they change, the loop interpolates ink and page colors over 200 ms, matching the DOM's `transition` timing, then stops.

### 5. Selection, tour, spin and walkout as one small state model

```
                 hover / focus / press row, hover lit dots
                ┌───────────────────────────────┐
                ▼                               │
  SELECTED(slug) ── tour tick (4.5 s idle) ──► SELECTED(next)
       │   ▲
       │   └── drag (selection unchanged; tour paused)
       │
       ├── spin control ──► SPINNING(random) ── onSpinSettled ──┐
       │                    (selection frozen,                 │
       │                     spin control disabled)            ▼
       └── activate link / tap lit dots ───────────────► WALKOUT(slug)
                                       (all input ignored) ── 380 ms ──► navigate(/slug)
```

- **Tour (`useCountryTour`):** a `setTimeout` chain. Any pointer-enter, pointer-down or `focusin` on the bill or globe pauses it, and so does a drag. A pointer-leave, `focusout` leaving the landing, or the end of a drag restarts the 4.5 s timer. `visibilitychange` to hidden clears it. The tour is disabled with reduced motion.
- **Frozen states:** while spinning or walking out, row hover/focus and globe pointing do not change the selection, and activations are ignored.
- **Random pick:** `pickRandomCountry(entries, excludeSlug, random)` is a pure function with an injectable `random`. It excludes the selected country when more than one exists. The existing `pickRandomEvent` is typed to `MainEvent` and returns an index pair, so it is not reused.

### 6. Walkout and click interception

`useWalkout()` returns `{ walkoutEntry, startWalkout }`:

- **Link clicks:** the row's `onClick` calls `preventDefault()` and `startWalkout(entry)` only when the click is a plain primary click: `button === 0` and no ctrl, meta, shift or alt key (`isPlainPrimaryClick`). Any other click keeps the browser default.
- **Reduced motion:** the row does not intercept at all, so `<Link>` navigates immediately. Globe taps and the spin call `navigate()` directly.
- **Navigation:** `startWalkout` sets `walkoutEntry`, and after `WALKOUT_MS = 380` calls `navigate('/<slug>')`. The timer is cleared on unmount.
- **The wipe:** `WalkoutWipe` is a fixed full-screen framer-motion panel, `skewX(-12deg)`, in the accent color. It sweeps from off-screen left to cover the screen, with the country name in Anton scaling in. Its text color comes from `getContrastText`.

The country page's own `Spinner` takes over after navigation.

### 7. Prefetch with in-flight dedupe

New `src/store/country/countryDataCache.ts`:

- `readCache` and `writeCache` move here unchanged from `thunks.ts` (same `country_<slug>` key, same 30-min TTL).
- `loadCountryData(slug)` returns the cached data, else the in-flight promise for that slug, else a new `getCountryData(slug)`. A new request writes the cache on success and clears the in-flight entry when it settles either way.
- `prefetchCountryData(slug)` calls `loadCountryData` and swallows the rejection.

`fetchCountry` becomes `loadCountryData` plus `rejectWithValue('error.countryData')` on failure. The behavior covered by `thunks.test.ts` is unchanged.

Landing intent (`pointerenter` with a mouse, `focus`, `pointerdown`) calls `entry.loader()` and `prefetchCountryData(entry.slug)`. Both are idempotent. `loader()` warms the dynamic import, so `CountryRouter`'s `lazy(entry.loader)` resolves from the module cache.

Failure paths:

- A prefetch that fails before navigation leaves nothing cached, so the page fetches again.
- A prefetch still in flight at navigation is shared. If it then fails, the page shows its normal error and retry.

`api.ts` already retries 5xx and no-response errors three times. The backend rate limit (100 requests per 15 min per IP) is not at risk: at most one request per country per 30 minutes.

### 8. Remembering the last visited country

New `src/pages/countries/lastVisitedCountry.ts` exports `rememberLastVisitedCountry(slug)` and `readLastVisitedCountry()`. It uses the `sessionStorage` key `lastVisitedCountry`, wrapped in `try/catch` like the country cache.

- `CountryRouter` calls `rememberLastVisitedCountry` in an effect when the slug resolves to a registry entry. It is the single entry point to every country page, so deep links, the back link and the browser back button are all covered.
- `Landing` reads the value once for its initial selection, falls back to `countryRegistry[0]` when the slug is unknown, and starts the globe's view already at that country's target, with no spin-in.

### 9. Registry shape

```ts
interface GeoPoint { lat: number; lng: number }
interface CountryPortrait { src: string; fighterName: string }
interface CountryEntry {
  slug: string;
  nameKey: TranslationKey;
  disciplineKey: TranslationKey;
  isoCode: string;
  center: GeoPoint;
  accentColor: string;
  portrait?: CountryPortrait;
  loader: () => Promise<{ default: ComponentType }>;
}
```

`mapLayerId` is removed. `isoCode` is ISO 3166-1 alpha-2. It is used for the globe owner lookup and is shown as the outlined watermark.

Entries:

| Country | `center` | `disciplineKey` | Portrait |
|---|---|---|---|
| Mexico | `{ lat: 23.6, lng: -102.5 }` | `country.mexico.discipline` | `canelo_alvarez.webp` (1200×720, 72 kB), "Canelo Álvarez" |
| Thailand | `{ lat: 15.0, lng: 101.0 }` | `country.thailand.discipline` | `saenchai.jpg` (711×400, 35 kB), "Saenchai" |
| United States | `{ lat: 39.5, lng: -98.4 }` | `country.unitedStates.discipline` | `kyle_snyder.webp` (1350×1080, 118 kB), "Kyle Snyder" |

`dan_gable.webp` (192×226) was rejected for the United States portrait as too small. The portraits are an editorial choice and can be swapped in the registry.

`registry.ts` imports the portrait files from each country's resources folder. The registry is already the one module that reaches into country folders (through `loader`). Vite emits these as URL strings, so no image bytes load until an `<img>` renders them.

### 10. Portrait rendering

`StagePortrait` keeps a `Set` of slugs selected at least once in this mount, and mounts an `<img>` only for those. That satisfies "not requested before first selection".

- **Visibility:** each image is stacked absolutely and shown with `opacity` 1 only when it is the selected one and has fired `onLoad`, with a 400 ms crossfade. `onError` marks that slug as broken and renders nothing for it.
- **Treatment:** a wrapper filled with the accent; the image in `grayscale(1) contrast(1.25)` blended into it (`mix-blend-mode: multiply` on the paper stage, `screen`/`luminosity` on the dark stage); a 6 px halftone dot overlay; and a `mask-image` that fades it into the stage. The exact blend is tuned visually in both modes during apply.
- **Placement:**
  - md and up: behind the globe in the right column, bottom-anchored, about 90 vh tall;
  - below md: behind the globe, fading downward.
- **Caption:** the fighter's name, in small letter-spaced Anton, below the globe.

The whole stage, including canvas, watermark, coordinates and portrait, is `aria-hidden`.

### 11. Theme, typography and layout

- **App theme:** the landing uses the app theme (`createAppTheme`), not a country theme. Fonts come from `HEADLINE_FONT` and `BODY_FONT` in `sx`, and the landing imports `@/styles/fonts/default.scss` for Anton, like the country pages do.
- **Surfaces:**
  - stage: `surfaces.page`;
  - ink and filled names: `surfaces.textPrimary`;
  - outlines: `alpha(textPrimary, 0.38)`;
  - muted text: `surfaces.textMuted`;
  - accent glow: `alpha(accent, 0.3)` in dark mode, `0.18` in light mode;
  - halftone texture: `alpha(textPrimary, 0.14)`.

  All transition with `0.2s ease`, like the old bar.
- **Readable text on accents:** ribbon and wipe text use `palette.getContrastText(accent)`. Thailand's amber gets dark text.
- **Site credit:** `SiteCredit tone` follows `useThemeMode().mode`, as before.
- **Layout:**
  - md and up: CSS grid with columns `minmax(420px, 44%) 1fr`, the bill on the left and the globe at `min(46vw, 82svh)`;
  - below md: a single column with the globe first at `min(88vw, 44svh)`, the bill below with rows of at least 44 px, and the "COMBAT ATLAS" eyebrow top-left at the toggles' height.
- **Name size:** `clamp(2.3rem, min(5.6vw, 9vh), 6.2rem)`, so short desktop heights don't overflow.
- **"Enter" cue:** on the selected row under `@media (hover: hover)`; under `(hover: none)`, an arrow on every row. This is a capability query, not a width query.
- **Entrance:** rows stagger in with the same expo ease used by the title card, defined locally because features don't import from each other. There is no entrance animation with reduced motion.

### 12. What is removed or renamed

- **Deleted:** `src/pages/WorldMap/` (`WorldMap.tsx`, `CountryChipBar.tsx`, `index.tsx`) and `src/styles/WorldMap/styles.scss`.
- **Dependencies:** `maplibre-gl` and `react-map-gl` are uninstalled.
- **Fallback:** `MapFallback` becomes `LandingFallback`. The `onRetry` and `canSoftRetry` props are dropped (retry = reload), and its copy no longer mentions a map. It remains the index route's `ErrorBoundary` fallback in `main.tsx`.
- **i18n keys:**
  - `worldMap.*` becomes `landing.*`;
  - `mapFallback.*` becomes `landingFallback.*`;
  - `nav.backToWorldMap` becomes `nav.backToLanding` ("← Todos los países" / "← All countries");
  - new: `landing.tagline`, `landing.enter`, `landing.spin`, `landing.hemisphere.{north,south,east,west}` (es N/S/E/O, en N/S/E/W), and `country.<x>.discipline`;
  - `spinner.tagline.exploreWorld` loses "en un mapa".
- **`index.html`:** the description and OG description say "interactive atlas of combat sports, country by country" instead of "world map".
- **Environment:** `VITE_MAPTILER_KEY` is dropped. Claude cannot read `.env*` files, so the owner removes it from `.env.example`, the local `.env` and Vercel.

### 13. Tests

- **`globeMath.test.ts`:**
  - the projection puts the view centre at the disc centre;
  - the antipode is hidden;
  - the shortest delta from Mexico to Thailand is westward with `|Δ| < π`;
  - the spring converges and reports settled;
  - dot radius grows with shade.
- **`decodeGlobeDots.test.ts`:**
  - the land count equals the mask's popcount;
  - dots within 2° of the Mexico, Thailand and United States centres are owned by `MX`, `TH` and `US`;
  - a mid-Atlantic point has no land dot;
  - every owner index is in range.
- **`pickRandomCountry.test.ts`** and **`isPlainPrimaryClick.test.ts`.**
- **`countryDataCache.test.ts`:**
  - two concurrent `loadCountryData` calls make one `getCountryData` call;
  - a failed prefetch is swallowed and the next load requests again;
  - a cache hit makes no request.

  `thunks.test.ts` must pass unchanged.
- **`lastVisitedCountry.test.ts`:** it round-trips a slug and survives an unavailable `sessionStorage`.
- **`Landing.test.tsx`** (MemoryRouter, `getContext` stubbed to return `null` to silence jsdom's not-implemented error):
  - one link per registry entry with the right `href` and accessible name;
  - hover and focus select a row;
  - only the selected country's portrait `<img>` exists until another is selected;
  - a plain click shows the wipe and navigates after `WALKOUT_MS` (fake timers);
  - a ctrl-click is not prevented;
  - with reduced motion, a click navigates immediately;
  - a remembered slug is selected initially;
  - hovering a row calls the entry's `loader` and `prefetchCountryData` once;
  - the spin control under reduced motion navigates to a country other than the selected one.

## Risks / Trade-offs

- Canvas cost on low-end phones (about 3.4k visible dots per frame while moving) → batched fills, render-on-demand, DPR cap 2. A manual check with 4× CPU throttling is in the tasks. If it is still heavy, draw every other dot when the globe radius is under 150 px.
- Motion fatigue from the tour → it pauses on any interaction and is off with reduced motion and in hidden tabs. Spin and drag are user-started.
- Thailand is small (25 dots) → the selected glow pass, the ring and the "TH" watermark carry it. Raise `GLOBE_SPHERE_POINTS` and re-run `yarn globe:dots` if needed.
- Low-resolution portraits (Saenchai 711×400) upscaled → the duotone, halftone and mask hide softness. Accepted.
- Portrait rights → no new images. They are the files already shipped on the country pages.
- The landing and its globe data now sit in the main chunk (about 13 kB of base64 plus the components) → still a large net drop: maplibre's 69 kB of CSS leaves every route, and the 277 kB gzip chunk and 3–5 MB of tiles leave `/`. The build check reports the before and after sizes.
- The generator and decoder each hold the Fibonacci formula → the decoder test pins known countries to known places, so a divergence fails CI.
- `explore-bar-theming` ends with no requirements after archive → archive leaves or removes the empty spec. Its contract lives in `landing-fight-card`.
- A user who middle-clicks gets no prefetch credit for the new tab → harmless.

## Open Questions

- None. Answered during propose: no counts in this change; the spin enters the country; portraits are in scope; light mode is the newsprint variant.
