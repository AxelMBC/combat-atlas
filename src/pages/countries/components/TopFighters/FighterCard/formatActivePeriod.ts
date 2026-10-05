import type { ActivePeriodLabels } from './formatActivePeriod.types';

export const formatActivePeriod = (
  period: string | undefined,
  labels: ActivePeriodLabels,
): string => {
  if (!period) return labels.notAvailable;
  const trimmed = period.trim();
  if (trimmed.endsWith('-')) {
    const start = trimmed.slice(0, -1).trim();
    return `${labels.activeSince} ${start}`;
  }
  return period;
};
