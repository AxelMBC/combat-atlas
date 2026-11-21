import type { MouseEvent } from 'react';

export type ClickModifiers = Pick<
  MouseEvent,
  'button' | 'ctrlKey' | 'metaKey' | 'shiftKey' | 'altKey'
>;
