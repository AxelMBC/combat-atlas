import type { GeoPoint } from '@/pages/countries/registry.types';

import { describe, expect, it } from 'vitest';

import { countryRegistry } from '@/pages/countries/registry';
import { decodeBase64, decodeGlobeDots } from './decodeGlobeDots';
import {
  GLOBE_LAND_MASK,
  GLOBE_LAND_OWNERS,
  GLOBE_OWNER_CODES,
  GLOBE_SPHERE_POINTS,
} from './globeDots.generated';

const DEG_TO_RAD = Math.PI / 180;
const CENTRE_OWNERSHIP_RADIUS_DEG = 2;
const OPEN_OCEAN_RADIUS_DEG = 3;
const MID_ATLANTIC: GeoPoint = { lat: 30, lng: -40 };

const angularDistanceDeg = (a: GeoPoint, b: GeoPoint) => {
  const cosine =
    Math.sin(a.lat * DEG_TO_RAD) * Math.sin(b.lat * DEG_TO_RAD) +
    Math.cos(a.lat * DEG_TO_RAD) *
      Math.cos(b.lat * DEG_TO_RAD) *
      Math.cos((a.lng - b.lng) * DEG_TO_RAD);
  return Math.acos(Math.min(1, Math.max(-1, cosine))) / DEG_TO_RAD;
};

const countSetBits = (bytes: Uint8Array, bitCount: number) => {
  let total = 0;
  for (let index = 0; index < bitCount; index += 1) {
    if (bytes[index >> 3] & (1 << (index & 7))) total += 1;
  }
  return total;
};

describe('decodeGlobeDots', () => {
  const dots = decodeGlobeDots();

  it('decodes one dot per land bit in the mask', () => {
    expect(dots).toHaveLength(countSetBits(decodeBase64(GLOBE_LAND_MASK), GLOBE_SPHERE_POINTS));
    expect(decodeBase64(GLOBE_LAND_OWNERS)).toHaveLength(dots.length);
  });

  it.each(countryRegistry.map(({ isoCode, center }) => [isoCode, center] as const))(
    'gives %s the land around its registry centre',
    (isoCode, center) => {
      const nearby = dots.filter(
        (dot) => angularDistanceDeg(dot, center) <= CENTRE_OWNERSHIP_RADIUS_DEG,
      );

      expect(nearby.length).toBeGreaterThan(0);
      expect(nearby.every((dot) => dot.ownerCode === isoCode)).toBe(true);
    },
  );

  it('places no land in the open mid-Atlantic', () => {
    expect(dots.some((dot) => angularDistanceDeg(dot, MID_ATLANTIC) <= OPEN_OCEAN_RADIUS_DEG)).toBe(
      false,
    );
  });

  it('keeps every owner index inside the owner code table', () => {
    const owners = decodeBase64(GLOBE_LAND_OWNERS);

    expect(owners.every((ownerIndex) => ownerIndex < GLOBE_OWNER_CODES.length)).toBe(true);
  });
});
