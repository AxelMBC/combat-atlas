# On touch screens, the first tap on a country selects it and a tap on the selected country enters

## 1. Implementation

- [x] 1.1 Bill rows: a touch or pen `pointerdown` prefetches and records whether the row was already selected, without selecting it. The click that follows a tap on a row that was not selected only selects it and prevents navigation, also under reduced motion. A tap on the selected row, a mouse click and Enter keep entering as before.
- [x] 1.2 Globe: a non-mouse tap on the dots of a registered country that is not selected reports it through `onPointCountry` (select) instead of `onEnterCountry`.
- [x] 1.3 Enter cue: under `(hover: none)`, the selected row also shows the "Entrar" label, stacked over its arrow so the name keeps its width. Arrows stay on every row.
- [x] 1.4 `Landing.test.tsx`: a touch tap on an unselected row selects it and stays on `/`; a second tap on it plays the walkout and navigates.
- [x] 1.5 Tour: a touch or pen press on the bill or the globe stops the idle tour for the rest of the visit, so a tapped country stays selected for the tap that enters it (review #1; landing-globe "Globe tours the countries when idle").
- [x] 1.6 Enter cue: on touch rows that are not selected, the "Entrar" label is hidden with `visibility` instead of removed, so every row keeps the same columns (review #2).
- [x] 1.7 `Landing.test.tsx`: a tapped country stays selected past two tour steps; a first tap under reduced motion only selects; a touch press followed by Enter enters (review #1, #3).

## 2. Verification

- [x] 2.1 Run `/axl:verify`
- [x] 2.2 At 390×844 with touch emulation: tap the Thailand row → Thailand is selected (globe turns, portrait and coordinates change) and the app stays on `/`; tap it again → walkout and `/thailand`. Tap a lit country on the globe → it is selected; tap it again → it opens.
