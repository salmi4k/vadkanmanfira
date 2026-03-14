import { getUpcomingNotables } from './upcomingNotables';

test('prioritizes major celebrations and holidays over ordinary themedays', () => {
  const items = getUpcomingNotables(new Date(2026, 3, 27), 4, 10);

  expect(items).toHaveLength(4);
  expect(items[0]).toMatchObject({
    kind: 'celebration',
    title: 'Valborg',
    daysUntil: 3,
  });
  expect(items[1]).toMatchObject({
    kind: 'holiday',
    title: 'Första maj',
    daysUntil: 4,
  });
});

test('falls back to themedays when no larger celebration is near', () => {
  const items = getUpcomingNotables(new Date(2026, 2, 14), 2, 5);

  expect(items[0]).toMatchObject({
    kind: 'themeday',
    title: 'Internationella konsumentdagen',
    daysUntil: 1,
  });
});
