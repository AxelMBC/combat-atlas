# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `yarn dev` — Vite dev server
- `yarn build` — type-check (`tsc -b`) then `vite build`
- `yarn lint` — ESLint over the repo
- `yarn format` — Prettier write over `src/**/*.{ts,tsx,scss}`
- `yarn format:check` — Prettier check over the same glob (no writes)
- `yarn preview` — preview production build
- `yarn test` — Vitest in watch mode
- `yarn test:run` — Vitest single run (CI). For one file: `yarn test:run src/store/country/countrySlice.test.ts`
- `yarn globe:dots` — regenerate the landing globe's land data (`src/pages/Landing/HalftoneGlobe/globeDots.generated.ts`) from Natural Earth; only needed to change dot density
- `npx tsc -b --noEmit` — type-check only. Needs `-b`: the root `tsconfig.json` has `"files": []` plus references, so plain `tsc --noEmit` checks nothing

## Environment

- `VITE_API_URL` — backend base URL consumed by `src/services/api.ts` (defaults to `http://localhost:3000/api`)

## Architecture

React 19 + TypeScript + Vite SPA, deployed to Vercel (SPA rewrite in `vercel.json`). The app visualizes combat-sports data per country: a fight-poster landing page, per-country detail pages, and an admin form for ingesting new fight events. All user-facing copy is bilingual (es/en) via the i18n layer.

**Routing (`src/main.tsx`)** — `createBrowserRouter` with a single `App` shell (`<Outlet/>` wrapped in the Redux `Provider`, with `LanguageProvider` above the router). Index route renders `Landing` (with `LandingFallback` as its error fallback); `/admin/fights/new` renders `EventIngestionPage`; `/:countrySlug` renders `CountryRouter`.

**Country routing pattern (`src/pages/countries/`)** — Countries are not hard-coded in the router. `registry.ts` lists `{ slug, nameKey, disciplineKey, isoCode, center, accentColor, portrait?, loader }` entries with dynamic `import()` loaders, and `CountryRouter.tsx` looks up the slug, lazy-loads the matching page (cached in a module-level `Map`), and wraps it in `Suspense` + `ErrorBoundary`. **To add a new country: copy `src/pages/_CountryTemplate/` (see its `CONTRIBUTING.md`, or use the `add-country` skill), add a folder under `src/pages/<Country>`, and append a registry entry — do not touch the router.** `isoCode` (ISO 3166-1 alpha-2) is all the landing globe needs to light the country's land in `accentColor`; `CountryRouter` also records the slug as the last visited country, which the landing starts on.

**State (`src/store/`)** — Redux Toolkit with two slices:

- `country` — `thunks.ts` exposes `fetchCountry(slug)`, which calls `loadCountryData(slug)` from `countryDataCache.ts`: it checks `sessionStorage` (`country_<slug>` key, 30-minute TTL), else reuses the request already in flight for that slug, else calls `getCountryData(slug)` and writes the result back to cache.
- `eventIngestion` — backs `/admin/fights/new`. `fetchFightersByCountry(slug)` reuses `getCountryData` to populate the fighter picker; `submitEvent(formData)` posts to `/events` via `event.service.ts`.

`countryDataCache.ts` also holds `loadCountrySummaries()`: `GET /countries` (`[{ slug, fightIds }]`) cached in `sessionStorage` under `country_summaries` with the same TTL and its own in-flight promise.

