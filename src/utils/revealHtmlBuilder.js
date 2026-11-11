// Generates standalone HTML & interactive runtime JS for all 30 reveal styles
import { REVEAL_META, REVEAL_ALIASES } from './revealConfig.js';

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildStandaloneUniversalScreenHtml({ data, isVisible }) {
  const bride = escapeHtml(data?.hosts?.bride || 'Preeti');
  const groom = escapeHtml(data?.hosts?.groom || 'Ashish');
  const styleId = data?.revealStyle || 'folding-doors';
  const norm = REVEAL_ALIASES[styleId] || styleId;
  const meta = REVEAL_META[norm] || REVEAL_META['folding-doors'];

  return `
  <!-- REVEAL SCREEN 3: UNIVERSAL BESPOKE REVEAL STAGE -->
  <div id="reveal-screen-universal" class="fixed inset-0 z-40 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-y-auto transition-opacity duration-700 ${isVisible ? '' : 'hidden'}" style="background-color: var(--pal-bg);">
    <div class="text-center space-y-2 mb-5 max-w-md pt-6">
      <span id="uni-rev-eyebrow" class="text-[10px] tracking-[0.3em] uppercase font-bold inv-pill border px-3.5 py-1 rounded-full shadow-xs inline-block">
        ${escapeHtml(meta.eyebrow)}
      </span>
      <h2 id="uni-rev-names" class="font-royal text-3xl sm:text-4xl font-light inv-heading">
        ${bride} &amp; ${groom}
      </h2>
      <p id="uni-rev-hint" class="text-xs inv-muted font-light">
        ${escapeHtml(meta.hint)}
      </p>
    </div>

    <div id="universal-reveal-stage" class="w-full max-w-sm mx-auto"></div>

    <div class="mt-6 pb-6 text-center">
      <button id="universal-skip-btn" type="button" onclick="unlockInvitation()" class="text-[11px] tracking-widest uppercase font-semibold inv-accent hover:underline cursor-pointer">
        Skip reveal and view invitation &rarr;
      </button>
    </div>
  </div>`;
}

