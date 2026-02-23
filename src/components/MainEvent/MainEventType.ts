import type { mainEvent } from "@/types/fightEvent.type";

export interface MainEventProps {
  loading: boolean;
  error: string | null;
  mainVideo: mainEvent | null;
  fetchMainVideo: () => void;
}
