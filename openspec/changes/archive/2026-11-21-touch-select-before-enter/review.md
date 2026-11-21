# Review: touch-select-before-enter

Snapshot: 6031fd4211b0125b4d932870918bcccdbadd750e

Scope: the diff since 9d0097d691bab6297d7ff8820ade6084a072ad14, the tree reviewed in
`archive/2026-11-21-world-fight-card-landing/review.md`.

1. [defect] src/pages/Landing/Landing.tsx:68 — After a touch user selects a country, the idle tour moves the selection on 4.5 s later. A second tap on the same country then only selects it again, with no walkout. · fixed
   Why: a touch `pointerleave` follows `pointerup` (useCountryTour.ts:45). On the globe, and on rows in iOS Safari, nothing takes focus. The tour then runs again on the new `selectedSlug` (useCountryTour.ts:35-39). Android Chrome focuses the tapped link, so rows there stay paused. Open finding 3 of the landing review would bring the bug to Android rows too.
   Fix: hold the tour while a touch or pen selection is in effect, until the next tap outside the bill and globe or until the user leaves the page. For example, `useCountryTour` could return a `holdTour()` for the preview branch of `handleActivate` and for the globe's touch `onPointCountry`, or `onPointerLeave` could ignore `pointerType !== 'mouse'`. Update "Globe tours the countries when idle" in landing-globe to match.
2. [minor] src/pages/Landing/FightCardBilling/BillingRow.tsx:178 — Under `(hover: none)`, the label switches from `display: none` to `block`, which widens the arrow column of the selected row only. That narrows its name column, and a long name such as "ESTADOS UNIDOS" at 390 px may wrap. · fixed
   Fix: keep the label in layout on every touch row and show it with `visibility: isSelected ? 'visible' : 'hidden'`, or position it absolutely above the arrow.
3. [minor] src/pages/Landing/Landing.test.tsx:111 — Only the two taps with full motion are tested. Two paths have no test: a first tap under reduced motion, which must select and stay on `/`, and a touch `pointerdown` followed by a keyboard click (`detail: 0`), which must enter. · fixed
   Fix: add both tests.

## Decisions

- Any touch press on the bill or the globe stops the tour, including one that starts a scroll or lands on the spin control. On the stacked phone layout, a user who only scrolls past the bill also stops the tour. The spec delta allows this.
