import { Locale } from './locale';

export type Mood = 'dry' | 'cheerful' | 'chaotic' | 'formal' | 'absurd' | 'warm';

export const MOOD_STORAGE_KEY = 'vadkanmanfira.aiMood';

export const moodOptions: Array<{ value: Mood; labels: Record<Locale, string> }> = [
  {
    value: 'dry',
    labels: { sv: 'Torr', en: 'Dry', 'pt-BR': 'Seco' },
  },
  {
    value: 'cheerful',
    labels: { sv: 'Glad', en: 'Cheerful', 'pt-BR': 'Alegre' },
  },
  {
    value: 'formal',
    labels: { sv: 'Formell', en: 'Formal', 'pt-BR': 'Formal' },
  },
  {
    value: 'warm',
    labels: { sv: 'Varm', en: 'Warm', 'pt-BR': 'Afetuoso' },
  },
  {
    value: 'chaotic',
    labels: { sv: 'Kaotisk', en: 'Chaotic', 'pt-BR': 'Caotico' },
  },
  {
    value: 'absurd',
    labels: { sv: 'Absurd', en: 'Absurd', 'pt-BR': 'Absurdo' },
  },
];

const supportedMoods = new Set<Mood>(moodOptions.map((option) => option.value));

export function getInitialMood(): Mood {
  if (typeof window === 'undefined') {
    return 'dry';
  }

  const value = window.localStorage.getItem(MOOD_STORAGE_KEY);
  return value && supportedMoods.has(value as Mood) ? (value as Mood) : 'dry';
}

export function getMoodLabel(mood: Mood, locale: Locale): string {
  return moodOptions.find((option) => option.value === mood)?.labels[locale] ?? mood;
}
