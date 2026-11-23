import { useSyncExternalStore } from 'react';

import { readWatched, subscribe } from './watchHistory';

export const useWatchHistory = (): ReadonlySet<string> =>
  useSyncExternalStore(subscribe, readWatched);
