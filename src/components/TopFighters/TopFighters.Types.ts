import type { fighter } from "@/types/fighter.type";

export interface TopFightersProps {
  title: string;
  topFightersData: fighter[];
  onFighterSelect: (fighter: fighter) => void;
}
