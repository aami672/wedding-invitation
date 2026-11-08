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
    const targetDate = new Date(data.hosts?.date || '2027-02-14').getTime();
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
        color: isPichwai ? '#F4ECDE' : isNewspaper ? '#1E1E1E' : (palette?.colors?.[1] || '#2B1E17') 
      }}
    >
      {/* FULL-PAGE CONTINUOUS ANIMATED ATMOSPHERE (Canvas 60fps) */}
      <ThemeAtmosphere themeId={currentTemplate.id} />

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
                    date={data.hosts?.date || '14th February 2027'}
                    day={data.hosts?.day || 'Sunday'}
                    city={data.hosts?.city || 'Udaipur, Rajasthan'}
                    names={`${data.hosts?.bride} & ${data.hosts?.groom}`}
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
                            src={data.photos?.story || data.photos?.cover || './images/templates/caricature-couple.png'} 
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
                          src={data.photos?.cover || data.photos?.bride || './images/templates/caricature-couple.png'} 
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

          {/* THEME HERO: PASTEL CARICATURE OR DEFAULT HERO */}
          {isCaricature ? (
            <div className="relative z-10 w-full flex flex-col items-center">
              <PastelCaricatureHero 
                couplePhoto={data.photos?.cover || currentTemplate.image} 
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
          ) : (
            <>
              {/* THEMATIC HERO OBJECT: BIOSCOPE BOOTH FOR MARIGOLD MELA (from Wishlys video frame 130) */}
              {isMela && (
                <div className="relative z-10 w-full flex flex-col items-center">
                  <span className="text-[11px] tracking-[0.35em] uppercase font-bold text-[#EA580C] mb-1">
                    YOU ARE CORDIALLY INVITED
                  </span>
                  <BioscopeBooth 
                    couplePhoto={data.photos?.cover || currentTemplate.image} 
                    names={`${data.hosts?.bride} & ${data.hosts?.groom}`} 
                  />
                </div>
              )}

              <div className="relative z-10 max-w-3xl mx-auto space-y-5">
                {/* Monogram Seal */}
                <div 
                  className="w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center shadow-lg font-royal text-lg font-bold tracking-widest bg-white/80 backdrop-blur-sm"
                  style={{ borderColor: palette.colors[2], color: palette.colors[1] }}
                >
                  {data.monogram?.initials || 'A & S'}
                </div>

                <p className="text-[11px] tracking-[0.3em] uppercase font-semibold text-[#8B6F47]">
                  {data.hosts?.title || 'Together with their families'}
                </p>

                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light tracking-tight leading-none text-[#2B1E17]">
                  {data.hosts?.bride} <br />
                  <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#8B6F47] lowercase">and</span> <br />
                  {data.hosts?.groom}
                </h1>

                <div className="flex items-center justify-center gap-3 text-[#C5A880]">
                  <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C5A880]" />
                  <span className="rotate-45 inline-block w-1.5 h-1.5 border border-[#C5A880]" />
                  <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C5A880]" />
                </div>

                <p className="font-royal text-sm sm:text-base tracking-[0.2em] uppercase font-medium text-[#2B1E17]/80">
                  {data.hosts?.city || 'Udaipur, Rajasthan'} · {data.hosts?.date || '14th February 2027'}
                </p>

                <p className="text-stone-600 text-sm sm:text-base font-light italic max-w-lg mx-auto leading-relaxed">
                  "{data.hosts?.welcomeQuote}"
                </p>

                {data.hosts?.hashtag && (
                  <span className="inline-block text-[11px] tracking-widest uppercase font-semibold text-[#8B6F47] bg-[#FAF5ED] border border-[#E6D5BF] px-4 py-1.5 rounded-full shadow-xs">
                    {data.hosts?.hashtag}
                  </span>
                )}
              </div>

              {/* Live Countdown Bar */}
              <div className="relative z-10 mt-10 w-full max-w-xl mx-auto bg-white/85 backdrop-blur-md rounded-2xl border border-[#E6D5BF] p-5 shadow-sm">
                <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8B6F47] mb-3">
                  Counting Down To The Celebration
                </p>
                <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                  <div className="bg-[#FAF5ED]/80 p-2.5 rounded-xl border border-[#E6D5BF]/60">
                    <span className="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">{timeLeft.days}</span>
                    <p className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mt-0.5">Days</p>
                  </div>
                  <div className="bg-[#FAF5ED]/80 p-2.5 rounded-xl border border-[#E6D5BF]/60">
                    <span className="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">{timeLeft.hours}</span>
                    <p className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mt-0.5">Hours</p>
                  </div>
                  <div className="bg-[#FAF5ED]/80 p-2.5 rounded-xl border border-[#E6D5BF]/60">
                    <span className="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">{timeLeft.mins}</span>
                    <p className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mt-0.5">Mins</p>
                  </div>
                  <div className="bg-[#FAF5ED]/80 p-2.5 rounded-xl border border-[#E6D5BF]/60">
                    <span className="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">{timeLeft.secs}</span>
                    <p className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mt-0.5">Secs</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* MEET THE BRIDE & GROOM & GALLERY (ONLY FOR NON-CARICATURE THEMES) */}
        {!isCaricature && (
          <>
            <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
              <div className="text-center space-y-2 mb-10">
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47]">The Couple</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2B1E17]">Meet Bride & Groom</h2>
                <div className="h-0.5 w-12 bg-[#C5A880] mx-auto mt-2" />
              </div>

              {/* TWO CIRCULAR PORTRAIT CARDS SIDE-BY-SIDE */}
              <div className="grid grid-cols-2 gap-3.5 sm:gap-6 max-w-xl mx-auto">
                {/* The Groom Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 sm:p-7 border border-[#C5A880]/60 shadow-lg text-center flex flex-col items-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#C5A880] shadow-md mb-3.5 p-1 bg-white ring-4 ring-[#FAF5ED]">
                    <img 
                      src={data.photos?.groom || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'} 
                      alt={data.hosts?.groom || 'Groom'} 
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="inline-block px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mb-1.5 bg-[#FAF5ED] border border-[#E6D5BF] text-[#8B6F47]">
                    The Groom
                  </span>
                  <h4 className="font-serif text-lg sm:text-2xl text-[#2B1E17] font-semibold">
                    {data.hosts?.groom || 'Groom'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-600 italic mt-1.5 leading-relaxed">
                    "{data.photos?.groomBio || 'Foodie, photography enthusiast, and the architect of their happiest memories.'}"
                  </p>
                </div>

                {/* The Bride Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-4 sm:p-7 border border-[#C5A880]/60 shadow-lg text-center flex flex-col items-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#C5A880] shadow-md mb-3.5 p-1 bg-white ring-4 ring-[#FAF5ED]">
                    <img 
                      src={data.photos?.bride || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'} 
                      alt={data.hosts?.bride || 'Bride'} 
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="inline-block px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mb-1.5 bg-[#FAF5ED] border border-[#E6D5BF] text-[#8B6F47]">
                    The Bride
                  </span>
                  <h4 className="font-serif text-lg sm:text-2xl text-[#2B1E17] font-semibold">
                    {data.hosts?.bride || 'Bride'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-600 italic mt-1.5 leading-relaxed">
                    "{data.photos?.brideBio || 'Loves classic poetry, morning chai, and spontaneous mountain hikes.'}"
                  </p>
                </div>
              </div>
            </section>

            {/* MOMENTS & MEMORIES GALLERY & GUEST PHOTO UPLOAD SECTION */}
            <MomentsAndMemories 
              photos={data.gallery || []} 
              isCaricature={false} 
              bride={data.hosts?.bride} 
              groom={data.hosts?.groom} 
              palette={palette} 
            />
          </>
        )}

        {/* CELEBRATIONS ITINERARY */}
        {isCaricature ? (
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

            {/* Events with Authentic Caricature Arches and Scooter Dividers */}
            <div className="space-y-6">
              {visibleEvents.map((evt, idx) => (
                <React.Fragment key={evt.id}>
                  <PastelEventCard event={evt} index={idx} />
                  {idx < visibleEvents.length - 1 && <PastelScooterDivider />}
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
              venue={data.events?.[0]?.venue || data.hosts?.city || 'Umaid Bhawan Palace'} 
              city={data.hosts?.city || 'Udaipur, Rajasthan'} 
              address={data.events?.[0]?.address || 'Circuit House Rd, Cantt Area, Jodhpur'} 
            />



            <PastelHashtagBanner hashtag={data.hosts?.hashtag || `#${(data.hosts?.bride || 'Bride').replace(/\s+/g, '')}Weds${(data.hosts?.groom || 'Groom').replace(/\s+/g, '')}`} />
            <PastelFooter bride={data.hosts?.bride} groom={data.hosts?.groom} />
          </section>
        ) : (
          <>
            <section className="py-16 px-4 sm:px-6 bg-[#FAF5ED]/50 border-y border-[#E6D5BF]/60">
              <div className="max-w-3xl mx-auto">
                <div className="text-center space-y-2 mb-10">
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47]">The Itinerary</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2B1E17]">Celebration Events</h2>
                  <p className="text-xs text-stone-500 font-light">Dates, timings, dress codes, and interactive venue maps.</p>
                </div>

                <div className="space-y-10">
                  {visibleEvents.map((evt, idx) => {
                    const isHaldiMehndi = evt.name?.toLowerCase().includes('haldi') || evt.name?.toLowerCase().includes('mehndi');
                    const isWeddingPheras = evt.name?.toLowerCase().includes('wedding') || evt.name?.toLowerCase().includes('phera') || evt.name?.toLowerCase().includes('shaadi');

                    return (
                      <div 
                        key={evt.id} 
                        className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6D5BF] shadow-md hover:shadow-lg transition-shadow space-y-5"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest font-bold text-[#8B6F47] block mb-1">
                              CHAPTER {idx + 1}
                            </span>
                            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">{evt.name}</h3>
                            <p className="text-xs text-stone-600 font-semibold mt-0.5">{evt.date} · {evt.time}</p>
                          </div>
                          {evt.dressCode && (
                            <span className="text-[9px] tracking-wider uppercase font-bold text-[#8B6F47] bg-[#FAF5ED] border border-[#E6D5BF] px-3 py-1.5 rounded-full shrink-0">
                              {evt.dressCode}
                            </span>
                          )}
                        </div>

                        {isHaldiMehndi && <UrliCeremonyScene title={evt.name} />}
                        {isWeddingPheras && <RoyalWeddingMandap bride={data.hosts?.bride} groom={data.hosts?.groom} />}

                        <DirectionalSignpost 
                          venue={evt.venue} 
                          address={evt.address} 
                          mapsUrl={evt.mapsUrl} 
                        />

                        <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-inner">
                          <iframe
                            title={`Map for ${evt.name}`}
                            width="100%"
                            height="180"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={evt.mapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent((evt.venue || '') + ' ' + (evt.address || 'Udaipur'))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* RADIATING CELEBRATORY FIREWORKS SPARKLERS */}
            <CelebratoryFireworks />

            {/* LUXURY FOOTER */}
            <footer className="py-14 text-center space-y-3 border-t border-[#E6D5BF]/60 bg-white/40">
              <div className="w-10 h-10 mx-auto rounded-full border border-[#C5A880] flex items-center justify-center font-royal text-xs font-bold text-[#8B6F47]">
                {data.monogram?.initials || 'P & A'}
              </div>
              <p className="font-serif text-2xl font-light text-[#2B1E17]">
                See you at the shaadi!
              </p>
              <p className="text-xs text-stone-500 font-light">
                With love, {data.hosts?.bride} & {data.hosts?.groom}
              </p>
              <div className="pt-2">
                <span className="text-[10px] tracking-widest uppercase text-stone-400">
                  Powered by Wishlys Free · 100% Free Creation
                </span>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
