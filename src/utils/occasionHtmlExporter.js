import { toBase64Optimized } from './imageOptimizer';
import { resolveOccasionVisuals, formatReadableDate } from './occasionVisuals';

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getRevealButtonMeta(revealId, hosts = {}) {
  const map = {
    ringbox: { icon: '💍', badge: '💍', cta: 'Open Ring Box' },
    'two-rings': { icon: '∞', badge: '💍💍', cta: 'Interlock Rings' },
    'will-you-join': { icon: '🥂', badge: '💌', cta: 'Yes, Count Us In!' },
    champagne: { icon: '🍾', badge: '🥂', cta: 'Pop the Champagne' },
    'sagai-thaal': { icon: '✨', badge: '🪷💍', cta: 'Lift the Chunri' },
    'pop-balloons': { icon: '🎈', badge: '🎈🎈🎈', cta: 'Pop Balloons' },
    'pop-balloon': { icon: '🎈', badge: '🎈🎈🎈', cta: 'Pop Balloons' },
    'unwrap-gift': { icon: '🎁', badge: '🎀', cta: 'Unwrap the Gift' },
    'blow-candles': { icon: '🎂', badge: '🕯️🕯️🕯️', cta: 'Make a Wish & Blow' },
    'inflate-balloon': { icon: '🎈', badge: '🎈', cta: 'Pump & Pop Balloon' },
    'front-door': { icon: '🔔', badge: `Door ${hosts.flatNo || '1204'}`, cta: 'Ring the Doorbell' },
    lift: { icon: '🛗', badge: `Floor ${hosts.floor || '12'}`, cta: `Ride Up to Floor ${hosts.floor || '12'}` },
    'key-in-lock': { icon: '🔓', badge: '🔑', cta: 'Turn Key to Unlock' },
    'ribbon-cutting': { icon: '🎀', badge: '✂️', cta: 'Snip Ceremonial Ribbon' },
    'light-phuljhadi': { icon: '✨', badge: '🎆', cta: 'Light the Phuljhadi' },
    'shake-snowglobe': { icon: '❄️', badge: '🎄❄️', cta: 'Shake the Snow Globe' },
    'midnight-countdown': { icon: '🥂', badge: '23:59:58', cta: 'Celebrate Midnight' },
    'drop-needle': { icon: '🪩', badge: '33 RPM', cta: 'Drop the Needle' },
    'roll-dice': { icon: '🎲', badge: '⚄ ⚅', cta: 'Roll Double Six' },
    'lights-on': { icon: '💡', badge: '✨', cta: 'Switch Fairy Lights On' },
    'lights-out-surprise': { icon: '💡', badge: 'SURPRISE!', cta: 'Flip Switch — Surprise!' },
    'party-popper': { icon: '🎊', badge: '🎉', cta: 'Pull Party Popper' },
    'tear-ticket': { icon: '🎟️', badge: 'ADMIT ONE', cta: 'Tear Ticket Stub' },
    'make-splash': { icon: '💦', badge: '🏖️🌊', cta: 'Make a Splash' },
    'moon-sighting': { icon: '🏮', badge: '🌙✨', cta: 'Sight the Crescent Moon' },
    stork: { icon: '👶', badge: '🦢🍼', cta: 'Receive the Bundle' },
    'balloon-gift': { icon: '🎀', badge: '🎈🎁', cta: 'Untie the Bow' },
    'crib-mobile': { icon: '🎵', badge: '🌙⭐☁️', cta: 'Wind the Music Box' },
    'bangle-curtain': { icon: '✨', badge: '⭕⭕⭕', cta: 'Part the Glass Bangles' },
    'baby-blocks': { icon: '🧸', badge: 'O H B A B Y', cta: 'Tumble the Blocks' },
    'parents-to-be': { icon: '💓', badge: '💗', cta: "Listen to Baby's Heartbeat" },
    'size-of-mango': { icon: '🥭', badge: '🥭 Mango', cta: 'Open Baby Shower Invite' },
    'pick-future': { icon: '🪙', badge: '📖 ✒️ 🪙 🏺 🪷', cta: 'Pick from the Tray' },
    'first-bite': { icon: '✨', badge: '🥣🥄', cta: 'Feed First Spoon of Kheer' },
    'church-doors': { icon: '🔔', badge: '⛪', cta: 'Ring Bell & Open Doors' },
    'stained-glass': { icon: '☀️', badge: '✝️', cta: 'Let Sunlight Shine In' },
    candle: { icon: '🕯️', badge: '🕯️', cta: 'Light the Altar Candle' },
    dove: { icon: '🌿', badge: '🕊️', cta: 'Unfold Grace Invitation' },
    scratch: { icon: '🪙', badge: 'Scratch Foil', cta: 'Reveal Invitation' },
    seal: { icon: '✉️', badge: 'WAX SEAL', cta: 'Break Seal & Open' },
    envelope: { icon: '✉️', badge: 'ENVELOPE', cta: 'Open Envelope' },
    letter: { icon: '✉️', badge: 'LETTER', cta: 'Open Letter' },
    'incoming-call': { icon: '📞', badge: 'INCOMING CALL', cta: 'Answer Invitation' },
    'block-date': { icon: '📅', badge: hosts.date || 'SAVE THE DATE', cta: 'Block This Date' },
    'play-button': { icon: '▶', badge: '▶', cta: 'Tap to Play Invite' },
    tap: { icon: '🚪', badge: 'WELCOME', cta: 'Tap to Open Door' },
  };
  return map[revealId] || { icon: '✨', badge: '✨', cta: 'Open Invitation' };
}

