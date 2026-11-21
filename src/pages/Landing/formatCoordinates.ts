import type { GeoPoint } from '@/pages/countries/registry.types';
import type { HemisphereLabels } from './formatCoordinates.types';

const formatDegrees = (value: number) => `${Math.abs(value).toFixed(1)}°`;

export const formatCoordinates = (
  { lat, lng }: GeoPoint,
  { north, south, east, west }: HemisphereLabels,
): string =>
  `${formatDegrees(lat)} ${lat >= 0 ? north : south} · ${formatDegrees(lng)} ${lng >= 0 ? east : west}`;
