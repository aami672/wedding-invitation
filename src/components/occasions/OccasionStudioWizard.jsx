import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Palette,
  Music,
  Type,
  FileText,
  Calendar,
  Image as ImageIcon,
  Send,
  Download,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Users,
  ArrowLeft,
  Play,
  Square,
  Share2,
  Globe,
  FolderOpen,
} from 'lucide-react';
import {
  OCCASION_PALETTES,
  ENGAGEMENT_TEMPLATES,
  ENGAGEMENT_REVEALS,
  BIRTHDAY_STARTING_STYLES,
  BIRTHDAY_LAYOUTS,
  BIRTHDAY_COLOR_THEMES,
  BIRTHDAY_REVEALS,
  BIRTHDAY_BALLOON_STYLES,
  BIRTHDAY_FONTS,
  HOUSEWARMING_THEMES,
  HOUSEWARMING_REVEALS,
  HOUSE_PARTY_THEMES,
  HOUSE_PARTY_REVEALS,
  BABY_THEMES,
  BABY_SHOWER_OPENINGS,
  ANNAPRASHAN_OPENINGS,
  HOLY_COMMUNION_SACRAMENTS,
  HOLY_COMMUNION_OPENINGS,
  HOLY_COMMUNION_THEMES,
  OCCASION_MUSIC_TRACKS,
  createOccasionClientTemplate,
} from '../../data/occasionStudios';
import { OCCASIONS } from '../../data/presets';
import {
  computeCoupleSlug,
  saveClientFull,
  listSavedClients,
  getSavedClient,
  removeSavedClient,
  setActiveClientSlug,
} from '../../utils/clientStore';
import { getOccasionUrl, resolveAssetUrl, resolvePublishedUrl } from '../../utils/appAssets';
import { publishStandaloneToGitHub } from '../../utils/githubPublish';
import { soundManager } from '../../utils/audio';
import { buildOccasionStandaloneHtml, openOccasionPdfPrintWindow } from '../../utils/occasionHtmlExporter';
import OccasionInvitePreview, { OccasionWhatsAppPreview } from './OccasionInvitePreview';
import OccasionThemeThumb from './OccasionThemeThumb';

const GITHUB_TOKEN_STORAGE_KEY = 'wishlys_github_token';

const OCCASION_META_LOOKUP = {
  engagement: { title: 'Engagement Studio', badge: 'Ring Ceremony & Soirée' },
  birthday: { title: 'Birthday Studio', badge: 'Kids, Teen & Milestone Parties' },
  housewarming: { title: 'Housewarming Studio', badge: 'Griha Pravesh & New Home' },
  'house-party': { title: 'House Party Studio', badge: 'Diwali, NYE, Disco & Soirées' },
  'baby-shower': { title: 'Baby Shower Studio', badge: 'Godh Bharai & Oh Baby' },
  annaprashan: { title: 'Annaprashan Studio', badge: 'Mukhe Bhaat & First Rice' },
  'holy-communion': { title: 'Sacraments Studio', badge: 'Communion, Baptism & Confirmation' },
};

function getThemeCatalogForOccasion(occ) {
  if (occ === 'engagement') return ENGAGEMENT_TEMPLATES;
  if (occ === 'birthday') return BIRTHDAY_LAYOUTS;
  if (occ === 'housewarming') return HOUSEWARMING_THEMES;
  if (occ === 'house-party') return HOUSE_PARTY_THEMES;
  if (occ === 'baby-shower' || occ === 'annaprashan') return BABY_THEMES;
  if (occ === 'holy-communion') return HOLY_COMMUNION_THEMES;
  return ENGAGEMENT_TEMPLATES;
}

