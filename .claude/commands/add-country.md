---
description: Scaffold a new country page, pick a fitting palette + fonts via web research, and register the route
argument-hint: <CountryName> <MartialArt>
---

Add a new country route.

- Country: **$1**
- Martial art / combat sport: **$2**

If either argument is missing or blank, stop and ask the user for the missing piece — do not guess. Both are required.

## Inputs & naming

From `$1` derive three forms and use them consistently:
  - **Slug** — lowercase, spaces → hyphens (e.g. `south-korea`). Used for URL, registry key, `themeClassName`, `sessionStorage` key.
  - **Pascal** — PascalCase, no spaces (e.g. `SouthKorea`). Used for folder name, component name, file names (`<Pascal>.tsx`).
  - **Camel** — camelCase, no spaces (e.g. `southKorea`). Used for config/theme variable names (`<camel>Config`, `<camel>Theme`) and file names (`<camel>.config.ts`, `<camel>Theme.ts`).

If the slug already exists in `src/pages/countries/registry.ts`, stop and tell the user — do not overwrite.

## Step 1 — Research palette + fonts

Use `WebSearch` (and `WebFetch` if needed) to find things **specifically tied to $2 as practiced in $1**, not just the country in general. Pick:

1. **Color palette (3–4 colors)** — draw from the visual identity of the sport in that country: fighter attire, ring/arena aesthetics, regional tradition, iconic promotions. Examples of the right mindset: Japan + Karate → sumi black, bone-white gi, red hinomaru; Thailand + Muay Thai → gold mongkhon, deep blue, temple red; Brazil + Jiu-Jitsu → academy blue/black/white belt gradient with a warm accent; USA + Boxing → vintage ring-canvas cream, bold red, navy. Avoid just copying the flag.
2. **Two fonts** that pair well and match that sport's aesthetic in that country:
   - a **display/title font** — bold, condensed, or high-impact (Anton, Oswald, Bebas Neue, Archivo Black, Bungee, Staatliches, or a culturally specific display face)
   - a **body font** — readable serif or humanist sans (Merriweather, Noto Serif, Lora, Source Serif, IBM Plex)
   - Both MUST be available on Google Fonts so the CDN import works.

Briefly tell the user what you picked and why (2–3 sentences) before scaffolding.

## Step 2 — Generate the Spanish copy

The UI is Spanish — all on-page text must be in Spanish. Generate three titles that fit **$1 + $2** specifically, not generic combat-sports copy. Use the existing countries as tonal reference but don't reuse their exact wording:

- Mexico + Boxeo → `"Boxeo al Estilo Mexicano"`, `"Ídolos de México"`, `"Peleas Históricas"`
- Thailand + Muay Thai → `"Armas Thailandesas"`, `"Leyendas Historicas"`, `"Las guerras de Thailandia"`

For the new country, produce:
- `headerTitle` — punchy tagline linking $2 to $1 (e.g. for Japan + Karate: `"Karate de Espíritu Japonés"`; for Brazil + Jiu-Jitsu: `"El Arte Suave de Brasil"`).
- `topFightersTitle` — refers to the fighters/legends of that sport in that country.
- `topEventsTitle` — refers to famous fights/tournaments of that sport in that country.

Keep them short (≤5 words each) and editorial in tone. Show the user the three strings before writing the file.

## Step 3 — Create the files

Create the folder `src/pages/<Pascal>/` with exactly these files. Follow the Mexico pattern — that's the current standard (backend-driven via `fetchCountry`). Do not copy the Thailand pattern (it uses local data files which are legacy).

### `src/pages/<Pascal>/index.tsx`

```tsx
export { default } from "./<Pascal>";
```

### `src/pages/<Pascal>/config/<camel>.config.ts`

```ts
import type { CountryPageConfig } from "@/components/CountryPage/CountryPage.types";

export const <camel>Config: CountryPageConfig = {
  countryName: "<Pascal>",            // display name — use the user's original casing of $1
  themeClassName: "<slug>-theme",
  headerTitle: "<Spanish headline from Step 2>",
  topFightersTitle: "<Spanish, from Step 2>",
  topEventsTitle: "<Spanish, from Step 2>",
  colorPalette: {
    primary: "<#hex>",
    primaryDark: "<#hex — darker shade of primary>",
    secondary: "<#hex>",
    white: "#f2f2f2",
    textPrimary: "<#hex — near-black tuned to palette>",
    textSecondary: "#f2f2f2",
    error: "#d40000",
    info: "#818589",
    black: "#000",
  },
  maxWidth: "1120px",
  titleFont: '"<Display Font>", sans-serif',
  bodyFont: '"<Body Font>", serif',
  buttonFont: '"<Display Font>", sans-serif',
};
```

