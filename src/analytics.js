// src/analytics.js - Firebase & Game Analytics Bridge for Neon Space Survivor
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

class AnalyticsManager {
  constructor() {
    this.isNative = false;
    this.init();
  }

  async init() {
    try {
      if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform()) {
        this.isNative = true;
        await FirebaseAnalytics.setUserId({ userId: this.getOrCreateAnonymousId() });
        await FirebaseAnalytics.setUserProperty({ key: 'game_version', value: '1.4.1' });
        console.log('[Analytics] Firebase Analytics native bridge initialized.');
      } else {
        console.log('[Analytics] Web browser mode - analytics active in local logger.');
      }
    } catch (err) {
      console.warn('[Analytics] Init warning:', err);
    }
  }

  getOrCreateAnonymousId() {
    try {
      let id = localStorage.getItem('neon_analytics_uid');
      if (!id) {
        id = 'pilot_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
        localStorage.setItem('neon_analytics_uid', id);
      }
      return id;
    } catch (e) {
      return 'pilot_anon';
    }
  }

  async logEvent(name, params = {}) {
    try {
      // Sanitize params for Firebase (keys alphanumeric, max length 40, values strings/numbers)
      const cleanParams = {};
      for (const [key, val] of Object.entries(params)) {
        const cleanKey = key.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 40);
        if (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') {
          cleanParams[cleanKey] = val;
        } else if (val !== null && val !== undefined) {
          cleanParams[cleanKey] = String(val).slice(0, 100);
        }
      }

      if (this.isNative) {
        await FirebaseAnalytics.logEvent({ name, params: cleanParams });
      } else {
        // console.debug(`[Analytics:${name}]`, cleanParams);
      }
    } catch (err) {
      // Analytics should never crash the game
      console.warn(`[Analytics] Error logging ${name}:`, err);
    }
  }

  // Common Game Event Helpers
  logGameStart(mode, shipId, pilotId, playerLevel) {
    this.logEvent('game_start', {
      game_mode: mode || 'classic',
      ship_id: shipId || 'cyberpunk',
      pilot_id: pilotId || 'rookie',
      player_level: Number(playerLevel) || 1
    });
  }

  logGameOver(mode, score, durationSec, wave, killer) {
    this.logEvent('game_over', {
      game_mode: mode || 'classic',
      score: Math.round(Number(score) || 0),
      duration_sec: Math.round(Number(durationSec) || 0),
      wave: Number(wave) || 1,
      killer_type: String(killer || 'hazard').slice(0, 30)
    });
  }

  logLevelVictory(level, score, durationSec, gems) {
    this.logEvent('level_victory', {
      level: Number(level) || 1,
      score: Math.round(Number(score) || 0),
      duration_sec: Math.round(Number(durationSec) || 0),
      gems_earned: Number(gems) || 0
    });
  }

  logBossEncounter(bossType, level) {
    this.logEvent('boss_encounter', {
      boss_type: String(bossType || 'unknown'),
      level: Number(level) || 1
    });
  }

  logBossDefeated(bossType, durationSec) {
    this.logEvent('boss_defeated', {
      boss_type: String(bossType || 'unknown'),
      duration_sec: Math.round(Number(durationSec) || 0)
    });
  }

  logWeaponEvolution(fusionId, name) {
    this.logEvent('weapon_evolution', {
      fusion_id: String(fusionId),
      fusion_name: String(name || fusionId)
    });
  }

  logReviveUsed(type) {
    this.logEvent('revive_used', {
      revive_type: String(type || 'ad')
    });
  }

  logWheelSpin(prizeType, amount) {
    this.logEvent('lucky_wheel_spin', {
      prize_type: String(prizeType || 'crystals'),
      amount: Number(amount) || 0
    });
  }

  logShipUnlock(shipId, cost) {
    this.logEvent('ship_unlocked', {
      ship_id: String(shipId),
      cost_crystals: Number(cost) || 0
    });
  }

  logFtueClaimed(crystals) {
    this.logEvent('ftue_briefing_claimed', {
      bonus_crystals: Number(crystals) || 500
    });
  }

  logNoAdsPurchased() {
    this.logEvent('no_ads_purchased', {
      item_id: 'neon_remove_ads',
      timestamp: Date.now()
    });
  }
}

export const analytics = new AnalyticsManager();
export default analytics;
