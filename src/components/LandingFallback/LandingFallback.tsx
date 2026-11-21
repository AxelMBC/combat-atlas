// Intentionally avoids MUI/Emotion: this is the fallback UI shown when the rest
// of the app's rendering stack may be broken, so it must render with no runtime deps.
import { Link } from 'react-router-dom';
import { countryRegistry } from '@/pages/countries/registry';
import { useTranslation } from '@/i18n';
import './LandingFallback.scss';

const LandingFallback = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-fallback" role="alert" aria-label={t('landingFallback.aria')}>
      <span className="landing-fallback__code" aria-hidden="true">
        :(
      </span>

      <h1 className="landing-fallback__title">{t('landingFallback.title')}</h1>

      <p className="landing-fallback__message">{t('landingFallback.message')}</p>

      <ul className="landing-fallback__list">
        {countryRegistry.map(({ slug, nameKey }) => (
          <li key={slug}>
            <Link to={`/${slug}`} className="landing-fallback__country">
              {t(nameKey)}
            </Link>
          </li>
        ))}
      </ul>

      <button className="landing-fallback__button" onClick={() => window.location.reload()}>
        {t('common.retry')}
      </button>
    </div>
  );
};

export default LandingFallback;
