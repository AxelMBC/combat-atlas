## Context

- A country page gets its fights from `GET /countries/:slug` (`allFights` is the pool, `topEvents` the historic fights), through `loadCountryData` in `src/store/country/countryDataCache.ts`: `sessionStorage`, a 30-minute TTL and in-flight dedupe.
- `useMainVideoQueue` shuffles the whole pool on every visit and consumes picks from a session queue. "Another Fight" is disabled when `remainingCount <= 1`. Nothing is remembered between visits.
- The backend responses come from `.lean()`, so fights arrive with `_id` (string) and no `id`, while `MainEvent` declares `id: number`. `useMainVideoQueue.ts:99` serializes `e.id`, which is `undefined` for every fight, so its change check only sees the list length.
- The landing makes no country request until a row is hovered, focused or pressed (`prefetchCountryData`), apart from the app-wide `GET /health` warm-up.
- The backend change `add-country-summaries` adds `GET /api/countries` → `[{ slug, fightIds }]`, where `fightIds` uses the same filter as `allFights`.
- Prod today has 15 pool fights for Mexico, 20 for Thailand and 12 for the United States.

## Goals / Non-Goals

**Goals:** remember watched pool fights per browser; serve unwatched fights first; show on the landing and on the country page one count that always agrees; stay correct when fights are added, deleted or moved out of the pool.

**Non-Goals:** accounts or cross-device sync; live cross-tab updates while a page stays open; marking by watch time; tracking historic fights.

## Decisions

### 1. The summary carries fight ids, not counts

With only a total, "left" would be `total − watched.length`. That breaks as soon as a watched fight leaves the pool (deleted, or promoted to a top event with `PATCH /fights/:id`): the landing could show a country as "all watched" with a fight still left. With ids, `left = fightIds.filter(id => !watched.has(id)).length` corrects itself, and a new fight shows up as unwatched with no extra work. The alternative, counts plus per-country history cleaned on each country visit, costs about the same, but stays wrong until the next visit to that country. Payload is about 26 bytes per fight.

### 2. Fights are keyed by `_id`, not `idYt`

`idYt` has no unique index in the backend model, and re-uploading a video changes it, which would wipe the fight from every user's history. `_id` is stable and already travels in every response; `Fighter` already uses `_id`. `MainEvent.id: number` goes away so the compiler rejects reads of a field that never exists at runtime.

### 3. One flat set in `localStorage`

- `sessionStorage` dies with the tab and isn't shared, so the landing count would almost never go down between visits.
- One array of ids, not grouped by country: the country comes from crossing the ids with `fightIds` (landing) or `allFights` (country page).
- Key `watchedFights`, JSON array of strings. Anything else reads as empty.

### 4. A storage module with a `useSyncExternalStore` hook, not a Redux slice

`src/store/watchHistory/watchHistory.ts` owns all storage access:

- `readWatched()`;
- `markWatched(id)`, which reads the stored value, adds the id and writes it back, so a mark from another tab is never overwritten;
- `forgetFights(ids)` and `retainFights(validIds)`;
- `subscribe(listener)`, notified on its own writes and on the window `storage` event;
- `countUnwatched(poolIds, watched)`, the one counting function both pages use.

Every storage call sits in `try/catch`, so failures fall back to an empty history. `useWatchHistory()` exposes the set through `useSyncExternalStore`, caching the parsed snapshot until the next change.

A Redux slice would need hydration, a write-back subscriber and its own cross-tab listener for the same result, and nothing in Redux reads this state. It lives under `src/store/` because two features consume it, next to `countryDataCache.ts`, which is also a non-Redux storage module.

### 5. "Watched" means the hero reported `PLAYING` (user decision)

`CinematicHero` already handles `PLAYING` in `onStateChange`. It gains an `onPlaybackStart(video)` callback, kept in a ref like `onReady`. `CountryPage` records the fight only when its `_id` is in `mainEventFights`, which excludes historic fights. Recording on every `PLAYING` is harmless because the history is a set, so no "first time" flag is needed. Skipping a fight after it started counts as watched; skipping it before it started does not.

### 6. The queue serves unwatched fights first, and "Start over" is the only reset (user decision)

`useMainVideoQueue` receives the watched set and picks candidates in this order:

1. pool fights not in the history, not in the hero, not shown during this visit;
2. otherwise pool fights not in the history and not in the hero.

The first fight falls back to any pool fight when every fight is watched. The visit's shown-set keeps today's "no repeats" behavior for users who skip without playing (autoplay refused, reduced motion). Without it, those users could see the same fight again, because nothing gets recorded for them.

