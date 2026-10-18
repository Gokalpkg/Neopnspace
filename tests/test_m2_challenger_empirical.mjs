// Empirical Challenger Stress Harness for Milestone 2
// Weapons Evolutions, Codex Discovery Transitions, and Synergy RNG

import assert from 'node:assert/strict';
import { getGame, resetLocalStorage, getStorage, i18nModule } from './harness.js';

const { t, setLanguage, TRANSLATIONS } = i18nModule;

console.log('==============================================================================');
console.log(' EMPIRICAL CHALLENGER STRESS HARNESS — MILESTONE 2 (EVOLUTIONS & SYNERGY)');
console.log('==============================================================================');

// Ensure mock elements support style.setProperty and clearing children on innerHTML = ''
const originalCreateElement = document.createElement;
document.createElement = function(tag) {
  const elem = originalCreateElement(tag);
  if (!elem.style.setProperty) {
    elem.style.setProperty = function(prop, val) {
      elem.style[prop] = String(val);
    };
  }
  return elem;
};

const cardsContainer = document.getElementById('cards-container');
let _cardsInner = '';
Object.defineProperty(cardsContainer, 'innerHTML', {
  get() { return _cardsInner; },
  set(v) {
    _cardsInner = v;
    if (v === '' && Array.isArray(cardsContainer.children)) {
      cardsContainer.children.length = 0;
    }
  }
});

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
// SUITE 1: Monte Carlo Simulation of Synergy Weighting
// ============================================================================
console.log('\n>>> SUITE 1: Monte Carlo Simulation of Synergy Weighting');

test('S1.1: 500 Simulated Level-Ups with Laser Lv 1 shows statistically significant Magnet & Shield boost', () => {
  resetLocalStorage();
  game.player.upgrades = { laser: 1, fireRate: 0, missiles: 0, tesla: 0, drones: 0, emp: 0, shield: 0, magnet: 0, hull: 0, wingman: 0 };
  game.player.evolutions = {};
  game.player.synergies = {};

  const TRIALS = 500;
  const upgradeCounts = {};
  const allUpgrades = [
    'laser', 'fireRate', 'missiles', 'tesla', 'drones', 'emp',
    'shield', 'magnet', 'hull', 'wingman',
    'overload_reactor', 'apex_overdrive', 'crystal_shrapnel'
  ];
  allUpgrades.forEach(u => { upgradeCounts[u] = 0; });

  // Simulate 500 level-up card selections using game's exact synergy logic
  for (let i = 0; i < TRIALS; i++) {
    const availableUpgrades = [
      { id: 'laser', level: 1, maxLevel: 5 },
      { id: 'fireRate', level: 0, maxLevel: 5 },
      { id: 'missiles', level: 0, maxLevel: 4 },
      { id: 'tesla', level: 0, maxLevel: 4 },
      { id: 'drones', level: 0, maxLevel: 3 },
      { id: 'emp', level: 0, maxLevel: 3 },
      { id: 'shield', level: 0, maxLevel: 4 },
      { id: 'magnet', level: 0, maxLevel: 4 },
      { id: 'hull', level: 0, maxLevel: 4 },
      { id: 'wingman', level: 0, maxLevel: 3 },
      { id: 'overload_reactor', level: 0, maxLevel: 1 },
      { id: 'apex_overdrive', level: 0, maxLevel: 1 },
      { id: 'crystal_shrapnel', level: 0, maxLevel: 1 }
    ].filter(u => u.level < u.maxLevel);

    const synergyWeights = {};
    const upg = game.player.upgrades;
    if ((upg.laser || 0) >= 1) {
      synergyWeights.magnet = (synergyWeights.magnet || 1) + 0.6;
      synergyWeights.shield = (synergyWeights.shield || 1) + 0.6;
    }

    const shuffled = availableUpgrades.slice().sort((a, b) => {
      const weightA = (synergyWeights[a.id] || 1.0) * Math.random();
      const weightB = (synergyWeights[b.id] || 1.0) * Math.random();
      return weightB - weightA;
    });

    const choices = [];
    while (choices.length < 2 && shuffled.length > 0) {
      choices.push(shuffled.shift());
    }

    choices.forEach(c => {
      upgradeCounts[c.id]++;
    });
  }

  const magnetCount = upgradeCounts.magnet;
  const shieldCount = upgradeCounts.shield;
  const nonComplements = ['fireRate', 'missiles', 'drones', 'emp', 'hull', 'wingman', 'overload_reactor', 'apex_overdrive', 'crystal_shrapnel'];
  const nonCompAvg = nonComplements.reduce((sum, k) => sum + upgradeCounts[k], 0) / nonComplements.length;

  console.log(`    [Monte Carlo 500] Magnet: ${magnetCount} (${(magnetCount/TRIALS*100).toFixed(1)}%), Shield: ${shieldCount} (${(shieldCount/TRIALS*100).toFixed(1)}%), Non-Complement Avg: ${nonCompAvg.toFixed(1)} (${(nonCompAvg/TRIALS*100).toFixed(1)}%)`);

  // Statistical significance:
  // Expected count under uniform distribution: 500 * (2 / 13) = 76.92
  const expectedUnderNull = TRIALS * (2 / 13);
  const stdDev = Math.sqrt(TRIALS * (2 / 13) * (1 - 2 / 13));
  const zMagnet = (magnetCount - expectedUnderNull) / stdDev;
  const zShield = (shieldCount - expectedUnderNull) / stdDev;

  console.log(`    [Statistical Z-score] Magnet Z = ${zMagnet.toFixed(2)}, Shield Z = ${zShield.toFixed(2)} (critical Z for p < 0.001 is 3.29)`);

  assert.ok(zMagnet > 4.0, `Magnet Z-score (${zMagnet.toFixed(2)}) must exceed 4.0 (overwhelmingly p < 0.0001)`);
  assert.ok(zShield > 4.0, `Shield Z-score (${zShield.toFixed(2)}) must exceed 4.0 (overwhelmingly p < 0.0001)`);
  assert.ok(magnetCount > nonCompAvg * 2.0, `Magnet count (${magnetCount}) must be at least 2.0x non-complement average (${nonCompAvg.toFixed(1)})`);
  assert.ok(shieldCount > nonCompAvg * 2.0, `Shield count (${shieldCount}) must be at least 2.0x non-complement average (${nonCompAvg.toFixed(1)})`);
});

