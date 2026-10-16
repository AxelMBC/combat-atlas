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
- `npx tsc -b --noEmit` — type-check only. Needs `-b`: the root `tsconfig.json` has `"files": []` plus references, so plain `tsc --noEmit` checks nothing

## Environment

- `VITE_API_URL` — backend base URL consumed by `src/services/api.ts` (defaults to `http://localhost:3000/api`)
- `VITE_MAPTILER_KEY` — MapTiler style key consumed by the world map (`src/pages/WorldMap/WorldMap.tsx`)

## Architecture

React 19 + TypeScript + Vite SPA, deployed to Vercel (SPA rewrite in `vercel.json`). The app visualizes combat-sports data per country: a world map landing page, per-country detail pages, and an admin form for ingesting new fight events. All user-facing copy is bilingual (es/en) via the i18n layer.

**Routing (`src/main.tsx`)** — `createBrowserRouter` with a single `App` shell (`<Outlet/>` wrapped in the Redux `Provider`, with `LanguageProvider` above the router). Index route renders `WorldMap`; `/admin/fights/new` renders `EventIngestionPage`; `/:countrySlug` renders `CountryRouter`.

**Country routing pattern (`src/pages/countries/`)** — Countries are not hard-coded in the router. `registry.ts` lists `{ slug, nameKey, mapLayerId, accentColor, loader }` entries with dynamic `import()` loaders, and `CountryRouter.tsx` looks up the slug, lazy-loads the matching page (cached in a module-level `Map`), and wraps it in `Suspense` + `ErrorBoundary`. **To add a new country: copy `src/pages/_CountryTemplate/` (see its `CONTRIBUTING.md`, or use the `add-country` skill), add a folder under `src/pages/<Country>`, and append a registry entry — do not touch the router.** `mapLayerId` must match a fill layer id in the MapTiler style so the world map can highlight and link to it.

**State (`src/store/`)** — Redux Toolkit with two slices:

- `country` — `thunks.ts` exposes `fetchCountry(slug)`, which checks `sessionStorage` (`country_<slug>` key, 30-minute TTL) before calling `getCountryData(slug)` and writing the result back to cache.
- `eventIngestion` — backs `/admin/fights/new`. `fetchFightersByCountry(slug)` reuses `getCountryData` to populate the fighter picker; `submitEvent(formData)` posts to `/events` via `event.service.ts`.

**Services (`src/services/`)** — `api.ts` is a shared Axios instance (10s timeout, `VITE_API_URL` base) with a response interceptor that retries failures (no response, or 5xx status) up to 3x with exponential backoff. All backend calls go through it.

**i18n (`src/i18n/`)** — `LanguageProvider` + `useTranslation()` provide a typed `t(key, params?)` over dictionaries in `locales/{en,es}.ts` keyed by `TranslationKey`. Language is detected from `localStorage` (`preferredLanguage`) then browser locale, defaulting to `es`. New user-facing strings need an entry in **both** locale files.

**Path alias** — `@/*` → `src/*` (configured in `vite.config.ts`, `vitest.config.ts`, and `tsconfig`).

**Styling** — MUI v7 (`@mui/material` + `@emotion`) plus SCSS under `src/styles/`. Per-country MUI themes are built by `createCountryTheme(config)` (`src/styles/theme/createCountryTheme.ts`) from each country's `CountryPageConfig`, and expose `common.black`.

**Map** — `maplibre-gl`, rendered via `react-map-gl/maplibre` (types from `@vis.gl/react-maplibre`) on `WorldMap`. The module self-accepts HMR and forces a full reload on edits to avoid leaking WebGL contexts (see comment in `WorldMap.tsx`).

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
