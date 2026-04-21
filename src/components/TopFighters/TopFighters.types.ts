import type { Fighter } from "@/types/fighter.types";

export interface TopFightersProps {
  title: string;
  topFightersData: Fighter[];
  remainingByFighter: Record<string, number>;
  onFighterSelect: (fighter: Fighter) => void;
}
