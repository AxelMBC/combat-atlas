## Context

The landing is a fight-poster bill (`FightCardBilling/BillingRow.tsx`) beside a stage (`LandingStage.tsx`) that holds the glow, a dot texture, an outlined ISO watermark, the fighter portrait (`StagePortrait.tsx`), the halftone globe and the coordinates.

Seven elements use the same 1 px outline:
- bout numbers (`BillingRow.tsx:114`)
- unselected names (`:169`)
- the accent offset outline (`:171-177`)
- ribbon borders
- the spin control
- the watermark (`LandingStage.tsx:77-99`)
- the globe's rim

With that much equal weight, nothing leads the eye.

Measured on the dark page `#161616`:

| Element | Contrast |
|---|---|
| Unselected-name stroke | 3.33:1 |
| `textMuted` | 4.51:1 |
| `textSecondary` | 7.07:1 |
| Ink | 16.16:1 |
| White on the red accent | 3.98:1 |
| Blue accent on the page | 2.85:1 |

On the light page `#f6f5f2`: `textMuted` 3.31:1, `textSecondary` 6.03:1, ink 16.44:1.

The ribbon sits 4 px (`mb: 0.5`, `:128`) above a name with `lineHeight: 0.95` (`:164`), so any accented capital (MÉXICO, and later JAPÓN or PERÚ) pokes into it.

The small labels are Anton, a condensed display face whose counters close up at small sizes:

| Label | Size | Tracking |
|---|---|---|
| Ribbon | 0.72rem | 0.25em |
| Spin control | 0.95rem (0.85rem on phones) | 0.22em |
| Enter cue | 0.8rem | 0.2em |
| Caption | 0.8rem | 0.3em |
| Site credit | 0.65rem | — |

Merriweather 400/700/400-italic is already loaded (`index.html:23`).

The direction was checked with a Playwright mock (styles injected over the running app) at 1914×912, 390×844, 1366×600 and in light mode.

## Goals / Non-Goals

**Goals:**
- One clear focal point per row.
- Every label readable at a glance.
- Keep the globe, the accent-tinted portrait, the glow, spin and walkout.
- Remove rather than add: no new dependency, font, request or locale key.

**Non-Goals:**
- The app-shell theme and language toggles.
- Focus-outline colors.
- The wordmark.
- The globe renderer.
- Country pages beyond the shared site credit's font.

## Decisions

### 1. Names are solid fills, dimmed by color, not outlined

- Selected name: `surfaces.textPrimary`. Every other name: `surfaces.textMuted`, which gives 4.51:1 dark and 3.31:1 light, both above the 3:1 minimum for text this large.
- `WebkitTextStroke`, the `::after` offset outline, `data-label` and `NAME_OFFSET_OUTLINE` go.
- `lineHeight` goes from 0.95 to 1, so accented capitals stay inside the name's own box.
- Beat: a thicker outline. Hollow letters carry half the ink of a filled glyph at any stroke width. Color is the de-emphasis tool that keeps the word whole.

### 2. The ribbon becomes a discipline line under the name

The line is plain text with no box, stars or skew:
- `BODY_FONT`, 0.95rem, sentence case (the locale strings already are), normal letter spacing.
- Content: `{discipline} · {count}`. The separator is at reduced opacity.
- The count segment is weight 700.
- Colors: the line is `textSecondary` on every row. The count is `textPrimary` on the selected row and `textSecondary` elsewhere.
- The discipline is always present, so the line exists before the summary arrives. The count fades in as today with no height change. The line stays `aria-hidden`; the link's `aria-label` already carries it.

Placing it under the name removes the collision with accents for good.

Beat: keeping the ribbon, moved below and enlarged. That leaves three skewed boxes with stars, small Anton, and white on red at 3.98:1, which is the same noise in a new place.

### 3. Type rule: Anton at 20 px or larger, Merriweather below

- Anton is used only at 20 px or more, with at most 0.12em tracking on capitals (the 5–12% guideline for caps). Everything smaller is Merriweather.
- The wordmark is the one exemption. It is a logotype, and at 0.95rem on phones it shares the header row with the toggles; a bigger size would collide with them at 390 px.
- Resulting sizes:

| Element | Font and size |
|---|---|
| Bout number | Anton 1.25rem, 0.05em |
| Spin control | Anton 1.25rem, 0.1em |
| Enter cue | Merriweather 1rem; the touch label 0.8rem |
| Fighter name in the caption | Merriweather 0.95rem |
| Coordinates | Merriweather italic 0.85rem |
| Site credit | Merriweather 0.8rem, no uppercase, normal spacing |

### 4. Information text is never drawn in the accent color

- The discipline line, the enter cue (label and arrow) and the spin control's label and hover use the theme ink tokens. Blue at 2.85:1 and white on red at 3.98:1 rule out accent-colored text.
- The accent stays on the globe, glow, portrait, walkout and the selected bout number. The bout number is `aria-hidden`, carries no information (registry order) and is 20 px, so it is decorative. It is also the bill's one link to the country color.
- Unselected bout numbers use `textMuted`.

### 5. "Gira el mundo" is outlined Anton at 1.25rem

- Anton 1.25rem at 0.1em on every breakpoint, `minHeight: 52`, `px: 3`, icon gap 1.5.
- The skew goes, along with `CONTROL_SKEW` and `CONTROL_LABEL_UNSKEW`.
- The border stays at 38% ink (3.3:1, which passes the 3:1 minimum for control borders).
- Hover sets the border to `textPrimary` with a 6% ink fill instead of accent text.
- With the ribbons gone, it is the only boxed element on the page, so it reads as the button without extra weight.
- Beat, filled with ink: it becomes the brightest element in the left column and pulls the eye off the selected country, which is the main action.
- Beat, Merriweather bold: very readable, but it reads like the discipline lines and loses its button voice.

### 6. The stage drops the watermark and texture; coordinates join the caption

- `LandingStage` deletes:
  - the ISO watermark `MotionBox`, which remounts with a scale animation on every selection (`key={selectedEntry.isoCode}`), so every 4.5 s tour step;
  - the texture box and its mask;
  - the top-right coordinates;
  - their constants and the `motion` import.
- It passes the formatted `coordinates` to `StagePortrait`.
- `StagePortrait` renders one caption block at the foot of the stage: the fighter's name, only while the selected portrait is shown, above the coordinates, which are always shown. Both lines use `textSecondary`.
- The coordinates stay in their own element, so `getByText` on them keeps working.
- Beat: lifting the portrait load state into `LandingStage` so it can render the caption itself. That is more props and state for the same output; the caption already lives where the load state is.

### 7. The site credit changes font everywhere

- `SiteCredit` is shared with `CountryPage.tsx:166`, and only its font changes.
- Beat: a landing-only variant. That would be a second style path for one line of text, and the Anton-at-10 px problem is the same on country pages.

## Risks / Trade-offs

- **Less poster character.** The Anton names, the skewed walkout, glow, portrait and globe all stay, and the mock kept the bill bold.
- **Row heights change** (line height 1, line moved below) → check 390×844 and 1366×600. The mock fit both with counts shown.
- **More Merriweather on screen** means more text swaps in when the Google font arrives (`display=swap`). The tagline already does this, so it is acceptable.
- **jsdom cannot assert the styling** → tests cover text and structure; colors, sizes and contrast are manual checks.

## Open Questions

- none
