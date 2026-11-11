## Why

When a country page loads, the cinematic hero shows YouTube's own player chrome (centre play/pause button, time and chapter bar) and closed captions on top of the background video, because the player is created with `controls: 1` and `cc_load_policy: 0` does not turn captions off. The app's own play button also flashes between player-ready and first frame.

## What Changes

- The hero player is created without YouTube's native controls (`controls: 0`), so no YouTube chrome appears on load or on mouse movement.
- Outside fullscreen, closed captions are covered by a black bottom scrim, regardless of the viewer's YouTube caption preference or the video's default track. The scroll hint over it is larger and animated.
- The app's play button becomes a play/pause toggle that is hidden during playback and revealed only by hovering the centre zone of the hero, by keyboard focus, or while the video is not playing by the user's choice (paused, ended, or autoplay not allowed).
- The play button no longer flashes while the player is loading or buffering.
- A new app-owned mute/unmute button is added to the hero, since removing YouTube's controls removes the only way to turn sound on.
- New bilingual labels: `hero.pause`, `hero.mute`, `hero.unmute`.

## Capabilities

### New Capabilities

- `hero-playback-controls`: which playback controls the cinematic hero shows, when they are visible, that YouTube's chrome is suppressed, and that captions are covered outside fullscreen.

### Modified Capabilities

- None.

## Out of Scope

- A progress/seek bar for the hero. Losing YouTube's seek bar is accepted.
- Volume level control (only mute/unmute).
- Remembering the mute choice across page loads.
- Changes to the fullscreen control (`hero-fullscreen`) or the attribution link (`youtube-attribution`).
- Any other YouTube player in the app (`FightCard`, `VideoPreview`).

## Impact

- `src/pages/countries/components/CinematicHero/CinematicHero.tsx` — player vars, state derivation, play/pause toggle, hover zone, mute button.
- `src/types/youtube.types.ts` — `YTPlayer` gains `mute` and `unMute`.
- `src/i18n/locales/en.ts`, `src/i18n/locales/es.ts` — three new keys each.
- No new dependencies. `faPause`, `faVolumeXmark` and `faVolumeHigh` come from the already-installed `@fortawesome/free-solid-svg-icons`.
