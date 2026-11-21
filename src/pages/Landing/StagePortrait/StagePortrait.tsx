import type { StagePortraitProps } from './StagePortrait.types';

import { useState } from 'react';

import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';

const PORTRAIT_CROSSFADE = 'opacity 0.4s ease';
const PORTRAIT_FILTER = 'grayscale(1) contrast(1.25)';
const PORTRAIT_OPACITY = { dark: 0.6, light: 0.6 } as const;
const PORTRAIT_BLEND = { dark: 'multiply', light: 'screen' } as const;
const HALFTONE_DOT_OPACITY = 0.5;
const PORTRAIT_MASK = {
  xs: 'linear-gradient(to bottom, transparent 0%, black 22%, black 45%, transparent 90%)',
  md: 'radial-gradient(ellipse closest-side, black 45%, transparent 100%)',
};

const withSlug = (slugs: ReadonlySet<string>, slug: string): ReadonlySet<string> =>
  new Set(slugs).add(slug);

const StagePortrait = ({ entries, selectedSlug }: StagePortraitProps) => {
  const { surfaces, mode } = useTheme().palette;
  const [seenSlugs, setSeenSlugs] = useState<ReadonlySet<string>>(() => new Set([selectedSlug]));
  const [loadedSlugs, setLoadedSlugs] = useState<ReadonlySet<string>>(() => new Set());
  const [brokenSlugs, setBrokenSlugs] = useState<ReadonlySet<string>>(() => new Set());

  if (!seenSlugs.has(selectedSlug)) setSeenSlugs(withSlug(seenSlugs, selectedSlug));

  const selectedPortrait = entries.find(({ slug }) => slug === selectedSlug)?.portrait;
  const isSelectedPortraitShown = loadedSlugs.has(selectedSlug) && !brokenSlugs.has(selectedSlug);

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          insetInline: 0,
          top: { xs: 0, md: 'auto' },
          bottom: { md: 0 },
          height: { xs: '100%', md: '90vh' },
          maskImage: PORTRAIT_MASK,
          WebkitMaskImage: PORTRAIT_MASK,
          pointerEvents: 'none',
        }}
      >
        {entries.map(({ slug, portrait, accentColor }) => {
          if (!portrait || !seenSlugs.has(slug) || brokenSlugs.has(slug)) return null;
          const isShown = slug === selectedSlug && loadedSlugs.has(slug);
          return (
            <Box
              key={slug}
              sx={{
                position: 'absolute',
                inset: 0,
                isolation: 'isolate',
                bgcolor: accentColor,
                opacity: isShown ? PORTRAIT_OPACITY[mode] : 0,
                transition: PORTRAIT_CROSSFADE,
              }}
            >
              <Box
                component="img"
                src={portrait.src}
                alt=""
                decoding="async"
                onLoad={() => setLoadedSlugs((slugs) => withSlug(slugs, slug))}
                onError={() => setBrokenSlugs((slugs) => withSlug(slugs, slug))}
                sx={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 25%',
                  filter: PORTRAIT_FILTER,
                  mixBlendMode: PORTRAIT_BLEND[mode],
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `radial-gradient(${alpha(surfaces.page, HALFTONE_DOT_OPACITY)} 1.2px, transparent 1.7px)`,
                  backgroundSize: '6px 6px',
                }}
              />
            </Box>
          );
        })}
      </Box>

      {selectedPortrait && isSelectedPortraitShown && (
        <Typography
          sx={{
            position: 'absolute',
            insetInline: 0,
            bottom: { xs: 4, md: '5vh' },
            textAlign: 'center',
            fontFamily: HEADLINE_FONT,
            fontSize: { xs: '0.7rem', md: '0.8rem' },
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: surfaces.textMuted,
            transition: 'color 0.2s ease',
          }}
        >
          {selectedPortrait.fighterName}
        </Typography>
      )}
    </>
  );
};

export default StagePortrait;
