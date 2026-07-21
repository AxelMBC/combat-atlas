import { useMemo } from 'react';
import type { Theme } from '@mui/material/styles';
import type { CountryPageConfig } from '@/pages/countries/components/CountryPage/CountryPage.types';

import { createCountryTheme } from './createCountryTheme';
import useThemeMode from './useThemeMode';

const useCountryTheme = (config: CountryPageConfig): Theme => {
  const { mode } = useThemeMode();
  return useMemo(() => createCountryTheme(config, mode), [config, mode]);
};

export default useCountryTheme;
