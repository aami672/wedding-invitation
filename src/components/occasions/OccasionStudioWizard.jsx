import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Palette,
  Music,
  Type,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  Send,
  Download,
  Printer,
  Copy,
  Check,
  CheckCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Users,
  ArrowLeft,
  ArrowRight,
  Play,
  Square,
  Share2,
  Globe,
  Mail,
  ChevronUp,
  ChevronDown,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  X,
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

function AccordionCard({ id, isOpen, onToggle, icon: Icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E6D5BF] overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full p-4 sm:p-5 flex justify-between items-center text-left hover:bg-stone-50/70 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-center text-[#8B6F47] shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="site-display text-xl font-normal text-[#1A120E] truncate">{title}</h4>
            <p className="text-xs text-stone-500 font-light truncate">{subtitle}</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
        ) : (
          <ChevronDown className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-[#E6D5BF] bg-[#FAF8F5]/60">
          {children}
        </div>
      )}
    </div>
  );
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
  const [activeTab, setActiveTab] = useState('design'); // 'design' | 'content' | 'extras' | 'publish'
  const [openDesignRow, setOpenDesignRow] = useState(null);
  const [openContentRow, setOpenContentRow] = useState('hosts');
  const [openExtrasRow, setOpenExtrasRow] = useState('effects');
  const [simulatorMode, setSimulatorMode] = useState('invite'); // 'invite' | 'replay' | 'whatsapp'
  const [previewDevice, setPreviewDevice] = useState('mobile'); // 'mobile' | 'tablet' | 'desktop'
  const [mobilePane, setMobilePane] = useState('editor'); // 'editor' | 'preview'
  const [showGuestPreview, setShowGuestPreview] = useState(false);
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
    flashStatus(`Saved client: ${res.slug}`);
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
  const selectedTheme = themeCatalog.find((t) => t.id === data.template) || themeCatalog[0];
  const selectedReveal = revealCatalog.find((r) => r.id === data.revealStyle) || revealCatalog[0];
  const activePaletteList = occ === 'birthday' ? BIRTHDAY_COLOR_THEMES : OCCASION_PALETTES;
  const selectedPalette = activePaletteList.find((p) => p.id === data.palette) || activePaletteList[0];
  const selectedTrack = tracks.find((t) => t.id === data.music) || tracks[0];
  const primaryTitleLabel = hosts.bride
    ? hosts.groom && occ === 'engagement'
      ? `${hosts.bride} & ${hosts.groom}`
      : hosts.bride
    : occMeta.title;

  const toggleDesignRow = (id) => setOpenDesignRow((prev) => (prev === id ? null : id));
  const toggleContentRow = (id) => setOpenContentRow((prev) => (prev === id ? null : id));
  const toggleExtrasRow = (id) => setOpenExtrasRow((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-[#F6EFE4] text-[#1A120E] flex flex-col paigaam-site">
      {/* Studio Top Bar — Matches Wedding Studio */}
      <header className="sticky top-0 z-40 bg-[#160F0C]/95 backdrop-blur-md border-b border-[#C8A055]/30 px-4 sm:px-6 py-3.5 flex justify-between items-center gap-3 shadow-lg">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={onExitToHome}
            className="hover:text-[#E6C88A] text-[#D7C9B6] transition-colors flex items-center gap-1.5 text-xs tracking-wider uppercase font-semibold cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>
          <div className="h-5 w-px bg-[#C8A055]/25 shrink-0" />
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full border border-[#C8A055]/60 bg-[#231813] flex items-center justify-center shrink-0">
              <span className="site-display text-sm font-bold text-[#E6C88A]">P</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="site-display text-xl sm:text-2xl tracking-tight text-[#FBF7F0] font-semibold leading-none truncate">
                  Paigaam Studio
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full border border-[#C8A055]/45 bg-[#231813] text-[10px] font-semibold uppercase tracking-wider text-[#E6C88A] shrink-0">
                  {occMeta.title}
                </span>
              </div>
              <span className="text-[9.5px] tracking-[0.22em] uppercase text-[#C8A055]/85 block leading-none mt-1 truncate">
                Delivering Life’s Most Cherished Moments
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {statusToast && (
            <span className="hidden xl:inline-flex items-center px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-medium">
              {statusToast}
            </span>
          )}

          {/* Quick Occasion Switcher */}
          <select
            aria-label="Switch occasion studio"
            value={occ}
            onChange={(e) => {
              window.location.href = getOccasionUrl(e.target.value);
            }}
            className="hidden lg:block px-3 py-1.5 rounded-full border border-[#C8A055]/45 bg-[#241914] hover:bg-[#32231B] text-xs font-semibold text-[#F4E7D0] cursor-pointer focus:outline-none"
          >
            {OCCASIONS.map((o) => (
              <option key={o.id} value={o.id} className="bg-[#1A120E] text-[#F4E7D0]">
                {o.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setSavedClients(listSavedClients());
              setShowClientsModal(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#241914] hover:bg-[#32231B] border border-[#C8A055]/45 text-xs font-semibold text-[#F4E7D0] flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            title="Switch, load, or create client project"
          >
            <Users className="w-3.5 h-3.5 text-[#E6C88A]" />
            <span className="hidden sm:inline max-w-[140px] truncate">{primaryTitleLabel}</span>
            <span className="sm:hidden">Clients</span>
          </button>

          <button
            type="button"
            onClick={handleSaveClientExplicit}
            className="px-3 py-1.5 rounded-full bg-[#241914] hover:bg-[#32231B] border border-[#C8A055]/45 text-xs font-semibold text-[#F4E7D0] flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            title="Save current client draft"
          >
            <Check className="w-3.5 h-3.5 text-[#E6C88A]" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGuestPreview(true)}
            className="paigaam-gold-btn px-4 sm:px-5 py-2 rounded-full text-xs tracking-wider uppercase font-bold cursor-pointer flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Guest Preview</span>
          </button>
        </div>
      </header>

      {/* Mobile Toast & View Switcher */}
      {statusToast && (
        <div className="xl:hidden bg-emerald-950 text-emerald-100 text-xs font-medium text-center py-2 px-4 border-b border-emerald-500/30">
          {statusToast}
        </div>
      )}
      <div className="lg:hidden px-4 pt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setMobilePane('editor')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer ${
            mobilePane === 'editor'
              ? 'bg-[#1A120E] text-[#E6C88A] border border-[#C8A055]'
              : 'bg-[#FFFDF9] border border-[#E2D3BA] text-[#5C4938]'
          }`}
        >
          Customize
        </button>
        <button
          type="button"
          onClick={() => setMobilePane('preview')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer ${
            mobilePane === 'preview'
              ? 'bg-[#1A120E] text-[#E6C88A] border border-[#C8A055]'
              : 'bg-[#FFFDF9] border border-[#E2D3BA] text-[#5C4938]'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* Main Split Studio */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: Accordion Editor — Matches Wedding Studio 4-Card Menu */}
        <div
          className={`w-full lg:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[calc(100vh-65px)] space-y-6 ${
            mobilePane === 'preview' ? 'hidden lg:block' : ''
          }`}
        >
          {/* Top Navigation Tabs: DESIGN / CONTENT / EXTRAS / PUBLISH */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { id: 'design', label: 'Design', icon: Palette },
              { id: 'content', label: 'Content', icon: BookOpen },
              { id: 'extras', label: 'Extras', icon: Sparkles },
              { id: 'publish', label: 'Publish', icon: Globe },
            ].map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-center cursor-pointer ${
                    active
                      ? 'border-[#C8A055] bg-[#1A120E] text-[#E6C88A] shadow-md ring-1 ring-[#C8A055]/60'
                      : 'border-[#E2D3BA] bg-[#FFFDF9] text-[#5C4938] hover:border-[#C8A055]'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1.5" />
                  <span className="text-[11px] font-bold tracking-widest uppercase">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* ===================== TAB 1: DESIGN ===================== */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              <div>
                <h2 className="site-display text-3xl font-normal text-[#1A120E]">
                  Design your invite
                </h2>
                <p className="text-sm text-[#6E5C4B] font-light mt-1">
                  Pick a theme, colours, how guests open it, and the typography.
                </p>
              </div>

              {/* Active Studio / Invitation Type Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E6D5BF] flex justify-between items-center shadow-xs gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-center text-[#8B6F47] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-stone-400 block">
                      {occMeta.badge}
                    </span>
                    <span className="site-display text-xl font-normal text-[#1A120E] block truncate">
                      {occMeta.title} · {activeSlug}.html
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSavedClients(listSavedClients());
                    setShowClientsModal(true);
                  }}
                  className="px-4 py-1.5 rounded-full border border-stone-200 text-xs font-bold uppercase tracking-wider text-stone-700 hover:border-[#8B6F47] hover:bg-[#FAF5ED] transition-colors cursor-pointer shrink-0"
                >
                  Switch
                </button>
              </div>

              {/* TEMPLATE & OPENING ACCORDION GROUP */}
              <div className="space-y-3">
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-400 block">
                  Template &amp; Opening
                </span>

                {/* HOLY COMMUNION: SACRAMENT PICKER */}
                {occ === 'holy-communion' && (
                  <AccordionCard
                    id="sacrament"
                    isOpen={openDesignRow === 'sacrament'}
                    onToggle={toggleDesignRow}
                    icon={Sparkles}
                    title="Sacrament ceremony"
                    subtitle={
                      (HOLY_COMMUNION_SACRAMENTS.find((s) => s.id === (data.sacrament || 'communion')) || HOLY_COMMUNION_SACRAMENTS[0]).name
                    }
                  >
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
                                ? 'border-[#8B6F47] bg-[#FDF8EC] ring-1 ring-[#8B6F47]/40 shadow-sm'
                                : 'border-[#E6D5BF] bg-white hover:border-[#8B6F47]/60'
                            }`}
                          >
                            <div className="text-xs font-bold text-[#1A120E]">{sac.name}</div>
                            <div className="text-[11px] text-stone-500 mt-1 leading-snug">{sac.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </AccordionCard>
                )}

                {/* BIRTHDAY: STARTING STYLE PICKER */}
                {occ === 'birthday' && (
                  <AccordionCard
                    id="birthday-style"
                    isOpen={openDesignRow === 'birthday-style'}
                    onToggle={toggleDesignRow}
                    icon={Sparkles}
                    title="Birthday style preset"
                    subtitle={
                      (BIRTHDAY_STARTING_STYLES.find((s) => s.id === (data.birthdayStyle || 'kids')) || BIRTHDAY_STARTING_STYLES[0]).title
                    }
                  >
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
                                ? 'border-[#8B6F47] bg-[#FDF8EC] ring-1 ring-[#8B6F47]/40 shadow-sm'
                                : 'border-[#E6D5BF] bg-white hover:border-[#8B6F47]/60'
                            }`}
                          >
                            <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#8B6F47]">{st.badge}</span>
                            <div className="text-sm font-bold text-[#1A120E] mt-1">{st.title}</div>
                            <div className="text-[11px] text-stone-500 mt-1 leading-snug">{st.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </AccordionCard>
                )}

                {/* ROW 1: INVITATION THEME / LAYOUT */}
                <AccordionCard
                  id="template"
                  isOpen={openDesignRow === 'template'}
                  onToggle={toggleDesignRow}
                  icon={ImageIcon}
                  title={occ === 'birthday' ? 'Card layout' : 'Invitation theme'}
                  subtitle={`${selectedTheme?.name || ''} · ${themeCatalog.length} artisan styles`}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-96 overflow-y-auto pr-1">
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
                          className={`rounded-xl border overflow-hidden text-left transition cursor-pointer bg-white ${
                            active
                              ? 'border-[#8B6F47] ring-2 ring-[#8B6F47]/35 shadow-md'
                              : 'border-[#E6D5BF] hover:border-[#8B6F47]/60'
                          }`}
                        >
                          <div className="aspect-[120/78] w-full overflow-hidden border-b border-[#E6D5BF]">
                            <OccasionThemeThumb theme={th} occasionId={occ} />
                          </div>
                          <div className="p-2.5">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-[#1A120E] truncate">{th.name}</span>
                              {th.badge && (
                                <span className="px-1.5 py-0.5 rounded bg-[#C8A055]/15 text-[#8B6F47] text-[9px] font-bold uppercase">
                                  {th.badge}
                                </span>
                              )}
                            </div>
                            {th.desc && (
                              <p className="text-[10px] text-stone-500 mt-1 line-clamp-2 leading-snug">{th.desc}</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </AccordionCard>

                {/* ROW 2: OPENING REVEAL STYLE */}
                <AccordionCard
                  id="reveal"
                  isOpen={openDesignRow === 'reveal'}
                  onToggle={toggleDesignRow}
                  icon={Sparkles}
                  title="Opening reveal ritual"
                  subtitle={`${selectedReveal?.name || 'Classic'} · ${revealCatalog.length} interactive options`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setReplayKey((k) => k + 1);
                          setSimulatorMode('replay');
                        }}
                        className="text-xs font-semibold text-[#8B6F47] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Replay Reveal in Phone
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
                                ? 'border-[#C8A055] bg-[#1A120E] text-[#E6C88A] shadow-sm'
                                : 'border-[#E6D5BF] bg-white hover:border-[#8B6F47]/60 text-[#1A120E]'
                            }`}
                          >
                            <div className="text-xs font-bold">{rev.name}</div>
                            <div className={`text-[10.5px] mt-0.5 leading-snug ${active ? 'text-[#E6C88A]/80' : 'text-stone-500'}`}>
                              {rev.subtitle}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </AccordionCard>

                {/* ROW 3: COLOUR PALETTE (ENGAGEMENT + BIRTHDAY) */}
                {(occ === 'engagement' || occ === 'birthday') && (
                  <AccordionCard
                    id="palette"
                    isOpen={openDesignRow === 'palette'}
                    onToggle={toggleDesignRow}
                    icon={Palette}
                    title="Colour palette"
                    subtitle={`${selectedPalette?.name || ''} · ${activePaletteList.length} curated palettes`}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {activePaletteList.map((pal) => {
                        const active = data.palette === pal.id;
                        return (
                          <button
                            key={pal.id}
                            type="button"
                            onClick={() => commitChange((prev) => ({ ...prev, palette: pal.id }))}
                            className={`p-2.5 rounded-xl border text-left transition cursor-pointer bg-white ${
                              active ? 'border-[#8B6F47] ring-2 ring-[#8B6F47]/30 shadow-xs' : 'border-[#E6D5BF] hover:border-[#8B6F47]/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-5 h-5 rounded-full border border-black/15 shrink-0"
                                style={{ background: `linear-gradient(135deg, ${pal.bg} 50%, ${pal.accent} 50%)` }}
                              />
                              <span className="text-xs font-semibold truncate text-[#1A120E]">{pal.name}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </AccordionCard>
                )}

                {/* ROW 4: FONTS & STYLING (BIRTHDAY OR ENGAGEMENT) */}
                {occ === 'birthday' && (
                  <AccordionCard
                    id="fonts"
                    isOpen={openDesignRow === 'fonts'}
                    onToggle={toggleDesignRow}
                    icon={Type}
                    title="Balloon style & typography"
                    subtitle={`Balloons: ${data.balloonStyle || 'mixed'} · ${data.nameFont || 'Bagel'}`}
                  >
                    <div className="space-y-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                          Balloon Style
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {BIRTHDAY_BALLOON_STYLES.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => commitChange((prev) => ({ ...prev, balloonStyle: b.id }))}
                              className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                                (data.balloonStyle || 'mixed') === b.id
                                  ? 'bg-[#1A120E] text-[#E6C88A] border-[#C8A055]'
                                  : 'border-[#E6D5BF] bg-white text-[#5C4938]'
                              }`}
                            >
                              {b.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                            Name Font
                          </label>
                          <select
                            value={data.nameFont || 'Bagel'}
                            onChange={(e) => commitChange((prev) => ({ ...prev, nameFont: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                          >
                            {BIRTHDAY_FONTS.map((f) => (
                              <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                            Section Title Font
                          </label>
                          <select
                            value={data.sectionFont || 'Inflate'}
                            onChange={(e) => commitChange((prev) => ({ ...prev, sectionFont: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                          >
                            {BIRTHDAY_FONTS.map((f) => (
                              <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </AccordionCard>
                )}

                {occ === 'engagement' && (
                  <AccordionCard
                    id="fonts"
                    isOpen={openDesignRow === 'fonts'}
                    onToggle={toggleDesignRow}
                    icon={Type}
                    title="Fonts & monogram crest"
                    subtitle={`${data.typography?.headingFont || 'Cormorant Garamond'} · Monogram ${data.monogram?.initials || 'Crest'}`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1 text-stone-600">Heading Font</label>
                        <select
                          value={data.typography?.headingFont || 'Cormorant Garamond'}
                          onChange={(e) => commitChange(p => ({ ...p, typography: { ...(p.typography || {}), headingFont: e.target.value } }))}
                          className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                        >
                          {['Cormorant Garamond', 'Montserrat', 'Cinzel', 'Plus Jakarta Sans', 'Great Vibes'].map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1 text-stone-600">Monogram Initials</label>
                        <input
                          type="text"
                          value={data.monogram?.initials || ''}
                          onChange={(e) => commitChange(p => ({ ...p, monogram: { ...(p.monogram || {}), initials: e.target.value } }))}
                          className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer pb-2 text-[#1A120E]">
                          <input
                            type="checkbox"
                            checked={data.showMonogram !== false}
                            onChange={(e) => commitChange(p => ({ ...p, showMonogram: e.target.checked }))}
                            className="accent-[#8B6F47]"
                          />
                          <span>Show Monogram Crest</span>
                        </label>
                      </div>
                    </div>
                  </AccordionCard>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B6F47] hover:bg-[#755C3A] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Content</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: CONTENT ===================== */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <h2 className="site-display text-3xl font-normal text-[#1A120E]">
                  Craft your story &amp; details
                </h2>
                <p className="text-sm text-[#6E5C4B] font-light mt-1">
                  Personalise names, celebration schedule, venue address, and photos.
                </p>
              </div>

              <div className="space-y-3">
                {/* ROW 1: HOSTS / CELEBRANT DETAILS */}
                <AccordionCard
                  id="hosts"
                  isOpen={openContentRow === 'hosts'}
                  onToggle={toggleContentRow}
                  icon={Users}
                  title={
                    occ === 'engagement'
                      ? 'Couple & families'
                      : occ === 'birthday'
                        ? 'Celebrant & hosts'
                        : occ === 'housewarming' || occ === 'house-party'
                          ? 'Home, flat & hosts'
                          : occ === 'holy-communion'
                            ? 'Child, parents & scripture'
                            : 'Baby, parents & details'
                  }
                  subtitle={`${primaryTitleLabel}${hosts.city ? ` · ${hosts.city}` : ''}`}
                >
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold mb-1 text-stone-700">
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
                          className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold mb-1 text-stone-700">
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
                          className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                        />
                      </div>

                      {(occ === 'housewarming' || occ === 'house-party') && (
                        <>
                          <div>
                            <label className="block text-[11px] font-bold mb-1 text-stone-700">Flat / House No (for Door Reveal)</label>
                            <input
                              type="text"
                              value={hosts.flatNo || ''}
                              onChange={(e) => updateHost('flatNo', e.target.value)}
                              placeholder="e.g. 1204"
                              className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold mb-1 text-stone-700">Floor Number (for Lift Reveal)</label>
                            <input
                              type="text"
                              value={hosts.floor || ''}
                              onChange={(e) => updateHost('floor', e.target.value)}
                              placeholder="e.g. 12"
                              className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                            />
                          </div>
                        </>
                      )}

                      {occ === 'birthday' && (
                        <>
                          <div>
                            <label className="block text-[11px] font-bold mb-1 text-stone-700">Age / Milestone Badge</label>
                            <input
                              type="text"
                              value={hosts.ageBadge || ''}
                              onChange={(e) => updateHost('ageBadge', e.target.value)}
                              placeholder="e.g. Turning 6!"
                              className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold mb-1 text-stone-700">Dress Code</label>
                            <input
                              type="text"
                              value={hosts.dressCode || ''}
                              onChange={(e) => updateHost('dressCode', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                            />
                          </div>
                        </>
                      )}

                      {occ === 'engagement' && (
                        <>
                          <div>
                            <label className="block text-[11px] font-bold mb-1 text-stone-700">Bride’s Parents</label>
                            <input
                              type="text"
                              value={hosts.brideParents || ''}
                              onChange={(e) => updateHost('brideParents', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold mb-1 text-stone-700">Groom’s Parents</label>
                            <input
                              type="text"
                              value={hosts.groomParents || ''}
                              onChange={(e) => updateHost('groomParents', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                            />
                          </div>
                        </>
                      )}

                      {occ === 'baby-shower' && (
                        <div>
                          <label className="block text-[11px] font-bold mb-1 text-stone-700">Expected Arrival Line</label>
                          <input
                            type="text"
                            value={hosts.dueDateLine || ''}
                            onChange={(e) => updateHost('dueDateLine', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                          />
                        </div>
                      )}

                      {occ === 'holy-communion' && (
                        <>
                          <div>
                            <label className="block text-[11px] font-bold mb-1 text-stone-700">Invited By (Parents)</label>
                            <input
                              type="text"
                              value={hosts.invitedBy || ''}
                              onChange={(e) => updateHost('invitedBy', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold mb-1 text-stone-700">Godparents</label>
                            <input
                              type="text"
                              value={hosts.godparents || ''}
                              onChange={(e) => updateHost('godparents', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold mb-1 text-stone-700">Main Date</label>
                        <input
                          type="date"
                          value={hosts.date || ''}
                          onChange={(e) => updateHost('date', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1 text-stone-700">City / Venue Location</label>
                        <input
                          type="text"
                          value={hosts.city || ''}
                          onChange={(e) => updateHost('city', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold mb-1 text-stone-700">Top Blessing / Eyebrow Heading</label>
                      <input
                        type="text"
                        value={hosts.title || ''}
                        onChange={(e) => updateHost('title', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                      />
                    </div>

                    {occ === 'house-party' && (
                      <div>
                        <label className="block text-[11px] font-bold mb-1 text-stone-700">Food, Drinks &amp; Music Highlights</label>
                        <input
                          type="text"
                          value={hosts.menuHighlights || ''}
                          onChange={(e) => updateHost('menuHighlights', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                        />
                      </div>
                    )}

                    {occ === 'holy-communion' && (
                      <div>
                        <label className="block text-[11px] font-bold mb-1 text-stone-700">Scripture / Bible Verse</label>
                        <textarea
                          rows={2}
                          value={hosts.bibleVerse || ''}
                          onChange={(e) => updateHost('bibleVerse', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold mb-1 text-stone-700">Story / Warm Welcome Note</label>
                      <textarea
                        rows={3}
                        value={hosts.welcomeQuote || ''}
                        onChange={(e) => updateHost('welcomeQuote', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                      />
                    </div>
                  </div>
                </AccordionCard>

                {/* ROW 2: SCHEDULE & EVENTS */}
                <AccordionCard
                  id="events"
                  isOpen={openContentRow === 'events'}
                  onToggle={toggleContentRow}
                  icon={Calendar}
                  title="Events & itinerary"
                  subtitle={`${(data.events || []).length} scheduled gathering(s)`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addEvent}
                        className="px-3.5 py-1.5 rounded-full bg-white border border-[#E6D5BF] hover:border-[#8B6F47] text-xs font-semibold flex items-center gap-1 cursor-pointer text-[#5C4938]"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#8B6F47]" /> Add Event
                      </button>
                    </div>
                    {(data.events || []).map((ev, idx) => (
                      <div key={ev.id || idx} className="p-3.5 rounded-xl border border-[#E6D5BF] bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B6F47]">
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
                            className="px-3 py-2 rounded-lg border border-[#E6D5BF] text-xs bg-[#FAF8F5]"
                          />
                          <input
                            type="text"
                            placeholder="Time (e.g. 07:00 PM)"
                            value={ev.time || ''}
                            onChange={(e) => updateEvent(idx, 'time', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-[#E6D5BF] text-xs bg-[#FAF8F5]"
                          />
                          <input
                            type="text"
                            placeholder="Date label"
                            value={ev.date || ''}
                            onChange={(e) => updateEvent(idx, 'date', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-[#E6D5BF] text-xs bg-[#FAF8F5]"
                          />
                          <input
                            type="text"
                            placeholder="Venue Name"
                            value={ev.venue || ''}
                            onChange={(e) => updateEvent(idx, 'venue', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-[#E6D5BF] text-xs bg-[#FAF8F5]"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Full Street Address"
                          value={ev.address || ''}
                          onChange={(e) => updateEvent(idx, 'address', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[#E6D5BF] text-xs bg-[#FAF8F5]"
                        />
                      </div>
                    ))}
                  </div>
                </AccordionCard>

                {/* ROW 3: PHOTOS & GALLERY */}
                <AccordionCard
                  id="photos"
                  isOpen={openContentRow === 'photos'}
                  onToggle={toggleContentRow}
                  icon={ImageIcon}
                  title="Photos & gallery"
                  subtitle={`${data.photos?.cover ? 'Custom cover set' : 'Illustrated hero scene'} · ${(data.gallery || []).length} gallery image(s)`}
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                      <div className="flex flex-wrap gap-2.5 items-center">
                        <label className="px-4 py-2 rounded-xl border border-[#E6D5BF] bg-white text-xs font-semibold cursor-pointer hover:border-[#8B6F47] text-[#1A120E]">
                          Upload Cover Photo
                          <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                        </label>
                        <label className="px-4 py-2 rounded-xl border border-[#E6D5BF] bg-white text-xs font-semibold cursor-pointer hover:border-[#8B6F47] text-[#1A120E]">
                          Add Gallery Photos
                          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                        </label>
                      </div>
                      {data.photos?.cover && (
                        <button
                          type="button"
                          onClick={() => commitChange((prev) => ({ ...prev, photos: { ...(prev.photos || {}), cover: '' } }))}
                          className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                        >
                          Use Illustrated Scene Instead
                        </button>
                      )}
                    </div>

                    {(data.gallery || []).length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                        {(data.gallery || []).map((g, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden border border-[#E6D5BF] group bg-white">
                            <img src={resolveAssetUrl(g.url)} alt={g.caption || 'Gallery'} className="w-full h-20 object-cover" />
                            <button
                              type="button"
                              onClick={() => commitChange(p => ({ ...p, gallery: p.gallery.filter((_, idx) => idx !== i) }))}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/75 text-white text-xs flex items-center justify-center cursor-pointer"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionCard>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('design')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2D3BA] bg-white text-[#5C4938] text-xs font-bold tracking-widest uppercase cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Design</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('extras')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B6F47] hover:bg-[#755C3A] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Extras</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: EXTRAS ===================== */}
          {activeTab === 'extras' && (
            <div className="space-y-6">
              <div>
                <h2 className="site-display text-3xl font-normal text-[#1A120E]">
                  Add interactive touches
                </h2>
                <p className="text-sm text-[#6E5C4B] font-light mt-1">
                  Configure celebration particles, soundtrack, guest poll, and RSVP deadline.
                </p>
              </div>

              <div className="space-y-3">
                {/* ROW 1: CELEBRATION EFFECTS & SFX */}
                <AccordionCard
                  id="effects"
                  isOpen={openExtrasRow === 'effects'}
                  onToggle={toggleExtrasRow}
                  icon={Sparkles}
                  title="Atmosphere & particles"
                  subtitle={`Effect: ${data.effect || 'confetti'} · Sound ${data.soundEffects !== false ? 'On' : 'Muted'}`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-stone-600">Select floating animation style</span>
                      <button
                        type="button"
                        onClick={() => commitChange((prev) => ({ ...prev, soundEffects: prev.soundEffects === false }))}
                        className="px-3 py-1.5 rounded-full border border-[#E6D5BF] bg-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-[#1A120E]"
                      >
                        {data.soundEffects !== false ? <Volume2 className="w-3.5 h-3.5 text-[#8B6F47]" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span>{data.soundEffects !== false ? 'SFX On' : 'SFX Muted'}</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['confetti', 'colorful', 'petals', 'hearts', 'stars', 'fireworks', 'none'].map((ef) => (
                        <button
                          key={ef}
                          type="button"
                          onClick={() => commitChange((prev) => ({ ...prev, effect: ef }))}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize border cursor-pointer ${
                            data.effect === ef
                              ? 'bg-[#1A120E] text-[#E6C88A] border-[#C8A055]'
                              : 'border-[#E6D5BF] bg-white text-[#5C4938]'
                          }`}
                        >
                          {ef}
                        </button>
                      ))}
                    </div>
                  </div>
                </AccordionCard>

                {/* ROW 2: BACKGROUND MUSIC */}
                <AccordionCard
                  id="music"
                  isOpen={openExtrasRow === 'music'}
                  onToggle={toggleExtrasRow}
                  icon={Music}
                  title="Background music"
                  subtitle={selectedTrack ? `${selectedTrack.name} · ${selectedTrack.mood}` : 'Optional guest soundtrack'}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {tracks.map((tr) => {
                      const selected = data.music === tr.id;
                      const playing = playingTrackId === tr.id;
                      return (
                        <div
                          key={tr.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-2 bg-white ${
                            selected ? 'border-[#8B6F47] bg-[#FDF8EC] ring-1 ring-[#8B6F47]/35' : 'border-[#E6D5BF]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => commitChange((prev) => ({ ...prev, music: tr.id }))}
                            className="text-left min-w-0 flex-1 cursor-pointer"
                          >
                            <div className="text-xs font-bold truncate text-[#1A120E]">{tr.name}</div>
                            <div className="text-[10.5px] text-stone-500 truncate">{tr.mood}</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleMusic(tr)}
                            className="w-7 h-7 rounded-full border border-[#E6D5BF] bg-[#FAF5ED] flex items-center justify-center shrink-0 cursor-pointer text-[#8B6F47]"
                            title={playing ? 'Stop preview' : 'Play preview'}
                          >
                            {playing ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </AccordionCard>

                {/* ROW 3: BABY SHOWER GENDER POLL */}
                {occ === 'baby-shower' && (
                  <AccordionCard
                    id="poll"
                    isOpen={openExtrasRow === 'poll'}
                    onToggle={toggleExtrasRow}
                    icon={Sparkles}
                    title="“Team Pink or Team Blue?” poll"
                    subtitle={data.enableGenderPoll !== false ? 'Enabled inside invite' : 'Hidden'}
                  >
                    <label className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-[#E6D5BF] cursor-pointer">
                      <span className="text-xs text-stone-600">Let guests cast an interactive guess right inside the invite.</span>
                      <input
                        type="checkbox"
                        className="w-5 h-5 cursor-pointer accent-[#8B6F47]"
                        checked={data.enableGenderPoll !== false}
                        onChange={(e) => commitChange((prev) => ({ ...prev, enableGenderPoll: e.target.checked }))}
                      />
                    </label>
                  </AccordionCard>
                )}

                {/* ROW 4: RSVP SETTINGS */}
                <AccordionCard
                  id="rsvp"
                  isOpen={openExtrasRow === 'rsvp'}
                  onToggle={toggleExtrasRow}
                  icon={Send}
                  title="RSVP form settings"
                  subtitle={data.rsvpConfig?.enabled !== false ? (data.rsvpConfig?.deadline || 'Active for guests') : 'RSVP section hidden'}
                >
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-[#1A120E]">
                      <input
                        type="checkbox"
                        checked={data.rsvpConfig?.enabled !== false}
                        onChange={(e) => commitChange(p => ({ ...p, rsvpConfig: { ...(p.rsvpConfig || {}), enabled: e.target.checked } }))}
                        className="accent-[#8B6F47]"
                      />
                      <span>Show RSVP Section</span>
                    </label>
                    <input
                      type="text"
                      placeholder="RSVP Deadline line (e.g. Kindly RSVP by 10th Dec)"
                      value={data.rsvpConfig?.deadline || ''}
                      onChange={(e) => commitChange(p => ({ ...p, rsvpConfig: { ...(p.rsvpConfig || {}), deadline: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-white"
                    />
                  </div>
                </AccordionCard>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2D3BA] bg-white text-[#5C4938] text-xs font-bold tracking-widest uppercase cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Content</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('publish')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B6F47] hover:bg-[#755C3A] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer"
                >
                  <span>Publish &amp; Export</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ===================== TAB 4: PUBLISH ===================== */}
          {activeTab === 'publish' && (
            <div className="space-y-6">
              <div>
                <h2 className="site-display text-3xl font-normal text-[#1A120E]">
                  Publish &amp; export
                </h2>
                <p className="text-sm text-[#6E5C4B] font-light mt-1">
                  Download standalone client HTML, print-ready A4 PDF, or push to GitHub Pages.
                </p>
              </div>

              {/* PRIMARY FINISH & PUBLISH HERO CARD — Matches Wedding Studio */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2B1E17] via-[#3D2C22] to-[#2B1E17] text-white shadow-2xl border border-[#C5A880]/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30">
                        <Sparkles className="w-3 h-3" />
                        Client Ready
                      </span>
                      <span className="text-[11px] text-stone-300 font-mono">
                        /published/{activeSlug}.html
                      </span>
                    </div>
                    <h3 className="site-display text-2xl sm:text-3xl font-normal text-white leading-tight">
                      Finish &amp; Publish for {primaryTitleLabel}
                    </h3>
                    <p className="text-xs text-stone-300 font-light max-w-xl leading-relaxed">
                      Downloads standalone <strong className="text-[#FFD700]">{activeSlug}.html</strong> with your exact artwork, reveal ritual, and music for offline sharing.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadHtml}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D5A021] via-[#FFD700] to-[#E6C35C] hover:from-[#C4901C] hover:to-[#D5A021] text-[#2B1E17] font-bold text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shrink-0"
                  >
                    <CheckCheck className="w-4 h-4 text-[#2B1E17]" />
                    <span>Download HTML</span>
                  </button>
                </div>

                {/* Live URL Box */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#FFD700]/35 space-y-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#FFD700] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Live Client Invitation URL</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-white/90 truncate">{publishedUrl}</span>
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="px-3 py-1.5 rounded-lg bg-white text-[#1A120E] text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* CUSTOM SLUG & GITHUB SYNC */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6D5BF] shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#8B6F47]" />
                  <h3 className="site-display text-xl font-normal text-[#1A120E]">
                    Custom Link &amp; GitHub Pages Sync
                  </h3>
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1 text-stone-600">Custom Invitation Link Slug</label>
                  <input
                    type="text"
                    value={data.customSlug || activeSlug}
                    onChange={(e) => commitChange((prev) => ({ ...prev, customSlug: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs font-mono bg-[#FAF8F5]"
                  />
                </div>
                <div className="pt-1 space-y-2">
                  <p className="text-xs text-stone-500">
                    Optional: paste your GitHub Personal Access Token (stored in your browser only) to push <code className="px-1 bg-[#FAF5ED] rounded">/published/{activeSlug}.html</code> live.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="password"
                      placeholder="ghp_... GitHub Personal Access Token"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#E6D5BF] text-xs bg-[#FAF8F5]"
                    />
                    <button
                      type="button"
                      disabled={isPublishing}
                      onClick={handlePublishLive}
                      className="px-5 py-2.5 rounded-xl bg-[#8B6F47] hover:bg-[#755C3A] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      {isPublishing ? 'Publishing...' : 'Publish Live'}
                    </button>
                  </div>
                </div>
              </div>

              {/* PRINT PDF & WHATSAPP SHARE */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6D5BF] shadow-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadHtml}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#E6D5BF] bg-[#FAF8F5] hover:border-[#8B6F47] text-xs font-bold uppercase tracking-wider text-[#1A120E] cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#8B6F47]" />
                    <span>Download Standalone HTML</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportPdf}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#E6D5BF] bg-[#FAF8F5] hover:border-[#8B6F47] text-xs font-bold uppercase tracking-wider text-[#1A120E] cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#8B6F47]" />
                    <span>Save / Print PDF</span>
                  </button>
                </div>
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Share on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PHONE SIMULATOR — Matches Wedding Studio */}
        <div
          className={`w-full lg:w-1/2 bg-[#EAE1D3] p-4 sm:p-6 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-[#DECFAF] relative overflow-hidden ${
            mobilePane === 'editor' ? 'hidden lg:flex' : ''
          }`}
        >
          {/* TOP CONTROLS BAR: DEVICE SWITCHER + REPLAY, INVITE, WHATSAPP PREVIEW */}
          <div className="mb-4 flex items-center justify-between w-full max-w-md px-2 z-10 gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full border border-[#D5CFC5] shadow-xs">
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-full text-xs cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-[#2B1E17] text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Mobile Preview"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-full text-xs cursor-pointer ${
                  previewDevice === 'tablet' ? 'bg-[#2B1E17] text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Tablet Preview"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-full text-xs cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-[#2B1E17] text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Desktop Preview"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setReplayKey((k) => k + 1);
                  setSimulatorMode('replay');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  simulatorMode === 'replay'
                    ? 'bg-[#1A120E] text-[#E6C88A] border border-[#C8A055]/60'
                    : 'bg-white text-stone-700 border border-[#D5CFC5] hover:bg-stone-50'
                }`}
                title="Replay Opening Reveal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>

              <button
                type="button"
                onClick={() => setSimulatorMode('invite')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                  simulatorMode === 'invite'
                    ? 'bg-[#1A120E] text-[#E6C88A] border border-[#C8A055]/60'
                    : 'bg-white text-stone-700 border border-[#D5CFC5] hover:bg-stone-50'
                }`}
                title="Full Invitation View"
              >
                Invite
              </button>

              <button
                type="button"
                onClick={() => setSimulatorMode('whatsapp')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                  simulatorMode === 'whatsapp'
                    ? 'bg-[#1A120E] text-[#E6C88A] border border-[#C8A055]/60'
                    : 'bg-white text-stone-700 border border-[#D5CFC5] hover:bg-stone-50'
                }`}
                title="WhatsApp Share Preview"
              >
                WhatsApp preview
              </button>
            </div>
          </div>

          {/* HARDWARE PHONE SIMULATOR FRAME */}
          <div
            data-simulator-frame="true"
            className={`transition-all duration-500 overflow-hidden rounded-[40px] shadow-2xl border-[10px] border-[#1C1917] bg-white relative [contain:paint] isolate ${
              previewDevice === 'mobile'
                ? 'w-[390px] max-w-full h-[720px] max-h-[82vh]'
                : previewDevice === 'tablet'
                  ? 'w-[600px] max-w-full h-[720px] max-h-[82vh]'
                  : 'w-full h-[740px] max-h-[82vh]'
            }`}
          >
            {previewDevice === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#1C1917] rounded-b-xl z-40 pointer-events-none" />
            )}

            {simulatorMode === 'whatsapp' ? (
              <OccasionWhatsAppPreview data={data} publishedUrl={publishedUrl} />
            ) : (
              <OccasionInvitePreview data={data} replayKey={replayKey} />
            )}
          </div>
        </div>
      </main>

      {/* FULLSCREEN GUEST PREVIEW OVERLAY — Matches Wedding Studio Guest Preview */}
      {showGuestPreview && (
        <div className="fixed inset-0 z-50 bg-[#120C0A]/95 backdrop-blur-md flex flex-col">
          <div className="px-4 sm:px-6 py-3 border-b border-[#C8A055]/30 bg-[#160F0C] flex items-center justify-between text-[#FBF7F0]">
            <div className="flex items-center gap-3">
              <span className="site-display text-lg text-[#E6C88A]">Guest Preview</span>
              <span className="text-xs text-[#C8B9A6] hidden sm:inline">· {primaryTitleLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setReplayKey((k) => k + 1)}
                className="px-3 py-1.5 rounded-full border border-[#C8A055]/45 bg-[#241914] text-xs font-semibold text-[#F4E7D0] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#E6C88A]" /> Replay Reveal
              </button>
              <button
                type="button"
                onClick={() => setShowGuestPreview(false)}
                className="px-3.5 py-1.5 rounded-full paigaam-gold-btn text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Back to Studio
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex justify-center p-4 sm:p-6">
            <div className="w-full max-w-[440px] h-[780px] rounded-[36px] border-[8px] border-[#2B1E17] bg-white shadow-2xl overflow-hidden">
              <OccasionInvitePreview data={data} replayKey={replayKey} />
            </div>
          </div>
        </div>
      )}

      {/* SAVED CLIENTS MODAL */}
      {showClientsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#E6D5BF] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6D5BF]">
              <div>
                <h2 className="site-display text-2xl font-normal text-[#1A120E]">Saved Client Projects</h2>
                <p className="text-xs text-stone-500">Reopen any client template right where you left off</p>
              </div>
              <button
                type="button"
                onClick={() => setShowClientsModal(false)}
                className="w-8 h-8 rounded-full border border-[#E6D5BF] text-sm font-bold cursor-pointer hover:bg-[#FAF5ED]"
              >
                ×
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-4 flex-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B6F47] mb-2">
                  Current Studio ({occ.replace(/-/g, ' ')})
                </p>
                {occClientsList.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">No saved {occ.replace(/-/g, ' ')} clients yet — click “Save” to store this draft.</p>
                ) : (
                  <div className="space-y-2">
                    {occClientsList.map((c) => (
                      <div key={c.slug} className="p-3 rounded-xl border border-[#E6D5BF] flex items-center justify-between gap-2 bg-[#FAF8F5]">
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate text-[#1A120E]">{c.bride} {c.groom ? `& ${c.groom}` : ''}</div>
                          <div className="text-[10px] text-stone-500 font-mono truncate">{c.slug}.html</div>
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
                            className="px-3 py-1.5 rounded-lg bg-[#1A120E] text-[#E6C88A] text-[11px] font-semibold cursor-pointer"
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
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
                    Other Saved Clients
                  </p>
                  <div className="space-y-1.5">
                    {otherClientsList.slice(0, 8).map((c) => (
                      <div key={c.slug} className="p-2.5 rounded-xl border border-[#E6D5BF] flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate text-[#1A120E]">{c.bride} &amp; {c.groom}</div>
                          <div className="text-[10px] text-stone-500 uppercase">{c.occasion} · {c.slug}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const target = getOccasionUrl(c.occasion || 'wedding');
                            window.location.href = target.replace('#studio', `?client=${encodeURIComponent(c.slug)}#studio`);
                          }}
                          className="px-3 py-1 rounded-lg border border-[#E6D5BF] text-[11px] font-semibold cursor-pointer text-[#5C4938] hover:border-[#8B6F47]"
                        >
                          Switch Studio
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E6D5BF] flex gap-3">
              <button
                type="button"
                onClick={handleStartCleanClient}
                className="flex-1 py-2.5 rounded-xl border border-[#E2D3BA] font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-[#FAF5ED] text-[#5C4938]"
              >
                Start Clean Client
              </button>
              <button
                type="button"
                onClick={() => setShowClientsModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1A120E] text-[#E6C88A] font-bold text-xs uppercase tracking-wider cursor-pointer"
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
