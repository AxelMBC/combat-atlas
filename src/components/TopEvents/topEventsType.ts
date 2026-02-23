import type { mainEvent } from "@/types/fightEvent.type";

export interface topEventsType {
  title: string;
  videos: mainEvent[];
  onVideoSelect: (event: mainEvent) => void;
}
