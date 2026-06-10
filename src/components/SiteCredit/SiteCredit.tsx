import { Link, Typography } from '@mui/material';

import { useTranslation } from '@/i18n';
import type { SiteCreditProps } from './SiteCredit.types';

const SiteCredit = ({ tone }: SiteCreditProps) => {
  const { t } = useTranslation();
  const onDark = tone === 'onDark';

  return (
    <Typography
      component="p"
      sx={{
        fontFamily: 'Anton, sans-serif',
        fontSize: '0.65rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        color: onDark ? 'rgba(255, 255, 255, 0.45)' : 'info.main',
        opacity: onDark ? 1 : 0.75,
        transition: 'color 0.2s ease, opacity 0.2s ease',
        '&:hover': {
          color: onDark ? 'rgba(255, 255, 255, 0.9)' : 'info.main',
          opacity: 1,
        },
      }}
    >
      {t('credit.by')}{' '}
      <Link
        href="https://axelbarraza.com"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: 'inherit',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        Axel Barraza
      </Link>
    </Typography>
  );
};

export default SiteCredit;
