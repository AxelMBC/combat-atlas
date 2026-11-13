import type { RevealIndicatorProps } from './RevealIndicator.types';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { LanguageProvider, useTranslation } from '@/i18n';
import en from '@/i18n/locales/en';
import es from '@/i18n/locales/es';
import RevealIndicator from './RevealIndicator';

const COUNTDOWN_MS = 5000;

const SwitchToEnglish = () => {
  const { setLanguage } = useTranslation();
  return <button onClick={() => setLanguage('en')}>en</button>;
};

const indicatorTree = (props: Partial<RevealIndicatorProps>) => (
  <LanguageProvider>
    <RevealIndicator
      isCountingDown={false}
      countdownMs={COUNTDOWN_MS}
      isHidden={false}
      {...props}
    />
    <SwitchToEnglish />
  </LanguageProvider>
);

const renderIndicator = (props: Partial<RevealIndicatorProps> = {}) => {
  const view = render(indicatorTree(props));
  return {
    ...view,
    update: (next: Partial<RevealIndicatorProps>) => view.rerender(indicatorTree(next)),
  };
};

const indicatorRoot = (label: string) => screen.getByText(label).parentElement?.parentElement;

const advanceSeconds = (seconds: number) => act(() => vi.advanceTimersByTime(seconds * 1000));

describe('RevealIndicator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.setItem('preferredLanguage', 'es');
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
  });

  it('shows the preparing label and no number while waiting', () => {
    renderIndicator();

    expect(screen.getByText(es['titleCard.preparing'])).toBeInTheDocument();
    expect(screen.queryByText(/^\d$/)).not.toBeInTheDocument();
  });

  it('counts down from 5 to 1 second by second and stays at 1', () => {
    renderIndicator({ isCountingDown: true });

    expect(screen.getByText(es['titleCard.startsIn'])).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    for (const expected of ['4', '3', '2', '1']) {
      advanceSeconds(1);
      expect(screen.getByText(expected)).toBeInTheDocument();
    }

    advanceSeconds(3);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('switches the label with the language without restarting the countdown', () => {
    renderIndicator({ isCountingDown: true });
    advanceSeconds(2);

    fireEvent.click(screen.getByRole('button', { name: 'en' }));

    expect(screen.getByText(en['titleCard.startsIn'])).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('fades out when hidden and keeps counting underneath', () => {
    const { update } = renderIndicator({ isCountingDown: true });
    advanceSeconds(1);

    update({ isCountingDown: true, isHidden: true });

    expect(indicatorRoot(es['titleCard.startsIn'])).toHaveStyle({ opacity: '0' });
    expect(screen.getByText('4')).toBeInTheDocument();

    advanceSeconds(1);
    expect(screen.getByText('3')).toBeInTheDocument();

    update({ isCountingDown: true, isHidden: false });
    expect(indicatorRoot(es['titleCard.startsIn'])).toHaveStyle({ opacity: '1' });
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
