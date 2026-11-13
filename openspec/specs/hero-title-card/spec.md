# hero-title-card

## Purpose

The fight title card that covers the country page's cinematic hero at every playback start, so YouTube's own start-of-playback controls are never seen. It covers what the card shows (a boxing fight poster built only from the fight's data, with `—` for missing facts), how it looks and moves (country accent, black base, entrance motion that respects reduced motion), when it appears and lifts (player creation, fight switches, the 5-second window after the first `PLAYING`, video errors and a player that never becomes ready), how its reveal indicator shows the wait (a pulse until the first `PLAYING`, then the 5-second countdown to the reveal), how the hero's headline and scroll hint yield to it, and how the loading spinner hands over to it at player ready.

## Requirements

### Requirement: Title card covers every playback start

The cinematic hero SHALL render a fight title card over the player from the moment the player is created and from the moment a different video is loaded, and SHALL keep it fully opaque until 5 seconds after the first `PLAYING` state that follows, then fade it out over the hero's standard 350 ms so the already playing video shows through. If the player reports an error for that video instead, the card SHALL fade out at once and the play toggle SHALL be shown.

#### Scenario: First load

- **WHEN** the hero creates the player for the current fight
- **THEN** the title card is fully visible before and while the player boots and during the first 5 seconds of playback
- **AND** it then fades out into the playing video

#### Scenario: Fight switch

- **WHEN** the hero loads another fight into the existing player
- **THEN** the new fight's title card appears at full opacity in the same frame, with no fade-in from the previous video
- **AND** any pending fade-out from the previous fight is cancelled
- **AND** the card fades out 5 seconds after the new video's first `PLAYING`

#### Scenario: Buffering stutter

- **WHEN** the player reports `BUFFERING` then `PLAYING` again inside the 5-second window
- **THEN** the fade-out happens once, 5 seconds after the first `PLAYING`, and is not extended or repeated

#### Scenario: Reduced motion

- **WHEN** the user prefers reduced motion and autoplay is therefore not requested
- **THEN** the title card stays visible with the play toggle over it until the user starts playback

#### Scenario: Video fails to play

- **WHEN** the player reports an error for the current video (removed, private or not embeddable), on first load or after a fight switch
- **THEN** the title card fades out so the player's own error message is visible
- **AND** the play toggle is shown with its play icon

### Requirement: Hero headline and scroll hint yield to the title card

The cinematic hero SHALL hide its eyebrow, country name, stats line and scroll hint in the same frame the title card appears, and SHALL fade them back in over the hero's standard 350 ms when the card fades out, so the card never shares the screen with them at any hero height. While hidden, the scroll hint SHALL be out of the tab order and hidden from assistive technology.

#### Scenario: Short hero

- **WHEN** the hero is short (for example a 1366×650 or 900×560 viewport) and the title card is up
- **THEN** only the title card is visible in the hero, with no overlap with the headline or the scroll hint

#### Scenario: Card lifts

- **WHEN** the title card fades out into the playing video
- **THEN** the eyebrow, country name, stats line and scroll hint fade in over the video

#### Scenario: Fight switch

- **WHEN** another fight is loaded and its title card appears
- **THEN** the headline and the scroll hint are hidden again until that card lifts

#### Scenario: Playback not started

- **WHEN** reduced motion is preferred or autoplay is refused and the title card stays up
- **THEN** the headline and the scroll hint stay hidden until the user starts playback and the card lifts

### Requirement: Title card is a fight poster built from the fight data

The title card SHALL show, from the current fight's data only:

- a presenter line ("Combat Atlas presenta" / "Combat Atlas presents");
- a ribbon with the fight type (or the first localized tag) and, when the fight has an `organization`, a localized title tag ("Título WBC" / "WBC title");
- a face-off of the two fighters around the localized `VS`, each fighter split into given names, surname and a quoted nickname taken from the name;
- when the fighters cannot be derived, the fight title billed as a single name with no `VS`;
- the fight's year as an outlined watermark behind everything;
- a facts strip with four labelled slots: date, venue, localized division and scheduled rounds.

Free-standing elements (ribbon, title tag, nickname, given names, watermark) SHALL be omitted when their data is missing. Fact slots SHALL always render, with an em dash (`—`) in a muted colour when their value is missing, so the strip keeps its rhythm.

#### Scenario: Matchup with full data

- **WHEN** the fight has two fighters (from `fighterRed`/`fighterBlue` or an `A vs B` title), a type, an organization, a `date`, a `venue` with a name and city, a division and `scheduledRounds`
- **THEN** the card shows the presenter line, the type ribbon and title tag, both fighters around `VS`, the year watermark, and the date, venue name with its city below, division and rounds in the facts strip

#### Scenario: Nickname in the name

- **WHEN** a fighter's name contains a quoted nickname, such as `Danny 'Little Red' Lopez`
- **THEN** the card bills `Danny` as the given name, `Lopez` as the surname and “Little Red” as the nickname

#### Scenario: Title that is not a matchup

- **WHEN** the fighters cannot be derived from the fight, as for a sparring video titled with one fighter's name
- **THEN** the title is billed as a single, larger name with no `VS`

#### Scenario: Sparring with partial data

- **WHEN** the fight has a year and a location but no `date`, division or `scheduledRounds`
- **THEN** the date slot shows the year, the venue slot shows the city, and the division and rounds slots show `—`

#### Scenario: Nothing known for a slot

- **WHEN** the fight has neither a `date` nor a year, or neither a venue nor a location
- **THEN** that slot shows `—`

#### Scenario: Unparseable date

- **WHEN** the fight's `date` is not a valid date
- **THEN** the date slot falls back to the year

#### Scenario: Language switch

- **WHEN** the active language changes while the card is visible
- **THEN** the presenter line, slot labels, title tag, division text and date format (`21 jun 1980` / `Jun 21, 1980`) re-render in the new language

#### Scenario: Same derivation as the fight cards

- **WHEN** a fight is shown on the title card and on a fight card or the fight info section
- **THEN** the billing names are identical, because all three derive them through the same shared helper

### Requirement: Title card follows the Combat Atlas style and the country accent

The title card SHALL use a black base with a radial glow and the type ribbon in the active country theme's primary colour, a halftone dot texture, the headline font for the ribbon, given names, surnames, `VS` and fact values, the body font in italics for the presenter line, nicknames and venue city, and fixed light text that does not change with the theme mode, so every country gets its own accent without per-country code. The two surnames and the `VS` SHALL sit on one shared line, whichever fighter has a given name or nickname.

#### Scenario: Mexico

- **WHEN** the Mexico hero shows a title card
- **THEN** the glow, ribbon, `VS` and nicknames use Mexico's red and the names are light on black

#### Scenario: Another country

- **WHEN** a country page with a different `colorPalette.primary` shows a title card
- **THEN** the accent follows that country's primary colour with no change to the card component

#### Scenario: Light theme mode

- **WHEN** the site is in light mode
- **THEN** the card's base is still black and its text still light

#### Scenario: Only one fighter has a nickname

- **WHEN** one fighter has a nickname and the other does not
- **THEN** both surnames and the `VS` still sit on the same line

#### Scenario: Phone width

- **WHEN** the hero is phone-width
- **THEN** the fighters stack above and below the `VS` and the facts strip becomes two columns by two rows

#### Scenario: Long names and venues

- **WHEN** a surname or venue name does not fit its column
- **THEN** it wraps inside the card and nothing overflows the hero

### Requirement: Title card enters with motion that respects preferences

The title card SHALL animate in when it becomes visible for a fight: the fighters slide in from opposite sides, the `VS` lands from a larger scale, the ribbon drops in, the fact slots rise in sequence and the watermark settles. It SHALL replay the entrance when the fight changes and when the country page's loading overlay lifts, so the first-load entrance is not spent behind the overlay, and SHALL NOT replay it at any other moment. When the user prefers reduced motion, every element SHALL only fade in.

#### Scenario: Default motion

- **WHEN** the card appears for a fight and reduced motion is not preferred
- **THEN** the fighters, `VS`, ribbon, fact slots and watermark animate into place

#### Scenario: First load

- **WHEN** the loading overlay lifts, at player ready or on the country page's own 3-second fallback
- **THEN** the card's entrance plays in view

#### Scenario: Player ready after the overlay lifted

- **WHEN** the player becomes ready after the loading overlay has already lifted, because the boot was slow or because reduced motion showed no overlay and the user pressed play
- **THEN** the card stays as it is and its entrance does not replay

#### Scenario: Reduced motion

- **WHEN** reduced motion is preferred
- **THEN** the card content fades in without movement or scaling

### Requirement: Title card never intercepts input

The title card SHALL ignore pointer events, SHALL sit below the hero's play/pause toggle and chips, and SHALL be hidden from assistive technology, because the same fight details are exposed in the fight info section.

#### Scenario: Autoplay refused on a touch device

- **WHEN** autoplay is refused and the user taps the centre of the hero
- **THEN** the tap reaches the player or the app's play toggle, never the card

#### Scenario: Screen reader

- **WHEN** a screen reader reads the hero
- **THEN** the title card text is not announced

### Requirement: Loading overlay lifts when the player is ready

The hero SHALL report `onReady` as soon as the YouTube player is ready, and the country page's loading overlay SHALL therefore lift at that moment, handing over to the title card; the hero's 8-second fallback report SHALL remain for a player that never becomes ready, and SHALL then also lift the title card so the headline and scroll hint return. A player that becomes ready after that fallback SHALL be covered by the title card again for its first playback start.

#### Scenario: Normal first load

- **WHEN** the player becomes ready before the country page's own 3-second fallback
- **THEN** the spinner lifts at that moment and the title card is what the user sees until the video shows through

#### Scenario: Player never ready

- **WHEN** the YouTube API fails to produce a ready player
- **THEN** the hero still reports ready after 8 seconds and the title card lifts
- **AND** the eyebrow, country name, stats line and scroll hint are shown and the scroll hint can be focused and clicked

#### Scenario: Player ready after the fallback

- **WHEN** the player becomes ready after the 8-second fallback lifted the title card
- **THEN** the title card covers the player again until 5 seconds after its first `PLAYING`

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
