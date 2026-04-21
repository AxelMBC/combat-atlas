import julioCesarImg from "./julio_cesar.avif";
import caneloAlvarezImg from "./canelo_alvarez.webp";
import ricardoLopezImg from "./ricardo_lopez.avif";
import juanManuelMarquezImg from "./juan_marquez.webp";
import salvadorSanchezImg from "./salvador_sanchez.jpg";

const fighterImages: Record<string, string> = {
  julio_cesar: julioCesarImg,
  canelo_alvarez: caneloAlvarezImg,
  ricardo_lopez: ricardoLopezImg,
  juan_marquez: juanManuelMarquezImg,
  salvador_sanchez: salvadorSanchezImg,
};

export const getFighterImage = (filename: string): string =>
  fighterImages[filename] ?? "/placeholder.webp";
