import type { ReactNode } from 'react';
import type { MainEvent } from '@/types/fightEvent.types';

import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createElement } from 'react';

import { LanguageProvider } from '@/i18n';
import { ThemeModeProvider } from '@/styles/theme';
import TopFights from './index';

const makeEvent = (id: number, idYt: string): MainEvent => ({
  id,
  idYt,
  title: `Event ${id}`,
  description: '',
  tags: [],
  startTime: '0',
});

const renderSection = (videos: MainEvent[]) => {
  const node: ReactNode = createElement(TopFights, {
    title: "Thailand's Wars",
    videos,
    onVideoSelect: vi.fn(),
  });
  return render(
    createElement(LanguageProvider, {
      children: createElement(ThemeModeProvider, { children: node }),
    }),
  );
};

describe('TopFights', () => {
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

  it('renders nothing at all when there are no videos', () => {
    renderSection([]);
    expect(screen.queryByText("Thailand's Wars")).not.toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders nothing when no video has a playable idYt', () => {
    renderSection([makeEvent(1, ''), makeEvent(2, '')]);
    expect(screen.queryByText("Thailand's Wars")).not.toBeInTheDocument();
  });

  it('renders the heading and cards when playable videos exist', () => {
    renderSection([makeEvent(1, 'abc123def45'), makeEvent(2, '')]);
    expect(screen.getByText("Thailand's Wars")).toBeInTheDocument();
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
  });
});
