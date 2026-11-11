## Context

`FightCard` (`src/pages/countries/components/TopFights/FightCard/FightCard.tsx`) is a two-part card: a 180px-high image strip with the year on it, then a themed text panel (fighters, subtitle, "Ver Pelea →"). It is shared by every country.

Image source today: `video.thumbnail`, else `https://i.ytimg.com/vi/<idYt>/hq720.jpg`, else `/placeholders/no-video-placeholder.png`. Thailand bundles six images under `src/pages/Thailand/resources/fights/` and resolves them from the backend's `thumbnail` key through `resolveTopFightThumbnail`. Mexico and United States pass no resolver; Mexico's cards show raw YouTube thumbnails (pillarboxed 4:3 footage, a Matchroom "ARCHIVE" title card).

`useCountryPageData` only calls the resolver when `fight.thumbnail` is truthy, so a country whose backend rows have no `thumbnail` cannot map images at all.

The card must keep what other specs already require: `role="button"`, Tab/Enter/Space and a visible focus outline (`card-keyboard-access`); hover / scroll-focus active treatment including the image brightness animation (`scroll-focus-cards`); no year badge without a year (`country-page-sections`).

## Goals / Non-Goals

**Goals:** a poster-style card (image is the card, text on top); curated images for Mexico's top fights; a way to bundle images for fights the backend sends without `thumbnail`.

**Non-Goals:** backend changes; curated images for United States; a build-time or runtime image pipeline; restyling fighter cards.

## Decisions

### 1. Portrait 4:5 via `aspect-ratio`, not a fixed height

The card root gets `aspectRatio: '4 / 5'`, `position: 'relative'`; the image is absolutely positioned at `inset: 0` with `objectFit: 'cover'`. Width keeps coming from the existing grid (`xs: 12, sm: 6, lg: 4`), so at `lg` a card is about 365×456.

Beat 2:3 (true poster ratio): sources are almost all 16:9 or 4:3 action shots of two people; 2:3 keeps under 40% of a 16:9 frame's width and routinely cuts a fighter. Beat 16:9 / 4:3 with overlaid text: that is the current thumbnail with text moved, not a poster. 4:5 reads as a poster and still fits two fighters.

### 2. Layer order and text colors

Inside the root, bottom to top: image (`.fightCardImg`, keeps `brightness(0.75)` → `1` and `scale(1.05)` on active) → scrim → content. The scrim is a fixed black gradient, light at the top for the year and heavy over the bottom ~55% for the text block. Content is a column pinned to the bottom with the year pinned top-left as today.

Text uses `common.white` and white with reduced alpha for the subtitle; `VS` and the watch-fight cue keep `primary.light`. Theme `surfaces` text tokens are not used on the overlay because they flip to dark in light theme; `.claude/rules/code-style.md` already allows fixed scrims and colors over photos. `cardSurfaceSx(surfaces)` stays on the root for border, radius and `overflow: hidden`, and `surfaces.surfaceSunken` stays as the background seen while the image loads.

The billing block is three lines: fighter, `VS` (smaller, italic, accent), fighter; names uppercase, heavy weight, tight line-height, each clamped to two lines with `overflowWrap: 'anywhere'`. The `h3` stays one heading containing all three lines so the accessible name is still "A VS B". The divider line above "Ver Pelea →" is dropped; the cue sits at the bottom-right of the content block.

### 3. Curated files are stored already cropped to 4:5

Each bundled image is cropped to 4:5 (target 1000×1250, WebP, about 150 KB or less) before it is committed, so the component needs no per-image `objectPosition` and what is in the file is what the card shows. Beat a per-fight focal-point map: more code and config for the same result, and a crop baked into the file can also remove letterbox bars and logos, which a focal point cannot.

Cropping is a one-off manual step with whatever tool is on the machine (`ffmpeg`, ImageMagick, or `npx sharp-cli` without saving it to `package.json`).

### 4. Resolver takes the fight, returns an image or nothing

`UseCountryPageDataOptions.resolveTopFightThumbnail` changes from `(filename: string) => string` to `(fight: MainEvent) => string | undefined`. The hook maps every top fight and sets `thumbnail` to what the resolver returns: a string replaces it, `undefined` clears it, so a backend `thumbnail` key with no bundled image never reaches the card as an image URL and the card falls back to YouTube.

- Thailand: `src/pages/Thailand/resources/fights/index.ts` exports `getTopFightImage(fight)`, a lookup of `fight.thumbnail` in its `Record`, returning `undefined` when the fight has no `thumbnail` or the key is not bundled, so the card falls back to YouTube. Bundled keys resolve as today.
- Mexico: `src/pages/Mexico/resources/fights/index.ts` exports `getTopFightPoster(fight)`, a lookup in a `Record<string, string>` keyed by `idYt`, returning `undefined` on a miss so the card falls back to YouTube.

Beat keying Mexico by the backend `thumbnail` like Thailand: Mexico's rows do not carry one (the cards show YouTube thumbnails), and adding it needs a backend change. `idYt` is always present on a displayable fight. Beat a second option (`resolveTopFightPoster`): two resolvers for the same field.

Resolver functions must be module-level (stable identity), as `getTopFightImage` is today, because the hook memoizes on them.

### 5. Where the images come from

Order of preference per fight: (1) a freely licensed photo of the fight (Wikimedia Commons or similar), (2) a clean frame of the fight video itself — `https://i.ytimg.com/vi/<idYt>/maxresdefault.jpg`, or a frame grabbed from the video — cropped to remove bars and graphics, (3) another photo of the fight found online. The file name is the matchup slug (`chavez_vs_taylor_i.webp`); the map key is the `idYt`.

## Risks / Trade-offs

- Press and agency photos of these fights (Getty, AP, Ring Magazine) are copyrighted, and the site is public → prefer sources 1 and 2; when a source-3 image is used, list its URL in the apply summary so the owner decides whether to keep it.
- 4:3 broadcast footage from 1986–1990 is low resolution; upscaled to 1000×1250 it will look soft → the scrim and `brightness(0.75)` hide most of it; accept softness over a pillarboxed thumbnail.
- YouTube fallback (United States, new fights) is a center crop of a 16:9 frame and can cut a fighter → accepted; the fix for a given fight is to bundle an image.
- Three-line billing with long names (`Juan Manuel Márquez`, `Marco Antonio Barrera`) at the `sm` two-column width → two-line clamp per name plus a manual check at 600–900px.
- Keying by `idYt` breaks silently if the backend swaps a fight's video → the card falls back to the YouTube thumbnail, which is the pre-change behaviour.

## Open Questions

- none
