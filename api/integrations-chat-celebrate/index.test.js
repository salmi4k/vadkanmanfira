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

test('returns slack blocks payload with links', async () => {
  const context = {
    res: null,
  };

  await handler(context, {
    query: {
      platform: 'slack-blocks',
      locale: 'sv',
      date: '2026-04-30',
    },
    body: null,
  });

  assert.equal(context.res.status, 200);
  const payload = JSON.parse(context.res.body);
  assert.equal(payload.response_type, 'in_channel');
  assert.ok(Array.isArray(payload.blocks));
  assert.match(JSON.stringify(payload.blocks), /share\/cards\/valborg\.svg/i);
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

test('returns teams adaptive card payload', async () => {
  const context = {
    res: null,
  };

  await handler(context, {
    query: {
      platform: 'teams',
      locale: 'en',
      dataset: 'en-US',
      date: '2026-11-26',
    },
    body: null,
  });

  assert.equal(context.res.status, 200);
  const payload = JSON.parse(context.res.body);
  assert.equal(payload.type, 'message');
  assert.equal(payload.dataset, 'en-US');
  assert.equal(payload.attachments[0].content.type, 'AdaptiveCard');
  assert.ok(payload.digest);
});

test('returns digest payload for scheduled automation', async () => {
  const context = {
    res: null,
  };

  await handler(context, {
    query: {
      platform: 'digest',
      locale: 'sv',
      date: '2026-04-30',
    },
    body: null,
  });

  assert.equal(context.res.status, 200);
  const payload = JSON.parse(context.res.body);
  assert.equal(payload.dataset, 'sv-SE');
  assert.equal(payload.digest.date, '2026-04-30');
  assert.match(payload.digest.headline, /Valborg/);
  assert.ok(payload.digest.nextNotable);
});

test('returns json-card alias for machine-facing consumers', async () => {
  const context = {
    res: null,
  };

  await handler(context, {
    query: {
      platform: 'json-card',
      locale: 'sv',
      date: '2026-04-30',
    },
    body: null,
  });

  assert.equal(context.res.status, 200);
  const payload = JSON.parse(context.res.body);
  assert.equal(payload.digest.datasetId, 'sv-SE');
  assert.equal(payload.digest.locale, 'sv');
});
