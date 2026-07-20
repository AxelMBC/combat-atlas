# card-keyboard-access Specification

## Purpose

Make `FighterCard` and `FightCard` fully operable by keyboard — focusable, activatable with Enter/Space, exposed with the correct role, and with a visible focus indicator — while keeping disabled cards out of the tab order.

## Requirements

### Requirement: Cards are keyboard-operable

`FighterCard` and `FightCard` SHALL be reachable by Tab, activatable with Enter and Space, expose `role="button"`, and show a visible focus indicator. A disabled fighter card (no remaining fights) SHALL NOT be focusable or activatable.

#### Scenario: Activate a fight card by keyboard

- **WHEN** a user tabs to a fight card and presses Enter or Space
- **THEN** the same selection fires as a mouse click (video loads, page scrolls to the player) and the page does not scroll as a Space side effect

#### Scenario: Activate a fighter card by keyboard

- **WHEN** a user tabs to an enabled fighter card and presses Enter or Space
- **THEN** a fight for that fighter is selected, identically to clicking

#### Scenario: Disabled fighter card is skipped

- **WHEN** a fighter card has zero remaining fights
- **THEN** it is not in the tab order and keyboard activation does nothing

#### Scenario: Focus is visible

- **WHEN** a card receives keyboard focus
- **THEN** a visible focus outline appears (matching the `:focus-visible` treatment used by the hero controls)
