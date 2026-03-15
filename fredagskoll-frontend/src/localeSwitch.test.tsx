import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi, type MockedFunction } from 'vitest';
import App from './App';
import { PREFERENCES_STORAGE_KEY } from './preferences';
import { useAiContent } from './features/ai/useAiContent';
import { useNameDays } from './features/name-days/useNameDays';

vi.mock('./features/ai/useAiContent', () => ({
  useAiContent: vi.fn(),
}));

vi.mock('./features/name-days/useNameDays', () => ({
  useNameDays: vi.fn(),
}));

const mockedUseAiContent = useAiContent as MockedFunction<typeof useAiContent>;
const mockedUseNameDays = useNameDays as MockedFunction<typeof useNameDays>;

beforeEach(() => {
  window.localStorage.clear();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });

  mockedUseNameDays.mockReturnValue({
    nameDays: [],
    nameDayState: 'ready',
  });

  mockedUseAiContent.mockReturnValue({
    blurb: 'Standard text.',
    currentBlurbs: ['Standard text.'],
    handleReroll: vi.fn(),
    isAiBundleLoading: false,
    isAiRerolling: false,
    themeDayCardNote: 'Standard note.',
    themeDayTitleEnding: 'It can carry the day.',
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('switches the interface to English and persists the locale', async () => {
  render(<App initialDate={new Date(2026, 2, 25)} />);

  fireEvent.click(screen.getByRole('button', { name: /Språk/i }));
  fireEvent.click(screen.getByRole('menuitemradio', { name: /English/i }));

  expect(
    screen.getByRole('heading', { level: 1, name: /What can one celebrate\?/i })
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Previous day/i })).toBeInTheDocument();
  expect(screen.getByText(/Image credits/i)).toBeInTheDocument();
  expect(JSON.parse(window.localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? '{}')).toMatchObject({
    version: 1,
    locale: 'en',
  });
});
