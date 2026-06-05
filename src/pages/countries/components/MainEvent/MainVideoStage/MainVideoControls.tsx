import type { MainVideoControlsProps } from './MainVideoControls.types';

import { useState } from 'react';

// MUI
import { Box, IconButton, Slider, Typography } from '@mui/material';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const formatTime = (seconds: number) => {
  const safe = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const MainVideoControls = ({
  visible,
  playing,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
}: MainVideoControlsProps) => {
  const [dragValue, setDragValue] = useState<number | null>(null);

  const max = duration > 0 ? duration : 0;
  const value = dragValue ?? Math.min(currentTime, max);

  const toNumber = (next: number | number[]) => (Array.isArray(next) ? next[0] : next);

  const handleChange = (_: Event, next: number | number[]) => setDragValue(toNumber(next));

  const handleCommit = (_: Event | React.SyntheticEvent, next: number | number[]) => {
    onSeek(toNumber(next));
    setDragValue(null);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 0.75, md: 1.5 },
        px: { xs: 1, md: 2 },
        py: { xs: 0.25, md: 1 },
        bgcolor: 'rgba(0, 0, 0, 0.85)',
        borderTop: { xs: '1px solid', md: '2px solid' },
        borderColor: 'common.white',
        pointerEvents: visible ? 'auto' : 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      <IconButton
        onClick={onTogglePlay}
        aria-label={playing ? 'Pause' : 'Play'}
        sx={{
          color: 'common.white',
          width: { xs: 24, md: 32 },
          height: { xs: 24, md: 32 },
          fontSize: { xs: '0.75rem', md: '0.9rem' },
        }}
      >
        <FontAwesomeIcon icon={playing ? faPause : faPlay} />
      </IconButton>

      <Slider
        value={value}
        min={0}
        max={max || 1}
        step={1}
        onChange={handleChange}
        onChangeCommitted={handleCommit}
        aria-label="Seek"
        sx={{
          color: 'common.white',
          py: { xs: 1, md: 1.5 },
          '& .MuiSlider-thumb': {
            width: { xs: 10, md: 12 },
            height: { xs: 10, md: 12 },
          },
        }}
      />

      <Typography
        sx={{
          fontFamily: 'Anton, sans-serif',
          fontSize: { xs: '0.65rem', md: '0.8rem' },
          letterSpacing: '0.06em',
          color: 'common.white',
          whiteSpace: 'nowrap',
          minWidth: { xs: 64, md: 84 },
          textAlign: 'right',
        }}
      >
        {formatTime(value)} / {formatTime(max)}
      </Typography>
    </Box>
  );
};

export default MainVideoControls;
