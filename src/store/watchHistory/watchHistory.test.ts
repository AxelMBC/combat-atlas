import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  countUnwatched,
  forgetFights,
  markWatched,
  readWatched,
  retainFights,
  subscribe,
} from './watchHistory';

const STORAGE_KEY = 'watchedFights';

const storedIds = (): unknown => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');

describe('watchHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('readWatched', () => {
    it('reads an empty history when nothing is stored', () => {
      expect(readWatched().size).toBe(0);
    });

    it.each([
      ['text that is not JSON', 'not json'],
      ['a JSON object', '{"a":1}'],
      ['an array with a non-string', '["a", 2]'],
      ['a JSON string', '"a"'],
    ])('reads %s as an empty history', (_label, raw) => {
      localStorage.setItem(STORAGE_KEY, raw);

      expect(readWatched().size).toBe(0);
    });

    it('reads an empty history when storage throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('denied');
      });

      expect(readWatched().size).toBe(0);
    });

    it('keeps the same set until the stored value changes', () => {
      localStorage.setItem(STORAGE_KEY, '["a"]');
      const first = readWatched();

      expect(readWatched()).toBe(first);

      markWatched('b');

      expect(readWatched()).not.toBe(first);
      expect([...readWatched()]).toEqual(['a', 'b']);
    });
  });

  describe('markWatched', () => {
    it('stores an id once when marked twice', () => {
      markWatched('a');
      markWatched('a');

      expect(storedIds()).toEqual(['a']);
    });

    it('keeps an id another tab stored after the last read', () => {
      markWatched('a');
      readWatched();
      localStorage.setItem(STORAGE_KEY, '["a","from-other-tab"]');

      markWatched('b');

      expect(storedIds()).toEqual(['a', 'from-other-tab', 'b']);
    });

    it('replaces a corrupt value with an array holding only the new id', () => {
      localStorage.setItem(STORAGE_KEY, 'not json');

      markWatched('a');

      expect(storedIds()).toEqual(['a']);
    });

    it('does not throw when storage writes throw', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota');
      });

      expect(() => markWatched('a')).not.toThrow();
      expect(readWatched().size).toBe(0);
    });
  });

  it('forgets only the given ids', () => {
    localStorage.setItem(STORAGE_KEY, '["m1","t1","t2"]');

    forgetFights(['t1', 't2', 'unknown']);

    expect(storedIds()).toEqual(['m1']);
  });

  it('retains only the given ids', () => {
    localStorage.setItem(STORAGE_KEY, '["m1","gone","t1"]');

    retainFights(['m1', 't1', 't2']);

    expect(storedIds()).toEqual(['m1', 't1']);
  });

  it('notifies subscribers on its own writes and on storage events for its key', () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    markWatched('a');
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
    window.dispatchEvent(new StorageEvent('storage', { key: 'preferredLanguage' }));
    unsubscribe();
    markWatched('b');

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('counts the pool ids that are not in the history', () => {
    expect(countUnwatched(['a', 'b', 'c'], new Set(['b', 'other']))).toBe(2);
    expect(countUnwatched(['a'], new Set(['a']))).toBe(0);
    expect(countUnwatched([], new Set())).toBe(0);
  });
});
