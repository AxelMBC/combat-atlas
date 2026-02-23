import type { mainEvent } from "@/types/fightEvent.type";

const pickRandomEvent = (eventList: mainEvent[]) => {
  const randomIndex = Math.floor(Math.random() * eventList.length);
  const randomEvent = eventList[randomIndex];

  return { randomEvent, randomIndex };
};

export default pickRandomEvent;
