export interface WatchHistorySnapshot {
  raw: string | null;
  watched: ReadonlySet<string>;
}
