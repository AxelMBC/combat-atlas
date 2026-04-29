import danGableImg from "./dan_gable.webp";
import JohnSmithImg from "./john_smith.jpg";
import jordanBurroughsImg from "./jordan_burroughs.jpg";
import caelSandersonImg from "./cael_sanderson.jpg";
import KyleSnyderImg from "./kyle_snyder.webp";

const fighterImages: Record<string, string> = {
  dan_gable: danGableImg,
  john_smith: JohnSmithImg,
  jordan_burroughs: jordanBurroughsImg,
  cael_sanderson: caelSandersonImg,
  kyle_snyder: KyleSnyderImg,
};

export const getFighterImage = (filename: string): string =>
  fighterImages[filename] ?? "/placeholder.webp";
