import React, { useState, useEffect } from 'react';
import { 
  Palette, BookOpen, Sparkles, Globe, Download, Printer, Video, 
  Smartphone, Tablet, Monitor, Plus, Trash2, Check, ArrowRight, ArrowLeft,
  Volume2, VolumeX, Shield, CircleDot, Bell, MessageSquare, ChevronDown, ChevronUp,
  Image, Mail, Stamp, PartyPopper, Music as MusicIcon, Compass, MapPin, Upload, Camera,
  RotateCcw, Share2, Copy, CheckCheck, Phone, Video as VideoIcon, MoreVertical,
  Calendar, Clock, Eye, Lock, Users, Play, PhoneCall, Feather, CreditCard, Package,
  Train, Link, Flower2, Flower, Scroll, Bird, Lamp, Key, DoorClosed, Building2,
  Film, Heart, DoorOpen, Truck, Flame, Star
} from 'lucide-react';
import { OCCASIONS, TEMPLATES, REVEAL_STYLES, PALETTES, MUSIC_TRACKS, CELEBRATION_EFFECTS } from '../../data/presets';
import InvitationExperience from '../invitation/InvitationExperience';
import { soundManager } from '../../utils/audio';
import { triggerCelebration } from '../../utils/confetti';
import { toBase64Optimized } from '../../utils/imageOptimizer';

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

  const updateHosts = (field, val) => {
    setData(prev => ({
      ...prev,
      hosts: { ...prev.hosts, [field]: val },
    }));
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
          cover: './images/caricature/scooter_couple.webp',
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
      updatePhotos('cover', './images/caricature/scooter_couple.webp');
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
    const base64Url = await compressImageFile(file, 900, 0.8);
    updatePhotos(targetField, base64Url);
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
    const dataUrl = await compressImageFile(file, 900, 0.8);
    setData(prev => {
      const g = [...(prev.gallery || [])];
      if (g[index]) {
        g[index] = { ...g[index], url: dataUrl };
      }
      return { ...prev, gallery: g };
    });
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
    if (typeof galleryPickerField === 'object' && galleryPickerField.type === 'galleryItem') {
      setData(prev => {
        const g = [...(prev.gallery || [])];
        if (g[galleryPickerField.index]) {
          g[galleryPickerField.index] = { ...g[galleryPickerField.index], url };
        }
        return { ...prev, gallery: g };
      });
    } else {
      updatePhotos(galleryPickerField, url);
    }
    setGalleryPickerField(null);
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
  const handleExportHtml = async () => {
    setIsExportingHtml(true);
    const slug = `${data.hosts?.bride || 'preeti'}-and-${data.hosts?.groom || 'ashish'}`.toLowerCase().replace(/\s+/g, '-');
    const selectedTmpl = TEMPLATES.find(t => t.id === data.template) || TEMPLATES[0];

    // Convert local images to base64 DataURIs (compact & optimized so standalone HTML stays < 4MB for iPhone & Android)
    const [
      b64Cover, b64Bride, b64Groom, b64Tmpl,
      b64Scooter, b64Haldi, b64Mehndi, b64Sangeet, b64Pheras, b64Reception,
    ] = await Promise.all([
      toBase64Optimized(data.photos?.cover, 1000, 0.75, false),
      toBase64Optimized(data.photos?.bride || './images/bride.webp', 600, 0.76, false),
      toBase64Optimized(data.photos?.groom || './images/groom.webp', 600, 0.76, false),
      toBase64Optimized(selectedTmpl?.image, 1000, 0.75, false),
      toBase64Optimized('./images/caricature/scooter_couple.webp', 800, 0.78, true),
      toBase64Optimized('./images/caricature/haldi_arch.webp', 600, 0.75, true),
      toBase64Optimized('./images/caricature/mehndi_arch.webp', 600, 0.75, true),
      toBase64Optimized('./images/caricature/sangeet_arch.webp', 600, 0.75, true),
      toBase64Optimized('./images/caricature/pheras_arch.webp', 600, 0.75, true),
      toBase64Optimized('./images/caricature/reception_arch.webp', 600, 0.75, true),
    ]);

    const galleryItems = (data.gallery && data.gallery.length > 0) ? data.gallery : [
      { url: './images/couple-potrait.webp', caption: 'Engagement' },
      { url: './images/couple-landscape-1.webp', caption: 'Haldi Joy' },
      { url: './images/couple-landscape-2.webp', caption: 'Udaipur Sunset' },
      { url: './images/couple-potrait-1.webp', caption: 'Forever Begins' },
      { url: './images/couple-landscape-3.webp', caption: 'Palace Stroll' },
      { url: './images/couple-landscape-4.webp', caption: 'Starlit Promises' },
      { url: './images/couple-udaipur-boat.webp', caption: 'Lake Boat Ride' },
      { url: './images/couple-udaipur-rooftop.webp', caption: 'Palace Rooftop' },
      { url: './images/couple-udaipur-bazaar.webp', caption: 'Old City Charm' },
      { url: './images/couple-udaipur-hilltop.webp', caption: 'Monsoon Palace' },
      { url: './images/couple-udaipur-haveli.webp', caption: 'Haveli Courtyard' },
      { url: './images/couple-udaipur-ghat.webp', caption: 'Waterfront Sunset' },
    ];
    const b64Gallery = await Promise.all(galleryItems.map(async (item) => ({
      b64: await toBase64Optimized(item.url || item.img, 720, 0.72, false),
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
    const d = new Date(data.hosts?.date || '2027-02-14');
    const validDate = !isNaN(d.getTime());
    const calMonthName = validDate ? d.toLocaleString('en-US', { month: 'long' }) : 'February';
    const calYear = validDate ? d.getFullYear() : 2027;
    const calDayNum = validDate ? d.getDate() : 14;
    const daysInMonth = validDate ? new Date(calYear, d.getMonth() + 1, 0).getDate() : 28;
    const firstDayIndex = validDate ? new Date(calYear, d.getMonth(), 1).getDay() : 0;

    const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <title>${data.hosts?.bride} & ${data.hosts?.groom} — Wedding Invitation</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: ${isPichwai ? '#071A1E' : isZardozi ? '#FAF7F0' : isNewspaper ? '#F6F1E5' : isCaricature ? '#FAF7F2' : '#FDFBF7'}; color: ${isPichwai ? '#F4ECDE' : '#2B1E17'}; }
    .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
    .font-royal { font-family: 'Cinzel', serif; }
    .font-script { font-family: 'Great Vibes', cursive; }

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

  <!-- REVEAL SCREEN: 3D FOLDING CARD DOORS FOR CARICATURE OR SCRATCH THE DATE -->
  ${(data.revealStyle === 'folding-doors' || (isCaricature && (!data.revealStyle || data.revealStyle === 'folding-doors'))) ? `
  <div id="reveal-screen" onclick="unlockCaricatureDoors()" class="fixed inset-0 z-40 bg-[#FAF7F2] flex flex-col items-center justify-center p-4 transition-opacity duration-700 select-none cursor-pointer">
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
        <span>${data.hosts?.groom}</span>
        <span class="text-rose-400 font-sans text-xl animate-pulse">♡</span>
        <span>${data.hosts?.bride}</span>
      </h2>
      <div class="w-24 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full"></div>
    </div>

    <!-- 3D Folding Card Container - Full 9:16 Aspect Ratio -->
    <div id="door-card-container" onclick="unlockCaricatureDoors()" class="relative w-[85vw] max-w-[310px] aspect-[9/16] max-h-[72vh] cursor-pointer group" style="perspective: 1000px;">
      <!-- Inside Couple Artwork -->
      <div class="absolute inset-0 rounded-2xl bg-[#FFFDF7] border-2 border-[#FDE68A] shadow-inner overflow-hidden flex flex-col items-center justify-center p-0">
        <img src="${b64Cover || b64Scooter || selectedTmpl?.image}" alt="${data.hosts?.groom} & ${data.hosts?.bride}" class="w-full h-full object-contain object-center" />
      </div>

      <!-- Left Folding Door -->
      <div id="door-left" class="absolute inset-y-0 left-0 w-1/2 bg-[#FCE7F3] border-y-2 border-l-2 border-[#F472B6] rounded-l-2xl shadow-md transition-all duration-700 origin-left overflow-hidden group-hover:-rotate-y-6" style="transform-style: preserve-3d;">
        <div class="w-full h-full p-2 relative flex flex-col justify-between">
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
      <div id="door-right" class="absolute inset-y-0 right-0 w-1/2 bg-[#FCE7F3] border-y-2 border-r-2 border-[#F472B6] rounded-r-2xl shadow-md transition-all duration-700 origin-right overflow-hidden group-hover:rotate-y-6" style="transform-style: preserve-3d;">
        <div class="w-full h-full p-2 relative flex flex-col justify-between items-end">
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
      <div id="door-heart-seal" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#FEF08A] border-2 border-[#F59E0B] shadow-lg flex items-center justify-center transition-all duration-500 group-hover:scale-110 animate-pulse">
        <span class="text-rose-600 text-lg">❤️</span>
      </div>

      <!-- Parked Yellow Scooter at Bottom -->
      <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 select-none pointer-events-none">
        <span class="text-3xl drop-shadow-md">🛵</span>
      </div>
    </div>

    <!-- Tap to Open Footer -->
    <div class="mt-8 text-center">
      <div class="w-32 border-b-2 border-dashed border-[#F5D0C5] mx-auto mb-2"></div>
      <button onclick="unlockCaricatureDoors()" class="text-xs font-semibold text-[#8B6F47] tracking-widest uppercase animate-bounce inline-block hover:underline cursor-pointer">
        👆 Tap to Open
      </button>
    </div>
  </div>` : `
  <!-- REVEAL SCREEN: SCRATCH THE DATE TO REVEAL -->
  <div id="reveal-screen" class="fixed inset-0 z-40 bg-gradient-to-b from-[#FAF8F5]/95 via-[#F5EFE6]/95 to-[#FAF8F5]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 transition-opacity duration-700">
    <div class="text-center space-y-2 mb-6 max-w-md">
      <span class="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47] border border-[#C5A880]/50 bg-[#FAF5ED] px-3.5 py-1 rounded-full shadow-xs">
        Exclusive Invitation
      </span>
      <h2 class="font-serif text-3xl sm:text-4xl font-light text-[#2B1E17]">
        ${data.hosts?.bride} & ${data.hosts?.groom}
      </h2>
      <p class="text-xs text-stone-500">Scratch the gold card below to reveal our celebration date 💫</p>
    </div>

    <!-- Scratch Canvas Container -->
    <div class="relative w-80 h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#C5A880] bg-white select-none">
      <!-- Underlying Date Card -->
      <div class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#FAF5ED] to-white">
        <div class="w-10 h-10 rounded-full border border-[#C5A880] flex items-center justify-center font-royal text-sm font-bold text-[#8B6F47] mb-1">
          ${data.monogram?.initials || 'A & S'}
        </div>
        <span class="text-[9px] uppercase tracking-widest font-bold text-[#8B6F47]">Wedding Date</span>
        <h3 class="font-serif text-2xl font-bold text-[#2B1E17] leading-tight my-1">${data.hosts?.date || '14th February 2027'}</h3>
        <p class="text-xs text-stone-600">${data.hosts?.city || 'Udaipur, Rajasthan'}</p>
        <p class="font-script text-xl text-[#8B6F47] mt-1">${data.hosts?.bride} & ${data.hosts?.groom}</p>
      </div>

      <!-- Scratch Overlay Canvas -->
      <canvas id="scratch-canvas" width="320" height="224" class="absolute inset-0 cursor-pointer touch-none"></canvas>
    </div>

    <div class="mt-4 text-center">
      <p id="scratch-hint" class="text-xs text-stone-500 font-medium">Scrub across the foil to reveal (0% cleared)</p>
      <button id="skip-reveal-btn" class="mt-4 text-[11px] tracking-widest uppercase font-semibold text-[#8B6F47] hover:underline cursor-pointer">
        Skip reveal & view invitation →
      </button>
    </div>
  </div>`}

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
        <div class="relative w-full bg-[#FFFDF9] rounded-t-[60px] rounded-b-3xl p-3 border-[3px] border-[#FDE68A] shadow-xl overflow-hidden text-center">
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
          <h1 class="font-serif text-3xl sm:text-4xl text-[#2B1E17] font-light flex items-center justify-center gap-1.5 mt-0.5 mb-1">
            <span>${data.hosts?.groom}</span>
            <span class="text-rose-400 font-sans text-lg animate-pulse">♡</span>
            <span>${data.hosts?.bride}</span>
          </h1>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mb-2"></div>

          <!-- Scooter Couple Illustration Artwork Filled in Card - Full 9:16 Aspect Ratio -->
          <div class="w-full aspect-[9/16] rounded-2xl overflow-hidden relative flex items-center justify-center group bg-[#FFFDF7] shadow-inner">
            <img src="${b64Scooter || b64Cover || selectedTmpl?.image}" alt="${data.hosts?.groom} & ${data.hosts?.bride}" class="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700" />
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
      <!-- THEMATIC HERO: BIOSCOPE BOOTH FOR MARIGOLD MELA (vframe_130.jpg) -->
      ${isMela ? `
      <div class="relative z-10 w-full flex flex-col items-center mb-6">
        <span class="text-[11px] tracking-[0.35em] uppercase font-bold text-[#EA580C] mb-2">YOU ARE CORDIALLY INVITED</span>
        <div class="relative w-64 sm:w-72">
          <div class="w-full flex justify-center -mb-1 z-20 relative">
            <div class="w-48 h-8 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-t-xl shadow flex justify-around items-end overflow-hidden border-t-2 border-amber-300">
              <div class="w-6 h-5 rounded-b-full bg-amber-300"></div>
              <div class="w-6 h-5 rounded-b-full bg-red-700"></div>
              <div class="w-6 h-5 rounded-b-full bg-amber-300"></div>
              <div class="w-6 h-5 rounded-b-full bg-red-700"></div>
            </div>
          </div>
          <div class="w-full bg-gradient-to-b from-[#8B1E1E] to-[#681212] rounded-2xl p-4 border-4 border-[#D4AF37] shadow-2xl relative z-10 text-center">
            <div class="w-36 h-36 mx-auto rounded-full p-1.5 bg-gradient-to-br from-[#D4AF37] via-[#FFF8DC] to-[#AA771C] shadow-inner relative">
              <div class="w-full h-full rounded-full overflow-hidden bg-black/60 relative border border-amber-700">
                <img src="${b64Cover || b64Tmpl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="mt-3 bg-[#FFFDF7] border border-[#D4AF37] py-1 px-3 rounded-full inline-block shadow-sm">
              <span class="font-royal text-[10px] uppercase font-bold tracking-widest text-[#8B1E1E]">★ BIOSCOPE SHAADI CINEMA ★</span>
            </div>
          </div>
          <div class="w-full flex justify-between px-6 -mt-2 z-0 relative">
            <div class="w-2.5 h-16 bg-[#5C3A21] rounded-b -rotate-12 shadow"></div>
            <div class="w-2.5 h-16 bg-[#4A2D17] rounded-b shadow"></div>
            <div class="w-2.5 h-16 bg-[#5C3A21] rounded-b rotate-12 shadow"></div>
          </div>
        </div>
      </div>` : ''}

      <div class="relative z-10 max-w-3xl mx-auto space-y-5">
        <div class="w-16 h-16 mx-auto rounded-full border-2 border-[#C5A880] flex items-center justify-center font-royal text-lg font-bold text-[#8B6F47] bg-white/90 shadow-md">
          ${data.monogram?.initials || 'P & A'}
        </div>

        <p class="text-[11px] tracking-[0.3em] uppercase font-semibold text-[#8B6F47]">
          ${data.hosts?.title || 'Together with their families'}
        </p>

        <h1 class="font-serif text-5xl sm:text-6xl md:text-7xl font-light tracking-tight leading-none text-[#2B1E17]">
          ${data.hosts?.bride} <br />
          <span class="font-script text-4xl sm:text-5xl md:text-6xl text-[#8B6F47] lowercase">and</span> <br />
          ${data.hosts?.groom}
        </h1>

        <div class="flex items-center justify-center gap-3 text-[#C5A880]">
          <span class="h-px w-16 bg-gradient-to-r from-transparent to-[#C5A880]"></span>
          <span class="rotate-45 inline-block w-1.5 h-1.5 border border-[#C5A880]"></span>
          <span class="h-px w-16 bg-gradient-to-l from-transparent to-[#C5A880]"></span>
        </div>

        <p class="font-royal text-sm sm:text-base tracking-[0.2em] uppercase font-medium text-[#2B1E17]/80">
          ${data.hosts?.city || 'Udaipur, Rajasthan'} · ${data.hosts?.date || '14th February 2027'}
        </p>

        <p class="text-stone-600 text-sm sm:text-base font-light italic max-w-lg mx-auto leading-relaxed">
          "${data.hosts?.welcomeQuote || 'Please join us in celebrating our wedding.'}"
        </p>
      </div>

      <!-- Live Countdown Bar -->
      <div class="relative z-10 mt-10 w-full max-w-xl mx-auto bg-white/85 backdrop-blur-md rounded-2xl border border-[#E6D5BF] p-5 shadow-sm">
        <p class="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8B6F47] mb-3">
          Counting Down To The Celebration
        </p>
        <div class="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          <div class="bg-[#FAF5ED]/80 p-2.5 rounded-xl border border-[#E6D5BF]/60">
            <span id="days" class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">00</span>
            <p class="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mt-0.5">Days</p>
          </div>
          <div class="bg-[#FAF5ED]/80 p-2.5 rounded-xl border border-[#E6D5BF]/60">
            <span id="hours" class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">00</span>
            <p class="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mt-0.5">Hours</p>
          </div>
          <div class="bg-[#FAF5ED]/80 p-2.5 rounded-xl border border-[#E6D5BF]/60">
            <span id="mins" class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">00</span>
            <p class="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mt-0.5">Mins</p>
          </div>
          <div class="bg-[#FAF5ED]/80 p-2.5 rounded-xl border border-[#E6D5BF]/60">
            <span id="secs" class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">00</span>
            <p class="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mt-0.5">Secs</p>
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
          <h3 class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">${data.hosts?.groom || 'Ashish'} & ${data.hosts?.bride || 'Preeti'}</h3>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1"></div>
        </div>

        <div class="grid grid-cols-2 gap-2 relative items-stretch">
          <!-- Left Card: Groom (Clickable Modal) -->
          <div onclick="openPersonModal('groom')" class="relative bg-white p-2.5 pb-4 rounded-2xl shadow-md border border-stone-200 transform -rotate-2 hover:rotate-0 hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col items-center text-center scroll-reveal reveal-tilt-left cursor-pointer group">
            <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#A7F3D0]/85 rounded shadow-xs rotate-1 border border-[#6EE7B7]"></div>
            <div class="w-20 h-20 rounded-full overflow-hidden bg-stone-100 mt-1 mb-2 border-2 border-stone-200 ring-4 ring-[#E6F4EA] shadow-inner shrink-0 group-hover:ring-emerald-300 transition-all">
              <img src="${b64Groom || './images/groom.webp'}" alt="${data.hosts?.groom || 'Ashish'}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span class="inline-block px-2 py-0.5 rounded-full text-[8.5px] uppercase tracking-wider font-bold bg-[#E6F4EA] text-[#137333] mb-1">The Groom</span>
            <h4 class="font-serif text-sm sm:text-base font-bold text-[#2B1E17] leading-tight group-hover:text-amber-800 transition-colors">${data.hosts?.groom || 'Ashish'}</h4>
            <p class="text-[10px] text-stone-600 italic mt-1 leading-snug px-0.5 flex-1">"${data.photos?.groomBio || 'Foodie, photography enthusiast, and the architect of their happiest memories.'}"</p>
            <p class="text-[8.5px] text-stone-400 mt-1.5 font-sans border-t border-stone-100 pt-1 w-full">${data.hosts?.groomParents || 'S/o Mr. Ramesh & Mrs. Sunita Sharma'}</p>
            <span class="text-[8.5px] text-amber-700 font-semibold mt-1 flex items-center gap-0.5 opacity-80 group-hover:opacity-100">🔍 Tap to view</span>
          </div>

          <!-- Connected Pink Heart -->
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-rose-400 text-2xl animate-pulse drop-shadow scroll-reveal reveal-bounce" style="transition-delay: 250ms;">♡</div>

          <!-- Right Card: Bride (Clickable Modal) -->
          <div onclick="openPersonModal('bride')" class="relative bg-white p-2.5 pb-4 rounded-2xl shadow-md border border-stone-200 transform rotate-2 hover:rotate-0 hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col items-center text-center scroll-reveal reveal-tilt-right cursor-pointer group" style="transition-delay: 150ms;">
            <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#FDE68A]/85 rounded shadow-xs -rotate-1 border border-[#FCD34D]"></div>
            <div class="w-20 h-20 rounded-full overflow-hidden bg-stone-100 mt-1 mb-2 border-2 border-stone-200 ring-4 ring-[#FCE8E6] shadow-inner shrink-0 group-hover:ring-rose-300 transition-all">
              <img src="${b64Bride || './images/bride.webp'}" alt="${data.hosts?.bride || 'Preeti'}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span class="inline-block px-2 py-0.5 rounded-full text-[8.5px] uppercase tracking-wider font-bold bg-[#FCE8E6] text-[#C5221F] mb-1">The Bride</span>
            <h4 class="font-serif text-sm sm:text-base font-bold text-[#2B1E17] leading-tight group-hover:text-rose-800 transition-colors">${data.hosts?.bride || 'Preeti'}</h4>
            <p class="text-[10px] text-stone-600 italic mt-1 leading-snug px-0.5 flex-1">"${data.photos?.brideBio || 'Loves classic poetry, morning chai, and spontaneous mountain hikes.'}"</p>
            <p class="text-[8.5px] text-stone-400 mt-1.5 font-sans border-t border-stone-100 pt-1 w-full">${data.hosts?.brideParents || 'D/o Mr. Vijay & Mrs. Rekha Malhotra'}</p>
            <span class="text-[8.5px] text-rose-700 font-semibold mt-1 flex items-center gap-0.5 opacity-80 group-hover:opacity-100">🔍 Tap to view</span>
          </div>
        </div>
      </section>

      <!-- 2. HANGING WALL CALENDAR & LIVE COUNTDOWN (frame 025 - 027) -->
      <section class="py-6 px-2 w-full max-w-[390px] mx-auto select-none">
        <div class="text-center space-y-1 mb-5 scroll-reveal">
          <span class="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold">Mark your calendar</span>
          <h3 class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">${calMonthName} ${calYear}</h3>
          <div class="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1"></div>
        </div>

        <div class="relative bg-white rounded-2xl p-4 sm:p-5 border-2 border-stone-200 shadow-md scroll-reveal reveal-calendar">
          <div class="absolute -top-3 left-1/3 -translate-x-1/2 w-3.5 h-6 rounded-full border-2 border-stone-400 bg-stone-100 shadow-inner"></div>
          <div class="absolute -top-3 right-1/3 translate-x-1/2 w-3.5 h-6 rounded-full border-2 border-stone-400 bg-stone-100 shadow-inner"></div>

          <div class="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#DB2777] pb-2 border-b border-stone-100 mb-2">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>

          <div class="grid grid-cols-7 gap-1 text-center text-xs text-stone-700">
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
          const isWedding = nameLower.includes('wedding') || nameLower.includes('phera');
          const isReception = nameLower.includes('reception') || nameLower.includes('party');

          const archB64 = isHaldi ? (b64Haldi || b64Scooter)
            : isMehndi ? (b64Mehndi || b64Scooter)
            : isSangeet ? (b64Sangeet || b64Scooter)
            : isWedding ? (b64Pheras || b64Scooter)
            : isReception ? (b64Reception || b64Scooter)
            : (b64Scooter);

          return `
          <div class="relative w-full select-none space-y-3">
            <div class="w-full flex justify-center -mb-2 scroll-reveal reveal-pop-up">
              <div class="w-full max-w-[350px] aspect-[9/16] rounded-t-[44px] rounded-b-2xl overflow-hidden flex items-center justify-center p-0 drop-shadow-md bg-[#FFFDF7] border-2 border-amber-100">
                <img src="${archB64}" alt="${evt.name}" class="w-full h-full object-contain object-center" />
              </div>
            </div>

            <div class="text-center scroll-reveal" style="transition-delay: 80ms;">
              <h3 class="font-serif text-2xl font-bold text-[#2B1E17]">${evt.name}</h3>
            </div>

            <div class="relative bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border-2 border-stone-200 shadow-md space-y-2.5 scroll-reveal" style="transition-delay: 160ms;">
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
            <div class="relative bg-white p-2 pb-3.5 rounded-lg shadow-md border border-stone-200 transform ${tiltClass} hover:rotate-0 transition-transform duration-300 scroll-reveal cursor-pointer" style="transition-delay: ${delay}ms;" onclick="openMomentLightbox('${item.b64 || './images/couple-potrait.webp'}', '${item.caption}')">
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

        <div class="bg-[#FFFDF9] rounded-2xl p-4 border-2 border-stone-200 shadow-md space-y-3 scroll-reveal reveal-pop-up" style="transition-delay: 120ms;">
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
        <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#2B1E17]">${data.hosts?.hashtag || '#PreetiWedsAshish'}</h3>
        <p class="text-xs text-stone-600 font-light">Tag your photos and stories so we can relive every moment.</p>
        <div class="pt-1.5">
          <button id="hashtag-btn" onclick="copyHashtag('${data.hosts?.hashtag || '#PreetiWedsAshish'}')" class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-95">
            <span>📋 Copy Hashtag</span>
          </button>
        </div>
      </section>

      <!-- 8. PASTEL FOOTER (frame 080) -->
      <footer class="py-10 px-2 w-full max-w-[390px] mx-auto text-center space-y-3.5 border-t-2 border-dashed border-[#F5D0C5] select-none scroll-reveal">
        <h3 class="font-serif text-2xl sm:text-3xl font-light text-[#2B1E17]">See you at the shaadi!</h3>
        <p class="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47]">WITH LOVE, ${data.hosts?.groom || 'ASHISH'} & ${data.hosts?.bride || 'PREETI'}</p>
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
        <p class="text-[9px] uppercase tracking-widest text-stone-400 pt-1">Powered by Wishlys Free</p>
      </footer>
    </div>` : `
    <!-- CIRCULAR COUPLE PORTRAITS -->
    <section class="py-16 px-4 max-w-4xl mx-auto">
      <div class="text-center space-y-2 mb-10">
        <span class="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47]">The Couple</span>
        <h2 class="font-serif text-3xl sm:text-4xl font-light text-[#2B1E17]">Meet Bride & Groom</h2>
        <div class="h-0.5 w-12 bg-[#C5A880] mx-auto mt-2"></div>
      </div>

      <div class="grid grid-cols-2 gap-3.5 sm:gap-6 max-w-xl mx-auto">
        <!-- Groom Card -->
        <div class="bg-white/95 rounded-3xl p-4 sm:p-7 border border-[#C5A880]/60 shadow-lg text-center flex flex-col items-center">
          <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#C5A880] shadow-md mb-3.5 p-1 bg-white ring-4 ring-[#FAF5ED]">
            <img src="${b64Groom || b64Cover || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'}" class="w-full h-full object-cover rounded-full" />
          </div>
          <span class="inline-block px-3 py-0.5 rounded-full bg-[#FAF5ED] border border-[#E6D5BF] text-[9px] uppercase tracking-widest font-bold text-[#8B6F47] mb-1.5">The Groom</span>
          <h4 class="font-serif text-lg sm:text-2xl text-[#2B1E17] font-semibold">${data.hosts?.groom || 'Ashish'}</h4>
          <p class="text-[11px] sm:text-xs text-stone-600 italic mt-1.5 leading-relaxed">"${data.photos?.groomBio || 'Foodie, photography enthusiast, and the architect of their happiest memories.'}"</p>
        </div>

        <!-- Bride Card -->
        <div class="bg-white/95 rounded-3xl p-4 sm:p-7 border border-[#C5A880]/60 shadow-lg text-center flex flex-col items-center">
          <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#C5A880] shadow-md mb-3.5 p-1 bg-white ring-4 ring-[#FAF5ED]">
            <img src="${b64Bride || b64Cover || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}" class="w-full h-full object-cover rounded-full" />
          </div>
          <span class="inline-block px-3 py-0.5 rounded-full bg-[#FAF5ED] border border-[#E6D5BF] text-[9px] uppercase tracking-widest font-bold text-[#8B6F47] mb-1.5">The Bride</span>
          <h4 class="font-serif text-lg sm:text-2xl text-[#2B1E17] font-semibold">${data.hosts?.bride || 'Preeti'}</h4>
          <p class="text-[11px] sm:text-xs text-stone-600 italic mt-1.5 leading-relaxed">"${data.photos?.brideBio || 'Loves classic poetry, morning chai, and spontaneous mountain hikes.'}"</p>
        </div>
      </div>
    </section>

    <!-- RAJASTHANI JHAROKHA PHOTO GALLERY (vframe_210.jpg) -->
    <section class="py-12 px-4 max-w-4xl mx-auto">
      <div class="text-center space-y-2 mb-8">
        <span class="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A880]">Our Journey</span>
        <h3 class="font-serif text-3xl font-light text-[#2B1E17]">Moments & Memories</h3>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        ${[
          { title: 'Sangeet Night', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80' },
          { title: 'Mehndi Joy', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80' },
          { title: 'The Proposal', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80' },
          { title: 'Golden Hour', img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80' },
        ].map((item, idx) => `
          <div class="rounded-t-[50px] rounded-b-xl border-2 border-[#C5A880] overflow-hidden bg-white shadow-md p-1">
            <div class="w-full h-44 rounded-t-[46px] rounded-b-lg overflow-hidden">
              <img src="${item.img}" class="w-full h-full object-cover" />
            </div>
            <div class="text-center py-1">
              <span class="text-[9px] uppercase font-royal font-bold text-[#8B6F47]">✦ ${item.title} ✦</span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- ITINERARY & THEMATIC OBJECTS WITH MAPS -->
    <section class="py-16 px-4 bg-[#FAF5ED]/50 border-y border-[#E6D5BF]/60">
      <div class="max-w-3xl mx-auto space-y-10">
        <div class="text-center space-y-2 mb-10">
          <span class="text-[10px] tracking-[0.3em] uppercase font-bold text-[#8B6F47]">The Itinerary</span>
          <h2 class="font-serif text-3xl sm:text-4xl font-light text-[#2B1E17]">Celebration Events</h2>
        </div>

        ${(data.events || []).map((evt, idx) => {
          const isHaldi = evt.name?.toLowerCase().includes('haldi') || evt.name?.toLowerCase().includes('mehndi');
          const isWedding = evt.name?.toLowerCase().includes('wedding') || evt.name?.toLowerCase().includes('phera');
          return `
          <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6D5BF] shadow-md space-y-5">
            <div class="flex justify-between items-start gap-2">
              <div>
                <span class="text-[9px] uppercase font-bold text-[#8B6F47] block mb-1">CHAPTER ${idx + 1}</span>
                <h3 class="font-serif text-2xl font-light text-[#2B1E17]">${evt.name}</h3>
                <p class="text-xs text-stone-600 font-semibold mt-0.5">${evt.date} · ${evt.time}</p>
              </div>
              ${evt.dressCode ? `<span class="text-[9px] uppercase font-bold text-[#8B6F47] bg-[#FAF5ED] border border-[#E6D5BF] px-2.5 py-1 rounded-full">${evt.dressCode}</span>` : ''}
            </div>

            ${isHaldi ? `
            <!-- Urli Ceremony Illustration (vframe_280.jpg) -->
            <div class="text-center my-4">
              <div class="w-48 h-16 mx-auto rounded-full bg-gradient-to-b from-[#E6B800] via-[#AA7A1E] to-[#6A4706] p-1.5 flex items-center justify-center border-2 border-[#FFE885] shadow-lg">
                <div class="w-full h-full rounded-full bg-[#2B7A78] flex items-center justify-around px-3 text-sm">
                  <span>🌼</span><span>🏵️</span><span class="text-xs">🪔</span><span>🏵️</span><span>🌼</span>
                </div>
              </div>
              <p class="text-[9px] uppercase tracking-widest font-bold text-[#8B6F47] mt-1">TRADITIONAL URLI BLESSINGS</p>
            </div>` : ''}

            ${isWedding ? `
            <!-- Royal Wedding Mandap Illustration (vframe_350.jpg) -->
            <div class="border border-[#D4AF37] rounded-2xl p-4 bg-gradient-to-b from-amber-50/70 to-rose-50/70 text-center my-4">
              <div class="flex justify-between items-center px-4">
                <div class="w-3 h-16 bg-[#AA771C] rounded"></div>
                <div class="space-y-1">
                  <div class="text-base">🌹 🌼 🔥 🌼 🌹</div>
                  <h4 class="font-serif text-lg font-bold text-[#881337]">Main Pheras (The Wedding)</h4>
                  <p class="text-[9px] uppercase tracking-widest text-[#8B6F47]">Under The Sacred Floral Mandap</p>
                </div>
                <div class="w-3 h-16 bg-[#AA771C] rounded"></div>
              </div>
            </div>` : ''}

            <!-- DIRECTIONAL ROAD SIGNPOST (vframe_160.jpg) -->
            <div class="flex flex-col items-center my-6">
              <div class="w-full max-w-sm flex justify-center gap-1.5 mb-2">
                <span class="w-5 h-6 bg-red-500 inline-block" style="clip-path: polygon(0 0, 100% 0, 50% 100%);"></span>
                <span class="w-5 h-6 bg-amber-500 inline-block" style="clip-path: polygon(0 0, 100% 0, 50% 100%);"></span>
                <span class="w-5 h-6 bg-emerald-500 inline-block" style="clip-path: polygon(0 0, 100% 0, 50% 100%);"></span>
                <span class="w-5 h-6 bg-blue-500 inline-block" style="clip-path: polygon(0 0, 100% 0, 50% 100%);"></span>
              </div>
              <div class="relative flex flex-col items-center w-full max-w-xs">
                <div class="absolute top-0 bottom-0 w-4 bg-[#6A462F] rounded-t z-0"></div>
                <div class="relative z-10 w-full mb-2 flex justify-end">
                  <div class="bg-[#2E7D32] text-white py-1.5 px-5 shadow text-xs font-royal font-bold uppercase tracking-wider" style="clip-path: polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%);">
                    Shaadi this way ➜
                  </div>
                </div>
                <div class="relative z-10 w-full mb-2 flex justify-start">
                  <div class="bg-[#7B1FA2] text-white py-2 px-5 shadow text-xs font-serif font-bold tracking-wide" style="clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%);">
                    ${evt.venue}
                  </div>
                </div>
                <div class="relative z-10 w-full flex justify-end">
                  <a href="https://maps.google.com/?q=${encodeURIComponent(evt.venue + ', ' + evt.address)}" target="_blank" class="bg-[#F59E0B] hover:bg-[#D97706] text-white py-1.5 px-5 shadow text-xs font-bold uppercase tracking-wider" style="clip-path: polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%);">
                    🧭 Get directions
                  </a>
                </div>
              </div>
            </div>

            <div class="rounded-2xl overflow-hidden border border-stone-200">
              <iframe width="100%" height="180" style="border:0" loading="lazy" src="https://maps.google.com/maps?q=${encodeURIComponent(evt.venue + ', ' + evt.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>
            </div>
          </div>`;
        }).join('')}
      </div>
    </section>

    <!-- RADIATING CELEBRATION FIREWORKS SPARKLERS (vframe_250.jpg) -->
    <div class="my-8 flex flex-col items-center select-none pointer-events-none">
      <div class="flex items-center justify-center gap-8">
        <div class="w-12 h-12 animate-firework">
          <svg viewBox="0 0 100 100" class="w-full h-full text-[#D4AF37]" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="50" y1="50" x2="50" y2="10" stroke-dasharray="4,4" />
            <line x1="50" y1="50" x2="90" y2="50" stroke-dasharray="4,4" />
            <line x1="50" y1="50" x2="50" y2="90" stroke-dasharray="4,4" />
            <line x1="50" y1="50" x2="10" y2="50" stroke-dasharray="4,4" />
            <line x1="50" y1="50" x2="78" y2="22" stroke-dasharray="4,4" />
            <line x1="50" y1="50" x2="78" y2="78" stroke-dasharray="4,4" />
            <line x1="50" y1="50" x2="22" y2="78" stroke-dasharray="4,4" />
            <line x1="50" y1="50" x2="22" y2="22" stroke-dasharray="4,4" />
            <circle cx="50" cy="50" r="4" fill="#D4AF37" />
          </svg>
        </div>
        <div class="w-16 h-16 animate-firework" style="animation-delay: 0.3s;">
          <svg viewBox="0 0 100 100" class="w-full h-full text-[#B8860B]" fill="none" stroke="currentColor" stroke-width="3.5">
            <line x1="50" y1="50" x2="50" y2="5" stroke-dasharray="6,3" />
            <line x1="50" y1="50" x2="95" y2="50" stroke-dasharray="6,3" />
            <line x1="50" y1="50" x2="50" y2="95" stroke-dasharray="6,3" />
            <line x1="50" y1="50" x2="5" y2="50" stroke-dasharray="6,3" />
            <line x1="50" y1="50" x2="82" y2="18" stroke-dasharray="6,3" />
            <line x1="50" y1="50" x2="82" y2="82" stroke-dasharray="6,3" />
            <line x1="50" y1="50" x2="18" y2="82" stroke-dasharray="6,3" />
            <line x1="50" y1="50" x2="18" y2="18" stroke-dasharray="6,3" />
            <circle cx="50" cy="50" r="6" fill="#F59E0B" />
          </svg>
        </div>
        <div class="w-12 h-12 animate-firework" style="animation-delay: 0.6s;">
          <svg viewBox="0 0 100 100" class="w-full h-full text-[#D4AF37]" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="50" y1="50" x2="50" y2="10" stroke-dasharray="4,4" />
            <line x1="50" y1="50" x2="90" y2="50" stroke-dasharray="4,4" />
            <line x1="50" y1="50" x2="50" y2="90" stroke-dasharray="4,4" />
            <line x1="50" y1="50" x2="10" y2="50" stroke-dasharray="4,4" />
            <circle cx="50" cy="50" r="4" fill="#D4AF37" />
          </svg>
        </div>
      </div>
      <div class="flex items-center gap-2 mt-4 text-[#C5A880]">
        <span class="w-1.5 h-1.5 rotate-45 bg-[#C5A880]"></span>
        <span class="w-2 h-2 rotate-45 bg-[#8B6F47]"></span>
        <span class="w-1.5 h-1.5 rotate-45 bg-[#C5A880]"></span>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="py-12 text-center space-y-2 border-t border-[#E6D5BF]/60 bg-white/40">
      <div class="w-10 h-10 mx-auto rounded-full border border-[#C5A880] flex items-center justify-center font-royal text-xs font-bold text-[#8B6F47]">
        ${data.monogram?.initials || 'A & S'}
      </div>
      <p class="font-serif text-2xl font-light text-[#2B1E17]">See you at the shaadi!</p>
      <p class="text-xs text-stone-500 font-light">With love, ${data.hosts?.bride} & ${data.hosts?.groom}</p>
      <p class="text-[10px] tracking-widest uppercase text-stone-400 pt-2">Powered by Wishlys Free</p>
    </footer>`}
  </main>

  <!-- GROOM & BRIDE ENLARGED PORTRAIT CARD MODAL (BLURRED BACKDROP) -->
  <div id="person-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/65 backdrop-blur-md transition-all animate-fadeIn" onclick="closePersonModal()">
    <div class="relative w-full max-w-[330px] bg-[#FFFDF9] rounded-3xl p-5 border-2 border-[#FDE68A] shadow-2xl text-center space-y-3 animate-scaleUp" onclick="event.stopPropagation()">
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

      const isMelaTheme = ${isMela};
      const isPichwaiTheme = ${isPichwai};
      const isZardoziTheme = ${isZardozi};
      const isBougainTheme = ${isBougain};

      const particles = [];
      const pCount = isPichwaiTheme ? 45 : isMelaTheme ? 40 : 35;
      for (let i = 0; i < pCount; i++) {
        particles.push({
          x: Math.random() * atmoCanvas.width,
          y: Math.random() * atmoCanvas.height,
          size: isMelaTheme ? Math.random() * 8 + 6 : isPichwaiTheme ? Math.random() * 4 + 2 : Math.random() * 5 + 3,
          speedY: isPichwaiTheme ? -(Math.random() * 0.8 + 0.3) : (Math.random() * 1.2 + 0.4),
          speedX: (Math.random() - 0.5) * 0.8,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.04,
          opacity: Math.random() * 0.6 + 0.35,
          color: isMelaTheme ? (Math.random() > 0.5 ? '#F59E0B' : '#EA580C') : isPichwaiTheme ? '#FFD700' : isZardoziTheme ? '#D4AF37' : '#F472B6',
        });
      }

      function loop() {
        actx.clearRect(0, 0, atmoCanvas.width, atmoCanvas.height);
        particles.forEach(p => {
          actx.save();
          actx.translate(p.x, p.y);
          actx.rotate(p.rotation);
          actx.globalAlpha = p.opacity;

          if (isMelaTheme) {
            actx.fillStyle = p.color;
            actx.beginPath();
            actx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
            actx.fill();
          } else if (isPichwaiTheme) {
            actx.shadowBlur = 12;
            actx.shadowColor = '#FFD700';
            actx.fillStyle = '#FFF8DC';
            actx.beginPath();
            actx.arc(0, 0, p.size, 0, Math.PI * 2);
            actx.fill();
          } else {
            actx.fillStyle = p.color;
            actx.beginPath();
            actx.arc(0, 0, p.size, 0, Math.PI * 2);
            actx.fill();
          }

          actx.restore();
          p.y += p.speedY;
          p.x += Math.sin(p.y * 0.01) * 0.5;
          p.rotation += p.rotSpeed;

          if (p.speedY > 0 && p.y > atmoCanvas.height + 20) { p.y = -20; p.x = Math.random() * atmoCanvas.width; }
          else if (p.speedY < 0 && p.y < -20) { p.y = atmoCanvas.height + 20; p.x = Math.random() * atmoCanvas.width; }
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
    let musicActive = false;
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioEq = document.getElementById('audio-eq');
    const audioText = document.getElementById('audio-btn-text');

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        if (musicActive) {
          sound.stop();
          musicActive = false;
          if (audioEq) audioEq.classList.add('hidden');
          if (audioText) audioText.innerText = '🎵 Play Music';
        } else {
          sound.play();
          musicActive = true;
          if (audioEq) audioEq.classList.remove('hidden');
          if (audioText) audioText.innerText = 'Playing';
        }
      });
    }

    // Countdown Timer Script
    const targetDate = new Date('${data.hosts?.date || '2027-02-14'}').getTime();
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

    function unlockInvitation() {
      const rev = document.getElementById('reveal-screen');
      if (rev) {
        rev.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          rev.style.display = 'none';
          const main = document.getElementById('main-invitation');
          if (main) main.classList.remove('opacity-0');
          triggerCelebrationEffect();
          if (!musicActive) {
            sound.play();
            musicActive = true;
            if (audioEq) audioEq.classList.remove('hidden');
            if (audioText) audioText.innerText = 'Playing';
          }
        }, 500);
      }
    }

    // 3D Folding Card Doors for Caricature
    window.unlockCaricatureDoors = function() {
      if (window._doorsOpened) return;
      window._doorsOpened = true;
      const leftDoor = document.getElementById('door-left');
      const rightDoor = document.getElementById('door-right');
      const heartSeal = document.getElementById('door-heart-seal');
      if (leftDoor) leftDoor.style.transform = 'rotateY(-110deg)';
      if (rightDoor) rightDoor.style.transform = 'rotateY(110deg)';
      if (heartSeal) {
        heartSeal.style.transform = 'translate(-50%, -50%) scale(1.5)';
        heartSeal.style.opacity = '0';
      }
      sound.playChime(880);
      setTimeout(() => {
        unlockInvitation();
      }, 700);
    };

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
      if (img) img.src = isGroom ? '${b64Groom || './images/groom.webp'}' : '${b64Bride || './images/bride.webp'}';
      if (roleEl) {
        roleEl.innerText = isGroom ? 'The Groom' : 'The Bride';
        roleEl.className = 'inline-block px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ' + (isGroom ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-[#FCE8E6] text-[#C5221F]');
      }
      if (nameEl) nameEl.innerText = isGroom ? '${data.hosts?.groom || 'Ashish'}' : '${data.hosts?.bride || 'Preeti'}';
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
      navigator.clipboard?.writeText(tag || '#PreetiWedsAshish');
      const btn = document.getElementById('hashtag-btn');
      if (btn) btn.innerHTML = '<span>✅ Copied to Clipboard!</span>';
      setTimeout(() => {
        if (btn) btn.innerHTML = '<span>📋 Copy Hashtag</span>';
      }, 2500);
    };

    // Tabbed Multi-step RSVP for Caricature
    window.goToRsvpStep = function(step) {
      ['1', '2', '3'].forEach(s => {
        const el = document.getElementById('rsvp-step-' + s);
        if (el) el.classList.toggle('hidden', s !== String(step));
      });
      const tEvt = document.getElementById('tab-events');
      const tDet = document.getElementById('tab-details');
      const tSng = document.getElementById('tab-song');
      if (tEvt && tDet && tSng) {
        tEvt.className = step === 1 ? 'text-[#881337] border-b-2 border-[#881337] pb-0.5' : '';
        tDet.className = step === 2 ? 'text-[#881337] border-b-2 border-[#881337] pb-0.5' : '';
        tSng.className = step === 3 ? 'text-[#881337] border-b-2 border-[#881337] pb-0.5' : '';
      }
    };

    window.toggleSelectAllEvents = function() {
      const chks = document.querySelectorAll('.caricature-evt-chk');
      const allChecked = Array.from(chks).every(c => c.checked);
      chks.forEach(c => c.checked = !allChecked);
    };

    window.submitCaricatureRsvp = function() {
      const name = document.getElementById('rsvp-input-name')?.value || 'Guest';
      ['1', '2', '3'].forEach(s => {
        const el = document.getElementById('rsvp-step-' + s);
        if (el) el.classList.add('hidden');
      });
      const step4 = document.getElementById('rsvp-step-4');
      if (step4) {
        step4.classList.remove('hidden');
        const sName = document.getElementById('rsvp-success-name');
        if (sName) sName.innerText = 'Thank you, ' + name + '! We cannot wait to celebrate with you!';
      }
      triggerCelebrationEffect();
      sound.playChime(1046.5);
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
        <p class="text-[10px] text-stone-500">Upload a selfie or photo with ${data.hosts?.bride || 'Preeti'} & ${data.hosts?.groom || 'Ashish'}.</p>
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

    const blob = new Blob([standaloneHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invitation-${slug}.html`;
    a.click();
    URL.revokeObjectURL(url);
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
  <title>${data.hosts?.groom || 'Ashish'} & ${data.hosts?.bride || 'Preeti'} — Wedding Invitation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
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
        <span>${data.hosts?.groom || 'Ashish'}</span>
        <span style="color: #F43F5E; font-size: 26pt; vertical-align: middle; margin: 0 4mm;">♡</span>
        <span>${data.hosts?.bride || 'Preeti'}</span>
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
        <h3 class="font-serif" style="font-size: 14pt; margin: 1mm 0; font-weight: 600;">${data.hosts?.groom || 'Ashish'}</h3>
        <p style="font-size: 8pt; color: #64748B; font-style: italic; line-height: 1.3;">"${data.photos?.groomBio || 'Foodie, photography enthusiast, and the architect of their happiest memories.'}"</p>
      </div>

      <div class="card-box" style="text-align: center;">
        <div style="width: 18mm; height: 18mm; border-radius: 50%; overflow: hidden; border: 1.5px solid #F43F5E; margin: 0 auto 2mm auto;">
          <img src="${b64Bride || './images/bride.webp'}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <span class="tag-pill" style="background: #FCE8E6; color: #C5221F;">The Bride</span>
        <h3 class="font-serif" style="font-size: 14pt; margin: 1mm 0; font-weight: 600;">${data.hosts?.bride || 'Preeti'}</h3>
        <p style="font-size: 8pt; color: #64748B; font-style: italic; line-height: 1.3;">"${data.photos?.brideBio || 'Loves classic poetry, morning chai, and spontaneous mountain hikes.'}"</p>
      </div>
    </div>

    <div style="margin-top: 3mm;">
      <p style="font-size: 8.5pt; color: #64748B; font-style: italic;">"${data.hosts?.welcomeQuote || 'Please join us in celebrating our wedding.'}"</p>
      <p style="font-size: 9pt; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #DB2777; margin-top: 1mm;">
        ${data.hosts?.hashtag || '#PreetiWedsAshish'}
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
    <div style="border-top: 1.5px dashed #F5D0C5; padding-top: 4mm; margin-top: 4mm;">
      <p class="font-serif" style="font-size: 14pt; font-weight: 700; color: #2B1E17;">Celebration Concierge & Hospitality</p>
      <p style="font-size: 10pt; font-weight: 700; color: #881337; margin: 1mm 0;">
        ${data.logistics?.contact || '+91 98765 43210'} · ${data.hosts?.city || 'Udaipur'}
      </p>
      <p style="font-size: 8pt; color: #94A3B8;">With love & warm regards, ${data.hosts?.groom || 'Ashish'} & ${data.hosts?.bride || 'Preeti'} Families</p>
    </div>
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
        const slug = `${data.hosts?.bride || 'preeti'}-and-${data.hosts?.groom || 'ashish'}`.toLowerCase().replace(/\s+/g, '-');
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
        ctx.fillText(data.hosts?.bride || 'Preeti', 360, 810);

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
    if (typeof window !== 'undefined') {
      const cleanPath = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
      return `${window.location.origin}${cleanPath}#live`;
    }
    return 'https://aami672.github.io/wedding-invitation/#live';
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
            <p className="text-[10px] text-[#8B6F47] tracking-wider uppercase font-semibold">
              {data.hosts?.bride} & {data.hosts?.groom}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenLivePreview && (
            <button
              type="button"
              onClick={onOpenLivePreview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF5ED] border border-[#C5A880] text-xs font-bold text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white transition-all cursor-pointer shadow-2xs"
              title="Open full-screen invitation as guests will see it"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Guest Preview</span>
            </button>
          )}

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
                              setData(prev => ({ ...prev, template: tmpl.id }));
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
                          The full-screen photos this template is built on: your cover, a moment of you two, and one behind your story.
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
                            {data.photos?.cover ? (
                              <img 
                                src={data.photos.cover} 
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

                      {/* 2. COUPLE PHOTO */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold tracking-wider uppercase text-stone-600 block">
                          COUPLE PHOTO
                        </span>
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Portrait Thumbnail */}
                          <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shadow-xs shrink-0 flex items-center justify-center">
                            {data.photos?.couple || data.photos?.bride ? (
                              <img 
                                src={data.photos?.couple || data.photos?.bride} 
                                alt="Couple Photo" 
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
                                onChange={e => handleFileUpload(e, 'couple')} 
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => setGalleryPickerField('couple')}
                              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-stone-300 hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-stone-500" />
                              <span>GALLERY</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => updatePhotos('couple', '')}
                              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-stone-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-stone-400" />
                              <span>REMOVE</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-stone-400 font-light leading-relaxed">
                          A full-width moment between the couple cards and the date reveal, with your quote drifting over it. Optional.
                        </p>
                      </div>

                      {/* 3. STORY PHOTO */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold tracking-wider uppercase text-stone-600 block">
                          STORY PHOTO
                        </span>
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Portrait Thumbnail */}
                          <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shadow-xs shrink-0 flex items-center justify-center">
                            {data.photos?.storyPhoto || data.photos?.story ? (
                              <img 
                                src={data.photos?.storyPhoto || data.photos?.story || './images/couple-landscape-1.webp'} 
                                alt="Story Photo" 
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
                                onChange={e => handleFileUpload(e, 'storyPhoto')} 
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => setGalleryPickerField('storyPhoto')}
                              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-stone-300 hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-stone-500" />
                              <span>GALLERY</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => updatePhotos('storyPhoto', '')}
                              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-stone-300 hover:border-red-400 hover:bg-red-50 hover:text-red-600 text-stone-700 font-semibold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-stone-400" />
                              <span>REMOVE</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-stone-400 font-light leading-relaxed">
                          Sits behind your love story, zooming gently as you scroll. Optional.
                        </p>
                      </div>

                      {/* 4. BRIDE & GROOM PROFILE PHOTOS */}
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
                                      <span>Change Photo</span>
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

                {/* ROW 6: CELEBRATION EFFECTS */}
                <div className="bg-white rounded-2xl border border-[#E6D5BF] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => toggleRow('effects')}
                    className="w-full p-4 sm:p-5 flex justify-between items-center text-left hover:bg-stone-50/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#A9825F] flex items-center justify-center text-white shadow-xs">
                        <PartyPopper className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif text-2xl font-light text-[#2B1E17]">Celebration effects</h4>
                        {openRow !== 'effects' && (
                          <p className="text-xs text-stone-500 font-light mt-0.5">{selectedEffect?.name || 'CONFETTI'}</p>
                        )}
                      </div>
                    </div>
                    {openRow === 'effects' ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>

                  {openRow === 'effects' && (
                    <div className="p-4 sm:p-6 border-t border-[#E6D5BF] bg-[#FAF8F5]/60 space-y-4">
                      <p className="text-xs text-stone-500 font-light -mt-1 mb-2">
                        Choose the particle animation that bursts when the invite unlocks and when guests RSVP.
                      </p>
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
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Groom's Name</label>
                    <input
                      type="text"
                      value={data.hosts?.groom || ''}
                      onChange={e => updateHosts('groom', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Wedding Date</label>
                    <input
                      type="date"
                      value={data.hosts?.date || ''}
                      onChange={e => updateHosts('date', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Main City / Destination</label>
                    <input
                      type="text"
                      value={data.hosts?.city || ''}
                      onChange={e => updateHosts('city', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Welcome Quote / Invitation Line</label>
                    <input
                      type="text"
                      value={data.hosts?.welcomeQuote || ''}
                      onChange={e => updateHosts('welcomeQuote', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
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
                          <label className="block text-[9px] uppercase font-bold text-stone-500 mb-0.5">Event Image URL (Optional Caricature)</label>
                          <input
                            type="text"
                            value={evt.image || evt.img || ''}
                            onChange={e => updateEvent(evt.id, 'image', e.target.value)}
                            placeholder="Default theme caricature artwork"
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                          />
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
                <h3 className="font-serif text-2xl font-light text-[#2B1E17]">Social & Concierge</h3>
                <p className="text-xs text-stone-500">Customize the wedding hashtag and concierge helpline contact.</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Wedding Hashtag</label>
                    <input
                      type="text"
                      value={data.hosts?.hashtag || ''}
                      onChange={e => setData(prev => ({ ...prev, hosts: { ...prev.hosts, hashtag: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-[#881337]"
                      placeholder="#PreetiWedsAshish"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Celebration Concierge Helpline</label>
                    <input
                      type="text"
                      value={data.logistics?.contact || ''}
                      onChange={e => setData(prev => ({ ...prev, logistics: { ...prev.logistics, contact: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                      placeholder="+91 98765 43210 (Event Concierge)"
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
              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-light text-[#2B1E17]">Publish & Multi-Format Export</h3>
                    <p className="text-xs text-stone-500">100% Free Creation · Download standalone interactive HTML, print PDF, or video reel.</p>
                  </div>
                </div>

                {/* Instant Share Link */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Your Free Shareable Link</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={getShareUrl()}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-stone-700 select-all"
                    />
                    <button
                      type="button"
                      onClick={copyShareText}
                      className="px-4 py-2 rounded-xl bg-[#8B6F47] hover:bg-[#2B1E17] text-white text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                    </button>
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
            className={`transition-all duration-500 overflow-y-auto rounded-[40px] shadow-2xl border-[10px] border-[#1C1917] bg-white relative ${
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
                  Select Photo for {galleryPickerField.toUpperCase()}
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
    </div>
  );
}
