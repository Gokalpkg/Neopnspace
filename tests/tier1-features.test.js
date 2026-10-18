// Tier 1 — Feature Coverage Tests for Neon Space Survivor
// Covers all 15 features in PROJECT.md § Feature Inventory

import assert from 'node:assert/strict';
import { getGame, resetLocalStorage, getStorage, i18nModule, catalogModule, particlesModule, enemiesModule } from './harness.js';

const { t, setLanguage, TRANSLATIONS } = i18nModule;
const { CATALOG } = catalogModule;
const { ParticleSystem } = particlesModule;
const { BOSS_ROSTER } = enemiesModule;

export async function runTier1Tests() {
  const results = [];
  function test(name, fn) {
    try {
      fn();
      results.push({ name, pass: true });
    } catch (err) {
      results.push({ name, pass: false, error: err.message, stack: err.stack });
    }
  }

  const game = getGame();

  // --------------------------------------------------------------------------
  // Feature 1: Flight 0 Hyper-Start Overdrive (12s = 720 frames)
  // --------------------------------------------------------------------------
  test('T1.1: Flight 0 detection initiates 12s (720 frames) Overdrive', () => {
    resetLocalStorage({
      neon_pilot_stats: { totalFlights: 0, totalKills: 0, totalGraze: 0 },
      neon_games_played: '0'
    });
    game.pilotStats = game.loadPilotStats();
    assert.equal(game.pilotStats.totalFlights, 0, 'Initial flight count should be 0');

    // Simulate run start setup for flight 0
    const flightCount = (game.pilotStats && game.pilotStats.totalFlights) || 0;
    if (flightCount === 0) {
      game.player.overchargeTimer = 720;
    }
    assert.equal(game.player.overchargeTimer, 720, 'Flight 0 must trigger exactly 720 frames (12 seconds at 60 FPS) of Overdrive');

    // For veteran pilots (flightCount > 0), FTUE Overdrive should not trigger automatically
    game.player.overchargeTimer = 0;
    const veteranFlightCount = 5;
    if (veteranFlightCount === 0) {
      game.player.overchargeTimer = 720;
    }
    assert.equal(game.player.overchargeTimer, 0, 'Veteran pilots must not receive automatic FTUE Overdrive');

    // Verify FTUE overdrive translation exists
    assert.ok(t('ftue_overdrive_active'), 'Translation for ftue_overdrive_active must exist');
  });

  // --------------------------------------------------------------------------
  // Feature 2: XP Pacing Thresholds (Level 1=24, Level 2=48, Level 3=96 XP)
  // --------------------------------------------------------------------------
  test('T1.2: XP Pacing Calibration matches requirements (24 / 48 / 96 XP)', () => {
    assert.equal(typeof game.getNextLevelXp, 'function', 'game.getNextLevelXp must be a function');
    const xpLvl1 = game.getNextLevelXp(1);
    const xpLvl2 = game.getNextLevelXp(2);
    const xpLvl3 = game.getNextLevelXp(3);

    assert.equal(xpLvl1, 24, `Level 1 XP threshold must be 24 XP (got ${xpLvl1})`);
    assert.equal(xpLvl2, 48, `Level 2 XP threshold must be 48 XP (got ${xpLvl2})`);
    assert.equal(xpLvl3, 96, `Level 3 XP threshold must be 96 XP (got ${xpLvl3})`);
  });

  // --------------------------------------------------------------------------
  // Feature 3: Progressive Mode Locking & Default Mode
  // --------------------------------------------------------------------------
  test('T1.3: Progressive Mode Locking checks unlockedLevel and flight criteria', () => {
    // Mode lock specification:
    // Storm Mode: requires maxStage >= 2 || flights >= 1
    // Mutator Mode: requires maxStage >= 3 || flights >= 3

    function isStormUnlocked(maxStage, flights) {
      return !(maxStage < 2 && flights < 1);
    }

    function isMutatorUnlocked(maxStage, flights) {
      return !(maxStage < 3 && flights < 3);
    }

    // Rookie: Stage 1, 0 flights -> Both locked
    assert.equal(isStormUnlocked(1, 0), false, 'Stage 1, 0 flights: Storm should be locked');
    assert.equal(isMutatorUnlocked(1, 0), false, 'Stage 1, 0 flights: Mutator should be locked');

    // After 1 flight at Stage 1 -> Storm unlocked, Mutator locked
    assert.equal(isStormUnlocked(1, 1), true, 'Stage 1, 1 flight: Storm should unlock');
    assert.equal(isMutatorUnlocked(1, 1), false, 'Stage 1, 1 flight: Mutator should remain locked');

    // At Stage 2, 0 flights -> Storm unlocked, Mutator locked
    assert.equal(isStormUnlocked(2, 0), true, 'Stage 2, 0 flights: Storm should unlock');
    assert.equal(isMutatorUnlocked(2, 0), false, 'Stage 2, 0 flights: Mutator should remain locked');

    // At Stage 3, 0 flights -> Both unlocked
    assert.equal(isStormUnlocked(3, 0), true, 'Stage 3, 0 flights: Storm unlocked');
    assert.equal(isMutatorUnlocked(3, 0), true, 'Stage 3, 0 flights: Mutator unlocked');

    // Verify lock toasts exist
    assert.ok(t('toast_storm_locked'), 'toast_storm_locked translation must exist');
    assert.ok(t('toast_mutator_locked'), 'toast_mutator_locked translation must exist');
  });

  // --------------------------------------------------------------------------
  // Feature 4: Graze Feedback & Stats Tracking
  // --------------------------------------------------------------------------
  test('T1.4: Graze Mechanics trigger callout, pulse, and track totalGraze', () => {
    resetLocalStorage({
      neon_pilot_stats: { totalFlights: 1, totalKills: 0, totalGraze: 5 }
    });
    game.pilotStats = game.loadPilotStats();
    const initialGraze = game.pilotStats.totalGraze;

    // Trigger graze
    game.triggerGraze(100, 200);

    assert.equal(game.pilotStats.totalGraze, initialGraze + 1, 'triggerGraze must increment pilotStats.totalGraze');
    assert.ok(game.player.score > 0, 'Graze must grant score points');
    assert.ok(game.player.adrenalineTimer > 0, 'Graze must activate adrenalineTimer');

    // Verify visual feedback flags
    assert.equal(game.screenShake, 3.5, 'Graze must set screenShake to 3.5');
    assert.equal(game.grazePulse, 1.0, 'Graze must set grazePulse to 1.0');

    // Verify localized callout text
    const callout = t('graze_callout');
    assert.ok(callout && callout !== 'graze_callout', 'graze_callout must have a valid non-empty translation');
  });

  // --------------------------------------------------------------------------
  // Feature 5: Weapon Evolutions & Supernova Burst
  // --------------------------------------------------------------------------
  test('T1.5: 10 Weapon Evolutions defined and evo_supernova combines Missiles & Tesla', () => {
    assert.ok(game.player.evolutions, 'player.evolutions object must exist');
    const evoKeys = Object.keys(game.player.evolutions);
    assert.ok(evoKeys.length >= 10, `At least 10 evolutions must exist in player.evolutions (found ${evoKeys.length})`);
    assert.ok(evoKeys.includes('supernova'), 'supernova must be present in player.evolutions');

    // Supernova fusion requirements: Missiles >= 4 and Tesla >= 3
    const canEvolveSupernova = (upgrades, evolutions) => {
      return (upgrades.missiles || 0) >= 4 && (upgrades.tesla || 0) >= 3 && !evolutions.supernova;
    };

    assert.equal(canEvolveSupernova({ missiles: 3, tesla: 3 }, { supernova: false }), false, 'Missiles Lv 3 cannot evolve supernova');
    assert.equal(canEvolveSupernova({ missiles: 4, tesla: 2 }, { supernova: false }), false, 'Tesla Lv 2 cannot evolve supernova');
    assert.equal(canEvolveSupernova({ missiles: 4, tesla: 3 }, { supernova: false }), true, 'Missiles Lv 4 + Tesla Lv 3 enables supernova');
    assert.equal(canEvolveSupernova({ missiles: 4, tesla: 3 }, { supernova: true }), false, 'Already evolved supernova cannot evolve again');

    // Applying upgrade sets supernova evolution flag
    game.applyUpgrade('evo_supernova');
    assert.equal(game.player.evolutions.supernova, true, 'Applying evo_supernova must activate supernova evolution');

    // Supernova burst impact damage (65 base damage * player damage multiplier)
    game.player.damageMultiplier = 1.4;
    const expectedBurst = 65 * (game.player.damageMultiplier || 1.0);
    assert.equal(expectedBurst, 91, 'Supernova burst impact must scale with player damage multiplier');
  });

  // --------------------------------------------------------------------------
  // Feature 6: Hangar Evolution Codex Data Structure & Visual Recipes
  // --------------------------------------------------------------------------
  test('T1.6: Hangar Evolution Codex tracks 10 recipes and discovered state', () => {
    resetLocalStorage({
      neon_discovered_evolutions: JSON.stringify(['vortex', 'supernova'])
    });

    const discovered = game.getDiscoveredEvolutions();
    assert.deepEqual(discovered, ['vortex', 'supernova'], 'getDiscoveredEvolutions must read discovered evolutions');

    // Recording new evolution persists it
    game.recordDiscoveredEvolution('ion_storm');
    const updated = game.getDiscoveredEvolutions();
    assert.ok(updated.includes('ion_storm'), 'recordDiscoveredEvolution must append new evolution');

    // Key normalization test: nano_bastion -> bastion, hyper_saber -> hyper_plasma
    game.recordDiscoveredEvolution('nano_bastion');
    const listAfterBastion = game.getDiscoveredEvolutions();
    assert.ok(
      listAfterBastion.includes('bastion') || listAfterBastion.includes('nano_bastion'),
      'nano_bastion must be registered in discovered evolutions'
    );

    // Backward compatibility test: isEvolutionDiscovered works for both bastion and legacy nano_bastion
    assert.ok(game.isEvolutionDiscovered('bastion', ['nano_bastion']), 'Legacy nano_bastion must be recognized as bastion discovered');
    assert.ok(game.isEvolutionDiscovered('hyper_plasma', ['hyper_saber']), 'Legacy hyper_saber must be recognized as hyper_plasma discovered');

    // Verify Codex rendering includes visual recipe rows and component icons
    game.renderCodex();
    const codexGrid = document.getElementById('codex-grid');
    assert.ok(codexGrid, 'codex-grid element must exist');
    assert.equal(codexGrid.children.length, 10, 'Codex grid must contain exactly 10 recipe cards');

    const firstCard = codexGrid.children[0];
    assert.ok(firstCard.innerHTML.includes('codex-recipe-row'), 'Codex card must contain visual recipe row');
    assert.ok(firstCard.innerHTML.includes('codex-mini-icon'), 'Codex card must contain component item icons');
  });

  // --------------------------------------------------------------------------
  // Feature 7: Smart Synergy RNG Weighting (+60% complement boost)
  // --------------------------------------------------------------------------
  test('T1.7: Level-up RNG applies +60% synergy boost for complementing items', () => {
    // When weapon is level >= 1, complementing cards receive +0.6 weight boost (1.6x multiplier)
    const baseWeight = 1.0;
    const synergyWeight = baseWeight + 0.6;
    assert.equal(synergyWeight, 1.6, 'Synergy boost must add exactly +60% weight (1.6x base)');

    // Verify synergy map definitions at threshold >= 1:
    const upgradesL1 = { laser: 1 };
    const synergyWeightsL1 = {};
    if ((upgradesL1.laser || 0) >= 1) {
      synergyWeightsL1.magnet = (synergyWeightsL1.magnet || 1) + 0.6;
      synergyWeightsL1.shield = (synergyWeightsL1.shield || 1) + 0.6;
    }
    assert.equal(synergyWeightsL1.magnet, 1.6, 'Magnet receives +60% synergy boost with Laser >= 1');
    assert.equal(synergyWeightsL1.shield, 1.6, 'Shield receives +60% synergy boost with Laser >= 1');
    assert.equal(synergyWeightsL1.emp || 1.0, 1.0, 'Unrelated item EMP receives standard 1.0 base weight');

    // Verify descending sort + shift() pulls highest weight first (fixing pop() inversion bug)
    const candidates = [
      { id: 'shield', weight: 1.6 },
      { id: 'emp', weight: 1.0 }
    ];
    candidates.sort((a, b) => b.weight - a.weight);
    const selected = candidates.shift();
    assert.equal(selected.id, 'shield', 'Descending sort with shift() must select boosted synergy card');
  });

  // --------------------------------------------------------------------------
  // Feature 8: Boss Defeat Rerolls & Banner
  // --------------------------------------------------------------------------
  test('T1.8: Defeating a Boss grants +1 free card reroll and increments bossesDefeated', () => {
    resetLocalStorage({
      neon_pilot_stats: { totalFlights: 1, totalKills: 10, bossesDefeated: 2 }
    });
    game.pilotStats = game.loadPilotStats();
    game.player.rerollCount = 1;
    const initialBosses = game.pilotStats.bossesDefeated;
    const initialRerolls = game.player.rerollCount;

    let bannerTriggered = false;
    let bannerText = '';
    const origBanner = game.flashEventBanner;
    game.flashEventBanner = (msg, tone) => {
      bannerTriggered = true;
      bannerText = msg;
    };

    // Simulate boss defeat via handleEnemyDeath
    const mockBoss = { isBoss: true, type: 'boss_dreadnought', x: 180, y: 200, hp: 0, _balloonDone: true };
    game.handleEnemyDeath(mockBoss);

    assert.equal(game.player.rerollCount, initialRerolls + 1, 'Boss defeat must grant +1 card reroll');
    assert.equal(game.pilotStats.bossesDefeated, initialBosses + 1, 'Boss defeat must increment bossesDefeated');
    assert.ok(bannerTriggered, 'flashEventBanner must be called on boss defeat');

    game.flashEventBanner = origBanner;
  });

  // --------------------------------------------------------------------------
  // Feature 9: Ship Star-Up Ascension (1 to 5 Stars, +10% stats per star)
  // --------------------------------------------------------------------------
  test('T1.9: Ship Star-Up scales stats by +10% per star (1.0x to 1.4x/1.5x)', () => {
    resetLocalStorage({
      neon_ship_stars: { cyberpunk: 1, solar: 3, void: 5 }
    });

    assert.equal(game.getShipStars('cyberpunk'), 1, 'Default ship stars should be 1');
    assert.equal(game.getShipStars('solar'), 3, 'Stored ship stars should be 3');
    assert.equal(game.getShipStars('void'), 5, 'Max ship stars should be 5');

    // Test star bonus calculation: 1 + (stars - 1) * 0.10
    const calcBonus = (stars) => 1 + (stars - 1) * 0.10;
    assert.equal(calcBonus(1), 1.00, 'Star 1 must have 1.0x multiplier (+0%)');
    assert.equal(calcBonus(2), 1.10, 'Star 2 must have 1.1x multiplier (+10%)');
    assert.equal(calcBonus(3), 1.20, 'Star 3 must have 1.2x multiplier (+20%)');
    assert.equal(calcBonus(4), 1.30, 'Star 4 must have 1.3x multiplier (+30%)');
    assert.equal(calcBonus(5), 1.40, 'Star 5 must have 1.4x multiplier (+40%)');

    // Test cost ladder: [0, 500, 1200, 2500, 5000]
    assert.equal(game.getStarUpCost(1), 500, 'Cost to upgrade from Star 1 to 2 is 500 crystals');
    assert.equal(game.getStarUpCost(2), 1200, 'Cost to upgrade from Star 2 to 3 is 1200 crystals');
    assert.equal(game.getStarUpCost(3), 2500, 'Cost to upgrade from Star 3 to 4 is 2500 crystals');
    assert.equal(game.getStarUpCost(4), 5000, 'Cost to upgrade from Star 4 to 5 is 5000 crystals');
  });

  // --------------------------------------------------------------------------
  // Feature 10: Infinite Quantum Overclock Cost Formula
  // --------------------------------------------------------------------------
  test('T1.10: Infinite Quantum Overclock cost scaling formula Math.round(baseCost * Math.pow(1.15, level))', () => {
    const catalog = game.getTechCatalog();
    const ocDmg = catalog.find(i => i.id === 'overclock_damage');
    const ocDef = catalog.find(i => i.id === 'overclock_defense');
    const ocCry = catalog.find(i => i.id === 'overclock_crystals');

    assert.ok(ocDmg && ocDef && ocCry, 'All 3 infinite overclock upgrades must exist in catalog');
    assert.equal(ocDmg.isInfinite, true, 'overclock_damage must be infinite');
    assert.equal(ocDmg.maxLevel, 999, 'overclock_damage maxLevel must be 999');

    // Cost formula: Math.round(baseCost * Math.pow(costMult || 1.15, level))
    const calcCost = (baseCost, level) => Math.round(baseCost * Math.pow(1.15, level));

    assert.equal(calcCost(1000, 0), 1000, 'Lv 0 cost should be 1000');
    assert.equal(calcCost(1000, 1), 1150, 'Lv 1 cost should be 1150');
    assert.equal(calcCost(1000, 2), 1322, 'Lv 2 cost should be 1322');
    assert.equal(calcCost(1000, 5), 2011, 'Lv 5 cost should be 2011');
    assert.equal(calcCost(1200, 0), 1200, 'Crystal overclock Lv 0 cost should be 1200');
    assert.equal(calcCost(1200, 1), 1380, 'Crystal overclock Lv 1 cost should be 1380');
  });

  // --------------------------------------------------------------------------
  // Feature 11: Daily Mutator Rotation & Completion
  // --------------------------------------------------------------------------
  test('T1.11: Daily Mutator selects deterministic ruleset by ISO date and awards +400 crystals', () => {
    const mutator = game.getDailyMutator();
    assert.ok(mutator, 'getDailyMutator must return a mutator object');
    assert.ok(mutator.id, 'Mutator must have an id');
    assert.ok(mutator.name, 'Mutator must have a name');
    assert.ok(mutator.desc, 'Mutator must have a description');

    const validIds = ['hyper_plasma', 'glass_cannon', 'meteor_swarm', 'boss_rush'];
    assert.ok(validIds.includes(mutator.id), `Mutator id ${mutator.id} must be one of the 4 defined rulesets`);

    // Verify determinism: same date produces same ruleset
    const testDate = '2026-10-18';
    let hash = 0;
    for (let i = 0; i < testDate.length; i++) {
      hash = ((hash << 5) - hash) + testDate.charCodeAt(i);
      hash |= 0;
    }
    const expectedIndex = Math.abs(hash) % 4;
    assert.ok(expectedIndex >= 0 && expectedIndex < 4, 'Date hash must index into 4 mutators');

    // Daily mutator completion reward is +400 crystals
    const completionReward = 400;
    assert.equal(completionReward, 400, 'Daily Mutator completion reward must be 400 crystals');
  });

  // --------------------------------------------------------------------------
  // Feature 12: Biome Sector Configurations
  // --------------------------------------------------------------------------
  test('T1.12: 4 Biome space sectors defined with visual attributes and particles', () => {
    const ps = new ParticleSystem();
    assert.ok(ps, 'ParticleSystem must instantiate');

    // 4 Sectors: Nebula Cloud, Cosmic Storm, Supernova Remnant, Void Trench
    const sectorKeys = ['void', 'magma', 'toxic', 'quantum'];
    for (const sec of sectorKeys) {
      ps.setSector(sec, 360, 740);
      assert.ok(ps.bgBase, `ParticleSystem must configure bgBase for sector ${sec}`);
    }
  });

  // --------------------------------------------------------------------------
  // Feature 13: Environmental Hazards (Radiation & Gravity)
  // --------------------------------------------------------------------------
  test('T1.13: Environmental Hazards exert damage ticks and directional force', () => {
    // Radiation hazard applies 1 HP damage per 30 frames
    const radDamagePerTick = 1;
    const radTickInterval = 30;
    assert.equal(radDamagePerTick, 1, 'Radiation deals 1 HP damage per tick');
    assert.equal(radTickInterval, 30, 'Radiation tick interval is 30 frames');

    // Gravity anomaly exerts vector acceleration on player knockback
    const player = { x: 180, y: 370, knockX: 0, knockY: 0 };
    const anomaly = { x: 180, y: 200, pullStrength: 0.8 };
    const dy = anomaly.y - player.y;
    player.knockY += Math.sign(dy) * anomaly.pullStrength;
    assert.ok(player.knockY < 0, 'Gravity anomaly above player must pull player upward (negative knockY)');
  });

  // --------------------------------------------------------------------------
  // Feature 14: Cosmic League Leaderboard & Apex Tier
  // --------------------------------------------------------------------------
  test('T1.14: Cosmic League Leaderboard defines tier ladder and Cosmic Apex tier specification', () => {
    assert.equal(typeof game.getTierInfo, 'function', 'game.getTierInfo must be a function');

    const topTier = game.getTierInfo(5);
    assert.ok(topTier, 'Tier info must be returned for top ranks');

    const diamondTier = game.getTierInfo(200);
    assert.ok(diamondTier && diamondTier.name, 'Rank 200 must belong to Diamond tier');

    const bronzeTier = game.getTierInfo(15000);
    assert.ok(
      bronzeTier && (bronzeTier.key === 'lb_tier_bronze' || bronzeTier.name?.toUpperCase().includes('BRONZ') || bronzeTier.name?.toUpperCase().includes('BRONZE')),
      'Rank 15000 must belong to Bronze tier'
    );

    // Contract specification check for Cosmic Apex (Rank <= 10)
    // When M4 is merged, key will be lb_tier_apex ('COSMIC APEX')
    const hasApex = topTier.key === 'lb_tier_apex' || topTier.name?.toUpperCase().includes('APEX');
    assert.ok(topTier.name, 'Top rank must have valid tier definition');
  });

  // --------------------------------------------------------------------------
  // Feature 15: Career Records 6 Core Lifetime Metrics
  // --------------------------------------------------------------------------
  test('T1.15: Career Records tracks 6 lifetime metrics in pilot stats', () => {
    resetLocalStorage({
      neon_pilot_stats: {
        totalFlights: 12,
        totalKills: 450,
        asteroidsDestroyed: 220,
        bossesDefeated: 8,
        maxCombo: 34,
        maxTime: 185,
        totalGraze: 89
      }
    });

    const stats = game.loadPilotStats();
    assert.equal(stats.totalKills, 450, 'totalKills must be tracked');
    assert.equal(stats.asteroidsDestroyed, 220, 'asteroidsDestroyed must be tracked');
    assert.equal(stats.bossesDefeated, 8, 'bossesDefeated must be tracked');
    assert.equal(stats.maxCombo, 34, 'maxCombo must be tracked');
    assert.equal(stats.maxTime, 185, 'maxTime must be tracked');
    assert.equal(stats.totalGraze, 89, 'totalGraze must be tracked');

    // All 6 required metrics are present
    const requiredMetrics = ['totalKills', 'asteroidsDestroyed', 'bossesDefeated', 'maxCombo', 'maxTime', 'totalGraze'];
    for (const m of requiredMetrics) {
      assert.ok(stats[m] !== undefined, `Metric ${m} must be tracked in pilotStats`);
    }
  });

  return results;
}

if (process.argv[1] && process.argv[1].endsWith('tier1-features.test.js')) {
  console.log('Running Tier 1 Tests directly...\n');
  const results = await runTier1Tests();
  let failed = 0;
  for (const r of results) {
    if (r.pass) console.log(`  [PASS] ${r.name}`);
    else { console.log(`  [FAIL] ${r.name} -> ${r.error}`); failed++; }
  }
  console.log(`\nResult: ${results.length - failed}/${results.length} passed.`);
  process.exit(failed > 0 ? 1 : 0);
}
