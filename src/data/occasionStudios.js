// Dedicated Studio Data, Presets, Themes, Reveals & Starter Profiles for the 7 Non-Wedding Studios
// Modeled cleanly for Paigaam Studio while keeping Wedding Studio locked and isolated.

export const NON_WEDDING_OCCASION_IDS = [
  'engagement',
  'birthday',
  'housewarming',
  'house-party',
  'baby-shower',
  'annaprashan',
  'holy-communion',
];

export const OCCASION_PALETTES = [
  { id: 'ivory', name: 'Ivory', tag: 'Warm Classic', bg: '#FDFBF5', surface: '#FFFFFF', text: '#2B1E17', muted: '#7A6855', accent: '#C5A880', dark: false },
  { id: 'champagne', name: 'Champagne', tag: 'Luxury Gold', bg: '#F5EFE4', surface: '#FBF7F0', text: '#3E2B1F', muted: '#7E6550', accent: '#B08968', dark: false },
  { id: 'obsidian', name: 'Obsidian', tag: 'Midnight Noir', bg: '#0A0908', surface: '#171412', text: '#F4ECDE', muted: '#C2B5A4', accent: '#C5A880', dark: true },
  { id: 'emerald', name: 'Emerald Noir', tag: 'Forest Green', bg: '#0A1410', surface: '#12221B', text: '#F4ECDE', muted: '#A9BDB3', accent: '#D4AF37', dark: true },
  { id: 'sapphire', name: 'Royal Sapphire', tag: 'Royal Navy', bg: '#070B14', surface: '#101829', text: '#F4ECDE', muted: '#A5B4CE', accent: '#D4AF37', dark: true },
  { id: 'ruby', name: 'Ruby Velvet', tag: 'Deep Crimson', bg: '#1A0707', surface: '#290D0D', text: '#F4ECDE', muted: '#C9A4A4', accent: '#D4AF37', dark: true },
  { id: 'blush', name: 'Pearl Blush', tag: 'Soft Rose', bg: '#FAF5F5', surface: '#FFFFFF', text: '#3D2B2B', muted: '#85696E', accent: '#B5838D', dark: false },
  { id: 'amethyst', name: 'Midnight Amethyst', tag: 'Royal Purple', bg: '#10081A', surface: '#1D102E', text: '#F4ECDE', muted: '#BAA9CC', accent: '#D4AF37', dark: true },
  { id: 'sage', name: 'Olive Sage', tag: 'Olive Garden', bg: '#F4F6F0', surface: '#FFFFFF', text: '#2B3322', muted: '#606D54', accent: '#8B9D77', dark: false },
  { id: 'terracotta', name: 'Desert Rose', tag: 'Desert Sand', bg: '#FAF6F2', surface: '#FFFFFF', text: '#4D2D23', muted: '#8C655B', accent: '#E07A5F', dark: false },
  { id: 'plum', name: 'Plum Velvet', tag: 'Plum Velvet', bg: '#14070E', surface: '#230E1A', text: '#F4ECDE', muted: '#C6A3B4', accent: '#C5A880', dark: true },
  { id: 'dustyblue', name: 'Dusty Blue', tag: 'Slate Sky', bg: '#F0F4F8', surface: '#FFFFFF', text: '#202D3C', muted: '#5D7087', accent: '#7D93AC', dark: false },
  { id: 'rosegold', name: 'Rose Gold', tag: 'Blush Metal', bg: '#FBF3F0', surface: '#FFFFFF', text: '#3D2328', muted: '#8C686E', accent: '#B76E79', dark: false },
  { id: 'diamond', name: 'Diamond', tag: 'Icy Platinum', bg: '#F4F7FA', surface: '#FFFFFF', text: '#1E2833', muted: '#647384', accent: '#7D93AC', dark: false },
  { id: 'velvet', name: 'Wine Velvet', tag: 'Deep Wine', bg: '#1A0710', surface: '#2A0E1B', text: '#F6E9E4', muted: '#CCAAB2', accent: '#E3A7A1', dark: true },
  { id: 'wisteria', name: 'Wisteria Dream', tag: 'Pastel Floral', bg: '#FBF9FD', surface: '#FFFFFF', text: '#3D2E5E', muted: '#7A6B99', accent: '#8E7CC3', dark: false },
];

export const ENGAGEMENT_TEMPLATES = [
  { id: 'depth-of-field', name: 'Depth of Field', badge: 'Luxe', desc: 'Your own photos full screen, edge to edge, each opening out of the page as guests scroll.', bg: '#181412', accent: '#E6C88A', dark: true },
  { id: 'darkroom', name: 'Darkroom', badge: 'Luxe', desc: 'Your own photos developing from black & white into colour as guests scroll like a fine-art catalogue.', bg: '#121212', accent: '#D8D8D8', dark: true },
  { id: 'royal-emerald', name: 'Royal Emerald & Antique Gold', badge: 'Luxe', desc: 'Illustrated in a candlelit hall of emerald velvet, antique brass and crystal chandeliers.', bg: '#0A1C15', accent: '#D4AF37', dark: true },
  { id: 'sage-blossom', name: 'Sage & Ivory Blossom', badge: 'Luxe', desc: 'Handmade paper-cut diorama in a quiet garden of ivory bougainvillea and sage.', bg: '#F2F5EE', accent: '#6B8261', dark: false },
  { id: 'pastel-romance', name: 'Pastel Garden Romance', badge: 'Luxe', desc: 'Golden-hour garden pavilion of ombré chiffon drapes and clouds of baby’s breath.', bg: '#FCF5F7', accent: '#C88EA7', dark: false },
  { id: 'bougainvillea-fiesta', name: 'Bougainvillea Fiesta', badge: 'Luxe', desc: 'Sunset mandap overflowing with magenta bougainvillea and marigold garlands.', bg: '#FFF7F2', accent: '#D63E6C', dark: false },
  { id: 'boho-garden', name: 'Boho Garden', badge: 'Luxe', desc: 'Sunny boho garden under a flower-draped wooden A-frame arch.', bg: '#FAF5EC', accent: '#C47D53', dark: false },
  { id: 'golden-rooftop', name: 'Golden Hour Rooftop', badge: 'Luxe', desc: 'City rooftop at sunset under warm festoon string lights and a neon ring sign.', bg: '#211524', accent: '#F6B85C', dark: true },
  { id: 'solitaire', name: 'Solitaire', badge: 'Premium', desc: 'Minimal diamond solitaire drawn in luminous gold light.', bg: '#FBF3F0', accent: '#B76E79', dark: false },
  { id: 'rose-orbit', name: 'Rose Orbit', badge: 'Premium', desc: 'Two engraved bands orbiting with fine serif calligraphy.', bg: '#FDF7F7', accent: '#B56E7C', dark: false },
  { id: 'sagai', name: 'Sagai', badge: 'Premium', desc: 'Traditional Indian ring ceremony with auspicious lotus & thaal motifs.', bg: '#FFF8ED', accent: '#B85D19', dark: false },
  { id: 'we-said-yes', name: 'We Said Yes', badge: 'Premium', desc: 'Hand-drawn celebration doodles & Polaroid portrait frames.', bg: '#FAF8F5', accent: '#C87A5B', dark: false },
  { id: 'cinematic', name: 'Cinematic', badge: 'Premium', desc: 'Full-bleed photos told as an immersive scrolling parallax story.', bg: '#16110E', accent: '#E3C27A', dark: true },
  { id: 'storybook', name: 'Storybook', badge: 'Premium', desc: 'Charming watercolor illustrations crafted for each chapter of your journey.', bg: '#FAF3E8', accent: '#A66E4E', dark: false },
  { id: 'royal', name: 'Royal', badge: 'Classic', desc: 'Royal textures, palatial arches, and heritage gold borders.', bg: '#FBF6EE', accent: '#9E7334', dark: false },
  { id: 'editorial', name: 'Editorial', badge: 'Modern', desc: 'Clean layouts, bold typefaces, and minimalist gallery framing.', bg: '#FFFFFF', accent: '#1F1A17', dark: false },
  { id: 'classic', name: 'Classic', badge: 'Timeless', desc: 'Symmetrical elegance, hairline borders, and timeless typography.', bg: '#FDFBF7', accent: '#8B6F47', dark: false },
  { id: 'boarding-pass', name: 'Boarding Pass', badge: 'Premium', desc: 'Cinematic travel pass with perforated ticket stub, barcode & destination gate.', bg: '#F4F7FA', accent: '#1E3A5F', dark: false },
  { id: 'botanical', name: 'Botanical', badge: 'Floral', desc: 'Delicate watercolor olive branches, eucalyptus vines & garden florals.', bg: '#F5F8F4', accent: '#5A7656', dark: false },
];

