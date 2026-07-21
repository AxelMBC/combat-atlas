import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';
import { CLEAN_SANS } from '@/styles/fonts/cleanSans';

import type { FighterProfileCtaProps } from './FighterProfileCta.types';

const FighterProfileCta = ({ disabled }: FighterProfileCtaProps) => {
  const { t } = useTranslation();
  const { surfaces } = useTheme().palette;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        fontFamily: CLEAN_SANS,
        fontWeight: 600,
        fontSize: '0.85rem',
        color: disabled ? surfaces.textMuted : 'primary.light',
      }}
    >
      {t('fighter.profileCta')}
      <Box component="span" aria-hidden="true">
        →
      </Box>
    </Box>
  );
};

export default FighterProfileCta;
