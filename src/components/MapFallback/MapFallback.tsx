// Intentionally avoids MUI/Emotion: this is the fallback UI shown when the rest
// of the app's rendering stack may be broken, so it must render with no runtime deps.
import { Link } from "react-router-dom";
import { countryRegistry } from "@/pages/countries/registry";
import type { MapFallbackProps } from "./MapFallback.types";
import "./MapFallback.scss";

const MapFallback = ({ onRetry, canSoftRetry = false }: MapFallbackProps) => {
  const handleRetry = () => {
    if (canSoftRetry && onRetry) {
      onRetry();
      return;
    }
    // Last-resort path: either a soft remount already failed, or the caller
    // never offered one (e.g., a render-time crash). Full reload reinitializes everything.
    window.location.reload();
  };

  return (
    <div className="map-fallback" role="status" aria-label="No se pudo cargar el mapa">
      <span className="map-fallback__code" aria-hidden="true">
        :(
      </span>

      <h1 className="map-fallback__title">No pudimos cargar el mapa</h1>

      <p className="map-fallback__message">
        Mientras tanto, puedes explorar los países disponibles en Combat Atlas.
      </p>

      <ul className="map-fallback__list">
        {countryRegistry.map(({ slug, name }) => (
          <li key={slug}>
            <Link to={`/${slug}`} className="map-fallback__country">
              {name}
            </Link>
          </li>
        ))}
      </ul>

      <button className="map-fallback__button" onClick={handleRetry}>
        Reintentar
      </button>
    </div>
  );
};

export default MapFallback;
