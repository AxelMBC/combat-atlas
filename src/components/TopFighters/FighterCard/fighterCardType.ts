import type { fighter } from "@/types/fighter.type";

export interface fighterCardType {
  boxer: fighter;
  rank: number;
  onSelect: (fighter: fighter) => void;
}
