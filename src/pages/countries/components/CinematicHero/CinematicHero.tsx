import type { CinematicHeroProps } from './CinematicHero.types';
import type { YTPlayer } from '@/types/youtube.types';

import { useCallback, useEffect, useRef, useState } from 'react';

// MUI
import { Box, IconButton, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCompress, faExpand, faPlay } from '@fortawesome/free-solid-svg-icons';

// Hooks
import { useHeroFullscreen } from './useHeroFullscreen';
import { useTranslation } from '@/i18n';

// Utils
import { loadYouTubeIframeApi } from '@/utils/youtubeIframeApi';
import { CLEAN_SANS } from '@/styles/fonts/cleanSans';

const ASPECT_RATIO = 16 / 9;
const REVEAL_DELAY_MS = 4500;
const MAX_DISCIPLINES = 3;

const styleIframe = (iframe: HTMLIFrameElement, title: string) => {
  iframe.title = title;
  iframe.style.position = 'absolute';
  iframe.style.top = '50%';
  iframe.style.left = '50%';
  iframe.style.border = '0';
  iframe.style.transform = 'translate(-50%, -50%)';
};
const bob = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
`;

const chipSx = {
  color: 'common.white',
  bgcolor: 'rgba(0, 0, 0, 0.45)',
  backdropFilter: 'blur(8px)',
  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.65)' },
  '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'common.white' },
} as const;

const CinematicHero = ({
  video,
  countryName,
  stats,
  autoplayAllowed,
  onReady,
}: CinematicHeroProps) => {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const loadedIdRef = useRef<string | null>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const videoRef = useRef(video);
  videoRef.current = video;

  const [playerReady, setPlayerReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playRequested, setPlayRequested] = useState(autoplayAllowed);

  const { isFullscreen, toggleFullscreen } = useHeroFullscreen(containerRef);

  const sizeIframe = useCallback(() => {
    const container = containerRef.current;
    const iframe = iframeRef.current;
    if (!container || !iframe) return;

    const { width, height } = container.getBoundingClientRect();
    let coverW = width;
    let coverH = width / ASPECT_RATIO;
    if (coverH < height) {
      coverH = height;
      coverW = height * ASPECT_RATIO;
    }
    iframe.style.width = `${coverW}px`;
    iframe.style.height = `${coverH}px`;
  }, []);

  useEffect(() => {
    const orientation = typeof screen !== 'undefined' ? screen.orientation : undefined;
    const onOrientationChange = () => {
      if (document.fullscreenElement === containerRef.current) sizeIframe();
    };
    window.addEventListener('resize', sizeIframe);
    document.addEventListener('fullscreenchange', sizeIframe);
    orientation?.addEventListener?.('change', onOrientationChange);
    return () => {
      window.removeEventListener('resize', sizeIframe);
      document.removeEventListener('fullscreenchange', sizeIframe);
      orientation?.removeEventListener?.('change', onOrientationChange);
    };
  }, [sizeIframe]);

  const hasVideo = !!video;

  useEffect(() => {
    if (!playRequested || !hasVideo) return;

    let cancelled = false;
    let revealTimer: number | undefined;
    const reveal = () => onReadyRef.current();
    const fallback = window.setTimeout(reveal, 8000);

    loadYouTubeIframeApi().then((YT) => {
      if (cancelled || !mountRef.current || playerRef.current) return;

      const current = videoRef.current;
      if (!current) return;

      const host = document.createElement('div');
      mountRef.current.appendChild(host);
      loadedIdRef.current = current.idYt;

      playerRef.current = new YT.Player(host, {
        videoId: current.idYt,
        playerVars: {
          autoplay: 1,
          mute: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
          fs: 0,
          cc_load_policy: 0,
          controls: 1,
          enablejsapi: 1,
          origin: window.location.origin,
          start: Number(current.startTime) || 0,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            iframeRef.current = event.target.getIframe();
            styleIframe(iframeRef.current, videoRef.current?.title ?? '');
            sizeIframe();
            setPlayerReady(true);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING && revealTimer === undefined) {
              revealTimer = window.setTimeout(reveal, REVEAL_DELAY_MS);
            }
            setPlaying(
              event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.BUFFERING,
            );
          },
        },
      });
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      if (revealTimer !== undefined) window.clearTimeout(revealTimer);
      try {
        playerRef.current?.destroy();
      } catch {
        /* iframe already detached */
      }
      playerRef.current = null;
      iframeRef.current = null;
      loadedIdRef.current = null;
      setPlayerReady(false);
      setPlaying(false);
    };
  }, [playRequested, hasVideo, sizeIframe]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !playerReady || !video) return;
    if (loadedIdRef.current === video.idYt) return;

    loadedIdRef.current = video.idYt;
    if (iframeRef.current) iframeRef.current.title = video.title;
    player.loadVideoById({ videoId: video.idYt, startSeconds: Number(video.startTime) || 0 });
  }, [playerReady, video]);

  const handleHintClick = () => {
    const height = containerRef.current?.offsetHeight ?? window.innerHeight;
    window.scrollTo({ top: height, behavior: 'smooth' });
  };

  const handlePlay = () => {
    if (!playRequested) {
      setPlayRequested(true);
      return;
    }
    playerRef.current?.playVideo();
  };

  const posterUrl = video
    ? video.thumbnail || `https://i.ytimg.com/vi/${video.idYt}/hqdefault.jpg`
    : null;
  const showPoster = !playerReady;
  const showPlayButton = hasVideo && (!playRequested || (playerReady && !playing));

  const statsLine = [
    t('hero.statsFights', { count: stats.fightsCount }),
    stats.cities.length > 0 ? t('hero.statsCities', { count: stats.cities.length }) : null,
    stats.disciplines.length > 0 ? stats.disciplines.slice(0, MAX_DISCIPLINES).join(', ') : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Box
      component="section"
      id="target-scroll"
      ref={containerRef}
      sx={{
        position: 'relative',
        height: '100svh',
        overflow: 'hidden',
        bgcolor: '#000',
        fontFamily: CLEAN_SANS,
        '&:fullscreen': { height: '100%' },
      }}
    >
      <Box ref={mountRef} sx={{ position: 'absolute', inset: 0 }} />

      {showPoster && posterUrl && (
        <Box
          component="img"
          src={posterUrl}
          alt=""
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.3) 100%)',
          pointerEvents: 'none',
        }}
      />

      {showPlayButton && (
        <IconButton
          onClick={handlePlay}
          aria-label={t('hero.play')}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: { xs: '1.8rem', md: '2.6rem' },
            p: { xs: 2.5, md: 3.5 },
            zIndex: 2,
            ...chipSx,
          }}
        >
          <FontAwesomeIcon icon={faPlay} />
        </IconButton>
      )}

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 20, md: 48 },
          right: { xs: 20, md: 48 },
          bottom: { xs: 88, md: 104 },
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          color: 'common.white',
          pointerEvents: 'none',
          opacity: isFullscreen ? 0 : 1,
          transition: 'opacity 350ms ease',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'inherit',
            fontSize: { xs: '0.8rem', md: '0.9rem' },
            fontWeight: 500,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            opacity: 0.75,
          }}
        >
          {t('hero.eyebrow')}
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: { xs: '2.8rem', md: '4.5rem' },
            lineHeight: 1.05,
          }}
        >
          {countryName}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'inherit',
            fontSize: { xs: '1rem', md: '1.2rem' },
            opacity: 0.85,
          }}
        >
          {statsLine}
        </Typography>
      </Box>

      <Box
        role="button"
        tabIndex={isFullscreen ? -1 : 0}
        aria-hidden={isFullscreen}
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
          bottom: { xs: 20, md: 32 },
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          color: 'common.white',
          cursor: 'pointer',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
          opacity: isFullscreen ? 0 : 0.9,
          pointerEvents: isFullscreen ? 'none' : 'auto',
          transition: 'opacity 350ms ease',
        }}
      >
        <Typography sx={{ fontFamily: 'inherit', fontSize: '0.95rem' }}>
          {t('mainEvent.scrollHint')}
        </Typography>
        <Box sx={{ fontSize: '1rem', animation: `${bob} 1.6s ease-in-out infinite` }}>
          <FontAwesomeIcon icon={faChevronDown} />
        </Box>
      </Box>

      <IconButton
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? t('hero.exitFullscreen') : t('hero.enterFullscreen')}
        sx={{
          position: 'absolute',
          top: { xs: 64, sm: 72 },
          right: { xs: 12, sm: 24 },
          zIndex: 2,
          ...chipSx,
        }}
      >
        <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
      </IconButton>
    </Box>
  );
};

export default CinematicHero;
