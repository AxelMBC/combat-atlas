import type { TranslationKey } from "./es";

const en: Record<TranslationKey, string> = {
  "common.loading": "LOADING",
  "common.loadingEllipsis": "Loading…",
  "common.retry": "Retry",
  "common.accept": "Accept",
  "common.close": "Close",

  "nav.backToWorldMap": "← World Map",

  "language.toggleAria": "Language",
  "language.toggle.es": "Spanish",
  "language.toggle.en": "English",

  "worldMap.explorePrompt": "Explore a country:",
  "worldMap.availableCountriesAria": "Available countries",

  "country.mexico.name": "Mexico",
  "country.mexico.headerTitle": "Mexican-Style Boxing",
  "country.mexico.topFightersTitle": "Mexican Icons",
  "country.mexico.topEventsTitle": "Historic Fights",

  "country.thailand.name": "Thailand",
  "country.thailand.headerTitle": "Thai Weapons",
  "country.thailand.topFightersTitle": "Historic Legends",
  "country.thailand.topEventsTitle": "Thailand's Wars",

  "country.unitedStates.name": "United States",
  "country.unitedStates.headerTitle": "American Grit Wrestling",
  "country.unitedStates.topFightersTitle": "Mat Legends",
  "country.unitedStates.topEventsTitle": "Olympic Duels",

  "error.countryLoad": "Something went wrong loading the country. Please try again.",
  "error.formLoad": "Failed to load the form",
  "error.noMoreVideos": "No more videos available.",
  "error.noFighterEvent": "No main event found for the selected fighter.",

  "notFound.title": "Country not found",
  "notFound.defaultMessage":
    "The country you're looking for doesn't exist or isn't available yet in Combat Atlas.",
  "notFound.aria": "Page not found",

  "errorFallback.defaultTitle": "Connection error",
  "errorFallback.defaultMessage":
    "We couldn't load the information. Check your connection and try again.",

  "mapFallback.title": "We couldn't load the map",
  "mapFallback.message":
    "In the meantime, you can explore the countries available in Combat Atlas.",
  "mapFallback.aria": "Unable to load the map",

  "mainEvent.searching": "SEARCHING FOR FIGHT...",
  "mainEvent.anotherFight": "Another Fight",

  "fighter.noFights": "No fights",
  "fighter.exhausted": "Sold out",
  "fighter.recordLabel": "RECORD:",
  "fighter.fights.one": "fight",
  "fighter.fights.other": "fights",

  "fightCard.watchFight": "Watch Fight",

  "eventForm.pageTitle": "New Fight Event",
  "eventForm.pageDescription":
    "Fill out the form to add a new event to the system.",
  "eventForm.section.countryVideo": "Country and Video",
  "eventForm.section.eventInfo": "Event Information",
  "eventForm.section.fighters": "Fighters",
  "eventForm.field.country": "Country",
  "eventForm.field.youtubeId": "YouTube ID",
  "eventForm.field.startTime": "Start time (seconds)",
  "eventForm.field.title": "Title",
  "eventForm.field.description": "Description",
  "eventForm.field.tags": "Tags",
  "eventForm.field.mainFighterId": "Main fighter ID (optional)",
  "eventForm.field.redCorner": "Red Corner",
  "eventForm.field.blueCorner": "Blue Corner",
  "eventForm.help.youtubeIdFormat":
    "11-character video ID (e.g. dQw4w9WgXcQ)",
  "eventForm.help.mainFighterIdInfo":
    "Internal ID of the featured fighter in this match",
  "eventForm.help.tagsAddInstruction": "Press Enter to add",
  "eventForm.help.tagsMaxReached": "{max}-tag limit reached",
  "eventForm.loading.fighters": "Loading fighters...",
  "eventForm.success.title": "Event created successfully",
  "eventForm.error.title": "Failed to create event",
  "eventForm.button.clear": "Clear",
  "eventForm.button.submit": "Submit Event",
  "eventForm.button.submitting": "Submitting...",

  "videoPreview.invalidId": "Invalid YouTube ID (must be 11 characters)",
  "videoPreview.promptForId": "Enter the video ID to preview",

  "validation.countryRequired": "Country is required.",
  "validation.youtubeIdInvalid":
    "YouTube ID must be exactly 11 characters.",
  "validation.startTimeInvalid": "Start time must be ≥ 0.",
  "validation.titleLength":
    "Title must be between {min} and {max} characters.",
  "validation.descriptionLength":
    "Description must be between {min} and {max} characters.",
  "validation.tagsMax": "Maximum {max} tags.",
};

export default en;
