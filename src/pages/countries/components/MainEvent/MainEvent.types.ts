import type { MainEvent } from "@/types/fightEvent.types";

export interface MainEventProps {
  loading: boolean;
  error: string | null;
  mainVideo: MainEvent | null;
  fetchMainVideo: () => void;
}
