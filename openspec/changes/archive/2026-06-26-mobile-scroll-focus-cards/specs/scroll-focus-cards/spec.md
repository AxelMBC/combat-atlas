## ADDED Requirements

### Requirement: Centered card receives active treatment on touch devices

On devices without a hover-capable pointer, the system SHALL apply the card's existing "active" visual treatment (lift, border highlight, and image color/brightness animation) to whichever card is currently crossing the vertical center of the viewport, and SHALL update which card is active as the user scrolls. This SHALL apply to both `FightCard` and `FighterCard`.

#### Scenario: A card scrolls into the center band

- **WHEN** the viewport has no hover-capable pointer and a card's box overlaps the center focus band of the viewport
- **THEN** that card displays the active treatment (lifted, highlighted border, image at full color/brightness)

#### Scenario: A card scrolls out of the center band

- **WHEN** an active card's box no longer overlaps the center focus band
- **THEN** that card returns to its default (inactive) appearance

### Requirement: Desktop hover behavior is preserved

On devices with a hover-capable pointer, the system SHALL continue to trigger the active treatment via pointer hover only, and SHALL NOT apply scroll-based focus.

#### Scenario: Hovering a card on desktop

- **WHEN** the viewport has a hover-capable pointer and the user hovers a card
- **THEN** the card displays the active treatment

#### Scenario: Scrolling on desktop

- **WHEN** the viewport has a hover-capable pointer and the user scrolls without hovering any card
- **THEN** no card displays the active treatment from scrolling

### Requirement: Single active card with no flicker between cards

The center focus band SHALL be sized so that, during normal scrolling, at most one card is active at a time in the common case, while avoiding moments where no card is active as the band passes through the gutter between adjacent cards.

#### Scenario: Scrolling past the gutter between two cards

- **WHEN** the user scrolls and the center of the viewport passes through the gap between two adjacent cards
- **THEN** the active treatment hands off from the outgoing card to the incoming card without a visible gap where neither card is active

### Requirement: Active transition keeps pace with scrolling

On touch devices, the active-state transition SHALL use a shorter duration than the desktop hover transition so the focus change keeps pace with scrolling.

#### Scenario: Active state changes during a scroll

- **WHEN** the active card changes while the user is scrolling on a touch device
- **THEN** the transition into and out of the active treatment completes quickly enough to track the scroll rather than lagging behind it
