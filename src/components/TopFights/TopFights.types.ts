import type { MainEvent } from "@/types/fightEvent.types";

export interface TopEventsProps {
  title: string;
  videos: MainEvent[];
  onVideoSelect: (event: MainEvent) => void;
}
