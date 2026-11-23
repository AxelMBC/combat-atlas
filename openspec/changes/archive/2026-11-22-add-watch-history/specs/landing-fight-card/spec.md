## ADDED Requirements

### Requirement: Each country row shows its fight count
The landing SHALL load the country summaries (`GET /countries`) when it mounts, reusing a cached summary younger than 30 minutes, and for each registry entry whose summary lists at least one pool fight SHALL show in the row's ribbon, after the discipline, the total number of pool fights while none of them is in the watch history, the number of unwatched pool fights once at least one is, and "Todas vistas" / "All watched" when none is left.

#### Scenario: Fresh visitor
- **WHEN** the watch history is empty, the summary lists Thailand with 20 fight ids, and the language is Spanish
- **THEN** Thailand's ribbon reads "★ MUAY THAI · 20 PELEAS ★", and in English "★ MUAY THAI · 20 FIGHTS ★"

#### Scenario: Some fights watched
- **WHEN** 8 of Thailand's 20 fight ids are in the watch history
- **THEN** Thailand's ribbon reads "12 POR VER" in Spanish and "12 TO WATCH" in English after the discipline

#### Scenario: Everything watched
- **WHEN** all of Thailand's fight ids are in the watch history
- **THEN** Thailand's ribbon reads "TODAS VISTAS" in Spanish and "ALL WATCHED" in English after the discipline

#### Scenario: One fight
- **WHEN** a country's summary lists exactly one fight and the history is empty
- **THEN** its ribbon reads "1 PELEA" in Spanish and "1 FIGHT" in English

#### Scenario: Cold backend
- **WHEN** the backend takes 60 seconds to answer `GET /countries`
- **THEN** the rows render as before with no count, and when the summary arrives each count fades in, or appears at once when reduced motion is requested, without changing any row's height

#### Scenario: Summary unavailable
- **WHEN** `GET /countries` fails, times out, or answers 404 because the backend does not have it yet
- **THEN** no row shows a count, no error is shown, and the landing works as before

#### Scenario: Country without a count
- **WHEN** a registry entry is missing from the summary, or listed with no fight ids
- **THEN** that row shows no count

#### Scenario: Returning to the landing
- **WHEN** the user goes from `/` to a country and back within 30 minutes
- **THEN** no second `GET /countries` request is sent, and the counts reflect the fights recorded on the country page

#### Scenario: Phone with counts
- **WHEN** the landing is opened at 390×844 and every row shows a count
- **THEN** the "Combat Atlas" eyebrow, the globe, all three country links and the spin control are still visible without scrolling

## MODIFIED Requirements

### Requirement: Every registered country is a link on the landing
The landing page SHALL render one link to `/<slug>` per country registry entry, in registry order, inside a navigation landmark, and each link's accessible name SHALL be the country's localized name followed by its localized discipline and, while the row shows a fight count, that count's text.

#### Scenario: Links are real anchors
- **WHEN** the landing at `/` is rendered
- **THEN** the navigation landmark contains one `<a>` per registry entry whose `href` is `/<slug>`, so crawlers and "open in new tab" can follow it

#### Scenario: Accessible name
- **WHEN** a screen reader reaches the Mexico link in Spanish before the country summary has arrived
- **THEN** it announces "México — Boxeo", and the number, stars and arrow drawn around the name are not announced

#### Scenario: Accessible name with the count
- **WHEN** a screen reader reaches the Mexico link in Spanish while its ribbon shows "15 PELEAS"
- **THEN** it announces "México — Boxeo, 15 peleas"

#### Scenario: Keyboard reach
- **WHEN** the user presses Tab from the top of the landing
- **THEN** focus moves through every country link in registry order and each one shows a visible focus outline
