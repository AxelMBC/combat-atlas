# Review: drop-bout-number-from-billing

Snapshot: 0de0d3ad249d5d0d894bdef7a81a06483baaa00d

1. [minor] src/utils/fightBilling.ts:6 — `/\s+[IVX]+$/` also strips a generational suffix written as a numeral (`II`, `III`, `IV`) from the second fighter of a title-derived billing (`X vs Leon Spinks III` bills `Leon Spinks`), while the same suffix on the first fighter is kept; a title alone cannot tell such a suffix from a bout number · open
   Fix: none needed unless such fighters reach the data; if they do, set `fighterRed`/`fighterBlue` on those fights, since `getFightBilling` prefers them over parsing the title

## Decisions

- The shared helper also drops the bout number from the top-fight poster cards and the fight info section (e.g. Mexico's Golovkin III card now bills `Gennadiy Golovkin`, with only the year and the image alt identifying the rematch). The `hero-title-card` delta covers it through "Same derivation as the fight cards". If the poster card should say which bout it is, that is a separate `fight-poster-cards` requirement, via its own `/axl:tweak`.
