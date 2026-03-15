import { getThemeDaysForDate } from './temadagar';

test('prioritizes Rocka sockorna before the other March 21 theme days', () => {
  const themeDays = getThemeDaysForDate(new Date(2026, 2, 21));

  expect(themeDays[0]).toBe('Rocka sockorna-dagen');
  expect(themeDays).toContain('Internationella dagen för Nowruz');
  expect(themeDays).toContain('Internationella Downs syndrom-dagen');
});

test('prioritizes seasonal anchors before novelty fillers when many theme days share a date', () => {
  const themeDays = getThemeDaysForDate(new Date(2026, 2, 20));

  expect(themeDays[0]).toBe('Vårdagjämningen');
  expect(themeDays.indexOf('Vårdagjämningen')).toBeLessThan(themeDays.indexOf('World Salad Day'));
});

test('prioritizes culturally recognizable days over niche ones when the date is crowded', () => {
  const themeDays = getThemeDaysForDate(new Date(2026, 4, 4));

  expect(themeDays[0]).toBe('Star wars-dagen');
  expect(themeDays.indexOf('Star wars-dagen')).toBeLessThan(themeDays.indexOf('Fothälsodagen'));
});
