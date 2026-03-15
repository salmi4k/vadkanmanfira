import { getNationalDayPanel } from './nationalDays';

test('returns national-day data for dates that match the generated dataset', () => {
  const panel = getNationalDayPanel(new Date(2026, 2, 25));

  expect(panel).not.toBeNull();
  expect(panel?.items[0]).toMatchObject({
    nation: 'Grekland',
    significance: 'Självständighetsdagen',
  });
  expect(panel?.summary).toMatch(/Grekland/i);
});

test('returns null when the selected date has no mapped national day entries', () => {
  const panel = getNationalDayPanel(new Date(2026, 1, 2));

  expect(panel).toBeNull();
});

test('localizes significance labels in English mode', () => {
  const panel = getNationalDayPanel(new Date(2026, 2, 25), 'en');

  expect(panel).not.toBeNull();
  expect(panel?.items[0]).toMatchObject({
    nation: 'Greece',
    significance: 'Independence Day',
  });
});

test('localizes nation and significance labels in Brazilian Portuguese', () => {
  const panel = getNationalDayPanel(new Date(2026, 2, 17), 'pt-BR', 10);

  expect(panel).not.toBeNull();
  expect(panel?.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        nation: 'Irlanda',
        significance: 'Dia de São Patrício',
      }),
      expect.objectContaining({
        nation: 'Irlanda do Norte (Reino Unido)',
        significance: 'Dia de São Patrício',
      }),
    ])
  );
});
