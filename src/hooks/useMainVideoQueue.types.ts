import type { MainEvent } from '@/types/fightEvent.types';
import type { Fighter } from '@/types/fighter.types';

export interface UseMainVideoQueueResult {
  mainVideo: MainEvent | null;
  loading: boolean;
  error: string | null;
  fetchNextVideo: () => void;
  fetchVideoByFighter: (fighter: Fighter) => void;
  onVideoSelect: (video: MainEvent) => void;
  remainingByFighter: Record<string, number>;
  unwatchedCount: number;
  isExhausted: boolean;
  startOver: () => void;
}
