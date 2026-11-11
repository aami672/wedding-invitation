// Comprehensive Web Audio Synthesizer & Sound Effects Engine
// Plays authentic 320kbps Paigaam / Wishlys original MP3 soundtracks with zero-latency synthesized SFX
import { resolveAssetUrl } from './appAssets';

export const TRACK_AUDIO_FILES = {
  'modern-muse': './audio/indian-inspirational-modern.mp3',
  'eternal-love': './audio/eternal-love.mp3',
  'saffron-light': './audio/saffron-light.mp3',
  'morning-promise': './audio/morning-promise.mp3',
  'saffron-threads': './audio/saffron-threads.mp3',
  'unfolding-the-invitation': './audio/unfolding-the-invitation.mp3',
  'romantic-vows': './audio/romantic-vows.mp3',
  'piano-promise': './audio/piano-promise.mp3',
  'first-dance': './audio/first-dance.mp3',
  'mountain-vows': './audio/mountain-vows.mp3',
  'wedding-celebration': './audio/wedding-celebration.mp3',
  'sehra-bandi': './audio/sehra-bandi.mp3',
  'joyful-procession': './audio/joyful-procession.mp3',
  'bollywood-heart': './audio/bollywood-heart.mp3',
  'bollywood-nights': './audio/bollywood-nights.mp3',
  'festival-lights': './audio/festival-lights.mp3',
  'marigold-morning': './audio/marigold-morning.mp3',
  'under-the-marigold-canopy': './audio/under-the-marigold-canopy.mp3',
  'shehnai-express': './audio/shehnai-express.mp3',
  'lanterns-of-noor': './audio/lanterns-of-noor.mp3',
  'moonlit-garden': './audio/moonlit-garden.mp3',
  'haveli-lights': './audio/haveli-lights.mp3',
  'mangala-isai': './audio/mangala-isai.mp3',
  'sitar-sunrise': './audio/sitar-sunrise.mp3',
  'dhol-dance-floor': './audio/dhol-dance-floor.mp3',
};

