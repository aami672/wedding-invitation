import React, { useState } from 'react';
import { 
  Sparkles, Heart, Gift, Home, PartyPopper, Baby, Utensils, Church, 
  ArrowRight, Check, Film, Volume2, Shield, Calendar, Compass, Share2, 
  ChevronDown, Download, Eye, Smartphone, HelpCircle
} from 'lucide-react';
import { OCCASIONS } from '../../data/presets';
import ScratchCard from '../reveals/ScratchCard';
import ScratchDate from '../reveals/ScratchDate';

export default function LandingPage({ onOpenStudio, onOpenDashboard }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [sandboxMode, setSandboxMode] = useState('date'); // 'date' or 'card'

  const faqs = [
    {
      q: "What exactly is a cinematic invitation website?",
      a: "A personal, animated website for your wedding or celebration, not a static PDF or picture. It opens with an interactive reveal (like scratching real gold foil or breaking a wax seal), plays your soundtrack, showcases your photos and multi-day itinerary, and collects guest RSVPs in real time."
    },
    {
      q: "Is Wishlys Free really 100% free with no hidden charges?",
      a: "Yes! While commercial platforms charge ₹1,899+ or place view limits, Wishlys Free is completely free and open-source. You get unlimited guests, unlimited RSVPs, full access to all 16 palettes, audio synthesizer, and offline HTML export."
    },
    {
      q: "What link do my guests receive?",
      a: "You can download the standalone single-file HTML to host anywhere (e.g. GitHub Pages, Vercel, Netlify) or share it directly. When pasted into WhatsApp or Instagram, it unfurls into an elegant preview card with your names and photos."
    },
    {
      q: "Can different guests see different events?",
      a: "Yes! You can configure guest groups (such as Family, Close Friends, and General). For example, Haldi and Mehendi can be reserved for family while everyone sees the Sangeet and Reception."
    },
    {
      q: "Where do guest RSVPs go? Is my data safe?",
      a: "All replies (attendance, headcounts, dietary choices, and DJ song requests) land directly in your private Host Dashboard stored on your device. You can download the guest list as a CSV spreadsheet anytime."
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-800 font-sans selection:bg-[#C5A880]/30 relative overflow-x-hidden">
      {/* Background radial dot grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4c0ab_0.8px,transparent_0.8px)] bg-[size:28px_28px] opacity-[0.18] pointer-events-none" />

      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="relative z-50 shrink-0 bg-[#2B1E17] px-6 py-2.5 text-center text-xs leading-snug text-[#F5EBDD] flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
        <span>
          <strong className="font-semibold text-amber-200">Open-Source & 100% Free Forever:</strong> No paywalls, no watermark, unlimited guests & instant offline HTML export.
        </span>
      </div>

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-40 w-full px-6 py-4 md:px-16 flex justify-between items-center border-b border-[#eae3d2]/70 bg-[#FDFBF7]/85 backdrop-blur-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-full bg-[#2B1E17] border border-[#C5A880] flex items-center justify-center font-royal text-gold-300 text-xs font-bold shadow-sm">
            W
          </div>
          <span className="font-serif text-2xl font-light tracking-wide text-[#2B1E17]">
            Wishlys<span className="text-[#8B6F47] font-semibold">Free</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.2em] uppercase font-semibold text-neutral-500">
          <a href="#collections" className="hover:text-[#8B6F47] transition-colors">Occasions</a>
          <a href="#features" className="hover:text-[#8B6F47] transition-colors">Features</a>
          <a href="#sandbox" className="hover:text-[#8B6F47] transition-colors">Live Reveal</a>
          <a href="#comparison" className="hover:text-[#8B6F47] transition-colors">Why Free</a>
          <a href="#faq" className="hover:text-[#8B6F47] transition-colors">FAQs</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDashboard}
            className="hidden sm:inline-flex text-[11px] tracking-wider font-semibold uppercase text-[#8B6F47] hover:text-[#2B1E17] px-3 py-2 cursor-pointer transition-colors"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onOpenStudio('wedding')}
            className="text-[11px] tracking-widest font-bold uppercase text-white bg-[#2B1E17] hover:bg-[#8B6F47] px-5 py-2.5 rounded-sm transition-all duration-300 active:scale-95 cursor-pointer shadow-sm"
          >
            Open Studio
          </button>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative z-10 px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-6xl mx-auto text-center">
          {/* Giant decorative ampersand watermark */}
          <span 
            aria-hidden="true" 
            className="pointer-events-none select-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 font-serif font-extralight text-[#8B6F47]/[0.05] leading-none text-[20rem] sm:text-[28rem] md:text-[36rem] z-0"
          >
            &
          </span>

          <div className="relative z-10 mx-auto max-w-4xl space-y-6">
            <div className="flex items-center justify-center gap-4 text-[10px] md:text-[11px] text-[#8B6F47] tracking-[0.3em] uppercase font-semibold">
              <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#C5A880]" />
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                <Film className="w-3.5 h-3.5 text-[#C5A880]" />
                Interactive Invitation Websites
              </span>
              <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#C5A880]" />
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-[4.5rem] font-extralight tracking-tight leading-[1.05] text-[#2B1E17]">
              Not a Card.<br />
              <span className="font-normal text-[#8B6F47]">A Cinematic Invitation.</span>
            </h1>

            <div className="flex items-center justify-center gap-3 text-[#C5A880]">
              <span className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#C5A880]/60" />
              <span className="rotate-45 inline-block w-1.5 h-1.5 border border-[#C5A880]" />
              <span className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#C5A880]/60" />
            </div>

            <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Send an invitation your guests have never seen before. It opens like a film, plays your music, tells your story, and gathers RSVPs in real time — completely free, forever.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                type="button"
                onClick={() => onOpenStudio('wedding')}
                className="group w-full sm:w-auto flex items-center justify-center gap-2.5 text-xs tracking-[0.2em] font-bold uppercase text-white bg-[#2B1E17] hover:bg-[#8B6F47] px-8 py-4 rounded-sm transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-[0_4px_20px_rgba(43,30,23,0.2)]"
              >
                <span>Create Your Invitation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#sandbox"
                className="w-full sm:w-auto text-xs tracking-[0.2em] font-bold uppercase text-[#8B6F47] border border-[#C5A880] hover:bg-[#FAF5ED] px-8 py-4 rounded-sm transition-all duration-300"
              >
                Try Scratch Reveal
              </a>
            </div>

            {/* Value checklist */}
            <div className="pt-4 text-[10px] tracking-[0.2em] text-neutral-500 uppercase font-medium flex flex-wrap justify-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8B6F47]" /> 100% Free Creation
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8B6F47]" /> Unlimited Guests
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8B6F47]" /> Offline HTML Export
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#8B6F47]" /> Zero Subscriptions
              </span>
            </div>
          </div>

          {/* INFINITE MARQUEE OCCASIONS TICKER */}
          <div className="relative z-10 mt-16 md:mt-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="animate-marquee-slow font-serif text-2xl md:text-3xl font-extralight text-[#2B1E17]/70">
              <span className="flex items-center gap-10 whitespace-nowrap">
                Weddings <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Engagements <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Birthdays <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Housewarmings <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                House Parties <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Anniversaries <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Baby Showers <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Annaprashans <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Holy Communions <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
              </span>
              <span className="flex items-center gap-10 whitespace-nowrap ml-10">
                Weddings <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Engagements <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Birthdays <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Housewarmings <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                House Parties <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Anniversaries <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Baby Showers <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Annaprashans <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
                Holy Communions <span className="rotate-45 inline-block w-1.5 h-1.5 bg-[#C5A880]/70" />
              </span>
            </div>
          </div>
        </section>

        {/* METRICS BAR */}
        <div className="relative z-10 border-y border-[#eae3d2]/60 bg-white/50 py-10">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 text-center">
            <div>
              <p className="font-serif text-3xl md:text-4xl font-light text-[#2B1E17]">100% Free</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-semibold mt-1">
                Zero Fees & No Watermarks
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl md:text-4xl font-light text-[#2B1E17]">16 Palettes</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-semibold mt-1">
                Signature Designer Themes
              </p>
            </div>
            <div>
              <p className="font-serif text-3xl md:text-4xl font-light text-[#2B1E17]">Unlimited</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-semibold mt-1">
                Guests, RSVPs & Views
              </p>
            </div>
          </div>
        </div>

        {/* OCCASIONS COLLECTION GRID */}
        <section id="collections" className="relative z-10 py-20 md:py-28 max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-lg mx-auto space-y-3">
            <span className="text-[11px] tracking-[0.25em] text-[#8B6F47] uppercase font-semibold">
              Our Collections
            </span>
            <h2 className="font-serif text-3xl md:text-[2.6rem] font-light text-[#2B1E17] leading-snug">
              Pick Your Occasion
            </h2>
            <p className="text-neutral-500 text-sm font-light">
              Curated invitation experiences tailored for life's biggest milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OCCASIONS.map((occ) => (
              <div 
                key={occ.id}
                className="group relative overflow-hidden border border-[#E6D5BF] bg-white hover:border-[#C5A880] rounded-2xl p-7 transition-all duration-500 flex flex-col justify-between min-h-[340px] shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FAF5ED]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="p-3 bg-[#FAF5ED] border border-[#E6D5BF] rounded-xl text-[#8B6F47] group-hover:scale-110 transition-transform">
                    {occ.id === 'wedding' && <Heart className="w-5 h-5" />}
                    {occ.id === 'engagement' && <Sparkles className="w-5 h-5" />}
                    {occ.id === 'birthday' && <Gift className="w-5 h-5" />}
                    {occ.id === 'housewarming' && <Home className="w-5 h-5" />}
                    {occ.id === 'house-party' && <PartyPopper className="w-5 h-5" />}
                    {occ.id === 'baby-shower' && <Baby className="w-5 h-5" />}
                    {occ.id === 'annaprashan' && <Utensils className="w-5 h-5" />}
                    {occ.id === 'holy-communion' && <Church className="w-5 h-5" />}
                  </div>
                  <span className="text-[9px] tracking-widest uppercase font-bold text-[#8B6F47] border border-[#E6D5BF] bg-[#FAF5ED] px-3 py-1 rounded-full">
                    {occ.tag}
                  </span>
                </div>

                <div className="relative z-10 space-y-3 mt-6">
                  <h3 className="font-serif text-2xl font-light text-[#2B1E17] group-hover:text-[#8B6F47] transition-colors">
                    {occ.title}
                  </h3>
                  <p className="text-neutral-500 text-xs font-light leading-relaxed">
                    {occ.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenStudio(occ.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase text-[#8B6F47] group-hover:translate-x-1.5 transition-transform pt-2 cursor-pointer"
                  >
                    <span>Design this invite</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE SANDBOX DEMO */}
        <section id="sandbox" className="py-20 px-6 bg-[#FAF5ED]/50 border-y border-[#E6D5BF]/60">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47]">Interactive Demo</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2B1E17]">Experience the Gold Foil Scratch</h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-light max-w-md mx-auto">
                Test the real reveal animation right here. Use your finger or cursor to scrub off the foil and hear the ambient acoustic sound.
              </p>
              
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setSandboxMode('date')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    sandboxMode === 'date' 
                      ? 'bg-[#8B6F47] text-white shadow-sm' 
                      : 'bg-white text-stone-600 border border-stone-200'
                  }`}
                >
                  Scratch The Date
                </button>
                <button
                  type="button"
                  onClick={() => setSandboxMode('card')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    sandboxMode === 'card' 
                      ? 'bg-[#8B6F47] text-white shadow-sm' 
                      : 'bg-white text-stone-600 border border-stone-200'
                  }`}
                >
                  Scratch The Card
                </button>
              </div>
            </div>

            <div className="py-4">
              {sandboxMode === 'date' ? (
                <ScratchDate date="14th February 2027" day="Sunday" city="Udaipur, Rajasthan" names="Shanaya & Aarav" />
              ) : (
                <ScratchCard initials="A & S" names="Shanaya & Aarav" />
              )}
            </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS */}
        <section id="features" className="py-20 md:py-28 max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-lg mx-auto space-y-3">
            <span className="text-[11px] tracking-[0.25em] text-[#8B6F47] uppercase font-semibold">Every Detail, Elevated</span>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#2B1E17]">Crafted for Unforgettable Impressions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-center text-[#8B6F47]">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-light text-stone-900">Cinematic Story Parallax</h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                Told like a film with your curated photography, chapter years, and gold foil accents as guests scroll.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-center text-[#8B6F47]">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-light text-stone-900">Ambient Soundtrack Engine</h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                Built-in soothing ambient synthesizers (piano, palace strings, acoustic) or upload your own song.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-center text-[#8B6F47]">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-light text-stone-900">Private Host Dashboard</h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                Live attendance counters, catering dietary summaries, DJ song requests, and 1-click CSV spreadsheet export.
              </p>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section id="comparison" className="py-20 px-6 bg-white border-y border-[#E6D5BF]/60">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47]">Value Comparison</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2B1E17]">Paper Cards vs Paid Services vs Wishlys Free</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Feature</th>
                    <th className="py-3 px-4">Printed Paper Cards</th>
                    <th className="py-3 px-4">Wishlys Paid</th>
                    <th className="py-3 px-4 text-[#8B6F47]">Wishlys Free</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-4 px-4 font-semibold text-stone-800">Cost</td>
                    <td className="py-4 px-4 text-stone-500">₹15,000 – ₹50,000+</td>
                    <td className="py-4 px-4 text-stone-500">₹1,899 – ₹3,999</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">₹0 (100% Free)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-stone-800">Guest Views Cap</td>
                    <td className="py-4 px-4 text-stone-500">Limited to printed batch</td>
                    <td className="py-4 px-4 text-stone-500">Unlimited</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-stone-800">Live RSVP Collection</td>
                    <td className="py-4 px-4 text-stone-500">Manual phone calling</td>
                    <td className="py-4 px-4 text-stone-500">Yes</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">Yes + CSV Export</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-stone-800">Offline Single-File HTML</td>
                    <td className="py-4 px-4 text-stone-500">No</td>
                    <td className="py-4 px-4 text-stone-500">No (Host locked)</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">Yes (Zero dependencies)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-semibold text-stone-800">Expiration / Recurring Fees</td>
                    <td className="py-4 px-4 text-stone-500">One-time print</td>
                    <td className="py-4 px-4 text-stone-500">Expires 7 days post-event</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">Never Expires</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section id="faq" className="py-20 md:py-28 max-w-3xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47]">Curious Minds</span>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#2B1E17]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-stone-50 transition-colors"
                >
                  <span className="font-serif text-lg font-light text-[#2B1E17]">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#8B6F47] transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-stone-600 font-light leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-20 px-6 bg-[#2B1E17] text-[#FDFBF7] text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif text-4xl sm:text-5xl font-light">
              Your Guests Deserve More Than a Group Text
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
              Design your personalized cinematic invitation website in less than 5 minutes. No signup or credit card required.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => onOpenStudio('wedding')}
                className="px-8 py-4 bg-[#8B6F47] hover:bg-[#A88B70] text-white text-xs font-bold tracking-[0.2em] uppercase rounded-sm transition-all shadow-lg cursor-pointer active:scale-95"
              >
                Open Studio Now (100% Free)
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-[#E6D5BF] text-center space-y-4 text-xs text-stone-500 font-light">
        <p className="font-serif text-xl font-light text-[#2B1E17]">Wishlys Free</p>
        <p className="text-[10px] tracking-widest uppercase text-stone-400">
          An open-source recreation of Wishlys. Free for personal & celebration use.
        </p>
        <div className="flex justify-center gap-6 text-[11px] text-stone-600 font-medium">
          <a href="#collections" className="hover:text-[#8B6F47]">Occasions</a>
          <a href="#features" className="hover:text-[#8B6F47]">Features</a>
          <a href="#comparison" className="hover:text-[#8B6F47]">Why Free</a>
          <button type="button" onClick={onOpenDashboard} className="hover:text-[#8B6F47] cursor-pointer">Host Dashboard</button>
        </div>
      </footer>
    </div>
  );
}
