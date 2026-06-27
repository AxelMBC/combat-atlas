## ADDED Requirements

### Requirement: Native fullscreen toggle

The cinematic hero SHALL provide a control that enters and exits the browser's native
fullscreen mode for the hero container, so the video fills the entire screen as it does on a
normal YouTube video.

#### Scenario: Entering fullscreen

- **WHEN** the user activates the fullscreen control while not in fullscreen
- **THEN** the hero container enters native fullscreen and the video iframe is cover-sized to
  fill the screen with no letterboxing bars

#### Scenario: Exiting fullscreen

- **WHEN** the user activates the fullscreen control while in fullscreen (or presses the
  browser's exit-fullscreen gesture, e.g. `Esc`)
- **THEN** native fullscreen is exited and the hero returns to its normal in-page layout

### Requirement: Mobile landscape orientation in fullscreen

On devices that support the Screen Orientation API, the hero SHALL lock the screen to
landscape orientation when entering fullscreen and SHALL release that lock when exiting
fullscreen, matching native YouTube behavior.

#### Scenario: Entering fullscreen on a phone held in portrait

- **WHEN** a mobile user enters hero fullscreen while holding the phone in portrait
- **THEN** the screen rotates to landscape and the video fills the screen in landscape

#### Scenario: Rotating the device while in fullscreen

- **WHEN** the user physically rotates the phone while the hero is in fullscreen landscape
- **THEN** the video remains filling the screen and re-sizes to cover the new dimensions
  without leaving black gaps

#### Scenario: Exiting fullscreen restores orientation

- **WHEN** the user exits hero fullscreen
- **THEN** the orientation lock is released and the page returns to the device's normal
  orientation behavior

### Requirement: Graceful degradation on unsupported platforms

The hero fullscreen control SHALL function without throwing on platforms that do not support
fullscreen and/or the Screen Orientation API (e.g. desktop browsers, iOS Safari).

#### Scenario: Orientation lock unsupported

- **WHEN** the user enters fullscreen on a platform where orientation locking is unsupported
  or rejected
- **THEN** fullscreen still works and the unsupported orientation lock is ignored without
  surfacing an error to the user

#### Scenario: Fullscreen unsupported

- **WHEN** the platform does not support the fullscreen API
- **THEN** the control fails silently and the hero remains in its normal in-page layout
