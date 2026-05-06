const CITIES = [
  'Culiacán, Sinaloa',
  'Guadalajara, Jalisco',
  'Cuernavaca, Morelos',
  'Ciudad de México',
  'Bangkok, Tailandia',
  'Chiang Mai, Tailandia',
  'Las Vegas, Nevada',
  'Filadelfia, Pensilvania',
  'Brooklyn, Nueva York',
  'Detroit, Michigan',
];

const YEAR_SPANS = [
  "'80-'05",
  "'05-'10",
  "'85-'01",
  "'93-'14",
  "'10-'15",
  "'78-'97",
  "'02-'19",
  "'95-'12",
];

const TAG_POOL = [
  'LEYENDA VIVA',
  'ACTIVO',
  'INVICTO',
  '3 DIVISIONES',
  '4 DIVISIONES',
  'CONTRAGOLPEO',
  'TETRACAMPEÓN',
  'NOQUEADOR',
  'TÉCNICO',
  'PESO COMPLETO',
];

const hashId = (id: string): number => {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
};

const pick = <T>(arr: readonly T[], seed: number, offset = 0): T =>
  arr[(seed + offset) % arr.length];

const parseRecord = (record: string): { wins: number; total: number } | null => {
  const parts = record.split('-').map((s) => Number(s.trim()));
  if (parts.some((n) => Number.isNaN(n))) return null;
  const [wins = 0, losses = 0, draws = 0] = parts;
  return { wins, total: wins + losses + draws };
};

export interface FighterCardMockData {
  city: string;
  yearsActive: string;
  ko: number;
  fightsTotal: number;
  tags: string[];
}

export const getFighterCardMock = (id: string, record: string): FighterCardMockData => {
  const seed = hashId(id);
  const parsed = parseRecord(record);
  const wins = parsed?.wins ?? 20;
  const total = parsed?.total ?? 25;

  const ko = Math.max(1, Math.round(wins * (0.55 + (seed % 30) / 100)));

  const tag1 = pick(TAG_POOL, seed, 0);
  const tag2 = pick(TAG_POOL, seed, 3);
  const tags = tag1 === tag2 ? [tag1] : [tag1, tag2];

  return {
    city: pick(CITIES, seed),
    yearsActive: pick(YEAR_SPANS, seed),
    ko,
    fightsTotal: total,
    tags,
  };
};
