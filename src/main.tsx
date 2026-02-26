import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";

// Store
import { Provider } from "react-redux";
import { store } from "./store";

import App from "./App.tsx";

// Pages
import WorldMap from "./pages/WorldMap";
import Mexico from "./pages/Mexico";
import Thailand from "./pages/Thailand";

const router = createBrowserRouter([
  {
    path: "/",

    element: (
      <Provider store={store}>
        <App />
      </Provider>
    ),

    children: [
      { index: true, element: <WorldMap /> },
      { path: "Mexico", element: <Mexico /> },
      { path: "Thailand", element: <Thailand /> },
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
