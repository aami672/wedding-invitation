import React from 'react';

/**
 * Miniature SVG art thumbnails matching Wishlys non-wedding themes cleanly.
 * Uses pure inline SVG so thumbnails render offline, crisply at any DPI, with zero external dependencies.
 */
export default function OccasionThemeThumb({ theme, occasionId }) {
  const id = theme?.id || 'classic';
  const bg = theme?.bg || (theme?.dark ? '#141210' : '#FAF6EE');
  const accent = theme?.accent || '#C59B5F';
  const strokeMain = theme?.dark ? 'rgba(255,255,255,0.75)' : 'rgba(30,24,20,0.65)';

  return (
    <svg
      viewBox="0 0 120 78"
      className="w-full h-full block select-none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: bg }}
      aria-hidden="true"
    >
      {/* Subtle inner frame common to card thumbnails */}
      <rect x="4" y="4" width="112" height="70" rx="5" fill={bg} stroke={accent} strokeOpacity="0.32" strokeWidth="1" />

      {/* ENGAGEMENT */}
      {id === 'royal-emerald' && (
        <>
          <path d="M22 72 V34 C22 18 98 18 98 34 V72" fill="none" stroke={accent} strokeWidth="1.6" />
          <circle cx="60" cy="22" r="5" fill={accent} fillOpacity="0.25" stroke={accent} strokeWidth="1" />
          <path d="M48 25 L60 18 L72 25 M54 29 L60 22 L66 29" stroke={accent} strokeWidth="0.9" fill="none" />
          <line x1="36" y1="42" x2="84" y2="42" stroke={accent} strokeOpacity="0.5" strokeWidth="0.8" />
          <rect x="42" y="49" width="36" height="3.5" rx="1.7" fill={accent} />
          <rect x="48" y="56" width="24" height="2" rx="1" fill="#F4ECDE" fillOpacity="0.7" />
        </>
      )}

      {id === 'bougainvillea-fiesta' && (
        <>
          <circle cx="22" cy="18" r="8" fill="#D63E6C" fillOpacity="0.82" />
          <circle cx="34" cy="15" r="7" fill="#EC4899" fillOpacity="0.85" />
          <circle cx="88" cy="15" r="7" fill="#D63E6C" fillOpacity="0.85" />
          <circle cx="99" cy="19" r="8" fill="#F59E0B" fillOpacity="0.8" />
          <circle cx="60" cy="14" r="6" fill="#FB923C" fillOpacity="0.85" />
          <rect x="28" y="31" width="64" height="34" rx="4" fill="#FFFFFF" stroke="#D63E6C" strokeOpacity="0.35" />
          <rect x="42" y="43" width="36" height="3.5" rx="1.7" fill="#881337" />
          <rect x="48" y="50" width="24" height="2" rx="1" fill="#D63E6C" fillOpacity="0.65" />
        </>
      )}

      {(id === 'sage-blossom' || id === 'botanical') && (
        <>
          <path d="M18 68 C26 42 26 24 44 14" stroke={accent} strokeWidth="1.5" fill="none" />
          <ellipse cx="26" cy="40" rx="5" ry="2.5" transform="rotate(-30 26 40)" fill={accent} fillOpacity="0.7" />
          <ellipse cx="32" cy="27" rx="5" ry="2.5" transform="rotate(20 32 27)" fill={accent} fillOpacity="0.55" />
          <path d="M102 68 C94 42 94 24 76 14" stroke={accent} strokeWidth="1.5" fill="none" />
          <ellipse cx="94" cy="40" rx="5" ry="2.5" transform="rotate(30 94 40)" fill={accent} fillOpacity="0.7" />
          <circle cx="38" cy="19" r="3.5" fill="#FFFFFF" stroke={accent} strokeWidth="0.8" />
          <circle cx="82" cy="19" r="3.5" fill="#FFFFFF" stroke={accent} strokeWidth="0.8" />
          <rect x="40" y="38" width="40" height="3" rx="1.5" fill={strokeMain} />
          <rect x="48" y="45" width="24" height="2" rx="1" fill={accent} />
        </>
      )}

      {id === 'pastel-romance' && (
        <>
          <path d="M16 14 Q40 28 60 16 Q80 28 104 14" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="4" />
          <circle cx="28" cy="24" r="6" fill="#F9A8D4" fillOpacity="0.45" />
          <circle cx="92" cy="24" r="6" fill="#FBCFE8" fillOpacity="0.55" />
          <path d="M36 66 V36 C36 25 84 25 84 36 V66" fill="#FFFFFF" fillOpacity="0.8" stroke={accent} strokeWidth="1.2" />
          <rect x="44" y="44" width="32" height="3" rx="1.5" fill="#6D2847" />
          <rect x="50" y="51" width="20" height="2" rx="1" fill={accent} />
        </>
      )}

      {id === 'boho-garden' && (
        <>
          <path d="M30 68 L60 15 L90 68" fill="none" stroke="#9A5B36" strokeWidth="2.2" />
          <circle cx="48" cy="36" r="5" fill="#F59E0B" fillOpacity="0.8" />
          <circle cx="60" cy="17" r="5" fill="#EC4899" fillOpacity="0.75" />
          <circle cx="72" cy="36" r="5" fill="#FB923C" fillOpacity="0.78" />
          <rect x="44" y="47" width="32" height="3" rx="1.5" fill="#5A3320" />
          <rect x="50" y="54" width="20" height="2" rx="1" fill={accent} />
        </>
      )}

      {(id === 'golden-rooftop' || id === 'terrace-lights') && (
        <>
          <rect x="14" y="44" width="12" height="24" fill="#32264B" />
          <rect x="30" y="36" width="16" height="32" fill="#3E2F5B" />
          <rect x="50" y="40" width="18" height="28" fill="#2A1F42" />
          <rect x="72" y="32" width="14" height="36" fill="#3E2F5B" />
          <rect x="90" y="45" width="14" height="23" fill="#32264B" />
          <path d="M10 18 Q40 30 60 22 Q85 30 110 16" fill="none" stroke="#FDE68A" strokeWidth="0.9" />
          {[22, 38, 56, 74, 92].map((cx, idx) => (
            <circle key={idx} cx={cx} cy={idx % 2 === 0 ? 23 : 26} r="2.6" fill="#FBBF24" />
          ))}
        </>
      )}

      {id === 'solitaire' && (
        <>
          <circle cx="60" cy="33" r="13" fill="none" stroke={accent} strokeWidth="2.2" />
          <polygon points="60,12 68,20 60,25 52,20" fill="#FFFFFF" stroke={accent} strokeWidth="1.2" />
          <line x1="60" y1="8" x2="60" y2="11" stroke={accent} strokeWidth="1" />
          <line x1="46" y1="14" x2="49" y2="17" stroke={accent} strokeWidth="1" />
          <line x1="74" y1="14" x2="71" y2="17" stroke={accent} strokeWidth="1" />
          <rect x="40" y="54" width="40" height="3" rx="1.5" fill={strokeMain} />
          <rect x="49" y="60" width="22" height="2" rx="1" fill={accent} />
        </>
      )}

      {id === 'rose-orbit' && (
        <>
          <circle cx="53" cy="34" r="12" fill="none" stroke={accent} strokeWidth="2" />
          <circle cx="67" cy="34" r="12" fill="none" stroke="#C5A880" strokeWidth="2" />
          <ellipse cx="60" cy="34" rx="28" ry="8" fill="none" stroke={accent} strokeOpacity="0.4" strokeDasharray="2 2" />
          <rect x="38" y="54" width="44" height="3" rx="1.5" fill={strokeMain} />
        </>
      )}

      {id === 'sagai' && (
        <>
          <ellipse cx="60" cy="38" rx="22" ry="9" fill="#F6D58E" stroke="#B85D19" strokeWidth="1.4" />
          <path d="M52 34 Q60 22 68 34" fill="#E11D48" fillOpacity="0.82" />
          <circle cx="60" cy="24" r="4" fill="#F59E0B" />
          <rect x="38" y="55" width="44" height="3" rx="1.5" fill="#7C2D12" />
          <rect x="48" y="61" width="24" height="2" rx="1" fill="#B85D19" />
        </>
      )}

      {id === 'we-said-yes' && (
        <>
          <rect x="35" y="13" width="50" height="52" rx="3" fill="#FFFFFF" stroke="#E5DDD3" strokeWidth="1.2" />
          <rect x="41" y="18" width="38" height="30" rx="2" fill="#F3EAE3" />
          <circle cx="55" cy="33" r="6" fill={accent} fillOpacity="0.45" />
          <circle cx="65" cy="33" r="6" fill="#E11D48" fillOpacity="0.38" />
          <rect x="46" y="54" width="28" height="3" rx="1.5" fill={strokeMain} />
        </>
      )}

      {(id === 'depth-of-field' || id === 'darkroom' || id === 'cinematic') && (
        <>
          <rect x="14" y="12" width="92" height="54" rx="4" fill={id === 'darkroom' ? '#242424' : '#2E231D'} />
          <circle cx="60" cy="36" r="14" fill="none" stroke={accent} strokeWidth="1.3" strokeDasharray="4 2" />
          <circle cx="60" cy="36" r="5" fill={accent} fillOpacity="0.7" />
          <rect x="36" y="56" width="48" height="3" rx="1.5" fill="#FAF3E3" />
        </>
      )}

      {id === 'boarding-pass' && (
        <>
          <rect x="14" y="18" width="92" height="42" rx="4" fill="#FFFFFF" stroke="#1E3A5F" strokeWidth="1.2" />
          <rect x="14" y="18" width="92" height="10" rx="3" fill="#1E3A5F" />
          <line x1="80" y1="28" x2="80" y2="60" stroke="#94A3B8" strokeDasharray="2 2" />
          <rect x="22" y="36" width="16" height="4" rx="1" fill="#1E3A5F" />
          <rect x="52" y="36" width="16" height="4" rx="1" fill="#1E3A5F" />
          <path d="M40 38 L49 38 M46 35 L49 38 L46 41" stroke={accent} strokeWidth="1.4" fill="none" />
          <rect x="22" y="47" width="44" height="2" rx="1" fill="#94A3B8" />
        </>
      )}

      {(id === 'royal' || id === 'classic' || id === 'editorial' || id === 'storybook') && (
        <>
          <rect x="16" y="12" width="88" height="54" rx="3" fill="none" stroke={accent} strokeWidth="1.1" />
          <rect x="20" y="16" width="80" height="46" rx="2" fill="none" stroke={accent} strokeOpacity="0.45" strokeWidth="0.7" />
          <rect x="38" y="30" width="44" height="4.5" rx="2" fill={strokeMain} />
          <rect x="44" y="39" width="32" height="2.5" rx="1.2" fill={accent} />
          <rect x="36" y="47" width="48" height="2" rx="1" fill={strokeMain} fillOpacity="0.35" />
        </>
      )}

      {/* BIRTHDAY LAYOUTS */}
      {(id === 'playful' || id === 'magazine' || id === 'elegant') && (
        <>
          {id === 'playful' && (
            <>
              <ellipse cx="32" cy="28" rx="9" ry="11" fill="#EC4899" />
              <ellipse cx="88" cy="26" rx="9" ry="11" fill="#3B82F6" />
              <ellipse cx="60" cy="22" rx="10" ry="12" fill="#F59E0B" />
              <line x1="32" y1="39" x2="32" y2="54" stroke="#64748B" strokeWidth="0.8" />
              <line x1="88" y1="37" x2="88" y2="52" stroke="#64748B" strokeWidth="0.8" />
              <rect x="38" y="48" width="44" height="5" rx="2.5" fill={strokeMain} />
            </>
          )}
          {id === 'magazine' && (
            <>
              <rect x="18" y="11" width="84" height="56" rx="3" fill="#FFFFFF" stroke={accent} />
              <rect x="26" y="18" width="36" height="42" rx="2" fill="#F1E8DD" />
              <rect x="68" y="22" width="26" height="4" rx="1.5" fill={strokeMain} />
              <rect x="68" y="30" width="22" height="2.5" rx="1" fill={accent} />
              <rect x="68" y="37" width="26" height="2" rx="1" fill="#94A3B8" />
            </>
          )}
          {id === 'elegant' && (
            <>
              <line x1="60" y1="16" x2="60" y2="62" stroke={accent} strokeWidth="0.9" strokeDasharray="2 2" />
              <circle cx="60" cy="24" r="3.5" fill={accent} />
              <circle cx="60" cy="39" r="3.5" fill={accent} />
              <circle cx="60" cy="54" r="3.5" fill={accent} />
              <rect x="26" y="22" width="26" height="3" rx="1.5" fill={strokeMain} />
              <rect x="68" y="37" width="26" height="3" rx="1.5" fill={strokeMain} />
            </>
          )}
        </>
      )}

      {id === 'jungle-safari' && (
        <>
          <rect x="4" y="4" width="112" height="70" rx="5" fill="#E9F5E3" />
          <path d="M12 72 Q18 38 35 28" stroke="#2D6A4F" strokeWidth="4" fill="none" />
          <path d="M108 72 Q100 38 82 28" stroke="#2D6A4F" strokeWidth="4" fill="none" />
          <ellipse cx="22" cy="28" rx="11" ry="5" transform="rotate(-25 22 28)" fill="#40916C" />
          <ellipse cx="98" cy="28" rx="11" ry="5" transform="rotate(25 98 28)" fill="#52B788" />
          <circle cx="60" cy="36" r="13" fill="#F59E0B" />
          <circle cx="60" cy="36" r="9" fill="#FDE68A" />
          <circle cx="56.5" cy="34.5" r="1.4" fill="#291D0E" />
          <circle cx="63.5" cy="34.5" r="1.4" fill="#291D0E" />
        </>
      )}

      {id === 'dino-world' && (
        <>
          <rect x="4" y="4" width="112" height="70" rx="5" fill="#EDF7ED" />
          <polygon points="18,68 38,24 58,68" fill="#64748B" />
          <circle cx="38" cy="21" r="4" fill="#F97316" />
          <path d="M62 56 Q72 44 84 44 Q94 44 96 56 L96 68 L62 68 Z" fill="#16A34A" />
          <circle cx="64" cy="34" r="6" fill="#22C55E" />
          <rect x="62" y="34" width="5" height="22" fill="#22C55E" />
          <circle cx="62.5" cy="33" r="1.2" fill="#FFFFFF" />
        </>
      )}

      {id === 'outer-space' && (
        <>
          <rect x="4" y="4" width="112" height="70" rx="5" fill="#0B1026" />
          <circle cx="24" cy="22" r="1.3" fill="#FFFFFF" />
          <circle cx="92" cy="18" r="1.6" fill="#FDE68A" />
          <circle cx="42" cy="16" r="1" fill="#FFFFFF" />
          <circle cx="96" cy="54" r="1.4" fill="#38BDF8" />
          <circle cx="84" cy="36" r="8" fill="#A855F7" />
          <ellipse cx="84" cy="36" rx="14" ry="3.5" transform="rotate(-18 84 36)" fill="none" stroke="#FDE047" strokeWidth="1.5" />
          <polygon points="48,22 56,42 40,42" fill="#F8FAFC" />
          <polygon points="48,17 53,27 43,27" fill="#EF4444" />
          <polygon points="48,42 44,54 52,50" fill="#F59E0B" />
        </>
      )}

      {/* HOUSEWARMING & HOUSE PARTY */}
      {(id === 'griha-pravesh' || id === 'festive') && (
        <>
          <path d="M12 15 Q35 28 60 15 Q85 28 108 15" fill="none" stroke="#F59E0B" strokeWidth="3.5" />
          <circle cx="25" cy="20" r="3.5" fill="#EA580C" />
          <circle cx="60" cy="16" r="4" fill="#DC2626" />
          <circle cx="95" cy="20" r="3.5" fill="#EA580C" />
          <path d="M46 50 L74 50 L68 58 L52 58 Z" fill="#B45309" />
          <path d="M60 35 Q65 44 60 49 Q55 44 60 35 Z" fill="#FBBF24" />
          <rect x="38" y="62" width="44" height="3" rx="1.5" fill="#7C2D12" />
        </>
      )}

      {id === 'modern-apartment' && (
        <>
          <rect x="22" y="34" width="18" height="36" fill="#334155" />
          <rect x="44" y="18" width="32" height="52" fill="#1E293B" />
          <rect x="80" y="28" width="18" height="42" fill="#475569" />
          <rect x="50" y="25" width="7" height="5" fill="#FDE047" />
          <rect x="63" y="25" width="7" height="5" fill="#FDE047" />
          <rect x="50" y="36" width="7" height="5" fill="#94A3B8" />
          <rect x="63" y="36" width="7" height="5" fill="#FDE047" />
          <rect x="50" y="47" width="20" height="5" fill="#C59B5F" />
          <circle cx="90" cy="15" r="4.5" fill="#FDE68A" />
        </>
      )}

      {id === 'cozy-home' && (
        <>
          <polygon points="34,36 60,18 86,36" fill="#A8563A" />
          <rect x="40" y="36" width="40" height="30" fill="#FFFFFF" stroke="#A8563A" strokeWidth="1.2" />
          <rect x="54" y="46" width="12" height="20" rx="6" fill="#4A6B53" />
          <rect x="70" y="19" width="6" height="12" fill="#7C2D12" />
          <circle cx="75" cy="14" r="2.2" fill="#CBD5E1" />
          <circle cx="79" cy="10" r="2.6" fill="#E2E8F0" />
          <circle cx="26" cy="54" r="7" fill="#4A6B53" fillOpacity="0.85" />
          <circle cx="94" cy="56" r="6" fill="#65A30D" fillOpacity="0.85" />
        </>
      )}

      {id === 'blueprint' && (
        <>
          <line x1="4" y1="20" x2="116" y2="20" stroke="#7DD3FC" strokeOpacity="0.2" strokeWidth="0.7" />
          <line x1="4" y1="38" x2="116" y2="38" stroke="#7DD3FC" strokeOpacity="0.2" strokeWidth="0.7" />
          <line x1="4" y1="56" x2="116" y2="56" stroke="#7DD3FC" strokeOpacity="0.2" strokeWidth="0.7" />
          <line x1="36" y1="4" x2="36" y2="74" stroke="#7DD3FC" strokeOpacity="0.2" strokeWidth="0.7" />
          <line x1="84" y1="4" x2="84" y2="74" stroke="#7DD3FC" strokeOpacity="0.2" strokeWidth="0.7" />
          <polygon points="36,36 60,18 84,36" fill="none" stroke="#BAE6FD" strokeWidth="1.4" />
          <rect x="40" y="36" width="40" height="28" fill="none" stroke="#BAE6FD" strokeWidth="1.4" />
          <rect x="54" y="46" width="12" height="18" fill="none" stroke="#7DD3FC" strokeWidth="1" />
        </>
      )}

      {id === 'balloons-confetti' && (
        <>
          <ellipse cx="42" cy="28" rx="9" ry="11" fill="#E11D48" />
          <ellipse cx="60" cy="24" rx="10" ry="12" fill="#6366F1" />
          <ellipse cx="78" cy="29" rx="9" ry="11" fill="#F59E0B" />
          <circle cx="24" cy="52" r="2.2" fill="#10B981" />
          <circle cx="96" cy="48" r="2.4" fill="#EC4899" />
          <rect x="38" y="54" width="44" height="4" rx="2" fill={strokeMain} />
        </>
      )}

      {id === 'ivory-gold' && (
        <>
          <path d="M24 66 V28 C24 14 96 14 96 28 V66" fill="none" stroke={accent} strokeWidth="1.5" />
          <rect x="40" y="34" width="40" height="3.5" rx="1.7" fill="#4A3721" />
          <rect x="48" y="42" width="24" height="2" rx="1" fill={accent} />
        </>
      )}

      {id === 'diwali-night' && (
        <>
          <circle cx="30" cy="24" r="3" fill="#FBBF24" />
          <circle cx="88" cy="20" r="3.5" fill="#F472B6" />
          <line x1="88" y1="12" x2="88" y2="28" stroke="#FDE047" strokeWidth="0.9" />
          <line x1="80" y1="20" x2="96" y2="20" stroke="#FDE047" strokeWidth="0.9" />
          <path d="M46 52 L74 52 L68 60 L52 60 Z" fill="#F59E0B" />
          <path d="M60 36 Q66 46 60 51 Q54 46 60 36 Z" fill="#FEF08A" />
        </>
      )}

      {id === 'christmas-party' && (
        <>
          <polygon points="60,14 44,34 76,34" fill="#16A34A" />
          <polygon points="60,26 40,48 80,48" fill="#15803D" />
          <polygon points="60,38 36,60 84,60" fill="#166534" />
          <rect x="56" y="60" width="8" height="7" fill="#78350F" />
          <circle cx="60" cy="12" r="3" fill="#FACC15" />
          <circle cx="52" cy="40" r="2" fill="#EF4444" />
          <circle cx="68" cy="48" r="2" fill="#FDE047" />
          <circle cx="24" cy="22" r="1.4" fill="#FFFFFF" />
          <circle cx="96" cy="28" r="1.4" fill="#FFFFFF" />
        </>
      )}

      {id === 'new-years-eve' && (
        <>
          <circle cx="60" cy="35" r="16" fill="none" stroke="#D4AF37" strokeWidth="1.6" />
          <line x1="60" y1="35" x2="60" y2="23" stroke="#FDE68A" strokeWidth="1.6" />
          <line x1="60" y1="35" x2="68" y2="31" stroke="#FDE68A" strokeWidth="1.4" />
          <circle cx="24" cy="22" r="2" fill="#FDE047" />
          <circle cx="96" cy="24" r="2" fill="#FDE047" />
          <rect x="38" y="58" width="44" height="3" rx="1.5" fill="#D4AF37" />
        </>
      )}

      {id === 'disco-night' && (
        <>
          <line x1="60" y1="4" x2="60" y2="18" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="60" cy="30" r="13" fill="#CBD5E1" stroke="#EC4899" strokeWidth="1.2" />
          <line x1="48" y1="30" x2="72" y2="30" stroke="#475569" strokeWidth="0.7" />
          <line x1="60" y1="18" x2="60" y2="42" stroke="#475569" strokeWidth="0.7" />
          <line x1="16" y1="16" x2="48" y2="28" stroke="#38BDF8" strokeOpacity="0.6" strokeWidth="1.2" />
          <line x1="104" y1="18" x2="72" y2="29" stroke="#EC4899" strokeOpacity="0.6" strokeWidth="1.2" />
          <rect x="38" y="54" width="44" height="3.5" rx="1.7" fill="#F8FAFC" />
        </>
      )}

      {id === 'game-night' && (
        <>
          <rect x="30" y="22" width="22" height="22" rx="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
          <circle cx="36" cy="28" r="2" fill="#EF4444" />
          <circle cx="46" cy="38" r="2" fill="#EF4444" />
          <circle cx="41" cy="33" r="2" fill="#EF4444" />
          <rect x="64" y="18" width="24" height="32" rx="3" fill="#FEFCE8" stroke="#FACC15" strokeWidth="1.2" />
          <polygon points="76,26 82,34 76,42 70,34" fill="#DC2626" />
        </>
      )}

      {id === 'garden-brunch' && (
        <>
          <path d="M12 16 L28 24 L44 16 L60 24 L76 16 L92 24 L108 16" fill="none" stroke="#65A30D" strokeWidth="1.5" />
          <polygon points="20,19 28,24 34,17" fill="#F472B6" />
          <polygon points="52,19 60,24 68,19" fill="#FACC15" />
          <polygon points="84,19 92,24 100,19" fill="#60A5FA" />
          <circle cx="32" cy="48" r="7" fill="#FFFFFF" stroke="#65A30D" strokeWidth="1" />
          <circle cx="32" cy="48" r="2.5" fill="#FACC15" />
          <rect x="46" y="45" width="46" height="3.5" rx="1.7" fill="#243B29" />
        </>
      )}

      {id === 'movie-night' && (
        <>
          <path d="M10 8 Q26 36 16 70" fill="#991B1B" />
          <path d="M110 8 Q94 36 104 70" fill="#991B1B" />
          <rect x="30" y="20" width="60" height="34" rx="3" fill="#FEF9C3" stroke="#FACC15" strokeWidth="1.6" />
          <polygon points="55,29 69,37 55,45" fill="#DC2626" />
          <rect x="40" y="60" width="40" height="3" rx="1.5" fill="#FACC15" />
        </>
      )}

      {id === 'pool-party' && (
        <>
          <rect x="6" y="34" width="108" height="36" rx="4" fill="#22D3EE" fillOpacity="0.45" />
          <path d="M14 48 Q30 42 46 48 Q62 54 78 48 Q94 42 106 48" fill="none" stroke="#0284C7" strokeWidth="1.4" />
          <circle cx="60" cy="33" r="11" fill="#FFFFFF" stroke="#FB7185" strokeWidth="1.5" />
          <path d="M49 33 Q60 22 71 33" fill="#FB7185" fillOpacity="0.7" />
          <circle cx="24" cy="18" r="5.5" fill="#FACC15" />
        </>
      )}

      {id === 'eid-mubarak' && (
        <>
          <path d="M62 18 A13 13 0 1 0 74 37 A10 10 0 1 1 62 18 Z" fill="#D4AF37" />
          <circle cx="71" cy="24" r="2.2" fill="#FDE68A" />
          <line x1="30" y1="8" x2="30" y2="22" stroke="#D4AF37" strokeWidth="1" />
          <polygon points="30,22 36,30 34,42 26,42 24,30" fill="#F59E0B" fillOpacity="0.85" stroke="#D4AF37" strokeWidth="1" />
          <rect x="38" y="54" width="44" height="3" rx="1.5" fill="#FEF8E8" />
        </>
      )}

      {/* BABY SHOWER & ANNAPRASHAN */}
      {id === 'oh-baby' && (
        <>
          <ellipse cx="38" cy="28" rx="9" ry="11" fill="#F9A8D4" />
          <ellipse cx="60" cy="24" rx="10" ry="12" fill="#93C5FD" />
          <ellipse cx="82" cy="29" rx="9" ry="11" fill="#FDE68A" />
          <rect x="38" y="50" width="44" height="4" rx="2" fill="#5D3A4F" />
          <rect x="46" y="57" width="28" height="2" rx="1" fill="#E07AA4" />
        </>
      )}

      {id === 'twinkle-star' && (
        <>
          <path d="M58 14 A14 14 0 1 0 72 36 A11 11 0 1 1 58 14 Z" fill="#F4C95D" />
          <circle cx="30" cy="22" r="2.2" fill="#FDE68A" />
          <circle cx="90" cy="20" r="2.5" fill="#93C5FD" />
          <ellipse cx="42" cy="54" rx="15" ry="6" fill="#FFFFFF" fillOpacity="0.85" />
          <ellipse cx="78" cy="56" rx="16" ry="6" fill="#FFFFFF" fillOpacity="0.7" />
        </>
      )}

      {id === 'boho-rainbow' && (
        <>
          <path d="M32 52 A28 28 0 0 1 88 52" fill="none" stroke="#C97B5A" strokeWidth="4" />
          <path d="M39 52 A21 21 0 0 1 81 52" fill="none" stroke="#D9A97E" strokeWidth="4" />
          <path d="M46 52 A14 14 0 0 1 74 52" fill="none" stroke="#8B9D77" strokeWidth="4" />
          <rect x="42" y="58" width="36" height="3" rx="1.5" fill="#4C3325" />
        </>
      )}

      {id === 'woodland-friends' && (
        <>
          <circle cx="60" cy="36" r="13" fill="#C47D4E" />
          <circle cx="48" cy="24" r="4.5" fill="#C47D4E" />
          <circle cx="72" cy="24" r="4.5" fill="#C47D4E" />
          <ellipse cx="60" cy="40" rx="7" ry="5" fill="#F5E6D3" />
          <circle cx="56" cy="34" r="1.4" fill="#1F2937" />
          <circle cx="64" cy="34" r="1.4" fill="#1F2937" />
          <circle cx="60" cy="38.5" r="1.8" fill="#1F2937" />
        </>
      )}

      {id === 'godh-bharai' && (
        <>
          <path d="M16 14 Q40 24 60 15 Q80 24 104 14" fill="none" stroke="#D97706" strokeWidth="3.5" />
          <circle cx="46" cy="40" r="11" fill="none" stroke="#9F1239" strokeWidth="2.5" />
          <circle cx="54" cy="40" r="11" fill="none" stroke="#D97706" strokeWidth="2.5" />
          <circle cx="62" cy="40" r="11" fill="none" stroke="#16A34A" strokeWidth="2.5" />
          <circle cx="72" cy="40" r="11" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
        </>
      )}

      {/* HOLY COMMUNION */}
      {id === 'white-gold' && (
        <>
          <path d="M30 66 V28 C30 15 90 15 90 28 V66" fill="none" stroke="#C8A055" strokeWidth="1.4" />
          <circle cx="60" cy="26" r="5" fill="#FFFDF7" stroke="#C8A055" strokeWidth="1.2" />
          <path d="M51 34 H69 L65 44 H55 Z" fill="#C8A055" />
          <rect x="58" y="44" width="4" height="10" fill="#C8A055" />
          <rect x="52" y="54" width="16" height="3" rx="1" fill="#C8A055" />
        </>
      )}

      {id === 'stained-glass' && (
        <>
          <circle cx="60" cy="38" r="22" fill="none" stroke="#F4C95D" strokeWidth="1.6" />
          <path d="M60 16 L60 60 M38 38 L82 38 M44 22 L76 54 M76 22 L44 54" stroke="#F4C95D" strokeWidth="1" />
          <circle cx="60" cy="38" r="8" fill="#38BDF8" fillOpacity="0.65" stroke="#F4C95D" strokeWidth="1.2" />
          <circle cx="60" cy="24" r="4" fill="#E11D48" fillOpacity="0.7" />
          <circle cx="60" cy="52" r="4" fill="#10B981" fillOpacity="0.7" />
        </>
      )}

      {id === 'lilies-doves' && (
        <>
          <path d="M40 36 Q52 22 68 30 Q62 42 40 36 Z" fill="#FFFFFF" stroke="#6B8E6E" strokeWidth="1.1" />
          <ellipse cx="32" cy="50" rx="6" ry="3" transform="rotate(-25 32 50)" fill="#84A98C" />
          <ellipse cx="88" cy="50" rx="6" ry="3" transform="rotate(25 88 50)" fill="#84A98C" />
          <rect x="40" y="56" width="40" height="3" rx="1.5" fill="#243528" />
        </>
      )}

      {id === 'heavenly-skies' && (
        <>
          <circle cx="60" cy="24" r="8" fill="#FDE047" />
          <ellipse cx="44" cy="46" rx="16" ry="8" fill="#FFFFFF" />
          <ellipse cx="74" cy="48" rx="18" ry="8" fill="#FFFFFF" />
          <line x1="60" y1="34" x2="60" y2="56" stroke="#3B82F6" strokeOpacity="0.4" strokeWidth="1.5" />
          <line x1="53" y1="42" x2="67" y2="42" stroke="#3B82F6" strokeOpacity="0.4" strokeWidth="1.5" />
        </>
      )}

      {id === 'rosary-lace' && (
        <>
          <path d="M20 20 Q60 44 100 20" fill="none" stroke="#C88EA7" strokeWidth="2.5" strokeDasharray="3 3" />
          <line x1="60" y1="32" x2="60" y2="54" stroke="#D4AF37" strokeWidth="1.8" />
          <line x1="54" y1="40" x2="66" y2="40" stroke="#D4AF37" strokeWidth="1.8" />
          <rect x="38" y="60" width="44" height="3" rx="1.5" fill="#3F232C" />
        </>
      )}

      {/* Subtle occasion tag pill if no special art */}
      {!occasionId && null}
    </svg>
  );
}
