## ADDED Requirements

### Requirement: Every registered country is a link on the landing
The landing page SHALL render one link to `/<slug>` per country registry entry, in registry order, inside a navigation landmark, and each link's accessible name SHALL be the country's localized name followed by its localized discipline.

#### Scenario: Links are real anchors
- **WHEN** the landing at `/` is rendered
- **THEN** the navigation landmark contains one `<a>` per registry entry whose `href` is `/<slug>`, so crawlers and "open in new tab" can follow it

#### Scenario: Accessible name
- **WHEN** a screen reader reaches the Mexico link in Spanish
- **THEN** it announces "México — Boxeo", and the number, stars and arrow drawn around the name are not announced

#### Scenario: Keyboard reach
- **WHEN** the user presses Tab from the top of the landing
- **THEN** focus moves through every country link in registry order and each one shows a visible focus outline

### Requirement: One activation enters a country
Activating a country link with a plain primary click, a tap, or Enter SHALL navigate to that country, first playing the walkout transition: a full-screen wipe, skewed like the ribbons, in the country's accent color, carrying the country name and lasting no more than 400 ms. The transition SHALL be skipped and navigation SHALL happen immediately when reduced motion is requested.

#### Scenario: Click enters through the walkout
- **WHEN** the user clicks the Thailand link with the primary mouse button and no modifier key
- **THEN** an amber wipe with "TAILANDIA" sweeps across the screen and the app is on `/thailand` within 400 ms of the click, with no intermediate popup or second click

#### Scenario: Tap enters on touch
- **WHEN** the user taps the United States row on a touch screen
- **THEN** the walkout plays in blue and the app navigates to `/united-states`

#### Scenario: Modifier and middle clicks keep browser behavior
- **WHEN** the user ctrl-, cmd-, shift- or middle-clicks a country link
- **THEN** the browser's default (new tab or window) happens, no walkout plays, and the landing stays as it was

#### Scenario: Reduced motion
- **WHEN** reduced motion is requested and the user activates a country link
- **THEN** the app navigates to the country immediately without the wipe

#### Scenario: Repeated activation during the walkout
- **WHEN** a walkout is already playing and the user activates another country
- **THEN** the second activation is ignored and only the first country is navigated to

### Requirement: Pointing at or focusing a country selects it
Hovering a country link with a mouse, focusing it, or pressing it SHALL make that country the selected one, and exactly one country SHALL be selected at any time. The selected row SHALL show its active treatment:

- name filled and offset-outlined in the accent color;
- ribbon filled with the accent color;
- number outlined in the accent color;
- an "enter" cue.

The stage SHALL show the selected country's:

- accent glow;
- outlined ISO code watermark;
- coordinates, with hemisphere letters in the active language.

The globe SHALL turn to face the selected country.

#### Scenario: Hover selects
- **WHEN** Mexico is selected and the user hovers the Thailand row
- **THEN** the Thailand row takes the active treatment in amber, the Mexico row returns to outline, the watermark reads "TH", the coordinates read "15.0° N · 101.0° E", and the globe turns to Thailand

#### Scenario: Focus selects
- **WHEN** the user tabs onto the United States link
- **THEN** the United States becomes selected exactly as on hover

#### Scenario: Coordinates follow the language
- **WHEN** Mexico is selected and the language is Spanish
- **THEN** the coordinates read "23.6° N · 102.5° O", and in English they read "23.6° N · 102.5° W"

