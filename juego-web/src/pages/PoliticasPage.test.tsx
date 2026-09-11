import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { PoliticasPage } from './PoliticasPage';

const renderWithRouter = (component: React.ReactElement) =>
  render(<MemoryRouter>{component}</MemoryRouter>);

describe('PoliticasPage', () => {
  it('should render the privacy policy page', () => {
    renderWithRouter(<PoliticasPage />);
    expect(screen.getByText('Política de Privacidad')).toBeInTheDocument();
    expect(screen.getByText('¿Dónde Está Stuttgart? — Uniempresarial')).toBeInTheDocument();
  });

  it('should explain what data is collected', () => {
    renderWithRouter(<PoliticasPage />);
    expect(screen.getByText(/Datos que recolectamos/)).toBeInTheDocument();
    expect(screen.getByText(/Nombre completo/)).toBeInTheDocument();
    expect(screen.getByText(/Número de teléfono/)).toBeInTheDocument();
  });

  it('should mention Ley 1581 de 2012', () => {
    renderWithRouter(<PoliticasPage />);
    expect(screen.getByText(/Ley 1581 de 2012/)).toBeInTheDocument();
    expect(screen.getByText(/Decreto 1377 de 2013/)).toBeInTheDocument();
  });

  it('should have link to official PDF', () => {
    renderWithRouter(<PoliticasPage />);
    const pdfLink = screen.getByText(/Política de Tratamiento de Datos Personales \(PDF\)/);
    expect(pdfLink).toHaveAttribute('href', 'https://uniempresarial.edu.co/wp-content/uploads/2026/08/Tratamiento-de-Datos-Personales.pdf');
    expect(pdfLink).toHaveAttribute('target', '_blank');
  });

  it('should have link to Uniempresarial terms', () => {
    renderWithRouter(<PoliticasPage />);
    const termsLink = screen.getByText(/Términos y Condiciones — Uniempresarial/);
    expect(termsLink).toHaveAttribute('href', 'https://uniempresarial.edu.co/terminos-y-condiciones');
  });

  it('should have back to home link', () => {
    renderWithRouter(<PoliticasPage />);
    expect(screen.getByText(/Volver al inicio/)).toHaveAttribute('href', '/');
  });

  it('should explain user rights', () => {
    renderWithRouter(<PoliticasPage />);
    expect(screen.getByText(/Conocer/)).toBeInTheDocument();
    expect(screen.getByText(/Actualizar/)).toBeInTheDocument();
    expect(screen.getByText(/Solicitar la supresión/)).toBeInTheDocument();
  });
});
