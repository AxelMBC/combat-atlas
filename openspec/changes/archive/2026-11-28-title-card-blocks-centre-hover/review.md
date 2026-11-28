# Review: title-card-blocks-centre-hover

Snapshot: 384c92bb5d829813c8a1cba9595aca0121bd442a

1. [duplicate] src/pages/countries/components/CinematicHero/CinematicHero.test.tsx:404 — the new describe copies `emitState` line for line from the reveal-indicator describe (line 291), and its `beforeEach`/`afterEach` (409-421) repeat 296-308 · accepted — only test code is duplicated
   Fix: move `emitState` to module scope next to `emit` (line 86) and use it from both describes; optionally share the fake-timer setup.

## Decisions

- Until the first `PLAYING` the YouTube iframe still takes the pointer (`stopYouTubeHoverChrome` only runs on `PLAYING`). With the centre zone now ignoring the pointer, a hover or click in the centre during "Preparando la pelea" on first boot reaches YouTube's surface, as the rest of the hero already did. If manual check 2.2 shows YouTube chrome or a playback toggle there, the matching fix is to set the iframe's pointer-events to none in `onReady`.