#### Scenario: Ribbon text stays readable on every accent
- **WHEN** a country with a light accent color (Thailand's amber) is selected
- **THEN** the ribbon text color is the one with the higher contrast against the accent, not always white

### Requirement: Intent prefetches the country once
When a country link is hovered, focused or pressed, the landing SHALL start loading that country's page chunk and its data, and a later request for the same country's data SHALL reuse the request in flight or the cached result instead of sending another one. A navigation that follows is such a later request.

#### Scenario: Hover then click sends one data request
- **WHEN** the user hovers the Mexico row and clicks it before the prefetch has finished
- **THEN** exactly one `GET /countries/mexico` request is sent in total, and the Mexico page renders from its result

#### Scenario: Repeated intent is free
- **WHEN** the user hovers each row several times within the cache lifetime
- **THEN** at most one data request per country is sent

#### Scenario: Prefetch failure is silent
- **WHEN** a prefetch request fails
- **THEN** the landing shows no error, and navigating to that country fetches its data again with the country page's usual loading and error handling

### Requirement: Spin the globe picks a random country and enters it
The landing SHALL show a "Gira el mundo" / "Spin the globe" control. Activating it SHALL:

1. pick a random registered country, different from the selected one when more than one country is registered;
2. select it;
3. spin the globe at least one full turn until it faces that country;
4. then enter the country through the walkout.

#### Scenario: Spin and enter
- **WHEN** Mexico is selected and the user activates the spin control
- **THEN** the globe spins at least one full turn, comes to rest facing Thailand or the United States, that country's row is selected, the walkout plays, and the app navigates to that country

#### Scenario: Single country
- **WHEN** only one country is registered and the user activates the spin control
- **THEN** that country is picked and entered

#### Scenario: Spin with reduced motion
- **WHEN** reduced motion is requested and the user activates the spin control
- **THEN** the app navigates directly to a random country other than the selected one, with no spin and no wipe

#### Scenario: Activating again while spinning
- **WHEN** a spin is in progress
- **THEN** the spin control is disabled and country links do not start a second walkout

### Requirement: Selected country shows its fighter portrait
When the selected country's registry entry has a `portrait`, the stage SHALL show that photo behind the globe, styled as follows:

- tinted with the country's accent as a halftone duotone;
- edge-faded into the stage;
- captioned with the fighter's name.

Changing the selection SHALL crossfade the portraits. A country's portrait image SHALL NOT be requested before that country is selected for the first time.

#### Scenario: Portrait follows the selection
- **WHEN** the selection moves from Mexico to Thailand
- **THEN** Canelo Álvarez's portrait fades out, Saenchai's fades in once loaded, and the caption reads "Saenchai"

#### Scenario: Unselected portraits are not downloaded
- **WHEN** the landing has just loaded with Mexico selected and nothing else has been selected yet
- **THEN** the network shows Mexico's portrait image requested and the Thailand and United States portrait images not requested

#### Scenario: Broken or missing portrait
- **WHEN** the selected country's portrait fails to load, or its registry entry has no `portrait`
- **THEN** the stage shows no portrait, no broken-image icon, and no empty frame or caption

### Requirement: Landing follows the theme mode
The landing SHALL take all surface colors from the active theme's surface palette:

- in dark mode it SHALL render a dark stage with light ink;
- in light mode it SHALL render a paper stage with dark ink;
- country accent colors SHALL be the same in both modes.

Toggling the mode SHALL update every part of the landing, including the globe's dots, without navigation. Each part SHALL transition smoothly rather than snapping.

#### Scenario: Toggle to light mode
- **WHEN** the user is on the landing in dark mode and clicks the theme toggle
- **THEN** the stage background, bill text, outlines, site credit and globe dots move to the light palette over a short transition, while each country's dots and ribbons keep their accent color

#### Scenario: Toggle back to dark mode
- **WHEN** the user toggles from light mode back to dark mode on the landing
- **THEN** every landing surface, including the globe, returns to the dark palette with the same smooth transition

#### Scenario: Persisted preference on first paint
- **WHEN** the landing first renders with a persisted `preferredTheme` of `light`
- **THEN** it paints in the light palette from the first frame, with no dark flash

### Requirement: Phone layout keeps the bill within reach
On viewports narrower than the `md` breakpoint, the landing SHALL place the globe above the bill, size the globe to the viewport width, and give each country link a touch target at least 44 px tall. On wider viewports the bill SHALL sit beside the globe.

#### Scenario: Current registry on a phone
- **WHEN** the landing is opened at 390×844
- **THEN** the "Combat Atlas" eyebrow, the globe, all three country links and the spin control are visible without scrolling

#### Scenario: Short desktop viewport
- **WHEN** the landing is opened at 1366×600
- **THEN** no country name overflows its row and every link and the spin control can be reached

### Requirement: Landing starts on the last visited country
When the landing mounts after a country page has been shown in the same browser session, it SHALL start with that country selected and the globe facing it. Otherwise it SHALL start with the first registry entry selected.

#### Scenario: Back from a country page
- **WHEN** the user enters `/thailand` from the landing and returns with the browser's back button, or opens `/thailand` directly and returns with the page's back link
- **THEN** Thailand is selected and the globe faces Thailand on the first frame

#### Scenario: Fresh session
- **WHEN** a new session opens `/`
- **THEN** the first registry entry is selected

#### Scenario: Stale value
- **WHEN** the remembered slug no longer exists in the registry
- **THEN** the first registry entry is selected

### Requirement: Landing uses no third-party map service
The landing SHALL render without requesting any third-party map style, tile, sprite or glyph and without any map API key, and the production build SHALL include no map-rendering library.

#### Scenario: Network on load
- **WHEN** a user opens `/` with an empty cache
- **THEN** no request goes to `api.maptiler.com` or any other map tile host

#### Scenario: Build output
- **WHEN** the production bundle is built
- **THEN** no `maplibre-gl` chunk or maplibre stylesheet is part of the output
