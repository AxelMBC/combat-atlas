# Warm the backend on load, explain slow cold starts, and allow 90 s requests

## 1. Request time budget

- [x] 1.1 In `src/services/api.ts`, set `timeout` to a named `REQUEST_TIMEOUT_MS = 90_000`
- [x] 1.2 Exclude timeout errors (`error.code` `ECONNABORTED` or `ETIMEDOUT`) from the retry predicate; keep no-response and 5xx retries
- [x] 1.3 In `src/services/api.test.ts`, add: a timeout error rejects without calling `request`; a no-response non-timeout error still retries; extend the axios mock's error shape with `code`

## 2. Warm-up ping

- [x] 2.1 Add `src/services/health.service.ts` exporting `pingHealth` (arrow function, `api.get('/health', { skipRetry: true })`, no user-facing copy)
- [x] 2.2 In `src/App.tsx`, call `pingHealth()` once in a mount `useEffect`, swallowing the rejection

## 3. Slow-load hint

- [x] 3.1 Add `spinner.coldStart` to `src/i18n/locales/en.ts` and `es.ts` (hobby project, server waking up, first load can take up to a minute, then fast)
- [x] 3.2 Add `slowHint?: boolean` to `SpinnerProps` in `Spinner.types.ts`
- [x] 3.3 In `Spinner.tsx`, start a `SLOW_HINT_DELAY_MS = 4000` timer on mount when `slowHint` is set (cleared on unmount); once elapsed, render `t('spinner.coldStart')` in place of the taglines, as visible content of the status region (not `aria-hidden`)
- [x] 3.4 Style the hint in `Spinner.scss` so a multi-line message wraps and stays centered at phone width
- [x] 3.5 Pass `slowHint` to the loading `<Spinner />` in `Mexico.tsx`, `Thailand.tsx`, `UnitedStates.tsx`, and `_CountryTemplate/CountryTemplate.tsx`
- [x] 3.6 Add `src/components/Spinner/Spinner.test.tsx` (fake timers): no hint before 4 s; hint after 4 s with `slowHint`; never with `slowHint` unset; hint text follows the active language

## 4. Verification

- [x] 4.1 Run `/axl:verify`
- [ ] 4.2 With DevTools network throttled or the backend stopped, open `/mexico`: after ~4 s the spinner shows the cold-start message in the active language; toggling the language switches it
- [x] 4.3 Open `/` with the Network tab open: one `GET /health` is sent before clicking any country (two in dev StrictMode)
- [x] 4.4 With the backend stopped, open a country: the localized error with retry appears after ~90 s, with no further attempts in the Network tab after the timeout
