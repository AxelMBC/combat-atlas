## Why

The landing reads as cluttered and hard to scan. Seven elements share the same 1 px outline treatment, so nothing leads the eye. The unselected country names are 1 px hairlines at 3.3:1. The discipline ribbon is 11.5 px Anton and the accent of "É" overlaps it. "Gira el mundo" and the other small labels are condensed Anton at 10–15 px with 0.2–0.35 em tracking. Information text in the accent color fails contrast on some countries (blue enter cue 2.85:1, white on the red ribbon 3.98:1). The globe, the accent-tinted fighter portrait and the spin feature stay. The noise around them goes, and every label becomes readable.

## What Changes

- Country names are solid fills with no outlines. The selected name uses full ink, the others the muted ink (4.5:1 dark, 3.3:1 light, both above the 3:1 large-text minimum). The accent offset outline over the selected name is removed.
- The skewed, starred ribbon becomes a plain line under the name in the body font, sentence case: "Boxeo · **22 por ver**". It shows on every row in the secondary ink (7:1 dark, 6:1 light), with the count in bold, and in full ink on the selected row.
- The bout numbers become small solid numerals. The selected one takes the accent color.
- One type rule for the landing: Anton only at 20 px or larger, apart from the Combat Atlas wordmark, and at most 0.12 em tracking on Anton caps. Everything smaller is Merriweather, which is already loaded. This moves the enter cue, the fighter caption, the coordinates and the site credit to Merriweather.
- Text that carries information never takes the accent color. The accent stays on the globe, glow, portrait, walkout and the decorative bout number.
- "Gira el mundo" becomes Anton at 1.25rem with 0.1 em tracking, 52 px tall, outlined and no longer skewed. Its hover inks the border instead of turning the text into the accent.
- The stage loses the outlined ISO-code watermark and the background dot texture. The coordinates move from the top-right corner into the fighter caption, under the name.
- The site credit ("por Axel Barraza") switches to Merriweather everywhere it appears, including country pages.

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `landing-fight-card`:
  - New requirement for the type and accent rule.
  - "Pointing at or focusing a country selects it": new active treatment, no watermark, coordinates in the caption.
  - "Each country row shows its fight count": the discipline line replaces the ribbon.
  - "Every registered country is a link on the landing": no stars, so the accessible-name wording changes.
  - "One activation enters a country": the wipe is no longer described as matching the ribbons.
  - "Selected country shows its fighter portrait": the caption carries the coordinates.
  - "Landing follows the theme mode": what keeps the accent color.

## Out of Scope

- The theme and language toggles in the app shell (`App.tsx`), which are global; a separate `/axl:tweak`.
- Focus-outline colors, which stay in the accent.
- The site credit's colors: only its font changes.
- The Combat Atlas wordmark and tagline.
- The globe's drawing, the walkout wipe and the portrait's duotone treatment.
- Country pages, except the shared site credit.

## Impact

- Changed:
  - `src/pages/Landing/FightCardBilling/BillingRow.tsx`
  - `src/pages/Landing/SpinControl/SpinControl.tsx`
  - `src/pages/Landing/LandingStage/LandingStage.tsx`
  - `src/pages/Landing/StagePortrait/StagePortrait.tsx` and `StagePortrait.types.ts`
  - `src/components/SiteCredit/SiteCredit.tsx`
  - `src/pages/Landing/Landing.test.tsx`
  - `CLAUDE.md`
  - the Purpose paragraph of `openspec/specs/landing-fight-card/spec.md`
- The site credit restyle also shows on every country page footer (`CountryPage.tsx`).
- No new dependency, font, request or locale key.
- Fewer layers on the stage: the watermark no longer remounts with a scale animation on every tour step.
