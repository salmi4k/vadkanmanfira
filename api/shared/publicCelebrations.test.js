const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildCelebrationLinks,
  loadPublicCelebrationsDataset,
  getCelebrationDateEntry,
  getUpcomingCelebrationEntries,
  localizeEntry,
  buildChatText,
} = require('./publicCelebrations');

test('loads both generated datasets', () => {
  const swedish = loadPublicCelebrationsDataset('sv-SE');
  const american = loadPublicCelebrationsDataset('en-US');

  assert.equal(swedish.id, 'sv-SE');
  assert.equal(american.id, 'en-US');
});

test('returns a celebration entry for valborg', () => {
  const entry = getCelebrationDateEntry('2026-04-30');

  assert.ok(entry);
  assert.equal(entry.date, '2026-04-30');
  assert.ok(entry.celebrations.some((celebration) => celebration.dayType === 'valborg'));
});

test('localizes celebration entries', () => {
  const entry = getCelebrationDateEntry('2026-12-24');
  const localized = localizeEntry(entry, 'en');

  assert.ok(localized);
  assert.match(localized.celebrations[0].copy.title, /Christmas Eve/i);
  assert.equal(typeof localized.celebrations[0].scoreLabel, 'string');
});

test('returns upcoming celebration entries from a date', () => {
  const entries = getUpcomingCelebrationEntries('2026-12-20', 3);

  assert.equal(entries.length, 3);
  assert.equal(entries[0].date, '2026-12-24');
});

test('builds chat text from a celebration entry', () => {
  const entry = getCelebrationDateEntry('2026-06-06');
  const text = buildChatText(entry, 'sv');

  assert.match(text, /Nationaldagen/);
  assert.match(text, /energi|Temadagar/);
});

test('builds links for celebratory integrations', () => {
  const entry = getCelebrationDateEntry('2026-04-30');
  const links = buildCelebrationLinks(entry);

  assert.match(links.appUrl, /\?date=2026-04-30/);
  assert.match(links.shareUrl, /share\/valborg/i);
  assert.match(links.shareCardUrl, /share\/cards\/valborg\.svg/i);
});

test('returns expansion dataset entries for en-US', () => {
  const entry = getCelebrationDateEntry('2026-11-26', 'en-US');

  assert.ok(entry);
  assert.match(entry.celebrations[0].copy.en.title, /Thanksgiving/i);
});
