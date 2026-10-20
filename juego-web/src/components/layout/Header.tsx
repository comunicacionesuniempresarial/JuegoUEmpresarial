import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { sound } from '../../lib/sound';

export function Header() {
  const [soundActive, setSoundActive] = useState(() => sound.getSoundEnabled());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleAudio = () => {
    const newState = sound.toggleMute();
    setSoundActive(newState);
    if (newState) sound.playClick();
  };

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all sm:px-3 sm:text-sm ${
      isActive
        ? 'text-primary bg-primary/10 shadow-xs'
        : 'text-gray-600 hover:text-primary hover:bg-primary/5'
    }`;

  return (
    <header className="glass-panel sticky top-0 z-50 h-16 shrink-0 border-b border-[#eadfd2] bg-[#fffdf9]/95 backdrop-blur-md transition-all">
      <div className="mx-auto h-full max-w-7xl px-2 sm:px-6 lg:px-8">
        {/* 3-column grid: logo | center title | nav — title is always centered */}
        <div className="grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1 sm:gap-3">
          {/* Left: Logo */}
          <NavLink
            to="/"
            onClick={() => sound.playClick()}
            aria-label="Ir al inicio de Uniempresarial"
            className="group shrink-0 transition-transform active:scale-95"
          >
            <div className="relative">
              <img
                src="/images/logo-header.png"
                alt="Logo Uniempresarial"
                width="175"
                height="48"
                decoding="async"
                className="header-logo h-8 w-auto max-w-[80px] object-contain transition-transform group-hover:scale-105 sm:h-8 sm:max-w-[150px] md:h-9 md:max-w-[175px]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
            </div>
          </NavLink>

          {/* Center: Title — always centered via grid. It wraps on narrow
              phones instead of truncating, so the game name stays legible. */}
          <div className="flex min-w-0 flex-col items-center px-1 text-center">
            <span className="header-title w-full text-[11px] font-black leading-tight tracking-[-0.02em] text-slate-900 sm:whitespace-nowrap sm:text-base md:text-lg lg:text-xl">
              ¿Dónde Está Stuttgart?
            </span>
            <span className="mt-0.5 hidden whitespace-nowrap text-[8px] font-black uppercase tracking-[0.18em] text-teal-700 sm:block sm:text-[9px]">
              Juego para estudiantes
            </span>
          </div>

          {/* Right: Nav & Controls */}
          <nav className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
            {/* Nav links appear from lg (1024px) up. Below that the floating
                BottomNav takes over, so phones and tablets are never left
                without navigation. */}
            <div className="header-nav hidden items-center gap-0.5 lg:flex">
              <NavLink to="/" end className={linkClass} onClick={() => sound.playClick()}>
                Inicio
              </NavLink>
              <NavLink to="/ruleta" className={linkClass} onClick={() => sound.playClick()}>
                Ruleta
              </NavLink>
              <NavLink to="/busqueda" className={linkClass} onClick={() => sound.playClick()}>
                Búsqueda
              </NavLink>
            </div>

            <NavLink
              to="/admin"
              onClick={() => sound.playClick()}
              className={({ isActive }) =>
                `inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-xl border px-2 text-[11px] font-black transition-all sm:h-9 sm:min-w-0 sm:px-3 sm:text-xs ${
                  isActive
                    ? 'border-primary bg-primary text-white shadow-primary/30'
                    : 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50'
                }`
              }
            >
              <span className="sm:mr-1" aria-hidden="true">⚙</span>
              <span className="hidden sm:inline">Admin</span>
            </NavLink>

            {/* Kiosk Fullscreen Mode Button — hidden on mobile: iOS Safari
                does not support requestFullscreen on iPhone and the header
                is already crowded at 320px. */}
            <button
              onClick={toggleFullscreen}
              className="hidden h-9 w-9 items-center justify-center rounded-xl bg-gray-100/90 text-gray-700 transition-all hover:bg-gray-200 hover:scale-105 active:scale-90 border border-gray-200/60 shadow-xs sm:flex"
              title={isFullscreen ? 'Salir de Pantalla Completa' : 'Modo Pantalla Completa (Kiosco)'}
              aria-label="Pantalla completa"
            >
              <span className="text-base">{isFullscreen ? '🗗' : '⛶'}</span>
            </button>

            {/* Sound Toggle Button */}
            <button
              onClick={toggleAudio}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100/90 text-gray-700 transition-all hover:bg-gray-200 hover:scale-105 active:scale-90 border border-gray-200/60 shadow-xs sm:h-9 sm:w-9"
              title={soundActive ? 'Silenciar efectos' : 'Activar efectos de sonido'}
              aria-label={soundActive ? 'Silenciar efectos' : 'Activar efectos de sonido'}
            >
              <span className="text-sm sm:text-base">{soundActive ? '🔊' : '🔇'}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
