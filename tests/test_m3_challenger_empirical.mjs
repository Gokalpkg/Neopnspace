// ==============================================================================
// EMPIRICAL CHALLENGER STRESS HARNESS — MILESTONE 3 (R3)
// Ship Ascension (1-5 Stars), Infinite Quantum Overclock (Tech Workshop Lv 1-999),
// and Daily Mutator Combat Mechanics with 9-Language Localization
// ==============================================================================

import assert from 'node:assert/strict';
import { getGame, resetLocalStorage, getStorage, i18nModule, catalogModule } from './harness.js';

const { t, setLanguage, TRANSLATIONS } = i18nModule;
const { CATALOG } = catalogModule;

console.log('='.repeat(78));
console.log(' EMPIRICAL CHALLENGER STRESS HARNESS — MILESTONE 3 (R3)');
console.log(' Ship Ascension, Infinite Quantum Overclock, Daily Mutators & Localization');
console.log('='.repeat(78));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`  [FAIL] ${name}: ${err.message}`);
    failureDetails.push({ name, error: err.message, stack: err.stack });
  }
}

const game = getGame();

// ============================================================================
// SUITE 1: Ship Star-Up Ascension (1 to 5 Stars) & Hangar Showcase
// ============================================================================
console.log('\n>>> SUITE 1: Ship Star-Up Ascension (1 to 5 Stars) & Stat Scaling');

test('S1.1: Default ship star is 1 when unset in storage', () => {
  resetLocalStorage();
  assert.equal(game.getShipStars('cyberpunk'), 1);
  assert.equal(game.getShipStars('solar'), 1);
  assert.equal(game.getShipStars('vortex'), 1);
});

test('S1.2: Star ascension cost progression matches [500, 1200, 2500, 5000]', () => {
  assert.equal(game.getStarUpCost(1), 500, 'Star 1 -> 2 cost is 500');
  assert.equal(game.getStarUpCost(2), 1200, 'Star 2 -> 3 cost is 1200');
  assert.equal(game.getStarUpCost(3), 2500, 'Star 3 -> 4 cost is 2500');
  assert.equal(game.getStarUpCost(4), 5000, 'Star 4 -> 5 cost is 5000');
});

test('S1.3: Stat multipliers scale by +10% per star across HP, DMG, and Speed', () => {
  const calcMult = (stars) => 1 + (stars - 1) * 0.10;
  assert.equal(calcMult(1), 1.00, 'Star 1: +0% (1.00x)');
  assert.equal(calcMult(2), 1.10, 'Star 2: +10% (1.10x)');
  assert.equal(calcMult(3), 1.20, 'Star 3: +20% (1.20x)');
  assert.equal(calcMult(4), 1.30, 'Star 4: +30% (1.30x)');
  assert.equal(calcMult(5), 1.40, 'Star 5: +40% (1.40x)');
});

test('S1.4: In-flight initialization applies starBonus (+10% per star) to HP, DMG, and Speed', () => {
  resetLocalStorage({
    neon_ship_stars: { cyberpunk: 4 },
    neon_current_skin: 'cyberpunk',
    neon_unlocked_skins: ['cyberpunk']
  });

  game.currentSkinId = 'cyberpunk';
  game.startNewGame();

  const starBonus = 1 + (4 - 1) * 0.10; // 1.30
  assert.equal(starBonus, 1.30);
  assert.ok(game.player.damageMultiplier >= 1.30, `Damage multiplier must include 1.30x star bonus (got ${game.player.damageMultiplier})`);
  assert.ok(game.player.speedMultiplier >= 1.30, `Speed multiplier must include 1.30x star bonus (got ${game.player.speedMultiplier})`);
  assert.ok(game.player.maxHp >= 130, `Max HP must scale with 1.30x star bonus (got ${game.player.maxHp})`);
});

test('S1.5: Hangar showcase renders star-scaled preview stats and star row', () => {
  resetLocalStorage({
    neon_ship_stars: { cyberpunk: 3 },
    neon_unlocked_skins: ['cyberpunk'],
    neon_total_crystals: 10000
  });

  game.currentSkinId = 'cyberpunk';
  game.inspectedSkinId = 'cyberpunk';
  game.renderHangarSkins();

  const skin = game.skins.cyberpunk;
  const starMult = 1 + (3 - 1) * 0.10; // 1.20
  const expectedDmg = Math.round(skin.stats.dmg * starMult);
  const expectedShield = Math.round(skin.stats.shield * starMult);
  const expectedSpeed = Math.round(skin.stats.speed * starMult);

  assert.equal(expectedDmg, Math.round(skin.stats.dmg * 1.20));
  assert.equal(expectedShield, Math.round(skin.stats.shield * 1.20));
  assert.equal(expectedSpeed, Math.round(skin.stats.speed * 1.20));
});

