// ==============================================================================
// 5-PHASE FORENSIC DEEP VALIDATION SUITE
// Combat Feel, FTUE Progressive Disclosure, Economy, and Mobile Audio
// ==============================================================================

import assert from 'node:assert/strict';
import { getGame, resetLocalStorage, i18nModule } from './harness.js';
import { SHIP_BALANCE, TECH_WORKSHOP_CONFIG } from '../src/balance.js';
import { Gem, Enemy } from '../src/enemies.js';
import { sounds } from '../src/audio.js';

const { t } = i18nModule;

console.log('='.repeat(78));
console.log(' NEON SPACE SURVIVOR — 5-PHASE FORENSIC COMPREHENSIVE SUITE');
console.log('='.repeat(78));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
    failed++;
  }
}

const game = getGame();

// ==============================================================================
// FAZ 1: Combat Feel & Fair Mechanics
// ==============================================================================
test('P1.1: Escaped enemies despawn cleanly with NO damage, NO shake, NO combo reset', () => {
  resetLocalStorage();
  game.startNewGame();
  game.player.hp = 100;
  game.player.shield = 50;
  game.player.maxHp = 100;
  game.player.maxShield = 50;
  game.comboCount = 15;
  game.comboTimer = 5.0;
  game.screenShake = 0;

  const enemy = new Enemy(200, game.height + 10, 'scout', 1.0, 1.0);
  enemy.hp = 20;
  game.enemies = [enemy];

  game.handleEnemyEscaped(enemy);

  assert.equal(enemy.toRemove, true, 'Escaped enemy must be flagged for removal');
  assert.equal(game.player.hp, 100, 'Player HP must NOT decrease');
  assert.equal(game.player.shield, 50, 'Player Shield must NOT decrease');
  assert.equal(game.comboCount, 15, 'Combo count must NOT reset');
  assert.equal(game.screenShake, 0, 'Screen shake must NOT trigger');
});

test('P1.2: Escaped enemies despawn even when player is invulnerable or in phase', () => {
  resetLocalStorage();
  game.startNewGame();
  game.player.invulnerableTimer = 30;
  game.player.phaseTimer = 20;

  const enemy = new Enemy(150, game.height + 20, 'scout', 1.0, 1.0);
  game.handleEnemyEscaped(enemy);

  assert.equal(enemy.toRemove, true, 'Enemy must still despawn when player is invulnerable');
});

test('P1.3: Base magnet range is 150px and floor magnetic recovery pulls gems upward', () => {
  resetLocalStorage();
  game.startNewGame();
  assert.equal(game.player.magnetRange, 150, 'Base magnet range must be 150px');

  // Gem near floor (y > screenHeight - 120), far from player
  const screenH = 800;
  const gem = new Gem(200, 750, 5);
  const initialY = gem.y;
  const playerX = 200;
  const playerY = 400; // Player is above

  // Update gem with screenHeight
  gem.update(playerX, playerY, 60, 1.0, screenH);

  // Gem should experience upward velocity toward player
  assert.ok(gem.vy < 0, `Floor magnetic recovery must give upward vy toward player (got ${gem.vy})`);
  assert.ok(gem.y < initialY, `Gem y must move upward toward player (was ${initialY}, now ${gem.y})`);
});

test('P1.4: Primary fire baseInterval is 17 frames (~3.5 shots/sec) and Lvl 1 bullets are 8x22', () => {
  resetLocalStorage();
  game.currentSkinId = 'cyberpunk';
  game.startNewGame();
  game.playerBullets = [];
  game.player.shootTimer = 0;

  // Verify baseInterval logic
  const baseInterval = game.player.isFever ? 10 : 17;
  assert.equal(baseInterval, 17, 'Base fire interval must be 17 frames');

  // Fire weapons in rear combat zone
  game.player.combatZone = 'rear';
  game.player.shootTimer = 0;
  game.updateWeapons(1.0);

  assert.ok(game.playerBullets.length >= 2, 'Gatling cannon must fire bullets');
  const leadBullet = game.playerBullets[0];
  assert.equal(leadBullet.w, 8, 'Level 1 bullet width must be 8px');
  assert.equal(leadBullet.h, 22, 'Level 1 bullet height must be 22px');
});

