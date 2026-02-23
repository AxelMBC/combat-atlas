import type { fighterType } from "@/types/fighterType";

import namsaknoiYudthagarngamtornImg from "../resources/fighters/namsaknoiYudthagarngamtorn.jpg";
import suphachaiSaepongImg from "../resources/fighters/suphachaiSaepong.jpg";
import samartPayakaroonImg from "../resources/fighters/samartPayakaroon.webp";
import dieselnoiChorThanasukarnImg from "../resources/fighters/diezelnoiChorThanasukarn.jpeg";
import apidejSitHirun from "../resources/fighters/apidejSit-Hirun.jpeg";

export const topFightersData: fighterType[] = [
  {
    id: "1",
    name: "Namsaknoi Yudthagarngamtorn",
    record: "280-15-5",
    nickName: "El Emperador",
    image: namsaknoiYudthagarngamtornImg,
    fightsCounter: 5,
  },
  {
    id: "2",
    name: "Suphachai Saepong",
    record: "313-41-5",
    nickName: "Saenchai",
    image: suphachaiSaepongImg,
    fightsCounter: 5,
  },
  {
    id: "3",
    name: "Samart Payakaroon",
    record: "130-18-2",
    nickName: "El Muhammed Ali de Muay Thai",
    image: samartPayakaroonImg,
    fightsCounter: 5,
  },
  {
    id: "4",
    name: "Dieselnoi Chor Thanasukarn",
    record: "110-5-2",
    nickName: "El rey the las rodillas",
    image: dieselnoiChorThanasukarnImg,
    fightsCounter: 5,
  },
  {
    id: "5",
    name: "Apidej Sit-Hirun",
    record: "340-10-1",
    nickName: "La patada de la muerte",
    image: apidejSitHirun,
    fightsCounter: 5,
  },
];
