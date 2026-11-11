## ADDED Requirements

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
