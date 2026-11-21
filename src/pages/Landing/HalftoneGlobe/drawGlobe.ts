import type { GlobeCountry } from './HalftoneGlobe.types';
import type { GlobeDrawInput, GlobeHitTargets } from './drawGlobe.types';

import { GLOBE_DOTS } from './decodeGlobeDots';
import { GLOBE_SPHERE_POINTS } from './globeDots.generated';
import { toRgbString } from './globeColors';
import {
  FULL_TURN_RAD,
  dotPitch,
  halftoneAlpha,
  halftoneRadius,
  hitRadius,
  isOnVisibleHemisphere,
  projectOrthographic,
  shadeFromCosc,
} from './globeMath';

export const INK_GROUP = 0;

const SHADE_BUCKETS = 6;
const DISC_FILL_OPACITY = 0.7;
const RIM_OPACITY = 0.14;
const INK_DOT_OPACITY = 0.55;
const REGISTERED_DOT_OPACITY = 0.75;
const REGISTERED_DOT_SCALE = 1.1;
const SELECTED_DOT_SCALE = 1.35;
const GLOW_DOT_SCALE = 2.6;
const GLOW_OPACITY = 0.18;

export const groupDotsByCountry = (countries: readonly GlobeCountry[]): Uint8Array => {
  const groupByIsoCode = new Map(countries.map(({ isoCode }, index) => [isoCode, index + 1]));
  return Uint8Array.from(GLOBE_DOTS, ({ ownerCode }) => groupByIsoCode.get(ownerCode) ?? INK_GROUP);
};

export const createHitTargets = (dotGroups: Uint8Array): GlobeHitTargets => {
  const capacity = dotGroups.filter((group) => group !== INK_GROUP).length;
  return {
    xs: new Float32Array(capacity),
    ys: new Float32Array(capacity),
    groups: new Uint8Array(capacity),
    count: 0,
    radius: 0,
  };
};

export const findHitGroup = (targets: GlobeHitTargets, x: number, y: number): number => {
  let nearestGroup = INK_GROUP;
  let nearestDistanceSq = targets.radius * targets.radius;
  for (let index = 0; index < targets.count; index += 1) {
    const dx = targets.xs[index] - x;
    const dy = targets.ys[index] - y;
    const distanceSq = dx * dx + dy * dy;
    if (distanceSq <= nearestDistanceSq) {
      nearestDistanceSq = distanceSq;
      nearestGroup = targets.groups[index];
    }
  }
  return nearestGroup;
};

const recordHitTarget = (targets: GlobeHitTargets, x: number, y: number, group: number) => {
  targets.xs[targets.count] = x;
  targets.ys[targets.count] = y;
  targets.groups[targets.count] = group;
  targets.count += 1;
};

const shadeBucket = (shade: number) =>
  Math.min(SHADE_BUCKETS - 1, Math.floor(shade * SHADE_BUCKETS));

const bucketShade = (bucket: number) => (bucket + 0.5) / SHADE_BUCKETS;

const createBucketPaths = () => Array.from({ length: SHADE_BUCKETS }, () => new Path2D());

const addDot = (path: Path2D, x: number, y: number, radius: number) => {
  path.moveTo(x + radius, y);
  path.arc(x, y, radius, 0, FULL_TURN_RAD);
};

const dotScale = (group: number, selectedGroup: number) => {
  if (group === INK_GROUP) return 1;
  return group === selectedGroup ? SELECTED_DOT_SCALE : REGISTERED_DOT_SCALE;
};

const fillBuckets = (
  ctx: CanvasRenderingContext2D,
  paths: readonly Path2D[],
  color: string,
  opacityForShade: (shade: number) => number,
) => {
  ctx.fillStyle = color;
  paths.forEach((path, bucket) => {
    ctx.globalAlpha = opacityForShade(bucketShade(bucket));
    ctx.fill(path);
  });
};

const inkOpacity = (shade: number) => INK_DOT_OPACITY * halftoneAlpha(shade);
const registeredOpacity = (shade: number) => REGISTERED_DOT_OPACITY * halftoneAlpha(shade);
const glowOpacity = (shade: number) => GLOW_OPACITY * shade;

export const drawGlobe = ({
  ctx,
  viewport,
  view,
  ink,
  dotGroups,
  accentColors,
  selectedGroup,
  hitTargets,
}: GlobeDrawInput): void => {
  const { width, height, dpr, radius, centerX, centerY } = viewport;
  const inkColor = toRgbString(ink.ink);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, FULL_TURN_RAD);
  ctx.globalAlpha = DISC_FILL_OPACITY;
  ctx.fillStyle = toRgbString(ink.page);
  ctx.fill();
  ctx.globalAlpha = RIM_OPACITY;
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 1;
  ctx.stroke();

  const pitch = dotPitch(radius, GLOBE_SPHERE_POINTS);
  const groupPaths = Array.from({ length: accentColors.length + 1 }, createBucketPaths);
  const glowPaths = createBucketPaths();
  hitTargets.count = 0;
  hitTargets.radius = hitRadius(pitch);

  for (let index = 0; index < GLOBE_DOTS.length; index += 1) {
    const projected = projectOrthographic(GLOBE_DOTS[index], view);
    if (!isOnVisibleHemisphere(projected)) continue;

    const group = dotGroups[index];
    const shade = shadeFromCosc(projected.cosc);
    const bucket = shadeBucket(shade);
    const x = centerX + projected.x * radius;
    const y = centerY - projected.y * radius;
    const dotRadius = halftoneRadius(shade, pitch) * dotScale(group, selectedGroup);

    addDot(groupPaths[group][bucket], x, y, dotRadius);
    if (group === INK_GROUP) continue;

    recordHitTarget(hitTargets, x, y, group);
    if (group === selectedGroup) addDot(glowPaths[bucket], x, y, dotRadius * GLOW_DOT_SCALE);
  }

  if (selectedGroup !== INK_GROUP) {
    fillBuckets(ctx, glowPaths, accentColors[selectedGroup - 1], glowOpacity);
  }
  fillBuckets(ctx, groupPaths[INK_GROUP], inkColor, inkOpacity);
  accentColors.forEach((accentColor, countryIndex) => {
    const group = countryIndex + 1;
    fillBuckets(
      ctx,
      groupPaths[group],
      accentColor,
      group === selectedGroup ? halftoneAlpha : registeredOpacity,
    );
  });
  ctx.globalAlpha = 1;
};
