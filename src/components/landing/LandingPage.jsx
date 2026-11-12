import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Heart, Layers, FileText, ArrowRight, ChevronDown,
  Crown, Cake, Home, PartyPopper, Baby, Utensils, Cross,
  Palette, Wand2, Music, Check
} from 'lucide-react';
import { OCCASIONS, TEMPLATES } from '../../data/presets';
import { getOccasionUrl, resolveAssetUrl, OCCASION_ROUTE_SLUGS } from '../../utils/appAssets';

const CURRENT_YEAR = new Date().getFullYear();

const OCCASION_ICONS = {
  wedding: Crown,
  engagement: Heart,
  birthday: Cake,
  housewarming: Home,
  'house-party': PartyPopper,
  'baby-shower': Baby,
  annaprashan: Utensils,
  'holy-communion': Cross,
};

const ATELIER_FEATURES = [
  {
    icon: Wand2,
    badge: 'Interactive Openings',
    title: 'Couture Reveal Rituals',
    description:
      'Captivate guests before a single word appears with velvet folding doors, gilded scratch foils, wax-sealed envelopes, or silk ribbon unboxings.',
  },
  {
    icon: Palette,
    badge: 'Artisan Typography & Themes',
    title: 'Heirloom Illustrated Themes',
    description:
      'Choose from 20+ hand-crafted visual worlds with matched dynamic motifs, light & obsidian colorways, and expressive editorial fonts.',
  },
  {
    icon: FileText,
    badge: 'Standalone HTML & Print PDF',
    title: 'Direct Client Pages & Print Parity',
    description:
      'Publish a bespoke standalone web invitation under your client link, share cleanly on WhatsApp, or export crisp multi-page print PDFs.',
  },
];

const ATELIER_COMPARISON = [
  { label: 'Bespoke Occasion Studios', detail: 'Dedicated URL & starter experience per celebration', included: true },
  { label: 'Illustrated Theme Worlds', detail: '20+ hand-crafted motifs, colorways & custom fonts', included: true },
  { label: 'Interactive Opening Rituals', detail: '3D Doors, Scratch Card, Wax Seal, Letter & Curtain', included: true },
  { label: 'Curated Music & SFX Engine', detail: 'Built-in wedding melodies & custom audio uploads', included: true },
  { label: 'Saved Client Persistence', detail: 'Reopen and refine every saved client anytime', included: true },
  { label: 'Standalone Web & Print PDF', detail: 'Self-contained HTML link & crisp HTML-matched PDF', included: true },
];

const FAQS = [
  {
    q: 'How do clients receive and open a Paigaam invitation?',
    a: 'Every invitation publishes to a clean, self-contained link (for example /published/client-names.html) that opens instantaneously in WhatsApp, Safari, and Chrome on mobile or desktop with music, animations, and photos intact.',
  },
  {
    q: 'Does each occasion open in its own dedicated Studio?',
    a: 'Yes. Choosing Wedding, Engagement, Birthday, Housewarming, House Party, Baby Shower, Annaprashan, or Holy Communion takes you straight into that celebration’s tailored Studio workspace without overwriting your other saved projects.',
  },
  {
    q: 'Can I customize fonts, dark/light palettes, and reveal animations per client?',
    a: 'Completely. Mix editorial serif headings with flowing script calligraphy, switch between light silk and obsidian velvet palettes, and pair any theme with scratch foil, folding doors, wax seals, or ribbon unveils.',
  },
  {
    q: 'Can I save a client draft and pick up right where I left off?',
    a: 'Every detail—names, story chapters, photos, fonts, palette, music track, and selected events—is stored under that client’s profile so you can reopen any saved client in the Studio and continue seamlessly.',
  },
  {
    q: 'Is print PDF supported alongside the web experience?',
    a: 'Yes. Exporting a PDF generates a structured, high-resolution multi-page keepsake directly matching your chosen theme colors, typography, event schedule, and artwork.',
  },
];

