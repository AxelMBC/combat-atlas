import type { ReactNode } from 'react';
import type { MainEvent } from '@/types/fightEvent.types';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { LanguageProvider, useTranslation } from '@/i18n';
import en from '@/i18n/locales/en';
import es from '@/i18n/locales/es';
import FightTitleCard from './FightTitleCard';

const makeEvent = (overrides: Partial<MainEvent> = {}): MainEvent => ({
  id: 1,
  idYt: 'abc123def45',
  title: 'Event 1',
  description: '',
  tags: [],
  startTime: '0',
  ...overrides,
});

const FULL_FIGHT = makeEvent({
  title: "Salvador Sánchez vs Danny 'Little Red' Lopez",
  type: 'Full Fight',
  year: '1980',
  date: '1980-06-21',
  location: 'Phoenix',
  venue: { name: 'Veterans Memorial Coliseum', city: 'Phoenix', country: 'USA' },
  divisionId: { text: { es: 'Peso Pluma', en: 'Featherweight' } },
  scheduledRounds: 15,
  organization: 'WBC',
});

const SwitchToEnglish = () => {
  const { setLanguage } = useTranslation();
  return <button onClick={() => setLanguage('en')}>en</button>;
};

const renderCard = (video: MainEvent, footer?: ReactNode) =>
  render(
    <LanguageProvider>
      <FightTitleCard video={video} footer={footer} />
      <SwitchToEnglish />
    </LanguageProvider>,
  );

const factValue = (label: string) => screen.getByText(label).nextElementSibling;

const factsColumn = () =>
  screen.getByText(es['titleCard.date']).parentElement?.parentElement?.parentElement;

describe('FightTitleCard', () => {
  beforeEach(() => {
    window.localStorage.setItem('preferredLanguage', 'es');
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('bills both fighters around the VS with given names, surnames and nicknames', () => {
    renderCard(FULL_FIGHT);

    expect(screen.getByText('Salvador')).toBeInTheDocument();
    expect(screen.getByText('Sánchez')).toBeInTheDocument();
    expect(screen.getByText('Danny')).toBeInTheDocument();
    expect(screen.getByText('Lopez')).toBeInTheDocument();
    expect(screen.getByText('“Little Red”')).toBeInTheDocument();
    expect(screen.getByText(es['mainEvent.vs'])).toBeInTheDocument();
  });

  it('prefers the red and blue corner names over the title', () => {
    renderCard(makeEvent({ fighterRed: 'Chávez', fighterBlue: 'Taylor', title: 'Rematch' }));

    expect(screen.getByText('Chávez')).toBeInTheDocument();
    expect(screen.getByText('Taylor')).toBeInTheDocument();
    expect(screen.queryByText('Rematch')).not.toBeInTheDocument();
  });

  it('bills a single name without VS when the title is not a matchup', () => {
    renderCard(makeEvent({ title: 'Saul Canelo Alvarez', type: 'Sparring' }));

    expect(screen.getByText('Saul Canelo')).toBeInTheDocument();
    expect(screen.getByText('Alvarez')).toBeInTheDocument();
    expect(screen.queryByText(es['mainEvent.vs'])).not.toBeInTheDocument();
  });

  it('shows the type ribbon, the title at stake and the presenter line', () => {
    renderCard(FULL_FIGHT);

    expect(screen.getByText(es['titleCard.presents'])).toBeInTheDocument();
    expect(screen.getByText('★ Full Fight ★')).toBeInTheDocument();
    expect(screen.getByText('Título WBC')).toBeInTheDocument();
  });

  it('falls back to the first localized tag for the ribbon', () => {
    renderCard(makeEvent({ tags: { es: ['Boxeo', 'Título'], en: ['Boxing', 'Title'] } }));

    expect(screen.getByText('★ Boxeo ★')).toBeInTheDocument();
  });

  it('fills every fact slot from full data', () => {
    renderCard(FULL_FIGHT);

    expect(factValue(es['titleCard.date'])).toHaveTextContent('21 jun 1980');
    expect(factValue(es['mainEvent.venue'])).toHaveTextContent('Veterans Memorial Coliseum');
    expect(screen.getByText('Phoenix')).toBeInTheDocument();
    expect(factValue(es['mainEvent.division'])).toHaveTextContent('Peso Pluma');
    expect(factValue(es['titleCard.rounds'])).toHaveTextContent('15');
  });

  it('shows a dash in the slots a sparring video has no data for', () => {
    renderCard(
      makeEvent({
        title: 'Saul Canelo Alvarez',
        type: 'Sparring',
        year: '2012',
        location: 'Santa Monica',
      }),
    );

    expect(factValue(es['titleCard.date'])).toHaveTextContent('2012');
    expect(factValue(es['mainEvent.venue'])).toHaveTextContent('Santa Monica');
    expect(factValue(es['mainEvent.division'])).toHaveTextContent('—');
    expect(factValue(es['titleCard.rounds'])).toHaveTextContent('—');
    expect(screen.queryByText(/Título/)).not.toBeInTheDocument();
  });

  it('shows a dash for the date when neither date nor year is known', () => {
    renderCard(makeEvent({ title: 'A vs B' }));

    expect(factValue(es['titleCard.date'])).toHaveTextContent('—');
    expect(factValue(es['mainEvent.venue'])).toHaveTextContent('—');
  });

  it('falls back to the year when the date cannot be parsed', () => {
    renderCard(makeEvent({ title: 'A vs B', year: '1993', date: 'sometime in 1993' }));

    expect(factValue(es['titleCard.date'])).toHaveTextContent('1993');
  });

  it('uses the venue city when the fight has no location', () => {
    renderCard(makeEvent({ title: 'A vs B', venue: { city: 'Tijuana', country: 'México' } }));

    expect(factValue(es['mainEvent.venue'])).toHaveTextContent('Tijuana');
  });

  it('switches labels, division, date format and title tag with the language', () => {
    renderCard(FULL_FIGHT);

    fireEvent.click(screen.getByRole('button', { name: 'en' }));

    expect(screen.getByText(en['titleCard.presents'])).toBeInTheDocument();
    expect(factValue(en['titleCard.date'])).toHaveTextContent('Jun 21, 1980');
    expect(factValue(en['mainEvent.division'])).toHaveTextContent('Featherweight');
    expect(factValue(en['titleCard.rounds'])).toHaveTextContent('15');
    expect(screen.getByText('WBC title')).toBeInTheDocument();
    expect(screen.getByText(en['mainEvent.vs'])).toBeInTheDocument();
  });

  it('renders the footer below the facts strip', () => {
    renderCard(FULL_FIGHT, <span>footer node</span>);

    const column = factsColumn();
    expect(column?.children).toHaveLength(2);
    expect(column?.lastElementChild).toContainElement(screen.getByText('footer node'));
  });

  it('renders nothing below the facts strip without a footer', () => {
    renderCard(FULL_FIGHT);

    expect(factsColumn()?.children).toHaveLength(1);
  });

  it('is hidden from assistive technology', () => {
    const { container } = renderCard(FULL_FIGHT);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
