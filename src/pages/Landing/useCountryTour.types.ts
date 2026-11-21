import type { FocusEvent, PointerEvent } from 'react';

export interface CountryTourOptions {
  isEnabled: boolean;
  selectedSlug: string;
  onAdvance: () => void;
}

export interface CountryTourHandlers {
  pointerZoneHandlers: {
    onPointerEnter: () => void;
    onPointerDown: (event: PointerEvent<HTMLElement>) => void;
    onPointerLeave: () => void;
  };
  focusHandlers: {
    onFocus: () => void;
    onBlur: (event: FocusEvent<HTMLElement>) => void;
  };
}
