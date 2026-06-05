import type { MainVideoStageProps } from './MainVideoStage.types';
import type { YTPlayer } from '@/types/youtube.types';

import { useEffect, useRef, useState } from 'react';

// MUI
import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

// i18n
import { useTranslation } from '@/i18n';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPlay } from '@fortawesome/free-solid-svg-icons';

// Components
import MainVideoControls from './MainVideoControls';

// Utils
import { loadYouTubeIframeApi } from '@/utils/youtubeIframeApi';

const ASPECT_RATIO = 16 / 9;
const REVEAL_DELAY_MS = 4500;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

const bob = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
`;

const MainVideoStage = ({ video, placeholderRef, onReady }: MainVideoStageProps) => {
  const { t } = useTranslation();
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const dockedRef = useRef(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const [docked, setDocked] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleHintClick = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });

  const handleTogglePlay = () => {
    const player = playerRef.current;
    if (!player) return;
    if (playing) player.pauseVideo();
    else player.playVideo();
  };

  const handleSeek = (seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
  };

  useEffect(() => {
    let cancelled = false;
    let revealTimer: number | undefined;
    const reveal = () => onReadyRef.current();
    const fallback = window.setTimeout(reveal, 8000);

    loadYouTubeIframeApi().then((YT) => {
      if (cancelled || !iframeRef.current) return;
      playerRef.current = new YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            setDuration(event.target.getDuration());
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING && revealTimer === undefined) {
              revealTimer = window.setTimeout(reveal, REVEAL_DELAY_MS);
            }
            setPlaying(event.data !== YT.PlayerState.PAUSED && event.data !== YT.PlayerState.ENDED);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      if (revealTimer !== undefined) window.clearTimeout(revealTimer);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [video.idYt]);

  useEffect(() => {
    if (!docked) return;

    const player = playerRef.current;
    if (player) {
      const total = player.getDuration();
      if (total > 0) setDuration(total);
    }

    const id = window.setInterval(() => {
      const current = playerRef.current;
      if (current) setCurrentTime(current.getCurrentTime());
    }, 250);

    return () => window.clearInterval(id);
  }, [docked]);

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

      const isDocked = progress >= 1 && !!placeholder;
      if (isDocked !== dockedRef.current) {
        dockedRef.current = isDocked;
        setDocked(isDocked);
      }

      // Cover-size the iframe to its frame at 16:9 so the video fills the frame
      // (no letterbox) in both the fullscreen and collapsed states.
      const coverIframe = (width: number, height: number) => {
        let coverW = width;
        let coverH = width / ASPECT_RATIO;
        if (coverH < height) {
          coverH = height;
          coverW = height * ASPECT_RATIO;
        }
        iframe.style.width = `${coverW}px`;
        iframe.style.height = `${coverH}px`;
      };

      if (isDocked) {
        stage.style.position = 'absolute';
        stage.style.top = `${rect.top + window.scrollY}px`;
        stage.style.left = `${rect.left + window.scrollX}px`;
        stage.style.width = `${rect.width}px`;
        stage.style.height = `${rect.height}px`;
        coverIframe(rect.width, rect.height);
        if (hintRef.current) {
          hintRef.current.style.opacity = '0';
          hintRef.current.style.pointerEvents = 'none';
        }
        return;
      }

      stage.style.position = 'fixed';
      const width = lerp(fullW, rect.width, progress);
      const height = lerp(fullH, rect.height, progress);
      stage.style.top = `${lerp(0, rect.top, progress)}px`;
      stage.style.left = `${lerp(0, rect.left, progress)}px`;
      stage.style.width = `${width}px`;
      stage.style.height = `${height}px`;
      coverIframe(width, height);

      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - progress);
        hintRef.current.style.pointerEvents = 'auto';
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
        src={`https://www.youtube.com/embed/${video.idYt}?autoplay=1&mute=1&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&fs=0&cc_load_policy=0&controls=0&enablejsapi=1&origin=${window.location.origin}${
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

      {!playing && (
        <Box
          onClick={handleTogglePlay}
          role="button"
          aria-label="Play"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.85)',
            color: 'common.white',
            fontSize: { xs: '2rem', md: '3rem' },
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          <FontAwesomeIcon icon={faPlay} />
        </Box>
      )}

      <MainVideoControls
        visible={docked}
        playing={playing}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={handleTogglePlay}
        onSeek={handleSeek}
      />

      <Box
        ref={hintRef}
        role="button"
        tabIndex={0}
        aria-label={t('mainEvent.scrollHint')}
        onClick={handleHintClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleHintClick();
          }
        }}
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
          pointerEvents: 'auto',
          cursor: 'pointer',
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
