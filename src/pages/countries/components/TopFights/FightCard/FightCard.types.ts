import type { MainEvent } from "@/types/fightEvent.types";

export interface CardEventProps {
  video: MainEvent;
  onVideoSelect: (event: MainEvent) => void;
}
