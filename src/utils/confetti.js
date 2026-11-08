import confetti from 'canvas-confetti';

export function triggerCelebration(effectType = 'confetti') {
  if (effectType === 'confetti') {
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#8B6F47', '#D4AF37', '#FFD700', '#FFFFFF', '#E6D5BF', '#A9825F'],
      shapes: ['square'],
      scalar: 1.1,
    });
  } else if (effectType === 'colorful') {
    confetti({
      particleCount: 110,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FF1493', '#00E5FF', '#FFD700', '#76FF03', '#FF6D00', '#9C27B0', '#FF3D00'],
      shapes: ['circle', 'square'],
      scalar: 1.15,
    });
  } else if (effectType === 'hearts') {
    let heartShape;
    try {
      if (typeof confetti.shapeFromText === 'function') {
        heartShape = confetti.shapeFromText({ text: '❤️', scalar: 2 });
      }
    } catch (e) {
      heartShape = null;
    }

    confetti({
      particleCount: 45,
      spread: 80,
      origin: { y: 0.6 },
      shapes: heartShape ? [heartShape] : ['circle'],
      colors: ['#E11D48', '#BE123C', '#FB7185', '#F43F5E', '#FDA4AF'],
      scalar: heartShape ? 2 : 1.2,
    });
  } else if (effectType === 'stars' || effectType === 'sparkles') {
    confetti({
      particleCount: 75,
      spread: 85,
      origin: { y: 0.6 },
      shapes: ['star'],
      colors: ['#FFD700', '#FFA500', '#FFE87C', '#F59E0B', '#FFFDF7'],
      scalar: 1.25,
    });
  } else if (effectType === 'dots') {
    confetti({
      particleCount: 85,
      spread: 80,
      origin: { y: 0.6 },
      shapes: ['circle'],
      colors: ['#334155', '#475569', '#64748B', '#0EA5E9', '#F43F5E', '#F59E0B', '#8B6F47'],
      scalar: 0.9,
    });
  } else if (effectType === 'petals') {
    // Flower petals fall like gentle marigold & rose petals
    const count = 40;
    const end = Date.now() + 1200;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFA500', '#FF4500', '#FFD700', '#E91E63', '#FB7185'],
        shapes: ['circle'],
        scalar: 1.25,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFA500', '#FF4500', '#FFD700', '#E91E63', '#FB7185'],
        shapes: ['circle'],
        scalar: 1.25,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  } else if (effectType === 'fireworks') {
    const duration = 1500;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      confetti({
        particleCount: 30,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2,
        },
        colors: ['#FF1493', '#00FFFF', '#FFD700', '#7FFF00', '#FF4500'],
      });
    }, 250);
  } else {
    // Fallback to confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B6F47', '#D4AF37', '#FFD700', '#FFFFFF'],
    });
  }
}
