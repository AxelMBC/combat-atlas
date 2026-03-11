import julioCesarImg from "./julio_cesar.jpg";
import caneloAlvarezImg from "./canelo_alvarez.webp";
import ricardoLopezImg from "./ricardo_lopez.avif";
import juanManuelMarquezImg from "./juan_marquez.webp";
import salvadorSanchezImg from "./salvador_sanchez.jpg";

const fighterImages: Record<string, string> = {
  "julio_cesar.jpg": julioCesarImg,
  "canelo_alvarez.webp": caneloAlvarezImg,
  "ricardo_lopez.avif": ricardoLopezImg,
  "juan_marquez.webp": juanManuelMarquezImg,
  "salvador_sanchez.jpg": salvadorSanchezImg,
};

export const getFighterImage = (filename: string): string =>
  fighterImages[filename] ?? "/placeholder.webp";
