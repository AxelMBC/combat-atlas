## Context

`CinematicHero.tsx` creates a YouTube IFrame player as a cover-sized background video with `controls: 0`. The current YouTube embed player (the `ytm-`/`delhi-player` web components) still draws `player-middle-controls`, a 56 px centre play/pause pill, with a `fadein` on every playback start and hides it ~4.1 s after `PLAYING`. Measured in the running app with Playwright: seven `playerVars` variants and the `youtube-nocookie` host all behave the same; the pill also appears after `loadVideoById` and after resuming from pause, and never while paused. The iframe is cross-origin, so nothing inside it can be styled or clicked from the app.

The hero already keeps a poster `<img>` over the iframe while the player is not ready (`showPoster`). The first version of this change extended that poster to the 5 s after each playback start; it works (verified: zero frames where the pill was visible without the poster at full opacity) but Mexico's fights carry no `thumbnail`, so the poster is YouTube's 480×360 `hqdefault.jpg` stretched to the viewport.

`CountryPage.tsx` shows a fullscreen `Spinner` until the hero calls `onReady`, which today happens 4.5 s after the first `PLAYING` (`REVEAL_DELAY_MS`) or 8 s after mount; `CountryPage` also lifts it on its own after 3 s. The 4.5 s existed only to keep YouTube's start chrome behind the spinner.

The fighter billing (first fighter / VS / second fighter, derived from `fighterRed`/`fighterBlue` or an `A vs B` title) is implemented twice, in `FightCard.tsx` and `FightInfoSection.tsx`.

## Goals / Non-Goals

**Goals:** no YouTube control ever visible on load or fight switch; a cover that looks designed for every fight regardless of its thumbnail; one transition on first load instead of spinner → cover → video; one billing helper.

**Non-Goals:** covering the resume-after-pause pill; artwork on the card; touching the data-loading spinner or cold-start hint; any other hero control.

## Decisions

### 1. A fight-poster title card, not a treated thumbnail

The cover is a `FightTitleCard` (folder `CinematicHero/FightTitleCard/`) rendered from the fight's data in the style of a boxing fight poster: presenter line, type ribbon and title tag, a face-off of the two fighters around `VS`, the year as an outlined watermark, and a facts strip. The first version was a plain centred column (type / names / `year · city · division`); the user found it flat and asked for more personality, so it was reworked into the poster. Alternatives that lost:

- Blurred/duotoned thumbnail with the card on top: `hqdefault.jpg` carries letterbox bars that blur into blobs, a full-viewport `filter: blur()` costs GPU for the whole 5 s, and the real video appears right after, so the photo adds nothing the card does not.
- Curated posters: only the 6 top fights have them, and they are 4:5 crops for the cards.

### 2. Timing model unchanged from the poster version

`isStartChromeShowing` starts `true`, is set `true` again (with any pending timer cleared) right before `loadVideoById`, and a single timer armed on the first `PLAYING` sets it `false` after `YOUTUBE_START_CHROME_HIDE_MS = 5000` (4.1 s measured plus margin). The card's wrapper gets `opacity: 1` with `transition: none` while showing and `opacity: 0` with the hero's 350 ms ease when hiding, so the switch is a hard cut in and a fade out. Resume after pause re-arms a timer that resolves to a no-op because the flag is already `false`. A player `onError` (removed, private or non-embeddable video) clears the timer, sets the flag `false` at once so YouTube's own error message shows, and sets `paused` so the toggle offers play (review finding 2). If the player is still not ready when the 8 s `REVEAL_FALLBACK_MS` fires (blocked `iframe_api` or embed; `loadYouTubeIframeApi` never rejects), the fallback also sets the flag `false`, so the headline and scroll hint come back over the black hero instead of staying hidden behind a card that would never lift; `onReady` sets it `true` again so a late player is still covered for its first start (second review, finding 2).

### 3. `onReady` moves to the player's ready event

`reveal()` is called from the YouTube `onReady` handler instead of 4.5 s after `PLAYING`; `REVEAL_DELAY_MS` is deleted and `REVEAL_FALLBACK_MS` (8 s) stays. `CountryPage` is not touched: its `Spinner` and 3 s fallback keep working and now lift earlier. Alternative that lost: removing the `Spinner` from `CountryPage` entirely, since the card covers the hero from first paint. It would also drop the dark-mode no-flash cover that `theme-surface-tokens` specifies for route changes, for a saving of one component render.

### 4. Card layout and style

The card fills the hero, `pointer-events: none`, `aria-hidden`, and sits above the hero's two gradient scrims (they exist for the headline over video and would dim the facts strip) and below the toggle zone (`zIndex` 2) and the chips.

