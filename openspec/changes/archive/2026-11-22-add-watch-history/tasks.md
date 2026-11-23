# Remember watched fights, serve unwatched ones first and show fight counts on the landing

## 1. Fight id

- [x] 1.1 In `src/types/fightEvent.types.ts`, replace `id: number` with `_id: string` on `MainEvent`
- [x] 1.2 In `src/hooks/useMainVideoQueue.ts`, build the change-check key from `_id` instead of `id`
- [x] 1.3 Update every fixture that builds a `MainEvent` with `id` (tests under `src/` and `src/pages/_CountryTemplate/data/`) to use string `_id` values; `npx tsc -b --noEmit` passes

## 2. Watch history store

- [x] 2.1 Create `src/store/watchHistory/watchHistory.ts`: `readWatched()` (key `watchedFights`, anything but a JSON array of strings reads as empty), `markWatched(id)` (read, add, write), `forgetFights(ids)`, `retainFights(validIds)`, `subscribe(listener)` (own writes plus the window `storage` event), and `countUnwatched(poolIds, watched)`; every storage access in `try/catch`
- [x] 2.2 Create `src/store/watchHistory/useWatchHistory.ts`: `useSyncExternalStore` over `subscribe`/`readWatched`, returning a `ReadonlySet<string>` that keeps its identity until the stored value changes
- [x] 2.3 Tests: corrupt and non-array values read as empty; storage that throws reads as empty and writes don't throw; `markWatched` twice stores the id once; `markWatched` keeps an id written to storage by someone else after the last read; `forgetFights` and `retainFights`; `countUnwatched`

## 3. Country page

- [x] 3.1 In `CinematicHero.tsx`, add an `onPlaybackStart(video)` prop held in a ref like `onReady`, called from `onStateChange` on every `PLAYING` with the current video; add it to `CinematicHero.types.ts`
- [x] 3.2 In `CountryPage.tsx`, pass `onPlaybackStart` that calls `markWatched(video._id)` only when that `_id` is in `mainEventFights`
- [x] 3.3 In `useMainVideoQueue.ts`, take the watched set and apply design decision 6: first pick from unwatched fights (any pool fight if none); "Another Fight" and fighter picks from unwatched fights not in the hero, preferring fights not shown during the visit; `remainingByFighter` over those same candidates; return `unwatchedCount` (`countUnwatched`), `isExhausted` (no unwatched fight other than the hero's) and `startOver()` (`forgetFights` of the pool, then a random pool fight other than the hero's)
- [x] 3.4 In `FightInfoSection`, add `NowPlayingHeader` (design decision 10): the "Now playing" row shows `mainEvent.toWatch` ("{count} por ver" / "{count} to watch"), or `mainEvent.allWatched` ("Todas vistas" / "All watched") at 0, at the right end of the title's line, with a 2 px rail under it filled by the watched share of `poolSize`; the "Another Fight" button carries only its label; when `isExhausted`, label it `mainEvent.startOver` ("Volver a empezar" / "Start over") and call `startOver`; disable it only when the pool has one fight; add the keys to `src/i18n/locales/es.ts` and `en.ts`
- [x] 3.5 Tests for `useMainVideoQueue`: first pick avoids watched fights; falls back to any fight when all are watched; no repeat within a visit while unshown unwatched fights remain; `isExhausted` and `startOver` clear only that pool's ids; `remainingByFighter` ignores watched fights. Test for `CountryPage` or `CinematicHero`: a `PLAYING` of a pool fight records it, a historic fight is not recorded. Tests for `CountryPage`: the button's name carries no count; with every fight watched the header reads "Todas vistas" and the button "Volver a empezar"

## 4. Country summaries

- [x] 4.1 Add `CountrySummary` (`{ slug: string; fightIds: string[] }`) to `src/types/country.types.ts` and `getCountrySummaries()` (`GET /countries`, unwraps `data`, throws on an unexpected shape) to `src/services/country.service.ts`
- [x] 4.2 In `src/store/country/countryDataCache.ts`, make `readCache`/`writeCache` take the storage key, and add `loadCountrySummaries()` with key `country_summaries`, the same TTL and its own in-flight promise; extend `countryDataCache.test.ts` for cache hit, expiry and in-flight dedupe of the summaries

## 5. Landing

- [x] 5.1 Create `src/pages/Landing/useCountryFightCounts.ts`: on mount call `loadCountrySummaries()`; on success, if at least one country is listed, call `retainFights` with the union of all `fightIds`; return per slug `{ total, unwatched }` computed with `countUnwatched` and `useWatchHistory`; on failure return no counts and log nothing to the UI
- [x] 5.2 In `Landing.tsx` pass the counts to `FightCardBilling` and on to `BillingRow` (types included)
- [x] 5.3 In `BillingRow.tsx`, append ` · {label}` inside the ribbon span (`landing.fightCount`, `landing.fightCountOne`, `landing.toWatch`, `landing.allWatched` per design decision 9), fade it in on first appearance unless `reduceMotion`, and append `, {label}` to the link's `aria-label`; add the keys to both locale files
- [x] 5.4 Extend `Landing.test.tsx`: no count before the summary resolves; "20 FIGHTS", "12 TO WATCH" and "ALL WATCHED" from a mocked summary and history; no count and no error when the summary rejects; the accessible name includes the count; a summary with one country prunes ids missing from it and an empty one prunes nothing

## 6. Docs

- [x] 6.1 Update `CLAUDE.md`: the watch history (`localStorage` `watchedFights`, `src/store/watchHistory/`, recorded on `PLAYING`, pruned on the landing), the `country_summaries` session-cache entry in the store section, and the landing's `GET /countries` request in the Landing paragraph

## 7. Verification

- [x] 7.1 Run `/axl:verify`
- [x] 7.2 With a backend that has `GET /api/countries` (deployed, or `yarn dev` on the `add-country-summaries` change) and an empty `watchedFights`: open `/` → after a moment the ribbons read "15 PELEAS", "20 PELEAS" and "12 PELEAS" (or the current prod counts); the rows don't change height
- [x] 7.3 Enter Thailand and let the first fight play until the title card lifts → the "Reproduciendo ahora" row goes from "20 POR VER" to "19 POR VER" and its rail grows; go back → Thailand's ribbon reads "19 POR VER"; reload the browser tab → still "19 POR VER"
- [x] 7.4 In DevTools, set `localStorage.watchedFights` to every Thailand id from `GET /api/countries` except one, then open `/thailand` → the hero plays the one unwatched fight, the header shows "1 POR VER" and the button already reads "Volver a empezar"; once it plays the header reads "TODAS VISTAS" with a full rail; activate the button → a different fight loads, the header reads "20 POR VER" then "19 POR VER", and the Mexico ids in `watchedFights` are still there
- [x] 7.5 Against a backend without `GET /api/countries` (current prod before the backend deploy): `/` shows no counts and no error, and country pages still record fights and show "POR VER" in the header
- [x] 7.6 DevTools device mode at 390×844 with counts shown → eyebrow, globe, all three rows and "Gira el mundo" visible without scrolling; a screen reader on the Mexico link announces "México — Boxeo, 15 peleas"
- [x] 7.7 On `/mexico` at desktop width and at 390×844 → "Reproduciendo ahora" and its count ("N POR VER") share one line with the rail under them, and the red button reads only "Otro Combate"
