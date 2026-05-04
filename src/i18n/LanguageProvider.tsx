import { useCallback, useEffect, useMemo, useState } from 'react';

import { LanguageContext } from './LanguageContext';
import en from './locales/en';
import es from './locales/es';
import type {
  Language,
  LanguageContextValue,
  LanguageProviderProps,
  TranslateFn,
  TranslationKey,
  TranslationParams,
} from './i18n.types';

const STORAGE_KEY = 'preferredLanguage';

const isLanguage = (value: unknown): value is Language => value === 'es' || value === 'en';

const detectInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'es';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
    // localStorage unavailable — fall through to browser detection
  }
  const browserLang = window.navigator.language?.toLowerCase() ?? '';
  return browserLang.startsWith('en') ? 'en' : 'es';
};

const interpolate = (template: string, params?: TranslationParams): string => {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_match, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`,
  );
};

const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore — preference simply won't persist
    }
    setLanguageState(next);
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const dict = language === 'en' ? en : es;
    const t: TranslateFn = (key: TranslationKey, params?: TranslationParams) =>
      interpolate(dict[key] ?? key, params);
    return { language, setLanguage, t };
  }, [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageProvider;
