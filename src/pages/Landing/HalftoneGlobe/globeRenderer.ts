import type { GlobeColors, GlobeCountry, GlobeSpinRequest } from './HalftoneGlobe.types';
import type { GlobeViewport } from './drawGlobe.types';
import type { GlobeInk } from './globeColors.types';
import type { SphereTrig } from './globeMath.types';
import type {
  GlobeColorTransition,
  GlobeDrag,
  GlobeMotion,
  GlobeRenderer,
  GlobeRendererSetup,
} from './globeRenderer.types';

import { createHitTargets, drawGlobe, findHitGroup, groupDotsByCountry } from './drawGlobe';
import { mixGlobeInk, toGlobeInk } from './globeColors';
import {
  DEG_TO_RAD,
  FULL_TURN_RAD,
  SELECTION_SPRING,
  SPIN_EXTRA_TURNS,
  SPIN_SPRING,
  applyInertiaFriction,
  projectOrthographic,
  shortestLngDelta,
  stepSpring,
  tiltForLatitude,
  toSphereTrig,
} from './globeMath';

const MAX_DEVICE_PIXEL_RATIO = 2;
const GLOBE_RADIUS_FILL = 0.92;
const MAX_FRAME_DT_S = 1 / 30;
const COLOR_TRANSITION_MS = 200;
const TAP_THRESHOLD_PX = 6;
const DRAG_VELOCITY_SMOOTHING = 0.6;
const RELEASE_STILL_MS = 90;
const RING_VISIBLE_MIN_COSC = 0.08;

const clampProgress = (progress: number) => Math.max(0, Math.min(1, progress));