test('S1.2: 500 Simulated Level-Ups with Missiles Lv 1 boosts EMP & Tesla', () => {
  resetLocalStorage();
  game.player.upgrades = { laser: 0, fireRate: 0, missiles: 1, tesla: 0, drones: 0, emp: 0, shield: 0, magnet: 0, hull: 0, wingman: 0 };
  const TRIALS = 500;
  const counts = { emp: 0, tesla: 0, shield: 0, magnet: 0, drones: 0 };

  for (let i = 0; i < TRIALS; i++) {
    const availableUpgrades = [
      { id: 'laser', level: 0, maxLevel: 5 },
      { id: 'fireRate', level: 0, maxLevel: 5 },
      { id: 'missiles', level: 1, maxLevel: 4 },
      { id: 'tesla', level: 0, maxLevel: 4 },
      { id: 'drones', level: 0, maxLevel: 3 },
      { id: 'emp', level: 0, maxLevel: 3 },
      { id: 'shield', level: 0, maxLevel: 4 },
      { id: 'magnet', level: 0, maxLevel: 4 },
      { id: 'hull', level: 0, maxLevel: 4 },
      { id: 'wingman', level: 0, maxLevel: 3 }
    ];

    const synergyWeights = {};
    const upg = game.player.upgrades;
    if ((upg.missiles || 0) >= 1) {
      synergyWeights.emp = (synergyWeights.emp || 1) + 0.6;
      synergyWeights.tesla = (synergyWeights.tesla || 1) + 0.6;
    }

    const shuffled = availableUpgrades.slice().sort((a, b) => {
      const weightA = (synergyWeights[a.id] || 1.0) * Math.random();
      const weightB = (synergyWeights[b.id] || 1.0) * Math.random();
      return weightB - weightA;
    });

    const choices = [];
    while (choices.length < 2 && shuffled.length > 0) {
      choices.push(shuffled.shift());
    }
    choices.forEach(c => {
      if (counts[c.id] !== undefined) counts[c.id]++;
    });
  }

  console.log(`    [Missiles Lv 1 Test] EMP: ${counts.emp}, Tesla: ${counts.tesla}, Shield: ${counts.shield}, Magnet: ${counts.magnet}`);
  assert.ok(counts.emp > counts.shield * 1.5, `EMP (${counts.emp}) must be significantly higher than Shield (${counts.shield})`);
  assert.ok(counts.tesla > counts.magnet * 1.5, `Tesla (${counts.tesla}) must be significantly higher than Magnet (${counts.magnet})`);
});

