import { lazy, Suspense } from 'react';
import { createBrowserRouter, isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
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

function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.status === 404
      ? 'No encontramos esta página.'
      : 'No pudimos cargar esta sección.'
    : 'Ocurrió un error inesperado.';

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <span className="text-5xl" aria-hidden="true">🛠️</span>
        <h1 className="mt-4 text-2xl font-black text-slate-900">Algo no salió bien</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{message} Intenta nuevamente o vuelve al inicio.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white transition hover:bg-primary-hover"
          >
            Reintentar
          </button>
          <Link to="/" className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-200">
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorPage />,
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
