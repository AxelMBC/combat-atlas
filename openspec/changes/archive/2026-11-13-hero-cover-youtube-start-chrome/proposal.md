## Why

YouTube's current embed player draws its own centre play/pause control for ~4 s after every playback start even with `controls: 0` (verified in the running app; no `playerVars` or host variant avoids it), so the hero shows a foreign pause pill on page load and on every fight switch. Covering it with the fight's YouTube thumbnail works but looks bad: Mexico's fights ship no `thumbnail`, so the hero stretches a 480×360 `hqdefault.jpg` to full bleed.

## What Changes

- The hero covers each playback start with an app-owned **fight title card** styled as a boxing fight poster, instead of a thumbnail: presenter line, type ribbon and title tag, the two fighters face to face around `VS` (given names, surname, nickname), the year as an outlined watermark, a halftone texture and a glow in the country's accent colour, and a facts strip (date, venue, division, scheduled rounds) that shows `—` where the fight has no data.
- The card is shown from player creation and from every video switch until 5 s after the first `PLAYING` that follows, then fades into the already-playing video.
- The hero reports `onReady` as soon as the YouTube player is ready, not 4.5 s after `PLAYING`: the title card now does the job that delay did (hiding YouTube's start chrome behind the spinner), so the first load goes spinner → title card → video with no flicker.
- The hero's eyebrow / country / stats headline and its scroll hint hide while the title card is up and fade back in with the video, so they never overlap the card on short screens.
- `MainEvent` gains optional `date`, `scheduledRounds` and `venue.name`; with the existing `organization` they feed the poster and are added to the fight documents directly in the database. Nothing breaks while they are missing.
- A video the player reports as failing lifts the title card at once so YouTube's error message shows, and the play toggle is offered.
- `splitFightersFromTitle` and the fighter-billing derivation, duplicated in `FightCard` and `FightInfoSection`, move to a shared util used by all three consumers.
- The thumbnail cover introduced earlier in this change is removed.

## Capabilities

### New Capabilities

- `hero-title-card`: the fight title card that covers the hero at each playback start: content, styling, timing, animation, input pass-through and the loading-overlay hand-off.

### Modified Capabilities

- `hero-playback-controls`: "No YouTube player chrome in the hero" is satisfied by the title card cover; "Toggle stays visible while not playing by choice" shows the toggle over the title card instead of the poster.

## Out of Scope

- Covering YouTube's control when the user resumes after a pause (a title card after pressing play would read as a failed resume).
- Curated artwork or photos on the card; it is typographic only.
- Showing the result (`decision`) on the card: it would spoil the video.
- Backend schema changes for the new fields.
- Changing the data-loading spinner of `useCountryPageData` or the cold-start hint.
- Seeking, volume or any other hero control.

## Impact

- `src/pages/countries/components/CinematicHero/CinematicHero.tsx`: poster `<img>` replaced by the card; `onReady` moves to the player's `onReady`; `REVEAL_DELAY_MS` goes away.
- New `src/pages/countries/components/CinematicHero/FightTitleCard/`: `FightTitleCard`, `FighterName`, `FightFacts`, `splitFighterName`, `titleCardMotion` (+ types, + tests).
- `src/types/fightEvent.types.ts`: optional `date`, `scheduledRounds`, `venue.name`; `src/types/youtube.types.ts`: `onError` event.
- New `src/utils/fightBilling.ts` (+ test); `FightCard.tsx` and `FightInfoSection.tsx` import it.
- `CountryPage.tsx`: keeps its `Spinner` and 3 s fallback, which now lift at player ready, and passes `isLoaderCovering` (the predicate that shows the `Spinner`) so the hero replays the card's entrance when the spinner lifts.
- No new dependencies: framer-motion and MUI are already used. New i18n keys in both locales: `titleCard.presents`, `titleCard.date`, `titleCard.rounds`, `titleCard.titleFight`.