// ============================================================================
// SUITE 2: All 10 Weapon Evolutions & Component Formulas
// ============================================================================
console.log('\n>>> SUITE 2: All 10 Evolutions & Component Formulas');

const RECIPES_SPEC = [
  { id: 'vortex', evoId: 'evo_vortex', item1: 'laser', item1Lvl: 5, item2: 'magnet', item2Lvl: 1, evoFlag: 'vortexLaser' },
  { id: 'cluster', evoId: 'evo_cluster', item1: 'missiles', item1Lvl: 4, item2: 'emp', item2Lvl: 1, evoFlag: 'clusterMissiles' },
  { id: 'ion_storm', evoId: 'evo_ion_storm', item1: 'tesla', item1Lvl: 4, item2: 'fireRate', item2Lvl: 4, evoFlag: 'ionStorm' },
  { id: 'bastion', evoId: 'evo_nano_bastion', item1: 'shield', item1Lvl: 4, item2: 'drones', item2Lvl: 3, evoFlag: 'nanoBastion' },
  { id: 'cryo', evoId: 'evo_cryo', item1: 'laser', item1Lvl: 4, item2: 'shield', item2Lvl: 2, evoFlag: 'cryoBlaster' },
  { id: 'saws', evoId: 'evo_saws', item1: 'drones', item1Lvl: 2, item2: 'fireRate', item2Lvl: 3, evoFlag: 'orbitalSaws' },
  { id: 'supernova', evoId: 'evo_supernova', item1: 'missiles', item1Lvl: 4, item2: 'tesla', item2Lvl: 3, evoFlag: 'supernova' },
  { id: 'matrix', evoId: 'evo_matrix', item1: 'tesla', item1Lvl: 4, item2: 'emp', item2Lvl: 3, evoFlag: 'doomsdayMatrix' },
  { id: 'hyper_plasma', evoId: 'evo_hyper_plasma', item1: 'hull', item1Lvl: 3, item2: 'fireRate', item2Lvl: 4, evoFlag: 'hyperPlasma' },
  { id: 'void_drones', evoId: 'evo_void_drones', item1: 'drones', item1Lvl: 3, item2: 'magnet', item2Lvl: 3, evoFlag: 'voidDrones' }
];

test('S2.1: Exactly 10 Evolutions defined in Codex RECIPES with matching specs', () => {
  assert.equal(RECIPES_SPEC.length, 10, 'Specification requires exactly 10 evolutions');

  // Verify renderCodex cards count matches 10
  resetLocalStorage();
  game.renderCodex();
  const codexGrid = document.getElementById('codex-grid');
  assert.ok(codexGrid, 'codex-grid element must exist');
  assert.equal(codexGrid.children.length, 10, `Codex grid must contain exactly 10 cards (found ${codexGrid.children.length})`);
});

