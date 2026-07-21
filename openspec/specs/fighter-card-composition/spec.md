# fighter-card-composition

## Purpose

Keep the fighter card maintainable by composing it from focused, shared subcomponents behind a single stable entry point, while preserving its public API, variant dispatch, and interaction behavior, and by extracting active-period formatting into a pure, tested util.

## Requirements

### Requirement: Fighter card preserves its public API and variant dispatch

The fighter card SHALL keep a single entry point at `FighterCard/index.tsx` that accepts the unchanged `FighterCardProps` (`boxer`, `rank`, `remaining`, `variant`, `onSelect`) and renders the `feature` or `compact` layout based on `variant`. Callers MUST NOT need any import or prop change.

#### Scenario: Feature variant renders the feature layout

- **WHEN** `TopFighters` renders `<FighterCard variant="feature" .../>` for the top-ranked fighter
- **THEN** the feature layout renders and the component is imported exactly as before the refactor

#### Scenario: Compact variant renders the compact layout

- **WHEN** `TopFighters` renders `<FighterCard variant="compact" .../>` for a ranked fighter
- **THEN** the compact layout renders with the same markup and styling as before the refactor

#### Scenario: Callers and their tests are untouched

- **WHEN** the refactor is complete
- **THEN** `TopFighters.tsx` and `TopFighters.test.ts` are unchanged and the test suite passes

### Requirement: Fighter card is composed from shared subcomponents

The fighter card SHALL be composed from focused units — a variant dispatcher, a shell wrapper, a portrait, and a stats block — rather than a single component branching internally, with no source file in the `FighterCard/` folder exceeding roughly 180 lines.

#### Scenario: Subcomponents are shared by both variants

- **WHEN** the feature and compact variants render
- **THEN** both compose the same shell, portrait, and stats subcomponents, and each `FighterCard/` source file stays under ~180 lines

### Requirement: Fighter card interaction behavior is preserved

The refactored fighter card SHALL preserve its interaction behavior exactly across both variants.

#### Scenario: Enabled card is an accessible button

- **WHEN** a fighter has remaining fights and the card is rendered
- **THEN** the card exposes `role="button"` with `tabIndex=0`, activates its `onSelect` on click and on Enter/Space, and shows a `focus-visible` outline

#### Scenario: Disabled card is inert

- **WHEN** a fighter has no remaining fights
- **THEN** the card omits `role` and `tabIndex`, does not call `onSelect`, appears dimmed, and shows the exhausted overlay

#### Scenario: Touch scroll focus and image fallback still work

- **WHEN** the card is viewed on a `hover: none` device and scrolled to center, or its image fails to load
- **THEN** the scroll-focus active styles apply via the `.fighter-portrait img` target, and a failed image falls back to the placeholder with `object-fit: contain`

### Requirement: Active-period formatting is a pure, tested util

The active-period label logic SHALL live in a translator-agnostic util that accepts the raw period and resolved label strings, and SHALL be covered by a unit test.

#### Scenario: Formatting branches are covered

- **WHEN** the util receives an undefined period, an open-ended period like `"2015-"`, or a closed period like `"2010-2015"`
- **THEN** it returns the not-available label, `"<activeSince> 2015"`, and `"2010-2015"` respectively, as asserted by its colocated test
