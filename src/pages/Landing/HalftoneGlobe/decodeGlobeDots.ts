import type { GlobeDot } from './decodeGlobeDots.types';

import {
  GLOBE_LAND_MASK,
  GLOBE_LAND_OWNERS,
  GLOBE_OWNER_CODES,
  GLOBE_SPHERE_POINTS,
} from './globeDots.generated';

const GOLDEN_ANGLE_DEG = 180 * (3 - Math.sqrt(5));
const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

export const decodeBase64 = (encoded: string): Uint8Array =>
  Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0));

export const isLandPoint = (landMask: Uint8Array, index: number): boolean =>
  (landMask[index >> 3] & (1 << (index & 7))) !== 0;

const wrapLongitude = (lng: number): number => ((((lng + 180) % 360) + 360) % 360) - 180;

const toGlobeDot = (index: number, ownerCode: string): GlobeDot => {
  const lat = Math.asin(1 - (2 * index) / (GLOBE_SPHERE_POINTS - 1)) * RAD_TO_DEG;
  const lng = wrapLongitude(index * GOLDEN_ANGLE_DEG);
  return {
    lat,
    lng,
    ownerCode,
    sinLat: Math.sin(lat * DEG_TO_RAD),
    cosLat: Math.cos(lat * DEG_TO_RAD),
    sinLng: Math.sin(lng * DEG_TO_RAD),
    cosLng: Math.cos(lng * DEG_TO_RAD),
  };
};

export const decodeGlobeDots = (): GlobeDot[] => {
  const landMask = decodeBase64(GLOBE_LAND_MASK);
  const landOwners = decodeBase64(GLOBE_LAND_OWNERS);
  const dots: GlobeDot[] = [];

  for (let index = 0; index < GLOBE_SPHERE_POINTS; index += 1) {
    if (!isLandPoint(landMask, index)) continue;
    dots.push(toGlobeDot(index, GLOBE_OWNER_CODES[landOwners[dots.length]]));
  }

  return dots;
};

export const GLOBE_DOTS: readonly GlobeDot[] = decodeGlobeDots();
