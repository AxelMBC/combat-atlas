## MODIFIED Requirements

### Requirement: Title card is a fight poster built from the fight data

The title card SHALL show, from the current fight's data only:

- a presenter line ("Combat Atlas presenta" / "Combat Atlas presents");
- a ribbon with the fight type (or the first localized tag) and, when the fight has an `organization`, a localized title tag ("Título WBC" / "WBC title");
- a face-off of the two fighters around the localized `VS`, each fighter split into given names, surname and a quoted nickname taken from the name; a bout number written as an uppercase Roman numeral at the end of an `A vs B` title (`I`, `II`, `III`…) belongs to the fight, not to the second fighter, and is left out of the billing;
- when the fighters cannot be derived, the fight title billed as a single name with no `VS`;
- the fight's year as an outlined watermark behind everything;
- a facts strip with four labelled slots: date, venue, localized division and scheduled rounds.

Free-standing elements (ribbon, title tag, nickname, given names, watermark) SHALL be omitted when their data is missing. Fact slots SHALL always render, with an em dash (`—`) in a muted colour when their value is missing, so the strip keeps its rhythm.

#### Scenario: Matchup with full data

- **WHEN** the fight has two fighters (from `fighterRed`/`fighterBlue` or an `A vs B` title), a type, an organization, a `date`, a `venue` with a name and city, a division and `scheduledRounds`
- **THEN** the card shows the presenter line, the type ribbon and title tag, both fighters around `VS`, the year watermark, and the date, venue name with its city below, division and rounds in the facts strip

#### Scenario: Nickname in the name

- **WHEN** a fighter's name contains a quoted nickname, such as `Danny 'Little Red' Lopez`
- **THEN** the card bills `Danny` as the given name, `Lopez` as the surname and “Little Red” as the nickname

#### Scenario: Bout number at the end of the title

- **WHEN** the fighters come from a title that ends in a bout number, such as `Anthony Joshua vs Andy Ruiz I` or `Canelo Álvarez vs. Gennadiy Golovkin III`
- **THEN** the second fighter is billed as `Andy` / `Ruiz` (or `Gennadiy` / `Golovkin`), with no numeral as or after the surname

#### Scenario: Title that is not a matchup

- **WHEN** the fighters cannot be derived from the fight, as for a sparring video titled with one fighter's name
- **THEN** the title is billed as a single, larger name with no `VS`

#### Scenario: Sparring with partial data

- **WHEN** the fight has a year and a location but no `date`, division or `scheduledRounds`
- **THEN** the date slot shows the year, the venue slot shows the city, and the division and rounds slots show `—`

#### Scenario: Nothing known for a slot

- **WHEN** the fight has neither a `date` nor a year, or neither a venue nor a location
- **THEN** that slot shows `—`

#### Scenario: Unparseable date

- **WHEN** the fight's `date` is not a valid date
- **THEN** the date slot falls back to the year

#### Scenario: Language switch

- **WHEN** the active language changes while the card is visible
- **THEN** the presenter line, slot labels, title tag, division text and date format (`21 jun 1980` / `Jun 21, 1980`) re-render in the new language

#### Scenario: Same derivation as the fight cards

- **WHEN** a fight is shown on the title card and on a fight card or the fight info section
- **THEN** the billing names are identical, because all three derive them through the same shared helper
