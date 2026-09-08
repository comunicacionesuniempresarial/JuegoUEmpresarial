import { useCallback, useEffect, useRef, useState } from 'react';
import type { Prize } from '../types';

export const DEFAULT_PRIZES: Prize[] = [
  { id: '1', label: 'Premio 1', color: '#e85d4a', probability: 1 },
  { id: '2', label: 'Premio 2', color: '#277f86', probability: 1 },
  { id: '3', label: 'Premio 3', color: '#d6952d', probability: 1 },
  { id: '4', label: 'Premio 4', color: '#5267a7', probability: 1 },
  { id: '5', label: 'Premio 5', color: '#c65370', probability: 1 },
  { id: '6', label: 'Premio 6', color: '#8d6b4c', probability: 1 },
  { id: '7', label: 'Premio 7', color: '#5b9b72', probability: 1 },
];

interface RuletaWheelProps {
  prizes: Prize[];
  isSpinning: boolean;
  onSpinEnd: (prize: Prize) => void;
}

function segmentPath(
  index: number,
  total: number,
  cx: number,
  cy: number,
  outerR: number,
): string {
  const angle = (2 * Math.PI) / total;
  const start = index * angle - Math.PI / 2;
  const end = (index + 1) * angle - Math.PI / 2;
  const x1 = cx + outerR * Math.cos(start);
  const y1 = cy + outerR * Math.sin(start);
  const x2 = cx + outerR * Math.cos(end);
  const y2 = cy + outerR * Math.sin(end);
  const largeArc = angle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

function labelTransform(
  index: number,
  total: number,
  cx: number,
  cy: number,
  radius: number,
): string {
  const angleDeg = ((index + 0.5) * 360) / total - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  const lx = cx + radius * Math.cos(angleRad);
  const ly = cy + radius * Math.sin(angleRad);
  // Keep every label horizontal: it is easier to scan and prevents upside-down
  // text on the lower half of the wheel.
  return `translate(${lx}, ${ly})`;
}

function labelLines(label: string): string[] {
  const words = label.split(' ');
  if (words.length < 2) return [label];

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')];
}

export function RuletaWheel({ prizes, isSpinning, onSpinEnd }: RuletaWheelProps) {
  const rotationRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const [rotation, setRotation] = useState(0);

  // Bigger viewBox = more room for labels
  const VB = 500;
  const CX = VB / 2;
  const CY = VB / 2;
  const OUTER_R = 210;
  const LABEL_R = 145;

  const spin = useCallback(() => {
    const n = prizes.length;
    const segDeg = 360 / n;
    const extra = (6 + Math.floor(Math.random() * 5)) * 360;
    const target = Math.floor(Math.random() * n);

    // To land segment `target` under the pointer (top), rotate by (n - target) segments.
    const total = rotationRef.current + extra + (n - target) * segDeg - segDeg / 2;

    rotationRef.current = total;
    setRotation(total);

    timeoutRef.current = window.setTimeout(() => {
      onSpinEnd(prizes[target]);
    }, 4200);
  }, [prizes, onSpinEnd]);

  useEffect(() => {
    if (isSpinning) spin();
  }, [isSpinning, spin]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow behind the wheel */}
      <div
        className="absolute rounded-full"
        style={{
          width: 'calc(100% + 24px)',
          height: 'calc(100% + 24px)',
          background: 'radial-gradient(circle, rgba(232,93,74,0.16) 0%, rgba(22,124,128,0.12) 45%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* ── Wheel ── */}
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="relative z-10 h-[min(78vw,520px)] w-[min(78vw,520px)] drop-shadow-[0_18px_28px_rgba(70,55,40,0.18)] sm:h-[min(58vw,560px)] sm:w-[min(58vw,560px)] lg:h-[min(82vh,620px)] lg:w-[min(82vh,620px)]"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? 'transform 4.2s cubic-bezier(0.17,0.67,0.12,0.99)'
            : 'none',
        }}
        role="img"
        aria-label="Ruleta de premios"
      >
        <defs>
          {prizes.map((p) => (
            <linearGradient key={p.id} id={`grad-${p.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={p.color} />
              <stop offset="100%" stopColor={p.color} stopOpacity="0.75" />
            </linearGradient>
          ))}
        </defs>

        {/* Outer decorative rings */}
        <circle cx={CX} cy={CY} r={OUTER_R + 12} fill="#fffdf9" stroke="#d7c8b7" strokeWidth="5" />
        <circle cx={CX} cy={CY} r={OUTER_R + 6} fill="none" stroke="#ffffff" strokeWidth="1.5" opacity={0.8} />

        {/* Segments */}
        {prizes.map((p, i) => (
          <g key={p.id}>
            <path
              d={segmentPath(i, prizes.length, CX, CY, OUTER_R)}
              fill={`url(#grad-${p.id})`}
              stroke="#fffdf9"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <text
              transform={labelTransform(i, prizes.length, CX, CY, LABEL_R)}
              fill="#fffdf9"
              fontSize={p.label.length > 20 ? 12 : 15}
              fontWeight="800"
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none select-none"
              style={{ paintOrder: 'stroke', stroke: 'rgba(35, 43, 49, 0.28)', strokeWidth: 2 }}
            >
              {labelLines(p.label).map((line, lineIndex) => (
                <tspan key={line} x="0" dy={lineIndex === 0 ? (labelLines(p.label).length === 1 ? 0 : -8) : 16}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}
      </svg>

      {/* ── Center hub ── */}
      <div className="absolute z-20 flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border-[5px] border-[#fffdf9] bg-[#fffdf9] shadow-[0_0_24px_rgba(70,55,40,0.28)] sm:h-[96px] sm:w-[96px]">
        <img
          src="/images/stuttgart-ruleta.jpg"
          alt="Stuttgart"
          className="h-full w-full rounded-full object-cover"
        />
      </div>

      {/* ── Pointer (top) ── */}
      <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1">
        <svg width="34" height="40" viewBox="0 0 34 40">
          <polygon points="17,40 0,0 34,0" fill="#e85d4a" stroke="#fffdf9" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
