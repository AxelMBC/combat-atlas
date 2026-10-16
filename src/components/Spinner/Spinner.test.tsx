import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';

import { LanguageProvider, useTranslation } from '@/i18n';
import en from '@/i18n/locales/en';
import es from '@/i18n/locales/es';
import Spinner from './Spinner';

const SwitchToEnglish = () => {
  const { setLanguage } = useTranslation();
  return <button onClick={() => setLanguage('en')}>en</button>;
};

const renderSpinner = (slowHint?: boolean) =>
  render(
    <LanguageProvider>
      <Spinner slowHint={slowHint} />
      <SwitchToEnglish />
    </LanguageProvider>,
  );

describe('Spinner slow hint', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.setItem('preferredLanguage', 'es');
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
  });

  it('does not show the hint before 4 s', () => {
    renderSpinner(true);

    act(() => {
      vi.advanceTimersByTime(3999);
    });

    expect(screen.queryByText(es['spinner.coldStart'])).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAccessibleName(es['common.loadingEllipsis']);
  });

  it('shows the hint inside the status region after 4 s', () => {
    renderSpinner(true);

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(within(screen.getByRole('status')).getByText(es['spinner.coldStart'])).toBeVisible();
  });

  it('never shows the hint when slowHint is unset', () => {
    renderSpinner();

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(screen.queryByText(es['spinner.coldStart'])).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAccessibleName(es['common.loadingEllipsis']);
  });

  it('follows the active language', () => {
    renderSpinner(true);

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    fireEvent.click(screen.getByRole('button', { name: 'en' }));

    expect(screen.getByText(en['spinner.coldStart'])).toBeInTheDocument();
    expect(screen.queryByText(es['spinner.coldStart'])).not.toBeInTheDocument();
  });
});