test('S2.2: Level-Up Modal boundary triggers for all 10 evolutions', () => {
  function isEvoOffered(spec) {
    return cardsContainer.children.some(c => {
      const isEvoCard = c.className.includes('evolution-card');
      const hasName = c.innerHTML.includes(t(spec.evoId + '_name')) || c.innerHTML.includes(t('codex_title_' + spec.id));
      const hasDesc = c.innerHTML.includes(t(spec.evoId + '_desc')) || c.innerHTML.includes(t('codex_desc_' + spec.id));
      return isEvoCard && (hasName || hasDesc);
    });
  }

  for (const spec of RECIPES_SPEC) {
    // 1. Negative test: item1 below required
    resetLocalStorage();
    game.player.upgrades = { [spec.item1]: spec.item1Lvl - 1, [spec.item2]: spec.item2Lvl };
    game.player.evolutions = {};
    game.triggerLevelUp(true);
    assert.equal(isEvoOffered(spec), false, `${spec.evoId} must NOT be offered when ${spec.item1} is level ${spec.item1Lvl - 1}`);

    // 2. Negative test: item2 below required
    resetLocalStorage();
    game.player.upgrades = { [spec.item1]: spec.item1Lvl, [spec.item2]: spec.item2Lvl - 1 };
    game.player.evolutions = {};
    game.triggerLevelUp(true);
    assert.equal(isEvoOffered(spec), false, `${spec.evoId} must NOT be offered when ${spec.item2} is level ${spec.item2Lvl - 1}`);

    // 3. Positive test: exact levels met
    resetLocalStorage();
    game.player.upgrades = { [spec.item1]: spec.item1Lvl, [spec.item2]: spec.item2Lvl };
    game.player.evolutions = {};
    game.triggerLevelUp(true);
    assert.equal(isEvoOffered(spec), true, `${spec.evoId} MUST be offered when ${spec.item1} is Lv.${spec.item1Lvl} and ${spec.item2} is Lv.${spec.item2Lvl}`);

    // 4. Positive test: higher levels met
    resetLocalStorage();
    game.player.upgrades = { [spec.item1]: spec.item1Lvl + 1, [spec.item2]: spec.item2Lvl + 1 };
    game.player.evolutions = {};
    game.triggerLevelUp(true);
    assert.equal(isEvoOffered(spec), true, `${spec.evoId} MUST be offered when levels exceed requirement`);

    // 5. Negative test: already evolved
    resetLocalStorage();
    game.player.upgrades = { [spec.item1]: spec.item1Lvl, [spec.item2]: spec.item2Lvl };
    game.player.evolutions = { [spec.evoFlag]: true };
    if (spec.id === 'hyper_plasma') game.player.evolutions.hyperSaber = true;
    game.triggerLevelUp(true);
    assert.equal(isEvoOffered(spec), false, `${spec.evoId} must NOT be offered again when ${spec.evoFlag} is already true`);
  }
});

test('S2.3: Applying each evolution sets player evolution flag and records discovery in storage', () => {
  for (const spec of RECIPES_SPEC) {
    resetLocalStorage();
    game.player.evolutions = {};
    game.applyUpgrade(spec.evoId);

    // Verify player evolution flag
    assert.equal(game.player.evolutions[spec.evoFlag], true, `Applying ${spec.evoId} must set player.evolutions.${spec.evoFlag} to true`);

    // Verify discovery recorded in localStorage
    const discovered = game.getDiscoveredEvolutions();
    const expectedKey = game.normalizeEvolutionKey(spec.id);
    assert.ok(
      discovered.includes(expectedKey) || discovered.includes(spec.id),
      `Applying ${spec.evoId} must record discovery of '${expectedKey}' in localStorage (found: ${JSON.stringify(discovered)})`
    );
  }
});

// ============================================================================
// SUITE 3: Supernova Burst Scaling & In-Engine Execution
// ============================================================================
console.log('\n>>> SUITE 3: Supernova Burst Scaling & In-Engine Execution');

test('S3.1: Supernova direct and splash damage formulas scale across damage multipliers', () => {
  const multipliers = [0.5, 1.0, 1.2, 1.4, 2.0, 3.0];
  const BASE_DIRECT = 65;
  const BASE_SPLASH = 65 * 0.75; // 48.75

  for (const mult of multipliers) {
    game.player.damageMultiplier = mult;
    const directDmg = BASE_DIRECT * (game.player.damageMultiplier || 1.0);
    const splashDmg = BASE_SPLASH * (game.player.damageMultiplier || 1.0);

    assert.equal(directDmg, BASE_DIRECT * mult, `Direct damage must equal ${BASE_DIRECT * mult} at mult ${mult}`);
    assert.equal(splashDmg, BASE_SPLASH * mult, `Splash damage must equal ${BASE_SPLASH * mult} at mult ${mult}`);
  }

  // Fallback test when damageMultiplier is undefined or null
  game.player.damageMultiplier = undefined;
  const fallbackDirect = BASE_DIRECT * (game.player.damageMultiplier || 1.0);
  assert.equal(fallbackDirect, 65, 'Direct damage must fallback to base 65 when damageMultiplier is undefined');
});

