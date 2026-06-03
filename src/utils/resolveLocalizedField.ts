import type { Language } from '@/i18n';
import type { LocalizedString, LocalizedTags } from '@/types/fightEvent.types';

const toApiKey = (language: Language): 'sp' | 'en' => (language === 'es' ? 'sp' : 'en');

export const resolveLocalizedString = (
  field: LocalizedString,
  language: Language,
  fallback: string,
): string => {
  if (!field) return fallback;
  if (typeof field === 'string') return field || fallback;
  return field[toApiKey(language)] || fallback;
};

export const resolveLocalizedTags = (field: LocalizedTags, language: Language): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  return field[toApiKey(language)] ?? [];
};
