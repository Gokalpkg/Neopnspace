// === DÜŞMANLAR, METEORLAR, XP KRİSTALLERİ & MERMİLER ===

export const BOSS_ROSTER = {
  boss_vanguard: {
    id: 'boss_vanguard',
    name: 'ÖNCÜ KOMUTAN',
    subtitle: 'KORSAN ÖNCÜ GEMİSİ',
    title: 'PROLOG • ÖNCÜ BASKINI',
    color: '#ffbe0b',
    enragedColor: '#ff5500',
    coreColor: '#00f0ff',
    radius: 38,
    baseHp: 110,
    speedX: 1.35,
    score: 800
  },
  boss_dreadnought: {
    id: 'boss_dreadnought',
    name: 'KARA MUHAFIZ',
    subtitle: 'AĞIR DREADNOUGHT',
    title: 'SEKTÖR 1 • AMİRAL',
    color: '#ff0055',
    enragedColor: '#ff1744',
    coreColor: '#ffbe0b',
    radius: 52,
    baseHp: 340,
    speedX: 1.05,
    score: 2000
  },
  boss_nebula: {
    id: 'boss_nebula',
    name: 'NEBULA GÖZCÜSÜ',
    subtitle: 'SİBERNETİK ÇEKİRDEK',
    title: 'SEKTÖR 2 • GÖZCÜ',
    color: '#00f0ff',
    enragedColor: '#bf5af2',
    coreColor: '#05ffa1',
    radius: 56,
    baseHp: 480,
    speedX: 1.2,
    score: 2800
  },
  boss_titan: {
    id: 'boss_titan',
    name: 'DEMİR TİTAN',
    subtitle: 'MEKA SAVAŞ GEMİSİ',
    title: 'SEKTÖR 3 • YIKICI',
    color: '#05ffa1',
    enragedColor: '#10b981',
    coreColor: '#f59e0b',
    radius: 55,
    baseHp: 640,
    speedX: 1.15,
    score: 3600
  },
  boss_chrono: {
    id: 'boss_chrono',
    name: 'KRONOS HÜKÜMDARI',
    subtitle: 'KADİM ALTIN AMİRAL',
    title: 'SEKTÖR 4 • HÜKÜMDAR',
    color: '#ffbe0b',
    enragedColor: '#ff5500',
    coreColor: '#ffffff',
    radius: 58,
    baseHp: 820,
    speedX: 1.3,
    score: 4500
  },
  boss_apex: {
    id: 'boss_apex',
    name: 'KUANTUM APEX',
    subtitle: 'BOYUTLAR ARASI AVCI',
    title: 'SEKTÖR 5 • UÇURUM HAKİMİ',
    color: '#c084fc',
    enragedColor: '#f43f5e',
    coreColor: '#38bdf8',
    radius: 60,
    baseHp: 1050,
    speedX: 1.4,
    score: 6000
  }
};

export const PIXEL_BOSSES = {
  boss_vanguard: {
    p: 3.5,
    palette: {
      1: '#150d1b',
      2: '#ffbe0b',
      3: '#ffffff',
      4: '#00f0ff',
      5: '#ff5500',
      6: '#ffd700'
    },
    rows: [
      [0,0,0,0,5,5,0,0,0,0],
      [0,0,0,2,2,2,2,0,0,0],
      [0,0,2,4,4,4,4,2,0,0],
      [0,2,2,1,3,3,1,2,2,0],
      [2,2,1,1,4,4,1,1,2,2],
      [2,1,1,2,2,2,2,1,1,2],
      [2,2,2,1,4,4,1,2,2,2],
      [1,2,1,1,2,2,1,1,2,1],
      [0,1,1,2,6,6,2,1,1,0],
      [0,0,1,1,6,6,1,1,0,0]
    ]
  },
  boss_dreadnought: {
    p: 4.2,
    palette: {
      1: '#150d1b',
      2: '#ff0055',
      3: '#ffffff',
      4: '#ffbe0b',
      5: '#ff3d00',
      6: '#ff0077'
    },
    rows: [
      [0,0,0,0,5,5,0,0,0,0,0,0],
      [0,0,0,0,5,5,0,0,0,0,0,0],
      [0,0,0,2,1,1,2,0,0,0,0,0],
      [0,0,2,2,4,4,2,2,0,0,0,0],
      [0,2,2,1,4,4,1,2,2,0,0,0],
      [2,2,1,1,3,3,1,1,2,2,0,0],
      [2,1,1,2,2,2,2,1,1,2,0,0],
      [2,1,2,2,4,4,2,2,1,2,2,0],
      [2,2,2,1,4,4,1,2,2,2,2,2],
      [1,2,1,1,2,2,1,1,2,1,2,2],
      [1,1,1,2,2,2,2,1,1,1,1,2],
      [0,1,1,2,1,1,2,1,1,0,1,2],
      [0,0,1,1,1,1,1,1,0,0,0,2],
      [0,0,1,2,2,2,2,1,0,0,0,1],
      [0,0,0,1,6,6,1,0,0,0,0,0],
      [0,0,0,0,6,6,0,0,0,0,0,0]
    ]
  },
  boss_nebula: {
    p: 4.2,
    palette: {
      1: '#071829',
      2: '#00f0ff',
      3: '#ffffff',
      4: '#05ffa1',
      5: '#bf5af2',
      6: '#00e5ff'
    },
    rows: [
      [0,0,0,2,2,2,2,2,0,0,0,0],
      [0,0,2,2,1,1,1,2,2,0,0,0],
      [0,2,2,1,5,5,1,1,2,2,0,0],
      [2,2,1,5,5,5,5,1,1,2,0,0],
      [2,1,5,5,2,2,5,5,1,2,2,0],
      [2,1,5,2,4,4,2,5,1,1,2,2],
      [2,1,5,2,4,3,2,5,1,1,2,2],
      [2,1,5,2,4,4,2,5,1,1,2,2],
      [2,1,5,5,2,2,5,5,1,2,2,0],
      [2,2,1,5,5,5,5,1,1,2,0,0],
      [0,2,2,1,5,5,1,1,2,2,0,0],
      [0,0,2,2,1,1,1,2,2,0,0,0],
      [0,0,0,2,2,6,6,2,0,0,0,0],
      [0,0,0,0,6,6,0,0,0,0,0,0]
    ]
  },
  boss_titan: {
    p: 4.3,
    palette: {
      1: '#0a1f18',
      2: '#05ffa1',
      3: '#ffffff',
      4: '#ffbe0b',
      5: '#10b981',
      6: '#34d399'
    },
    rows: [
      [0,0,0,0,0,0,2,2,0,0,2,2],
      [0,0,0,0,0,2,1,1,2,2,4,4],
      [0,0,0,2,2,1,2,1,1,2,4,4],
      [0,0,2,2,1,1,2,2,1,1,2,2],
      [0,2,2,1,1,1,1,1,1,1,1,2],
      [2,2,1,1,5,5,1,1,1,1,1,2],
      [2,1,1,5,5,5,5,1,1,1,1,2],
      [2,1,1,1,5,5,1,1,1,1,1,2],
      [2,2,1,1,1,1,1,1,2,2,2,2],
      [0,2,2,1,1,1,1,2,2,0,0,0],
      [0,0,2,3,3,3,3,2,0,0,0,0],
      [0,0,2,1,3,1,3,2,0,0,0,0],
      [0,0,2,2,5,5,2,2,0,0,0,0],
      [0,0,0,2,5,5,2,0,0,0,0,0],
      [0,0,0,0,6,6,0,0,0,0,0,0]
    ]
  },
  boss_chrono: {
    p: 4.4,
    palette: {
      1: '#261a06',
      2: '#ffbe0b',
      3: '#ffffff',
      4: '#ff5722',
      5: '#f59e0b',
      6: '#ff9100'
    },
    rows: [
      [0,0,0,0,3,3,0,0,0,0,0,0],
      [0,0,0,2,3,3,2,0,0,0,0,0],
      [0,0,2,2,1,1,2,2,0,0,0,0],
      [0,2,2,1,4,4,1,2,2,0,0,0],
      [2,2,1,4,3,3,4,1,2,2,0,0],
      [2,1,4,3,3,3,3,4,1,2,5,5],
      [2,1,4,3,3,3,3,4,1,2,5,5],
      [2,2,1,4,3,3,4,1,2,2,5,5],
      [1,2,2,1,4,4,1,2,2,1,5,5],
      [1,1,2,2,1,1,2,2,1,1,5,5],
      [1,1,1,2,2,2,2,1,1,1,1,5],
      [0,1,1,2,1,1,2,1,1,0,0,0],
      [0,0,1,2,6,6,2,1,0,0,0,0],
      [0,0,0,6,6,6,6,0,0,0,0,0]
    ]
  },
  boss_apex: {
    p: 4.4,
    palette: {
      1: '#130a24',
      2: '#c084fc',
      3: '#38bdf8',
      4: '#f43f5e',
      5: '#ec4899',
      6: '#818cf8'
    },
    rows: [
      [0,0,0,0,4,4,0,0,0,0,0,5],
      [0,0,0,2,4,4,2,0,0,0,5,5],
      [0,0,2,2,1,1,2,2,0,5,5,0],
      [0,2,2,1,3,3,1,2,2,5,0,0],
      [2,2,1,3,4,4,3,1,2,2,0,0],
      [2,1,3,4,4,4,4,3,1,2,0,0],
      [2,1,3,4,4,4,4,3,1,2,2,0],
      [2,2,1,3,4,4,3,1,2,2,2,2],
      [1,2,2,1,3,3,1,2,2,1,1,2],
      [1,1,2,2,1,1,2,2,1,1,1,1],
      [0,1,1,2,2,2,2,1,1,0,0,0],
      [0,0,1,2,6,6,2,1,0,0,0,0],
      [0,0,0,6,6,6,6,0,0,0,0,0]
    ]
  }
};


