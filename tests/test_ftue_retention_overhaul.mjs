// ==============================================================================
// Neon Space Survivor — FTUE & Retention Overhaul Verification Suite
// ==============================================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getGame, resetLocalStorage, i18nModule, catalogModule } from './harness.js';
import { TECH_WORKSHOP_CONFIG } from '../src/balance.js';

const { t, SUPPORTED_LANGUAGES } = i18nModule;
const { CATALOG } = catalogModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('='.repeat(78));
console.log(' NEON SPACE SURVIVOR — FTUE & RETENTION OVERHAUL DEEP VERIFICATION SUITE');
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

// -----------------------------------------------------------------------------
// 1. Hybrid "Güçlen & Anında Fırla!" Primary CTA
// -----------------------------------------------------------------------------
test('F1.1: updateGameOverRestartBtn transforms #btn-restart into hybrid launch when crystals suffice', () => {
  resetLocalStorage({
    neon_total_crystals: 500,
    neon_tech_upgrades: { hullMax: 0, shieldMax: 0, damageBoost: 0, magnet: 0 }
  });
  game.totalCrystals = 500;
  game.techUpgrades = { hullMax: 0, shieldMax: 0, damageBoost: 0, magnet: 0 };

  const btnRestart = document.getElementById('btn-restart');
  game.updateGameOverRestartBtn();

  assert.ok(game.pendingHybridUpgrade, 'pendingHybridUpgrade must be set');
  assert.ok(btnRestart.classList.contains('btn-hybrid-launch'), 'btn-restart must have btn-hybrid-launch class');
  assert.ok(btnRestart.innerHTML.includes('hybrid-tag'), 'btn-restart must contain hybrid-tag');
  assert.ok(btnRestart.innerHTML.includes('hybrid-title'), 'btn-restart must contain hybrid-title');
  assert.ok(btnRestart.innerHTML.includes('CR'), 'btn-restart must show crystal cost');
});

test('F1.2: Clicking hybrid #btn-restart deducts crystals, levels stat, hides modal immediately and queues launch bonus', () => {
  resetLocalStorage({
    neon_total_crystals: 500,
    neon_tech_upgrades: { hullMax: 0 }
  });
  game.totalCrystals = 500;
  game.techUpgrades = { hullMax: 0 };
  game.updateGameOverRestartBtn();

  const up = game.pendingHybridUpgrade;
  assert.ok(up, 'An upgrade must be pending');
  const initialCost = up.cost;
  const initialStat = up.stat;

  const gameoverModal = document.getElementById('gameover-modal');
  gameoverModal.classList.remove('hidden');

  const origLaunch = game.triggerLaunch;
  let launchCalled = false;
  game.triggerLaunch = () => { launchCalled = true; };

  const btnRestart = document.getElementById('btn-restart');
  // Dispatch click
  btnRestart.click();

  game.triggerLaunch = origLaunch;

  assert.equal(game.totalCrystals, 500 - initialCost, 'Crystals must be deducted');
  assert.equal(game.techUpgrades[initialStat], 1, 'Stat must be incremented to level 1');
  assert.ok(gameoverModal.classList.contains('hidden'), 'Game Over modal must be hidden immediately');
  assert.ok(gameoverModal.classList.contains('modal-exit-fast'), 'Game Over modal must have modal-exit-fast');
  assert.ok(game.pendingLaunchBonusToast, 'pendingLaunchBonusToast must be queued for flight spawn');
  assert.ok(launchCalled, 'triggerLaunch must be called');
});

test('F1.3: updateGameOverRestartBtn transforms #btn-restart into instant rematch when crystals insufficient', () => {
  resetLocalStorage({
    neon_total_crystals: 0,
    neon_tech_upgrades: { hullMax: 0, shieldMax: 0, damageBoost: 0, magnet: 0 }
  });
  game.totalCrystals = 0;
  game.techUpgrades = { hullMax: 0, shieldMax: 0, damageBoost: 0, magnet: 0 };

  const btnRestart = document.getElementById('btn-restart');
  game.updateGameOverRestartBtn();

  assert.equal(game.pendingHybridUpgrade, null, 'pendingHybridUpgrade must be null when crystals are 0');
  assert.ok(btnRestart.classList.contains('btn-instant-launch'), 'btn-restart must have btn-instant-launch class');
  assert.ok(btnRestart.innerHTML.includes(t('instant_rematch_title')), 'btn-restart must show instant rematch text');
});

