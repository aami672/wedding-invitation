import React, { useState, useEffect, useRef } from 'react';
import {
  Crop,
  Sliders,
  RotateCw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  Sun,
  Contrast,
  Sparkles,
  Check,
  X,
  RotateCcw,
  Move,
  Maximize2
} from 'lucide-react';

const ASPECT_RATIOS = [
  { id: 'cover', label: '9:16 Story / Cover', ratio: 9 / 16, hint: 'Best for opening hero' },
  { id: 'portrait', label: '3:4 Portrait', ratio: 3 / 4, hint: 'Bride & Groom cards' },
  { id: 'classic', label: '4:5 Classic', ratio: 4 / 5, hint: 'Standard photo' },
  { id: 'square', label: '1:1 Square', ratio: 1 / 1, hint: 'Avatar / Monogram' },
  { id: 'original', label: 'Original', ratio: 'original', hint: 'Keep source aspect' },
];

const FILTER_PRESETS = [
  { id: 'normal', name: 'Original', b: 0, c: 0, w: 0, s: 100 },
  { id: 'warm', name: 'Warm Royal', b: 4, c: 12, w: 24, s: 110 },
  { id: 'pastel', name: 'Pastel Luxe', b: 8, c: -6, w: 14, s: 92 },
  { id: 'golden', name: 'Golden Hour', b: 6, c: 16, w: 32, s: 115 },
  { id: 'bw', name: 'Classic B&W', b: 6, c: 22, w: 0, s: 0 },
];

