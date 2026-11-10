import React, { useRef, useEffect, useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export default function ScratchDate({ onReveal, date = '9th December 2026', day = 'Wednesday', city = 'Meerut', names = 'Preeti & Ashish', title = 'Wedding Celebration' }) {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [percent, setPercent] = useState(0);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Draw rich gold foil background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#B8860B');
    grad.addColorStop(0.25, '#FFD700');
    grad.addColorStop(0.5, '#FFF8DC');
    grad.addColorStop(0.75, '#DAA520');
    grad.addColorStop(1, '#996515');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add gold dust texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const r = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border line inside foil
    ctx.strokeStyle = 'rgba(90, 60, 15, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Text on foil
    ctx.textAlign = 'center';
    ctx.fillStyle = '#3E2B1F';
    ctx.font = 'bold 12px Cinzel, serif';
    ctx.fillText('SCRATCH TO REVEAL THE DATE', width / 2, height / 2 - 14);

    ctx.font = 'italic 11px Georgia, serif';
    ctx.fillStyle = '#5A3D1E';
    ctx.fillText('✨ Rub with your finger or cursor ✨', width / 2, height / 2 + 16);
  }, []);

  const scratch = (clientX, clientY) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    soundManager.playScratchSound();
    checkPercent();
  };

  const checkPercent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    const total = imgData.data.length / 4;
    for (let i = 3; i < imgData.data.length; i += 64) {
      if (imgData.data[i] === 0) transparent++;
    }
    const currentPercent = Math.round((transparent / (total / 16)) * 100);
    setPercent(currentPercent);

    if (currentPercent > 38 && !isRevealed) {
      setIsRevealed(true);
      soundManager.playChime(659.25, 0.8);
      if (onReveal) onReveal();
    }
  };

  const handlePointerDown = (e) => {
    isDrawing.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/60 select-none bg-gradient-to-br from-[#2B1E17] via-[#3E2B1F] to-[#1C120C] text-[#F5EBDD] flex items-center justify-center p-6">
      {/* Underlying revealed content */}
      <div className="text-center space-y-3 z-0 w-full animate-fadeIn">
        <div className="w-12 h-12 mx-auto rounded-full bg-gold-400/20 border border-gold-400/50 flex items-center justify-center text-gold-300">
          <Calendar className="w-6 h-6" />
        </div>
        <p className="text-[10px] tracking-[0.28em] uppercase text-[#C5A880] font-semibold">{title || 'Wedding Celebration'}</p>
        <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#FDFBF7] tracking-wide">{date}</h3>
        <p className="text-xs text-[#E6D5BF]/90 font-light">{day} · {city}</p>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.2em] font-bold uppercase text-gold-300 border border-gold-400/40 bg-gold-900/40 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-gold-300" />
            Date Unveiled · {names}
          </span>
        </div>
      </div>

      {/* Gold Foil Canvas Overlay */}
      <canvas
        ref={canvasRef}
        width={380}
        height={285}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`absolute inset-0 w-full h-full cursor-crosshair z-10 transition-opacity duration-700 touch-none ${
          isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Helper Scratch Bar */}
      {!isRevealed && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-gold-500/30 text-[10px] text-gold-200 tracking-wider flex items-center gap-1.5 shadow-lg">
          <Sparkles className="w-2.5 h-2.5 text-gold-300 animate-spin" />
          <span>Rub to scratch: {percent}% revealed</span>
        </div>
      )}
    </div>
  );
}