export function buildStandaloneRevealRuntimeScript(initialCtx) {
  const safeInit = JSON.stringify({
    revealStyle: initialCtx.revealStyle || 'folding-doors',
    template: initialCtx.template || 'caricature',
    bride: initialCtx.bride || 'Preeti',
    groom: initialCtx.groom || 'Ashish',
    city: initialCtx.city || 'Meerut',
    initials: initialCtx.initials || 'P & A',
    displayDate: initialCtx.displayDate || '9th December 2026',
    coverImg: initialCtx.coverImg || '',
  }).replace(/<\/script/gi, '<\\/script');

  const metaJson = JSON.stringify(REVEAL_META).replace(/<\/script/gi, '<\\/script');
  const aliasJson = JSON.stringify(REVEAL_ALIASES).replace(/<\/script/gi, '<\\/script');

  return `
    // 4. Unified Interactive Reveal Engine (Supports all 30 reveal options)
    var __REVEAL_META__ = ${metaJson};
    var __REVEAL_ALIASES__ = ${aliasJson};
    var __INITIAL_REVEAL_CTX__ = ${safeInit};

    function __escHtml(v) {
      return String(v == null ? '' : v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function __normReveal(rawStyle) {
      if (!rawStyle) return 'folding-doors';
      var mapped = __REVEAL_ALIASES__[rawStyle] || rawStyle;
      return __REVEAL_META__[mapped] ? mapped : 'folding-doors';
    }

    window.__initScratchCanvas = function(canvasId, hintId, titleText, subText) {
      var canvas = document.getElementById(canvasId);
      if (!canvas) return;
      var ctx2d = canvas.getContext('2d');
      var w = canvas.width;
      var h = canvas.height;
      ctx2d.globalCompositeOperation = 'source-over';
      var grad = ctx2d.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#B8860B');
      grad.addColorStop(0.25, '#FFD700');
      grad.addColorStop(0.5, '#FFF8DC');
      grad.addColorStop(0.75, '#DAA520');
      grad.addColorStop(1, '#996515');
      ctx2d.fillStyle = grad;
      ctx2d.fillRect(0, 0, w, h);

      ctx2d.fillStyle = 'rgba(255,255,255,0.22)';
      for (var i = 0; i < 320; i++) {
        ctx2d.beginPath();
        ctx2d.arc(Math.random() * w, Math.random() * h, Math.random() * 1.8, 0, Math.PI * 2);
        ctx2d.fill();
      }
      ctx2d.strokeStyle = 'rgba(90, 60, 15, 0.45)';
      ctx2d.lineWidth = 2;
      ctx2d.strokeRect(10, 10, w - 20, h - 20);
      ctx2d.textAlign = 'center';
      ctx2d.fillStyle = '#3E2B1F';
      ctx2d.font = 'bold 13px Cinzel, serif';
      ctx2d.fillText(titleText || 'SCRATCH TO REVEAL', w / 2, h / 2 - 10);
      ctx2d.font = 'italic 11px Georgia, serif';
      ctx2d.fillStyle = '#5A3D1E';
      ctx2d.fillText(subText || 'Rub with finger or cursor', w / 2, h / 2 + 16);

      var drawing = false;
      var unlocked = false;

      function doScratch(cx, cy) {
        if (unlocked) return;
        var rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var x = ((cx - rect.left) / rect.width) * w;
        var y = ((cy - rect.top) / rect.height) * h;
        ctx2d.globalCompositeOperation = 'destination-out';
        ctx2d.beginPath();
        ctx2d.arc(x, y, 26, 0, Math.PI * 2);
        ctx2d.fill();
        try { if (window.sound && window.sound.playChime) window.sound.playChime(950 + Math.random() * 350); } catch(e) {}

        var imgData = ctx2d.getImageData(0, 0, w, h).data;
        var transparent = 0;
        var samples = 0;
        for (var k = 3; k < imgData.length; k += 64) {
          samples++;
          if (imgData[k] === 0) transparent++;
        }
        var pct = Math.min(100, Math.round((transparent / Math.max(1, samples)) * 100));
        var hint = document.getElementById(hintId);
        if (hint) hint.textContent = 'Rubbing gold foil... ' + pct + '% cleared';
        if (pct >= 38 && !unlocked) {
          unlocked = true;
          canvas.style.opacity = '0';
          canvas.style.pointerEvents = 'none';
          setTimeout(function() { if (window.unlockInvitation) window.unlockInvitation(); }, 450);
        }
      }

      if (canvas.__boundRev) return;
      canvas.__boundRev = true;
      canvas.addEventListener('mousedown', function(e) { drawing = true; doScratch(e.clientX, e.clientY); });
      window.addEventListener('mouseup', function() { drawing = false; });
      canvas.addEventListener('mousemove', function(e) { if (drawing) doScratch(e.clientX, e.clientY); });
      canvas.addEventListener('touchstart', function(e) {
        drawing = true;
        if (e.touches && e.touches[0]) doScratch(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      }, { passive: false });
      window.addEventListener('touchend', function() { drawing = false; });
      canvas.addEventListener('touchmove', function(e) {
        if (!drawing) return;
        if (e.touches && e.touches[0]) doScratch(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      }, { passive: false });
    };

    window.__buildUniversalStageHtml = function(id, ctx) {
      var bride = __escHtml(ctx.bride || 'Preeti');
      var groom = __escHtml(ctx.groom || 'Ashish');
      var city = __escHtml(ctx.city || 'Meerut');
      var dDate = __escHtml(ctx.displayDate || '9th December 2026');
      var initStr = __escHtml(ctx.initials || ((bride[0] || 'P') + ' & ' + (groom[0] || 'A')));
      var parts = initStr.split(/&|\\+/);
      var bInit = __escHtml((parts[0] || bride[0] || 'P').trim().charAt(0).toUpperCase());
      var gInit = __escHtml((parts[1] || groom[0] || 'A').trim().charAt(0).toUpperCase());
      var photo = __escHtml(ctx.coverImg || '');
      var meta = __REVEAL_META__[id] || __REVEAL_META__['letter'];
      var cta = __escHtml(meta.cta);
      var done = __escHtml(meta.done);

      if (id === 'scratch') {
        return '<div class="relative w-80 max-w-full mx-auto h-56 rounded-2xl overflow-hidden shadow-2xl border-4 select-none inv-modal" style="border-color: var(--pal-accent);">'
          + '<div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center inv-surface">'
          + '<div class="w-11 h-11 rounded-full border flex items-center justify-center font-royal text-sm font-bold inv-accent mb-1.5" style="border-color: var(--pal-accent);">' + initStr + '</div>'
          + '<span class="text-[9px] uppercase tracking-widest font-bold inv-accent">The Royal Shaadi</span>'
          + '<h3 class="font-royal text-2xl inv-heading mt-0.5">' + bride + ' &amp; ' + groom + '</h3>'
          + '<p class="text-xs inv-muted mt-1">' + dDate + ' · ' + city + '</p>'
          + '</div>'
          + '<canvas id="uni-scratch-canvas" width="320" height="224" class="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"></canvas>'
          + '</div>'
          + '<p id="uni-scratch-hint" class="text-xs inv-muted font-medium text-center mt-3">Rub gold foil above (0% cleared)</p>';
      }

      if (id === 'seal') {
        return '<div data-uni-trigger="1" class="uni-rev-box relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/60 select-none bg-[#FDFBF7] text-[#2B1E17] p-6 flex flex-col items-center justify-center text-center cursor-pointer">'
          + '<div class="uni-flap-top absolute top-0 left-0 right-0 h-1/2 bg-[#F7F2E8] border-b-2 border-[#E6D5BF] z-10 flex items-end justify-center pb-2">'
          + '<span class="text-[10px] tracking-[0.25em] text-[#8B6F47] uppercase font-bold">Confidential &amp; Royal</span></div>'
          + '<div class="space-y-1 z-0"><p class="text-[9px] tracking-[0.3em] uppercase text-[#8B6F47] font-bold">You Are Invited</p>'
          + '<h3 class="font-royal text-2xl">' + bride + ' &amp; ' + groom + '</h3><p class="text-xs text-stone-600">' + dDate + '</p></div>'
          + '<div class="uni-wax-seal relative z-20 w-20 h-20 rounded-full bg-gradient-to-br from-[#8B1E1E] via-[#A82828] to-[#601212] border-2 border-[#D4AF37] shadow-xl flex items-center justify-center">'
          + '<span class="font-royal text-[#FFF8DC] font-bold tracking-widest text-sm">' + initStr + '</span></div>'
          + '</div><button data-uni-trigger="1" type="button" class="mt-3 w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest cursor-pointer">' + cta + '</button>';
      }

      if (id === 'ringbox') {
        return '<div data-uni-trigger="1" class="uni-rev-box relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/60 select-none bg-gradient-to-b from-[#1A0E13] via-[#2A1520] to-[#12080D] text-[#F5EBDD] p-6 flex flex-col items-center justify-center text-center cursor-pointer">'
          + '<div class="space-y-2 z-0"><div class="flex justify-center -space-x-3 mb-2">'
          + '<div class="w-12 h-12 rounded-full border-4 border-yellow-400 flex items-center justify-center text-xs font-bold text-yellow-200 shadow-lg">' + bInit + '</div>'
          + '<div class="w-12 h-12 rounded-full border-4 border-amber-300 flex items-center justify-center text-xs font-bold text-amber-100 shadow-lg">' + gInit + '</div></div>'
          + '<p class="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-bold">We Said Yes</p>'
          + '<h3 class="font-royal text-2xl text-white">' + bride + ' &amp; ' + groom + '</h3></div>'
          + '<div class="uni-box-lid absolute z-20 w-28 h-24 rounded-2xl bg-gradient-to-b from-[#6B182E] to-[#380915] border border-[#D4AF37] shadow-2xl flex flex-col items-center justify-center">'
          + '<div class="w-6 h-3 bg-amber-300 rounded-sm mb-1.5"></div><span class="text-xs font-bold text-amber-200 uppercase">Open Box</span></div>'
          + '</div><button data-uni-trigger="1" type="button" class="mt-3 w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest cursor-pointer">' + cta + '</button>';
      }

      if (id === 'doorbell') {
        return '<div data-uni-trigger="1" class="uni-rev-box relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 bg-[#1D140F] text-[#F5EBDD] p-6 flex flex-col items-center justify-center text-center cursor-pointer" style="perspective:900px;">'
          + '<div class="space-y-1 z-0"><h3 class="font-royal text-2xl">' + bride + ' &amp; ' + groom + '</h3><p class="text-xs text-amber-200">' + done + '</p></div>'
          + '<div class="uni-door-l absolute inset-y-0 left-0 w-1/2 bg-[#3D2517] border-r border-amber-500/40 z-10"></div>'
          + '<div class="uni-door-r absolute inset-y-0 right-0 w-1/2 bg-[#3D2517] border-l border-amber-500/40 z-10"></div>'
          + '<div class="uni-wax-seal relative z-20 px-4 py-3 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-xl">🔔 ' + cta + '</div>'
          + '</div>';
      }

      if (id === 'letter') {
        return '<div data-uni-trigger="1" class="uni-rev-box inv-modal rounded-3xl p-5 pt-16 min-h-[270px] flex flex-col items-center justify-end shadow-2xl cursor-pointer relative">'
          + '<div id="uni-letter-sheet" class="uni-letter-sheet relative z-10 w-[86%] rounded-2xl border-2 border-[#D4AF37]/60 bg-[#FDFBF7] text-[#2B1E17] p-5 text-center shadow-xl">'
          + '<p class="text-[9px] tracking-[0.25em] uppercase text-[#8B6F47] font-bold">Personal Note</p>'
          + '<h3 class="font-royal text-2xl mt-1">' + bride + ' &amp; ' + groom + '</h3>'
          + '<p class="text-[11px] text-stone-600 mt-1">' + dDate + ' · ' + city + '</p></div>'
          + '<div class="relative z-20 w-full -mt-10 rounded-2xl inv-surface border p-4 text-center shadow-lg">'
          + '<span class="text-xs font-bold uppercase tracking-widest inv-accent">' + cta + '</span></div></div>';
      }

      if (id === 'envelope') {
        return '<div data-uni-trigger="1" class="uni-rev-box relative w-full aspect-[4/3] inv-modal rounded-3xl border-2 p-4 flex items-center justify-center shadow-2xl cursor-pointer overflow-hidden" style="perspective:900px;">'
          + '<div class="text-center space-y-1 z-0"><h3 class="font-royal text-2xl inv-heading">' + bride + ' &amp; ' + groom + '</h3><p class="text-xs inv-muted">' + dDate + '</p></div>'
          + '<div class="uni-flap-top absolute inset-x-0 top-0 h-[56%] z-10" style="clip-path:polygon(0 0,100% 0,50% 100%);background-color:var(--pal-surface);"></div>'
          + '<div class="uni-flap-bottom absolute inset-x-0 bottom-0 h-[56%] z-10" style="clip-path:polygon(0 100%,100% 100%,50% 0);background-color:var(--pal-card-bg);"></div>'
          + '<div class="uni-flap-left absolute inset-y-0 left-0 w-[56%] z-10" style="clip-path:polygon(0 0,100% 50%,0 100%);background-color:var(--pal-door-left,var(--pal-surface));"></div>'
          + '<div class="uni-flap-right absolute inset-y-0 right-0 w-[56%] z-10" style="clip-path:polygon(100% 0,0 50%,100% 100%);background-color:var(--pal-door-right,var(--pal-surface));"></div>'
          + '<span class="uni-wax-seal relative z-20 px-4 py-2 rounded-full inv-btn-primary text-[11px] font-bold uppercase tracking-widest shadow-xl">' + cta + '</span></div>';
      }

      if (id === 'tap') {
        return '<div data-uni-trigger="1" class="uni-rev-box relative w-full aspect-[4/3] inv-modal rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-6 cursor-pointer" style="perspective:1000px;">'
          + '<div class="text-center z-0"><h3 class="font-royal text-2xl inv-heading">' + bride + ' &amp; ' + groom + '</h3><p class="text-xs inv-muted">' + city + '</p></div>'
          + '<div class="uni-door-l absolute inset-y-0 left-0 w-1/2 z-10 bg-gradient-to-br from-[#4A2E1B] to-[#26150A] border-r-2 border-[#D4AF37]/60 flex items-center justify-end pr-3"><div class="w-6 h-6 rounded-full border-2 border-amber-300"></div></div>'
          + '<div class="uni-door-r absolute inset-y-0 right-0 w-1/2 z-10 bg-gradient-to-bl from-[#4A2E1B] to-[#26150A] border-l-2 border-[#D4AF37]/60 flex items-center justify-start pl-3"><div class="w-6 h-6 rounded-full border-2 border-amber-300"></div></div>'
          + '<span class="uni-wax-seal relative z-20 px-4 py-2 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-xl">' + cta + '</span></div>';
      }

      if (id === 'meet') {
        return '<div data-uni-trigger="1" class="uni-rev-box inv-modal rounded-3xl p-6 text-center space-y-4 shadow-2xl cursor-pointer">'
          + '<div class="flex items-center justify-center gap-10 h-24">'
          + '<div class="uni-meet-l w-16 h-16 rounded-full border-2 inv-surface flex items-center justify-center font-royal text-xl font-bold inv-heading shadow-lg" style="border-color:var(--pal-accent);">' + bInit + '</div>'
          + '<span class="text-2xl">💕</span>'
          + '<div class="uni-meet-r w-16 h-16 rounded-full border-2 inv-surface flex items-center justify-center font-royal text-xl font-bold inv-heading shadow-lg" style="border-color:var(--pal-accent);">' + gInit + '</div>'
          + '</div><button type="button" class="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">' + cta + '</button></div>';
      }

      if (id === 'match') {
        return '<div id="uni-match-card" class="inv-modal rounded-3xl overflow-hidden shadow-2xl border-2 cursor-grab select-none transition-all duration-500">'
          + '<div class="relative aspect-[4/3] overflow-hidden bg-stone-900">'
          + (photo ? '<img src="' + photo + '" alt="Match" class="w-full h-full object-cover pointer-events-none" />' : '')
          + '<div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>'
          + '<div id="uni-match-stamp" class="hidden absolute top-4 left-4 border-4 border-emerald-400 text-emerald-300 font-black text-lg px-3 py-1 rounded-xl -rotate-12 bg-black/50">MATCH! ♥</div>'
          + '<div class="absolute bottom-3 left-4 right-4 text-left text-white"><p class="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">Soulmates · &infin;% Match</p>'
          + '<h3 class="font-royal text-2xl">' + bride + ' &amp; ' + groom + '</h3><p class="text-xs text-white/80">' + city + ' · ' + dDate + '</p></div></div>'
          + '<div class="p-4 flex items-center justify-between gap-2"><span class="text-xs inv-muted">Drag right or tap ♥</span>'
          + '<button id="uni-match-btn" type="button" class="w-12 h-12 rounded-full bg-emerald-600 text-white text-xl font-bold flex items-center justify-center shadow-lg cursor-pointer">♥</button></div></div>';
      }

      if (id === 'video') {
        return '<div data-uni-trigger="1" class="uni-rev-box bg-stone-950 text-white rounded-3xl overflow-hidden border border-stone-700 shadow-2xl cursor-pointer">'
          + '<div class="px-3 py-1.5 bg-black/80 text-[9px] tracking-[0.25em] uppercase text-amber-300 font-bold flex justify-between"><span>🎬 PREMIERE</span><span>' + bInit + ' &amp; ' + gInit + '</span></div>'
          + '<div class="relative aspect-[16/10] overflow-hidden flex items-center justify-center">'
          + (photo ? '<img src="' + photo + '" class="absolute inset-0 w-full h-full object-cover opacity-70" />' : '')
          + '<div class="relative z-10 w-16 h-16 rounded-full bg-amber-400 text-stone-950 font-black text-xl flex items-center justify-center shadow-2xl">▶</div></div>'
          + '<div class="p-4 space-y-2"><div class="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden"><div class="uni-scroll-body bg-amber-400 h-full w-1/4"></div></div>'
          + '<p class="text-xs text-amber-200 font-bold uppercase tracking-widest">' + cta + '</p></div></div>';
      }

      if (id === 'incoming-call') {
        return '<div data-uni-trigger="1" class="uni-rev-box bg-[#14171A] text-white rounded-3xl p-6 border border-stone-700 shadow-2xl text-center space-y-5 cursor-pointer">'
          + '<span class="text-[11px] text-emerald-400 font-bold uppercase tracking-widest animate-pulse block">Incoming Wedding Call...</span>'
          + '<div class="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-emerald-400 bg-stone-800 flex items-center justify-center">'
          + (photo ? '<img src="' + photo + '" class="w-full h-full object-cover" />' : '<span class="font-royal text-2xl">' + initStr + '</span>')
          + '</div><h3 class="font-royal text-2xl">' + bride + ' &amp; ' + groom + '</h3>'
          + '<button type="button" class="w-full py-3.5 rounded-full bg-[#059669] text-white font-bold text-xs uppercase tracking-widest shadow-lg">' + cta + '</button></div>';
      }

      if (id === 'bismillah') {
        return '<div data-uni-trigger="1" class="uni-rev-box bg-gradient-to-br from-[#06281E] to-[#041C14] text-[#FDE68A] rounded-3xl p-7 border-2 border-[#D4AF37]/70 text-center space-y-4 shadow-2xl cursor-pointer">'
          + '<div class="relative overflow-hidden py-3 border-y border-[#D4AF37]/40"><p class="text-2xl font-serif text-[#FCD34D]" dir="rtl">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>'
          + '<div class="rev-shimmer absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-200/35 to-transparent"></div></div>'
          + '<h3 class="font-royal text-2xl text-white">' + bride + ' &amp; ' + groom + '</h3>'
          + '<button type="button" class="w-full py-3 rounded-full bg-[#D4AF37] text-stone-950 font-bold text-xs uppercase tracking-widest">' + cta + '</button></div>';
      }

      if (id === 'foil-card') {
        return '<div data-uni-trigger="1" class="uni-rev-box relative bg-gradient-to-br from-[#FFFDF8] to-[#F3EAD8] text-[#2B1E17] border-2 border-[#D4AF37] rounded-3xl p-7 text-center space-y-4 shadow-2xl overflow-hidden cursor-pointer">'
          + '<div class="rev-shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300/35 to-transparent"></div>'
          + '<div class="border border-[#D4AF37]/60 p-5 rounded-xl space-y-2"><div class="w-11 h-11 rounded-full mx-auto border-2 border-[#B8860B] flex items-center justify-center font-royal font-bold text-[#8B6F47]">' + initStr + '</div>'
          + '<h3 class="font-royal text-2xl">' + bride + ' &amp; ' + groom + '</h3><p class="text-xs text-stone-600">' + dDate + ' · ' + city + '</p></div>'
          + '<button type="button" class="w-full py-3 rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-stone-950 font-bold text-xs uppercase tracking-widest">' + cta + '</button></div>';
      }

      if (id === 'quick-delivery') {
        return '<div data-uni-trigger="1" class="uni-rev-box inv-modal rounded-3xl p-6 text-center space-y-4 shadow-2xl cursor-pointer">'
          + '<span class="inline-block text-[10px] font-bold uppercase tracking-widest bg-emerald-500/15 text-emerald-600 px-3 py-1 rounded-full">⚡ Arriving in 10 Mins</span>'
          + '<div class="relative h-24 flex items-center justify-center">'
          + '<div class="px-4 py-2 rounded-xl bg-amber-50 text-stone-900 border-2 border-amber-400 font-royal font-bold text-sm">Delivered · ' + initStr + '</div>'
          + '<div class="uni-box-lid absolute inset-x-8 py-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold shadow-xl">📦 Shaadi Express</div></div>'
          + '<button type="button" class="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">' + cta + '</button></div>';
      }

      if (id === 'shaadi-story') {
        return '<div data-uni-trigger="1" class="uni-rev-box inv-modal rounded-3xl p-6 text-center space-y-4 shadow-2xl cursor-pointer">'
          + '<div class="w-24 h-24 rounded-full p-1 mx-auto bg-gradient-to-tr from-amber-400 via-rose-500 to-emerald-500">'
          + '<div class="w-full h-full rounded-full overflow-hidden inv-surface p-0.5 flex items-center justify-center">'
          + (photo ? '<img src="' + photo + '" class="w-full h-full object-cover rounded-full" />' : '<span class="font-royal text-xl">' + initStr + '</span>')
          + '</div></div>'
          + '<span class="text-[10px] uppercase font-bold tracking-widest inv-pill px-2.5 py-0.5 rounded-full inline-block">Close Friends Only ★</span>'
          + '<h3 class="font-royal text-2xl inv-heading">' + bride + ' &amp; ' + groom + '</h3>'
          + '<button type="button" class="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">' + cta + '</button></div>';
      }

      if (id === 'lotus-bloom') {
        return '<div data-uni-trigger="1" class="uni-rev-box bg-gradient-to-b from-[#0F2A2E] to-[#081A1D] text-pink-100 rounded-3xl p-6 border-2 border-amber-400/50 text-center space-y-3 shadow-2xl cursor-pointer">'
          + '<svg viewBox="0 0 120 120" class="w-28 h-28 mx-auto overflow-visible">'
          + '<g class="uni-lotus-outer" fill="#BE185D"><ellipse cx="60" cy="24" rx="11" ry="24"/><ellipse cx="60" cy="24" rx="11" ry="24" transform="rotate(60 60 60)"/><ellipse cx="60" cy="24" rx="11" ry="24" transform="rotate(120 60 60)"/><ellipse cx="60" cy="24" rx="11" ry="24" transform="rotate(180 60 60)"/><ellipse cx="60" cy="24" rx="11" ry="24" transform="rotate(240 60 60)"/><ellipse cx="60" cy="24" rx="11" ry="24" transform="rotate(300 60 60)"/></g>'
          + '<g class="uni-lotus-inner" fill="#F472B6"><ellipse cx="60" cy="34" rx="8" ry="18" transform="rotate(30 60 60)"/><ellipse cx="60" cy="34" rx="8" ry="18" transform="rotate(90 60 60)"/><ellipse cx="60" cy="34" rx="8" ry="18" transform="rotate(150 60 60)"/><ellipse cx="60" cy="34" rx="8" ry="18" transform="rotate(210 60 60)"/><ellipse cx="60" cy="34" rx="8" ry="18" transform="rotate(270 60 60)"/><ellipse cx="60" cy="34" rx="8" ry="18" transform="rotate(330 60 60)"/></g>'
          + '<circle cx="60" cy="60" r="18" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/><text x="60" y="64" text-anchor="middle" font-size="11" font-weight="bold" fill="#78350F">' + initStr + '</text></svg>'
          + '<button type="button" class="w-full py-3 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-widest">' + cta + '</button></div>';
      }

      if (id === 'lamps-palace') {
        return '<div data-uni-trigger="1" class="uni-rev-box bg-gradient-to-b from-[#1F1224] to-[#1A0D1C] text-amber-100 rounded-3xl p-6 border-2 border-amber-400/60 text-center space-y-4 shadow-2xl cursor-pointer">'
          + '<div class="flex justify-center gap-3 text-3xl py-2"><span class="uni-diya">🪔</span><span class="uni-diya">🪔</span><span class="uni-diya">🪔</span><span class="uni-diya">🪔</span><span class="uni-diya">🪔</span></div>'
          + '<h3 class="font-royal text-2xl text-amber-50">' + bride + ' &amp; ' + groom + '</h3>'
          + '<button type="button" class="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs uppercase tracking-widest">' + cta + '</button></div>';
      }

      if (id === 'into-garden' || id === 'hall-mirrors' || id === 'gurdwara') {
        var isMirrors = id === 'hall-mirrors';
        var isGurdwara = id === 'gurdwara';
        var lCls = isMirrors ? 'uni-slide-l bg-gradient-to-br from-slate-200 to-amber-100 border-r-2 border-amber-400'
          : isGurdwara ? 'uni-door-l bg-gradient-to-b from-amber-50 to-amber-200 border-r-2 border-amber-500 flex items-center justify-end pr-3 text-amber-800 font-bold'
          : 'uni-door-l bg-emerald-950/90 border-r-2 border-emerald-400/50 flex items-center justify-end pr-3 text-2xl';
        var rCls = isMirrors ? 'uni-slide-r bg-gradient-to-bl from-slate-200 to-amber-100 border-l-2 border-amber-400'
          : isGurdwara ? 'uni-door-r bg-gradient-to-b from-amber-50 to-amber-200 border-l-2 border-amber-500 flex items-center justify-start pl-3 text-amber-800 font-bold'
          : 'uni-door-r bg-emerald-950/90 border-l-2 border-emerald-400/50 flex items-center justify-start pl-3 text-2xl';
        var lGlyph = isGurdwara ? 'ੴ' : (isMirrors ? '✨' : '🌸');
        var rGlyph = isGurdwara ? '✨' : (isMirrors ? '✨' : '🌺');
        return '<div data-uni-trigger="1" class="uni-rev-box relative w-full aspect-[4/3] inv-modal rounded-3xl overflow-hidden flex items-center justify-center p-6 shadow-2xl cursor-pointer" style="perspective:1000px;">'
          + '<div class="text-center z-0"><h3 class="font-royal text-2xl inv-heading">' + bride + ' &amp; ' + groom + '</h3><p class="text-xs inv-muted">' + done + '</p></div>'
          + '<div class="' + lCls + ' absolute inset-y-0 left-0 w-1/2 z-10">' + lGlyph + '</div>'
          + '<div class="' + rCls + ' absolute inset-y-0 right-0 w-1/2 z-10">' + rGlyph + '</div>'
          + '<span class="uni-wax-seal relative z-20 px-5 py-2.5 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest shadow-xl">' + cta + '</span></div>';
      }

      if (id === 'wedding-scroll') {
        return '<div data-uni-trigger="1" class="uni-rev-box inv-modal rounded-3xl p-6 text-center space-y-3 shadow-2xl cursor-pointer">'
          + '<div class="mx-auto w-[90%] flex flex-col items-center"><div class="w-full h-4 rounded-full bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B]"></div>'
          + '<div class="uni-scroll-body w-[92%] bg-[#FDF6E7] text-[#3B2214] border-x-4 border-[#D4AF37]/60 px-4 py-3">'
          + '<p class="text-[9px] uppercase tracking-widest font-bold text-[#8B6F47]">Royal Farman</p>'
          + '<h3 class="font-royal text-2xl">' + bride + ' &amp; ' + groom + '</h3><p class="text-xs text-stone-600">' + dDate + '</p></div>'
          + '<div class="w-full h-4 rounded-full bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B]"></div></div>'
          + '<button type="button" class="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">' + cta + '</button></div>';
      }

      if (id === 'tying-knot' || id === 'lovebird-post') {
        var iconLeft = id === 'tying-knot' ? '🧣' : '🕊️';
        var iconRight = id === 'tying-knot' ? '🧣' : '🕊️';
        var midBadge = id === 'tying-knot' ? '🎀' : '💌';
        return '<div data-uni-trigger="1" class="uni-rev-box inv-modal rounded-3xl p-6 text-center space-y-4 shadow-2xl cursor-pointer">'
          + '<div class="flex items-center justify-center gap-8 h-20 text-3xl">'
          + '<span class="uni-meet-l">' + iconLeft + '</span><span class="px-3 py-1.5 rounded-xl inv-surface border text-xl">' + midBadge + '</span><span class="uni-meet-r">' + iconRight + '</span>'
          + '</div><h3 class="font-royal text-2xl inv-heading">' + bride + ' &amp; ' + groom + '</h3>'
          + '<button type="button" class="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">' + cta + '</button></div>';
      }

      if (id === 'ballroom-lights') {
        return '<div data-uni-trigger="1" class="uni-rev-box bg-[#121014] text-amber-100 rounded-3xl p-6 border-2 border-[#D4AF37] text-center space-y-4 shadow-2xl cursor-pointer">'
          + '<div class="uni-chandelier text-4xl opacity-65">✨👑✨</div><h3 class="font-royal text-2xl text-white">' + bride + ' &amp; ' + groom + '</h3>'
          + '<button type="button" class="w-full py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FDE68A] text-stone-950 font-bold text-xs uppercase tracking-widest">' + cta + '</button></div>';
      }

      if (id === 'horn-ok') {
        return '<div data-uni-trigger="1" class="uni-rev-box bg-gradient-to-br from-[#9F1239] via-[#D97706] to-[#047857] text-white rounded-3xl p-6 border-4 border-amber-300 text-center space-y-3 shadow-2xl cursor-pointer">'
          + '<div class="bg-stone-950/75 rounded-2xl p-4 border-2 border-dashed border-amber-300">'
          + '<p class="text-xs font-black tracking-[0.28em] text-amber-300 uppercase">★ HORN OK PLEASE ★</p>'
          + '<h3 class="font-royal text-2xl mt-1">' + bride + ' weds ' + groom + '</h3></div>'
          + '<button type="button" class="uni-horn-btn w-full py-3.5 rounded-full bg-amber-300 text-stone-950 font-black text-xs uppercase tracking-widest">' + cta + '</button></div>';
      }

      if (id === 'ik-onkar') {
        return '<div data-uni-trigger="1" class="uni-rev-box inv-modal rounded-3xl p-7 text-center space-y-4 shadow-2xl cursor-pointer">'
          + '<div class="relative w-24 h-24 mx-auto flex items-center justify-center"><span class="rev-ripple absolute inset-0 rounded-full border-2" style="border-color:var(--pal-accent);"></span>'
          + '<div class="w-20 h-20 rounded-full border-2 border-[#D4AF37] bg-amber-50 text-[#B45309] font-bold text-3xl flex items-center justify-center shadow-lg">ੴ</div></div>'
          + '<h3 class="font-royal text-2xl inv-heading">' + bride + ' &amp; ' + groom + '</h3>'
          + '<button type="button" class="w-full py-3 rounded-full inv-btn-primary text-xs font-bold uppercase tracking-widest">' + cta + '</button></div>';
      }

      if (id === 'room-key') {
        return '<div data-uni-trigger="1" class="uni-rev-box bg-gradient-to-br from-[#0B2B3C] to-[#134E5E] text-white rounded-3xl p-6 border-2 border-amber-300/60 text-center space-y-4 shadow-2xl cursor-pointer">'
          + '<div class="flex items-center justify-center gap-4 py-2">'
          + '<div class="uni-keycard w-28 h-16 rounded-xl bg-amber-200 text-stone-900 p-2 text-left font-royal font-bold shadow-lg flex flex-col justify-between"><span class="text-[8px] uppercase">VIP Key</span><span>' + initStr + '</span></div>'
          + '<div class="w-14 h-16 rounded-xl border-2 border-cyan-300/50 bg-black/40 flex items-center justify-center text-[10px] font-bold">TAP</div></div>'
          + '<button type="button" class="w-full py-3 rounded-full bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-widest">' + cta + '</button></div>';
      }

      // bioscope & safe fallback
      return '<div data-uni-trigger="1" class="uni-rev-box bg-gradient-to-br from-[#6B1220] to-[#4A0B15] text-amber-100 rounded-3xl p-6 border-2 border-amber-400/70 text-center space-y-4 shadow-2xl cursor-pointer">'
        + '<div class="flex items-center justify-center gap-3 py-2">'
        + '<div class="w-14 h-14 rounded-full border-4 border-amber-400 overflow-hidden bg-black flex items-center justify-center">' + (photo ? '<img src="' + photo + '" class="w-full h-full object-cover"/>' : '👁️') + '</div>'
        + '<div class="w-14 h-14 rounded-full border-4 border-amber-400 overflow-hidden bg-black flex items-center justify-center">' + (photo ? '<img src="' + photo + '" class="w-full h-full object-cover"/>' : '👁️') + '</div>'
        + '<div class="uni-crank w-8 h-8 rounded-full bg-amber-400 text-stone-950 font-black flex items-center justify-center">⚙</div></div>'
        + '<h3 class="font-royal text-2xl text-white">' + bride + ' &amp; ' + groom + '</h3>'
        + '<button type="button" class="w-full py-3 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-widest">' + cta + '</button></div>';
    };

    window.__activateRevealScreen = function(rawStyle, ctx) {
      var id = __normReveal(rawStyle);
      window._doorsOpened = false;
      window._uniTriggered = false;
      var foldingEl = document.getElementById('reveal-screen-folding');
      var scratchEl = document.getElementById('reveal-screen-scratch');
      var uniEl = document.getElementById('reveal-screen-universal');

      [foldingEl, scratchEl, uniEl].forEach(function(el) {
        if (el) {
          el.classList.add('hidden');
          el.classList.remove('opacity-0', 'pointer-events-none');
          el.style.display = '';
        }
      });

      if (id === 'folding-doors') {
        if (foldingEl) foldingEl.classList.remove('hidden');
        var dLeft = document.getElementById('door-left');
        var dRight = document.getElementById('door-right');
        var dSeal = document.getElementById('door-heart-seal');
        if (dLeft) dLeft.style.transform = '';
        if (dRight) dRight.style.transform = '';
        if (dSeal) { dSeal.style.transform = ''; dSeal.style.opacity = ''; }
        return;
      }

      if (id === 'scratch-date') {
        if (scratchEl) scratchEl.classList.remove('hidden');
        window.__initScratchCanvas('scratch-canvas', 'scratch-hint', 'SCRATCH TO REVEAL DATE', 'Rub with finger or cursor');
        return;
      }

      if (uniEl) uniEl.classList.remove('hidden');
      var meta = __REVEAL_META__[id] || __REVEAL_META__['letter'];
      var elEyebrow = document.getElementById('uni-rev-eyebrow');
      var elNames = document.getElementById('uni-rev-names');
      var elHint = document.getElementById('uni-rev-hint');
      if (elEyebrow) elEyebrow.textContent = meta.eyebrow;
      if (elNames) elNames.textContent = (ctx.bride || 'Preeti') + ' & ' + (ctx.groom || 'Ashish');
      if (elHint) elHint.textContent = meta.hint;

      var stage = document.getElementById('universal-reveal-stage');
      if (!stage) return;
      stage.innerHTML = window.__buildUniversalStageHtml(id, ctx);

      if (id === 'scratch') {
        window.__initScratchCanvas('uni-scratch-canvas', 'uni-scratch-hint', 'RUB TO REVEAL DETAILS', 'Scratch off the gold foil');
        return;
      }

      if (id === 'match') {
        var card = document.getElementById('uni-match-card');
        var stamp = document.getElementById('uni-match-stamp');
        var mBtn = document.getElementById('uni-match-btn');
        var startX = null;
        var fireMatch = function() {
          if (window._uniTriggered) return;
          window._uniTriggered = true;
          if (stamp) stamp.classList.remove('hidden');
          if (card) { card.style.transform = 'translateX(120%) rotate(12deg)'; card.style.opacity = '0'; }
          try { if (window.sound && window.sound.playChime) window.sound.playChime(784); } catch(e) {}
          setTimeout(function() { if (window.unlockInvitation) window.unlockInvitation(); }, 650);
        };
        if (mBtn) mBtn.addEventListener('click', function(ev) { ev.stopPropagation(); fireMatch(); });
        if (card) {
          card.addEventListener('pointerdown', function(ev) { startX = ev.clientX; });
          card.addEventListener('pointermove', function(ev) {
            if (startX == null || window._uniTriggered) return;
            var dx = Math.max(-20, ev.clientX - startX);
            card.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx * 0.07).toFixed(1) + 'deg)';
            if (dx > 25 && stamp) stamp.classList.remove('hidden');
            if (dx > 65) { startX = null; fireMatch(); }
          });
          card.addEventListener('pointerup', function() {
            if (window._uniTriggered) return;
            startX = null;
            card.style.transform = '';
            if (stamp) stamp.classList.add('hidden');
          });
        }
        return;
      }

      stage.querySelectorAll('[data-uni-trigger]').forEach(function(el) {
        el.addEventListener('click', function() {
          if (window._uniTriggered) return;
          window._uniTriggered = true;
          var box = stage.querySelector('.uni-rev-box');
          if (box) box.classList.add('is-open');
          try { if (window.sound && window.sound.playChime) window.sound.playChime(740); } catch(e) {}
          setTimeout(function() { if (window.unlockInvitation) window.unlockInvitation(); }, 820);
        });
      });
    };

    try {
      window.__activateRevealScreen(__INITIAL_REVEAL_CTX__.revealStyle, __INITIAL_REVEAL_CTX__);
    } catch (initRevErr) {}
  `;
}