// -----------------------------------------------------------------------------
// 2. Fix 400ms Modal Freeze on Restart / Launch
// -----------------------------------------------------------------------------
test('F2.1: triggerLaunch immediately adds modal-exit-fast and hidden to gameoverModal', () => {
  const gameoverModal = document.getElementById('gameover-modal');
  gameoverModal.classList.remove('hidden');
  gameoverModal.classList.remove('modal-exit-fast');

  game.launching = false;
  game.triggerLaunch();

  assert.ok(gameoverModal.classList.contains('hidden'), 'gameoverModal must be hidden immediately in triggerLaunch');
  assert.ok(gameoverModal.classList.contains('modal-exit-fast'), 'gameoverModal must have modal-exit-fast class');
});

// -----------------------------------------------------------------------------
// 3. Near-Miss Loss Aversion Hook
// -----------------------------------------------------------------------------
test('F3.1: buildGameOverHook shows remaining boss HP when player dies fighting boss', () => {
  resetLocalStorage();
  game.currentMode = 'classic';
  game.selectedLevel = 1;
  game.currentBoss = { name: 'ÖNCÜ KOMUTAN', hp: 35, maxHp: 100 };
  game.gameTime = 55;

  const hook = document.getElementById('go-hook');
  game.buildGameOverHook(5000, false);

  assert.ok(hook.classList.contains('near-miss-banner'), 'hook must have near-miss-banner class');
  assert.ok(hook.innerHTML.includes('35%') || hook.innerHTML.includes('%35'), 'hook must show remaining boss hp percent');
  assert.ok(hook.innerHTML.includes('go-near-miss-track'), 'hook must contain progress bar track');
  assert.ok(hook.innerHTML.includes('go-near-miss-fill'), 'hook must contain progress bar fill');
});

test('F3.2: buildGameOverHook shows seconds left to boss when player dies at time > 40s', () => {
  resetLocalStorage();
  game.currentMode = 'classic';
  game.selectedLevel = 1;
  game.currentBoss = null;
  game.gameTime = 48; // 12 seconds remaining until 60s boss

  const hook = document.getElementById('go-hook');
  game.buildGameOverHook(5000, false);

  assert.ok(hook.classList.contains('near-miss-banner'), 'hook must have near-miss-banner class');
  assert.ok(hook.innerHTML.includes('12'), 'hook must show 12 seconds remaining');
  assert.ok(hook.innerHTML.includes('go-near-miss-track'), 'hook must contain progress bar track');
});

test('F3.3: buildGameOverHook shows seconds left to wave 2 when player dies early (<40s)', () => {
  resetLocalStorage();
  game.currentMode = 'classic';
  game.selectedLevel = 1;
  game.currentBoss = null;
  game.gameTime = 18; // 12 seconds remaining until 30s wave 2

  const hook = document.getElementById('go-hook');
  game.buildGameOverHook(5000, false);

  assert.ok(hook.classList.contains('near-miss-banner'), 'hook must have near-miss-banner class');
  assert.ok(hook.innerHTML.includes('12'), 'hook must show 12 seconds remaining to wave 2');
  assert.ok(hook.innerHTML.includes('go-near-miss-track'), 'hook must contain progress bar track');
});

