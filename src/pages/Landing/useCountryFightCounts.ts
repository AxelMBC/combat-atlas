import type { CountrySummary } from '@/types/country.types';
import type { CountryFightCount } from './useCountryFightCounts.types';

import { useEffect, useMemo, useState } from 'react';

import { loadCountrySummaries } from '@/store/country/countryDataCache';
import { useWatchHistory } from '@/store/watchHistory/useWatchHistory';
import { countUnwatched, retainFights } from '@/store/watchHistory/watchHistory';

const pruneHistory = (summaries: readonly CountrySummary[]) => {
  if (summaries.length === 0) return;
  retainFights(summaries.flatMap((summary) => summary.fightIds));
};

export const useCountryFightCounts = (): ReadonlyMap<string, CountryFightCount> => {
  const watched = useWatchHistory();
  const [summaries, setSummaries] = useState<readonly CountrySummary[]>([]);

  useEffect(() => {
    let isCurrent = true;
    loadCountrySummaries()
      .then((loaded) => {
        pruneHistory(loaded);
        if (isCurrent) setSummaries(loaded);
      })
      .catch(() => {});
    return () => {
      isCurrent = false;
    };
  }, []);

  return useMemo(
    () =>
      new Map(
        summaries
          .filter((summary) => summary.fightIds.length > 0)
          .map((summary) => [
            summary.slug,
            {
              total: summary.fightIds.length,
              unwatched: countUnwatched(summary.fightIds, watched),
            },
          ]),
      ),
    [summaries, watched],
  );
};
