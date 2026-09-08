import { useCallback, useEffect, useRef, useState } from 'react';
import type { Prize } from '../types';

export const DEFAULT_PRIZES: Prize[] = [
  { id: '1', label: 'Agenda', color: '#3573FF', probability: 1 },
  { id: '2', label: 'Termo', color: '#20C8BE', probability: 1 },
  { id: '3', label: 'Sombrilla', color: '#FFB000', probability: 1 },
  { id: '4', label: 'Chaqueta cortavientos', color: '#F03E80', probability: 1 },
  { id: '5', label: 'Kit uniempresarial', color: '#5AC85A', probability: 1 },
  { id: '6', label: 'Media beca Virtual', color: '#8E50FF', probability: 1 },
  { id: '7', label: 'Beca Presencial', color: '#FF5A36', probability: 1 },
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

function pegPosition(index: number, total: number, cx: number, cy: number, radius: number) {
  const angle = ((index * 360) / total - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
}

function randomInt(max: number): number {
  if (max <= 0) return 0;
  const values = new Uint32Array(1);
  window.crypto.getRandomValues(values);
  return Math.floor((values[0] / (0xffffffff + 1)) * max);
}

export function RuletaWheel({ prizes, isSpinning, onSpinEnd }: RuletaWheelProps) {
  const rotationRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [pointerTick, setPointerTick] = useState(0);

  // Bigger viewBox = more room for labels
  const VB = 500;
  const CX = VB / 2;
  const CY = VB / 2;
  const OUTER_R = 210;
  const LABEL_R = 145;

  const spin = useCallback(() => {
    const n = prizes.length;
    const segDeg = 360 / n;
    const extra = (8 + randomInt(5)) * 360;
    const target = randomInt(n);

    // To land segment `target` under the pointer (top), rotate by (n - target) segments.
    const startRotation = rotationRef.current;
    const total = startRotation + extra + (n - target) * segDeg - segDeg / 2;
    const duration = 7400;
    let startTime: number | null = null;
    let lastPeg = Math.floor(startRotation / segDeg);
    let slowedDown = false;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentRotation = startRotation + (total - startRotation) * eased;
      const currentPeg = Math.floor(currentRotation / segDeg);

      if (currentPeg !== lastPeg) {
        lastPeg = currentPeg;
        setPointerTick((value) => value + 1);
      }

      if (!slowedDown && progress >= 0.7) {
        slowedDown = true;
        navigator.vibrate?.([8, 28, 8]);
      }

      setRotation(currentRotation);

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
        return;
      }

      rotationRef.current = total;
      navigator.vibrate?.(16);
      onSpinEnd(prizes[target]);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
  }, [prizes, onSpinEnd]);

  useEffect(() => {
    if (isSpinning) spin();
  }, [isSpinning, spin]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
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
          background: 'conic-gradient(from 90deg, rgba(53,115,255,0.24), rgba(32,200,190,0.22), rgba(255,176,0,0.25), rgba(240,62,128,0.22), rgba(142,80,255,0.22), rgba(255,90,54,0.25), rgba(53,115,255,0.24))',
          filter: 'blur(28px)',
        }}
      />

      {/* ── Wheel ── */}
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="relative z-10 h-[min(82vw,560px)] w-[min(82vw,560px)] drop-shadow-[0_22px_34px_rgba(15,39,71,0.28)] sm:h-[min(62vw,610px)] sm:w-[min(62vw,610px)] lg:h-[min(84vh,680px)] lg:w-[min(84vh,680px)]"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: 'none',
        }}
        role="img"
        aria-label="Ruleta de premios"
      >
        <defs>
          {prizes.map((p) => (
            <linearGradient key={p.id} id={`grad-${p.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="28%" stopColor={p.color} />
              <stop offset="100%" stopColor={p.color} stopOpacity="0.78" />
            </linearGradient>
          ))}
        </defs>

        {/* Outer decorative rings */}
        <circle cx={CX} cy={CY} r={OUTER_R + 16} fill="#fffaf1" stroke="#ff8f2b" strokeWidth="7" />
        <circle cx={CX} cy={CY} r={OUTER_R + 9} fill="none" stroke="#ffd166" strokeWidth="3" opacity={0.95} />
        <circle cx={CX} cy={CY} r={OUTER_R + 3} fill="none" stroke="#ffffff" strokeWidth="2" opacity={0.9} />

        {/* Physical wheel pegs: the flapper catches each boundary as it turns. */}
        {prizes.map((prize, index) => {
          const peg = pegPosition(index, prizes.length, CX, CY, OUTER_R + 8);
          return <circle key={`peg-${prize.id}`} cx={peg.x} cy={peg.y} r="5.5" fill="#fff8e8" stroke="#ff8f2b" strokeWidth="2" />;
        })}

        {/* Segments */}
        {prizes.map((p, i) => (
          <g key={p.id}>
            <path
              d={segmentPath(i, prizes.length, CX, CY, OUTER_R)}
              fill={`url(#grad-${p.id})`}
              stroke="#fff8e8"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d={segmentPath(i, prizes.length, CX, CY, OUTER_R - 13)}
              fill="none"
              stroke="rgba(255,255,255,0.38)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <text
              transform={labelTransform(i, prizes.length, CX, CY, LABEL_R)}
              fill="#fffdf9"
              fontSize={p.label.length > 20 ? 11 : p.label.length > 14 ? 13 : 16}
              fontWeight="800"
              textAnchor="middle"
              dominantBaseline="central"
              className="pointer-events-none select-none"
              style={{ paintOrder: 'stroke', stroke: 'rgba(14, 33, 63, 0.55)', strokeWidth: 2.5 }}
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
      <div className="absolute z-20 flex h-[78px] w-[78px] items-center justify-center overflow-hidden rounded-full border-[6px] border-[#fff7df] bg-[#ff7a2f] shadow-[0_0_0_5px_#ffbc42,0_0_30px_rgba(255,90,54,0.48)] sm:h-[104px] sm:w-[104px]">
        <img
          src="/images/stuttgart-ruleta.png"
          alt="Stuttgart"
          className="h-full w-full rounded-full object-cover"
        />
      </div>

      {/* ── Pointer (top) ── */}
      <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1">
        <svg
          key={pointerTick}
          className={isSpinning ? 'roulette-pointer roulette-pointer--tick' : 'roulette-pointer'}
          width="38"
          height="46"
          viewBox="0 0 38 46"
          aria-hidden="true"
        >
          <circle cx="19" cy="5" r="4" fill="#fff8e8" stroke="#ff5a36" strokeWidth="2" />
          <polygon points="19,45 2,7 36,7" fill="#ff5a36" stroke="#fff8e8" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
