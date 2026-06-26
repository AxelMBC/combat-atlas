export interface UseScrollFocusOptions {
  rootMargin?: string;
}

export interface UseScrollFocusResult<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T | null>;
  isFocused: boolean;
}