export const PIXEL_SHIPS = {
  scout: {
    p: 4.2,
    palette: {
      1: '#1e293b',
      2: '#00f0ff',
      3: '#ffffff',
      4: '#00e5ff',
      5: '#38bdf8',
      6: '#ff5500'
    },
    rows: [
      [0, 6, 6, 0, 0],
      [0, 2, 1, 2, 0],
      [2, 1, 1, 2, 5],
      [2, 1, 4, 1, 5],
      [1, 3, 3, 2, 0],
      [2, 3, 2, 0, 0],
      [0, 2, 0, 0, 0]
    ]
  },
  cruiser: {
    p: 5.0,
    palette: {
      1: '#1e293b',
      2: '#ff0055',
      3: '#ffffff',
      4: '#ffbe0b',
      5: '#475569',
      6: '#ff3d00'
    },
    rows: [
      [0, 6, 6, 0, 6, 0],
      [0, 2, 5, 2, 5, 2],
      [2, 1, 1, 1, 5, 2],
      [5, 1, 4, 4, 1, 2],
      [5, 1, 4, 4, 1, 2],
      [1, 5, 1, 1, 5, 2],
      [1, 3, 3, 1, 2, 0],
      [2, 1, 1, 2, 0, 0],
      [0, 2, 2, 0, 0, 0],
      [0, 2, 0, 0, 0, 0]
    ]
  },
  dive_bomber: {
    p: 4.2,
    palette: {
      1: '#2d1222',
      2: '#ff0055',
      3: '#ffffff',
      4: '#ffbe0b',
      5: '#be123c',
      6: '#ff3d00'
    },
    rows: [
      [0, 6, 6, 0, 0],
      [0, 2, 1, 2, 0],
      [2, 1, 5, 1, 2],
      [2, 5, 4, 5, 2],
      [1, 5, 4, 2, 0],
      [2, 1, 2, 0, 0],
      [0, 3, 0, 0, 0]
    ]
  },
  escort_fighter: {
    p: 3.8,
    palette: {
      1: '#0f2942',
      2: '#00f0ff',
      3: '#ffffff',
      4: '#05ffa1',
      5: '#0284c7',
      6: '#38bdf8'
    },
    rows: [
      [0, 6, 6, 0],
      [0, 2, 1, 2],
      [2, 1, 4, 2],
      [5, 4, 4, 2],
      [1, 3, 2, 0],
      [0, 2, 0, 0]
    ]
  },
  elite_scout: {
    p: 4.8,
    palette: {
      1: '#362408',
      2: '#ffbe0b',
      3: '#ffffff',
      4: '#00f0ff',
      5: '#d97706',
      6: '#ff5500'
    },
    rows: [
      [0, 6, 6, 0, 6, 0],
      [0, 2, 1, 2, 1, 2],
      [2, 1, 5, 1, 5, 2],
      [5, 1, 4, 4, 1, 3],
      [1, 5, 4, 4, 2, 3],
      [1, 3, 3, 1, 2, 0],
      [2, 1, 1, 2, 0, 0],
      [0, 2, 2, 0, 0, 0],
      [0, 3, 0, 0, 0, 0]
    ]
  }
};

export class Enemy {
  static currentSector = 'void';
  static getBossInfo(type) {
    if (type === 'boss') return BOSS_ROSTER.boss_dreadnought;
    return BOSS_ROSTER[type] || BOSS_ROSTER.boss_dreadnought;
  }

