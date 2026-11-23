# watch-history

## Purpose

The browser remembers which pool fights a visitor has watched, so each country serves unseen fights first and every page counts what is left the same way. A pool fight is recorded when the hero starts playing it, and the history lives in `localStorage`, shared by tabs and kept across sessions, falling back to empty when storage is missing or unreadable. The country page shows the count in its "Now playing" header with a progress rail, and "Another Fight" turns into "Start over" once nothing else is left, which clears only that country's fights. The landing drops fights that no longer belong to any country's pool.

## Requirements

### Requirement: Watched fights are remembered in the browser
The app SHALL keep the `_id` of every watched pool fight as one JSON array of unique strings under the `localStorage` key `watchedFights`, shared by every tab and kept across sessions, and SHALL treat a missing, unreadable or unavailable value as an empty history without showing an error.

#### Scenario: History survives the session
- **WHEN** the user watches a Thailand fight, closes the browser, and opens `/` the next day
- **THEN** the Thailand row counts that fight as watched

#### Scenario: Corrupt value
- **WHEN** `watchedFights` holds text that is not a JSON array of strings
- **THEN** the landing and country pages render as with an empty history, no error is shown, and the next recorded fight replaces the value with a valid array holding only that fight's id

#### Scenario: Storage unavailable
- **WHEN** reading or writing `localStorage` throws, as in some private browsing modes
- **THEN** every page works, counts as with an empty history, and shows no error

#### Scenario: Two tabs
- **WHEN** tab A records fight X while tab B, opened before X was recorded, records fight Y
- **THEN** the stored array holds both X and Y

### Requirement: A pool fight is recorded when it starts playing
A country page SHALL add a fight's `_id` to the watch history when the hero reports `PLAYING` for it, if the fight is one of the country's pool fights (`allFights`), and SHALL NOT record a fight that never reaches `PLAYING` or that is not a pool fight.

#### Scenario: Autoplay on entry
- **WHEN** a country page loads and the hero's first fight starts playing on its own
- **THEN** that fight's `_id` is in the watch history and the count in the "Now playing" header drops by one

#### Scenario: Skipped after it started
- **WHEN** a fight has been playing for 3 seconds and the user activates "Another Fight"
- **THEN** the skipped fight is recorded as watched

#### Scenario: Skipped before it started
- **WHEN** the user activates "Another Fight" while the title card is still waiting for the first `PLAYING`
- **THEN** the skipped fight is not recorded

#### Scenario: Autoplay refused or reduced motion
- **WHEN** the hero's fight never starts because autoplay was refused or reduced motion is preferred
- **THEN** nothing is recorded until the user starts playback with the play toggle

#### Scenario: Historic fight
- **WHEN** the user plays a fight from the "Historic Fights" section
- **THEN** the watch history is unchanged

#### Scenario: Buffering and replays
- **WHEN** the player reports `PLAYING` again for a fight already recorded, after buffering or a replay
- **THEN** the stored array still holds that id once

### Requirement: The country page serves unwatched fights first
On a country page, the first fight, every "Another Fight" pick and every fighter-card pick SHALL be a pool fight that is not in the watch history and is not the fight in the hero, preferring fights not yet shown during this visit, and the first fight SHALL be a random pool fight only when every pool fight is watched.

#### Scenario: Entry with partial history
- **WHEN** Thailand has 20 pool fights, 8 of them watched, and the user enters `/thailand`
- **THEN** the first fight in the hero is one of the 12 unwatched fights

#### Scenario: No repeats within a visit
- **WHEN** autoplay is refused and the user activates "Another Fight" several times without playing anything
- **THEN** no fight is shown twice while an unwatched fight not yet shown during the visit is left

#### Scenario: Everything already watched
- **WHEN** every Thailand pool fight is in the watch history and the user enters `/thailand`
- **THEN** a random pool fight loads in the hero, the "Now playing" header reads "Todas vistas" / "All watched", and the "Another Fight" button reads "Volver a empezar" / "Start over"

#### Scenario: Fighter cards follow the history
- **WHEN** every pool fight of a fighter is watched
- **THEN** that fighter's card shows the exhausted state, and a fighter with an unwatched fight other than the one in the hero stays selectable and loads one of those fights

### Requirement: The country page shows what is left, and Another Fight starts over at the end
The "Now playing" header of the country page SHALL show, on the same line as its title, the number of the country's pool fights not in the watch history, computed by the same function the landing uses, or "Todas vistas" / "All watched" when that number is 0, with a progress rail under it filled by the watched share of the pool. The "Another Fight" button SHALL carry only its own action label, SHALL read "Volver a empezar" / "Start over" when no unwatched pool fight other than the one in the hero is left, and activating it then SHALL remove every fight of that country's pool from the watch history and load a random pool fight other than the one in the hero.

#### Scenario: Counter matches the landing
- **WHEN** the landing shows "12 POR VER" for Thailand and the user enters `/thailand`
- **THEN** the "Reproduciendo ahora" header shows "12 POR VER" until the first fight starts playing, then "11 POR VER", and back on the landing Thailand's row reads "11 POR VER"

#### Scenario: The button names only its action
- **WHEN** the header shows "12 POR VER"
- **THEN** the button's label and accessible name are "Otro Combate", with no count in it

#### Scenario: Progress rail
- **WHEN** 8 of Thailand's 20 pool fights are in the watch history
- **THEN** the rail under the header is filled to 40% in the country's accent, and assistive technology reads only the header text, not the rail

#### Scenario: Last fight
- **WHEN** the only unwatched Thailand fight is the one playing in the hero
- **THEN** the header reads "TODAS VISTAS" with a full rail, and the button reads "Volver a empezar"

#### Scenario: Start over
- **WHEN** the user activates "Volver a empezar" on Thailand
- **THEN** no Thailand pool fight is in the watch history any more, a different fight loads in the hero, the header reads "20 POR VER" and becomes "19 POR VER" once that fight plays, and the watch history of every other country is unchanged

#### Scenario: Single-fight pool
- **WHEN** a country's pool has exactly one fight
- **THEN** the button is disabled, as it is today

#### Scenario: Phone
- **WHEN** the country page is opened at 390×844
- **THEN** "Reproduciendo ahora" and the count share one line, with the rail under them

#### Scenario: English
- **WHEN** the language is English
- **THEN** the header reads "NOW PLAYING" with "12 TO WATCH", the button reads "Another Fight", and "Start over" at the end

### Requirement: History drops fights that left every pool
When the landing receives a country summary that lists at least one country, the app SHALL remove from the watch history every id that is in no country's `fightIds`, and SHALL leave the history untouched when the summary lists no country or fails to load.

#### Scenario: Watched fight leaves the pool
- **WHEN** the user has watched Mexico fight X, X is then promoted to a top event or deleted, and the user opens `/`
- **THEN** once the summary arrives X is no longer in the watch history and Mexico's row counts only fights still in its pool

#### Scenario: Empty summary
- **WHEN** the summary arrives with no countries
- **THEN** the watch history is unchanged

#### Scenario: Summary fails
- **WHEN** `GET /countries` fails or the endpoint does not exist yet
- **THEN** the watch history is unchanged
