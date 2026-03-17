const test = require('node:test');
const assert = require('node:assert/strict');

const handler = require('./index');

test('returns slack-style response payload', async () => {
  const context = {
    res: null,
  };

  await handler(context, {
    query: {
      platform: 'slack',
      locale: 'sv',
      date: '2026-04-30',
    },
    body: null,
  });

  assert.equal(context.res.status, 200);
  const payload = JSON.parse(context.res.body);
  assert.equal(payload.response_type, 'in_channel');
  assert.match(payload.text, /Valborg/);
});

test('returns expansion dataset text for discord shape', async () => {
  const context = {
    res: null,
  };

  await handler(context, {
    query: {
      platform: 'discord',
      locale: 'en',
      dataset: 'en-US',
      date: '2026-11-26',
    },
    body: null,
  });

  assert.equal(context.res.status, 200);
  const payload = JSON.parse(context.res.body);
  assert.equal(payload.dataset, 'en-US');
  assert.match(payload.content, /Thanksgiving/i);
});
