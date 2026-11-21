const LAST_VISITED_COUNTRY_KEY = 'lastVisitedCountry';

export const rememberLastVisitedCountry = (slug: string): boolean => {
  try {
    sessionStorage.setItem(LAST_VISITED_COUNTRY_KEY, slug);
    return true;
  } catch {
    return false;
  }
};

export const readLastVisitedCountry = (): string | null => {
  try {
    return sessionStorage.getItem(LAST_VISITED_COUNTRY_KEY);
  } catch {
    return null;
  }
};
