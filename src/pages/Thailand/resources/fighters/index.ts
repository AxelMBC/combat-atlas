import namsaknoiYudthagarngamtornImg from "./namsaknoi_yudthagarngamtorn.jpg";
import suphachaiSaepongImg from "./suphachai_saepong.jpg";
import samartPayakaroonImg from "./samart_payakaroon.webp";
import dieselnoiChorThanasukarnImg from "./dieselnoi_chor_thanasukarn.jpeg";
import apidejSitHirunImg from "./apidej_sit-hirun.webp";

const fighterImages: Record<string, string> = {
  namsaknoi_yudthagarngamtorn: namsaknoiYudthagarngamtornImg,
  suphachai_saepong: suphachaiSaepongImg,
  samart_payakaroon: samartPayakaroonImg,
  dieselnoi_chor_thanasukarn: dieselnoiChorThanasukarnImg,
  "apidej_sit-hirun": apidejSitHirunImg,
};

export const getFighterImage = (filename: string): string =>
  fighterImages[filename] ?? "/placeholder.webp";
