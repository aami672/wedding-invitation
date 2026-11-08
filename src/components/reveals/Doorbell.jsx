import React, { useState } from 'react';
import { Bell, Sparkles, Home } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export default function Doorbell({ onReveal, names = 'The Sharma Family', title = 'Griha Pravesh' }) {
  const [rung, setRung] = useState(false);

  const handleClick = () => {
    if (rung) return;
    setRung(true);
    soundManager.playDoorbellSound();
    if (onReveal) {
      setTimeout(onReveal, 900);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5A880]/50 select-none bg-gradient-to-br from-[#2E2018] via-[#1D140F] to-[#140D0A] p-6 flex flex-col items-center justify-center text-center text-[#F5EBDD]">
      {/* Interior warm home glow */}
      <div className={`transition-all duration-1000 z-0 space-y-3 ${rung ? 'scale-100 opacity-100' : 'scale-90 opacity-40'}`}>
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
          <Home className="w-6 h-6" />
        </div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-semibold">{title}</p>
        <h3 className="font-serif text-2xl font-light text-[#FDFBF7]">{names}</h3>
        <p className="text-xs text-[#E6D5BF]/80 font-light">Welcome to our new haven. Come celebrate our Griha Pravesh with us!</p>
        <div>
          <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.2em] font-bold uppercase text-amber-300 border border-amber-400/40 bg-amber-950/60 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Doors Open · Come on In!
          </span>
        </div>
      </div>

      {/* Door panels overlay */}
      {!rung && (
        <div className="absolute inset-0 z-10 flex">
          {/* Left Door */}
          <div className="w-1/2 h-full bg-[#3D2517] border-r border-[#26170E] flex flex-col justify-center items-end pr-2 shadow-inner">
            <div className="w-2.5 h-16 bg-[#C5A880] rounded-sm shadow-md" />
          </div>
          {/* Right Door */}
          <div className="w-1/2 h-full bg-[#3D2517] border-l border-[#26170E] flex flex-col justify-center items-start pl-2 shadow-inner">
            <div className="w-2.5 h-16 bg-[#C5A880] rounded-sm shadow-md" />
          </div>

          {/* Doorbell Plaque in center */}
          <button
            type="button"
            onClick={handleClick}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-24 bg-gradient-to-b from-[#2B1E17] to-[#120B07] rounded-xl border border-[#D4AF37] shadow-[0_8px_20px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-2 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.8)] flex items-center justify-center text-stone-900 animate-pulse">
              <Bell className="w-4 h-4 fill-current" />
            </div>
            <span className="text-[8px] tracking-wider uppercase font-bold text-amber-200 mt-2">Ring</span>
          </button>
        </div>
      )}
    </div>
  );
}
