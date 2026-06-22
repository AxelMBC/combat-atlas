# youtube-attribution Specification

## Purpose

Provide attribution to the original YouTube source for the currently playing fight, surfaced as a recognizable, accessible, bilingual link within the "now playing" info card.

## Requirements

### Requirement: Original video attribution link

The "now playing" card SHALL present a link to the original YouTube video for the currently playing fight. The link target MUST be `https://www.youtube.com/watch?v=<idYt>`, where `<idYt>` is the `idYt` field of the active `MainEvent`.

#### Scenario: Link is shown for the active fight

- **WHEN** a fight is playing and its info is displayed in the `FightInfoSection` card
- **THEN** an attribution control labeled with the localized "watch on YouTube" string is visible within the card

#### Scenario: Link points to the original video

- **WHEN** the user activates the attribution control
- **THEN** the browser navigates to `https://www.youtube.com/watch?v=<idYt>` for the active fight
- **AND** the destination opens in a new browser tab without affecting the current page

#### Scenario: No fight is active

- **WHEN** the card is in a loading or error state with no active fight
- **THEN** the attribution control is not rendered

### Requirement: Accessible, recognizable presentation

The attribution control SHALL be rendered as a real anchor element, be visually recognizable as a YouTube link, and remain a secondary action relative to the primary "Another fight" call to action.

#### Scenario: Anchor semantics

- **WHEN** the attribution control is rendered
- **THEN** it is an anchor element with an `href` to the original video
- **AND** it uses `rel="noopener noreferrer"` for the new-tab navigation
- **AND** it exposes an accessible label indicating the destination is YouTube and opens in a new tab

#### Scenario: YouTube-red styling with external cue

- **WHEN** the attribution control is rendered
- **THEN** it is styled in YouTube red with the YouTube glyph and an external-link cue
- **AND** it is visually subordinate to the primary "Another fight" button

### Requirement: Bilingual labels

The attribution control's visible label and accessible label SHALL be provided through the i18n layer in both English and Spanish.

#### Scenario: Localized label resolves

- **WHEN** the active language is English or Spanish
- **THEN** the control displays the corresponding localized label (e.g. "Watch original on YouTube" / "Ver original en YouTube")

### Requirement: Scope limited to the info card

The attribution link SHALL appear only in the `FightInfoSection` card and SHALL NOT be added to the `CinematicHero` player.

#### Scenario: Hero player unchanged

- **WHEN** the country page renders the `CinematicHero` player
- **THEN** no YouTube attribution control is added to the hero player
