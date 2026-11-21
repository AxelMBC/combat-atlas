import type { CountryEntry } from '@/pages/countries/registry.types';
import type { Walkout } from './useWalkout.types';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const WALKOUT_MS = 380;

export const useWalkout = (): Walkout => {
  const navigate = useNavigate();
  const [walkoutEntry, setWalkoutEntry] = useState<CountryEntry | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const startWalkout = useCallback(
    (entry: CountryEntry) => {
      if (timerRef.current !== null) return;
      setWalkoutEntry(entry);
      timerRef.current = window.setTimeout(() => navigate(`/${entry.slug}`), WALKOUT_MS);
    },
    [navigate],
  );

  return { walkoutEntry, startWalkout };
};