// -----------------------------------------------------------------------------
// 4. Flight 1 Free Tutorial Safety Net (Ad-Free Revive)
// -----------------------------------------------------------------------------
test('F4.1: gameOver displays ad-free emergency revive button on totalFlights <= 1', () => {
  resetLocalStorage({ neon_pilot_stats: { totalFlights: 1 } });
  game.pilotStats = { totalFlights: 1 };
  game.revivesUsed = 0;
  game.state = 'PLAYING';
  game.player = { hp: 0, maxHp: 100, maxShield: 50, score: 100, level: 1 };

  game.gameOver();

  const btnAdRevive = document.getElementById('btn-ad-revive');
  assert.ok(btnAdRevive.classList.contains('go-revive-free-net'), 'Revive button must have go-revive-free-net class');
  assert.ok(btnAdRevive.innerHTML.includes(t('btn_revive_tutorial_action')), 'Revive button must display free emergency action text');
  assert.ok(btnAdRevive.innerHTML.includes(t('btn_revive_tutorial_tag')), 'Revive button must display 1 use tag');
});

test('F4.2: Tapping ad-free emergency revive immediately revives player with EMP without ads', () => {
  resetLocalStorage({ neon_pilot_stats: { totalFlights: 1 } });
  game.pilotStats = { totalFlights: 1 };
  game.revivesUsed = 0;
  game.player = { hp: 0, maxHp: 100, maxShield: 50, shield: 0, score: 100, level: 1, x: 200, y: 400 };

  let adShown = false;
  globalThis.window.showRewardedAd = () => { adShown = true; };

  const btnAdRevive = document.getElementById('btn-ad-revive');
  btnAdRevive.click();

  assert.equal(adShown, false, 'No rewarded ad should be requested on flight 1 tutorial revive');
  assert.equal(game.revivesUsed, 1, 'revivesUsed must be incremented to 1');
  assert.ok(game.player.hp > 0, 'Player HP must be restored');
  assert.equal(game.player.shield, game.player.maxShield, 'Player shield must be fully restored');
  assert.ok(game.player.invulnerableTimer > 0, 'Player must have invulnerability frames');
});

// -----------------------------------------------------------------------------
// 5. Progressive Disclosure Menu Shield (totalFlights < 3)
// -----------------------------------------------------------------------------
test('F5.1: updateStartScreenFTUE sets ftue-first-flight class for flights < 3, removes for >= 3', () => {
  game.pilotStats = { totalFlights: 0 };
  game.updateStartScreenFTUE();
  const screen = document.getElementById('start-screen');
  assert.ok(screen.classList.contains('ftue-first-flight'), 'flights=0 must activate ftue-first-flight');

  game.pilotStats = { totalFlights: 2 };
  game.updateStartScreenFTUE();
  assert.ok(screen.classList.contains('ftue-first-flight'), 'flights=2 must activate ftue-first-flight');

  game.pilotStats = { totalFlights: 3 };
  game.updateStartScreenFTUE();
  assert.ok(!screen.classList.contains('ftue-first-flight'), 'flights=3 must deactivate ftue-first-flight');
});

test('F5.2: CSS hides advanced menu distractions under .ftue-first-flight and highlights main play', () => {
  const css = fs.readFileSync(path.join(rootDir, 'src/style.css'), 'utf8');
  assert.ok(css.includes('#start-screen.ftue-first-flight #btn-ship-starup'), 'CSS must hide starup in FTUE');
  assert.ok(css.includes('#start-screen.ftue-first-flight #mode-storm'), 'CSS must hide storm mode in FTUE');
  assert.ok(css.includes('#start-screen.ftue-first-flight #mode-mutator'), 'CSS must hide mutator mode in FTUE');
  assert.ok(css.includes('#start-screen.ftue-first-flight #btn-start') || css.includes('.btn-main-play'), 'CSS must highlight play button');
});

