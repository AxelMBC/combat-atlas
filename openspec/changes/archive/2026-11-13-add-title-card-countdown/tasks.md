# Show a reveal indicator on the hero's title card: a pulse until playback starts, then a 5 s countdown

## 1. Copy

- [x] 1.1 Add `titleCard.preparing` ("Preparando la pelea" / "Getting the fight ready") and `titleCard.startsIn` ("La pelea empieza en" / "Fight starts in") to `src/i18n/locales/es.ts` and `src/i18n/locales/en.ts`

## 2. Reveal indicator component

- [x] 2.1 Create `CinematicHero/RevealIndicator/CountdownNumber.tsx` + `.types.ts` (`seconds: number`): starts at `seconds`, decrements once per second with `setInterval`, clamps at `1`, clears the interval on unmount
- [x] 2.2 Create `CinematicHero/RevealIndicator/RevealIndicator.tsx` + `.types.ts` (`isCountingDown: boolean`, `countdownMs: number`, `isHidden: boolean`) and `index.tsx`: one label line (`HEADLINE_FONT`, uppercase, `alpha(white, 0.7)`) plus a ~4 px track (`alpha(white, 0.15)`)
  - Waiting face: `titleCard.preparing` and an accent segment sweeping across the track (`translateX` keyframe)
  - Counting face: `titleCard.startsIn` + `CountdownNumber` in `primary.main` (tabular figures, same baseline) and an accent fill `scaleX(0 → 1)` over `countdownMs`, `linear forwards`
- [x] 2.3 Under framer's `useReducedMotion()`, the waiting face pulses opacity only and the fill uses `steps(countdownMs / 1000, end)`
- [x] 2.4 `isHidden` drives `opacity: 0` with the hero's 350 ms ease; the component stays mounted. Entrance via `titleCardEntrance(shouldReduceMotion, { y: 12 }, …)` with a delay just after the card's `FACTS_DELAY_S`
  - Applied by `FightTitleCard` on the footer's wrapper (`FOOTER_DELAY_S = 0.8`), not inside the indicator: framer's inline `opacity` would override the `isHidden` opacity on the same element, and `FACTS_DELAY_S` stays private to the card
- [x] 2.5 Add `RevealIndicator.test.tsx` (fake timers, `LanguageProvider`):
  - waiting face shows the preparing label and no number
  - counting face shows `5`, then `4`…`1` second by second, and stays at `1` past 5 s
  - a language switch re-renders the label without resetting the number
  - `isHidden` sets opacity `0` without unmounting, so the number keeps counting

## 3. Title card footer slot

- [x] 3.1 Add `footer?: ReactNode` to `FightTitleCard.types.ts`
- [x] 3.2 In `FightTitleCard.tsx`, turn the last grid row (the `FightFacts` wrapper) into a stretched column: facts at the top, `footer` pushed to the bottom with `mt: 'auto'`, a minimum gap above it and a tight bottom padding, centred
- [x] 3.3 Extend `FightTitleCard.test.tsx`: the footer node renders after the facts strip, and nothing extra renders when `footer` is omitted

## 4. Hero integration

- [x] 4.1 In `CinematicHero.tsx` add `hasCountdownStarted` state and a `coverPlaybackStart` helper that sets `isStartChromeShowing(true)` and `hasCountdownStarted(false)`; use it at the player `onReady`, the fight-switch effect and the player effect cleanup
- [x] 4.2 Set `hasCountdownStarted(true)` inside `hideStartChromeAfterDelay`, after its existing guard, so the countdown starts with the 5 s hide timer
- [x] 4.3 Pass `<RevealIndicator isCountingDown={hasCountdownStarted} countdownMs={YOUTUBE_START_CHROME_HIDE_MS} isHidden={showsPlayAction} />` as the card's `footer`
- [x] 4.4 Extend `CinematicHero.test.tsx` with a `describe('CinematicHero reveal indicator')`:
  - after ready it shows the preparing label
  - the first `PLAYING` switches it to `5`
  - `BUFFERING` → `PLAYING` inside the window does not reset the number
  - a fight switch brings back the preparing label in the same render
  - a pause hides it (opacity `0`) while the play toggle shows
  - with `autoplayAllowed: false` it is hidden until play is pressed
  - on `onError` it keeps the preparing label while the card fades

## 5. Spec text

- [x] 5.1 Extend the Purpose paragraph of `openspec/specs/hero-title-card/spec.md` to mention the reveal indicator (pulse until the first `PLAYING`, then the 5 s countdown)

## 6. Verification

- [x] 6.1 Run `/axl:verify`
- [x] 6.2 In `yarn dev`, open Mexico with DevTools throttling at "Slow 4G": after the spinner lifts, the card shows the accent pulse with "Preparando la pelea". At the first frame of playback it switches to "La pelea empieza en 5", counts down to 1 with the bar filling, and the card fades as the bar completes
- [x] 6.3 At 1366×650, 900×560 and 390×844: the indicator sits below the facts strip with no overlap and is fully inside the hero
- [x] 6.4 Switch fights while the countdown is running: the new card appears with the pulse in the same frame, and a fresh 5 → 1 runs after the new video starts
- [x] 6.5 With "prefers-reduced-motion: reduce" emulated, press play: the pulse only fades in and out, and the bar advances one step per second with the number
- [x] 6.6 Pause from the hovered toggle during the countdown: the indicator hides and the play icon shows; resume before 5 s: the indicator returns showing the remaining seconds
- [x] 6.7 Toggle light mode with the card up: the labels stay light on black and the accent follows the country
