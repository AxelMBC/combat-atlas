# Turn top-fight cards into full-bleed posters with curated Mexico images

## 1. Resolver receives the fight

- [x] 1.1 In `src/hooks/useCountryPageData.types.ts`, change `resolveTopFightThumbnail` to `(fight: MainEvent) => string | undefined`
- [x] 1.2 In `src/hooks/useCountryPageData.ts`, call the resolver for every top fight and set `thumbnail` to its result, so `undefined` clears a backend key that has no bundled image
- [x] 1.3 Update `src/hooks/useCountryPageData.test.ts`: existing resolver test adapted to the new signature; add cases for a fight without `thumbnail` resolved by `idYt`, and for a resolver returning `undefined`
- [x] 1.4 Make `getTopFightImage` in `src/pages/Thailand/resources/fights/index.ts` a `(fight) => string | undefined` lookup by `fight.thumbnail` that returns `undefined` when the fight has no `thumbnail` or the key is not bundled, and pass it from `src/pages/Thailand/Thailand.tsx`
- [x] 1.5 Update the resolver example in `src/pages/_CountryTemplate/CONTRIBUTING.md`

## 2. Poster card

- [x] 2.1 Rewrite the layout in `FightCard.tsx`: root `aspectRatio: '4 / 5'` and `position: 'relative'`; image absolutely filling the root; remove the 180px image strip and the text panel below it
- [x] 2.2 Add the scrim layer (fixed black gradient, heaviest over the bottom ~55%) between image and content
- [x] 2.3 Overlay the content: year top-left (only when present); bottom block with the billing `h3` (fighter / `VS` / fighter on three lines, or the title when fighters are unknown), subtitle (only when present), and the `fightCard.watchFight` cue
- [x] 2.4 Use fixed light text colors on the overlay (`common.white`, alpha white for the subtitle, `primary.light` for `VS` and the cue); clamp each name to two lines with `overflowWrap: 'anywhere'`
- [x] 2.5 Keep `role`, `tabIndex`, click and key handlers, `useScrollFocus`, the focus outline, the `.fightCardImg` active treatment, and the `onError` / `onLoad` image fallbacks working in the new structure
- [x] 2.6 Add `FightCard.test.ts` beside the component: billing block renders both fighters and `VS`; title is shown when fighters cannot be derived; no year or subtitle element when the data is absent; Enter and Space call `onVideoSelect`; image error swaps to the placeholder
- [x] 2.7 Confirm `TopFights.test.ts` passes unchanged

## 3. Mexico posters

- [x] 3.1 Get the `idYt`, title and year of every fight in Mexico's `topEvents` from the running app (network response for the Mexico country request)
- [x] 3.2 For each fight, find an image following the source order in `design.md` §5; download into the scratchpad, not the repo
- [x] 3.3 Crop each to 4:5 with both fighters in frame and no bars, logos or broadcast graphics; export WebP at 1000×1250 (smaller if the source cannot support it), about 150 KB or less; save as `src/pages/Mexico/resources/fights/<matchup_slug>.webp`
- [x] 3.4 Create `src/pages/Mexico/resources/fights/index.ts` exporting `getTopFightPoster(fight)`: lookup by `idYt`, `undefined` on a miss
- [x] 3.5 Pass `resolveTopFightThumbnail: getTopFightPoster` in `src/pages/Mexico/Mexico.tsx`
- [x] 3.6 List, for each Mexico image, the source URL and which source tier it came from, in the apply summary

## 4. Thailand crops

- [x] 4.1 View each Thailand top-fight card at the new ratio; for any image where the centered crop loses a fighter, replace the file with a 4:5 re-crop of the same image (same file name and import)

## 5. Verification

- [x] 5.1 Run `/axl:verify`
- [x] 5.2 Open `/mexico` at desktop width in dark theme: the section shows a 3-column grid of equal-height portrait posters, each with a bundled image covering the whole card, year top-left, and fighter / VS / fighter, subtitle and "Ver Pelea →" readable over the lower part of the image
- [x] 5.3 Switch to light theme: overlaid text is still light on the darkened photo
- [x] 5.4 Hover a card: it lifts, the image brightens and zooms slightly, the text stays readable; click it: the fight loads and the page scrolls to the player
- [x] 5.5 Tab to a card: focus outline is visible; Enter and Space select the fight
- [x] 5.6 Resize through 600–900px (two columns) and to 375px (one column): cards stay 4:5, the Márquez vs Barrera names do not overflow the card
- [x] 5.7 On a touch device or emulation, scroll the section: the centered card takes the active treatment
- [x] 5.8 Open `/thailand`: every poster shows both fighters; open `/united-states`: YouTube thumbnails fill the cards with no bars or empty area
- [x] 5.9 Block one Mexico image request in devtools: that card shows the no-video placeholder full-bleed with its text
