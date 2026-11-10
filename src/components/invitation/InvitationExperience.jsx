import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Sparkles, MapPin, Calendar, Clock, Heart, 
  Send, Music, CheckCircle2, ChevronDown, User, Users, Compass, Share2,
  ExternalLink, Award, Gift, Check
} from 'lucide-react';
import ScratchCard from '../reveals/ScratchCard';
import ScratchDate from '../reveals/ScratchDate';
import WaxSeal from '../reveals/WaxSeal';
import RingBox from '../reveals/RingBox';
import Doorbell from '../reveals/Doorbell';
import ThemeAtmosphere from './ThemeAtmosphere';
import { formatDisplayDate } from '../studio/StudioWizard';
import { 
  BioscopeBooth, 
  DirectionalSignpost, 
  JharokhaPhotoGallery, 
  UrliCeremonyScene, 
  RoyalWeddingMandap, 
  CelebratoryFireworks, 
  FestiveSunburst, 
  BougainvilleaCanopy,
  PastelFoldingDoorsReveal,
  PastelCaricatureHero,
  PastelPolaroidCouple,
  PastelHangingCalendar,
  PastelCountdownBar,
  PastelOurStory,
  PastelScooterDivider,
  PastelEventCard,
  PastelPolaroidGallery,
  PastelVenueMap,
  PastelHospitality,
  PastelMultiStepRsvp,
  PastelHashtagBanner,
  PastelFooter
} from './ThematicObjects';
import MomentsAndMemories from './MomentsAndMemories';
import { ParallaxWeddingDecorations } from './ParallaxWeddingDecorations';
import { soundManager } from '../../utils/audio';
import { triggerCelebration } from '../../utils/confetti';
import { PALETTES, TEMPLATES, MUSIC_TRACKS } from '../../data/presets';
import { getThemeEventImage, getThemeHeroImage } from '../../utils/themeImages';

