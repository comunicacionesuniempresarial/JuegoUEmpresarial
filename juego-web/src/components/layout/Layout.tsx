import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from './OfflineBanner';

export function Layout() {
  const location = useLocation();
  // Desktop kiosk mode; mobile keeps natural scrolling so browser chrome never hides controls.
  const isKioskGamePage = location.pathname === '/' || location.pathname === '/ruleta' || location.pathname === '/busqueda';

  return (
    <div className={`flex min-h-[100svh] flex-col bg-slate-50/50 selection:bg-primary selection:text-white ${
      isKioskGamePage ? 'lg:h-screen lg:max-h-screen lg:overflow-hidden' : ''
    }`}>
      <Header />
      <main className={`flex-1 flex flex-col ${
        isKioskGamePage ? 'min-h-0 pb-24 md:pb-0 lg:overflow-hidden' : 'pb-16 md:pb-0'
      }`}>
        <Outlet />
      </main>
      {!isKioskGamePage && <Footer />}
      {/* BottomNav is mobile-only (md:hidden) so it is safe to render on every
          page: kiosk game pages previously left mobile users with no way to
          navigate between Inicio / Ruleta / Búsqueda. */}
      <BottomNav />
      <OfflineBanner />
    </div>
  );
}
