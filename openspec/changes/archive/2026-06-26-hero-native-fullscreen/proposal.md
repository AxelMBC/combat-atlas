## Why

The cinematic hero's fullscreen button currently expands the hero `<section>` to the
viewport but does not deliver a true "YouTube-like" fullscreen experience: on mobile the
video stays in the phone's portrait orientation, so the player shows as a small letterboxed
strip instead of filling the screen in landscape. Users expect the same behavior as a normal
YouTube video — fullscreen that fills the screen and follows the phone's rotation into
landscape.

## What Changes

- When the user enters fullscreen on the hero, lock the screen to **landscape** orientation
  on devices/browsers that support the Screen Orientation API (mobile), matching native
  YouTube behavior.
- Allow the phone's physical rotation to drive orientation while in fullscreen (landscape),
  and release the lock when exiting fullscreen so the page returns to its normal orientation.
- Keep the existing desktop behavior (fullscreen fills the screen) and gracefully no-op the
  orientation lock where it is unsupported (desktop browsers, iOS Safari) without throwing.
- Ensure the video iframe continues to cover the full screen in the new orientation (the
  existing `sizeIframe` cover-sizing must re-run on orientation change).

## Capabilities

### New Capabilities

- `hero-fullscreen`: Behavior of the cinematic hero fullscreen control — entering/exiting
  native fullscreen, mobile landscape orientation locking, rotation handling, and graceful
  degradation on unsupported platforms.

### Modified Capabilities

<!-- None: no existing spec governs hero fullscreen behavior. -->

## Impact

- `src/pages/countries/components/CinematicHero/useHeroFullscreen.ts` — add orientation
  lock/unlock around fullscreen enter/exit.
- `src/pages/countries/components/CinematicHero/CinematicHero.tsx` — re-run iframe
  cover-sizing on orientation change.
- No new dependencies; uses the native Screen Orientation API. No backend or API impact.
