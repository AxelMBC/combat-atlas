import { memo } from 'react';

import FighterCardFeature from './FighterCardFeature';
import FighterCardCompact from './FighterCardCompact';
import type { FighterCardProps } from './FighterCard.types';

const FighterCard = memo((props: FighterCardProps) =>
  props.variant === 'feature' ? (
    <FighterCardFeature {...props} />
  ) : (
    <FighterCardCompact {...props} />
  ),
);

export default FighterCard;
