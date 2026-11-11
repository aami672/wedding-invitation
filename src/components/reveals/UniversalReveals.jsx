import React, { useState, useRef } from 'react';
import {
  Heart, Sparkles, Phone, Play, Check, Package, Key, Sparkle, DoorOpen,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { getRevealCopy, splitMonogram } from '../../utils/revealConfig';

function playRevealCue(id) {
  switch (id) {
    case 'horn-ok':
      soundManager.shehnaiHorn();
      break;
    case 'ik-onkar':
    case 'gurdwara':
    case 'lamps-palace':
    case 'ballroom-lights':
    case 'lotus-bloom':
      soundManager.templeBell();
      break;
    case 'letter':
    case 'envelope':
    case 'wedding-scroll':
    case 'quick-delivery':
    case 'lovebird-post':
      soundManager.cardOpen();
      break;
    default:
      soundManager.playChime(659.25, 0.75);
      break;
  }
}

function UnlockBanner({ label, active }) {
  if (!active) return null;
  return (
    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full inv-pill border text-[10px] font-bold uppercase tracking-widest animate-fadeIn">
      <Sparkles className="w-3 h-3" />
      <span>{label}</span>
    </div>
  );
}

export default function UniversalRevealWidget({
  revealId,
  onReveal,
  data,
  displayDate = '9th December 2026',
  initials = 'P & A',
  coverPhoto,
}) {
  const [activated, setActivated] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const dragStartRef = useRef(null);

  const bride = data?.hosts?.bride || 'Preeti';
  const groom = data?.hosts?.groom || 'Ashish';
  const city = data?.hosts?.city || 'Meerut';
  const [bInit, gInit] = splitMonogram(initials, bride, groom);
  const photo = coverPhoto || data?.photos?.story || './images/themes/Luxe-Pastel-Caricature/03-sangeet.webp';
  const copy = getRevealCopy(revealId, { bride, groom, city, displayDate, initials });

  const trigger = (delayMs = 820) => {
    if (activated) return;
    setActivated(true);
    playRevealCue(copy.id);
    if (onReveal) {
      setTimeout(onReveal, delayMs);
    }
  };

  const clsBox = `uni-rev-box relative w-full max-w-sm mx-auto rounded-3xl shadow-2xl overflow-hidden select-none cursor-pointer transition-all duration-500 ${
    activated ? 'is-open' : ''
  }`;

  // 1. LETTER — Pull-out note card
  if (copy.id === 'letter') {
    return (
      <div
        onClick={() => trigger(850)}
        onPointerDown={(e) => { dragStartRef.current = e.clientY; }}
        onPointerMove={(e) => {
          if (dragStartRef.current == null || activated) return;
          const dy = Math.min(0, e.clientY - dragStartRef.current);
          setDragY(dy);
          if (dy < -42) {
            dragStartRef.current = null;
            trigger(700);
          }
        }}
        onPointerUp={() => { dragStartRef.current = null; setDragY(0); }}
        className={`${clsBox} inv-modal p-5 pt-16 min-h-[290px] flex flex-col items-center justify-end`}
      >
        <div
          style={!activated && dragY < 0 ? { transform: `translateY(${Math.max(-72, dragY)}px)` } : undefined}
          className="uni-letter-sheet relative z-10 w-[86%] rounded-2xl border-2 border-[#D4AF37]/60 bg-[#FDFBF7] text-[#2B1E17] p-5 text-center shadow-xl mb-1"
        >
          <p className="text-[9px] tracking-[0.25em] uppercase text-[#8B6F47] font-bold">Personal Note</p>
          <h3 className="font-royal text-2xl mt-1">{bride} &amp; {groom}</h3>
          <p className="text-[11px] text-stone-600 mt-1">{displayDate} · {city}</p>
          <UnlockBanner label={copy.done} active={activated} />
        </div>
        <div className="relative z-20 w-full -mt-12 rounded-2xl inv-surface border p-4 text-center shadow-lg">
          <div className="w-10 h-1 rounded-full mx-auto mb-2 opacity-40" style={{ backgroundColor: 'var(--pal-accent)' }} />
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest inv-accent">
            <span>{activated ? '✨ Opened!' : copy.cta}</span>
          </span>
        </div>
      </div>
    );
  }

  // 2. ENVELOPE — Four-flap royal folds
  if (copy.id === 'envelope') {
    return (
      <div onClick={() => trigger(900)} className={`${clsBox} aspect-[4/3] inv-modal border-2 p-4 flex items-center justify-center`} style={{ perspective: '900px' }}>
        <div className="relative z-0 text-center space-y-2 p-4">
          <p className="text-[10px] tracking-[0.28em] uppercase font-bold inv-accent">{copy.eyebrow}</p>
          <h3 className="font-royal text-2xl inv-heading">{bride} &amp; {groom}</h3>
          <p className="text-xs inv-muted">{displayDate} · {city}</p>
          <UnlockBanner label={copy.done} active={activated} />
        </div>
        <div className="uni-flap-top absolute inset-x-0 top-0 h-[56%] z-10 pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backgroundColor: 'var(--pal-surface)', borderBottom: '2px solid var(--pal-accent)' }} />
        <div className="uni-flap-bottom absolute inset-x-0 bottom-0 h-[56%] z-10 pointer-events-none" style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0)', backgroundColor: 'var(--pal-card-bg)', opacity: 0.96 }} />
        <div className="uni-flap-left absolute inset-y-0 left-0 w-[56%] z-10 pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', backgroundColor: 'var(--pal-door-left, var(--pal-surface))' }} />
        <div className="uni-flap-right absolute inset-y-0 right-0 w-[56%] z-10 pointer-events-none" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)', backgroundColor: 'var(--pal-door-right, var(--pal-surface))' }} />
        {!activated && (
          <div className="relative z-20 px-4 py-2 rounded-full inv-btn-primary text-[11px] font-bold uppercase tracking-widest shadow-xl animate-pulse">
            {copy.cta}
          </div>
        )}
      </div>
    );
  }

  // 3. TAP — Carved Door Gate
  if (copy.id === 'tap') {
    return (
      <div onClick={() => trigger(900)} className={`${clsBox} aspect-[4/3] inv-modal flex items-center justify-center p-6`} style={{ perspective: '1000px' }}>
        <div className="text-center space-y-2 z-0">
          <DoorOpen className="w-8 h-8 mx-auto inv-accent" />
          <h3 className="font-royal text-2xl inv-heading">{bride} &amp; {groom}</h3>
          <p className="text-xs inv-muted">{city} · {displayDate}</p>
          <UnlockBanner label={copy.done} active={activated} />
        </div>
        <div className="uni-door-l absolute inset-y-0 left-0 w-1/2 z-10 bg-gradient-to-br from-[#4A2E1B] to-[#26150A] border-r-2 border-[#D4AF37]/60 flex items-center justify-end pr-3">
          <div className="w-7 h-7 rounded-full border-2 border-[#FFD700]/80 shadow-md" />
        </div>
        <div className="uni-door-r absolute inset-y-0 right-0 w-1/2 z-10 bg-gradient-to-bl from-[#4A2E1B] to-[#26150A] border-l-2 border-[#D4AF37]/60 flex items-center justify-start pl-3">
          <div className="w-7 h-7 rounded-full border-2 border-[#FFD700]/80 shadow-md" />
        </div>
        {!activated && (
          <span className="relative z-20 px-4 py-2 rounded-full bg-amber-500 text-stone-950 font-bold text-xs tracking-widest uppercase shadow-xl">
            {copy.cta}
          </span>
        )}
      </div>
    );
  }

  // 4. MEET — Bring Together medallions
  if (copy.id === 'meet') {
    return (
      <div onClick={() => trigger(850)} className={`${clsBox} inv-modal p-6 text-center space-y-4`}>
        <span className="text-[10px] tracking-[0.25em] uppercase font-bold inv-pill px-3 py-1 rounded-full inline-block">{copy.eyebrow}</span>
        <div className="relative h-28 flex items-center justify-center gap-12">
          <div className="uni-meet-l relative z-10 w-20 h-20 rounded-full border-2 shadow-lg flex flex-col items-center justify-center inv-surface" style={{ borderColor: 'var(--pal-accent)' }}>
            <span className="font-royal text-xl font-bold inv-heading">{bInit}</span>
            <span className="text-[9px] inv-muted truncate max-w-[60px]">{bride}</span>
          </div>
          <div className={`text-2xl transition-all duration-500 ${activated ? 'scale-150 text-rose-500' : 'opacity-40 inv-accent'}`}>💕</div>
          <div className="uni-meet-r relative z-10 w-20 h-20 rounded-full border-2 shadow-lg flex flex-col items-center justify-center inv-surface" style={{ borderColor: 'var(--pal-accent)' }}>
            <span className="font-royal text-xl font-bold inv-heading">{gInit}</span>
            <span className="text-[9px] inv-muted truncate max-w-[60px]">{groom}</span>
          </div>
        </div>
        <button type="button" className="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">
          {activated ? copy.done : copy.cta}
        </button>
      </div>
    );
  }

  // 5. MATCH — Draggable Swipe Right card
  if (copy.id === 'match') {
    return (
      <div className="w-full max-w-sm mx-auto space-y-3 select-none">
        <div
          onPointerDown={(e) => { dragStartRef.current = e.clientX; }}
          onPointerMove={(e) => {
            if (dragStartRef.current == null || activated) return;
            const dx = Math.max(-30, e.clientX - dragStartRef.current);
            setDragX(dx);
            if (dx > 72) {
              dragStartRef.current = null;
              trigger(700);
            }
          }}
          onPointerUp={() => { dragStartRef.current = null; if (!activated) setDragX(0); }}
          style={{
            transform: activated
              ? 'translateX(130%) rotate(14deg)'
              : `translateX(${dragX}px) rotate(${(dragX * 0.08).toFixed(1)}deg)`,
            opacity: activated ? 0 : 1,
          }}
          className="inv-modal rounded-3xl overflow-hidden shadow-2xl border-2 cursor-grab active:cursor-grabbing transition-all duration-500 touch-pan-y"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img src={photo} alt={`${bride} & ${groom}`} className="w-full h-full object-cover pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            {(dragX > 25 || activated) && (
              <div className="absolute top-4 left-4 border-4 border-emerald-400 text-emerald-300 font-black text-lg px-3 py-1 rounded-xl -rotate-12 tracking-widest bg-black/40">
                MATCH! ♥
              </div>
            )}
            <div className="absolute bottom-3 left-4 right-4 text-left text-white">
              <p className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">Soulmates · ∞% Match</p>
              <h3 className="font-royal text-2xl">{bride} &amp; {groom}</h3>
              <p className="text-xs text-white/80">{city} · {displayDate}</p>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between gap-3">
            <span className="text-xs inv-muted">{copy.hint}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); trigger(700); }}
              className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              aria-label="Match Right"
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. VIDEO — Cinema clip premiere
  if (copy.id === 'video') {
    return (
      <div onClick={() => trigger(950)} className={`${clsBox} bg-stone-950 text-white border border-stone-700`}>
        <div className="flex justify-between px-3 py-1.5 bg-black/70 border-b border-stone-800 text-[9px] tracking-[0.25em] uppercase text-amber-300 font-bold">
          <span>🎬 SCENE 01 · {bInit} &amp; {gInit}</span>
          <span>{activated ? 'PLAYING 00:01' : 'READY'}</span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={photo} alt="Premiere" className={`w-full h-full object-cover transition-transform duration-1000 ${activated ? 'scale-110 brightness-110' : 'brightness-75'}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col items-center justify-center p-4">
            <div className={`w-16 h-16 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-2xl transition-transform ${activated ? 'scale-125 opacity-0' : 'hover:scale-110'}`}>
              <Play className="w-7 h-7 fill-current ml-0.5" />
            </div>
            <h3 className="font-royal text-2xl mt-2 text-white">{bride} &amp; {groom}</h3>
          </div>
        </div>
        <div className="p-3 bg-stone-950 space-y-2">
          <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
            <div className={`h-full bg-amber-400 transition-all duration-700 ${activated ? 'w-full' : 'w-1/6'}`} />
          </div>
          <p className="text-[10px] tracking-widest uppercase text-amber-200 font-semibold">{activated ? copy.done : copy.cta}</p>
        </div>
      </div>
    );
  }

  // 7. INCOMING CALL — Slide/Tap to Answer
  if (copy.id === 'incoming-call') {
    return (
      <div onClick={() => trigger(750)} className={`${clsBox} bg-[#14171A] text-white p-6 border border-stone-700 text-center space-y-5`}>
        <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-[0.25em] animate-pulse block">
          {activated ? 'Connected · 00:01' : 'Incoming Wedding Call...'}
        </span>
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <span className="rev-ripple absolute inset-0 rounded-full border-2 border-emerald-400/60" />
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-400 shadow-lg relative z-10">
            <img src={photo} alt={`${bride} & ${groom}`} className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h3 className="font-royal text-2xl text-white">{bride} &amp; {groom}</h3>
          <div className="flex items-end justify-center gap-1 h-6 mt-2">
            <span className="w-1 bg-emerald-400 rounded-full rev-eq-1" />
            <span className="w-1 bg-emerald-400 rounded-full rev-eq-2" />
            <span className="w-1 bg-emerald-400 rounded-full rev-eq-3" />
            <span className="w-1 bg-emerald-400 rounded-full rev-eq-2" />
          </div>
        </div>
        <button type="button" className="w-full py-3.5 rounded-full bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg">
          <Phone className="w-4 h-4" />
          <span>{activated ? 'Joining Celebration...' : copy.cta}</span>
        </button>
      </div>
    );
  }

  // 8. BISMILLAH IN INK — Emerald & Gold Calligraphy Ink Sweep
  if (copy.id === 'bismillah') {
    return (
      <div onClick={() => trigger(900)} className={`${clsBox} bg-gradient-to-br from-[#06281E] via-[#0B3B2E] to-[#041C14] text-[#FDE68A] p-7 border-2 border-[#D4AF37]/70 text-center space-y-4`}>
        <div className="relative overflow-hidden py-3 border-y border-[#D4AF37]/40">
          <p className="text-2xl sm:text-3xl font-serif tracking-wide text-[#FCD34D] drop-shadow" dir="rtl">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <div className={`rev-shimmer absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-200/35 to-transparent pointer-events-none ${activated ? 'opacity-100' : 'opacity-50'}`} />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.25em] uppercase text-amber-200/80">{copy.eyebrow}</p>
          <h3 className="font-royal text-2xl text-white">{bride} &amp; {groom}</h3>
        </div>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-stone-950 font-bold text-xs uppercase tracking-widest shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{activated ? copy.done : copy.cta}</span>
        </div>
      </div>
    );
  }

  // 9. FOIL CARD — Embossed Gold Foil Tilt & Specular Gleam
  if (copy.id === 'foil-card') {
    return (
      <div
        onClick={() => trigger(850)}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const rx = (((e.clientY - r.top) / r.height) - 0.5) * -10;
          const ry = (((e.clientX - r.left) / r.width) - 0.5) * 10;
          setTilt({ rx, ry });
        }}
        onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
        style={{ transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
        className={`${clsBox} bg-gradient-to-br from-[#FFFDF8] to-[#F3EAD8] text-[#2B1E17] border-2 border-[#D4AF37] p-7 text-center space-y-4`}
      >
        <div className="rev-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300/35 to-transparent pointer-events-none" />
        <div className="border border-[#D4AF37]/60 p-5 rounded-xl space-y-3 relative">
          <div className="w-12 h-12 rounded-full mx-auto border-2 border-[#B8860B] flex items-center justify-center font-royal font-bold text-[#8B6F47] bg-amber-50">
            {bInit}&amp;{gInit}
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#8B6F47] font-bold">Stamped Gold Foil</p>
          <h3 className="font-royal text-2xl text-[#2B1E17]">{bride} &amp; {groom}</h3>
          <p className="text-xs text-stone-600">{displayDate} · {city}</p>
        </div>
        <button type="button" className="w-full py-3 rounded-full bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#AA771C] text-stone-950 font-bold text-xs uppercase tracking-widest shadow-md">
          {activated ? copy.done : copy.cta}
        </button>
      </div>
    );
  }

  // 10. QUICK DELIVERY — 10 Mins Express Parcel Unbox
  if (copy.id === 'quick-delivery') {
    return (
      <div onClick={() => trigger(850)} className={`${clsBox} inv-modal p-6 text-center space-y-4`}>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/15 text-emerald-600 border border-emerald-500/40 px-3 py-1 rounded-full">
          <Package className="w-3.5 h-3.5" />
          <span>Arriving in 10 Mins · VIP Express</span>
        </span>
        <div className="relative h-28 flex items-center justify-center">
          <div className={`transition-all duration-500 px-5 py-3 rounded-xl bg-amber-50 text-stone-900 border-2 border-amber-400 shadow-lg ${activated ? 'scale-105 opacity-100 -translate-y-2' : 'scale-75 opacity-0'}`}>
            <p className="font-royal font-bold text-sm">You&apos;re Invited! · {bInit}&amp;{gInit}</p>
          </div>
          <div className={`uni-box-lid absolute inset-x-10 py-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-xl flex flex-col items-center justify-center`}>
            <span className="text-3xl">📦</span>
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Priority Shaadi Box</span>
          </div>
        </div>
        <button type="button" className="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">
          {activated ? copy.done : copy.cta}
        </button>
      </div>
    );
  }

  // 11. SHAADI STORY — Close Friends Instagram ring & progress bars
  if (copy.id === 'shaadi-story') {
    return (
      <div onClick={() => trigger(950)} className={`${clsBox} inv-modal p-6 text-center space-y-4`}>
        <div className="flex gap-1.5 px-1">
          {[0, 1, 2].map((seg) => (
            <div key={seg} className="flex-1 h-1 rounded-full bg-black/15 overflow-hidden">
              <div
                style={activated ? { animation: `revStoryProgress 0.3s linear ${seg * 0.25}s forwards`, backgroundColor: 'var(--pal-accent)' } : undefined}
                className="h-full w-0 rounded-full"
              />
            </div>
          ))}
        </div>
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-emerald-500">
            <div className="w-full h-full rounded-full inv-surface p-0.5 overflow-hidden">
              <img src={photo} alt="Story" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
          <span className="absolute bottom-0 right-0 bg-[#059669] text-white w-6 h-6 rounded-full text-xs font-bold shadow flex items-center justify-center">★</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest inv-pill px-2.5 py-0.5 rounded-full inline-block">Close Friends Only</span>
          <h3 className="font-royal text-2xl inv-heading mt-1">{bride} &amp; {groom}&apos;s Story</h3>
        </div>
        <button type="button" className="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">
          {activated ? copy.done : copy.cta}
        </button>
      </div>
    );
  }

  // 12. TYING THE KNOT — Two Silk Ribbons tying Gathbandhan
  if (copy.id === 'tying-knot') {
    return (
      <div onClick={() => trigger(850)} className={`${clsBox} inv-modal p-6 text-center space-y-4`}>
        <span className="text-[10px] tracking-[0.25em] uppercase font-bold inv-pill px-3 py-1 rounded-full inline-block">{copy.eyebrow}</span>
        <div className="relative h-24 flex items-center justify-center overflow-hidden">
          <div className={`h-4 w-32 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 shadow transition-all duration-700 ${activated ? 'translate-x-5 rotate-12' : '-translate-x-10 -rotate-6'}`} />
          <div className={`z-10 w-10 h-10 rounded-full border-2 border-[#D4AF37] bg-amber-100 text-rose-700 flex items-center justify-center shadow-lg transition-transform duration-500 ${activated ? 'scale-125 rotate-45' : 'scale-90 opacity-60'}`}>
            🎀
          </div>
          <div className={`h-4 w-32 rounded-full bg-gradient-to-l from-amber-500 to-rose-600 shadow transition-all duration-700 ${activated ? '-translate-x-5 -rotate-12' : 'translate-x-10 rotate-6'}`} />
        </div>
        <h3 className="font-royal text-2xl inv-heading">{bride} &amp; {groom}</h3>
        <button type="button" className="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">
          {activated ? copy.done : copy.cta}
        </button>
      </div>
    );
  }

  // 13. LOTUS BLOOM — Concentric SVG Sacred Lotus unfolding
  if (copy.id === 'lotus-bloom') {
    return (
      <div onClick={() => trigger(900)} className={`${clsBox} bg-gradient-to-b from-[#0F2A2E] to-[#081A1D] text-[#FCE7F3] border-2 border-amber-400/50 p-6 text-center space-y-3`}>
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-300 font-bold block">{copy.eyebrow}</span>
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
            <g className="uni-lotus-outer" fill="#BE185D" opacity="0.85">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <ellipse key={deg} cx="60" cy="24" rx="11" ry="24" transform={`rotate(${deg} 60 60)`} stroke="#FCD34D" strokeWidth="1" />
              ))}
            </g>
            <g className="uni-lotus-inner" fill="#F472B6">
              {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => (
                <ellipse key={deg} cx="60" cy="34" rx="8" ry="18" transform={`rotate(${deg} 60 60)`} stroke="#FEF08A" strokeWidth="1" />
              ))}
            </g>
            <circle cx="60" cy="60" r="18" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
            <text x="60" y="64" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350F">{bInit}&amp;{gInit}</text>
          </svg>
        </div>
        <h3 className="font-royal text-xl text-white">{bride} &amp; {groom}</h3>
        <button type="button" className="w-full py-3 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-lg">
          {activated ? copy.done : copy.cta}
        </button>
      </div>
    );
  }

  // 14. LAMPS OF THE PALACE — Lighting 5 Palace Diyas
  if (copy.id === 'lamps-palace') {
    return (
      <div onClick={() => trigger(950)} className={`${clsBox} bg-gradient-to-b from-[#1F1224] via-[#2D182F] to-[#1A0D1C] text-amber-100 border-2 border-amber-400/60 p-6 text-center space-y-4`}>
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-300 font-bold block">{copy.eyebrow}</span>
        <div className="flex justify-center items-end gap-3 h-20 py-2">
          {[0, 1, 2, 3, 4].map((idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                style={{ transitionDelay: `${idx * 90}ms` }}
                className={`w-4 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 transition-all duration-300 ${activated ? 'opacity-100 scale-110 rev-flame' : 'opacity-15 scale-50'}`}
              />
              <div className="w-7 h-3 rounded-b-full bg-amber-600 border-t border-amber-300" />
            </div>
          ))}
        </div>
        <h3 className="font-royal text-2xl text-amber-50">{bride} &amp; {groom}</h3>
        <button type="button" className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-lg">
          {activated ? copy.done : copy.cta}
        </button>
      </div>
    );
  }

  // 15. INTO THE GARDEN — Wrought Iron Bougainvillea Conservatory Gates
  if (copy.id === 'into-garden') {
    return (
      <div onClick={() => trigger(900)} className={`${clsBox} aspect-[4/3] inv-modal flex items-center justify-center p-6`} style={{ perspective: '1000px' }}>
        <div className="text-center space-y-2 z-0">
          <span className="text-3xl">🌺</span>
          <h3 className="font-royal text-2xl inv-heading">{bride} &amp; {groom}</h3>
          <UnlockBanner label={copy.done} active={activated} />
        </div>
        <div className="uni-door-l absolute inset-y-0 left-0 w-1/2 z-10 bg-emerald-950/90 border-r-2 border-emerald-400/50 flex items-center justify-end pr-3 text-rose-400 text-2xl">🌸</div>
        <div className="uni-door-r absolute inset-y-0 right-0 w-1/2 z-10 bg-emerald-950/90 border-l-2 border-emerald-400/50 flex items-center justify-start pl-3 text-rose-400 text-2xl">🌺</div>
        {!activated && (
          <span className="relative z-20 px-4 py-2 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-widest shadow-xl">
            {copy.cta}
          </span>
        )}
      </div>
    );
  }

  // 16. THE WEDDING SCROLL — Royal Zardozi Unrolling Farman
  if (copy.id === 'wedding-scroll') {
    return (
      <div onClick={() => trigger(900)} className={`${clsBox} inv-modal p-6 text-center space-y-3`}>
        <span className="text-[10px] tracking-[0.25em] uppercase font-bold inv-accent block">{copy.eyebrow}</span>
        <div className="mx-auto w-[88%] flex flex-col items-center">
          <div className="w-full h-4 rounded-full bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] shadow-md" />
          <div className="uni-scroll-body w-[92%] bg-[#FDF6E7] text-[#3B2214] border-x-4 border-[#D4AF37]/60 px-4 py-3 text-center shadow-inner">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#8B6F47] font-bold">Royal Farman</p>
            <h3 className="font-royal text-2xl mt-1">{bride} &amp; {groom}</h3>
            <p className="text-xs text-stone-600 mt-1">{displayDate} · {city}</p>
          </div>
          <div className="w-full h-4 rounded-full bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] shadow-md" />
        </div>
        <button type="button" className="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">
          {activated ? copy.done : copy.cta}
        </button>
      </div>
    );
  }

  // 17. LOVEBIRD POST — Two Lovebirds Gliding With Postcard
  if (copy.id === 'lovebird-post') {
    return (
      <div onClick={() => trigger(850)} className={`${clsBox} inv-modal p-6 text-center space-y-4`}>
        <span className="text-[10px] tracking-[0.25em] uppercase font-bold inv-pill px-3 py-1 rounded-full inline-block">{copy.eyebrow}</span>
        <div className="h-24 flex items-center justify-center gap-4">
          <span className={`text-3xl transition-transform duration-700 ${activated ? 'translate-x-8 -translate-y-2 rotate-12' : '-translate-x-2'}`}>🕊️</span>
          <div className="px-4 py-2 rounded-xl inv-surface border-2 shadow-md font-royal font-bold inv-heading" style={{ borderColor: 'var(--pal-accent)' }}>
            {bInit} 💌 {gInit}
          </div>
          <span className={`text-3xl transition-transform duration-700 scale-x-[-1] ${activated ? '-translate-x-8 -translate-y-2' : 'translate-x-2'}`}>🕊️</span>
        </div>
        <h3 className="font-royal text-2xl inv-heading">{bride} &amp; {groom}</h3>
        <button type="button" className="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">
          {activated ? copy.done : copy.cta}
        </button>
      </div>
    );
  }

  // 18. BALLROOM LIGHTS — Grand Chandelier Switch
  if (copy.id === 'ballroom-lights') {
    return (
      <div onClick={() => trigger(900)} className={`${clsBox} transition-colors duration-700 border-2 border-[#D4AF37] p-6 text-center space-y-4 ${activated ? 'bg-gradient-to-b from-[#3B2A12] via-[#593E18] to-[#261A0A] text-amber-50' : 'bg-[#121014] text-stone-300'}`}>
        <div className={`text-4xl transition-all duration-700 ${activated ? 'scale-125 drop-shadow-[0_0_25px_rgba(255,215,0,0.95)]' : 'opacity-45'}`}>✨👑✨</div>
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-amber-300 font-bold">{copy.eyebrow}</p>
          <h3 className="font-royal text-2xl text-white mt-1">{bride} &amp; {groom}</h3>
        </div>
        <button type="button" className="w-full py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FDE68A] text-stone-950 font-bold text-xs uppercase tracking-widest shadow-lg">
          {activated ? copy.done : copy.cta}
        </button>
      </div>
    );
  }

  // 19. HALL OF MIRRORS — Sheesh Mahal Sliding Reflections
  if (copy.id === 'hall-mirrors') {
    return (
      <div onClick={() => trigger(850)} className={`${clsBox} aspect-[4/3] inv-modal flex items-center justify-center p-6`}>
        <div className="text-center space-y-2 z-0">
          <Sparkle className="w-8 h-8 mx-auto inv-accent" />
          <h3 className="font-royal text-2xl inv-heading">{bride} &amp; {groom}</h3>
          <UnlockBanner label={copy.done} active={activated} />
        </div>
        <div className="uni-slide-l absolute inset-y-0 left-0 w-1/2 z-10 bg-gradient-to-br from-slate-200 via-amber-100 to-slate-300 border-r-2 border-amber-400/70 opacity-90" />
        <div className="uni-slide-r absolute inset-y-0 right-0 w-1/2 z-10 bg-gradient-to-bl from-slate-200 via-amber-100 to-slate-300 border-l-2 border-amber-400/70 opacity-90" />
        {!activated && (
          <span className="relative z-20 px-5 py-2.5 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest shadow-xl">
            {copy.cta}
          </span>
        )}
      </div>
    );
  }

  // 20. HORN OK PLEASE — Desi Truck Art Marquee Horn
  if (copy.id === 'horn-ok') {
    return (
      <div onClick={() => trigger(850)} className={`${clsBox} bg-gradient-to-br from-[#9F1239] via-[#D97706] to-[#047857] p-6 text-center text-white border-4 border-amber-300 space-y-3`}>
        <div className="bg-stone-950/75 rounded-2xl p-4 border-2 border-dashed border-amber-300 space-y-2">
          <p className="text-xs font-black tracking-[0.3em] text-amber-300 uppercase">★ HORN OK PLEASE ★</p>
          <h3 className="font-royal text-2xl text-white">{bride} weds {groom}</h3>
          <p className="text-xs text-amber-100">{city} Express · {displayDate}</p>
        </div>
        <button type="button" className={`w-full py-3.5 rounded-full bg-amber-300 text-stone-950 font-black text-xs uppercase tracking-widest shadow-xl transition-transform ${activated ? 'scale-105' : ''}`}>
          {activated ? '🎺 PEEP PEEP! BARAAT READY!' : copy.cta}
        </button>
      </div>
    );
  }

  // 21. IK ONKAR — Golden Sunburst Sacred Blessing
  if (copy.id === 'ik-onkar') {
    return (
      <div onClick={() => trigger(900)} className={`${clsBox} inv-modal p-7 text-center space-y-4`}>
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <span className={`rev-ripple absolute inset-0 rounded-full border-2 ${activated ? 'opacity-100' : 'opacity-40'}`} style={{ borderColor: 'var(--pal-accent)' }} />
          <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center bg-amber-50/90 text-[#B45309] font-bold text-3xl shadow-lg" style={{ borderColor: '#D4AF37' }}>
            ੴ
          </div>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.28em] uppercase inv-accent font-bold">{copy.eyebrow}</p>
          <h3 className="font-royal text-2xl inv-heading mt-1">{bride} &amp; {groom}</h3>
        </div>
        <button type="button" className="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">
          {activated ? copy.done : copy.cta}
        </button>
      </div>
    );
  }

  // 22. GURDWARA ENTRANCE — Golden Sanctuary Gates
  if (copy.id === 'gurdwara') {
    return (
      <div onClick={() => trigger(900)} className={`${clsBox} aspect-[4/3] inv-modal flex items-center justify-center p-6`} style={{ perspective: '1000px' }}>
        <div className="text-center space-y-2 z-0">
          <span className="text-2xl">🕌✨</span>
          <h3 className="font-royal text-2xl inv-heading">{bride} &amp; {groom}</h3>
          <UnlockBanner label={copy.done} active={activated} />
        </div>
        <div className="uni-door-l absolute inset-y-0 left-0 w-1/2 z-10 bg-gradient-to-b from-amber-50 to-amber-200 border-r-2 border-amber-500 flex items-center justify-end pr-3 text-amber-800 font-bold">ੴ</div>
        <div className="uni-door-r absolute inset-y-0 right-0 w-1/2 z-10 bg-gradient-to-b from-amber-50 to-amber-200 border-l-2 border-amber-500 flex items-center justify-start pl-3 text-amber-800 font-bold">✨</div>
        {!activated && (
          <span className="relative z-20 px-5 py-2.5 rounded-full bg-amber-600 text-white font-bold text-xs uppercase tracking-widest shadow-xl">
            {copy.cta}
          </span>
        )}
      </div>
    );
  }

  // 23. ROOM KEY — Beach Resort Suite RFID Tap
  if (copy.id === 'room-key') {
    return (
      <div onClick={() => trigger(850)} className={`${clsBox} bg-gradient-to-br from-[#0B2B3C] to-[#134E5E] text-white p-6 border-2 border-amber-300/60 text-center space-y-4`}>
        <span className="text-[10px] tracking-[0.25em] uppercase text-cyan-200 font-bold block">{copy.eyebrow}</span>
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="uni-keycard w-32 h-20 rounded-xl bg-gradient-to-br from-amber-100 to-amber-300 text-stone-900 p-2.5 text-left shadow-xl border border-white/60 flex flex-col justify-between">
            <Key className="w-4 h-4 text-amber-800" />
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wider text-amber-900">VIP Suite</p>
              <p className="font-royal text-sm font-bold">{bInit} &amp; {gInit}</p>
            </div>
          </div>
          <div className={`w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-colors ${activated ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200' : 'bg-black/40 border-cyan-300/40 text-cyan-200'}`}>
            {activated ? <Check className="w-6 h-6" /> : <span className="text-[9px] font-bold uppercase">Tap</span>}
          </div>
        </div>
        <button type="button" className="w-full py-3 rounded-full bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-widest">
          {activated ? copy.done : copy.cta}
        </button>
      </div>
    );
  }

  // 24. BIOSCOPE — Vintage Carnival Viewing Box & Crank
  return (
    <div onClick={() => trigger(900)} className={`${clsBox} bg-gradient-to-br from-[#6B1220] via-[#8E1B2E] to-[#4A0B15] text-amber-100 p-6 border-2 border-amber-400/70 text-center space-y-4`}>
      <span className="text-[10px] tracking-[0.28em] uppercase text-amber-300 font-bold block">{copy.eyebrow}</span>
      <div className="flex items-center justify-center gap-4 py-2">
        <div className="flex gap-3">
          {[0, 1].map((eye) => (
            <div key={eye} className={`w-16 h-16 rounded-full border-4 border-amber-400 overflow-hidden shadow-inner transition-transform duration-700 ${activated ? 'scale-115' : 'scale-95'}`}>
              <img src={photo} alt="Bioscope view" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="uni-crank w-9 h-9 rounded-full border-2 border-amber-300 bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-lg">
          ⚙
        </div>
      </div>
      <h3 className="font-royal text-2xl text-white">{bride} &amp; {groom}</h3>
      <button type="button" className="w-full py-3 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-lg">
        {activated ? copy.done : copy.cta}
      </button>
    </div>
  );
}