export const createGlobeRenderer = ({
  container,
  canvas,
  ctx,
  ring,
  countries,
  readProps,
}: GlobeRendererSetup): GlobeRenderer => {
  const dotGroups = groupDotsByCountry(countries);
  const accentColors = countries.map(({ accentColor }) => accentColor);
  const hitTargets = createHitTargets(dotGroups);
  const motion: GlobeMotion = {
    mode: 'rest',
    lng: 0,
    lat: 0,
    lngVelocity: 0,
    latVelocity: 0,
    targetLng: 0,
    targetLat: 0,
  };
  let viewport: GlobeViewport | null = null;
  let colorTransition: GlobeColorTransition | null = null;
  let drag: GlobeDrag | null = null;
  let hasAimed = false;
  let lastSpinId: number | null = null;
  let pointedIsoCode: string | null = null;
  let frameId: number | null = null;
  let lastFrameAt = 0;

  const findCountry = (isoCode: string) => countries.find((country) => country.isoCode === isoCode);

  const shownInk = (now: number): GlobeInk | null => {
    if (!colorTransition) return null;
    const { from, to, startedAt } = colorTransition;
    if (startedAt === null) return to;
    return mixGlobeInk(from, to, clampProgress((now - startedAt) / COLOR_TRANSITION_MS));
  };

  const stepColors = (now: number): boolean => {
    if (!colorTransition || colorTransition.startedAt === null) return false;
    if (now - colorTransition.startedAt < COLOR_TRANSITION_MS) return true;
    colorTransition = { from: colorTransition.to, to: colorTransition.to, startedAt: null };
    return false;
  };

  const finishMotion = () => {
    const wasSpinning = motion.mode === 'spin';
    motion.mode = 'rest';
    if (wasSpinning) readProps().onSpinSettled();
  };

  const stepMotion = (dt: number): boolean => {
    switch (motion.mode) {
      case 'spring':
      case 'spin': {
        const spring = motion.mode === 'spin' ? SPIN_SPRING : SELECTION_SPRING;
        const lngStep = stepSpring(
          { position: motion.lng, velocity: motion.lngVelocity },
          motion.targetLng,
          spring,
          dt,
        );
        const latStep = stepSpring(
          { position: motion.lat, velocity: motion.latVelocity },
          motion.targetLat,
          spring,
          dt,
        );
        motion.lng = lngStep.position;
        motion.lngVelocity = lngStep.velocity;
        motion.lat = latStep.position;
        motion.latVelocity = latStep.velocity;
        if (!lngStep.isSettled || !latStep.isSettled) return true;
        finishMotion();
        return false;
      }
      case 'inertia':
        motion.lngVelocity = applyInertiaFriction(motion.lngVelocity, dt);
        motion.lng += motion.lngVelocity * dt;
        if (motion.lngVelocity !== 0) return true;
        motion.mode = 'rest';
        return false;
      case 'drag':
      case 'rest':
        return false;
      default: {
        const unreachable: never = motion.mode;
        return unreachable;
      }
    }
  };

  const placeRing = (view: SphereTrig) => {
    const country = findCountry(readProps().selectedIsoCode);
    if (!country || !viewport) {
      ring.style.visibility = 'hidden';
      return;
    }
    const centre = toSphereTrig(country.center.lat * DEG_TO_RAD, country.center.lng * DEG_TO_RAD);
    const projected = projectOrthographic(centre, view);
    const x = viewport.centerX + projected.x * viewport.radius;
    const y = viewport.centerY - projected.y * viewport.radius;
    ring.style.transform = `translate(${x}px, ${y}px)`;
    ring.style.visibility = projected.cosc > RING_VISIBLE_MIN_COSC ? 'visible' : 'hidden';
  };

  const drawFrame = (now: number) => {
    const ink = shownInk(now);
    if (!viewport || !ink) return;
    const view = toSphereTrig(motion.lat, motion.lng);
    const selectedIsoCode = readProps().selectedIsoCode;
    drawGlobe({
      ctx,
      viewport,
      view,
      ink,
      dotGroups,
      accentColors,
      selectedGroup: countries.findIndex(({ isoCode }) => isoCode === selectedIsoCode) + 1,
      hitTargets,
    });
    placeRing(view);
  };

  const tick = (now: number) => {
    frameId = null;
    const dt = Math.min(MAX_FRAME_DT_S, Math.max(0, (now - lastFrameAt) / 1000));
    lastFrameAt = now;
    const isMoving = stepMotion(dt);
    const isFading = stepColors(now);
    drawFrame(now);
    if ((isMoving || isFading) && frameId === null) frameId = requestAnimationFrame(tick);
  };

  const requestFrame = () => {
    if (frameId !== null) return;
    lastFrameAt = performance.now();
    frameId = requestAnimationFrame(tick);
  };

  const aimAt = (country: GlobeCountry) => {
    motion.targetLng = motion.lng + shortestLngDelta(motion.lng, country.center.lng * DEG_TO_RAD);
    motion.targetLat = tiltForLatitude(country.center.lat * DEG_TO_RAD);
  };

  const jumpToTarget = () => {
    motion.mode = 'rest';
    motion.lng = motion.targetLng;
    motion.lat = motion.targetLat;
    motion.lngVelocity = 0;
    motion.latVelocity = 0;
  };

  const select = (isoCode: string) => {
    const country = findCountry(isoCode);
    if (!country || motion.mode === 'spin') return;
    aimAt(country);
    if (!hasAimed || readProps().reduceMotion) jumpToTarget();
    else if (motion.mode !== 'drag') motion.mode = 'spring';
    hasAimed = true;
    requestFrame();
  };

  const spin = ({ id, isoCode }: GlobeSpinRequest) => {
    const country = findCountry(isoCode);
    if (!country || id === lastSpinId) return;
    lastSpinId = id;
    drag = null;
    aimAt(country);
    const direction = Math.sign(motion.targetLng - motion.lng) || 1;
    motion.targetLng += direction * SPIN_EXTRA_TURNS * FULL_TURN_RAD;
    requestFrame();
    if (!readProps().reduceMotion) {
      motion.mode = 'spin';
      return;
    }
    jumpToTarget();
    readProps().onSpinSettled();
  };

  const setColors = (colors: GlobeColors) => {
    const now = performance.now();
    const target = toGlobeInk(colors);
    const shown = shownInk(now);
    colorTransition = shown
      ? { from: shown, to: target, startedAt: now }
      : { from: target, to: target, startedAt: null };
    requestFrame();
  };

  const resize = (width: number, height: number) => {
    const dpr = Math.min(MAX_DEVICE_PIXEL_RATIO, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    viewport = {
      width,
      height,
      dpr,
      radius: (Math.min(width, height) / 2) * GLOBE_RADIUS_FILL,
      centerX: width / 2,
      centerY: height / 2,
    };
    drawFrame(performance.now());
  };

  const countryUnderPointer = (event: PointerEvent): GlobeCountry | undefined => {
    const bounds = canvas.getBoundingClientRect();
    const group = findHitGroup(hitTargets, event.clientX - bounds.left, event.clientY - bounds.top);
    return countries[group - 1];
  };

  const reportPointedCountry = (isoCode: string | null) => {
    canvas.style.cursor = isoCode ? 'pointer' : '';
    if (isoCode === pointedIsoCode) return;
    pointedIsoCode = isoCode;
    readProps().onPointCountry(isoCode);
  };

  const dragTo = (event: PointerEvent, activeDrag: GlobeDrag) => {
    const totalX = event.clientX - activeDrag.startX;
    const totalY = event.clientY - activeDrag.startY;
    activeDrag.hasLeftTapRange ||= Math.hypot(totalX, totalY) > TAP_THRESHOLD_PX;
    if (!activeDrag.isDragging && Math.abs(totalX) > TAP_THRESHOLD_PX) {
      activeDrag.isDragging = true;
      motion.mode = 'drag';
      motion.lngVelocity = 0;
      motion.latVelocity = 0;
    }
    if (!activeDrag.isDragging || !viewport) return;

    const deltaLng = -(event.clientX - activeDrag.lastX) / viewport.radius;
    const elapsedS = (event.timeStamp - activeDrag.lastMoveAt) / 1000;
    motion.lng += deltaLng;
    if (elapsedS > 0) {
      activeDrag.velocity += (deltaLng / elapsedS - activeDrag.velocity) * DRAG_VELOCITY_SMOOTHING;
    }
    activeDrag.lastX = event.clientX;
    activeDrag.lastMoveAt = event.timeStamp;
    requestFrame();
  };

  const releaseDrag = (event: PointerEvent, releasedDrag: GlobeDrag) => {
    const isStill = event.timeStamp - releasedDrag.lastMoveAt > RELEASE_STILL_MS;
    motion.lngVelocity = isStill || readProps().reduceMotion ? 0 : releasedDrag.velocity;
    motion.mode = motion.lngVelocity === 0 ? 'rest' : 'inertia';
    requestFrame();
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (drag || motion.mode === 'spin' || !event.isPrimary || event.button !== 0) return;
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastMoveAt: event.timeStamp,
      velocity: 0,
      hasLeftTapRange: false,
      isDragging: false,
    };
    canvas.setPointerCapture(event.pointerId);
    if (motion.mode === 'inertia') {
      motion.mode = 'rest';
      motion.lngVelocity = 0;
    }
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (drag) {
      if (drag.pointerId === event.pointerId) dragTo(event, drag);
      return;
    }
    if (event.pointerType === 'mouse') {
      reportPointedCountry(countryUnderPointer(event)?.isoCode ?? null);
    }
  };

  const handlePointerUp = (event: PointerEvent) => {
    const releasedDrag = drag;
    if (!releasedDrag || releasedDrag.pointerId !== event.pointerId) return;
    drag = null;
    if (releasedDrag.isDragging) {
      releaseDrag(event, releasedDrag);
      return;
    }
    if (releasedDrag.hasLeftTapRange) return;
    const country = countryUnderPointer(event);
    if (!country) return;
    const { selectedIsoCode, onPointCountry, onEnterCountry } = readProps();
    const isPreviewTap = event.pointerType !== 'mouse' && country.isoCode !== selectedIsoCode;
    if (isPreviewTap) onPointCountry(country.isoCode);
    else onEnterCountry(country.isoCode);
  };

  const handlePointerCancel = (event: PointerEvent) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    drag = null;
    if (motion.mode === 'drag') motion.mode = 'rest';
  };

  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && !drag) reportPointedCountry(null);
  };

  const resizeObserver = new ResizeObserver(([entry]) => {
    resize(entry.contentRect.width, entry.contentRect.height);
  });
  resizeObserver.observe(container);
  canvas.addEventListener('pointerdown', handlePointerDown);
  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.addEventListener('pointercancel', handlePointerCancel);
  canvas.addEventListener('pointerleave', handlePointerLeave);

  const destroy = () => {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    resizeObserver.disconnect();
    canvas.removeEventListener('pointerdown', handlePointerDown);
    canvas.removeEventListener('pointermove', handlePointerMove);
    canvas.removeEventListener('pointerup', handlePointerUp);
    canvas.removeEventListener('pointercancel', handlePointerCancel);
    canvas.removeEventListener('pointerleave', handlePointerLeave);
  };

  return { select, spin, setColors, destroy };
};
