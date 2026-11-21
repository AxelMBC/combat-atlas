import type { SpinControlProps } from './SpinControl.types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmericas } from '@fortawesome/free-solid-svg-icons';

import { Box, ButtonBase } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';
import { HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';

const OUTLINE_OPACITY = 0.38;
const CONTROL_SKEW = 'skewX(-12deg)';
const CONTROL_LABEL_UNSKEW = 'skewX(12deg)';

const SpinControl = ({ accentColor, isDisabled, onSpin }: SpinControlProps) => {
  const { t } = useTranslation();
  const { surfaces } = useTheme().palette;

  return (
    <ButtonBase
      type="button"
      onClick={onSpin}
      disabled={isDisabled}
      sx={{
        alignSelf: 'flex-start',
        minHeight: 44,
        px: 2.5,
        transform: CONTROL_SKEW,
        border: '1px solid',
        borderColor: alpha(surfaces.textPrimary, OUTLINE_OPACITY),
        color: surfaces.textPrimary,
        fontFamily: HEADLINE_FONT,
        fontSize: { xs: '0.85rem', md: '0.95rem' },
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        transition: 'color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
        '&:hover': { borderColor: accentColor, color: accentColor },
        '&.Mui-focusVisible': { outline: `2px solid ${accentColor}`, outlineOffset: 3 },
        '&.Mui-disabled': { color: surfaces.textMuted, borderColor: surfaces.border },
      }}
    >
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.25,
          transform: CONTROL_LABEL_UNSKEW,
        }}
      >
        <FontAwesomeIcon icon={faEarthAmericas} aria-hidden />
        {t('landing.spin')}
      </Box>
    </ButtonBase>
  );
};

export default SpinControl;
