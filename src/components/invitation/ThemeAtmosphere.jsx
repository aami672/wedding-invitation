import React, { useEffect, useRef } from 'react';

export default function ThemeAtmosphere({ themeId = 'pichwai' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const isMela = themeId === 'mela';
    const isPichwai = themeId === 'pichwai';
    const isZardozi = themeId === 'zardozi';
    const isBougain = themeId === 'bougain' || themeId === 'bougainvillea';
    const isCaricature = themeId === 'caricature' || themeId === 'storybook';
    const isRajwada = themeId === 'rajwada' || themeId === 'cinematic';

    // Particle pool tailored for each theme
    const particles = [];
    const count = isPichwai ? 45 : isMela ? 40 : isBougain ? 35 : isZardozi ? 50 : 30;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 800),
        y: Math.random() * (canvas.height || 1000),
        size: isMela ? Math.random() * 8 + 6 : isBougain ? Math.random() * 7 + 5 : isPichwai ? Math.random() * 4 + 2 : Math.random() * 4 + 2,
        speedY: isPichwai ? -(Math.random() * 0.8 + 0.3) : (Math.random() * 1.2 + 0.4), // Pichwai fireflies float upwards
        speedX: (Math.random() - 0.5) * 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        opacity: Math.random() * 0.6 + 0.35,
        pulseOffset: Math.random() * Math.PI * 2,
        type: isMela 
          ? (Math.random() > 0.4 ? 'marigold-petal' : 'marigold-flower')
          : isBougain
          ? 'bougain-petal'
          : isPichwai
          ? (Math.random() > 0.3 ? 'firefly' : 'lotus-petal')
          : isZardozi
          ? 'gold-stardust'
          : isCaricature
          ? (Math.random() > 0.5 ? 'heart' : 'confetti')
          : 'sparkle',
        color: isMela
          ? (Math.random() > 0.5 ? '#F59E0B' : '#EA580C') // Marigold yellow/orange
          : isBougain
          ? (Math.random() > 0.5 ? '#E11D48' : '#FB7185') // Magenta & rose pink
          : isPichwai
          ? (Math.random() > 0.3 ? '#FFD700' : '#F472B6') // Golden fireflies & lotus pink
          : isZardozi
          ? (Math.random() > 0.4 ? '#D4AF37' : '#E6CA65') // Golden zari stardust
          : isCaricature
          ? (Math.random() > 0.6 ? '#F43F5E' : Math.random() > 0.3 ? '#F59E0B' : '#06B6D4')
          : '#D4AF37',
      });
    }

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const currentOpacity = p.type === 'firefly'
          ? Math.max(0.2, p.opacity + Math.sin(time * 3 + p.pulseOffset) * 0.3)
          : p.opacity;

        ctx.globalAlpha = currentOpacity;

        if (p.type === 'marigold-petal') {
          // Curving Marigold Petal
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'marigold-flower') {
          // Mini Marigold Flower Blossom with petals
          ctx.fillStyle = p.color;
          for (let petal = 0; petal < 6; petal++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath();
            ctx.ellipse(p.size * 0.4, 0, p.size * 0.45, p.size * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#78350F';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'bougain-petal') {
          // Delicate Bougainvillea Tear-drop petal
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
          ctx.fill();
        } else if (p.type === 'firefly') {
          // Pichwai Glowing Golden Firefly with soft bloom halo
          ctx.shadowBlur = 14;
          ctx.shadowColor = '#FFD700';
          ctx.fillStyle = '#FFF8DC';
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'lotus-petal') {
          // Floating Lotus Petal
          ctx.fillStyle = 'rgba(244, 114, 182, 0.7)';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#F472B6';
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'gold-stardust') {
          // Zardozi Shimmering Golden Glitter Flake
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#D4AF37';
          ctx.fillStyle = p.color;
          // 4-point diamond star
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.3, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.3, 0);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'heart') {
          // Pastel Storybook Mini Heart
          ctx.fillStyle = p.color;
          const s = p.size * 0.6;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.4);
          ctx.bezierCurveTo(-s, -s * 0.5, -s, -s * 1.2, 0, -s * 0.4);
          ctx.bezierCurveTo(s, -s * 1.2, s, -s * 0.5, 0, s * 0.4);
          ctx.fill();
        } else {
          // Sparkle circle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Motion physics
        p.y += p.speedY;
        p.x += Math.sin(time + p.pulseOffset) * 0.6;
        p.rotation += p.rotSpeed;

        // Wrap around viewport
        if (p.speedY > 0 && p.y > canvas.height + 30) {
          p.y = -30;
          p.x = Math.random() * canvas.width;
        } else if (p.speedY < 0 && p.y < -30) {
          p.y = canvas.height + 30;
          p.x = Math.random() * canvas.width;
        }

        if (p.x > canvas.width + 30) p.x = -30;
        if (p.x < -30) p.x = canvas.width + 30;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [themeId]);

  const isDarkTheme = themeId === 'pichwai' || themeId === 'cinematic';

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-20" 
      style={{ mixBlendMode: isDarkTheme ? 'screen' : 'normal' }}
    />
  );
}
