# How to Add a New Country

## Quick Start

1. Copy this `_CountryTemplate/` folder and rename it to your country name (e.g., `Japan/`)
2. Rename `CountryTemplate.tsx` to match your country (e.g., `Japan.tsx`)
3. Update `index.tsx` to export from your renamed file
4. Fill in the config, add locale keys, and register the country in the registry

## Folder Structure

```
pages/YourCountry/
├── YourCountry.tsx          # Page component (useCountryPageData + CountryPage)
├── index.tsx                # Re-export
├── config/
│   ├── country.config.ts    # CountryPageConfig (translation keys, colors)
│   └── countryTheme.ts      # MUI theme derived from config
├── data/                    # Sample data shapes for reference only —
│   └── ...                  # real data comes from the API via useCountryPageData
└── resources/
    └── fighters/            # Fighter images (.webp, .jpg, .avif) + resolver
```

## Step by Step

### 1. Config (`config/country.config.ts`)

Fill in `CountryPageConfig`:

- `countryNameKey` — Translation key for the country name; add it to **both** `src/i18n/locales/{es,en}.ts`
- `topFightersTitleKey`, `topEventsTitleKey` — Translation keys for the section headings (both locales)
- `colorPalette` — Primary, secondary, text, and accent colors
- `maxWidth` — Page max width (default: `"1120px"`)

Once the locale entries exist, remove the `as TranslationKey` casts the template ships with.

### 2. Fighter Images (`resources/fighters/`)

Drop your fighter images here (prefer `.webp`), map them in a `getFighterImage` resolver
(see `src/pages/Mexico/resources/fighters/index.ts` for the pattern), and pass it to the hook:

```tsx
const { fightersList, mainEvents, topFightsList, loading, error, retry } = useCountryPageData(
  'your-country',
  { resolveFighterImage: getFighterImage },
);
```

If your top fights use locally bundled thumbnails, add a `resolveTopFightThumbnail` resolver too
(see `src/pages/Thailand/resources/fights/index.ts`).

### 3. Data

Country data (`topFighters`, `allFights`, `topEvents`) is fetched from the backend by
`useCountryPageData('your-country')` — the slug must match what the API serves at
`/countries/<slug>`. The `data/` files in this template only document the expected shapes
(`CountryDataResponse` in `src/types/country.types.ts` is the contract).

### 4. Register the Country

Do **not** touch the router. Append an entry to `src/pages/countries/registry.ts`:

```ts
{
  slug: 'your-country',
  nameKey: 'country.yourCountry.name',
  mapLayerId: 'Your Country',   // must match a fill layer id in the MapTiler style
  accentColor: '#123456',
  loader: () => import('@/pages/YourCountry'),
},
```

The world map, the map fallback list, and the admin event form all derive from this registry —
one entry lights up all three.