// -----------------------------------------------------------------------------
// 6. Direct Launch Button in Hangar
// -----------------------------------------------------------------------------
test('F6.1: #btn-hangar-launch exists in index.html hangar footer and triggers immediate launch', () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert.ok(html.includes('id="btn-hangar-launch"'), 'index.html must contain #btn-hangar-launch');

  const hangarModal = document.getElementById('hangar-modal');
  hangarModal.classList.remove('hidden');

  const origLaunch = game.triggerLaunch;
  let launchTriggered = false;
  game.triggerLaunch = () => { launchTriggered = true; };

  const btnHangarLaunch = document.getElementById('btn-hangar-launch');
  assert.ok(btnHangarLaunch, 'btn-hangar-launch element must exist');
  btnHangarLaunch.click();

  game.triggerLaunch = origLaunch;

  assert.ok(hangarModal.classList.contains('hidden'), 'hangarModal must be hidden on launch click');
  assert.ok(launchTriggered, 'triggerLaunch must be called by hangar launch button');
});

// -----------------------------------------------------------------------------
// 7. 9-Language Localization Integrity
// -----------------------------------------------------------------------------
test('F7.1: All overhaul keys defined across all 9 languages in CATALOG with 0 Turkish characters in non-TR', () => {
  const newKeys = [
    'hangar_instant_launch',
    'hybrid_launch_title',
    'instant_rematch_title',
    'btn_revive_tutorial_action',
    'btn_revive_tutorial_tag',
    'toast_tutorial_revive',
    'go_near_miss_boss_hp',
    'go_near_miss_boss_time',
    'go_near_miss_wave',
    'go_near_miss_progress',
    'hybrid_toast_hull',
    'hybrid_toast_shield',
    'hybrid_toast_damage',
    'hybrid_toast_magnet'
  ];

  const strictlyTurkishOnly = /[ıİğĞşŞ]/;
  const nonTrLangs = ['en-GB', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];

  for (const key of newKeys) {
    for (const lang of SUPPORTED_LANGUAGES) {
      const val = CATALOG[lang.code] ? CATALOG[lang.code][key] : null;
      assert.ok(val, `Key ${key} must exist for language ${lang.code}`);
      if (nonTrLangs.includes(lang.code)) {
        assert.ok(!strictlyTurkishOnly.test(val), `Key ${key} in ${lang.code} contains Turkish characters: ${val}`);
      }
    }
  }
});

// -----------------------------------------------------------------------------
// 8. Adversarial Edge Cases & Skeptical Review Validations
// -----------------------------------------------------------------------------
test('F8.1: Multi-language parity on hybrid launch and instant rematch titles (no hardcoded text)', () => {
  // Test in English
  i18nModule.setLanguage('en-GB');
  game.totalCrystals = 500;
  game.techUpgrades = { hullMax: 0 };
  game.updateGameOverRestartBtn();
  const btnRestart = document.getElementById('btn-restart');
  assert.ok(btnRestart.innerHTML.includes(t('hybrid_launch_title')), 'Hybrid title must match en-GB translation');
  assert.ok(!btnRestart.innerHTML.includes('TEKRAR OYNA & GÜÇLEN'), 'Must not have hardcoded Turkish string in English');

  // Test instant rematch in English
  game.totalCrystals = 0;
  game.updateGameOverRestartBtn();
  assert.ok(btnRestart.innerHTML.includes(t('instant_rematch_title')), 'Instant rematch must match en-GB translation');
  assert.ok(!btnRestart.innerHTML.includes('TEKRAR OYNA'), 'Must not have hardcoded Turkish string in English');

  // Switch back to TR
  i18nModule.setLanguage('tr-TR');
});

test('F8.2: Boss near-miss hook resolves boss name dynamically and avoids raw translation key string', () => {
  resetLocalStorage();
  game.currentMode = 'classic';
  game.selectedLevel = 1;
  // Boss instance with type only, no explicit .name property
  game.currentBoss = { type: 'boss_vanguard', hp: 40, maxHp: 100 };
  game.gameTime = 55;

  const hook = document.getElementById('go-hook');
  game.buildGameOverHook(5000, false);

  assert.ok(!hook.innerHTML.includes('boss_commander_name'), 'Hook must never display raw key boss_commander_name');
  assert.ok(hook.innerHTML.includes('%40') || hook.innerHTML.includes('40%'), 'Hook must show 40% hp remaining');
  assert.ok(hook.innerHTML.includes('KOMUTAN') || hook.innerHTML.includes('VANGUARD'), 'Hook must resolve boss name');
});

