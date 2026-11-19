# Show the top-fights section on Mexico only

## 1. Opt-in top-fights section

- [x] 1.1 Make `topEventsTitleKey` optional in `CountryPageConfig` and render `TopFights` in `CountryPage` only when it is set
- [x] 1.2 Remove `topEventsTitleKey` from the Thailand and United States configs
- [x] 1.3 Note in `_CountryTemplate/CONTRIBUTING.md` that omitting `topEventsTitleKey` hides the section

## 2. Verification

- [x] 2.1 Run `/axl:verify`
- [x] 2.2 Open `/thailand` and `/united-states`: no top-fights section below the fighters; open `/mexico`: "Peleas Históricas" still shows its poster cards
