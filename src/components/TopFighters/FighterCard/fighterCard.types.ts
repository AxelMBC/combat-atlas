import type { fighter } from "@/types/fighter.type";

export interface FighterCardProps {
  boxer: fighter;
  rank: number;
  onSelect: (fighter: fighter) => void;
}
