## Context

Country pages replay fights via embedded YouTube content sourced from third-party channels. The `FightInfoSection` "now playing" card already renders the active `MainEvent`, which carries an `idYt` field (the YouTube video id). There is currently no link back to the source video, which risks complaints from channel owners and conflicts with the expectation that embedded YouTube content links to its origin. The card's action panel already hosts the primary "Another fight" CTA (a filled, accent-colored `MotionButton`).

## Goals / Non-Goals

**Goals:**

- Provide a clear, recognizable link from the active fight to its original YouTube video.
- Preserve the existing visual hierarchy: "Another fight" stays the primary action.
- Use correct anchor semantics and accessibility for an external, new-tab navigation.
- Keep all copy bilingual through the existing i18n layer.

**Non-Goals:**

- No attribution affordance on the `CinematicHero` player (explicitly out of scope).
- No backend, type, or data-fetching changes — `idYt` already exists on `MainEvent`.
- No new runtime dependencies.

## Decisions

**1. Placement: secondary button stacked under "Another fight" in the action panel.**
The link concerns the currently playing fight, so by proximity it belongs in the info card. Stacking it beneath the primary CTA keeps it where attention already rests after the video. Alternative considered: an inline text link near the title — rejected as less discoverable for a compliance-motivated affordance.

**2. Styling: YouTube red, not the country accent.**
Per the explicit decision, the button uses YouTube red with the `faYoutube` brand glyph and a trailing external-link cue (`faArrowUpRightFromSquare`). To avoid it reading as a second primary CTA competing with the accent-filled "Another fight", it is kept visually subordinate (smaller weight/size, secondary emphasis) while still using YouTube red for unmistakable source recognition. Alternative considered: accent-outlined with a red glyph — rejected because the compliance/recognition motive favors unambiguous YouTube branding.

**3. Semantics: real anchor, not a click handler.**
Rendered as `<Button component="a" href={...} target="_blank" rel="noopener noreferrer">` so it is genuine navigation — better for accessibility and SEO/attribution intent. An `aria-label` states the destination and that it opens in a new tab.

**4. URL construction.**
`https://www.youtube.com/watch?v=${video.idYt}` built inline from the active `MainEvent`. Only rendered when `!loading && !error && video` (the same guard as the rest of the card body), so a missing fight never produces a broken link.

**5. Copy via i18n.**
New key `mainEvent.watchOnYoutube` (visible label) plus an aria-label key, added to both `locales/en.ts` and `locales/es.ts`. Visible label kept concise ("Ver original en YouTube" / "Watch original on YouTube").

## Risks / Trade-offs

- **YouTube red clashing with per-country themes** → Mitigated by keeping the button secondary in size/weight; red signals "external source", which is acceptable against any accent.
- **Two stacked buttons crowd the action panel on small screens** → Mitigated by the existing column layout and consistent full-width button styling; the secondary button reuses the panel's spacing.
- **Hardcoded `watch?v=` URL shape** → Acceptable; `idYt` is a standard 11-char video id and the canonical watch URL is stable.
