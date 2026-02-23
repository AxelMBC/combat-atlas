import type { mainEvent } from "@/types/fightEvent.type";

export interface cardEventType {
  video: mainEvent;
  onVideoSelect: (event: mainEvent) => void;
}
