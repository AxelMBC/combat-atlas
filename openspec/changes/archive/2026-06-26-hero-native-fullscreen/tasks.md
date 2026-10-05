## 1. Orientation lock in the fullscreen hook

- [x] 1.1 Add a feature-detect helper in `useHeroFullscreen.ts` for the Screen Orientation
      lock API (`screen.orientation` with a `lock` method).
- [x] 1.2 On entering fullscreen, await `requestFullscreen()` then attempt
      `screen.orientation.lock('landscape')`, swallowing any rejection with `.catch(() => {})`.
- [x] 1.3 On exiting fullscreen, call `screen.orientation.unlock()` (guarded) before/around
      `exitFullscreen()`.
- [x] 1.4 Release the orientation lock from the `fullscreenchange` sync whenever
      `document.fullscreenElement` becomes null, so `Esc`/gesture exits also unlock.

## 2. Keep the video covering the screen on rotation

- [x] 2.1 In `CinematicHero.tsx`, add a `screen.orientation` `change` listener (guarded) that
      re-runs `sizeIframe`, no-op unless the hero is the current fullscreen element.
- [x] 2.2 Clean up the orientation `change` listener in the effect's teardown alongside the
      existing `resize`/`fullscreenchange` listeners.

## 3. Verification

- [x] 3.1 Run `yarn lint` and `yarn build` (type-check) — no errors.
- [ ] 3.2 Desktop browser: fullscreen still fills the screen; no console errors from a rejected
      orientation lock.
- [ ] 3.3 Mobile (Chrome/Android via device or remote debugging): entering fullscreen rotates
      to landscape and the video fills the screen; rotating keeps it covering; exiting restores
      orientation.
- [ ] 3.4 iOS Safari sanity check: fullscreen control does not throw; behavior degrades
      gracefully.
