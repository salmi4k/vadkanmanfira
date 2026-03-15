import { buildThemeDayBlurbs } from './themeDayBlurbs';

test('builds non-generic blurbs for non-overridden themedays', () => {
  const blurbs = buildThemeDayBlurbs(['Internationella vattendagen']);

  expect(blurbs).not.toContain(
    'Det här datumet är inte tomt. Det tillhör Internationella vattendagen, och det vore småaktigt att ignorera det.'
  );
  expect(
    blurbs.some((blurb) =>
      blurb.includes(
        'Internationella vattendagen gör det svårare än vanligt att låtsas att kontorsljus är hela verkligheten.'
      )
    )
  ).toBe(true);
});

test('does not generate plural self-reference blurbs for a single themeday', () => {
  const blurbs = buildThemeDayBlurbs(['Såpbubblans dag']);

  expect(
    blurbs.some(
      (blurb) =>
        blurb.includes('samsas på samma datum') ||
        blurb.includes('delar datumet') ||
        blurb.includes('trängs på samma datum')
    )
  ).toBe(false);
});
