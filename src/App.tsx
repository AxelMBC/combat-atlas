import "./App.scss";
import { Outlet } from "react-router-dom";

import LanguageToggle from "@/components/LanguageToggle";

const App = () => {
  return (
    <>
      <LanguageToggle />
      <Outlet />
    </>
  );
};

export default App;