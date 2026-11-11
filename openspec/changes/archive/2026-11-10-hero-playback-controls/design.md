## Context

`CinematicHero.tsx` creates a YouTube IFrame player as a cover-sized background video.

- `playerVars` has `controls: 1` (line 134), so YouTube draws its own chrome (centre play/pause, time, chapter bar) for a few seconds when autoplay starts and again on every pointer move over the iframe.
- `cc_load_policy: 0` (line 133) is not an "off" switch. Only `1` has an effect (force captions on); any other value defers to the viewer's YouTube preference or the video's default track.
- The app's play button renders on `hasVideo && (!playRequested || (playerReady && !playing))` (line 204). Between `onReady` (`playerReady = true`) and the first `PLAYING` state it is briefly true, so the button flashes on load.
- The video starts with `mute: 1` (required for autoplay) and nothing in `src/` calls `unMute`; YouTube's control bar is currently the only way to get sound.
- Pointer events over a cross-origin iframe do not reach the parent document, so hover can only be detected by an element the app places above the iframe.

## Goals / Non-Goals

**Goals:** no YouTube chrome and no captions over the hero; an app-owned play/pause toggle that only shows on centre hover, focus, or when not playing by choice; an app-owned mute toggle; no load flash.

**Non-Goals:** seek bar, volume slider, persisting mute, touching fullscreen or other players.

## Decisions

### 1. `controls: 0` instead of masking YouTube's chrome

Set `controls: 0` and drop `cc_load_policy`. Alternatives that lost:

- A transparent layer over the iframe that swallows hover while keeping `controls: 1`: YouTube shows its chrome on autoplay start without any hover, so the load case is not fixed.
- Keeping the poster over the iframe until the chrome auto-hides: depends on YouTube's internal timing and the chrome returns on the first pointer move.

### 2. Captions are covered by a bottom scrim, not removed through the API

There is no documented player parameter that forces captions off. The first attempt, calling the undocumented `player.unloadModule('captions')` from `onApiChange`, was tried in the running app and did not remove captions, so no caption API code is kept.

### 2b. The scrim

A black bottom scrim (opaque in its lower half, fading to transparent) covers the area where YouTube draws captions; it also gives the "scroll to explore" hint a darker background, and the hint is larger with a pulse. The scrim fades out in fullscreen with the other hero overlays, so captions can be visible in fullscreen.

### 3. Toggle visibility is derived from a `paused` state, not `!playing`

Replace the `playing` boolean's role in visibility with a state that is true only for YouTube `PAUSED` and `ENDED`, and false for `PLAYING` and `BUFFERING`. `UNSTARTED`/`CUED` leave it untouched (false on a fresh player). Then:

- icon and label: play when `!playRequested || paused`, otherwise pause;
- always visible when `!playRequested || paused`;
- otherwise visible only on centre-zone hover or `:focus-visible`.

This removes the load flash because "ready but not yet playing" is no longer a visible state.

### 4. Centre hover zone is an app element; visibility is pure CSS

Render a centred zone `Box` above the iframe (below the chips' `zIndex: 2` is not needed; same layer as the current button) sized responsively (roughly a third of the hero's shorter side, via `sx` breakpoint values) containing the `IconButton`. The button stays mounted whenever `hasVideo`; its opacity is driven in `sx` by the zone's `:hover`, the button's `.Mui-focusVisible`, and a "forced visible" flag — no hover state in React, so pointer movement causes no re-renders. An opacity transition matches the existing 350ms hero fades.

The button remains clickable while transparent. That is what makes touch work: a tap on the centre pauses, which makes the toggle visible for resuming.

Alternative that lost: a full-hero interceptor layer making any click toggle playback. It would steal clicks from the area outside the centre for no stated need.

### 4b. The iframe receives no pointer events

Found in the running app: even with `controls: 0`, YouTube draws its own small centre play/pause button whenever the pointer moves over the iframe. The iframe is therefore styled `pointer-events: none` from the first `PLAYING` state on (not before, so that a refused autoplay can still be started by tapping the player itself, which iOS may require), which is the same as covering it with a fully transparent layer but needs no extra element. The app's centre zone sits above it and is the only place hover is detected, so no "hole" is needed. Consequence: a click outside the app's controls does nothing (it no longer reaches YouTube), and YouTube's own in-player links are not clickable; the original video stays linked from the info card.

### 4c. Play or pause is decided from the player's real state

When the browser refuses autoplay the player stays `UNSTARTED`/`CUED` and `paused` is never set. The toggle handler reads `getPlayerState()` (pause only when playing or buffering, otherwise play), and a check 3 s after `onReady` sets `paused` when the player is still not playing, so the play button becomes visible. `disablekb: 1` turns off YouTube's keyboard shortcuts so mute and captions cannot change behind the app's back.

### 5. Mute is local state mirrored to the player

`muted` React state starts `true`. The mute `IconButton` (styled with `chipSx`, placed directly below the fullscreen button) calls `player.unMute()` / `player.mute()` and flips the state. The YouTube player keeps its mute state across `loadVideoById`, so no re-sync is needed on video switch. The state resets to `true` in the player effect's cleanup, where the player is destroyed. Rendered only when `playerReady`.

### 6. Stay in `CinematicHero.tsx`

The new logic is two pieces of state and two handlers with one consumer; extracting a hook now would be an abstraction without a second user.

## Risks / Trade-offs

- The scrim only hides captions that fall inside it: unusually tall captions can show above it, and captions are visible in fullscreen → covered by a manual check.
- The iframe ignores all pointer input (decision 4b), so YouTube's own overlays (title, "more videos") cannot be clicked or dismissed → accepted; playback is controlled only through the app's toggle.
- When paused, YouTube may draw its own title or "more videos" overlay → out of the app's control; observe in the manual check and decide then whether a follow-up is needed.
- Users lose seeking in the hero → accepted (out of scope); the original video is linked from the info card.
- Browsers can block `unMute()` without a user gesture → it is only ever called from a click handler.

## Open Questions

- none
