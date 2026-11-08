import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export default function RingBox({ onReveal, initials = 'A & S', names = 'Shanaya & Aarav' }) {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    if (opened) return;
    setOpened(true);
    soundManager.playBoxOpenSound();
    if (onReveal) {
      setTimeout(onReveal, 800);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5A880]/50 select-none bg-gradient-to-b from-[#1A0E13] via-[#2A1520] to-[#12080D] p-6 flex flex-col items-center justify-center text-center text-[#F5EBDD]">
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_0.8px,transparent_0.8px)] bg-[size:20px_20px] opacity-15 pointer-events-none" />

      {/* Inside Velvet Cushion with Rings */}
      <div className={`transition-all duration-700 z-0 space-y-3 ${opened ? 'scale-100 opacity-100' : 'scale-90 opacity-40'}`}>
        {/* Interlocking Rings SVG */}
        <div className="flex justify-center items-center -space-x-3 my-2">
          <div className="w-12 h-12 rounded-full border-4 border-yellow-400/90 shadow-[0_0_15px_rgba(255,215,0,0.6)] flex items-center justify-center text-[9px] font-bold text-yellow-200">
            {initials.split('&')[0]?.trim() || 'A'}
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.6)] flex items-center justify-center text-[9px] font-bold text-amber-100">
            {initials.split('&')[1]?.trim() || 'S'}
          </div>
        </div>

        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-300 font-semibold">We Said Yes</p>
        <h3 className="font-serif text-2xl font-light text-[#FDFBF7]">{names}</h3>
        <p className="text-xs text-[#E6D5BF]/80 font-light">Join us to celebrate our engagement and the start of forever.</p>
        <div>
          <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.2em] font-bold uppercase text-gold-300 border border-gold-400/40 bg-gold-900/40 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-gold-300" />
            Rings Revealed · Celebration Awaits
          </span>
        </div>
      </div>

      {/* Velvet Box Lid button */}
      {!opened && (
        <button
          type="button"
          onClick={handleClick}
          className="absolute z-20 group cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-105 active:scale-95"
          title="Click to open ring box"
        >
          <div className="relative w-28 h-24 rounded-2xl bg-gradient-to-b from-[#6B182E] via-[#521021] to-[#380915] shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-[#D4AF37]/60 flex flex-col items-center justify-center p-2">
            {/* Gold Latch */}
            <div className="w-6 h-3 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 rounded-sm shadow-md mb-2 border border-yellow-200 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />
            </div>
            <span className="font-royal text-gold-200 text-xs font-semibold tracking-wider text-[#FFD700]">
              Open Box
            </span>
            <span className="text-[8px] tracking-[0.2em] text-[#E6D5BF]/70 uppercase mt-1">Tap to Open</span>
          </div>
        </button>
      )}
    </div>
  );
}
