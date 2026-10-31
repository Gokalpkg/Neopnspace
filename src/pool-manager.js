// =======================================================================
// 🏛️ NEON SPACE SURVIVOR - NESNE HAVUZU YÖNETİCİSİ (POOL MANAGER)
// Anayasa & Mimari Standart: Supercell / Habby - Zero GC Churn Zırhı
// Heap üzerinde nesne tahsisatını (garbage collection pause) sıfıra indirir.
// =======================================================================

// 1. KRİSTAL / XP HAVUZU (120 KAPASİTE)
export class GemPool {
  constructor(capacity = 120) {
    this.capacity = capacity;
    this.pool = [];
    this.initialized = false;
    this.GemClass = null;
  }

  init(GemClass) {
    if (this.initialized) return;
    this.GemClass = GemClass;
    this.pool = new Array(this.capacity);
    for (let i = 0; i < this.capacity; i++) {
      const g = new GemClass(0, 0, 1, true);
      g.active = false;
      g.toRemove = true;
      this.pool[i] = g;
    }
    this.initialized = true;
  }

  acquire(x = 0, y = 0, value = 1) {
    if (!this.initialized && this.GemClass) {
      this.init(this.GemClass);
    }
    if (this.pool && this.pool.length > 0) {
      for (let i = 0; i < this.pool.length; i++) {
        const g = this.pool[i];
        if (g && !g.active) {
          g.active = true;
          g.reset(x, y, value);
          return g;
        }
      }
      // Havuz tamamen doluysa ekranda var olan bir nesneyi klonlayıp bozmak yerine
      // havuzu dinamik olarak 1 adet genişletip güvenle döndürür (çift referans & ışınlanma bugını önler)
      if (this.GemClass) {
        const g = new this.GemClass(x, y, value, true);
        g.active = true;
        this.pool.push(g);
        this.capacity = this.pool.length;
        return g;
      }
    }
    if (this.GemClass) {
      return new this.GemClass(x, y, value, true);
    }
    return { active: true, x, y, value, toRemove: false };
  }

  release(gem) {
    if (!gem) return;
    gem.active = false;
    gem.toRemove = true;
  }

  releaseAll() {
    for (let i = 0; i < this.pool.length; i++) {
      const g = this.pool[i];
      if (g) {
        g.active = false;
        g.toRemove = true;
      }
    }
  }

  getActiveCount() {
    let count = 0;
    for (let i = 0; i < this.pool.length; i++) {
      if (this.pool[i] && this.pool[i].active) count++;
    }
    return count;
  }

  forEachActive(fn) {
    for (let i = 0; i < this.pool.length; i++) {
      const g = this.pool[i];
      if (g && g.active) fn(g, i);
    }
  }
}

// 2. ŞOK DALGASI HAVUZU (40 KAPASİTE)
export class ShockwavePool {
  constructor(capacity = 40) {
    this.capacity = capacity;
    this.fallbackIndex = 0;
    this.pool = new Array(capacity);
    for (let i = 0; i < capacity; i++) {
      this.pool[i] = {
        active: false,
        x: 0,
        y: 0,
        radius: 10,
        maxRadius: 110,
        speed: 5.5,
        color: '#00f0ff',
        alpha: 0
      };
    }
  }

  acquire(x, y, color = '#00f0ff', maxRadius = 110) {
    for (let i = 0; i < this.capacity; i++) {
      const sw = this.pool[i];
      if (!sw.active) {
        sw.active = true;
        sw.x = x;
        sw.y = y;
        sw.radius = 10;
        sw.maxRadius = maxRadius;
        sw.speed = Math.max(5.5, maxRadius / 18);
        sw.color = color || '#00f0ff';
        sw.alpha = 0.85;
        return sw;
      }
    }
    // Havuz taşması durumunda FIFO dairesel sırayla (round-robin) en eski şok dalgasını devral
    const fallback = this.pool[this.fallbackIndex];
    this.fallbackIndex = (this.fallbackIndex + 1) % this.capacity;
    fallback.active = true;
    fallback.x = x;
    fallback.y = y;
    fallback.radius = 10;
    fallback.maxRadius = maxRadius;
    fallback.speed = Math.max(5.5, maxRadius / 18);
    fallback.color = color || '#00f0ff';
    fallback.alpha = 0.85;
    return fallback;
  }