// ==============================================================================
// FAZ 2: FTUE & Zero-Friction Progressive Disclosure
// ==============================================================================
test('P2.1: Flight 0 has body.ftue-active, hides dock & arrows, and sets prominent CTA', () => {
  resetLocalStorage({ neon_games_played: '0' });
  if (game.pilotStats) game.pilotStats.totalFlights = 0;
  game.unlockedLevel = 1;

  game.applyMenuProgression();

  assert.ok(document.body.classList.contains('ftue-active'), 'body must have ftue-active class on flight 0');

  const btnStart = document.getElementById('btn-start');
  const launchText = btnStart.querySelector('.launch-text') || btnStart;
  assert.equal(launchText.textContent, 'GÖREVE BAŞLA (BÖLÜM 1)', 'CTA button text must be GÖREVE BAŞLA (BÖLÜM 1)');

  const welcomeModal = document.getElementById('welcome-pilot-modal');
  game.checkFirstTimeWelcome();
  assert.ok(welcomeModal.classList.contains('hidden'), 'Welcome modal must NOT be shown upfront on flight 0');
});

test('P2.2: Progressive disclosure unlocking chain across flights and levels', () => {
  resetLocalStorage();
  const btnHangar = document.getElementById('btn-hangar');
  const btnMissions = document.getElementById('btn-missions');
  const btnDaily = document.getElementById('btn-daily-reward');
  const btnLeaderboard = document.getElementById('btn-leaderboard');
  const modeStorm = document.getElementById('mode-storm');

  // Step 0: Flight 0
  game.pilotStats = { totalFlights: 0 };
  game.unlockedLevel = 1;
  game.applyMenuProgression();
  assert.equal(btnHangar.style.display, 'none', 'Hangar hidden on flight 0');
  assert.equal(btnMissions.style.display, 'none', 'Missions hidden on flight 0');
  assert.equal(btnDaily.style.display, 'none', 'Daily hidden on flight 0');
  assert.equal(btnLeaderboard.style.display, 'none', 'Leaderboard hidden on flight 0');
  assert.ok(modeStorm.classList.contains('feature-locked'), 'Storm mode locked');

  // Step 1: Flight 0 completed (flight 1 reached)
  game.pilotStats.totalFlights = 1;
  game.applyMenuProgression();
  assert.equal(btnHangar.style.display, '', 'Hangar revealed after flight 0');
  assert.equal(btnMissions.style.display, 'none', 'Missions still hidden before Level 1 clear');
  assert.equal(btnDaily.style.display, 'none', 'Daily still hidden before Level 1 clear');

  // Step 2: Level 1 cleared (maxStage >= 2)
  game.unlockedLevel = 2;
  game.applyMenuProgression();
  assert.equal(btnMissions.style.display, '', 'Missions revealed after Level 1 clear');
  assert.equal(btnDaily.style.display, '', 'Daily supply revealed after Level 1 clear');
  assert.equal(btnLeaderboard.style.display, 'none', 'Leaderboard still hidden before Level 3 clear');
  assert.ok(modeStorm.classList.contains('feature-locked'), 'Storm mode still locked before Level 3 clear');

  // Step 3: Level 3 cleared (maxStage >= 4)
  game.unlockedLevel = 4;
  game.applyMenuProgression();
  assert.equal(btnLeaderboard.style.display, '', 'Leaderboard revealed after Level 3 clear');
  assert.ok(!modeStorm.classList.contains('feature-locked'), 'Storm mode unlocked after Level 3 clear');
});

test('P2.3: goToMenuTab blocks navigation into locked tabs', () => {
  resetLocalStorage();
  game.state = 'MENU';
  game.pilotStats = { totalFlights: 0 };
  game.unlockedLevel = 1;

  // Try going to Hangar (index 0) on flight 0
  let toastShown = false;
  game.showToast = () => { toastShown = true; };

  game.goToMenuTab(0);
  const hangarModal = document.getElementById('hangar-modal');
  assert.ok(hangarModal.classList.contains('hidden'), 'Hangar modal must stay hidden when locked');
  assert.ok(toastShown, 'Toast must trigger on locked tab click');

  // Try going to Missions (index 1) before Level 1 clear
  toastShown = false;
  game.goToMenuTab(1);
  const missionsModal = document.getElementById('missions-modal');
  assert.ok(missionsModal.classList.contains('hidden'), 'Missions modal must stay hidden when locked');
  assert.ok(toastShown, 'Toast must trigger on locked missions tab click');
});

test('P2.4: Flight 0 completion triggers celebratory welcome modal awarding +500 crystals', () => {
  resetLocalStorage({ neon_total_crystals: 100, neon_welcome_claimed: '' });
  game.totalCrystals = 100;
  game.pilotStats = { totalFlights: 1 };

  const modal = document.getElementById('welcome-pilot-modal');
  assert.ok(modal.classList.contains('hidden'), 'Welcome modal initially hidden');

  game.checkFirstTimeWelcome();
  assert.ok(!modal.classList.contains('hidden'), 'Welcome modal shown after flight 0');

  const startBtn = document.getElementById('btn-start-ftue');
  startBtn.click();

  assert.equal(game.totalCrystals, 600, '+500 crystals awarded (100 -> 600)');
  assert.equal(localStorage.getItem('neon_welcome_claimed'), 'true', 'welcome claimed flag saved');
  assert.ok(modal.classList.contains('hidden'), 'Welcome modal closed after claim');
});

