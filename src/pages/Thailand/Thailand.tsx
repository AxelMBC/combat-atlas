import '@/styles/fonts/default.scss';

import { useCountryPageData } from '@/hooks/useCountryPageData';
import { useTranslation } from '@/i18n';

import { getFighterImage } from './resources/fighters';
import { getTopFightImage } from './resources/fights';
import { thailandConfig } from './config/thailand.config';
import { useCountryTheme } from '@/styles/theme';

import CountryPage from '@/pages/countries/components/CountryPage';
import ErrorFallback from '@/components/ErrorFallback';
import Spinner from '@/components/Spinner';

const Thailand = () => {
  const { t } = useTranslation();
  const theme = useCountryTheme(thailandConfig);
  const { fightersList, mainEvents, topFightsList, loading, error, retry } = useCountryPageData(
    'thailand',
    { resolveFighterImage: getFighterImage, resolveTopFightThumbnail: getTopFightImage },
  );

  if (loading) return <Spinner />;

  if (error) return <ErrorFallback theme={theme} message={t(error)} onRetry={retry} />;

  return (
    <CountryPage
      theme={theme}
      config={thailandConfig}
      mainEventFights={mainEvents}
      topFightersData={fightersList}
      topEventsList={topFightsList}
    />
  );
};

export default Thailand;
