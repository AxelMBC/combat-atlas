# Combat Atlas Frontend — Improvements

Code review performed on 2026-04-14. Score: **6.5 / 10**.

---

## Critical (P0)

### 1. Fix `startTime` type mismatch

`src/types/fightEvent.types.ts` declares `startTime` as `string`, but `EventForm` validation compares it as a number (`form.startTime < VALIDATION_RULES.startTime.min`). Pick one and align both sides.

```ts
// fightEvent.types.ts
startTime: number; // if backend sends a number
```

Also remove the redundant `tags: string[] | []` — `string[]` already covers empty arrays.

### 2. Unify country data flow

Mexico fetches from the API via Redux thunks. Thailand uses hardcoded static data and bypasses Redux entirely. Every country page should follow the same pattern:

- Dispatch `fetchCountry(slug)` in a `useEffect`
- Read from `useAppSelector(selectCountryState)`
- Show `<Spinner>` / `<ErrorFallback>` based on loading/error state

This prevents divergent behavior and makes adding new countries predictable.

### 3. Move API key out of tracked `.env`

`VITE_MAPTILER_KEY` is committed to `.env`. Move it to `.env.local` (gitignored by Vite by default). The key is already in git history — consider rotating it.

### 4. Remove unused `redux-saga` dependency

`redux-saga` is in `package.json` but no sagas are wired up. It adds dead weight to the bundle.

```bash
yarn remove redux-saga
```

---

## High Priority (P1)

### 5. Add a test runner and baseline tests

No test files or test runner exist. Set up Vitest (native Vite integration) and add tests for:

- **Redux thunks:** `fetchCountry` cache hit/miss/expiry logic
- **Custom hooks:** `useMainVideoQueue` queue consumption, per-fighter counts, edge cases (empty queue)
- **Utilities:** `shuffleArray`, `pickRandomEvent`
- **Validation:** Extract from `EventForm` first (see item 7), then test independently

```bash
yarn add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 6. Integrate error tracking

`ErrorBoundary.componentDidCatch` only logs to `console.error`. In production, errors are invisible. Integrate Sentry or a similar service:

- Capture exceptions in `componentDidCatch`
- Capture unhandled promise rejections from thunks
- Add breadcrumbs for navigation and API calls

### 7. Extract validation logic from EventForm

`EventForm.tsx` contains a `validate()` function with all business rules inline. Extract it:

```
src/utils/validateEventForm.ts
```

This makes the validation testable, reusable, and keeps the component focused on rendering.

### 8. Harden the service layer

`country.service.ts` and `event.service.ts` are one-liners that assume `data.data` response shape with no error transformation.

- Add an axios response interceptor for consistent error formatting
- Add retry logic with exponential backoff for transient failures (network errors, 5xx)
- Validate response shape or at least guard against unexpected structures

### 9. Replace hardcoded colors with theme references

Components like `FighterCard` and `FightCard` use hardcoded hex values (`#000`, `#ca2626`, `#fff`) in `sx` props. These bypass the per-country theming system.

```tsx
// Before
sx={{ border: "4px solid #000", boxShadow: "10px 10px 0 #000" }}

// After
sx={{ border: "4px solid", borderColor: "common.black", boxShadow: (t) => `10px 10px 0 ${t.palette.common.black}` }}
```

Audit all `sx` props for hardcoded color values and replace with theme tokens.

---

## Medium Priority (P2)

### 10. Make WorldMap feature detection less brittle

The click handler filters features by hardcoded layer IDs (`"Water"`, `"Country labels"`). If the MapTiler style updates, this silently breaks.

- Use a data-driven approach: check for a specific property on the feature (e.g., `feature.properties.country_slug`)
- Validate the resolved slug against `countryRegistry` before navigating
- Show a "coming soon" state for countries not yet in the registry instead of navigating to a 404

### 11. Add `title` to YouTube iframes

`VideoPreview` renders an iframe without a `title` attribute. This is a WCAG 4.1.2 violation.

```tsx
<iframe
  title="Vista previa del video"
  src={`https://www.youtube.com/embed/${debouncedId}?start=${startTime}`}
/>
```

### 12. Make utility functions generic

`shuffleArray` and `pickRandomEvent` are typed to `MainEvent[]`. Make them generic so they're reusable:

```ts
const shuffleArray = <T>(array: T[]): T[] => { ... };
const pickRandomEvent = <T>(list: T[]): { item: T; index: number } => { ... };
```

### 13. Replace magic DOM ID with a ref

`scrollToMainEvent` uses `document.getElementById("target-scroll")`. Pass a ref from the component instead of coupling to a magic string.

### 14. Clean up `useMainVideoQueue`

- `initializedRef` is set but never read — remove it.
- `prevEventsRef` is sufficient for tracking initialization state.

### 15. Add a `.prettierrc` config

The `format` script exists in `package.json` but there's no `.prettierrc` file. Without it, formatting depends on each developer's editor defaults.

---

## Low Priority (P3)

### 16. Add pre-commit hooks

Set up Husky + lint-staged to run linting and formatting before each commit. Prevents style drift.

### 17. Add Web Vitals monitoring

Track LCP, FID, CLS in production to catch performance regressions early. Vite projects can use the `web-vitals` library with minimal setup.

### 18. Consider Storybook for component documentation

Components like `FighterCard`, `FightCard`, `Spinner`, and `FeedbackModal` are good candidates for isolated development and visual testing.

### 19. Add environment-specific configs

Create `.env.development` and `.env.production` with appropriate API URLs and feature flags instead of relying on a single `.env`.

---

## Score Breakdown

| Category | Score | Key issue |
|---|---|---|
| Project structure | 8/10 | Registry pattern and folder conventions are strong |
| TypeScript usage | 7/10 | Strict mode enabled, but `startTime` type mismatch exists |
| Hooks & state management | 7.5/10 | `useMainVideoQueue` is well-built, Redux is clean |
| Styling | 6/10 | Good theming concept undermined by hardcoded colors |
| Error handling | 4/10 | ErrorBoundary exists but no production observability |
| Testing | 1/10 | No tests |
| Performance | 7.5/10 | Code splitting, memo, debouncing, caching all present |
| Accessibility | 6.5/10 | Good in Spinner/NotFound, missing iframe title |
| Security | 5/10 | API key in git |
| Consistency | 5.5/10 | Mexico vs Thailand data approach split |
| **Overall** | **6.5/10** | |
