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
    `relative text-xs sm:text-sm font-bold transition-all px-3 py-1.5 rounded-xl ${
      isActive
        ? 'text-primary bg-primary/10 shadow-xs'
        : 'text-gray-600 hover:text-primary hover:bg-primary/5'
    }`;

  return (
    <header className="glass-panel sticky top-0 z-50 h-[4.25rem] shrink-0 border-b border-[#eadfd2] bg-[#fffdf9]/95 backdrop-blur-md transition-all sm:h-16">
      <div className="mx-auto h-full max-w-7xl px-2.5 sm:px-6 lg:px-8">
        {/* 3-column grid: logo | center title | nav — title is always centered */}
        <div className="grid h-full grid-cols-[auto_1fr_auto] items-center">
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
                className="h-7 w-auto max-w-[82px] object-contain transition-transform group-hover:scale-105 sm:h-10 sm:max-w-[175px]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
            </div>
          </NavLink>

          {/* Center: Title — always centered via grid */}
          <div className="flex flex-col items-center text-center min-w-0">
            <span className="max-w-[6.5rem] truncate whitespace-nowrap text-[10px] font-black tracking-[-0.03em] text-slate-900 sm:max-w-none sm:text-xl lg:text-2xl">
              ¿Dónde Está Stuttgart?
            </span>
            <span className="mt-0.5 hidden whitespace-nowrap text-[8px] font-black uppercase tracking-[0.18em] text-teal-700 sm:block sm:text-[9px]">
              Juego para estudiantes
            </span>
          </div>

          {/* Right: Nav & Controls */}
          <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1 xl:flex">
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
                  `inline-flex items-center rounded-xl border px-2 py-1.5 text-[11px] font-black transition-all sm:px-3 sm:text-xs ${
                    isActive
                      ? 'border-primary bg-primary text-white shadow-primary/30'
                      : 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50'
                  }`
                }
              >
                <span className="sm:mr-1" aria-hidden="true">⚙</span>
                <span className="hidden sm:inline">Admin</span>
            </NavLink>

            {/* Kiosk Fullscreen Mode Button */}
            <button
              onClick={toggleFullscreen}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gray-100/90 text-gray-700 transition-all hover:bg-gray-200 hover:scale-105 active:scale-90 border border-gray-200/60 shadow-xs"
              title={isFullscreen ? 'Salir de Pantalla Completa' : 'Modo Pantalla Completa (Kiosco)'}
              aria-label="Pantalla completa"
            >
              <span className="text-sm sm:text-base">{isFullscreen ? '🗗' : '⛶'}</span>
            </button>

            {/* Sound Toggle Button */}
            <button
              onClick={toggleAudio}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gray-100/90 text-gray-700 transition-all hover:bg-gray-200 hover:scale-105 active:scale-90 border border-gray-200/60 shadow-xs"
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