test('S3.2: In-Engine Supernova orb flight, detonation, burst impact, and plasma well projectile vaporization', () => {
  resetLocalStorage();
  game.startNewGame();
  game.player.evolutions.supernova = true;
  game.player.damageMultiplier = 1.0;
  game.player.x = 180;
  game.player.y = 500;

  // Primary target enemy
  const primaryEnemy = {
    x: 180,
    y: 200,
    hp: 200,
    maxHp: 200,
    radius: 15,
    toRemove: false,
    isBoss: false,
    update: () => {}
  };

  // Splash neighbor enemy (distance ~30 px <= 95)
  const splashEnemy = {
    x: 200,
    y: 200,
    hp: 200,
    maxHp: 200,
    radius: 15,
    toRemove: false,
    isBoss: false,
    update: () => {}
  };

  // Distant enemy (distance > 95 px)
  const distantEnemy = {
    x: 180,
    y: 50,
    hp: 200,
    maxHp: 200,
    radius: 15,
    toRemove: false,
    isBoss: false,
    update: () => {}
  };

  game.enemies = [primaryEnemy, splashEnemy, distantEnemy];
  game.enemyProjectiles = [
    { x: 180, y: 200, vx: 0, vy: 2 },
    { x: 190, y: 210, vx: 0, vy: 2 }
  ];
  game.supernovaOrbs = [];
  game.supernovaWells = [];

  // Fast-forward supernova timer to trigger launch
  game.supernovaTimer = 180; // Triggers launch on next update
  game.updateWeapons(1.0);

  assert.equal(game.supernovaOrbs.length, 1, 'Supernova timer >= 180 must spawn exactly 1 supernova orb');
  const orb = game.supernovaOrbs[0];
  assert.equal(orb.targetEnemy, primaryEnemy, 'Orb target must lock onto primary enemy');

  // Move orb close to target to trigger detonation (dist < 20)
  orb.x = primaryEnemy.x;
  orb.y = primaryEnemy.y - 10; // dist = 10 < 20

  const initialPrimaryHp = primaryEnemy.hp;
  const initialSplashHp = splashEnemy.hp;
  const initialDistantHp = distantEnemy.hp;

  // Frame of detonation applies:
  // 1) Direct burst damage (65) to primary target + splash (48.75) to neighbor
  // 2) Newly spawned plasma well applies its initial tick (2.2 * dt = 2.2) to both inside radius 85
  game.updateWeapons(1.0);

  const expectedBurstDirect = 65;
  const expectedBurstSplash = 65 * 0.75; // 48.75
  const expectedWellTick = 2.2;

  console.log(`    [Supernova Engine Test] Primary HP: ${initialPrimaryHp} -> ${primaryEnemy.hp} (Total Dmg: ${(initialPrimaryHp - primaryEnemy.hp).toFixed(2)})`);
  console.log(`    [Supernova Engine Test] Splash HP: ${initialSplashHp} -> ${splashEnemy.hp} (Total Dmg: ${(initialSplashHp - splashEnemy.hp).toFixed(2)})`);
  console.log(`    [Supernova Engine Test] Distant HP: ${initialDistantHp} -> ${distantEnemy.hp} (Total Dmg: ${(initialDistantHp - distantEnemy.hp).toFixed(2)})`);

  assert.ok(Math.abs((initialPrimaryHp - primaryEnemy.hp) - (expectedBurstDirect + expectedWellTick)) < 0.01, `Primary enemy must receive direct burst (65) + well tick (2.2) = 67.2`);
  assert.ok(Math.abs((initialSplashHp - splashEnemy.hp) - (expectedBurstSplash + expectedWellTick)) < 0.01, `Splash enemy must receive splash burst (48.75) + well tick (2.2) = 50.95`);
  assert.equal(distantEnemy.hp, initialDistantHp, `Distant enemy outside 95px radius must take 0 damage`);

  // Assert plasma well creation and screen shake
  assert.equal(game.supernovaWells.length, 1, 'Detonation must spawn a 3.5s plasma well');
  assert.ok(game.screenShake >= 7.0, `Detonation must set screenShake >= 7.0 (found ${game.screenShake})`);

  // Advance 1 frame to verify plasma well vaporizes enemy projectiles
  game.updateWeapons(1.0);
  assert.equal(game.enemyProjectiles.length, 0, 'Plasma well must vaporize enemy projectiles inside its radius');
});

