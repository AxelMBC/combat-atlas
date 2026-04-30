import type { Fighter } from "@/types/fighter.types";

export interface FighterCardProps {
  boxer: Fighter;
  rank: number;
  remaining: number;
  onSelect: (fighter: Fighter) => void;
}
