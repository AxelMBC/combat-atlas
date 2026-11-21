## MODIFIED Requirements

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