export const ENGAGEMENT_REVEALS = [
  { id: 'ringbox', name: 'Ring Box', subtitle: 'Lid lifts, ring rises' },
  { id: 'two-rings', name: 'Two Rings', subtitle: 'Bands interlock' },
  { id: 'will-you-join', name: 'Will You Join Us?', subtitle: 'Guests tap Yes' },
  { id: 'champagne', name: 'Champagne', subtitle: 'Pop the cork' },
  { id: 'sagai-thaal', name: 'Sagai Thaal', subtitle: 'Lift the chunri' },
  { id: 'letter', name: 'Letter', subtitle: 'Pull-out card' },
  { id: 'envelope', name: 'Envelope', subtitle: 'Four-flap folds' },
  { id: 'scratch', name: 'Scratch', subtitle: 'Gold foil reveal' },
  { id: 'seal', name: 'Drag Seal', subtitle: 'Break wax seal' },
  { id: 'incoming-call', name: 'Incoming Call', subtitle: 'Slide to answer' },
  { id: 'block-date', name: 'Block The Date', subtitle: 'Calendar invite' },
  { id: 'play-button', name: 'Play Button', subtitle: 'Frosted video gate' },
  { id: 'none', name: 'None', subtitle: 'Opens straight away' },
];

export const BIRTHDAY_STARTING_STYLES = [
  {
    id: 'kids',
    badge: 'CHILDREN',
    title: 'Kids Party',
    desc: 'Bubblegum colours, floating balloons and a pop-to-open reveal.',
    layout: 'playful',
    colorTheme: 'confetti-pop',
    revealStyle: 'pop-balloons',
    balloonStyle: 'mixed',
    nameFont: 'Bagel Fat One',
    sectionFont: 'Fredoka',
  },
  {
    id: 'teen',
    badge: 'TEENS & YOUNG ADULTS',
    title: 'Girl / Teen',
    desc: 'Neon-night glow, photo-forward and an unwrap-the-gift reveal.',
    layout: 'cinematic',
    colorTheme: 'neon-night',
    revealStyle: 'unwrap-gift',
    balloonStyle: 'hearts',
    nameFont: 'Orbitron',
    sectionFont: 'Montserrat',
  },
  {
    id: 'milestone',
    badge: 'ADULTS & ELDERS',
    title: 'Milestone',
    desc: 'Warm gold fiesta with an elegant blow-out-the-candles reveal.',
    layout: 'magazine',
    colorTheme: 'gold-fiesta',
    revealStyle: 'blow-candles',
    balloonStyle: 'round',
    nameFont: 'Montserrat',
    sectionFont: 'Plus Jakarta Sans',
  },
];

export const BIRTHDAY_LAYOUTS = [
  { id: 'playful', name: 'Playful', desc: 'Bouncy cards & floating balloons' },
  { id: 'cinematic', name: 'Cinematic', desc: 'Full-bleed parallax photos' },
  { id: 'magazine', name: 'Magazine', desc: 'Bold editorial spread' },
  { id: 'elegant', name: 'Elegant', desc: 'Minimal timeline, no cards' },
  { id: 'jungle-safari', name: 'Jungle Safari', badge: 'Premium', desc: 'Immersive tropical safari scene' },
  { id: 'dino-world', name: 'Dino World', badge: 'Premium', desc: 'Prehistoric dinosaur scene' },
  { id: 'outer-space', name: 'Outer Space', badge: 'Premium', desc: 'Cosmic starfield & rocket scene' },
];

export const BIRTHDAY_COLOR_THEMES = [
  { id: 'pink-hearts', name: 'Pink Hearts', bg: '#FFF2F6', surface: '#FFFFFF', text: '#4A152C', accent: '#EC4899', secondary: '#FBCFE8', dark: false },
  { id: 'blue-confetti', name: 'Blue Confetti', bg: '#EFF8FF', surface: '#FFFFFF', text: '#102A43', accent: '#2563EB', secondary: '#93C5FD', dark: false },
  { id: 'black-gold', name: 'Black & Gold', bg: '#0D0B09', surface: '#181410', text: '#FAF3E3', accent: '#D4AF37', secondary: '#EAB308', dark: true },
  { id: 'gold-pearl', name: 'Gold & Pearl', bg: '#FDFBF5', surface: '#FFFFFF', text: '#2D2218', accent: '#C8A055', secondary: '#E5D3B3', dark: false },
  { id: 'rose-gold-white', name: 'Rose Gold & White', bg: '#FFF7F6', surface: '#FFFFFF', text: '#402227', accent: '#C4757F', secondary: '#F3D2D6', dark: false },
  { id: 'pink-silver', name: 'Pink & Silver', bg: '#FDF4FA', surface: '#FFFFFF', text: '#3F1B36', accent: '#DB2777', secondary: '#CBD5E1', dark: false },
  { id: 'blue-silver', name: 'Blue & Silver', bg: '#F2F6FA', surface: '#FFFFFF', text: '#182B49', accent: '#1D4ED8', secondary: '#CBD5E1', dark: false },
  { id: 'red-gold', name: 'Red & Gold', bg: '#FFF5F5', surface: '#FFFFFF', text: '#5B1111', accent: '#DC2626', secondary: '#D97706', dark: false },
  { id: 'purple-silver', name: 'Purple & Silver', bg: '#F7F3FF', surface: '#FFFFFF', text: '#2E1065', accent: '#7C3AED', secondary: '#CBD5E1', dark: false },
  { id: 'confetti-pop', name: 'Confetti Pop', bg: '#FFFDF7', surface: '#FFFFFF', text: '#241B35', accent: '#F43F5E', secondary: '#3B82F6', dark: false },
  { id: 'bubblegum', name: 'Bubblegum', bg: '#FFE8F3', surface: '#FFF9FC', text: '#581134', accent: '#F43F5E', secondary: '#38BDF8', dark: false },
  { id: 'tropical', name: 'Tropical', bg: '#F0FDF9', surface: '#FFFFFF', text: '#0F3D2E', accent: '#059669', secondary: '#F59E0B', dark: false },
  { id: 'sunshine', name: 'Sunshine', bg: '#FFFBEB', surface: '#FFFFFF', text: '#452A06', accent: '#F59E0B', secondary: '#FB7185', dark: false },
  { id: 'neon-night', name: 'Neon Night', bg: '#0B0A1A', surface: '#151332', text: '#F8FAFC', accent: '#EC4899', secondary: '#22D3EE', dark: true },
  { id: 'gold-fiesta', name: 'Gold Fiesta', bg: '#1D120C', surface: '#2A1A11', text: '#FDF4E3', accent: '#EAB308', secondary: '#FB923C', dark: true },
];

