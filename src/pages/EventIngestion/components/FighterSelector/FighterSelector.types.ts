import type { Fighter } from "@/types/fighter.types";

export type Corner = "red" | "blue";

export interface FighterSelectorProps {
  corner: Corner;
  fighters: Fighter[];
  selectedId: string;
  onChange: (fighter: Fighter | null) => void;
  disabled?: boolean;
}
