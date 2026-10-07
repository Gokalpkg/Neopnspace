// === NEON SPACE SURVIVOR - ANA OYUN MOTORU ===
import { sounds } from './audio.js';
import { vibrate } from './vibration.js';
import { ParticleSystem } from './particles.js';
import { Enemy, EnemyProjectile, Gem, PowerUp, LuckyChest } from './enemies.js';
import { t, getCurrentLanguage, setLanguage, SUPPORTED_LANGUAGES, applyTranslationsToDOM } from './i18n.js';

// DOM Elemanları
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');
const startScreen = document.getElementById('start-screen');
const levelModal = document.getElementById('level-modal');
const gameoverModal = document.getElementById('gameover-modal');
const cardsContainer = document.getElementById('cards-container');

// Altın Uzay Sandığı (Lucky Chest) Modalı
const luckyChestModal = document.getElementById('lucky-chest-modal');
const luckyChestContainer = document.getElementById('lucky-chest-container');
const luckyChestTitle = document.getElementById('lucky-chest-title');
const luckyChestSubtitle = document.getElementById('lucky-chest-subtitle');
const jackpotBadge = document.getElementById('jackpot-badge');
const btnClaimChest = document.getElementById('btn-claim-chest');

// Duraklatma & Hangar Modalları
const pauseModal = document.getElementById('pause-modal');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');
const btnPauseSound = document.getElementById('btn-pause-sound');
const btnQuitMenu = document.getElementById('btn-quit-menu');

const hangarModal = document.getElementById('hangar-modal');
const btnHangar = document.getElementById('btn-hangar');
const btnHangarClose = document.getElementById('btn-hangar-close');
const totalCrystalsDisplay = document.getElementById('total-crystals-display');
const hangarCrystalsVal = document.getElementById('hangar-crystals-val');
const skinsContainer = document.getElementById('skins-container');
const trailsContainer = document.getElementById('trails-container');
const dronesContainer = document.getElementById('drones-container');
const tabBtnSkins = document.getElementById('tab-btn-skins');
const tabBtnTrails = document.getElementById('tab-btn-trails');
const tabBtnDrones = document.getElementById('tab-btn-drones');
const tabBtnBoosters = document.getElementById('tab-btn-boosters');
const tabBtnTech = document.getElementById('tab-btn-tech');
const tabBtnTrophies = document.getElementById('tab-btn-trophies');
const boostersContainer = document.getElementById('boosters-container');
const techContainer = document.getElementById('tech-container');
const techTabView = document.getElementById('tech-tab-view');
const btnResetTech = document.getElementById('btn-reset-tech');
const trophiesTabView = document.getElementById('trophies-tab-view');
const bossWarningOverlay = document.getElementById('boss-warning-overlay');
const bossWarningName = document.getElementById('boss-warning-name');

// Günlük Görevler Modalı
const missionsModal = document.getElementById('missions-modal');
const btnMissions = document.getElementById('btn-missions');
const btnMissionsClose = document.getElementById('btn-missions-close');
const missionsBadgeDot = document.getElementById('missions-badge-dot');
const missionsContainer = document.getElementById('missions-container');

// Pilot İstatistikleri Modalı & Olay Başlığı
const statsModal = document.getElementById('stats-modal');
const btnStats = document.getElementById('btn-stats');
const btnStatsClose = document.getElementById('btn-stats-close');
const statFlights = document.getElementById('stat-flights');
const statAsteroids = document.getElementById('stat-asteroids');
const statBosses = document.getElementById('stat-bosses');
const statCombo = document.getElementById('stat-combo');
const statTime = document.getElementById('stat-time');
const statCrystals = document.getElementById('stat-crystals');
const eventBanner = document.getElementById('event-banner');
const eventBannerText = document.getElementById('event-banner-text');

// Yeni Arayüz & Oyun İçi Özellik Elemanları
const ultimateBtnContainer = document.getElementById('ultimate-btn-container');
const btnUltimate = document.getElementById('btn-ultimate');
const ultimateChargeFill = document.getElementById('ultimate-charge-fill');
const ultimateLabel = document.getElementById('ultimate-label');
const btnAbility = document.getElementById('btn-ability');
const abilityCooldownFill = document.getElementById('ability-cooldown-fill');
const abilityLabel = document.getElementById('ability-label');
const abilityIcon = document.getElementById('ability-icon');


const miniQuestCard = document.getElementById('mini-quest-card');
const questTitle = document.getElementById('quest-title');
const questBarFill = document.getElementById('quest-bar-fill');
const questReward = document.getElementById('quest-reward');

const pauseQuestSection = document.getElementById('pause-quest-section');
const pauseQuestTitle = document.getElementById('pause-quest-title');
const pauseQuestBarFill = document.getElementById('pause-quest-bar-fill');
const pauseQuestReward = document.getElementById('pause-quest-reward');

const anomalyBanner = document.getElementById('anomaly-banner');
const anomalyIcon = document.getElementById('anomaly-icon');
const anomalyText = document.getElementById('anomaly-text');

const merchantModal = document.getElementById('merchant-modal');
const merchantItemsContainer = document.getElementById('merchant-items-container');
const merchantCrystalsDisplay = document.getElementById('merchant-crystals-display');
const btnMerchantClose = document.getElementById('btn-merchant-close');

const routeModal = document.getElementById('route-modal');
const routeChoicesContainer = document.getElementById('route-choices-container');

// HUD Elemanları
const xpBarFill = document.getElementById('xp-bar-fill');
const levelBadge = document.getElementById('level-badge');
const scoreDisplay = document.getElementById('score-display');
const comboDisplay = document.getElementById('combo-display');
const hpBarFill = document.getElementById('hp-bar-fill');
const shieldBarFill = document.getElementById('shield-bar-fill');
const waveDisplay = document.getElementById('wave-display');
const timerDisplay = document.getElementById('timer-display');
const bossBarContainer = document.getElementById('boss-bar-container');
const bossBarFill = document.getElementById('boss-bar-fill');
const recordBadge = document.getElementById('record-badge');

// Butonlar & Menü Elemanları
const btnStart = document.getElementById('btn-start');
const btnRestart = document.getElementById('btn-restart');
const modeClassic = document.getElementById('mode-classic');
const modeStorm = document.getElementById('mode-storm');
const scoreValClassic = document.getElementById('score-val-classic');
const scoreValStorm = document.getElementById('score-val-storm');
const btnMenuCrystals = document.getElementById('btn-menu-crystals');
const btnPrevShip = document.getElementById('btn-prev-ship');
const btnNextShip = document.getElementById('btn-next-ship');
const menuShipCard = document.getElementById('menu-ship-card');
const menuShipName = document.getElementById('menu-ship-name');
const menuShipStatus = document.getElementById('menu-ship-status');
const menuShipPerk = document.getElementById('menu-ship-perk');
const menuPilotRank = document.getElementById('menu-pilot-rank');
const menuPilotFlights = document.getElementById('menu-pilot-flights');
const btnDailyReward = document.getElementById('btn-daily-reward');
const dailyRewardDot = document.getElementById('daily-reward-dot');
const dailyRewardModal = document.getElementById('daily-reward-modal');
const btnClaimDaily = document.getElementById('btn-claim-daily');
const btnCloseDaily = document.getElementById('btn-close-daily');
const finalScore = document.getElementById('final-score');
const finalTime = document.getElementById('final-time');
const finalLevel = document.getElementById('final-level');
const finalHighScore = document.getElementById('final-high-score');
const finalCrystals = document.getElementById('final-crystals');
const btnGameOverHangar = document.getElementById('btn-gameover-hangar');
const btnGameOverMenu = document.getElementById('btn-gameover-menu');
const btnSoundToggle = document.getElementById('btn-sound-toggle');
const btnSoundMenu = document.getElementById('btn-sound-menu');
const btnVibrateMenu = document.getElementById('btn-vibrate-menu');

// 38 Seviyeli Sefer (Bölüm Seçim) & Zafer Modalı Elemanları
const levelSelectModal = document.getElementById('level-select-modal');
const levelGridContainer = document.getElementById('level-grid-container');
const btnCloseLevelSelect = document.getElementById('btn-close-level-select');
const levelCompleteModal = document.getElementById('level-complete-modal');
const victoryTitle = document.getElementById('victory-title');
const victorySubtitle = document.getElementById('victory-subtitle');
const victoryRewardCrystals = document.getElementById('victory-reward-crystals');
const victoryStarsRow = document.getElementById('victory-stars-row');
const btnNextLevel = document.getElementById('btn-next-level');
const btnVictoryHangar = document.getElementById('btn-victory-hangar');
const btnVictoryMenu = document.getElementById('btn-victory-menu');
const levelHudDisplay = document.getElementById('level-hud-display');
const modeStageDesc = document.getElementById('mode-stage-desc');
const levelDisplayCard = document.getElementById('level-display-card');

// === KOZMİK SEKTÖRLER (AŞAMA TEMALARI) ===
const SECTORS = {
  void: { id: 'void', name: 'SİBER NEON BOŞLUĞU', subtitle: 'SEKTÖR 1', color: '#00f0ff', accent: '#ff0077', icon: 'void' },
  magma: { id: 'magma', name: 'KIZIL MAGMA NEBULASI', subtitle: 'SEKTÖR 2', color: '#ff5500', accent: '#ffe600', icon: 'magma' },
  toxic: { id: 'toxic', name: 'ZÜMRÜT ASİT DİVRİĞİ', subtitle: 'SEKTÖR 3', color: '#05ffa1', accent: '#10b981', icon: 'toxic' },
  quantum: { id: 'quantum', name: 'KUANTUM AURORASI & UÇURUM', subtitle: 'SEKTÖR 4', color: '#c084fc', accent: '#00f0ff', icon: 'quantum' }
};

// === OYUN DURUMU ===
// === RETRO 8-BİT PİKSEL SVG İKON MOTORU ===
function getPixelIconSvg(name, size = 'sm') {
  const sClass = 'pixel-icon pixel-icon-' + size;
  const icons = {
    crystal: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M4 1h4v2H4zM2 3h8v2H2zM1 5h10v2H1zM2 7h8v2H2zM3 9h6v1H3zM4 10h4v1H4zM5 11h2v1H5z" fill="#00f0ff"/><rect x="4" y="3" width="2" height="2" fill="#fff"/></svg>',
    energy: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M6 0h4v3H6zM4 3h5v2H4zM2 5h6v2H2zM1 7h5v2H1zM3 9h2v1H3zM4 10h1v2H4z" fill="#ffbe0b"/></svg>',
    target: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M5 0h2v2H5zM5 10h2v2H5zM0 5h2v2H0zM10 5h2v2h-2zM3 3h6v1H3zM3 8h6v1H3zM3 4h1v4H3zM8 4h1v4H8zM5 5h2v2H5z" fill="#ff0055"/></svg>',
    shield: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M2 1h8v2H2zM1 3h10v4H1zM2 7h8v2H2zM3 9h6v1H3zM4 10h4v1H4zM5 11h2v1H5z" fill="#00f0ff"/><path d="M3 3h6v4H3z" fill="#0077ff"/></svg>',
    speed: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M0 4h7v1H0zM2 6h8v1H2zM0 8h6v1H0zM8 3h4v1H8zM9 5h3v2H9zM7 7h3v1H7z" fill="#05ffa1"/></svg>',
    magnet: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M1 1h4v4H1z" fill="#ff0055"/><path d="M7 1h4v4H7z" fill="#0077ff"/><path d="M1 5h4v3H1zM7 5h4v3H7zM2 8h8v2H2zM3 10h6v2H3z" fill="#94a3b8"/><rect x="2" y="2" width="2" height="1" fill="#fff"/><rect x="8" y="2" width="2" height="1" fill="#fff"/></svg>',
    dice: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M1 1h10v10H1z" fill="#1e1e38"/><rect x="2" y="2" width="8" height="8" fill="#2d2d5a"/><rect x="3" y="3" width="2" height="2" fill="#00f0ff"/><rect x="7" y="7" width="2" height="2" fill="#00f0ff"/><rect x="5" y="5" width="2" height="2" fill="#ff0055"/></svg>',
    fire: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M5 0c1 2 3 3 3 6 0 3-2 5-5 5s-5-2-5-5c0-3 3-4 3-6 0 2 1 3 2 3s2-1 2-3z" fill="#ff3d00"/><path d="M5 5c1 1 2 2 2 3 0 2-1 3-3 3s-3-1-3-3c0-1 1-2 2-3 0 1 1 1.5 1 1.5s1-0.5 1-1.5z" fill="#ffbe0b"/></svg>',
    skull: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M3 1h6v2H3zM2 3h8v4H2zM1 7h10v2H1zM3 9h6v1H3zM4 10h4v2H4z" fill="#ff0055"/><rect x="3" y="4" width="2" height="2" fill="#000"/><rect x="7" y="4" width="2" height="2" fill="#000"/></svg>',
    bomb: '<svg class="' + sClass + '" viewBox="0 0 12 12"><circle cx="6" cy="7" r="4" fill="#1e293b"/><path d="M6 1h2v2H6zM8 0h1v1H8z" fill="#ffbe0b"/><rect x="4" y="5" width="2" height="2" fill="#fff"/></svg>',
    gift: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M1 3h10v3H1z" fill="#e11d48"/><path d="M2 6h8v6H2z" fill="#be123c"/><rect x="5" y="3" width="2" height="9" fill="#fbbf24"/><path d="M3 1h3v2H3zM6 1h3v2H6z" fill="#f59e0b"/></svg>',
    crown: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M1 2l2 4 3-4 3 4 2-4v8H1z" fill="#ffd700"/><rect x="2" y="8" width="8" height="2" fill="#f59e0b"/></svg>',
    sword: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M9 1h2v2H9zM7 3h2v2H7zM5 5h2v2H5zM3 7h2v2H3zM1 10h2v2H1zM0 11h1v1H0zM4 8h1v1H4zM2 6h1v1H2z" fill="#00f0ff"/><path d="M2 9h2v1H2zM3 8h1v2H3z" fill="#e11d48"/></svg>',
    ship: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M5 1h2v2H5zM4 3h4v3H4zM3 6h6v3H3zM1 8h10v2H1zM0 10h3v2H0zM9 10h3v2H9z" fill="#00f0ff"/></svg>',
    pilot: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M3 2h6v2H3zM2 4h8v4H2zM3 8h6v2H3z" fill="#38bdf8"/><rect x="4" y="4" width="4" height="2" fill="#0369a1"/></svg>',
    hull: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M2 1h8v2H2zM1 3h10v5H1zM2 8h8v2H2zM4 10h4v2H4z" fill="#05ffa1"/><rect x="4" y="4" width="4" height="3" fill="#ffffff"/></svg>',
    repair: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M2 1h3v2H2zM7 1h3v2H7zM1 3h10v3H1zM2 6h8v2H2zM3 8h6v2H3zM4 10h4v1H4zM5 11h2v1H5z" fill="#ff0055"/><rect x="3" y="2" width="1" height="1" fill="#fff"/></svg>',
    freeze: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M5 0h2v12H5zM0 5h12v2H0zM2 2h2v2H2zM8 2h2v2H8zM2 8h2v2H2zM8 8h2v2H8z" fill="#00f0ff"/></svg>'
  };
  return icons[name] || '';
}


// === 8/16-BİT RETRO ARCADE OYUNCU GEMİ PİKSEL MOTORU ===
const PIXEL_PLAYER_SKINS = {
  cyberpunk: {
    p: 2.8,
    palette: {
      1: '#070b19',
      2: '#00f0ff',
      3: '#ffffff',
      4: '#ff0077',
      5: '#0ea5e9',
      6: '#00f0ff'
    },
    rows: [
      [2, 0, 0, 0, 0, 0, 0],
      [2, 3, 0, 0, 0, 0, 0],
      [1, 3, 2, 0, 0, 0, 0],
      [1, 3, 4, 2, 0, 0, 0],
      [1, 5, 4, 2, 0, 0, 0],
      [1, 5, 1, 2, 2, 0, 0],
      [1, 1, 5, 1, 2, 2, 4],
      [2, 1, 1, 5, 1, 2, 4],
      [2, 4, 1, 1, 5, 1, 2],
      [1, 4, 2, 1, 1, 5, 2],
      [0, 2, 1, 2, 0, 1, 2],
      [0, 0, 2, 1, 6, 6, 0],
      [0, 0, 0, 6, 6, 0, 0]
    ]
  },
  solar: {
    p: 2.8,
    palette: {
      1: '#1a0b04',
      2: '#ffbe0b',
      3: '#ffffff',
      4: '#ff3d00',
      5: '#d97706',
      6: '#ff9100'
    },
    rows: [
      [2, 0, 0, 0, 0, 0, 0],
      [2, 3, 0, 0, 0, 0, 0],
      [1, 3, 2, 0, 0, 0, 0],
      [1, 3, 4, 2, 0, 0, 0],
      [1, 5, 4, 2, 0, 0, 0],
      [1, 5, 1, 2, 2, 0, 0],
      [1, 1, 5, 1, 2, 2, 4],
      [2, 1, 1, 5, 1, 2, 4],
      [2, 4, 1, 1, 5, 1, 2],
      [1, 4, 2, 1, 1, 5, 2],
      [0, 2, 1, 2, 0, 1, 2],
      [0, 0, 2, 1, 6, 6, 0],
      [0, 0, 0, 6, 6, 0, 0]
    ]
  },
  toxic: {
    p: 2.8,
    palette: {
      1: '#04140b',
      2: '#05ffa1',
      3: '#ffffff',
      4: '#7209b7',
      5: '#10b981',
      6: '#05ffa1'
    },
    rows: [
      [2, 0, 0, 0, 0, 0, 0],
      [2, 3, 0, 0, 0, 0, 0],
      [1, 3, 2, 0, 0, 0, 0],
      [1, 3, 4, 2, 0, 0, 0],
      [1, 5, 4, 2, 0, 0, 0],
      [1, 5, 1, 2, 2, 0, 0],
      [1, 1, 5, 1, 2, 2, 4],
      [2, 1, 1, 5, 1, 2, 4],
      [2, 4, 1, 1, 5, 1, 2],
      [1, 4, 2, 1, 1, 5, 2],
      [0, 2, 1, 2, 0, 1, 2],
      [0, 0, 2, 1, 6, 6, 0],
      [0, 0, 0, 6, 6, 0, 0]
    ]
  },
  phantom: {
    p: 2.8,
    palette: {
      1: '#020617',
      2: '#38bdf8',
      3: '#ffffff',
      4: '#c084fc',
      5: '#0284c7',
      6: '#80deea'
    },
    rows: [
      [2, 0, 0, 0, 0, 0, 0],
      [2, 3, 0, 0, 0, 0, 0],
      [1, 3, 2, 0, 0, 0, 0],
      [1, 3, 4, 2, 0, 0, 0],
      [1, 5, 4, 2, 0, 0, 0],
      [1, 5, 1, 2, 2, 0, 0],
      [1, 1, 5, 1, 2, 2, 4],
      [2, 1, 1, 5, 1, 2, 4],
      [2, 4, 1, 1, 5, 1, 2],
      [1, 4, 2, 1, 1, 5, 2],
      [0, 2, 1, 2, 0, 1, 2],
      [0, 0, 2, 1, 6, 6, 0],
      [0, 0, 0, 6, 6, 0, 0]
    ]
  },
  vortex: {
    p: 2.8,
    palette: {
      1: '#12041c',
      2: '#bf5af2',
      3: '#ffffff',
      4: '#38bdf8',
      5: '#7c3aed',
      6: '#e879f9'
    },
    rows: [
      [2, 0, 0, 0, 0, 0, 0],
      [2, 3, 0, 0, 0, 0, 0],
      [1, 3, 2, 0, 0, 0, 0],
      [1, 3, 4, 2, 0, 0, 0],
      [1, 5, 4, 2, 0, 0, 0],
      [1, 5, 1, 2, 2, 0, 0],
      [1, 1, 5, 1, 2, 2, 4],
      [2, 1, 1, 5, 1, 2, 4],
      [2, 4, 1, 1, 5, 1, 2],
      [1, 4, 2, 1, 1, 5, 2],
      [0, 2, 1, 2, 0, 1, 2],
      [0, 0, 2, 1, 6, 6, 0],
      [0, 0, 0, 6, 6, 0, 0]
    ]
  },
  chrono: {
    p: 2.8,
    palette: {
      1: '#1c1602',
      2: '#ffd700',
      3: '#ffffff',
      4: '#f59e0b',
      5: '#b45309',
      6: '#fef08a'
    },
    rows: [
      [2, 0, 0, 0, 0, 0, 0],
      [2, 3, 0, 0, 0, 0, 0],
      [1, 3, 2, 0, 0, 0, 0],
      [1, 3, 4, 2, 0, 0, 0],
      [1, 5, 4, 2, 0, 0, 0],
      [1, 5, 1, 2, 2, 0, 0],
      [1, 1, 5, 1, 2, 2, 4],
      [2, 1, 1, 5, 1, 2, 4],
      [2, 4, 1, 1, 5, 1, 2],
      [1, 4, 2, 1, 1, 5, 2],
      [0, 2, 1, 2, 0, 1, 2],
      [0, 0, 2, 1, 6, 6, 0],
      [0, 0, 0, 6, 6, 0, 0]
    ]
  }
};

function getShipPixelSvg(skinId, size = 52) {
  const pSkin = PIXEL_PLAYER_SKINS[skinId] || PIXEL_PLAYER_SKINS.cyberpunk;
  const palette = pSkin.palette;
  const flameColors = {
    cyberpunk: '#00f0ff',
    solar: '#ff3d00',
    toxic: '#05ffa1',
    phantom: '#00e5ff',
    vortex: '#c084fc',
    chrono: '#ffd700'
  };
  const primaryGlows = {
    cyberpunk: '#00f0ff',
    solar: '#ffbe0b',
    toxic: '#05ffa1',
    phantom: '#38bdf8',
    vortex: '#bf5af2',
    chrono: '#ffd700'
  };
  const flameCol = flameColors[skinId] || '#00f0ff';
  const glowCol = primaryGlows[skinId] || '#00f0ff';

  let rects = '';
  pSkin.rows.forEach((row, y) => {
    const c0 = row[0];
    if (c0 && palette[c0]) {
      rects += `<rect x="6" y="${y}" width="1" height="1" fill="${palette[c0]}"/>`;
    }
    for (let c = 1; c < row.length; c++) {
      const val = row[c];
      if (val && palette[val]) {
        rects += `<rect x="${6 - c}" y="${y}" width="1" height="1" fill="${palette[val]}"/>`;
        rects += `<rect x="${6 + c}" y="${y}" width="1" height="1" fill="${palette[val]}"/>`;
      }
    }
  });

  return `<svg viewBox="-1 -1 15 17" width="${size}" height="${size}" style="filter: drop-shadow(0 0 10px ${glowCol});">
    ${rects}
    <rect x="5.5" y="13" width="2" height="2" fill="${flameCol}" opacity="0.9"/>
    <rect x="6" y="14" width="1" height="1.5" fill="#ffffff"/>
  </svg>`;
}

class Game {
  constructor() {
    window.game = this;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.state = 'MENU'; // 'MENU', 'PLAYING', 'LEVEL_UP', 'GAME_OVER'

    this.particles = new ParticleSystem();
    this.currentSectorId = 'void';
    this.warpTimer = 0;
    
    // Çoklu Mod ve Skor Sistemi
    this.currentMode = 'classic'; // 'classic' veya 'storm'
    this.highScores = {
      classic: parseInt(localStorage.getItem('neon_high_score_classic') || localStorage.getItem('neon_space_high_score') || '0', 10),
      storm: parseInt(localStorage.getItem('neon_high_score_storm') || '0', 10)
    };
    this.isNewRecordSet = false;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.updateHighScoreDisplay();

    this.screenShake = 0;
    this.barrierFlash = 0;
    this.gameTime = 0; // Saniye cinsinden
    this.frames = 0;
    this.touchOffsetY = -38;

    // Oyuncu gemisi
    this.player = {
      x: this.width / 2,
      y: this.height * 0.8,
      targetX: this.width / 2,
      targetY: this.height * 0.8,
      radius: 16,
      visualRadius: 26,
      tilt: 0,
      maxHp: 100,
      hp: 100,
      shield: 0,
      maxShield: 40,
      shieldRegenTimer: 0,
      speed: 12,
      level: 1,
      xp: 0,
      nextXp: 8,
      score: 0,
      magnetRange: 100,
      feverCharge: 0,
      isFever: false,
      feverTimer: 0,
      overchargeTimer: 0,
      vacuumTimer: 0,
      isStationary: false,
      stationaryTimer: 0,
      shootCooldown: 0,
      missileCooldown: 0,
      empCooldown: 0,
      droneAngle: 0,
      upgrades: {
        laser: 1,      // 1: Tekli, 2: Çift, 3: Üçlü, 4: Dörtlü, 5: Plazma
        fireRate: 1,   // Atış hızı çarpanı
        missiles: 0,   // Güdümlü füze sayısı
        drones: 0,     // Etrafta dönen koruyucu uydular
        emp: 0,        // Periyodik şok dalgası
        shield: 1,     // Kalkan kapasitesi
        magnet: 1,     // Kristal çekim gücü
        tesla: 0,      // Zincirleme yıldırım arkları
        hull: 0        // Gövde nanobot onarımı
      },
      evolutions: {
        vortexLaser: false,
        clusterMissiles: false,
        ionStorm: false,
        nanoBastion: false,
        cryoBlaster: false,
        orbitalSaws: false,
        supernova: false,
        doomsdayMatrix: false,
        hyperSaber: false,
        voidDrones: false
      },
      ionStormTimer: 0,
      dashCooldown: 0,
      isDashing: false,
      dashTimer: 0,
      dashDirX: 0,
      dashDirY: -1,
      afterimages: [],
      skinUltTick: 0,
      combatZone: 'rear'
    };

    // Yeni Sistem Değişkenleri
    this.temporalSlowTimer = 0;
    this.currentAnomaly = null;
    this.currentMiniQuest = null;
    this.nextMiniQuestTimer = 8;

    // Listeler & Efektler
    this.playerBullets = [];
    this.homingMissiles = [];
    this.enemies = [];
    this.enemyProjectiles = [];
    this.gems = [];
    this.powerups = [];
    this.luckyChests = [];
    this.pendingChestRewards = [];
    this.supernovaOrbs = [];
    this.supernovaWells = [];
    this.supernovaTimer = 0;
    this.matrixChargeTimer = 0;
    this.tetheredEnemies = [];
    this.droneOverdriveTimer = 0;
    this.telegraphs = [];
    this.vortices = [];
    this.blazeTrailers = [];
    this.currentBoss = null;
    this.introBossDefeated = false;
    this.introBossWarningTriggered = false;
    this.firstBossDefeated = false;
    this.bossDefeatedCount = 0;
    this.bossTimer = 0;
    this.intermissionEvents = {
      goldRush: false,
      merchantVisit: false,
      swarmStrike: false,
      cruiserRaid: false,
      hazardCore: false,
      eliteDuel: false
    };
    this.slowMoTimer = 0;
    this.whiteFlash = 0;
    this.activeEvent = null;
    this.nextEventTime = 45;

    // Pilot İstatistikleri
    this.pilotStats = this.loadPilotStats();

    // Kristal Kasası & Kostümler
    this.totalCrystals = parseInt(localStorage.getItem('neon_total_crystals') || '0', 10);

    // Pilot Ustalık Ağacı (Mastery Tree)
    this.masteryTree = JSON.parse(localStorage.getItem('neon_mastery') || 'null') || {
      magnet: 0,    // Mıknatıs menzili +%10/lv (max 5)
      critDmg: 0,   // Kritik hasar +%8/lv (max 5)
      startShield: 0, // Başlangıç kalkan +10/lv (max 3)
      xpBonus: 0,   // XP kazancı +%10/lv (max 5)
      crystalBonus: 0, // Kristal kazancı +%12/lv (max 4)
      rerollStart: 0  // Başlangıç reroll hakkı +1/lv (max 2)
    };

    // 30 Kademeli Başarım Sistemi (10 Kategori x 3 Aşama)
    this.trophies = JSON.parse(localStorage.getItem('neon_trophies') || '{}');
    this.trophyDefs = [
      // 1. Düşman Avcısı
      { id: 'kill_1', category: 'kill', tier: 1, name: 'İlk Av', desc: 'Toplam 3 düşman yok et', icon: '🎯', stat: 'totalKills', target: 3, reward: 25 },
      { id: 'kill_2', category: 'kill', tier: 2, name: 'Kozmik Avcı', desc: 'Toplam 30 düşman yok et', icon: '⚔️', stat: 'totalKills', target: 30, reward: 50 },
      { id: 'kill_3', category: 'kill', tier: 3, name: 'Yıldız Katili', desc: 'Toplam 300 düşman yok et', icon: '💥', stat: 'totalKills', target: 300, reward: 120 },

      // 2. Asteroit Kıran
      { id: 'asteroid_1', category: 'asteroid', tier: 1, name: 'Taş Kırıcı', desc: '3 asteroit parçala', icon: '🪨', stat: 'asteroidsDestroyed', target: 3, reward: 20 },
      { id: 'asteroid_2', category: 'asteroid', tier: 2, name: 'Meteor Yağmuru', desc: '30 asteroit parçala', icon: '☄️', stat: 'asteroidsDestroyed', target: 30, reward: 45 },
      { id: 'asteroid_3', category: 'asteroid', tier: 3, name: 'Kuşak Temizleyici', desc: '300 asteroit parçala', icon: '🪐', stat: 'asteroidsDestroyed', target: 300, reward: 100 },

      // 3. Boss Avcısı
      { id: 'boss_1', category: 'boss', tier: 1, name: 'Amiral Tehdidi', desc: 'İlk Amiral Boss\'unu yen', icon: '💀', stat: 'bossesDefeated', target: 1, reward: 50 },
      { id: 'boss_2', category: 'boss', tier: 2, name: 'Filo Avcısı', desc: 'Toplam 5 Boss yok et', icon: '☠️', stat: 'bossesDefeated', target: 5, reward: 100 },
      { id: 'boss_3', category: 'boss', tier: 3, name: 'Kozmik Ecel', desc: 'Toplam 20 Boss yok et', icon: '👑', stat: 'bossesDefeated', target: 20, reward: 250 },

      // 4. Kombo Ustası
      { id: 'combo_1', category: 'combo', tier: 1, name: 'Seri Darbe', desc: '10x kombo zincirine ulaş', icon: '⚡', stat: 'maxCombo', target: 10, reward: 25 },
      { id: 'combo_2', category: 'combo', tier: 2, name: 'Fırtına Ritmi', desc: '25x kombo zincirine ulaş', icon: '⚡', stat: 'maxCombo', target: 25, reward: 60 },
      { id: 'combo_3', category: 'combo', tier: 3, name: 'Apex Akışı', desc: '50x maksimum kombo zincirine ulaş', icon: '⚡', stat: 'maxCombo', target: 50, reward: 150 },

      // 5. Hayatta Kalma (Süre)
      { id: 'survive_1', category: 'survive', tier: 1, name: 'Uçuş Başlangıcı', desc: 'Tek seferde 60 saniye hayatta kal', icon: '⏱️', stat: 'maxTime', target: 60, reward: 20 },
      { id: 'survive_2', category: 'survive', tier: 2, name: 'Zaman Savaşçısı', desc: 'Tek seferde 180 saniye hayatta kal', icon: '⏳', stat: 'maxTime', target: 180, reward: 50 },
      { id: 'survive_3', category: 'survive', tier: 3, name: 'Sonsuz Direniş', desc: 'Tek seferde 300 saniye (5 dk) hayatta kal', icon: '⌛', stat: 'maxTime', target: 300, reward: 120 },

      // 6. Kristal Zengini
      { id: 'crystal_1', category: 'crystal', tier: 1, name: 'Ganimet Avcısı', desc: 'Toplam 100 kristal topla', icon: '💎', stat: 'lifetimeCrystals', target: 100, reward: 30 },
      { id: 'crystal_2', category: 'crystal', tier: 2, name: 'Kozmik Madenci', desc: 'Toplam 1,000 kristal topla', icon: '💎', stat: 'lifetimeCrystals', target: 1000, reward: 75 },
      { id: 'crystal_3', category: 'crystal', tier: 3, name: 'Kristal Baronu', desc: 'Toplam 10,000 kristal topla', icon: '💠', stat: 'lifetimeCrystals', target: 10000, reward: 200 },

      // 7. Sıyırma / Graze Ası
      { id: 'graze_1', category: 'graze', tier: 1, name: 'Kıl Payı', desc: '10 kez mermi veya tehlike sıyır', icon: '✨', stat: 'totalGraze', target: 10, reward: 25 },
      { id: 'graze_2', category: 'graze', tier: 2, name: 'Refleks Pilotu', desc: '50 kez tehlike sıyır', icon: '🌟', stat: 'totalGraze', target: 50, reward: 60 },
      { id: 'graze_3', category: 'graze', tier: 3, name: 'Gölge Hayalet', desc: '200 kez tehlike sıyır', icon: '💫', stat: 'totalGraze', target: 200, reward: 150 },

      // 8. Sefer Uçuşları
      { id: 'flight_1', category: 'flight', tier: 1, name: 'Acemi Kanatlar', desc: '3 uçuş seferine çık', icon: '🚀', stat: 'totalFlights', target: 3, reward: 20 },
      { id: 'flight_2', category: 'flight', tier: 2, name: 'Kıdemli Filo', desc: '15 uçuş seferine çık', icon: '🛸', stat: 'totalFlights', target: 15, reward: 50 },
      { id: 'flight_3', category: 'flight', tier: 3, name: 'Uzay Gazisi', desc: '50 uçuş seferine çık', icon: '🌌', stat: 'totalFlights', target: 50, reward: 120 },

      // 9. Şanslı Uzay Sandığı
      { id: 'chest_1', category: 'chest', tier: 1, name: 'İlk Sandık', desc: '1 şanslı uzay sandığı aç', icon: '🎁', stat: 'totalChests', target: 1, reward: 30 },
      { id: 'chest_2', category: 'chest', tier: 2, name: 'Hazine Avcısı', desc: '5 şanslı uzay sandığı aç', icon: '📦', stat: 'totalChests', target: 5, reward: 70 },
      { id: 'chest_3', category: 'chest', tier: 3, name: 'Kozmik Zenginlik', desc: '20 şanslı uzay sandığı aç', icon: '🏆', stat: 'totalChests', target: 20, reward: 180 },

      // 10. Bomba Patlatıcı
      { id: 'bomb_1', category: 'bomb', tier: 1, name: 'Fünye', desc: '3 bomba asteroit patlat', icon: '💣', stat: 'bombAsteroidsDestroyed', target: 3, reward: 20 },
      { id: 'bomb_2', category: 'bomb', tier: 2, name: 'Şok Dalgası', desc: '20 bomba asteroit patlat', icon: '🧨', stat: 'bombAsteroidsDestroyed', target: 20, reward: 55 },
      { id: 'bomb_3', category: 'bomb', tier: 3, name: 'Süpernova Patlaması', desc: '80 bomba asteroit patlat', icon: '☢️', stat: 'bombAsteroidsDestroyed', target: 80, reward: 140 }
    ];
    this.sessionStats = { grazeCount: 0, deflectCount: 0, noDamageTimer: 0 };

    this.skins = {
      cyberpunk: {
        id: 'cyberpunk',
        name: 'SİBERPUNK',
        title: 'Dengeli Saldırı Jeti',
        primary: '#00f0ff', secondary: '#ff0077', cockpit: '#ff007f', flame: '#00f0ff',
        cost: 0,
        stats: { dmg: 100, shield: 100, speed: 100, magnet: 100 },
        dmgMult: 1.0, shieldMult: 1.0, speedMult: 1.0, magnetMult: 1.0,
        perkTitle: 'AŞIRI İTKİ',
        perk: 'Mermi sıyırmada (graze) anında +%35 seri atış hızı kazanır.'
      },
      solar: {
        id: 'solar',
        name: 'GÜNEŞ FIRTINASI',
        title: 'Ağır Taarruz Jeti',
        primary: '#ffbe0b', secondary: '#ff5722', cockpit: '#ff9100', flame: '#ff3d00',
        cost: 1800,
        stats: { dmg: 135, shield: 80, speed: 85, magnet: 75 },
        dmgMult: 1.35, shieldMult: 0.8, speedMult: 0.85, magnetMult: 0.75,
        perkTitle: 'GÜNEŞ PATLAMASI',
        perk: 'Her 7 atışta bir alanı yakan ağır plazma bombası fırlatır.'
      },
      toxic: {
        id: 'toxic',
        name: 'ZEHİR NEON',
        title: 'Gözcü & Hasatçı',
        primary: '#05ffa1', secondary: '#7209b7', cockpit: '#b5179e', flame: '#05ffa1',
        cost: 3800,
        stats: { dmg: 85, shield: 85, speed: 125, magnet: 160 },
        dmgMult: 0.85, shieldMult: 0.85, speedMult: 1.25, magnetMult: 1.6,
        perkTitle: 'ZÜMRÜT SÜZÜLME',
        perk: '+%60 kristal çekim menzili ve arkasında yakıcı asit közleri saçar.'
      },
      phantom: {
        id: 'phantom',
        name: 'HAYALET PLAZMA',
        title: 'Kuantum Savunma Jeti',
        primary: '#e0f7fa', secondary: '#00e5ff', cockpit: '#80deea', flame: '#00e5ff',
        cost: 7500,
        stats: { dmg: 90, shield: 150, speed: 95, magnet: 90 },
        dmgMult: 0.9, shieldMult: 1.5, speedMult: 0.95, magnetMult: 0.9,
        perkTitle: 'FAZ KALKANI',
        perk: 'Darbe aldığında 1.25 sn kuantum fazına geçerek hasarsızlık kazanır.'
      },
      vortex: {
        id: 'vortex',
        name: 'VORTEX NEBULA',
        title: 'Kozmik Girdap Avcısı',
        primary: '#bf5af2', secondary: '#38bdf8', cockpit: '#f0abfc', flame: '#c084fc',
        cost: 5200,
        stats: { dmg: 120, shield: 110, speed: 115, magnet: 150 },
        dmgMult: 1.2, shieldMult: 1.1, speedMult: 1.15, magnetMult: 1.5,
        perkTitle: 'GİRDAP ÇEKİMİ',
        perk: 'Kristal çekiminde mini yerçekimi girdabı açar ve kristalleri otomatik toplar.'
      },
      chrono: {
        id: 'chrono',
        name: 'CHRONO APEX',
        title: 'Altın Zaman Kruvazörü',
        primary: '#ffd700', secondary: '#ffffff', cockpit: '#fef08a', flame: '#ffbe0b',
        cost: 9800,
        stats: { dmg: 145, shield: 140, speed: 120, magnet: 120 },
        dmgMult: 1.45, shieldMult: 1.4, speedMult: 1.2, magnetMult: 1.2,
        perkTitle: 'KRONO SÜPERNOVA',
        perk: 'Her 8 sn düşmanları 1.5 sn donduran altın süpernova şok dalgası saçar.'
      }
    };
    this.skinOrder = ['cyberpunk', 'solar', 'toxic', 'vortex', 'phantom', 'chrono'];
    this.unlockedSkins = JSON.parse(localStorage.getItem('neon_unlocked_skins') || '["cyberpunk"]');
    this.currentSkinId = localStorage.getItem('neon_equipped_skin') || 'cyberpunk';
    this.menuSkinIndex = this.skinOrder.indexOf(this.currentSkinId);
    if (this.menuSkinIndex === -1) this.menuSkinIndex = 0;

    this.techUpgrades = this.loadTechUpgrades();
    this.activeArchetype = localStorage.getItem('neon_flight_archetype') || 'interceptor';
    this.pilots = {
      interceptor: {
        id: 'interceptor',
        name: 'VEGA',
        cost: 0,
        abilityName: 'KLASİK UÇUŞ',
        cooldown: 0,
        color: '#00f0ff',
        desc: 'Klasik Uçuş: +%12 Hız ve +%15 Seri Ateş ile çevik saf manevra',
        icon: '<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 10 10"><path d="M5 1c0 2-2 2.5-2 4.5 0 1.5 1 2.5 2 2.5s2-1 2-2.5C7 3.5 5 3 5 1z" fill="#00f0ff"/></svg>'
      },
      dreadnought: {
        id: 'dreadnought',
        name: 'TITAN',
        cost: 1400,
        abilityName: 'ÇİFT KALKAN',
        cooldown: 30 * 60, // 30s
        color: '#ffbe0b',
        desc: 'Çift Kalkan: Kalkanı yeniler & 5 sn hasarı yarıya indirir',
        icon: '<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 10 10"><path d="M1 2h8v3c0 2.5-4 4-4 4s-4-1.5-4-4V2z" fill="#ffbe0b"/></svg>'
      },
      technician: {
        id: 'technician',
        name: 'NOVA',
        cost: 2600,
        abilityName: 'KARA DELİK',
        cooldown: 20 * 60, // 20s
        color: '#d946ef',
        desc: 'Kara Delik Mıknatısı: Tüm kristalleri çeker & şok dalgası saçar',
        icon: '<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3" fill="#d946ef"/><rect x="0" y="4" width="3" height="2" fill="#d946ef"/><rect x="7" y="4" width="3" height="2" fill="#d946ef"/></svg>'
      },
      blaze: {
        id: 'blaze',
        name: 'BLAZE',
        cost: 3900,
        abilityName: 'PLAZMA ATILIMI',
        cooldown: 15 * 60, // 15s
        color: '#ff5500',
        desc: 'Plazma Atılımı: İleri hasarsız atılır & çarptığı düşmanları ezer',
        icon: '<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 10 10"><path d="M5 1c0 2-2 2.5-2 4.5 0 1.5 1 2.5 2 2.5s2-1 2-2.5C7 3.5 5 3 5 1z" fill="#ff5500"/></svg>'
      }
    };
    this.unlockedPilots = JSON.parse(localStorage.getItem('neon_unlocked_pilots') || '["interceptor"]');
    if (!this.unlockedPilots.includes(this.activeArchetype)) {
      this.unlockedPilots.push(this.activeArchetype);
      localStorage.setItem('neon_unlocked_pilots', JSON.stringify(this.unlockedPilots));
    }
    this.isOverloadProtocol = localStorage.getItem('neon_overload_protocol') === 'true';
    this.blazeTrailers = [];

    // Kalıcı Hangar Dronları Sistemi
    this.hangarDrones = {
      striker: {
        id: 'striker',
        name: 'VURUCU DRONE',
        desc: 'En yakın düşmana kesintisiz lazer ateşi açar',
        cost: 0,
        unlocked: true,
        baseDmg: 8,
        color: '#00f0ff',
        type: 'laser'
      },
      missile: {
        id: 'missile',
        name: 'ROKETÇİ DRONE',
        desc: '3.5 saniyede bir düşmanlara güdümlü mini roket fırlatır',
        cost: 1500,
        unlocked: false,
        baseDmg: 28,
        color: '#ffbe0b',
        type: 'missile'
      },
      medic: {
        id: 'medic',
        name: 'TAMİRCİ DRONE',
        desc: '8 saniyede bir +6 kalkan onarır ve destek ateşi açar',
        cost: 2600,
        unlocked: false,
        baseDmg: 5,
        color: '#05ffa1',
        type: 'repair'
      },
      tesla: {
        id: 'tesla',
        name: 'TESLA ARK DRONU',
        desc: '3.2 saniyede bir en yakın 3 düşmana zincirleme elektrik yıldırımı saçar',
        cost: 3200,
        unlocked: false,
        baseDmg: 24,
        color: '#bf5af2',
        type: 'tesla'
      },
      clone: {
        id: 'clone',
        name: 'MİKRO KLON PET',
        desc: 'Gemiyle kol kola uçar ve sürekli ikiz plazma destek ateşi açar',
        cost: 4800,
        unlocked: false,
        baseDmg: 16,
        color: '#00f0ff',
        type: 'clone'
      }
    };
    this.droneLevels = JSON.parse(localStorage.getItem('neon_drone_levels') || '{"striker":1,"missile":0,"medic":0,"tesla":0,"clone":0}');
    this.equippedDroneId = localStorage.getItem('neon_equipped_drone') || 'striker';

    // Kozmetik Motor İzleri Koleksiyonu (Engine Trails)
    this.trails = {
      default: { id: 'default', name: 'Standart İyon', cost: 0, unlocked: true, color: '#00f0ff', type: 'ion', desc: 'Standart neon iyon itki hattı' },
      flame: { id: 'flame', name: 'Kızıl Alev', cost: 800, unlocked: false, color: '#ff3d00', type: 'fire', desc: 'Akkor sıcak plazma kıvılcımları saçar' },
      electric: { id: 'electric', name: 'Yıldırım Arkı', cost: 1300, unlocked: false, color: '#bf5af2', type: 'spark', desc: 'Arkasında mor elektro arklar bırakır' },
      toxic: { id: 'toxic', name: 'Zehir Közü', cost: 1800, unlocked: false, color: '#05ffa1', type: 'acid', desc: 'Neon zümrüt asit közleri saçar' },
      rainbow: { id: 'rainbow', name: 'Gökkuşağı Neon', cost: 2400, unlocked: false, color: '#ffd700', type: 'rainbow', desc: 'Sürekli renk değiştiren prizmatik iz' },
      supernova: { id: 'supernova', name: 'Süpernova Tacı', cost: 3200, unlocked: false, color: '#ffbe0b', type: 'fire', desc: 'Akkor altın dev yıldız parlaması saçar' },
      void: { id: 'void', name: 'Hiper Uzay', cost: 4200, unlocked: false, color: '#38bdf8', type: 'spark', desc: 'Işık hızında takyon siber izleri bırakır' }
    };
    this.unlockedTrails = JSON.parse(localStorage.getItem('neon_unlocked_trails') || '["default"]');
    this.equippedTrailId = localStorage.getItem('neon_equipped_trail') || 'default';

    this.bossWarningTimer = 0;
    this.launching = false;
    this.launchProgress = 0;

    // Dalga & Zorluk
    this.wave = 1;
    this.spawnTimer = 0;
    this.bossTimer = 0;

    // 38 Seviyeli Sefer (Campaign Stages) Sistemi
    this.unlockedLevel = parseInt(localStorage.getItem('neon_unlocked_level') || '1', 10);
    this.selectedLevel = parseInt(localStorage.getItem('neon_selected_level') || '1', 10);
    this.levelStars = JSON.parse(localStorage.getItem('neon_level_stars') || '{}');
    this.levelBossSpawned = false;
    this.levelBossWarningTriggered = false;
    this.currentLevelBoss = null;
    this.bossArenaActive = false;

    this.initCanvas();
    this.initEvents();
    this.initSettingsModal();
    applyTranslationsToDOM();
    this.updateCrystalsDisplay();
    this.renderHangarSkins();
    this.dailyMissions = null;
    this.initMissions();
    this.updatePilotRankDisplay();
    this.updateMenuShipPreview();
    this.checkDailyReward();
    this.updateHighScoreDisplay();
    this.updateLevelDisplay();
  }

  initCanvas() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = this.width;
    canvas.height = this.height;
    this.particles.initStars(this.width, this.height);
    this.particles.setSector(this.currentSectorId || 'void', this.width, this.height);
  }

  initEvents() {
    // SADECE KAYDIRMA İLE KONTROL (Dokunarak ani yer değiştirme IPTAL EDİLDİ)
    let isDragging = false;
    let activePointerId = null;
    let lastX = 0;
    let lastY = 0;
    let lastTapTime = 0;

    const handleDragStart = (pointerId, clientX, clientY) => {
      sounds.init();
      if (this.state !== 'PLAYING') return;
      if (isDragging && activePointerId !== null) return;
      isDragging = true;
      activePointerId = pointerId;
      lastX = clientX;
      lastY = clientY;
    };

    const handleDragMove = (pointerId, clientX, clientY) => {
      if (!isDragging || this.state !== 'PLAYING') return;
      if (activePointerId !== null && pointerId !== activePointerId) return;

      const scaleX = this.width / (window.innerWidth || this.width);
      const scaleY = this.height / (window.innerHeight || this.height);
      const deltaX = (clientX - lastX) * scaleX;
      const deltaY = (clientY - lastY) * scaleY;
      lastX = clientX;
      lastY = clientY;

      this.player.targetX = Math.max(25, Math.min(this.width - 25, this.player.targetX + deltaX));
      this.player.targetY = Math.max(50, Math.min(this.height - 40, this.player.targetY + deltaY));
      if (this.dismissTutorial) this.dismissTutorial();
    };

    const handleDragEnd = (pointerId) => {
      if (activePointerId === null || pointerId === activePointerId) {
        isDragging = false;
        activePointerId = null;
      }
    };

    this.cancelDrag = () => {
      isDragging = false;
      activePointerId = null;
    };

    window.addEventListener('pointerdown', (e) => {
      handleDragStart(e.pointerId, e.clientX, e.clientY);
    });

    window.addEventListener('pointermove', (e) => {
      handleDragMove(e.pointerId, e.clientX, e.clientY);
    });

    window.addEventListener('pointerup', (e) => {
      handleDragEnd(e.pointerId);
    });

    window.addEventListener('pointercancel', (e) => {
      handleDragEnd(e.pointerId);
    });

    // Mobil tarayıcı varsayılan kaydırma ve yakınlaştırmayı engelle
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });

    // Telefon kilitlendiğinde veya arka plana geçtiğinde oyunu ve sesi otomatik duraklat
    const handleAppBackground = () => {
      if (sounds.pauseAudio) sounds.pauseAudio();
      else sounds.stopBGM();
      if (this.cancelDrag) this.cancelDrag();
      if (this.state === 'PLAYING') {
        this.pauseGame();
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        handleAppBackground();
      } else {
        if (this.state === 'PLAYING') {
          if (sounds.resumeAudio) sounds.resumeAudio();
          sounds.startBGM();
        }
      }
    });

    window.addEventListener('blur', () => {
      handleAppBackground();
    });

    if (window.Capacitor?.Plugins?.App) {
      try {
        window.Capacitor.Plugins.App.addListener('appStateChange', (state) => {
          if (!state.isActive) {
            handleAppBackground();
          } else {
            if (this.state === 'PLAYING') {
              if (sounds.resumeAudio) sounds.resumeAudio();
              sounds.startBGM();
            }
          }
        });
      } catch (err) {}
    }

    // Klavye Desteği (Masaüstü Testi İçin)
    this.keys = {};
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mobil / Telefon Geri Tuşu (Android Hardware/Gesture Back Button & Popstate) Çakışma Önleyici
    const handlePhoneBack = (e) => {
      const lbProfileModal = document.getElementById('lb-profile-modal');
      if (lbProfileModal && !lbProfileModal.classList.contains('hidden')) {
        if (e && e.preventDefault) e.preventDefault();
        lbProfileModal.classList.add('hidden');
        return;
      }

      const settingsModal = document.getElementById('settings-modal');
      const privacyModal = document.getElementById('privacy-modal');
      const leaderboardModal = document.getElementById('leaderboard-modal');
      const luckyWheelModal = document.getElementById('lucky-wheel-modal');
      const saveCodeModal = document.getElementById('save-code-modal');
      const openModals = [
        dailyRewardModal,
        missionsModal,
        statsModal,
        hangarModal,
        levelSelectModal,
        luckyChestModal,
        luckyWheelModal,
        leaderboardModal,
        merchantModal,
        pauseModal,
        settingsModal,
        privacyModal,
        saveCodeModal
      ].filter(m => m && !m.classList.contains('hidden'));

      if (openModals.length > 0) {
        if (e && e.preventDefault) e.preventDefault();
        openModals.forEach(m => m.classList.add('hidden'));
        if (this.state === 'PAUSED') {
          this.resumeGame();
        }
        return;
      }

      if (gameoverModal && !gameoverModal.classList.contains('hidden')) {
        if (e && e.preventDefault) e.preventDefault();
        gameoverModal.classList.add('hidden');
        this.state = 'MENU';
        if (startScreen) startScreen.classList.remove('hidden');
        hud.classList.add('hidden');
        return;
      }

      if (levelCompleteModal && !levelCompleteModal.classList.contains('hidden')) {
        if (e && e.preventDefault) e.preventDefault();
        levelCompleteModal.classList.add('hidden');
        this.state = 'MENU';
        if (startScreen) startScreen.classList.remove('hidden');
        hud.classList.add('hidden');
        return;
      }

      if (this.state === 'PLAYING') {
        if (e && e.preventDefault) e.preventDefault();
        this.pauseGame();
      }
    };

    window.addEventListener('popstate', handlePhoneBack);
    document.addEventListener('backbutton', handlePhoneBack);
    if (window.Capacitor?.Plugins?.App) {
      try {
        window.Capacitor.Plugins.App.addListener('backButton', () => {
          handlePhoneBack();
        });
      } catch (err) {}
    }

    // Buton Dinleyicileri
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        sounds.init();
        this.triggerLaunch();
      });
    }

    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        sounds.init();
        this.triggerLaunch();
      });
    }

    const btnAdRevive = document.getElementById('btn-ad-revive');
    if (btnAdRevive) {
      btnAdRevive.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        const freeRevives = parseInt(localStorage.getItem('neon_bonus_revives') || '0', 10);
        if (freeRevives > 0) {
          localStorage.setItem('neon_bonus_revives', (freeRevives - 1).toString());
          this.executeRevive();
          this.showToast('🛡️ Şans Çarkı Canlanma Hakkı Kullanıldı!', '#05ffa1');
        } else if (window.showRewardedAd) {
          window.showRewardedAd(() => {
            this.executeRevive();
          }, (err) => {
            console.error('Reklam yüklenemedi:', err);
          });
        }
      });
    }

    // 2X Ganimeti Katla (Game Over Reklam Butonu)
    const btnDoubleCrystals = document.getElementById('btn-double-crystals');
    if (btnDoubleCrystals) {
      btnDoubleCrystals.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.doubleGameOverCrystals();
      });
    }

    // 2X Zafer Ganimeti (Bölüm Tamamlandı Reklam Butonu)
    const btnVictoryDouble = document.getElementById('btn-victory-double');
    if (btnVictoryDouble) {
      btnVictoryDouble.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.doubleVictoryCrystals();
      });
    }

    // Uzay Kaçakçısı İstasyonu Reklam Desteği (+100 Kristal)
    const btnMerchantAdGold = document.getElementById('btn-merchant-ad-gold');
    if (btnMerchantAdGold) {
      btnMerchantAdGold.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.claimMerchantAdGold();
      });
    }

    // Ücretsiz Altın / Kristal Reklam Butonları (Ana Menü & Hangar)
    const btnFreeGoldMenu = document.getElementById('btn-free-gold-menu');
    if (btnFreeGoldMenu) {
      btnFreeGoldMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.init();
        sounds.playCardSelect();
        if (window.watchAdForGold) {
          window.watchAdForGold();
        }
      });
    }

    const btnFreeGoldHangar = document.getElementById('btn-free-gold-hangar');
    if (btnFreeGoldHangar) {
      btnFreeGoldHangar.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.init();
        sounds.playCardSelect();
        if (window.watchAdForGold) {
          window.watchAdForGold();
        }
      });
    }

    // Ana Menü Canlı Gemi Vitrini Butonları
    if (btnPrevShip) {
      btnPrevShip.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prevMenuSkin();
      });
    }

    if (btnNextShip) {
      btnNextShip.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextMenuSkin();
      });
    }

    if (menuShipCard) {
      menuShipCard.addEventListener('click', () => {
        this.handleMenuShipClick();
      });
    }

    if (btnMenuCrystals) {
      btnMenuCrystals.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.openHangar();
        if (this.tabBtnTech) this.tabBtnTech.click();
      });
    }

    // Şans Çarkı Butonları
    const btnLuckyWheel = document.getElementById('btn-lucky-wheel');
    if (btnLuckyWheel) {
      btnLuckyWheel.addEventListener('click', () => {
        if (this.getCurrentMenuTabIndex() === 3) {
          this.goToMenuTab(1);
        } else {
          this.goToMenuTab(3);
        }
      });
    }

    const btnCloseWheel = document.getElementById('btn-close-wheel');
    if (btnCloseWheel) {
      btnCloseWheel.addEventListener('click', () => {
        this.goToMenuTab(1);
      });
    }

    const btnSpinWheel = document.getElementById('btn-spin-wheel');
    if (btnSpinWheel) {
      btnSpinWheel.addEventListener('click', () => {
        sounds.init();
        this.handleWheelSpinClick();
      });
    }

    // Günlük İkmal Sandığı Butonları
    if (btnDailyReward) {
      btnDailyReward.addEventListener('click', () => {
        if (this.getCurrentMenuTabIndex() === 4) {
          this.goToMenuTab(1);
        } else {
          this.goToMenuTab(4);
        }
      });
    }

    if (btnClaimDaily) {
      btnClaimDaily.addEventListener('click', () => {
        sounds.init();
        this.claimDailyRewardWithAd();
      });
    }

    if (btnCloseDaily) {
      btnCloseDaily.addEventListener('click', () => {
        this.goToMenuTab(1);
      });
    }

    // Global Lider Tablosu Butonları
    const btnLeaderboard = document.getElementById('btn-leaderboard');
    if (btnLeaderboard) {
      btnLeaderboard.addEventListener('click', () => {
        if (this.getCurrentMenuTabIndex() === 5) {
          this.goToMenuTab(1);
        } else {
          this.goToMenuTab(5);
        }
      });
    }

    const btnCloseLeaderboard = document.getElementById('btn-close-leaderboard');
    if (btnCloseLeaderboard) {
      btnCloseLeaderboard.addEventListener('click', () => {
        this.goToMenuTab(1);
      });
    }

    const lbTabStorm = document.getElementById('lb-tab-storm');
    const lbTabCampaign = document.getElementById('lb-tab-campaign');
    if (lbTabStorm && lbTabCampaign) {
      lbTabStorm.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        lbTabStorm.classList.add('active');
        lbTabCampaign.classList.remove('active');
        this.renderLeaderboard('storm');
      });
      lbTabCampaign.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        lbTabCampaign.classList.add('active');
        lbTabStorm.classList.remove('active');
        this.renderLeaderboard('campaign');
      });
    }

    if (btnGameOverHangar) {
      btnGameOverHangar.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        gameoverModal.classList.add('hidden');
        this.openHangar();
        if (this.tabBtnTech) this.tabBtnTech.click();
      });
    }

    if (btnGameOverMenu) {
      btnGameOverMenu.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        gameoverModal.classList.add('hidden');
        startScreen.classList.remove('hidden');
        this.state = 'MENU';
        this.updatePilotRankDisplay();
        this.updateMenuShipPreview();
        this.checkDailyReward();
        this.updateHighScoreDisplay();
      });
    }

    if (btnClaimChest) {
      btnClaimChest.addEventListener('click', () => {
        sounds.init();
        this.claimLuckyChest();
      });
    }

    const btnAdChestBonus = document.getElementById('btn-ad-chest-bonus');
    if (btnAdChestBonus) {
      btnAdChestBonus.addEventListener('click', () => {
        sounds.init();
        this.watchAdForChestBonus();
      });
    }

    // Mod Seçim Butonları
    if (modeClassic) {
      modeClassic.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        if (this.currentMode === 'classic') {
          this.openLevelSelect();
        } else {
          this.setMode('classic');
        }
      });
    }

    if (modeStorm) {
      modeStorm.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.setMode('storm');
      });
    }

    // 38 Seviyeli Sefer (Bölüm Seçim) & Zafer Modalı Butonları
    if (btnCloseLevelSelect) {
      btnCloseLevelSelect.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.closeLevelSelect();
      });
    }

    if (btnNextLevel) {
      btnNextLevel.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        if (levelCompleteModal) levelCompleteModal.classList.add('hidden');
        if (this.selectedLevel < 38) {
          this.selectedLevel++;
          localStorage.setItem('neon_selected_level', this.selectedLevel.toString());
          this.updateLevelDisplay();
          this.triggerLaunch();
        } else {
          if (startScreen) startScreen.classList.remove('hidden');
          this.state = 'MENU';
          this.updateLevelDisplay();
        }
      });
    }

    if (btnVictoryHangar) {
      btnVictoryHangar.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        if (levelCompleteModal) levelCompleteModal.classList.add('hidden');
        if (startScreen) startScreen.classList.remove('hidden');
        this.state = 'MENU';
        this.openHangar();
        if (tabBtnTech) tabBtnTech.click();
      });
    }

    if (btnVictoryMenu) {
      btnVictoryMenu.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        if (levelCompleteModal) levelCompleteModal.classList.add('hidden');
        if (startScreen) startScreen.classList.remove('hidden');
        this.state = 'MENU';
        this.updatePilotRankDisplay();
        this.updateMenuShipPreview();
        this.updateHighScoreDisplay();
        this.updateLevelDisplay();
      });
    }

    const handleSoundToggle = (e) => {
      e.stopPropagation();
      this.toggleSound();
    };
    if (btnSoundToggle) btnSoundToggle.addEventListener('click', handleSoundToggle);
    if (btnSoundMenu) btnSoundMenu.addEventListener('click', handleSoundToggle);

    const handleVibrateToggle = (e) => {
      e.stopPropagation();
      vibrate.toggle();
      this.updateAudioButtons();
      if (vibrate.enabled) vibrate.light();
    };
    if (btnVibrateMenu) btnVibrateMenu.addEventListener('click', handleVibrateToggle);

    // Duraklatma Butonları
    if (btnPause) {
      btnPause.addEventListener('click', (e) => {
        e.stopPropagation();
        this.pauseGame();
      });
    }

    if (btnResume) {
      btnResume.addEventListener('click', () => {
        this.resumeGame();
      });
    }

    // Aktif Nihai Güç (Ultimate) Buton Dinleyicisi
    if (btnUltimate) {
      btnUltimate.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerUltimate();
      });
      btnUltimate.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        this.triggerUltimate();
      }, { passive: true });
    }

    // Aktif Pilot Yeteneği Buton Dinleyicisi
    if (btnAbility) {
      btnAbility.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerPilotAbility();
      });
      btnAbility.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        this.triggerPilotAbility();
      }, { passive: true });
    }


    if (btnMerchantClose) {
      btnMerchantClose.addEventListener('click', () => {
        this.closeMerchant();
      });
    }

    if (btnPauseSound) {
      btnPauseSound.addEventListener('click', () => {
        this.toggleSound();
        this.updatePauseAudioButtons();
      });
    }

    const btnPauseVibrate = document.getElementById('btn-pause-vibrate');
    if (btnPauseVibrate) {
      btnPauseVibrate.addEventListener('click', () => {
        vibrate.toggle();
        this.updatePauseAudioButtons();
        if (vibrate.enabled) vibrate.light();
      });
    }

    if (btnQuitMenu) {
      btnQuitMenu.addEventListener('click', () => {
        if (pauseModal) pauseModal.classList.add('hidden');
        if (luckyChestModal) luckyChestModal.classList.add('hidden');
        if (merchantModal) merchantModal.classList.add('hidden');
        if (ultimateBtnContainer) ultimateBtnContainer.classList.add('hidden');
        if (missionsModal) missionsModal.classList.add('hidden');
        if (statsModal) statsModal.classList.add('hidden');
        if (eventBanner) eventBanner.classList.add('hidden');
        sounds.setBossEnraged(false);
        sounds.setBossMode(false);
        sounds.stopBGM();
        this.state = 'MENU';
        hud.classList.add('hidden');
        startScreen.classList.remove('hidden');
        this.updateCrystalsDisplay();
        this.updateHighScoreDisplay();
        this.checkMissionsBadge();
      });
    }

    // Hangar Butonları
    if (btnHangar) {
      btnHangar.addEventListener('click', () => {
        if (this.getCurrentMenuTabIndex() === 0) {
          this.goToMenuTab(1);
        } else {
          this.goToMenuTab(0);
        }
      });
    }

    if (btnHangarClose) {
      btnHangarClose.addEventListener('click', () => {
        this.goToMenuTab(1);
      });
    }

    if (tabBtnSkins) {
      tabBtnSkins.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        tabBtnSkins.classList.add('active');
        if (tabBtnTrails) tabBtnTrails.classList.remove('active');
        if (tabBtnDrones) tabBtnDrones.classList.remove('active');
        if (tabBtnBoosters) tabBtnBoosters.classList.remove('active');
        if (tabBtnTech) tabBtnTech.classList.remove('active');
        if (tabBtnTrophies) tabBtnTrophies.classList.remove('active');
        if (skinsContainer) skinsContainer.classList.remove('hidden');
        if (trailsContainer) trailsContainer.classList.add('hidden');
        if (dronesContainer) dronesContainer.classList.add('hidden');
        if (boostersContainer) boostersContainer.classList.add('hidden');
        if (techTabView) techTabView.classList.add('hidden');
        if (techContainer) techContainer.classList.add('hidden');
        if (trophiesTabView) trophiesTabView.classList.add('hidden');
      });
    }

    if (tabBtnTrails) {
      tabBtnTrails.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        tabBtnTrails.classList.add('active');
        if (tabBtnSkins) tabBtnSkins.classList.remove('active');
        if (tabBtnDrones) tabBtnDrones.classList.remove('active');
        if (tabBtnBoosters) tabBtnBoosters.classList.remove('active');
        if (tabBtnTech) tabBtnTech.classList.remove('active');
        if (tabBtnTrophies) tabBtnTrophies.classList.remove('active');
        if (trailsContainer) trailsContainer.classList.remove('hidden');
        if (skinsContainer) skinsContainer.classList.add('hidden');
        if (dronesContainer) dronesContainer.classList.add('hidden');
        if (boostersContainer) boostersContainer.classList.add('hidden');
        if (techTabView) techTabView.classList.add('hidden');
        if (techContainer) techContainer.classList.add('hidden');
        if (trophiesTabView) trophiesTabView.classList.add('hidden');
        this.renderHangarTrails();
      });
    }

    if (tabBtnDrones) {
      tabBtnDrones.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        tabBtnDrones.classList.add('active');
        if (tabBtnSkins) tabBtnSkins.classList.remove('active');
        if (tabBtnTrails) tabBtnTrails.classList.remove('active');
        if (tabBtnBoosters) tabBtnBoosters.classList.remove('active');
        if (tabBtnTech) tabBtnTech.classList.remove('active');
        if (tabBtnTrophies) tabBtnTrophies.classList.remove('active');
        if (dronesContainer) dronesContainer.classList.remove('hidden');
        if (skinsContainer) skinsContainer.classList.add('hidden');
        if (trailsContainer) trailsContainer.classList.add('hidden');
        if (boostersContainer) boostersContainer.classList.add('hidden');
        if (techTabView) techTabView.classList.add('hidden');
        if (techContainer) techContainer.classList.add('hidden');
        if (trophiesTabView) trophiesTabView.classList.add('hidden');
        this.renderHangarDrones();
      });
    }

    if (tabBtnBoosters) {
      tabBtnBoosters.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        tabBtnBoosters.classList.add('active');
        if (tabBtnSkins) tabBtnSkins.classList.remove('active');
        if (tabBtnTrails) tabBtnTrails.classList.remove('active');
        if (tabBtnDrones) tabBtnDrones.classList.remove('active');
        if (tabBtnTech) tabBtnTech.classList.remove('active');
        if (tabBtnTrophies) tabBtnTrophies.classList.remove('active');
        if (boostersContainer) boostersContainer.classList.remove('hidden');
        if (skinsContainer) skinsContainer.classList.add('hidden');
        if (trailsContainer) trailsContainer.classList.add('hidden');
        if (dronesContainer) dronesContainer.classList.add('hidden');
        if (techTabView) techTabView.classList.add('hidden');
        if (techContainer) techContainer.classList.add('hidden');
        if (trophiesTabView) trophiesTabView.classList.add('hidden');
        this.renderHangarBoosters();
      });
    }

    if (tabBtnTech) {
      tabBtnTech.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        tabBtnTech.classList.add('active');
        if (tabBtnSkins) tabBtnSkins.classList.remove('active');
        if (tabBtnTrails) tabBtnTrails.classList.remove('active');
        if (tabBtnDrones) tabBtnDrones.classList.remove('active');
        if (tabBtnBoosters) tabBtnBoosters.classList.remove('active');
        if (tabBtnTrophies) tabBtnTrophies.classList.remove('active');
        if (techTabView) techTabView.classList.remove('hidden');
        if (techContainer) techContainer.classList.remove('hidden');
        if (skinsContainer) skinsContainer.classList.add('hidden');
        if (trailsContainer) trailsContainer.classList.add('hidden');
        if (dronesContainer) dronesContainer.classList.add('hidden');
        if (boostersContainer) boostersContainer.classList.add('hidden');
        if (trophiesTabView) trophiesTabView.classList.add('hidden');
        this.renderTechUpgrades();
      });
    }

    if (btnResetTech) {
      btnResetTech.addEventListener('click', () => {
        sounds.init();
        this.resetTechUpgrades();
      });
    }

    if (tabBtnTrophies) {
      tabBtnTrophies.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        tabBtnTrophies.classList.add('active');
        if (tabBtnSkins) tabBtnSkins.classList.remove('active');
        if (tabBtnTrails) tabBtnTrails.classList.remove('active');
        if (tabBtnDrones) tabBtnDrones.classList.remove('active');
        if (tabBtnBoosters) tabBtnBoosters.classList.remove('active');
        if (tabBtnTech) tabBtnTech.classList.remove('active');
        if (trophiesTabView) trophiesTabView.classList.remove('hidden');
        if (skinsContainer) skinsContainer.classList.add('hidden');
        if (trailsContainer) trailsContainer.classList.add('hidden');
        if (dronesContainer) dronesContainer.classList.add('hidden');
        if (boostersContainer) boostersContainer.classList.add('hidden');
        if (techTabView) techTabView.classList.add('hidden');
        if (techContainer) techContainer.classList.add('hidden');
        this.renderTrophies();
      });
    }

    // Görevler Butonları
    if (btnMissions) {
      btnMissions.addEventListener('click', () => {
        if (this.getCurrentMenuTabIndex() === 2) {
          this.goToMenuTab(1);
        } else {
          this.goToMenuTab(2);
        }
      });
    }

    if (btnMissionsClose) {
      btnMissionsClose.addEventListener('click', () => {
        this.goToMenuTab(1);
      });
    }

    // İstatistik Butonları
    if (btnStats) {
      btnStats.addEventListener('click', () => {
        if (this.getCurrentMenuTabIndex() === 4) {
          this.goToMenuTab(1);
        } else {
          this.goToMenuTab(4);
        }
      });
    }

    if (btnStatsClose) {
      btnStatsClose.addEventListener('click', () => {
        this.goToMenuTab(1);
      });
    }

    // Atölye Butonu (Dock Doğrudan Erişim)
    const btnWorkshop = document.getElementById('btn-workshop');
    if (btnWorkshop) {
      btnWorkshop.addEventListener('click', () => {
        this.goToMenuTab(0);
        if (tabBtnTech) tabBtnTech.click();
      });
    }

    // Pilot Seçici Dinleyicileri (4 Pilot: Vega, Titan, Nova, Blaze & Kilit Sistemi)
    const archetypeBtns = document.querySelectorAll('.archetype-btn');
    const archetypeDesc = document.getElementById('archetype-desc');
    const pilotActionRow = document.getElementById('pilot-action-row');

    const updatePilotUI = () => {
      const p = this.pilots[this.activeArchetype] || this.pilots.interceptor;
      if (archetypeDesc) {
        archetypeDesc.textContent = t(`pilot_${p.id}_desc`) !== `pilot_${p.id}_desc` ? t(`pilot_${p.id}_desc`) : p.desc;
      }

      archetypeBtns.forEach(btn => {
        const archId = btn.dataset.archetype;
        const isUnlocked = this.unlockedPilots.includes(archId);
        const isActive = this.activeArchetype === archId;
        btn.classList.toggle('active', isActive);
        if (!isUnlocked) {
          btn.style.opacity = '0.65';
        } else {
          btn.style.opacity = '1.0';
        }
      });

      if (pilotActionRow) {
        const isCurrentUnlocked = this.unlockedPilots.includes(this.activeArchetype);
        if (isCurrentUnlocked) {
          pilotActionRow.innerHTML = `<span style="color:#05ffa1; font-weight:800; font-size:0.8rem; letter-spacing:0.5px;">✓ AKTİF PİLOT GÖREVDE</span>`;
        } else {
          pilotActionRow.innerHTML = `<button id="btn-unlock-pilot" class="neon-btn pulse" style="background: linear-gradient(135deg, #ffd700, #ff5500); color: #030816; font-weight: 900; padding: 6px 16px; font-size: 0.85rem; border: none; cursor: pointer; border-radius: 8px;">🔓 ${p.cost} CR İLE PİLOTU AÇ</button>`;
          const unlockBtn = pilotActionRow.querySelector('#btn-unlock-pilot');
          if (unlockBtn) {
            unlockBtn.addEventListener('click', () => {
              sounds.init();
              if (this.totalCrystals >= p.cost) {
                this.totalCrystals -= p.cost;
                localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
                this.unlockedPilots.push(p.id);
                localStorage.setItem('neon_unlocked_pilots', JSON.stringify(this.unlockedPilots));
                localStorage.setItem('neon_flight_archetype', p.id);
                sounds.playLevelUp();
                sounds.playJackpot();
                vibrate.success();
                this.showToast(`🎖️ Pilot ${p.name} Başarıyla Açıldı!`, '#00f0ff');
                this.updateCrystalsDisplay();
                updatePilotUI();
              } else {
                this.showToast(`⚠️ Yetersiz Kristal! (${p.cost} CR Gerekli)`, '#ff0055');
                vibrate.medium();
              }
            });
          }
        }
      }
    };

    archetypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        vibrate.light();
        const targetArch = btn.dataset.archetype;
        const isUnlocked = this.unlockedPilots.includes(targetArch);
        this.activeArchetype = targetArch;
        if (isUnlocked) {
          localStorage.setItem('neon_flight_archetype', this.activeArchetype);
        }
        updatePilotUI();
      });
    });

    updatePilotUI();

    // Aşırı Yükleme Protokolü (Torment / Heat Mode) Anahtarı
    const toggleOverload = document.getElementById('toggle-overload-protocol');
    if (toggleOverload) {
      toggleOverload.checked = this.isOverloadProtocol;
      toggleOverload.addEventListener('change', () => {
        sounds.init();
        sounds.playCardSelect();
        this.isOverloadProtocol = toggleOverload.checked;
        localStorage.setItem('neon_overload_protocol', this.isOverloadProtocol.toString());
      });
    }

    // Seviye Atlama Kartlarını Yenileme (Reroll) Butonu
    const btnRerollCards = document.getElementById('btn-reroll-cards');
    if (btnRerollCards) {
      btnRerollCards.addEventListener('click', () => {
        if (this.player.rerollCount > 0) {
          this.player.rerollCount--;
          sounds.playCardSelect();
          vibrate.medium();
          this.triggerLevelUp();
        }
      });
    }

    this.setupMenuSwipeNavigation();
    this.initLuckyWheel();
    this.initLeaderboard();
  }

  updateDockActiveTab(activeTab) {
    const dockMap = [
      { id: 'btn-hangar', tab: 0 },
      { id: 'btn-missions', tab: 2 },
      { id: 'btn-lucky-wheel', tab: 3 },
      { id: 'btn-daily-reward', tab: 4 },
      { id: 'btn-leaderboard', tab: 5 }
    ];
    dockMap.forEach(({ id, tab }) => {
      const btn = document.getElementById(id);
      if (btn) {
        if (activeTab === tab) {
          btn.classList.add('dock-tab-active');
        } else {
          btn.classList.remove('dock-tab-active');
        }
      }
    });
  }

  getCurrentMenuTabIndex() {
    if (hangarModal && !hangarModal.classList.contains('hidden')) return 0;
    if (missionsModal && !missionsModal.classList.contains('hidden')) return 2;
    const wheelModal = document.getElementById('lucky-wheel-modal');
    if (wheelModal && !wheelModal.classList.contains('hidden')) return 3;
    if (dailyRewardModal && !dailyRewardModal.classList.contains('hidden')) return 4;
    const lbModal = document.getElementById('leaderboard-modal');
    if (lbModal && !lbModal.classList.contains('hidden')) return 5;
    if (statsModal && !statsModal.classList.contains('hidden')) return 6;
    return 1; // Ana Savaş Menüsü (Hub)
  }

  goToMenuTab(targetIndex, direction = 'none') {
    if (this.state !== 'MENU') return;
    const index = Math.max(0, Math.min(6, targetIndex));
    sounds.init();
    sounds.playCardSelect();
    vibrate.light();

    // Diğer modalları kapat
    if (hangarModal) hangarModal.classList.add('hidden');
    if (missionsModal) missionsModal.classList.add('hidden');
    const wheelModal = document.getElementById('lucky-wheel-modal');
    if (wheelModal) wheelModal.classList.add('hidden');
    if (dailyRewardModal) dailyRewardModal.classList.add('hidden');
    const lbModal = document.getElementById('leaderboard-modal');
    if (lbModal) lbModal.classList.add('hidden');
    if (statsModal) statsModal.classList.add('hidden');

    this.updateDockActiveTab(index);

    if (index === 0) {
      this.openHangar();
    } else if (index === 1) {
      if (startScreen) startScreen.classList.remove('hidden');
      this.updateMenuShipPreview();
    } else if (index === 2) {
      this.openMissions();
    } else if (index === 3) {
      this.openLuckyWheel();
    } else if (index === 4) {
      this.openDailyRewardModal();
    } else if (index === 5) {
      this.openLeaderboard();
    } else if (index === 6) {
      this.openStats();
    }

    // Yumuşak geçiş animasyonu (Clash Royale stili kayma)
    const activeModal = [hangarModal, null, missionsModal, wheelModal, dailyRewardModal, lbModal, statsModal][index];
    if (activeModal) {
      const card = activeModal.querySelector('.modal-card');
      if (card) {
        card.classList.remove('slide-from-left', 'slide-from-right');
        void card.offsetWidth;
        if (direction === 'left') {
          card.classList.add('slide-from-right');
        } else if (direction === 'right') {
          card.classList.add('slide-from-left');
        }
      }
    }
  }

  setupMenuSwipeNavigation() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwiping = false;

    const handleTouchStart = (e) => {
      if (this.state !== 'MENU') return;
      if (!e.touches || e.touches.length !== 1) return;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
      isSwiping = true;
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping || this.state !== 'MENU') return;
      isSwiping = false;
      if (!e.changedTouches || e.changedTouches.length !== 1) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const deltaTime = Date.now() - touchStartTime;

      if (deltaTime > 650) return;
      if (Math.abs(deltaX) < 45) return;
      if (Math.abs(deltaX) < Math.abs(deltaY) * 1.3) return;

      const target = e.target;
      if (target && target.closest && target.closest('#menu-ship-card')) {
        if (deltaX > 40) {
          this.prevMenuSkin();
          return;
        } else if (deltaX < -40) {
          this.nextMenuSkin();
          return;
        }
      }

      // Clash Royale Sekme Sıralaması:
      // 0: Hangar <-> 1: Ana Hub <-> 2: Görevler <-> 3: Çark <-> 4: İkmal <-> 5: Liderler
      const currentTab = this.getCurrentMenuTabIndex();

      if (deltaX < -45) {
        // Parmağı sola kaydır -> Sonraki sekmeye geç (sağa doğru)
        if (currentTab < 5) {
          this.goToMenuTab(currentTab + 1, 'left');
        }
      } else if (deltaX > 45) {
        // Parmağı sağa kaydır -> Önceki sekmeye geç (sola doğru)
        if (currentTab > 0) {
          this.goToMenuTab(currentTab - 1, 'right');
        }
      }
    };

    const swipeContainers = [
      document.getElementById('start-screen'),
      document.getElementById('hangar-modal'),
      document.getElementById('missions-modal'),
      document.getElementById('lucky-wheel-modal'),
      document.getElementById('daily-reward-modal'),
      document.getElementById('leaderboard-modal'),
      document.getElementById('stats-modal')
    ];

    swipeContainers.forEach(container => {
      if (container) {
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });
      }
    });
  }

  async requestWakeLock() {
    try {
      if ('wakeLock' in navigator && !this.wakeLock) {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
        });
      }
    } catch (e) {}
  }

  releaseWakeLock() {
    try {
      if (this.wakeLock) {
        this.wakeLock.release();
        this.wakeLock = null;
      }
    } catch (e) {}
  }

  pauseGame() {
    if (this.state !== 'PLAYING') return;
    this.state = 'PAUSED';
    this.releaseWakeLock();
    try { history.pushState({ modal: 'pause' }, ''); } catch(e) {}
    if (sounds.pauseAudio) sounds.pauseAudio();
    else sounds.stopBGM();
    if (sounds.setPauseFilter) sounds.setPauseFilter(true);
    if (this.cancelDrag) this.cancelDrag();
    vibrate.light();

    // Üst Görev & Durum Kartını Güncelle (HUD'dan Duraklatma Menüsüne Taşınan Bilgiler)
    const stageEl = document.getElementById('pause-stage-text');
    const waveEl = document.getElementById('pause-wave-text');
    const timeEl = document.getElementById('pause-time-text');
    const scoreEl = document.getElementById('pause-score-text');

    if (stageEl) {
      stageEl.textContent = this.currentMode === 'classic' ? `BÖLÜM ${this.selectedLevel || 1}` : 'FIRTINA MODU';
    }
    if (waveEl) {
      waveEl.textContent = `DALGA ${this.wave || 1}`;
    }
    if (timeEl) {
      const mins = Math.floor((this.gameTime || 0) / 60).toString().padStart(2, '0');
      const secs = Math.floor((this.gameTime || 0) % 60).toString().padStart(2, '0');
      timeEl.textContent = `${mins}:${secs}`;
    }
    if (scoreEl) {
      scoreEl.textContent = (this.player ? this.player.score : 0).toLocaleString();
    }

    // Ses ve Titreşim Buton Metinlerini Güncelle
    this.updatePauseAudioButtons();

    // Pause Menüsü Görev Bölümünü Güncelle
    this.updatePauseQuestDisplay();

    this.renderPauseCodex();
    if (pauseModal) pauseModal.classList.remove('hidden');
  }

  updatePauseQuestDisplay() {
    if (!pauseQuestTitle || !pauseQuestBarFill || !pauseQuestReward) return;
    if (this.currentMiniQuest) {
      const q = this.currentMiniQuest;
      const pct = Math.min(100, (q.current / q.target) * 100);
      pauseQuestBarFill.style.width = `${pct}%`;
      const baseName = q.title.split('(')[0].trim();
      pauseQuestTitle.textContent = `${baseName} (${Math.min(q.target, Math.round(q.current))}/${q.target})`;
      pauseQuestReward.innerHTML = `+${q.reward} ${getPixelIconSvg('crystal', 'sm')}`;
    } else {
      pauseQuestTitle.textContent = 'Yeni Görev Bekleniyor...';
      pauseQuestBarFill.style.width = '0%';
      pauseQuestReward.textContent = '--';
    }
  }

  updateAudioButtons() {
    const isMuted = sounds.isMuted;
    const isVibrate = vibrate.enabled;
    const soundOnSvg = `<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12"><path d="M1 4h2v4H1zM3 3h2v6H3zM5 2h2v8H5zM8 3h1v1H8zM9 4h1v4H9zM8 8h1v1H8zM11 2h1v8h-1z" fill="#00f0ff"/></svg>`;
    const soundOffSvg = `<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12"><path d="M1 4h2v4H1zM3 3h2v6H3zM5 2h2v8H5zM8 4h1v1H8zM9 5h1v2H9zM8 7h1v1H8zM10 3h1v1h-1zm1 1h1v1h-1zm-2 2h1v1H9zm-1 1h1v1H8z" fill="#64748b"/><line x1="8" y1="3" x2="12" y2="9" stroke="#ff0055" stroke-width="1.5"/></svg>`;
    const vibOnSvg = `<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12"><rect x="3" y="1" width="6" height="10" rx="1" fill="#00f0ff"/><line x1="1" y1="4" x2="1" y2="8" stroke="#00f0ff" stroke-width="1.2"/><line x1="11" y1="4" x2="11" y2="8" stroke="#00f0ff" stroke-width="1.2"/></svg>`;
    const vibOffSvg = `<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12"><rect x="3" y="1" width="6" height="10" rx="1" fill="#64748b"/><line x1="1" y1="4" x2="1" y2="8" stroke="#64748b" stroke-width="1.2"/><line x1="11" y1="4" x2="11" y2="8" stroke="#64748b" stroke-width="1.2"/></svg>`;

    if (btnSoundToggle) btnSoundToggle.innerHTML = isMuted ? soundOffSvg : soundOnSvg;
    if (btnSoundMenu) {
      btnSoundMenu.innerHTML = isMuted ? soundOffSvg : soundOnSvg;
      btnSoundMenu.title = isMuted ? 'Ses: Kapalı' : 'Ses: Açık';
    }
    if (btnVibrateMenu) {
      btnVibrateMenu.innerHTML = isVibrate ? vibOnSvg : vibOffSvg;
      btnVibrateMenu.title = isVibrate ? 'Titreşim: Açık' : 'Titreşim: Kapalı';
    }

    const btnPauseSound = document.getElementById('btn-pause-sound');
    const btnPauseVibrate = document.getElementById('btn-pause-vibrate');
    if (btnPauseSound) {
      btnPauseSound.innerHTML = `<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12" style="margin-right:4px;"><path d="M1 4h2v4H1zM3 3h2v6H3zM5 2h2v8H5zM8 3h1v1H8zM9 4h1v4H9zM8 8h1v1H8zM11 2h1v8h-1z" fill="${isMuted ? '#64748b' : '#00f0ff'}"/></svg> SES: ${isMuted ? 'KAPALI' : 'AÇIK'}`;
    }
    if (btnPauseVibrate) {
      btnPauseVibrate.innerHTML = `<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12" style="margin-right:4px;"><rect x="3" y="1" width="6" height="10" rx="1" fill="${isVibrate ? '#00f0ff' : '#64748b'}"/><line x1="1" y1="4" x2="1" y2="8" stroke="${isVibrate ? '#00f0ff' : '#64748b'}" stroke-width="1.2"/><line x1="11" y1="4" x2="11" y2="8" stroke="${isVibrate ? '#00f0ff' : '#64748b'}" stroke-width="1.2"/></svg> TİTREŞİM: ${isVibrate ? 'AÇIK' : 'KAPALI'}`;
    }
  }

  updatePauseAudioButtons() {
    this.updateAudioButtons();
  }

  renderPauseCodex() {
    // 1. Aktif Ekipman & Teçhizat Listesi
    const invGrid = document.getElementById('pause-inventory-grid');
    if (invGrid) {
      invGrid.innerHTML = '';
      const UPGRADE_NAMES = {
        laser: 'PLAZMA LAZERİ',
        missiles: 'MİKRO-FÜZE',
        shield: 'ENERJİ KALKANI',
        magnet: 'ÇEKİM ALANI',
        fireRate: 'HIZLANDIRICI',
        drones: 'SAVUNMA DRONU',
        tesla: 'TESLA BOBİNİ',
        emp: 'EMP ŞOK DALGASI',
        hull: 'NANİT GÖVDE'
      };
      const UPGRADE_MAX = {
        laser: 5,
        missiles: 4,
        shield: 4,
        magnet: 3,
        fireRate: 4,
        drones: 3,
        tesla: 4,
        emp: 3,
        hull: 3
      };

      let count = 0;
      if (this.player && this.player.upgrades) {
        for (const [key, lvl] of Object.entries(this.player.upgrades)) {
          if (lvl > 0) {
            count++;
            const max = UPGRADE_MAX[key] || 5;
            const card = document.createElement('div');
            card.className = 'pause-inv-card';
            card.innerHTML = `
              <div class="pause-inv-icon">
                ${this.getUpgradeSvg(key)}
              </div>
              <div class="pause-inv-info">
                <span class="pause-inv-name">${UPGRADE_NAMES[key] || key.toUpperCase()}</span>
                <span class="pause-inv-level">LVL ${lvl}/${max}</span>
              </div>
            `;
            invGrid.appendChild(card);
          }
        }
      }
      if (count === 0) {
        invGrid.innerHTML = '<div style="color: #64748b; font-size: 11px; grid-column: 1/-1; padding: 6px;">Henüz aktif bir silah seçilmedi.</div>';
      }
    }

    const codexGrid = document.getElementById('pause-codex-grid');
    if (!codexGrid) return;
    codexGrid.innerHTML = '';

    const RECIPES = [
      { id: 'vortex', name: 'VORTEX KARADELİK LAZERİ', recipe: 'Lazer Lvl 5 + Mıknatıs Lvl 1', active: this.player.evolutions.vortexLaser, ready: this.player.upgrades.laser >= 5 && this.player.upgrades.magnet >= 1 },
      { id: 'cluster', name: 'NÜKLEER SÜRÜ FÜZESİ', recipe: 'Füze Lvl 4 + EMP Lvl 1', active: this.player.evolutions.clusterMissiles, ready: this.player.upgrades.missiles >= 4 && this.player.upgrades.emp >= 1 },
      { id: 'ion_storm', name: 'TESLA İYON FIRTINASI', recipe: 'Tesla Lvl 4 + Atış Hızı Lvl 4', active: this.player.evolutions.ionStorm, ready: (this.player.upgrades.tesla || 0) >= 4 && this.player.upgrades.fireRate >= 4 },
      { id: 'bastion', name: 'ORBİTAL BASTİON HALKASI', recipe: 'Kalkan Lvl 4 + Dron Lvl 3', active: this.player.evolutions.nanoBastion, ready: this.player.upgrades.shield >= 4 && (this.player.upgrades.drones || 0) >= 3 },
      { id: 'cryo', name: 'MUTLAK SIFIR KRİYO-BLASTER', recipe: 'Lazer Lvl 4 + Gövde/Kalkan Lvl 3', active: this.player.evolutions.cryoBlaster, ready: this.player.upgrades.laser >= 4 && ((this.player.upgrades.hull || 0) >= 3 || this.player.upgrades.shield >= 2) },
      { id: 'saws', name: 'PLAZMA TESTERELERİ', recipe: 'Dron Lvl 3 + Atış Hızı Lvl 4', active: this.player.evolutions.orbitalSaws, ready: (this.player.upgrades.drones || 0) >= 3 && this.player.upgrades.fireRate >= 4 },
      { id: 'supernova', name: 'SÜPERNOVA ÇEKİRDEĞİ', recipe: 'Füze Lvl 4 + Tesla Lvl 3', active: this.player.evolutions.supernova, ready: this.player.upgrades.missiles >= 4 && (this.player.upgrades.tesla || 0) >= 3 },
      { id: 'matrix', name: 'KIYAMET TESLA MATRİSİ', recipe: 'Tesla Lvl 4 + EMP Lvl 3', active: this.player.evolutions.doomsdayMatrix, ready: (this.player.upgrades.tesla || 0) >= 4 && this.player.upgrades.emp >= 3 },
      { id: 'hyper_plasma', name: 'AŞIRI YÜKLEMELİ PLAZMA', recipe: 'Gövde Lvl 3 + Atış Hızı Lvl 4', active: this.player.evolutions.hyperPlasma, ready: (this.player.upgrades.hull || 0) >= 3 && this.player.upgrades.fireRate >= 4 },
      { id: 'void_drones', name: 'VAKUM AVCI DRONLARI', recipe: 'Dron Lvl 3 + Mıknatıs Lvl 3', active: this.player.evolutions.voidDrones, ready: (this.player.upgrades.drones || 0) >= 3 && this.player.upgrades.magnet >= 3 }
    ];

    RECIPES.forEach(r => {
      const row = document.createElement('div');
      let statusClass = 'locked';
      let statusText = 'KİLİTLİ';
      if (r.active) {
        statusClass = 'active';
        statusText = 'AKTİF';
        row.className = 'codex-row unlocked';
      } else if (r.ready) {
        statusClass = 'ready';
        statusText = 'HAZIR!';
        row.className = 'codex-row ready';
      } else {
        row.className = 'codex-row';
      }

      row.innerHTML = `
        <div class="codex-icon-box" style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: rgba(0,0,0,0.35); border-radius: 8px; border: 1px solid rgba(0, 240, 255, 0.25);">
          ${this.getUpgradeSvg('evo_' + r.id) || this.getUpgradeSvg(r.id)}
        </div>
        <div class="codex-name-group" style="flex: 1; margin-left: 10px;">
          <span class="codex-name">${r.name}</span>
          <span class="codex-recipe">${r.recipe}</span>
        </div>
        <span class="codex-status ${statusClass}">${statusText}</span>
      `;
      codexGrid.appendChild(row);
    });
  }

  renderMasteryTree() {
    const grid = document.getElementById('mastery-grid');
    if (!grid) return;
    const nodes = [
      { id: 'magnet', name: 'MIKNATIS', icon: '⚓', max: 5, cost: 200, desc: '+%10 Menzil/Lv' },
      { id: 'critDmg', name: 'KRİTİK', icon: '⚡', max: 5, cost: 250, desc: '+%8 Hasar/Lv' },
      { id: 'startShield', name: 'KALKAN', icon: '🛡️', max: 3, cost: 300, desc: '+10 Kalkan/Lv' },
      { id: 'xpBonus', name: 'DEN. BON.', icon: '⭐', max: 5, cost: 180, desc: '+%10 XP/Lv' },
      { id: 'crystalBonus', name: 'KRİSTAL', icon: '💎', max: 4, cost: 240, desc: '+%12 Kristal/Lv' },
      { id: 'rerollStart', name: 'YENİDEN', icon: '🎲', max: 2, cost: 500, desc: '+1 Reroll/Lv' }
    ];
    grid.innerHTML = '';
    for (const node of nodes) {
      const lv = this.masteryTree[node.id] || 0;
      const isMaxed = lv >= node.max;
      const cost = node.cost * (lv + 1);
      const canBuy = this.totalCrystals >= cost && !isMaxed;
      const div = document.createElement('div');
      div.className = `mastery-node ${lv > 0 ? 'unlocked' : ''} ${isMaxed ? 'maxed' : ''}`;
      div.innerHTML = '<div class="mastery-node-icon">' + node.icon + '</div>' +
        '<div class="mastery-node-name">' + node.name + '</div>' +
        '<div class="mastery-node-level">Lv.' + lv + '/' + node.max + '</div>' +
        (!isMaxed ? '<div class="mastery-node-cost">' + cost + ' 💎</div>' : '<div class="mastery-node-cost" style="color:#05ffa1">MAKS</div>');
      if (canBuy) {
        div.addEventListener('click', () => {
          this.totalCrystals -= cost;
          this.masteryTree[node.id] = lv + 1;
          localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
          localStorage.setItem('neon_mastery', JSON.stringify(this.masteryTree));
          this.updateCrystalsDisplay();
          sounds.playCardSelect();
          vibrate.medium();
          this.renderMasteryTree();
        });
      }
      grid.appendChild(div);
    }
  }

  checkAllTrophies() {
    if (!this.pilotStats) this.pilotStats = this.loadPilotStats();
    let newlyCompleted = false;

    for (const def of this.trophyDefs) {
      if (this.trophies[def.id]) continue; // Zaten ödülü alınmış
      const currentVal = this.pilotStats[def.stat] || 0;
      if (currentVal >= def.target) {
        // Otomatik hak kazanıldı, henüz alınmadıysa kaydedilebilir
        newlyCompleted = true;
      }
    }
    return newlyCompleted;
  }

  claimTrophy(id) {
    if (this.trophies[id]) return;
    const def = this.trophyDefs.find(t => t.id === id);
    if (!def) return;

    if (!this.pilotStats) this.pilotStats = this.loadPilotStats();
    const currentVal = this.pilotStats[def.stat] || 0;
    if (currentVal < def.target) return; // Henüz hedefe ulaşılmamış

    this.trophies[id] = true;
    localStorage.setItem('neon_trophies', JSON.stringify(this.trophies));

    this.totalCrystals += def.reward;
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    this.updateCrystalsDisplay();

    sounds.playJackpot();
    vibrate.success();

    if (this.player) {
      this.particles.spawnFloatingText(this.player.x, this.player.y - 40, '🏆 ' + def.name + '! +' + def.reward + ' CR', '#ffd700', 16);
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffd700', 150);
    }

    this.renderTrophies();
  }

  checkTrophy(id) {
    // Geriye dönük uyumluluk çağrısı
    this.claimTrophy(id);
  }

  renderTrophies() {
    const grid = document.getElementById('trophies-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!this.pilotStats) this.pilotStats = this.loadPilotStats();

    // 30 Başarımı Kategori ve Kademeye Göre Sıralı Render Et
    for (const def of this.trophyDefs) {
      const earned = !!this.trophies[def.id];
      const currentVal = Math.min(def.target, this.pilotStats[def.stat] || 0);
      const isReadyToClaim = !earned && currentVal >= def.target;
      const progressPct = Math.min(100, Math.floor((currentVal / def.target) * 100));

      const card = document.createElement('div');
      card.className = 'trophy-card' + (earned ? ' maxed' : isReadyToClaim ? ' claimable' : '');

      card.innerHTML = `
        <div class="trophy-icon">${earned ? def.icon : isReadyToClaim ? '⭐' : def.icon}</div>
        <div class="trophy-main">
          <div class="trophy-header-row">
            <span class="trophy-name">${def.name}</span>
            <span class="trophy-level-badge">KADEME ${def.tier}</span>
          </div>
          <div class="trophy-desc">${def.desc}</div>
          <div class="trophy-progress-track">
            <div class="trophy-progress-fill" style="width: ${progressPct}%;"></div>
          </div>
          <div class="trophy-meta-row">
            <span>${currentVal.toLocaleString()} / ${def.target.toLocaleString()}</span>
            <span>+${def.reward} 💎</span>
          </div>
        </div>
      `;

      if (isReadyToClaim) {
        const claimBtn = document.createElement('button');
        claimBtn.className = 'trophy-claim-btn pulse';
        claimBtn.textContent = 'AL +' + def.reward + ' 💎';
        claimBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.claimTrophy(def.id);
        });
        card.appendChild(claimBtn);
      } else if (earned) {
        const completedBadge = document.createElement('div');
        completedBadge.className = 'trophy-level-badge';
        completedBadge.style.color = '#05ffa1';
        completedBadge.style.borderColor = 'rgba(5, 255, 161, 0.4)';
        completedBadge.textContent = 'TAMAMLANDI';
        card.appendChild(completedBadge);
      }

      grid.appendChild(card);
    }
  }

  resumeGame() {
    if (this.state !== 'PAUSED') return;
    this.state = 'PLAYING';
    this.lastTime = performance.now();
    this.requestWakeLock();
    if (sounds.resumeAudio) sounds.resumeAudio();
    if (sounds.setPauseFilter) sounds.setPauseFilter(false);
    sounds.startBGM();
    vibrate.light();
    if (pauseModal) pauseModal.classList.add('hidden');
  }

  openHangar() {
    try { history.pushState({ modal: 'hangar' }, ''); } catch(e) {}
    this.renderHangarSkins();
    this.renderHangarTrails();
    this.renderHangarDrones();
    this.renderTechUpgrades();
    this.renderMasteryTree();
    this.renderTrophies();

    // Sekmelerin görünürlüğünü garantiye al
    if (tabBtnTrails && tabBtnTrails.classList.contains('active')) {
      if (trailsContainer) trailsContainer.classList.remove('hidden');
      if (skinsContainer) skinsContainer.classList.add('hidden');
      if (dronesContainer) dronesContainer.classList.add('hidden');
      if (techTabView) techTabView.classList.add('hidden');
      if (techContainer) techContainer.classList.add('hidden');
      if (trophiesTabView) trophiesTabView.classList.add('hidden');
    } else if (tabBtnDrones && tabBtnDrones.classList.contains('active')) {
      if (dronesContainer) dronesContainer.classList.remove('hidden');
      if (skinsContainer) skinsContainer.classList.add('hidden');
      if (trailsContainer) trailsContainer.classList.add('hidden');
      if (techTabView) techTabView.classList.add('hidden');
      if (techContainer) techContainer.classList.add('hidden');
      if (trophiesTabView) trophiesTabView.classList.add('hidden');
    } else if (tabBtnTrophies && tabBtnTrophies.classList.contains('active')) {
      if (trophiesTabView) trophiesTabView.classList.remove('hidden');
      if (skinsContainer) skinsContainer.classList.add('hidden');
      if (trailsContainer) trailsContainer.classList.add('hidden');
      if (dronesContainer) dronesContainer.classList.add('hidden');
      if (techTabView) techTabView.classList.add('hidden');
      if (techContainer) techContainer.classList.add('hidden');
    } else if (tabBtnTech && tabBtnTech.classList.contains('active')) {
      if (techTabView) techTabView.classList.remove('hidden');
      if (techContainer) techContainer.classList.remove('hidden');
      if (skinsContainer) skinsContainer.classList.add('hidden');
      if (trailsContainer) trailsContainer.classList.add('hidden');
      if (dronesContainer) dronesContainer.classList.add('hidden');
      if (trophiesTabView) trophiesTabView.classList.add('hidden');
    } else {
      if (tabBtnSkins) tabBtnSkins.classList.add('active');
      if (tabBtnTrails) tabBtnTrails.classList.remove('active');
      if (tabBtnDrones) tabBtnDrones.classList.remove('active');
      if (tabBtnTech) tabBtnTech.classList.remove('active');
      if (tabBtnTrophies) tabBtnTrophies.classList.remove('active');
      if (skinsContainer) skinsContainer.classList.remove('hidden');
      if (trailsContainer) trailsContainer.classList.add('hidden');
      if (dronesContainer) dronesContainer.classList.add('hidden');
      if (techTabView) techTabView.classList.add('hidden');
      if (techContainer) techContainer.classList.add('hidden');
      if (trophiesTabView) trophiesTabView.classList.add('hidden');
    }

    if (hangarModal) hangarModal.classList.remove('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(0);
  }

  closeHangar() {
    if (hangarModal) hangarModal.classList.add('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(1);
  }

  updateCrystalsDisplay() {
    if (totalCrystalsDisplay) totalCrystalsDisplay.textContent = this.totalCrystals.toLocaleString();
    if (hangarCrystalsVal) hangarCrystalsVal.textContent = this.totalCrystals.toLocaleString();
  }

  updateGoldDisplay() {
    this.updateCrystalsDisplay();
  }

  saveGold(val) {
    this.totalCrystals = val;
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    this.updateCrystalsDisplay();
  }

  addGoldReward(amount = 200, isAd = false) {
    let finalAmount = amount;
    let isJackpot = false;

    if (isAd && Math.random() < 0.28) {
      isJackpot = true;
      finalAmount = 380;
    }

    if (isAd) {
      try {
        const wState = this.getWheelState ? this.getWheelState() : JSON.parse(localStorage.getItem('neon_wheel_state') || '{}');
        wState.freeSpinsUsed = Math.max(0, (wState.freeSpinsUsed || 0) - 1);
        if (this.saveWheelState) this.saveWheelState(wState);
        else localStorage.setItem('neon_wheel_state', JSON.stringify(wState));
      } catch (e) {}
    }

    this.totalCrystals += finalAmount;
    if (this.pilotStats) {
      this.pilotStats.lifetimeCrystals = (this.pilotStats.lifetimeCrystals || 0) + finalAmount;
      this.savePilotStats();
    }
    this.saveGold(this.totalCrystals);

    // Ses ve görsel efekt
    sounds.playLevelUp();
    if (sounds.playPowerup) sounds.playPowerup();
    sounds.playJackpot();
    vibrate.success();

    // Ekranda kayan yazı ve şok dalgası
    if (isJackpot) {
      this.showToast(`🔥 SÜPER JACKPOT! 2X ÖDÜL KAZANDIN (+${finalAmount} CR)!`, '#ffd700');
    } else {
      this.showToast(`🪙 +${finalAmount} Altın / Kristal Kazanıldı!`, '#ffbe0b');
    }

    if (this.particles) {
      const centerX = this.width / 2;
      const centerY = this.height * 0.35;
      const text = isJackpot ? `🔥 SÜPER JACKPOT: +${finalAmount} CR! 🔥` : `🪙 +${finalAmount} KRİSTAL!`;
      this.particles.spawnFloatingText(centerX, centerY, text, '#ffd700', isJackpot ? 26 : 22);
      this.particles.spawnShockwave(centerX, centerY, '#ffd700', isJackpot ? 380 : 250);
      this.particles.spawnExplosion(centerX, centerY, '#ffbe0b', isJackpot ? 40 : 20, isJackpot ? 5 : 3);
    }
  }

  doubleGameOverCrystals() {
    if (this.gameOverAdUsed) return;
    const btnDouble = document.getElementById('btn-double-crystals');
    const textSpan = document.getElementById('btn-double-crystals-text');
    if (btnDouble) {
      btnDouble.disabled = true;
      if (textSpan) textSpan.textContent = '🎬 REKLAM YÜKLENİYOR...';
    }

    const earned = this.crystalsEarnedThisRun || 0;
    const baseGain = Math.max(100, earned);

    if (window.showRewardedAd) {
      window.showRewardedAd(
        (reward) => {
          this.gameOverAdUsed = true;
          this.totalCrystals += baseGain;
          this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + baseGain;
          if (this.pilotStats) {
            this.pilotStats.lifetimeCrystals = (this.pilotStats.lifetimeCrystals || 0) + baseGain;
            this.savePilotStats();
          }
          this.saveGold(this.totalCrystals);
          this.updateCrystalsDisplay();

          if (finalCrystals) {
            finalCrystals.textContent = `+${this.crystalsEarnedThisRun.toLocaleString()} CR (2X KATLANDI! 🚀)`;
          }
          const finalCrystalsBoosted = document.getElementById('final-crystals-boosted');
          if (finalCrystalsBoosted) {
            finalCrystalsBoosted.textContent = `+${this.crystalsEarnedThisRun.toLocaleString()} CR ✓`;
            finalCrystalsBoosted.style.color = '#05ffa1';
          }
          if (btnDouble) {
            btnDouble.disabled = true;
            btnDouble.classList.remove('pulse');
            btnDouble.classList.remove('gold-shimmer-btn');
            btnDouble.innerHTML = `<span>GANİMET İKİYE KATLANDI ✓ (+${baseGain} CR)</span>`;
          }

          sounds.playLevelUp();
          sounds.playJackpot();
          vibrate.success();
          this.showToast(`✨ Ganimet İkiye Katlandı! (+${baseGain} Kristal)`, '#05ffa1');
          if (this.particles) {
            this.particles.spawnShockwave(this.width / 2, this.height * 0.45, '#05ffa1', 300);
            this.particles.spawnExplosion(this.width / 2, this.height * 0.45, '#05ffa1', 25, 4);
          }
        },
        (err) => {
          console.warn('2X Ganimet reklamı tamamlanmadı:', err);
          if (btnDouble) {
            btnDouble.disabled = false;
            btnDouble.innerHTML = `
              <span class="btn-shimmer-badge">⚡ 2X KATLA</span>
              <span id="btn-double-crystals-text">🎬 GANİMETİ İKİYE KATLA (+${baseGain} CR)</span>
            `;
          }
          this.showToast('⚠️ Reklam tamamlanmadığı için ganimet katlanamadı.', '#ff0055');
          vibrate.medium();
        }
      );
    } else {
      this.showToast('⚠️ Reklam servisi şu anda hazır değil.', '#ffbe0b');
      if (btnDouble) {
        btnDouble.disabled = false;
        btnDouble.innerHTML = `
          <span class="btn-shimmer-badge">⚡ 2X KATLA</span>
          <span id="btn-double-crystals-text">🎬 GANİMETİ İKİYE KATLA (+${baseGain} CR)</span>
        `;
      }
    }
  }

  doubleVictoryCrystals() {
    if (this.victoryAdUsed) return;
    const btnVictory = document.getElementById('btn-victory-double');
    if (btnVictory) {
      btnVictory.disabled = true;
      btnVictory.textContent = '🎬 REKLAM YÜKLENİYOR...';
    }

    const bonus = this.lastVictoryReward || 150;

    if (window.showRewardedAd) {
      window.showRewardedAd(
        (reward) => {
          this.victoryAdUsed = true;
          this.totalCrystals += bonus;
          this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + bonus;
          if (this.pilotStats) {
            this.pilotStats.lifetimeCrystals = (this.pilotStats.lifetimeCrystals || 0) + bonus;
            this.savePilotStats();
          }
          this.saveGold(this.totalCrystals);
          this.updateCrystalsDisplay();

          const victoryRewardCrystals = document.getElementById('victory-reward-crystals');
          if (victoryRewardCrystals) {
            victoryRewardCrystals.textContent = `+${(bonus * 2).toLocaleString()} CR (2X KATLANDI! 🏆)`;
          }
          if (btnVictory) {
            btnVictory.disabled = true;
            btnVictory.classList.remove('pulse');
            btnVictory.classList.remove('gold-shimmer-btn');
            btnVictory.innerHTML = `<span>2X ZAFER GANİMETİ ALINDI ✓ (+${bonus} CR)</span>`;
          }

          sounds.playLevelUp();
          sounds.playJackpot();
          vibrate.success();
          this.showToast(`🏆 Zafer Ganimeti İkiye Katlandı! (+${bonus} Kristal)`, '#ffd700');
          if (this.particles) {
            this.particles.spawnShockwave(this.width / 2, this.height * 0.45, '#ffd700', 350);
            this.particles.spawnExplosion(this.width / 2, this.height * 0.45, '#ffd700', 30, 4);
          }
        },
        (err) => {
          console.warn('Zafer ganimeti reklamı tamamlanmadı:', err);
          if (btnVictory) {
            btnVictory.disabled = false;
            btnVictory.innerHTML = `
              <span class="btn-shimmer-badge">🏆 2X ZAFER</span>
              <span id="btn-victory-double-text">🎬 ZAFER GANİMETİNİ KATLA (+${bonus} CR)</span>
            `;
          }
          this.showToast('⚠️ Reklam tamamlanmadığı için ganimet katlanamadı.', '#ff0055');
          vibrate.medium();
        }
      );
    } else {
      this.showToast('⚠️ Reklam servisi şu anda hazır değil.', '#ffbe0b');
      if (btnVictory) {
        btnVictory.disabled = false;
        btnVictory.innerHTML = `
          <span class="btn-shimmer-badge">🏆 2X ZAFER</span>
          <span id="btn-victory-double-text">🎬 ZAFER GANİMETİNİ KATLA (+${bonus} CR)</span>
        `;
      }
    }
  }

  claimMerchantAdGold() {
    if (this.merchantAdUsed) return;
    const btnMerchantAd = document.getElementById('btn-merchant-ad-gold');
    const textSpan = document.getElementById('btn-merchant-ad-gold-text');
    if (btnMerchantAd) {
      btnMerchantAd.disabled = true;
      if (textSpan) textSpan.textContent = '🎬 REKLAM YÜKLENİYOR...';
    }

    if (window.showRewardedAd) {
      window.showRewardedAd(
        (reward) => {
          this.merchantAdUsed = true;
          const isLucky = Math.random() < 0.28;
          const gain = isLucky ? 320 : 180;
          this.totalCrystals += gain;
          this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + gain;
          if (this.pilotStats) {
            this.pilotStats.lifetimeCrystals = (this.pilotStats.lifetimeCrystals || 0) + gain;
            this.savePilotStats();
          }
          this.saveGold(this.totalCrystals);
          this.updateCrystalsDisplay();

          const merchantCrystalsDisplay = document.getElementById('merchant-crystals-display');
          if (merchantCrystalsDisplay) {
            merchantCrystalsDisplay.textContent = this.totalCrystals.toLocaleString();
          }

          if (btnMerchantAd) {
            btnMerchantAd.disabled = true;
            btnMerchantAd.classList.remove('pulse');
            btnMerchantAd.classList.remove('gold-shimmer-btn');
            if (textSpan) textSpan.textContent = `DESTEK ALINDI ✓ (+${gain} CR)`;
          }

          // Kaçakçı ürünlerini yeniden render et (yeni bütçeyle ürünler açılabilir!)
          this.renderMerchantItems();

          sounds.playLevelUp();
          sounds.playJackpot();
          vibrate.success();
          if (isLucky) {
            this.showToast('🔥 EFSANEVİ KAÇAKÇI DESTEĞİ: +200 KRİSTAL!', '#ffd700');
          } else {
            this.showToast('💰 Kaçakçı Desteği: +100 Kristal Eklendi!', '#ffd700');
          }
        },
        (err) => {
          console.warn('Kaçakçı desteği reklamı tamamlanmadı:', err);
          if (btnMerchantAd) {
            btnMerchantAd.disabled = false;
            if (textSpan) textSpan.textContent = '🎬 KAÇAKÇI DESTEĞİ: +100 KRİSTAL AL';
          }
          this.showToast('⚠️ Reklam tamamlanmadığı için kristal verilemedi.', '#ff0055');
          vibrate.medium();
        }
      );
    } else {
      this.showToast('⚠️ Reklam servisi şu anda hazır değil.', '#ffbe0b');
      if (btnMerchantAd) {
        btnMerchantAd.disabled = false;
        if (textSpan) textSpan.textContent = '🎬 KAÇAKÇI DESTEĞİ: +100 KRİSTAL AL';
      }
    }
  }

  showToast(message, color = '#00f0ff') {
    const existing = document.getElementById('floating-game-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'floating-game-toast';
    toast.style.cssText = `
      position: fixed;
      top: 55px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      background: rgba(12, 18, 36, 0.95);
      border: 1.5px solid ${color};
      color: ${color};
      padding: 10px 18px;
      border-radius: 9999px;
      font-family: var(--font-display, monospace);
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.5px;
      box-shadow: 0 0 20px rgba(255, 190, 11, 0.45);
      z-index: 999999;
      pointer-events: none;
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      opacity: 0;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(-20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 2400);
  }

  renderHangarSkins() {
    if (!skinsContainer) return;
    skinsContainer.innerHTML = '';

    Object.values(this.skins).forEach(skin => {
      const isUnlocked = this.unlockedSkins.includes(skin.id);
      const isEquipped = this.currentSkinId === skin.id;

      const card = document.createElement('div');
      card.className = `skin-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;

      let badgeText = 'SEÇ';
      let badgeClass = 'unlocked';
      if (isEquipped) {
        badgeText = 'KULLANILIYOR';
        badgeClass = 'equipped';
      } else if (!isUnlocked) {
        badgeText = `${skin.cost} CR`;
        badgeClass = 'locked';
      }

      card.innerHTML = `
        <div class="skin-ship-art">
          ${getShipPixelSvg(skin.id, 52)}
        </div>
        <span class="skin-card-title">${skin.name}</span>
        <span class="skin-badge ${badgeClass}">${badgeText}</span>
      `;

      card.addEventListener('click', () => {
        sounds.init();
        if (isUnlocked) {
          this.currentSkinId = skin.id;
          localStorage.setItem('neon_equipped_skin', skin.id);
          sounds.playCardSelect();
          vibrate.light();
          this.renderHangarSkins();
        } else if (this.totalCrystals >= skin.cost) {
          this.totalCrystals -= skin.cost;
          localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
          this.unlockedSkins.push(skin.id);
          localStorage.setItem('neon_unlocked_skins', JSON.stringify(this.unlockedSkins));
          this.currentSkinId = skin.id;
          localStorage.setItem('neon_equipped_skin', skin.id);
          sounds.playLevelUp();
          vibrate.success();
          this.updateCrystalsDisplay();
          this.renderHangarSkins();
        } else {
          vibrate.medium();
        }
      });

      skinsContainer.appendChild(card);
    });
  }

  renderHangarDrones() {
    if (!dronesContainer) return;
    dronesContainer.innerHTML = '';

    const upgradeCosts = [0, 350, 700, 1300, 2200, 3500]; // Lvl 1 -> 5 dengeli maliyetleri

    Object.values(this.hangarDrones).forEach(drone => {
      const currentLvl = this.droneLevels[drone.id] || 0;
      const isUnlocked = currentLvl > 0;
      const isEquipped = this.equippedDroneId === drone.id && isUnlocked;
      const nextCost = upgradeCosts[currentLvl + 1] || 99999;
      const isMax = currentLvl >= 5;

      const card = document.createElement('div');
      card.className = `skin-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;

      let badgeText = isEquipped ? 'KUŞANILDI' : (isUnlocked ? 'KUŞAN' : `${drone.cost} CR`);
      let badgeClass = isEquipped ? 'equipped' : (isUnlocked ? 'unlocked' : 'locked');

      card.innerHTML = `
        <div class="skin-ship-art" style="display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);border-radius:10px;padding:8px;">
          <svg viewBox="0 0 32 32" width="46" height="46">
            <circle cx="16" cy="16" r="10" fill="none" stroke="${drone.color}" stroke-width="2"/>
            <circle cx="16" cy="16" r="4" fill="${drone.color}"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="${drone.color}" stroke-width="2"/>
            <line x1="16" y1="26" x2="16" y2="30" stroke="${drone.color}" stroke-width="2"/>
            <line x1="2" y1="16" x2="6" y2="16" stroke="${drone.color}" stroke-width="2"/>
            <line x1="26" y1="16" x2="30" y2="16" stroke="${drone.color}" stroke-width="2"/>
          </svg>
        </div>
        <span class="skin-card-title">${drone.name} ${isUnlocked ? `<span style="color:#ffd700;font-size:0.75rem;">(LVL ${currentLvl})</span>` : ''}</span>
        <span style="font-size:0.7rem;color:#94a3b8;text-align:center;margin:2px 0 4px;">${drone.desc}</span>
        <div style="display:flex;gap:6px;width:100%;justify-content:center;">
          <button class="skin-badge ${badgeClass}" style="flex:1;cursor:pointer;border:none;">${badgeText}</button>
          ${isUnlocked && !isMax ? `<button class="btn-upgrade-drone" style="flex:1;background:rgba(255,215,0,0.15);border:1px solid #ffd700;color:#ffd700;border-radius:6px;font-size:0.72rem;font-weight:800;padding:4px;cursor:pointer;">YÜKSELT (+${nextCost} CR)</button>` : ''}
        </div>
      `;

      // Kuşan / Satın Al
      const mainBtn = card.querySelector('.skin-badge');
      if (mainBtn) {
        mainBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          sounds.init();
          if (isUnlocked) {
            this.equippedDroneId = drone.id;
            localStorage.setItem('neon_equipped_drone', drone.id);
            sounds.playCardSelect();
            vibrate.light();
            this.renderHangarDrones();
          } else if (this.totalCrystals >= drone.cost) {
            this.totalCrystals -= drone.cost;
            localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
            this.droneLevels[drone.id] = 1;
            localStorage.setItem('neon_drone_levels', JSON.stringify(this.droneLevels));
            this.equippedDroneId = drone.id;
            localStorage.setItem('neon_equipped_drone', drone.id);
            sounds.playLevelUp();
            vibrate.success();
            this.updateCrystalsDisplay();
            this.renderHangarDrones();
          } else {
            vibrate.medium();
          }
        });
      }

      // Drone Seviye Yükseltme
      const upBtn = card.querySelector('.btn-upgrade-drone');
      if (upBtn) {
        upBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          sounds.init();
          if (this.totalCrystals >= nextCost && currentLvl < 5) {
            this.totalCrystals -= nextCost;
            localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
            this.droneLevels[drone.id] = currentLvl + 1;
            localStorage.setItem('neon_drone_levels', JSON.stringify(this.droneLevels));
            sounds.playLevelUp();
            vibrate.success();
            this.updateCrystalsDisplay();
            this.renderHangarDrones();
          } else {
            vibrate.medium();
          }
        });
      }

      dronesContainer.appendChild(card);
    });
  }

  renderHangarTrails() {
    if (!trailsContainer) return;
    trailsContainer.innerHTML = '';

    Object.values(this.trails).forEach(tr => {
      const isUnlocked = this.unlockedTrails.includes(tr.id);
      const isEquipped = this.equippedTrailId === tr.id;

      const card = document.createElement('div');
      card.className = `skin-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;

      let badgeText = isEquipped ? 'KUŞANILDI' : (isUnlocked ? 'KUŞAN' : `${tr.cost} CR`);
      let badgeClass = isEquipped ? 'equipped' : (isUnlocked ? 'unlocked' : 'locked');

      card.innerHTML = `
        <div class="skin-ship-art" style="display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);border-radius:10px;padding:8px;">
          <svg viewBox="0 0 32 32" width="46" height="46">
            <line x1="8" y1="28" x2="8" y2="4" stroke="${tr.color}" stroke-width="3" stroke-linecap="round"/>
            <line x1="24" y1="28" x2="24" y2="4" stroke="${tr.color}" stroke-width="3" stroke-linecap="round"/>
            <circle cx="8" cy="12" r="2.5" fill="#ffffff"/>
            <circle cx="24" cy="12" r="2.5" fill="#ffffff"/>
            <circle cx="16" cy="20" r="3.5" fill="${tr.color}" opacity="0.6"/>
          </svg>
        </div>
        <span class="skin-card-title">${tr.name}</span>
        <span style="font-size:0.7rem;color:#94a3b8;text-align:center;margin:2px 0 4px;">${tr.desc}</span>
        <span class="skin-badge ${badgeClass}">${badgeText}</span>
      `;

      card.addEventListener('click', () => {
        sounds.init();
        if (isUnlocked) {
          this.equippedTrailId = tr.id;
          localStorage.setItem('neon_equipped_trail', tr.id);
          sounds.playCardSelect();
          vibrate.light();
          this.renderHangarTrails();
        } else if (this.totalCrystals >= tr.cost) {
          this.totalCrystals -= tr.cost;
          localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
          this.unlockedTrails.push(tr.id);
          localStorage.setItem('neon_unlocked_trails', JSON.stringify(this.unlockedTrails));
          this.equippedTrailId = tr.id;
          localStorage.setItem('neon_equipped_trail', tr.id);
          sounds.playLevelUp();
          vibrate.success();
          this.updateCrystalsDisplay();
          this.renderHangarTrails();
        } else {
          vibrate.medium();
        }
      });

      trailsContainer.appendChild(card);
    });
  }

  getBoostersCatalog() {
    const revives = parseInt(localStorage.getItem('neon_bonus_revives') || '0', 10);
    const overdrive = parseInt(localStorage.getItem('neon_boost_overdrive') || '0', 10);
    const rerolls = parseInt(localStorage.getItem('neon_boost_rerolls') || '0', 10);
    const crystal = parseInt(localStorage.getItem('neon_boost_crystal') || '0', 10);
    const shield = parseInt(localStorage.getItem('neon_boost_shield') || '0', 10);

    return [
      {
        id: 'revive',
        name: 'ACİL DURUM DİRİLME',
        icon: '🛡️',
        desc: 'Gemi patladığında reklamsız anında dirilme hakkı depolar.',
        stock: revives,
        cost: 400,
        color: '#05ffa1',
        storageKey: 'neon_bonus_revives',
        amount: 1
      },
      {
        id: 'overdrive',
        name: 'OVERDRIVE REAKTÖRÜ',
        icon: '⚡',
        desc: 'Sonraki oyuna %50 hazır Süper Güç barıyla başlatır.',
        stock: overdrive,
        cost: 250,
        color: '#ffd700',
        storageKey: 'neon_boost_overdrive',
        amount: 1
      },
      {
        id: 'reroll',
        name: 'TAKTİKSEL ZAR PAKETİ',
        icon: '🎲',
        desc: 'Seviye atlama kartlarını +2 kez ekstra yenileme hakkı verir.',
        stock: rerolls,
        cost: 180,
        color: '#38bdf8',
        storageKey: 'neon_boost_rerolls',
        amount: 2
      },
      {
        id: 'crystal',
        name: 'KRİSTAL RADAR SİNYALİ',
        icon: '💎',
        desc: 'Sonraki oyunda toplanan tüm kristallere kalıcı +%50 bonus.',
        stock: crystal,
        cost: 320,
        color: '#bf5af2',
        storageKey: 'neon_boost_crystal',
        amount: 1
      },
      {
        id: 'shield',
        name: 'AĞIR KALKAN JENERATÖRÜ',
        icon: '🔰',
        desc: 'Oyuna +25 ekstra enerji kalkanı ile tam korumalı başlatır.',
        stock: shield,
        cost: 220,
        color: '#00f0ff',
        storageKey: 'neon_boost_shield',
        amount: 1
      }
    ];
  }

  renderHangarBoosters() {
    if (!boostersContainer) return;
    boostersContainer.innerHTML = '';

    const catalog = this.getBoostersCatalog();
    catalog.forEach(item => {
      const card = document.createElement('div');
      card.className = 'skin-card';
      const canAfford = this.totalCrystals >= item.cost;

      card.innerHTML = `
        <div class="skin-ship-art" style="display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);border-radius:10px;padding:8px;font-size:2.2rem;">
          ${item.icon}
        </div>
        <span class="skin-card-title">${item.name}</span>
        <span style="font-size:0.75rem;color:#ffd700;font-weight:bold;margin:2px 0;">STOK: ${item.stock} ADET</span>
        <span style="font-size:0.7rem;color:#94a3b8;text-align:center;margin:2px 0 6px;">${item.desc}</span>
        <button class="skin-badge ${canAfford ? 'unlocked' : 'locked'}" style="cursor:pointer;border:none;width:100%;font-weight:900;">
          ${item.cost} CR SATIN AL (+${item.amount})
        </button>
      `;

      const buyBtn = card.querySelector('.skin-badge');
      if (buyBtn) {
        buyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          sounds.init();
          if (this.totalCrystals >= item.cost) {
            this.totalCrystals -= item.cost;
            localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
            const newStock = item.stock + item.amount;
            localStorage.setItem(item.storageKey, newStock.toString());
            sounds.playJackpot();
            vibrate.success();
            this.showToast(`✓ ${item.name} Satın Alındı! (+${item.amount})`, item.color);
            this.updateCrystalsDisplay();
            this.renderHangarBoosters();
          } else {
            this.showToast(`⚠️ Yetersiz Kristal! (${item.cost} CR Gerekli)`, '#ff0055');
            vibrate.medium();
          }
        });
      }

      boostersContainer.appendChild(card);
    });
  }

  loadTechUpgrades() {
    try {
      const saved = localStorage.getItem('neon_tech_upgrades');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      critChance: 0,
      shieldMax: 0,
      hullMax: 0,
      magnet: 0,
      crystalBoost: 0,
      phoenix: 0,
      damageBoost: 0,
      dashCooldown: 0,
      rerollCount: 0
    };
  }

  saveTechUpgrades() {
    localStorage.setItem('neon_tech_upgrades', JSON.stringify(this.techUpgrades));
  }

  getTechCatalog() {
    return [
      {
        id: 'damageBoost',
        icon: 'energy',
        name: 'Plazma Rezonansı',
        desc: 'Tüm silahlara her seviyede kalıcı +%6 hasar artışı sağlar',
        maxLevel: 10,
        costs: [150, 350, 750, 1500, 2800, 4800, 8000, 12500, 19000, 29000],
        formatVal: (lvl) => `+%${lvl * 6} Hasar`
      },
      {
        id: 'shieldMax',
        icon: 'shield',
        name: 'Gövde Kalkanı',
        desc: 'Her seviyede +12 maksimum başlangıç kalkanı kazandırır',
        maxLevel: 10,
        costs: [130, 300, 650, 1350, 2500, 4200, 7000, 11000, 17000, 25000],
        formatVal: (lvl) => `+${lvl * 12} Kalkan`
      },
      {
        id: 'hullMax',
        icon: 'hull',
        name: 'Titanyum Zırh',
        desc: 'Gemi maksimum gövde canını her kademede +15 artırır',
        maxLevel: 10,
        costs: [120, 280, 600, 1200, 2200, 3800, 6400, 10000, 15500, 23000],
        formatVal: (lvl) => `+${lvl * 15} Can`
      },
      {
        id: 'critChance',
        icon: 'target',
        name: 'Kritik Odak',
        desc: 'Her seviyede +%2.5 kalıcı kritik vuruş şansı sağlar',
        maxLevel: 10,
        costs: [140, 320, 700, 1400, 2600, 4400, 7400, 11800, 18000, 27000],
        formatVal: (lvl) => `+%${(lvl * 2.5).toFixed(1)} Kritik`
      },
      {
        id: 'magnet',
        icon: 'magnet',
        name: 'Kristal Çekici',
        desc: 'Kristalleri ve ganimetleri çekme menzilini +18 artırır',
        maxLevel: 8,
        costs: [100, 250, 550, 1100, 2100, 3600, 6000, 9500],
        formatVal: (lvl) => `+${lvl * 18} Menzil`
      },
      {
        id: 'reactorCharge',
        icon: 'speed',
        name: 'Plazma Reaktörü',
        desc: 'Süper Güç (Overdrive) dolum hızını kalıcı %8 artırır',
        maxLevel: 6,
        costs: [180, 450, 1100, 2300, 4500, 8500],
        formatVal: (lvl) => `+%${lvl * 8} Şarj`
      },
      {
        id: 'crystalBoost',
        icon: 'crystal',
        name: 'Kristal Madenciliği',
        desc: 'Toplanan her kristalden kalıcı %8 daha fazla kaynak sağlar',
        maxLevel: 8,
        costs: [200, 500, 1200, 2400, 4500, 7800, 12800, 20000],
        formatVal: (lvl) => `+%${lvl * 8} Kristal`
      },
      {
        id: 'rerollCount',
        icon: 'dice',
        name: 'Taktiksel Analiz',
        desc: 'Her oyunda seviye atlama kartlarını +1 yenileme hakkı verir',
        maxLevel: 4,
        costs: [350, 950, 2400, 5800],
        formatVal: (lvl) => `${lvl} Reroll`
      },
      {
        id: 'phoenix',
        icon: 'fire',
        name: 'Anka Protokolü',
        desc: 'Ölümcül hasarda dev süpernova şok dalgasıyla dirilme sağlar',
        maxLevel: 3,
        costs: [1500, 4500, 11000],
        formatVal: (lvl) => lvl >= 1 ? `Kademe ${lvl}` : 'Kilitli'
      }
    ];
  }

  resetTechUpgrades() {
    const catalog = this.getTechCatalog();
    let refundAmount = 0;
    let upgradedCount = 0;

    catalog.forEach(item => {
      const lvl = this.techUpgrades[item.id] || 0;
      if (lvl > 0) {
        upgradedCount += lvl;
        for (let i = 0; i < lvl; i++) {
          refundAmount += item.costs[i] || 0;
        }
        this.techUpgrades[item.id] = 0;
      }
    });

    if (refundAmount === 0 && upgradedCount === 0) {
      if (typeof vibrate !== 'undefined' && vibrate.light) vibrate.light();
      return;
    }

    this.totalCrystals += refundAmount;
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    this.saveTechUpgrades();

    if (sounds.playJackpot) sounds.playJackpot();
    else if (sounds.playLevelUp) sounds.playLevelUp();
    if (typeof vibrate !== 'undefined' && vibrate.success) vibrate.success();

    this.updateCrystalsDisplay();
    this.renderTechUpgrades();
  }

  renderTechUpgrades() {
    if (!techContainer) return;
    techContainer.innerHTML = '';

    const catalog = this.getTechCatalog();
    catalog.forEach(item => {
      const currentLvl = this.techUpgrades[item.id] || 0;
      const isMaxed = currentLvl >= item.maxLevel;
      const nextCost = isMaxed ? 0 : item.costs[currentLvl];
      const canAfford = this.totalCrystals >= nextCost && !isMaxed;

      const card = document.createElement('div');
      card.className = `tech-card ${isMaxed ? 'maxed' : ''}`;

      const levelPillText = isMaxed ? 'MAKS SEVİYE' : `${currentLvl} / ${item.maxLevel}`;
      let actionBtnHtml = '';

      if (isMaxed) {
        actionBtnHtml = `<button class="tech-buy-btn" disabled>TAMAMLANDI</button>`;
      } else if (canAfford) {
        actionBtnHtml = `<button class="tech-buy-btn">${nextCost} CR GELİŞTİR</button>`;
      } else {
        const missing = nextCost - this.totalCrystals;
        actionBtnHtml = `<button class="tech-ad-boost-btn pulse" title="Reklam İzle ve +125 Kristal Kazan">🎬 EKSİK: ${missing} CR (+125 AL)</button>`;
      }

      card.innerHTML = `
        <div class="tech-icon">${getPixelIconSvg(item.icon, 'md')}</div>
        <div class="tech-info">
          <div class="tech-title-row">
            <span class="tech-name">${item.name}</span>
            <span class="tech-level-pill">${levelPillText}</span>
          </div>
          <div class="tech-desc">${item.desc} (${item.formatVal(currentLvl)})</div>
        </div>
        ${actionBtnHtml}
      `;

      if (canAfford) {
        const buyBtn = card.querySelector('.tech-buy-btn');
        if (buyBtn) {
          buyBtn.addEventListener('click', () => {
            sounds.init();
            this.totalCrystals -= nextCost;
            this.techUpgrades[item.id] = (this.techUpgrades[item.id] || 0) + 1;
            localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
            this.saveTechUpgrades();
            sounds.playLevelUp();
            vibrate.success();
            this.updateCrystalsDisplay();
            this.renderTechUpgrades();
          });
        }
      } else if (!isMaxed) {
        const adBtn = card.querySelector('.tech-ad-boost-btn');
        if (adBtn) {
          adBtn.addEventListener('click', () => {
            sounds.init();
            sounds.playCardSelect();
            if (window.showRewardedAd) {
              adBtn.disabled = true;
              adBtn.textContent = '🎬 REKLAM...';
              window.showRewardedAd(
                () => {
                  this.addGoldReward(125, true);
                  this.renderTechUpgrades();
                  this.showToast('✨ +125 Kristal Yüklendi! Şimdi geliştirebilirsin!', '#05ffa1');
                },
                () => {
                  this.renderTechUpgrades();
                  this.showToast('⚠️ Reklam tamamlanmadığı için ödül verilemedi.', '#ff0055');
                }
              );
            }
          });
        }
      }

      techContainer.appendChild(card);
    });
  }

  initSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    const btnSettingsMenu = document.getElementById('btn-settings-menu');
    const btnPauseSettings = document.getElementById('btn-pause-settings');
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnSettingsCloseX = document.getElementById('btn-settings-close-x');
    const btnSettingsPrivacy = document.getElementById('btn-settings-privacy');
    const btnToggleSoundSettings = document.getElementById('btn-toggle-sound-settings');
    const btnToggleVibrateSettings = document.getElementById('btn-toggle-vibrate-settings');
    const languageGrid = document.getElementById('language-grid');

    const updateSettingsToggles = () => {
      if (btnToggleSoundSettings) {
        const isMuted = sounds.muted;
        btnToggleSoundSettings.textContent = isMuted ? t('settings_off') : t('settings_on');
        btnToggleSoundSettings.classList.toggle('off', isMuted);
      }
      if (btnToggleVibrateSettings) {
        const isEnabled = vibrate.enabled;
        btnToggleVibrateSettings.textContent = isEnabled ? t('settings_on') : t('settings_off');
        btnToggleVibrateSettings.classList.toggle('off', !isEnabled);
      }
    };
    this.updateSettingsToggles = updateSettingsToggles;

    const renderLanguageGrid = () => {
      if (!languageGrid) return;
      languageGrid.innerHTML = '';
      const current = getCurrentLanguage();
      SUPPORTED_LANGUAGES.forEach(lang => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `lang-btn ${lang.code === current ? 'active' : ''}`;
        btn.innerHTML = `
          <span class="lang-flag">${lang.flag}</span>
          <div class="lang-name-col">
            <span class="lang-name">${lang.name}</span>
            <span class="lang-short">${lang.short}</span>
          </div>
        `;
        btn.addEventListener('click', () => {
          sounds.playCardSelect();
          setLanguage(lang.code);
          renderLanguageGrid();
          updateSettingsToggles();
          this.updateMenuShipPreview();
          this.showToast(t('toast_copied'), '#00f0ff');
        });
        languageGrid.appendChild(btn);
      });
    };
    this.renderLanguageGrid = renderLanguageGrid;

    const openSettings = () => {
      if (settingsModal) {
        renderLanguageGrid();
        updateSettingsToggles();
        try { history.pushState({ modal: 'settings' }, ''); } catch(e) {}
        settingsModal.classList.remove('hidden');
      }
    };

    const closeSettings = () => {
      if (settingsModal) {
        settingsModal.classList.add('hidden');
      }
    };

    if (btnSettingsMenu) btnSettingsMenu.addEventListener('click', () => { sounds.playCardSelect(); openSettings(); });
    if (btnPauseSettings) btnPauseSettings.addEventListener('click', () => { sounds.playCardSelect(); openSettings(); });
    if (btnCloseSettings) btnCloseSettings.addEventListener('click', () => { sounds.playCardSelect(); closeSettings(); });
    if (btnSettingsCloseX) btnSettingsCloseX.addEventListener('click', () => { sounds.playCardSelect(); closeSettings(); });
    
    if (btnSettingsPrivacy) {
      btnSettingsPrivacy.addEventListener('click', () => {
        const priv = document.getElementById('privacy-modal');
        if (priv) priv.classList.remove('hidden');
      });
    }

    // Cloud Save (Bulut Yedek Kodu Al & Yükle)
    const btnExportSave = document.getElementById('btn-export-save');
    const btnImportSave = document.getElementById('btn-import-save');
    const btnSettingsGdpr = document.getElementById('btn-settings-gdpr');
    const saveCodeModal = document.getElementById('save-code-modal');
    const saveCodeTitle = document.getElementById('save-code-modal-title');
    const saveCodeDesc = document.getElementById('save-code-modal-desc');
    const saveCodeTextarea = document.getElementById('save-code-textarea');
    const btnSaveCodeClose = document.getElementById('btn-save-code-close');
    const btnSaveCodeAction = document.getElementById('btn-save-code-action');

    let saveCodeMode = 'export';

    if (btnExportSave) {
      btnExportSave.addEventListener('click', () => {
        sounds.playCardSelect();
        saveCodeMode = 'export';
        if (saveCodeTitle) saveCodeTitle.textContent = 'YEDEK KODU AL (EXPORT)';
        if (saveCodeDesc) saveCodeDesc.textContent = 'Bu kod tüm altınlarınızı, gemilerinizi ve açık bölümlerinizi içerir. Kodu kopyalayıp güvenli bir yere kaydedin:';
        if (saveCodeTextarea) {
          saveCodeTextarea.value = this.getExportSaveString();
          saveCodeTextarea.readOnly = true;
        }
        if (btnSaveCodeAction) btnSaveCodeAction.textContent = '📋 KOPYALA';
        if (saveCodeModal) saveCodeModal.classList.remove('hidden');
      });
    }

    if (btnImportSave) {
      btnImportSave.addEventListener('click', () => {
        sounds.playCardSelect();
        saveCodeMode = 'import';
        if (saveCodeTitle) saveCodeTitle.textContent = 'YEDEK KODU YÜKLE (IMPORT)';
        if (saveCodeDesc) saveCodeDesc.textContent = 'Daha önce aldığınız yedek kodunu (NEON-SAVE-...) aşağıdaki alana yapıştırıp YÜKLE butonuna basın:';
        if (saveCodeTextarea) {
          saveCodeTextarea.value = '';
          saveCodeTextarea.placeholder = 'NEON-SAVE-...-END kodunu buraya yapıştırın...';
          saveCodeTextarea.readOnly = false;
        }
        if (btnSaveCodeAction) btnSaveCodeAction.textContent = '📥 YÜKLE';
        if (saveCodeModal) saveCodeModal.classList.remove('hidden');
      });
    }

    if (btnSaveCodeClose && saveCodeModal) {
      btnSaveCodeClose.addEventListener('click', () => {
        sounds.playCardSelect();
        saveCodeModal.classList.add('hidden');
      });
    }

    if (btnSaveCodeAction) {
      btnSaveCodeAction.addEventListener('click', async () => {
        sounds.playCardSelect();
        if (saveCodeMode === 'export') {
          const val = saveCodeTextarea ? saveCodeTextarea.value : '';
          try {
            await navigator.clipboard.writeText(val);
            this.showToast(t('save_exported_toast') || '✓ Yedek kodu panoya kopyalandı!', '#00f0ff');
          } catch(e) {
            this.showToast('✓ Metni manuel kopyalayabilirsiniz', '#00f0ff');
          }
        } else {
          const val = saveCodeTextarea ? saveCodeTextarea.value.trim() : '';
          const success = this.applyImportSaveString(val);
          if (success) {
            this.showToast(t('save_imported_toast') || '✓ İlerleme başarıyla geri yüklendi!', '#05ffa1');
            if (saveCodeModal) saveCodeModal.classList.add('hidden');
            if (settingsModal) settingsModal.classList.add('hidden');
          } else {
            this.showToast(t('save_invalid_toast') || '❌ Geçersiz yedekleme kodu!', '#ff0055');
          }
        }
      });
    }

    if (btnSettingsGdpr) {
      btnSettingsGdpr.addEventListener('click', () => {
        sounds.playCardSelect();
        if (window.showPrivacyOptionsForm) {
          window.showPrivacyOptionsForm();
        } else {
          const priv = document.getElementById('privacy-modal');
          if (priv) priv.classList.remove('hidden');
        }
      });
    }

    if (btnToggleSoundSettings) {
      btnToggleSoundSettings.addEventListener('click', () => {
        sounds.toggleMute();
        updateSettingsToggles();
      });
    }

    if (btnToggleVibrateSettings) {
      btnToggleVibrateSettings.addEventListener('click', () => {
        vibrate.toggle();
        updateSettingsToggles();
      });
    }

    updateSettingsToggles();
  }

  getExportSaveString() {
    const data = {
      v: 1,
      cr: parseInt(localStorage.getItem('neon_total_crystals') || '0', 10),
      lvl: parseInt(localStorage.getItem('neon_unlocked_level') || '1', 10),
      stars: localStorage.getItem('neon_level_stars') || '{}',
      cSc: parseInt(localStorage.getItem('neon_high_score_classic') || '0', 10),
      sSc: parseInt(localStorage.getItem('neon_high_score_storm') || '0', 10),
      skin: localStorage.getItem('neon_current_skin') || 'cyber',
      uSkins: localStorage.getItem('neon_unlocked_skins') || '["cyber"]',
      uTrails: localStorage.getItem('neon_unlocked_trails') || '["default"]',
      trail: localStorage.getItem('neon_equipped_trail') || 'default',
      drones: localStorage.getItem('neon_drones_data') || '{}',
      tech: localStorage.getItem('neon_tech_upgrades') || '{}',
      tree: localStorage.getItem('neon_mastery_tree') || '{}',
      trophies: localStorage.getItem('neon_trophies') || '{}',
      callsign: localStorage.getItem('neon_player_callsign') || 'PILOT_ALPHA',
      country: localStorage.getItem('neon_player_country') || 'TUR',
      stats: localStorage.getItem('neon_pilot_stats') || '{}'
    };
    try {
      const json = JSON.stringify(data);
      const b64 = btoa(unescape(encodeURIComponent(json)));
      return `NEON-SAVE-${b64}-END`;
    } catch(e) {
      return `NEON-SAVE-${btoa(JSON.stringify(data))}-END`;
    }
  }

  applyImportSaveString(str) {
    if (!str || !str.startsWith('NEON-SAVE-') || !str.endsWith('-END')) {
      return false;
    }
    try {
      const b64 = str.replace('NEON-SAVE-', '').replace('-END', '').trim();
      let json = '';
      try {
        json = decodeURIComponent(escape(atob(b64)));
      } catch(e) {
        json = atob(b64);
      }
      const data = JSON.parse(json);

      if (data.cr !== undefined) localStorage.setItem('neon_total_crystals', data.cr.toString());
      if (data.lvl !== undefined) localStorage.setItem('neon_unlocked_level', data.lvl.toString());
      if (data.stars) localStorage.setItem('neon_level_stars', typeof data.stars === 'string' ? data.stars : JSON.stringify(data.stars));
      if (data.cSc !== undefined) localStorage.setItem('neon_high_score_classic', data.cSc.toString());
      if (data.sSc !== undefined) localStorage.setItem('neon_high_score_storm', data.sSc.toString());
      if (data.skin) localStorage.setItem('neon_current_skin', data.skin);
      if (data.uSkins) localStorage.setItem('neon_unlocked_skins', typeof data.uSkins === 'string' ? data.uSkins : JSON.stringify(data.uSkins));
      if (data.uTrails) localStorage.setItem('neon_unlocked_trails', typeof data.uTrails === 'string' ? data.uTrails : JSON.stringify(data.uTrails));
      if (data.trail) localStorage.setItem('neon_equipped_trail', data.trail);
      if (data.drones) localStorage.setItem('neon_drones_data', typeof data.drones === 'string' ? data.drones : JSON.stringify(data.drones));
      if (data.tech) localStorage.setItem('neon_tech_upgrades', typeof data.tech === 'string' ? data.tech : JSON.stringify(data.tech));
      if (data.tree) localStorage.setItem('neon_mastery_tree', typeof data.tree === 'string' ? data.tree : JSON.stringify(data.tree));
      if (data.trophies) localStorage.setItem('neon_trophies', typeof data.trophies === 'string' ? data.trophies : JSON.stringify(data.trophies));
      if (data.callsign) localStorage.setItem('neon_player_callsign', data.callsign);
      if (data.country) localStorage.setItem('neon_player_country', data.country);
      if (data.stats) localStorage.setItem('neon_pilot_stats', typeof data.stats === 'string' ? data.stats : JSON.stringify(data.stats));

      this.totalCrystals = parseInt(localStorage.getItem('neon_total_crystals') || '0', 10);
      this.unlockedLevel = parseInt(localStorage.getItem('neon_unlocked_level') || '1', 10);
      try { this.levelStars = JSON.parse(localStorage.getItem('neon_level_stars') || '{}'); } catch(e) {}
      this.currentSkinId = localStorage.getItem('neon_current_skin') || 'cyber';
      this.updateCrystalsDisplay();
      if (this.renderHangarSkins) this.renderHangarSkins();
      if (this.renderHangarTrails) this.renderHangarTrails();
      if (this.renderHangarDrones) this.renderHangarDrones();
      if (this.renderLeaderboard) this.renderLeaderboard(this.lbMode || 'storm');

      return true;
    } catch (e) {
      console.error('Import parse error:', e);
      return false;
    }
  }

  dismissTutorial() {
    const tut = document.getElementById('tutorial-overlay');
    if (tut && !tut.classList.contains('hidden')) {
      tut.style.opacity = '0';
      tut.style.transform = 'translate(-50%, -50%) scale(0.9)';
      setTimeout(() => tut.classList.add('hidden'), 400);
      localStorage.setItem('neon_tutorial_seen', 'true');
    }
  }

  showTutorialIfNeeded() {
    if (localStorage.getItem('neon_tutorial_seen') === 'true') return;
    const tut = document.getElementById('tutorial-overlay');
    if (tut) {
      tut.style.opacity = '1';
      tut.style.transform = 'translate(-50%, -50%) scale(1)';
      tut.classList.remove('hidden');
      setTimeout(() => this.dismissTutorial(), 4500);
    }
  }

  onLanguageChanged(newLang) {
    this.updateMenuShipPreview();
    if (this.updatePilotRankDisplay) this.updatePilotRankDisplay();
    if (this.renderLanguageGrid) this.renderLanguageGrid();
    if (this.updateSettingsToggles) this.updateSettingsToggles();
    const pauseSoundText = document.getElementById('pause-sound-text');
    if (pauseSoundText) {
      pauseSoundText.textContent = sounds.muted ? t('pause_sound_off') : t('pause_sound_on');
    }
    const pauseVibrateText = document.getElementById('pause-vibrate-text');
    if (pauseVibrateText) {
      pauseVibrateText.textContent = vibrate.enabled ? t('pause_vibrate_on') : t('pause_vibrate_off');
    }
  }

  initMissions() {
    const today = new Date().toISOString().slice(0, 10);
    const savedDate = localStorage.getItem('neon_missions_date');
    const savedMissions = localStorage.getItem('neon_daily_missions');

    if (savedDate === today && savedMissions) {
      try {
        this.dailyMissions = JSON.parse(savedMissions);
      } catch (e) {
        this.dailyMissions = null;
      }
    }

    if (!this.dailyMissions || this.dailyMissions.length === 0) {
      const pool = [
        { id: 'kill_asteroids', icon: 'target', name: 'Asteroit Avcısı', desc: '35 adet meteor yok et', goal: 35, progress: 0, reward: 80, claimed: false },
        { id: 'collect_crystals', icon: 'crystal', name: 'Kristal Madencisi', desc: '100 kristal topla', goal: 100, progress: 0, reward: 90, claimed: false },
        { id: 'survive_time', icon: 'speed', name: 'Hayatta Kalan', desc: 'Tek oyunda 75 saniye dayan', goal: 75, progress: 0, reward: 100, claimed: false },
        { id: 'reach_combo', icon: 'energy', name: 'Kombo Ustası', desc: '10x veya üzeri kombo yap', goal: 10, progress: 0, reward: 75, claimed: false },
        { id: 'defeat_boss', icon: 'skull', name: 'Amiral Avcısı', desc: '1 Amiral Boss yok et', goal: 1, progress: 0, reward: 150, claimed: false },
        { id: 'detonate_bomb', icon: 'bomb', name: 'Patlayıcı Uzmanı', desc: '6 bomba asteroid patlat', goal: 6, progress: 0, reward: 85, claimed: false }
      ];

      this.dailyMissions = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
      localStorage.setItem('neon_daily_missions', JSON.stringify(this.dailyMissions));
      localStorage.setItem('neon_missions_date', today);
    }

    this.checkMissionsBadge();
  }

  updateMissionProgress(type, amount, isAbsolute = false) {
    if (!this.dailyMissions) return;
    let changed = false;

    for (let m of this.dailyMissions) {
      if (m.id === type && !m.claimed) {
        if (isAbsolute) {
          if (amount > m.progress) {
            m.progress = Math.min(m.goal, amount);
            changed = true;
          }
        } else {
          if (m.progress < m.goal) {
            m.progress = Math.min(m.goal, m.progress + amount);
            changed = true;
          }
        }
      }
    }

    if (changed) {
      localStorage.setItem('neon_daily_missions', JSON.stringify(this.dailyMissions));
      this.checkMissionsBadge();
    }
  }

  checkMissionsBadge() {
    if (!missionsBadgeDot || !this.dailyMissions) return;
    const hasUnclaimed = this.dailyMissions.some(m => m.progress >= m.goal && !m.claimed);
    if (hasUnclaimed) {
      missionsBadgeDot.classList.remove('hidden');
    } else {
      missionsBadgeDot.classList.add('hidden');
    }
  }

  openMissions() {
    try { history.pushState({ modal: 'missions' }, ''); } catch(e) {}
    this.renderMissions();
    if (missionsModal) missionsModal.classList.remove('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(2);
  }

  closeMissions() {
    if (missionsModal) missionsModal.classList.add('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(1);
  }

  renderMissions() {
    if (!missionsContainer || !this.dailyMissions) return;
    missionsContainer.innerHTML = '';

    this.dailyMissions.forEach(m => {
      const isCompleted = m.progress >= m.goal;
      const percent = Math.min(100, Math.round((m.progress / m.goal) * 100));

      const item = document.createElement('div');
      item.className = `mission-item ${isCompleted ? 'completed' : ''}`;

      let btnHtml = '';
      if (m.claimed) {
        btnHtml = `<button class="btn-mission-claim" disabled>ALINDI ✓</button>`;
      } else if (isCompleted) {
        btnHtml = `<button class="btn-mission-claim">AL (+${m.reward} CR)</button>`;
      } else {
        btnHtml = `<button class="btn-mission-claim" disabled>${m.progress}/${m.goal}</button>`;
      }

      const iconKey = (m.icon === '🪨' || m.icon === '??' || !m.icon) ? 'target' : (m.icon === '⏱️' ? 'speed' : m.icon);
      const iconSvg = getPixelIconSvg(iconKey, 'md') || getPixelIconSvg('target', 'md');

      item.innerHTML = `
        <div class="mission-top">
          <div class="mission-title-group">
            <span class="mission-icon">${iconSvg}</span>
            <div>
              <div class="mission-name">${m.name}</div>
              <div class="mission-desc">${m.desc}</div>
            </div>
          </div>
          <span class="mission-reward">${getPixelIconSvg('crystal', 'sm')} ${m.reward}</span>
        </div>
        <div class="mission-bottom">
          <div class="mission-progress-track">
            <div class="mission-progress-fill" style="width: ${percent}%;"></div>
          </div>
          <span class="mission-progress-text">%${percent}</span>
          ${btnHtml}
        </div>
      `;

      if (isCompleted && !m.claimed) {
        const claimBtn = item.querySelector('.btn-mission-claim');
        if (claimBtn) {
          claimBtn.addEventListener('click', () => {
            sounds.init();
            m.claimed = true;
            this.totalCrystals += m.reward;
            localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
            localStorage.setItem('neon_daily_missions', JSON.stringify(this.dailyMissions));
            sounds.playLevelUp();
            vibrate.success();
            this.updateCrystalsDisplay();
            this.checkMissionsBadge();
            this.renderMissions();
          });
        }
      }

      missionsContainer.appendChild(item);
    });
  }

  loadPilotStats() {
    try {
      const saved = localStorage.getItem('neon_pilot_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          totalFlights: parsed.totalFlights || 0,
          totalKills: parsed.totalKills || 0,
          asteroidsDestroyed: parsed.asteroidsDestroyed || 0,
          bombAsteroidsDestroyed: parsed.bombAsteroidsDestroyed || 0,
          bossesDefeated: parsed.bossesDefeated || 0,
          maxCombo: parsed.maxCombo || 0,
          maxTime: parsed.maxTime || 0,
          lifetimeCrystals: parsed.lifetimeCrystals || 0,
          totalGraze: parsed.totalGraze || 0,
          totalChests: parsed.totalChests || 0,
          totalEvolutions: parsed.totalEvolutions || 0,
          levelsCompleted: parsed.levelsCompleted || 0
        };
      }
    } catch (e) {}
    return {
      totalFlights: 0,
      totalKills: 0,
      asteroidsDestroyed: 0,
      bombAsteroidsDestroyed: 0,
      bossesDefeated: 0,
      maxCombo: 0,
      maxTime: 0,
      lifetimeCrystals: 0,
      totalGraze: 0,
      totalChests: 0,
      totalEvolutions: 0,
      levelsCompleted: 0
    };
  }

  savePilotStats() {
    if (this.pilotStats) {
      localStorage.setItem('neon_pilot_stats', JSON.stringify(this.pilotStats));
    }
  }

  openStats() {
    try { history.pushState({ modal: 'stats' }, ''); } catch(e) {}
    if (!this.pilotStats) this.pilotStats = this.loadPilotStats();
    if (statFlights) statFlights.textContent = this.pilotStats.totalFlights.toLocaleString();
    if (statAsteroids) statAsteroids.textContent = this.pilotStats.asteroidsDestroyed.toLocaleString();
    if (statBosses) statBosses.textContent = this.pilotStats.bossesDefeated.toLocaleString();
    if (statCombo) statCombo.textContent = `${this.pilotStats.maxCombo}x`;
    const m = Math.floor(this.pilotStats.maxTime / 60).toString().padStart(2, '0');
    const s = (this.pilotStats.maxTime % 60).toString().padStart(2, '0');
    if (statTime) statTime.textContent = `${m}:${s}`;
    if (statCrystals) statCrystals.textContent = this.pilotStats.lifetimeCrystals.toLocaleString();
    if (statsModal) statsModal.classList.remove('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(4);
  }

  closeStats() {
    if (statsModal) statsModal.classList.add('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(1);
  }

  setMode(mode) {
    this.currentMode = mode;
    if (mode === 'classic') {
      if (modeClassic) modeClassic.classList.add('active');
      if (modeStorm) modeStorm.classList.remove('active');
    } else {
      if (modeClassic) modeClassic.classList.remove('active');
      if (modeStorm) modeStorm.classList.add('active');
    }
    this.updateHighScoreDisplay();
    this.updateLevelDisplay();
  }

  updateHighScoreDisplay() {
    const stormHigh = this.highScores.storm || 0;
    if (scoreValStorm) scoreValStorm.textContent = stormHigh.toLocaleString();
    this.updateLevelDisplay();
  }

  // === 38 SEVİYELİ SEFER (CAMPAIGN) SİSTEMİ ===
  getLevelConfig(lvl) {
    lvl = Math.max(1, Math.min(38, lvl || 1));
    // Sektör Dağılımı:
    // 1 - 9: void (Siber Neon Boşluğu)
    // 10 - 19: magma (Kızıl Magma Nebulası)
    // 20 - 28: toxic (Zümrüt Asit Divriği)
    // 29 - 38: quantum (Kuantum Uçurumu)
    let sector = 'void';
    let sectorName = 'SİBER NEON BOŞLUĞU';
    if (lvl >= 29) {
      sector = 'quantum';
      sectorName = 'KUANTUM UÇURUMU';
    } else if (lvl >= 20) {
      sector = 'toxic';
      sectorName = 'ZÜMRÜT ASİT DİVRİĞİ';
    } else if (lvl >= 10) {
      sector = 'magma';
      sectorName = 'KIZIL MAGMA NEBULASI';
    }

    // Boss Seçimi (Dinamik ve Kademeli)
    let bossType = 'boss_vanguard';
    if (lvl === 1) {
      bossType = 'boss_vanguard'; // Seviye 1: Öncü Korsan Komutanı
    } else if (lvl < 10) {
      bossType = (lvl % 3 === 0 || lvl === 9) ? 'boss_dreadnought' : 'boss_vanguard';
    } else if (lvl < 20) {
      bossType = (lvl % 4 === 0 || lvl === 19) ? 'boss_nebula' : 'boss_dreadnought';
    } else if (lvl < 29) {
      bossType = (lvl % 4 === 0 || lvl === 28) ? 'boss_titan' : 'boss_nebula';
    } else if (lvl < 38) {
      bossType = (lvl % 3 === 0) ? 'boss_chrono' : 'boss_titan';
    } else {
      bossType = 'boss_apex'; // Seviye 38: Büyük Zirve Amiral Boss'u
    }

    // Seviye Süresi (Saniye):
    // Seviye 1: 60 sn
    // Seviye 2-9: 60 + (lvl - 1) * 3 sn (63s - 84s)
    // Seviye 10-19: 85 + (lvl - 10) * 3 sn (85s - 112s)
    // Seviye 20-28: 110 + (lvl - 20) * 4 sn (110s - 142s)
    // Seviye 29-38: 140 + (lvl - 29) * 4 sn (140s - 176s)
    let targetDuration = 60;
    if (lvl <= 9) {
      targetDuration = 60 + (lvl - 1) * 3;
    } else if (lvl <= 19) {
      targetDuration = 85 + (lvl - 10) * 3;
    } else if (lvl <= 28) {
      targetDuration = 110 + (lvl - 20) * 4;
    } else {
      targetDuration = 140 + (lvl - 29) * 4;
    }

    // ROGUELITE ZORLUK VE KADEMELİ EKONOMİ EĞRİSİ:
    // Kullanıcı İsteği: İlk seviyeler için 5-10 deneme/oynama zorunluluğu,
    // İlerleyen seviyelerde (10, 20, 30+) ise 30, 40, 50, 60 kere oynayıp Atölye'den
    // güçlü geliştirmeleri biriktirerek alma zorunluluğu!
    let hpMult = 1.0;
    let speedMult = 1.0;
    let enemyDmgMult = 1.0;

    if (lvl === 1) {
      // Seviye 1: Sıfır eklentili gemi için zorlayıcı! Düşmanlar 1.45x cana sahip.
      // Oyuncu 35-50. saniyelerde veya Boss'ta zorlanıp düşer, run başına ~20-30 kristal kazanır.
      // 5-8 el oynayıp 120-250 kristal biriktirip Atölye'den Plazma Rezonansı & Kalkan alınca Seviye 1'i geçer!
      hpMult = 1.45;
      speedMult = 1.0;
      enemyDmgMult = 1.15;
    } else if (lvl <= 5) {
      // Seviye 2 - 5: 8-12 el oynama gerektirir
      hpMult = 1.45 + (lvl - 1) * 0.35;
      speedMult = 1.0 + (lvl - 1) * 0.02;
      enemyDmgMult = 1.15 + (lvl - 1) * 0.05;
    } else if (lvl <= 15) {
      // Seviye 6 - 15: 18-28 el oynama gerektirir (Magma Nebulası)
      hpMult = 2.85 + (lvl - 5) * 0.45;
      speedMult = 1.10 + (lvl - 5) * 0.02;
      enemyDmgMult = 1.35 + (lvl - 5) * 0.05;
    } else if (lvl <= 28) {
      // Seviye 16 - 28: 30-45 el oynama gerektirir (Zümrüt Asit Divriği)
      hpMult = 7.35 + (lvl - 15) * 0.65;
      speedMult = 1.30 + (lvl - 15) * 0.02;
      enemyDmgMult = 1.85 + (lvl - 15) * 0.06;
    } else {
      // Seviye 29 - 38: 50-65 el oynama gerektirir (Kuantum Uçurumu & Apex)
      hpMult = 15.8 + (lvl - 28) * 0.95;
      speedMult = 1.55;
      enemyDmgMult = 2.65 + (lvl - 28) * 0.08;
    }

    const reward = 180 + lvl * 30;

    return {
      level: lvl,
      sector,
      sectorName,
      bossType,
      targetDuration,
      hpMult,
      speedMult,
      enemyDmgMult,
      reward
    };
  }

  renderLevelSelectGrid() {
    if (!levelGridContainer) return;
    levelGridContainer.innerHTML = '';

    for (let lvl = 1; lvl <= 38; lvl++) {
      const cfg = this.getLevelConfig(lvl);
      const isUnlocked = lvl <= this.unlockedLevel;
      const isSelected = lvl === this.selectedLevel;
      const stars = this.levelStars[lvl] || 0;
      const isCompleted = stars > 0;

      const cell = document.createElement('div');
      cell.className = 'level-cell' + (isSelected ? ' current' : '') + (isCompleted ? ' completed' : '') + (!isUnlocked ? ' locked' : '');

      let starsHtml = '';
      if (isUnlocked) {
        if (stars > 0) {
          starsHtml = `
            <div class="level-cell-stars">
              <svg class="pixel-icon pixel-icon-xs" viewBox="0 0 10 10"><polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="${stars >= 1 ? '#ffbe0b' : '#334155'}"/></svg>
              <svg class="pixel-icon pixel-icon-xs" viewBox="0 0 10 10"><polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="${stars >= 2 ? '#ffbe0b' : '#334155'}"/></svg>
              <svg class="pixel-icon pixel-icon-xs" viewBox="0 0 10 10"><polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="${stars >= 3 ? '#ffbe0b' : '#334155'}"/></svg>
            </div>`;
        } else {
          starsHtml = `<div class="level-cell-sector">${cfg.sector.toUpperCase()}</div>`;
        }
      } else {
        starsHtml = `
          <div class="level-cell-lock">
            <svg class="pixel-icon pixel-icon-xs" viewBox="0 0 12 12"><path d="M3 4h6v2H3zM2 6h8v5H2z" fill="#94a3b8"/><rect x="5" y="7" width="2" height="2" fill="#334155"/></svg>
          </div>`;
      }

      cell.innerHTML = `
        <div class="level-cell-num">${lvl}</div>
        ${starsHtml}
      `;

      cell.addEventListener('click', () => {
        sounds.init();
        if (!isUnlocked) {
          sounds.playLaser();
          vibrate.light();
          cell.style.transform = 'translateX(-3px)';
          setTimeout(() => cell.style.transform = 'translateX(3px)', 60);
          setTimeout(() => cell.style.transform = 'none', 120);
          return;
        }

        sounds.playCardSelect();
        vibrate.light();
        this.selectedLevel = lvl;
        localStorage.setItem('neon_selected_level', lvl.toString());
        this.updateLevelDisplay();
        this.closeLevelSelect();
      });

      levelGridContainer.appendChild(cell);
    }
  }

  openLevelSelect() {
    try { history.pushState({ modal: 'level_select' }, ''); } catch(e) {}
    sounds.init();
    sounds.playCardSelect();
    this.renderLevelSelectGrid();
    if (levelSelectModal) levelSelectModal.classList.remove('hidden');
  }

  closeLevelSelect() {
    if (levelSelectModal) levelSelectModal.classList.add('hidden');
  }

  updateLevelDisplay() {
    const lvl = this.selectedLevel || 1;
    if (scoreValClassic) scoreValClassic.textContent = `BÖLÜM ${lvl}`;
    if (modeStageDesc) modeStageDesc.textContent = `Bölüm ${lvl} • Seviye Seç ▾`;
    if (levelDisplayCard) levelDisplayCard.textContent = `BÖLÜM ${lvl}`;
    if (levelHudDisplay) levelHudDisplay.textContent = `B.${lvl}`;
  }

  triggerLevelVictory() {
    sounds.playJackpot();
    sounds.playLevelUp();
    sounds.playWarpDrive();
    vibrate.success();

    const lvlCfg = this.getLevelConfig(this.selectedLevel);

    // Yıldız Hesabı (Kalan Can Yüzdesine Göre)
    const hpPct = Math.max(0, this.player.hp / this.player.maxHp);
    let stars = 1;
    if (hpPct >= 0.70) {
      stars = 3;
    } else if (hpPct >= 0.35) {
      stars = 2;
    }

    const prevStars = this.levelStars[this.selectedLevel] || 0;
    const isFirstClear = !prevStars;
    this.levelStars[this.selectedLevel] = Math.max(prevStars, stars);
    localStorage.setItem('neon_level_stars', JSON.stringify(this.levelStars));

    // Kristal Ganimeti
    const rewardCrystals = isFirstClear ? lvlCfg.reward : Math.round(lvlCfg.reward * 0.35);
    this.lastVictoryReward = rewardCrystals;
    this.victoryAdUsed = false;
    this.totalCrystals += rewardCrystals;
    this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + rewardCrystals;
    if (this.pilotStats) this.pilotStats.lifetimeCrystals += rewardCrystals;
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    this.updateCrystalsDisplay();

    // Bir sonraki seviye kilidini aç
    if (this.selectedLevel === this.unlockedLevel && this.unlockedLevel < 38) {
      this.unlockedLevel++;
      localStorage.setItem('neon_unlocked_level', this.unlockedLevel.toString());
    }

    // Sefer Sonu (Bölüm 38 Tamamlandıysa)
    if (this.selectedLevel >= 38) {
      this.state = 'VICTORY';
      this.releaseWakeLock();
      hud.classList.add('hidden');
      const victoryRewardCrystals = document.getElementById('victory-reward-crystals');
      if (victoryRewardCrystals) {
        victoryRewardCrystals.textContent = `+${rewardCrystals.toLocaleString()} CR`;
      }
      const btnVictoryDouble = document.getElementById('btn-victory-double');
      if (btnVictoryDouble) {
        btnVictoryDouble.disabled = false;
        btnVictoryDouble.classList.add('pulse');
        btnVictoryDouble.innerHTML = '<svg class="pixel-icon pixel-icon-md" viewBox="0 0 12 12"><polygon points="3,1 10,6 3,11" fill="#030816"/></svg> 🎬 2X ZAFER GANİMETİ AL (REKLAM)';
      }
      if (levelCompleteModal) levelCompleteModal.classList.remove('hidden');
      if (victoryTitle) victoryTitle.textContent = `TÜM SEFER TAMAMLANDI!`;
      if (victorySubtitle) victorySubtitle.textContent = `Efsanevi Amiral Zaferi`;
      this.particles.startWarp(180);
      return;
    }

    // Bölüm Sonu Taktiksel Rota Seçimi (Route Choice - Roguelite Seçimi)
    this.showRouteSelection(completedLevel, rewardCrystals);
  }

  showRouteSelection(completedLevel, rewardCrystals) {
    if (!routeModal || !routeChoicesContainer) {
      this.applyRouteTransition(completedLevel, rewardCrystals, 'safe');
      return;
    }

    this.state = 'ROUTE_SELECT';
    routeChoicesContainer.innerHTML = '';

    const routes = [
      {
        id: 'safe',
        title: 'GÜVENLİ ROTA',
        desc: 'Standart düşman dalgaları & +%40 Kalkan/Gövde Onarımı',
        icon: '🛡️',
        border: '#05ffa1',
        rewardText: 'Normal Ganimet'
      },
      {
        id: 'asteroid',
        title: 'ASTEROİT KUŞAĞI',
        desc: 'Yoğun altın asteroitler & +%50 Ekstra Kristal Ganimeti',
        icon: '💎',
        border: '#ffbe0b',
        rewardText: '+%50 KR Ganimeti'
      },
      {
        id: 'elite',
        title: 'ELİT KARAKOL',
        desc: 'Agresif elit düşmanlar, Tamir yok & 2X ÇİFTE GANİMET',
        icon: '⚔️',
        border: '#ff0055',
        rewardText: '2X Ganimet & Elit Sandık'
      }
    ];

    routes.forEach(r => {
      const card = document.createElement('div');
      card.style.cssText = `
        background: rgba(10, 16, 32, 0.95);
        border: 1.5px solid ${r.border};
        border-radius: 12px;
        padding: 10px 14px;
        text-align: left;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 0 10px ${r.border}33;
        transition: transform 0.15s ease;
      `;
      card.innerHTML = `
        <div style="font-size: 1.6rem;">${r.icon}</div>
        <div style="flex: 1;">
          <div style="color: ${r.border}; font-weight: 900; font-size: 0.95rem;">${r.title}</div>
          <div style="color: #94a3b8; font-size: 0.72rem; margin: 2px 0;">${r.desc}</div>
          <div style="color: #ffd700; font-weight: 800; font-size: 0.75rem;">${r.rewardText}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        vibrate.light();
        routeModal.classList.add('hidden');
        this.applyRouteTransition(completedLevel, rewardCrystals, r.id);
      });

      routeChoicesContainer.appendChild(card);
    });

    routeModal.classList.remove('hidden');
  }

  applyRouteTransition(completedLevel, rewardCrystals, routeType = 'safe') {
    this.state = 'PLAYING';
    this.lastTime = performance.now();
    this.routeModifier = routeType;

    // Yeni bölüm yapılandırması
    const nextCfg = this.getLevelConfig(this.selectedLevel);

    // Görsel Şölen ve Hipersürüş Bildirimi
    this.particles.spawnShockwave(this.width / 2, this.height * 0.45, '#ffd700', 380);
    this.particles.spawnShockwave(this.width / 2, this.height * 0.45, '#00f0ff', 280);
    this.particles.spawnFloatingText(this.width / 2, this.height * 0.32, `★ BÖLÜM ${completedLevel} TEMİZLENDİ! (+${rewardCrystals} CR) ★`, '#ffd700', 18);
    this.particles.spawnFloatingText(this.width / 2, this.height * 0.38, `>>> HİPERSÜRÜŞ: BÖLÜM ${this.selectedLevel} BAŞLIYOR <<<`, '#00f0ff', 16);
    this.particles.startWarp(110);
    this.screenShake = 10;
    this.whiteFlash = 0.6;

    // Rota Efektleri:
    if (routeType === 'safe') {
      // Güvenli rota: Ekstra tamir
      this.player.shield = this.player.maxShield;
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 35);
    } else if (routeType === 'asteroid') {
      // Asteroit rotası: Normal tamir + bonus anında kristal
      this.player.shield = Math.min(this.player.maxShield, this.player.shield + Math.round(this.player.maxShield * 0.35));
      this.totalCrystals += Math.round(rewardCrystals * 0.5);
      this.updateCrystalsDisplay();
    } else if (routeType === 'elite') {
      // Elit rota: Tamir yok, ama 2 kat ganimet çarpanı
      this.player.crystalMultiplier = (this.player.crystalMultiplier || 1.0) * 1.5;
    }

    // Kalan düşman mermilerini temizle
    this.enemyProjectiles = [];

    // Yeni Sektör Ortamı ve Atmosfer Geçişi
    this.currentSectorId = nextCfg.sector;
    Enemy.currentSector = nextCfg.sector;
    this.particles.setSector(nextCfg.sector, this.width, this.height);

    // Bölüm boss bayraklarını ve zamanlayıcılarını sıfırla
    this.currentBoss = null;
    this.currentLevelBoss = null;
    this.levelBossSpawned = false;
    this.levelBossWarningTriggered = false;
    this.bossArenaActive = false;
    this.gameTime = 0;
    this.wave = 1;

    this.updateLevelDisplay();
    this.updateHUD();
  }

  updatePilotRankDisplay() {
    if (!this.pilotStats) this.pilotStats = this.loadPilotStats();
    const flights = this.pilotStats.totalFlights || 0;
    const maxScore = Math.max(this.highScores.classic || 0, this.highScores.storm || 0);

    let rank = t('rank_rookie');
    let icon = 'pilot';
    if (maxScore > 50000 || flights >= 35) {
      rank = t('rank_master');
      icon = 'crown';
    } else if (maxScore > 20000 || flights >= 18) {
      rank = t('rank_ace');
      icon = 'sword';
    } else if (maxScore > 7500 || flights >= 6) {
      rank = t('rank_veteran');
      icon = 'ship';
    }

    if (menuPilotRank) menuPilotRank.textContent = rank;
    if (menuPilotFlights) menuPilotFlights.textContent = t('rank_flights', { n: flights });
    const rankBadge = document.getElementById('menu-rank-badge');
    if (rankBadge) {
      const rIcon = rankBadge.querySelector('.rank-icon');
      if (rIcon) rIcon.innerHTML = getPixelIconSvg(icon, 'md');
    }
  }

  updateMenuShipPreview() {
    const skinId = this.skinOrder[this.menuSkinIndex];
    const skin = this.skins[skinId] || this.skins.cyberpunk;
    const isUnlocked = this.unlockedSkins.includes(skin.id);
    const isEquipped = this.currentSkinId === skin.id;

    const visualEl = document.getElementById('menu-ship-visual');
    if (visualEl) {
      visualEl.innerHTML = getShipPixelSvg(skin.id, 64);
    }

    if (menuShipName) menuShipName.textContent = t(`ship_${skin.id}_name`) || skin.name;
    const shipClassEl = document.getElementById('menu-ship-class');
    if (shipClassEl) shipClassEl.textContent = t(`ship_${skin.id}_title`) || skin.title;

    const perkTitleEl = document.getElementById('menu-ship-perk-title');
    if (perkTitleEl) perkTitleEl.textContent = t(`ship_${skin.id}_perk_title`) || skin.perkTitle;
    if (menuShipPerk) menuShipPerk.textContent = t(`ship_${skin.id}_perk_desc`) || skin.perk;

    // Stat barlarını güncelle
    const stats = skin.stats || { dmg: 100, shield: 100, speed: 100, magnet: 100 };
    const barDmg = document.getElementById('jet-bar-dmg');
    const valDmg = document.getElementById('jet-val-dmg');
    if (barDmg && valDmg) {
      barDmg.style.width = `${Math.min(100, (stats.dmg / 150) * 100)}%`;
      valDmg.textContent = `%${stats.dmg}`;
    }

    const barShield = document.getElementById('jet-bar-shield');
    const valShield = document.getElementById('jet-val-shield');
    if (barShield && valShield) {
      barShield.style.width = `${Math.min(100, (stats.shield / 150) * 100)}%`;
      valShield.textContent = `%${stats.shield}`;
    }

    const barSpeed = document.getElementById('jet-bar-speed');
    const valSpeed = document.getElementById('jet-val-speed');
    if (barSpeed && valSpeed) {
      barSpeed.style.width = `${Math.min(100, (stats.speed / 150) * 100)}%`;
      valSpeed.textContent = `%${stats.speed}`;
    }

    const barMagnet = document.getElementById('jet-bar-magnet');
    const valMagnet = document.getElementById('jet-val-magnet');
    if (barMagnet && valMagnet) {
      barMagnet.style.width = `${Math.min(100, (stats.magnet / 160) * 100)}%`;
      valMagnet.textContent = `%${stats.magnet}`;
    }

    if (menuShipStatus) {
      if (isEquipped) {
        menuShipStatus.textContent = t('status_equipped');
        menuShipStatus.className = 'menu-ship-status equipped';
      } else if (isUnlocked) {
        menuShipStatus.textContent = t('status_ready');
        menuShipStatus.className = 'menu-ship-status unlocked';
      } else {
        menuShipStatus.textContent = `${t('status_locked')} (${skin.cost} CR)`;
        menuShipStatus.className = 'menu-ship-status locked';
      }
    }
  }

  prevMenuSkin() {
    sounds.init();
    sounds.playCardSelect();
    vibrate.light();
    this.menuSkinIndex = (this.menuSkinIndex - 1 + this.skinOrder.length) % this.skinOrder.length;
    this.updateMenuShipPreview();
  }

  nextMenuSkin() {
    sounds.init();
    sounds.playCardSelect();
    vibrate.light();
    this.menuSkinIndex = (this.menuSkinIndex + 1) % this.skinOrder.length;
    this.updateMenuShipPreview();
  }

  handleMenuShipClick() {
    sounds.init();
    const skinId = this.skinOrder[this.menuSkinIndex];
    const isUnlocked = this.unlockedSkins.includes(skinId);
    if (isUnlocked) {
      this.currentSkinId = skinId;
      localStorage.setItem('neon_equipped_skin', skinId);
      sounds.playCardSelect();
      vibrate.light();
      this.updateMenuShipPreview();
      this.renderHangarSkins();
    } else {
      this.openHangar();
    }
  }

  getDailyStreakInfo() {
    const today = new Date().toISOString().slice(0, 10);
    const lastClaimed = localStorage.getItem('neon_daily_reward_date');
    let streak = parseInt(localStorage.getItem('neon_daily_streak') || '0', 10);

    if (!lastClaimed) {
      return { streak: 1, isClaimed: false, canClaim: true };
    }

    if (lastClaimed === today) {
      return { streak: Math.max(1, streak), isClaimed: true, canClaim: false };
    }

    const lastDate = new Date(lastClaimed);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Dün girilmiş, seri devam ediyor
      const nextStreak = (streak % 7) + 1;
      return { streak: nextStreak, isClaimed: false, canClaim: true };
    } else {
      // 1 günden fazla ara verilmiş, seri sıfırlandı
      return { streak: 1, isClaimed: false, canClaim: true };
    }
  }

  checkDailyReward() {
    const info = this.getDailyStreakInfo();
    if (dailyRewardDot) {
      if (info.canClaim) {
        dailyRewardDot.classList.remove('hidden');
      } else {
        dailyRewardDot.classList.add('hidden');
      }
    }
    return info.canClaim;
  }

  openDailyRewardModal() {
    try { history.pushState({ modal: 'daily_reward' }, ''); } catch(e) {}
    const info = this.getDailyStreakInfo();
    const rewards = [
      { day: 1, crystals: 100, label: '1. GÜN' },
      { day: 2, crystals: 180, label: '2. GÜN' },
      { day: 3, crystals: 280, label: '3. GÜN' },
      { day: 4, crystals: 420, label: '4. GÜN' },
      { day: 5, crystals: 600, label: '5. GÜN' },
      { day: 6, crystals: 850, label: '6. GÜN' },
      { day: 7, crystals: 1250, label: '7. GÜN [MAKS]' }
    ];

    const streakBadge = document.getElementById('daily-streak-badge');
    if (streakBadge) {
      streakBadge.textContent = info.isClaimed 
        ? t('daily_badge_claimed', { n: info.streak }) 
        : t('daily_badge_ready', { n: info.streak });
    }

    const grid = document.getElementById('daily-streak-grid');
    if (grid) {
      grid.innerHTML = '';
      rewards.forEach((r) => {
        const card = document.createElement('div');
        const isDay7 = (r.day === 7);
        let statusClass = '';
        let statusText = t('daily_locked_status');

        if (r.day < info.streak || (r.day === info.streak && info.isClaimed)) {
          statusClass = 'completed';
          statusText = t('daily_claimed_status');
        } else if (r.day === info.streak && !info.isClaimed) {
          statusClass = 'active';
          statusText = t('daily_today');
        }

        card.className = `streak-day-card ${isDay7 ? 'day-7' : ''} ${statusClass}`;
        card.innerHTML = `
          <div class="streak-day-label">${r.label}</div>
          <div class="streak-day-icon" style="margin: 4px auto; display: flex; align-items: center; justify-content: center;">
            ${isDay7 ? getPixelIconSvg('crown', 'lg') : getPixelIconSvg('crystal', 'md')}
          </div>
          <div class="streak-day-reward">+${r.crystals} CR</div>
          <div class="streak-day-status">${statusText}</div>
        `;
        grid.appendChild(card);
      });
    }

    if (btnClaimDaily) {
      if (info.canClaim) {
        const currentReward = rewards[info.streak - 1] || rewards[0];
        btnClaimDaily.disabled = false;
        btnClaimDaily.innerHTML = t('daily_btn_claim_ad', { n: info.streak, c: currentReward.crystals });
        btnClaimDaily.style.opacity = '1';
        btnClaimDaily.classList.add('pulse');
      } else {
        btnClaimDaily.disabled = true;
        btnClaimDaily.textContent = t('daily_btn_claimed', { n: info.streak });
        btnClaimDaily.style.opacity = '0.6';
        btnClaimDaily.classList.remove('pulse');
      }
    }
    if (dailyRewardModal) dailyRewardModal.classList.remove('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(3);
  }

  claimDailyRewardWithAd() {
    const info = this.getDailyStreakInfo();
    if (!info.canClaim) return;

    if (btnClaimDaily) {
      btnClaimDaily.disabled = true;
      btnClaimDaily.textContent = '🎬 REKLAM YÜKLENİYOR...';
    }

    if (window.showRewardedAd) {
      window.showRewardedAd(
        (reward) => {
          // Reklam sonuna kadar izlendi -> Ödülü ver!
          this.claimDailyReward();
          this.showToast('🎁 Pilot İkmali Kasaya Aktarıldı!', '#05ffa1');
        },
        (err) => {
          // Reklam kapatıldı veya yüklenemedi -> Ödül kesinlikle VERİLMEZ!
          console.warn('Günlük ikmal reklamı tamamlanmadı:', err);
          const rewards = [100, 180, 280, 420, 600, 850, 1250];
          const currentReward = rewards[info.streak - 1] || 100;
          if (btnClaimDaily) {
            btnClaimDaily.disabled = false;
            btnClaimDaily.innerHTML = `🎬 REKLAM İZLE & GÜN ${info.streak} ÖDÜLÜNÜ AL (+${currentReward} CR)`;
          }
          this.showToast('⚠️ Reklam tamamlanmadığı için ikmal verilemedi.', '#ff0055');
          vibrate.medium();
        }
      );
    } else {
      this.claimDailyReward();
    }
  }

  claimDailyReward() {
    const today = new Date().toISOString().slice(0, 10);
    const info = this.getDailyStreakInfo();
    if (!info.canClaim) return;

    const rewards = [100, 180, 280, 420, 600, 850, 1250];
    const gain = rewards[info.streak - 1] || 100;

    this.totalCrystals += gain;
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    localStorage.setItem('neon_daily_reward_date', today);
    localStorage.setItem('neon_daily_streak', info.streak.toString());

    sounds.playLevelUp();
    vibrate.success();
    this.particles.spawnExplosion(this.width / 2, this.height * 0.45, '#05ffa1', 25, 4);
    this.updateCrystalsDisplay();
    this.checkDailyReward();
    this.openDailyRewardModal();

    if (btnClaimDaily) {
      btnClaimDaily.disabled = true;
      btnClaimDaily.textContent = `+${gain} KRİSTAL KASAYA EKLENDİ!`;
    }
    setTimeout(() => {
      if (dailyRewardModal) dailyRewardModal.classList.add('hidden');
    }, 1300);
  }

  // === KOZMİK ŞANS ÇARKI (LUCKY WHEEL) MOTORU ===
  initLuckyWheel() {
    this.wheelSectors = [
      { label: '+100 CR', value: 100, type: 'crystals', color: '#00f0ff', text: '#030816' },
      { label: t('wheel_slice_revive'), value: 1, type: 'revive', color: '#ff0055', text: '#ffffff' },
      { label: '+200 CR', value: 200, type: 'crystals', color: '#ffbe0b', text: '#030816' },
      { label: t('wheel_slice_shield'), value: 1, type: 'shield', color: '#38bdf8', text: '#030816' },
      { label: '🔥 500 CR', value: 500, type: 'crystals', color: '#ffd700', text: '#030816' },
      { label: '+75 CR', value: 75, type: 'crystals', color: '#94a3b8', text: '#030816' },
      { label: '+150 CR', value: 150, type: 'crystals', color: '#05ffa1', text: '#030816' },
      { label: t('wheel_slice_overdrive'), value: 1, type: 'overdrive', color: '#c084fc', text: '#030816' }
    ];
    this.wheelRotation = 0;
    this.wheelIsSpinning = false;
    this.drawLuckyWheel();
    this.updateWheelBadge();
  }

  getWheelState() {
    const today = new Date().toISOString().slice(0, 10);
    let state = { date: today, spinsUsed: 0 };
    try {
      const raw = localStorage.getItem('neon_wheel_state');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.date === today) {
          const used = parsed.spinsUsed !== undefined 
            ? parsed.spinsUsed 
            : ((parsed.freeSpinsUsed || 0) + (parsed.adSpinsUsed || 0));
          state = { date: today, spinsUsed: Math.min(3, used) };
        }
      }
    } catch(e) {}
    return state;
  }

  saveWheelState(state) {
    try {
      localStorage.setItem('neon_wheel_state', JSON.stringify(state));
    } catch(e) {}
    this.updateWheelBadge();
  }

  updateWheelBadge() {
    const state = this.getWheelState();
    const dot = document.getElementById('wheel-badge-dot');
    if (dot) {
      if (state.spinsUsed < 1) {
        dot.classList.remove('hidden');
      } else {
        dot.classList.add('hidden');
      }
    }
  }

  openLuckyWheel() {
    try { history.pushState({ modal: 'lucky_wheel' }, ''); } catch(e) {}
    const wheelModal = document.getElementById('lucky-wheel-modal');
    if (wheelModal) wheelModal.classList.remove('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(3);
    this.updateWheelUI();
    this.drawLuckyWheel();
  }

  updateWheelUI() {
    const state = this.getWheelState();
    const btn = document.getElementById('btn-spin-wheel');
    const textEl = document.getElementById('wheel-spin-btn-text') || document.getElementById('btn-spin-wheel-text');
    const sub = document.getElementById('wheel-status-subtitle');

    if (state.spinsUsed === 0) {
      if (sub) sub.textContent = t('wheel_sub_free');
      if (textEl) textEl.textContent = t('wheel_btn_free');
      if (btn) {
        btn.disabled = this.wheelIsSpinning;
        btn.style.opacity = '1';
      }
    } else if (state.spinsUsed < 3) {
      const remaining = 3 - state.spinsUsed;
      if (sub) sub.textContent = t('wheel_sub_ad', { n: remaining });
      if (textEl) textEl.innerHTML = t('wheel_btn_ad', { n: remaining });
      if (btn) {
        btn.disabled = this.wheelIsSpinning;
        btn.style.opacity = '1';
      }
    } else {
      if (sub) sub.textContent = t('wheel_sub_done');
      if (textEl) textEl.textContent = t('wheel_btn_done');
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.55';
      }
    }
  }

  drawLuckyWheel() {
    const wCanvas = document.getElementById('lucky-wheel-canvas');
    if (!wCanvas) return;
    const wCtx = wCanvas.getContext('2d');
    const width = wCanvas.width;
    const height = wCanvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = cx - 12;
    const sectors = this.wheelSectors;
    if (!sectors) return;
    const numSectors = sectors.length;
    const sliceAngle = (Math.PI * 2) / numSectors;

    wCtx.clearRect(0, 0, width, height);

    // Dış Halka & Neon Altın Işıltı
    wCtx.save();
    wCtx.beginPath();
    wCtx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
    wCtx.strokeStyle = '#ffd700';
    wCtx.lineWidth = 4;
    wCtx.shadowColor = '#ffd700';
    wCtx.shadowBlur = 10;
    wCtx.stroke();
    wCtx.restore();

    // Dilimler
    for (let i = 0; i < numSectors; i++) {
      const s = sectors[i];
      const startAngle = this.wheelRotation + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      wCtx.beginPath();
      wCtx.moveTo(cx, cy);
      wCtx.arc(cx, cy, radius, startAngle, endAngle);
      wCtx.closePath();
      wCtx.fillStyle = s.color;
      wCtx.fill();
      wCtx.strokeStyle = '#030816';
      wCtx.lineWidth = 2.5;
      wCtx.stroke();

      // Dilim Metni
      wCtx.save();
      wCtx.translate(cx, cy);
      wCtx.rotate(startAngle + sliceAngle / 2);
      wCtx.textAlign = 'right';
      wCtx.fillStyle = s.text;
      wCtx.font = '900 11px "Segoe UI", sans-serif';
      wCtx.fillText(s.label, radius - 14, 4);
      wCtx.restore();
    }

    // Orta Göbek (Center Hub)
    wCtx.save();
    wCtx.beginPath();
    wCtx.arc(cx, cy, 22, 0, Math.PI * 2);
    wCtx.fillStyle = '#070b19';
    wCtx.fill();
    wCtx.strokeStyle = '#ffd700';
    wCtx.lineWidth = 3;
    wCtx.stroke();

    wCtx.beginPath();
    wCtx.arc(cx, cy, 8, 0, Math.PI * 2);
    wCtx.fillStyle = '#ff0055';
    wCtx.shadowColor = '#ff0055';
    wCtx.shadowBlur = 8;
    wCtx.fill();
    wCtx.restore();
  }

  handleWheelSpinClick() {
    if (this.wheelIsSpinning) return;
    const state = this.getWheelState();
    if (state.spinsUsed >= 3) {
      this.showToast('Günün tüm hakları kullanıldı! Yarın tekrar bekleriz.', '#ffbe0b');
      return;
    }

    if (state.spinsUsed === 0) {
      state.spinsUsed = 1;
      this.saveWheelState(state);
      this.spinWheel();
    } else {
      if (window.showRewardedAd) {
        window.showRewardedAd(
          () => {
            state.spinsUsed += 1;
            this.saveWheelState(state);
            this.spinWheel();
          },
          (err) => {
            console.warn('Çark reklamı tamamlanmadı:', err);
            this.showToast('⚠️ Reklam tamamlanmadığı için çark çevrilemedi.', '#ff0055');
            vibrate.medium();
          }
        );
      } else {
        state.spinsUsed += 1;
        this.saveWheelState(state);
        this.spinWheel();
      }
    }
  }

  spinWheel() {
    if (this.wheelIsSpinning) return;
    this.wheelIsSpinning = true;
    this.updateWheelUI();

    // Kazanılacak dilimi belirle (Düşük ödüller kullanıcıya hissettirilmeden daha yüksek şanslı)
    // 0: +100 CR (26%)
    // 1: Canlanma (5%)
    // 2: +200 CR (9%)
    // 3: Kalkan (14%)
    // 4: 500 CR Jackpot (2%)
    // 5: +75 CR (28%)
    // 6: +150 CR (12%)
    // 7: Süper Şarj (4%)
    const weights = [26, 5, 9, 14, 2, 28, 12, 4];
    const totalW = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalW;
    let winningIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      if (rand < weights[i]) {
        winningIndex = i;
        break;
      }
      rand -= weights[i];
    }

    const numSectors = this.wheelSectors.length;
    const sliceAngle = (Math.PI * 2) / numSectors;
    const fullSpins = 6 + Math.floor(Math.random() * 3);

    // İğne tepede (-PI/2). Hafif doğal jitter ile dilimin içine otursun
    const jitter = (Math.random() * 0.4 - 0.2) * sliceAngle;
    const targetAngleOffset = -Math.PI / 2 - (winningIndex + 0.5) * sliceAngle + jitter;
    const currentNorm = this.wheelRotation % (Math.PI * 2);
    let delta = targetAngleOffset - currentNorm;
    while (delta < 0) delta += Math.PI * 2;
    const totalRotation = fullSpins * Math.PI * 2 + delta;
    const startRot = this.wheelRotation;
    const startTime = performance.now();
    const duration = 4300;

    let lastTickSector = -1;

    const animateSpin = (now) => {
      const elapsed = now - startTime;
      const tProgress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - tProgress, 3);
      this.wheelRotation = startRot + totalRotation * ease;
      this.drawLuckyWheel();

      // Dilim geçiş sesi
      const currentSector = Math.floor((( -Math.PI / 2 - this.wheelRotation ) % (Math.PI * 2) + Math.PI * 2) / sliceAngle) % numSectors;
      if (currentSector !== lastTickSector) {
        lastTickSector = currentSector;
        sounds.playCardSelect();
        vibrate.light();
      }

      if (tProgress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        this.wheelIsSpinning = false;
        this.updateWheelUI();
        const prize = this.wheelSectors[winningIndex];
        this.claimWheelPrize(prize);
      }
    };

    requestAnimationFrame(animateSpin);
  }

  claimWheelPrize(prize) {
    if (prize.type === 'crystals') {
      this.totalCrystals += prize.value;
      this.saveData();
      this.updateCrystalsDisplay();
      if (prize.value >= 500) {
        sounds.playVictory();
        vibrate.heavy();
        this.showToast(`🔥 JACKPOT! +${prize.value} KRİSTAL KAZANDIN!`, '#ffd700');
        this.particles.spawnExplosion(this.width / 2, this.height * 0.45, '#ffd700', 40, 5);
      } else {
        sounds.playLevelUp();
        vibrate.success();
        this.showToast(`🎉 +${prize.value} Kristal Kasaya Eklendi!`, prize.color);
        this.particles.spawnExplosion(this.width / 2, this.height * 0.45, prize.color, 25, 4);
      }
    } else if (prize.type === 'revive') {
      const currentRevives = parseInt(localStorage.getItem('neon_bonus_revives') || '0', 10) + 1;
      localStorage.setItem('neon_bonus_revives', currentRevives.toString());
      sounds.playLevelUp();
      vibrate.success();
      this.showToast('🛡️ +1 Canlanma Hakkı Depoya Eklendi!', '#ff0055');
    } else if (prize.type === 'shield') {
      this.bonusShield = true;
      sounds.playLevelUp();
      vibrate.success();
      this.showToast('⚡ Sıradaki Uçuş İçin Kalkan Takviyesi Hazır!', '#38bdf8');
    } else if (prize.type === 'overdrive') {
      this.bonusOverdrive = true;
      sounds.playLevelUp();
      vibrate.success();
      this.showToast('🚀 Sıradaki Uçuş İçin Süper Şarj Hazır!', '#c084fc');
    }
  }

  // === GLOBAL LİDER TABLOSU (LEADERBOARD) MOTORU ===
  initLeaderboard() {
    this.lbMode = 'storm';
    this.lbView = 'top50'; // 'top50' | 'around'
    this.totalPilots = 18492;

    this.lbCountries = [
      { code: 'TUR', flag: '🇹🇷', name: 'Türkiye' },
      { code: 'AZE', flag: '🇦🇿', name: 'Azerbaycan' },
      { code: 'USA', flag: '🇺🇸', name: 'USA' },
      { code: 'GER', flag: '🇩🇪', name: 'Germany' },
      { code: 'GBR', flag: '🇬🇧', name: 'UK' },
      { code: 'JPN', flag: '🇯🇵', name: 'Japan' },
      { code: 'KOR', flag: '🇰🇷', name: 'Korea' },
      { code: 'FRA', flag: '🇫🇷', name: 'France' },
      { code: 'BRA', flag: '🇧🇷', name: 'Brazil' },
      { code: 'CAN', flag: '🇨🇦', name: 'Canada' },
      { code: 'ESP', flag: '🇪🇸', name: 'Spain' },
      { code: 'ITA', flag: '🇮🇹', name: 'Italy' },
      { code: 'NLD', flag: '🇳🇱', name: 'Netherlands' },
      { code: 'SWE', flag: '🇸🇪', name: 'Sweden' },
      { code: 'AUS', flag: '🇦🇺', name: 'Australia' }
    ];

    this.setupLeaderboardEvents();
  }

  setupLeaderboardEvents() {
    if (this._lbEventsBound) return;
    this._lbEventsBound = true;

    const lbTabStorm = document.getElementById('lb-tab-storm');
    const lbTabCampaign = document.getElementById('lb-tab-campaign');
    const lbViewTop50 = document.getElementById('lb-view-top50');
    const lbViewAround = document.getElementById('lb-view-around');
    const btnEditProfile = document.getElementById('lb-btn-edit-profile');
    const btnCancelProfile = document.getElementById('lb-btn-cancel-profile');
    const btnSaveProfile = document.getElementById('lb-btn-save-profile');

    if (lbTabStorm) {
      lbTabStorm.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.lbMode = 'storm';
        this.renderLeaderboard('storm');
      });
    }

    if (lbTabCampaign) {
      lbTabCampaign.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.lbMode = 'campaign';
        this.renderLeaderboard('campaign');
      });
    }

    if (lbViewTop50) {
      lbViewTop50.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.lbView = 'top50';
        this.renderLeaderboard(this.lbMode);
      });
    }

    if (lbViewAround) {
      lbViewAround.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.lbView = 'around';
        this.renderLeaderboard(this.lbMode);
      });
    }

    if (btnEditProfile) {
      btnEditProfile.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.openProfileModal();
      });
    }

    if (btnCancelProfile) {
      btnCancelProfile.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.closeProfileModal();
      });
    }

    if (btnSaveProfile) {
      btnSaveProfile.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.savePilotProfile();
      });
    }
  }

  openProfileModal() {
    const modal = document.getElementById('lb-profile-modal');
    const input = document.getElementById('lb-input-callsign');
    const selector = document.getElementById('lb-flags-selector');
    if (!modal) return;

    const currentCallsign = localStorage.getItem('neon_player_callsign') || 'PILOT_ALPHA';
    const currentCountry = localStorage.getItem('neon_player_country') || 'TUR';

    if (input) input.value = currentCallsign;

    if (selector) {
      selector.innerHTML = '';
      this.selectedCountryCode = currentCountry;

      this.lbCountries.forEach(c => {
        const opt = document.createElement('div');
        opt.className = `lb-flag-option ${c.code === currentCountry ? 'active' : ''}`;
        opt.innerHTML = `<span>${c.flag}</span><span>${c.code}</span>`;
        opt.addEventListener('click', () => {
          sounds.init();
          sounds.playCardSelect();
          selector.querySelectorAll('.lb-flag-option').forEach(el => el.classList.remove('active'));
          opt.classList.add('active');
          this.selectedCountryCode = c.code;
        });
        selector.appendChild(opt);
      });
    }

    modal.classList.remove('hidden');
  }

  closeProfileModal() {
    const modal = document.getElementById('lb-profile-modal');
    if (modal) modal.classList.add('hidden');
  }

  savePilotProfile() {
    const input = document.getElementById('lb-input-callsign');
    let callsign = (input && input.value ? input.value : 'PILOT_ALPHA').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!callsign || callsign.length < 2) callsign = 'PILOT_ALPHA';
    if (callsign.length > 12) callsign = callsign.substring(0, 12);

    const countryCode = this.selectedCountryCode || 'TUR';

    localStorage.setItem('neon_player_callsign', callsign);
    localStorage.setItem('neon_player_country', countryCode);

    this.closeProfileModal();
    this.renderLeaderboard(this.lbMode || 'storm');
    this.showToast('✓ Pilot Profili Güncellendi!', '#00f0ff');
  }

  getPilotAtRank(rank, mode) {
    // Deterministic pseudo-random pilot for rank
    const hash = Math.sin(rank * 12.9898 + (mode === 'storm' ? 78.233 : 45.123)) * 43758.5453;
    const rand = Math.abs(hash - Math.floor(hash));

    const pilotNames = [
      'VORTEX_PRIME', 'CYBER_VALKYRIE', 'SHADOW_STRIKER', 'NEON_PHANTOM', 'COSMIC_VIPER',
      'PULSAR_ACE', 'AURA_PILOT', 'STELLAR_RAY', 'ORBIT_HAWK', 'ZENITH_ZERO',
      'HYPER_TITAN', 'KRONOS_X', 'SOLAR_BLAZE', 'VOID_SPECTRE', 'GALAXY_KNIGHT',
      'QUANTUM_FOX', 'DARK_NEBULA', 'ZERO_GRAVITY', 'ECLIPSE_RUNNER', 'CHRONO_SHIFTER',
      'APEX_PREDATOR', 'STAR_FORGE', 'ION_CANNON', 'ASTRO_DRIFT', 'NOVA_STORM',
      'PHOENIX_WING', 'OMEGA_BLAST', 'RAZOR_CREST', 'CYBER_NINJA', 'PULSE_DRIVER',
      'WARP_HUNTER', 'METEOR_CRASH', 'TITAN_FALL', 'NEXUS_CORE', 'VALKYRIE_99',
      'GHOST_RUNNER', 'VOID_WALKER', 'STEALTH_RAY', 'SOLARIS_7', 'DRIFT_KING',
      'ALPHA_STRIKE', 'KRYPTON_Z', 'FROST_BITE', 'INFERNO_X', 'VIPER_FANG',
      'STORM_CALLER', 'VECTOR_SHIFT', 'NEON_BLADE', 'VOID_REAPER', 'CYBER_MONK'
    ];

    const ships = ['SOLAR', 'CYBER', 'VOID', 'QUANTUM', 'TITAN'];
    const titles = ['ELITE', 'ACE', 'VETERAN', 'COMMANDER', 'WARRIOR', 'PILOT', 'CHAMPION'];
    const countries = this.lbCountries || [{ code: 'TUR', flag: '🇹🇷' }];

    const nameIdx = Math.floor(rand * pilotNames.length);
    const countryIdx = Math.floor(((rand * 17) % 1) * countries.length);
    const shipIdx = Math.floor(((rand * 31) % 1) * ships.length);
    const titleIdx = Math.floor(((rand * 47) % 1) * titles.length);

    const country = countries[countryIdx] || countries[0];
    const ship = ships[shipIdx] || 'CYBER';
    const title = titles[titleIdx] || 'PILOT';
    const baseName = pilotNames[nameIdx] || 'PILOT_UNKNOWN';
    const name = rank > 50 ? `${baseName}_${rank % 99}` : baseName;

    let score = 0;
    let level = 1;
    let stars = 3;

    if (mode === 'storm') {
      const norm = (rank - 1) / (this.totalPilots || 18492);
      const base = Math.round(298500 * Math.pow(Math.max(0, 1 - norm), 2.85));
      const jitter = Math.floor(rand * 60) - 30;
      score = Math.max(150, base + jitter);
    } else {
      const norm = (rank - 1) / (this.totalPilots || 18492);
      level = Math.max(1, Math.min(40, Math.round(40 * Math.pow(Math.max(0, 1 - norm), 1.75))));
      const maxStars = level * 3;
      const loss = Math.floor(rand * 3);
      stars = Math.max(level, maxStars - loss);
    }

    return { rank, name, country, ship, title, score, level, stars, isPlayer: false };
  }

  calculatePlayerRank(mode) {
    const total = this.totalPilots || 18492;
    if (mode === 'storm') {
      const score = this.highScores.storm || 0;
      if (score <= 0) return total - 150;
      if (score >= 298500) return 1;
      const norm = 1 - Math.pow(Math.min(1, Math.max(0, score / 298500)), 1 / 2.85);
      return Math.max(1, Math.min(total, Math.round(1 + (total - 1) * norm)));
    } else {
      const clearedLevel = Math.max(1, (this.unlockedLevel || 1) - 1);
      const totalStars = this.getTotalStars ? this.getTotalStars() : clearedLevel * 3;
      const power = clearedLevel * 10 + totalStars; // max ~ 520
      if (power <= 10) return total - 250;
      if (power >= 520) return 1;
      const norm = 1 - Math.pow(Math.min(1, Math.max(0, power / 520)), 1 / 1.75);
      return Math.max(1, Math.min(total, Math.round(1 + (total - 1) * norm)));
    }
  }

  getTierInfo(rank) {
    const total = this.totalPilots || 18492;
    const pct = (rank / total) * 100;
    if (rank <= 50) return { name: t('lb_tier_champ') || 'ŞAMPİYON', icon: '👑', color: '#ff0055', pctText: `TOP %${pct.toFixed(2)}` };
    if (rank <= 500) return { name: t('lb_tier_diamond') || 'ELMAS', icon: '💎', color: '#00f0ff', pctText: `TOP %${pct.toFixed(1)}` };
    if (rank <= 2500) return { name: t('lb_tier_plat') || 'PLATİN', icon: '🔮', color: '#10b981', pctText: `TOP %${Math.max(1, Math.round(pct))}` };
    if (rank <= 7500) return { name: t('lb_tier_gold') || 'ALTIN', icon: '🥇', color: '#ffd700', pctText: `TOP %${Math.round(pct)}` };
    if (rank <= 13000) return { name: t('lb_tier_silver') || 'GÜMÜŞ', icon: '🥈', color: '#cbd5e1', pctText: `TOP %${Math.round(pct)}` };
    return { name: t('lb_tier_bronze') || 'BRONZ', icon: '🥉', color: '#cd7f32', pctText: `TOP %${Math.round(pct)}` };
  }

  openLeaderboard() {
    try { history.pushState({ modal: 'leaderboard' }, ''); } catch(e) {}
    const lbModal = document.getElementById('leaderboard-modal');
    if (lbModal) lbModal.classList.remove('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(5);
    this.renderLeaderboard(this.lbMode || 'storm');
  }

  renderLeaderboard(mode = 'storm') {
    this.lbMode = mode;
    const view = this.lbView || 'top50';
    const list = document.getElementById('leaderboard-list');
    const podium = document.getElementById('lb-podium-container');
    const rankEl = document.getElementById('lb-player-rank');
    const scoreEl = document.getElementById('lb-player-score');
    const scoreSubEl = document.getElementById('lb-player-score-sub');
    const nameEl = document.getElementById('lb-player-name');
    const tierBadgeEl = document.getElementById('lb-player-tier-badge');
    const percentileEl = document.getElementById('lb-player-percentile');
    const hintEl = document.getElementById('lb-player-hint');
    const activeCountEl = document.getElementById('lb-active-count');
    if (!list) return;

    if (activeCountEl) {
      activeCountEl.textContent = `${(this.totalPilots || 18492).toLocaleString()} ${t('lb_active_pilots') ? t('lb_active_pilots').replace('{n}', '') : 'AKTİF PİLOT'}`;
    }

    // Tab buttons UI active toggle
    const lbTabStorm = document.getElementById('lb-tab-storm');
    const lbTabCampaign = document.getElementById('lb-tab-campaign');
    if (lbTabStorm && lbTabCampaign) {
      if (mode === 'storm') {
        lbTabStorm.classList.add('active');
        lbTabCampaign.classList.remove('active');
      } else {
        lbTabCampaign.classList.add('active');
        lbTabStorm.classList.remove('active');
      }
    }

    const lbViewTop50 = document.getElementById('lb-view-top50');
    const lbViewAround = document.getElementById('lb-view-around');
    if (lbViewTop50 && lbViewAround) {
      if (view === 'top50') {
        lbViewTop50.classList.add('active');
        lbViewAround.classList.remove('active');
      } else {
        lbViewAround.classList.add('active');
        lbViewTop50.classList.remove('active');
      }
    }

    // Player Data
    const pilotCallsign = localStorage.getItem('neon_player_callsign') || 'PILOT_ALPHA';
    const pilotCountryCode = localStorage.getItem('neon_player_country') || 'TUR';
    const pilotCountry = (this.lbCountries && this.lbCountries.find(c => c.code === pilotCountryCode)) || { code: 'TUR', flag: '🇹🇷' };
    const currentSkinName = (this.skins && this.skins[this.currentSkinId]?.name?.toUpperCase()) || 'CYBER';

    const stormScore = this.highScores.storm || 0;
    const clearedLevel = Math.max(1, (this.unlockedLevel || 1) - 1);
    const totalStars = this.getTotalStars ? this.getTotalStars() : clearedLevel * 3;

    const playerRank = this.calculatePlayerRank(mode);
    const tier = this.getTierInfo(playerRank);

    // Update Sticky Player HUD
    if (rankEl) rankEl.textContent = `#${playerRank.toLocaleString()}`;
    if (tierBadgeEl) {
      tierBadgeEl.textContent = tier.icon;
      tierBadgeEl.title = tier.name;
    }
    if (percentileEl) {
      percentileEl.textContent = `${tier.pctText} · ${tier.name}`;
      percentileEl.style.color = tier.color;
    }
    if (nameEl) {
      nameEl.innerHTML = `${pilotCountry.flag} ${pilotCallsign} <span class="lb-you-badge">SEN</span>`;
    }

    if (mode === 'storm') {
      if (scoreEl) scoreEl.textContent = `${stormScore.toLocaleString()}`;
      if (scoreSubEl) scoreSubEl.textContent = 'PTS';
    } else {
      if (scoreEl) scoreEl.textContent = `${t('lb_stage')} ${clearedLevel}`;
      if (scoreSubEl) scoreSubEl.textContent = `★${totalStars}`;
    }

    // Calculate next pilot ahead to pass
    if (playerRank > 1) {
      const pilotAhead = this.getPilotAtRank(playerRank - 1, mode);
      if (mode === 'storm') {
        const diff = Math.max(50, pilotAhead.score - stormScore);
        if (hintEl) hintEl.textContent = `#{r} geçmek için +{n} PTS`.replace('{r}', (playerRank - 1).toLocaleString()).replace('{n}', diff.toLocaleString());
      } else {
        if (hintEl) hintEl.textContent = `#{r} geçmek için sonraki bölümü bitir`.replace('{r}', (playerRank - 1).toLocaleString());
      }
    } else {
      if (hintEl) hintEl.textContent = `👑 ZİRVEDESİN! (DÜNYA #1)`;
    }

    // Player Object
    const playerObj = {
      rank: playerRank,
      name: pilotCallsign,
      country: pilotCountry,
      ship: currentSkinName,
      title: 'CHAMPION',
      score: stormScore,
      level: clearedLevel,
      stars: totalStars,
      isPlayer: true
    };

    list.innerHTML = '';

    if (view === 'top50') {
      if (podium) podium.style.display = 'flex';

      // Generate Top 3
      const top3 = [];
      for (let r = 1; r <= 3; r++) {
        if (playerRank === r) {
          top3.push(playerObj);
        } else {
          top3.push(this.getPilotAtRank(r, mode));
        }
      }

      // Render Podium (2nd left, 1st center, 3rd right)
      if (podium) {
        const p1 = top3[0];
        const p2 = top3[1];
        const p3 = top3[2];

        podium.innerHTML = `
          <div class="lb-podium-slot rank-2 ${p2.isPlayer ? 'is-current-player' : ''}">
            <div class="lb-podium-medal">🥈</div>
            <div class="lb-podium-name"><span class="lb-podium-flag">${p2.country.flag}</span>${p2.name}</div>
            <div class="lb-podium-score">${mode === 'storm' ? p2.score.toLocaleString() : 'BLM ' + p2.level}</div>
            <div class="lb-podium-ship">${p2.ship}</div>
          </div>
          <div class="lb-podium-slot rank-1 ${p1.isPlayer ? 'is-current-player' : ''}">
            <div class="lb-podium-crown">👑</div>
            <div class="lb-podium-name"><span class="lb-podium-flag">${p1.country.flag}</span>${p1.name}</div>
            <div class="lb-podium-score">${mode === 'storm' ? p1.score.toLocaleString() : 'BLM ' + p1.level}</div>
            <div class="lb-podium-ship">${p1.ship}</div>
          </div>
          <div class="lb-podium-slot rank-3 ${p3.isPlayer ? 'is-current-player' : ''}">
            <div class="lb-podium-medal">🥉</div>
            <div class="lb-podium-name"><span class="lb-podium-flag">${p3.country.flag}</span>${p3.name}</div>
            <div class="lb-podium-score">${mode === 'storm' ? p3.score.toLocaleString() : 'BLM ' + p3.level}</div>
            <div class="lb-podium-ship">${p3.ship}</div>
          </div>
        `;
      }

      // Render Ranks 4 to 50
      for (let r = 4; r <= 50; r++) {
        const pilot = (playerRank === r) ? playerObj : this.getPilotAtRank(r, mode);
        list.appendChild(this.createLeaderboardRow(pilot, mode));
      }
    } else {
      // "Around Me" View
      if (podium) podium.style.display = 'none';

      const total = this.totalPilots || 18492;
      const startRank = Math.max(1, playerRank - 4);
      const endRank = Math.min(total, playerRank + 5);

      for (let r = startRank; r <= endRank; r++) {
        const pilot = (r === playerRank) ? playerObj : this.getPilotAtRank(r, mode);
        list.appendChild(this.createLeaderboardRow(pilot, mode));
      }
    }
  }

  createLeaderboardRow(p, mode) {
    const row = document.createElement('div');
    const isPlayer = p.isPlayer;
    let rankClass = '';
    if (p.rank === 1) rankClass = 'top-1';
    else if (p.rank === 2) rankClass = 'top-2';
    else if (p.rank === 3) rankClass = 'top-3';

    row.className = `leaderboard-row ${rankClass} ${isPlayer ? 'is-current-player' : ''}`;

    const scoreDisplay = mode === 'storm' 
      ? `${p.score.toLocaleString()} <span style="font-size: 0.65rem; color: #94a3b8;">PTS</span>`
      : `${t('lb_stage')} ${p.level} <span style="font-size: 0.65rem; color: #ffbe0b;">★${p.stars}</span>`;

    row.innerHTML = `
      <div class="lb-left">
        <span class="lb-rank-num">#${p.rank.toLocaleString()}</span>
        <span class="lb-flag">${p.country.flag}</span>
        <div class="lb-pilot-info">
          <div class="lb-name-row">
            <span class="lb-pilot-name">${p.name}</span>
            ${isPlayer ? '<span class="lb-you-badge">SEN</span>' : ''}
          </div>
          <div class="lb-pilot-sub">
            <span class="lb-ship-tag">${p.ship}</span>
            <span>· [${p.country.code}]</span>
          </div>
        </div>
      </div>
      <div class="lb-right">
        <div class="lb-score-val">${scoreDisplay}</div>
        ${isPlayer ? '<div class="lb-target-hint">ÇEVRİMİÇİ</div>' : ''}
      </div>
    `;

    return row;
  }

  triggerLaunch() {
    sounds.init();
    if (this.launching) return;
    this.launching = true;
    this.launchProgress = 0;
    this.requestWakeLock();
    sounds.playWarpDrive();
    vibrate.heavy();
    if (startScreen) startScreen.classList.add('launching');
  }

  toggleSound() {
    sounds.init();
    sounds.toggleMute();
    this.updateAudioButtons();
  }

  getSectorForWave(wave) {
    if (wave <= 2) return 'void';
    if (wave <= 4) return 'magma';
    if (wave <= 6) return 'toxic';
    return 'quantum';
  }

  triggerSectorWarp(targetSectorId) {
    if (this.currentSectorId === targetSectorId) return;
    this.currentSectorId = targetSectorId;
    Enemy.currentSector = targetSectorId;
    const sec = SECTORS[targetSectorId] || SECTORS.void;

    this.warpTimer = 85; // ~1.4 sn
    this.particles.startWarp(85);
    this.particles.setSector(targetSectorId, this.width, this.height);
    this.screenShake = 12;
    this.whiteFlash = 0.85;
    sounds.playWarpDrive();
    vibrate.heavy();

    if (eventBanner && eventBannerText) {
      eventBannerText.innerHTML = `${sec.subtitle}: ${sec.name}!`;
      eventBanner.classList.remove('hidden');
      setTimeout(() => {
        if (this.warpTimer <= 0 && (!this.activeEvent || this.activeEvent.timer <= 0)) {
          eventBanner.classList.add('hidden');
        }
      }, 3600);
    }

    this.particles.spawnFloatingText(this.player.x, this.player.y - 35, `${sec.subtitle}: ${sec.name}`, sec.color, 16);
    this.triggerSectorAnomaly(targetSectorId);
    this.updateHUD();
  }

  triggerSectorAnomaly(sectorId) {
    const anomalies = [
      { type: 'cryo_nebula', icon: 'freeze', name: 'KRİYOJENİK NEBULA', desc: 'Düşmanlar %25 yavaşlar, donanlar şok dalgası saçar!' },
      { type: 'solar_flare_storm', icon: 'fire', name: 'GÜNEŞ FIRTINASI', desc: 'Periyodik iyon alevi geçer, kristal değeri +%50 artar!' },
      { type: 'void_rift', icon: 'speed', name: 'BOŞLUK YARIĞI', desc: 'Düşman mermileri yavaşlar, kritik vuruş hasarı 2.5x katlanır!' },
      { type: 'quantum_surge', icon: 'energy', name: 'KUANTUM PATLAMASI', desc: 'Kritik vuruş şansı +%30, kristaller anında toplanır!' },
      { type: 'hyper_gravity', icon: 'magnet', name: 'HİPER YERÇEKİMİ', desc: 'Mıknatıs menzili 2 katına çıkar, düşmanlar çift kristal saçar!' }
    ];
    this.currentAnomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
    if (anomalyBanner && anomalyIcon && anomalyText) {
      anomalyIcon.innerHTML = getPixelIconSvg(this.currentAnomaly.icon, 'sm');
      anomalyText.textContent = `SEKTÖR ANOMALİSİ: ${this.currentAnomaly.name}`;
      anomalyBanner.classList.remove('hidden');
      setTimeout(() => {
        if (anomalyBanner) anomalyBanner.classList.add('hidden');
      }, 5000);
    }
    sounds.playBossAlarm();
    vibrate.medium();
  }

  generateMiniQuest() {
    const quests = [
      { type: 'kill', title: '25 Düşman Yok Et', current: 0, target: 25, reward: 12 },
      { type: 'crystals', title: '40 Kristal Topla', current: 0, target: 40, reward: 10 },
      { type: 'combo', title: '12x Kombo Serisi Yap', current: 0, target: 12, reward: 12 },
      { type: 'dodge', title: '15 Sn Hasarsız Uç', current: 0, target: 15, reward: 15, dodgeTimer: 0 }
    ];
    const quest = quests[Math.floor(Math.random() * quests.length)];
    this.currentMiniQuest = quest;
    this.updatePauseQuestDisplay();
    return quest;
  }

  updateMiniQuestProgress(type, amount, isDirectSet = false) {
    if (!this.currentMiniQuest || this.currentMiniQuest.type !== type) return;
    const q = this.currentMiniQuest;
    if (isDirectSet) {
      q.current = Math.max(q.current, amount);
    } else {
      q.current += amount;
    }

    this.updatePauseQuestDisplay();

    if (q.current >= q.target) {
      sounds.playJackpot();
      vibrate.success();
      this.totalCrystals += q.reward;
      this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + q.reward;
      if (this.pilotStats) this.pilotStats.lifetimeCrystals += q.reward;
      localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
      this.updateCrystalsDisplay();
      this.particles.spawnFloatingText(this.player.x, this.player.y - 30, `GÖREV TAMAMLANDI! +${q.reward} CR`, '#00f0ff', 16);
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 180);
      this.currentMiniQuest = null;
      this.nextMiniQuestTimer = 18;
      this.updatePauseQuestDisplay();
    }
  }

  openMerchant() {
    if (this.state !== 'PLAYING') return;
    try { history.pushState({ modal: 'merchant' }, ''); } catch(e) {}
    this.isMerchantActive = true;
    sounds.playLevelUp();
    vibrate.medium();
    if (merchantCrystalsDisplay) {
      merchantCrystalsDisplay.textContent = this.totalCrystals.toLocaleString();
    }
    const btnMerchantAd = document.getElementById('btn-merchant-ad-gold');
    const textSpan = document.getElementById('btn-merchant-ad-gold-text');
    if (btnMerchantAd) {
      if (this.merchantAdUsed) {
        btnMerchantAd.disabled = true;
        btnMerchantAd.classList.remove('pulse');
        if (textSpan) textSpan.textContent = 'DESTEK ALINDI ✓ (+100 CR)';
      } else {
        btnMerchantAd.disabled = false;
        btnMerchantAd.classList.add('pulse');
        if (textSpan) textSpan.textContent = '🎬 KAÇAKÇI DESTEĞİ: +100 KRİSTAL AL';
      }
    }
    this.renderMerchantItems();
    if (merchantModal) merchantModal.classList.remove('hidden');
  }

  closeMerchant() {
    this.isMerchantActive = false;
    if (merchantModal) merchantModal.classList.add('hidden');
    sounds.playWarpDrive();
  }

  renderMerchantItems() {
    if (!merchantItemsContainer) return;
    merchantItemsContainer.innerHTML = '';

    const catalog = [
      { id: 'repair', name: 'Nanobot Tamir Paketi', icon: 'repair', price: 25, desc: 'Tüm Can ve Kalkanı anında %100 tamir eder.' },
      { id: 'overdrive', name: 'Hiper Overdrive Şarjı', icon: 'energy', price: 35, desc: 'Nihai Güç (Ultimate) barını anında %100 doldurur.' },
      { id: 'emp_shield', name: 'Taktiksel EMP Kalkanı', icon: 'shield', price: 30, desc: 'Tüm düşman mermilerini anında siler ve 4 sn acil durum dokunulmazlığı verir.' },
      { id: 'damage', name: 'Plazma Katalizörü', icon: 'fire', price: 50, desc: 'Koşu boyunca silah hasarını kalıcı +%25 artırır.' },
      { id: 'shield_boost', name: 'Kalkan Çekirdeği', icon: 'shield', price: 40, desc: 'Maksimum Kalkanı +30 artırır ve anında tam doldurur.' },
      { id: 'magnet_storm', name: 'Kristal Vakum Dalgası', icon: 'magnet', price: 20, desc: '15 sn boyunca ekrandaki tüm kristalleri anında gemiye çeker.' },
      { id: 'chrono_warp', name: 'Zaman Yavaşlatıcı', icon: 'freeze', price: 45, desc: '12 saniye boyunca tüm düşman ve mermileri %65 dondurur.' }
    ];

    const shuffled = catalog.sort(() => 0.5 - Math.random()).slice(0, 3);
    shuffled.forEach(item => {
      const card = document.createElement('div');
      card.className = 'merchant-item-card';
      const canAfford = this.totalCrystals >= item.price;
      card.innerHTML = `
        <div class="merchant-item-info">
          <div class="merchant-item-icon">${getPixelIconSvg(item.icon, 'lg')}</div>
          <div>
            <div class="merchant-item-title">${item.name}</div>
            <div class="merchant-item-desc">${item.desc}</div>
          </div>
        </div>
        <button class="merchant-item-buy ${canAfford ? '' : 'disabled'}" data-id="${item.id}" data-price="${item.price}">
          ${getPixelIconSvg('crystal', 'sm')} ${item.price}
        </button>
      `;

      const btn = card.querySelector('.merchant-item-buy');
      btn.addEventListener('click', () => {
        if (this.totalCrystals >= item.price && !btn.classList.contains('bought')) {
          this.applyMerchantPurchase(item.id, item.price, btn);
        } else if (!btn.classList.contains('bought')) {
          sounds.playCardSelect();
          vibrate.light();
        }
      });

      merchantItemsContainer.appendChild(card);
    });
  }

  applyMerchantPurchase(itemId, price, buttonEl) {
    if (this.totalCrystals < price) return;
    this.totalCrystals -= price;
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    this.updateCrystalsDisplay();
    if (merchantCrystalsDisplay) {
      merchantCrystalsDisplay.textContent = this.totalCrystals.toLocaleString();
    }

    sounds.playMerchantBuy();
    vibrate.success();

    if (buttonEl) {
      buttonEl.textContent = 'SATIN ALINDI ✓';
      buttonEl.classList.add('bought');
      buttonEl.style.background = '#10b981';
      buttonEl.style.borderColor = '#05ffa1';
    }

    if (itemId === 'repair') {
      this.player.hp = this.player.maxHp;
      this.player.shield = this.player.maxShield;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#10b981', 180);
    } else if (itemId === 'overdrive') {
      this.player.feverCharge = 100;
      if (btnUltimate) btnUltimate.classList.add('ready');
      if (ultimateLabel) ultimateLabel.textContent = 'HAZIR!';
      sounds.playUltimateReady();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 200);
    } else if (itemId === 'emp_shield' || itemId === 'nuke') {
      sounds.playNuke();
      this.screenShake = 8;
      this.enemyProjectiles = [];
      this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer || 0, 240);
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 240);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 35, 'EMP MERMİ BARİYERİ AKTİF!', '#00f0ff', 16);
    } else if (itemId === 'damage') {
      this.player.damageMultiplier = (this.player.damageMultiplier || 1.0) * 1.25;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ff0055', 220);
    } else if (itemId === 'shield_boost') {
      this.player.maxShield += 30;
      this.player.shield = this.player.maxShield;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 200);
    } else if (itemId === 'magnet_storm') {
      this.player.vacuumTimer = 900;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#a855f7', 240);
    } else if (itemId === 'chrono_warp') {
      this.temporalSlowTimer = 720;
      sounds.playFreeze();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#38bdf8', 260);
    }

    this.updateHUD();
  }

  triggerUltimate() {
    if (this.state !== 'PLAYING' || !this.player || this.player.hp <= 0) return;
    if (this.player.feverCharge < 100 && !this.player.isFever) {
      sounds.playCardSelect();
      return;
    }

    this.player.isFever = true;
    this.player.feverTimer = 240; // 4 saniye taktiksel aşırı yükleme (dengeli süre)
    this.player.feverCharge = 0;

    if (btnUltimate) btnUltimate.classList.remove('ready');
    if (ultimateLabel) ultimateLabel.textContent = 'AŞIRI YÜKLEME';

    sounds.playUltimateCast();
    sounds.playNuke();
    vibrate.heavy();
    this.screenShake = 10;
    this.whiteFlash = 0.45;

    // Taktiksel EMP Alanı (Hafifletilmiş tekil darbe dalgası)
    this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 240);
    this.particles.spawnFloatingText(this.player.x, this.player.y - 45, '>>> OVERDRIVE AKTİF <<<', '#00f0ff', 18);

    // Yakındaki mermileri nötralize et (Aşırı parçacık patlamasını engelle)
    let clearedCount = 0;
    this.enemyProjectiles = this.enemyProjectiles.filter(ep => {
      const dx = ep.x - this.player.x;
      const dy = ep.y - this.player.y;
      if (dx * dx + dy * dy < 220 * 220) {
        clearedCount++;
        return false;
      }
      return true;
    });
    if (clearedCount > 0) {
      this.particles.spawnExplosion(this.player.x, this.player.y, '#00f0ff', 6, 2.5);
    }

    // Acil durum bariyer kalkanı (+20 geçici kalkan)
    this.player.shield = Math.min(this.player.maxShield + 20, this.player.shield + 20);

    // Yakındaki düşmanlara taktiksel EMP hasarı (Parçacık seli olmadan)
    for (let enemy of this.enemies) {
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      if (dx * dx + dy * dy < 220 * 220) {
        enemy.hp -= 18;
        if (enemy.hp <= 0) {
          this.handleEnemyDeath(enemy);
        }
      }
    }

    this.triggerSkinOverdriveBurst();
    this.updateHUD();
  }

  triggerPilotAbility() {
    if (this.state !== 'PLAYING' || !this.player || this.player.hp <= 0) return;
    if (this.player.abilityCooldown > 0) {
      sounds.playCardSelect();
      return;
    }

    const pilotId = this.player.pilotId || this.activeArchetype || 'interceptor';
    const pilotCfg = this.pilots[pilotId] || this.pilots.interceptor;

    // Bekleme süresini başlat
    this.player.abilityCooldown = this.player.abilityCooldownMax || pilotCfg.cooldown;
    if (btnAbility) btnAbility.classList.remove('ready');

    sounds.playPowerup();
    vibrate.medium();

    if (pilotId === 'interceptor') {
      // 1. VEGA - Kullanıcı talebiyle aktif yetenek tamamen devre dışı (Saf klasik uçuş)
      return;
    } else if (pilotId === 'dreadnought') {
      // 2. TITAN - ÇİFT KALKAN (Kalkanı anında doldurur + 5 sn %50 hasar azaltma)
      this.player.shield = this.player.maxShield;
      this.player.titanShieldTimer = 300; // 5s
      sounds.playDeflect();
      this.screenShake = 8;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 220);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 40, '🛡️ TITAN: ÇİFT KALKAN', '#ffbe0b', 16);
    } else if (pilotId === 'technician') {
      // 3. NOVA - KARA DELİK MIKNATISI (Tüm kristalleri çeker + mini EMP şoku)
      this.player.vacuumTimer = 360; // 6s tüm kristalleri kendine çeker
      sounds.playTesla();
      this.screenShake = 8;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#d946ef', 280);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 40, '🧲 NOVA: KARA DELİK MIKNATISI', '#d946ef', 16);
      // Yakındaki düşmanları iter ve hasar verir
      for (let enemy of this.enemies) {
        const dx = enemy.x - this.player.x;
        const dy = enemy.y - this.player.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 260 && dist > 1) {
          enemy.x += (dx / dist) * 70;
          enemy.y += (dy / dist) * 70;
          enemy.hp -= 20 * (this.player.damageMultiplier || 1.0);
          if (enemy.hp <= 0) this.handleEnemyDeath(enemy);
        }
      }
    } else if (pilotId === 'blaze') {
      // 4. BLAZE - PLAZMA ATILIMI (İleri doğru hasarsız atılır + mermileri siler + düşmanları yakar)
      this.player.blazeDashTimer = 45; // 0.75s hasarsız atılım
      sounds.playDash();
      this.screenShake = 10;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ff5500', 250);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 40, '🔥 BLAZE: PLAZMA ATILIMI', '#ff5500', 16);
      this.player.y = Math.max(80, this.player.y - 140);
      this.player.targetY = this.player.y;
      for (let enemy of this.enemies) {
        const dx = enemy.x - this.player.x;
        const dy = enemy.y - this.player.y;
        if (Math.hypot(dx, dy) < 180) {
          enemy.hp -= 35 * (this.player.damageMultiplier || 1.0);
          if (enemy.hp <= 0) this.handleEnemyDeath(enemy);
        }
      }
    }

    this.updateHUD();
  }

  startNewGame() {
    this.state = 'PLAYING';
    this.showTutorialIfNeeded();
    this.gameTime = 0;
    this.frames = 0;
    this.wave = 1;
    const lvlCfg = this.getLevelConfig(this.selectedLevel);
    this.currentSectorId = this.currentMode === 'classic' ? lvlCfg.sector : 'void';
    this.warpTimer = 0;
    this.particles.setSector(this.currentSectorId, this.width, this.height);
    Enemy.currentSector = this.currentSectorId;
    this.currentBoss = null;
    this.currentLevelBoss = null;
    this.levelBossSpawned = false;
    this.levelBossWarningTriggered = false;
    this.introBossDefeated = false;
    this.introBossWarningTriggered = false;
    this.firstBossDefeated = false;
    this.isNewRecordSet = false;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.barrierFlash = 0;
    this.crystalsEarnedThisRun = 0;
    this.merchantAdUsed = false;
    this.gameOverAdUsed = false;
    this.victoryAdUsed = false;
    if (recordBadge) recordBadge.classList.add('hidden');
    sounds.setBossMode(false);
    sounds.startBGM();

    this.player.x = this.width / 2;
    this.player.y = this.height * 0.8;
    this.player.targetX = this.player.x;
    this.player.targetY = this.player.y;
    this.player.radius = 16;
    this.player.visualRadius = 26;
    this.player.tilt = 0;
    this.player.combatZone = 'rear';

    const tech = this.techUpgrades || {};
    const skinCfg = this.skins[this.currentSkinId] || this.skins.cyberpunk;
    this.player.skinCfg = skinCfg;

    // Başlangıç Statları (Kullanıcı İsteği: Başta güçsüzleşme ve kademeli güçlenme)
    this.player.maxHp = Math.round(65 + (tech.hullMax || 0) * 10);
    this.player.hp = this.player.maxHp;
    this.player.critChance = 0.05 + (tech.critChance || 0) * 0.025;
    this.player.maxShield = Math.round((20 + (tech.shieldMax || 0) * 8) * (skinCfg.shieldMult || 1.0));
    this.player.shield = 0; // Kalkan ile başlama kapalı (kullanıcı talebi: 0 kalkanla başla)
    this.player.level = 1;
    this.player.xp = 0;
    this.player.nextXp = 5; // İlk yükseltme hızla gelsin (Vampire Survivors tarzı ilk seçim)
    this.player.score = 0;
    this.player.magnetRange = Math.round((60 + (tech.magnet || 0) * 10) * (skinCfg.magnetMult || 1.0)); // Başlangıçta dar mıknatıs
    this.player.crystalMultiplier = 1 + (tech.crystalBoost || 0) * 0.08;
    this.player.hasPhoenix = (tech.phoenix || 0) >= 1;
    this.player.phoenixUsed = false;
    this.player.feverCharge = 0;
    this.player.isFever = false;
    this.player.feverTimer = 0;
    this.player.overchargeTimer = 0;
    this.player.vacuumTimer = 0; // Başlangıçta otomatik çekim yok, oyuncu kristallere gitmeli
    this.player.solarShotCount = 0;
    this.player.phaseCooldown = 0;
    this.player.phaseTimer = 0;
    this.player.speedMultiplier = skinCfg.speedMult || 1.0;
    this.player.shootCooldown = 60;
    this.player.isStationary = false;
    this.player.stationaryTimer = 0;
    this.player.upgrades = {
      laser: 1,
      fireRate: 1,
      missiles: 0,
      drones: 0,
      emp: 0,
      shield: 0, // Kalkan geliştirmesiyle veya sandıktan sonradan açılır
      magnet: 1,
      tesla: 0,
      hull: 0,
      wingman: 0
    };
    this.player.wingmen = [];

    // Pilot Seçimi & Yetenek Durumu
    const arch = this.activeArchetype || 'interceptor';
    this.player.fireRateBonus = (arch === 'interceptor') ? 1.15 : 1.0;
    this.player.pilotId = arch;
    const pilotCfg = this.pilots[arch] || this.pilots.interceptor;
    this.player.abilityCooldownMax = pilotCfg.cooldown;
    this.player.abilityCooldown = 0; // Başlangıçta yetenek hazır!
    this.player.titanShieldTimer = 0;
    this.player.blazeDashTimer = 0;

    // Kalıcı Hangar Yoldaş Drone Başlatması
    const eqDroneId = this.equippedDroneId || 'striker';
    const eqDroneLvl = (this.droneLevels && this.droneLevels[eqDroneId]) || 0;
    if (eqDroneLvl > 0 && this.hangarDrones[eqDroneId]) {
      this.companionDrone = {
        id: eqDroneId,
        level: eqDroneLvl,
        cfg: this.hangarDrones[eqDroneId],
        angle: 0,
        shootTimer: 0,
        x: this.player.x - 30,
        y: this.player.y + 15
      };
    } else {
      this.companionDrone = null;
    }

    // Gemi Pasif Yeteneği
    this.player.skinPassive = this.currentSkinId;

    // Mastery Tree Bonuslarını Uygula
    if (this.masteryTree) {
      this.player.magnetRange += this.masteryTree.magnet * 10;
      this.player.maxShield += this.masteryTree.startShield * 8;
      this.player.rerollCount = (this.player.rerollCount || 0) + (this.masteryTree.rerollStart || 0);
    }

    if (arch === 'interceptor') {
      this.player.speedMultiplier = (this.player.speedMultiplier || 1.0) * 1.12;
    } else if (arch === 'dreadnought') {
      this.player.maxShield += 25;
      this.player.maxHp += 15;
      this.player.hp = this.player.maxHp;
    } else if (arch === 'technician') {
      this.player.upgrades.drones = 0;
      this.player.magnetRange += 45;
    } else if (arch === 'blaze') {
      this.player.damageMultiplier = (this.player.damageMultiplier || 1.0) * 1.10;
      this.player.speedMultiplier = (this.player.speedMultiplier || 1.0) * 1.08;
    }

    // Kalıcı Atölye (Tech Tree) Bonusları
    this.player.damageMultiplier = (1 + (tech.damageBoost || 0) * 0.06) * (skinCfg.dmgMult || 1.0);
    this.player.reactorChargeMult = 1 + (tech.reactorCharge || 0) * 0.08;
    this.player.rerollCount = 1 + (tech.rerollCount || 0);

    // Taktiksel Mühimmat & Sarf Malzemesi Takviyelerini Uygula (Pre-Flight Boosters)
    const bOverdrive = parseInt(localStorage.getItem('neon_boost_overdrive') || '0', 10);
    if (bOverdrive > 0) {
      this.player.feverCharge = 50;
      localStorage.setItem('neon_boost_overdrive', (bOverdrive - 1).toString());
      this.particles.spawnFloatingText(this.player.x, this.player.y - 45, '⚡ OVERDRIVE BATARYASI AKTİF!', '#ffd700', 16);
    }
    const bReroll = parseInt(localStorage.getItem('neon_boost_rerolls') || '0', 10);
    if (bReroll > 0) {
      this.player.rerollCount = (this.player.rerollCount || 0) + 2;
      localStorage.setItem('neon_boost_rerolls', (bReroll - 1).toString());
      this.particles.spawnFloatingText(this.player.x, this.player.y - 65, '🎲 +2 TAKTİKSEL REROLL AKTİF!', '#38bdf8', 16);
    }
    const bCrystal = parseInt(localStorage.getItem('neon_boost_crystal') || '0', 10);
    if (bCrystal > 0) {
      this.player.crystalBoosterActive = true;
      localStorage.setItem('neon_boost_crystal', (bCrystal - 1).toString());
      this.particles.spawnFloatingText(this.player.x, this.player.y - 85, '💎 +%50 KRİSTAL RADARI AKTİF!', '#bf5af2', 16);
    }
    const bShield = parseInt(localStorage.getItem('neon_boost_shield') || '0', 10);
    if (bShield > 0) {
      this.player.maxShield += 25;
      this.player.shield = Math.max(this.player.shield, 25);
      localStorage.setItem('neon_boost_shield', (bShield - 1).toString());
      this.particles.spawnFloatingText(this.player.x, this.player.y - 25, '🔰 AĞIR KALKAN AKTİF (+25)!', '#00f0ff', 16);
    }

    // Sinerjiler & Adrenalin
    this.player.synergies = {
      overloadReactor: false,
      apexWiper: false,
      crystalShrapnel: false
    };
    this.player.crystalShrapnelCount = 0;
    this.player.adrenalineTimer = 0;
    this.blazeTrailers = [];

    // Aşırı Yükleme Protokolü (Torment / Heat Mode)
    this.waveSpeedBonus = this.isOverloadProtocol ? 1.25 : 1.0;
    if (this.isOverloadProtocol) {
      this.player.crystalMultiplier *= 1.5;
    }

    if (bossWarningOverlay) bossWarningOverlay.classList.add('hidden');
    this.bossWarningTimer = 0;
    this.player.evolutions = {
      vortexLaser: false,
      clusterMissiles: false,
      ionStorm: false,
      nanoBastion: false,
      cryoBlaster: false,
      orbitalSaws: false,
      supernova: false,
      doomsdayMatrix: false,
      hyperSaber: false,
      voidDrones: false
    };
    this.supernovaOrbs = [];
    this.supernovaWells = [];
    this.supernovaTimer = 0;
    this.matrixChargeTimer = 0;
    this.tetheredEnemies = [];
    this.droneOverdriveTimer = 0;
    this.player.ionStormTimer = 0;
    this.temporalSlowTimer = 0;
    this.currentAnomaly = null;
    this.currentMiniQuest = this.generateMiniQuest();
    this.nextMiniQuestTimer = 8;

    if (ultimateBtnContainer) ultimateBtnContainer.classList.remove('hidden');
    if (btnUltimate) btnUltimate.classList.remove('ready');
    if (merchantModal) merchantModal.classList.add('hidden');

    this.launching = false;
    if (startScreen) startScreen.classList.remove('launching');

    this.playerBullets = [];
    this.homingMissiles = [];
    this.enemies = [];
    this.enemyProjectiles = [];

    // Dengeli Başlangıç Açılış Dalgası (Bedava altın asteroitler yerine normal asteroitler)
    const cx = this.width / 2;
    this.enemies.push(new Enemy(cx - 70, -35, 'asteroid_s', 0.35, 1.0));
    this.enemies.push(new Enemy(cx + 70, -60, 'asteroid_s', 0.35, 1.0));

    this.gems = [];
    this.powerups = [];
    this.luckyChests = [];
    this.pendingChestRewards = [];
    this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 240);
    if (luckyChestModal) luckyChestModal.classList.add('hidden');
    this.telegraphs = [];
    this.activeBeams = [];
    if (this.bonusShield) {
      this.player.shield = this.player.maxShield;
      this.bonusShield = false;
    }
    if (this.bonusOverdrive) {
      this.player.overchargeTimer = 220;
      this.bonusOverdrive = false;
    }
    this.vortices = [];
    this.slowMoTimer = 0;
    this.whiteFlash = 0;
    this.activeEvent = null;
    this.nextEventTime = 45;
    this.currentBoss = null;
    this.introBossDefeated = false;
    this.introBossWarningTriggered = false;
    this.firstBossDefeated = false;
    this.bossDefeatedCount = 0;
    this.bossTimer = 0;
    this.intermissionEvents = {
      goldRush: false,
      merchantVisit: false,
      swarmStrike: false,
      cruiserRaid: false,
      hazardCore: false,
      eliteDuel: false
    };

    if (!this.pilotStats) this.pilotStats = this.loadPilotStats();
    this.pilotStats.totalFlights++;
    this.savePilotStats();

    startScreen.classList.add('hidden');
    gameoverModal.classList.add('hidden');
    levelModal.classList.add('hidden');
    if (levelSelectModal) levelSelectModal.classList.add('hidden');
    if (levelCompleteModal) levelCompleteModal.classList.add('hidden');
    if (luckyChestModal) luckyChestModal.classList.add('hidden');
    if (pauseModal) pauseModal.classList.add('hidden');
    if (hangarModal) hangarModal.classList.add('hidden');
    if (missionsModal) missionsModal.classList.add('hidden');
    if (statsModal) statsModal.classList.add('hidden');
    if (eventBanner) eventBanner.classList.add('hidden');
    hud.classList.remove('hidden');
    bossBarContainer.classList.add('hidden');
    const overloadBadge = document.getElementById('overload-badge');
    if (overloadBadge) {
      if (this.isOverloadProtocol) overloadBadge.classList.remove('hidden');
      else overloadBadge.classList.add('hidden');
    }

    this._hudHpPct = -1;
    this._hudShieldPct = -1;
    this._hudLvl = -1;
    this.updateHUD();
    this.updateStatusBarsOnly();
  }

  updateStatusBarsOnly() {
    const hpPercent = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
    if (Math.abs((this._hudHpPct || 0) - hpPercent) > 0.4) {
      this._hudHpPct = hpPercent;
      hpBarFill.style.width = `${hpPercent}%`;
    }
    const shieldPercent = Math.max(0, (this.player.shield / this.player.maxShield) * 100);
    if (Math.abs((this._hudShieldPct || 0) - shieldPercent) > 0.4) {
      this._hudShieldPct = shieldPercent;
      shieldBarFill.style.width = `${shieldPercent}%`;
    }
  }

  updateHUD() {
    if (this._hudLvl !== this.player.level) {
      this._hudLvl = this.player.level;
      levelBadge.textContent = `LVL ${this.player.level}`;
    }
    if (this._hudScore !== this.player.score) {
      this._hudScore = this.player.score;
      scoreDisplay.textContent = this.player.score.toLocaleString();
    }

    const xpPercent = Math.min(100, (this.player.xp / this.player.nextXp) * 100);
    if (Math.abs((this._hudXpPct || 0) - xpPercent) > 0.5) {
      this._hudXpPct = xpPercent;
      xpBarFill.style.width = `${xpPercent}%`;
    }

    this.updateStatusBarsOnly();

    const sec = SECTORS[this.currentSectorId] || SECTORS.void;
    const waveKey = `${this.currentMode}_${this.wave}_${this.selectedLevel}`;
    if (this._hudWaveKey !== waveKey) {
      this._hudWaveKey = waveKey;
      if (this.currentMode === 'storm') {
        waveDisplay.textContent = `FIRTINA D.${this.wave} • ${sec.subtitle}`;
        if (levelHudDisplay) levelHudDisplay.textContent = 'FIRTINA';
      } else {
        waveDisplay.textContent = `BÖLÜM ${this.selectedLevel} • ${sec.subtitle}`;
        if (levelHudDisplay) levelHudDisplay.textContent = `B.${this.selectedLevel}`;
      }
      waveDisplay.style.borderColor = sec.color;
      waveDisplay.style.color = sec.color;
    }

    const mins = Math.floor(this.gameTime / 60).toString().padStart(2, '0');
    const secs = (this.gameTime % 60).toString().padStart(2, '0');
    const timeStr = `${mins}:${secs}`;
    if (this._hudTimeStr !== timeStr) {
      this._hudTimeStr = timeStr;
      timerDisplay.textContent = timeStr;
    }

    if (comboDisplay) {
      if (this.comboCount > 1) {
        comboDisplay.classList.remove('hidden');
        if (this._hudCombo !== this.comboCount) {
          this._hudCombo = this.comboCount;
          comboDisplay.textContent = `${this.comboCount}x`;
        }
      } else if (!comboDisplay.classList.contains('hidden')) {
        comboDisplay.classList.add('hidden');
        this._hudCombo = 0;
      }
    }

    if (this.currentBoss && !this.currentBoss.toRemove) {
      bossBarContainer.classList.remove('hidden');
      const bossPercent = Math.max(0, (this.currentBoss.hp / this.currentBoss.maxHp) * 100);
      bossBarFill.style.width = `${bossPercent}%`;
      const titleEl = bossBarContainer.querySelector('.boss-title');
      const bInfo = Enemy.getBossInfo(this.currentBoss.type);
      if (this.currentBoss.isEnraged) {
        bossBarFill.style.background = 'linear-gradient(90deg, #ff9100, #ff1744)';
        bossBarFill.style.boxShadow = 'none';
        if (titleEl) titleEl.textContent = `[!] ${bInfo.name} [ÖFKE MODU] [!]`;
      } else {
        bossBarFill.style.background = `linear-gradient(90deg, ${bInfo.color}, #bf5af2)`;
        bossBarFill.style.boxShadow = 'none';
        if (titleEl) titleEl.textContent = `[!] ${bInfo.name} [!]`;
      }
    } else {
      bossBarContainer.classList.add('hidden');
    }

    // Aktif Nihai Güç (Ultimate) Butonu Şarj Göstergesi
    if (ultimateChargeFill) {
      const chargePct = Math.min(100, this.player.feverCharge || 0);
      if (Math.abs((this._hudChargePct || 0) - chargePct) > 0.5) {
        this._hudChargePct = chargePct;
        ultimateChargeFill.style.height = `${chargePct}%`;
      }
      if (chargePct >= 100 && !this.player.isFever) {
        if (btnUltimate && !btnUltimate.classList.contains('ready')) {
          btnUltimate.classList.add('ready');
          sounds.playUltimateReady();
          vibrate.success();
          if (ultimateLabel) ultimateLabel.textContent = 'HAZIR!';
        }
      } else if (btnUltimate && btnUltimate.classList.contains('ready') && !this.player.isFever) {
        btnUltimate.classList.remove('ready');
        if (ultimateLabel) ultimateLabel.textContent = 'ULTIMATE';
      }
    }

    // Aktif Pilot Yeteneği Butonu & Bekleme Süresi Göstergesi
    if (btnAbility) {
      const pilotId = this.player.pilotId || this.activeArchetype || 'interceptor';
      if (pilotId === 'interceptor') {
        btnAbility.classList.add('hidden');
      } else if (abilityCooldownFill) {
        btnAbility.classList.remove('hidden');
        const cd = Math.max(0, this.player.abilityCooldown || 0);
        const maxCd = this.player.abilityCooldownMax || 1500;
        const cdPct = (cd / maxCd) * 100;
        abilityCooldownFill.style.height = `${cdPct}%`;

        const pCfg = this.pilots[pilotId] || this.pilots.interceptor;

        if (cd <= 0) {
          if (!btnAbility.classList.contains('ready')) {
            btnAbility.classList.add('ready');
            sounds.playLaser();
            vibrate.light();
          }
          if (abilityLabel) abilityLabel.textContent = pCfg.name;
        } else {
          if (btnAbility.classList.contains('ready')) {
            btnAbility.classList.remove('ready');
          }
          if (abilityLabel) abilityLabel.textContent = `${Math.ceil(cd / 60)}s`;
        }
      }
    }
  }

  getUpgradeSvg(id) {
    const P = 'viewBox="0 0 32 32" width="100%" height="100%" style="shape-rendering:crispEdges;display:block;"';
    switch (id) {
      case 'laser':
        // Plazma Lazeri: İkiz lazer emitörü, mavi/cyan enerji çekirdeği ve odaklama kristalleri
        return `<svg ${P}>
          <rect width="32" height="32" fill="#070b19"/>
          <!-- Emitör gövdesi -->
          <rect x="8" y="14" width="6" height="15" fill="#1e293b"/>
          <rect x="18" y="14" width="6" height="15" fill="#1e293b"/>
          <rect x="10" y="16" width="2" height="11" fill="#334155"/>
          <rect x="20" y="16" width="2" height="11" fill="#334155"/>
          <rect x="13" y="21" width="6" height="8" fill="#0f172a"/>
          <!-- Güç kabloları -->
          <rect x="7" y="23" width="18" height="2" fill="#0284c7"/>
          <!-- Plazma Odaklama Ağzı -->
          <rect x="9" y="10" width="4" height="4" fill="#0ea5e9"/>
          <rect x="19" y="10" width="4" height="4" fill="#0ea5e9"/>
          <!-- Lazer Işınları -->
          <rect x="10" y="2" width="2" height="8" fill="#38bdf8"/>
          <rect x="11" y="1" width="1" height="9" fill="#ffffff"/>
          <rect x="20" y="2" width="2" height="8" fill="#38bdf8"/>
          <rect x="21" y="1" width="1" height="9" fill="#ffffff"/>
          <!-- Işık Saçılması / Flare -->
          <rect x="9" y="1" width="4" height="2" fill="#bae6fd"/>
          <rect x="19" y="1" width="4" height="2" fill="#bae6fd"/>
        </svg>`;

      case 'fireRate':
        // Hızlandırıcı / Aşırı Yükleme: Retro turbo takometre & şimşek aşırı voltajı
        return `<svg ${P}>
          <rect width="32" height="32" fill="#160e03"/>
          <!-- Dış turbo çemberi -->
          <rect x="8" y="4" width="16" height="2" fill="#d97706"/>
          <rect x="8" y="26" width="16" height="2" fill="#d97706"/>
          <rect x="4" y="8" width="2" height="16" fill="#d97706"/>
          <rect x="26" y="8" width="2" height="16" fill="#d97706"/>
          <rect x="6" y="6" width="2" height="2" fill="#f59e0b"/>
          <rect x="24" y="6" width="2" height="2" fill="#f59e0b"/>
          <rect x="6" y="24" width="2" height="2" fill="#f59e0b"/>
          <rect x="24" y="24" width="2" height="2" fill="#f59e0b"/>
          <!-- İç zemin -->
          <rect x="8" y="8" width="16" height="16" fill="#291603"/>
          <!-- Hız Şimşeği / Volt -->
          <polygon points="18,5 11,16 16,16 13,27 23,14 17,14" fill="#fbbf24"/>
          <polygon points="17,8 13,15 16,15 14,23 20,15 17,15" fill="#ffffff"/>
        </svg>`;

      case 'missiles':
        // Güdümlü Mikro-Füze: Kırmızı savaş başlığı, kanatlar ve turbo itki dumanı
        return `<svg ${P}>
          <rect width="32" height="32" fill="#1c0a04"/>
          <!-- Hedefleme radarı kılavuzları -->
          <rect x="15" y="2" width="2" height="4" fill="#ef4444"/>
          <rect x="15" y="26" width="2" height="4" fill="#ef4444"/>
          <rect x="2" y="15" width="4" height="2" fill="#ef4444"/>
          <rect x="26" y="15" width="4" height="2" fill="#ef4444"/>
          <!-- Füze gövdesi -->
          <rect x="14" y="5" width="4" height="3" fill="#dc2626"/>
          <rect x="15" y="4" width="2" height="1" fill="#f87171"/>
          <rect x="13" y="8" width="6" height="12" fill="#cbd5e1"/>
          <rect x="15" y="8" width="2" height="12" fill="#f8fafc"/>
          <!-- Kanatçıklar -->
          <rect x="10" y="16" width="3" height="5" fill="#ea580c"/>
          <rect x="19" y="16" width="3" height="5" fill="#ea580c"/>
          <rect x="9" y="19" width="1" height="3" fill="#c2410c"/>
          <rect x="22" y="19" width="1" height="3" fill="#c2410c"/>
          <!-- Alev / İtki Püskürmesi -->
          <rect x="14" y="20" width="4" height="3" fill="#f97316"/>
          <rect x="15" y="23" width="2" height="4" fill="#fde047"/>
          <rect x="15" y="27" width="2" height="2" fill="#ffffff"/>
        </svg>`;

      case 'tesla':
        // Tesla Bobini: Yüksek voltaj kulesi ve zikzak elektrik boşalması
        return `<svg ${P}>
          <rect width="32" height="32" fill="#04121e"/>
          <!-- Bobin tabanı ve kafesi -->
          <rect x="9" y="24" width="14" height="5" fill="#1e293b"/>
          <rect x="11" y="22" width="10" height="2" fill="#334155"/>
          <rect x="13" y="13" width="6" height="9" fill="#0284c7"/>
          <rect x="12" y="14" width="8" height="2" fill="#38bdf8"/>
          <rect x="12" y="17" width="8" height="2" fill="#38bdf8"/>
          <rect x="12" y="20" width="8" height="2" fill="#38bdf8"/>
          <!-- Tepe Küresi (Toroid) -->
          <rect x="10" y="8" width="12" height="5" fill="#0ea5e9"/>
          <rect x="12" y="7" width="8" height="7" fill="#38bdf8"/>
          <rect x="14" y="9" width="4" height="3" fill="#ffffff"/>
          <!-- Elektrik Arkları / Kıvılcımlar -->
          <rect x="5" y="5" width="4" height="2" fill="#7dd3fc"/>
          <rect x="7" y="7" width="3" height="3" fill="#38bdf8"/>
          <rect x="23" y="5" width="4" height="2" fill="#7dd3fc"/>
          <rect x="22" y="7" width="3" height="3" fill="#38bdf8"/>
          <rect x="3" y="11" width="3" height="2" fill="#bae6fd"/>
          <rect x="26" y="11" width="3" height="2" fill="#bae6fd"/>
        </svg>`;

      case 'drones':
        // Koruyucu Savunma Dronu: Dört yönlü iticili minyatür askeri uydu
        return `<svg ${P}>
          <rect width="32" height="32" fill="#03160e"/>
          <!-- Yörünge izi -->
          <rect x="4" y="15" width="24" height="2" fill="#064e3b"/>
          <!-- Drone Gövdesi -->
          <rect x="11" y="11" width="10" height="10" fill="#0f172a"/>
          <rect x="12" y="12" width="8" height="8" fill="#059669"/>
          <!-- Sensör Gözü -->
          <rect x="14" y="14" width="4" height="4" fill="#34d399"/>
          <rect x="15" y="15" width="2" height="2" fill="#ffffff"/>
          <!-- Güneş Panelleri / Kanatlar -->
          <rect x="4" y="13" width="6" height="6" fill="#10b981"/>
          <rect x="5" y="14" width="4" height="4" fill="#a7f3d0"/>
          <rect x="22" y="13" width="6" height="6" fill="#10b981"/>
          <rect x="23" y="14" width="4" height="4" fill="#a7f3d0"/>
          <!-- Lazer Koruma Emitörü -->
          <rect x="15" y="8" width="2" height="3" fill="#6ee7b7"/>
          <rect x="15" y="21" width="2" height="3" fill="#6ee7b7"/>
        </svg>`;

      case 'emp':
        // EMP Şok Bombası: Neon patlama halkası ve iyon çekirdeği
        return `<svg ${P}>
          <rect width="32" height="32" fill="#1a0410"/>
          <!-- Dış şok dalga pikselleri -->
          <rect x="14" y="2" width="4" height="2" fill="#e11d48"/>
          <rect x="14" y="28" width="4" height="2" fill="#e11d48"/>
          <rect x="2" y="14" width="2" height="4" fill="#e11d48"/>
          <rect x="28" y="14" width="2" height="4" fill="#e11d48"/>
          <rect x="6" y="6" width="3" height="3" fill="#f43f5e"/>
          <rect x="23" y="6" width="3" height="3" fill="#f43f5e"/>
          <rect x="6" y="23" width="3" height="3" fill="#f43f5e"/>
          <rect x="23" y="23" width="3" height="3" fill="#f43f5e"/>
          <!-- Reaktör Çekirdeği -->
          <rect x="10" y="10" width="12" height="12" fill="#881337"/>
          <rect x="12" y="12" width="8" height="8" fill="#fb7185"/>
          <rect x="14" y="14" width="4" height="4" fill="#ffffff"/>
        </svg>`;

      case 'shield':
        // Enerji Kalkanı: Neon mavi siber kalkan amblemi ve parıltı
        return `<svg ${P}>
          <rect width="32" height="32" fill="#03121c"/>
          <!-- Kalkan Silueti -->
          <rect x="8" y="5" width="16" height="3" fill="#0284c7"/>
          <rect x="6" y="8" width="20" height="10" fill="#0369a1"/>
          <rect x="8" y="18" width="16" height="4" fill="#0284c7"/>
          <rect x="10" y="22" width="12" height="3" fill="#0284c7"/>
          <rect x="12" y="25" width="8" height="3" fill="#0284c7"/>
          <rect x="14" y="28" width="4" height="2" fill="#0284c7"/>
          <!-- Parlayan İç Katman -->
          <rect x="10" y="8" width="12" height="8" fill="#38bdf8"/>
          <rect x="12" y="16" width="8" height="4" fill="#38bdf8"/>
          <rect x="14" y="20" width="4" height="3" fill="#38bdf8"/>
          <!-- Merkez Güç Kristali -->
          <rect x="14" y="10" width="4" height="5" fill="#ffffff"/>
        </svg>`;

      case 'magnet':
        // Kuantum Çekici / Çekim Alanı: Kırmızı-mavi kutuplu retro mıknatıs & yerçekimi dalgaları
        return `<svg ${P}>
          <rect width="32" height="32" fill="#13081e"/>
          <!-- U-Mıknatıs Gövdesi -->
          <rect x="7" y="6" width="5" height="15" fill="#7e22ce"/>
          <rect x="20" y="6" width="5" height="15" fill="#7e22ce"/>
          <rect x="7" y="20" width="18" height="6" fill="#6b21a8"/>
          <rect x="12" y="16" width="8" height="6" fill="#13081e"/>
          <!-- Kutuplar: Kuzey (Kırmızı) ve Güney (Mavi) -->
          <rect x="7" y="5" width="5" height="5" fill="#ef4444"/>
          <rect x="20" y="5" width="5" height="5" fill="#38bdf8"/>
          <!-- Manyetik Çekim Kristalleri -->
          <rect x="15" y="7" width="2" height="2" fill="#a855f7"/>
          <rect x="14" y="10" width="4" height="4" fill="#c084fc"/>
          <rect x="15" y="11" width="2" height="2" fill="#ffffff"/>
        </svg>`;

      case 'hull':
        // Nanit Gövde: Yeşil tıbbi zırh plakası ve tamir nanobotları
        return `<svg ${P}>
          <rect width="32" height="32" fill="#031a10"/>
          <!-- Zırh Plakası -->
          <rect x="5" y="5" width="22" height="22" fill="#064e3b"/>
          <rect x="6" y="6" width="20" height="20" fill="#047857"/>
          <!-- Köşe Takviyeleri (Civata/Perçin) -->
          <rect x="7" y="7" width="2" height="2" fill="#a7f3d0"/>
          <rect x="23" y="7" width="2" height="2" fill="#a7f3d0"/>
          <rect x="7" y="23" width="2" height="2" fill="#a7f3d0"/>
          <rect x="23" y="23" width="2" height="2" fill="#a7f3d0"/>
          <!-- Nanit Onarım Artısı (Cross) -->
          <rect x="13" y="9" width="6" height="14" fill="#10b981"/>
          <rect x="9" y="13" width="14" height="6" fill="#10b981"/>
          <rect x="14" y="10" width="4" height="12" fill="#ffffff"/>
          <rect x="10" y="14" width="12" height="4" fill="#ffffff"/>
        </svg>`;

      case 'wingman':
        // Mikro Klon (Pet / Wingman): Yanımızda uçan minyatür müttefik savaş uçağı
        return `<svg ${P}>
          <rect width="32" height="32" fill="#04121f"/>
          <!-- Büyük Ana Uçak Silueti (Arka plan / Sol taraf) -->
          <polygon points="12,5 17,17 14,24 8,24 5,17" fill="#0369a1"/>
          <!-- Parlayan Minyatür Klon Pet Uçak (Sağ / Yan Taraf) -->
          <polygon points="22,7 26,17 24,25 18,25 16,17" fill="#0284c7"/>
          <polygon points="22,10 25,18 22,23 19,18" fill="#00f0ff"/>
          <!-- Pet Uçak Kokpit -->
          <rect x="21" y="13" width="2" height="4" fill="#ffffff"/>
          <!-- Pet İtki Plazma Alevi -->
          <polygon points="19,25 22,29 24,25" fill="#38bdf8"/>
          <!-- İleri Çıkan Plazma Lazer Işını -->
          <rect x="21" y="2" width="2" height="4" fill="#fef08a"/>
          <circle cx="22" cy="1" r="1.5" fill="#ffffff"/>
        </svg>`;

      case 'evo_vortex':
      case 'vortex':
        // Vortex Karadelik Lazeri: Mor girdap & kara delik ufku
        return `<svg ${P}>
          <rect width="32" height="32" fill="#15021e"/>
          <!-- Girdap kolları -->
          <rect x="10" y="4" width="12" height="2" fill="#d946ef"/>
          <rect x="22" y="6" width="4" height="6" fill="#d946ef"/>
          <rect x="26" y="12" width="2" height="8" fill="#c026d3"/>
          <rect x="22" y="20" width="4" height="6" fill="#d946ef"/>
          <rect x="10" y="26" width="12" height="2" fill="#d946ef"/>
          <rect x="6" y="20" width="4" height="6" fill="#c026d3"/>
          <rect x="4" y="12" width="2" height="8" fill="#d946ef"/>
          <rect x="6" y="6" width="4" height="6" fill="#c026d3"/>
          <!-- Olay Ufku & Karadelik Çekirdeği -->
          <rect x="10" y="10" width="12" height="12" fill="#fae8ff"/>
          <rect x="11" y="11" width="10" height="10" fill="#86198f"/>
          <rect x="13" y="13" width="6" height="6" fill="#000000"/>
        </svg>`;

      case 'evo_cluster':
      case 'cluster':
        // Nükleer Sürü Füzesi: Altın/Sarı mikro savaş başlıkları kümesi
        return `<svg ${P}>
          <rect width="32" height="32" fill="#1f1002"/>
          <!-- 3x Mini Nükleer Savaş Başlığı -->
          <!-- Orta füze -->
          <rect x="14" y="3" width="4" height="4" fill="#eab308"/>
          <rect x="15" y="2" width="2" height="1" fill="#ffffff"/>
          <rect x="13" y="7" width="6" height="10" fill="#78350f"/>
          <!-- Sol füze -->
          <rect x="6" y="9" width="4" height="4" fill="#f59e0b"/>
          <rect x="5" y="13" width="6" height="9" fill="#78350f"/>
          <!-- Sağ füze -->
          <rect x="22" y="9" width="4" height="4" fill="#f59e0b"/>
          <rect x="21" y="13" width="6" height="9" fill="#78350f"/>
          <!-- Atomik İkaz Deseni -->
          <rect x="14" y="9" width="4" height="2" fill="#000000"/>
          <rect x="14" y="12" width="4" height="2" fill="#000000"/>
          <!-- Roket Alevleri -->
          <rect x="7" y="22" width="2" height="5" fill="#f97316"/>
          <rect x="15" y="17" width="2" height="8" fill="#ef4444"/>
          <rect x="23" y="22" width="2" height="5" fill="#f97316"/>
        </svg>`;

      case 'evo_ion_storm':
      case 'ion_storm':
        // Tesla İyon Fırtınası: Şimşekli gök gürültüsü bulutu ve mavi arklar
        return `<svg ${P}>
          <rect width="32" height="32" fill="#051424"/>
          <!-- İyonlaşmış Fırtına Bulutu -->
          <rect x="8" y="7" width="16" height="7" fill="#1e293b"/>
          <rect x="6" y="9" width="20" height="7" fill="#334155"/>
          <rect x="9" y="6" width="7" height="3" fill="#64748b"/>
          <rect x="17" y="5" width="6" height="4" fill="#94a3b8"/>
          <!-- Çift İyon Yıldırımı -->
          <polygon points="14,13 10,21 15,21 12,28 19,18 15,18" fill="#38bdf8"/>
          <polygon points="21,14 18,20 22,20 19,27 25,18 22,18" fill="#fde047"/>
          <rect x="13" y="15" width="1" height="4" fill="#ffffff"/>
        </svg>`;

      case 'evo_bastion':
      case 'evo_nano_bastion':
      case 'bastion':
        // Orbital Bastion Halkası: Dörtlü kalkan kalesi ve zümrüt bariyer
        return `<svg ${P}>
          <rect width="32" height="32" fill="#021a14"/>
          <!-- Bastion Enerji Halkası -->
          <rect x="8" y="4" width="16" height="2" fill="#05ffa1"/>
          <rect x="8" y="26" width="16" height="2" fill="#05ffa1"/>
          <rect x="4" y="8" width="2" height="16" fill="#05ffa1"/>
          <rect x="26" y="8" width="2" height="16" fill="#05ffa1"/>
          <!-- 4 Köşe Uydu Kaleleri -->
          <rect x="5" y="5" width="4" height="4" fill="#10b981"/>
          <rect x="23" y="5" width="4" height="4" fill="#10b981"/>
          <rect x="5" y="23" width="4" height="4" fill="#10b981"/>
          <rect x="23" y="23" width="4" height="4" fill="#10b981"/>
          <!-- Merkez Bastion Çekirdeği -->
          <rect x="12" y="12" width="8" height="8" fill="#0f172a"/>
          <rect x="13" y="13" width="6" height="6" fill="#34d399"/>
          <rect x="15" y="15" width="2" height="2" fill="#ffffff"/>
        </svg>`;

      case 'evo_cryo':
      case 'cryo':
        // Mutlak Sıfır Kriyo-Blaster: Buz kristali / kar tanesi buz silahı
        return `<svg ${P}>
          <rect width="32" height="32" fill="#031624"/>
          <!-- Kriyo Kristali Kollar (Kar Tanesi) -->
          <rect x="15" y="4" width="2" height="24" fill="#38bdf8"/>
          <rect x="4" y="15" width="24" height="2" fill="#38bdf8"/>
          <rect x="9" y="9" width="3" height="3" fill="#0ea5e9"/>
          <rect x="20" y="9" width="3" height="3" fill="#0ea5e9"/>
          <rect x="9" y="20" width="3" height="3" fill="#0ea5e9"/>
          <rect x="20" y="20" width="3" height="3" fill="#0ea5e9"/>
          <!-- Buz Çekirdeği -->
          <rect x="13" y="13" width="6" height="6" fill="#e0f2fe"/>
          <rect x="14" y="14" width="4" height="4" fill="#ffffff"/>
        </svg>`;

      case 'evo_saws':
      case 'saws':
        // Plazma Testereleri: Dönen dişli turuncu/kırmızı testere bıçağı
        return `<svg ${P}>
          <rect width="32" height="32" fill="#200a02"/>
          <!-- Dış Testere Dişleri -->
          <polygon points="16,3 19,8 24,5 23,10 28,10 25,14 29,17 24,19 27,24 22,23 22,28 18,25 15,29 14,24 9,27 10,22 5,22 8,18 4,15 9,13 6,8 11,9 11,4 15,7" fill="#ea580c"/>
          <!-- İç Plaka -->
          <circle cx="16" cy="16" r="7" fill="#f97316"/>
          <!-- Merkez Yuva -->
          <circle cx="16" cy="16" r="3" fill="#ffedd5"/>
        </svg>`;

      case 'evo_supernova':
      case 'supernova':
        // Süpernova Çekirdeği: Kızıl dev patlaması, alev tacı & pulsasyon
        return `<svg ${P}>
          <rect width="32" height="32" fill="#240502"/>
          <!-- Taç Işınları -->
          <rect x="15" y="1" width="2" height="6" fill="#f59e0b"/>
          <rect x="15" y="25" width="2" height="6" fill="#f59e0b"/>
          <rect x="1" y="15" width="6" height="2" fill="#f59e0b"/>
          <rect x="25" y="15" width="6" height="2" fill="#f59e0b"/>
          <rect x="5" y="5" width="4" height="4" fill="#ea580c"/>
          <rect x="23" y="5" width="4" height="4" fill="#ea580c"/>
          <rect x="5" y="23" width="4" height="4" fill="#ea580c"/>
          <rect x="23" y="23" width="4" height="4" fill="#ea580c"/>
          <!-- Süpernova Yıldız Çekirdeği -->
          <rect x="9" y="9" width="14" height="14" fill="#dc2626"/>
          <rect x="11" y="11" width="10" height="10" fill="#f97316"/>
          <rect x="13" y="13" width="6" height="6" fill="#fef08a"/>
          <rect x="15" y="15" width="2" height="2" fill="#ffffff"/>
        </svg>`;

      case 'evo_matrix':
      case 'matrix':
        // Kıyamet Tesla Matrisi: Mor piramit & siber rezonans üçgeni
        return `<svg ${P}>
          <rect width="32" height="32" fill="#180424"/>
          <!-- Dış Matris Hatları -->
          <polygon points="16,4 28,26 4,26" fill="none" stroke="#a855f7" stroke-width="2"/>
          <!-- İç Matris Kristali -->
          <polygon points="16,9 25,24 7,24" fill="#581c87"/>
          <!-- Düğümler (Nodes) -->
          <rect x="14" y="4" width="4" height="4" fill="#e9d5ff"/>
          <rect x="2" y="24" width="4" height="4" fill="#e9d5ff"/>
          <rect x="26" y="24" width="4" height="4" fill="#e9d5ff"/>
          <!-- Kıyamet Gözü / Ark -->
          <rect x="14" y="16" width="4" height="4" fill="#38bdf8"/>
          <rect x="15" y="17" width="2" height="2" fill="#ffffff"/>
        </svg>`;

      case 'evo_hyper_plasma':
      case 'evo_hyper_saber':
      case 'hyper_plasma':
        // Aşırı Yüklemeli Plazma: Yeşil hiper plazma enerjisi ve çift namlu
        return `<svg ${P}>
          <rect width="32" height="32" fill="#021a10"/>
          <!-- Hiper Silah Kasası -->
          <rect x="10" y="16" width="12" height="12" fill="#0f172a"/>
          <!-- Çift Hiper Namlu -->
          <rect x="9" y="8" width="4" height="10" fill="#059669"/>
          <rect x="19" y="8" width="4" height="10" fill="#059669"/>
          <!-- Parlayan Yeşil Plazma Alevi -->
          <rect x="9" y="2" width="4" height="6" fill="#10b981"/>
          <rect x="10" y="1" width="2" height="7" fill="#6ee7b7"/>
          <rect x="19" y="2" width="4" height="6" fill="#10b981"/>
          <rect x="20" y="1" width="2" height="7" fill="#6ee7b7"/>
          <!-- Aşırı Yükleme Reaktörü -->
          <rect x="13" y="19" width="6" height="6" fill="#34d399"/>
          <rect x="15" y="21" width="2" height="2" fill="#ffffff"/>
        </svg>`;

      case 'evo_void_drones':
      case 'void_drones':
        // Vakum Avcı Dronları: Altın rengi harvester ve karadelik emicisi
        return `<svg ${P}>
          <rect width="32" height="32" fill="#1c1602"/>
          <!-- Altın Yörünge -->
          <circle cx="16" cy="16" r="11" fill="none" stroke="#ca8a04" stroke-width="2"/>
          <!-- 3 Harvester Dronu -->
          <rect x="14" y="2" width="4" height="4" fill="#eab308"/>
          <rect x="4" y="20" width="4" height="4" fill="#eab308"/>
          <rect x="24" y="20" width="4" height="4" fill="#eab308"/>
          <!-- Vakum Çekirdeği -->
          <rect x="13" y="13" width="6" height="6" fill="#000000"/>
          <rect x="14" y="14" width="4" height="4" fill="#a855f7"/>
          <rect x="15" y="15" width="2" height="2" fill="#ffffff"/>
        </svg>`;

      case 'overload_reactor':
        // Aşırı Yükleme Reaktörü (Sinerji)
        return `<svg ${P}>
          <rect width="32" height="32" fill="#190426"/>
          <rect x="6" y="6" width="20" height="20" fill="#3b0764"/>
          <rect x="8" y="8" width="16" height="16" fill="#7e22ce"/>
          <rect x="11" y="11" width="10" height="10" fill="#a855f7"/>
          <rect x="13" y="13" width="6" height="6" fill="#ffffff"/>
          <rect x="15" y="2" width="2" height="4" fill="#c084fc"/>
          <rect x="15" y="26" width="2" height="4" fill="#c084fc"/>
          <rect x="2" y="15" width="4" height="2" fill="#c084fc"/>
          <rect x="26" y="15" width="4" height="2" fill="#c084fc"/>
        </svg>`;

      case 'apex_overdrive':
      case 'apex_wiper':
        // Apex Overdrive (Sinerji)
        return `<svg ${P}>
          <rect width="32" height="32" fill="#240410"/>
          <polygon points="16,3 27,27 5,27" fill="#be123c"/>
          <polygon points="16,8 24,24 8,24" fill="#f43f5e"/>
          <polygon points="16,13 21,22 11,22" fill="#ffffff"/>
        </svg>`;

      case 'crystal_shrapnel':
        // Kristal Şarapneli (Sinerji)
        return `<svg ${P}>
          <rect width="32" height="32" fill="#021a14"/>
          <polygon points="16,4 26,12 21,27 11,27 6,12" fill="#059669"/>
          <polygon points="16,8 23,14 19,24 13,24 9,14" fill="#34d399"/>
          <rect x="14" y="13" width="4" height="6" fill="#ffffff"/>
        </svg>`;

      case 'bonus_heal':
        return `<svg ${P}>
          <rect width="32" height="32" fill="#031a10"/>
          <rect x="6" y="6" width="20" height="20" rx="3" fill="#047857"/>
          <rect x="13" y="9" width="6" height="14" fill="#ffffff"/>
          <rect x="9" y="13" width="14" height="6" fill="#ffffff"/>
        </svg>`;

      case 'bonus_crystals':
        return `<svg ${P}>
          <rect width="32" height="32" fill="#1c1602"/>
          <polygon points="16,4 27,13 22,27 10,27 5,13" fill="#eab308"/>
          <polygon points="16,8 23,15 19,24 13,24 9,15" fill="#fef08a"/>
          <circle cx="16" cy="16" r="3" fill="#ffffff"/>
        </svg>`;

      case 'bonus_overdrive':
        return `<svg ${P}>
          <rect width="32" height="32" fill="#180424"/>
          <polygon points="16,3 20,12 30,12 22,18 25,28 16,22 7,28 10,18 2,12 12,12" fill="#a855f7"/>
          <polygon points="16,7 19,14 26,14 20,19 22,25 16,21 10,25 12,19 6,14 13,14" fill="#ffffff"/>
        </svg>`;

      default:
        return `<svg ${P}><rect width="32" height="32" fill="#0f172a"/><circle cx="16" cy="16" r="8" fill="#00f0ff"/></svg>`;
    }
  }

  triggerLevelUp() {
    this.state = 'LEVEL_UP';
    sounds.playLevelUp();
    vibrate.success();

    // Evrim seçeneklerini kontrol et
    const evolutions = [];
    if (this.player.upgrades.laser >= 5 && this.player.upgrades.magnet >= 1 && !this.player.evolutions.vortexLaser) {
      evolutions.push({
        id: 'evo_vortex',
        isEvolution: true,
        name: 'VORTEX KARADELİK LAZERİ',
        stat: 'GİRDAP DELME',
        color: '#d946ef',
        desc: 'Mermiler tüm hedefleri delip geçer ve çarptığı yerde kristalleri çeken yerçekimi girdabı açar!'
      });
    }
    if (this.player.upgrades.missiles >= 4 && this.player.upgrades.emp >= 1 && !this.player.evolutions.clusterMissiles) {
      evolutions.push({
        id: 'evo_cluster',
        isEvolution: true,
        name: 'NÜKLEER SÜRÜ FÜZESİ',
        stat: 'EMP MİKRO-NUKE',
        color: '#ffbe0b',
        desc: 'Füzeler çarptığında mini EMP nükleer şokuyla düşman mermilerini siler ve devasa alan hasarı saçar!'
      });
    }
    if ((this.player.upgrades.tesla || 0) >= 4 && this.player.upgrades.fireRate >= 4 && !this.player.evolutions.ionStorm) {
      evolutions.push({
        id: 'evo_ion_storm',
        isEvolution: true,
        name: 'TESLA İYON FIRTINASI',
        stat: 'KÜRESEL ŞOK',
        color: '#38bdf8',
        desc: 'Her 3.5 saniyede gökyüzünden kozmik şimşekler boşalarak 5-8 düşmanı aynı anda çarpar ve sersemletir!'
      });
    }
    if (this.player.upgrades.shield >= 4 && (this.player.upgrades.drones || 0) >= 3 && !this.player.evolutions.nanoBastion) {
      evolutions.push({
        id: 'evo_nano_bastion',
        isEvolution: true,
        name: 'ORBİTAL BASTİON HALKASI',
        stat: 'PLAZMA SİPERİ',
        color: '#05ffa1',
        desc: 'Kalkan ve dronelar birleşerek düşman mermilerini eriten ve temas eden düşmanları eriten Plazma Bariyeri kurar!'
      });
    }
    if (this.player.upgrades.laser >= 4 && this.player.upgrades.shield >= 2 && !this.player.evolutions.cryoBlaster) {
      evolutions.push({
        id: 'evo_cryo',
        isEvolution: true,
        name: 'KRİYO-BUZ FIRTINASI',
        stat: 'MUTLAK DONDURMA',
        color: '#00f0ff',
        desc: 'Lazerler hedefleri dondurarak yavaşlatır; donan düşman patladığında tüm ekrana buz şarapnelleri saçar!'
      });
    }
    if ((this.player.upgrades.drones || 0) >= 2 && this.player.upgrades.fireRate >= 3 && !this.player.evolutions.orbitalSaws) {
      evolutions.push({
        id: 'evo_saws',
        isEvolution: true,
        name: 'PLAZMA TESTERELERİ',
        stat: 'DÖNEN BİÇİCİ',
        color: '#ff5500',
        desc: 'Gemi etrafında yüksek hızda dönen neon plazma testereleri oluşur; temas eden tüm hedefleri anında biçer!'
      });
    }
    if (this.player.upgrades.missiles >= 4 && (this.player.upgrades.tesla || 0) >= 3 && !this.player.evolutions.supernova) {
      evolutions.push({
        id: 'evo_supernova',
        isEvolution: true,
        name: 'SÜPERNOVA ÇEKİRDEĞİ',
        stat: 'PLAZMA HAVUZU',
        color: '#ff3d00',
        desc: 'Füzeler yerine kozmik nükleer plazma küresi fırlatır; çarptığı alanda tüm mermileri buharlaştıran devasa süpernova girdabı açar!'
      });
    }
    if ((this.player.upgrades.tesla || 0) >= 4 && this.player.upgrades.emp >= 3 && !this.player.evolutions.doomsdayMatrix) {
      evolutions.push({
        id: 'evo_matrix',
        isEvolution: true,
        name: 'KIYAMET TESLA MATRİSİ',
        stat: 'AŞIRI VOLTAJ',
        color: '#bf5af2',
        desc: 'Gemi, dronlar ve düşmanlar arasında sürekli bir yıldırım ağı örer; 4 saniyede bir tüm zincirlere dev EMP şoku verir!'
      });
    }
    if ((this.player.upgrades.hull || 0) >= 3 && this.player.upgrades.fireRate >= 4 && !this.player.evolutions.hyperPlasma) {
      evolutions.push({
        id: 'evo_hyper_plasma',
        isEvolution: true,
        name: 'AŞIRI YÜKLEMELİ PLAZMA',
        stat: 'DELİCİ PLAZMA',
        color: '#05ffa1',
        desc: 'Tüm plazma mermileri hedefleri delip geçer ve isabet ettiği noktalarda yıkıcı elektrik plazma şoku patlatır!'
      });
    }
    if ((this.player.upgrades.drones || 0) >= 3 && this.player.upgrades.magnet >= 3 && !this.player.evolutions.voidDrones) {
      evolutions.push({
        id: 'evo_void_drones',
        isEvolution: true,
        name: 'VAKUM AVCI DRONLARI',
        stat: 'OTOMATİK HASAT',
        color: '#ffd700',
        desc: 'Dronlar tüm haritadaki kristalleri otomatik olarak toplayıp reaktöre taşır; topladıkları her kristalle çift namlulu seri lazer saçar!'
      });
    }

    const availableUpgrades = [
      {
        id: 'laser',
        name: t('upg_laser_name'),
        stat: this.player.upgrades.laser === 1 ? '+%25 HASAR' : (this.player.upgrades.laser === 2 ? 'ÇİFT NAMLU' : (this.player.upgrades.laser === 3 ? 'ÜÇLÜ ODAK' : 'SÜPER YAYLIM')),
        color: '#00f0ff',
        level: this.player.upgrades.laser,
        maxLevel: 5,
        desc: t('upg_laser_desc')
      },
      {
        id: 'fireRate',
        name: t('upg_fireRate_name'),
        stat: '+%12 HIZ',
        color: '#ffbe0b',
        level: this.player.upgrades.fireRate,
        maxLevel: 5,
        desc: t('upg_fireRate_desc')
      },
      {
        id: 'missiles',
        name: t('upg_missiles_name'),
        stat: '+1 FÜZE',
        color: '#ff5500',
        level: this.player.upgrades.missiles,
        maxLevel: 4,
        desc: t('upg_missiles_desc')
      },
      {
        id: 'tesla',
        name: t('upg_tesla_name'),
        stat: '+ARK ELEKTRİK',
        color: '#38bdf8',
        level: this.player.upgrades.tesla || 0,
        maxLevel: 4,
        desc: t('upg_tesla_desc')
      },
      {
        id: 'drones',
        name: t('upg_drones_name'),
        stat: (this.player.upgrades.drones === 0 ? '1 UYDU' : (this.player.upgrades.drones === 1 ? 'LAZER AĞI' : '3X DRONE')),
        color: '#05ffa1',
        level: this.player.upgrades.drones,
        maxLevel: 3,
        desc: t('upg_drones_desc')
      },
      {
        id: 'emp',
        name: t('upg_emp_name'),
        stat: 'ŞOK BOMBASI',
        color: '#ff0055',
        level: this.player.upgrades.emp,
        maxLevel: 3,
        desc: t('upg_emp_desc')
      },
      {
        id: 'shield',
        name: t('upg_shield_name'),
        stat: '+15 KALKAN',
        color: '#00f0ff',
        level: this.player.upgrades.shield,
        maxLevel: 4,
        desc: t('upg_shield_desc')
      },
      {
        id: 'magnet',
        name: t('upg_magnet_name'),
        stat: '+20 MENZİL',
        color: '#a855f7',
        level: this.player.upgrades.magnet,
        maxLevel: 4,
        desc: t('upg_magnet_desc')
      },
      {
        id: 'hull',
        name: t('upg_hull_name'),
        stat: '+15 CAN / +25 TAMİR',
        color: '#10b981',
        level: this.player.upgrades.hull || 0,
        maxLevel: 4,
        desc: t('upg_hull_desc')
      },
      {
        id: 'wingman',
        name: t('upg_wingman_name'),
        stat: (this.player.upgrades.wingman === 0 ? '1 MİKRO KLON' : (this.player.upgrades.wingman === 1 ? 'ÇİFT KLON' : 'SÜPER SÜRÜ')),
        color: '#00f0ff',
        level: this.player.upgrades.wingman || 0,
        maxLevel: 3,
        desc: t('upg_wingman_desc')
      },
      {
        id: 'overload_reactor',
        name: 'AŞIRI YÜKLEME REAKTÖRÜ',
        stat: 'EMP ŞOKU',
        color: '#bf5af2',
        level: this.player.synergies && this.player.synergies.overloadReactor ? 1 : 0,
        maxLevel: 1,
        desc: 'Kalkan Kırılmasında 360° EMP • Tüm Mermileri Siler'
      },
      {
        id: 'apex_overdrive',
        name: 'APEX OVERDRIVE',
        stat: 'HIZLI SALDIRI',
        color: '#ff0055',
        level: this.player.synergies && (this.player.synergies.apexOverdrive || this.player.synergies.apexWiper) ? 1 : 0,
        maxLevel: 1,
        desc: 'Hücum Hattında +%35 Ekstra Seri Atış Hızı ve Yüksek Delicilik'
      },
      {
        id: 'crystal_shrapnel',
        name: 'KRİSTAL ŞARAPNELİ',
        stat: 'GÜDÜMLÜ DART',
        color: '#05ffa1',
        level: this.player.synergies && this.player.synergies.crystalShrapnel ? 1 : 0,
        maxLevel: 1,
        desc: 'Her 7 Kristalde Otomatik Güdümlü Plazma Dartı'
      }
    ].filter(u => u.level < u.maxLevel);

    // Reroll (Yenileme) Butonu Kontrolü
    const btnReroll = document.getElementById('btn-reroll-cards');
    const rerollVal = document.getElementById('reroll-count-val');
    if (btnReroll && rerollVal) {
      rerollVal.textContent = (this.player.rerollCount || 0).toString();
      btnReroll.style.display = (this.player.rerollCount || 0) > 0 ? 'inline-block' : 'none';
    }

    // KULLANICI İSTEĞİ: 3 DEĞİL TAM 2 SEÇENEK SUNULSUN!
    const choices = [];
    if (evolutions.length > 0) {
      choices.push(evolutions[0]);
    }
    const shuffled = availableUpgrades.sort(() => 0.5 - Math.random());
    while (choices.length < 2 && shuffled.length > 0) {
      choices.push(shuffled.pop());
    }

    // Tüm yükseltmeler maksimum seviyeye ulaştığında kilitlenmeyi önleyen Aşırı Yükleme Bonusları
    const fallbackOverdrives = [
      {
        id: 'bonus_heal',
        name: 'Gövde Onarımı',
        desc: 'Nanitler gövdeyi onarır. Anında +45 HP can yeniler.',
        stat: '+45 HP',
        color: '#ff0055',
        isBonus: true
      },
      {
        id: 'bonus_crystals',
        name: 'Kozmik Zula',
        desc: 'Yüksek saflıkta kristal önbelleği. +60 Kristal ve +1200 Puan kazandırır.',
        stat: '+60 CR',
        color: '#ffbe0b',
        isBonus: true
      },
      {
        id: 'bonus_overdrive',
        name: 'Siber Aşırı Yükleme',
        desc: 'Reaktör çekirdeği zorlanır. Kalıcı +%6 Genel Hasar Çarpanı ekler.',
        stat: '+%6 HASAR',
        color: '#bf5af2',
        isBonus: true
      }
    ];

    while (choices.length < 2 && fallbackOverdrives.length > 0) {
      choices.push(fallbackOverdrives.shift());
    }

    cardsContainer.innerHTML = '';
    choices.forEach(upgrade => {
      const card = document.createElement('div');
      card.className = `upgrade-item-card ${upgrade.isEvolution ? 'evolution-card' : ''}`;
      card.style.setProperty('--card-color', upgrade.color || '#00f0ff');
      card.style.setProperty('--card-glow', `${upgrade.color || '#00f0ff'}55`);

      let pipsHtml = '';
      if (!upgrade.isEvolution && !upgrade.isBonus && upgrade.maxLevel) {
        for (let p = 0; p < upgrade.maxLevel; p++) {
          if (p < upgrade.level) {
            pipsHtml += `<div class="pip filled"></div>`;
          } else if (p === upgrade.level) {
            pipsHtml += `<div class="pip next"></div>`;
          } else {
            pipsHtml += `<div class="pip"></div>`;
          }
        }
      }

      let levelTag = '';
      if (upgrade.isEvolution) {
        levelTag = `<span class="card-level-badge evolution-tag">EFSANEVİ EVRİM</span>`;
      } else if (upgrade.isBonus) {
        levelTag = `<span class="card-level-badge" style="background: rgba(255, 190, 11, 0.2); color: #ffbe0b; border: 1px solid #ffbe0b;">AŞIRI YÜKLEME</span>`;
      } else {
        levelTag = `<span class="card-level-badge">SEVİYE ${upgrade.level + 1} / ${upgrade.maxLevel}</span>`;
      }

      const SYNERGY_MAP = {
        laser: [
          { partner: 'magnet', name: 'Vortex Lazeri', hasPartner: (this.player.upgrades.magnet || 0) >= 1 },
          { partner: 'shield', name: 'Kriyo-Buz', hasPartner: (this.player.upgrades.shield || 0) >= 2 }
        ],
        missiles: [
          { partner: 'emp', name: 'Nükleer Sürü', hasPartner: (this.player.upgrades.emp || 0) >= 1 },
          { partner: 'tesla', name: 'Süpernova', hasPartner: (this.player.upgrades.tesla || 0) >= 3 }
        ],
        tesla: [
          { partner: 'fireRate', name: 'İyon Fırtınası', hasPartner: (this.player.upgrades.fireRate || 0) >= 4 },
          { partner: 'emp', name: 'Kıyamet Matrisi', hasPartner: (this.player.upgrades.emp || 0) >= 3 },
          { partner: 'missiles', name: 'Süpernova', hasPartner: (this.player.upgrades.missiles || 0) >= 4 }
        ],
        drones: [
          { partner: 'shield', name: 'Bastion Siperi', hasPartner: (this.player.upgrades.shield || 0) >= 4 },
          { partner: 'magnet', name: 'Vakum Dronları', hasPartner: (this.player.upgrades.magnet || 0) >= 3 },
          { partner: 'fireRate', name: 'Testereler', hasPartner: (this.player.upgrades.fireRate || 0) >= 3 }
        ],
        emp: [
          { partner: 'missiles', name: 'Nükleer Sürü', hasPartner: (this.player.upgrades.missiles || 0) >= 4 },
          { partner: 'tesla', name: 'Kıyamet Matrisi', hasPartner: (this.player.upgrades.tesla || 0) >= 4 }
        ],
        shield: [
          { partner: 'drones', name: 'Bastion Siperi', hasPartner: (this.player.upgrades.drones || 0) >= 3 },
          { partner: 'laser', name: 'Kriyo-Buz', hasPartner: (this.player.upgrades.laser || 0) >= 4 }
        ],
        magnet: [
          { partner: 'laser', name: 'Vortex Lazeri', hasPartner: (this.player.upgrades.laser || 0) >= 5 },
          { partner: 'drones', name: 'Vakum Dronları', hasPartner: (this.player.upgrades.drones || 0) >= 3 }
        ],
        fireRate: [
          { partner: 'tesla', name: 'İyon Fırtınası', hasPartner: (this.player.upgrades.tesla || 0) >= 4 },
          { partner: 'hull', name: 'Hiper Kılıç', hasPartner: (this.player.upgrades.hull || 0) >= 3 }
        ],
        hull: [
          { partner: 'fireRate', name: 'Hiper Kılıç', hasPartner: (this.player.upgrades.fireRate || 0) >= 4 }
        ],
        wingman: [
          { partner: 'fireRate', name: 'Siber Sürü', hasPartner: (this.player.upgrades.fireRate || 0) >= 3 },
          { partner: 'laser', name: 'İkiz Foton', hasPartner: (this.player.upgrades.laser || 0) >= 3 }
        ]
      };

      let synergyHtml = '';
      if (SYNERGY_MAP[upgrade.id]) {
        const sList = SYNERGY_MAP[upgrade.id];
        const readyS = sList.find(s => s.hasPartner);
        if (readyS) {
          synergyHtml = `<div class="card-synergy-pill ready"><svg class="pixel-icon pixel-icon-sm" viewBox="0 0 10 10" style="margin-right:2px"><path d="M6 1L2 5h3l-1 4 4-4H5l1-4z" fill="#ffbe0b"/></svg> SİNERJİ HAZIR: ${readyS.name}</div>`;
        } else {
          synergyHtml = `<div class="card-synergy-pill"><svg class="pixel-icon pixel-icon-sm" viewBox="0 0 10 10" style="margin-right:2px"><path d="M6 1L2 5h3l-1 4 4-4H5l1-4z" fill="#00f0ff"/></svg> Sinerji: ${sList.map(s => s.name).join(' • ')}</div>`;
        }
      }

      card.innerHTML = `
        <div class="card-art-box">
          ${this.getUpgradeSvg(upgrade.id)}
        </div>
        <div class="card-content">
          <div class="card-header-row">
            <span class="card-title">${upgrade.name}</span>
            <span class="card-stat-pill">${upgrade.stat}</span>
          </div>
          <div class="card-meta-row">
            ${pipsHtml ? `<div class="level-pips">${pipsHtml}</div>` : ''}
            ${levelTag}
          </div>
          <div class="card-desc">${upgrade.desc}</div>
          ${synergyHtml}
        </div>
      `;

      card.addEventListener('click', () => {
        this.applyUpgrade(upgrade.id);
      });

      cardsContainer.appendChild(card);
    });

    levelModal.classList.remove('hidden');
  }

  applyUpgrade(id) {
    if (id.startsWith('evo_')) {
      this.screenShake = 8;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 200);
      this.particles.screenFlashAlpha = 0.3;
      this.particles.screenFlashColor = '#ffbe0b';
      sounds.playLevelUp();
      vibrate.medium();
    }

    if (id === 'evo_vortex') {
      this.player.evolutions.vortexLaser = true;
      sounds.playEvolution();
      vibrate.success();
      this.screenShake = 12;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#d946ef', 280);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'evo_cluster') {
      this.player.evolutions.clusterMissiles = true;
      sounds.playEvolution();
      vibrate.success();
      this.screenShake = 12;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 280);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'evo_ion_storm') {
      this.player.evolutions.ionStorm = true;
      sounds.playEvolution();
      vibrate.success();
      this.screenShake = 12;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#38bdf8', 280);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'evo_nano_bastion') {
      this.player.evolutions.nanoBastion = true;
      this.player.maxShield += 30;
      this.player.shield = this.player.maxShield;
      sounds.playEvolution();
      vibrate.success();
      this.screenShake = 14;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#05ffa1', 280);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'evo_cryo') {
      this.player.evolutions.cryoBlaster = true;
      sounds.playEvolution();
      vibrate.success();
      this.screenShake = 14;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 280);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'evo_saws') {
      this.player.evolutions.orbitalSaws = true;
      sounds.playEvolution();
      vibrate.success();
      this.screenShake = 14;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ff5500', 280);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'evo_supernova') {
      this.player.evolutions.supernova = true;
      sounds.playEvolution();
      vibrate.success();
      this.screenShake = 16;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ff3d00', 320);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'evo_matrix') {
      this.player.evolutions.doomsdayMatrix = true;
      sounds.playEvolution();
      vibrate.success();
      this.screenShake = 16;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#bf5af2', 320);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'evo_hyper_plasma' || id === 'evo_hyper_saber') {
      this.player.evolutions.hyperPlasma = true;
      this.player.evolutions.hyperSaber = true;
      sounds.playEvolution();
      vibrate.success();
      this.screenShake = 14;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#05ffa1', 300);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'evo_void_drones') {
      this.player.evolutions.voidDrones = true;
      sounds.playEvolution();
      vibrate.success();
      this.screenShake = 14;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffd700', 300);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'overload_reactor') {
      this.player.synergies.overloadReactor = true;
      sounds.playEvolution();
      vibrate.success();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#bf5af2', 240);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'apex_overdrive' || id === 'apex_wiper') {
      this.player.synergies.apexOverdrive = true;
      this.player.synergies.apexWiper = true;
      sounds.playEvolution();
      vibrate.success();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ff0055', 260);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'crystal_shrapnel') {
      this.player.synergies.crystalShrapnel = true;
      sounds.playEvolution();
      vibrate.success();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#05ffa1', 240);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }

    if (id === 'bonus_heal') {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 45);
      sounds.playPowerup();
      vibrate.light();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#10b981', 160);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 25, '+45 HP ONARIM!', '#10b981', 15);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'bonus_crystals') {
      this.totalCrystals = (this.totalCrystals || 0) + 60;
      localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
      this.score += 1200;
      sounds.playJackpot();
      vibrate.success();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 180);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 25, '+60 KRİSTAL!', '#ffbe0b', 16);
      this.updateCrystalsDisplay();
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }
    if (id === 'bonus_overdrive') {
      this.player.damageMultiplier = (this.player.damageMultiplier || 1.0) * 1.06;
      sounds.playEvolution();
      vibrate.heavy();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#bf5af2', 200);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 25, '+%6 HASAR!', '#bf5af2', 15);
      levelModal.classList.add('hidden');
      this.state = 'PLAYING';
      this.updateHUD();
      return;
    }

    sounds.playCardSelect();
    this.player.upgrades[id] = (this.player.upgrades[id] || 0) + 1;

    // Özel etki ayarlamaları (Dengeli ve tatmin edici oranlar)
    if (id === 'magnet') {
      this.player.magnetRange += 20;
    } else if (id === 'shield') {
      this.player.maxShield += 15;
      this.player.shield = Math.min(this.player.maxShield, this.player.shield + 15);
    } else if (id === 'hull') {
      this.player.maxHp += 15;
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 25);
      this.particles.spawnShockwave(this.player.x, this.player.y, '#10b981', 180);
    } else if (id === 'wingman') {
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 160);
      const wmLevel = this.player.upgrades.wingman || 1;
      const label = wmLevel === 1 ? '+1 MİKRO KLON (PET)!' : (wmLevel === 2 ? '+ÇİFT MİKRO KLON!' : '+SÜPER SÜRÜ YAYLIMI!');
      this.particles.spawnFloatingText(this.player.x, this.player.y - 30, label, '#00f0ff', 16);
      this.syncWingmen();
    }

    levelModal.classList.add('hidden');
    this.state = 'PLAYING';
    this.updateHUD();
  }

  triggerLuckyChest() {
    this.state = 'LUCKY_CHEST';
    sounds.playJackpot();
    vibrate.success();
    this.screenShake = 12;
    this.particles.spawnShockwave(this.player.x, this.player.y, '#ffd700', 300);
    this.particles.spawnExplosion(this.player.x, this.player.y, '#ffbe0b', 28, 4.5);

    const evolutions = [];
    if (this.player.upgrades.laser >= 5 && this.player.upgrades.magnet >= 1 && !this.player.evolutions.vortexLaser) {
      evolutions.push({
        id: 'evo_vortex',
        isEvolution: true,
        name: 'VORTEX KARADELİK LAZERİ',
        stat: 'GİRDAP DELME',
        color: '#d946ef',
        desc: 'Mermiler tüm hedefleri delip geçer ve yerçekimi girdabı açar!'
      });
    }
    if (this.player.upgrades.missiles >= 4 && this.player.upgrades.emp >= 1 && !this.player.evolutions.clusterMissiles) {
      evolutions.push({
        id: 'evo_cluster',
        isEvolution: true,
        name: 'NÜKLEER SÜRÜ FÜZESİ',
        stat: 'EMP MİKRO-NUKE',
        color: '#ffbe0b',
        desc: 'Füzeler çarptığında mini EMP nükleer şokuyla devasa alan hasarı saçar!'
      });
    }
    if ((this.player.upgrades.tesla || 0) >= 4 && this.player.upgrades.fireRate >= 4 && !this.player.evolutions.ionStorm) {
      evolutions.push({
        id: 'evo_ion_storm',
        isEvolution: true,
        name: 'TESLA İYON FIRTINASI',
        stat: 'KÜRESEL ŞOK',
        color: '#38bdf8',
        desc: 'Her 3.5 sn gökyüzünden kozmik şimşekler 5-8 düşmana yıldırım boşaltır!'
      });
    }
    if (this.player.upgrades.shield >= 4 && (this.player.upgrades.drones || 0) >= 3 && !this.player.evolutions.nanoBastion) {
      evolutions.push({
        id: 'evo_nano_bastion',
        isEvolution: true,
        name: 'ORBİTAL BASTİON HALKASI',
        stat: 'PLAZMA SİPERİ',
        color: '#05ffa1',
        desc: 'Kalkan ve dronelar mermileri eriten Plazma Bariyeri kurar!'
      });
    }
    if (this.player.upgrades.laser >= 4 && (this.player.upgrades.hull || 0) >= 3 && !this.player.evolutions.cryoBlaster) {
      evolutions.push({
        id: 'evo_cryo',
        isEvolution: true,
        name: 'MUTLAK SIFIR KRİYO-BLASTER',
        stat: 'BUZ KIRILMASI',
        color: '#00f0ff',
        desc: 'Mermiler düşmanları %50 dondurur; ölen düşmanlar buz şarapneli saçar!'
      });
    }
    if ((this.player.upgrades.drones || 0) >= 3 && this.player.upgrades.fireRate >= 4 && !this.player.evolutions.orbitalSaws) {
      evolutions.push({
        id: 'evo_saws',
        isEvolution: true,
        name: 'ORBİTAL PLAZMA TESTERELERİ',
        stat: 'DİKENLİ ÇEMBER',
        color: '#ff0055',
        desc: 'Gemi etrafında dönen süpersonik testereler dokunan düşmanları biçer!'
      });
    }
    if (this.player.upgrades.missiles >= 4 && (this.player.upgrades.tesla || 0) >= 3 && !this.player.evolutions.supernova) {
      evolutions.push({
        id: 'evo_supernova',
        isEvolution: true,
        name: 'SÜPERNOVA ÇEKİRDEĞİ',
        stat: 'PLAZMA HAVUZU',
        color: '#ff3d00',
        desc: 'Mermileri buharlaştıran devasa süpernova girdabı açar!'
      });
    }
    if ((this.player.upgrades.tesla || 0) >= 4 && this.player.upgrades.emp >= 3 && !this.player.evolutions.doomsdayMatrix) {
      evolutions.push({
        id: 'evo_matrix',
        isEvolution: true,
        name: 'KIYAMET TESLA MATRİSİ',
        stat: 'AŞIRI VOLTAJ',
        color: '#bf5af2',
        desc: 'Sürekli yıldırım ağı kurar ve aşırı voltaj patlamaları saçar!'
      });
    }
    if ((this.player.upgrades.hull || 0) >= 3 && this.player.upgrades.fireRate >= 4 && !this.player.evolutions.hyperSaber) {
      evolutions.push({
        id: 'evo_hyper_saber',
        isEvolution: true,
        name: 'YANSITICI HİPER IŞIN KILICI',
        stat: 'MERMİ SAPTIRMA',
        color: '#05ffa1',
        desc: 'Düşman mermilerini düşmanlara geri fırlatır!'
      });
    }
    if ((this.player.upgrades.drones || 0) >= 3 && this.player.upgrades.magnet >= 3 && !this.player.evolutions.voidDrones) {
      evolutions.push({
        id: 'evo_void_drones',
        isEvolution: true,
        name: 'VAKUM AVCI DRONLARI',
        stat: 'OTOMATİK HASAT',
        color: '#ffd700',
        desc: 'Kristalleri otomatik toplar ve seri plazma saçar!'
      });
    }

    const availableUpgrades = [
      { id: 'laser', name: t('upg_laser_name'), stat: '+HASAR & NAMLU', color: '#00f0ff', level: this.player.upgrades.laser, maxLevel: 5, desc: t('upg_laser_desc') },
      { id: 'fireRate', name: t('upg_fireRate_name'), stat: '+%10 HIZ', color: '#ffbe0b', level: this.player.upgrades.fireRate, maxLevel: 5, desc: t('upg_fireRate_desc') },
      { id: 'missiles', name: t('upg_missiles_name'), stat: '+1 FÜZE & GÜÇ', color: '#ff5500', level: this.player.upgrades.missiles, maxLevel: 4, desc: t('upg_missiles_desc') },
      { id: 'tesla', name: t('upg_tesla_name'), stat: '+ARK ELEKTRİK', color: '#38bdf8', level: this.player.upgrades.tesla || 0, maxLevel: 4, desc: t('upg_tesla_desc') },
      { id: 'drones', name: t('upg_drones_name'), stat: '+SAVUNMA UYDUSU', color: '#05ffa1', level: this.player.upgrades.drones, maxLevel: 3, desc: t('upg_drones_desc') },
      { id: 'emp', name: t('upg_emp_name'), stat: 'ŞOK BOMBASI', color: '#ff0055', level: this.player.upgrades.emp, maxLevel: 3, desc: t('upg_emp_desc') },
      { id: 'shield', name: t('upg_shield_name'), stat: '+15 KALKAN', color: '#00f0ff', level: this.player.upgrades.shield, maxLevel: 4, desc: t('upg_shield_desc') },
      { id: 'magnet', name: t('upg_magnet_name'), stat: '+20 MENZİL', color: '#a855f7', level: this.player.upgrades.magnet, maxLevel: 4, desc: t('upg_magnet_desc') },
      { id: 'hull', name: t('upg_hull_name'), stat: '+15 CAN / +25 TAMİR', color: '#10b981', level: this.player.upgrades.hull || 0, maxLevel: 4, desc: t('upg_hull_desc') },
      { id: 'wingman', name: t('upg_wingman_name'), stat: '+MİKRO KLON', color: '#00f0ff', level: this.player.upgrades.wingman || 0, maxLevel: 3, desc: t('upg_wingman_desc') }
    ].filter(u => u.level < u.maxLevel);

    const pool = [...evolutions, ...availableUpgrades.sort(() => 0.5 - Math.random())];
    
    // KULLANICI İSTEĞİ: Sandık açıldığında 3 ganimet tek seferde ilk açışta hazır gelsin!
    const rewardCount = Math.min(pool.length, 3);
    this.pendingChestRewards = pool.slice(0, Math.max(1, rewardCount));
    this.pendingChestBonusReward = null;
    this.pendingChestIsJackpot = this.pendingChestRewards.some(r => r.isEvolution) || rewardCount >= 3;

    if (jackpotBadge) {
      jackpotBadge.classList.remove('hidden');
      jackpotBadge.textContent = this.pendingChestIsJackpot ? '★ BÜYÜK İKRAMİYE! (3X GANİMET) ★' : '★ ŞANSLI GANİMET SANDIĞI ★';
    }

    if (luckyChestTitle) {
      luckyChestTitle.textContent = this.pendingChestIsJackpot ? '★ BÜYÜK İKRAMİYE SANDIĞI! ★' : t('chest_title');
      luckyChestTitle.style.color = '#ffbe0b';
    }

    if (luckyChestSubtitle) {
      luckyChestSubtitle.textContent = t('chest_subtitle');
    }

    if (luckyChestContainer) {
      luckyChestContainer.innerHTML = '';
      this.pendingChestRewards.forEach((item, idx) => {
        const row = this.renderChestRewardCard(item, idx);
        luckyChestContainer.appendChild(row);
      });
    }

    // Reklam slotunu gizle (artık tek seferde tüm ganimetler açılıyor)
    const adSlot = document.getElementById('lucky-chest-ad-slot');
    if (adSlot) {
      adSlot.classList.add('hidden');
    }

    if (btnClaimChest) {
      btnClaimChest.textContent = t('chest_claim');
    }

    try { history.pushState({ modal: 'lucky_chest' }, ''); } catch(e) {}
    if (luckyChestModal) luckyChestModal.classList.remove('hidden');
  }

  renderChestRewardCard(item, idx) {
    const row = document.createElement('div');
    row.className = `upgrade-item-card ${item.isEvolution ? 'evolution-card' : ''}`;
    row.style.setProperty('--card-color', item.color || '#ffbe0b');
    row.style.setProperty('--card-glow', `${item.color || '#ffbe0b'}55`);
    row.style.pointerEvents = 'none';
    row.style.animation = `jackpotCardPop 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${idx * 0.14}s backwards`;

    const tag = item.isEvolution ? `<span class="card-level-badge evolution-tag">EFSANEVİ EVRİM</span>` : `<span class="card-level-badge">ÜCRETSİZ GELİŞTİRME</span>`;

    row.innerHTML = `
      <div class="card-art-box">
        ${this.getUpgradeSvg(item.id)}
      </div>
      <div class="card-content">
        <div class="card-header-row">
          <span class="card-title">${item.name}</span>
          <span class="card-stat-pill">${item.stat}</span>
        </div>
        <div class="card-meta-row">
          ${tag}
        </div>
        <div class="card-desc">${item.desc}</div>
      </div>
    `;
    return row;
  }

  watchAdForChestBonus() {
    if (!this.pendingChestBonusReward) return;
    const btn = document.getElementById('btn-ad-chest-bonus');
    const btnText = document.getElementById('btn-ad-chest-bonus-text');
    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = 'Reklam Hazırlanıyor...';

    const onRewardSuccess = () => {
      if (this.pendingChestBonusReward) {
        const bonusItem = this.pendingChestBonusReward;
        this.pendingChestRewards.push(bonusItem);
        this.pendingChestBonusReward = null;

        if (luckyChestContainer) {
          const row = this.renderChestRewardCard(bonusItem, this.pendingChestRewards.length - 1);
          luckyChestContainer.appendChild(row);
        }

        sounds.playJackpot();
        vibrate.success();
        this.showToast('🎉 2. Ganimet Başarıyla Açıldı!', '#05ffa1');

        if (btn) {
          btn.disabled = true;
          btn.classList.remove('pulse');
          btn.style.opacity = '0.8';
          btn.style.background = 'rgba(5, 255, 161, 0.2)';
          btn.style.borderColor = '#05ffa1';
        }
        if (btnText) {
          btnText.textContent = '✓ 2. Ganimet Açıldı!';
          btnText.style.color = '#05ffa1';
        }
        if (btnClaimChest) {
          btnClaimChest.textContent = 'GANİMETLERİ AL VE DEVAM ET';
        }
      }
    };

    const onError = (err) => {
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = '2. Ganimeti Aç (Reklam İzle)';
      this.showToast('Reklam yüklenemedi, lütfen tekrar deneyin.', '#ff5500');
    };

    if (window.showRewardedAd) {
      window.showRewardedAd(
        onRewardSuccess,
        onError,
        window.ADMOB_CONFIG ? window.ADMOB_CONFIG.chestAdUnitId : null
      );
    } else {
      onRewardSuccess();
    }
  }

  claimLuckyChest() {
    sounds.playLevelUp();
    sounds.playCardSelect();
    vibrate.success();

    if (this.pilotStats) {
      this.pilotStats.totalChests = (this.pilotStats.totalChests || 0) + 1;
    }

    const isJackpot = this.pendingChestIsJackpot;
    const bonusCrystals = isJackpot ? 50 : 25;
    this.totalCrystals += bonusCrystals;
    this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + bonusCrystals;
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    this.updateCrystalsDisplay();

    // Kalkanı full tamir et ve ekstra can ver
    this.player.shield = this.player.maxShield;
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + (isJackpot ? 40 : 20));

    if (this.pendingChestRewards && this.pendingChestRewards.length > 0) {
      for (let item of this.pendingChestRewards) {
        if (item.id.startsWith('evo_')) {
          this.screenShake = 8;
          this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 200);
          this.particles.screenFlashAlpha = 0.3;
          this.particles.screenFlashColor = '#ffbe0b';
          sounds.playLevelUp();
          vibrate.medium();
        }

        if (item.id === 'evo_vortex') {
          this.player.evolutions.vortexLaser = true;
        } else if (item.id === 'evo_cluster') {
          this.player.evolutions.clusterMissiles = true;
        } else if (item.id === 'evo_ion_storm') {
          this.player.evolutions.ionStorm = true;
        } else if (item.id === 'evo_nano_bastion') {
          this.player.evolutions.nanoBastion = true;
          this.player.maxShield += 30;
          this.player.shield = this.player.maxShield;
        } else if (item.id === 'evo_cryo') {
          this.player.evolutions.cryoBlaster = true;
        } else if (item.id === 'evo_saws') {
          this.player.evolutions.orbitalSaws = true;
        } else if (item.id === 'evo_supernova') {
          this.player.evolutions.supernova = true;
        } else if (item.id === 'evo_matrix') {
          this.player.evolutions.doomsdayMatrix = true;
        } else if (item.id === 'evo_hyper_saber') {
          this.player.evolutions.hyperSaber = true;
        } else if (item.id === 'evo_void_drones') {
          this.player.evolutions.voidDrones = true;
        } else {
          this.player.upgrades[item.id] = (this.player.upgrades[item.id] || 0) + 1;
          if (item.id === 'magnet') this.player.magnetRange += 40;
          else if (item.id === 'shield') {
            this.player.maxShield += 20;
            this.player.shield = Math.min(this.player.maxShield, this.player.shield + 20);
          } else if (item.id === 'hull') {
            this.player.maxHp += 20;
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + 45);
          }
        }
      }
      this.pendingChestRewards = [];
    }

    if (luckyChestModal) luckyChestModal.classList.add('hidden');
    this.particles.spawnShockwave(this.player.x, this.player.y, '#ffd700', 320);
    this.particles.spawnExplosion(this.player.x, this.player.y, '#ffbe0b', 32, 5);
    this.screenShake = 8;
    this.particles.spawnFloatingText(this.player.x, this.player.y - 30, `TAM ONARIM & +${bonusCrystals} CR!`, '#ffd700', 16);
    this.state = 'PLAYING';
    this.updateHUD();
  }

  gameOver() {
    this.state = 'GAME_OVER';
    this.releaseWakeLock();
    sounds.setBossEnraged(false);
    sounds.setBossMode(false);
    sounds.stopBGM();
    sounds.playExplosion(true);
    vibrate.heavy();

    if (this.pilotStats) {
      this.pilotStats.maxTime = Math.max(this.pilotStats.maxTime, this.gameTime);
      this.savePilotStats();
    }

    if (this.player.score > this.highScores[this.currentMode]) {
      this.highScores[this.currentMode] = this.player.score;
      localStorage.setItem(`neon_high_score_${this.currentMode}`, this.highScores[this.currentMode].toString());
      localStorage.setItem('neon_space_high_score', this.highScores['classic'].toString());
    }

    const mins = Math.floor(this.gameTime / 60).toString().padStart(2, '0');
    const secs = (this.gameTime % 60).toString().padStart(2, '0');

    finalScore.textContent = this.player.score.toLocaleString();
    finalTime.textContent = `${mins}:${secs}`;
    finalLevel.textContent = this.player.level.toString();
    const earned = this.crystalsEarnedThisRun || 0;
    const baseGain = Math.max(35, earned);
    const boostedTotal = earned + baseGain;

    if (finalCrystals) finalCrystals.textContent = `+${earned.toLocaleString()} CR`;
    const finalCrystalsBoosted = document.getElementById('final-crystals-boosted');
    if (finalCrystalsBoosted) {
      finalCrystalsBoosted.textContent = `+${boostedTotal.toLocaleString()} CR 🔥`;
      finalCrystalsBoosted.style.color = '#ffd700';
    }

    this.gameOverAdUsed = false;
    const btnDoubleCrystals = document.getElementById('btn-double-crystals');
    if (btnDoubleCrystals) {
      btnDoubleCrystals.disabled = false;
      btnDoubleCrystals.classList.add('pulse');
      btnDoubleCrystals.classList.add('gold-shimmer-btn');
      btnDoubleCrystals.innerHTML = `
        <span class="btn-shimmer-badge">⚡ 2X</span>
        <span id="btn-double-crystals-text">${t('gameover_double_ad', { n: baseGain })}</span>
      `;
    }

    const freeRevives = parseInt(localStorage.getItem('neon_bonus_revives') || '0', 10);
    const btnAdRevive = document.getElementById('btn-ad-revive');
    if (btnAdRevive) {
      if (freeRevives > 0) {
        btnAdRevive.innerHTML = t('gameover_revive_free', { n: freeRevives });
      } else {
        btnAdRevive.innerHTML = t('gameover_revive_ad');
      }
    }

    hud.classList.add('hidden');
    if (ultimateBtnContainer) ultimateBtnContainer.classList.add('hidden');
    if (miniQuestCard) miniQuestCard.classList.add('hidden');
    if (merchantModal) merchantModal.classList.add('hidden');
    gameoverModal.classList.remove('hidden');
    this.updateCrystalsDisplay();
    this.checkMissionsBadge();
  }

  executeRevive() {
    if (gameoverModal) gameoverModal.classList.add('hidden');
    this.state = 'PLAYING';
    this.lastTime = performance.now();
    if (this.player) {
      this.player.hp = Math.round(this.player.maxHp * 0.6);
      this.player.shield = this.player.maxShield;
      this.player.invulnerableTimer = 180; // 3 saniye dokunulmazlık
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffd700', 300);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 40, '⚡ YENİDEN CANLANDIN! ⚡', '#ffd700', 18);
    }
    sounds.playJackpot();
    sounds.startBGM();
    vibrate.success();
  }

  // === OYUN DÖNGÜSÜ GÜNCELLEME ===
  update(dt = 1.0) {
    this.frames = (this.frames || 0) + 1;

    // Fırlatma/Bölüm Başlatma Süreci: State uyumsuzluklarını ve donmaları %100 engeller
    if (this.launching) {
      this.particles.update(this.width, this.height);
      this.launchProgress = (this.launchProgress || 0) + dt;
      this.particles.startWarp(22);
      this.screenShake = Math.min(8, this.launchProgress * 0.28);
      if (this.launchProgress >= 24) {
        this.launching = false;
        if (startScreen) startScreen.classList.remove('launching');
        this.startNewGame();
      }
      return;
    }

    if (this.state === 'MENU') {
      this.particles.update(this.width, this.height);
      return;
    }

    if (this.state === 'PAUSED') {
      return;
    }

    if (this.state !== 'PLAYING') {
      this.particles.update(this.width, this.height);
      return;
    }

    // Kombo Zamanlayıcısı
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    // 120Hz/60Hz ekranlarda gerçek saniye hesabı
    this.timeAccumulator = (this.timeAccumulator || 0) + (dt / 60);
    if (this.timeAccumulator >= 1.0) {
      const addedSecs = Math.floor(this.timeAccumulator);
      this.gameTime += addedSecs;
      this.timeAccumulator -= addedSecs;
      // Her 30 saniyede bir dalga seviyesi artar
      if (this.gameTime % 30 === 0) {
        this.wave++;
        const targetSector = this.getSectorForWave(this.wave);
        if (targetSector !== this.currentSectorId) {
          this.triggerSectorWarp(targetSector);
        }
      }
      this.updateMissionProgress('survive_time', Math.floor(this.gameTime), true);
      this.updateHUD();
    }

    // Zaman Yavaşlatıcı (Temporal Slow)
    if (this.temporalSlowTimer > 0) {
      this.temporalSlowTimer -= dt;
      dt *= 0.35;
    }

    // Mini Görev Zamanlayıcısı ve İlerlemesi
    if (this.currentMiniQuest) {
      if (this.currentMiniQuest.type === 'dodge') {
        this.currentMiniQuest.dodgeTimer = (this.currentMiniQuest.dodgeTimer || 0) + (dt / 60);
        this.updateMiniQuestProgress('dodge', this.currentMiniQuest.dodgeTimer, true);
      }
    } else {
      this.nextMiniQuestTimer -= (dt / 60);
      if (this.nextMiniQuestTimer <= 0) {
        this.currentMiniQuest = this.generateMiniQuest();
      }
    }

    // Orbital Plazma Testereleri Evrimi (Süpersonik Dönen Testereler)
    if (this.player.evolutions && this.player.evolutions.orbitalSaws) {
      this.sawAngle = (this.sawAngle || 0) + 0.14 * dt;
      const sawDist = 72;
      for (let s = 0; s < 2; s++) {
        const ang = this.sawAngle + s * Math.PI;
        const sx = this.player.x + Math.cos(ang) * sawDist;
        const sy = this.player.y + Math.sin(ang) * sawDist;
        for (let enemy of this.enemies) {
          if (enemy.hp > 0 && Math.hypot(enemy.x - sx, enemy.y - sy) < 26 + enemy.radius) {
            const sawDmg = 1.6 * dt * (this.player.damageMultiplier || 1.0);
            enemy.hp -= sawDmg;
            if (Math.random() < 0.3 * dt) {
              sounds.playHitmarker();
              this.particles.spawnExplosion(sx, sy, '#ff0055', 3, 1.3);
            }
            if (enemy.hp <= 0) {
              this.handleEnemyDeath(enemy);
            }
          }
        }
      }
    }

    // Hiperuzay Warp Sayacı
    if (this.warpTimer > 0) {
      this.warpTimer -= dt;
      if (this.warpTimer < 0) this.warpTimer = 0;
    }

    // Ekran Sarsıntısını Azalt
    if (this.screenShake > 0) {
      this.screenShake *= Math.pow(0.9, dt);
      if (this.screenShake < 0.2) this.screenShake = 0;
    }

    // Savunma Hattı Flaşını Azalt
    if (this.barrierFlash > 0) {
      this.barrierFlash -= dt;
      if (this.barrierFlash < 0) this.barrierFlash = 0;
    }

    // Kırmızı Hasar Flash Sönümlemesi
    if (this.damageFlash > 0) {
      this.damageFlash -= 0.04 * dt;
      if (this.damageFlash < 0) this.damageFlash = 0;
    }

    // Oyuncu Hareketi (Klavye desteği)
    const moveSpeed = 7 * dt;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.player.targetX -= moveSpeed;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) this.player.targetX += moveSpeed;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) this.player.targetY -= moveSpeed;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) this.player.targetY += moveSpeed;

    // Yumuşak İnterpolasyon (Smooth Follow)
    const dx = this.player.targetX - this.player.x;
    const dy = this.player.targetY - this.player.y;
    const moveDist = Math.hypot(dx, dy);
    this.player.x += dx * Math.min(1, 0.35 * dt);
    this.player.y += dy * Math.min(1, 0.35 * dt);
    this.player.x = Math.max(24, Math.min(this.width - 24, this.player.x));
    this.player.y = Math.max(48, Math.min(this.height - 36, this.player.y));
    // Kuantum Faz Sayacı (Phantom Jet Özel Koruması)
    if (this.player.phaseTimer > 0) this.player.phaseTimer -= dt;
    if (this.player.phaseCooldown > 0) this.player.phaseCooldown -= dt;

    // Asit İzi & Zehir Emisyonu (Toxic Jet Özel Yeteneği)
    if (this.currentSkinId === 'toxic' && (this.frames % 12 === 0)) {
      this.particles.spawnExplosion(this.player.x + (Math.random() * 12 - 6), this.player.y + 16, '#05ffa1', 2, 1.2);
      for (let enemy of this.enemies) {
        if (Math.abs(enemy.x - this.player.x) < 36 && enemy.y > this.player.y && enemy.y < this.player.y + 70) {
          enemy.hp -= 2.2 * dt;
        }
      }
    }

    // Gravitasyonel Kozmik Çekim (Vortex Jet Özel Pasifi: Kristalleri manyetik çeker)
    if (this.currentSkinId === 'vortex' && (this.frames % 3 === 0)) {
      for (let gem of this.gems) {
        const gd = Math.hypot(gem.x - this.player.x, gem.y - this.player.y);
        if (gd < 240) {
          gem.vx += (this.player.x - gem.x) * 0.08;
          gem.vy += (this.player.y - gem.y) * 0.08;
        }
      }
    }

    // Krono Zaman Fazı (Chrono Jet Özel Pasifi: Mermileri mikroskobik yavaşlatır)
    if (this.currentSkinId === 'chrono' && (this.frames % 40 === 0)) {
      for (let ep of this.enemyProjectiles) {
        const epd = Math.hypot(ep.x - this.player.x, ep.y - this.player.y);
        if (epd < 70) {
          ep.vx *= 0.85;
          ep.vy *= 0.85;
        }
      }
    }

    // === 3 KADEMELİ DİNAMİK TAKTİKSEL DERİNLİK VE KONUM SİSTEMİ (TACTICAL COMBAT ZONES) ===
    // 1. Kademe: HÜCUM / ÇEKİRDEK HATTI (Ön %38 - Yüksek Risk, Yüksek Ödül, 2.2x Hasar, Delici Plazma)
    // 2. Kademe: TEMPO / SALDIRI HATTI (Orta %32 - Dengeli Çatışma, 1.15x Hasar)
    // 3. Kademe: GÜVENLİ / KORUMALI HAT (Arka %30 - Uzun Menzil, Hızlı Kalkan Onarımı, 0.85x Hasar)
    const frontThreshold = this.height * 0.38;
    const rearThreshold = this.height * 0.70;

    let currentZone = 'mid';
    if (this.player.y < frontThreshold) {
      currentZone = 'front';
    } else if (this.player.y > rearThreshold) {
      currentZone = 'rear';
    }

    if (this.player.combatZone !== currentZone) {
      const prevZone = this.player.combatZone;
      this.player.combatZone = currentZone;
      if (prevZone) {
        sounds.playJetMorph(currentZone);
        // Telefon üzerinde güçlü ve kesin hissedilen haptik vuruş
        vibrate.heavy();
        this.player.zoneFlash = 1.0; // Jet üzerinde anlık reaktif parlama
        this.player.morphAnim = 1.0; // Transformers / Pokemon evrim mekanik dönüşüm sayacı
        this.player.zoneTransitionAnim = 1.0;
        this.zoneLineFlashTimer = 35; // Sınır çizgisinde tam ekran lazer parlaması
        this.zoneLineFlashZone = currentZone;

        // Geminin tepesinde beliren net taktiksel mod bildirimi
        if (currentZone === 'front') {
          this.player.zoneBannerText = '⚔️ HÜCUM: SERİ AŞIRI YÜKLEME';
          this.player.zoneBannerColor = '#ff0055';
        } else if (currentZone === 'mid') {
          this.player.zoneBannerText = '⚡ TAARRUZ: ÇİFT PLAZMA & FÜZE';
          this.player.zoneBannerColor = '#ffbe0b';
        } else {
          this.player.zoneBannerText = '🎯 KESKİN NİŞANCI: ELEKTRO-RAY';
          this.player.zoneBannerColor = '#38bdf8';
        }
        this.player.zoneBannerTimer = 85; // ~1.4 saniye görünür

        const zColor = this.player.zoneBannerColor;
        this.particles.spawnShockwave(this.player.x, this.player.y, '#ffffff', 48);
        this.particles.spawnShockwave(this.player.x, this.player.y, zColor, 68);
        for (let s = 0; s < 8; s++) {
          this.particles.spawnExplosion(this.player.x + (Math.random() * 26 - 13), this.player.y + (Math.random() * 26 - 13), zColor, 3, 1.4);
        }
      }
    }

    // Ön hatta (Hücum Bölgesi) kalma cesareti ödülü: Sürekli bonus Overdrive enerjisi üretir!
    if (this.player.combatZone === 'front' && !this.player.isFever) {
      this.player.feverCharge = Math.min(100, this.player.feverCharge + 0.08 * dt);
      if (Math.random() < 0.25 * dt) {
        this.particles.spawnExplosion(this.player.x + (Math.random() * 20 - 10), this.player.y + 15, '#ff0055', 2, 1.0);
      }
    }

    // Hareket Etmeme Durumu (Sabit Odaklanmış Siper Duruşu - Bir Tık Daha Hızlı Seri Atış)
    if (moveDist < 1.8) {
      this.player.stationaryTimer = (this.player.stationaryTimer || 0) + dt;
      if (this.player.stationaryTimer >= 8) {
        this.player.isStationary = true;
      }
    } else {
      this.player.stationaryTimer = 0;
      this.player.isStationary = false;
    }

    // İpeksi Yumuşak Aerodinamik Yatma (Smooth Banking Lerp with Damping)
    const targetTilt = Math.max(-0.25, Math.min(0.25, dx * 0.012));
    this.player.tilt = (this.player.tilt || 0) + (targetTilt - (this.player.tilt || 0)) * Math.min(1, 0.12 * dt);

    // Evrim / Dönüşüm Animasyonu Sönümlemesi
    if (this.player.morphAnim > 0) {
      this.player.morphAnim = Math.max(0, this.player.morphAnim - 0.05 * dt);
    }

    // Afterimages sönümlemesi
    if (this.player.afterimages && this.player.afterimages.length > 0) {
      for (let ai = this.player.afterimages.length - 1; ai >= 0; ai--) {
        this.player.afterimages[ai].alpha -= 0.08 * dt;
        if (this.player.afterimages[ai].alpha <= 0) {
          this.player.afterimages.splice(ai, 1);
        }
      }
    }

    // Overdrive / Fever Modu Süresi & Gemiye Özel Nihai Güç (Ultimate Burst)
    if (this.player.isFever) {
      this.player.feverTimer -= dt;
      this.player.skinUltTick = (this.player.skinUltTick || 0) + dt;
      if (this.player.skinUltTick >= 40) { // ~0.65 saniyede bir gemiye özel yetenek patlaması
        this.player.skinUltTick = 0;
        this.triggerSkinOverdriveBurst();
      }
      if (this.player.feverTimer <= 0) {
        this.player.isFever = false;
        this.player.feverCharge = 0;
      }
    }

    // Overcharge ve Vakum Mıknatıs Süreleri
    if (this.player.overchargeTimer > 0) {
      this.player.overchargeTimer -= dt;
    }
    if (this.player.vacuumTimer > 0) {
      this.player.vacuumTimer -= dt;
    }
    if (this.player.adrenalineTimer > 0) {
      this.player.adrenalineTimer -= dt;
    }

    // Pilot Yeteneği Bekleme Süresi & Aktif Yetenek Süreleri
    if (this.player.abilityCooldown > 0) {
      this.player.abilityCooldown = Math.max(0, this.player.abilityCooldown - dt);
    }
    if (this.player.titanShieldTimer > 0) {
      this.player.titanShieldTimer -= dt;
      if (this.frames % 8 === 0) {
        this.particles.spawnExplosion(this.player.x + (Math.random() * 30 - 15), this.player.y + (Math.random() * 30 - 15), '#ffbe0b', 1, 1);
      }
    }
    if (this.player.blazeDashTimer > 0) {
      this.player.blazeDashTimer -= dt;
      this.particles.spawnExplosion(this.player.x, this.player.y + 10, '#ff5500', 3, 2);
    }

    // İkiz Motor Egzoz Alevleri & Kostüme Özel Kuyruk İzi (Skin Tail & Engine Trails)
    if (Math.random() < 0.70 * dt) {
      const cosT = Math.cos(this.player.tilt);
      const sinT = Math.sin(this.player.tilt);
      const skinId = this.currentSkinId || 'cyberpunk';
      const skin = this.skins[skinId] || this.skins.cyberpunk;
      const isFever = this.player.isFever;
      const isOvercharge = this.player.overchargeTimer > 0;
      
      const trail = (this.trails && this.trails[this.equippedTrailId]) || null;
      let flameColor = isOvercharge ? '#bf5af2' : (isFever ? '#ffbe0b' : (trail && trail.id !== 'default' ? trail.color : skin.flame));
      if (trail && trail.id === 'rainbow') {
        flameColor = `hsl(${((this.frames || 0) * 10) % 360}, 100%, 60%)`;
      }

      // Sol ve sağ nozül konumları
      const leftX = this.player.x + (-7 * cosT - 18 * sinT);
      const leftY = this.player.y + (-7 * sinT + 18 * cosT);
      const rightX = this.player.x + (7 * cosT - 18 * sinT);
      const rightY = this.player.y + (7 * sinT + 18 * cosT);
      this.particles.spawnThruster(leftX, leftY, flameColor);
      this.particles.spawnThruster(rightX, rightY, flameColor);

      // Özel Motor İzi & Kostüm Parçacıkları
      if (!isFever && !isOvercharge && Math.random() < 0.45 * dt) {
        const midX = (leftX + rightX) / 2;
        const midY = (leftY + rightY) / 2 + 4;
        if (trail && trail.id === 'flame') {
          // Akkor Kızıl Alev Kıvılcımları
          this.particles.spawnExplosion(midX, midY, Math.random() < 0.5 ? '#ff3d00' : '#ff9100', 1, 1.2);
        } else if (trail && trail.id === 'electric') {
          // Tesla Şimşek Kıvılcımları
          this.particles.spawnExplosion(midX, midY, Math.random() < 0.5 ? '#a855f7' : '#d946ef', 1, 1.0);
          if (Math.random() < 0.15) this.particles.spawnShockwave(midX, midY, '#c084fc', 28);
        } else if (trail && trail.id === 'rainbow') {
          // Prizmatik Spektrum Işıması
          const rColor = `hsl(${((this.frames || 0) * 12 + 60) % 360}, 100%, 65%)`;
          this.particles.spawnThruster(midX, midY, rColor);
        } else if (trail && trail.id === 'toxic') {
          // Zehirli Biyoplazma Zümrüt Parıltısı
          this.particles.spawnExplosion(midX, midY, Math.random() < 0.5 ? '#05ffa1' : '#10b981', 1, 0.8);
        } else if (skinId === 'solar') {
          // Güneş Kıvılcımları
          this.particles.spawnExplosion(midX, midY, Math.random() < 0.5 ? '#ff9100' : '#ff3d00', 1, 0.8);
        } else if (skinId === 'toxic') {
          this.particles.spawnExplosion(midX, midY, Math.random() < 0.5 ? '#05ffa1' : '#10b981', 1, 0.6);
        } else if (skinId === 'phantom') {
          this.particles.spawnExplosion(midX, midY, Math.random() < 0.5 ? '#e0f7fa' : '#a855f7', 1, 0.7);
        } else {
          // Standart İyon İzi
          this.particles.spawnThruster(midX, midY, '#00f0ff');
        }
      }
    }

    // Kalkan Yenilenmesi (Dengeli Hayatta Kalma: Hasar almadan 4.5 sn durulmalı, serbest ölümsüzlük yok!)
    const regenThreshold = this.player.combatZone === 'rear' ? 240 : 300; // ~4 - 5 saniye hasar almama şartı
    const regenRate = 0.12; // Yavaş ve dikkatli kalkan şarjı

    this.player.shieldRegenTimer += dt;
    if (this.player.shieldRegenTimer > regenThreshold) {
      if (this.player.shield < this.player.maxShield) {
        this.player.shield = Math.min(this.player.maxShield, this.player.shield + regenRate * dt);
        if (this.frames % 4 === 0) this.updateStatusBarsOnly();
      }
      // Otomatik bedava CAN (HP) yenilenmesi kaldırıldı: Can sadece Gövde Onarım kartları veya nanobotlarla iyileşir!
    }

    // Telegraph Lazer Uyarılarını Güncelle
    for (let i = this.telegraphs.length - 1; i >= 0; i--) {
      const tel = this.telegraphs[i];
      tel.timer -= dt;
      if (tel.timer <= 0) {
        if (tel.type === 'dive_bomber') {
          this.enemies.push(new Enemy(tel.x, -25, 'dive_bomber', 1 + (this.wave - 1) * 0.15, 1.1 * (this.waveSpeedBonus || 1.0)));
        } else if (tel.type === 'kamikaze') {
          this.enemies.push(new Enemy(tel.x, -25, 'kamikaze', 1 + (this.wave - 1) * 0.15, 1.25 * (this.waveSpeedBonus || 1.0)));
        } else if (tel.type === 'laser_beam') {
          if (!this.activeBeams) this.activeBeams = [];
          this.activeBeams.push({
            x: tel.x,
            width: 32,
            timer: 45, // ~0.75s active beam
            maxTimer: 45
          });
          sounds.playBossAlarm();
          this.screenShake = 6;
        } else {
          this.enemies.push(new Enemy(tel.x, -35, 'asteroid_m', 1, 1.6 * (this.waveSpeedBonus || 1.0)));
        }
        this.telegraphs.splice(i, 1);
      }
    }

    // Aktif Enerji Işınlarını (Death Beam) Güncelle & Hasar Kontrolü
    if (this.activeBeams) {
      for (let i = this.activeBeams.length - 1; i >= 0; i--) {
        const beam = this.activeBeams[i];
        beam.timer -= dt;
        if (Math.abs(this.player.x - beam.x) < (beam.width / 2 + this.player.radius * 0.75)) {
          if (!this.player.beamHitCooldown || this.player.beamHitCooldown <= 0) {
            this.takeDamage(16);
            this.player.beamHitCooldown = 30;
            this.particles.spawnShockwave(this.player.x, this.player.y, '#ff0055', 110);
            vibrate.heavy();
          }
        }
        if (beam.timer <= 0) {
          this.activeBeams.splice(i, 1);
        }
      }
      if (this.player.beamHitCooldown > 0) {
        this.player.beamHitCooldown -= dt;
      }
    }

    // Güçlendirme Kapsüllerini Güncelle & Toplama
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.update(this.height, dt);

      const dist = Math.hypot(p.x - this.player.x, p.y - this.player.y);
      if (dist < p.radius + this.player.radius) {
        sounds.playPowerup();
        vibrate.success();
        this.particles.spawnShockwave(p.x, p.y, p.color, 140);

        if (p.type === 'overcharge') {
          this.player.overchargeTimer = 160; // ~2.6 saniye (kullanıcı talebi: 2-3 saniyelik)
        } else if (p.type === 'shield') {
          this.player.shield = Math.min(this.player.maxShield, this.player.shield + 25);
          this.updateHUD();
        } else if (p.type === 'magnet') {
          this.player.vacuumTimer = 180; // 3 saniye mega vakum
        } else if (p.type === 'nuke') {
          // Taktiksel EMP Savunması (Düşmanları yok etmez, gemi etrafındaki mermileri savuşturur)
          sounds.playNuke();
          vibrate.medium();
          this.screenShake = 6;
          this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 240);
          this.enemyProjectiles = this.enemyProjectiles.filter(ep => {
            return Math.hypot(ep.x - this.player.x, ep.y - this.player.y) > 240;
          });
          this.particles.spawnFloatingText(this.player.x, this.player.y - 30, 'EMP SAVUNMA!', '#00f0ff', 15);
        }
        this.powerups.splice(i, 1);
      } else if (p.toRemove) {
        this.powerups.splice(i, 1);
      }
    }

    // Altın Uzay Sandıkları Güncelle & Toplama
    for (let i = this.luckyChests.length - 1; i >= 0; i--) {
      const chest = this.luckyChests[i];
      chest.update(dt);

      const dist = Math.hypot(chest.x - this.player.x, chest.y - this.player.y);
      if (dist < chest.radius + this.player.radius) {
        this.luckyChests.splice(i, 1);
        this.triggerLuckyChest();
        break;
      } else if (chest.toRemove) {
        this.luckyChests.splice(i, 1);
      }
    }

    // Rastgele Uzay Olayları (Mini Space Events: Fırtına, Kristal, Karadelik, Güneş Patlaması, Kargo Baskını)
    if (!this.activeEvent && !this.currentBoss && this.gameTime >= this.nextEventTime) {
      const roll = Math.random();
      let eventType, eventName, duration;
      if (this.gameTime < 75) {
        // İlk 75 saniyede oyuncuyu sıkmamak için karadelik ÇIKMASIN!
        // Oyuncuyu ısıtan, ödüllü veya aksiyonlu olaylar çıksın
        if (roll < 0.55) {
          eventType = 'crystal_surge';
          eventName = '★ ALTIN KRİSTAL BULUTU! (6 SN)';
          duration = 6;
        } else {
          eventType = 'meteor_storm';
          eventName = '[!] ASTEROİT SAĞANAĞI! (8 SN)';
          duration = 8;
        }
      } else {
        if (roll < 0.40) {
          eventType = 'meteor_storm';
          eventName = '[!] ASTEROİT SAĞANAĞI! (8 SN)';
          duration = 8;
        } else if (roll < 0.75) {
          eventType = 'crystal_surge';
          eventName = '★ ALTIN KRİSTAL BULUTU! (6 SN)';
          duration = 6;
        } else {
          eventType = 'cargo_run';
          eventName = '>> GİZLİ KARGO GEMİSİ SIZDI! (8 SN)';
          duration = 8;
        }
      }

      this.activeEvent = {
        type: eventType,
        name: eventName,
        timer: duration * 60,
        maxTimer: duration * 60,
        spawnTick: 0,
        isLeft: Math.random() < 0.5,
        bhX: this.width / 2,
        bhY: this.height * 0.40
      };
      this.nextEventTime = this.gameTime + 38 + Math.random() * 22;
      if (eventBanner && eventBannerText) {
        const evIcons = {
          meteor_storm: 'bomb',
          crystal_surge: 'crystal',
          black_hole: 'energy',
          cargo_run: 'ship'
        };
        const eIcon = evIcons[this.activeEvent.type] || 'energy';
        eventBannerText.innerHTML = `${getPixelIconSvg(eIcon, 'sm')} ${this.activeEvent.name}`;
        eventBanner.classList.remove('hidden');
      }
      sounds.playBossAlarm();
      vibrate.medium();
    }

    if (this.activeEvent) {
      this.activeEvent.timer -= dt;
      this.activeEvent.spawnTick += dt;

      if (this.activeEvent.type === 'meteor_storm') {
        if (this.activeEvent.spawnTick >= 20) {
          this.activeEvent.spawnTick = 0;
          const sx = 35 + Math.random() * (this.width - 70);
          this.enemies.push(new Enemy(sx, -30, Math.random() < 0.25 ? 'asteroid_bomb' : 'asteroid_m', 1, 1.15));
        }
      } else if (this.activeEvent.type === 'crystal_surge') {
        if (this.activeEvent.spawnTick >= 20) {
          this.activeEvent.spawnTick = 0;
          const cx = 35 + Math.random() * (this.width - 70);
          this.gems.push(new Gem(cx, -20, 3));
        }
      } else if (this.activeEvent.type === 'cargo_run') {
        if (this.activeEvent.spawnTick >= 40) {
          this.activeEvent.spawnTick = -9999; // Tek kargo gemisi
          const cx = 50 + Math.random() * (this.width - 100);
          this.enemies.push(new Enemy(cx, -40, 'cargo_freighter', 1, 0.7));
          this.particles.spawnFloatingText(cx, 100, '>> GİZLİ KARGO GEMİSİ!', '#ffd700', 16);
        }
      } else if (this.activeEvent.type === 'black_hole') {
        const bx = this.activeEvent.bhX;
        const by = this.activeEvent.bhY;
        // Kristalleri merkeze doğru topla
        for (let gem of this.gems) {
          const d = Math.hypot(gem.x - bx, gem.y - by);
          if (d < 260) {
            gem.x += (bx - gem.x) * 0.08 * dt;
            gem.y += (by - gem.y) * 0.08 * dt;
          }
        }
        // Düşmanları çek ve ezici karadelik hasarıyla parçala
        for (let enemy of this.enemies) {
          const d = Math.hypot(enemy.x - bx, enemy.y - by);
          if (d < 260 && !enemy.isBoss && !(enemy.type && enemy.type.startsWith('boss'))) {
            enemy.x += (bx - enemy.x) * 0.06 * dt;
            enemy.y += (by - enemy.y) * 0.06 * dt;
          }
          if (d < 95) {
            enemy.hp -= 1.8 * dt; // Devasa ezici hasar!
            if (Math.random() < 0.45 * dt) {
              this.particles.spawnExplosion(enemy.x, enemy.y, '#bf5af2', 4, 1.4);
            }
          }
        }
        // Girdap partikülleri
        if (Math.random() < 0.4 * dt) {
          this.particles.spawnShockwave(bx, by, '#bf5af2', 80);
        }
      }

      if (this.activeEvent.timer <= 0) {
        if (this.activeEvent.type === 'black_hole') {
          // SÜPERNOVA ÇÖKÜŞÜ & KRİSTAL PATLAMASI
          const bx = this.activeEvent.bhX;
          const by = this.activeEvent.bhY;
          sounds.playJackpot();
          sounds.playNuke();
          vibrate.heavy();
          this.screenShake = 14;
          this.whiteFlash = 0.8;
          this.particles.spawnShockwave(bx, by, '#ffffff', 400);
          this.particles.spawnShockwave(bx, by, '#bf5af2', 300);
          this.particles.spawnFloatingText(bx, by - 20, '[!] SÜPERNOVA PATLAMASI!', '#ffd700', 16);
          // Tüm düşman mermilerini sil!
          this.enemyProjectiles = [];
          // Alan içindeki düşmanlara süpernova şoku!
          for (let enemy of this.enemies) {
            const d = Math.hypot(enemy.x - bx, enemy.y - by);
            if (d < 280) {
              enemy.hp -= 40;
              this.particles.spawnExplosion(enemy.x, enemy.y, '#bf5af2', 8, 2);
            }
          }
          // Dışa doğru saçılan 14 zengin kristal!
          for (let k = 0; k < 14; k++) {
            const angle = (k / 14) * Math.PI * 2;
            const dist = 30 + Math.random() * 45;
            const gx = bx + Math.cos(angle) * dist;
            const gy = by + Math.sin(angle) * dist;
            this.gems.push(new Gem(gx, gy, 3));
          }
        }
        this.activeEvent = null;
        if (eventBanner) eventBanner.classList.add('hidden');
      }
    }

    // Karadelik Girdapları (Vortex Laser Evolution)
    for (let v = this.vortices.length - 1; v >= 0; v--) {
      const vortex = this.vortices[v];
      vortex.timer -= dt;

      // Kristalleri girdaba doğru çek
      for (let gem of this.gems) {
        const d = Math.hypot(gem.x - vortex.x, gem.y - vortex.y);
        if (d < 130) {
          gem.x += (vortex.x - gem.x) * 0.1 * dt;
          gem.y += (vortex.y - gem.y) * 0.1 * dt;
        }
      }

      // Yakındaki düşmanlara hasar ver
      for (let enemy of this.enemies) {
        const d = Math.hypot(enemy.x - vortex.x, enemy.y - vortex.y);
        if (d < vortex.radius + enemy.radius) {
          enemy.hp -= 0.24 * dt;
          if (Math.random() < 0.25 * dt) {
            this.particles.spawnExplosion(vortex.x, vortex.y, '#d946ef', 2, 1);
          }
        }
      }

      if (vortex.timer <= 0) {
        this.vortices.splice(v, 1);
      }
    }

    // Oyuncu Silah Sistemleri
    this.updateWeapons(dt);

    // Düşman Doğuşu
    this.spawnEnemies(dt);

    // Düşmanları Güncelle & Çarpışma Kontrolleri
    this.updateEnemies(dt);

    // Kristal Toplama
    this.updateGems(dt);

    // Görsel Efektleri Güncelle
    this.particles.update(this.width, this.height);
  }

  updateWeapons(dt = 1.0) {
    // Ateş Hızı: Dengeli ve keyifli bir tempo
    const timeBonus = Math.min(0.25, (this.gameTime / 30) * 0.03); // Her 30 sn'de +%3
    const levelBonus = Math.min(0.20, (this.player.level - 1) * 0.02); // Seviye başına +%2
    const upgradeBonus = (this.player.upgrades.fireRate - 1) * 0.10; // Eklenti başına %10 artış
    // HAREKET ETMEDİĞİNDE: Bir tık daha hızlı seri ateş (+%25 hız artışı)
    const stationaryBonus = this.player.isStationary ? 0.25 : 0.0;
    // 5. YAKIN TEĞET ADRENALİNİ & SİBERPUNK JETİ: Graze yapıldığında anında hiper ateş hızı!
    const isCyberpunk = this.currentSkinId === 'cyberpunk';
    const adrenalineBoost = isCyberpunk ? 0.35 : 0.22;
    const adrenalineBonus = this.player.adrenalineTimer > 0 ? adrenalineBoost : 0.0;
    // 8. UÇUŞ DOKTRİNİ (Avcı / Interceptor) Atış Hızı Bonusu
    const archBonus = (this.player.fireRateBonus || 1.0) - 1.0;
    const speedMult = 1 + timeBonus + levelBonus + upgradeBonus + stationaryBonus + adrenalineBonus + archBonus;

    const baseInterval = this.player.isFever ? 11 : 21; // 21 frame başlangıç: dengeli, kademeli güçlenme
    const fireInterval = Math.max(7, Math.round(baseInterval / speedMult));

    // 1. Ana Silah Sistemi
    const zone = this.player.combatZone || 'mid';
    if (zone === 'rear') {
      // 3. Kademe (KESKİN NİŞANCI): ELEKTRO-RAY HYPER RAILGUN!
      // Ağır ritimli, ekranı boydan boya delen, devasa tekil darbe hasarı
      const railInterval = Math.max(22, fireInterval * 1.85);
      this.player.shootCooldown += dt;
      if (this.player.shootCooldown >= railInterval) {
        this.player.shootCooldown = 0;
        sounds.playRailgun();
        vibrate.heavy();
        this.screenShake = Math.max(this.screenShake, 5.0);

        const lvl = this.player.upgrades.laser;
        const isCrit = Math.random() < ((this.player.critChance || 0.08) + 0.15); // Sniper keskin nişancı kritik bonusu (+%15)
        const isOvercharge = this.player.overchargeTimer > 0;
        const critMult = isCrit ? 2.0 : 1.0;
        const dmgBonus = (this.player.isFever ? 3.0 : 0) + (isOvercharge ? 2.5 : 0);
        const railDmg = (14.0 + lvl * 4.8 + dmgBonus) * critMult * (this.player.damageMultiplier || 1.0);

        // Ağır darbeli elektro-ray railgun mermisi (artık birimlerin içinden geçmez, çarptığı hedefe tam darbe verir)
        this.playerBullets.push({
          x: this.player.x,
          y: this.player.y - 28,
          vx: 0,
          vy: -38,
          damage: railDmg,
          w: 12,
          h: 54,
          color: isCrit ? '#ffbe0b' : '#38bdf8',
          piercing: false,
          isRailgun: true,
          isCrit: isCrit,
          maxRange: 9999,
          traveled: 0
        });

        // Namlu patlaması ve eksenel elektrik arkları
        this.particles.spawnShockwave(this.player.x, this.player.y - 28, '#38bdf8', 44);
        for (let s = 0; s < 6; s++) {
          this.particles.spawnExplosion(this.player.x + (Math.random() * 10 - 5), this.player.y - 32 - s * 12, '#ffffff', 2, 1.2);
        }
      }
    } else {
      // 2. Kademe (HÜCUM & TAARRUZ): ÇİFT / ÜÇLÜ PLAZMA BLUSTER + GÜDÜMLÜ MİKRO FÜZELER
      const effectiveInterval = (zone === 'front') ? Math.max(5, Math.round(fireInterval * 0.78)) : fireInterval;
      this.player.shootCooldown += dt;
      if (this.player.shootCooldown >= effectiveInterval) {
        this.player.shootCooldown = 0;
        sounds.playLaser();
        vibrate.light();

        const isOvercharge = this.player.overchargeTimer > 0;
        const isVortex = this.player.evolutions.vortexLaser;
        const isCrit = Math.random() < (this.player.critChance || 0.08);
        const lvl = this.player.upgrades.laser;
        const skin = this.skins[this.currentSkinId] || this.skins.cyberpunk;

        let bColor = isOvercharge ? '#bf5af2' : (this.player.isFever ? '#ffbe0b' : skin.primary);
        if (isVortex) bColor = '#d946ef';

        const critMult = isCrit ? 1.6 : 1.0;
        const vortexMult = isVortex ? 1.3 : 1.0;
        const dmgBonus = (this.player.isFever ? 1.5 : 0) + (isOvercharge ? 1.4 : 0);
        const isPiercing = isOvercharge || isVortex;

        const calcDmg = (base) => (base + dmgBonus) * critMult * vortexMult * (this.player.damageMultiplier || 1.0);

        const pushBullet = (bx, by, vx, vy, dmg, w, h) => {
          this.playerBullets.push({
            x: bx,
            y: by,
            vx: vx,
            vy: vy,
            damage: calcDmg(dmg),
            w: w,
            h: h,
            color: bColor,
            piercing: isPiercing,
            isCrit: isCrit,
            isVortex: isVortex,
            maxRange: 850,
            traveled: 0
          });
        };

        if (lvl === 1) {
          pushBullet(this.player.x, this.player.y - 18, 0, -15, 3.8, 4, 12);
        } else if (lvl === 2) {
          pushBullet(this.player.x, this.player.y - 18, 0, -15.5, 4.4, 4.5, 14);
        } else if (lvl === 3) {
          pushBullet(this.player.x - 6, this.player.y - 16, 0, -16, 2.3, 3.8, 12);
          pushBullet(this.player.x + 6, this.player.y - 16, 0, -16, 2.3, 3.8, 12);
        } else if (lvl === 4) {
          pushBullet(this.player.x, this.player.y - 18, 0, -16, 2.6, 4, 13);
          pushBullet(this.player.x - 8, this.player.y - 14, -1.0, -15.5, 1.5, 3.5, 11);
          pushBullet(this.player.x + 8, this.player.y - 14, 1.0, -15.5, 1.5, 3.5, 11);
        } else {
          pushBullet(this.player.x - 10, this.player.y - 15, -1.5, -16.5, 1.8, 3.8, 12);
          pushBullet(this.player.x, this.player.y - 18, 0, -17, 3.0, 4.5, 15);
          pushBullet(this.player.x + 10, this.player.y - 15, 1.5, -16.5, 1.8, 3.8, 12);
        }

        // Güneş Fırtınası Jeti Özel Yeteneği: Her 7 atışta dev plazma alev bombası
        if (this.currentSkinId === 'solar') {
          this.player.solarShotCount = (this.player.solarShotCount || 0) + 1;
          if (this.player.solarShotCount >= 7) {
            this.player.solarShotCount = 0;
            sounds.playNuke();
            this.particles.spawnShockwave(this.player.x, this.player.y - 20, '#ff3d00', 36);
            this.playerBullets.push({
              x: this.player.x,
              y: this.player.y - 22,
              vx: 0,
              vy: -11,
              damage: 22 * (this.player.damageMultiplier || 1.0),
              w: 12,
              h: 12,
              color: '#ff3d00',
              piercing: true,
              isCrit: true,
              maxRange: 900,
              traveled: 0
            });
          }
        }
      }
    }

    // 2. Güdümlü Mikro-Füzeler
    if (this.player.upgrades.missiles > 0) {
      const missileRateMult = this.player.isStationary ? 1.25 : 1.0;
      this.player.missileCooldown += dt * missileRateMult;
      const missileInterval = Math.max(130, 220 - this.player.upgrades.missiles * 22);
      if (this.player.missileCooldown >= missileInterval && this.enemies.length > 0) {
        this.player.missileCooldown = 0;
        const isCluster = this.player.evolutions.clusterMissiles;
        const totalMissiles = this.player.upgrades.missiles;
        const baseDmg = (2.8 + this.player.upgrades.missiles * 0.9) * (isCluster ? 1.35 : 1.0) * (this.player.damageMultiplier || 1.0);

        for (let i = 0; i < totalMissiles; i++) {
          const isDirect = (i % 2 === 0);
          const side = (i % 2 === 0 ? -1 : 1);
          const offsetX = side * (12 + Math.floor(i / 2) * 8);

          if (isDirect) {
            // 1. saniyede DİREKT fırlatılan füze
            sounds.playMissile();
            this.homingMissiles.push({
              x: this.player.x + offsetX,
              y: this.player.y - 10,
              vx: (Math.random() - 0.5) * 2.5,
              vy: -5.5,
              speed: 8.5,
              damage: baseDmg,
              isCluster: isCluster,
              life: 200,
              state: 'active',
              delay: 0,
              targetX: 0,
              targetY: 0
            });
          } else {
            // Birkaç saniye gemiyi ve hedefi takip edip SONRADAN ATEŞLENEN kilitlenmiş füze (Stalker)
            this.homingMissiles.push({
              x: this.player.x + offsetX,
              y: this.player.y + 4,
              vx: 0,
              vy: 0,
              speed: 9.6,
              damage: baseDmg * 1.2,
              isCluster: isCluster,
              life: 220,
              state: 'stalking',
              delay: 80 + Math.random() * 30, // ~1.3 - 1.8 saniye takip edip bekler
              offsetX: offsetX,
              offsetY: 4 + Math.random() * 4,
              targetX: 0,
              targetY: 0
            });
          }
        }
      }
    }

    // 3. EMP Şok Dalgası (Acil durum savunması - uzun aralıklı)
    if (this.player.upgrades.emp > 0) {
      this.player.empCooldown += dt;
      const empInterval = Math.max(360, 600 - this.player.upgrades.emp * 80);
      if (this.player.empCooldown >= empInterval) {
        this.player.empCooldown = 0;
        this.triggerEMP();
      }
    }

    // Dönen Koruyucu Uydular Açısı
    if (this.player.upgrades.drones > 0) {
      this.player.droneAngle += 0.06 * dt;
    }

    // === EFSANEVİ EVRİM: SÜPERNOVA ÇEKİRDEĞİ (evo_supernova) ===
    if (this.player.evolutions && this.player.evolutions.supernova && this.enemies.length > 0) {
      this.supernovaTimer = (this.supernovaTimer || 0) + dt;
      if (this.supernovaTimer >= 180) { // ~3 saniyede bir nükleer atış
        this.supernovaTimer = 0;
        let targetEnemy = this.enemies.find(e => e.isBoss) || this.enemies[0];
        let maxNeighbors = -1;
        for (let e of this.enemies) {
          let count = 0;
          for (let other of this.enemies) {
            if (Math.hypot(e.x - other.x, e.y - other.y) < 120) count++;
          }
          if (count > maxNeighbors) {
            maxNeighbors = count;
            targetEnemy = e;
          }
        }
        if (targetEnemy) {
          this.supernovaOrbs.push({
            x: this.player.x,
            y: this.player.y - 15,
            targetX: targetEnemy.x,
            targetY: targetEnemy.y,
            speed: 8.0,
            life: 180
          });
          sounds.playBomb();
          vibrate.light();
          this.particles.spawnShockwave(this.player.x, this.player.y, '#ff3d00', 65);
        }
      }
    }

    // Süpernova Kürelerini Güncelle
    for (let o = this.supernovaOrbs.length - 1; o >= 0; o--) {
      const orb = this.supernovaOrbs[o];
      const dx = orb.targetX - orb.x;
      const dy = orb.targetY - orb.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 20 || orb.life <= 0) {
        this.supernovaWells.push({
          x: orb.x,
          y: orb.y,
          radius: 85,
          life: 210, // 3.5 sn kalır
          pulse: 0
        });
        this.screenShake = 10;
        sounds.playBomb();
        vibrate.success();
        this.particles.spawnShockwave(orb.x, orb.y, '#ffd700', 170);
        this.particles.spawnExplosion(orb.x, orb.y, '#ff3d00', 26, 4.5);
        this.supernovaOrbs.splice(o, 1);
        continue;
      }
      orb.x += (dx / dist) * orb.speed * dt;
      orb.y += (dy / dist) * orb.speed * dt;
      orb.life -= dt;
      if (Math.random() < 0.4 * dt) {
        this.particles.spawnExplosion(orb.x, orb.y, '#ffd700', 2, 1);
      }
    }

    // Süpernova Plazma Havuzlarını Güncelle (Mermileri Buharlaştırır & Ezici Hasar Verir - Optimize)
    for (let w = this.supernovaWells.length - 1; w >= 0; w--) {
      const well = this.supernovaWells[w];
      well.life -= dt;
      well.pulse += 0.08 * dt;
      const wellRadSq = well.radius * well.radius;

      for (let enemy of this.enemies) {
        if (enemy.hp <= 0 || enemy.toRemove) continue;
        const dx = enemy.x - well.x;
        const dy = enemy.y - well.y;
        const rSum = well.radius + enemy.radius;
        if (dx * dx + dy * dy < rSum * rSum) {
          enemy.hp -= 2.2 * dt * (this.player.damageMultiplier || 1.0);
          if (this.frames % 8 === 0) {
            this.particles.spawnExplosion(enemy.x, enemy.y, '#ff3d00', 1, 1.0);
          }
        }
      }

      for (let p = this.enemyProjectiles.length - 1; p >= 0; p--) {
        const proj = this.enemyProjectiles[p];
        const dx = proj.x - well.x;
        const dy = proj.y - well.y;
        if (dx * dx + dy * dy < wellRadSq) {
          if (this.frames % 6 === 0) {
            this.particles.spawnShockwave(proj.x, proj.y, '#ffd700', 18);
          }
          this.enemyProjectiles.splice(p, 1);
        }
      }

      if (well.life <= 0) {
        this.supernovaWells.splice(w, 1);
      }
    }

    // === EFSANEVİ EVRİM: KIYAMET TESLA MATRİSİ (evo_matrix) ===
    if (this.player.evolutions && this.player.evolutions.doomsdayMatrix && this.enemies.length > 0) {
      this.tetheredEnemies = [];
      for (let enemy of this.enemies) {
        if (enemy.hp <= 0 || enemy.toRemove) continue;
        const dx = enemy.x - this.player.x;
        const dy = enemy.y - this.player.y;
        if (dx * dx + dy * dy < 300 * 300) {
          this.tetheredEnemies.push(enemy);
          enemy.hp -= 0.45 * dt * (this.player.damageMultiplier || 1.0);
          if (this.tetheredEnemies.length >= 6) break;
        }
      }

      this.matrixChargeTimer = (this.matrixChargeTimer || 0) + dt;
      if (this.matrixChargeTimer >= 240) { // ~4 saniyede bir aşırı voltaj
        this.matrixChargeTimer = 0;
        if (this.tetheredEnemies.length > 0) {
          this.screenShake = 12;
          sounds.playTesla();
          vibrate.success();
          for (let enemy of this.tetheredEnemies) {
            enemy.hp -= 55 * (this.player.damageMultiplier || 1.0);
            this.particles.spawnShockwave(enemy.x, enemy.y, '#bf5af2', 90);
            this.particles.spawnExplosion(enemy.x, enemy.y, '#00f0ff', 12, 3);
            for (let p = this.enemyProjectiles.length - 1; p >= 0; p--) {
              if (Math.hypot(this.enemyProjectiles[p].x - enemy.x, this.enemyProjectiles[p].y - enemy.y) < 110) {
                this.enemyProjectiles.splice(p, 1);
              }
            }
          }
        }
      }
    } else {
      this.tetheredEnemies = [];
    }

    // === EFSANEVİ EVRİM: VAKUM AVCI DRONLARI (evo_void_drones) ===
    if (this.player.evolutions && this.player.evolutions.voidDrones && this.player.upgrades.drones > 0) {
      const droneCount = Math.min(6, 2 + this.player.upgrades.drones);
      const orbitRadius = this.player.evolutions.nanoBastion ? 62 : 45;
      for (let d = 0; d < droneCount; d++) {
        const angle = this.player.droneAngle + (d * (Math.PI * 2 / droneCount));
        const droneX = this.player.x + Math.cos(angle) * orbitRadius;
        const droneY = this.player.y + Math.sin(angle) * orbitRadius;

        for (let gem of this.gems) {
          if (gem.toRemove) continue;
          const gd = Math.hypot(gem.x - droneX, gem.y - droneY);
          if (gd < 160) {
            gem.x += (droneX - gem.x) * 0.24 * dt;
            gem.y += (droneY - gem.y) * 0.24 * dt;
            if (gd < 15) {
              this.player.xp += gem.value;
              this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + gem.value;
              this.checkLevelUp();
              gem.toRemove = true;
              this.droneOverdriveTimer = 100;
              this.particles.spawnExplosion(droneX, droneY, '#ffd700', 2, 1);
            }
          }
        }

        if (this.droneOverdriveTimer > 0 && Math.random() < 0.35 * dt) {
          let closest = null;
          let minDist = 320;
          for (let e of this.enemies) {
            const ed = Math.hypot(e.x - droneX, e.y - droneY);
            if (ed < minDist) {
              minDist = ed;
              closest = e;
            }
          }
          if (closest) {
            const bAng = Math.atan2(closest.y - droneY, closest.x - droneX);
            this.playerBullets.push({
              x: droneX,
              y: droneY,
              vx: Math.cos(bAng) * 11,
              vy: Math.sin(bAng) * 11,
              damage: 14 * (this.player.damageMultiplier || 1.0),
              w: 5,
              h: 12,
              color: '#ffd700',
              pierce: 1,
              traveled: 0,
              maxRange: 9999
            });
            sounds.playLaser();
          }
        }
      }
      if (this.droneOverdriveTimer > 0) this.droneOverdriveTimer -= dt;
    }

    // === MİKRO KLON SAVAŞ UÇAĞI (PET / WINGMAN SİSTEMİ) ===
    if ((this.player.upgrades.wingman || 0) > 0) {
      this.updateWingmen(dt);
    }

    // === KALICI HANGAR YOLDAŞ DRONE GÜNCELLEMESİ (COMPANION DRONE) ===
    if (this.companionDrone) {
      const cd = this.companionDrone;
      cd.angle += 0.04 * dt;
      const targetDroneX = this.player.x + Math.cos(cd.angle) * 36;
      const targetDroneY = this.player.y + Math.sin(cd.angle) * 22;
      cd.x += (targetDroneX - cd.x) * 0.15 * dt;
      cd.y += (targetDroneY - cd.y) * 0.15 * dt;

      cd.shootTimer = (cd.shootTimer || 0) + dt;
      const lvlMultiplier = 1 + (cd.level - 1) * 0.25;

      if (cd.cfg.type === 'laser' && cd.shootTimer >= 35) { // ~0.6 sn'de bir lazer
        cd.shootTimer = 0;
        let target = null;
        let minDist = 300;
        for (let e of this.enemies) {
          if (e.hp <= 0 || e.toRemove) continue;
          const d = Math.hypot(e.x - cd.x, e.y - cd.y);
          if (d < minDist) { minDist = d; target = e; }
        }
        if (target) {
          const ang = Math.atan2(target.y - cd.y, target.x - cd.x);
          this.playerBullets.push({
            x: cd.x,
            y: cd.y,
            vx: Math.cos(ang) * 12,
            vy: Math.sin(ang) * 12,
            damage: cd.cfg.baseDmg * lvlMultiplier * (this.player.damageMultiplier || 1.0),
            w: 4,
            h: 10,
            color: cd.cfg.color,
            pierce: 1,
            traveled: 0,
            maxRange: 9999
          });
          sounds.playLaser();
        }
      } else if (cd.cfg.type === 'missile' && cd.shootTimer >= 150) { // ~2.5 sn'de bir roket
        cd.shootTimer = 0;
        if (this.enemies.length > 0) {
          this.homingMissiles.push({
            x: cd.x,
            y: cd.y,
            vx: (Math.random() - 0.5) * 4,
            vy: -7,
            damage: cd.cfg.baseDmg * lvlMultiplier * (this.player.damageMultiplier || 1.0),
            target: this.enemies[Math.floor(Math.random() * this.enemies.length)],
            life: 180,
            color: cd.cfg.color
          });
          sounds.playMissile();
        }
      } else if (cd.cfg.type === 'repair' && cd.shootTimer >= 360) { // ~6 sn'de bir kalkan tamiri
        cd.shootTimer = 0;
        if (this.player.shield < this.player.maxShield) {
          this.player.shield = Math.min(this.player.maxShield, this.player.shield + Math.round(6 * lvlMultiplier));
          this.particles.spawnShockwave(cd.x, cd.y, cd.cfg.color, 45);
          sounds.playPowerup();
        }
      } else if (cd.cfg.type === 'tesla' && cd.shootTimer >= 170) { // ~2.8 sn'de bir zincirleme tesla arkı
        cd.shootTimer = 0;
        let count = 0;
        for (let e of this.enemies) {
          if (e.hp <= 0 || e.toRemove) continue;
          const d = Math.hypot(e.x - cd.x, e.y - cd.y);
          if (d < 280) {
            e.hp -= cd.cfg.baseDmg * lvlMultiplier * (this.player.damageMultiplier || 1.0);
            this.particles.spawnLightning(cd.x, cd.y, e.x, e.y, cd.cfg.color || '#bf5af2');
            this.particles.spawnExplosion(e.x, e.y, cd.cfg.color || '#bf5af2', 4, 1.4);
            count++;
            if (count >= 3) break;
          }
        }
        if (count > 0) {
          sounds.playTesla();
          vibrate.light();
        }
      } else if (cd.cfg.type === 'clone' && cd.shootTimer >= 22) { // ~0.35 sn'de bir ikiz mikro plazma desteği
        cd.shootTimer = 0;
        const cloneDmg = (cd.cfg.baseDmg * 0.5) * lvlMultiplier * (this.player.damageMultiplier || 1.0);
        for (let ox of [-4, 4]) {
          this.playerBullets.push({
            x: cd.x + ox,
            y: cd.y - 6,
            vx: 0,
            vy: -15,
            damage: cloneDmg,
            w: 3.5,
            h: 9,
            color: '#00f0ff',
            pierce: 1,
            traveled: 0,
            maxRange: 9999
          });
        }
        sounds.playLaser();
      }
    }

    // Mermileri Güncelle (Menzil Aşımı Kontrolü)
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      const b = this.playerBullets[i];
      const step = Math.hypot(b.vx * dt, b.vy * dt);
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.traveled = (b.traveled || 0) + step;

      // Kullanıcı İsteği: Hücum hattında yarım boy (~42px), orta hatta 2 kat boy (~115px) menzil sınırı!
      if (b.maxRange && b.traveled >= b.maxRange) {
        if (Math.random() < 0.45) {
          this.particles.spawnExplosion(b.x, b.y, b.color || '#ff0055', 2, 0.7);
        }
        this.playerBullets.splice(i, 1);
        continue;
      }

      if (b.y < -30 || b.x < -20 || b.x > this.width + 20) {
        this.playerBullets.splice(i, 1);
      }
    }

    // Güdümlü Füzeleri Güncelle (Performans Optimize)
    for (let i = this.homingMissiles.length - 1; i >= 0; i--) {
      const m = this.homingMissiles[i];

      // Akıllı Güdümlü Füze Hedefleme (Hızlı Mesafe Kontrolü)
      let closest = null;
      let minScore = Infinity;
      for (let enemy of this.enemies) {
        if (enemy.y < -40 || enemy.hp <= 0) continue;
        const dx = enemy.x - m.x;
        const dy = enemy.y - m.y;
        let score = Math.sqrt(dx * dx + dy * dy);
        const pdx = enemy.x - this.player.x;
        const pdy = enemy.y - this.player.y;
        const playerDist = Math.sqrt(pdx * pdx + pdy * pdy);

        if (enemy.isBoss || (enemy.type && enemy.type.startsWith('boss'))) {
          score -= 350;
        } else if (enemy.type === 'elite_scout') {
          score -= 200;
        }
        if (playerDist < 170) {
          score -= 150;
        }

        if (score < minScore) {
          minScore = score;
          closest = enemy;
        }
      }

      if (closest) {
        m.targetX = closest.x;
        m.targetY = closest.y;
      }

      if (m.state === 'stalking') {
        // Gemiye eşlik ederek hedefi izler ve kilitlenir
        const desiredX = this.player.x + (m.offsetX || 0);
        const desiredY = this.player.y + (m.offsetY || 0);
        m.x += (desiredX - m.x) * 0.25 * dt;
        m.y += (desiredY - m.y) * 0.25 * dt;

        m.delay -= dt;
        if (m.delay <= 0) {
          m.state = 'active';
          sounds.playMissile();
          vibrate.light();
          this.particles.spawnExplosion(m.x, m.y, '#ff0077', 3, 1.5);
          if (closest) {
            const angle = Math.atan2(closest.y - m.y, closest.x - m.x);
            m.vx = Math.cos(angle) * (m.speed * 0.6);
            m.vy = Math.sin(angle) * (m.speed * 0.6);
          } else {
            m.vx = (Math.random() - 0.5) * 2;
            m.vy = -6;
          }
        }
      } else {
        // Aktif uçuşta hedef takibi ve güdüm
        m.life -= dt;
        if (closest) {
          const targetAngle = Math.atan2(closest.y - m.y, closest.x - m.x);
          const currentAngle = Math.atan2(m.vy, m.vx);
          let diff = targetAngle - currentAngle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          const newAngle = currentAngle + diff * Math.min(1, 0.20 * dt);
          m.vx = Math.cos(newAngle) * m.speed;
          m.vy = Math.sin(newAngle) * m.speed;
        }

        m.x += m.vx * dt;
        m.y += m.vy * dt;

        // Duman ve itki alevi izi (Ayrıksı Neon Magenta - 6 frame aralıkla optimize edilmiş)
        if (this.frames % 6 === 0) {
          this.particles.spawnThruster(m.x, m.y + 4, '#ff0077');
        }

        if (m.life <= 0 || m.y < -30) {
          this.homingMissiles.splice(i, 1);
        }
      }
    }

    // 4. Efsanevi Evrim: Tesla İyon Fırtınası (evo_ion_storm)
    if (this.player.evolutions && this.player.evolutions.ionStorm && this.enemies.length > 0) {
      this.player.ionStormTimer = (this.player.ionStormTimer || 0) + dt;
      if (this.player.ionStormTimer >= 210) { // ~3.5 saniye
        this.player.ionStormTimer = 0;
        sounds.playTesla();
        this.screenShake = 6;
        this.barrierFlash = 8;

        const validEnemies = this.enemies.filter(e => e.hp > 0 && e.y > -20 && e.y < this.height);
        const targets = validEnemies.sort(() => 0.5 - Math.random()).slice(0, Math.min(8, Math.floor(5 + Math.random() * 4)));
        for (let target of targets) {
          const stormDmg = 14;
          target.hp -= stormDmg;
          this.particles.spawnShockwave(target.x, target.y, '#38bdf8', 60);
          this.particles.spawnExplosion(target.x, target.y, '#00f0ff', 6, 2.0);
          this.particles.spawnLightning(target.x + (Math.random() - 0.5) * 40, -10, target.x, target.y, '#38bdf8', 6);

          if (target.hp <= 0) {
            this.handleEnemyDeath(target);
          }
        }
      }
    }
  }

  triggerEMP() {
    sounds.playEMP();
    vibrate.medium();
    this.screenShake = 4;
    this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 200);

    const empRadius = 150 + this.player.upgrades.emp * 20;

    // Yalnızca EMP etki alanı (empRadius) içindeki düşman mermilerini temizle (Tüm ekranı bedava silmez)
    if (this.enemyProjectiles && this.enemyProjectiles.length > 0) {
      this.enemyProjectiles = this.enemyProjectiles.filter(proj => {
        const d = Math.hypot(proj.x - this.player.x, proj.y - this.player.y);
        return d >= empRadius;
      });
    }

    // Çevredeki düşmanlara makul ve dengeli alan hasarı
    for (let enemy of this.enemies) {
      const dist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
      if (dist < empRadius) {
        enemy.hp -= 4 + this.player.upgrades.emp * 2;
      }
    }
  }

  spawnEnemies(dt = 1.0) {
    this.spawnTimer += dt;

    // Dinamik Karşı Güçlenme (Kullanıcı İsteği: Oyuncu güçlendikçe düşmanlar ve zorluk da paralel olarak artsın)
    let playerUpgradeCount = 0;
    if (this.player.upgrades) {
      for (let k in this.player.upgrades) {
        playerUpgradeCount += Math.max(0, (this.player.upgrades[k] || 0) - 1);
      }
    }
    const powerScaling = (this.player.level - 1) * 0.08 + playerUpgradeCount * 0.04;
    const timeScaling = Math.min(0.65, (this.gameTime / 50) * 0.15);
    const diffScale = 0.52 + powerScaling + timeScaling;

    // === FIRTINA MODU: SAF ASTEROİD AKSİYONU VE REKOR AVI ===
    if (this.currentMode === 'storm') {
      let interval = 45;
      let speedMult = 0.85;

      if (this.gameTime < 25) {
        interval = 55;
        speedMult = 0.85;
      } else if (this.gameTime < 60) {
        interval = 40;
        speedMult = 1.05;
      } else if (this.gameTime < 100) {
        interval = 30;
        speedMult = 1.25;
      } else {
        interval = Math.max(16, 26 - Math.floor((this.gameTime - 100) * 0.15));
        speedMult = Math.min(1.7, 1.35 + (this.gameTime - 100) * 0.005);
      }
      speedMult *= (this.waveSpeedBonus || 1.0);

      if (this.spawnTimer >= interval) {
        this.spawnTimer = 0;
        const x = 30 + Math.random() * (this.width - 60);
        const roll = Math.random();
        const waveMult = diffScale * (1 + (this.wave - 1) * 0.12);

        if (roll < 0.16) {
          // Zincirleme Patlayan Kozmik Bomba Taşı
          this.enemies.push(new Enemy(x, -30, 'asteroid_bomb', waveMult, speedMult * 1.1));
        } else if (roll < 0.30) {
          // Manyetik & Şok Dalgası Yayan Kararsız Asteroit
          this.enemies.push(new Enemy(x, -30, 'volatile_asteroid', waveMult, speedMult * 1.05));
        } else if (roll < 0.52) {
          // Altın Değerinde Elit Zengin Taş (Hızlı & Bol Kristalli)
          const m = new Enemy(x, -30, 'asteroid_m', waveMult * 0.9, speedMult * 1.15);
          m.score = Math.round(m.score * 1.8);
          this.enemies.push(m);
        } else if (roll < 0.74) {
          // Bölünerek ekranı dolduran Büyük Taş
          this.enemies.push(new Enemy(x, -40, 'asteroid_l', waveMult * 1.1, speedMult * 0.9));
        } else {
          // Hızlı ikili/üçlü Kayan Yıldız Dalgası (Kombo Yapıcı)
          this.enemies.push(new Enemy(x, -20, 'asteroid_s', waveMult * 0.8, speedMult * 1.3));
          const x2 = 30 + Math.random() * (this.width - 60);
          this.enemies.push(new Enemy(x2, -35, 'asteroid_s', waveMult * 0.8, speedMult * 1.3));
          if (Math.random() < 0.4) {
            const x3 = 30 + Math.random() * (this.width - 60);
            this.enemies.push(new Enemy(x3, -50, 'asteroid_s', waveMult * 0.8, speedMult * 1.3));
          }
        }
      }

      // Fırtına modunda akıllı mermisiz tehlikeler (Kamikaze ve Lazer Çizgisi)
      if (this.gameTime >= 20 && Math.random() < 0.008 * dt && this.telegraphs.length < 2) {
        const warnX = 40 + Math.random() * (this.width - 80);
        const r = Math.random();
        this.telegraphs.push({
          x: warnX,
          timer: 45,
          maxTimer: 45,
          type: r < 0.45 ? 'kamikaze' : (r < 0.8 ? 'laser_beam' : 'fast_rock')
        });
      }
      return; // Fırtına modunda saf ve tempolu asteroit sağanağı
    }

    // === KLASİK / SEFER (CAMPAIGN 1-38) MODU BOSS SPAWN SİSTEMİ ===
    const lvlCfg = this.getLevelConfig(this.selectedLevel);
    const bInfo = Enemy.getBossInfo(lvlCfg.bossType);

    // Sinematik Boss Giriş Uyarısı (~3.5 sn önce alarm ve ekran başlığı)
    if (!this.currentBoss && !this.levelBossSpawned) {
      if (this.gameTime >= Math.max(8, lvlCfg.targetDuration - 4) && !this.levelBossWarningTriggered) {
        this.levelBossWarningTriggered = true;
        if (bossWarningOverlay && bossWarningOverlay.classList.contains('hidden')) {
          bossWarningOverlay.classList.remove('hidden');
          if (bossWarningName) {
            bossWarningName.textContent = `${bInfo.name} (${bInfo.subtitle})`;
            bossWarningName.style.color = bInfo.color;
          }
          sounds.playBossAlarm();
          vibrate.heavy();
          this.screenShake = 7;
        }
      }

      if (this.gameTime >= lvlCfg.targetDuration) {
        this.bossArenaActive = true;
        this.levelBossSpawned = true;
        if (bossWarningOverlay) bossWarningOverlay.classList.add('hidden');
        sounds.playBossAlarm();
        sounds.setBossMode(true);
        vibrate.heavy();
        this.screenShake = 14;

        this.currentBoss = new Enemy(this.width / 2, -75, lvlCfg.bossType, lvlCfg.hpMult, lvlCfg.speedMult);
        this.currentBoss.isLevelBoss = true;
        this.currentLevelBoss = this.currentBoss;
        this.particles.spawnShockwave(this.width / 2, 70, bInfo.color, 320);
        this.enemies.push(this.currentBoss);
        this.updateHUD();
      }
    }

    // === SEFER ARA ETKİNLİKLERİ (INTERMISSION DIRECTOR) ===
    if (!this.currentBoss && !this.levelBossSpawned && this.intermissionEvents) {
      // 1. FAZ (12. sn): KOZMİK HAZİNE & ALTIN ASTEROİD AKINTISI (Gold Rush)
      if (this.gameTime >= 12 && !this.intermissionEvents.goldRush) {
        this.intermissionEvents.goldRush = true;
        const cx = this.width / 2;
        this.enemies.push(new Enemy(cx - 70, -25, 'asteroid_gold', 0.45, 0.9 * (this.waveSpeedBonus || 1.0)));
        this.enemies.push(new Enemy(cx, -45, 'asteroid_gold', 0.45, 0.85 * (this.waveSpeedBonus || 1.0)));
        this.enemies.push(new Enemy(cx + 70, -25, 'asteroid_gold', 0.45, 0.9 * (this.waveSpeedBonus || 1.0)));
        this.particles.spawnFloatingText(cx, 100, '★ KOZMİK HAZİNE AKINTISI!', '#ffd700', 15);
      }

      // 2. FAZ (24. sn): DÜŞMAN AVCILAR V-FORMASYON AKINI (Swarm Strike)
      if (this.gameTime >= 24 && !this.intermissionEvents.swarmStrike) {
        this.intermissionEvents.swarmStrike = true;
        sounds.playBossAlarm();
        vibrate.medium();
        this.screenShake = 5;
        if (eventBanner && eventBannerText) {
          eventBannerText.innerHTML = `${getPixelIconSvg('target', 'sm')} DÜŞMAN ÖNCÜ FİLOSU YAKLAŞIYOR!`;
          eventBanner.classList.remove('hidden');
          setTimeout(() => {
            if (!this.activeEvent) eventBanner.classList.add('hidden');
          }, 3000);
        }
        const cx = this.width / 2;
        this.enemies.push(new Enemy(cx, -35, 'scout', lvlCfg.hpMult, 1.15 * (this.waveSpeedBonus || 1.0)));
        this.enemies.push(new Enemy(cx - 65, -55, 'scout', lvlCfg.hpMult * 0.9, 1.1 * (this.waveSpeedBonus || 1.0)));
        this.enemies.push(new Enemy(cx + 65, -55, 'scout', lvlCfg.hpMult * 0.9, 1.1 * (this.waveSpeedBonus || 1.0)));
        this.enemies.push(new Enemy(cx - 120, -75, 'dive_bomber', lvlCfg.hpMult * 0.85, 1.2 * (this.waveSpeedBonus || 1.0)));
        this.enemies.push(new Enemy(cx + 120, -75, 'dive_bomber', lvlCfg.hpMult * 0.85, 1.2 * (this.waveSpeedBonus || 1.0)));
      }

      // 3. FAZ (38. sn): UZAY KAÇAKÇISI İSTASYONU (Space Smuggler Merchant)
      if (this.gameTime >= 38 && !this.intermissionEvents.merchantVisit && (lvlCfg.targetDuration - this.gameTime) >= 14) {
        this.intermissionEvents.merchantVisit = true;
        this.openMerchant();
      }

      // 4. FAZ (55. sn, 80s+ süren uzun seviyelerde): ZIRHLI KRUVAZÖR KUŞATMASI (Armored Cruiser Mini-Raid)
      if (this.gameTime >= 55 && lvlCfg.targetDuration >= 80 && !this.intermissionEvents.cruiserRaid) {
        this.intermissionEvents.cruiserRaid = true;
        sounds.playBossAlarm();
        vibrate.medium();
        this.screenShake = 7;
        if (eventBanner && eventBannerText) {
          eventBannerText.innerHTML = `${getPixelIconSvg('skull', 'sm')} AĞIR ZIRHLI KRUVAZÖR TESPİT EDİLDİ!`;
          eventBanner.classList.remove('hidden');
          setTimeout(() => {
            if (!this.activeEvent) eventBanner.classList.add('hidden');
          }, 3200);
        }
        const cx = this.width / 2;
        this.enemies.push(new Enemy(cx, -45, 'cruiser', lvlCfg.hpMult * 1.1, 0.75 * (this.waveSpeedBonus || 1.0)));
        this.enemies.push(new Enemy(cx - 80, -60, 'escort_fighter', lvlCfg.hpMult * 0.9, 0.95 * (this.waveSpeedBonus || 1.0)));
        this.enemies.push(new Enemy(cx + 80, -60, 'escort_fighter', lvlCfg.hpMult * 0.9, 0.95 * (this.waveSpeedBonus || 1.0)));
      }
    }

    // BOSS AKTİFKEN ÖZEL KARŞILAŞMA AKIŞI:
    // Kullanıcı isteği: Boss geldiğinde meteorlar neredeyse hiç gelmesin (astroitlerle değil boss ile uğraşsın),
    // bunun yerine güdümlü savaşçılar (escort_fighter & dive_bomber) gelsin.
    if (this.currentBoss && !this.currentBoss.toRemove) {
      if (this.spawnTimer >= 80) {
        this.spawnTimer = 0;
        const escortCount = this.enemies.filter(e => e.type === 'escort_fighter' || e.type === 'dive_bomber').length;
        if (escortCount < 3) {
          const side = Math.random() < 0.5 ? -1 : 1;
          const sx = Math.max(35, Math.min(this.width - 35, this.currentBoss.x + side * (60 + Math.random() * 60)));
          const sy = Math.max(15, this.currentBoss.y + 20);

          if (Math.random() < 0.70) {
            // Güdümlü Boss Muhafızı (Oyuncuyu takip edip plazma atar)
            this.enemies.push(new Enemy(sx, sy, 'escort_fighter', 1, 1.0 * (this.waveSpeedBonus || 1.0)));
          } else {
            // Güdümlü Dalış Uçağı
            this.enemies.push(new Enemy(sx, -20, 'dive_bomber', 1, 1.05 * (this.waveSpeedBonus || 1.0)));
          }
        } else if (Math.random() < 0.08) {
          // Çok nadiren kenardan oyuncuya acil yardım amaçlı 1 adet minik kristal taş süzülebilir
          const x = 30 + Math.random() * (this.width - 60);
          this.enemies.push(new Enemy(x, -20, 'asteroid_s', 1, 0.65));
        }
      }
      return; // Normal meteor dalgalarını tamamen durdur
    }

    let interval = 38;
    let speedMult = 0.76;

    // Seviye Bazlı Akış: Başlangıçta taşlar bol ve tempolu gelsin, oyuncuyu anında sarsın!
    if (this.player.level <= 2) {
      // 1. ve 2. Seviye: Hızlı tempolu akış (~0.6 saniyede bir), tek vuruşta patlayan zengin taşlar!
      interval = 36;
      speedMult = 0.76;
    } else if (this.player.level === 3) {
      interval = 40;
      speedMult = 0.85;
    } else if (this.gameTime < 50) {
      interval = 38;
      speedMult = 0.90;
    } else if (this.gameTime < 85) {
      interval = 34;
      speedMult = 1.0;
    } else {
      interval = Math.max(22, 32 - Math.floor((this.gameTime - 85) * 0.18));
      speedMult = Math.min(1.4, 1.05 + (this.gameTime - 85) * 0.005);
    }
    speedMult *= (this.waveSpeedBonus || 1.0);

    // Ekranda aşırı yığılmayı önleyen düşman sayısı tavanı
    const maxEnemies = this.player.level <= 2 ? 10 : (this.player.level === 3 ? 12 : 16);
    if (this.enemies.length >= maxEnemies) {
      return;
    }

    if (this.spawnTimer >= interval) {
      this.spawnTimer = 0;
      const x = 35 + Math.random() * (this.width - 70);
      const roll = Math.random();
      const waveMultiplier = diffScale * (1 + (this.wave - 1) * 0.12);

      // 3. DİNAMİK ÇEVRE TEHDİDİ: Kararsız Plazma Reaktörü (Volatile Plasma Core)
      // Oyuncu 5 vuruşta patlatıp tüm ekranı ve mermileri silebilir!
      const hasCore = this.enemies.some(e => e.type === 'volatile_core');
      if (!hasCore && this.gameTime > 14 && Math.random() < 0.065) {
        this.enemies.push(new Enemy(x, -35, 'volatile_core', waveMultiplier, speedMult * 0.65));
        return;
      }

      // === İLK BOSS SONRASI AŞAMA: Eski 3 Kademeli Sistem & Büyük Taşlar Geri Döner! ===
      if (this.firstBossDefeated) {
        if (roll < 0.22) {
          // Eski sistemdeki büyük taşlar (Vurulunca 2 orta taşa bölünür)
          this.enemies.push(new Enemy(x, -40, 'asteroid_l', waveMultiplier, speedMult));
        } else if (roll < 0.44) {
          // Orta taşlar (Vurulunca 2 küçük taşa bölünür)
          this.enemies.push(new Enemy(x, -30, 'asteroid_m', waveMultiplier, speedMult));
        } else if (roll < 0.60) {
          // Küçük taşlar
          this.enemies.push(new Enemy(x, -20, 'asteroid_s', waveMultiplier, speedMult));
        } else if (roll < 0.72) {
          // Bomba taş
          this.enemies.push(new Enemy(x, -30, 'asteroid_bomb', waveMultiplier, speedMult));
        } else if (roll < 0.86) {
          // Scout avcı
          this.enemies.push(new Enemy(x, -25, 'scout', waveMultiplier, speedMult));
        } else {
          // Kruvazör
          this.enemies.push(new Enemy(x, -35, 'cruiser', waveMultiplier, speedMult));
        }
      }
      // === İLK BOSS ÖNCESİ AŞAMALAR (2 Kademeli Hızlı Taş Akışı) ===
      // 1. AŞAMA (Seviye 1-2): Kendi kendine gelen en ufaklar (%55) + 1 vurunca 2'ye bölünen orta taşlar (%35) + Bomba (%10)
      else if (this.player.level <= 2) {
        if (roll < 0.55) {
          // Kendi kendine gelen en ufak taşlar (1 vuruşta patlar, XP verir)
          this.enemies.push(new Enemy(x, -20, 'asteroid_s', waveMultiplier, speedMult));
        } else if (roll < 0.90) {
          // 1 patlatınca 2'ye bölünen orta taş
          this.enemies.push(new Enemy(x, -30, 'asteroid_m', waveMultiplier, speedMult));
        } else {
          // Bomba taş
          this.enemies.push(new Enemy(x, -30, 'asteroid_bomb', waveMultiplier, speedMult));
        }
      }
      // 2. AŞAMA (Seviye 3): Zengin Taş Akışı
      else if (this.player.level === 3) {
        if (roll < 0.45) {
          this.enemies.push(new Enemy(x, -20, 'asteroid_s', waveMultiplier, speedMult));
        } else if (roll < 0.82) {
          this.enemies.push(new Enemy(x, -30, 'asteroid_m', waveMultiplier, speedMult));
        } else {
          this.enemies.push(new Enemy(x, -30, 'asteroid_bomb', waveMultiplier, speedMult));
        }
      }
      // 3. AŞAMA (Seviye 4+ ve 40-70 sn): Mini Avcılar (Scout) devreye girer
      else if (this.gameTime < 70) {
        if (roll < 0.12) {
          this.enemies.push(new Enemy(x, -30, 'asteroid_bomb', waveMultiplier, speedMult));
        } else if (roll < 0.40) {
          this.enemies.push(new Enemy(x, -30, 'asteroid_m', waveMultiplier, speedMult));
        } else if (roll < 0.70) {
          this.enemies.push(new Enemy(x, -20, 'asteroid_s', waveMultiplier, speedMult));
        } else {
          this.enemies.push(new Enemy(x, -25, 'scout', waveMultiplier, speedMult));
        }
      }
      // 4. AŞAMA (70+ sn): Kruvazörler ve tam filo
      else {
        if (roll < 0.10) {
          this.enemies.push(new Enemy(x, -30, 'asteroid_bomb', waveMultiplier, speedMult));
        } else if (roll < 0.35) {
          this.enemies.push(new Enemy(x, -30, 'asteroid_m', waveMultiplier, speedMult));
        } else if (roll < 0.60) {
          this.enemies.push(new Enemy(x, -20, 'asteroid_s', waveMultiplier, speedMult));
        } else if (roll < 0.85) {
          this.enemies.push(new Enemy(x, -25, 'scout', waveMultiplier, speedMult));
        } else {
          this.enemies.push(new Enemy(x, -35, 'cruiser', waveMultiplier, speedMult));
        }
      }
    }

    // Tehlike Uyarısı & Kamikaze / Lazer Işını Doğuşu (Sadece Seviye 2+ ve 25. sn sonrasında)
    if (this.gameTime >= 25 && Math.random() < 0.009 * dt && this.telegraphs.length < 2) {
      const warnX = 40 + Math.random() * (this.width - 80);
      const r = Math.random();
      let telType = 'kamikaze';
      if (r < 0.40) telType = 'kamikaze';
      else if (r < 0.75) telType = 'laser_beam';
      else telType = 'dive_bomber';

      this.telegraphs.push({
        x: warnX,
        timer: 45, // ~0.75 saniye önceden lazer uyarısı
        maxTimer: 45,
        type: telType
      });
    }

    // Altın Elit Avcı Mini-Boss Doğuşu (65+ sn ve boss aktif değilken nadir doğar)
    if (this.gameTime >= 65 && !this.currentBoss && Math.random() < 0.0035 * dt && !this.enemies.some(e => e.type === 'elite_scout')) {
      const eliteX = 40 + Math.random() * (this.width - 80);
      const waveMult = diffScale * (1 + (this.wave - 1) * 0.12);
      this.enemies.push(new Enemy(eliteX, -35, 'elite_scout', waveMult, speedMult));
    }
  }

  updateEnemies(dt = 1.0) {
    // Düşmanları Güncelle
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(this.player.x, this.player.y, this.enemyProjectiles, this.width, this.height, dt);

      // Boss Öfke Modu (2. Faz) Bildirimi
      if ((enemy.isBoss || enemy.type.startsWith('boss')) && enemy.justEnraged) {
        enemy.justEnraged = false;
        sounds.playBossAlarm();
        sounds.setBossEnraged(true);
        vibrate.heavy();
        this.screenShake = 14;
        this.particles.spawnShockwave(enemy.x, enemy.y, enemy.color || '#ff1744', 320);
      }

      // 1. Mermi ile Çarpışma Kontrolü
      for (let j = this.playerBullets.length - 1; j >= 0; j--) {
        const bullet = this.playerBullets[j];
        const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
        if (dist < enemy.radius + 6) {
          let hitDamage = bullet.damage;

          // 7. BOSS KIRILABİLİR SİLAH PODLARI & SAVUNMASIZ ÇEKİRDEK (WEAKPOINT)
          if (enemy.isBoss || enemy.type.startsWith('boss')) {
            const relX = bullet.x - enemy.x;
            // Sol Pod Vuruşu
            if (relX < -12 && !enemy.leftPodDestroyed) {
              enemy.leftPodHp = (enemy.leftPodHp || 50) - hitDamage;
              this.particles.spawnExplosion(bullet.x, bullet.y, '#ff0055', 4, 1.4);
              if (enemy.leftPodHp <= 0) {
                enemy.leftPodDestroyed = true;
                sounds.playExplosion(true);
                this.screenShake = 9;
                this.particles.spawnShockwave(enemy.x - 26, enemy.y, '#ff0055', 130);
                this.particles.spawnExplosion(enemy.x - 26, enemy.y, '#ff0055', 20, 3.5);
              }
            }
            // Sağ Pod Vuruşu
            else if (relX > 12 && !enemy.rightPodDestroyed) {
              enemy.rightPodHp = (enemy.rightPodHp || 50) - hitDamage;
              this.particles.spawnExplosion(bullet.x, bullet.y, '#ff0055', 4, 1.4);
              if (enemy.rightPodHp <= 0) {
                enemy.rightPodDestroyed = true;
                sounds.playExplosion(true);
                this.screenShake = 9;
                this.particles.spawnShockwave(enemy.x + 26, enemy.y, '#ff0055', 130);
                this.particles.spawnExplosion(enemy.x + 26, enemy.y, '#ff0055', 20, 3.5);
              }
            }
            // İki pod da yok edildiğinde: AÇIK ÇEKİRDEK - %40 KRİTİK ZAYIF NOKTA HASARI!
            if (enemy.leftPodDestroyed && enemy.rightPodDestroyed && Math.abs(relX) <= 16) {
              hitDamage *= 1.4;
              sounds.playCrit();
              this.particles.spawnExplosion(bullet.x, bullet.y, '#ffe600', 8, 2.5);
            }
          }

          const critChance = 0.12 + (this.currentAnomaly?.type === 'quantum_surge' ? 0.30 : 0);
          const isCrit = bullet.isCrit || Math.random() < critChance;
          if (isCrit) {
            const critMult = this.currentAnomaly?.type === 'void_rift' ? 2.5 : 2.0;
            hitDamage *= critMult;
            sounds.playCritHit();
            this.particles.spawnFloatingText(enemy.x, enemy.y - 14, `CRIT! ${Math.round(hitDamage)}`, '#ff0055', 15);
            this.particles.spawnExplosion(bullet.x, bullet.y, '#ff0055', 8, 2.5);
          } else {
            sounds.playHitmarker();
            this.particles.spawnExplosion(bullet.x, bullet.y, bullet.color || '#00f0ff', 4, 2);
          }

          // Mutlak Sıfır Kriyojenik Blaster Evrimi (Dondurma)
          if (this.player.evolutions && this.player.evolutions.cryoBlaster) {
            enemy.frozen = Math.min(150, (enemy.frozen || 0) + 50);
            if (Math.random() < 0.30) {
              sounds.playFreeze();
              this.particles.spawnExplosion(bullet.x, bullet.y, '#38bdf8', 4, 1.4);
            }
          }

          enemy.hp -= hitDamage;

          // Tesla Zincirleme Yıldırım (Dengeli hayatta kalma ölçeklemesi)
          if (this.player.upgrades.tesla > 0 && Math.random() < (0.18 + this.player.upgrades.tesla * 0.08)) {
            let zapCount = 0;
            const maxZaps = this.player.upgrades.tesla; // Seviye arttıkça hedef sayısı (1, 2, 3, 4 hedef)
            const teslaDmg = (2.2 + this.player.upgrades.tesla * 1.4) * (this.player.damageMultiplier || 1);
            for (let other of this.enemies) {
              if (other !== enemy && !other.toRemove && other.hp > 0) {
                const ed = Math.hypot(other.x - enemy.x, other.y - enemy.y);
                if (ed < 155) {
                  other.hp -= teslaDmg;
                  this.particles.spawnLightning(enemy.x, enemy.y, other.x, other.y, '#38bdf8');
                  this.particles.spawnExplosion(other.x, other.y, '#38bdf8', 4, 1.8);
                  if (other.hp <= 0) {
                    this.handleEnemyDeath(other);
                  }
                  zapCount++;
                  if (zapCount >= maxZaps) break;
                }
              }
            }
          }

          if (bullet.isVortex && Math.random() < 0.35 && this.vortices.length < 6) {
            this.vortices.push({ x: bullet.x, y: bullet.y, timer: 75, radius: 45 });
          }

          if (bullet.isRailgun) {
            // Railgun: Hedefe çarptığında güçlü şok dalgası ve patlama yaratır, birimlerin içinden geçmez!
            this.particles.spawnShockwave(bullet.x, enemy.y, '#38bdf8', 36);
            this.particles.spawnExplosion(bullet.x, enemy.y, '#ffffff', 6, 1.8);
            this.playerBullets.splice(j, 1);
          } else if (bullet.piercing) {
            bullet.penetrations = (bullet.penetrations || 0) + 1;
            if (bullet.penetrations >= 3) {
              this.playerBullets.splice(j, 1);
            }
          } else {
            this.playerBullets.splice(j, 1);
          }
          break;
        }
      }

      // 2. Güdümlü Füze ile Çarpışma
      for (let j = this.homingMissiles.length - 1; j >= 0; j--) {
        const missile = this.homingMissiles[j];
        if (missile.state && missile.state !== 'active') continue;
        const dist = Math.hypot(missile.x - enemy.x, missile.y - enemy.y);
        if (dist < enemy.radius + 8) {
          enemy.hp -= missile.damage;
          if (missile.isCluster || this.player.evolutions.clusterMissiles) {
            sounds.playNuke();
            this.screenShake = 3;
            this.particles.spawnShockwave(missile.x, missile.y, '#ff3d00', 70);
            const mX = missile.x;
            const mY = missile.y;
            for (let p = this.enemyProjectiles.length - 1; p >= 0; p--) {
              const ep = this.enemyProjectiles[p];
              const epDx = ep.x - mX;
              const epDy = ep.y - mY;
              if (epDx * epDx + epDy * epDy < 48 * 48) {
                this.enemyProjectiles.splice(p, 1);
              }
            }
            for (let other of this.enemies) {
              if (other !== enemy && other.hp > 0) {
                const oDx = other.x - mX;
                const oDy = other.y - mY;
                if (oDx * oDx + oDy * oDy < 60 * 60) {
                  other.hp -= 15;
                  this.particles.spawnExplosion(other.x, other.y, '#ff5500', 3, 1.8);
                }
              }
            }
          } else {
            this.particles.spawnExplosion(missile.x, missile.y, '#ff5500', 4, 2.2);
            this.screenShake = 1.5;
            sounds.playExplosion(false);
          }
          this.homingMissiles.splice(j, 1);
          break;
        }
      }

      // 3. Koruyucu Drone Çarpışması & Drone Lazer Ağı
      if (this.player.upgrades.drones > 0) {
        const droneCount = this.player.upgrades.drones;
        const isBastion = this.player.evolutions && this.player.evolutions.nanoBastion;
        const orbitRadius = isBastion ? 62 : 45;
        const droneDmg = (isBastion ? 0.35 : 0.12) * dt;
        for (let d = 0; d < droneCount; d++) {
          const angle = this.player.droneAngle + (d * (Math.PI * 2 / droneCount));
          const droneX = this.player.x + Math.cos(angle) * orbitRadius;
          const droneY = this.player.y + Math.sin(angle) * orbitRadius;
          const dist = Math.hypot(droneX - enemy.x, droneY - enemy.y);
          if (dist < enemy.radius + 14) {
            enemy.hp -= droneDmg;
            this.particles.spawnExplosion(droneX, droneY, isBastion ? '#00f0ff' : '#05ffa1', 2, 1.2);
          }
        }

        // Dronelar arası dönen Lazer Ağı (Laser Net)
        if (droneCount >= 2) {
          for (let d = 0; d < droneCount; d++) {
            const a1 = this.player.droneAngle + (d * (Math.PI * 2 / droneCount));
            const a2 = this.player.droneAngle + (((d + 1) % droneCount) * (Math.PI * 2 / droneCount));
            const x1 = this.player.x + Math.cos(a1) * orbitRadius;
            const y1 = this.player.y + Math.sin(a1) * orbitRadius;
            const x2 = this.player.x + Math.cos(a2) * orbitRadius;
            const y2 = this.player.y + Math.sin(a2) * orbitRadius;

            const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
            let t = ((enemy.x - x1) * (x2 - x1) + (enemy.y - y1) * (y2 - y1)) / l2;
            t = Math.max(0, Math.min(1, t));
            const closeX = x1 + t * (x2 - x1);
            const closeY = y1 + t * (y2 - y1);
            if (Math.hypot(enemy.x - closeX, enemy.y - closeY) < enemy.radius + 6) {
              enemy.hp -= 0.14 * dt;
              if (Math.random() < 0.25) {
                this.particles.spawnExplosion(closeX, closeY, '#05ffa1', 2, 1);
              }
            }
          }
        }
      }

      // 4. Oyuncu ile Çarpışma / Yakın Teğet (Graze)
      const isThisBoss = enemy.isBoss || (enemy.type && enemy.type.startsWith('boss'));
      const playerDist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
      if (playerDist < enemy.radius + this.player.radius) {
        const lvlCfg = this.getLevelConfig(this.selectedLevel);
        const dmgMult = this.currentMode === 'classic' ? (lvlCfg.enemyDmgMult || 1.0) : 1.0;
        let dmg = isThisBoss ? 42 : (enemy.radius > 20 ? 24 : (enemy.type === 'asteroid_s' || enemy.type === 'escort_fighter' ? 8 : 16));
        if (this.player.level <= 2 && this.selectedLevel === 1) dmg = Math.round(dmg * 0.75);
        dmg = Math.round(dmg * dmgMult);
        this.takeDamage(dmg);
        if (!isThisBoss) {
          enemy.toRemove = true;
        }
      } else if (!enemy.grazed && playerDist < enemy.radius + this.player.radius + 20) {
        // 5. YAKIN TEĞET (GRAZE): Düşman veya Asteroit sıyırma
        enemy.grazed = true;
        this.triggerGraze(enemy.x, enemy.y);
      }

      // 5. Ekranın Altına Kaçan Düşmanlar (Gezegen Savunma Hattı / Bariyer)
      if (enemy.y >= this.height - 10 && !enemy.barrierHit && !isThisBoss && enemy.type !== 'escort_fighter') {
        enemy.barrierHit = true;
        this.handleEnemyEscaped(enemy);
      }

      // Düşman Öldü mü?
      if (enemy.hp <= 0) {
        this.handleEnemyDeath(enemy);
        this.enemies.splice(i, 1);
      } else if (enemy.toRemove) {
        this.enemies.splice(i, 1);
      }
    }

    // Savrulan mermiler düşmanlara hasar verir
    for (let proj of this.enemyProjectiles) {
      if (!proj.isDeflected || proj.toRemove) continue;
      for (let enemy of this.enemies) {
        if (enemy.toRemove) continue;
        const dd = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
        if (dd < enemy.radius + proj.radius) {
          enemy.hp -= 12;
          enemy.hitFlash = 4;
          proj.toRemove = true;
          this.particles.spawnExplosion(enemy.x, enemy.y, '#00f0ff', 6, 2.5);
          break;
        }
      }
    }

    // Düşman Mermilerini Sınırla ve Güncelle
    if (this.enemyProjectiles.length > 12) {
      this.enemyProjectiles.splice(0, this.enemyProjectiles.length - 12);
    }
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const p = this.enemyProjectiles[i];
      // Orbital Bastion Plazma Bariyeri (Mermileri Buharlaştırır)
      if (this.player.evolutions && this.player.evolutions.nanoBastion) {
        if (Math.hypot(this.player.x - p.x, this.player.y - p.y) < 64) {
          this.particles.spawnExplosion(p.x, p.y, '#05ffa1', 4, 1.4);
          p.toRemove = true;
          this.enemyProjectiles.splice(i, 1);
          continue;
        }
      }

      // Koruyucu Drone mermiyi silebilir
      if (this.player.upgrades.drones > 0) {
        const droneCount = this.player.upgrades.drones;
        const orbitRadius = this.player.evolutions.nanoBastion ? 62 : 45;
        let destroyed = false;
        for (let d = 0; d < droneCount; d++) {
          const angle = this.player.droneAngle + (d * (Math.PI * 2 / droneCount));
          const droneX = this.player.x + Math.cos(angle) * orbitRadius;
          const droneY = this.player.y + Math.sin(angle) * orbitRadius;
          if (Math.hypot(droneX - p.x, droneY - p.y) < 14) {
            this.particles.spawnExplosion(p.x, p.y, '#05ffa1', 5, 2);
            p.toRemove = true;
            destroyed = true;
            break;
          }
        }
        if (destroyed) {
          this.enemyProjectiles.splice(i, 1);
          continue;
        }
      }

      // Oyuncuya Çarpma / Yakın Teğet (Graze)
      const dist = Math.hypot(p.x - this.player.x, p.y - this.player.y);
      if (dist < p.radius + this.player.radius) {
        const lvlCfg = this.getLevelConfig(this.selectedLevel);
        const dmgMult = this.currentMode === 'classic' ? (lvlCfg.enemyDmgMult || 1.0) : 1.0;
        const pDmg = Math.round(10 * dmgMult);
        this.takeDamage(pDmg);
        this.particles.spawnExplosion(p.x, p.y, '#ff0055', 6, 2);
        p.toRemove = true;
      } else if (!p.grazed && dist < p.radius + this.player.radius + 18) {
        // 5. YAKIN TEĞET (GRAZE): Mermi sıyırma
        p.grazed = true;
        this.triggerGraze(p.x, p.y);
      }

      if (p.toRemove) {
        this.enemyProjectiles.splice(i, 1);
      }
    }

    // Sıyırma / Graze Ödülü: Mermi kıl payı geçtiğinde +Ultimate enerji ve kıvılcım
    this.grazeTimer = (this.grazeTimer || 0);
    if (this.grazeTimer > 0) this.grazeTimer -= dt;
    for (let proj of this.enemyProjectiles) {
      if (proj.toRemove) continue;
      const gDist = Math.hypot(proj.x - this.player.x, proj.y - this.player.y);
      if (gDist > this.player.radius + proj.radius && gDist < this.player.radius + 18 && this.grazeTimer <= 0) {
        this.grazeTimer = 8; // Cooldown: her 8 frame'de bir graze
        this.player.ultimateCharge = Math.min(100, (this.player.ultimateCharge || 0) + 1.5);
        this.player.xp += 0.3;
        sounds.playGraze();
        vibrate.light();
      }
    }
  }

  triggerGraze(sourceX, sourceY) {
    sounds.playGraze();
    vibrate.light();

    if (this.pilotStats) {
      this.pilotStats.totalGraze = (this.pilotStats.totalGraze || 0) + 1;
    }

    // Yakın teğet geçişinde bonus Overdrive şarjı ve Adrenalin
    const chargeBonus = 5.0 * (this.player.reactorChargeMult || 1.0);
    if (!this.player.isFever) {
      this.player.feverCharge = Math.min(100, (this.player.feverCharge || 0) + chargeBonus);
    }
    this.player.score += 45;
    // 1.3 saniyelik Adrenalin Patlaması (+%25 seri ateş hızı)
    this.player.adrenalineTimer = 80;
  }

  handleEnemyDeath(enemy) {
    const isThisBoss = enemy.isBoss || enemy.type.startsWith('boss');
    sounds.playExplosion(isThisBoss || enemy.type === 'asteroid_l');
    vibrate.medium();

    // Kombo Sistemi (Sessiz ve pürüzsüz akış - ekranda yazı kalabalığı yaratmaz!)
    this.comboCount = Math.min(50, this.comboCount + 1);
    this.comboTimer = 90; // ~1.5 sn kombo süresi (daha rahat zincir)
    if (this.comboCount > 1) {
      sounds.playComboStreak(this.comboCount);
    }
    const comboMult = 1 + (this.comboCount - 1) * 0.12;
    
    const points = Math.round(enemy.score * (this.currentMode === 'storm' ? comboMult * 1.25 : comboMult));
    
    if (this.comboCount > 1 && this.comboCount % 5 === 0) {
      this.screenShake = Math.min(5, this.comboCount * 0.25);
      sounds.playLevelUp();
    }

    // Kombo Kademeleri (Temiz ve sarsıntısız akış - merkezde dev halka veya kör edici flaş patlaması olmadan)
    if (this.comboCount === 10) {
      this.particles.spawnFloatingText(this.width / 2, this.height * 0.25, '⚡ ULTRA COMBO! 10x', '#00f0ff', 16);
    } else if (this.comboCount === 20) {
      this.particles.spawnFloatingText(this.width / 2, this.height * 0.25, '🔥 MEGA COMBO! 20x', '#ffbe0b', 18);
    } else if (this.comboCount === 30) {
      this.particles.spawnFloatingText(this.width / 2, this.height * 0.25, '💥 UNSTOPPABLE! 30x', '#ff0077', 18);
    } else if (this.comboCount === 40) {
      this.particles.spawnFloatingText(this.width / 2, this.height * 0.25, '⚡ RAMPAGE! 40x', '#a855f7', 20);
    } else if (this.comboCount === 50) {
      this.particles.spawnFloatingText(this.width / 2, this.height * 0.25, '👑 GODLIKE! 50x MAX', '#ffd700', 22);
    }
    
    // Kombo XP Bonusu: 10+ komboda %50 ekstra XP
    if (this.comboCount >= 15 && this.comboCount % 5 === 0) {
      this.player.xp += 2;
    }

    this.player.score += points;

    // Mini Görev İlerlemesi (Öldürme ve Kombo)
    this.updateMiniQuestProgress('kill', 1);
    this.updateMiniQuestProgress('combo', this.comboCount, true);

    // Kriyojenik Buz Kırılması (Cryo Shatter)
    if (this.player.evolutions && this.player.evolutions.cryoBlaster && enemy.frozen > 0) {
      sounds.playFreeze();
      this.particles.spawnShockwave(enemy.x, enemy.y, '#38bdf8', 115);
      for (let other of this.enemies) {
        if (other !== enemy && other.hp > 0 && Math.hypot(other.x - enemy.x, other.y - enemy.y) < 95) {
          other.hp -= 22 * (this.player.damageMultiplier || 1.0);
          other.frozen = Math.min(120, (other.frozen || 0) + 40);
          this.particles.spawnExplosion(other.x, other.y, '#38bdf8', 5, 1.5);
          if (other.hp <= 0) {
            this.handleEnemyDeath(other);
          }
        }
      }
    }

    // Rekor Kırma Kontrolü & Canlı Bildirim
    const currentBest = this.highScores[this.currentMode] || 0;
    if (this.player.score > currentBest) {
      if (currentBest > 0 && !this.isNewRecordSet) {
        this.isNewRecordSet = true;
        if (recordBadge) recordBadge.classList.remove('hidden');
        sounds.playLevelUp();
        vibrate.success();
      }
      this.highScores[this.currentMode] = this.player.score;
      localStorage.setItem(`neon_high_score_${this.currentMode}`, this.player.score.toString());
      localStorage.setItem('neon_space_high_score', this.highScores['classic'].toString());
    }

    this.screenShake = isThisBoss ? 24 : 4;
    this.particles.spawnExplosion(enemy.x, enemy.y, enemy.color, isThisBoss ? 45 : 16, 5);
    this.particles.spawnDebris(enemy.x, enemy.y, enemy.color || '#ff0055', enemy.isBoss ? 18 : 6);

    // Boss ölümünde epik sinematik efektler & art arda patlamalar
    if (isThisBoss) {
      this.bossArenaActive = false;
      if (enemy.isBoss) {
        this.screenShake = Math.max(this.screenShake, 18);
      }
      this.slowMoTimer = 65; // ~1.1sn epik ağır çekim
      this.whiteFlash = 0.9;
      this.particles.triggerHitstop(8);
      this.particles.triggerFlash('#ffffff', 0.85);
      this.particles.triggerChromatic(24);
      this.particles.spawnShockwave(enemy.x, enemy.y, enemy.color || '#ff0055', 320);
      this.particles.spawnShockwave(enemy.x, enemy.y, '#ffbe0b', 240);
      this.particles.spawnShockwave(enemy.x, enemy.y, '#00f0ff', 180);

      // Boss gövdesinde kademeli artçı patlama fırtınası
      const bossDeathX = enemy.x;
      const bossDeathY = enemy.y;
      for (let s = 1; s <= 5; s++) {
        setTimeout(() => {
          if (!this.particles) return;
          const ox = bossDeathX + (Math.random() * 90 - 45);
          const oy = bossDeathY + (Math.random() * 90 - 45);
          this.particles.spawnExplosion(ox, oy, '#ff0077', 16, 4);
          this.particles.spawnExplosion(ox, oy, '#ffbe0b', 12, 3);
          this.particles.spawnShockwave(ox, oy, '#00f0ff', 160);
          sounds.playExplosion(true);
        }, s * 130);
      }
    }

    // Normal düşman öldürmede mikro hit-stop (daha tatmin edici his)
    if (!isThisBoss && this.comboCount >= 5) {
      this.particles.triggerHitstop(1);
      this.slowMoTimer = Math.max(this.slowMoTimer || 0, 2);
    }

    // Bomba Asteroit Alan Patlaması & Zincirleme Reaksiyon
    if (enemy.type === 'asteroid_bomb') {
      sounds.playExplosion(true);
      this.screenShake = 8;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#ff4d00', 125);
      this.particles.spawnExplosion(enemy.x, enemy.y, '#ff9100', 26, 4);

      // Çevredeki tüm düşman ve taşlara zincirleme hasar!
      for (let other of this.enemies) {
        if (other !== enemy && !other.toRemove && other.hp > 0) {
          const d = Math.hypot(other.x - enemy.x, other.y - enemy.y);
          if (d < 115) {
            other.hp -= 20;
            this.particles.spawnExplosion(other.x, other.y, '#ff4d00', 6, 2);
          }
        }
      }
      this.updateMissionProgress('detonate_bomb', 1);
      if (this.pilotStats) {
        this.pilotStats.bombAsteroidsDestroyed = (this.pilotStats.bombAsteroidsDestroyed || 0) + 1;
      }
    } else if (enemy.type === 'volatile_asteroid' || enemy.isVolatile) {
      sounds.playExplosion(true);
      this.screenShake = 10;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#c084fc', 150);
      this.particles.spawnExplosion(enemy.x, enemy.y, '#c084fc', 28, 4);

      // Yakındaki tüm düşmanlara 40 EMP hasarı!
      for (let other of this.enemies) {
        if (other !== enemy && !other.toRemove && other.hp > 0) {
          const d = Math.hypot(other.x - enemy.x, other.y - enemy.y);
          if (d < 130) {
            other.hp -= 40;
            this.particles.spawnExplosion(other.x, other.y, '#c084fc', 8, 2);
            if (other.hp <= 0) {
              other.toRemove = true;
              this.score += other.score;
            }
          }
        }
      }
      this.gems.push(new Gem(enemy.x, enemy.y, 3));
    }

    // Görev İlerlemesi & Pilot İstatistikleri (Düşmanlar, Asteroitler & Boss & Kombo)
    const isAsteroid = enemy.type && enemy.type.startsWith('asteroid');
    if (this.pilotStats) {
      if (!isAsteroid) {
        this.pilotStats.totalKills = (this.pilotStats.totalKills || 0) + 1;
      }
    }

    if (isAsteroid) {
      this.updateMissionProgress('kill_asteroids', 1);
      if (this.pilotStats) this.pilotStats.asteroidsDestroyed = (this.pilotStats.asteroidsDestroyed || 0) + 1;
    }
    if (enemy.type === 'boss') {
      this.updateMissionProgress('defeat_boss', 1);
      if (this.pilotStats) this.pilotStats.bossesDefeated = (this.pilotStats.bossesDefeated || 0) + 1;
    }
    if (this.comboCount >= 10) {
      this.updateMissionProgress('reach_combo', this.comboCount, true);
    }
    if (this.pilotStats) {
      this.pilotStats.maxCombo = Math.max(this.pilotStats.maxCombo || 0, this.comboCount);
    }

    // Asteroid parçalanması:
    // İlk boss yenilene kadar: 2 AŞAMALI PRATİK SİSTEM ("1 Vur 2'ye Bölünsün, O 2'yi Vur Bitsin!")
    // İlk boss yenildikten sonra: ESKİ 3 KADEMELİ SİSTEM GERİ DÖNER (Büyük -> 2 Orta -> her orta 2 Küçük -> Küçük biter)
    const fragSpeed = (this.currentMode === 'storm' ? 0.75 : 0.70) * (this.waveSpeedBonus || 1.0);
    if (this.firstBossDefeated) {
      // === ESKİ SİSTEM (BOSS SONRASI) ===
      if (enemy.type === 'asteroid_l') {
        // Büyük taş 2 orta taşa bölünür
        this.enemies.push(new Enemy(enemy.x - 12, enemy.y, 'asteroid_m', 1, fragSpeed));
        this.enemies.push(new Enemy(enemy.x + 12, enemy.y, 'asteroid_m', 1, fragSpeed));
        this.particles.spawnExplosion(enemy.x, enemy.y, '#8b9bb4', 12, 2.5);
      } else if (enemy.type === 'asteroid_m') {
        // Orta taş 2 küçük taşa bölünür
        this.enemies.push(new Enemy(enemy.x - 10, enemy.y, 'asteroid_s', 1, fragSpeed));
        this.enemies.push(new Enemy(enemy.x + 10, enemy.y, 'asteroid_s', 1, fragSpeed));
        this.particles.spawnExplosion(enemy.x, enemy.y, '#a0aec0', 10, 2.2);
      }
      // asteroid_s patlayınca BİTER, aşağıda zengin XP kristali verir
    } else {
      // === YENİ 2 AŞAMALI SİSTEM (İLK BOSS ÖNCESİ) ===
      // Gelen taşa 1 kez vurduğunuzda doğrudan 2 küçük taşa ayrılır.
      // O 2 küçük taşa 1 kez vurduğunuzda patlar ve BİTER!
      if (enemy.type === 'asteroid_m' || enemy.type === 'asteroid_l') {
        this.enemies.push(new Enemy(enemy.x - 10, enemy.y, 'asteroid_s', 1, fragSpeed));
        this.enemies.push(new Enemy(enemy.x + 10, enemy.y, 'asteroid_s', 1, fragSpeed));
        this.particles.spawnExplosion(enemy.x, enemy.y, '#a0aec0', 10, 2.2);
      }
      // asteroid_s patlayınca BİTER, aşağıda zengin XP kristali verir
    }

    // Kristal ve Yetenek Düşürme Sistemi:
    if (enemy.isBoss || enemy.type.startsWith('boss')) {
      const isIntro = enemy.type === 'boss_vanguard';
      if (isIntro) {
        this.introBossDefeated = true;
      } else {
        this.bossDefeatedCount = (this.bossDefeatedCount || 0) + 1;
        this.firstBossDefeated = true;
      }
      this.currentBoss = null;
      this.bossTimer = 0; // Boss ölünce zamanlayıcı kesinlikle sıfırlanır!
      this.intermissionEvents = {
        goldRush: false,
        merchantVisit: false,
        swarmStrike: false,
        cruiserRaid: false,
        hazardCore: false,
        eliteDuel: false
      };
      this.slowMoTimer = 75;
      this.whiteFlash = 1.0;
      this.particles.triggerFlash('#ffffff', 0.9);
      sounds.setBossEnraged(false);
      sounds.setBossMode(false);
      bossBarContainer.classList.add('hidden');
      const gemCount = isIntro ? 8 : Math.min(12, 5 + (this.bossDefeatedCount || 1));
      for (let k = 0; k < gemCount; k++) {
        this.gems.push(new Gem(enemy.x + (Math.random() * 40 - 20), enemy.y + (Math.random() * 40 - 20), 3));
      }
      this.particles.spawnShockwave(enemy.x, enemy.y, enemy.color || '#ffbe0b', 320);
      // Altın Uzay Sandığı Ganimeti
      this.luckyChests.push(new LuckyChest(enemy.x, enemy.y));
      // Can yenile
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + (isIntro ? 35 : 45));
      this.updateMissionProgress('defeat_boss', 1);
      if (this.pilotStats) this.pilotStats.bossesDefeated++;

      // === 38 SEVİYELİ SEFER (CAMPAIGN) MODU: BÖLÜM ZAFERİ KONTROLÜ ===
      if (this.currentMode === 'classic' && (enemy.isLevelBoss || enemy === this.currentLevelBoss || this.levelBossSpawned)) {
        this.particles.spawnFloatingText(this.width / 2, this.height * 0.35, `★ BÖLÜM ${this.selectedLevel} BAŞARIYLA TAMAMLANDI! ★`, '#ffd700', 18);
        this.particles.spawnShockwave(this.width / 2, this.height * 0.4, '#ffd700', 360);
        this._pendingVictory = true;
        setTimeout(() => {
          if (this.state === 'PLAYING' || this._pendingVictory) {
            this._pendingVictory = false;
            try {
              this.triggerLevelVictory();
            } catch (err) {
              console.error("Victory trigger hatası:", err);
              this.state = 'MENU';
              if (startScreen) startScreen.classList.remove('hidden');
              hud.classList.add('hidden');
            }
          }
        }, 1400);
        return;
      }

      if (isIntro) {
        this.particles.spawnFloatingText(this.width / 2, this.height * 0.35, '★ ÖNCÜ KOMUTAN İMHA EDİLDİ! ★', '#ffd700', 16);
      } else {
        // Sektör Sıçraması (Yeni Atmosfer & Yıldız Alanı Geçişi)
        this.wave++;
        const nextSector = this.getSectorForWave(this.wave);
        if (nextSector !== this.currentSectorId) {
          this.triggerSectorWarp(nextSector);
        }
      }
    } else if (enemy.type === 'cargo_freighter') {
      sounds.playLevelUp();
      vibrate.success();
      this.screenShake = 8;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#ffd700', 180);
      this.particles.spawnFloatingText(enemy.x, enemy.y, '★ GİZLİ KARGO ELE GEÇİRİLDİ!', '#ffd700', 15);
      for (let k = 0; k < 6; k++) {
        this.gems.push(new Gem(enemy.x + (Math.random() * 30 - 15), enemy.y + (Math.random() * 30 - 15), 3));
      }
      const pTypes = ['overcharge', 'shield', 'magnet'];
      const pType = pTypes[Math.floor(Math.random() * pTypes.length)];
      this.powerups.push(new PowerUp(enemy.x, enemy.y, pType));
    } else if (enemy.type === 'elite_scout') {
      // Altın Elit Avcı: Garanti Güçlendirme Kapsülü + Sandık + 5 Zümrüt Kristal
      sounds.playLevelUp();
      vibrate.success();
      this.screenShake = 8;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#ffbe0b', 160);
      for (let k = 0; k < 5; k++) {
        this.gems.push(new Gem(enemy.x + (Math.random() * 24 - 12), enemy.y + (Math.random() * 24 - 12), 3));
      }
      this.luckyChests.push(new LuckyChest(enemy.x, enemy.y));
      const pTypes = ['overcharge', 'shield', 'magnet'];
      const pType = pTypes[Math.floor(Math.random() * pTypes.length)];
      this.powerups.push(new PowerUp(enemy.x, enemy.y, pType));
    } else if (enemy.isChampion) {
      // Mini-Elit Şampiyon Düşmanı: Garanti Güçlendirme / Sandık + Yüksek XP
      sounds.playLevelUp();
      vibrate.success();
      this.screenShake = 7;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#bf5af2', 150);
      for (let k = 0; k < 4; k++) {
        this.gems.push(new Gem(enemy.x + (Math.random() * 20 - 10), enemy.y + (Math.random() * 20 - 10), 3));
      }
      if (Math.random() < 0.5) {
        this.luckyChests.push(new LuckyChest(enemy.x, enemy.y));
      } else {
        const pTypes = ['overcharge', 'shield', 'magnet'];
        const pType = pTypes[Math.floor(Math.random() * pTypes.length)];
        this.powerups.push(new PowerUp(enemy.x, enemy.y, pType));
      }
      // 'split' affix'i varsa 2 küçük minyon fırlar
      if (enemy.affix === 'split') {
        for (let s = -1; s <= 1; s += 2) {
          const minion = new Enemy(enemy.x + s * 18, enemy.y, 'scout', this.waveMultiplier, this.currentSector);
          minion.hp = Math.round(minion.hp * 0.5);
          minion.maxHp = minion.hp;
          minion.radius = 11;
          minion.speedX = s * 1.3;
          this.enemies.push(minion);
        }
      }
    } else if (enemy.type === 'asteroid_gold') {
      // 1. HIZLI BAŞLANGIÇ İKRAMI: 1 vuruşluk altın meteor!
      // Bol miktarda XP kristali saçar, anında Seviye 2 yapacak ilk yükseltmeyi tetikler!
      sounds.playLevelUp();
      vibrate.success();
      this.screenShake = 6;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#ffbe0b', 140);
      this.particles.spawnExplosion(enemy.x, enemy.y, '#ffd166', 15, 3.2);
      for (let k = 0; k < 3; k++) {
        this.gems.push(new Gem(enemy.x + (Math.random() * 24 - 12), enemy.y + (Math.random() * 24 - 12), 2));
      }
      this.player.feverCharge = Math.min(100, this.player.feverCharge + 1.2);
    } else if (enemy.type === 'volatile_core') {
      // 3. KARARSIZ PLAZMA REAKTÖRÜ PATLAMASI (Termonükleer Ekran Temizliği)
      sounds.playCoreDetonate();
      vibrate.heavy();
      this.screenShake = 16;
      this.whiteFlash = 0.55;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#ff0055', 280);
      this.particles.spawnShockwave(enemy.x, enemy.y, '#ffbe0b', 200);
      this.particles.spawnExplosion(enemy.x, enemy.y, '#ff0055', 25, 4.0);

      // Ekrandaki tüm düşman mermilerini anında buharlaştır
      this.enemyProjectiles = [];

      // 280px yarıçaptaki tüm düşmanlara 65 ezici hasar (zincirleme patlamalar tetikler!)
      for (let other of this.enemies) {
        if (other === enemy || other.hp <= 0) continue;
        const d = Math.hypot(other.x - enemy.x, other.y - enemy.y);
        if (d < 280) {
          other.hp -= 65;
          this.particles.spawnExplosion(other.x, other.y, '#ff0055', 6, 1.8);
        }
      }

      // 4 zengin enerji kristali ve Overdrive doldur
      for (let k = 0; k < 4; k++) {
        this.gems.push(new Gem(enemy.x + (Math.random() * 28 - 14), enemy.y + (Math.random() * 28 - 14), 3));
      }
      this.player.feverCharge = Math.min(100, this.player.feverCharge + 2.5);
    } else if (enemy.type === 'asteroid_s') {
      // KÜÇÜK TAŞLAR: Patlayınca biter, zengin 2 XP kristali verir ve Overdrive doldurur!
      this.gems.push(new Gem(enemy.x, enemy.y, 2));
      this.particles.spawnExplosion(enemy.x, enemy.y, '#05ffa1', 10, 2.6);
      this.player.feverCharge = Math.min(100, this.player.feverCharge + 0.4);

      // Küçük taşlardan güçlendirme kapsülü şansı (%6)
      if (Math.random() < 0.06 && this.powerups.length < 3) {
        const pTypes = ['overcharge', 'shield', 'magnet'];
        const pType = pTypes[Math.floor(Math.random() * pTypes.length)];
        this.powerups.push(new PowerUp(enemy.x, enemy.y, pType));
      }
    } else if (enemy.type === 'asteroid_bomb') {
      // Bomba asteroit: 2 orta kristal
      this.gems.push(new Gem(enemy.x, enemy.y, 2));
    } else if (enemy.type === 'cruiser') {
      this.gems.push(new Gem(enemy.x, enemy.y, 3));
    } else if (enemy.type === 'scout') {
      this.gems.push(new Gem(enemy.x, enemy.y, 1));
    } else if (enemy.type === 'escort_fighter' || enemy.type === 'dive_bomber') {
      this.gems.push(new Gem(enemy.x, enemy.y, 1));
      this.player.feverCharge = Math.min(100, this.player.feverCharge + 0.5);
    }

    this.updateHUD();
  }

  takeDamage(amount) {
    // Blaze Plazma Atılımı Sırasında Tam Hasarsızlık
    if (this.player.blazeDashTimer > 0) return;

    // Hayalet Plazma Kuantum Faz Koruması
    if (this.player.phaseTimer > 0) return;

    if (this.currentSkinId === 'phantom' && (!this.player.phaseCooldown || this.player.phaseCooldown <= 0)) {
      this.player.phaseTimer = 75; // 1.25 sn hasarsızlık
      this.player.phaseCooldown = 480; // 8 sn bekleme süresi
      sounds.playDeflect();
      vibrate.heavy();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00e5ff', 90);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 30, '⚡ FAZ KALKANI AKTİF!', '#00e5ff', 14);
      return;
    }

    // Titan Çift Kalkan Modunda Alınan Hasar %50 Azalır
    if (this.player.titanShieldTimer > 0) {
      amount = Math.max(1, Math.round(amount * 0.5));
    }

    this.screenShake = 6;
    this.player.shieldRegenTimer = 0;

    if (this.currentMiniQuest && this.currentMiniQuest.type === 'dodge') {
      this.currentMiniQuest.dodgeTimer = 0;
      this.updateMiniQuestProgress('dodge', 0, true);
    }

    // Önce kalkan karşılar
    const hadShield = this.player.shield > 0;
    if (this.player.shield > 0) {
      sounds.playShieldHit();
      vibrate.medium();
      if (this.player.shield >= amount) {
        this.player.shield -= amount;
        amount = 0;
      } else {
        amount -= this.player.shield;
        this.player.shield = 0;
      }
    }

    // Kalkan Parçalanması / Kırılması (Crystalline Glass Shatter)
    if (hadShield && this.player.shield <= 0) {
      sounds.playShieldBreak();
      vibrate.medium();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 65);
      for (let s = 0; s < 12; s++) {
        this.particles.spawnExplosion(this.player.x + (Math.random() * 20 - 10), this.player.y + (Math.random() * 20 - 10), '#00f0ff', 3, 2.0);
      }
    }

    // 2. SİNERJİ: Overload Reactor (Kalkan kırılınca EMP şoku yayar ve düşman mermilerini siler)
    if (hadShield && this.player.shield <= 0 && this.player.synergies && this.player.synergies.overloadReactor) {
      sounds.playBomb();
      vibrate.heavy();
      this.screenShake = 12;
      this.whiteFlash = 0.4;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 260);
      this.particles.spawnShockwave(this.player.x, this.player.y, '#bf5af2', 180);
      this.enemyProjectiles = [];
      for (let enemy of this.enemies) {
        const d = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
        if (d < 260) {
          enemy.hp -= 35;
          this.particles.spawnExplosion(enemy.x, enemy.y, '#00f0ff', 7, 2.0);
        }
      }
    }

    // Kalan hasar cana gider
    if (amount > 0) {
      sounds.playPlayerHit();
      vibrate.heavy();
      this.player.hp -= amount;
      // Kırmızı hasar flash ve vuruş mikro-donması (Hitstop)
      this.damageFlash = Math.min(0.6, (this.damageFlash || 0) + 0.25);
      this.particles.triggerHitstop(2);
      this.particles.triggerFlash('#ff0055', 0.28);
      this.screenShake = 9;
    }

    this.updateHUD();

    if (this.player.hp <= 0) {
      // Anka Protokolü (Phoenix Shield): Ölümcül hasarda 1 kez dev patlama ile dirilme
      if (this.player.hasPhoenix && !this.player.phoenixUsed) {
        this.player.phoenixUsed = true;
        const pLvl = (this.techUpgrades && this.techUpgrades.phoenix) ? this.techUpgrades.phoenix : 1;
        const revivePct = pLvl === 1 ? 0.35 : (pLvl === 2 ? 0.60 : 1.0);
        this.player.hp = Math.round(this.player.maxHp * revivePct);
        this.player.shield = this.player.maxShield;
        sounds.playNuke();
        sounds.playLevelUp();
        vibrate.heavy();
        this.screenShake = 16;
        this.whiteFlash = 1.0;
        this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 340);
        this.particles.spawnShockwave(this.player.x, this.player.y, '#ff0055', 250);
        this.particles.spawnFloatingText(this.player.x, this.player.y - 30, '>>> ANKA DİRİLİŞİ! <<<', '#ffbe0b', 18);
        this.enemyProjectiles = [];
        for (let enemy of this.enemies) {
          const isBossTarget = enemy.isBoss || (enemy.type && enemy.type.startsWith('boss'));
          if (!isBossTarget) {
            enemy.hp -= 30;
          } else {
            enemy.hp -= 18;
          }
        }
        this.updateHUD();
        return;
      }
      this.gameOver();
    }
  }

  handleEnemyEscaped(enemy) {
    // Kaçan meteor veya düşman gezegen savunma hattını zorlar!
    if (this.comboCount > 0) {
      if (this.comboCount >= 5) {
        this.screenShake = Math.min(4, this.comboCount * 0.3);
      }
      this.comboCount = 0;
      this.comboTimer = 0;
    }
    this.barrierFlash = 25;
    sounds.playShieldHit();
    vibrate.light();
    this.particles.spawnShockwave(enemy.x, this.height - 8, '#ff0055', 70);

    // Savunma Hattı Baskısı (Hareketsiz bekleyip düşmanları serbestçe geçirmeyi engeller)
    const breachDmg = enemy.isBoss ? 20 : (enemy.shape ? 4 : 8);
    if (this.player.shield > 0) {
      this.player.shield = Math.max(0, this.player.shield - breachDmg);
      this.particles.spawnFloatingText(enemy.x, this.height - 25, `BARİYER BASKISI -${breachDmg}`, '#ff0055', 12);
    } else {
      this.player.hp = Math.max(1, this.player.hp - Math.round(breachDmg * 0.5));
      this.particles.spawnFloatingText(enemy.x, this.height - 25, `GÖVDE UYARISI -${Math.round(breachDmg * 0.5)}`, '#ff3b30', 12);
    }
    this.player.shieldRegenTimer = 0; // Kalkan bekleme süresini sıfırla

    this.updateHUD();
  }

  updateGems(dt = 1.0) {
    const magnetDistance = (this.player.isFever || this.player.vacuumTimer > 0) ? 9999 : this.player.magnetRange;

    // Kristal Havuzunu Sınırla (Maksimum 40 kristal - Performans Koruması)
    if (this.gems.length > 40) {
      this.gems.splice(0, this.gems.length - 40);
    }

    for (let i = this.gems.length - 1; i >= 0; i--) {
      const gem = this.gems[i];
      gem.update(this.player.x, this.player.y, magnetDistance, dt);

      // Oyuncuya Ulaşma
      const dist = Math.hypot(gem.x - this.player.x, gem.y - this.player.y);
      if (dist < gem.radius + this.player.radius) {
        this.gemStreak = ((this.frames - (this.lastGemFrame || 0)) < 36) ? Math.min(16, (this.gemStreak || 0) + 1) : 0;
        this.lastGemFrame = this.frames;
        sounds.playCrystalPop(this.gemStreak);
        // Kalıcı Kristal Ekonomisi Dengesi (XP ile Kalıcı Para Birimi Ayrıldı):
        // XP hızlı seviye atlamak için gem.value olarak aynen verilir, kalıcı kristal ise değerli ve zor kazanılır!
        const rawGain = gem.value >= 3 ? 4 : (gem.value === 2 ? 2 : 1); // Boss/elit taşlar 4, orta 2, normal 1 kristal
        const crystalGain = Math.max(1, Math.round(rawGain * (this.player.crystalMultiplier || 1)));
        this.player.xp += gem.value;
        this.player.score += gem.value * 10;
        this.totalCrystals += crystalGain;
        this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + crystalGain;
        if (this.pilotStats) {
          this.pilotStats.lifetimeCrystals += crystalGain;
        }
        // Performans: Her kristalde senkron disk I/O yapıp kasmayı önle, periyodik yaz
        if (this.frames % 120 === 0) {
          localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
        }
        this.updateCrystalsDisplay();
        this.updateMissionProgress('collect_crystals', crystalGain);
        this.updateMiniQuestProgress('crystals', crystalGain);
        this.particles.spawnExplosion(gem.x, gem.y, gem.color, 3, 1.2);
        this.gems.splice(i, 1);

        // 2. SİNERJİ: Crystal Shrapnel (Her 7 kristalde bir güdümlü kristal füzesi fırlar)
        if (this.player.synergies && this.player.synergies.crystalShrapnel) {
          this.player.crystalShrapnelCount = (this.player.crystalShrapnelCount || 0) + 1;
          if (this.player.crystalShrapnelCount >= 7) {
            this.player.crystalShrapnelCount = 0;
            sounds.playLaser();
            this.particles.spawnShockwave(this.player.x, this.player.y, '#05ffa1', 45);
            this.homingMissiles.push({
              x: this.player.x,
              y: this.player.y - 12,
              vx: (Math.random() - 0.5) * 4,
              vy: -7,
              speed: 11,
              damage: 28 * (this.player.damageMultiplier || 1),
              isCluster: false,
              life: 180,
              state: 'active',
              delay: 0,
              targetX: 0,
              targetY: 0
            });
          }
        }

        // Fever / Overdrive Şarjı (Kullanıcı İsteği: Ultimate zor ve yavaş dolsun)
        if (!this.player.isFever) {
          const stormBonus = this.currentMode === 'storm' ? 1.2 : 1.0;
          this.player.feverCharge = Math.min(100, this.player.feverCharge + gem.value * 0.10 * stormBonus);
          if (this.player.feverCharge >= 100) {
            if (btnUltimate && !btnUltimate.classList.contains('ready')) {
              btnUltimate.classList.add('ready');
              sounds.playUltimateReady();
              vibrate.success();
              if (ultimateLabel) ultimateLabel.textContent = 'HAZIR!';
              this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 75);
            }
          }
        }

        // Seviye Atlama Kontrolü (Kullanıcı İsteği: Lvl 2: 12 XP, Lvl 3: 83 XP, Lvl 4: 230 XP, Sonrası: nextXp * 1.83 + 38)
        if (this.player.xp >= this.player.nextXp) {
          this.player.xp -= this.player.nextXp;
          this.player.level++;
          if (this.player.level === 2) {
            this.player.nextXp = 12;
          } else if (this.player.level === 3) {
            this.player.nextXp = 83;
          } else if (this.player.level === 4) {
            this.player.nextXp = 230;
          } else {
            this.player.nextXp = Math.round(this.player.nextXp * 1.83 + 38);
          }
          // Seviye atlama epik efektleri
          this.screenShake = 6;
          this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 200);
          this.triggerLevelUp();
          break;
        }
      } else if (gem.y > this.height + 40) {
        this.gems.splice(i, 1);
      }
    }
  }

  drawMenuCyberGrid() {
    const horizonY = this.height * 0.62;
    const gridBottom = this.height;

    ctx.save();
    // 1. Ufuk Çizgisi Radyal Parıltısı
    const glowGrad = ctx.createRadialGradient(
      this.width / 2, horizonY, 5,
      this.width / 2, horizonY, this.width * 0.6
    );
    glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.16)');
    glowGrad.addColorStop(0.4, 'rgba(255, 0, 119, 0.08)');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, horizonY - 40, this.width, gridBottom - horizonY + 40);

    // 2. Neon Ufuk Çizgisi
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(this.width, horizonY);
    ctx.stroke();

    // 3. Merkeze Doğru Yakınsayan Perspektif Çizgileri
    const numLines = 14;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.14)';
    ctx.lineWidth = 1.0;
    const centerX = this.width / 2;
    for (let i = 0; i <= numLines; i++) {
      const bottomX = (this.width / numLines) * i;
      ctx.beginPath();
      ctx.moveTo(centerX + (bottomX - centerX) * 0.08, horizonY);
      ctx.lineTo(bottomX, gridBottom);
      ctx.stroke();
    }

    // 4. İleriye Doğru Kayan Yatay Izgara Çizgileri
    const speed = ((this.frames || 0) * 0.015) % 1;
    for (let i = 0; i < 7; i++) {
      const p = Math.pow((i + speed) / 7, 2.2);
      const lineY = horizonY + p * (gridBottom - horizonY);
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.06 + p * 0.22})`;
      ctx.lineWidth = 1.0 + p * 0.8;
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(this.width, lineY);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawMenuShipShowcase() {
    const cx = this.width / 2;
    const cy = Math.max(170, Math.min(this.height * 0.38, 280));
    const bobY = Math.sin((this.frames || 0) * 0.04) * 7;
    const sy = cy + bobY;
    const previewSkinId = this.skinOrder[this.menuSkinIndex] || this.currentSkinId;
    const skin = this.skins[previewSkinId] || this.skins.cyberpunk;

    ctx.save();
    // 1. Holografik Tarayıcı Halkası (Alt Zemin)
    const haloY = sy + 40;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, haloY, 68, 22, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.stroke();

    // Dönen kesikli lazer halkası
    ctx.beginPath();
    ctx.ellipse(cx, haloY, 52, 16, 0, 0, Math.PI * 2);
    ctx.setLineDash([5, 7]);
    ctx.lineDashOffset = -((this.frames || 0) * 0.4);
    ctx.strokeStyle = 'rgba(255, 0, 119, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Zemin yukarı dikey mavi projeksiyon konisi
    const beamGrad = ctx.createLinearGradient(cx, haloY, cx, sy - 30);
    beamGrad.addColorStop(0, 'rgba(0, 240, 255, 0.10)');
    beamGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 50, haloY);
    ctx.lineTo(cx - 18, sy - 30);
    ctx.lineTo(cx + 18, sy - 30);
    ctx.lineTo(cx + 50, haloY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 2. Vitrin Gemisi Çizimi
    ctx.save();
    let shipScale = 1.8;
    let shipY = sy;
    if (this.launching) {
      const p = Math.min(1.0, (this.launchProgress || 0) / 26);
      shipScale = 1.8 + Math.pow(p, 2.5) * 5.0;
      shipY = sy + Math.pow(p, 2.5) * 260;
    }
    ctx.translate(cx, shipY);
    const bankRoll = Math.sin((this.frames || 0) * 0.025) * 0.06;
    ctx.rotate(bankRoll);
    ctx.scale(shipScale, shipScale);

    // Motor alevi parçacıkları (Aşağı doğru salınan iyon alevi)
    const flamePulse = 0.8 + Math.sin((this.frames || 0) * 0.3) * 0.35;
    const r = this.player.radius || 18;

    // Alev pırıltısı
    ctx.fillStyle = this.launching ? '#00f0ff' : skin.flame;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = this.launching ? 20 : 12;
    const flameLen = (this.launching ? 24 : 10) * flamePulse;
    ctx.beginPath();
    ctx.moveTo(-9, r * 0.85);
    ctx.lineTo(-6.5, r * 0.85 + flameLen);
    ctx.lineTo(-4, r * 0.85);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(4, r * 0.85);
    ctx.lineTo(6.5, r * 0.85 + flameLen);
    ctx.lineTo(9, r * 0.85);
    ctx.closePath();
    ctx.fill();

    // Geminin kendisi
    const primaryColor = skin.primary;
    const secondaryColor = skin.secondary;
    const cockpitColor = skin.cockpit;

    // Motor podları
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 6;
    ctx.shadowColor = primaryColor;
    ctx.fillRect(-9, r * 0.55, 5, 8);
    ctx.strokeRect(-9, r * 0.55, 5, 8);
    ctx.fillRect(4, r * 0.55, 5, 8);
    ctx.strokeRect(4, r * 0.55, 5, 8);

    // Kanat namluları
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.4;
    ctx.fillRect(-r * 1.35, -r * 0.25, 3.5, r * 0.95);
    ctx.strokeRect(-r * 1.35, -r * 0.25, 3.5, r * 0.95);
    ctx.fillRect(r * 1.35 - 3.5, -r * 0.25, 3.5, r * 0.95);
    ctx.strokeRect(r * 1.35 - 3.5, -r * 0.25, 3.5, r * 0.95);

    // Ana gövde
    ctx.fillStyle = '#090d1a';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2.4;
    ctx.shadowBlur = 12;
    ctx.shadowColor = primaryColor;
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.55);
    ctx.lineTo(r * 0.26, -r * 0.9);
    ctx.lineTo(r * 0.55, -r * 0.45);
    ctx.lineTo(r * 0.32, -r * 0.25);
    ctx.lineTo(r * 1.35, r * 0.65);
    ctx.lineTo(r * 1.3, r * 1.05);
    ctx.lineTo(r * 0.5, r * 0.65);
    ctx.lineTo(r * 0.3, r * 0.85);
    ctx.lineTo(0, r * 0.6);
    ctx.lineTo(-r * 0.3, r * 0.85);
    ctx.lineTo(-r * 0.5, r * 0.65);
    ctx.lineTo(-r * 1.3, r * 1.05);
    ctx.lineTo(-r * 1.35, r * 0.65);
    ctx.lineTo(-r * 0.32, -r * 0.25);
    ctx.lineTo(-r * 0.55, -r * 0.45);
    ctx.lineTo(-r * 0.26, -r * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // İç zırh plakası
    ctx.fillStyle = '#141e33';
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.15);
    ctx.lineTo(r * 0.24, -r * 0.2);
    ctx.lineTo(r * 0.85, r * 0.52);
    ctx.lineTo(r * 0.4, r * 0.48);
    ctx.lineTo(0, r * 0.4);
    ctx.lineTo(-r * 0.4, r * 0.48);
    ctx.lineTo(-r * 0.85, r * 0.52);
    ctx.lineTo(-r * 0.24, -r * 0.2);
    ctx.closePath();
    ctx.fill();

    // Neon enerji akış çizgileri
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.22, -r * 0.1);
    ctx.lineTo(-r * 0.78, r * 0.48);
    ctx.moveTo(r * 0.22, -r * 0.1);
    ctx.lineTo(r * 0.78, r * 0.48);
    ctx.stroke();

    // Kokpit
    ctx.fillStyle = cockpitColor;
    ctx.shadowColor = cockpitColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.85);
    ctx.lineTo(r * 0.24, -r * 0.25);
    ctx.lineTo(r * 0.2, r * 0.25);
    ctx.lineTo(0, r * 0.38);
    ctx.lineTo(-r * 0.2, r * 0.25);
    ctx.lineTo(-r * 0.24, -r * 0.25);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  drawTacticalZones() {
    // Tüm çizgiler, kenar noktaları ve yazılar kaldırıldı (Ekran %100 berrak ve temiz)
    return;
  }

  // === ÇİZİM MOTORU (RENDER) ===
  draw() {
    // 1. Ekranı tamamen temizle ve zemin rengiyle doldur (kenar bozulmalarını ve iz kalmasını önler)
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = this.particles.bgBase || '#060814';
    ctx.fillRect(-60, -60, this.width + 120, this.height + 120);

    ctx.save();

    // Ekran Sarsıntısı (Screen Shake - Yumuşak Mikro Sarsıntı)
    if (this.screenShake > 0) {
      const shakeAmt = Math.min(3, this.screenShake * 0.2);
      const shakeX = (Math.random() - 0.5) * shakeAmt;
      const shakeY = (Math.random() - 0.5) * shakeAmt;
      ctx.translate(shakeX, shakeY);
    }

    // Yıldızlar, Nebulalar, Sektör Közleri & Efektler
    this.particles.render(ctx);

    // Ana Menü Ekranı: Canlı Siber Izgara ve Holografik Gemi Vitrini
    if (this.state === 'MENU') {
      this.drawMenuCyberGrid();
      this.drawMenuShipShowcase();
      ctx.restore();
      return;
    }

    // Taktiksel Muharebe Hatlarını Çiz
    this.drawTacticalZones();

    // Kristalleri Çiz
    for (let gem of this.gems) {
      gem.draw(ctx);
    }

    // Karadelik Girdapları (Vortices) — Temiz Retro Neon Çember
    if (this.vortices && this.vortices.length > 0) {
      for (let vortex of this.vortices) {
        ctx.save();
        ctx.strokeStyle = '#d946ef';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(vortex.x, vortex.y, 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#f0abfc';
        ctx.beginPath();
        ctx.arc(vortex.x, vortex.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Tehlike Lazer Uyarı Çizgilerini Çiz
    for (let tel of this.telegraphs) {
      ctx.save();
      const alpha = Math.min(1, (1 - (tel.timer / tel.maxTimer)) * 0.85 + 0.15);
      ctx.strokeStyle = `rgba(255, 0, 85, ${alpha})`;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(tel.x, 0);
      ctx.lineTo(tel.x, this.height);
      ctx.stroke();

      ctx.font = '900 12px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(255, 0, 85, ${alpha})`;
      ctx.fillText(t('caution'), tel.x, 35);
      ctx.restore();
    }

    // Aktif Yıkıcı Enerji Işınlarını (Death Beam) Çiz
    if (this.activeBeams) {
      for (let beam of this.activeBeams) {
        ctx.save();
        const progress = beam.timer / beam.maxTimer;
        const alpha = Math.sin(progress * Math.PI);
        // Dış Parlama
        const grad = ctx.createLinearGradient(beam.x - beam.width, 0, beam.x + beam.width, 0);
        grad.addColorStop(0, 'rgba(255, 0, 85, 0)');
        grad.addColorStop(0.3, `rgba(255, 0, 85, ${0.65 * alpha})`);
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${0.95 * alpha})`);
        grad.addColorStop(0.7, `rgba(255, 0, 85, ${0.65 * alpha})`);
        grad.addColorStop(1, 'rgba(255, 0, 85, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(beam.x - beam.width, 0, beam.width * 2, this.height);

        // İç Beyaz Çekirdek
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
        ctx.fillRect(beam.x - 4, 0, 8, this.height);
        ctx.restore();
      }
    }

    // Güçlendirme Kapsüllerini Çiz
    for (let p of this.powerups) {
      p.draw(ctx);
    }

    // Altın Uzay Sandıklarını Çiz
    for (let chest of this.luckyChests) {
      chest.draw(ctx);
    }

    // Düşman Mermilerini Çiz
    for (let ep of this.enemyProjectiles) {
      ep.draw(ctx);
    }

    // Düşmanları Çiz
    for (let enemy of this.enemies) {
      enemy.draw(ctx);
    }

    // Süpernova Plazma Havuzlarını ve Kürelerini Çiz
    this.drawSupernovaEffects();

    // Kıyamet Tesla Matrisi Lazer Ağı Çiz
    this.drawTeslaMatrix();

    // Oyuncu Mermilerini Çiz
    this.drawPlayerBullets();

    // Oyuncu Gemisini ve Hayalet İzlerini Çiz
    if (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'LEVEL_UP' || this.state === 'LUCKY_CHEST') {
      this.drawPlayerAfterimages();
      this.drawPlayerShip();
      this.drawWingmen();
      this.drawOrbitalSaws();
      this.drawCompanionDrone();
    }

    // Overdrive / Süper Güç Barı
    if (this.state === 'PLAYING' || this.state === 'PAUSED') {
      this.drawOverdriveBar();
    }

    // Gezegen Savunma Bariyeri Hattı (Alt Siber Grid Çizgisi)
    if (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'LEVEL_UP' || this.state === 'LUCKY_CHEST') {
      ctx.save();
      const isBarrierHit = this.barrierFlash > 0;
      const barrierY = this.height - 4;
      const sec = SECTORS[this.currentSectorId] || SECTORS.void;
      const bColor = isBarrierHit ? '#ff0055' : sec.color;
      ctx.strokeStyle = bColor;
      ctx.lineWidth = isBarrierHit ? 3.5 : 2;
      ctx.beginPath();
      ctx.moveTo(0, barrierY);
      ctx.lineTo(this.width, barrierY);
      ctx.stroke();

      const toothStep = 24;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = 0; x < this.width; x += toothStep) {
        ctx.moveTo(x, barrierY);
        ctx.lineTo(x + 10, barrierY + 4);
      }
      ctx.stroke();
      ctx.restore();
    }



    // Boss Ölüm Sinematik Beyaz Parlaması
    if (this.whiteFlash > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${this.whiteFlash})`;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
      this.whiteFlash = Math.max(0, this.whiteFlash - 0.04);
    }

    // Kırmızı Hasar Flash Efekti (HP kaybında ekran kırmızıya çakar)
    if (this.damageFlash > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 0, 40, ${this.damageFlash * 0.5})`;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }

    ctx.restore();
  }

  drawSupernovaEffects() {
    if (this.supernovaWells && this.supernovaWells.length > 0) {
      for (let well of this.supernovaWells) {
        ctx.save();
        ctx.translate(well.x, well.y);
        ctx.rotate(well.pulse);

        // Katmanlı neon halka (Sıfır shadowBlur, 60fps akıcı)
        ctx.strokeStyle = 'rgba(255, 61, 0, 0.45)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, well.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 190, 11, 0.20)';
        ctx.beginPath();
        ctx.arc(0, 0, well.radius * 0.75, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffbe0b';
        for (let f = 0; f < 8; f++) {
          const fa = f * (Math.PI / 4);
          ctx.fillRect(Math.cos(fa) * well.radius * 0.85 - 2.5, Math.sin(fa) * well.radius * 0.85 - 2.5, 5, 5);
        }

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, well.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    if (this.supernovaOrbs && this.supernovaOrbs.length > 0) {
      for (let orb of this.supernovaOrbs) {
        ctx.save();
        ctx.translate(orb.x, orb.y);
        ctx.fillStyle = 'rgba(255, 61, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff3d00';
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  drawTeslaMatrix() {
    if (this.tetheredEnemies && this.tetheredEnemies.length > 0) {
      ctx.save();
      ctx.strokeStyle = '#bf5af2';
      ctx.lineWidth = 1.8;
      for (let e of this.tetheredEnemies) {
        ctx.beginPath();
        ctx.moveTo(this.player.x, this.player.y);
        const midX = (this.player.x + e.x) / 2 + (Math.random() - 0.5) * 12;
        const midY = (this.player.y + e.y) / 2 + (Math.random() - 0.5) * 12;
        ctx.lineTo(midX, midY);
        ctx.lineTo(e.x, e.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  drawPlayerBullets() {
    ctx.save();

    for (let b of this.playerBullets) {
      const col = b.color || '#00f0ff';
      const w = b.w || 4;
      const h = b.h || 12;

      if (b.isRailgun) {
        // === ELEKTRO-RAY KESKİN NİŞANCI HYPER RAILGUN IŞINI ===
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.fillRect(b.x - 7, b.y - h * 0.5, 14, h * 1.1);

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(b.x - 4, b.y - h * 0.48, 8, h * 1.05);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(b.x - 1.8, b.y - h * 0.45, 3.6, h * 1.0);
      } else if (b.piercing) {
        // Ezici Plazma Testere Dalgası (Crescent Plasma Wave)
        ctx.strokeStyle = col;
        ctx.lineWidth = Math.max(3, w * 0.7);
        ctx.beginPath();
        ctx.arc(b.x, b.y + 6, Math.max(14, w * 1.8), Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(b.x, b.y + 6, Math.max(14, w * 1.8), Math.PI * 1.25, Math.PI * 1.75);
        ctx.stroke();
      } else {
        // Yüksek Hızlı Lazer Kapsülü (Akkor Beyaz Çekirdekli Neon Lazer - Hızlı Draw)
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y - h * 0.4, Math.max(2, w * 0.6), Math.max(5, h * 0.6), 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(b.x, b.y - h * 0.4, Math.max(1, w * 0.26), Math.max(3, h * 0.38), 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Güdümlü Mikro Füzeler (Ayrıksı Neon Macross Magenta/Ruby Rengi - Yüksek Performans)
    for (let m of this.homingMissiles) {
      if (m.state === 'stalking') {
        // Kanatta hazır bekleyen füze podu ve kilitlenme çerçevesi
        ctx.fillStyle = '#ff0077';
        ctx.beginPath();
        ctx.arc(m.x, m.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 0, 119, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(m.x - 4.5, m.y - 4.5, 9, 9);
      } else {
        // Ateşlenmiş ve uçan füze
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(Math.atan2(m.vy, m.vx) + Math.PI / 2);
        ctx.fillStyle = '#ff0055';

        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.lineTo(3.2, 4);
        ctx.lineTo(0, 2);
        ctx.lineTo(-3.2, 4);
        ctx.closePath();
        ctx.fill();

        // Roket alev ucu
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-1, 2, 2, 3);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  triggerSkinOverdriveBurst() {
    const skinId = this.currentSkinId || 'cyberpunk';
    sounds.playLaser();

    if (skinId === 'cyberpunk') {
      // SİBERPUNK: Zaman Bükücü Dörtlü Hiper Işın (Quad Chrono Beams)
      this.slowMoTimer = Math.max(this.slowMoTimer || 0, 4);
      for (let angle of [-0.24, -0.08, 0.08, 0.24]) {
        this.playerBullets.push({
          x: this.player.x,
          y: this.player.y - 14,
          vx: Math.sin(angle) * 16,
          vy: -Math.cos(angle) * 16,
          damage: 20,
          radius: 5,
          color: '#00f0ff',
          isPiercing: true
        });
      }
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 60);
    } else if (skinId === 'solar') {
      // GÜNEŞ FIRTINASI: Süpernova Güneş Halkası (Radial Solar Nova)
      this.screenShake = 5;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 200);
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ff5500', 140);
      for (let enemy of this.enemies) {
        if (!enemy.toRemove && enemy.hp > 0) {
          const d = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
          if (d < 200) {
            enemy.hp -= 24;
            this.particles.spawnExplosion(enemy.x, enemy.y, '#ff5500', 6, 2.5);
          }
        }
      }
    } else if (skinId === 'toxic') {
      // ZEHİR NEON: Asit Plazma Fırtınası (Radial Piercing Spores)
      for (let a = 0; a < 8; a++) {
        const ang = (a * Math.PI / 4) + (Math.random() - 0.5) * 0.15;
        this.playerBullets.push({
          x: this.player.x,
          y: this.player.y,
          vx: Math.cos(ang) * 9.5,
          vy: Math.sin(ang) * 9.5,
          damage: 16,
          radius: 5.5,
          color: '#05ffa1',
          isPiercing: true
        });
      }
      this.particles.spawnShockwave(this.player.x, this.player.y, '#05ffa1', 75);
    } else if (skinId === 'phantom') {
      // HAYALET PLAZMA: Boyutlar Arası Kuantum Füzeleri (Quantum Void Volley)
      for (let m = 0; m < 3; m++) {
        sounds.playMissile();
        this.homingMissiles.push({
          x: this.player.x + (m - 1) * 16,
          y: this.player.y - 8,
          vx: (m - 1) * 2.2,
          vy: -6,
          speed: 9.0,
          damage: 18,
          isCluster: false,
          life: 180,
          state: 'active',
          delay: 0,
          targetX: 0,
          targetY: 0
        });
      }
      this.particles.spawnShockwave(this.player.x, this.player.y, '#e0f7fa', 80);
    } else if (skinId === 'vortex') {
      // VORTEX NEBULA: Gravitasyonel Kozmik Çöküş & Karadelik Girdapları
      for (let ox of [-38, 38]) {
        this.vortices.push({
          x: this.player.x + ox,
          y: this.player.y - 75,
          timer: 110,
          radius: 55
        });
      }
      this.particles.spawnExplosion(this.player.x, this.player.y - 40, '#bf5af2', 12, 2.5);
    } else if (skinId === 'chrono') {
      // CHRONO APEX: Krono Zaman Durdurma & Beşli Delici İğne
      this.slowMoTimer = Math.max(this.slowMoTimer || 0, 28);
      sounds.playLevelUp();
      for (let angle of [-0.28, -0.14, 0, 0.14, 0.28]) {
        this.playerBullets.push({
          x: this.player.x,
          y: this.player.y - 18,
          vx: Math.sin(angle) * 19,
          vy: -Math.cos(angle) * 19,
          damage: 30,
          radius: 5.5,
          color: '#ffd700',
          isPiercing: true,
          isCrit: true
        });
      }
      this.particles.spawnExplosion(this.player.x, this.player.y, '#ffd700', 14, 3);
    }
  }

  drawPlayerAfterimages() {
    return;
  }

  drawPlayerShip() {
    ctx.save();
    ctx.translate(this.player.x, this.player.y);
    ctx.rotate(this.player.tilt);
    const r = this.player.visualRadius || 26;

    // Kostüm Renkleri
    const skin = this.skins[this.currentSkinId] || this.skins.cyberpunk;
    const primaryColor = this.player.isFever ? '#ffbe0b' : skin.primary;
    const secondaryColor = this.player.isFever ? '#ffffff' : skin.secondary;
    const cockpitColor = this.player.isFever ? '#ffffff' : skin.cockpit;

    // Overcharge Mor Elektrik Aurası
    if (this.player.overchargeTimer > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(191, 90, 242, 0.35)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, r + 10 + Math.sin(this.gameTime * 15) * 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#bf5af2';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }



    // 2. İkiz Motor Nozülleri (Twin Afterburner Thruster Pods)
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.5;
    // Sol motor podu
    ctx.fillRect(-9, r * 0.55, 5, 8);
    ctx.strokeRect(-9, r * 0.55, 5, 8);
    // Sağ motor podu
    ctx.fillRect(4, r * 0.55, 5, 8);
    ctx.strokeRect(4, r * 0.55, 5, 8);

    // Motor iç plazma alevi çekirdekleri (Hücum hattında alevler kızıla parlar!)
    const activeTrail = (this.trails && this.trails[this.equippedTrailId]) || null;
    let baseFlame = (activeTrail && activeTrail.id !== 'default') ? activeTrail.color : skin.flame;
    if (activeTrail && activeTrail.id === 'rainbow') {
      baseFlame = `hsl(${((this.frames || 0) * 10) % 360}, 100%, 65%)`;
    }
    let thrusterColor = this.player.overchargeTimer > 0 ? '#bf5af2' : (this.player.isFever ? '#ffbe0b' : baseFlame);
    if (this.player.combatZone === 'front') {
      thrusterColor = '#ff0055';
    } else if (this.player.combatZone === 'rear') {
      thrusterColor = '#00f0ff';
    }
    ctx.fillStyle = thrusterColor;
    ctx.fillRect(-8, r * 0.8, 3, 3);
    ctx.fillRect(5, r * 0.8, 3, 3);

    // Motor itki alevleri (Hücum hattında daha uzun akkor plazma!)
    const isFrontZone = this.player.combatZone === 'front';
    const flamePulse = 0.8 + Math.sin((this.frames || 0) * 0.35) * 0.3;
    const baseFlameLen = isFrontZone ? 16 : 9;
    const flameLen = baseFlameLen * flamePulse;
    ctx.fillStyle = thrusterColor;

    // Sol itki alevi
    ctx.beginPath();
    ctx.moveTo(-9, r * 0.85);
    ctx.lineTo(-6.5, r * 0.85 + flameLen);
    ctx.lineTo(-4, r * 0.85);
    ctx.closePath();
    ctx.fill();

    // Sağ itki alevi
    ctx.beginPath();
    ctx.moveTo(4, r * 0.85);
    ctx.lineTo(6.5, r * 0.85 + flameLen);
    ctx.lineTo(9, r * 0.85);
    ctx.closePath();
    ctx.fill();

    // 3. Kanat Ucu Lazer Namlu Kovanları (Wingtip Blaster Pods)
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.4;
    // Sol kanat namlusu
    ctx.fillRect(-r * 1.35, -r * 0.25, 3.5, r * 0.95);
    ctx.strokeRect(-r * 1.35, -r * 0.25, 3.5, r * 0.95);
    // Sağ kanat namlusu
    ctx.fillRect(r * 1.35 - 3.5, -r * 0.25, 3.5, r * 0.95);
    ctx.strokeRect(r * 1.35 - 3.5, -r * 0.25, 3.5, r * 0.95);
    // Namlu ucu hazır enerji parıltısı (Hücum hattında akkor plazma)
    let blasterGlow = this.player.isStationary ? '#00f0ff' : primaryColor;
    if (this.player.combatZone === 'front') {
      blasterGlow = '#ff0055';
    } else if (this.player.combatZone === 'rear') {
      blasterGlow = '#38bdf8';
    }
    ctx.fillStyle = this.player.overchargeTimer > 0 ? '#bf5af2' : (this.player.isFever ? '#ffbe0b' : blasterGlow);
    ctx.fillRect(-r * 1.35, -r * 0.45, 3.5, this.player.isStationary ? 4.5 : 3);
    ctx.fillRect(r * 1.35 - 3.5, -r * 0.45, 3.5, this.player.isStationary ? 4.5 : 3);

    // Hareket etmediğinde namlu uçlarında odaklanma halkası
    if (this.player.isStationary) {
      ctx.save();
      const pPulse = 0.5 + Math.sin((this.frames || 0) * 0.22) * 0.5;
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.4 + pPulse * 0.5})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(-r * 1.35 + 1.75, -r * 0.45, 3.5 + pPulse * 1.5, 0, Math.PI * 2);
      ctx.arc(r * 1.35 - 1.75, -r * 0.45, 3.5 + pPulse * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Ana Gemi Gövdesi ve Kanat Yapısı (Yüksek Kontrastlı, Net ve Kusursuz Görsel)
    ctx.save();
    const bodyGrad = ctx.createLinearGradient(0, -r * 1.55, 0, r * 1.05);
    bodyGrad.addColorStop(0, '#1e293b'); // Koyu titanyum gri
    bodyGrad.addColorStop(0.5, '#0f172a'); // Derin metalik donanma mavisi
    bodyGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2.6;

    // Transformers / Pokemon Evrim Geometrisi:
    // Hücum (front) bölgesinde: İleri ok gibi açılmış hücum kanatları (Forward-swept assault wings)
    // Sniper (rear) bölgesinde: Gövdeye yapışık, dar süpersonik iğne profili
    // Orta (mid) bölgede: Klasik dengeli delta kanat
    const zone = this.player.combatZone || 'mid';
    let wingTipX = r * 1.35;
    let wingTipY = r * 0.65;
    let wingBaseX = r * 1.3;
    let wingBaseY = r * 1.05;
    let canardTipX = r * 0.58;
    let canardTipY = -r * 0.45;

    if (zone === 'front') {
      // Hücum Hattı: Kanatlar agresif biçimde ileri doğru açılır ve silecek kılıcıyla kenetlenir
      wingTipX = r * 1.48;
      wingTipY = r * 0.18;
      wingBaseX = r * 1.36;
      wingBaseY = r * 0.72;
      canardTipX = r * 0.72;
      canardTipY = -r * 0.60;
    } else if (zone === 'rear') {
      // Sniper Hattı: Kanatlar daralır ve gövde boyunca iğne gibi geriye uzanır
      wingTipX = r * 1.08;
      wingTipY = r * 0.88;
      wingBaseX = r * 1.02;
      wingBaseY = r * 1.18;
      canardTipX = r * 0.42;
      canardTipY = -r * 0.32;
    }

    // Mekanik Dönüşüm Geçiş İnterpolasyonu (Transformers / Pokemon Evolution Morph Shift)
    const morph = this.player.morphAnim || 0;
    if (morph > 0) {
      const morphShift = Math.sin(morph * Math.PI) * 5;
      wingTipX += morphShift;
      canardTipX += morphShift * 0.6;
    }

    // Tam kanat & gövde poligonu
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.55);
    ctx.lineTo(r * 0.28, -r * 0.9);
    ctx.lineTo(canardTipX, canardTipY);
    ctx.lineTo(r * 0.35, -r * 0.25);
    ctx.lineTo(wingTipX, wingTipY);
    ctx.lineTo(wingBaseX, wingBaseY);
    ctx.lineTo(r * 0.5, r * 0.65);
    ctx.lineTo(r * 0.3, r * 0.85);
    ctx.lineTo(0, r * 0.6);
    ctx.lineTo(-r * 0.3, r * 0.85);
    ctx.lineTo(-r * 0.5, r * 0.65);
    ctx.lineTo(-wingBaseX, wingBaseY);
    ctx.lineTo(-wingTipX, wingTipY);
    ctx.lineTo(-r * 0.35, -r * 0.25);
    ctx.lineTo(-canardTipX, canardTipY);
    ctx.lineTo(-r * 0.28, -r * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // İç Titanyum Zırh Plakaları
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.15);
    ctx.lineTo(r * 0.24, -r * 0.2);
    ctx.lineTo(r * 0.85, r * 0.52);
    ctx.lineTo(r * 0.4, r * 0.48);
    ctx.lineTo(0, r * 0.4);
    ctx.lineTo(-r * 0.4, r * 0.48);
    ctx.lineTo(-r * 0.85, r * 0.52);
    ctx.lineTo(-r * 0.24, -r * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Merkez Füzyon Reaktörü Çekirdeği (Parlak Neon Nabız)
    ctx.save();
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();



    // Neon Enerji Dağıtım Hatları
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-r * 0.22, -r * 0.1);
    ctx.lineTo(-r * 0.78, r * 0.48);
    ctx.moveTo(r * 0.22, -r * 0.1);
    ctx.lineTo(r * 0.78, r * 0.48);
    ctx.stroke();

    // Kokpit Camı (Parlak Kristal Saydamlık)
    ctx.fillStyle = cockpitColor;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.85);
    ctx.lineTo(r * 0.22, -r * 0.25);
    ctx.lineTo(r * 0.18, r * 0.22);
    ctx.lineTo(0, r * 0.35);
    ctx.lineTo(-r * 0.18, r * 0.22);
    ctx.lineTo(-r * 0.22, -r * 0.25);
    ctx.closePath();
    ctx.fill();

    // Kokpit İçi Specular Işık Yansıması
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.65;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(-r * 0.06, -r * 0.65);
    ctx.lineTo(-r * 0.03, -r * 0.15);
    ctx.lineTo(-r * 0.10, -r * 0.15);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.restore();

    // === KESKİN NİŞANCI (REAR ZONE): ELEKTRO-RAY HYPER RAILGUN NAMLUSU ===
    if (this.player.combatZone === 'rear') {
      ctx.save();
      // Çift ray namlusu (titanyum & neon mavi)
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(-2.8, -r * 2.3, 2.0, r * 0.85);
      ctx.strokeRect(0.8, -r * 2.3, 2.0, r * 0.85);

      // Manyetik odaklama halkaları
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(-4.5, -r * 1.9, 9, 2.2);
      ctx.fillRect(-4.5, -r * 2.18, 9, 2.2);

      // Namlu ucunda biriken elektro-plazma çekirdeği
      const rPulse = 0.5 + Math.sin((this.frames || 0) * 0.3) * 0.5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -r * 2.32, 2.2 + rPulse * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    // === ANLIK TAKTİKSEL MOD ETİKETİ (FLOATING COMBAT ZONE BADGE) ===
    if (this.player.zoneBannerTimer > 0) {
      this.player.zoneBannerTimer -= dt;
      const bannerAlpha = Math.min(1.0, this.player.zoneBannerTimer / 20);
      ctx.save();
      ctx.globalAlpha = bannerAlpha;
      const bx = this.player.x;
      const by = this.player.y - 48;

      const text = this.player.zoneBannerText || '';
      const bColor = this.player.zoneBannerColor || '#00f0ff';

      ctx.font = 'bold 12px "Segoe UI", sans-serif';
      const tw = ctx.measureText(text).width;
      const pw = tw + 24;
      const ph = 26;

      // Cyber pill arka plan
      ctx.fillStyle = 'rgba(6, 10, 24, 0.92)';
      ctx.strokeStyle = bColor;
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      ctx.roundRect(bx - pw / 2, by - ph / 2, pw, ph, 13);
      ctx.fill();
      ctx.stroke();

      // Parlak metin
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx, by);

      ctx.restore();
    }

    // Koruyucu Dönen Uydular (Kullanıcı talebi doğrultusunda etrafta dönen noktalar ve çizgiler tamamen kaldırıldı)
  }

  drawOrbitalSaws() {
    if (!this.player.evolutions || !this.player.evolutions.orbitalSaws) return;
    ctx.save();
    const sawDist = 72;
    for (let s = 0; s < 2; s++) {
      const ang = (this.sawAngle || 0) + s * Math.PI;
      const sx = this.player.x + Math.cos(ang) * sawDist;
      const sy = this.player.y + Math.sin(ang) * sawDist;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate((this.frames || 0) * 0.35 + s);

      // Neon Dönen Testere Bıçağı
      ctx.strokeStyle = '#ff0055';
      ctx.fillStyle = '#ffbe0b';
      ctx.lineWidth = 2.2;

      const teeth = 8;
      const rOuter = 16;
      const rInner = 9;
      ctx.beginPath();
      for (let t = 0; t < teeth; t++) {
        const a1 = (t / teeth) * Math.PI * 2;
        const a2 = ((t + 0.5) / teeth) * Math.PI * 2;
        ctx.lineTo(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter);
        ctx.lineTo(Math.cos(a2) * rInner, Math.sin(a2) * rInner);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();
  }

  drawOverdriveBar() {
    const barWidth = Math.min(180, this.width * 0.45);
    const barHeight = 4;
    const x = (this.width - barWidth) / 2;
    const y = this.height - 18;

    ctx.save();
    // Oyuncu ekranın altındaysa arayüz şeffaflaşarak görüşü tıkamaz
    const playerNearBottom = this.player.y > this.height - 90;
    ctx.globalAlpha = playerNearBottom ? 0.3 : 0.85;

    // Arka plan izi
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, 2) : ctx.rect(x, y, barWidth, barHeight);
    ctx.fill();

    // Doluluk Oranı
    let ratio = 0;
    if (this.player.isFever) {
      ratio = this.player.feverTimer / 360;
      ctx.fillStyle = '#ffbe0b';
    } else {
      ratio = this.player.feverCharge / 100;
      ctx.fillStyle = '#00f0ff';
    }

    const fillW = Math.max(0, Math.min(barWidth, barWidth * ratio));
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, fillW, barHeight, 2) : ctx.rect(x, y, fillW, barHeight);
    ctx.fill();

    // Başlık
    ctx.font = 'bold 10px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = this.player.isFever ? '#ffbe0b' : '#94a3b8';
    ctx.fillText(this.player.isFever ? t('overdrive_active') : t('overdrive_ready'), this.width / 2, y - 5);

    ctx.restore();
  }

  drawCompanionDrone() {
    if (!this.companionDrone) return;
    const cd = this.companionDrone;
    ctx.save();
    ctx.translate(cd.x, cd.y);

    if (cd.cfg.type === 'clone') {
      // Mikro Klon Pet: Minyatür Alfa Savaş Jet Replikası
      ctx.fillStyle = cd.cfg.color || '#00f0ff';
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.lineTo(6, 6);
      ctx.lineTo(2, 4);
      ctx.lineTo(0, 6);
      ctx.lineTo(-2, 4);
      ctx.lineTo(-6, 6);
      ctx.closePath();
      ctx.fill();

      // Kokpit
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, -3, 2, 4);

      // İtici alevi
      ctx.fillStyle = '#ffbe0b';
      ctx.fillRect(-1.5, 6, 3, 3 + Math.sin((this.frames || 0) * 0.4) * 2);
    } else {
      // Drone dış halkası
      ctx.strokeStyle = cd.cfg.color;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.stroke();

      // Drone iç çekirdeği (nabız gibi atar)
      const p = 0.7 + Math.sin((this.frames || 0) * 0.15) * 0.3;
      ctx.fillStyle = cd.cfg.color;
      ctx.beginPath();
      ctx.arc(0, 0, 3 * p, 0, Math.PI * 2);
      ctx.fill();

      if (cd.cfg.type === 'tesla') {
        // Mini elektrik kıvılcımları
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const a = (this.frames || 0) * 0.2;
        ctx.moveTo(Math.cos(a) * 6, Math.sin(a) * 6);
        ctx.lineTo(Math.cos(a + 2) * 8, Math.sin(a + 2) * 8);
        ctx.stroke();
      }
    }

    // Drone seviye rozeti
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${cd.level}`, 0, 15);

    ctx.restore();
  }

  syncWingmen() {
    if (!this.player) return;
    if (!this.player.wingmen) this.player.wingmen = [];
    const count = Math.min(2, this.player.upgrades.wingman || 0);

    if (count === 0) {
      this.player.wingmen = [];
      return;
    }

    // 1. Sol Kanat Mikro Klon Jet
    if (count >= 1 && !this.player.wingmen.find(w => w.side === -1)) {
      this.player.wingmen.push({
        side: -1,
        x: this.player.x - 34,
        y: this.player.y + 10,
        tilt: 0,
        shootTimer: 0
      });
    }

    // 2. Sağ Kanat Mikro Klon Jet
    if (count >= 2 && !this.player.wingmen.find(w => w.side === 1)) {
      this.player.wingmen.push({
        side: 1,
        x: this.player.x + 34,
        y: this.player.y + 10,
        tilt: 0,
        shootTimer: 23 // Dengeli ve tatmin edici ardışık çift ritim ofseti
      });
    }

    // Seviye 1'e inerse sağ kanadı temizle
    if (count === 1) {
      this.player.wingmen = this.player.wingmen.filter(w => w.side === -1);
    }
  }

  updateWingmen(dt) {
    if (!this.player) return;
    const wmLevel = this.player.upgrades.wingman || 0;
    if (wmLevel <= 0) return;

    if (!this.player.wingmen || this.player.wingmen.length === 0) {
      this.syncWingmen();
    }

    const skin = this.skins[this.currentSkinId] || this.skins.cyberpunk;
    const bulletColor = this.player.isFever ? '#ffbe0b' : skin.primary;

    // Kullanıcı talebi: "yanımıza çok ufak bizim kopyamız gibi bi uçak gelsin o yavaş yavaş sıksın"
    // Lvl 1 & 2: ~46 frame (yaklaşık 0.76 saniyede bir sakin ve ritmik plazma)
    // Lvl 3: ~34 frame (yaklaşık 0.56 saniyede bir hafif hızlanan ikili destek)
    const shootInterval = wmLevel >= 3 ? 34 : 46;
    const baseDamage = Math.round((16 + (wmLevel - 1) * 6) * (this.player.damageMultiplier || 1.0));

    for (let wm of this.player.wingmen) {
      // Pürüzsüz takip ve süzülme fiziği (Hovering & Spring Lag)
      const hoverX = Math.sin((this.gameTime || 0) * 3.5 + wm.side * 1.5) * 2;
      const hoverY = Math.cos((this.gameTime || 0) * 4.0 + wm.side * 1.5) * 3;
      const targetX = this.player.x + wm.side * 34 + hoverX;
      const targetY = this.player.y + 8 + hoverY;

      wm.x += (targetX - wm.x) * 0.16 * dt;
      wm.y += (targetY - wm.y) * 0.16 * dt;
      wm.tilt = (this.player.tilt || 0) * 0.85;

      // Ritmik atış sayacı
      wm.shootTimer = (wm.shootTimer || 0) + dt;
      if (wm.shootTimer >= shootInterval) {
        wm.shootTimer = 0;

        // Hafif dışarı doğru açılı yayılım (flank tarama)
        const spreadVx = wm.side * (wmLevel >= 3 ? 0.4 : 0.2);

        this.playerBullets.push({
          x: wm.x,
          y: wm.y - 12,
          vx: spreadVx,
          vy: -15,
          damage: baseDamage,
          w: 4,
          h: 12,
          color: bulletColor,
          isWingmanBullet: true,
          piercing: wmLevel >= 3,
          isCrit: Math.random() < 0.15,
          maxRange: 850,
          traveled: 0
        });

        // Minyatür namlu plazma parıltısı ve hafif lazer sesi
        this.particles.spawnExplosion(wm.x, wm.y - 12, bulletColor, 2, 0.8);
        sounds.playLaser();
      }
    }
  }

  drawWingmen() {
    if (!this.player) return;
    const wmLevel = this.player.upgrades.wingman || 0;
    if (wmLevel <= 0 || !this.player.wingmen || this.player.wingmen.length === 0) return;

    const skin = this.skins[this.currentSkinId] || this.skins.cyberpunk;
    const primaryColor = this.player.isFever ? '#ffbe0b' : skin.primary;
    const secondaryColor = this.player.isFever ? '#ffffff' : skin.secondary;
    const cockpitColor = this.player.isFever ? '#ffffff' : skin.cockpit;

    for (let wm of this.player.wingmen) {
      ctx.save();
      ctx.translate(wm.x, wm.y);
      ctx.rotate(wm.tilt || 0);

      // Oyuncu gemisinin birebir sevimli minyatür kopyası (~0.36x ölçek)
      const scale = 0.36;
      ctx.scale(scale, scale);
      const r = this.player.visualRadius || 26;

      // 1. Minyatür İtki Alevleri
      const flamePulse = 0.75 + Math.sin(((this.frames || 0) + wm.side * 12) * 0.4) * 0.25;
      const flameLen = 10 * flamePulse;
      ctx.fillStyle = skin.flame || '#00f0ff';
      // Sol motor
      ctx.beginPath();
      ctx.moveTo(-9, r * 0.85);
      ctx.lineTo(-6.5, r * 0.85 + flameLen);
      ctx.lineTo(-4, r * 0.85);
      ctx.closePath();
      ctx.fill();
      // Sağ motor
      ctx.beginPath();
      ctx.moveTo(4, r * 0.85);
      ctx.lineTo(6.5, r * 0.85 + flameLen);
      ctx.lineTo(9, r * 0.85);
      ctx.closePath();
      ctx.fill();

      // 2. Motor Podları
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.0;
      ctx.fillRect(-9, r * 0.55, 5, 8);
      ctx.strokeRect(-9, r * 0.55, 5, 8);
      ctx.fillRect(4, r * 0.55, 5, 8);
      ctx.strokeRect(4, r * 0.55, 5, 8);

      // 3. Mini Kanat Ucu Lazer Namluları
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-r * 1.35, -r * 0.25, 4, r * 0.9);
      ctx.strokeRect(-r * 1.35, -r * 0.25, 4, r * 0.9);
      ctx.fillRect(r * 1.35 - 4, -r * 0.25, 4, r * 0.9);
      ctx.strokeRect(r * 1.35 - 4, -r * 0.25, 4, r * 0.9);

      // Namlu ucu hazır enerji parıltısı
      ctx.fillStyle = primaryColor;
      ctx.fillRect(-r * 1.35, -r * 0.45, 4, 3);
      ctx.fillRect(r * 1.35 - 4, -r * 0.45, 4, 3);

      // 4. Ana Mini Gövde & Delta Kanatlar (Tam Oyuncu Formu)
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.55);
      ctx.lineTo(r * 0.28, -r * 0.9);
      ctx.lineTo(r * 0.55, -r * 0.45);
      ctx.lineTo(r * 0.35, -r * 0.25);
      ctx.lineTo(r * 1.35, r * 0.65);
      ctx.lineTo(r * 1.25, r * 1.0);
      ctx.lineTo(r * 0.3, r * 0.85);
      ctx.lineTo(0, r * 0.6);
      ctx.lineTo(-r * 0.3, r * 0.85);
      ctx.lineTo(-r * 1.25, r * 1.0);
      ctx.lineTo(-r * 1.35, r * 0.65);
      ctx.lineTo(-r * 0.35, -r * 0.25);
      ctx.lineTo(-r * 0.55, -r * 0.45);
      ctx.lineTo(-r * 0.28, -r * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 5. İç Titanyum Zırh Plakaları
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.15);
      ctx.lineTo(r * 0.24, -r * 0.2);
      ctx.lineTo(r * 0.85, r * 0.52);
      ctx.lineTo(r * 0.4, r * 0.48);
      ctx.lineTo(0, r * 0.4);
      ctx.lineTo(-r * 0.4, r * 0.48);
      ctx.lineTo(-r * 0.85, r * 0.52);
      ctx.lineTo(-r * 0.24, -r * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 6. Mini Kokpit Camı
      ctx.fillStyle = cockpitColor;
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.35, 4.5, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // 7. Merkez Mikro Füzyon Reaktörü Çekirdeği
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.arc(0, r * 0.15, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Ana Döngü (120Hz/90Hz/60Hz ekranlarda pürüzsüz ve sabit hız garantisi)
  loop(timestamp = performance.now()) {
    if (!this.lastTime) this.lastTime = timestamp;
    let elapsed = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (elapsed > 100) elapsed = 100;
    let dt = Math.max(0.2, Math.min(2.0, elapsed / 16.667));

    // Hitstop mikro-etkisi (Döngüyü dondurmadan yumuşak geçiş)
    if (this.particles && this.particles.hitstopTimer > 0) {
      this.particles.hitstopTimer -= dt;
    }

    // Ağır Çekim (Slow-Motion) Etkisi
    if (this.slowMoTimer > 0) {
      dt *= 0.25;
      this.slowMoTimer--;
    }

    try {
      this.update(dt);
      this.draw();
    } catch (err) {
      console.error("Kritik oyun döngüsü hatası engellendi:", err);
    }
    requestAnimationFrame((t) => this.loop(t));
  }

  onLanguageChanged(newLang) {
    applyTranslationsToDOM();
    this.initLuckyWheel();
    this.updateWheelUI();
    if (this.renderLeaderboard) this.renderLeaderboard(this.lbMode || 'storm');
    this.updateMenuShipPreview();
    this.updatePilotRankDisplay();
    this.updateLevelDisplay();
    this.updateHighScoreDisplay();
    this.checkDailyReward();
    this.renderMissions();
  }
}

// Oyunu Güvenli Başlat (DOMContentLoaded kaçırma ve siyah ekran koruması)
function bootGame() {
  try {
    const game = new Game();
    game.loop();
  } catch (err) {
    console.error("Oyun başlatma hatası:", err);
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootGame);
} else {
  bootGame();
}
