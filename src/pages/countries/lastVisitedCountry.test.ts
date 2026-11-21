import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { readLastVisitedCountry, rememberLastVisitedCountry } from './lastVisitedCountry';

const throwStorageDisabled = () => {
  throw new Error('storage disabled');
};

describe('lastVisitedCountry', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads back the remembered slug', () => {
    expect(rememberLastVisitedCountry('thailand')).toBe(true);
    expect(readLastVisitedCountry()).toBe('thailand');
  });

  it('reads null when nothing was remembered', () => {
    expect(readLastVisitedCountry()).toBeNull();
  });

  it('survives an unavailable sessionStorage', () => {
    vi.stubGlobal('sessionStorage', {
      getItem: throwStorageDisabled,
      setItem: throwStorageDisabled,
    });

    expect(rememberLastVisitedCountry('mexico')).toBe(false);
    expect(readLastVisitedCountry()).toBeNull();
  });
});
