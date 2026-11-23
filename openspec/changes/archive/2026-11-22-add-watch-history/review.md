# Review: add-watch-history

Snapshot: 7aa59127f09b7c62c648e66035be9bb5f01c88d0

1. [minor] src/hooks/useMainVideoQueue.ts:129 (used at src/pages/countries/components/FightInfoSection/FightInfoSection.tsx:236, :263) — with a one-fight pool `isExhausted` is true from the first render, so the disabled control reads "Volver a empezar · 1 por ver" instead of "Otro Combate" as it did before · open (re-check: the count left the button, the label is still "Volver a empezar" with the rotate icon, FightInfoSection.tsx:228, :255, :256; no one-fight-pool test)
   Fix: in FightInfoSection use `const showsStartOver = isExhausted && !anotherFightDisabled` for the onClick, label and icon, or return `isExhausted: initialEvents.length > 1 && candidates.length === 0` from the hook; add a one-fight-pool test.
2. [rule] src/pages/countries/components/CountryPage/CountryPage.tsx:58-60 — `recordPoolFight` decides pool membership and writes storage (`markWatched`) inside the page component, while `useMainVideoQueue` already owns `poolIds` and the other history write (`forgetFights`) · open
   Fix: have `useMainVideoQueue` return `recordPlayback(video)` (checks a `Set` of `poolIds`, calls `markWatched`), pass it as `onPlaybackStart`, drop the `markWatched` import from CountryPage.
3. [rule] src/store/country/countryDataCache.ts:19 (used by `loadCountrySummaries` at :68) — summaries read back from `sessionStorage` skip the shape check network summaries get; a malformed `country_summaries` entry would throw in `useCountryFightCounts.ts:36` during render · open
   Fix: give `readCache` a guard parameter and pass an exported `isCountrySummaryList` guard from `country.service.ts`.
4. [duplicate] src/store/country/countryDataCache.ts:67-84 — `loadCountrySummaries` repeats `loadCountryData`'s read-cache / reuse-in-flight / fetch / write / clear flow with a second in-flight variable · open
   Fix: one private `loadCached<T>(key, fetcher)` with `inFlightRequests` keyed by cache key; both exports become one-liners.

## Decisions

- Pruning trusts any summary that lists at least one country (design decision 8). If the backend ever leaves a whole country out of `GET /countries` (an aggregation bug, say), that country's entire history is erased on the next landing visit. Safer rule: prune only when the summary covers every slug in `countryRegistry`.
- The landing count reads `country_summaries` and the country page reads `country_<slug>`, each with its own 30-minute timestamp, so "Counter matches the landing" can disagree for up to 30 minutes, and pruning against an older summary can drop a fight watched from newer country data. The design's Risks section names only "an admin import during the window"; ordinary cache timing causes the same thing.
- `subscribe` listens to the window `storage` event, so an open country page updates live when another tab records a fight. The design lists live cross-tab updates as a non-goal; harmless, but the docs say less than the code does.
