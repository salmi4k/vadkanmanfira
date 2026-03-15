import { Locale } from './locale';
import { readStoredPreferences, writeStoredPreferences } from './preferences';

export type Mood = 'dry' | 'cheerful' | 'chaotic' | 'formal' | 'absurd' | 'warm';

export const MOOD_STORAGE_KEY = 'vadkanmanfira.aiMood';

export const moodOptions: Array<{
  value: Mood;
  labels: Record<Locale, string>;
  notes: Record<Locale, string>;
}> = [
  {
    value: 'dry',
    labels: { sv: 'Torr', en: 'Dry', 'pt-BR': 'Seco' },
    notes: {
      sv: 'Svalt, vasst och lätt administrativt.',
      en: 'Cool, sharp, and faintly administrative.',
      'pt-BR': 'Frio, afiado e levemente administrativo.',
    },
  },
  {
    value: 'cheerful',
    labels: { sv: 'Glad', en: 'Cheerful', 'pt-BR': 'Alegre' },
    notes: {
      sv: 'Ljusare, mjukare och mer generöst.',
      en: 'Brighter, softer, and more generous.',
      'pt-BR': 'Mais claro, suave e generoso.',
    },
  },
  {
    value: 'formal',
    labels: { sv: 'Formell', en: 'Formal', 'pt-BR': 'Formal' },
    notes: {
      sv: 'Stramare, stelare och mer ceremoniell.',
      en: 'Tighter, stiffer, and more ceremonial.',
      'pt-BR': 'Mais contido, rigido e cerimonial.',
    },
  },
  {
    value: 'warm',
    labels: { sv: 'Varm', en: 'Warm', 'pt-BR': 'Afetuoso' },
    notes: {
      sv: 'Mjukare, mänskligare och mindre frostigt.',
      en: 'Softer, more human, and less frosty.',
      'pt-BR': 'Mais suave, humano e menos gelado.',
    },
  },
  {
    value: 'chaotic',
    labels: { sv: 'Kaotisk', en: 'Chaotic', 'pt-BR': 'Caotico' },
    notes: {
      sv: 'Nervigare, skevare och märkbart mer stökigt.',
      en: 'Nervier, louder, and visibly more unruly.',
      'pt-BR': 'Mais nervoso, barulhento e visivelmente baguncado.',
    },
  },
  {
    value: 'absurd',
    labels: { sv: 'Absurd', en: 'Absurd', 'pt-BR': 'Absurdo' },
    notes: {
      sv: 'Mer surrealistiskt, konstigt och avsiktligt fel.',
      en: 'More surreal, stranger, and intentionally off.',
      'pt-BR': 'Mais surreal, estranho e deliberadamente torto.',
    },
  },
];

const supportedMoods = new Set<Mood>(moodOptions.map((option) => option.value));

export function getInitialMood(): Mood {
  if (typeof window === 'undefined') {
    return 'dry';
  }

  const storedPreferences = readStoredPreferences();
  if (storedPreferences?.mood && supportedMoods.has(storedPreferences.mood)) {
    return storedPreferences.mood;
  }

  const value = window.localStorage.getItem(MOOD_STORAGE_KEY);
  return value && supportedMoods.has(value as Mood) ? (value as Mood) : 'dry';
}

export function persistMood(mood: Mood): void {
  if (typeof window === 'undefined') {
    return;
  }

  writeStoredPreferences({ mood });
}

export function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const storedPreferences = readStoredPreferences();
  if (typeof storedPreferences?.darkMode === 'boolean') {
    return storedPreferences.darkMode;
  }

  return typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
}

export function persistDarkMode(darkMode: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  writeStoredPreferences({ darkMode });
}

export function getMoodLabel(mood: Mood, locale: Locale): string {
  return moodOptions.find((option) => option.value === mood)?.labels[locale] ?? mood;
}

export function getMoodNote(mood: Mood, locale: Locale): string {
  return moodOptions.find((option) => option.value === mood)?.notes[locale] ?? mood;
}
