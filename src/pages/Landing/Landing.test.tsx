import type { CountrySummary } from '@/types/country.types';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import { LanguageProvider } from '@/i18n';
import { ThemeModeProvider } from '@/styles/theme';
import { countryRegistry } from '@/pages/countries/registry';
import { loadCountrySummaries, prefetchCountryData } from '@/store/country/countryDataCache';
import Landing from './Landing';
import { TOUR_STEP_MS } from './useCountryTour';
import { WALKOUT_MS } from './useWalkout';

const reducedMotion = vi.hoisted(() => ({ isRequested: false }));

vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: () => reducedMotion.isRequested,
}));

vi.mock('@/store/country/countryDataCache', () => ({
  loadCountrySummaries: vi.fn(),
  prefetchCountryData: vi.fn(),
}));

const [mexico, thailand, unitedStates] = countryRegistry;

const LocationProbe = () => <p data-testid="location">{useLocation().pathname}</p>;

const renderLanding = () =>
  render(
    <LanguageProvider>
      <ThemeModeProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/:countrySlug" element={<LocationProbe />} />
          </Routes>
        </MemoryRouter>
      </ThemeModeProvider>
    </LanguageProvider>,
  );

const getCountryLink = (name: RegExp) =>
  within(screen.getByRole('navigation', { name: 'Países disponibles' })).getByRole('link', {
    name,
  });

const renderedPortraitSources = () =>
  Array.from(document.querySelectorAll('img'), (image) => image.getAttribute('src'));

const fightIds = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, index) => `${prefix}-${index}`);

const SUMMARIES: CountrySummary[] = [
  { slug: 'mexico', fightIds: fightIds('mx', 15) },
  { slug: 'thailand', fightIds: fightIds('th', 20) },
  { slug: 'united-states', fightIds: fightIds('us', 12) },
];

const storeWatched = (ids: string[]) => {
  window.localStorage.setItem('watchedFights', JSON.stringify(ids));
};

const storedWatched = (): unknown =>
  JSON.parse(window.localStorage.getItem('watchedFights') ?? 'null');

const countryLinkLabels = () =>
  within(screen.getByRole('navigation', { name: 'Países disponibles' }))
    .getAllByRole('link')
    .map((link) => link.getAttribute('aria-label'));

const settleSummaries = () => act(async () => {});