export const TRACK_REMOTE_FILES = {
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

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.currentTrack = 'modern-muse';
    this.volume = 0.65;
    this.timerIds = [];
    this.activeNodes = [];
    this.customAudio = null;
    this.scratchNoteIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  stop() {
    this.isPlaying = false;
    this.timerIds.forEach(id => clearTimeout(id));
    this.timerIds = [];

    this.activeNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];

    if (this.customAudio) {
      try {
        this.customAudio.pause();
        this.customAudio.currentTime = 0;
      } catch (e) {}
    }
  }

  playTrack(trackId = 'modern-muse', customUrl = null) {
    this.init();
    this.stop();
    this.isPlaying = true;
    this.currentTrack = trackId;

    const resolvedCustom = customUrl ? resolveAssetUrl(customUrl) : '';
    const resolvedLocal = TRACK_AUDIO_FILES[trackId] ? resolveAssetUrl(TRACK_AUDIO_FILES[trackId]) : '';
    const targetUrl = resolvedCustom || resolvedLocal || TRACK_REMOTE_FILES[trackId];

    if (targetUrl) {
      try {
        if (!this.customAudio) {
          this.customAudio = new Audio();
        }
        this.customAudio.src = targetUrl;
        this.customAudio.volume = this.volume;
        this.customAudio.loop = true;

        const playPromise = this.customAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Primary audio playback error, trying fallback:', err);
            // If local path failed and we have remote, try remote CDN
            if (!customUrl && targetUrl === resolvedLocal && TRACK_REMOTE_FILES[trackId]) {
              this.customAudio.src = TRACK_REMOTE_FILES[trackId];
              this.customAudio.play().catch(() => {
                this.startSynthesizerTrack(trackId);
              });
            } else {
              this.startSynthesizerTrack(trackId);
            }
          });
        }
        return;
      } catch (e) {
        console.warn('Fallback to synthesizer:', e);
      }
    }

    // Start procedural melody fallback
    this.startSynthesizerTrack(trackId);
  }

  startSynthesizerTrack(trackId) {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        if (this.isPlaying) this.startSynthesizerTrack(trackId);
      }).catch(() => {});
      return;
    }

    const now = this.ctx.currentTime;

    if (trackId === 'royal-palace') {
      // Royal Palace Strings: Indian Sitar & Palace Tanpura (Raag Yaman / Bhupali)
      const sitarScale = [220.00, 246.94, 277.18, 329.63, 369.99, 440.00, 493.88, 554.37];
      let step = 0;

      const playSitarNote = () => {
        if (!this.isPlaying || !this.ctx) return;
        const t = this.ctx.currentTime;
        const freq = sitarScale[step % sitarScale.length];
        step++;

        // Sitar main oscillator (sawtooth with harmonic shimmer)
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(freq * 0.5, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2600, t);
        filter.frequency.setTargetAtTime(800, t, 0.4);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
        gain.gain.setTargetAtTime(0.0001, t + 0.05, 0.6);

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain || this.ctx.destination);

        osc.start(t);
        subOsc.start(t);
        osc.stop(t + 2.2);
        subOsc.stop(t + 2.2);

        this.activeNodes.push(osc, subOsc);
        const nextDelay = 380 + Math.random() * 260;
        this.timerIds.push(setTimeout(playSitarNote, nextDelay));
      };
      playSitarNote();

    } else if (trackId === 'saffron-light') {
      // Saffron Light: Meditative Bamboo Flute (Bansuri) & Temple Bells
      const fluteScale = [329.63, 369.99, 440.00, 493.88, 554.37, 659.25, 739.99];
      let step = 0;

      const playFluteNote = () => {
        if (!this.isPlaying || !this.ctx) return;
        const t = this.ctx.currentTime;
        const freq = fluteScale[step % fluteScale.length];
        step = (step + 1 + Math.floor(Math.random() * 2)) % fluteScale.length;

        const osc = this.ctx.createOscillator();
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        // Bansuri natural vibrato
        vibrato.type = 'sine';
        vibrato.frequency.setValueAtTime(5.2, t);
        vibratoGain.gain.setValueAtTime(3.5, t);
        vibrato.connect(osc.frequency);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.35);
        gain.gain.setTargetAtTime(0.0001, t + 0.5, 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain || this.ctx.destination);

        vibrato.start(t);
        osc.start(t);
        vibrato.stop(t + 2.8);
        osc.stop(t + 2.8);

        this.activeNodes.push(osc, vibrato);
        this.timerIds.push(setTimeout(playFluteNote, 1300));
      };
      playFluteNote();

    } else if (trackId === 'shehnai-express') {
      // Shehnai Express: Auspicious Festive Shaadi Shehnai & Dhol Pulse
      const shehnaiScale = [329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25];
      let step = 0;

      const playShehnaiNote = () => {
        if (!this.isPlaying || !this.ctx) return;
        const t = this.ctx.currentTime;
        const freq = shehnaiScale[step % shehnaiScale.length];
        step++;

        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.8, t);
        filter.Q.setValueAtTime(4.0, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.24, t + 0.05);
        gain.gain.setTargetAtTime(0.0001, t + 0.08, 0.28);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain || this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.8);

        this.activeNodes.push(osc);
        this.timerIds.push(setTimeout(playShehnaiNote, 320));
      };
      playShehnaiNote();

    } else if (trackId === 'morning-promise') {
      // Morning Promise: Gentle Neoclassical Piano & Celesta
      const chords = [
        [293.66, 369.99, 440.00, 587.33], // D Major
        [246.94, 293.66, 369.99, 493.88], // B Minor
        [196.00, 246.94, 293.66, 392.00], // G Major
        [220.00, 277.18, 329.63, 440.00], // A Major
      ];
      let chordIdx = 0;
      let noteIdx = 0;

      const playCelesta = () => {
        if (!this.isPlaying || !this.ctx) return;
        const t = this.ctx.currentTime;
        const chord = chords[chordIdx];
        const freq = chord[noteIdx];

        noteIdx++;
        if (noteIdx >= chord.length) {
          noteIdx = 0;
          chordIdx = (chordIdx + 1) % chords.length;
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.06);
        gain.gain.setTargetAtTime(0.0001, t + 0.08, 0.7);

        osc.connect(gain);
        gain.connect(this.masterGain || this.ctx.destination);

        osc.start(t);
        osc.stop(t + 2.2);

        this.activeNodes.push(osc);
        this.timerIds.push(setTimeout(playCelesta, 450));
      };
      playCelesta();

    } else if (trackId === 'dhol-dance-floor') {
      // Dhol on the Dance Floor: High-Energy Sangeet Dhol Beat & Brass
      const brassNotes = [130.81, 164.81, 196.00, 261.63, 196.00, 164.81];
      let beat = 0;

      const playDholBeat = () => {
        if (!this.isPlaying || !this.ctx) return;
        const t = this.ctx.currentTime;

        // Dhol Bass Kick
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(140, t);
        kickOsc.frequency.exponentialRampToValueAtTime(45, t + 0.15);

        kickGain.gain.setValueAtTime(0.35, t);
        kickGain.gain.setTargetAtTime(0.001, t + 0.05, 0.12);

        kickOsc.connect(kickGain);
        kickGain.connect(this.masterGain || this.ctx.destination);
        kickOsc.start(t);
        kickOsc.stop(t + 0.25);

        // Brass melody tone on every 2 beats
        if (beat % 2 === 0) {
          const brassOsc = this.ctx.createOscillator();
          const brassGain = this.ctx.createGain();
          brassOsc.type = 'sawtooth';
          brassOsc.frequency.setValueAtTime(brassNotes[(beat / 2) % brassNotes.length], t);

          brassGain.gain.setValueAtTime(0.001, t);
          brassGain.gain.linearRampToValueAtTime(0.16, t + 0.04);
          brassGain.gain.setTargetAtTime(0.0001, t + 0.06, 0.3);

          brassOsc.connect(brassGain);
          brassGain.connect(this.masterGain || this.ctx.destination);
          brassOsc.start(t);
          brassOsc.stop(t + 0.6);
          this.activeNodes.push(brassOsc);
        }

        beat++;
        this.activeNodes.push(kickOsc);
        this.timerIds.push(setTimeout(playDholBeat, 260));
      };
      playDholBeat();

    } else {
      // Default: Modern Muse (Romantic Acoustic Piano with Warm Arpeggios)
      const pianoChords = [
        [261.63, 329.63, 392.00, 523.25], // C Major
        [220.00, 261.63, 329.63, 440.00], // A Minor
        [174.61, 220.00, 261.63, 349.23], // F Major
        [196.00, 246.94, 293.66, 392.00], // G Major
      ];
      let chordIdx = 0;
      let noteInChord = 0;

      const playPiano = () => {
        if (!this.isPlaying || !this.ctx) return;
        const t = this.ctx.currentTime;
        const chord = pianoChords[chordIdx];
        const freq = chord[noteInChord];

        noteInChord++;
        if (noteInChord >= chord.length) {
          noteInChord = 0;
          chordIdx = (chordIdx + 1) % pianoChords.length;
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.04);
        gain.gain.setTargetAtTime(0.0001, t + 0.06, 0.55);

        osc.connect(gain);
        gain.connect(this.masterGain || this.ctx.destination);

        osc.start(t);
        osc.stop(t + 2.0);

        this.activeNodes.push(osc);
        this.timerIds.push(setTimeout(playPiano, 480));
      };
      playPiano();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }

  // Realistic Sound Effects & Wishlys Synthesized SFX Library
  playScratchSound() {
    this.init();
    if (!this.ctx) return;
    this.paperScratch();
    // Also play advancing melodic note
    this.playNextScratchNote();
  }

  playNextScratchNote() {
    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
    const freq = scale[this.scratchNoteIndex % scale.length];
    this.scratchNoteIndex++;
    this.playChime(freq, 0.4);
  }

  popUnlock() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(170, t);
    osc.frequency.exponentialRampToValueAtTime(560, t + 0.12);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);

    setTimeout(() => {
      this.celebrationArpeggio();
    }, 80);
  }

  celebrationArpeggio() {
    const notes = [587.33, 739.99, 880.00, 1174.66, 1479.98];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq, 0.65);
      }, idx * 75);
    });
  }

  confettiBurst() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    
    // Low thud pop
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(140, t);
    thud.frequency.exponentialRampToValueAtTime(30, t + 0.2);
    thudGain.gain.setValueAtTime(0.45, t);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    thud.connect(thudGain);
    thudGain.connect(this.masterGain || this.ctx.destination);
    thud.start(t);
    thud.stop(t + 0.26);

    // Sparkle crackles
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.playChime(1200 + Math.random() * 800, 0.18);
      }, 50 + i * 40);
    }
  }

  paperScratch() {
    this.init();
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.06);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.18;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2200;
    filter.Q.value = 1.2;
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.setTargetAtTime(0.001, t + 0.01, 0.035);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);
    noise.start();
  }

  cardOpen() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(540, t + 0.22);
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.setTargetAtTime(0.001, t + 0.06, 0.12);
    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.26);
  }

  fireworkRocket() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(2400, t + 0.35);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.setTargetAtTime(0.001, t + 0.1, 0.18);
    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.38);

    setTimeout(() => {
      this.confettiBurst();
    }, 380);
  }

  templeBell() {
    this.playChime(1046.50, 1.4);
  }

  shehnaiHorn() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.linearRampToValueAtTime(620, t + 0.25);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.setTargetAtTime(0.001, t + 0.1, 0.15);
    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  playSealBreakSound() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(170, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.16);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.setTargetAtTime(0.001, t + 0.04, 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);

    setTimeout(() => {
      this.playChime(587.33, 0.6);
    }, 110);
  }

  playBoxOpenSound() {
    this.cardOpen();
  }

  playDoorbellSound() {
    this.init();
    if (!this.ctx) return;
    this.playChime(659.25, 0.45);
    setTimeout(() => {
      this.playChime(523.25, 0.6);
    }, 380);
  }

  playChime(freq = 587.33, duration = 0.5) {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.setTargetAtTime(0.001, t + 0.05, duration * 0.4);
    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }
}

export const soundManager = new AudioEngine();
