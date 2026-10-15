// === NEON SPACE SURVIVOR - ANA OYUN MOTORU ===
import { sounds } from './audio.js';
import { vibrate } from './vibration.js';
import { ParticleSystem } from './particles.js';
import { Enemy, EnemyProjectile, Gem, PowerUp, LuckyChest } from './enemies.js';
import { t, getCurrentLanguage, setLanguage, SUPPORTED_LANGUAGES, applyTranslationsToDOM } from './i18n.js';

function txt(key, fallback) {
  const v = t(key);
  return v && v !== key ? v : (fallback || key);
}

function noteAdMiss(game, err) {
  if (!game || !game.showToast) return;
  if (err === 'loading') game.showToast(t('ad_still_loading'), '#ffbe0b');
  else if (err === 'unavailable' || err === 'ad_cancelled_or_unavailable') game.showToast(t('toast_ad_not_ready'), '#ffbe0b');
  else game.showToast(t('toast_ad_incomplete'), '#ff0055');
}

function trophyGoal(def) {
  const key = 'trophy_goal_' + def.stat;
  const v = t(key, { n: Number(def.target).toLocaleString() });
  return v && v !== key ? v : def.desc;
}

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
const eventBannerKicker = document.getElementById('event-banner-kicker');

function flashEventBanner(message, tone = 'info') {
  if (!eventBanner || !eventBannerText) return;
  eventBanner.classList.remove('threat', 'info');
  void eventBanner.offsetWidth;
  eventBanner.classList.add(tone === 'threat' ? 'threat' : 'info');
  if (eventBannerKicker) eventBannerKicker.textContent = tone === 'threat' ? t('banner_threat') : '';
  eventBannerText.textContent = message;
  eventBanner.classList.remove('hidden');
}

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
const hudRecordTarget = document.getElementById('hud-record-target');

// Butonlar & Menü Elemanları
const btnStart = document.getElementById('btn-start');
const btnContinue = document.getElementById('btn-continue');
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
const btnMenuShipAction = document.getElementById('btn-menu-ship-action');
const menuShipActionText = document.getElementById('menu-ship-action-text');
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
    freeze: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M5 0h2v12H5zM0 5h12v2H0zM2 2h2v2H2zM8 2h2v2H8zM2 8h2v2H2zM8 8h2v2H8z" fill="#00f0ff"/></svg>',
    lock: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M4 2h4v3H4z" fill="none" stroke="#ff4d4d" stroke-width="1.8"/><rect x="2" y="5" width="8" height="6" fill="#ff4d4d"/><rect x="5" y="7" width="2" height="2" fill="#030816"/></svg>',
    check: '<svg class="' + sClass + '" viewBox="0 0 12 12"><path d="M10 2L4 9 1 6l1.5-1.5L4 6l4.5-5.5z" fill="#05ffa1"/></svg>',
    coin: '<svg class="' + sClass + '" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="#ffbe0b"/><rect x="5" y="3" width="2" height="6" fill="#ff3d00"/><path d="M4 2h4v1H4zM4 9h4v1H4z" fill="#fff"/></svg>'
  };
  return icons[name] || '';
}

function pixelPips(filled, total) {
  let html = '';
  for (let i = 0; i < total; i++) html += `<span class="px-star ${i < filled ? 'on' : ''}"></span>`;
  return html;
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
    
    // Çoklu Mod ve Skor Sistemi (Fırtına / Sonsuz Skor Modu Varsayılan)
    this.currentMode = localStorage.getItem('neon_current_mode') || 'storm';
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
    this.isMerchantActive = false;
    this.modalTransition = null;
    this.resumeRampTimer = 0;
    this.resumeRampDuration = 34;
    this.modalInputLockUntil = 0;

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
      nextXp: 25,
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
    this.dominoQueue = [];
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
    this.fireZones = [];
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

    // Geliştirici modu yalnız yerel derlemede. Mağaza AAB'sinde her zaman kapalı.
    if (import.meta.env.PROD) {
      this.devMode = false;
      try {
        localStorage.setItem('neon_dev_mode', 'false');
        const stored = parseInt(localStorage.getItem('neon_total_crystals') || '0', 10);
        if (!Number.isFinite(stored) || stored >= 999999999) {
          const prev = parseInt(localStorage.getItem('neon_pre_dev_crystals') || '0', 10);
          this.totalCrystals = Number.isFinite(prev) && prev < 999999999 ? prev : 0;
          localStorage.setItem('neon_total_crystals', String(this.totalCrystals));
          localStorage.removeItem('neon_pre_dev_crystals');
        } else {
          this.totalCrystals = stored;
        }
      } catch (e) {
        this.totalCrystals = parseInt(localStorage.getItem('neon_total_crystals') || '0', 10) || 0;
      }
      const devBox = document.getElementById('dev-mode-section');
      if (devBox) devBox.remove();
    } else {
      this.devMode = localStorage.getItem('neon_dev_mode') === 'true';
      if (this.devMode) {
        this.totalCrystals = 999999999;
      } else {
        this.totalCrystals = parseInt(localStorage.getItem('neon_total_crystals') || '0', 10);
      }
    }

    // Pilot Ustalık Ağacı (Mastery Tree)
    this.tabBtnTech = typeof tabBtnTech !== 'undefined' ? tabBtnTech : document.getElementById('tab-btn-tech');
    this.masteryTree = JSON.parse(localStorage.getItem('neon_mastery') || 'null') || {
      magnet: 0,    // Mıknatıs menzili +%10/lv (max 5)
      critDmg: 0,   // Kritik hasar +%8/lv (max 5)
      startShield: 0, // Başlangıç kalkan +10/lv (max 3)
      xpBonus: 0,   // XP kazancı +%10/lv (max 5)
      crystalBonus: 0, // Kristal kazancı +%12/lv (max 4)
      rerollStart: 0  // Başlangıç reroll hakkı +1/lv (max 2)
    };

    // 50 Kademeli Başarım Sistemi (10 Kategori x 5 Aşama - 4. ve 5. Usta/Efsane Kademeler Eklendi)
    this.trophies = JSON.parse(localStorage.getItem('neon_trophies') || '{}');
    this.trophyCategoryView = 'progressive';
    this.trophyDefs = [
      // 1. Düşman Avcısı (kill)
      { id: 'kill_1', category: 'kill', tier: 1, name: 'İlk Av', desc: 'Toplam 15 düşman yok et', icon: 'target', stat: 'totalKills', target: 15, reward: 15 },
      { id: 'kill_2', category: 'kill', tier: 2, name: 'Kozmik Avcı', desc: 'Toplam 120 düşman yok et', icon: 'sword', stat: 'totalKills', target: 120, reward: 35 },
      { id: 'kill_3', category: 'kill', tier: 3, name: 'Yıldız Katili', desc: 'Toplam 750 düşman yok et', icon: 'target', stat: 'totalKills', target: 750, reward: 80 },
      { id: 'kill_4', category: 'kill', tier: 4, name: 'Galaksi Kasırgası', desc: 'Toplam 2,500 düşman yok et', icon: 'sword', stat: 'totalKills', target: 2500, reward: 180 },
      { id: 'kill_5', category: 'kill', tier: 5, name: 'Hiçlik Yok Edici', desc: 'Toplam 8,000 düşman yok et', icon: 'crown', stat: 'totalKills', target: 8000, reward: 360 },

      // 2. Asteroit Kıran (asteroid)
      { id: 'asteroid_1', category: 'asteroid', tier: 1, name: 'Taş Kırıcı', desc: '50 asteroit parçala', icon: 'fire', stat: 'asteroidsDestroyed', target: 50, reward: 15 },
      { id: 'asteroid_2', category: 'asteroid', tier: 2, name: 'Meteor Yağmuru', desc: '350 asteroit parçala', icon: 'bomb', stat: 'asteroidsDestroyed', target: 350, reward: 35 },
      { id: 'asteroid_3', category: 'asteroid', tier: 3, name: 'Kuşak Temizleyici', desc: '1,800 asteroit parçala', icon: 'fire', stat: 'asteroidsDestroyed', target: 1800, reward: 80 },
      { id: 'asteroid_4', category: 'asteroid', tier: 4, name: 'Göktaşı Kıyameti', desc: '6,000 asteroit parçala', icon: 'bomb', stat: 'asteroidsDestroyed', target: 6000, reward: 180 },
      { id: 'asteroid_5', category: 'asteroid', tier: 5, name: 'Gezegen Parçalayıcı', desc: '18,000 asteroit parçala', icon: 'crown', stat: 'asteroidsDestroyed', target: 18000, reward: 380 },

      // 3. Boss Avcısı (boss)
      { id: 'boss_1', category: 'boss', tier: 1, name: 'Amiral Tehdidi', desc: 'İlk Amiral Boss\'unu yen', icon: 'skull', stat: 'bossesDefeated', target: 1, reward: 25 },
      { id: 'boss_2', category: 'boss', tier: 2, name: 'Filo Avcısı', desc: 'Toplam 8 Boss yok et', icon: 'skull', stat: 'bossesDefeated', target: 8, reward: 50 },
      { id: 'boss_3', category: 'boss', tier: 3, name: 'Kozmik Ecel', desc: 'Toplam 30 Boss yok et', icon: 'sword', stat: 'bossesDefeated', target: 30, reward: 120 },
      { id: 'boss_4', category: 'boss', tier: 4, name: 'Amiral Kabusu', desc: 'Toplam 80 Boss yok et', icon: 'skull', stat: 'bossesDefeated', target: 80, reward: 220 },
      { id: 'boss_5', category: 'boss', tier: 5, name: 'Kozmik Hükümdar', desc: 'Toplam 200 Boss yok et', icon: 'crown', stat: 'bossesDefeated', target: 200, reward: 400 },

      // 4. Kombo Ustası (combo)
      { id: 'combo_1', category: 'combo', tier: 1, name: 'Seri Darbe', desc: '15x kombo zincirine ulaş', icon: 'energy', stat: 'maxCombo', target: 15, reward: 20 },
      { id: 'combo_2', category: 'combo', tier: 2, name: 'Fırtına Ritmi', desc: '35x kombo zincirine ulaş', icon: 'energy', stat: 'maxCombo', target: 35, reward: 45 },
      { id: 'combo_3', category: 'combo', tier: 3, name: 'Apex Akışı', desc: '65x maksimum kombo zincirine ulaş', icon: 'energy', stat: 'maxCombo', target: 65, reward: 90 },
      { id: 'combo_4', category: 'combo', tier: 4, name: 'Kuantum Ritim', desc: '100x maksimum kombo zincirine ulaş', icon: 'energy', stat: 'maxCombo', target: 100, reward: 180 },
      { id: 'combo_5', category: 'combo', tier: 5, name: 'Işık Hızı Serisi', desc: '150x maksimum kombo zincirine ulaş', icon: 'crown', stat: 'maxCombo', target: 150, reward: 350 },

      // 5. Hayatta Kalma (survive)
      { id: 'survive_1', category: 'survive', tier: 1, name: 'Uçuş Başlangıcı', desc: 'Tek seferde 90 saniye (1.5 dk) hayatta kal', icon: 'speed', stat: 'maxTime', target: 90, reward: 20 },
      { id: 'survive_2', category: 'survive', tier: 2, name: 'Zaman Savaşçısı', desc: 'Tek seferde 240 saniye (4 dk) hayatta kal', icon: 'speed', stat: 'maxTime', target: 240, reward: 50 },
      { id: 'survive_3', category: 'survive', tier: 3, name: 'Sonsuz Direniş', desc: 'Tek seferde 420 saniye (7 dk) hayatta kal', icon: 'shield', stat: 'maxTime', target: 420, reward: 110 },
      { id: 'survive_4', category: 'survive', tier: 4, name: 'Demir İrade', desc: 'Tek seferde 660 saniye (11 dk) hayatta kal', icon: 'shield', stat: 'maxTime', target: 660, reward: 220 },
      { id: 'survive_5', category: 'survive', tier: 5, name: 'Kozmik Ölümsüz', desc: 'Tek seferde 900 saniye (15 dk) hayatta kal', icon: 'crown', stat: 'maxTime', target: 900, reward: 360 },

      // 6. Kristal Zengini (crystal)
      { id: 'crystal_1', category: 'crystal', tier: 1, name: 'Ganimet Avcısı', desc: 'Toplam 250 kristal topla', icon: 'crystal', stat: 'lifetimeCrystals', target: 250, reward: 20 },
      { id: 'crystal_2', category: 'crystal', tier: 2, name: 'Kozmik Madenci', desc: 'Toplam 2,500 kristal topla', icon: 'crystal', stat: 'lifetimeCrystals', target: 2500, reward: 50 },
      { id: 'crystal_3', category: 'crystal', tier: 3, name: 'Kristal Baronu', desc: 'Toplam 15,000 kristal topla', icon: 'crystal', stat: 'lifetimeCrystals', target: 15000, reward: 110 },
      { id: 'crystal_4', category: 'crystal', tier: 4, name: 'Elmas İmparatoru', desc: 'Toplam 50,000 kristal topla', icon: 'crystal', stat: 'lifetimeCrystals', target: 50000, reward: 220 },
      { id: 'crystal_5', category: 'crystal', tier: 5, name: 'Evrensel Hazine', desc: 'Toplam 150,000 kristal topla', icon: 'crown', stat: 'lifetimeCrystals', target: 150000, reward: 380 },

      // 7. Sıyırma / Graze Ası (graze)
      { id: 'graze_1', category: 'graze', tier: 1, name: 'Kıl Payı', desc: '25 kez mermi veya tehlike sıyır', icon: 'speed', stat: 'totalGraze', target: 25, reward: 20 },
      { id: 'graze_2', category: 'graze', tier: 2, name: 'Refleks Pilotu', desc: '120 kez tehlike sıyır', icon: 'speed', stat: 'totalGraze', target: 120, reward: 50 },
      { id: 'graze_3', category: 'graze', tier: 3, name: 'Gölge Hayalet', desc: '500 kez tehlike sıyır', icon: 'shield', stat: 'totalGraze', target: 500, reward: 110 },
      { id: 'graze_4', category: 'graze', tier: 4, name: 'Sonsuz Dansçı', desc: '1,500 kez tehlike sıyır', icon: 'speed', stat: 'totalGraze', target: 1500, reward: 220 },
      { id: 'graze_5', category: 'graze', tier: 5, name: 'Kuantum Hayalet', desc: '4,500 kez tehlike sıyır', icon: 'crown', stat: 'totalGraze', target: 4500, reward: 360 },

      // 8. Sefer Uçuşları (flight)
      { id: 'flight_1', category: 'flight', tier: 1, name: 'Acemi Kanatlar', desc: '5 uçuş seferine çık', icon: 'ship', stat: 'totalFlights', target: 5, reward: 15 },
      { id: 'flight_2', category: 'flight', tier: 2, name: 'Kıdemli Filo', desc: '25 uçuş seferine çık', icon: 'ship', stat: 'totalFlights', target: 25, reward: 40 },
      { id: 'flight_3', category: 'flight', tier: 3, name: 'Uzay Gazisi', desc: '80 uçuş seferine çık', icon: 'ship', stat: 'totalFlights', target: 80, reward: 90 },
      { id: 'flight_4', category: 'flight', tier: 4, name: 'Galaksi Kaşifi', desc: '200 uçuş seferine çık', icon: 'ship', stat: 'totalFlights', target: 200, reward: 180 },
      { id: 'flight_5', category: 'flight', tier: 5, name: 'Zaman Seyyahı', desc: '500 uçuş seferine çık', icon: 'crown', stat: 'totalFlights', target: 500, reward: 350 },

      // 9. Şanslı Uzay Sandığı (chest)
      { id: 'chest_1', category: 'chest', tier: 1, name: 'İlk Sandık', desc: '2 şanslı uzay sandığı aç', icon: 'gift', stat: 'totalChests', target: 2, reward: 20 },
      { id: 'chest_2', category: 'chest', tier: 2, name: 'Hazine Avcısı', desc: '10 şanslı uzay sandığı aç', icon: 'gift', stat: 'totalChests', target: 10, reward: 50 },
      { id: 'chest_3', category: 'chest', tier: 3, name: 'Kozmik Zenginlik', desc: '35 şanslı uzay sandığı aç', icon: 'gift', stat: 'totalChests', target: 35, reward: 110 },
      { id: 'chest_4', category: 'chest', tier: 4, name: 'Kadim Sandık Avcısı', desc: '80 şanslı uzay sandığı aç', icon: 'gift', stat: 'totalChests', target: 80, reward: 220 },
      { id: 'chest_5', category: 'chest', tier: 5, name: 'Gizemler Efendisi', desc: '180 şanslı uzay sandığı aç', icon: 'crown', stat: 'totalChests', target: 180, reward: 360 },

      // 10. Bomba Patlatıcı (bomb)
      { id: 'bomb_1', category: 'bomb', tier: 1, name: 'Fünye', desc: '10 bomba asteroit patlat', icon: 'bomb', stat: 'bombAsteroidsDestroyed', target: 10, reward: 15 },
      { id: 'bomb_2', category: 'bomb', tier: 2, name: 'Şok Dalgası', desc: '50 bomba asteroit patlat', icon: 'bomb', stat: 'bombAsteroidsDestroyed', target: 50, reward: 40 },
      { id: 'bomb_3', category: 'bomb', tier: 3, name: 'Süpernova Patlaması', desc: '200 bomba asteroit patlat', icon: 'fire', stat: 'bombAsteroidsDestroyed', target: 200, reward: 100 },
      { id: 'bomb_4', category: 'bomb', tier: 4, name: 'Atomik Patlama', desc: '600 bomba asteroit patlat', icon: 'bomb', stat: 'bombAsteroidsDestroyed', target: 600, reward: 200 },
      { id: 'bomb_5', category: 'bomb', tier: 5, name: 'Karadelik Çöküşü', desc: '1,800 bomba asteroit patlat', icon: 'crown', stat: 'bombAsteroidsDestroyed', target: 1800, reward: 350 }
    ];
    const trophyLadders = {
      kill: [15, 80, 250, 800, 2000],
      asteroid: [40, 160, 500, 1200, 3000],
      boss: [1, 4, 10, 22, 45],
      combo: [12, 25, 40, 60, 80],
      survive: [45, 90, 150, 210, 300],
      crystal: [200, 800, 2500, 8000, 20000],
      graze: [20, 60, 150, 400, 900],
      flight: [3, 10, 25, 50, 100],
      chest: [1, 4, 10, 20, 40],
      bomb: [5, 15, 40, 90, 180]
    };
    for (const def of this.trophyDefs) {
      const ladder = trophyLadders[def.category];
      if (ladder) def.target = ladder[(def.tier || 1) - 1];
      if (def.tier === 4) def.reward = Math.max(40, Math.round(def.reward * 0.7));
      if (def.tier === 5) def.reward = Math.max(60, Math.round(def.reward * 0.55));
    }
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
        stats: { dmg: 90, shield: 90, speed: 130, magnet: 160 },
        dmgMult: 0.9, shieldMult: 0.9, speedMult: 1.3, magnetMult: 1.6,
        perkTitle: 'ZÜMRÜT SÜZÜLME',
        perk: '+%60 kristal çekim menzili ve arkasında yakıcı asit közleri saçar.'
      },
      phantom: {
        id: 'phantom',
        name: 'HAYALET PLAZMA',
        title: 'Kuantum Savunma Jeti',
        primary: '#e0f7fa', secondary: '#00e5ff', cockpit: '#80deea', flame: '#00e5ff',
        cost: 7500,
        stats: { dmg: 110, shield: 160, speed: 105, magnet: 95 },
        dmgMult: 1.1, shieldMult: 1.6, speedMult: 1.05, magnetMult: 0.95,
        perkTitle: 'FAZ KALKANI',
        perk: 'Darbe aldığında 1.25 sn kuantum fazına geçerek hasarsızlık kazanır.'
      },
      vortex: {
        id: 'vortex',
        name: 'VORTEX NEBULA',
        title: 'Kozmik Girdap Avcısı',
        primary: '#bf5af2', secondary: '#38bdf8', cockpit: '#f0abfc', flame: '#c084fc',
        cost: 5200,
        stats: { dmg: 120, shield: 110, speed: 110, magnet: 125 },
        dmgMult: 1.2, shieldMult: 1.1, speedMult: 1.1, magnetMult: 1.25,
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
    if (this.activeArchetype === 'blaze') {
      this.activeArchetype = 'interceptor';
      localStorage.setItem('neon_flight_archetype', 'interceptor');
    }
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
      }
    };
    this.unlockedPilots = (JSON.parse(localStorage.getItem('neon_unlocked_pilots') || '["interceptor"]')).filter(p => p !== 'blaze');
    if (!this.unlockedPilots.includes(this.activeArchetype)) {
      this.unlockedPilots.push(this.activeArchetype);
      localStorage.setItem('neon_unlocked_pilots', JSON.stringify(this.unlockedPilots));
    }
    this.isOverloadProtocol = localStorage.getItem('neon_overload_protocol') === 'true';

    // Kalıcı Hangar Dronları Sistemi
    this.hangarDrones = {
      striker: {
        id: 'striker',
        name: 'VURUCU DRONE',
        desc: 'En yakın düşmana kesintisiz lazer ateşi açar',
        cost: 800,
        unlocked: false,
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
      },
      twin: {
        id: 'twin',
        name: 'İKİZ VURUCU',
        desc: 'Vurucu dronla aynı lazer. Yalnızca 3 reklamla açılır.',
        cost: 0,
        adsRequired: 3,
        unlocked: false,
        baseDmg: 8,
        color: '#00f0ff',
        type: 'laser'
      }
    };
    this.droneLevels = JSON.parse(localStorage.getItem('neon_drone_levels') || '{"striker":0,"missile":0,"medic":0,"tesla":0,"clone":0}');
    this.equippedDroneId = localStorage.getItem('neon_equipped_drone') || null;
    if (this.equippedDroneId === 'striker' && (!this.droneLevels.striker || !localStorage.getItem('neon_drone_striker_bought'))) {
      this.equippedDroneId = null;
      if (this.droneLevels.striker) this.droneLevels.striker = 0;
      localStorage.setItem('neon_drone_levels', JSON.stringify(this.droneLevels));
      localStorage.removeItem('neon_equipped_drone');
    }

    // Kozmetik Motor İzleri Koleksiyonu (Engine Trails)
    this.trails = {
      default: { id: 'default', name: 'Standart İyon', cost: 0, unlocked: true, color: '#00f0ff', type: 'ion', desc: 'Standart neon iyon itki hattı' },
      flame: { id: 'flame', name: 'Kızıl Alev', cost: 800, unlocked: false, color: '#ff3d00', type: 'fire', desc: 'Akkor sıcak plazma kıvılcımları saçar' },
      electric: { id: 'electric', name: 'Yıldırım Arkı', cost: 1300, unlocked: false, color: '#bf5af2', type: 'spark', desc: 'Arkasında mor elektro arklar bırakır' },
      toxic: { id: 'toxic', name: 'Zehir Közü', cost: 1800, unlocked: false, color: '#05ffa1', type: 'acid', desc: 'Neon zümrüt asit közleri saçar' },
      rainbow: { id: 'rainbow', name: 'Gökkuşağı Neon', cost: 2400, unlocked: false, color: '#ffd700', type: 'rainbow', desc: 'Sürekli renk değiştiren prizmatik iz' },
      supernova: { id: 'supernova', name: 'Süpernova Tacı', cost: 3200, unlocked: false, color: '#ffbe0b', type: 'fire', desc: 'Akkor altın dev yıldız parlaması saçar' },
      void: { id: 'void', name: 'Hiper Uzay', cost: 4200, unlocked: false, color: '#38bdf8', type: 'spark', desc: 'Işık hızında takyon siber izleri bırakır' },
      spark: { id: 'spark', name: 'Kızıl Kıvılcım', cost: 0, adsRequired: 3, unlocked: false, color: '#ff3d00', type: 'fire', desc: 'Kızıl alevle aynı akkor iz. 3 reklamla açılır.' }
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
    this.updateTrophiesBadge();
    this.updatePilotRankDisplay();
    this.updateMenuShipPreview();
    this.runInMemory = false;
    this.runSkinId = null;
    this.pendingResume = null;
    this.refreshContinueButton();
    this.checkDailyReward();
    this.updateHighScoreDisplay();
    this.updateLevelDisplay();
    this.checkFirstTimeWelcome();
  }

  checkFirstTimeWelcome() {
    if (localStorage.getItem('neon_welcome_claimed') === 'true') return;
    const modal = document.getElementById('welcome-pilot-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    const startBtn = document.getElementById('btn-start-ftue');
    if (startBtn) {
      startBtn.onclick = () => {
        sounds.init();
        sounds.playPowerup();
        vibrate.success();
        modal.classList.add('hidden');
        localStorage.setItem('neon_welcome_claimed', 'true');
        this.totalCrystals = (this.totalCrystals || 0) + 500;
        localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
        this.updateCrystalsDisplay();
        this.showToast('+500 Kristal Hesabına Eklendi!', '#00f0ff');
        this.pendingResume = null;
        this.runInMemory = false;
        this.clearSuspendedRun();
        this.triggerLaunch();
      };
    }
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
    this.activeTouchId = null;
    let lastX = 0;
    let lastY = 0;
    let lastTapTime = 0;
    let lastTapX = 0;
    let lastTapY = 0;

    const isHudButtonTarget = (target) => {
      if (!target || !target.closest) return false;
      return Boolean(target.closest('#btn-ultimate, #btn-ability, #btn-pilot-skill, #btn-pause, .hud-action-btn'));
    };

    const handleDragStart = (pointerId, clientX, clientY, target = null) => {
      if (isHudButtonTarget(target)) return;
      sounds.init();
      if (this.state !== 'PLAYING') return;

      // Çift Dokunma ile Ani Kaçış Atılımı (Double-Tap Dash)
      const now = Date.now();
      if (now - lastTapTime < 280 && Math.hypot(clientX - lastTapX, clientY - lastTapY) < 45) {
        if (this.triggerDash) {
          this.triggerDash();
        }
        lastTapTime = 0;
      } else {
        lastTapTime = now;
        lastTapX = clientX;
        lastTapY = clientY;
      }

      if (isDragging && activePointerId !== null) return;
      isDragging = true;
      activePointerId = pointerId;
      this.activeTouchId = pointerId;
      lastX = clientX;
      lastY = clientY;

      // Parmak görüş açısı: Dokunma anında gemiyi parmağın 42px yukarısında konumlandırarak parmağın gemiyi ve mermileri kapatmasını önle
      if (this.player) {
        const scaleX = this.width / (window.innerWidth || this.width);
        const scaleY = this.height / (window.innerHeight || this.height);
        const touchCanvasX = clientX * scaleX;
        const touchCanvasY = clientY * scaleY;
        const distToShip = Math.hypot(touchCanvasX - this.player.x, touchCanvasY - this.player.y);
        if (distToShip < 75) {
          this.player.targetY = Math.max(50, Math.min(this.height - 72, touchCanvasY - 42));
        }
      }
    };

    const handleDragMove = (pointerId, clientX, clientY) => {
      if (!isDragging || this.state !== 'PLAYING') return;
      if (activePointerId !== null && pointerId !== activePointerId) return;

      const scaleX = this.width / (window.innerWidth || this.width);
      const scaleY = this.height / (window.innerHeight || this.height);
      const slowRatio = (this.player.cryoSlowTimer > 0) ? 0.65 : 1.0;
      const deltaX = (clientX - lastX) * scaleX * slowRatio;
      const deltaY = (clientY - lastY) * scaleY * slowRatio;
      lastX = clientX;
      lastY = clientY;

      // Parmak görüşünü kapatmama koruması: gemi alt sınıra 72px kala durur, başparmak gemiyi kapatmaz
      this.player.targetX = Math.max(24, Math.min(this.width - 24, this.player.targetX + deltaX));
      this.player.targetY = Math.max(50, Math.min(this.height - 72, this.player.targetY + deltaY));
      if (this.dismissTutorial) this.dismissTutorial();
    };

    const handleDragEnd = (pointerId) => {
      if (activePointerId === null || pointerId === activePointerId) {
        isDragging = false;
        activePointerId = null;
        this.activeTouchId = null;
      }
    };

    this.cancelDrag = () => {
      isDragging = false;
      activePointerId = null;
      this.activeTouchId = null;
    };

    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return; // Touch events handled explicitly via activeTouchId below
      handleDragStart(e.pointerId, e.clientX, e.clientY, e.target);
    });

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      handleDragMove(e.pointerId, e.clientX, e.clientY);
    });

    window.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') return;
      handleDragEnd(e.pointerId);
    });

    window.addEventListener('pointercancel', (e) => {
      if (e.pointerType === 'touch') return;
      handleDragEnd(e.pointerId);
    });

    // Mobil çoklu dokunuş (Multi-Touch) yönetimi: Sadece ilk hareket parmağını (activeTouchId) takip et
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!e.changedTouches) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (isHudButtonTarget(t.target)) continue;
        if (this.activeTouchId === null) {
          handleDragStart(t.identifier, t.clientX, t.clientY, t.target);
          break;
        }
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!e.changedTouches) return;
      if (this.activeTouchId === null && this.state === 'PLAYING' && e.changedTouches.length > 0) {
        const firstTouch = e.changedTouches[0];
        if (!isHudButtonTarget(firstTouch.target)) {
          handleDragStart(firstTouch.identifier, firstTouch.clientX, firstTouch.clientY, firstTouch.target);
        }
      }
      if (this.activeTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === this.activeTouchId) {
          handleDragMove(t.identifier, t.clientX, t.clientY);
          break;
        }
      }
    }, { passive: false });

    const onTouchEndOrCancel = (e) => {
      if (this.activeTouchId === null || !e.changedTouches) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === this.activeTouchId) {
          handleDragEnd(t.identifier);
          break;
        }
      }
    };
    canvas.addEventListener('touchend', onTouchEndOrCancel, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEndOrCancel, { passive: false });

    // Telefon kilitlendiğinde veya arka plana geçtiğinde oyunu ve sesi otomatik duraklat
    const handleAppBackground = () => {
      if (sounds.pauseAudio) sounds.pauseAudio();
      else sounds.stopBGM();
      if (this.cancelDrag) this.cancelDrag();
      if (this.modalTransition && this.state === 'PLAYING') {
        const pendingType = this.modalTransition.type;
        this.modalTransition = null;
        this.completeModalTransition(pendingType);
        return;
      }
      if (this.state === 'PLAYING') {
        this.pauseGame();
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        handleAppBackground();
      } else {
        if (this.state === 'PLAYING' || this.state === 'MERCHANT' || this.state === 'LEVEL_UP' || this.state === 'LUCKY_CHEST') {
          if (sounds.resumeAudio) sounds.resumeAudio();
          sounds.startBGM();
        }
      }
    });

    window.addEventListener('blur', () => {
      handleAppBackground();
    });

    window.addEventListener('pagehide', () => {
      this.writeSuspendSnapshot();
    });

    if (window.Capacitor?.Plugins?.App) {
      try {
        window.Capacitor.Plugins.App.addListener('appStateChange', (state) => {
          if (!state.isActive) {
            handleAppBackground();
          } else {
            if (this.state === 'PLAYING' || this.state === 'MERCHANT' || this.state === 'LEVEL_UP' || this.state === 'LUCKY_CHEST') {
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
      const splashEl = document.getElementById('splash-screen');
      if (splashEl && !splashEl.classList.contains('hidden')) {
        if (e && e.preventDefault) e.preventDefault();
        if (window.dismissSplashScreen) window.dismissSplashScreen();
        return;
      }

      if (this.modalTransition) {
        if (e && e.preventDefault) e.preventDefault();
        return;
      }

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

      if (saveCodeModal && !saveCodeModal.classList.contains('hidden')) {
        if (e && e.preventDefault) e.preventDefault();
        saveCodeModal.classList.add('hidden');
        return;
      }

      if (privacyModal && !privacyModal.classList.contains('hidden')) {
        if (e && e.preventDefault) e.preventDefault();
        privacyModal.classList.add('hidden');
        return;
      }

      if (settingsModal && !settingsModal.classList.contains('hidden')) {
        if (e && e.preventDefault) e.preventDefault();
        settingsModal.classList.add('hidden');
        if (pauseModal) pauseModal.style.pointerEvents = '';
        return;
      }

      if (luckyChestModal && !luckyChestModal.classList.contains('hidden')) {
        if (e && e.preventDefault) e.preventDefault();
        if (performance.now() < (this.modalInputLockUntil || 0)) {
          try { history.pushState({ modal: 'lucky_chest' }, ''); } catch (err) {}
          return;
        }
        this.claimLuckyChest(true);
        return;
      }

      if (this.state === 'LEVEL_UP' || this.state === 'ROUTE_SELECT') {
        if (e && e.preventDefault) e.preventDefault();
        return;
      }

      if ((merchantModal && !merchantModal.classList.contains('hidden')) || this.state === 'MERCHANT' || this.isMerchantActive) {
        if (e && e.preventDefault) e.preventDefault();
        if (performance.now() < (this.modalInputLockUntil || 0)) {
          try { history.pushState({ modal: 'merchant' }, ''); } catch (err) {}
          return;
        }
        this.closeMerchant(true);
        return;
      }

      const openModals = [
        dailyRewardModal,
        missionsModal,
        statsModal,
        hangarModal,
        levelSelectModal,
        luckyWheelModal,
        leaderboardModal,
        pauseModal
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
        this.maybeOfferMenuInterstitial();
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

      if (this.state === 'PLAYING' || this.state === 'MERCHANT') {
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
        this.pendingResume = null;
        this.runInMemory = false;
        this.clearSuspendedRun();
        this.triggerLaunch();
      });
    }

    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        sounds.init();
        this.continueSuspendedRun();
      });
    }

    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        sounds.init();
        this.triggerLaunch();
      });
    }

    const btnShareScore = document.getElementById('btn-share-score');
    if (btnShareScore) {
      btnShareScore.addEventListener('click', async () => {
        sounds.init();
        const score = this.player.score || 0;
        const modeName = this.currentMode === 'storm' ? t('mode_storm_title') : `${t('lb_stage')} ${this.selectedLevel}`;
        const shareText = t('share_line', { score: score.toLocaleString(), mode: modeName });
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Neon Space Survivor Rekoru',
              text: shareText
            });
            return;
          } catch (e) {}
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(shareText);
            this.showToast(t('share_copied'), '#ffd700');
            return;
          } catch (e) {}
        }
        this.showToast('[SKOR] ' + score.toLocaleString(), '#ffd700');
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
          this.showToast('[CANLANMA] Depodaki Canlanma Hakkı Kullanıldı!', '#05ffa1');
        } else if (window.showRewardedAd) {
          window.showRewardedAd(() => {
            this.runSawRewardedAd = true;
            this.executeRevive();
          }, (err) => {
            console.error('Reklam yüklenemedi:', err);
            noteAdMiss(this, err);
          }, window.ADMOB_CONFIG ? window.ADMOB_CONFIG.reviveAdUnitId : null);
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

    if (btnMenuShipAction) {
      btnMenuShipAction.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleMenuShipAction();
      });
    }

    if (menuShipStatus) {
      menuShipStatus.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleMenuShipAction();
      });
    }

    let crystalTapCount = 0;
    let crystalTapTimer = null;
    if (btnMenuCrystals) {
      btnMenuCrystals.addEventListener('click', () => {
        crystalTapCount++;
        clearTimeout(crystalTapTimer);
        crystalTapTimer = setTimeout(() => { crystalTapCount = 0; }, 1800);

        if (crystalTapCount >= 5) {
          crystalTapCount = 0;
          this.toggleDevMode();
          return;
        }

        sounds.init();
        sounds.playCardSelect();
        this.openHangar();
        this.switchHangarTab('tech');
      });
    }

    // Şans Çarkı Butonları
    const btnLuckyWheel = document.getElementById('btn-lucky-wheel');
    if (btnLuckyWheel) {
      btnLuckyWheel.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        vibrate.light();
        this.openLuckyWheel();
      });
    }

    const btnCloseWheel = document.getElementById('btn-close-wheel');
    if (btnCloseWheel) {
      btnCloseWheel.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        vibrate.light();
        this.closeLuckyWheelWithAnimation();
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
        if (this.getCurrentMenuTabIndex() === 3) {
          this.goToMenuTab(2);
        } else {
          this.goToMenuTab(3);
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
        this.goToMenuTab(2);
      });
    }

    // Global Lider Tablosu Butonları
    const btnLeaderboard = document.getElementById('btn-leaderboard');
    if (btnLeaderboard) {
      btnLeaderboard.addEventListener('click', () => {
        if (this.getCurrentMenuTabIndex() === 4) {
          this.goToMenuTab(2);
        } else {
          this.goToMenuTab(4);
        }
      });
    }

    const btnCloseLeaderboard = document.getElementById('btn-close-leaderboard');
    if (btnCloseLeaderboard) {
      btnCloseLeaderboard.addEventListener('click', () => {
        this.goToMenuTab(2);
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
        this.state = 'MENU';
        this.maybeOfferMenuInterstitial();
        this.openHangar();
        this.switchHangarTab('tech');
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
        this.maybeOfferMenuInterstitial();
      });
    }

    if (btnClaimChest) {
      btnClaimChest.addEventListener('click', () => {
        sounds.init();
        this.claimLuckyChest(false);
      });
    }

    const btnAdChestAll = document.getElementById('btn-ad-chest-all');
    if (btnAdChestAll) {
      btnAdChestAll.addEventListener('click', () => {
        sounds.init();
        this.watchAdForChestAll();
      });
    }

    // Mod Seçim Butonları (BÖLÜMLER tek tıkla hem modu seçer hem bölüm seçim ekranını açar)
    if (modeClassic) {
      modeClassic.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        this.setMode('classic');
        this.openLevelSelect();
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
        this.switchHangarTab('tech');
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
      sounds.init();
      sounds.stepLevel(-1);
      this.updateAudioButtons();
      if (this.updateSettingsToggles) this.updateSettingsToggles();
    };
    if (btnSoundToggle) btnSoundToggle.addEventListener('click', handleSoundToggle);
    if (btnSoundMenu) btnSoundMenu.addEventListener('click', handleSoundToggle);

    const handleVibrateToggle = (e) => {
      e.stopPropagation();
      vibrate.stepLevel(-1);
      this.updateAudioButtons();
      if (this.updateSettingsToggles) this.updateSettingsToggles();
      vibrate.light();
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

    // Aktif Nihai Güç (Ultimate) Buton Dinleyicisi (Tekil ve anında tetikleme)
    if (btnUltimate) {
      const handleUlt = (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        this.triggerUltimate();
      };
      btnUltimate.addEventListener('pointerdown', handleUlt);
    }

    // Aktif Pilot Yeteneği Buton Dinleyicisi (Tekil ve anında tetikleme)
    if (btnAbility) {
      const handleAbi = (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        this.triggerPilotAbility();
      };
      btnAbility.addEventListener('pointerdown', handleAbi);
    }


    if (btnMerchantClose) {
      btnMerchantClose.addEventListener('click', () => {
        this.closeMerchant();
      });
    }

    if (btnPauseSound) {
      btnPauseSound.addEventListener('click', () => {
        sounds.init();
        sounds.stepLevel(-1);
        this.updatePauseAudioButtons();
      });
    }

    const btnPauseBgm = document.getElementById('btn-pause-bgm');
    if (btnPauseBgm) {
      btnPauseBgm.addEventListener('click', () => {
        sounds.toggleBGM();
        this.updatePauseAudioButtons();
        if (vibrate.enabled) vibrate.light();
      });
    }

    const btnPauseVibrate = document.getElementById('btn-pause-vibrate');
    if (btnPauseVibrate) {
      btnPauseVibrate.addEventListener('click', () => {
        vibrate.stepLevel(-1);
        this.updatePauseAudioButtons();
        vibrate.light();
      });
    }

    if (btnQuitMenu) {
      btnQuitMenu.addEventListener('click', () => {
        if (this.isTestFlight) {
          this.endShipTestFlight();
          return;
        }
        if (pauseModal) pauseModal.classList.add('hidden');
        if (luckyChestModal) luckyChestModal.classList.add('hidden');
        if (merchantModal) merchantModal.classList.add('hidden');
        if (ultimateBtnContainer) ultimateBtnContainer.classList.add('hidden');
        if (missionsModal) missionsModal.classList.add('hidden');
        if (statsModal) statsModal.classList.add('hidden');
        if (eventBanner) eventBanner.classList.add('hidden');
        this.writeSuspendSnapshot();
        this.isMerchantActive = false;
        this.modalTransition = null;
        this.resumeRampTimer = 0;
        this.prevStateBeforePause = null;
        sounds.setBossEnraged(false);
        sounds.setBossMode(false);
        sounds.stopBGM();
        this.state = 'MENU';
        hud.classList.add('hidden');
        startScreen.classList.remove('hidden');
        const equippedSkin = localStorage.getItem('neon_equipped_skin');
        if (this.runSkinId && equippedSkin && this.skins[equippedSkin]) {
          this.currentSkinId = equippedSkin;
          const idx = this.skinOrder.indexOf(equippedSkin);
          if (idx >= 0) this.menuSkinIndex = idx;
          this.updateMenuShipPreview();
        }
        this.updateCrystalsDisplay();
        this.updateHighScoreDisplay();
        this.checkMissionsBadge();
      });
    }

    // Hangar Butonları
    if (btnHangar) {
      btnHangar.addEventListener('click', () => {
        if (this.getCurrentMenuTabIndex() === 0) {
          this.goToMenuTab(2);
        } else {
          this.goToMenuTab(0);
        }
      });
    }

    // Orta Menü Butonu (Hub / Ana Savaş Ekranı)
    const btnMenu = document.getElementById('btn-menu');
    if (btnMenu) {
      btnMenu.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        vibrate.light();
        this.goToMenuTab(2);
      });
    }

    const handleCloseHangar = (e) => {
      if (e) {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
      }
      sounds.init();
      sounds.playCardSelect();
      vibrate.light();
      this.closeHangar();
    };

    if (btnHangarClose) {
      btnHangarClose.addEventListener('click', handleCloseHangar);
      btnHangarClose.addEventListener('touchend', handleCloseHangar, { passive: false });
    }

    const btnHangarCloseX = document.getElementById('btn-hangar-close-x');
    if (btnHangarCloseX) {
      btnHangarCloseX.addEventListener('click', handleCloseHangar);
      btnHangarCloseX.addEventListener('touchend', handleCloseHangar, { passive: false });
    }

    if (hangarModal) {
      hangarModal.addEventListener('click', (e) => {
        if (e.target === hangarModal) {
          handleCloseHangar(e);
        }
      });
    }

    // Hangar Sekmeleri Dinleyicileri (Pürüzsüz Tek Dokunuş, Yatay Kaydırma ve Çift Tetikleme Korumalı)
    const bindHangarTabBtn = (btn, tabKey) => {
      if (!btn) return;
      let startX = 0;
      let startY = 0;
      let isMoved = false;
      let lastActivateTime = 0;

      const activateTab = (e) => {
        const now = Date.now();
        if (now - lastActivateTime < 250) return;
        lastActivateTime = now;
        sounds.init();
        sounds.playCardSelect();
        vibrate.light();
        this.switchHangarTab(tabKey);
      };

      btn.addEventListener('touchstart', (e) => {
        isMoved = false;
        if (e.touches && e.touches[0]) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        }
      }, { passive: true });

      btn.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          const dx = Math.abs(e.touches[0].clientX - startX);
          const dy = Math.abs(e.touches[0].clientY - startY);
          if (dx > 10 || dy > 10) {
            isMoved = true;
          }
        }
      }, { passive: true });

      btn.addEventListener('touchend', (e) => {
        if (!isMoved) {
          if (e && e.cancelable) e.preventDefault();
          activateTab(e);
        }
      }, { passive: false });

      btn.addEventListener('click', (e) => {
        if (!isMoved) {
          activateTab(e);
        }
      });
    };

    bindHangarTabBtn(tabBtnSkins, 'skins');
    bindHangarTabBtn(tabBtnTrails, 'trails');
    bindHangarTabBtn(tabBtnDrones, 'drones');
    bindHangarTabBtn(tabBtnBoosters, 'boosters');
    bindHangarTabBtn(tabBtnTech, 'tech');
    bindHangarTabBtn(tabBtnTrophies, 'trophies');

    if (btnResetTech) {
      btnResetTech.addEventListener('click', () => {
        sounds.init();
        this.resetTechUpgrades();
      });
    }

    // Görevler Butonları
    if (btnMissions) {
      btnMissions.addEventListener('click', () => {
        if (this.getCurrentMenuTabIndex() === 1) {
          this.goToMenuTab(2);
        } else {
          this.goToMenuTab(1);
        }
      });
    }

    if (btnMissionsClose) {
      btnMissionsClose.addEventListener('click', () => {
        this.goToMenuTab(2);
      });
    }

    // İstatistik Butonları
    if (btnStats) {
      btnStats.addEventListener('click', () => {
        this.openStats();
      });
    }

    if (btnStatsClose) {
      btnStatsClose.addEventListener('click', () => {
        this.goToMenuTab(2);
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
          pilotActionRow.innerHTML = `<span style="color:#05ffa1; font-weight:800; font-size:0.8rem; letter-spacing:0.5px;">[${t('pilot_active_badge')}]</span>`;
        } else {
          pilotActionRow.innerHTML = `<button id="btn-unlock-pilot" class="neon-btn pulse" style="background: linear-gradient(135deg, #ffd700, #ff5500); color: #030816; font-weight: 900; padding: 6px 16px; font-size: 0.85rem; border: none; cursor: pointer; border-radius: 8px;">${t('pilot_unlock_cost', { c: p.cost })}</button>`;
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
                this.showToast(t('toast_pilot_unlocked', { name: p.name }), '#00f0ff');
                this.updateCrystalsDisplay();
                updatePilotUI();
              } else {
                this.showToast(t('toast_need_cr', { n: p.cost }), '#ff0055');
                vibrate.medium();
              }
            });
          }
        }
      }
    };

    archetypeBtns.forEach(btn => {
      const selectArchetype = () => {
        sounds.init();
        sounds.playCardSelect();
        vibrate.light();
        const targetArch = btn.dataset.archetype;
        const isUnlocked = this.unlockedPilots.includes(targetArch);
        this.activeArchetype = targetArch;
        const p = this.pilots[targetArch] || this.pilots.interceptor;
        if (isUnlocked) {
          localStorage.setItem('neon_flight_archetype', this.activeArchetype);
          this.showToast(t('toast_pilot_assigned', { name: p.name }), p.color || '#00f0ff');
        } else {
          this.showToast(t('toast_pilot_locked', { name: p.name, c: p.cost }), '#ffd700');
        }
        updatePilotUI();
      };

      btn.addEventListener('touchend', (e) => {
        if (e && e.cancelable) e.preventDefault();
        selectArchetype();
      }, { passive: false });

      btn.addEventListener('click', (e) => {
        selectArchetype();
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
        if (performance.now() < (this.modalInputLockUntil || 0)) return;
        if (this.state !== 'LEVEL_UP') return;
        if (this.player.rerollCount > 0) {
          this.player.rerollCount--;
          sounds.playCardSelect();
          vibrate.medium();
          this.triggerLevelUp(true);
        }
      });
    }

    this.setupMenuSwipeNavigation();
    this.setupHangarSwipeNavigation();
    this.initLuckyWheel();
    this.initLeaderboard();
    this.applyMenuProgression();

    // FTUE Hoş Geldin Kontrolü & İlk Uçuş Deneyimi
    const isFtueDone = !!localStorage.getItem('neon_ftue_welcomed');
    const gamesPlayed = parseInt(localStorage.getItem('neon_games_played') || '0', 10);
    const hasScore = parseInt(localStorage.getItem('neon_high_score_storm') || '0', 10) > 0
                  || parseInt(localStorage.getItem('neon_high_score_classic') || '0', 10) > 0;

    if (!isFtueDone && gamesPlayed === 0 && !hasScore) {
      setTimeout(() => {
        if (this.state === 'MENU') {
          this.showFTUEWelcome();
        }
      }, 350);
    } else {
      // Oyun başı menüde Kozmik Şans Çarkı doğrudan açılsın
      const wheelState = this.getWheelState();
      if (wheelState && wheelState.spinsUsed === 0) {
        setTimeout(() => {
          if (this.state === 'MENU') {
            this.openLuckyWheel();
          }
        }, 500);
      }
    }
  }

  showFTUEWelcome() {
    const ftueModal = document.getElementById('ftue-welcome-modal');
    const btnStart = document.getElementById('btn-ftue-start');
    if (!ftueModal) return;

    // 500 Hoş Geldin Kristali ver ve kaydet
    this.totalCrystals = (this.totalCrystals || 0) + 500;
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    this.updateCrystalsDisplay();
    localStorage.setItem('neon_ftue_welcomed', 'true');

    ftueModal.classList.remove('hidden');

    if (btnStart) {
      btnStart.onclick = () => {
        sounds.init();
        sounds.playCardSelect();
        vibrate.light();
        ftueModal.classList.add('hidden');
        this.currentMode = 'storm';
        this.triggerLaunch();
      };
    }
  }

  updateDockActiveTab(activeTab) {
    const dockMap = [
      { id: 'btn-hangar', tab: 0 },
      { id: 'btn-missions', tab: 1 },
      { id: 'btn-menu', tab: 2 },
      { id: 'btn-daily-reward', tab: 3 },
      { id: 'btn-leaderboard', tab: 4 }
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
    if (missionsModal && !missionsModal.classList.contains('hidden')) return 1;
    if (dailyRewardModal && !dailyRewardModal.classList.contains('hidden')) return 3;
    const lbModal = document.getElementById('leaderboard-modal');
    if (lbModal && !lbModal.classList.contains('hidden')) return 4;
    return 2; // Ana Hub (MENÜ)
  }

  goToMenuTab(targetIndex, direction = 'none') {
    if (this.state !== 'MENU') return;
    const index = Math.max(0, Math.min(4, targetIndex));
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
      this.openMissions();
    } else if (index === 2) {
      if (startScreen) startScreen.classList.remove('hidden');
      this.updateMenuShipPreview();
    } else if (index === 3) {
      this.openDailyRewardModal();
    } else if (index === 4) {
      this.openLeaderboard();
    }

    // Yumuşak geçiş animasyonu (Clash Royale stili kayma)
    const activeModal = [hangarModal, missionsModal, null, dailyRewardModal, lbModal][index];
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
      if (target && target.closest && (target.closest('.hangar-card') || target.closest('#hangar-modal') || target.closest('.hangar-tabs'))) {
        return; // Hangar içi kaydırmalarda menü sekmesi değiştirilmez!
      }

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
      // 0: Hangar <-> 1: Görevler <-> 2: MENÜ <-> 3: İkmal <-> 4: Liderler
      const currentTab = this.getCurrentMenuTabIndex();

      if (deltaX < -45) {
        // Parmağı sola kaydır -> Sonraki sekmeye geç (sağa doğru)
        if (currentTab < 4) {
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

  setupHangarSwipeNavigation() {
    const hangarModalElem = document.getElementById('hangar-modal');
    if (!hangarModalElem) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwiping = false;

    const HANGAR_TAB_KEYS = ['skins', 'trails', 'drones', 'boosters', 'tech', 'trophies'];

    const handleTouchStart = (e) => {
      if (hangarModalElem.classList.contains('hidden')) return;
      if (!e.touches || e.touches.length !== 1) return;

      const target = e.target;
      // Tab butonları çubuğu üzerinde parmak kaydırılırken buton şeridi kaysın, tüm sekme değişmesin
      if (target && target.closest && target.closest('.hangar-tabs')) {
        isSwiping = false;
        return;
      }

      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
      isSwiping = true;
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping || hangarModalElem.classList.contains('hidden')) return;
      isSwiping = false;
      if (!e.changedTouches || e.changedTouches.length !== 1) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const deltaTime = Date.now() - touchStartTime;

      if (deltaTime > 650) return;
      if (Math.abs(deltaX) < 45) return;
      // Dikey kaydırmayı (rozetler, atölye ağacı vs.) bozmamak için yatay hareket dikeyden belirgin olmalı
      if (Math.abs(deltaX) < Math.abs(deltaY) * 1.3) return;

      const currentIdx = HANGAR_TAB_KEYS.indexOf(this.activeHangarTab || 'skins');
      if (currentIdx === -1) return;

      if (deltaX < -45) {
        // Parmağı sola kaydır -> Sonraki sekmeye geç (örn: MÜHİMMAT -> ATÖLYE)
        if (currentIdx < HANGAR_TAB_KEYS.length - 1) {
          const nextTab = HANGAR_TAB_KEYS[currentIdx + 1];
          sounds.init();
          sounds.playCardSelect();
          vibrate.light();
          this.switchHangarTab(nextTab);
        }
      } else if (deltaX > 45) {
        // Parmağı sağa kaydır -> Önceki sekmeye geç (örn: ATÖLYE -> MÜHİMMAT)
        if (currentIdx > 0) {
          const prevTab = HANGAR_TAB_KEYS[currentIdx - 1];
          sounds.init();
          sounds.playCardSelect();
          vibrate.light();
          this.switchHangarTab(prevTab);
        }
      }
    };

    hangarModalElem.addEventListener('touchstart', handleTouchStart, { passive: true });
    hangarModalElem.addEventListener('touchend', handleTouchEnd, { passive: true });
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
    if (this.modalTransition && this.state === 'PLAYING') {
      const pendingType = this.modalTransition.type;
      this.modalTransition = null;
      this.completeModalTransition(pendingType);
      return;
    }
    if (this.state !== 'PLAYING') return;
    this.prevStateBeforePause = this.state;
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
      stageEl.textContent = this.currentMode === 'classic' ? t('pause_stage_campaign', { n: this.selectedLevel || 1 }) : t('pause_stage_storm');
    }
    if (waveEl) {
      waveEl.textContent = t('pause_wave_n', { n: this.wave || 1 });
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
    this.writeSuspendSnapshot();
  }

  writeSuspendSnapshot() {
    if (this.isTestFlight || !this.player || this.player.hp <= 0) return;
    const liveStates = ['PLAYING', 'PAUSED', 'LEVEL_UP', 'MERCHANT', 'LUCKY_CHEST', 'ROUTE_SELECT'];
    if (!liveStates.includes(this.state) && !this.runInMemory) return;
    const snap = {
      mode: this.currentMode,
      selectedLevel: this.selectedLevel,
      wave: this.wave,
      gameTime: this.gameTime,
      sector: this.currentSectorId,
      skin: this.runSkinId || this.currentSkinId,
      archetype: this.activeArchetype,
      score: this.player.score,
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      shield: this.player.shield,
      maxShield: this.player.maxShield,
      level: this.player.level,
      xp: this.player.xp,
      nextXp: this.player.nextXp,
      feverCharge: this.player.feverCharge || 0,
      upgrades: this.player.upgrades,
      evolutions: this.player.evolutions,
      crystalsEarned: this.crystalsEarnedThisRun || 0
    };
    try { localStorage.setItem('neon_suspended_run', JSON.stringify(snap)); } catch (e) {}
    this.runInMemory = true;
    this.refreshContinueButton();
  }

  clearSuspendedRun() {
    this.runInMemory = false;
    this.runSkinId = null;
    this.pendingResume = null;
    try { localStorage.removeItem('neon_suspended_run'); } catch (e) {}
    this.refreshContinueButton();
  }

  refreshContinueButton() {
    if (!btnContinue) return;
    let saved = false;
    try { saved = !!localStorage.getItem('neon_suspended_run'); } catch (e) {}
    const show = (this.runInMemory && this.player && this.player.hp > 0) || saved;
    btnContinue.classList.toggle('hidden', !show);
  }

  continueSuspendedRun() {
    const lockedSkin = this.runSkinId;
    if (lockedSkin && this.skins[lockedSkin]) {
      this.currentSkinId = lockedSkin;
      if (this.player) this.player.skinCfg = this.skins[lockedSkin];
    }
    if (this.runInMemory && this.player && this.player.hp > 0 && this.state === 'MENU') {
      if (pauseModal) pauseModal.classList.add('hidden');
      if (startScreen) startScreen.classList.add('hidden');
      if (hud) hud.classList.remove('hidden');
      this.state = 'PLAYING';
      this.lastTime = performance.now();
      this.requestWakeLock();
      if (sounds.resumeAudio) sounds.resumeAudio();
      sounds.startBGM();
      return;
    }
    let snap = null;
    try { snap = JSON.parse(localStorage.getItem('neon_suspended_run') || 'null'); } catch (e) {}
    if (!snap || !(snap.hp > 0)) {
      this.clearSuspendedRun();
      return;
    }
    this.pendingResume = snap;
    if (snap.mode) this.currentMode = snap.mode;
    if (snap.selectedLevel) this.selectedLevel = snap.selectedLevel;
    if (snap.skin && this.skins[snap.skin]) this.currentSkinId = snap.skin;
    if (snap.archetype) this.activeArchetype = snap.archetype;
    this.triggerLaunch();
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
      pauseQuestTitle.textContent = t('pause_quest_wait');
      pauseQuestBarFill.style.width = '0%';
      pauseQuestReward.textContent = '--';
    }
  }

  paintVolumeSteps(hostId, level, onPick) {
    const host = document.getElementById(hostId);
    if (!host) return;
    host.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'vol-step' + (i <= level ? ' on' : '');
      b.textContent = String(i);
      b.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onPick(i);
      });
      host.appendChild(b);
    }
  }

  updateAudioButtons() {
    const soundLevel = sounds.audioLevel || 8;
    const vibLevel = vibrate.level || 8;
    const isMuted = soundLevel <= 1;
    const isVibrate = vibLevel > 1;
    const soundOnSvg = `<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12"><path d="M1 4h2v4H1zM3 3h2v6H3zM5 2h2v8H5zM8 3h1v1H8zM9 4h1v4H9zM8 8h1v1H8zM11 2h1v8h-1z" fill="#00f0ff"/></svg>`;
    const soundOffSvg = `<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12"><path d="M1 4h2v4H1zM3 3h2v6H3zM5 2h2v8H5zM8 4h1v1H8zM9 5h1v2H9zM8 7h1v1H8zM10 3h1v1h-1zm1 1h1v1h-1zm-2 2h1v1H9zm-1 1h1v1H8z" fill="#64748b"/><line x1="8" y1="3" x2="12" y2="9" stroke="#ff0055" stroke-width="1.5"/></svg>`;
    const vibOnSvg = `<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12"><rect x="3" y="1" width="6" height="10" rx="1" fill="#00f0ff"/><line x1="1" y1="4" x2="1" y2="8" stroke="#00f0ff" stroke-width="1.2"/><line x1="11" y1="4" x2="11" y2="8" stroke="#00f0ff" stroke-width="1.2"/></svg>`;
    const vibOffSvg = `<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12"><rect x="3" y="1" width="6" height="10" rx="1" fill="#64748b"/><line x1="1" y1="4" x2="1" y2="8" stroke="#64748b" stroke-width="1.2"/><line x1="11" y1="4" x2="11" y2="8" stroke="#64748b" stroke-width="1.2"/></svg>`;

    if (btnSoundToggle) btnSoundToggle.innerHTML = isMuted ? soundOffSvg : soundOnSvg;
    if (btnSoundMenu) {
      btnSoundMenu.innerHTML = isMuted ? soundOffSvg : soundOnSvg;
      btnSoundMenu.title = `SES ${soundLevel}/8`;
    }
    if (btnVibrateMenu) {
      btnVibrateMenu.innerHTML = isVibrate ? vibOnSvg : vibOffSvg;
      btnVibrateMenu.title = `TİTREŞİM ${vibLevel}/8`;
    }

    const btnPauseBgm = document.getElementById('btn-pause-bgm');
    const isBgm = sounds.isBgmActive !== false;
    if (btnPauseBgm) {
      btnPauseBgm.innerHTML = `<svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12" style="margin-right:4px;"><path d="M2 9a2 2 0 1 0 2-2H3V2h6v4a2 2 0 1 0 2-2V1H3a1 1 0 0 0-1 1v7z" fill="${isBgm ? '#d946ef' : '#64748b'}"/></svg> ${isBgm ? t('pause_bgm_on') : t('pause_bgm_off')}`;
    }
    const soundRead = document.getElementById('sound-level-readout');
    const pauseSoundRead = document.getElementById('pause-sound-readout');
    const vibRead = document.getElementById('vibrate-level-readout');
    const pauseVibRead = document.getElementById('pause-vibrate-readout');
    if (soundRead) soundRead.textContent = `${soundLevel}/8`;
    if (pauseSoundRead) pauseSoundRead.textContent = `${soundLevel}/8`;
    if (vibRead) vibRead.textContent = `${vibLevel}/8`;
    if (pauseVibRead) pauseVibRead.textContent = `${vibLevel}/8`;
    this.paintVolumeSteps('sound-steps', soundLevel, (n) => {
      sounds.init();
      sounds.setLevel(n);
      this.updateAudioButtons();
      if (n > 1) sounds.playCardSelect();
    });
    this.paintVolumeSteps('pause-sound-steps', soundLevel, (n) => {
      sounds.init();
      sounds.setLevel(n);
      this.updateAudioButtons();
    });
    this.paintVolumeSteps('vibrate-steps', vibLevel, (n) => {
      vibrate.setLevel(n);
      this.updateAudioButtons();
      vibrate.light();
    });
    this.paintVolumeSteps('pause-vibrate-steps', vibLevel, (n) => {
      vibrate.setLevel(n);
      this.updateAudioButtons();
      vibrate.light();
    });
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
        laser: t('upg_laser'),
        missiles: t('upg_missiles'),
        shield: t('upg_shield'),
        magnet: t('upg_magnet'),
        fireRate: t('upg_fireRate'),
        drones: t('upg_drones'),
        tesla: t('upg_tesla'),
        emp: t('upg_emp'),
        hull: t('upg_hull')
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
      { id: 'magnet', icon: 'magnet', max: 5, cost: 200 },
      { id: 'critDmg', icon: 'fire', max: 5, cost: 250 },
      { id: 'startShield', icon: 'shield', max: 3, cost: 300 },
      { id: 'xpBonus', icon: 'energy', max: 5, cost: 180 },
      { id: 'crystalBonus', icon: 'crystal', max: 4, cost: 240 },
      { id: 'rerollStart', icon: 'dice', max: 2, cost: 500 }
    ];
    grid.innerHTML = '';
    for (const node of nodes) {
      const lv = this.masteryTree[node.id] || 0;
      const isMaxed = lv >= node.max;
      const nextLv = lv + 1;
      const adRank = !isMaxed && this.isAdRank(nextLv, node.max);
      const cost = node.cost * nextLv;
      const canBuy = !isMaxed && (adRank || this.totalCrystals >= cost);
      const div = document.createElement('div');
      div.className = `mastery-node ${lv > 0 ? 'unlocked' : ''} ${isMaxed ? 'maxed' : ''}`;

      let pipsHtml = '<div class="mastery-node-level-bar">';
      for (let i = 1; i <= node.max; i++) {
        const gate = this.isAdRank(i, node.max) ? ' ad-gate' : '';
        pipsHtml += `<div class="mastery-level-pip ${i <= lv ? 'active' : ''}${gate}"></div>`;
      }
      pipsHtml += '</div>';

      const iconSvg = getPixelIconSvg(node.icon, 'md') || node.icon;
      const nodeName = t('mastery_' + node.id + '_name');
      const nodeDesc = t('mastery_' + node.id + '_desc');

      div.innerHTML = `
        <div class="mastery-node-icon">${iconSvg}</div>
        <div class="mastery-node-name">${nodeName}</div>
        ${pipsHtml}
        <div class="mastery-node-desc">${nodeDesc}</div>
        <div class="mastery-node-cost">${isMaxed ? t('mastery_maxed') : (adRank ? t('ad_rank_btn') : `${cost.toLocaleString()} CR`)}</div>
      `;

      if (canBuy) {
        div.addEventListener('click', () => {
          const grant = () => {
            this.masteryTree[node.id] = lv + 1;
            localStorage.setItem('neon_mastery', JSON.stringify(this.masteryTree));
            this.updateCrystalsDisplay();
            sounds.playCardSelect();
            vibrate.medium();
            this.renderMasteryTree();
          };
          if (adRank) {
            this.playPurchaseAd(grant);
            return;
          }
          this.totalCrystals -= cost;
          localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
          grant();
        });
      }
      grid.appendChild(div);
    }
  }

  checkAllTrophies() {
    if (!this.pilotStats) this.pilotStats = this.loadPilotStats();
    let newlyCompleted = false;

    const categories = ['kill', 'asteroid', 'boss', 'combo', 'survive', 'crystal', 'graze', 'flight', 'chest', 'bomb'];
    for (const catId of categories) {
      const catTiers = this.trophyDefs.filter(t => t.category === catId);
      const activeTier = catTiers.find(t => !this.trophies[t.id]);
      if (activeTier) {
        const currentVal = this.pilotStats[activeTier.stat] || 0;
        if (currentVal >= activeTier.target) {
          newlyCompleted = true;
          break;
        }
      }
    }
    return newlyCompleted;
  }

  updateTrophiesBadge() {
    const badge = document.getElementById('trophies-badge-dot');
    if (!badge) return;
    const hasClaimable = this.checkAllTrophies();
    if (hasClaimable) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
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
      const badgeName = txt(`trophy_${def.id}_name`, def.name);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 40, t('trophy_toast', { name: badgeName, n: def.reward }), '#ffd700', 16);
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffd700', 150);
    }

    this.updateTrophiesBadge();
    this.renderTrophies();
  }

  checkTrophy(id) {
    // Geriye dönük uyumluluk çağrısı
    this.claimTrophy(id);
  }

  renderTrophies() {
    const container = document.getElementById('trophies-tab-view');
    const grid = document.getElementById('trophies-grid');
    if (!grid || !container) return;

    if (!this.pilotStats) this.pilotStats = this.loadPilotStats();
    this.updateTrophiesBadge();

    // Üst Özet Kartı (Summary Banner)
    const totalEarned = Object.keys(this.trophies).filter(k => this.trophies[k]).length;
    let totalClaimedCR = 0;
    for (const def of this.trophyDefs) {
      if (this.trophies[def.id]) totalClaimedCR += def.reward;
    }
    const categoriesList = ['asteroid', 'kill', 'boss', 'combo', 'survive', 'crystal', 'graze', 'flight', 'chest', 'bomb'];
    const masterCount = categoriesList.filter(catId => {
      const catTiers = this.trophyDefs.filter(t => t.category === catId);
      return catTiers.every(t => this.trophies[t.id]);
    }).length;

    let summaryBanner = document.getElementById('trophies-summary-banner');
    if (!summaryBanner) {
      summaryBanner = document.createElement('div');
      summaryBanner.id = 'trophies-summary-banner';
      summaryBanner.className = 'trophies-summary-banner';
      container.insertBefore(summaryBanner, grid);
    }
    summaryBanner.innerHTML = `
      <div class="trophies-summary-item">
        <span class="trophies-summary-val">${totalEarned} / 50</span>
        <span class="trophies-summary-lbl">${t('trophy_earned') || 'BADGES EARNED'}</span>
      </div>
      <div class="trophies-summary-item">
        <span class="trophies-summary-val" style="color:#05ffa1;">${masterCount} / 10</span>
        <span class="trophies-summary-lbl">${t('trophy_mastery') || 'FIELD MASTERY'}</span>
      </div>
      <div class="trophies-summary-item">
        <span class="trophies-summary-val" style="color:#00f0ff;">+${totalClaimedCR.toLocaleString()} CR</span>
        <span class="trophies-summary-lbl">${t('trophy_reward_sum') || 'TOTAL REWARD'}</span>
      </div>
    `;

    // Filtre sekmesi
    let filterBar = document.getElementById('trophies-filter-bar');
    if (!filterBar) {
      filterBar = document.createElement('div');
      filterBar.id = 'trophies-filter-bar';
      filterBar.className = 'trophies-filter-bar';
      container.insertBefore(filterBar, grid);
    }

    const isProg = this.trophyCategoryView !== 'all';
    filterBar.innerHTML = `
      <div class="trophy-filter-pill ${isProg ? 'active' : ''}" data-view="prog">
        <span>${t('trophy_view_prog') || 'STEP BY STEP'}</span>
        <span class="filter-count-badge">${t('trophy_view_fields') || '10 FIELDS'}</span>
      </div>
      <div class="trophy-filter-pill ${!isProg ? 'active' : ''}" data-view="all">
        <span>${t('trophy_view_all') || 'ALL BADGES'}</span>
        <span class="filter-count-badge">${t('trophy_view_tiers') || '50 TIERS'}</span>
      </div>
    `;

    filterBar.querySelector('[data-view="prog"]').onclick = () => {
      this.trophyCategoryView = 'progressive';
      this.renderTrophies();
    };
    filterBar.querySelector('[data-view="all"]').onclick = () => {
      this.trophyCategoryView = 'all';
      this.renderTrophies();
    };

    grid.innerHTML = '';

    if (isProg) {
      // 10 Kategori bazında aktif kademeyi göster
      const categories = [
        { id: 'asteroid', title: t('trophy_cat_asteroid') || 'Asteroit Kıran', icon: 'fire' },
        { id: 'kill', title: t('trophy_cat_kill') || 'Düşman Avcısı', icon: 'sword' },
        { id: 'boss', title: t('trophy_cat_boss') || 'Boss Avcısı', icon: 'skull' },
        { id: 'combo', title: t('trophy_cat_combo') || 'Kombo Ustası', icon: 'energy' },
        { id: 'survive', title: t('trophy_cat_survive') || 'Hayatta Kalma', icon: 'speed' },
        { id: 'crystal', title: t('trophy_cat_crystal') || 'Kristal Madencisi', icon: 'crystal' },
        { id: 'graze', title: t('trophy_cat_graze') || 'Sıyırma Refleksi', icon: 'shield' },
        { id: 'flight', title: t('trophy_cat_flight') || 'Sefer Uçuşları', icon: 'ship' },
        { id: 'chest', title: t('trophy_cat_chest') || 'Kozmik Sandık', icon: 'gift' },
        { id: 'bomb', title: t('trophy_cat_bomb') || 'Patlayıcı Uzmanı', icon: 'bomb' }
      ];

      for (const cat of categories) {
        const catTiers = this.trophyDefs.filter(t => t.category === cat.id);
        const earnedCount = catTiers.filter(t => this.trophies[t.id]).length;
        const allCompleted = earnedCount === catTiers.length;
        const activeTier = catTiers.find(t => !this.trophies[t.id]) || catTiers[catTiers.length - 1];

        const tierName = t(`trophy_${activeTier.id}_name`) || activeTier.name;
        const tierDesc = trophyGoal(activeTier);

        const currentVal = Math.min(activeTier.target, this.pilotStats[activeTier.stat] || 0);
        const isReadyToClaim = !allCompleted && !this.trophies[activeTier.id] && currentVal >= activeTier.target;
        const progressPct = allCompleted ? 100 : Math.min(100, Math.floor((currentVal / activeTier.target) * 100));

        const card = document.createElement('div');
        const tierCls = `tier-${activeTier.tier || 1}`;
        card.className = `trophy-card ${tierCls}` + (allCompleted ? ' maxed' : isReadyToClaim ? ' claimable' : '');

        let pipsHtml = '';
        for (let i = 1; i <= 5; i++) {
          pipsHtml += `<span class="trophy-pip ${i <= earnedCount ? 'filled' : ''}"></span>`;
        }

        const trophySvg = allCompleted ? getPixelIconSvg('crown', 'md') : isReadyToClaim ? getPixelIconSvg('energy', 'md') : getPixelIconSvg(activeTier.icon, 'md');

        const tierBadgeText = allCompleted
          ? (t('trophy_mastered') || 'MASTERY 5/5')
          : (t('trophy_tier', { n: activeTier.tier }) || `TIER ${activeTier.tier}/5`);

        const pipsTitle = t('trophy_pips', { n: earnedCount }) || `${earnedCount}/5 complete`;

        card.innerHTML = `
          <div class="trophy-icon">${trophySvg}</div>
          <div class="trophy-main">
            <div class="trophy-header-row">
              <span class="trophy-name">${allCompleted ? cat.title : tierName}</span>
              <div class="trophy-pips-group" title="${pipsTitle}">${pipsHtml}</div>
              <span class="trophy-level-badge ${activeTier.tier >= 4 ? 'tier-high' : ''}">
                ${tierBadgeText}
              </span>
            </div>
            <div class="trophy-desc">${allCompleted ? (t('trophy_all_done') || 'Every tier in this field is complete.') : tierDesc}</div>
            <div class="trophy-progress-track">
              <div class="trophy-progress-fill" style="width: ${progressPct}%;"></div>
            </div>
            <div class="trophy-meta-row">
              <span>${allCompleted ? (t('trophy_max_done') || 'MAX DIFFICULTY DONE') : `${currentVal.toLocaleString()} / ${activeTier.target.toLocaleString()}`}</span>
              <span class="trophy-reward-tag">${allCompleted ? (t('trophy_master_done') || 'MASTERY COMPLETE') : `+${activeTier.reward} CR`}</span>
            </div>
          </div>
        `;

        if (isReadyToClaim) {
          const claimBtn = document.createElement('button');
          claimBtn.className = 'trophy-claim-btn pulse';
          claimBtn.innerHTML = `${t('trophy_claim', { n: activeTier.reward }) || `CLAIM +${activeTier.reward}`} ${getPixelIconSvg('crystal', 'xs')}`;
          claimBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.claimTrophy(activeTier.id);
          });
          card.appendChild(claimBtn);
        } else if (allCompleted) {
          const completedBadge = document.createElement('div');
          completedBadge.className = 'trophy-level-badge';
          completedBadge.style.color = '#05ffa1';
          completedBadge.style.borderColor = 'rgba(5, 255, 161, 0.4)';
          completedBadge.textContent = t('trophy_master_done') || 'MASTERY';
          card.appendChild(completedBadge);
        }

        grid.appendChild(card);
      }
    } else {
      // 50 Başarımı Liste Halinde Render Et
      for (const def of this.trophyDefs) {
        const earned = !!this.trophies[def.id];
        const currentVal = Math.min(def.target, this.pilotStats[def.stat] || 0);
        const isReadyToClaim = !earned && currentVal >= def.target;
        const progressPct = Math.min(100, Math.floor((currentVal / def.target) * 100));

        const defName = t(`trophy_${def.id}_name`) || def.name;
        const defDesc = trophyGoal(def);

        const card = document.createElement('div');
        const tierCls = `tier-${def.tier || 1}`;
        card.className = `trophy-card ${tierCls}` + (earned ? ' maxed' : isReadyToClaim ? ' claimable' : '');

        const trophySvg = earned ? getPixelIconSvg(def.icon, 'md') : isReadyToClaim ? getPixelIconSvg('energy', 'md') : getPixelIconSvg(def.icon, 'md');

        card.innerHTML = `
          <div class="trophy-icon">${trophySvg}</div>
          <div class="trophy-main">
            <div class="trophy-header-row">
              <span class="trophy-name">${defName}</span>
              <span class="trophy-level-badge ${def.tier >= 4 ? 'tier-high' : ''}">${t('trophy_tier', { n: def.tier }) || `TIER ${def.tier}/5`}</span>
            </div>
            <div class="trophy-desc">${defDesc}</div>
            <div class="trophy-progress-track">
              <div class="trophy-progress-fill" style="width: ${progressPct}%;"></div>
            </div>
            <div class="trophy-meta-row">
              <span>${currentVal.toLocaleString()} / ${def.target.toLocaleString()}</span>
              <span class="trophy-reward-tag">+${def.reward} CR</span>
            </div>
          </div>
        `;

        if (isReadyToClaim) {
          const claimBtn = document.createElement('button');
          claimBtn.className = 'trophy-claim-btn pulse';
          claimBtn.innerHTML = `${t('trophy_claim', { n: def.reward }) || `CLAIM +${def.reward}`} ${getPixelIconSvg('crystal', 'xs')}`;
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
          completedBadge.textContent = t('trophy_master_done') || 'CLAIMED';
          card.appendChild(completedBadge);
        }

        grid.appendChild(card);
      }
    }
  }

  resumeGame() {
    if (this.state !== 'PAUSED') return;
    const nextState = (this.isMerchantActive || (merchantModal && !merchantModal.classList.contains('hidden')))
      ? 'MERCHANT'
      : (this.prevStateBeforePause || 'PLAYING');
    this.prevStateBeforePause = null;
    this.lastTime = performance.now();
    this.requestWakeLock();
    if (nextState === 'PLAYING') {
      if (sounds.resumeAudio) sounds.resumeAudio();
      if (sounds.setPauseFilter) sounds.setPauseFilter(false);
      sounds.startBGM();
      this.startSmoothResume(26);
    } else {
      this.state = nextState;
      if (nextState === 'MERCHANT' && sounds.setPauseFilter) {
        sounds.setPauseFilter(true);
      }
    }
    vibrate.light();
    if (pauseModal) {
      pauseModal.style.pointerEvents = '';
      pauseModal.classList.add('hidden');
    }
  }

  switchHangarTab(tabName = 'skins') {
    this.activeHangarTab = tabName;

    const allTabs = [
      { id: 'skins', btn: tabBtnSkins, view: skinsContainer, render: () => this.renderHangarSkins() },
      { id: 'trails', btn: tabBtnTrails, view: trailsContainer, render: () => this.renderHangarTrails() },
      { id: 'drones', btn: tabBtnDrones, view: dronesContainer, render: () => this.renderHangarDrones() },
      { id: 'boosters', btn: tabBtnBoosters, view: boostersContainer, render: () => this.renderHangarBoosters() },
      { id: 'tech', btn: tabBtnTech, view: techTabView, render: () => {
        if (techContainer) techContainer.classList.remove('hidden');
        this.renderTechUpgrades();
        this.renderMasteryTree();
      }},
      { id: 'trophies', btn: tabBtnTrophies, view: trophiesTabView, render: () => this.renderTrophies() }
    ];

    allTabs.forEach(tab => {
      const isTarget = tab.id === tabName;
      if (tab.btn) {
        if (isTarget) {
          tab.btn.classList.add('active');
          try {
            const tabsContainer = tab.btn.parentElement;
            if (tabsContainer && tabsContainer.clientWidth > 0) {
              const targetScroll = tab.btn.offsetLeft - (tabsContainer.clientWidth / 2) + (tab.btn.clientWidth / 2);
              tabsContainer.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
            }
          } catch(e) {}
        } else {
          tab.btn.classList.remove('active');
        }
      }
      if (tab.view) {
        if (isTarget) {
          tab.view.classList.remove('hidden');
          try { tab.view.scrollTop = 0; } catch(e) {}
        } else {
          tab.view.classList.add('hidden');
        }
      }
    });

    const activeTabObj = allTabs.find(t => t.id === tabName);
    if (activeTabObj && typeof activeTabObj.render === 'function') {
      try {
        activeTabObj.render();
      } catch(err) {
        console.error("Hangar sekme çizim hatası:", err);
      }
    }
  }

  openHangar(targetSkinId) {
    try { history.pushState({ modal: 'hangar' }, ''); } catch(e) {}
    this.state = 'MENU';
    if (targetSkinId && this.skins[targetSkinId]) {
      this.inspectedSkinId = targetSkinId;
    }
    this.updateCrystalsDisplay();
    this.updateTrophiesBadge();
    this.switchHangarTab(this.activeHangarTab || 'skins');

    if (hangarModal) hangarModal.classList.remove('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(0);
  }

  closeHangar() {
    this.state = 'MENU';
    if (hangarModal) hangarModal.classList.add('hidden');
    if (startScreen) startScreen.classList.remove('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(2);
    this.updateMenuShipPreview();
    this.updateCrystalsDisplay();
  }

  updateCrystalsDisplay() {
    if (this.devMode) this.totalCrystals = 999999999;
    const displayText = this.devMode ? '∞ SINIRSIZ' : this.totalCrystals.toLocaleString();
    if (totalCrystalsDisplay) totalCrystalsDisplay.textContent = displayText;
    if (hangarCrystalsVal) hangarCrystalsVal.textContent = displayText;
  }

  updateGoldDisplay() {
    this.updateCrystalsDisplay();
  }

  saveGold(val) {
    this.totalCrystals = this.devMode ? 999999999 : val;
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    this.updateCrystalsDisplay();
  }

  saveData() {
    if (!this.devMode) {
      localStorage.setItem('neon_total_crystals', (this.totalCrystals || 0).toString());
    }
    if (this.unlockedSkins) {
      localStorage.setItem('neon_unlocked_skins', JSON.stringify(this.unlockedSkins));
    }
    if (this.currentSkinId) {
      localStorage.setItem('neon_equipped_skin', this.currentSkinId);
    }
    if (this.unlockedPilots) {
      localStorage.setItem('neon_unlocked_pilots', JSON.stringify(this.unlockedPilots));
    }
    if (this.activeArchetype) {
      localStorage.setItem('neon_flight_archetype', this.activeArchetype);
    }
    if (this.masteryTree) {
      localStorage.setItem('neon_mastery', JSON.stringify(this.masteryTree));
    }
    if (this.techUpgrades) {
      localStorage.setItem('neon_tech_upgrades', JSON.stringify(this.techUpgrades));
    }
    if (this.pilotStats && this.savePilotStats) {
      this.savePilotStats();
    }
    this.updateCrystalsDisplay();
  }

  toggleDevMode(forceState = null) {
    if (import.meta.env.PROD) {
      this.devMode = false;
      return;
    }
    this.devMode = forceState !== null ? forceState : !this.devMode;
    localStorage.setItem('neon_dev_mode', this.devMode ? 'true' : 'false');

    if (this.devMode) {
      if (!localStorage.getItem('neon_pre_dev_crystals')) {
        localStorage.setItem('neon_pre_dev_crystals', this.totalCrystals.toString());
      }
      this.totalCrystals = 999999999;
      localStorage.setItem('neon_total_crystals', '999999999');
      sounds.playJackpot();
      vibrate.success();
      this.showToast('[DEV] GELİŞTİRİCİ MODU: Sınırsız Kaynak Aktif!', '#05ffa1');
    } else {
      const prev = parseInt(localStorage.getItem('neon_pre_dev_crystals') || '1000', 10);
      this.totalCrystals = prev;
      localStorage.setItem('neon_total_crystals', prev.toString());
      localStorage.removeItem('neon_pre_dev_crystals');
      sounds.playCardSelect();
      vibrate.light();
      this.showToast('[DEV] Geliştirici Modu Kapatıldı', '#ffbe0b');
    }

    this.updateCrystalsDisplay();
    if (this.updateDevModeUI) this.updateDevModeUI();
    if (this.activeHangarTab) this.switchHangarTab(this.activeHangarTab);
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
        wState.spinsUsed = Math.max(0, (wState.spinsUsed || 0) - 1);
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
      this.showToast(t('toast_jackpot_2x', { n: finalAmount }), '#ffd700');
    } else {
      this.showToast(t('toast_reward_cr', { n: finalAmount }), '#ffbe0b');
    }

    if (this.particles) {
      const centerX = this.width / 2;
      const centerY = this.height * 0.35;
      const text = isJackpot ? `2X +${finalAmount} CR!` : `+${finalAmount} CR!`;
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
      if (textSpan) textSpan.textContent = t('ad_preparing');
    }

    const earned = this.crystalsEarnedThisRun || 0;
    const baseGain = Math.max(100, earned);

    if (window.showRewardedAd) {
      window.showRewardedAd(
        (reward) => {
          this.gameOverAdUsed = true;
          this.runSawRewardedAd = true;
          this.totalCrystals += baseGain;
          this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + baseGain;
          if (this.pilotStats) {
            this.pilotStats.lifetimeCrystals = (this.pilotStats.lifetimeCrystals || 0) + baseGain;
            this.savePilotStats();
          }
          this.saveGold(this.totalCrystals);
          this.updateCrystalsDisplay();

          if (finalCrystals) {
            finalCrystals.textContent = `+${this.crystalsEarnedThisRun.toLocaleString()} CR`;
          }
          const finalCrystalsBoosted = document.getElementById('final-crystals-boosted');
          if (finalCrystalsBoosted) {
            finalCrystalsBoosted.textContent = `2X (+${this.crystalsEarnedThisRun.toLocaleString()} CR)`;
            finalCrystalsBoosted.style.color = '#05ffa1';
          }
          if (btnDouble) {
            btnDouble.disabled = true;
            btnDouble.classList.remove('pulse');
            btnDouble.classList.remove('gold-shimmer-btn');
            btnDouble.classList.add('done');
            btnDouble.textContent = t('gameover_doubled');
          }

          sounds.playLevelUp();
          sounds.playJackpot();
          vibrate.success();
          this.showToast(t('toast_loot_doubled', { n: baseGain }), '#05ffa1');
          if (this.particles) {
            this.particles.spawnShockwave(this.width / 2, this.height * 0.45, '#05ffa1', 300);
            this.particles.spawnExplosion(this.width / 2, this.height * 0.45, '#05ffa1', 25, 4);
          }
        },
        (err) => {
          console.warn('2X Ganimet reklamı tamamlanmadı:', err);
          if (btnDouble) {
            btnDouble.disabled = false;
            btnDouble.innerHTML = `<span id="btn-double-crystals-text">${t('gameover_double_ad', { n: baseGain })}</span>`;
          }
          noteAdMiss(this, err);
          vibrate.medium();
        }
      );
    } else {
      this.showToast(t('toast_ad_not_ready'), '#ffbe0b');
      if (btnDouble) {
        btnDouble.disabled = false;
        btnDouble.innerHTML = `<span id="btn-double-crystals-text">${t('gameover_double_ad', { n: baseGain })}</span>`;
      }
    }
  }

  doubleVictoryCrystals() {
    if (this.victoryAdUsed) return;
    const btnVictory = document.getElementById('btn-victory-double');
    if (btnVictory) {
      btnVictory.disabled = true;
      btnVictory.textContent = t('ad_preparing');
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
            victoryRewardCrystals.textContent = `+${(bonus * 2).toLocaleString()} CR (2X)`;
          }
          if (btnVictory) {
            btnVictory.disabled = true;
            btnVictory.classList.remove('pulse');
            btnVictory.classList.remove('gold-shimmer-btn');
            btnVictory.innerHTML = `<span>${t('victory_doubled_done', { n: bonus })}</span>`;
          }

          sounds.playLevelUp();
          sounds.playJackpot();
          vibrate.success();
          this.showToast(t('toast_loot_doubled', { n: bonus }), '#ffd700');
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
              <span class="btn-shimmer-badge"><svg class="pixel-icon pixel-icon-xs" viewBox="0 0 10 10" style="margin-right:2px"><polygon points="2,1 8,1 8,5 5,8 2,5" fill="#ffd700"/></svg> 2X</span>
              <span id="btn-victory-double-text">${t('victory_double_ad', { n: bonus })}</span>
            `;
          }
          noteAdMiss(this, err);
          vibrate.medium();
        }
      );
    } else {
      this.showToast(t('toast_ad_not_ready'), '#ffbe0b');
      if (btnVictory) {
        btnVictory.disabled = false;
        btnVictory.innerHTML = `
          <span class="btn-shimmer-badge"><svg class="pixel-icon pixel-icon-xs" viewBox="0 0 10 10" style="margin-right:2px"><polygon points="2,1 8,1 8,5 5,8 2,5" fill="#ffd700"/></svg> 2X</span>
          <span id="btn-victory-double-text">${t('victory_double_ad', { n: bonus })}</span>
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
      if (textSpan) textSpan.textContent = t('ad_preparing');
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
            if (textSpan) textSpan.textContent = t('merch_ad_done');
          }

          // Kaçakçı ürünlerini yeniden render et (yeni bütçeyle ürünler açılabilir!)
          this.renderMerchantItems();

          sounds.playLevelUp();
          sounds.playJackpot();
          vibrate.success();
          this.showToast(t('toast_smuggler_cr', { n: isLucky ? 200 : 100 }), '#ffd700');
        },
        (err) => {
          console.warn('Kaçakçı desteği reklamı tamamlanmadı:', err);
          if (btnMerchantAd) {
            btnMerchantAd.disabled = false;
            if (textSpan) textSpan.textContent = t('merch_ad_ready');
          }
          noteAdMiss(this, err);
          vibrate.medium();
        }
      );
    } else {
      this.showToast(t('toast_ad_not_ready'), '#ffbe0b');
      if (btnMerchantAd) {
        btnMerchantAd.disabled = false;
        if (textSpan) textSpan.textContent = t('merch_ad_ready');
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

  // === DİNAMİK HARCAMA & ALTIN/KRİSTAL PATLAMASI EFEKTİ ===
  triggerSpendingEffect(sourceEl, cost, label = 'KRİSTAL') {
    if (!sourceEl) return;
    const rect = sourceEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // 1. Buton üzerinde parlama ve vuruş tepkisi
    sourceEl.classList.add('btn-purchased-burst');
    setTimeout(() => {
      sourceEl.classList.remove('btn-purchased-burst');
    }, 450);

    // 2. Kapsayıcı katman
    let container = document.getElementById('spend-burst-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'spend-burst-container';
      container.className = 'spend-burst-container';
      document.body.appendChild(container);
    }

    // 3. Yükselen Harcama Rozeti (-1,800 KRİSTAL)
    const badge = document.createElement('div');
    badge.className = 'spend-floating-badge';
    badge.style.left = `${cx}px`;
    badge.style.top = `${cy}px`;
    badge.innerHTML = `
      <svg class="pixel-icon pixel-icon-sm" viewBox="0 0 10 10"><polygon points="5,1 9,4 5,9 1,4" fill="#ffd700" stroke="#ffbe0b" stroke-width="0.8"/></svg>
      <span>-${cost.toLocaleString()} ${label}</span>
    `;
    container.appendChild(badge);
    setTimeout(() => badge.remove(), 950);

    // 4. Havaya fırlayan 30 Adet Altın / Kristal Parçacığı (360 derece patlama + yukarı süzülüş)
    const count = 30;
    const gemChars = ['❖', '◆', '✦', '▲', '●'];
    const colors = ['#ffd700', '#ffbe0b', '#05ffa1', '#ffffff', '#ff9100'];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'spend-coin-particle';
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;

      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const dist = 45 + Math.random() * 85;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - (30 + Math.random() * 50);
      const dur = 0.55 + Math.random() * 0.4;
      const rot = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360);
      const scale = 0.2 + Math.random() * 0.4;

      p.style.setProperty('--p-dx', `${dx}px`);
      p.style.setProperty('--p-dy', `${dy}px`);
      p.style.setProperty('--p-dur', `${dur}s`);
      p.style.setProperty('--p-rot', `${rot}deg`);
      p.style.setProperty('--p-scale', `${scale}`);

      p.style.color = colors[Math.floor(Math.random() * colors.length)];
      p.textContent = gemChars[Math.floor(Math.random() * gemChars.length)];

      container.appendChild(p);
      setTimeout(() => p.remove(), (dur + 0.1) * 1000);
    }

    // 5. Üst Kristal Sayacını Titret ve Parlat
    const crystalEls = [
      document.getElementById('hangar-crystals-display'),
      document.getElementById('hangar-crystals-val'),
      document.getElementById('total-crystals-display')
    ];
    crystalEls.forEach(el => {
      if (el) {
        el.classList.add('crystals-spend-pulse');
        setTimeout(() => el.classList.remove('crystals-spend-pulse'), 650);
      }
    });

    // 6. Titreşim ve Ses
    vibrate.success();
    sounds.playJackpot();
    if (sounds.playGemPickup) sounds.playGemPickup();
  }

  startShipTestFlight(skinId) {
    if (!this.skins || !this.skins[skinId]) return;
    sounds.init();
    sounds.playWarpDrive();
    vibrate.medium();

    this.preTestSkinId = this.currentSkinId;
    this.preTestMode = this.currentMode;
    this.isTestFlight = true;
    this.testFlightTimer = 15 * 60;
    this.currentSkinId = skinId;

    if (hangarModal) hangarModal.classList.add('hidden');
    this.startNewGame();
    // Boost weapons and activate Overdrive surge + ready Ultimate so the ship feels awesome to test
    if (this.player) {
      this.player.upgrades.laser = Math.max(2, this.player.upgrades.laser || 1);
      this.player.upgrades.fireRate = Math.max(2, this.player.upgrades.fireRate || 1);
      this.player.overchargeTimer = 180;
      this.player.feverCharge = 100;
      this.player.invulnerableTimer = 90;
      this.updateHUD();
    }
    this.showToast(`[TEST] ${t('ship_' + skinId + '_name')} (15 sn)`, this.skins[skinId].primary || '#00f0ff');
  }

  endShipTestFlight() {
    if (!this.isTestFlight) return;
    this.isTestFlight = false;
    this.testFlightTimer = 0;
    const testedSkinId = this.currentSkinId;
    if (this.preTestSkinId) {
      this.currentSkinId = this.preTestSkinId;
    }
    if (this.preTestMode) {
      this.currentMode = this.preTestMode;
    }

    this.state = 'MENU';
    this.releaseWakeLock();
    sounds.setBossEnraged(false);
    sounds.setBossMode(false);
    sounds.stopBGM();
    sounds.playCardSelect();
    vibrate.light();

    hud.classList.add('hidden');
    if (ultimateBtnContainer) ultimateBtnContainer.classList.add('hidden');
    if (miniQuestCard) miniQuestCard.classList.add('hidden');
    if (levelModal) levelModal.classList.add('hidden');
    if (luckyChestModal) luckyChestModal.classList.add('hidden');
    if (pauseModal) pauseModal.classList.add('hidden');
    if (gameoverModal) gameoverModal.classList.add('hidden');
    if (startScreen) startScreen.classList.remove('hidden');

    this.inspectedSkinId = testedSkinId;
    this.openHangar();
    this.switchHangarTab('skins');
    const testedName = (this.skins && this.skins[testedSkinId]) ? this.skins[testedSkinId].name : 'Gemi';
    const testedColor = (this.skins && this.skins[testedSkinId]) ? this.skins[testedSkinId].primary : '#00f0ff';
    this.showToast(`${testedName} test sürüşü bitti. Hangardan kilidini açabilirsin.`, testedColor);
  }

  renderHangarSkins() {
    if (!skinsContainer) return;
    skinsContainer.innerHTML = '';

    if (!this.inspectedSkinId || !this.skins[this.inspectedSkinId]) {
      this.inspectedSkinId = this.currentSkinId || 'cyberpunk';
    }
    const inspected = this.skins[this.inspectedSkinId] || this.skins.cyberpunk;
    const isInspectedUnlocked = this.unlockedSkins.includes(inspected.id);
    const isInspectedEquipped = this.currentSkinId === inspected.id;

    // 1. ÜST CANLI İNCELEME PODU (HOLOGRAPHIC INSPECTION PODIUM)
    const showcase = document.createElement('div');
    showcase.className = 'hangar-showcase';

    const dmgPct = Math.min(100, Math.round((inspected.stats.dmg / 150) * 100));
    const shieldPct = Math.min(100, Math.round((inspected.stats.shield / 150) * 100));
    const speedPct = Math.min(100, Math.round((inspected.stats.speed / 150) * 100));
    const magnetPct = Math.min(100, Math.round((inspected.stats.magnet / 150) * 100));

    let actionBtnText = '';
    let actionBtnClass = '';
    if (isInspectedEquipped) {
      actionBtnText = `${getPixelIconSvg('check', 'sm')} <span>${t('status_equipped') || 'GÖREVDE KUŞANILDI'}</span>`;
      actionBtnClass = 'btn-showcase-equipped';
    } else if (isInspectedUnlocked) {
      actionBtnText = `${getPixelIconSvg('energy', 'sm')} <span>${t('btn_equip') || 'KUŞAN'}</span>`;
      actionBtnClass = 'btn-showcase-equip';
    } else {
      const canAfford = this.totalCrystals >= inspected.cost;
      const buyText = t('btn_buy_ship', { c: inspected.cost.toLocaleString() }) || `${inspected.cost.toLocaleString()} CR SATIN AL`;
      actionBtnText = `${getPixelIconSvg(canAfford ? 'crystal' : 'lock', 'sm')} <span>${buyText}</span>`;
      actionBtnClass = canAfford ? 'btn-showcase-buy' : 'btn-showcase-locked';
    }

    showcase.innerHTML = `
      <div class="showcase-stage">
        <div class="showcase-glow-ring" style="border-color: ${inspected.primary}44; box-shadow: 0 0 30px ${inspected.primary}33;"></div>
        <div class="showcase-vessel-art">
          ${getShipPixelSvg(inspected.id, 76)}
        </div>
        <div class="showcase-pedestal">
          <div class="pedestal-line" style="background: linear-gradient(90deg, transparent, ${inspected.primary}, transparent);"></div>
        </div>
      </div>

      <div class="showcase-details">
        <div class="showcase-header-row">
          <div class="showcase-name-wrap">
            <span class="showcase-title">${t('ship_' + inspected.id + '_name')}</span>
            <span class="showcase-subtitle">${t('ship_' + inspected.id + '_title')}</span>
          </div>
          <span class="showcase-status-badge ${isInspectedEquipped ? 'badge-equipped' : (isInspectedUnlocked ? 'badge-owned' : 'badge-locked')}">
            ${isInspectedEquipped ? t('status_equipped') : (isInspectedUnlocked ? t('status_hangar') : t('status_locked'))}
          </span>
        </div>

        <div class="showcase-perk-box" style="border-left-color: ${inspected.primary};">
          <div class="showcase-perk-title" style="color: ${inspected.primary};">
            ${t('ship_' + inspected.id + '_perk_title')}
          </div>
          <div class="showcase-perk-desc">${t('ship_' + inspected.id + '_perk_desc')}</div>
        </div>

        <div class="showcase-stats-grid">
          <div class="stat-bar-group">
            <div class="stat-bar-label"><span>${t('stat_dmg')}</span><span class="stat-num">${inspected.stats.dmg}%</span></div>
            <div class="stat-bar-track"><div class="stat-bar-fill fill-dmg" style="width: ${dmgPct}%;"></div></div>
          </div>
          <div class="stat-bar-group">
            <div class="stat-bar-label"><span>${t('stat_shield')}</span><span class="stat-num">${inspected.stats.shield}%</span></div>
            <div class="stat-bar-track"><div class="stat-bar-fill fill-shield" style="width: ${shieldPct}%;"></div></div>
          </div>
          <div class="stat-bar-group">
            <div class="stat-bar-label"><span>${t('stat_speed')}</span><span class="stat-num">${inspected.stats.speed}%</span></div>
            <div class="stat-bar-track"><div class="stat-bar-fill fill-speed" style="width: ${speedPct}%;"></div></div>
          </div>
          <div class="stat-bar-group">
            <div class="stat-bar-label"><span>${t('stat_magnet')}</span><span class="stat-num">${inspected.stats.magnet}%</span></div>
            <div class="stat-bar-track"><div class="stat-bar-fill fill-magnet" style="width: ${magnetPct}%;"></div></div>
          </div>
        </div>

        <div class="showcase-actions-row">
          <button class="showcase-action-btn ${actionBtnClass}">
            ${actionBtnText}
          </button>
          <button class="showcase-test-btn" title="15 Saniye Ücretsiz Test Sürüşü">
            ${t('btn_test_flight')}
          </button>
        </div>
      </div>
    `;

    const showcaseTestBtn = showcase.querySelector('.showcase-test-btn');
    if (showcaseTestBtn) {
      showcaseTestBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.startShipTestFlight(inspected.id);
      });
    }

    const showcaseBtn = showcase.querySelector('.showcase-action-btn');
    if (showcaseBtn) {
      showcaseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.init();
        if (isInspectedUnlocked) {
          if (!isInspectedEquipped) {
            this.currentSkinId = inspected.id;
            localStorage.setItem('neon_current_skin', inspected.id);
            localStorage.setItem('neon_equipped_skin', inspected.id);
            sounds.playCardSelect();
            vibrate.light();
            this.showToast(t('toast_ship_on', { name: t('ship_' + inspected.id + '_name') }), inspected.primary || '#00f0ff');
            this.renderHangarSkins();
            this.updateMenuShipPreview();
          }
        } else if (this.totalCrystals >= inspected.cost) {
          const cost = inspected.cost;
          this.totalCrystals -= cost;
          localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
          this.unlockedSkins.push(inspected.id);
          localStorage.setItem('neon_unlocked_skins', JSON.stringify(this.unlockedSkins));
          this.currentSkinId = inspected.id;
          localStorage.setItem('neon_current_skin', inspected.id);
          localStorage.setItem('neon_equipped_skin', inspected.id);
          
          // Görsel Altın/Kristal Harcama Patlaması Efekti
          this.triggerSpendingEffect(showcaseBtn, cost, 'KRİSTAL');

          sounds.playLevelUp();
          this.showToast(t('toast_ship_bought', { name: t('ship_' + inspected.id + '_name') }), '#ffd700');
          this.updateCrystalsDisplay();

          // Efektin ekranda hissedilmesi için pürüzsüz kısa gecikmeyle arayüzü güncelle
          setTimeout(() => {
            this.renderHangarSkins();
            this.updateMenuShipPreview();
          }, 320);
        } else {
          vibrate.medium();
          this.showToast(t('toast_short_cr', { n: (inspected.cost - this.totalCrystals).toLocaleString() }), '#ff0055');
        }
      });
    }

    skinsContainer.appendChild(showcase);

    // 2. ALT GEMİ SEÇİM GALERİSİ (SHIP ROSTER GALLERY)
    const gallerySection = document.createElement('div');
    gallerySection.className = 'hangar-gallery-section';
    gallerySection.innerHTML = `<div class="gallery-section-title">${t('hangar_gallery', { u: this.unlockedSkins.length, t: Object.keys(this.skins).length })}</div>`;

    const galleryGrid = document.createElement('div');
    galleryGrid.className = 'hangar-gallery-grid';

    this.skinOrder.map(id => this.skins[id]).filter(Boolean).forEach(skin => {
      const isUnlocked = this.unlockedSkins.includes(skin.id);
      const isEquipped = this.currentSkinId === skin.id;
      const isSelected = this.inspectedSkinId === skin.id;

      const card = document.createElement('div');
      card.className = `hangar-mini-card ${isSelected ? 'selected' : ''} ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;

      card.innerHTML = `
        <div class="mini-card-art">
          ${getShipPixelSvg(skin.id, 44)}
        </div>
        <div class="mini-card-info">
          <span class="mini-card-title">${t('ship_' + skin.id + '_name')}</span>
          <span class="mini-card-tag ${isEquipped ? 'tag-eq' : (isUnlocked ? 'tag-un' : 'tag-lock')}">
            ${isEquipped ? t('status_equipped') : (isUnlocked ? t('status_owned') : `${skin.cost} CR`)}
          </span>
        </div>
      `;

      card.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        vibrate.light();
        this.inspectedSkinId = skin.id;
        this.renderHangarSkins();
      });

      galleryGrid.appendChild(card);
    });

    gallerySection.appendChild(galleryGrid);
    skinsContainer.appendChild(gallerySection);
  }

  renderHangarDrones() {
    if (!dronesContainer) return;
    dronesContainer.innerHTML = '';

    const banner = document.createElement('div');
    banner.className = 'hangar-section-banner';
    banner.innerHTML = `
      <div class="banner-badge">${t('drone_banner')}</div>
      <div class="banner-hint">${t('drone_hint')}</div>
    `;
    dronesContainer.appendChild(banner);

    const upgradeCosts = [0, 350, 700, 1300, 2200, 3500]; // Lvl 1 -> 5 maliyetleri
    const droneRoleBadges = {
      striker: t('drone_role_striker'),
      missile: t('drone_role_missile'),
      medic: t('drone_role_medic'),
      tesla: t('drone_role_tesla'),
      clone: t('drone_role_clone'),
      twin: t('drone_role_ad')
    };

    Object.values(this.hangarDrones).forEach(drone => {
      const currentLvl = this.droneLevels[drone.id] || 0;
      const isUnlocked = currentLvl > 0;
      const isEquipped = this.equippedDroneId === drone.id && isUnlocked;
      const nextRank = currentLvl + 1;
      const upgradeIsAd = isUnlocked && ! (currentLvl >= 5) && this.isAdRank(nextRank, 5);
      const nextCost = upgradeCosts[nextRank] || 99999;
      const isMax = currentLvl >= 5;
      const adsNeed = drone.adsRequired || 0;
      const adsHave = adsNeed ? this.getAdProgress('drone:' + drone.id) : 0;

      const card = document.createElement('div');
      card.className = `drone-bay-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;

      const roleText = droneRoleBadges[drone.id] || t('tab_drones');
      const droneName = t('drone_' + drone.id + '_name');
      const droneDesc = t('drone_' + drone.id + '_desc');

      card.innerHTML = `
        <div class="drone-dock-pad" style="border-color: ${drone.color}55; box-shadow: inset 0 0 12px ${drone.color}22;">
          <svg viewBox="0 0 32 32" width="38" height="38">
            ${drone.id === 'clone' ? `
              <path d="M16 4 L26 26 L19 22 L16 26 L13 22 L6 26 Z" fill="${drone.color}" />
              <rect x="15" y="11" width="2" height="6" fill="#ffffff" />
            ` : `
              <circle cx="16" cy="16" r="10" fill="none" stroke="${drone.color}" stroke-width="2"/>
              <circle cx="16" cy="16" r="4" fill="${drone.color}"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="${drone.color}" stroke-width="2"/>
              <line x1="16" y1="26" x2="16" y2="30" stroke="${drone.color}" stroke-width="2"/>
              <line x1="2" y1="16" x2="6" y2="16" stroke="${drone.color}" stroke-width="2"/>
              <line x1="26" y1="16" x2="30" y2="16" stroke="${drone.color}" stroke-width="2"/>
            `}
          </svg>
        </div>
        <div class="drone-bay-info">
          <div class="drone-title-row">
            <span class="drone-name">${droneName}</span>
            <span class="drone-role-badge" style="color: ${drone.color}; background: ${drone.color}22; border: 1px solid ${drone.color}44;">${roleText}</span>
          </div>
          <div class="drone-stars-ladder">
            <span class="px-star-row">${pixelPips(currentLvl, 5)}</span>
            <span style="font-size: 8.5px; color: #94a3b8; font-weight: 800; margin-left: 4px;">${isUnlocked ? `LVL ${currentLvl}/5` : t('status_locked')}</span>
          </div>
          <div class="drone-desc">${droneDesc}</div>
        </div>
        <div class="drone-action-col">
          <button class="drone-btn-equip ${isEquipped ? 'is-equipped' : isUnlocked ? 'can-equip' : 'must-buy'}" type="button">
            ${isEquipped ? t('drone_duty') : isUnlocked ? t('btn_equip') : (adsNeed ? t('ad_progress_btn', { n: adsHave, m: adsNeed }) : `${drone.cost} CR`)}
          </button>
          ${isUnlocked && !isMax ? `<button class="drone-btn-upgrade" type="button">${upgradeIsAd ? t('ad_rank_btn') : `▲ +${nextCost} CR`}</button>` : ''}
        </div>
      `;

      // Kart veya Kuşan Butonuna Basınca
      const handleEquipOrBuy = () => {
        sounds.init();
        if (isUnlocked) {
          this.equippedDroneId = drone.id;
          localStorage.setItem('neon_equipped_drone', drone.id);
          sounds.playCardSelect();
          vibrate.light();
          this.showToast(t('toast_drone_on', { name: droneName }), drone.color);
          this.renderHangarDrones();
        } else if (adsNeed) {
          this.playPurchaseAd(() => {
            const seen = this.addAdProgress('drone:' + drone.id);
            if (seen >= adsNeed) {
              this.droneLevels[drone.id] = 1;
              localStorage.setItem('neon_drone_levels', JSON.stringify(this.droneLevels));
              this.equippedDroneId = drone.id;
              localStorage.setItem('neon_equipped_drone', drone.id);
              sounds.playLevelUp();
              this.showToast(t('toast_drone_join', { name: droneName }), '#ffd700');
            } else {
              this.showToast(t('ad_progress_btn', { n: seen, m: adsNeed }), drone.color);
            }
            this.renderHangarDrones();
          });
        } else if (this.totalCrystals >= drone.cost) {
          const cost = drone.cost;
          this.totalCrystals -= cost;
          localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
          this.droneLevels[drone.id] = 1;
          localStorage.setItem('neon_drone_levels', JSON.stringify(this.droneLevels));
          this.equippedDroneId = drone.id;
          localStorage.setItem('neon_equipped_drone', drone.id);
          this.triggerSpendingEffect(equipBtn, cost, 'KRİSTAL');
          sounds.playLevelUp();
          this.showToast(t('toast_drone_join', { name: droneName }), '#ffd700');
          this.updateCrystalsDisplay();
          setTimeout(() => this.renderHangarDrones(), 300);
        } else {
          vibrate.medium();
          this.showToast(t('toast_short_cr', { n: drone.cost - this.totalCrystals }), '#ff0055');
        }
      };

      const equipBtn = card.querySelector('.drone-btn-equip');
      if (equipBtn) {
        equipBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          handleEquipOrBuy();
        });
      }

      card.addEventListener('click', (e) => {
        if (e.target.closest('.drone-btn-upgrade')) return;
        handleEquipOrBuy();
      });

      // Drone Seviye Yükseltme
      const upBtn = card.querySelector('.drone-btn-upgrade');
      if (upBtn) {
        upBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          sounds.init();
          if (upgradeIsAd && currentLvl < 5) {
            this.playPurchaseAd(() => {
              this.droneLevels[drone.id] = currentLvl + 1;
              localStorage.setItem('neon_drone_levels', JSON.stringify(this.droneLevels));
              sounds.playLevelUp();
              vibrate.success();
              this.showToast(t('toast_drone_level', { name: droneName, n: currentLvl + 1 }), '#ffd700');
              this.renderHangarDrones();
            });
            return;
          }
          if (this.totalCrystals >= nextCost && currentLvl < 5) {
            this.totalCrystals -= nextCost;
            localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
            this.droneLevels[drone.id] = currentLvl + 1;
            localStorage.setItem('neon_drone_levels', JSON.stringify(this.droneLevels));
            sounds.playLevelUp();
            vibrate.success();
            this.showToast(t('toast_drone_level', { name: droneName, n: currentLvl + 1 }), '#ffd700');
            this.updateCrystalsDisplay();
            this.renderHangarDrones();
          } else {
            vibrate.medium();
            this.showToast(t('toast_upgrade_short', { n: nextCost - this.totalCrystals }), '#ff0055');
          }
        });
      }

      dronesContainer.appendChild(card);
    });
  }

  renderHangarTrails() {
    if (!trailsContainer) return;
    trailsContainer.innerHTML = '';

    const banner = document.createElement('div');
    banner.className = 'hangar-section-banner';
    banner.style.gridColumn = '1 / -1';
    banner.innerHTML = `
      <div class="banner-badge">${t('trail_banner')}</div>
      <div class="banner-hint">${t('trail_hint')}</div>
    `;
    trailsContainer.appendChild(banner);

    if (!Array.isArray(this.unlockedTrails)) {
      this.unlockedTrails = ['default'];
    }
    if (!this.unlockedTrails.includes('default')) {
      this.unlockedTrails.push('default');
    }

    Object.values(this.trails).forEach(tr => {
      const isUnlocked = this.unlockedTrails.includes(tr.id);
      const isEquipped = this.equippedTrailId === tr.id;

      const card = document.createElement('div');
      card.className = `trail-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;

      const adsNeed = tr.adsRequired || 0;
      const adsHave = adsNeed ? this.getAdProgress('trail:' + tr.id) : 0;
      let badgeText = isEquipped ? t('status_equipped') : (isUnlocked ? t('btn_equip') : (adsNeed ? t('ad_progress_btn', { n: adsHave, m: adsNeed }) : `${tr.cost} CR`));
      const trailName = t('trail_' + tr.id + '_name');
      const trailDesc = t('trail_' + tr.id + '_desc');
      let badgeClass = isEquipped ? 'equipped' : (isUnlocked ? 'unlocked' : 'locked');

      card.innerHTML = `
        <div class="trail-chamber-art" style="box-shadow: inset 0 0 16px ${tr.color}33;">
          <svg viewBox="0 0 32 32" width="40" height="40">
            <line x1="8" y1="28" x2="8" y2="4" stroke="${tr.color}" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="24" y1="28" x2="24" y2="4" stroke="${tr.color}" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="8" cy="10" r="2.5" fill="#ffffff"/>
            <circle cx="24" cy="10" r="2.5" fill="#ffffff"/>
            <circle cx="16" cy="18" r="4" fill="${tr.color}" opacity="0.85"/>
            <circle cx="16" cy="12" r="2" fill="#ffffff" opacity="0.9"/>
          </svg>
        </div>
        <span class="trail-card-title">${trailName}</span>
        <span class="trail-card-desc">${trailDesc}</span>
        <button class="trail-card-btn ${badgeClass}" type="button">${badgeText}</button>
      `;

      card.addEventListener('click', () => {
        sounds.init();
        if (isUnlocked) {
          this.equippedTrailId = tr.id;
          localStorage.setItem('neon_equipped_trail', tr.id);
          sounds.playCardSelect();
          vibrate.light();
          this.showToast(t('toast_trail_on', { name: trailName }), tr.color);
          this.renderHangarTrails();
        } else if (tr.adsRequired) {
          this.playPurchaseAd(() => {
            const seen = this.addAdProgress('trail:' + tr.id);
            if (seen >= tr.adsRequired) {
              this.unlockedTrails.push(tr.id);
              localStorage.setItem('neon_unlocked_trails', JSON.stringify(this.unlockedTrails));
              this.equippedTrailId = tr.id;
              localStorage.setItem('neon_equipped_trail', tr.id);
              sounds.playLevelUp();
              this.showToast(t('toast_trail_unlock', { name: trailName }), '#ffd700');
            } else {
              this.showToast(t('ad_progress_btn', { n: seen, m: tr.adsRequired }), tr.color);
            }
            this.renderHangarTrails();
          });
        } else if (this.totalCrystals >= tr.cost) {
          const cost = tr.cost;
          this.totalCrystals -= cost;
          localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
          this.unlockedTrails.push(tr.id);
          localStorage.setItem('neon_unlocked_trails', JSON.stringify(this.unlockedTrails));
          this.equippedTrailId = tr.id;
          localStorage.setItem('neon_equipped_trail', tr.id);
          const btn = card.querySelector('.trail-card-btn') || card;
          this.triggerSpendingEffect(btn, cost, 'KRİSTAL');
          sounds.playLevelUp();
          this.showToast(t('toast_trail_unlock', { name: trailName }), '#ffd700');
          this.updateCrystalsDisplay();
          setTimeout(() => this.renderHangarTrails(), 300);
        } else {
          vibrate.medium();
          this.showToast(t('toast_short_cr', { n: tr.cost - this.totalCrystals }), '#ff0055');
        }
      });

      trailsContainer.appendChild(card);
    });
  }

  getBoostersCatalog() {
    const revives = parseInt(localStorage.getItem('neon_bonus_revives') || '0', 10);
    const damageBuff = parseInt(localStorage.getItem('neon_boost_damage') || '0', 10);
    const magnetBuff = parseInt(localStorage.getItem('neon_boost_magnet') || '0', 10);
    const overdrive = parseInt(localStorage.getItem('neon_boost_overdrive') || '0', 10);
    const rerolls = parseInt(localStorage.getItem('neon_boost_rerolls') || '0', 10);
    const crystal = parseInt(localStorage.getItem('neon_boost_crystal') || '0', 10);
    const shield = parseInt(localStorage.getItem('neon_boost_shield') || '0', 10);

    return [
      {
        id: 'revive',
        name: 'ACİL DURUM DİRİLME',
        tag: '+1 CAN YEDEĞİ',
        icon: `<svg viewBox="0 0 24 24" width="34" height="34"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="rgba(5,255,161,0.18)" stroke="#05ffa1" stroke-width="2"/><path d="M12 7v10M7 12h10" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/></svg>`,
        desc: 'Gemi patladığında reklamsız anında dirilme hakkı depolar.',
        stock: revives,
        cost: 350,
        color: '#05ffa1',
        storageKey: 'neon_bonus_revives',
        amount: 1
      },
      {
        id: 'damage',
        name: 'PLAZMA SÜPERŞARJ',
        tag: '+%25 SAF HASAR',
        icon: `<svg viewBox="0 0 24 24" width="34" height="34"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="rgba(255,0,85,0.18)" stroke="#ff0055" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="#ffbe0b"/></svg>`,
        desc: 'Sonraki oyunda tüm silahlara +%25 saf hasar bonusu sağlar.',
        stock: damageBuff,
        cost: 160,
        color: '#ff0055',
        storageKey: 'neon_boost_damage',
        amount: 1
      },
      {
        id: 'magnet',
        name: 'GRAVİTASYON VAKUMU',
        tag: '+%80 ÇEKİM ALANI',
        icon: `<svg viewBox="0 0 24 24" width="34" height="34"><path d="M4 4v7a8 8 0 0 0 16 0V4h-4v7a4 4 0 0 1-8 0V4H4z" fill="rgba(168,85,247,0.18)" stroke="#a855f7" stroke-width="2"/><rect x="4" y="4" width="4" height="3" fill="#ff0055"/><rect x="16" y="4" width="4" height="3" fill="#00f0ff"/></svg>`,
        desc: 'Sonraki oyunda kristal çekim menzilini +%80 artırır.',
        stock: magnetBuff,
        cost: 140,
        color: '#a855f7',
        storageKey: 'neon_boost_magnet',
        amount: 1
      },
      {
        id: 'overdrive',
        name: 'OVERDRIVE REAKTÖRÜ',
        tag: '%50 HAZIR SÜPER GÜÇ',
        icon: `<svg viewBox="0 0 24 24" width="34" height="34"><polygon points="13,2 4,14 11,14 9,22 20,10 13,10" fill="#ffd700"/><circle cx="12" cy="12" r="10" fill="none" stroke="#ffd700" stroke-width="1.5" stroke-dasharray="3,3"/></svg>`,
        desc: 'Sonraki oyuna %50 hazır Süper Güç barıyla başlatır.',
        stock: overdrive,
        cost: 200,
        color: '#ffd700',
        storageKey: 'neon_boost_overdrive',
        amount: 1
      },
      {
        id: 'reroll',
        name: 'TAKTİKSEL ZAR PAKETİ',
        tag: '+2 KART YENİLEME',
        icon: `<svg viewBox="0 0 24 24" width="34" height="34"><rect x="3" y="3" width="18" height="18" rx="4" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" stroke-width="2"/><circle cx="8" cy="8" r="1.8" fill="#ffffff"/><circle cx="16" cy="8" r="1.8" fill="#ffffff"/><circle cx="12" cy="12" r="1.8" fill="#00f0ff"/><circle cx="8" cy="16" r="1.8" fill="#ffffff"/><circle cx="16" cy="16" r="1.8" fill="#ffffff"/></svg>`,
        desc: 'Seviye atlama kartlarını +2 kez ekstra yenileme hakkı verir.',
        stock: rerolls,
        cost: 150,
        color: '#38bdf8',
        storageKey: 'neon_boost_rerolls',
        amount: 2
      },
      {
        id: 'crystal',
        name: 'KRİSTAL RADAR SİNYALİ',
        tag: '+%50 KRİSTAL KAZANCI',
        icon: `<svg viewBox="0 0 24 24" width="34" height="34"><polygon points="12,2 21,8 12,22 3,8" fill="rgba(191,90,242,0.2)" stroke="#bf5af2" stroke-width="2"/><line x1="3" y1="8" x2="21" y2="8" stroke="#ffffff" stroke-width="1.2"/></svg>`,
        desc: 'Sonraki oyunda toplanan tüm kristallere kalıcı +%50 bonus.',
        stock: crystal,
        cost: 250,
        color: '#bf5af2',
        storageKey: 'neon_boost_crystal',
        amount: 1
      },
      {
        id: 'shield',
        name: 'AĞIR KALKAN JENERATÖRÜ',
        tag: '+30 BAŞLANGIÇ KALKANI',
        icon: `<svg viewBox="0 0 24 24" width="34" height="34"><polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill="rgba(0,240,255,0.18)" stroke="#00f0ff" stroke-width="2"/><polygon points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5" fill="none" stroke="#ffffff" stroke-width="1.2"/></svg>`,
        desc: 'Oyuna +30 ekstra enerji kalkanı ile tam korumalı başlatır.',
        stock: shield,
        cost: 180,
        color: '#00f0ff',
        storageKey: 'neon_boost_shield',
        amount: 1
      }
    ];
  }

  renderHangarBoosters() {
    if (!boostersContainer) return;
    boostersContainer.innerHTML = '';

    const banner = document.createElement('div');
    banner.className = 'hangar-section-banner';
    banner.innerHTML = `
      <div class="banner-badge">${t('boost_banner')}</div>
      <div class="banner-hint">${t('boost_hint')}</div>
    `;
    boostersContainer.appendChild(banner);

    const categoryChips = {
      revive: { tag: t('boost_revive_chip'), color: '#05ffa1' },
      damage: { tag: t('boost_damage_chip'), color: '#ff0055' },
      magnet: { tag: t('boost_magnet_chip'), color: '#a855f7' },
      overdrive: { tag: t('boost_overdrive_chip'), color: '#ffd700' },
      reroll: { tag: t('boost_reroll_chip'), color: '#38bdf8' },
      crystal: { tag: t('boost_crystal_chip'), color: '#bf5af2' },
      shield: { tag: t('boost_shield_chip'), color: '#00f0ff' }
    };

    const catalog = this.getBoostersCatalog();
    catalog.forEach(item => {
      const card = document.createElement('div');
      card.className = 'booster-card';
      const canAfford = this.totalCrystals >= item.cost;
      const chip = categoryChips[item.id] || { tag: t('boost_banner'), color: item.color };
      const itemName = t('boost_' + item.id + '_name');
      const itemDesc = t('boost_' + item.id + '_desc');

      card.innerHTML = `
        <div class="booster-art-pod" style="box-shadow: 0 0 14px ${item.color}33; border-color: ${item.color}44;">
          ${item.icon}
        </div>
        <div class="booster-info">
          <div class="booster-header-row">
            <span class="booster-title">${itemName}</span>
            <span class="booster-type-chip" style="color: ${chip.color}; border-color: ${chip.color}55; background: ${chip.color}18;">${chip.tag}</span>
          </div>
          <div class="booster-stock-indicator">
            <span class="booster-stock-led ${item.stock > 0 ? 'has-stock' : ''}"></span>
            <span style="color: ${item.stock > 0 ? '#05ffa1' : '#94a3b8'};">${t('boost_stock', { n: item.stock })}</span>
          </div>
          <div class="booster-desc">${itemDesc}</div>
        </div>
        <button class="booster-buy-btn ${canAfford ? 'can-afford' : 'locked'}" type="button">
          ${t('boost_buy', { a: item.amount, c: item.cost })}
        </button>
      `;

      const buyBtn = card.querySelector('.booster-buy-btn');
      if (buyBtn) {
        buyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          sounds.init();
          if (this.totalCrystals >= item.cost) {
            const cost = item.cost;
            this.totalCrystals -= cost;
            localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
            const newStock = item.stock + item.amount;
            localStorage.setItem(item.storageKey, newStock.toString());
            this.triggerSpendingEffect(buyBtn, cost, 'KRİSTAL');
            this.showToast(t('toast_bought', { name: itemName, n: item.amount }), item.color);
            this.updateCrystalsDisplay();
            setTimeout(() => this.renderHangarBoosters(), 300);
          } else {
            this.showToast(t('toast_need_cr', { n: item.cost }), '#ff0055');
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

  adRanksFor(maxLevel) {
    if (maxLevel >= 10) return [3, 7];
    if (maxLevel === 8) return [6];
    if (maxLevel >= 6) return [4];
    if (maxLevel >= 4) return [3];
    if (maxLevel >= 2) return [2];
    return [1];
  }

  isAdRank(nextLevel, maxLevel) {
    return this.adRanksFor(maxLevel).includes(nextLevel);
  }

  getAdProgress(key) {
    try {
      const bag = JSON.parse(localStorage.getItem('neon_ad_unlocks') || '{}');
      return bag[key] || 0;
    } catch (e) {
      return 0;
    }
  }

  addAdProgress(key) {
    let bag = {};
    try { bag = JSON.parse(localStorage.getItem('neon_ad_unlocks') || '{}'); } catch (e) {}
    bag[key] = (bag[key] || 0) + 1;
    localStorage.setItem('neon_ad_unlocks', JSON.stringify(bag));
    return bag[key];
  }

  playPurchaseAd(onDone) {
    if (this._adBusy) return;
    sounds.init();
    if (!window.showRewardedAd) {
      this.showToast(t('toast_ad_incomplete'), '#ff0055');
      return;
    }
    this._adBusy = true;
    window.showRewardedAd(
      () => {
        this._adBusy = false;
        onDone();
      },
      (err) => {
        this._adBusy = false;
        noteAdMiss(this, err);
      }
    );
  }

  getTechCatalog() {
    return [
      {
        id: 'damageBoost',
        icon: 'energy',
        name: t('tech_damageBoost_name'),
        desc: t('tech_damageBoost_desc'),
        scoreImpact: '+%12',
        maxLevel: 10,
        costs: [80, 220, 550, 1200, 2400, 4200, 7000, 11000, 17000, 26000],
        formatVal: (lvl) => `+${lvl * 6}%`
      },
      {
        id: 'shieldMax',
        icon: 'shield',
        name: t('tech_shieldMax_name'),
        desc: t('tech_shieldMax_desc'),
        scoreImpact: '+15s',
        maxLevel: 10,
        costs: [70, 180, 450, 1000, 2000, 3600, 6000, 9500, 15000, 22000],
        formatVal: (lvl) => `+${lvl * 12}`
      },
      {
        id: 'hullMax',
        icon: 'hull',
        name: t('tech_hullMax_name'),
        desc: t('tech_hullMax_desc'),
        scoreImpact: '+1',
        maxLevel: 10,
        costs: [60, 160, 400, 900, 1800, 3200, 5400, 8500, 13500, 20000],
        formatVal: (lvl) => `+${lvl * 15}`
      },
      {
        id: 'critChance',
        icon: 'target',
        name: t('tech_critChance_name'),
        desc: t('tech_critChance_desc'),
        scoreImpact: '+15%',
        maxLevel: 10,
        costs: [75, 190, 480, 1100, 2200, 3800, 6400, 10200, 16000, 24000],
        formatVal: (lvl) => `+${(lvl * 2.5).toFixed(1)}%`
      },
      {
        id: 'magnet',
        icon: 'magnet',
        name: t('tech_magnet_name'),
        desc: t('tech_magnet_desc'),
        scoreImpact: '+XP',
        maxLevel: 8,
        costs: [50, 140, 380, 850, 1700, 3000, 5200, 8200],
        formatVal: (lvl) => `+${lvl * 18}`
      },
      {
        id: 'reactorCharge',
        icon: 'speed',
        name: t('tech_reactorCharge_name'),
        desc: t('tech_reactorCharge_desc'),
        scoreImpact: '+OD',
        maxLevel: 6,
        costs: [110, 290, 750, 1700, 3500, 7000],
        formatVal: (lvl) => `+${lvl * 8}%`
      },
      {
        id: 'crystalBoost',
        icon: 'crystal',
        name: t('tech_crystalBoost_name'),
        desc: t('tech_crystalBoost_desc'),
        scoreImpact: '+CR',
        maxLevel: 8,
        costs: [120, 320, 850, 1900, 3800, 6800, 11000, 17500],
        formatVal: (lvl) => `+${lvl * 8}%`
      },
      {
        id: 'rerollCount',
        icon: 'dice',
        name: t('tech_rerollCount_name'),
        desc: t('tech_rerollCount_desc'),
        scoreImpact: '+Reroll',
        maxLevel: 4,
        costs: [200, 600, 1600, 4200],
        formatVal: (lvl) => `${lvl}`
      },
      {
        id: 'phoenix',
        icon: 'fire',
        name: t('tech_phoenix_name'),
        desc: t('tech_phoenix_desc'),
        scoreImpact: '+Revive',
        maxLevel: 3,
        costs: [850, 2800, 7500],
        formatVal: (lvl) => lvl >= 1 ? t('tech_tier_n', { n: lvl }) : t('tech_locked')
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
          if (this.isAdRank(i + 1, item.maxLevel)) continue;
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
      const nextRank = currentLvl + 1;
      const adRank = !isMaxed && this.isAdRank(nextRank, item.maxLevel);
      const nextCost = isMaxed ? 0 : item.costs[currentLvl];
      const canAfford = !adRank && this.totalCrystals >= nextCost && !isMaxed;

      const card = document.createElement('div');
      card.className = `tech-card ${isMaxed ? 'maxed' : ''}`;

      const levelPillText = isMaxed ? t('tech_max_level') : `${currentLvl} / ${item.maxLevel}`;
      let actionBtnHtml = '';

      if (isMaxed) {
        actionBtnHtml = `<button class="tech-buy-btn" disabled>${t('tech_completed')}</button>`;
      } else if (adRank) {
        actionBtnHtml = `<button class="tech-ad-rank-btn">${t('ad_rank_btn')}</button>`;
      } else if (canAfford) {
        actionBtnHtml = `<button class="tech-buy-btn">${t('tech_upgrade_cost', { c: nextCost })}</button>`;
      } else {
        const missing = nextCost - this.totalCrystals;
        actionBtnHtml = `<button class="tech-ad-boost-btn pulse" title="Ad +125 CR">${t('tech_missing_ad', { c: missing })}</button>`;
      }

      let notchesHtml = '<div class="tech-led-track">';
      for (let i = 1; i <= item.maxLevel; i++) {
        const gate = this.isAdRank(i, item.maxLevel) ? ' ad-gate' : '';
        notchesHtml += `<div class="tech-led-notch ${i <= currentLvl ? 'active' : ''}${gate}"></div>`;
      }
      notchesHtml += '</div>';

      const statDeltaText = isMaxed
        ? t('tech_max_cap', { v: item.formatVal(currentLvl) })
        : `${item.formatVal(currentLvl)} > ${item.formatVal(currentLvl + 1)}`;

      card.innerHTML = `
        <div class="tech-icon-frame">${getPixelIconSvg(item.icon, 'md')}</div>
        <div class="tech-info">
          <div class="tech-title-row">
            <span class="tech-name">${item.name}</span>
            <span class="tech-level-pill">${levelPillText}</span>
          </div>
          ${notchesHtml}
          <div class="tech-desc">${item.desc}</div>
          <div class="tech-stat-delta">${statDeltaText}</div>
        </div>
        ${actionBtnHtml}
      `;

      if (adRank) {
        const adRankBtn = card.querySelector('.tech-ad-rank-btn');
        if (adRankBtn) {
          adRankBtn.addEventListener('click', () => {
            this.playPurchaseAd(() => {
              this.techUpgrades[item.id] = (this.techUpgrades[item.id] || 0) + 1;
              this.saveTechUpgrades();
              sounds.playLevelUp();
              vibrate.success();
              this.renderTechUpgrades();
            });
          });
        }
      } else if (canAfford) {
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
              adBtn.textContent = 'REKLAM...';
              window.showRewardedAd(
                () => {
                  this.addGoldReward(125, true);
                  this.renderTechUpgrades();
                  this.showToast('[KRİSTAL] +125 Kristal Yüklendi!', '#05ffa1');
                },
                (err) => {
                  this.renderTechUpgrades();
                  noteAdMiss(this, err);
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
      this.updateAudioButtons();
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

    const btnToggleDevMode = document.getElementById('btn-toggle-dev-mode');
    const updateDevModeUI = () => {
      if (!btnToggleDevMode) return;
      if (this.devMode) {
        btnToggleDevMode.textContent = 'AÇIK';
        btnToggleDevMode.style.background = 'linear-gradient(135deg, rgba(5, 255, 161, 0.28), rgba(0, 240, 255, 0.2))';
        btnToggleDevMode.style.borderColor = '#05ffa1';
        btnToggleDevMode.style.color = '#05ffa1';
        btnToggleDevMode.style.boxShadow = '0 0 12px rgba(5, 255, 161, 0.45)';
      } else {
        btnToggleDevMode.textContent = 'KAPALI';
        btnToggleDevMode.style.background = 'rgba(255, 255, 255, 0.04)';
        btnToggleDevMode.style.borderColor = 'rgba(255, 190, 11, 0.4)';
        btnToggleDevMode.style.color = '#ffbe0b';
        btnToggleDevMode.style.boxShadow = 'none';
      }
    };
    this.updateDevModeUI = updateDevModeUI;
    updateDevModeUI();

    if (btnToggleDevMode) {
      btnToggleDevMode.addEventListener('click', () => {
        sounds.init();
        sounds.playCardSelect();
        vibrate.medium();
        this.toggleDevMode();
      });
    }

    const openSettings = () => {
      if (!settingsModal) return;
      renderLanguageGrid();
      updateSettingsToggles();
      updateDevModeUI();
      const host = document.getElementById('app-container') || document.body;
      host.appendChild(settingsModal);
      settingsModal.style.position = 'fixed';
      settingsModal.style.zIndex = '20000';
      settingsModal.style.inset = '0';
      if (this.state !== 'PAUSED') {
        try { history.pushState({ modal: 'settings' }, ''); } catch (e) {}
      }
      settingsModal.classList.remove('hidden');
      if (pauseModal && this.state === 'PAUSED') pauseModal.style.pointerEvents = 'none';
    };

    const closeSettings = () => {
      if (settingsModal) settingsModal.classList.add('hidden');
      if (pauseModal) pauseModal.style.pointerEvents = '';
    };

    if (btnSettingsMenu) btnSettingsMenu.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sounds.init();
      sounds.playCardSelect();
      openSettings();
    });
    if (btnPauseSettings) btnPauseSettings.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sounds.init();
      sounds.playCardSelect();
      openSettings();
    });
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
        if (saveCodeTitle) saveCodeTitle.textContent = txt('save_export_title');
        if (saveCodeDesc) saveCodeDesc.textContent = txt('settings_cloud_desc');
        if (saveCodeTextarea) {
          saveCodeTextarea.value = this.getExportSaveString();
          saveCodeTextarea.readOnly = true;
        }
        if (btnSaveCodeAction) btnSaveCodeAction.textContent = txt('save_copy_btn');
        if (saveCodeModal) saveCodeModal.classList.remove('hidden');
      });
    }

    if (btnImportSave) {
      btnImportSave.addEventListener('click', () => {
        sounds.playCardSelect();
        saveCodeMode = 'import';
        if (saveCodeTitle) saveCodeTitle.textContent = txt('save_import_title');
        if (saveCodeDesc) saveCodeDesc.textContent = txt('save_import_desc');
        if (saveCodeTextarea) {
          saveCodeTextarea.value = '';
          saveCodeTextarea.placeholder = 'NEON-SAVE-...-END kodunu buraya yapıştırın...';
          saveCodeTextarea.readOnly = false;
        }
        if (btnSaveCodeAction) btnSaveCodeAction.textContent = txt('save_load_btn');
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
            this.showToast(t('save_exported_toast') || 'Yedek kodu panoya kopyalandı!', '#00f0ff');
          } catch(e) {
            this.showToast('Metni manuel kopyalayabilirsiniz', '#00f0ff');
          }
        } else {
          const val = saveCodeTextarea ? saveCodeTextarea.value.trim() : '';
          const success = this.applyImportSaveString(val);
          if (success) {
            this.showToast(t('save_imported_toast') || 'İlerleme başarıyla geri yüklendi!', '#05ffa1');
            if (saveCodeModal) saveCodeModal.classList.add('hidden');
            if (settingsModal) settingsModal.classList.add('hidden');
          } else {
            this.showToast(t('save_invalid_toast') || '[HATA] Geçersiz yedekleme kodu!', '#ff0055');
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

  exportSaveCode() {
    return this.getExportSaveString();
  }

  importSaveCode(str) {
    return this.applyImportSaveString(str);
  }

  getExportSaveString() {
    const data = {
      v: 2,
      cr: parseInt(localStorage.getItem('neon_total_crystals') || '0', 10),
      lvl: parseInt(localStorage.getItem('neon_unlocked_level') || '1', 10),
      selLvl: parseInt(localStorage.getItem('neon_selected_level') || '1', 10),
      stars: localStorage.getItem('neon_level_stars') || '{}',
      cSc: parseInt(localStorage.getItem('neon_high_score_classic') || localStorage.getItem('neon_space_high_score') || '0', 10),
      sSc: parseInt(localStorage.getItem('neon_high_score_storm') || '0', 10),
      bSc: parseInt(localStorage.getItem('neon_high_score_bossRush') || '0', 10),
      skin: localStorage.getItem('neon_equipped_skin') || localStorage.getItem('neon_current_skin') || 'cyberpunk',
      uSkins: localStorage.getItem('neon_unlocked_skins') || '["cyberpunk"]',
      uTrails: localStorage.getItem('neon_unlocked_trails') || '["default"]',
      trail: localStorage.getItem('neon_equipped_trail') || 'default',
      pilot: localStorage.getItem('neon_flight_archetype') || localStorage.getItem('neon_current_pilot') || 'interceptor',
      uPilots: localStorage.getItem('neon_unlocked_pilots') || localStorage.getItem('neon_Unlocked_pilots') || '["interceptor"]',
      droneLvls: localStorage.getItem('neon_drone_levels') || '{"striker":0,"missile":0,"medic":0,"tesla":0,"clone":0}',
      eqDrone: localStorage.getItem('neon_equipped_drone') || '',
      strikerBought: localStorage.getItem('neon_drone_striker_bought') || '',
      tech: localStorage.getItem('neon_tech_upgrades') || '{}',
      tree: localStorage.getItem('neon_mastery') || localStorage.getItem('neon_mastery_tree') || '{}',
      trophies: localStorage.getItem('neon_trophies') || localStorage.getItem('neon_achievements') || '{}',
      codex: localStorage.getItem('neon_boss_codex') || '{}',
      wheel: localStorage.getItem('neon_wheel_state') || localStorage.getItem('neon_lucky_wheel') || '{}',
      callsign: localStorage.getItem('neon_player_callsign') || 'PILOT_ALPHA',
      country: localStorage.getItem('neon_player_country') || localStorage.getItem('neon_player_flag') || 'TUR',
      lang: localStorage.getItem('neon_language') || '',
      stats: localStorage.getItem('neon_pilot_stats') || '{}',
      streak: parseInt(localStorage.getItem('neon_daily_streak') || '0', 10),
      lastDate: localStorage.getItem('neon_daily_reward_date') || localStorage.getItem('neon_daily_last_date') || '',
      doubledDate: localStorage.getItem('neon_daily_doubled_date') || '',
      revives: parseInt(localStorage.getItem('neon_bonus_revives') || '0', 10),
      missions: localStorage.getItem('neon_daily_missions') || '[]',
      mDate: localStorage.getItem('neon_missions_date') || ''
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
      if (data.selLvl !== undefined) localStorage.setItem('neon_selected_level', data.selLvl.toString());
      if (data.stars) localStorage.setItem('neon_level_stars', typeof data.stars === 'string' ? data.stars : JSON.stringify(data.stars));
      if (data.cSc !== undefined) {
        localStorage.setItem('neon_high_score_classic', data.cSc.toString());
        localStorage.setItem('neon_space_high_score', data.cSc.toString());
      }
      if (data.sSc !== undefined) localStorage.setItem('neon_high_score_storm', data.sSc.toString());
      if (data.bSc !== undefined) localStorage.setItem('neon_high_score_bossRush', data.bSc.toString());
      if (data.skin) {
        localStorage.setItem('neon_equipped_skin', data.skin);
        localStorage.setItem('neon_current_skin', data.skin);
      }
      if (data.uSkins) localStorage.setItem('neon_unlocked_skins', typeof data.uSkins === 'string' ? data.uSkins : JSON.stringify(data.uSkins));
      if (data.uTrails) localStorage.setItem('neon_unlocked_trails', typeof data.uTrails === 'string' ? data.uTrails : JSON.stringify(data.uTrails));
      if (data.trail) localStorage.setItem('neon_equipped_trail', data.trail);
      if (data.pilot) {
        localStorage.setItem('neon_flight_archetype', data.pilot);
        localStorage.setItem('neon_current_pilot', data.pilot);
      }
      if (data.uPilots) {
        const uPilotsStr = typeof data.uPilots === 'string' ? data.uPilots : JSON.stringify(data.uPilots);
        localStorage.setItem('neon_unlocked_pilots', uPilotsStr);
        localStorage.setItem('neon_Unlocked_pilots', uPilotsStr);
      }
      if (data.droneLvls) localStorage.setItem('neon_drone_levels', typeof data.droneLvls === 'string' ? data.droneLvls : JSON.stringify(data.droneLvls));
      if (data.eqDrone !== undefined) {
        if (data.eqDrone) localStorage.setItem('neon_equipped_drone', data.eqDrone);
        else localStorage.removeItem('neon_equipped_drone');
      }
      if (data.strikerBought) localStorage.setItem('neon_drone_striker_bought', data.strikerBought);
      if (data.tech) localStorage.setItem('neon_tech_upgrades', typeof data.tech === 'string' ? data.tech : JSON.stringify(data.tech));
      if (data.tree) {
        const treeStr = typeof data.tree === 'string' ? data.tree : JSON.stringify(data.tree);
        localStorage.setItem('neon_mastery', treeStr);
        localStorage.setItem('neon_mastery_tree', treeStr);
      }
      if (data.trophies) {
        const trStr = typeof data.trophies === 'string' ? data.trophies : JSON.stringify(data.trophies);
        localStorage.setItem('neon_trophies', trStr);
        localStorage.setItem('neon_achievements', trStr);
      }
      if (data.codex) localStorage.setItem('neon_boss_codex', typeof data.codex === 'string' ? data.codex : JSON.stringify(data.codex));
      if (data.wheel) {
        const wStr = typeof data.wheel === 'string' ? data.wheel : JSON.stringify(data.wheel);
        localStorage.setItem('neon_wheel_state', wStr);
        localStorage.setItem('neon_lucky_wheel', wStr);
      }
      if (data.callsign) localStorage.setItem('neon_player_callsign', data.callsign);
      if (data.country) {
        localStorage.setItem('neon_player_country', data.country);
        localStorage.setItem('neon_player_flag', data.country);
      }
      if (data.lang) localStorage.setItem('neon_language', data.lang);
      if (data.stats) localStorage.setItem('neon_pilot_stats', typeof data.stats === 'string' ? data.stats : JSON.stringify(data.stats));
      if (data.streak !== undefined) localStorage.setItem('neon_daily_streak', data.streak.toString());
      if (data.lastDate !== undefined) {
        localStorage.setItem('neon_daily_reward_date', data.lastDate);
        localStorage.setItem('neon_daily_last_date', data.lastDate);
      }
      if (data.doubledDate !== undefined) localStorage.setItem('neon_daily_doubled_date', data.doubledDate);
      if (data.revives !== undefined) localStorage.setItem('neon_bonus_revives', data.revives.toString());
      if (data.missions) localStorage.setItem('neon_daily_missions', typeof data.missions === 'string' ? data.missions : JSON.stringify(data.missions));
      if (data.mDate) localStorage.setItem('neon_missions_date', data.mDate);

      this.totalCrystals = parseInt(localStorage.getItem('neon_total_crystals') || '0', 10);
      this.unlockedLevel = parseInt(localStorage.getItem('neon_unlocked_level') || '1', 10);
      this.selectedLevel = parseInt(localStorage.getItem('neon_selected_level') || '1', 10);
      try { this.levelStars = JSON.parse(localStorage.getItem('neon_level_stars') || '{}'); } catch(e) {}
      this.highScores = {
        classic: parseInt(localStorage.getItem('neon_high_score_classic') || localStorage.getItem('neon_space_high_score') || '0', 10),
        storm: parseInt(localStorage.getItem('neon_high_score_storm') || '0', 10)
      };
      this.currentSkinId = localStorage.getItem('neon_equipped_skin') || localStorage.getItem('neon_current_skin') || 'cyberpunk';
      try { this.unlockedSkins = JSON.parse(localStorage.getItem('neon_unlocked_skins') || '["cyberpunk"]'); } catch(e) {}
      try { this.unlockedTrails = JSON.parse(localStorage.getItem('neon_unlocked_trails') || '["default"]'); } catch(e) {}
      this.equippedTrailId = localStorage.getItem('neon_equipped_trail') || 'default';
      this.activeArchetype = localStorage.getItem('neon_flight_archetype') || localStorage.getItem('neon_current_pilot') || 'interceptor';
      try { this.unlockedPilots = JSON.parse(localStorage.getItem('neon_unlocked_pilots') || '["interceptor"]'); } catch(e) {}
      try { this.droneLevels = JSON.parse(localStorage.getItem('neon_drone_levels') || '{"striker":0,"missile":0,"medic":0,"tesla":0,"clone":0}'); } catch(e) {}
      this.equippedDroneId = localStorage.getItem('neon_equipped_drone') || null;
      this.techUpgrades = this.loadTechUpgrades();
      try {
        this.masteryTree = JSON.parse(localStorage.getItem('neon_mastery') || 'null') || {
          magnet: 0, critDmg: 0, startShield: 0, xpBonus: 0, crystalBonus: 0, rerollStart: 0
        };
      } catch(e) {}
      try { this.trophies = JSON.parse(localStorage.getItem('neon_trophies') || '{}'); } catch(e) {}
      this.pilotStats = this.loadPilotStats();
      this.playerCallsign = localStorage.getItem('neon_player_callsign') || 'PILOT_ALPHA';
      this.playerCountry = localStorage.getItem('neon_player_country') || 'TUR';
      this.initMissions();

      this.updateCrystalsDisplay();
      this.updateHighScoreDisplay();
      this.updateLevelDisplay();
      if (this.updateMenuShipPreview) this.updateMenuShipPreview();
      if (this.updatePilotRankDisplay) this.updatePilotRankDisplay();
      if (this.renderHangarSkins) this.renderHangarSkins();
      if (this.renderHangarTrails) this.renderHangarTrails();
      if (this.renderHangarDrones) this.renderHangarDrones();
      if (this.renderTechUpgrades) this.renderTechUpgrades();
      if (this.renderMasteryTree) this.renderMasteryTree();
      if (this.renderTrophies) this.renderTrophies();
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
      setTimeout(() => this.dismissTutorial(), 9000);
    }
  }

  checkDailyMissionsReset() {
    return this.initMissions();
  }

  initMissions() {
    const today = this.getLocalTodayStr();
    const savedDate = localStorage.getItem('neon_missions_date');
    const savedMissions = localStorage.getItem('neon_daily_missions');

    const poolMap = {
      kill_asteroids: { goal: 120, reward: 40, desc: '120 adet meteor yok et' },
      collect_crystals: { goal: 300, reward: 45, desc: '300 kristal topla' },
      survive_time: { goal: 120, reward: 50, desc: 'Tek oyunda 120 saniye dayan' },
      reach_combo: { goal: 30, reward: 45, desc: '30x veya üzeri kombo yap' },
      defeat_boss: { goal: 2, reward: 60, desc: '2 Amiral Boss yok et' },
      detonate_bomb: { goal: 15, reward: 45, desc: '15 bomba asteroid patlat' }
    };

    if (savedDate === today && savedMissions) {
      try {
        this.dailyMissions = JSON.parse(savedMissions);
        if (Array.isArray(this.dailyMissions)) {
          this.dailyMissions.forEach(m => {
            if (poolMap[m.id]) {
              m.goal = poolMap[m.id].goal;
              m.reward = poolMap[m.id].reward;
              m.desc = poolMap[m.id].desc;
            }
          });
          localStorage.setItem('neon_daily_missions', JSON.stringify(this.dailyMissions));
        }
      } catch (e) {
        this.dailyMissions = null;
      }
    }

    if (!this.dailyMissions || this.dailyMissions.length === 0) {
      const pool = [
        { id: 'kill_asteroids', icon: 'target', name: 'Asteroit Avcısı', desc: '120 adet meteor yok et', goal: 120, progress: 0, reward: 40, claimed: false },
        { id: 'collect_crystals', icon: 'crystal', name: 'Kristal Madencisi', desc: '300 kristal topla', goal: 300, progress: 0, reward: 45, claimed: false },
        { id: 'survive_time', icon: 'speed', name: 'Hayatta Kalan', desc: 'Tek oyunda 120 saniye dayan', goal: 120, progress: 0, reward: 50, claimed: false },
        { id: 'reach_combo', icon: 'energy', name: 'Kombo Ustası', desc: '30x veya üzeri kombo yap', goal: 30, progress: 0, reward: 45, claimed: false },
        { id: 'defeat_boss', icon: 'skull', name: 'Amiral Avcısı', desc: '2 Amiral Boss yok et', goal: 2, progress: 0, reward: 60, claimed: false },
        { id: 'detonate_bomb', icon: 'bomb', name: 'Patlayıcı Uzmanı', desc: '15 bomba asteroid patlat', goal: 15, progress: 0, reward: 45, claimed: false }
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
    if (this.updateDockActiveTab) this.updateDockActiveTab(1);
  }

  closeMissions() {
    if (missionsModal) missionsModal.classList.add('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(2);
  }

  renderMissions() {
    if (!missionsContainer || !this.dailyMissions) return;
    missionsContainer.innerHTML = '';

    this.dailyMissions.forEach(m => {
      const isCompleted = m.progress >= m.goal;
      const percent = Math.min(100, Math.round((m.progress / m.goal) * 100));

      const item = document.createElement('div');
      item.className = `mission-item ${isCompleted ? 'completed' : ''}`;

      const mName = t('mission_' + m.id + '_name') || m.name;
      const mDesc = t('mission_' + m.id + '_desc') || m.desc;

      let btnHtml = '';
      if (m.claimed) {
        btnHtml = `<button class="btn-mission-claim" disabled>${t('mission_claimed')}</button>`;
      } else if (isCompleted) {
        btnHtml = `<button class="btn-mission-claim">${(t('mission_claim') || 'CLAIM +{n} CR').replace('{n}', m.reward)}</button>`;
      } else {
        btnHtml = `<button class="btn-mission-claim" disabled>${m.progress}/${m.goal}</button>`;
      }

      const iconKey = (!m.icon || m.icon === '??' || m.icon === 'asteroid') ? 'target' : (m.icon === 'clock' || m.icon === 'time' ? 'speed' : m.icon);
      const iconSvg = getPixelIconSvg(iconKey, 'md') || getPixelIconSvg('target', 'md');

      item.innerHTML = `
        <div class="mission-top">
          <div class="mission-title-group">
            <span class="mission-icon">${iconSvg}</span>
            <div>
              <div class="mission-name">${mName}</div>
              <div class="mission-desc">${mDesc}</div>
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
      this.updateTrophiesBadge();
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
    if (this.updateDockActiveTab) this.updateDockActiveTab(2);
  }

  setMode(mode) {
    this.currentMode = mode;
    localStorage.setItem('neon_current_mode', mode);
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
    if (modeClassic && modeStorm) {
      if (this.currentMode === 'classic') {
        modeClassic.classList.add('active');
        modeStorm.classList.remove('active');
      } else {
        modeClassic.classList.remove('active');
        modeStorm.classList.add('active');
      }
    }
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

    // 10 bant. Bölüm 1 öğrenme uçuşu. 38 hâlâ tırmanır, 25 kat duvar değil.
    const difficultyBands = [
      { hp: 1.00, spd: 1.00, dmg: 1.00 },
      { hp: 1.18, spd: 1.00, dmg: 1.04 },
      { hp: 1.40, spd: 1.02, dmg: 1.10 },
      { hp: 1.70, spd: 1.04, dmg: 1.18 },
      { hp: 2.10, spd: 1.07, dmg: 1.28 },
      { hp: 2.60, spd: 1.10, dmg: 1.40 },
      { hp: 3.30, spd: 1.14, dmg: 1.55 },
      { hp: 4.20, spd: 1.18, dmg: 1.75 },
      { hp: 5.40, spd: 1.22, dmg: 2.00 },
      { hp: 8.20, spd: 1.28, dmg: 2.35 }
    ];
    const bandIndex = lvl <= 1 ? 0 : lvl <= 4 ? 1 : lvl <= 8 ? 2 : lvl <= 12 ? 3 : lvl <= 16 ? 4 : lvl <= 20 ? 5 : lvl <= 25 ? 6 : lvl <= 30 ? 7 : lvl <= 34 ? 8 : 9;
    const band = difficultyBands[bandIndex];
    const step = ((lvl - 1) % 4) * (bandIndex >= 7 ? 0.12 : 0.05);
    const hpMult = band.hp + step;
    const speedMult = band.spd;
    const enemyDmgMult = band.dmg;

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
    if (scoreValClassic) scoreValClassic.textContent = t('mode_classic_stage', { n: lvl });
    if (modeStageDesc) modeStageDesc.textContent = t('mode_classic_desc', { n: lvl });
    if (levelDisplayCard) levelDisplayCard.textContent = t('mode_classic_stage', { n: lvl });
    if (levelHudDisplay) levelHudDisplay.textContent = t('hud_stage_short', { n: lvl });
  }

  triggerLevelVictory() {
    const completedLevel = this.selectedLevel || 1;
    sounds.playJackpot();
    sounds.playLevelUp();
    sounds.playWarpDrive();
    vibrate.success();

    const lvlCfg = this.getLevelConfig(completedLevel);

    // Yıldız Hesabı (Kalan Can Yüzdesine Göre)
    const hpPct = Math.max(0, this.player.hp / this.player.maxHp);
    let stars = 1;
    if (hpPct >= 0.70) {
      stars = 3;
    } else if (hpPct >= 0.35) {
      stars = 2;
    }

    const prevStars = this.levelStars[completedLevel] || 0;
    const isFirstClear = !prevStars;
    this.levelStars[completedLevel] = Math.max(prevStars, stars);
    localStorage.setItem('neon_level_stars', JSON.stringify(this.levelStars));

    if (this.pilotStats) {
      this.pilotStats.levelsCompleted = Math.max(
        (this.pilotStats.levelsCompleted || 0) + 1,
        Object.keys(this.levelStars).length
      );
      this.savePilotStats();
    }

    // Kristal Ganimeti (Ustalık Ağacı Kristal Bonusu Dahil)
    const crystalBonusMult = 1 + (this.masteryTree?.crystalBonus || 0) * 0.10;
    const baseReward = isFirstClear ? lvlCfg.reward : Math.round(lvlCfg.reward * 0.35);
    const rewardCrystals = Math.round(baseReward * crystalBonusMult);
    this.lastVictoryReward = rewardCrystals;
    this.victoryAdUsed = false;
    this.totalCrystals += rewardCrystals;
    this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + rewardCrystals;
    if (this.pilotStats) {
      this.pilotStats.lifetimeCrystals += rewardCrystals;
      this.savePilotStats();
    }
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    this.updateCrystalsDisplay();

    // Bir sonraki seviye kilidini aç ve aktif seviyeyi ilerlet
    if (completedLevel >= this.unlockedLevel && this.unlockedLevel < 38) {
      this.unlockedLevel = Math.min(38, completedLevel + 1);
      localStorage.setItem('neon_unlocked_level', this.unlockedLevel.toString());
    }

    // Sefer Sonu (Bölüm 38 Tamamlandıysa)
    if (completedLevel >= 38) {
      this.clearSuspendedRun();
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
        btnVictoryDouble.textContent = txt('go_victory_double');
      }
      const btnNextLvl = document.getElementById('btn-next-level');
      if (btnNextLvl) {
        btnNextLvl.innerHTML = `${getPixelIconSvg('crown', 'sm')} <span>SEFER TAMAMLANDI</span>`;
      }
      if (levelCompleteModal) levelCompleteModal.classList.remove('hidden');
      if (victoryTitle) victoryTitle.textContent = `TÜM SEFER TAMAMLANDI!`;
      if (victorySubtitle) victorySubtitle.textContent = `Efsanevi Amiral Zaferi`;
      this.particles.startWarp(180);
      return;
    }

    const btnNextLvl = document.getElementById('btn-next-level');
    if (btnNextLvl) {
      btnNextLvl.textContent = t('victory_next') || 'SONRAKİ BÖLÜM';
    }

    this.selectedLevel = Math.min(38, completedLevel + 1);
    localStorage.setItem('neon_selected_level', this.selectedLevel.toString());
    this.updateLevelDisplay();

    // Açık kart, sandık veya kaçakçı modalı varsa kapat ki rota seçimi çakışmasın
    this.isMerchantActive = false;
    this.modalTransition = null;
    this.resumeRampTimer = 0;
    if (typeof levelModal !== 'undefined' && levelModal) levelModal.classList.add('hidden');
    if (typeof luckyChestModal !== 'undefined' && luckyChestModal) luckyChestModal.classList.add('hidden');
    if (typeof merchantModal !== 'undefined' && merchantModal) merchantModal.classList.add('hidden');

    // Bölüm Sonu Taktiksel Rota Seçimi (Route Choice - Roguelite Seçimi)
    this.showRouteSelection(completedLevel, rewardCrystals);
  }

  showRouteSelection(completedLevel, rewardCrystals) {
    if (!routeModal || !routeChoicesContainer) {
      this.applyRouteTransition(completedLevel, rewardCrystals, 'safe');
      return;
    }

    this.state = 'ROUTE_SELECT';
    this.writeSuspendSnapshot();
    routeChoicesContainer.innerHTML = '';

    const routes = [
      {
        id: 'safe',
        title: 'GÜVENLİ ROTA',
        desc: 'Standart düşman dalgaları & +%40 Kalkan/Gövde Onarımı',
        icon: 'shield',
        border: '#05ffa1',
        rewardText: 'Normal Ganimet'
      },
      {
        id: 'asteroid',
        title: 'ASTEROİT KUŞAĞI',
        desc: 'Yoğun altın asteroitler & +%50 Ekstra Kristal Ganimeti',
        icon: 'crystal',
        border: '#ffbe0b',
        rewardText: '+%50 KR Ganimeti'
      },
      {
        id: 'elite',
        title: 'ELİT KARAKOL',
        desc: 'Agresif elit düşmanlar, Tamir yok & 2X ÇİFTE GANİMET',
        icon: 'sword',
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
        <div style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">${getPixelIconSvg(r.icon, 'lg')}</div>
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
    this.startSmoothResume(34);
    this.routeModifier = routeType;

    // Yeni bölüm yapılandırması
    const nextCfg = this.getLevelConfig(this.selectedLevel);

    // Görsel Şölen ve Hipersürüş Bildirimi
    this.particles.spawnShockwave(this.width / 2, this.height * 0.45, '#ffd700', 380);
    this.particles.spawnShockwave(this.width / 2, this.height * 0.45, '#00f0ff', 280);
    this.particles.spawnFloatingText(this.width / 2, this.height * 0.32, t('level_cleared', { n: completedLevel, cr: rewardCrystals }), '#ffd700', 18);
    this.particles.spawnFloatingText(this.width / 2, this.height * 0.38, t('level_next', { n: this.selectedLevel }), '#00f0ff', 16);
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
      const bonusRouteCr = Math.round(rewardCrystals * 0.5);
      this.totalCrystals += bonusRouteCr;
      this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + bonusRouteCr;
      localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
      this.updateCrystalsDisplay();
    } else if (routeType === 'elite') {
      // Elit rota: Tamir yok, ama 2 kat ganimet çarpanı
      this.player.crystalMultiplier = (this.player.crystalMultiplier || 1.0) * 1.5;
    }

    // Kalan düşman mermilerini ve tehlikeleri temizle
    this.enemyProjectiles = [];
    this.telegraphs = [];
    this.activeBeams = [];
    this.activeEvent = null;
    if (typeof eventBanner !== 'undefined' && eventBanner) eventBanner.classList.add('hidden');
    if (typeof bossWarningOverlay !== 'undefined' && bossWarningOverlay) bossWarningOverlay.classList.add('hidden');

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
    this.nextEventTime = 35;
    this.intermissionEvents = {
      goldRush: false,
      merchantVisit: false,
      swarmStrike: false,
      cruiserRaid: false,
      hazardCore: false,
      eliteDuel: false
    };

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

    const flameColor = skin.flame || skin.primary || '#00f0ff';
    const visualEl = document.getElementById('menu-ship-visual');
    if (visualEl) {
      visualEl.innerHTML = `
        <div class="ship-pixel-wrapper">
          ${getShipPixelSvg(skin.id, 64)}
          <div class="pixel-thruster-flame" style="--flame-color: ${flameColor};"></div>
        </div>
      `;
    }

    if (menuShipName) menuShipName.textContent = t(`ship_${skin.id}_name`);
    const shipClassEl = document.getElementById('menu-ship-class');
    if (shipClassEl) shipClassEl.textContent = t(`ship_${skin.id}_title`);

    const perkTitleEl = document.getElementById('menu-ship-perk-title');
    if (perkTitleEl) perkTitleEl.textContent = t(`ship_${skin.id}_perk_title`);
    if (menuShipPerk) menuShipPerk.textContent = t(`ship_${skin.id}_perk_desc`);

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

    // Canlı Menü Aksiyon Butonu Güncellemesi
    if (btnMenuShipAction && menuShipActionText) {
      if (isEquipped) {
        btnMenuShipAction.className = 'menu-ship-action-btn btn-menu-equipped';
        menuShipActionText.innerHTML = `${getPixelIconSvg('check', 'sm')} <span>${t('status_equipped') || 'AKTİF KUŞANILDI'}</span>`;
      } else if (isUnlocked) {
        btnMenuShipAction.className = 'menu-ship-action-btn btn-menu-equip';
        menuShipActionText.innerHTML = `${getPixelIconSvg('energy', 'sm')} <span>${t('btn_equip') || 'KUŞAN'}</span>`;
      } else {
        const canAfford = this.totalCrystals >= skin.cost;
        const buyLabel = t('btn_buy_ship', { c: skin.cost.toLocaleString() }) || `${skin.cost.toLocaleString()} CR SATIN AL`;
        if (canAfford) {
          btnMenuShipAction.className = 'menu-ship-action-btn btn-menu-buy';
          menuShipActionText.innerHTML = `${getPixelIconSvg('crystal', 'sm')} <span>${buyLabel}</span>`;
        } else {
          btnMenuShipAction.className = 'menu-ship-action-btn btn-menu-cannot-afford';
          menuShipActionText.innerHTML = `${getPixelIconSvg('lock', 'sm')} <span>${buyLabel}</span>`;
        }
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
    this.handleMenuShipAction();
  }

  handleMenuShipAction() {
    sounds.init();
    const skinId = this.skinOrder[this.menuSkinIndex];
    const skin = this.skins[skinId] || this.skins.cyberpunk;
    const isUnlocked = this.unlockedSkins.includes(skin.id);
    const isEquipped = this.currentSkinId === skin.id;

    if (isEquipped) {
      // Zaten kuşanılmış, hafif geri bildirim
      vibrate.light();
      this.showToast(t('toast_ship_already', { name: t('ship_' + skin.id + '_name') }), skin.primary || '#05ffa1');
      return;
    }

    if (isUnlocked) {
      // Kilidi açık, anında kuşan
      this.currentSkinId = skin.id;
      localStorage.setItem('neon_equipped_skin', skin.id);
      sounds.playCardSelect();
      vibrate.light();
      this.showToast(t('toast_ship_on', { name: t('ship_' + skin.id + '_name') }), skin.primary || '#00f0ff');
      this.updateMenuShipPreview();
      if (this.renderHangarSkins) this.renderHangarSkins();
      return;
    }

    // Kilitli: Satın alma kontrolü
    if (this.totalCrystals >= skin.cost) {
      const cost = skin.cost;
      this.totalCrystals -= cost;
      localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
      this.unlockedSkins.push(skin.id);
      localStorage.setItem('neon_unlocked_skins', JSON.stringify(this.unlockedSkins));
      this.currentSkinId = skin.id;
      localStorage.setItem('neon_equipped_skin', skin.id);

      // Kristal / Altın harcama patlama efekti
      const targetBtn = btnMenuShipAction || menuShipCard;
      if (targetBtn && this.triggerSpendingEffect) {
        this.triggerSpendingEffect(targetBtn, cost, 'KRİSTAL');
      }

      sounds.playLevelUp();
      this.showToast(t('toast_ship_bought', { name: t('ship_' + skin.id + '_name') }), '#ffd700');
      this.updateCrystalsDisplay();

      setTimeout(() => {
        this.updateMenuShipPreview();
        if (this.renderHangarSkins) this.renderHangarSkins();
      }, 300);
    } else {
      vibrate.medium();
      const diff = skin.cost - this.totalCrystals;
      this.showToast(t('toast_short_cr', { n: diff.toLocaleString() }), '#ff0055');
      // Kullanıcı isterse hangara gidip diğer geliştirmelerine bakabilsin
      this.openHangar(skin.id);
    }
  }

  getLocalTodayStr(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getWheelTodayStr() {
    return this.getLocalTodayStr();
  }

  getDailyStreakInfo() {
    const today = this.getLocalTodayStr();
    const lastClaimed = localStorage.getItem('neon_daily_reward_date');
    let streak = parseInt(localStorage.getItem('neon_daily_streak') || '0', 10);
    const hasDoubledToday = localStorage.getItem('neon_daily_doubled_date') === today;

    if (!lastClaimed) {
      return { streak: 1, isClaimed: false, canClaim: true, canDouble: false, hasDoubled: false };
    }

    if (lastClaimed === today) {
      return { 
        streak: Math.max(1, streak), 
        isClaimed: true, 
        canClaim: false, 
        canDouble: !hasDoubledToday, 
        hasDoubled: hasDoubledToday 
      };
    }

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = this.getLocalTodayStr(yesterdayDate);

    if (lastClaimed === yesterdayStr) {
      // Dün girilmiş, seri devam ediyor
      const nextStreak = (streak % 7) + 1;
      return { streak: nextStreak, isClaimed: false, canClaim: true, canDouble: false, hasDoubled: false };
    } else {
      // 1 günden fazla ara verilmiş, seri sıfırlandı
      return { streak: 1, isClaimed: false, canClaim: true, canDouble: false, hasDoubled: false };
    }
  }

  checkDailyReward() {
    const info = this.getDailyStreakInfo();
    const canDoSomething = info.canClaim || info.canDouble;
    if (dailyRewardDot) {
      if (canDoSomething) {
        dailyRewardDot.classList.remove('hidden');
      } else {
        dailyRewardDot.classList.add('hidden');
      }
    }
    return canDoSomething;
  }

  openDailyRewardModal() {
    const alreadyOpen = dailyRewardModal && !dailyRewardModal.classList.contains('hidden');
    if (!alreadyOpen) {
      try { history.pushState({ modal: 'daily_reward' }, ''); } catch(e) {}
    }
    const info = this.getDailyStreakInfo();
    const rewards = [
      { day: 1, crystals: 100 },
      { day: 2, crystals: 180 },
      { day: 3, crystals: 280 },
      { day: 4, crystals: 420 },
      { day: 5, crystals: 600 },
      { day: 6, crystals: 850 },
      { day: 7, crystals: 1250 }
    ].map((r) => ({ ...r, label: r.day === 7 ? t('daily_day_max', { n: r.day }) : t('daily_day', { n: r.day }) }));

    const currentReward = rewards[info.streak - 1] || rewards[0];

    const streakBadge = document.getElementById('daily-streak-badge');
    if (streakBadge) {
      if (info.isClaimed) {
        if (info.canDouble) {
          streakBadge.textContent = t('daily_badge_double', { n: info.streak });
          streakBadge.style.color = '#00f0ff';
        } else {
          streakBadge.textContent = t('daily_badge_claimed', { n: info.streak });
          streakBadge.style.color = '#05ffa1';
        }
      } else {
        streakBadge.textContent = t('daily_badge_ready', { n: info.streak });
        streakBadge.style.color = '#ffbe0b';
      }
    }

    const grid = document.getElementById('daily-streak-grid');
    if (grid) {
      grid.innerHTML = '';
      rewards.forEach((r) => {
        const card = document.createElement('div');
        const isDay7 = (r.day === 7);
        let statusClass = '';
        let statusText = t('daily_locked_status');
        const isCurrentDay = (r.day === info.streak);

        if (r.day < info.streak || (isCurrentDay && info.isClaimed)) {
          statusClass = 'completed';
          statusText = info.hasDoubled && isCurrentDay ? t('daily_claimed_2x') : t('daily_claimed_status');
        } else if (isCurrentDay && !info.isClaimed) {
          statusClass = 'active';
          statusText = t('daily_tap_claim');
        }

        card.className = `streak-day-card ${isDay7 ? 'day-7' : ''} ${statusClass}`;
        
        let rewardDisplay = `+${r.crystals} CR`;
        if (isCurrentDay && info.isClaimed && info.hasDoubled) {
          rewardDisplay = `+${r.crystals * 2} CR`;
        }

        card.innerHTML = `
          <div class="streak-day-label">${r.label}</div>
          <div class="streak-day-icon" style="margin: 4px auto; display: flex; align-items: center; justify-content: center;">
            ${isDay7 ? getPixelIconSvg('crown', 'lg') : getPixelIconSvg('crystal', 'md')}
          </div>
          <div class="streak-day-reward">${rewardDisplay}</div>
          <div class="streak-day-status">${statusText}</div>
        `;

        // Günün kartına doğrudan tıklama: 1x temel ödülü verir
        if (isCurrentDay && !info.isClaimed) {
          card.style.cursor = 'pointer';
          card.title = `Dokun ve +${r.crystals} CR Al!`;
          card.onclick = (e) => {
            e.stopPropagation();
            this.claimDailyRewardBase();
          };
        } else if (isCurrentDay && info.canDouble) {
          card.style.cursor = 'pointer';
          card.title = `Reklam İzle ve +${r.crystals} CR Katla!`;
          card.onclick = (e) => {
            e.stopPropagation();
            this.claimDailyRewardWithAd();
          };
        }

        grid.appendChild(card);
      });
    }

    if (btnClaimDaily) {
      if (!info.isClaimed) {
        // Durum 1: Henüz hiçbir şey alınmadı -> 2X ödül için reklam izle
        btnClaimDaily.disabled = false;
        btnClaimDaily.innerHTML = `
          <svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12"><polygon points="3,2 10,6 3,10" fill="#030816"/></svg>
          ${t('daily_watch_2x', { n: currentReward.crystals * 2 })}
        `;
        btnClaimDaily.style.opacity = '1';
        btnClaimDaily.classList.add('pulse');
      } else if (info.canDouble) {
        // Durum 2: Temel ödül alındı, ama 2X reklam hakkı halen duruyor -> Kalan 1X için reklam izle
        btnClaimDaily.disabled = false;
        btnClaimDaily.innerHTML = `
          <svg class="pixel-icon pixel-icon-sm" viewBox="0 0 12 12"><polygon points="3,2 10,6 3,10" fill="#030816"/></svg>
          ${t('daily_watch_fold', { n: currentReward.crystals })}
        `;
        btnClaimDaily.style.opacity = '1';
        btnClaimDaily.classList.add('pulse');
      } else {
        // Durum 3: Bugünün ödülü tamamen alındı (2X dahil)
        btnClaimDaily.disabled = true;
        btnClaimDaily.textContent = t('daily_done', { n: info.streak });
        btnClaimDaily.style.opacity = '0.6';
        btnClaimDaily.classList.remove('pulse');
      }
    }
    if (dailyRewardModal) dailyRewardModal.classList.remove('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(3);
  }

  // 1. Temel Ödülü Doğrudan Al (Günün kutusuna basınca)
  claimDailyRewardBase() {
    sounds.init();
    const today = this.getLocalTodayStr();
    const info = this.getDailyStreakInfo();
    if (info.isClaimed) return;

    const rewards = [100, 180, 280, 420, 600, 850, 1250];
    const baseGain = rewards[info.streak - 1] || 100;

    this.totalCrystals += baseGain;
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    localStorage.setItem('neon_daily_reward_date', today);
    localStorage.setItem('neon_daily_streak', info.streak.toString());

    sounds.playLevelUp();
    vibrate.success();
    this.particles.spawnExplosion(this.width / 2, this.height * 0.45, '#05ffa1', 25, 4);
    this.updateCrystalsDisplay();
    this.checkDailyReward();
    this.showToast(t('toast_daily_claimed', { d: info.streak, n: baseGain }), '#05ffa1');
    this.openDailyRewardModal();
  }

  // 2. Reklam İzleyerek Ödülü Al / Katla (Yeşil Butona basınca)
  claimDailyRewardWithAd() {
    sounds.init();
    const info = this.getDailyStreakInfo();
    const rewards = [100, 180, 280, 420, 600, 850, 1250];
    const baseGain = rewards[info.streak - 1] || 100;

    // Reklamla verilecek kazanç miktarı:
    // Eğer temel ödül hiç alınmadıysa: 2x (örn: 360 CR)
    // Eğer temel ödül zaten alındıysa: kalan 1x (örn: 180 CR)
    const adGain = !info.isClaimed ? (baseGain * 2) : baseGain;

    if (info.isClaimed && !info.canDouble) {
      this.showToast(t('toast_daily_already'), '#ffbe0b');
      return;
    }

    if (btnClaimDaily) {
      btnClaimDaily.disabled = true;
      btnClaimDaily.textContent = t('daily_ad_loading');
    }

    if (window.showRewardedAd) {
      window.showRewardedAd(
        (reward) => {
          // Reklam başarıyla izlendi
          this.executeAdDailyReward(adGain, info);
        },
        (err) => {
          console.warn('Günlük ikmal reklamı tamamlanmadı:', err);
          if (btnClaimDaily) {
            btnClaimDaily.disabled = false;
          }
          this.openDailyRewardModal();
          noteAdMiss(this, err);
          vibrate.medium();
        }
      );
    } else {
      // Reklam desteği olmayan ortamda doğrudan ödülü ver
      this.executeAdDailyReward(adGain, info);
    }
  }

  executeAdDailyReward(gain, info) {
    const today = this.getLocalTodayStr();
    this.totalCrystals += gain;
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    localStorage.setItem('neon_daily_reward_date', today);
    localStorage.setItem('neon_daily_streak', info.streak.toString());
    localStorage.setItem('neon_daily_doubled_date', today);

    sounds.playLevelUp();
    vibrate.success();
    this.particles.spawnExplosion(this.width / 2, this.height * 0.45, '#ffd700', 35, 5);
    this.updateCrystalsDisplay();
    this.checkDailyReward();
    this.showToast(t('toast_reward_cr', { n: gain }), '#ffd700');
    this.openDailyRewardModal();

    setTimeout(() => {
      if (dailyRewardModal) dailyRewardModal.classList.add('hidden');
    }, 1400);
  }

  // === KUANTUM REAKTÖRÜ (QUANTUM CORE) MOTORU ===
  initLuckyWheel() {
    this.wheelSectors = [
      { label: '+100 CR', value: 100, type: 'crystals', color: '#00f0ff', glow: '#00f0ff', text: '#ffffff' },
      { label: t('wheel_slice_revive'), value: 1, type: 'revive', color: '#ff0055', glow: '#ff0055', text: '#ffffff' },
      { label: '+200 CR', value: 200, type: 'crystals', color: '#ffbe0b', glow: '#ffbe0b', text: '#ffffff' },
      { label: t('wheel_slice_shield'), value: 1, type: 'shield', color: '#38bdf8', glow: '#38bdf8', text: '#ffffff' },
      { label: '500 CR', value: 500, type: 'crystals', color: '#ffd700', glow: '#ffd700', text: '#ffd700' },
      { label: '+75 CR', value: 75, type: 'crystals', color: '#94a3b8', glow: '#94a3b8', text: '#ffffff' },
      { label: '+150 CR', value: 150, type: 'crystals', color: '#05ffa1', glow: '#05ffa1', text: '#ffffff' },
      { label: t('wheel_slice_overdrive'), value: 1, type: 'overdrive', color: '#c084fc', glow: '#c084fc', text: '#ffffff' }
    ];
    this.wheelRotation = 0;
    this.wheelIsSpinning = false;
    this.setupLuckyWheelSwipe();
    this.drawLuckyWheel();
    this.updateWheelBadge();
  }

  setupLuckyWheelSwipe() {
    const canvas = document.getElementById('lucky-wheel-canvas');
    if (!canvas || this._wheelSwipeBound) return;
    this._wheelSwipeBound = true;

    let isTouching = false;
    let startY = 0;
    let startX = 0;
    let lastY = 0;
    let lastTime = 0;
    let velocityY = 0;
    let dragDistance = 0;

    const onStart = (e) => {
      if (this.wheelIsSpinning) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      isTouching = true;
      startX = clientX;
      startY = clientY;
      lastY = clientY;
      lastTime = performance.now();
      velocityY = 0;
      dragDistance = 0;
      canvas.classList.add('is-dragging');
    };

    const onMove = (e) => {
      if (!isTouching || this.wheelIsSpinning) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dy = clientY - lastY;

      velocityY = (dy / dt) * 16.6;
      lastY = clientY;
      lastTime = now;
      dragDistance += Math.abs(dy);

      // Çarkı el hareketiyle canlı döndür (Aşağı çekildiğinde saat yönünde dönüş)
      const rect = canvas.getBoundingClientRect();
      const centerOffsetX = clientX - (rect.left + rect.width / 2);
      // Parmağın bulunduğu tarafa göre doğal açısal tepki veya genel dikey sürükleme hissi
      const rotDelta = (dy / 70) * (centerOffsetX < 0 ? -1 : 1);
      this.wheelRotation += (Math.abs(rotDelta) > 0.005 ? rotDelta : (dy / 90));
      this.drawLuckyWheel();

      // Hafif direnç hissi için tık sesi
      if (Math.abs(dy) > 18) {
        vibrate.light();
      }

      if (e.cancelable) e.preventDefault();
    };

    const onEnd = (e) => {
      if (!isTouching) return;
      isTouching = false;
      canvas.classList.remove('is-dragging');
      if (this.wheelIsSpinning) return;

      const totalDy = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - startY;
      const isStrongSwipe = velocityY > 7 || totalDy > 40 || dragDistance > 60;

      if (isStrongSwipe) {
        // Doğal aşağı kaydırma ile çarkı fırlat!
        vibrate.medium();
        sounds.playCardSelect();
        this.handleWheelSpinClick();
      } else {
        // Yetersiz çekim ise çarkı hafifçe en yakın dilime hizala
        this.drawLuckyWheel();
      }
    };

    canvas.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('touchcancel', onEnd, { passive: true });

    // Masaüstü fare sürükleme desteği
    canvas.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
  }

  getWheelState() {
    const today = this.getWheelTodayStr();
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
    if (wheelModal) {
      const card = wheelModal.querySelector('.wheel-card');
      const targetBtn = document.getElementById('btn-lucky-wheel');
      if (card) {
        card.classList.remove('wheel-shrink-to-icon', 'wheel-pop-in', 'wheel-pop-out');
      }
      wheelModal.classList.remove('hidden');
      if (card && targetBtn) {
        const cardRect = card.getBoundingClientRect();
        const btnRect = targetBtn.getBoundingClientRect();
        const dx = (btnRect.left + btnRect.width / 2) - (cardRect.left + cardRect.width / 2);
        const dy = (btnRect.top + btnRect.height / 2) - (cardRect.top + cardRect.height / 2);
        card.style.setProperty('--wheel-ox', `${dx}px`);
        card.style.setProperty('--wheel-oy', `${dy}px`);
        card.style.transform = `translate(${dx}px, ${dy}px) scale(0.12)`;
        card.style.opacity = '0';
        requestAnimationFrame(() => {
          card.style.transform = '';
          card.style.opacity = '';
          card.classList.add('wheel-pop-in');
        });
      }
    }
    if (this.updateDockActiveTab) this.updateDockActiveTab(-1);
    this.updateWheelUI();
    this.drawLuckyWheel();
  }

  closeLuckyWheelWithAnimation() {
    const wheelModal = document.getElementById('lucky-wheel-modal');
    if (!wheelModal || wheelModal.classList.contains('hidden')) return;

    const card = wheelModal.querySelector('.wheel-card');
    const targetBtn = document.getElementById('btn-lucky-wheel');

    if (card && targetBtn) {
      const cardRect = card.getBoundingClientRect();
      const btnRect = targetBtn.getBoundingClientRect();

      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;

      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const deltaX = btnCenterX - cardCenterX;
      const deltaY = btnCenterY - cardCenterY;

      card.classList.remove('wheel-pop-in');
      card.style.setProperty('--wheel-ox', `${deltaX}px`);
      card.style.setProperty('--wheel-oy', `${deltaY}px`);
      card.classList.add('wheel-pop-out');

      setTimeout(() => {
        wheelModal.classList.add('hidden');
        card.classList.remove('wheel-pop-out', 'wheel-shrink-to-icon');
        card.style.transform = '';
        card.style.opacity = '';
        this.goToMenuTab(2);
      }, 200);
    } else {
      wheelModal.classList.add('hidden');
      this.goToMenuTab(2);
    }
  }

  updateWheelUI() {
    const state = this.getWheelState();
    const btn = document.getElementById('btn-spin-wheel');
    const textEl = document.getElementById('wheel-spin-btn-text') || document.getElementById('btn-spin-wheel-text');
    const sub = document.getElementById('wheel-status-subtitle');

    if (state.spinsUsed === 0) {
      if (sub) sub.textContent = t('quantum_core_sub') || t('wheel_sub_free');
      if (textEl) textEl.textContent = t('quantum_free_spin') || t('wheel_btn_free');
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
    const radius = cx - 8;
    const sectors = this.wheelSectors;
    if (!sectors) return;
    const numSectors = sectors.length;
    const sliceAngle = (Math.PI * 2) / numSectors;

    wCtx.clearRect(0, 0, width, height);

    // 1. Dış Titanyum Şasi & Neon Enerji Halkası
    wCtx.save();
    wCtx.beginPath();
    wCtx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
    wCtx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    wCtx.lineWidth = 3;
    wCtx.shadowColor = '#00f0ff';
    wCtx.shadowBlur = 10;
    wCtx.stroke();
    wCtx.restore();

    // 2. Kuantum Reaktör Hazneleri (Slices)
    for (let i = 0; i < numSectors; i++) {
      const s = sectors[i];
      const startAngle = this.wheelRotation + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Koyu Obsidyen-Siber Zemin
      wCtx.save();
      wCtx.beginPath();
      wCtx.moveTo(cx, cy);
      wCtx.arc(cx, cy, radius, startAngle, endAngle);
      wCtx.closePath();
      wCtx.fillStyle = (i % 2 === 0) ? '#080f1e' : '#0b1629';
      wCtx.fill();

      // Enerji İletim Hatları (Ayrım Çizgisi)
      wCtx.strokeStyle = 'rgba(0, 240, 255, 0.28)';
      wCtx.lineWidth = 1.5;
      wCtx.stroke();
      wCtx.restore();

      // Dış Çeper Plazma Arkı
      wCtx.save();
      wCtx.beginPath();
      wCtx.arc(cx, cy, radius - 4, startAngle + 0.04, endAngle - 0.04);
      wCtx.strokeStyle = s.glow || s.color;
      wCtx.lineWidth = 2.5;
      wCtx.shadowColor = s.glow || s.color;
      wCtx.shadowBlur = 6;
      wCtx.stroke();
      wCtx.restore();

      // Reaktör Hazne Metni & Göstergesi
      wCtx.save();
      wCtx.translate(cx, cy);
      wCtx.rotate(startAngle + sliceAngle / 2);
      wCtx.textAlign = 'right';

      const isGold = s.type === 'crystals' && s.value >= 500;
      const isRevive = s.type === 'revive';
      const isOverdrive = s.type === 'overdrive';
      const isShield = s.type === 'shield';

      if (isGold) {
        wCtx.fillStyle = '#ffd700';
        wCtx.shadowColor = '#ffd700';
        wCtx.shadowBlur = 8;
        wCtx.font = '900 12px "Segoe UI", system-ui, sans-serif';
      } else if (isRevive) {
        wCtx.fillStyle = '#ff0055';
        wCtx.shadowColor = '#ff0055';
        wCtx.shadowBlur = 7;
        wCtx.font = '900 11px "Segoe UI", system-ui, sans-serif';
      } else if (isOverdrive) {
        wCtx.fillStyle = '#c084fc';
        wCtx.shadowColor = '#c084fc';
        wCtx.shadowBlur = 7;
        wCtx.font = '900 11px "Segoe UI", system-ui, sans-serif';
      } else if (isShield) {
        wCtx.fillStyle = '#38bdf8';
        wCtx.shadowColor = '#38bdf8';
        wCtx.shadowBlur = 6;
        wCtx.font = '900 11px "Segoe UI", system-ui, sans-serif';
      } else {
        wCtx.fillStyle = '#ffffff';
        wCtx.shadowColor = 'rgba(0, 240, 255, 0.4)';
        wCtx.shadowBlur = 4;
        wCtx.font = '800 11px "Segoe UI", system-ui, sans-serif';
      }

      wCtx.fillText(s.label, radius - 14, 4);

      // Hazne Plazma Pipi
      wCtx.beginPath();
      wCtx.arc(radius - 8, 0, 2, 0, Math.PI * 2);
      wCtx.fillStyle = s.glow || s.color;
      wCtx.fill();
      wCtx.restore();
    }

    // 3. Çevreleyen Mekanik Çentikler
    wCtx.save();
    for (let j = 0; j < 24; j++) {
      const angle = (Math.PI * 2 / 24) * j;
      const x1 = cx + Math.cos(angle) * (radius - 1);
      const y1 = cy + Math.sin(angle) * (radius - 1);
      const x2 = cx + Math.cos(angle) * (radius + 2);
      const y2 = cy + Math.sin(angle) * (radius + 2);
      wCtx.beginPath();
      wCtx.moveTo(x1, y1);
      wCtx.lineTo(x2, y2);
      wCtx.strokeStyle = (j % 3 === 0) ? '#00f0ff' : 'rgba(0, 240, 255, 0.35)';
      wCtx.lineWidth = (j % 3 === 0) ? 2 : 1;
      wCtx.stroke();
    }
    wCtx.restore();

    // 4. Merkezi Dönen Kuantum Tekillik Çekirdeği (Singularity Core)
    wCtx.save();
    wCtx.beginPath();
    wCtx.arc(cx, cy, 26, 0, Math.PI * 2);
    wCtx.fillStyle = '#050914';
    wCtx.fill();
    wCtx.strokeStyle = '#00f0ff';
    wCtx.lineWidth = 2;
    wCtx.shadowColor = '#00f0ff';
    wCtx.shadowBlur = 8;
    wCtx.stroke();

    wCtx.beginPath();
    wCtx.arc(cx, cy, 17, 0, Math.PI * 2);
    wCtx.strokeStyle = '#c084fc';
    wCtx.lineWidth = 1.8;
    wCtx.shadowColor = '#c084fc';
    wCtx.shadowBlur = 6;
    wCtx.stroke();

    const coreGrad = wCtx.createRadialGradient(cx, cy, 0, cx, cy, 9);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.5, '#00f0ff');
    coreGrad.addColorStop(1, '#ff0055');
    wCtx.beginPath();
    wCtx.arc(cx, cy, 9, 0, Math.PI * 2);
    wCtx.fillStyle = coreGrad;
    wCtx.shadowColor = '#00f0ff';
    wCtx.shadowBlur = 12;
    wCtx.fill();
    wCtx.restore();
  }

  handleWheelSpinClick() {
    if (this.wheelIsSpinning) return;
    const state = this.getWheelState();
    if (state.spinsUsed >= 3) {
      this.showToast(t('toast_wheel_empty'), '#ffbe0b');
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
            noteAdMiss(this, err);
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
        this.showToast(t('toast_jackpot_2x', { n: prize.value }), '#ffd700');
        this.particles.spawnExplosion(this.width / 2, this.height * 0.45, '#ffd700', 40, 5);
      } else {
        sounds.playLevelUp();
        vibrate.success();
        this.showToast(t('toast_reward_cr', { n: prize.value }), prize.color);
        this.particles.spawnExplosion(this.width / 2, this.height * 0.45, prize.color, 25, 4);
      }
    } else if (prize.type === 'revive') {
      const currentRevives = parseInt(localStorage.getItem('neon_bonus_revives') || '0', 10) + 1;
      localStorage.setItem('neon_bonus_revives', currentRevives.toString());
      sounds.playLevelUp();
      vibrate.success();
      this.showToast(t('toast_wheel_revive'), '#ff0055');
    } else if (prize.type === 'shield') {
      this.bonusShield = true;
      sounds.playLevelUp();
      vibrate.success();
      this.showToast(t('toast_wheel_shield'), '#38bdf8');
    } else if (prize.type === 'overdrive') {
      this.bonusOverdrive = true;
      sounds.playLevelUp();
      vibrate.success();
      this.showToast(t('toast_wheel_overdrive'), '#c084fc');
    }
  }

  // === GLOBAL LİDER TABLOSU (LEADERBOARD) MOTORU ===
  initLeaderboard() {
    this.lbMode = 'storm';
    this.lbView = 'top50'; // 'top50' | 'around'
    this.totalPilots = 18492;

    this.lbCountries = [
      { code: 'TUR', flag: 'TR', emoji: '🇹🇷', name: 'Türkiye' },
      { code: 'AZE', flag: 'AZ', emoji: '🇦🇿', name: 'Azerbaycan' },
      { code: 'USA', flag: 'US', emoji: '🇺🇸', name: 'USA' },
      { code: 'GER', flag: 'DE', emoji: '🇩🇪', name: 'Germany' },
      { code: 'GBR', flag: 'UK', emoji: '🇬🇧', name: 'UK' },
      { code: 'JPN', flag: 'JP', emoji: '🇯🇵', name: 'Japan' },
      { code: 'KOR', flag: 'KR', emoji: '🇰🇷', name: 'Korea' },
      { code: 'FRA', flag: 'FR', emoji: '🇫🇷', name: 'France' },
      { code: 'BRA', flag: 'BR', emoji: '🇧🇷', name: 'Brazil' },
      { code: 'CAN', flag: 'CA', emoji: '🇨🇦', name: 'Canada' },
      { code: 'ESP', flag: 'ES', emoji: '🇪🇸', name: 'Spain' },
      { code: 'ITA', flag: 'IT', emoji: '🇮🇹', name: 'Italy' },
      { code: 'NLD', flag: 'NL', emoji: '🇳🇱', name: 'Netherlands' },
      { code: 'SWE', flag: 'SE', emoji: '🇸🇪', name: 'Sweden' },
      { code: 'AUS', flag: 'AU', emoji: '🇦🇺', name: 'Australia' }
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
    let callsign = (input && input.value ? input.value : 'Pilot Alpha').trim().replace(/[^a-zA-Z0-9_.\s-]/g, '').replace(/\s+/g, ' ');
    if (!callsign || callsign.length < 2) callsign = 'Pilot Alpha';
    if (callsign.length > 15) callsign = callsign.substring(0, 15);

    const countryCode = this.selectedCountryCode || 'TUR';

    localStorage.setItem('neon_player_callsign', callsign);
    localStorage.setItem('neon_player_country', countryCode);

    this.closeProfileModal();
    this.renderLeaderboard(this.lbMode || 'storm');
    this.showToast(t('float_profile'), '#00f0ff');
  }

  getPilotAtRank(rank, mode) {
    // Deterministic pseudo-random pilot for rank
    const hash = Math.sin(rank * 12.9898 + (mode === 'storm' ? 78.233 : 45.123)) * 43758.5453;
    const rand = Math.abs(hash - Math.floor(hash));

    const pilotNames = [
      // Popüler Tek Kelimelik Oyuncu Adları
      'Viper', 'Phoenix', 'Kaelen', 'Nova', 'Zephyr', 'Aura', 'Shadow', 'Blaze',
      'Ronin', 'Atlas', 'Maverick', 'Elena', 'Lucas', 'Bora', 'Alex', 'Echo',
      'Raptor', 'Titan', 'Axel', 'Krypton', 'Arda', 'Raven', 'Frost', 'Apex',
      'Zenith', 'Orion', 'Pulse', 'Leon', 'Hawkeye', 'Storm', 'Reaper', 'Specter',
      'Enes', 'Cem', 'Sora', 'Kenji', 'Dante', 'Valkyrie', 'Matrix', 'Glitch',
      'Hunter', 'Drift', 'Phantom', 'Cobalt', 'Blaster', 'Cosmo', 'Knight', 'Slayer',
      // Sayılı & Temiz Oyuncu Adları (Alt çizgisiz)
      'Alex99', 'Neo7', 'Viper21', 'Ghost08', 'Nova34', 'Kadir35', 'Cosmo99',
      'Pilot42', 'ZeroTwo', 'Rex88', 'Flash9', 'Sky77', 'Ace10', 'Striker9',
      'Dark84', 'Vortex9', 'Kira07', 'Titan55', 'Shadow89', 'Phoenix23', 'Bora34',
      // Boşluklu İki Kelimelik Gerçekçi Takma Adlar
      'Sky Walker', 'Red Baron', 'Dark Matter', 'Ghost Rider', 'Star Lord',
      'Iron Clad', 'Night Shade', 'Cyber Fox', 'Ace Pilot', 'Drift King',
      'Solar Flare', 'Void Runner', 'Cosmic Ray', 'Silent Strike', 'Silver Fang',
      'Neon Hunter', 'Chrome Heart', 'Wild Card', 'Lone Wolf', 'Golden Hawk',
      // Noktalı Doğal Gamer Tag'leri
      'Alex.T', 'Kadir.TR', 'Mert.06', 'Elena.R', 'Max.99', 'Ace.01', 'Bora.TR',
      // Yalnızca Birkaç Klasik Alt Çizgili Tag (Her birinde zorunlu DEĞİL)
      'Cyber_Fox', 'Kadir_TR', 'Shadow_Ace', 'Nova_X', 'Neo_Matrix', 'Viper_TR'
    ];

    const ships = ['SOLAR', 'CYBER', 'VOID', 'QUANTUM', 'TITAN'];
    const titles = ['ELITE', 'ACE', 'VETERAN', 'COMMANDER', 'WARRIOR', 'PILOT', 'CHAMPION'];
    const countries = this.lbCountries || [{ code: 'TUR', flag: 'TR' }];

    const nameIdx = Math.floor(rand * pilotNames.length);
    const countryIdx = Math.floor(((rand * 17) % 1) * countries.length);
    const shipIdx = Math.floor(((rand * 31) % 1) * ships.length);
    const titleIdx = Math.floor(((rand * 47) % 1) * titles.length);

    const country = countries[countryIdx] || countries[0];
    const ship = ships[shipIdx] || 'CYBER';
    const title = titles[titleIdx] || 'PILOT';
    const baseName = pilotNames[nameIdx] || 'Pilot';
    let name = baseName;
    if (rank > 65) {
      const v = (rand * 77) % 1;
      if (v < 0.40) {
        name = `${baseName}${rank % 99 + 1}`;
      } else if (v < 0.65) {
        name = baseName;
      } else if (v < 0.85) {
        name = `${baseName}.${rank % 9 + 1}`;
      } else {
        name = `${baseName}_${rank % 50 + 1}`;
      }
    }

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
    if (rank <= 50) return { name: t('lb_tier_champ') || 'ŞAMPİYON', icon: 'crown', color: '#ff0055', pctText: `TOP %${pct.toFixed(2)}` };
    if (rank <= 500) return { name: t('lb_tier_diamond') || 'ELMAS', icon: 'crystal', color: '#00f0ff', pctText: `TOP %${pct.toFixed(1)}` };
    if (rank <= 2500) return { name: t('lb_tier_plat') || 'PLATİN', icon: 'shield', color: '#10b981', pctText: `TOP %${Math.max(1, Math.round(pct))}` };
    if (rank <= 7500) return { name: t('lb_tier_gold') || 'ALTIN', icon: 'energy', color: '#ffd700', pctText: `TOP %${Math.round(pct)}` };
    if (rank <= 13000) return { name: t('lb_tier_silver') || 'GÜMÜŞ', icon: 'speed', color: '#cbd5e1', pctText: `TOP %${Math.round(pct)}` };
    return { name: t('lb_tier_bronze') || 'BRONZ', icon: 'target', color: '#cd7f32', pctText: `TOP %${Math.round(pct)}` };
  }

  openLeaderboard() {
    try { history.pushState({ modal: 'leaderboard' }, ''); } catch(e) {}
    const lbModal = document.getElementById('leaderboard-modal');
    if (lbModal) lbModal.classList.remove('hidden');
    if (this.updateDockActiveTab) this.updateDockActiveTab(4);
    this.renderLeaderboard(this.lbMode || 'storm');
  }

  getCountryFlagBadge(c) {
    const code = (c && (c.code || c.flag)) || 'GLB';
    return `<span class="lb-flag-badge"><span class="flag-code">${code}</span></span>`;
  }

  getRankDeltaHtml(rank) {
    const seed = Math.abs(Math.sin(rank * 12.9898 + (rank % 7) * 78.233)) * 10000;
    const h = seed % 100;
    if (h < 38) {
      const up = 1 + (Math.floor(seed) % 5);
      return `<span class="rank-delta up">▲ ${up}</span>`;
    } else if (h < 72) {
      const down = 1 + (Math.floor(seed) % 3);
      return `<span class="rank-delta down">▼ ${down}</span>`;
    } else if (h < 88) {
      return `<span class="rank-delta same">•</span>`;
    } else {
      return `<span class="rank-delta new">★ NEW</span>`;
    }
  }

  updateSeasonCountdown() {
    const el = document.getElementById('lb-season-countdown');
    if (!el) return;
    el.textContent = t('rec_local_hint');
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
    const rivalFill = document.getElementById('lb-rival-fill');
    const rivalTargetEl = document.getElementById('lb-rival-target-name');
    const activeCountEl = document.getElementById('lb-active-count');
    if (!list) return;

    if (activeCountEl) {
      activeCountEl.textContent = t('rec_device');
    }

    this.updateSeasonCountdown();

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
      lbViewTop50.style.display = 'none';
      lbViewAround.style.display = 'none';
    }

    // Player Data
    const pilotCallsign = localStorage.getItem('neon_player_callsign') || 'PILOT_ALPHA';
    const pilotCountryCode = localStorage.getItem('neon_player_country') || 'TUR';
    const pilotCountry = (this.lbCountries && this.lbCountries.find(c => c.code === pilotCountryCode)) || { code: 'TUR', flag: 'TR', emoji: '🇹🇷' };
    const currentSkinName = t('ship_' + (this.currentSkinId || 'cyberpunk') + '_name');

    const stormScore = this.highScores.storm || 0;
    const clearedLevel = Math.max(1, (this.unlockedLevel || 1) - 1);
    const totalStars = this.getTotalStars ? this.getTotalStars() : clearedLevel * 3;

    if (rankEl) rankEl.textContent = mode === 'storm' ? `${stormScore.toLocaleString()}` : `${clearedLevel}`;
    if (tierBadgeEl) {
      tierBadgeEl.innerHTML = getPixelIconSvg('target', 'md') || '';
      tierBadgeEl.title = t('rec_device');
    }
    if (percentileEl) {
      percentileEl.textContent = t('rec_device');
      percentileEl.style.color = '#00f0ff';
    }
    if (nameEl) {
      nameEl.innerHTML = `${this.getCountryFlagBadge(pilotCountry)} ${pilotCallsign} <span class="lb-you-badge">${t('lb_you_badge')}</span>`;
    }

    if (mode === 'storm') {
      if (scoreEl) scoreEl.textContent = `${stormScore.toLocaleString()}`;
      if (scoreSubEl) scoreSubEl.textContent = t('lb_pts');
    } else {
      if (scoreEl) scoreEl.textContent = `${t('lb_stage')} ${clearedLevel}`;
      if (scoreSubEl) scoreSubEl.textContent = `${totalStars}★`;
    }

    if (hintEl) hintEl.textContent = t('rec_local_hint');
    if (rivalTargetEl) rivalTargetEl.textContent = '';
    if (rivalFill) rivalFill.style.width = '0%';
    if (podium) {
      podium.style.display = 'none';
      podium.innerHTML = '';
    }
    const seasonPill = document.querySelector('.lb-season-pill');
    if (seasonPill) seasonPill.style.display = 'none';

    list.innerHTML = '';
    const stats = this.pilotStats || {};
    const shipsOwned = (this.unlockedSkins || []).length;
    const records = [
      [t('rec_storm'), (this.highScores.storm || 0).toLocaleString()],
      [t('rec_chapter'), String(clearedLevel)],
      [t('rec_kills'), (stats.totalKills || 0).toLocaleString()],
      [t('rec_bosses'), (stats.bossesDefeated || 0).toLocaleString()],
      [t('rec_combo'), (stats.maxCombo || 0).toLocaleString()],
      [t('rec_time'), `${stats.maxTime || 0}s`],
      [t('rec_crystals'), (stats.lifetimeCrystals || 0).toLocaleString()],
      [t('rec_flights'), (stats.totalFlights || 0).toLocaleString()],
      [t('rec_ships'), `${shipsOwned}/6`],
      [t('rec_graze'), (stats.totalGraze || 0).toLocaleString()]
    ];
    records.forEach((pair, i) => {
      list.appendChild(this.createLeaderboardRow({
        rank: i + 1,
        name: pair[0],
        country: pilotCountry,
        ship: currentSkinName,
        title: t('rec_device'),
        score: pair[1],
        valueText: pair[1],
        localRecord: true,
        isPlayer: i === 0 && mode === 'storm'
      }, mode));
    });
  }

  createLeaderboardRow(p, mode) {
    const row = document.createElement('div');
    const isPlayer = p.isPlayer;
    let rankClass = '';
    if (p.rank === 1) rankClass = 'top-1';
    else if (p.rank === 2) rankClass = 'top-2';
    else if (p.rank === 3) rankClass = 'top-3';

    row.className = `leaderboard-row ${rankClass} ${isPlayer ? 'is-current-player' : ''}`;

    const scoreDisplay = p.localRecord
      ? `${p.valueText}`
      : (mode === 'storm'
      ? `${p.score.toLocaleString()} <span style="font-size: 0.65rem; color: #94a3b8;">${t('lb_pts')}</span>`
      : `${t('lb_stage')} ${p.level} <span style="font-size: 0.65rem; color: #ffbe0b;">${p.stars}★</span>`);

    row.innerHTML = `
      <div class="lb-left">
        <span class="lb-rank-num">#${p.rank.toLocaleString()}</span>
        ${p.localRecord ? '' : this.getRankDeltaHtml(p.rank)}
        ${this.getCountryFlagBadge(p.country)}
        <div class="lb-pilot-info">
          <div class="lb-name-row">
            <span class="lb-pilot-name">${p.name}</span>
            ${isPlayer ? `<span class="lb-you-badge">${t('lb_you_badge')}</span>` : ''}
          </div>
          <div class="lb-pilot-sub">
            <span class="lb-ship-tag">${p.ship}</span>
            <span>· ${p.title}</span>
          </div>
        </div>
      </div>
      <div class="lb-right">
        <div class="lb-score-val">${scoreDisplay}</div>
      </div>
    `;

    return row;
  }

  triggerLaunch() {
    sounds.init();
    if (this.launching) return;
    this.launching = true;
    this.launchProgress = 0;
    this.logEvent('run_start', { mode: this.currentMode, games: parseInt(localStorage.getItem('neon_games_played') || '0', 10) });
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

    const secName = txt(`sector_${targetSectorId}_name`, sec.name);
    const secSub = txt(`sector_${targetSectorId}_sub`, sec.subtitle);
    if (eventBanner && eventBannerText) {
      flashEventBanner(`${secSub}: ${secName}`, 'info');
      setTimeout(() => {
        if (this.warpTimer <= 0 && (!this.activeEvent || this.activeEvent.timer <= 0)) {
          eventBanner.classList.add('hidden');
        }
      }, 3600);
    }

    this.particles.spawnFloatingText(this.player.x, this.player.y - 35, `${secSub}: ${secName}`, sec.color, 16);
    if (!this.currentBoss && this.openingSwarmPhase <= 0) {
      this.spawnOpeningMeteorCluster(this.wave, true, Math.min(9, Math.floor((this.gameTime || 0) / 36)));
    }
    this.triggerSectorAnomaly(targetSectorId);
    this.updateHUD();
  }

  triggerSectorAnomaly(sectorId) {
    const anomalies = [
      { type: 'cryo_nebula', icon: 'freeze', name: txt('anomaly_cryo_name'), desc: txt('anomaly_cryo_desc') },
      { type: 'solar_flare_storm', icon: 'fire', name: txt('anomaly_solar_name'), desc: txt('anomaly_solar_desc') },
      { type: 'void_rift', icon: 'speed', name: txt('anomaly_void_name'), desc: txt('anomaly_void_desc') },
      { type: 'quantum_surge', icon: 'energy', name: txt('anomaly_quantum_name'), desc: txt('anomaly_quantum_desc') },
      { type: 'hyper_gravity', icon: 'magnet', name: txt('anomaly_gravity_name'), desc: txt('anomaly_gravity_desc') }
    ];
    this.currentAnomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
    if (anomalyBanner && anomalyIcon && anomalyText) {
      anomalyIcon.innerHTML = getPixelIconSvg(this.currentAnomaly.icon, 'sm');
      anomalyText.textContent = t('anomaly_banner', { name: this.currentAnomaly.name });
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

  clearNearbyProjectilesAndPushEnemies(clearRadius = 180, pushRadius = 110) {
    if (!this.player) return;
    const px = this.player.x;
    const py = this.player.y;
    if (Array.isArray(this.enemyProjectiles)) {
      for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
        const ep = this.enemyProjectiles[i];
        if (!ep || Math.hypot(ep.x - px, ep.y - py) < clearRadius) {
          this.enemyProjectiles.splice(i, 1);
        }
      }
    }
    if (Array.isArray(this.enemies) && pushRadius > 0) {
      for (let i = 0; i < this.enemies.length; i++) {
        const e = this.enemies[i];
        if (!e || e.toRemove || e.hp <= 0 || e.isBoss || (e.type && e.type.startsWith('boss'))) continue;
        const dx = e.x - px;
        const dy = e.y - py;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < pushRadius) {
          const push = (pushRadius - dist) + 18;
          e.x += (dx / dist) * push;
          e.y += (dy / dist) * push;
        }
      }
    }
  }

  startModalTransition(type, duration = 28) {
    if (this.player) {
      this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer || 0, 90);
    }
    this.clearNearbyProjectilesAndPushEnemies(220, 120);
    if (type === 'MERCHANT') {
      this.isMerchantActive = true;
    }
    this.modalTransition = {
      type,
      timer: 0,
      duration
    };
  }

  completeModalTransition(type) {
    this.modalTransition = null;
    this.modalInputLockUntil = performance.now() + 260;
    if (this.cancelDrag) this.cancelDrag();
    if (this.player) {
      this.player.targetX = this.player.x;
      this.player.targetY = this.player.y;
      this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer || 0, 90);
    }
    if (type === 'LEVEL_UP') {
      this.triggerLevelUp(true);
    } else if (type === 'LUCKY_CHEST') {
      this.triggerLuckyChest(true);
    } else if (type === 'MERCHANT') {
      this.openMerchant(true);
    }
  }

  startSmoothResume(duration = 34) {
    this.state = 'PLAYING';
    this.lastTime = performance.now();
    this.resumeRampDuration = duration;
    this.resumeRampTimer = duration;
    if (this.cancelDrag) this.cancelDrag();
    if (this.player) {
      this.player.targetX = this.player.x;
      this.player.targetY = this.player.y;
      this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer || 0, 66);
    }
    this.clearNearbyProjectilesAndPushEnemies(170, 115);
    if (sounds.setPauseFilter) sounds.setPauseFilter(false);
    if (sounds.resumeAudio) sounds.resumeAudio();
    if (sounds.startBGM) sounds.startBGM();
    if (this.particles && this.particles.triggerFlash) {
      this.particles.triggerFlash('#00f0ff', 0.14);
    }
  }

  openMerchant(immediate = false) {
    if (this.state !== 'PLAYING' || this._pendingVictory) return;
    if (!immediate) {
      if (this.modalTransition) return;
      this.isMerchantActive = true;
      sounds.playLevelUp();
      vibrate.medium();
      if (this.player && this.particles) {
        this.particles.spawnShockwave(this.player.x, this.player.y, '#ffd700', 220);
        this.particles.spawnFloatingText(this.player.x, this.player.y - 32, txt('merchant_approach'), '#ffd700', 15);
      }
      this.startModalTransition('MERCHANT', 28);
      return;
    }
    try { history.pushState({ modal: 'merchant' }, ''); } catch(e) {}
    this.isMerchantActive = true;
    this.state = 'MERCHANT';
    this.modalInputLockUntil = performance.now() + 260;
    if (this.cancelDrag) this.cancelDrag();
    if (this.player) {
      this.player.targetX = this.player.x;
      this.player.targetY = this.player.y;
      this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer || 0, 90);
    }
    this.clearNearbyProjectilesAndPushEnemies(220, 120);
    if (sounds.setPauseFilter) sounds.setPauseFilter(true);
    if (merchantCrystalsDisplay) {
      merchantCrystalsDisplay.textContent = this.totalCrystals.toLocaleString();
    }
    const btnMerchantAd = document.getElementById('btn-merchant-ad-gold');
    const textSpan = document.getElementById('btn-merchant-ad-gold-text');
    if (btnMerchantAd) {
      if (this.merchantAdUsed) {
        btnMerchantAd.disabled = true;
        btnMerchantAd.classList.remove('pulse');
        if (textSpan) textSpan.textContent = t('merch_ad_done');
      } else {
        btnMerchantAd.disabled = false;
        btnMerchantAd.classList.add('pulse');
        if (textSpan) textSpan.textContent = t('merch_ad_ready');
      }
    }
    this.renderMerchantItems();
    if (merchantModal) merchantModal.classList.remove('hidden');
  }

  closeMerchant(force = false) {
    if (!force && performance.now() < (this.modalInputLockUntil || 0)) return;
    this.isMerchantActive = false;
    if (this.modalTransition && this.modalTransition.type === 'MERCHANT') {
      this.modalTransition = null;
    }
    if (merchantModal) merchantModal.classList.add('hidden');
    if (sounds.setPauseFilter) sounds.setPauseFilter(false);
    sounds.playWarpDrive();
    if (this.state === 'MERCHANT' || this.state === 'PLAYING') {
      this.startSmoothResume(34);
    }
    this.updateHUD();
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
    shuffled.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'merchant-item-card';
      card.style.animation = `jackpotCardPop 0.42s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.08}s both`;
      const canAfford = this.totalCrystals >= item.price;
      const itemName = txt(`merch_${item.id}_name`, item.name);
      const itemDesc = txt(`merch_${item.id}_desc`, item.desc);
      card.innerHTML = `
        <div class="merchant-item-info">
          <div class="merchant-item-icon">${getPixelIconSvg(item.icon, 'lg')}</div>
          <div>
            <div class="merchant-item-title">${itemName}</div>
            <div class="merchant-item-desc">${itemDesc}</div>
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
      buttonEl.textContent = t('merch_bought');
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
      if (ultimateLabel) ultimateLabel.textContent = t('hud_ready');
      sounds.playUltimateReady();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 200);
    } else if (itemId === 'emp_shield' || itemId === 'nuke') {
      sounds.playNuke();
      this.screenShake = 8;
      this.enemyProjectiles = [];
      this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer || 0, 240);
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 240);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 35, t('float_emp_barrier'), '#00f0ff', 16);
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
    if (ultimateLabel) ultimateLabel.textContent = t('hud_overload');

    sounds.playUltimateCast();
    sounds.playNuke();
    vibrate.heavy();
    this.screenShake = 10;
    this.whiteFlash = 0.45;

    // Taktiksel EMP Alanı (Hafifletilmiş tekil darbe dalgası)
    this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 240);
    this.particles.spawnFloatingText(this.player.x, this.player.y - 45, t('float_overdrive'), '#00f0ff', 18);

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
      if (enemy.hp <= 0 || enemy.toRemove) continue;
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      if (dx * dx + dy * dy < 220 * 220) {
        this.applyCappedEnemyDamage(enemy, 18);
        if (enemy.hp <= 0) {
          this.handleEnemyDeath(enemy);
        }
      }
    }

    this.triggerSkinOverdriveBurst();
    this.updateHUD();
  }

  triggerPilotSkill() {
    this.triggerPilotAbility();
  }

  triggerPilotAbility() {
    if (this.state !== 'PLAYING' || !this.player || this.player.hp <= 0) return;
    if (this.player.abilityCooldown > 0) {
      sounds.playCardSelect();
      return;
    }

    const pilotId = this.player.pilotId || this.activeArchetype || 'interceptor';
    const pilotCfg = this.pilots[pilotId] || this.pilots.interceptor;

    if (pilotId === 'interceptor') {
      // VEGA: Pasif Odaklı Hız & Atış Hızı Doktrini
      return;
    }

    // Bekleme süresini başlat
    this.player.abilityCooldown = this.player.abilityCooldownMax || pilotCfg.cooldown;
    if (btnAbility) btnAbility.classList.remove('ready');

    sounds.playPowerup();
    vibrate.medium();

    if (pilotId === 'dreadnought') {
      // 2. TITAN - ÇİFT KALKAN (Kalkanı anında doldurur + 5 sn %50 hasar azaltma)
      this.player.shield = this.player.maxShield;
      this.player.titanShieldTimer = 300; // 5s
      sounds.playDeflect();
      this.screenShake = 8;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 220);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 40, t('float_titan'), '#ffbe0b', 16);
    } else if (pilotId === 'technician') {
      // 3. NOVA - KUANTUM TEKİLLİK & KRİSTAL VAKUMU (20s CD)
      const vx = this.width / 2;
      const vy = this.height * 0.35;
      this.vortices.push({
        x: vx,
        y: vy,
        timer: 240, // 4 saniye aktif kuantum tekillik girdabı
        radius: 95,
        isNovaVortex: true
      });
      this.player.vacuumTimer = Math.max(this.player.vacuumTimer || 0, 210);
      // Ekrandaki en yakın 12 düşman mermisini kristale dönüştür!
      let converted = 0;
      for (let i = this.enemyProjectiles.length - 1; i >= 0 && converted < 12; i--) {
        const ep = this.enemyProjectiles[i];
        this.gems.push(new Gem(ep.x, ep.y, 2));
        this.particles.spawnExplosion(ep.x, ep.y, '#d946ef', 4, 1.5);
        this.enemyProjectiles.splice(i, 1);
        converted++;
      }
      sounds.playEvolution();
      vibrate.heavy();
      this.screenShake = 10;
      this.particles.spawnShockwave(vx, vy, '#d946ef', 260);
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 220);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 40, t('float_nova'), '#d946ef', 16);
    }

    this.updateHUD();
  }

  // 10-15 kırmızıya karşı 1 mor (veya daha az) oranı: %6 olasılıkla Mor, %94 Kırmızı
  getRandomBombType() {
    return Math.random() < 0.06 ? 'asteroid_purple' : 'asteroid_bomb';
  }

  spawnOpeningMeteorCluster(waveNum = 1, isEncore = false, band = 0) {
    if (!isEncore) {
      this.spawnScatteredHook(waveNum);
      return;
    }
    const cx = this.width / 2;
    this.openingSwarmPhase = waveNum;
    this.openingBombSpawned = true;
    this.openingClusterTimer = 0;

    const margin = 26;
    const belt = Math.max(0, Math.min(9, band | 0));
    const cols = 4 + Math.floor(belt / 3);
    const rows = 2;
    const usable = Math.max(140, this.width - margin * 2);
    const step = usable / cols;

    const add = (x, y, type, hp, core = false) => {
      const clampedX = Math.max(24, Math.min(this.width - 24, x));
      const e = new Enemy(clampedX, y, type, 1, 0.5);
      e.hp = hp;
      e.maxHp = hp;
      e.isOpeningCluster = true;
      e.speedX = (Math.random() - 0.5) * 0.35;
      e.speedY = 0.42 + Math.random() * 0.2;
      if (core) e.isCoreBomb = true;
      this.enemies.push(e);
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = margin + step * (c + 0.5) + (Math.random() - 0.5) * 18;
        const y = -40 - r * 70 - Math.random() * 36;
        add(x, y, c % 3 === 0 ? 'asteroid_gold' : 'asteroid_s', 1);
      }
    }
    add(cx, -80, 'asteroid_bomb', 2, true);
  }

  spawnScatteredHook(waveNum = 1) {
    this.openingSwarmPhase = waveNum;
    this.openingBombSpawned = true;
    this.openingClusterTimer = 0;
    this.openingHookGap = 0;

    const count = 8 + ((waveNum - 1) % 3);
    for (let i = 0; i < count; i++) {
      const x = 30 + Math.random() * Math.max(40, this.width - 60);
      const y = -18 - Math.random() * 150;
      const roll = Math.random();
      let type = 'asteroid_s';
      let hp = 1;
      if (roll > 0.86) {
        type = 'asteroid_m';
        hp = 2;
      } else if (roll > 0.72) {
        type = 'asteroid_gold';
      }
      const e = new Enemy(x, y, type, 1, 0.5);
      e.hp = hp;
      e.maxHp = hp;
      e.isOpeningCluster = true;
      e.speedX = (Math.random() - 0.5) * 0.55;
      e.speedY = 0.32 + Math.random() * 0.38;
      this.enemies.push(e);
    }
    if (waveNum % 2 === 1) {
      const bomb = new Enemy(40 + Math.random() * Math.max(20, this.width - 80), -50 - Math.random() * 160, 'asteroid_bomb', 1, 0.5);
      bomb.hp = 2;
      bomb.maxHp = 2;
      bomb.isOpeningCluster = true;
      bomb.isCoreBomb = true;
      bomb.speedX = (Math.random() - 0.5) * 0.3;
      bomb.speedY = 0.4;
      this.enemies.push(bomb);
    }
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
    this.stormBossIndex = 0;
    this.nextStormBossTime = 55;
    this.nextStormFleetTime = 28;
    this.stormBossWarningTriggered = false;
    this._pendingVictory = false;
    this.initialHighScore = this.highScores[this.currentMode] || 0;
    this.isNewRecordSet = false;
    this.nextHazardTime = 22;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.barrierFlash = 0;
    this.crystalsEarnedThisRun = 0;
    this.damageBreakdown = { laser: 0, missiles: 0, tesla: 0, drones: 0, special: 0 };
    this.merchantAdUsed = false;
    this.gameOverAdUsed = false;
    this.victoryAdUsed = false;
    this.runSawRewardedAd = false;
    this.menuBreakAdOffered = false;
    this.adGapCounted = false;
    if (recordBadge) recordBadge.classList.add('hidden');
    sounds.setBossMode(false);
    sounds.setCombatIntensity(0);
    sounds.startBGM();

    this.player.x = this.width / 2;
    this.player.y = this.height * 0.8;
    this.player.targetX = this.player.x;
    this.player.targetY = this.player.y;
    this.player.radius = 16;
    this.player.visualRadius = 26;
    this.player.tilt = 0;
    this.player.combatZone = 'rear';
    this.revivesUsed = 0;

    if (this.pendingResume && this.pendingResume.skin && this.skins[this.pendingResume.skin]) {
      this.currentSkinId = this.pendingResume.skin;
    }
    this.runSkinId = this.currentSkinId;
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
    this.player.nextXp = this.getNextLevelXp(1); // 25 XP (İlk yükseltmeyi hak etmek için dengeli başlangıç)
    this.player.score = 0;
    this.player.magnetRange = Math.round((60 + (tech.magnet || 0) * 10) * (skinCfg.magnetMult || 1.0)); // Başlangıçta dar mıknatıs
    const masteryCrystalBonus = (this.masteryTree && this.masteryTree.crystalBonus) ? this.masteryTree.crystalBonus * 0.10 : 0;
    this.player.crystalMultiplier = (1 + (tech.crystalBoost || 0) * 0.08) * (1 + masteryCrystalBonus);
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
    this.player.invulnerableTimer = 0;
    this.player.cryoSlowTimer = 0;
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

    // Kalıcı Hangar Yoldaş Drone Başlatması (Sadece oyuncu hangardan donandıysa devreye girer)
    const eqDroneId = this.equippedDroneId || localStorage.getItem('neon_equipped_drone');
    const eqDroneLvl = (eqDroneId && this.droneLevels && this.droneLevels[eqDroneId]) || 1;
    if (eqDroneId && this.hangarDrones && this.hangarDrones[eqDroneId]) {
      this.companionDrone = {
        id: eqDroneId,
        level: Math.max(1, eqDroneLvl),
        cfg: this.hangarDrones[eqDroneId],
        angle: 0,
        shootTimer: 0,
        x: this.player.x - 48,
        y: this.player.y + 15
      };
    } else {
      this.companionDrone = null;
    }

    if ((this.player.upgrades.wingman || 0) > 0) {
      this.syncWingmen();
    }

    // Gemi Pasif Yeteneği
    this.player.skinPassive = this.currentSkinId;

    // Mastery Tree Bonuslarını Uygula
    if (this.masteryTree) {
      this.player.magnetRange += (this.masteryTree.magnet || 0) * 10;
      this.player.maxShield += (this.masteryTree.startShield || 0) * 8;
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
      this.player.crystalMultiplier *= 1.20;
    }

    // Kalıcı Atölye (Tech Tree) & Mastery Reroll Bonusları
    this.player.damageMultiplier = (1 + (tech.damageBoost || 0) * 0.06) * (skinCfg.dmgMult || 1.0);
    this.player.reactorChargeMult = 1 + (tech.reactorCharge || 0) * 0.08;
    this.player.rerollCount = 1 + (tech.rerollCount || 0) + (this.masteryTree ? (this.masteryTree.rerollStart || 0) : 0);

    // Taktiksel Mühimmat & Sarf Malzemesi Takviyelerini Uygula (Pre-Flight Boosters)
    const bOverdrive = parseInt(localStorage.getItem('neon_boost_overdrive') || '0', 10);
    if (bOverdrive > 0) {
      this.player.feverCharge = 50;
      localStorage.setItem('neon_boost_overdrive', (bOverdrive - 1).toString());
      this.particles.spawnFloatingText(this.player.x, this.player.y - 45, t('float_boost_battery'), '#ffd700', 16);
    }
    const bReroll = parseInt(localStorage.getItem('neon_boost_rerolls') || '0', 10);
    if (bReroll > 0) {
      this.player.rerollCount = (this.player.rerollCount || 0) + 2;
      localStorage.setItem('neon_boost_rerolls', (bReroll - 1).toString());
      this.particles.spawnFloatingText(this.player.x, this.player.y - 65, t('float_boost_reroll'), '#38bdf8', 16);
    }
    const bCrystal = parseInt(localStorage.getItem('neon_boost_crystal') || '0', 10);
    if (bCrystal > 0) {
      this.player.crystalBoosterActive = true;
      localStorage.setItem('neon_boost_crystal', (bCrystal - 1).toString());
      this.particles.spawnFloatingText(this.player.x, this.player.y - 85, t('float_boost_radar'), '#bf5af2', 16);
    }
    const bDamage = parseInt(localStorage.getItem('neon_boost_damage') || '0', 10);
    if (bDamage > 0) {
      this.player.damageMultiplier = (this.player.damageMultiplier || 1.0) * 1.25;
      localStorage.setItem('neon_boost_damage', (bDamage - 1).toString());
      this.particles.spawnFloatingText(this.player.x, this.player.y - 105, '[BOOST] +%25 PLAZMA HASARI!', '#ff0055', 16);
    }
    const bMagnet = parseInt(localStorage.getItem('neon_boost_magnet') || '0', 10);
    if (bMagnet > 0) {
      this.player.magnetRange = (this.player.magnetRange || 90) * 1.8;
      localStorage.setItem('neon_boost_magnet', (bMagnet - 1).toString());
      this.particles.spawnFloatingText(this.player.x, this.player.y - 125, t('float_boost_vacuum'), '#a855f7', 16);
    }
    const bShield = parseInt(localStorage.getItem('neon_boost_shield') || '0', 10);
    if (bShield > 0) {
      this.player.maxShield += 30;
      this.player.shield = Math.max(this.player.shield, 30);
      localStorage.setItem('neon_boost_shield', (bShield - 1).toString());
      this.particles.spawnFloatingText(this.player.x, this.player.y - 25, t('float_boost_shield'), '#00f0ff', 16);
    }

    // Sinerjiler & Adrenalin
    this.player.synergies = {
      overloadReactor: false,
      apexWiper: false,
      crystalShrapnel: false
    };
    this.player.crystalShrapnelCount = 0;
    this.player.adrenalineTimer = 0;

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
    this.dominoQueue = [];
    this.enemyProjectiles = [];

    const resume = this.pendingResume;
    this.pendingResume = null;
    if (resume && resume.hp > 0) {
      this.gameTime = resume.gameTime || 0;
      this.wave = resume.wave || 1;
      if (resume.sector) {
        this.currentSectorId = resume.sector;
        Enemy.currentSector = resume.sector;
        this.particles.setSector(resume.sector, this.width, this.height);
      }
      this.player.hp = Math.min(resume.hp, resume.maxHp || resume.hp);
      if (resume.maxHp) this.player.maxHp = resume.maxHp;
      this.player.shield = resume.shield || 0;
      if (resume.maxShield) this.player.maxShield = resume.maxShield;
      this.player.level = resume.level || 1;
      this.player.xp = resume.xp || 0;
      this.player.nextXp = resume.nextXp || this.player.nextXp;
      this.player.score = resume.score || 0;
      this.player.feverCharge = resume.feverCharge || 0;
      if (resume.upgrades) this.player.upgrades = { ...this.player.upgrades, ...resume.upgrades };
      if (resume.evolutions) this.player.evolutions = { ...this.player.evolutions, ...resume.evolutions };
      this.crystalsEarnedThisRun = resume.crystalsEarned || 0;
      this.openingHooksLeft = 0;
      this.openingHookGap = 0;
      this.runInMemory = true;
      this.nextMeteorHookTime = (resume.gameTime || 0) + 70;
      this.writeSuspendSnapshot();
    } else {
      this.openingHooksLeft = 3;
      this.openingHookGap = 0;
      this.spawnOpeningMeteorCluster(1);
      this.nextMeteorHookTime = 0;
    }

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
    this.fireZones = [];
    this.slowMoTimer = 0;
    this.isMerchantActive = false;
    this.modalTransition = null;
    this.resumeRampTimer = 0;
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

    if (!this.isTestFlight) {
      if (!this.pilotStats) this.pilotStats = this.loadPilotStats();
      this.pilotStats.totalFlights++;
      this.savePilotStats();
    }

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
    this._hudScore = -1;
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
      if (scoreDisplay) scoreDisplay.textContent = this.player.score.toLocaleString();

      if (hudRecordTarget) {
        const best = this.initialHighScore || this.highScores[this.currentMode] || 0;
        if (this.isNewRecordSet || (best > 0 && this.player.score > best)) {
          if (!this.isNewRecordSet && best > 0 && this.player.score > best) {
            this.isNewRecordSet = true;
            this.particles.spawnFloatingText(this.player.x, this.player.y - 45, t('record_broken_banner'), '#ffd700', 20);
            this.particles.triggerFlash('#ffd700', 0.25);
            sounds.playCrit();
            vibrate.success();
            if (recordBadge) recordBadge.classList.remove('hidden');
          }
          hudRecordTarget.textContent = t('hud_record_new');
          hudRecordTarget.className = 'hud-record-target broken';
        } else if (best > 0) {
          const diff = best - this.player.score;
          hudRecordTarget.textContent = `${t('hud_record_gap', { n: best.toLocaleString() })} (-${diff.toLocaleString()})`;
          hudRecordTarget.className = 'hud-record-target';
        } else {
          hudRecordTarget.textContent = t('hud_first_flight');
          hudRecordTarget.className = 'hud-record-target';
        }
      }
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
      if (this.currentBoss.isEnraged || this.currentBoss.phase === 2) {
        bossBarFill.style.background = 'linear-gradient(90deg, #ff1744, #ffd700)';
        bossBarFill.style.boxShadow = '0 0 10px rgba(255, 23, 68, 0.7)';
        if (titleEl) titleEl.textContent = t('boss_phase_2', { name: bInfo.name });
      } else {
        bossBarFill.style.background = `linear-gradient(90deg, ${bInfo.color}, #bf5af2)`;
        bossBarFill.style.boxShadow = 'none';
        if (titleEl) titleEl.textContent = t('boss_phase_1', { name: bInfo.name });
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
          if (ultimateLabel) ultimateLabel.textContent = t('hud_ready');
        }
      } else if (btnUltimate && btnUltimate.classList.contains('ready') && !this.player.isFever) {
        btnUltimate.classList.remove('ready');
        if (ultimateLabel) ultimateLabel.textContent = t('hud_ultimate');
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
        const maxCd = this.player.abilityCooldownMax || 1200;
        const cdPct = (cd / maxCd) * 100;
        abilityCooldownFill.style.height = `${cdPct}%`;

        const pCfg = this.pilots[pilotId] || this.pilots.interceptor;
        if (abilityIcon && pCfg.icon && abilityIcon.dataset.pilotId !== pilotId) {
          abilityIcon.innerHTML = pCfg.icon;
          abilityIcon.dataset.pilotId = pilotId;
        }

        if (cd <= 0) {
          if (!btnAbility.classList.contains('ready')) {
            btnAbility.classList.add('ready');
            sounds.playLaser();
            vibrate.light();
          }
          if (abilityLabel) {
            const abilityKey = pilotId === 'dreadnought' ? 'pilot_titan_ability' : pilotId === 'technician' ? 'pilot_nova_ability' : 'pilot_vega_ability';
            abilityLabel.textContent = t(abilityKey);
          }
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

  // === DENGELİ LEVEL VE XP GELİŞİM EĞRİSİ ===
  // Kullanıcı Tasarım Kriterleri:
  // - Seviye 1->2 (8 XP) ve 2->3 (16 XP): Hızlı, akıcı ve teşvik edici başlangıç (ilk build temelleri atılır)
  // Roguelite XP İlerleme Eğrisi:
  // - Seviye 1->2 (25 XP): Açılış meteor kümesi ve ilk avcılarla ~20-30. saniyede ilk seçim
  // - Seviye 2->3 (55 XP): İkinci yükseltme için gerçek dövüş ve manevra gerekir (~1. dakika)
  // - Seviye 3->4 (110 XP): Belirgin roguelite eşiği ve sinerji geçişi (~1.5-2. dakika)
  // - Seviye 4->5 (190 XP): Elit filoları yenerek hak edilir
  // - Seviye 5+: Sabit %36 bileşik artış formülü (sürekli kart popup yorgunluğunu önler)
  getNextLevelXp(level) {
    if (level === 1) return 25;
    if (level === 2) return 55;
    if (level === 3) return 110;
    if (level === 4) return 190;
    return Math.round(190 * Math.pow(1.36, level - 4));
  }

  // Derinlik / İlerleme Çarpanı: Dalga, Sektör, Süre ve Bölüme göre düşmanların XP çıktısını dengeli biçimde artırır
  getProgressionXpMultiplier() {
    const waveBonus = Math.max(0, (this.wave - 1) * 0.15);
    const timeBonus = Math.min(1.2, Math.floor((this.gameTime || 0) / 60) * 0.12);
    let sectorBonus = 0;
    if (this.currentSectorId === 'magma') sectorBonus = 0.25;
    else if (this.currentSectorId === 'toxic') sectorBonus = 0.55;
    else if (this.currentSectorId === 'quantum') sectorBonus = 0.90;
    let levelBonus = 0;
    if (this.currentMode === 'classic') {
      levelBonus = Math.max(0, (this.selectedLevel - 1) * 0.04);
    }
    return 1 + waveBonus + timeBonus + sectorBonus + levelBonus;
  }

  // Merkezi Seviye Atlama Kontrolü
  checkLevelUp() {
    if (this.state !== 'PLAYING' || this.modalTransition || this.isMerchantActive || this._pendingVictory || this.isTestFlight) return;
    if (this.player.xp >= this.player.nextXp) {
      this.player.xp -= this.player.nextXp;
      this.player.level++;
      this.player.nextXp = this.getNextLevelXp(this.player.level);

      // Seviye atlama epik görsel & ses efektleri
      this.screenShake = 6;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 220);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 32, t('float_level_up'), '#00f0ff', 16);
      sounds.playLevelUp();
      vibrate.success();
      this.updateHUD();
      this.startModalTransition('LEVEL_UP', 28);
    }
  }

  // Seviye Seçim Modalını Kapatıp Oyunu Devam Ettir (Birikmiş XP varsa ekranı gecikmesiz sonraki seçime odaklar)
  closeLevelModalAndResume() {
    if (this.player.xp >= this.player.nextXp) {
      // Birikmiş XP varsa tehlikeli ara açılma olmadan direkt sonraki seçime geç
      this.player.xp -= this.player.nextXp;
      this.player.level++;
      this.player.nextXp = this.getNextLevelXp(this.player.level);
      sounds.playLevelUp();
      this.updateHUD();
      this.triggerLevelUp(true);
      return;
    }
    levelModal.classList.add('hidden');
    if (sounds.setPauseFilter) sounds.setPauseFilter(false);
    if (this.isMerchantActive || (merchantModal && !merchantModal.classList.contains('hidden'))) {
      this.state = 'MERCHANT';
      this.updateHUD();
      return;
    }
    this.startSmoothResume(34);
    this.updateHUD();
  }

  // Tekil Kristal Toplama Yardımcısı (Oyuncu & Dronelar için kusursuz senkronizasyon)
  collectGem(gem, sourceX = this.player.x, sourceY = this.player.y) {
    this.gemStreak = ((this.frames - (this.lastGemFrame || 0)) < 36) ? Math.min(16, (this.gemStreak || 0) + 1) : 0;
    this.lastGemFrame = this.frames;
    sounds.playCrystalPop(this.gemStreak);

    // Kalıcı Kristal Ekonomisi Dengesi (XP ile Kalıcı Para Birimi Ayrıldı):
    // XP seviye atlamak için gem.value olarak aynen verilir, kalıcı kristal ise değerli ve dengeli kazanılır!
    const rawGain = gem.value >= 15 ? 5 : (gem.value >= 8 ? 3 : (gem.value >= 3 ? 2 : 1));
    const crystalGain = Math.max(1, Math.round(rawGain * (this.player.crystalMultiplier || 1)));
    const xpMult = 1 + ((this.masteryTree && this.masteryTree.xpBonus) ? this.masteryTree.xpBonus * 0.08 : 0);

    this.player.xp += gem.value * xpMult;
    this.player.score += gem.value * 10;
    if (!this.isTestFlight) {
      this.totalCrystals += crystalGain;
      this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + crystalGain;
      if (this.pilotStats) {
        this.pilotStats.lifetimeCrystals = (this.pilotStats.lifetimeCrystals || 0) + crystalGain;
      }
    }

    if (this.frames % 120 === 0) {
      localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    }
    this.updateCrystalsDisplay();
    this.updateMissionProgress('collect_crystals', crystalGain);
    this.updateMiniQuestProgress('crystals', crystalGain);
    this.particles.spawnExplosion(sourceX, sourceY, gem.color || '#00f0ff', 3, 1.2);

    // Crystal Shrapnel Sinerjisi (Her 7 kristalde bir güdümlü kristal füzesi fırlar)
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

    // Fever / Overdrive Şarjı (Ultimate dengesi)
    if (!this.player.isFever) {
      const stormBonus = this.currentMode === 'storm' ? 1.2 : 1.0;
      this.player.feverCharge = Math.min(100, (this.player.feverCharge || 0) + gem.value * 0.10 * stormBonus);
      if (this.player.feverCharge >= 100) {
        if (btnUltimate && !btnUltimate.classList.contains('ready')) {
          btnUltimate.classList.add('ready');
          sounds.playUltimateReady();
          vibrate.success();
          if (ultimateLabel) ultimateLabel.textContent = t('hud_ready');
          this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 75);
        }
      }
    }
  }

  // Düşman Türü ve İlerleme Derinliğine Göre Kalibre Edilmiş XP / Kristal Ganimeti
  dropEnemyLoot(enemy) {
    if (enemy._droppedHazardGem) return;
    const mult = this.getProgressionXpMultiplier();

    // 1. Açılış Meteor Kümesi (Opening Cluster):
    if (enemy.isOpeningCluster) {
      if (enemy.isCoreBomb) {
        // Çekirdek bomba: Seviye 2'ye (25 XP) doğru sağlam bir başlangıç ivmesi veren 8 XP kristali
        this.gems.push(new Gem(enemy.x, enemy.y, 8));
      } else if (enemy.type === 'asteroid_gold') {
        this.gems.push(new Gem(enemy.x, enemy.y, 2));
      } else if (enemy.type === 'asteroid_m') {
        this.gems.push(new Gem(enemy.x, enemy.y, 1));
      } else {
        if (Math.random() < 0.35) {
          this.gems.push(new Gem(enemy.x, enemy.y, 1));
        }
      }
      return;
    }

    // 2. Normal / İleri Düzey Düşmanlar & Bosslar:
    if (enemy.isBoss || (enemy.type && enemy.type.startsWith('boss'))) {
      const isIntro = enemy.type === 'boss_vanguard';
      const gemCount = isIntro ? 6 : Math.min(8, 5 + (this.bossDefeatedCount || 1));
      const val = Math.max(3, Math.round(3 * mult));
      for (let k = 0; k < gemCount; k++) {
        this.gems.push(new Gem(
          enemy.x + (Math.random() * 40 - 20),
          enemy.y + (Math.random() * 40 - 20),
          val
        ));
      }
    } else if (enemy.type === 'cargo_freighter') {
      const val = Math.max(2, Math.round(2 * mult));
      for (let k = 0; k < 4; k++) {
        this.gems.push(new Gem(enemy.x + (Math.random() * 24 - 12), enemy.y + (Math.random() * 24 - 12), val));
      }
    } else if (enemy.type === 'elite_scout') {
      const val = Math.max(2, Math.round(2.2 * mult));
      for (let k = 0; k < 2; k++) {
        this.gems.push(new Gem(enemy.x + (Math.random() * 20 - 10), enemy.y + (Math.random() * 20 - 10), val));
      }
    } else if (enemy.isChampion) {
      const val = Math.max(2, Math.round(2 * mult));
      for (let k = 0; k < 2; k++) {
        this.gems.push(new Gem(enemy.x + (Math.random() * 16 - 8), enemy.y + (Math.random() * 16 - 8), val));
      }
    } else if (enemy.type === 'asteroid_gold') {
      const val = Math.max(2, Math.round(2 * mult));
      this.gems.push(new Gem(enemy.x, enemy.y, val));
    } else if (enemy.type === 'volatile_core') {
      const val = Math.max(2, Math.round(2 * mult));
      for (let k = 0; k < 2; k++) {
        this.gems.push(new Gem(enemy.x + (Math.random() * 20 - 10), enemy.y + (Math.random() * 20 - 10), val));
      }
    } else if (enemy.type === 'cruiser') {
      const val = Math.max(2, Math.round(2 * mult));
      this.gems.push(new Gem(enemy.x - 7, enemy.y, val));
      this.gems.push(new Gem(enemy.x + 7, enemy.y, val));
    } else if (enemy.type === 'shield_vanguard') {
      const val = Math.max(2, Math.round(2 * mult));
      this.gems.push(new Gem(enemy.x, enemy.y, val));
    } else if (enemy.type === 'tether_drone') {
      this.gems.push(new Gem(enemy.x, enemy.y, 1));
    } else if (enemy.type === 'asteroid_l') {
      this.gems.push(new Gem(enemy.x, enemy.y, 2));
    } else if (enemy.type === 'asteroid_m') {
      this.gems.push(new Gem(enemy.x, enemy.y, 1));
    } else if (enemy.type === 'asteroid_purple') {
      this.gems.push(new Gem(enemy.x, enemy.y, 2));
    } else if (enemy.type === 'asteroid_bomb') {
      this.gems.push(new Gem(enemy.x, enemy.y, 2));
    } else if (enemy.type === 'asteroid_cryo' || enemy.type === 'asteroid_vortex') {
      this.gems.push(new Gem(enemy.x, enemy.y, 2));
    } else if (enemy.type === 'asteroid_s') {
      if (Math.random() < 0.35) {
        this.gems.push(new Gem(enemy.x, enemy.y, 1));
      }
    } else if (enemy.type === 'scout') {
      this.gems.push(new Gem(enemy.x, enemy.y, 1));
    } else if (enemy.type === 'escort_fighter' || enemy.type === 'dive_bomber' || enemy.type === 'kamikaze') {
      this.gems.push(new Gem(enemy.x, enemy.y, 1));
    } else {
      this.gems.push(new Gem(enemy.x, enemy.y, 1));
    }
  }

  triggerLevelUp(immediate = false) {
    if (!immediate && this.state === 'PLAYING') {
      this.startModalTransition('LEVEL_UP', 28);
      return;
    }
    this.state = 'LEVEL_UP';
    this.modalInputLockUntil = performance.now() + 260;
    if (this.cancelDrag) this.cancelDrag();
    if (this.player) {
      this.player.targetX = this.player.x;
      this.player.targetY = this.player.y;
      this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer || 0, 75);
    }
    if (sounds.setPauseFilter) sounds.setPauseFilter(true);
    this.logEvent('level_up', { level: this.player.level, time: Math.round(this.gameTime), score: this.player.score });

    // Evrim seçeneklerini kontrol et
    const evolutions = [];
    if (this.player.upgrades.laser >= 5 && this.player.upgrades.magnet >= 1 && !this.player.evolutions.vortexLaser) {
      evolutions.push({
        id: 'evo_vortex',
        isEvolution: true,
        name: t('evo_vortex_name'),
        stat: t('evo_vortex_stat'),
        color: '#d946ef',
        desc: t('evo_vortex_desc')
      });
    }
    if (this.player.upgrades.missiles >= 4 && this.player.upgrades.emp >= 1 && !this.player.evolutions.clusterMissiles) {
      evolutions.push({
        id: 'evo_cluster',
        isEvolution: true,
        name: t('evo_cluster_name'),
        stat: t('evo_cluster_stat'),
        color: '#ffbe0b',
        desc: t('evo_cluster_desc')
      });
    }
    if ((this.player.upgrades.tesla || 0) >= 4 && this.player.upgrades.fireRate >= 4 && !this.player.evolutions.ionStorm) {
      evolutions.push({
        id: 'evo_ion_storm',
        isEvolution: true,
        name: t('evo_ion_storm_name'),
        stat: t('evo_ion_storm_stat'),
        color: '#38bdf8',
        desc: t('evo_ion_storm_desc')
      });
    }
    if (this.player.upgrades.shield >= 4 && (this.player.upgrades.drones || 0) >= 3 && !this.player.evolutions.nanoBastion) {
      evolutions.push({
        id: 'evo_nano_bastion',
        isEvolution: true,
        name: t('evo_nano_bastion_name'),
        stat: t('evo_nano_bastion_stat'),
        color: '#05ffa1',
        desc: t('evo_nano_bastion_desc')
      });
    }
    if (this.player.upgrades.laser >= 4 && this.player.upgrades.shield >= 2 && !this.player.evolutions.cryoBlaster) {
      evolutions.push({
        id: 'evo_cryo',
        isEvolution: true,
        name: t('evo_cryo_name'),
        stat: t('evo_cryo_stat'),
        color: '#00f0ff',
        desc: t('evo_cryo_desc')
      });
    }
    if ((this.player.upgrades.drones || 0) >= 2 && this.player.upgrades.fireRate >= 3 && !this.player.evolutions.orbitalSaws) {
      evolutions.push({
        id: 'evo_saws',
        isEvolution: true,
        name: t('evo_saws_name'),
        stat: t('evo_saws_stat'),
        color: '#ff5500',
        desc: t('evo_saws_desc')
      });
    }
    if ((this.player.upgrades.tesla || 0) >= 4 && this.player.upgrades.emp >= 3 && !this.player.evolutions.doomsdayMatrix) {
      evolutions.push({
        id: 'evo_matrix',
        isEvolution: true,
        name: t('evo_matrix_name'),
        stat: t('evo_matrix_stat'),
        color: '#bf5af2',
        desc: t('evo_matrix_desc')
      });
    }
    if ((this.player.upgrades.hull || 0) >= 3 && this.player.upgrades.fireRate >= 4 && !this.player.evolutions.hyperPlasma) {
      evolutions.push({
        id: 'evo_hyper_plasma',
        isEvolution: true,
        name: t('evo_hyper_plasma_name'),
        stat: t('evo_hyper_plasma_stat'),
        color: '#05ffa1',
        desc: t('evo_hyper_plasma_desc')
      });
    }
    if ((this.player.upgrades.drones || 0) >= 3 && this.player.upgrades.magnet >= 3 && !this.player.evolutions.voidDrones) {
      evolutions.push({
        id: 'evo_void_drones',
        isEvolution: true,
        name: t('evo_void_drones_name'),
        stat: t('evo_void_drones_stat'),
        color: '#ffd700',
        desc: t('evo_void_drones_desc')
      });
    }

    const availableUpgrades = [
      {
        id: 'laser',
        name: t('upg_laser_name'),
        stat: this.player.upgrades.laser === 1 ? t('prev_dmg', { n: 25 }) : (this.player.upgrades.laser === 2 ? t('prev_twin') : (this.player.upgrades.laser === 3 ? t('prev_triple') : t('stat_spread'))),
        color: '#00f0ff',
        level: this.player.upgrades.laser,
        maxLevel: 5,
        desc: t('upg_laser_desc')
      },
      {
        id: 'fireRate',
        name: t('upg_fireRate_name'),
        stat: t('prev_firerate', { n: 12 }),
        color: '#ffbe0b',
        level: this.player.upgrades.fireRate,
        maxLevel: 5,
        desc: t('upg_fireRate_desc')
      },
      {
        id: 'missiles',
        name: t('upg_missiles_name'),
        stat: t('stat_missile'),
        color: '#ff5500',
        level: this.player.upgrades.missiles,
        maxLevel: 4,
        desc: t('upg_missiles_desc')
      },
      {
        id: 'tesla',
        name: t('upg_tesla_name'),
        stat: t('stat_tesla'),
        color: '#38bdf8',
        level: this.player.upgrades.tesla || 0,
        maxLevel: 4,
        desc: t('upg_tesla_desc')
      },
      {
        id: 'drones',
        name: t('upg_drones_name'),
        stat: (this.player.upgrades.drones === 0 ? t('prev_drone1') : (this.player.upgrades.drones === 1 ? t('prev_drone_net') : t('prev_drone3'))),
        color: '#05ffa1',
        level: this.player.upgrades.drones,
        maxLevel: 3,
        desc: t('upg_drones_desc')
      },
      {
        id: 'emp',
        name: t('upg_emp_name'),
        stat: t('stat_emp'),
        color: '#ff0055',
        level: this.player.upgrades.emp,
        maxLevel: 3,
        desc: t('upg_emp_desc')
      },
      {
        id: 'shield',
        name: t('upg_shield_name'),
        stat: t('stat_shield15'),
        color: '#00f0ff',
        level: this.player.upgrades.shield,
        maxLevel: 4,
        desc: t('upg_shield_desc')
      },
      {
        id: 'magnet',
        name: t('upg_magnet_name'),
        stat: t('stat_magnet'),
        color: '#a855f7',
        level: this.player.upgrades.magnet,
        maxLevel: 4,
        desc: t('upg_magnet_desc')
      },
      {
        id: 'hull',
        name: t('upg_hull_name'),
        stat: t('stat_hull'),
        color: '#10b981',
        level: this.player.upgrades.hull || 0,
        maxLevel: 4,
        desc: t('upg_hull_desc')
      },
      {
        id: 'wingman',
        name: t('upg_wingman_name'),
        stat: (this.player.upgrades.wingman === 0 ? t('stat_wing0') : (this.player.upgrades.wingman === 1 ? t('stat_wing1') : t('stat_wing2'))),
        color: '#00f0ff',
        level: this.player.upgrades.wingman || 0,
        maxLevel: 3,
        desc: t('upg_wingman_desc')
      },
      {
        id: 'overload_reactor',
        name: t('syn_overload_name'),
        stat: t('syn_overload_stat'),
        color: '#bf5af2',
        level: this.player.synergies && this.player.synergies.overloadReactor ? 1 : 0,
        maxLevel: 1,
        desc: t('syn_overload_desc')
      },
      {
        id: 'apex_overdrive',
        name: t('syn_apex_name'),
        stat: t('syn_apex_stat'),
        color: '#ff0055',
        level: this.player.synergies && (this.player.synergies.apexOverdrive || this.player.synergies.apexWiper) ? 1 : 0,
        maxLevel: 1,
        desc: t('syn_apex_desc')
      },
      {
        id: 'crystal_shrapnel',
        name: t('syn_shrapnel_name'),
        stat: t('syn_shrapnel_stat'),
        color: '#05ffa1',
        level: this.player.synergies && this.player.synergies.crystalShrapnel ? 1 : 0,
        maxLevel: 1,
        desc: t('syn_shrapnel_desc')
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
        name: t('bonus_heal_name'),
        desc: t('bonus_heal_desc'),
        stat: '+45 HP',
        color: '#ff0055',
        isBonus: true
      },
      {
        id: 'bonus_crystals',
        name: t('bonus_crystals_name'),
        desc: t('bonus_crystals_desc'),
        stat: '+60 CR',
        color: '#ffbe0b',
        isBonus: true
      },
      {
        id: 'bonus_overdrive',
        name: t('bonus_overdrive_name'),
        desc: t('bonus_overdrive_desc'),
        stat: t('bonus_overdrive_stat'),
        color: '#bf5af2',
        isBonus: true
      }
    ];

    while (choices.length < 2 && fallbackOverdrives.length > 0) {
      choices.push(fallbackOverdrives.shift());
    }

    cardsContainer.innerHTML = '';
    choices.forEach((upgrade, idx) => {
      const card = document.createElement('div');
      card.className = `upgrade-item-card ${upgrade.isEvolution ? 'evolution-card' : ''}`;
      card.style.setProperty('--card-color', upgrade.color || '#00f0ff');
      card.style.setProperty('--card-glow', `${upgrade.color || '#00f0ff'}55`);
      card.style.animation = `jackpotCardPop 0.42s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.08}s both`;

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
        levelTag = `<span class="card-level-badge evolution-tag">${txt('card_evo_tag')}</span>`;
      } else if (upgrade.isBonus) {
        levelTag = `<span class="card-level-badge" style="background: rgba(255, 190, 11, 0.2); color: #ffbe0b; border: 1px solid #ffbe0b;">${txt('card_overdrive_tag')}</span>`;
      } else {
        levelTag = `<span class="card-level-badge">${t('card_level', { n: upgrade.level + 1, m: upgrade.maxLevel })}</span>`;
      }

      const SYNERGY_MAP = {
        laser: [
          { partner: 'magnet', name: txt('syn_vortex'), hasPartner: (this.player.upgrades.magnet || 0) >= 1 },
          { partner: 'shield', name: txt('syn_cryo'), hasPartner: (this.player.upgrades.shield || 0) >= 2 }
        ],
        missiles: [
          { partner: 'emp', name: txt('syn_nuke'), hasPartner: (this.player.upgrades.emp || 0) >= 1 },
          { partner: 'tesla', name: txt('syn_supernova'), hasPartner: (this.player.upgrades.tesla || 0) >= 3 }
        ],
        tesla: [
          { partner: 'fireRate', name: txt('syn_ion'), hasPartner: (this.player.upgrades.fireRate || 0) >= 4 },
          { partner: 'emp', name: txt('syn_doom'), hasPartner: (this.player.upgrades.emp || 0) >= 3 },
          { partner: 'missiles', name: txt('syn_supernova'), hasPartner: (this.player.upgrades.missiles || 0) >= 4 }
        ],
        drones: [
          { partner: 'shield', name: txt('syn_bastion'), hasPartner: (this.player.upgrades.shield || 0) >= 4 },
          { partner: 'magnet', name: txt('syn_vacuum'), hasPartner: (this.player.upgrades.magnet || 0) >= 3 },
          { partner: 'fireRate', name: txt('syn_saws'), hasPartner: (this.player.upgrades.fireRate || 0) >= 3 }
        ],
        emp: [
          { partner: 'missiles', name: txt('syn_nuke'), hasPartner: (this.player.upgrades.missiles || 0) >= 4 },
          { partner: 'tesla', name: txt('syn_doom'), hasPartner: (this.player.upgrades.tesla || 0) >= 4 }
        ],
        shield: [
          { partner: 'drones', name: txt('syn_bastion'), hasPartner: (this.player.upgrades.drones || 0) >= 3 },
          { partner: 'laser', name: txt('syn_cryo'), hasPartner: (this.player.upgrades.laser || 0) >= 4 }
        ],
        magnet: [
          { partner: 'laser', name: txt('syn_vortex'), hasPartner: (this.player.upgrades.laser || 0) >= 5 },
          { partner: 'drones', name: txt('syn_vacuum'), hasPartner: (this.player.upgrades.drones || 0) >= 3 }
        ],
        fireRate: [
          { partner: 'tesla', name: txt('syn_ion'), hasPartner: (this.player.upgrades.tesla || 0) >= 4 },
          { partner: 'hull', name: txt('syn_blade'), hasPartner: (this.player.upgrades.hull || 0) >= 3 }
        ],
        hull: [
          { partner: 'fireRate', name: txt('syn_blade'), hasPartner: (this.player.upgrades.fireRate || 0) >= 4 }
        ],
        wingman: [
          { partner: 'fireRate', name: txt('syn_cyber'), hasPartner: (this.player.upgrades.fireRate || 0) >= 3 },
          { partner: 'laser', name: txt('syn_twin'), hasPartner: (this.player.upgrades.laser || 0) >= 3 }
        ]
      };

      let synergyHtml = '';
      if (SYNERGY_MAP[upgrade.id]) {
        const sList = SYNERGY_MAP[upgrade.id];
        const readyS = sList.find(s => s.hasPartner);
        if (readyS) {
          synergyHtml = `<div class="card-synergy-pill ready"><svg class="pixel-icon pixel-icon-sm" viewBox="0 0 10 10" style="margin-right:2px"><path d="M6 1L2 5h3l-1 4 4-4H5l1-4z" fill="#ffbe0b"/></svg> ${t('card_synergy_ready', { name: readyS.name })}</div>`;
        } else {
          synergyHtml = `<div class="card-synergy-pill"><svg class="pixel-icon pixel-icon-sm" viewBox="0 0 10 10" style="margin-right:2px"><path d="M6 1L2 5h3l-1 4 4-4H5l1-4z" fill="#00f0ff"/></svg> ${t('card_synergy', { names: sList.map(s => s.name).join(' • ') })}</div>`;
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
          ${!upgrade.isEvolution && !upgrade.isBonus ? (() => {
            const lvl = upgrade.level;
            const previews = {
              laser: [t('prev_shots', { n: lvl + 1 }), t('prev_dmg', { n: 25 + lvl * 20 }), lvl === 1 ? t('prev_twin') : lvl === 2 ? t('prev_triple') : ''],
              fireRate: [t('prev_firerate', { n: 12 * (lvl + 1) })],
              missiles: [t('prev_missiles', { a: lvl, b: lvl + 1 })],
              tesla: [t('prev_chain', { n: lvl + 1 })],
              drones: [t('prev_drones', { a: lvl, b: lvl + 1 }), lvl === 0 ? t('prev_drone1') : lvl === 1 ? t('prev_drone_net') : t('prev_drone3')],
              emp: [t('prev_emp', { n: 25 * (lvl + 1) }), t('prev_emp_area', { n: 15 * (lvl + 1) })],
              shield: [t('prev_shield', { a: 20 + lvl * 15, b: 20 + (lvl + 1) * 15 }), t('prev_regen')],
              magnet: [t('prev_magnet', { a: 60 + lvl * 20, b: 60 + (lvl + 1) * 20 })],
              hull: [t('prev_hull', { a: 65 + lvl * 15, b: 65 + (lvl + 1) * 15 }), t('prev_repair')],
              wingman: [t('prev_clone'), t('prev_ship', { n: (lvl + 1) * 4 })],
              overload_reactor: [t('prev_overload')],
              apex_overdrive: [t('prev_apex')],
              crystal_shrapnel: [t('prev_shrapnel')]
            };
            const pts = (previews[upgrade.id] || []).filter(Boolean);
            return pts.length ? `<div class="card-preview-line">${getPixelIconSvg('energy', 'xs')} ${pts[0]}${pts[1] ? ` · ${pts[1]}` : ''}</div>` : '';
          })() : ''}
          ${synergyHtml}
        </div>
      `;

      card.addEventListener('click', () => {
        if (performance.now() < (this.modalInputLockUntil || 0)) return;
        this.applyUpgrade(upgrade.id);
      });

      cardsContainer.appendChild(card);
    });

    levelModal.classList.remove('hidden');
  }

  triggerEvolutionSurge(evoKey, evoColor = '#ffbe0b') {
    const rawKey = (typeof evoKey === 'string' ? evoKey.replace(/^evo_/, '') : (evoKey?.id || 'vortex')).replace(/^nano_/, '').replace(/_storm$/, '').replace(/_drones$/, '').toLowerCase();
    const key = rawKey.includes('vortex') ? 'vortex'
      : rawKey.includes('cluster') ? 'cluster'
      : rawKey.includes('ion') ? 'ion'
      : rawKey.includes('bastion') ? 'bastion'
      : rawKey.includes('cryo') ? 'cryo'
      : rawKey.includes('saws') ? 'saws'
      : rawKey.includes('supernova') ? 'supernova'
      : rawKey.includes('doomsday') || rawKey.includes('matrix') ? 'doomsday'
      : rawKey.includes('saber') || rawKey.includes('plasma') ? 'saber'
      : rawKey.includes('void') ? 'void'
      : 'vortex';

    const evoName = t('evo_' + key + '_name') || (typeof evoKey === 'string' ? evoKey : 'EVOLUTION');
    const evoDesc = t('evo_' + key + '_desc') || '';

    this.hitStopTimer = Math.max(this.hitStopTimer || 0, 8);
    this.screenShake = Math.max(this.screenShake || 0, 18);
    if (this.player) {
      // 3 saniye kesintisiz tam dokunulmazlık ve overcharge aurası
      this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer || 0, 180);
      this.player.overchargeTimer = Math.max(this.player.overchargeTimer || 0, 210);
    }
    this.particles.screenFlashAlpha = 0.65;
    this.particles.screenFlashColor = evoColor;
    this.particles.spawnShockwave(this.player.x, this.player.y, evoColor, 340);
    this.particles.spawnShockwave(this.player.x, this.player.y, '#ffffff', 220);
    this.particles.spawnExplosion(this.player.x, this.player.y, evoColor, 36, 5.5);
    this.particles.spawnFloatingText(this.player.x, this.player.y - 45, t('evo_float', { name: evoName }), evoColor, 20);

    // Kuantum Füzyon Sinematik Banner Gösterimi (Dopamin & Siberpunk Animasyon)
    const banner = document.getElementById('evolution-banner');
    if (banner) {
      const titleEl = document.getElementById('evo-banner-title');
      const descEl = document.getElementById('evo-banner-desc');
      const subEl = document.getElementById('evo-banner-sub');
      const tagEl = document.getElementById('evo-barrier-tag');
      const content = banner.querySelector('.evo-banner-content');

      if (titleEl) {
        titleEl.textContent = evoName;
        titleEl.style.textShadow = `0 0 14px ${evoColor}, 0 0 24px ${evoColor}`;
      }
      if (descEl) descEl.textContent = evoDesc;
      if (subEl) subEl.textContent = t('evo_banner_sub');
      if (tagEl) tagEl.textContent = t('evo_barrier_tag');
      if (content) {
        content.style.borderColor = evoColor;
        content.style.boxShadow = `0 0 28px ${evoColor}66, inset 0 0 16px ${evoColor}22`;
      }

      banner.classList.remove('hidden');
      if (this._evoBannerTimeout) clearTimeout(this._evoBannerTimeout);
      this._evoBannerTimeout = setTimeout(() => {
        if (banner) banner.classList.add('hidden');
      }, 2700);
    }

    sounds.playEvolution();
    vibrate.heavy();

    if (this.pilotStats) {
      this.pilotStats.totalEvolutions = (this.pilotStats.totalEvolutions || 0) + 1;
      this.savePilotStats();
    }

    // Ekrandaki tüm düşman mermilerini temizle
    const px = this.player.x;
    const py = this.player.y;
    if (Array.isArray(this.enemyProjectiles)) {
      for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
        const eb = this.enemyProjectiles[i];
        if (eb) this.particles.spawnExplosion(eb.x, eb.y, evoColor, 3, 1.5);
      }
      this.enemyProjectiles.length = 0;
    }

    // Yakındaki boss olmayan düşmanları dondur ve geriye it
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      if (!e || e.toRemove || e.hp <= 0) continue;
      const dx = e.x - px;
      const dy = e.y - py;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 420 && !e.isBoss && !(e.type && e.type.startsWith('boss'))) {
        e.frozen = Math.max(e.frozen || 0, 90);
        const push = (1 - dist / 420) * 45;
        e.x += (dx / dist) * push;
        e.y += (dy / dist) * push;
      }
    }
  }

  recordWeaponDamage(category, amount) {
    if (!amount || amount <= 0) return;
    if (!this.damageStats) {
      this.damageStats = { laser: 0, missiles: 0, tesla: 0, drones: 0, emp: 0 };
    }
    const mapped = category === 'special' ? 'emp' : category;
    const key = this.damageStats[mapped] !== undefined ? mapped : 'laser';
    this.damageStats[key] += amount;
  }

  renderDamageBreakdown() {
    const container = document.getElementById('go-damage-breakdown');
    if (!container) return;
    const stats = this.damageStats || { laser: 0, missiles: 0, tesla: 0, drones: 0, emp: 0 };
    const entries = [
      { key: 'laser', label: t('upg_laser'), color: '#00f0ff', val: Math.round(stats.laser || 0) },
      { key: 'missiles', label: t('upg_missiles'), color: '#ff5500', val: Math.round(stats.missiles || 0) },
      { key: 'tesla', label: t('upg_tesla'), color: '#7dd3fc', val: Math.round(stats.tesla || 0) },
      { key: 'drones', label: t('upg_drones'), color: '#05ffa1', val: Math.round(stats.drones || 0) },
      { key: 'emp', label: t('upg_emp'), color: '#d946ef', val: Math.round(stats.emp || 0) }
    ].filter(e => e.val > 0).sort((a, b) => b.val - a.val);

    const total = entries.reduce((sum, e) => sum + e.val, 0);
    if (total <= 0) {
      container.style.display = 'none';
      return;
    }

    const icons = { laser: 'fire', missiles: 'bomb', tesla: 'energy', drones: 'ship', emp: 'target' };
    container.style.display = 'block';
    const rowsHtml = entries.map(e => {
      const pct = Math.max(4, Math.round((e.val / total) * 100));
      const filled = Math.max(1, Math.round(pct / 100 * 10));
      let cells = '';
      for (let i = 0; i < 10; i++) cells += `<i class="px-cell${i < filled ? ' on' : ''}"></i>`;
      return `
        <div class="px-report-row" style="--px:${e.color}">
          <div class="px-report-ico">${getPixelIconSvg(icons[e.key] || 'sword', 'sm')}</div>
          <div class="px-report-main">
            <div class="px-report-meta">
              <span class="px-report-name">${e.label}</span>
              <span class="px-report-pct">${pct}%</span>
            </div>
            <div class="px-meter" aria-hidden="true">${cells}</div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="px-report-head">
        ${getPixelIconSvg('sword', 'sm')}
        <span>${t('gameover_dmg_title')}</span>
        <em>${total.toLocaleString()}</em>
      </div>
      <div class="px-report-list">${rowsHtml}</div>
    `;
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
      this.triggerEvolutionSurge('vortex', '#d946ef');
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'evo_cluster') {
      this.player.evolutions.clusterMissiles = true;
      this.triggerEvolutionSurge('cluster', '#ffbe0b');
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'evo_ion_storm') {
      this.player.evolutions.ionStorm = true;
      this.triggerEvolutionSurge('ion', '#38bdf8');
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'evo_nano_bastion') {
      this.player.evolutions.nanoBastion = true;
      this.player.maxShield += 30;
      this.player.shield = this.player.maxShield;
      this.triggerEvolutionSurge('bastion', '#05ffa1');
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'evo_cryo') {
      this.player.evolutions.cryoBlaster = true;
      this.triggerEvolutionSurge('cryo', '#00f0ff');
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'evo_saws') {
      this.player.evolutions.orbitalSaws = true;
      this.triggerEvolutionSurge('saws', '#ff5500');
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'evo_supernova') {
      this.player.evolutions.supernova = true;
      this.triggerEvolutionSurge('supernova', '#ff3d00');
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'evo_matrix') {
      this.player.evolutions.doomsdayMatrix = true;
      this.triggerEvolutionSurge('doomsday', '#bf5af2');
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'evo_hyper_plasma' || id === 'evo_hyper_saber') {
      this.player.evolutions.hyperPlasma = true;
      this.player.evolutions.hyperSaber = true;
      this.triggerEvolutionSurge('saber', '#05ffa1');
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'evo_void_drones') {
      this.player.evolutions.voidDrones = true;
      this.triggerEvolutionSurge('void', '#ffd700');
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'overload_reactor') {
      this.player.synergies.overloadReactor = true;
      sounds.playEvolution();
      vibrate.success();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#bf5af2', 240);
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'apex_overdrive' || id === 'apex_wiper') {
      this.player.synergies.apexOverdrive = true;
      this.player.synergies.apexWiper = true;
      sounds.playEvolution();
      vibrate.success();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ff0055', 260);
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'crystal_shrapnel') {
      this.player.synergies.crystalShrapnel = true;
      sounds.playEvolution();
      vibrate.success();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#05ffa1', 240);
      this.closeLevelModalAndResume();
      return;
    }

    if (id === 'bonus_heal') {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 45);
      sounds.playPowerup();
      vibrate.light();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#10b981', 160);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 25, '+45 HP ONARIM!', '#10b981', 15);
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'bonus_crystals') {
      const crystalMult = 1 + (this.masteryTree?.crystalBonus || 0) * 0.10;
      const gain = Math.round(60 * crystalMult);
      this.totalCrystals = (this.totalCrystals || 0) + gain;
      this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + gain;
      localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
      this.player.score += 1200;
      sounds.playJackpot();
      vibrate.success();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 180);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 25, `+${gain} KRİSTAL!`, '#ffbe0b', 16);
      this.updateCrystalsDisplay();
      this.updateHUD();
      this.closeLevelModalAndResume();
      return;
    }
    if (id === 'bonus_overdrive') {
      this.player.damageMultiplier = (this.player.damageMultiplier || 1.0) * 1.06;
      sounds.playEvolution();
      vibrate.heavy();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#bf5af2', 200);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 25, '+%6 HASAR!', '#bf5af2', 15);
      this.closeLevelModalAndResume();
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
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 240);
      this.particles.spawnExplosion(this.player.x, this.player.y, '#00f0ff', 18, 3.2);
      const label = t('upg_wingman_name');
      this.particles.spawnFloatingText(this.player.x, this.player.y - 35, label, '#00f0ff', 17);
      sounds.playLevelUp();
      sounds.playEvolution();
      vibrate.success();
      this.syncWingmen();
    }

    this.closeLevelModalAndResume();
  }

  triggerLuckyChest(immediate = false) {
    if (!immediate && this.state === 'PLAYING') {
      sounds.playJackpot();
      vibrate.success();
      this.screenShake = 12;
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffd700', 300);
      this.particles.spawnExplosion(this.player.x, this.player.y, '#ffbe0b', 28, 4.5);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 32, t('float_chest'), '#ffd700', 16);
      this.startModalTransition('LUCKY_CHEST', 28);
      return;
    }
    this.state = 'LUCKY_CHEST';
    this.modalInputLockUntil = performance.now() + 260;
    if (this.cancelDrag) this.cancelDrag();
    if (this.player) {
      this.player.targetX = this.player.x;
      this.player.targetY = this.player.y;
      this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer || 0, 75);
    }
    if (sounds.setPauseFilter) sounds.setPauseFilter(true);

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
      { id: 'laser', name: t('upg_laser_name'), stat: t('prev_dmg', { n: 25 }), color: '#00f0ff', level: this.player.upgrades.laser, maxLevel: 5, desc: t('upg_laser_desc') },
      { id: 'fireRate', name: t('upg_fireRate_name'), stat: t('prev_firerate', { n: 10 }), color: '#ffbe0b', level: this.player.upgrades.fireRate, maxLevel: 5, desc: t('upg_fireRate_desc') },
      { id: 'missiles', name: t('upg_missiles_name'), stat: t('stat_missile'), color: '#ff5500', level: this.player.upgrades.missiles, maxLevel: 4, desc: t('upg_missiles_desc') },
      { id: 'tesla', name: t('upg_tesla_name'), stat: t('stat_tesla'), color: '#38bdf8', level: this.player.upgrades.tesla || 0, maxLevel: 4, desc: t('upg_tesla_desc') },
      { id: 'drones', name: t('upg_drones_name'), stat: t('prev_drone1'), color: '#05ffa1', level: this.player.upgrades.drones, maxLevel: 3, desc: t('upg_drones_desc') },
      { id: 'emp', name: t('upg_emp_name'), stat: t('stat_emp'), color: '#ff0055', level: this.player.upgrades.emp, maxLevel: 3, desc: t('upg_emp_desc') },
      { id: 'shield', name: t('upg_shield_name'), stat: t('stat_shield15'), color: '#00f0ff', level: this.player.upgrades.shield, maxLevel: 4, desc: t('upg_shield_desc') },
      { id: 'magnet', name: t('upg_magnet_name'), stat: t('stat_magnet'), color: '#a855f7', level: this.player.upgrades.magnet, maxLevel: 4, desc: t('upg_magnet_desc') },
      { id: 'hull', name: t('upg_hull_name'), stat: t('stat_hull'), color: '#10b981', level: this.player.upgrades.hull || 0, maxLevel: 4, desc: t('upg_hull_desc') },
      { id: 'wingman', name: t('upg_wingman_name'), stat: t('stat_wing0'), color: '#00f0ff', level: this.player.upgrades.wingman || 0, maxLevel: 3, desc: t('upg_wingman_desc') }
    ].filter(u => u.level < u.maxLevel);

    const pool = [...evolutions, ...availableUpgrades.sort(() => 0.5 - Math.random())];
    
    // KULLANICI İSTEĞİ: Sandık açıldığında 3 ganimet tek seferde ilk açışta hazır gelsin!
    const rewardCount = Math.min(pool.length, 3);
    this.pendingChestRewards = pool.slice(0, Math.max(1, rewardCount));
    this.pendingChestBonusReward = null;
    this.pendingChestIsJackpot = this.pendingChestRewards.some(r => r.isEvolution) || rewardCount >= 3;

    if (jackpotBadge) {
      jackpotBadge.classList.remove('hidden');
      jackpotBadge.textContent = this.pendingChestIsJackpot ? '[BÜYÜK İKRAMİYE: 3X]' : '[ŞANSLI SANDIK]';
    }

    if (luckyChestTitle) {
      luckyChestTitle.textContent = this.pendingChestIsJackpot ? '[BÜYÜK İKRAMİYE SANDIĞI]' : t('chest_title');
      luckyChestTitle.style.color = '#ffbe0b';
    }

    if (luckyChestSubtitle) {
      luckyChestSubtitle.textContent = t('chest_select_hint');
    }

    this.selectedChestRewardIndex = 0;

    if (luckyChestContainer) {
      luckyChestContainer.innerHTML = '';
      this.pendingChestRewards.forEach((item, idx) => {
        const row = this.renderChestRewardCard(item, idx);
        luckyChestContainer.appendChild(row);
      });
    }

    const btnClaimChest = document.getElementById('btn-claim-chest');
    if (btnClaimChest) {
      btnClaimChest.textContent = t('chest_claim_single');
    }

    const btnAdChestAll = document.getElementById('btn-ad-chest-all');
    const btnAdChestAllText = document.getElementById('btn-ad-chest-all-text');
    if (btnAdChestAll) {
      btnAdChestAll.disabled = false;
    }
    if (btnAdChestAllText) {
      btnAdChestAllText.textContent = t('chest_claim_all_ad');
    }

    try { history.pushState({ modal: 'lucky_chest' }, ''); } catch(e) {}
    if (luckyChestModal) luckyChestModal.classList.remove('hidden');
  }

  renderChestRewardCard(item, idx) {
    const row = document.createElement('div');
    const isSelected = idx === this.selectedChestRewardIndex;
    row.className = `upgrade-item-card ${item.isEvolution ? 'evolution-card' : ''} ${isSelected ? 'selected' : ''}`;
    row.style.setProperty('--card-color', item.color || '#ffbe0b');
    row.style.setProperty('--card-glow', `${item.color || '#ffbe0b'}55`);
    row.style.animation = `jackpotCardPop 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${idx * 0.14}s backwards`;

    row.addEventListener('click', () => {
      this.selectedChestRewardIndex = idx;
      if (luckyChestContainer) {
        const cards = luckyChestContainer.querySelectorAll('.upgrade-item-card');
        cards.forEach((c, i) => {
          if (i === idx) c.classList.add('selected');
          else c.classList.remove('selected');
        });
      }
      sounds.playCardSelect();
      vibrate.light();
    });

    const tag = item.isEvolution ? `<span class="card-level-badge evolution-tag">${t('card_tag_evo') || 'EFSANEVİ EVRİM'}</span>` : `<span class="card-level-badge">${t('card_tag_free') || 'ÜCRETSİZ GELİŞTİRME'}</span>`;

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

  watchAdForChestAll() {
    const btn = document.getElementById('btn-ad-chest-all');
    const btnText = document.getElementById('btn-ad-chest-all-text');
    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = t('ad_preparing') || 'Reklam Hazırlanıyor...';

    const onRewardSuccess = () => {
      this.claimLuckyChest(true, true);
    };

    const onError = (err) => {
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = t('chest_claim_all_ad');
      noteAdMiss(this, err);
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

  claimLuckyChest(claimAll = false, force = false) {
    if (!force && performance.now() < (this.modalInputLockUntil || 0)) return;
    sounds.playLevelUp();
    sounds.playCardSelect();
    vibrate.success();

    if (this.pilotStats) {
      this.pilotStats.totalChests = (this.pilotStats.totalChests || 0) + 1;
      this.savePilotStats();
    }

    const isJackpot = this.pendingChestIsJackpot;
    const crystalMult = 1 + (this.masteryTree?.crystalBonus || 0) * 0.10;
    const bonusCrystals = Math.round((isJackpot ? (claimAll ? 60 : 30) : (claimAll ? 40 : 20)) * crystalMult);
    this.totalCrystals += bonusCrystals;
    this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + bonusCrystals;
    localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    this.updateCrystalsDisplay();

    // Kalkanı full tamir et ve ekstra can ver
    this.player.shield = this.player.maxShield;
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + (isJackpot ? 40 : 20));

    const rewardsToApply = claimAll
      ? (this.pendingChestRewards || [])
      : [this.pendingChestRewards[this.selectedChestRewardIndex || 0] || this.pendingChestRewards[0]];

    if (rewardsToApply && rewardsToApply.length > 0) {
      for (let item of rewardsToApply) {
        if (!item) continue;
        if (item.id.startsWith('evo_')) {
          this.triggerEvolutionSurge(item.id, item.color || '#ffbe0b');
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
        } else if (item.id === 'evo_hyper_saber' || item.id === 'evo_hyper_plasma') {
          this.player.evolutions.hyperSaber = true;
          this.player.evolutions.hyperPlasma = true;
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
          } else if (item.id === 'wingman') {
            this.syncWingmen();
          }
        }
      }
      this.pendingChestRewards = [];
    }

    if (luckyChestModal) luckyChestModal.classList.add('hidden');
    if (sounds.setPauseFilter) sounds.setPauseFilter(false);
    this.particles.spawnShockwave(this.player.x, this.player.y, '#ffd700', 320);
    this.particles.spawnExplosion(this.player.x, this.player.y, '#ffbe0b', 32, 5);
    this.screenShake = 8;
    this.particles.spawnFloatingText(this.player.x, this.player.y - 30, `+${bonusCrystals} CR!`, '#ffd700', 16);
    if (this.isMerchantActive || (merchantModal && !merchantModal.classList.contains('hidden'))) {
      this.state = 'MERCHANT';
      this.updateHUD();
      return;
    }
    this.startSmoothResume(34);
    this.updateHUD();
  }

  // Yerel olay günlüğü (Faz 0 ölçüm): son 300 olayı saklar, sunucuya hiçbir şey göndermez
  logEvent(name, data = {}) {
    try {
      const raw = localStorage.getItem('neon_events');
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ t: Date.now(), e: name, ...data });
      while (arr.length > 300) arr.shift();
      localStorage.setItem('neon_events', JSON.stringify(arr));
    } catch (e) {}
  }

  // Kademeli menü: arayüz elementleri kontrolü
  applyMenuProgression() {
    // Dock sekmeleri ve ana menü her zaman eksiksiz ve dengeli görünür
    const dockButtons = ['btn-hangar', 'btn-missions', 'btn-menu', 'btn-daily-reward', 'btn-leaderboard'];
    dockButtons.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });
  }

  // Ölüm ekranı kancası: rekora ne kadar kaldı + tek dokunuşla kalıcı yükseltme
  buildGameOverHook(prevBest, isNewRecord) {
    const score = this.player ? this.player.score : 0;
    if (finalHighScore) finalHighScore.textContent = (this.highScores[this.currentMode] || 0).toLocaleString();

    const hook = document.getElementById('go-hook');
    if (hook) {
      if (isNewRecord && prevBest > 0) {
        hook.className = 'go-hook-banner record-banner';
        hook.innerHTML = `<span>${t('go_new_record')}</span> <strong>${score.toLocaleString()}</strong> <em>(${t('go_prev_best', { n: prevBest.toLocaleString() })})</em>`;
      } else if (isNewRecord) {
        hook.className = 'go-hook-banner record-banner';
        hook.innerHTML = `<span>${t('go_first_record')}</span> <strong>${score.toLocaleString()}</strong>`;
      } else {
        const left = Math.max(1, prevBest - score + 1);
        hook.className = 'go-hook-banner target-banner';
        hook.innerHTML = `<span>${t('go_target_left', { n: left.toLocaleString() })}</span> <em>(${t('go_best_label', { n: prevBest.toLocaleString() })})</em>`;
      }
    }

    // Günlük Görev İlerlemesi (1 El Daha Oyna İntikam Kancası)
    const missionCard = document.getElementById('go-mission-card');
    if (missionCard && Array.isArray(this.dailyMissions) && this.dailyMissions.length > 0) {
      // Tamamlanmamış ve hedefe en yakın görevi bul
      const pendingMissions = this.dailyMissions.filter(m => !m.claimed);
      if (pendingMissions.length > 0) {
        // Hedefe oran olarak en yakın olanı seç
        const bestMission = pendingMissions.slice().sort((a, b) => {
          const pctA = Math.min(1, (a.current || 0) / (a.goal || 1));
          const pctB = Math.min(1, (b.current || 0) / (b.goal || 1));
          return pctB - pctA;
        })[0];

        const cur = bestMission.current || 0;
        const goal = bestMission.goal || 1;
        const pct = Math.min(100, Math.round((cur / goal) * 100));
        const rem = Math.max(0, goal - cur);

        const badgeText = document.getElementById('go-mission-badge-text');
        if (badgeText) badgeText.textContent = t('go_mission_label');
        const pctEl = document.getElementById('go-mission-percent');
        if (pctEl) pctEl.textContent = `${pct}%`;
        const fillEl = document.getElementById('go-mission-fill');
        if (fillEl) fillEl.style.width = `${pct}%`;
        const descEl = document.getElementById('go-mission-desc');
        if (descEl) {
          const mDesc = t('mission_' + bestMission.id + '_desc') || bestMission.desc || '';
          if (cur >= goal) {
            descEl.innerHTML = `<strong>${mDesc}</strong> — <span style="color:#05ffa1;">${t('go_mission_completed')}</span>`;
          } else {
            descEl.innerHTML = `<strong>${mDesc}</strong> — <span style="color:#00f0ff;">${t('go_mission_remaining', { rem })}</span>`;
          }
        }
        missionCard.style.display = 'block';
      } else {
        missionCard.style.display = 'none';
      }
    } else if (missionCard) {
      missionCard.style.display = 'none';
    }

    // === İLERLEME & İNTİKAM KANCASI (ATÖLYE VE HANGAR GÜÇLENDİRME REHBERİ) ===
    const revengeCard = document.getElementById('go-revenge-card');
    if (revengeCard) {
      const allUpgrades = this.getTechCatalog()
        .map(item => ({ item, lvl: this.techUpgrades[item.id] || 0 }))
        .filter(o => o.lvl < o.item.maxLevel)
        .map(o => ({ ...o, cost: o.item.costs[o.lvl] }))
        .sort((a, b) => a.cost - b.cost);

      const titleEl = document.getElementById('go-revenge-title');
      const pillEl = document.getElementById('go-revenge-cost-pill');
      const bodyEl = document.getElementById('go-revenge-body');
      const actionBtn = document.getElementById('go-revenge-action-btn');
      const btnText = document.getElementById('go-revenge-btn-text');

      const affordable = allUpgrades.filter(o => o.cost <= this.totalCrystals);

      if (affordable.length > 0) {
        // Durum A: Oyuncunun kristali en az bir yükseltmeye YETİYOR!
        const best = affordable[0];
        revengeCard.style.display = 'flex';
        if (titleEl) titleEl.textContent = t('go_revenge_title_ready');
        if (pillEl) pillEl.textContent = `${best.cost.toLocaleString()} CR`;
        if (bodyEl) {
          bodyEl.textContent = t('go_revenge_body_ready', {
            item: best.item.name,
            lvl: best.lvl + 1
          });
        }
        if (btnText) btnText.textContent = `${t('go_revenge_btn_upgrade')} (${best.cost.toLocaleString()} CR)`;
        if (actionBtn) {
          actionBtn.className = 'go-revenge-action-btn ready-mode';
          actionBtn.onclick = () => {
            sounds.init();
            if (this.totalCrystals < best.cost) return;
            this.totalCrystals -= best.cost;
            this.techUpgrades[best.item.id] = best.lvl + 1;
            localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
            this.saveTechUpgrades();
            sounds.playLevelUp();
            vibrate.success();
            this.updateCrystalsDisplay();
            this.logEvent('revenge_upgrade', { id: best.item.id, lvl: best.lvl + 1 });
            this.showToast(t('toast_upgraded', { name: best.item.name }), '#05ffa1');
            this.buildGameOverHook(prevBest, isNewRecord);
          };
        }
      } else if (allUpgrades.length > 0) {
        // Durum B: Kristal yetmiyor ama en yakın yükseltme çok yakın!
        const nearest = allUpgrades[0];
        const rem = nearest.cost - this.totalCrystals;
        revengeCard.style.display = 'flex';
        if (titleEl) titleEl.textContent = t('go_revenge_title_near');
        if (pillEl) pillEl.textContent = `${this.totalCrystals.toLocaleString()}/${nearest.cost.toLocaleString()} CR`;
        if (bodyEl) {
          bodyEl.textContent = t('go_revenge_body_near', {
            rem: rem.toLocaleString(),
            item: nearest.item.name,
            lvl: nearest.lvl + 1
          });
        }
        if (btnText) btnText.textContent = t('btn_retry');
        if (actionBtn) {
          actionBtn.className = 'go-revenge-action-btn';
          actionBtn.onclick = () => {
            const btnRestart = document.getElementById('btn-restart');
            if (btnRestart) btnRestart.click();
          };
        }
      } else {
        // Durum C: Tüm atölye yükseltmeleri tamamlanmışsa kilitli gemi var mı bak
        const lockedSkins = Object.values(this.skins).filter(s => !s.unlocked);
        if (lockedSkins.length > 0) {
          const nextShip = lockedSkins[0];
          revengeCard.style.display = 'flex';
          if (titleEl) titleEl.textContent = t('go_revenge_title_ship');
          if (pillEl) pillEl.textContent = `${nextShip.cost.toLocaleString()} CR`;
          if (bodyEl) bodyEl.textContent = t('go_revenge_body_ship', { ship: t(`ship_${nextShip.id}_name`) || nextShip.name });
          if (btnText) btnText.textContent = t('btn_hangar');
          if (actionBtn) {
            actionBtn.className = 'go-revenge-action-btn';
            actionBtn.onclick = () => {
              const hangarBtn = document.getElementById('btn-gameover-hangar');
              if (hangarBtn) hangarBtn.click();
            };
          }
        } else {
          revengeCard.style.display = 'none';
        }
      }
    }
  }

  gameOver() {
    if (this.isTestFlight) {
      this.endShipTestFlight();
      return;
    }
    this.clearSuspendedRun();
    this.isMerchantActive = false;
    this.modalTransition = null;
    this.resumeRampTimer = 0;
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

    const prevBest = this.highScores[this.currentMode] || 0;
    const isNewRecord = this.player.score > prevBest;
    if (isNewRecord) {
      this.highScores[this.currentMode] = this.player.score;
      localStorage.setItem(`neon_high_score_${this.currentMode}`, this.highScores[this.currentMode].toString());
      localStorage.setItem('neon_space_high_score', this.highScores['classic'].toString());
    }
    const gamesPlayed = parseInt(localStorage.getItem('neon_games_played') || '0', 10) + 1;
    localStorage.setItem('neon_games_played', gamesPlayed.toString());
    this.noteQuietRunForAdGap();
    this.logEvent('run_end', { score: this.player.score, time: Math.round(this.gameTime), level: this.player.level, mode: this.currentMode, record: isNewRecord });
    this.applyMenuProgression();
    this.buildGameOverHook(prevBest, isNewRecord);
    this.renderDamageBreakdown();

    const mins = Math.floor(this.gameTime / 60).toString().padStart(2, '0');
    const secs = (this.gameTime % 60).toString().padStart(2, '0');

    finalScore.textContent = this.player.score.toLocaleString();
    finalTime.textContent = `${mins}:${secs}`;
    finalLevel.textContent = this.player.level.toString();
    const earned = this.crystalsEarnedThisRun || 0;
    // Roguelite Yenil & Yükselt Döngüsü: Oyuncu öldüğünde asla eli boş dönmez!
    // Minimum 30 kristal + süre ve seviye bonusu garanti edilir.
    const consolationBonus = Math.max(30, Math.round(this.gameTime * 0.65) + (this.player.level * 5));
    const extraReward = Math.max(0, consolationBonus - earned);
    if (extraReward > 0) {
      this.totalCrystals += extraReward;
      this.crystalsEarnedThisRun = (this.crystalsEarnedThisRun || 0) + extraReward;
      localStorage.setItem('neon_total_crystals', this.totalCrystals.toString());
    }

    const totalRunGain = this.crystalsEarnedThisRun || 0;
    const baseGain = Math.max(35, totalRunGain);

    if (finalCrystals) finalCrystals.textContent = `+${totalRunGain.toLocaleString()} CR`;
    const finalCrystalsBoosted = document.getElementById('final-crystals-boosted');
    if (finalCrystalsBoosted) {
      finalCrystalsBoosted.textContent = `+${totalRunGain.toLocaleString()} CR`;
      finalCrystalsBoosted.style.color = '#ffd700';
    }

    this.gameOverAdUsed = false;
    const btnDoubleCrystals = document.getElementById('btn-double-crystals');
    if (btnDoubleCrystals) {
      btnDoubleCrystals.disabled = false;
      btnDoubleCrystals.classList.remove('done');
      btnDoubleCrystals.innerHTML = `<span id="btn-double-crystals-text">${t('gameover_double_ad', { n: baseGain })}</span>`;
    }

    const freeRevives = parseInt(localStorage.getItem('neon_bonus_revives') || '0', 10);
    const btnAdRevive = document.getElementById('btn-ad-revive');
    if (btnAdRevive) {
      if ((this.revivesUsed || 0) >= 1) {
        btnAdRevive.style.display = 'none';
      } else {
        btnAdRevive.style.display = 'flex';
        if (freeRevives > 0) {
          btnAdRevive.innerHTML = `<svg class="pixel-icon pixel-icon-md" viewBox="0 0 16 16"><path d="M8 1v6M8 9v6M1 8h6M9 8h6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg> <span class="btn-main-text">${t('btn_revive_action')}</span> <span class="btn-pill-tag">${t('btn_revive_free', { n: freeRevives })}</span>`;
        } else {
          btnAdRevive.innerHTML = `<svg class="pixel-icon pixel-icon-md" viewBox="0 0 16 16"><polygon points="5,3 13,8 5,13" fill="currentColor"/></svg> <span class="btn-main-text">${t('btn_revive_action')}</span> <span class="btn-pill-tag">${t('btn_revive_ad')}</span>`;
        }
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

  noteQuietRunForAdGap() {
    if (this.adGapCounted || this.runSawRewardedAd) return;
    if ((this.gameTime || 0) < 60) return;
    const gamesPlayed = parseInt(localStorage.getItem('neon_games_played') || '0', 10);
    if (gamesPlayed <= 2) return;
    this.adGapCounted = true;
    const quietRuns = parseInt(localStorage.getItem('neon_runs_since_any_ad') || '0', 10) + 1;
    localStorage.setItem('neon_runs_since_any_ad', String(quietRuns));
  }

  maybeOfferMenuInterstitial() {
    if (this.menuBreakAdOffered) return;
    this.menuBreakAdOffered = true;
    if (this.runSawRewardedAd) return;
    if ((this.gameTime || 0) < 60) return;
    const gamesPlayed = parseInt(localStorage.getItem('neon_games_played') || '0', 10);
    if (gamesPlayed <= 2) return;
    const quietRuns = parseInt(localStorage.getItem('neon_runs_since_any_ad') || '0', 10);
    if (quietRuns < 4) return;
    if (window.triggerGameOverInterstitial) window.triggerGameOverInterstitial();
  }

  executeRevive() {
    this.revivesUsed = (this.revivesUsed || 0) + 1;
    if (gameoverModal) gameoverModal.classList.add('hidden');
    this.startSmoothResume(34);
    if (this.player) {
      this.player.hp = Math.round(this.player.maxHp * 0.6);
      this.player.shield = this.player.maxShield;
      this.player.invulnerableTimer = 180; // 3 saniye dokunulmazlık
      this.particles.spawnShockwave(this.player.x, this.player.y, '#ffd700', 300);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 40, t('float_revived'), '#ffd700', 18);
    }
    sounds.playJackpot();
    sounds.startBGM();
    vibrate.success();
  }

  // === OYUN DÖNGÜSÜ GÜNCELLEME ===
  update(dt = 1.0) {
    this.frames = (this.frames || 0) + 1;
    if (this._perkCd) {
      for (const perkKey in this._perkCd) {
        if (this._perkCd[perkKey] > 0) this._perkCd[perkKey] -= dt;
      }
    }

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

    const isMerchantModalVisible = Boolean(merchantModal && !merchantModal.classList.contains('hidden'));
    const isMerchantTransitioning = Boolean(this.modalTransition && this.modalTransition.type === 'MERCHANT');
    if (this.state === 'MERCHANT' || isMerchantModalVisible || (this.isMerchantActive && !isMerchantTransitioning)) {
      if (this.state === 'PLAYING' && isMerchantModalVisible) {
        this.state = 'MERCHANT';
      }
      this.particles.update(this.width, this.height);
      return;
    }

    if (this.state !== 'PLAYING') {
      this.particles.update(this.width, this.height);
      return;
    }

    // Vuruş Ağırlığı & Mikro Donma (Hit Stop): Mermi darbelerinde 2 kare dünyayı dondurur
    if (this.deathPop > 0) {
      this.deathPop -= dt;
      if (this.player) this.player.hitFlash = Math.max(this.player.hitFlash || 0, 4);
      this.particles.update(this.width, this.height);
      if (this.screenShake > 0) this.screenShake = Math.max(0, this.screenShake - dt * 0.7);
      if (this.deathPop <= 0) {
        if (this.player && this.particles) {
          this.particles.spawnExplosion(this.player.x, this.player.y, '#ffffff', 12, 4.4);
          this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 80);
        }
        this.screenShake = Math.max(this.screenShake || 0, 6);
        this.gameOver();
      }
      return;
    }

    if (this.hitStopTimer > 0) {
      this.hitStopTimer -= dt;
      // Parçacıklar ve ekran sarsıntısı donmaz, hafif hareket eder
      if (this.screenShake > 0) {
        this.screenShake = Math.max(0, this.screenShake - dt * 0.85);
      }
      return;
    }

    // Kombo Zamanlayıcısı
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    // === BAŞLANGIÇ METEOR KÜTLESİ VE MERKEZ KIRMIZI BOMBA YÖNETİMİ ===
    if (this.openingHookGap > 0) {
      this.openingHookGap -= dt;
      if (this.openingHookGap <= 0) {
        this.spawnOpeningMeteorCluster(this.wave);
      }
    } else if (this.openingSwarmPhase > 0) {
      this.openingClusterTimer = (this.openingClusterTimer || 0) + dt;

      const remainingCluster = this.enemies.filter(e => e.isOpeningCluster && !e.toRemove && e.hp > 0);
      if (remainingCluster.length === 0 || this.openingClusterTimer > 720) {
        for (const rock of remainingCluster) {
          rock.hp = 0;
          rock.toRemove = true;
        }
        if ((this.openingHooksLeft || 0) > 1) {
          this.openingHooksLeft -= 1;
          this.openingHookGap = 48;
          this.openingClusterTimer = 0;
        } else {
          const wasHook = (this.openingHooksLeft || 0) > 0;
          this.openingHooksLeft = 0;
          this.openingHookGap = 0;
          this.openingSwarmPhase = 0;
          if (wasHook) this.nextMeteorHookTime = this.gameTime + 80;
        }
      }
    } else if (
      this.gameTime >= (this.nextMeteorHookTime || 0) &&
      this.nextMeteorHookTime > 0 &&
      !this.currentBoss &&
      !this.stormBossWarningTriggered &&
      !this.levelBossWarningTriggered
    ) {
      const crowding = this.enemies.filter(e => e.hp > 0 && !e.toRemove && !(e.type && e.type.startsWith('boss'))).length;
      if (crowding < 7) {
        const belt = Math.min(9, Math.floor(this.gameTime / 36));
        this.spawnOpeningMeteorCluster(this.wave, true, belt);
        this.nextMeteorHookTime = this.gameTime + 34 + belt * 2;
      } else {
        this.nextMeteorHookTime = this.gameTime + 8;
      }
    }

    // 120Hz/60Hz ekranlarda gerçek saniye hesabı
    this.timeAccumulator = (this.timeAccumulator || 0) + (dt / 60);
    if (this.timeAccumulator >= 1.0) {
      const addedSecs = Math.floor(this.timeAccumulator);
      this.gameTime += addedSecs;
      this.timeAccumulator -= addedSecs;
      sounds.setCombatIntensity(Math.min(1.0, this.gameTime / 180));
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
          if (enemy.hp > 0 && !enemy.toRemove && Math.hypot(enemy.x - sx, enemy.y - sy) < 26 + enemy.radius) {
            const sawDmg = 1.6 * dt * (this.player.damageMultiplier || 1.0);
            this.applyCappedEnemyDamage(enemy, sawDmg);
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
    const skinSpeed = this.player.speedMultiplier || 1;
    const overthrust = (this.currentSkinId === 'cyberpunk' && this.player.adrenalineTimer > 0) ? 1.25 : 1;
    const moveSpeed = 5.4 * dt * skinSpeed * overthrust;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.player.targetX -= moveSpeed;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) this.player.targetX += moveSpeed;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) this.player.targetY -= moveSpeed;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) this.player.targetY += moveSpeed;

    // Yumuşak İnterpolasyon (Smooth Follow - Dengeli ve oturaklı başlangıç kontrolü)
    const dx = this.player.targetX - this.player.x;
    const dy = this.player.targetY - this.player.y;
    const moveDist = Math.hypot(dx, dy);
    const follow = Math.min(1, 0.24 * dt * (this.player.speedMultiplier || 1) * ((this.currentSkinId === 'cyberpunk' && this.player.adrenalineTimer > 0) ? 1.25 : 1));
    this.player.x += dx * follow;
    this.player.y += dy * follow;
    if (this.player.knockX || this.player.knockY) {
      this.player.x += this.player.knockX || 0;
      this.player.y += this.player.knockY || 0;
      this.player.knockX *= 0.5;
      this.player.knockY *= 0.5;
      if (Math.abs(this.player.knockX) < 0.04) this.player.knockX = 0;
      if (Math.abs(this.player.knockY) < 0.04) this.player.knockY = 0;
    }
    this.player.x = Math.max(24, Math.min(this.width - 24, this.player.x));
    this.player.y = Math.max(48, Math.min(this.height - 36, this.player.y));
    // Kuantum Faz Sayacı (Phantom Jet Özel Koruması) & Diriliş Dokunulmazlığı
    if (this.player.phaseTimer > 0) this.player.phaseTimer -= dt;
    if (this.player.phaseCooldown > 0) this.player.phaseCooldown -= dt;
    if (this.player.invulnerableTimer > 0) this.player.invulnerableTimer = Math.max(0, this.player.invulnerableTimer - dt);

    // Hangar 15 Saniyelik Gemi Test Uçuşu Sayacı (Part 3.4)
    if (this.isTestFlight) {
      this.testFlightTimer = (this.testFlightTimer || 0) - dt;
      if (this.enemies.length < 6 && this.frames % 30 === 0) {
        const sx = 40 + Math.random() * (this.width - 80);
        const types = ['asteroid_m', 'scout', 'asteroid_bomb', 'asteroid_gold'];
        this.enemies.push(new Enemy(sx, -30, types[Math.floor(Math.random() * types.length)], 0.85, 0.9));
      }
      if (this.testFlightTimer <= 0) {
        this.endShipTestFlight();
        return;
      }
    }

    // Asit İzi & Zehir Emisyonu (Toxic Jet Özel Yeteneği)
    if (this.currentSkinId === 'toxic' && (this.frames % 12 === 0)) {
      this.particles.spawnExplosion(this.player.x + (Math.random() * 12 - 6), this.player.y + 16, '#05ffa1', 2, 1.2);
      for (let enemy of this.enemies) {
        if (enemy.hp > 0 && !enemy.toRemove && Math.abs(enemy.x - this.player.x) < 36 && enemy.y > this.player.y && enemy.y < this.player.y + 70) {
          const applied = this.applyCappedEnemyDamage(enemy, 2.2 * dt, false);
          this.recordWeaponDamage('special', applied);
          if (enemy.hp <= 0) {
            this.handleEnemyDeath(enemy);
          }
        }
      }
    }

    if (this.currentSkinId === 'vortex') {
      this.player.vortexTimer = (this.player.vortexTimer || 0) + dt;
      if (this.player.vortexTimer >= 360) {
        this.player.vortexTimer = 0;
        sounds.playLaser();
        this.vortices.push({
          x: this.player.x,
          y: Math.max(70, this.player.y - 130),
          timer: 90,
          radius: 78,
          isNovaVortex: true,
          isShipSingularity: true
        });
        this.particles.spawnShockwave(this.player.x, this.player.y - 40, '#bf5af2', 70);
      }
    }

    if (this.currentSkinId === 'chrono') {
      this.player.chronoTimer = (this.player.chronoTimer || 0) + dt;
      if (this.player.chronoTimer >= 480) {
        this.player.chronoTimer = 0;
        sounds.playCrit();
        this.particles.spawnShockwave(this.player.x, this.player.y, '#ffd700', 160);
        this.particles.spawnFloatingText(this.player.x, this.player.y - 30, t('perk_chrono_freeze'), '#ffd700', 14);
        for (let enemy of this.enemies) {
          if (enemy.hp > 0 && !enemy.toRemove) {
            const boss = enemy.isBoss || (enemy.type && String(enemy.type).startsWith('boss'));
            enemy.freezeTimer = boss ? 0 : 90;
            if (boss) enemy.slowTimer = 90;
          }
        }
        for (let ep of this.enemyProjectiles) {
          ep.freezeTimer = 90;
        }
      }
    }

    if (!this.fireZones) this.fireZones = [];
    for (let fi = this.fireZones.length - 1; fi >= 0; fi--) {
      const zone = this.fireZones[fi];
      zone.timer -= dt;
      if (this.frames % 8 === 0) {
        this.particles.spawnExplosion(zone.x + (Math.random() * 40 - 20), zone.y + (Math.random() * 40 - 20), '#ff3d00', 2, 1.1);
      }
      for (let enemy of this.enemies) {
        if (enemy.hp <= 0 || enemy.toRemove) continue;
        if (Math.hypot(enemy.x - zone.x, enemy.y - zone.y) < zone.radius) {
          const burned = this.applyCappedEnemyDamage(enemy, (zone.dps || 6) * dt * 0.35, false);
          this.recordWeaponDamage('special', burned);
          if (enemy.hp <= 0) this.handleEnemyDeath(enemy);
        }
      }
      if (zone.timer <= 0) this.fireZones.splice(fi, 1);
    }

    // === 2 DİNAMİK TAKTİKSEL MOD: ÜSTTE AĞIR BALYOZ (TUK-TUK) // ALTTA SERİ SALDIRI ===
    const zoneThreshold = this.height * 0.70;
    const currentZone = (this.player.y < zoneThreshold) ? 'front' : 'rear';

    if (this.player.combatZone !== currentZone) {
      const prevZone = this.player.combatZone;
      this.player.combatZone = currentZone;
      if (prevZone) {
        sounds.playJetMorph(currentZone);
        // Telefon üzerinde güçlü ve kesin hissedilen haptik vuruş
        vibrate.heavy();
        this.player.zoneFlash = 1.0; // Jet üzerinde anlık reaktif parlama
        this.player.morphAnim = 1.0; // Transformers / mekanik dönüşüm sayacı
        this.player.zoneTransitionAnim = 1.0;
        this.zoneLineFlashTimer = 35; // Sınır çizgisinde tam ekran lazer parlaması
        this.zoneLineFlashZone = currentZone;

        const zColor = currentZone === 'front' ? '#38bdf8' : '#ff0055';
        if (localStorage.getItem('neon_zone_hint') !== '1') {
          const hintKey = currentZone === 'front' ? 'tut_zone_front' : 'tut_zone_rear';
          this.particles.spawnFloatingText(this.player.x, this.player.y - 42, txt(hintKey), zColor, 13);
          const seen = (this._zoneHints || '') + currentZone;
          this._zoneHints = seen;
          if (seen.includes('front') && seen.includes('rear')) localStorage.setItem('neon_zone_hint', '1');
        }
        this.player.zoneBannerTimer = 0;
        this.particles.spawnShockwave(this.player.x, this.player.y, '#ffffff', 52);
        this.particles.spawnShockwave(this.player.x, this.player.y, zColor, 75);
        for (let s = 0; s < 10; s++) {
          this.particles.spawnExplosion(this.player.x + (Math.random() * 28 - 14), this.player.y + (Math.random() * 28 - 14), zColor, 3, 1.5);
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

    // Evrim / Dönüşüm Animasyonu & Zone Banner Sönümlemesi
    if (this.player.morphAnim > 0) {
      this.player.morphAnim = Math.max(0, this.player.morphAnim - 0.05 * dt);
    }
    if (this.player.zoneBannerTimer > 0) {
      this.player.zoneBannerTimer = Math.max(0, this.player.zoneBannerTimer - dt);
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
    if (this.player.cryoSlowTimer > 0) {
      this.player.cryoSlowTimer -= dt;
    }
    if (sounds.setComboFilter && this.frames % 10 === 0) {
      sounds.setComboFilter(this.comboCount, this.player.isFever);
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

    // Telegraph Lazer Uyarılarını Güncelle (Boss aktifken yeni telegraf uyarıları iptal edilir)
    if (this.currentBoss && !this.currentBoss.toRemove) {
      this.telegraphs = [];
    }
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
      chest.update(this.height, dt);

      const dist = Math.hypot(chest.x - this.player.x, chest.y - this.player.y);
      if (dist < chest.radius + this.player.radius) {
        if (this.modalTransition || this.isMerchantActive) continue;
        this.luckyChests.splice(i, 1);
        this.triggerLuckyChest();
        break;
      } else if (chest.toRemove) {
        this.luckyChests.splice(i, 1);
      }
    }

    // Boss aktifken veya uyarı aşamasındayken aktif uzay olaylarını (Asteroit Sağanağı vb.) durdur
    if (this.activeEvent && (this.currentBoss || this.levelBossWarningTriggered || this.stormBossWarningTriggered)) {
      this.activeEvent = null;
      if (eventBanner) eventBanner.classList.add('hidden');
    }

    // Rastgele Uzay Olayları (Mini Space Events: Fırtına, Kristal, Karadelik, Güneş Patlaması, Kargo Baskını)
    if (!this.activeEvent && !this.currentBoss && !this.levelBossWarningTriggered && !this.stormBossWarningTriggered && this.gameTime >= this.nextEventTime) {
      const roll = Math.random();
      let eventType, eventName, duration;
      if (this.gameTime < 75) {
        // İlk 75 saniyede oyuncuyu sıkmamak için karadelik ÇIKMASIN!
        // Oyuncuyu ısıtan, ödüllü veya aksiyonlu olaylar çıksın
        if (roll < 0.55) {
          eventType = 'crystal_surge';
          eventName = '[ETKİNLİK] ALTIN KRİSTAL BULUTU! (6 SN)';
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
          eventName = '[ETKİNLİK] ALTIN KRİSTAL BULUTU! (6 SN)';
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
        flashEventBanner(this.activeEvent.name, 'info');
      }
      sounds.playBossAlarm();
      vibrate.medium();
    }

    if (this.activeEvent) {
      this.activeEvent.timer -= dt;
      this.activeEvent.spawnTick += dt;

      if (this.activeEvent.type === 'meteor_storm') {
        if (this.activeEvent.spawnTick >= 26) {
          this.activeEvent.spawnTick = 0;
          const sx = 35 + Math.random() * (this.width - 70);
          const bombType = this.getRandomBombType();
          this.enemies.push(new Enemy(sx, -30, Math.random() < 0.25 ? bombType : 'asteroid_m', 1, 1.05));
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
          this.particles.spawnFloatingText(cx, 100, t('float_cargo'), '#ffd700', 16);
        }
      } else if (this.activeEvent.type === 'black_hole') {
        const bx = this.activeEvent.bhX;
        const by = this.activeEvent.bhY;
        // Kristalleri merkeze doğru topla
        for (let gem of this.gems) {
          if (gem.toRemove) continue;
          const d = Math.hypot(gem.x - bx, gem.y - by);
          if (d < 260) {
            gem.x += (bx - gem.x) * 0.08 * dt;
            gem.y += (by - gem.y) * 0.08 * dt;
          }
        }
        // Düşmanları çek ve ezici karadelik hasarıyla parçala
        for (let enemy of this.enemies) {
          if (enemy.hp <= 0 || enemy.toRemove) continue;
          const d = Math.hypot(enemy.x - bx, enemy.y - by);
          if (d < 260 && !enemy.isBoss && !(enemy.type && enemy.type.startsWith('boss')) && !enemy.isFleetMember) {
            enemy.x += (bx - enemy.x) * 0.06 * dt;
            enemy.y += (by - enemy.y) * 0.06 * dt;
          }
          if (d < 95) {
            this.applyCappedEnemyDamage(enemy, 1.8 * dt, false);
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
          this.particles.spawnFloatingText(bx, by - 20, t('float_supernova'), '#ffd700', 16);
          // Tüm düşman mermilerini sil!
          this.enemyProjectiles = [];
          // Alan içindeki düşmanlara süpernova şoku!
          for (let enemy of this.enemies) {
            if (enemy.hp <= 0 || enemy.toRemove) continue;
            const d = Math.hypot(enemy.x - bx, enemy.y - by);
            if (d < 280) {
              this.applyCappedEnemyDamage(enemy, 40);
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

    // Karadelik Girdapları (Vortex Laser Evolution & Nova Singularity)
    for (let v = this.vortices.length - 1; v >= 0; v--) {
      const vortex = this.vortices[v];
      vortex.timer -= dt;

      // Kristalleri girdaba doğru çek (optimize kare mesafe)
      const pullRadius = vortex.isNovaVortex ? 260 : 130;
      const pullRadiusSq = pullRadius * pullRadius;
      for (let gem of this.gems) {
        if (gem.toRemove) continue;
        const dx = gem.x - vortex.x;
        const dy = gem.y - vortex.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < pullRadiusSq && dSq > 1) {
          gem.x -= dx * 0.1 * dt;
          gem.y -= dy * 0.1 * dt;
        }
      }

      // Yakındaki düşmanlara çekim ve hasar uygula
      for (let enemy of this.enemies) {
        if (enemy.hp <= 0 || enemy.toRemove) continue;
        const dx = enemy.x - vortex.x;
        const dy = enemy.y - vortex.y;
        const dSq = dx * dx + dy * dy;
        if (vortex.isNovaVortex && dSq < pullRadiusSq && !enemy.isBoss && !(enemy.type && enemy.type.startsWith('boss')) && !enemy.isFleetMember) {
          enemy.x -= dx * 0.045 * dt;
          enemy.y -= dy * 0.045 * dt;
        }
        const rSum = vortex.radius + enemy.radius;
        if (dSq < rSum * rSum) {
          const vDmg = (vortex.isNovaVortex ? 0.55 : 0.24) * dt;
          const vApplied = this.applyCappedEnemyDamage(enemy, vDmg);
          this.recordWeaponDamage(vortex.isNovaVortex ? 'special' : 'laser', vApplied);
          if (Math.random() < 0.08 * dt) {
            this.particles.spawnExplosion(vortex.x, vortex.y, '#d946ef', 1, 1);
          }
          if (enemy.hp <= 0) {
            this.handleEnemyDeath(enemy);
          }
        }
      }

      if (vortex.timer <= 0) {
        if (vortex.isShipSingularity) {
          this.particles.spawnShockwave(vortex.x, vortex.y, '#38bdf8', 96);
          for (let enemy of this.enemies) {
            if (enemy.hp <= 0 || enemy.toRemove) continue;
            if (Math.hypot(enemy.x - vortex.x, enemy.y - vortex.y) < 120) {
              const burst = this.applyCappedEnemyDamage(enemy, 35 * (this.player.damageMultiplier || 1));
              this.recordWeaponDamage('special', burst);
              if (enemy.hp <= 0) this.handleEnemyDeath(enemy);
            }
          }
        }
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

    // Geçiş sırasında birikmiş XP varsa geçiş biter bitmez seviye atlamayı tetikle
    if (this.player && this.player.xp >= this.player.nextXp && !this.modalTransition && !(this.resumeRampTimer > 0)) {
      this.checkLevelUp();
    }

    // Görsel Efektleri Güncelle
    this.particles.update(this.width, this.height);
  }

  armPerk(key, frames) {
    if (!this._perkCd) this._perkCd = {};
    if ((this._perkCd[key] || 0) > 0) return false;
    this._perkCd[key] = frames;
    return true;
  }

  updateWeapons(dt = 1.0) {
    // Ateş hızı tavanı: çoklu namlu ve seri atış üst üste binince dakikada bir şelale olmasın.
    const timeBonus = Math.min(0.10, (this.gameTime / 45) * 0.015);
    const levelBonus = Math.min(0.08, (this.player.level - 1) * 0.008);
    const upgradeBonus = (this.player.upgrades.fireRate - 1) * 0.045;
    const stationaryBonus = this.player.isStationary ? 0.06 : 0.0;
    const isCyberpunk = this.currentSkinId === 'cyberpunk';
    const adrenalineBoost = isCyberpunk ? 0.14 : 0.06;
    const adrenalineBonus = this.player.adrenalineTimer > 0 ? adrenalineBoost : 0.0;
    const phaseFireBonus = (this.currentSkinId === 'phantom' && this.player.phaseTimer > 0) ? 0.12 : 0.0;
    const archBonus = Math.min(0.08, (this.player.fireRateBonus || 1.0) - 1.0);
    const wmLevel = this.player.upgrades.wingman || 0;
    const wingmanSynergy = wmLevel > 0 ? Math.min(0.05, 0.02 + (wmLevel - 1) * 0.01) : 0;
    const speedMult = Math.min(1.32, 1 + timeBonus + levelBonus + upgradeBonus + stationaryBonus + adrenalineBonus + phaseFireBonus + archBonus + wingmanSynergy);

    const baseInterval = this.player.isFever ? 16 : 30;
    const fireFloor = this.player.isFever ? 14 : 20;
    const fireInterval = Math.max(fireFloor, Math.round(baseInterval / speedMult));

    // 1. Ana Silah Sistemi
    const zone = this.player.combatZone || 'rear';
    if (zone === 'front') {
      // Ön hat tehlikeli. Karşılığı geminin kendi ağır silahı: aynı mavi ray değil.
      const heavyInterval = Math.max(42, Math.round(fireInterval * 2.35));
      this.player.shootCooldown += dt;
      if (this.player.shootCooldown >= heavyInterval) {
        this.player.shootCooldown = 0;
        sounds.playRailgun();
        vibrate.heavy();
        this.screenShake = Math.max(this.screenShake, 4.5);

        const lvl = this.player.upgrades.laser;
        const isCrit = Math.random() < ((this.player.critChance || 0.08) + 0.12);
        const isOvercharge = this.player.overchargeTimer > 0;
        const masteryCritBonus = (this.masteryTree && this.masteryTree.critDmg) ? this.masteryTree.critDmg * 0.15 : 0;
        const critMult = isCrit ? (2.0 + masteryCritBonus) : 1.0;
        const dmgBonus = (this.player.isFever ? 3.0 : 0) + (isOvercharge ? 2.5 : 0);
        const mult = critMult * (this.player.damageMultiplier || 1.0) * (1 + wingmanSynergy);
        const skinId = this.currentSkinId;
        const muzzleY = this.player.y - 24;

        const pushHeavy = (bullet) => {
          this.playerBullets.push({
            isCrit,
            maxRange: 980,
            traveled: 0,
            ...bullet
          });
        };

        if (skinId === 'solar') {
          pushHeavy({
            x: this.player.x, y: muzzleY, vx: 0, vy: -12,
            damage: (16 + lvl * 3.4 + dmgBonus) * mult,
            w: 16, h: 16, color: '#ff9100',
            piercing: false, isSplash: true, isSolarFlare: true
          });
        } else if (skinId === 'toxic') {
          pushHeavy({
            x: this.player.x, y: muzzleY, vx: 0, vy: -22,
            damage: (9 + lvl * 2.4 + dmgBonus) * mult,
            w: 9, h: 42, color: '#05ffa1',
            piercing: true, pierce: 7, isPoison: true, isHeavyBeam: true
          });
        } else if (skinId === 'vortex') {
          pushHeavy({
            x: this.player.x, y: muzzleY, vx: 0, vy: -18,
            damage: (11 + lvl * 2.6 + dmgBonus) * mult,
            w: 14, h: 22, color: '#d946ef',
            piercing: true, pierce: 4, isGravitySlug: true
          });
        } else if (skinId === 'phantom') {
          for (const ang of [-0.14, 0, 0.14]) {
            pushHeavy({
              x: this.player.x + Math.sin(ang) * 8,
              y: muzzleY,
              vx: Math.sin(ang) * 7,
              vy: -Math.cos(ang) * 20,
              damage: (7.5 + lvl * 1.7 + dmgBonus * 0.6) * mult,
              w: 8, h: 18, color: '#00e5ff',
              piercing: true, pierce: 3, isLaneClear: true
            });
          }
        } else if (skinId === 'chrono') {
          pushHeavy({
            x: this.player.x, y: muzzleY, vx: 0, vy: -13,
            damage: (13 + lvl * 3.1 + dmgBonus) * mult,
            w: 18, h: 18, color: '#ffd700',
            piercing: true, pierce: 2, isChronoSlug: true
          });
        } else {
          pushHeavy({
            x: this.player.x, y: muzzleY, vx: 0, vy: -30,
            damage: (20 + lvl * 5.2 + dmgBonus) * mult,
            w: 11, h: 52, color: isCrit ? '#ffbe0b' : '#7dd3fc',
            piercing: true, pierce: 8, isHeavyBeam: true
          });
        }

        this.particles.spawnShockwave(this.player.x, muzzleY, '#ffffff', 36);
      }
    } else {
      // 2. Kademe (ALT BÖLGE / SAVUNMA): SERİ ÇİFTLİ / ÇOKLU PLAZMA ("tık-tık tık-tık tık-tık")
      const effectiveInterval = fireInterval;
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

        const masteryCritBonus = (this.masteryTree && this.masteryTree.critDmg) ? this.masteryTree.critDmg * 0.15 : 0;
        const critMult = isCrit ? (1.6 + masteryCritBonus) : 1.0;
        const vortexMult = isVortex ? 1.3 : 1.0;
        const dmgBonus = (this.player.isFever ? 1.5 : 0) + (isOvercharge ? 1.4 : 0);
        const isPiercing = isOvercharge || isVortex;

        const calcDmg = (base) => (base + dmgBonus) * critMult * vortexMult * (this.player.damageMultiplier || 1.0) * (1 + wingmanSynergy);

        // Her geminin normal atışı ayrı. Tek hedef hasarı birbirine yakın; fark desende.
        const step = (lvl - 1) * 0.28;
        const skinId = this.currentSkinId;
        const fire = (bullet) => {
          this.playerBullets.push({
            isCrit,
            traveled: 0,
            maxRange: 820,
            piercing: isPiercing,
            isVortex,
            color: bColor,
            ...bullet
          });
        };

        if (skinId === 'phantom') {
          const pellet = 1.42 + step * 0.65;
          for (const ang of [-0.07, 0, 0.07]) {
            fire({
              x: this.player.x + Math.sin(ang) * 6,
              y: this.player.y - 16,
              vx: Math.sin(ang) * 5.2,
              vy: -Math.cos(ang) * 16.5,
              damage: calcDmg(pellet),
              w: 4.5, h: 10, color: '#00e5ff', maxRange: 640
            });
          }
        } else if (skinId === 'toxic') {
          const needle = 2.35 + step;
          for (const ox of [-7, 7]) {
            fire({
              x: this.player.x + ox, y: this.player.y - 16,
              vx: ox * 0.04, vy: -17.5,
              damage: calcDmg(needle),
              w: 3.5, h: 14, color: '#05ffa1',
              piercing: true, pierce: 1, isPoison: true, poisonMul: 0.18, poisonTime: 55
            });
          }
        } else if (skinId === 'chrono') {
          const disc = 1.85 + step;
          for (const ox of [-8, 8]) {
            fire({
              x: this.player.x + ox, y: this.player.y - 16,
              vx: (ox > 0 ? 0.35 : -0.35), vy: -16.2,
              damage: calcDmg(disc),
              w: 7, h: 7, color: '#ffd700',
              piercing: false, isRicochet: true, bouncesLeft: 1, maxRange: 720
            });
          }
        } else if (skinId === 'solar') {
          fire({
            x: this.player.x, y: this.player.y - 18,
            vx: 0, vy: -15,
            damage: calcDmg(3.7 + step * 2),
            w: 8, h: 8, color: '#ffbe0b',
            piercing: false, isSplash: true, splashMul: 0.32
          });
        } else if (skinId === 'vortex') {
          const bolt = 2.05 + step;
          for (const ox of [-8, 8]) {
            fire({
              x: this.player.x + ox, y: this.player.y - 16,
              vx: ox > 0 ? -0.55 : 0.55, vy: -16.8,
              damage: calcDmg(bolt),
              w: 4.2, h: 13, color: '#c084fc',
              piercing: true, pierce: 1
            });
          }
        } else {
          const bolt = 2.55 + step;
          fire({
            x: this.player.x - 6, y: this.player.y - 16, vx: 0, vy: -17,
            damage: calcDmg(bolt), w: 4, h: 12, color: bColor
          });
          fire({
            x: this.player.x + 6, y: this.player.y - 16, vx: 0, vy: -17,
            damage: calcDmg(bolt), w: 4, h: 12, color: bColor
          });
        }

        if (skinId === 'solar') {
          this.player.solarShotCount = (this.player.solarShotCount || 0) + 1;
          if (this.player.solarShotCount >= 7) {
            this.player.solarShotCount = 0;
            sounds.playNuke();
            this.particles.spawnShockwave(this.player.x, this.player.y - 20, '#ff3d00', 36);
            fire({
              x: this.player.x, y: this.player.y - 22, vx: 0, vy: -11,
              damage: calcDmg(6.5),
              w: 12, h: 12, color: '#ff3d00',
              piercing: true, isCrit: true, isSolarFlare: true, maxRange: 900
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
          this.applyCappedEnemyDamage(enemy, 2.2 * dt * (this.player.damageMultiplier || 1.0), false);
          if (this.frames % 8 === 0) {
            this.particles.spawnExplosion(enemy.x, enemy.y, '#ff3d00', 1, 1.0);
          }
          if (enemy.hp <= 0) {
            this.handleEnemyDeath(enemy);
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
          this.applyCappedEnemyDamage(enemy, 0.45 * dt * (this.player.damageMultiplier || 1.0), false);
          if (enemy.hp <= 0) {
            this.handleEnemyDeath(enemy);
          }
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
            if (enemy.hp <= 0 || enemy.toRemove) continue;
            this.applyCappedEnemyDamage(enemy, 55 * (this.player.damageMultiplier || 1.0));
            this.particles.spawnShockwave(enemy.x, enemy.y, '#bf5af2', 90);
            this.particles.spawnExplosion(enemy.x, enemy.y, '#00f0ff', 12, 3);
            if (enemy.hp <= 0) {
              this.handleEnemyDeath(enemy);
            }
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
              gem.toRemove = true;
              this.collectGem(gem, droneX, droneY);
              this.droneOverdriveTimer = 100;
              this.particles.spawnExplosion(droneX, droneY, '#ffd700', 2, 1);
              if (this.player.xp >= this.player.nextXp) {
                this.checkLevelUp();
                break;
              }
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
              piercing: true,
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
      const cloneFlank = (this.player.upgrades.wingman || 0) > 0 ? -1 : 1;
      const targetDroneX = cd.cfg.type === 'clone'
        ? this.player.x + cloneFlank * 62
        : this.player.x + Math.cos(cd.angle) * 36;
      const targetDroneY = cd.cfg.type === 'clone'
        ? this.player.y + 18
        : this.player.y + Math.sin(cd.angle) * 22;
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
            piercing: true,
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
            this.applyCappedEnemyDamage(e, cd.cfg.baseDmg * lvlMultiplier * (this.player.damageMultiplier || 1.0));
            this.particles.spawnLightning(cd.x, cd.y, e.x, e.y, cd.cfg.color || '#bf5af2');
            this.particles.spawnExplosion(e.x, e.y, cd.cfg.color || '#bf5af2', 4, 1.4);
            if (e.hp <= 0) {
              this.handleEnemyDeath(e);
            }
            count++;
            if (count >= 3) break;
          }
        }
        if (count > 0) {
          sounds.playTesla();
          vibrate.light();
        }
      } else if (cd.cfg.type === 'clone' && cd.shootTimer >= 54) { // ~0.9 sn'de bir destek atışı; ana namluyu boğmasın
        cd.shootTimer = 0;
        const cloneDmg = (cd.cfg.baseDmg * 0.5) * lvlMultiplier * (this.player.damageMultiplier || 1.0);
        for (let ox of [-4, 4]) {
          this.playerBullets.push({
            x: cd.x + ox,
            y: cd.y - 22,
            vx: 0,
            vy: -15,
            damage: cloneDmg,
            w: 3.5,
            h: 9,
            color: '#00f0ff',
            pierce: 1,
            piercing: true,
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

      if (b.isRicochet && b.bouncesLeft > 0 && (b.x <= 14 || b.x >= this.width - 14)) {
        b.vx = -b.vx;
        b.bouncesLeft--;
        this.particles.spawnExplosion(b.x, b.y, '#ffd700', 3, 1.2);
        sounds.playCrit();
      } else if (b.y < -30 || b.x < -20 || b.x > this.width + 20) {
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

        const validEnemies = this.enemies.filter(e => e.hp > 0 && !e.toRemove && e.y > -20 && e.y < this.height);
        const targets = validEnemies.sort(() => 0.5 - Math.random()).slice(0, Math.min(8, Math.floor(5 + Math.random() * 4)));
        for (let target of targets) {
          const stormDmg = 14;
          this.applyCappedEnemyDamage(target, stormDmg);
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
      if (enemy.hp <= 0 || enemy.toRemove) continue;
      const dist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
      if (dist < empRadius) {
        this.applyCappedEnemyDamage(enemy, 4 + this.player.upgrades.emp * 2);
        if (enemy.hp <= 0) {
          this.handleEnemyDeath(enemy);
        }
      }
    }
  }

  spawnTetherPair(waveMultiplier, speedMult) {
    const span = Math.min(190, Math.max(95, this.width * 0.44));
    const cx = 55 + Math.random() * (this.width - 110);
    const leftX = Math.max(28, cx - span / 2);
    const rightX = Math.min(this.width - 28, cx + span / 2);
    const droneA = new Enemy(leftX, -35, 'tether_drone', waveMultiplier, speedMult * 0.88);
    const droneB = new Enemy(rightX, -35, 'tether_drone', waveMultiplier, speedMult * 0.88);
    droneA.tetherPartner = droneB;
    droneB.tetherPartner = droneA;
    this.enemies.push(droneA);
    this.enemies.push(droneB);
  }

  checkTetherCollisions(dt = 1.0) {
    if (this.player.isInvulnerable || this.state !== 'PLAYING') return;
    const checkedPairs = new Set();
    for (let enemy of this.enemies) {
      if (enemy.isTetherDrone && enemy.tetherPartner && !enemy.toRemove && !enemy.tetherPartner.toRemove && enemy.hp > 0 && enemy.tetherPartner.hp > 0) {
        const p = enemy.tetherPartner;
        if (enemy.y < 10 || p.y < 10 || enemy.y > this.height || p.y > this.height) continue;
        const pairKey = Math.min(enemy.x, p.x) + '_' + Math.min(enemy.y, p.y);
        if (checkedPairs.has(pairKey)) continue;
        checkedPairs.add(pairKey);

        const x1 = enemy.x;
        const y1 = enemy.y;
        const x2 = p.x;
        const y2 = p.y;
        const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
        if (l2 === 0) continue;
        let t = ((this.player.x - x1) * (x2 - x1) + (this.player.y - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        const closeX = x1 + t * (x2 - x1);
        const closeY = y1 + t * (y2 - y1);
        const dist = Math.hypot(this.player.x - closeX, this.player.y - closeY);
        if (dist < this.player.radius + 6) {
          this.takeDamage(10);
          sounds.playTesla();
          this.particles.spawnShockwave(this.player.x, this.player.y, '#00f0ff', 45);
          this.particles.spawnLightning(x1, y1, this.player.x, this.player.y, '#00f0ff', 4);
          this.particles.spawnLightning(x2, y2, this.player.x, this.player.y, '#00f0ff', 4);
          this.screenShake = 6;
        }
      }
    }
  }

  spawnEnemies(dt = 1.0) {
    // Açılış meteor kütlesi devam ederken rastgele düşman doğumu beklemede kalır
    if (this.openingSwarmPhase > 0 || (this.openingHookGap || 0) > 0) return;
    this.spawnTimer += dt;

    // Dinamik Karşı Güçlenme (Kullanıcı İsteği: Oyuncu güçlendikçe düşmanlar ve zorluk da paralel olarak artsın)
    let playerUpgradeCount = 0;
    if (this.player.upgrades) {
      for (let k in this.player.upgrades) {
        playerUpgradeCount += Math.max(0, (this.player.upgrades[k] || 0) - 1);
      }
    }
    const playerDmgMult = Math.max(1.0, this.player.damageMultiplier || 1.0);
    const powerScaling = (this.player.level - 1) * 0.08 + playerUpgradeCount * 0.04;
    const bossPlayerPowerScale = 1 + (this.player.level - 1) * 0.14 + playerUpgradeCount * 0.08 + Math.max(0, playerDmgMult - 1) * 0.65;
    const timeScaling = Math.min(0.65, (this.gameTime / 50) * 0.15);
    const diffScale = 0.52 + powerScaling + timeScaling;

    // === BOSS AKTİFKEN VEYA BOSS UYARISI BAŞLADIĞINDA SIKI SPAWN KONTROLÜ (HER İKİ MOD İÇİN ORTAK) ===
    // Boss sahnedeyken rastgele meteor yağmuru, bomba/mor taşlar, karadelik/kriyojenik taşlar ve telegraflar KESİNLİKLE çıkmaz!
    // Yalnızca kontrollü sayıda (en fazla 2 adet) imha edilebilir Boss Muhafızı (escort_fighter) ve nadiren 1 küçük kristal taş gelir.
    if (this.currentBoss && !this.currentBoss.toRemove && this.currentBoss.hp > 0) {
      this.telegraphs = [];
      if (this.activeEvent) {
        this.activeEvent = null;
        if (eventBanner) eventBanner.classList.add('hidden');
      }
      if (this.spawnTimer >= 165) {
        this.spawnTimer = 0;
        const escortCount = this.enemies.filter(e => !e.toRemove && e.hp > 0 && e.type === 'escort_fighter').length;
        if (escortCount < 2) {
          const side = Math.random() < 0.5 ? -1 : 1;
          const sx = Math.max(35, Math.min(this.width - 35, this.currentBoss.x + side * (60 + Math.random() * 50)));
          const sy = Math.max(15, this.currentBoss.y + 20);
          const guardMult = Math.max(1.0, diffScale * 0.9);
          this.enemies.push(new Enemy(sx, sy, 'escort_fighter', guardMult, 0.95 * (this.waveSpeedBonus || 1.0)));
        } else if (Math.random() < 0.25) {
          // Oyuncunun cephane/overdrive kazanabilmesi için tek tük küçük kristal asteroit
          const x = 35 + Math.random() * (this.width - 70);
          this.enemies.push(new Enemy(x, -20, 'asteroid_s', 0.8, 0.65));
        }
      }
      return;
    }

    // === FIRTINA MODU: SAF ASTEROİD AKSİYONU VE REKOR AVI ===
    if (this.currentMode === 'storm') {
      let interval = 46;
      let speedMult = 0.78;

      // Başlangıçta oyuncunun kafasına bir sürü taş yağmaması için yumuşak ve dengeli açılış temposu
      if (this.gameTime < 15) {
        interval = 50;
        speedMult = 0.66;
      } else if (this.gameTime < 35) {
        interval = 42;
        speedMult = 0.78;
      } else if (this.gameTime < 65) {
        interval = 36;
        speedMult = 0.95;
      } else if (this.gameTime < 100) {
        interval = 30;
        speedMult = 1.12;
      } else {
        interval = Math.max(18, 28 - Math.floor((this.gameTime - 100) * 0.14));
        speedMult = Math.min(1.55, 1.20 + (this.gameTime - 100) * 0.004);
      }
      speedMult *= (this.waveSpeedBonus || 1.0);

      const activeStormFleet = this.enemies.filter(e => e.isFleetMember && !e.toRemove && e.hp > 0).length;
      if (activeStormFleet >= 2) {
        interval = Math.max(interval, 68);
      }

      const maxStormEnemies = this.gameTime < 15 ? 5 : (this.gameTime < 35 ? 7 : 11);

      // Fırtına modunda da Düşman Öncü Filosu baskını (Her 45 saniyede bir gerçek filo mücadelesi, boss uyarısına yakınken çıkmaz)
      if (!this.stormBossWarningTriggered && (this.nextStormBossTime - this.gameTime) > 10 && this.gameTime >= (this.nextStormFleetTime || 28)) {
        this.nextStormFleetTime = this.gameTime + 48;
        this.spawnEnemyVanguardFleet(diffScale * bossPlayerPowerScale, speedMult);
      }

      if (this.spawnTimer >= interval && this.enemies.length < maxStormEnemies && !this.stormBossWarningTriggered) {
        this.spawnTimer = 0;
        const x = 30 + Math.random() * (this.width - 60);
        const roll = Math.random();
        const waveMult = diffScale * (1 + (this.wave - 1) * 0.12);

        if (this.gameTime < 15) {
          // İlk 15 saniye sakin ısınma: Sadece küçük/orta taşlar ve tek tük bomba
          if (roll < 0.65) {
            this.enemies.push(new Enemy(x, -20, 'asteroid_s', waveMult * 0.65, speedMult));
          } else if (roll < 0.90) {
            this.enemies.push(new Enemy(x, -30, 'asteroid_m', waveMult * 0.65, speedMult * 0.95));
          } else {
            this.enemies.push(new Enemy(x, -30, 'asteroid_bomb', waveMult * 0.65, speedMult * 0.95));
          }
        } else if (roll < 0.15) {
          const bType = this.getRandomBombType();
          this.enemies.push(new Enemy(x, -30, bType, waveMult, speedMult * 1.05));
        } else if (roll < 0.28 && this.gameTime >= 30) {
          this.enemies.push(new Enemy(x, -30, 'volatile_asteroid', waveMult, speedMult));
        } else if (roll < 0.54) {
          const m = new Enemy(x, -30, 'asteroid_m', waveMult * 0.9, speedMult * 1.05);
          m.score = Math.round(m.score * 1.8);
          this.enemies.push(m);
        } else if (roll < 0.76 && this.gameTime >= 25) {
          this.enemies.push(new Enemy(x, -40, 'asteroid_l', waveMult, speedMult * 0.88));
        } else {
          this.enemies.push(new Enemy(x, -20, 'asteroid_s', waveMult * 0.8, speedMult * 1.15));
          if (this.enemies.length + 1 < maxStormEnemies && Math.random() < 0.45) {
            const x2 = 30 + Math.random() * (this.width - 60);
            this.enemies.push(new Enemy(x2, -38, 'asteroid_s', waveMult * 0.8, speedMult * 1.15));
          }
        }
      }

      // Fırtına modunda akıllı tehlikeler (Ritmik olarak 20. sn'den itibaren her 20-26 sn'de bir)
      if (this.gameTime >= (this.nextHazardTime || 22) && !this.stormBossWarningTriggered && !this.currentBoss && this.telegraphs.length < 2) {
        this.nextHazardTime = this.gameTime + 20 + Math.random() * 6;
        const warnX = 40 + Math.random() * (this.width - 80);
        const r = Math.random();
        let telType = 'kamikaze';
        if (r < 0.40) telType = 'kamikaze';
        else if (r < 0.75) telType = 'dive_bomber';
        else telType = 'laser_beam';

        this.telegraphs.push({
          x: warnX,
          timer: 50,
          maxTimer: 50,
          type: telType
        });
        sounds.playBossAlarm();
      }

      // === FIRTINA MODU: KOZMİK UZAY BOSSLARI ===
      const stormBossRoster = ['boss_vanguard', 'boss_dreadnought', 'boss_nebula', 'boss_titan', 'boss_apex'];
      if (!this.currentBoss && this.gameTime >= (this.nextStormBossTime - 3.5) && !this.stormBossWarningTriggered) {
        this.stormBossWarningTriggered = true;
        this.telegraphs = [];
        if (this.activeEvent) {
          this.activeEvent = null;
          if (eventBanner) eventBanner.classList.add('hidden');
        }
        const bType = stormBossRoster[Math.min(this.stormBossIndex, stormBossRoster.length - 1)];
        const bInfo = Enemy.getBossInfo(bType);
        flashEventBanner(`${t('boss_warning_title')}: ${bInfo.name}`, 'threat');
        sounds.playBossAlarm();
        vibrate.heavy();
        this.screenShake = 7;
      }

      if (!this.currentBoss && this.gameTime >= this.nextStormBossTime) {
        const bType = stormBossRoster[Math.min(this.stormBossIndex, stormBossRoster.length - 1)];
        this.stormBossIndex++;
        this.nextStormBossTime = this.gameTime + 65; // Bir sonraki boss 65 saniye sonra
        this.stormBossWarningTriggered = false;

        if (bossWarningOverlay) bossWarningOverlay.classList.add('hidden');
        sounds.playBossAlarm();
        sounds.setBossMode(true);
        vibrate.heavy();
        this.screenShake = 14;

        // Sahnedeki tehlikeli/kalabalık asteroitleri temizle ki saf boss savaşı yaşansın
        this.clearNonBossClutterForBossEntry();

        const bossScale = (1.0 + (this.stormBossIndex - 1) * 0.35) * bossPlayerPowerScale;
        this.currentBoss = new Enemy(this.width / 2, -75, bType, bossScale, 1.0);
        this.currentBoss.isBoss = true;
        const bInfo = Enemy.getBossInfo(bType);
        this.particles.spawnShockwave(this.width / 2, 70, bInfo.color, 320);
        this.enemies.push(this.currentBoss);
        this.updateHUD();
      }

      return; // Fırtına modu
    }

    // === KLASİK / SEFER (CAMPAIGN 1-38) MODU BOSS SPAWN SİSTEMİ ===
    const lvlCfg = this.getLevelConfig(this.selectedLevel);
    const bInfo = Enemy.getBossInfo(lvlCfg.bossType);

    // Sinematik Boss Giriş Uyarısı (~3.5 sn önce alarm ve ekran başlığı)
    if (!this.currentBoss && !this.levelBossSpawned) {
      if (this.gameTime >= Math.max(8, lvlCfg.targetDuration - 4) && !this.levelBossWarningTriggered) {
        this.levelBossWarningTriggered = true;
        this.telegraphs = [];
        if (this.activeEvent) {
          this.activeEvent = null;
          if (eventBanner) eventBanner.classList.add('hidden');
        }
        flashEventBanner(`${t('boss_warning_title')}: ${bInfo.name}`, 'threat');
        sounds.playBossAlarm();
        vibrate.heavy();
        this.screenShake = 7;
      }

      if (this.gameTime >= lvlCfg.targetDuration) {
        this.bossArenaActive = true;
        this.levelBossSpawned = true;
        if (bossWarningOverlay) bossWarningOverlay.classList.add('hidden');
        sounds.playBossAlarm();
        sounds.setBossMode(true);
        vibrate.heavy();
        this.screenShake = 14;

        // Boss sahneye indiğinde normal meteor/tehlike karmaşasını temizle
        this.clearNonBossClutterForBossEntry();

        const effectiveBossHpMult = (lvlCfg.hpMult || 1.0) * bossPlayerPowerScale;
        this.currentBoss = new Enemy(this.width / 2, -75, lvlCfg.bossType, effectiveBossHpMult, lvlCfg.speedMult);
        this.currentBoss.isLevelBoss = true;
        this.currentLevelBoss = this.currentBoss;
        this.particles.spawnShockwave(this.width / 2, 70, bInfo.color, 320);
        this.enemies.push(this.currentBoss);
        this.updateHUD();
        return;
      }
    }

    // Boss uyarısı başladıysa yeni normal dalga doğurma
    if (this.levelBossWarningTriggered) {
      return;
    }

    // === SEFER ARA ETKİNLİKLERİ (INTERMISSION DIRECTOR) ===
    if (!this.currentBoss && !this.levelBossSpawned && this.intermissionEvents) {
      // 1. FAZ (12. sn): KOZMİK HAZİNE & ALTIN ASTEROİD AKINTISI (Gold Rush)
      if (this.gameTime >= 12 && !this.intermissionEvents.goldRush && (lvlCfg.targetDuration - this.gameTime) >= 10) {
        this.intermissionEvents.goldRush = true;
        const cx = this.width / 2;
        this.enemies.push(new Enemy(cx - 70, -25, 'asteroid_gold', 0.45, 0.85 * (this.waveSpeedBonus || 1.0)));
        this.enemies.push(new Enemy(cx, -45, 'asteroid_gold', 0.45, 0.80 * (this.waveSpeedBonus || 1.0)));
        this.enemies.push(new Enemy(cx + 70, -25, 'asteroid_gold', 0.45, 0.85 * (this.waveSpeedBonus || 1.0)));
        this.particles.spawnFloatingText(cx, 100, t('float_gold_rush'), '#ffd700', 15);
      }

      // 2. FAZ (24. sn): DÜŞMAN ÖNCÜ FİLOSU BASKINI (Swarm Strike - Her Zaman Zorlayıcı Zırhlı Filo!)
      if (this.gameTime >= 24 && !this.intermissionEvents.swarmStrike && (lvlCfg.targetDuration - this.gameTime) >= 10) {
        this.intermissionEvents.swarmStrike = true;
        const fleetScale = Math.max(1.15, (lvlCfg.hpMult || 1.0) * bossPlayerPowerScale);
        this.spawnEnemyVanguardFleet(fleetScale, (this.waveSpeedBonus || 1.0));
      }

      // 3. FAZ (38. sn): UZAY KAÇAKÇISI İSTASYONU (Space Smuggler Merchant)
      if (this.gameTime >= 38 && !this.intermissionEvents.merchantVisit && (lvlCfg.targetDuration - this.gameTime) >= 14) {
        if (!this.modalTransition) {
          this.intermissionEvents.merchantVisit = true;
          this.openMerchant();
          return;
        }
      }

      // 4. FAZ (55. sn, 80s+ süren uzun seviyelerde): ZIRHLI KRUVAZÖR KUŞATMASI (Armored Cruiser Mini-Raid)
      if (this.gameTime >= 55 && lvlCfg.targetDuration >= 80 && !this.intermissionEvents.cruiserRaid && (lvlCfg.targetDuration - this.gameTime) >= 10) {
        this.intermissionEvents.cruiserRaid = true;
        sounds.playBossAlarm();
        vibrate.medium();
        this.screenShake = 7;
        if (eventBanner && eventBannerText) {
          flashEventBanner(t('banner_cruiser'), 'threat');
          setTimeout(() => {
            if (!this.activeEvent) eventBanner.classList.add('hidden');
          }, 3200);
        }
        const cx = this.width / 2;
        const raidMult = Math.max(1.25, (lvlCfg.hpMult || 1.0) * bossPlayerPowerScale);
        const leadCruiser = new Enemy(cx, -45, 'cruiser', raidMult * 1.35, 0.75 * (this.waveSpeedBonus || 1.0));
        leadCruiser.isFleetMember = true;
        leadCruiser.isFleetCommander = true;
        leadCruiser.maxDamagePerHitRatio = 0.18;
        this.enemies.push(leadCruiser);

        const leftWing = new Enemy(Math.max(40, cx - 85), -60, 'shield_vanguard', raidMult, 0.85 * (this.waveSpeedBonus || 1.0));
        leftWing.isFleetMember = true;
        leftWing.maxDamagePerHitRatio = 0.25;
        const rightWing = new Enemy(Math.min(this.width - 40, cx + 85), -60, 'shield_vanguard', raidMult, 0.85 * (this.waveSpeedBonus || 1.0));
        rightWing.isFleetMember = true;
        rightWing.maxDamagePerHitRatio = 0.25;
        this.enemies.push(leftWing, rightWing);
      }
    }

    let interval = 42;
    let speedMult = 0.72;

    // Seviye Bazlı Akış: Oyun başında kafaya meteor yağmaması için yumuşak ve kademeli ısınma eğrisi!
    if (this.gameTime < 15) {
      interval = 50;
      speedMult = 0.65;
    } else if (this.gameTime < 30 || this.player.level <= 2) {
      interval = 42;
      speedMult = 0.74;
    } else if (this.player.level === 3 || this.gameTime < 50) {
      interval = 36;
      speedMult = 0.82;
    } else if (this.gameTime < 85) {
      interval = 32;
      speedMult = 0.92;
    } else {
      interval = Math.max(24, 30 - Math.floor((this.gameTime - 85) * 0.15));
      speedMult = Math.min(1.3, 0.98 + (this.gameTime - 85) * 0.004);
    }
    speedMult *= (this.waveSpeedBonus || 1.0);

    // Düşman Öncü Filosu sahnedeyken rastgele taş yoğunluğunu azalt ki filo savaşı net hissedilsin
    const activeFleetCount = this.enemies.filter(e => e.isFleetMember && !e.toRemove && e.hp > 0).length;
    if (activeFleetCount >= 2) {
      interval = Math.max(interval, 68);
    }

    // Ekranda aşırı yığılmayı önleyen düşman sayısı tavanı (Başlangıçta ferah ve kontrollü!)
    const maxEnemies = this.gameTime < 15 ? 5 : (this.gameTime < 30 ? 7 : (this.player.level <= 2 ? 8 : (this.player.level === 3 ? 10 : 12)));
    if (this.enemies.length >= maxEnemies) {
      return;
    }

    if (this.spawnTimer >= interval) {
      this.spawnTimer = 0;
      const x = 35 + Math.random() * (this.width - 70);
      const roll = Math.random();
      const waveMultiplier = diffScale * (1 + (this.wave - 1) * 0.12);

      // 3. DİNAMİK ÇEVRE TEHDİDİ: Kararsız Plazma Reaktörü (Volatile Plasma Core)
      // İlk 30 saniyede çıkmaz, oyuncu ısındıktan sonra nadiren çıkar
      const hasCore = this.enemies.some(e => e.type === 'volatile_core');
      if (!hasCore && this.gameTime > 32 && Math.random() < 0.045) {
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
          // Bomba taş (Kırmızı lokal veya Mor kozmik domino)
          const bType = this.getRandomBombType();
          this.enemies.push(new Enemy(x, -30, bType, waveMultiplier, speedMult));
        } else if (roll < 0.82) {
          // Scout avcı
          this.enemies.push(new Enemy(x, -25, 'scout', waveMultiplier, speedMult));
        } else if (roll < 0.90) {
          // Kruvazör
          this.enemies.push(new Enemy(x, -35, 'cruiser', waveMultiplier, speedMult));
        } else if (roll < 0.95) {
          // Yeni: Ön Kalkanlı Zırhlı Akıncı
          this.enemies.push(new Enemy(x, -35, 'shield_vanguard', waveMultiplier, speedMult * 0.95));
        } else {
          // Yeni: İkili Lazer Bağı Dronları
          this.spawnTetherPair(waveMultiplier, speedMult);
        }
      }
      // === İLK BOSS ÖNCESİ AŞAMALAR (Yumuşak Başlangıç Akışı) ===
      else if (this.player.level <= 2 || this.gameTime < 25) {
        const hpScale = this.gameTime < 15 ? waveMultiplier * 0.55 : waveMultiplier * 0.80;
        if (roll < 0.58) {
          // Kendi kendine gelen en ufak taşlar (1 vuruşta patlar, XP verir, bölünmez)
          this.enemies.push(new Enemy(x, -20, 'asteroid_s', hpScale, speedMult));
        } else if (roll < 0.84) {
          // Orta taş
          this.enemies.push(new Enemy(x, -30, 'asteroid_m', hpScale, speedMult));
        } else if (roll < 0.94 || this.gameTime < 20) {
          // Bomba taş (Zincirleme patlama)
          const bType = this.getRandomBombType();
          this.enemies.push(new Enemy(x, -30, bType, hpScale, speedMult));
        } else {
          // 20. saniyeden sonra nadiren Zümrüt Geod veya Buz taşı
          if (Math.random() < 0.65) {
            this.enemies.push(new Enemy(x, -25, 'asteroid_geode', 0.5, speedMult * 0.95));
          } else {
            this.enemies.push(new Enemy(x, -30, 'asteroid_cryo', hpScale, speedMult));
          }
        }
      }
      // 2. AŞAMA (Seviye 3): Taşlar + İlk Avcı Gemiler (Seviye 4 Geçiş Eşiği)
      else if (this.player.level === 3) {
        if (roll < 0.35) {
          this.enemies.push(new Enemy(x, -20, 'asteroid_s', waveMultiplier, speedMult));
        } else if (roll < 0.65) {
          this.enemies.push(new Enemy(x, -30, 'asteroid_m', waveMultiplier, speedMult));
        } else if (roll < 0.82) {
          this.enemies.push(new Enemy(x, -25, 'scout', waveMultiplier, speedMult));
        } else {
          const bType = this.getRandomBombType();
          this.enemies.push(new Enemy(x, -30, bType, waveMultiplier, speedMult));
        }
      }
      // 3. AŞAMA (Seviye 4+ ve 40-70 sn): Mini Avcılar (Scout) devreye girer
      else if (this.gameTime < 70) {
        if (roll < 0.12) {
          const bType = this.getRandomBombType();
          this.enemies.push(new Enemy(x, -30, bType, waveMultiplier, speedMult));
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
          const bType = this.getRandomBombType();
          this.enemies.push(new Enemy(x, -30, bType, waveMultiplier, speedMult));
        } else if (roll < 0.35) {
          this.enemies.push(new Enemy(x, -30, 'asteroid_m', waveMultiplier, speedMult));
        } else if (roll < 0.60) {
          this.enemies.push(new Enemy(x, -20, 'asteroid_s', waveMultiplier, speedMult));
        } else if (roll < 0.82) {
          this.enemies.push(new Enemy(x, -25, 'scout', waveMultiplier, speedMult));
        } else if (roll < 0.92) {
          this.enemies.push(new Enemy(x, -35, 'cruiser', waveMultiplier, speedMult));
        } else {
          this.spawnTetherPair(waveMultiplier, speedMult);
        }
      }
    }

    // Tehlike Uyarısı & Kamikaze / Dalış Avcısı / Lazer Doğuşu (Ritmik olarak 20. sn'den itibaren)
    if (this.gameTime >= (this.nextHazardTime || 22) && !this.currentBoss && !this.levelBossWarningTriggered && this.telegraphs.length < 2) {
      this.nextHazardTime = this.gameTime + 22 + Math.random() * 6;
      const warnX = 40 + Math.random() * (this.width - 80);
      const r = Math.random();
      let telType = 'kamikaze';
      if (r < 0.40) telType = 'kamikaze';
      else if (r < 0.70) telType = 'dive_bomber';
      else telType = 'laser_beam';

      this.telegraphs.push({
        x: warnX,
        timer: 50,
        maxTimer: 50,
        type: telType
      });
      sounds.playBossAlarm();
    }

    // Altın Elit Avcı Mini-Boss Doğuşu (65+ sn ve boss aktif değilken nadir doğar)
    if (this.gameTime >= 65 && !this.currentBoss && Math.random() < 0.0035 * dt && !this.enemies.some(e => e.type === 'elite_scout')) {
      const eliteX = 40 + Math.random() * (this.width - 80);
      const waveMult = diffScale * (1 + (this.wave - 1) * 0.12);
      this.enemies.push(new Enemy(eliteX, -35, 'elite_scout', waveMult, speedMult));
    }
  }

  clearNonBossClutterForBossEntry() {
    this.telegraphs = [];
    this.activeBeams = [];
    this.dominoQueue = [];
    if (this.activeEvent) {
      this.activeEvent = null;
      if (eventBanner) eventBanner.classList.add('hidden');
    }
    // Boss girdiğinde sahnedeki bomba taşları, tehlike taşlarını ve kalabalık meteorları zarifçe temizle
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (!e.isBoss && !(e.type && e.type.startsWith('boss'))) {
        this.particles.spawnExplosion(e.x, e.y, e.color || '#00f0ff', 4, 1.4);
        this.enemies.splice(i, 1);
      }
    }
  }

  spawnEnemyVanguardFleet(fleetScale = 1.2, speedBonus = 1.0) {
    sounds.playBossAlarm();
    vibrate.medium();
    this.screenShake = 6;
    if (eventBanner && eventBannerText) {
      flashEventBanner(t('banner_vanguard'), 'threat');
      setTimeout(() => {
        if (!this.activeEvent) eventBanner.classList.add('hidden');
      }, 3200);
    }

    const cx = this.width / 2;
    const w = this.width;
    const effectiveScale = Math.max(1.25, fleetScale);

    // 1. Filo Komutanı (Merkezde Ağır Zırhlı Elit Komutan / Kruvazör - Tek mermide asla ölmez, yaylım ateşi açar)
    const commanderType = this.selectedLevel >= 3 || this.wave >= 2 ? 'cruiser' : 'elite_scout';
    const commander = new Enemy(cx, -45, commanderType, effectiveScale * 1.45, 0.78 * speedBonus);
    commander.isFleetMember = true;
    commander.isFleetCommander = true;
    commander.maxDamagePerHitRatio = 0.16; // En az 7 vuruş gerektirir
    commander.shootTimer = 28;
    this.enemies.push(commander);

    // 2. İç Kanat Zırhlı Muhafızlar (2 adet kalkanlı/zırhlı öncü gemi)
    const leftGuard = new Enemy(Math.max(42, cx - 68), -65, 'shield_vanguard', effectiveScale * 1.15, 0.85 * speedBonus);
    leftGuard.isFleetMember = true;
    leftGuard.maxDamagePerHitRatio = 0.25;
    leftGuard.shootTimer = 40;

    const rightGuard = new Enemy(Math.min(w - 42, cx + 68), -65, 'shield_vanguard', effectiveScale * 1.15, 0.85 * speedBonus);
    rightGuard.isFleetMember = true;
    rightGuard.maxDamagePerHitRatio = 0.25;
    rightGuard.shootTimer = 40;
    this.enemies.push(leftGuard, rightGuard);

    // 3. Dış Kanat Taarruz Avcıları (2 adet manevra yapan ve ateş eden filo avcısı)
    const leftFlank = new Enemy(Math.max(32, cx - 125), -85, 'scout', effectiveScale * 1.35, 0.95 * speedBonus);
    leftFlank.isFleetMember = true;
    leftFlank.maxDamagePerHitRatio = 0.34;
    leftFlank.shootTimer = 35;

    const rightFlank = new Enemy(Math.min(w - 32, cx + 125), -85, 'scout', effectiveScale * 1.35, 0.95 * speedBonus);
    rightFlank.isFleetMember = true;
    rightFlank.maxDamagePerHitRatio = 0.34;
    rightFlank.shootTimer = 35;
    this.enemies.push(leftFlank, rightFlank);
  }

  feelStrike(enemy, hx, hy, color) {
    if (!enemy || enemy._ballooning) return;
    enemy.hitFlash = Math.max(enemy.hitFlash || 0, 5);
    let dx = enemy.x - hx;
    let dy = enemy.y - hy;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const boss = !!(enemy.isBoss || (enemy.type && enemy.type.startsWith('boss')));
    const mag = boss ? 0.4 : 1.15;
    const cap = boss ? 0.55 : 1.35;
    enemy.knockX = (enemy.knockX || 0) + dx * mag;
    enemy.knockY = (enemy.knockY || 0) + dy * mag;
    const klen = Math.hypot(enemy.knockX, enemy.knockY);
    if (klen > cap) {
      enemy.knockX = (enemy.knockX / klen) * cap;
      enemy.knockY = (enemy.knockY / klen) * cap;
    }
    this.screenShake = Math.max(this.screenShake || 0, boss ? 2.1 : 1.6);
    if ((this.frames || 0) >= (this._hitStopReady || 0)) {
      this.hitStopTimer = Math.max(this.hitStopTimer || 0, 2);
      this._hitStopReady = (this.frames || 0) + 8;
    }
    if (this.particles) this.particles.spawnHitSparks(enemy.x, enemy.y, dx, dy, color || '#ffffff');
    sounds.playHitmarker();
  }

  applyCappedEnemyDamage(enemy, rawDamage, from) {
    if (!enemy || enemy.isIndestructible) return 0;
    let dmg = Math.max(0, rawDamage);
    const isBossUnit = enemy.isBoss || (enemy.type && enemy.type.startsWith('boss'));
    if (isBossUnit && enemy.enrageShieldTimer > 0) {
      dmg *= 0.25; // Faz geçişi zırh koruması
    }
    if (enemy.maxDamagePerHitRatio && enemy.maxHp > 0) {
      const maxAllowed = Math.max(1, enemy.maxHp * enemy.maxDamagePerHitRatio);
      dmg = Math.min(dmg, maxAllowed);
    } else if (isBossUnit && enemy.maxHp > 0) {
      dmg = Math.min(dmg, Math.max(2, enemy.maxHp * 0.045));
    }

    // Aynı karede / kısa zaman penceresinde (15 kare ~0.25 sn) çoklu mermi, pompalı ve yetenek kombosuyla tek atmayı önleyen Burst Zırh Tavanı
    if ((isBossUnit || enemy.isFleetMember || enemy.maxDamagePerHitRatio) && enemy.maxHp > 0) {
      const nowFrame = this.frames || 0;
      if (enemy._dmgWinStart === undefined || (nowFrame - enemy._dmgWinStart) >= 15 || nowFrame < enemy._dmgWinStart) {
        enemy._dmgWinStart = nowFrame;
        enemy._dmgWinAccum = 0;
      }
      const windowCapRatio = isBossUnit ? 0.075 : (enemy.isFleetCommander ? 0.22 : 0.36);
      const maxWindowDmg = Math.max(2, enemy.maxHp * windowCapRatio);
      const remainingBudget = Math.max(0, maxWindowDmg - enemy._dmgWinAccum);
      dmg = Math.min(dmg, remainingBudget);
      enemy._dmgWinAccum += dmg;
    }

    enemy.hp -= dmg;

    if (dmg > 0 && from !== false && !enemy._ballooning) {
      const hx = from && typeof from.x === 'number' ? from.x : (this.player ? this.player.x : enemy.x);
      const hy = from && typeof from.y === 'number' ? from.y : (this.player ? this.player.y : enemy.y + 28);
      this.feelStrike(enemy, hx, hy, from && from.color);
    }

    return dmg;
  }

  updateEnemies(dt = 1.0) {
    // Düşmanları Güncelle
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy._ballooning) {
        enemy.balloonT = (enemy.balloonT || 0) + dt;
        enemy.hitFlash = Math.max(enemy.hitFlash || 0, 4);
        if (enemy.balloonT >= 5) {
          enemy._ballooning = false;
          enemy._balloonDone = true;
          this.handleEnemyDeath(enemy);
          this.enemies.splice(i, 1);
        }
        continue;
      }
      enemy.update(this.player.x, this.player.y, this.enemyProjectiles, this.width, this.height, dt);

      // Zehir Hasarı (Toxic iğneleriyle zehirlenmiş düşmanlar)
      if (enemy.poisonTimer > 0 && enemy.hp > 0 && !enemy.toRemove) {
        enemy.poisonTimer -= dt;
        this.applyCappedEnemyDamage(enemy, (enemy.poisonDmg || 1.8) * 0.04 * dt, false);
        if (this.frames % 15 === 0) {
          this.particles.spawnExplosion(enemy.x, enemy.y, '#05ffa1', 1, 0.9);
        }
      }

      // Bomba Taşı Zincirleme Patlama Gecikmesi (Organik kademeli patlama)
      if (enemy.delayedBombBlast) {
        enemy.delayedBombBlast.timer -= dt;
        // Patlama dalgası taşı sararken taş şiddetle titrer ve beyaz-kırmızı akkor parlar
        enemy.x += (Math.random() - 0.5) * 2.5;
        enemy.y += (Math.random() - 0.5) * 2.5;
        enemy.hitFlash = Math.max(enemy.hitFlash || 0, 5);

        if (enemy.delayedBombBlast.timer <= 0) {
          const dmg = enemy.delayedBombBlast.damage;
          enemy.delayedBombBlast = null;
          this.applyCappedEnemyDamage(enemy, dmg);
          this.particles.spawnExplosion(enemy.x, enemy.y, '#ff4d00', 8, 2.2);
        }
      }
      if ((enemy.isBoss || (enemy.type && enemy.type.startsWith('boss'))) && enemy.justEnraged) {
        enemy.justEnraged = false;
        sounds.playBossAlarm();
        sounds.setBossEnraged(true);
        vibrate.heavy();
        this.screenShake = 18;
        this.whiteFlash = 0.45;
        this.particles.spawnShockwave(enemy.x, enemy.y, '#ff1744', 340);
        this.particles.spawnShockwave(enemy.x, enemy.y, '#ffd700', 220);
        for (let a = 0; a < 14; a++) {
          const ang = (a * Math.PI / 7);
          this.particles.spawnExplosion(enemy.x + Math.cos(ang) * 22, enemy.y + Math.sin(ang) * 22, '#ff9100', 6, 3.2);
        }
        this.particles.spawnFloatingText(this.width / 2, 200, txt('boss_armor_shed'), '#ff1744', 16);
      }

      // 1. Mermi ile Çarpışma Kontrolü (Ekran dışı erken patlama koruması: y >= 15)
      if (enemy.y >= 15) {
        for (let j = this.playerBullets.length - 1; j >= 0; j--) {
          const bullet = this.playerBullets[j];
          if (bullet.hitEnemies && bullet.hitEnemies.has(enemy)) continue;
          const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
          if (dist < enemy.radius + 6) {
            // Kullanıcı talebi: Güdümlü füzeler yok edilemez olsun! Mermiler seker, hasar almaz.
            if (enemy.isIndestructible) {
              sounds.playHitmarker();
              this.particles.spawnExplosion(bullet.x, bullet.y, '#ffd700', 3, 1.2);
              this.playerBullets.splice(j, 1);
              continue;
            }

            // ÖN KALKANLI AKINCI: Ön 120 dereceden gelen mermileri tamamen saptırır (Filo üyeleri kısmi hasar alır ki ölümsüz olmasın)
            if (enemy.hasFrontShield && bullet.y > enemy.y && !enemy.isFleetMember) {
              sounds.playDeflect();
              this.particles.spawnShockwave(bullet.x, bullet.y, '#38bdf8', 25);
              this.particles.spawnExplosion(bullet.x, bullet.y, '#38bdf8', 5, 1.6);
              this.playerBullets.splice(j, 1);
              continue;
            }
            let hitDamage = bullet.damage;
            if (enemy.hasFrontShield && bullet.y > enemy.y && enemy.isFleetMember) {
              hitDamage *= 0.55;
              sounds.playDeflect();
              this.particles.spawnExplosion(bullet.x, bullet.y, '#38bdf8', 3, 1.2);
            }
            // Boss Faz 2 (Açık Çekirdek): Zırh plakaları döküldüğü için %30 ekstra hasar alır!
            if ((enemy.isBoss || enemy.type.startsWith('boss')) && enemy.phase === 2) {
              hitDamage *= 1.30;
            }

          // 7. BOSS KIRILABİLİR SİLAH PODLARI & SAVUNMASIZ ÇEKİRDEK (WEAKPOINT)
          if (enemy.isBoss || enemy.type.startsWith('boss')) {
            const relX = bullet.x - enemy.x;
            const podHitDmg = Math.min(hitDamage, Math.max(4, enemy.maxHp * 0.035));
            // Sol Pod Vuruşu
            if (relX < -12 && !enemy.leftPodDestroyed) {
              enemy.leftPodHp = (enemy.leftPodHp || 50) - podHitDmg;
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
              enemy.rightPodHp = (enemy.rightPodHp || 50) - podHitDmg;
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
            const masteryCritBonus = (this.masteryTree && this.masteryTree.critDmg) ? this.masteryTree.critDmg * 0.15 : 0;
            const critMult = (this.currentAnomaly?.type === 'void_rift' ? 2.5 : 2.0) + masteryCritBonus;
            hitDamage *= critMult;
          }

          const appliedDmg = this.applyCappedEnemyDamage(enemy, hitDamage, { x: bullet.x, y: bullet.y, color: bullet.color || '#00f0ff' });
          this.recordWeaponDamage((bullet.pierce && bullet.pierce > 0) ? 'drones' : 'laser', appliedDmg);

          if (isCrit) {
            sounds.playCritHit();
            this.particles.spawnFloatingText(enemy.x, enemy.y - 14, `CRIT! ${Math.max(1, Math.round(appliedDmg))}`, '#ff0055', 15);
            this.particles.spawnExplosion(bullet.x, bullet.y, '#ff0055', 8, 2.5);
          }

          // Mutlak Sıfır Kriyojenik Blaster Evrimi (Dondurma)
          if (this.player.evolutions && this.player.evolutions.cryoBlaster && this.armPerk('cryoPulse', 12 * 60)) {
            enemy.frozen = Math.min(90, (enemy.frozen || 0) + 40);
            if (Math.random() < 0.30) {
              sounds.playFreeze();
              this.particles.spawnExplosion(bullet.x, bullet.y, '#38bdf8', 4, 1.4);
            }
          }

          // Tesla Zincirleme Yıldırım (Dengeli hayatta kalma ölçeklemesi)
          if (this.player.upgrades.tesla > 0 && Math.random() < (0.18 + this.player.upgrades.tesla * 0.08)) {
            let zapCount = 0;
            const maxZaps = this.player.upgrades.tesla; // Seviye arttıkça hedef sayısı (1, 2, 3, 4 hedef)
            const teslaDmg = (2.2 + this.player.upgrades.tesla * 1.4) * (this.player.damageMultiplier || 1);
            for (let other of this.enemies) {
              if (other !== enemy && !other.toRemove && other.hp > 0) {
                const ed = Math.hypot(other.x - enemy.x, other.y - enemy.y);
                if (ed < 155) {
                  const zapApplied = this.applyCappedEnemyDamage(other, teslaDmg);
                  this.recordWeaponDamage('tesla', zapApplied);
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

          if (bullet.isVortex && this.vortices.length < 2 && this.armPerk('vortexHit', 24 * 60)) {
            this.vortices.push({ x: bullet.x, y: bullet.y, timer: 80, radius: 58 });
          }

          if (bullet.isSolarFlare && !bullet._burnSpawned) {
            bullet._burnSpawned = true;
            if (!this.fireZones) this.fireZones = [];
            this.fireZones.push({ x: bullet.x, y: bullet.y, radius: 55, timer: 120, dps: 8 });
            this.particles.spawnExplosion(bullet.x, bullet.y, '#ff9100', 10, 2.2);
          }

          if (bullet.isSplash) {
            sounds.playExplosion(true);
            this.particles.spawnShockwave(bullet.x, bullet.y, '#ff3d00', 44);
            this.particles.spawnExplosion(bullet.x, bullet.y, '#ff9100', 14, 2.8);
            const splashMul = bullet.splashMul || 0.45;
            for (let other of this.enemies) {
              if (other !== enemy && !other.toRemove && other.hp > 0) {
                if (Math.hypot(other.x - bullet.x, other.y - bullet.y) < 52) {
                  const splashApplied = this.applyCappedEnemyDamage(other, bullet.damage * splashMul);
                  this.recordWeaponDamage('laser', splashApplied);
                  other.hitFlash = 3;
                }
              }
            }
          }
          if (bullet.isPoison) {
            enemy.poisonTimer = bullet.poisonTime || 90;
            enemy.poisonDmg = Math.max(1.2, bullet.damage * (bullet.poisonMul || 0.35));
          }

          if (bullet.isChronoSlug) {
            const boss = enemy.isBoss || (enemy.type && enemy.type.startsWith('boss'));
            if (boss) enemy.slowTimer = Math.max(enemy.slowTimer || 0, 50);
            else enemy.freezeTimer = Math.max(enemy.freezeTimer || 0, 36);
          }
          if (bullet.isGravitySlug && !bullet._wellSpawned && this.vortices.length < 2 && this.armPerk('gravityWell', 28 * 60)) {
            bullet._wellSpawned = true;
            this.vortices.push({ x: bullet.x, y: bullet.y, timer: 70, radius: 54, isNovaVortex: true });
          }
          if (bullet.isLaneClear && !bullet._laneCleared) {
            bullet._laneCleared = true;
            for (let p = this.enemyProjectiles.length - 1; p >= 0; p--) {
              const ep = this.enemyProjectiles[p];
              const dx = ep.x - bullet.x;
              const dy = ep.y - bullet.y;
              if (dx * dx + dy * dy < 48 * 48) this.enemyProjectiles.splice(p, 1);
            }
          }

          if (bullet.isRailgun) {
            // Railgun: Hedefe çarptığında güçlü şok dalgası ve patlama yaratır, birimlerin içinden geçmez!
            this.particles.spawnShockwave(bullet.x, enemy.y, '#38bdf8', 36);
            this.particles.spawnExplosion(bullet.x, enemy.y, '#ffffff', 6, 1.8);
            this.playerBullets.splice(j, 1);
          } else if (bullet.piercing || bullet.isPiercing || (bullet.pierce && bullet.pierce > 0)) {
            if (!bullet.hitEnemies) bullet.hitEnemies = new Set();
            bullet.hitEnemies.add(enemy);
            bullet.penetrations = (bullet.penetrations || 0) + 1;
            const maxPen = bullet.pierce ? (bullet.pierce + 1) : 3;
            if (bullet.penetrations >= maxPen || enemy.isBoss || (enemy.type && enemy.type.startsWith('boss'))) {
              this.playerBullets.splice(j, 1);
            }
          } else {
            this.playerBullets.splice(j, 1);
          }
          break;
        }
      }
    }

      // 2. Güdümlü Füze ile Çarpışma (Ekran dışı koruması: y >= 15)
      if (enemy.y >= 15) {
        for (let j = this.homingMissiles.length - 1; j >= 0; j--) {
          const missile = this.homingMissiles[j];
          if (missile.state && missile.state !== 'active') continue;
          const dist = Math.hypot(missile.x - enemy.x, missile.y - enemy.y);
          if (dist < enemy.radius + 8) {
            const mApplied = this.applyCappedEnemyDamage(enemy, missile.damage);
            this.recordWeaponDamage('missiles', mApplied);
            enemy.hitFlash = 4;
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
                  const cApplied = this.applyCappedEnemyDamage(other, 15);
                  this.recordWeaponDamage('missiles', cApplied);
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
            const dApplied = this.applyCappedEnemyDamage(enemy, droneDmg);
            this.recordWeaponDamage('drones', dApplied);
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
              const netApplied = this.applyCappedEnemyDamage(enemy, 0.14 * dt, false);
              this.recordWeaponDamage('drones', netApplied);
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
        this.takeDamage(dmg, enemy.x, enemy.y);
        if (!isThisBoss && !enemy.isFleetCommander) {
          enemy.toRemove = true;
        } else {
          this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer || 0, 30);
        }
      } else if (!enemy.grazed && playerDist < enemy.radius + this.player.radius + 20) {
        // 5. YAKIN TEĞET (GRAZE): Düşman veya Asteroit sıyırma
        enemy.grazed = true;
        this.triggerGraze(enemy.x, enemy.y);
      }

      // 5. Ekranın Altına Kaçan Düşmanlar (Gezegen Savunma Hattı / Bariyer)
      if (enemy.y >= this.height - 10 && !enemy.barrierHit && !isThisBoss && enemy.type !== 'escort_fighter' && !enemy.isIndestructible) {
        enemy.barrierHit = true;
        this.handleEnemyEscaped(enemy);
      }

      // Düşman Öldü mü?
      if (enemy.hp <= 0) {
        this.handleEnemyDeath(enemy);
        if (!enemy._ballooning) this.enemies.splice(i, 1);
      } else if (enemy.toRemove) {
        this.enemies.splice(i, 1);
      }
    }

    // İkili Lazer Bağı Dronları (Tether Drone) Çarpışma Kontrolü
    this.checkTetherCollisions(dt);

    // Mor Kozmik Domino Patlama Kuyruğu (Minecraft TNT tarzı seri zincirleme reaksiyon)
    if (this.dominoQueue && this.dominoQueue.length > 0) {
      for (let i = this.dominoQueue.length - 1; i >= 0; i--) {
        const dItem = this.dominoQueue[i];
        dItem.delayTimer -= dt;
        if (dItem.delayTimer <= 0) {
          this.executeDominoExplosion(dItem);
          this.dominoQueue.splice(i, 1);
        }
      }
    }

    // Savrulan mermiler düşmanlara hasar verir
    for (let proj of this.enemyProjectiles) {
      if (!proj.isDeflected || proj.toRemove) continue;
      for (let enemy of this.enemies) {
        if (enemy.toRemove) continue;
        const dd = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
        if (dd < enemy.radius + proj.radius) {
          this.applyCappedEnemyDamage(enemy, 12);
          enemy.hitFlash = 4;
          proj.toRemove = true;
          this.particles.spawnExplosion(enemy.x, enemy.y, '#00f0ff', 6, 2.5);
          break;
        }
      }
    }

    // Düşman Mermilerini Sınırla ve Güncelle (Mermilerin hareket etmesi için p.update çağrılır!)
    if (this.enemyProjectiles.length > 65) {
      this.enemyProjectiles.splice(0, this.enemyProjectiles.length - 65);
    }
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const p = this.enemyProjectiles[i];
      p.update(this.width, this.height, dt);
      if (p.toRemove) {
        this.enemyProjectiles.splice(i, 1);
        continue;
      }
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
        this.takeDamage(pDmg, p.x, p.y);
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
  }

  triggerGraze(sourceX, sourceY) {
    sounds.playGraze();
    vibrate.light();

    if (this.pilotStats) {
      this.pilotStats.totalGraze = (this.pilotStats.totalGraze || 0) + 1;
    }

    // Yakın teğet geçişinde bonus Overdrive şarjı, XP ve Adrenalin
    const chargeBonus = 5.0 * (this.player.reactorChargeMult || 1.0);
    if (!this.player.isFever) {
      this.player.feverCharge = Math.min(100, (this.player.feverCharge || 0) + chargeBonus);
    }
    const xpMult = 1 + ((this.masteryTree && this.masteryTree.xpBonus) ? this.masteryTree.xpBonus * 0.08 : 0);
    this.player.xp += 0.3 * xpMult;
    if (this.player.xp >= this.player.nextXp) this.checkLevelUp();
    this.player.score += 45;
    // 1.3 saniyelik Adrenalin Patlaması (+%25 seri ateş hızı)
    this.player.adrenalineTimer = this.currentSkinId === 'cyberpunk' ? 150 : 80;
    if (this.particles && this.particles.spawnGrazeSparks) {
      this.particles.spawnGrazeSparks(sourceX || this.player.x, sourceY || this.player.y);
    }
    this.updateHUD();
  }

  // Mor Asteroid Domino Zincirleme Patlama Tetikleyicisi (Boss ve Filo gemilerini tek atarak öldürmez!)
  triggerPurpleDominoCascade(sourceEnemy) {
    const originX = sourceEnemy.x;
    const originY = sourceEnemy.y;

    // Ekranda görünen aktif normal düşmanlar & asteroitler (Boss ve Filo Komutanları hariç)
    const candidates = [];
    for (let other of this.enemies) {
      if (other !== sourceEnemy && !other.toRemove && other.hp > 0 && !other.isBoss && !(other.type && other.type.startsWith('boss')) && !other.isFleetMember && !other.isIndestructible && other.y >= -40 && other.y <= this.height + 40) {
        const d = Math.hypot(other.x - originX, other.y - originY);
        candidates.push({ enemy: other, dist: d });
      }
    }

    // Kendine en yakın olandan en uzağa doğru sırala
    candidates.sort((a, b) => a.dist - b.dist);

    if (candidates.length === 0) return;

    // Her adayı zincirleme patlama için işaretle (hızlı titreme & akkor mor parıltı)
    for (const c of candidates) {
      c.enemy.isPrimedForDomino = true;
    }

    // Minecraft TNT gibi ama çok daha seri, doyurucu kademeli domino zinciri (~36ms aralık)
    let lastX = originX;
    let lastY = originY;
    candidates.forEach((c, idx) => {
      this.dominoQueue.push({
        target: c.enemy,
        fromX: lastX,
        fromY: lastY,
        targetX: c.enemy.x,
        targetY: c.enemy.y,
        delayTimer: (idx + 1) * 2.2,
        radius: c.enemy.radius || 20,
        score: c.enemy.score || 35
      });
      lastX = c.enemy.x;
      lastY = c.enemy.y;
    });
  }

  executeDominoExplosion(item) {
    const tx = (item.target && !item.target.toRemove) ? item.target.x : item.targetX;
    const ty = (item.target && !item.target.toRemove) ? item.target.y : item.targetY;

    // 1. Önceki patlama merkezinden bu hedefe mor enerji yıldırımı
    if (this.particles && this.particles.spawnLightning) {
      this.particles.spawnLightning(item.fromX, item.fromY, tx, ty, '#e879f9', 5);
    }

    // 2. Mor şok dalgası ve parçalanma patlaması
    this.particles.spawnShockwave(tx, ty, '#c084fc', 85);
    this.particles.spawnExplosion(tx, ty, '#e879f9', 18, 3.2);
    this.particles.spawnAsteroidBreakAnimation(tx, ty, item.radius || 20, true, 'purple');

    // 3. Vurucu ses ve mikro ekran sarsıntısı
    sounds.playCritHit();
    this.screenShake = Math.max(this.screenShake, 5);
    if (typeof vibrate !== 'undefined' && vibrate.light) {
      vibrate.light();
    }

    // 4. Hedefi öldür ve puan/kristal ver (Boss ve Filo gemileri korunur)
    if (item.target && !item.target.toRemove && item.target.hp > 0 && !item.target.isBoss && !(item.target.type && item.target.type.startsWith('boss')) && !item.target.isFleetMember) {
      item.target.isDominoChained = true;
      item.target.hp = 0;
      this.handleEnemyDeath(item.target);
      if (!item.target._ballooning) {
        item.target.toRemove = true;
        const idx = this.enemies.indexOf(item.target);
        if (idx !== -1) this.enemies.splice(idx, 1);
      }
    }

    // Mini kristal ganimeti
    this.gems.push(new Gem(tx, ty, 1));
  }

  handleEnemyDeath(enemy) {
    if (!enemy || enemy._deathHandled) return;
    if (!enemy._balloonDone && !enemy.isIndestructible) {
      if (!enemy._ballooning) {
        enemy._ballooning = true;
        enemy.balloonT = 0;
        enemy.hp = 0;
        enemy.hitFlash = 5;
      }
      return;
    }
    enemy._deathHandled = true;
    enemy.toRemove = true;
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
    if (this.particles.floatingTexts.length < 10) {
      this.particles.spawnFloatingText(enemy.x, enemy.y - 6, `+${points}`, this.comboCount >= 10 ? '#ffd700' : '#ffffff', this.comboCount >= 10 ? 14 : 11);
    }
    
    if (this.comboCount > 1 && this.comboCount % 5 === 0) {
      this.screenShake = Math.min(5, this.comboCount * 0.25);
      sounds.playLevelUp();
    }

    // Kombo Kademeleri (Temiz ve sarsıntısız akış - merkezde dev halka veya kör edici flaş patlaması olmadan)
    if (this.comboCount === 10) {
      this.particles.spawnFloatingText(this.width / 2, this.height * 0.25, '[COMBO 10X] ULTRA!', '#00f0ff', 16);
    } else if (this.comboCount === 20) {
      this.particles.spawnFloatingText(this.width / 2, this.height * 0.25, '[COMBO 20X] MEGA!', '#ffbe0b', 18);
    } else if (this.comboCount === 30) {
      this.particles.spawnFloatingText(this.width / 2, this.height * 0.25, '[COMBO 30X] DURDURULAMAZ!', '#ff0077', 18);
    } else if (this.comboCount === 40) {
      this.particles.spawnFloatingText(this.width / 2, this.height * 0.25, t('float_combo_40'), '#a855f7', 20);
    } else if (this.comboCount === 50) {
      this.particles.spawnFloatingText(this.width / 2, this.height * 0.25, t('float_combo_50'), '#ffd700', 22);
    }
    
    // Kombo XP Bonusu: 15+ komboda her 5 adımda ekstra XP
    if (this.comboCount >= 15 && this.comboCount % 5 === 0) {
      const xpMult = 1 + ((this.masteryTree && this.masteryTree.xpBonus) ? this.masteryTree.xpBonus * 0.08 : 0);
      this.player.xp += 2 * xpMult;
      if (this.player.xp >= this.player.nextXp) this.checkLevelUp();
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
        if (other !== enemy && other.hp > 0 && !other.toRemove && Math.hypot(other.x - enemy.x, other.y - enemy.y) < 95) {
          const applied = this.applyCappedEnemyDamage(other, 22 * (this.player.damageMultiplier || 1.0));
          this.recordWeaponDamage('laser', applied);
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

    this.screenShake = isThisBoss ? 24 : 5;
    this.particles.spawnExplosion(enemy.x, enemy.y, '#ffffff', isThisBoss ? 10 : 6, 3.2);
    this.particles.spawnExplosion(enemy.x, enemy.y, enemy.color, isThisBoss ? 45 : 14, 4.2);
    this.particles.spawnShockwave(enemy.x, enemy.y, '#ffffff', isThisBoss ? 90 : Math.max(26, (enemy.radius || 12) * 2.4));
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
      this.playDealtStage(11, enemy.x, enemy.y, enemy.color || '#ff0055');
      if (!this._pendingVictory && this.openingSwarmPhase <= 0) {
        this.spawnOpeningMeteorCluster(this.wave, true, Math.min(9, Math.floor((this.gameTime || 0) / 36)));
      }

      // Boss gövdesinde kademeli artçı patlama fırtınası
      const bossDeathX = enemy.x;
      const bossDeathY = enemy.y;
      for (let s = 1; s <= 5; s++) {
        setTimeout(() => {
          if (!this.particles || (this.state !== 'PLAYING' && !this._pendingVictory)) return;
          const ox = bossDeathX + (Math.random() * 90 - 45);
          const oy = bossDeathY + (Math.random() * 90 - 45);
          this.particles.spawnExplosion(ox, oy, '#ff0077', 16, 4);
          this.particles.spawnExplosion(ox, oy, '#ffbe0b', 12, 3);
          this.particles.spawnShockwave(ox, oy, '#00f0ff', 160);
          sounds.playExplosion(true);
        }, s * 130);
      }
    }

    // Normal düşman öldürmede takılma/kasma olmaması için hit-stop ve slowMo kaldırıldı

    // Bomba Asteroit Alan Patlaması & Kademeli Zincirleme Reaksiyon
    if (enemy.type === 'asteroid_bomb') {
      const isOpener = enemy.isOpeningCluster || enemy.isCoreBomb;
      sounds.playExplosion(true);
      if (isOpener) {
        this.hitStopTimer = 4;
        this.screenShake = 16;
        if (sounds.playJackpot) sounds.playJackpot();
        if (this.player) {
          // Açılış kancası: Tüm parçalanan meteorların kristallerini ve XP'sini oyuncuya doğru vakumla çeker!
          this.player.vacuumTimer = Math.max(this.player.vacuumTimer || 0, 240);
        }
      } else {
        this.screenShake = 8;
      }
      // Açılış kümesinde tüm hilal kuşağını kapsayan tatmin edici domino patlaması
      const blastRadius = isOpener ? 175 : 85;
      const blastDamage = isOpener ? 65 : 25;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#ff0055', isOpener ? 160 : 90);
      this.particles.spawnExplosion(enemy.x, enemy.y, '#ff3d00', isOpener ? 40 : 24, isOpener ? 4.8 : 3.5);

      // Yalnızca yakın çevresindeki düşman ve taşlara kademeli patlama
      const bombX = enemy.x;
      const bombY = enemy.y;

      for (let other of this.enemies) {
        if (other !== enemy && !other.toRemove && other.hp > 0) {
          const d = Math.hypot(other.x - bombX, other.y - bombY);
          if (d < blastRadius) {
            // Şok dalgası varış süresine göre kademeli gecikme (2 ila 8 kare)
            const delayFrames = Math.max(2, Math.min(8, Math.floor(d * 0.05)));
            other.delayedBombBlast = {
              timer: delayFrames,
              damage: blastDamage,
              fromX: bombX,
              fromY: bombY
            };
            other.hitFlash = Math.max(other.hitFlash || 0, 8);
          }
        }
      }
      this.updateMissionProgress('detonate_bomb', 1);
      if (this.pilotStats) {
        this.pilotStats.bombAsteroidsDestroyed = (this.pilotStats.bombAsteroidsDestroyed || 0) + 1;
      }
    } else if (enemy.type === 'asteroid_purple') {
      // Mor Kozmik Domino Asteroidi: Minecraft TNT mantığıyla en yakından en uzağa sırayla patlatır
      sounds.playNuke();
      sounds.playExplosion(true);
      this.screenShake = 14;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#c084fc', 180);
      this.particles.spawnExplosion(enemy.x, enemy.y, '#e879f9', 36, 4.5);
      this.particles.spawnAsteroidBreakAnimation(enemy.x, enemy.y, enemy.radius || 22, true, 'purple');

      if (!enemy.isDominoChained) {
        this.triggerPurpleDominoCascade(enemy);
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
      this.particles.spawnAsteroidBreakAnimation(enemy.x, enemy.y, enemy.radius || 24, true);

      // Yakındaki tüm düşmanlara 40 EMP hasarı!
      for (let other of this.enemies) {
        if (other !== enemy && !other.toRemove && other.hp > 0) {
          const d = Math.hypot(other.x - enemy.x, other.y - enemy.y);
          if (d < 130) {
            this.applyCappedEnemyDamage(other, 40);
            this.particles.spawnExplosion(other.x, other.y, '#c084fc', 8, 2);
            if (other.hp <= 0) {
              this.handleEnemyDeath(other);
            }
          }
        }
      }
      enemy._droppedHazardGem = true;
      const val = Math.max(3, Math.round(3 * this.getProgressionXpMultiplier()));
      this.gems.push(new Gem(enemy.x, enemy.y, val));
    } else if (enemy.type === 'asteroid_vortex' || enemy.isVortexHazard) {
      sounds.playBomb();
      this.screenShake = 11;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#9333ea', 145);
      this.particles.spawnExplosion(enemy.x, enemy.y, '#c084fc', 28, 4.2);
      this.particles.spawnAsteroidBreakAnimation(enemy.x, enemy.y, enemy.radius || 23, true);

      // Kuantum Girdap Çöküşü: Çevredeki düşmanları içine çekip 45 hasar verir
      for (let other of this.enemies) {
        if (other !== enemy && !other.toRemove && other.hp > 0) {
          const d = Math.hypot(other.x - enemy.x, other.y - enemy.y);
          if (d < 145) {
            if (!other.isBoss && !(other.type && other.type.startsWith('boss'))) {
              other.x += (enemy.x - other.x) * 0.4;
              other.y += (enemy.y - other.y) * 0.4;
            }
            this.applyCappedEnemyDamage(other, 45);
            this.particles.spawnExplosion(other.x, other.y, '#c084fc', 6, 2);
          }
        }
      }
      enemy._droppedHazardGem = true;
      const vVal = Math.max(3, Math.round(3 * this.getProgressionXpMultiplier()));
      this.gems.push(new Gem(enemy.x, enemy.y, vVal));
    } else if (enemy.type === 'asteroid_cryo' || enemy.isCryoHazard) {
      sounds.playFreeze();
      this.screenShake = 8;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#38bdf8', 115);
      this.particles.spawnExplosion(enemy.x, enemy.y, '#e0f2fe', 22, 3.2);
      this.particles.spawnAsteroidBreakAnimation(enemy.x, enemy.y, enemy.radius || 21, true);

      // Yakındaki oyuncuyu 1.2 sn dondurur ve yavaşlatır!
      if (Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y) < 115) {
        this.player.cryoSlowTimer = 75;
        if (typeof vibrate !== 'undefined' && vibrate.medium) vibrate.medium();
      }
      // Düşmanları dondurur
      for (let other of this.enemies) {
        if (other !== enemy && !other.toRemove && other.hp > 0) {
          if (Math.hypot(other.x - enemy.x, other.y - enemy.y) < 115) {
            other.frozen = 75;
          }
        }
      }
      enemy._droppedHazardGem = true;
      const cVal = Math.max(2, Math.round(2.5 * this.getProgressionXpMultiplier()));
      this.gems.push(new Gem(enemy.x, enemy.y, cVal));
    } else if (enemy.type === 'asteroid_geode' || enemy.isGeode) {
      sounds.playJackpot();
      this.screenShake = 10;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#05ffa1', 130);
      this.particles.spawnExplosion(enemy.x, enemy.y, '#05ffa1', 26, 3.8);
      this.particles.spawnAsteroidBreakAnimation(enemy.x, enemy.y, enemy.radius || 19, true);

      // Zümrüt Geod Bonusu: 8 adet zengin XP kristali saçar!
      enemy._droppedHazardGem = true;
      const gVal = Math.max(2, Math.round(2 * this.getProgressionXpMultiplier()));
      for (let g = 0; g < 8; g++) {
        const ox = (Math.random() - 0.5) * 36;
        const oy = (Math.random() - 0.5) * 36;
        this.gems.push(new Gem(enemy.x + ox, enemy.y + oy, gVal));
      }
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
      this.particles.spawnAsteroidBreakAnimation(
        enemy.x,
        enemy.y,
        enemy.radius || 20,
        enemy.type === 'asteroid_bomb' || enemy.type === 'asteroid_purple',
        enemy.type === 'asteroid_purple' ? 'purple' : null
      );
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
        const leftM = new Enemy(enemy.x - 12, enemy.y, 'asteroid_m', 1, fragSpeed);
        leftM.speedX = -1.0;
        const rightM = new Enemy(enemy.x + 12, enemy.y, 'asteroid_m', 1, fragSpeed);
        rightM.speedX = 1.0;
        this.enemies.push(leftM);
        this.enemies.push(rightM);
        this.particles.spawnExplosion(enemy.x, enemy.y, '#8b9bb4', 12, 2.5);
      } else if (enemy.type === 'asteroid_m') {
        // Orta taş 2 küçük taşa bölünür
        const leftS = new Enemy(enemy.x - 10, enemy.y, 'asteroid_s', 1, fragSpeed);
        leftS.speedX = -1.1;
        const rightS = new Enemy(enemy.x + 10, enemy.y, 'asteroid_s', 1, fragSpeed);
        rightS.speedX = 1.1;
        this.enemies.push(leftS);
        this.enemies.push(rightS);
        this.particles.spawnExplosion(enemy.x, enemy.y, '#a0aec0', 10, 2.2);
      }
      // asteroid_s patlayınca BİTER, aşağıda zengin XP kristali verir
    } else {
      // === YENİ 2 AŞAMALI SİSTEM (İLK BOSS ÖNCESİ) ===
      if (enemy.type === 'asteroid_m' || enemy.type === 'asteroid_l') {
        const leftKid = new Enemy(enemy.x - 12, enemy.y, 'asteroid_s', 1, fragSpeed);
        leftKid.speedX = -1.1;
        const rightKid = new Enemy(enemy.x + 12, enemy.y, 'asteroid_s', 1, fragSpeed);
        rightKid.speedX = 1.1;
        this.enemies.push(leftKid);
        this.enemies.push(rightKid);
        this.particles.spawnExplosion(enemy.x, enemy.y, '#a0aec0', 10, 2.2);
      }
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
      this.enemyProjectiles = []; // Boss öldüğünde ekrandaki mermileri temizle ki oyuncu zafer anında ölmesin
      this.telegraphs = [];
      this.activeBeams = [];
      this.dominoQueue = [];
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
      this.particles.spawnShockwave(enemy.x, enemy.y, enemy.color || '#ffbe0b', 320);
      // Altın Uzay Sandığı Ganimeti (Fırtına modunda sandık düşer, Sefer modunda doğrudan Rota Seçimi açılır)
      if (this.currentMode !== 'classic') {
        this.luckyChests.push(new LuckyChest(enemy.x, enemy.y));
      }
      // Can yenile
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + (isIntro ? 35 : 45));
      this.updateMissionProgress('defeat_boss', 1);
      if (this.pilotStats) {
        this.pilotStats.bossesDefeated = (this.pilotStats.bossesDefeated || 0) + 1;
        this.savePilotStats();
      }

      // === 38 SEVİYELİ SEFER (CAMPAIGN) MODU: BÖLÜM ZAFERİ KONTROLÜ ===
      if (this.currentMode === 'classic' && (enemy.isLevelBoss || enemy === this.currentLevelBoss || this.levelBossSpawned)) {
        // Zafer anında kalan muhafızları/taşları temizle ve oyuncuya tam hasarsızlık ver ki 1.2sn ağır çekimde asla ölmesin veya oyun takılmasın!
        this.player.phaseTimer = Math.max(this.player.phaseTimer || 0, 120);
        for (let k = this.enemies.length - 1; k >= 0; k--) {
          const rem = this.enemies[k];
          if (rem !== enemy) {
            rem.toRemove = true;
          }
        }
        this.particles.spawnFloatingText(this.width / 2, this.height * 0.35, t('level_done', { n: this.selectedLevel }), '#ffd700', 18);
        this.particles.spawnShockwave(this.width / 2, this.height * 0.4, '#ffd700', 360);
        this._pendingVictory = true;
        setTimeout(() => {
          if (this.state !== 'MENU' && this.state !== 'GAME_OVER' && this.state !== 'GAMEOVER' && this._pendingVictory) {
            this._pendingVictory = false;
            try {
              this.triggerLevelVictory();
            } catch (err) {
              console.error("Victory trigger hatası:", err);
            }
          }
        }, 1200);
        return;
      }

      if (isIntro) {
        this.particles.spawnFloatingText(this.width / 2, this.height * 0.35, t('float_boss_down'), '#ffd700', 16);
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
      this.particles.spawnFloatingText(enemy.x, enemy.y, t('float_cargo_loot'), '#ffd700', 15);
      const pTypes = ['overcharge', 'shield', 'magnet'];
      const pType = pTypes[Math.floor(Math.random() * pTypes.length)];
      this.powerups.push(new PowerUp(enemy.x, enemy.y, pType));
    } else if (enemy.type === 'elite_scout') {
      sounds.playLevelUp();
      vibrate.success();
      this.screenShake = 8;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#ffbe0b', 160);
      this.luckyChests.push(new LuckyChest(enemy.x, enemy.y));
      const pTypes = ['overcharge', 'shield', 'magnet'];
      const pType = pTypes[Math.floor(Math.random() * pTypes.length)];
      this.powerups.push(new PowerUp(enemy.x, enemy.y, pType));
    } else if (enemy.isChampion) {
      sounds.playLevelUp();
      vibrate.success();
      this.screenShake = 7;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#bf5af2', 150);
      if (Math.random() < 0.5) {
        this.luckyChests.push(new LuckyChest(enemy.x, enemy.y));
      } else {
        const pTypes = ['overcharge', 'shield', 'magnet'];
        const pType = pTypes[Math.floor(Math.random() * pTypes.length)];
        this.powerups.push(new PowerUp(enemy.x, enemy.y, pType));
      }
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
      sounds.playLevelUp();
      vibrate.success();
      this.screenShake = 6;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#ffbe0b', 140);
      this.particles.spawnExplosion(enemy.x, enemy.y, '#ffd166', 15, 3.2);
      this.player.feverCharge = Math.min(100, this.player.feverCharge + 1.2);
    } else if (enemy.type === 'volatile_core') {
      sounds.playCoreDetonate();
      vibrate.heavy();
      this.screenShake = 16;
      this.whiteFlash = 0.55;
      this.particles.spawnShockwave(enemy.x, enemy.y, '#ff0055', 280);
      this.particles.spawnShockwave(enemy.x, enemy.y, '#ffbe0b', 200);
      this.particles.spawnExplosion(enemy.x, enemy.y, '#ff0055', 25, 4.0);

      this.enemyProjectiles = [];

      for (let other of this.enemies) {
        if (other === enemy || other.hp <= 0) continue;
        const d = Math.hypot(other.x - enemy.x, other.y - enemy.y);
        if (d < 280) {
          this.applyCappedEnemyDamage(other, 65);
          this.particles.spawnExplosion(other.x, other.y, '#ff0055', 6, 1.8);
        }
      }
      this.player.feverCharge = Math.min(100, this.player.feverCharge + 2.5);
    } else if (enemy.type === 'asteroid_s') {
      this.particles.spawnExplosion(enemy.x, enemy.y, '#05ffa1', 10, 2.6);
      this.player.feverCharge = Math.min(100, this.player.feverCharge + 0.4);

      if (Math.random() < 0.06 && this.powerups.length < 3) {
        const pTypes = ['overcharge', 'shield', 'magnet'];
        const pType = pTypes[Math.floor(Math.random() * pTypes.length)];
        this.powerups.push(new PowerUp(enemy.x, enemy.y, pType));
      }
    } else if (enemy.type === 'escort_fighter' || enemy.type === 'dive_bomber') {
      this.player.feverCharge = Math.min(100, this.player.feverCharge + 0.5);
    }

    // Kalibre Edilmiş Düşman XP Kristallerini Düşür
    this.dropEnemyLoot(enemy);
    this.updateHUD();
  }

  dealImpact(x, y, color, applied, maxHp, killed, isCrit, isBoss) {
    const ratio = maxHp > 0 ? applied / maxHp : 0;
    let stage = 1;
    if (ratio >= 0.05) stage = 2;
    if (ratio >= 0.1) stage = 3;
    if (ratio >= 0.18) stage = 4;
    if (isCrit) stage = Math.max(stage, 5);
    if (ratio >= 0.32) stage = Math.max(stage, 6);
    if (isBoss && !killed) stage = Math.max(stage, 6);
    if (killed && (maxHp >= 12 || isBoss)) stage = Math.max(stage, 7);
    if (killed && maxHp >= 40 && (isCrit || ratio >= 0.45)) stage = Math.max(stage, 8);
    if (killed && maxHp >= 80 && ratio >= 0.7) stage = Math.max(stage, 9);
    if (killed && maxHp >= 80 && isCrit && ratio >= 0.55) stage = Math.max(stage, 10);
    if (isBoss && !killed) stage = Math.min(stage, 6);
    if (stage <= 2 && (this.frames % 3) !== 0) return;
    if (stage < 6 && (this.frames - (this._lastFeelFrame || 0)) < 4) return;
    this._lastFeelFrame = this.frames;
    this.playDealtStage(stage, x, y, color, isCrit, applied);
  }

  // Hasar verme: 1 kıvılcım → 11 patron kırılması. Yüksek kademe alttakini tekrarlamaz.
  playDealtStage(stage, x, y, color, isCrit, applied) {
    const c = color || '#00f0ff';
    switch (stage) {
      case 1:
        this.particles.spawnExplosion(x, y, c, 1, 1.1);
        break;
      case 2:
        this.particles.spawnExplosion(x, y, '#ffffff', 2, 1.4);
        break;
      case 3:
        this.particles.spawnDebris(x, y, c, 3);
        break;
      case 4:
        this.particles.spawnDebris(x, y, c, 5);
        this.particles.spawnShockwave(x, y, c, 18);
        break;
      case 5:
        this.particles.triggerHitstop(2);
        this.particles.spawnShockwave(x, y, '#ff0055', 28);
        if (isCrit) this.particles.spawnFloatingText(x, y - 16, 'CRIT', '#ff0055', 12);
        break;
      case 6:
        this.screenShake = Math.max(this.screenShake || 0, 3);
        this.particles.spawnShockwave(x, y, '#ffbe0b', 40);
        this.particles.spawnDebris(x, y, c, 6);
        break;
      case 7:
        this.hitStopTimer = Math.max(this.hitStopTimer || 0, 3);
        this.particles.spawnExplosion(x, y, c, 8, 2.2);
        this.particles.spawnDebris(x, y, '#ffffff', 7);
        break;
      case 8:
        this.screenShake = Math.max(this.screenShake || 0, 5);
        this.particles.triggerChromatic(8);
        this.particles.spawnShockwave(x, y, c, 70);
        break;
      case 9:
        this.screenShake = Math.max(this.screenShake || 0, 8);
        this.particles.triggerFlash('#ffffff', 0.35);
        this.particles.spawnShockwave(x, y, '#ffbe0b', 110);
        this.particles.spawnDebris(x, y, c, 10);
        break;
      case 10:
        this.screenShake = Math.max(this.screenShake || 0, 11);
        this.particles.triggerHitstop(4);
        this.particles.triggerChromatic(14);
        this.particles.spawnShockwave(x, y, '#ff0055', 150);
        this.particles.spawnFloatingText(x, y - 20, `${Math.max(1, Math.round(applied || 0))}`, '#ff0055', 16);
        break;
      default:
        this.particles.spawnShockwave(x, y, '#ffffff', 200);
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 * i) / 8;
          this.particles.spawnDebris(x + Math.cos(a) * 16, y + Math.sin(a) * 16, '#ffbe0b', 2);
        }
        break;
    }
  }

  // Hasar alma: 1 kalkan tıkı → 11 ölüm. Can yolu kalkan yolundan ayrı tırmanır.
  playTakenStage(stage, amount) {
    const x = this.player.x;
    const y = this.player.y;
    switch (stage) {
      case 1:
        this.player.hitFlash = Math.max(this.player.hitFlash || 0, 2);
        break;
      case 2:
        this.screenShake = Math.max(this.screenShake || 0, 2);
        this.particles.spawnExplosion(x, y, '#7dd3fc', 2, 1.2);
        break;
      case 3:
        this.screenShake = Math.max(this.screenShake || 0, 4);
        this.particles.spawnShockwave(x, y, '#00f0ff', 26);
        break;
      case 4:
        this.screenShake = Math.max(this.screenShake || 0, 6);
        this.particles.spawnDebris(x, y, '#00f0ff', 5);
        this.particles.triggerHitstop(1);
        break;
      case 5:
        this.screenShake = Math.max(this.screenShake || 0, 8);
        this.particles.triggerFlash('#00f0ff', 0.4);
        this.particles.spawnShockwave(x, y, '#ffffff', 80);
        break;
      case 6:
        this.damageFlash = Math.min(0.4, (this.damageFlash || 0) + 0.18);
        this.particles.spawnFloatingText(x, y - 22, `-${Math.max(1, Math.round(amount || 1))}`, '#ff0055', 13);
        break;
      case 7:
        this.damageFlash = Math.min(0.55, (this.damageFlash || 0) + 0.28);
        this.screenShake = Math.max(this.screenShake || 0, 7);
        this.particles.triggerHitstop(2);
        this.particles.spawnFloatingText(x, y - 22, `-${Math.max(1, Math.round(amount || 1))}`, '#ff0055', 15);
        break;
      case 8:
        this.damageFlash = Math.min(0.7, (this.damageFlash || 0) + 0.4);
        this.screenShake = Math.max(this.screenShake || 0, 10);
        this.particles.triggerFlash('#ff0055', 0.35);
        this.particles.spawnShockwave(x, y, '#ff0055', 60);
        this.particles.spawnFloatingText(x, y - 22, `-${Math.max(1, Math.round(amount || 1))}`, '#ff0055', 16);
        break;
      case 9:
        this.damageFlash = 0.75;
        this.screenShake = Math.max(this.screenShake || 0, 12);
        this.particles.triggerChromatic(10);
        this.particles.spawnShockwave(x, y, '#ff0055', 90);
        break;
      case 10:
        this.damageFlash = 0.9;
        this.screenShake = Math.max(this.screenShake || 0, 14);
        this.whiteFlash = Math.max(this.whiteFlash || 0, 0.35);
        this.particles.triggerChromatic(16);
        this.particles.triggerHitstop(3);
        break;
      default:
        this.damageFlash = 1;
        this.screenShake = Math.max(this.screenShake || 0, 16);
        this.particles.triggerFlash('#ff0055', 0.7);
        this.particles.spawnShockwave(x, y, '#ff0055', 160);
        break;
    }
  }

  feelPlayerHit(sx, sy, hull) {
    if (!this.player) return;
    this.player.hitFlash = Math.max(this.player.hitFlash || 0, hull ? 5 : 4);
    const ox = typeof sx === 'number' ? sx : this.player.x;
    const oy = typeof sy === 'number' ? sy : this.player.y - 36;
    let dx = this.player.x - ox;
    let dy = this.player.y - oy;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    this.player.knockX = dx * 1.1;
    this.player.knockY = dy * 1.1;
    this.screenShake = Math.max(this.screenShake || 0, hull ? 2.2 : 1.5);
    if ((this.frames || 0) >= (this._hitStopReady || 0)) {
      this.hitStopTimer = 2;
      this._hitStopReady = (this.frames || 0) + 8;
    }
    if (this.particles) this.particles.spawnHitSparks(this.player.x, this.player.y, dx, dy, hull ? '#ffffff' : '#7dd3fc');
  }

  takeDamage(amount, sx, sy) {
    if (this.deathPop > 0) return;
    if (this._pendingVictory || this.state !== 'PLAYING' || this.isMerchantActive || this.modalTransition) return;
    if (merchantModal && !merchantModal.classList.contains('hidden')) return;
    // Hayalet Plazma Kuantum Faz & Diriliş Dokunulmazlık Koruması
    if (this.player.phaseTimer > 0 || this.player.invulnerableTimer > 0) return;

    if (this.currentSkinId === 'phantom' && (!this.player.phaseCooldown || this.player.phaseCooldown <= 0)) {
      this.player.phaseTimer = 90;
      this.player.phaseCooldown = 480;
      sounds.playDeflect();
      vibrate.heavy();
      this.particles.spawnShockwave(this.player.x, this.player.y, '#00e5ff', 90);
      this.particles.spawnFloatingText(this.player.x, this.player.y - 30, t('perk_phase_active'), '#00e5ff', 14);
      return;
    }

    // Titan Çift Kalkan Modunda Alınan Hasar %50 Azalır
    if (this.player.titanShieldTimer > 0) {
      amount = Math.max(1, Math.round(amount * 0.5));
    }

    const incoming = amount;
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
        if (enemy.hp <= 0 || enemy.toRemove) continue;
        const d = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
        if (d < 260) {
          const applied = this.applyCappedEnemyDamage(enemy, 35);
          this.recordWeaponDamage('special', applied);
          this.particles.spawnExplosion(enemy.x, enemy.y, '#00f0ff', 7, 2.0);
          if (enemy.hp <= 0) {
            this.handleEnemyDeath(enemy);
          }
        }
      }
    }

    const shieldBroke = hadShield && this.player.shield <= 0;
    if (hadShield && amount === 0) {
      const shieldStage = shieldBroke ? 5 : (incoming >= 18 ? 4 : incoming >= 8 ? 3 : incoming >= 3 ? 2 : 1);
      this.playTakenStage(shieldStage, incoming);
    }

    // Kalan hasar cana gider
    if (amount > 0) {
      sounds.playPlayerHit();
      vibrate.heavy();
      this.player.hp -= amount;
      this.player.hitFlash = Math.max(this.player.hitFlash || 0, 7);
      const hpRatio = this.player.maxHp > 0 ? this.player.hp / this.player.maxHp : 1;
      let hurtStage = incoming >= 18 ? 8 : incoming >= 8 ? 7 : 6;
      if (hpRatio < 0.35) hurtStage = Math.max(hurtStage, 9);
      if (hpRatio < 0.15) hurtStage = Math.max(hurtStage, 10);
      if (this.player.hp <= 0) hurtStage = 11;
      this.playTakenStage(hurtStage, amount);
    }

    if (incoming > 0 && (hadShield || amount > 0)) {
      this.feelPlayerHit(sx, sy, amount > 0);
    }

    this.updateHUD();

    if (this.player.hp <= 0) {
      if (this.isTestFlight) {
        this.endShipTestFlight();
        return;
      }
      // Anka Protokolü (Phoenix Shield): Ölümcül hasarda 1 kez dev patlama ile dirilme
      if (this.player.hasPhoenix && !this.player.phoenixUsed) {
        this.player.phoenixUsed = true;
        const pLvl = (this.techUpgrades && this.techUpgrades.phoenix) ? this.techUpgrades.phoenix : 1;
        const revivePct = pLvl === 1 ? 0.35 : (pLvl === 2 ? 0.60 : 1.0);
        this.player.hp = Math.round(this.player.maxHp * revivePct);
        this.player.shield = this.player.maxShield;
        this.player.invulnerableTimer = 120; // 2 saniye diriliş dokunulmazlığı
        sounds.playNuke();
        sounds.playLevelUp();
        vibrate.heavy();
        this.screenShake = 16;
        this.whiteFlash = 1.0;
        this.particles.spawnShockwave(this.player.x, this.player.y, '#ffbe0b', 340);
        this.particles.spawnShockwave(this.player.x, this.player.y, '#ff0055', 250);
        this.particles.spawnFloatingText(this.player.x, this.player.y - 30, txt('phoenix_revive'), '#ffbe0b', 18);
        this.enemyProjectiles = [];
        for (let enemy of this.enemies) {
          if (enemy.hp <= 0 || enemy.toRemove) continue;
          const isBossTarget = enemy.isBoss || (enemy.type && enemy.type.startsWith('boss'));
          const applied = this.applyCappedEnemyDamage(enemy, isBossTarget ? 18 : 30);
          this.recordWeaponDamage('special', applied);
          if (enemy.hp <= 0) {
            this.handleEnemyDeath(enemy);
          }
        }
        this.updateHUD();
        return;
      }
      this.player.hp = 0;
      this.player.hitFlash = 6;
      this.player.invulnerableTimer = 40;
      this.hitStopTimer = 0;
      this.deathPop = 6;
      return;
    }
  }

  handleEnemyEscaped(enemy) {
    if (this._pendingVictory || this.state !== 'PLAYING' || this.isMerchantActive || this.modalTransition) return;
    if (merchantModal && !merchantModal.classList.contains('hidden')) return;
    if (this.player && (this.player.phaseTimer > 0 || this.player.invulnerableTimer > 0)) return;
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

    // Kristal Havuzunu Sınırla (Maksimum 60 kristal - Performans Koruması)
    if (this.gems.length > 60) {
      this.gems.splice(0, this.gems.length - 60);
    }

    for (let i = this.gems.length - 1; i >= 0; i--) {
      const gem = this.gems[i];
      if (gem.toRemove) {
        this.gems.splice(i, 1);
        continue;
      }

      gem.update(this.player.x, this.player.y, magnetDistance, dt);

      // Oyuncuya Ulaşma
      const dist = Math.hypot(gem.x - this.player.x, gem.y - this.player.y);
      if (dist < gem.radius + this.player.radius) {
        this.collectGem(gem, this.player.x, this.player.y);
        this.gems.splice(i, 1);

        // Seviye Atlama Kontrolü (Dengeli ve Akıcı Roguelite Seviye İlerlemesi)
        if (this.player.xp >= this.player.nextXp) {
          this.checkLevelUp();
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
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 1.5;
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
    ctx.beginPath();
    ctx.moveTo(-r * 0.22, -r * 0.1);
    ctx.lineTo(-r * 0.78, r * 0.48);
    ctx.moveTo(r * 0.22, -r * 0.1);
    ctx.lineTo(r * 0.78, r * 0.48);
    ctx.stroke();

    // Kokpit
    ctx.fillStyle = cockpitColor;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.85);
    ctx.lineTo(r * 0.24, -r * 0.25);
    ctx.lineTo(r * 0.2, r * 0.25);
    ctx.lineTo(0, r * 0.38);
    ctx.lineTo(-r * 0.2, r * 0.25);
    ctx.lineTo(-r * 0.24, -r * 0.25);
    ctx.closePath();
    ctx.fill();

    // Oyuncu Hasar Alma Efekti (Hit Flash & Zırh Titremesi): Hasar anında gemi beyaz/kırmızı parlar
    if (this.player.hitFlash > 0) {
      this.player.hitFlash -= 1;
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

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

    // Ekran Sarsıntısı (Screen Shake - Organik Dinamik Sarsıntı)
    if (this.screenShake > 0) {
      const shakeAmt = Math.min(10, this.screenShake * 0.65);
      const shakeX = (Math.random() - 0.5) * shakeAmt;
      const shakeY = (Math.random() - 0.5) * shakeAmt;
      ctx.translate(shakeX, shakeY);
    }

    // Yıldızlar, Nebulalar, Sektör Közleri & Efektler
    this.particles.render(ctx);

    // Ana Menü Ekranı: Canlı Siber Izgara ve Fırlatma Vitrini
    if (this.state === 'MENU') {
      this.drawMenuCyberGrid();
      if (this.launching) {
        this.drawMenuShipShowcase();
      }
      ctx.restore();
      return;
    }

    // Taktiksel Muharebe Hatlarını Çiz
    this.drawTacticalZones();

    // Kristalleri Çiz
    for (let gem of this.gems) {
      if (!gem.toRemove) gem.draw(ctx);
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

    // Tehlike Uyarılarını Çiz (Kullanıcı İsteği: Lazer ve Güdümlü Füze uyarıları tamamen farklı olsun)
    for (let tel of this.telegraphs) {
      ctx.save();
      const progress = 1 - (tel.timer / tel.maxTimer);
      const alpha = Math.min(1, progress * 0.85 + 0.15);

      if (tel.type === 'laser_beam') {
        // === 1. ENERJİ LAZERİ UYARISI: PARLAYAN DİKEY IŞIN KANALI ===
        const beamW = 34;
        // Zemin enerji yükleme parıltısı
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.18})`;
        ctx.fillRect(tel.x - beamW / 2, 0, beamW, this.height);

        // Çift neon lazer sınırı
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.9})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 6]);
        ctx.beginPath();
        ctx.moveTo(tel.x - beamW / 2, 0);
        ctx.lineTo(tel.x - beamW / 2, this.height);
        ctx.moveTo(tel.x + beamW / 2, 0);
        ctx.lineTo(tel.x + beamW / 2, this.height);
        ctx.stroke();

        // Merkez enerji çekirdeği (daralan akkor çizgi)
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(tel.x, 0);
        ctx.lineTo(tel.x, this.height);
        ctx.stroke();

        // Lazer İkaz Başlığı
        ctx.font = '900 11px "Rajdhani", "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.fillText('[UYARI] LAZER HATTI!', tel.x, 38);
      } else {
        // === 2. GÜDÜMLÜ FÜZE UYARISI: HEDEF KİLİDİ & İKAZ NİŞANGAHI ===
        // Kesikli kırmızı tehlike hattı
        ctx.strokeStyle = `rgba(255, 60, 0, ${alpha * 0.8})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(tel.x, 0);
        ctx.lineTo(tel.x, this.height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Oyuncunun bulunduğu derinlikte dönen Hedef Kilit Nişangahı (Crosshair Lock-on)
        const targetY = this.player ? Math.min(this.height - 70, Math.max(90, this.player.y)) : (this.height * 0.7);
        const ringR = 24 - progress * 8; // Kilitlendikçe büzüşen halka

        ctx.strokeStyle = `rgba(255, 30, 0, ${alpha})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(tel.x, targetY, Math.max(12, ringR), 0, Math.PI * 2);
        ctx.stroke();

        // 4 Köşe Kilit Çentikleri
        const rLen = Math.max(14, ringR + 5);
        ctx.beginPath();
        ctx.moveTo(tel.x - rLen, targetY); ctx.lineTo(tel.x - rLen + 6, targetY);
        ctx.moveTo(tel.x + rLen, targetY); ctx.lineTo(tel.x + rLen - 6, targetY);
        ctx.moveTo(tel.x, targetY - rLen); ctx.lineTo(tel.x, targetY - rLen + 6);
        ctx.moveTo(tel.x, targetY + rLen); ctx.lineTo(tel.x, targetY + rLen - 6);
        ctx.stroke();

        // Aşağı Oklar (Dalış Yönü)
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(255, 190, 11, ${alpha})`;
        ctx.fillText('▼', tel.x, targetY - rLen - 8);
        ctx.fillText('▼', tel.x, targetY - rLen - 20);

        // Füze İkaz Başlığı
        ctx.font = '900 11px "Rajdhani", "Segoe UI", sans-serif';
        ctx.fillStyle = `rgba(255, 60, 0, ${alpha})`;
        ctx.fillText('[ALARM] GÜDÜMLÜ FÜZE!', tel.x, 38);
      }

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

    // İkili Lazer Bağı Dronları (Tether Drone) Hatlarını Çiz
    this.drawTetherBeams();

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
    if (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'LEVEL_UP' || this.state === 'LUCKY_CHEST' || this.state === 'MERCHANT') {
      this.drawPlayerAfterimages();
      this.drawAimGuide();
      this.drawPlayerShip();
      this.drawCryoFrostVignette();
      this.drawWingmen();
      this.drawOrbitalSaws();
      this.drawCompanionDrone();
    }

    // Overdrive / Süper Güç Barı
    if (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'MERCHANT') {
      this.drawOverdriveBar();
    }

    // Gezegen Savunma Bariyeri Hattı (Alt Siber Grid Çizgisi)
    if (this.state === 'PLAYING' || this.state === 'PAUSED' || this.state === 'LEVEL_UP' || this.state === 'LUCKY_CHEST' || this.state === 'MERCHANT') {
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

    // === YÜKSEK KOMBO & FEVER EKRAN KENARI NEON AURA EFEKTİ (PART 3.2) ===
    if (this.state === 'PLAYING' && (this.comboCount >= 15 || this.player.isFever)) {
      ctx.save();
      const pulse = 0.55 + Math.sin((this.frames || 0) * 0.18) * 0.45;
      let edgeRGB = '0, 240, 255';
      let baseAlpha = 0.14;
      if (this.player.isFever || this.comboCount >= 50) {
        edgeRGB = '255, 215, 0';
        baseAlpha = 0.24;
      } else if (this.comboCount >= 30) {
        edgeRGB = '255, 0, 119';
        baseAlpha = 0.19;
      }
      const alpha = (baseAlpha * (0.65 + pulse * 0.35)).toFixed(3);
      const borderThickness = Math.round(10 + pulse * 8);
      ctx.fillStyle = `rgba(${edgeRGB}, ${alpha})`;
      ctx.fillRect(0, 0, this.width, borderThickness);
      ctx.fillRect(0, this.height - borderThickness, this.width, borderThickness);
      ctx.fillRect(0, borderThickness, borderThickness, this.height - borderThickness * 2);
      ctx.fillRect(this.width - borderThickness, borderThickness, borderThickness, this.height - borderThickness * 2);
      ctx.restore();
    }

    // === HANGAR 15 SANİYELİK GEMİ TEST UÇUŞU GERİ SAYIM BANNERI (PART 3.4) ===
    if (this.state === 'PLAYING' && this.isTestFlight) {
      ctx.save();
      const remSec = Math.max(0, Math.ceil((this.testFlightTimer || 0) / 60));
      const bw = Math.min(290, this.width - 32);
      const bh = 32;
      const bx = (this.width - bw) / 2;
      const by = 66;
      ctx.fillStyle = 'rgba(6, 10, 24, 0.88)';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#00f0ff';
      ctx.font = '900 12px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`DENEME UÇUŞU  ${remSec}sn`, this.width / 2, by + bh / 2);
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

  drawTetherBeams() {
    if (!this.enemies || this.enemies.length === 0) return;
    const drawnPairs = new Set();
    for (let enemy of this.enemies) {
      if (enemy.isTetherDrone && enemy.tetherPartner && !enemy.toRemove && !enemy.tetherPartner.toRemove && enemy.hp > 0 && enemy.tetherPartner.hp > 0) {
        const p = enemy.tetherPartner;
        if (enemy.y < -30 && p.y < -30) continue;
        const pairKey = Math.min(enemy.x, p.x) + '_' + Math.min(enemy.y, p.y);
        if (drawnPairs.has(pairKey)) continue;
        drawnPairs.add(pairKey);

        ctx.save();
        const pulse = 0.65 + Math.sin(Date.now() * 0.02) * 0.35;
        // Dış elektrik halesi
        ctx.strokeStyle = `rgba(0, 240, 255, ${pulse * 0.65})`;
        ctx.lineWidth = 5;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Titrek beyaz lazer çekirdeği
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Hat üstünde kayan yüksek gerilim arkı
        const sparkT = (Date.now() % 900) / 900;
        const sx = enemy.x + (p.x - enemy.x) * sparkT;
        const sy = enemy.y + (p.y - enemy.y) * sparkT;
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(sx - 3, sy - 3, 6, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx - 1.5, sy - 1.5, 3, 3);
        ctx.restore();
      }
    }
  }

  drawPlayerBullets() {
    ctx.save();

    for (let b of this.playerBullets) {
      const col = b.color || '#00f0ff';
      const w = b.w || 4;
      const h = b.h || 12;

      if (b.isHeavyBeam || b.isRailgun) {
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.35;
        ctx.fillRect(b.x - w * 0.7, b.y - h * 0.5, w * 1.4, h * 1.1);
        ctx.globalAlpha = 1;
        ctx.fillRect(b.x - w * 0.38, b.y - h * 0.48, w * 0.76, h * 1.05);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(b.x - w * 0.16, b.y - h * 0.45, w * 0.32, h);
      } else if (b.piercing || b.isPiercing || (b.pierce && b.pierce > 0)) {
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
            this.applyCappedEnemyDamage(enemy, 24);
            this.particles.spawnExplosion(enemy.x, enemy.y, '#ff5500', 6, 2.5);
            if (enemy.hp <= 0) {
              this.handleEnemyDeath(enemy);
            }
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

  // Parmak Görüşünü Kapatmayan Dinamik Nişan Kılavuzu & Reticle
  drawAimGuide() {
    if (this.state !== 'PLAYING') return;
    const skin = this.skins[this.currentSkinId] || this.skins.cyberpunk;
    ctx.save();
    ctx.strokeStyle = skin.primary || '#00f0ff';
    ctx.globalAlpha = 0.24;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(this.player.x, this.player.y - 28);
    ctx.lineTo(this.player.x, this.player.y - 95);
    ctx.stroke();
    ctx.setLineDash([]);

    // Mikro odak reticle noktası
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y - 95, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Kriyojenik / Buzul Taşı Dondurma Efekti (Kenar Buzul Aurası)
  drawCryoFrostVignette() {
    if (!this.player || !(this.player.cryoSlowTimer > 0)) return;
    ctx.save();
    const alpha = Math.min(0.38, (this.player.cryoSlowTimer / 75) * 0.38);
    const grad = ctx.createRadialGradient(
      this.width / 2, this.height / 2, this.width * 0.35,
      this.width / 2, this.height / 2, this.width * 0.75
    );
    grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    grad.addColorStop(1, `rgba(56, 189, 248, ${alpha})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }

  drawPlayerShip() {
    ctx.save();
    ctx.translate(this.player.x, this.player.y);
    ctx.rotate(this.player.tilt);
    if (this.deathPop > 0) {
      const swell = 1 + (1 - this.deathPop / 6) * 0.6;
      ctx.scale(swell, swell);
    }
    const isHitFlash = (this.player.hitFlash > 0);
    if (isHitFlash) {
      this.player.hitFlash -= 1;
    }
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
    let thrusterColor = baseFlame;
    if (this.player.combatZone === 'front') {
      thrusterColor = '#38bdf8';
    } else if (this.player.combatZone === 'rear') {
      thrusterColor = '#ff0055';
    }
    ctx.fillStyle = thrusterColor;
    ctx.fillRect(-8, r * 0.8, 3, 3);
    ctx.fillRect(5, r * 0.8, 3, 3);

    // Motor itki alevleri (Seri hatta daha uzun akkor plazma!)
    const isRearZone = this.player.combatZone === 'rear';
    const flamePulse = 0.8 + Math.sin((this.frames || 0) * 0.35) * 0.3;
    const baseFlameLen = isRearZone ? 16 : 9;
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
      blasterGlow = '#38bdf8';
    } else if (this.player.combatZone === 'rear') {
      blasterGlow = '#ff0055';
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

    // === AĞIR BALYOZ (FRONT ZONE): ELEKTRO-RAY HYPER RAILGUN NAMLUSU ===
    if (this.player.combatZone === 'front') {
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

    if (isHitFlash) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff3366';
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();

    // === ANLIK TAKTİKSEL MOD ETİKETİ (FLOATING COMBAT ZONE BADGE) ===
    if (this.player.zoneBannerTimer > 0) {
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
      ctx.restore();
      this.drawMiniJet(cd.x, cd.y, 0, 0.62);
      return;
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
    const count = (this.player.upgrades.wingman || 0) > 0 ? 1 : 0;

    if (count === 0) {
      this.player.wingmen = [];
      return;
    }

    if (this.player.wingmen.length === 0) {
      this.player.wingmen = [{
        side: 1,
        x: this.player.x,
        y: this.player.y,
        tilt: 0,
        shootTimer: 40,
        trail: [],
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 42 + Math.random() * 18,
        orbitSpeed: (Math.random() < 0.5 ? -1 : 1) * (0.012 + Math.random() * 0.016),
        orbitRetarget: 70
      }];
    } else if (this.player.wingmen.length > 1) {
      // 1 taneden fazlaysa sadece ilkini tut
      this.player.wingmen = [this.player.wingmen[0]];
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
    const bulletColor = this.player.isFever ? '#ffbe0b' : (skin.primary || '#00f0ff');

    const powerRatio = 0.04 + (wmLevel - 1) * 0.04;
    const shootInterval = 150 - (wmLevel - 1) * 28;
    const bulletWidth = 3;
    const bulletHeight = 8;
    const bulletVy = -11;
    const playerBaseDmg = (4.0 + (this.player.upgrades.laser - 1) * 1.6) * (this.player.damageMultiplier || 1.0);
    const petDmg = Math.max(1.2, Math.round(playerBaseDmg * (powerRatio / 0.04) * 0.35 * 10) / 10);

    for (let wm of this.player.wingmen) {
      if (wm.orbitAngle == null) {
        wm.orbitAngle = Math.random() * Math.PI * 2;
        wm.orbitRadius = 40 + Math.random() * 16;
        wm.orbitSpeed = (Math.random() < 0.5 ? -1 : 1) * 0.015;
        wm.orbitRetarget = 60;
      }
      wm.orbitRetarget = (wm.orbitRetarget || 0) - dt;
      if (wm.orbitRetarget <= 0) {
        wm.orbitRetarget = 80 + Math.random() * 160;
        wm.orbitSpeed = (Math.random() < 0.5 ? -1 : 1) * (0.008 + Math.random() * 0.02);
        wm.orbitRadiusTarget = 28 + Math.random() * 40;
      }
      const radiusGoal = wm.orbitRadiusTarget || wm.orbitRadius;
      wm.orbitRadius += (radiusGoal - wm.orbitRadius) * 0.03 * dt;
      wm.orbitAngle += wm.orbitSpeed * dt;
      const targetX = this.player.x + Math.cos(wm.orbitAngle) * wm.orbitRadius;
      const targetY = this.player.y + Math.sin(wm.orbitAngle) * wm.orbitRadius * 0.7;
      wm.x += (targetX - wm.x) * 0.14 * dt;
      wm.y += (targetY - wm.y) * 0.14 * dt;
      wm.tilt = Math.sin(wm.orbitAngle) * 0.4;

      // İtiş izi (Trail)
      if (!wm.trail) wm.trail = [];
      if ((this.frames || 0) % 2 === 0) {
        wm.trail.unshift({ x: wm.x, y: wm.y + 8, alpha: 0.6 });
        if (wm.trail.length > 5) wm.trail.pop();
      }

      // Atış Sayacı & Ateşleme
      wm.shootTimer = (wm.shootTimer || 0) + dt;
      if (wm.shootTimer >= shootInterval) {
        wm.shootTimer = 0;

        const color = bulletColor;
        this.playerBullets.push({
          x: wm.x,
          y: wm.y - 8,
          vx: (Math.random() - 0.5) * 0.2,
          vy: bulletVy,
          damage: petDmg,
          w: bulletWidth,
          h: bulletHeight,
          color: color,
          isWingmanBullet: true,
          piercing: wmLevel >= 3,
          isCrit: false,
          maxRange: 640,
          traveled: 0
        });
        this.particles.spawnExplosion(wm.x, wm.y - 8, color, 1, 0.4);
        sounds.playLaser();
      }
    }
  }

  drawWingmen() {
    if (!this.player) return;
    const wmLevel = this.player.upgrades.wingman || 0;
    if (wmLevel <= 0 || !this.player.wingmen || this.player.wingmen.length === 0) return;

    const skin = this.skins[this.currentSkinId] || this.skins.cyberpunk;
    const primaryColor = this.player.isFever ? '#ffbe0b' : (skin.primary || '#00f0ff');

    for (let wm of this.player.wingmen) {
      // 0. İtiş Partikül / Trail İzi Çizimi
      if (wm.trail && wm.trail.length > 0) {
        for (let i = 0; i < wm.trail.length; i++) {
          const t = wm.trail[i];
          t.alpha *= 0.85;
          ctx.save();
          ctx.fillStyle = primaryColor;
          ctx.globalAlpha = Math.max(0, t.alpha * 0.4);
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1.6 * (1 - i / wm.trail.length), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      this.drawMiniJet(wm.x, wm.y, wm.tilt || 0, 0.55);
    }
  }

  drawMiniJet(x, y, tilt, scale = 1) {
    const skin = this.skins[this.currentSkinId] || this.skins.cyberpunk;
    const primary = this.player.isFever ? '#ffbe0b' : (skin.primary || '#00f0ff');
    const secondary = this.player.isFever ? '#ffffff' : (skin.secondary || '#7dd3fc');
    const cockpit = this.player.isFever ? '#ffffff' : (skin.cockpit || '#fef08a');
    const r = 18;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt || 0);
    ctx.scale(scale, scale);

    const flame = 9 + Math.sin((this.frames || 0) * 0.5) * 3;
    ctx.fillStyle = skin.flame || primary;
    ctx.beginPath();
    ctx.moveTo(-6, r * 0.55);
    ctx.lineTo(-3.4, r * 0.55 + flame);
    ctx.lineTo(-1.2, r * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(1.2, r * 0.55);
    ctx.lineTo(3.4, r * 0.55 + flame);
    ctx.lineTo(6, r * 0.55);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.strokeStyle = primary;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, -r * 1.4);
    ctx.lineTo(r * 0.3, -r * 0.8);
    ctx.lineTo(r * 0.58, -r * 0.35);
    ctx.lineTo(r * 0.34, -r * 0.1);
    ctx.lineTo(r * 1.2, r * 0.5);
    ctx.lineTo(r * 1.05, r * 0.82);
    ctx.lineTo(r * 0.3, r * 0.55);
    ctx.lineTo(0, r * 0.36);
    ctx.lineTo(-r * 0.3, r * 0.55);
    ctx.lineTo(-r * 1.05, r * 0.82);
    ctx.lineTo(-r * 1.2, r * 0.5);
    ctx.lineTo(-r * 0.34, -r * 0.1);
    ctx.lineTo(-r * 0.58, -r * 0.35);
    ctx.lineTo(-r * 0.3, -r * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = secondary;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.22, -r * 0.1);
    ctx.lineTo(r * 0.72, r * 0.35);
    ctx.lineTo(0, r * 0.22);
    ctx.lineTo(-r * 0.72, r * 0.35);
    ctx.lineTo(-r * 0.22, -r * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = cockpit;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.82);
    ctx.lineTo(r * 0.16, -r * 0.18);
    ctx.lineTo(0, r * 0.08);
    ctx.lineTo(-r * 0.16, -r * 0.18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -r * 0.08, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Ana Döngü (120Hz/90Hz/60Hz ekranlarda pürüzsüz ve sabit hız garantisi)
  loop(timestamp = performance.now()) {
    if (!this.lastTime) this.lastTime = timestamp;
    let elapsed = timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (elapsed > 100) elapsed = 100;
    const rawDt = Math.max(0.2, Math.min(2.0, elapsed / 16.667));
    let dt = rawDt;

    // Hitstop mikro-etkisi (Döngüyü dondurmadan yumuşak geçiş)
    if (this.particles && this.particles.hitstopTimer > 0) {
      this.particles.hitstopTimer -= dt;
    }

    // Ağır Çekim (Slow-Motion) Etkisi
    if (this.slowMoTimer > 0) {
      dt *= 0.25;
      this.slowMoTimer--;
    }

    // Oyun Ortası Modal (Level-Up / Sandık / Uzay Kaçakçısı) Yumuşak Giriş Yavaşlaması (~0.47 sn)
    let completedTransitionType = null;
    if (this.modalTransition) {
      if (this.state !== 'PLAYING' || this._pendingVictory) {
        this.modalTransition = null;
      } else {
        this.modalTransition.timer += rawDt;
        const dur = this.modalTransition.duration || 28;
        const progress = Math.min(1, this.modalTransition.timer / dur);
        const slowScale = Math.max(0.08, Math.pow(1 - progress, 1.85));
        dt *= slowScale;
        if (this.player) {
          this.player.invulnerableTimer = Math.max(this.player.invulnerableTimer || 0, 60);
        }
        if (this.modalTransition.timer >= dur) {
          completedTransitionType = this.modalTransition.type;
          this.modalTransition = null;
        }
      }
    } else if (this.state === 'PLAYING' && this.resumeRampTimer > 0) {
      // Modal Kapanışı Sonrası Yumuşak Hızlanma (~0.55 sn 0.15x -> 1.0x)
      this.resumeRampTimer = Math.max(0, this.resumeRampTimer - rawDt);
      const dur = this.resumeRampDuration || 34;
      const progress = 1 - (this.resumeRampTimer / dur);
      const ease = 1 - Math.pow(1 - progress, 2.2);
      dt *= (0.15 + 0.85 * ease);
    }

    try {
      this.update(dt);
    } catch (err) {
      console.error("Kritik oyun döngüsü hatası engellendi:", err);
    }
    try {
      if (completedTransitionType && this.state === 'PLAYING' && !this._pendingVictory) {
        this.completeModalTransition(completedTransitionType);
      }
      this.draw();
    } catch (err) {
      console.error("Kritik çizim/geçiş hatası engellendi:", err);
    }
    requestAnimationFrame((t) => this.loop(t));
  }

  onLanguageChanged(newLang) {
    applyTranslationsToDOM();
    this.initLuckyWheel();
    this.updateWheelUI();
    if (this.renderLeaderboard) this.renderLeaderboard(this.lbMode || 'storm');
    if (this.renderLanguageGrid) this.renderLanguageGrid();
    if (this.updateSettingsToggles) this.updateSettingsToggles();
    this.updateMenuShipPreview();
    this.updatePilotRankDisplay();
    this.updateLevelDisplay();
    this.updateAudioButtons();
    const hangarModal = document.getElementById('hangar-modal');
    if (hangarModal && !hangarModal.classList.contains('hidden')) {
      if (this.renderHangarSkins) this.renderHangarSkins();
      if (this.renderHangarDrones) this.renderHangarDrones();
      if (this.renderHangarTrails) this.renderHangarTrails();
      if (this.renderHangarBoosters) this.renderHangarBoosters();
    }
    if (dailyRewardModal && !dailyRewardModal.classList.contains('hidden')) {
      this.openDailyRewardModal();
    }
    const pauseModalEl = document.getElementById('pause-modal');
    if (pauseModalEl && !pauseModalEl.classList.contains('hidden') && this.state === 'PAUSED') {
      const stageEl = document.getElementById('pause-stage-text');
      const waveEl = document.getElementById('pause-wave-text');
      if (stageEl) stageEl.textContent = this.currentMode === 'classic' ? t('pause_stage_campaign', { n: this.selectedLevel || 1 }) : t('pause_stage_storm');
      if (waveEl) waveEl.textContent = t('pause_wave_n', { n: this.wave || 1 });
      this.renderPauseCodex();
    }
    this.updateHighScoreDisplay();
    this.checkDailyReward();
    this.renderMissions();
    const pauseSoundText = document.getElementById('pause-sound-text');
    if (pauseSoundText) {
      pauseSoundText.textContent = sounds.muted ? t('pause_sound_off') : t('pause_sound_on');
    }
    const pauseVibrateText = document.getElementById('pause-vibrate-text');
    if (pauseVibrateText) {
      pauseVibrateText.textContent = vibrate.enabled ? t('pause_vibrate_on') : t('pause_vibrate_off');
    }
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
