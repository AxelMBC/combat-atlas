import type { ReactNode } from 'react';
import type { Fighter } from '@/types/fighter.types';

import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createElement } from 'react';

import { LanguageProvider } from '@/i18n';
import { ThemeModeProvider } from '@/styles/theme';
import TopFighters from './index';

const makeFighter = (id: string): Fighter => ({
  _id: id,
  name: `Fighter ${id}`,
  record: '10-0',
  nickName: 'Nick',
  image: '',
  fightsCounter: 10,
});

const renderSection = (topFightersData: Fighter[]) => {
  const node: ReactNode = createElement(TopFighters, {
    title: 'Historic Legends',
    topFightersData,
    remainingByFighter: {},
    onFighterSelect: vi.fn(),
  });
  return render(
    createElement(LanguageProvider, {
      children: createElement(ThemeModeProvider, { children: node }),
    }),
  );
};

describe('TopFighters', () => {
  beforeAll(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('renders nothing at all when there are no fighters', () => {
    renderSection([]);
    expect(screen.queryByText('Historic Legends')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders the heading and fighter cards when fighters exist', () => {
    renderSection([makeFighter('a'), makeFighter('b')]);
    expect(screen.getByText('Historic Legends')).toBeInTheDocument();
    expect(screen.getByText('Fighter a')).toBeInTheDocument();
    expect(screen.getByText('Fighter b')).toBeInTheDocument();
  });
});