export const BIRTHDAY_REVEALS = [
  { id: 'pop-balloons', name: 'Pop Balloons', subtitle: 'Tap balloons to burst confetti' },
  { id: 'unwrap-gift', name: 'Unwrap Gift', subtitle: 'Untie ribbon & open gift box' },
  { id: 'blow-candles', name: 'Blow Candles', subtitle: 'Make a wish & blow the flame' },
  { id: 'inflate-balloon', name: 'Inflate Balloon', subtitle: 'Pump balloon to pop open' },
  { id: 'scratch', name: 'Scratch', subtitle: 'Scratch foil to reveal age' },
  { id: 'seal', name: 'Drag Seal', subtitle: 'Break celebratory wax seal' },
  { id: 'tap', name: 'Tap Door', subtitle: 'Tap party door to enter' },
  { id: 'envelope', name: 'Envelope', subtitle: 'Four-flap party envelope' },
  { id: 'letter', name: 'Letter', subtitle: 'Pull-out note card' },
  { id: 'play-button', name: 'Play Button', subtitle: 'Frosted video invite gate' },
  { id: 'none', name: 'None', subtitle: 'Show invitation immediately' },
];

export const BIRTHDAY_BALLOON_STYLES = [
  { id: 'hearts', name: 'Hearts' },
  { id: 'round', name: 'Round' },
  { id: 'confetti', name: 'Confetti' },
  { id: 'mixed', name: 'Mixed' },
];

export const BIRTHDAY_FONTS = [
  { id: 'Inflate', label: 'Inflate', family: '"Fredoka", "Montserrat", sans-serif' },
  { id: 'Balloons', label: 'Balloons', family: '"Bubblegum Sans", "Plus Jakarta Sans", cursive' },
  { id: 'Bagel', label: 'Bagel', family: '"Bagel Fat One", "Fredoka", sans-serif' },
  { id: 'Bubblegum', label: 'Bubblegum', family: '"Bubblegum Sans", cursive' },
  { id: 'Chewy', label: 'Chewy', family: '"Chewy", cursive' },
  { id: 'Bunting', label: 'Bunting', family: '"Amatic SC", "Plus Jakarta Sans", cursive' },
  { id: 'Alphawood', label: 'Alphawood', family: '"Montserrat", sans-serif' },
  { id: 'Driftwood', label: 'Driftwood', family: '"Pacifico", cursive' },
  { id: 'Natoor', label: 'Natoor', family: '"Plus Jakarta Sans", sans-serif' },
  { id: 'Wild Wood', label: 'Wild Wood', family: '"Cinzel", serif' },
  { id: 'Orbitron', label: 'Orbitron', family: '"Orbitron", "Montserrat", sans-serif' },
];

export const HOUSEWARMING_THEMES = [
  { id: 'griha-pravesh', name: 'Griha Pravesh', desc: 'Marigold toran, diyas and rangoli in saffron and gold', bg: '#FFF7EA', surface: '#FFFFFF', text: '#3B1E10', accent: '#C86416', secondary: '#8E1B22', dark: false },
  { id: 'modern-apartment', name: 'Modern Apartment', desc: 'City skyline, lights coming on, crisp and minimal', bg: '#F6F3EE', surface: '#FFFFFF', text: '#1C1D22', accent: '#C59B5F', secondary: '#1E293B', dark: false },
  { id: 'cozy-home', name: 'Cozy Home', desc: 'Cottage, chimney smoke, plants and fairy lights', bg: '#FBF4EE', surface: '#FFFFFF', text: '#2D241E', accent: '#A8563A', secondary: '#4A6B53', dark: false },
  { id: 'blueprint', name: 'Blueprint', desc: 'An architect’s drawing that sketches your home as you scroll', bg: '#0E2849', surface: '#13355F', text: '#F0F6FF', accent: '#7DD3FC', secondary: '#BAE6FD', dark: true },
];

export const HOUSEWARMING_REVEALS = [
  { id: 'front-door', name: 'Front Door', subtitle: 'Ring the bell and the door swings open' },
  { id: 'lift', name: 'Lift', subtitle: 'Ride up to your floor, then the doors slide open' },
  { id: 'key-in-lock', name: 'Key in Lock', subtitle: 'Guests turn the key to unlock your home' },
  { id: 'ribbon-cutting', name: 'Ribbon Cutting', subtitle: 'Snip the ribbon for a grand entry' },
  { id: 'play-button', name: 'Play Button', subtitle: 'Frosted video invite gate with tap' },
  { id: 'none', name: 'None', subtitle: 'Show invitation straight away' },
];

