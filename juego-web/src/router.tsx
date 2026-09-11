import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Lazy-loaded pages — code splitting for Vercel
const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const RuletaPage = lazy(() => import('./pages/RuletaPage').then((m) => ({ default: m.RuletaPage })));
const BusquedaPage = lazy(() => import('./pages/BusquedaPage').then((m) => ({ default: m.BusquedaPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const PoliticasPage = lazy(() => import('./pages/PoliticasPage').then((m) => ({ default: m.PoliticasPage })));
const CookiesPage = lazy(() => import('./pages/CookiesPage').then((m) => ({ default: m.CookiesPage })));
const TerminosJuegoPage = lazy(() => import('./pages/TerminosJuegoPage').then((m) => ({ default: m.TerminosJuegoPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <LandingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'ruleta',
        element: (
          <SuspenseWrapper>
            <RuletaPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'busqueda',
        element: (
          <SuspenseWrapper>
            <BusquedaPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <DashboardPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'privacidad',
        element: (
          <SuspenseWrapper>
            <PoliticasPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'cookies',
        element: (
          <SuspenseWrapper>
            <CookiesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'terminos-juego',
        element: (
          <SuspenseWrapper>
            <TerminosJuegoPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '*',
        element: (
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);
