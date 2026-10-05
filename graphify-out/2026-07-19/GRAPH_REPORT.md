# Graph Report - .  (2026-06-28)

## Corpus Check
- 227 files · ~96,017 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 547 nodes · 816 edges · 40 communities (32 shown, 8 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 81 edges (avg confidence: 0.85)
- Token cost: 264,248 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Country Page & Theme Config|Country Page & Theme Config]]
- [[_COMMUNITY_Error Boundaries & Fallbacks|Error Boundaries & Fallbacks]]
- [[_COMMUNITY_Event Ingestion Form|Event Ingestion Form]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Project Specs & Hero Design Docs|Project Specs & Hero Design Docs]]
- [[_COMMUNITY_App Shell & Feedback Modal|App Shell & Feedback Modal]]
- [[_COMMUNITY_Cinematic Hero & Fullscreen Hook|Cinematic Hero & Fullscreen Hook]]
- [[_COMMUNITY_API Client & Services|API Client & Services]]
- [[_COMMUNITY_Country Redux Slice|Country Redux Slice]]
- [[_COMMUNITY_OpenSpec Workflow Tooling|OpenSpec Workflow Tooling]]
- [[_COMMUNITY_Dev & Test Dependencies|Dev & Test Dependencies]]
- [[_COMMUNITY_i18n Language Provider|i18n Language Provider]]
- [[_COMMUNITY_App TypeScript Config|App TypeScript Config]]
- [[_COMMUNITY_Fight Event Types & Utils|Fight Event Types & Utils]]
- [[_COMMUNITY_Theme Palette & Mode|Theme Palette & Mode]]
- [[_COMMUNITY_Thailand Fights & Fighters|Thailand Fights & Fighters]]
- [[_COMMUNITY_Loading Spinner & Typewriter|Loading Spinner & Typewriter]]
- [[_COMMUNITY_Country Template Scaffold|Country Template Scaffold]]
- [[_COMMUNITY_Node TypeScript Config|Node TypeScript Config]]
- [[_COMMUNITY_Fight Card Component|Fight Card Component]]
- [[_COMMUNITY_Fighter Card & Scroll Focus|Fighter Card & Scroll Focus]]
- [[_COMMUNITY_Thailand Fighter Portraits|Thailand Fighter Portraits]]
- [[_COMMUNITY_Mexico Boxer Portraits|Mexico Boxer Portraits]]
- [[_COMMUNITY_Country Stats & Localization|Country Stats & Localization]]
- [[_COMMUNITY_Country Page & Top Fights|Country Page & Top Fights]]
- [[_COMMUNITY_Fight Info Section|Fight Info Section]]
- [[_COMMUNITY_Project Commands & Conventions|Project Commands & Conventions]]
- [[_COMMUNITY_US Wrestler Portraits|US Wrestler Portraits]]
- [[_COMMUNITY_Top Fighters Section|Top Fighters Section]]
- [[_COMMUNITY_Root TypeScript Config|Root TypeScript Config]]
- [[_COMMUNITY_Video Placeholder Images|Video Placeholder Images]]
- [[_COMMUNITY_Vercel Deploy Config|Vercel Deploy Config]]
- [[_COMMUNITY_YouTube Attribution Tasks|YouTube Attribution Tasks]]
- [[_COMMUNITY_Hero Fullscreen Tasks|Hero Fullscreen Tasks]]
- [[_COMMUNITY_Scroll-Focus Cards Tasks|Scroll-Focus Cards Tasks]]

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 19 edges
2. `compilerOptions` - 17 edges
3. `compilerOptions` - 11 edges
4. `scripts` - 8 edges
5. `ErrorBoundary` - 6 edges
6. `SurfacePalette` - 6 edges
7. `ThemeModeContextValue` - 6 edges
8. `OpenSpec Sync Specs Skill` - 6 edges
9. `OpenSpec CLI` - 6 edges
10. `LanguageContextValue` - 5 edges

## Surprising Connections (you probably didn't know these)
- `OPSX Apply Prompt` --semantically_similar_to--> `OpenSpec Apply Change Skill`  [INFERRED] [semantically similar]
  .github/prompts/opsx-apply.prompt.md → .claude/skills/openspec-apply-change/SKILL.md
- `OpenSpec Apply Change Skill (GitHub)` --semantically_similar_to--> `OpenSpec Apply Change Skill`  [INFERRED] [semantically similar]
  .github/skills/openspec-apply-change/SKILL.md → .claude/skills/openspec-apply-change/SKILL.md
- `OPSX Sync Prompt` --semantically_similar_to--> `OpenSpec Sync Specs Skill`  [INFERRED] [semantically similar]
  .github/prompts/opsx-sync.prompt.md → .claude/skills/openspec-sync-specs/SKILL.md
- `OpenSpec Sync Specs Skill (GitHub)` --semantically_similar_to--> `OpenSpec Sync Specs Skill`  [INFERRED] [semantically similar]
  .github/skills/openspec-sync-specs/SKILL.md → .claude/skills/openspec-sync-specs/SKILL.md
