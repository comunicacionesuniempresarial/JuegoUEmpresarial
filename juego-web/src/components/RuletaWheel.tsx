import { useCallback, useEffect, useRef, useState } from 'react';
import type { Prize } from '../types';

interface RuletaWheelProps {
  prizes: Prize[];
  isSpinning: boolean;
  onSpinEnd: (prize: Prize) => void;
}

/** Default prizes for the ruleta game — university careers */
export const DEFAULT_PRIZES: Prize[] = [
  { id: '1', label: 'Adm. de Empresas', color: '#E63946', probability: 1 },
  { id: '2', label: 'Finanzas', color: '#457B9D', probability: 1 },
  { id: '3', label: 'Ing. Industrial', color: '#2A9D8F', probability: 1 },
  { id: '4', label: 'Ing. Software', color: '#E9C46A', probability: 1 },
  { id: '5', label: 'Marketing', color: '#F4A261', probability: 1 },
  { id: '6', label: 'Neg. Internac.', color: '#1D3557', probability: 1 },
  { id: '7', label: 'Neg. Turísticos', color: '#6D597A', probability: 1 },
];

export function RuletaWheel({ prizes, isSpinning, onSpinEnd }: RuletaWheelProps) {
  const rotationRef = useRef(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  const spin = useCallback(() => {
    const count = prizes.length;
    const segmentAngle = 360 / count;

    // Random extra rotations (5-8 full spins) + random segment offset
    const extraSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const randomSegment = Math.floor(Math.random() * count);
    const segmentOffset = randomSegment * segmentAngle + segmentAngle / 2;

    const totalRotation = rotationRef.current + extraSpins + segmentOffset;
    rotationRef.current = totalRotation;
    setCurrentRotation(totalRotation);

    // After animation ends (4s), determine which prize landed
    setTimeout(() => {
      const normalizedAngle = totalRotation % 360;
      const winIndex = Math.floor(
        (count - Math.floor(normalizedAngle / segmentAngle)) % count,
      );
      onSpinEnd(prizes[winIndex]);
    }, 4100);
  }, [prizes, onSpinEnd]);

  useEffect(() => {
    if (isSpinning) {
      spin();
    }
  }, [isSpinning, spin]);

  const count = prizes.length;
  const segmentAngle = 360 / count;

  return (
    <div className="relative flex items-center justify-center">
      {/* ── Wheel ── */}
      <div
        className="ruleta-wheel aspect-square w-full max-w-[420px] rounded-full shadow-xl"
        style={{
          background: `conic-gradient(
            ${prizes.map((p, i) => {
              const startDeg = i * segmentAngle;
              const endDeg = (i + 1) * segmentAngle;
              return `${p.color} ${startDeg}deg ${endDeg}deg`;
            }).join(', ')}
          )`,
          transform: `rotate(${currentRotation}deg)`,
          transition: isSpinning
            ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
            : 'none',
          willChange: 'transform',
        }}
      >
        {/* ── Segment labels — radial, responsive ── */}
        {prizes.map((prize, i) => {
          const angle = i * segmentAngle + segmentAngle / 2;
          const isBottomHalf = angle > 90 && angle < 270;
          const isYellow = prize.color === '#E9C46A';
          return (
            <div
              key={prize.id}
              className="absolute inset-0 flex items-start justify-center"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <span
                className={`mt-[11%] block -translate-y-1/2 whitespace-nowrap text-[11px] font-bold uppercase leading-tight drop-shadow-md sm:text-xs md:text-sm ${
                  isBottomHalf ? 'rotate-180' : ''
                } ${isYellow ? 'text-gray-900' : 'text-white'}`}
              >
                {prize.label}
              </span>
            </div>
          );
        })}

        {/* ── Center hub ── */}
        <div className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg sm:h-20 sm:w-20">
          <img
            src="/images/stuttgart-ruleta.jpg"
            alt="Stuttgart"
            className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
          />
        </div>
      </div>

      {/* ── Pointer / Arrow ── */}
      <div className="absolute -top-1 left-1/2 z-20 -translate-x-1/2">
        <svg width="32" height="32" viewBox="0 0 32 32" className="drop-shadow-lg">
          <polygon points="16,0 4,28 28,28" fill="#FF6B6B" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
