import type { FightCardBillingProps } from './FightCardBilling.types';

import { Box } from '@mui/material';

import { useTranslation } from '@/i18n';
import BillingRow from './BillingRow';

const FightCardBilling = ({
  entries,
  selectedSlug,
  reduceMotion,
  onIntent,
  onPress,
  onActivate,
}: FightCardBillingProps) => {
  const { t } = useTranslation();

  return (
    <Box component="nav" aria-label={t('landing.countriesAria')}>
      <Box
        component="ol"
        sx={{
          m: 0,
          p: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 0.5, md: 1.5 },
        }}
      >
        {entries.map((entry, index) => (
          <BillingRow
            key={entry.slug}
            entry={entry}
            position={index + 1}
            isSelected={entry.slug === selectedSlug}
            reduceMotion={reduceMotion}
            onIntent={onIntent}
            onPress={onPress}
            onActivate={onActivate}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FightCardBilling;
