# Keep the pause toggle from showing on hover while the title card is up

## 1. Centre zone

- [x] 1.1 In `CinematicHero`, set the centre zone to `pointer-events: none` while the title card covers a playback start and the toggle is not showing its play icon
- [x] 1.2 Tests: the zone ignores the pointer during the boot, the countdown and after a fight switch, takes it again once the card lifts, and stays clickable when the play icon is shown over the card (autoplay not allowed, paused)

## 2. Verification

- [x] 2.1 Run `/axl:verify`
- [x] 2.2 On a desktop country page, hover the centre during "Preparando la pelea" and the countdown: no pause toggle appears; after the card fades, hovering the centre shows it again
