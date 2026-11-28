## MODIFIED Requirements

### Requirement: Play/pause toggle hidden during playback

The cinematic hero SHALL provide a single app-owned play/pause toggle in the centre of the hero that is hidden while the video is playing and is revealed only by pointer hover over the centre zone of the hero or by keyboard focus on the toggle. While the title card covers a playback start and the toggle is not showing its play icon, the centre zone SHALL ignore the pointer, so hovering, clicking or tapping it neither reveals the toggle nor pauses the video.

#### Scenario: Playing with the pointer away from the centre zone

- **WHEN** the video is playing and the pointer is outside the centre zone (or there is no pointer)
- **THEN** the play/pause toggle is not visible

#### Scenario: Hovering the centre zone while playing

- **WHEN** the video is playing, the title card has lifted and the pointer enters the centre zone of the hero
- **THEN** the toggle becomes visible showing a pause icon with the localized "pause" accessible label
- **AND** it hides again when the pointer leaves the centre zone

#### Scenario: Hovering the centre zone while the title card is up

- **WHEN** the title card covers the player boot or the countdown and the pointer enters, clicks or taps the centre zone
- **THEN** the toggle stays hidden and playback continues
- **AND** once the card has lifted, hovering the centre zone reveals the toggle again

#### Scenario: Keyboard focus while playing

- **WHEN** the video is playing and the toggle receives keyboard focus
- **THEN** the toggle is visible with the same focus-visible outline as the other hero controls

#### Scenario: Activating the toggle while playing

- **WHEN** the user activates the toggle while the video is playing
- **THEN** the video pauses

#### Scenario: Touch device

- **WHEN** a touch user taps the centre zone while the video is playing and the title card has lifted
- **THEN** the video pauses and the toggle becomes visible showing a play icon
