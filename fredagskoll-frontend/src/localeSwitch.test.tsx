import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { PREFERENCES_STORAGE_KEY } from './preferences';
import { useAiContent } from './features/ai/useAiContent';
import { useNameDays } from './features/name-days/useNameDays';

jest.mock('./features/ai/useAiContent', () => ({
  useAiContent: jest.fn(),
}));

jest.mock('./features/name-days/useNameDays', () => ({
  useNameDays: jest.fn(),
}));

const mockedUseAiContent = useAiContent as jest.MockedFunction<typeof useAiContent>;
const mockedUseNameDays = useNameDays as jest.MockedFunction<typeof useNameDays>;

beforeEach(() => {
  window.localStorage.clear();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockReturnValue({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }),
  });

  mockedUseNameDays.mockReturnValue({
    nameDays: [],
    nameDayState: 'ready',
  });

  mockedUseAiContent.mockReturnValue({
    blurb: 'Standard text.',
    currentBlurbs: ['Standard text.'],
    handleReroll: jest.fn(),
    isAiBundleLoading: false,
    isAiRerolling: false,
    themeDayCardNote: 'Standard note.',
    themeDayTitleEnding: 'It can carry the day.',
  });
});

afterEach(() => {
  jest.restoreAllMocks();
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
