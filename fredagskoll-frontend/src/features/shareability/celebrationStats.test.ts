import { buildCelebrationStats } from './celebrationStats';

test('builds yearly celebration stats for the public pack', () => {
  const stats = buildCelebrationStats(2026, 'public', 'sv');

  expect(stats.totalCelebrationDays).toBeGreaterThan(10);
  expect(stats.busiestMonthLabel.length).toBeGreaterThan(0);
  expect(stats.topCategoryLabel.length).toBeGreaterThan(0);
  expect(stats.topDates.length).toBe(5);
});

test('team stats include the internal weekday category', () => {
  const stats = buildCelebrationStats(2026, 'team', 'sv');

  expect(stats.totalCelebrationDays).toBeGreaterThan(buildCelebrationStats(2026, 'public', 'sv').totalCelebrationDays);
  expect(stats.topCategoryLabel.length).toBeGreaterThan(0);
});
