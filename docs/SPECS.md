# SPEC: Cinematic Hero for Country Pages

**Status:** Draft for planning
**Scope:** Country detail pages (`/:countrySlug`), starting with `/mexico`
**Depends on:** Existing country page sections, fight data in the `country` slice, the i18n layer (`useTranslation`), per-country theming (`createCountryTheme` / `CountryPageConfig`), and the `_CountryTemplate` scaffold

---

## 1. Context & Problem

The current country page entry point is a fullscreen autoplaying fight video with no orientation layer. UX failures identified:

1. **No information scent** — the user lands with no indication of where they are, what the collection contains, or what actions exist. The video's own broadcast graphics compete with (and bury) the app's UI text.
2. **No user control** — autoplay fullscreen is a trap pattern; the only exit is a low-visibility back link.
3. **No system status** — no indication of which fight is playing, or that more content exists below.

The fix is **not** to remove the fullscreen experience (it is the product's identity) but to reframe it: the fullscreen video becomes a **cinematic hero at the top of a scrollable page** — a doorway, not a destination. A title-card overlay provides orientation; scrolling reveals the existing page sections.

---

## 2. Goals

- G1: Preserve the fullscreen visual impact on landing while giving first-time users immediate orientation (country name, fight count, what to do next).
- G2: Make scroll the primary discovery gesture: scrolling down reveals the **fight info section** (tags, fight title, description, división/sede/año) for the currently playing fight, followed by the existing Ídolos and Peleas Históricas sections.
- G3: Keep a **true fullscreen mode** one click away for users who just want to watch (native Fullscreen API, all app chrome hidden).
- G4: "Otro combate" button selects a random different fight, updating both the hero video and the fight info section.
- G5: Faster, lighter experience for returning visitors (shorter title card) and reduced-motion / data-conscious users (no autoplay).

## Non-goals

- No changes to the world map landing page.
- No changes to backend API or data shape.
- No new routes; the feature lives inside the existing country page component(s).
- No "fight grid" section. The fight info card replaces it as the first below-the-fold content.

---

## 3. UX Specification

### 3.1 Page structure (top to bottom)

1. **CinematicHero** — full viewport height (`100svh`), contains the video element, scrim, title card, and hero controls.
2. **FightInfoSection** — existing fight info card content (tag chips, fight title, narrative description, división / sede / año) + **"Otro combate"** button. This is the first content below the fold.
3. **Ídolos de México** — existing section, unchanged.
4. **Peleas Históricas** — existing section, unchanged.

The hero is a normal in-flow section, not `position: fixed`. Scrolling past it is ordinary document scroll.

### 3.2 Hero states

The hero has three visual states driven by a small state machine:

```
TITLE_CARD ──(scroll | click | timeout)──> IMMERSIVE ──(fullscreen btn)──> FULLSCREEN
     ▲                                          │                              │
     └────────────(new fight loads)─────────────┘ <───────(exit fullscreen)────┘
```

**TITLE_CARD (orientation layer)**

- Video plays muted behind a dark gradient scrim: `linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.25) 45%, rgba(0,0,0,.35) 100%)`. The scrim guarantees text contrast regardless of video content.
- Overlay content, bottom-left aligned:
  - Eyebrow: `COMBAT ATLAS` (small, letterspaced)
  - Country name (display size, styled from the country's MUI theme built by `createCountryTheme(config)` — use the `CountryPageConfig` `accentColor`, never a hardcoded hex)
  - Metadata line: `{N} combates · {disciplines} · última actualización {date}` (reuse values already shown in the breadcrumb bar)
  - Currently playing label: small line with the fight name (e.g. `Reproduciendo: Isaac Cruz vs Rolly Romero`)
- Scroll affordance: centered-bottom chevron + `Desliza para explorar`, rendered in app typography (never relying on text baked into the video).
- Persistent chrome (all states except FULLSCREEN): `← Mapa mundial` top-left, mute toggle and fullscreen button top-right, ES/EN toggle as currently positioned.
- Exit conditions:
  - First visit to this country (`localStorage`, see 6.4): persists until first scroll/click/keypress, with a 8s max timeout.
  - Returning visit: auto-fades to IMMERSIVE after 2s.

**IMMERSIVE**

- Scrim and title card fade out (300–400ms opacity transition). Video remains fullscreen-of-viewport.
- Chrome (back link, mute, fullscreen button) auto-hides after 3s of pointer inactivity, reappears on pointer move / touch / focus — standard video-player behavior.
- Scroll affordance remains faintly visible (reduced opacity) until the user scrolls for the first time in the session, then is removed.

**FULLSCREEN**

- Triggered only by explicit user action on the fullscreen button (`Element.requestFullscreen()` on the hero container).
- All app chrome hidden except a minimal exit hint; native browser fullscreen exit (Esc) must work.
- On exit, return to IMMERSIVE in the same scroll position.

### 3.3 Scroll behavior

- When the hero is less than ~40% visible (IntersectionObserver threshold), the video **pauses**. When it re-enters past ~60% visibility, it **resumes**. Hysteresis avoids flapping at the boundary.
- No scroll-jacking. No snap points. Native scroll only.

### 3.4 "Otro combate" (random next fight)

- Located in FightInfoSection (primary button, existing dark-red style).
- On click:
  1. Select a random fight from the country's fight list, excluding the current one.
  2. Update fight info content in place (tags, title, description, metadata).
  3. Swap the hero video source and restart playback.
  4. Smooth-scroll the hero back into view.
  5. Show a brief (~1.5s) mini title card variant over the scrim: fight name only (not the full country title card).
- Selection must not repeat the current fight; if the country has exactly 1 fight, hide or disable the button.

### 3.5 Reduced motion / no-autoplay fallback

- If `prefers-reduced-motion: reduce` **or** autoplay is rejected by the browser (the `video.play()` promise rejects):
  - Render a poster frame (first video frame or a provided thumbnail) with a centered play button.
  - Title card renders immediately and statically (no fade animations).
  - Playback starts only on explicit user action.

---

## 4. Functional Requirements

Format: Given / When / Then acceptance criteria. Pure logic (hero state machine, fight selection, persistence helpers) must ship with colocated Vitest tests (see 6.6). Criteria that depend on browser APIs (autoplay, Fullscreen API, IntersectionObserver) are verified manually plus mocked unit tests where practical.

**FR-1 — Title card on first visit**

- Given a user who has never visited `/mexico` (no `localStorage` flag),
- When the page loads and the video begins muted autoplay,
- Then the title card (eyebrow, country name, metadata, current fight, scroll affordance) is visible over the scrim and remains until the user scrolls, clicks, presses a key, or 8s elapse — whichever comes first.

**FR-2 — Fast path for returning visitors**

- Given a user with the visited flag for this country,
- When the page loads,
- Then the title card auto-fades to IMMERSIVE after ~2s without requiring interaction.

**FR-3 — Scroll reveals fight info**

- Given the hero is displayed,
- When the user scrolls down one viewport,
- Then the FightInfoSection for the **currently playing fight** is the first visible content, followed by Ídolos and Peleas Históricas.

**FR-4 — Video pauses off-screen**

- Given the video is playing,
- When the hero drops below ~40% viewport visibility,
- Then the video pauses; and when the hero returns above ~60% visibility, playback resumes from the same position.

**FR-5 — Otro combate**

- Given a country with ≥2 fights,
- When the user clicks "Otro combate",
- Then a different random fight loads (video + info card updated consistently), the hero scrolls into view, and a brief fight-name card displays. The previously playing fight is never selected.

**FR-6 — Explicit fullscreen**

- Given any hero state,
- When the user clicks the fullscreen button,
- Then the hero container enters native fullscreen with app chrome hidden; Esc or the exit control returns to the prior state and scroll position.

**FR-7 — Mute toggle**

- Given the video is playing muted (required for autoplay),
- When the user clicks the mute toggle,
- Then audio is enabled and the toggle reflects state; the preference persists for the session (not across sessions).

**FR-8 — Autoplay failure fallback**

- Given the browser blocks autoplay or `prefers-reduced-motion` is set,
- When the page loads,
- Then a poster + play button renders instead of silent failure, with the title card shown statically.

**FR-9 — Orientation chrome always reachable**

- Given TITLE_CARD or IMMERSIVE state,
- When the user moves the pointer or focuses via keyboard,
- Then `← Mapa mundial`, mute, and fullscreen controls become visible and operable.

**FR-10 — i18n**

- Given the ES/EN language toggle,
- When the language changes,
- Then all hero strings (eyebrow, metadata, "Desliza para explorar" / "Scroll to explore", "Otro combate" / "Next fight", "Reproduciendo" / "Now playing") switch accordingly. All copy must go through `useTranslation()` / `t(key)` with new `TranslationKey` entries added to **both** `src/i18n/locales/es.ts` and `en.ts` — zero hardcoded user-facing strings in components.

---

## 5. Non-functional Requirements

- **NFR-1 Accessibility:** All controls keyboard-operable with visible focus states. Title card text meets WCAG AA contrast against the scrim (the gradient floor of rgba(0,0,0,.85) at the text region guarantees this for white/ivory text). Video has `aria-label` with the fight name. Respect `prefers-reduced-motion` (FR-8).
- **NFR-2 Performance:** Use `preload="metadata"` until playback is needed. When swapping fights, release the previous video source. No layout shift between TITLE_CARD and IMMERSIVE (only opacity transitions). Target: hero interactive within the existing page load budget; no new heavy dependencies.
- **NFR-3 Mobile:** Use `100svh` (not `100vh`) to avoid the mobile browser chrome jump. Touch: tap toggles chrome visibility in IMMERSIVE; scroll works natively.
- **NFR-4 No new dependencies** unless strictly necessary. IntersectionObserver, Fullscreen API, and CSS transitions cover everything. MUI v7 + SCSS per repo conventions.

---

## 6. Technical Design

### 6.1 Components (proposed)

```
src/components/country/
  CinematicHero/
    CinematicHero.tsx          — state machine wiring, video element, observers
    CinematicHero.types.ts     — props, HeroPhase union, config types
    useHeroPhase.ts            — state machine as a pure-ish hook (testable)
    TitleCard.tsx              — overlay content (full + mini variants)
    HeroControls.tsx           — back link, mute, fullscreen, auto-hide logic
    cinematic-hero.scss
    useHeroPhase.test.ts       — colocated Vitest tests
  FightInfoSection/
    FightInfoSection.tsx       — existing card content + "Otro combate" button
    FightInfoSection.types.ts
```

The hero is shared infrastructure, not per-country code: country pages compose `<CinematicHero config={...} fight={...} />` and pass their `CountryPageConfig`. **Also update `src/pages/_CountryTemplate/` (and its `CONTRIBUTING.md` / the `add-country` skill if it references page structure) so newly scaffolded countries get the hero by default.** Per repo conventions, all components are arrow functions and all interfaces live in colocated `*.types.ts` files — never inline.

### 6.2 State

- **Current fight selection** is page-level UI state, not server state. Hold it in the country page component (`useState<fightId>`), initialized to a random fight on mount. Pass down to both `CinematicHero` and `FightInfoSection` so they can never desync. Lifting it into the Redux `country` slice is acceptable if other sections later need it, but is not required by this spec.
- **Hero phase** (`'title-card' | 'immersive' | 'fullscreen'`) is internal to `CinematicHero`.
- Country data continues to come from the existing `fetchCountry(slug)` thunk and `sessionStorage` cache; this feature reads from the `country` slice and does not touch `eventIngestion` or modify the data flow.

### 6.3 Key mechanics

- **Autoplay:** `<video muted autoPlay playsInline preload="metadata">`. Always handle the `play()` promise rejection → fallback state (FR-8).
- **Visibility pause/resume:** one `IntersectionObserver` on the hero container with thresholds `[0.4, 0.6]`; track direction to implement hysteresis.
- **Fullscreen:** `containerRef.current.requestFullscreen()`; listen to `fullscreenchange` to sync state (handles Esc).
- **Chrome auto-hide:** pointer-activity timer (3s) reset on `pointermove` / `touchstart` / `focusin`.
- **Reduced motion:** `window.matchMedia('(prefers-reduced-motion: reduce)')`.

### 6.4 Persistence

- `localStorage` key: `ca:visited:<slug>` = ISO timestamp. Written when the user first leaves TITLE_CARD. Read on mount to choose FR-1 vs FR-2 behavior. Wrap access in try/catch (private mode / blocked storage → treat as first visit).

### 6.5 Conventions (from CLAUDE.md)

- Arrow functions only (`const Foo = () => {}`); no `function` declarations.
- Types/interfaces in colocated `*.types.ts` files, never inline.
- Imports via `@/...` alias across module boundaries.
- Styling: SCSS files colocated with the component + MUI v7 where it fits; colors come from the per-country theme (`createCountryTheme(config)`, `accentColor`, `common.black`) — no new ad-hoc colors.
- All user-facing copy through the i18n layer; new `TranslationKey` entries in **both** `locales/es.ts` and `locales/en.ts`.
- Run `yarn format` (Prettier) and `yarn lint` before considering work done.
- No router changes; everything composes inside the existing country page loaded by `CountryRouter`.

### 6.6 Testing (Vitest 2.1.x + Testing Library + jsdom, colocated `*.test.ts`)

Do **not** bump Vitest to 3.x or merge `vitest.config.ts` into `vite.config.ts` (pinned intentionally — see CLAUDE.md).

Required coverage:

- **`useHeroPhase` state machine** — pure logic, fully unit-testable: TITLE_CARD → IMMERSIVE on scroll/click/keypress/timeout; first-visit vs returning-visit timing (FR-1, FR-2); fullscreen enter/exit transitions (mock `requestFullscreen`/`fullscreenchange`).
- **Fight selection helper** (`pickRandomFight(fights, currentId)`) — never returns `currentId`; returns `null`/disabled signal when length ≤ 1 (FR-5, edge cases). Seed or inject the RNG so tests are deterministic.
- **Persistence helper** (`ca:visited:<slug>` read/write) — first-visit detection, and graceful fallback when `localStorage` throws (mock it to throw).
- **TitleCard render** — Testing Library: full vs `mini` variant, strings resolved through a test `LanguageProvider` in both locales (FR-10).
- **IntersectionObserver pause/resume** — mock the observer (jsdom has none); assert pause below 0.4 visibility and resume above 0.6 with hysteresis (FR-4).

Run with `yarn test:run src/components/country/CinematicHero/useHeroPhase.test.ts` (per-file) during development.

---

## 7. Edge Cases

| Case                             | Expected behavior                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| Country has 0 fights             | Hero renders with poster/placeholder background + title card only; no video, no "Otro combate". |
| Country has 1 fight              | Hero plays it; "Otro combate" hidden or disabled with tooltip.                                  |
| Video URL 404 / network error    | Poster fallback + title card; non-blocking; rest of the page renders normally.                  |
| Autoplay blocked                 | FR-8 fallback.                                                                                  |
| User hits "Otro combate" rapidly | Debounce: ignore clicks while a swap is in flight.                                              |
| Tab backgrounded                 | Browser pauses video natively; resume only if hero is visible when the tab refocuses.           |
| `localStorage` unavailable       | Treat every visit as first visit.                                                               |

---

## 8. Out of Scope / Open Questions

- **Poster thumbnails:** does the fight data include a thumbnail/poster URL? If not, the fallback uses the first decodable frame; a backend `posterUrl` field is a nice-to-have follow-up.
- **Deep-linking a specific fight** (`/mexico?pelea=<id>`): natural extension, not required now.
- **Analytics events** (title card dismissed, fullscreen entered, otro combate clicks): out of scope; note hook points in code comments.
- **"Mini title card" on fight swap** styling should reuse TitleCard with a `variant="mini"` prop, not a separate component.
- **Video delivery & retries:** the Axios retry interceptor in `api.ts` only covers JSON API calls, not `<video>` element loads. Video error handling is the poster fallback (edge-case table); no retry logic needed in v1.
- **Storage key naming:** `ca:visited:<slug>` follows the existing `preferredLanguage` precedent of using `localStorage` for cross-session UI prefs (vs `sessionStorage` for data caching). Keep that split.
