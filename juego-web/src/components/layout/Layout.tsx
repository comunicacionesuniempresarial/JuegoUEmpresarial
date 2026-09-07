import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from './OfflineBanner';

export function Layout() {
  const location = useLocation();
  // Kiosk mode viewports for games and landing page (zero scroll, 100vh locked)
  const isKioskGamePage = location.pathname === '/' || location.pathname === '/ruleta' || location.pathname === '/busqueda';

  return (
    <div className={`flex flex-col bg-slate-50/50 selection:bg-primary selection:text-white ${
      isKioskGamePage ? 'h-screen max-h-screen overflow-hidden' : 'min-h-screen'
    }`}>
      <Header />
      <main className={`flex-1 flex flex-col ${
        isKioskGamePage ? 'overflow-hidden' : 'pb-16 md:pb-0'
      }`}>
        <Outlet />
      </main>
      {!isKioskGamePage && <Footer />}
      {!isKioskGamePage && <BottomNav />}
      <OfflineBanner />
    </div>
  );
}
