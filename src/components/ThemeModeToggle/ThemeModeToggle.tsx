import { IconButton } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import { useTranslation } from '@/i18n';
import { useThemeMode } from '@/styles/theme';

const ThemeModeToggle = () => {
  const { t } = useTranslation();
  const { mode, toggleMode } = useThemeMode();
  const { surfaces } = useTheme().palette;
  const isDark = mode === 'dark';

  return (
    <IconButton
      onClick={toggleMode}
      aria-label={isDark ? t('theme.toggle.light') : t('theme.toggle.dark')}
      sx={{
        background: surfaces.textPrimary,
        border: `2px solid ${surfaces.textPrimary}`,
        borderRadius: 0,
        boxShadow: `3px 3px 0 ${surfaces.textPrimary}`,
        color: alpha(surfaces.page, 0.75),
        fontSize: '1rem',
        width: 40,
        height: 'auto',
        transition:
          'transform 120ms ease, box-shadow 120ms ease, color 120ms ease, background 120ms ease',
        '&:hover': {
          background: surfaces.textPrimary,
          color: surfaces.page,
          transform: 'translate(-1px, -1px)',
          boxShadow: `4px 4px 0 ${surfaces.textPrimary}`,
        },
        '&:focus-visible': {
          outline: `2px solid ${surfaces.page}`,
          outlineOffset: 2,
        },
      }}
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
    </IconButton>
  );
};

export default ThemeModeToggle;
