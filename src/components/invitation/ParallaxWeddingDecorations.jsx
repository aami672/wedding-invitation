import React, { useState, useEffect, useRef } from 'react';

/**
 * PARALLAX WEDDING DECORATIONS
 * Authentic Indian wedding SVGs (Marigold garlands, temple bells, floating petals,
 * mangal kalash, shehnai & dholak, paisley motifs) that animate with smooth
 * 60fps parallax depth as the user scrolls on mobile.
 */

// 1. Single Marigold Flower SVG
export function MarigoldFlower({ size = 28, className = '' }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none">
      <defs>
        <radialGradient id={`marigold-grad-${size}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </radialGradient>
      </defs>
      {/* Outer Ruffled Petals */}
      {Array.from({ length: 12 }).map((_, i) => (
        <circle 
          key={i} 
          cx={50 + 30 * Math.cos((i * 30 * Math.PI) / 180)} 
          cy={50 + 30 * Math.sin((i * 30 * Math.PI) / 180)} 
          r="14" 
          fill="#F59E0B" 
          opacity="0.9"
        />
      ))}
      {/* Mid Layer Petals */}
      {Array.from({ length: 10 }).map((_, i) => (
        <circle 
          key={i} 
          cx={50 + 19 * Math.cos((i * 36 * Math.PI) / 180)} 
          cy={50 + 19 * Math.sin((i * 36 * Math.PI) / 180)} 
          r="11" 
          fill="#EA580C" 
          opacity="0.95"
        />
      ))}
      {/* Center Core */}
      <circle cx="50" cy="50" r="14" fill={`url(#marigold-grad-${size})`} />
      <circle cx="50" cy="50" r="7" fill="#FBBF24" />
      <circle cx="50" cy="50" r="3" fill="#D97706" />
    </svg>
  );
}

// 2. Mango Leaf SVG
export function MangoLeaf({ width = 16, height = 26, rotate = 0, className = '' }) {
  return (
    <svg 
      viewBox="0 0 40 70" 
      width={width} 
      height={height} 
      style={{ transform: `rotate(${rotate}deg)` }}
      className={className} 
      fill="none"
    >
      <path 
        d="M20,2 C32,20 38,45 20,68 C2,45 8,20 20,2 Z" 
        fill="#15803D" 
        stroke="#166534" 
        strokeWidth="1.5" 
      />
      <path d="M20,5 L20,65" stroke="#86EFAC" strokeWidth="1.2" opacity="0.6" />
      <path d="M20,25 Q28,20 32,28 M20,40 Q28,35 30,44 M20,25 Q12,20 8,28 M20,40 Q12,35 10,44" stroke="#86EFAC" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

// 3. Hanging Brass Temple Bell SVG
export function TempleBellSVG({ size = 38, className = '' }) {
  return (
    <svg viewBox="0 0 80 150" width={size} height={size * 1.875} className={className} fill="none">
      <defs>
        <linearGradient id="bell-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
      </defs>
      {/* Suspension Chain */}
      <line x1="40" y1="0" x2="40" y2="48" stroke="#D97706" strokeWidth="3" strokeDasharray="5,4" />
      <circle cx="40" cy="12" r="3" fill="#B45309" />
      <circle cx="40" cy="28" r="3" fill="#B45309" />
      <circle cx="40" cy="44" r="3" fill="#B45309" />
      
      {/* Bell Top Crown */}
      <ellipse cx="40" cy="50" rx="9" ry="4" fill="#B45309" />
      
      {/* Bell Dome */}
      <path 
        d="M24,53 C24,42 56,42 56,53 C56,70 66,95 68,102 C69,108 11,108 12,102 C14,95 24,70 24,53 Z" 
        fill="url(#bell-grad)" 
        stroke="#B45309" 
        strokeWidth="2" 
      />
      {/* Bell Rim Ribs */}
      <ellipse cx="40" cy="104" rx="28" ry="4.5" fill="#B45309" opacity="0.4" />
      <ellipse cx="40" cy="102" rx="27" ry="4" stroke="#78350F" strokeWidth="1.5" />
      
      {/* Clapper / Tongue */}
      <circle cx="40" cy="112" r="6" fill="#78350F" />
      <path d="M38,118 L42,118 L41,135 L39,135 Z" fill="#92400E" />
      <circle cx="40" cy="138" r="4" fill="#EA580C" />
    </svg>
  );
}

// 4. Auspicious Mangal Kalash SVG
export function MangalKalashSVG({ size = 80, className = '' }) {
  return (
    <svg viewBox="0 0 120 140" width={size} height={size * 1.16} className={className} fill="none">
      <defs>
        <linearGradient id="kalash-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      {/* Pot Body */}
      <ellipse cx="60" cy="98" rx="36" ry="32" fill="url(#kalash-metal)" stroke="#92400E" strokeWidth="2" />
      <ellipse cx="60" cy="68" rx="20" ry="5" fill="#F59E0B" stroke="#92400E" strokeWidth="1.5" />
      
      {/* Red Sacred Thread (Mauli / Kalava) around Neck */}
      <path d="M42,75 Q60,82 78,75 Q60,70 42,75" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
      <line x1="60" y1="75" x2="60" y2="92" stroke="#DC2626" strokeWidth="2" strokeDasharray="3,2" />

      {/* Mango Leaves (Amra Pallav) */}
      <path d="M60,42 C45,55 35,66 44,68 C52,68 58,56 60,42 Z" fill="#16A34A" stroke="#14532D" strokeWidth="1" />
      <path d="M60,42 C75,55 85,66 76,68 C68,68 62,56 60,42 Z" fill="#16A34A" stroke="#14532D" strokeWidth="1" />
      <path d="M60,35 C52,48 48,60 55,62 C62,62 62,48 60,35 Z" fill="#22C55E" />
      <path d="M60,35 C68,48 72,60 65,62 C58,62 58,48 60,35 Z" fill="#22C55E" />

      {/* Coconut (Nariyal) with Tilak */}
      <circle cx="60" cy="52" r="16" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
      <path d="M50,42 Q60,32 70,42" stroke="#451A03" strokeWidth="2" fill="none" />
      {/* Red Swastik / Tilak */}
      <circle cx="60" cy="50" r="4.5" fill="#DC2626" />
      <circle cx="60" cy="50" r="2" fill="#FDE047" />
    </svg>
  );
}

// 5. Wedding Shehnai & Dholak SVG
export function ShehnaiDholakSVG({ size = 95, className = '' }) {
  return (
    <svg viewBox="0 0 140 120" width={size} height={size * 0.857} className={className} fill="none">
      {/* Shehnai at Angle */}
      <g transform="rotate(-28 60 55)">
        <polygon points="15,55 85,52 105,38 105,72 85,58 15,55" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        <ellipse cx="105" cy="55" rx="4" ry="17" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="38" cy="55" r="2" fill="#FEF08A" />
        <circle cx="52" cy="55" r="2" fill="#FEF08A" />
        <circle cx="66" cy="55" r="2" fill="#FEF08A" />
        <circle cx="80" cy="55" r="2" fill="#FEF08A" />
      </g>
      {/* Festive Dholak */}
      <g transform="translate(42, 42) rotate(14)">
        <ellipse cx="40" cy="30" rx="32" ry="19" fill="#92400E" stroke="#78350F" strokeWidth="2" />
        <ellipse cx="10" cy="30" rx="6" ry="17" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.5" />
        <ellipse cx="70" cy="30" rx="6" ry="17" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.5" />
        {/* Leather Lacing W */}
        <path d="M10,18 L40,46 L70,18 M10,42 L40,14 L70,42" stroke="#FEF3C7" strokeWidth="1.4" fill="none" />
        <circle cx="40" cy="30" r="4.5" fill="#B45309" />
      </g>
    </svg>
  );
}

// 6. Paisley / Kalka Henna Motif SVG
export function PaisleyMotifSVG({ size = 80, className = '' }) {
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} className={className} fill="none">
      <path 
        d="M50,12 C78,12 90,38 86,65 C82,96 55,112 34,106 C12,100 6,74 18,48 C27,33 38,38 45,41 C40,28 35,22 50,12 Z" 
        fill="#FBBF24" 
        fillOpacity="0.18" 
        stroke="#D97706" 
        strokeWidth="2" 
      />
      <circle cx="46" cy="72" r="14" fill="#F59E0B" fillOpacity="0.25" stroke="#B45309" strokeWidth="1.5" strokeDasharray="3,2" />
      <circle cx="46" cy="72" r="6" fill="#EA580C" fillOpacity="0.35" />
      <circle cx="68" cy="48" r="3" fill="#D97706" fillOpacity="0.5" />
      <circle cx="34" cy="46" r="3" fill="#D97706" fillOpacity="0.5" />
      <circle cx="30" cy="88" r="3" fill="#D97706" fillOpacity="0.5" />
    </svg>
  );
}

// 7. Individual Drifting Petal SVG
function FloatingPetalItem({ style, type = 'marigold' }) {
  if (type === 'rose') {
    return (
      <div style={style} className="pointer-events-none select-none transition-transform ease-out will-change-transform">
        <svg viewBox="0 0 30 35" width="18" height="21" fill="none">
          <path d="M15,2 C25,2 29,15 26,26 C23,34 7,34 4,26 C1,15 5,2 15,2 Z" fill="#FB7185" fillOpacity="0.85" />
          <path d="M15,6 C21,6 23,16 21,24" stroke="#F43F5E" strokeWidth="0.8" opacity="0.6" />
        </svg>
      </div>
    );
  }
  if (type === 'jasmine') {
    return (
      <div style={style} className="pointer-events-none select-none transition-transform ease-out will-change-transform">
        <svg viewBox="0 0 25 25" width="15" height="15" fill="none">
          <circle cx="12.5" cy="12.5" r="3" fill="#FDE047" />
          {Array.from({ length: 5 }).map((_, i) => (
            <ellipse 
              key={i} 
              cx={12.5 + 6.5 * Math.cos((i * 72 * Math.PI) / 180)} 
              cy={12.5 + 6.5 * Math.sin((i * 72 * Math.PI) / 180)} 
              rx="4.5" 
              ry="2.5" 
              fill="#FFFFFF" 
              opacity="0.95"
              stroke="#FEF08A"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>
    );
  }
  // Marigold Petal
  return (
    <div style={style} className="pointer-events-none select-none transition-transform ease-out will-change-transform">
      <svg viewBox="0 0 24 30" width="16" height="20" fill="none">
        <path d="M12,1 C20,8 22,22 12,29 C2,22 4,8 12,1 Z" fill="#F59E0B" fillOpacity="0.88" />
        <path d="M12,4 L12,26" stroke="#EA580C" strokeWidth="1" opacity="0.7" />
      </svg>
    </div>
  );
}

/**
 * MAIN PARALLAX WEDDING DECORATIONS COMPONENT
 * Hooks into scroll events from either the studio simulator container (.overflow-y-auto)
 * or the window, applying GPU-accelerated parallax translation to SVGs.
 */
export function ParallaxWeddingDecorations() {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Detect if inside Studio Simulator (.overflow-y-auto) or window
    const scrollParent = el.closest('.overflow-y-auto') || window;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = scrollParent === window 
            ? window.scrollY || window.pageYOffset 
            : scrollParent.scrollTop;
          setScrollY(currentY);
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollParent.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => scrollParent.removeEventListener('scroll', handleScroll);
  }, []);

  // Pre-calculated petal offsets for natural organic distribution
  const petals = [
    { top: 120, left: '6%', type: 'marigold', speed: 0.18, rotSpeed: 0.15, initialRot: 15 },
    { top: 280, right: '5%', type: 'rose', speed: 0.28, rotSpeed: -0.2, initialRot: -30 },
    { top: 480, left: '4%', type: 'jasmine', speed: 0.12, rotSpeed: 0.1, initialRot: 45 },
    { top: 720, right: '7%', type: 'marigold', speed: 0.22, rotSpeed: 0.25, initialRot: -10 },
    { top: 960, left: '5%', type: 'rose', speed: 0.32, rotSpeed: -0.15, initialRot: 60 },
    { top: 1250, right: '4%', type: 'jasmine', speed: 0.16, rotSpeed: 0.12, initialRot: -20 },
    { top: 1540, left: '6%', type: 'marigold', speed: 0.24, rotSpeed: 0.2, initialRot: 35 },
    { top: 1850, right: '6%', type: 'rose', speed: 0.35, rotSpeed: -0.22, initialRot: -50 },
    { top: 2200, left: '5%', type: 'jasmine', speed: 0.14, rotSpeed: 0.18, initialRot: 25 },
    { top: 2500, right: '5%', type: 'marigold', speed: 0.26, rotSpeed: -0.16, initialRot: -15 },
  ];

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-15"
      aria-hidden="true"
    >
      {/* 1. TOP HANGING BRASS TEMPLE BELLS WITH PARALLAX & SWAY */}
      <div 
        className="absolute top-2 left-1.5 transition-transform ease-out duration-100 will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.09}px, 0)` }}
      >
        <div className="animate-sway origin-top">
          <TempleBellSVG size={28} />
        </div>
      </div>

      <div 
        className="absolute top-2 right-1.5 transition-transform ease-out duration-100 will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.09}px, 0)` }}
      >
        <div className="animate-sway origin-top" style={{ animationDelay: '0.8s' }}>
          <TempleBellSVG size={28} />
        </div>
      </div>

      {/* 2. DRAPED VERTICAL SIDE MARIGOLD & MANGO LEAF GARLANDS */}
      {/* Left Vertical Garland Chain */}
      <div 
        className="absolute top-16 left-0.5 flex flex-col items-center gap-6 opacity-85 transition-transform ease-out duration-100 will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.06}px, 0)` }}
      >
        <div className="flex flex-col items-center">
          <MarigoldFlower size={20} />
          <MangoLeaf width={12} height={20} rotate={-15} className="-mt-1" />
        </div>
        <div className="flex flex-col items-center">
          <MarigoldFlower size={18} />
          <MangoLeaf width={12} height={20} rotate={15} className="-mt-1" />
        </div>
        <div className="flex flex-col items-center">
          <MarigoldFlower size={20} />
          <MangoLeaf width={12} height={20} rotate={-10} className="-mt-1" />
        </div>
        <div className="flex flex-col items-center">
          <MarigoldFlower size={18} />
          <MangoLeaf width={12} height={20} rotate={12} className="-mt-1" />
        </div>
      </div>

      {/* Right Vertical Garland Chain */}
      <div 
        className="absolute top-16 right-0.5 flex flex-col items-center gap-6 opacity-85 transition-transform ease-out duration-100 will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.06}px, 0)` }}
      >
        <div className="flex flex-col items-center">
          <MarigoldFlower size={20} />
          <MangoLeaf width={12} height={20} rotate={15} className="-mt-1" />
        </div>
        <div className="flex flex-col items-center">
          <MarigoldFlower size={18} />
          <MangoLeaf width={12} height={20} rotate={-15} className="-mt-1" />
        </div>
        <div className="flex flex-col items-center">
          <MarigoldFlower size={20} />
          <MangoLeaf width={12} height={20} rotate={12} className="-mt-1" />
        </div>
        <div className="flex flex-col items-center">
          <MarigoldFlower size={18} />
          <MangoLeaf width={12} height={20} rotate={-10} className="-mt-1" />
        </div>
      </div>

      {/* 3. AUSPICIOUS WATERMARK MOTIFS AT KEY SECTION POSITIONS */}
      {/* Mangal Kalash near Date & Calendar */}
      <div 
        className="absolute top-[680px] -left-6 opacity-20 transition-transform ease-out duration-150 will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.08}px, 0) rotate(-8deg)` }}
      >
        <MangalKalashSVG size={74} />
      </div>

      {/* Paisley Motif near Our Story */}
      <div 
        className="absolute top-[1020px] -right-5 opacity-20 transition-transform ease-out duration-150 will-change-transform"
        style={{ transform: `translate3d(0, ${-scrollY * 0.06}px, 0) rotate(12deg)` }}
      >
        <PaisleyMotifSVG size={70} />
      </div>

      {/* Shehnai & Dholak near Celebrations / Programme */}
      <div 
        className="absolute top-[1520px] -left-8 opacity-20 transition-transform ease-out duration-150 will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.07}px, 0) rotate(-15deg)` }}
      >
        <ShehnaiDholakSVG size={85} />
      </div>

      {/* Paisley Motif near Memories Gallery */}
      <div 
        className="absolute top-[2150px] -right-6 opacity-20 transition-transform ease-out duration-150 will-change-transform"
        style={{ transform: `translate3d(0, ${-scrollY * 0.05}px, 0) rotate(-10deg)` }}
      >
        <PaisleyMotifSVG size={68} />
      </div>

      {/* 4. SCATTERED MARIGOLD & ROSE PETALS WITH DYNAMIC DEPTH PARALLAX */}
      {petals.map((p, idx) => {
        const translateY = scrollY * p.speed;
        const currentRot = p.initialRot + scrollY * p.rotSpeed;
        const swayX = Math.sin((scrollY * 0.008) + idx) * 6;

        return (
          <div
            key={idx}
            className="absolute"
            style={{
              top: `${p.top}px`,
              left: p.left,
              right: p.right,
              transform: `translate3d(${swayX}px, ${translateY}px, 0) rotate(${currentRot}deg)`,
            }}
          >
            <FloatingPetalItem type={p.type} />
          </div>
        );
      })}
    </div>
  );
}
