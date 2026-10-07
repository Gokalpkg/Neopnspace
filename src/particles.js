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
    if (this.shards.length > 18) return;
    const finalCount = Math.min(count, 4);
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

  // Uçuşan Yazılar (Kritik Vuruş, Hasar, Şok ve Seviye Popupları)
  spawnFloatingText(x, y, text, color = '#ffbe0b', size = 14) {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      size,
      alpha: 1.0,
      vy: -1.4,
      decay: 0.024
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
        s.vx *= Math.pow(0.95, dt);
        s.vy *= Math.pow(0.95, dt);
        s.alpha -= s.decay * dt;
        if (s.alpha <= 0) {
          this.shards.splice(i, 1);
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

    // 4.5. Metal Enkaz Parçaları (Debris & Shards - Yüksek Hızlı Sıfır-Overhead Çizim)
    if (this.shards && this.shards.length > 0) {
      for (let s of this.shards) {
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        const sz = s.size || 2;
        ctx.fillRect(s.x - sz * 0.5, s.y - sz * 0.5, sz, sz);
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
