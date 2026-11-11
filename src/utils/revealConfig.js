// Shared reveal metadata, normalization & CSS keyframes/transitions
// Used uniformly by React (InvitationExperience + UniversalReveals) and Standalone HTML export.

export const REVEAL_ALIASES = {
  'block-date': 'scratch-date',
  'drag': 'seal',
};

export const SUPPORTED_REVEAL_IDS = [
  'letter',
  'envelope',
  'tap',
  'meet',
  'match',
  'scratch',
  'seal',
  'video',
  'incoming-call',
  'bismillah',
  'foil-card',
  'scratch-date',
  'quick-delivery',
  'shaadi-story',
  'tying-knot',
  'lotus-bloom',
  'lamps-palace',
  'into-garden',
  'wedding-scroll',
  'lovebird-post',
  'ballroom-lights',
  'hall-mirrors',
  'horn-ok',
  'ik-onkar',
  'gurdwara',
  'room-key',
  'bioscope',
  'folding-doors',
  'ringbox',
  'doorbell',
];

export const REVEAL_META = {
  'letter': { eyebrow: 'Hand-Delivered Note', cta: 'Slide Letter Out ↑', done: 'Letter Pulled Out', hint: 'Pull the note upward or tap to reveal' },
  'envelope': { eyebrow: 'Four-Flap Keepsake', cta: 'Unfold Envelope', done: 'Envelope Unfolded', hint: 'Tap to open all four envelope folds' },
  'tap': { eyebrow: 'Heritage Threshold', cta: 'Swing Open Doors', done: 'Doors Opened', hint: 'Tap the carved timber doors to enter' },
  'meet': { eyebrow: 'Two Paths, One Heart', cta: 'Bring Together', done: 'United Forever', hint: 'Tap to unite both keepsake medallions' },
  'match': { eyebrow: 'Destined Connection', cta: 'Swipe Right ♥', done: "It's a Forever Match!", hint: 'Drag card right or tap ♥ to accept' },
  'scratch': { eyebrow: 'Gold Foil Monogram', cta: 'Scratch Foil', done: 'Monogram Revealed', hint: 'Rub the gold foil to unveil details' },
  'seal': { eyebrow: 'Sealed With Royalty', cta: 'Break Wax Seal', done: 'Seal Broken', hint: 'Tap or drag the crimson wax crest' },
  'video': { eyebrow: 'Feature Premiere', cta: 'Play Premiere ▶', done: 'Now Premiering', hint: 'Tap to roll the celebration reel' },
  'incoming-call': { eyebrow: 'Live Audio Invite', cta: 'Answer Call 📞', done: 'Call Connected', hint: 'Tap or slide green button to answer' },
  'bismillah': { eyebrow: 'In the Name of the Most Merciful', cta: 'Trace in Gold Ink', done: 'Blessed Beginning', hint: 'Tap to trace & illuminate gold ink' },
  'foil-card': { eyebrow: 'Stamped Linen Letterpress', cta: 'Reveal Gold Foil', done: 'Foil Revealed', hint: 'Move cursor or tap for foil gleam' },
  'scratch-date': { eyebrow: 'Save the Auspicious Date', cta: 'Scratch Date', done: 'Date Revealed', hint: 'Rub gold card to unveil the wedding date' },
  'quick-delivery': { eyebrow: 'Shaadi Express Courier', cta: 'Open Package 📦', done: 'Parcel Delivered!', hint: 'Tap to unbox your express invitation' },
  'shaadi-story': { eyebrow: 'Close Friends Exclusive', cta: 'Watch Story ▶', done: 'Story Watched', hint: 'Tap profile ring to view celebration story' },
  'tying-knot': { eyebrow: 'Sacred Gathbandhan', cta: 'Tie the Knot', done: 'Knot Tied Forever', hint: 'Tap to draw both silk sashes into a knot' },
  'lotus-bloom': { eyebrow: 'Sacred Pichwai Lotus', cta: 'Bloom Petals 🌸', done: 'Lotus in Full Bloom', hint: 'Tap bud to unfurl concentric lotus petals' },
  'lamps-palace': { eyebrow: 'Roshni of the Palace', cta: 'Light Palace Lamps 🪔', done: 'Palace Illuminated', hint: 'Tap to ignite all ceremonial palace diyas' },
  'into-garden': { eyebrow: 'Secret Conservatory Gate', cta: 'Enter the Garden', done: 'Garden Gates Open', hint: 'Tap wrought-iron gate amidst blooms' },
  'wedding-scroll': { eyebrow: 'Royal Heirloom Farman', cta: 'Unroll Scroll', done: 'Scroll Unfurled', hint: 'Untie gold tassel & unroll decree' },
  'lovebird-post': { eyebrow: 'Airmail from the Heart', cta: 'Open Lovebird Post', done: 'Post Delivered', hint: 'Tap as lovebirds bring your invitation post' },
  'ballroom-lights': { eyebrow: 'Grand Chandelier Gala', cta: 'Illuminate Ballroom ✨', done: 'Chandelier Lit', hint: 'Tap dimmer switch to wake the crystals' },
  'hall-mirrors': { eyebrow: 'Sheesh Mahal Reflections', cta: 'Part the Mirrors', done: 'Reflections Unveiled', hint: 'Tap faceted mirrors to part the hall' },
  'horn-ok': { eyebrow: 'Highway to Forever', cta: 'Honk for Shaadi 🎺', done: 'PEEP PEEP! Baraat Ready!', hint: 'Press brass horn bulb for celebration blast' },
  'ik-onkar': { eyebrow: 'ੴ Sacred Grace', cta: 'Receive Blessings', done: 'Satnam Waheguru · Blessed', hint: 'Tap golden emblem to radiate blessings' },
  'gurdwara': { eyebrow: 'Anand Karaj Threshold', cta: 'Enter Darbar', done: 'Sacred Gates Open', hint: 'Tap golden arches for Anand Karaj entry' },
  'room-key': { eyebrow: 'Seaside Resort Check-In', cta: 'Tap Suite Keycard', done: '✓ Suite Checked In!', hint: 'Tap wooden VIP card on sensor pad' },
  'bioscope': { eyebrow: 'Vintage Carnival Reel', cta: 'Turn Brass Crank', done: 'Bioscope Playing', hint: 'Crank the wheel to peek inside the booth' },
  'folding-doors': { eyebrow: 'Cordially Invited', cta: 'Tap to Open Doors', done: 'Doors Opened', hint: 'Tap folding doors or heart crest' },
  'ringbox': { eyebrow: 'The Moment She Said Yes', cta: 'Open Velvet Box', done: 'Rings Revealed', hint: 'Tap gold clasp to lift velvet lid' },
  'doorbell': { eyebrow: 'Warmest Welcome', cta: 'Ring Brass Bell', done: 'Welcome Inside!', hint: 'Tap glowing bell to ring & enter' },
};

