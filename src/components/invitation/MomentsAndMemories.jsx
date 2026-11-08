import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, UploadCloud, Heart, Sparkles, X, Check, Trash2, 
  Download, ChevronLeft, ChevronRight, Image as ImageIcon, Send, MessageSquareHeart
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { triggerCelebration } from '../../utils/confetti';

const EVENT_TAGS = ['General', 'Haldi', 'Mehndi', 'Sangeet', 'Wedding', 'Reception'];

const TAPE_STYLES = [
  'bg-[#FEF08A]/85 border-[#FDE047]',
  'bg-[#EDE9FE]/85 border-[#DDD6FE]',
  'bg-[#FCE7F3]/85 border-[#F472B6]',
  'bg-[#D1FAE5]/85 border-[#34D399]',
  'bg-[#E0E7FF]/85 border-[#A5B4FC]',
];

export default function MomentsAndMemories({ 
  photos = [], 
  isCaricature = true, 
  bride = 'Preeti', 
  groom = 'Ashish',
  palette
}) {
  const [guestPhotos, setGuestPhotos] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'couple' | 'guests'
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // for lightbox
  const [likes, setLikes] = useState({});
  const [userLiked, setUserLiked] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    photoData: '',
    photoName: '',
    uploader: '',
    caption: '',
    eventTag: 'General',
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Load guest uploads and likes from localStorage on mount
  useEffect(() => {
    try {
      const storedUploads = localStorage.getItem('wishlys_moments_uploads');
      if (storedUploads) {
        setGuestPhotos(JSON.parse(storedUploads));
      }
      const storedLikes = localStorage.getItem('wishlys_moments_likes');
      if (storedLikes) {
        setLikes(JSON.parse(storedLikes));
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
  }, []);

  // Format official couple gallery items
  const officialMoments = (photos && photos.length > 0 ? photos : [
    { url: './images/couple-potrait.webp', caption: "In each other's eyes", tag: 'Wedding' },
    { url: './images/couple-landscape-1.webp', caption: 'Moments under the palace sun', tag: 'Haldi' },
    { url: './images/couple-landscape-2.webp', caption: 'Lakeside serenity in Udaipur', tag: 'General' },
    { url: './images/couple-potrait-1.webp', caption: 'Laughs & forever promises', tag: 'Sangeet' },
    { url: './images/couple-landscape-3.webp', caption: 'Golden hour at Lake Pichola', tag: 'General' },
    { url: './images/couple-landscape-4.webp', caption: 'Under the starlit sky', tag: 'Reception' },
    { url: './images/couple-udaipur-boat.webp', caption: 'Sailing into our tomorrow', tag: 'General' },
    { url: './images/couple-udaipur-rooftop.webp', caption: 'Rooftop whispers & dreams', tag: 'General' },
    { url: './images/couple-udaipur-bazaar.webp', caption: 'Old city charm & morning chai', tag: 'Mehndi' },
    { url: './images/couple-udaipur-hilltop.webp', caption: 'Monsoon palace panoramic views', tag: 'General' },
    { url: './images/couple-udaipur-haveli.webp', caption: 'Courtyard royalty & quiet peace', tag: 'Wedding' },
    { url: './images/couple-udaipur-ghat.webp', caption: "At Lake Pichola's edge", tag: 'General' },
  ]).map((item, idx) => ({
    id: `official_${idx}`,
    url: typeof item === 'string' ? item : (item.url || item.img),
    caption: typeof item === 'object' && item.caption ? item.caption : (item.title || `Moment 0${idx + 1}`),
    uploader: `${bride} & ${groom}`,
    isOfficial: true,
    tag: item.tag || 'Couple Story',
    date: 'Official Album',
  }));

  // Combined list based on filter
  const allMoments = [...guestPhotos, ...officialMoments];
  const displayedMoments = activeFilter === 'couple' 
    ? officialMoments 
    : activeFilter === 'guests' 
      ? guestPhotos 
      : allMoments;

  // Handle image file selection
  const handleFileProcess = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadForm(prev => ({
        ...prev,
        photoData: e.target.result,
        photoName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  // Submit new photo
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.photoData) {
      alert('Please choose or take a photo first.');
      return;
    }
    if (!uploadForm.uploader.trim()) {
      alert('Please enter your name so the couple knows who shared this memory!');
      return;
    }

    const newMemory = {
      id: 'guest_' + Date.now(),
      url: uploadForm.photoData,
      caption: uploadForm.caption.trim() || 'A cherished celebration memory 💕',
      uploader: uploadForm.uploader.trim(),
      isOfficial: false,
      tag: uploadForm.eventTag,
      date: 'Just now',
    };

    const updatedGuestPhotos = [newMemory, ...guestPhotos];
    setGuestPhotos(updatedGuestPhotos);

    try {
      localStorage.setItem('wishlys_moments_uploads', JSON.stringify(updatedGuestPhotos));
    } catch (err) {
      console.warn('Storage limit reached, retaining memory in session:', err);
    }

    // Celebration triggers
    soundManager.confettiBurst();
    triggerCelebration('confetti');

    // Reset Form & Close Modal
    setUploadForm({
      photoData: '',
      photoName: '',
      uploader: '',
      caption: '',
      eventTag: 'General',
    });
    setIsUploadOpen(false);
    setActiveFilter('all');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4500);
  };

  // Delete guest photo
  const handleDeleteGuestPhoto = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this photo?')) {
      const updated = guestPhotos.filter(p => p.id !== id);
      setGuestPhotos(updated);
      try {
        localStorage.setItem('wishlys_moments_uploads', JSON.stringify(updated));
      } catch (err) {}
      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null);
      }
    }
  };

  // Like a photo
  const handleLike = (id, e) => {
    e.stopPropagation();
    const current = likes[id] || 0;
    const isLiked = userLiked[id];
    const newCount = isLiked ? Math.max(0, current - 1) : current + 1;
    
    const updatedLikes = { ...likes, [id]: newCount };
    const updatedUserLiked = { ...userLiked, [id]: !isLiked };
    
    setLikes(updatedLikes);
    setUserLiked(updatedUserLiked);
    soundManager.playChime(isLiked ? 440 : 880, 0.2);

    try {
      localStorage.setItem('wishlys_moments_likes', JSON.stringify(updatedLikes));
    } catch (err) {}
  };

  // Lightbox Navigation
  const navigateLightbox = (direction) => {
    if (!selectedPhoto) return;
    const currentIndex = displayedMoments.findIndex(m => m.id === selectedPhoto.id);
    if (currentIndex === -1) return;
    const nextIndex = direction === 'next' 
      ? (currentIndex + 1) % displayedMoments.length 
      : (currentIndex - 1 + displayedMoments.length) % displayedMoments.length;
    setSelectedPhoto(displayedMoments[nextIndex]);
  };

  return (
    <section className="py-8 px-2 sm:px-4 w-full max-w-[420px] mx-auto select-none">
      
      {/* SECTION HEADER */}
      <div className="text-center space-y-1.5 mb-6">
        <span className="text-[11px] font-cursive tracking-wider text-[#DB2777] block font-semibold flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
          Moments to Cherish
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2B1E17] tracking-tight">
          Moments & Memories
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mt-1" />
        <p className="text-xs text-stone-600 font-light max-w-xs mx-auto pt-1 leading-relaxed">
          A glimpse into our sweetest celebrations and unforgettable memories.
        </p>
      </div>

      {/* MEMORIES GRID */}
      {displayedMoments.length === 0 ? (
        <div className="bg-white/90 rounded-2xl p-8 text-center border-2 border-dashed border-stone-200 my-4 space-y-3">
          <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-500 mx-auto flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg text-stone-800">No guest photos yet!</h4>
          <p className="text-xs text-stone-500">Be the first guest to upload a candid memory or selfie with the couple.</p>
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 rounded-full bg-[#FCE7F3] text-[#BE185D] text-xs font-bold uppercase tracking-wider hover:bg-[#FBCFE8] transition-colors cursor-pointer"
          >
            📸 Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {displayedMoments.map((item, idx) => {
            const isGuest = !item.isOfficial;
            const tapeStyle = TAPE_STYLES[idx % TAPE_STYLES.length];
            const likeCount = likes[item.id] || 0;
            const isLiked = !!userLiked[item.id];

            return (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className={`relative bg-white p-2 pb-3 rounded-xl shadow-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group flex flex-col justify-between ${
                  isGuest ? 'border-pink-200 ring-2 ring-pink-100/60' : 'border-stone-200'
                } ${idx % 2 === 0 ? '-rotate-1 hover:rotate-0' : 'rotate-1 hover:rotate-0'}`}
              >
                {/* Washi Tape */}
                <div 
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 ${tapeStyle} rounded shadow-2xs border ${
                    idx % 2 === 0 ? 'rotate-1' : '-rotate-1'
                  }`} 
                />

                {/* Guest Badge if uploaded */}
                {isGuest && (
                  <div className="absolute top-1.5 right-1.5 z-10 bg-[#BE185D] text-white text-[7.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full shadow-xs">
                    Guest
                  </div>
                )}

                {/* Photo Thumbnail */}
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-stone-100 mb-2 border border-stone-200 relative">
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] text-white font-semibold bg-black/60 px-2 py-1 rounded-full">
                      🔍 Tap to View
                    </span>
                  </div>
                </div>

                {/* Caption & Uploader */}
                <div className="space-y-1 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold bg-[#FAF5ED] text-[#8B6F47]">
                      {item.tag || 'Moment'}
                    </span>
                    <p className="text-[11px] font-medium text-stone-800 line-clamp-2 mt-1 leading-snug">
                      "{item.caption}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between mt-auto">
                    <span className="text-[9px] text-stone-500 font-medium truncate max-w-[90px]" title={item.uploader}>
                      {isGuest ? `By ${item.uploader}` : `✦ ${item.uploader}`}
                    </span>
                    
                    {/* Heart Like Button */}
                    <button
                      type="button"
                      onClick={(e) => handleLike(item.id, e)}
                      className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all cursor-pointer ${
                        isLiked 
                          ? 'bg-rose-50 text-rose-600 scale-105' 
                          : 'text-stone-400 hover:text-rose-500 hover:bg-stone-50'
                      }`}
                      title="Like this memory"
                    >
                      <Heart className={`w-3 h-3 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{likeCount > 0 ? likeCount : ''}</span>
                    </button>
                  </div>
                </div>

                {/* Delete button for guest photos */}
                {isGuest && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteGuestPhoto(item.id, e)}
                    className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-80 hover:opacity-100 p-1 text-stone-400 hover:text-red-500 transition-opacity"
                    title="Remove this photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isUploadOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsUploadOpen(false)}
        >
          <div 
            className="relative w-full max-w-[360px] max-h-[90vh] overflow-y-auto bg-[#FFFDF9] rounded-3xl p-5 border-2 border-[#FDE68A] shadow-2xl space-y-4 animate-scaleUp select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Washi Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 rounded bg-[#FCE7F3] border border-[#F472B6] rotate-1 shadow-xs" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold shadow-xs cursor-pointer z-10 transition-colors"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1 pt-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB2777]">
                Live Guest Album
              </span>
              <h3 className="font-serif text-2xl font-light text-[#2B1E17]">
                Share a Memory
              </h3>
              <p className="text-[11px] text-stone-500 font-light">
                Upload your selfie, candid snap, or memory with {bride} & {groom}.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleUploadSubmit} className="space-y-3.5">
              
              {/* Photo Dropzone / Camera Picker */}
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  capture="environment"
                  onChange={handleFileChange} 
                  className="hidden" 
                />

                {uploadForm.photoData ? (
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-[#FBBF24] bg-stone-100 shadow-inner group">
                    <img 
                      src={uploadForm.photoData} 
                      alt="Upload Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-full bg-white text-stone-800 text-[11px] font-bold shadow-md hover:bg-stone-100 cursor-pointer"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadForm(p => ({ ...p, photoData: '', photoName: '' }))}
                        className="px-3 py-1.5 rounded-full bg-rose-500 text-white text-[11px] font-bold shadow-md hover:bg-rose-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-[#DB2777] bg-pink-50 scale-102' 
                        : 'border-[#FBBF24] bg-[#FFFDF7] hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FEF08A] text-amber-700 flex items-center justify-center mb-2 shadow-sm animate-pulse">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-stone-800">
                      Tap to Choose or Take Photo
                    </span>
                    <span className="text-[10px] text-stone-500 mt-1">
                      Supports phone gallery, camera, and drag & drop
                    </span>
                  </div>
                )}
              </div>

              {/* Uploader Name Input */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-600 tracking-wider block">
                  Your Name / Family <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya & Rohan, Delhi"
                  value={uploadForm.uploader}
                  onChange={(e) => setUploadForm(p => ({ ...p, uploader: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              {/* Caption / Wish Input */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-600 tracking-wider block">
                  Sweet Wish / Caption
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Dancing the night away at Sangeet! So happy for you both 💕"
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm(p => ({ ...p, caption: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                />
              </div>

              {/* Ceremony Event Tag Selector */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-600 tracking-wider block">
                  Ceremony / Event
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {EVENT_TAGS.map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setUploadForm(p => ({ ...p, eventTag: tag }))}
                      className={`text-[9.5px] px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                        uploadForm.eventTag === tag
                          ? 'bg-[#BE185D] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!uploadForm.photoData}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#F472B6] via-[#EC4899] to-[#DB2777] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-101 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Memory to Album ✨</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-lg animate-fadeIn select-none"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative w-full max-w-[380px] bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 border-2 border-[#FDE68A] shadow-2xl space-y-3 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Washi Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 rounded bg-[#FEF08A] border border-[#FDE047] rotate-1 shadow-xs" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold shadow-xs cursor-pointer z-10 transition-colors"
            >
              ✕
            </button>

            {/* Left / Right Nav Buttons */}
            <button
              type="button"
              onClick={() => navigateLightbox('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-stone-700 hover:bg-white shadow-md flex items-center justify-center cursor-pointer z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => navigateLightbox('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-stone-700 hover:bg-white shadow-md flex items-center justify-center cursor-pointer z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Main Lightbox Photo */}
            <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border-2 border-stone-200 shadow-inner mt-2 relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Photo Metadata */}
            <div className="space-y-1 pt-1 text-center">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-[#FAF5ED] text-[#8B6F47]">
                {selectedPhoto.tag || 'Memory'} · {selectedPhoto.date || 'Celebration'}
              </span>
              <p className="font-serif text-lg text-[#2B1E17] font-medium leading-snug">
                "{selectedPhoto.caption}"
              </p>
              <p className="text-[10px] text-stone-500 font-sans">
                Shared by: <strong className="text-stone-800">{selectedPhoto.uploader}</strong>
              </p>
            </div>

            {/* Actions Bar */}
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => handleLike(selectedPhoto.id, e)}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <Heart className={`w-3.5 h-3.5 ${userLiked[selectedPhoto.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{likes[selectedPhoto.id] || 0} Likes</span>
              </button>

              <a
                href={selectedPhoto.url}
                download={`memory_${selectedPhoto.id}.jpg`}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
