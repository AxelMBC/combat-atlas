import type { CountdownNumberProps } from './CountdownNumber.types';

import { useEffect, useState } from 'react';

const SECOND_MS = 1000;
const LAST_SECOND = 1;

const CountdownNumber = ({ seconds }: CountdownNumberProps) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    let left = seconds;
    const interval = window.setInterval(() => {
      left = Math.max(left - 1, LAST_SECOND);
      setRemaining(left);
      if (left === LAST_SECOND) window.clearInterval(interval);
    }, SECOND_MS);
    return () => window.clearInterval(interval);
  }, [seconds]);

  return remaining;
};

export default CountdownNumber;
