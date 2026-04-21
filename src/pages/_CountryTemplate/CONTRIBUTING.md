# How to Add a New Country

## Quick Start

1. Copy this `_CountryTemplate/` folder and rename it to your country name (e.g., `Japan/`)
2. Rename `CountryTemplate.tsx` to match your country (e.g., `Japan.tsx`)
3. Update `index.tsx` to export from your renamed file
4. Fill in the data files and config

## Folder Structure

```
pages/YourCountry/
├── YourCountry.tsx          # Page component (renders CountryPage)
├── index.tsx                # Re-export
├── config/
│   ├── country.config.ts    # CountryPageConfig (labels, colors, fonts)
│   └── countryTheme.ts      # MUI theme derived from config
├── data/
│   ├── topFightersList.ts   # fighter[] — Top 5 fighters
│   ├── topEventsList.ts     # mainEvent[] — Featured events (with thumbnails)
│   └── allEventsList.ts     # mainEvent[] — All fight events (linked to fighters via fighterId)
└── resources/
    └── fighters/            # Fighter images (.webp, .jpg, .avif)
```

## Step by Step

### 1. Config (`config/country.config.ts`)

Fill in `CountryPageConfig`:

- `countryName` — Display name
- `themeClassName` — SCSS class (lowercase-hyphenated)
- `headerTitle`, `topFightersTitle`, `topEventsTitle` — Section headings
- `colorPalette` — Primary, secondary, text, and accent colors
- `maxWidth` — Page max width (default: `"1120px"`)
- Fonts — `titleFont`, `bodyFont`, `buttonFont`

### 2. Fighter Images (`resources/fighters/`)

Drop your fighter images here. Prefer `.webp` for size. Import them in `data/topFightersList.ts`.

### 3. Data Files

- **`topFightersList.ts`** — Array of `fighter` objects. Each needs `id`, `name`, `record`, `nickName`, `image` (imported asset), `fightsCounter`.
- **`allEventsList.ts`** — Array of `mainEvent` objects. These are the main fight videos linked to fighters via `fighterId`.
- **`topEventsList.ts`** — Array of `mainEvent` objects. Featured/highlight events with `thumbnail` URLs.

### 4. Register the Route

In `src/main.tsx`, add your country:

```tsx
import YourCountry from "./pages/YourCountry";

// Inside the children array:
{ path: "YourCountry", element: <YourCountry /> },
```

## Types Reference

```ts
interface fighter {
  id: string;
  name: string;
  record: string; // e.g. "50-3-1"
  nickName: string;
  image: string; // Imported image asset
  fightsCounter: number;
}

interface mainEvent {
  id: number;
  idYt: string; // YouTube video ID
  title: string;
  description: string;
  tags: string[];
  startTime: string; // Seconds into the video
  fighterId?: string; // Links to a fighter's id
  fighterBlue?: string;
  fighterRed?: string;
  thumbnail?: string; // YouTube thumbnail URL
}
```
