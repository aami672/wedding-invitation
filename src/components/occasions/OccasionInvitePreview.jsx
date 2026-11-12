import React, { useEffect, useState } from 'react';
import { resolveAssetUrl } from '../../utils/appAssets';
import { resolveOccasionVisuals, formatReadableDate } from '../../utils/occasionVisuals';
import OccasionReveals from './OccasionReveals';
import OccasionThemeThumb from './OccasionThemeThumb';

export function OccasionWhatsAppPreview({ data, publishedUrl }) {
  const { theme, primaryTitle } = resolveOccasionVisuals(data);
  const hosts = data?.hosts || {};
  const occLabel = (data?.occasion || 'celebration').replace(/-/g, ' ');
  const description = hosts.welcomeQuote || `You're warmly invited to celebrate ${primaryTitle}. Open to view details & RSVP.`;
  const cleanUrl = publishedUrl || `https://aami672.github.io/wedding-invitation/published/${data?.customSlug || 'invitation'}.html`;

  return (
    <div className="w-full h-full flex items-center justify-center p-5 bg-[#E5DDD5] dark:bg-[#0B141A]">
      <div className="w-full max-w-[330px] rounded-2xl bg-[#DCF8C6] text-[#111B21] p-2.5 shadow-lg border border-black/10">
        <div className="rounded-xl overflow-hidden bg-white border border-black/10">
          {data?.photos?.cover ? (
            <img
              src={resolveAssetUrl(data.photos.cover)}
              alt={primaryTitle}
              className="w-full h-36 object-cover"
            />
          ) : (
            <div className="w-full h-36">
              <OccasionThemeThumb theme={theme} occasionId={data?.occasion} />
            </div>
          )}
          <div className="p-3 bg-[#F7F8FA] border-t border-black/5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              Paigaam · {occLabel}
            </p>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">{primaryTitle}</h4>
            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{description}</p>
            <p className="text-[10px] text-slate-400 mt-1.5 truncate">{cleanUrl}</p>
          </div>
        </div>
        <div className="mt-2 px-1 flex items-center justify-between text-[11px] text-slate-700">
          <span>Tap to open invitation & RSVP ✨</span>
          <span className="text-[10px] text-slate-500">10:30 AM ✓✓</span>
        </div>
      </div>
    </div>
  );
}

