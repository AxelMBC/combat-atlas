import type { ClickModifiers } from './isPlainPrimaryClick.types';

import { describe, expect, it } from 'vitest';

import { isPlainPrimaryClick } from './isPlainPrimaryClick';

const PLAIN_CLICK: ClickModifiers = {
  button: 0,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  altKey: false,
};

describe('isPlainPrimaryClick', () => {
  it('accepts a primary click with no modifier', () => {
    expect(isPlainPrimaryClick(PLAIN_CLICK)).toBe(true);
  });

  it.each(['ctrlKey', 'metaKey', 'shiftKey', 'altKey'] as const)(
    'rejects a primary click with %s held',
    (modifier) => {
      expect(isPlainPrimaryClick({ ...PLAIN_CLICK, [modifier]: true })).toBe(false);
    },
  );

  it('rejects a middle click', () => {
    expect(isPlainPrimaryClick({ ...PLAIN_CLICK, button: 1 })).toBe(false);
  });
});
