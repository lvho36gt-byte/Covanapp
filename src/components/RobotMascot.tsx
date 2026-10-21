import React from 'react';

interface RobotMascotProps {
  expression?: 'happy' | 'thinking' | 'talking' | 'celebrating' | 'curious';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBubble?: boolean;
  bubbleText?: string;
  className?: string;
  onClick?: () => void;
}

export const RobotMascot: React.FC<RobotMascotProps> = ({
  expression = 'happy',
  size = 'md',
  showBubble = false,
  bubbleText = 'Chào bạn! Tớ là Robot Bạn Học AI!',
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`} onClick={onClick}>
      {showBubble && bubbleText && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-800 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-2xl shadow-md border border-sky-100 whitespace-nowrap z-20 animate-bounce">
          {bubbleText}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-sky-100 rotate-45"></div>
        </div>
      )}

      {/* Robot Body SVG with 3D cute aesthetic */}
      <div className={`${sizeClasses[size]} animate-float cursor-pointer transition-transform hover:scale-105 active:scale-95`}>
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Antenna */}
          <rect x="76" y="10" width="8" height="22" rx="4" fill="#64748B" />
          <circle cx="80" cy="10" r="10" fill="#FFD65A" className="animate-pulse" />
          <circle cx="80" cy="10" r="5" fill="#FFE896" />

          {/* Ears */}
          <rect x="18" y="55" width="12" height="26" rx="6" fill="#36B8C5" />
          <rect x="130" y="55" width="12" height="26" rx="6" fill="#36B8C5" />
          <circle cx="24" cy="68" r="3" fill="#FFFFFF" />
          <circle cx="136" cy="68" r="3" fill="#FFFFFF" />

          {/* Head */}
          <rect x="26" y="28" width="108" height="82" rx="28" fill="url(#headGradient)" stroke="#FFFFFF" strokeWidth="3" />
          
          {/* Visor / Screen */}
          <rect x="36" y="38" width="88" height="62" rx="20" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
          
          {/* Eyes & Expression */}
          {expression === 'happy' && (
            <>
              {/* Happy curved eyes */}
              <path d="M50 64C50 56 62 56 62 64" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
              <path d="M98 64C98 56 110 56 110 64" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
              {/* Cheeks */}
              <circle cx="48" cy="74" r="5" fill="#FFB9DC" opacity="0.8" />
              <circle cx="112" cy="74" r="5" fill="#FFB9DC" opacity="0.8" />
              {/* Smile */}
              <path d="M72 74 Q80 82 88 74" stroke="#FFD65A" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}

          {expression === 'thinking' && (
            <>
              {/* Looking up eyes */}
              <circle cx="56" cy="58" r="8" fill="#38BDF8" />
              <circle cx="58" cy="56" r="3" fill="#FFFFFF" />
              <circle cx="104" cy="58" r="8" fill="#38BDF8" />
              <circle cx="106" cy="56" r="3" fill="#FFFFFF" />
              {/* Thinking mouth */}
              <ellipse cx="80" cy="76" rx="5" ry="3" fill="#FFD65A" />
            </>
          )}

          {expression === 'talking' && (
            <>
              <circle cx="56" cy="62" r="7" fill="#38BDF8" />
              <circle cx="104" cy="62" r="7" fill="#38BDF8" />
              <path d="M72 72 Q80 86 88 72 Z" fill="#FFD65A" />
            </>
          )}

          {expression === 'celebrating' && (
            <>
              {/* Star eyes */}
              <text x="48" y="68" fontSize="18" fill="#FFD65A">★</text>
              <text x="96" y="68" fontSize="18" fill="#FFD65A">★</text>
              <path d="M70 73 Q80 85 90 73" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
              <circle cx="46" cy="74" r="6" fill="#FFB9DC" />
              <circle cx="114" cy="74" r="6" fill="#FFB9DC" />
            </>
          )}

          {expression === 'curious' && (
            <>
              <circle cx="56" cy="60" r="9" fill="#38BDF8" />
              <circle cx="104" cy="64" r="6" fill="#38BDF8" />
              <line x1="74" y1="75" x2="86" y2="75" stroke="#FFD65A" strokeWidth="3" strokeLinecap="round" />
            </>
          )}

          {/* Neck */}
          <rect x="70" y="110" width="20" height="8" rx="3" fill="#64748B" />

          {/* Body */}
          <rect x="42" y="116" width="76" height="40" rx="16" fill="url(#bodyGradient)" stroke="#FFFFFF" strokeWidth="2.5" />
          
          {/* Heart Emblem on chest */}
          <circle cx="80" cy="132" r="9" fill="#FF4785" />
          <path d="M76 130 C76 127 80 128 80 131 C80 128 84 127 84 130 C84 133 80 135 80 135 C80 135 76 133 76 130 Z" fill="#FFFFFF" />

          {/* Arms */}
          <rect x="22" y="122" width="16" height="12" rx="6" fill="#36B8C5" />
          <rect x="122" y="122" width="16" height="12" rx="6" fill="#36B8C5" />

          {/* Gradients */}
          <defs>
            <linearGradient id="headGradient" x1="26" y1="28" x2="134" y2="110" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E88E5" />
              <stop offset="1" stopColor="#1565C0" />
            </linearGradient>
            <linearGradient id="bodyGradient" x1="42" y1="116" x2="118" y2="156" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1765D1" />
              <stop offset="1" stopColor="#0D47A1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
