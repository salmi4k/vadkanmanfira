import { ContentPack } from '../../contentPack';
import { addDays, formatForInput } from '../../dateUtils';
import { DayType, getDayStatus, getOfficialHolidays } from '../../dayLogic';
import { Locale } from '../../locale';
import { Mood } from '../../mood';
import {
  CelebrationCategory,
  CelebrationDayType,
  getCelebrationDefinition,
} from '../celebrations/celebrationDefinitions';
import { getThemeDaysForDate } from '../theme-days/temadagar';

export type EngagementSnapshot = {
  date: Date;
  dayType: DayType;
  themeDays: string[];
  category: CelebrationCategory | null;
  score: number;
};

export type FikaSuggestion = {
  label: string;
  item: string;
  score: number;
  note: string;
};

const categoryWeight: Record<CelebrationCategory, number> = {
  official: 24,
  food: 28,
  seasonal: 22,
  observance: 18,
  team: 14,
};

const surpriseKeywordWeight: Array<{ pattern: RegExp; weight: number }> = [
  { pattern: /kanel|semla|våff|vaff|kladdkaka|lakrits|pizza|donut|glass|fika/i, weight: 18 },
  { pattern: /jul|påsk|pask|valborg|midsommar|lucia|national/i, weight: 16 },
  { pattern: /star wars|sockorna|fred|bok|museum|radio|hjärta|heart/i, weight: 12 },
  { pattern: /internationella|world|världs|v[aä]rlds/i, weight: 6 },
];

const fikaByCelebration: Partial<Record<CelebrationDayType, { item: string; score: number }>> = {
  allahjartansdag: { item: 'geléhjärtan och kaffe', score: 7 },
  fettisdag: { item: 'semla', score: 10 },
  skartorsdag: { item: 'påskgodis och kaffe', score: 7 },
  langfredag: { item: 'mjuk kaka och lugnt kaffe', score: 5 },
  paskafton: { item: 'påskgodis och kaffe', score: 9 },
  paskdagen: { item: 'påskdessert', score: 8 },
  annandagpask: { item: 'rester och påtår', score: 7 },
  vaffeldagen: { item: 'våffla', score: 10 },
  valborg: { item: 'bulle och kvällskaffe', score: 8 },
  nationaldagen: { item: 'jordgubbstårta eller fika i blågult', score: 8 },
  midsommarafton: { item: 'jordgubbar och kaffe', score: 10 },
  kanelbullensdag: { item: 'kanelbulle', score: 10 },
  kladdkakansdag: { item: 'kladdkaka', score: 10 },
  surstrommingspremiar: { item: 'efterrätt och ett förlåtande kaffe', score: 6 },
  lucia: { item: 'lussekatt', score: 9 },
  julafton: { item: 'julgodis och glöggfika', score: 9 },
  nyarsafton: { item: 'något sött före bubbel', score: 7 },
  kottonsdag: { item: 'något grillvänligt till eftermiddagskaffet', score: 5 },
  fisktorsdag: { item: 'citronkaka eller bryggkaffe med disciplin', score: 4 },
  marmeladfredag: { item: 'toast med marmelad eller fredagsfika', score: 8 },
};

function clampScore(score: number): number {
  return Math.max(1, Math.min(100, Math.round(score)));
}

function getThemeDayInterestBonus(themeDays: string[]): number {
  return themeDays.reduce((total, themeDay) => {
    const matchWeight = surpriseKeywordWeight.reduce((best, entry) => {
      return entry.pattern.test(themeDay) ? Math.max(best, entry.weight) : best;
    }, 0);

    return total + matchWeight;
  }, 0);
}

export function getCategoryLabel(
  category: CelebrationCategory | null,
  locale: Locale
): string | null {
  if (!category) {
    return null;
  }

  const labels: Record<Locale, Record<CelebrationCategory, string>> = {
    sv: {
      official: 'Officiell',
      food: 'Fika/fest',
      seasonal: 'Säsong',
      observance: 'Högtid',
      team: 'Intern',
    },
    en: {
      official: 'Official',
      food: 'Food',
      seasonal: 'Seasonal',
      observance: 'Observance',
      team: 'Team',
    },
    'pt-BR': {
      official: 'Oficial',
      food: 'Comida',
      seasonal: 'Sazonal',
      observance: 'Observância',
      team: 'Equipe',
    },
  };

  return labels[locale][category];
}

export function getEngagementScoreLabel(score: number, locale: Locale): string {
  if (locale === 'en') {
    return `Celebration score ${score}/100`;
  }

  if (locale === 'pt-BR') {
    return `Pontuação de celebração ${score}/100`;
  }

  return `Firarpoäng ${score}/100`;
}