export const HOUSE_PARTY_THEMES = [
  { id: 'balloons-confetti', name: 'Balloons & Confetti', desc: 'Bright balloons and confetti for any get-together, from a birthday dinner to a reunion', bg: '#F6EEFA', surface: '#FFFFFF', text: '#2B1B42', accent: '#E11D48', secondary: '#6366F1', dark: false },
  { id: 'ivory-gold', name: 'Ivory & Gold', desc: 'Classic ivory card with gold deco borders for dinners, anniversaries & grown-up gatherings', bg: '#FAF6ED', surface: '#FFFFFF', text: '#2B2016', accent: '#B89246', secondary: '#D6B87A', dark: false },
  { id: 'diwali-night', name: 'Diwali Night', desc: 'Glowing diyas, sky lanterns, rangoli and fireworks over a midnight-blue sky', bg: '#100E2A', surface: '#1A173F', text: '#FFF7E5', accent: '#F59E0B', secondary: '#F472B6', dark: true },
  { id: 'christmas-party', name: 'Christmas Party', desc: 'Twinkling tree, gifts, holly and gently falling snow', bg: '#0E261B', surface: '#153627', text: '#FFF8F0', accent: '#E11D48', secondary: '#FACC15', dark: true },
  { id: 'new-years-eve', name: "New Year's Eve", desc: 'Black and gold, champagne, glitter and midnight countdown', bg: '#09090B', surface: '#16161B', text: '#FAF5E8', accent: '#D4AF37', secondary: '#FDE68A', dark: true },
  { id: 'disco-night', name: 'Disco Night', desc: 'Spinning mirror ball, sweeping lights and neon for cocktails & dancing', bg: '#130726', surface: '#1E0D3B', text: '#F8FAFC', accent: '#EC4899', secondary: '#38BDF8', dark: true },
  { id: 'game-night', name: 'Game Night', desc: 'Dice, playing cards and board-game colours for an evening of games', bg: '#132A23', surface: '#1B3B31', text: '#FEFCE8', accent: '#FACC15', secondary: '#EF4444', dark: true },
  { id: 'terrace-lights', name: 'Terrace Lights', desc: 'Sunset over the city skyline with warm string lights & stars', bg: '#1B142E', surface: '#281F42', text: '#FFF7ED', accent: '#F59E0B', secondary: '#FB7185', dark: true },
  { id: 'garden-brunch', name: 'Garden Brunch', desc: 'Pastel bunting, daisies and gingham for daytime brunches & lunches', bg: '#F7FAF2', surface: '#FFFFFF', text: '#243B29', accent: '#65A30D', secondary: '#F472B6', dark: false },
  { id: 'movie-night', name: 'Movie Night', desc: 'Velvet cinema curtains, marquee lights and popcorn at home', bg: '#21090E', surface: '#330F17', text: '#FEF9C3', accent: '#FACC15', secondary: '#EF4444', dark: true },
  { id: 'pool-party', name: 'Pool Party', desc: 'Sparkling turquoise water, floats and palm shade in the sun', bg: '#E6F9FD', surface: '#FFFFFF', text: '#0B3B49', accent: '#0284C7', secondary: '#FB7185', dark: false },
  { id: 'eid-mubarak', name: 'Eid Mubarak', desc: 'Crescent moon, glowing fanoos lanterns and emerald & gold jaali patterns', bg: '#0A2218', surface: '#103224', text: '#FEF8E8', accent: '#D4AF37', secondary: '#34D399', dark: true },
  { id: 'festive', name: 'Festive', desc: 'Marigold toran, diyas and rangoli for Diwali & festive nights', bg: '#FFF7EA', surface: '#FFFFFF', text: '#3B1E10', accent: '#D97706', secondary: '#991B1B', dark: false },
  { id: 'modern-apartment', name: 'Modern Apartment', desc: 'City skyline, warm windows & crisp minimalism', bg: '#F6F3EE', surface: '#FFFFFF', text: '#1C1D22', accent: '#C59B5F', secondary: '#334155', dark: false },
  { id: 'cozy-home', name: 'Cozy Home', desc: 'Cottage warmth, indoor plants and golden fairy lights', bg: '#FBF4EE', surface: '#FFFFFF', text: '#2D241E', accent: '#A8563A', secondary: '#4A6B53', dark: false },
  { id: 'blueprint', name: 'Blueprint', desc: 'Architectural linework sketch on classic cyan blueprint paper', bg: '#0E2849', surface: '#13355F', text: '#F0F6FF', accent: '#7DD3FC', secondary: '#BAE6FD', dark: true },
];

export const HOUSE_PARTY_REVEALS = [
  { id: 'pop-balloon', name: 'Pop the Balloon', subtitle: 'Balloon bursts into confetti shower' },
  { id: 'envelope', name: 'Open the Envelope', subtitle: 'Break gold seal & slide card out' },
  { id: 'light-phuljhadi', name: 'Light the Phuljhadi', subtitle: 'Sparkler writes in golden sparks' },
  { id: 'shake-snowglobe', name: 'Shake the Snow Globe', subtitle: 'Snow swirls around cozy house' },
  { id: 'midnight-countdown', name: 'Midnight Countdown', subtitle: 'Countdown ticks & cork pops' },
  { id: 'drop-needle', name: 'Drop the Needle', subtitle: 'Vinyl record spins & mirror ball drops' },
  { id: 'roll-dice', name: 'Roll the Dice', subtitle: 'Dice tumble across table to double six' },
  { id: 'lights-on', name: 'Lights On', subtitle: 'Fairy lights switch on bulb by bulb' },
  { id: 'party-popper', name: 'Party Popper', subtitle: 'Pull string & burst streamers' },
  { id: 'tear-ticket', name: 'Tear the Ticket', subtitle: 'Tear ticket stub & part velvet curtains' },
  { id: 'make-splash', name: 'Make a Splash', subtitle: 'Beach ball dives with a pool splash' },
  { id: 'moon-sighting', name: 'Moon Sighting', subtitle: 'Part clouds to reveal crescent & lanterns' },
  { id: 'lights-out-surprise', name: 'Lights Out, Surprise!', subtitle: 'Flip switch to shout Surprise!' },
  { id: 'front-door', name: 'Front Door', subtitle: 'Ring bell & swing open home doors' },
  { id: 'lift', name: 'Lift', subtitle: 'Elevator rides up to your floor' },
  { id: 'key-in-lock', name: 'Key in Lock', subtitle: 'Turn key to unlock front door' },
  { id: 'ribbon-cutting', name: 'Ribbon Cutting', subtitle: 'Snip ceremonial entry ribbon' },
  { id: 'play-button', name: 'Play Button', subtitle: 'Frosted video gate with music' },
  { id: 'none', name: 'None', subtitle: 'Opens straight away' },
];

export const BABY_THEMES = [
  { id: 'oh-baby', name: 'Oh Baby', desc: 'Pastel balloons drifting on a candy-floss sky', bg: '#FDF4F8', surface: '#FFFFFF', text: '#3F2737', accent: '#E07AA4', secondary: '#8CC5E3', dark: false },
  { id: 'twinkle-star', name: 'Twinkle Little Star', desc: 'A moon swing, drifting clouds and stars in navy and gold', bg: '#0D182E', surface: '#162444', text: '#F8F4EA', accent: '#F4C95D', secondary: '#93C5FD', dark: true },
  { id: 'boho-rainbow', name: 'Boho Rainbow', desc: 'Hand-drawn rainbow arches, pampas and sun in earthy tones', bg: '#FAF3EB', surface: '#FFFFFF', text: '#4C3325', accent: '#C97B5A', secondary: '#D9A97E', dark: false },
  { id: 'woodland-friends', name: 'Woodland Friends', badge: 'Premium', desc: 'A bunny, fox and bear peek out between the leaves', bg: '#F2F6EE', surface: '#FFFFFF', text: '#283A28', accent: '#5D8256', secondary: '#C47D4E', dark: false },
  { id: 'godh-bharai', name: 'Godh Bharai', badge: 'Premium', desc: 'Marigolds, glass bangles, diyas and a kalash in haldi and maroon', bg: '#FFF7E8', surface: '#FFFFFF', text: '#4B1D1A', accent: '#D97706', secondary: '#9F1239', dark: false },
];

export const BABY_SHOWER_OPENINGS = [
  { id: 'stork', name: 'Stork Delivery', subtitle: 'A stork flies in and hands guests the bundle' },
  { id: 'balloon-gift', name: 'Balloon Gift', subtitle: 'Guests untie the bow and balloons lift the lid' },
  { id: 'crib-mobile', name: 'Crib Mobile', subtitle: 'Wind the music box and night turns to morning' },
  { id: 'bangle-curtain', name: 'Bangle Curtain', subtitle: 'Glass bangles chime apart, Godh Bharai style' },
  { id: 'baby-blocks', name: 'Baby Blocks', subtitle: '“OH BABY” blocks tumble to reveal the invite' },
  { id: 'parents-to-be', name: 'Parents-To-Be', subtitle: 'Couple lean in as baby’s heartbeat glows' },
  { id: 'size-of-mango', name: 'Size of a Mango', subtitle: 'Counts the weeks as baby grows from rajma to nariyal' },
  { id: 'play-button', name: 'Play Button', subtitle: 'Frosted invite with tap-to-play button' },
  { id: 'none', name: 'None', subtitle: 'Show invitation straight away' },
];

