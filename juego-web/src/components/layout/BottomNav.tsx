import { NavLink } from 'react-router-dom';
import { sound } from '../../lib/sound';

export function BottomNav() {
  const handleNavClick = () => {
    sound.playClick();
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center py-2 px-3 transition-all duration-200 rounded-2xl relative ${
      isActive
        ? 'text-primary font-bold scale-105'
        : 'text-gray-500 hover:text-gray-900 font-medium'
    }`;

  return (
    <div className="fixed bottom-3 left-4 right-4 z-40 md:hidden">
      <nav className="glass-panel mx-auto flex items-center justify-around rounded-3xl px-2 py-1 shadow-2xl border border-white/60 bg-white/85 backdrop-blur-xl">
        <NavLink to="/" end className={navItemClass} onClick={handleNavClick}>
          {({ isActive }) => (
            <>
              <span className="text-xl">🏠</span>
              <span className="text-[11px] tracking-tight">Inicio</span>
              {isActive && (
                <span className="absolute bottom-1 h-1 w-5 rounded-full bg-primary" />
              )}
            </>
          )}
        </NavLink>

        <NavLink to="/ruleta" className={navItemClass} onClick={handleNavClick}>
          {({ isActive }) => (
            <>
              <span className="text-xl animate-spin-slow">🎡</span>
              <span className="text-[11px] tracking-tight">Ruleta</span>
              {isActive && (
                <span className="absolute bottom-1 h-1 w-5 rounded-full bg-primary" />
              )}
            </>
          )}
        </NavLink>

        <NavLink to="/busqueda" className={navItemClass} onClick={handleNavClick}>
          {({ isActive }) => (
            <>
              <span className="text-xl">🔍</span>
              <span className="text-[11px] tracking-tight">Búsqueda</span>
              {isActive && (
                <span className="absolute bottom-1 h-1 w-5 rounded-full bg-primary" />
              )}
            </>
          )}
        </NavLink>

        <NavLink to="/admin" className={navItemClass} onClick={handleNavClick}>
          {({ isActive }) => (
            <>
              <span className="text-xl">⚙️</span>
              <span className="text-[11px] tracking-tight">Admin</span>
              {isActive && (
                <span className="absolute bottom-1 h-1 w-5 rounded-full bg-primary" />
              )}
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
}
