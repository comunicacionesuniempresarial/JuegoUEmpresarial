import { useEffect, useState } from 'react';

type Pose = 'open' | 'pointing' | 'thumbs-up';

interface StudgardCompanionProps {
  message: string;
  pose?: Pose;
  visible?: boolean;
  autoHideMs?: number;
}

const POSE_IMAGES: Record<Pose, string> = {
  open: '/images/studgard-open.png',
  pointing: '/images/studgard-pointing.png',
  'thumbs-up': '/images/studgard-thumbs-up.png',
};

export function StudgardCompanion({
  message,
  pose = 'thumbs-up',
  visible = true,
  autoHideMs = 5000,
}: StudgardCompanionProps) {
  const [show, setShow] = useState(visible);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    setShow(visible);
    setShowBubble(visible);

    if (visible && autoHideMs > 0) {
      const timer = setTimeout(() => {
        setShowBubble(false);
        setTimeout(() => setShow(false), 300); // wait for fade-out
      }, autoHideMs);
      return () => clearTimeout(timer);
    }
  }, [visible, message, autoHideMs]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-end gap-2 transition-opacity duration-300 sm:bottom-6 sm:right-6 ${
        showBubble ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Speech Bubble */}
      <div className="relative rounded-xl bg-white px-4 py-2 shadow-lg border border-gray-100 max-w-[180px] sm:max-w-[200px]">
        <p className="text-sm font-medium text-gray-800">{message}</p>
        {/* Bubble tail */}
        <div className="absolute -bottom-2 right-6 h-0 w-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
      </div>

      {/* Studgard Image — responsive sizes per spec */}
      <img
        src={POSE_IMAGES[pose]}
        alt="Studgard companion"
        className="h-10 w-auto drop-shadow-md sm:h-12 md:h-16 lg:h-20"
      />
    </div>
  );
}
