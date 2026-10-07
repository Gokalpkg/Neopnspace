// === GÖRSEL EFEKTLER & KOZMİK PARÇACIK MOTORU ===

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
    this.stars = [];
    this.nebulae = [];
    this.lightnings = [];
    this.shards = [];
    this.blastFireballs = [];
    this.rockDebris = [];
    this.glitchTimer = 0;
    this.currentSector = 'void';
    this.bgBase = '#02040a';
    this.sectorEmbers = [];
    this.auroraTime = 0;
    this.warpTimer = 0;
    this.hitstopTimer = 0;
    this.screenFlashAlpha = 0;
    this.screenFlashColor = '#ffffff';
    this.chromaticPulse = 0;
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

    this.nebulae = [];
  }

  // Patlama Kıvılcımları (Mobil 60fps Optimize)
  spawnExplosion(x, y, color = '#ff0077', count = 10, maxSpeed = 3.5) {
    if (this.particles.length > 70) {
      count = Math.min(count, 3);
    } else {
      count = Math.min(count, 8);
    }
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * maxSpeed;
      this.particles.push({
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

  // 7. Düşman Patlamalarında Parça Saçılması (Debris & Shards - Hafifletilmiş)
  spawnDebris(x, y, color = '#ff0055', count = 4) {
    if (this.shards.length > 25) return;
    const finalCount = Math.min(count, 6);
    for (let i = 0; i < finalCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.4 + Math.random() * 2.6;
      this.shards.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.8 + Math.random() * 2.2,
        color,
        alpha: 1,
        decay: 0.045 + Math.random() * 0.03
      });
    }
  }

  // Meteor / Taş Parçalanma Patlama Animasyonu (Birden yok olmayı önleyen organik parçalanma)
  spawnAsteroidBreakAnimation(x, y, radius = 25, isBomb = false) {
    const r = Math.max(16, radius);

    // 1. Çok Katmanlı Genişleyen Patlama Ateş Topu (Blooming Fireball Blast)
    // Bu ateş topu, tam taşın yok olduğu karede ortaya çıkıp hacmini doldurur ve organik olarak genişleyip dağılır.
    const baseCore = '#ffffff';
    const baseMid = isBomb ? '#ffbe0b' : '#38bdf8';
    const baseOuter = isBomb ? '#ff3d00' : '#475569';

    this.blastFireballs.push({
      x,
      y,
      radius: r * 0.45,
      maxRadius: r * (isBomb ? 2.6 : 1.8),
      growSpeed: isBomb ? 4.6 : 3.0,
      alpha: 1.0,
      decay: isBomb ? 0.032 : 0.046,
      isBomb,
      colorCore: baseCore,
      colorMid: baseMid,
      colorOuter: baseOuter
    });

    // Bomba ise çevresinde ikincil patlama halkaları ve köz saçılması
    if (isBomb) {
      for (let b = 0; b < 3; b++) {
        const offAng = (b * (Math.PI * 2 / 3)) + (Math.random() - 0.5) * 0.4;
        const offDist = r * (0.3 + Math.random() * 0.35);
        this.blastFireballs.push({
          x: x + Math.cos(offAng) * offDist,
          y: y + Math.sin(offAng) * offDist,
          radius: r * 0.3,
          maxRadius: r * (1.6 + Math.random() * 0.8),
          growSpeed: 3.2 + Math.random() * 2.2,
          alpha: 0.9,
          decay: 0.036,
          isBomb: true,
          colorCore: '#ffe600',
          colorMid: '#ff3d00',
          colorOuter: '#7c2d12'
        });
      }
    }

    // 2. Büyük Poligonal Parçalanan Kaya Blokları (Gerçek Taş Çatlaması - Asla birden yok olmaz!)
    const chunkCount = Math.max(6, Math.min(9, Math.round(r * 0.36)));
    const fillCol = isBomb ? '#5c122a' : '#334155';
    const strokeCol = isBomb ? '#ff0055' : '#94a3b8';
    const crackCol = isBomb ? '#ffe600' : '#38bdf8';

    for (let i = 0; i < chunkCount; i++) {
      const angle = (i * (Math.PI * 2 / chunkCount)) + (Math.random() - 0.5) * 0.55;
      const speed = 2.0 + Math.random() * 3.4;
      const rotSpeed = (Math.random() - 0.5) * 0.28;
      const chunkR = Math.max(7, Math.min(18, (r * 0.42) + Math.random() * 3.5));

      // 4-6 köşeli düzensiz kaya poligonu
      const polyPoints = [];
      const numPts = 5;
      for (let p = 0; p < numPts; p++) {
        const pAng = (p / numPts) * Math.PI * 2;
        const dist = chunkR * (0.65 + Math.random() * 0.6);
        polyPoints.push({ x: Math.cos(pAng) * dist, y: Math.sin(pAng) * dist });
      }

      this.rockDebris.push({
        x: x + Math.cos(angle) * (r * 0.35),
        y: y + Math.sin(angle) * (r * 0.35),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: rotSpeed,
        alpha: 1.0,
        decay: 0.024 + Math.random() * 0.012, // ~35 - 45 frame boyunca ekranda takla atarak uçar!
        polygon: polyPoints,
        fillColor: fillCol,
        strokeColor: strokeCol,
        crackColor: crackCol
      });
    }

    // 3. Genişleyen Duman Püskürmeleri ve Kızgın Közler
    const dustCount = Math.min(16, Math.round(r * 0.5));
    for (let i = 0; i < dustCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 2.8;
      this.particles.push({
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
      this.particles.push({
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
    if (this.particles.length > 75) return;
    this.particles.push({
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

  // Şok Dalgası (Kullanıcı talebi doğrultusunda ekrandaki yuvarlak halkalar ve göz yorucu epilepsi tetikleyicileri tamamen devre dışı bırakıldı)
  spawnShockwave(x, y, color = '#00f0ff', maxRadius = 160) {
    // Devre dışı: ekranda yuvarlak halka / şok dalgası oluşturulmaz
    return;
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
      // Varsayılan: 'void' (Siber Neon Boşluğu)
      this.bgBase = '#060814';
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
      return; // Hitstop sırasında dünya 2-3 frame donar, vuruş hissi katlanır
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

    // Parçacıklar (Mobil 60fps akıcılık için optimize edilmiş 90 tavanı)
    if (this.particles.length > 90) {
      this.particles.splice(0, this.particles.length - 90);
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(0.96, dt);
      p.vy *= Math.pow(0.96, dt);
      p.alpha -= p.decay * dt;
      p.radius *= Math.pow(0.97, dt);
      if (p.alpha <= 0 || p.radius <= 0.2) {
        this.particles.splice(i, 1);
      }
    }

    // Şok Dalgaları
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += 5.5 * dt;
      sw.alpha = 1 - (sw.radius / sw.maxRadius);
      if (sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
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

    // Shards / Enkaz Parçaları (Maksimum 20 sınır)
    if (this.shards && this.shards.length > 0) {
      if (this.shards.length > 20) {
        this.shards.splice(0, this.shards.length - 20);
      }
      for (let i = this.shards.length - 1; i >= 0; i--) {
        const s = this.shards[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (s.rotSpeed !== undefined) s.rot += s.rotSpeed * dt;
        s.vx *= Math.pow(0.95, dt);
        s.vy *= Math.pow(0.95, dt);
        s.alpha -= s.decay * dt;
        if (s.alpha <= 0) {
          this.shards.splice(i, 1);
        }
      }
    }

    // Patlama Ateş Topları (Blast Fireballs)
    if (this.blastFireballs && this.blastFireballs.length > 0) {
      if (this.blastFireballs.length > 25) {
        this.blastFireballs.splice(0, this.blastFireballs.length - 25);
      }
      for (let i = this.blastFireballs.length - 1; i >= 0; i--) {
        const b = this.blastFireballs[i];
        b.radius += b.growSpeed * dt;
        b.alpha -= b.decay * dt;
        b.rot = (b.rot || 0) + 0.04 * dt;
        if (b.alpha <= 0 || b.radius >= b.maxRadius * 1.5) {
          this.blastFireballs.splice(i, 1);
        }
      }
    }

    // Parçalanan Kaya Blokları (Chunky Polygonal Rock Debris)
    if (this.rockDebris && this.rockDebris.length > 0) {
      if (this.rockDebris.length > 40) {
        this.rockDebris.splice(0, this.rockDebris.length - 40);
      }
      for (let i = this.rockDebris.length - 1; i >= 0; i--) {
        const rk = this.rockDebris[i];
        rk.x += rk.vx * dt;
        rk.y += rk.vy * dt;
        rk.rot += rk.rotSpeed * dt;
        rk.vx *= Math.pow(0.96, dt);
        rk.vy *= Math.pow(0.96, dt);
        rk.alpha -= rk.decay * dt;

        // Uçarken arkasında hafif kızgın kıvılcım veya köz bırakır
        if (rk.alpha > 0.45 && Math.random() < 0.22 * dt && this.particles.length < 80) {
          this.particles.push({
            x: rk.x,
            y: rk.y,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            radius: 1.6,
            isPixel: true,
            color: rk.crackColor || '#ff9100',
            alpha: rk.alpha * 0.8,
            decay: 0.06
          });
        }

        if (rk.alpha <= 0) {
          this.rockDebris.splice(i, 1);
        }
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

    // 3. Şok Dalgaları (Devre dışı - boş döngü)
    this.shockwaves.length = 0;

    // 3.5. Patlama Ateş Topları (Çok Katmanlı Parlayan Blast Fireballs)
    if (this.blastFireballs && this.blastFireballs.length > 0) {
      for (let b of this.blastFireballs) {
        if (b.alpha <= 0) continue;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, b.alpha));

        const r = Math.max(1, b.radius);
        // Volumetrik Yumuşak Alev Gradyanı (Bulutsu / Kor Alev Topu)
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        grad.addColorStop(0, '#ffffff'); // Akkor beyaz merkez
        grad.addColorStop(0.25, b.colorCore || '#ffe600');
        grad.addColorStop(0.55, b.colorMid || '#ff5500');
        grad.addColorStop(0.82, b.colorOuter || '#ff0055');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Kenarlarda yumuşak tütsülü geçiş

        ctx.fillStyle = grad;

        // Ana alev küresi
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Organik dalgalanan 4 alev yumrusu (Mushroom / Billowing Cloud Lobes)
        const lobeDist = r * 0.45;
        const lobeR = r * 0.58;
        for (let k = 0; k < 4; k++) {
          const ang = (b.rot || 0) + k * (Math.PI / 2);
          ctx.beginPath();
          ctx.arc(b.x + Math.cos(ang) * lobeDist, b.y + Math.sin(ang) * lobeDist, lobeR, 0, Math.PI * 2);
          ctx.fill();
        }

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

    // 4. Parçacıklar (Kuantize Retro-Pixel ve Normal Kıvılcımlar)
    for (let p of this.particles) {
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
        if (rk.alpha <= 0) continue;
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
