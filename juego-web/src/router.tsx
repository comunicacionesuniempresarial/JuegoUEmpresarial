import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { RuletaPage } from './pages/RuletaPage';
import { BusquedaPage } from './pages/BusquedaPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PoliticasPage } from './pages/PoliticasPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'ruleta', element: <RuletaPage /> },
      { path: 'busqueda', element: <BusquedaPage /> },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      { path: 'login', element: <LoginPage /> },
      { path: 'politicas', element: <PoliticasPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