test('F8.3: Near-miss at 35s in campaign shows seconds remaining to boss rather than wave 2 overshoot', () => {
  resetLocalStorage();
  game.currentMode = 'classic';
  game.selectedLevel = 1;
  game.currentBoss = null;
  game.gameTime = 35; // 25 seconds left until 60s boss

  const hook = document.getElementById('go-hook');
  game.buildGameOverHook(5000, false);

  assert.ok(hook.classList.contains('near-miss-banner'), 'hook must have near-miss-banner');
  assert.ok(hook.innerHTML.includes('25'), 'hook must show 25 seconds remaining until boss at 35s');
});

test('F8.4: Rapid double-tap on hybrid #btn-restart deduplicates and deducts crystals only once', () => {
  resetLocalStorage({
    neon_total_crystals: 200,
    neon_tech_upgrades: { hullMax: 0, shieldMax: 0, damageBoost: 0, magnet: 0 }
  });
  game.totalCrystals = 200;
  game.techUpgrades = { hullMax: 0, shieldMax: 0, damageBoost: 0, magnet: 0 };
  game.updateGameOverRestartBtn();

  const up = game.pendingHybridUpgrade;
  assert.ok(up, 'Pending upgrade should be set');
  const cost = up.cost;
  const stat = up.stat;

  const btnRestart = document.getElementById('btn-restart');
  // First click
  btnRestart.click();
  // Second rapid click in same frame
  btnRestart.click();

  assert.equal(game.totalCrystals, 200 - cost, 'Crystals must only be deducted once despite double-click');
  assert.equal(game.techUpgrades[stat], 1, 'Stat must only be incremented once');
});

test('F8.5: Rapid double-tap on #btn-ad-revive triggers only 1 revive and increments revivesUsed exactly once', () => {
  resetLocalStorage({ neon_pilot_stats: { totalFlights: 1 } });
  game.pilotStats = { totalFlights: 1 };
  game.revivesUsed = 0;
  game.player = { hp: 0, maxHp: 100, maxShield: 50, shield: 0, score: 100, level: 1, x: 200, y: 400 };

  const btnAdRevive = document.getElementById('btn-ad-revive');
  // Double-tap
  btnAdRevive.click();
  btnAdRevive.click();

  assert.equal(game.revivesUsed, 1, 'revivesUsed must be exactly 1 despite double click');
});

test('F8.6: Upgrading via lower revenge card immediately updates primary #btn-restart CTA', () => {
  resetLocalStorage({
    neon_total_crystals: 80,
    neon_tech_upgrades: { hullMax: 0, shieldMax: 0, damageBoost: 0, magnet: 0 }
  });
  game.totalCrystals = 80;
  game.techUpgrades = { hullMax: 0, shieldMax: 0, damageBoost: 0, magnet: 0 };

  game.gameOver();

  const btnRestart = document.getElementById('btn-restart');
  assert.ok(btnRestart.classList.contains('btn-hybrid-launch'), 'Primary CTA should initially be hybrid launch');

  // Click the lower revenge action button to spend crystals on the cheapest upgrade (magnet: 65 CR)
  const actionBtn = document.getElementById('go-revenge-action-btn');
  if (actionBtn && typeof actionBtn.onclick === 'function') {
    actionBtn.onclick();
  }

  // Now remaining crystals are 80 - 65 = 15 CR, which cannot afford any other upgrade (costs are >= 75 CR)
  assert.equal(game.totalCrystals, 15, 'Crystals should be reduced to 15');
  assert.equal(game.pendingHybridUpgrade, null, 'pendingHybridUpgrade should now be null');
  assert.ok(btnRestart.classList.contains('btn-instant-launch'), 'Primary CTA should immediately switch to instant rematch');
});

console.log('='.repeat(78));
console.log(` SUMMARY: ${passed}/${passed + failed} passed (${failed} failed)`);
console.log('='.repeat(78));

if (failed > 0) process.exit(1);
process.exit(0);
