# Refine the landing: solid names, a readable discipline line, a legible spin control and a quieter stage

## 1. Bill rows

- [x] 1.1 In `src/pages/Landing/FightCardBilling/BillingRow.tsx`, make the name a solid fill (design decision 1):
  - `textPrimary` when selected, `textMuted` otherwise.
  - Remove `WebkitTextStroke`, the `&::after` offset outline, `data-label` and `NAME_OFFSET_OUTLINE`.
  - Set `lineHeight` to 1.
- [x] 1.2 Replace the ribbon with the discipline line under the name (design decision 2):
  - Remove `RIBBON_SKEW`, `RIBBON_TEXT_UNSKEW`, the border, the background, the stars and `getContrastText`.
  - Style: `BODY_FONT`, 0.95rem, no text transform, normal letter spacing, `textSecondary`.
  - Content: `{discipline}`, then a reduced-opacity ` · ` and the count segment in weight 700 (`textPrimary` when selected, `textSecondary` otherwise), keeping the existing fade-in and `reduceMotion` handling.
  - The line stays `aria-hidden`.
- [x] 1.3 Make the bout number a solid numeral:
  - Anton 1.25rem, letter spacing 0.05em, no text stroke.
  - Accent when selected, `textMuted` otherwise.
  - Aligned to the top of the name's capitals.
- [x] 1.4 Restyle the enter cue:
  - `BODY_FONT` 1rem, no uppercase, normal letter spacing.
  - Label and arrow in `textPrimary` on hover-capable devices.
  - On touch: the label at 0.8rem, and the arrow `textPrimary` when selected and `textMuted` otherwise.
  - No accent color.
- [x] 1.5 Drop constants and imports left unused (`OUTLINE_OPACITY`, `alpha` if unused); `npx tsc -b --noEmit` passes.

## 2. Spin control

- [x] 2.1 In `src/pages/Landing/SpinControl/SpinControl.tsx` (design decision 5):
  - Remove `CONTROL_SKEW` and `CONTROL_LABEL_UNSKEW`.
  - Size: Anton 1.25rem on every breakpoint, letter spacing 0.1em, `minHeight: 52`, `px: 3`, icon gap 1.5.
  - Hover: border to `textPrimary` and background to a 6% ink fill, with the text color unchanged.
  - Keep the 38% border, the disabled state and the accent focus outline.

## 3. Stage

- [x] 3.1 In `src/pages/Landing/LandingStage/LandingStage.tsx`:
  - Delete the ISO watermark `MotionBox`, the dot-texture box and the top-right coordinates `Typography`.
  - Delete their constants (`WATERMARK_*`, `TEXTURE_*`, `EASE_OUT_EXPO`, `MotionBox`) and the `motion` import if unused.
  - Pass the formatted `coordinates` to `StagePortrait`.
- [x] 3.2 Add `coordinates: string` to `StagePortraitProps` in `src/pages/Landing/StagePortrait/StagePortrait.types.ts`. In `StagePortrait.tsx`, render one caption block at the foot of the stage (design decision 6):
  - The fighter's name, only while the selected portrait is shown: `BODY_FONT` 0.95rem, `textSecondary`.
  - Above the coordinates, always shown, in their own element: `BODY_FONT` italic 0.85rem, `textSecondary`.
  - No uppercase or wide tracking.

## 4. Site credit

- [x] 4.1 In `src/components/SiteCredit/SiteCredit.tsx`, switch to `BODY_FONT` 0.8rem with no text transform and normal letter spacing; keep the colors and hover behaviour.

## 5. Tests

- [x] 5.1 In `src/pages/Landing/Landing.test.tsx`, change the ribbon assertions to the discipline line: `'Muay Thai'` before the summary and `'Muay Thai · 20 peleas'` after it. Assert that no country link's text contains `★`.
- [x] 5.2 Add a test: after the selected portrait's `<img>` fires `error`, the fighter's name is not rendered and the coordinates (`'23.6° N · 102.5° O'`) still are. Add another: with Mexico's portrait loaded, the caption shows "Canelo Álvarez" and the coordinates.
- [x] 5.3 Confirm the existing coordinate, hover, focus, spin and accessible-name tests pass unchanged; `yarn test:run src/pages/Landing` is green.

## 6. Docs

- [x] 6.1 In `CLAUDE.md`, change the Landing paragraph's "each row's ribbon shows that country's fight count" to the discipline line under the name.
- [x] 6.2 In `openspec/specs/landing-fight-card/spec.md`, change the Purpose's "the selected country's fighter portrait, ISO watermark, glow and coordinates fill the stage" to "the selected country's fighter portrait, glow and coordinates fill the stage". The delta cannot carry the Purpose.

## 7. Verification

- [x] 7.1 Run `/axl:verify`.
- [x] 7.2 At 1914×912 in dark mode with Mexico selected:
  - No outlined text in the bill.
  - "MÉXICO" is solid white with nothing over its É, and "Boxeo · 22 por ver" (or the current count) sits under it with the count in bold white.
  - "TAILANDIA" and "ESTADOS UNIDOS" are solid grey with readable lines under them.
  - The stage shows no "MX" watermark lines and no coordinates top-right.
  - The caption reads "Canelo Álvarez" above "23.6° N · 102.5° O".
- [x] 7.3 Hover the United States row:
  - Its number turns blue.
  - Its name, discipline line and "Entrar →" are white or grey, not blue.
  - Hovering "Gira el mundo" turns its border white with a faint fill and keeps the text white.
- [x] 7.4 "Gira el mundo" reads at a glance from arm's length, in larger Anton with tight spacing, not skewed, about 52 px tall. Activating it still spins and enters a country.
- [x] 7.5 DevTools device mode at 390×844 with counts shown: the eyebrow, the globe, the three rows with their lines and "Gira el mundo" are visible without scrolling. At 1366×600 no name overflows and every link and the spin control can be reached.
- [x] 7.6 Toggle light mode on the landing:
  - Names go black and grey and the lines dark grey, over a smooth transition.
  - The selected number keeps its accent.
  - With the DevTools contrast picker, the caption over the portrait and the unselected discipline lines show at least 4.5:1.
- [x] 7.7 In DevTools, block the request for Mexico's portrait and reload `/`: no portrait or broken image, and the caption shows only the coordinates.
- [x] 7.8 Open `/mexico`: the footer credit reads "por Axel Barraza" in Merriweather, and nothing else on the country page changed.
