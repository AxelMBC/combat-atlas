import { describe, expect, it } from 'vitest';

import { splitFighterName } from './splitFighterName';

describe('splitFighterName', () => {
  it('splits given names from the surname', () => {
    expect(splitFighterName('Julio César Chávez')).toEqual({
      given: 'Julio César',
      nickname: undefined,
      surname: 'Chávez',
    });
  });

  it('pulls a quoted nickname out of the name', () => {
    expect(splitFighterName("Danny 'Little Red' Lopez")).toEqual({
      given: 'Danny',
      nickname: 'Little Red',
      surname: 'Lopez',
    });
  });

  it('accepts double and typographic quotes', () => {
    expect(splitFighterName('Saúl "Canelo" Álvarez').nickname).toBe('Canelo');
    expect(splitFighterName('Saúl “Canelo” Álvarez').nickname).toBe('Canelo');
  });

  it('keeps a generational suffix with the surname', () => {
    expect(splitFighterName('Julio César Chávez Jr.')).toEqual({
      given: 'Julio César',
      nickname: undefined,
      surname: 'Chávez Jr.',
    });
    expect(splitFighterName('Chávez Jr.').surname).toBe('Chávez Jr.');
  });

  it('treats a single word as the surname', () => {
    expect(splitFighterName('Canelo')).toEqual({
      given: undefined,
      nickname: undefined,
      surname: 'Canelo',
    });
  });

  it('does not mistake an apostrophe inside a name for a nickname', () => {
    expect(splitFighterName("Danny O'Brien")).toEqual({
      given: 'Danny',
      nickname: undefined,
      surname: "O'Brien",
    });
  });
});
