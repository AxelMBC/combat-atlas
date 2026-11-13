## MODIFIED Requirements

### Requirement: No YouTube player chrome in the hero

The cinematic hero SHALL play its video without YouTube's native player controls, and SHALL keep the fight title card over the player from every playback start (player creation and every video switch) until YouTube's own start-of-playback controls have auto-hidden, so that no YouTube-rendered play/pause button, progress bar, time display or chapter label appears over the hero.

#### Scenario: Page load with autoplay

- **WHEN** a country page loads and the hero video starts playing automatically
- **THEN** the title card covers the player while YouTube draws its start-of-playback centre control
- **AND** the title card fades out into the already playing video once that control has auto-hidden
- **AND** no YouTube control bar, time display, chapter label or centre play/pause button is ever visible over the hero

#### Scenario: Switching to another fight

- **WHEN** the hero loads a different video into the existing player
- **THEN** the new fight's title card covers the player immediately
- **AND** it fades out into the playing video once YouTube's start-of-playback control has auto-hidden

#### Scenario: Autoplay refused

- **WHEN** the browser refuses autoplay and the player stays unstarted
- **THEN** the title card stays over the player without blocking taps on it
- **AND** the app's play toggle is shown over the title card

#### Scenario: Moving the pointer over the hero

- **WHEN** the user moves the pointer over the hero while the video is playing
- **THEN** no YouTube control bar or YouTube centre button appears

#### Scenario: Resuming after a pause

- **WHEN** the user resumes playback with the app's toggle
- **THEN** the video is not covered by the title card
- **AND** YouTube's centre control MAY be visible for a few seconds until it auto-hides

### Requirement: Toggle stays visible while not playing by choice

The play/pause toggle SHALL remain visible, showing a play icon with the localized "play" accessible label, whenever the video is paused, has ended, or has not been started because autoplay is not allowed, so that playback can always be resumed without hover.

#### Scenario: Paused

- **WHEN** the video is paused
- **THEN** the toggle is visible with a play icon regardless of pointer position
- **AND** activating it resumes playback and the toggle returns to its hidden-during-playback behaviour

#### Scenario: Autoplay not allowed

- **WHEN** the hero renders with autoplay not allowed and the user has not started playback
- **THEN** the toggle is visible with a play icon over the title card
- **AND** activating it starts playback

#### Scenario: Video ended

- **WHEN** the video reaches its end
- **THEN** the toggle is visible with a play icon
