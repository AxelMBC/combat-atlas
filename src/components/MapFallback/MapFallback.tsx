// Intentionally avoids MUI/Emotion: this is the fallback UI shown when the rest
// of the app's rendering stack may be broken, so it must render with no runtime deps.
import { Link } from "react-router-dom";
import { countryRegistry } from "@/pages/countries/registry";
import { useTranslation } from "@/i18n";
import type { MapFallbackProps } from "./MapFallback.types";
import "./MapFallback.scss";

const MapFallback = ({ onRetry, canSoftRetry = false }: MapFallbackProps) => {
  const { t } = useTranslation();

  const handleRetry = () => {
    if (canSoftRetry && onRetry) {
      onRetry();
      return;
    }
    window.location.reload();
  };

  return (
    <div
      className="map-fallback"
      role="alert"
      aria-label={t("mapFallback.aria")}
    >
      <span className="map-fallback__code" aria-hidden="true">
        :(
      </span>

      <h1 className="map-fallback__title">{t("mapFallback.title")}</h1>

      <p className="map-fallback__message">{t("mapFallback.message")}</p>

      <ul className="map-fallback__list">
        {countryRegistry.map(({ slug, nameKey }) => (
          <li key={slug}>
            <Link to={`/${slug}`} className="map-fallback__country">
              {t(nameKey)}
            </Link>
          </li>
        ))}
      </ul>

      <button className="map-fallback__button" onClick={handleRetry}>
        {t("common.retry")}
      </button>
    </div>
  );
};

export default MapFallback;
