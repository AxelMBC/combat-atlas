import { useParams } from "react-router-dom";
import { Suspense, lazy, useMemo } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import { countryRegistry } from "./registry";
import Spinner from "@/components/Spinner";
import NotFound from "@/components/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";

const componentCache = new Map<string, LazyExoticComponent<ComponentType>>();

const CountryRouter = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();

  const LazyCountry = useMemo(() => {
    const entry = countryRegistry.find((c) => c.slug === countrySlug);
    if (!entry) return null;

    if (!componentCache.has(entry.slug)) {
      componentCache.set(entry.slug, lazy(entry.loader));
    }
    return componentCache.get(entry.slug);
  }, [countrySlug]);

  if (!LazyCountry) {
    return <NotFound />;
  }

  return (
    <ErrorBoundary
      fallback={
        <NotFound message="Ocurrió un error al cargar el país. Inténtalo de nuevo." />
      }
    >
      <Suspense fallback={<Spinner label="CARGANDO" />}>
        <LazyCountry />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CountryRouter;
