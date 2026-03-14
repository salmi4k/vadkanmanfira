import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();

  jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ dagar: [{ namnsdag: [] }] }),
  } as Response);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('switches the interface to English and persists the locale', async () => {
  render(<App initialDate={new Date(2026, 2, 25)} />);

  await waitFor(() =>
    expect(screen.queryByText(/Laddar namnsdag/i)).not.toBeInTheDocument()
  );

  fireEvent.click(screen.getByRole('button', { name: /English/i }));

  expect(
    screen.getByRole('heading', { level: 1, name: /What can one celebrate\?/i })
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Svenska/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Previous day/i })).toBeInTheDocument();
  expect(screen.getByText(/Image credits/i)).toBeInTheDocument();
  expect(window.localStorage.getItem('vadkanmanfira.locale')).toBe('en');
});