- **Background:** `common.black`, a radial glow of `primary.main` at 30 % → 8 % → transparent, and a 6 px halftone dot grid at 14 % white masked to a central ellipse, for a printed-poster texture without an image.
- **Watermark:** the year in `HEADLINE_FONT` at 40vw (62vw on phones), transparent fill with a 1 px stroke at 9 % white, centred and cropped by the hero.
- **Grid:** three rows `1fr auto 1fr`, so the face-off row is centred on the hero and the play toggle lands on `VS` when autoplay is refused. Row 1 (bottom-aligned): presenter line in italic `BODY_FONT`, then the type ribbon (`primary.main`, skewed −12°, `★ type ★`) and, with an `organization`, an outlined "Título X" tag. Row 3 (top-aligned): the facts strip.
- **Face-off:** columns `1fr auto 1fr` from `md`, one column on phones (fighter / `VS` / fighter). Each fighter is a CSS subgrid over three shared rows (given names, surname, nickname), so both surnames and `VS` share one line whichever side has a given name or nickname. Given names are tracked `HEADLINE_FONT` at 70 % opacity; surnames are `HEADLINE_FONT` at `clamp(3.5rem, 6.5vw, 7rem)` (`clamp(2.5rem, 13vw, 3.75rem)` on phones; larger for a single billed name); nicknames are italic `BODY_FONT` in `primary.light`. `VS` is `primary.main` with an offset 1 px white outline copy (`::after` from `data-label`) for a misregistered-print look.
- **Names:** `splitFighterName` takes a quoted nickname out of the name (`'…'`, `"…"`, `“…”`, only when the quote opens a word, so `O'Brien` is safe), keeps a `Jr.`/`Sr.`/`II`–`IV` suffix with the surname, and treats the last word as the surname.
- **Facts strip:** four slots (date, venue, division, rounds) between 1 px rules at 16 % white, 4 columns from `md`, 2 × 2 on phones. Labels are tracked `HEADLINE_FONT` at 50 % white, values `HEADLINE_FONT` in white, and the venue's city is an italic `BODY_FONT` line under a venue name. A missing value is `—` at 35 % white, so the strip keeps its rhythm and the absence reads as "no data" rather than a broken layout. The date uses `Intl.DateTimeFormat` (`es-MX` / `en-US`, short month, UTC) and falls back to the year.
- **Hero chrome:** the hero's eyebrow/country/stats block and the scroll hint are hidden while the card is up (hard cut out, the hero's 350 ms fade back in with the video). On heroes shorter than ~770 px the block and the card share the same rows (review finding 1), and on short heroes the facts strip reaches the scroll hint. Alternatives that lost: height-aware font sizes (still touch below ~700 px) and centring the card in the band above the block (the toggle would land on the second name instead of `VS`).

### 5. Entrance animation with framer-motion

`titleCardEntrance(shouldReduceMotion, offset, delay)` returns framer-motion `initial`/`animate`/`transition` props (0.7 s, ease-out-expo `[0.16, 1, 0.3, 1]`). The ribbon drops 12 px, the fighters slide 56 px in from opposite sides, `VS` lands from 1.8× scale, the fact slots rise 12 px with a 70 ms stagger, and the watermark settles from 1.08× over 1.4 s. With `useReducedMotion()` the offsets are dropped and everything only fades. The animated content is keyed by `video.idYt`, so it replays on a fight switch. `CinematicHero` also keys the card by `isLoaderCovering`, which `CountryPage` passes (`autoplayAllowed && !videoReady && !error`, the same predicate that shows its `Spinner`): the card mounts behind the spinner, so without the remount the first-load entrance would finish before the spinner lifts. Keying by `playerReady` instead (the first version) replayed the entrance in plain view when the player became ready after the spinner was already gone: after pressing play under reduced motion, or on a boot slower than the spinner's 3 s fallback (review finding 1). framer-motion is already a dependency (`FightInfoSection`, `WorldMap`). Exit is the wrapper's opacity transition from decision 2, not an `AnimatePresence`, so the card never lingers past the timer.

### 6. Shared billing helper

`src/utils/fightBilling.ts` exports `splitFightersFromTitle(title)` and `getFightBilling(video)` (returns `[first, second] | null` from `fighterRed`/`fighterBlue`, else the title split). It also holds the other per-fight display reads, so every surface derives them the same way: `getFightCity(video)` (`location`, else `venue.city`) for the title card's venue slot, `FightInfoSection`, the `FightCard` subtitle and the hero's city count in `getCountryStats`; `getFightDiscipline(video, language)` (`type`, else the first localized tag) for the title card ribbon, the `FightCard` subtitle and `getCountryStats`; and `getFightDivision(video, language)` for the facts strip and `FightInfoSection` (review findings 3 of both reviews, 4 of the second). `FightCard`, `FightInfoSection` and `FightTitleCard` import it; the two local copies are deleted. Colocated test covers the three derivation paths.

### 7. New optional fight fields, filled in the database later

The poster reads three new optional fields on `MainEvent`, all available for any professional bout from its record (BoxRec, Wikipedia, the broadcast): `date` (ISO `YYYY-MM-DD`), `scheduledRounds` (rounds scheduled, not fought, so the card never spoils the result), and `venue.name` (arena, alongside the existing `venue.city`/`country`). It also uses the existing but unused `organization` (sanctioning body of the title at stake). The backend schema does not declare them, but fields added directly to the documents are returned as-is (as `location` and `year` already are). No dummy values ship in the code: the screenshots used a Playwright route that patched the API response. `decision` is deliberately not shown (spoiler).

## Risks / Trade-offs

- YouTube changes the auto-hide delay → the 5 s constant is in one place; the Playwright timing script in the session scratchpad can re-measure it.
- A fight with no data beyond its title shows the names over a strip of `—` → acceptable; every Mexico fight has at least type, year and location, and the dashes signal what to fill in.
- `splitFighterName` is a heuristic: compound surnames (`Sánchez Narváez`) bill the last word as the surname → titles in the data use short names; adding `fighterRed`/`fighterBlue` per fight gives exact names.
- Spinner now lifts ~1–2 s after mount while the player is still booting → the card is already on screen, so the user sees content, not a blank hero.
- The resume-after-pause pill remains → documented in the `hero-playback-controls` delta.
- With reduced motion or refused autoplay the country headline and the scroll hint stay hidden until the user starts playback, because the card stays up → the card itself names the fight, the headline stays in the accessibility tree, and the page still scrolls.

## Open Questions

- none
