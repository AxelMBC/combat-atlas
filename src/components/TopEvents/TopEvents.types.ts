import type { mainEvent } from "@/types/fightEvent.type";

export interface TopEventsProps {
  title: string;
  videos: mainEvent[];
  onVideoSelect: (event: mainEvent) => void;
}
