import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useHeroFullscreen } from './useHeroFullscreen';

const setFullscreenElement = (element: Element | null) => {
  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    get: () => element,
  });
};

describe('useHeroFullscreen', () => {
  afterEach(() => {
    setFullscreenElement(null);
    vi.restoreAllMocks();
  });

  it('requests fullscreen on the target element when not fullscreen', () => {
    const element = document.createElement('div');
    const requestFullscreen = vi.fn().mockResolvedValue(undefined);
    element.requestFullscreen = requestFullscreen;
    setFullscreenElement(null);

    const { result } = renderHook(() => useHeroFullscreen({ current: element }));

    act(() => result.current.toggleFullscreen());

    expect(requestFullscreen).toHaveBeenCalledTimes(1);
  });

  it('exits fullscreen when an element is already fullscreen', () => {
    const element = document.createElement('div');
    const exitFullscreen = vi.fn().mockResolvedValue(undefined);
    document.exitFullscreen = exitFullscreen;
    setFullscreenElement(element);

    const { result } = renderHook(() => useHeroFullscreen({ current: element }));

    act(() => result.current.toggleFullscreen());

    expect(exitFullscreen).toHaveBeenCalledTimes(1);
  });

  it('syncs state from fullscreenchange events, including Esc exits', () => {
    const element = document.createElement('div');
    const { result } = renderHook(() => useHeroFullscreen({ current: element }));

    expect(result.current.isFullscreen).toBe(false);

    act(() => {
      setFullscreenElement(element);
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    expect(result.current.isFullscreen).toBe(true);

    act(() => {
      setFullscreenElement(null);
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    expect(result.current.isFullscreen).toBe(false);
  });

  it('stays false when another element is fullscreen', () => {
    const element = document.createElement('div');
    const other = document.createElement('div');
    const { result } = renderHook(() => useHeroFullscreen({ current: element }));

    act(() => {
      setFullscreenElement(other);
      document.dispatchEvent(new Event('fullscreenchange'));
    });

    expect(result.current.isFullscreen).toBe(false);
  });

  it('does not throw when the fullscreen API is unavailable', () => {
    const element = document.createElement('div');
    setFullscreenElement(null);

    const { result } = renderHook(() => useHeroFullscreen({ current: element }));

    expect(() => {
      act(() => result.current.toggleFullscreen());
    }).not.toThrow();
  });

  it('does not throw when the target ref is empty', () => {
    const { result } = renderHook(() => useHeroFullscreen({ current: null }));

    expect(() => {
      act(() => result.current.toggleFullscreen());
    }).not.toThrow();
  });
});
