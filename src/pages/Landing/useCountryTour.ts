import type { FocusEvent, PointerEvent } from 'react';
import type { CountryTourHandlers, CountryTourOptions } from './useCountryTour.types';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const TOUR_STEP_MS = 4500;

const isDocumentHidden = () => document.visibilityState === 'hidden';

const isTap = ({ pointerType }: PointerEvent<HTMLElement>) => pointerType !== 'mouse';

const isFocusLeaving = ({ currentTarget, relatedTarget }: FocusEvent<HTMLElement>) =>
  !(relatedTarget instanceof Node && currentTarget.contains(relatedTarget));

export const useCountryTour = ({
  isEnabled,
  selectedSlug,
  onAdvance,
}: CountryTourOptions): CountryTourHandlers => {
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isFocusInside, setIsFocusInside] = useState(false);
  const [isHidden, setIsHidden] = useState(isDocumentHidden);
  const [isStoppedByTap, setIsStoppedByTap] = useState(false);
  const onAdvanceRef = useRef(onAdvance);

  useLayoutEffect(() => {
    onAdvanceRef.current = onAdvance;
  });

  useEffect(() => {
    const handleVisibilityChange = () => setIsHidden(isDocumentHidden());
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const isRunning = isEnabled && !isPointerInside && !isFocusInside && !isHidden && !isStoppedByTap;

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setTimeout(() => onAdvanceRef.current(), TOUR_STEP_MS);
    return () => window.clearTimeout(timer);
  }, [isRunning, selectedSlug]);

  return {
    pointerZoneHandlers: {
      onPointerEnter: () => setIsPointerInside(true),
      onPointerDown: (event) => {
        setIsPointerInside(true);
        if (isTap(event)) setIsStoppedByTap(true);
      },
      onPointerLeave: () => setIsPointerInside(false),
    },
    focusHandlers: {
      onFocus: () => setIsFocusInside(true),
      onBlur: (event) => {
        if (isFocusLeaving(event)) setIsFocusInside(false);
      },
    },
  };
};