  constructor(x, y, type, waveMultiplier = 1, speedMultiplier = 1, sector = null) {
    this.x = x;
    this.y = y;
    this.type = type; // 'asteroid_l', 'asteroid_m', 'asteroid_s', 'scout', 'cruiser', 'boss_*'
    this.sector = sector || Enemy.currentSector || 'void';
    this.toRemove = false;
    this.isBoss = type === 'boss' || type.startsWith('boss_');
    this.hitFlash = 0;

    // Tip özelliklerine göre başlat
    switch (type) {
      case 'asteroid_l':
        this.radius = 28;
        this.hp = Math.round(9 * waveMultiplier);
        this.maxHp = this.hp;
        this.speedY = (0.60 + Math.random() * 0.30) * speedMultiplier;
        this.speedX = (Math.random() - 0.5) * 0.35 * speedMultiplier;
        this.score = 50;
        this.color = '#8b9bb4';
        this.shape = this.generatePolygon(7, 28);
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.rot = 0;
        break;

      case 'asteroid_m':
        this.radius = 18;
        this.hp = Math.round(3.5 * waveMultiplier);
        this.maxHp = this.hp;
        this.speedY = (0.75 + Math.random() * 0.35) * speedMultiplier;
        this.speedX = (Math.random() - 0.5) * 0.45 * speedMultiplier;
        this.score = 30;
        this.color = '#a0aec0';
        this.shape = this.generatePolygon(6, 18);
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
        this.rot = 0;
        break;

      case 'asteroid_s':
        this.radius = 12;
        this.hp = Math.round(1.5 * waveMultiplier);
        this.maxHp = this.hp;
        this.speedY = (0.80 + Math.random() * 0.35) * speedMultiplier;
        this.speedX = (Math.random() - 0.5) * 0.5 * speedMultiplier;
        this.score = 25;
        this.color = '#a7f3d0';
        this.shape = this.generatePolygon(5, 12);
        this.rotSpeed = (Math.random() - 0.5) * 0.04;
        this.rot = 0;
        break;

      case 'scout':
        this.radius = 14;
        this.hp = Math.round(8 * waveMultiplier);
        this.maxHp = this.hp;
        this.speedY = (1.5 + Math.random() * 0.4) * speedMultiplier;
        this.speedX = 0;
        this.sineFreq = 0.03 + Math.random() * 0.02;
        this.sineAmp = 1.8;
        this.time = Math.random() * 100;
        this.score = 40;
        this.color = '#ff0077';
        break;

      case 'cruiser':
        this.radius = 24;
        this.hp = Math.round(34 * waveMultiplier);
        this.maxHp = this.hp;
        this.speedY = 0.7 * speedMultiplier;
        this.speedX = (Math.random() - 0.5) * 0.35 * speedMultiplier;
        this.score = 120;
        this.color = '#ff3366';
        this.shootTimer = 60 + Math.random() * 40;
        break;

      case 'cargo_freighter':
        this.radius = 26;
        this.hp = Math.round(16 * waveMultiplier);
        this.maxHp = this.hp;
        this.speedY = (0.55 + Math.random() * 0.20) * speedMultiplier;
        this.speedX = (Math.random() < 0.5 ? -1 : 1) * 0.45 * speedMultiplier;
        this.score = 250;
        this.color = '#ffd700';
        this.isCargo = true;
        break;

      case 'boss':
      case 'boss_vanguard':
      case 'boss_dreadnought':
      case 'boss_nebula':
      case 'boss_titan':
      case 'boss_chrono':
      case 'boss_apex': {
        const info = Enemy.getBossInfo(type);
        this.radius = info.radius;
        this.hp = Math.round(info.baseHp * waveMultiplier);
        this.maxHp = this.hp;
        this.speedY = 0.32 * (speedMultiplier || 1.0);
        this.speedX = info.speedX * (speedMultiplier || 1.0);
        this.score = info.score;
        this.color = info.color;
        this.shootTimer = 40;
        this.dirX = 1;
        this.phase = 1;
        this.isEnraged = false;
        this.justEnraged = false;
        this.shieldPlateAngle = 0;
        this.spiralAngle = 0;
        this.bossAttackTick = 0;
        this.leftPodHp = Math.round(this.hp * 0.25);
        this.rightPodHp = Math.round(this.hp * 0.25);
        this.leftPodDestroyed = false;
        this.rightPodDestroyed = false;
        break;
      }

      case 'asteroid_gold':
        this.radius = 16;
        this.hp = 1;
        this.maxHp = 1;
        this.speedY = 0.85 * speedMultiplier;
        this.speedX = 0;
        this.score = 100;
        this.color = '#ffbe0b';
        this.shape = this.generatePolygon(6, 16);
        this.rotSpeed = 0.04;
        this.rot = 0;
        break;

      case 'volatile_core':
        this.radius = 20;
        this.hp = 5;
        this.maxHp = 5;
        this.speedY = 0.45 * speedMultiplier;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.score = 80;
        this.color = '#ff0055';
        this.pulseAngle = 0;
        break;

      case 'asteroid_bomb':
        this.radius = 20;
        this.hp = Math.round(9 * waveMultiplier);
        this.maxHp = this.hp;
        this.speedY = (0.75 + Math.random() * 0.35) * speedMultiplier;
        this.speedX = (Math.random() - 0.5) * 0.4 * speedMultiplier;
        this.score = 45;
        this.color = '#ff4d00';
        this.shape = this.generatePolygon(6, 20);
        this.rotSpeed = (Math.random() - 0.5) * 0.04;
        this.rot = 0;
        break;

      case 'dive_bomber':
        this.radius = 13;
        this.hp = Math.round(5 * waveMultiplier);
        this.maxHp = this.hp;
        this.speedY = 1.1 * speedMultiplier;
        this.speedX = 0;
        this.score = 45;
        this.color = '#ff9100';
        this.isDiving = false;
        this.diveTimer = 0;
        this.diveTargetAngle = 0;
        this.diveSpeed = 3.6 * speedMultiplier;
        break;

      case 'escort_fighter':
        this.radius = 13;
        this.hp = Math.round(4 * waveMultiplier);
        this.maxHp = this.hp;
        this.speed = 2.4 * speedMultiplier;
        this.color = '#00f0ff';
        this.angle = Math.PI / 2;
        this.shootTimer = 75 + Math.random() * 45;
        this.score = 50;
        break;

      case 'elite_scout':
        this.radius = 18;
        this.hp = Math.round(24 * waveMultiplier);
        this.maxHp = this.hp;
        this.speedY = (0.85 + Math.random() * 0.25) * speedMultiplier;
        this.speedX = 0;
        this.sineFreq = 0.025;
        this.sineAmp = 2.2;
        this.time = Math.random() * 100;
        this.score = 250;
        this.color = '#ffbe0b';
        this.shootTimer = 45 + Math.random() * 25;
        break;
    }

    // Mini-Elit Şampiyon Düşman Sistemi (Arena İçi Özel Güçlü Düşmanlar)
    this.isChampion = false;
    this.affix = null;
    if (!this.isBoss && !this.shape && this.type !== 'asteroid_s' && this.type !== 'asteroid_m' && this.type !== 'asteroid_l' && waveMultiplier >= 1.15) {
      if (Math.random() < 0.14) {
        this.isChampion = true;
        this.radius = Math.round(this.radius * 1.25);
        this.hp = Math.round(this.hp * 2.3);
        this.maxHp = this.hp;
        this.score = Math.round(this.score * 2.8);
        const affixes = ['swift', 'shielded', 'split', 'teleporter'];
        this.affix = affixes[Math.floor(Math.random() * affixes.length)];
        if (this.affix === 'swift') {
          this.speedY *= 1.35;
          if (this.speedX) this.speedX *= 1.35;
        }
      }
    }

    // Sektör görsel uyarlaması (Aşama Temaları)
    if (this.shape && this.type !== 'asteroid_bomb') {
      if (this.sector === 'magma') {
        this.color = this.type === 'asteroid_s' ? '#ff9100' : (this.type === 'asteroid_m' ? '#ff5500' : '#ff3d00');
      } else if (this.sector === 'toxic') {
        this.color = this.type === 'asteroid_s' ? '#05ffa1' : (this.type === 'asteroid_m' ? '#10b981' : '#059669');
      } else if (this.sector === 'quantum') {
        this.color = this.type === 'asteroid_s' ? '#e879f9' : (this.type === 'asteroid_m' ? '#c084fc' : '#a855f7');
      }
    }
  }

