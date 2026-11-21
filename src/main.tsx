import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

// Store
import { Provider } from 'react-redux';
import { store } from './store';

// i18n
import { LanguageProvider } from '@/i18n';

// Theme
import { ThemeModeProvider } from '@/styles/theme';

import App from './App.tsx';

// Pages
import Landing from './pages/Landing';
import CountryRouter from './pages/countries/CountryRouter';
import EventIngestionPage from './pages/EventIngestion/EventIngestionPage';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';
import LandingFallback from '@/components/LandingFallback';

const router = createBrowserRouter([
  {
    path: '/',

    element: (
      <Provider store={store}>
        <App />
      </Provider>
    ),

    children: [
      {
        index: true,
        element: (
          <ErrorBoundary fallback={<LandingFallback />}>
            <Landing />
          </ErrorBoundary>
        ),
      },
      {
        path: 'admin/fights/new',
        element: (
          <ErrorBoundary fallback={<NotFound messageKey="error.formLoad" />}>
            <EventIngestionPage />
          </ErrorBoundary>
        ),
      },
      { path: ':countrySlug', element: <CountryRouter /> },
    ],
  },
]);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element. Check your index.html file.');
}

const root = createRoot(rootElement);
root.render(
  <LanguageProvider>
    <ThemeModeProvider>
      <RouterProvider router={router} />
    </ThemeModeProvider>
  </LanguageProvider>,
);
