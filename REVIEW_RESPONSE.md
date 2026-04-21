# Code Review — Follow-up Response

Written 2026-04-20, as a senior frontend developer addressing your three questions.

---

## 1. Should you nuke the repo and start over?

**No. Don't do it.**

Since you've already rotated `VITE_MAPTILER_KEY`, the leaked value is dead — it can't be used against you. The only thing left in git history is a worthless string. Destroying the repo to scrub it buys you almost nothing and costs you:

- Every commit hash changes. Any PR, issue, or external link referencing a SHA breaks.
- Collaborators (including future-you on another machine) need to re-clone. Local branches get orphaned.
- You lose the commit history that documents *why* decisions were made (`ab4e0cb`, `e372c49`, `d83f3e9`, etc.) — that history is genuinely useful.
- It signals panic rather than process.

**What to do instead:**

1. Confirm the old key is revoked in the MapTiler dashboard (you say it is — good).
2. Move the new key to `.env.local` (gitignored by Vite).
3. Commit a `.env.example` with placeholder values so contributors know what variables exist.
4. Add a pre-commit hook (`gitleaks` or similar) so a future leak is caught before it lands.

The rule of thumb: **rotate the secret, don't rewrite history** — unless the secret was high-value (payment keys, prod DB creds, signing keys). A public-tier map tiles key doesn't meet that bar.

If you *really* want to scrub it for your own peace of mind, use `git filter-repo` to rewrite only the `.env` file's history. That's a surgical fix, not a nuclear one. Still, I'd skip it.

---

## 2. On the Mexico vs Thailand data-flow split

Your intent is legitimate. I'll update my critique.

**Your argument:** hardcoded static data lets a non-backend contributor open a PR adding a country without needing DB credentials. That's a real contributor-experience benefit, and it's not something I weighted in the original review.

**But the implementation still has the flaw.** "Ease of contribution" doesn't require bypassing Redux — it requires a stable contribution path. You can have both:

```
CountryRouter → dispatch(fetchCountry(slug))
                     ↓
              thunk checks registry entry
                     ↓
    ┌────────────────┴────────────────┐
    │                                 │
API-backed countries          Static-data countries
(getCountryData)              (import from local file)
    │                                 │
    └────────────────┬────────────────┘
                     ↓
           same slice, same selector,
           same loading/error UI
```

The `registry.ts` entry declares *how* to load: `{ slug, source: "api" | "static", loader }`. The thunk dispatches the right loader. Consumers never know the difference. Contributors adding a static country just add a file and a registry entry — same ergonomics you have today, without the architectural split.

So: **your goal is right, keep it. The current code doesn't yet achieve it cleanly.** Promote the Thailand path into the same Redux flow so page components don't branch on data source.

Adjusted severity: P1 → P2. Still worth fixing, but the intent behind it is defensible.

---

## 3. Adjusted overall score

Updated with the two new data points (key rotated, consistency-split has intentional rationale).

| Category | Old | New | Reason for change |
|---|---|---|---|
| Security | 5/10 | 7/10 | Key rotated. History still contains it, but the exposure is defused. Pre-commit scanning would push this to 8. |
| Consistency | 5.5/10 | 6/10 | Intent is valid. Implementation still branches on data source at the component layer, which is the real smell. |
| Project structure | 8/10 | 8/10 | Unchanged — registry pattern is genuinely good. |
| TypeScript | 7/10 | 7/10 | `startTime` mismatch still exists. |
| Hooks & state | 7.5/10 | 7.5/10 | Unchanged. |
| Styling | 6/10 | 6/10 | Hardcoded hex values in `sx` props still present. |
| Error handling | 4/10 | 4/10 | No production observability. |
| Testing | 1/10 | 1/10 | No test runner, no tests. This is the single biggest drag on the score. |
| Performance | 7.5/10 | 7.5/10 | Code splitting, memo, debouncing, caching all good. |
| Accessibility | 6.5/10 | 6.5/10 | iframe `title` still missing. |

**Overall: 6.8 / 10** (up from 6.5)

### Honest read

You're a competent mid-level engineer with senior instincts on a few things (the registry pattern, the 30-minute sessionStorage cache, `useMainVideoQueue`). What's holding the score under 8 is not bad code — it's *missing* infrastructure:

- No tests at all.
- No error tracking.
- No pre-commit automation.
- No validation extraction.

None of these are hard to add. The fastest path from 6.8 to 8+ isn't rewriting features, it's installing the safety net:

1. Vitest + one thunk test + one hook test — a weekend.
2. Sentry free tier, one `init()` call — an hour.
3. Husky + lint-staged + gitleaks — an hour.
4. Extract `validateEventForm` — an hour.

Do those four things and you'd honestly be at 8/10 without touching a single feature.

Your defense on the security point is fair. Your defense on the consistency point has the right goal but doesn't fully excuse the current implementation. Keep the ambition; clean up the seam.
