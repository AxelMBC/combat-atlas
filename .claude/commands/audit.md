---
description: Senior-level audit of the codebase with a 1-10 score per dimension and an overall grade
argument-hint: [path-or-scope]
---

Perform an in-depth code audit and produce a 1-10 score. Act as a **senior frontend engineer** with a clean-code, efficiency-first mindset. Be honest and specific — no sycophancy, no padding. If something is sloppy, say so. If something is well-built, say so. Vague praise is worse than no review.

## Scope

- **`$1` provided** — audit only that path (file, folder, or glob).
- **`$1` empty** — audit the uncommitted/changed files on the current branch (`git status` + `git diff`). If the working tree is clean, audit the diff vs `master` (`git diff master...HEAD`).
- If both are empty, ask the user what to audit. Do not audit the entire `src/` tree by default — that produces shallow review.

State the scope explicitly before starting, then read every file in scope. Do not skim.

## Project rules to enforce

These come from `CLAUDE.md` and user memory — violations cost points:

- **Arrow functions only** for component/function declarations (no `function foo() {}`).
- **Types live in `*.types.ts`** — no inline interfaces/types declared next to components when reused.
- **Path alias `@/*`** for cross-module imports — relative paths only within the same module.
- **`src/services/api.ts` Axios instance** is the only allowed network entry point.
- **Country pages** must follow the registry pattern (`src/pages/countries/registry.ts`); no router edits.
- **Spanish UI copy** — flag English strings that are user-visible.
- **MUI v7 + SCSS** — flag inline styles or one-off CSS-in-JS where the theme or SCSS would do.

## Dimensions (each scored 1-10)

For each dimension: **score**, **one-sentence verdict**, **concrete evidence with `file:line` refs**, and **the single highest-leverage fix**.

