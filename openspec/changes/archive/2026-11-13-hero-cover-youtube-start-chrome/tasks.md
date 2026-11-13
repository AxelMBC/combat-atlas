# Cover YouTube's start-of-playback control with a fight title card and lift the spinner at player ready

## 1. Shared billing helper

- [x] 1.1 Create `src/utils/fightBilling.ts` with `splitFightersFromTitle` and `getFightBilling(video: MainEvent)`; add `fightBilling.test.ts` covering red/blue fighters, `A vs B` title, `A vs. B` title and a non-matchup title
- [x] 1.2 Replace the local copies in `FightCard.tsx` and `FightInfoSection.tsx` with the helper; existing tests stay green

## 2. Title card component

- [x] 2.1 Add `CinematicHero/FightTitleCard/FightTitleCard.types.ts` (`video: MainEvent`) and `FightTitleCard.tsx`: eyebrow (`video.type` or first localized tag), billing block (names / localized `VS` / names, or the title), metadata line (`year`, `location`, localized division joined by ` · `), each part omitted when missing
- [x] 2.2 Style per design decision 4: black base, light text, `HEADLINE_FONT`/`BODY_FONT`, `primary.main` on `VS` and the accent rule, `pointer-events: none`, `aria-hidden`
- [x] 2.3 Entrance with `motion.div` keyed by `video.idYt`, fade + 12 px rise, no rise under `useReducedMotion()`
- [x] 2.4 Add `FightTitleCard.test.tsx`: renders billing from fighters, from a `vs` title, falls back to the title, omits missing metadata, and switches `VS`/division text with the language

## 3. Hero integration

- [x] 3.1 In `CinematicHero.tsx` replace the poster `<img>` with `FightTitleCard` inside a wrapper driven by the existing `isStartChromeShowing` flag: `opacity: 1` / `transition: none` while showing, `opacity: 0` / 350 ms ease when hiding; keep the wrapper below the toggle zone
- [x] 3.2 Remove `posterUrl`/`showPoster` and the `!playerReady` term; the card alone covers the player before ready and during the 5 s window
- [x] 3.3 Call `reveal()` from the player's `onReady` handler; delete `REVEAL_DELAY_MS` and the `revealTimer`; keep `REVEAL_FALLBACK_MS`

## 4. Fight-poster redesign

- [x] 4.1 Add optional `date`, `scheduledRounds` and `venue.name` to `MainEvent`/`FightVenue`
- [x] 4.2 Move the card to `CinematicHero/FightTitleCard/`; add `splitFighterName` (+ test) for given name / quoted nickname / surname
- [x] 4.3 `FighterName`: subgrid over shared given / surname / nickname rows, left / right / solo layouts
- [x] 4.4 `FightFacts`: date / venue / division / rounds slots with `—` fallback, localized date via `Intl.DateTimeFormat`
- [x] 4.5 `FightTitleCard`: glow, halftone, year watermark, presenter line, type ribbon and title tag, face-off with misprint `VS`, facts strip; i18n keys in both locales
- [x] 4.6 `titleCardEntrance` motion (slide / slam / rise, fade-only under reduced motion); card keyed by `isLoaderCovering` (passed by `CountryPage`) so the first-load entrance plays when the spinner lifts and never replays later
- [x] 4.7 Card above the hero gradients; scroll hint hidden with the headline while the card is up (+ test)
- [x] 4.8 Rewrite `FightTitleCard.test.tsx` for the poster content, fallbacks and language switch

## 5. Verification

- [x] 5.1 Run `/axl:verify`
- [x] 5.2 In the running app (Chrome), load `/mexico` and pick another fight from a card without moving the mouse: at every moment YouTube's small centre pause pill is visible, the title card is at full opacity; the card shows the two fighters face to face, `VS` in Mexico red, and the facts strip; it fades into the running video ~5 s after playback starts
- [x] 5.3 First load: the spinner lifts while the title card is on screen, with no thumbnail flash between spinner and video
- [x] 5.4 With autoplay refused (Chrome `--autoplay-policy=user-gesture-required`): the card stays, the play toggle sits over the `VS` line, pressing it starts the video and the card fades out ~5 s later
- [x] 5.5 Short viewports (1366×650, 900×560): while the title card is up the COMBAT ATLAS / MÉXICO / stats block and the scroll hint are hidden and nothing overlaps; they fade in with the video
- [x] 5.6 Poster with real data at desktop and phone width: names aligned on the `VS` line, ribbon, watermark, facts strip with `—` for missing rounds; switch to EN and back
