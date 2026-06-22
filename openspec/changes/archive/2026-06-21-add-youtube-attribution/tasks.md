## 1. i18n

- [x] 1.1 Add `mainEvent.watchOnYoutube` visible-label key to `src/i18n/locales/en.ts` ("Watch original on YouTube") and `es.ts` ("Ver original en YouTube")
- [x] 1.2 Add an aria-label key (e.g. `mainEvent.watchOnYoutubeAria`) to both locales, stating the destination is YouTube and opens in a new tab, with a `{title}` param
- [x] 1.3 Confirm the new keys are present in the `TranslationKey` union / typed dictionary

## 2. Attribution button

- [x] 2.1 Import YouTube glyph (inline zero-dep SVG; `free-brands` not installed) and `faArrowUpRightFromSquare` external-link icon in `FightInfoSection.tsx`
- [x] 2.2 Build the original-video URL inline as `https://www.youtube.com/watch?v=${video.idYt}` within the `!loading && !error && video` block
- [x] 2.3 Add a `Button` rendered as an anchor (`component="a"`, `href`, `target="_blank"`, `rel="noopener noreferrer"`) stacked beneath the existing "Another fight" CTA in the action panel
- [x] 2.4 Style the button in YouTube red with the YouTube glyph (leading) and external-link cue (trailing), kept visually subordinate to the primary CTA
- [x] 2.5 Wire the visible label to `t('mainEvent.watchOnYoutube')` and set `aria-label` via the aria key with the fight title param

## 3. Verification

- [x] 3.1 Verify the hero `CinematicHero` player is unchanged (no attribution control added there)
- [x] 3.2 Manually verify the link opens the correct original video in a new tab for a sample fight, in both es and en
- [x] 3.3 Run `yarn lint` and `yarn build` (type-check) clean
