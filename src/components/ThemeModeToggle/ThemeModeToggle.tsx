import { IconButton } from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import { useTranslation } from '@/i18n';
import { useThemeMode } from '@/styles/theme';

const ThemeModeToggle = () => {
  const { t } = useTranslation();
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <IconButton
      onClick={toggleMode}
      aria-label={isDark ? t('theme.toggle.light') : t('theme.toggle.dark')}
      sx={{
        background: '#000',
        border: '2px solid #000',
        borderRadius: 0,
        boxShadow: '3px 3px 0 #000',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: '1rem',
        width: 40,
        height: 'auto',
        transition: 'transform 120ms ease, box-shadow 120ms ease, color 120ms ease',
        '&:hover': {
          background: '#000',
          color: '#fff',
          transform: 'translate(-1px, -1px)',
          boxShadow: '4px 4px 0 #000',
        },
        '&:focus-visible': {
          outline: '2px solid #fff',
          outlineOffset: 2,
        },
      }}
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
    </IconButton>
  );
};

export default ThemeModeToggle;
