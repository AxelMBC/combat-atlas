## Why

The backend runs on Azure App Service and starts cold after idling: `server.js` awaits the Mongo connection before listening, so the first request can take well over a minute. Today the client gives up after ~42 s (10 s timeout × 4 attempts) and shows the generic error screen, and before that it shows an unexplained spinner — users conclude the site is broken.

## What Changes

- On app mount, fire one fire-and-forget `GET /health` so the backend starts booting while the user is still on the world map.
- `Spinner` gains an opt-in `slowHint` prop: once the spinner has been visible for 4 s, it shows a bilingual "waking up the server — hobby project, first load can take up to a minute, then it's fast" message. Only the country-data loading spinners opt in (the four country pages including `_CountryTemplate`); the Suspense fallback and video-buffering spinners do not.
- The shared Axios instance's timeout rises from 10 s to 90 s.
- Requests that fail by timing out are no longer retried (network errors with no response and 5xx keep retrying), so a dead backend surfaces the error after ~90 s instead of ~6 min.

## Capabilities

### New Capabilities

- `backend-cold-start`: how the client hides and explains backend cold starts — warm-up ping, slow-load hint, and the request time budget.

### Modified Capabilities

- none (the `country-page-data` requirements stay true; pages still show the spinner while loading)

## Out of Scope

- A blocking modal or dismissible notice on first visit.
- Backend changes (Always On, faster startup, listening before the DB connects).
- Warm-up for `/admin/fights/new` beyond the same app-level ping.
- Changing the session cache TTL.

## Impact

- `src/services/api.ts` (timeout, retry predicate, `skipRetry` opt-out), new `src/services/api.types.ts`, and `src/services/api.test.ts`
- `src/store/country/countrySlice.ts` (+ `.types.ts`, `.test.ts`): ignore results from superseded requests
- New `src/services/health.service.ts`; `src/App.tsx` calls it on mount
- `src/components/Spinner/` (`Spinner.tsx`, `Spinner.types.ts`, new `Spinner.test.tsx`)
- `src/pages/{Mexico,Thailand,UnitedStates,_CountryTemplate}/*.tsx` pass `slowHint`
- `src/i18n/locales/{en,es}.ts`: one new key
- One extra lightweight request per visit to the backend's existing `GET /health` (`combat-atlas-backend/src/routes/index.js`)
