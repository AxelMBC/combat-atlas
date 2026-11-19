# country-page-sections Specification

## Purpose

Keep country page sections honest: empty `TopFighters`/`TopFights` sections disappear entirely, the hero always shows the localized country name via a required translation key, and fight cards never display fabricated fallback data.

## Requirements

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

### Requirement: Hero shows the localized country name

`CountryPageConfig` SHALL require `countryNameKey: TranslationKey`, and the hero heading SHALL always render the translated name for the active language. The untranslated `countryName` string fallback SHALL NOT exist.

#### Scenario: United States hero

- **WHEN** the United States page renders in English or Spanish
- **THEN** the hero heading reads "United States" / "Estados Unidos" (never "UnitedStates")

#### Scenario: Thailand hero in Spanish

- **WHEN** the Thailand page renders with language `es`
- **THEN** the hero heading reads "Tailandia"

#### Scenario: Config without a name key does not compile

- **WHEN** a country config omits `countryNameKey`
- **THEN** `tsc -b` fails

### Requirement: No fabricated fight data

Fight cards SHALL display only data present on the fight record. The hardcoded fallback record (Tokyo '90) and its resolution mechanism SHALL be removed.

#### Scenario: Fight without a year

- **WHEN** a fight card renders a video whose `year` is absent
- **THEN** no year badge is shown (and no other fight's data is substituted)

### Requirement: Top-fights section is opt-in per country

A country page SHALL render its top-fights section only when its `CountryPageConfig` sets `topEventsTitleKey`; a config without it SHALL show no top-fights heading or cards, whatever top fights the backend returns.

#### Scenario: Country without a top-fights title key

- **WHEN** the Thailand or United States page renders and the backend returns top fights for it
- **THEN** no top-fights heading or fight card appears in the DOM, and the rest of the page renders as before

#### Scenario: Country with a top-fights title key

- **WHEN** the Mexico page renders with at least one playable top fight
- **THEN** its top-fights section renders its heading and cards