### `src/pages/<Pascal>/config/<camel>Theme.ts`

Mirror `mexicoTheme.ts` exactly, swapping the import and variable names:

```ts
import { createTheme } from "@mui/material/styles";
import { <camel>Config } from "./<camel>.config";

export const theme = createTheme({
  typography: {
    fontFamily: <camel>Config.bodyFont,
    h1: { fontFamily: <camel>Config.titleFont },
    h2: { fontFamily: <camel>Config.titleFont },
    h3: { fontFamily: <camel>Config.titleFont },
    body1: { fontFamily: <camel>Config.bodyFont },
    button: { fontFamily: <camel>Config.buttonFont },
  },
  palette: {
    primary: {
      main: <camel>Config.colorPalette.primary,
      dark: <camel>Config.colorPalette.primaryDark,
    },
    text: {
      primary: <camel>Config.colorPalette.textPrimary,
      secondary: <camel>Config.colorPalette.textSecondary,
    },
    background: { default: <camel>Config.colorPalette.white },
    info: { main: <camel>Config.colorPalette.info },
    common: { black: <camel>Config.colorPalette.black },
  },
});
```

### `src/pages/<Pascal>/<Pascal>.tsx`

Mirror `Mexico.tsx` — backend-driven, no local fighter-image resolver (new countries rely on whatever the API returns). Use the slug (lowercase) in the `fetchCountry` calls:

```tsx
import type { Fighter } from "@/types/fighter.types";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCountry } from "@/store/country/thunks";
import { resetCountryData, selectCountryState } from "@/store/country/countrySlice";

import "@/styles/fonts/default.scss";

import { theme } from "./config/<camel>Theme";
import { <camel>Config } from "./config/<camel>.config";

import CountryPage from "@/components/CountryPage";
import ErrorFallback from "@/components/ErrorFallback";
import Spinner from "@/components/Spinner";

const <Pascal> = () => {
  const dispatch = useAppDispatch();
  const { fighters, mainEvents, topEvents, loading, error } =
    useAppSelector(selectCountryState);

  const fightersList = fighters.map((fighter: Fighter) => ({
    ...fighter,
    image: fighter.image ?? "/placeholder.webp",
  }));

  useEffect(() => {
    dispatch(resetCountryData());
    dispatch(fetchCountry("<slug>"));
  }, [dispatch]);

  if (loading) return <Spinner label="CARGANDO" />;

  if (error)
    return (
      <ErrorFallback
        theme={theme}
        onRetry={() => dispatch(fetchCountry("<slug>"))}
      />
    );

  return (
    <CountryPage
      theme={theme}
      config={<camel>Config}
      mainEventFights={mainEvents}
      topFightersData={fightersList}
      topEventsList={topEvents}
    />
  );
};

export default <Pascal>;
```

Before writing these, verify the imports actually exist by reading:
- `src/components/CountryPage/CountryPage.types.ts` — confirm `CountryPageConfig` shape still matches the fields above; if it's changed, adapt.
- `src/store/country/countrySlice.ts` — confirm `resetCountryData` and `selectCountryState` are still exported.

If anything has drifted from this template, follow the current shape rather than blindly emitting the snippet.

## Step 4 — Register the route

Edit `src/pages/countries/registry.ts` and append a new entry to `countryRegistry`, preserving the existing formatting:

```ts
{ slug: "<slug>", loader: () => import("@/pages/<Pascal>") },
```

Do **not** modify `CountryRouter.tsx` or the main router — the registry is the only touchpoint (CLAUDE.md confirms this).

## Step 5 — Load the Google Fonts

The project only ships `Anton` locally (`src/styles/fonts/default.scss`) — any new font must be pulled from the Google Fonts CDN. Add a `<link rel="stylesheet" ...>` tag for the two chosen fonts to `index.html` inside `<head>`, using `display=swap`. Skip any font that's already linked.

## Step 6 — Verify

Run `yarn tsc -b --noEmit` (and `yarn lint` if it's fast) to confirm the new files type-check and the registry import resolves. Report any failures and fix them before declaring done.

## Final report

Tell the user:
- the slug they can visit (`/<slug>`) and which martial art it represents,
- the palette + fonts chosen with one-line rationale,
- the three Spanish titles generated,
- the files created and the registry line added,
- typecheck result.
