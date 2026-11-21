import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { geoBounds, geoContains } from 'd3-geo';
import isoCountries from 'i18n-iso-countries';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const topology = require('world-atlas/countries-50m.json');

const GLOBE_SPHERE_POINTS = 24000;
const GOLDEN_ANGLE_DEG = 180 * (3 - Math.sqrt(5));
const RAD_TO_DEG = 180 / Math.PI;
const UNOWNED_LAND_CODE = '';
const MAX_OWNER_CODES = 256;
const REPORTED_COUNTRY_CODES = ['MX', 'TH', 'US'];
const OUTPUT_PATH = fileURLToPath(
  new URL('../src/pages/Landing/HalftoneGlobe/globeDots.generated.ts', import.meta.url),
);

const wrapLongitude = (lng) => ((((lng + 180) % 360) + 360) % 360) - 180;

const spherePoint = (index) => ({
  lat: Math.asin(1 - (2 * index) / (GLOBE_SPHERE_POINTS - 1)) * RAD_TO_DEG,
  lng: wrapLongitude(index * GOLDEN_ANGLE_DEG),
});

const isInsideBounds = ([[west, south], [east, north]], { lat, lng }) => {
  if (lat < south || lat > north) return false;
  return west <= east ? lng >= west && lng <= east : lng >= west || lng <= east;
};

const toAlpha2 = (numericId) =>
  numericId === undefined
    ? UNOWNED_LAND_CODE
    : (isoCountries.numericToAlpha2(numericId) ?? UNOWNED_LAND_CODE);

const countries = feature(topology, topology.objects.countries).features.map((country) => ({
  code: toAlpha2(country.id),
  bounds: geoBounds(country),
  shape: country,
}));

const findCountryCode = (point) => {
  const coordinates = [point.lng, point.lat];
  const match = countries.find(
    (country) => isInsideBounds(country.bounds, point) && geoContains(country.shape, coordinates),
  );
  return match?.code;
};

const landMask = new Uint8Array(Math.ceil(GLOBE_SPHERE_POINTS / 8));
const landCodes = [];

for (let index = 0; index < GLOBE_SPHERE_POINTS; index += 1) {
  const code = findCountryCode(spherePoint(index));
  if (code === undefined) continue;
  landMask[index >> 3] |= 1 << (index & 7);
  landCodes.push(code);
}

const ownerCodes = [
  UNOWNED_LAND_CODE,
  ...[...new Set(landCodes)].filter((code) => code !== UNOWNED_LAND_CODE).sort(),
];

if (ownerCodes.length > MAX_OWNER_CODES) {
  throw new Error(`Owner codes (${ownerCodes.length}) do not fit in one byte`);
}

const ownerIndexByCode = new Map(ownerCodes.map((code, index) => [code, index]));
const landOwners = Uint8Array.from(landCodes, (code) => ownerIndexByCode.get(code));

const toBase64 = (bytes) => Buffer.from(bytes).toString('base64');

writeFileSync(
  OUTPUT_PATH,
  [
    `export const GLOBE_SPHERE_POINTS = ${GLOBE_SPHERE_POINTS};`,
    `export const GLOBE_OWNER_CODES: readonly string[] = ${JSON.stringify(ownerCodes)};`,
    `export const GLOBE_LAND_MASK = '${toBase64(landMask)}';`,
    `export const GLOBE_LAND_OWNERS = '${toBase64(landOwners)}';`,
    '',
  ].join('\n'),
);

const countDots = (code) => landCodes.filter((landCode) => landCode === code).length;

console.log(`Land dots: ${landCodes.length} of ${GLOBE_SPHERE_POINTS}`);
for (const code of REPORTED_COUNTRY_CODES) {
  console.log(`${code}: ${countDots(code)}`);
}
console.log(`Wrote ${OUTPUT_PATH}`);