export default function OccasionInvitePreview({
  data,
  replayKey = 0,
  isStandalone = false,
  onPickedFuture,
}) {
  const {
    theme,
    matchedTemplate,
    headingFont,
    sectionFont,
    bodyFont,
    sacramentMeta,
    primaryTitle,
  } = resolveOccasionVisuals(data);

  const hosts = data?.hosts || {};
  const occ = data?.occasion || 'engagement';
  const events = Array.isArray(data?.events) ? data.events : [];
  const gallery = Array.isArray(data?.gallery) ? data.gallery : [];

  const [revealed, setRevealed] = useState(data?.revealStyle === 'none');
  const [revealMeta, setRevealMeta] = useState({});
  const [pollVotes, setPollVotes] = useState({ pink: 14, blue: 12, choice: null });
  const [pickedFuture, setPickedFuture] = useState(null);
  const [rsvpState, setRsvpState] = useState({
    name: '',
    attending: 'yes',
    guests: 2,
    note: '',
    submitted: false,
  });

  useEffect(() => {
    setRevealed(data?.revealStyle === 'none');
    setRevealMeta({});
  }, [replayKey, data?.revealStyle, occ]);

  const effectiveFuture = revealMeta.pickedFuture || pickedFuture;

  const isEditorial = ['editorial', 'classic', 'elegant', 'modern-apartment', 'blueprint'].includes(data?.template);
  const darkSurfaceBorder = theme.dark ? 'rgba(255,255,255,0.12)' : 'rgba(20,16,12,0.10)';

  const handleVote = (team) => {
    if (pollVotes.choice === team) return;
    setPollVotes((prev) => ({
      pink: team === 'pink' ? prev.pink + 1 : prev.choice === 'pink' ? prev.pink - 1 : prev.pink,
      blue: team === 'blue' ? prev.blue + 1 : prev.choice === 'blue' ? prev.blue - 1 : prev.blue,
      choice: team,
    }));
  };

  const totalPoll = Math.max(1, pollVotes.pink + pollVotes.blue);
  const pinkPct = Math.round((pollVotes.pink / totalPoll) * 100);

  return (
    <div
      className="occ-inv-root relative w-full h-full overflow-y-auto overflow-x-hidden"
      style={{
        background: theme.bg,
        color: theme.text,
        fontFamily: bodyFont,
      }}
    >
      {/* Interactive Opening Reveal Overlay */}
      {!revealed && data?.revealStyle !== 'none' && (
        <OccasionReveals
          data={data}
          theme={theme}
          onComplete={(meta = {}) => {
            setRevealMeta(meta);
            if (meta.pickedFuture) setPickedFuture(meta.pickedFuture);
            setRevealed(true);
          }}
        />
      )}

      {/* Invitation Card Flow (hidden while Reveal Curtain is active so nothing bleeds through) */}
      {(revealed || !data?.revealStyle || data?.revealStyle === 'none') && (
      <div className={isStandalone ? 'max-w-[540px] mx-auto pb-14' : 'pb-12'}>
        {/* Top Illustrated Banner or Cover Photo */}
        <div className="relative overflow-hidden" style={{ background: theme.surface }}>
          {data?.photos?.cover ? (
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={resolveAssetUrl(data.photos.cover)}
                alt={primaryTitle}
                className="w-full h-full object-cover"
                style={{
                  filter: data?.template === 'darkroom' ? 'grayscale(0.35) contrast(1.06)' : 'none',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${theme.bg} 4%, transparent 65%)`,
                }}
              />
            </div>
          ) : (
            <div className="w-full aspect-[16/10] border-b" style={{ borderColor: darkSurfaceBorder }}>
              <OccasionThemeThumb theme={matchedTemplate || theme} occasionId={occ} />
            </div>
          )}

          {/* Optional Floating Housewarming Flat Watermark */}
          {(occ === 'housewarming' || occ === 'house-party') && hosts.flatNo && (
            <div
              className="absolute top-7 right-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.18em] uppercase shadow"
              style={{ background: theme.surface, color: theme.accent, border: `1px solid ${darkSurfaceBorder}` }}
            >
              Flat {hosts.flatNo} · Fl {hosts.floor || '1'}
            </div>
          )}

          {/* Birthday Age Badge Pill */}
          {occ === 'birthday' && hosts.ageBadge && (
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-[0.16em] shadow-md"
              style={{ background: theme.accent, color: theme.dark ? '#111' : '#FFF' }}
            >
              🎂 {hosts.ageBadge}
            </div>
          )}
        </div>

        {/* Hero Heading & Identity */}
        <div className="px-6 pt-6 pb-5 text-center">
          {hosts.title && (
            <p
              className="text-[10.5px] font-bold uppercase tracking-[0.24em]"
              style={{ color: theme.accent }}
            >
              {hosts.title}
            </p>
          )}

          {data?.showMonogram && data?.monogram?.initials && (
            <div
              className="mx-auto mt-3 w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold tracking-widest border"
              style={{ borderColor: theme.accent, color: theme.accent }}
            >
              {data.monogram.initials}
            </div>
          )}

          {sacramentMeta && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.18em]" style={{ borderColor: `${theme.accent}66`, color: theme.accent }}>
              <span>{sacramentMeta.id === 'baptism' ? '🐚' : sacramentMeta.id === 'confirmation' ? '🕊️' : '✝️'}</span>
              <span>{sacramentMeta.name}</span>
            </div>
          )}

          <h1
            className="mt-3 text-3xl sm:text-4xl font-bold leading-tight tracking-tight"
            style={{ fontFamily: headingFont, color: theme.text }}
          >
            {primaryTitle}
          </h1>

          {/* Secondary Host / Parents / Sibling Lines */}
          {occ === 'engagement' && (hosts.groomParents || hosts.brideParents) && (
            <div className="mt-2.5 text-[11px] space-y-0.5" style={{ color: theme.muted }}>
              {hosts.brideParents && <p>{hosts.brideParents}</p>}
              {hosts.groomParents && <p>{hosts.groomParents}</p>}
            </div>
          )}

          {hosts.invitedBy && (
            <p className="mt-2 text-xs font-medium" style={{ color: theme.muted }}>{hosts.invitedBy}</p>
          )}
          {hosts.godparents && (
            <p className="mt-1 text-[11px]" style={{ color: theme.accent }}>{hosts.godparents}</p>
          )}
          {hosts.hostedBy && (
            <p className="mt-2 text-xs" style={{ color: theme.muted }}>{hosts.hostedBy}</p>
          )}
          {hosts.dueDateLine && (
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: theme.accent }}>
              ✨ {hosts.dueDateLine}
            </p>
          )}
          {hosts.siblingName && (
            <p className="mt-1 text-[11px]" style={{ color: theme.muted }}>Proud elder sibling: {hosts.siblingName}</p>
          )}

          {/* Key Date & Venue Pill */}
          <div
            className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl border text-[11px] font-semibold"
            style={{
              background: theme.surface,
              borderColor: darkSurfaceBorder,
              color: theme.text,
            }}
          >
            <span>📅 {formatReadableDate(hosts.date)}</span>
            {hosts.city && <span style={{ color: theme.accent }}>• {hosts.city}</span>}
          </div>

          {/* Warm Story / Welcome Quote */}
          {hosts.welcomeQuote && (
            <div
              className={`mt-5 p-4 text-xs leading-relaxed ${isEditorial ? 'border-y' : 'rounded-2xl border shadow-sm'}`}
              style={{
                background: isEditorial ? 'transparent' : theme.surface,
                borderColor: darkSurfaceBorder,
                color: theme.muted,
              }}
            >
              “{hosts.welcomeQuote}”
            </div>
          )}

          {/* Holy Communion Bible Verse Card */}
          {hosts.bibleVerse && (
            <div
              className="mt-4 p-4 rounded-2xl border text-center"
              style={{ background: `${theme.accent}12`, borderColor: `${theme.accent}44` }}
            >
              <p className="text-[11px] italic font-medium" style={{ color: theme.text }}>
                {hosts.bibleVerse}
              </p>
            </div>
          )}

          {/* House Party Menu / Music Highlights */}
          {occ === 'house-party' && hosts.menuHighlights && (
            <div
              className="mt-4 p-3.5 rounded-2xl border text-left"
              style={{ background: theme.surface, borderColor: darkSurfaceBorder }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.accent }}>
                🍸 On The Menu & Playlist
              </p>
              <p className="mt-1 text-xs" style={{ color: theme.text }}>{hosts.menuHighlights}</p>
            </div>
          )}

          {/* Birthday Dress Code Highlight */}
          {occ === 'birthday' && hosts.dressCode && (
            <div
              className="mt-4 p-3 rounded-2xl border text-xs"
              style={{ background: theme.surface, borderColor: darkSurfaceBorder }}
            >
              <span className="font-bold uppercase tracking-widest text-[10px]" style={{ color: theme.accent }}>Dress Code: </span>
              <span>{hosts.dressCode}</span>
            </div>
          )}
        </div>

        {/* Baby Shower Interactive Team Pink vs Team Blue Poll */}
        {occ === 'baby-shower' && data?.enableGenderPoll !== false && (
          <div className="px-6 mb-5">
            <div className="p-4 rounded-2xl border shadow-sm" style={{ background: theme.surface, borderColor: darkSurfaceBorder }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center" style={{ color: theme.accent }}>
                Fun Guess Poll
              </p>
              <h3 className="text-sm font-bold text-center mt-1" style={{ fontFamily: sectionFont }}>
                Team Pink or Team Blue?
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleVote('pink')}
                  className="py-2 rounded-xl border text-xs font-bold cursor-pointer transition"
                  style={{
                    background: pollVotes.choice === 'pink' ? '#F472B6' : '#FDF2F8',
                    color: pollVotes.choice === 'pink' ? '#FFF' : '#9D174D',
                    borderColor: '#F9A8D4',
                  }}
                >
                  💗 Team Pink ({pinkPct}%)
                </button>
                <button
                  type="button"
                  onClick={() => handleVote('blue')}
                  className="py-2 rounded-xl border text-xs font-bold cursor-pointer transition"
                  style={{
                    background: pollVotes.choice === 'blue' ? '#3B82F6' : '#EFF6FF',
                    color: pollVotes.choice === 'blue' ? '#FFF' : '#1E40AF',
                    borderColor: '#93C5FD',
                  }}
                >
                  💙 Team Blue ({100 - pinkPct}%)
                </button>
              </div>
              <div className="mt-2.5 h-2 rounded-full overflow-hidden bg-slate-200 flex">
                <div className="h-full bg-pink-400 transition-all duration-300" style={{ width: `${pinkPct}%` }} />
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${100 - pinkPct}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Annaprashan Pick-the-Future Interactive Tray inside Card */}
        {occ === 'annaprashan' && (
          <div className="px-6 mb-5">
            <div className="p-4 rounded-2xl border shadow-sm text-center" style={{ background: theme.surface, borderColor: darkSurfaceBorder }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.accent }}>
                Annaprashan Tradition
              </p>
              <h3 className="text-sm font-bold mt-1" style={{ fontFamily: sectionFont }}>
                {effectiveFuture ? `You predicted: ${effectiveFuture}!` : 'Guess What Little One Picks First'}
              </h3>
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {[
                  { id: 'Wisdom', icon: '📖' },
                  { id: 'Scholar', icon: '✒️' },
                  { id: 'Fortune', icon: '🪙' },
                  { id: 'Roots', icon: '🏺' },
                  { id: 'Grace', icon: '🪷' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setPickedFuture(opt.id);
                      onPickedFuture?.(opt.id);
                    }}
                    className="py-2 rounded-xl border flex flex-col items-center text-[10px] font-bold cursor-pointer transition"
                    style={{
                      background: effectiveFuture === opt.id ? theme.accent : 'transparent',
                      color: effectiveFuture === opt.id ? (theme.dark ? '#111' : '#FFF') : theme.text,
                      borderColor: darkSurfaceBorder,
                    }}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <span className="mt-0.5">{opt.id}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Celebrations / Schedule */}
        {events.length > 0 && (
          <div className="px-6 mb-5">
            <div className="text-center mb-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: theme.accent }}>
                Celebration Itinerary
              </p>
              <h2 className="text-lg font-bold mt-0.5" style={{ fontFamily: sectionFont }}>
                When & Where
              </h2>
            </div>

            <div className="space-y-3">
              {events.map((ev, idx) => (
                <div
                  key={ev.id || idx}
                  className="p-4 rounded-2xl border shadow-sm"
                  style={{ background: theme.surface, borderColor: darkSurfaceBorder }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: theme.text }}>{ev.name}</h3>
                      <p className="text-[11px] font-semibold mt-0.5" style={{ color: theme.accent }}>
                        {ev.date} · {ev.time}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs mt-2 font-medium" style={{ color: theme.text }}>{ev.venue}</p>
                  {ev.address && (
                    <p className="text-[11px] mt-0.5" style={{ color: theme.muted }}>{ev.address}</p>
                  )}
                  {ev.dressCode && (
                    <p className="text-[10.5px] mt-1.5" style={{ color: theme.muted }}>
                      <strong style={{ color: theme.text }}>Attire:</strong> {ev.dressCode}
                    </p>
                  )}
                  {(ev.venue || ev.address) && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ev.venue || ''} ${ev.address || ''}`.trim())}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider underline underline-offset-4"
                      style={{ color: theme.accent }}
                    >
                      📍 View Map Directions
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {gallery.length > 0 && (
          <div className="px-6 mb-5">
            <h2 className="text-center text-base font-bold mb-3" style={{ fontFamily: sectionFont }}>
              Moments Together
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {gallery.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border"
                  style={{ background: theme.surface, borderColor: darkSurfaceBorder }}
                >
                  <img
                    src={resolveAssetUrl(item.url)}
                    alt={item.caption || `Moment ${idx + 1}`}
                    className="w-full h-28 object-cover"
                  />
                  {item.caption && (
                    <p className="px-2 py-1.5 text-[10px] font-medium truncate" style={{ color: theme.muted }}>
                      {item.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Logistics & Travel */}
        {occ === 'engagement' && (data?.logistics?.hotel || data?.logistics?.transport || data?.logistics?.contact) && (
          <div className="px-6 mb-5">
            <div className="p-4 rounded-2xl border text-xs space-y-1.5" style={{ background: theme.surface, borderColor: darkSurfaceBorder }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.accent }}>
                Travel & Stay
              </p>
              {data.logistics.hotel && <p><strong>Stay:</strong> {data.logistics.hotel}</p>}
              {data.logistics.transport && <p><strong>Arrivals:</strong> {data.logistics.transport}</p>}
              {data.logistics.contact && <p><strong>Host Desk:</strong> {data.logistics.contact}</p>}
            </div>
          </div>
        )}

        {/* RSVP Block */}
        {data?.rsvpConfig?.enabled !== false && (
          <div className="px-6 mb-6">
            <div className="p-5 rounded-2xl border shadow-sm" style={{ background: theme.surface, borderColor: darkSurfaceBorder }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-center" style={{ color: theme.accent }}>
                RSVP
              </p>
              <h2 className="text-base font-bold text-center mt-0.5" style={{ fontFamily: sectionFont }}>
                Will You Be Joining Us?
              </h2>
              {data?.rsvpConfig?.deadline && (
                <p className="text-[11px] text-center mt-1" style={{ color: theme.muted }}>
                  {data.rsvpConfig.deadline}
                </p>
              )}

              {rsvpState.submitted ? (
                <div className="mt-4 p-4 rounded-xl border text-center" style={{ borderColor: `${theme.accent}66`, background: `${theme.accent}14` }}>
                  <p className="text-sm font-bold">Thank you, {rsvpState.name || 'Friend'}!</p>
                  <p className="text-xs mt-1" style={{ color: theme.muted }}>
                    Your response ({rsvpState.attending === 'yes' ? `Attending · ${rsvpState.guests} guest(s)` : 'Sending warm wishes'}) is recorded.
                  </p>
                  <button
                    type="button"
                    onClick={() => setRsvpState(s => ({ ...s, submitted: false }))}
                    className="mt-2.5 text-[10px] font-bold uppercase tracking-widest underline cursor-pointer"
                    style={{ color: theme.accent }}
                  >
                    Edit Response
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setRsvpState(s => ({ ...s, submitted: true }));
                  }}
                  className="mt-4 space-y-2.5"
                >
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={rsvpState.name}
                    onChange={(e) => setRsvpState(s => ({ ...s, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none bg-transparent"
                    style={{ borderColor: darkSurfaceBorder, color: theme.text }}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpState(s => ({ ...s, attending: 'yes' }))}
                      className="py-2 rounded-xl border text-xs font-bold cursor-pointer"
                      style={{
                        background: rsvpState.attending === 'yes' ? theme.accent : 'transparent',
                        color: rsvpState.attending === 'yes' ? (theme.dark ? '#111' : '#FFF') : theme.text,
                        borderColor: darkSurfaceBorder,
                      }}
                    >
                      ✓ Joyfully Accepts
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpState(s => ({ ...s, attending: 'no' }))}
                      className="py-2 rounded-xl border text-xs font-bold cursor-pointer"
                      style={{
                        background: rsvpState.attending === 'no' ? theme.accent : 'transparent',
                        color: rsvpState.attending === 'no' ? (theme.dark ? '#111' : '#FFF') : theme.text,
                        borderColor: darkSurfaceBorder,
                      }}
                    >
                      Regretfully Declines
                    </button>
                  </div>
                  {rsvpState.attending === 'yes' && (
                    <select
                      value={rsvpState.guests}
                      onChange={(e) => setRsvpState(s => ({ ...s, guests: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{ background: theme.bg, borderColor: darkSurfaceBorder, color: theme.text }}
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  )}
                  <input
                    type="text"
                    placeholder={data?.rsvpConfig?.askDietary ? 'Dietary note or warm message' : 'Short blessing or note'}
                    value={rsvpState.note}
                    onChange={(e) => setRsvpState(s => ({ ...s, note: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none bg-transparent"
                    style={{ borderColor: darkSurfaceBorder, color: theme.text }}
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.18em] cursor-pointer shadow"
                    style={{
                      background: theme.accent,
                      color: theme.dark ? '#111' : '#FFF',
                    }}
                  >
                    Confirm RSVP
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Footer Signature */}
        <footer className="px-6 pt-3 pb-6 text-center text-[10px] uppercase tracking-[0.2em]" style={{ color: theme.muted }}>
          <p>{hosts.hashtag ? `${hosts.hashtag} · ` : ''}Paigaam Digital Invitation</p>
        </footer>
      </div>
      )}
    </div>
  );
}
