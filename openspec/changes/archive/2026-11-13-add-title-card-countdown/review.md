# Review: add-title-card-countdown

Snapshot: 96e5b021fe9797e8b8fdbea191abcdd3dd0d90de

Scope: diff against HEAD `206944f`. The commits between `dev` and HEAD belong to the archived `hero-cover-youtube-start-chrome` change, which has its own review.

No findings.

Notes (not findings, optional via `/axl:tweak`):

- Moving `clearStartChromeTimer()` into `coverPlaybackStart` would make "countdown not started" always mean "no hide timer armed". Today the `onReady` call site relies on no timer being armed yet.
- The hero's 350 ms fade is repeated in `RevealIndicator.tsx` and five places in `CinematicHero.tsx`; it could be one shared constant.
- Unproven until the running app: on short heroes (1366×650, 900×560, 390×844) the taller last grid row could push the names off centre or be clipped by the card's `overflow: hidden` (task 6.3, the design's own flagged risk).