The counter is `countUnwatched(allFights ids, watched)`. It includes the hero's fight until that fight plays, so it equals the landing's number. Where it is shown is decision 10. "Start over" replaces the button label when step 2 is empty. It calls `forgetFights(pool ids)` and loads a random pool fight other than the one in the hero. `remainingByFighter` counts the same candidates, so a fighter card is exhausted exactly when none of that fighter's fights is left. The control is disabled only for a one-fight pool. The `error.noMoreVideos` path can no longer be reached from "Another Fight".

### 7. The summary reuses the country-data session cache

`countryDataCache.ts`:

- its `readCache`/`writeCache` take the storage key instead of building `country_<slug>`;
- it adds `loadCountrySummaries()` (key `country_summaries`, same 30-minute TTL), with its own in-flight promise.

`getCountrySummaries()` joins `getCountryData()` in `src/services/country.service.ts`, and `CountrySummary` (`{ slug: string; fightIds: string[] }`) joins `src/types/country.types.ts`. The landing starts the request on mount, not the app shell: a deep link to a country doesn't need it.

### 8. Pruning happens on the landing, on any summary with at least one country

When the summary arrives, the landing hook calls `retainFights(union of all fightIds)`. An empty list or a failed request skips it, so a broken response can't wipe the history. It prunes on cached summaries too. See Risks.

### 9. The count lives in the ribbon

The ribbon (`★ {discipline} ★`) gains ` · {count}`. The text sits on the same line, so no row grows, which keeps the 390×844 phone layout valid. It fades in with an opacity transition when it first appears, and appears at once with reduced motion.

The label rules:

- every pool fight unwatched: `landing.fightCount` / `landing.fightCountOne`;
- some watched: `landing.toWatch`;
- none left: `landing.allWatched`;
- no count for a slug missing from the summary or with no ids.

The i18n `t()` has no plural support, so the singular gets its own key. The accessible name appends the same text after a comma, in sentence case. Uppercase comes from the ribbon's CSS, not from the strings.

### 10. On the country page the count sits in the "Now playing" header, not in the button (user decision)

The first version put "24 to watch" as a white pill inside the red "Another Fight" button. On the page it read as clutter: one control carrying an action, a number and a status. The count moved out, for these reasons:

- A button label names one action in a verb and, when needed, a noun: one to four words. Progress and outcome go in a message or in the button's state, not in the label. The pill turned the button's name into "Another Fight 24 to watch".
- By proximity, things close together read as one group. The number describes the country's whole pool, not the fight on screen and not the action, so it joins the title that frames that pool: the right end of the "Now playing" row, aligned with the card's right edge, where the row had empty space.
- One accent focal point per view. The white pill inside the red button competed with the label for attention.
- A 2 px rail under the row fills with the watched share of the pool in the country's accent. Visible progress toward an end that feels reachable encourages finishing (goal-gradient effect). The text carries the meaning, and the rail is `aria-hidden` and only repeats it, so colour is never the only signal. It animates `transform: scaleX`, and only when reduced motion is not requested.
- At 0 the header reads "Todas vistas" / "All watched", like the landing ribbon, and the button reads "Volver a empezar". The header shows the status and the button shows the action.

`NowPlayingHeader` (in `FightInfoSection/`) draws the row and the rail; `FightInfoSection` receives `poolSize` for the rail. Uppercase comes from the eyebrow's CSS, as on the ribbon, so the strings stay in sentence case (`mainEvent.toWatch`, `mainEvent.allWatched`).

Sources: [Splunk button labels](https://help.splunk.com/splunk-style-guide/ui-text-guidelines/button-labels), [Siemens iX button labels](https://ix.siemens.io/docs/guidelines/language/menu-functions-and-ui-labels/button-labels.md), [NN/g UI copy](https://www.nngroup.com/articles/ui-copy/), [NN/g Gestalt proximity](https://www.nngroup.com/articles/gestalt-proximity/), [Laws of UX: goal-gradient effect](https://lawsofux.com/goal-gradient-effect/).

## Risks / Trade-offs

- **Counts lag up to 30 minutes behind new fights** because of the session cache. → Accepted; the country page itself has the same TTL.
- **A stale cached summary can drop a watched fight.** Pruning against a cached summary removes a fight added after that summary was cached, if the user watched it in the meantime, so that fight can be served once more. → Rare: it needs an admin import during a 30-minute window. Accepted rather than adding a "fresh response" flag.
- **The landing count is missing until the backend change is deployed** (`GET /api/countries` → 404). → Silent by design; the backend change should ship first.
- **The history grows by about 26 bytes per watched fight.** → Pruning keeps it to fights that still exist.
- **Users who never get autoplay record fights only when they press play.** → Intended: watched means it played.

## Open Questions

- none