export default function PhotoAdjustCropModal({
  isOpen,
  imageSrc,
  title = 'Adjust & Crop Photo',
  defaultAspect = 9 / 16,
  onApply,
  onCancel,
}) {
  const [activeTab, setActiveTab] = useState('crop'); // 'crop' | 'adjust' | 'filters'
  const [selectedRatioId, setSelectedRatioId] = useState('cover');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);

  // Adjustments
  const [brightness, setBrightness] = useState(0); // -50 to 50
  const [contrast, setContrast] = useState(0); // -50 to 50
  const [warmth, setWarmth] = useState(0); // 0 to 50
  const [saturation, setSaturation] = useState(100); // 0 to 200
  const [activePreset, setActivePreset] = useState('normal');

  // Drag interaction
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, panStartX: 0, panStartY: 0 });
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 });

  // Reset or initialize on image open
  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setFlipH(false);
    setBrightness(0);
    setContrast(0);
    setWarmth(0);
    setSaturation(100);
    setActivePreset('normal');
    setActiveTab('crop');

    // Pick closest matching aspect ratio preset
    if (typeof defaultAspect === 'number') {
      const match = ASPECT_RATIOS.find(r => typeof r.ratio === 'number' && Math.abs(r.ratio - defaultAspect) < 0.05);
      if (match) setSelectedRatioId(match.id);
      else setSelectedRatioId('cover');
    } else {
      setSelectedRatioId('cover');
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setNaturalDimensions({
        width: img.naturalWidth || 800,
        height: img.naturalHeight || 600,
      });
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc, defaultAspect]);

  if (!isOpen || !imageSrc) return null;

  // Compute effective aspect ratio
  const activeRatioObj = ASPECT_RATIOS.find(r => r.id === selectedRatioId) || ASPECT_RATIOS[0];
  const effectiveRatio =
    activeRatioObj.ratio === 'original'
      ? naturalDimensions.width && naturalDimensions.height
        ? naturalDimensions.width / naturalDimensions.height
        : 1
      : activeRatioObj.ratio;

  // Calculate box dimensions inside preview area (max width 340, max height 380)
  const maxBoxW = 340;
  const maxBoxH = 380;
  let boxW = maxBoxW;
  let boxH = Math.round(boxW / effectiveRatio);

  if (boxH > maxBoxH) {
    boxH = maxBoxH;
    boxW = Math.round(boxH * effectiveRatio);
  }
  if (boxW > maxBoxW) {
    boxW = maxBoxW;
    boxH = Math.round(boxW / effectiveRatio);
  }

  // Base image size inside the crop box (covers the box)
  const nw = naturalDimensions.width || 800;
  const nh = naturalDimensions.height || 600;
  const scale0 = Math.max(boxW / nw, boxH / nh);
  const baseW = Math.round(nw * scale0);
  const baseH = Math.round(nh * scale0);

  // Mouse / Touch Drag handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panStartX: pan.x,
      panStartY: pan.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan({
      x: dragRef.current.panStartX + dx,
      y: dragRef.current.panStartY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        panStartX: pan.x,
        panStartY: pan.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragRef.current.startX;
    const dy = touch.clientY - dragRef.current.startY;
    setPan({
      x: dragRef.current.panStartX + dx,
      y: dragRef.current.panStartY + dy,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(prev => {
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      return Math.min(3, Math.max(1, +(prev + delta).toFixed(2)));
    });
  };

  // Reset all adjustments
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setFlipH(false);
    setBrightness(0);
    setContrast(0);
    setWarmth(0);
    setSaturation(100);
    setActivePreset('normal');
  };

  // Preset filter application
  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setBrightness(preset.b);
    setContrast(preset.c);
    setWarmth(preset.w);
    setSaturation(preset.s);
  };

  // Final export via Canvas
  const handleApply = () => {
    if (!nw || !nh) {
      onApply(imageSrc);
      return;
    }

    // Determine target canvas dimensions
    const targetW = 900;
    const targetH = Math.round(targetW / effectiveRatio);
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      onApply(imageSrc);
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);

    const k = targetW / boxW;

    ctx.save();
    ctx.translate(targetW / 2, targetH / 2);

    try {
      ctx.filter = `brightness(${1 + brightness / 100}) contrast(${1 + contrast / 100}) saturate(${saturation / 100}) sepia(${warmth / 100})`;
    } catch {
      // fallback
    }

    ctx.translate(pan.x * k, pan.y * k);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, 1);
    ctx.scale(zoom, zoom);

    const drawW = baseW * k;
    const drawH = baseH * k;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        onApply(dataUrl);
      } catch (err) {
        console.warn('Canvas export failed, passing original:', err);
        onApply(imageSrc);
      }
    };
    img.onerror = () => {
      onApply(imageSrc);
    };
    img.src = imageSrc;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#8B6F47]/10 flex items-center justify-center text-[#8B6F47]">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#2B1E17] leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-stone-500 font-light">
                Position, crop, zoom, and enhance your photo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content: Two Columns on desktop */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Column: Interactive Crop Viewport */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-stone-950/90 rounded-2xl p-4 sm:p-6 border border-stone-800 relative min-h-[380px]">
            {/* Viewport Box */}
            <div
              style={{
                width: `${boxW}px`,
                height: `${boxH}px`,
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              className={`relative overflow-hidden rounded-2xl border-2 border-[#D5C2AA] shadow-2xl bg-stone-900 select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {/* Image transform wrapper */}
              <div
                style={{
                  width: `${baseW}px`,
                  height: `${baseH}px`,
                  position: 'absolute',
                  left: `${(boxW - baseW) / 2 + pan.x}px`,
                  top: `${(boxH - baseH) / 2 + pan.y}px`,
                  transform: `scale(${zoom}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
                  transformOrigin: 'center center',
                  filter: `brightness(${1 + brightness / 100}) contrast(${1 + contrast / 100}) saturate(${saturation / 100}) sepia(${warmth / 100})`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
              >
                <img
                  src={imageSrc}
                  alt="Crop Target"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
              </div>

              {/* 3x3 Grid Guidelines */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-b border-white/20"></div>
                <div className="border-r border-white/20"></div>
                <div className="border-r border-white/20"></div>
                <div></div>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#FFD700] pointer-events-none shadow-xs" />
              <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-[#FFD700] pointer-events-none shadow-xs" />
              <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-[#FFD700] pointer-events-none shadow-xs" />
              <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#FFD700] pointer-events-none shadow-xs" />
            </div>

            {/* Instruction pill */}
            <div className="mt-3 flex items-center gap-1.5 text-stone-400 text-[10px] tracking-wide">
              <Move className="w-3 h-3 text-[#C5A880]" />
              <span>Drag to reposition • Scroll or use slider to zoom</span>
            </div>
          </div>

          {/* Right Column: Controls & Tabs */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            {/* Tabs */}
            <div className="flex border border-stone-200 rounded-xl p-1 bg-stone-100">
              <button
                type="button"
                onClick={() => setActiveTab('crop')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'crop'
                    ? 'bg-white text-[#8B6F47] shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Crop</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('adjust')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'adjust'
                    ? 'bg-white text-[#8B6F47] shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('filters')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'filters'
                    ? 'bg-white text-[#8B6F47] shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Glow</span>
              </button>
            </div>

            {/* TAB 1: CROP & TRANSFORM */}
            {activeTab === 'crop' && (
              <div className="space-y-4 flex-1">
                {/* Aspect Ratio Buttons */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ASPECT_RATIOS.map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRatioId(r.id)}
                        className={`px-2.5 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                          selectedRatioId === r.id
                            ? 'border-[#8B6F47] bg-[#FAF5ED] ring-1 ring-[#C5A880]'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="text-[11px] font-semibold text-stone-800 leading-tight">
                          {r.label}
                        </div>
                        <div className="text-[9px] text-stone-400 mt-0.5 truncate">{r.hint}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zoom Slider */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                      Zoom
                    </span>
                    <span className="font-mono text-stone-600 text-xs font-semibold">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setZoom(z => Math.max(1, +(z - 0.1).toFixed(2)))}
                      className="p-1 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={e => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-[#8B6F47] cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))}
                      className="p-1 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Rotate & Flip Buttons */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                    Orientation
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRotation(r => (r + 90) % 360)}
                      className="flex-1 py-2 px-3 rounded-xl border border-stone-200 hover:border-[#8B6F47] hover:bg-[#FAF5ED] text-stone-700 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-[#8B6F47]" />
                      <span>Rotate 90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipH(f => !f)}
                      className={`flex-1 py-2 px-3 rounded-xl border transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold ${
                        flipH
                          ? 'border-[#8B6F47] bg-[#FAF5ED] text-[#8B6F47]'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                      }`}
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      <span>Flip</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TONE ADJUSTMENTS */}
            {activeTab === 'adjust' && (
              <div className="space-y-3.5 flex-1">
                {/* Brightness */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-700">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Brightness
                    </span>
                    <span className="font-mono text-stone-500 text-[11px]">
                      {brightness > 0 ? `+${brightness}` : brightness}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={brightness}
                    onChange={e => setBrightness(parseInt(e.target.value))}
                    className="w-full accent-[#8B6F47] cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-700">
                      <Contrast className="w-3.5 h-3.5 text-stone-600" />
                      Contrast
                    </span>
                    <span className="font-mono text-stone-500 text-[11px]">
                      {contrast > 0 ? `+${contrast}` : contrast}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={contrast}
                    onChange={e => setContrast(parseInt(e.target.value))}
                    className="w-full accent-[#8B6F47] cursor-pointer"
                  />
                </div>

                {/* Warmth (Wedding golden tone) */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-700">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                      Warm Glow (Haldi & Gold)
                    </span>
                    <span className="font-mono text-stone-500 text-[11px]">{warmth}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    value={warmth}
                    onChange={e => setWarmth(parseInt(e.target.value))}
                    className="w-full accent-[#C5A880] cursor-pointer"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[11px] font-semibold text-stone-700">Saturation</span>
                    <span className="font-mono text-stone-500 text-[11px]">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={saturation}
                    onChange={e => setSaturation(parseInt(e.target.value))}
                    className="w-full accent-[#8B6F47] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: WEDDING GLOW PRESETS */}
            {activeTab === 'filters' && (
              <div className="space-y-2.5 flex-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                  Wedding Mood Filters
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {FILTER_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activePreset === preset.id
                          ? 'border-[#8B6F47] bg-[#FAF5ED] ring-1 ring-[#C5A880]'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg overflow-hidden border border-stone-200 bg-cover bg-center shrink-0"
                          style={{
                            backgroundImage: `url(${imageSrc})`,
                            filter: `brightness(${1 + preset.b / 100}) contrast(${1 + preset.c / 100}) saturate(${preset.s / 100}) sepia(${preset.w / 100})`,
                          }}
                        />
                        <div>
                          <div className="text-xs font-semibold text-stone-800">{preset.name}</div>
                          <div className="text-[10px] text-stone-400">
                            {preset.id === 'warm' && 'Golden warmth for Indian weddings'}
                            {preset.id === 'pastel' && 'Soft highlights for dreamy portraits'}
                            {preset.id === 'golden' && 'Radiant twilight & sundowner glow'}
                            {preset.id === 'bw' && 'Timeless royal monochrome portrait'}
                            {preset.id === 'normal' && 'Natural original colors'}
                          </div>
                        </div>
                      </div>
                      {activePreset === preset.id && (
                        <Check className="w-4 h-4 text-[#8B6F47]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reset button */}
            <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset adjustments</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B6F47] to-[#A38258] hover:from-[#765E3C] hover:to-[#8E714B] text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply & Save Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
