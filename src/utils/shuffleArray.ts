import type { mainEvent } from "@/types/fightEvent.type";

// Knuth Shuffle/Fisher-Yates algorithm
const shuffleArray = (array: mainEvent[]) => {
  const shuffledArray = [...array];
  let currentIndex = shuffledArray.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[currentIndex],
    ];
  }

  return shuffledArray;
};

export default shuffleArray;
