import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from './OfflineBanner';

export function Layout() {
  const location = useLocation();
  // Desktop kiosk mode; mobile keeps natural scrolling so browser chrome never hides controls.
  const isKioskGamePage =
    location.pathname === '/' || location.pathname === '/ruleta' || location.pathname === '/busqueda';
  // The two game boards lock to a single screen: the countdown and the
  // controls must stay reachable while the board scrolls internally.
  const isLockedGamePage =
    location.pathname === '/ruleta' || location.pathname === '/busqueda';

  return (
    <div
      className={`flex flex-col bg-slate-50/50 selection:bg-primary selection:text-white ${
        isLockedGamePage ? 'game-screen' : 'min-h-[100svh]'
      } ${isKioskGamePage ? 'lg:h-screen lg:max-h-screen lg:overflow-hidden' : ''}`}
    >
      <Header />
      <main
        className={`app-main flex min-h-0 flex-1 flex-col ${
          isKioskGamePage ? 'pb-24 lg:pb-0 lg:overflow-hidden' : 'pb-24 lg:pb-0'
        }`}
      >
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
