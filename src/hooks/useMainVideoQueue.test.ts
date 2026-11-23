import type { ReactNode } from 'react';
import type { MainEvent } from '@/types/fightEvent.types';
import type { Fighter } from '@/types/fighter.types';

import { createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { LanguageProvider } from '@/i18n';
import { useWatchHistory } from '@/store/watchHistory/useWatchHistory';
import { markWatched } from '@/store/watchHistory/watchHistory';
import { useMainVideoQueue } from './useMainVideoQueue';

vi.mock('@/utils/scrollToMainEvent', () => ({ default: vi.fn() }));

const makeEvent = (id: string, fighterBlueId?: string, fighterRedId?: string): MainEvent => ({
  _id: id,
  idYt: `yt-${id}`,
  title: `Event ${id}`,
  description: '',
  tags: [],
  startTime: '0',
  fighterBlueId,
  fighterRedId,
});

const makeFighter = (id: string): Fighter => ({
  _id: id,
  name: `Fighter ${id}`,
  record: '',
  nickName: '',
  image: '',
  fightsCounter: 0,
});

const storeWatched = (ids: string[]) => {
  localStorage.setItem('watchedFights', JSON.stringify(ids));
};

const storedWatched = (): unknown => JSON.parse(localStorage.getItem('watchedFights') ?? 'null');

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(LanguageProvider, null, children);

const renderQueue = (initialEvents: MainEvent[]) =>
  renderHook(({ events }) => useMainVideoQueue(events, useWatchHistory()), {
    initialProps: { events: initialEvents },
    wrapper,
  });

const heroId = (result: { current: ReturnType<typeof useMainVideoQueue> }) =>
  result.current.mainVideo?._id;

const POOL = [makeEvent('a'), makeEvent('b'), makeEvent('c'), makeEvent('d')];

describe('useMainVideoQueue', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts on an unwatched fight', () => {
    storeWatched(['a', 'b', 'c']);

    const { result } = renderQueue(POOL);

    expect(heroId(result)).toBe('d');
    expect(result.current.unwatchedCount).toBe(1);
    expect(result.current.isExhausted).toBe(true);
  });

  it('starts on any fight and offers to start over when every fight is watched', () => {
    storeWatched(['a', 'b', 'c', 'd']);

    const { result } = renderQueue(POOL);

    expect(POOL.map((event) => event._id)).toContain(heroId(result));
    expect(result.current.unwatchedCount).toBe(0);
    expect(result.current.isExhausted).toBe(true);
  });

  it('counts the fight in the hero until it is recorded', () => {
    const { result } = renderQueue(POOL);

    expect(result.current.unwatchedCount).toBe(4);

    act(() => markWatched(heroId(result) ?? ''));

    expect(result.current.unwatchedCount).toBe(3);
  });

  it('shows no fight twice in a visit while an unshown unwatched fight is left', () => {
    const { result } = renderQueue(POOL);
    const shown = [heroId(result)];

    for (let pick = 0; pick < POOL.length - 1; pick += 1) {
      act(() => result.current.fetchNextVideo());
      shown.push(heroId(result));
    }

    expect(new Set(shown).size).toBe(POOL.length);

    const lastShown = heroId(result);
    act(() => result.current.fetchNextVideo());

    expect(heroId(result)).not.toBe(lastShown);
  });

  it('starts over by forgetting only this pool and loading another fight', () => {
    storeWatched(['a', 'b', 'c', 'd', 'other-country']);
    const { result } = renderQueue(POOL);
    const exhaustedHero = heroId(result);

    act(() => result.current.startOver());

    expect(storedWatched()).toEqual(['other-country']);
    expect(heroId(result)).not.toBe(exhaustedHero);
    expect(result.current.unwatchedCount).toBe(4);
    expect(result.current.isExhausted).toBe(false);
  });

  it('counts and picks fighter fights among unwatched fights outside the hero', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    storeWatched(['b']);
    const { result } = renderQueue([
      makeEvent('a', 'f1', 'f2'),
      makeEvent('b', 'f1', 'f3'),
      makeEvent('c', 'f1', 'f4'),
      makeEvent('d', 'f5', 'f6'),
    ]);

    expect(heroId(result)).toBe('a');
    expect(result.current.remainingByFighter).toEqual({ f1: 1, f4: 1, f5: 1, f6: 1 });

    act(() => result.current.fetchVideoByFighter(makeFighter('f1')));

    expect(heroId(result)).toBe('c');
  });

  it('keeps the hero when the same fights arrive in another order and rebuilds on a new set', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { result, rerender } = renderQueue(POOL);

    expect(heroId(result)).toBe('a');

    rerender({ events: [...POOL].reverse() });

    expect(heroId(result)).toBe('a');

    rerender({ events: [makeEvent('e'), ...POOL.slice(1)] });

    expect(heroId(result)).toBe('e');
  });
});
