import './Spinner.scss';
import type { SpinnerProps } from './Spinner.types';

import { useMemo } from 'react';
import { useTranslation } from '@/i18n';
import useTypewriter from '@/hooks/useTypewriter';
import { TAGLINE_KEYS, EMPTY_PHRASES } from './taglines';

const Spinner = ({ size = 'medium', label, fullscreen = true, taglines = true }: SpinnerProps) => {
  const { t } = useTranslation();

  const showTaglines = taglines && label === undefined;

  const phrases = useMemo(
    () => (showTaglines ? TAGLINE_KEYS.map((key) => t(key)) : EMPTY_PHRASES),
    [showTaglines, t],
  );

  const typed = useTypewriter(phrases);

  const bars = (
    <span className={`spinner spinner--${size}`} aria-hidden="true">
      <span className="spinner__bar" />
      <span className="spinner__bar" />
      <span className="spinner__bar" />
    </span>
  );

  const content = (
    <>
      {bars}
      {label !== undefined && (
        <span className="spinner__label" aria-hidden="true">
          {label}
        </span>
      )}
      {showTaglines && (
        <span className="spinner__tagline" aria-hidden="true">
          {typed}
          <span className="spinner__caret" />
        </span>
      )}
    </>
  );

  return (
    <div
      className={fullscreen ? 'spinner-overlay' : 'spinner-wrapper'}
      role="status"
      aria-label={label ?? t('common.loadingEllipsis')}
    >
      {content}
    </div>
  );
};

export default Spinner;