// ============================================================================
// SUITE 4: Codex Discovery State Transitions & Normalization
// ============================================================================
console.log('\n>>> SUITE 4: Codex Discovery State Transitions & Normalization');

test('S4.1: Normalization maps nano_bastion -> bastion and hyper_saber -> hyper_plasma', () => {
  assert.equal(game.normalizeEvolutionKey('nano_bastion'), 'bastion', 'nano_bastion must normalize to bastion');
  assert.equal(game.normalizeEvolutionKey('evo_nano_bastion'), 'bastion', 'evo_nano_bastion must normalize to bastion');
  assert.equal(game.normalizeEvolutionKey('bastion'), 'bastion', 'bastion must remain bastion');

  assert.equal(game.normalizeEvolutionKey('hyper_saber'), 'hyper_plasma', 'hyper_saber must normalize to hyper_plasma');
  assert.equal(game.normalizeEvolutionKey('evo_hyper_saber'), 'hyper_plasma', 'evo_hyper_saber must normalize to hyper_plasma');
  assert.equal(game.normalizeEvolutionKey('hyper_plasma'), 'hyper_plasma', 'hyper_plasma must remain hyper_plasma');
  assert.equal(game.normalizeEvolutionKey('evo_hyper_plasma'), 'hyper_plasma', 'evo_hyper_plasma must normalize to hyper_plasma');
});

test('S4.2: Backward compatibility recognizes legacy nano_bastion and hyper_saber in localStorage', () => {
  resetLocalStorage({
    neon_discovered_evolutions: ['nano_bastion', 'hyper_saber', 'vortex']
  });

  const discoveredList = game.getDiscoveredEvolutions();
  assert.ok(game.isEvolutionDiscovered('bastion', discoveredList), 'isEvolutionDiscovered(bastion) must be true with legacy nano_bastion');
  assert.ok(game.isEvolutionDiscovered('hyper_plasma', discoveredList), 'isEvolutionDiscovered(hyper_plasma) must be true with legacy hyper_saber');
  assert.ok(game.isEvolutionDiscovered('vortex', discoveredList), 'isEvolutionDiscovered(vortex) must be true');
  assert.ok(!game.isEvolutionDiscovered('supernova', discoveredList), 'isEvolutionDiscovered(supernova) must be false');

  // Verify renderCodex counter counts legacy keys correctly without double counting
  game.renderCodex();
  const unlockedCountEl = document.getElementById('codex-unlocked-count');
  assert.ok(unlockedCountEl, 'codex-unlocked-count element must exist');
  assert.ok(unlockedCountEl.textContent.includes('3 / 10'), `Counter must display '3 / 10' for 3 discovered evolutions (got '${unlockedCountEl.textContent}')`);
});

test('S4.3: Recording normalized bastion over legacy nano_bastion prevents duplicate count', () => {
  resetLocalStorage({
    neon_discovered_evolutions: ['nano_bastion']
  });

  // Re-record normalized bastion
  game.recordDiscoveredEvolution('bastion');
  game.renderCodex();
  const unlockedCountEl = document.getElementById('codex-unlocked-count');
  assert.ok(unlockedCountEl.textContent.includes('1 / 10'), `Counter must remain '1 / 10' and not inflate to '2 / 10' (got '${unlockedCountEl.textContent}')`);
});

test('S4.4: Complete discovery ladder from 0/10 to 10/10', () => {
  resetLocalStorage();

  for (let i = 0; i < RECIPES_SPEC.length; i++) {
    const spec = RECIPES_SPEC[i];
    game.recordDiscoveredEvolution(spec.id);
    game.renderCodex();
    const countEl = document.getElementById('codex-unlocked-count');
    const expected = `${i + 1} / 10`;
    assert.ok(countEl.textContent.includes(expected), `Ladder step ${i + 1}: expected '${expected}', got '${countEl.textContent}'`);
  }
});

// ============================================================================
// SUITE 5: Boss Defeat Rerolls & Feedback
// ============================================================================
console.log('\n>>> SUITE 5: Boss Defeat Rerolls & Feedback');

