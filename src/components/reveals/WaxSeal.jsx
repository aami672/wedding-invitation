import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export default function WaxSeal({ onReveal, initials = 'A & S', names = 'Shanaya & Aarav' }) {
  const [cracked, setCracked] = useState(false);

  const handleClick = () => {
    if (cracked) return;
    setCracked(true);
    soundManager.playSealBreakSound();
    if (onReveal) {
      setTimeout(onReveal, 800);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 select-none bg-[#FDFBF7] p-6 flex flex-col items-center justify-center text-center">
      {/* Background letterpress texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

      {/* Envelope Flap Triangle */}
      <div
        className={`absolute top-0 left-0 right-0 h-1/2 bg-[#F7F2E8] border-b-2 border-[#E6D5BF] transition-all duration-700 origin-top z-10 flex items-end justify-center pb-2 shadow-sm ${
          cracked ? '-rotate-180 opacity-0 pointer-events-none' : ''
        }`}
      >
        <div className="text-[10px] tracking-[0.25em] text-[#8B6F47] uppercase font-semibold">
          Confidential & Royal
        </div>
      </div>

      {/* Inside Letter Content revealed */}
      <div className={`transition-all duration-700 z-0 space-y-2 ${cracked ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-50 translate-y-2'}`}>
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#8B6F47] font-bold">You Are Cordially Invited</p>
        <h3 className="font-serif text-2xl font-light text-[#2B1E17]">{names}</h3>
        <p className="text-xs text-neutral-600 font-light max-w-xs mx-auto">
          The honour of your gracious presence is requested at our wedding celebrations.
        </p>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.2em] font-bold uppercase text-[#8B6F47] border border-[#C5A880] bg-[#FAF5ED] px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-[#C5A880]" />
            Seal Broken · Invitation Open
          </span>
        </div>
      </div>

      {/* Wax Seal Button */}
      {!cracked ? (
        <button
          type="button"
          onClick={handleClick}
          className="absolute z-20 group cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-105 active:scale-95"
          title="Click to break the wax seal"
        >
          {/* Wax Stamp Body */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#8B1E1E] via-[#A82828] to-[#601212] shadow-[0_10px_25px_rgba(96,18,18,0.5)] border-2 border-[#D4AF37]/80 flex items-center justify-center p-1">
            <div className="w-full h-full rounded-full border border-dashed border-[#FFD700]/60 flex items-center justify-center bg-gradient-to-t from-black/20 to-transparent">
              <span className="font-royal text-gold-200 text-sm font-bold tracking-widest drop-shadow-md text-[#FFF8DC]">
                {initials}
              </span>
            </div>
            <span className="absolute -bottom-6 whitespace-nowrap text-[10px] tracking-[0.2em] uppercase font-bold text-[#8B6F47] bg-[#FDFBF7]/90 px-2 py-0.5 rounded shadow">
              Tap to Break Seal
            </span>
          </div>
        </button>
      ) : null}
    </div>
  );
}
