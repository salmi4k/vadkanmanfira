import {
  getCategoryLabel,
  getDailyFikaSuggestion,
  pickSurpriseDate,
  scoreEngagementSnapshot,
} from './engagement';

test('scores a major celebration date higher than an ordinary date', () => {
  const nationaldagen = scoreEngagementSnapshot(new Date('2026-06-06T12:00:00'), 'public');
  const ordinaryDay = scoreEngagementSnapshot(new Date('2026-02-18T12:00:00'), 'public');

  expect(nationaldagen.dayType).toBe('nationaldagen');
  expect(nationaldagen.score).toBeGreaterThan(ordinaryDay.score);
});

test('picks a celebration-worthy surprise date from the current year pool', () => {
  const surprise = pickSurpriseDate(new Date('2026-01-10T12:00:00'), 'public', 0.1);

  expect(surprise.score).toBeGreaterThanOrEqual(45);
  expect(surprise.dayType === 'ordinary' ? surprise.themeDays.length > 0 : true).toBe(true);
});

test('builds fika suggestions from specific celebrations when possible', () => {
  const fika = getDailyFikaSuggestion({
    celebration: 'fettisdag',
    category: 'food',
    themeDays: [],
    locale: 'sv',
    mood: 'dry',
    score: 95,
  });

  expect(fika.item).toMatch(/semla/i);
  expect(fika.score).toBeGreaterThanOrEqual(9);
});

test('translates category labels', () => {
  expect(getCategoryLabel('official', 'sv')).toBe('Officiell');
  expect(getCategoryLabel('food', 'en')).toBe('Food');
  expect(getCategoryLabel('team', 'pt-BR')).toBe('Equipe');
});
