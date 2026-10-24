// ==============================================================================
// NEON SPACE SURVIVOR v1.6.0 — CHALLENGER 1 ADVERSARIAL & STRESS VERIFICATION
// Milestone 1 (R1: Weapon Evolution Showcase & EMP Shockwave)
//
// Tests:
// 1. All 10 evolutions trigger via applyUpgrade and triggerEvolutionSurge
// 2. 100% enemy projectile wipe on dismissal (strictly 0 length)
// 3. Player elementalAuraTimer = 480 frames (8s @ 60 FPS) and matching color
// 4. slowMoTimer = 90 frames and dt scaled by 0.08 in loop()
// 5. Stress testing rapid consecutive forging (100 frames), memory leaks, timer stability
// ==============================================================================

import assert from 'node:assert/strict';
import { getGame, resetLocalStorage, i18nModule } from './harness.js';

console.log('='.repeat(80));
console.log('CHALLENGER 1: EMPIRICAL ADVERSARIAL & STRESS VERIFICATION (MILESTONE 1)');
console.log('='.repeat(80));

const results = [];
let totalPassed = 0;
let totalFailed = 0;

function runTest(suite, name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    results.push({ suite, name, pass: true });
    totalPassed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         Error: ${err.message}`);
    if (err.stack) {
      console.error(err.stack.split('\n').slice(1, 5).join('\n'));
    }
    results.push({ suite, name, pass: false, error: err.message });
    totalFailed++;
  }
}

const canvas = document.getElementById('game-canvas');
if (canvas && canvas.getContext) {
  const ctx = canvas.getContext('2d');
  if (ctx && !ctx.setLineDash) {
    ctx.setLineDash = () => {};
    ctx.lineDashOffset = 0;
  }
}

const game = getGame();

// Ensure clean start
resetLocalStorage();
game.startNewGame();

// ==============================================================================
// SUITE 1: ALL 10 EVOLUTIONS TRIGGERING & COLOR MATCHING
// ==============================================================================
console.log('\n>>> SUITE 1: All 10 Evolutions Triggering & Color Verification');

const expectedRecipes = [
  { id: 'vortex', upgId: 'evo_vortex', evoKey: 'vortexLaser', color: '#d946ef' },
  { id: 'cluster', upgId: 'evo_cluster', evoKey: 'clusterMissiles', color: '#ffbe0b' },
  { id: 'ion_storm', upgId: 'evo_ion_storm', evoKey: 'ionStorm', color: '#38bdf8' },
  { id: 'bastion', upgId: 'evo_nano_bastion', evoKey: 'nanoBastion', color: '#05ffa1' },
  { id: 'cryo', upgId: 'evo_cryo', evoKey: 'cryoBlaster', color: '#00f0ff' },
  { id: 'saws', upgId: 'evo_saws', evoKey: 'orbitalSaws', color: '#ff5500' },
  { id: 'supernova', upgId: 'evo_supernova', evoKey: 'supernova', color: '#ff3d00' },
  { id: 'matrix', upgId: 'evo_matrix', evoKey: 'doomsdayMatrix', color: '#bf5af2' },
  { id: 'hyper_plasma', upgId: 'evo_hyper_plasma', evoKey: 'hyperPlasma', color: '#05ffa1' },
  { id: 'void_drones', upgId: 'evo_void_drones', evoKey: 'voidDrones', color: '#ffd700' }
];

for (const exp of expectedRecipes) {
  runTest('EvolutionTriggers', `1.1 [${exp.id}]: applyUpgrade('${exp.upgId}') triggers surge, slow-mo 90, and aura color ${exp.color}`, () => {
    // Reset state before triggering
    game.slowMoTimer = 0;
    game.slowMoFactor = 1.0;
    game.player.elementalAuraTimer = 0;
    game.player.elementalAuraColor = null;
    game.player.evolutions = {};
    game.showcaseModalActive = false;
    game.enemyProjectiles = [
      { x: 100, y: 100, radius: 4 },
      { x: 150, y: 200, radius: 4 },
      { x: 200, y: 300, radius: 4 }
    ];

    // Trigger via applyUpgrade
    game.applyUpgrade(exp.upgId);

    // 1. Verify surge initiated
    assert.equal(game.slowMoTimer, 90, `slowMoTimer must be 90 upon forging ${exp.id}`);
    assert.equal(game.slowMoFactor, 0.08, `slowMoFactor must be 0.08 upon forging ${exp.id}`);
    assert.equal(game.showcaseModalActive, true, `showcaseModalActive must be true upon forging ${exp.id}`);
    assert.ok(game.player.evolutions[exp.evoKey] === true, `player.evolutions.${exp.evoKey} must be set to true`);

    // 2. Dismiss showcase (simulate user tap after lock expired)
    game.modalInputLockUntil = 0;
    game.dismissEvolutionShowcase();

    // 3. Verify dismissal effects
    assert.equal(game.enemyProjectiles.length, 0, `enemyProjectiles must be strictly 0 after EMP wipe`);
    assert.equal(game.player.elementalAuraTimer, 480, `elementalAuraTimer must be 480 frames (8s @ 60fps)`);
    assert.equal(game.player.elementalAuraColor.toLowerCase(), exp.color.toLowerCase(),
      `elementalAuraColor must match ${exp.color} (got ${game.player.elementalAuraColor})`);
    assert.equal(game.slowMoTimer, 0, `slowMoTimer must reset to 0 on showcase dismissal`);
    assert.equal(game.showcaseModalActive, false, `showcaseModalActive must be false on dismissal`);
  });
}

// Also verify direct triggerEvolutionSurge for all 10
for (const exp of expectedRecipes) {
  runTest('DirectSurge', `1.2 [${exp.id}]: triggerEvolutionSurge('${exp.id}', '${exp.color}') initiates slow-mo and sets aura on dismissal`, () => {
    game.slowMoTimer = 0;
    game.slowMoFactor = 1.0;
    game.player.elementalAuraTimer = 0;
    game.player.elementalAuraColor = null;
    game.enemyProjectiles = [{ x: 50, y: 50, radius: 4 }];

    game.triggerEvolutionSurge(exp.id, exp.color);

    assert.equal(game.slowMoTimer, 90, `slowMoTimer must be 90`);
    assert.equal(game.slowMoFactor, 0.08, `slowMoFactor must be 0.08`);
    assert.equal(game.showcaseModalActive, true, `showcaseModalActive must be true`);

    game.modalInputLockUntil = 0;
    game.dismissEvolutionShowcase();

    assert.equal(game.enemyProjectiles.length, 0, `enemyProjectiles wiped to 0`);
    assert.equal(game.player.elementalAuraTimer, 480, `elementalAuraTimer is 480`);
    assert.equal(game.player.elementalAuraColor.toLowerCase(), exp.color.toLowerCase(), `aura color matches ${exp.color}`);
  });
}

// ==============================================================================
// SUITE 2: SLOW-MO TIME DILATION & DT SCALING IN LOOP()
// ==============================================================================
console.log('\n>>> SUITE 2: Slow-Motion Time Dilation & dt Scaling in loop()');

runTest('SlowMoLoop', '2.1: loop() scales dt by exactly 0.08 when slowMoTimer is active', () => {
  let capturedDt = null;
  const originalUpdate = game.update.bind(game);
  game.update = (dt) => {
    capturedDt = dt;
    originalUpdate(dt);
  };

  try {
    // Clear interfering resume ramps from previous modal closures
    game.resumeRampTimer = 0;
    game.modalTransition = null;

    // Standard frame with no slowMo (dt should be ~1.0)
    game.slowMoTimer = 0;
    game.slowMoFactor = 1.0;
    game.lastTime = 1000;
    game.loop(1016.667); // exactly 16.667ms frame time (rawDt = 1.0)
    assert.ok(Math.abs(capturedDt - 1.0) < 0.01, `Baseline dt should be ~1.0 (got ${capturedDt})`);

    // Activate slowMo
    game.slowMoTimer = 90;
    game.slowMoFactor = 0.08;
    game.lastTime = 1016.667;
    game.loop(1033.334); // next 16.667ms frame
    assert.ok(Math.abs(capturedDt - 0.08) < 0.001, `dt must be scaled by 0.08 (expected 0.08, got ${capturedDt})`);
    assert.equal(game.slowMoTimer, 89, `slowMoTimer should decrement to 89`);

    // Let slowMo count down to 0
    game.slowMoTimer = 1;
    game.slowMoFactor = 0.08;
    game.lastTime = 2000;
    game.loop(2016.667);
    assert.equal(game.slowMoTimer, 0, `slowMoTimer should hit 0`);
    assert.equal(game.slowMoFactor, 0.25, `slowMoFactor resets after timer expires`);

    // Next frame after expiry
    game.lastTime = 2016.667;
    game.loop(2033.334);
    assert.ok(Math.abs(capturedDt - 1.0) < 0.01, `dt should return to 1.0 after slowMo completes (got ${capturedDt})`);
  } finally {
    game.update = originalUpdate;
  }
});

// ==============================================================================
// SUITE 3: EMP ANNIHILATION RIGOROUS BOUNDARIES & ENEMY STUN RADIUS
// ==============================================================================
console.log('\n>>> SUITE 3: EMP Annihilation Rigorous Boundaries & Stun Radius');

runTest('EMPBoundaries', '3.1: EMP wipes 0 projectiles without error and wipes 5,000 projectiles completely', () => {
  // Empty boundary
  game.enemyProjectiles = [];
  game.modalInputLockUntil = 0;
  game.dismissEvolutionShowcase();
  assert.equal(game.enemyProjectiles.length, 0, 'Empty projectiles list remains 0 without throwing');

  // Massive barrage: 5,000 enemy bullets
  game.enemyProjectiles = [];
  for (let i = 0; i < 5000; i++) {
    game.enemyProjectiles.push({
      x: Math.random() * 360,
      y: Math.random() * 740,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      radius: 4
    });
  }
  assert.equal(game.enemyProjectiles.length, 5000, 'Populated 5000 projectiles');

  game.modalInputLockUntil = 0;
  game.dismissEvolutionShowcase();
  assert.equal(game.enemyProjectiles.length, 0, '100% of 5,000 enemy projectiles wiped strictly to length 0');
});

runTest('EMPStunRadius', '3.2: 460px EMP blast radius stuns and pushes normal enemies, but leaves bosses unstunned', () => {
  game.player.x = 180;
  game.player.y = 370;

  const closeNormal = { x: 180, y: 300, hp: 100, radius: 15, stunTimer: 0, frozen: 0, isBoss: false }; // dist = 70px
  const edgeNormal = { x: 180, y: 370 + 459, hp: 100, radius: 15, stunTimer: 0, frozen: 0, isBoss: false }; // dist = 459px
  const farNormal = { x: 180, y: 370 + 465, hp: 100, radius: 15, stunTimer: 0, frozen: 0, isBoss: false }; // dist = 465px
  const closeBoss = { x: 180, y: 250, hp: 5000, radius: 40, stunTimer: 0, frozen: 0, isBoss: true }; // dist = 120px

  game.enemies = [closeNormal, edgeNormal, farNormal, closeBoss];
  game.modalInputLockUntil = 0;
  game.dismissEvolutionShowcase();

  assert.ok(closeNormal.frozen >= 90 && closeNormal.stunTimer >= 90, 'Close enemy at 70px must be frozen & stunned for 90 frames');
  assert.ok(edgeNormal.frozen >= 90 && edgeNormal.stunTimer >= 90, 'Boundary enemy at 459px must be frozen & stunned');
  assert.equal(farNormal.stunTimer, 0, 'Far enemy at 465px (>460px) must NOT be stunned');
  assert.equal(farNormal.frozen, 0, 'Far enemy at 465px (>460px) must NOT be frozen');
  assert.equal(closeBoss.stunTimer, 0, 'Boss must be immune to EMP stun/freeze');
  assert.equal(closeBoss.frozen, 0, 'Boss must be immune to EMP freeze');
});

// ==============================================================================
// SUITE 4: ELEMENTAL AURA LIFECYCLE & RUNIC RENDERING
// ==============================================================================
console.log('\n>>> SUITE 4: Elemental Aura Lifecycle & Runic Rendering');

runTest('AuraLifecycle', '4.1: Elemental aura ticks down 480 frames to 0 and clamps without negative drift', () => {
  game.state = 'PLAYING';
  game.enemies = [];
  game.enemyProjectiles = [];
  game.projectiles = [];
  game.hitStopTimer = 0;
  game.spawnTimer = 999999;
  game.openingHookGap = 999999;
  game.openingSwarmPhase = 0;
  game.nextMeteorHookTime = 999999;
  game.slowMoTimer = 0;
  game.player.elementalAuraTimer = 480;

  // Advance 60 frames at dt = 1.0
  for (let f = 0; f < 60; f++) {
    game.update(1.0);
  }
  assert.equal(game.player.elementalAuraTimer, 420, 'elementalAuraTimer should be 420 after 60 frames');

  // Advance 420 frames to 0
  for (let f = 0; f < 420; f++) {
    game.enemies = [];
    game.projectiles = [];
    game.update(1.0);
  }
  assert.equal(game.player.elementalAuraTimer, 0, 'elementalAuraTimer should reach 0 after 480 frames');

  // Advance another 10 frames: should stay 0
  for (let f = 0; f < 10; f++) {
    game.update(1.0);
  }
  assert.equal(game.player.elementalAuraTimer, 0, 'elementalAuraTimer should clamp strictly at 0');
});

runTest('AuraRender', '4.2: drawPlayerShip renders rotating runic ring and 4 orbit focus nodes without throwing', () => {
  game.player.elementalAuraTimer = 240;
  game.player.elementalAuraColor = '#ff3d00';
  game.frames = 120;

  // Call drawPlayerShip directly
  let threw = false;
  try {
    game.drawPlayerShip();
  } catch (err) {
    threw = true;
    throw err;
  }
  assert.equal(threw, false, 'drawPlayerShip must render cleanly without throwing');
});

// ==============================================================================
// SUITE 5: ADVERSARIAL STRESS TEST — RAPID CONSECUTIVE EVOLUTION FORGING
// ==============================================================================
console.log('\n>>> SUITE 5: Adversarial Stress Test — Rapid Consecutive Evolution Forging');

runTest('RapidForgingStress', '5.1: Forging all 10 evolutions within 100 frames maintains timer stability & zero corruption', () => {
  resetLocalStorage();
  game.startNewGame();
  game.state = 'PLAYING';

  const upgradeQueue = [
    { frame: 5, upgId: 'evo_vortex', color: '#d946ef' },
    { frame: 15, upgId: 'evo_cluster', color: '#ffbe0b' },
    { frame: 25, upgId: 'evo_ion_storm', color: '#38bdf8' },
    { frame: 35, upgId: 'evo_nano_bastion', color: '#05ffa1' },
    { frame: 45, upgId: 'evo_cryo', color: '#00f0ff' },
    { frame: 55, upgId: 'evo_saws', color: '#ff5500' },
    { frame: 65, upgId: 'evo_supernova', color: '#ff3d00' },
    { frame: 75, upgId: 'evo_matrix', color: '#bf5af2' },
    { frame: 85, upgId: 'evo_hyper_plasma', color: '#05ffa1' },
    { frame: 95, upgId: 'evo_void_drones', color: '#ffd700' }
  ];

  let nextIndex = 0;

  for (let f = 0; f < 120; f++) {
    // Inject bullets constantly (with dummy update/draw)
    game.enemyProjectiles.push({
      x: 180 + Math.sin(f) * 50,
      y: 200 + Math.cos(f) * 50,
      radius: 4,
      update: () => {},
      draw: () => {}
    });

    if (nextIndex < upgradeQueue.length && f === upgradeQueue[nextIndex].frame) {
      const item = upgradeQueue[nextIndex];
      // Forge evolution
      game.applyUpgrade(item.upgId);

      // Verify surge initiated
      assert.equal(game.slowMoTimer, 90, `Frame ${f}: slowMoTimer should be 90 on surge`);
      assert.equal(game.slowMoFactor, 0.08, `Frame ${f}: slowMoFactor should be 0.08`);
      assert.equal(game.showcaseModalActive, true, `Frame ${f}: modal should be active`);

      // Dismiss after 2 frames
      game.modalInputLockUntil = 0;
      game.dismissEvolutionShowcase();

      // Verify EMP wiped bullets and set aura
      assert.equal(game.enemyProjectiles.length, 0, `Frame ${f}: enemyProjectiles must be 0 after dismissal`);
      assert.equal(game.player.elementalAuraTimer, 480, `Frame ${f}: elementalAuraTimer must be refreshed to 480`);
      assert.equal(game.player.elementalAuraColor.toLowerCase(), item.color.toLowerCase(), `Frame ${f}: color match`);

      nextIndex++;
    }

    // Step game loop frame
    game.loop(1000 + f * 16.667);
  }

  // Verify all 10 evolutions are recorded in player.evolutions
  const evoCount = Object.keys(game.player.evolutions).length;
  assert.ok(evoCount >= 10, `All 10 evolutions should be active in player.evolutions (got ${evoCount})`);
  assert.equal(isNaN(game.player.elementalAuraTimer), false, 'Aura timer must not be NaN');
  assert.equal(isNaN(game.slowMoTimer), false, 'Slow-mo timer must not be NaN');
});

runTest('ChestTripleEvoStress', '5.2: Triple evolution batch awarded in identical frame causes 0 corruption', () => {
  resetLocalStorage();
  game.startNewGame();
  game.enemyProjectiles = [{ x: 10, y: 10 }, { x: 20, y: 20 }];

  // Simulate lucky chest granting 3 evolutions in a single loop
  const multiRewards = [
    { id: 'evo_supernova', color: '#ff3d00' },
    { id: 'evo_matrix', color: '#bf5af2' },
    { id: 'evo_cryo', color: '#00f0ff' }
  ];

  for (const reward of multiRewards) {
    game.recordDiscoveredEvolution(reward.id.replace(/^evo_/, ''));
    game.triggerEvolutionSurge(reward.id, reward.color);
  }

  // The last triggered evolution takes precedence for current showcase
  assert.equal(game._currentShowcaseEvoId, 'cryo', 'Last queued evolution should be in showcase');
  assert.equal(game._currentShowcaseEvoColor, '#00f0ff', 'Showcase color should be #00f0ff');
  assert.equal(game.slowMoTimer, 90, 'slowMoTimer is 90');

  // Dismissal
  game.modalInputLockUntil = 0;
  game.dismissEvolutionShowcase();

  assert.equal(game.enemyProjectiles.length, 0, 'Projectiles cleared');
  assert.equal(game.player.elementalAuraTimer, 480, 'Aura timer is 480');
  assert.equal(game.player.elementalAuraColor, '#00f0ff', 'Aura color is #00f0ff');
});

runTest('MemoryLeakCheck', '5.3: 1,000 rapid surge & dismiss cycles result in bounded memory & zero timer leaks', () => {
  const heapStart = process.memoryUsage().heapUsed;

  for (let i = 0; i < 1000; i++) {
    // Populate some enemy projectiles and enemies
    game.enemyProjectiles = [{ x: 100, y: 100, radius: 4 }, { x: 200, y: 200, radius: 4 }];
    game.enemies = [{ x: 180, y: 370, radius: 10, hp: 50, stunTimer: 0, frozen: 0 }];

    game.triggerEvolutionSurge('supernova', '#ff3d00');
    game.modalInputLockUntil = 0;
    game.dismissEvolutionShowcase();
  }

  const heapEnd = process.memoryUsage().heapUsed;
  const growthMB = (heapEnd - heapStart) / (1024 * 1024);

  console.log(`    [Memory Check] Heap delta over 1,000 surges: ${growthMB.toFixed(2)} MB`);
  assert.ok(growthMB < 25.0, `Heap growth over 1,000 cycles should be < 25MB (got ${growthMB.toFixed(2)} MB)`);
  assert.equal(game.enemyProjectiles.length, 0, 'All projectiles cleared');
  assert.equal(game.showcaseModalActive, false, 'Showcase closed');
});

// ==============================================================================
// SUMMARY
// ==============================================================================
console.log('\n' + '='.repeat(80));
console.log(`TOTAL ADVERSARIAL TESTS: ${totalPassed + totalFailed} | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);
console.log('='.repeat(80));

if (totalFailed > 0) {
  process.exit(1);
} else {
  console.log('ALL ADVERSARIAL & STRESS VERIFICATION TESTS PASSED!\n');
  process.exit(0);
}
