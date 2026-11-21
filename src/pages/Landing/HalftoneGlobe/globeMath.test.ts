import { describe, expect, it } from 'vitest';

import {
  DEG_TO_RAD,
  SELECTION_SPRING,
  halftoneRadius,
  isOnVisibleHemisphere,
  projectOrthographic,
  shortestLngDelta,
  stepSpring,
  toSphereTrig,
} from './globeMath';

const FRAME_DT_S = 1 / 60;
const MAX_SETTLE_FRAMES = 600;
const MEXICO_LNG = -102.5 * DEG_TO_RAD;
const THAILAND_LNG = 101.0 * DEG_TO_RAD;

describe('globeMath', () => {
  it('projects the view centre onto the disc centre', () => {
    const view = toSphereTrig(23.6 * DEG_TO_RAD, MEXICO_LNG);

    const projected = projectOrthographic(view, view);

    expect(projected.x).toBeCloseTo(0);
    expect(projected.y).toBeCloseTo(0);
    expect(projected.cosc).toBeCloseTo(1);
    expect(isOnVisibleHemisphere(projected)).toBe(true);
  });

  it('hides the antipode of the view centre', () => {
    const view = toSphereTrig(23.6 * DEG_TO_RAD, MEXICO_LNG);
    const antipode = toSphereTrig(-23.6 * DEG_TO_RAD, MEXICO_LNG + Math.PI);

    expect(isOnVisibleHemisphere(projectOrthographic(antipode, view))).toBe(false);
  });

  it('turns westward across the Pacific from Mexico to Thailand', () => {
    const delta = shortestLngDelta(MEXICO_LNG, THAILAND_LNG);

    expect(delta).toBeLessThan(0);
    expect(Math.abs(delta)).toBeLessThan(Math.PI);
  });

  it('settles the spring on its target', () => {
    let axis = { position: 0, velocity: 0 };
    let frames = 0;
    let isSettled = false;

    while (!isSettled && frames < MAX_SETTLE_FRAMES) {
      ({ isSettled, ...axis } = stepSpring(axis, 2, SELECTION_SPRING, FRAME_DT_S));
      frames += 1;
    }

    expect(isSettled).toBe(true);
    expect(axis).toEqual({ position: 2, velocity: 0 });
  });

  it('grows the halftone dot with its shade', () => {
    expect(halftoneRadius(1, 8)).toBeGreaterThan(halftoneRadius(0.5, 8));
    expect(halftoneRadius(0.5, 8)).toBeGreaterThan(halftoneRadius(0, 8));
  });
});
