// ============================================================================
// 🏛️ NEON SPACE SURVIVOR — JACKPOT SANDIK AÇILIŞ KOREOGRAFİSİ (VAMPIRE SURVIVORS TARZI)
// Safkan Pixel Art (0 Blur, 0 Radial/LinearGradient, 0 Circle/Arc, Integer Math.round)
// 160 Parçacıklı Sabit Boyutlu Object Pool (Zero GC Allocation) + 5 Adımlı Milisaniyeli Akış
// ============================================================================

import { EventBus } from './events.js';
import { sounds } from './audio.js';
import { vibrate } from './vibration.js';

// Palet Döngüsü (12 FPS = her ~83.33ms'de 1 kademe)
// 3 Katmanlı Keskin Işık Sütunu: Dış (Altın Sarısı), Orta (Parlak Camgöbeği / Mor), İç (Saf Krem Beyaz)
export const PILLAR_PALETTES = [
  { outer: '#FFD700', mid: '#00F0FF', inner: '#FFFDF0' },
  { outer: '#FFBE0B', mid: '#BF5AF2', inner: '#FFFFFF' },
  { outer: '#FFA500', mid: '#38BDF8', inner: '#FEF08A' }
];

const CONFETTI_COLORS = ['#FF0055', '#05FFA1', '#BF5AF2', '#FFBE0B', '#00F0FF', '#FFD700'];

/**
 * ElasticOut eğrisi (Adım 5 Müjde Kartı oturuşu için)
 * @param {number} x - [0..1] arası ilerleme
 * @returns {number}
 */
