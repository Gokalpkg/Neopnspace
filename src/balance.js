// === NEON SPACE SURVIVOR - MERKEZİ DENGE, STİL DNA'SI VE EKONOMİ ANAYASASI (BalanceConfig) ===
// KURAL 1 (Stil DNA'sı & 60-30-10 Renk Paleti), KURAL 2 (AI Görsel Prompt Şablonları),
// KURAL 3 (Süre Çapalı Matematiksel Ekonomi & Gemi Al-Ver Dengesi), KURAL 4 (Veri Odaklı Mimari)

export const THEME_PALETTE = {
  // %60 Ana Uzay / Göz Yormayan Koyu Lacivert Zemin (Çiğ siyah #000000 yasak)
  bgDeepSpace: '#070B19',
  bgVoidNavy: '#070B19',
  // %30 Kart ve Panel Gövdesi + Çerçeve Konturu
  cardSurface: '#111827',
  cardBorder: '#1E293B',
  // %10 Birincil CTA / Ödül / Tehdit Vurguları
  primaryCyan: '#00F0FF',
  primaryElectricCyan: '#00F0FF',
  rewardGold: '#FFBE0B',
  secondarySolarGold: '#FFBE0B',
  threatCrimson: '#FF0055',
  // Metin & Parlak Kenar Işığı (Çiğ beyaz #FFFFFF yerine sıcak krem beyazı)
  textCream: '#F8FAFC',
  textWarmCream: '#F8FAFC'
};

// KURAL 2: Sabit Yapay Zeka Görsel Üretim (Image Prompting) Şablonu
export const ART_BIBLE_PROMPT_TEMPLATE = {
  styleDnaLock: 'casual mobile game icon style, Supercell and Habby arcade art style, stylized 3D resin toy texture with retro neon pixel-art accents, soft glossy gradients, thick dark navy clean outline (#070B19), vibrant saturated colors',
  cameraAndLight: 'Centered, single isolated object, slight 15-degree front-top tilt, warm top-left key light, bright cyan/gold bottom-right rim light, readable at small mobile icon size',
  backgroundIsolation: 'Solid flat pure white background (#FFFFFF), no ground shadow spilling outside',
  negativeRules: 'No text, no letters, no realistic photo textures, no thin messy lines, no cluttered background, no sharp/scary edges, no complex micro-details',
  buildPrompt(subjectDescription) {
    return `${subjectDescription}, ${this.styleDnaLock}, ${this.cameraAndLight}, ${this.backgroundIsolation}. --no ${this.negativeRules}`;
  }
};

// KURAL 3: Süre Çapası & Standart Matematiksel Formüller
// Ortalama 1 el = 90 saniye (~120 Kristal).
export const ECONOMY_FORMULAS = {
  anchorRunSeconds: 90,
  avgCrystalsPerRun: 120,
  costExponent: 1.22,
  // Maliyet = TemelFiyat * (1.22)^(Seviye - 1)
  calcExponentialCost(baseCost, level, mult = 1.22) {
    return Math.round(baseCost * Math.pow(mult, Math.max(0, level - 1)));
  },
  // Doğrusal Güç Artışı: Güç = TemelGüç + (Seviye * SabitArtış)
  calcLinearPower(basePower, level, stepPerLevel) {
    return basePower + (level * stepPerLevel);
  },
  generateCostLadder(baseCost, maxLevel = 10, mult = 1.22) {
    const ladder = [];
    for (let lvl = 1; lvl <= maxLevel; lvl++) {
      ladder.push(this.calcExponentialCost(baseCost, lvl, mult));
    }
    return ladder;
  }
};

