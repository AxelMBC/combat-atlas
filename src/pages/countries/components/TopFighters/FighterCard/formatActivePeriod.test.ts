import { describe, expect, it } from 'vitest';

import { formatActivePeriod } from './formatActivePeriod';

const labels = { activeSince: 'Active since', notAvailable: 'N/A' };

describe('formatActivePeriod', () => {
  it('returns the not-available label when the period is missing', () => {
    expect(formatActivePeriod(undefined, labels)).toBe('N/A');
    expect(formatActivePeriod('', labels)).toBe('N/A');
  });

  it('formats an open-ended period as "<activeSince> <start>"', () => {
    expect(formatActivePeriod('2015-', labels)).toBe('Active since 2015');
    expect(formatActivePeriod('2015 -', labels)).toBe('Active since 2015');
  });

  it('returns a closed period unchanged', () => {
    expect(formatActivePeriod('2010-2015', labels)).toBe('2010-2015');
  });
});