1. **Type Safety** — `any`, unsafe casts, missing return types on public APIs, `as` shortcuts, untyped props, optional chains hiding real nulls.
2. **React Correctness** — hook deps, stale closures, key misuse, effects that should be derived state, unmount cleanup, conditional hooks, controlled/uncontrolled drift.
3. **Component Design** — single responsibility, prop surface, prop drilling vs context vs Redux, composition vs configuration, dead props, oversized components (>200 LOC is suspicious).
4. **State Management** — Redux slice boundaries, selector hygiene, derived data computed in render vs memoized, sessionStorage cache correctness (TTL, invalidation), unnecessary global state.
5. **Performance** — render cost, missing memoization where it matters (and *spurious* memoization where it doesn't), list keys, image sizing, lazy boundaries, bundle implications of imports (e.g. `import * from 'lodash'`).
6. **Readability & Naming** — identifier clarity, comment quality (per project rule: comments should explain *why*, not *what*), function length, magic numbers/strings, duplicated logic.
7. **Architecture & Boundaries** — layering (pages → components → services), circular imports, leaks (services importing components, etc.), adherence to the registry/router pattern, alias usage.
8. **Styling** — theme tokens vs hex literals, responsive behavior, SCSS structure, MUI `sx` overuse, dead styles, specificity wars.
9. **Error & Loading UX** — error boundaries, fallbacks, empty states, retry affordances, network failure paths, race conditions on rapid navigation.
10. **Accessibility** — semantic HTML, alt text, focus management, keyboard paths, color-contrast risks visible in the code, ARIA misuse.

## Scoring rubric

- **10** — Exceptional. Would pass review at a top-tier shop with no comments.
- **8-9** — Solid senior work; minor nits.
- **6-7** — Ships, but has clear weaknesses a reviewer would flag.
- **4-5** — Works but is fragile or sloppy; meaningful rework needed.
- **1-3** — Broken patterns, real bugs, or anti-patterns dominating the code.

Be willing to give low scores. A 7 average is *not* the default — calibrate honestly. If the code is genuinely good, a 9 is fine. If it's genuinely bad, a 4 is fine.

## Process

1. Resolve scope. Print: `Auditing: <list of files>` (count + paths).
2. Run `yarn tsc -b --noEmit` and `yarn lint` and capture failures — these feed into Type Safety / Readability scores.
3. Read every file in scope fully.
4. For each dimension, gather evidence before scoring. No score without at least one cited line (or an explicit "no issues found").
5. Cross-check against the project rules above.
6. Compute the overall score as a **weighted** average, not a flat mean:
   - Type Safety, React Correctness, Architecture: **weight 1.5**
   - State, Performance, Readability, Component Design: **weight 1.0**
   - Styling, Error UX, Accessibility: **weight 0.7**
7. Write the report **both to the terminal and to disk** (see "Saving the report" below).

## Saving the report

Every run **must** persist the full report as a markdown file. This is not optional.

- **Directory** — `audit-reports/` at the repo root. Create it if it does not exist.
- **Gitignore** — if `audit-reports/` is not already ignored, append `audit-reports/` to `.gitignore` so reports never get committed. Do this silently (no need to ask).
- **Filename** — `audit-YYYY-MM-DD_HH-mm-ss[_<scope-tag>].md`, where:
   - The timestamp is the local time at the moment the command runs (e.g. `audit-2026-04-26_14-32-08.md`).
   - `<scope-tag>` is a short slug derived from `$1` if provided (e.g. `audit-2026-04-26_14-32-08_src-pages-mexico.md`); omit it for the default branch-diff scope.
- **Content** — the exact same markdown produced for the terminal, with one addition at the top: a metadata block placed immediately after the `# Audit — ...` heading:

  ```
  > **Run:** <ISO timestamp>
  > **Scope:** <resolved scope description>
  > **Branch:** <current git branch> @ <short SHA>
  > **Overall score:** X.X / 10
  ```

- **Never overwrite** an existing report — the timestamp guarantees uniqueness, but if a collision somehow happens, append `-1`, `-2`, … until the path is free.
- After writing, print the absolute path of the saved report on its own line as the final line of your terminal output: `Saved: <absolute-path>`.

## Report format

```
# Audit — <scope summary>

**Overall: X.X / 10** — <one-line headline verdict>

## Dimension scores
| Dimension              | Score | Verdict                                  |
|------------------------|-------|------------------------------------------|
| Type Safety            | X/10  | ...                                      |
| React Correctness      | X/10  | ...                                      |
| Component Design       | X/10  | ...                                      |
| State Management       | X/10  | ...                                      |
| Performance            | X/10  | ...                                      |
| Readability & Naming   | X/10  | ...                                      |
| Architecture           | X/10  | ...                                      |
| Styling                | X/10  | ...                                      |
| Error & Loading UX     | X/10  | ...                                      |
| Accessibility          | X/10  | ...                                      |

## Findings (ordered by impact)
### 🔴 Critical — fix before merge
- `path/to/file.tsx:42` — <issue>. Fix: <action>.

### 🟡 Important — should fix
- `path/to/file.tsx:88` — <issue>. Fix: <action>.

### 🟢 Nits & style
- `path/to/file.tsx:12` — <issue>.

## What this code does well
- <2-4 specific things, with file refs — keeps the review balanced and signals what to keep doing>

## Top 3 highest-leverage changes
1. <change> — affects <files> — moves <dimension> from X to Y.
2. ...
3. ...

## Tooling output
- `tsc`: <pass/fail + count>
- `eslint`: <pass/fail + count>
```

## Hard rules

- No score without cited evidence.
- No generic advice ("consider extracting components"). Every finding names a file, a line, and a concrete fix.
- Do not invent issues to pad the list. If a dimension is clean, score it high and say so in one line.
- Do not modify any project code during the audit — this is read-only. The only files you may write are the report file under `audit-reports/` and (if needed) the `.gitignore` entry for that directory. If the user wants code fixes, they will ask in a follow-up.
- The report file must always be written, even if the audit finds zero issues or the tooling commands fail.
