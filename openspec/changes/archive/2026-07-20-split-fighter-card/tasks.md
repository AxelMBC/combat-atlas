# split-fighter-card — Tasks

## 1. Pure util (D5)

- [x] 1.1 Add `formatActivePeriod.ts` in the `FighterCard/` folder: `(period, { activeSince, notAvailable }) => string` with the existing three-branch logic
- [x] 1.2 Add `formatActivePeriod.test.ts` covering undefined, open-ended (`"2015-"`), and closed (`"2010-2015"`) periods

## 2. Shared subcomponents (D2–D4)

- [x] 2.1 Add `FighterCardShell.tsx` (+ `FighterCardShell.types.ts`): owns `useScrollFocus`, `interactiveProps`, `cardSx`/`activeStyles` (reusing `cardSurfaceSx`/`cardActiveSx` + `.fighter-portrait img` rules); props `{ disabled, onActivate, layoutSx, children }`, forwards ref to the outer Box
- [x] 2.2 Add `FighterPortrait.tsx` (+ `FighterPortrait.types.ts`): `.fighter-portrait` Box, image with `onError` fallback, gradient scrim, corner/rank/exhausted badges via `overlayPillSx`; props `{ boxer, rankLabel, remaining, disabled, size, emphasis }`
- [x] 2.3 Add `FighterStats.tsx` (+ `FighterStats.types.ts`): builds the `stats` array and renders `size="sm"` grid or `size="lg"` rows via `statLabelSx`/`statValueSx`, calling `formatActivePeriod` with resolved labels; props `{ boxer, size }`

## 3. Variant components + dispatcher (D1, D6)

- [x] 3.1 Add `FighterCardFeature.tsx`: composes Shell (row layout) + Portrait (feature size/emphasis) + inline name/city identity + `FighterStats size="lg"` + profile CTA
- [x] 3.2 Add `FighterCardCompact.tsx`: composes Shell (column layout) + Portrait (compact size/emphasis) + inline name/city identity + `FighterStats size="sm"` + profile CTA
- [x] 3.3 Extract the shared profile-CTA into a small `FighterProfileCta.tsx` (or module-scope element) consumed by both variants
- [x] 3.4 Rewrite `FighterCard/index.tsx` as the `memo` variant dispatcher (default export) switching on `variant`; delete the old monolithic `FighterCard.tsx` body
- [x] 3.5 Confirm `FighterCard.types.ts` (`FighterCardProps`) is unchanged and hoist static `sx` objects to module scope

## 4. Verification

- [x] 4.1 `yarn build`, `yarn lint`, `yarn test:run` (incl. new `formatActivePeriod.test.ts` and untouched `TopFighters.test.ts`), and Prettier check all green
- [x] 4.2 Confirm no `FighterCard/` source file exceeds ~180 lines (largest is FighterPortrait.tsx at 111)
- [ ] 4.3 Click-through at `localhost:5173` in both modes and both variants (feature + compact): keyboard activation, disabled/exhausted card, hover/scroll focus, image fallback — visual parity with pre-refactor _(pending user visual verification — browser automation unavailable this session)_
- [x] 4.4 Run `graphify update .` and stage changes; suggest a single gitmoji commit title to the user (no commit)
