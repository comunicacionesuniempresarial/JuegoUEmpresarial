import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { TerminosJuegoPage } from './TerminosJuegoPage';

const renderWithRouter = (component: React.ReactElement) =>
  render(<MemoryRouter>{component}</MemoryRouter>);

describe('TerminosJuegoPage', () => {
  it('should render the terms page', () => {
    renderWithRouter(<TerminosJuegoPage />);
    expect(screen.getByText('Términos y Condiciones del Juego')).toBeInTheDocument();
  });

  it('should describe the two game modes', () => {
    renderWithRouter(<TerminosJuegoPage />);
    expect(screen.getByText(/Ruleta de premios/)).toBeInTheDocument();
    expect(screen.getByText(/Reto de búsqueda/)).toBeInTheDocument();
  });

  it('should state prizes are gifts with no monetary value', () => {
    renderWithRouter(<TerminosJuegoPage />);
    expect(screen.getByText(/obsequios promocionales/)).toBeInTheDocument();
  });

  it('should state participation is free', () => {
    renderWithRouter(<TerminosJuegoPage />);
    expect(screen.getByText(/totalmente gratuita/)).toBeInTheDocument();
  });

  it('should mention one prize per person', () => {
    renderWithRouter(<TerminosJuegoPage />);
    expect(screen.getByText(/Un premio por persona/)).toBeInTheDocument();
  });

  it('should mention data treatment under Ley 1581', () => {
    renderWithRouter(<TerminosJuegoPage />);
    expect(screen.getByText(/Ley 1581 de 2012/)).toBeInTheDocument();
  });

  it('should have link to privacy policy', () => {
    renderWithRouter(<TerminosJuegoPage />);
    const links = screen.getAllByText(/Política de Privacidad/);
    const privacyLink = links.find((el) => el.closest('a')?.getAttribute('href') === '/privacidad');
    expect(privacyLink).toBeDefined();
  });

  it('should have link to Uniempresarial terms', () => {
    renderWithRouter(<TerminosJuegoPage />);
    const termsLink = screen.getByText(/Términos Uniempresarial/);
    expect(termsLink).toHaveAttribute('href', 'https://uniempresarial.edu.co/terminos-y-condiciones');
  });

  it('should mention Colombian legislation', () => {
    renderWithRouter(<TerminosJuegoPage />);
    const colombiaTexts = screen.getAllByText(/Colombia/);
    expect(colombiaTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('should have back to home link', () => {
    renderWithRouter(<TerminosJuegoPage />);
    expect(screen.getByText(/Volver al inicio/)).toHaveAttribute('href', '/');
  });
});