function buildFallbackSceneSvg(theme, primaryTitle, flatNo) {
  return `
  <svg viewBox="0 0 600 320" width="100%" height="260" xmlns="http://www.w3.org/2000/svg" style="display:block;background:${escHtml(theme.bg)};">
    <defs>
      <radialGradient id="hg" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stop-color="${escHtml(theme.accent)}" stop-opacity="0.24"/>
        <stop offset="100%" stop-color="${escHtml(theme.bg)}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="600" height="320" fill="${escHtml(theme.bg)}"/>
    <rect width="600" height="320" fill="url(#hg)"/>
    <path d="M90 310 V140 C90 48 510 48 510 140 V310" fill="none" stroke="${escHtml(theme.accent)}" stroke-opacity="0.45" stroke-width="2"/>
    <path d="M115 310 V150 C115 72 485 72 485 150 V310" fill="none" stroke="${escHtml(theme.accent)}" stroke-opacity="0.22" stroke-width="1"/>
    <circle cx="300" cy="146" r="44" fill="${escHtml(theme.surface)}" stroke="${escHtml(theme.accent)}" stroke-width="1.5"/>
    <text x="300" y="153" text-anchor="middle" font-size="22" font-weight="700" fill="${escHtml(theme.accent)}" font-family="Montserrat, sans-serif">${escHtml(flatNo || primaryTitle.slice(0, 2).toUpperCase())}</text>
  </svg>`;
}

