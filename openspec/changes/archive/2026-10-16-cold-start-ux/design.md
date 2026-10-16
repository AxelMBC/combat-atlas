## Context

`src/services/api.ts` sets `timeout: 10000` and its interceptor retries any error with no response (timeouts included) or a 5xx, up to 3 times with 300/600/1200 ms backoff — a ~42 s budget. Azure App Service cold starts for this backend (Node boot + `await connectDB()` before `listen`) routinely exceed that. The world map makes no backend calls, so the first request today is the country fetch in `useCountryPageData`. `Spinner` is used for country data loading, the `CountryRouter` Suspense fallback, and video buffering in `CountryPage`.

## Goals / Non-Goals

**Goals:** start the backend booting as early as possible; tell users why it's slow only when it is; never show the error screen while the backend is still starting.

**Non-Goals:** blocking UI, backend changes, per-endpoint timeout tuning.

## Decisions

### 1. Contextual hint instead of a first-visit modal

The hint appears only after 4 s of real waiting, at the place the user is waiting. A modal would block every first visit (including warm-server visits), appear on the map where nothing is loading yet, and still end at the error screen if the boot outlasted the client's timeout.

### 2. Hint timing lives in `Spinner`, opt-in via `slowHint`

The spinner mounts exactly when loading starts and unmounts when it ends, so a `setTimeout` started on mount (cleared on unmount) measures the wait without touching the store or `useCountryPageData`. It is opt-in because the Suspense and video spinners are not waiting on the backend. The 4 s delay is a named constant (`SLOW_HINT_DELAY_MS`). The hint is static text (not typed out) so it is readable at once. It is rendered as content of the `role="status"` live region (not `aria-hidden`), so screen readers announce it when it appears; the region's accessible name stays the loading label.

### 3. 90 s timeout, timeouts not retried

90 s per attempt covers a typical cold start in one request. With the existing retry predicate, a timeout would be retried 3 more times (~6 min before the error screen), which is worse than failing. Timeouts are detected by Axios error code (`ECONNABORTED`, or `ETIMEDOUT` when `clarifyTimeoutError` is on) and excluded from retry; other no-response errors and 5xx keep the current behaviour. Azure's front end cuts requests at 230 s, so 90 s stays well inside it.

### 4. Warm-up ping in the app shell

`App` mounts on every route (map and deep links), so a `useEffect` there sends `GET /health` via a new `health.service.ts`, with the rejection swallowed. It uses the shared `api` instance like every other backend call, with a typed `skipRetry` request flag (axios module augmentation in `api.types.ts`) that the interceptor honours, so a booting backend that answers 5xx still gets exactly one ping.

### 5. Stale country responses are dropped

With 90 s requests, leaving a cold country page for another leaves both fetches in flight. The `country` slice records the `requestId` of the latest `fetchCountry.pending` and ignores `fulfilled`/`rejected` actions from any other request, so a late response can't overwrite the current page. This also covers the error screen's `retry`, which dispatches outside the effect.

## Risks / Trade-offs

- Visitors who leave without opening a country still wake the backend → acceptable; on a CPU-quota tier (F1) this spends a little more quota.
- React StrictMode double-invokes effects in dev, sending two pings → dev-only and harmless; no guard added.
- A slow but healthy non-cold request now waits up to 90 s instead of ~42 s before erroring → acceptable for this app; the hint explains the wait on country pages.
- The 5xx retries still use the shared 90 s timeout per attempt → unchanged worst case for a backend that returns 5xx quickly.

## Open Questions

- none
