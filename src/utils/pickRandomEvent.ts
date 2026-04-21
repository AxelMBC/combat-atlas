import type { MainEvent } from "@/types/fightEvent.types";

const pickRandomEvent = (eventList: MainEvent[]) => {
  const randomIndex = Math.floor(Math.random() * eventList.length);
  const randomEvent = eventList[randomIndex];

  return { randomEvent, randomIndex };
};

export default pickRandomEvent;