export const ANNAPRASHAN_OPENINGS = [
  { id: 'pick-future', name: 'Pick the Future', subtitle: 'Guests tap what the little one picks from the tray' },
  { id: 'first-bite', name: 'First Bite', subtitle: 'Guests feed the little one a first spoon of kheer' },
  { id: 'balloon-gift', name: 'Balloon Gift', subtitle: 'Guests untie the bow and balloons lift the lid' },
  { id: 'crib-mobile', name: 'Crib Mobile', subtitle: 'Wind the music box and night turns to morning' },
  { id: 'baby-blocks', name: 'Baby Blocks', subtitle: 'Wooden blocks tumble to reveal the invite' },
  { id: 'play-button', name: 'Play Button', subtitle: 'Frosted invite with tap-to-play button' },
  { id: 'none', name: 'None', subtitle: 'Show invitation straight away' },
];

export const HOLY_COMMUNION_SACRAMENTS = [
  {
    id: 'communion',
    name: 'First Holy Communion',
    desc: 'A chalice and host, for the child’s first Communion',
    badgeLabel: "YOU'RE INVITED TO A FIRST HOLY COMMUNION",
    verse: 'John 6:35 — "I am the bread of life. Whoever comes to me will never go hungry."',
    headerBlessing: 'In the name of the Father, and of the Son, and of the Holy Spirit',
    defaultSlug: 'aanya-first-communion',
    event1: 'Holy Mass',
  },
  {
    id: 'baptism',
    name: 'Holy Baptism',
    desc: 'A shell and water, for a Baptism or Christening',
    badgeLabel: "YOU'RE INVITED TO A HOLY BAPTISM",
    verse: 'Mark 10:14 — "Let the little children come to me, for the kingdom of God belongs to such as these."',
    headerBlessing: 'Blessed by Grace · Water & The Spirit',
    defaultSlug: 'aanya-holy-baptism',
    event1: 'Sacrament of Baptism',
  },
  {
    id: 'confirmation',
    name: 'Confirmation',
    desc: 'A dove and flame of the Holy Spirit',
    badgeLabel: "YOU'RE INVITED TO A CONFIRMATION SERVICE",
    verse: 'Acts 1:8 — "You will receive power when the Holy Spirit comes on you."',
    headerBlessing: 'Sealed with the Gift of the Holy Spirit',
    defaultSlug: 'aanya-confirmation',
    event1: 'Confirmation Mass',
  },
];

export const HOLY_COMMUNION_OPENINGS = [
  { id: 'church-doors', name: 'Church Doors', subtitle: 'The bell rings and arched oak doors swing open into light' },
  { id: 'stained-glass', name: 'Stained Glass', subtitle: 'Sunlight sweeps across a rose window, pane by pane' },
  { id: 'candle', name: 'The Candle', subtitle: 'Guests light the altar candle and its glow fills the screen' },
  { id: 'dove', name: 'Dove', subtitle: 'A white dove glides in and lets the card unfold' },
  { id: 'seal', name: 'Wax Seal', subtitle: 'Guests break the gold-cream seal and the card slides out' },
  { id: 'play-button', name: 'Play Button', subtitle: 'Frosted glass video play gate' },
  { id: 'none', name: 'None', subtitle: 'Invitation shows straight away' },
];

export const HOLY_COMMUNION_THEMES = [
  { id: 'white-gold', name: 'White & Gold', desc: 'Ivory, gold foil and an arched frame, classic and calm', bg: '#FDFBF7', surface: '#FFFFFF', text: '#2B2216', accent: '#C8A055', secondary: '#E5D3A7', dark: false },
  { id: 'stained-glass', name: 'Stained Glass', badge: 'Premium', desc: 'Jewel-toned cathedral glass and light rays in a quiet sanctuary', bg: '#101629', surface: '#18213D', text: '#FAF7EE', accent: '#F4C95D', secondary: '#38BDF8', dark: true },
  { id: 'lilies-doves', name: 'Lilies & Doves', desc: 'Watercolour lilies and doves in soft sage and white', bg: '#F4F7F3', surface: '#FFFFFF', text: '#243528', accent: '#6B8E6E', secondary: '#C5A880', dark: false },
  { id: 'heavenly-skies', name: 'Heavenly Skies', desc: 'Soft blue sky, clouds and sunbeams, lovely for a Baptism', bg: '#EFF7FD', surface: '#FFFFFF', text: '#1C3147', accent: '#3B82F6', secondary: '#FACC15', dark: false },
  { id: 'rosary-lace', name: 'Rosary & Lace', badge: 'Premium', desc: 'Blush lace, pearls and a rosary draped above the names', bg: '#FDF6F8', surface: '#FFFFFF', text: '#3F232C', accent: '#C88EA7', secondary: '#D4AF37', dark: false },
];

