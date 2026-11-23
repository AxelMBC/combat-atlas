import type { WatchHistorySnapshot } from './watchHistory.types';

import { isStringArray } from '@/utils/isStringArray';

const WATCHED_FIGHTS_KEY = 'watchedFights';

const listeners = new Set<() => void>();

let snapshot: WatchHistorySnapshot = { raw: null, watched: new Set() };

const readRaw = (): string | null => {
  try {
    return localStorage.getItem(WATCHED_FIGHTS_KEY);
  } catch {
    return null;
  }
};

const parseIds = (raw: string | null): string[] => {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return isStringArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const writeIds = (ids: readonly string[]) => {
  try {
    localStorage.setItem(WATCHED_FIGHTS_KEY, JSON.stringify(ids));
  } catch {
    return;
  }
  notifyListeners();
};

const keepStoredIds = (shouldKeep: (id: string) => boolean) => {
  const stored = parseIds(readRaw());
  const kept = stored.filter(shouldKeep);
  if (kept.length !== stored.length) writeIds(kept);
};

export const readWatched = (): ReadonlySet<string> => {
  const raw = readRaw();
  if (raw !== snapshot.raw) snapshot = { raw, watched: new Set(parseIds(raw)) };
  return snapshot.watched;
};

export const markWatched = (id: string): void => {
  const stored = parseIds(readRaw());
  if (stored.includes(id)) return;
  writeIds([...stored, id]);
};

export const forgetFights = (ids: readonly string[]): void => {
  const forgotten = new Set(ids);
  keepStoredIds((id) => !forgotten.has(id));
};

export const retainFights = (validIds: readonly string[]): void => {
  const valid = new Set(validIds);
  keepStoredIds((id) => valid.has(id));
};

export const subscribe = (listener: () => void): (() => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === WATCHED_FIGHTS_KEY || event.key === null) listener();
  };
  listeners.add(listener);
  window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
};

export const countUnwatched = (poolIds: readonly string[], watched: ReadonlySet<string>): number =>
  poolIds.filter((id) => !watched.has(id)).length;
