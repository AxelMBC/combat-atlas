## Context

The country page's first load goes fullscreen `Spinner` → fight title card → video. The spinner lifts at player ready or after 3 s (`CountryPage.tsx:27,66-70`). The card then stays fully opaque until 5 s after the first `PLAYING` (`YOUTUBE_START_CHROME_HIDE_MS`, `CinematicHero.tsx:35,110-116`). The card's entrance ends after ~1.4 s (watermark, `FightTitleCard.tsx:21`), and from then on nothing on the hero moves:

```
 [Spinner]  [ title card ......................................................... ] [video]
            entrance ~1.4 s │ still, UNKNOWN length          │ still, exactly 5 s
            ▲ ready / 3 s fallback        ▲ 1st PLAYING (CinematicHero.tsx:207)     ▲ 350 ms fade
```

The wait on the card has two parts: an unknown one (API load, player boot, buffering) and a fixed 5 s one. The scroll hint is already hidden while the card is up (`CinematicHero.tsx:287,457`), so nothing invites scrolling. The problem is that the screen looks frozen.

## Goals / Non-Goals

**Goals:** a visible, honest sign that the fight is coming, covering both parts of the wait; no new overlap with the card at any hero height; no extra hero renders and no per-frame layout or paint.

**Non-Goals:** changing when the card appears or lifts; touching the country page `Spinner`; measuring real buffering progress.

## Decisions

### 1. Hybrid indicator: indeterminate pulse, then a 5 s countdown

Before the first `PLAYING` the indicator shows an indeterminate pulse with "Preparando la pelea". From the first `PLAYING` it shows "La pelea empieza en" with `5 → 1` and a bar that fills over the same 5 s.

- **Beat a spinner alone:** a spinner says "unknown wait" during a wait that is exactly 5 s, and that fixed part is usually most of the time on the card. Determinate progress makes the wait feel shorter.
- **Beat a countdown alone:** before `PLAYING` there is no duration to count, so a countdown would either make up a number or leave the slow-YouTube case (the worst one) empty.

### 2. The indicator lives in the card's layout flow, through a `footer` slot

`FightTitleCard` takes `footer?: ReactNode`. The card's last grid row (`FightTitleCard.tsx:203-205`) becomes a column with `FightFacts` at the top and the footer pushed to the bottom (`mt: 'auto'`, with a minimum gap above). That row is a `1fr` track, whose minimum is its content, so the indicator can never overlap the facts strip.

- **Beat an absolute position in the scroll hint's slot** (`CinematicHero.tsx:446-447`): on short heroes (1366×650, 900×560) the facts strip reaches the bottom. That is the reason the scroll hint already yields to the card.
- **Beat putting it inside `FightTitleCard` as playback props:** the card stays a poster built from fight data. It renders a node it knows nothing about, and the hero owns the playback state.
- **Free behaviour:** the footer sits inside the card's opacity wrapper (`CinematicHero.tsx:338-350`), so it fades with the card over the same 350 ms. It also sits inside the `video.idYt`-keyed box (`FightTitleCard.tsx:81`), so a fight switch remounts it with the new card in the same frame.

### 3. State: a second boolean next to `isStartChromeShowing`, not a 3-value phase

`hasCountdownStarted` records whether the first `PLAYING` of the current playback start has arrived.

- **Set it** inside `hideStartChromeAfterDelay`, right after its guard (`CinematicHero.tsx:110-116`). The countdown and the 5 s hide timer then start at the same place and stay in sync by construction.
- **Reset it** through one helper, `coverPlaybackStart()`, which sets `isStartChromeShowing(true)` and `hasCountdownStarted(false)` together. It replaces the three `setIsStartChromeShowing(true)` calls: player `onReady` (`:198`), fight switch (`:257`) and effect cleanup (`:245`).

Exploration proposed replacing the flag with `'waiting' | 'counting' | 'lifted'`. That loses information. The two facts are independent, and all four combinations are real:

| cover up | first `PLAYING` | state | indicator |
| --- | --- | --- | --- |
| yes | no | waiting | pulse |
| yes | yes | counting | countdown |
| no | yes | revealed after the countdown | holds `1` and a full bar while fading |
| no | no | lifted by error or the 8 s fallback | holds the pulse while fading |

