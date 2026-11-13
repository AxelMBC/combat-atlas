import type { Language } from '@/i18n';
import type { MainEvent } from '@/types/fightEvent.types';

import { resolveLocalizedTags } from './resolveLocalizedField';

export const splitFightersFromTitle = (title: string): [string, string] | null => {
  const parts = title.split(/\s+vs\.?\s+/i);
  if (parts.length !== 2) return null;
  return [parts[0].trim(), parts[1].trim()];
};

export const getFightBilling = (video: MainEvent): [string, string] | null => {
  if (video.fighterRed && video.fighterBlue) return [video.fighterRed, video.fighterBlue];
  return splitFightersFromTitle(video.title);
};

export const getFightCity = (video: MainEvent): string | undefined =>
  video.location ?? video.venue?.city;

export const getFightDiscipline = (video: MainEvent, language: Language): string | undefined =>
  video.type ?? resolveLocalizedTags(video.tags, language)[0];

export const getFightDivision = (video: MainEvent, language: Language): string | undefined =>
  video.divisionId?.text?.[language];
