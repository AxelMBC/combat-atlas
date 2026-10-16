import './Spinner.scss';
import type { SpinnerProps } from './Spinner.types';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/i18n';
import useTypewriter from '@/hooks/useTypewriter';
import { TAGLINE_KEYS, EMPTY_PHRASES } from './taglines';

// How long a backend wait must last before it is treated as a cold start.
const SLOW_HINT_DELAY_MS = 4000;

const Spinner = ({
  size = 'medium',
  label,
  fullscreen = true,
  taglines = true,
  slowHint = false,
}: SpinnerProps) => {
  const { t } = useTranslation();
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    if (!slowHint) return;
    const timeout = setTimeout(() => setIsSlow(true), SLOW_HINT_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [slowHint]);

  const showSlowHint = slowHint && isSlow;
  const showTaglines = taglines && label === undefined && !showSlowHint;

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
      {showSlowHint && <span className="spinner__hint">{t('spinner.coldStart')}</span>}
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
