import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";

// Store
import { Provider } from "react-redux";
import { store } from "./store";

import App from "./App.tsx";

// Pages
import WorldMap from "./pages/WorldMap";
import CountryRouter from "./pages/countries/CountryRouter";
import EventIngestionPage from "./pages/EventIngestion/EventIngestionPage";

// Components
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";
import MapFallback from "@/components/MapFallback";

const router = createBrowserRouter([
  {
    path: "/",

    element: (
      <Provider store={store}>
        <App />
      </Provider>
    ),

    children: [
      {
        index: true,
        element: (
          <ErrorBoundary fallback={<MapFallback />}>
            <WorldMap />
          </ErrorBoundary>
        ),
      },
      {
        path: "admin/fights/new",
        element: (
          <ErrorBoundary fallback={<NotFound message="Error al cargar el formulario" />}>
            <EventIngestionPage />
          </ErrorBoundary>
        ),
      },
      { path: ":countrySlug", element: <CountryRouter /> },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Failed to find the root element. Check your index.html file."
  );
}

const root = createRoot(rootElement);
root.render(<RouterProvider router={router} />);