// 6 Geminin Rol, Al-Ver (Trade-Off) ve Özel Yetenek Dengesi
export const SHIP_BALANCE = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'SİBERPUNK',
    title: 'Dengeli Çevik Avcı',
    primary: '#00f0ff', secondary: '#ff0077', cockpit: '#ff007f', flame: '#00f0ff',
    cost: 0,
    stats: { dmg: 100, shield: 100, speed: 105, magnet: 100 },
    dmgMult: 1.00,
    shieldMult: 1.00,
    speedMult: 1.05,
    magnetMult: 1.00,
    grazeFireRateBoost: 0.25, // +%25 seri ateş hızı (2 sn)
    grazeDurationFrames: 120,
    perkTitle: 'AŞIRI İTKİ',
    perk: 'Mermi sıyırmada (graze) 2 sn boyunca +%25 seri atış hızı ve +%20 manevra kazanır.'
  },
  solar: {
    id: 'solar',
    name: 'GÜNEŞ FIRTINASI',
    title: 'Ağır Topçu Kruvazörü',
    primary: '#ffbe0b', secondary: '#ff5722', cockpit: '#ff9100', flame: '#ff3d00',
    cost: 1800,
    stats: { dmg: 138, shield: 78, speed: 86, magnet: 85 },
    dmgMult: 1.38,
    shieldMult: 0.78,
    speedMult: 0.86,
    magnetMult: 0.85,
    solarFlareEveryNShots: 8, // Her 8. atışta alan hasarlı güneş küresi
    solarFlareDmgMult: 1.80,
    solarFlareBaseDmg: 6.5,
    perkTitle: 'GÜNEŞ PATLAMASI',
    perk: '+%38 Ağır Hasar! Her 8. atışta alanı yakan dev güneş plazması fırlatır (Kalkan/Hız -%15).'
  },
  toxic: {
    id: 'toxic',
    name: 'ZEHİR NEON',
    title: 'Hızlı Hasatçı & Biyo-Avcı',
    primary: '#05ffa1', secondary: '#7209b7', cockpit: '#b5179e', flame: '#05ffa1',
    cost: 3400,
    stats: { dmg: 96, shield: 92, speed: 128, magnet: 165 },
    dmgMult: 0.96,
    shieldMult: 0.92,
    speedMult: 1.28,
    magnetMult: 1.65,
    acidTrailDps: 2.6,
    perkTitle: 'ZÜMRÜT SÜZÜLME',
    perk: '+%65 Kristal Çekim Alanı, +%28 Hız ve arkasında düşmanları eriten biyo-asit izi bırakır.'
  },
  vortex: {
    id: 'vortex',
    name: 'VORTEX NEBULA',
    title: 'Alan Kontrol & Tekillik Avcısı',
    primary: '#bf5af2', secondary: '#38bdf8', cockpit: '#f0abfc', flame: '#c084fc',
    cost: 5200,
    stats: { dmg: 115, shield: 105, speed: 108, magnet: 130 },
    dmgMult: 1.15,
    shieldMult: 1.05,
    speedMult: 1.08,
    magnetMult: 1.30,
    singularityIntervalFrames: 450, // 7.5 saniyede bir mini karadelik
    singularityDurationFrames: 90,
    singularityRadius: 78,
    perkTitle: 'GİRDAP ÇEKİMİ',
    perk: 'Her 7.5 sn düşmanları yavaşlatıp kristalleri vakumlayan kuantum tekillik girdabı açar.'
  },
  phantom: {
    id: 'phantom',
    name: 'HAYALET PLAZMA',
    title: 'Kuantum Kalkan Siperi',
    primary: '#e0f7fa', secondary: '#00e5ff', cockpit: '#80deea', flame: '#00e5ff',
    cost: 7200,
    stats: { dmg: 106, shield: 148, speed: 108, magnet: 100 },
    dmgMult: 1.06,
    shieldMult: 1.48,
    speedMult: 1.08,
    magnetMult: 1.00,
    phaseDurationFrames: 65, // ~1.08 sn dokunulmaz faz
    phaseInvulnFrames: 65,
    phaseCooldownFrames: 720, // 12 sn bekleme süresi
    perkTitle: 'FAZ KALKANI',
    perk: '+%48 Kalkan Kapasitesi! Darbe aldığında 1.1 sn kuantum fazına geçerek hasarsızlık kazanır.'
  },
  chrono: {
    id: 'chrono',
    name: 'CHRONO APEX',
    title: 'Altın Zaman Taktisyeni',
    primary: '#ffd700', secondary: '#ffffff', cockpit: '#fef08a', flame: '#ffbe0b',
    cost: 9600,
    stats: { dmg: 122, shield: 112, speed: 110, magnet: 115 },
    dmgMult: 1.22,
    shieldMult: 1.12,
    speedMult: 1.10,
    magnetMult: 1.15,
    chronoNovaIntervalFrames: 660, // 11 saniyede bir 1.1 sn zaman dondurma (Eski: 8 sn'de bir 1.5 sn OP idi)
    chronoFreezeFrames: 66,
    chronoFreezeDurationFrames: 66,
    perkTitle: 'KRONO SÜPERNOVA',
    perk: 'Sekmeli altın diskler ateşler ve her 11 sn düşmanları 1.1 sn donduran zaman dalgası yayar.'
  }
};

