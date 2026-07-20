# Tasks: fix-audit-urgent-findings

## 1. Formatting baseline (isolated commit)

- [x] 1.1 Run `yarn format`; commit the format-only diff as its own `style:` commit
- [x] 1.2 Add `"format:check": "prettier --check \"src/**/*.{ts,tsx,scss}\""` to `package.json` and wire it into the check flow

## 2. Deletions & dead code

- [x] 2.1 Delete `console.log('data: ', data)` from `src/store/country/thunks.ts`
- [x] 2.2 Delete `src/pages/countries/components/TopFights/FightCard/FightCard.fallbacks.ts`; in `FightCard.tsx` remove `resolveFallback` usage so `year = video.year` only, and delete the empty `<Typography>` block
- [x] 2.3 Remove `selectedFighter` state and `setSelectedFighter` action from `countrySlice` (types + slice) and drop their test cases in `countrySlice.test.ts`
- [x] 2.4 Remove `countryName`, `themeClassName`, `headerTitleKey`, `headerTitleFont` from `CountryPageConfig` and from all five country configs (Mexico, Thailand, UnitedStates, `_CountryTemplate`, plus template CONTRIBUTING.md mention)
- [x] 2.5 Remove unused `'fightCard.round'` key from both locale files (also swept the now-dead `country.*.headerTitle` keys)

## 3. Typed country-data boundary

- [x] 3.1 Create `src/types/country.types.ts` with `CountryDataResponse`; annotate `getCountryData` return type in `country.service.ts`
- [x] 3.2 Type `fetchCountry` and `fetchFightersByCountry` with `rejectValue: TranslationKey`; remove `as string` casts in `countrySlice` and `eventIngestionSlice` extraReducers
- [x] 3.3 Make `updateField` type-safe (deviation: correlated `EventFormFieldUpdate` union payload instead of a generic `prepare` — RTK flattens generic prepare signatures via `Parameters<>`, which loses field/value correlation; union payload enforces it, verified with a `@ts-expect-error` probe)
- [x] 3.4 Fix `selectSubmitStatus`: replaced with `selectSubmitting`/`selectSubmitSuccess`/`selectSubmitError` and updated `EventForm.tsx`
- [x] 3.5 Update `thunks.test.ts` and `countrySlice.test.ts` for typed payloads/rejections; `yarn test:run` green (41/41)

## 4. Localized errors

- [x] 4.1 Add error keys to both locales: `error.countryData`, `error.fightersLoad`, `error.eventSubmit` (deviation: `error.unexpectedResponse` skipped — thunks map every failure to one key each, so it would be a dead key on arrival)
- [x] 4.2 Thunks reject with `TranslationKey`; slices store `TranslationKey | null`; services throw plain `Error`s with no user-facing copy
- [x] 4.3 Translate at render: country pages pass `t(error)` into `ErrorFallback`; `EventForm` passes `t(submitError)` into `FeedbackModal`; language-toggle retranslation follows from storing keys (visual check in 8.2)

## 5. Shared country page data hook

- [x] 5.1 Create `src/hooks/useCountryPageData.ts` + `useCountryPageData.types.ts` (arrow function; reset+fetch on mount, memoized image/thumbnail resolvers, returns `fightersList`, `mainEvents`, `topFightsList`, `loading`, `error`, `retry`)
- [x] 5.2 Rewrite `Mexico.tsx`, `Thailand.tsx` (thumbnail resolver arg), `UnitedStates.tsx` to use the hook; pages contain wiring only
- [x] 5.3 Update `_CountryTemplate/CountryTemplate.tsx` + CONTRIBUTING.md to the hook pattern (also fixed the stale "register in main.tsx" instructions → registry)
- [x] 5.4 Add a unit test for `useCountryPageData` (fetch on mount, resolver mapping, error key + retry — 3 tests)

## 6. Sections, hero, admin options

- [x] 6.1 `TopFights.tsx`: early-return `null` when no entry has a playable `idYt`; `TopFighters.tsx`: early-return `null` when `topFightersData` is empty
- [x] 6.2 Make `countryNameKey` required in `CountryPageConfig`; set it in Thailand and UnitedStates configs; `CountryPage.tsx` renders `t(config.countryNameKey)` only (done with 2.4)
- [x] 6.3 Derive `COUNTRY_OPTIONS` in `eventIngestion.config.ts` from `countryRegistry`
- [x] 6.4 Add component tests: empty `topEvents` → no "Thailand's Wars" heading; empty fighters → no fighters heading (5 tests)

## 7. Card keyboard access

- [x] 7.1 `FightCard.tsx`: `role="button"`, `tabIndex={0}`, Enter/Space `onKeyDown` (preventDefault on Space), `:focus-visible` outline
- [x] 7.2 `FighterCard.tsx`: same, with no role/tabIndex/handlers at all when disabled (stricter than tabIndex=-1)

## 8. Verify & close out

- [x] 8.1 `yarn build`, `yarn lint`, `yarn test:run` (49/49), `yarn format:check` all green
- [x] 8.2 Click-through in Chrome: Thailand hero "Tailandia"/"Thailand", US hero "Estados Unidos"/"United States", empty "Thailand's Wars" section gone (populated sections intact), fighter card focused + Enter loads a new fight and scrolls, `/admin/fights/new` lists Mexico/Thailand/United States, error path shows translated `error.countryData` message and retranslates live on language toggle
- [x] 8.3 Run `graphify update .` to refresh the knowledge graph
