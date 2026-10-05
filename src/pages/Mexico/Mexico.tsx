import '@/styles/fonts/default.scss';

import { useCountryPageData } from '@/hooks/useCountryPageData';
import { useTranslation } from '@/i18n';

import { getFighterImage } from './resources/fighters';
import { mexicoConfig } from './config/mexico.config';
import { useCountryTheme } from '@/styles/theme';

import CountryPage from '@/pages/countries/components/CountryPage';
import ErrorFallback from '@/components/ErrorFallback';
import Spinner from '@/components/Spinner';

const Mexico = () => {
  const { t } = useTranslation();
  const theme = useCountryTheme(mexicoConfig);
  const { fightersList, mainEvents, topFightsList, loading, error, retry } = useCountryPageData(
    'mexico',
    { resolveFighterImage: getFighterImage },
  );

  if (loading) return <Spinner />;

  if (error) return <ErrorFallback theme={theme} message={t(error)} onRetry={retry} />;

  return (
    <CountryPage
      theme={theme}
      config={mexicoConfig}
      mainEventFights={mainEvents}
      topFightersData={fightersList}
      topEventsList={topFightsList}
    />
  );
};

export default Mexico;
