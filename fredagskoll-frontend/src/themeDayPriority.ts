import curatedThemeDayPriorityByDate from './data/themeDayPriorityByDate.json';
import { normalizeLabel } from './themeDayTextUtils';

const curatedDateOverrides = curatedThemeDayPriorityByDate as Record<string, string[]>;

const exactDateOverrides: Record<string, string[]> = {
  '03-20': ['Vårdagjämningen', 'Internationella glädjedagen', 'Världsberättardagen'],
  '03-21': ['Rocka sockorna-dagen', 'Internationella Downs syndrom-dagen', 'Världspoesidagen'],
  '04-12': ['Internationella dagen för bemannade rymdfärder', 'Lakritsdagen'],
  '05-04': ['Star wars-dagen', 'Internationella brandmännens dag'],
  '06-21': ['Sommarsolståndet', 'Internationella yogadagen', 'Musikens dag'],
  '09-21': ['Internationella fredsdagen', 'Världstacksamhetsdagen', 'Scouternas fredsdag'],
  '10-04': ['Kanelbullens dag', 'Djurens dag', 'Internationella Tacodagen'],
  '11-14': ['Fars dag'],
  '12-10': ['Nobeldagen', 'Mänskliga rättigheternas dag'],
};

const strongPositiveKeywords = [
  'mänskliga rättigheter',
  'fred',
  'downs syndrom',
  'tillgänglighet',
  'demokrati',
  'mental hälsa',
  'psykiska hälsa',
  'teckenspråk',
  'modersmål',
  'pressfrihet',
  'världsmiljö',
  'miljö',
  'biologiskt mångfald',
  'hållbar',
  'barnarbete',
  'hemlös',
  'äldres',
  'äldre',
  'vetenskap',
  'kreativitet',
  'innovation',
  'jämställdhet',
  'familj',
  'ursprungsfolk',
  'samernas nationaldag',
  'nowruz',
];

const seasonalAnchorKeywords = [
  'vårdagjämningen',
  'höstdagjämningen',
  'sommarsolståndet',
  'valborgsmässoafton',
  'halloween',
  'nobeldagen',
  'fars dag',
  'mors dag',
  'alla hjärtans dag',
  'star wars-dagen',
  'kanelbullens dag',
  'rocka sockorna',
];

const mediumPositiveKeywords = [
  'världs',
  'internationella dagen för',
  'internationella ',
  'nationella ',
  'nationaldag',
  'poesi',
  'skog',
  'vatten',
  'hav',
  'havens',
  'yoga',
  'musik',
  'djur',
  'bibliotekarie',
  'bok',
  'språk',
  'museum',
  'cykel',
  'klarspråk',
];

const noveltyKeywords = [
  'taco',
  'bull',
  'lakrits',
  'glass',
  'pizza',
  'choklad',
  'våffel',
  'kaffe',
  'kebab',
  'salad',
  'salad day',
  'selfie',
  'batman',
  'lego',
];

const weakOrNicheKeywords = [
  'brandvarnar',
  'automower',
  'lönekonsult',
  'receptionist',
  'it-chef',
  'upphandlar',
  'syntolk',
  'moldagen',
  'dialersystem',
  'skolmjölk',
  'flaska',
  'korv',
  'parisar',
  'fothälsa',
  'vodka',
  'ostkaka',
  'linssoppa',
  'salad day',
  'world quality day',
  'software freedom day',
];

function normalizeKeywords(keywords: string[]): string[] {
  return keywords.map((keyword) => normalizeLabel(keyword));
}

const normalizedStrongPositiveKeywords = normalizeKeywords(strongPositiveKeywords);
const normalizedSeasonalAnchorKeywords = normalizeKeywords(seasonalAnchorKeywords);
const normalizedMediumPositiveKeywords = normalizeKeywords(mediumPositiveKeywords);
const normalizedNoveltyKeywords = normalizeKeywords(noveltyKeywords);
const normalizedWeakOrNicheKeywords = normalizeKeywords(weakOrNicheKeywords);

function scoreByKeywords(normalizedLabel: string, keywords: string[], weight: number): number {
  return keywords.some((keyword) => normalizedLabel.includes(keyword)) ? weight : 0;
}

function scoreThemeDay(dateKey: string, themeDay: string, index: number): number {
  const normalized = normalizeLabel(themeDay);
  let score = 100 - index;

  const overrides = exactDateOverrides[dateKey];
  if (overrides) {
    const exactIndex = overrides.findIndex((value) => normalizeLabel(value) === normalized);
    if (exactIndex >= 0) {
      score += 400 - exactIndex * 30;
    }
  }

  score += scoreByKeywords(normalized, normalizedStrongPositiveKeywords, 45);
  score += scoreByKeywords(normalized, normalizedSeasonalAnchorKeywords, 35);
  score += scoreByKeywords(normalized, normalizedMediumPositiveKeywords, 16);
  score += scoreByKeywords(normalized, normalizedNoveltyKeywords, 6);
  score -= scoreByKeywords(normalized, normalizedWeakOrNicheKeywords, 18);

  if (normalized.startsWith('internationella dagen for')) {
    score += 10;
  }

  if (normalized.includes('varlds') || normalized.includes('world')) {
    score += 8;
  }

  if (normalized.includes('dag') && normalized.includes('namnsdag')) {
    score -= 8;
  }

  return score;
}

export function prioritizeThemeDays(themeDays: string[], dateKey: string): string[] {
  const overrides = curatedDateOverrides[dateKey] ?? exactDateOverrides[dateKey] ?? [];
  const remaining = [...themeDays];
  const prioritized: string[] = [];

  for (const override of overrides) {
    const matchIndex = remaining.findIndex(
      (themeDay) => normalizeLabel(themeDay) === normalizeLabel(override)
    );

    if (matchIndex >= 0) {
      prioritized.push(remaining[matchIndex]);
      remaining.splice(matchIndex, 1);
    }
  }

  const scoredRemainder = remaining
    .map((themeDay, index) => ({
      themeDay,
      score: scoreThemeDay(dateKey, themeDay, index),
      index,
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map((entry) => entry.themeDay);

  return [...prioritized, ...scoredRemainder];
}
