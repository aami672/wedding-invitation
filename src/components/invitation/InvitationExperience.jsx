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
  ThemeDivider,
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
import {
  getThemeDesign,
  resolvePaletteTheme,
  resolveTypographyVars,
  renderThemeTopHtml,
  renderThemeSideHtml,
  SHARED_INVITATION_CSS,
} from '../../utils/themeDecorConfig';
import {
  REVEAL_SHARED_CSS,
  normalizeRevealId,
  getRevealCopy,
} from '../../utils/revealConfig';
import UniversalRevealWidget from '../reveals/UniversalReveals';

export default function InvitationExperience({
  data,
  isPreview = false,
  previewMode = 'invite', // 'invite' or 'replay'
  activeGroup = 'all',
  replayNonce = 0,
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
  }, [previewMode, isPreview, data.revealStyle, replayNonce]);

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

  // Specific Theme Flags & Shared Theme/Palette Config
  const palTheme = resolvePaletteTheme(currentTemplate.id, data.palette);
  const typoVars = resolveTypographyVars(data.typography);
  const themeDesign = getThemeDesign(currentTemplate.id);
  const topThemeHtml = !themeDesign.isCaricature ? renderThemeTopHtml(currentTemplate.id) : '';
  const sideThemeHtml = !themeDesign.isCaricature ? renderThemeSideHtml(currentTemplate.id) : '';

  const isZardozi = currentTemplate.id === 'zardozi';
  const isPichwai = currentTemplate.id === 'pichwai';
  const isMela = currentTemplate.id === 'mela';
  const isRajwada = currentTemplate.id === 'rajwada';
  const isNewspaper = themeDesign.isNewspaper;
  const isCaricature = themeDesign.isCaricature;
  const isBougain = currentTemplate.id === 'bougain' || currentTemplate.id === 'bougainvillea';

  return (
    <div 
      className={`inv-theme-root ${palTheme.isDark ? 'inv-dark' : 'inv-light'} ${themeDesign.cardClass} min-h-screen relative overflow-x-hidden selection:bg-[#C5A880]/30 transition-colors duration-500`}
      style={{ 
        backgroundColor: palTheme.bg, 
        color: palTheme.text,
        ...palTheme.cssVars,
        ...typoVars.cssVars,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: SHARED_INVITATION_CSS + '\n' + REVEAL_SHARED_CSS }} />
      {!isCaricature && (topThemeHtml || sideThemeHtml) && (
        <div dangerouslySetInnerHTML={{ __html: topThemeHtml + sideThemeHtml }} />
      )}
      {/* FULL-PAGE CONTINUOUS ANIMATED ATMOSPHERE (Canvas 60fps confined to invitation screen) */}
      <ThemeAtmosphere 
        themeId={currentTemplate.id} 
        atmosphere={data.atmosphere || { style: data.effect, intensity: 'medium' }} 
      />

      {/* Floating Audio Controls */}
      <div className="inv-surface fixed top-4 right-4 z-50 flex items-center gap-2 backdrop-blur-md px-3.5 py-1.5 rounded-full border shadow-lg">
        <button
          type="button"
          onClick={toggleMusic}
          className="flex items-center gap-2 text-xs font-semibold inv-heading hover:opacity-85 cursor-pointer"
          title={isPlayingMusic ? 'Mute Music' : 'Play Background Music'}
        >
          {isPlayingMusic ? (
            <>
              <span className="flex gap-0.5 items-end h-3.5">
                <span className="w-1 rounded-full animate-pulse h-3" style={{ backgroundColor: 'var(--pal-accent)' }} />
                <span className="w-1 rounded-full animate-pulse h-2" style={{ backgroundColor: 'var(--pal-eyebrow)' }} />
                <span className="w-1 rounded-full animate-pulse h-3.5" style={{ backgroundColor: 'var(--pal-accent)' }} />
              </span>
              <Volume2 className="w-4 h-4 inv-accent" />
            </>
          ) : (
            <VolumeX className="w-4 h-4 inv-muted" />
          )}
          <span className="text-[10px] tracking-wider uppercase font-bold inv-accent">
            {isPlayingMusic ? currentMusic.name : 'Play Music'}
          </span>
        </button>
      </div>

      {/* REVEAL COVER MODAL (until unlocked) */}
      {!revealed && (() => {
        const activeRevealId = normalizeRevealId(data.revealStyle, currentTemplate.id);
        const revealMeta = getRevealCopy(activeRevealId, { templateId: currentTemplate.id });
        const revealKey = `${activeRevealId}-${replayNonce}`;
        const formattedWeddingDate = formatDisplayDate(data.hosts?.date) || '9th December 2026';
        const coupleNames = `${data.hosts?.bride || 'Preeti'} & ${data.hosts?.groom || 'Ashish'}`;
        const monoInitials = data.monogram?.initials && data.monogram.initials !== 'B & G' && data.monogram.initials !== 'A & S'
          ? data.monogram.initials
          : `${(data.hosts?.bride || 'P')[0]} & ${(data.hosts?.groom || 'A')[0]}`;

        return (
        <div
          className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 z-40 backdrop-blur-sm"
          style={{ backgroundColor: palTheme.bg }}
        >
          {activeRevealId === 'folding-doors' ? (
            <PastelFoldingDoorsReveal
              key={revealKey}
              onReveal={handleReveal}
              bride={data.hosts?.bride}
              groom={data.hosts?.groom}
              coverPhoto={data.photos?.cover}
              templateId={currentTemplate.id}
            />
          ) : (
            <>
              <div className="text-center space-y-3 mb-6 max-w-md">
                <span className="inv-pill text-[10px] tracking-[0.3em] uppercase font-bold border px-3.5 py-1 rounded-full shadow-sm inline-block">
                  {revealMeta.eyebrow}
                </span>
                <h2 className="font-royal text-3xl sm:text-4xl font-light inv-heading">
                  {coupleNames}
                </h2>
                <p className="text-xs inv-muted font-light">
                  {revealMeta.hint}
                </p>
              </div>

              <div className="w-full max-w-md">
                {activeRevealId === 'scratch-date' ? (
                  <ScratchDate
                    key={revealKey}
                    onReveal={handleReveal}
                    date={formattedWeddingDate}
                    day={data.hosts?.day || 'Wednesday'}
                    city={data.hosts?.city || 'Meerut'}
                    names={coupleNames}
                  />
                ) : activeRevealId === 'scratch' ? (
                  <ScratchCard
                    key={revealKey}
                    onReveal={handleReveal}
                    initials={monoInitials}
                    names={coupleNames}
                  />
                ) : activeRevealId === 'seal' ? (
                  <WaxSeal
                    key={revealKey}
                    onReveal={handleReveal}
                    initials={monoInitials}
                    names={coupleNames}
                  />
                ) : activeRevealId === 'ringbox' ? (
                  <RingBox
                    key={revealKey}
                    onReveal={handleReveal}
                    initials={monoInitials}
                    names={coupleNames}
                  />
                ) : activeRevealId === 'doorbell' ? (
                  <Doorbell
                    key={revealKey}
                    onReveal={handleReveal}
                    names={coupleNames}
                  />
                ) : (
                  <UniversalRevealWidget
                    key={revealKey}
                    revealId={activeRevealId}
                    onReveal={handleReveal}
                    data={data}
                    displayDate={formattedWeddingDate}
                    initials={monoInitials}
                    coverPhoto={data.photos?.cover}
                  />
                )}
              </div>
            </>
          )}

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleReveal}
              className="text-[11px] tracking-widest uppercase font-semibold inv-accent hover:underline cursor-pointer"
            >
              Skip reveal and view invitation →
            </button>
          </div>
        </div>
        );
      })()}

      {/* FULL INVITATION WEBPAGE (Revealed) */}
      <div className={`transition-opacity duration-1000 relative ${revealed ? 'opacity-100' : 'hidden'}`}>
        
        {/* PARALLAX INDIAN WEDDING SVG LAYER (FOR CARICATURE & WEDDING THEMES) */}
        {isCaricature && <ParallaxWeddingDecorations />}
        
        {/* VINTAGE NEWSPAPER BANNER IF THEME IS NEWSPAPER */}
        {isNewspaper && (
          <header className="border-b-4 border-double inv-surface text-center py-6 px-4">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold inv-muted">
              EST. 2027 · SPECIAL WEDDING CHRONICLE · NO. 1
            </p>
            <h1 className="font-royal text-4xl sm:text-6xl font-black uppercase tracking-tight inv-heading my-1">
              THE SHAADI TIMES
            </h1>
            <div className="flex justify-between items-center text-[10px] uppercase font-semibold inv-muted border-t border-b border-current/40 py-1 max-w-xl mx-auto">
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

          {/* THEME HERO & COUPLE & CALENDAR */}
          <div className="relative z-10 w-full flex flex-col items-center">
            <PastelCaricatureHero 
              couplePhoto={(data.photos?.cover && !data.photos.cover.includes('caricature.webp') && !data.photos.cover.includes('scooter_couple.webp') && !data.photos.cover.includes('04-pheras.webp')) ? data.photos.cover : getThemeHeroImage(currentTemplate.id)} 
              bride={data.hosts?.bride} 
              groom={data.hosts?.groom} 
              date={data.hosts?.date}
              monogram={data.monogram}
              palette={palette}
              templateId={currentTemplate.id}
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
              templateId={currentTemplate.id}
            />
            <PastelHangingCalendar 
              date={data.hosts?.date}
              timeLeft={timeLeft}
              templateId={currentTemplate.id}
              isDark={palTheme.isDark}
            />
          </div>
        </section>

        {/* CELEBRATIONS ITINERARY & MOMENTS & MAP */}
        <section className="py-8 px-2 w-full max-w-[390px] mx-auto space-y-5">
          <div className="text-center space-y-1 mb-8">
            <span className="text-[11px] font-script tracking-wider inv-eyebrow block font-semibold">
              Programme
            </span>
            <h2 className="font-royal text-3xl font-light inv-heading">
              The Celebrations
            </h2>
            <div className="w-20 h-1 inv-rule mx-auto rounded-full mt-1" />
          </div>

          {/* Events with Authentic Theme Arches and Theme Dividers */}
          <div className="space-y-6">
            {visibleEvents.map((evt, eIdx) => (
              <React.Fragment key={evt.id || eIdx}>
                <PastelEventCard event={evt} index={eIdx} templateId={currentTemplate.id} />
                {eIdx < visibleEvents.length - 1 && <ThemeDivider templateId={currentTemplate.id} />}
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
            templateId={currentTemplate.id}
          />

          <PastelHashtagBanner 
            hashtag={data.hosts?.hashtag || `#${(data.hosts?.bride || 'Bride').replace(/\s+/g, '')}Weds${(data.hosts?.groom || 'Groom').replace(/\s+/g, '')}`}
            templateId={currentTemplate.id}
          />
          <PastelFooter bride={data.hosts?.bride} groom={data.hosts?.groom} templateId={currentTemplate.id} />
        </section>
      </div>
    </div>
  );
}
