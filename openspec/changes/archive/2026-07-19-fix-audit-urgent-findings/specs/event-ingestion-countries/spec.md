# event-ingestion-countries

## ADDED Requirements

### Requirement: Country options derive from the registry

The admin event form's country select SHALL be derived from `countryRegistry` (slug + localized name key), not from a hand-maintained list.

#### Scenario: All registered countries selectable

- **WHEN** the admin opens the country select on `/admin/fights/new`
- **THEN** every entry in `countryRegistry` — including United States — appears as an option, labeled via its `nameKey` in the active language

#### Scenario: Future country appears automatically

- **WHEN** a new country is appended to `countryRegistry`
- **THEN** it becomes selectable in the event form with no edit to the event-ingestion config
