# localized-errors Specification

## Purpose

Route every user-visible error message through the i18n layer: the store holds `TranslationKey`s, rendering translates them for the active language, and raw backend/Axios text never reaches the UI.

## Requirements

### Requirement: User-visible errors resolve through i18n

Every error message shown to a user SHALL be produced by translating a `TranslationKey` (defined in both `es` and `en` locales) at render time. Thunks SHALL reject with translation keys; services SHALL NOT contain user-facing copy. Raw backend/Axios message text SHALL NOT be rendered.

#### Scenario: Country data fetch fails in English UI

- **WHEN** `fetchCountry` fails while the language is `en`
- **THEN** the error UI shows the English translation of the error key (never "Respuesta inesperada del servidor." or raw Axios text)

#### Scenario: Event submit fails in Spanish UI

- **WHEN** `submitEvent` fails while the language is `es`
- **THEN** the feedback modal shows the Spanish translation of the error key

#### Scenario: Language switch retranslates a stored error

- **WHEN** an error is currently displayed and the user toggles the language
- **THEN** the displayed error text switches to the other language (the store holds the key, not a rendered string)

#### Scenario: Missing locale entry does not compile

- **WHEN** an error key is added to one locale file but not the other
- **THEN** `tsc -b` fails (existing `Record<TranslationKey, string>` parity guarantee)