- `README Getting Started` --semantically_similar_to--> `CLAUDE.md Project Guidance`  [INFERRED] [semantically similar]
  README.md → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **OpenSpec Change Lifecycle (explore to archive)** — claude_commands_opsx_explore_opsx_explore_command, claude_commands_opsx_propose_opsx_propose_command, claude_commands_opsx_apply_opsx_apply_command, claude_commands_opsx_sync_opsx_sync_command, claude_commands_opsx_archive_opsx_archive_command [INFERRED 0.85]
- **YouTube Attribution OpenSpec Change** — openspec_changes_archive_2026_06_21_add_youtube_attribution_proposal_youtube_attribution, openspec_changes_archive_2026_06_21_add_youtube_attribution_design_youtube_attribution, openspec_changes_archive_2026_06_21_add_youtube_attribution_specs_youtube_attribution_spec_youtube_attribution, openspec_changes_archive_2026_06_21_add_youtube_attribution_tasks_youtube_attribution [EXTRACTED 1.00]
- **Hero Native Fullscreen OpenSpec Change** — openspec_changes_archive_2026_06_26_hero_native_fullscreen_proposal_hero_fullscreen, openspec_changes_archive_2026_06_26_hero_native_fullscreen_design_hero_fullscreen, openspec_changes_archive_2026_06_26_hero_native_fullscreen_specs_hero_fullscreen_spec_hero_fullscreen, openspec_changes_archive_2026_06_26_hero_native_fullscreen_tasks_hero_fullscreen [EXTRACTED 1.00]
- **Mobile Scroll-Focus Cards OpenSpec Change** — openspec_changes_archive_2026_06_26_mobile_scroll_focus_cards_proposal_scroll_focus_cards, openspec_changes_archive_2026_06_26_mobile_scroll_focus_cards_design_scroll_focus_cards, openspec_changes_archive_2026_06_26_mobile_scroll_focus_cards_specs_scroll_focus_cards_spec_scroll_focus_cards, openspec_changes_archive_2026_06_26_mobile_scroll_focus_cards_tasks_scroll_focus_cards [EXTRACTED 1.00]

## Communities (40 total, 8 thin omitted)

### Community 0 - "Country Page & Theme Config"
Cohesion: 0.07
Nodes (27): ErrorFallback(), ErrorFallbackProps, ColorPalette, CountryPageConfig, CountryPageProps, EventForm(), mexicoConfig, theme (+19 more)

### Community 1 - "Error Boundaries & Fallbacks"
Cohesion: 0.09
Nodes (17): ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, MapFallback(), MapFallbackProps, NotFound(), NotFoundProps, root (+9 more)

### Community 2 - "Event Ingestion Form"
Cohesion: 0.09
Nodes (16): FieldError, FieldErrors, CORNER_COLORS, CORNER_LABEL_KEYS, FighterSelector(), Corner, FighterSelectorProps, FormSectionProps (+8 more)

### Community 3 - "Runtime Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, axios, @emotion/react, @emotion/styled, @fortawesome/fontawesome-svg-core, @fortawesome/free-solid-svg-icons, @fortawesome/react-fontawesome, framer-motion (+21 more)

### Community 4 - "Project Specs & Hero Design Docs"
Cohesion: 0.09
Nodes (28): CLAUDE.md Project Guidance, Cinematic Hero for Country Pages SPEC, CinematicHero Component, createCountryTheme / CountryPageConfig, Atlas App HTML Shell, YouTube Attribution Change Design, YouTube Attribution Change Proposal, YouTube Attribution Delta Spec (+20 more)

### Community 5 - "App Shell & Feedback Modal"
Cohesion: 0.11
Nodes (14): FeedbackModal(), FeedbackModalProps, FeedbackVariant, VariantStyles, VARIANT_STYLES, LanguageToggle(), SiteCredit(), SiteCreditProps (+6 more)

### Community 6 - "Cinematic Hero & Fullscreen Hook"
Cohesion: 0.11
Nodes (16): bob, chipSx, CinematicHero(), CinematicHeroProps, LockableScreenOrientation, UseHeroFullscreenResult, getOrientation(), lockLandscape() (+8 more)

### Community 7 - "API Client & Services"
Cohesion: 0.11
Nodes (11): api, AxiosErrorShape, RejectionHandler, { requestMock, getOnRejected, setOnRejected }, eventIngestionSlice, initialForm, initialState, EventFormData (+3 more)

### Community 8 - "Country Redux Slice"
Cohesion: 0.13
Nodes (13): countrySlice, initialState, initialState, CountryState, fetchCountry, SessionCache, makeEvent(), makeFighter() (+5 more)

### Community 9 - "OpenSpec Workflow Tooling"
Cohesion: 0.12
Nodes (23): OpenSpec CLI, OPSX Apply Command, OPSX Archive Command, OPSX Explore Command, OpenSpec Change Workflow, OPSX Propose Command, Delta Spec Format, OPSX Sync Command (+15 more)

### Community 10 - "Dev & Test Dependencies"
Cohesion: 0.10
Nodes (21): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom, prettier (+13 more)