A single "lifted" value could not tell the fading indicator which face to keep, so it would flash between faces during the 350 ms fade.

### 4. Rendering cost

- `hasCountdownStarted` flips in the same `onStateChange` call that already runs `setPaused(false)` (`:213-218`). React batches them, so there is no extra hero render.
- The number lives in its own `CountdownNumber` component: `useState(seconds)` plus a 1 s `setInterval`, clamped at `1`. Only that component re-renders (4 times), not the hero and not the card's framer-motion elements.
- The bar fill (`transform: scaleX(0 → 1)`, `transform-origin: left`, `${countdownMs}ms linear forwards`) and the sweeping pulse segment (`translateX`, infinite) are `sx` keyframes on `transform` only. They run on the compositor with no per-frame layout or paint.
- The fill starts when the counting face mounts, in the same render as the flag flip, so it is within a frame of the hero's timer.
- The duration comes from the hero as `countdownMs={YOUTUBE_START_CHROME_HIDE_MS}`, so there is one source of truth.

### 5. Hidden with opacity while the play toggle is shown, never unmounted

The hero passes `isHidden={showsPlayAction}` (`CinematicHero.tsx:285`), and the indicator fades to `opacity: 0` over 350 ms.

The indicator stays mounted, so the countdown keeps running while hidden, just as the hero's timer keeps running. A pause and resume inside the window therefore brings back the real time left.

When playback hasn't been requested (reduced motion before play), `showsPlayAction` is true and the indicator never shows.

### 6. Visual

The indicator follows the card's style rules (black base, fixed light text, country accent from `palette.primary.main`):

- **Label:** `HEADLINE_FONT`, uppercase, letter-spaced like the ribbon, `alpha(white, 0.7)`.
- **Number:** `HEADLINE_FONT` in `primary.main`, ~1.75–2.25 rem, `lineHeight: 1`, tabular figures, on the same baseline as the label so the line never shifts width.
- **Track:** ~4 px, `alpha(white, 0.15)`, about `min(320px, 100%)` wide. The pulse is a short accent segment sweeping across it; the countdown is an accent fill.
- **Entrance:** through `titleCardEntrance` (`titleCardMotion.ts`) with a delay just after `FACTS_DELAY_S`, so it replays with the card's entrance and only fades under reduced motion. The card applies it to the wrapper around any `footer`, so framer's inline `opacity` never fights the indicator's own `isHidden` opacity and `FACTS_DELAY_S` stays private to the card.
- **Reduced motion** (read with framer's `useReducedMotion`, like the card): the pulse animates opacity only, and the fill uses `steps(5, end)`, aligned with the number.

**Why not reuse `Spinner`:** `.spinner__bar` is fixed `$red` with a `3px solid $black` border, which is invisible on the black card and ignores the country accent (`Spinner.scss:44-46`). Its text uses `--surface-text-primary`, which is black in light mode (`Spinner.scss:75,89`), and it renders `role="status"` inside an `aria-hidden` layer. A `tone` prop (the `SiteCredit` pattern) would fix only the indeterminate half, and the countdown half is new either way.

## Risks / Trade-offs

- **Card content plus footer taller than a short hero:** the grid would grow past the hero and clip the indicator at the bottom (`overflow: hidden`).
  → Keep the indicator to one text line plus the track, keep its paddings tight, and check 1366×650, 900×560 and a phone in the running app. If it clips, trim the card's own row paddings instead of overlapping the facts.
- **The card wrapper is re-keyed when the loader lifts (`titleCardEntranceKey`, `:286,348`), which remounts the indicator:** this happens at player ready or on the 3 s fallback. Both come before the first `PLAYING` (`onReady` reports before `playVideo()`, `:200-201`), so the countdown can't be reset mid-count. Only the pulse remounts, which is harmless.
- **`setInterval` drift against the hero's `setTimeout`:** a few ms over 5 ticks. The number is clamped at `1`, so it never shows `0` before the fade.
- **Background tab:** timers and CSS animations are throttled differently, so the bar and number can be slightly off when the tab comes back. This is cosmetic, and the card still lifts on the hero's timer.

## Open Questions

- none. How long ready → first `PLAYING` really takes on a phone only affects how long the pulse is seen, not the design. Check it under network throttling as part of verification.