export const OCCASION_MUSIC_TRACKS = {
  engagement: [
    { id: 'eternal-love', name: 'Eternal Love', mood: 'Romantic · Wedding', url: './audio/eternal-love.mp3' },
    { id: 'modern-muse', name: 'Modern Muse', mood: 'Modern · Uplifting', url: './audio/indian-inspirational-modern.mp3' },
    { id: 'piano-promise', name: 'Piano Promise', mood: 'Piano · Romantic', url: './audio/piano-promise.mp3' },
    { id: 'romantic-vows', name: 'Romantic Vows', mood: 'Soft · Strings', url: './audio/romantic-vows.mp3' },
    { id: 'saffron-light', name: 'Saffron Light', mood: 'Flute · Serene', url: './audio/saffron-light.mp3' },
    { id: 'bollywood-nights', name: 'Bollywood Nights', mood: 'Dance · Upbeat', url: './audio/bollywood-nights.mp3' },
    { id: 'unfolding-the-invitation', name: 'Unfolding the Invitation', mood: 'Harp · Gentle', url: './audio/unfolding-the-invitation.mp3' },
  ],
  birthday: [
    { id: 'birthday-bash', name: 'Birthday Bash', mood: 'Birthday · Upbeat · Joyful', url: 'https://static.wishlys.com/audio/birthday-bash.mp3', fallbackUrl: './audio/festival-lights.mp3' },
    { id: 'birthday-cheers', name: 'Birthday Cheers', mood: 'Birthday · Festive', url: 'https://static.wishlys.com/audio/birthday-cheers.mp3', fallbackUrl: './audio/bollywood-nights.mp3' },
    { id: 'birthday-fiesta', name: 'Birthday Fiesta', mood: 'Birthday · Dance', url: 'https://static.wishlys.com/audio/birthday-fiesta.mp3', fallbackUrl: './audio/dhol-dance-floor.mp3' },
    { id: 'birthday-twinkle', name: 'Birthday Twinkle', mood: 'Soft · Sweet', url: 'https://static.wishlys.com/audio/birthday-twinkle.mp3', fallbackUrl: './audio/piano-promise.mp3' },
    { id: 'festival-lights', name: 'Festival Lights', mood: 'Festive · Upbeat', url: './audio/festival-lights.mp3' },
    { id: 'dhol-dance-floor', name: 'Dhol on the Dance Floor', mood: 'Bhangra · Dance', url: './audio/dhol-dance-floor.mp3' },
    { id: 'modern-muse', name: 'Sunny Afternoon', mood: 'Acoustic · Breezy', url: './audio/indian-inspirational-modern.mp3' },
  ],
  housewarming: [
    { id: 'diwali-glow', name: 'Diwali Glow', mood: 'Festive · Traditional · Devotional', url: 'https://static.wishlys.com/audio/diwali-glow.mp3', fallbackUrl: './audio/marigold-morning.mp3' },
    { id: 'krishnas-flute', name: "Krishna's Flute", mood: 'Devotional · Serene', url: 'https://static.wishlys.com/audio/krishnas-flute.mp3', fallbackUrl: './audio/saffron-light.mp3' },
    { id: 'morning-promise', name: 'Morning Promise', mood: 'Soft · Piano', url: './audio/morning-promise.mp3' },
    { id: 'sitar-sunrise', name: 'Sitar Sunrise', mood: 'Traditional · Serene', url: './audio/sitar-sunrise.mp3' },
    { id: 'marigold-morning', name: 'Marigold Morning', mood: 'Festive · Auspicious', url: './audio/marigold-morning.mp3' },
    { id: 'modern-muse', name: 'Modern Muse', mood: 'Uplifting · Instrumental', url: './audio/indian-inspirational-modern.mp3' },
  ],
  'house-party': [
    { id: 'living-room-groove', name: 'Living Room Groove', mood: 'Upbeat · Dance · Instrumental', url: 'https://static.wishlys.com/audio/living-room-groove.mp3', fallbackUrl: './audio/bollywood-nights.mp3' },
    { id: 'retro-disco-night', name: 'Retro Disco Night', mood: 'Disco · Dance', url: 'https://static.wishlys.com/audio/retro-disco-night.mp3', fallbackUrl: './audio/festival-lights.mp3' },
    { id: 'dhol-dance-floor', name: 'Dhol on the Dance Floor', mood: 'Bhangra · Dance', url: './audio/dhol-dance-floor.mp3' },
    { id: 'bollywood-nights', name: 'Bollywood Nights', mood: 'Bollywood · Dance', url: './audio/bollywood-nights.mp3' },
    { id: 'moonlit-garden', name: 'Terrace Sundown', mood: 'Chill · Lounge', url: './audio/moonlit-garden.mp3' },
    { id: 'diwali-glow', name: 'Diwali Glow', mood: 'Festive · Traditional', url: './audio/marigold-morning.mp3' },
  ],
  'baby-shower': [
    { id: 'tender-keys', name: 'Tender Keys', mood: 'Piano · Soft · Serene', url: 'https://static.wishlys.com/audio/tender-keys.mp3', fallbackUrl: './audio/piano-promise.mp3' },
    { id: 'little-lamb', name: 'Little Lamb', mood: 'Lullaby · Soft', url: 'https://static.wishlys.com/audio/little-lamb.mp3', fallbackUrl: './audio/morning-promise.mp3' },
    { id: 'morning-promise', name: 'Morning Promise', mood: 'Soft · Piano', url: './audio/morning-promise.mp3' },
    { id: 'piano-promise', name: 'Piano Reverie', mood: 'Piano · Serene', url: './audio/piano-promise.mp3' },
    { id: 'saffron-light', name: 'Krishna’s Flute', mood: 'Bansuri · Gentle', url: './audio/saffron-light.mp3' },
  ],
  annaprashan: [
    { id: 'tender-keys', name: 'Tender Keys', mood: 'Piano · Soft · Serene', url: 'https://static.wishlys.com/audio/tender-keys.mp3', fallbackUrl: './audio/piano-promise.mp3' },
    { id: 'saffron-light', name: "Krishna's Flute", mood: 'Devotional · Serene', url: './audio/saffron-light.mp3' },
    { id: 'marigold-morning', name: 'Marigold Morning', mood: 'Auspicious · Traditional', url: './audio/marigold-morning.mp3' },
    { id: 'little-lamb', name: 'Little Lamb', mood: 'Lullaby · Soft', url: './audio/morning-promise.mp3' },
    { id: 'mangala-isai', name: 'Mangala Isai', mood: 'Sacred · Auspicious', url: './audio/mangala-isai.mp3' },
  ],
  'holy-communion': [
    { id: 'sacred-morning', name: 'Sacred Morning', mood: 'Hymn · Serene · Devotional', url: 'https://static.wishlys.com/audio/sacred-morning.mp3', fallbackUrl: './audio/morning-promise.mp3' },
    { id: 'chapel-bells', name: 'Chapel Bells', mood: 'Hymn · Joyful', url: 'https://static.wishlys.com/audio/chapel-bells.mp3', fallbackUrl: './audio/unfolding-the-invitation.mp3' },
    { id: 'luminous-prayer', name: 'Luminous Prayer', mood: 'Hymn · Piano · Serene', url: './audio/piano-promise.mp3' },
    { id: 'morning-promise', name: 'Grace Notes', mood: 'Soft · Uplifting', url: './audio/morning-promise.mp3' },
    { id: 'romantic-vows', name: 'Celebration Hymn', mood: 'Strings · Uplifting', url: './audio/romantic-vows.mp3' },
  ],
};

