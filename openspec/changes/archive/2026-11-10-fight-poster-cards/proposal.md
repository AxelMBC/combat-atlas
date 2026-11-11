## Why

The top-fights section ("Peleas Históricas" on Mexico) shows each fight as a small landscape thumbnail with a text panel underneath, so it reads as a video list rather than a fight card, and the YouTube thumbnails it relies on arrive pillarboxed or with channel branding baked in. The section should look like a wall of fight posters: the photo is the card, and the text sits on top of it.

## What Changes

- `FightCard` becomes a poster: a fixed 4:5 portrait card whose image covers the whole card, with a dark scrim and all text (year, fighters, subtitle, "watch fight" cue) overlaid on the image. The separate text panel below the image is removed.
- Fighter names are laid out as a billing block: red-corner name, `VS`, blue-corner name, each on its own line.
- Overlaid text uses fixed light colors and stays readable in both light and dark theme, because it sits on a photo and not on a theme surface.
- All cards in the grid have the same height regardless of name length.
- Mexico gets a curated, locally bundled poster image for each of its top fights, pre-cropped to 4:5, replacing the YouTube thumbnails.
- The top-fight image resolver passed to `useCountryPageData` receives the whole fight record instead of the `thumbnail` string, so a country can key bundled images by `idYt` when the backend sends no `thumbnail`. **BREAKING** for the resolver signature (internal; Thailand is the only caller).
- Thailand's bundled fight images are reviewed at the new ratio and re-cropped where the centered crop loses a fighter.

## Capabilities

### New Capabilities

- `fight-poster-cards`: how a top-fight card is laid out (poster ratio, full-bleed image, overlaid text, legibility, image fallback) and that Mexico's top fights use curated bundled posters.

### Modified Capabilities

- `country-page-data`: adds a requirement on what the top-fight image resolver receives and what happens when it returns nothing. Existing requirements stay true.

## Out of Scope

- The fighter cards (`TopFighters`) and the "now playing" card.
- Curated posters for United States; it keeps the YouTube-thumbnail fallback inside the new layout.
- Backend changes: no new field, no change to what `thumbnail` holds.
- Grid columns, section heading, and what a card does when activated.
- A runtime image pipeline or any new dependency; images are cropped once, by hand, and committed.

## Impact

- `src/pages/countries/components/TopFights/FightCard/FightCard.tsx` — layout rewrite.
- `src/hooks/useCountryPageData.ts`, `useCountryPageData.types.ts`, `useCountryPageData.test.ts` — resolver signature.
- `src/pages/Thailand/Thailand.tsx` — adapts to the new resolver signature; `src/pages/Thailand/resources/fights/*` — possible re-crops.
- `src/pages/Mexico/resources/fights/` (new: images + `index.ts`), `src/pages/Mexico/Mexico.tsx` — passes the resolver.
- `src/pages/_CountryTemplate/CONTRIBUTING.md` — resolver example.
- `src/pages/countries/components/TopFights/TopFights.test.ts` — unchanged assertions must keep passing; new card test added beside `FightCard`.
- No new i18n keys, no new dependencies.
