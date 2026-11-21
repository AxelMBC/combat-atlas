## REMOVED Requirements

### Requirement: Explore bar reacts to theme mode
**Reason**: The world map and its bottom explore bar (`CountryChipBar`) are replaced by the World Fight Card landing; the bar no longer exists.
**Migration**: The theme contract moves to `landing-fight-card` — "Landing follows the theme mode" covers the whole landing, globe included.

### Requirement: Explore bar contents remain legible in both modes
**Reason**: The explore bar no longer exists.
**Migration**: Covered by `landing-fight-card` — "Landing follows the theme mode" (palette-driven bill, ribbons readable on every accent, site credit tone by mode).

### Requirement: Explore bar color changes are perceptibly smooth
**Reason**: The explore bar no longer exists.
**Migration**: Covered by `landing-fight-card` — "Landing follows the theme mode" requires every landing surface, the globe included, to transition rather than snap.
