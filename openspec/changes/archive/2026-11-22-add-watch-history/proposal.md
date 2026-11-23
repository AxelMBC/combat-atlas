## Why

Combat Atlas forgets what a visitor has watched: every visit reshuffles the whole pool, so "Another Fight" keeps serving fights already seen, and the landing doesn't say how many fights a country has. Remembering watched fights in the browser lets each country serve unseen fights first, and lets the landing show per country how many fights there are and how many are left.

## What Changes

- Fights are identified by `_id: string`, the value the backend sends. `MainEvent.id: number` is removed: the API never sent it, so the hero queue's change check in `useMainVideoQueue` compared `undefined`s. **BREAKING** for the type only.
- New watch history: the `_id` of each pool fight (`allFights`) the hero starts playing is kept in `localStorage` under `watchedFights`, a flat array of ids shared by tabs and kept across sessions.
- Country page: the first fight, "Another Fight" and fighter-card picks come from unwatched fights first. The "Now playing" header shows how many are left on its own line, with a thin progress rail under it; "Another Fight" keeps a plain label, and when nothing else is left it becomes "Start over", which clears that country's history.
- Landing: on mount it loads `GET /countries` (`[{ slug, fightIds }]`, from backend change `add-country-summaries`) through the same session cache as country data. Each row's ribbon shows "20 FIGHTS", then "12 TO WATCH", then "ALL WATCHED", and the link's accessible name includes it.
- When a summary arrives, ids that are in no country's pool are dropped from the history.

## Capabilities

### New Capabilities

- `watch-history`: what is recorded and when, where it is kept, how the country page serves unwatched fights, the count in the "Now playing" header, "Start over" on "Another Fight", and pruning.

### Modified Capabilities

- `landing-fight-card`: each row shows its country's fight count (new requirement), and the link's accessible name includes it (changes "Every registered country is a link on the landing").
- `country-page-data`: fights carry their database id `_id: string` (new requirement).

## Out of Scope

- Syncing history across devices or accounts. A tab sees other tabs' marks the next time it reads the history (landing or country page mount).
- Badges for new fights, un-marking a single fight, or a button that clears all history.
- Recording or counting top events (the "Historic Fights" section).
- Marking by watch time: a fight counts as watched when it starts playing.
- The hero stats line ("20 fights"), which keeps counting `allFights`.

## Impact

- Depends on the backend change `add-country-summaries` (`combat-atlas-backend`) being deployed for the landing count; until then `GET /countries` answers 404, the landing shows no count, and everything else works. The country-page part ships on its own.
- Types: `src/types/fightEvent.types.ts`, `src/types/country.types.ts`.
- New: `src/store/watchHistory/` (storage module and `useWatchHistory` hook).
- Changed: `src/hooks/useMainVideoQueue.ts`, `src/pages/countries/components/CinematicHero/CinematicHero.tsx`, `CountryPage.tsx`, `FightInfoSection/`, `src/services/country.service.ts`, `src/store/country/countryDataCache.ts`, `src/pages/Landing/` (`Landing.tsx`, `FightCardBilling/BillingRow.tsx`), `src/i18n/locales/{en,es}.ts`, test fixtures that build a `MainEvent` with `id`, `src/pages/_CountryTemplate/data/`, `CLAUDE.md`.
- One extra request on landing mount (`GET /api/countries`, about 26 bytes per fight), counted toward the backend's per-IP rate limit.
