import type { MainVideoStageProps } from './MainVideoStage.types';

import { useEffect, useRef } from 'react';

// MUI
import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

// i18n
import { useTranslation } from '@/i18n';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const ASPECT_RATIO = 16 / 9;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

const bob = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
`;

/**
 * Single persistent YouTube iframe rendered in a fixed-position "stage" that
 * interpolates between fullscreen (scrollY 0) and the in-card placeholder rect
 * (scrollY >= viewport height), driven by scroll. Keeping one iframe avoids any
 * reload as the video collapses into / expands out of the card.
 */
const MainVideoStage = ({ video, placeholderRef }: MainVideoStageProps) => {
  const { t } = useTranslation();
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      frameRef.current = null;
      const stage = stageRef.current;
      const iframe = iframeRef.current;
      if (!stage || !iframe) return;

      const fullW = window.innerWidth;
      const fullH = window.innerHeight;
      const distance = fullH || 1;
      const progress = clamp(window.scrollY / distance, 0, 1);

      const placeholder = placeholderRef.current;
      const rect = placeholder
        ? placeholder.getBoundingClientRect()
        : ({ top: 0, left: 0, width: fullW, height: fullH } as DOMRect);

      const width = lerp(fullW, rect.width, progress);
      const height = lerp(fullH, rect.height, progress);
      stage.style.top = `${lerp(0, rect.top, progress)}px`;
      stage.style.left = `${lerp(0, rect.left, progress)}px`;
      stage.style.width = `${width}px`;
      stage.style.height = `${height}px`;

      // Cover-size the iframe to its frame at 16:9 so the video fills the frame
      // (no letterbox) in both the fullscreen and collapsed states.
      let coverW = width;
      let coverH = width / ASPECT_RATIO;
      if (coverH < height) {
        coverH = height;
        coverW = height * ASPECT_RATIO;
      }
      iframe.style.width = `${coverW}px`;
      iframe.style.height = `${coverH}px`;

      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - progress);
      }
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [placeholderRef, video.idYt]);

  return (
    <Box
      ref={stageRef}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'common.black',
        pointerEvents: 'none',
        zIndex: 1200,
      }}
    >
      <Box
        component="iframe"
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${video.idYt}?autoplay=1&mute=1&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&fs=0&cc_load_policy=0${
          video.startTime ? `&start=${video.startTime}` : ''
        }`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          border: 0,
          transform: 'translate(-50%, -50%) scaleY(1.08)',
          pointerEvents: 'none',
        }}
      />

      <Box
        ref={hintRef}
        sx={{
          position: 'absolute',
          bottom: { xs: 24, md: 40 },
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          color: 'common.white',
          pointerEvents: 'none',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '0.85rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {t('mainEvent.scrollHint')}
        </Typography>
        <Box sx={{ fontSize: '1.1rem', animation: `${bob} 1.6s ease-in-out infinite` }}>
          <FontAwesomeIcon icon={faChevronDown} />
        </Box>
      </Box>
    </Box>
  );
};

export default MainVideoStage;
