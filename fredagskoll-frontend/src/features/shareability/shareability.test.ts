import {
  buildShareableCelebration,
  findUpcomingCelebrationDate,
  getShareUrl,
  resolveInitialDateFromUrl,
} from './shareability';

test('finds the next upcoming fixed-date celebration', () => {
  const nextNationaldagen = findUpcomingCelebrationDate(
    'nationaldagen',
    new Date('2026-01-10T12:00:00')
  );

  expect(nextNationaldagen).not.toBeNull();
  expect(nextNationaldagen?.toISOString().slice(0, 10)).toBe('2026-06-06');
});

test('resolves a share slug into a date for the app', () => {
  const resolved = resolveInitialDateFromUrl(
    '?share=valborg',
    'public',
    new Date('2026-01-10T12:00:00')
  );

  expect(resolved).not.toBeNull();
  expect(resolved?.toISOString().slice(0, 10)).toBe('2026-04-30');
});

test('resolves a surprise shortcut into a high-signal date', () => {
  const resolved = resolveInitialDateFromUrl(
    '?surprise=1',
    'public',
    new Date('2026-01-10T12:00:00')
  );

  expect(resolved).not.toBeNull();
  expect(resolved?.toISOString().slice(0, 4)).toBe('2026');
});

test('does not resolve team-only share slugs on the public pack', () => {
  const resolved = resolveInitialDateFromUrl(
    '?share=fisktorsdag',
    'public',
    new Date('2026-01-10T12:00:00')
  );

  expect(resolved).toBeNull();
});

test('builds a shareable celebration with a stable share url', () => {
  const shareable = buildShareableCelebration({
    celebration: {
      title: 'Valborg.',
      kicker: 'Eld mot april',
      blurbs: ['Nu räcker april och alla går ut ändå.'],
      theme: 'ember',
    },
    date: new Date('2026-04-30T12:00:00'),
    locale: 'sv',
    dayType: 'valborg',
    categoryLabel: 'Säsong',
    scoreLabel: 'Firarpoäng 88/100',
  });

  expect(shareable.shareUrl).toBe(getShareUrl('valborg'));
  expect(shareable.shareText).toMatch(/Nu räcker april/i);
});
