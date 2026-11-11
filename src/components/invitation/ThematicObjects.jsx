import React, { useState, useEffect, useRef } from 'react';
import { Compass, Sparkles, Heart, Copy, Check, MapPin, Calendar, Clock, Phone, Car, Bed, Send, Music } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { triggerCelebration } from '../../utils/confetti';
import { getThemeEventImage } from '../../utils/themeImages';
import { getThemeDesign, renderThemeDividerHtml } from '../../utils/themeDecorConfig';

/**
 * 1. INDIAN BIOSCOPE BOOTH (from Wishlys video frame 130)
 * An authentic vintage Indian traveling cinema bioscope on a wooden tripod,
 * with red & gold scalloped marquee roof, brass crank handle, and a circular
 * golden beaded lens framing the couple.
 */
export function BioscopeBooth({ couplePhoto, names = 'Bride & Groom' }) {
  return (
    <div className="relative my-8 flex flex-col items-center select-none">
      {/* Bioscope Structure */}
      <div className="relative w-64 sm:w-72">
        {/* Scalloped Awning Roof */}
        <div className="w-full flex justify-center -mb-1 z-20 relative">
          <div className="w-48 h-8 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-t-xl shadow-md flex justify-around items-end overflow-hidden border-t-2 border-amber-300">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-6 h-5 rounded-b-full shadow-inner ${
                  i % 2 === 0 ? 'bg-amber-300' : 'bg-red-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Cinema Box */}
        <div className="w-full bg-gradient-to-b from-[#8B1E1E] to-[#681212] rounded-2xl p-4 border-4 border-[#D4AF37] shadow-2xl relative z-10 text-center">
          {/* Decorative Corner Rivets / Golden Studs */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-amber-300 border border-amber-600" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-300 border border-amber-600" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-amber-300 border border-amber-600" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-amber-300 border border-amber-600" />

          {/* Side Crank Handle */}
          <div className="absolute -right-5 top-1/2 -translate-y-1/2 flex items-center z-20">
            <div className="w-4 h-2 bg-amber-600 rounded-l" />
            <div className="w-2 h-10 bg-amber-400 rounded-full border border-amber-700 animate-spin origin-center" style={{ animationDuration: '6s' }}>
              <div className="w-3 h-3 rounded-full bg-amber-600 -ml-0.5 -mt-1 shadow" />
            </div>
          </div>

          {/* Central Circular Viewing Lens */}
          <div className="w-36 h-36 mx-auto rounded-full p-1.5 bg-gradient-to-br from-[#D4AF37] via-[#FFF8DC] to-[#AA771C] shadow-inner relative group">
            {/* Golden Beaded Rim */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-200 pointer-events-none" />
            
            {/* The Lens Glass with Couple Photo */}
            <div className="w-full h-full rounded-full overflow-hidden bg-black/60 relative border border-amber-700">
              <img 
                src={couplePhoto || './images/templates/mela.webp'} 
                alt={names}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/50 pointer-events-none" />
            </div>
          </div>

          {/* Bioscope Plaque */}
          <div className="mt-3 bg-[#FFFDF7] border border-[#D4AF37] py-1 px-3 rounded-full inline-block shadow-sm">
            <span className="font-royal text-[10px] uppercase font-bold tracking-widest text-[#8B1E1E]">
              ★ BIOSCOPE SHAADI CINEMA ★
            </span>
          </div>
        </div>

        {/* Wooden Tripod Legs */}
        <div className="w-full flex justify-between px-6 -mt-2 z-0 relative">
          <div className="w-2.5 h-16 bg-[#5C3A21] rounded-b -rotate-12 shadow" />
          <div className="w-2.5 h-16 bg-[#4A2D17] rounded-b shadow" />
          <div className="w-2.5 h-16 bg-[#5C3A21] rounded-b rotate-12 shadow" />
        </div>
      </div>

      {/* Draped Marigold Garlands on both sides */}
      <div className="w-full max-w-xs flex justify-between -mt-20 px-2 pointer-events-none">
        <div className="flex flex-col gap-1 items-center animate-sway">
          <span className="text-xl">🌼</span>
          <span className="text-xl">🏵️</span>
          <span className="text-xl">🌼</span>
          <span className="text-xl">🏵️</span>
        </div>
        <div className="flex flex-col gap-1 items-center animate-sway" style={{ animationDelay: '1s' }}>
          <span className="text-xl">🏵️</span>
          <span className="text-xl">🌼</span>
          <span className="text-xl">🏵️</span>
          <span className="text-xl">🌼</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. AUTHENTIC DIRECTIONAL ROAD SIGNPOST (from Wishlys video frame 160)
 * Wooden milestone post with festive pennant bunting and painted arrows:
 * - Green arrow: "Shaadi this way ➜"
 * - Magenta arrow: Venue name & address
 * - Golden yellow arrow button: "Get directions" (opens Google Maps)
 */
export function DirectionalSignpost({ venue, address, mapsUrl }) {
  return (
    <div className="relative my-8 flex flex-col items-center">
      {/* Festive Pennant Bunting Flags above signpost */}
      <div className="w-full max-w-sm flex justify-center gap-1.5 mb-2 overflow-hidden pointer-events-none">
        {['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#F97316'].map((color, i) => (
          <div 
            key={i}
            className="w-6 h-7 origin-top animate-sway"
            style={{ 
              backgroundColor: color, 
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Section Title */}
      <div className="text-center mb-4">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47]">WHERE IT'S ALL HAPPENING</span>
        <h3 className="font-serif text-3xl font-light text-[#8B1E1E]">The Venue</h3>
      </div>

      {/* Signpost Board Assembly */}
      <div className="relative flex flex-col items-center w-full max-w-md px-4">
        {/* Main Vertical Wooden Pole */}
        <div className="absolute top-0 bottom-0 w-5 bg-gradient-to-r from-[#6A462F] via-[#8B5A3E] to-[#543623] rounded-t-lg shadow-lg z-0" />

        {/* 1. Green Arrow: Shaadi this way */}
        <div className="relative z-10 w-full max-w-xs mb-3 flex justify-end">
          <div 
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white py-2 px-6 shadow-lg transition-transform hover:scale-105 select-none"
            style={{ clipPath: 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)' }}
          >
            <span className="text-xs font-royal font-bold tracking-widest uppercase drop-shadow-sm flex items-center gap-1.5">
              Shaadi this way ➜
            </span>
          </div>
        </div>

        {/* 2. Magenta/Plum Arrow: Venue & City */}
        <div className="relative z-10 w-full max-w-xs mb-3 flex justify-start">
          <div 
            className="bg-gradient-to-r from-[#7B1FA2] to-[#6A1B9A] text-white py-2.5 px-6 shadow-lg transition-transform hover:scale-105 select-none max-w-[280px]"
            style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)' }}
          >
            <p className="text-xs font-serif font-bold tracking-wide drop-shadow-sm leading-tight text-right">
              {venue || 'Umaid Bhawan Palace'}
            </p>
            <p className="text-[10px] text-stone-200 font-sans tracking-tight text-right">
              {address || 'Jodhpur, Rajasthan'}
            </p>
          </div>
        </div>

        {/* 3. Golden Yellow Arrow Button: Get Directions */}
        <div className="relative z-10 w-full max-w-xs flex justify-end">
          <a
            href={mapsUrl || `https://maps.google.com/?q=${encodeURIComponent((venue || '') + ' ' + (address || ''))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white py-2 px-6 shadow-xl transition-all hover:scale-105 flex items-center gap-2 group cursor-pointer"
            style={{ clipPath: 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)' }}
          >
            <Compass className="w-3.5 h-3.5 text-white group-hover:rotate-45 transition-transform" />
            <span className="text-xs font-bold tracking-wider uppercase font-sans">
              Get directions
            </span>
          </a>
        </div>

        {/* Pole Milestone Base */}
        <div className="w-16 h-5 bg-[#3E2723] rounded-t-full shadow-md mt-4 z-10" />
      </div>
    </div>
  );
}

/**
 * 3. RAJASTHANI JHAROKHA ARCHED PHOTO GALLERY (from Wishlys video frame 210)
 * Photos encased inside authentic palace jharokha arched window frames with
 * golden filigree borders, cusped arches, and hover zoom.
 */
export function JharokhaPhotoGallery({ photos = [], isDark = true }) {
  const defaultGallery = [
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', caption: 'Sangeet Night' },
    { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', caption: 'Mehndi Joy' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', caption: 'The Proposal' },
    { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80', caption: 'Golden Hour' },
  ];

  const galleryItems = photos.length ? photos : defaultGallery;

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A880]">Our Journey</span>
        <h3 className={`font-serif text-3xl font-light ${isDark ? 'text-[#F4ECDE]' : 'text-[#2B1E17]'}`}>
          Moments & Memories
        </h3>
        <div className="h-0.5 w-12 bg-[#C5A880] mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {galleryItems.map((item, idx) => (
          <div 
            key={idx}
            className={`group relative overflow-hidden rounded-t-[50px] rounded-b-xl border-2 border-[#C5A880] shadow-xl p-1 transition-transform duration-500 hover:-translate-y-1 ${
              isDark ? 'bg-[#0B252B]' : 'bg-white'
            }`}
          >
            {/* Cusped Jharokha Arch top outline */}
            <div className="w-full h-44 sm:h-52 rounded-t-[46px] rounded-b-lg overflow-hidden relative">
              <img 
                src={typeof item === 'string' ? item : item.url} 
                alt="Memory" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                <span className="text-[10px] font-medium text-white tracking-wider">
                  {typeof item === 'object' && item.caption ? item.caption : `Chapter ${idx + 1}`}
                </span>
              </div>
            </div>
            {/* Golden corner emblem */}
            <div className="text-center py-1.5">
              <span className="text-[9px] uppercase tracking-widest font-royal text-[#C5A880]">
                ✦ {typeof item === 'object' && item.caption ? item.caption : `Memory 0${idx + 1}`} ✦
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 4. HALDI & MEHNDI BRASS URLI SCENE (from Wishlys video frame 280)
 * Handcrafted Indian ceremonial brass Urli filled with water, floating yellow &
 * orange marigolds, floating diyas, and auspicious turmeric pastes.
 */
export function UrliCeremonyScene({ title = 'Haldi & Mehndi Ceremony' }) {
  return (
    <div className="relative my-6 flex flex-col items-center">
      {/* Ornate Brass Urli Bowl */}
      <div className="relative w-56 sm:w-64">
        {/* Urli Rim */}
        <div className="w-full h-20 rounded-full bg-gradient-to-b from-[#E6B800] via-[#AA7A1E] to-[#6A4706] border-2 border-[#FFE885] shadow-2xl p-2 flex items-center justify-center relative overflow-hidden">
          {/* Water Surface inside Urli */}
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2B7A78] to-[#17252A] shadow-inner relative flex items-center justify-center overflow-hidden">
            {/* Gentle Water Ripple */}
            <div className="absolute inset-0 bg-radial from-transparent to-black/30 pointer-events-none" />
            
            {/* Floating Marigold Petals */}
            <div className="absolute inset-0 flex items-center justify-around px-3 animate-pulse-glow">
              <span className="text-sm">🌼</span>
              <span className="text-base">🏵️</span>
              {/* Floating brass diya in center */}
              <div className="w-5 h-5 rounded-full bg-amber-400 border border-amber-700 flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              </div>
              <span className="text-base">🏵️</span>
              <span className="text-sm">🌼</span>
            </div>
          </div>
        </div>

        {/* Urli Brass Pedestal Stand */}
        <div className="w-20 h-4 mx-auto bg-gradient-to-r from-[#AA7A1E] via-[#FFE885] to-[#AA7A1E] rounded-b-xl shadow-md border-t border-amber-800" />
      </div>

      <div className="mt-2 text-center">
        <span className="text-[10px] tracking-widest uppercase font-bold text-[#8B6F47]">
          TRADITIONAL RITUALS & BLESSINGS
        </span>
      </div>
    </div>
  );
}

/**
 * 5. ROYAL WEDDING PHERAS MANDAP (from Wishlys video frame 350)
 * Majestic carved sandstone pillars supporting a domed floral mandap draped
 * with fresh red roses, white jasmine (mogra), and golden marigolds.
 */
export function RoyalWeddingMandap({ bride = 'Bride', groom = 'Groom' }) {
  return (
    <div className="relative my-6 flex flex-col items-center select-none">
      <div className="w-full max-w-sm rounded-2xl p-4 bg-gradient-to-b from-amber-50/70 to-rose-50/70 border border-[#D4AF37] shadow-md relative overflow-hidden">
        {/* Caricature Mandap Image */}
        <div className="w-full max-w-[260px] aspect-[9/16] mx-auto rounded-t-3xl overflow-hidden mb-3 border border-amber-200 shadow-sm bg-[#FFFDF7]">
          <img 
            src="./images/caricature/pheras_arch.webp" 
            alt="Main Pheras Mandap" 
            className="w-full h-full object-contain"
            onError={(e) => { e.target.src = './images/caricature/pheras.webp'; }}
          />
        </div>

        {/* Mandap Archway Graphic */}
        <div className="flex justify-between items-start mb-2">
          {/* Left Pillar */}
          <div className="flex flex-col items-center">
            <div className="w-5 h-2 bg-[#AA771C] rounded-t" />
            <div className="w-4 h-24 bg-gradient-to-b from-[#E5C158] via-[#FAF0BE] to-[#AA771C] border border-[#AA771C] rounded-sm relative">
              {/* Garland wrapping pillar */}
              <div className="absolute top-2 -left-1 text-[10px]">🏵️</div>
              <div className="absolute top-10 -right-1 text-[10px]">🌹</div>
              <div className="absolute bottom-2 -left-1 text-[10px]">🌼</div>
            </div>
            <div className="w-6 h-3 bg-[#AA771C] rounded-b shadow" />
          </div>

          {/* Domed Floral Canopy Roof */}
          <div className="flex-1 mx-2 flex flex-col items-center text-center">
            {/* Scalloped Floral Toran Hanging */}
            <div className="w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 h-2.5 rounded-full shadow-xs mb-1" />
            <div className="flex justify-around w-full text-xs">
              <span>🌹</span>
              <span>🌼</span>
              <span>🏵️</span>
              <span>🌼</span>
              <span>🌹</span>
            </div>

            {/* Sacred Hawan Kund in Center */}
            <div className="my-3 flex flex-col items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping shadow-lg" />
              <div className="w-10 h-4 bg-gradient-to-b from-[#8B4513] to-[#4A2508] rounded-b-md border border-amber-600 shadow-sm flex items-center justify-center">
                <span className="text-[8px] text-amber-200 font-bold">🔥</span>
              </div>
            </div>

            <p className="font-serif text-lg font-bold text-[#881337]">Main Pheras (The Wedding)</p>
            <span className="text-[9px] uppercase tracking-widest text-[#8B6F47] font-semibold">
              Sacred Vows Under The Royal Mandap
            </span>
          </div>

          {/* Right Pillar */}
          <div className="flex flex-col items-center">
            <div className="w-5 h-2 bg-[#AA771C] rounded-t" />
            <div className="w-4 h-24 bg-gradient-to-b from-[#E5C158] via-[#FAF0BE] to-[#AA771C] border border-[#AA771C] rounded-sm relative">
              {/* Garland wrapping pillar */}
              <div className="absolute top-2 -right-1 text-[10px]">🏵️</div>
              <div className="absolute top-10 -left-1 text-[10px]">🌹</div>
              <div className="absolute bottom-2 -right-1 text-[10px]">🌼</div>
            </div>
            <div className="w-6 h-3 bg-[#AA771C] rounded-b shadow" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 6. RADIATING CELEBRATION FIREWORKS & SPARKLERS (from Wishlys video frame 250)
 * Three radiant golden sparkler fireworks bursts with animated glowing rays,
 * glittering particles, and three diamond dots separator.
 */
export function CelebratoryFireworks() {
  return (
    <div className="my-8 flex flex-col items-center select-none pointer-events-none">
      <div className="flex items-center justify-center gap-6 sm:gap-10">
        {/* Left Medium Burst */}
        <div className="w-12 h-12 relative animate-firework" style={{ animationDelay: '0.3s' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="3">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <line 
                key={i} 
                x1="50" y1="50" 
                x2={50 + 40 * Math.cos(deg * Math.PI / 180)} 
                y2={50 + 40 * Math.sin(deg * Math.PI / 180)} 
                strokeDasharray="4,4"
              />
            ))}
            <circle cx="50" cy="50" r="4" fill="#D4AF37" />
          </svg>
        </div>

        {/* Center Large Starburst */}
        <div className="w-16 h-16 relative animate-firework">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#B8860B]" fill="none" stroke="currentColor" strokeWidth="3.5">
            {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg, i) => (
              <line 
                key={i} 
                x1="50" y1="50" 
                x2={50 + 46 * Math.cos(deg * Math.PI / 180)} 
                y2={50 + 46 * Math.sin(deg * Math.PI / 180)} 
                strokeDasharray="6,3"
              />
            ))}
            <circle cx="50" cy="50" r="6" fill="#F59E0B" />
          </svg>
        </div>

        {/* Right Small Burst */}
        <div className="w-10 h-10 relative animate-firework" style={{ animationDelay: '0.6s' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2.5">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <line 
                key={i} 
                x1="50" y1="50" 
                x2={50 + 38 * Math.cos(deg * Math.PI / 180)} 
                y2={50 + 38 * Math.sin(deg * Math.PI / 180)} 
                strokeDasharray="4,3"
              />
            ))}
            <circle cx="50" cy="50" r="3" fill="#D4AF37" />
          </svg>
        </div>
      </div>

      {/* Three Diamond Dots Separator (frame 250) */}
      <div className="flex items-center gap-2 mt-4 text-[#C5A880]">
        <span className="w-1.5 h-1.5 rotate-45 bg-[#C5A880]" />
        <span className="w-2 h-2 rotate-45 bg-[#8B6F47]" />
        <span className="w-1.5 h-1.5 rotate-45 bg-[#C5A880]" />
      </div>
    </div>
  );
}

/**
 * 7. ROTATING SUNBURST BACKGROUND (from Wishlys video frame 130)
 * Full-page festive radial sunburst rays for Marigold Mela
 */
export function FestiveSunburst() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15 z-0 flex items-center justify-center">
      <div 
        className="w-[180vw] h-[180vw] max-w-[1400px] max-h-[1400px] rounded-full animate-rotate-slow origin-center"
        style={{
          background: 'repeating-conic-gradient(from 0deg, #F59E0B 0deg 15deg, transparent 15deg 30deg)'
        }}
      />
    </div>
  );
}

/**
 * 8. BOUGAINVILLEA VINE CANOPY (from Wishlys video frame 580)
 * Lush overflowing arches of paper-cut magenta & pink bougainvillea floral branches
 */
export function BougainvilleaCanopy() {
  return (
    <div className="w-full pointer-events-none absolute top-0 left-0 right-0 z-30 flex justify-between px-2 pt-1 overflow-hidden">
      <div className="flex gap-1 animate-pulse-glow">
        <span className="text-2xl">🌺</span>
        <span className="text-xl">🌸</span>
        <span className="text-2xl">🌺</span>
        <span className="text-lg">🌿</span>
      </div>
      <div className="flex gap-1 animate-pulse-glow" style={{ animationDelay: '1.2s' }}>
        <span className="text-lg">🌿</span>
        <span className="text-2xl">🌺</span>
        <span className="text-xl">🌸</span>
        <span className="text-2xl">🌺</span>
      </div>
    </div>
  );
}


/**
 * 9. LUXE PASTEL CARICATURE FOLDING CARD DOORS REVEAL (from Wishlys video frame 005 - 012)
 * The pink folding card with scalloped window stitching and gold dots.
 * Tapping heart seal opens both shutters sideways with 3D animation, revealing the couple!
 */
export function PastelFoldingDoorsReveal({ onReveal, bride = 'Bride', groom = 'Groom', coverPhoto, templateId = 'caricature' }) {
  const [isOpen, setIsOpen] = useState(false);
  const design = getThemeDesign(templateId);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => {
      onReveal();
    }, 700);
  };

  return (
    <div className="relative min-h-[500px] w-full max-w-sm mx-auto flex flex-col items-center justify-center p-4 select-none">
      {/* Top Hanging Garland / Crest */}
      {design.isCaricature ? (
        <div className="w-full flex justify-center -mb-2 pointer-events-none">
          <svg viewBox="0 0 320 30" className="w-full h-auto text-amber-500">
            <path d="M0,5 Q80,25 160,5 Q240,25 320,5" stroke="#F59E0B" strokeWidth="3" strokeDasharray="5,4" fill="none" />
            {[20, 60, 100, 140, 180, 220, 260, 300].map((x, i) => (
              <circle key={i} cx={x} cy={7 + Math.sin(i) * 10} r="4.5" fill={i % 2 === 0 ? '#F59E0B' : '#EA580C'} />
            ))}
          </svg>
        </div>
      ) : (
        <div className="mb-2 flex items-center gap-2 inv-accent text-xs font-medium tracking-widest">
          <span>✦</span>
          <span>{design.invocation}</span>
          <span>✦</span>
        </div>
      )}

      {/* Header text */}
      <div className="text-center space-y-1 mb-5">
        <span className="text-[11px] font-cursive inv-eyebrow tracking-wider font-semibold block">You Are Cordially Invited</span>
        <h2 className="font-royal text-3xl font-light inv-heading flex items-center justify-center gap-2">
          <span>{bride}</span>
          <span className="text-rose-400 font-sans text-xl animate-pulse">♡</span>
          <span>{groom}</span>
        </h2>
        <div className="w-24 h-0.5 inv-rule mx-auto rounded-full" />
      </div>

      {/* 3D Folding Card Container */}
      <div 
        onClick={handleOpen}
        className="relative w-[88vw] max-w-[340px] aspect-[9/16] cursor-pointer group [perspective:1000px]"
      >
        {/* Inside Preview: Couple artwork */}
        <div className="inv-hero-card inv-hero-img-wrap absolute inset-0 shadow-inner overflow-hidden flex flex-col items-center justify-center p-0">
          <img 
            src={coverPhoto || `./images/caricature/scooter_couple.webp`} 
            alt={`${groom} & ${bride}`}
            className="w-full h-full object-contain object-center"
          />
        </div>

        {/* Left Folding Door */}
        <div 
          className={`absolute inset-y-0 left-0 w-1/2 border-y-2 border-l-2 rounded-l-2xl shadow-md transition-all duration-700 origin-left overflow-hidden ${
            isOpen ? '-rotate-y-110 opacity-0 pointer-events-none' : 'rotate-y-0 opacity-100 group-hover:-rotate-y-6'
          }`}
          style={{ transformStyle: 'preserve-3d', backgroundColor: 'var(--pal-door-left, #FCE7F3)', borderColor: 'var(--pal-card-border, #F472B6)' }}
        >
          <div className="w-full h-full p-2 relative flex flex-col justify-between">
            <div className="flex gap-1.5 pt-1">
              {[0, 1, 2, 3, 4].map(i => (
                <span key={i} className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--pal-accent, #F59E0B)', opacity: 0.75 }} />
              ))}
            </div>
            <div className="w-full h-[72%] rounded-tl-[40px] border-r-0 border-2 flex items-center justify-end" style={{ borderColor: 'var(--pal-card-border)', backgroundColor: 'var(--pal-pill-bg)' }}>
              <div className="w-6 h-6 rounded-l-full" style={{ backgroundColor: 'var(--pal-accent)', opacity: 0.35 }} />
            </div>
            <div className="h-4" />
          </div>
        </div>

        {/* Right Folding Door */}
        <div 
          className={`absolute inset-y-0 right-0 w-1/2 border-y-2 border-r-2 rounded-r-2xl shadow-md transition-all duration-700 origin-right overflow-hidden ${
            isOpen ? 'rotate-y-110 opacity-0 pointer-events-none' : 'rotate-y-0 opacity-100 group-hover:rotate-y-6'
          }`}
          style={{ transformStyle: 'preserve-3d', backgroundColor: 'var(--pal-door-right, #FCE7F3)', borderColor: 'var(--pal-card-border, #F472B6)' }}
        >
          <div className="w-full h-full p-2 relative flex flex-col justify-between items-end">
            <div className="flex gap-1.5 pt-1">
              {[0, 1, 2, 3, 4].map(i => (
                <span key={i} className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--pal-accent, #F59E0B)', opacity: 0.75 }} />
              ))}
            </div>
            <div className="w-full h-[72%] rounded-tr-[40px] border-l-0 border-2 flex items-center justify-start" style={{ borderColor: 'var(--pal-card-border)', backgroundColor: 'var(--pal-pill-bg)' }}>
              <div className="w-6 h-6 rounded-r-full" style={{ backgroundColor: 'var(--pal-accent)', opacity: 0.35 }} />
            </div>
            <div className="h-4" />
          </div>
        </div>

        {/* Center Heart Seal Button */}
        <div 
          className={`inv-pill absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border-2 shadow-lg flex items-center justify-center transition-all duration-500 ${
            isOpen ? 'scale-150 opacity-0' : 'group-hover:scale-110 animate-pulse'
          }`}
        >
          <span className="text-rose-500 text-lg">❤️</span>
        </div>

        {/* Bottom Theme Seal */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 select-none pointer-events-none">
          <span className="text-3xl drop-shadow-md">{design.closingEmoji || '✨'}</span>
        </div>
      </div>

      {/* Tap to Open Footer */}
      <div className="mt-8 text-center">
        <div className="w-32 h-px inv-rule mx-auto mb-2" />
        <span className="text-xs font-semibold inv-muted tracking-widest uppercase animate-bounce inline-block">
          👆 Tap to Open
        </span>
      </div>
    </div>
  );
}

/**
 * INTERACTIVE SCROLL REVEAL HELPER (Matching export-1793962607603.mp4)
 * Smoothly triggers animations when scrolling down inside either the
 * Studio Phone Simulator (.overflow-y-auto) or the main browser window.
 */
export function ScrollReveal({ 
  children, 
  variant = 'fade-up', 
  delay = 0, 
  className = '',
  threshold = 0.12 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const el = domRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const scrollParent = el.closest('.overflow-y-auto') || null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: scrollParent,
      threshold,
      rootMargin: '0px 0px -25px 0px'
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getVariantStyles = () => {
    if (!isVisible) {
      switch (variant) {
        case 'tilt-left':
          return 'opacity-0 -translate-x-6 translate-y-7 -rotate-6 scale-95';
        case 'tilt-right':
          return 'opacity-0 translate-x-6 translate-y-7 rotate-6 scale-95';
        case 'pop-up':
          return 'opacity-0 translate-y-8 scale-[0.93]';
        case 'calendar-drop':
          return 'opacity-0 -translate-y-8 -rotate-2 scale-95';
        case 'bounce-in':
          return 'opacity-0 scale-50';
        case 'scooter-drive':
          return 'opacity-0 -translate-x-24';
        case 'fade-up':
        default:
          return 'opacity-0 translate-y-6';
      }
    }

    switch (variant) {
      case 'tilt-left':
        return 'opacity-100 translate-x-0 translate-y-0 -rotate-2 scale-100';
      case 'tilt-right':
        return 'opacity-100 translate-x-0 translate-y-0 rotate-2 scale-100';
      case 'pop-up':
        return 'opacity-100 translate-y-0 scale-100';
      case 'calendar-drop':
        return 'opacity-100 translate-y-0 rotate-0 scale-100';
      case 'bounce-in':
        return 'opacity-100 scale-100';
      case 'scooter-drive':
        return 'opacity-100 translate-x-0';
      case 'fade-up':
      default:
        return 'opacity-100 translate-y-0';
    }
  };

  return (
    <div 
      ref={domRef}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${getVariantStyles()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * 10. LUXE PASTEL CARICATURE HERO (from Wishlys video frame 014 - 020)
 * Top-left pinned tag "Save the date", Ganesha invocation, couple names,
 * authentic scooter couple artwork, and "Request the honour of your presence".
 */
export function PastelCaricatureHero({ 
  couplePhoto, 
  bride = 'Preeti', 
  groom = 'Ashish',
  date = '2026-12-09',
  monogram,
  palette,
  templateId = 'caricature'
}) {
  const design = getThemeDesign(templateId);
  const d = new Date(date || '2026-12-09');
  const formattedDate = !isNaN(d.getTime()) 
    ? `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`
    : '9 Dec 2026';

  return (
    <div className="relative my-2 flex flex-col items-center select-none w-full max-w-[390px] mx-auto px-2">
      <ScrollReveal variant="pop-up" className="w-full">
        {/* Top Draped Swags for Caricature vs Theme Crest Accent */}
        {design.isCaricature ? (
          <div className="w-full flex justify-around items-start -mb-2 px-6 pointer-events-none">
            <svg viewBox="0 0 400 40" className="w-full h-auto text-amber-500 animate-sway" fill="none">
              <path d="M0,5 Q100,35 200,5 Q300,35 400,5" stroke="#F59E0B" strokeWidth="4" strokeDasharray="6,4" />
              <path d="M0,8 Q100,38 200,8 Q300,38 400,8" stroke="#EA580C" strokeWidth="3" />
              {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map((x, i) => (
                <circle key={i} cx={x} cy={12 + Math.sin(i) * 12} r="5" fill={i % 2 === 0 ? '#F59E0B' : '#EA580C'} />
              ))}
            </svg>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 mb-2 px-4 pointer-events-none inv-accent text-xs opacity-90">
            <div className="h-px flex-1 inv-rule opacity-60" />
            <span>{design.closingEmoji || '✦'}</span>
            <div className="h-px flex-1 inv-rule opacity-60" />
          </div>
        )}

        {/* Theme-Adaptive Hero Arch / Card Frame */}
        <div className="inv-hero-card relative w-full p-3 shadow-xl overflow-hidden text-center">
          {/* Monogram Seal Badge if initials present */}
          {monogram?.initials && (
            <div 
              className="inv-surface w-12 h-12 mx-auto mb-1.5 rounded-full border-2 flex items-center justify-center shadow-sm font-royal text-xs font-bold tracking-widest backdrop-blur-xs"
              style={{ borderColor: 'var(--pal-accent)', color: 'var(--pal-heading)' }}
            >
              {monogram.initials}
            </div>
          )}

          {/* Theme-Authentic Invocation */}
          <div className="pt-1 pb-0.5">
            <span className="text-[11px] inv-accent font-medium tracking-wide block">
              {design.invocation}
            </span>
            <p className="text-[10px] uppercase tracking-widest font-bold inv-muted mt-0.5">
              Together With Their Families
            </p>
          </div>

          {/* Main Couple Names */}
          <h1 className="font-royal text-3xl sm:text-4xl inv-heading font-light flex items-center justify-center gap-1.5 mt-0.5 mb-1">
            <span>{groom}</span>
            <span className="text-rose-400 font-sans text-lg animate-pulse">♡</span>
            <span>{bride}</span>
          </h1>
          {/* Accent underline */}
          <div className="w-20 h-0.5 inv-rule mx-auto rounded-full mb-2" />

          {/* Hero Couple Artwork Frame */}
          <div className="inv-hero-img-wrap w-full aspect-[9/16] rounded-2xl overflow-hidden relative flex items-center justify-center group shadow-inner">
            <img 
              src={couplePhoto || "./images/themes/Luxe-Pastel-Caricature/03-sangeet.webp"} 
              alt={`${groom} & ${bride}`}
              className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Request Honor Text */}
          <div className="py-3 flex items-center justify-center gap-2">
            <span className="inv-accent text-sm">{design.isCaricature ? '🌼' : (design.closingEmoji || '✦')}</span>
            <span className="text-xs inv-muted font-medium tracking-wide italic">
              Request the honour of your presence · {formattedDate}
            </span>
            <span className="inv-accent text-sm">{design.isCaricature ? '🌼' : (design.closingEmoji || '✦')}</span>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

/**
 * 11. PASTEL POLAROID COUPLE (from Wishlys video frame 023 - 025)
 * Two authentic photo Polaroids with washi tape, parent lineages, and a connecting heart.
 */
export function PastelPolaroidCouple({ 
  bride = 'Bride', 
  groom = 'Groom', 
  bridePhoto, 
  groomPhoto, 
  brideBio, 
  groomBio,
  groomLineage,
  brideLineage,
  templateId = 'caricature'
}) {
  const [activeModal, setActiveModal] = useState(null); // 'groom' | 'bride' | null
  const design = getThemeDesign(templateId);

  return (
    <section className="py-6 px-2 w-full max-w-[390px] mx-auto select-none">
      <ScrollReveal variant="fade-up">
        <div className="text-center space-y-1 mb-5">
          <span className="text-[11px] font-cursive tracking-wider inv-eyebrow block font-semibold">
            Meet the two of us
          </span>
          <h3 className="font-royal text-2xl sm:text-3xl font-light inv-heading">
            {groom} & {bride}
          </h3>
          <div className="w-20 h-0.5 inv-rule mx-auto rounded-full mt-1" />
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 gap-2 relative items-stretch">
        {/* Left Card - Groom */}
        <ScrollReveal variant="tilt-left" delay={0} className="h-full">
          <div 
            onClick={() => setActiveModal('groom')}
            className="inv-card relative p-2.5 pb-4 shadow-md flex flex-col items-center text-center group h-full cursor-pointer"
          >
            {/* Washi Tape */}
            <div className="inv-pill absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rounded shadow-xs rotate-1 border" />
            
            {/* Circular Icon for Photo */}
            <div className="w-20 h-20 rounded-full overflow-hidden mt-1 mb-2 border-2 shadow-inner shrink-0 transition-all" style={{ borderColor: 'var(--pal-card-border)', backgroundColor: 'var(--pal-card-surface)' }}>
              <img 
                src={groomPhoto || './images/groom.webp'} 
                alt={groom}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>

            <span className="inv-pill inline-block px-2 py-0.5 rounded-full text-[8.5px] uppercase tracking-wider font-bold border mb-1">
              {design.meetBadgeGroom || 'The Groom'}
            </span>
            <h4 className="font-royal text-sm sm:text-base font-bold inv-heading leading-tight transition-colors">
              {groom}
            </h4>
            <p className="text-[10px] inv-muted italic mt-1 leading-snug px-0.5 flex-1">
              "{groomBio || 'Foodie, photography enthusiast, and the architect of their happiest memories.'}"
            </p>
            <p className="text-[8.5px] inv-subtle mt-1.5 border-t pt-1 w-full" style={{ borderColor: 'var(--pal-card-border)' }}>
              {groomLineage || 'S/o Mr. Ramesh & Mrs. Sunita Sharma'}
            </p>
            <span className="text-[8.5px] inv-accent font-semibold mt-1 flex items-center gap-0.5 opacity-85 group-hover:opacity-100">
              🔍 Tap to view
            </span>
          </div>
        </ScrollReveal>

        {/* Connected Hand-Drawn Pink Heart */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <ScrollReveal variant="bounce-in" delay={300}>
            <span className="text-rose-400 text-2xl animate-pulse drop-shadow inline-block">
              ♡
            </span>
          </ScrollReveal>
        </div>

        {/* Right Card - Bride */}
        <ScrollReveal variant="tilt-right" delay={150} className="h-full">
          <div 
            onClick={() => setActiveModal('bride')}
            className="inv-card relative p-2.5 pb-4 shadow-md flex flex-col items-center text-center group h-full cursor-pointer"
          >
            {/* Washi Tape */}
            <div className="inv-pill absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rounded shadow-xs -rotate-1 border" />
            
            {/* Circular Icon for Photo */}
            <div className="w-20 h-20 rounded-full overflow-hidden mt-1 mb-2 border-2 shadow-inner shrink-0 transition-all" style={{ borderColor: 'var(--pal-card-border)', backgroundColor: 'var(--pal-card-surface)' }}>
              <img 
                src={bridePhoto || './images/bride.webp'} 
                alt={bride}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>

            <span className="inv-pill inline-block px-2 py-0.5 rounded-full text-[8.5px] uppercase tracking-wider font-bold border mb-1">
              {design.meetBadgeBride || 'The Bride'}
            </span>
            <h4 className="font-royal text-sm sm:text-base font-bold inv-heading leading-tight transition-colors">
              {bride}
            </h4>
            <p className="text-[10px] inv-muted italic mt-1 leading-snug px-0.5 flex-1">
              "{brideBio || 'Loves classic poetry, morning chai, and spontaneous mountain hikes.'}"
            </p>
            <p className="text-[8.5px] inv-subtle mt-1.5 border-t pt-1 w-full" style={{ borderColor: 'var(--pal-card-border)' }}>
              {brideLineage || 'D/o Mr. Vijay & Mrs. Rekha Malhotra'}
            </p>
            <span className="text-[8.5px] inv-accent font-semibold mt-1 flex items-center gap-0.5 opacity-85 group-hover:opacity-100">
              🔍 Tap to view
            </span>
          </div>
        </ScrollReveal>
      </div>

      {/* ENLARGED PORTRAIT CARD MODAL WITH BLURRED BACKDROP */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="inv-modal relative w-full max-w-[330px] rounded-3xl p-5 border-2 shadow-2xl text-center space-y-3 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Washi Tape */}
            <div 
              className={`inv-pill absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 rounded border shadow-xs ${
                activeModal === 'groom' ? 'rotate-1' : '-rotate-1'
              }`} 
            />

            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="inv-surface absolute top-3 right-3 w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold shadow-xs cursor-pointer z-10 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Full Portrait Photo Inside Card */}
            <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 shadow-inner mt-2" style={{ borderColor: 'var(--pal-card-border)', backgroundColor: 'var(--pal-card-surface)' }}>
              <img 
                src={activeModal === 'groom' ? (groomPhoto || './images/groom.webp') : (bridePhoto || './images/bride.webp')} 
                alt={activeModal === 'groom' ? groom : bride} 
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="space-y-1 pt-1">
              <span className="inv-pill inline-block px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border">
                {activeModal === 'groom' ? (design.meetBadgeGroom || 'The Groom') : (design.meetBadgeBride || 'The Bride')}
              </span>
              <h3 className="font-royal text-2xl font-bold inv-heading">
                {activeModal === 'groom' ? groom : bride}
              </h3>
              <p className="text-xs inv-muted italic px-2">
                "{activeModal === 'groom' 
                  ? (groomBio || 'Foodie, photography enthusiast, and the architect of their happiest memories.') 
                  : (brideBio || 'Loves classic poetry, morning chai, and spontaneous mountain hikes.')}"
              </p>
              <p className="text-[10px] inv-subtle border-t pt-2 mt-2" style={{ borderColor: 'var(--pal-card-border)' }}>
                {activeModal === 'groom' 
                  ? (groomLineage || 'S/o Mr. Ramesh & Mrs. Sunita Sharma') 
                  : (brideLineage || 'D/o Mr. Vijay & Mrs. Rekha Malhotra')}
              </p>
            </div>

            <div className="pt-1">
              <button 
                onClick={() => setActiveModal(null)}
                className="text-[11px] uppercase tracking-widest inv-muted font-semibold hover:opacity-100 cursor-pointer"
              >
                Tap to close ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * 12. HANGING WALL CALENDAR & COUNTDOWN (from Wishlys video frame 025 - 027)
 * Ring-bound calendar card with hand-drawn heart circled around wedding date.
 */
export function PastelHangingCalendar({ date = '2026-12-09', timeLeft, templateId = 'caricature', isDark = false }) {
  const design = getThemeDesign(templateId);
  const d = new Date(date || '2026-12-09');
  const valid = !isNaN(d.getTime());
  const monthName = valid ? d.toLocaleString('en-US', { month: 'long' }) : 'December';
  const year = valid ? d.getFullYear() : 2026;
  const dayNum = valid ? d.getDate() : 9;

  const daysInMonth = valid ? new Date(year, d.getMonth() + 1, 0).getDate() : 31;
  const firstDayIndex = valid ? new Date(year, d.getMonth(), 1).getDay() : 3;

  const calendarCardRef = useRef(null);
  const [isMarked, setIsMarked] = useState(false);

  useEffect(() => {
    const el = calendarCardRef.current;
    if (!el) return;
    
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsMarked(true);
          obs.disconnect();
        }
      });
    }, { threshold: 0.15 });

    obs.observe(el);

    const handleScroll = () => {
      if (!calendarCardRef.current) return;
      const rect = calendarCardRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
        setIsMarked(true);
      }
    };
    const scrollParent = el.closest('.overflow-y-auto') || window;
    scrollParent.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      obs.disconnect();
      scrollParent.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="py-6 px-2 w-full max-w-[390px] mx-auto select-none">
      <ScrollReveal variant="fade-up">
        <div className="text-center space-y-1 mb-5">
          <span className="text-[11px] font-cursive tracking-wider inv-eyebrow block font-semibold">
            Mark your calendar
          </span>
          <h3 className="font-royal text-2xl sm:text-3xl font-light inv-heading">
            {monthName} {year}
          </h3>
          <div className="w-20 h-0.5 inv-rule mx-auto rounded-full mt-1" />
        </div>
      </ScrollReveal>

      {/* Hanging Wall Calendar Card */}
      <ScrollReveal variant="calendar-drop" delay={100}>
        <div ref={calendarCardRef} className="inv-card relative p-4 sm:p-5 shadow-md">
          {/* Binder Ring Loops */}
          <div className="inv-surface absolute -top-3 left-1/3 -translate-x-1/2 w-3.5 h-6 rounded-full border-2 shadow-inner" />
          <div className="inv-surface absolute -top-3 right-1/3 translate-x-1/2 w-3.5 h-6 rounded-full border-2 shadow-inner" />

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold inv-eyebrow pb-2 border-b mb-2" style={{ borderColor: 'var(--pal-card-border)' }}>
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs inv-text">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isWeddingDay = day === dayNum;
              return (
                <div key={day} className="h-7 sm:h-8 flex items-center justify-center relative">
                  {isWeddingDay ? (
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-bold select-none" style={{ color: 'var(--pal-eyebrow)' }}>
                      {/* Animated SVG Hand-Drawn Marking Heart */}
                      <svg 
                        viewBox="0 0 36 36" 
                        className="absolute -inset-1.5 w-10 h-10 sm:w-11 sm:h-11 pointer-events-none overflow-visible"
                      >
                        <path
                          d="M18,31 C10,23 3.5,17 3.5,10.5 C3.5,5.5 7.5,2 12.5,2 C15.5,2 17.5,3.5 18,5 C18.5,3.5 20.5,2 23.5,2 C28.5,2 32.5,5.5 32.5,10.5 C32.5,17 26,23 18,31 Z"
                          fill={isMarked ? 'rgba(244, 63, 94, 0.22)' : 'transparent'}
                          stroke="#E11D48"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="140"
                          strokeDashoffset={isMarked ? '0' : '140'}
                          style={{
                            transition: isMarked 
                              ? 'stroke-dashoffset 1.3s cubic-bezier(0.34, 1.56, 0.64, 1), fill 0.6s ease-in 0.8s' 
                              : 'none'
                          }}
                          className={isMarked ? 'animate-mark-heart' : 'opacity-0'}
                        />
                      </svg>
                      <span className="relative z-10 font-extrabold text-sm" style={{ color: isDark ? '#FFE4E6' : '#BE123C' }}>{day}</span>
                    </div>
                  ) : (
                    <span>{day}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Countdown Bar Directly Below */}
      <div className="mt-6 text-center">
        <ScrollReveal variant="fade-up" delay={180}>
          <span className="text-[11px] font-cursive tracking-wider inv-eyebrow block font-semibold mb-2.5">
            {design.isCaricature ? 'Counting down to the shaadi' : 'Counting down to the celebration'}
          </span>
        </ScrollReveal>
        <PastelCountdownBar timeLeft={timeLeft} isDark={isDark} isCaricature={design.isCaricature} />
      </div>
    </section>
  );
}

export function PastelCountdownBar({ timeLeft, isDark = false, isCaricature = true }) {
  const units = [
    { key: 'days', label: 'Days', val: timeLeft?.days || '00', bg: '#FCE7F3', border: '#F472B6', text: '#9D174D', sub: '#BE185D', delay: 50 },
    { key: 'hours', label: 'Hours', val: timeLeft?.hours || '00', bg: '#D1FAE5', border: '#34D399', text: '#065F46', sub: '#047857', delay: 140 },
    { key: 'mins', label: 'Mins', val: timeLeft?.mins || '00', bg: '#FEF3C7', border: '#FBBF24', text: '#92400E', sub: '#B45309', delay: 230 },
    { key: 'secs', label: 'Secs', val: timeLeft?.secs || '00', bg: '#EDE9FE', border: '#A78BFA', text: '#5B21B6', sub: '#6D28D9', delay: 320 },
  ];

  const usePastelCircles = isCaricature && !isDark;

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3">
      {units.map(u => (
        <ScrollReveal key={u.key} variant="bounce-in" delay={u.delay}>
          {usePastelCircles ? (
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 shadow-xs flex flex-col items-center justify-center p-1"
              style={{ backgroundColor: u.bg, borderColor: u.border }}
            >
              <span className="font-royal text-lg sm:text-xl font-bold leading-none" style={{ color: u.text }}>{u.val}</span>
              <span className="text-[7.5px] uppercase tracking-wider font-bold mt-0.5" style={{ color: u.sub }}>{u.label}</span>
            </div>
          ) : (
            <div className="inv-card w-14 h-14 sm:w-16 sm:h-16 shadow-xs flex flex-col items-center justify-center p-1">
              <span className="font-royal text-lg sm:text-xl font-bold inv-heading leading-none">{u.val}</span>
              <span className="text-[7.5px] uppercase tracking-wider inv-eyebrow font-bold mt-0.5">{u.label}</span>
            </div>
          )}
        </ScrollReveal>
      ))}
    </div>
  );
}

/**
 * 13. PASTEL OUR STORY NOTEBOOK (from Wishlys video frame 030)
 * Ruled notebook sheet with red vertical margin and yellow sticky note.
 */
export function PastelOurStory({ story = [], quote, bride = 'Bride', groom = 'Groom', palette, templateId = 'caricature' }) {
  const milestoneList = Array.isArray(story) && story.length > 0 ? story : null;
  const design = getThemeDesign(templateId);

  return (
    <section className="py-6 px-2 w-full max-w-[390px] mx-auto select-none">
      <ScrollReveal variant="fade-up">
        <div className="text-center mb-5">
          <span className="text-[11px] font-cursive tracking-wider inv-eyebrow block font-semibold">
            {design.storyLabel || 'Dear diary'}
          </span>
          <h3 className="font-royal text-2xl sm:text-3xl font-light inv-heading flex items-center justify-center gap-2">
            <span>Our Story</span>
          </h3>
          <div className="w-20 h-0.5 inv-rule mx-auto rounded-full mt-1" />
        </div>
      </ScrollReveal>

      {/* If Story Milestones Defined in Studio Content Tab */}
      {milestoneList ? (
        <div className="space-y-4">
          {milestoneList.map((chapter, idx) => (
            <ScrollReveal key={chapter.id || idx} variant={idx % 2 === 0 ? 'tilt-left' : 'tilt-right'} delay={idx * 100}>
              <div className="inv-card relative p-4 sm:p-5 pl-8 sm:pl-9 shadow-md transform hover:rotate-0 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-y-0 left-6 w-0.5" style={{ backgroundColor: 'var(--pal-accent)', opacity: 0.45 }} />
                
                {/* Year Pill Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inv-pill inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border">
                    {chapter.year || `Chapter ${idx + 1}`}
                  </span>
                  <span className="text-xs inv-eyebrow">♥</span>
                </div>

                <h4 className="font-royal text-base sm:text-lg font-bold inv-heading mb-1">
                  {chapter.title}
                </h4>

                {/* Milestone Image if present */}
                {chapter.image && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden my-2.5 border shadow-xs" style={{ borderColor: 'var(--pal-card-border)', backgroundColor: 'var(--pal-card-surface)' }}>
                    <img 
                      src={chapter.image} 
                      alt={chapter.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}

                <p className="text-xs inv-muted italic leading-relaxed">
                  "{chapter.desc}"
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        /* Fallback single lined notebook sheet */
        <ScrollReveal variant="fade-up" delay={100}>
          <div className="inv-card relative p-4 sm:p-5 pl-9 sm:pl-10 shadow-md transform -rotate-1 overflow-hidden">
            <div className="absolute inset-y-0 left-7 sm:left-8 w-0.5" style={{ backgroundColor: 'var(--pal-accent)', opacity: 0.45 }} />
            <div className="space-y-3">
              <p className="text-xs sm:text-sm inv-muted italic leading-relaxed">
                "{quote || 'Met during a winter afternoon in London, bonded over chai and shared conversations, and eventually realized that their paths were meant to run side-by-side forever.'}"
              </p>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Yellow Sticky Note Overlapping Below */}
      <ScrollReveal variant="pop-up" delay={220}>
        <div className="inv-sticky relative mt-3 ml-auto mr-1 w-56 sm:w-60 rounded-xl p-3 shadow-md border transform rotate-2">
          <div className="inv-pill absolute -top-2 left-5 w-10 h-3.5 rounded shadow-2xs border rotate-1" />
          <p className="font-script text-base text-center leading-snug">
            "{quote || 'A celebration of love, culture, and the beginning of forever.'}"
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}

/**
 * 14. WINDING TRAIL WITH DRIVING CARTOON SCOOTER (from Wishlys video frame 035, 045, 050)
 */
export function PastelScooterDivider() {
  return (
    <div className="w-full flex flex-col items-center my-6 overflow-hidden pointer-events-none select-none">
      <ScrollReveal variant="scooter-drive" className="w-full flex justify-center">
        <div className="relative w-72 h-16 flex items-center justify-center">
          <svg viewBox="0 0 280 60" className="w-full h-full text-stone-300" fill="none">
            {/* Animated Roadway Track */}
            <path d="M15,48 Q140,-8 265,48" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="6,5" className="animate-road-dash" />
            
            {/* Roadside Left: Palm / Floral Bush */}
            <g transform="translate(10, 34) scale(0.65)">
              <path d="M10,25 C10,12 18,5 20,0 C22,5 30,12 30,25 Z" fill="#16A34A" />
              <path d="M5,22 C12,12 18,8 20,0" stroke="#15803D" strokeWidth="1.5" />
              <circle cx="20" cy="22" r="3.5" fill="#F59E0B" />
            </g>

            {/* Roadside Right: Palace Jharokha Dome */}
            <g transform="translate(252, 32) scale(0.6)">
              <path d="M5,24 L25,24 L25,12 C25,4 15,0 15,0 C15,0 5,4 5,12 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.2" />
              <circle cx="15" cy="0" r="2.5" fill="#EA580C" />
            </g>
          </svg>

          <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 animate-float">
            <span className="text-2xl drop-shadow-md transform -rotate-3">🛵</span>
            <span className="text-xs inv-muted">💨</span>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

/**
 * 14b. THEME-ADAPTIVE EVENT DIVIDER
 */
export function ThemeDivider({ templateId = 'caricature' }) {
  const design = getThemeDesign(templateId);
  if (design.isCaricature) {
    return <PastelScooterDivider />;
  }
  return <div dangerouslySetInnerHTML={{ __html: renderThemeDividerHtml(templateId) }} />;
}

/**
 * 15. PASTEL / THEME-ADAPTIVE EVENT POP-UP
 */
export function PastelEventCard({ event, index, templateId = 'caricature' }) {
  const nameLower = (event.name || '').toLowerCase();
  const isHaldi = nameLower.includes('haldi');
  const isMehndi = nameLower.includes('mehndi') || nameLower.includes('mehendi');
  const isSangeet = nameLower.includes('sangeet');
  const isWedding = event.id === 'evt-pheras' || nameLower.includes('wedding') || nameLower.includes('phera') || nameLower.includes('shaadi') || nameLower.includes('vow') || nameLower.includes('mandap');
  const isReception = nameLower.includes('reception') || nameLower.includes('party');

  const archImg = event.image || event.img || (
    (templateId && templateId !== 'caricature')
      ? getThemeEventImage(templateId, event, index)
      : (
        isHaldi ? './images/caricature/haldi_arch.webp'
        : isMehndi ? './images/caricature/mehndi_arch.webp'
        : isSangeet ? './images/caricature/sangeet_arch.webp'
        : isWedding ? './images/caricature/pheras_arch.webp'
        : isReception ? './images/caricature/reception_arch.webp'
        : './images/caricature/scooter_couple.webp'
      )
  );

  return (
    <div className="relative w-full max-w-[390px] mx-auto select-none space-y-3 px-1">
      {/* Thematic Pop-up Scalloped Arch Artwork */}
      {archImg && (
        <ScrollReveal variant="pop-up">
          <div className="w-full flex justify-center -mb-2">
            <div className="inv-arch-card inv-hero-img-wrap w-full max-w-[350px] aspect-[9/16] overflow-hidden flex items-center justify-center p-0 drop-shadow-md">
              <img 
                src={archImg} 
                alt={event.name} 
                onError={(e) => {
                  if (isWedding && !e.target.src.includes('pheras_arch.webp')) {
                    e.target.src = './images/caricature/pheras_arch.webp';
                  } else if (isWedding) {
                    e.target.src = './images/caricature/pheras.webp';
                  }
                }}
                className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Event Title */}
      <ScrollReveal variant="fade-up" delay={80}>
        <div className="text-center">
          <h3 className="font-royal text-2xl font-bold inv-heading">
            {event.name}
          </h3>
        </div>
      </ScrollReveal>

      {/* Theme-Styled Event Details Card */}
      <ScrollReveal variant="fade-up" delay={160}>
        <div className="inv-card relative p-4 sm:p-5 shadow-md space-y-2.5">
          <div className="space-y-1.5 text-xs inv-text">
            <p className="flex items-center gap-2">
              <span>📅</span>
              <strong className="inv-heading">{event.date}</strong> · ⏰ {event.time}
            </p>
            <p className="flex items-center gap-2">
              <span>📍</span>
              <span><strong className="inv-heading">{event.venue}</strong> — <span className="inv-muted">{event.address}</span></span>
            </p>
            {event.dressCode && (
              <p className="flex items-center gap-2">
                <span>👔</span>
                <span className="inv-accent font-semibold">{event.dressCode}</span>
              </p>
            )}
          </div>

          {event.desc && (
            <>
              <div className="border-b border-dashed pt-0.5" style={{ borderColor: 'var(--pal-card-border)' }} />
              <p className="text-[11px] inv-muted italic leading-relaxed">
                "{event.desc}"
              </p>
            </>
          )}

          <div className="pt-1.5 flex items-center gap-2">
            <a
              href={event.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent((event.venue || '') + ' ' + (event.address || ''))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inv-pill border flex-1 py-2.5 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Get directions</span>
            </a>
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name || 'Celebration')}&details=${encodeURIComponent((event.desc ? event.desc + '\n' : '') + 'Venue: ' + (event.venue || '') + ' ' + (event.address || ''))}&location=${encodeURIComponent((event.venue || '') + ' ' + (event.address || ''))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inv-btn-secondary px-3.5 py-2.5 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-xs cursor-pointer"
              title="Add to Calendar"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </a>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

/**
 * 16. PASTEL POLAROID PHOTO GALLERY (from Wishlys video frame 063 - 065)
 */
export function PastelPolaroidGallery({ photos = [] }) {
  const defaultGallery = [
    { id: 1, title: 'Engagement', img: './images/couple-potrait.webp' },
    { id: 2, title: 'Haldi Joy', img: './images/couple-landscape-1.webp' },
    { id: 3, title: 'Udaipur Sunset', img: './images/couple-landscape-2.webp' },
    { id: 4, title: 'Forever Begins', img: './images/couple-potrait-1.webp' },
    { id: 5, title: 'Palace Stroll', img: './images/couple-landscape-3.webp' },
    { id: 6, title: 'Starlit Promises', img: './images/couple-landscape-4.webp' },
    { id: 7, title: 'Lake Boat Ride', img: './images/couple-udaipur-boat.webp' },
    { id: 8, title: 'Palace Rooftop', img: './images/couple-udaipur-rooftop.webp' },
    { id: 9, title: 'Old City Charm', img: './images/couple-udaipur-bazaar.webp' },
    { id: 10, title: 'Monsoon Palace', img: './images/couple-udaipur-hilltop.webp' },
    { id: 11, title: 'Haveli Courtyard', img: './images/couple-udaipur-haveli.webp' },
    { id: 12, title: 'Waterfront Sunset', img: './images/couple-udaipur-ghat.webp' },
  ];

  const list = photos.length > 0 ? photos : defaultGallery;

  return (
    <section className="py-6 px-2 w-full max-w-[390px] mx-auto select-none">
      <ScrollReveal variant="fade-up">
        <div className="text-center space-y-1 mb-6">
          <span className="text-[11px] font-cursive tracking-wider inv-eyebrow block font-semibold">
            Moments to cherish
          </span>
          <h3 className="font-royal text-2xl sm:text-3xl font-light inv-heading">
            Memories Gallery
          </h3>
          <div className="w-20 h-0.5 inv-rule mx-auto rounded-full mt-1" />
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-2 gap-2.5">
        {list.map((item, idx) => (
          <ScrollReveal 
            key={item.id || idx}
            variant={idx % 2 === 0 ? 'tilt-left' : 'tilt-right'} 
            delay={Math.min(360, (idx % 4) * 120)}
          >
            <div 
              className={`inv-polaroid relative p-2 pb-3.5 shadow-md transform ${idx % 2 === 0 ? '-rotate-1 hover:rotate-0' : 'rotate-1 hover:rotate-0'} transition-transform duration-300 group`}
            >
              {/* Washi Tape */}
              <div className="inv-pill absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rounded shadow-2xs border rotate-1" />
              
              <div className="w-full aspect-square rounded overflow-hidden mb-1.5 border" style={{ borderColor: 'var(--pal-card-border)', backgroundColor: 'var(--pal-card-surface)' }}>
                <img 
                  src={item.img || item.url} 
                  alt={item.title || item.caption || `Memory ${idx + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="text-center">
                <span className="text-[9px] uppercase font-bold tracking-wider inv-muted">
                  ✦ {item.title || item.caption || `Moment 0${idx + 1}`} ✦
                </span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/**
 * 17. PASTEL VENUE MAP (from Wishlys video frame 065 - 068)
 */
export function PastelVenueMap({ venue = 'Umaid Bhawan Palace', city = 'Udaipur, Rajasthan', address = 'Circuit House Rd, Cantt Area, Jodhpur' }) {
  return (
    <section className="py-6 px-2 w-full max-w-[390px] mx-auto select-none">
      <ScrollReveal variant="fade-up">
        <div className="text-center space-y-1 mb-5">
          <span className="text-[11px] font-cursive tracking-wider inv-eyebrow block font-semibold">
            Where it's all happening
          </span>
          <h3 className="font-royal text-2xl sm:text-3xl font-light inv-heading">
            The Venue
          </h3>
          <div className="w-20 h-0.5 inv-rule mx-auto rounded-full mt-1" />
        </div>
      </ScrollReveal>

      <ScrollReveal variant="pop-up" delay={120}>
        <div className="inv-card p-4 shadow-md space-y-3">
          {/* Illustrated Route Map Card */}
          <div className="w-full h-40 rounded-xl bg-gradient-to-b from-[#E6F4EA] to-[#FEF3C7] border border-[#A7F3D0] relative overflow-hidden flex flex-col justify-between p-3">
            <div className="flex justify-between items-start text-lg opacity-80">
              <span>🌳</span>
              <span>🏰</span>
              <span>🌳</span>
            </div>

            <div className="relative w-full flex items-center justify-center my-auto">
              <svg viewBox="0 0 200 40" className="w-full h-10" fill="none">
                <path d="M10,25 Q100,5 190,25" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="5,4" />
              </svg>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-600 text-2xl animate-pin-drop">
                📍
              </div>
            </div>

            <div className="inv-surface rounded-lg p-2 text-center border shadow-2xs">
              <h4 className="font-royal text-sm font-bold inv-heading">{venue}</h4>
              <p className="text-[10px] inv-muted">{city} · {address}</p>
            </div>
          </div>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(venue + ' ' + address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inv-btn-primary w-full py-2.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-sm cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}

/**
 * 18. PASTEL HOSPITALITY & LOGISTICS
 */
export function PastelHospitality({ logistics, palette }) {
  if (!logistics || (!logistics.hotel && !logistics.airport && !logistics.contact)) {
    return null;
  }

  return (
    <section className="py-6 px-2 w-full max-w-[390px] mx-auto select-none space-y-3.5">
      <ScrollReveal variant="fade-up">
        <div className="text-center space-y-1 mb-5">
          <span className="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold">
            Comfort & Care
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">
            Hospitality & Travel
          </h3>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1" />
        </div>
      </ScrollReveal>

      {/* Hotel / Stay Card */}
      {logistics.hotel && (
        <ScrollReveal variant="fade-up" delay={80}>
          <div className="bg-[#FFFDF9] rounded-2xl p-4 border-2 border-stone-200 shadow-md space-y-2 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-xl shrink-0">
                🏨
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] uppercase tracking-wider font-bold text-sky-700 block">
                  Accommodation & Stay
                </span>
                <h4 className="font-serif text-sm font-bold text-[#2B1E17] mt-0.5">
                  {logistics.hotel}
                </h4>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Airport / Transit Card */}
      {logistics.airport && (
        <ScrollReveal variant="fade-up" delay={160}>
          <div className="bg-[#FFFDF9] rounded-2xl p-4 border-2 border-stone-200 shadow-md space-y-2 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-xl shrink-0">
                ✈️
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] uppercase tracking-wider font-bold text-amber-700 block">
                  Travel & Arrival
                </span>
                <h4 className="font-serif text-sm font-bold text-[#2B1E17] mt-0.5">
                  {logistics.airport}
                </h4>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Concierge Contact Card */}
      {logistics.contact && (
        <ScrollReveal variant="fade-up" delay={240}>
          <div className="bg-[#FFFDF9] rounded-2xl p-4 border-2 border-stone-200 shadow-md space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-xl shrink-0">
                  📞
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 block">
                    Guest Concierge & Helpdesk
                  </span>
                  <p className="font-serif text-xs font-semibold text-[#2B1E17] truncate mt-0.5">
                    {logistics.contact}
                  </p>
                </div>
              </div>
              <a 
                href={`tel:${logistics.contact.replace(/[^\d+]/g, '')}`}
                className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs cursor-pointer shrink-0 transition-colors"
              >
                Call
              </a>
            </div>
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}

/**
 * 19. PASTEL HASHTAG BANNER (from Wishlys video frame 072)
 */
export function PastelHashtagBanner({ hashtag = '#Wedding' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(hashtag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-6 px-2 w-full max-w-[390px] mx-auto text-center select-none space-y-2">
      <ScrollReveal variant="pop-up">
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold inv-muted block">
          SHARE THE MOMENTS
        </span>
        <h3 className="font-royal text-2xl sm:text-3xl font-bold inv-heading mt-1">
          {hashtag}
        </h3>
        <p className="text-xs inv-muted font-light mt-1">
          Tag your photos and stories so we can relive every moment.
        </p>
        <div className="pt-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inv-btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-95 hover:opacity-95"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Hashtag'}</span>
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}

/**
 * 20. PASTEL MULTI-STEP RSVP (from Wishlys video frame 075 - 078)
 * Tabs: EVENTS / DETAILS / SONG with clean progressive disclosure.
 */
export function PastelMultiStepRsvp({ events = [] }) {
  const [step, setStep] = useState(1);
  const [selectedEvents, setSelectedEvents] = useState(() => 
    (events.length > 0 ? events.map(e => e.id) : [1, 2, 3, 4, 5])
  );
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '1',
    diet: 'Vegetarian',
    song: ''
  });

  const toggleEvent = (id) => {
    setSelectedEvents(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(events.map(e => e.id));
    }
  };

  return (
    <section className="py-10 px-4 max-w-md mx-auto select-none">
      <div className="bg-[#FFFDF9]/95 backdrop-blur-xs rounded-3xl p-6 sm:p-7 border-2 border-stone-200/80 shadow-lg space-y-4">
        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-500 block">RSVP</span>
          <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">
            Will You Be Joining Us?
          </h3>
          <div className="flex justify-center items-center gap-3 text-[10px] uppercase font-bold tracking-widest pt-1 text-stone-400">
            <span className={step === 1 ? 'text-[#881337] border-b-2 border-[#881337] pb-0.5' : ''}>EVENTS</span>
            <span>/</span>
            <span className={step === 2 ? 'text-[#881337] border-b-2 border-[#881337] pb-0.5' : ''}>DETAILS</span>
            <span>/</span>
            <span className={step === 3 ? 'text-[#881337] border-b-2 border-[#881337] pb-0.5' : ''}>SONG</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-700 font-medium">Which celebrations will you attend?</span>
              <button 
                type="button" 
                onClick={toggleAll}
                className="text-[#881337] font-semibold underline cursor-pointer"
              >
                {selectedEvents.length === events.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>

            <div className="space-y-2">
              {events.map(evt => {
                const checked = selectedEvents.includes(evt.id);
                return (
                  <label 
                    key={evt.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      checked ? 'bg-[#FFF5F7] border-[#FBCFE8]' : 'bg-white border-stone-200'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleEvent(evt.id)}
                      className="mt-0.5 accent-[#881337]"
                    />
                    <div>
                      <strong className="text-xs uppercase font-bold text-stone-900 block">{evt.name}</strong>
                      <span className="text-[10px] text-stone-500">{evt.date} · {evt.venue}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer mt-4"
            >
              Next: Your Details
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3.5 pt-2">
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Your Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Dietary Preference</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Vegetarian', 'Non-Vegetarian', 'Jain', 'Vegan'].map(diet => (
                  <label key={diet} className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50/50 cursor-pointer">
                    <input 
                      type="radio" 
                      name="diet" 
                      checked={formData.diet === diet} 
                      onChange={() => setFormData({ ...formData, diet })}
                      className="accent-[#881337]"
                    />
                    <span>{diet}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-600 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-xl bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Next: DJ Song
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                DJ Song Request 🎵
              </label>
              <p className="text-xs text-stone-500 mb-2">What song will get you dancing on the floor?</p>
              <input 
                type="text" 
                value={formData.song}
                onChange={e => setFormData({ ...formData, song: e.target.value })}
                placeholder="e.g. Gallan Goodiyaan / Maahi Ve"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-600 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    const existing = JSON.parse(localStorage.getItem('wishlys_rsvps') || '[]');
                    const newEntry = {
                      id: 'rsvp_' + Date.now(),
                      name: formData.name || 'Guest',
                      phone: formData.phone || '',
                      selectedEvents,
                      dietary: formData.diet,
                      songRequest: formData.song,
                      submittedAt: new Date().toISOString(),
                    };
                    localStorage.setItem('wishlys_rsvps', JSON.stringify([newEntry, ...existing]));
                  } catch (e) {
                    console.error('Failed to save rsvp', e);
                  }
                  triggerCelebration('confetti');
                  soundManager.playChime(784);
                  setStep(4);
                }}
                className="flex-1 py-3 rounded-xl bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Submit RSVP ✨
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-6 space-y-2 animate-fadeIn">
            <span className="text-4xl block">🎉</span>
            <h4 className="font-serif text-2xl font-bold text-[#881337]">RSVP Received!</h4>
            <p className="text-xs text-stone-600">
              Thank you, {formData.name || 'dear guest'}! We cannot wait to celebrate with you!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * 21. PASTEL FOOTER WITH SCOOTER & HEARTS (from Wishlys video frame 080)
 * "See you at the shaadi!", 4 floating hearts, and yellow scooter driving across
 */
export function PastelFooter({ bride = 'Bride', groom = 'Groom', templateId = 'caricature' }) {
  const design = getThemeDesign(templateId);
  return (
    <footer className="py-10 px-2 w-full max-w-[390px] mx-auto text-center space-y-3.5 border-t-2 border-dashed select-none" style={{ borderColor: 'var(--pal-card-border)' }}>
      <ScrollReveal variant="fade-up">
        <h3 className="font-royal text-2xl sm:text-3xl font-light inv-heading">
          {design.footerTitle || 'See you at the shaadi!'}
        </h3>
        
        <p className="text-[10px] tracking-[0.3em] uppercase font-bold inv-accent mt-1">
          WITH LOVE, {groom} & {bride}
        </p>
      </ScrollReveal>

      {/* Row of 4 floating accent hearts */}
      <ScrollReveal variant="bounce-in" delay={150}>
        <div className="flex items-center justify-center gap-3">
          <span className="inv-pill w-6 h-6 rounded-full border flex items-center justify-center text-xs shadow-xs animate-bounce">
            💛
          </span>
          <span className="inv-pill w-6 h-6 rounded-full border flex items-center justify-center text-xs shadow-xs animate-bounce" style={{ animationDelay: '0.2s' }}>
            💚
          </span>
          <span className="inv-pill w-6 h-6 rounded-full border flex items-center justify-center text-xs shadow-xs animate-bounce" style={{ animationDelay: '0.4s' }}>
            💜
          </span>
          <span className="inv-pill w-6 h-6 rounded-full border flex items-center justify-center text-xs shadow-xs animate-bounce" style={{ animationDelay: '0.6s' }}>
            💖
          </span>
        </div>
      </ScrollReveal>

      {/* Theme Closing Motif */}
      <ScrollReveal variant="scooter-drive" delay={250}>
        <div className="flex items-center justify-center gap-1 pt-2 animate-float">
          <span className="text-3xl drop-shadow">{design.closingEmoji || '✨'}</span>
          {design.isCaricature && <span className="text-xs inv-muted">💨</span>}
        </div>
      </ScrollReveal>

      <p className="text-xs inv-muted font-light italic">
        We can't wait to celebrate with you
      </p>
    </footer>
  );
}
