import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../../App';

beforeEach(() => {
  vi.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ dagar: [{ namnsdag: [] }] }),
  } as Response);
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('renders the world national-day panel inside the main card when the date matches', async () => {
  render(<App initialDate={new Date(2026, 2, 25)} />);

  await waitFor(() =>
    expect(screen.queryByText(/Laddar namnsdag/i)).not.toBeInTheDocument()
  );

  expect(screen.getByText(/Nationaldagar ute i världen/i)).toBeInTheDocument();
  expect(screen.getByText(/^Grekland$/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Självständighetsdagen/i).length).toBeGreaterThan(0);
});
