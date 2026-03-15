import {
  getInitialDarkMode,
  getInitialMood,
  MOOD_STORAGE_KEY,
  persistDarkMode,
  persistMood,
} from './mood';
import { PREFERENCES_STORAGE_KEY } from './preferences';

beforeEach(() => {
  window.localStorage.clear();
});

test('falls back to dry when an invalid stored mood is found in the legacy key', () => {
  window.localStorage.setItem(MOOD_STORAGE_KEY, 'mysterious');

  expect(getInitialMood()).toBe('dry');
});

test('prefers the shared stored mood when it is valid', () => {
  window.localStorage.setItem(
    PREFERENCES_STORAGE_KEY,
    JSON.stringify({ version: 1, mood: 'warm' })
  );

  expect(getInitialMood()).toBe('warm');
});

test('uses stored dark mode before falling back to system preference', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockReturnValue({ matches: false }),
  });
  window.localStorage.setItem(
    PREFERENCES_STORAGE_KEY,
    JSON.stringify({ version: 1, darkMode: true })
  );

  expect(getInitialDarkMode()).toBe(true);
});

test('persists mood and dark mode into the shared preferences object', () => {
  persistMood('chaotic');
  persistDarkMode(true);

  expect(JSON.parse(window.localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? '{}')).toMatchObject({
    version: 1,
    mood: 'chaotic',
    darkMode: true,
  });
});
