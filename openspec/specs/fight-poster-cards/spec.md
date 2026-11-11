# fight-poster-cards

## Purpose

Define how a top-fight card renders on country pages: a fixed 4:5 poster whose image covers the whole card, with the year, a fighter / `VS` / fighter billing block, the subtitle and the watch-fight cue overlaid in fixed light colors over a dark scrim; how its image falls back from a curated bundled poster to the YouTube thumbnail to the no-video placeholder; and that Mexico's top fights ship curated, pre-cropped posters.

## Requirements

### Requirement: Fight card is a full-bleed poster

A top-fight card SHALL be a fixed 4:5 portrait card whose image covers the entire card area, with no separate text panel outside the image.

#### Scenario: Image covers the card

- **WHEN** a top-fight card renders
- **THEN** its image fills the card edge to edge, cropped to cover, and no part of the card shows a plain surface beside or below the image

#### Scenario: Cards share one height

- **WHEN** two cards in the same grid row have fighter names of different lengths
- **THEN** both cards have the same width and height

#### Scenario: Ratio holds across breakpoints

- **WHEN** the grid shows one, two or three columns
- **THEN** every card keeps the 4:5 ratio

### Requirement: Fight details are overlaid on the image

The card SHALL render the year, the fighters, the subtitle and the watch-fight cue on top of the image, with the fighters shown as a billing block of first fighter, `VS`, second fighter on separate lines.

#### Scenario: Fight with both fighters known

- **WHEN** a card renders a fight whose two fighters are known (from `fighterRed`/`fighterBlue`, or from a `A vs B` title)
- **THEN** the first fighter, the localized `VS` and the second fighter appear on three separate lines over the lower part of the image

#### Scenario: Fight whose title is not a matchup

- **WHEN** a card renders a fight whose fighters cannot be derived
- **THEN** the fight title appears over the lower part of the image in place of the billing block

#### Scenario: Very long fighter name

- **WHEN** a fighter name does not fit the card width on one line
- **THEN** it wraps or truncates inside the card and no text overflows the card bounds

#### Scenario: Missing optional data

- **WHEN** a fight has no year, or no discipline and no location
- **THEN** the year badge, or the subtitle line, is not rendered and nothing is substituted

### Requirement: Overlaid text stays legible on any image and theme

The card SHALL place a dark scrim between the image and the text and SHALL render overlaid text in fixed light colors that do not change with the light or dark theme.

#### Scenario: Light theme

- **WHEN** the site is in light theme
- **THEN** the card's overlaid text is still light on a darkened image, not dark theme text on the photo

#### Scenario: Bright image

- **WHEN** the image is bright behind the text block
- **THEN** the scrim keeps the fighter names and subtitle readable

#### Scenario: Active card

- **WHEN** a card is hovered, keyboard-focused, or scroll-focused on a touch device
- **THEN** the image brightens and scales as its active treatment while the scrim behind the text remains

### Requirement: Card image falls back without breaking the poster

The card SHALL use the fight's resolved image when it has one, otherwise the fight's YouTube thumbnail, otherwise the bundled no-video placeholder, and every fallback SHALL fill the card the same way.

#### Scenario: No curated image

- **WHEN** a fight has no resolved image
- **THEN** its YouTube thumbnail is shown cover-cropped to the full card

#### Scenario: Image fails to load

- **WHEN** the image request errors, or YouTube answers with its missing-thumbnail stub
- **THEN** the no-video placeholder fills the card and the overlaid text is still shown

### Requirement: Mexico top fights use curated posters

Every fight in Mexico's top-fights section SHALL have a locally bundled image, stored already cropped to 4:5 with both fighters in frame and free of baked-in channel branding, letterboxing or broadcast graphics.

#### Scenario: Mexico page renders its top fights

- **WHEN** the Mexico page renders its top-fights section
- **THEN** each card shows its bundled poster image and none shows a YouTube thumbnail

#### Scenario: Backend adds a fight with no bundled image

- **WHEN** Mexico's top fights include a fight that has no bundled image
- **THEN** that card falls back to the YouTube thumbnail and the others are unaffected