// Atölye (Tech Workshop) Hissedilir Güç Artışı & Üstel Maliyet Tablosu
// Mikro +%2.5'lik zayıf artışlar yerine oyuncunun anında hissedeceği anlamlı kademeler
export const TECH_WORKSHOP_CONFIG = {
  damageBoost: {
    baseCost: 90,
    costMult: 1.22,
    maxLevel: 10,
    stepPct: 12, // Her seviyede +%12 Hasar (Max +%120)
    perLevelMult: 0.12,
    costs: ECONOMY_FORMULAS.generateCostLadder(90, 10, 1.22),
    scoreImpact: '+%12'
  },
  critChance: {
    baseCost: 95,
    costMult: 1.22,
    maxLevel: 10,
    stepPct: 4, // Her seviyede +%4 Kritik Şansı
    perLevelAdd: 0.04,
    costs: ECONOMY_FORMULAS.generateCostLadder(95, 10, 1.22),
    scoreImpact: '+%4'
  },
  shieldMax: {
    baseCost: 80,
    costMult: 1.22,
    maxLevel: 10,
    stepFlat: 15, // Her seviyede +15 Kalkan
    perLevelFlat: 15,
    costs: ECONOMY_FORMULAS.generateCostLadder(80, 10, 1.22),
    scoreImpact: '+15s'
  },
  hullMax: {
    baseCost: 75,
    costMult: 1.22,
    maxLevel: 10,
    stepFlat: 20, // Her seviyede +20 Maksimum Gövde Canı
    perLevelFlat: 20,
    costs: ECONOMY_FORMULAS.generateCostLadder(75, 10, 1.22),
    scoreImpact: '+20'
  },
  magnet: {
    baseCost: 65,
    costMult: 1.22,
    maxLevel: 8,
    stepFlat: 18, // Her seviyede +18px Çekim Alanı
    perLevelFlat: 18,
    costs: ECONOMY_FORMULAS.generateCostLadder(65, 8, 1.22),
    scoreImpact: '+18'
  },
  crystalBoost: {
    baseCost: 120,
    costMult: 1.22,
    maxLevel: 8,
    stepPct: 12, // Her seviyede +%12 Kristal Kazancı
    perLevelMult: 0.12,
    costs: ECONOMY_FORMULAS.generateCostLadder(120, 8, 1.22),
    scoreImpact: '+%12'
  },
  reactorCharge: {
    baseCost: 110,
    costMult: 1.22,
    maxLevel: 6,
    stepPct: 12, // Her seviyede +%12 Overdrive Şarj Hızı
    perLevelMult: 0.12,
    costs: ECONOMY_FORMULAS.generateCostLadder(110, 6, 1.22),
    scoreImpact: '+%12'
  },
  rerollCount: {
    baseCost: 220,
    costMult: 1.65,
    maxLevel: 4,
    stepFlat: 1, // Her seviyede +1 Kart Yenileme (Reroll)
    perLevelFlat: 1,
    costs: [220, 580, 1450, 3600],
    scoreImpact: '+1 ZAR'
  },
  phoenix: {
    baseCost: 850,
    costMult: 1.0,
    maxLevel: 3,
    stepFlat: 1,
    perLevelFlat: 1,
    costs: [850, 2600, 6800],
    scoreImpact: '+1 CAN'
  }
};

// Kesintisiz ve Doyurucu Düşman Doğum (Spawn) Akış Eğrisi
// "Neredeyse hiç düşman gelmiyor" sorununu kökünden çözen, ilk saniyeden itibaren aktif tempo
export const SPAWN_PACING = {
  getClassicPacing(gameTime, playerLevel) {
    if (gameTime < 12) {
      return { interval: 26, speedMult: 0.82, maxEnemies: 10 };
    }
    if (gameTime < 28 || playerLevel <= 2) {
      return { interval: 23, speedMult: 0.90, maxEnemies: 12 };
    }
    if (playerLevel === 3 || gameTime < 50) {
      return { interval: 20, speedMult: 0.98, maxEnemies: 14 };
    }
    if (gameTime < 85) {
      return { interval: 18, speedMult: 1.06, maxEnemies: 16 };
    }
    return {
      interval: Math.max(13, 18 - Math.floor((gameTime - 85) * 0.12)),
      speedMult: Math.min(1.42, 1.10 + (gameTime - 85) * 0.004),
      maxEnemies: 18
    };
  },
  getStormPacing(gameTime) {
    if (gameTime < 12) {
      return { interval: 24, speedMult: 0.85, maxEnemies: 11 };
    }
    if (gameTime < 30) {
      return { interval: 20, speedMult: 0.94, maxEnemies: 13 };
    }
    if (gameTime < 60) {
      return { interval: 17, speedMult: 1.05, maxEnemies: 16 };
    }
    if (gameTime < 100) {
      return { interval: 15, speedMult: 1.16, maxEnemies: 18 };
    }
    return {
      interval: Math.max(11, 15 - Math.floor((gameTime - 100) * 0.10)),
      speedMult: Math.min(1.60, 1.22 + (gameTime - 100) * 0.004),
      maxEnemies: 20
    };
  }
};
