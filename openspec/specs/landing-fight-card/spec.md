# landing-fight-card

## Purpose

The landing page at `/` presents every registered country as a fight-poster bill of real links: one activation enters a country through a short accent-colored walkout, pointing at or focusing a row selects it and prefetches its page and data, a spin control picks a random country and enters it, and the selected country's fighter portrait, glow and coordinates fill the stage. The landing follows the theme mode, fits a phone without scrolling, starts on the last visited country, and uses no third-party map service.

## Requirements

### Requirement: Every registered country is a link on the landing
The landing page SHALL render one link to `/<slug>` per country registry entry, in registry order, inside a navigation landmark, and each link's accessible name SHALL be the country's localized name followed by its localized discipline and, while the row shows a fight count, that count's text.

#### Scenario: Links are real anchors
- **WHEN** the landing at `/` is rendered
- **THEN** the navigation landmark contains one `<a>` per registry entry whose `href` is `/<slug>`, so crawlers and "open in new tab" can follow it

#### Scenario: Accessible name
- **WHEN** a screen reader reaches the Mexico link in Spanish before the country summary has arrived
- **THEN** it announces "México — Boxeo", and the number, the discipline line and the arrow drawn around the name are not announced again on their own

#### Scenario: Accessible name with the count
- **WHEN** a screen reader reaches the Mexico link in Spanish while its discipline line shows "15 peleas"
- **THEN** it announces "México — Boxeo, 15 peleas"

#### Scenario: Keyboard reach
- **WHEN** the user presses Tab from the top of the landing
- **THEN** focus moves through every country link in registry order and each one shows a visible focus outline

### Requirement: One activation enters a country
Activating a country link with a plain primary click or Enter, or tapping the link of the selected country on a touch screen, SHALL navigate to that country, first playing the walkout transition: a full-screen skewed wipe in the country's accent color, carrying the country name and lasting no more than 400 ms. Tapping the link of a country that is not selected SHALL only select it, without navigating, so a touch user can see a country before entering it. The transition SHALL be skipped and navigation SHALL happen immediately when reduced motion is requested.

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

### Requirement: Pointing at or focusing a country selects it
Hovering a country link with a mouse, focusing it, or pressing it SHALL make that country the selected one, and exactly one country SHALL be selected at any time. The selected row SHALL show its active treatment:

- name as a solid fill in the full-contrast ink, while every other name is a solid fill in the muted ink;
- count in the discipline line in the full-contrast ink, while the rest of the line, and every other row's whole line, is in the secondary ink;
- bout number in the accent color;
- an "enter" cue in the ink.

The stage SHALL show the selected country's:

- accent glow;
- coordinates, with hemisphere letters in the active language, in the caption at the foot of the stage.

The globe SHALL turn to face the selected country.

#### Scenario: Hover selects
- **WHEN** Mexico is selected and the user hovers the Thailand row
- **THEN** Thailand's name turns to the full-contrast ink and its number to amber, Mexico's name returns to the muted ink, the caption's coordinates read "15.0° N · 101.0° E", and the globe turns to Thailand

#### Scenario: Focus selects
- **WHEN** the user tabs onto the United States link
- **THEN** the United States becomes selected exactly as on hover

#### Scenario: Coordinates follow the language
- **WHEN** Mexico is selected and the language is Spanish
- **THEN** the coordinates read "23.6° N · 102.5° O", and in English they read "23.6° N · 102.5° W"

#### Scenario: Quiet stage
- **WHEN** any country is selected
- **THEN** the stage shows no ISO-code watermark, no background dot texture and no coordinates in its top corner

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
- captioned with the fighter's name, above the country's coordinates.

Changing the selection SHALL crossfade the portraits. A country's portrait image SHALL NOT be requested before that country is selected for the first time.

#### Scenario: Portrait follows the selection
- **WHEN** the selection moves from Mexico to Thailand
- **THEN** Canelo Álvarez's portrait fades out, Saenchai's fades in once loaded, and the caption reads "Saenchai" above "15.0° N · 101.0° E"

