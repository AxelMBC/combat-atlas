# Leave the bout number out of the fighter names billed from a fight title

## 1. Billing

- [x] 1.1 Strip a trailing uppercase Roman bout number from the title in `splitFightersFromTitle` (`src/utils/fightBilling.ts`) before splitting it into the two fighters
- [x] 1.2 Cover `… vs Andy Ruiz I`, `… vs. Gennadiy Golovkin III` and a `Jr` name (`Julio Cesar Chavez Jr`, kept) in `src/utils/fightBilling.test.ts`

## 2. Verification

- [x] 2.1 Run `/axl:verify`
- [x] 2.2 Open a country page whose hero plays a rematch (e.g. Mexico's `Canelo Alvarez vs Gennadiy Golovkin I`): the title card bills `GENNADIY` above `GOLOVKIN`, with no `I` as the surname, and the fight info section reads `… vs Gennadiy Golovkin`
