export function formatForInput(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatForHumans(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatShortSwedishDate(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function getSwedishOrdinalDay(day: number): string {
  const tens = day % 100;
  const ones = day % 10;

  if (tens !== 11 && (ones === 1 || ones === 2)) {
    return `${day}:a`;
  }

  return `${day}:e`;
}

export function formatCenterDate(date: Date): string {
  const weekday = new Intl.DateTimeFormat('sv-SE', {
    weekday: 'long',
  }).format(date);
  const month = new Intl.DateTimeFormat('sv-SE', {
    month: 'long',
  }).format(date);

  return `${weekday} ${getSwedishOrdinalDay(date.getDate())} ${month}`;
}

export function getDaysUntil(date: Date, target: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((target.getTime() - date.getTime()) / millisecondsPerDay);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
