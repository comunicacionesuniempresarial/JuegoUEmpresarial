import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BusquedaPage } from './BusquedaPage';

const renderWithRouter = (component: React.ReactElement) =>
  render(<MemoryRouter>{component}</MemoryRouter>);

/** Advances the fake clock so the 5s countdown can complete. */
async function runCountdown() {
  await act(async () => {
    vi.advanceTimersByTime(5200);
  });
}

describe('BusquedaPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show a countdown before the search timer starts', async () => {
    renderWithRouter(<BusquedaPage />);

    expect(screen.getByText('Prepárate')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    // The claim button stays disabled while the countdown runs.
    expect(screen.getByRole('button', { name: /LO ENCONTRÉ/i })).toBeDisabled();
  });

  it('should not run the timer during the countdown', async () => {
    renderWithRouter(<BusquedaPage />);

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    // 00:00 — the search has not started yet.
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('should enable the claim button and start the timer after the countdown', async () => {
    renderWithRouter(<BusquedaPage />);

    await runCountdown();

    expect(screen.queryByText('Prepárate')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /LO ENCONTRÉ/i })).toBeEnabled();
    expect(screen.getByText('Encuentra a Stuttgart')).toBeInTheDocument();
  });

  it('should render a single sheet instead of the seven cards', async () => {
    renderWithRouter(<BusquedaPage />);
    await runCountdown();

    const sheets = screen.getAllByRole('img', { name: /Administración|Finanzas|Ingeniería|Marketing|Negocios/ });
    // Only the sheet illustration — the Stuttgart companion is decorative.
    expect(sheets).toHaveLength(1);
  });

  it('should show the victory panel with the elapsed time when the player claims', async () => {
    renderWithRouter(<BusquedaPage />);
    await runCountdown();

    await act(async () => {
      vi.advanceTimersByTime(4000);
    });
    fireEvent.click(screen.getByRole('button', { name: /LO ENCONTRÉ/i }));

    expect(screen.getByText(/Encontraste a Stuttgart/i)).toBeInTheDocument();
    expect(screen.getByText('Tiempo récord:')).toBeInTheDocument();
  });

  it('should offer a new round from the victory panel', async () => {
    renderWithRouter(<BusquedaPage />);
    await runCountdown();

    fireEvent.click(screen.getByRole('button', { name: /LO ENCONTRÉ/i }));
    fireEvent.click(screen.getByRole('button', { name: /Otra lámina/i }));

    // A new round restarts the countdown.
    expect(screen.getByText('Prepárate')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should ignore a claim pressed during the countdown', async () => {
    renderWithRouter(<BusquedaPage />);

    const claim = screen.getByRole('button', { name: /LO ENCONTRÉ/i });
    fireEvent.click(claim);

    expect(screen.queryByText(/Encontraste a Stuttgart/i)).not.toBeInTheDocument();
  });

  it('should toggle between the detail view and the full-sheet overview', async () => {
    renderWithRouter(<BusquedaPage />);
    await runCountdown();

    // The magnifier offers the full-sheet overview first…
    const magnifier = screen.getByRole('button', { name: 'Ver la lámina completa' });
    fireEvent.click(magnifier);

    // …and then goes back to the detail view.
    expect(screen.getByRole('button', { name: 'Volver al detalle' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Volver al detalle' }));
    expect(screen.getByRole('button', { name: 'Ver la lámina completa' })).toBeInTheDocument();
  });
});
