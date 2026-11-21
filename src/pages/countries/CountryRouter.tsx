import { useParams } from 'react-router-dom';
import { Suspense, lazy, useEffect, useMemo } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import { countryRegistry } from './registry';
import { rememberLastVisitedCountry } from './lastVisitedCountry';
import Spinner from '@/components/Spinner';
import NotFound from '@/components/NotFound';
import ErrorBoundary from '@/components/ErrorBoundary';

const componentCache = new Map<string, LazyExoticComponent<ComponentType>>();

const CountryRouter = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const entry = countryRegistry.find((c) => c.slug === countrySlug);

  const LazyCountry = useMemo(() => {
    if (!entry) return null;

    if (!componentCache.has(entry.slug)) {
      componentCache.set(entry.slug, lazy(entry.loader));
    }
    return componentCache.get(entry.slug);
  }, [entry]);

  useEffect(() => {
    if (entry) rememberLastVisitedCountry(entry.slug);
  }, [entry]);

  if (!LazyCountry) {
    return <NotFound />;
  }

  return (
    <ErrorBoundary fallback={<NotFound messageKey="error.countryLoad" />}>
      <Suspense fallback={<Spinner />}>
        <LazyCountry />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CountryRouter;