export function elasticOut(x) {
  const t = Math.max(0, Math.min(1, x));
  if (t === 0) return 0;
  if (t === 1) return 1;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

/**
 * Adım 1 (0ms-740ms) Sandık Kenarlarından Sızan Kare Altın Pikselleri Havuzu
 * Sıfır GC tahsisatı için sabit boyutlu (32 slot) havuz.
 */
export class LeakParticlePool {
  constructor(capacity = 32) {
    this.capacity = capacity;
    this.pool = new Array(capacity);
    for (let i = 0; i < capacity; i++) {
      this.pool[i] = {
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 4,
        color: '#FFD700',
        lifeMs: 0,
        maxLifeMs: 320
      };
    }
  }

  spawn(x, y, vx, vy, size = 4, color = '#FFD700', maxLifeMs = 300) {
    for (let i = 0; i < this.capacity; i++) {
      const p = this.pool[i];
      if (!p.active) {
        p.active = true;
        p.x = Math.round(x);
        p.y = Math.round(y);
        p.vx = vx;
        p.vy = vy;
        p.size = Math.max(2, Math.round(size));
        p.color = color;
        p.lifeMs = 0;
        p.maxLifeMs = maxLifeMs;
        return p;
      }
    }
    return null;
  }

  update(dtMs, frozen = false) {
    if (frozen) return; // 60ms Hit-Stop sırasında tam donma
    const dtSec = dtMs / 1000;
    for (let i = 0; i < this.capacity; i++) {
      const p = this.pool[i];
      if (!p.active) continue;
      p.lifeMs += dtMs;
      if (p.lifeMs >= p.maxLifeMs) {
        p.active = false;
        continue;
      }
      p.x += p.vx * dtSec;
      p.y += p.vy * dtSec;
    }
  }

  releaseAll() {
    for (let i = 0; i < this.capacity; i++) {
      this.pool[i].active = false;
    }
  }

  getActiveCount() {
    let count = 0;
    for (let i = 0; i < this.capacity; i++) {
      if (this.pool[i].active) count++;
    }
    return count;
  }
}

/**
 * Adım 3 (1000ms-3200ms) Piksel Hazine Fıskiyesi Sabit Boyutlu Nesne Havuzu (160 Parçacık)
 * Sıfır `new` spam'i: tüm parçacıklar ve 3 kademeli hayalet izleri (Stepped Ghost Trail)
 * başlangıçta tek seferde tahsis edilir.
 */
export class FountainParticlePool {
  constructor(capacity = 160) {
    this.capacity = Math.max(150, capacity);
    this.pool = new Array(this.capacity);
    for (let i = 0; i < this.capacity; i++) {
      this.pool[i] = {
        active: false,
        type: 0, // 0: Pixel Coin, 1: Pixel Elmas, 2: Kare Konfeti
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        gravity: 980,
        floorY: 700,
        bounceCount: 0,
        maxBounces: 1,
        size: 6,
        color: '#FFD700',
        highlightColor: '#FFFDF0',
        alpha: 1,
        launchAngleDeg: -90,
        initialSpeed: 600,
        // 3 Kademeli Stepped Ghost Trail (Skaler tam sayı koordinatlar, dizi tahsisatı yok)
        trailX0: 0,
        trailY0: 0,
        trailX1: 0,
        trailY1: 0,
        trailX2: 0,
        trailY2: 0,
        trailStepAcc: 0
      };
    }
  }

  /**
   * Sandık ağzından -70 ile -110 derece açılarla 150+ parçacık fırlatır.
   */
  spawnBurst(originX, originY, floorY, count = 160) {
    const targetCount = Math.min(this.capacity, Math.max(150, count));
    const startX = Math.round(originX);
    const startY = Math.round(originY);
    const bottomY = Math.round(floorY);

    for (let i = 0; i < targetCount; i++) {
      const p = this.pool[i];
      p.active = true;
      p.type = i % 3; // 0: Coin, 1: Diamond, 2: Square Confetti

      // -110° ile -70° arası keskin fıskiye açısı
      const ratio = i / Math.max(1, targetCount - 1);
      const jitter = ((i * 37) % 100) / 1000 - 0.05;
      const clampedRatio = Math.max(0, Math.min(1, ratio + jitter));
      const angleDeg = -110 + clampedRatio * 40; // [-110, -70] derece
      const angleRad = (angleDeg * Math.PI) / 180;

      // Yüksek fırlatma hızı ve yerçekimi (ekran alt kenarına düşüp 1 kez sekmesi garanti)
      const speedTier = (i % 7) / 6;
      const speed = 520 + speedTier * 360; // px/s

      p.launchAngleDeg = angleDeg;
      p.initialSpeed = speed;
      p.x = startX + ((i % 5) - 2) * 3;
      p.y = startY;
      p.vx = Math.cos(angleRad) * speed;
      p.vy = Math.sin(angleRad) * speed;
      p.gravity = 1180 + (i % 4) * 95;
      p.floorY = bottomY;
      p.bounceCount = 0;
      p.maxBounces = 1;
      p.alpha = 1;

      if (p.type === 0) {
        // Pixel Coin
        p.size = 6;
        p.color = '#FFD700';
        p.highlightColor = '#FFFDF0';
      } else if (p.type === 1) {
        // Pixel Elmas
        p.size = 6;
        p.color = '#00F0FF';
        p.highlightColor = '#FFFFFF';
      } else {
        // Kare Konfeti
        p.size = 5;
        p.color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        p.highlightColor = '#FFFFFF';
      }

      // 3 Kademeli Hayalet İzi başlangıç konumu
      p.trailX0 = Math.round(p.x);
      p.trailY0 = Math.round(p.y);
      p.trailX1 = Math.round(p.x);
      p.trailY1 = Math.round(p.y);
      p.trailX2 = Math.round(p.x);
      p.trailY2 = Math.round(p.y);
      p.trailStepAcc = 0;
    }
  }

  update(dtMs) {
    const dtSec = dtMs / 1000;
    for (let i = 0; i < this.capacity; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      // 3 Kademeli Stepped Ghost Trail kaydırması (her ~24ms'de keskin piksel adımı)
      p.trailStepAcc += dtMs;
      if (p.trailStepAcc >= 24) {
        p.trailStepAcc = 0;
        p.trailX2 = p.trailX1;
        p.trailY2 = p.trailY1;
        p.trailX1 = p.trailX0;
        p.trailY1 = p.trailY0;
        p.trailX0 = Math.round(p.x);
        p.trailY0 = Math.round(p.y);
      }

      // Fizik ve Yerçekimi (Gravity)
      p.vy += p.gravity * dtSec;
      p.x += p.vx * dtSec;
      p.y += p.vy * dtSec;

      // Ekranın alt kenarında tam 1 kez sekme kuralı
      if (p.y >= p.floorY && p.vy > 0) {
        if (p.bounceCount < p.maxBounces) {
          p.y = p.floorY;
          p.vy = -Math.abs(p.vy) * 0.56;
          p.vx *= 0.88;
          p.bounceCount += 1;
        } else if (p.y > p.floorY + 48) {
          p.active = false;
        }
      }
    }
  }

  releaseAll() {
    for (let i = 0; i < this.capacity; i++) {
      this.pool[i].active = false;
      this.pool[i].bounceCount = 0;
    }
  }

  getActiveCount() {
    let count = 0;
    for (let i = 0; i < this.capacity; i++) {
      if (this.pool[i].active) count++;
    }
    return count;
  }

  getBouncedCount() {
    let count = 0;
    for (let i = 0; i < this.capacity; i++) {
      if (this.pool[i].bounceCount >= 1) count++;
    }
    return count;
  }
}

/**
 * Jackpot Sandık Açılış Koreografisi Kontrolcüsü (ChestVfxController / LegendaryChestOverlay)
 */
export class ChestVfxController {
  constructor(options = {}) {
    this.sounds = options.sounds || sounds;
    this.vibrate = options.vibrate || vibrate;
    this.eventBus = options.eventBus || EventBus;

    // Sabit Boyutlu Havuzlar (Zero GC Churn)
    this.fountainPool = new FountainParticlePool(options.poolCapacity || 160);
    this.leakPool = new LeakParticlePool(32);

    // Adım 4: 3 Adet Kademeli Kare Şok Dalgası (Stepped Pixel Shockwave) slotları
    this.shockwaves = [
      { startMs: 1200, durationMs: 900, maxHalfSize: 110, color: '#FFD700', thickness: 4, active: false, currentHalfSize: 0 },
      { startMs: 1600, durationMs: 900, maxHalfSize: 130, color: '#00F0FF', thickness: 4, active: false, currentHalfSize: 0 },
      { startMs: 2000, durationMs: 900, maxHalfSize: 150, color: '#FFFDF0', thickness: 4, active: false, currentHalfSize: 0 }
    ];

    // Adım 4: Yükselen Ödül Etrafında Dönen (+) ve (x) 8-Bit Piksel Yıldız Slotları
    this.orbitStars = [
      { shape: '+', angleOffset: 0, radius: 44, color: '#FFD700', size: 3 },
      { shape: 'x', angleOffset: Math.PI * 0.25, radius: 52, color: '#00F0FF', size: 3 },
      { shape: '+', angleOffset: Math.PI * 0.5, radius: 44, color: '#FFFDF0', size: 3 },
      { shape: 'x', angleOffset: Math.PI * 0.75, radius: 52, color: '#FFBE0B', size: 3 },
      { shape: '+', angleOffset: Math.PI, radius: 44, color: '#FFD700', size: 3 },
      { shape: 'x', angleOffset: Math.PI * 1.25, radius: 52, color: '#00F0FF', size: 3 },
      { shape: '+', angleOffset: Math.PI * 1.5, radius: 44, color: '#FFFDF0', size: 3 },
      { shape: 'x', angleOffset: Math.PI * 1.75, radius: 52, color: '#BF5AF2', size: 3 }
    ];

    this.active = false;
    this.elapsedMs = 0;
    this.step = 0;
    this.width = 360;
    this.height = 740;

    // Sandık Durumu
    this.chestX = 180;
    this.chestY = 562;
    this.chestOpen = false;
    this.tremorAmplitude = 0;
    this.tremorOffsetX = 0;
    this.tremorOffsetY = 0;
    this.squashScaleX = 1.0;
    this.squashScaleY = 1.0;
    this.isHitStop = false;

    // Adım 2: Beyaz Flaş (2 Kare) & Işık Sütunu & Ekran Sarsıntısı
    this.whiteFlashFramesRemaining = 0;
    this.pillarActive = false;
    this.paletteCycleIndex = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;

    // Adım 3: Fıskiye & Ses Zıplamaları
    this.fountainSpawned = false;
    this.fountainTickAccMs = 0;
    this.fountainTickCount = 0;

    // Adım 4: Nadir Ödül Yükselişi
    this.rewardIconX = 180;
    this.rewardIconY = 540;
    this.rewardRiseProgress = 0;
    this.starOrbitAngle = 0;

    // Adım 5: Müjde Kartı & 45° Keskin Piksel Parlaması & QoL Tap Sayacı
    this.cardScale = 0;
    this.gleamProgress = 0;
    this.tapCount = 0;
    this.revealTriggered = false;
    this.heavyImpactTriggered = false;
    this.tremorClickAccMs = 0;
    this.leakSpawnAccMs = 0;

    this.rewards = [];
    this.primaryReward = null;
    this.onClaim = null;
  }

  /**
   * Koreografiyi başlatır.
   * @param {Object} config
   */
  start(config = {}) {
    this.width = Math.round(config.width || (typeof window !== 'undefined' ? window.innerWidth : 360) || 360);
    this.height = Math.round(config.height || (typeof window !== 'undefined' ? window.innerHeight : 740) || 740);
    this.chestX = Math.round(this.width / 2);
    this.chestY = Math.round(this.height * 0.76);

    this.rewards = Array.isArray(config.rewards) && config.rewards.length > 0
      ? config.rewards
      : [config.primaryReward || { id: 'evo_supernova', name: 'SUPERNOVA CORE', stat: 'LEGENDARY', color: '#FFD700', desc: 'MAX DOPAMINE JACKPOT REWARD', isEvolution: true }];
    this.primaryReward = config.primaryReward || this.rewards[0];
    this.onClaim = typeof config.onClaim === 'function' ? config.onClaim : null;

    this.fountainPool.releaseAll();
    this.leakPool.releaseAll();

    for (let i = 0; i < this.shockwaves.length; i++) {
      this.shockwaves[i].active = false;
      this.shockwaves[i].currentHalfSize = 0;
    }

    this.active = true;
    this.elapsedMs = 0;
    this.step = 1;
    this.chestOpen = false;
    this.tremorAmplitude = 2;
    this.tremorOffsetX = 0;
    this.tremorOffsetY = 0;
    this.squashScaleX = 1.0;
    this.squashScaleY = 1.0;
    this.isHitStop = false;

    this.whiteFlashFramesRemaining = 0;
    this.pillarActive = false;
    this.paletteCycleIndex = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;

    this.fountainSpawned = false;
    this.fountainTickAccMs = 0;
    this.fountainTickCount = 0;

    this.rewardIconX = this.chestX;
    this.rewardIconY = Math.round(this.chestY - 20);
    this.rewardRiseProgress = 0;
    this.starOrbitAngle = 0;

    this.cardScale = 0;
    this.gleamProgress = 0;
    this.tapCount = 0;
    this.lastTapTimestampMs = -1000;
    this.revealTriggered = false;
    this.heavyImpactTriggered = false;
    this.tremorClickAccMs = 0;
    this.leakSpawnAccMs = 0;

    if (this.eventBus) {
      this.eventBus.emit('CHEST_VFX_STARTED', {
        primaryReward: this.primaryReward,
        rewards: this.rewards
      });
    }
  }

  /**
   * 100. Saat QoL Koruması:
   * 1. Dokunuş (Adım 1-4 sırasında): Doğrudan Adım 5'e (Ödülün tam göründüğü son kareye) anında atlar.
   * 2. Dokunuş (Adım 5'teyken): Ödülü toplayıp pencereyi kapatır.
   * Çift tetikleme koruması (touchstart + pointerdown veya aynı milisaniyede çoklu parmak):
   * @param {number} [nowMs] - İsteğe bağlı zaman damgası (test/debounce için)
   * @returns {'SKIPPED_TO_REVEAL' | 'CLAIMED_AND_CLOSED' | 'DEBOUNCED' | 'INACTIVE'}
   */
  handleTap(nowMs) {
    if (!this.active) return 'INACTIVE';

    if (typeof nowMs === 'number' && Number.isFinite(nowMs)) {
      if (nowMs - this.lastTapTimestampMs < 60) {
        return 'DEBOUNCED';
      }
      this.lastTapTimestampMs = nowMs;
    }

    this.tapCount += 1;

    if (this.elapsedMs < 3000 || this.step < 5) {
      this.skipToReveal();
      return 'SKIPPED_TO_REVEAL';
    }

    this.claimAndClose();
    return 'CLAIMED_AND_CLOSED';
  }

  /**
   * Ekran boyutu değiştiğinde (resize / orientation change) sandık ve parçacık taban hizasını günceller.
   * @param {number} viewWidth
   * @param {number} viewHeight
   */
  resize(viewWidth, viewHeight) {
    const w = Math.round(viewWidth || this.width || 360);
    const h = Math.round(viewHeight || this.height || 740);
    if (w === this.width && h === this.height) return;
    this.width = w;
    this.height = h;
    this.chestX = Math.round(w / 2);
    this.chestY = Math.round(h * 0.76);
    this.rewardIconX = this.chestX;
    if (this.elapsedMs >= 1200) {
      const startY = Math.round(this.chestY - 24);
      const targetCenterY = Math.round(this.height * 0.34);
      this.rewardIconY = Math.round(startY + (targetCenterY - startY) * this.rewardRiseProgress);
    } else {
      this.rewardIconY = Math.round(this.chestY - 20);
    }
    const newFloorY = Math.round(h - 14);
    for (let i = 0; i < this.fountainPool.capacity; i++) {
      this.fountainPool.pool[i].floorY = newFloorY;
    }
  }

  /**
   * Animasyonu anında Adım 5'e (Müjde Kartının tam açıldığı son kareye) taşır.
   */
  skipToReveal() {
    if (!this.active) return;
    this.elapsedMs = 3650;
    this.step = 5;
    this.isHitStop = false;
    this.chestOpen = true;
    this.tremorAmplitude = 0;
    this.tremorOffsetX = 0;
    this.tremorOffsetY = 0;
    this.squashScaleX = 1.0;
    this.squashScaleY = 1.0;
    this.whiteFlashFramesRemaining = 0;
    this.pillarActive = true;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
    this.rewardRiseProgress = 1.0;
    this.rewardIconX = this.chestX;
    this.rewardIconY = Math.round(this.height * 0.34);
    this.cardScale = 1.0;
    this.gleamProgress = 0.5;

    if (!this.fountainSpawned) {
      this.fountainSpawned = true;
      this.fountainPool.spawnBurst(this.chestX, this.chestY - 14, this.height - 14, 160);
      this.fountainPool.update(600);
    }

    if (!this.revealTriggered) {
      this.revealTriggered = true;
      if (this.sounds && typeof this.sounds.playLegendaryFanfare === 'function') {
        this.sounds.playLegendaryFanfare();
      }
      if (this.vibrate && typeof this.vibrate.success === 'function') {
        this.vibrate.success();
      }
      if (this.eventBus) {
        this.eventBus.emit('CHEST_VFX_REWARD_REVEAL', {
          reward: this.primaryReward,
          rewards: this.rewards,
          skipped: true
        });
      }
    }
  }

  /**
   * Ödülü toplar ve koreografi katmanını kapatır.
   */
  claimAndClose() {
    if (!this.active) return;
    this.active = false;
    const claimCallback = this.onClaim;
    this.onClaim = null;

    if (this.eventBus) {
      this.eventBus.emit('CHEST_VFX_CLAIMED', {
        reward: this.primaryReward,
        rewards: this.rewards
      });
    }

    if (typeof claimCallback === 'function') {
      claimCallback(this.rewards);
    }
  }

  reset() {
    this.active = false;
    this.fountainPool.releaseAll();
    this.leakPool.releaseAll();
    this.whiteFlashFramesRemaining = 0;
    this.isHitStop = false;
  }

  /**
   * Milisaniye bazlı koreografi güncellemesi
   * @param {number} dtMs - Geçen süre (ms)
   */
  update(dtMs = 16.667) {
    if (!this.active) return;
    const safeDtMs = Math.max(0, Number(dtMs) || 0);
    this.elapsedMs += safeDtMs;
    const t = this.elapsedMs;

    // Adım belirleme
    if (t < 800) {
      this.step = 1;
    } else if (t < 1000) {
      this.step = 2;
    } else if (t < 1200) {
      this.step = 3;
    } else if (t < 3000) {
      this.step = 4;
    } else {
      this.step = 5;
    }

    // ========================================================================
    // ADIM 1: GERİLİM (0ms - 800ms)
    // ========================================================================
    if (t < 800) {
      this.chestOpen = false;
      this.pillarActive = false;
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;

      // 740ms - 800ms: Açılmadan hemen önce dikeyde %25 ez (Squash) + 60ms Hit-Stop (Tam Donma)
      if (t >= 740) {
        this.isHitStop = true;
        this.squashScaleY = 0.75; // Dikeyde %25 ezilme
        this.squashScaleX = 1.25; // Hacim korunumu ile yatay genişleme
        this.tremorAmplitude = 0;
        this.tremorOffsetX = 0;
        this.tremorOffsetY = 0;
        this.leakPool.update(safeDtMs, true); // Hit-Stop: tam donma
        return;
      }

      this.isHitStop = false;
      this.squashScaleX = 1.0;
      this.squashScaleY = 1.0;

      // Kademeli artan titreme şiddeti: ±2px -> ±4px -> ±6px
      if (t < 250) {
        this.tremorAmplitude = 2;
      } else if (t < 500) {
        this.tremorAmplitude = 4;
      } else {
        this.tremorAmplitude = 6;
      }

      // Tam sayı piksel titreme ofseti
      const phase = Math.floor(t / 28);
      this.tremorOffsetX = (phase % 2 === 0 ? 1 : -1) * this.tremorAmplitude;
      this.tremorOffsetY = (phase % 3 === 0 ? -1 : 1) * Math.max(1, Math.round(this.tremorAmplitude * 0.5));

      // Sandık kenarlarından tek tük kare altın pikselleri sızması
      this.leakPool.update(safeDtMs, false);
      this.leakSpawnAccMs += safeDtMs;
      const leakInterval = t < 350 ? 65 : 38;
      while (this.leakSpawnAccMs >= leakInterval) {
        this.leakSpawnAccMs -= leakInterval;
        const side = (this.leakPool.getActiveCount() % 2 === 0) ? -1 : 1;
        const edgeX = this.chestX + side * (22 + ((Math.floor(t) % 14)));
        const edgeY = this.chestY - 8 + ((Math.floor(t) % 12) - 6);
        const vx = side * (18 + (Math.floor(t) % 24));
        const vy = -(38 + (Math.floor(t) % 32));
        const col = (Math.floor(t / 40) % 2 === 0) ? '#FFD700' : '#FFFDF0';
        this.leakPool.spawn(edgeX, edgeY, vx, vy, 4, col, 360);
      }

      // Hızlanan tıkırtı (selectionClick) ses & haptik kancası
      this.tremorClickAccMs += safeDtMs;
      const progress = Math.min(1, t / 740);
      const clickIntervalMs = Math.max(38, Math.round(115 - progress * 75));
      while (this.tremorClickAccMs >= clickIntervalMs) {
        this.tremorClickAccMs -= clickIntervalMs;
        if (this.sounds && typeof this.sounds.playChestTremorTick === 'function') {
          this.sounds.playChestTremorTick(progress);
        }
        if (this.vibrate && typeof this.vibrate.light === 'function') {
          this.vibrate.light();
        }
        if (this.eventBus) {
          this.eventBus.emit('CHEST_VFX_SELECTION_CLICK', {
            elapsedMs: t,
            progress,
            tremorAmplitude: this.tremorAmplitude
          });
        }
      }
      return;
    }

    // 800ms sınırı geçildiği an Hit-Stop ve Squash çözülür, Sandık patlayarak açılır
    this.isHitStop = false;
    this.squashScaleX = 1.0;
    this.squashScaleY = 1.0;
    this.tremorAmplitude = 0;
    this.tremorOffsetX = 0;
    this.tremorOffsetY = 0;
    this.chestOpen = true;
    this.pillarActive = true;
    this.leakPool.update(safeDtMs, false);

    // ========================================================================
    // ADIM 2: KIRILMA VE GÖKYÜZÜ SÜTUNU (800ms - 1000ms)
    // ========================================================================
    if (!this.heavyImpactTriggered && t >= 800) {
      this.heavyImpactTriggered = true;
      this.whiteFlashFramesRemaining = 2; // 2 kare %100 saf beyaz flaş
      if (this.sounds && typeof this.sounds.playChestHeavyImpact === 'function') {
        this.sounds.playChestHeavyImpact();
      }
      if (this.vibrate && typeof this.vibrate.heavy === 'function') {
        this.vibrate.heavy();
      }
      if (this.eventBus) {
        this.eventBus.emit('CHEST_VFX_HEAVY_IMPACT', {
          elapsedMs: t,
          whiteFlashFrames: 2
        });
      }
    }

    // Saniyede 12 kare (12 FPS = ~83.333ms) hızında Palette Cycling
    const pillarElapsed = Math.max(0, t - 800);
    this.paletteCycleIndex = Math.floor(pillarElapsed / (1000 / 12)) % PILLAR_PALETTES.length;

    // 800ms - 1000ms: Ekranı ±8px sertçe salla (tam sayı koordinatlar)
    if (t >= 800 && t < 1000) {
      const shakeStep = Math.floor((t - 800) / 16);
      this.shakeOffsetX = (shakeStep % 2 === 0 ? 8 : -8);
      this.shakeOffsetY = ((shakeStep + 1) % 2 === 0 ? 8 : -8);
    } else {
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }

    // ========================================================================
    // ADIM 3: PİKSEL HAZİNE FISKİYESİ (1000ms - 3200ms)
    // ========================================================================
    if (t >= 1000) {
      if (!this.fountainSpawned) {
        this.fountainSpawned = true;
        const floorY = Math.round(this.height - 14);
        this.fountainPool.spawnBurst(this.chestX, this.chestY - 14, floorY, this.fountainPool.capacity);
        this.fountainTickAccMs = 80; // İlk fıskiye sesini hemen tetikle
      }

      if (t <= 3200) {
        this.fountainPool.update(safeDtMs);

        // Fıskiye boyunca her 80ms'de bir artan perdeli (ascending pitch) chiptune ses/haptic
        this.fountainTickAccMs += safeDtMs;
        while (this.fountainTickAccMs >= 80) {
          this.fountainTickAccMs -= 80;
          const stepIndex = this.fountainTickCount;
          const freq = Math.round(440 * Math.pow(1.048, Math.min(32, stepIndex)));
          this.fountainTickCount += 1;

          if (this.sounds && typeof this.sounds.playFountainPitchTick === 'function') {
            this.sounds.playFountainPitchTick(stepIndex);
          }
          if (this.vibrate && typeof this.vibrate.hit === 'function') {
            this.vibrate.hit();
          }
          if (this.eventBus) {
            this.eventBus.emit('CHEST_VFX_FOUNTAIN_TICK', {
              stepIndex,
              freq,
              elapsedMs: t
            });
          }
        }
      } else {
        // 3200ms sonrasında kalan parçacıkların sönümlenmesi
        this.fountainPool.update(safeDtMs);
      }
    }

    // ========================================================================
    // ADIM 4: NADİR ÖDÜLÜN YÜKSELİŞİ (1200ms - 3000ms)
    // ========================================================================
    if (t >= 1200) {
      const riseRaw = Math.min(1, Math.max(0, (t - 1200) / 1800));
      // Yumuşak ama piksel-net yükseliş (smoothstep -> Math.round)
      this.rewardRiseProgress = riseRaw * riseRaw * (3 - 2 * riseRaw);
      const startY = Math.round(this.chestY - 24);
      const targetCenterY = Math.round(this.height * 0.34);
      this.rewardIconX = this.chestX;
      this.rewardIconY = Math.round(startY + (targetCenterY - startY) * this.rewardRiseProgress);

      // Etrafında dönen (+) ve (x) 8-bit piksel yıldızların açısı
      this.starOrbitAngle = ((t - 1200) / 1000) * 2.4;

      // 3 Adet Kademeli Kare Şok Dalgası (Stepped Pixel Shockwave) genişlemesi
      for (let i = 0; i < this.shockwaves.length; i++) {
        const sw = this.shockwaves[i];
        if (t >= sw.startMs && t <= sw.startMs + sw.durationMs) {
          sw.active = true;
          const p = (t - sw.startMs) / sw.durationMs;
          // 8px piksel adımlarıyla (stepped) büyüyen kare şok dalgası
          sw.currentHalfSize = Math.round((16 + p * (sw.maxHalfSize - 16)) / 4) * 4;
        } else {
          sw.active = false;
        }
      }
    }

    // ========================================================================
    // ADIM 5: MÜJDE KARTI VE 100. SAAT QoL KORUMASI (3000ms+)
    // ========================================================================
    if (t >= 3000) {
      if (!this.revealTriggered) {
        this.revealTriggered = true;
        if (this.sounds && typeof this.sounds.playLegendaryFanfare === 'function') {
          this.sounds.playLegendaryFanfare();
        }
        if (this.vibrate && typeof this.vibrate.success === 'function') {
          this.vibrate.success();
        }
        if (this.eventBus) {
          this.eventBus.emit('CHEST_VFX_REWARD_REVEAL', {
            reward: this.primaryReward,
            rewards: this.rewards,
            skipped: false
          });
        }
      }

      const cardProgress = Math.min(1, Math.max(0, (t - 3000) / 650));
      this.cardScale = elasticOut(cardProgress);

      // Kart üzerinden geçen 45 derecelik keskin piksel parlaması (Pixel Gleam)
      const gleamCycleMs = (t - 3000) % 1400;
      this.gleamProgress = Math.min(1, gleamCycleMs / 900);
    }
  }

  /**
   * Tüm koreografiyi Safkan Pixel Art kurallarıyla (0 Blur, 0 Gradient, 0 Arc, Integer Koordinat) çizer.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} [viewWidth]
   * @param {number} [viewHeight]
   */
  render(ctx, viewWidth, viewHeight) {
    if (!this.active || !ctx) return;

    const w = Math.round(viewWidth || this.width || 360);
    const h = Math.round(viewHeight || this.height || 740);
    if (w !== this.width || h !== this.height) {
      this.resize(w, h);
    } else {
      this.chestX = Math.round(w / 2);
      this.chestY = Math.round(h * 0.76);
    }

    ctx.save();

    // KURAL 2.1: Safkan Pixel Art — Sıfır Bulanıklık
    ctx.imageSmoothingEnabled = false;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    // 1. KATMAN: Koyu Mor/Lacivert (#141020, %85 Opaklık) Arka Plan Karartması
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#141020';
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1.0;

    // Adım 2 Ekran Sarsıntısı (±8px tam sayı ofset)
    const sx = Math.round(this.shakeOffsetX);
    const sy = Math.round(this.shakeOffsetY);
    if (sx !== 0 || sy !== 0) {
      ctx.translate(sx, sy);
    }

    // 2. KATMAN: 3 Katmanlı Keskin Piksel Işık Sütunu (Stepped Light Pillar, 800ms+)
    if (this.pillarActive && this.elapsedMs >= 800) {
      this._renderSteppedLightPillar(ctx, this.chestX, this.chestY);
    }

    // 3. KATMAN: Adım 1 Sızan Altın Pikseller & Adım 3 160 Parçacıklı Hazine Fıskiyesi
    this._renderLeakParticles(ctx);
    if (this.fountainSpawned) {
      this._renderFountainParticles(ctx);
    }

    // 4. KATMAN: Alt-Orta Noktadaki Piksel Hazine Sandığı (Titreme, %25 Squash, Açılan Kapak)
    this._renderPixelChest(ctx, this.chestX, this.chestY);

    // 5. KATMAN: Adım 4 Nadir Ödülün Yükselişi + 3 Stepped Pixel Shockwave + (+) ve (x) 8-Bit Yıldızlar
    if (this.elapsedMs >= 1200) {
      this._renderShockwaves(ctx, this.rewardIconX, this.rewardIconY);
      this._renderOrbitingPixelStars(ctx, this.rewardIconX, this.rewardIconY);
      this._renderRisingRewardIcon(ctx, this.rewardIconX, this.rewardIconY);
    }

    // 6. KATMAN: Adım 5 ElasticOut Müjde Kartı + 45 Derece Keskin Piksel Parlaması (Pixel Gleam)
    if (this.elapsedMs >= 3000) {
      this._renderRewardCard(ctx, w, h);
    }

    // 7. KATMAN: Adım 2 (800ms) 2 Kare %100 Saf Beyaz Flaş (White Flash)
    const isTimeFlash = this.elapsedMs >= 800 && this.elapsedMs < 834;
    if (this.whiteFlashFramesRemaining > 0 || isTimeFlash) {
      if (this.whiteFlashFramesRemaining > 0) {
        this.whiteFlashFramesRemaining -= 1;
      }
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-16, -16, w + 32, h + 32);
    }

    ctx.restore();
  }

  /**
   * 3 Katmanlı (Dış: Altın Sarısı, Orta: Parlak Camgöbeği/Mor, İç: Saf Krem Beyaz)
   * 12 FPS Palette Cycling Keskin Bloklu Piksel Işık Sütunu
   */
  _renderSteppedLightPillar(ctx, cx, chestY) {
    const pal = PILLAR_PALETTES[this.paletteCycleIndex % PILLAR_PALETTES.length];
    const pillarBottom = Math.round(chestY - 8);
    if (pillarBottom <= 0) return;

    // Sütun açılış genişlemesi (800ms-880ms arası keskin piksel basamaklarla tam genişliğe ulaşır)
    const openRatio = Math.min(1, Math.max(0.25, (this.elapsedMs - 800) / 80));
    const outerW = Math.max(24, Math.round((88 * openRatio) / 4) * 4);
    const midW = Math.max(16, Math.round((56 * openRatio) / 4) * 4);
    const innerW = Math.max(8, Math.round((28 * openRatio) / 4) * 4);

    const outerX = Math.round(cx - outerW / 2);
    const midX = Math.round(cx - midW / 2);
    const innerX = Math.round(cx - innerW / 2);

    // Katman 1 (Dış): Altın Sarısı Ana Blok
    ctx.fillStyle = pal.outer;
    ctx.fillRect(outerX, 0, outerW, pillarBottom);

    // Dış kenar kademeli piksel dişleri (Stepped Pixel Crenellations)
    const stepBlockH = 24;
    const stepOffset = (this.paletteCycleIndex * 8) % stepBlockH;
    for (let y = stepOffset; y < pillarBottom - stepBlockH; y += stepBlockH * 2) {
      const by = Math.round(y);
      ctx.fillRect(outerX - 6, by, 6, stepBlockH);
      ctx.fillRect(outerX + outerW, by, 6, stepBlockH);
    }

    // Katman 2 (Orta): Parlak Camgöbeği / Mor Blok
    ctx.fillStyle = pal.mid;
    ctx.fillRect(midX, 0, midW, pillarBottom);

    // Katman 3 (İç): Saf Krem Beyaz Çekirdek Blok
    ctx.fillStyle = pal.inner;
    ctx.fillRect(innerX, 0, innerW, pillarBottom);
  }

  /**
   * Adım 1: Sandık kenarlarından sızan kare altın piksellerini çizer.
   */
  _renderLeakParticles(ctx) {
    for (let i = 0; i < this.leakPool.capacity; i++) {
      const p = this.leakPool.pool[i];
      if (!p.active) continue;
      const px = Math.round(p.x);
      const py = Math.round(p.y);
      const sz = Math.round(p.size);
      ctx.fillStyle = p.color;
      ctx.fillRect(px, py, sz, sz);
    }
  }

  /**
   * Adım 3: 150+ Pixel Coin, Elmas ve Kare Konfeti + 3 Kademeli Stepped Ghost Trail çizimi
   */
  _renderFountainParticles(ctx) {
    const pool = this.fountainPool.pool;
    const cap = this.fountainPool.capacity;

    for (let i = 0; i < cap; i++) {
      const p = pool[i];
      if (!p.active) continue;

      const px = Math.round(p.x);
      const py = Math.round(p.y);
      const sz = Math.round(p.size);

      // 3 Kademeli Hayalet İzi (Stepped Ghost Trail)
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.16;
      ctx.fillRect(Math.round(p.trailX2), Math.round(p.trailY2), Math.max(2, sz - 2), Math.max(2, sz - 2));

      ctx.globalAlpha = 0.32;
      ctx.fillRect(Math.round(p.trailX1), Math.round(p.trailY1), Math.max(3, sz - 1), Math.max(3, sz - 1));

      ctx.globalAlpha = 0.55;
      ctx.fillRect(Math.round(p.trailX0), Math.round(p.trailY0), sz, sz);

      // Ana Parçacık Gövdesi (Tam Opaklık, Keskin Piksel Sanat)
      ctx.globalAlpha = 1.0;
      if (p.type === 0) {
        // Pixel Coin: Altın kare + iç dikey parlama pikseli
        ctx.fillStyle = p.color;
        ctx.fillRect(px, py, sz, sz);
        ctx.fillStyle = p.highlightColor;
        ctx.fillRect(px + 2, py + 1, 2, Math.max(2, sz - 2));
      } else if (p.type === 1) {
        // Pixel Elmas: Kademeli artı/karo piksel blokları (sıfır rotasyon bulanıklığı)
        ctx.fillStyle = p.color;
        ctx.fillRect(px + 1, py, sz - 2, sz);
        ctx.fillRect(px, py + 1, sz, sz - 2);
        ctx.fillStyle = p.highlightColor;
        ctx.fillRect(px + 2, py + 2, 2, 2);
      } else {
        // Kare Konfeti
        ctx.fillStyle = p.color;
        ctx.fillRect(px, py, sz, sz);
        ctx.fillStyle = p.highlightColor;
        ctx.fillRect(px, py, 2, 2);
      }
    }
    ctx.globalAlpha = 1.0;
  }

  /**
   * Alt-orta noktadaki 8-bit Piksel Sandığı çizer (Titreme + %25 Dikey Squash + Açık/Kapalı Kapak)
   */
  _renderPixelChest(ctx, baseX, baseY) {
    const baseW = 64;
    const baseH = 48;
    const w = Math.round(baseW * this.squashScaleX);
    const h = Math.round(baseH * this.squashScaleY);

    const cx = Math.round(baseX + this.tremorOffsetX);
    // Taban çizgisi sabit kalacak şekilde dikeyde ezilme (Squash)
    const bottomY = Math.round(baseY + baseH / 2 + this.tremorOffsetY);
    const leftX = Math.round(cx - w / 2);
    const topY = Math.round(bottomY - h);

    const bodyH = Math.round(h * 0.62);
    const lidH = Math.round(h - bodyH);
    const bodyTopY = Math.round(bottomY - bodyH);

    // Sandık Alt Gölge Bloğu
    ctx.fillStyle = '#090612';
    ctx.fillRect(leftX - 4, bottomY, w + 8, 6);

    // Sandık Gövdesi (Koyu Kızıl/Mor Ahşap + Altın Zırh Çerçevesi)
    ctx.fillStyle = '#3B1D5E';
    ctx.fillRect(leftX, bodyTopY, w, bodyH);

    // Altın Köşe ve Kenar Bordürleri
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(leftX, bodyTopY, w, 4);
    ctx.fillRect(leftX, bottomY - 4, w, 4);
    ctx.fillRect(leftX, bodyTopY, 6, bodyH);
    ctx.fillRect(leftX + w - 6, bodyTopY, 6, bodyH);

    if (!this.chestOpen) {
      // Kapalı Sandık Kapağı
      ctx.fillStyle = '#5B2E90';
      ctx.fillRect(leftX, topY, w, lidH);
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(leftX, topY, w, 4);
      ctx.fillRect(leftX, topY, 6, lidH);
      ctx.fillRect(leftX + w - 6, topY, 6, lidH);

      // Merkez Kilit Plakası
      const lockW = 14;
      const lockH = 16;
      const lockX = Math.round(cx - lockW / 2);
      const lockY = Math.round(bodyTopY - 6);
      ctx.fillStyle = '#FFFDF0';
      ctx.fillRect(lockX, lockY, lockW, lockH);
      ctx.fillStyle = '#00F0FF';
      ctx.fillRect(lockX + 4, lockY + 4, 6, 8);
    } else {
      // Açık Sandık: İçinden taşan saf beyaz/altın hazine parıltısı ve geriye açılmış kapak
      ctx.fillStyle = '#FFFDF0';
      ctx.fillRect(leftX + 6, bodyTopY - 6, w - 12, 10);
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(leftX + 4, bodyTopY - 12, w - 8, 6);

      // Geriye doğru kalkmış piksel kapak
      const openLidTopY = Math.round(topY - 14);
      ctx.fillStyle = '#4C1D95';
      ctx.fillRect(leftX + 4, openLidTopY, w - 8, Math.max(8, lidH - 2));
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(leftX + 4, openLidTopY, w - 8, 4);
    }
  }

  /**
   * Adım 4: 3 Adet Kademeli Kare Şok Dalgası (Stepped Pixel Shockwave)
   */
  _renderShockwaves(ctx, cx, cy) {
    const centerX = Math.round(cx);
    const centerY = Math.round(cy);

    for (let i = 0; i < this.shockwaves.length; i++) {
      const sw = this.shockwaves[i];
      if (!sw.active || sw.currentHalfSize <= 0) continue;

      const r = Math.round(sw.currentHalfSize);
      const t = Math.round(sw.thickness);
      const cornerCut = 8;

      ctx.fillStyle = sw.color;
      // Üst ve Alt yatay piksel blokları (köşeleri kademeli)
      ctx.fillRect(centerX - r + cornerCut, centerY - r, (r - cornerCut) * 2, t);
      ctx.fillRect(centerX - r + cornerCut, centerY + r - t, (r - cornerCut) * 2, t);
      // Sol ve Sağ dikey piksel blokları
      ctx.fillRect(centerX - r, centerY - r + cornerCut, t, (r - cornerCut) * 2);
      ctx.fillRect(centerX + r - t, centerY - r + cornerCut, t, (r - cornerCut) * 2);
      // 4 Köşe basamak pikselleri (Stepped Corner Blocks)
      ctx.fillRect(centerX - r + 4, centerY - r + 4, cornerCut, t);
      ctx.fillRect(centerX + r - 4 - cornerCut, centerY - r + 4, cornerCut, t);
      ctx.fillRect(centerX - r + 4, centerY + r - 4 - t, cornerCut, t);
      ctx.fillRect(centerX + r - 4 - cornerCut, centerY + r - 4 - t, cornerCut, t);
    }
  }

  /**
   * Adım 4: Yükselen Ödül Etrafında Dönen (+) ve (x) Şeklinde 8-Bit Piksel Yıldızlar
   */
  _renderOrbitingPixelStars(ctx, cx, cy) {
    const centerX = Math.round(cx);
    const centerY = Math.round(cy);

    for (let i = 0; i < this.orbitStars.length; i++) {
      const star = this.orbitStars[i];
      const angle = this.starOrbitAngle + star.angleOffset;
      const sx = Math.round(centerX + Math.cos(angle) * star.radius);
      const sy = Math.round(centerY + Math.sin(angle) * star.radius);
      const p = Math.round(star.size);

      ctx.fillStyle = star.color;
      if (star.shape === '+') {
        // (+) 8-bit piksel yıldız
        ctx.fillRect(sx - p * 2, sy - Math.floor(p / 2), p * 4 + 1, p);
        ctx.fillRect(sx - Math.floor(p / 2), sy - p * 2, p, p * 4 + 1);
      } else {
        // (x) 8-bit piksel yıldız (merkez + 4 çapraz piksel bloğu)
        ctx.fillRect(sx, sy, p, p);
        ctx.fillRect(sx - p, sy - p, p, p);
        ctx.fillRect(sx + p, sy - p, p, p);
        ctx.fillRect(sx - p, sy + p, p, p);
        ctx.fillRect(sx + p, sy + p, p, p);
      }
    }
  }

  /**
   * Adım 4: Işık sütununun ortasından yükselen nadir eşya/karakter ikonu
   */
  _renderRisingRewardIcon(ctx, cx, cy) {
    const x = Math.round(cx);
    const y = Math.round(cy);
    const boxSize = 40;
    const half = Math.round(boxSize / 2);
    const rewardColor = (this.primaryReward && this.primaryReward.color) || '#FFD700';

    // Dış Altın Piksel Çerçeve
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x - half - 4, y - half - 4, boxSize + 8, boxSize + 8);

    // İç Koyu Kontrast Zemin
    ctx.fillStyle = '#141020';
    ctx.fillRect(x - half, y - half, boxSize, boxSize);

    // 8-Bit Nadir Eşya / Çekirdek Amblemi
    ctx.fillStyle = rewardColor;
    ctx.fillRect(x - 10, y - 10, 20, 20);
    ctx.fillStyle = '#FFFDF0';
    ctx.fillRect(x - 6, y - 14, 12, 28);
    ctx.fillRect(x - 14, y - 6, 28, 12);
    ctx.fillStyle = '#00F0FF';
    ctx.fillRect(x - 4, y - 4, 8, 8);
  }

  /**
   * Adım 5: ElasticOut Müjde Kartı + 45 Derecelik Keskin Piksel Parlaması (Stepped Pixel Gleam)
   */
  _renderRewardCard(ctx, viewW, viewH) {
    const scale = Math.max(0.1, this.cardScale);
    const baseCardW = Math.min(300, Math.round(viewW - 36));
    const baseCardH = 196;
    const cardW = Math.max(32, Math.round(baseCardW * scale));
    const cardH = Math.max(32, Math.round(baseCardH * scale));
    const cardX = Math.round((viewW - cardW) / 2);
    const cardY = Math.round(viewH * 0.48 - cardH / 2);

    const reward = this.primaryReward || {
      name: 'EFSANEVİ ÖDÜL',
      stat: 'JACKPOT',
      desc: 'Maksimum Dopamin Nadir Sandık Ödülü',
      color: '#FFD700'
    };

    // Kart Gölge Bloğu
    ctx.fillStyle = '#07050C';
    ctx.fillRect(cardX + 6, cardY + 6, cardW, cardH);

    // Kart Dış Altın Piksel Çerçevesi
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // Kart Orta Neon Çerçevesi
    ctx.fillStyle = reward.color || '#00F0FF';
    ctx.fillRect(cardX + 4, cardY + 4, cardW - 8, cardH - 8);

    // Kart İç Koyu Zemin
    ctx.fillStyle = '#18122B';
    ctx.fillRect(cardX + 8, cardY + 8, cardW - 16, cardH - 16);

    // 45 Derecelik Keskin Piksel Parlaması (Stepped Pixel Gleam)
    this._render45DegreePixelGleam(ctx, cardX + 8, cardY + 8, cardW - 16, cardH - 16);

    // Kart Metinleri (Sadece kart yeterince açıldığında tam sayı koordinatlarla çizilir)
    if (scale >= 0.45) {
      const centerX = Math.round(viewW / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Üst Jackpot Rozeti
      ctx.fillStyle = '#FFD700';
      ctx.font = '900 12px "Rajdhani", monospace';
      ctx.fillText('[ EFSANEVİ JACKPOT ÖDÜLÜ ]', centerX, Math.round(cardY + 28));

      // Ödül Başlığı
      ctx.fillStyle = '#FFFDF0';
      ctx.font = '900 18px "Rajdhani", monospace';
      ctx.fillText(String(reward.name || 'LEGENDARY ITEM').toUpperCase(), centerX, Math.round(cardY + 62));

      // İstatistik Etiketi (Stat Pill)
      const pillW = 148;
      const pillH = 24;
      const pillX = Math.round(centerX - pillW / 2);
      const pillY = Math.round(cardY + 82);
      ctx.fillStyle = '#2D1B4E';
      ctx.fillRect(pillX, pillY, pillW, pillH);
      ctx.fillStyle = '#00F0FF';
      ctx.font = '800 13px "Rajdhani", monospace';
      ctx.fillText(String(reward.stat || '+MAX STAT'), centerX, Math.round(pillY + pillH / 2));

      // Açıklama Satırı
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '700 12px "Rajdhani", monospace';
      const descText = String(reward.desc || '').slice(0, 42);
      ctx.fillText(descText, centerX, Math.round(cardY + 130));

      // Alt QoL Dokunma İpucu
      ctx.fillStyle = '#FFD700';
      ctx.font = '800 11px "Rajdhani", monospace';
      ctx.fillText('[ TOPLAMAK İÇİN DOKUN ]', centerX, Math.round(cardY + cardH - 22));
    }
  }

  /**
   * Kart yüzeyinden 45 derecelik açıyla (dx = dy basamaklarla) geçen keskin piksel parlaması
   */
  _render45DegreePixelGleam(ctx, innerX, innerY, innerW, innerH) {
    const stepSize = 8;
    const gleamBandWidth = 24;
    const totalTravel = innerW + innerH + gleamBandWidth * 2;
    const sweepOffset = Math.round(this.gleamProgress * totalTravel) - innerH;

    ctx.fillStyle = '#FFFDF0';
    ctx.globalAlpha = 0.28;

    // 45 derece keskin basamaklar: her dikey adımda (dy = stepSize) yatay konum eşit miktarda (dx = stepSize) kayar
    for (let rowY = 0; rowY < innerH; rowY += stepSize) {
      const sliceY = Math.round(innerY + rowY);
      const sliceH = Math.min(stepSize, innerH - rowY);
      // 45° diyagonal: x = sweepOffset + rowY
      const rawSliceX = innerX + sweepOffset + rowY;
      const clampedStartX = Math.max(innerX, Math.min(innerX + innerW, Math.round(rawSliceX / stepSize) * stepSize));
      const clampedEndX = Math.max(innerX, Math.min(innerX + innerW, Math.round((rawSliceX + gleamBandWidth) / stepSize) * stepSize));
      const sliceW = clampedEndX - clampedStartX;

      if (sliceW > 0 && sliceH > 0) {
        ctx.fillRect(clampedStartX, sliceY, sliceW, sliceH);
      }
    }

    ctx.globalAlpha = 1.0;
  }
}

export const LegendaryChestOverlay = ChestVfxController;
