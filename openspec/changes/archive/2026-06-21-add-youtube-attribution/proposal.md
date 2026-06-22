## Why

Country pages embed and replay fights sourced from third-party YouTube channels, but they currently offer no path back to the original video. Adding a clear "watch on YouTube" link gives proper attribution to channel owners, reduces the risk of complaints or takedowns, and respects YouTube's expectation that embedded content links back to its source.

## What Changes

- Add a YouTube attribution button to the "now playing" card (`FightInfoSection`) that links to the original video at `https://www.youtube.com/watch?v=<idYt>`.
- The button is styled in **YouTube red** with the YouTube glyph and an external-link cue, rendered as a real anchor that opens in a new tab.
- The button is positioned as a **secondary** action beneath the existing "Another fight" primary CTA, preserving visual hierarchy.
- Add `mainEvent.watchOnYoutube` (and any aria-label key) to **both** `locales/en.ts` and `locales/es.ts`.
- The button is **not** added to the `CinematicHero` player overlay — scope is limited to the info card.

## Capabilities

### New Capabilities

- `youtube-attribution`: Presenting an accessible, recognizable link from the currently playing fight back to its original YouTube video for attribution and compliance.

### Modified Capabilities

<!-- None — no existing spec-level behavior changes. -->

## Impact

- **Code**: `src/pages/countries/components/FightInfoSection/FightInfoSection.tsx` (new button in the action panel). No changes to data fetching or types — `idYt` already exists on `MainEvent`.
- **i18n**: New keys in `src/i18n/locales/en.ts` and `src/i18n/locales/es.ts`.
- **Dependencies**: Uses the existing FontAwesome stack (`faYoutube` brand icon, external-link icon). No new dependencies, no backend changes.