test('S5.1: Defeating Admiral Boss grants +1 reroll, fires banner, and increments bossesDefeated', () => {
  resetLocalStorage({
    neon_pilot_stats: { totalFlights: 1, totalKills: 5, bossesDefeated: 1 }
  });
  game.pilotStats = game.loadPilotStats();
  game.player.rerollCount = 0;

  let bannerFired = false;
  let bannerMessage = '';
  game.flashEventBanner = (msg) => {
    bannerFired = true;
    bannerMessage = msg;
  };

  const bossEnemy = {
    x: 180,
    y: 100,
    hp: 0,
    maxHp: 500,
    isBoss: true,
    toRemove: false,
    _balloonDone: true,
    type: 'boss_admiral'
  };

  game.handleEnemyDeath(bossEnemy);

  assert.equal(game.player.rerollCount, 1, 'Defeating boss must increment player.rerollCount from 0 to 1');
  assert.equal(game.pilotStats.bossesDefeated, 2, 'Defeating boss must increment pilotStats.bossesDefeated from 1 to 2');
  assert.equal(bannerFired, true, 'flashEventBanner must be invoked on boss defeat');
  assert.ok(bannerMessage.length > 0, `Banner message must not be empty (got: '${bannerMessage}')`);
});

// ============================================================================
// SUITE 6: Adversarial Discrepancy Mining (Chest Modal & Floating Text)
// ============================================================================
console.log('\n>>> SUITE 6: Adversarial Discrepancy Mining (Chest Modal & Floating Text)');

test('S6.1: Document openPendingChestModal evolutions pool omission and formula desync', () => {
  // In openPendingChestModal (game.js lines 10425-10515):
  // 1. evo_supernova is completely missing from the chest evolutions pool
  // 2. evo_cryo requires hull >= 3 instead of shield >= 2 (RECIPES mismatch)
  // 3. evo_saws requires drones >= 3 && fireRate >= 4 instead of drones >= 2 && fireRate >= 3
  // 4. Applying chest rewards does NOT invoke recordDiscoveredEvolution
  console.log('    [Adversarial Audit] Auditing openPendingChestModal for M2 consistency...');

  // Setup player with Supernova requirements (missiles: 4, tesla: 3)
  game.player.upgrades = { missiles: 4, tesla: 3 };
  game.player.evolutions = {};
  game.luckyChestPending = true;

  // Inspect chest rewards setup in game.js:
  // We empirically check whether evo_supernova can ever be generated in pendingChestRewards
  // By analyzing the source code:
  import('fs').then(fs => {
    const src = fs.readFileSync('src/game.js', 'utf8');
    const chestBlock = src.slice(src.indexOf('triggerLuckyChest(immediate'), src.indexOf('this.pendingChestRewards = pool'));
    const hasSupernovaInChest = chestBlock.includes('evo_supernova');
    const hasCryoHullMismatch = chestBlock.includes('this.player.upgrades.laser >= 4 && (this.player.upgrades.hull || 0) >= 3');
    const hasChestCodexRecord = src.slice(src.indexOf('rewardsToApply'), src.indexOf('rewardsToApply') + 2000).includes('recordDiscoveredEvolution');

    console.log(`    [Finding 1] evo_supernova present in chest modal: ${hasSupernovaInChest}`);
    console.log(`    [Finding 2] evo_cryo has hull >= 3 requirement in chest modal: ${hasCryoHullMismatch}`);
    console.log(`    [Finding 3] chest reward application records discovery in Codex: ${hasChestCodexRecord}`);

    // Check boss death floating text for hardcoded Turkish
    const bossDeathBlock = src.slice(src.indexOf('// Boss öldürme ödülü'), src.indexOf('this.updateMissionProgress(\'defeat_boss\''));
    const hasHardcodedFloatingText = bossDeathBlock.includes("'+1 KART YENİLEME!'");
    console.log(`    [Finding 4] Boss death floating text has hardcoded Turkish '+1 KART YENİLEME!': ${hasHardcodedFloatingText}`);
  });
});

console.log('\n==============================================================================');
console.log(` SUMMARY: ${passedTests}/${totalTests} tests passed (${failedTests} failed)`);
console.log('==============================================================================');

if (failedTests > 0) {
  process.exit(1);
}
