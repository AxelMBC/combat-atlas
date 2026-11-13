import type { MainEvent } from '@/types/fightEvent.types';

import { describe, expect, it } from 'vitest';

import {
  getFightBilling,
  getFightCity,
  getFightDiscipline,
  getFightDivision,
  splitFightersFromTitle,
} from './fightBilling';

const makeEvent = (overrides: Partial<MainEvent> = {}): MainEvent => ({
  id: 1,
  idYt: 'abc123def45',
  title: 'Event 1',
  description: '',
  tags: [],
  startTime: '0',
  ...overrides,
});

describe('getFightBilling', () => {
  it('uses the red and blue fighters when both are set', () => {
    const video = makeEvent({ fighterRed: 'Chávez', fighterBlue: 'Taylor', title: 'X vs Y' });

    expect(getFightBilling(video)).toEqual(['Chávez', 'Taylor']);
  });

  it('splits an "A vs B" title', () => {
    expect(getFightBilling(makeEvent({ title: 'Márquez vs Pacquiao' }))).toEqual([
      'Márquez',
      'Pacquiao',
    ]);
  });

  it('splits an "A vs. B" title', () => {
    expect(getFightBilling(makeEvent({ title: 'Barrera VS. Morales' }))).toEqual([
      'Barrera',
      'Morales',
    ]);
  });

  it('falls back to the title when only one fighter is set', () => {
    expect(getFightBilling(makeEvent({ fighterRed: 'Chávez', title: 'Chávez vs Taylor' }))).toEqual(
      ['Chávez', 'Taylor'],
    );
  });

  it('returns null for a title that is not a matchup', () => {
    expect(getFightBilling(makeEvent({ title: 'Fight of the Century' }))).toBeNull();
  });
});

describe('splitFightersFromTitle', () => {
  it('returns null when the title has more than one "vs"', () => {
    expect(splitFightersFromTitle('A vs B vs C')).toBeNull();
  });
});

describe('getFightCity', () => {
  it('uses the location when it is set', () => {
    const video = makeEvent({ location: 'Las Vegas', venue: { city: 'Paradise', country: 'USA' } });

    expect(getFightCity(video)).toBe('Las Vegas');
  });

  it('falls back to the venue city', () => {
    expect(getFightCity(makeEvent({ venue: { city: 'Tijuana', country: 'México' } }))).toBe(
      'Tijuana',
    );
  });

  it('is undefined when neither is set', () => {
    expect(getFightCity(makeEvent())).toBeUndefined();
  });
});

describe('getFightDiscipline', () => {
  it('uses the fight type when it is set', () => {
    const video = makeEvent({ type: 'Full Fight', tags: { es: ['Boxeo'], en: ['Boxing'] } });

    expect(getFightDiscipline(video, 'es')).toBe('Full Fight');
  });

  it('falls back to the first tag in the active language', () => {
    const video = makeEvent({ tags: { es: ['Boxeo', 'Título'], en: ['Boxing', 'Title'] } });

    expect(getFightDiscipline(video, 'es')).toBe('Boxeo');
    expect(getFightDiscipline(video, 'en')).toBe('Boxing');
  });

  it('is undefined with no type and no tags', () => {
    expect(getFightDiscipline(makeEvent(), 'es')).toBeUndefined();
  });
});

describe('getFightDivision', () => {
  it('reads the division in the active language', () => {
    const video = makeEvent({ divisionId: { text: { es: 'Peso Pluma', en: 'Featherweight' } } });

    expect(getFightDivision(video, 'es')).toBe('Peso Pluma');
    expect(getFightDivision(video, 'en')).toBe('Featherweight');
  });

  it('is undefined when the fight has no division', () => {
    expect(getFightDivision(makeEvent(), 'es')).toBeUndefined();
  });
});