function InteractiveGoldScratch({ bride = 'Ananya', groom = 'Vikram', date = 'November 24, 2026' }) {
  const canvasRef = useRef(null);
  const [revealedPct, setRevealedPct] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const isDrawingRef = useRef(false);

  const initScratchSurface = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#DFBE74');
    grad.addColorStop(0.35, '#F5DFAA');
    grad.addColorStop(0.65, '#C49A4B');
    grad.addColorStop(1, '#E8CA86');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle metallic sheen grain
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    for (let i = 0; i < 45; i++) {
      ctx.beginPath();
      ctx.arc((i * 37) % w, (i * 23) % h, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#3B2814';
    ctx.font = '600 11px "Plus Jakarta Sans", "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RUB GOLD FOIL TO REVEAL DATE', w / 2, h / 2 - 4);
    ctx.font = '700 12px "Montserrat", "Plus Jakarta Sans", sans-serif';
    ctx.fillText('✦  Paigaam Atelier Seal  ✦', w / 2, h / 2 + 16);
    setRevealedPct(0);
    setIsDone(false);
  };

  useEffect(() => {
    initScratchSurface();
  }, []);

  const scratchAt = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isDone) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    try {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0;
      const step = 16;
      for (let i = 3; i < pixels.length; i += 4 * step) {
        if (pixels[i] < 128) cleared++;
      }
      const totalSampled = pixels.length / (4 * step);
      const pct = Math.min(100, Math.round((cleared / totalSampled) * 100));
      setRevealedPct(pct);
      if (pct >= 42) setIsDone(true);
    } catch {
      // ignore canvas readback errors
    }
  };

  return (
    <div className="paigaam-atelier-card rounded-3xl p-6 sm:p-8 max-w-md w-full mx-auto relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#E6C88A] font-semibold">
          Interactive Reveal Preview
        </span>
        <button
          type="button"
          onClick={initScratchSurface}
          className="text-[11px] text-[#C7B8A3] hover:text-[#E6C88A] underline underline-offset-4 cursor-pointer transition-colors"
        >
          Reset Foil
        </button>
      </div>

      <div className="relative rounded-2xl border border-[#C8A055]/35 bg-[#120C0A] p-6 text-center overflow-hidden">
        <p className="site-display text-[11px] uppercase tracking-[0.26em] font-semibold text-[#E6C88A] mb-1">Save the Date</p>
        <h4 className="site-display text-2xl sm:text-3xl text-[#FBF7F0] tracking-tight">
          {bride} <span className="text-[#C8A055] font-light">&amp;</span> {groom}
        </h4>
        <div className="w-12 h-px bg-[#C8A055]/45 mx-auto my-4" />

        <div className="relative h-24 rounded-xl overflow-hidden border border-[#C8A055]/40 bg-gradient-to-br from-[#231813] to-[#140D0A] flex flex-col items-center justify-center">
          <p className="site-display text-xl text-[#F7E5BD] tracking-wide">{date}</p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#C7B8A3] mt-1">
            Udaipur · Heritage Palace
          </p>

          <canvas
            ref={canvasRef}
            width={340}
            height={110}
            onPointerDown={(e) => {
              isDrawingRef.current = true;
              scratchAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (isDrawingRef.current) scratchAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => { isDrawingRef.current = false; }}
            onPointerLeave={() => { isDrawingRef.current = false; }}
            className={`absolute inset-0 w-full h-full touch-none cursor-crosshair transition-opacity duration-500 ${
              isDone ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />
        </div>

        <p className="text-[11px] text-[#B5A48E] mt-4">
          {isDone ? '✦ Date unveiled — experience 8 reveal styles inside the Studio' : `Rub gently across the gold seal (${revealedPct}% revealed)`}
        </p>
      </div>
    </div>
  );
}

export default function LandingPage({ onOpenStudio }) {
  const [openFaq, setOpenFaq] = useState(0);

  const marqueeTemplates = (TEMPLATES || []).slice(0, 8);

  const handleOccasionNav = (e, occasionId) => {
    e.preventDefault();
    onOpenStudio(occasionId);
  };

  const getRelativeOccasionHref = (occasionId) => {
    const slug = OCCASION_ROUTE_SLUGS[occasionId];
    return slug ? `./${slug}/#studio` : './#studio';
  };

  return (
    <div className="paigaam-site min-h-screen bg-[#120C0A] text-[#FBF7F0] flex flex-col">
      {/* Subtle Top Couture Banner */}
      <div className="border-b border-[#C8A055]/20 bg-[#17100D] px-4 py-2 text-center">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#D8C5A6]">
          <span className="text-[#E6C88A] font-semibold">Paigaam</span> · Delivering Life’s Most Cherished Moments
        </p>
      </div>

      {/* Sticky Glass Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#C8A055]/20 bg-[#120C0A]/88 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <a
            href="#top"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full border border-[#C8A055]/55 bg-gradient-to-br from-[#2B1E17] to-[#120C0A] flex items-center justify-center shadow-lg group-hover:border-[#E6C88A] transition-colors">
              <span className="site-display text-lg text-[#E6C88A] font-bold leading-none">
                P
              </span>
            </div>
            <div>
              <span className="site-display text-xl sm:text-2xl tracking-tight text-[#FBF7F0] block leading-none">
                Paigaam
              </span>
              <span className="text-[9.5px] uppercase tracking-[0.22em] text-[#C8A055] block mt-1">
                Delivering Life’s Most Cherished Moments
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-[0.18em] text-[#D7C9B6]">
            <a href="#occasions" className="hover:text-[#E6C88A] transition-colors">Occasions</a>
            <a href="#experience" className="hover:text-[#E6C88A] transition-colors">Experience</a>
            <a href="#craftsmanship" className="hover:text-[#E6C88A] transition-colors">Craftsmanship</a>
            <a href="#faqs" className="hover:text-[#E6C88A] transition-colors">Questions</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={getRelativeOccasionHref('wedding')}
              onClick={(e) => handleOccasionNav(e, 'wedding')}
              className="paigaam-gold-btn px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Atelier Showcase */}
      <section id="top" className="relative overflow-hidden border-b border-[#C8A055]/15">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(65% 55% at 50% 0%, rgba(200, 160, 85, 0.16) 0%, rgba(18, 12, 10, 0) 70%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C8A055]/35 bg-[#1D1410] text-[11px] uppercase tracking-[0.22em] text-[#E6C88A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Celebration Atelier</span>
            </div>

            <h1 className="site-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FBF7F0] leading-[1.08]">
              Not Just an Invite.{' '}
              <span className="paigaam-gold-text font-extrabold block sm:inline">
                A Living Heirloom.
              </span>
            </h1>

            <p className="site-sans text-base sm:text-lg text-[#DDD0BE] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              <strong className="text-[#E6C88A] font-medium">Paigaam</strong> — Delivering Life’s Most Cherished Moments with opening rituals, bespoke motifs, your music, and signature client links.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href={getRelativeOccasionHref('wedding')}
                onClick={(e) => handleOccasionNav(e, 'wedding')}
                className="paigaam-gold-btn w-full sm:w-auto px-7 py-3.5 rounded-full text-xs uppercase tracking-[0.18em] font-bold inline-flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <span>Create Wedding Invitation</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#occasions"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-[#C8A055]/40 bg-[#1B130F] hover:bg-[#251A14] hover:border-[#E6C88A]/65 text-xs uppercase tracking-[0.18em] font-semibold text-[#F5EBDC] inline-flex items-center justify-center transition-all"
              >
                Browse All Occasions
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#C8A055]/15 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="site-display text-2xl sm:text-3xl text-[#E6C88A]">20+</p>
                <p className="text-[11px] uppercase tracking-wider text-[#B5A48E]">Artisan Themes</p>
              </div>
              <div>
                <p className="site-display text-2xl sm:text-3xl text-[#E6C88A]">8</p>
                <p className="text-[11px] uppercase tracking-wider text-[#B5A48E]">Reveal Rituals</p>
              </div>
              <div>
                <p className="site-display text-2xl sm:text-3xl text-[#E6C88A]">HTML + PDF</p>
                <p className="text-[11px] uppercase tracking-wider text-[#B5A48E]">Instant Exports</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <InteractiveGoldScratch />
          </div>
        </div>
      </section>

      {/* Theme Showcase Strip */}
      <section className="border-b border-[#C8A055]/15 bg-[#160F0C] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#C8A055] font-semibold">
              Signature Visual Worlds
            </p>
            <span className="site-sans text-xs sm:text-sm text-[#B5A48E]">
              Crafted for Light Ivory &amp; Velvet Noir palettes
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {marqueeTemplates.map((tmpl) => (
              <a
                key={tmpl.id}
                href={getRelativeOccasionHref('wedding')}
                onClick={(e) => handleOccasionNav(e, 'wedding')}
                className="group rounded-2xl overflow-hidden border border-[#C8A055]/25 bg-[#1D1410] hover:border-[#E6C88A]/65 transition-all"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#120C0A]">
                  <img
                    src={resolveAssetUrl(tmpl.image)}
                    alt={tmpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <p className="px-2 py-2 text-[10px] text-center font-medium text-[#E8DEC8] truncate">
                  {tmpl.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions Directory — Option 1 Per-Occasion Studio Links */}
      <section id="occasions" className="py-16 sm:py-22 border-b border-[#C8A055]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <span className="text-[11px] uppercase tracking-[0.26em] text-[#C8A055] font-semibold block">
              Dedicated Studios
            </span>
            <h2 className="site-display text-3xl sm:text-4xl text-[#FBF7F0] font-bold tracking-tight">
              Pick Your Occasion
            </h2>
            <p className="site-sans text-sm sm:text-base text-[#D0C1AC]">
              Every celebration opens its own bespoke Studio URL, pre-styled with tailored ceremonies and artwork while keeping your saved wedding invitations untouched.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OCCASIONS.map((occ) => {
              const Icon = OCCASION_ICONS[occ.id] || Sparkles;
              const isRoyal = occ.tag === 'Royal & Elegant';
              const isNew = occ.tag === 'New';
              const routeSlug = OCCASION_ROUTE_SLUGS[occ.id];
              const displayRoute = routeSlug ? `/${routeSlug}/#studio` : '/wedding-invitation/#studio';

              return (
                <a
                  key={occ.id}
                  href={getOccasionUrl(occ.id)}
                  onClick={(e) => handleOccasionNav(e, occ.id)}
                  data-occasion-id={occ.id}
                  className="paigaam-atelier-card group rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-5">
                      <div className="w-11 h-11 rounded-2xl border border-[#C8A055]/35 bg-[#C8A055]/10 flex items-center justify-center text-[#E6C88A] group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      {occ.tag && (
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                            isRoyal
                              ? 'border-[#E6C88A]/60 bg-[#C8A055]/20 text-[#F4D99B]'
                              : isNew
                                ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                                : 'border-[#C8A055]/25 bg-[#19110D] text-[#C8B9A6]'
                          }`}
                        >
                          {occ.tag}
                        </span>
                      )}
                    </div>

                    <h3 className="site-display text-xl text-[#FBF7F0] group-hover:text-[#E6C88A] transition-colors mb-2">
                      {occ.title}
                    </h3>
                    <p className="text-xs text-[#BFB09C] leading-relaxed">
                      {occ.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#C8A055]/15 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#9E8E7A] truncate pr-2">
                      {displayRoute}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E6C88A] inline-flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition-transform">
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Craftsmanship Features */}
      <section id="craftsmanship" className="py-16 sm:py-22 bg-[#160F0C] border-b border-[#C8A055]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <span className="text-[11px] uppercase tracking-[0.26em] text-[#C8A055] font-semibold block">
              The Paigaam Craft
            </span>
            <h2 className="site-display text-3xl sm:text-4xl text-[#FBF7F0] font-bold tracking-tight">
              Every Detail, Deliberately Elevated
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ATELIER_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="paigaam-atelier-card rounded-3xl p-7 space-y-4">
                  <div className="w-12 h-12 rounded-2xl border border-[#C8A055]/35 bg-[#C8A055]/10 flex items-center justify-center text-[#E6C88A]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#C8A055] font-bold">
                    {feat.badge}
                  </p>
                  <h3 className="site-display text-2xl text-[#FBF7F0]">{feat.title}</h3>
                  <p className="text-sm text-[#C7B8A3] leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Standard Included Ledger */}
      <section id="experience" className="py-16 sm:py-20 border-b border-[#C8A055]/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="paigaam-atelier-card rounded-3xl p-7 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#C8A055]/20">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#C8A055] font-semibold">
                  Paigaam Studio Standard
                </p>
                <h2 className="site-display text-3xl text-[#FBF7F0] mt-1">
                  Included Across Every Client Invitation
                </h2>
              </div>
              <a
                href={getRelativeOccasionHref('wedding')}
                onClick={(e) => handleOccasionNav(e, 'wedding')}
                className="paigaam-gold-btn px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 self-start md:self-auto"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Launch Studio</span>
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-6">
              {ATELIER_COMPARISON.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-[#C8A055]/15 bg-[#140D0A]/80"
                >
                  <div className="w-6 h-6 rounded-full bg-[#C8A055]/15 border border-[#C8A055]/40 text-[#E6C88A] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#FBF7F0]">{row.label}</h4>
                    <p className="text-xs text-[#B5A48E] mt-0.5">{row.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-16 sm:py-20 border-b border-[#C8A055]/15 bg-[#160F0C]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[11px] uppercase tracking-[0.26em] text-[#C8A055] font-semibold">
              Atelier Notes
            </span>
            <h2 className="site-display text-3xl sm:text-4xl text-[#FBF7F0]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-2xl border border-[#C8A055]/25 bg-[#1C130F] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-medium text-[#FBF7F0]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#C8A055] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-[#C7B8A3] leading-relaxed border-t border-[#C8A055]/10 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <Music className="w-6 h-6 text-[#C8A055] mx-auto" />
          <h2 className="site-display text-3xl sm:text-4xl text-[#FBF7F0] font-bold tracking-tight leading-tight">
            Compose Your Celebration in Paigaam Studio
          </h2>
          <p className="site-sans text-base sm:text-lg text-[#D0C1AC] max-w-xl mx-auto">
            Select an occasion above or enter the Studio directly to design, preview live, and publish your standalone invitation.
          </p>
          <div className="pt-2">
            <a
              href={getRelativeOccasionHref('wedding')}
              onClick={(e) => handleOccasionNav(e, 'wedding')}
              className="paigaam-gold-btn px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold inline-flex items-center gap-2.5 cursor-pointer"
            >
              <span>Enter Paigaam Studio</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="mt-auto border-t border-[#C8A055]/20 bg-[#0E0907] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#C8A055]/50 bg-[#1B120E] flex items-center justify-center">
              <span className="site-display text-base text-[#E6C88A] font-bold">P</span>
            </div>
            <div>
              <p className="site-display text-lg text-[#FBF7F0]">Paigaam</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#A89783]">
                Delivering Life’s Most Cherished Moments
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#C7B8A3]">
            {OCCASIONS.slice(0, 4).map((occ) => (
              <a
                key={occ.id}
                href={getOccasionUrl(occ.id)}
                onClick={(e) => handleOccasionNav(e, occ.id)}
                className="hover:text-[#E6C88A] transition-colors"
              >
                {occ.title}
              </a>
            ))}
          </div>

          <p className="text-xs text-[#8A7967]">
            © {CURRENT_YEAR} Paigaam Atelier
          </p>
        </div>
      </footer>
    </div>
  );
}
