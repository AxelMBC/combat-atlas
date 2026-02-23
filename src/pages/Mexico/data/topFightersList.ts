import type { fighterType } from "@/types/fighterType";

import julioCesarImg from "../resources/fighters/julio_cesar.jpg";
import caneloAlvarezImg from "../resources/fighters/canelo_alvarez.webp";
import ricardoLopezImg from "../resources/fighters/ricardo_lopez.avif";
import juanManuelMarquezImg from "../resources/fighters/juan_marquez.webp";
import salvadorSanchezImg from "../resources/fighters/salvador_sanchez.jpg";

export const topFightersData: fighterType[] = [
  {
    id: "1",
    name: "Julio César Chávez",
    record: "107-6-2",
    nickName: "El Gran Campeón Mexicano",
    image: julioCesarImg,
    fightsCounter: 5,
  },
  {
    id: "2",
    name: "Canelo Álvarez",
    record: "61-2-2",
    nickName: "Rey Indiscutido",
    image: caneloAlvarezImg,
    fightsCounter: 5,
  },
  {
    id: "3",
    name: "Ricardo López",
    record: "51-0-1",
    nickName: "Finito, La Perfección",
    image: ricardoLopezImg,
    fightsCounter: 5,
  },
  {
    id: "4",
    name: "Juan Manuel Márquez",
    record: "56-7-1",
    nickName: "Maestro del Contragolpe",
    image: juanManuelMarquezImg,
    fightsCounter: 5,
  },
  {
    id: "5",
    name: "Salvador Sánchez",
    record: "44-1-1",
    nickName: "El Campeón Inmortal",
    fightsCounter: 5,
    image: salvadorSanchezImg,
  },
];
