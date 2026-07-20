import { useCallback, useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCountry } from '@/store/country/thunks';
import { resetCountryData, selectCountryState } from '@/store/country/countrySlice';
import type {
  UseCountryPageDataOptions,
  UseCountryPageDataResult,
} from './useCountryPageData.types';

export const useCountryPageData = (
  slug: string,
  { resolveFighterImage, resolveTopFightThumbnail }: UseCountryPageDataOptions = {},
): UseCountryPageDataResult => {
  const dispatch = useAppDispatch();
  const { fighters, mainEvents, topEvents, loading, error } = useAppSelector(selectCountryState);

  useEffect(() => {
    dispatch(resetCountryData());
    dispatch(fetchCountry(slug));
  }, [dispatch, slug]);

  const fightersList = useMemo(
    () =>
      resolveFighterImage
        ? fighters.map((fighter) => ({ ...fighter, image: resolveFighterImage(fighter.image) }))
        : fighters,
    [fighters, resolveFighterImage],
  );

  const topFightsList = useMemo(
    () =>
      resolveTopFightThumbnail
        ? topEvents.map((fight) =>
            fight.thumbnail
              ? { ...fight, thumbnail: resolveTopFightThumbnail(fight.thumbnail) }
              : fight,
          )
        : topEvents,
    [topEvents, resolveTopFightThumbnail],
  );

  const retry = useCallback(() => {
    dispatch(fetchCountry(slug));
  }, [dispatch, slug]);

  return { fightersList, mainEvents, topFightsList, loading, error, retry };
};
