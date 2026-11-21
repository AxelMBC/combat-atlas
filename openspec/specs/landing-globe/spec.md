# landing-globe

## Purpose

Behind the landing's bill, a halftone globe drawn on a 2D canvas gives the countries their geography: land is a field of shaded dots, each registered country's land is drawn in its accent color, and the globe turns to the selected country, tours the countries when idle, can be dragged, and lets a pointer select or enter a country on it. It schedules no animation frames once settled, and the landing keeps working when no canvas is available.

## Requirements

### Requirement: Globe draws the world as halftone dots
The landing SHALL draw an orthographic globe whose land is a field of dots. Dot size and opacity SHALL fall off from the globe's centre toward its edge. Every land dot of a registered country SHALL use that country's accent color, and the selected country's dots SHALL be larger and brighter than the other countries'. Land outside registered countries SHALL use the theme's ink color.

#### Scenario: Registered countries light up
- **WHEN** Mexico is selected and the globe faces the Americas
- **THEN** Mexico's land is drawn in red dots that are larger and brighter, the United States' land in blue dots, and the rest of the land in ink-colored dots

#### Scenario: Halftone shading
- **WHEN** the globe is at rest
- **THEN** dots near the centre of the disc are visibly larger and more opaque than dots near its edge

#### Scenario: New country needs no new globe data
- **WHEN** a country is added to the registry with a valid ISO 3166-1 alpha-2 `isoCode`, its `center` and its `accentColor`
- **THEN** its land lights up on the globe in its accent color without regenerating the globe data

### Requirement: Globe turns to the selected country
When the selected country changes, the globe SHALL rotate along the shorter way around, easing in and out, until the country's `center` faces the viewer, tilting toward the country's latitude by at most 30°. While that centre is on the visible hemisphere, it SHALL be marked by a pulsing ring in the accent color.

#### Scenario: Shorter way around
- **WHEN** the selection moves from Mexico to Thailand
- **THEN** the globe turns westward across the Pacific rather than eastward across the Atlantic, and settles with Thailand centred

#### Scenario: Ring hides on the far side
- **WHEN** the user drags the globe until the selected country's centre is on the far hemisphere
- **THEN** the ring is not shown until the centre comes back into view

#### Scenario: Reduced motion
- **WHEN** reduced motion is requested and the selection changes
- **THEN** the globe jumps to face the country without animation and the ring is shown without pulsing

### Requirement: Globe tours the countries when idle
While nobody interacts with the landing, the globe SHALL select the next registered country, in registry order and wrapping around, every 4.5 seconds. Pointer activity over the bill or the globe, keyboard focus inside the landing, or a drag SHALL pause the tour, which SHALL resume 4.5 seconds after the activity ends. A touch or pen press on the bill or the globe SHALL stop the tour for the rest of the visit, so a country selected by a tap stays selected for the tap that enters it. The tour SHALL NOT run while the page is hidden or while reduced motion is requested.

#### Scenario: Idle tour
- **WHEN** the landing has loaded with Mexico selected and the user does nothing
- **THEN** Thailand is selected after about 4.5 s and the United States about 4.5 s after that, then Mexico again

#### Scenario: Interaction pauses the tour
- **WHEN** the user rests the pointer over the bill
- **THEN** the selection stays on the hovered country for as long as the pointer stays, and the tour resumes 4.5 s after the pointer leaves

#### Scenario: A tap stops the tour
- **WHEN** the user taps the Thailand row on a touch screen and then waits 10 s
- **THEN** Thailand is still selected, and a tap on it enters Thailand

#### Scenario: Hidden tab
- **WHEN** the tab is in the background
- **THEN** the selection does not change until the tab is visible again

### Requirement: Globe can be dragged
Dragging horizontally on the globe SHALL rotate it with the pointer and let it coast to a stop after release. Vertical touch movement on the globe SHALL keep scrolling the page.

#### Scenario: Drag and coast
- **WHEN** the user drags the globe sideways and lets go mid-motion
- **THEN** the globe follows the pointer during the drag and keeps turning briefly after release, slowing to a stop

#### Scenario: Vertical swipe on a phone
- **WHEN** the user swipes vertically starting on the globe on a touch screen
- **THEN** the page scrolls and the globe does not rotate

### Requirement: Countries on the globe can be pointed at and entered
Hovering a registered country's dots with a mouse SHALL select that country and show a pointer cursor. A mouse click on those dots, or a tap on the dots of the selected country, that does not move more than a few pixels SHALL enter that country exactly as activating its link does; a tap on the dots of a country that is not selected SHALL only select it.

#### Scenario: Hover on the globe
- **WHEN** the user moves the mouse over the United States' dots
- **THEN** the cursor becomes a pointer and the United States is selected

#### Scenario: Click on the globe
- **WHEN** the user clicks Mexico's dots with the mouse without dragging
- **THEN** the walkout plays and the app navigates to `/mexico`

#### Scenario: First tap on the globe selects
- **WHEN** the United States is selected and the user taps Mexico's dots without dragging
- **THEN** Mexico becomes selected, the globe turns to it, and no navigation happens

#### Scenario: Tap on the selected country enters
- **WHEN** Mexico is selected and the user taps Mexico's dots without dragging
- **THEN** the walkout plays and the app navigates to `/mexico`

#### Scenario: A drag is not a tap
- **WHEN** a drag starts on Mexico's dots and ends elsewhere
- **THEN** the globe rotates and no navigation happens

### Requirement: Globe costs nothing when settled
The globe SHALL stop scheduling animation frames once its rotation has settled and nothing is moving or fading. While idle, only compositor-driven CSS animations SHALL run, such as the pulsing ring.

#### Scenario: Idle between tour steps
- **WHEN** a selection transition has settled and the next tour step has not started
- **THEN** a performance recording shows no animation-frame callbacks from the landing during that interval

#### Scenario: Theme toggle
- **WHEN** the theme is toggled while the globe is settled
- **THEN** the globe animates its dot colors to the new palette and stops scheduling frames once the transition ends

### Requirement: Landing works without a canvas
If a 2D canvas context cannot be obtained, the landing SHALL render without the globe and every other part of it SHALL keep working.

#### Scenario: No canvas support
- **WHEN** the landing renders where `getContext('2d')` returns `null`
- **THEN** no error is thrown, the globe area is empty, and the country links, selection, walkout and spin control all work
