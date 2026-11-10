import React, { useState, useEffect } from 'react';
import { 
  Palette, BookOpen, Sparkles, Globe, Download, Printer, Video, 
  Smartphone, Tablet, Monitor, Plus, Trash2, Check, ArrowRight, ArrowLeft,
  Volume2, VolumeX, Shield, CircleDot, Bell, MessageSquare, ChevronDown, ChevronUp,
  Image, Mail, Stamp, PartyPopper, Music as MusicIcon, Compass, MapPin, Upload, Camera, Crop,
  RotateCcw, Share2, Copy, CheckCheck, Phone, Video as VideoIcon, MoreVertical,
  Calendar, Clock, Eye, Lock, Users, Play, PhoneCall, Feather, CreditCard, Package,
  Train, Link, Flower2, Flower, Scroll, Bird, Lamp, Key, DoorClosed, Building2,
  Film, Heart, DoorOpen, Truck, Flame, Star, Type
} from 'lucide-react';
import PhotoAdjustCropModal from './PhotoAdjustCropModal';
import { 
  OCCASIONS, TEMPLATES, REVEAL_STYLES, PALETTES, MUSIC_TRACKS, 
  CELEBRATION_EFFECTS, ATMOSPHERE_STYLES, ATMOSPHERE_INTENSITIES,
  TYPOGRAPHY_SUITES, HEADING_FONTS, BODY_FONTS, SCRIPT_FONTS 
} from '../../data/presets';
import InvitationExperience from '../invitation/InvitationExperience';
import { soundManager } from '../../utils/audio';
import { triggerCelebration } from '../../utils/confetti';
import { toBase64Optimized } from '../../utils/imageOptimizer';
import { getThemeEventImage, getThemeHeroImage } from '../../utils/themeImages';

const REVEAL_ICON_MAP = {
  Mail,
  DoorClosed,
  Heart,
  Stamp,
  PhoneCall,
  CreditCard,
  Package,
  Train,
  Flower2,
  Flower,
  Bird,
  Sparkles,
  Key,
  Users,
  Play,
  Feather,
  Calendar,
  Film,
  Link,
  Flame,
  Scroll,
  Lamp,
  Truck,
  Building2,
  Video,
  DoorOpen,
};

// Helper to convert any image URL to base64 DataURI for 100% self-contained offline files
async function toBase64(url) {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise(resolve => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result);
      r.onerror = () => resolve(url);
      r.readAsDataURL(blob);
    });
  } catch (e) {
    return url;
  }
}

export function formatDisplayDate(dateStr) {
  if (!dateStr) return '9th December 2026';
  if (/[a-zA-Z]/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'long' });
  const year = d.getFullYear();
  const s = ['th', 'st', 'nd', 'rd'], v = day % 100;
  const ord = day + (s[(v - 20) % 10] || s[v] || s[0]);
  return `${ord} ${month} ${year}`;
}

export function getMonogramInitials(hosts, monogram) {
  if (monogram?.initials && monogram.initials !== 'B & G' && monogram.initials !== 'A & S') {
    return monogram.initials;
  }
  const bI = (hosts?.bride || 'Preeti').trim()[0]?.toUpperCase() || 'P';
  const gI = (hosts?.groom || 'Ashish').trim()[0]?.toUpperCase() || 'A';
  return `${bI} & ${gI}`;
}

