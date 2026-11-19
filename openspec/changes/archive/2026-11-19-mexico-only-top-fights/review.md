# Review: mexico-only-top-fights

Snapshot: 002dda9e438e76be62da67b5446661b172465211

No findings.

## Decisions

- `country.thailand.topEventsTitle` and `country.unitedStates.topEventsTitle` are no longer read (`src/i18n/locales/es.ts:37,41`, `src/i18n/locales/en.ts:39,43`). Kept on purpose while the section is Mexico-only for now; delete them from both locales if it won't come back.
- The "Top-fights section is opt-in per country" requirement has no automated test; `CountryPage` has no render test and the scenario is covered only by the manual check in tasks 2.2.
- `.claude/commands/add-country.md:44,68` predates this change and still describes an old config shape (`topEventsTitle` as a raw string, `@/components/CountryPage` paths); separate tweak.
