# Review: refine-landing-legibility

Snapshot: 6625f26b3735fa4746deac0889f078c4d505b7e6

1. [minor] src/pages/Landing/StagePortrait/StagePortrait.tsx:94-112 (with src/pages/Landing/LandingStage/LandingStage.tsx:33-34) — on phones the two-line caption starts inside the bottom of the globe's sphere, so the rim and edge dots can paint over the fighter name. The coordinates used to sit in the stage's top padding and the caption was one 0.7rem line. Measured in Chrome: 2 px overlap at 390×844, 11 px at 360×740, none at 1366×600 or 1914×912 · open
   Fix: move the xs vertical padding from the top to the bottom now that nothing sits up top, e.g. `pt: { xs: 0.5, md: 0 }, pb: { xs: 6, md: 0 }` in LandingStage.tsx (same total stage height), then recheck at 390×844 and 360×740.
2. [minor] src/pages/Landing/Landing.test.tsx:291-298 — the broken-portrait test passes even if the error path does nothing: the fighter name only renders after `load`, so it is already absent before `fireEvent.error`, and the coordinates always render · open
   Fix: after `fireEvent.error(getMexicoPortrait())`, add `expect(renderedPortraitSources()).not.toContain(mexico.portrait?.src)`.

## Decisions

- The delta's "Name contrast" scenario asks for every discipline line to reach 4.5:1. Design decision 2 sets the ` · ` separator at reduced opacity (`SEPARATOR_OPACITY = 0.5`), which puts the dot itself at roughly 2.7:1 dark and 2.1:1 light. Either say in the requirement that the separator is decorative, or drop its opacity.
- The stage caption's 4.5:1 rests on the manual check in task 7.6: the caption now always sits over the accent-tinted portrait.
