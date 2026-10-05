# country-page-data

## ADDED Requirements

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
