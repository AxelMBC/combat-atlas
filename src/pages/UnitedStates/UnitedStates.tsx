import '@/styles/fonts/default.scss';

import { useCountryPageData } from '@/hooks/useCountryPageData';
import { useTranslation } from '@/i18n';

import { getFighterImage } from './resources';
import { theme } from './config/unitedStatesTheme';
import { unitedStatesConfig } from './config/unitedStates.config';

import CountryPage from '@/pages/countries/components/CountryPage';
import ErrorFallback from '@/components/ErrorFallback';
import Spinner from '@/components/Spinner';

const UnitedStates = () => {
  const { t } = useTranslation();
  const { fightersList, mainEvents, topFightsList, loading, error, retry } = useCountryPageData(
    'united-states',
    { resolveFighterImage: getFighterImage },
  );

  if (loading) return <Spinner />;

  if (error) return <ErrorFallback theme={theme} message={t(error)} onRetry={retry} />;

  return (
    <CountryPage
      theme={theme}
      config={unitedStatesConfig}
      mainEventFights={mainEvents}
      topFightersData={fightersList}
      topEventsList={topFightsList}
    />
  );
};

export default UnitedStates;