  release(sw) {
    if (sw) sw.active = false;
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

// 3. KAYA VE ASTEROİT ENKAZI HAVUZU (24 KAPASİTE)
export class RockDebrisPool {
  constructor(capacity = 24) {
    this.capacity = capacity;
    this.fallbackIndex = 0;
    this.pool = new Array(capacity);
    for (let i = 0; i < capacity; i++) {
      this.pool[i] = {
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rot: 0,
        rotSpeed: 0,
        alpha: 0,
        decay: 0.035,
        polygon: [
          { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
          { x: 0, y: 0 }, { x: 0, y: 0 }
        ],
        fillColor: '#334155',
        strokeColor: '#94a3b8',
        crackColor: '#38bdf8'
      };
    }
  }

  acquire(x, y, vx, vy, rot, rotSpeed, alpha, decay, template, chunkR, fillColor, strokeColor, crackColor) {
    for (let i = 0; i < this.capacity; i++) {
      const rk = this.pool[i];
      if (!rk.active) {
        return this._setupDebris(rk, x, y, vx, vy, rot, rotSpeed, alpha, decay, template, chunkR, fillColor, strokeColor, crackColor);
      }
    }
    const fallback = this.pool[this.fallbackIndex];
    this.fallbackIndex = (this.fallbackIndex + 1) % this.capacity;
    return this._setupDebris(fallback, x, y, vx, vy, rot, rotSpeed, alpha, decay, template, chunkR, fillColor, strokeColor, crackColor);
  }

  _setupDebris(rk, x, y, vx, vy, rot, rotSpeed, alpha, decay, template, chunkR, fillColor, strokeColor, crackColor) {
    rk.active = true;
    rk.x = x;
    rk.y = y;
    rk.vx = vx;
    rk.vy = vy;
    rk.rot = rot;
    rk.rotSpeed = rotSpeed;
    rk.alpha = alpha;
    rk.decay = decay;
    rk.fillColor = fillColor;
    rk.strokeColor = strokeColor;
    rk.crackColor = crackColor;

    if (template) {
      if (!rk.polygon || rk.polygon.length < template.length) {
        rk.polygon = new Array(template.length);
        for (let j = 0; j < template.length; j++) rk.polygon[j] = { x: 0, y: 0 };
      }
      for (let j = 0; j < template.length; j++) {
        if (!rk.polygon[j]) rk.polygon[j] = { x: 0, y: 0 };
        rk.polygon[j].x = template[j].x * chunkR;
        rk.polygon[j].y = template[j].y * chunkR;
      }
      rk.polygon.length = template.length;
    }
    return rk;
  }

  release(rk) {
    if (rk) rk.active = false;
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

// 4. PATLAMA ATEŞ TOPU HAVUZU (16 KAPASİTE)
export class BlastFireballPool {
  constructor(capacity = 16) {
    this.capacity = capacity;
    this.fallbackIndex = 0;
    this.pool = new Array(capacity);
    for (let i = 0; i < capacity; i++) {
      this.pool[i] = {
        active: false,
        x: 0,
        y: 0,
        radius: 0,
        maxRadius: 0,
        growSpeed: 0,
        alpha: 0,
        decay: 0.05,
        isBomb: false,
        colorCore: '#ffffff',
        colorMid: '#ff5500',
        colorOuter: '#ff0055',
        rot: 0
      };
    }
  }

  // Sıfır GC: Nesne tahsisatı oluşturmadan hem skaler hem konfigürasyon objesi kabul eder
  acquire(xOrCfg, y, radius, maxRadius, growSpeed, alpha = 1.0, decay = 0.05, isBomb = false, colorCore = '#ffffff', colorMid = '#ff5500', colorOuter = '#ff0055') {
    for (let i = 0; i < this.capacity; i++) {
      const b = this.pool[i];
      if (!b.active) {
        return this._setupFireball(b, xOrCfg, y, radius, maxRadius, growSpeed, alpha, decay, isBomb, colorCore, colorMid, colorOuter);
      }
    }
    const fallback = this.pool[this.fallbackIndex];
    this.fallbackIndex = (this.fallbackIndex + 1) % this.capacity;
    return this._setupFireball(fallback, xOrCfg, y, radius, maxRadius, growSpeed, alpha, decay, isBomb, colorCore, colorMid, colorOuter);
  }

  _setupFireball(b, xOrCfg, y, radius, maxRadius, growSpeed, alpha, decay, isBomb, colorCore, colorMid, colorOuter) {
    b.active = true;
    b.rot = 0;
    if (typeof xOrCfg === 'object' && xOrCfg !== null) {
      b.x = xOrCfg.x;
      b.y = xOrCfg.y;
      b.radius = xOrCfg.radius;
      b.maxRadius = xOrCfg.maxRadius;
      b.growSpeed = xOrCfg.growSpeed;
      b.alpha = xOrCfg.alpha ?? 1.0;
      b.decay = xOrCfg.decay ?? 0.05;
      b.isBomb = !!xOrCfg.isBomb;
      b.colorCore = xOrCfg.colorCore || '#ffffff';
      b.colorMid = xOrCfg.colorMid || '#ff5500';
      b.colorOuter = xOrCfg.colorOuter || '#ff0055';
    } else {
      b.x = xOrCfg;
      b.y = y;
      b.radius = radius;
      b.maxRadius = maxRadius;
      b.growSpeed = growSpeed;
      b.alpha = alpha ?? 1.0;
      b.decay = decay ?? 0.05;
      b.isBomb = !!isBomb;
      b.colorCore = colorCore || '#ffffff';
      b.colorMid = colorMid || '#ff5500';
      b.colorOuter = colorOuter || '#ff0055';
    }
    return b;
  }

  release(b) {
    if (b) b.active = false;
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

// 5. ENKAZ PARÇASI / SHARD HAVUZU (32 KAPASİTE)
export class ParticleDebrisPool {
  constructor(capacity = 32) {
    this.capacity = capacity;
    this.fallbackIndex = 0;
    this.pool = new Array(capacity);
    for (let i = 0; i < capacity; i++) {
      this.pool[i] = {
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 2,
        color: '#ff0055',
        alpha: 0,
        decay: 0.05,
        rot: 0,
        rotSpeed: 0
      };
    }
  }

  acquire(x, y, vx, vy, size, color, alpha = 1, decay = 0.05, rot = 0, rotSpeed = 0) {
    for (let i = 0; i < this.capacity; i++) {
      const p = this.pool[i];
      if (!p.active) {
        p.active = true;
        p.x = x;
        p.y = y;
        p.vx = vx;
        p.vy = vy;
        p.size = size;
        p.color = color;
        p.alpha = alpha;
        p.decay = decay;
        p.rot = rot;
        p.rotSpeed = rotSpeed;
        return p;
      }
    }
    const fallback = this.pool[this.fallbackIndex];
    this.fallbackIndex = (this.fallbackIndex + 1) % this.capacity;
    fallback.active = true;
    fallback.x = x;
    fallback.y = y;
    fallback.vx = vx;
    fallback.vy = vy;
    fallback.size = size;
    fallback.color = color;
    fallback.alpha = alpha;
    fallback.decay = decay;
    fallback.rot = rot;
    fallback.rotSpeed = rotSpeed;
    return fallback;
  }

  release(p) {
    if (p) p.active = false;
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

// TEKİL NESNE HAVUZU ÖRNEKLERİ (SINGLETON INSTANCES)
export const gemPool = new GemPool(120);
export const shockwavePool = new ShockwavePool(40);
export const rockDebrisPool = new RockDebrisPool(24);
export const blastFireballPool = new BlastFireballPool(16);
export const particleDebrisPool = new ParticleDebrisPool(32);

// ÇATI YÖNETİCİ NESNESİ
export const PoolManager = {
  gemPool,
  shockwavePool,
  rockDebrisPool,
  blastFireballPool,
  particleDebrisPool,
  releaseAll() {
    gemPool.releaseAll();
    shockwavePool.releaseAll();
    rockDebrisPool.releaseAll();
    blastFireballPool.releaseAll();
    particleDebrisPool.releaseAll();
  },
  getStats() {
    return {
      gems: `${gemPool.getActiveCount()} / ${gemPool.capacity}`,
      shockwaves: `${shockwavePool.getActiveCount()} / ${shockwavePool.capacity}`,
      rockDebris: `${rockDebrisPool.getActiveCount()} / ${rockDebrisPool.capacity}`,
      blastFireballs: `${blastFireballPool.getActiveCount()} / ${blastFireballPool.capacity}`,
      particleDebris: `${particleDebrisPool.getActiveCount()} / ${particleDebrisPool.capacity}`
    };
  }
};
