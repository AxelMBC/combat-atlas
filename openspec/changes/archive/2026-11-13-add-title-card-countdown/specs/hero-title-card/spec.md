## ADDED Requirements

### Requirement: Title card shows the wait until the video shows through

The title card SHALL show a reveal indicator below its facts strip, in the country accent, whenever it covers a playback start and the play toggle is not shown: an indeterminate pulse labelled "Preparando la pelea" / "Getting the fight ready" until the first `PLAYING` of that playback start, then the label "La pelea empieza en" / "Fight starts in" with a whole-second countdown from 5 to 1 and a bar that fills over the same 5 seconds and completes as the card starts to fade.

#### Scenario: Waiting for playback

- **WHEN** the card covers a playback start and the player has not reported `PLAYING` yet, because the YouTube API is loading, the player is booting or the video is buffering
- **THEN** the indicator pulses with the preparing label and shows no number

#### Scenario: Countdown

- **WHEN** the player reports the first `PLAYING` for the current video
- **THEN** the indicator shows the starts-in label with `5`, steps down one number per second to `1`, and its bar fills over those 5 seconds
- **AND** the bar is full when the card starts to fade

#### Scenario: Buffering stutter

- **WHEN** the player reports `BUFFERING` then `PLAYING` again inside the 5-second window
- **THEN** the countdown and the bar continue where they were and do not restart

#### Scenario: Fight switch

- **WHEN** another fight is loaded into the existing player
- **THEN** the indicator shows the pulse again in the same frame the new card appears
- **AND** a new countdown starts at the new video's first `PLAYING`

#### Scenario: Card lifts

- **WHEN** the card fades out, after the countdown, on a video error or on the 8-second fallback
- **THEN** the indicator fades out with it over the same 350 ms, keeping the state it had

#### Scenario: Play toggle shown

- **WHEN** the play toggle is shown over the card, because reduced motion is preferred and playback has not started, autoplay was refused or playback is paused
- **THEN** the indicator is hidden
- **AND** if playback resumes before the card lifts, the indicator comes back showing the time actually left until the card fades

#### Scenario: Short hero and phone width

- **WHEN** the hero is short (for example a 1366×650 or 900×560 viewport) or phone-width
- **THEN** the indicator sits below the facts strip, never overlaps it, and stays inside the hero

#### Scenario: Light theme mode

- **WHEN** the site is in light mode
- **THEN** the indicator's labels stay light on the card's black base

#### Scenario: Entrance

- **WHEN** the card plays its entrance
- **THEN** the indicator rises in after the facts strip, and only fades in when reduced motion is preferred

#### Scenario: Reduced motion after the user starts playback

- **WHEN** reduced motion is preferred and the user has pressed play, so the card covers the playback start
- **THEN** the waiting pulse changes opacity only, with no sweeping movement
- **AND** the countdown bar advances in one step per second instead of filling continuously

#### Scenario: Language switch

- **WHEN** the active language changes while the indicator is visible
- **THEN** its label re-renders in the new language without restarting the countdown

#### Scenario: Screen reader

- **WHEN** a screen reader reads the hero
- **THEN** the indicator is not announced, like the rest of the title card
