import '@/styles/fonts/default.scss';

import type { MouseEvent } from 'react';
import type { CountryEntry } from '@/pages/countries/registry.types';
import type { GlobeSpinRequest } from './HalftoneGlobe/HalftoneGlobe.types';
import type { RowTouchPress } from './Landing.types';

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';

import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import SiteCredit from '@/components/SiteCredit';
import { useTranslation } from '@/i18n';
import { countryRegistry } from '@/pages/countries/registry';
import { readLastVisitedCountry } from '@/pages/countries/lastVisitedCountry';
import { prefetchCountryData } from '@/store/country/countryDataCache';
import { BODY_FONT, HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';

import FightCardBilling from './FightCardBilling';
import HalftoneGlobe from './HalftoneGlobe';
import LandingStage from './LandingStage';
import SpinControl from './SpinControl';
import WalkoutWipe from './WalkoutWipe';
import { isPlainPrimaryClick } from './isPlainPrimaryClick';
import { pickRandomCountry } from './pickRandomCountry';
import { useCountryFightCounts } from './useCountryFightCounts';
import { useCountryTour } from './useCountryTour';
import { useWalkout } from './useWalkout';

const GLOBE_SIZE = { xs: 'min(88vw, 44svh)', md: 'min(46vw, 82svh)' };
const SURFACE_TRANSITION = 'background-color 0.2s ease, color 0.2s ease';
const MOUSE_POINTER = 'mouse';

const findEntryBySlug = (slug: string | null) =>
  countryRegistry.find((entry) => entry.slug === slug);

const findEntryByIsoCode = (isoCode: string | null) =>
  countryRegistry.find((entry) => entry.isoCode === isoCode);

const readInitialSlug = () =>
  (findEntryBySlug(readLastVisitedCountry()) ?? countryRegistry[0]).slug;

const nextSlug = (slug: string) => {
  const index = countryRegistry.findIndex((entry) => entry.slug === slug);
  return countryRegistry[(index + 1) % countryRegistry.length].slug;
};

const prefetchCountry = (entry: CountryEntry) => {
  entry.loader().catch(() => {});
  prefetchCountryData(entry.slug);
};

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { surfaces, mode } = useTheme().palette;
  const reduceMotion = useReducedMotion() ?? false;
  const [selectedSlug, setSelectedSlug] = useState(readInitialSlug);
  const [spinRequest, setSpinRequest] = useState<GlobeSpinRequest | null>(null);
  const { walkoutEntry, startWalkout } = useWalkout();
  const touchPressRef = useRef<RowTouchPress | null>(null);
  const fightCounts = useCountryFightCounts();

  const selectedEntry = findEntryBySlug(selectedSlug) ?? countryRegistry[0];
  const isFrozen = spinRequest !== null || walkoutEntry !== null;

  const { pointerZoneHandlers, focusHandlers } = useCountryTour({
    isEnabled: !reduceMotion && !isFrozen,
    selectedSlug,
    onAdvance: () => setSelectedSlug(nextSlug),
  });

  const handleIntent = (entry: CountryEntry) => {
    prefetchCountry(entry);
    if (!isFrozen) setSelectedSlug(entry.slug);
  };

  const enterCountry = (entry: CountryEntry) => {
    if (isFrozen) return;
    if (reduceMotion) {
      navigate(`/${entry.slug}`);
      return;
    }
    setSelectedSlug(entry.slug);
    startWalkout(entry);
  };

  const handlePress = (entry: CountryEntry, pointerType: string) => {
    if (pointerType === MOUSE_POINTER) {
      touchPressRef.current = null;
      handleIntent(entry);
      return;
    }
    prefetchCountry(entry);
    touchPressRef.current = { slug: entry.slug, wasSelected: entry.slug === selectedSlug };
  };

  const handleActivate = (event: MouseEvent<HTMLAnchorElement>, entry: CountryEntry) => {
    const touchPress = touchPressRef.current;
    touchPressRef.current = null;
    const isPreviewTap =
      event.detail > 0 && touchPress?.slug === entry.slug && !touchPress.wasSelected;
    if (isPreviewTap) {
      event.preventDefault();
      if (!isFrozen) setSelectedSlug(entry.slug);
      return;
    }
    if (reduceMotion || !isPlainPrimaryClick(event)) return;
    event.preventDefault();
    enterCountry(entry);
  };

  const handlePointCountry = (isoCode: string | null) => {
    const entry = findEntryByIsoCode(isoCode);
    if (entry) handleIntent(entry);
  };

  const handleEnterFromGlobe = (isoCode: string) => {
    const entry = findEntryByIsoCode(isoCode);
    if (!entry) return;
    prefetchCountry(entry);
    enterCountry(entry);
  };

  const handleSpin = () => {
    if (isFrozen) return;
    const target = pickRandomCountry(countryRegistry, selectedSlug);
    prefetchCountry(target);
    if (reduceMotion) {
      navigate(`/${target.slug}`);
      return;
    }
    setSelectedSlug(target.slug);
    setSpinRequest((previous) => ({ id: (previous?.id ?? 0) + 1, isoCode: target.isoCode }));
  };

  const handleSpinSettled = () => {
    const entry = findEntryByIsoCode(spinRequest?.isoCode ?? null);
    if (entry) startWalkout(entry);
  };

  return (
    <Box
      component="main"
      {...focusHandlers}
      sx={{
        position: 'relative',
        minHeight: '100dvh',
        overflow: 'hidden',
        bgcolor: surfaces.page,
        color: surfaces.textPrimary,
        transition: SURFACE_TRANSITION,
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(420px, 44%) minmax(0, 1fr)' },
        gridTemplateRows: { xs: 'auto auto auto', md: 'auto 1fr' },
        gridTemplateAreas: {
          xs: '"masthead" "stage" "bill"',
          md: '"masthead stage" "bill stage"',
        },
      }}
    >
      <Box
        component="header"
        sx={{
          gridArea: 'masthead',
          position: 'relative',
          zIndex: 1,
          px: { xs: 2.5, sm: 4, md: 6 },
          pt: { xs: 2.25, md: 6 },
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: HEADLINE_FONT,
            fontSize: { xs: '0.95rem', md: '1.1rem' },
            lineHeight: 1.6,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
          }}
        >
          {t('landing.eyebrow')}
        </Typography>
        <Typography
          sx={{
            fontFamily: BODY_FONT,
            fontStyle: 'italic',
            fontSize: { xs: '0.85rem', md: '1rem' },
            color: surfaces.textSecondary,
            transition: SURFACE_TRANSITION,
          }}
        >
          {t('landing.tagline')}
        </Typography>
      </Box>

      <LandingStage entries={countryRegistry} selectedEntry={selectedEntry}>
        <Box
          {...pointerZoneHandlers}
          sx={{ position: 'relative', width: GLOBE_SIZE, height: GLOBE_SIZE }}
        >
          <HalftoneGlobe
            countries={countryRegistry}
            selectedIsoCode={selectedEntry.isoCode}
            spin={spinRequest}
            colors={{ ink: surfaces.textPrimary, page: surfaces.page }}
            reduceMotion={reduceMotion}
            onPointCountry={handlePointCountry}
            onEnterCountry={handleEnterFromGlobe}
            onSpinSettled={handleSpinSettled}
          />
        </Box>
      </LandingStage>

      <Box
        sx={{
          gridArea: 'bill',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { md: 'center' },
          gap: { xs: 2, md: 4 },
          px: { xs: 2.5, sm: 4, md: 6 },
          pb: { xs: 2.5, md: 6 },
        }}
      >
        <Box
          {...pointerZoneHandlers}
          sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}
        >
          <FightCardBilling
            entries={countryRegistry}
            selectedSlug={selectedSlug}
            fightCounts={fightCounts}
            reduceMotion={reduceMotion}
            onIntent={handleIntent}
            onPress={handlePress}
            onActivate={handleActivate}
          />
          <SpinControl
            accentColor={selectedEntry.accentColor}
            isDisabled={isFrozen}
            onSpin={handleSpin}
          />
        </Box>
        <SiteCredit tone={mode === 'dark' ? 'onDark' : 'onLight'} />
      </Box>

      {walkoutEntry && (
        <WalkoutWipe name={t(walkoutEntry.nameKey)} accentColor={walkoutEntry.accentColor} />
      )}
    </Box>
  );
};

export default Landing;
