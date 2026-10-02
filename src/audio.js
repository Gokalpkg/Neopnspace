// === PROCEDURAL SOUND SYNTHESIZER & SYNTHWAVE MUSIC ENGINE (WEB AUDIO API) ===
// Harici hiçbir ses dosyası indirmeden doğrudan tarayıcı/telefon çipi üzerinden 
// 0 gecikmeli ses efektleri ve dinamik Synthwave arka plan müziği üretir.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('neon_audio_muted') === 'true';
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.isBossMode = false;
    this.isBossEnraged = false;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;
    this.combatIntensity = 0;
    this.pauseFilter = null;
  }

  setCombatIntensity(level) {
    this.combatIntensity = Math.min(1.0, Math.max(0, level));
  }

  setPauseFilter(enabled) {
    if (!this.ctx || !this.musicGain) return;
    try {
      if (enabled) {
        if (!this.pauseFilter) {
          this.pauseFilter = this.ctx.createBiquadFilter();
          this.pauseFilter.type = 'lowpass';
          this.pauseFilter.frequency.value = 400;
          this.pauseFilter.Q.value = 0.7;
        }
        this.musicGain.disconnect();
        this.musicGain.connect(this.pauseFilter);
        this.pauseFilter.connect(this.masterGain);
      } else {
        if (this.pauseFilter) {
          this.musicGain.disconnect();
          this.pauseFilter.disconnect();
          this.musicGain.connect(this.masterGain);
        }
      }
    } catch (e) {}
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();

        // Ses Kanalları
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        // Performans: Paylaşımlı tek gürültü tamponu (Her patlamada yeniden buffer üretmeyi önler)
        if (!this.sharedNoiseBuffer) {
          const sr = this.ctx.sampleRate || 44100;
          this.sharedNoiseBuffer = this.ctx.createBuffer(1, sr, sr);
          const d = this.sharedNoiseBuffer.getChannelData(0);
          for (let i = 0; i < sr; i++) {
            d[i] = Math.random() * 2 - 1;
          }
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn("AudioContext init error:", e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('neon_audio_muted', this.isMuted.toString());
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // WebAudio Grafı Düğüm Temizliği (Hafıza Sızıntısı Önleyici)
  _autoDisconnect(source, ...nodes) {
    if (!source) return;
    source.onended = () => {
      try {
        source.disconnect();
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i]) nodes[i].disconnect();
        }
      } catch (e) {}
    };
  }

  // ==========================================
  // DİNAMİK PROCEDURAL SYNTHWAVE BGM
  // ==========================================
  startBGM() {
    if (this.bgmPlaying || !this.ctx) return;
    this.bgmPlaying = true;
    this.bgmStep = 0;
    this.scheduleNextBeat();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  setBossMode(isBoss) {
    this.isBossMode = isBoss;
    if (!isBoss) this.isBossEnraged = false;
  }

  setBossEnraged(isEnraged) {
    this.isBossEnraged = isEnraged;
  }

  scheduleNextBeat() {
    if (!this.bgmPlaying || !this.ctx) return;

    const tempo = this.isBossEnraged ? 152 : (this.isBossMode ? 138 : 124); // BPM (Öfke modunda hızlanan tempo)
    const actualBpm = tempo + this.combatIntensity * 25;
    const stepDuration = 60 / actualBpm / 4; // 16'lık nota süresi (sn)

    this.playSynthBeat(this.bgmStep);
    this.bgmStep = (this.bgmStep + 1) % 32;

    this.bgmTimer = setTimeout(() => {
      this.scheduleNextBeat();
    }, stepDuration * 1000);
  }

  playSynthBeat(step) {
    if (this.isMuted || !this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;

    // Bas Notaları (A minör / D minör yürüyüşü)
    // A1 = 55Hz, C2 = 65.4Hz, D2 = 73.4Hz, E2 = 82.4Hz, F2 = 87.3Hz
    const basslineNormal = [
      55, 0, 55, 55, 65.4, 0, 55, 0, 
      73.4, 0, 73.4, 0, 82.4, 0, 65.4, 82.4,
      55, 0, 55, 55, 65.4, 0, 55, 0, 
      87.3, 0, 87.3, 0, 82.4, 0, 73.4, 65.4
    ];

    const basslineBoss = [
      55, 55, 110, 55, 58.2, 58.2, 116.5, 58.2,
      55, 55, 110, 55, 51.9, 51.9, 103.8, 51.9,
      55, 55, 110, 55, 58.2, 58.2, 116.5, 58.2,
      65.4, 65.4, 130.8, 65.4, 61.7, 61.7, 123.5, 61.7
    ];

    const currentBass = this.isBossMode ? basslineBoss : basslineNormal;
    const freq = currentBass[step];

    // 1. Bas Vuruşu
    if (freq > 0) {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(this.isBossMode ? 450 : 320, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + 0.12);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        this._autoDisconnect(osc, filter, gain);
        osc.start(now);
        osc.stop(now + 0.14);
      } catch (e) {}
    }

    // 2. Siber Davul Ritimleri (Kick ve Hi-Hat)
    // Her 4 adımda bir Kick
    if (step % 4 === 0) {
      this.playSynthKick(now);
    }
    // 16'lık Hi-Hat çıtırtısı
    if (step % 2 === 0) {
      this.playSynthHiHat(now, step % 4 === 2 ? 0.05 : 0.02);
    }

    // 3. Synth Arpej Lead (Uzay Hissiyatı)
    if (step % 2 === 1) {
      const arpNotes = [220, 261.6, 329.6, 440, 523.2, 659.2, 523.2, 392];
      const note = arpNotes[(step + (this.isBossMode ? 3 : 0)) % arpNotes.length];
      this.playSynthLead(now, note);
    }
  }

  playSynthKick(now) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.09);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.musicGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  playSynthHiHat(now, volume = 0.03) {
    try {
      if (!this.sharedNoiseBuffer) return;
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.sharedNoiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      this._autoDisconnect(noise, filter, gain);
      noise.start(now);
      noise.stop(now + 0.03);
    } catch (e) {}
  }

  playSynthLead(now, freq) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.musicGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  // ==========================================
  // SES EFEKTLERİ (SFX)
  // ==========================================

  // Standart Lazer Atışı (Tok & Akıcı)
  playLaser() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.lastLaserTime && now - this.lastLaserTime < 0.045) return;
      this.lastLaserTime = now;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.1);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  // Güdümlü Mikro Füze Ateşleme (Hava İtişi)
  playMissile() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.16);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  // Patlama Sesi (Büyük & Küçük) - Sıfır GC Tahsisi ve Yüksek Performans
  playExplosion(isLarge = false) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.lastExplosionTime && now - this.lastExplosionTime < 0.04 && !isLarge) return;
      this.lastExplosionTime = now;

      const duration = isLarge ? 0.45 : 0.22;
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.sharedNoiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isLarge ? 380 : 750, now);
      filter.frequency.exponentialRampToValueAtTime(30, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(isLarge ? 0.38 : 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(noise, filter, gain);
      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {}
  }

  // Kristal / XP Toplama Çınlaması (Çift Harmonikli Kristal Çan Tınısı - Pentatonik Arpej)
  playGemPickup() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.lastGemTime && now - this.lastGemTime < 0.75) {
        this.gemPitchStep = Math.min(7, (this.gemPitchStep || 0) + 1);
      } else {
        this.gemPitchStep = 0;
      }
      this.lastGemTime = now;

      // Pentatonik Nota Basamakları (Oktav tırmanışı: do-re-mi-sol-la-do2-re2-mi2)
      const pitchScale = [1.0, 1.122, 1.26, 1.498, 1.682, 2.0, 2.245, 2.52];
      const mult = pitchScale[this.gemPitchStep];
      const dur = 0.16;

      // 1. Temel Berrak Kristal Çan Tonu (Fundamental Bell)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      const baseFreq = 1250 * mult;
      osc1.frequency.setValueAtTime(baseFreq, now);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.12, now + dur);

      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc1.connect(gain1);
      gain1.connect(this.sfxGain);
      this._autoDisconnect(osc1, gain1);
      osc1.start(now);
      osc1.stop(now + dur);

      // 2. Işıltılı Yüksek Harmonik Pırıltı (Shimmering Overtone 2.4x)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      const harmFreq = baseFreq * 2.4;
      osc2.frequency.setValueAtTime(harmFreq, now);
      osc2.frequency.exponentialRampToValueAtTime(harmFreq * 1.05, now + dur * 0.6);

      gain2.gain.setValueAtTime(0.12, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.6);

      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      this._autoDisconnect(osc2, gain2);
      osc2.start(now);
      osc2.stop(now + dur * 0.6);
    } catch (e) {}
  }

  // Hiperuzay Warp Motoru Sesi (Sub-Bass İvmelenme & Sonik Boşalma)
  playWarpDrive() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const duration = 1.3;

      // 1. Düşük frekanslı ivmelenen sub-bass osilatör
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(65, now);
      subOsc.frequency.exponentialRampToValueAtTime(540, now + duration * 0.7);
      subOsc.frequency.exponentialRampToValueAtTime(80, now + duration);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + duration * 0.7);
      filter.frequency.exponentialRampToValueAtTime(300, now + duration);

      subGain.gain.setValueAtTime(0.01, now);
      subGain.gain.linearRampToValueAtTime(0.35, now + 0.35);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      subOsc.connect(filter);
      filter.connect(subGain);
      subGain.connect(this.sfxGain);

      this._autoDisconnect(subOsc, filter, subGain);
      subOsc.start(now);
      subOsc.stop(now + duration);

      // 2. Işık hızı rüzgarı (Filtered Noise)
      if (this.sharedNoiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.sharedNoiseBuffer;

        const nFilter = this.ctx.createBiquadFilter();
        nFilter.type = 'bandpass';
        nFilter.frequency.setValueAtTime(300, now);
        nFilter.frequency.exponentialRampToValueAtTime(3500, now + duration * 0.75);
        nFilter.Q.setValueAtTime(3, now);

        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.01, now);
        nGain.gain.linearRampToValueAtTime(0.25, now + 0.4);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(this.sfxGain);

        this._autoDisconnect(noise, nFilter, nGain);
        noise.start(now);
        noise.stop(now + duration);
      }
    } catch (e) {}
  }

  // Kalkan Darbe Sesi (Metalik Enerji Vınlaması)
  playShieldHit() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // EMP Şok Dalgası Sesi (Yankılanan manyetik patlama)
  playEMP() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  // Seviye Atlama Fanfarı (Kutlama Arpeji)
  playLevelUp() {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';

        const startTime = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        this._autoDisconnect(osc, gain);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (e) {}
  }

  // Kart Seçim / Tıklama Sesi
  playCardSelect() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.setValueAtTime(1200, now + 0.04);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  // Oyuncunun Darbe Alma Sesi
  playPlayerHit() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // Boss Alarm Sesi
  playBossAlarm() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(440, now + 0.25);
      osc.frequency.linearRampToValueAtTime(220, now + 0.5);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  // Düşmana Mermi Çarpma Tok Sesi (Hitmarker Crunch)
  playHitmarker() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.lastHitmarker && now - this.lastHitmarker < 0.04) return;
    this.lastHitmarker = now;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.035);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }

  // Güçlendirme Toplama Sesi (Melodic Power-up Chime)
  playPowerup() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.15, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        this._autoDisconnect(osc, gain);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.12);
      });
    } catch (e) {}
  }

  // Nükleer Bomba Patlama Sesi (Derin Sub-bass & Şok Dalgası)
  playNuke() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.6);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {}
  }

  // Kritik Vuruş Çıtırtısı (Crisp Crit Ping)
  playCrit() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.05);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Süper Silah Evrimleşme Fanfarı (Triumphant Evolution Arpeggio)
  playEvolution() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4 -> C6 arpej
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        this._autoDisconnect(osc, gain);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } catch (e) {}
  }

  // Taktiksel Atılma / Dash Sesi (Futuristic Cyber Whoosh)
  playDash() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  // Plazma Silecek Kılıç Savurma Sesi (Wiper Plasma Slash)
  playWiperSlash() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.16);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(260, now + 0.16);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, filter, gain);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  // Mermi Saptırma / Kılıçla Mermi Yok Etme (Deflect / Parry)
  playDeflect() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.10);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.10);
    } catch (e) {}
  }

  // Kombo Serisi Sesi (Pitch-Rising Streak Synth)
  playComboStreak(combo = 1) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = 440;
      const pitchMultiplier = Math.pow(1.045, Math.min(24, combo));
      const targetFreq = baseFreq * pitchMultiplier;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(targetFreq, now);
      osc.frequency.exponentialRampToValueAtTime(targetFreq * 1.15, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // Yakın Teğet (Graze / Near-Miss) Elektrik Cızırtısı
  playGraze() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // Reaktör Çekirdeği Patlama Sesi (Deep Resonance Detonation)
  playCoreDetonate() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.7);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {}
  }

  // Şanslı Sandık Jackpot Fanfarı
  playJackpot() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5 -> E6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.25, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        this._autoDisconnect(osc, gain);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } catch (e) {}
  }

  // Kritik Vuruş ("DINK!" Metalik Tını)
  playCritHit() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1480, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // Ultimate Hazır Bildirimi (Armonik Çan)
  playUltimateReady() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [659.25, 880, 1174.66].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.06);

        gain.gain.setValueAtTime(0.3, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        this._autoDisconnect(osc, gain);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.25);
      });
    } catch (e) {}
  }

  // Ultimate Patlaması (Sonik Gök Gürültüsü + Sub Bass)
  playUltimateCast() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(24, now + 0.8);

      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {}
  }

  // Kriyojenik Dondurma Sesi (Buz Çatırtısı)
  playFreeze() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.linearRampToValueAtTime(3200, now + 0.15);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // Kaçakçı Alışveriş Sesi (Nakit Çan)
  playMerchantBuy() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [880, 1318.51].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        gain.gain.setValueAtTime(0.28, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.22);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        this._autoDisconnect(osc, gain);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.22);
      });
    } catch (e) {}
  }

  // Taktiksel Muharebe Hattı Geçiş Sesi
  playZoneShift(isFront) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = isFront ? 'sawtooth' : 'triangle';
      const startFreq = isFront ? 320 : 880;
      const endFreq = isFront ? 820 : 440;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.14);

      gain.gain.setValueAtTime(isFront ? 0.3 : 0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  // Tesla Zincirleme Yıldırım & İyon Fırtınası Sesi (Yüksek Voltaj Plazma Arkı)
  playTesla() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.lastTeslaTime && now - this.lastTeslaTime < 0.055) return;
      this.lastTeslaTime = now;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2600, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.12);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(750, now);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      this._autoDisconnect(osc, filter, gain);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }

  // Nükleer Bomba / Overload Reactor Şok Patlaması (Sub-Bass Implosion)
  playBomb() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const duration = 0.55;

      // 1. Düşük frekanslı sismik sub-bass darbesi
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + duration);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + duration);

      // 2. Gürültü patlama şoku
      if (this.sharedNoiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.sharedNoiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420, now);
        filter.frequency.exponentialRampToValueAtTime(40, now + duration);

        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.32, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(this.sfxGain);

        this._autoDisconnect(noise, filter, nGain);
        noise.start(now);
        noise.stop(now + duration);
      }
    } catch (e) {}
  }

  // Transformers / Pokemon Evrim Tarzı Jet Mekanik Dönüşüm Sesi
  playJetMorph(zone = 'mid') {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // 1. Robotik Servo Frekans Tırmanışı
      const servo = this.ctx.createOscillator();
      const servoGain = this.ctx.createGain();
      servo.type = 'triangle';

      if (zone === 'front') {
        servo.frequency.setValueAtTime(280, now);
        servo.frequency.exponentialRampToValueAtTime(1150, now + 0.12);
        servo.frequency.exponentialRampToValueAtTime(480, now + 0.22);
      } else if (zone === 'rear') {
        servo.frequency.setValueAtTime(880, now);
        servo.frequency.exponentialRampToValueAtTime(320, now + 0.18);
      } else {
        servo.frequency.setValueAtTime(420, now);
        servo.frequency.exponentialRampToValueAtTime(780, now + 0.10);
        servo.frequency.exponentialRampToValueAtTime(520, now + 0.20);
      }

      servoGain.gain.setValueAtTime(0.26, now);
      servoGain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);

      servo.connect(servoGain);
      servoGain.connect(this.sfxGain);
      this._autoDisconnect(servo, servoGain);
      servo.start(now);
      servo.stop(now + 0.23);

      // 2. Metalik Kilit ve Mandal Kenetlenme Sesi (Mechanical Latch Click)
      const latch = this.ctx.createOscillator();
      const latchGain = this.ctx.createGain();
      latch.type = 'sawtooth';
      latch.frequency.setValueAtTime(1900, now + 0.05);
      latch.frequency.exponentialRampToValueAtTime(650, now + 0.14);

      latchGain.gain.setValueAtTime(0.001, now);
      latchGain.gain.setValueAtTime(0.22, now + 0.05);
      latchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      latch.connect(latchGain);
      latchGain.connect(this.sfxGain);
      this._autoDisconnect(latch, latchGain);
      latch.start(now + 0.05);
      latch.stop(now + 0.15);
    } catch (e) {}
  }

  // Kristal Kalkan Parçalanma / Kırılma Sesi (Shatter SFX)
  playShieldBreak() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const duration = 0.32;

      // Cam şangırtısı yüksek rezonans
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2900, now);
      osc1.frequency.exponentialRampToValueAtTime(750, now + duration);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc1.connect(gain1);
      gain1.connect(this.sfxGain);
      this._autoDisconnect(osc1, gain1);
      osc1.start(now);
      osc1.stop(now + duration);

      // İkinci cam kırılma çınlaması
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(3800, now);
      osc2.frequency.exponentialRampToValueAtTime(1100, now + 0.22);
      gain2.gain.setValueAtTime(0.25, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      this._autoDisconnect(osc2, gain2);
      osc2.start(now);
      osc2.stop(now + 0.22);

      // Koruyucu bariyer düşüş gürültüsü
      if (this.sharedNoiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.sharedNoiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3200, now);
        filter.Q.setValueAtTime(3, now);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.28, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(this.sfxGain);
        this._autoDisconnect(noise, filter, nGain);
        noise.start(now);
        noise.stop(now + duration);
      }
    } catch (e) {}
  }

  // Kristal Vakumlama "Pop/Plink" Dopamin Sesi
  playCrystalPop(streak = 0) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 540 * Math.pow(1.045, Math.min(streak, 14));
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.07);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // Keskin Nişancı Elektro-Ray (Railgun) Ağır Atış Sesi
  playRailgun() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // 1. Derin Sub-Bass Patlaması
      const bass = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(220, now);
      bass.frequency.exponentialRampToValueAtTime(32, now + 0.35);

      bGain.gain.setValueAtTime(0.45, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      bass.connect(bGain);
      bGain.connect(this.sfxGain);
      this._autoDisconnect(bass, bGain);
      bass.start(now);
      bass.stop(now + 0.35);

      // 2. Yüksek Voltaj Şimşek / Ray Işıması
      const ray = this.ctx.createOscillator();
      const rGain = this.ctx.createGain();
      ray.type = 'sawtooth';
      ray.frequency.setValueAtTime(1450, now);
      ray.frequency.exponentialRampToValueAtTime(180, now + 0.28);

      rGain.gain.setValueAtTime(0.25, now);
      rGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      ray.connect(rGain);
      rGain.connect(this.sfxGain);
      this._autoDisconnect(ray, rGain);
      ray.start(now);
      ray.stop(now + 0.28);
    } catch (e) {}
  }

  // 1. Sıyırma / Graze Kıvılcım Sesi
  playGraze() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(3200, now + 0.05);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // 2. Silecek Mermi Savurma / Deflect Metalik Parri Sesi
  playDeflect() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.12);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, now);
      osc2.frequency.exponentialRampToValueAtTime(2640, now + 0.1);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.sfxGain);
      this._autoDisconnect(osc1, gain);
      this._autoDisconnect(osc2, gain);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.12);
      osc2.stop(now + 0.12);
    } catch (e) {}
  }

  // 8. Gövde Hasarı / Kalp Atışı & Statik Glitch Sesi
  playHeartbeatGlitch() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      this._autoDisconnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {}
  }
}

export const sounds = new SoundEngine();