export async function buildOccasionStandaloneHtml(rawData, { forPrint = false } = {}) {
  const data = JSON.parse(JSON.stringify(rawData || {}));
  const {
    theme,
    headingFont,
    sectionFont,
    bodyFont,
    sacramentMeta,
    primaryTitle,
    activeTrack,
  } = resolveOccasionVisuals(data);

  const hosts = data.hosts || {};
  const occ = data.occasion || 'engagement';
  const events = Array.isArray(data.events) ? data.events : [];
  const gallery = Array.isArray(data.gallery) ? data.gallery : [];

  // Inline local/remote photos as base64 for 100% standalone viewing unless skipped
  let coverDataUrl = '';
  if (data.photos?.cover) {
    coverDataUrl = await toBase64Optimized(data.photos.cover, 1400, 0.88).catch(() => data.photos.cover);
  }

  const galleryOptimized = await Promise.all(
    gallery.map(async (item) => ({
      caption: item.caption || '',
      url: await toBase64Optimized(item.url, 1100, 0.85).catch(() => item.url),
    }))
  );

  const borderCol = theme.dark ? 'rgba(255,255,255,0.14)' : 'rgba(20,16,12,0.10)';
  const revealId = forPrint ? 'none' : (data.revealStyle || 'none');
  const revealMeta = getRevealButtonMeta(revealId, hosts);
  const trackUrl = data.customMusicUrl || activeTrack?.fallbackUrl || activeTrack?.url || '';
  const absoluteAudioUrl = trackUrl && typeof window !== 'undefined' && trackUrl.startsWith('./')
    ? `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '/')}${trackUrl.slice(2)}`
    : trackUrl;

  const eventsHtml = events.map((ev) => {
    const mapQuery = encodeURIComponent(`${ev.venue || ''} ${ev.address || ''}`.trim());
    return `
      <div class="card event-card">
        <div class="event-name">${escHtml(ev.name)}</div>
        <div class="event-time">${escHtml(ev.date)} &middot; ${escHtml(ev.time)}</div>
        <div class="event-venue">${escHtml(ev.venue)}</div>
        ${ev.address ? `<div class="event-sub">${escHtml(ev.address)}</div>` : ''}
        ${ev.dressCode ? `<div class="event-sub"><strong>Attire:</strong> ${escHtml(ev.dressCode)}</div>` : ''}
        ${mapQuery ? `<a class="map-link" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}">&#128205; View Map Directions</a>` : ''}
      </div>`;
  }).join('');

  const galleryHtml = galleryOptimized.length > 0 ? `
    <section class="section">
      <div class="section-head">
        <p class="eyebrow">Moments Together</p>
        <h2>Photo Gallery</h2>
      </div>
      <div class="gallery-grid">
        ${galleryOptimized.map(g => `
          <div class="gallery-item">
            <img src="${escHtml(g.url)}" alt="${escHtml(g.caption || primaryTitle)}"/>
            ${g.caption ? `<p class="gallery-cap">${escHtml(g.caption)}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </section>` : '';

  const pollHtml = occ === 'baby-shower' && data.enableGenderPoll !== false ? `
    <section class="section">
      <div class="card center">
        <p class="eyebrow">Fun Guess Poll</p>
        <h2>Team Pink or Team Blue?</h2>
        <div class="poll-btns">
          <button type="button" class="poll-btn pink" onclick="votePoll('pink')">&#128151; Team Pink (<span id="pinkPct">54</span>%)</button>
          <button type="button" class="poll-btn blue" onclick="votePoll('blue')">&#128153; Team Blue (<span id="bluePct">46</span>%)</button>
        </div>
        <div class="poll-bar">
          <div id="pinkBar" style="width:54%;background:#F472B6;"></div>
          <div id="blueBar" style="width:46%;background:#3B82F6;"></div>
        </div>
      </div>
    </section>` : '';

  const futureHtml = occ === 'annaprashan' ? `
    <section class="section">
      <div class="card center">
        <p class="eyebrow">Annaprashan Tradition</p>
        <h2 id="futureLabel">Guess What Little One Picks First</h2>
        <div class="future-grid">
          ${[
            { id: 'Wisdom', icon: '&#128214;' },
            { id: 'Scholar', icon: '&#9998;' },
            { id: 'Fortune', icon: '&#129689;' },
            { id: 'Roots', icon: '&#127994;' },
            { id: 'Grace', icon: '&#129719;' },
          ].map(o => `<button type="button" class="future-btn" onclick="pickTray('${escHtml(o.id)}', this)"><span>${o.icon}</span><small>${escHtml(o.id)}</small></button>`).join('')}
        </div>
      </div>
    </section>` : '';

  const logisticsHtml = occ === 'engagement' && (data.logistics?.hotel || data.logistics?.transport || data.logistics?.contact) ? `
    <section class="section">
      <div class="card">
        <p class="eyebrow">Travel &amp; Stay</p>
        ${data.logistics.hotel ? `<p class="body-line"><strong>Stay:</strong> ${escHtml(data.logistics.hotel)}</p>` : ''}
        ${data.logistics.transport ? `<p class="body-line"><strong>Arrivals:</strong> ${escHtml(data.logistics.transport)}</p>` : ''}
        ${data.logistics.contact ? `<p class="body-line"><strong>Host Desk:</strong> ${escHtml(data.logistics.contact)}</p>` : ''}
      </div>
    </section>` : '';

  const rsvpHtml = data.rsvpConfig?.enabled !== false ? `
    <section class="section">
      <div class="card">
        <div class="section-head">
          <p class="eyebrow">RSVP</p>
          <h2>Will You Be Joining Us?</h2>
          ${data.rsvpConfig?.deadline ? `<p class="sub">${escHtml(data.rsvpConfig.deadline)}</p>` : ''}
        </div>
        <form id="rsvpForm" class="rsvp-form" onsubmit="submitRsvp(event)">
          <input id="rsvpName" type="text" required placeholder="Your Full Name"/>
          <select id="rsvpAttend">
            <option value="Joyfully Accepts">Joyfully Accepts</option>
            <option value="Regretfully Declines">Regretfully Declines</option>
          </select>
          <select id="rsvpGuests">
            <option value="1">1 Guest</option>
            <option value="2" selected>2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5 Guests</option>
          </select>
          <input id="rsvpNote" type="text" placeholder="Short blessing or dietary note"/>
          <button type="submit" class="primary-btn">Confirm RSVP</button>
        </form>
        <div id="rsvpSuccess" class="rsvp-success" style="display:none;"></div>
      </div>
    </section>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(primaryTitle)} — Paigaam Invitation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Bagel+Fat+One&family=Bubblegum+Sans&family=Chewy&family=Cinzel:wght@600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Fredoka:wght@400;600;700&family=Great+Vibes&family=Montserrat:wght@400;600;700;800&family=Orbitron:wght@600;700&family=Pacifico&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background: ${escHtml(theme.bg)};
      color: ${escHtml(theme.text)};
      font-family: ${bodyFont};
      -webkit-font-smoothing: antialiased;
      min-height: 100%;
    }
    .wrap { max-width: 560px; margin: 0 auto; padding-bottom: 56px; }
    .hero-media { position: relative; overflow: hidden; background: ${escHtml(theme.surface)}; border-bottom: 1px solid ${escHtml(borderCol)}; }
    .hero-media img { width: 100%; max-height: 360px; object-fit: cover; display: block; }
    .hero-grad { position: absolute; inset: 0; background: linear-gradient(to top, ${escHtml(theme.bg)} 3%, transparent 65%); pointer-events: none; }
    .badge-top-right { position: absolute; top: 14px; right: 14px; background: ${escHtml(theme.surface)}; color: ${escHtml(theme.accent)}; border: 1px solid ${escHtml(borderCol)}; padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
    .age-pill { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); background: ${escHtml(theme.accent)}; color: ${theme.dark ? '#111111' : '#FFFFFF'}; padding: 6px 18px; border-radius: 999px; font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
    .header { text-align: center; padding: 28px 24px 16px; }
    .eyebrow { color: ${escHtml(theme.accent)}; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; }
    h1 { font-family: ${headingFont}; font-size: 40px; line-height: 1.12; margin-top: 10px; color: ${escHtml(theme.text)}; }
    h2 { font-family: ${sectionFont}; font-size: 20px; margin-top: 4px; color: ${escHtml(theme.text)}; }
    .sacrament-pill { display: inline-block; margin-top: 10px; padding: 5px 14px; border-radius: 999px; border: 1px solid ${escHtml(theme.accent)}66; color: ${escHtml(theme.accent)}; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
    .monogram { width: 48px; height: 48px; border-radius: 999px; border: 1px solid ${escHtml(theme.accent)}; color: ${escHtml(theme.accent)}; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; margin-top: 14px; }
    .sub { color: ${escHtml(theme.muted)}; font-size: 13px; margin-top: 6px; line-height: 1.5; }
    .date-pill { display: inline-block; margin-top: 16px; padding: 10px 18px; border-radius: 16px; background: ${escHtml(theme.surface)}; border: 1px solid ${escHtml(borderCol)}; font-size: 13px; font-weight: 600; }
    .quote-box { margin-top: 18px; padding: 18px; border-radius: 18px; background: ${escHtml(theme.surface)}; border: 1px solid ${escHtml(borderCol)}; color: ${escHtml(theme.muted)}; font-size: 13.5px; line-height: 1.65; }
    .verse-box { margin-top: 14px; padding: 14px 18px; border-radius: 16px; background: ${escHtml(theme.accent)}1A; border: 1px solid ${escHtml(theme.accent)}55; font-style: italic; font-size: 13px; }
    .section { padding: 12px 22px; }
    .section-head { text-align: center; margin-bottom: 12px; }
    .card { padding: 18px; border-radius: 18px; background: ${escHtml(theme.surface)}; border: 1px solid ${escHtml(borderCol)}; margin-bottom: 12px; }
    .center { text-align: center; }
    .event-name { font-size: 16px; font-weight: 700; }
    .event-time { font-size: 12.5px; font-weight: 600; color: ${escHtml(theme.accent)}; margin-top: 4px; }
    .event-venue { font-size: 13.5px; font-weight: 500; margin-top: 8px; }
    .event-sub { font-size: 12px; color: ${escHtml(theme.muted)}; margin-top: 3px; }
    .map-link { display: inline-block; margin-top: 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: ${escHtml(theme.accent)}; text-decoration: underline; }
    .gallery-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .gallery-item { border-radius: 14px; overflow: hidden; background: ${escHtml(theme.surface)}; border: 1px solid ${escHtml(borderCol)}; }
    .gallery-item img { width: 100%; height: 150px; object-fit: cover; display: block; }
    .gallery-cap { padding: 8px 10px; font-size: 11px; color: ${escHtml(theme.muted)}; }
    .poll-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
    .poll-btn { padding: 10px; border-radius: 12px; border: 1px solid #F9A8D4; font-weight: 700; font-size: 12px; cursor: pointer; background: #FDF2F8; color: #9D174D; }
    .poll-btn.blue { border-color: #93C5FD; background: #EFF6FF; color: #1E40AF; }
    .poll-bar { height: 8px; border-radius: 999px; overflow: hidden; display: flex; margin-top: 10px; background: #E2E8F0; }
    .future-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-top: 12px; }
    .future-btn { padding: 10px 4px; border-radius: 12px; border: 1px solid ${escHtml(borderCol)}; background: transparent; color: ${escHtml(theme.text)}; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 18px; }
    .future-btn small { font-size: 9px; font-weight: 700; text-transform: uppercase; }
    .future-btn.active { background: ${escHtml(theme.accent)}; color: ${theme.dark ? '#111111' : '#FFFFFF'}; }
    .rsvp-form { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
    .rsvp-form input, .rsvp-form select { padding: 11px 14px; border-radius: 12px; border: 1px solid ${escHtml(borderCol)}; background: ${escHtml(theme.bg)}; color: ${escHtml(theme.text)}; font-family: inherit; font-size: 13px; }
    .primary-btn { padding: 12px 22px; border-radius: 999px; border: none; background: ${escHtml(theme.accent)}; color: ${theme.dark ? '#111111' : '#FFFFFF'}; font-weight: 700; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; }
    .rsvp-success { margin-top: 14px; padding: 14px; border-radius: 14px; border: 1px solid ${escHtml(theme.accent)}66; background: ${escHtml(theme.accent)}1A; text-align: center; font-size: 13px; }
    .body-line { font-size: 13px; margin-top: 6px; line-height: 1.5; }
    footer { text-align: center; padding: 24px 20px 10px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: ${escHtml(theme.muted)}; }

    /* Interactive Reveal Curtain */
    #revealGate {
      position: fixed; inset: 0; z-index: 999;
      background: radial-gradient(circle at top, ${escHtml(theme.accent)}2A, ${escHtml(theme.bg)} 72%);
      display: flex; flex-direction: column; align-items: center; justify-content: space-between;
      padding: 36px 24px; text-align: center; transition: opacity 0.45s ease;
    }
    .gate-stage { margin: auto; display: flex; flex-direction: column; align-items: center; gap: 18px; }
    .gate-badge { min-width: 150px; padding: 24px 28px; border-radius: 24px; background: ${escHtml(theme.surface)}; border: 2px solid ${escHtml(theme.accent)}; font-size: 26px; font-weight: 800; box-shadow: 0 20px 40px rgba(0,0,0,0.18); }
    .skip-btn { background: none; border: none; color: ${escHtml(theme.muted)}; text-decoration: underline; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; }
    #musicFab { position: fixed; bottom: 18px; right: 18px; z-index: 80; padding: 10px 16px; border-radius: 999px; border: 1px solid ${escHtml(borderCol)}; background: ${escHtml(theme.surface)}; color: ${escHtml(theme.text)}; font-size: 11px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.16); }

    @media print {
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      #revealGate, #musicFab { display: none !important; }
      .wrap { max-width: 100% !important; padding: 0 !important; }
      .card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  ${revealId !== 'none' ? `
  <div id="revealGate">
    <div>
      <p class="eyebrow">${escHtml(hosts.revealEyebrow || "YOU'RE INVITED")}</p>
      <h1 style="font-size:32px;">${escHtml(primaryTitle)}</h1>
    </div>
    <div class="gate-stage">
      ${revealId === 'scratch' ? `
      <div style="position:relative;width:240px;height:130px;border-radius:16px;overflow:hidden;border:2px solid ${escHtml(theme.accent)};background:#FFFDF8;display:flex;align-items:center;justify-content:center;color:#2B1E17;font-weight:700;">
        <span>${escHtml(primaryTitle)}</span>
        <canvas id="scratchCanvas" width="240" height="130" style="position:absolute;inset:0;cursor:crosshair;touch-action:none;"></canvas>
      </div>` : `<div class="gate-badge">${escHtml(revealMeta.badge)}</div>`}
      <button type="button" class="primary-btn" onclick="openInviteGate()">${escHtml(revealMeta.icon)} ${escHtml(revealMeta.cta)}</button>
    </div>
    <button type="button" class="skip-btn" onclick="openInviteGate()">Skip Reveal &rarr;</button>
  </div>` : ''}

  ${!forPrint && absoluteAudioUrl ? `
  <audio id="bgAudio" src="${escHtml(absoluteAudioUrl)}" loop preload="none"></audio>
  <button id="musicFab" type="button" onclick="toggleAudio()">&#9835; Music: Off</button>` : ''}

  <main class="wrap">
    <div class="hero-media">
      ${coverDataUrl ? `<img src="${escHtml(coverDataUrl)}" alt="${escHtml(primaryTitle)}"/>` : buildFallbackSceneSvg(theme, primaryTitle, hosts.flatNo)}
      <div class="hero-grad"></div>
      ${(occ === 'housewarming' || occ === 'house-party') && hosts.flatNo ? `<div class="badge-top-right">Flat ${escHtml(hosts.flatNo)} &middot; Fl ${escHtml(hosts.floor || '1')}</div>` : ''}
      ${occ === 'birthday' && hosts.ageBadge ? `<div class="age-pill">&#127874; ${escHtml(hosts.ageBadge)}</div>` : ''}
    </div>

    <header class="header">
      ${hosts.title ? `<p class="eyebrow">${escHtml(hosts.title)}</p>` : ''}
      ${data.showMonogram && data.monogram?.initials ? `<div class="monogram">${escHtml(data.monogram.initials)}</div>` : ''}
      ${sacramentMeta ? `<div class="sacrament-pill">${escHtml(sacramentMeta.name)}</div>` : ''}
      <h1>${escHtml(primaryTitle)}</h1>
      ${occ === 'engagement' && (hosts.brideParents || hosts.groomParents) ? `<p class="sub">${escHtml(hosts.brideParents || '')}<br/>${escHtml(hosts.groomParents || '')}</p>` : ''}
      ${hosts.invitedBy ? `<p class="sub">${escHtml(hosts.invitedBy)}</p>` : ''}
      ${hosts.godparents ? `<p class="sub" style="color:${escHtml(theme.accent)}">${escHtml(hosts.godparents)}</p>` : ''}
      ${hosts.hostedBy ? `<p class="sub">${escHtml(hosts.hostedBy)}</p>` : ''}
      ${hosts.dueDateLine ? `<p class="sub" style="color:${escHtml(theme.accent)};font-weight:700;">&#10024; ${escHtml(hosts.dueDateLine)}</p>` : ''}
      ${hosts.siblingName ? `<p class="sub">Proud elder sibling: ${escHtml(hosts.siblingName)}</p>` : ''}

      <div class="date-pill">&#128197; ${escHtml(formatReadableDate(hosts.date))}${hosts.city ? ` &bull; ${escHtml(hosts.city)}` : ''}</div>

      ${hosts.welcomeQuote ? `<div class="quote-box">&ldquo;${escHtml(hosts.welcomeQuote)}&rdquo;</div>` : ''}
      ${hosts.bibleVerse ? `<div class="verse-box">${escHtml(hosts.bibleVerse)}</div>` : ''}
      ${occ === 'house-party' && hosts.menuHighlights ? `<div class="card" style="text-align:left;margin-top:14px;"><p class="eyebrow">On The Menu &amp; Playlist</p><p class="body-line">${escHtml(hosts.menuHighlights)}</p></div>` : ''}
      ${occ === 'birthday' && hosts.dressCode ? `<div class="card" style="margin-top:14px;"><strong>Dress Code:</strong> ${escHtml(hosts.dressCode)}</div>` : ''}
    </header>

    ${pollHtml}
    ${futureHtml}

    ${events.length > 0 ? `
    <section class="section">
      <div class="section-head">
        <p class="eyebrow">Celebration Itinerary</p>
        <h2>When &amp; Where</h2>
      </div>
      ${eventsHtml}
    </section>` : ''}

    ${galleryHtml}
    ${logisticsHtml}
    ${rsvpHtml}

    <footer>
      <p>${hosts.hashtag ? `${escHtml(hosts.hashtag)} &middot; ` : ''}Paigaam Digital Invitation</p>
    </footer>
  </main>

  <script>
    var pinkCount = 14, blueCount = 12, myVote = null, playing = false;
    function openInviteGate() {
      var g = document.getElementById('revealGate');
      if (g) { g.style.opacity = '0'; setTimeout(function(){ g.style.display = 'none'; }, 420); }
      var au = document.getElementById('bgAudio');
      if (au && !playing) {
        au.play().then(function(){
          playing = true;
          var btn = document.getElementById('musicFab');
          if (btn) btn.innerHTML = '&#9835; Music: On';
        }).catch(function(){});
      }
    }
    function toggleAudio() {
      var au = document.getElementById('bgAudio');
      var btn = document.getElementById('musicFab');
      if (!au) return;
      if (playing) { au.pause(); playing = false; if (btn) btn.innerHTML = '&#9835; Music: Off'; }
      else { au.play().then(function(){ playing = true; if (btn) btn.innerHTML = '&#9835; Music: On'; }).catch(function(){}); }
    }
    function votePoll(team) {
      if (myVote === team) return;
      if (team === 'pink') { pinkCount++; if (myVote === 'blue') blueCount--; }
      else { blueCount++; if (myVote === 'pink') pinkCount--; }
      myVote = team;
      var total = Math.max(1, pinkCount + blueCount);
      var p = Math.round((pinkCount / total) * 100);
      var b = 100 - p;
      document.getElementById('pinkPct').textContent = p;
      document.getElementById('bluePct').textContent = b;
      document.getElementById('pinkBar').style.width = p + '%';
      document.getElementById('blueBar').style.width = b + '%';
    }
    function pickTray(label, el) {
      document.querySelectorAll('.future-btn').forEach(function(b){ b.classList.remove('active'); });
      el.classList.add('active');
      var t = document.getElementById('futureLabel');
      if (t) t.textContent = 'You predicted: ' + label + '!';
    }
    function submitRsvp(e) {
      e.preventDefault();
      var name = document.getElementById('rsvpName').value || 'Friend';
      var att = document.getElementById('rsvpAttend').value;
      var guests = document.getElementById('rsvpGuests').value;
      document.getElementById('rsvpForm').style.display = 'none';
      var box = document.getElementById('rsvpSuccess');
      box.style.display = 'block';
      box.innerHTML = '<strong>Thank you, ' + name.replace(/</g,'&lt;') + '!</strong><br/>Recorded: ' + att + (att.indexOf('Accepts') !== -1 ? ' (' + guests + ' guest/s)' : '') + '.';
    }
    (function initScratch(){
      var c = document.getElementById('scratchCanvas');
      if (!c) return;
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#C59B5F';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#3B2814';
      ctx.font = 'bold 12px Montserrat, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCRATCH FOIL TO REVEAL', c.width / 2, c.height / 2 + 4);
      var down = false;
      function draw(cx, cy) {
        var r = c.getBoundingClientRect();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(((cx - r.left) / r.width) * c.width, ((cy - r.top) / r.height) * c.height, 20, 0, Math.PI * 2);
        ctx.fill();
      }
      c.addEventListener('pointerdown', function(e){ down = true; draw(e.clientX, e.clientY); });
      c.addEventListener('pointermove', function(e){ if (down) draw(e.clientX, e.clientY); });
      window.addEventListener('pointerup', function(){ down = false; });
    })();
    ${forPrint ? 'window.addEventListener("load", function(){ setTimeout(function(){ window.print(); }, 500); });' : ''}
  </script>
</body>
</html>`;
}

export async function openOccasionPdfPrintWindow(data) {
  const html = await buildOccasionStandaloneHtml(data, { forPrint: true });
  const win = window.open('', '_blank', 'width=900,height=1100');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    return true;
  }
  return false;
}
