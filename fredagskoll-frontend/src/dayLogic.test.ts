import {
  getDayStatus,
  getFettisdag,
  getOfficialHolidays,
  getUpcomingOfficialHolidayInWeek,
} from './dayLogic';

test('calculates Fettisdag for 2026 correctly', () => {
  expect(getFettisdag(2026)).toEqual(new Date(2026, 1, 17));
});

test('classifies Surströmmingspremiär ahead of ordinary Thursday logic', () => {
  const result = getDayStatus(new Date(2026, 7, 20));

  expect(result.dayType).toBe('surstrommingspremiar');
  expect(result.dateLabel).toBe('2026-08-20');
});

test('treats ordinary weekdays as ordinary in the public content pack', () => {
  const result = getDayStatus(new Date(2026, 2, 19), 'public');

  expect(result.dayType).toBe('ordinary');
});

test('restores recurring weekday lore in the team content pack', () => {
  const result = getDayStatus(new Date(2026, 2, 19), 'team');

  expect(result.dayType).toBe('fisktorsdag');
});

test('includes Långfredagen in the official holiday list', () => {
  const holidays = getOfficialHolidays(2026);
  const holiday = holidays.find((item) => item.name === 'Långfredagen');

  expect(holiday?.dateLabel).toBe('2026-04-03');
});

test('finds an upcoming holiday later in the same week', () => {
  const holiday = getUpcomingOfficialHolidayInWeek(new Date(2026, 3, 1));

  expect(holiday?.name).toBe('Långfredagen');
  expect(holiday?.dateLabel).toBe('2026-04-03');
});