export function scoreEngagementSnapshot(
  date: Date,
  contentPack: ContentPack
): EngagementSnapshot {
  const dayStatus = getDayStatus(date, contentPack);
  const themeDays = getThemeDaysForDate(date);
  const definition =
    dayStatus.dayType === 'ordinary' ? null : getCelebrationDefinition(dayStatus.dayType);
  const category = definition?.category ?? null;

  let score = 6;

  if (definition) {
    score += 42 + Math.round(definition.priority / 4);
    score += categoryWeight[definition.category];
  }

  if (themeDays.length > 0) {
    score += Math.min(3, themeDays.length) * 10;
    score += getThemeDayInterestBonus(themeDays);
  }

  if (getOfficialHolidays(date.getFullYear()).some((holiday) => holiday.dateLabel === formatForInput(date))) {
    score += 10;
  }

  return {
    date,
    dayType: dayStatus.dayType,
    themeDays,
    category,
    score: clampScore(score),
  };
}

function pickWeighted<T>(
  items: T[],
  getWeight: (item: T) => number,
  randomValue: number
): T {
  const total = items.reduce((sum, item) => sum + getWeight(item), 0);
  let cursor = randomValue * total;

  for (const item of items) {
    cursor -= getWeight(item);
    if (cursor <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

export function pickSurpriseDate(
  anchorDate: Date,
  contentPack: ContentPack,
  randomValue = Math.random()
): EngagementSnapshot {
  const yearStart = new Date(anchorDate.getFullYear(), 0, 1);
  const candidates: EngagementSnapshot[] = [];

  for (let offset = 0; offset < 366; offset += 1) {
    const current = addDays(yearStart, offset);
    if (current.getFullYear() !== anchorDate.getFullYear()) {
      break;
    }

    const snapshot = scoreEngagementSnapshot(current, contentPack);
    if (snapshot.score >= 45) {
      candidates.push(snapshot);
    }
  }

  if (candidates.length === 0) {
    return scoreEngagementSnapshot(anchorDate, contentPack);
  }

  return pickWeighted(candidates, (candidate) => candidate.score, randomValue);
}

function containsFoodKeyword(themeDay: string): boolean {
  return /fika|kanel|kaffe|semla|våff|vaff|kaka|bak|bulle|pizza|donut|glass|ost|choklad|lakrits/i.test(
    themeDay
  );
}

function getFallbackFikaItem(locale: Locale, mood: Mood): string {
  if (locale === 'en') {
    return mood === 'formal' ? 'coffee and a modest biscuit' : 'coffee and something sweet';
  }

  if (locale === 'pt-BR') {
    return mood === 'formal' ? 'café e um biscoito discreto' : 'café e algo doce';
  }

  return mood === 'formal' ? 'kaffe och en diskret kaka' : 'kaffe och något sött';
}

export function getDailyFikaSuggestion(args: {
  celebration: CelebrationDayType | null;
  category: CelebrationCategory | null;
  themeDays: string[];
  locale: Locale;
  mood: Mood;
  score: number;
}): FikaSuggestion {
  const { celebration, category, themeDays, locale, mood, score } = args;
  const celebrationSuggestion = celebration ? fikaByCelebration[celebration] : null;
  const foodTheme = themeDays.find(containsFoodKeyword) ?? themeDays[0] ?? null;

  const label =
    locale === 'en'
      ? "Today's fika excuse"
      : locale === 'pt-BR'
        ? 'Desculpa do dia para um fika'
        : 'Dagens ursäkt att fika';

  if (celebrationSuggestion) {
    return {
      label,
      item: celebrationSuggestion.item,
      score: Math.max(celebrationSuggestion.score, Math.min(10, Math.round(score / 10))),
      note:
        locale === 'en'
          ? 'The date is already carrying enough ceremony to justify a proper pause.'
          : locale === 'pt-BR'
            ? 'A data já carrega cerimônia suficiente para justificar uma pausa decente.'
            : 'Datumet bär redan tillräckligt mycket ceremoni för att motivera en ordentlig paus.',
    };
  }

  if (foodTheme) {
    return {
      label,
      item:
        locale === 'en'
          ? `something that fits ${foodTheme.toLowerCase()}`
          : locale === 'pt-BR'
            ? `algo que combine com ${foodTheme.toLowerCase()}`
            : `något som passar till ${foodTheme.toLowerCase()}`,
      score: Math.max(6, Math.min(9, Math.round(score / 10))),
      note:
        locale === 'en'
          ? 'A food-leaning theme day is close enough to count as a legitimate fika angle.'
          : locale === 'pt-BR'
            ? 'Uma data temática puxada para comida já basta para virar um ângulo legítimo de fika.'
            : 'En matnära temadag är tillräckligt mycket innehåll för att räknas som giltig fika-vinkel.',
    };
  }

  return {
    label,
    item: getFallbackFikaItem(locale, mood),
    score: category === 'official' ? 6 : 4,
    note:
      locale === 'en'
        ? 'No pastry emergency is in progress, but a calm fika remains structurally defensible.'
        : locale === 'pt-BR'
          ? 'Nenhuma emergência de confeitaria está em curso, mas um fika tranquilo continua defensável.'
          : 'Ingen akut bakverksfråga pågår, men en lugn fika är fortfarande strukturellt försvarbar.',
  };
}
