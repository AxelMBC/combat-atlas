import type { fighter } from "@/types/fighter.type";

export interface topFightersType {
  title: string;
  topFightersData: fighter[];
  onFighterSelect: (fighter: fighter) => void;
}
