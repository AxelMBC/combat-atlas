import './App.scss';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import LanguageToggle from '@/components/LanguageToggle';
import ThemeModeToggle from '@/components/ThemeModeToggle';
import { pingHealth } from '@/services/health.service';

const App = () => {
  useEffect(() => {
    pingHealth().catch(() => {});
  }, []);

  return (
    <>
      <Box
        sx={(theme) => ({
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: theme.zIndex.appBar + 1,
          display: 'flex',
          alignItems: 'stretch',
          gap: 1.5,
        })}
      >
        <ThemeModeToggle />
        <LanguageToggle />
      </Box>
      <Outlet />
    </>
  );
};

export default App;
