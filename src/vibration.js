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

export const vibrate = {
  enabled: localStorage.getItem('neon_vibration_enabled') !== 'false',

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('neon_vibration_enabled', this.enabled.toString());
    return this.enabled;
  },

  // Hafif dokunma / mermi atış titreşimi
  light() {
    if (!this.enabled) return;
    try {
      if (Haptics && Haptics.impact) {
        Haptics.impact({ style: 'LIGHT' });
      } else if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch (e) {}
  },

  // Düşman vurulma / orta patlama titreşimi
  medium() {
    if (!this.enabled) return;
    try {
      if (Haptics && Haptics.impact) {
        Haptics.impact({ style: 'MEDIUM' });
      } else if ('vibrate' in navigator) {
        navigator.vibrate(25);
      }
    } catch (e) {}
  },

  // Ağır darbe / oyuncu hasarı / boss ölümü
  heavy() {
    if (!this.enabled) return;
    try { if (navigator.vibrate) navigator.vibrate([30, 20, 50]); } catch (e) {}
    try { if (window.Capacitor?.Plugins?.Haptics) window.Capacitor.Plugins.Haptics.vibrate({ duration: 80 }); } catch (e) {}
  },

  // Seviye atlama kutlama titreşimi
  success() {
    if (!this.enabled) return;
    try {
      if (Haptics && Haptics.notification) {
        Haptics.notification({ type: 'SUCCESS' });
      } else if ('vibrate' in navigator) {
        navigator.vibrate([20, 40, 20]);
      }
    } catch (e) {}
  }
};