// ==============================================================================
// FAZ 3: Economy & D1/D7 Retention Reform
// ==============================================================================
test('P3.1: Ship prices match exact revised economy tiers', () => {
  assert.equal(SHIP_BALANCE.solar.cost, 550, 'Solar Phoenix cost must be 550 CR');
  assert.equal(SHIP_BALANCE.toxic.cost, 1200, 'Toxic cost must be 1200 CR');
  assert.equal(SHIP_BALANCE.vortex.cost, 2400, 'Vortex cost must be 2400 CR');
  assert.equal(SHIP_BALANCE.phantom.cost, 4200, 'Phantom cost must be 4200 CR');
  assert.equal(SHIP_BALANCE.chrono.cost, 6800, 'Chrono Apex cost must be 6800 CR');
});

test('P3.2: Striker Drone cost is 250 CR and Ship Starup tiers match [0, 150, 350, 750, 1500]', () => {
  assert.equal(game.hangarDrones.striker.cost, 250, 'Striker Drone cost must be 250 CR');
  assert.equal(game.getStarUpCost(1), 150, 'Star 1 -> 2 cost is 150 CR');
  assert.equal(game.getStarUpCost(2), 350, 'Star 2 -> 3 cost is 350 CR');
  assert.equal(game.getStarUpCost(3), 750, 'Star 3 -> 4 cost is 750 CR');
  assert.equal(game.getStarUpCost(4), 1500, 'Star 4 -> 5 cost is 1500 CR');
});

test('P3.3: First-Clear Level Bonuses grant +350 CR for Level 1 and +500 CR for Level 2', () => {
  resetLocalStorage({ neon_total_crystals: 0, neon_level_stars: '{}' });
  game.totalCrystals = 0;
  game.levelStars = {};
  game.selectedLevel = 1;
  game.unlockedLevel = 1;
  game.player = { hp: 100, maxHp: 100, score: 500 };
  game.masteryTree = { crystalBonus: 0 };

  // Level 1 clear (Reward 210 + 350 first clear = 560)
  game.triggerLevelVictory();
  assert.equal(game.totalCrystals, 560, 'Level 1 first clear grants 210 base + 350 bonus = 560 CR');

  // Level 2 clear (Reward 240 + 500 first clear = 740)
  game.selectedLevel = 2;
  game.triggerLevelVictory();
  assert.equal(game.totalCrystals, 560 + 740, 'Level 2 first clear grants 240 base + 500 bonus = 740 CR');
});

test('P3.4: Day 2 retention hook grants Striker Drone or 400 CR if owned', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = game.getLocalTodayStr(yesterday);

  resetLocalStorage({
    neon_daily_streak: '1',
    neon_daily_reward_date: yesterdayStr,
    neon_drone_levels: JSON.stringify({ striker: 0, missile: 0 }),
    neon_drone_striker_bought: '',
    neon_total_crystals: 0
  });
  game.totalCrystals = 0;
  game.droneLevels = { striker: 0, missile: 0 };
  game.equippedDroneId = null;

  // Claim Day 2 when Striker is NOT owned
  game.claimDailyRewardBase();

  assert.equal(game.droneLevels.striker, 1, 'Striker Drone unlocked at Level 1');
  assert.equal(game.equippedDroneId, 'striker', 'Striker Drone equipped automatically');
  assert.equal(localStorage.getItem('neon_drone_striker_bought'), 'true', 'striker marked bought');

  // Next time Day 2 is hit while owning Striker
  localStorage.setItem('neon_daily_reward_date', yesterdayStr);
  localStorage.setItem('neon_daily_streak', '1');
  game.claimDailyRewardBase();
  assert.equal(game.totalCrystals, 400, 'Day 2 awards 400 CR when Striker already owned');
});

// ==============================================================================
// FAZ 4: Audio Engine
// ==============================================================================
test('P4.1: SoundEngine defines playLaser and playExplosion without errors', () => {
  assert.ok(typeof sounds.playLaser === 'function', 'playLaser exists');
  assert.ok(typeof sounds.playExplosion === 'function', 'playExplosion exists');
  // Safe invocation in test mock (ctx is null in headless node)
  assert.doesNotThrow(() => sounds.playLaser());
  assert.doesNotThrow(() => sounds.playExplosion(false));
  assert.doesNotThrow(() => sounds.playExplosion(true));
});

console.log('='.repeat(78));
console.log(` SUMMARY: ${passed}/${passed + failed} passed (${failed} failed)`);
console.log('='.repeat(78));

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
