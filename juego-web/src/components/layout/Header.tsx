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
        : 'text-gray-600 hover:text-primary hover:bg-gray-100/60'
    }`;

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-white/40 bg-white/85 backdrop-blur-md h-14 shrink-0 transition-all">
      <div className="mx-auto h-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          <NavLink
            to="/"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            <div className="relative">
              <img
                src="/images/logo-header.png"
                alt="Logo Uniempresarial"
                className="h-8 sm:h-9 w-auto transition-transform group-hover:scale-105 drop-shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black text-primary tracking-tight leading-none">
                ¿Dónde Está Stuttgart?
              </span>
              <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase leading-none mt-0.5">
                Uniempresarial
              </span>
            </div>
          </NavLink>

          {/* Navigation & Kiosk Controls */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/" end className={linkClass} onClick={() => sound.playClick()}>
                🏠 Inicio
              </NavLink>
              <NavLink to="/ruleta" className={linkClass} onClick={() => sound.playClick()}>
                🎡 Ruleta
              </NavLink>
              <NavLink to="/busqueda" className={linkClass} onClick={() => sound.playClick()}>
                🔍 Búsqueda
              </NavLink>
              <NavLink
                to="/admin"
                onClick={() => sound.playClick()}
                className={({ isActive }) =>
                  `text-xs sm:text-sm font-bold transition-all px-3 py-1.5 rounded-full border shadow-xs ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-primary/30'
                      : 'border-gray-200 text-gray-700 bg-white hover:border-primary hover:text-primary'
                  }`
                }
              >
                Admin ⚙️
              </NavLink>
            </div>

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