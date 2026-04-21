# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `yarn dev` — Vite dev server
- `yarn build` — type-check (`tsc -b`) then `vite build`
- `yarn lint` — ESLint over the repo
- `yarn preview` — preview production build

No test runner is configured.

## Environment

- `VITE_API_URL` — backend base URL consumed by `src/services/api.ts` (defaults to `http://localhost:3000/api`).

## Architecture

React 19 + TypeScript + Vite SPA. UI is mostly in Spanish. The app visualizes combat-sports data per country, with a world map landing page and per-country detail pages.

**Routing (`src/main.tsx`)** — `createBrowserRouter` with a single `App` shell (`<Outlet/>` wrapped in the Redux `Provider`). Index route renders `WorldMap`; `/:countrySlug` renders `CountryRouter`.

**Country routing pattern (`src/pages/countries/`)** — Countries are not hard-coded in the router. `registry.ts` lists `{ slug, loader }` entries with dynamic `import()` loaders, and `CountryRouter.tsx` looks up the slug, lazy-loads the matching page (cached in a module-level `Map`), and wraps it in `Suspense` + `ErrorBoundary`. **To add a new country: add a folder under `src/pages/<Country>` and append a registry entry — do not touch the router.**

**State (`src/store/`)** — Redux Toolkit, single `country` slice. `thunks.ts` exposes `fetchCountry(slug)` which:

1. Checks `sessionStorage` (`country_<slug>` key) with a 30-minute TTL before hitting the network.
2. Calls `getCountryData(slug)` from `src/services/country.service.ts`.
3. Writes back to the cache on success.

**Services (`src/services/`)** — `api.ts` is a shared Axios instance (10s timeout, `VITE_API_URL` base). All backend calls should go through it; country data previously lived in local files but was removed in favor of the backend (see commit `d83f3e9`).

**Path alias** — `@/*` → `src/*` (configured in both `vite.config.ts` and `tsconfig`). Prefer `@/...` imports over relative paths across module boundaries.

**Styling** — MUI v7 (`@mui/material` + `@emotion`) plus SCSS under `src/styles/`. A custom theme exposes `common.black` (see commit `e372c49`).

**Map** — `maplibre-gl` via `react-map-gl` for the world map page.
