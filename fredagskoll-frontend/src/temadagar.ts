import temadagarByDate from './data/temadagarByDate.json';

const themeDaysByDate = temadagarByDate as Record<string, string[]>;

function formatMonthDay(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${month}-${day}`;
}

export function getThemeDaysForDate(date: Date): string[] {
  return themeDaysByDate[formatMonthDay(date)] ?? [];
}
