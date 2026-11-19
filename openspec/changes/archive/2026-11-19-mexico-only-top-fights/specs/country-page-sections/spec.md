## ADDED Requirements

### Requirement: Top-fights section is opt-in per country

A country page SHALL render its top-fights section only when its `CountryPageConfig` sets `topEventsTitleKey`; a config without it SHALL show no top-fights heading or cards, whatever top fights the backend returns.

#### Scenario: Country without a top-fights title key

- **WHEN** the Thailand or United States page renders and the backend returns top fights for it
- **THEN** no top-fights heading or fight card appears in the DOM, and the rest of the page renders as before

#### Scenario: Country with a top-fights title key

- **WHEN** the Mexico page renders with at least one playable top fight
- **THEN** its top-fights section renders its heading and cards

## MODIFIED Requirements

### Requirement: Empty sections are not rendered

The `TopFighters` and `TopFights` sections SHALL render nothing at all — including their headings — when they have no items to display. For `TopFights`, entries without a playable `idYt` SHALL NOT count as displayable items.

#### Scenario: No top fights

- **WHEN** a country page that shows top fights renders and `topEvents` is empty or contains only entries without `idYt`
- **THEN** neither the section heading (e.g. "Historic Fights") nor any section container appears in the DOM

#### Scenario: No top fighters

- **WHEN** a country page renders and `topFightersData` is empty
- **THEN** neither the top-fighters heading nor any section container appears in the DOM

#### Scenario: Sections with content are unaffected

- **WHEN** a section has at least one displayable item
- **THEN** it renders its heading and items exactly as today
