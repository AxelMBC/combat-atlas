## ADDED Requirements

### Requirement: Fights are identified by their database id
`MainEvent` SHALL declare the fight's identity as `_id: string`, the value the backend sends, and SHALL NOT declare an `id` field, so code that tells fights apart compiles only against an id that exists at runtime.

#### Scenario: Reading a missing id fails the build
- **WHEN** code reads `fight.id` on a `MainEvent`
- **THEN** `tsc -b` fails at that line

#### Scenario: Hero queue notices a different set of fights
- **WHEN** a country's data is replaced by a list with the same number of fights but at least one different fight
- **THEN** the hero queue is rebuilt from the new list

#### Scenario: Same fights again
- **WHEN** a country's data is fetched again and holds the same fights in another order
- **THEN** the hero keeps its current fight and queue