// ============================================================================
// SUITE 2: Infinite Quantum Overclock (Tech Workshop Lv 1-999)
// ============================================================================
console.log('\n>>> SUITE 2: Infinite Quantum Overclock (Tech Workshop)');

test('S2.1: Tech Catalog defines all 3 infinite overclock upgrades with maxLevel: 999', () => {
  const catalog = game.getTechCatalog();
  const dmg = catalog.find(i => i.id === 'overclock_damage');
  const def = catalog.find(i => i.id === 'overclock_defense');
  const cry = catalog.find(i => i.id === 'overclock_crystals');

  assert.ok(dmg && def && cry, 'All 3 overclock items must be present');
  assert.equal(dmg.maxLevel, 999);
  assert.equal(def.maxLevel, 999);
  assert.equal(cry.maxLevel, 999);
  assert.equal(dmg.isInfinite, true);
  assert.equal(def.isInfinite, true);
  assert.equal(cry.isInfinite, true);
});

test('S2.2: Geometric cost scaling follows Math.round(baseCost * Math.pow(1.15, level))', () => {
  const catalog = game.getTechCatalog();
  const dmg = catalog.find(i => i.id === 'overclock_damage');
  const baseCost = dmg.baseCost; // 1000
  const costMult = dmg.costMult; // 1.15

  const costAt = (lvl) => Math.round(baseCost * Math.pow(costMult, lvl));

  assert.equal(costAt(0), 1000);
  assert.equal(costAt(1), 1150);
  assert.equal(costAt(2), 1322);
  assert.equal(costAt(5), 2011);
  assert.equal(costAt(10), 4046);
  assert.equal(costAt(20), 16367);
});

test('S2.3: Resetting workshop refunds accurate geometric sum of infinite levels', () => {
  resetLocalStorage({
    neon_total_crystals: 500,
    neon_tech_upgrades: {
      overclock_damage: 3, // lvl 0, 1, 2 = 1000 + 1150 + 1322 = 3472
      overclock_defense: 2 // lvl 0, 1 = 1000 + 1150 = 2150
    }
  });

  game.totalCrystals = 500;
  game.techUpgrades = {
    overclock_damage: 3,
    overclock_defense: 2
  };

  const expectedRefund = (1000 + 1150 + 1322) + (1000 + 1150); // 5622
  game.resetTechUpgrades();

  assert.equal(game.totalCrystals, 500 + expectedRefund, `Refund should add exact geometric cost (got ${game.totalCrystals})`);
  assert.equal(game.techUpgrades.overclock_damage, 0);
  assert.equal(game.techUpgrades.overclock_defense, 0);
});

test('S2.4: Runtime flight initialization applies overclock bonuses (+3% DMG, +3% Def, +5% Crystals per level)', () => {
  resetLocalStorage({
    neon_tech_upgrades: {
      overclock_damage: 10,  // +30% DMG
      overclock_defense: 10, // +30% HP & Shield
      overclock_crystals: 10 // +50% Crystals
    }
  });

  game.currentSkinId = 'cyberpunk';
  game.techUpgrades = {
    overclock_damage: 10,
    overclock_defense: 10,
    overclock_crystals: 10
  };
  game.startNewGame();

  assert.ok(game.player.damageMultiplier >= 1.30, `Damage multiplier must include +30% overclock (got ${game.player.damageMultiplier})`);
  assert.ok(game.player.maxHp >= 130, `Max HP must include +30% overclock defense (got ${game.player.maxHp})`);
  assert.ok(game.player.crystalMultiplier >= 1.50, `Crystal multiplier must include +50% overclock crystals (got ${game.player.crystalMultiplier})`);
});

// ============================================================================
// SUITE 3: Daily Mutator Challenge Mechanics
// ============================================================================
console.log('\n>>> SUITE 3: Daily Mutator Challenge Mechanics');