function getRevealCatalogForOccasion(occ) {
  if (occ === 'engagement') return ENGAGEMENT_REVEALS;
  if (occ === 'birthday') return BIRTHDAY_REVEALS;
  if (occ === 'housewarming') return HOUSEWARMING_REVEALS;
  if (occ === 'house-party') return HOUSE_PARTY_REVEALS;
  if (occ === 'baby-shower') return BABY_SHOWER_OPENINGS;
  if (occ === 'annaprashan') return ANNAPRASHAN_OPENINGS;
  if (occ === 'holy-communion') return HOLY_COMMUNION_OPENINGS;
  return ENGAGEMENT_REVEALS;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function OccasionStudioWizard({
  occasionId = 'engagement',
  initialData,
  onSave,
  onExitToHome,
}) {
  const [data, setData] = useState(() => {
    if (initialData && initialData.occasion === occasionId) return initialData;
    return createOccasionClientTemplate(occasionId);
  });
  const [activeTab, setActiveTab] = useState('design'); // 'design' | 'content' | 'publish'
  const [previewTab, setPreviewTab] = useState('invite'); // 'invite' | 'whatsapp'
  const [mobilePane, setMobilePane] = useState('editor'); // 'editor' | 'preview'
  const [replayKey, setReplayKey] = useState(0);
  const [playingTrackId, setPlayingTrackId] = useState('');
  const [savedClients, setSavedClients] = useState(() => listSavedClients());
  const [showClientsModal, setShowClientsModal] = useState(false);
  const [statusToast, setStatusToast] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [githubToken, setGithubToken] = useState(() => {
    try { return localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY) || ''; } catch { return ''; }
  });
  const [isPublishing, setIsPublishing] = useState(false);

  const occ = data?.occasion || occasionId;
  const occMeta = OCCASION_META_LOOKUP[occ] || { title: 'Paigaam Studio', badge: 'Digital Invitation' };
  const themeCatalog = getThemeCatalogForOccasion(occ);
  const revealCatalog = getRevealCatalogForOccasion(occ);
  const tracks = OCCASION_MUSIC_TRACKS[occ] || OCCASION_MUSIC_TRACKS.engagement;

  const activeSlug = computeCoupleSlug(data?.hosts, data?.customSlug);
  const publishedUrl = resolvePublishedUrl(activeSlug);

  useEffect(() => {
    if (initialData && initialData.occasion === occasionId) {
      setData(initialData);
    } else {
      setData(createOccasionClientTemplate(occasionId));
    }
    setReplayKey((k) => k + 1);
  }, [occasionId, initialData]);

  useEffect(() => {
    return () => {
      try { soundManager.stop(); } catch {}
    };
  }, []);

  const flashStatus = (msg) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(''), 3200);
  };

  const commitChange = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        saveClientFull(next, { setActive: true });
      } catch {
        // ignore storage restrictions
      }
      onSave?.(next);
      return next;
    });
  };

  const updateHost = (field, value) => {
    commitChange((prev) => ({
      ...prev,
      hosts: { ...(prev.hosts || {}), [field]: value },
    }));
  };

  const updateEvent = (index, field, value) => {
    commitChange((prev) => {
      const events = [...(prev.events || [])];
      events[index] = { ...(events[index] || {}), [field]: value };
      return { ...prev, events };
    });
  };

  const addEvent = () => {
    commitChange((prev) => ({
      ...prev,
      events: [
        ...(prev.events || []),
        {
          id: `ev-${Date.now()}`,
          name: 'Celebration Gathering',
          date: prev.hosts?.date || '2026-12-27',
          time: '07:00 PM onwards',
          venue: prev.hosts?.venue || 'Main Venue',
          address: prev.hosts?.city || '',
          dressCode: '',
        },
      ],
    }));
  };

  const removeEvent = (idx) => {
    commitChange((prev) => ({
      ...prev,
      events: (prev.events || []).filter((_, i) => i !== idx),
    }));
  };

  const applyBirthdayStartingStyle = (styleId) => {
    const preset = createOccasionClientTemplate('birthday', styleId);
    commitChange((prev) => ({
      ...preset,
      customSlug: prev.customSlug && prev.customSlug !== 'aarav-birthday' && prev.customSlug !== 'ananya-sweet-16' && prev.customSlug !== 'rajesh-50th-milestone'
        ? prev.customSlug
        : preset.customSlug,
    }));
    setReplayKey((k) => k + 1);
    flashStatus(`Switched Birthday style to ${BIRTHDAY_STARTING_STYLES.find(s => s.id === styleId)?.title}`);
  };

  const applySacrament = (sacId) => {
    const meta = HOLY_COMMUNION_SACRAMENTS.find(s => s.id === sacId) || HOLY_COMMUNION_SACRAMENTS[0];
    commitChange((prev) => ({
      ...prev,
      sacrament: sacId,
      customSlug: `${(prev.hosts?.bride || 'aanya').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${sacId}`,
      hosts: {
        ...(prev.hosts || {}),
        title: meta.headerBlessing,
        bibleVerse: meta.verse,
        revealEyebrow: meta.badgeLabel,
      },
      events: (prev.events || []).map((ev, i) => (i === 0 ? { ...ev, name: meta.event1 } : ev)),
    }));
    setReplayKey((k) => k + 1);
  };

  const handleToggleMusic = (track) => {
    if (playingTrackId === track.id) {
      soundManager.stop();
      setPlayingTrackId('');
      return;
    }
    const url = resolveAssetUrl(track.fallbackUrl || track.url);
    soundManager.playTrack(track.id, url);
    setPlayingTrackId(track.id);
    commitChange((prev) => ({ ...prev, music: track.id }));
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    commitChange((prev) => ({
      ...prev,
      photos: { ...(prev.photos || {}), cover: url },
    }));
    flashStatus('Cover photo updated');
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const encoded = await Promise.all(
      files.slice(0, 6).map(async (f) => ({
        url: await fileToDataUrl(f),
        caption: f.name.replace(/\.[^.]+$/, ''),
      }))
    );
    commitChange((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), ...encoded],
    }));
    flashStatus(`Added ${encoded.length} photo(s)`);
  };

  const handleSaveClientExplicit = async () => {
    const res = await saveClientFull(data, { publishedUrl, setActive: true, awaitServer: true });
    setSavedClients(listSavedClients());
    flashStatus(`Saved client profile: ${res.slug}`);
  };

  const handleStartCleanClient = () => {
    const fresh = createOccasionClientTemplate(occ);
    setData(fresh);
    onSave?.(fresh);
    setReplayKey((k) => k + 1);
    setShowClientsModal(false);
    flashStatus('Started a clean draft');
  };

  const handleDownloadHtml = async () => {
    const html = await buildOccasionStandaloneHtml(data);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSlug}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flashStatus(`Downloaded ${activeSlug}.html`);
  };

  const handleExportPdf = async () => {
    const opened = await openOccasionPdfPrintWindow(data);
    if (!opened) {
      flashStatus('Allow popups to open the print PDF view');
    }
  };

  const handlePublishLive = async () => {
    setIsPublishing(true);
    try {
      const html = await buildOccasionStandaloneHtml(data);
      // Save locally to dev middleware if running on localhost
      if (typeof window !== 'undefined' && import.meta.env.DEV && !window.location.hostname.includes('github.io')) {
        await fetch('/api/save-published', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: activeSlug, html, data }),
        }).catch(() => {});
      }

      if (githubToken.trim()) {
        try { localStorage.setItem(GITHUB_TOKEN_STORAGE_KEY, githubToken.trim()); } catch {}
        await publishStandaloneToGitHub({
          token: githubToken.trim(),
          slug: activeSlug,
          content: html,
          data,
        });
        await saveClientFull(data, { publishedUrl, setActive: true });
        setSavedClients(listSavedClients());
        flashStatus(`Published to GitHub: /published/${activeSlug}.html`);
      } else {
        await saveClientFull(data, { publishedUrl, setActive: true });
        setSavedClients(listSavedClients());
        flashStatus(`Saved locally for /published/${activeSlug}.html (add GitHub token for live sync)`);
      }
    } catch (err) {
      flashStatus(err?.message || 'Publish failed — check GitHub token permissions');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(publishedUrl).catch(() => {});
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `You're warmly invited! Open your interactive Paigaam invitation here: ${publishedUrl}`
  )}`;

  const hosts = data?.hosts || {};
  const occClientsList = savedClients.filter((c) => c.occasion === occ);
  const otherClientsList = savedClients.filter((c) => c.occasion !== occ);

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#1A1614] flex flex-col">
      {/* Studio Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#1A1614]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onExitToHome}
              className="w-9 h-9 rounded-full border border-[#1A1614]/15 bg-white hover:bg-[#F3EFE8] flex items-center justify-center transition cursor-pointer"
              title="Back to Paigaam Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#1A1614] text-[#FAF8F4] flex items-center justify-center font-bold text-sm tracking-tight shrink-0">
                P
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold tracking-tight truncate">
                    {occMeta.title}
                  </h1>
                  <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-[#C5A059]/15 text-[#8A6421] text-[10px] font-bold uppercase tracking-wider">
                    {occMeta.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#1A1614]/60 truncate">
                  {activeSlug}.html
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Occasion Switcher Quick Dropdown */}
            <select
              aria-label="Switch occasion studio"
              value={occ}
              onChange={(e) => {
                window.location.href = getOccasionUrl(e.target.value);
              }}
              className="hidden lg:block px-3 py-1.5 rounded-full border border-[#1A1614]/15 bg-white text-xs font-semibold cursor-pointer"
            >
              {OCCASIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setSavedClients(listSavedClients());
                setShowClientsModal(true);
              }}
              className="px-3.5 py-2 rounded-full border border-[#1A1614]/15 bg-white hover:bg-[#F3EFE8] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#8A6421]" />
              <span className="hidden sm:inline">Clients</span>
            </button>

            <button
              type="button"
              onClick={handleSaveClientExplicit}
              className="px-4 py-2 rounded-full bg-[#1A1614] text-[#FAF8F4] hover:bg-[#2F2823] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Client</span>
            </button>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusToast && (
          <div className="bg-[#1A1614] text-[#FAF8F4] text-xs font-medium text-center py-2 px-4">
            {statusToast}
          </div>
        )}
      </header>

      {/* Mobile View Switcher */}
      <div className="lg:hidden px-4 pt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setMobilePane('editor')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer ${
            mobilePane === 'editor' ? 'bg-[#1A1614] text-white' : 'bg-white border border-[#1A1614]/10 text-[#1A1614]/70'
          }`}
        >
          Customize
        </button>
        <button
          type="button"
          onClick={() => setMobilePane('preview')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer ${
            mobilePane === 'preview' ? 'bg-[#1A1614] text-white' : 'bg-white border border-[#1A1614]/10 text-[#1A1614]/70'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* Main Split Studio */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        {/* LEFT PANE: 3-Tab Studio Customizer */}
        <section className={`lg:col-span-7 space-y-5 ${mobilePane === 'preview' ? 'hidden lg:block' : ''}`}>
          {/* Top Tabs: DESIGN / CONTENT / PUBLISH */}
          <div className="bg-white rounded-2xl p-1.5 border border-[#1A1614]/10 shadow-sm grid grid-cols-3 gap-1.5">
            {[
              { id: 'design', label: 'DESIGN', icon: Palette },
              { id: 'content', label: 'CONTENT', icon: FileText },
              { id: 'publish', label: 'PUBLISH', icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold tracking-[0.14em] flex items-center justify-center gap-2 transition cursor-pointer ${
                    active
                      ? 'bg-[#1A1614] text-[#FAF8F4] shadow'
                      : 'text-[#1A1614]/65 hover:bg-[#FAF8F4]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ===================== DESIGN TAB ===================== */}
          {activeTab === 'design' && (
            <div className="space-y-5">
              {/* HOLY COMMUNION: SACRAMENT PICKER */}
              {occ === 'holy-communion' && (
                <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm">
                  <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421] mb-3">
                    Sacrament
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {HOLY_COMMUNION_SACRAMENTS.map((sac) => {
                      const active = (data.sacrament || 'communion') === sac.id;
                      return (
                        <button
                          key={sac.id}
                          type="button"
                          onClick={() => applySacrament(sac.id)}
                          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                            active
                              ? 'border-[#8A6421] bg-[#FDF8EC] shadow-sm'
                              : 'border-[#1A1614]/10 hover:border-[#1A1614]/30'
                          }`}
                        >
                          <div className="text-xs font-bold text-[#1A1614]">{sac.name}</div>
                          <div className="text-[11px] text-[#1A1614]/60 mt-1 leading-snug">{sac.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BIRTHDAY: STARTING STYLE PICKER */}
              {occ === 'birthday' && (
                <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421]">
                      Birthday Style Preset
                    </h2>
                    <span className="text-[11px] text-[#1A1614]/55">Customize anything below after</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {BIRTHDAY_STARTING_STYLES.map((st) => {
                      const active = (data.birthdayStyle || 'kids') === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => applyBirthdayStartingStyle(st.id)}
                          className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                            active
                              ? 'border-[#8A6421] bg-[#FDF8EC] shadow-sm'
                              : 'border-[#1A1614]/10 hover:border-[#1A1614]/30'
                          }`}
                        >
                          <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#8A6421]">{st.badge}</span>
                          <div className="text-sm font-bold mt-1">{st.title}</div>
                          <div className="text-[11px] text-[#1A1614]/60 mt-1 leading-snug">{st.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* OPENING REVEAL SELECTOR */}
              <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421]">
                    Opening Reveal ({revealCatalog.length} options)
                  </h2>
                  <button
                    type="button"
                    onClick={() => setReplayKey((k) => k + 1)}
                    className="text-[11px] font-semibold text-[#8A6421] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Replay Reveal
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {revealCatalog.map((rev) => {
                    const active = data.revealStyle === rev.id;
                    return (
                      <button
                        key={rev.id}
                        type="button"
                        onClick={() => {
                          commitChange((prev) => ({ ...prev, revealStyle: rev.id }));
                          setReplayKey((k) => k + 1);
                        }}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          active
                            ? 'border-[#1A1614] bg-[#1A1614] text-white shadow'
                            : 'border-[#1A1614]/10 hover:border-[#1A1614]/30 bg-[#FAF8F4]/50'
                        }`}
                      >
                        <div className="text-xs font-bold">{rev.name}</div>
                        <div className={`text-[10.5px] mt-0.5 leading-snug ${active ? 'text-white/75' : 'text-[#1A1614]/60'}`}>
                          {rev.subtitle}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* THEME / CARD LAYOUT GRID */}
              <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421] mb-3">
                  {occ === 'birthday' ? 'Card Layout' : 'Invitation Theme'} ({themeCatalog.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                  {themeCatalog.map((th) => {
                    const active = data.template === th.id;
                    return (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => {
                          commitChange((prev) => ({
                            ...prev,
                            template: th.id,
                            ...(occ !== 'engagement' && occ !== 'birthday' ? { palette: th.id } : {}),
                          }));
                        }}
                        className={`rounded-xl border overflow-hidden text-left transition cursor-pointer ${
                          active
                            ? 'border-[#8A6421] ring-2 ring-[#8A6421]/30 shadow-md'
                            : 'border-[#1A1614]/10 hover:border-[#1A1614]/30'
                        }`}
                      >
                        <div className="aspect-[120/78] w-full overflow-hidden border-b border-[#1A1614]/10">
                          <OccasionThemeThumb theme={th} occasionId={occ} />
                        </div>
                        <div className="p-2.5 bg-white">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-[#1A1614] truncate">{th.name}</span>
                            {th.badge && (
                              <span className="px-1.5 py-0.5 rounded bg-[#C5A059]/15 text-[#8A6421] text-[9px] font-bold uppercase">
                                {th.badge}
                              </span>
                            )}
                          </div>
                          {th.desc && (
                            <p className="text-[10px] text-[#1A1614]/60 mt-1 line-clamp-2 leading-snug">{th.desc}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COLOUR PALETTE (ENGAGEMENT + BIRTHDAY) */}
              {(occ === 'engagement' || occ === 'birthday') && (
                <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm">
                  <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421] mb-3">
                    Colour Palette ({occ === 'birthday' ? BIRTHDAY_COLOR_THEMES.length : OCCASION_PALETTES.length})
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {(occ === 'birthday' ? BIRTHDAY_COLOR_THEMES : OCCASION_PALETTES).map((pal) => {
                      const active = data.palette === pal.id;
                      return (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() => commitChange((prev) => ({ ...prev, palette: pal.id }))}
                          className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                            active ? 'border-[#1A1614] ring-2 ring-[#1A1614]/15' : 'border-[#1A1614]/10'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-5 h-5 rounded-full border border-black/15 shrink-0"
                              style={{ background: `linear-gradient(135deg, ${pal.bg} 50%, ${pal.accent} 50%)` }}
                            />
                            <span className="text-[11px] font-semibold truncate">{pal.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BIRTHDAY BALLOONS & TYPOGRAPHY OR ENGAGEMENT FONTS */}
              {occ === 'birthday' && (
                <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm space-y-4">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421] mb-2.5">
                      Balloon Style
                    </h2>
                    <div className="grid grid-cols-4 gap-2">
                      {BIRTHDAY_BALLOON_STYLES.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => commitChange((prev) => ({ ...prev, balloonStyle: b.id }))}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                            (data.balloonStyle || 'mixed') === b.id
                              ? 'bg-[#1A1614] text-white border-[#1A1614]'
                              : 'border-[#1A1614]/10 bg-[#FAF8F4]'
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1614]/70 mb-1.5">
                        Name Font
                      </label>
                      <select
                        value={data.nameFont || 'Bagel'}
                        onChange={(e) => commitChange((prev) => ({ ...prev, nameFont: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                      >
                        {BIRTHDAY_FONTS.map((f) => (
                          <option key={f.id} value={f.id}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1614]/70 mb-1.5">
                        Section Title Font
                      </label>
                      <select
                        value={data.sectionFont || 'Inflate'}
                        onChange={(e) => commitChange((prev) => ({ ...prev, sectionFont: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                      >
                        {BIRTHDAY_FONTS.map((f) => (
                          <option key={f.id} value={f.id}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {occ === 'engagement' && (
                <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-[#8A6421]" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421]">
                      Fonts & Monogram
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold mb-1">Heading Font</label>
                      <select
                        value={data.typography?.headingFont || 'Cormorant Garamond'}
                        onChange={(e) => commitChange(p => ({ ...p, typography: { ...(p.typography || {}), headingFont: e.target.value } }))}
                        className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                      >
                        {['Cormorant Garamond', 'Montserrat', 'Cinzel', 'Plus Jakarta Sans', 'Great Vibes'].map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-1">Monogram Initials</label>
                      <input
                        type="text"
                        value={data.monogram?.initials || ''}
                        onChange={(e) => commitChange(p => ({ ...p, monogram: { ...(p.monogram || {}), initials: e.target.value } }))}
                        className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer pb-2">
                        <input
                          type="checkbox"
                          checked={data.showMonogram !== false}
                          onChange={(e) => commitChange(p => ({ ...p, showMonogram: e.target.checked }))}
                        />
                        <span>Show Monogram Crest</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* BABY SHOWER GENDER POLL TOGGLE */}
              {occ === 'baby-shower' && (
                <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#8A6421]">
                      “Team Pink or Team Blue?” Poll
                    </h2>
                    <p className="text-xs text-[#1A1614]/65 mt-0.5">Let guests cast an interactive guess right inside the invite.</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer accent-[#8A6421]"
                    checked={data.enableGenderPoll !== false}
                    onChange={(e) => commitChange((prev) => ({ ...prev, enableGenderPoll: e.target.checked }))}
                  />
                </div>
              )}

              {/* EFFECTS & BACKGROUND MUSIC */}
              <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8A6421]" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421]">
                      Celebration Effects & Audio
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => commitChange((prev) => ({ ...prev, soundEffects: prev.soundEffects === false }))}
                    className="px-3 py-1 rounded-full border border-[#1A1614]/15 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {data.soundEffects !== false ? <Volume2 className="w-3.5 h-3.5 text-[#8A6421]" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>{data.soundEffects !== false ? 'SFX On' : 'SFX Muted'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['confetti', 'colorful', 'petals', 'hearts', 'stars', 'fireworks', 'none'].map((ef) => (
                    <button
                      key={ef}
                      type="button"
                      onClick={() => commitChange((prev) => ({ ...prev, effect: ef }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border cursor-pointer ${
                        data.effect === ef
                          ? 'bg-[#1A1614] text-white border-[#1A1614]'
                          : 'border-[#1A1614]/15 bg-[#FAF8F4]'
                      }`}
                    >
                      {ef}
                    </button>
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Music className="w-3.5 h-3.5 text-[#8A6421]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1A1614]/75">Background Music</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tracks.map((tr) => {
                      const selected = data.music === tr.id;
                      const playing = playingTrackId === tr.id;
                      return (
                        <div
                          key={tr.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                            selected ? 'border-[#8A6421] bg-[#FDF8EC]' : 'border-[#1A1614]/10'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => commitChange((prev) => ({ ...prev, music: tr.id }))}
                            className="text-left min-w-0 flex-1 cursor-pointer"
                          >
                            <div className="text-xs font-bold truncate">{tr.name}</div>
                            <div className="text-[10px] text-[#1A1614]/60 truncate">{tr.mood}</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleMusic(tr)}
                            className="w-7 h-7 rounded-full border border-[#1A1614]/15 bg-white flex items-center justify-center shrink-0 cursor-pointer"
                            title={playing ? 'Stop preview' : 'Play preview'}
                          >
                            {playing ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== CONTENT TAB ===================== */}
          {activeTab === 'content' && (
            <div className="space-y-5">
              {/* HOSTS / CELEBRANT DETAILS */}
              <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[#8A6421]" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421]">
                    {occ === 'engagement'
                      ? 'Couple & Families'
                      : occ === 'birthday'
                        ? 'Birthday Celebrant & Hosts'
                        : occ === 'housewarming' || occ === 'house-party'
                          ? 'Home, Flat & Hosts'
                          : occ === 'holy-communion'
                            ? 'Child, Parents & Reading'
                            : 'Baby, Parents & Details'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold mb-1">
                      {occ === 'engagement'
                        ? 'Bride / Partner 1 Name'
                        : occ === 'birthday'
                          ? 'Celebrant Name'
                          : occ === 'annaprashan'
                            ? 'Baby Name'
                            : occ === 'holy-communion'
                              ? 'Child Name'
                              : occ === 'baby-shower'
                                ? 'Mom-to-be Name'
                                : 'Host 1 Name'}
                    </label>
                    <input
                      type="text"
                      value={hosts.bride || ''}
                      onChange={(e) => updateHost('bride', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold mb-1">
                      {occ === 'engagement'
                        ? 'Groom / Partner 2 Name'
                        : occ === 'baby-shower'
                          ? 'Dad-to-be Name'
                          : occ === 'housewarming' || occ === 'house-party'
                            ? 'Household / Family Name'
                            : 'Family / Co-Host Line'}
                    </label>
                    <input
                      type="text"
                      value={occ === 'housewarming' || occ === 'house-party' ? (hosts.householdName || '') : (hosts.groom || '')}
                      onChange={(e) => updateHost(occ === 'housewarming' || occ === 'house-party' ? 'householdName' : 'groom', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                    />
                  </div>

                  {/* Housewarming & House Party Flat + Floor */}
                  {(occ === 'housewarming' || occ === 'house-party') && (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Flat / House No (for Door Reveal)</label>
                        <input
                          type="text"
                          value={hosts.flatNo || ''}
                          onChange={(e) => updateHost('flatNo', e.target.value)}
                          placeholder="e.g. 1204"
                          className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Floor Number (for Lift Reveal)</label>
                        <input
                          type="text"
                          value={hosts.floor || ''}
                          onChange={(e) => updateHost('floor', e.target.value)}
                          placeholder="e.g. 12"
                          className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                        />
                      </div>
                    </>
                  )}

                  {/* Birthday Age & Dress Code */}
                  {occ === 'birthday' && (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Age / Milestone Badge</label>
                        <input
                          type="text"
                          value={hosts.ageBadge || ''}
                          onChange={(e) => updateHost('ageBadge', e.target.value)}
                          placeholder="e.g. Turning 6!"
                          className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Dress Code</label>
                        <input
                          type="text"
                          value={hosts.dressCode || ''}
                          onChange={(e) => updateHost('dressCode', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                        />
                      </div>
                    </>
                  )}

                  {/* Engagement Parent lines */}
                  {occ === 'engagement' && (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Bride’s Parents</label>
                        <input
                          type="text"
                          value={hosts.brideParents || ''}
                          onChange={(e) => updateHost('brideParents', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Groom’s Parents</label>
                        <input
                          type="text"
                          value={hosts.groomParents || ''}
                          onChange={(e) => updateHost('groomParents', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                        />
                      </div>
                    </>
                  )}

                  {/* Baby Shower Due Date */}
                  {occ === 'baby-shower' && (
                    <div>
                      <label className="block text-[11px] font-bold mb-1">Expected Arrival Line</label>
                      <input
                        type="text"
                        value={hosts.dueDateLine || ''}
                        onChange={(e) => updateHost('dueDateLine', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                      />
                    </div>
                  )}

                  {/* Holy Communion Details */}
                  {occ === 'holy-communion' && (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Invited By (Parents)</label>
                        <input
                          type="text"
                          value={hosts.invitedBy || ''}
                          onChange={(e) => updateHost('invitedBy', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Godparents</label>
                        <input
                          type="text"
                          value={hosts.godparents || ''}
                          onChange={(e) => updateHost('godparents', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold mb-1">Main Date</label>
                    <input
                      type="date"
                      value={hosts.date || ''}
                      onChange={(e) => updateHost('date', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1">City / Venue Location</label>
                    <input
                      type="text"
                      value={hosts.city || ''}
                      onChange={(e) => updateHost('city', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold mb-1">Top Blessing / Eyebrow Heading</label>
                  <input
                    type="text"
                    value={hosts.title || ''}
                    onChange={(e) => updateHost('title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                  />
                </div>

                {occ === 'house-party' && (
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Food, Drinks & Music Highlights</label>
                    <input
                      type="text"
                      value={hosts.menuHighlights || ''}
                      onChange={(e) => updateHost('menuHighlights', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                    />
                  </div>
                )}

                {occ === 'holy-communion' && (
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Scripture / Bible Verse</label>
                    <textarea
                      rows={2}
                      value={hosts.bibleVerse || ''}
                      onChange={(e) => updateHost('bibleVerse', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold mb-1">Story / Warm Welcome Note</label>
                  <textarea
                    rows={3}
                    value={hosts.welcomeQuote || ''}
                    onChange={(e) => updateHost('welcomeQuote', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                  />
                </div>
              </div>

              {/* SCHEDULE & EVENTS */}
              <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#8A6421]" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421]">
                      Events & Itinerary ({(data.events || []).length})
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={addEvent}
                    className="px-3 py-1.5 rounded-full bg-[#FAF8F4] border border-[#1A1614]/15 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Event
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.events || []).map((ev, idx) => (
                    <div key={ev.id || idx} className="p-3.5 rounded-xl border border-[#1A1614]/10 bg-[#FAF8F4]/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6421]">
                          Event #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEvent(idx)}
                          className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Event Title"
                          value={ev.name || ''}
                          onChange={(e) => updateEvent(idx, 'name', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-[#1A1614]/15 text-xs bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Time (e.g. 07:00 PM)"
                          value={ev.time || ''}
                          onChange={(e) => updateEvent(idx, 'time', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-[#1A1614]/15 text-xs bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Date label"
                          value={ev.date || ''}
                          onChange={(e) => updateEvent(idx, 'date', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-[#1A1614]/15 text-xs bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Venue Name"
                          value={ev.venue || ''}
                          onChange={(e) => updateEvent(idx, 'venue', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-[#1A1614]/15 text-xs bg-white"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Full Street Address"
                        value={ev.address || ''}
                        onChange={(e) => updateEvent(idx, 'address', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#1A1614]/15 text-xs bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* PHOTOS & GALLERY */}
              <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#8A6421]" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421]">
                      Photos & Gallery
                    </h2>
                  </div>
                  {data.photos?.cover && (
                    <button
                      type="button"
                      onClick={() => commitChange((prev) => ({ ...prev, photos: { ...(prev.photos || {}), cover: '' } }))}
                      className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                    >
                      Use Illustrated Scene Instead
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <label className="px-4 py-2 rounded-xl border border-[#1A1614]/15 bg-[#FAF8F4] text-xs font-semibold cursor-pointer hover:bg-[#F3EFE8]">
                    Upload Cover Photo
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  </label>
                  <label className="px-4 py-2 rounded-xl border border-[#1A1614]/15 bg-[#FAF8F4] text-xs font-semibold cursor-pointer hover:bg-[#F3EFE8]">
                    Add Gallery Photos
                    <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                  </label>
                </div>

                {(data.gallery || []).length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                    {(data.gallery || []).map((g, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden border border-[#1A1614]/10 group">
                        <img src={resolveAssetUrl(g.url)} alt={g.caption || 'Gallery'} className="w-full h-20 object-cover" />
                        <button
                          type="button"
                          onClick={() => commitChange(p => ({ ...p, gallery: p.gallery.filter((_, idx) => idx !== i) }))}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RSVP OPTIONS */}
              <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421]">
                    RSVP Form Settings
                  </h2>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.rsvpConfig?.enabled !== false}
                      onChange={(e) => commitChange(p => ({ ...p, rsvpConfig: { ...(p.rsvpConfig || {}), enabled: e.target.checked } }))}
                    />
                    <span>Show RSVP Section</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="RSVP Deadline line (e.g. Kindly RSVP by 10th Dec)"
                  value={data.rsvpConfig?.deadline || ''}
                  onChange={(e) => commitChange(p => ({ ...p, rsvpConfig: { ...(p.rsvpConfig || {}), deadline: e.target.value } }))}
                  className="w-full px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                />
              </div>
            </div>
          )}

          {/* ===================== PUBLISH TAB ===================== */}
          {activeTab === 'publish' && (
            <div className="space-y-5">
              {/* Custom Link Slug & Instant Actions */}
              <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421]">
                    Publish & Share Link
                  </h2>
                  <p className="text-xs text-[#1A1614]/65 mt-1">
                    Every client gets a standalone HTML page ready for WhatsApp, desktop or offline viewing.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold mb-1">Custom Invitation Link Slug</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={data.customSlug || activeSlug}
                      onChange={(e) => commitChange((prev) => ({ ...prev, customSlug: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs font-mono bg-[#FAF8F4]"
                    />
                  </div>
                  <div className="mt-2 p-2.5 rounded-xl bg-[#FAF8F4] border border-[#1A1614]/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#1A1614]/80 truncate">{publishedUrl}</span>
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#1A1614]/15 text-[11px] font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadHtml}
                    className="py-3 px-4 rounded-xl bg-[#1A1614] text-[#FAF8F4] hover:bg-[#2F2823] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <Download className="w-4 h-4" /> Download Standalone HTML
                  </button>
                  <button
                    type="button"
                    onClick={handleExportPdf}
                    className="py-3 px-4 rounded-xl border border-[#1A1614]/20 bg-white hover:bg-[#FAF8F4] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Save / Print PDF
                  </button>
                </div>

                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Share on WhatsApp
                </a>
              </div>

              {/* GitHub Pages Cloud Sync */}
              <div className="bg-white rounded-2xl p-5 border border-[#1A1614]/10 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#8A6421]" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6421]">
                    Sync Standalone HTML to GitHub Pages
                  </h2>
                </div>
                <p className="text-xs text-[#1A1614]/65 leading-relaxed">
                  Paste your repository GitHub token (stored only in your browser) to publish <code className="px-1 bg-[#FAF8F4] rounded">/published/{activeSlug}.html</code> live.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    placeholder="ghp_... GitHub Personal Access Token"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#1A1614]/15 text-xs bg-[#FAF8F4]"
                  />
                  <button
                    type="button"
                    disabled={isPublishing}
                    onClick={handlePublishLive}
                    className="px-5 py-2.5 rounded-xl bg-[#8A6421] hover:bg-[#705018] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {isPublishing ? 'Publishing...' : 'Publish Live'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT PANE: Sticky Interactive Phone Preview + WhatsApp Preview */}
        <aside className={`lg:col-span-5 lg:sticky lg:top-20 flex flex-col items-center ${mobilePane === 'editor' ? 'hidden lg:flex' : ''}`}>
          <div className="w-full max-w-[390px] flex items-center justify-between mb-3 gap-2">
            <div className="bg-white rounded-full p-1 border border-[#1A1614]/10 flex gap-1 shadow-sm">
              <button
                type="button"
                onClick={() => setPreviewTab('invite')}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold cursor-pointer ${
                  previewTab === 'invite' ? 'bg-[#1A1614] text-white' : 'text-[#1A1614]/65'
                }`}
              >
                Invite
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('whatsapp')}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold cursor-pointer ${
                  previewTab === 'whatsapp' ? 'bg-[#1A1614] text-white' : 'text-[#1A1614]/65'
                }`}
              >
                WhatsApp preview
              </button>
            </div>

            <button
              type="button"
              onClick={() => setReplayKey((k) => k + 1)}
              className="px-3 py-1.5 rounded-full bg-white border border-[#1A1614]/15 text-[11px] font-semibold flex items-center gap-1.5 hover:bg-[#F3EFE8] cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3 h-3 text-[#8A6421]" /> Replay
            </button>
          </div>

          <div className="w-full max-w-[380px] h-[670px] rounded-[42px] border-[10px] border-[#1A1614] bg-white shadow-2xl overflow-hidden relative">
            {/* Subtle iPhone Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-[#1A1614] z-40 pointer-events-none" />
            {previewTab === 'invite' ? (
              <OccasionInvitePreview data={data} replayKey={replayKey} />
            ) : (
              <OccasionWhatsAppPreview data={data} publishedUrl={publishedUrl} />
            )}
          </div>
        </aside>
      </div>

      {/* SAVED CLIENTS MODAL */}
      {showClientsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#1A1614]/10 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#1A1614]/10">
              <div>
                <h2 className="text-lg font-bold">Saved Client Projects</h2>
                <p className="text-xs text-[#1A1614]/60">Reopen any client template right where you left off</p>
              </div>
              <button
                type="button"
                onClick={() => setShowClientsModal(false)}
                className="w-8 h-8 rounded-full border border-[#1A1614]/15 text-sm font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-4 flex-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A6421] mb-2">
                  Current Studio ({occ.replace(/-/g, ' ')})
                </p>
                {occClientsList.length === 0 ? (
                  <p className="text-xs text-[#1A1614]/55 italic">No saved {occ.replace(/-/g, ' ')} clients yet — click “Save Client” to store this draft.</p>
                ) : (
                  <div className="space-y-2">
                    {occClientsList.map((c) => (
                      <div key={c.slug} className="p-3 rounded-xl border border-[#1A1614]/10 flex items-center justify-between gap-2 bg-[#FAF8F4]">
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{c.bride} {c.groom ? `& ${c.groom}` : ''}</div>
                          <div className="text-[10px] text-[#1A1614]/60 font-mono truncate">{c.slug}.html</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const loaded = getSavedClient(c.slug);
                              if (loaded) {
                                setData(loaded);
                                setActiveClientSlug(c.slug, occ);
                                setShowClientsModal(false);
                                flashStatus(`Loaded ${c.slug}`);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#1A1614] text-white text-[11px] font-semibold cursor-pointer"
                          >
                            Open
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              removeSavedClient(c.slug);
                              setSavedClients(listSavedClients());
                            }}
                            className="px-2 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-[11px] cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {otherClientsList.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1614]/50 mb-2">
                    Other Saved Clients
                  </p>
                  <div className="space-y-1.5">
                    {otherClientsList.slice(0, 8).map((c) => (
                      <div key={c.slug} className="p-2.5 rounded-xl border border-[#1A1614]/10 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate">{c.bride} & {c.groom}</div>
                          <div className="text-[10px] text-[#1A1614]/50 uppercase">{c.occasion} · {c.slug}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const target = getOccasionUrl(c.occasion || 'wedding');
                            window.location.href = target.replace('#studio', `?client=${encodeURIComponent(c.slug)}#studio`);
                          }}
                          className="px-3 py-1 rounded-lg border border-[#1A1614]/15 text-[11px] font-semibold cursor-pointer"
                        >
                          Switch Studio
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#1A1614]/10 flex gap-3">
              <button
                type="button"
                onClick={handleStartCleanClient}
                className="flex-1 py-2.5 rounded-xl border border-[#1A1614]/20 font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-[#FAF8F4]"
              >
                Start Clean Client
              </button>
              <button
                type="button"
                onClick={() => setShowClientsModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1A1614] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