export function normalizeRevealId(revealStyle, _templateId = 'caricature') {
  if (!revealStyle) return 'folding-doors';
  const mapped = REVEAL_ALIASES[revealStyle] || revealStyle;
  return REVEAL_META[mapped] ? mapped : 'folding-doors';
}

export function splitMonogram(initials = '', bride = 'Preeti', groom = 'Ashish') {
  const clean = String(initials || '').trim();
  if (clean && clean !== 'B & G') {
    const parts = clean.split(/&|\+/).map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) return [parts[0][0].toUpperCase(), parts[1][0].toUpperCase()];
  }
  const b = (String(bride || 'P').trim()[0] || 'P').toUpperCase();
  const g = (String(groom || 'A').trim()[0] || 'A').toUpperCase();
  return [b, g];
}

export function getRevealCopy(revealId, ctx = {}) {
  const id = normalizeRevealId(revealId, ctx.templateId);
  const meta = REVEAL_META[id] || REVEAL_META['folding-doors'];
  return { id, ...meta };
}

export const REVEAL_SHARED_CSS = `
  @keyframes revShimmerSweep {
    0% { transform: translateX(-140%) skewX(-20deg); opacity: 0; }
    35% { opacity: 0.75; }
    100% { transform: translateX(220%) skewX(-20deg); opacity: 0; }
  }
  @keyframes revFlameFlicker {
    0%, 100% { transform: scaleY(1) scaleX(1); filter: drop-shadow(0 0 8px rgba(251,191,36,0.9)); }
    50% { transform: scaleY(1.18) scaleX(0.92); filter: drop-shadow(0 0 14px rgba(249,115,22,1)); }
  }
  @keyframes revRippleExpand {
    0% { transform: scale(0.75); opacity: 0.85; }
    100% { transform: scale(2.1); opacity: 0; }
  }
  @keyframes revEqPulse {
    0%, 100% { height: 6px; }
    50% { height: 22px; }
  }
  @keyframes revStoryProgress {
    0% { width: 0%; }
    100% { width: 100%; }
  }
  @keyframes revPetalBurst {
    0% { opacity: 0; transform: translate(0, 0) scale(0.4) rotate(0deg); }
    40% { opacity: 1; }
    100% { opacity: 0; transform: translate(var(--tx, 40px), var(--ty, -60px)) scale(1.1) rotate(140deg); }
  }
  .rev-shimmer { animation: revShimmerSweep 2.4s ease-in-out infinite; }
  .rev-flame { animation: revFlameFlicker 0.9s ease-in-out infinite; transform-origin: bottom center; }
  .rev-ripple { animation: revRippleExpand 1.3s ease-out infinite; }
  .rev-eq-1 { animation: revEqPulse 0.7s ease-in-out infinite; }
  .rev-eq-2 { animation: revEqPulse 0.55s ease-in-out 0.15s infinite; }
  .rev-eq-3 { animation: revEqPulse 0.8s ease-in-out 0.25s infinite; }

  /* Interactive Reveal Activation Classes (shared by React & Standalone HTML) */
  .uni-rev-box .uni-flap-top { transform-origin: top center; transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1); }
  .uni-rev-box .uni-flap-bottom { transform-origin: bottom center; transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.08s; }
  .uni-rev-box .uni-flap-left { transform-origin: left center; transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.14s; }
  .uni-rev-box .uni-flap-right { transform-origin: right center; transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s; }
  .uni-rev-box.is-open .uni-flap-top { transform: rotateX(165deg); opacity: 0.15; }
  .uni-rev-box.is-open .uni-flap-bottom { transform: rotateX(-165deg); opacity: 0.15; }
  .uni-rev-box.is-open .uni-flap-left { transform: rotateY(-165deg); opacity: 0.15; }
  .uni-rev-box.is-open .uni-flap-right { transform: rotateY(165deg); opacity: 0.15; }

  .uni-rev-box .uni-door-l { transform-origin: left center; transition: transform 0.8s cubic-bezier(0.22,1,0.36,1); }
  .uni-rev-box .uni-door-r { transform-origin: right center; transition: transform 0.8s cubic-bezier(0.22,1,0.36,1); }
  .uni-rev-box.is-open .uni-door-l { transform: perspective(900px) rotateY(-118deg); }
  .uni-rev-box.is-open .uni-door-r { transform: perspective(900px) rotateY(118deg); }

  .uni-rev-box .uni-slide-l { transition: transform 0.75s cubic-bezier(0.22,1,0.36,1); }
  .uni-rev-box .uni-slide-r { transition: transform 0.75s cubic-bezier(0.22,1,0.36,1); }
  .uni-rev-box.is-open .uni-slide-l { transform: translateX(-82%); }
  .uni-rev-box.is-open .uni-slide-r { transform: translateX(82%); }

  .uni-rev-box .uni-meet-l { transition: transform 0.75s cubic-bezier(0.34,1.56,0.64,1); }
  .uni-rev-box .uni-meet-r { transition: transform 0.75s cubic-bezier(0.34,1.56,0.64,1); }
  .uni-rev-box.is-open .uni-meet-l { transform: translateX(34px); }
  .uni-rev-box.is-open .uni-meet-r { transform: translateX(-34px); }

  .uni-rev-box .uni-letter-sheet { transition: transform 0.75s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease; }
  .uni-rev-box.is-open .uni-letter-sheet { transform: translateY(-76px) scale(1.03); }

  .uni-rev-box .uni-scroll-body { max-height: 44px; transition: max-height 0.85s cubic-bezier(0.22,1,0.36,1), padding 0.6s ease; overflow: hidden; }
  .uni-rev-box.is-open .uni-scroll-body { max-height: 220px; }

  .uni-rev-box .uni-lotus-outer { transition: transform 0.8s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s ease; transform-origin: center; }
  .uni-rev-box .uni-lotus-inner { transition: transform 0.75s cubic-bezier(0.34,1.56,0.64,1) 0.1s; transform-origin: center; }
  .uni-rev-box.is-open .uni-lotus-outer { transform: scale(1.28) rotate(24deg); opacity: 0.9; }
  .uni-rev-box.is-open .uni-lotus-inner { transform: scale(1.18) rotate(-18deg); }

  .uni-rev-box .uni-keycard { transition: transform 0.75s cubic-bezier(0.22,1,0.36,1); }
  .uni-rev-box.is-open .uni-keycard { transform: translateX(84px) rotate(4deg); }

  .uni-rev-box .uni-crank { transition: transform 0.85s cubic-bezier(0.34,1.56,0.64,1); transform-origin: center; }
  .uni-rev-box.is-open .uni-crank { transform: rotate(360deg); }

  .uni-rev-box .uni-wax-seal { transition: transform 0.5s ease, opacity 0.45s ease; }
  .uni-rev-box.is-open .uni-wax-seal { transform: scale(1.4) rotate(-18deg); opacity: 0; pointer-events: none; }

  .uni-rev-box .uni-box-lid { transition: transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease; transform-origin: top center; }
  .uni-rev-box.is-open .uni-box-lid { transform: translateY(-48px) rotateX(65deg) scale(0.9); opacity: 0; }

  .uni-rev-box .uni-chandelier { transition: transform 0.65s ease, filter 0.65s ease, opacity 0.5s ease; }
  .uni-rev-box.is-open .uni-chandelier { transform: scale(1.25); filter: drop-shadow(0 0 22px rgba(255,215,0,0.95)); opacity: 1 !important; }
  .uni-rev-box .uni-diya { transition: transform 0.5s cubic-bezier(0.34,1.56,0.64,1), filter 0.5s ease; }
  .uni-rev-box.is-open .uni-diya { transform: translateY(-4px) scale(1.22); filter: drop-shadow(0 0 14px rgba(251,191,36,0.95)); }
  .uni-rev-box .uni-horn-btn { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), background-color 0.35s ease; }
  .uni-rev-box.is-open .uni-horn-btn { transform: scale(1.06); background-color: #FEF08A !important; }
`;
