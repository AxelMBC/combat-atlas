import '@/styles/fonts/default.scss';

import { useCountryPageData } from '@/hooks/useCountryPageData';
import { useTranslation } from '@/i18n';

// Replace with your country's slug (must match its registry entry).
// Wire an image resolver if you bundle fighter images locally:
// import { getFighterImage } from './resources/fighters';
import { countryConfig } from './config/country.config';
import { theme } from './config/countryTheme';

import CountryPage from '@/pages/countries/components/CountryPage';
import ErrorFallback from '@/components/ErrorFallback';
import Spinner from '@/components/Spinner';

const CountryTemplate = () => {
  const { t } = useTranslation();
  const { fightersList, mainEvents, topFightsList, loading, error, retry } =
    useCountryPageData('your-country');

  if (loading) return <Spinner />;

  if (error) return <ErrorFallback theme={theme} message={t(error)} onRetry={retry} />;

  return (
    <CountryPage
      theme={theme}
      config={countryConfig}
      mainEventFights={mainEvents}
      topFightersData={fightersList}
      topEventsList={topFightsList}
    />
  );
};

export default CountryTemplate;
