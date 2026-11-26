const pluralRules = new Intl.PluralRules('en');

const clockFormat = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms)) {
    return '—';
  }

  const seconds = Math.max(0, Math.floor(ms / 1_000));

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return seconds % 60 === 0 ? `${minutes}m` : `${minutes}m ${seconds % 60}s`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return minutes % 60 === 0 ? `${hours}h` : `${hours}h ${minutes % 60}m`;
  }

  const days = Math.floor(hours / 24);

  return hours % 24 === 0 ? `${days}d` : `${days}d ${hours % 24}h`;
}

export function formatAge(ms: number): string {
  if (!Number.isFinite(ms)) {
    return '—';
  }

  if (ms < 2_000) {
    return 'now';
  }

  return `${formatDuration(ms)} ago`;
}

export function formatClock(timestamp: number): string {
  return clockFormat.format(timestamp);
}

export function countLabel(count: number, singular: string, plural = `${singular}s`): string {
  return `${count.toLocaleString()} ${pluralRules.select(count) === 'one' ? singular : plural}`;
}
