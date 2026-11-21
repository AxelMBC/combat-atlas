## MODIFIED Requirements

### Requirement: One activation enters a country
Activating a country link with a plain primary click or Enter, or tapping the link of the selected country on a touch screen, SHALL navigate to that country, first playing the walkout transition: a full-screen wipe, skewed like the ribbons, in the country's accent color, carrying the country name and lasting no more than 400 ms. Tapping the link of a country that is not selected SHALL only select it, without navigating, so a touch user can see a country before entering it. The transition SHALL be skipped and navigation SHALL happen immediately when reduced motion is requested.

#### Scenario: Click enters through the walkout
- **WHEN** the user clicks the Thailand link with the primary mouse button and no modifier key
- **THEN** an amber wipe with "TAILANDIA" sweeps across the screen and the app is on `/thailand` within 400 ms of the click, with no intermediate popup or second click

#### Scenario: First tap selects on touch
- **WHEN** Mexico is selected and the user taps the United States row on a touch screen
- **THEN** the United States becomes selected, the globe turns to it, and the app stays on `/` with no walkout

#### Scenario: Tap on the selected country enters
- **WHEN** the United States is selected and the user taps its row on a touch screen
- **THEN** the walkout plays in blue and the app navigates to `/united-states`

#### Scenario: Modifier and middle clicks keep browser behavior
- **WHEN** the user ctrl-, cmd-, shift- or middle-clicks a country link
- **THEN** the browser's default (new tab or window) happens, no walkout plays, and the landing stays as it was

#### Scenario: Reduced motion
- **WHEN** reduced motion is requested and the user clicks a country link, presses Enter on it, or taps the selected country's link
- **THEN** the app navigates to the country immediately without the wipe

#### Scenario: Repeated activation during the walkout
- **WHEN** a walkout is already playing and the user activates another country
- **THEN** the second activation is ignored and only the first country is navigated to
