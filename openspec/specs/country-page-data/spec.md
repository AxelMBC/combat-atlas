# country-page-data Specification

## Purpose

Give country pages a single, typed data pathway: a `CountryDataResponse` contract enforced by the compiler across service, thunks, slices, and cache, and one shared `useCountryPageData` hook so no country page carries its own fetch/reset/error logic.

## Requirements

### Requirement: Country data has a typed contract

The country data service SHALL declare a `CountryDataResponse` return type (`topFighters: Fighter[]`, `allFights: MainEvent[]`, `topEvents: MainEvent[]`), and all consumers (thunks, slices, session cache) SHALL compile against it with no `any` payloads and no `as` casts on thunk rejection values.

#### Scenario: Backend field rename breaks the build

- **WHEN** a field consumed from the country data response is renamed or removed in `CountryDataResponse`
- **THEN** `tsc -b` fails at every consumer that still references the old field

#### Scenario: Thunk rejection is typed

- **WHEN** `fetchCountry` or `fetchFightersByCountry` rejects
- **THEN** the rejected payload is typed (no `action.payload as string` cast is needed in any reducer)

### Requirement: Country pages share one data hook

All country pages SHALL obtain their data through a single `useCountryPageData` hook (arrow function) that dispatches reset + fetch on mount, exposes `loading`, `error`, a retry action, and applies optional per-country image/thumbnail resolvers. Country page components SHALL contain no fetch, reset, or state-selection logic of their own.

#### Scenario: Existing pages consolidated

- **WHEN** the Mexico, Thailand, or United States page mounts
- **THEN** data is loaded via `useCountryPageData` with behavior identical to the previous per-page logic (spinner while loading, `ErrorFallback` with retry on error, session cache honored within its TTL)

#### Scenario: Thailand thumbnail mapping preserved

- **WHEN** the Thailand page renders top fights that have a locally bundled thumbnail
- **THEN** the thumbnail resolver supplied to the hook maps them exactly as before

#### Scenario: New country needs no fetch logic

- **WHEN** a new country page is created from the template
- **THEN** it wires config and resolvers only, with zero copied fetch/reset/error code

### Requirement: Top-fight image resolver receives the fight record

The optional top-fight image resolver given to `useCountryPageData` SHALL be called with each top fight's full record, and that fight's `thumbnail` SHALL be whatever the resolver returns, so a fight it has no image for carries no `thumbnail`.

#### Scenario: Resolver keyed by something other than thumbnail

- **WHEN** a country supplies a resolver that looks images up by `idYt` and a top fight arrives without a `thumbnail`
- **THEN** the fight returned by the hook carries the resolved image as its `thumbnail`

#### Scenario: Resolver has no image for a fight

- **WHEN** the resolver returns nothing for a fight
- **THEN** the hook returns that fight without a `thumbnail`, even if the backend sent one, so its card falls back to the YouTube thumbnail

#### Scenario: No resolver supplied

- **WHEN** a country page calls the hook without a top-fight image resolver
- **THEN** top fights are returned exactly as received