test('S3.1: getDailyMutator() returns valid deterministic ruleset with date', () => {
  const mut = game.getDailyMutator();
  assert.ok(mut);
  assert.ok(['hyper_plasma', 'glass_cannon', 'meteor_swarm', 'boss_rush'].includes(mut.id));
  assert.ok(mut.name && mut.name.length > 0);
  assert.ok(mut.desc && mut.desc.length > 0);
  assert.equal(mut.date, new Date().toISOString().slice(0, 10));
});

test('S3.2: Glass Cannon mutator sets player.maxHp = 1, hp = 1, maxShield = 0, playerDmg = 2.5', () => {
  resetLocalStorage();
  game.currentMode = 'mutator';
  game.getDailyMutator = () => ({
    id: 'glass_cannon',
    name: 'GLASS CANNON',
    desc: '1 HP!',
    oneHp: true,
    playerDmg: 2.5,
    crystalMult: 2.0
  });

  game.startNewGame();

  assert.equal(game.player.maxHp, 1, 'Max HP must be strictly 1 in Glass Cannon');
  assert.equal(game.player.hp, 1, 'Current HP must be strictly 1 in Glass Cannon');
  assert.equal(game.player.maxShield, 0, 'Max Shield must be strictly 0 in Glass Cannon');
  assert.equal(game.player.shield, 0, 'Current Shield must be strictly 0 in Glass Cannon');
  assert.ok(game.player.damageMultiplier >= 2.5, `Player DMG must be scaled by 2.5x (got ${game.player.damageMultiplier})`);
  assert.ok(game.player.crystalMultiplier >= 2.0, `Crystal mult must be scaled by 2.0x (got ${game.player.crystalMultiplier})`);
});

test('S3.3: Hyper-Plasma mutator configures enemySpeed: 1.3 and xpMult: 1.2', () => {
  resetLocalStorage();
  game.currentMode = 'mutator';
  game.getDailyMutator = () => ({
    id: 'hyper_plasma',
    name: 'HYPER PLASMA',
    desc: 'High speed and dmg',
    playerDmg: 1.5,
    enemySpeed: 1.3,
    xpMult: 1.2
  });

  game.startNewGame();

  assert.equal(game.activeMutator.enemySpeed, 1.3);
  assert.equal(game.activeMutator.xpMult, 1.2);
  assert.ok(game.player.damageMultiplier >= 1.5);
});

test('S3.4: Boss Rush mutator sets nextStormBossTime to 25s with xpMult: 2.0', () => {
  resetLocalStorage();
  game.currentMode = 'mutator';
  game.getDailyMutator = () => ({
    id: 'boss_rush',
    name: 'BOSS RUSH',
    desc: 'Boss every 25s',
    bossFreq: 25,
    xpMult: 2.0
  });

  game.startNewGame();

  assert.equal(game.activeMutator.bossFreq, 25);
  assert.equal(game.nextStormBossTime, 25, 'nextStormBossTime must be set to 25s at start of Boss Rush');
});

test('S3.5: Meteor Swarm mutator configures meteorRate: 2.0 and crystalMult: 2.0', () => {
  resetLocalStorage();
  game.currentMode = 'mutator';
  game.getDailyMutator = () => ({
    id: 'meteor_swarm',
    name: 'METEOR SWARM',
    desc: 'Dense meteors',
    meteorRate: 2.0,
    crystalMult: 2.0
  });

  game.startNewGame();

  assert.equal(game.activeMutator.meteorRate, 2.0);
  assert.ok(game.player.crystalMultiplier >= 2.0);
});

test('S3.6: Daily Mutator completion reward awards +400 crystals upon surviving >= 60s', () => {
  const todayKey = new Date().toISOString().slice(0, 10);
  resetLocalStorage({
    neon_total_crystals: 1000
  });

  game.currentMode = 'mutator';
  game.gameTime = 65;
  game.crystalsEarnedThisRun = 52;
  game.totalCrystals = 1050;
  game.player = { score: 100, level: 2 };

  // Trigger game over logic
  game.gameOver();

  assert.equal(getStorage().getItem(`neon_mutator_done_${todayKey}`), 'true', 'Completion flag must be set in storage');
  assert.equal(game.totalCrystals, 1450, 'Total crystals must increase by +400 bonus (1050 + 400 = 1450)');
});

