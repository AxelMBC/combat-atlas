import type { CinematicHeroProps } from '@/pages/countries/components/CinematicHero/CinematicHero.types';
import type { MainEvent } from '@/types/fightEvent.types';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { LanguageProvider } from '@/i18n';
import { createCountryTheme } from '@/styles/theme';
import { thailandConfig } from '@/pages/Thailand/config/thailand.config';
import CountryPage from './CountryPage';

const hero = vi.hoisted(() => ({ props: null as CinematicHeroProps | null }));

vi.mock('@/pages/countries/components/CinematicHero', () => ({
  default: (props: CinematicHeroProps) => {
    hero.props = props;
    return null;
  },
}));

vi.mock('@/utils/scrollToMainEvent', () => ({ default: vi.fn() }));

const makeEvent = (id: string): MainEvent => ({
  _id: id,
  idYt: `yt-${id}`,
  title: `Event ${id}`,
  description: '',
  tags: [],
  startTime: '0',
});

const POOL = [makeEvent('pool-1'), makeEvent('pool-2')];
const HISTORIC_FIGHT = makeEvent('historic-1');

const storedWatched = (): unknown => JSON.parse(localStorage.getItem('watchedFights') ?? 'null');

const playInHero = (video: MainEvent) => act(() => hero.props?.onPlaybackStart(video));

const renderPage = () =>
  render(
    <LanguageProvider>
      <MemoryRouter>
        <CountryPage
          config={thailandConfig}
          theme={createCountryTheme(thailandConfig, 'dark')}
          topFightersData={[]}
          topEventsList={[HISTORIC_FIGHT]}
          mainEventFights={POOL}
        />
      </MemoryRouter>
    </LanguageProvider>,
  );

describe('CountryPage watch history', () => {
  beforeEach(() => {
    localStorage.setItem('preferredLanguage', 'es');
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    hero.props = null;
  });

  it('records a pool fight when it starts playing and lowers the count', () => {
    renderPage();

    expect(screen.getByText('2 por ver')).toBeInTheDocument();

    playInHero(POOL[0]);

    expect(storedWatched()).toEqual(['pool-1']);
    expect(screen.getByText('1 por ver')).toBeInTheDocument();
  });

  it('does not record a historic fight', () => {
    renderPage();

    playInHero(HISTORIC_FIGHT);

    expect(storedWatched()).toBeNull();
    expect(screen.getByText('2 por ver')).toBeInTheDocument();
  });

  it('keeps the count out of the Another Fight button', () => {
    renderPage();

    expect(screen.getByRole('button', { name: 'Otro Combate' })).toBeInTheDocument();
  });

  it('reads all watched in the header and offers to start over when nothing is left', () => {
    localStorage.setItem('watchedFights', JSON.stringify(['pool-1', 'pool-2']));
    renderPage();

    expect(screen.getByText('Todas vistas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver a empezar' })).toBeInTheDocument();
  });
});
