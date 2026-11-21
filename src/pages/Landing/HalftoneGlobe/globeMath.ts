import type {
  ProjectedPoint,
  SphereTrig,
  SpringAxis,
  SpringConfig,
  SpringStep,
} from './globeMath.types';

export const DEG_TO_RAD = Math.PI / 180;
export const FULL_TURN_RAD = 2 * Math.PI;

export const SELECTION_SPRING: SpringConfig = { stiffness: 60, dampingRatio: 0.9 };
export const SPIN_SPRING: SpringConfig = { stiffness: 10, dampingRatio: 1 };
export const SPIN_EXTRA_TURNS = 2;

const TILT_LATITUDE_FACTOR = 0.7;
const MAX_TILT_RAD = 30 * DEG_TO_RAD;
const SETTLED_DISTANCE_RAD = 0.002;
const SETTLED_SPEED_RAD_S = 0.01;
const INERTIA_FRICTION_PER_S = 3.2;

const HALFTONE_SHADE_EXPONENT = 0.55;
const HALFTONE_RADIUS_BASE = 0.1;
const HALFTONE_RADIUS_GAIN = 0.32;
const HALFTONE_ALPHA_BASE = 0.18;
const HALFTONE_ALPHA_GAIN = 0.82;

const MIN_HIT_RADIUS_PX = 10;
const HIT_RADIUS_PITCHES = 1.6;

export const toSphereTrig = (latRad: number, lngRad: number): SphereTrig => ({
  sinLat: Math.sin(latRad),
  cosLat: Math.cos(latRad),
  sinLng: Math.sin(lngRad),
  cosLng: Math.cos(lngRad),
});

export const projectOrthographic = (point: SphereTrig, view: SphereTrig): ProjectedPoint => {
  const cosDeltaLng = point.cosLng * view.cosLng + point.sinLng * view.sinLng;
  const sinDeltaLng = point.sinLng * view.cosLng - point.cosLng * view.sinLng;
  return {
    x: point.cosLat * sinDeltaLng,
    y: view.cosLat * point.sinLat - view.sinLat * point.cosLat * cosDeltaLng,
    cosc: view.sinLat * point.sinLat + view.cosLat * point.cosLat * cosDeltaLng,
  };
};

export const isOnVisibleHemisphere = ({ cosc }: ProjectedPoint): boolean => cosc > 0;

export const shortestLngDelta = (fromRad: number, toRad: number): number =>
  Math.atan2(Math.sin(toRad - fromRad), Math.cos(toRad - fromRad));

export const tiltForLatitude = (latRad: number): number =>
  Math.max(-MAX_TILT_RAD, Math.min(MAX_TILT_RAD, latRad * TILT_LATITUDE_FACTOR));

export const stepSpring = (
  axis: SpringAxis,
  target: number,
  { stiffness, dampingRatio }: SpringConfig,
  dt: number,
): SpringStep => {
  const damping = 2 * dampingRatio * Math.sqrt(stiffness);
  const acceleration = -stiffness * (axis.position - target) - damping * axis.velocity;
  const velocity = axis.velocity + acceleration * dt;
  const position = axis.position + velocity * dt;
  const isSettled =
    Math.abs(target - position) < SETTLED_DISTANCE_RAD && Math.abs(velocity) < SETTLED_SPEED_RAD_S;
  return isSettled
    ? { position: target, velocity: 0, isSettled }
    : { position, velocity, isSettled };
};

export const applyInertiaFriction = (velocity: number, dt: number): number => {
  const slowed = velocity * Math.exp(-INERTIA_FRICTION_PER_S * dt);
  return Math.abs(slowed) < SETTLED_SPEED_RAD_S ? 0 : slowed;
};

export const shadeFromCosc = (cosc: number): number => Math.pow(cosc, HALFTONE_SHADE_EXPONENT);

export const halftoneRadius = (shade: number, pitch: number): number =>
  pitch * (HALFTONE_RADIUS_BASE + HALFTONE_RADIUS_GAIN * shade);

export const halftoneAlpha = (shade: number): number =>
  HALFTONE_ALPHA_BASE + HALFTONE_ALPHA_GAIN * shade;

export const dotPitch = (globeRadius: number, spherePoints: number): number =>
  globeRadius * Math.sqrt((4 * Math.PI) / spherePoints);

export const hitRadius = (pitch: number): number =>
  Math.max(MIN_HIT_RADIUS_PX, HIT_RADIUS_PITCHES * pitch);
