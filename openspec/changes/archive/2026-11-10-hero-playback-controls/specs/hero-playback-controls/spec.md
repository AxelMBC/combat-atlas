## ADDED Requirements

### Requirement: No YouTube player chrome in the hero

The cinematic hero SHALL play its video without YouTube's native player controls, so that no YouTube-rendered play/pause button, progress bar, time display or chapter label appears over the hero.

#### Scenario: Page load with autoplay

- **WHEN** a country page loads and the hero video starts playing automatically
- **THEN** no YouTube control bar, time display, chapter label or centre play/pause button is shown over the video

#### Scenario: Moving the pointer over the hero

- **WHEN** the user moves the pointer over the hero while the video is playing
- **THEN** no YouTube control bar or YouTube centre button appears

### Requirement: Captions are covered outside fullscreen

The cinematic hero SHALL cover the area where YouTube draws closed captions with an opaque bottom scrim whenever the hero is not in fullscreen, regardless of the viewer's YouTube caption preference or the video's default caption track. In fullscreen the scrim is hidden and captions MAY be visible.

#### Scenario: Viewer has captions enabled on YouTube

- **WHEN** the hero plays a video that has a caption track, the viewer's YouTube preference is captions on, and the hero is not in fullscreen
- **THEN** the caption text is covered by the bottom scrim
- **AND** the country title, stats line and scroll hint remain readable above the scrim

#### Scenario: Hero switches to another fight

- **WHEN** the hero loads a different video into the existing player while not in fullscreen
- **THEN** the caption area remains covered for the new video

#### Scenario: Fullscreen

- **WHEN** the hero is in fullscreen
- **THEN** the scrim is not shown and the video is unobstructed

### Requirement: Play/pause toggle hidden during playback

The cinematic hero SHALL provide a single app-owned play/pause toggle in the centre of the hero that is hidden while the video is playing and is revealed only by pointer hover over the centre zone of the hero or by keyboard focus on the toggle.

#### Scenario: Playing with the pointer away from the centre zone

- **WHEN** the video is playing and the pointer is outside the centre zone (or there is no pointer)
- **THEN** the play/pause toggle is not visible

#### Scenario: Hovering the centre zone while playing

- **WHEN** the video is playing and the pointer enters the centre zone of the hero
- **THEN** the toggle becomes visible showing a pause icon with the localized "pause" accessible label
- **AND** it hides again when the pointer leaves the centre zone

#### Scenario: Keyboard focus while playing

- **WHEN** the video is playing and the toggle receives keyboard focus
- **THEN** the toggle is visible with the same focus-visible outline as the other hero controls

#### Scenario: Activating the toggle while playing

- **WHEN** the user activates the toggle while the video is playing
- **THEN** the video pauses

#### Scenario: Touch device

- **WHEN** a touch user taps the centre zone while the video is playing
- **THEN** the video pauses and the toggle becomes visible showing a play icon

### Requirement: Toggle stays visible while not playing by choice

The play/pause toggle SHALL remain visible, showing a play icon with the localized "play" accessible label, whenever the video is paused, has ended, or has not been started because autoplay is not allowed, so that playback can always be resumed without hover.

#### Scenario: Paused

- **WHEN** the video is paused
- **THEN** the toggle is visible with a play icon regardless of pointer position
- **AND** activating it resumes playback and the toggle returns to its hidden-during-playback behaviour

#### Scenario: Autoplay not allowed

- **WHEN** the hero renders with autoplay not allowed and the user has not started playback
- **THEN** the toggle is visible with a play icon over the poster
- **AND** activating it starts playback

#### Scenario: Video ended

- **WHEN** the video reaches its end
- **THEN** the toggle is visible with a play icon

### Requirement: No toggle flash while loading

The play/pause toggle SHALL NOT appear as a result of the player loading or buffering.

#### Scenario: Between player ready and first frame

- **WHEN** autoplay is allowed and the player has become ready but playback has not yet started
- **THEN** the toggle is not shown unless the centre zone is hovered or the toggle is focused

#### Scenario: Buffering mid-playback

- **WHEN** the video buffers during playback
- **THEN** the toggle does not become visible on its own

### Requirement: Mute toggle

The cinematic hero SHALL start muted and SHALL provide an app-owned, always-visible mute/unmute control that turns the hero video's sound on and off.

#### Scenario: Initial state

- **WHEN** the hero video starts playing
- **THEN** it is muted and the mute control shows the muted icon with the localized "unmute" accessible label

#### Scenario: Unmuting

- **WHEN** the user activates the mute control while muted
- **THEN** the video's sound turns on and the control shows the sound-on icon with the localized "mute" accessible label

#### Scenario: Muting again

- **WHEN** the user activates the mute control while sound is on
- **THEN** the video is muted and the control returns to the muted icon

#### Scenario: Mute choice survives a video switch

- **WHEN** the user has unmuted and the hero loads a different video into the existing player
- **THEN** the new video plays with sound on and the control still shows the sound-on icon

#### Scenario: No player yet

- **WHEN** the hero has no video, or playback has not been requested yet
- **THEN** the mute control is not rendered

### Requirement: Bilingual control labels

Every accessible label of the hero playback controls SHALL be provided through the i18n layer in both English and Spanish.

#### Scenario: Labels resolve in the active language

- **WHEN** the active language is English or Spanish
- **THEN** the play, pause, mute and unmute labels resolve to the corresponding localized string
