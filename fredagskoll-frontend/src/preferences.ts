import type { Locale } from './locale';
import type { Mood } from './mood';

export const PREFERENCES_STORAGE_KEY = 'vadkanmanfira.preferences';

type StoredPreferences = {
  version: 1;
  locale?: Locale;
  mood?: Mood;
  darkMode?: boolean;
};

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readStoredPreferences(): StoredPreferences | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isPlainObject(parsed) || parsed.version !== 1) {
      return null;
    }

    const preferences: StoredPreferences = { version: 1 };

    if (typeof parsed.locale === 'string') {
      preferences.locale = parsed.locale as Locale;
    }

    if (typeof parsed.mood === 'string') {
      preferences.mood = parsed.mood as Mood;
    }

    if (typeof parsed.darkMode === 'boolean') {
      preferences.darkMode = parsed.darkMode;
    }

    return preferences;
  } catch {
    return null;
  }
}

export function writeStoredPreferences(
  next: Partial<Omit<StoredPreferences, 'version'>>
): void {
  if (!canUseStorage()) {
    return;
  }

  const current = readStoredPreferences() ?? { version: 1 };
  const merged: StoredPreferences = {
    ...current,
    ...next,
    version: 1,
  };

  window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(merged));
}
