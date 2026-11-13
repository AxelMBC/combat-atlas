import type { MainEvent } from '@/types/fightEvent.types';

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createElement } from 'react';

import { LanguageProvider } from '@/i18n';
import { ThemeModeProvider } from '@/styles/theme';
import FightCard from './FightCard';

const makeEvent = (overrides: Partial<MainEvent> = {}): MainEvent => ({
  id: 1,
  idYt: 'abc123def45',
  title: 'Event 1',
  description: '',
  tags: [],
  startTime: '0',
  ...overrides,
});

const renderCard = (video: MainEvent, onVideoSelect = vi.fn()) => {
  render(
    createElement(LanguageProvider, {
      children: createElement(ThemeModeProvider, {
        children: createElement(FightCard, { video, onVideoSelect }),
      }),
    }),
  );
  return onVideoSelect;
};

describe('FightCard', () => {
  it('renders the billing block with both fighters and VS', () => {
    renderCard(makeEvent({ fighterRed: 'Chávez', fighterBlue: 'Taylor' }));

    expect(screen.getByText('Chávez')).toBeInTheDocument();
    expect(screen.getByText('VS')).toBeInTheDocument();
    expect(screen.getByText('Taylor')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('Chávez VS Taylor');
  });

  it('derives the fighters from an "A vs B" title', () => {
    renderCard(makeEvent({ title: 'Barrera vs. Morales' }));

    expect(screen.getByText('Barrera')).toBeInTheDocument();
    expect(screen.getByText('Morales')).toBeInTheDocument();
    expect(screen.getByText('VS')).toBeInTheDocument();
  });

  it('shows the title when fighters cannot be derived', () => {
    renderCard(makeEvent({ title: 'Fight of the Century' }));

    expect(screen.getByRole('heading')).toHaveTextContent('Fight of the Century');
    expect(screen.queryByText('VS')).not.toBeInTheDocument();
  });

  it('renders the year and subtitle when present', () => {
    renderCard(makeEvent({ year: '1990', type: 'Boxing', location: 'Las Vegas' }));

    expect(screen.getByText('1990')).toBeInTheDocument();
    expect(screen.getByText('Boxing · Las Vegas')).toBeInTheDocument();
  });

  it('uses the venue city in the subtitle when the fight has no location', () => {
    renderCard(makeEvent({ type: 'Boxing', venue: { city: 'Tijuana', country: 'MX' } }));

    expect(screen.getByText('Boxing · Tijuana')).toBeInTheDocument();
  });

  it('renders no year or subtitle element when the data is absent', () => {
    renderCard(makeEvent({ fighterRed: 'A', fighterBlue: 'B' }));

    const card = screen.getByRole('button');
    expect(card.querySelectorAll('p')).toHaveLength(0);
    expect(screen.getByRole('heading')).toHaveTextContent('A VS B');
  });

  it('calls onVideoSelect on Enter and Space', () => {
    const video = makeEvent();
    const onVideoSelect = renderCard(video);
    const card = screen.getByRole('button');

    fireEvent.keyDown(card, { key: 'Enter' });
    fireEvent.keyDown(card, { key: ' ' });

    expect(onVideoSelect).toHaveBeenCalledTimes(2);
    expect(onVideoSelect).toHaveBeenCalledWith(video);
  });

  it('swaps to the placeholder when the image fails to load', () => {
    renderCard(makeEvent({ thumbnail: '/posters/missing.webp' }));
    const img = screen.getByRole('img');

    expect(img).toHaveAttribute('src', '/posters/missing.webp');

    fireEvent.error(img);

    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining('/placeholders/no-video-placeholder.png'),
    );
  });
});