**Watch history (`src/store/watchHistory/`)** — not Redux. `watchHistory.ts` owns the `localStorage` key `watchedFights`, a JSON array of fight `_id`s shared by tabs and kept across sessions (anything else reads as empty; storage errors fall back to an empty history), and `useWatchHistory()` exposes it through `useSyncExternalStore`, updating on its own writes and the window `storage` event. A country page records a pool fight (`allFights`, never `topEvents`) when the hero reports `PLAYING`; `useMainVideoQueue` serves unwatched fights first, the "Now playing" header (`FightInfoSection/NowPlayingHeader`) shows `countUnwatched` with a progress rail, and "Another Fight" keeps a plain label until none is left, then turns into "Start over" (forgets that country's pool). The landing drops ids that are in no country's `fightIds` whenever a non-empty summary arrives.

**Services (`src/services/`)** — `api.ts` is a shared Axios instance (10s timeout, `VITE_API_URL` base) with a response interceptor that retries failures (no response, or 5xx status) up to 3x with exponential backoff. All backend calls go through it.

**i18n (`src/i18n/`)** — `LanguageProvider` + `useTranslation()` provide a typed `t(key, params?)` over dictionaries in `locales/{en,es}.ts` keyed by `TranslationKey`. Language is detected from `localStorage` (`preferredLanguage`) then browser locale, defaulting to `es`. New user-facing strings need an entry in **both** locale files.

**Path alias** — `@/*` → `src/*` (configured in `vite.config.ts`, `vitest.config.ts`, and `tsconfig`).

**Styling** — MUI v7 (`@mui/material` + `@emotion`) plus SCSS under `src/styles/`. Per-country MUI themes are built by `createCountryTheme(config)` (`src/styles/theme/createCountryTheme.ts`) from each country's `CountryPageConfig`, and expose `common.black`.

**Landing (`src/pages/Landing/`)** — a fight-poster bill of real `<Link>` rows (`FightCardBilling`) beside a halftone globe drawn on a 2D canvas (`HalftoneGlobe/`, no map library). The globe's land comes from `globeDots.generated.ts`, written by `yarn globe:dots` (`scripts/generate-globe-dots.mjs`, dev-only dependencies) as a Fibonacci-sphere land bitmask plus one ISO owner byte per land dot; `decodeGlobeDots.ts` rebuilds it with the same formula. `globeRenderer.ts` runs a `requestAnimationFrame` loop only while the globe is moving or fading. Hover, focus or press on a country prefetches its chunk and data (`prefetchCountryData` in `src/store/country/countryDataCache.ts`, which dedupes in-flight requests); activation plays a short walkout wipe before navigating. On mount `useCountryFightCounts` loads the country summaries (`loadCountrySummaries`) and each row's ribbon shows that country's fight count from the watch history: total, then "to watch", then "all watched"; the link's accessible name repeats it. A failed or missing `GET /countries` just shows no count.

## Testing

- Tests are colocated `*.test.ts` files using Vitest 2.1.x + Testing Library + jsdom (`src/test/setup.ts`). **Vitest is intentionally pinned to 2.x with its own `vitest.config.ts`** — bumping to 3.x or merging it into `vite.config.ts` reintroduces yarn-v1 dependency-linking and type conflicts.

## Spec workflow

- Living specs are in `openspec/specs/<capability>/spec.md`; they are the source of truth for behavior. Changes in progress go in `openspec/changes/<change>/`, archived ones in `openspec/changes/archive/`.
- Flow: `/axl:explore` → `/axl:propose` (or `/axl:tweak` for small changes) → `/axl:apply` → `/axl:verify` → `/axl:archive`.
- `/axl:audit <path|feature>` reviews existing code outside a change.

## Where the rest of the guidance lives

- **axl plugin** — base rules for every repo (search before creating, no `any`/`enum`, comments policy) and the commit guard: Claude does not commit; work is left in the tree.
- **`.claude/rules/code-style.md`** — code shape for `src/**` (arrow functions, `*.types.ts`, `@/` imports, `sx` and surface tokens). Loaded when editing those files.
- **`.claude/axl.json`** — base branch `dev` (`dev` and `master` protected), branch prefixes, and the checks `/axl:verify` runs (typecheck, lint, format, tests).
- **`/add-country`** — scaffolds a new country page (see the country routing pattern above).

## graphify

Optional. `graphify-out/` holds a knowledge graph of the codebase (god nodes, communities, cross-file relationships). It helps with "how is X connected / what touches Y / trace this flow" questions:

- `graphify query "<question>"`, `graphify path "<A>" "<B>"`, `graphify explain "<concept>"` return a scoped subgraph, usually smaller than `graphify-out/GRAPH_REPORT.md` or raw grep output.
- `graphify-out/wiki/index.md`, if present, is a broad navigation index; `GRAPH_REPORT.md` is for architecture-wide review.
- For exact-string lookups (a symbol name, error string, config key), grep directly.
- `graphify update .` refreshes the graph after code changes (AST-only, no API cost).
