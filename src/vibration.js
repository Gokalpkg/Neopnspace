// === MOBİL HAPTIC / TITREŞIM GERI BILDIRIMI ===
// Capacitor Haptics veya Web Vibration API fallback

let Haptics = null;

// Dinamik olarak Capacitor Haptics'i yüklemeyi dener
try {
  import('@capacitor/haptics').then(module => {
    Haptics = module.Haptics;
  }).catch(() => {
    // Web tarayıcı ortamı fallback
  });
} catch (e) {}

function readVibrateLevel() {
  const saved = localStorage.getItem('neon_vibrate_level');
  if (saved !== null && saved !== '') return Math.max(1, Math.min(8, parseInt(saved, 10) || 8));
  return localStorage.getItem('neon_vibration_enabled') === 'false' ? 1 : 8;
}

const startVibrateLevel = readVibrateLevel();

function _getHaptics() {
  if (Haptics) return Haptics;
  if (typeof window !== 'undefined' && window.Capacitor?.Plugins?.Haptics) {
    return window.Capacitor.Plugins.Haptics;
  }
  return null;
}

export const vibrate = {
  level: startVibrateLevel,
  enabled: startVibrateLevel > 0,

  setLevel(level) {
    this.level = Math.max(1, Math.min(8, level | 0));
    this.enabled = true;
    localStorage.setItem('neon_vibrate_level', String(this.level));
    localStorage.setItem('neon_vibration_enabled', 'true');
    return this.level;
  },

  stepLevel(dir) {
    let next = this.level + dir;
    if (next < 1) next = 8;
    if (next > 8) next = 1;
    return this.setLevel(next);
  },

  toggle() {
    this.stepLevel(-1);
    return this.enabled;
  },

  _ms(base) {
    return Math.max(4, Math.round(base * (this.level / 8)));
  },

  _lastLightTime: 0,
  _lastMediumTime: 0,
  _lastHitTime: 0,

  // Mermi düşman/meteor vuruş onayı (Çok hafif, tatmin edici ve boğmayan mikro titreşim)
  hit() {
    if (!this.enabled || this.level <= 1) return;
    const now = Date.now();
    if (now - this._lastHitTime < 85) return;
    this._lastHitTime = now;
    try {
      const h = _getHaptics();
      if (h && h.impact) {
        h.impact({ style: 'LIGHT' });
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(this._ms(8));
      }
    } catch (e) {}
  },

  // Hafif dokunma / buton / arayüz titreşimi
  light() {
    const now = Date.now();
    if (now - this._lastLightTime < 70) return;
    this._lastLightTime = now;
    try {
      const h = _getHaptics();
      if (h && h.impact) {
        h.impact({ style: this.level <= 2 ? 'LIGHT' : this.level <= 5 ? 'MEDIUM' : 'HEAVY' });
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(this._ms(14));
      }
    } catch (e) {}
  },

  // Düşman vurulma / orta patlama titreşimi
  medium() {
    const now = Date.now();
    if (now - this._lastMediumTime < 90) return;
    this._lastMediumTime = now;
    try {
      const h = _getHaptics();
      if (h && h.impact) {
        h.impact({ style: this.level <= 3 ? 'LIGHT' : this.level <= 5 ? 'MEDIUM' : 'HEAVY' });
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(this._ms(28));
      }
    } catch (e) {}
  },

  // Ağır darbe / oyuncu hasarı / boss ölümü
  heavy() {
    const hit = this._ms(40);
    try {
      const h = _getHaptics();
      if (h && h.vibrate) {
        h.vibrate({ duration: this._ms(80) });
      } else if (h && h.impact) {
        h.impact({ style: 'HEAVY' });
      } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([hit, 16, this._ms(55)]);
      }
    } catch (e) {}
  },

  // Seviye atlama kutlama titreşimi
  success() {
    try {
      const h = _getHaptics();
      if (h && h.notification) {
        h.notification({ type: 'SUCCESS' });
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([this._ms(18), 30, this._ms(18)]);
      }
    } catch (e) {}
  }
};
