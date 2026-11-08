import React, { useEffect, useRef } from 'react';

/**
 * Continuous 60fps Invitation Atmosphere Particle Engine
 * Confined strictly inside the invitation screen container (phone simulator or full screen).
 * Supports customizable styles (petals, flowers, sparkles, feathers, fireflies) and intensities.
 */
export default function ThemeAtmosphere({ 
  themeId = 'caricature',
  atmosphere = {} 
}) {
  const canvasRef = useRef(null);

  const styleSetting = atmosphere?.style || 'auto';
  const intensitySetting = atmosphere?.intensity || 'medium';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    // Strict Container Bounds Sizing
    const resize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      // Find nearest scrollable container (e.g. phone simulator frame in Studio)
      const scrollParent = canvas.closest('.overflow-y-auto') || canvas.closest('[data-simulator-frame]');
      
      let width = parent.clientWidth || 390;
      let height = window.innerHeight;

      if (scrollParent && scrollParent.clientHeight) {
        height = scrollParent.clientHeight;
        width = Math.min(width, scrollParent.clientWidth || width);
      } else if (parent.clientHeight && parent.clientHeight < window.innerHeight) {
        height = parent.clientHeight;
      }

      // Safeguard bounds
      canvas.width = Math.max(120, Math.round(width));
      canvas.height = Math.max(200, Math.round(height));
      canvas.style.width = `${canvas.width}px`;
      canvas.style.height = `${canvas.height}px`;
    };

    resize();

    // Use ResizeObserver for responsive adaptation when switching mobile/tablet or window resize
    let observer;
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      observer = new ResizeObserver(() => resize());
      observer.observe(canvas.parentElement);
      const scrollParent = canvas.closest('.overflow-y-auto');
      if (scrollParent) observer.observe(scrollParent);
    }
    window.addEventListener('resize', resize);

    // Particle Count based on intensity
    if (intensitySetting === 'none' || styleSetting === 'none') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return () => {
        window.removeEventListener('resize', resize);
        if (observer) observer.disconnect();
      };
    }

    let particleCount = 28; // Default medium
    if (typeof intensitySetting === 'number') {
      particleCount = intensitySetting;
    } else if (intensitySetting === 'subtle' || intensitySetting === 'light') {
      particleCount = 14;
    } else if (intensitySetting === 'rich' || intensitySetting === 'dense') {
      particleCount = 52;
    }

    // Resolve Style Mode
    const isAuto = styleSetting === 'auto' || !styleSetting;
    const isPichwai = themeId === 'pichwai';
    const isMela = themeId === 'mela';
    const isBougain = themeId === 'bougain' || themeId === 'bougainvillea';
    const isZardozi = themeId === 'zardozi';
    const isCaricature = themeId === 'caricature' || themeId === 'storybook';

    // Helper to generate particle based on user preference or theme
    const createParticle = () => {
      let pType = 'petal';
      let pColor = '#F59E0B';
      let speedY = Math.random() * 0.9 + 0.4;
      let size = Math.random() * 6 + 5;

      if (styleSetting === 'feathers') {
        pType = 'feather';
        pColor = Math.random() > 0.4 ? '#FFFDF8' : Math.random() > 0.5 ? '#F8F1E5' : '#EEDAA2';
        size = Math.random() * 8 + 12; // Feathers are larger and elegant
        speedY = Math.random() * 0.5 + 0.35; // Feathers float down gently
      } else if (styleSetting === 'sparkles') {
        pType = Math.random() > 0.5 ? 'sparkle-star' : 'gold-stardust';
        pColor = Math.random() > 0.4 ? '#FFD700' : Math.random() > 0.3 ? '#FFF8DC' : '#E6CA65';
        size = Math.random() * 4 + 2;
        speedY = Math.random() * 0.6 + 0.3;
      } else if (styleSetting === 'petals') {
        const isMarigold = Math.random() > 0.45;
        pType = isMarigold ? 'marigold-petal' : 'rose-petal';
        pColor = isMarigold 
          ? (Math.random() > 0.5 ? '#F59E0B' : '#EA580C') // Marigold saffron/orange
          : (Math.random() > 0.5 ? '#E11D48' : '#FB7185'); // Rose ruby/pink
        size = Math.random() * 6 + 6;
      } else if (styleSetting === 'flowers') {
        const r = Math.random();
        pType = r > 0.6 ? 'marigold-flower' : r > 0.3 ? 'bougain-petal' : 'jasmine-flower';
        pColor = pType === 'marigold-flower' 
          ? (Math.random() > 0.5 ? '#F59E0B' : '#D97706')
          : pType === 'bougain-petal'
          ? (Math.random() > 0.5 ? '#E11D48' : '#F43F5E')
          : '#FFFDF0';
        size = Math.random() * 6 + 8;
      } else if (styleSetting === 'fireflies') {
        pType = 'firefly';
        pColor = '#FFD700';
        size = Math.random() * 3 + 2;
        speedY = -(Math.random() * 0.7 + 0.3); // Upward floating
      } else if (styleSetting === 'hearts') {
        pType = 'heart';
        pColor = Math.random() > 0.6 ? '#F43F5E' : Math.random() > 0.3 ? '#FB7185' : '#FDA4AF';
        size = Math.random() * 5 + 4;
      } else if (isAuto) {
        // Theme-driven defaults
        if (isMela) {
          pType = Math.random() > 0.4 ? 'marigold-petal' : 'marigold-flower';
          pColor = Math.random() > 0.5 ? '#F59E0B' : '#EA580C';
          size = Math.random() * 7 + 5;
        } else if (isBougain) {
          pType = 'bougain-petal';
          pColor = Math.random() > 0.5 ? '#E11D48' : '#FB7185';
          size = Math.random() * 6 + 5;
        } else if (isPichwai) {
          pType = Math.random() > 0.35 ? 'firefly' : 'lotus-petal';
          pColor = pType === 'firefly' ? '#FFD700' : '#F472B6';
          size = pType === 'firefly' ? Math.random() * 3 + 2 : Math.random() * 6 + 4;
          speedY = pType === 'firefly' ? -(Math.random() * 0.7 + 0.3) : (Math.random() * 0.8 + 0.4);
        } else if (isZardozi) {
          pType = 'gold-stardust';
          pColor = Math.random() > 0.4 ? '#D4AF37' : '#E6CA65';
          size = Math.random() * 3.5 + 2;
        } else if (isCaricature) {
          pType = Math.random() > 0.5 ? 'marigold-petal' : 'rose-petal';
          pColor = Math.random() > 0.5 ? '#F59E0B' : '#FB7185';
          size = Math.random() * 5 + 4;
        } else {
          pType = Math.random() > 0.5 ? 'sparkle-star' : 'marigold-petal';
          pColor = '#D4AF37';
          size = Math.random() * 4 + 3;
        }
      }

      return {
        x: Math.random() * (canvas.width || 390),
        y: Math.random() * (canvas.height || 780),
        size,
        speedY,
        speedX: (Math.random() - 0.5) * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        tiltAngle: Math.random() * Math.PI * 2,
        tiltSpeed: Math.random() * 0.03 + 0.015,
        opacity: Math.random() * 0.55 + 0.4,
        pulseOffset: Math.random() * Math.PI * 2,
        type: pType,
        color: pColor,
        quillColor: '#D8C7A5',
      };
    };

    const particles = Array.from({ length: particleCount }, () => createParticle());

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const currentOpacity = p.type === 'firefly'
          ? Math.max(0.2, p.opacity + Math.sin(time * 3 + p.pulseOffset) * 0.35)
          : p.opacity;

        ctx.globalAlpha = currentOpacity;

        // Realistic 3D Tilt for floating petals & leaves
        const tiltFactor = Math.cos(p.tiltAngle);

        if (p.type === 'feather') {
          // --- ROYAL FLOATING FEATHER ---
          const len = p.size * 2.2;
          const w = p.size * 0.7;

          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(212, 175, 55, 0.25)';

          // Feather Body / Vanes
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -len * 0.5);
          ctx.bezierCurveTo(-w * 0.85, -len * 0.2, -w * 0.85, len * 0.3, 0, len * 0.45);
          ctx.bezierCurveTo(w * 0.85, len * 0.3, w * 0.85, -len * 0.2, 0, -len * 0.5);
          ctx.closePath();
          ctx.fill();

          // Delicate fine vane textures
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 0.6;
          for (let f = -0.35; f <= 0.25; f += 0.15) {
            ctx.beginPath();
            ctx.moveTo(0, len * f);
            ctx.lineTo(-w * 0.6, len * (f - 0.1));
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, len * f);
            ctx.lineTo(w * 0.6, len * (f - 0.1));
            ctx.stroke();
          }

          // Central Quill (Rachis)
          ctx.beginPath();
          ctx.moveTo(0, -len * 0.52);
          ctx.quadraticCurveTo(w * 0.15, 0, 0, len * 0.52);
          ctx.strokeStyle = p.quillColor;
          ctx.lineWidth = 1.1;
          ctx.stroke();

        } else if (p.type === 'marigold-petal') {
          // --- MARIGOLD PETAL ---
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, Math.abs(p.size * 0.55 * tiltFactor), 0, 0, Math.PI * 2);
          ctx.fill();

        } else if (p.type === 'rose-petal') {
          // --- ROSE PETAL (Heart-curved teardrop) ---
          ctx.fillStyle = p.color;
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, s);
          ctx.bezierCurveTo(s * 0.8, s * 0.2, s * 0.7, -s * 0.8, 0, -s * 0.6);
          ctx.bezierCurveTo(-s * 0.7, -s * 0.8, -s * 0.8, s * 0.2, 0, s);
          ctx.closePath();
          ctx.fill();

        } else if (p.type === 'marigold-flower') {
          // --- MINI MARIGOLD BLOSSOM ---
          ctx.fillStyle = p.color;
          for (let petal = 0; petal < 6; petal++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath();
            ctx.ellipse(p.size * 0.4, 0, p.size * 0.45, p.size * 0.3 * Math.abs(tiltFactor || 0.8), 0, 0, Math.PI * 2);
            ctx.fill();
          }
          // Center core
          ctx.fillStyle = '#78350F';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
          ctx.fill();

        } else if (p.type === 'jasmine-flower') {
          // --- JASMINE MOGRA BLOSSOM ---
          ctx.fillStyle = p.color;
          for (let petal = 0; petal < 5; petal++) {
            ctx.rotate((Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.ellipse(p.size * 0.45, 0, p.size * 0.4, p.size * 0.22, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
          ctx.fill();

        } else if (p.type === 'bougain-petal') {
          // --- BOUGAINVILLEA BRACT ---
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
          ctx.fill();

        } else if (p.type === 'sparkle-star') {
          // --- 4-POINT CELESTIAL STAR ---
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#FFD700';
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.5);
          ctx.lineTo(p.size * 0.35, 0);
          ctx.lineTo(0, p.size * 1.5);
          ctx.lineTo(-p.size * 0.35, 0);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-p.size * 1.5, 0);
          ctx.lineTo(0, p.size * 0.35);
          ctx.lineTo(p.size * 1.5, 0);
          ctx.lineTo(0, -p.size * 0.35);
          ctx.closePath();
          ctx.fill();

        } else if (p.type === 'gold-stardust') {
          // --- SHIMMERING GLITTER STAR ---
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#D4AF37';
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.3, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.3, 0);
          ctx.closePath();
          ctx.fill();

        } else if (p.type === 'firefly') {
          // --- GLOWING FIREFLY ---
          ctx.shadowBlur = 14;
          ctx.shadowColor = '#FFD700';
          ctx.fillStyle = '#FFF8DC';
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();

        } else if (p.type === 'lotus-petal') {
          // --- LOTUS PETAL ---
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#F472B6';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.7 * Math.abs(tiltFactor || 0.7), 0, 0, Math.PI * 2);
          ctx.fill();

        } else if (p.type === 'heart') {
          // --- ROMANTIC HEART ---
          ctx.fillStyle = p.color;
          const s = p.size * 0.65;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.4);
          ctx.bezierCurveTo(-s, -s * 0.5, -s, -s * 1.2, 0, -s * 0.4);
          ctx.bezierCurveTo(s, -s * 1.2, s, -s * 0.5, 0, s * 0.4);
          ctx.fill();

        } else {
          // Default soft circle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Motion physics
        p.tiltAngle += p.tiltSpeed;
        p.rotation += p.rotSpeed;

        if (p.type === 'feather') {
          // Gentle pendulum swaying for feathers
          const sway = Math.sin(time * 1.6 + p.pulseOffset);
          p.x += sway * 1.1;
          p.rotation = sway * 0.35;
          p.y += p.speedY;
        } else if (p.type === 'firefly') {
          p.y += p.speedY; // Upwards
          p.x += Math.sin(time * 1.8 + p.pulseOffset) * 0.8;
        } else {
          p.y += p.speedY;
          p.x += Math.sin(time + p.pulseOffset) * 0.6;
        }

        // Wrap around strictly inside canvas bounds
        if (p.speedY > 0 && p.y > canvas.height + 25) {
          p.y = -25;
          p.x = Math.random() * canvas.width;
        } else if (p.speedY < 0 && p.y < -25) {
          p.y = canvas.height + 25;
          p.x = Math.random() * canvas.width;
        }

        if (p.x > canvas.width + 25) p.x = -25;
        if (p.x < -25) p.x = canvas.width + 25;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (observer) observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, [themeId, styleSetting, intensitySetting]);

  if (intensitySetting === 'none' || styleSetting === 'none') {
    return null;
  }

  const isDarkTheme = themeId === 'pichwai' || themeId === 'cinematic';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <canvas 
        ref={canvasRef} 
        className="sticky top-0 left-0 pointer-events-none block max-w-full" 
        style={{ 
          mixBlendMode: isDarkTheme ? 'screen' : 'normal',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
