import { getSeasonalNotes } from './seasonalNotes';

test('shows bokrean during the late-february sale window', () => {
  const notes = getSeasonalNotes(new Date(2026, 1, 24));

  expect(notes).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: 'bokrean',
        title: 'Bokrean',
      }),
    ])
  );
});

test('shows kräftskivesäsong during late summer', () => {
  const notes = getSeasonalNotes(new Date(2026, 7, 20));

  expect(notes).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: 'kraftskiva',
        title: 'Kräftskivesäsong',
      }),
    ])
  );
});

test('does not show seasonal notes outside their windows', () => {
  const notes = getSeasonalNotes(new Date(2026, 5, 10));

  expect(notes).toHaveLength(0);
});
