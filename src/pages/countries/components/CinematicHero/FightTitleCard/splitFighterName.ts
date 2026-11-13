import type { FighterNameParts } from './splitFighterName.types';

const NICKNAME_PATTERN = /(?:^|\s)["'“‘](.+?)["'”’](?=\s|$)/;
const NAME_SUFFIX_PATTERN = /^(jr|sr|ii|iii|iv)\.?$/i;

export const splitFighterName = (name: string): FighterNameParts => {
  const nickname = name.match(NICKNAME_PATTERN)?.[1].trim() || undefined;
  const words = name.replace(NICKNAME_PATTERN, ' ').trim().split(/\s+/).filter(Boolean);
  const hasSuffix = words.length >= 2 && NAME_SUFFIX_PATTERN.test(words[words.length - 1]);
  const surnameStart = Math.max(words.length - (hasSuffix ? 2 : 1), 0);

  return {
    given: words.slice(0, surnameStart).join(' ') || undefined,
    nickname,
    surname: words.slice(surnameStart).join(' '),
  };
};
