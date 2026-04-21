// Sample data — replace with real data when creating a new country page
import type { Fighter } from "@/types/fighter.types";

// Import your fighter images from ../resources/fighters/
// import fighterImg from "../resources/fighters/fighter_name.webp";

export const topFightersData: Fighter[] = [
  {
    _id: "1",
    name: "Fighter Name",
    record: "0-0-0",
    nickName: "Nickname",
    image: "", // Use imported image variable here
    fightsCounter: 5,
  },
];
