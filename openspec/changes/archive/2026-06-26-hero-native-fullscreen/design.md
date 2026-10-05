## Context

The hero already requests native fullscreen on the container element via
`useHeroFullscreen` (`src/pages/countries/components/CinematicHero/useHeroFullscreen.ts`),
and `CinematicHero.tsx` cover-sizes the YouTube iframe via `sizeIframe`, re-running it on
`window` `resize` and `document` `fullscreenchange`. What is missing is mobile orientation
handling: on a phone, native fullscreen keeps the page in portrait, so the 16:9 video shows
as a small letterboxed band instead of filling the screen like YouTube does.

Native YouTube uses the **Screen Orientation API** (`screen.orientation.lock('landscape')`)
on entering fullscreen and `screen.orientation.unlock()` on exit. This API requires an active
fullscreen context and is only available on a subset of platforms (Chrome/Android yes; desktop
typically rejects; iOS Safari does not implement it).

## Goals / Non-Goals

**Goals:**

- Lock to landscape when entering hero fullscreen on supporting devices, and unlock on exit.
- Let physical rotation continue to drive the orientation while fullscreen, with the video
  re-covering the screen on each orientation change.
- Preserve existing desktop fullscreen behavior.
- Never throw or surface errors where the API is unsupported or rejected.

**Non-Goals:**

- A custom JS/CSS "fake fullscreen" fallback for iOS Safari (out of scope; iOS keeps current
  behavior — the user can rotate the device manually).
- Changing the fullscreen control's icon/placement or any other hero UI.
- Forcing the whole app/page into landscape outside of fullscreen.

## Decisions

**Use the Screen Orientation API, scoped to fullscreen.**
On enter, call `requestFullscreen()` first, then attempt
`screen.orientation.lock('landscape')` once fullscreen resolves. On exit, call
`screen.orientation.unlock()` then `exitFullscreen()`. Rationale: orientation lock only
succeeds inside a fullscreen context, so sequencing matters. Alternative considered: a CSS
`transform: rotate(90deg)` portrait hack — rejected because it breaks pointer/scroll
coordinates and the YouTube controls, and is exactly the kind of brittle hack the native API
replaces.

**Keep the logic inside `useHeroFullscreen`.**
The hook already owns enter/exit and the `fullscreenchange` listener that syncs `isFullscreen`.
Add the lock/unlock there so the orientation lifecycle is bound to the same fullscreen
transitions. The hook is the single source of truth; `CinematicHero` stays declarative.

**Feature-detect and swallow failures.**
Guard with `typeof screen !== 'undefined' && screen.orientation && 'lock' in screen.orientation`
and wrap calls in promise `.catch(() => {})` / try-catch. `lock()` returns a promise that
rejects on unsupported/denied; that rejection is benign and must be ignored. This satisfies the
"graceful degradation" requirement.

**Re-cover the iframe on orientation change.**
`sizeIframe` already re-runs on `resize` and `fullscreenchange`. Add a listener on
`screen.orientation` `change` (and/or rely on the `resize` that orientation changes fire) so the
iframe re-covers the new landscape dimensions with no black gaps. The existing
`window.addEventListener('resize', sizeIframe)` covers most browsers; add the orientation
`change` listener as a belt-and-suspenders for browsers that fire it without a `resize`.

## Risks / Trade-offs

- **iOS Safari has no orientation lock** → No code change can force it; iOS keeps current
  behavior (manual rotation). Documented as a Non-Goal; degradation is silent.
- **`lock()` rejects on desktop** → Wrapped in `.catch`; desktop fullscreen is unaffected.
- **Lock not released on unexpected exit (e.g. `Esc`)** → Drive unlock from the
  `fullscreenchange` sync (when `document.fullscreenElement` becomes null) rather than only
  from the toggle handler, so every exit path releases the lock.
- **Orientation change while not fullscreen** → Listener should no-op unless the hero is the
  fullscreen element, avoiding unintended resizes of the in-page hero.