### Community 11 - "i18n Language Provider"
Cohesion: 0.23
Nodes (11): Language, LanguageContextValue, LanguageProviderProps, TranslateFn, TranslationParams, LanguageContext, detectInitialLanguage(), isLanguage() (+3 more)

### Community 12 - "App TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+11 more)

### Community 13 - "Fight Event Types & Utils"
Cohesion: 0.15
Nodes (8): FightDecision, FightDivision, FightVenue, LocalizedString, LocalizedTags, MainEvent, pickRandomEvent(), shuffleArray()

### Community 14 - "Theme Palette & Mode"
Cohesion: 0.30
Nodes (9): DARK_PALETTE, LIGHT_PALETTE, SurfacePalette, ThemeMode, ThemeModeContextValue, ThemeModeProviderProps, ThemeModeContext, detectInitialMode() (+1 more)

### Community 15 - "Thailand Fights & Fighters"
Cohesion: 0.15
Nodes (13): Thailand, Pornsanae Sitmonchai vs Pakorn Sakyothin I, Ramon Dekkers vs Coban Lookchaomaesaitong II, Sakmongkol Sithchuchok vs Jongsanan Fairtex V, Samart Payakaroon vs Dieselnoi Chor Thanasukarn, Coban Lookchaomaesaitong, Dieselnoi Chor Thanasukarn, Jongsanan Fairtex (+5 more)

### Community 16 - "Loading Spinner & Typewriter"
Cohesion: 0.26
Nodes (7): Spinner(), SpinnerProps, SpinnerSize, EMPTY_PHRASES, TAGLINE_KEYS, UseTypewriterOptions, useTypewriter()

### Community 17 - "Country Template Scaffold"
Cohesion: 0.24
Nodes (5): countryConfig, theme, mainEventFights, topEvents, topFightersData

### Community 18 - "Node TypeScript Config"
Cohesion: 0.15
Nodes (12): compilerOptions, allowImportingTsExtensions, lib, module, moduleDetection, moduleResolution, noEmit, skipLibCheck (+4 more)

### Community 19 - "Fight Card Component"
Cohesion: 0.22
Nodes (5): FIGHT_FALLBACKS, FightFallback, resolveFallback(), FightCard, CardEventProps

### Community 20 - "Fighter Card & Scroll Focus"
Cohesion: 0.27
Nodes (5): UseScrollFocusOptions, UseScrollFocusResult, FighterCard, FighterCardProps, FighterCardVariant

### Community 21 - "Thailand Fighter Portraits"
Cohesion: 0.25
Nodes (9): Apidej Sit Hirun, Dieselnoi Chor Thanasukarn, Namsaknoi Yudthagarngamtorn, Saenchai, Samart Payakaroon, Samart Payakaroon (action), Liam Harrison vs Muangthai PK.Saenchai, Pongsiri Rambo Por Ruamrudee vs Pairojnoi Sor Siamchai (+1 more)

### Community 22 - "Mexico Boxer Portraits"
Cohesion: 0.36
Nodes (8): Mexico (country), Boxing (discipline), No Fighter Placeholder (silhouette), Canelo Alvarez (boxer portrait), Juan Manuel Marquez (boxer portrait), Julio Cesar Chavez (boxer in ring) AMBIGUOUS, Fighter Placeholder Image, Salvador Sanchez (boxer in ring) AMBIGUOUS

### Community 23 - "Country Stats & Localization"
Cohesion: 0.32
Nodes (3): CountryStats, getCountryStats(), resolveLocalizedTags()

### Community 25 - "Fight Info Section"
Cohesion: 0.29
Nodes (3): FightInfoSection, MotionButton, FightInfoSectionProps

### Community 26 - "Project Commands & Conventions"
Cohesion: 0.33
Nodes (7): Add Country Command, Country Registry Pattern, Codebase Audit Command, Project Code Style Rules, Check Command, Combat Atlas Frontend Guidelines (Copilot), Neo-brutalist Design

### Community 27 - "US Wrestler Portraits"
Cohesion: 0.33
Nodes (6): United States, Cael Sanderson, Dan Gable, John Smith, Jordan Burroughs, Kyle Snyder

## Knowledge Gaps
- **181 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+176 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTranslation()` connect `App Shell & Feedback Modal` to `Country Page & Theme Config`, `Error Boundaries & Fallbacks`, `Event Ingestion Form`, `Cinematic Hero & Fullscreen Hook`, `i18n Language Provider`, `Loading Spinner & Typewriter`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `CountryPage()` connect `App Shell & Feedback Modal` to `Country Page & Top Fights`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `useThemeMode()` connect `App Shell & Feedback Modal` to `Theme Palette & Mode`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Are the 18 inferred relationships involving `useTranslation()` (e.g. with `ErrorFallback()` and `FeedbackModal()`) actually correct?**
  _`useTranslation()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _181 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Country Page & Theme Config` be split into smaller, more focused modules?**
  _Cohesion score 0.06509803921568627 - nodes in this community are weakly interconnected._
- **Should `Error Boundaries & Fallbacks` be split into smaller, more focused modules?**
  _Cohesion score 0.08907563025210084 - nodes in this community are weakly interconnected._