export default function InvitationExperience({ 
  data, 
  isPreview = false, 
  previewMode = 'invite', // 'invite' or 'replay'
  activeGroup = 'all' 
}) {
  const [revealed, setRevealed] = useState(() => {
    return isPreview ? (previewMode === 'invite') : false;
  });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [activePersonModal, setActivePersonModal] = useState(null); // 'groom' | 'bride' | null
  
  // RSVP Form State with multi-event selection (matching Wishlys frame_0110s.jpg)
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    phone: '',
    selectedEvents: (data.events || []).map(e => e.id),
    guestCount: 2,
    dietary: 'Vegetarian',
    songRequest: '',
    message: '',
  });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  const palette = PALETTES.find(p => p.id === data.palette) || PALETTES[1];
  const currentTemplate = TEMPLATES.find(t => t.id === data.template) || TEMPLATES[0];
  const currentMusic = MUSIC_TRACKS.find(m => m.id === data.music) || MUSIC_TRACKS[0];

  useEffect(() => {
    if (isPreview) {
      if (previewMode === 'invite') {
        setRevealed(true);
      } else if (previewMode === 'replay') {
        setRevealed(false);
      }
    }
  }, [previewMode, isPreview]);

  useEffect(() => {
    const targetDate = new Date(data.hosts?.date || '2026-12-09').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [data.hosts?.date]);

  useEffect(() => {
    if (isPlayingMusic) {
      soundManager.playTrack(data.music || 'modern-muse', data.customMusicUrl);
    }
  }, [data.music, data.customMusicUrl]);

  const handleReveal = () => {
    setRevealed(true);
    triggerCelebration(data.effect || 'petals');
    if (!isPlayingMusic) {
      soundManager.playTrack(data.music || 'modern-muse', data.customMusicUrl);
      setIsPlayingMusic(true);
    }
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      soundManager.stop();
      setIsPlayingMusic(false);
    } else {
      soundManager.playTrack(data.music || 'modern-muse', data.customMusicUrl);
      setIsPlayingMusic(true);
    }
  };

  const toggleEventSelection = (eventId) => {
    setRsvpForm(prev => {
      const exists = prev.selectedEvents.includes(eventId);
      return {
        ...prev,
        selectedEvents: exists 
          ? prev.selectedEvents.filter(id => id !== eventId)
          : [...prev.selectedEvents, eventId]
      };
    });
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpForm.name.trim()) return;

    const existing = JSON.parse(localStorage.getItem('wishlys_rsvps') || '[]');
    const newEntry = {
      id: 'rsvp_' + Date.now(),
      name: rsvpForm.name,
      phone: rsvpForm.phone,
      selectedEvents: rsvpForm.selectedEvents,
      guestCount: Number(rsvpForm.guestCount),
      dietary: rsvpForm.dietary,
      songRequest: rsvpForm.songRequest,
      message: rsvpForm.message,
      submittedAt: new Date().toISOString(),
    };
    localStorage.setItem('wishlys_rsvps', JSON.stringify([newEntry, ...existing]));

    setRsvpSubmitted(true);
    triggerCelebration('confetti');
    soundManager.playChime(784);
  };

  const visibleEvents = (data.events || []).filter(evt => {
    if (activeGroup === 'all' || !evt.group) return true;
    return evt.group === activeGroup || evt.group === 'all';
  });

  // Specific Theme Flags (from Wishlys video)
  const isZardozi = currentTemplate.id === 'zardozi';
  const isPichwai = currentTemplate.id === 'pichwai';
  const isMela = currentTemplate.id === 'mela';
  const isRajwada = currentTemplate.id === 'rajwada';
  const isNewspaper = currentTemplate.id === 'newspaper';
  const isCaricature = currentTemplate.id === 'caricature';
  const isExpress = currentTemplate.id === 'express';
  const isBougain = currentTemplate.id === 'bougain' || currentTemplate.id === 'bougainvillea';

  return (
    <div 
      className={`min-h-screen relative font-sans overflow-x-hidden selection:bg-[#C5A880]/30 transition-colors duration-500 ${
        isNewspaper ? 'bg-[#F6F1E5] text-[#1E1E1E]' : ''
      }`}
      style={{ 
        backgroundColor: isPichwai ? '#071A1E' : isZardozi ? '#FAF7F0' : (palette?.colors?.[0] || '#FAF7F2'), 
        color: isPichwai ? '#F4ECDE' : isNewspaper ? '#1E1E1E' : (palette?.colors?.[1] || '#2B1E17'),
        '--font-serif': data.typography?.bodyFont ? `"${data.typography.bodyFont}", Georgia, serif` : undefined,
        '--font-royal': data.typography?.headingFont ? `"${data.typography.headingFont}", serif` : undefined,
        '--font-script': data.typography?.scriptFont ? `"${data.typography.scriptFont}", cursive` : undefined,
      }}
    >
      {/* FULL-PAGE CONTINUOUS ANIMATED ATMOSPHERE (Canvas 60fps confined to invitation screen) */}
      <ThemeAtmosphere 
        themeId={currentTemplate.id} 
        atmosphere={data.atmosphere || { style: data.effect, intensity: 'medium' }} 
      />

      {/* 1. LUXE HEIRLOOM ZARDOZI: Gold embroidered corner filigrees & toran */}
      {isZardozi && (
        <>
          {/* Top Hanging Toran with Pearls & Silk Tassels */}
          <div className="w-full flex justify-center overflow-hidden pointer-events-none absolute top-0 left-0 right-0 z-30 opacity-95">
            <svg viewBox="0 0 800 65" className="w-full max-w-2xl h-auto animate-toran" fill="none">
              <path d="M0,0 L800,0 L800,20 C700,45 600,10 500,35 C400,10 300,45 200,20 C100,45 0,15 0,0 Z" fill="#D4AF37" fillOpacity="0.4" />
              <path d="M0,0 C100,30 200,15 300,35 C400,15 500,35 600,20 C700,35 800,15 800,0" stroke="#B8860B" strokeWidth="3" />
              {/* Pearl drops */}
              {[40, 120, 200, 280, 360, 440, 520, 600, 680, 760].map((x, i) => (
                <g key={i}>
                  <line x1={x} y1="15" x2={x} y2="40" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="2,2" />
                  <circle cx={x} cy="43" r="4" fill="#FFFDF0" stroke="#B8860B" strokeWidth="1" />
                  <circle cx={x} cy="53" r="3" fill="#D4AF37" />
                </g>
              ))}
            </svg>
          </div>
          {/* 4 Corner Ornaments */}
          <div className="pointer-events-none absolute top-3 left-3 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37] z-20" />
          <div className="pointer-events-none absolute top-3 right-3 w-16 h-16 border-t-2 border-r-2 border-[#D4AF37] z-20" />
          <div className="pointer-events-none absolute bottom-3 left-3 w-16 h-16 border-b-2 border-l-2 border-[#D4AF37] z-20" />
          <div className="pointer-events-none absolute bottom-3 right-3 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37] z-20" />
        </>
      )}

      {/* 2. LUXE MARIGOLD MELA: Festive tent awning canopy & hanging marigold garlands */}
      {isMela && (
        <div className="w-full pointer-events-none absolute top-0 left-0 right-0 z-30">
          {/* Scalloped Marigold Tent Awning Canopy */}
          <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 h-6 flex justify-around items-end">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-7 h-4 bg-amber-400 rounded-b-full border-b border-orange-600 shadow-xs" />
            ))}
          </div>
          {/* Hanging Marigold Garlands on both sides */}
          <div className="flex justify-between px-3 pt-1">
            <div className="flex flex-col gap-1 -mt-1 animate-sway">
              <span className="text-xl">🌼</span>
              <span className="text-xl">🏵️</span>
              <span className="text-xl">🌼</span>
              <span className="text-xl">🏵️</span>
            </div>
            <div className="flex flex-col gap-1 -mt-1 animate-sway" style={{ animationDelay: '1.5s' }}>
              <span className="text-xl">🏵️</span>
              <span className="text-xl">🌼</span>
              <span className="text-xl">🏵️</span>
              <span className="text-xl">🌼</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. LUXE PICHWAI LOTUS: Hanging golden lotus & midnight teal theme */}
      {isPichwai && (
        <div className="w-full flex justify-center pointer-events-none absolute top-0 left-0 right-0 z-30">
          {/* Hanging lotus suspended from golden cord */}
          <div className="flex flex-col items-center animate-sway">
            <div className="w-0.5 h-12 bg-gradient-to-b from-[#C5A880] to-[#E8D5B5]" />
            <div className="w-9 h-9 rounded-full bg-[#0D282E] border-2 border-[#C5A880] flex items-center justify-center shadow-lg -mt-1">
              <span className="text-base">🪷</span>
            </div>
          </div>
        </div>
      )}



      {/* 5. BOUGAINVILLEA VINES CANOPY */}
      {isBougain && <BougainvilleaCanopy />}

      {/* Floating Audio Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-200/90 shadow-lg">
        <button
          type="button"
          onClick={toggleMusic}
          className="flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-900 cursor-pointer"
          title={isPlayingMusic ? 'Mute Music' : 'Play Background Music'}
        >
          {isPlayingMusic ? (
            <>
              <span className="flex gap-0.5 items-end h-3.5">
                <span className="w-1 bg-[#8B6F47] rounded-full animate-pulse h-3" />
                <span className="w-1 bg-[#C5A880] rounded-full animate-pulse h-2" />
                <span className="w-1 bg-[#8B6F47] rounded-full animate-pulse h-3.5" />
              </span>
              <Volume2 className="w-4 h-4 text-[#8B6F47]" />
            </>
          ) : (
            <VolumeX className="w-4 h-4 text-stone-400" />
          )}
          <span className="text-[10px] tracking-wider uppercase font-bold text-[#8B6F47]">
            {isPlayingMusic ? currentMusic.name : 'Play Music'}
          </span>
        </button>
      </div>

      {/* REVEAL COVER MODAL (until unlocked) */}
      {!revealed && (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 z-40 bg-gradient-to-b from-[#FAF8F5]/95 via-[#F5EFE6]/95 to-[#FAF8F5]/95 backdrop-blur-sm">
          {(data.revealStyle === 'folding-doors' || (isCaricature && (!data.revealStyle || data.revealStyle === 'folding-doors'))) ? (
            <PastelFoldingDoorsReveal 
              onReveal={handleReveal} 
              bride={data.hosts?.bride} 
              groom={data.hosts?.groom} 
              coverPhoto={data.photos?.cover}
            />
          ) : (
            <>
              <div className="text-center space-y-3 mb-6 max-w-md">
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47] border border-[#C5A880]/50 bg-[#FAF5ED] px-3.5 py-1 rounded-full shadow-sm">
                  Exclusive Invitation
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2B1E17]">
                  {data.hosts?.bride} & {data.hosts?.groom}
                </h2>
                <p className="text-xs text-stone-500 font-light">
                  We invite you to unveil the celebration details below.
                </p>
              </div>

              {/* Reveal Element Selector */}
              <div className="w-full max-w-md">
                {data.revealStyle === 'scratch-date' && (
                  <ScratchDate 
                    onReveal={handleReveal}
                    date={formatDisplayDate(data.hosts?.date) || '9th December 2026'}
                    day={data.hosts?.day || 'Wednesday'}
                    city={data.hosts?.city || 'Meerut'}
                    names={`${data.hosts?.bride || 'Preeti'} & ${data.hosts?.groom || 'Ashish'}`}
                  />
                )}
                {data.revealStyle === 'scratch' && (
                  <ScratchCard 
                    onReveal={handleReveal} 
                    initials={data.monogram?.initials || 'P & A'}
                    names={`${data.hosts?.bride} & ${data.hosts?.groom}`}
                  />
                )}
                {data.revealStyle === 'seal' && (
                  <WaxSeal 
                    onReveal={handleReveal}
                    initials={data.monogram?.initials || 'P & A'}
                    names={`${data.hosts?.bride} & ${data.hosts?.groom}`}
                  />
                )}
                {data.revealStyle === 'ringbox' && (
                  <RingBox 
                    onReveal={handleReveal}
                    initials={data.monogram?.initials || 'P & A'}
                    names={`${data.hosts?.bride} & ${data.hosts?.groom}`}
                  />
                )}
                {data.revealStyle === 'doorbell' && (
                  <Doorbell 
                    onReveal={handleReveal}
                    names={`${data.hosts?.bride} & ${data.hosts?.groom}`}
                  />
                )}
                {(data.revealStyle === 'seal' || data.revealStyle === 'drag' || data.revealStyle === 'letter' || data.revealStyle === 'envelope') && (
                  <WaxSeal 
                    onReveal={handleReveal} 
                    initials={data.monogram?.initials || 'P & A'}
                    names={`${data.hosts?.bride} & ${data.hosts?.groom}`}
                  />
                )}
                {data.revealStyle === 'shaadi-story' && (
                  <div 
                    onClick={handleReveal}
                    className="bg-white rounded-3xl p-6 border-2 border-[#E6D5BF] shadow-xl text-center space-y-4 cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all"
                  >
                    <div className="relative inline-block mx-auto">
                      <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 animate-spin-slow">
                        <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
                          <img 
                            src={data.photos?.story || data.photos?.cover || './images/templates/caricature.webp'} 
                            alt="Story" 
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>
                      <span className="absolute bottom-0 right-0 bg-[#059669] text-white w-6 h-6 rounded-full text-xs font-bold shadow-md flex items-center justify-center">
                        ★
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                        Close Friends Only
                      </span>
                      <h3 className="font-serif text-2xl text-[#2B1E17] font-normal">Shaadi Story</h3>
                      <p className="text-xs text-stone-500 font-light">
                        Tap to watch the wedding story and unlock the celebration.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-full py-3 rounded-full bg-gradient-to-r from-[#8B6F47] to-[#A9825F] text-white font-medium text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 hover:opacity-95"
                    >
                      <span>Watch Shaadi Story</span>
                      <span>▶</span>
                    </button>
                  </div>
                )}
                {data.revealStyle === 'incoming-call' && (
                  <div 
                    onClick={handleReveal}
                    className="bg-[#1A1A1A] text-white rounded-3xl p-6 border border-stone-700 shadow-2xl text-center space-y-5 cursor-pointer hover:scale-[1.01] transition-all"
                  >
                    <div className="space-y-2">
                      <span className="text-[11px] text-stone-400 font-light uppercase tracking-widest animate-pulse">
                        Incoming Audio Call...
                      </span>
                      <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-emerald-400 p-0.5 shadow-lg">
                        <img 
                          src={data.photos?.cover || data.photos?.bride || './images/templates/caricature.webp'} 
                          alt="Hosts" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <h3 className="font-serif text-2xl text-white font-normal">{data.hosts?.bride} & {data.hosts?.groom}</h3>
                      <p className="text-xs text-stone-400">Wedding Celebration Invitation</p>
                    </div>
                    <div className="pt-2">
                      <button 
                        type="button"
                        className="w-full py-3.5 rounded-full bg-[#059669] hover:bg-[#047857] text-white font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg animate-bounce"
                      >
                        <span>Slide / Tap to Answer</span>
                        <span>📞</span>
                      </button>
                    </div>
                  </div>
                )}
                {data.revealStyle === 'quick-delivery' && (
                  <div 
                    onClick={handleReveal}
                    className="bg-white rounded-3xl p-6 border-2 border-[#E6D5BF] shadow-xl text-center space-y-4 cursor-pointer hover:scale-[1.01] transition-all"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
                      📦
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full inline-block">
                        Arriving in 10 mins
                      </span>
                      <h3 className="font-serif text-2xl text-[#2B1E17] font-normal">Express Wedding Delivery</h3>
                      <p className="text-xs text-stone-500 font-light">
                        A special package containing your invitation has arrived.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-full py-3 rounded-full bg-[#8B6F47] text-white font-medium text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Tap to Open Package</span>
                      <span>✨</span>
                    </button>
                  </div>
                )}
                {!['scratch-date', 'block-date', 'scratch', 'seal', 'drag', 'letter', 'envelope', 'ringbox', 'doorbell', 'shaadi-story', 'incoming-call', 'quick-delivery'].includes(data.revealStyle) && (
                  <div 
                    onClick={handleReveal}
                    className="bg-white rounded-3xl p-6 border-2 border-[#E6D5BF] shadow-xl text-center space-y-4 cursor-pointer hover:scale-[1.01] transition-all"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[#FAF5ED] border border-[#E6D5BF] text-[#8B6F47] flex items-center justify-center mx-auto text-2xl shadow-inner">
                      ✨
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B6F47] bg-[#FAF5ED] px-2.5 py-0.5 rounded-full inline-block">
                        Wedding Invitation Reveal
                      </span>
                      <h3 className="font-serif text-2xl text-[#2B1E17] font-normal">
                        {data.hosts?.bride} & {data.hosts?.groom}
                      </h3>
                      <p className="text-xs text-stone-500 font-light">
                        Tap below to unveil the celebration itinerary and RSVP.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-full py-3 rounded-full bg-gradient-to-r from-[#8B6F47] to-[#A9825F] text-white font-medium text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2"
                    >
                      <span>Open Invitation</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
                </div>
            </>
          )}

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleReveal}
              className="text-[11px] tracking-widest uppercase font-semibold text-[#8B6F47] hover:underline cursor-pointer"
            >
              Skip reveal and view invitation →
            </button>
          </div>
        </div>
      )}

      {/* FULL INVITATION WEBPAGE (Revealed) */}
      <div className={`transition-opacity duration-1000 relative ${revealed ? 'opacity-100' : 'hidden'}`}>
        
        {/* PARALLAX INDIAN WEDDING SVG LAYER (FOR CARICATURE & WEDDING THEMES) */}
        {isCaricature && <ParallaxWeddingDecorations />}
        
        {/* VINTAGE NEWSPAPER BANNER IF THEME IS NEWSPAPER */}
        {isNewspaper && (
          <header className="border-b-4 border-double border-stone-800 text-center py-6 px-4 bg-[#F6F1E5]">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-600">
              EST. 2027 · SPECIAL WEDDING CHRONICLE · NO. 1
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl font-black uppercase tracking-tight text-stone-900 my-1">
              THE SHAADI TIMES
            </h1>
            <div className="flex justify-between items-center text-[10px] uppercase font-semibold text-stone-600 border-t border-b border-stone-800 py-1 max-w-xl mx-auto">
              <span>VOL. I · ISSUE 1</span>
              <span>{data.hosts?.city || 'Meerut, Uttar Pradesh'}</span>
              <span>{data.hosts?.date || 'DECEMBER 09, 2026'}</span>
            </div>
          </header>
        )}

        {/* HERO SECTION WITH TEMPLATE ARTWORK BANNER */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 overflow-hidden">
          
          {/* Mela Rotating Sunburst Background */}
          {isMela && <FestiveSunburst />}

          {/* Ambient Decorative Ampersand */}
          <span 
            aria-hidden="true" 
            className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif font-extralight text-[24rem] md:text-[36rem] leading-none opacity-5 z-0"
            style={{ color: palette.colors[2] }}
          >
            &
          </span>

          {/* THEME HERO & COUPLE & CALENDAR (ALL THEMES SHARE THIS LUXURY STYLE) */}
          <div className="relative z-10 w-full flex flex-col items-center">
            <PastelCaricatureHero 
              couplePhoto={(data.photos?.cover && !data.photos.cover.includes('caricature.webp') && !data.photos.cover.includes('scooter_couple.webp')) ? data.photos.cover : getThemeHeroImage(currentTemplate.id)} 
              bride={data.hosts?.bride} 
              groom={data.hosts?.groom} 
              date={data.hosts?.date}
              monogram={data.monogram}
              palette={palette}
            />
            <PastelPolaroidCouple 
              bride={data.hosts?.bride} 
              groom={data.hosts?.groom} 
              bridePhoto={data.photos?.bride}
              groomPhoto={data.photos?.groomPhoto || data.photos?.groom}
              brideBio={data.photos?.brideBio}
              groomBio={data.photos?.groomBio}
              groomLineage={data.hosts?.groomParents}
              brideLineage={data.hosts?.brideParents}
            />
            <PastelHangingCalendar 
              date={data.hosts?.date}
              timeLeft={timeLeft}
            />
          </div>
        </section>

        {/* CELEBRATIONS ITINERARY & MOMENTS & MAP & RSVP (ALL THEMES SHARE THIS LUXURY CARICATURE STYLE) */}
        <section className="py-8 px-2 w-full max-w-[390px] mx-auto space-y-5">
          <div className="text-center space-y-1 mb-8">
            <span className="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold">
              Programme
            </span>
            <h2 className="font-serif text-3xl font-light text-[#2B1E17]">
              The Celebrations
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1" />
          </div>

          {/* Events with Authentic Theme Arches and Scooter Dividers */}
          <div className="space-y-6">
            {visibleEvents.map((evt, eIdx) => (
              <React.Fragment key={evt.id || eIdx}>
                <PastelEventCard event={evt} index={eIdx} templateId={currentTemplate.id} />
                {eIdx < visibleEvents.length - 1 && <PastelScooterDivider />}
              </React.Fragment>
            ))}
          </div>

          <MomentsAndMemories 
            photos={data.gallery || []} 
            isCaricature={true} 
            bride={data.hosts?.bride} 
            groom={data.hosts?.groom} 
            palette={palette} 
          />
          
          <PastelVenueMap 
            venue={data.events?.[0]?.venue || data.hosts?.city || 'Diaz Banquet'} 
            city={data.hosts?.city || 'Meerut, Uttar Pradesh'} 
            address={data.events?.[0]?.address || '111, Delhi Road, Opposite Deewan International Public School, Rithani, Meerut'} 
          />

          

          <PastelHashtagBanner hashtag={data.hosts?.hashtag || `#${(data.hosts?.bride || 'Bride').replace(/\s+/g, '')}Weds${(data.hosts?.groom || 'Groom').replace(/\s+/g, '')}`} />
          <PastelFooter bride={data.hosts?.bride} groom={data.hosts?.groom} />
        </section>
      </div>
    </div>
  );
}
