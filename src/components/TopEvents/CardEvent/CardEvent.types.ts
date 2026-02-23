import type { mainEvent } from "@/types/fightEvent.type";

export interface CardEventProps {
  video: mainEvent;
  onVideoSelect: (event: mainEvent) => void;
}
