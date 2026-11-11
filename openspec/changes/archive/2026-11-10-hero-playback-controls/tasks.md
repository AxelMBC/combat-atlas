# Hide YouTube chrome and captions in the hero; add hover play/pause and mute controls

## 1. Types and copy

- [x] 1.1 In `src/types/youtube.types.ts`, add `mute`, `unMute` and `unloadModule: (module: string) => void` to `YTPlayer`, and `onApiChange?: (event: YTPlayerEvent) => void` to `YTPlayerOptions.events`
- [x] 1.2 Add `hero.pause`, `hero.mute`, `hero.unmute` to `src/i18n/locales/es.ts` ("Pausar", "Silenciar", "Activar sonido") and `src/i18n/locales/en.ts` ("Pause", "Mute", "Unmute")

## 2. Player configuration

- [x] 2.1 In `CinematicHero.tsx` `playerVars`, set `controls: 0` and remove `cc_load_policy`
- [x] 2.2 Add an `onApiChange` event handler that calls `unloadModule('captions')` on the player, guarded so a missing method cannot throw

## 3. Play/pause toggle

- [x] 3.1 Replace the `playing` state with a `paused` state set to true on `PAUSED`/`ENDED` and false on `PLAYING`/`BUFFERING`; reset it in the player effect cleanup
- [x] 3.2 Turn `handlePlay` into a toggle: request playback if not requested, `playVideo()` if paused, otherwise `pauseVideo()`
- [x] 3.3 Render a centred hover zone `Box` containing the `IconButton`, mounted whenever `hasVideo`; icon and `aria-label` switch between `faPlay`/`hero.play` and `faPause`/`hero.pause`
- [x] 3.4 Drive the button's opacity in `sx`: 1 when `!playRequested || paused`, otherwise 0 except on zone `:hover` and button `.Mui-focusVisible`; add an opacity transition

## 4. Mute toggle

- [x] 4.1 Add `muted` state (initial `true`, reset in the player effect cleanup) and a handler that calls `unMute()`/`mute()` and flips it
- [x] 4.2 Render a mute `IconButton` with `chipSx` below the fullscreen button, only when `playerReady`, with `faVolumeXmark`/`hero.unmute` when muted and `faVolumeHigh`/`hero.mute` when not

## 5. Verification

- [ ] 5.1 Run `/axl:verify`
- [ ] 5.2 Load `/mexico` with autoplay: no YouTube control bar, time/chapter label, centre YouTube button or app play button appears at any point during load
- [ ] 5.3 With YouTube captions enabled in your account, play a hero video that has captions for 30+ seconds, then press "Another fight": no caption text appears for either video
- [ ] 5.4 Move the pointer around the hero edges while playing: nothing appears; move it into the centre: the pause button fades in, and fades out on leaving
- [ ] 5.5 Click pause: the play button stays visible with the pointer anywhere; note whether YouTube draws its own title or "more videos" overlay while paused; click play: playback resumes and the button hides
- [ ] 5.6 Tab to the play/pause toggle while playing: it becomes visible with the white focus outline; Enter toggles playback
- [ ] 5.7 Click the mute button: sound turns on and the icon changes; press "Another fight": the next video plays with sound and the icon is unchanged; click again: muted
- [ ] 5.8 In a narrow/touch viewport (devtools device mode), tap the centre while playing: the video pauses and the play button shows; tap again: it resumes
- [ ] 5.9 Enter fullscreen: the play/pause hover behaviour and mute button still work

## 6. Follow-up from review and manual testing

- [x] 6.1 Review finding 1: decide play/pause from `getPlayerState()` and show the play button when the 8 s fallback fires with the ready player still not playing
- [x] 6.2 Review finding 2: add `disablekb: 1` to `playerVars`
- [x] 6.3 Style the iframe `pointer-events: none` so YouTube never sees pointer movement and cannot draw its own centre button
- [ ] 6.4 Move the pointer anywhere over the hero outside the centre while playing: no small YouTube pause button appears; in the centre only the app's button shows
- [ ] 6.5 With autoplay blocked by the browser, the play button appears about 3 s after the player is ready and clicking it starts the video
- [x] 6.6 Captions still showed: `hideCaptions` also clears the caption track with `setOption` and runs on every `PLAYING` state
- [x] 6.7 Add a black bottom scrim (hidden in fullscreen) that covers the caption area, and make the scroll hint larger with a pulse
- [ ] 6.8 Play a captioned hero video: no caption text is readable outside fullscreen; note whether captions appear in fullscreen; the country title, stats line and scroll hint stay readable over the scrim
- [x] 6.9 Review finding 3: block pointer events on the iframe only from the first `PLAYING` state
- [x] 6.10 Review finding 4: run the refused-autoplay check 3 s after `onReady` instead of in the 8 s reveal fallback
- [ ] 6.11 On a real iPhone in Low Power Mode, the hero video can be started (app play button or tapping the video)
- [x] 6.12 Remove the caption API code that did not work (`hideCaptions`, `onApiChange`, the `unloadModule`/`setOption`/`onApiChange` types from 1.1, 2.2 and 6.6); the scrim is the only caption measure
- [x] 6.13 Remove the code comments added by this change; name the behaviour instead (`stopYouTubeHoverChrome`, `HOVER_CAPABLE_POINTER`)