export default function StudioWizard({ initialData, onSave, onExitToHome, onOpenDashboard, onOpenLivePreview }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('design');
  const [previewDevice, setPreviewDevice] = useState('mobile');
  const [simulatorMode, setSimulatorMode] = useState('invite'); // 'invite', 'replay', 'whatsapp'
  const [previewGroup, setPreviewGroup] = useState('all');
  const [playingMusicId, setPlayingMusicId] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExportingHtml, setIsExportingHtml] = useState(false);
  const [galleryPickerField, setGalleryPickerField] = useState(null);
  const [cropModalConfig, setCropModalConfig] = useState(null);
  const [publishedInfo, setPublishedInfo] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copiedPublished, setCopiedPublished] = useState(false);
  const [isEditCoupleModalOpen, setIsEditCoupleModalOpen] = useState(false);
  const [clientForm, setClientForm] = useState({
    bride: initialData?.hosts?.bride || '',
    groom: initialData?.hosts?.groom || '',
    date: initialData?.hosts?.date || '2026-12-09',
    city: initialData?.hosts?.city || 'Meerut',
  });

  // Accordion expanded row state
  const [openRow, setOpenRow] = useState('template');

  // Video & PDF Export state
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    if (onSave) {
      onSave(data);
    }
  }, [data, onSave]);

  const toggleRow = (rowName) => {
    setOpenRow(prev => prev === rowName ? null : rowName);
  };

  const getCoupleSlug = (hosts = data.hosts) => {
    const brideStr = (hosts?.bride || 'bride').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const groomStr = (hosts?.groom || 'groom').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `${brideStr || 'bride'}-and-${groomStr || 'groom'}`;
  };

  const updateHosts = (field, val) => {
    setData(prev => {
      const nextHosts = { ...prev.hosts, [field]: val };
      const brideName = field === 'bride' ? val : (prev.hosts?.bride || '');
      const groomName = field === 'groom' ? val : (prev.hosts?.groom || '');

      // Dynamic initials for monogram seal
      const bI = brideName.trim()[0]?.toUpperCase() || '';
      const gI = groomName.trim()[0]?.toUpperCase() || '';
      const autoInitials = (bI && gI) ? `${bI} & ${gI}` : (prev.monogram?.initials || '');

      // Dynamic wedding hashtag
      const cleanB = brideName.replace(/\s+/g, '');
      const cleanG = groomName.replace(/\s+/g, '');
      const prevHashtag = prev.hosts?.hashtag || '';
      const isAutoHashtag = !prevHashtag || prevHashtag.includes('Weds');
      const autoHashtag = isAutoHashtag && (cleanB || cleanG) ? `#${cleanB || 'Bride'}Weds${cleanG || 'Groom'}` : prevHashtag;

      return {
        ...prev,
        hosts: {
          ...nextHosts,
          hashtag: autoHashtag,
        },
        monogram: {
          ...prev.monogram,
          initials: autoInitials || prev.monogram?.initials || '',
        },
      };
    });
  };

  const handleStartNewClient = () => {
    if (window.confirm("Start a new invitation for another client? You can enter a fresh couple's names, event details, and photos.")) {
      setData(prev => ({
        ...prev,
        hosts: {
          ...prev.hosts,
          bride: '',
          groom: '',
          hashtag: '',
          date: '2026-12-09',
          city: 'Meerut',
          welcomeQuote: "Two hearts, one lifelong promise under the stars.",
        },
        monogram: { initials: '' },
      }));
      setPublishedInfo(null);
      setActiveTab('content');
    }
  };

  const updatePhotos = (field, val) => {
    setData(prev => ({
      ...prev,
      photos: { ...prev.photos, [field]: val },
    }));
  };

  const updateRsvpConfig = (field, val) => {
    setData(prev => ({
      ...prev,
      rsvpConfig: { ...prev.rsvpConfig, [field]: val },
    }));
  };

  const applyPhotoPreset = (presetType) => {
    if (presetType === 'wedding-all') {
      setData(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          bride: './images/bride.webp',
          groom: './images/groom.webp',
          cover: './images/themes/Luxe-Pastel-Caricature/04-pheras.webp',
        },
        gallery: [
          { url: './images/couple-potrait.webp', caption: 'In each other\'s eyes' },
          { url: './images/couple-landscape-1.webp', caption: 'Moments under the palace sun' },
          { url: './images/couple-landscape-2.webp', caption: 'Lakeside serenity in Udaipur' },
          { url: './images/couple-potrait-1.webp', caption: 'Laughs & forever promises' },
          { url: './images/couple-landscape-3.webp', caption: 'Golden hour at Lake Pichola' },
          { url: './images/couple-landscape-4.webp', caption: 'Under the starlit sky' },
          { url: './images/couple-udaipur-boat.webp', caption: 'Sailing together' },
          { url: './images/couple-udaipur-rooftop.webp', caption: 'Rooftop whispers' },
          { url: './images/couple-udaipur-bazaar.webp', caption: 'Old city charm' },
          { url: './images/couple-udaipur-hilltop.webp', caption: 'Monsoon palace views' },
          { url: './images/couple-udaipur-haveli.webp', caption: 'Courtyard royalty' },
          { url: './images/couple-udaipur-ghat.webp', caption: 'At the water\'s edge' },
        ]
      }));
    } else if (presetType === 'royal') {
      updatePhotos('bride', './images/bride.webp');
      updatePhotos('groom', './images/groom.webp');
      updatePhotos('cover', './images/templates/rajwada.webp');
    } else if (presetType === 'caricature') {
      updatePhotos('bride', './images/bride.webp');
      updatePhotos('groom', './images/groom.webp');
      updatePhotos('cover', './images/themes/Luxe-Pastel-Caricature/04-pheras.webp');
    } else if (presetType === 'bougain') {
      updatePhotos('bride', './images/bride.webp');
      updatePhotos('groom', './images/groom.webp');
      updatePhotos('cover', './images/baugain/hero.webp');
    } else if (presetType === 'zardozi') {
      updatePhotos('bride', './images/templates/zardozi.webp');
      updatePhotos('groom', './images/templates/pichwai.webp');
      updatePhotos('cover', './images/templates/zardozi.webp');
    }
  };

  const compressImageFile = (file, maxDimension = 900, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e, targetField) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawSrc = event.target.result;
      const isEvent = typeof targetField === 'object' && targetField.type === 'event';
      const aspect = targetField === 'cover' ? 9 / 16 : isEvent ? 9 / 16 : 3 / 4;
      const fieldTitle =
        targetField === 'cover'
          ? 'Hero Cover Photo'
          : targetField === 'bride'
          ? 'Bride Photo'
          : isEvent
          ? (targetField.eventName || 'Event Photo')
          : 'Groom Photo';
      setCropModalConfig({
        isOpen: true,
        imageSrc: rawSrc,
        title: `Adjust & Crop - ${fieldTitle}`,
        targetField,
        defaultAspect: aspect,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyCrop = (croppedDataUrl) => {
    if (!cropModalConfig?.targetField) return;
    const target = cropModalConfig.targetField;
    if (typeof target === 'object' && target.type === 'galleryItem') {
      setData(prev => {
        const g = [...(prev.gallery || [])];
        if (g[target.index]) {
          g[target.index] = { ...g[target.index], url: croppedDataUrl };
        }
        return { ...prev, gallery: g };
      });
    } else if (typeof target === 'object' && target.type === 'event') {
      updateEvent(target.eventId, 'image', croppedDataUrl);
    } else {
      updatePhotos(target, croppedDataUrl);
    }
    setCropModalConfig(null);
  };

  const addGalleryPhoto = (url, caption = '', tag = 'General') => {
    setData(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), { url, caption: caption || 'New Memory', tag: tag || 'General' }]
    }));
  };

  const removeGalleryPhoto = (index) => {
    setData(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index)
    }));
  };

  const updateGalleryItem = (index, key, val) => {
    setData(prev => {
      const g = [...(prev.gallery || [])];
      if (g[index]) {
        g[index] = { ...g[index], [key]: val };
      }
      return { ...prev, gallery: g };
    });
  };

  const moveGalleryPhoto = (index, direction) => {
    setData(prev => {
      const g = [...(prev.gallery || [])];
      const targetIdx = index + direction;
      if (targetIdx < 0 || targetIdx >= g.length) return prev;
      const temp = g[index];
      g[index] = g[targetIdx];
      g[targetIdx] = temp;
      return { ...prev, gallery: g };
    });
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newPhotos = [];
    for (const file of files) {
      const dataUrl = await compressImageFile(file, 900, 0.8);
      const cleanCaption = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      newPhotos.push({
        url: dataUrl,
        caption: cleanCaption || 'Our Special Memory',
        tag: 'General'
      });
    }
    setData(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), ...newPhotos]
    }));
    e.target.value = '';
  };

  const handleChangeSingleGalleryPhoto = async (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawSrc = event.target.result;
      setCropModalConfig({
        isOpen: true,
        imageSrc: rawSrc,
        title: `Adjust & Crop - Gallery Memory #${index + 1}`,
        targetField: { type: 'galleryItem', index },
        defaultAspect: 4 / 5,
      });
    };
    reader.readAsDataURL(file);
  };

  const resetGalleryToDefault = () => {
    if (window.confirm('Reset Moments & Memories gallery to the 12 curated royal palace photos?')) {
      setData(prev => ({
        ...prev,
        gallery: [
          { url: './images/couple-potrait.webp', caption: "In each other's eyes", tag: 'Wedding' },
          { url: './images/couple-landscape-1.webp', caption: 'Moments under the palace sun', tag: 'Haldi' },
          { url: './images/couple-landscape-2.webp', caption: 'Lakeside serenity in Udaipur', tag: 'General' },
          { url: './images/couple-potrait-1.webp', caption: 'Laughs & forever promises', tag: 'Sangeet' },
          { url: './images/couple-landscape-3.webp', caption: 'Golden hour at Lake Pichola', tag: 'General' },
          { url: './images/couple-landscape-4.webp', caption: 'Under the starlit sky', tag: 'Reception' },
          { url: './images/couple-udaipur-boat.webp', caption: 'Sailing together', tag: 'General' },
          { url: './images/couple-udaipur-rooftop.webp', caption: 'Rooftop whispers', tag: 'General' },
          { url: './images/couple-udaipur-bazaar.webp', caption: 'Old city charm', tag: 'Mehndi' },
          { url: './images/couple-udaipur-hilltop.webp', caption: 'Monsoon palace views', tag: 'General' },
          { url: './images/couple-udaipur-haveli.webp', caption: 'Courtyard royalty', tag: 'Wedding' },
          { url: './images/couple-udaipur-ghat.webp', caption: "At the water's edge", tag: 'General' },
        ]
      }));
    }
  };

  const handlePickAsset = (url) => {
    if (!galleryPickerField) return;
    const currentTarget = galleryPickerField;
    setGalleryPickerField(null);

    const isCover = currentTarget === 'cover';
    const isBride = currentTarget === 'bride';
    const isGroom = currentTarget === 'groom';
    const isEvent = typeof currentTarget === 'object' && currentTarget.type === 'event';
    const fieldTitle = isCover
      ? 'Hero Cover Photo'
      : isBride
      ? 'Bride Photo'
      : isGroom
      ? 'Groom Photo'
      : isEvent
      ? (currentTarget.eventName || 'Event Photo')
      : 'Gallery Photo';
    const aspect = (isCover || isEvent) ? 9 / 16 : 3 / 4;

    setCropModalConfig({
      isOpen: true,
      imageSrc: url,
      title: `Adjust & Crop - ${fieldTitle}`,
      targetField: currentTarget,
      defaultAspect: aspect,
    });
  };

  const applyVenuePreset = (eventId, venueName, address) => {
    const query = `${venueName}, ${address}`;
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => {
        if (e.id === eventId) {
          return {
            ...e,
            venue: venueName,
            address: address,
            mapsQuery: query,
            mapsEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
            mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(query)}`,
          };
        }
        return e;
      }),
    }));
  };

  const addEvent = () => {
    const newEvt = {
      id: 'evt_' + Date.now(),
      name: 'New Celebration Event',
      date: 'Sunday, 14th February 2027',
      time: '06:00 PM onwards',
      venue: 'The Grand Lawn, The Oberoi Udaivilas',
      address: data.hosts?.city || 'Haridas Ji Ki Magri, Udaipur, Rajasthan 313001',
      mapsQuery: 'The Oberoi Udaivilas Udaipur',
      mapsEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent('The Oberoi Udaivilas Udaipur')}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
      mapsUrl: `https://maps.google.com/?q=${encodeURIComponent('The Oberoi Udaivilas Udaipur')}`,
      dressCode: 'Festive Traditional',
      group: 'all',
    };
    setData(prev => ({ ...prev, events: [...prev.events, newEvt] }));
  };

  const removeEvent = (id) => {
    setData(prev => ({ ...prev, events: prev.events.filter(e => e.id !== id) }));
  };

  const updateEvent = (id, field, val) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => {
        if (e.id === id) {
          const updated = { ...e, [field]: val };
          if (field === 'address' || field === 'venue') {
            const query = `${updated.venue ? updated.venue + ', ' : ''}${updated.address || 'Udaipur'}`;
            updated.mapsQuery = query;
            updated.mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
            updated.mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(query)}`;
          }
          return updated;
        }
        return e;
      }),
    }));
  };

  const getEventIsoDate = (evt, fallbackDate) => {
    if (evt.isoDate && /^\d{4}-\d{2}-\d{2}$/.test(evt.isoDate)) {
      return evt.isoDate;
    }
    if (evt.date && /^\d{4}-\d{2}-\d{2}$/.test(evt.date)) {
      return evt.date;
    }
    if (evt.date) {
      const cleaned = evt.date.replace(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),?\s*/i, '').replace(/(\d+)(st|nd|rd|th)/i, '$1');
      const parsed = new Date(cleaned);
      if (!isNaN(parsed.getTime())) {
        const y = parsed.getFullYear();
        const m = String(parsed.getMonth() + 1).padStart(2, '0');
        const d = String(parsed.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    }
    if (fallbackDate && /^\d{4}-\d{2}-\d{2}$/.test(fallbackDate)) {
      return fallbackDate;
    }
    return '2027-02-14';
  };

  const handleEventDateChange = (eventId, newIsoDate) => {
    if (!newIsoDate) return;
    const [y, m, d] = newIsoDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[dateObj.getDay()] || 'Day';
    const monthName = months[dateObj.getMonth()] || 'Month';
    
    const suffix = (num) => {
      if (num > 3 && num < 21) return 'th';
      switch (num % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    const formattedDate = `${dayName}, ${d}${suffix(d)} ${monthName} ${y}`;
    
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => {
        if (e.id === eventId) {
          return {
            ...e,
            isoDate: newIsoDate,
            date: formattedDate
          };
        }
        return e;
      })
    }));
  };

  const handlePlayMusicPreview = (trackId) => {
    if (playingMusicId === trackId) {
      soundManager.stop();
      setPlayingMusicId(null);
    } else {
      soundManager.playTrack(trackId, data.customMusicUrl);
      setPlayingMusicId(trackId);
    }
  };

  const selectMusic = (trackId) => {
    setData(prev => ({ ...prev, music: trackId }));
    soundManager.playTrack(trackId, data.customMusicUrl);
    setPlayingMusicId(trackId);
  };

  // 1. STANDALONE INTERACTIVE HTML FILE EXPORT
  // Generates 100% self-contained offline application with:
  // - Base64 inlined images (never broken in Downloads!)
  // - Interactive 3D Folding Card Doors for Caricature or Gold Scratch Date canvas
  // - Web Audio music synthesizer
  // - Meet the Couple Polaroids with circular icons & bios
  // - Hanging Wall Calendar with live countdown timer
  // - Lined notebook story & authentic celebration arches
  // - Interactive Multi-Step RSVP & clipboard hashtag copy
    const handleFinishAndPublish = async () => {
    setIsPublishing(true);
    await handleExportHtml();
    const slug = getCoupleSlug();
    const filename = `${slug}.html`;
    const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
    const liveUrl = isGitHubPages
      ? `https://aami672.github.io/wedding-invitation/published/${filename}`
      : `${window.location.origin}/published/${filename}`;

    setPublishedInfo({
      slug,
      filename,
      liveUrl,
      publishedAt: new Date().toLocaleTimeString(),
    });
    setIsPublishing(false);
    triggerCelebration('fireworks');
  };

  const handleExportHtml = async () => {
    setIsExportingHtml(true);
    const slug = getCoupleSlug();
    const selectedTmpl = TEMPLATES.find(t => t.id === data.template) || TEMPLATES[0];

    // Convert local images to base64 DataURIs (high-fidelity Retina resolution)
    const [
      b64Cover, b64Bride, b64Groom, b64Tmpl,
      b64Scooter, b64Haldi, b64Mehndi, b64Sangeet, b64Pheras, b64Reception,
    ] = await Promise.all([
      toBase64Optimized(
        (!data.photos?.cover || data.photos?.cover.includes('caricature.webp') || data.photos?.cover.includes('scooter_couple.webp'))
          ? getThemeHeroImage(selectedTmpl.id)
          : (data.photos?.cover || getThemeHeroImage(selectedTmpl.id)),
        1600, 0.90, false
      ),
      toBase64Optimized(data.photos?.bride || './images/preeti_bride.jpg', 1200, 0.92, false),
      toBase64Optimized(data.photos?.groom || './images/ashish_groom.jpg', 1200, 0.92, false),
      toBase64Optimized(selectedTmpl?.image, 1600, 0.90, false),
      toBase64Optimized('./images/caricature/scooter_couple.webp', 1000, 0.88, true),
      toBase64Optimized('./images/caricature/haldi_arch.webp', 800, 0.85, true),
      toBase64Optimized('./images/caricature/mehndi_arch.webp', 800, 0.85, true),
      toBase64Optimized('./images/caricature/sangeet_arch.webp', 800, 0.85, true),
      toBase64Optimized('./images/caricature/pheras_arch.webp', 800, 0.85, true),
      toBase64Optimized('./images/caricature/reception_arch.webp', 800, 0.85, true),
    ]);

    const b64Events = await Promise.all((data.events || []).map(async (evt, idx) => {
      let customB64 = '';
      if (evt.image || evt.img) {
        customB64 = await toBase64Optimized(evt.image || evt.img, 1200, 0.90, false);
      } else if (!isCaricature) {
        const themeArch = getThemeEventImage(data.template, evt, idx);
        if (themeArch) {
          customB64 = await toBase64Optimized(themeArch, 1200, 0.90, true);
        }
      }
      return {
        ...evt,
        customB64,
      };
    }));

    const galleryItems = (data.gallery && data.gallery.length > 0) ? data.gallery : [
      { url: './images/gallery/moment_1.jpg', caption: 'Flaunting those new rings and that forever kind of vibe' },
      { url: './images/gallery/moment_2.jpg', caption: 'Glowing against that striking backdrop' },
      { url: './images/gallery/moment_3.jpg', caption: 'Candid moments' },
      { url: './images/gallery/moment_4.jpg', caption: 'Sweet smiles that say it all' },
      { url: './images/gallery/moment_5.jpg', caption: 'Lost in a quiet, beautiful moment' },
      { url: './images/gallery/moment_6.jpg', caption: 'Just engaged and ready for the sweetest journey ahead' },
      { url: './images/gallery/moment_7.jpg', caption: 'Keeping it stylish together with pose' },
      { url: './images/gallery/moment_8.jpg', caption: 'Cutting into celebration mode ' },
      { url: './images/gallery/moment_9.jpg', caption: 'Striking a pose with effortless grace and timeless elegance' },
      { url: './images/gallery/moment_10.jpg', caption: 'Showcasing those special symbols of a brand new journey together' },
      { url: './images/gallery/moment_11.jpg', caption: 'Caught in a dreamy spotlight with a look of pure grace' },
      { url: './images/gallery/moment_12.jpg', caption: 'Sharing a close, quiet moment wrapped in love and warmth' },
      { url: './images/gallery/moment_13.jpg', caption: 'Crowning the celebration with a beautiful ring ceremony cake' },
      { url: './images/gallery/moment_14.jpg', caption: 'Where the celebrations and unforgettable memories come to life at Hotel Meenar' },
    ];
    const b64Gallery = await Promise.all(galleryItems.map(async (item) => ({
      b64: await toBase64Optimized(item.url || item.img, 1600, 0.92, false),
      caption: item.caption || item.title || 'Wedding Memory',
    })));

    const isCaricature = selectedTmpl.id === 'caricature';
    const isPichwai = selectedTmpl.id === 'pichwai';
    const isZardozi = selectedTmpl.id === 'zardozi';
    const isMela = selectedTmpl.id === 'mela';
    const isNewspaper = selectedTmpl.id === 'newspaper';
    const isBougain = selectedTmpl.id === 'bougain' || selectedTmpl.id === 'bougainvillea';

    const eventsJson = JSON.stringify(data.events || []);

    // Calendar math
    const d = new Date(data.hosts?.date || '2026-12-09');
    const validDate = !isNaN(d.getTime());
    const calMonthName = validDate ? d.toLocaleString('en-US', { month: 'long' }) : 'December';
    const calYear = validDate ? d.getFullYear() : 2026;
    const calDayNum = validDate ? d.getDate() : 9;
    const daysInMonth = validDate ? new Date(calYear, d.getMonth() + 1, 0).getDate() : 31;
    const firstDayIndex = validDate ? new Date(calYear, d.getMonth(), 1).getDay() : 3;

    const displayWeddingDate = formatDisplayDate(data.hosts?.date || '2026-12-09');
    const monogramInitials = getMonogramInitials(data.hosts, data.monogram);

    const standaloneHtml = `<!DOCTYPE html>
<html lang="en" data-publish-time="${Date.now()}" data-slug="${slug}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <title id="invitation-doc-title">${data.hosts?.bride || 'Preeti'} & ${data.hosts?.groom || 'Ashish'} — Wedding Invitation</title>
  <script>
    // 1. Storage cleanup - remove stale HTML caches that could block scripts
    (function() {
      try {
        for (var i = localStorage.length - 1; i >= 0; i--) {
          var k = localStorage.key(i);
          if (k && (k.indexOf('wishlys_published_html') === 0 || k === 'wishlys_published_html')) {
            localStorage.removeItem(k);
          }
        }
      } catch (e) {}
    })();

    // 2. Early-defined 3D Folding Doors & Invitation Unlock Handlers (Guaranteed ready before first paint)
    window._doorsOpened = false;
    window.unlockCaricatureDoors = function(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      if (window._doorsOpened) return;
      window._doorsOpened = true;

      var leftDoor = document.getElementById('door-left');
      var rightDoor = document.getElementById('door-right');
      var heartSeal = document.getElementById('door-heart-seal');

      if (leftDoor) {
        leftDoor.style.transform = 'perspective(1000px) rotateY(-125deg)';
      }
      if (rightDoor) {
        rightDoor.style.transform = 'perspective(1000px) rotateY(125deg)';
      }
      if (heartSeal) {
        heartSeal.style.transform = 'translate(-50%, -50%) scale(1.6)';
        heartSeal.style.opacity = '0';
      }

      try {
        if (window.sound && typeof window.sound.playChime === 'function') {
          window.sound.playChime(880);
        }
      } catch (audioErr) {}

      setTimeout(function() {
        if (typeof window.unlockInvitation === 'function') {
          window.unlockInvitation();
        }
      }, 700);
    };

    window.unlockInvitation = function() {
      var revs = document.querySelectorAll('#reveal-screen, #reveal-screen-folding, #reveal-screen-scratch');
      revs.forEach(function(rev) {
        rev.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(function() {
          rev.style.display = 'none';
        }, 500);
      });
      setTimeout(function() {
        var main = document.getElementById('main-invitation');
        if (main) {
          main.classList.remove('opacity-0');
          main.style.opacity = '1';
        }
        try {
          if (typeof triggerCelebrationEffect === 'function') triggerCelebrationEffect();
        } catch(e) {}
        try {
          if (!window.musicActive && window.sound) {
            window.sound.play();
            window.musicActive = true;
            var audioEq = document.getElementById('audio-eq');
            if (audioEq) audioEq.classList.remove('hidden');
            var audioText = document.getElementById('audio-btn-text');
            if (audioText) audioText.innerText = 'Playing';
          }
        } catch(e) {}
      }, 400);
    };

    // 3. High-speed Quota-Safe DOM Hydration from JSON (always succeeds)
    function hydrateSavedData() {
      try {
        var currentSlug = "${slug}";
        var pathSlug = window.location.pathname.split('/').pop().replace('.html', '') || currentSlug;
        var raw = localStorage.getItem('wishlys_published_data_' + pathSlug)
               || localStorage.getItem('wishlys_published_data_' + currentSlug)
               || localStorage.getItem('wishlys_published_data')
               || localStorage.getItem('wishlys_free_saved_data');
        if (!raw) return;
        var d = JSON.parse(raw);
        if (!d || !d.hosts) return;

        var resolveAssetUrl = function(url) {
          if (!url) return '';
          if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
          var inPublished = window.location.pathname.indexOf('/published/') !== -1;
          var clean = url.replace(/^\.?\//, '');
          return inPublished ? ('../' + clean) : ('./' + clean);
        };

        var bride = d.hosts.bride || 'Preeti';
        var groom = d.hosts.groom || 'Ashish';
        var dateStr = d.hosts.date || '2026-12-09';
        var city = d.hosts.city || 'Meerut';

        var bInit = (bride[0] || 'P').toUpperCase();
        var gInit = (groom[0] || 'A').toUpperCase();
        var initials = (d.monogram && d.monogram.initials && d.monogram.initials !== 'B & G' && d.monogram.initials !== 'A & S')
          ? d.monogram.initials
          : (bInit + ' & ' + gInit);

        var displayDate = dateStr;
        var parsedD = new Date(dateStr);
        if (!isNaN(parsedD.getTime())) {
          var day = parsedD.getDate();
          var month = parsedD.toLocaleString('en-US', { month: 'long' });
          var year = parsedD.getFullYear();
          var s = ['th', 'st', 'nd', 'rd'], v = day % 100;
          var ord = day + (s[(v - 20) % 10] || s[v] || s[0]);
          displayDate = ord + ' ' + month + ' ' + year;
        }

        // Title
        document.title = bride + ' & ' + groom + ' — Wedding Invitation';

        // Scratch screen elements
        var elScDate = document.getElementById('scratch-card-date');
        if (elScDate) elScDate.textContent = displayDate;
        var elScCity = document.getElementById('scratch-card-city');
        if (elScCity) elScCity.textContent = city;
        var elScNames = document.getElementById('scratch-card-names');
        if (elScNames) elScNames.textContent = bride + ' & ' + groom;
        var elScMono = document.getElementById('scratch-card-monogram');
        if (elScMono) elScMono.textContent = initials;
        var elScTitle = document.getElementById('scratch-title-names');
        if (elScTitle) elScTitle.textContent = bride + ' & ' + groom;

        // Toggle Reveal Screen between 3D Folding Doors & Scratch Card
        var revStyle = d.revealStyle || 'folding-doors';
        var isDoors = (revStyle === 'folding-doors') || (!revStyle && d.template === 'caricature') || (revStyle !== 'scratch-date');
        var foldingEl = document.getElementById('reveal-screen-folding');
        var scratchEl = document.getElementById('reveal-screen-scratch');
        if (foldingEl && scratchEl) {
          if (isDoors) {
            foldingEl.classList.remove('hidden');
            scratchEl.classList.add('hidden');
          } else {
            scratchEl.classList.remove('hidden');
            foldingEl.classList.add('hidden');
          }
        }
        var doorsGroom = document.getElementById('doors-groom-name');
        if (doorsGroom) doorsGroom.textContent = groom;
        var doorsBride = document.getElementById('doors-bride-name');
        if (doorsBride) doorsBride.textContent = bride;

        // Hero elements
        var elHeroGroom = document.getElementById('hero-groom-name');
        if (elHeroGroom) elHeroGroom.textContent = groom;
        var elHeroBride = document.getElementById('hero-bride-name');
        if (elHeroBride) elHeroBride.textContent = bride;
        var elHeroCity = document.getElementById('hero-city');
        if (elHeroCity) elHeroCity.textContent = city;
        var elHeroDate = document.getElementById('hero-date');
        if (elHeroDate) elHeroDate.textContent = displayDate;
        var elHeroDateCity = document.getElementById('hero-date-city');
        if (elHeroDateCity) elHeroDateCity.textContent = city + ' · ' + displayDate;
        var elHeroMono = document.getElementById('hero-monogram-initials');
        if (elHeroMono) elHeroMono.textContent = initials;

        // Meet couple elements
        var elMeetHeading = document.getElementById('meet-couple-heading');
        if (elMeetHeading) elMeetHeading.textContent = groom + ' & ' + bride;
        var elMeetGroom = document.getElementById('meet-groom-name');
        if (elMeetGroom) elMeetGroom.textContent = groom;
        var elMeetBride = document.getElementById('meet-bride-name');
        if (elMeetBride) elMeetBride.textContent = bride;
        if (d.photos) {
          if (d.photos.groom) {
            var gUrl = resolveAssetUrl(d.photos.groom);
            var elMeetGroomImg = document.getElementById('meet-groom-img');
            if (elMeetGroomImg) elMeetGroomImg.src = gUrl;
            var elNcGroomImg = document.getElementById('noncaricature-groom-img');
            if (elNcGroomImg) elNcGroomImg.src = gUrl;
            window.__hydratedGroomPhoto = gUrl;
          }
          if (d.photos.bride) {
            var bUrl = resolveAssetUrl(d.photos.bride);
            var elMeetBrideImg = document.getElementById('meet-bride-img');
            if (elMeetBrideImg) elMeetBrideImg.src = bUrl;
            var elNcBrideImg = document.getElementById('noncaricature-bride-img');
            if (elNcBrideImg) elNcBrideImg.src = bUrl;
            window.__hydratedBridePhoto = bUrl;
          }
          if (d.photos.cover) {
            var cUrl = resolveAssetUrl(d.photos.cover);
            var elDoorsCover = document.getElementById('doors-cover-img');
            if (elDoorsCover) elDoorsCover.src = cUrl;
            window.__hydratedCoverPhoto = cUrl;
          }
          if (d.photos.groomBio) {
            var elMeetGroomBio = document.getElementById('meet-groom-bio');
            if (elMeetGroomBio) elMeetGroomBio.textContent = '"' + d.photos.groomBio + '"';
          }
          if (d.photos.brideBio) {
            var elMeetBrideBio = document.getElementById('meet-bride-bio');
            if (elMeetBrideBio) elMeetBrideBio.textContent = '"' + d.photos.brideBio + '"';
          }
        }
        if (d.hosts && d.hosts.groomParents) {
          var elGroomParents = document.getElementById('meet-groom-parents');
          if (elGroomParents) elGroomParents.textContent = d.hosts.groomParents;
        }
        if (d.hosts && d.hosts.brideParents) {
          var elBrideParents = document.getElementById('meet-bride-parents');
          if (elBrideParents) elBrideParents.textContent = d.hosts.brideParents;
        }

        if (d.events && Array.isArray(d.events)) {
          d.events.forEach(function(evt) {
            if (evt.id && (evt.image || evt.img)) {
              var elEvtImg = document.getElementById('event-img-' + evt.id);
              if (elEvtImg) elEvtImg.src = resolveAssetUrl(evt.image || evt.img);
            }
          });
        }

        // Moments & Memories Gallery Hydration
        if (d.gallery && Array.isArray(d.gallery) && d.gallery.length > 0) {
          var momentsGrid = document.getElementById('moments-grid');
          if (momentsGrid) {
            var gHtml = '';
            d.gallery.forEach(function(item, idx) {
              var isLeft = idx % 2 === 0;
              var tapeClass = isLeft ? 'bg-[#FEF08A]/80 border-[#FDE047]' : 'bg-[#EDE9FE]/80 border-[#DDD6FE]';
              var tiltClass = isLeft ? 'reveal-tilt-left -rotate-1' : 'reveal-tilt-right rotate-1';
              var delay = Math.min(360, (idx % 4) * 120);
              var rawUrl = item.url || item.img || item.b64 || './images/couple-potrait.webp';
              var imgUrl = resolveAssetUrl(rawUrl);
              var cap = (item.caption || item.title || 'Wedding Memory').replace(/'/g, "\\'");
              gHtml += '<div class="relative bg-white/95 backdrop-blur-xs p-2 pb-3.5 rounded-lg shadow-md border border-white/80 hover:border-amber-200 transform ' + tiltClass + ' hover:rotate-0 transition-all duration-300 scroll-reveal cursor-pointer" style="transition-delay: ' + delay + 'ms;" onclick="openMomentLightbox(\'' + imgUrl + '\', \'' + cap + '\')">'
                + '<div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 ' + tapeClass + ' rounded shadow-2xs border rotate-1"></div>'
                + '<div class="w-full aspect-square rounded overflow-hidden bg-stone-100 mb-1.5 border border-stone-200">'
                + '<img src="' + imgUrl + '" class="w-full h-full object-cover" />'
                + '</div>'
                + '<div class="text-center"><span class="text-[9px] uppercase font-bold tracking-wider text-stone-500">✦ ' + cap + ' ✦</span></div>'
                + '</div>';
            });
            momentsGrid.innerHTML = gHtml;
          }
        }

        // Live Countdown Target
        if (!isNaN(parsedD.getTime()) && window.__updateCountdownTarget) {
          window.__updateCountdownTarget(parsedD.getTime());
        }

        // Calendar Rebuild
        if (!isNaN(parsedD.getTime()) && window.__rebuildCalendar) {
          window.__rebuildCalendar(parsedD);
        }
      } catch(e) {
        console.warn('Hydration notice:', e);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hydrateSavedData);
    } else {
      hydrateSavedData();
    }

    // GitHub Pages subpath asset error auto-resolver
    window.addEventListener('error', function(e) {
      if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'AUDIO')) {
        var src = e.target.src;
        if (src && src.includes('github.io/images/')) {
          e.target.src = src.replace('github.io/images/', 'github.io/wedding-invitation/images/');
        }
      }
    }, true);
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alex+Brush&family=Allura&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Great+Vibes&family=Italianno&family=Lora:ital,wght@0,400..700;1,400..700&family=Marcellus&family=Montserrat:wght@300;400;500;600;700&family=Parisienne&family=Philosopher:ital,wght@0,400;0,700;1,400&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Prata&family=Rozha+One&family=Satisfy&family=Tangerine:wght@700&display=swap" rel="stylesheet" />
  <style>
    /* Frosted glass blur for cards */
    [class*="backdrop-blur"], .backdrop-blur-md {
      -webkit-backdrop-filter: blur(2.5px) !important;
      backdrop-filter: blur(2.5px) !important;
    }
    .backdrop-blur-lg {
      -webkit-backdrop-filter: blur(3.5px) !important;
      backdrop-filter: blur(3.5px) !important;
    }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: ${isPichwai ? '#071A1E' : isZardozi ? '#FAF7F0' : isNewspaper ? '#F6F1E5' : isCaricature ? '#FAF7F2' : '#FDFBF7'}; color: ${isPichwai ? '#F4ECDE' : '#2B1E17'}; }
    .font-serif { font-family: "${data.typography?.bodyFont || 'Cormorant Garamond'}", Georgia, serif; }
    .font-royal { font-family: "${data.typography?.headingFont || 'Cinzel'}", serif; }
    .font-script { font-family: "${data.typography?.scriptFont || 'Great Vibes'}", cursive; }

    @keyframes swayGentle { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
    @keyframes swayToran { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(2px) rotate(1deg); } }
    @keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes fireworkBurst { 0%, 100% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1.08); opacity: 1; } }

    .animate-sway { animation: swayGentle 4s ease-in-out infinite; transform-origin: top center; }
    .animate-toran { animation: swayToran 5s ease-in-out infinite; transform-origin: top center; }
    .animate-rotate-slow { animation: rotateSlow 24s linear infinite; }
    .animate-firework { animation: fireworkBurst 2.5s ease-in-out infinite; }

    /* Scroll Animations Matching export-1793962607603.mp4 */
    .scroll-reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    .scroll-reveal.is-revealed {
      opacity: 1;
      transform: translateY(0);
    }
    .reveal-tilt-left {
      opacity: 0;
      transform: translateX(-24px) translateY(20px) rotate(-8deg) scale(0.92);
      transition: all 0.75s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    .reveal-tilt-left.is-revealed {
      opacity: 1;
      transform: translateX(0) translateY(0) rotate(-2deg) scale(1);
    }
    .reveal-tilt-right {
      opacity: 0;
      transform: translateX(24px) translateY(20px) rotate(8deg) scale(0.92);
      transition: all 0.75s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    .reveal-tilt-right.is-revealed {
      opacity: 1;
      transform: translateX(0) translateY(0) rotate(2deg) scale(1);
    }
    .reveal-pop-up {
      opacity: 0;
      transform: translateY(32px) scale(0.93);
      transition: all 0.75s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    .reveal-pop-up.is-revealed {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .reveal-calendar {
      opacity: 0;
      transform: translateY(-28px) rotate(-2deg) scale(0.95);
      transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    .reveal-calendar.is-revealed {
      opacity: 1;
      transform: translateY(0) rotate(0deg) scale(1);
    }
    .reveal-bounce {
      opacity: 0;
      transform: scale(0.4);
      transition: all 0.65s cubic-bezier(0.34, 1.56, 0.64, 1);
      will-change: opacity, transform;
    }
    .reveal-bounce.is-revealed {
      opacity: 1;
      transform: scale(1);
    }
    .reveal-scooter {
      opacity: 0;
      transform: translateX(-80px);
      transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    .reveal-scooter.is-revealed {
      opacity: 1;
      transform: translateX(0);
    }

    /* Hand-Drawn Heart Marking Animation for Calendar */
    @keyframes markHeartDraw {
      0% { stroke-dashoffset: 130; transform: scale(0.55) rotate(-8deg); opacity: 0; }
      25% { opacity: 1; }
      75% { stroke-dashoffset: 0; transform: scale(1.28) rotate(4deg); }
      90% { transform: scale(0.95) rotate(-1deg); }
      100% { stroke-dashoffset: 0; transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .calendar-heart-path {
      stroke-dasharray: 130;
      stroke-dashoffset: 130;
      transform-origin: center;
    }
    .is-revealed .calendar-heart-path {
      animation: markHeartDraw 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: 0.25s;
    }

    @keyframes fadeInModal {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleUpModal {
      from { opacity: 0; transform: scale(0.92) translateY(12px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-fadeIn { animation: fadeInModal 0.25s ease-out forwards; }
    .animate-scaleUp { animation: scaleUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  </style>
</head>
<body class="selection:bg-[#C5A880]/30 min-h-screen relative overflow-x-hidden">

  <!-- FULL-PAGE CONTINUOUS ANIMATED ATMOSPHERE (Canvas 60fps) -->
  <canvas id="atmosphere-canvas" class="fixed inset-0 w-full h-full pointer-events-none z-10" style="mix-blend-mode: ${isPichwai ? 'screen' : 'normal'};"></canvas>

  <!-- FLOATING AUDIO CONTROL -->
  <div class="fixed top-4 right-4 z-50">
    <button id="audio-toggle-btn" class="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-200/90 shadow-lg text-xs font-semibold text-stone-700 hover:text-stone-900 cursor-pointer">
      <span id="audio-eq" class="hidden gap-0.5 items-end h-3.5">
        <span class="w-1 bg-[#8B6F47] rounded-full animate-pulse h-3"></span>
        <span class="w-1 bg-[#C5A880] rounded-full animate-pulse h-2"></span>
        <span class="w-1 bg-[#8B6F47] rounded-full animate-pulse h-3.5"></span>
      </span>
      <span id="audio-btn-text">🎵 Play Music</span>
    </button>
  </div>

  <!-- THEME TOP ORNAMENTS -->
  ${isZardozi ? `
  <div class="w-full flex justify-center overflow-hidden pointer-events-none absolute top-0 left-0 right-0 z-30 opacity-95">
    <svg viewBox="0 0 800 65" class="w-full max-w-2xl h-auto animate-toran" fill="none">
      <path d="M0,0 L800,0 L800,20 C700,45 600,10 500,35 C400,10 300,45 200,20 C100,45 0,15 0,0 Z" fill="#D4AF37" fillOpacity="0.4" />
      <path d="M0,0 C100,30 200,15 300,35 C400,15 500,35 600,20 C700,35 800,15 800,0" stroke="#B8860B" strokeWidth="3" />
      <g>
        <circle cx="200" cy="45" r="4" fill="#FFFDF0" stroke="#B8860B" />
        <circle cx="400" cy="45" r="4" fill="#FFFDF0" stroke="#B8860B" />
        <circle cx="600" cy="45" r="4" fill="#FFFDF0" stroke="#B8860B" />
      </g>
    </svg>
  </div>
  <div class="pointer-events-none absolute top-3 left-3 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37] z-20"></div>
  <div class="pointer-events-none absolute top-3 right-3 w-16 h-16 border-t-2 border-r-2 border-[#D4AF37] z-20"></div>` : ''}

  ${isMela ? `
  <div class="w-full pointer-events-none absolute top-0 left-0 right-0 z-30">
    <div class="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 h-6 flex justify-around items-end">
      <div class="w-7 h-4 bg-amber-400 rounded-b-full border-b border-orange-600"></div>
      <div class="w-7 h-4 bg-amber-400 rounded-b-full border-b border-orange-600"></div>
      <div class="w-7 h-4 bg-amber-400 rounded-b-full border-b border-orange-600"></div>
      <div class="w-7 h-4 bg-amber-400 rounded-b-full border-b border-orange-600"></div>
    </div>
    <div class="flex justify-between px-4 pt-1 text-xl animate-sway">
      <div class="flex flex-col gap-1"><span>🌼</span><span>🏵️</span><span>🌼</span></div>
      <div class="flex flex-col gap-1"><span>🏵️</span><span>🌼</span><span>🏵️</span></div>
    </div>
  </div>` : ''}

  ${isPichwai ? `
  <div class="w-full flex justify-center pointer-events-none absolute top-0 left-0 right-0 z-30">
    <div class="flex flex-col items-center animate-sway">
      <div class="w-0.5 h-12 bg-gradient-to-b from-[#C5A880] to-[#E8D5B5]"></div>
      <div class="w-9 h-9 rounded-full bg-[#0D282E] border-2 border-[#C5A880] flex items-center justify-center shadow-lg -mt-1 text-base">
        🪷
      </div>
    </div>
  </div>` : ''}

  <!-- REVEAL SCREEN 1: 3D FOLDING CARD DOORS FOR CARICATURE -->
  <div id="reveal-screen-folding" onclick="unlockCaricatureDoors()" class="fixed inset-0 z-40 bg-[#FAF7F2] flex flex-col items-center justify-center p-4 transition-opacity duration-700 select-none cursor-pointer ${(data.revealStyle === 'scratch-date') ? 'hidden' : ''}">
    <!-- Top Hanging Marigold Garland -->
    <div class="w-full max-w-sm flex justify-center -mb-2 pointer-events-none">
      <svg viewBox="0 0 320 30" class="w-full h-auto text-amber-500">
        <path d="M0,5 Q80,25 160,5 Q240,25 320,5" stroke="#F59E0B" stroke-width="3" stroke-dasharray="5,4" fill="none" />
        <circle cx="20" cy="8" r="4.5" fill="#F59E0B" /><circle cx="60" cy="16" r="4.5" fill="#EA580C" />
        <circle cx="100" cy="18" r="4.5" fill="#F59E0B" /><circle cx="140" cy="12" r="4.5" fill="#EA580C" />
        <circle cx="180" cy="12" r="4.5" fill="#F59E0B" /><circle cx="220" cy="18" r="4.5" fill="#EA580C" />
        <circle cx="260" cy="16" r="4.5" fill="#F59E0B" /><circle cx="300" cy="8" r="4.5" fill="#EA580C" />
      </svg>
    </div>

    <!-- Header Text -->
    <div class="text-center space-y-1 mb-5">
      <span class="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47]">You Are Cordially Invited</span>
      <h2 class="font-serif text-3xl sm:text-4xl font-light text-[#2B1E17] flex items-center justify-center gap-2">
        <span id="doors-bride-name">${data.hosts?.bride || 'Preeti'}</span>
        <span class="text-rose-400 font-sans text-xl animate-pulse">&#9825;</span>
        <span id="doors-groom-name">${data.hosts?.groom || 'Ashish'}</span>
      </h2>
      <div class="w-24 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full"></div>
    </div>

    <!-- 3D Folding Card Container - Full 9:16 Aspect Ratio -->
    <div id="door-card-container" onclick="unlockCaricatureDoors(event)" class="relative w-[85vw] max-w-[300px] aspect-[9/16] max-h-[58vh] sm:max-h-[66vh] cursor-pointer group select-none" style="perspective: 1200px;">
      <!-- Inside Couple Artwork -->
      <div class="absolute inset-0 rounded-2xl bg-[#FFFDF7] border-2 border-[#FDE68A] shadow-inner overflow-hidden flex flex-col items-center justify-center p-0">
        <img id="doors-cover-img" src="${b64Cover || b64Scooter || selectedTmpl?.image}" alt="${data.hosts?.groom || 'Ashish'} & ${data.hosts?.bride || 'Preeti'}" class="w-full h-full object-contain object-center" />
      </div>

      <!-- Left Folding Door -->
      <div id="door-left" class="absolute inset-y-0 left-0 w-1/2 bg-[#FCE7F3] border-y-2 border-l-2 border-[#F472B6] rounded-l-2xl shadow-md overflow-hidden group-hover:-rotate-y-6" style="transform-origin: left center; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1); will-change: transform;">
        <div class="w-full h-full p-2 relative flex flex-col justify-between pointer-events-none">
          <div class="flex gap-1.5 pt-1">
            <span class="w-2 h-2 rounded-full bg-[#F59E0B]/80 inline-block"></span>
            <span class="w-2 h-2 rounded-full bg-[#F59E0B]/80 inline-block"></span>
            <span class="w-2 h-2 rounded-full bg-[#F59E0B]/80 inline-block"></span>
            <span class="w-2 h-2 rounded-full bg-[#F59E0B]/80 inline-block"></span>
          </div>
          <div class="w-full h-[72%] rounded-tl-[40px] border-r-0 border-2 border-[#FDE68A] bg-[#FEF3C7]/40 flex items-center justify-end">
            <div class="w-6 h-6 rounded-l-full bg-[#FDE68A]/70"></div>
          </div>
          <div class="h-4"></div>
        </div>
      </div>

      <!-- Right Folding Door -->
      <div id="door-right" class="absolute inset-y-0 right-0 w-1/2 bg-[#FCE7F3] border-y-2 border-r-2 border-[#F472B6] rounded-r-2xl shadow-md overflow-hidden group-hover:rotate-y-6" style="transform-origin: right center; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1); will-change: transform;">
        <div class="w-full h-full p-2 relative flex flex-col justify-between items-end pointer-events-none">
          <div class="flex gap-1.5 pt-1">
            <span class="w-2 h-2 rounded-full bg-[#F59E0B]/80 inline-block"></span>
            <span class="w-2 h-2 rounded-full bg-[#F59E0B]/80 inline-block"></span>
            <span class="w-2 h-2 rounded-full bg-[#F59E0B]/80 inline-block"></span>
            <span class="w-2 h-2 rounded-full bg-[#F59E0B]/80 inline-block"></span>
          </div>
          <div class="w-full h-[72%] rounded-tr-[40px] border-l-0 border-2 border-[#FDE68A] bg-[#FEF3C7]/40 flex items-center justify-start">
            <div class="w-6 h-6 rounded-r-full bg-[#FDE68A]/70"></div>
          </div>
          <div class="h-4"></div>
        </div>
      </div>

      <!-- Center Heart Seal Button -->
      <div id="door-heart-seal" onclick="unlockCaricatureDoors(event)" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#FEF08A] border-2 border-[#F59E0B] shadow-lg flex items-center justify-center cursor-pointer group-hover:scale-110 animate-pulse" style="transition: transform 0.5s ease, opacity 0.5s ease; will-change: transform, opacity;">
        <span class="text-rose-600 text-lg pointer-events-none">❤️</span>
      </div>

      <!-- Parked Yellow Scooter at Bottom -->
      <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 select-none pointer-events-none">
        <span class="text-3xl drop-shadow-md">🛵</span>
      </div>
    </div>

    <!-- Tap to Open Footer -->
    <div class="mt-4 sm:mt-5 text-center">
      <div class="w-28 border-b-2 border-dashed border-[#F5D0C5] mx-auto mb-2"></div>
      <button id="tap-to-open-btn" type="button" onclick="unlockCaricatureDoors(event)" class="text-xs font-bold text-[#8B6F47] tracking-widest uppercase animate-bounce inline-block hover:underline cursor-pointer py-1 px-3 rounded-full hover:bg-amber-100/50 transition-colors">
        👆 Tap to Open
      </button>
    </div>
  </div>

  <!-- REVEAL SCREEN 2: SCRATCH THE DATE TO REVEAL -->
  <div id="reveal-screen-scratch" class="fixed inset-0 z-40 bg-gradient-to-b from-[#FAF8F5]/95 via-[#F5EFE6]/95 to-[#FAF8F5]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 transition-opacity duration-700 ${(data.revealStyle === 'scratch-date') ? '' : 'hidden'}">
    <div class="text-center space-y-2 mb-6 max-w-md">
      <span class="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47] border border-[#C5A880]/50 bg-[#FAF5ED] px-3.5 py-1 rounded-full shadow-xs">
        Exclusive Invitation
      </span>
      <h2 id="scratch-title-names" class="font-serif text-3xl sm:text-4xl font-light text-[#2B1E17]">
        ${data.hosts?.bride || 'Preeti'} & ${data.hosts?.groom || 'Ashish'}
      </h2>
      <p class="text-xs text-stone-500">Scratch the gold card below to reveal our celebration date 💫</p>
    </div>

    <!-- Scratch Canvas Container -->
    <div class="relative w-80 h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#C5A880] bg-white select-none">
      <!-- Underlying Date Card -->
      <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#FAF5ED] to-white">
        <div id="scratch-card-monogram" class="w-10 h-10 rounded-full border border-[#C5A880] flex items-center justify-center font-royal text-sm font-bold text-[#8B6F47] mb-1">
          ${monogramInitials}
        </div>
        <span class="text-[9px] uppercase tracking-widest font-bold text-[#8B6F47]">Wedding Date</span>
        <h3 id="scratch-card-date" class="font-serif text-2xl font-bold text-[#2B1E17] leading-tight my-1">${displayWeddingDate}</h3>
        <p id="scratch-card-city" class="text-xs text-stone-600">${data.hosts?.city || 'Meerut'}</p>
        <p id="scratch-card-names" class="font-script text-xl text-[#8B6F47] mt-1">${data.hosts?.bride || 'Preeti'} & ${data.hosts?.groom || 'Ashish'}</p>
      </div>

      <!-- Scratch Overlay Canvas -->
      <canvas id="scratch-canvas" width="320" height="224" class="absolute inset-0 cursor-pointer touch-none"></canvas>
    </div>

    <div class="mt-5 text-center space-y-2">
      <p id="scratch-hint" class="text-xs text-stone-500 font-medium">Scrub across the foil to reveal (0% cleared)</p>
      <button id="skip-reveal-btn" class="mt-2 px-6 py-2.5 rounded-full bg-[#8B6F47] hover:bg-[#725a38] text-white text-[11px] tracking-widest uppercase font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5">
        <span>Open Full Invitation</span>
        <span>↓</span>
      </button>
    </div>
  </div>

  <!-- MAIN INVITATION WEBPAGE (Revealed) -->
  <main id="main-invitation" class="opacity-0 transition-opacity duration-1000 relative">

    ${isCaricature ? `
    <!-- FULL-PAGE PARALLAX INDIAN WEDDING SVG LAYER -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden select-none z-15" aria-hidden="true">
      <!-- Hanging Brass Bells -->
      <div class="parallax-bell absolute top-2 left-1.5 animate-bell-swing origin-top">
        <svg viewBox="0 0 80 150" width="28" height="52" fill="none">
          <line x1="40" y1="0" x2="40" y2="48" stroke="#D97706" stroke-width="3" stroke-dasharray="5,4" />
          <circle cx="40" cy="12" r="3" fill="#B45309" /><circle cx="40" cy="28" r="3" fill="#B45309" /><circle cx="40" cy="44" r="3" fill="#B45309" />
          <path d="M24,53 C24,42 56,42 56,53 C56,70 66,95 68,102 C69,108 11,108 12,102 C14,95 24,70 24,53 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2" />
          <ellipse cx="40" cy="102" rx="27" ry="4" stroke="#78350F" stroke-width="1.5" fill="#B45309" fill-opacity="0.3" />
          <circle cx="40" cy="112" r="6" fill="#78350F" /><circle cx="40" cy="138" r="4" fill="#EA580C" />
        </svg>
      </div>
      <div class="parallax-bell absolute top-2 right-1.5 animate-bell-swing origin-top" style="animation-delay: 0.8s;">
        <svg viewBox="0 0 80 150" width="28" height="52" fill="none">
          <line x1="40" y1="0" x2="40" y2="48" stroke="#D97706" stroke-width="3" stroke-dasharray="5,4" />
          <circle cx="40" cy="12" r="3" fill="#B45309" /><circle cx="40" cy="28" r="3" fill="#B45309" /><circle cx="40" cy="44" r="3" fill="#B45309" />
          <path d="M24,53 C24,42 56,42 56,53 C56,70 66,95 68,102 C69,108 11,108 12,102 C14,95 24,70 24,53 Z" fill="#F59E0B" stroke="#B45309" stroke-width="2" />
          <ellipse cx="40" cy="102" rx="27" ry="4" stroke="#78350F" stroke-width="1.5" fill="#B45309" fill-opacity="0.3" />
          <circle cx="40" cy="112" r="6" fill="#78350F" /><circle cx="40" cy="138" r="4" fill="#EA580C" />
        </svg>
      </div>

      <!-- Side Garlands -->
      <div class="parallax-garland absolute top-16 left-0.5 flex flex-col items-center gap-6 opacity-85">
        <svg viewBox="0 0 40 180" width="18" height="80" fill="none">
          <circle cx="20" cy="20" r="16" fill="#F59E0B" /><circle cx="20" cy="20" r="9" fill="#EA580C" />
          <path d="M20,38 C28,50 32,68 20,80 C8,68 12,50 20,38 Z" fill="#15803D" />
          <circle cx="20" cy="100" r="16" fill="#F59E0B" /><circle cx="20" cy="100" r="9" fill="#EA580C" />
          <path d="M20,118 C28,130 32,148 20,160 C8,148 12,130 20,118 Z" fill="#15803D" />
        </svg>
      </div>
      <div class="parallax-garland absolute top-16 right-0.5 flex flex-col items-center gap-6 opacity-85">
        <svg viewBox="0 0 40 180" width="18" height="80" fill="none">
          <circle cx="20" cy="20" r="16" fill="#F59E0B" /><circle cx="20" cy="20" r="9" fill="#EA580C" />
          <path d="M20,38 C28,50 32,68 20,80 C8,68 12,50 20,38 Z" fill="#15803D" />
          <circle cx="20" cy="100" r="16" fill="#F59E0B" /><circle cx="20" cy="100" r="9" fill="#EA580C" />
          <path d="M20,118 C28,130 32,148 20,160 C8,148 12,130 20,118 Z" fill="#15803D" />
        </svg>
      </div>

      <!-- Watermark Motifs -->
      <div class="parallax-motif absolute top-[680px] -left-6 opacity-20" data-speed="0.08" data-rot="-8">
        <svg viewBox="0 0 120 140" width="70" height="82" fill="none">
          <ellipse cx="60" cy="98" rx="36" ry="32" fill="#F59E0B" stroke="#92400E" stroke-width="2" />
          <ellipse cx="60" cy="68" rx="20" ry="5" fill="#F59E0B" stroke="#92400E" stroke-width="1.5" />
          <path d="M42,75 Q60,82 78,75 Q60,70 42,75" fill="#DC2626" />
          <path d="M60,42 C45,55 35,66 44,68 C52,68 58,56 60,42 Z" fill="#16A34A" />
          <path d="M60,42 C75,55 85,66 76,68 C68,68 62,56 60,42 Z" fill="#16A34A" />
          <circle cx="60" cy="52" r="16" fill="#78350F" />
          <circle cx="60" cy="50" r="4.5" fill="#DC2626" />
        </svg>
      </div>

      <div class="parallax-motif absolute top-[1480px] -left-8 opacity-20" data-speed="0.07" data-rot="-15">
        <svg viewBox="0 0 140 120" width="80" height="68" fill="none">
          <g transform="rotate(-28 60 55)">
            <polygon points="15,55 85,52 105,38 105,72 85,58 15,55" fill="#B45309" stroke="#78350F" stroke-width="2" />
            <circle cx="45" cy="55" r="2" fill="#FEF3C7" /><circle cx="65" cy="55" r="2" fill="#FEF3C7" />
          </g>
          <g transform="translate(42, 42) rotate(14)">
            <ellipse cx="40" cy="30" rx="30" ry="18" fill="#92400E" stroke="#78350F" stroke-width="2" />
            <path d="M10,18 L40,46 L70,18 M10,42 L40,14 L70,42" stroke="#FEF3C7" stroke-width="1.4" fill="none" />
          </g>
        </svg>
      </div>

      <!-- Parallax Petals -->
      <div class="parallax-petal absolute" data-speed="0.22" data-rotspeed="0.18" data-initrot="20" style="top: 140px; left: 8%;">
        <svg viewBox="0 0 24 30" width="16" height="20" fill="none"><path d="M12,1 C20,8 22,22 12,29 C2,22 4,8 12,1 Z" fill="#F59E0B" fill-opacity="0.85" /></svg>
      </div>
      <div class="parallax-petal absolute" data-speed="0.32" data-rotspeed="-0.25" data-initrot="-30" style="top: 320px; right: 7%;">
        <svg viewBox="0 0 30 35" width="18" height="21" fill="none"><path d="M15,2 C25,2 29,15 26,26 C23,34 7,34 4,26 C1,15 5,2 15,2 Z" fill="#FB7185" fill-opacity="0.85" /></svg>
      </div>
      <div class="parallax-petal absolute" data-speed="0.16" data-rotspeed="0.12" data-initrot="40" style="top: 750px; left: 6%;">
        <svg viewBox="0 0 24 30" width="16" height="20" fill="none"><path d="M12,1 C20,8 22,22 12,29 C2,22 4,8 12,1 Z" fill="#F59E0B" fill-opacity="0.85" /></svg>
      </div>
      <div class="parallax-petal absolute" data-speed="0.28" data-rotspeed="-0.2" data-initrot="-15" style="top: 1100px; right: 5%;">
        <svg viewBox="0 0 30 35" width="18" height="21" fill="none"><path d="M15,2 C25,2 29,15 26,26 C23,34 7,34 4,26 C1,15 5,2 15,2 Z" fill="#FB7185" fill-opacity="0.85" /></svg>
      </div>
      <div class="parallax-petal absolute" data-speed="0.25" data-rotspeed="0.2" data-initrot="25" style="top: 1600px; left: 7%;">
        <svg viewBox="0 0 24 30" width="16" height="20" fill="none"><path d="M12,1 C20,8 22,22 12,29 C2,22 4,8 12,1 Z" fill="#F59E0B" fill-opacity="0.85" /></svg>
      </div>
      <div class="parallax-petal absolute" data-speed="0.35" data-rotspeed="-0.22" data-initrot="-45" style="top: 2200px; right: 6%;">
        <svg viewBox="0 0 30 35" width="18" height="21" fill="none"><path d="M15,2 C25,2 29,15 26,26 C23,34 7,34 4,26 C1,15 5,2 15,2 Z" fill="#FB7185" fill-opacity="0.85" /></svg>
      </div>
    </div>` : ''}

    ${isNewspaper ? `
    <header class="border-b-4 border-double border-stone-800 text-center py-6 px-4 bg-[#F6F1E5]">
      <p class="text-[10px] tracking-[0.3em] uppercase font-bold text-stone-600">EST. 2027 · SPECIAL WEDDING CHRONICLE · NO. 1</p>
      <h1 class="font-serif text-4xl sm:text-6xl font-black uppercase tracking-tight text-stone-900 my-1">THE SHAADI TIMES</h1>
      <div class="flex justify-between items-center text-[10px] uppercase font-semibold text-stone-600 border-t border-b border-stone-800 py-1 max-w-xl mx-auto">
        <span>VOL. I · SPECIAL EDITION</span>
        <span>${data.hosts?.city || 'Meerut, Uttar Pradesh'}</span>
        <span>${data.hosts?.date || 'FEBRUARY 14, 2027'}</span>
      </div>
    </header>` : ''}

    <!-- HERO SECTION WITH TEMPLATE ARTWORK -->
    <section class="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 overflow-hidden">
      
      <!-- Mela Rotating Sunburst Background -->
      ${isMela ? `
      <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-15 z-0 flex items-center justify-center">
        <div class="w-[180vw] h-[180vw] max-w-[1400px] max-h-[1400px] rounded-full animate-rotate-slow origin-center" style="background: repeating-conic-gradient(from 0deg, #F59E0B 0deg 15deg, transparent 15deg 30deg);"></div>
      </div>` : ''}

      ${isCaricature ? `
      <!-- PASTEL CARICATURE HERO POP-UP (MATCHING export-1793962607603.mp4) -->
      <div class="relative my-2 flex flex-col items-center select-none w-full max-w-[390px] mx-auto px-2 scroll-reveal reveal-pop-up">
        <!-- Top Draped Marigold Floral Swags -->
        <div class="w-full flex justify-around items-start -mb-2 px-6 pointer-events-none">
          <svg viewBox="0 0 400 40" class="w-full h-auto text-amber-500 animate-sway" fill="none">
            <path d="M0,5 Q100,35 200,5 Q300,35 400,5" stroke="#F59E0B" stroke-width="4" stroke-dasharray="6,4" />
            <path d="M0,8 Q100,38 200,8 Q300,38 400,8" stroke="#EA580C" stroke-width="3" />
            <circle cx="20" cy="12" r="5" fill="#F59E0B" /><circle cx="60" cy="20" r="5" fill="#EA580C" />
            <circle cx="100" cy="24" r="5" fill="#F59E0B" /><circle cx="140" cy="20" r="5" fill="#EA580C" />
            <circle cx="180" cy="12" r="5" fill="#F59E0B" /><circle cx="220" cy="20" r="5" fill="#EA580C" />
            <circle cx="260" cy="24" r="5" fill="#F59E0B" /><circle cx="300" cy="20" r="5" fill="#EA580C" />
            <circle cx="340" cy="12" r="5" fill="#F59E0B" /><circle cx="380" cy="20" r="5" fill="#EA580C" />
          </svg>
        </div>

        <!-- Cusped Scalloped Arch Frame -->
        <div class="relative w-full bg-[#FFFDF9]/95 backdrop-blur-xs rounded-t-[60px] rounded-b-3xl p-3 border-[3px] border-[#FDE68A]/80 shadow-xl overflow-hidden text-center">
          <!-- Sacred Sanskrit Invocation -->
          <div class="pt-2 pb-0.5">
            <span class="text-[11px] font-serif text-[#B45309] font-medium tracking-wide">
              ॥ श्री गणेशाय नमः ॥
            </span>
            <p class="text-[10px] uppercase tracking-widest font-bold text-stone-500 mt-0.5">
              Together With Their Families
            </p>
          </div>

          <!-- Main Couple Names -->
          <h1 id="hero-couple-names" class="font-serif text-3xl sm:text-4xl text-[#2B1E17] font-light flex items-center justify-center gap-1.5 mt-0.5 mb-1">
            <span id="hero-groom-name">${data.hosts?.groom || 'Ashish'}</span>
            <span class="text-rose-400 font-sans text-lg animate-pulse">♡</span>
            <span id="hero-bride-name">${data.hosts?.bride || 'Preeti'}</span>
          </h1>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mb-2"></div>

          <!-- Scooter Couple Illustration Artwork Filled in Card - Full 9:16 Aspect Ratio -->
          <div class="w-full aspect-[9/16] rounded-2xl overflow-hidden relative flex items-center justify-center group bg-[#FFFDF7] shadow-inner">
            <img src="${b64Cover || b64Tmpl || (typeof selectedTmpl !== 'undefined' ? selectedTmpl?.image : '')}" alt="${data.hosts?.groom} & ${data.hosts?.bride}" class="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700" />
          </div>

          <!-- Request Honour Flanked by Marigolds -->
          <div class="py-3 flex items-center justify-center gap-2">
            <span class="text-amber-500 text-sm">🌼</span>
            <span class="font-serif text-xs text-stone-700 font-medium tracking-wide italic">
              Request the honour of your presence
            </span>
            <span class="text-amber-500 text-sm">🌼</span>
          </div>
        </div>
      </div>` : `
      <!-- CUSPED SCALLOPED ARCH HERO (ALL THEMES) -->
      <div class="relative my-2 flex flex-col items-center select-none w-full max-w-[390px] mx-auto px-2 scroll-reveal reveal-pop-up">
        <!-- Top Draped Marigold Floral Swags -->
        <div class="w-full flex justify-around items-start -mb-2 px-6 pointer-events-none">
          <svg viewBox="0 0 400 40" class="w-full h-auto text-amber-500 animate-sway" fill="none">
            <path d="M0,5 Q100,35 200,5 Q300,35 400,5" stroke="#F59E0B" stroke-width="4" stroke-dasharray="6,4" />
            <path d="M0,8 Q100,38 200,8 Q300,38 400,8" stroke="#EA580C" stroke-width="3" />
            <circle cx="20" cy="12" r="5" fill="#F59E0B" /><circle cx="60" cy="20" r="5" fill="#EA580C" />
            <circle cx="100" cy="24" r="5" fill="#F59E0B" /><circle cx="140" cy="20" r="5" fill="#EA580C" />
            <circle cx="180" cy="12" r="5" fill="#F59E0B" /><circle cx="220" cy="20" r="5" fill="#EA580C" />
            <circle cx="260" cy="24" r="5" fill="#F59E0B" /><circle cx="300" cy="20" r="5" fill="#EA580C" />
            <circle cx="340" cy="12" r="5" fill="#F59E0B" /><circle cx="380" cy="20" r="5" fill="#EA580C" />
          </svg>
        </div>

        <!-- Cusped Scalloped Arch Frame -->
        <div class="relative w-full bg-[#FFFDF9]/95 backdrop-blur-xs rounded-t-[60px] rounded-b-3xl p-3 border-[3px] border-[#FDE68A]/80 shadow-xl overflow-hidden text-center">
          <!-- Sacred Sanskrit Invocation -->
          <div class="pt-2 pb-0.5">
            <span class="text-[11px] font-serif text-[#B45309] font-medium tracking-wide">
              ॥ श्री गणेशाय नमः ॥
            </span>
            <p class="text-[10px] uppercase tracking-widest font-bold text-stone-500 mt-0.5">
              Together With Their Families
            </p>
          </div>

          <!-- Main Couple Names -->
          <h1 id="hero-couple-names" class="font-serif text-3xl sm:text-4xl text-[#2B1E17] font-light flex items-center justify-center gap-1.5 mt-0.5 mb-1">
            <span id="hero-groom-name">${data.hosts?.groom || 'Ashish'}</span>
            <span class="text-rose-400 font-sans text-lg animate-pulse">♡</span>
            <span id="hero-bride-name">${data.hosts?.bride || 'Preeti'}</span>
          </h1>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mb-2"></div>

          <!-- Couple Illustration Artwork Filled in Card - Full 9:16 Aspect Ratio -->
          <div class="w-full aspect-[9/16] rounded-2xl overflow-hidden relative flex items-center justify-center group bg-[#FFFDF7] shadow-inner">
            <img src="${b64Cover || b64Tmpl || (typeof selectedTmpl !== 'undefined' ? selectedTmpl?.image : '')}" alt="${data.hosts?.groom} & ${data.hosts?.bride}" class="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700" />
          </div>

          <!-- Request Honour Flanked by Marigolds -->
          <div class="py-3 flex items-center justify-center gap-2">
            <span class="text-amber-500 text-sm">🌼</span>
            <span class="font-serif text-xs text-stone-700 font-medium tracking-wide italic">
              Request the honour of your presence
            </span>
            <span class="text-amber-500 text-sm">🌼</span>
          </div>
        </div>
      </div>`}
    </section>

    ${isCaricature ? `
    <!-- PASTEL CARICATURE COMPLETE EXPERIENCE (MATCHING export-1793962607603.mp4) -->
    <div class="space-y-6">
      <!-- 1. MEET THE TWO OF US (frame 023 - 025) -->
      <section class="py-6 px-2 w-full max-w-[390px] mx-auto select-none">
        <div class="text-center space-y-1 mb-5 scroll-reveal">
          <span class="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold">Meet the two of us</span>
          <h3 id="meet-couple-heading" class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">${data.hosts?.groom || 'Ashish'} & ${data.hosts?.bride || 'Preeti'}</h3>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1"></div>
        </div>

        <div class="grid grid-cols-2 gap-2 relative items-stretch">
          <!-- Left Card: Groom (Clickable Modal) -->
          <div onclick="openPersonModal('groom')" class="relative bg-white/95 backdrop-blur-xs p-2.5 pb-4 rounded-2xl shadow-md border border-white/80 hover:border-amber-300 transform -rotate-2 hover:rotate-0 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center scroll-reveal reveal-tilt-left cursor-pointer group">
            <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#A7F3D0]/85 rounded shadow-xs rotate-1 border border-[#6EE7B7]"></div>
            <div class="w-20 h-20 rounded-full overflow-hidden bg-stone-100 mt-1 mb-2 border-2 border-stone-200 ring-4 ring-[#E6F4EA] shadow-inner shrink-0 group-hover:ring-emerald-300 transition-all">
              <img id="meet-groom-img" src="${b64Groom || './images/ashish_groom.jpg' || './images/groom.webp'}" alt="${data.hosts?.groom || 'Ashish'}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span class="inline-block px-2 py-0.5 rounded-full text-[8.5px] uppercase tracking-wider font-bold bg-[#E6F4EA] text-[#137333] mb-1">The Groom</span>
            <h4 id="meet-groom-name" class="font-serif text-sm sm:text-base font-bold text-[#2B1E17] leading-tight group-hover:text-amber-800 transition-colors">${data.hosts?.groom || 'Ashish'}</h4>
            <p id="meet-groom-bio" class="text-[10px] text-stone-600 italic mt-1 leading-snug px-0.5 flex-1">"${data.photos?.groomBio || 'Foodie, photography enthusiast, and the architect of their happiest memories.'}"</p>
            <p id="meet-groom-parents" class="text-[8.5px] text-stone-400 mt-1.5 font-sans border-t border-stone-100 pt-1 w-full">${data.hosts?.groomParents || 'S/o Mr. Ramesh & Mrs. Sunita Sharma'}</p>
            <span class="text-[8.5px] text-amber-700 font-semibold mt-1 flex items-center gap-0.5 opacity-80 group-hover:opacity-100">🔍 Tap to view</span>
          </div>

          <!-- Connected Pink Heart -->
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-rose-400 text-2xl animate-pulse drop-shadow scroll-reveal reveal-bounce" style="transition-delay: 250ms;">♡</div>

          <!-- Right Card: Bride (Clickable Modal) -->
          <div onclick="openPersonModal('bride')" class="relative bg-white/95 backdrop-blur-xs p-2.5 pb-4 rounded-2xl shadow-md border border-white/80 hover:border-rose-300 transform rotate-2 hover:rotate-0 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center scroll-reveal reveal-tilt-right cursor-pointer group" style="transition-delay: 150ms;">
            <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#FDE68A]/85 rounded shadow-xs -rotate-1 border border-[#FCD34D]"></div>
            <div class="w-20 h-20 rounded-full overflow-hidden bg-stone-100 mt-1 mb-2 border-2 border-stone-200 ring-4 ring-[#FCE8E6] shadow-inner shrink-0 group-hover:ring-rose-300 transition-all">
              <img id="meet-bride-img" src="${b64Bride || './images/preeti_bride.jpg' || './images/bride.webp'}" alt="${data.hosts?.bride || 'Preeti'}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span class="inline-block px-2 py-0.5 rounded-full text-[8.5px] uppercase tracking-wider font-bold bg-[#FCE8E6] text-[#C5221F] mb-1">The Bride</span>
            <h4 id="meet-bride-name" class="font-serif text-sm sm:text-base font-bold text-[#2B1E17] leading-tight group-hover:text-rose-800 transition-colors">${data.hosts?.bride || 'Preeti'}</h4>
            <p id="meet-bride-bio" class="text-[10px] text-stone-600 italic mt-1 leading-snug px-0.5 flex-1">"${data.photos?.brideBio || 'Loves classic poetry, morning chai, and spontaneous mountain hikes.'}"</p>
            <p id="meet-bride-parents" class="text-[8.5px] text-stone-400 mt-1.5 font-sans border-t border-stone-100 pt-1 w-full">${data.hosts?.brideParents || 'D/o Mr. Vijay & Mrs. Rekha Malhotra'}</p>
            <span class="text-[8.5px] text-rose-700 font-semibold mt-1 flex items-center gap-0.5 opacity-80 group-hover:opacity-100">🔍 Tap to view</span>
          </div>
        </div>
      </section>

      <!-- 2. HANGING WALL CALENDAR & LIVE COUNTDOWN (frame 025 - 027) -->
      <section class="py-6 px-2 w-full max-w-[390px] mx-auto select-none">
        <div class="text-center space-y-1 mb-5 scroll-reveal">
          <span class="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold">Mark your calendar</span>
          <h3 id="calendar-month-year" class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">${calMonthName} ${calYear}</h3>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1"></div>
        </div>

        <div class="relative bg-white/95 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border-2 border-stone-200/80 shadow-md scroll-reveal reveal-calendar">
          <div class="absolute -top-3 left-1/3 -translate-x-1/2 w-3.5 h-6 rounded-full border-2 border-stone-400 bg-stone-100 shadow-inner"></div>
          <div class="absolute -top-3 right-1/3 translate-x-1/2 w-3.5 h-6 rounded-full border-2 border-stone-400 bg-stone-100 shadow-inner"></div>

          <div class="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#DB2777] pb-2 border-b border-stone-100 mb-2">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>

          <div id="calendar-grid-days" class="grid grid-cols-7 gap-1 text-center text-xs text-stone-700">
            ${Array.from({ length: firstDayIndex }).map(() => '<span></span>').join('')}
            ${Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isWeddingDay = day === calDayNum;
              return isWeddingDay 
                ? `<div class="relative w-8 h-8 sm:w-9 sm:h-9 mx-auto flex items-center justify-center font-bold text-rose-600 select-none">
                    <svg viewBox="0 0 36 36" class="absolute -inset-1 w-9 h-9 sm:w-10 sm:h-10 pointer-events-none overflow-visible">
                      <path
                        d="M18,31 C10,23 3.5,17 3.5,10.5 C3.5,5.5 7.5,2 12.5,2 C15.5,2 17.5,3.5 18,5 C18.5,3.5 20.5,2 23.5,2 C28.5,2 32.5,5.5 32.5,10.5 C32.5,17 26,23 18,31 Z"
                        fill="rgba(244, 63, 94, 0.16)"
                        stroke="#E11D48"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="calendar-heart-path"
                      />
                    </svg>
                    <span class="relative z-10 text-rose-700 font-extrabold text-sm">${day}</span>
                  </div>`
                : `<div class="h-7 sm:h-8 flex items-center justify-center"><span>${day}</span></div>`;
            }).join('')}
          </div>
        </div>

        <div class="mt-6 text-center scroll-reveal reveal-pop-up" style="transition-delay: 150ms;">
          <span class="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold mb-2.5">Counting down to the shaadi</span>
          <div class="flex justify-center items-center gap-2 sm:gap-3">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FCE7F3] border-2 border-[#F472B6] shadow-2xs flex flex-col items-center justify-center p-1">
              <span id="pastel-days" class="font-serif text-lg sm:text-xl font-bold text-[#9D174D] leading-none">00</span>
              <span class="text-[7.5px] uppercase tracking-wider text-[#BE185D] font-bold mt-0.5">Days</span>
            </div>
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D1FAE5] border-2 border-[#34D399] shadow-2xs flex flex-col items-center justify-center p-1">
              <span id="pastel-hours" class="font-serif text-lg sm:text-xl font-bold text-[#065F46] leading-none">00</span>
              <span class="text-[7.5px] uppercase tracking-wider text-[#047857] font-bold mt-0.5">Hours</span>
            </div>
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FEF3C7] border-2 border-[#FBBF24] shadow-2xs flex flex-col items-center justify-center p-1">
              <span id="pastel-mins" class="font-serif text-lg sm:text-xl font-bold text-[#92400E] leading-none">00</span>
              <span class="text-[7.5px] uppercase tracking-wider text-[#B45309] font-bold mt-0.5">Mins</span>
            </div>
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#EDE9FE] border-2 border-[#A78BFA] shadow-2xs flex flex-col items-center justify-center p-1">
              <span id="pastel-secs" class="font-serif text-lg sm:text-xl font-bold text-[#5B21B6] leading-none">00</span>
              <span class="text-[7.5px] uppercase tracking-wider text-[#6D28D9] font-bold mt-0.5">Secs</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. CELEBRATIONS WITH AUTHENTIC ARCHES & SCOOTER DIVIDERS (frame 035 - 062) -->
      <section class="py-8 px-1 w-full max-w-[390px] mx-auto select-none space-y-5">
        <div class="text-center space-y-1 mb-6 scroll-reveal">
          <span class="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold">Programme</span>
          <h2 class="font-serif text-3xl font-light text-[#2B1E17]">The Celebrations</h2>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1"></div>
        </div>

        ${(data.events || []).map((evt, idx) => {
          const nameLower = (evt.name || '').toLowerCase();
          const isHaldi = nameLower.includes('haldi');
          const isMehndi = nameLower.includes('mehndi') || nameLower.includes('mehendi');
          const isSangeet = nameLower.includes('sangeet');
          const isWedding = evt.id === 'evt-pheras' || nameLower.includes('wedding') || nameLower.includes('phera') || nameLower.includes('shaadi');
          const isReception = nameLower.includes('reception') || nameLower.includes('party');

          const defaultArch = isHaldi ? (b64Haldi || b64Scooter)
            : isMehndi ? (b64Mehndi || b64Scooter)
            : isSangeet ? (b64Sangeet || b64Scooter)
            : isWedding ? (b64Pheras || b64Scooter)
            : isReception ? (b64Reception || b64Scooter)
            : (b64Scooter);

          const archB64 = (typeof b64Events !== 'undefined' && b64Events && b64Events[idx] && b64Events[idx].customB64) || evt.image || evt.img || defaultArch;

          return `
          <div class="relative w-full select-none space-y-3">
            <div class="w-full flex justify-center -mb-2 scroll-reveal reveal-pop-up">
              <div class="w-full max-w-[350px] aspect-[9/16] rounded-t-[44px] rounded-b-2xl overflow-hidden flex items-center justify-center p-0 drop-shadow-md bg-[#FFFDF7]/95 backdrop-blur-xs border-2 border-amber-100/80">
                <img id="event-img-${evt.id || idx}" src="${archB64}" alt="${evt.name}" class="w-full h-full object-contain object-center" />
              </div>
            </div>

            <div class="text-center scroll-reveal" style="transition-delay: 80ms;">
              <h3 class="font-serif text-2xl font-bold text-[#2B1E17]">${evt.name}</h3>
            </div>

            <div class="relative bg-[#FFFDF9]/95 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border-2 border-stone-200/80 shadow-md space-y-2.5 scroll-reveal" style="transition-delay: 160ms;">
              <div class="space-y-1.5 text-xs text-stone-700">
                <p class="flex items-center gap-2"><span>📅</span><strong class="text-stone-900">${evt.date}</strong> · ⏰ ${evt.time}</p>
                <p class="flex items-center gap-2"><span>📍</span><span><strong class="text-stone-900">${evt.venue}</strong> — ${evt.address}</span></p>
                ${evt.dressCode ? `<p class="flex items-center gap-2"><span>👔</span><span class="text-[#8B6F47] font-semibold">${evt.dressCode}</span></p>` : ''}
              </div>
              <div class="pt-1.5">
                <a href="https://maps.google.com/?q=${encodeURIComponent(evt.venue + ' ' + evt.address)}" target="_blank" class="w-full py-2.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#FCE7F3] text-[#BE185D] hover:bg-[#FBCFE8] transition-all shadow-2xs cursor-pointer">
                  <span>🧭 Get directions</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Animated Yellow Scooter Divider with Roadside Foliage -->
          <div class="w-full flex flex-col items-center my-6 overflow-hidden pointer-events-none select-none scroll-reveal reveal-scooter">
            <div class="relative w-72 h-16 flex items-center justify-center">
              <svg viewBox="0 0 280 60" class="w-full h-full text-stone-300" fill="none">
                <path d="M15,48 Q140,-8 265,48" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="6,5" class="animate-road-dash" />
                <g transform="translate(10, 34) scale(0.65)">
                  <path d="M10,25 C10,12 18,5 20,0 C22,5 30,12 30,25 Z" fill="#16A34A" />
                  <path d="M5,22 C12,12 18,8 20,0" stroke="#15803D" stroke-width="1.5" />
                  <circle cx="20" cy="22" r="3.5" fill="#F59E0B" />
                </g>
                <g transform="translate(252, 32) scale(0.6)">
                  <path d="M5,24 L25,24 L25,12 C25,4 15,0 15,0 C15,0 5,4 5,12 Z" fill="#FDE68A" stroke="#D97706" stroke-width="1.2" />
                  <circle cx="15" cy="0" r="2.5" fill="#EA580C" />
                </g>
              </svg>
              <div class="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                <span class="text-2xl drop-shadow-md transform -rotate-3">🛵</span>
                <span class="text-xs text-stone-400">💨</span>
              </div>
            </div>
          </div>`;
        }).join('')}
      </section>

      <!-- 5. MOMENTS & MEMORIES PHOTO GALLERY & GUEST UPLOAD -->
      <section class="py-6 px-2 w-full max-w-[390px] mx-auto select-none" id="moments-section">
        <div class="text-center space-y-1 mb-4 scroll-reveal">
          <span class="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold">Moments to cherish</span>
          <h3 class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">Moments & Memories</h3>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1"></div>
          <p class="text-[11px] text-stone-500 font-light max-w-xs mx-auto pt-1 leading-relaxed">
            A glimpse into our sweetest celebrations & unforgettable memories.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2.5" id="moments-grid">
          ${b64Gallery.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            const tapeClass = isLeft 
              ? 'bg-[#FEF08A]/80 border-[#FDE047]' 
              : 'bg-[#EDE9FE]/80 border-[#DDD6FE]';
            const tiltClass = isLeft ? 'reveal-tilt-left -rotate-1' : 'reveal-tilt-right rotate-1';
            const delay = Math.min(360, (idx % 4) * 120);
            return `
            <div class="relative bg-white/95 backdrop-blur-xs p-2 pb-3.5 rounded-lg shadow-md border border-white/80 hover:border-amber-200 transform ${tiltClass} hover:rotate-0 transition-all duration-300 scroll-reveal cursor-pointer" style="transition-delay: ${delay}ms;" onclick="openMomentLightbox('${item.b64 || './images/couple-potrait.webp'}', '${item.caption}')">
              <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 ${tapeClass} rounded shadow-2xs border rotate-1"></div>
              <div class="w-full aspect-square rounded overflow-hidden bg-stone-100 mb-1.5 border border-stone-200">
                <img src="${item.b64 || './images/couple-potrait.webp'}" class="w-full h-full object-cover" />
              </div>
              <div class="text-center"><span class="text-[9px] uppercase font-bold tracking-wider text-stone-500">✦ ${item.caption} ✦</span></div>
            </div>`;
          }).join('')}
        </div>
      </section>

      <!-- 6. THE VENUE ROADMAP (frame 065 - 068) -->
      <section class="py-6 px-2 w-full max-w-[390px] mx-auto select-none">
        <div class="text-center space-y-1 mb-5 scroll-reveal">
          <span class="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold">Where it's all happening</span>
          <h3 class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">The Venue</h3>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1"></div>
        </div>

        <div class="bg-[#FFFDF9]/95 backdrop-blur-xs rounded-2xl p-4 border-2 border-stone-200/80 shadow-md space-y-3 scroll-reveal reveal-pop-up" style="transition-delay: 120ms;">
          <div class="w-full h-40 rounded-xl bg-gradient-to-b from-[#E6F4EA] to-[#FEF3C7] border border-[#A7F3D0] relative overflow-hidden flex flex-col justify-between p-3">
            <div class="flex justify-between items-start text-lg opacity-80">
              <span>🌳</span><span>🏰</span><span>🌳</span>
            </div>
            <div class="relative w-full flex items-center justify-center my-auto">
              <svg viewBox="0 0 200 40" class="w-full h-10" fill="none">
                <path d="M10,25 Q100,5 190,25" stroke="#94A3B8" stroke-width="2.5" stroke-dasharray="5,4" />
              </svg>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 text-rose-600 text-2xl animate-pin-drop">📍</div>
            </div>
            <div class="bg-white/90 backdrop-blur-xs rounded-lg p-2 text-center border border-stone-200 shadow-2xs">
              <h4 class="font-serif text-sm font-bold text-[#2B1E17]">${data.events?.[0]?.venue || 'The Oberoi Udaivilas'}</h4>
              <p class="text-[10px] text-stone-500">${data.hosts?.city || 'Udaipur, Rajasthan'} · ${data.events?.[0]?.address || 'Haridas Ji Ki Magri'}</p>
            </div>
          </div>

          <a href="https://maps.google.com/?q=${encodeURIComponent((data.events?.[0]?.venue || 'The Oberoi Udaivilas') + ' ' + (data.hosts?.city || 'Udaipur'))}" target="_blank" class="w-full py-2.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#881337] text-white hover:bg-[#9F1239] transition-all shadow-sm cursor-pointer">
            <span>🧭 Open in Google Maps</span>
          </a>
        </div>
      </section>

      <!-- 7. HASHTAG BANNER (frame 072) -->
      <section class="py-6 px-2 w-full max-w-[390px] mx-auto text-center select-none space-y-2 scroll-reveal reveal-pop-up">
        <span class="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-500 block">SHARE THE MOMENTS</span>
        <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#2B1E17]">${data.hosts?.hashtag || '#Wedding'}</h3>
        <p class="text-xs text-stone-600 font-light">Tag your photos and stories so we can relive every moment.</p>
        <div class="pt-1.5">
          <button id="hashtag-btn" onclick="copyHashtag('${data.hosts?.hashtag || '#Wedding'}')" class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-95">
            <span>📋 Copy Hashtag</span>
          </button>
        </div>
      </section>

      <!-- 8. PASTEL FOOTER (frame 080) -->
      <footer class="py-10 px-2 w-full max-w-[390px] mx-auto text-center space-y-3.5 border-t-2 border-dashed border-[#F5D0C5] select-none scroll-reveal">
        <h3 class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">See you at the shaadi!</h3>
        <p class="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47]">WITH LOVE, ${(data.hosts?.groom || 'Groom').toUpperCase()} & ${(data.hosts?.bride || 'Bride').toUpperCase()}</p>
        <div class="flex items-center justify-center gap-3">
          <span class="w-6 h-6 rounded-full bg-[#FEF3C7] border border-[#FBBF24] flex items-center justify-center text-xs shadow-xs animate-bounce">💛</span>
          <span class="w-6 h-6 rounded-full bg-[#D1FAE5] border border-[#34D399] flex items-center justify-center text-xs shadow-xs animate-bounce" style="animation-delay: 0.2s;">💚</span>
          <span class="w-6 h-6 rounded-full bg-[#EDE9FE] border border-[#A78BFA] flex items-center justify-center text-xs shadow-xs animate-bounce" style="animation-delay: 0.4s;">💜</span>
          <span class="w-6 h-6 rounded-full bg-[#FCE7F3] border border-[#F472B6] flex items-center justify-center text-xs shadow-xs animate-bounce" style="animation-delay: 0.6s;">💖</span>
        </div>
        <div class="flex items-center justify-center gap-1 pt-1.5">
          <span class="text-3xl drop-shadow">🛵</span>
          <span class="text-xs text-stone-400">💨</span>
        </div>
        <p class="text-xs text-stone-500 font-light italic">We can't wait to celebrate with you</p>
      </footer>
    </div>` : `
    <!-- COMPLETE LUXURY EXPERIENCE MIRRORED FOR ALL THEMES -->
    <div class="space-y-6">
      <!-- 1. MEET THE TWO OF US -->
      <section class="py-6 px-2 w-full max-w-[390px] mx-auto select-none">
        <div class="text-center space-y-1 mb-5 scroll-reveal">
          <span class="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold">Meet the two of us</span>
          <h3 id="meet-couple-heading" class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">${data.hosts?.groom || 'Ashish'} & ${data.hosts?.bride || 'Preeti'}</h3>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1"></div>
        </div>

        <div class="grid grid-cols-2 gap-2 relative items-stretch">
          <!-- Left Card: Groom (Clickable Modal) -->
          <div onclick="openPersonModal('groom')" class="relative bg-white/95 backdrop-blur-xs p-2.5 pb-4 rounded-2xl shadow-md border border-white/80 hover:border-amber-300 transform -rotate-2 hover:rotate-0 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center scroll-reveal reveal-tilt-left cursor-pointer group">
            <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#A7F3D0]/85 rounded shadow-xs rotate-1 border border-[#6EE7B7]"></div>
            <div class="w-20 h-20 rounded-full overflow-hidden bg-stone-100 mt-1 mb-2 border-2 border-stone-200 ring-4 ring-[#E6F4EA] shadow-inner shrink-0 group-hover:ring-emerald-300 transition-all">
              <img id="meet-groom-img" src="${b64Groom || './images/ashish_groom.jpg' || './images/groom.webp'}" alt="${data.hosts?.groom || 'Ashish'}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span class="inline-block px-2 py-0.5 rounded-full text-[8.5px] uppercase tracking-wider font-bold bg-[#E6F4EA] text-[#137333] mb-1">The Groom</span>
            <h4 id="meet-groom-name" class="font-serif text-sm sm:text-base font-bold text-[#2B1E17] leading-tight group-hover:text-amber-800 transition-colors">${data.hosts?.groom || 'Ashish'}</h4>
            <p id="meet-groom-bio" class="text-[10px] text-stone-600 italic mt-1 leading-snug px-0.5 flex-1">"${data.photos?.groomBio || 'Foodie, photography enthusiast, and the architect of their happiest memories.'}"</p>
            <p id="meet-groom-parents" class="text-[8.5px] text-stone-400 mt-1.5 font-sans border-t border-stone-100 pt-1 w-full">${data.hosts?.groomParents || 'S/o Mr. Ramesh & Mrs. Sunita Sharma'}</p>
            <span class="text-[8.5px] text-amber-700 font-semibold mt-1 flex items-center gap-0.5 opacity-80 group-hover:opacity-100">🔍 Tap to view</span>
          </div>

          <!-- Connected Pink Heart -->
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-rose-400 text-2xl animate-pulse drop-shadow scroll-reveal reveal-bounce" style="transition-delay: 250ms;">♡</div>

          <!-- Right Card: Bride (Clickable Modal) -->
          <div onclick="openPersonModal('bride')" class="relative bg-white/95 backdrop-blur-xs p-2.5 pb-4 rounded-2xl shadow-md border border-white/80 hover:border-rose-300 transform rotate-2 hover:rotate-0 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center scroll-reveal reveal-tilt-right cursor-pointer group" style="transition-delay: 150ms;">
            <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#FDE68A]/85 rounded shadow-xs -rotate-1 border border-[#FCD34D]"></div>
            <div class="w-20 h-20 rounded-full overflow-hidden bg-stone-100 mt-1 mb-2 border-2 border-stone-200 ring-4 ring-[#FCE8E6] shadow-inner shrink-0 group-hover:ring-rose-300 transition-all">
              <img id="meet-bride-img" src="${b64Bride || './images/preeti_bride.jpg' || './images/bride.webp'}" alt="${data.hosts?.bride || 'Preeti'}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span class="inline-block px-2 py-0.5 rounded-full text-[8.5px] uppercase tracking-wider font-bold bg-[#FCE8E6] text-[#C5221F] mb-1">The Bride</span>
            <h4 id="meet-bride-name" class="font-serif text-sm sm:text-base font-bold text-[#2B1E17] leading-tight group-hover:text-rose-800 transition-colors">${data.hosts?.bride || 'Preeti'}</h4>
            <p id="meet-bride-bio" class="text-[10px] text-stone-600 italic mt-1 leading-snug px-0.5 flex-1">"${data.photos?.brideBio || 'Loves classic poetry, morning chai, and spontaneous mountain hikes.'}"</p>
            <p id="meet-bride-parents" class="text-[8.5px] text-stone-400 mt-1.5 font-sans border-t border-stone-100 pt-1 w-full">${data.hosts?.brideParents || 'D/o Mr. Vijay & Mrs. Rekha Malhotra'}</p>
            <span class="text-[8.5px] text-rose-700 font-semibold mt-1 flex items-center gap-0.5 opacity-80 group-hover:opacity-100">🔍 Tap to view</span>
          </div>
        </div>
      </section>

      <!-- 2. HANGING WALL CALENDAR & LIVE COUNTDOWN -->
      <section class="py-6 px-2 w-full max-w-[390px] mx-auto select-none">
        <div class="text-center space-y-1 mb-5 scroll-reveal">
          <span class="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold">Mark your calendar</span>
          <h3 id="calendar-month-year" class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">${calMonthName} ${calYear}</h3>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1"></div>
        </div>

        <div class="relative bg-white/95 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border-2 border-stone-200/80 shadow-md scroll-reveal reveal-calendar">
          <div class="absolute -top-3 left-1/3 -translate-x-1/2 w-3.5 h-6 rounded-full border-2 border-stone-400 bg-stone-100 shadow-inner"></div>
          <div class="absolute -top-3 right-1/3 translate-x-1/2 w-3.5 h-6 rounded-full border-2 border-stone-400 bg-stone-100 shadow-inner"></div>

          <div class="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#DB2777] pb-2 border-b border-stone-100 mb-2">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>

          <div id="calendar-grid-days" class="grid grid-cols-7 gap-1 text-center text-xs text-stone-700">
            ${Array.from({ length: firstDayIndex }).map(() => '<span></span>').join('')}
            ${Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isWeddingDay = day === calDayNum;
              return isWeddingDay 
                ? `<div class="relative w-8 h-8 sm:w-9 sm:h-9 mx-auto flex items-center justify-center font-bold text-rose-600 select-none">
                    <svg viewBox="0 0 36 36" class="absolute -inset-1 w-9 h-9 sm:w-10 sm:h-10 pointer-events-none overflow-visible">
                      <path
                        d="M18,31 C10,23 3.5,17 3.5,10.5 C3.5,5.5 7.5,2 12.5,2 C15.5,2 17.5,3.5 18,5 C18.5,3.5 20.5,2 23.5,2 C28.5,2 32.5,5.5 32.5,10.5 C32.5,17 26,23 18,31 Z"
                        fill="rgba(244, 63, 94, 0.16)"
                        stroke="#E11D48"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="calendar-heart-path"
                      />
                    </svg>
                    <span class="relative z-10 text-rose-700 font-extrabold text-sm">${day}</span>
                  </div>`
                : `<div class="h-7 sm:h-8 flex items-center justify-center"><span>${day}</span></div>`;
            }).join('')}
          </div>
        </div>

        <div class="mt-6 text-center scroll-reveal reveal-pop-up" style="transition-delay: 150ms;">
          <span class="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold mb-2.5">Counting down to the shaadi</span>
          <div class="flex justify-center items-center gap-2 sm:gap-3">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FCE7F3] border-2 border-[#F472B6] shadow-2xs flex flex-col items-center justify-center p-1">
              <span id="pastel-days" class="font-serif text-lg sm:text-xl font-bold text-[#9D174D] leading-none">00</span>
              <span class="text-[7.5px] uppercase tracking-wider text-[#BE185D] font-bold mt-0.5">Days</span>
            </div>
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D1FAE5] border-2 border-[#34D399] shadow-2xs flex flex-col items-center justify-center p-1">
              <span id="pastel-hours" class="font-serif text-lg sm:text-xl font-bold text-[#065F46] leading-none">00</span>
              <span class="text-[7.5px] uppercase tracking-wider text-[#047857] font-bold mt-0.5">Hours</span>
            </div>
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FEF3C7] border-2 border-[#FBBF24] shadow-2xs flex flex-col items-center justify-center p-1">
              <span id="pastel-mins" class="font-serif text-lg sm:text-xl font-bold text-[#92400E] leading-none">00</span>
              <span class="text-[7.5px] uppercase tracking-wider text-[#B45309] font-bold mt-0.5">Mins</span>
            </div>
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#EDE9FE] border-2 border-[#A78BFA] shadow-2xs flex flex-col items-center justify-center p-1">
              <span id="pastel-secs" class="font-serif text-lg sm:text-xl font-bold text-[#5B21B6] leading-none">00</span>
              <span class="text-[7.5px] uppercase tracking-wider text-[#6D28D9] font-bold mt-0.5">Secs</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. CELEBRATIONS WITH AUTHENTIC ARCHES & SCOOTER DIVIDERS -->
      <section class="py-8 px-1 w-full max-w-[390px] mx-auto select-none space-y-5">
        <div class="text-center space-y-1 mb-6 scroll-reveal">
          <span class="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold">Programme</span>
          <h2 class="font-serif text-3xl font-light text-[#2B1E17]">The Celebrations</h2>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1"></div>
        </div>

        ${(data.events || []).map((evt, idx) => {
          const archB64 = (typeof b64Events !== 'undefined' && b64Events && b64Events[idx] && b64Events[idx].customB64) 
            || evt.image || evt.img || b64Cover || b64Scooter;

          return `
          <div class="relative w-full select-none space-y-3">
            <div class="w-full flex justify-center -mb-2 scroll-reveal reveal-pop-up">
              <div class="w-full max-w-[350px] aspect-[9/16] rounded-t-[44px] rounded-b-2xl overflow-hidden flex items-center justify-center p-0 drop-shadow-md bg-[#FFFDF7]/95 backdrop-blur-xs border-2 border-amber-100/80">
                <img id="event-img-${evt.id || idx}" src="${archB64}" alt="${evt.name}" class="w-full h-full object-contain object-center" />
              </div>
            </div>

            <div class="text-center scroll-reveal" style="transition-delay: 80ms;">
              <h3 class="font-serif text-2xl font-bold text-[#2B1E17]">${evt.name}</h3>
            </div>

            <div class="relative bg-[#FFFDF9]/95 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border-2 border-stone-200/80 shadow-md space-y-2.5 scroll-reveal" style="transition-delay: 160ms;">
              <div class="space-y-1.5 text-xs text-stone-700">
                <p class="flex items-center gap-2"><span>📅</span><strong class="text-stone-900">${evt.date}</strong> · ⏰ ${evt.time}</p>
                <p class="flex items-center gap-2"><span>📍</span><span><strong class="text-stone-900">${evt.venue}</strong> — ${evt.address}</span></p>
                ${evt.dressCode ? `<p class="flex items-center gap-2"><span>👔</span><span class="text-[#8B6F47] font-semibold">${evt.dressCode}</span></p>` : ''}
              </div>
              <div class="pt-1.5">
                <a href="https://maps.google.com/?q=${encodeURIComponent(evt.venue + ' ' + evt.address)}" target="_blank" class="w-full py-2.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#FCE7F3] text-[#BE185D] hover:bg-[#FBCFE8] transition-all shadow-2xs cursor-pointer">
                  <span>🧭 Get directions</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Animated Yellow Scooter Divider with Roadside Foliage -->
          <div class="w-full flex flex-col items-center my-6 overflow-hidden pointer-events-none select-none scroll-reveal reveal-scooter">
            <div class="relative w-72 h-16 flex items-center justify-center">
              <svg viewBox="0 0 280 60" class="w-full h-full text-stone-300" fill="none">
                <path d="M15,48 Q140,-8 265,48" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="6,5" class="animate-road-dash" />
                <g transform="translate(10, 34) scale(0.65)">
                  <path d="M10,25 C10,12 18,5 20,0 C22,5 30,12 30,25 Z" fill="#16A34A" />
                  <path d="M5,22 C12,12 18,8 20,0" stroke="#15803D" stroke-width="1.5" />
                  <circle cx="20" cy="22" r="3.5" fill="#F59E0B" />
                </g>
                <g transform="translate(252, 32) scale(0.6)">
                  <path d="M5,24 L25,24 L25,12 C25,4 15,0 15,0 C15,0 5,4 5,12 Z" fill="#FDE68A" stroke="#D97706" stroke-width="1.2" />
                  <circle cx="15" cy="0" r="2.5" fill="#EA580C" />
                </g>
              </svg>
              <div class="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                <span class="text-2xl drop-shadow-md transform -rotate-3">🛵</span>
                <span class="text-xs text-stone-400">💨</span>
              </div>
            </div>
          </div>`;
        }).join('')}
      </section>

      <!-- 4. MOMENTS & MEMORIES PHOTO GALLERY -->
      <section class="py-6 px-2 w-full max-w-[390px] mx-auto select-none" id="moments-section">
        <div class="text-center space-y-1 mb-4 scroll-reveal">
          <span class="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold">Moments to cherish</span>
          <h3 class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">Moments & Memories</h3>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1"></div>
          <p class="text-[11px] text-stone-500 font-light max-w-xs mx-auto pt-1 leading-relaxed">
            A glimpse into our sweetest celebrations & unforgettable memories.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2.5" id="moments-grid">
          ${(b64Gallery || []).map((item, idx) => {
            const isLeft = idx % 2 === 0;
            const tapeClass = isLeft 
              ? 'bg-[#FEF08A]/80 border-[#FDE047]' 
              : 'bg-[#EDE9FE]/80 border-[#DDD6FE]';
            const tiltClass = isLeft ? 'reveal-tilt-left -rotate-1' : 'reveal-tilt-right rotate-1';
            const delay = Math.min(360, (idx % 4) * 120);
            return `
            <div class="relative bg-white/95 backdrop-blur-xs p-2 pb-3.5 rounded-lg shadow-md border border-white/80 hover:border-amber-200 transform ${tiltClass} hover:rotate-0 transition-all duration-300 scroll-reveal cursor-pointer" style="transition-delay: ${delay}ms;" onclick="openMomentLightbox('${item.b64 || './images/couple-potrait.webp'}', '${item.caption}')">
              <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 ${tapeClass} rounded shadow-2xs border rotate-1"></div>
              <div class="w-full aspect-square rounded overflow-hidden bg-stone-100 mb-1.5 border border-stone-200">
                <img src="${item.b64 || './images/couple-potrait.webp'}" class="w-full h-full object-cover" />
              </div>
              <div class="text-center"><span class="text-[9px] uppercase font-bold tracking-wider text-stone-500">✦ ${item.caption} ✦</span></div>
            </div>`;
          }).join('')}
        </div>
      </section>

      <!-- 5. THE VENUE ROADMAP -->
      

      <!-- 7. SHARE THE MOMENTS -->
      <section class="py-6 px-2 w-full max-w-[390px] mx-auto text-center select-none space-y-2 scroll-reveal reveal-pop-up">
        <span class="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-500 block">SHARE THE MOMENTS</span>
        <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#2B1E17]">${data.hosts?.hashtag || '#Wedding'}</h3>
        <p class="text-xs text-stone-600 font-light">Tag your photos and stories so we can relive every moment.</p>
        <div class="pt-1.5">
          <button id="theme-hashtag-btn" onclick="copyHashtag('${data.hosts?.hashtag || '#Wedding'}')" class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-95">
            <span>📋 Copy Hashtag</span>
          </button>
        </div>
      </section>

      <!-- 8. PASTEL FOOTER -->
      <footer class="py-10 px-2 w-full max-w-[390px] mx-auto text-center space-y-3.5 border-t-2 border-dashed border-[#F5D0C5] select-none scroll-reveal">
        <h3 class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">See you at the shaadi!</h3>
        <p class="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47]">WITH LOVE, ${(data.hosts?.groom || 'Groom').toUpperCase()} & ${(data.hosts?.bride || 'Bride').toUpperCase()}</p>
        <div class="flex items-center justify-center gap-3">
          <span class="w-6 h-6 rounded-full bg-[#FEF3C7] border border-[#FBBF24] flex items-center justify-center text-xs shadow-xs animate-bounce">💛</span>
          <span class="w-6 h-6 rounded-full bg-[#D1FAE5] border border-[#34D399] flex items-center justify-center text-xs shadow-xs animate-bounce" style="animation-delay: 0.2s;">💚</span>
          <span class="w-6 h-6 rounded-full bg-[#EDE9FE] border border-[#A78BFA] flex items-center justify-center text-xs shadow-xs animate-bounce" style="animation-delay: 0.4s;">💜</span>
          <span class="w-6 h-6 rounded-full bg-[#FCE7F3] border border-[#F472B6] flex items-center justify-center text-xs shadow-xs animate-bounce" style="animation-delay: 0.6s;">💖</span>
        </div>
        <div class="flex items-center justify-center gap-1 pt-1.5">
          <span class="text-3xl drop-shadow">🛵</span>
          <span class="text-xs text-stone-400">💨</span>
        </div>
        <p class="text-xs text-stone-500 font-light italic">We can't wait to celebrate with you</p>
      </footer>
    </div>`}
  </main>

  <!-- GROOM & BRIDE ENLARGED PORTRAIT CARD MODAL (BLURRED BACKDROP) -->
  <div id="person-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/65 backdrop-blur-md transition-all animate-fadeIn" onclick="closePersonModal()">
    <div class="relative w-full max-w-[330px] bg-[#FFFDF9]/95 backdrop-blur-xs rounded-3xl p-5 border-2 border-[#FDE68A]/80 shadow-2xl text-center space-y-3 animate-scaleUp" onclick="event.stopPropagation()">
      <div id="modal-washi" class="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 rounded shadow-xs bg-[#A7F3D0] border border-[#6EE7B7] rotate-1"></div>
      <button onclick="closePersonModal()" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold shadow-xs cursor-pointer z-10 transition-colors" aria-label="Close">✕</button>
      <div class="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border-2 border-stone-200 shadow-inner mt-2">
        <img id="modal-person-img" src="" alt="Person" class="w-full h-full object-cover object-top" />
      </div>
      <div class="space-y-1 pt-1">
        <span id="modal-person-role" class="inline-block px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#E6F4EA] text-[#137333]">The Groom</span>
        <h3 id="modal-person-name" class="font-serif text-2xl font-bold text-[#2B1E17]"></h3>
        <p id="modal-person-bio" class="text-xs text-stone-600 italic px-2"></p>
        <p id="modal-person-lineage" class="text-[10px] text-stone-400 font-sans border-t border-stone-200/60 pt-2 mt-2"></p>
      </div>
      <div class="pt-1">
        <button onclick="closePersonModal()" class="text-[11px] uppercase tracking-widest text-stone-400 font-semibold hover:text-stone-700 cursor-pointer">Tap to close ✕</button>
      </div>
    </div>
  </div>

  <!-- STANDALONE 60FPS ATMOSPHERE CANVAS & AUDIO SYNTHESIZER SCRIPT -->
  <script>
    // 60fps Full-Page Floating Particle Engine
    (function initAtmosphere() {
      const atmoCanvas = document.getElementById('atmosphere-canvas');
      if (!atmoCanvas || !atmoCanvas.getContext) return;
      const actx = atmoCanvas.getContext('2d');
      const resize = () => {
        atmoCanvas.width = window.innerWidth;
        atmoCanvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      const atmoStyle = '${data.atmosphere?.style || 'auto'}';
      const atmoIntensity = '${data.atmosphere?.intensity || 'medium'}';

      if (atmoIntensity === 'none' || atmoStyle === 'none') {
        atmoCanvas.style.display = 'none';
        return;
      }

      let pCount = atmoIntensity === 'subtle' ? 14 : atmoIntensity === 'rich' ? 52 : 28;
      const isMelaTheme = ${isMela};
      const isPichwaiTheme = ${isPichwai};
      const isZardoziTheme = ${isZardozi};
      const isBougainTheme = ${isBougain};

      const particles = [];
      for (let i = 0; i < pCount; i++) {
        let pType = 'petal';
        let pColor = '#F59E0B';
        let speedY = Math.random() * 0.9 + 0.4;
        let size = Math.random() * 6 + 5;

        if (atmoStyle === 'feathers') {
          pType = 'feather';
          pColor = Math.random() > 0.4 ? '#FFFDF8' : '#F8F1E5';
          size = Math.random() * 8 + 12;
          speedY = Math.random() * 0.5 + 0.35;
        } else if (atmoStyle === 'sparkles') {
          pType = Math.random() > 0.5 ? 'sparkle-star' : 'gold-stardust';
          pColor = Math.random() > 0.4 ? '#FFD700' : '#FFF8DC';
          size = Math.random() * 4 + 2;
        } else if (atmoStyle === 'petals') {
          pType = Math.random() > 0.5 ? 'marigold-petal' : 'rose-petal';
          pColor = pType === 'marigold-petal' ? '#F59E0B' : '#E11D48';
          size = Math.random() * 6 + 6;
        } else if (atmoStyle === 'flowers') {
          pType = Math.random() > 0.5 ? 'marigold-flower' : 'bougain-petal';
          pColor = pType === 'marigold-flower' ? '#F59E0B' : '#E11D48';
          size = Math.random() * 6 + 7;
        } else if (atmoStyle === 'fireflies') {
          pType = 'firefly';
          pColor = '#FFD700';
          size = Math.random() * 3 + 2;
          speedY = -(Math.random() * 0.7 + 0.3);
        } else {
          // auto theme defaults
          if (isMelaTheme) { pType = 'marigold-petal'; pColor = '#F59E0B'; }
          else if (isPichwaiTheme) { pType = 'firefly'; pColor = '#FFD700'; speedY = -(Math.random() * 0.7 + 0.3); }
          else if (isZardoziTheme) { pType = 'gold-stardust'; pColor = '#D4AF37'; }
          else { pType = 'marigold-petal'; pColor = '#F59E0B'; }
        }

        particles.push({
          x: Math.random() * atmoCanvas.width,
          y: Math.random() * atmoCanvas.height,
          size,
          speedY,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.03,
          opacity: Math.random() * 0.55 + 0.4,
          pulseOffset: Math.random() * Math.PI * 2,
          type: pType,
          color: pColor,
        });
      }

      let time = 0;
      function loop() {
        actx.clearRect(0, 0, atmoCanvas.width, atmoCanvas.height);
        time += 0.02;

        particles.forEach(p => {
          actx.save();
          actx.translate(p.x, p.y);
          actx.rotate(p.rotation);
          actx.globalAlpha = p.opacity;

          if (p.type === 'feather') {
            const len = p.size * 2.2;
            const w = p.size * 0.7;
            actx.fillStyle = p.color;
            actx.beginPath();
            actx.moveTo(0, -len * 0.5);
            actx.bezierCurveTo(-w * 0.85, -len * 0.2, -w * 0.85, len * 0.3, 0, len * 0.45);
            actx.bezierCurveTo(w * 0.85, len * 0.3, w * 0.85, -len * 0.2, 0, -len * 0.5);
            actx.closePath();
            actx.fill();
            actx.strokeStyle = '#D8C7A5';
            actx.lineWidth = 1;
            actx.beginPath();
            actx.moveTo(0, -len * 0.5);
            actx.quadraticCurveTo(w * 0.15, 0, 0, len * 0.5);
            actx.stroke();
          } else if (p.type === 'sparkle-star') {
            actx.shadowBlur = 8;
            actx.shadowColor = '#FFD700';
            actx.fillStyle = p.color;
            actx.beginPath();
            actx.moveTo(0, -p.size * 1.5);
            actx.lineTo(p.size * 0.35, 0);
            actx.lineTo(0, p.size * 1.5);
            actx.lineTo(-p.size * 0.35, 0);
            actx.closePath();
            actx.fill();
          } else if (p.type === 'firefly') {
            actx.shadowBlur = 12;
            actx.shadowColor = '#FFD700';
            actx.fillStyle = '#FFF8DC';
            actx.beginPath();
            actx.arc(0, 0, p.size, 0, Math.PI * 2);
            actx.fill();
          } else if (p.type === 'marigold-flower') {
            actx.fillStyle = p.color;
            for (let petal = 0; petal < 6; petal++) {
              actx.rotate(Math.PI / 3);
              actx.beginPath();
              actx.ellipse(p.size * 0.4, 0, p.size * 0.45, p.size * 0.3, 0, 0, Math.PI * 2);
              actx.fill();
            }
            actx.fillStyle = '#78350F';
            actx.beginPath();
            actx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
            actx.fill();
          } else {
            // Petal
            actx.fillStyle = p.color;
            actx.beginPath();
            actx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
            actx.fill();
          }

          actx.restore();

          if (p.type === 'feather') {
            const sway = Math.sin(time * 1.6 + p.pulseOffset);
            p.x += sway * 1.1;
            p.rotation = sway * 0.35;
            p.y += p.speedY;
          } else {
            p.y += p.speedY;
            p.x += Math.sin(time + p.pulseOffset) * 0.6;
            p.rotation += p.rotSpeed;
          }

          if (p.speedY > 0 && p.y > atmoCanvas.height + 25) { p.y = -25; p.x = Math.random() * atmoCanvas.width; }
          else if (p.speedY < 0 && p.y < -25) { p.y = atmoCanvas.height + 25; p.x = Math.random() * atmoCanvas.width; }
        });
        requestAnimationFrame(loop);
      }
      loop();
    })();

    // STANDALONE AUDIO ENGINE (Original Wishlys 320kbps MP3 Streaming with Offline Synthesizer Fallback)
    const AUDIO_TRACK_URLS = {
      'modern-muse': 'https://static.wishlys.com/audio/indian-inspirational-modern.mp3',
      'eternal-love': 'https://static.wishlys.com/audio/eternal-love.mp3',
      'saffron-light': 'https://static.wishlys.com/audio/saffron-light.mp3',
      'morning-promise': 'https://static.wishlys.com/audio/morning-promise.mp3',
      'saffron-threads': 'https://static.wishlys.com/audio/saffron-threads.mp3',
      'unfolding-the-invitation': 'https://static.wishlys.com/audio/unfolding-the-invitation.mp3',
      'romantic-vows': 'https://static.wishlys.com/audio/romantic-vows.mp3',
      'piano-promise': 'https://static.wishlys.com/audio/piano-promise.mp3',
      'first-dance': 'https://static.wishlys.com/audio/first-dance.mp3',
      'mountain-vows': 'https://static.wishlys.com/audio/mountain-vows.mp3',
      'wedding-celebration': 'https://static.wishlys.com/audio/wedding-celebration.mp3',
      'sehra-bandi': 'https://static.wishlys.com/audio/sehra-bandi.mp3',
      'joyful-procession': 'https://static.wishlys.com/audio/joyful-procession.mp3',
      'bollywood-heart': 'https://static.wishlys.com/audio/bollywood-heart.mp3',
      'bollywood-nights': 'https://static.wishlys.com/audio/bollywood-nights.mp3',
      'festival-lights': 'https://static.wishlys.com/audio/festival-lights.mp3',
      'marigold-morning': 'https://static.wishlys.com/audio/marigold-morning.mp3',
      'under-the-marigold-canopy': 'https://static.wishlys.com/audio/under-the-marigold-canopy.mp3',
      'shehnai-express': 'https://static.wishlys.com/audio/shehnai-express.mp3',
      'lanterns-of-noor': 'https://static.wishlys.com/audio/lanterns-of-noor.mp3',
      'moonlit-garden': 'https://static.wishlys.com/audio/moonlit-garden.mp3',
      'haveli-lights': 'https://static.wishlys.com/audio/haveli-lights.mp3',
      'mangala-isai': 'https://static.wishlys.com/audio/mangala-isai.mp3',
      'sitar-sunrise': 'https://static.wishlys.com/audio/sitar-sunrise.mp3',
      'dhol-dance-floor': 'https://static.wishlys.com/audio/dhol-dance-floor.mp3',
    };

    class StandaloneAudioEngine {
      constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.track = '${data.music || 'modern-muse'}';
        this.audioEl = null;
        this.timer = null;
      }
      init() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      }
      play() {
        this.isPlaying = true;
        const mp3Url = AUDIO_TRACK_URLS[this.track] || '${data.customMusicUrl || ''}';
        if (mp3Url) {
          try {
            if (!this.audioEl) {
              this.audioEl = new Audio(mp3Url);
              this.audioEl.loop = true;
              this.audioEl.volume = 0.7;
            }
            const p = this.audioEl.play();
            if (p) {
              p.catch(() => this.startSynth());
            }
            return;
          } catch(e) {}
        }
        this.startSynth();
      }
      stop() {
        this.isPlaying = false;
        if (this.audioEl) {
          try {
            this.audioEl.pause();
          } catch(e) {}
        }
        if (this.timer) clearTimeout(this.timer);
      }
      startSynth() {
        this.init();
        if (!this.isPlaying) return;
        this.loopMelody();
      }
      playChime(f) {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, this.ctx.currentTime);
        g.gain.setValueAtTime(0.2, this.ctx.currentTime);
        g.gain.setTargetAtTime(0.001, this.ctx.currentTime + 0.05, 0.3);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start();
        o.stop(this.ctx.currentTime + 0.6);
      }
      loopMelody() {
        if (!this.isPlaying || !this.ctx) return;
        const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 392.00];
        const freq = notes[Math.floor(Math.random() * notes.length)];
        this.playChime(freq);
        this.timer = setTimeout(() => this.loopMelody(), 600);
      }
    }

    const sound = new StandaloneAudioEngine();
    window.sound = sound;
    let musicActive = false;
    window.musicActive = false;
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioEq = document.getElementById('audio-eq');
    const audioText = document.getElementById('audio-btn-text');

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        if (musicActive) {
          sound.stop();
          musicActive = false;
          window.musicActive = false;
          if (audioEq) audioEq.classList.add('hidden');
          if (audioText) audioText.innerText = '🎵 Play Music';
        } else {
          sound.play();
          musicActive = true;
          window.musicActive = true;
          if (audioEq) audioEq.classList.remove('hidden');
          if (audioText) audioText.innerText = 'Playing';
        }
      });
    }

    // Countdown Timer Script
    let targetDate = new Date('${data.hosts?.date || '2026-12-09'}').getTime();
    window.__updateCountdownTarget = function(newTimestamp) {
      if (newTimestamp) targetDate = Number(newTimestamp);
    };
    setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      const elDays = document.getElementById('days');
      if (elDays) {
        elDays.innerText = d;
        const elH = document.getElementById('hours'); if (elH) elH.innerText = h;
        const elM = document.getElementById('mins'); if (elM) elM.innerText = m;
        const elS = document.getElementById('secs'); if (elS) elS.innerText = s;
      }
      const elPastelDays = document.getElementById('pastel-days');
      if (elPastelDays) {
        elPastelDays.innerText = d;
        const elPH = document.getElementById('pastel-hours'); if (elPH) elPH.innerText = h;
        const elPM = document.getElementById('pastel-mins'); if (elPM) elPM.innerText = m;
        const elPS = document.getElementById('pastel-secs'); if (elPS) elPS.innerText = s;
      }
    }, 1000);

    window.__rebuildCalendar = function(d) {
      try {
        if (!d || isNaN(d.getTime())) return;
        var monthName = d.toLocaleString('en-US', { month: 'long' });
        var year = d.getFullYear();
        var dayNum = d.getDate();
        var daysInM = new Date(year, d.getMonth() + 1, 0).getDate();
        var firstDay = new Date(year, d.getMonth(), 1).getDay();

        var titleEl = document.getElementById('calendar-month-year');
        if (titleEl) titleEl.textContent = monthName + ' ' + year;

        var grid = document.getElementById('calendar-grid-days');
        if (!grid) return;
        var html = '';
        for (var k = 0; k < firstDay; k++) {
          html += '<span></span>';
        }
        for (var day = 1; day <= daysInM; day++) {
          if (day === dayNum) {
            html += '<div class="relative w-8 h-8 sm:w-9 sm:h-9 mx-auto flex items-center justify-center font-bold text-rose-600 select-none">'
                 + '<svg viewBox="0 0 36 36" class="absolute -inset-1 w-9 h-9 sm:w-10 sm:h-10 pointer-events-none overflow-visible">'
                 + '<path d="M18,31 C10,23 3.5,17 3.5,10.5 C3.5,5.5 7.5,2 12.5,2 C15.5,2 17.5,3.5 18,5 C18.5,3.5 20.5,2 23.5,2 C28.5,2 32.5,5.5 32.5,10.5 C32.5,17 26,23 18,31 Z" fill="rgba(244, 63, 94, 0.16)" stroke="#E11D48" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="calendar-heart-path" />'
                 + '</svg>'
                 + '<span class="relative z-10 text-rose-700 font-extrabold text-sm">' + day + '</span>'
                 + '</div>';
          } else {
            html += '<div class="h-7 sm:h-8 flex items-center justify-center"><span>' + day + '</span></div>';
          }
        }
        grid.innerHTML = html;
      } catch(e) {
        console.warn('Calendar rebuild notice:', e);
      }
    };

    function triggerCelebrationEffect() {
      if (!window.confetti) return;
      const effectType = '${data.effect || 'confetti'}';
      if (effectType === 'confetti') {
        window.confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 }, colors: ['#8B6F47', '#D4AF37', '#FFD700', '#FFFFFF', '#E6D5BF', '#A9825F'], shapes: ['square'], scalar: 1.1 });
      } else if (effectType === 'colorful') {
        window.confetti({ particleCount: 110, spread: 90, origin: { y: 0.6 }, colors: ['#FF1493', '#00E5FF', '#FFD700', '#76FF03', '#FF6D00', '#9C27B0', '#FF3D00'], shapes: ['circle', 'square'], scalar: 1.15 });
      } else if (effectType === 'hearts') {
        let heartShape = null;
        try { if (window.confetti.shapeFromText) heartShape = window.confetti.shapeFromText({ text: '❤️', scalar: 2 }); } catch(e){}
        window.confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 }, shapes: heartShape ? [heartShape] : ['circle'], colors: ['#E11D48', '#BE123C', '#FB7185', '#F43F5E', '#FDA4AF'], scalar: heartShape ? 2 : 1.2 });
      } else if (effectType === 'stars') {
        window.confetti({ particleCount: 75, spread: 85, origin: { y: 0.6 }, shapes: ['star'], colors: ['#FFD700', '#FFA500', '#FFE87C', '#F59E0B', '#FFFDF7'], scalar: 1.25 });
      } else if (effectType === 'dots') {
        window.confetti({ particleCount: 85, spread: 80, origin: { y: 0.6 }, shapes: ['circle'], colors: ['#334155', '#475569', '#64748B', '#0EA5E9', '#F43F5E', '#F59E0B'], scalar: 0.9 });
      } else if (effectType === 'petals') {
        const end = Date.now() + 1200;
        const frame = () => {
          window.confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FFA500', '#FF4500', '#FFD700', '#E91E63', '#FB7185'], shapes: ['circle'], scalar: 1.25 });
          window.confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FFA500', '#FF4500', '#FFD700', '#E91E63', '#FB7185'], shapes: ['circle'], scalar: 1.25 });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      } else {
        window.confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      }
    }

    window.unlockInvitation = function() {
      const revs = document.querySelectorAll('#reveal-screen, #reveal-screen-folding, #reveal-screen-scratch');
      revs.forEach(function(rev) {
        rev.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(function() {
          rev.style.display = 'none';
        }, 500);
      });
      setTimeout(function() {
        const main = document.getElementById('main-invitation');
        if (main) {
          main.classList.remove('opacity-0');
          main.style.opacity = '1';
        }
        try {
          if (typeof triggerCelebrationEffect === 'function') triggerCelebrationEffect();
        } catch(e) {}
        try {
          if (!window.musicActive && window.sound) {
            window.sound.play();
            window.musicActive = true;
            const audioEq = document.getElementById('audio-eq');
            if (audioEq) audioEq.classList.remove('hidden');
            const audioText = document.getElementById('audio-btn-text');
            if (audioText) audioText.innerText = 'Playing';
          }
        } catch(e) {}
      }, 400);
    };

    // 3D Folding Card Doors for Caricature
    window.unlockCaricatureDoors = function(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      if (window._doorsOpened) return;
      window._doorsOpened = true;
      const leftDoor = document.getElementById('door-left');
      const rightDoor = document.getElementById('door-right');
      const heartSeal = document.getElementById('door-heart-seal');
      if (leftDoor) leftDoor.style.transform = 'perspective(1000px) rotateY(-125deg)';
      if (rightDoor) rightDoor.style.transform = 'perspective(1000px) rotateY(125deg)';
      if (heartSeal) {
        heartSeal.style.transform = 'translate(-50%, -50%) scale(1.6)';
        heartSeal.style.opacity = '0';
      }
      try {
        if (window.sound && typeof window.sound.playChime === 'function') {
          window.sound.playChime(880);
        }
      } catch(e) {}
      setTimeout(() => {
        window.unlockInvitation();
      }, 700);
    };

    // Auto-bind click & touch events to all door trigger elements
    function bindFoldingDoorTriggers() {
      const triggers = [
        document.getElementById('reveal-screen-folding'),
        document.getElementById('door-card-container'),
        document.getElementById('door-left'),
        document.getElementById('door-right'),
        document.getElementById('door-heart-seal'),
        document.getElementById('tap-to-open-btn'),
      ];
      triggers.forEach(function(el) {
        if (!el) return;
        el.onclick = function(ev) { window.unlockCaricatureDoors(ev); };
        el.addEventListener('click', function(ev) { window.unlockCaricatureDoors(ev); });
        el.addEventListener('touchend', function(ev) {
          if (ev.cancelable) ev.preventDefault();
          window.unlockCaricatureDoors(ev);
        });
      });
    }
    bindFoldingDoorTriggers();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindFoldingDoorTriggers);
    }

    // Person Modal Open / Close (Groom & Bride Photo Popup)
    window.openPersonModal = function(role) {
      const modal = document.getElementById('person-modal');
      if (!modal) return;
      const isGroom = role === 'groom';
      const img = document.getElementById('modal-person-img');
      const roleEl = document.getElementById('modal-person-role');
      const nameEl = document.getElementById('modal-person-name');
      const bioEl = document.getElementById('modal-person-bio');
      const linEl = document.getElementById('modal-person-lineage');
      const washi = document.getElementById('modal-washi');
      var groomPhoto = window.__hydratedGroomPhoto || '${b64Groom || './images/ashish_groom.jpg' || './images/groom.webp'}';
      var bridePhoto = window.__hydratedBridePhoto || '${b64Bride || './images/preeti_bride.jpg' || './images/bride.webp'}';
      if (img) img.src = isGroom ? groomPhoto : bridePhoto;
      if (roleEl) {
        roleEl.innerText = isGroom ? 'The Groom' : 'The Bride';
        roleEl.className = 'inline-block px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ' + (isGroom ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-[#FCE8E6] text-[#C5221F]');
      }
      if (nameEl) nameEl.innerText = isGroom ? '${data.hosts?.groom || 'Groom'}' : '${data.hosts?.bride || 'Bride'}';
      if (bioEl) bioEl.innerText = '"' + (isGroom ? '${data.photos?.groomBio || 'Foodie, photography enthusiast, and the architect of their happiest memories.'}' : '${data.photos?.brideBio || 'Loves classic poetry, morning chai, and spontaneous mountain hikes.'}') + '"';
      if (linEl) linEl.innerText = isGroom ? '${data.hosts?.groomParents || 'S/o Mr. Ramesh & Mrs. Sunita Sharma'}' : '${data.hosts?.brideParents || 'D/o Mr. Vijay & Mrs. Rekha Malhotra'}';
      if (washi) washi.className = 'absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 rounded shadow-xs ' + (isGroom ? 'bg-[#A7F3D0] border border-[#6EE7B7] rotate-1' : 'bg-[#FDE68A] border border-[#FCD34D] -rotate-1');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    };
    window.closePersonModal = function() {
      const modal = document.getElementById('person-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    };

    // Hashtag Copy
    window.copyHashtag = function(tag) {
      navigator.clipboard?.writeText(tag || '#Wedding');
      const btn = document.getElementById('hashtag-btn');
      if (btn) btn.innerHTML = '<span>✅ Copied to Clipboard!</span>';
      setTimeout(() => {
        if (btn) btn.innerHTML = '<span>📋 Copy Hashtag</span>';
      }, 2500);
    };

    // Scratch Card Engine (Guarded for non-Caricature themes)
    const canvas = document.getElementById('scratch-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let isScratching = false;
      let scratchedPixels = 0;
      const totalPixels = canvas.width * canvas.height;

      // Draw Gold Foil
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#D4AF37');
      grad.addColorStop(0.5, '#F3E5AB');
      grad.addColorStop(1, '#AA771C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#4A3B32';
      ctx.font = 'bold 15px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCRATCH TO REVEAL DATE', 160, 115);
      ctx.font = '11px Plus Jakarta Sans, sans-serif';
      ctx.fillText('✨ Use touch or mouse ✨', 160, 138);

      function scratch(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();
        sound.playChime(1200 + Math.random() * 400);

        scratchedPixels += 80;
        const pct = Math.min(100, Math.round((scratchedPixels / (totalPixels * 0.4)) * 100));
        const hint = document.getElementById('scratch-hint');
        if (hint) hint.innerText = 'Scrubbing foil... ' + pct + '% cleared';

        if (pct >= 85) {
          unlockInvitation();
        }
      }

      canvas.addEventListener('mousedown', () => isScratching = true);
      window.addEventListener('mouseup', () => isScratching = false);
      canvas.addEventListener('mousemove', e => {
        if (!isScratching) return;
        const rect = canvas.getBoundingClientRect();
        scratch(e.clientX - rect.left, e.clientY - rect.top);
      });

      canvas.addEventListener('touchstart', e => { isScratching = true; e.preventDefault(); });
      window.addEventListener('touchend', () => isScratching = false);
      canvas.addEventListener('touchmove', e => {
        if (!isScratching) return;
        const rect = canvas.getBoundingClientRect();
        const t = e.touches[0];
        scratch(t.clientX - rect.left, t.clientY - rect.top);
        e.preventDefault();
      });
    }

    const skipBtn = document.getElementById('skip-reveal-btn');
    if (skipBtn) skipBtn.addEventListener('click', unlockInvitation);

    const rsvpForm = document.getElementById('standalone-rsvp-form');
    if (rsvpForm) {
      rsvpForm.addEventListener('submit', e => {
        e.preventDefault();
        rsvpForm.style.display = 'none';
        const succ = document.getElementById('rsvp-success');
        if (succ) succ.classList.remove('hidden');
        if (window.confetti) window.confetti({ particleCount: 80, spread: 60 });
      });
    }

    // Scroll Reveal IntersectionObserver (Matches export-1793962607603.mp4)
    if (typeof IntersectionObserver !== 'undefined') {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
      document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));
    }

    // Standalone 60fps Parallax Scroll Engine for Wedding SVGs
    (function initParallax() {
      const bells = document.querySelectorAll('.parallax-bell');
      const garlands = document.querySelectorAll('.parallax-garland');
      const motifs = document.querySelectorAll('.parallax-motif');
      const petals = document.querySelectorAll('.parallax-petal');
      if (!bells.length && !petals.length) return;

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const sy = window.scrollY || window.pageYOffset;
            bells.forEach(b => b.style.transform = 'translate3d(0, ' + (sy * 0.09) + 'px, 0)');
            garlands.forEach(g => g.style.transform = 'translate3d(0, ' + (sy * 0.06) + 'px, 0)');
            motifs.forEach(m => {
              const speed = parseFloat(m.dataset.speed || 0.06);
              const rot = parseFloat(m.dataset.rot || 0);
              m.style.transform = 'translate3d(0, ' + (sy * speed) + 'px, 0) rotate(' + rot + 'deg)';
            });
            petals.forEach((p, idx) => {
              const speed = parseFloat(p.dataset.speed || 0.2);
              const rotSpeed = parseFloat(p.dataset.rotspeed || 0.15);
              const initRot = parseFloat(p.dataset.initrot || 0);
              const sway = Math.sin((sy * 0.008) + idx) * 6;
              p.style.transform = 'translate3d(' + sway + 'px, ' + (sy * speed) + 'px, 0) rotate(' + (initRot + sy * rotSpeed) + 'deg)';
            });
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    })();

    // MOMENTS & MEMORIES UPLOAD & LIGHTBOX ENGINE
    let currentUploadedImageBase64 = '';

    window.openMomentsModal = function() {
      const m = document.getElementById('moments-upload-modal');
      if (m) {
        m.classList.remove('hidden');
        m.classList.add('flex');
      }
    };

    window.closeMomentsModal = function() {
      const m = document.getElementById('moments-upload-modal');
      if (m) {
        m.classList.add('hidden');
        m.classList.remove('flex');
      }
    };

    window.handleMomentFileSelected = function(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      const r = new FileReader();
      r.onload = function(ev) {
        currentUploadedImageBase64 = ev.target.result;
        const prev = document.getElementById('moment-preview-img');
        const box = document.getElementById('moment-preview-box');
        const placeholder = document.getElementById('moment-placeholder');
        if (prev && box && placeholder) {
          prev.src = currentUploadedImageBase64;
          box.classList.remove('hidden');
          placeholder.classList.add('hidden');
        }
      };
      r.readAsDataURL(file);
    };

    window.clearMomentPreview = function() {
      currentUploadedImageBase64 = '';
      const prev = document.getElementById('moment-preview-img');
      const box = document.getElementById('moment-preview-box');
      const placeholder = document.getElementById('moment-placeholder');
      const inp = document.getElementById('moment-file-input');
      if (inp) inp.value = '';
      if (box) box.classList.add('hidden');
      if (placeholder) placeholder.classList.remove('hidden');
    };

    window.submitMomentUpload = function(e) {
      if (e) e.preventDefault();
      if (!currentUploadedImageBase64) {
        alert('Please select or capture a photo first!');
        return;
      }
      const uploader = document.getElementById('moment-uploader-name')?.value || 'Guest';
      const caption = document.getElementById('moment-caption-input')?.value || 'Cherished celebration memory 💕';
      
      const newMem = {
        url: currentUploadedImageBase64,
        caption: caption,
        uploader: uploader,
        id: 'mem_' + Date.now()
      };

      try {
        const existing = JSON.parse(localStorage.getItem('wishlys_moments_uploads') || '[]');
        existing.unshift(newMem);
        localStorage.setItem('wishlys_moments_uploads', JSON.stringify(existing));
      } catch(err) {}

      appendMomentToGrid(newMem, true);

      if (window.confetti) window.confetti({ particleCount: 90, spread: 60 });
      sound.playChime(880);
      closeMomentsModal();
      clearMomentPreview();
      alert('Thank you! Your memory has been posted to the album 💕');
    };

    function appendMomentToGrid(mem, prepend) {
      const grid = document.getElementById('moments-grid');
      if (!grid) return;
      const card = document.createElement('div');
      card.className = 'relative bg-white p-2 pb-3.5 rounded-lg shadow-md border-2 border-pink-200 transform hover:rotate-0 transition-transform duration-300 cursor-pointer';
      card.onclick = function() { openMomentLightbox(mem.url, mem.caption + ' (By ' + mem.uploader + ')'); };
      card.innerHTML = \`
        <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#FCE7F3]/90 border border-[#F472B6] rounded shadow-2xs rotate-1"></div>
        <div class="absolute top-1 right-1 z-10 bg-[#BE185D] text-white text-[7.5px] uppercase font-bold px-1.5 py-0.5 rounded-full">Guest</div>
        <div class="w-full aspect-square rounded overflow-hidden bg-stone-100 mb-1.5 border border-stone-200">
          <img src="\${mem.url}" class="w-full h-full object-cover" />
        </div>
        <div class="text-left px-0.5">
          <p class="text-[10px] font-bold text-stone-800 line-clamp-1">"\${mem.caption}"</p>
          <span class="text-[8.5px] text-[#BE185D] font-semibold block mt-0.5">By \${mem.uploader}</span>
        </div>
      \`;
      if (prepend && grid.firstChild) {
        grid.insertBefore(card, grid.firstChild);
      } else {
        grid.appendChild(card);
      }
    }

    try {
      const stored = JSON.parse(localStorage.getItem('wishlys_moments_uploads') || '[]');
      stored.forEach(mem => appendMomentToGrid(mem, false));
    } catch(e) {}

    window.openMomentLightbox = function(url, caption) {
      const m = document.getElementById('moment-lightbox-modal');
      const img = document.getElementById('moment-lightbox-img');
      const cap = document.getElementById('moment-lightbox-cap');
      if (m && img && cap) {
        img.src = url;
        cap.innerText = caption || 'Cherished Memory';
        m.classList.remove('hidden');
        m.classList.add('flex');
      }
    };

    window.closeMomentLightbox = function() {
      const m = document.getElementById('moment-lightbox-modal');
      if (m) {
        m.classList.add('hidden');
        m.classList.remove('flex');
      }
    };
  </script>

  <!-- MOMENTS & MEMORIES UPLOAD MODAL -->
  <div id="moments-upload-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/70 backdrop-blur-md" onclick="closeMomentsModal()">
    <div class="relative w-full max-w-[340px] bg-[#FFFDF9] rounded-3xl p-5 border-2 border-[#FDE68A] shadow-2xl space-y-3.5" onclick="event.stopPropagation()">
      <button type="button" onclick="closeMomentsModal()" class="absolute top-3 right-3 w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs cursor-pointer">✕</button>
      
      <div class="text-center space-y-0.5">
        <span class="text-[9.5px] uppercase font-bold text-[#DB2777] tracking-wider">Live Wedding Album</span>
        <h3 class="font-serif text-xl text-[#2B1E17]">Share Your Memory</h3>
        <p class="text-[10px] text-stone-500">Upload a selfie or photo with ${data.hosts?.bride || 'Bride'} & ${data.hosts?.groom || 'Groom'}.</p>
      </div>

      <input type="file" id="moment-file-input" accept="image/*" class="hidden" onchange="handleMomentFileSelected(event)" />

      <!-- Placeholder Dropzone -->
      <div id="moment-placeholder" onclick="document.getElementById('moment-file-input').click()" class="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-[#FBBF24] bg-[#FFFDF7] flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-amber-50/50">
        <span class="text-3xl mb-1">📸</span>
        <span class="text-xs font-bold text-stone-800">Tap to Choose / Take Photo</span>
        <span class="text-[9.5px] text-stone-400">Supports phone gallery & camera</span>
      </div>

      <!-- Preview Box -->
      <div id="moment-preview-box" class="hidden relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-[#FBBF24] bg-stone-100">
        <img id="moment-preview-img" src="" class="w-full h-full object-cover" />
        <button type="button" onclick="clearMomentPreview()" class="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-md cursor-pointer">✕ Remove</button>
      </div>

      <div class="space-y-1">
        <label class="text-[9.5px] uppercase font-bold text-stone-600">Your Name *</label>
        <input type="text" id="moment-uploader-name" placeholder="e.g. Priya & Rohan" class="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none" />
      </div>

      <div class="space-y-1">
        <label class="text-[9.5px] uppercase font-bold text-stone-600">Caption / Wish</label>
        <input type="text" id="moment-caption-input" placeholder="e.g. Sangeet dance night! 🎉" class="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none" />
      </div>

      <button type="button" onclick="submitMomentUpload(event)" class="w-full py-2.5 rounded-full bg-gradient-to-r from-[#F472B6] via-[#EC4899] to-[#DB2777] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-101 cursor-pointer">
        Post Memory to Album ✨
      </button>
    </div>
  </div>

  <!-- MOMENTS LIGHTBOX MODAL -->
  <div id="moment-lightbox-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/85 backdrop-blur-md" onclick="closeMomentLightbox()">
    <div class="relative w-full max-w-[350px] bg-white rounded-3xl p-4 shadow-2xl space-y-2.5 text-center" onclick="event.stopPropagation()">
      <button type="button" onclick="closeMomentLightbox()" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-stone-100 text-stone-600 font-bold text-xs cursor-pointer">✕</button>
      <div class="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200">
        <img id="moment-lightbox-img" src="" class="w-full h-full object-contain" />
      </div>
      <p id="moment-lightbox-cap" class="text-xs font-serif font-medium text-stone-800"></p>
    </div>
  </div>
</body>
</html>`;

    // 1. Always save lightweight JSON state first (guaranteed never to exceed browser quota)
    const nowTime = String(Date.now());
    try {
      localStorage.setItem('wishlys_free_saved_data', JSON.stringify(data));
      localStorage.setItem('wishlys_published_data', JSON.stringify(data));
      localStorage.setItem('wishlys_published_data_' + slug, JSON.stringify(data));
      localStorage.setItem('wishlys_published_slug', slug);
      localStorage.setItem('wishlys_published_time', nowTime);
    } catch (jsonErr) {
      console.warn('Could not save data JSON to localStorage:', jsonErr);
    }

    // 2. Clean up previous HTML caches to free up localStorage quota
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('wishlys_published_html') || k === 'wishlys_published_html')) {
          localStorage.removeItem(k);
        }
      }
    } catch (storageErr) {}

    // Auto-save to public/published folder if running locally
    try {
      await fetch('/api/save-published', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: `${slug}.html`, content: standaloneHtml, data, slug })
      });
      await fetch('/api/save-published', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: 'preeti-and-ashish.html', content: standaloneHtml, data, slug })
      });
      await fetch('/api/save-published', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: 'index.html', content: standaloneHtml, data, slug })
      });
    } catch (e) {
      // ignore
    }

    const blob = new Blob([standaloneHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.html`;
    a.click();
    URL.revokeObjectURL(url);
    const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
    const liveUrl = isGitHubPages
      ? `https://aami672.github.io/wedding-invitation/published/${getCoupleSlug()}.html`
      : `${window.location.origin}/published/${slug}.html`;
    setPublishedInfo({
      slug,
      filename: `${slug}.html`,
      liveUrl,
      publishedAt: new Date().toLocaleTimeString(),
    });
    setIsExportingHtml(false);
  };

  // 2. PRINT-READY PDF EXPORT (High-Resolution Isolated Print Document)
  // Cleanly formatted for A4 portrait physical print & digital PDF saves, popup-blocker safe
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      // Preload high-res base64 images so nothing fails or is missing in print/PDF
      const [b64Scooter, b64Cover, b64Groom, b64Bride] = await Promise.all([
        toBase64Optimized('./images/caricature/scooter_couple.webp', 800, 0.85, true),
        toBase64Optimized(data.photos?.cover, 900, 0.85, false),
        toBase64Optimized(data.photos?.groom || './images/groom.webp', 400, 0.85, false),
        toBase64Optimized(data.photos?.bride || './images/bride.webp', 400, 0.85, false),
      ]);

      const printHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${data.hosts?.groom || 'Groom'} & ${data.hosts?.bride || 'Bride'} — Wedding Invitation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alex+Brush&family=Allura&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Great+Vibes&family=Italianno&family=Lora:ital,wght@0,400..700;1,400..700&family=Marcellus&family=Montserrat:wght@300;400;500;600;700&family=Parisienne&family=Philosopher:ital,wght@0,400;0,700;1,400&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Prata&family=Rozha+One&family=Satisfy&family=Tangerine:wght@700&display=swap" rel="stylesheet" />
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #FAF7F2;
      color: #2B1E17;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      padding: 0;
    }
    .print-page {
      width: 100%;
      max-width: 194mm;
      min-height: 275mm;
      margin: 0 auto;
      background: #FFFDF9;
      border: 3.5mm solid #FDE68A;
      outline: 1.5px solid #F59E0B;
      outline-offset: -3mm;
      border-radius: 12mm;
      padding: 12mm 10mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      position: relative;
      page-break-after: always;
      break-after: page;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }
    .print-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }
    .font-serif {
      font-family: 'Cormorant Garamond', Georgia, serif;
    }
    .font-royal {
      font-family: 'Cinzel', serif;
    }
    .corner-ornament {
      position: absolute;
      width: 14mm;
      height: 14mm;
      opacity: 0.75;
    }
    .top-left { top: 3mm; left: 3mm; }
    .top-right { top: 3mm; right: 3mm; transform: scaleX(-1); }
    .bottom-left { bottom: 3mm; left: 3mm; transform: scaleY(-1); }
    .bottom-right { bottom: 3mm; right: 3mm; transform: scale(-1); }
    .card-box {
      background: #FFFFFF;
      border: 1px solid #E6D5BF;
      border-radius: 6mm;
      padding: 4mm 6mm;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }
    .event-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1.5mm;
    }
    .tag-pill {
      display: inline-block;
      padding: 1mm 3mm;
      border-radius: 4mm;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <!-- PAGE 1: LUXURY ROYAL COVER -->
  <div class="print-page">
    <svg class="corner-ornament top-left" viewBox="0 0 40 40" fill="none"><path d="M0,0 L40,0 C20,5 5,20 0,40 Z" fill="#FDE68A"/><path d="M0,0 L25,0 C12,5 5,12 0,25 Z" fill="#F59E0B"/></svg>
    <svg class="corner-ornament top-right" viewBox="0 0 40 40" fill="none"><path d="M0,0 L40,0 C20,5 5,20 0,40 Z" fill="#FDE68A"/><path d="M0,0 L25,0 C12,5 5,12 0,25 Z" fill="#F59E0B"/></svg>
    <svg class="corner-ornament bottom-left" viewBox="0 0 40 40" fill="none"><path d="M0,0 L40,0 C20,5 5,20 0,40 Z" fill="#FDE68A"/><path d="M0,0 L25,0 C12,5 5,12 0,25 Z" fill="#F59E0B"/></svg>
    <svg class="corner-ornament bottom-right" viewBox="0 0 40 40" fill="none"><path d="M0,0 L40,0 C20,5 5,20 0,40 Z" fill="#FDE68A"/><path d="M0,0 L25,0 C12,5 5,12 0,25 Z" fill="#F59E0B"/></svg>

    <div>
      <div style="font-size: 13pt; color: #B45309; font-weight: 600; margin-bottom: 2mm;" class="font-serif">
        ॥ श्री गणेशाय नमः ॥
      </div>
      <p style="font-size: 9pt; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; color: #8B6F47; margin-bottom: 3mm;">
        Together With Their Families
      </p>
      <h1 class="font-serif" style="font-size: 36pt; font-weight: 300; line-height: 1.1; color: #2B1E17; margin: 2mm 0;">
        <span>${data.hosts?.groom || 'Groom'}</span>
        <span style="color: #F43F5E; font-size: 26pt; vertical-align: middle; margin: 0 4mm;">♡</span>
        <span>${data.hosts?.bride || 'Bride'}</span>
      </h1>
      <div style="width: 40mm; height: 1.5px; background: linear-gradient(to right, transparent, #F59E0B, transparent); margin: 3mm auto;"></div>
      <p class="font-royal" style="font-size: 11pt; font-weight: 600; letter-spacing: 1.5px; color: #8B6F47; text-transform: uppercase; margin-top: 2mm;">
        ${data.hosts?.date || '14th February 2027'} · ${data.hosts?.city || 'Udaipur, Rajasthan'}
      </p>
    </div>

    <!-- Centerpiece Caricature -->
    <div style="width: 140mm; height: 110mm; margin: 4mm auto; border-radius: 8mm; background: linear-gradient(to bottom, #FEF3C7, #FFFDF7); border: 1.5mm solid #FDE68A; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 3mm;">
      <img src="${b64Scooter || b64Cover || './images/caricature/scooter_couple.webp'}" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>

    <!-- Bride & Groom Profile Cards -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; max-width: 160mm; margin: 0 auto;">
      <div class="card-box" style="text-align: center;">
        <div style="width: 18mm; height: 18mm; border-radius: 50%; overflow: hidden; border: 1.5px solid #10B981; margin: 0 auto 2mm auto;">
          <img src="${b64Groom || './images/groom.webp'}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <span class="tag-pill" style="background: #E6F4EA; color: #137333;">The Groom</span>
        <h3 class="font-serif" style="font-size: 14pt; margin: 1mm 0; font-weight: 600;">${data.hosts?.groom || 'Groom'}</h3>
        <p style="font-size: 8pt; color: #64748B; font-style: italic; line-height: 1.3;">"${data.photos?.groomBio || 'Foodie, photography enthusiast, and the architect of their happiest memories.'}"</p>
      </div>

      <div class="card-box" style="text-align: center;">
        <div style="width: 18mm; height: 18mm; border-radius: 50%; overflow: hidden; border: 1.5px solid #F43F5E; margin: 0 auto 2mm auto;">
          <img src="${b64Bride || './images/bride.webp'}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <span class="tag-pill" style="background: #FCE8E6; color: #C5221F;">The Bride</span>
        <h3 class="font-serif" style="font-size: 14pt; margin: 1mm 0; font-weight: 600;">${data.hosts?.bride || 'Bride'}</h3>
        <p style="font-size: 8pt; color: #64748B; font-style: italic; line-height: 1.3;">"${data.photos?.brideBio || 'Loves classic poetry, morning chai, and spontaneous mountain hikes.'}"</p>
      </div>
    </div>

    <div style="margin-top: 3mm;">
      <p style="font-size: 8.5pt; color: #64748B; font-style: italic;">"${data.hosts?.welcomeQuote || 'Please join us in celebrating our wedding.'}"</p>
      <p style="font-size: 9pt; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #DB2777; margin-top: 1mm;">
        ${data.hosts?.hashtag || '#Wedding'}
      </p>
    </div>
  </div>

  <!-- PAGE 2: PROGRAMME OF EVENTS -->
  <div class="print-page">
    <div>
      <span class="tag-pill" style="background: #FEF3C7; color: #92400E; margin-bottom: 2mm;">Celebration Itinerary</span>
      <h2 class="font-serif" style="font-size: 28pt; font-weight: 300; color: #2B1E17; margin: 2mm 0;">The Wedding Celebrations</h2>
      <div style="width: 30mm; height: 1.5px; background: #F59E0B; margin: 2mm auto 6mm auto;"></div>

      <div style="display: flex; flex-direction: column; gap: 3.5mm; max-width: 165mm; margin: 0 auto; text-align: left;">
        ${(data.events || []).map(evt => `
          <div class="card-box">
            <div class="event-row">
              <h3 class="font-serif" style="font-size: 15pt; font-weight: 700; color: #2B1E17;">${evt.name}</h3>
              <span style="font-size: 9pt; font-weight: 700; color: #8B6F47; background: #FAF5ED; padding: 1mm 2.5mm; border-radius: 3mm; border: 1px solid #E6D5BF;">
                ${evt.time}
              </span>
            </div>
            <p style="font-size: 9pt; color: #334155; font-weight: 600; margin-bottom: 1mm;">📅 ${evt.date}</p>
            <p style="font-size: 8.5pt; color: #64748B; line-height: 1.3;">
              📍 <strong>${evt.venue}</strong> — ${evt.address}
            </p>
            ${evt.dressCode ? `<p style="font-size: 8pt; color: #8B6F47; font-style: italic; margin-top: 1.5mm;">👔 Dress Code: ${evt.dressCode}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Concierge & Hospitality -->
    ${data.logistics?.contact ? `
    <div style="border-top: 1.5px dashed #F5D0C5; padding-top: 4mm; margin-top: 4mm;">
      <p class="font-serif" style="font-size: 14pt; font-weight: 700; color: #2B1E17;">Celebration Concierge & Hospitality</p>
      <p style="font-size: 10pt; font-weight: 700; color: #881337; margin: 1mm 0;">
        ${data.logistics.contact} · ${data.hosts?.city || 'Udaipur'}
      </p>
      <p style="font-size: 8pt; color: #94A3B8;">With love & warm regards, ${data.hosts?.groom || 'Groom'} & ${data.hosts?.bride || 'Bride'} Families</p>
    </div>` : `
    <div style="border-top: 1.5px dashed #F5D0C5; padding-top: 4mm; margin-top: 4mm; text-align: center;">
      <p style="font-size: 9pt; color: #94A3B8;">With love & warm regards, ${data.hosts?.groom || 'Groom'} & ${data.hosts?.bride || 'Bride'} Families</p>
    </div>`}
  </div>
</body>
</html>`;

      // Safe printing via hidden iframe - 100% immune to popup blockers
      let printFrame = document.getElementById('wishlys-pdf-print-frame');
      if (!printFrame) {
        printFrame = document.createElement('iframe');
        printFrame.id = 'wishlys-pdf-print-frame';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);
      }

      const frameDoc = printFrame.contentWindow.document;
      frameDoc.open();
      frameDoc.write(printHtml);
      frameDoc.close();

      setTimeout(() => {
        setIsExportingPdf(false);
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      }, 700);

    } catch (err) {
      console.error('PDF Export Error:', err);
      setIsExportingPdf(false);
      window.print();
    }
  };

  // 3. CINEMATIC VIDEO REEL EXPORT (9:16 Vertical Story / Reels Format)
  // Exports MP4/WebM with preloaded caricature artwork, animated golden frames, particles & celebratory harmony
  const handleExportVideo = async () => {
    setIsRecordingVideo(true);
    setVideoProgress(5);

    try {
      // Determine best supported MIME type across Safari, Chrome, Android, iOS
      let mimeType = '';
      let fileExt = 'webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
          mimeType = 'video/mp4;codecs=avc1';
          fileExt = 'mp4';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          mimeType = 'video/mp4';
          fileExt = 'mp4';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
          mimeType = 'video/webm;codecs=vp9,opus';
          fileExt = 'webm';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          mimeType = 'video/webm;codecs=vp9';
          fileExt = 'webm';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          mimeType = 'video/webm';
          fileExt = 'webm';
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 1280;
      const ctx = canvas.getContext('2d');

      // Preload couple caricature image
      const coupleImg = new window.Image();
      coupleImg.crossOrigin = 'anonymous';
      coupleImg.src = data.photos?.cover || './images/caricature/scooter_couple.webp';
      await new Promise(r => {
        coupleImg.onload = r;
        coupleImg.onerror = r;
        setTimeout(r, 2000);
      });

      // Synthesize celebratory music chord progression using Web Audio API
      let audioStreamTrack = null;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          const dest = audioCtx.createMediaStreamDestination();
          
          // Joyful celebration chord progression (Indian wedding festive harmony)
          const notes = [311.13, 392.00, 466.16, 523.25, 622.25];
          notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 6.0);
            osc.connect(gain);
            gain.connect(dest);
            osc.start(audioCtx.currentTime + idx * 0.15);
            osc.stop(audioCtx.currentTime + 6.5);
          });
          audioStreamTrack = dest.stream.getAudioTracks()[0];
        }
      } catch (e) {
        console.warn('Audio synthesis fallback');
      }

      const canvasStream = canvas.captureStream(30);
      const combinedTracks = [...canvasStream.getVideoTracks()];
      if (audioStreamTrack) {
        combinedTracks.push(audioStreamTrack);
      }
      const combinedStream = new MediaStream(combinedTracks);

      const recOptions = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(combinedStream, recOptions);
      const chunks = [];

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(chunks, { type: mimeType || 'video/mp4' });
        const videoUrl = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = videoUrl;
        const slug = `${data.hosts?.bride || 'bride'}-and-${data.hosts?.groom || 'groom'}`.toLowerCase().replace(/\s+/g, '-');
        a.download = `wedding-reel-${slug}.${fileExt}`;
        a.click();
        URL.revokeObjectURL(videoUrl);
        setIsRecordingVideo(false);
        setVideoProgress(100);
        triggerCelebration('confetti');
      };

      mediaRecorder.start();

      let frame = 0;
      const totalFrames = 180; // 6 seconds @ 30fps

      const renderVideoFrame = () => {
        // 1. Luxury Warm Sunset Gradient
        const grad = ctx.createLinearGradient(0, 0, 720, 1280);
        grad.addColorStop(0, '#1C0E07');
        grad.addColorStop(0.35, '#3B1E12');
        grad.addColorStop(0.7, '#24120B');
        grad.addColorStop(1, '#140804');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 720, 1280);

        // 2. Double Gold Frame with Ornate Corners
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 4;
        ctx.strokeRect(28, 28, 664, 1224);
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(38, 38, 644, 1204);

        // 3. Floating Gold Sparkles & Petals
        for (let i = 0; i < 45; i++) {
          const px = (i * 59 + frame * 3.5) % 720;
          const py = (i * 67 + Math.sin(frame * 0.05 + i) * 25 + frame * 4.5) % 1280;
          ctx.beginPath();
          ctx.fillStyle = i % 2 === 0 ? 'rgba(251, 191, 36, 0.75)' : 'rgba(244, 63, 94, 0.65)';
          ctx.arc(px, 1280 - py, (i % 3) + 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.textAlign = 'center';

        // 4. Auspicious Top Header
        ctx.fillStyle = '#FBBF24';
        ctx.font = 'bold 24px serif';
        ctx.fillText('॥ श्री गणेशाय नमः ॥', 360, 100);

        ctx.fillStyle = '#E6D5BF';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('TOGETHER WITH THEIR FAMILIES', 360, 140);

        // 5. Centerpiece Illustration with Gentle Breathing Scale
        const scale = 1.0 + Math.sin(frame * 0.05) * 0.03;
        const imgW = 420 * scale;
        const imgH = 340 * scale;
        const imgX = 360 - imgW / 2;
        const imgY = 220 + (340 - imgH) / 2;

        // Glowing Arch behind couple
        ctx.beginPath();
        ctx.fillStyle = 'rgba(254, 243, 199, 0.12)';
        ctx.arc(360, 360, 210, 0, Math.PI * 2);
        ctx.fill();

        if (coupleImg && coupleImg.complete && coupleImg.naturalWidth > 0) {
          ctx.drawImage(coupleImg, imgX, imgY, imgW, imgH);
        }

        // 6. Bride & Groom Names in Gleaming Gold
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 54px serif';
        ctx.fillText(data.hosts?.groom || 'Ashish', 360, 680);

        // Heart pulse
        const heartPulse = 1.0 + Math.sin(frame * 0.1) * 0.15;
        ctx.fillStyle = '#F43F5E';
        ctx.font = `${Math.round(36 * heartPulse)}px sans-serif`;
        ctx.fillText('♡', 360, 740);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 54px serif';
        ctx.fillText(data.hosts?.bride || 'Bride', 360, 810);

        // Subtitle
        ctx.fillStyle = '#FDE68A';
        ctx.font = 'italic 22px serif';
        ctx.fillText('Are Getting Married', 360, 870);

        // 7. Date & City
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 30px serif';
        ctx.fillText(data.hosts?.date || '14th February 2027', 360, 960);

        ctx.fillStyle = '#E6D5BF';
        ctx.font = '22px sans-serif';
        ctx.fillText(data.hosts?.city || 'Udaipur, Rajasthan', 360, 1010);

        // 8. Hashtag
        if (data.hosts?.hashtag) {
          ctx.fillStyle = '#F472B6';
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText(data.hosts?.hashtag, 360, 1090);
        }

        // 9. Bottom Footer
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.font = '16px serif';
        ctx.fillText('Tap to View Full Interactive Invitation · RSVP Online', 360, 1170);

        frame++;
        setVideoProgress(Math.round((frame / totalFrames) * 100));

        if (frame < totalFrames) {
          requestAnimationFrame(renderVideoFrame);
        } else {
          mediaRecorder.stop();
        }
      };

      renderVideoFrame();

    } catch (err) {
      console.error('Video Export Error:', err);
      setIsRecordingVideo(false);
      alert('Video export completed or not supported on this browser version.');
    }
  };

  const getShareUrl = () => {
    const slug = getCoupleSlug();
    const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
    if (isGitHubPages) {
      return `https://aami672.github.io/wedding-invitation/published/${slug}.html`;
    }
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/published/${slug}.html`;
    }
    return `https://aami672.github.io/wedding-invitation/published/${slug}.html`;
  };

  const copyShareText = () => {
    const liveUrl = getShareUrl();
    const text = `Dearest friends & family,\n\nWe are getting married! 💕 Please join our celebrations in ${data.hosts?.city || 'Udaipur'} on ${data.hosts?.date || '14th February 2027'}.\n\nView our wedding invitation & event schedule here:\n👉 ${liveUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const selectedTemplate = TEMPLATES.find(t => t.id === data.template) || TEMPLATES[0];
  const selectedReveal = REVEAL_STYLES.find(r => r.id === data.revealStyle) || REVEAL_STYLES[0];
  const selectedPalette = PALETTES.find(p => p.id === data.palette) || PALETTES[1];
  const selectedMusic = MUSIC_TRACKS.find(m => m.id === data.music) || MUSIC_TRACKS[0];
  const selectedEffect = CELEBRATION_EFFECTS.find(e => e.id === data.effect) || CELEBRATION_EFFECTS[0];
  const selectedAtmosphereStyle = ATMOSPHERE_STYLES.find(s => s.id === (data.atmosphere?.style || 'petals')) || ATMOSPHERE_STYLES[0];
  const selectedAtmosphereIntensity = ATMOSPHERE_INTENSITIES.find(i => i.id === (data.atmosphere?.intensity || 'medium')) || ATMOSPHERE_INTENSITIES[2];
  const selectedTypographySuite = TYPOGRAPHY_SUITES.find(s => s.id === (data.typography?.preset || 'heritage')) || TYPOGRAPHY_SUITES[0];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* STUDIO HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E6D5BF] px-4 sm:px-6 py-3.5 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onExitToHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
          <div className="h-4 w-px bg-stone-200" />
          <div>
            <h1 className="font-serif text-lg font-light text-[#2B1E17] leading-none">
              Wishlys Studio
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              setClientForm({
                bride: data.hosts?.bride || '',
                groom: data.hosts?.groom || '',
                date: data.hosts?.date || '2027-02-14',
                city: data.hosts?.city || 'Udaipur, Rajasthan',
              });
              setIsEditCoupleModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF5ED] border border-[#C5A880] text-xs font-bold text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white transition-all cursor-pointer shadow-2xs"
            title="Set Bride & Groom names"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Couple / Client</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const pubUrl = publishedInfo ? publishedInfo.liveUrl : getShareUrl();
              window.open(pubUrl, '_blank');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF5ED] border border-[#C5A880] text-xs font-bold text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white transition-all cursor-pointer shadow-2xs"
            title="Open published invitation page in new tab"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Guest Preview</span>
          </button>

          <button
            type="button"
            onClick={onOpenDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-stone-500" />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      {/* STUDIO BODY */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT COLUMN: EDIT CONTROLS */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[calc(100vh-65px)] space-y-6">
          
          {/* 4 TOP CARD TABS */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('design')}
              className={`p-3 sm:p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                activeTab === 'design' 
                  ? 'border-[#8B6F47] bg-[#FAF5ED] text-[#8B6F47] shadow-sm ring-1 ring-[#8B6F47]' 
                  : 'border-[#E6D5BF] bg-white text-stone-500 hover:border-stone-400'
              }`}
            >
              <Palette className="w-5 h-5 text-[#8B6F47]" />
              <span className="text-[11px] font-bold tracking-widest uppercase">Design</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`p-3 sm:p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                activeTab === 'content' 
                  ? 'border-[#8B6F47] bg-[#FAF5ED] text-[#8B6F47] shadow-sm ring-1 ring-[#8B6F47]' 
                  : 'border-[#E6D5BF] bg-white text-stone-500 hover:border-stone-400'
              }`}
            >
              <BookOpen className="w-5 h-5 text-[#8B6F47]" />
              <span className="text-[11px] font-bold tracking-widest uppercase">Content</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('extras')}
              className={`p-3 sm:p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                activeTab === 'extras' 
                  ? 'border-[#8B6F47] bg-[#FAF5ED] text-[#8B6F47] shadow-sm ring-1 ring-[#8B6F47]' 
                  : 'border-[#E6D5BF] bg-white text-stone-500 hover:border-stone-400'
              }`}
            >
              <Sparkles className="w-5 h-5 text-[#8B6F47]" />
              <span className="text-[11px] font-bold tracking-widest uppercase">Extras</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('publish')}
              className={`p-3 sm:p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                activeTab === 'publish' 
                  ? 'border-[#8B6F47] bg-[#FAF5ED] text-[#8B6F47] shadow-sm ring-1 ring-[#8B6F47]' 
                  : 'border-[#E6D5BF] bg-white text-stone-500 hover:border-stone-400'
              }`}
            >
              <Globe className="w-5 h-5 text-[#8B6F47]" />
              <span className="text-[11px] font-bold tracking-widest uppercase">Publish</span>
            </button>
          </div>

          {/* TAB 1: DESIGN */}
          {activeTab === 'design' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-serif text-3xl font-light text-[#2B1E17]">Design your invite</h2>
                <p className="text-xs text-stone-500 font-light mt-1">
                  Pick a template, colours, how guests open it, and the music that plays.
                </p>
              </div>

              {/* Invitation Type */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E6D5BF] flex justify-between items-center shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-center text-[#8B6F47]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest font-bold text-stone-400 block">
                      Invitation Type
                    </span>
                    <span className="font-serif text-xl font-light text-[#2B1E17]">
                      {data.type === 'full' ? 'Full Invitation' : 'Save the Date'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setData(prev => ({ ...prev, type: prev.type === 'full' ? 'save-the-date' : 'full' }))}
                  className="px-4 py-1.5 rounded-full border border-stone-200 text-xs font-bold uppercase tracking-wider text-stone-700 hover:border-[#8B6F47] hover:bg-[#FAF5ED] transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* TEMPLATE & OPENING */}
              <div className="space-y-3">
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-400 block">
                  Template & Opening
                </span>

                {/* ROW 1: INVITATION TEMPLATE */}
                <div className="bg-white rounded-2xl border border-[#E6D5BF] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => toggleRow('template')}
                    className="w-full p-4 sm:p-5 flex justify-between items-center text-left hover:bg-stone-50/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-center text-[#8B6F47]">
                        <Image className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-xl font-light text-[#2B1E17]">Invitation template</h4>
                        <p className="text-xs text-stone-500 font-light">{selectedTemplate.name} · {selectedTemplate.badge}</p>
                      </div>
                    </div>
                    {openRow === 'template' ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>

                  {openRow === 'template' && (
                    <div className="p-4 sm:p-6 border-t border-[#E6D5BF] bg-[#FAF8F5]/60">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {TEMPLATES.map(tmpl => (
                          <div
                            key={tmpl.id}
                            onClick={() => {
                              setData(prev => {
                                const isCustomCover = prev.photos?.cover && 
                                  !prev.photos.cover.includes('images/templates/') && 
                                  !prev.photos.cover.includes('images/themes/') && 
                                  !prev.photos.cover.includes('scooter_couple.webp') &&
                                  !prev.photos.cover.includes('caricature.webp');
                                return {
                                  ...prev,
                                  template: tmpl.id,
                                  photos: {
                                    ...prev.photos,
                                    cover: isCustomCover ? prev.photos.cover : getThemeHeroImage(tmpl.id)
                                  }
                                };
                              });
                              setSimulatorMode('invite');
                            }}
                            className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1 ${
                              data.template === tmpl.id ? 'border-[#8B6F47] ring-2 ring-[#C5A880]' : 'border-[#E6D5BF] bg-white'
                            }`}
                          >
                            <div className="aspect-[4/3] w-full bg-stone-900 overflow-hidden relative">
                              <img
                                src={tmpl.image}
                                alt={tmpl.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {data.template === tmpl.id && (
                                <div className="absolute top-2 right-2 bg-[#8B6F47] text-white p-1 rounded-full shadow-md">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                            <div className="p-3 bg-white space-y-0.5">
                              <span className="text-[8px] font-bold uppercase tracking-wider text-[#8B6F47] block">
                                {tmpl.badge}
                              </span>
                              <h5 className="font-serif text-sm font-semibold text-[#2B1E17] leading-snug truncate">
                                {tmpl.name}
                              </h5>
                              <p className="text-[10px] text-stone-400 truncate">{tmpl.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ROW 2: YOUR PHOTOS (EXACT WISHLYS STYLE) */}
                <div className="bg-white rounded-2xl border border-[#E6D5BF] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => toggleRow('photos')}
                    className="w-full p-4 sm:p-5 flex justify-between items-start text-left hover:bg-stone-50/50 transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#A9825F] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Image className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-2xl font-normal text-[#2B1E17] leading-tight">
                          Your photos
                        </h4>
                        <p className="text-xs text-stone-500 font-light mt-1.5 leading-relaxed">
                          The key photos for your invitation: your opening cover and bride & groom portraits.
                        </p>
                      </div>
                    </div>
                    <div className="pt-1 text-stone-400">
                      {openRow === 'photos' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {openRow === 'photos' && (
                    <div className="border-t border-[#F0E6D8] p-5 sm:p-6 space-y-7 bg-white">
                      {/* 1. HERO PHOTO */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold tracking-wider uppercase text-stone-600 block">
                          HERO PHOTO
                        </span>
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Portrait Thumbnail */}
                          <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shadow-xs shrink-0 flex items-center justify-center">
                            {((data.photos?.cover && !data.photos.cover.includes('caricature.webp') && !data.photos.cover.includes('scooter_couple.webp') && !data.photos.cover.includes('truck.webp')) || getThemeHeroImage(data.template)) ? (
                              <img 
                                src={(data.photos?.cover && !data.photos.cover.includes('caricature.webp') && !data.photos.cover.includes('scooter_couple.webp') && !data.photos.cover.includes('truck.webp')) ? data.photos.cover : getThemeHeroImage(data.template)} 
                                alt="Hero Photo" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-stone-400">No photo</span>
                            )}
                          </div>

                          {/* Action Button Row */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <label className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs">
                              <Plus className="w-3.5 h-3.5 text-[#8B6F47]" />
                              <span>CHANGE PHOTO</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={e => handleFileUpload(e, 'cover')} 
                              />
                            </label>

                            {data.photos?.cover && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCropModalConfig({
                                    isOpen: true,
                                    imageSrc: data.photos.cover,
                                    title: 'Adjust & Crop - Hero Cover Photo',
                                    targetField: 'cover',
                                    defaultAspect: 9 / 16,
                                  });
                                }}
                                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <Crop className="w-3.5 h-3.5 text-[#8B6F47]" />
                                <span>ADJUST / CROP</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setGalleryPickerField('cover')}
                              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-stone-300 hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-stone-500" />
                              <span>GALLERY</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => updatePhotos('cover', '')}
                              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-stone-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-stone-400" />
                              <span>REMOVE</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-stone-400 font-light leading-relaxed">
                          The opening full-screen image — your names appear over it. Accents follow the colour palette below.
                        </p>
                      </div>

                      {/* 2. BRIDE & GROOM PROFILE PHOTOS */}
                      <div className="pt-3 border-t border-[#F0E6D8] space-y-6">
                        {/* BRIDE PHOTO */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold tracking-wider uppercase text-stone-600 block">
                            BRIDE PHOTO
                          </span>
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shadow-xs shrink-0 flex items-center justify-center">
                              {data.photos?.bride ? (
                                <img src={data.photos.bride} alt="Bride Photo" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[10px] text-stone-400">No photo</span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <label className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs">
                                <Plus className="w-3.5 h-3.5 text-[#8B6F47]" />
                                <span>CHANGE PHOTO</span>
                                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'bride')} />
                              </label>

                              {data.photos?.bride && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCropModalConfig({
                                      isOpen: true,
                                      imageSrc: data.photos.bride,
                                      title: 'Adjust & Crop - Bride Photo',
                                      targetField: 'bride',
                                      defaultAspect: 3 / 4,
                                    });
                                  }}
                                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                >
                                  <Crop className="w-3.5 h-3.5 text-[#8B6F47]" />
                                  <span>ADJUST / CROP</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setGalleryPickerField('bride')}
                                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-stone-300 hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <Eye className="w-3.5 h-3.5 text-stone-500" />
                                <span>GALLERY</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updatePhotos('bride', '')}
                                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-stone-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-stone-400" />
                                <span>REMOVE</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-stone-400 font-light leading-relaxed">
                            Displayed in the bride's portrait card and profile modal.
                          </p>
                          <div className="pt-1">
                            <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                              Bride's Parents / Lineage (D/o)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. D/o Mr. Vijay & Mrs. Rekha Malhotra"
                              value={data.hosts?.brideParents || ''}
                              onChange={e => updateHosts('brideParents', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white focus:ring-1 focus:ring-[#8B6F47]"
                            />
                          </div>
                        </div>

                        {/* GROOM PHOTO */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold tracking-wider uppercase text-stone-600 block">
                            GROOM PHOTO
                          </span>
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shadow-xs shrink-0 flex items-center justify-center">
                              {data.photos?.groom ? (
                                <img src={data.photos.groom} alt="Groom Photo" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[10px] text-stone-400">No photo</span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <label className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs">
                                <Plus className="w-3.5 h-3.5 text-[#8B6F47]" />
                                <span>CHANGE PHOTO</span>
                                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'groom')} />
                              </label>

                              {data.photos?.groom && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCropModalConfig({
                                      isOpen: true,
                                      imageSrc: data.photos.groom,
                                      title: 'Adjust & Crop - Groom Photo',
                                      targetField: 'groom',
                                      defaultAspect: 3 / 4,
                                    });
                                  }}
                                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                >
                                  <Crop className="w-3.5 h-3.5 text-[#8B6F47]" />
                                  <span>ADJUST / CROP</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setGalleryPickerField('groom')}
                                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-stone-300 hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <Eye className="w-3.5 h-3.5 text-stone-500" />
                                <span>GALLERY</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updatePhotos('groom', '')}
                                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-stone-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-stone-400" />
                                <span>REMOVE</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-stone-400 font-light leading-relaxed">
                            Displayed in the groom's portrait card and profile modal.
                          </p>
                          <div className="pt-1">
                            <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">
                              Groom's Parents / Lineage (S/o)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. S/o Mr. Ramesh & Mrs. Sunita Sharma"
                              value={data.hosts?.groomParents || ''}
                              onChange={e => updateHosts('groomParents', e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white focus:ring-1 focus:ring-[#8B6F47]"
                            />
                          </div>
                        </div>

                        {/* CELEBRATION EVENT PHOTOS SECTION */}
                        <div className="pt-4 border-t border-[#F0E6D8] space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[11px] font-bold tracking-wider uppercase text-stone-700 block">
                                EVENT PHOTOS & ARCHES
                              </span>
                              <p className="text-xs text-stone-400 font-light">
                                Custom backdrop photo or illustrated arch for each celebration event.
                              </p>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF5ED] text-[#8B6F47] border border-[#E6D5BF]">
                              {(data.events || []).length} {(data.events || []).length === 1 ? 'Event' : 'Events'}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {(data.events || []).map((evt, idx) => {
                              const nameLower = (evt.name || '').toLowerCase();
                              const isHaldi = nameLower.includes('haldi');
                              const isMehndi = nameLower.includes('mehndi') || nameLower.includes('mehendi');
                              const isSangeet = nameLower.includes('sangeet');
                              const isWedding = evt.id === 'evt-pheras' || nameLower.includes('wedding') || nameLower.includes('phera') || nameLower.includes('shaadi');
                              const isReception = nameLower.includes('reception') || nameLower.includes('party');

                              const defaultArch = isHaldi ? './images/caricature/haldi_arch.webp'
                                : isMehndi ? './images/caricature/mehndi_arch.webp'
                                : isSangeet ? './images/caricature/sangeet_arch.webp'
                                : isWedding ? './images/caricature/pheras_arch.webp'
                                : isReception ? './images/caricature/reception_arch.webp'
                                : './images/caricature/scooter_couple.webp';

                              const currentImg = evt.image || evt.img || defaultArch;
                              const isCustom = Boolean(evt.image || evt.img);

                              return (
                                <div key={evt.id || idx} className="p-3 sm:p-4 rounded-xl border border-stone-200 bg-[#FFFDF9] space-y-3 shadow-2xs">
                                  <div className="flex items-center justify-between">
                                    <div className="min-w-0 pr-2">
                                      <h5 className="font-serif text-sm font-bold text-[#2B1E17] truncate">
                                        {evt.name || `Event #${idx + 1}`}
                                      </h5>
                                      <p className="text-[10px] text-stone-500">{evt.date} · {evt.time}</p>
                                    </div>
                                    <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded shrink-0 ${
                                      isCustom ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-600'
                                    }`}>
                                      {isCustom ? 'Custom Photo' : 'Theme Arch'}
                                    </span>
                                  </div>

                                  <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-lg overflow-hidden border border-stone-200 bg-[#FFFDF7] shadow-xs shrink-0 flex items-center justify-center p-1">
                                      <img src={currentImg} alt={evt.name} className="w-full h-full object-contain" />
                                    </div>

                                    <div className="flex-1 space-y-2">
                                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                        <label className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs">
                                          <Plus className="w-3.5 h-3.5 text-[#8B6F47]" />
                                          <span>CHANGE PHOTO</span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => handleFileUpload(e, { type: 'event', eventId: evt.id, eventName: evt.name })}
                                          />
                                        </label>

                                        {isCustom && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setCropModalConfig({
                                                isOpen: true,
                                                imageSrc: currentImg,
                                                title: `Adjust & Crop - ${evt.name}`,
                                                targetField: { type: 'event', eventId: evt.id },
                                                defaultAspect: 9 / 16,
                                              });
                                            }}
                                            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                          >
                                            <Crop className="w-3.5 h-3.5 text-[#8B6F47]" />
                                            <span>ADJUST / CROP</span>
                                          </button>
                                        )}

                                        <button
                                          type="button"
                                          onClick={() => setGalleryPickerField({ type: 'event', eventId: evt.id, eventName: evt.name })}
                                          className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-stone-300 hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                        >
                                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                                          <span>GALLERY</span>
                                        </button>

                                        {isCustom && (
                                          <button
                                            type="button"
                                            onClick={() => updateEvent(evt.id, 'image', '')}
                                            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-stone-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                            title="Revert to original theme arch"
                                          >
                                            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                                            <span>RESET TO THEME</span>
                                          </button>
                                        )}
                                      </div>

                                      <p className="text-[11px] text-stone-400 leading-snug">
                                        Displayed in the scalloped pop-up arch for {evt.name}.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quick Shortcut to Moments & Memories Gallery */}
                        <div className="pt-3 border-t border-[#F0E6D8]">
                          <div className="p-3.5 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#8B6F47] text-white flex items-center justify-center shrink-0">
                                <Camera className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="font-serif text-sm font-semibold text-[#2B1E17]">Moments & Memories Gallery</h5>
                                <p className="text-[11px] text-stone-500">{(data.gallery || []).length} photos in the Polaroid gallery</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setOpenRow('gallery')}
                              className="px-3 py-1.5 rounded-lg bg-white border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-800 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Manage Photos →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ROW: MOMENTS & MEMORIES GALLERY */}
                <div className="bg-white rounded-2xl border border-[#E6D5BF] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => toggleRow('gallery')}
                    className="w-full p-4 sm:p-5 flex justify-between items-start text-left hover:bg-stone-50/50 transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#A9825F] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-2xl font-normal text-[#2B1E17] leading-tight">
                            Moments & memories
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5ED] text-[#8B6F47] border border-[#E6D5BF]">
                            {(data.gallery || []).length} photos
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-light mt-1.5 leading-relaxed">
                          Upload, change, arrange or delete photos in your couple Polaroid photo gallery.
                        </p>
                      </div>
                    </div>
                    <div className="pt-1 text-stone-400">
                      {openRow === 'gallery' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {openRow === 'gallery' && (
                    <div className="border-t border-[#F0E6D8] p-5 sm:p-6 space-y-6 bg-white">
                      {/* Top Action Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6D5BF]">
                        <div>
                          <span className="text-xs font-bold text-[#2B1E17] block">Polaroid Photo Gallery</span>
                          <span className="text-[11px] text-stone-500">Each photo appears as a pinned Polaroid card with caption & tag.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="px-3.5 py-2 rounded-lg bg-[#8B6F47] hover:bg-[#725a38] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs">
                            <Plus className="w-4 h-4" />
                            <span>+ UPLOAD PHOTOS</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handleGalleryUpload}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={resetGalleryToDefault}
                            className="px-3 py-2 rounded-lg border border-stone-300 hover:border-stone-400 hover:bg-white text-stone-600 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                            title="Reset to 12 curated royal palace photos"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                          </button>
                        </div>
                      </div>

                      {/* Gallery Items Grid */}
                      {(data.gallery || []).length === 0 ? (
                        <div className="border-2 border-dashed border-stone-200 rounded-2xl p-8 text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-[#FAF5ED] text-[#8B6F47] mx-auto flex items-center justify-center">
                            <Camera className="w-6 h-6" />
                          </div>
                          <h5 className="font-serif text-lg text-stone-800">No photos in Moments & Memories</h5>
                          <p className="text-xs text-stone-500 max-w-sm mx-auto">Upload your couple photos, pre-wedding shoot pictures, or engagement moments.</p>
                          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B6F47] text-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#725a38] transition-colors shadow-sm">
                            <Plus className="w-4 h-4" />
                            <span>Upload Your Photos</span>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
                          {(data.gallery || []).map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl border border-stone-200 bg-[#FFFDFB] hover:border-[#D5C2AA] transition-all flex flex-col sm:flex-row items-start sm:items-center gap-3.5 shadow-2xs group"
                            >
                              {/* Photo Thumbnail */}
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shrink-0 shadow-xs">
                                <img
                                  src={item.url || item.img}
                                  alt={item.caption || `Moment ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                                  #{idx + 1}
                                </span>
                              </div>

                              {/* Form Controls */}
                              <div className="flex-1 w-full space-y-2">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                  <div className="flex-1">
                                    <input
                                      type="text"
                                      value={item.caption || ''}
                                      onChange={(e) => updateGalleryItem(idx, 'caption', e.target.value)}
                                      placeholder="Caption (e.g. In each other's eyes)"
                                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:border-[#8B6F47] focus:ring-1 focus:ring-[#8B6F47] outline-hidden font-medium text-stone-800"
                                    />
                                  </div>
                                  <div className="w-full sm:w-32">
                                    <select
                                      value={item.tag || 'General'}
                                      onChange={(e) => updateGalleryItem(idx, 'tag', e.target.value)}
                                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 font-medium focus:border-[#8B6F47] outline-hidden cursor-pointer"
                                    >
                                      {['General', 'Haldi', 'Mehndi', 'Sangeet', 'Wedding', 'Reception'].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                {/* Actions row: Change Photo, Gallery Preset, Reorder, Remove */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <label className="px-2.5 py-1 rounded-md border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer">
                                      <Plus className="w-3 h-3 text-[#8B6F47]" />
                                      <span>Change</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleChangeSingleGalleryPhoto(idx, file);
                                        }}
                                      />
                                    </label>

                                    {(item.url || item.img) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCropModalConfig({
                                            isOpen: true,
                                            imageSrc: item.url || item.img,
                                            title: `Adjust & Crop - Memory #${idx + 1}`,
                                            targetField: { type: 'galleryItem', index: idx },
                                            defaultAspect: 4 / 5,
                                          });
                                        }}
                                        className="px-2.5 py-1 rounded-md border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                                      >
                                        <Crop className="w-3 h-3 text-[#8B6F47]" />
                                        <span>Crop</span>
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => setGalleryPickerField({ type: 'galleryItem', index: idx })}
                                      className="px-2.5 py-1 rounded-md border border-stone-300 hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-600 font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                                    >
                                      <Eye className="w-3 h-3 text-stone-500" />
                                      <span>Presets</span>
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => moveGalleryPhoto(idx, -1)}
                                      className="p-1 rounded border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed text-stone-600 cursor-pointer"
                                      title="Move photo up"
                                    >
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === (data.gallery || []).length - 1}
                                      onClick={() => moveGalleryPhoto(idx, 1)}
                                      className="p-1 rounded border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed text-stone-600 cursor-pointer"
                                      title="Move photo down"
                                    >
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeGalleryPhoto(idx)}
                                      className="p-1 rounded border border-stone-200 hover:border-red-300 hover:bg-red-50 text-stone-400 hover:text-red-600 cursor-pointer transition-colors ml-1"
                                      title="Delete photo"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ROW 3: REVEAL SCREEN */}
                <div className="bg-white rounded-2xl border border-[#E6D5BF] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => toggleRow('reveal')}
                    className="w-full p-4 sm:p-5 flex justify-between items-center text-left hover:bg-stone-50/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#A9825F] flex items-center justify-center text-white shadow-xs">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-2xl font-light text-[#2B1E17]">Reveal screen</h4>
                        {openRow !== 'reveal' && (
                          <p className="text-xs text-stone-500 font-light mt-0.5">
                            {selectedReveal?.name || '3D PASTEL FOLDING DOORS'}
                          </p>
                        )}
                      </div>
                    </div>
                    {openRow === 'reveal' ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>

                  {openRow === 'reveal' && (
                    <div className="p-4 sm:p-6 border-t border-[#E6D5BF] bg-[#FAF8F5]/60 space-y-3">
                      <p className="text-xs text-stone-500 font-light -mt-1 mb-2">
                        Pick the interactive animation guests play with before the invitation reveals.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {REVEAL_STYLES.map(rev => {
                          const isSelected = data.revealStyle === rev.id || (!data.revealStyle && rev.id === 'folding-doors');
                          const isLocked = rev.template && rev.template !== 'caricature' && rev.template !== data.template;
                          const IconComponent = REVEAL_ICON_MAP[rev.icon] || Mail;

                          return (
                            <button
                              key={rev.id}
                              type="button"
                              onClick={() => {
                                if (rev.template && rev.template !== data.template) {
                                  setData(prev => ({ ...prev, template: rev.template, revealStyle: rev.id }));
                                } else {
                                  setData(prev => ({ ...prev, revealStyle: rev.id }));
                                }
                                setSimulatorMode('replay');
                              }}
                              className={`p-3 sm:py-3.5 sm:px-4 rounded-2xl text-left cursor-pointer transition-all flex items-center justify-between border ${
                                isSelected 
                                  ? 'border-2 border-[#8B6F47] bg-[#FAF8F5] shadow-xs' 
                                  : isLocked
                                    ? 'border-stone-200/80 bg-white/70 hover:bg-stone-50/60'
                                    : 'border-stone-200/80 bg-white hover:border-stone-300 hover:bg-stone-50/40'
                              }`}
                            >
                              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                                <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${isSelected ? 'text-[#8B6F47]' : 'text-stone-400'}`}>
                                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold tracking-wider text-xs sm:text-[13px] text-[#2B1E17] uppercase">
                                      {rev.name}
                                    </span>
                                    {rev.isNew && (
                                      <span className="bg-[#059669] text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded-full uppercase leading-none inline-flex items-center">
                                        NEW
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] sm:text-xs text-stone-400 font-light truncate block mt-0.5">
                                    {rev.subtitle || rev.description}
                                  </span>
                                </div>
                              </div>

                              <div className="flex-shrink-0 ml-2">
                                {isSelected ? (
                                  <div className="w-5 h-5 rounded-full bg-[#8B6F47] text-white flex items-center justify-center shadow-xs">
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  </div>
                                ) : isLocked ? (
                                  <Lock className="w-3.5 h-3.5 text-stone-300" />
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* ROW 4: MONOGRAM */}
                <div className="bg-white rounded-2xl border border-[#E6D5BF] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => toggleRow('monogram')}
                    className="w-full p-4 sm:p-5 flex justify-between items-center text-left hover:bg-stone-50/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-center text-[#8B6F47]">
                        <Stamp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-xl font-light text-[#2B1E17]">Monogram</h4>
                        <p className="text-xs text-stone-500 font-light">Your initials on the seal ({data.monogram?.initials || 'A & S'})</p>
                      </div>
                    </div>
                    {openRow === 'monogram' ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>

                  {openRow === 'monogram' && (
                    <div className="p-4 sm:p-6 border-t border-[#E6D5BF] bg-[#FAF8F5]/60 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full border-2 border-[#C5A880] flex items-center justify-center font-royal text-xl font-bold text-[#8B6F47] bg-white shadow-md shrink-0">
                        {data.monogram?.initials || 'A & S'}
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Seal Initials</label>
                        <input
                          type="text"
                          maxLength={8}
                          value={data.monogram?.initials || ''}
                          onChange={e => setData(prev => ({ ...prev, monogram: { ...prev.monogram, initials: e.target.value } }))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* LOOK & FEEL */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-400 block">
                  Look & Feel
                </span>

                {/* ROW 5: COLOUR PALETTE */}
                <div className="bg-white rounded-2xl border border-[#E6D5BF] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => toggleRow('palette')}
                    className="w-full p-4 sm:p-5 flex justify-between items-center text-left hover:bg-stone-50/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-center text-[#8B6F47]">
                        <Palette className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-xl font-light text-[#2B1E17]">Colour palette</h4>
                        <p className="text-xs text-stone-500 font-light">{selectedPalette.name}</p>
                      </div>
                    </div>
                    {openRow === 'palette' ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>

                  {openRow === 'palette' && (
                    <div className="p-4 sm:p-6 border-t border-[#E6D5BF] bg-[#FAF8F5]/60">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {PALETTES.map(pal => (
                          <button
                            key={pal.id}
                            type="button"
                            onClick={() => setData(prev => ({ ...prev, palette: pal.id }))}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                              data.palette === pal.id ? 'border-[#8B6F47] bg-white ring-2 ring-[#8B6F47]' : 'border-stone-200 bg-white'
                            }`}
                          >
                            <div className="flex gap-1 mb-1.5">
                              {pal.colors.map((c, i) => (
                                <span key={i} className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                              ))}
                            </div>
                            <p className="text-xs font-semibold text-stone-800 truncate">{pal.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ROW 6: TYPOGRAPHY & FONTS */}
                <div className="bg-white rounded-2xl border border-[#E6D5BF] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => toggleRow('typography')}
                    className="w-full p-4 sm:p-5 flex justify-between items-center text-left hover:bg-stone-50/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-center text-[#8B6F47]">
                        <Type className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-2xl font-light text-[#2B1E17]">Typography & Fonts</h4>
                        {openRow !== 'typography' && (
                          <p className="text-xs text-stone-500 font-light mt-0.5">
                            {selectedTypographySuite?.name || 'Royal Heritage'} • {data.typography?.headingFont || 'Cinzel'} & {data.typography?.bodyFont || 'Cormorant Garamond'}
                          </p>
                        )}
                      </div>
                    </div>
                    {openRow === 'typography' ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>

                  {openRow === 'typography' && (
                    <div className="p-4 sm:p-6 border-t border-[#E6D5BF] bg-[#FAF8F5]/60 space-y-6">
                      
                      {/* SECTION 1: CURATED DESIGNER FONT SUITES */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-serif text-lg font-normal text-[#2B1E17] flex items-center gap-2">
                              <span>✨</span> Designer Typography Suites
                            </h5>
                            <p className="text-xs text-stone-500 font-light mt-0.5">
                              Handpicked font pairings curated for luxury Indian & modern wedding invitations.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {TYPOGRAPHY_SUITES.map(suite => {
                            const isSelected = (data.typography?.preset === suite.id) || 
                              (!data.typography?.preset && suite.id === 'heritage');

                            return (
                              <button
                                key={suite.id}
                                type="button"
                                onClick={() => {
                                  setData(prev => ({
                                    ...prev,
                                    typography: {
                                      preset: suite.id,
                                      headingFont: suite.headingFont,
                                      bodyFont: suite.bodyFont,
                                      scriptFont: suite.scriptFont,
                                    }
                                  }));
                                }}
                                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden ${
                                  isSelected 
                                    ? 'border-2 border-[#8B6F47] bg-white shadow-md ring-1 ring-[#C5A880]/50' 
                                    : 'border border-stone-200/90 bg-white hover:border-stone-300 hover:shadow-xs'
                                }`}
                              >
                                <div className="flex items-center justify-between w-full mb-2">
                                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#8B6F47] bg-[#FAF5ED] px-2 py-0.5 rounded-md border border-[#E6D5BF]/60">
                                    {suite.badge}
                                  </span>
                                  {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-[#8B6F47] text-white flex items-center justify-center shadow-xs">
                                      <Check className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                </div>

                                {/* Live Font Preview */}
                                <div className="space-y-1 my-1.5 py-1 px-2.5 rounded-xl bg-[#FAF8F5]/80 border border-stone-100">
                                  <p 
                                    style={{ fontFamily: `"${suite.headingFont}", serif` }} 
                                    className="text-base text-[#2B1E17] font-semibold tracking-wide truncate"
                                  >
                                    {data.hosts?.bride || 'Bride'} & {data.hosts?.groom || 'Groom'}
                                  </p>
                                  <p 
                                    style={{ fontFamily: `"${suite.scriptFont}", cursive` }} 
                                    className="text-sm text-[#8B6F47] truncate leading-tight"
                                  >
                                    {suite.previewText}
                                  </p>
                                  <p 
                                    style={{ fontFamily: `"${suite.bodyFont}", Georgia, serif` }} 
                                    className="text-[11px] text-stone-500 font-light truncate"
                                  >
                                    Together with their families
                                  </p>
                                </div>

                                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
                                  <span className="text-xs font-semibold text-stone-800">{suite.name}</span>
                                  <span className="text-[10px] text-stone-400 font-light">
                                    {suite.headingFont} + {suite.bodyFont}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="w-full h-px bg-[#E6D5BF]/80 my-4" />

                      {/* SECTION 2: CUSTOM FONT PICKERS (FINE-GRAINED CONTROL) */}
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-serif text-lg font-normal text-[#2B1E17] flex items-center gap-2">
                            <span>🖋️</span> Custom Font Styling
                          </h5>
                          <p className="text-xs text-stone-500 font-light mt-0.5">
                            Mix and match heading, body, and signature script fonts individually.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          {/* Heading Font */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                              Headings & Titles
                            </label>
                            <select
                              value={data.typography?.headingFont || 'Cinzel'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setData(prev => ({
                                  ...prev,
                                  typography: {
                                    ...prev.typography,
                                    preset: 'custom',
                                    headingFont: val,
                                  }
                                }));
                              }}
                              className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8B6F47] cursor-pointer shadow-xs"
                            >
                              {HEADING_FONTS.map(f => (
                                <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>
                                  {f.name}
                                </option>
                              ))}
                            </select>
                            <p 
                              style={{ fontFamily: `"${data.typography?.headingFont || 'Cinzel'}", serif` }} 
                              className="text-sm font-semibold text-[#8B6F47] truncate px-1 pt-0.5"
                            >
                              Sample: {data.hosts?.bride || 'Bride'} & {data.hosts?.groom || 'Groom'}
                            </p>
                          </div>

                          {/* Body / Subtitle Font */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                              Body Text & Cards
                            </label>
                            <select
                              value={data.typography?.bodyFont || 'Cormorant Garamond'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setData(prev => ({
                                  ...prev,
                                  typography: {
                                    ...prev.typography,
                                    preset: 'custom',
                                    bodyFont: val,
                                  }
                                }));
                              }}
                              className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8B6F47] cursor-pointer shadow-xs"
                            >
                              {BODY_FONTS.map(f => (
                                <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>
                                  {f.name}
                                </option>
                              ))}
                            </select>
                            <p 
                              style={{ fontFamily: `"${data.typography?.bodyFont || 'Cormorant Garamond'}", Georgia, serif` }} 
                              className="text-xs text-stone-600 truncate px-1 pt-0.5"
                            >
                              Sample: Together with their families
                            </p>
                          </div>

                          {/* Script Font */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                              Signature Calligraphy Script
                            </label>
                            <select
                              value={data.typography?.scriptFont || 'Great Vibes'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setData(prev => ({
                                  ...prev,
                                  typography: {
                                    ...prev.typography,
                                    preset: 'custom',
                                    scriptFont: val,
                                  }
                                }));
                              }}
                              className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#8B6F47] cursor-pointer shadow-xs"
                            >
                              {SCRIPT_FONTS.map(f => (
                                <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>
                                  {f.name}
                                </option>
                              ))}
                            </select>
                            <p 
                              style={{ fontFamily: `"${data.typography?.scriptFont || 'Great Vibes'}", cursive` }} 
                              className="text-base text-[#8B6F47] truncate px-1"
                            >
                              Sample: Two Hearts As One
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {/* ROW 7: ATMOSPHERE & CELEBRATION EFFECTS */}
                <div className="bg-white rounded-2xl border border-[#E6D5BF] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => toggleRow('effects')}
                    className="w-full p-4 sm:p-5 flex justify-between items-center text-left hover:bg-stone-50/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#A9825F] flex items-center justify-center text-white shadow-xs">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-2xl font-light text-[#2B1E17]">Atmosphere & Celebration effects</h4>
                        {openRow !== 'effects' && (
                          <p className="text-xs text-stone-500 font-light mt-0.5">
                            {selectedAtmosphereStyle?.name || 'Flower Petals'} • {selectedAtmosphereIntensity?.label || 'Medium'} • {selectedEffect?.name || 'CONFETTI'}
                          </p>
                        )}
                      </div>
                    </div>
                    {openRow === 'effects' ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>

                  {openRow === 'effects' && (
                    <div className="p-4 sm:p-6 border-t border-[#E6D5BF] bg-[#FAF8F5]/60 space-y-6">
                      
                      {/* SECTION 1: CONTINUOUS SCREEN ATMOSPHERE */}
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-serif text-lg font-normal text-[#2B1E17] flex items-center gap-2">
                              <span>🌸</span> Invitation Floating Atmosphere
                            </h5>
                            <p className="text-xs text-stone-500 font-light mt-0.5">
                              Continuous floating petals, flowers, sparkles, or feathers strictly inside your invitation screen.
                            </p>
                          </div>
                        </div>

                        {/* ATMOSPHERE STYLE SELECTION */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                            Floating Style
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                            {ATMOSPHERE_STYLES.map(style => {
                              const isSelected = (data.atmosphere?.style === style.id) || (!data.atmosphere?.style && style.id === 'petals');
                              return (
                                <button
                                  key={style.id}
                                  type="button"
                                  onClick={() => {
                                    setData(prev => ({
                                      ...prev,
                                      atmosphere: {
                                        style: style.id,
                                        intensity: prev.atmosphere?.intensity || 'medium'
                                      }
                                    }));
                                  }}
                                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between group ${
                                    isSelected 
                                      ? 'border-2 border-[#8B6F47] bg-[#FAF8F5] shadow-xs ring-1 ring-[#C5A880]/40' 
                                      : 'border border-stone-200/90 bg-white hover:border-stone-300 hover:bg-stone-50/40'
                                  }`}
                                >
                                  <div className="flex items-center justify-between w-full mb-1">
                                    <span className="text-2xl">{style.icon}</span>
                                    {isSelected && (
                                      <div className="w-5 h-5 rounded-full bg-[#8B6F47] text-white flex items-center justify-center">
                                        <Check className="w-3 h-3" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-[#2B1E17] leading-tight">{style.name}</p>
                                    <p className="text-[10px] text-stone-400 font-light leading-snug line-clamp-1 mt-0.5">{style.desc}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* ATMOSPHERE INTENSITY SELECTOR */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                              Particle Intensity & Density
                            </label>
                            <span className="text-xs text-[#8B6F47] font-semibold capitalize">
                              {data.atmosphere?.intensity || 'medium'}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/70">
                            {ATMOSPHERE_INTENSITIES.map(lvl => {
                              const isSelected = (data.atmosphere?.intensity === lvl.id) || (!data.atmosphere?.intensity && lvl.id === 'medium');
                              return (
                                <button
                                  key={lvl.id}
                                  type="button"
                                  onClick={() => {
                                    setData(prev => ({
                                      ...prev,
                                      atmosphere: {
                                        style: prev.atmosphere?.style || 'petals',
                                        intensity: lvl.id
                                      }
                                    }));
                                  }}
                                  className={`py-2 px-2 rounded-xl text-center cursor-pointer transition-all ${
                                    isSelected 
                                      ? 'bg-white text-[#2B1E17] font-semibold shadow-xs border border-stone-300/80 ring-1 ring-stone-200' 
                                      : 'text-stone-500 hover:text-stone-800 text-xs font-normal'
                                  }`}
                                >
                                  <div className="text-xs">{lvl.label}</div>
                                  <div className="text-[9px] text-stone-400 font-light truncate hidden sm:block">{lvl.desc}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-px bg-[#E6D5BF]/80 my-4" />

                      {/* SECTION 2: UNLOCK & RSVP BURST ANIMATION */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                            Unlock & RSVP Burst Effect
                          </label>
                          <p className="text-xs text-stone-500 font-light mt-0.5">
                            Particle animation that bursts when the invite unlocks and when guests RSVP.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                          {CELEBRATION_EFFECTS.map(eff => {
                            const isSelected = (data.effect === eff.id) || (!data.effect && eff.id === 'confetti');

                            return (
                              <button
                                key={eff.id}
                                type="button"
                                onClick={() => {
                                  setData(prev => ({ ...prev, effect: eff.id }));
                                  triggerCelebration(eff.id);
                                }}
                                className={`py-3.5 px-3 sm:py-4.5 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group ${
                                  isSelected 
                                    ? 'border-2 border-[#8B6F47] bg-[#FAF8F5] shadow-xs' 
                                    : 'border border-stone-200/90 bg-white hover:border-stone-300 hover:bg-stone-50/40'
                                }`}
                              >
                                <div className="h-5 flex items-center justify-center">
                                  {eff.id === 'confetti' && (
                                    <div className="w-2.5 h-4 bg-[#8B6F47] rounded-[2px]" />
                                  )}
                                  {eff.id === 'colorful' && (
                                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                                      <circle cx="12" cy="12" r="2.5" fill="#F59E0B" />
                                      <line x1="12" y1="2" x2="12" y2="6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                                      <line x1="12" y1="18" x2="12" y2="22" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                                      <line x1="2" y1="12" x2="6" y2="12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                                      <line x1="18" y1="12" x2="22" y2="12" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
                                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
                                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
                                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                  )}
                                  {eff.id === 'hearts' && (
                                    <Heart className="w-4 h-4 fill-stone-800 text-stone-800" />
                                  )}
                                  {eff.id === 'stars' && (
                                    <Star className="w-4 h-4 fill-stone-800 text-stone-800" />
                                  )}
                                  {eff.id === 'dots' && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-stone-800" />
                                  )}
                                  {eff.id === 'petals' && (
                                    <Flower2 className="w-4 h-4 text-stone-800 stroke-[2]" />
                                  )}
                                </div>

                                <span className="font-bold tracking-widest text-[11px] sm:text-xs uppercase text-[#2B1E17] block">
                                  {eff.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MUSIC */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-400 block">
                  Music
                </span>

                {/* ROW 7: BACKGROUND MUSIC */}
                <div className="bg-white rounded-2xl border border-[#E6D5BF] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => toggleRow('music')}
                    className="w-full p-4 sm:p-5 flex justify-between items-center text-left hover:bg-stone-50/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-center text-[#8B6F47]">
                        <MusicIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-xl font-light text-[#2B1E17]">Background music</h4>
                        <p className="text-xs text-stone-500 font-light">{selectedMusic.name} · {selectedMusic.mood}</p>
                      </div>
                    </div>
                    {openRow === 'music' ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>

                  {openRow === 'music' && (
                    <div className="p-4 sm:p-6 border-t border-[#E6D5BF] bg-[#FAF8F5]/60 space-y-3">
                      {MUSIC_TRACKS.map(track => (
                        <div
                          key={track.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                            data.music === track.id ? 'border-[#8B6F47] bg-[#FAF5ED] ring-1 ring-[#C5A880]' : 'border-stone-200 bg-white'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handlePlayMusicPreview(track.id)}
                            className="w-9 h-9 rounded-full bg-[#FAF5ED] border border-[#C5A880] text-[#8B6F47] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shrink-0"
                            title="Play audio sample"
                          >
                            {playingMusicId === track.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                          
                          <div className="flex-1 ml-3 cursor-pointer" onClick={() => selectMusic(track.id)}>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-semibold text-stone-800">{track.name}</p>
                              {playingMusicId === track.id && (
                                <span className="flex gap-0.5 items-end h-3">
                                  <span className="w-0.5 bg-[#8B6F47] rounded-full animate-pulse h-2.5" />
                                  <span className="w-0.5 bg-[#C5A880] rounded-full animate-pulse h-1.5" />
                                  <span className="w-0.5 bg-[#8B6F47] rounded-full animate-pulse h-3" />
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-stone-500">{track.desc}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => selectMusic(track.id)}
                            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                              data.music === track.id ? 'bg-[#8B6F47] text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            {data.music === track.id ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2B1E17] hover:bg-[#8B6F47] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Content</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT */}
          {activeTab === 'content' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
                <h3 className="font-serif text-2xl font-light text-[#2B1E17]">Couple & Host Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Bride's Name</label>
                    <input
                      type="text"
                      value={data.hosts?.bride || ''}
                      onChange={e => updateHosts('bride', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-[#8B6F47]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Groom's Name</label>
                    <input
                      type="text"
                      value={data.hosts?.groom || ''}
                      onChange={e => updateHosts('groom', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-[#8B6F47]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Bride's Parents / Lineage (D/o)</label>
                    <input
                      type="text"
                      placeholder="e.g. D/o Mr. Vijay & Mrs. Rekha Malhotra"
                      value={data.hosts?.brideParents || ''}
                      onChange={e => updateHosts('brideParents', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-[#8B6F47]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Groom's Parents / Lineage (S/o)</label>
                    <input
                      type="text"
                      placeholder="e.g. S/o Mr. Ramesh & Mrs. Sunita Sharma"
                      value={data.hosts?.groomParents || ''}
                      onChange={e => updateHosts('groomParents', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-[#8B6F47]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Bride's Short Bio / Quote</label>
                    <input
                      type="text"
                      placeholder="e.g. Loves classic poetry, morning chai..."
                      value={data.photos?.brideBio || ''}
                      onChange={e => updatePhotos('brideBio', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-[#8B6F47]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Groom's Short Bio / Quote</label>
                    <input
                      type="text"
                      placeholder="e.g. Foodie, photography enthusiast..."
                      value={data.photos?.groomBio || ''}
                      onChange={e => updatePhotos('groomBio', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-[#8B6F47]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Wedding Date</label>
                    <input
                      type="date"
                      value={data.hosts?.date || ''}
                      onChange={e => updateHosts('date', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-[#8B6F47]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Main City / Destination</label>
                    <input
                      type="text"
                      value={data.hosts?.city || ''}
                      onChange={e => updateHosts('city', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-[#8B6F47]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Welcome Quote / Invitation Line</label>
                    <input
                      type="text"
                      value={data.hosts?.welcomeQuote || ''}
                      onChange={e => updateHosts('welcomeQuote', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-1 focus:ring-[#8B6F47]"
                    />
                  </div>
                </div>
              </div>

              {/* CELEBRATION EVENTS & INTERACTIVE MAP LOCATIONS */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif text-2xl font-light text-[#2B1E17]">Events & Venue Maps</h3>
                    <p className="text-xs text-stone-500">Edit venue or street address; the embedded Google Map updates instantly.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addEvent}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF5ED] border border-[#C5A880] text-[#8B6F47] text-xs font-bold uppercase tracking-wider hover:bg-[#8B6F47] hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Event
                  </button>
                </div>

                <div className="space-y-4">
                  {(data.events || []).map((evt, idx) => (
                    <div key={evt.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-lg font-light text-[#2B1E17]">Event #{idx + 1}: {evt.name}</span>
                        <button
                          type="button"
                          onClick={() => removeEvent(evt.id)}
                          className="text-stone-400 hover:text-red-500 p-1 cursor-pointer"
                          title="Remove event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 1-Click Popular Destination Presets */}
                      <div>
                        <span className="text-[9px] uppercase font-bold text-stone-400 block mb-1">Quick Landmark Presets</span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => applyVenuePreset(evt.id, 'The Oberoi Udaivilas', 'Haridas Ji Ki Magri, Udaipur, Rajasthan 313001')}
                            className="px-2 py-1 rounded-md border border-stone-200 bg-stone-50 text-[10px] text-stone-600 hover:border-[#8B6F47] hover:bg-[#FAF5ED] cursor-pointer"
                          >
                            🏰 Udaivilas, Udaipur
                          </button>
                          <button
                            type="button"
                            onClick={() => applyVenuePreset(evt.id, 'Taj Lake Palace', 'Lake Pichola, Udaipur, Rajasthan 313001')}
                            className="px-2 py-1 rounded-md border border-stone-200 bg-stone-50 text-[10px] text-stone-600 hover:border-[#8B6F47] hover:bg-[#FAF5ED] cursor-pointer"
                          >
                            🏯 Lake Palace
                          </button>
                          <button
                            type="button"
                            onClick={() => applyVenuePreset(evt.id, 'Rambagh Palace', 'Bhawani Singh Rd, Jaipur, Rajasthan 302005')}
                            className="px-2 py-1 rounded-md border border-stone-200 bg-stone-50 text-[10px] text-stone-600 hover:border-[#8B6F47] hover:bg-[#FAF5ED] cursor-pointer"
                          >
                            🌺 Rambagh Palace, Jaipur
                          </button>
                          <button
                            type="button"
                            onClick={() => applyVenuePreset(evt.id, 'Diaz Banquete', 'Meerut, Uttar Pradesh')}
                            className="px-2 py-1 rounded-md border border-stone-200 bg-stone-50 text-[10px] text-stone-600 hover:border-[#8B6F47] hover:bg-[#FAF5ED] cursor-pointer"
                          >
                            ✨ Diaz Banquete, Meerut
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[9px] uppercase font-bold text-stone-500 mb-0.5">Event Name</label>
                          <input
                            type="text"
                            value={evt.name}
                            onChange={e => updateEvent(evt.id, 'name', e.target.value)}
                            placeholder="e.g. Sangeet Celebration"
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                          />
                        </div>

                        {/* Calendar Date Picker Input */}
                        <div>
                          <label className="flex items-center gap-1 text-[9px] uppercase font-bold text-[#8B6F47] mb-0.5">
                            <Calendar className="w-3 h-3 text-[#8B6F47]" />
                            <span>Event Date (Calendar Picker)</span>
                          </label>
                          <input
                            type="date"
                            value={getEventIsoDate(evt, data.hosts?.date)}
                            onChange={e => handleEventDateChange(evt.id, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#C5A880]/60 bg-[#FFFDF9] text-xs font-semibold text-[#2B1E17] focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#8B6F47] shadow-2xs cursor-pointer"
                          />
                        </div>

                        {/* Formatted Date Display Label */}
                        <div>
                          <label className="block text-[9px] uppercase font-bold text-stone-500 mb-0.5">Date Display Label</label>
                          <input
                            type="text"
                            value={evt.date || ''}
                            onChange={e => updateEvent(evt.id, 'date', e.target.value)}
                            placeholder="e.g. Friday, 12th February 2027"
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                          />
                        </div>

                        {/* Event Time */}
                        <div>
                          <label className="flex items-center gap-1 text-[9px] uppercase font-bold text-stone-500 mb-0.5">
                            <Clock className="w-3 h-3 text-stone-400" />
                            <span>Event Time</span>
                          </label>
                          <input
                            type="text"
                            value={evt.time || ''}
                            onChange={e => updateEvent(evt.id, 'time', e.target.value)}
                            placeholder="e.g. 10:30 AM onwards"
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-stone-500 mb-0.5">Venue Name</label>
                          <input
                            type="text"
                            value={evt.venue}
                            onChange={e => updateEvent(evt.id, 'venue', e.target.value)}
                            placeholder="e.g. The Oberoi Udaivilas"
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-stone-500 mb-0.5">Street Address (for Google Map)</label>
                          <input
                            type="text"
                            value={evt.address}
                            onChange={e => updateEvent(evt.id, 'address', e.target.value)}
                            placeholder="e.g. Haridas Ji Ki Magri, Udaipur"
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-stone-500 mb-0.5">Dress Code / Attire</label>
                          <input
                            type="text"
                            value={evt.dressCode || ''}
                            onChange={e => updateEvent(evt.id, 'dressCode', e.target.value)}
                            placeholder="e.g. Haldi Yellow & Festive Cottons"
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-stone-500 mb-1">Event Photo / Arch Artwork</label>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <div className="w-12 h-16 rounded-lg overflow-hidden border border-stone-200 bg-[#FFFDF7] shrink-0 flex items-center justify-center p-0.5">
                              <img src={evt.image || evt.img || './images/caricature/pheras_arch.webp'} alt={evt.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="px-3 py-1.5 rounded-lg border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs">
                                <Plus className="w-3.5 h-3.5 text-[#8B6F47]" />
                                <span>CHANGE PHOTO</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => handleFileUpload(e, { type: 'event', eventId: evt.id, eventName: evt.name })}
                                />
                              </label>

                              {(evt.image || evt.img) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCropModalConfig({
                                      isOpen: true,
                                      imageSrc: evt.image || evt.img,
                                      title: `Adjust & Crop - ${evt.name}`,
                                      targetField: { type: 'event', eventId: evt.id },
                                      defaultAspect: 9 / 16,
                                    });
                                  }}
                                  className="px-3 py-1.5 rounded-lg border border-[#D5C2AA] hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                >
                                  <Crop className="w-3.5 h-3.5 text-[#8B6F47]" />
                                  <span>CROP</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setGalleryPickerField({ type: 'event', eventId: evt.id, eventName: evt.name })}
                                className="px-3 py-1.5 rounded-lg border border-stone-300 hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <Eye className="w-3.5 h-3.5 text-stone-500" />
                                <span>GALLERY</span>
                              </button>

                              {(evt.image || evt.img) && (
                                <button
                                  type="button"
                                  onClick={() => updateEvent(evt.id, 'image', '')}
                                  className="px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 text-[10px] font-semibold transition-colors"
                                >
                                  Reset to Theme
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Map Location Preview */}
                      <div className="pt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] uppercase font-bold text-stone-400">
                            Live Google Map: {evt.venue ? `${evt.venue}, ` : ''}{evt.address}
                          </span>
                          <a
                            href={evt.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent((evt.venue || '') + ' ' + (evt.address || 'Udaipur'))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#8B6F47] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Open Link</span>
                            <Compass className="w-3 h-3" />
                          </a>
                        </div>
                        <iframe
                          title={evt.name}
                          width="100%"
                          height="130"
                          style={{ border: 0 }}
                          className="rounded-xl border border-stone-200"
                          src={evt.mapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent((evt.venue || '') + ' ' + (evt.address || 'Udaipur'))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MOMENTS & MEMORIES PHOTO GALLERY ACCESS IN CONTENT TAB */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-serif text-2xl font-light text-[#2B1E17]">Moments & Memories Photo Gallery</h3>
                    <p className="text-xs text-stone-500">{(data.gallery || []).length} photos in the album. Upload couple moments, edit captions, and assign event tags.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('design');
                      setOpenRow('gallery');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF5ED] border border-[#C5A880] text-[#8B6F47] text-xs font-bold uppercase tracking-wider hover:bg-[#8B6F47] hover:text-white transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Open Photo Studio</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('design')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-stone-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Design</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('extras')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2B1E17] hover:bg-[#8B6F47] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer"
                >
                  <span>Continue to Extras</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: EXTRAS */}
          {activeTab === 'extras' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
                <h3 className="font-serif text-2xl font-light text-[#2B1E17]">Social & Hashtag</h3>
                <p className="text-xs text-stone-500">Customize your official wedding hashtag for guests to tag and share memories.</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Wedding Hashtag</label>
                    <input
                      type="text"
                      value={data.hosts?.hashtag || ''}
                      onChange={e => setData(prev => ({ ...prev, hosts: { ...prev.hosts, hashtag: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-[#881337]"
                      placeholder={`#${(data.hosts?.bride || 'Bride').replace(/\s+/g, '')}Weds${(data.hosts?.groom || 'Groom').replace(/\s+/g, '')}`}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-stone-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Content</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('publish')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B6F47] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer"
                >
                  <span>Publish & Export</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PUBLISH (HTML, PDF, VIDEO EXPORT) */}
          {activeTab === 'publish' && (
            <div className="space-y-6 animate-fadeIn">
              {/* ✦ PRIMARY FINISH & PUBLISH HERO CARD ✦ */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2B1E17] via-[#3D2C22] to-[#2B1E17] text-white shadow-2xl border border-[#C5A880]/40 space-y-4 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30">
                        <Sparkles className="w-3 h-3" />
                        Client Ready
                      </span>
                      <span className="text-[11px] text-stone-300 font-mono">
                        /published/{getCoupleSlug()}.html
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-light text-white leading-tight">
                      Finish & Publish for {data.hosts?.bride || 'Bride'} & {data.hosts?.groom || 'Groom'}
                    </h3>
                    <p className="text-xs text-stone-300 font-light max-w-xl leading-relaxed">
                      Click below to finish: builds your standalone <strong className="text-[#FFD700]">{getCoupleSlug()}.html</strong>, updates the live link, and downloads the file for your client.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinishAndPublish}
                    disabled={isPublishing || isExportingHtml}
                    className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#D5A021] via-[#FFD700] to-[#E6C35C] hover:from-[#C4901C] hover:to-[#D5A021] text-[#2B1E17] font-bold text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {isPublishing || isExportingHtml ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-[#2B1E17]" />
                        <span>Publishing Invitation...</span>
                      </>
                    ) : (
                      <>
                        <CheckCheck className="w-4 h-4 text-[#2B1E17]" />
                        <span>Finish & Publish</span>
                      </>
                    )}
                  </button>
                </div>

                {/* DYNAMIC UPDATED LIVE URL BANNER */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-[#FFD700]/40 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFD700] flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      Live Invitation URL for {data.hosts?.bride || 'Bride'} & {data.hosts?.groom || 'Groom'}
                    </span>
                    {publishedInfo && (
                      <span className="text-[9px] text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                        ✓ Published at {publishedInfo.publishedAt}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={publishedInfo ? publishedInfo.liveUrl : `https://aami672.github.io/wedding-invitation/published/${getCoupleSlug()}.html`}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/20 text-xs text-stone-100 font-mono select-all focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const targetUrl = publishedInfo ? publishedInfo.liveUrl : `https://aami672.github.io/wedding-invitation/published/${getCoupleSlug()}.html`;
                          navigator.clipboard.writeText(targetUrl);
                          setCopiedPublished(true);
                          setTimeout(() => setCopiedPublished(false), 2200);
                        }}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#B3966E] text-[#2B1E17] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                        title="Copy updated live invitation URL"
                      >
                        {copiedPublished ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPublished ? 'Copied!' : 'Copy Link'}</span>
                      </button>

                      <a
                        href={publishedInfo ? publishedInfo.liveUrl : `https://aami672.github.io/wedding-invitation/published/${getCoupleSlug()}.html`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        title="Open live published page in new tab"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#FFD700]" />
                        <span>Open ↗</span>
                      </a>

                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Dearest family & friends,\n\nWe are delighted to invite you to celebrate the wedding of ${data.hosts?.bride || 'Bride'} & ${data.hosts?.groom || 'Groom'}! 💍✨\n\nView our interactive invitation & wedding schedule here:\n${publishedInfo ? publishedInfo.liveUrl : `https://aami672.github.io/wedding-invitation/published/${getCoupleSlug()}.html`}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                        title="Share on WhatsApp"
                      >
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Format Export Options */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-light text-[#2B1E17]">Additional Export Formats</h3>
                    <p className="text-xs text-stone-500">Standalone interactive HTML file, printable PDF document, or video reel.</p>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  {/* 1. STANDALONE INTERACTIVE HTML FILE */}
                  <button
                    type="button"
                    onClick={handleExportHtml}
                    disabled={isExportingHtml}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-[#C5A880] bg-[#FAF5ED] hover:bg-[#8B6F47] hover:text-white transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-[#8B6F47] group-hover:text-white shrink-0" />
                      <div className="text-left">
                        <p className="text-xs font-bold tracking-wider uppercase">
                          {isExportingHtml ? 'Optimizing for iPhone & Android (under 4MB)...' : 'Download Standalone Interactive HTML File'}
                        </p>
                        <p className="text-[11px] text-stone-500 group-hover:text-stone-100 font-light">
                          Optimized for iPhone Safari, Files & Android (under 4MB) with interactive reveal, music & venue map.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider shrink-0 ml-2">HTML</span>
                  </button>

                  {/* 2. PRINT / EXPORT TO PDF */}
                  <button
                    type="button"
                    onClick={handleExportPdf}
                    disabled={isExportingPdf}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-white hover:border-[#8B6F47] transition-all cursor-pointer shadow-xs group"
                  >
                    <div className="flex items-center gap-3">
                      <Printer className="w-5 h-5 text-stone-600 group-hover:text-[#8B6F47] shrink-0" />
                      <div className="text-left">
                        <p className="text-xs font-bold tracking-wider uppercase text-stone-800 group-hover:text-[#8B6F47]">
                          {isExportingPdf ? 'Preparing High-Res Printable A4 Document...' : 'Export in PDF (Print-Ready A4)'}
                        </p>
                        <p className="text-[11px] text-stone-500 font-light">
                          High-resolution A4 printable card layout with gold border, couple portraits & event itinerary.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600 shrink-0 ml-2">PDF</span>
                  </button>

                  {/* 3. CINEMATIC VIDEO REEL EXPORT */}
                  <button
                    type="button"
                    onClick={handleExportVideo}
                    disabled={isRecordingVideo}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-white hover:border-[#8B6F47] transition-all cursor-pointer shadow-xs group ${
                      isRecordingVideo ? 'opacity-85 ring-2 ring-[#8B6F47]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-stone-600 group-hover:text-[#8B6F47] shrink-0" />
                      <div className="text-left">
                        <p className="text-xs font-bold tracking-wider uppercase text-stone-800 group-hover:text-[#8B6F47]">
                          {isRecordingVideo ? `Recording Wedding Reel... ${videoProgress}%` : 'Export in Video (.mp4 / .webm)'}
                        </p>
                        <p className="text-[11px] text-stone-500 font-light">
                          6-second cinematic 9:16 vertical story reel with caricature artwork, music & animations for WhatsApp Status & Instagram.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-600 shrink-0 ml-2">
                      {isRecordingVideo ? `${videoProgress}%` : 'Video'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PHONE SIMULATOR MATCHING WISHLYS RECORDING */}
        <div className="w-full lg:w-1/2 bg-[#ECE7DE] p-4 sm:p-6 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-[#E6D5BF] relative overflow-hidden">
          
          {/* TOP CONTROLS BAR: REPLAY, INVITE, WHATSAPP PREVIEW */}
          <div className="mb-4 flex items-center justify-between w-full max-w-md px-2 z-10">
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

            {/* THREE PILL BUTTONS MATCHING WISHLYS RECORDING */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSimulatorMode('replay')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  simulatorMode === 'replay'
                    ? 'bg-[#3E2B1F] text-white'
                    : 'bg-white text-stone-700 border border-[#D5CFC5] hover:bg-stone-50'
                }`}
                title="Replay Opening & Scratch Reveal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>

              <button
                type="button"
                onClick={() => setSimulatorMode('invite')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                  simulatorMode === 'invite'
                    ? 'bg-[#3E2B1F] text-white'
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
                    ? 'bg-[#3E2B1F] text-white'
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
            className={`transition-all duration-500 overflow-y-auto overflow-x-hidden rounded-[40px] shadow-2xl border-[10px] border-[#1C1917] bg-white relative [contain:paint] isolate ${
              previewDevice === 'mobile' 
                ? 'w-[390px] h-[780px] max-h-[88vh]' 
                : previewDevice === 'tablet' 
                ? 'w-[680px] h-[750px] max-h-[85vh]' 
                : 'w-full h-full max-h-[85vh]'
            }`}
          >
            {previewDevice === 'mobile' && (
              <div className="sticky top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-[#1C1917] rounded-b-xl z-50 pointer-events-none mx-auto mb-[-16px]" />
            )}

            {(simulatorMode === 'invite' || simulatorMode === 'replay') && (
              <InvitationExperience 
                data={data} 
                isPreview={true} 
                previewMode={simulatorMode} 
                activeGroup={previewGroup} 
              />
            )}

            {simulatorMode === 'whatsapp' && (
              <div className="min-h-full bg-[#E5DDD5] flex flex-col font-sans select-none">
                <div className="bg-[#075E54] text-white px-3 py-3 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setSimulatorMode('invite')} className="text-white hover:opacity-80">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/40">
                      <img src={data.photos?.bride} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight truncate max-w-[140px]">
                        {data.hosts?.bride} & {data.hosts?.groom} 💍
                      </h4>
                      <p className="text-[10px] text-emerald-100 font-light leading-none">online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <VideoIcon className="w-4 h-4" />
                    <Phone className="w-4 h-4" />
                    <MoreVertical className="w-4 h-4" />
                  </div>
                </div>

                <div 
                  className="flex-1 p-3 space-y-3 flex flex-col justify-end"
                  style={{
                    backgroundImage: `radial-gradient(#128C7E 0.75px, transparent 0.75px)`,
                    backgroundSize: '16px 16px',
                    backgroundColor: '#EFE7DD'
                  }}
                >
                  <div className="flex justify-center my-2">
                    <span className="bg-white/80 backdrop-blur-xs text-[10px] font-semibold text-stone-600 px-3 py-0.5 rounded-md shadow-xs uppercase">
                      Today
                    </span>
                  </div>

                  <div className="self-end max-w-[90%] bg-[#DCF8C6] rounded-2xl p-2 shadow-sm border border-emerald-200/50 space-y-2">
                    <div 
                      onClick={() => setSimulatorMode('invite')}
                      className="bg-white rounded-xl overflow-hidden border border-emerald-300/40 shadow-xs cursor-pointer hover:opacity-95 transition-opacity"
                    >
                      <div className="aspect-[16/9] w-full bg-stone-900 overflow-hidden relative">
                        <img 
                          src={selectedTemplate.image || data.photos?.cover} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {selectedTemplate.name}
                        </div>
                      </div>
                      <div className="p-2.5 space-y-1">
                        <p className="text-[9px] uppercase tracking-wider font-bold text-stone-400">
                          wishlys-free.com
                        </p>
                        <h5 className="font-serif text-sm font-bold text-stone-900 leading-snug">
                          {data.hosts?.bride} & {data.hosts?.groom} — Wedding Invitation
                        </h5>
                        <p className="text-[10px] text-stone-600 line-clamp-2">
                          Join us in celebrating our wedding in {data.hosts?.city || 'Meerut'} on {data.hosts?.date || '14th February 2027'}. Tap to open invitation.
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-stone-800 px-1 pt-1 leading-relaxed">
                      Dearest friends & family! We would love for you to celebrate our special day with us. Here is our personal wedding invitation & event schedule:
                      <br/>
                      <span className="text-emerald-700 font-semibold underline block mt-1">
                        https://wishlys-free.com/invite/{data.hosts?.bride?.toLowerCase().replace(/\s+/g, '-')}-and-${data.hosts?.groom?.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                    </p>

                    <div className="flex items-center justify-end gap-1 text-[9px] text-stone-500 pt-0.5">
                      <span>10:30 AM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl border border-stone-300/60 shadow-xs flex justify-between items-center text-xs">
                    <span className="text-[10px] text-stone-600 font-medium">WhatsApp Unfurl Preview</span>
                    <button
                      type="button"
                      onClick={copyShareText}
                      className="px-2.5 py-1 rounded-lg bg-[#075E54] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#128C7E] transition-colors cursor-pointer"
                    >
                      {copiedLink ? 'Copied Link' : 'Copy Message'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GALLERY PICKER MODAL (When clicking 👁 GALLERY on any photo) */}
      {galleryPickerField && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn"
          onClick={() => setGalleryPickerField(null)}
        >
          <div 
            className="relative w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 max-h-[88vh] flex flex-col space-y-4 animate-scaleUp"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B6F47] block">
                  Select Photo for {typeof galleryPickerField === 'object' ? (galleryPickerField.eventName || 'Event') : String(galleryPickerField).toUpperCase()}
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#2B1E17]">
                  Wedding Photo Gallery
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGalleryPickerField(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Photo Grid with Categories */}
            <div className="overflow-y-auto space-y-5 pr-1 flex-1">
              {/* Category 1: Caricatures */}
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-stone-500 block mb-2.5">
                  🎨 Theme Caricature Artworks
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {[
                    { title: 'Scooter Couple', url: './images/caricature/scooter_couple.webp' },
                    { title: 'Haldi Ceremony', url: './images/caricature/haldi.webp' },
                    { title: 'Mehendi Celebration', url: './images/caricature/mehendi.webp' },
                    { title: 'Sangeet Night', url: './images/caricature/sangeet.webp' },
                    { title: 'Pheras Mandap', url: './images/caricature/pheras.webp' },
                    { title: 'Reception Gala', url: './images/caricature/reception.webp' },
                  ].map((pic, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        handlePickAsset(pic.url);
                      }}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-stone-200 bg-stone-50 hover:border-[#8B6F47] hover:ring-2 hover:ring-[#8B6F47]/30 transition-all cursor-pointer shadow-xs"
                    >
                      <img src={pic.url} alt={pic.title} className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[9px] text-white text-center font-medium truncate">
                        {pic.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category 2: Classic Couple Photography */}
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-stone-500 block mb-2.5">
                  📸 Couple Portraits & Moments
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {[
                    { title: 'The Bride', url: './images/bride.webp' },
                    { title: 'The Groom', url: './images/groom.webp' },
                    { title: 'Portrait One', url: './images/couple-potrait.webp' },
                    { title: 'Portrait Two', url: './images/couple-potrait-1.webp' },
                    { title: 'Landscape Sun', url: './images/couple-landscape-1.webp' },
                    { title: 'Landscape Palace', url: './images/couple-landscape-2.webp' },
                    { title: 'Palace Stroll', url: './images/couple-landscape-3.webp' },
                    { title: 'Udaipur Boat', url: './images/couple-udaipur-boat.webp' },
                    { title: 'Lake Rooftop', url: './images/couple-udaipur-rooftop.webp' },
                  ].map((pic, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        handlePickAsset(pic.url);
                      }}
                      className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-stone-200 bg-stone-50 hover:border-[#8B6F47] hover:ring-2 hover:ring-[#8B6F47]/30 transition-all cursor-pointer shadow-xs"
                    >
                      <img src={pic.url} alt={pic.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[9px] text-white text-center font-medium truncate">
                        {pic.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category 3: Moments & Memories / Album uploads */}
              {data.gallery && data.gallery.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-stone-500 block mb-2.5">
                    🌟 From Your Album & Uploads
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {data.gallery.map((pic, i) => (
                      <button
                        key={pic.id || i}
                        type="button"
                        onClick={() => {
                          handlePickAsset(pic.url || pic.img);
                        }}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-50 hover:border-[#8B6F47] hover:ring-2 hover:ring-[#8B6F47]/30 transition-all cursor-pointer shadow-xs"
                      >
                        <img src={pic.url || pic.img} alt={pic.caption || 'Memory'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[9px] text-white text-center font-medium truncate">
                          {pic.caption || `Moment ${i + 1}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-xs">
              <span className="text-stone-400">Click any image above to select.</span>
              <button
                type="button"
                onClick={() => setGalleryPickerField(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO ADJUST & CROP MODAL */}
      {cropModalConfig && (
        <PhotoAdjustCropModal
          isOpen={cropModalConfig.isOpen}
          imageSrc={cropModalConfig.imageSrc}
          title={cropModalConfig.title}
          defaultAspect={cropModalConfig.defaultAspect}
          onApply={handleApplyCrop}
          onCancel={() => setCropModalConfig(null)}
        />
      )}

      {/* QUICK CLIENT & COUPLE DETAILS MODAL */}
      {isEditCoupleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF5ED] border border-[#E6D5BF] flex items-center justify-center text-[#8B6F47]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-normal text-[#2B1E17]">Client & Couple Information</h3>
                  <p className="text-xs text-stone-500 font-light">Set the client name for this wedding invitation</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsEditCoupleModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-600 mb-1">
                    Bride's Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Riya"
                    value={clientForm.bride}
                    onChange={e => setClientForm(prev => ({ ...prev, bride: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B6F47] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-600 mb-1">
                    Groom's Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Karan"
                    value={clientForm.groom}
                    onChange={e => setClientForm(prev => ({ ...prev, groom: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B6F47] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-600 mb-1">
                    Wedding Date
                  </label>
                  <input
                    type="date"
                    value={clientForm.date}
                    onChange={e => setClientForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B6F47] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-600 mb-1">
                    City / Destination
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Udaipur"
                    value={clientForm.city}
                    onChange={e => setClientForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B6F47] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const b = clientForm.bride.trim() || 'Bride';
                  const g = clientForm.groom.trim() || 'Groom';
                  const bI = b[0].toUpperCase();
                  const gI = g[0].toUpperCase();
                  setData(prev => ({
                    ...prev,
                    hosts: {
                      ...prev.hosts,
                      bride: b,
                      groom: g,
                      date: clientForm.date,
                      city: clientForm.city,
                      hashtag: `#${b}Weds${g}`,
                    },
                    monogram: {
                      ...prev.monogram,
                      initials: `${bI} & ${gI}`,
                    }
                  }));
                  setIsEditCoupleModalOpen(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B6F47] to-[#A9825F] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-95 cursor-pointer text-center"
              >
                Save Client Names
              </button>

              <button
                type="button"
                onClick={() => {
                  const b = clientForm.bride.trim() || 'Bride';
                  const g = clientForm.groom.trim() || 'Groom';
                  const bI = b[0].toUpperCase();
                  const gI = g[0].toUpperCase();
                  setData({
                    ...DEFAULT_INVITATION_DATA,
                    hosts: {
                      ...DEFAULT_INVITATION_DATA.hosts,
                      bride: b,
                      groom: g,
                      date: clientForm.date,
                      city: clientForm.city,
                      hashtag: `#${b}Weds${g}`,
                    },
                    monogram: {
                      ...DEFAULT_INVITATION_DATA.monogram,
                      initials: `${bI} & ${gI}`,
                    }
                  });
                  setIsEditCoupleModalOpen(false);
                }}
                className="py-3 px-4 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-bold uppercase tracking-wider hover:bg-stone-50 cursor-pointer text-center"
              >
                Start Clean Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