  generatePolygon(points, baseRadius) {
    const vertices = [];
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const r = baseRadius * (0.75 + Math.random() * 0.5);
      vertices.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }
    return vertices;
  }

  update(playerX, playerY, enemyProjectiles, screenWidth, screenHeight, dt = 1.0) {
    if (this.frozen > 0) {
      this.frozen -= dt;
      dt *= 0.5;
    }
    if (this.shape) {
      this.rot += this.rotSpeed * dt;
    }

    if (this.type === 'scout') {
      this.time += dt;
      this.x += Math.sin(this.time * this.sineFreq) * this.sineAmp * dt;
      this.y += this.speedY * dt;

      // Aşağıya kaçmayı engelle: Belirli bir sınıra gelince yukarı kavis çizer
      if (this.y > screenHeight - 85 && this.speedY > 0) {
        this.speedY = -Math.abs(this.speedY);
      } else if (this.y < 65 && this.speedY < 0) {
        this.speedY = Math.abs(this.speedY);
      }
    } else if (this.isBoss) {
      const info = Enemy.getBossInfo(this.type);
      const enrageThreshold = this.type === 'boss_apex' ? 0.45 : 0.50;

      // 2. Faz (Öfke Modu) Kontrolü
      if (this.phase === 1 && this.hp <= this.maxHp * enrageThreshold) {
        this.phase = 2;
        this.isEnraged = true;
        this.justEnraged = true;
        this.speedX = info.speedX * 1.35;
        this.color = info.enragedColor;
      }

      // Boss ekranın üst yarısında süzülür
      const targetHoverY = this.type === 'boss_apex' ? 135 : 120;
      if (this.y < targetHoverY) {
        this.y += this.speedY * dt;
      }
      this.x += this.speedX * this.dirX * dt;
      if (this.x > screenWidth - this.radius - 12) {
        this.dirX = -1;
      } else if (this.x < this.radius + 12) {
        this.dirX = 1;
      }

      if (this.type === 'boss_nebula') {
        this.shieldPlateAngle += 0.04 * dt;
      }

      // Boss Özel Ateş Mekanikleri
      this.shootTimer -= dt;
      if (this.shootTimer <= 0) {
        const baseAngle = Math.atan2(playerY - this.y, playerX - this.x);

        if (this.type === 'boss_vanguard') {
          this.shootTimer = 42;
          enemyProjectiles.push(new EnemyProjectile(this.x - 14, this.y + 16, baseAngle - 0.08, 3.8));
          enemyProjectiles.push(new EnemyProjectile(this.x + 14, this.y + 16, baseAngle + 0.08, 3.8));
        } else if (this.type === 'boss_dreadnought' || this.type === 'boss') {
          if (this.phase === 2) {
            this.shootTimer = 28;
            this.spiralAngle += 0.38;
            for (let s = 0; s < 6; s++) {
              const ang = this.spiralAngle + (s * Math.PI / 3);
              if (Math.cos(ang) < -0.2 && this.leftPodDestroyed) continue;
              if (Math.cos(ang) > 0.2 && this.rightPodDestroyed) continue;
              enemyProjectiles.push(new EnemyProjectile(this.x, this.y + 15, ang, 4.5));
            }
          } else {
            this.shootTimer = 44;
            for (let offset of [-0.28, 0, 0.28]) {
              if (offset < 0 && this.leftPodDestroyed) continue;
              if (offset > 0 && this.rightPodDestroyed) continue;
              enemyProjectiles.push(new EnemyProjectile(this.x, this.y + 20, baseAngle + offset, 4.2));
            }
          }
        } else if (this.type === 'boss_nebula') {
          if (this.phase === 2) {
            this.shootTimer = 26;
            this.spiralAngle += 0.45;
            for (let s = 0; s < 8; s++) {
              const ang = this.spiralAngle + (s * Math.PI / 4);
              if (Math.cos(ang) < -0.2 && this.leftPodDestroyed) continue;
              if (Math.cos(ang) > 0.2 && this.rightPodDestroyed) continue;
              enemyProjectiles.push(new EnemyProjectile(this.x, this.y + 15, ang, 4.6));
            }
            // Çift keskin nişancı atışı (Podlara bağlı)
            if (!this.leftPodDestroyed) {
              enemyProjectiles.push(new EnemyProjectile(this.x - 15, this.y + 20, baseAngle - 0.08, 5.0));
            }
            if (!this.rightPodDestroyed) {
              enemyProjectiles.push(new EnemyProjectile(this.x + 15, this.y + 20, baseAngle + 0.08, 5.0));
            }
          } else {
            this.shootTimer = 40;
            for (let offset of [-0.4, -0.15, 0.15, 0.4]) {
              if (offset < 0 && this.leftPodDestroyed) continue;
              if (offset > 0 && this.rightPodDestroyed) continue;
              enemyProjectiles.push(new EnemyProjectile(this.x, this.y + 20, baseAngle + offset, 4.1));
            }
          }
        } else if (this.type === 'boss_titan') {
          if (this.phase === 2) {
            this.shootTimer = 24;
            // 10 yönlü zümrüt flak patlaması
            for (let s = 0; s < 10; s++) {
              const ang = (s * Math.PI / 5) + (Math.random() * 0.1);
              if (Math.cos(ang) < -0.2 && this.leftPodDestroyed) continue;
              if (Math.cos(ang) > 0.2 && this.rightPodDestroyed) continue;
              enemyProjectiles.push(new EnemyProjectile(this.x, this.y + 15, ang, 4.4));
            }
          } else {
            this.shootTimer = 42;
            for (let offset of [-0.45, 0, 0.45]) {
              if (offset < 0 && this.leftPodDestroyed) continue;
              if (offset > 0 && this.rightPodDestroyed) continue;
              enemyProjectiles.push(new EnemyProjectile(this.x, this.y + 20, baseAngle + offset, 4.3));
            }
          }
        } else if (this.type === 'boss_chrono') {
          if (this.phase === 2) {
            this.shootTimer = 22;
            this.spiralAngle += 0.52;
            for (let s = 0; s < 12; s++) {
              const ang = this.spiralAngle + (s * Math.PI / 6);
              if (Math.cos(ang) < -0.2 && this.leftPodDestroyed) continue;
              if (Math.cos(ang) > 0.2 && this.rightPodDestroyed) continue;
              enemyProjectiles.push(new EnemyProjectile(this.x, this.y + 15, ang, 4.8));
            }
          } else {
            this.shootTimer = 38;
            for (let offset of [-0.5, -0.25, 0, 0.25, 0.5]) {
              if (offset < 0 && this.leftPodDestroyed) continue;
              if (offset > 0 && this.rightPodDestroyed) continue;
              enemyProjectiles.push(new EnemyProjectile(this.x, this.y + 20, baseAngle + offset, 4.2));
            }
          }
        } else if (this.type === 'boss_apex') {
          if (this.phase === 2) {
            this.shootTimer = 20;
            this.spiralAngle += 0.42;
            for (let s = 0; s < 14; s++) {
              const ang = this.spiralAngle + (s * Math.PI / 7);
              if (Math.cos(ang) < -0.2 && this.leftPodDestroyed) continue;
              if (Math.cos(ang) > 0.2 && this.rightPodDestroyed) continue;
              enemyProjectiles.push(new EnemyProjectile(this.x, this.y + 15, ang, 5.0));
            }
          } else {
            this.shootTimer = 34;
            for (let offset of [-0.35, -0.15, 0.15, 0.35]) {
              if (offset < 0 && this.leftPodDestroyed) continue;
              if (offset > 0 && this.rightPodDestroyed) continue;
              enemyProjectiles.push(new EnemyProjectile(this.x, this.y + 20, baseAngle + offset, 4.5));
            }
          }
        }
      }
    } else if (this.type === 'cargo_freighter') {
      this.y += this.speedY * dt;
      this.x += this.speedX * dt;
      if (this.x < 35) {
        this.x = 35;
        this.speedX = Math.abs(this.speedX);
      } else if (this.x > screenWidth - 35) {
        this.x = screenWidth - 35;
        this.speedX = -Math.abs(this.speedX);
      }
    } else if (this.type === 'cruiser') {
      this.y += this.speedY * dt;
      this.x += this.speedX * dt;

      // Kruvazör kaçmaz! Üst-orta savaş bölgesinde kalır ve oyuncuyu taciz eder
      if (this.y > screenHeight * 0.48 && this.speedY > 0) {
        this.speedY = -Math.abs(this.speedY);
      } else if (this.y < 75 && this.speedY < 0) {
        this.speedY = Math.abs(this.speedY);
      }

      this.shootTimer -= dt;
      if (this.shootTimer <= 0) {
        this.shootTimer = 85;
        const angle = Math.atan2(playerY - this.y, playerX - this.x);
        enemyProjectiles.push(new EnemyProjectile(this.x, this.y + 15, angle, 3.8));
      }
    } else if (this.type === 'dive_bomber') {
      if (!this.isDiving) {
        this.y += this.speedY * dt;
        if (this.y > 80 && Math.abs(this.x - playerX) < 180) {
          this.isDiving = true;
          this.diveTimer = 22;
          this.diveTargetAngle = Math.atan2(playerY - this.y, playerX - this.x);
        }
        if (this.y > screenHeight - 90 && this.speedY > 0) {
          this.speedY = -Math.abs(this.speedY);
        } else if (this.y < 65 && this.speedY < 0) {
          this.speedY = Math.abs(this.speedY);
        }
      } else if (this.diveTimer > 0) {
        this.diveTimer -= dt;
        this.y += 0.4 * dt;
      } else {
        // Hızlı açılı dalış
        this.x += Math.cos(this.diveTargetAngle) * this.diveSpeed * dt;
        this.y += Math.sin(this.diveTargetAngle) * this.diveSpeed * dt;
        // Dalış tamamlanınca ve alt sınıra yaklaşınca yukarı geri tırman
        if (this.y > screenHeight - 75) {
          this.isDiving = false;
          this.diveTimer = 35;
          this.y = screenHeight - 78;
          this.speedY = -1.2;
        }
      }
    } else if (this.type === 'escort_fighter') {
      // Güdümlü Boss Muhafızı: Oyuncunun yönüne doğru yumuşak kavisle döner ve takip eder
      const targetAngle = Math.atan2(playerY - this.y, playerX - this.x);
      let diff = targetAngle - this.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.angle += diff * Math.min(1, 0.045 * dt);

      this.x += Math.cos(this.angle) * this.speed * dt;
      this.y += Math.sin(this.angle) * this.speed * dt;

      // Ekran altına kaçamaz, oyuncunun etrafında döner
      if (this.y > screenHeight - 65) {
        this.y = screenHeight - 65;
        this.angle = -Math.PI / 2;
      }

      this.shootTimer -= dt;
      if (this.shootTimer <= 0 && this.y < playerY - 30) {
        this.shootTimer = 100 + Math.random() * 40;
        enemyProjectiles.push(new EnemyProjectile(this.x, this.y + 10, this.angle, 3.8));
      }
    } else if (this.type === 'elite_scout') {
      // Altın Elit Avcı: Sinüsoidal süzülme ve ikili plazma atışı
      this.time += dt;
      this.x += Math.sin(this.time * this.sineFreq) * this.sineAmp * dt;
      this.y += this.speedY * dt;

      if (this.y > screenHeight - 80 && this.speedY > 0) {
        this.speedY = -Math.abs(this.speedY);
      } else if (this.y < 65 && this.speedY < 0) {
        this.speedY = Math.abs(this.speedY);
      }

      this.shootTimer -= dt;
      if (this.shootTimer <= 0) {
        this.shootTimer = 50 + Math.random() * 25;
        const angle = Math.atan2(playerY - this.y, playerX - this.x);
        enemyProjectiles.push(new EnemyProjectile(this.x - 8, this.y + 10, angle, 4.0));
        enemyProjectiles.push(new EnemyProjectile(this.x + 8, this.y + 10, angle, 4.0));
      }
    } else {
      // Normal asteroidler
      this.y += this.speedY * dt;
      this.x += this.speedX * dt;
    }

    if (this.affix === 'teleporter') {
      this.teleportTimer = (this.teleportTimer || 0) + dt;
      if (this.teleportTimer >= 180) {
        this.teleportTimer = 0;
        this.x = 30 + Math.random() * (screenWidth - 60);
      }
    }

    // Düşmanların ve meteorların sağa sola kaçmasını engelle! (Arena Sınırları)
    const minX = this.radius + 8;
    const maxX = screenWidth - this.radius - 8;
    if (this.x < minX) {
      this.x = minX;
      if (this.speedX) this.speedX = Math.abs(this.speedX);
    } else if (this.x > maxX) {
      this.x = maxX;
      if (this.speedX) this.speedX = -Math.abs(this.speedX);
    }

    // Yalnızca ekranın altına çarpan asteroidler temizlenir
    if (this.y > screenHeight + 40 && this.shape) {
      this.toRemove = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Hit-Flash: Düşman hasar aldığında beyaz flaş
    if (this.hitFlash > 0) {
      this.hitFlash -= 1;
    }

    // Kriyojenik Donma Aurası
    if (this.frozen > 0) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Mini-Elit Şampiyon Aurası
    if (this.isChampion) {
      ctx.save();
      const auraColor = this.affix === 'swift' ? '#ffbe0b' : (this.affix === 'shielded' ? '#00f0ff' : '#bf5af2');
      ctx.strokeStyle = auraColor;
      ctx.lineWidth = 2.2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 1.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    if (this.type === 'volatile_core') {
      this.pulseAngle = (this.pulseAngle || 0) + 0.05;
      const pulse = Math.sin(this.pulseAngle) * 3;
      // Dış Tehlike Çemberi
      ctx.save();
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.rotate(this.pulseAngle);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Plazma Çekirdeği
      ctx.save();
      ctx.fillStyle = '#ff0055';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius - 4 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // 8-bit Retro Pixel Çekirdek İkonu
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, -4, 4, 2);
      ctx.fillRect(-4, -2, 8, 4);
      ctx.fillRect(-2, 2, 4, 2);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(-1, -1, 2, 2);
      ctx.restore();
      ctx.restore();
      return;
    }

    if (this.shape) {
      // Asteroid Çizimi (Yüksek Kontrastlı, Net ve Parlak Uzay Kayası)
      ctx.rotate(this.rot);

      let fillColor = '#1e293b';
      let crackColor = '#38bdf8';
      let strokeColor = '#94a3b8';

      if (this.type === 'asteroid_bomb') {
        fillColor = '#3b0d1a';
        crackColor = '#ff3d00';
        strokeColor = '#ff0055';
      } else if (this.type === 'asteroid_gold') {
        fillColor = '#3d2e05';
        crackColor = '#ffd700';
        strokeColor = '#ffbe0b';
      } else if (this.sector === 'magma') {
        fillColor = '#381206';
        crackColor = '#ff9100';
        strokeColor = '#ff5500';
      } else if (this.sector === 'toxic') {
        fillColor = '#062c19';
        crackColor = '#05ffa1';
        strokeColor = '#10b981';
      } else if (this.sector === 'quantum') {
        fillColor = '#1e1438';
        crackColor = '#38bdf8';
        strokeColor = '#c084fc';
      }

      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = fillColor;
      ctx.lineWidth = 2.4;

      ctx.beginPath();
      ctx.moveTo(this.shape[0].x, this.shape[0].y);
      for (let i = 1; i < this.shape.length; i++) {
        ctx.lineTo(this.shape[i].x, this.shape[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // İç Enerji / Lav / Asit / Kuantum Çatlağı
      ctx.strokeStyle = crackColor;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(this.shape[0].x * 0.35, this.shape[0].y * 0.35);
      ctx.lineTo(this.shape[2].x * 0.25, this.shape[2].y * 0.25);
      ctx.lineTo(this.shape[4].x * 0.45, this.shape[4].y * 0.45);
      ctx.stroke();

      // Bomba Asteroid Çekirdeği & Tehlike İşareti
      if (this.type === 'asteroid_bomb') {
        const pulse = 0.5 + Math.sin(this.rot * 4) * 0.5;
        ctx.fillStyle = `rgba(255, 60, 0, ${0.4 + pulse * 0.5})`;
        ctx.beginPath();
        ctx.arc(0, 0, 8 + pulse * 3, 0, Math.PI * 2);
        ctx.fill();

        // 8-bit Retro Pixel Elektrik Arkı
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-1, -4, 3, 2);
        ctx.fillRect(-3, -2, 4, 2);
        ctx.fillRect(-1, 0, 3, 2);
        ctx.fillRect(0, 2, 2, 2);
      }

      // Altın İkram Asteroiti (Hızlı Başlangıç & Seviye 2 Dopingi)
      if (this.type === 'asteroid_gold') {
        const pulse = 0.5 + Math.sin(this.rot * 6) * 0.5;
        ctx.fillStyle = `rgba(255, 215, 0, ${0.8 + pulse * 0.2})`;
        ctx.beginPath();
        ctx.arc(0, 0, 7 + pulse * 2, 0, Math.PI * 2);
        ctx.fill();

        // 8-bit Retro Pixel Altın Yıldız
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-1, -4, 2, 8);
        ctx.fillRect(-4, -1, 8, 2);
        ctx.fillRect(-2, -2, 4, 4);
        ctx.fillStyle = '#ffbe0b';
        ctx.fillRect(-1, -1, 2, 2);
      }

      // Küçük Asteroit İçi Parıldayan Kristal Çekirdek (Yetenek / Zengin XP Kaynağı)
      if (this.type === 'asteroid_s') {
        const pulse = 0.5 + Math.sin(this.rot * 5) * 0.5;
        ctx.fillStyle = `rgba(5, 255, 161, ${0.65 + pulse * 0.35})`;
        ctx.beginPath();
        ctx.arc(0, 0, 4.5 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.type === 'cargo_freighter') {
      // Zırhlı Kozmik Kargo Taşıyıcı
      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2.4;

      ctx.beginPath();
      ctx.moveTo(0, this.radius);
      ctx.lineTo(-this.radius * 0.9, this.radius * 0.4);
      ctx.lineTo(-this.radius * 0.9, -this.radius * 0.5);
      ctx.lineTo(0, -this.radius);
      ctx.lineTo(this.radius * 0.9, -this.radius * 0.5);
      ctx.lineTo(this.radius * 0.9, this.radius * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const cargoPulse = 0.5 + Math.sin((this.y || 0) * 0.1) * 0.5;
      ctx.fillStyle = `rgba(255, 215, 0, ${0.4 + cargoPulse * 0.6})`;
      ctx.fillRect(-this.radius * 0.45, -this.radius * 0.35, this.radius * 0.9, this.radius * 0.7);

      // 8-bit Retro Pixel Kargo Sandığı
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(-5, -4, 10, 8);
      ctx.fillStyle = '#030816';
      ctx.fillRect(-3, -2, 6, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, -2, 2, 4);
      ctx.fillRect(-3, -1, 6, 2);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(-1, -1, 2, 2);
    } else if (this.type === 'scout') {
      // 8-bit Retro Piksel Avcı Gemi
      this.drawPixelShip(ctx, 'scout');
    } else if (this.type === 'cruiser') {
      // 8-bit Retro Piksel Zırhlı Kruvazör
      this.drawPixelShip(ctx, 'cruiser');
    } else if (this.isBoss) {
      this.drawPixelArtBoss(ctx);
    } else if (this.type === 'dive_bomber') {
      // 8-bit Retro Piksel Kamikaze Avcı
      const angle = this.isDiving && this.diveTimer <= 0 ? this.diveTargetAngle - Math.PI / 2 : 0;
      ctx.rotate(angle);
      this.drawPixelShip(ctx, 'dive_bomber');
    } else if (this.type === 'escort_fighter') {
      // 8-bit Retro Piksel Boss Muhafızı
      ctx.rotate(this.angle - Math.PI / 2);
      this.drawPixelShip(ctx, 'escort_fighter');
    } else if (this.type === 'elite_scout') {
      // 8-bit Retro Piksel Altın Elit Avcı
      const pulse = 0.5 + Math.sin(this.time * 0.1) * 0.5;
      ctx.strokeStyle = `rgba(255, 190, 11, ${0.4 + pulse * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 1.35, 0, Math.PI * 2);
      ctx.stroke();
      this.drawPixelShip(ctx, 'elite_scout');
    }

    ctx.restore();
  }

  
  drawPixelShip(ctx, spriteKey) {
    const sprite = PIXEL_SHIPS[spriteKey];
    if (!sprite) return;
    const p = sprite.p;
    const rows = sprite.rows;
    const h = rows.length;
    const offsetY = -(h * p) / 2;

    ctx.save();

    for (let y = 0; y < h; y++) {
      const row = rows[y];
      const py = offsetY + y * p;
      for (let x = 0; x < row.length; x++) {
        const val = row[x];
        if (val === 0) continue;
        let col = sprite.palette[val];
        if (val === 2) col = this.color || col;
        if (val === 6 && Math.random() < 0.3) col = '#ffffff';

        ctx.fillStyle = col;
        // Sağ yarı
        ctx.fillRect(x * p, py, p, p);
        // Sol yarı (simetrik yansıma)
        if (x > 0) {
          ctx.fillRect(-x * p, py, p, p);
        }
      }
    }
    ctx.restore();
  }

  drawPixelArtBoss(ctx) {
    const info = Enemy.getBossInfo(this.type);
    const isEnraged = this.phase === 2;
    const bossType = (this.type === 'boss') ? 'boss_dreadnought' : this.type;
    const sprite = PIXEL_BOSSES[bossType] || PIXEL_BOSSES.boss_dreadnought;
    const p = sprite.p;

    const curNeon = isEnraged ? info.enragedColor : info.color;
    const curCore = isEnraged ? '#ff1744' : info.coreColor;

    ctx.save();

    const rows = sprite.rows;
    const h = rows.length;
    const offsetY = - (h * p) / 2;

    // 1. Simetrik Piksel Izgara Çizimi
    for (let y = 0; y < h; y++) {
      const row = rows[y];
      const py = offsetY + y * p;

      for (let x = 0; x < row.length; x++) {
        const val = row[x];
        if (val === 0) continue;

        let col = sprite.palette[val];
        if (val === 2) col = curNeon;
        else if (val === 4) col = curCore;
        else if (val === 6) {
          col = Math.random() > 0.35 ? '#ffbe0b' : '#ff3d00';
        }

        ctx.fillStyle = col;
        // Sağ yarı
        ctx.fillRect(x * p, py, p, p);
        // Sol yarı (simetrik yansıma)
        if (x > 0) {
          ctx.fillRect(-x * p, py, p, p);
        }
      }
    }

    // 2. Bossa Özel Piksel ve Efekt Detayları:
    if (bossType === 'boss_nebula') {
      // Dönen 4 adet piksel uydu kalkanı
      ctx.save();
      ctx.rotate(this.shieldPlateAngle);
      for (let s = 0; s < 4; s++) {
        const ang = (s * Math.PI / 2);
        const orbitR = this.radius * 1.35;
        const px = Math.cos(ang) * orbitR;
        const py = Math.sin(ang) * orbitR;

        ctx.fillStyle = curNeon;
        ctx.fillRect(px - 5, py - 5, 10, 10);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px - 2, py - 2, 4, 4);

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(px, py);
        ctx.stroke();
      }
      ctx.restore();
    } else if (bossType === 'boss_titan') {
      // Demir Titan: Göz yuvalarında parlayan yeşil scanline
      const pulse = Math.sin(Date.now() * 0.008) * 2;
      ctx.fillStyle = isEnraged ? '#ff1744' : '#05ffa1';
      ctx.fillRect(-14, -6 + pulse, 6, 2);
      ctx.fillRect(8, -6 + pulse, 6, 2);
    } else if (bossType === 'boss_chrono') {
      // Kronos: Solar enerji çemberi
      ctx.strokeStyle = `rgba(255, 190, 11, ${isEnraged ? 0.6 : 0.35})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 1.25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (bossType === 'boss_apex') {
      // Kuantum Apex: Boyutsal faz halkası
      ctx.strokeStyle = `rgba(192, 132, 252, ${0.4 + Math.sin(Date.now() * 0.005) * 0.3})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 1.2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Öfke Modu (Phase 2) Elektrik Kıvılcımları
    if (isEnraged) {
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 1.5;
      for (let k = 0; k < 3; k++) {
        const rAng = Math.random() * Math.PI * 2;
        const rDist = this.radius * (0.8 + Math.random() * 0.4);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rAng) * rDist, Math.sin(rAng) * rDist);
        ctx.stroke();
      }
    }

    // 4. Kırılabilir Pod Hasarı & Savunmasız Çekirdek (Weakpoint)
    if (this.leftPodDestroyed) {
      ctx.fillStyle = 'rgba(255, 23, 68, 0.85)';
      ctx.beginPath();
      ctx.arc(-this.radius * 0.72, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      if (Math.random() < 0.35) {
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(-this.radius * 0.72 - 3, -3, 6, 6);
      }
    }
    if (this.rightPodDestroyed) {
      ctx.fillStyle = 'rgba(255, 23, 68, 0.85)';
      ctx.beginPath();
      ctx.arc(this.radius * 0.72, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      if (Math.random() < 0.35) {
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(this.radius * 0.72 - 3, -3, 6, 6);
      }
    }
    // Her iki pod yoksa: Açık Savunmasız Çekirdek
    if (this.leftPodDestroyed && this.rightPodDestroyed) {
      const corePulse = 0.5 + Math.sin(Date.now() * 0.012) * 0.5;
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 2.2;
      ctx.strokeRect(-9, -9, 18, 18);
      ctx.fillStyle = `rgba(255, 230, 0, ${0.45 + corePulse * 0.55})`;
      ctx.beginPath();
      ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Boss Saldırı Nişanlama Telegrafı (Attack Telegraphing Warning)
    if (this.shootTimer <= 10 && this.shootTimer > 0) {
      const alpha = (1 - this.shootTimer / 10) * 0.75;
      ctx.save();
      ctx.strokeStyle = isEnraged ? `rgba(255, 23, 68, ${alpha})` : `rgba(255, 190, 11, ${alpha})`;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, this.radius * 0.7);
      ctx.lineTo(0, this.radius * 3.8);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Namlu ağzı yoğunlaşan enerji parlaması
      ctx.fillStyle = isEnraged ? '#ff1744' : '#ffbe0b';
      ctx.beginPath();
      ctx.arc(0, this.radius * 0.7, 3 + (1 - this.shootTimer / 10) * 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Hit-Flash beyaz parıltı katmanı
    if (this.hitFlash > 0) {
      ctx.globalAlpha = Math.min(0.6, this.hitFlash * 0.15);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }
}

// === DÜŞMAN MERMİSİ ===
export class EnemyProjectile {
  constructor(x, y, angle, speed) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.radius = 4;
    this.toRemove = false;
  }

  update(screenWidth, screenHeight, dt = 1.0) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.y > screenHeight + 20 || this.y < -20 || this.x < -20 || this.x > screenWidth + 20) {
      this.toRemove = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const p = 1.8;

    // Net Görüş Konturu: Dış karanlık hat (Nebula ve patlamalarda mermi kaçmaz)
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 2.4;
    ctx.strokeRect(-3.2 * p, -2.2 * p, 6.4 * p, 4.4 * p);

    // 8-bit Retro Piksel Plazma Mermisi
    ctx.fillStyle = 'rgba(255, 0, 85, 0.4)';
    ctx.fillRect(-3 * p, -2 * p, 6 * p, 4 * p);
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(-2 * p, -1.5 * p, 5 * p, 3 * p);
    ctx.fillStyle = '#ffbe0b';
    ctx.fillRect(-p, -p, 3 * p, 2 * p);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, -0.5 * p, 2 * p, p);

    ctx.restore();
  }
}

// === XP / ENERJİ KRİSTALİ ===
export class Gem {
  constructor(x, y, value = 1) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.radius = value >= 10 ? 7 : (value >= 3 ? 5 : 3.5);
    this.color = value >= 10 ? '#ffbe0b' : (value >= 3 ? '#05ffa1' : '#00f0ff');
    this.toRemove = false;
    this.pulse = Math.random() * Math.PI * 2;
    this.speedY = 0.55 + Math.random() * 0.3; // Arka planla birlikte yavaş ve akıcı süzülme
    this.vx = 0;
    this.vy = 0;
  }

  update(playerX, playerY, magnetDistance, dt = 1.0) {
    this.pulse += 0.06 * dt;
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.hypot(dx, dy);

    // Mıknatıs çekim menzili: Sadece oyuncu yaklaştığında yumuşak ve tatmin edici şekilde çekilir
    if (dist < magnetDistance) {
      const pull = Math.min(9, (magnetDistance - dist) * 0.08 + 2.4);
      this.vx = (this.vx || 0) * 0.82 + (dx / (dist || 1)) * pull * 0.55;
      this.vy = (this.vy || 0) * 0.82 + (dy / (dist || 1)) * pull * 0.55;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    } else {
      this.vx = 0;
      this.vy = 0;
      this.x += Math.sin(this.pulse) * 0.35 * dt;
      this.y += this.speedY * dt;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    const pulseOffset = Math.sin(this.pulse) * 0.4;
    const p = (this.value >= 10 ? 2.4 : (this.value >= 3 ? 1.8 : 1.3)) + pulseOffset * 0.2;

    // 8-bit Retro Piksel Kristal Deseni
    const gemRows = [
      [0, 1, 0],
      [1, 2, 1],
      [1, 3, 2],
      [1, 2, 1],
      [0, 1, 0]
    ];
    const gh = gemRows.length;
    const gOffsetY = -(gh * p) / 2;

    for (let y = 0; y < gh; y++) {
      const row = gemRows[y];
      const py = gOffsetY + y * p;
      for (let x = 0; x < row.length; x++) {
        const val = row[x];
        if (val === 0) continue;
        ctx.fillStyle = val === 3 ? '#ffffff' : (val === 2 ? this.color : 'rgba(255, 255, 255, 0.75)');
        ctx.fillRect(x * p, py, p, p);
        if (x > 0) ctx.fillRect(-x * p, py, p, p);
      }
    }
    ctx.restore();
  }
}

// === DÜŞEN GÜÇLENDİRME KAPSÜLÜ (LOOT / POWER-UP) ===
export class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 'overcharge', 'shield', 'magnet', 'nuke'
    this.radius = 16;
    this.toRemove = false;
    this.pulse = Math.random() * Math.PI * 2;
    this.speedY = 0.85;
    this.life = 750; // ~12.5 saniye ekranda kalır

    switch (type) {
      case 'overcharge':
        this.color = '#bf5af2';
        this.icon = 'overcharge';
        this.name = 'AŞIRI GÜÇ';
        break;
      case 'shield':
        this.color = '#00f0ff';
        this.icon = 'shield';
        this.name = 'KALKAN';
        break;
      case 'magnet':
        this.color = '#05ffa1';
        this.icon = 'magnet';
        this.name = 'VAKUM';
        break;
      case 'nuke':
        this.color = '#ffbe0b';
        this.icon = 'nuke';
        this.name = 'EMP BOMBA';
        break;
    }
  }

  update(screenHeight, dt = 1.0) {
    this.pulse += 0.08 * dt;
    this.life -= dt;
    this.y += this.speedY * dt;
    if (this.life <= 0 || this.y > screenHeight + 40) {
      this.toRemove = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Kapsül yanıp sönme (ömrü azaldığında)
    if (this.life < 150 && Math.floor(this.life / 8) % 2 === 0) {
      ctx.restore();
      return;
    }

    const scale = 1 + Math.sin(this.pulse) * 0.08;
    ctx.scale(scale, scale);

    // Dış Neon Altıgen Halka
    ctx.strokeStyle = this.color;
    ctx.fillStyle = 'rgba(10, 15, 30, 0.88)';
    ctx.lineWidth = 2.2;

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI / 3) + (this.pulse * 0.35);
      const px = Math.cos(angle) * this.radius;
      const py = Math.sin(angle) * this.radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 8-bit Retro-Pixel Güçlendirme Sembolleri (Sıfır Emoji!)
    if (this.type === 'overcharge') {
      // 8-bit Pixel Şimşek
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, -7, 4, 3);
      ctx.fillRect(-3, -4, 5, 4);
      ctx.fillRect(-1, 0, 4, 3);
      ctx.fillRect(0, 3, 2, 4);
    } else if (this.type === 'shield') {
      // 8-bit Pixel Kalkan
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5, -6, 10, 2);
      ctx.fillRect(-6, -4, 12, 5);
      ctx.fillRect(-4, 1, 8, 3);
      ctx.fillRect(-2, 4, 4, 2);
      ctx.fillStyle = this.color;
      ctx.fillRect(-3, -3, 6, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, -1, 2, 2);
    } else if (this.type === 'magnet') {
      // 8-bit Pixel Mıknatıs
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5, -6, 3, 8);
      ctx.fillRect(2, -6, 3, 8);
      ctx.fillRect(-3, 0, 6, 2);
      ctx.fillStyle = '#ff0055';
      ctx.fillRect(-5, -6, 3, 3);
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(2, -6, 3, 3);
    } else if (this.type === 'nuke') {
      // 8-bit Pixel EMP Sismik Nükleer Çekirdek
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, -6, 4, 2);
      ctx.fillRect(-4, -4, 8, 8);
      ctx.fillRect(-2, 4, 4, 2);
      ctx.fillStyle = '#030816';
      ctx.fillRect(-1, -2, 2, 4);
      ctx.fillRect(-3, -1, 6, 2);
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(-1, -1, 2, 2);
    }

    ctx.restore();
  }
}

// === ALTIN KOZMİK SANDIK (LUCKY CHEST) ===
export class LuckyChest {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.toRemove = false;
    this.pulse = 0;
    this.speedY = 0.55;
    this.life = 900; // 15 saniye ekranda kalır
  }

  update(screenHeight, dt = 1.0) {
    this.pulse += 0.07 * dt;
    this.life -= dt;
    this.y += this.speedY * dt;
    if (this.life <= 0 || this.y > screenHeight + 40) {
      this.toRemove = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Kapsül yanıp sönme (ömrü azaldığında)
    if (this.life < 150 && Math.floor(this.life / 8) % 2 === 0) {
      ctx.restore();
      return;
    }

    const scale = 1 + Math.sin(this.pulse) * 0.08;
    ctx.scale(scale, scale);

    // 8-bit Retro Piksel Lucky Chest (Altın Kozmik Sandık)
    const p = 2.4;
    const chestPalette = {
      1: '#1c1917',
      2: '#ffbe0b',
      3: '#ffffff',
      4: '#00f0ff',
      5: '#ff3d00',
      6: '#ffe600'
    };
    const chestRows = [
      [0, 2, 2, 2, 2, 2, 0],
      [2, 3, 6, 6, 6, 3, 2],
      [2, 6, 1, 4, 1, 6, 2],
      [2, 2, 2, 4, 2, 2, 2],
      [2, 6, 1, 1, 1, 6, 2],
      [2, 5, 6, 6, 6, 5, 2],
      [0, 2, 2, 0, 2, 2, 0]
    ];
    const ch = chestRows.length;
    const cOffsetY = -(ch * p) / 2;

    ctx.save();
    for (let y = 0; y < ch; y++) {
      const row = chestRows[y];
      const py = cOffsetY + y * p;
      for (let x = 0; x < row.length; x++) {
        const val = row[x];
        if (val === 0) continue;
        ctx.fillStyle = chestPalette[val];
        ctx.fillRect(x * p, py, p, p);
        if (x > 0) ctx.fillRect(-x * p, py, p, p);
      }
    }
    ctx.restore();

    ctx.restore();
  }
}

