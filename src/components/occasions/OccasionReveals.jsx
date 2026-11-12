import React, { useEffect, useRef, useState } from 'react';
import { soundManager } from '../../utils/audio';
import { triggerCelebration } from '../../utils/confetti';

function ScratchPadCanvas({ width = 220, height = 130, revealText = 'Tap to reveal', accent = '#D4AF37', onComplete }) {
  const canvasRef = useRef(null);
  const draggingRef = useRef(false);
  const doneRef = useRef(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#E8CA82');
    grad.addColorStop(0.5, '#C59B5F');
    grad.addColorStop(1, '#A67C42');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    for (let x = 14; x < width; x += 26) {
      for (let y = 14; y < height; y += 26) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = '#3B2814';
    ctx.font = 'bold 11px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH FOIL TO REVEAL', width / 2, height / 2 + 4);
  }, [width, height]);

  const scratchAt = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || doneRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * width;
    const y = ((clientY - rect.top) / rect.height) * height;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    const pixels = ctx.getImageData(0, 0, width, height).data;
    let cleared = 0;
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) cleared += 1;
    }
    const ratio = cleared / (pixels.length / 16);
    const nextPct = Math.min(100, Math.round(ratio * 100));
    setPct(nextPct);
    if (ratio >= 0.42 && !doneRef.current) {
      doneRef.current = true;
      onComplete?.();
    }
  };

  return (
    <div className="relative mx-auto rounded-2xl overflow-hidden shadow-lg border select-none" style={{ width, height, borderColor: accent }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFFDF9] text-[#2A1E15] px-4 text-center">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: accent }}>Surprise Unveiled</span>
        <span className="mt-1 text-xl font-bold">{revealText}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="relative z-10 touch-none cursor-crosshair block"
        onPointerDown={(e) => {
          draggingRef.current = true;
          scratchAt(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (draggingRef.current) scratchAt(e.clientX, e.clientY);
        }}
        onPointerUp={() => { draggingRef.current = false; }}
        onPointerLeave={() => { draggingRef.current = false; }}
      />
      {pct > 0 && pct < 42 && (
        <span className="absolute bottom-1.5 right-2 z-20 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white">
          {pct}%
        </span>
      )}
    </div>
  );
}

export default function OccasionReveals({ data, theme, onComplete }) {
  const revealId = data?.revealStyle || 'none';
  const [phase, setPhase] = useState('idle'); // 'idle' | 'animating' | 'opened'
  const [subState, setSubState] = useState({ popped: [], pumpCount: 0, pickedFuture: null, mangoStep: 2, floorNum: 1 });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setPhase('idle');
    setSubState({ popped: [], pumpCount: 0, pickedFuture: null, mangoStep: 2, floorNum: 1 });
    return () => { mountedRef.current = false; };
  }, [revealId, data?.occasion, data?.sacrament]);

  if (revealId === 'none') return null;

  const paletteBg = theme?.bg || (theme?.dark ? '#111115' : '#FAF6EE');
  const paletteSurface = theme?.surface || (theme?.dark ? '#1C1B22' : '#FFFFFF');
  const paletteText = theme?.text || (theme?.dark ? '#FAF4E8' : '#241C16');
  const paletteAccent = theme?.accent || '#C59B5F';
  const isDark = Boolean(theme?.dark);

  const hosts = data?.hosts || {};
  const primaryName = data?.occasion === 'engagement'
    ? `${hosts.bride || 'Shanaya'} & ${hosts.groom || 'Aarav'}`
    : data?.occasion === 'housewarming' || data?.occasion === 'house-party'
      ? (hosts.householdName || `${hosts.bride || 'Riya'} & ${hosts.groom || 'Arjun'}`)
      : (hosts.bride || 'Celebration');

  const eyebrow = hosts.revealEyebrow || "YOU'RE INVITED";

  const playSfx = (kind) => {
    if (data?.soundEffects === false) return;
    try {
      if (kind === 'doorbell') soundManager.playDoorbellSound();
      else if (kind === 'seal') soundManager.playSealBreakSound();
      else if (kind === 'box') soundManager.playBoxOpenSound();
      else soundManager.playChime(680, 0.35);
    } catch {
      // ignore WebAudio restrictions prior to gesture
    }
  };

  const triggerFinish = (sfx = 'chime', delay = 800, extraMeta = {}) => {
    if (phase !== 'idle') return;
    setPhase('animating');
    playSfx(sfx);
    if (data?.effect) {
      setTimeout(() => {
        try {
          triggerCelebration(data.effect === 'none' ? 'confetti' : data.effect);
        } catch {
          // ignore confetti errors
        }
      }, 150);
    }
    setTimeout(() => {
      if (mountedRef.current) {
        setPhase('opened');
        onComplete?.(extraMeta);
      }
    }, delay);
  };

  // Lift floor animation handler
  const startLiftRide = () => {
    if (phase !== 'idle') return;
    setPhase('animating');
    playSfx('chime');
    const targetFloor = Math.max(1, parseInt(hosts.floor || '12', 10) || 12);
    let current = 1;
    const stepMs = Math.max(60, Math.min(180, Math.floor(900 / targetFloor)));
    const timer = setInterval(() => {
      current += Math.ceil((targetFloor - current) / 4) || 1;
      if (current >= targetFloor) {
        current = targetFloor;
        clearInterval(timer);
        if (mountedRef.current) {
          setSubState(s => ({ ...s, floorNum: targetFloor }));
          playSfx('doorbell');
          setTimeout(() => {
            if (mountedRef.current) onComplete?.();
          }, 550);
        }
      } else if (mountedRef.current) {
        setSubState(s => ({ ...s, floorNum: current }));
      }
    }, stepMs);
  };

  // Interactive Balloon Pop handler (for Kids Birthday & House Party)
  const popSingleBalloon = (idx) => {
    if (subState.popped.includes(idx)) return;
    playSfx('chime');
    const nextPopped = [...subState.popped, idx];
    setSubState(s => ({ ...s, popped: nextPopped }));
    try { triggerCelebration('colorful'); } catch {}
    if (nextPopped.length >= 3) {
      setTimeout(() => {
        if (mountedRef.current) onComplete?.();
      }, 420);
    }
  };

  const renderActionButton = (label, onClick, icon = '✨') => (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] shadow-md transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
      style={{
        background: paletteAccent,
        color: isDark ? '#14110E' : '#FFFFFF',
      }}
    >
      {icon} {label}
    </button>
  );

  // Determine balloon color list
  const balloonColors = ['#EC4899', '#3B82F6', '#F59E0B', '#10B981'];
  const balloonShape = data?.balloonStyle || 'mixed';

  return (
    <div
      className="occ-reveal-gate absolute inset-0 z-30 flex flex-col items-center justify-between pt-8 pb-5 px-5 text-center overflow-hidden transition-opacity duration-500"
      style={{
        backgroundColor: paletteBg,
        backgroundImage: `radial-gradient(circle at top, ${paletteAccent}22, transparent 68%)`,
        color: paletteText,
        opacity: phase === 'opened' ? 0 : 1,
      }}
    >
      {/* Top Eyebrow & Couple/Host Identity */}
      <div className="pt-2 z-10 max-w-[260px]">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.26em] opacity-75" style={{ color: paletteAccent }}>
          {eyebrow}
        </p>
        <h3 className="mt-1.5 text-lg font-bold tracking-tight leading-snug" style={{ color: paletteText }}>
          {primaryName}
        </h3>
      </div>

      {/* Central Interactive Reveal Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full my-auto py-2">
        {/* 1. ENGAGEMENT SPECIALS */}
        {revealId === 'ringbox' && (
          <div onClick={() => triggerFinish('box', 900)} className="cursor-pointer group flex flex-col items-center">
            <div className="relative w-32 h-28 flex items-center justify-center">
              <div
                className="w-28 h-14 rounded-t-3xl border transition-all duration-700 origin-bottom shadow-xl"
                style={{
                  background: '#2E1821',
                  borderColor: paletteAccent,
                  transform: phase === 'animating' ? 'translateY(-18px) rotateX(65deg) scale(0.95)' : 'translateY(-12px)',
                }}
              />
              <div
                className="absolute w-28 h-14 bottom-2 rounded-b-2xl border shadow-inner flex items-center justify-center"
                style={{ background: '#1B0D12', borderColor: paletteAccent }}
              >
                <div
                  className="transition-all duration-700"
                  style={{
                    transform: phase === 'animating' ? 'translateY(-24px) scale(1.25)' : 'translateY(-6px)',
                  }}
                >
                  <svg width="42" height="42" viewBox="0 0 42 42">
                    <circle cx="21" cy="25" r="10" fill="none" stroke="#D4AF37" strokeWidth="3.2" />
                    <polygon points="21,6 27,13 21,17 15,13" fill="#E0F2FE" stroke="#D4AF37" strokeWidth="1.2" />
                  </svg>
                </div>
              </div>
            </div>
            {renderActionButton('Open Ring Box', () => triggerFinish('box', 900), '💍')}
          </div>
        )}

        {revealId === 'two-rings' && (
          <div onClick={() => triggerFinish('chime', 850)} className="cursor-pointer flex flex-col items-center">
            <svg width="160" height="84" viewBox="0 0 160 84" className="overflow-visible">
              <circle
                cx={phase === 'animating' ? 72 : 52}
                cy="42"
                r="22"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="5"
                style={{ transition: 'all 0.65s ease' }}
              />
              <circle
                cx={phase === 'animating' ? 88 : 108}
                cy="42"
                r="22"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="5"
                style={{ transition: 'all 0.65s ease' }}
              />
            </svg>
            {renderActionButton('Interlock Rings', () => triggerFinish('chime', 850), '∞')}
          </div>
        )}

        {revealId === 'will-you-join' && (
          <div className="w-60 rounded-2xl p-5 shadow-xl border" style={{ background: paletteSurface, borderColor: `${paletteAccent}40` }}>
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: paletteAccent }}>A Question For You</p>
            <h4 className="mt-2 text-lg font-bold">Will You Join Us?</h4>
            <p className="mt-1 text-xs opacity-75">We are raising a glass together in {hosts.city || 'celebration'}.</p>
            {renderActionButton('Yes, Count Us In!', () => triggerFinish('chime', 650), '🥂')}
          </div>
        )}

        {revealId === 'champagne' && (
          <div onClick={() => triggerFinish('box', 850)} className="cursor-pointer flex flex-col items-center">
            <svg width="96" height="120" viewBox="0 0 96 120" className="overflow-visible">
              <rect x="34" y="42" width="28" height="68" rx="8" fill="#14532D" stroke={paletteAccent} strokeWidth="1.5" />
              <rect x="42" y="20" width="12" height="24" rx="2" fill="#14532D" />
              <rect x="38" y="64" width="20" height="22" rx="2" fill="#FDE68A" />
              <g style={{ transition: 'transform 0.65s ease', transform: phase === 'animating' ? 'translate(14px,-32px) rotate(28deg)' : 'translate(0,0)' }}>
                <rect x="41" y="10" width="14" height="11" rx="3" fill="#B45309" stroke="#FDE68A" strokeWidth="1" />
              </g>
              {phase === 'animating' && (
                <>
                  <circle cx="48" cy="4" r="3" fill="#FDE047" />
                  <circle cx="38" cy="9" r="2.5" fill="#FDE047" />
                  <circle cx="58" cy="7" r="2.5" fill="#FFFFFF" />
                </>
              )}
            </svg>
            {renderActionButton('Pop the Champagne', () => triggerFinish('box', 850), '🍾')}
          </div>
        )}

        {revealId === 'sagai-thaal' && (
          <div onClick={() => triggerFinish('box', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="relative w-44 h-28 flex items-center justify-center">
              <div className="w-40 h-16 rounded-full bg-gradient-to-r from-[#F6D58E] via-[#D4AF37] to-[#B45309] border-2 border-[#7C2D12] shadow-lg flex items-center justify-center gap-3">
                <span className="text-xl">💍</span>
                <span className="text-xl">🪷</span>
                <span className="text-xl">💍</span>
              </div>
              <div
                className="absolute inset-0 rounded-2xl border-2 flex items-center justify-center text-white text-xs font-bold tracking-widest uppercase shadow-xl transition-all duration-700"
                style={{
                  background: 'linear-gradient(135deg, #9F1239, #E11D48)',
                  borderColor: '#FCD34D',
                  transform: phase === 'animating' ? 'translateY(-44px) scale(0.9)' : 'translateY(0)',
                  opacity: phase === 'animating' ? 0 : 1,
                }}
              >
                ✨ Sagai Thaal ✨
              </div>
            </div>
            {renderActionButton('Lift the Chunri', () => triggerFinish('box', 850), '✨')}
          </div>
        )}

        {/* 2. BIRTHDAY & HOUSE PARTY BALLOONS */}
        {(revealId === 'pop-balloons' || revealId === 'pop-balloon') && (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 py-2">
              {[0, 1, 2].map((idx) => {
                const popped = subState.popped.includes(idx);
                const color = balloonColors[idx % balloonColors.length];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => popSingleBalloon(idx)}
                    className="relative flex flex-col items-center cursor-pointer transition-all duration-300"
                    style={{
                      transform: popped ? 'scale(0.1)' : 'scale(1)',
                      opacity: popped ? 0 : 1,
                    }}
                  >
                    {balloonShape === 'hearts' ? (
                      <svg width="58" height="66" viewBox="0 0 58 66">
                        <path d="M29 54 C12 42 4 30 4 19 C4 10 11 4 19 4 C24 4 27 7 29 10 C31 7 34 4 39 4 C47 4 54 10 54 19 C54 30 46 42 29 54 Z" fill={color} />
                        <line x1="29" y1="54" x2="29" y2="66" stroke={paletteText} strokeOpacity="0.4" strokeWidth="1.4" />
                      </svg>
                    ) : (
                      <svg width="56" height="68" viewBox="0 0 56 68">
                        <ellipse cx="28" cy="26" rx="22" ry="25" fill={color} />
                        {balloonShape === 'confetti' && (
                          <>
                            <circle cx="20" cy="22" r="2.5" fill="#FFF" fillOpacity="0.65" />
                            <circle cx="34" cy="18" r="2.2" fill="#FDE047" />
                            <circle cx="28" cy="34" r="2.5" fill="#FFF" fillOpacity="0.65" />
                          </>
                        )}
                        <polygon points="28,50 24,55 32,55" fill={color} />
                        <line x1="28" y1="55" x2="28" y2="68" stroke={paletteText} strokeOpacity="0.4" strokeWidth="1.4" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs opacity-75 mt-1">
              {3 - subState.popped.length > 0 ? `Tap to pop (${3 - subState.popped.length} left)` : 'Popped! Opening...'}
            </p>
            {renderActionButton('Pop All Balloons', () => triggerFinish('chime', 550), '🎈')}
          </div>
        )}

        {revealId === 'unwrap-gift' && (
          <div onClick={() => triggerFinish('box', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="relative w-32 h-32 flex flex-col items-center justify-center">
              <div
                className="w-32 h-8 rounded-t-xl border-2 flex items-center justify-center text-sm shadow transition-all duration-700"
                style={{
                  background: paletteAccent,
                  borderColor: '#FFFFFF55',
                  color: '#FFFFFF',
                  transform: phase === 'animating' ? 'translateY(-30px) rotate(-12deg)' : 'translateY(0)',
                }}
              >
                🎀
              </div>
              <div className="w-28 h-20 rounded-b-xl shadow-lg flex items-center justify-center relative" style={{ background: paletteSurface, border: `2px solid ${paletteAccent}` }}>
                <div className="w-4 h-full opacity-80" style={{ background: paletteAccent }} />
              </div>
            </div>
            {renderActionButton('Unwrap the Gift', () => triggerFinish('box', 850), '🎁')}
          </div>
        )}

        {revealId === 'blow-candles' && (
          <div onClick={() => triggerFinish('chime', 800)} className="cursor-pointer flex flex-col items-center">
            <svg width="130" height="108" viewBox="0 0 130 108">
              {[44, 65, 86].map((cx, i) => (
                <g key={i}>
                  <rect x={cx - 3} y="24" width="6" height="22" rx="2" fill={i === 1 ? '#EC4899' : '#38BDF8'} />
                  {phase !== 'animating' ? (
                    <path d={`M${cx} 11 Q${cx + 5} 18 ${cx} 23 Q${cx - 5} 18 ${cx} 11 Z`} fill="#FBBF24" />
                  ) : (
                    <path d={`M${cx} 14 Q${cx + 4} 10 ${cx} 6`} stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
                  )}
                </g>
              ))}
              <rect x="26" y="46" width="78" height="44" rx="10" fill={paletteSurface} stroke={paletteAccent} strokeWidth="2" />
              <path d="M26 56 Q39 66 52 56 Q65 66 78 56 Q91 66 104 56" fill="none" stroke={paletteAccent} strokeWidth="4" />
            </svg>
            {renderActionButton('Make a Wish & Blow', () => triggerFinish('chime', 800), '🎂')}
          </div>
        )}

        {revealId === 'inflate-balloon' && (
          <div className="flex flex-col items-center">
            <div
              onClick={() => {
                playSfx('chime');
                const next = subState.pumpCount + 1;
                setSubState(s => ({ ...s, pumpCount: next }));
                if (next >= 3) triggerFinish('box', 450);
              }}
              className="cursor-pointer flex flex-col items-center"
            >
              <div
                className="rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-white font-bold text-xs"
                style={{
                  width: 58 + subState.pumpCount * 22,
                  height: 68 + subState.pumpCount * 24,
                  background: `radial-gradient(circle at 35% 30%, #F472B6, ${paletteAccent})`,
                }}
              >
                {subState.pumpCount >= 3 ? 'POP!' : `${subState.pumpCount}/3`}
              </div>
            </div>
            {renderActionButton(
              subState.pumpCount < 2 ? 'Pump to Inflate' : 'One More Pump!',
              () => {
                playSfx('chime');
                const next = subState.pumpCount + 1;
                setSubState(s => ({ ...s, pumpCount: next }));
                if (next >= 3) triggerFinish('box', 450);
              },
              '🎈'
            )}
          </div>
        )}

        {/* 3. HOUSEWARMING & HOME REVEALS */}
        {(revealId === 'front-door' || revealId === 'tap') && (
          <div onClick={() => triggerFinish('doorbell', 900)} className="cursor-pointer flex flex-col items-center">
            <div className="relative w-36 h-48 rounded-t-2xl p-1.5 border-2 shadow-xl flex overflow-hidden" style={{ borderColor: paletteAccent, background: '#3B2316' }}>
              <div
                className="w-full h-full rounded-t-xl border border-[#D4AF37]/40 flex flex-col items-center justify-between py-4 transition-transform duration-700 origin-left"
                style={{
                  background: 'linear-gradient(160deg, #6B3E26, #4A2715)',
                  transform: phase === 'animating' ? 'perspective(600px) rotateY(-72deg)' : 'rotateY(0deg)',
                }}
              >
                <div className="px-3 py-1 rounded bg-[#D4AF37]/90 text-[#1F140B] text-[10px] font-bold tracking-widest">
                  {hosts.flatNo || '1204'}
                </div>
                <div className="w-3 h-3 rounded-full bg-[#FDE047] shadow ml-auto mr-3" />
                <span className="text-[9px] text-[#FDE68A]/80 uppercase tracking-[0.2em]">Welcome</span>
              </div>
            </div>
            {renderActionButton(revealId === 'front-door' ? 'Ring the Doorbell' : 'Tap to Open Door', () => triggerFinish('doorbell', 900), '🔔')}
          </div>
        )}

        {revealId === 'lift' && (
          <div onClick={startLiftRide} className="cursor-pointer flex flex-col items-center">
            <div className="w-40 rounded-2xl border-2 p-3 shadow-xl bg-[#1E293B] text-white border-[#94A3B8]">
              <div className="mx-auto w-20 py-1 rounded bg-black text-[#FACC15] font-mono text-lg font-bold tracking-widest border border-slate-700">
                F{String(subState.floorNum).padStart(2, '0')}
              </div>
              <div className="relative mt-3 h-28 rounded-lg overflow-hidden border border-slate-600 flex bg-[#F8FAFC]">
                <div
                  className="w-1/2 h-full bg-gradient-to-r from-slate-600 to-slate-500 border-r border-slate-700 transition-transform duration-500"
                  style={{ transform: phase === 'opened' ? 'translateX(-100%)' : 'translateX(0)' }}
                />
                <div
                  className="w-1/2 h-full bg-gradient-to-l from-slate-600 to-slate-500 transition-transform duration-500"
                  style={{ transform: phase === 'opened' ? 'translateX(100%)' : 'translateX(0)' }}
                />
              </div>
            </div>
            {renderActionButton(`Ride Up to Floor ${hosts.floor || '12'}`, startLiftRide, '🛗')}
          </div>
        )}

        {revealId === 'key-in-lock' && (
          <div onClick={() => triggerFinish('seal', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="w-28 h-28 rounded-full border-2 flex items-center justify-center shadow-lg" style={{ borderColor: paletteAccent, background: paletteSurface }}>
              <span
                className="text-4xl transition-transform duration-700 inline-block"
                style={{ transform: phase === 'animating' ? 'rotate(90deg) scale(1.15)' : 'rotate(0deg)' }}
              >
                🔑
              </span>
            </div>
            {renderActionButton('Turn Key to Unlock', () => triggerFinish('seal', 850), '🔓')}
          </div>
        )}

        {revealId === 'ribbon-cutting' && (
          <div onClick={() => triggerFinish('box', 850)} className="cursor-pointer flex flex-col items-center w-full max-w-[260px]">
            <div className="relative w-full h-16 flex items-center justify-center">
              <div
                className="h-4 w-1/2 rounded-l bg-[#E11D48] transition-transform duration-700"
                style={{ transform: phase === 'animating' ? 'translateX(-28px) rotate(-10deg)' : 'none' }}
              />
              <span className="mx-1 text-2xl">✂️</span>
              <div
                className="h-4 w-1/2 rounded-r bg-[#E11D48] transition-transform duration-700"
                style={{ transform: phase === 'animating' ? 'translateX(28px) rotate(10deg)' : 'none' }}
              />
            </div>
            {renderActionButton('Snip Ceremonial Ribbon', () => triggerFinish('box', 850), '🎀')}
          </div>
        )}

        {/* 4. HOUSE PARTY SPECIALS */}
        {revealId === 'light-phuljhadi' && (
          <div onClick={() => triggerFinish('chime', 900)} className="cursor-pointer flex flex-col items-center">
            <div className="text-5xl transition-transform duration-500" style={{ transform: phase === 'animating' ? 'scale(1.35) rotate(12deg)' : 'scale(1)' }}>
              Sparkler ✨🎆
            </div>
            {renderActionButton('Light the Phuljhadi', () => triggerFinish('chime', 900), '✨')}
          </div>
        )}

        {revealId === 'shake-snowglobe' && (
          <div onClick={() => triggerFinish('chime', 900)} className="cursor-pointer flex flex-col items-center">
            <div
              className="w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-lg transition-transform duration-500"
              style={{
                borderColor: paletteAccent,
                background: 'linear-gradient(180deg, #1E3A8A, #0F172A)',
                transform: phase === 'animating' ? 'rotate(-10deg) scale(1.08)' : 'rotate(0)',
              }}
            >
              <span className="text-3xl">🎄❄️</span>
            </div>
            <div className="w-20 h-4 -mt-1 rounded-b-lg bg-[#78350F]" />
            {renderActionButton('Shake the Snow Globe', () => triggerFinish('chime', 900), '❄️')}
          </div>
        )}

        {revealId === 'midnight-countdown' && (
          <div onClick={() => triggerFinish('box', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="px-6 py-4 rounded-2xl border-2 font-mono text-2xl font-bold tracking-widest" style={{ borderColor: paletteAccent, background: paletteSurface }}>
              {phase === 'animating' ? '00:00 ✨' : '23:59:58'}
            </div>
            {renderActionButton('Celebrate Midnight', () => triggerFinish('box', 850), '🥂')}
          </div>
        )}

        {revealId === 'drop-needle' && (
          <div onClick={() => triggerFinish('chime', 850)} className="cursor-pointer flex flex-col items-center">
            <div
              className={`w-28 h-28 rounded-full border-4 flex items-center justify-center bg-[#09090B] shadow-xl ${phase === 'animating' ? 'animate-spin' : ''}`}
              style={{ borderColor: paletteAccent }}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: paletteAccent, color: '#000' }}>
                33 RPM
              </div>
            </div>
            {renderActionButton('Drop the Needle', () => triggerFinish('chime', 850), '🪩')}
          </div>
        )}

        {revealId === 'roll-dice' && (
          <div onClick={() => triggerFinish('box', 800)} className="cursor-pointer flex flex-col items-center">
            <div className="flex gap-3 text-4xl transition-transform duration-500" style={{ transform: phase === 'animating' ? 'rotate(180deg) scale(1.2)' : 'none' }}>
              <span className="w-14 h-14 rounded-xl bg-white text-black border border-slate-300 shadow flex items-center justify-center font-bold">⚄</span>
              <span className="w-14 h-14 rounded-xl bg-white text-black border border-slate-300 shadow flex items-center justify-center font-bold">⚅</span>
            </div>
            {renderActionButton('Roll Double Six', () => triggerFinish('box', 800), '🎲')}
          </div>
        )}

        {(revealId === 'lights-on' || revealId === 'lights-out-surprise') && (
          <div onClick={() => triggerFinish('chime', 750)} className="cursor-pointer flex flex-col items-center">
            <div className="flex gap-2 mb-2">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="w-5 h-5 rounded-full transition-all duration-300"
                  style={{
                    background: phase === 'animating' ? '#FDE047' : '#475569',
                    boxShadow: phase === 'animating' ? '0 0 14px #FACC15' : 'none',
                  }}
                />
              ))}
            </div>
            {renderActionButton(
              revealId === 'lights-on' ? 'Switch Fairy Lights On' : 'Flip Switch — Surprise!',
              () => triggerFinish('chime', 750),
              '💡'
            )}
          </div>
        )}

        {revealId === 'party-popper' && (
          <div onClick={() => triggerFinish('box', 700)} className="cursor-pointer flex flex-col items-center">
            <div className="text-5xl transition-transform duration-500" style={{ transform: phase === 'animating' ? 'scale(1.3)' : 'scale(1)' }}>🎉</div>
            {renderActionButton('Pull Party Popper', () => triggerFinish('box', 700), '🎊')}
          </div>
        )}

        {revealId === 'tear-ticket' && (
          <div onClick={() => triggerFinish('seal', 800)} className="cursor-pointer flex flex-col items-center">
            <div className="px-5 py-3 rounded-xl border-2 border-dashed font-mono text-xs uppercase tracking-widest" style={{ borderColor: paletteAccent, background: paletteSurface }}>
              🎬 ADMIT ONE · VIP SCREENING 🍿
            </div>
            {renderActionButton('Tear Ticket Stub', () => triggerFinish('seal', 800), '🎟️')}
          </div>
        )}

        {revealId === 'make-splash' && (
          <div onClick={() => triggerFinish('chime', 750)} className="cursor-pointer flex flex-col items-center">
            <div className="text-5xl transition-transform duration-500" style={{ transform: phase === 'animating' ? 'translateY(14px) scale(1.2)' : 'none' }}>🏖️🌊</div>
            {renderActionButton('Make a Splash', () => triggerFinish('chime', 750), '💦')}
          </div>
        )}

        {revealId === 'moon-sighting' && (
          <div onClick={() => triggerFinish('chime', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="text-5xl transition-transform duration-500" style={{ transform: phase === 'animating' ? 'scale(1.2)' : 'scale(1)' }}>🌙✨</div>
            {renderActionButton('Sight the Crescent Moon', () => triggerFinish('chime', 850), '🏮')}
          </div>
        )}

        {/* 5. BABY SHOWER & ANNAPRASHAN REVEALS */}
        {revealId === 'stork' && (
          <div onClick={() => triggerFinish('chime', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="w-36 h-24 rounded-2xl border flex flex-col items-center justify-center shadow" style={{ background: paletteSurface, borderColor: `${paletteAccent}44` }}>
              <span className="text-4xl">🦢🍼</span>
              <span className="text-[10px] uppercase tracking-widest mt-1 opacity-70">Special Bundle Delivery</span>
            </div>
            {renderActionButton('Receive the Bundle', () => triggerFinish('chime', 850), '👶')}
          </div>
        )}

        {revealId === 'balloon-gift' && (
          <div onClick={() => triggerFinish('box', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="text-5xl transition-transform duration-500" style={{ transform: phase === 'animating' ? 'translateY(-24px)' : 'none' }}>🎈🎁</div>
            {renderActionButton('Untie the Bow', () => triggerFinish('box', 850), '🎀')}
          </div>
        )}

        {revealId === 'crib-mobile' && (
          <div onClick={() => triggerFinish('chime', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="w-32 h-24 rounded-2xl border flex items-center justify-center gap-2 text-2xl shadow" style={{ background: '#0F172A', color: '#FDE68A', borderColor: paletteAccent }}>
              <span>🌙</span><span>⭐</span><span>☁️</span>
            </div>
            {renderActionButton('Wind the Music Box', () => triggerFinish('chime', 850), '🎵')}
          </div>
        )}

        {revealId === 'bangle-curtain' && (
          <div onClick={() => triggerFinish('chime', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="flex items-center justify-center -space-x-2">
              {['#9F1239', '#D97706', '#15803D', '#E11D48'].map((c, idx) => (
                <div key={idx} className="w-10 h-10 rounded-full border-4 shadow" style={{ borderColor: c }} />
              ))}
            </div>
            {renderActionButton('Part the Glass Bangles', () => triggerFinish('chime', 850), '✨')}
          </div>
        )}

        {revealId === 'baby-blocks' && (
          <div onClick={() => triggerFinish('box', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="flex gap-1.5">
              {['O', 'H', 'B', 'A', 'B', 'Y'].map((ch, idx) => (
                <span
                  key={idx}
                  className="w-8 h-8 rounded-lg border-2 font-bold text-xs flex items-center justify-center shadow transition-transform duration-500"
                  style={{
                    background: paletteSurface,
                    borderColor: paletteAccent,
                    transform: phase === 'animating' ? `rotate(${(idx % 2 === 0 ? 1 : -1) * 18}deg) translateY(-10px)` : 'none',
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
            {renderActionButton('Tumble the Blocks', () => triggerFinish('box', 850), '🧸')}
          </div>
        )}

        {revealId === 'parents-to-be' && (
          <div onClick={() => triggerFinish('chime', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center animate-pulse shadow-lg" style={{ borderColor: paletteAccent, background: paletteSurface }}>
              <span className="text-3xl">💗</span>
            </div>
            {renderActionButton("Listen to Baby's Heartbeat", () => triggerFinish('chime', 850), '💓')}
          </div>
        )}

        {revealId === 'size-of-mango' && (
          <div className="flex flex-col items-center max-w-[240px]">
            <div className="rounded-2xl p-4 border shadow-sm w-full" style={{ background: paletteSurface, borderColor: `${paletteAccent}44` }}>
              <div className="text-3xl">
                {['🫘 Rajma (Week 8)', '🍋 Nimbu (Week 14)', '🥭 Alphonso Mango (Week 19)', '🥥 Nariyal (Week 34)'][subState.mangoStep]}
              </div>
              <input
                type="range"
                min={0}
                max={3}
                value={subState.mangoStep}
                onChange={(e) => setSubState(s => ({ ...s, mangoStep: Number(e.target.value) }))}
                className="w-full mt-3 accent-amber-600 cursor-pointer"
              />
            </div>
            {renderActionButton('Open Baby Shower Invite', () => triggerFinish('chime', 700), '🥭')}
          </div>
        )}

        {revealId === 'pick-future' && (
          <div className="flex flex-col items-center max-w-[260px]">
            <p className="text-[11px] opacity-80 mb-2">Tap what the little one picks from the Annaprashan tray:</p>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'book', icon: '📖', label: 'Wisdom' },
                { id: 'pen', icon: '✒️', label: 'Scholar' },
                { id: 'coin', icon: '🪙', label: 'Fortune' },
                { id: 'pot', icon: '🏺', label: 'Roots' },
                { id: 'lotus', icon: '🪷', label: 'Grace' },
              ].map((item) => {
                const active = subState.pickedFuture === item.label;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSubState(s => ({ ...s, pickedFuture: item.label }));
                      triggerFinish('chime', 700, { pickedFuture: item.label });
                    }}
                    className="p-2 rounded-xl border flex flex-col items-center cursor-pointer transition hover:scale-105"
                    style={{
                      background: active ? paletteAccent : paletteSurface,
                      color: active ? '#FFF' : paletteText,
                      borderColor: `${paletteAccent}55`,
                    }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[8.5px] font-bold uppercase mt-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {revealId === 'first-bite' && (
          <div onClick={() => triggerFinish('chime', 800)} className="cursor-pointer flex flex-col items-center">
            <div className="w-28 h-24 rounded-2xl border flex items-center justify-center text-4xl shadow" style={{ background: paletteSurface, borderColor: paletteAccent }}>
              🥣🥄
            </div>
            {renderActionButton('Feed First Spoon of Kheer', () => triggerFinish('chime', 800), '✨')}
          </div>
        )}

        {/* 6. HOLY COMMUNION / SACRED REVEALS */}
        {revealId === 'church-doors' && (
          <div onClick={() => triggerFinish('doorbell', 950)} className="cursor-pointer flex flex-col items-center">
            <div className="relative w-40 h-44 rounded-t-full border-2 overflow-hidden flex shadow-xl bg-[#FEF9EC]" style={{ borderColor: paletteAccent }}>
              <div
                className="w-1/2 h-full bg-[#5C3A21] border-r border-[#D4AF37]/50 transition-transform duration-700 origin-left"
                style={{ transform: phase === 'animating' ? 'perspective(500px) rotateY(-78deg)' : 'none' }}
              />
              <div
                className="w-1/2 h-full bg-[#5C3A21] transition-transform duration-700 origin-right"
                style={{ transform: phase === 'animating' ? 'perspective(500px) rotateY(78deg)' : 'none' }}
              />
            </div>
            {renderActionButton('Ring Bell & Open Doors', () => triggerFinish('doorbell', 950), '🔔')}
          </div>
        )}

        {revealId === 'stained-glass' && (
          <div onClick={() => triggerFinish('chime', 900)} className="cursor-pointer flex flex-col items-center">
            <div
              className="w-32 h-32 rounded-full border-4 flex items-center justify-center shadow-2xl transition-all duration-700"
              style={{
                borderColor: paletteAccent,
                background: 'conic-gradient(#38BDF8, #C084FC, #F472B6, #FACC15, #34D399, #38BDF8)',
                filter: phase === 'animating' ? 'brightness(1.4)' : 'brightness(0.9)',
              }}
            >
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-amber-600 font-bold">✝</div>
            </div>
            {renderActionButton('Let Sunlight Shine In', () => triggerFinish('chime', 900), '☀️')}
          </div>
        )}

        {revealId === 'candle' && (
          <div onClick={() => triggerFinish('chime', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-1">{phase === 'animating' ? '🌟' : '🕯️'}</div>
              <div className="w-8 h-16 rounded-t-md bg-[#FFF8DC] border border-amber-300 shadow" />
            </div>
            {renderActionButton('Light the Altar Candle', () => triggerFinish('chime', 850), '🕯️')}
          </div>
        )}

        {revealId === 'dove' && (
          <div onClick={() => triggerFinish('chime', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="text-5xl transition-transform duration-700" style={{ transform: phase === 'animating' ? 'translateY(-14px) scale(1.15)' : 'none' }}>🕊️</div>
            {renderActionButton('Unfold Grace Invitation', () => triggerFinish('chime', 850), '🌿')}
          </div>
        )}

        {/* 7. SHARED CLASSIC REVEALS */}
        {revealId === 'scratch' && (
          <ScratchPadCanvas
            revealText={primaryName}
            accent={paletteAccent}
            onComplete={() => triggerFinish('chime', 500)}
          />
        )}

        {(revealId === 'seal' || revealId === 'envelope' || revealId === 'letter') && (
          <div onClick={() => triggerFinish('seal', 850)} className="cursor-pointer flex flex-col items-center">
            <div className="relative w-52 h-32 rounded-xl border-2 shadow-xl flex flex-col items-center justify-center p-4" style={{ background: paletteSurface, borderColor: paletteAccent }}>
              <div
                className="w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-md transition-transform duration-500"
                style={{
                  background: paletteAccent,
                  color: '#FFF',
                  borderColor: '#FFFFFF77',
                  transform: phase === 'animating' ? 'scale(1.25) rotate(12deg)' : 'none',
                }}
              >
                P
              </div>
              <span className="mt-2 text-[10px] uppercase tracking-[0.2em] opacity-75">
                {revealId === 'letter' ? 'Pull Out Card' : revealId === 'envelope' ? 'Open Four-Flap Envelope' : 'Break Wax Seal'}
              </span>
            </div>
            {renderActionButton(revealId === 'letter' ? 'Open Letter' : 'Break Seal & Open', () => triggerFinish('seal', 850), '✉️')}
          </div>
        )}

        {revealId === 'incoming-call' && (
          <div className="w-56 rounded-3xl p-5 bg-[#0F172A] text-white border border-slate-700 shadow-2xl">
            <span className="text-[9px] uppercase tracking-[0.24em] text-emerald-400">Incoming Invitation Call</span>
            <h4 className="mt-2 text-lg font-bold">{primaryName}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{hosts.city || 'Celebration Desk'}</p>
            <button
              type="button"
              onClick={() => triggerFinish('chime', 650)}
              className="mt-5 w-full py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-widest cursor-pointer"
            >
              📞 Slide / Tap to Answer
            </button>
          </div>
        )}

        {revealId === 'block-date' && (
          <div className="w-52 rounded-2xl overflow-hidden border shadow-xl" style={{ background: paletteSurface, borderColor: `${paletteAccent}55` }}>
            <div className="py-2 text-[10px] font-bold uppercase tracking-widest text-white" style={{ background: paletteAccent }}>
              SAVE THE DATE
            </div>
            <div className="p-4">
              <div className="text-lg font-bold">{hosts.date || '2026-12-27'}</div>
              <div className="text-[11px] opacity-75 mt-1">{hosts.venue || hosts.city}</div>
              {renderActionButton('Block This Date', () => triggerFinish('chime', 650), '📅')}
            </div>
          </div>
        )}

        {revealId === 'play-button' && (
          <div onClick={() => triggerFinish('chime', 700)} className="cursor-pointer flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center shadow-2xl transition-transform hover:scale-105" style={{ background: `${paletteAccent}22`, borderColor: paletteAccent }}>
              <span className="text-2xl ml-1" style={{ color: paletteAccent }}>▶</span>
            </div>
            {renderActionButton('Tap to Play Invite', () => triggerFinish('chime', 700), '')}
          </div>
        )}
      </div>

      {/* Bottom Subtitle + Direct Skip */}
      <div className="pb-1 z-10 flex flex-col items-center gap-2">
        {hosts.revealSubtitle && (
          <p className="text-[11px] opacity-70 max-w-[230px]">{hosts.revealSubtitle}</p>
        )}
        <button
          type="button"
          onClick={() => onComplete?.()}
          className="text-[10px] uppercase tracking-[0.2em] opacity-55 hover:opacity-100 underline underline-offset-4 cursor-pointer"
        >
          Skip Reveal →
        </button>
      </div>
    </div>
  );
}
