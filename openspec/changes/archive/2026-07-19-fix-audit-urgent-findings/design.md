# Design: fix-audit-urgent-findings

## Context

The audit found the country-data flow untyped end-to-end (`getCountryData` returns `data.data` as `any`), three country pages that are ~95% duplicated, and a handful of user-visible bugs concentrated in `CountryPage`/`FightCard`/config files. Screenshot evidence (Thailand page, EN) shows a "Thailand's Wars" heading rendered above an empty section. Project conventions that constrain this design: arrow functions only, types in colocated `*.types.ts` files, `@/*` alias across module boundaries, all network calls through `src/services/api.ts`, bilingual copy via the typed i18n layer, Vitest 2.x pinned with its own config.

## Goals / Non-Goals

**Goals:**

- Kill all four critical audit findings and the empty-section rendering in one reviewable change.
- Type the country-data boundary so a backend field rename breaks the build, not production.
- One shared data hook so adding a country never copies fetch/reset/error logic again.
- Keyboard access for the two card components without visual redesign.

**Non-Goals:**

- No `createCountryPage` factory (pages remain thin files; factory deferred).
- No `FighterCard` feature/compact split, no theming unification, no WorldMap tooltip rework.
- No backend/API contract changes — `CountryDataResponse` types what the API already returns.
- No visual redesign of cards, hero, or sections.

## Decisions

### D1 — `CountryDataResponse` declared in `src/types/country.types.ts`

`{ topFighters: Fighter[]; allFights: MainEvent[]; topEvents: MainEvent[] }`, annotated as the return type of `getCountryData`. The existing `SessionCache['data'] = Awaited<ReturnType<typeof getCountryData>>` indirection in `thunks.ts` then resolves to the real type with no further edits. Thunks declare `createAsyncThunk<CountryDataResponse, string, { rejectValue: TranslationKey }>` so `action.payload as string` casts disappear.
_Alternative considered:_ zod runtime validation at the boundary — rejected as new-dependency scope creep; compile-time typing captures the audit finding.

### D2 — `useCountryPageData(slug, resolvers)` hook, not a factory

New hook at `src/hooks/useCountryPageData.ts` (types in `useCountryPageData.types.ts`): dispatches `resetCountryData()` + `fetchCountry(slug)` on mount, selects country state, applies optional `resolveFighterImage` / `resolveTopFightThumbnail` mappers (memoized on inputs), returns `{ fightersList, mainEvents, topFightsList, loading, error, retry }`. Each country page becomes: call hook → `Spinner` / `ErrorFallback` / `CountryPage`. Thailand's thumbnail mapping — the one real divergence today — becomes a resolver argument instead of a fork.
_Alternative considered:_ `createCountryPage(config)` factory eliminating page files entirely — better end state but touches the registry loader contract, `_CountryTemplate`, `CONTRIBUTING.md`, and the `add-country` skill; deferred to its own change.

### D3 — Empty sections return `null` inside the section components

`TopFighters` and `TopFights` each early-return `null` when their list is empty (for `TopFights`, empty after the existing `idYt` filter — six null-`idYt` entries would otherwise still render a bare heading). Owning the guard inside the component means every current and future caller (including `_CountryTemplate`) gets the behavior for free, rather than sprinkling `data.length > 0 &&` at call sites in `CountryPage`.

### D4 — `countryNameKey` becomes required; `countryName` string is deleted

`CountryPageConfig.countryNameKey: TranslationKey` (required), `countryName`/`themeClassName`/`headerTitleKey`/`headerTitleFont` deleted. `CountryPage` drops the `countryNameKey ? t(...) : countryName` fallback — the compiler now forces every config (including the template, which keeps its documented `as TranslationKey` cast) to provide a localized name. This is what makes the "UnitedStates" bug structurally unrepeatable.

### D5 — Registry-derived admin options

`eventIngestion.config.ts` replaces the hand-written `COUNTRY_OPTIONS` array with a mapping over `countryRegistry` (`{ slug, labelKey: nameKey }`). `CountryOption` type stays, so `EventForm` doesn't change. Registry already imports nothing from EventIngestion, so no cycle.

### D6 — Errors as `TranslationKey`, translated at render

Thunks reject with `TranslationKey` values (new keys: `error.countryData`, `error.fightersLoad`, `error.eventSubmit`, `error.unexpectedResponse` in both locales); services throw plain `Error`s whose messages are no longer shown to users. `countrySlice.error` and `eventIngestion.submitError`/`fetchFightersError` store the key; components translate via `t(key)` at render — matching the `FieldError { key, params }` pattern already proven in the form validation. State type changes from `string | null` to `TranslationKey | null`.
_Trade-off accepted:_ backend-provided message detail ("bad input") no longer surfaces in the UI — consistent language beats raw server text for this product; the Axios interceptor keeps the detailed message on the rejected `Error` for console/debugging.

### D7 — Cards keyboard access via the CinematicHero pattern

`FighterCard` and `FightCard` root boxes get `role="button"`, `tabIndex={0}` (`-1`/no role when disabled), Enter/Space `onKeyDown` delegating to the same select handler, and a `:focus-visible` outline consistent with the chip style in `CinematicHero.tsx`. No `ButtonBase` — swapping the root component risks layout/ripple regressions across two complex cards for no functional gain.

### D8 — `updateField` generic via prepared payload

`updateField: { reducer(state, action: PayloadAction<FieldUpdate>) ..., prepare: <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => ({ payload: { field, value } }) }` — callers switch from object arg to `updateField('title', v)`; mismatched pairs stop compiling; the force-cast in the reducer goes away.

### D9 — Formatting enforced, not just fixed

`yarn format` once across the repo (isolated commit so the noise diff never mixes with logic), plus `"format:check": "prettier --check \"src/**/*.{ts,tsx,scss}\""` added to `package.json` and appended to the `check`/CI flow. Without the check, drift returns.

## Risks / Trade-offs

- [Formatting commit pollutes blame across ~30 files] → isolate as its own commit, first in the branch, message prefixed `style:`.
- [Hook consolidation subtly changes mount timing (reset+fetch now inside the hook)] → hook replicates the exact current effect body; verify by click-through of all three country pages plus cache-hit navigation (revisit within 30 min TTL).
- [Error-key migration misses a consumer that renders raw `state.error`] → grep for `error` selectors after migration; `TranslationKey | null` typing makes a missed `t()` a compile error wherever the key is passed to `t`, and `ErrorFallback` receives already-translated strings via props.
- [Keyboard handlers on divs conflict with `useScrollFocus` refs] → both attach to the same root Box; ref merging unnecessary since `useScrollFocus` already owns the ref and role/tabIndex are plain props.
- [Deleting `resolveFallback` changes visible output for fights that relied on the fake year] → intended: absent data now renders nothing (year badge omitted), matching the new empty-section principle.
- [Registry-derived options list countries whose backend data isn't ingestible] → acceptable: registry is the product's single source of truth; a country visible on the map should be ingestible.

## Migration Plan

Single branch, ordered commits: (1) `style:` format-only, (2) deletions (console.log, fallbacks, dead state/config/keys), (3) typed boundary + error keys, (4) hook consolidation, (5) sections/hero/a11y, (6) tooling check. Each commit leaves `yarn build` + `yarn test:run` green. Rollback = revert individual commits; no data or API migration involved.

## Open Questions

- None blocking. If the backend ever returns per-request error detail worth showing (e.g., validation messages on event submit), `localized-errors` can grow a `params` channel later — the `FieldError`-style shape already supports it.
