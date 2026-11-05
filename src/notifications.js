// ==============================================================================
// NEON GALAXY: SPACE SHOOTER - DAILY EVENT & RETENTION NOTIFICATIONS
// Zero-emoji cyberpunk notifications for daily meteor storms and supply crates.
// ==============================================================================

let LocalNotifications = null;

// Dynamically import Capacitor LocalNotifications if available
try {
  import('@capacitor/local-notifications').then(mod => {
    LocalNotifications = mod.LocalNotifications;
  }).catch(() => {
    // In desktop browser mode, local notifications gracefully no-op
  });
} catch (e) {}

const NOTIFICATION_CHANNELS = {
  DAILY_EVENTS: 'neon_daily_events'
};

// 7 Daily rotating event hooks (Zero-emoji, pure cyberpunk formatting)
const EVENT_HOOKS = [
  // Day 0 (Sunday)
  {
    tr: {
      title: '[LİDERLİK] Kozmik Lig Sıralaması Sıfırlanıyor!',
      body: 'Haftalık sıralamalar bu gece yenileniyor. Zirvedeki yerini korumak için hemen son uçuşunu yap!'
    },
    en: {
      title: '[LEAGUE] Cosmic League Season Reset Imminent!',
      body: 'Weekly rankings reset tonight. Launch your final sortie to secure the apex rank!'
    }
  },
  // Day 1 (Monday)
  {
    tr: {
      title: '[RADAR] Meteor Yağmuru Tespit Edildi!',
      body: 'Sektör 2\'ye dev asteroit fırtınası yaklaşıyor! Hemen fırla, meteorları parçala ve bol kristal topla!'
    },
    en: {
      title: '[RADAR] Meteor Shower Detected!',
      body: 'Massive asteroid storm approaching Sector 2! Launch now, smash meteors and harvest bonus crystals!'
    }
  },
  // Day 2 (Tuesday)
  {
    tr: {
      title: '[HANGAR] Günlük İkmal Sandığın Hazır!',
      body: 'Teknisyenler yeni plazma parçalarını hazırladı. Sandığını aç ve gemini güçlendir!'
    },
    en: {
      title: '[HANGAR] Daily Supply Crate Ready!',
      body: 'Technicians delivered new plasma components. Open your crate and upgrade your starship!'
    }
  },
  // Day 3 (Wednesday)
  {
    tr: {
      title: '[KEŞİF] Kristal Asteroit Kuşağı Açıldı!',
      body: 'Parıldayan nadir göktaşları radara yakalandı. Sınırlı süreyle zengin kristal madenciliği seni bekliyor!'
    },
    en: {
      title: '[RADAR] Crystal Asteroid Belt Unlocked!',
      body: 'Glittering rare meteors detected on long-range sensors. Rich crystal mining awaits you!'
    }
  },
  // Day 4 (Thursday)
  {
    tr: {
      title: '[GÜÇ] Overdrive Reaktörleri Tam Kapasite!',
      body: 'Uzay filon maksimum enerjiye ulaştı. Şimdi savaşa gir ve uzaylı sürüsünü darmadağın et!'
    },
    en: {
      title: '[POWER] Overdrive Reactors Fully Charged!',
      body: 'Your starship is at peak power. Jump into combat now and blast through the alien swarm!'
    }
  },
  // Day 5 (Friday)
  {
    tr: {
      title: '[ALARM] Bilinmeyen Amiral Gemisi Sinyali!',
      body: 'Derin uzayda devasa bir boss hareketliliği var. Avcı gemini hazırla, av başladı!'
    },
    en: {
      title: '[ALERT] Unknown Flagship Signal Detected!',
      body: 'Massive boss activity detected in deep space. Prepare your fighter, the hunt has begun!'
    }
  },
  // Day 6 (Saturday)
  {
    tr: {
      title: '[ETKİNLİK] Hafta Sonu Meteor Fırtınası Başladı!',
      body: 'Uzay boşluğunda yüksek yoğunluklu göktaşları akıyor! Parçala ve yeni rekor skorunu kır!'
    },
    en: {
      title: '[EVENT] Weekend Meteor Storm Commenced!',
      body: 'High-density asteroids streaming across deep space! Shatter them and set a new personal record!'
    }
  }
];

export class NotificationManager {
  constructor() {
    this.isInitialized = false;
    this.hasPermission = false;
  }

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (!LocalNotifications) {
      try {
        const mod = await import('@capacitor/local-notifications');
        LocalNotifications = mod.LocalNotifications;
      } catch (e) {
        return;
      }
    }

    try {
      // Create notification channel for Android 8.0+
      await LocalNotifications.createChannel({
        id: NOTIFICATION_CHANNELS.DAILY_EVENTS,
        name: 'Daily Cosmic Events',
        description: 'Daily alerts for meteor storms, supply crates and cosmic battles',
        importance: 4, // High importance
        visibility: 1, // Public
        sound: 'res_custom_sound',
        vibration: true
      });

      const check = await LocalNotifications.checkPermissions();
      this.hasPermission = check.display === 'granted';

      if (this.hasPermission) {
        this.scheduleNextDailyNotification();
      }
    } catch (e) {
      console.warn('[Notifications] Initialization notice:', e?.message || e);
    }
  }

  async requestPermissionAfterFlight(flightCount = 1) {
    if (this.hasPermission || !LocalNotifications) return;

    // Do not ask on flight 0 to protect initial onboarding flow
    if (flightCount < 1) return;

    try {
      const result = await LocalNotifications.requestPermissions();
      this.hasPermission = result.display === 'granted';
      if (this.hasPermission) {
        await this.scheduleNextDailyNotification();
      }
    } catch (e) {
      console.warn('[Notifications] Permission request error:', e);
    }
  }

  async scheduleNextDailyNotification() {
    if (!LocalNotifications || !this.hasPermission) return;

    try {
      // 1. Cancel any existing pending daily notifications to guarantee strictly 1 notification per day
      const pending = await LocalNotifications.getPending();
      if (pending && pending.notifications && pending.notifications.length > 0) {
        const ids = pending.notifications.map(n => ({ id: n.id }));
        await LocalNotifications.cancel({ notifications: ids });
      }

      // 2. Calculate the next 20:00 (8:00 PM) prime time slot
      const now = new Date();
      const target = new Date();
      target.setHours(20, 0, 0, 0); // 8:00 PM prime retention hour

      // If already past 20:00 today, schedule for 20:00 tomorrow
      if (now.getTime() >= target.getTime() - 60000) {
        target.setDate(target.getDate() + 1);
      }

      const dayOfWeek = target.getDay();
      const hook = EVENT_HOOKS[dayOfWeek] || EVENT_HOOKS[1];

      // Determine language from localStorage or default
      const lang = localStorage.getItem('neon_lang') || 'tr';
      const content = lang === 'tr' ? hook.tr : hook.en;

      // 3. Schedule the single daily notification
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1001,
            title: content.title,
            body: content.body,
            schedule: { at: target, allowWhileIdle: true },
            channelId: NOTIFICATION_CHANNELS.DAILY_EVENTS,
            smallIcon: 'ic_launcher',
            sound: undefined,
            extra: {
              type: 'daily_event',
              dayOfWeek: dayOfWeek,
              scheduledAt: target.toISOString()
            }
          }
        ]
      });

      console.log(`[Notifications] Daily event scheduled for: ${target.toLocaleString()} (${content.title})`);
    } catch (e) {
      console.warn('[Notifications] Scheduling error:', e);
    }
  }
}

export const notifications = new NotificationManager();
