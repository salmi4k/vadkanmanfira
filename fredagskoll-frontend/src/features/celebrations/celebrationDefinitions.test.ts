import {
  getCelebrationDefinition,
  getCelebrationDefinitions,
  getFettisdagDate,
  isMatchingCelebrationDate,
} from './celebrationDefinitions';

test('includes a reusable fixed-date definition for Nationaldagen', () => {
  const definition = getCelebrationDefinition('nationaldagen');

  expect(definition).toMatchObject({
    dayType: 'nationaldagen',
    dateType: 'fixed',
    category: 'official',
    monthIndex: 5,
    dayOfMonth: 6,
  });
});

test('calculates Fettisdag through the shared easter-relative rule helpers', () => {
  expect(getFettisdagDate(2026)).toEqual(new Date(2026, 1, 17));
});

test('matches Midsommarafton through the shared weekday window rule', () => {
  const definition = getCelebrationDefinition('midsommarafton');

  expect(definition).not.toBeNull();
  expect(isMatchingCelebrationDate(definition!, new Date(2026, 5, 19))).toBe(true);
  expect(isMatchingCelebrationDate(definition!, new Date(2026, 5, 18))).toBe(false);
});

test('team weekday definitions are excluded from the public pack', () => {
  const publicDefinitions = getCelebrationDefinitions('public');
  const teamDefinitions = getCelebrationDefinitions('team');

  expect(publicDefinitions.some((definition) => definition.dayType === 'fisktorsdag')).toBe(false);
  expect(teamDefinitions.some((definition) => definition.dayType === 'fisktorsdag')).toBe(true);
});
