import { getCelebrations } from './celebrations';

test('high-priority Swedish celebrations have image coverage', () => {
  const celebrations = getCelebrations('sv', 'public', 'dry');

  expect(celebrations.fettisdag.primaryImage).toBeTruthy();
  expect(celebrations.valborg.primaryImage).toBeTruthy();
  expect(celebrations.nationaldagen.primaryImage).toBeTruthy();
  expect(celebrations.midsommarafton.primaryImage).toBeTruthy();
  expect(celebrations.julafton.primaryImage).toBeTruthy();
  expect(celebrations.nyarsafton.primaryImage).toBeTruthy();
});

test('priority Swedish celebrations use more specific local fallback copy', () => {
  const celebrations = getCelebrations('sv', 'public', 'dry');

  expect(celebrations.fettisdag.title).toMatch(/Nationen hålls ihop av grädde/i);
  expect(celebrations.valborg.blurbs.some((blurb) => blurb.includes('brasa'))).toBe(true);
  expect(celebrations.nationaldagen.blurbs.some((blurb) => blurb.includes('flagga'))).toBe(true);
  expect(celebrations.midsommarafton.blurbs.some((blurb) => blurb.includes('jordgubbar'))).toBe(true);
  expect(celebrations.julafton.blurbs.some((blurb) => blurb.includes('glögg'))).toBe(true);
  expect(celebrations.nyarsafton.blurbs.some((blurb) => blurb.includes('bubbel'))).toBe(true);
});
