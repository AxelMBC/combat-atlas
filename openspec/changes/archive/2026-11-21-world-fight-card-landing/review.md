# Review: world-fight-card-landing

Snapshot: 9d0097d691bab6297d7ff8820ade6084a072ad14

1. [defect] src/pages/Landing/HalftoneGlobe/useGlobeRenderer.ts:76-78 — Without a 2D canvas, one press of Spin locks the whole landing: `rendererRef.current` stays null, so `spin()` never runs and `onSpinSettled` never fires; `isFrozen` stays true, the spin control stays disabled and every plain row click is prevented and ignored. The landing-globe spec requires links, walkout and spin to work without a canvas. · fixed
   Fix: in the spin effect, settle at once when there is no renderer (`rendererRef.current ? rendererRef.current.spin(spin) : propsRef.current.onSpinSettled()`), and add a no-canvas, full-motion spin test that walks out to another country.
2. [minor] src/pages/Landing/HalftoneGlobe/globeRenderer.ts:251-256, 307-315, 326 — Hovering a country on the globe selects it, and the spring turns it away from the still cursor; the hit test only runs on `pointermove`, so the cursor and `pointedIsoCode` go stale and the following click can land on ocean. · open
   Fix: re-run `countryUnderPointer` at the last pointer position after each frame while the mouse is over the canvas, or fall back to `pointedIsoCode` on a pointerup without movement. See Decisions.
3. [minor] src/pages/Landing/useCountryTour.ts:47-52 — Any focus pauses the tour, not only keyboard focus: a mouse click that leaves focus on a link (site credit, ctrl-click on a row) pauses it until the user clicks elsewhere. · open
   Fix: set `isFocusInside` only when the target matches `:focus-visible`, or clear it on `pointerdown`.
4. [duplicate] src/pages/Landing/HalftoneGlobe/decodeGlobeDots.ts:12, 29-32 — Redefines `DEG_TO_RAD` (exported by `globeMath.ts:9`) and re-implements `toSphereTrig` (`globeMath.ts:31`). · open
   Fix: import both from `./globeMath` and spread `toSphereTrig(lat * DEG_TO_RAD, lng * DEG_TO_RAD)` into the dot.
5. [duplicate] src/pages/Landing/FightCardBilling/BillingRow.tsx:13, 18, 21 — `EASE_OUT_EXPO` (also LandingStage.tsx:15, WalkoutWipe.tsx:12, titleCardMotion.ts:3), `OUTLINE_OPACITY = 0.38` (also SpinControl.tsx:12) and the −12° poster skew (also SpinControl.tsx:13, WalkoutWipe.tsx:13) are copied per file. · open
   Fix: one `src/pages/Landing/landingMotion.ts` exporting `EASE_OUT_EXPO`, `POSTER_SKEW_DEG` and `OUTLINE_OPACITY`.
6. [rule] src/components/LandingFallback/LandingFallback.tsx:1-2 — The `// Intentionally avoids MUI/Emotion…` comment was carried into the renamed file; the owner rule is no code comments. · open
   Fix: delete it; the reasoning belongs in design.md.
7. [minor] .env.example:2 — `VITE_MAPTILER_KEY` is still documented though nothing reads it. · open
   Fix: remove the line (owner task 6.4; Claude does not read `.env*` files).

## Decisions

- Hovering on the globe both selects the country and re-aims the globe, which causes finding 2. Design §4/§5 does not say whether pointing at the globe should rotate it. Option: globe hover selects and highlights without re-aiming; only bill hover/focus, the tour and spin rotate the globe.
- The tour spec says "keyboard focus inside the landing" pauses the tour; design §5 says "`focusin` on the bill or globe". Make them agree when fixing finding 3.
- If the selected country is dragged away and the user hovers its own row, the globe does not swing back, because the selection did not change. This matches the spec ("when the selected country changes"); state it in design.md if intended.
