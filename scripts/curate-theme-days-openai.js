const fs = require('fs');
const path = require('path');

const API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.resolve(ROOT, 'fredagskoll-frontend', 'src', 'data', 'temadagarByDate.json');
const OUTPUT_PATH = path.resolve(ROOT, 'docs', 'theme-day-priority-suggestions.json');

function parseArgs(argv) {
  const args = {
    limit: null,
    minCount: 2,
    dates: null,
    model: DEFAULT_MODEL,
    output: OUTPUT_PATH,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === '--limit' && next) {
      args.limit = Number(next);
      index += 1;
      continue;
    }

    if (arg === '--min-count' && next) {
      args.minCount = Number(next);
      index += 1;
      continue;
    }

    if (arg === '--dates' && next) {
      args.dates = next.split(',').map((value) => value.trim()).filter(Boolean);
      index += 1;
      continue;
    }

    if (arg === '--model' && next) {
      args.model = next.trim();
      index += 1;
      continue;
    }

    if (arg === '--output' && next) {
      args.output = path.resolve(ROOT, next);
      index += 1;
    }
  }

  return args;
}

function loadThemeDays() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function getCrowdedDates(data, options) {
  const entries = Object.entries(data)
    .filter(([, days]) => Array.isArray(days) && days.length >= options.minCount)
    .sort((left, right) => right[1].length - left[1].length || left[0].localeCompare(right[0]));

  const filtered = options.dates
    ? entries.filter(([date]) => options.dates.includes(date))
    : entries;

  return options.limit ? filtered.slice(0, options.limit) : filtered;
}

function buildMessages(dateKey, themeDays) {
  return [
    {
      role: 'system',
      content:
        'You are helping curate Swedish theme-day priorities for a public-facing calendar app. Return JSON only. Prefer the theme day that feels most meaningful, recognizable, socially useful, seasonally relevant, or genuinely fun to lead with for a general Swedish audience. Avoid choosing a niche corporate, hyper-technical, or low-signal observance unless it is clearly the strongest option available.',
    },
    {
      role: 'user',
      content: [
        `Date: ${dateKey}`,
        'Candidate theme days:',
        ...themeDays.map((themeDay, index) => `${index + 1}. ${themeDay}`),
        '',
        'Pick the best primary theme day for the app to lead with.',
        'Then give 1-2 backups and short scoring notes.',
        'Prefer stable editorial judgment over random novelty.',
      ].join('\n'),
    },
  ];
}

function buildResponseFormat() {
  return {
    type: 'json_schema',
    json_schema: {
      name: 'theme_day_priority_suggestion',
      strict: true,
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          primaryThemeDay: { type: 'string' },
          backupThemeDays: {
            type: 'array',
            items: { type: 'string' },
          },
          reasoning: { type: 'string' },
          scores: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                themeDay: { type: 'string' },
                audienceAppeal: { type: 'integer' },
                culturalRelevance: { type: 'integer' },
                socialValue: { type: 'integer' },
                novelty: { type: 'integer' },
                notes: { type: 'string' },
              },
              required: [
                'themeDay',
                'audienceAppeal',
                'culturalRelevance',
                'socialValue',
                'novelty',
                'notes',
              ],
            },
          },
        },
        required: ['primaryThemeDay', 'backupThemeDays', 'reasoning', 'scores'],
      },
    },
  };
}

async function fetchSuggestion(apiKey, model, dateKey, themeDays) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: buildMessages(dateKey, themeDays),
      response_format: buildResponseFormat(),
    }),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`OpenAI request failed for ${dateKey}: ${response.status} ${body}`);
  }

  const parsed = JSON.parse(body);
  const content = parsed.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(`OpenAI returned no content for ${dateKey}.`);
  }

  return JSON.parse(content);
}

function ensureDirectoryFor(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required.');
  }

  const options = parseArgs(process.argv.slice(2));
  const data = loadThemeDays();
  const crowdedDates = getCrowdedDates(data, options);

  const suggestions = [];

  for (const [dateKey, themeDays] of crowdedDates) {
    console.log(`Reviewing ${dateKey} (${themeDays.length})`);
    const suggestion = await fetchSuggestion(apiKey, options.model, dateKey, themeDays);
    suggestions.push({
      date: dateKey,
      candidateCount: themeDays.length,
      themeDays,
      suggestion,
    });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    model: options.model,
    itemCount: suggestions.length,
    suggestions,
  };

  ensureDirectoryFor(options.output);
  fs.writeFileSync(options.output, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Wrote suggestions to ${options.output}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