describe('Landing', () => {
  beforeEach(() => {
    reducedMotion.isRequested = false;
    window.localStorage.setItem('preferredLanguage', 'es');
    sessionStorage.clear();
    vi.mocked(loadCountrySummaries).mockReturnValue(new Promise(() => {}));
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => null);
    countryRegistry.forEach((entry) => {
      vi.spyOn(entry, 'loader').mockResolvedValue({ default: () => null });
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.mocked(prefetchCountryData).mockClear();
    window.localStorage.clear();
  });

  it('links every registered country by its localized name and discipline', () => {
    renderLanding();

    const links = within(
      screen.getByRole('navigation', { name: 'Países disponibles' }),
    ).getAllByRole('link');

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/mexico',
      '/thailand',
      '/united-states',
    ]);
    expect(links.map((link) => link.getAttribute('aria-label'))).toEqual([
      'México — Boxeo',
      'Tailandia — Muay Thai',
      'Estados Unidos — Lucha',
    ]);
  });

  it('selects a country on hover and on focus', async () => {
    const user = userEvent.setup();
    renderLanding();

    expect(screen.getByText('23.6° N · 102.5° O')).toBeInTheDocument();

    await user.hover(getCountryLink(/Tailandia/));
    expect(screen.getByText('15.0° N · 101.0° E')).toBeInTheDocument();

    act(() => getCountryLink(/Estados Unidos/).focus());
    expect(screen.getByText('39.5° N · 98.4° O')).toBeInTheDocument();
  });

  it('mounts only the selected country portrait until another one is selected', async () => {
    const user = userEvent.setup();
    renderLanding();

    expect(renderedPortraitSources()).toEqual([mexico.portrait?.src]);

    await user.hover(getCountryLink(/Tailandia/));

    expect(renderedPortraitSources()).toEqual([mexico.portrait?.src, thailand.portrait?.src]);
  });

  it('selects a country on the first tap and enters it on a tap while selected', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    renderLanding();
    const tapThailand = () => {
      const link = getCountryLink(/Tailandia/);
      fireEvent.pointerDown(link, { pointerType: 'touch' });
      fireEvent.click(link, { detail: 1 });
    };

    tapThailand();

    expect(screen.getByText('15.0° N · 101.0° E')).toBeInTheDocument();
    expect(screen.queryByTestId('walkout-wipe')).not.toBeInTheDocument();
    expect(screen.queryByTestId('location')).not.toBeInTheDocument();

    tapThailand();

    expect(screen.getByTestId('walkout-wipe')).toHaveTextContent('Tailandia');
    act(() => vi.advanceTimersByTime(WALKOUT_MS));
    expect(screen.getByTestId('location')).toHaveTextContent('/thailand');
  });

  it('keeps a tapped country selected instead of resuming the tour', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    renderLanding();
    const thailandLink = getCountryLink(/Tailandia/);

    fireEvent.pointerDown(thailandLink, { pointerType: 'touch' });
    fireEvent.pointerLeave(thailandLink, { pointerType: 'touch' });
    fireEvent.click(thailandLink, { detail: 1 });
    act(() => vi.advanceTimersByTime(TOUR_STEP_MS * 2));

    expect(screen.getByText('15.0° N · 101.0° E')).toBeInTheDocument();
  });

  it('only selects on a first tap when reduced motion is requested', () => {
    reducedMotion.isRequested = true;
    renderLanding();
    const thailandLink = getCountryLink(/Tailandia/);

    fireEvent.pointerDown(thailandLink, { pointerType: 'touch' });
    fireEvent.click(thailandLink, { detail: 1 });

    expect(screen.getByText('15.0° N · 101.0° E')).toBeInTheDocument();
    expect(screen.queryByTestId('location')).not.toBeInTheDocument();
  });

  it('enters on Enter after a touch press that did not end in a tap', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    renderLanding();
    const thailandLink = getCountryLink(/Tailandia/);

    fireEvent.pointerDown(thailandLink, { pointerType: 'touch' });
    fireEvent.click(thailandLink, { detail: 0 });

    expect(screen.getByTestId('walkout-wipe')).toHaveTextContent('Tailandia');
  });

  it('plays the walkout on a plain click and navigates once it ends', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    renderLanding();

    fireEvent.click(getCountryLink(/Tailandia/));

    expect(screen.getByTestId('walkout-wipe')).toHaveTextContent('Tailandia');
    expect(screen.queryByTestId('location')).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(WALKOUT_MS));

    expect(screen.getByTestId('location')).toHaveTextContent('/thailand');
  });

  it('leaves a ctrl-click to the browser', () => {
    renderLanding();
    let wasPreventedByLanding = true;
    const recordThenBlockDocumentNavigation = (event: MouseEvent) => {
      wasPreventedByLanding = event.defaultPrevented;
      event.preventDefault();
    };
    window.addEventListener('click', recordThenBlockDocumentNavigation);

    fireEvent.click(getCountryLink(/Tailandia/), { ctrlKey: true });
    window.removeEventListener('click', recordThenBlockDocumentNavigation);

    expect(wasPreventedByLanding).toBe(false);
    expect(screen.queryByTestId('walkout-wipe')).not.toBeInTheDocument();
  });

  it('navigates immediately on click when reduced motion is requested', () => {
    reducedMotion.isRequested = true;
    renderLanding();

    fireEvent.click(getCountryLink(/Estados Unidos/));

    expect(screen.queryByTestId('walkout-wipe')).not.toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/united-states');
  });

  it('starts on the country remembered from the last visit', () => {
    sessionStorage.setItem('lastVisitedCountry', unitedStates.slug);
    renderLanding();

    expect(screen.getByText('39.5° N · 98.4° O')).toBeInTheDocument();
  });

  it('prefetches the page chunk and data once when a row is hovered', async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.hover(getCountryLink(/Tailandia/));

    expect(thailand.loader).toHaveBeenCalledTimes(1);
    expect(prefetchCountryData).toHaveBeenCalledTimes(1);
    expect(prefetchCountryData).toHaveBeenCalledWith(thailand.slug);
  });

  it('walks out of a spin into another country when no canvas is available', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    renderLanding();

    fireEvent.click(screen.getByRole('button', { name: /Gira el mundo/ }));

    expect(screen.getByTestId('walkout-wipe')).not.toHaveTextContent('México');

    act(() => vi.advanceTimersByTime(WALKOUT_MS));

    const location = screen.getByTestId('location').textContent;
    expect([`/${thailand.slug}`, `/${unitedStates.slug}`]).toContain(location);
  });

  it('spins straight into another country when reduced motion is requested', () => {
    reducedMotion.isRequested = true;
    renderLanding();

    fireEvent.click(screen.getByRole('button', { name: /Gira el mundo/ }));

    const location = screen.getByTestId('location').textContent;
    expect([`/${thailand.slug}`, `/${unitedStates.slug}`]).toContain(location);
  });
  describe('fight counts', () => {
    it('shows no count until the summary arrives, then the total in the ribbon and the name', async () => {
      let resolveSummaries: (summaries: CountrySummary[]) => void = () => {};
      vi.mocked(loadCountrySummaries).mockReturnValue(
        new Promise((resolve) => {
          resolveSummaries = resolve;
        }),
      );
      renderLanding();

      expect(countryLinkLabels()).toEqual([
        'México — Boxeo',
        'Tailandia — Muay Thai',
        'Estados Unidos — Lucha',
      ]);
      expect(getCountryLink(/Tailandia/)).toHaveTextContent('★ Muay Thai ★');

      await act(async () => resolveSummaries(SUMMARIES));

      expect(countryLinkLabels()).toEqual([
        'México — Boxeo, 15 peleas',
        'Tailandia — Muay Thai, 20 peleas',
        'Estados Unidos — Lucha, 12 peleas',
      ]);
      expect(getCountryLink(/Tailandia/)).toHaveTextContent('★ Muay Thai · 20 peleas ★');
    });

    it('counts what is left to watch, all watched and a single fight', async () => {
      storeWatched([...fightIds('th', 8), ...fightIds('us', 12)]);
      vi.mocked(loadCountrySummaries).mockResolvedValue([
        { slug: 'mexico', fightIds: ['mx-0'] },
        ...SUMMARIES.slice(1),
      ]);
      renderLanding();
      await settleSummaries();

      expect(countryLinkLabels()).toEqual([
        'México — Boxeo, 1 pelea',
        'Tailandia — Muay Thai, 12 por ver',
        'Estados Unidos — Lucha, Todas vistas',
      ]);
    });

    it('labels the counts in English', async () => {
      window.localStorage.setItem('preferredLanguage', 'en');
      storeWatched([...fightIds('th', 8), ...fightIds('us', 12)]);
      vi.mocked(loadCountrySummaries).mockResolvedValue(SUMMARIES);
      renderLanding();
      await settleSummaries();

      const links = within(
        screen.getByRole('navigation', { name: 'Available countries' }),
      ).getAllByRole('link');

      expect(links.map((link) => link.getAttribute('aria-label'))).toEqual([
        'Mexico — Boxing, 15 fights',
        'Thailand — Muay Thai, 12 to watch',
        'United States — Wrestling, All watched',
      ]);
    });

    it('shows no count for a country missing from the summary or listed without fights', async () => {
      vi.mocked(loadCountrySummaries).mockResolvedValue([{ slug: 'thailand', fightIds: [] }]);
      renderLanding();
      await settleSummaries();

      expect(countryLinkLabels()).toEqual([
        'México — Boxeo',
        'Tailandia — Muay Thai',
        'Estados Unidos — Lucha',
      ]);
    });

    it('shows no count and no error when the summary fails', async () => {
      vi.mocked(loadCountrySummaries).mockRejectedValue(new Error('Request failed with 404'));
      renderLanding();
      await settleSummaries();

      expect(countryLinkLabels()).toEqual([
        'México — Boxeo',
        'Tailandia — Muay Thai',
        'Estados Unidos — Lucha',
      ]);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.queryByText(/404/)).not.toBeInTheDocument();
    });

    it('drops watched fights that are in no country summary', async () => {
      storeWatched(['mx-0', 'gone', 'th-3']);
      vi.mocked(loadCountrySummaries).mockResolvedValue([
        { slug: 'mexico', fightIds: ['mx-0', 'mx-1'] },
      ]);
      renderLanding();
      await settleSummaries();

      expect(storedWatched()).toEqual(['mx-0']);
      expect(countryLinkLabels()[0]).toBe('México — Boxeo, 1 por ver');
    });

    it('keeps the history when the summary lists no country or fails', async () => {
      storeWatched(['mx-0', 'gone']);
      vi.mocked(loadCountrySummaries).mockResolvedValueOnce([]);
      const { unmount } = renderLanding();
      await settleSummaries();
      unmount();

      vi.mocked(loadCountrySummaries).mockRejectedValueOnce(new Error('timeout'));
      renderLanding();
      await settleSummaries();

      expect(storedWatched()).toEqual(['mx-0', 'gone']);
    });
  });
});