#### Scenario: Unselected portraits are not downloaded
- **WHEN** the landing has just loaded with Mexico selected and nothing else has been selected yet
- **THEN** the network shows Mexico's portrait image requested and the Thailand and United States portrait images not requested

#### Scenario: Broken or missing portrait
- **WHEN** the selected country's portrait fails to load, or its registry entry has no `portrait`
- **THEN** the stage shows no portrait, no broken-image icon, no empty frame and no fighter name, and the caption shows only the coordinates

### Requirement: Landing follows the theme mode
The landing SHALL take all surface colors from the active theme's surface palette:

- in dark mode it SHALL render a dark stage with light ink;
- in light mode it SHALL render a paper stage with dark ink;
- country accent colors SHALL be the same in both modes.

Toggling the mode SHALL update every part of the landing, including the globe's dots, without navigation. Each part SHALL transition smoothly rather than snapping.

#### Scenario: Toggle to light mode
- **WHEN** the user is on the landing in dark mode and clicks the theme toggle
- **THEN** the stage background, bill text, the spin control's border, site credit and globe dots move to the light palette over a short transition, while each country's dots and the selected bout number keep their accent color

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

### Requirement: Each country row shows its fight count
The landing SHALL load the country summaries (`GET /countries`) when it mounts, reusing a cached summary younger than 30 minutes, and for each registry entry whose summary lists at least one pool fight SHALL show in the row's discipline line, after the discipline, the total number of pool fights while none of them is in the watch history, the number of unwatched pool fights once at least one is, and "Todas vistas" / "All watched" when none is left.

#### Scenario: Fresh visitor
- **WHEN** the watch history is empty, the summary lists Thailand with 20 fight ids, and the language is Spanish
- **THEN** Thailand's discipline line reads "Muay Thai · 20 peleas", and in English "Muay Thai · 20 fights"

#### Scenario: Some fights watched
- **WHEN** 8 of Thailand's 20 fight ids are in the watch history
- **THEN** Thailand's discipline line reads "12 por ver" in Spanish and "12 to watch" in English after the discipline

#### Scenario: Everything watched
- **WHEN** all of Thailand's fight ids are in the watch history
- **THEN** Thailand's discipline line reads "Todas vistas" in Spanish and "All watched" in English after the discipline

#### Scenario: One fight
- **WHEN** a country's summary lists exactly one fight and the history is empty
- **THEN** its discipline line reads "1 pelea" in Spanish and "1 fight" in English after the discipline

#### Scenario: Cold backend
- **WHEN** the backend takes 60 seconds to answer `GET /countries`
- **THEN** the rows render with the discipline alone, and when the summary arrives each count fades in, or appears at once when reduced motion is requested, without changing any row's height

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

### Requirement: Landing text stays legible
The landing SHALL set text smaller than 20 px in the body font and the headline font only at 20 px or larger, give headline-font capitals no more than 0.12 em of letter spacing, exempt only the Combat Atlas wordmark from both rules, and SHALL NOT draw text that carries information in a country's accent color, which is kept for the globe, glow, portrait, walkout and the decorative bout number.

#### Scenario: Spin control label
- **WHEN** the landing renders at any width
- **THEN** "Gira el mundo" is set in the headline font at 20 px or larger with at most 0.12 em letter spacing, is not skewed, and its control is at least 44 px tall

#### Scenario: Small labels
- **WHEN** the landing renders
- **THEN** the discipline lines, the enter cue, the fighter caption, the coordinates and the site credit are set in the body font

#### Scenario: Blue accent
- **WHEN** the United States, whose accent is blue, is selected
- **THEN** its discipline line, its enter cue and the spin control's label, at rest and on hover, are drawn in the theme's ink, and blue appears only on the bout number, the globe, the glow and the portrait

#### Scenario: Name contrast
- **WHEN** the landing renders in dark or in light mode
- **THEN** no country name is drawn as an outline, every unselected name has at least 3:1 contrast against the page (the large-text minimum), the selected name at least 7:1, and every discipline line, enter cue and stage caption at least 4.5:1
