import { useCallback, useEffect, useRef, useState } from 'react';
import type { Prize } from '../types';

interface RuletaWheelProps {
  prizes: Prize[];
  isSpinning: boolean;
  onSpinEnd: (prize: Prize) => void;
}

export function RuletaWheel({ prizes, isSpinning, onSpinEnd }: RuletaWheelProps) {
  const rotationRef = useRef(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  const spin = useCallback(() => {
    const count = prizes.length;
    const extraSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const segmentAngle = 360 / count;
    const randomSegment = Math.floor(Math.random() * count);
    
    // Girar para que el puntero quede en el medio del segmento ganador
    const totalRotation = rotationRef.current + extraSpins + (randomSegment * segmentAngle) + (segmentAngle / 2);
    rotationRef.current = totalRotation;
    setCurrentRotation(totalRotation);

    setTimeout(() => {
      onSpinEnd(prizes[randomSegment]);
    }, 4100);
  }, [prizes, onSpinEnd]);

  useEffect(() => {
    if (isSpinning) spin();
  }, [isSpinning, spin]);

  // Generar path para cada segmento SVG
  const getPath = (i: number, count: number) => {
    const angle = (360 / count);
    const startAngle = i * angle;
    const endAngle = (i + 1) * angle;
    
    const x1 = 50 + 45 * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = 50 + 45 * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = 50 + 45 * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = 50 + 45 * Math.sin((endAngle - 90) * Math.PI / 180);
    
    return `M 50 50 L ${x1} ${y1} A 45 45 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="w-full max-w-[420px] drop-shadow-xl transition-transform duration-[4000ms] cubic-bezier(0.17,0.67,0.12,0.99)"
        style={{ transform: `rotate(${currentRotation}deg)` }}
      >
        {prizes.map((p, i) => (
          <g key={p.id}>
            <path d={getPath(i, prizes.length)} fill={p.color} stroke="white" strokeWidth="0.5" />
            <text
              x="50"
              y="20"
              fill="white"
              fontSize="6"
              fontWeight="bold"
              textAnchor="middle"
              transform={`rotate(${(i + 0.5) * (360 / prizes.length)} 50 50)`}
              className="pointer-events-none drop-shadow-md"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
      
      {/* Centro */}
      <div className="absolute h-16 w-16 rounded-full border-4 border-white bg-white shadow-lg sm:h-20 sm:w-20">
        <img src="/images/stuttgart-ruleta.jpg" className="h-full w-full rounded-full object-cover" />
      </div>

      {/* Puntero */}
      <div className="absolute -top-2 z-20">
        <div className="h-0 w-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-primary" />
      </div>
    </div>
  );
}