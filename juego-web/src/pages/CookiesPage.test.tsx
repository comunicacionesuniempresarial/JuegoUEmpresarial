import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { CookiesPage } from './CookiesPage';

const renderWithRouter = (component: React.ReactElement) =>
  render(<MemoryRouter>{component}</MemoryRouter>);

describe('CookiesPage', () => {
  it('should render the cookies page', () => {
    renderWithRouter(<CookiesPage />);
    expect(screen.getByText('Política de Cookies')).toBeInTheDocument();
  });

  it('should state no tracking cookies are used', () => {
    renderWithRouter(<CookiesPage />);
    expect(screen.getByText(/No utilizamos cookies de rastreo/)).toBeInTheDocument();
  });

  it('should explain Supabase session cookies', () => {
    renderWithRouter(<CookiesPage />);
    expect(screen.getByText(/Supabase Authentication/)).toBeInTheDocument();
  });

  it('should explain Vercel cookies', () => {
    renderWithRouter(<CookiesPage />);
    const vercelTexts = screen.getAllByText(/Vercel/);
    expect(vercelTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('should have link to Vercel cookies policy', () => {
    renderWithRouter(<CookiesPage />);
    const vercelLink = screen.getByText(/vercel\.com\/legal\/cookies-policy/);
    expect(vercelLink).toHaveAttribute('href', 'https://vercel.com/legal/cookies-policy');
    expect(vercelLink).toHaveAttribute('target', '_blank');
  });

  it('should provide browser cookie management instructions', () => {
    renderWithRouter(<CookiesPage />);
    expect(screen.getByText(/Chrome/)).toBeInTheDocument();
    expect(screen.getByText(/Firefox/)).toBeInTheDocument();
    expect(screen.getByText(/Safari/)).toBeInTheDocument();
  });

  it('should have back to home link', () => {
    renderWithRouter(<CookiesPage />);
    expect(screen.getByText(/Volver al inicio/)).toHaveAttribute('href', '/');
  });
});
