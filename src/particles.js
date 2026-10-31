// === GÖRSEL EFEKTLER & KOZMİK PARÇACIK MOTORU ===
import { shockwavePool, rockDebrisPool, blastFireballPool, particleDebrisPool } from './pool-manager.js';

export class ParticleSystem {
  constructor() {
    // Sabit Boyutlu Nesne Havuzu (Object Pooling - 0 Heap Allocation)
    this.maxParticles = 420;
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        active: false,
        x: 0, y: 0, vx: 0, vy: 0,
        radius: 1, isPixel: false,
        color: '#ffffff', alpha: 0, decay: 0.05
      });
    }

    this.floatingTexts = [];
    this.shockwaves = shockwavePool.pool;
    this.stars = [];
    this.nebulae = [];
    this.lightnings = [];
    this.shards = particleDebrisPool.pool;
    this.blastFireballs = blastFireballPool.pool;
    this.rockDebris = rockDebrisPool.pool;
    this.glitchTimer = 0;
    this.currentSector = 'void';
    this.bgBase = '#070B19';
    this.sectorEmbers = [];
    this.auroraTime = 0;
    this.warpTimer = 0;
    this.hitstopTimer = 0;
    this.screenFlashAlpha = 0;
    this.screenFlashColor = '#ffffff';
    this.chromaticPulse = 0;
  }

  // Havuzdan Sıfır GC Tahsisatıyla Partikül Çekme
  _allocParticle(cfg) {
    let p = null;
    for (let i = 0; i < this.particles.length; i++) {
      if (!this.particles[i].active) {
        p = this.particles[i];
        break;
      }
    }
    if (!p) {
      if (this.particles.length < 460) {
        p = { active: false };
        this.particles.push(p);
      } else {
        p = this.particles[0]; // Havuz doluysa en eskisini ezerek geri dönüştür
      }
    }
    p.active = true;
    p.x = cfg.x;
    p.y = cfg.y;
    p.vx = cfg.vx;
    p.vy = cfg.vy;
    p.radius = cfg.radius;
    p.isPixel = !!cfg.isPixel;
    p.color = cfg.color;
    p.alpha = cfg.alpha !== undefined ? cfg.alpha : 1.0;
    p.decay = cfg.decay;
    return p;
  }

  getActiveParticleCount() {
    let count = 0;
    for (let i = 0; i < this.particles.length; i++) {
      if (this.particles[i].active) count++;
    }
    return count;
  }

  // 3 Katmanlı Dinamik Parallaks Yıldız Zemin & Kozmik Nebulalar
  initStars(width, height) {
    this.stars = [];
    // Katman 1: Derin uzay minik yıldızları (yavaş, soluk)
    const countL1 = Math.min(80, Math.floor((width * height) / 14000));
    for (let i = 0; i < countL1; i++) {
      this.stars.push({
        layer: 1,
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.2 + Math.random() * 0.4,
        size: 0.9,
        color: '#64748b',
        baseAlpha: 0.25 + Math.random() * 0.35,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    // Katman 2: Orta hat renkli siber yıldızlar
    const countL2 = Math.min(65, Math.floor((width * height) / 16000));
    for (let i = 0; i < countL2; i++) {
      this.stars.push({
        layer: 2,
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.6 + Math.random() * 1.1,
        size: 1.5,
        color: Math.random() < 0.35 ? '#00f0ff' : (Math.random() < 0.6 ? '#a855f7' : '#38bdf8'),
        baseAlpha: 0.4 + Math.random() * 0.5,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    // Katman 3: Yakın ön plan parlak retro-pixel yıldızlar ve kozmik tozlar
    const countL3 = Math.min(32, Math.floor((width * height) / 30000));
    for (let i = 0; i < countL3; i++) {
      this.stars.push({
        layer: 3,
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 1.4 + Math.random() * 1.8,
        size: 3,
        color: Math.random() < 0.35 ? '#ffbe0b' : (Math.random() < 0.65 ? '#ffffff' : '#00f0ff'),
        baseAlpha: 0.75 + Math.random() * 0.25,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    this.nebulae = [
      { x: width * 0.25, y: height * 0.2, radius: Math.min(width * 0.45, 180), vy: 0.12, color: 'rgba(147, 51, 234, 0.08)' },
      { x: width * 0.8, y: height * 0.65, radius: Math.min(width * 0.5, 210), vy: 0.08, color: 'rgba(6, 182, 212, 0.07)' },
      { x: width * 0.5, y: -80, radius: Math.min(width * 0.38, 160), vy: 0.15, color: 'rgba(236, 72, 153, 0.06)' }
    ];
  }

  // Patlama Kıvılcımları (Mobil 60fps Optimize & Sıfır GC Havuzlama)
  spawnHitSparks(x, y, dx, dy, color = '#ffffff') {
    const count = this.getActiveParticleCount() > 60 ? 3 : 5;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 0.85;
      const px = ux + (-uy * spread);
      const py = uy + (ux * spread);
      const speed = 1.15 + Math.random() * 1.5;
      this._allocParticle({
        x,
        y,
        vx: px * speed,
        vy: py * speed,
        radius: 1.05 + Math.random() * 1.05,
        isPixel: true,
        color: i === 0 ? '#ffffff' : color,
        alpha: 1,
        decay: 0.09 + Math.random() * 0.04
      });
    }
  }

  spawnExplosion(x, y, color = '#ff0077', count = 10, maxSpeed = 3.5) {
    const active = this.getActiveParticleCount();
    if (active > 70) {
      count = Math.min(count, 3);
    } else {
      count = Math.min(count, 8);
    }
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * maxSpeed;
      this._allocParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.2 + Math.random() * 2.0,
        isPixel: Math.random() < 0.6,
        color,
        alpha: 1,
        decay: 0.035 + Math.random() * 0.04
      });
    }
  }

  // 7. Düşman Patlamalarında Parça Saçılması (Debris & Shards - 0 GC Havuz Tahsisi)
  spawnDebris(x, y, color = '#ff0055', count = 4) {
    if (particleDebrisPool.getActiveCount() >= 25) return;
    const finalCount = Math.min(count, 6);
    for (let i = 0; i < finalCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.4 + Math.random() * 2.6;
      particleDebrisPool.acquire(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        1.8 + Math.random() * 2.2,
        color,
        1,
        0.045 + Math.random() * 0.03
      );
    }
  }

  // Meteor / Taş Parçalanma Patlama Animasyonu (Birden yok olmayı önleyen organik parçalanma)
  // Optimize Edilmiş Kaya Poligon Şablonları (Sıfır GC Tahsisi)
  static _CHUNK_SHAPES = [
    [{ x: 0.85, y: -0.5 }, { x: 0.95, y: 0.4 }, { x: 0.1, y: 0.9 }, { x: -0.85, y: 0.45 }, { x: -0.6, y: -0.7 }],
    [{ x: 0.6, y: -0.8 }, { x: 0.9, y: 0.2 }, { x: 0.4, y: 0.85 }, { x: -0.7, y: 0.6 }, { x: -0.9, y: -0.3 }],
    [{ x: 0.75, y: -0.6 }, { x: 0.85, y: 0.5 }, { x: -0.2, y: 0.95 }, { x: -0.9, y: 0.2 }, { x: -0.5, y: -0.8 }]
  ];

  spawnAsteroidBreakAnimation(x, y, radius = 25, isBomb = false, theme = null) {
    // 1. Ekran dışı patlama koruması (Ekranın dışındaki taşlar için ağır parçacık üretme)
    const maxW = (this.width || (typeof window !== 'undefined' ? window.innerWidth : 600)) + 60;
    const maxH = (this.height || (typeof window !== 'undefined' ? window.innerHeight : 1000)) + 60;
    if (x < -60 || x > maxW || y < -60 || y > maxH) return;

    const r = Math.max(14, radius);
    const isPurple = theme === 'purple';
    const activeFireballs = blastFireballPool.getActiveCount();
    const activeDebris = rockDebrisPool.getActiveCount();

    // 1. Ateş Topu Patlaması (Havuz doluluğuna göre bütçelenir - 0 GC)
    if (activeFireballs < 12) {
      const baseCore = '#ffffff';
      let baseMid = isBomb ? '#ffbe0b' : '#38bdf8';
      let baseOuter = isBomb ? '#ff3d00' : '#475569';
      if (isPurple) {
        baseMid = '#e879f9';
        baseOuter = '#a855f7';
      }

      blastFireballPool.acquire(
        x,
        y,
        r * 0.4,
        r * (isBomb || isPurple ? 2.2 : 1.6),
        isBomb || isPurple ? 4.2 : 2.8,
        1.0,
        isBomb || isPurple ? 0.038 : 0.052,
        isBomb || isPurple,
        baseCore,
        baseMid,
        baseOuter
      );

      // Bomba ise tek bir hafif ikincil halka (Performansı boğmamak için 3 yerine 1 adet - 0 GC)
      if (isBomb && activeFireballs < 8) {
        blastFireballPool.acquire(
          x + (Math.random() - 0.5) * r * 0.4,
          y + (Math.random() - 0.5) * r * 0.4,
          r * 0.25,
          r * 1.5,
          3.0,
          0.85,
          0.045,
          true,
          '#ffe600',
          '#ff3d00',
          '#7c2d12'
        );
      }
    }

    // 2. Parçalanan Kaya Blokları (Zincirleme patlamalarda kasmayı önleyen dinamik bütçe - 0 GC)
    if (activeDebris >= 24) return;

    let chunkCount = Math.max(3, Math.min(6, Math.round(r * 0.22)));
    if (activeDebris > 14) chunkCount = Math.min(chunkCount, 2);

    let fillCol = isBomb ? '#5c122a' : '#334155';
    let strokeCol = isBomb ? '#ff0055' : '#94a3b8';
    let crackCol = isBomb ? '#ffe600' : '#38bdf8';
    if (isPurple) {
      fillCol = '#3b0764';
      strokeCol = '#c084fc';
      crackCol = '#f0abfc';
    }

    const shapes = ParticleSystem._CHUNK_SHAPES;
    for (let i = 0; i < chunkCount; i++) {
      const angle = (i * (Math.PI * 2 / chunkCount)) + (Math.random() - 0.5) * 0.4;
      const speed = 1.8 + Math.random() * 2.8;
      const rotSpeed = (Math.random() - 0.5) * 0.22;
      const chunkR = Math.max(6, Math.min(14, (r * 0.35) + Math.random() * 2.5));
      const template = shapes[i % shapes.length];

      rockDebrisPool.acquire(
        x + Math.cos(angle) * (r * 0.3),
        y + Math.sin(angle) * (r * 0.3),
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        Math.random() * Math.PI * 2,
        rotSpeed,
        1.0,
        0.032 + Math.random() * 0.015,
        template,
        chunkR,
        fillCol,
        strokeCol,
        crackCol
      );
    }

    // 3. Genişleyen Duman Püskürmeleri ve Kızgın Közler (Dinamik Yük Dengeleme)
    const activeDust = this.getActiveParticleCount();
    const dustCount = activeDust > 90 ? Math.min(3, Math.round(r * 0.12)) : (activeDust > 50 ? Math.min(6, Math.round(r * 0.22)) : Math.min(14, Math.round(r * 0.45)));
    for (let i = 0; i < dustCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 2.8;
      this._allocParticle({
        x: x + Math.cos(angle) * (r * 0.3),
        y: y + Math.sin(angle) * (r * 0.3),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3.5 + Math.random() * 4.5,
        isPixel: Math.random() < 0.4,
        color: isBomb ? (Math.random() < 0.5 ? '#ff4d00' : '#ffbe0b') : (Math.random() < 0.5 ? '#94a3b8' : '#64748b'),
        alpha: 0.95,
        decay: 0.038 + Math.random() * 0.025
      });
    }
  }

  // 1. Sıyırma / Graze Elektrik Kıvılcımları
  spawnGrazeSparks(x, y) {
    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 2.2;
      this._allocParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.4,
        isPixel: true,
        color: '#00f0ff',
        alpha: 1,
        decay: 0.09
      });
    }
  }

  // 8. Zarif Kokpit Çatlağı / Statik Glitch Efekti
  triggerGlitch(duration = 14) {
    this.glitchTimer = duration;
  }

  // Motor İtiş Alevi (Kuantize Retro-Pixel İtki Közleri)
  spawnThruster(x, y, color = '#00f0ff') {
    if (this.getActiveParticleCount() > 75) return;
    this._allocParticle({
      x: Math.round(x + (Math.random() * 6 - 3)),
      y: Math.round(y),
      vx: (Math.random() - 0.5) * 1.2,
      vy: 3.5 + Math.random() * 4,
      radius: 3.5,
      isPixel: true,
      color,
      alpha: 0.95,
      decay: 0.085
    });
  }

  // İkiz Art Yakıcı Alevi (Afterburner - Yüksek hızlı manevra ve hücum itişi)
  spawnAfterburner(x, y, color = '#38bdf8') {
    if (this.getActiveParticleCount() > 120) return;
    this._allocParticle({
      x: Math.round(x + (Math.random() * 4 - 2)),
      y: Math.round(y),
      vx: (Math.random() - 0.5) * 1.8,
      vy: 6.5 + Math.random() * 5.0,
      radius: 4.2,
      isPixel: true,
      color: Math.random() < 0.45 ? '#ffffff' : color,
      alpha: 1.0,
      decay: 0.09
    });
  }

  // Şok Dalgası (40 Kapasiteli Havuz - 0 GC Tahsisi)
  spawnShockwave(x, y, color = '#00f0ff', maxRadius = 110) {
    if (maxRadius < 14) return;
    shockwavePool.acquire(x, y, color, maxRadius);
  }

  // Tesla Zincirleme Yıldırım Arkı (Elektrik Arkı)
  spawnLightning(x1, y1, x2, y2, color = '#00f0ff', segments = 5) {
    const points = [{ x: x1, y: y1 }];
    const dx = (x2 - x1) / segments;
    const dy = (y2 - y1) / segments;
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const jagged = Math.min(22, dist * 0.18);

    for (let i = 1; i < segments; i++) {
      const px = x1 + dx * i + (Math.random() - 0.5) * jagged;
      const py = y1 + dy * i + (Math.random() - 0.5) * jagged;
      points.push({ x: px, y: py });
    }
    points.push({ x: x2, y: y2 });

    this.lightnings.push({
      points,
      color,
      alpha: 1.0,
      width: 2.2,
      decay: 0.12
    });
  }

  // Uçuşan Yazılar (Kritik Vuruş, Hasar, Şok ve Seviye Popupları - Sıkı limitli, sıfır gecikme)
  spawnFloatingText(x, y, text, color = '#ffbe0b', size = 14) {
    if (this.floatingTexts.length >= 10) {
      this.floatingTexts.shift();
    }
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      size,
      alpha: 1.0,
      vy: -1.6,
      decay: 0.035
    });
  }

  // Sektör Değiştir (Aşama Temaları)
  setSector(sectorId, width = window.innerWidth, height = window.innerHeight) {
    this.currentSector = sectorId;
    this.sectorEmbers = [];
    this.nebulae = [];

    if (sectorId === 'magma') {
      this.bgBase = '#130303';
      const colors = ['#ff5500', '#ffbe0b', '#ff3d00', '#ffffff', '#ffe600'];
      for (let star of this.stars) {
        star.color = colors[Math.floor(Math.random() * colors.length)];
      }
    } else if (sectorId === 'toxic') {
      this.bgBase = '#021208';
      const colors = ['#05ffa1', '#10b981', '#a7f3d0', '#00f0ff', '#ffffff'];
      for (let star of this.stars) {
        star.color = colors[Math.floor(Math.random() * colors.length)];
      }
    } else if (sectorId === 'quantum') {
      this.bgBase = '#08031b';
      const colors = ['#d8b4fe', '#00f0ff', '#f472b6', '#ffffff', '#c084fc'];
      for (let star of this.stars) {
        star.color = colors[Math.floor(Math.random() * colors.length)];
      }
    } else {
      // Varsayılan: 'void' (Siber Neon Boşluğu - THEME_PALETTE.bgDeepSpace)
      this.bgBase = '#070B19';
      const colors = ['#00f0ff', '#ff0077', '#ffbe0b', '#ffffff'];
      for (let star of this.stars) {
        star.color = colors[Math.floor(Math.random() * colors.length)];
      }
    }
  }

  // Hiperuzay Warp Hızını Başlat
  startWarp(duration = 85) {
    this.warpTimer = duration;
  }

  // Kuantum Kutup Işıkları (Aurora Ribbons) Çizimi (Yüksek Performans)
  renderAuroras(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    this.auroraTime = (this.auroraTime || 0) + 0.012;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const bands = [
      { y: height * 0.20, color: 'rgba(168, 85, 247, 0.08)', freq: 0.005, amp: 26, speed: 1.0 },
      { y: height * 0.42, color: 'rgba(217, 70, 239, 0.07)', freq: 0.004, amp: 30, speed: 0.75 },
      { y: height * 0.64, color: 'rgba(56, 189, 248, 0.06)', freq: 0.0045, amp: 22, speed: 1.1 }
    ];

    for (let band of bands) {
      ctx.beginPath();
      ctx.moveTo(0, band.y);
      for (let x = 0; x <= width; x += 32) {
        const y = band.y + Math.sin(x * band.freq + this.auroraTime * band.speed) * band.amp
                         + Math.cos(x * 0.002 - this.auroraTime * 0.4) * 12;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, band.y + 55);
      ctx.lineTo(0, band.y + 55);
      ctx.closePath();
      ctx.fillStyle = band.color;
      ctx.fill();
    }
    ctx.restore();
  }

  // Ekran Flaş Darbesi (Kritik darbe & Boss ölümü - Epilepsi dostu yumuşak parlama)
  triggerFlash(color = '#ffffff', alpha = 0.25) {
    this.screenFlashColor = color;
    const safeAlpha = Math.min(alpha, 0.20);
    this.screenFlashAlpha = Math.max(this.screenFlashAlpha, safeAlpha);
  }

  // Hitstop (Vuruş Mikro Donması)
  triggerHitstop(frames = 3) {
    this.hitstopTimer = Math.max(this.hitstopTimer, frames);
  }

  // Kromatik Sapma Darbesi
  triggerChromatic(amount = 8) {
    this.chromaticPulse = Math.max(this.chromaticPulse, amount);
  }

  // Efektleri Güncelle
  update(width, height, dt = 1.0) {
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      dt *= 0.3; // Hitstop sırasında parçacıklar ve kozmik efektler donmaz, sinematik akış korunur
    }

    if (this.warpTimer > 0) {
      this.warpTimer -= dt;
      if (this.warpTimer < 0) this.warpTimer = 0;
    }

    if (this.screenFlashAlpha > 0) {
      this.screenFlashAlpha -= 0.05 * dt;
      if (this.screenFlashAlpha < 0) this.screenFlashAlpha = 0;
    }

    if (this.chromaticPulse > 0) {
      this.chromaticPulse -= 0.6 * dt;
      if (this.chromaticPulse < 0) this.chromaticPulse = 0;
    }

    // Nebulaları kaydır
    const nebSpeedMult = this.warpTimer > 0 ? 4.0 : 1.0;
    for (let neb of this.nebulae) {
      neb.y += neb.vy * nebSpeedMult * dt;
      if (neb.y - neb.radius > height) {
        neb.y = -neb.radius;
        neb.x = Math.random() * width;
      }
    }

    // Yıldızları kaydır (Warp sırasında hiper hız)
    const starSpeedMult = this.warpTimer > 0 ? 20 : 1.0;
    for (let star of this.stars) {
      star.y += star.speed * starSpeedMult * dt;
      if (star.y > height) {
        star.y = -10;
        star.x = Math.random() * width;
      }
    }

    // Sektör Közleri / Sporları
    if (this.sectorEmbers && this.sectorEmbers.length > 0) {
      for (let emb of this.sectorEmbers) {
        emb.x += emb.vx * dt + Math.sin((emb.waveOffset || 0) + (this.auroraTime || 0)) * 0.35;
        emb.y += emb.vy * dt;
        if (emb.y < -15) {
          emb.y = height + 10;
          emb.x = Math.random() * width;
        } else if (emb.y > height + 15) {
          emb.y = -10;
          emb.x = Math.random() * width;
        }
      }
    }

    // Parçacıklar (Sıfır GC Havuz Güncellemesi - Splice Yok)
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (!p.active) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(0.96, dt);
      p.vy *= Math.pow(0.96, dt);
      p.alpha -= p.decay * dt;
      p.radius *= Math.pow(0.97, dt);
      if (p.alpha <= 0 || p.radius <= 0.2) {
        p.active = false;
      }
    }

    // Şok Dalgaları
    // Şok Dalgaları (Sıfır GC Havuz Güncellemesi)
    for (let i = 0; i < this.shockwaves.length; i++) {
      const sw = this.shockwaves[i];
      if (!sw.active) continue;
      sw.radius += (sw.speed || 5.5) * dt;
      sw.alpha = 1 - (sw.radius / sw.maxRadius);
      if (sw.radius >= sw.maxRadius || sw.alpha <= 0) {
        sw.active = false;
      }
    }

    // Tesla Yıldırımları
    for (let i = this.lightnings.length - 1; i >= 0; i--) {
      const l = this.lightnings[i];
      l.alpha -= l.decay * dt;
      if (l.alpha <= 0) {
        this.lightnings.splice(i, 1);
      }
    }

    // Shards / Enkaz Parçaları (Sıfır GC Havuz Güncellemesi)
    for (let i = 0; i < this.shards.length; i++) {
      const s = this.shards[i];
      if (!s.active) continue;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      if (s.rotSpeed !== undefined) s.rot += s.rotSpeed * dt;
      s.vx *= Math.pow(0.95, dt);
      s.vy *= Math.pow(0.95, dt);
      s.alpha -= s.decay * dt;
      if (s.alpha <= 0) {
        s.active = false;
      }
    }

    // Patlama Ateş Topları (Blast Fireballs - Sıfır GC Havuz Güncellemesi)
    const maxW = (this.width || (typeof window !== 'undefined' ? window.innerWidth : 600)) + 60;
    const maxH = (this.height || (typeof window !== 'undefined' ? window.innerHeight : 1000)) + 60;

    // Patlama Alev Küreleri (Ekran Dışı ve Sönme Temizliği)
    for (let i = 0; i < this.blastFireballs.length; i++) {
      const b = this.blastFireballs[i];
      if (!b.active) continue;
      b.radius += b.growSpeed * dt;
      b.alpha -= b.decay * dt;
      b.rot = (b.rot || 0) + 0.04 * dt;
      if (b.alpha <= 0 || b.radius >= b.maxRadius * 1.5 || b.x < -60 || b.x > maxW || b.y < -60 || b.y > maxH) {
        b.active = false;
      }
    }

    // Parçalanan Kaya Blokları (Chunky Polygonal Rock Debris - Sıfır GC Havuz Güncellemesi)
    for (let i = 0; i < this.rockDebris.length; i++) {
      const rk = this.rockDebris[i];
      if (!rk.active) continue;
      rk.x += rk.vx * dt;
      rk.y += rk.vy * dt;
      rk.rot += rk.rotSpeed * dt;
      rk.vx *= Math.pow(0.96, dt);
      rk.vy *= Math.pow(0.96, dt);
      rk.alpha -= rk.decay * dt;

      // Uçarken arkasında hafif kızgın kıvılcım veya köz bırakır (Düşük oran ile havuzu korur)
      if (rk.alpha > 0.5 && Math.random() < 0.08 * dt && this.getActiveParticleCount() < 50) {
        this._allocParticle({
          x: rk.x,
          y: rk.y,
          vx: (Math.random() - 0.5) * 1.0,
          vy: (Math.random() - 0.5) * 1.0,
          radius: 1.4,
          isPixel: true,
          color: rk.crackColor || '#ff9100',
          alpha: rk.alpha * 0.7,
          decay: 0.07
        });
      }

      if (rk.alpha <= 0 || rk.x < -60 || rk.x > maxW || rk.y < -60 || rk.y > maxH) {
        rk.active = false;
      }
    }

    if (this.glitchTimer > 0) {
      this.glitchTimer -= dt;
      if (this.glitchTimer < 0) this.glitchTimer = 0;
    }

    // Uçuşan Yazılar (Hasar Numaraları, Kombo ve Kritik Bildirimleri)
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.alpha -= ft.decay * dt;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  // Efektleri Çiz
  render(ctx) {
    ctx.save();

    // 0. Sektör Taban Rengi (Dinamik Arka Plan)
    if (this.bgBase) {
      ctx.fillStyle = this.bgBase;
      ctx.fillRect(-60, -60, ctx.canvas.width + 120, ctx.canvas.height + 120);
    }
    // 1. Kozmik Parallax Nebulalar (Önbellekli Hızlı Çizim)
    if (this.nebulae && this.nebulae.length > 0) {
      for (let neb of this.nebulae) {
        if (!neb._cachedCanvas || neb._cachedR !== neb.radius) {
          const off = document.createElement('canvas');
          const d = Math.ceil(neb.radius * 2);
          off.width = d;
          off.height = d;
          const octx = off.getContext('2d');
          const g = octx.createRadialGradient(neb.radius, neb.radius, 0, neb.radius, neb.radius, neb.radius);
          g.addColorStop(0, neb.color);
          g.addColorStop(1, 'transparent');
          octx.fillStyle = g;
          octx.fillRect(0, 0, d, d);
          neb._cachedCanvas = off;
          neb._cachedR = neb.radius;
        }
        ctx.drawImage(neb._cachedCanvas, neb.x - neb.radius, neb.y - neb.radius);
      }
    }

    // 1.5. Kuantum Kutup Işıkları (Aurora Ribbons - Derin Uzay Parıltısı)
    this.renderAuroras(ctx);

    // 2. Retro-Pixel Yıldızlar (3 Katmanlı 8-Bit Parallaks & Çapraz Yıldız Parıltıları)
    const isWarp = this.warpTimer > 0;
    const now = Date.now() * 0.003;
    for (let star of this.stars) {
      if (isWarp) {
        const streakLen = Math.min(80, star.speed * 28);
        ctx.strokeStyle = star.color || '#ffffff';
        ctx.lineWidth = Math.max(1.5, star.size);
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x, star.y + streakLen);
        ctx.stroke();
      } else {
        const twinkle = Math.sin(now + star.pulseOffset) * 0.3;
        const alpha = Math.max(0.12, Math.min(1, star.baseAlpha + twinkle));
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;

        const sx = Math.round(star.x);
        const sy = Math.round(star.y);

        if (star.layer === 3) {
          // Katman 3: 5x5 Retro-Pixel Parıldayan Çapraz Yıldız (Arcade Starburst)
          ctx.fillRect(sx - 2, sy, 5, 1);
          ctx.fillRect(sx, sy - 2, 1, 5);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(sx, sy, 1, 1);
        } else if (star.layer === 2) {
          // Katman 2: 3x3 Klasik 8-Bit Piksel Artı (+) Yıldız
          ctx.fillRect(sx - 1, sy, 3, 1);
          ctx.fillRect(sx, sy - 1, 1, 3);
        } else {
          // Katman 1: Derin uzay 1x1 veya 2x2 mikro kare piksel
          ctx.fillRect(sx, sy, 1.5, 1.5);
        }
      }
    }

    // 3. Şok Dalgaları (Zarif Neon Genişleme Halkaları)
    if (this.shockwaves && this.shockwaves.length > 0) {
      ctx.save();
      for (let sw of this.shockwaves) {
        if (!sw.active || sw.alpha <= 0) continue;
        ctx.globalAlpha = Math.max(0, Math.min(1, sw.alpha * 0.72));
        ctx.strokeStyle = sw.color || '#00f0ff';
        ctx.lineWidth = Math.max(1.4, 3.2 * sw.alpha);
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, Math.max(2, sw.radius), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3.5. Patlama Ateş Topları (Çok Katmanlı Parlayan Blast Fireballs)
    if (this.blastFireballs && this.blastFireballs.length > 0) {
      for (let b of this.blastFireballs) {
        if (!b.active || b.alpha <= 0) continue;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, b.alpha));

        const r = Math.max(1, b.radius);
        // Hızlı 3 katmanlı akkor alev küresi (Sıfır per-frame gradyan maliyeti, 60fps)
        ctx.fillStyle = b.colorOuter || '#ff0055';
        ctx.globalAlpha = Math.max(0, Math.min(1, b.alpha * 0.45));
        ctx.beginPath();
        ctx.arc(b.x, b.y, r * 1.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = b.colorMid || '#ff5500';
        ctx.globalAlpha = Math.max(0, Math.min(1, b.alpha * 0.8));
        ctx.beginPath();
        ctx.arc(b.x, b.y, r * 0.75, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = Math.max(0, Math.min(1, b.alpha));
        ctx.beginPath();
        ctx.arc(b.x, b.y, r * 0.38, 0, Math.PI * 2);
        ctx.fill();

        // Bomba ise parlayan genişleyen dış enerji çemberi
        if (b.isBomb && b.alpha > 0.15) {
          ctx.strokeStyle = `rgba(255, 60, 0, ${b.alpha * 0.8})`;
          ctx.lineWidth = Math.max(1.5, 3.5 * b.alpha);
          ctx.beginPath();
          ctx.arc(b.x, b.y, r * 1.15, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    // 4. Parçacıklar (Sıfır GC Havuz Çizimi)
    for (let p of this.particles) {
      if (!p.active || p.alpha <= 0) continue;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      if (p.isPixel) {
        const sz = Math.max(1, Math.round(p.radius * p.alpha));
        ctx.fillRect(Math.round(p.x - sz / 2), Math.round(p.y - sz / 2), sz, sz);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, p.radius), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4.2. Kaya Enkaz Parçaları (Gerçek Poligonal Taş Parçalanması - Asla birden yok olmaz!)
    if (this.rockDebris && this.rockDebris.length > 0) {
      for (let rk of this.rockDebris) {
        if (!rk.active || rk.alpha <= 0) continue;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, rk.alpha));
        ctx.translate(rk.x, rk.y);
        ctx.rotate(rk.rot);

        ctx.fillStyle = rk.fillColor;
        ctx.strokeStyle = rk.strokeColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        if (rk.polygon && rk.polygon.length > 0) {
          ctx.moveTo(rk.polygon[0].x, rk.polygon[0].y);
          for (let p = 1; p < rk.polygon.length; p++) {
            ctx.lineTo(rk.polygon[p].x, rk.polygon[p].y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // İç magma / enerji çatlağı
          if (rk.crackColor) {
            ctx.strokeStyle = rk.crackColor;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(rk.polygon[0].x * 0.4, rk.polygon[0].y * 0.4);
            ctx.lineTo(rk.polygon[2 % rk.polygon.length].x * 0.5, rk.polygon[2 % rk.polygon.length].y * 0.5);
            ctx.stroke();
          }
        }
        ctx.restore();
      }
    }

    // 4.5. Metal & Diğer Enkaz Parçaları (Shards)
    if (this.shards && this.shards.length > 0) {
      for (let s of this.shards) {
        if (!s.active || s.alpha <= 0) continue;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        const sz = s.size || 2;
        if (s.rot !== undefined) {
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rot);
          ctx.fillRect(-sz * 0.5, -sz * 0.5, sz, sz);
          ctx.restore();
        } else {
          ctx.fillRect(s.x - sz * 0.5, s.y - sz * 0.5, sz, sz);
        }
      }
    }

    // 5. Tesla Yıldırım Arkları
    for (let l of this.lightnings) {
      if (!l.points || l.points.length < 2) continue;
      ctx.strokeStyle = l.color;
      ctx.lineWidth = l.width;
      ctx.globalAlpha = Math.max(0, l.alpha);
      ctx.beginPath();
      ctx.moveTo(l.points[0].x, l.points[0].y);
      for (let i = 1; i < l.points.length; i++) {
        ctx.lineTo(l.points[i].x, l.points[i].y);
      }
      ctx.stroke();
    }

    // 6. Uçuşan Yazılar (Hasar Numaraları & Kritikler - Rajdhani Arcade Font)
    for (let ft of this.floatingTexts) {
      ctx.save();
      ctx.font = `900 ${ft.size}px 'Rajdhani', -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // 7. Ekran Flaş Efekti (Boss ölümü / dev patlama)
    if (this.screenFlashAlpha > 0) {
      ctx.fillStyle = this.screenFlashColor;
      ctx.globalAlpha = this.screenFlashAlpha;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    ctx.shadowBlur = 0;
    ctx.restore();
  }
}
