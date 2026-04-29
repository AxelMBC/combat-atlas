import namsaknoiYudthagarngamtornImg from "./namsaknoi_yudthagarngamtorn.jpg";
import saenchai from "./saenchai.jpg";
import samartPayakaroonImg from "./samart_payakaroon.webp";
import dieselnoiChorThanasukarnImg from "./dieselnoi_chor_thanasukarn.jpeg";
import apidejSitHirunImg from "./apidej_sit_hirun.jpg";

const fighterImages: Record<string, string> = {
  namsaknoi_yudthagarngamtorn: namsaknoiYudthagarngamtornImg,
  saenchai: saenchai,
  samart_payakaroon: samartPayakaroonImg,
  dieselnoi_chor_thanasukarn: dieselnoiChorThanasukarnImg,
  apidej_sit_hirun: apidejSitHirunImg,
};

export const getFighterImage = (filename: string): string =>
  fighterImages[filename] ?? "/placeholder.webp";