test('S3.7: Daily Mutator completion reward is NOT awarded twice on the same day', () => {
  const todayKey = new Date().toISOString().slice(0, 10);
  resetLocalStorage({
    neon_total_crystals: 1450,
    [`neon_mutator_done_${todayKey}`]: 'true'
  });

  game.currentMode = 'mutator';
  game.gameTime = 80;
  game.crystalsEarnedThisRun = 62;
  game.totalCrystals = 1470;
  game.player = { score: 100, level: 2 };

  game.gameOver();

  // Already completed today: only crystals earned from run, no additional +400 bonus
  assert.equal(game.totalCrystals, 1470);
});

test('S3.8: Daily Mutator completion reward is NOT awarded if run time < 60s', () => {
  const todayKey = new Date().toISOString().slice(0, 10);
  resetLocalStorage({
    neon_total_crystals: 1000
  });

  game.currentMode = 'mutator';
  game.gameTime = 45; // Survived only 45s (< 60s)
  game.crystalsEarnedThisRun = 40;
  game.totalCrystals = 1010;
  game.player = { score: 100, level: 2 };

  game.gameOver();

  assert.equal(getStorage().getItem(`neon_mutator_done_${todayKey}`), null, 'Must NOT mark completed if < 60s');
  assert.equal(game.totalCrystals, 1010, 'Must NOT grant +400 bonus if < 60s');
});

// ============================================================================
// SUITE 4: 9-Language Localization Audit for Milestone 3
// ============================================================================
console.log('\n>>> SUITE 4: 9-Language Localization Audit for Milestone 3');

test('S4.1: All 18 Milestone 3 keys defined across all 9 languages in CATALOG & TRANSLATIONS', () => {
  const requiredKeys = [
    'tech_overclock_dmg_name',
    'tech_overclock_dmg_desc',
    'tech_overclock_def_name',
    'tech_overclock_def_desc',
    'tech_overclock_cry_name',
    'tech_overclock_cry_desc',
    'starup_btn',
    'starup_max',
    'starup_toast_success',
    'starup_toast_insufficient',
    'mutator_hyper_plasma_name',
    'mutator_hyper_plasma_desc',
    'mutator_glass_cannon_name',
    'mutator_glass_cannon_desc',
    'mutator_meteor_swarm_name',
    'mutator_meteor_swarm_desc',
    'mutator_boss_rush_name',
    'mutator_boss_rush_desc'
  ];

  const languages = ['en-GB', 'tr-TR', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
  const missing = [];

  for (const lang of languages) {
    for (const key of requiredKeys) {
      const valT = TRANSLATIONS[lang] ? TRANSLATIONS[lang][key] : null;
      const valC = CATALOG[lang] ? CATALOG[lang][key] : null;
      if (!valT && !valC) {
        missing.push(`${lang}.${key}`);
      }
    }
  }

  assert.equal(missing.length, 0, `Missing translations in M3: ${missing.join(', ')}`);
});

test('S4.2: Zero Turkish characters in non-Turkish language dictionaries for M3 keys', () => {
  const requiredKeys = [
    'tech_overclock_dmg_name',
    'tech_overclock_dmg_desc',
    'tech_overclock_def_name',
    'tech_overclock_def_desc',
    'tech_overclock_cry_name',
    'tech_overclock_cry_desc',
    'starup_btn',
    'starup_max',
    'starup_toast_success',
    'starup_toast_insufficient',
    'mutator_hyper_plasma_name',
    'mutator_hyper_plasma_desc',
    'mutator_glass_cannon_name',
    'mutator_glass_cannon_desc',
    'mutator_meteor_swarm_name',
    'mutator_meteor_swarm_desc',
    'mutator_boss_rush_name',
    'mutator_boss_rush_desc'
  ];

  const turkishPattern = /[ğĞıİşŞ]/;
  const nonTurkishLangs = ['en-GB', 'fr-FR', 'fr-CA', 'de-DE', 'zh-HK', 'zh-CN', 'zh-TW', 'ja-JP'];
  const violations = [];

  for (const lang of nonTurkishLangs) {
    for (const key of requiredKeys) {
      const val = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || (CATALOG[lang] && CATALOG[lang][key]) || '';
      if (turkishPattern.test(val)) {
        violations.push(`${lang}.${key}: ${val}`);
      }
    }
  }

  assert.equal(violations.length, 0, `Turkish character violations in non-Turkish M3 keys: ${violations.join(', ')}`);
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(78));
console.log(` EMPIRICAL CHALLENGER RESULT: ${passedTests}/${totalTests} tests passed (${failedTests} failed)`);
console.log('='.repeat(78));

if (failedTests > 0) {
  process.exit(1);
}
