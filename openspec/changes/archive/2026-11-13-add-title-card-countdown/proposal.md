## Why

After the title card's ~1.4 s entrance nothing on the hero moves for at least 5 s, and longer when YouTube is slow: the loading spinner lifts at 3 s at the latest, and the card can then sit over a player that is still booting until the 8 s fallback. A still poster with no sign of progress reads as a stuck page, so visitors scroll away before the fight ever shows.

## What Changes

- The title card gains a **reveal indicator** below its facts strip that makes the wait visible and honest about what is known:
  - **Waiting** (player loading, booting or buffering, until the first `PLAYING`): an indeterminate pulse in the country accent with "Preparando la pelea" / "Getting the fight ready". The duration is unknown, so no number is shown.
  - **Counting** (from the first `PLAYING` until the card lifts, exactly the hero's 5 s window): "La pelea empieza en" / "Fight starts in" with a whole-second countdown 5 → 1 and an accent bar that fills over the same 5 s and completes as the card starts to fade.
- The indicator is hidden while the play toggle is shown over the card (reduced motion before playback, autoplay refused, paused), because the toggle is then the cue.
- The indicator fades out together with the card, joins the card's entrance motion, and only fades/steps under reduced motion.
- `FightTitleCard` takes an optional `footer` slot so the hero can place the indicator in the card's layout flow without the card knowing about playback.
- The hero tracks whether the first `PLAYING` of the current playback start has arrived, next to the existing `isStartChromeShowing` flag, and resets both together.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `hero-title-card`: adds the reveal indicator requirement; every existing requirement (timing, content, style, entrance, input pass-through, loading hand-off) stays true.

## Out of Scope

- Shortening the 5 s window or changing when the card appears or lifts.
- The country page's fullscreen `Spinner`, its 3 s fallback, or the cold-start hint.
- Real buffering progress (`getVideoLoadedFraction`): the time until the first `PLAYING` is not knowable, which is why the waiting phase is indeterminate.
- Any indicator when the user resumes after a pause (no title card covers a resume).
- Announcing the indicator to assistive technology: it lives on the `aria-hidden` card, and the play toggle stays the accessible control.

## Impact

- `src/pages/countries/components/CinematicHero/CinematicHero.tsx`: new `hasCountdownStarted` state set on the first `PLAYING` and reset wherever the cover is shown again; passes the indicator to the card's `footer`.
- `src/pages/countries/components/CinematicHero/FightTitleCard/FightTitleCard.tsx` + `.types.ts`: optional `footer?: ReactNode` rendered at the bottom of the card's last grid row, below `FightFacts`.
- New `src/pages/countries/components/CinematicHero/RevealIndicator/` (`RevealIndicator.tsx`, `CountdownNumber.tsx`, their `.types.ts`, `index.tsx`, tests).
- `src/i18n/locales/{es,en}.ts`: `titleCard.preparing`, `titleCard.startsIn`.
- `openspec/specs/hero-title-card/spec.md`: Purpose paragraph mentions the indicator.
- No new dependencies (MUI `sx` keyframes, framer-motion already in use).