export function createOccasionClientTemplate(occasionId, subVariant = '') {
  if (occasionId === 'engagement') {
    return {
      occasion: 'engagement',
      customSlug: 'aarav-and-shanaya-engagement',
      template: 'solitaire',
      revealStyle: 'ringbox',
      palette: 'rosegold',
      effect: 'confetti',
      soundEffects: true,
      music: 'eternal-love',
      customMusicUrl: '',
      showMonogram: true,
      monogram: { initials: 'A & S' },
      typography: { headingFont: 'Cormorant Garamond', bodyFont: 'Plus Jakarta Sans', scriptFont: 'Great Vibes' },
      hosts: {
        title: '|| Shree Ganeshaya Namah ||',
        bride: 'Shanaya',
        groom: 'Aarav',
        partner1Initial: 'A',
        partner2Initial: 'S',
        groomParents: 'S/o Mr. Ramesh & Mrs. Sunita Sharma',
        brideParents: 'D/o Mr. Vijay & Mrs. Rekha Malhotra',
        partner1Profession: '',
        partner2Profession: '',
        date: '2026-12-27',
        city: 'Udaipur, Rajasthan',
        venue: 'The Leela Palace, Udaipur, Rajasthan',
        hashtag: '#AaravKiShanaya',
        instagram: '@aarav_shanaya',
        welcomeQuote: "A chance meeting at a friend's dinner turned into long walks, longer phone calls and a question asked on a rooftop at sunset. She said yes, and now we can't wait to celebrate with you.",
        revealEyebrow: "WE SAID YES · SAVE THE DATE",
        revealSubtitle: 'Tap the velvet box to unveil the rings',
      },
      logistics: { hotel: 'The Leela Palace Suites & Taj Lakeview', transport: 'Shuttle pickups from Maharana Pratap Airport', contact: '+91 98200 11223' },
      rsvpConfig: { enabled: true, deadline: 'Kindly RSVP by 10th December 2026', askDietary: true, allowKids: true },
      events: [
        { id: 'sagai', name: 'Ring Ceremony (Sagai)', date: 'Sunday, 27th December 2026', time: '05:30 PM onwards', venue: 'The Leela Palace Lawns', address: 'Lake Pichola, Udaipur, Rajasthan', dressCode: 'Pastels, Lehengas & Bandhgalas' },
        { id: 'cocktail', name: 'Cocktail & Dinner', date: 'Sunday, 27th December 2026', time: '08:30 PM onwards', venue: 'Sheesh Mahal Courtyard', address: 'Lake Pichola, Udaipur, Rajasthan', dressCode: 'Black Tie & Evening Glam' },
      ],
      photos: { cover: './images/couple-udaipur-haveli.webp' },
      gallery: [
        { url: './images/couple-udaipur-boat.webp', caption: 'Golden hour by the lake' },
        { url: './images/couple-udaipur-hilltop.webp', caption: 'Where she said yes' },
        { url: './images/couple-udaipur-ghat.webp', caption: 'Quiet walks at dusk' },
        { url: './images/couple-udaipur-rooftop.webp', caption: 'Counting down to forever' },
      ],
    };
  }

  if (occasionId === 'birthday') {
    const preset = BIRTHDAY_STARTING_STYLES.find(s => s.id === subVariant) || BIRTHDAY_STARTING_STYLES[0];
    const isTeen = preset.id === 'teen';
    const isMilestone = preset.id === 'milestone';
    return {
      occasion: 'birthday',
      birthdayStyle: preset.id,
      customSlug: isTeen ? 'ananya-sweet-16' : isMilestone ? 'rajesh-50th-milestone' : 'aarav-birthday',
      template: preset.layout,
      revealStyle: preset.revealStyle,
      palette: preset.colorTheme,
      balloonStyle: preset.balloonStyle,
      nameFont: preset.nameFont,
      sectionFont: preset.sectionFont,
      effect: 'confetti',
      soundEffects: true,
      music: isTeen ? 'bollywood-nights' : 'birthday-bash',
      customMusicUrl: '',
      hosts: {
        title: isTeen ? 'Neon Nights & Good Vibes' : isMilestone ? 'Cheers to Fifty Golden Years' : 'Hip Hip Hooray!',
        bride: isTeen ? 'Ananya' : isMilestone ? 'Rajesh' : 'Aarav',
        groom: isMilestone ? 'The Kapoor Family' : 'The Sharma Family',
        ageBadge: isTeen ? 'Sweet 16!' : isMilestone ? 'Turning 50!' : 'Turning 6!',
        hostedBy: isMilestone ? 'Hosted with warmth by Meera, Kabir & Rhea' : 'Hosted by the Sharma family',
        date: '2027-01-01',
        city: 'Bandra, Mumbai',
        venue: isTeen ? 'Skyline Rooftop Lounge, Bandra' : isMilestone ? 'The Taj Lands End Ballroom, Mumbai' : 'FunZone Play Cafe, Bandra, Mumbai',
        dressCode: isTeen ? 'Neon Accents & Party Chic' : isMilestone ? 'Gold & Emerald Evening Wear' : 'Girls: Comfy & colourful · Boys: Comfy & colourful',
        welcomeQuote: isTeen
          ? 'Turn up the music, strike a pose under the neon lights, and celebrate sixteen unforgettable years together.'
          : isMilestone
            ? 'Fifty years of kindness, friendships, and stories worth toasting — come raise a glass to a golden milestone.'
            : 'Our little superstar is turning SIX! Come for an afternoon of cake, games and giggles.',
        revealEyebrow: isMilestone ? 'A GOLDEN MILESTONE' : 'MAKE A WISH',
        revealSubtitle: isTeen ? 'Untie the ribbon & unwrap the invitation' : isMilestone ? 'Blow out the candles to reveal the evening' : 'Pop the balloons to join the party!',
      },
      rsvpConfig: { enabled: true, deadline: 'Kindly RSVP 5 days before the party', askDietary: false, allowKids: true },
      events: isTeen
        ? [
            { id: 'b1', name: 'Red Carpet & Polaroids', date: 'Friday, 1st January 2027', time: '07:00 PM', venue: 'Skyline Lounge', address: '16th Road, Bandra West, Mumbai' },
            { id: 'b2', name: 'Cake Smash & DJ Floor', date: 'Friday, 1st January 2027', time: '08:30 PM', venue: 'Skyline Lounge', address: '16th Road, Bandra West, Mumbai' },
          ]
        : isMilestone
          ? [
              { id: 'b1', name: 'Cocktails & Acoustic Live', date: 'Friday, 1st January 2027', time: '07:30 PM', venue: 'Taj Lands End', address: 'Bandstand Promenade, Mumbai' },
              { id: 'b2', name: 'Milestone Toast & Dinner', date: 'Friday, 1st January 2027', time: '09:00 PM', venue: 'Salcette Ballroom', address: 'Bandstand Promenade, Mumbai' },
            ]
          : [
              { id: 'b1', name: 'Welcome & Games', date: 'Friday, 1st January 2027', time: '04:00 PM', venue: 'FunZone Play Cafe', address: 'Hill Road, Bandra West, Mumbai' },
              { id: 'b2', name: 'Magic Show', date: 'Friday, 1st January 2027', time: '05:00 PM', venue: 'Main Stage', address: 'FunZone Play Cafe, Bandra' },
              { id: 'b3', name: 'Cake Cutting', date: 'Friday, 1st January 2027', time: '06:00 PM', venue: 'Cake Carousel', address: 'FunZone Play Cafe, Bandra' },
              { id: 'b4', name: 'Return Gifts & Treats', date: 'Friday, 1st January 2027', time: '06:45 PM', venue: 'Wonder Counter', address: 'FunZone Play Cafe, Bandra' },
            ],
      photos: { cover: './images/couple-landscape-1.webp' },
      gallery: [
        { url: './images/gallery/moment_3.jpg', caption: 'All smiles' },
        { url: './images/gallery/moment_8.jpg', caption: 'Cake time!' },
      ],
    };
  }

  if (occasionId === 'housewarming') {
    return {
      occasion: 'housewarming',
      customSlug: 'sharma-housewarming',
      template: 'griha-pravesh',
      revealStyle: 'front-door',
      palette: 'griha-pravesh',
      effect: 'petals',
      soundEffects: true,
      music: 'diwali-glow',
      customMusicUrl: '',
      hosts: {
        title: '|| Shree Ganeshaya Namah ||',
        householdName: 'The Sharma Family',
        bride: 'Riya',
        groom: 'Arjun',
        flatNo: '1204',
        floor: '12',
        date: '2026-12-27',
        city: 'Tower B, Lodha Palava',
        venue: 'Flat 1204, Tower B, Lodha Palava',
        welcomeQuote: "After years of dreaming, saving and a hundred house visits, we finally have the keys! Our new home is ready, and it won't truly feel like home until it's filled with the people we love.",
        revealEyebrow: "YOU'RE INVITED HOME",
        revealSubtitle: 'RING THE BELL TO ENTER',
      },
      rsvpConfig: { enabled: true, deadline: 'Kindly confirm your presence', askDietary: true, allowKids: true },
      events: [
        { id: 'hw1', name: 'Griha Pravesh Puja', date: 'Sunday, 27th December 2026', time: '09:30 AM', venue: 'Flat 1204, Tower B', address: 'Lodha Palava, Dombivli East' },
        { id: 'hw2', name: 'Havan & Aarti', date: 'Sunday, 27th December 2026', time: '11:15 AM', venue: 'Living Courtyard', address: 'Flat 1204, Tower B, Lodha Palava' },
        { id: 'hw3', name: 'Festive Lunch', date: 'Sunday, 27th December 2026', time: '01:00 PM', venue: 'Terrace Dining', address: 'Tower B, Lodha Palava' },
      ],
      photos: { cover: '' },
      gallery: [],
    };
  }

  if (occasionId === 'house-party') {
    return {
      occasion: 'house-party',
      customSlug: 'riya-house-party',
      template: 'balloons-confetti',
      revealStyle: 'pop-balloon',
      palette: 'balloons-confetti',
      effect: 'confetti',
      soundEffects: true,
      music: 'living-room-groove',
      customMusicUrl: '',
      hosts: {
        title: "Let's Celebrate",
        householdName: 'Riya & Arjun',
        bride: 'Riya',
        groom: 'Arjun',
        flatNo: '1204',
        floor: '12',
        date: '2026-12-12',
        city: 'Tower B, Lodha Palava',
        venue: 'Flat 1204, Tower B, Lodha Palava',
        menuHighlights: 'Signature Passionfruit Mocktails · Wood-Fired Tapas · Live Acoustic Playlist',
        welcomeQuote: 'Good food, good music and our favourite people under one roof. Come over, stay late and help us make it a night to remember.',
        revealEyebrow: "YOU'RE INVITED OVER",
        revealSubtitle: 'TAP TO POP THE BALLOON',
      },
      rsvpConfig: { enabled: true, deadline: 'Let us know you are coming', askDietary: true, allowKids: false },
      events: [
        { id: 'hp1', name: 'Drinks & Snacks', date: 'Saturday, 12th December 2026', time: '07:00 PM', venue: 'Living Room Bar · 1204', address: 'Tower B, Lodha Palava' },
        { id: 'hp2', name: 'Supper & Midnight Cake', date: 'Saturday, 12th December 2026', time: '09:30 PM', venue: 'Terrace Lounge', address: 'Tower B, Lodha Palava' },
      ],
      photos: { cover: '' },
      gallery: [],
    };
  }

  if (occasionId === 'baby-shower') {
    return {
      occasion: 'baby-shower',
      customSlug: 'priya-baby-shower',
      template: 'oh-baby',
      revealStyle: 'stork',
      palette: 'oh-baby',
      effect: 'confetti',
      soundEffects: true,
      enableGenderPoll: true,
      music: 'tender-keys',
      customMusicUrl: '',
      hosts: {
        title: 'Oh Baby!',
        bride: 'Priya',
        groom: 'Rahul',
        hostedBy: 'Hosted with love by the Mehta family',
        dueDateLine: 'Arriving January 2027',
        date: '2026-12-22',
        city: 'Mumbai',
        venue: 'The Garden Room, Hotel Sahara Star',
        welcomeQuote: "Our family is about to grow by two tiny feet! Before the little one arrives, we'd love to gather the people who matter most to shower Priya with blessings, laughter and love.",
        revealEyebrow: "YOU'RE INVITED TO A BABY SHOWER",
        revealSubtitle: 'TAP TO RECEIVE THE BUNDLE',
      },
      rsvpConfig: { enabled: true, deadline: 'Kindly RSVP by 10th December 2026', askDietary: true, allowKids: true },
      events: [
        { id: 'bs1', name: 'Baby Shower & Blessing Games', date: 'Tuesday, 22nd December 2026', time: '11:30 AM', venue: 'The Garden Room', address: 'Hotel Sahara Star, Vile Parle East, Mumbai' },
        { id: 'bs2', name: 'Celebratory Lunch', date: 'Tuesday, 22nd December 2026', time: '01:30 PM', venue: 'Sapphire Lawn', address: 'Hotel Sahara Star, Mumbai' },
      ],
      photos: { cover: './images/gallery/moment_5.jpg' },
      gallery: [
        { url: './images/gallery/moment_4.jpg', caption: 'Waiting for two tiny feet' },
        { url: './images/gallery/moment_6.jpg', caption: 'So much love already' },
      ],
    };
  }

  if (occasionId === 'annaprashan') {
    return {
      occasion: 'annaprashan',
      customSlug: 'aarav-annaprashan',
      template: 'oh-baby',
      revealStyle: 'pick-future',
      palette: 'oh-baby',
      effect: 'petals',
      soundEffects: true,
      music: 'tender-keys',
      customMusicUrl: '',
      hosts: {
        title: '|| Shree Ganeshaya Namah ||',
        bride: 'Aarav',
        groom: 'The Mehta Family',
        siblingName: '',
        hostedBy: 'Hosted with love by the Mehta family',
        date: '2026-12-12',
        city: 'Mumbai',
        venue: 'The Garden Room, Hotel Sahara Star',
        welcomeQuote: "Our little one is ready for a first taste of rice! We'd love to gather the people who matter most to bless them with love, laughter and a first bite of kheer.",
        revealEyebrow: "YOU'RE INVITED TO AN ANNAPRASHAN",
        revealSubtitle: 'TAP WHAT THE LITTLE ONE WILL PICK',
      },
      rsvpConfig: { enabled: true, deadline: 'Kindly confirm your blessings', askDietary: true, allowKids: true },
      events: [
        { id: 'an1', name: 'Annaprashan Puja & Tray Game', date: 'Saturday, 12th December 2026', time: '11:30 AM', venue: 'The Garden Room', address: 'Hotel Sahara Star, Vile Parle East, Mumbai' },
        { id: 'an2', name: 'Blessing Lunch', date: 'Saturday, 12th December 2026', time: '01:00 PM', venue: 'Lotus Courtyard', address: 'Hotel Sahara Star, Mumbai' },
      ],
      photos: { cover: '' },
      gallery: [],
    };
  }

  // holy-communion
  return {
    occasion: 'holy-communion',
    sacrament: 'communion',
    customSlug: 'aanya-first-communion',
    template: 'white-gold',
    revealStyle: 'church-doors',
    palette: 'white-gold',
    effect: 'stars',
    soundEffects: true,
    music: 'sacred-morning',
    customMusicUrl: '',
    hosts: {
      title: 'In the name of the Father, and of the Son, and of the Holy Spirit',
      bride: 'Aanya',
      groom: "Joseph & Maria D'Souza",
      invitedBy: "Together with their parents, Joseph & Maria D'Souza",
      godparents: 'Godparents: Anthony & Rita Fernandes',
      bibleVerse: 'John 6:35 — "I am the bread of life. Whoever comes to me will never go hungry."',
      date: '2026-12-27',
      city: 'Mahim, Mumbai',
      venue: "St. Michael's Church",
      welcomeQuote: 'Aanya has been preparing for this day with so much joy. We would love our family and friends to be with us at Mass for this first Holy Communion, and to celebrate together afterwards.',
      revealEyebrow: "YOU'RE INVITED TO A FIRST HOLY COMMUNION",
      revealSubtitle: 'TAP TO RING THE BELL',
    },
    rsvpConfig: { enabled: true, deadline: 'Kindly RSVP by 15th December 2026', askDietary: true, allowKids: true },
    events: [
      { id: 'hc1', name: 'Holy Mass', date: 'Sunday, 27th December 2026', time: '09:30 AM', venue: "St. Michael's Church", address: 'L.J. Road, Mahim West, Mumbai' },
      { id: 'hc2', name: 'Lunch Reception', date: 'Sunday, 27th December 2026', time: '12:00 PM', venue: 'Parish Heritage Hall', address: 'Mahim West, Mumbai' },
    ],
    photos: { cover: '' },
    gallery: [],
  };
}
