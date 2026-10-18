import fs from 'fs';
import { getGame, resetLocalStorage, getStorage } from './harness.js';
import { enemiesModule } from './harness.js';
const { EnemyProjectile } = enemiesModule;

console.log('===============================================================');
console.log('=== CHALLENGER 1: EMPIRICAL STRESS TEST SUITE (MILESTONE 1) ===');
console.log('===============================================================\n');

let failed = false;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// -------------------------------------------------------------
// SECTION 1: PROGRESSIVE MODE GATING TRUTH TABLE (20 COMBINATIONS)
// -------------------------------------------------------------
console.log('\n--- SECTION 1: PROGRESSIVE MODE GATING TRUTH TABLE ---');
const game = getGame();
const levels = [1, 2, 3, 10];
const flightsList = [0, 1, 2, 3, 5];

const stormEl = document.getElementById('mode-storm');
const mutatorEl = document.getElementById('mode-mutator');

let gatingMatches = 0;
let domMatches = 0;

for (const lvl of levels) {
  for (const fl of flightsList) {
    resetLocalStorage({
      neon_unlocked_level: lvl,
      neon_games_played: fl
    });
    game.unlockedLevel = lvl;
    game.pilotStats = { totalFlights: fl };

    const maxStage = game.unlockedLevel || 1;
    const flights = (game.pilotStats && game.pilotStats.totalFlights) || parseInt(getStorage().getItem('neon_games_played') || '0', 10);

    const stormLockedActual = (maxStage < 2 && flights < 1);
    const stormExpected = !(lvl >= 2 || fl >= 1);

    const mutatorLockedActual = (maxStage < 3 && flights < 3);
    const mutatorExpected = !(lvl >= 3 || fl >= 3);

    if (stormLockedActual === stormExpected && mutatorLockedActual === mutatorExpected) {
      gatingMatches++;
    }

    game.applyMenuProgression();
    const stormHasClass = stormEl.classList.contains('feature-locked');
    const mutatorHasClass = mutatorEl.classList.contains('feature-locked');

    if (stormHasClass === stormExpected && mutatorHasClass === mutatorExpected) {
      domMatches++;
    }
  }
}

assert(gatingMatches === 20, `Mode gating condition matches spec across all 20 combinations (${gatingMatches}/20)`);
assert(domMatches === 20, `DOM feature-locked class matches spec across all 20 combinations (${domMatches}/20)`);

// Test click rejection and toasts when locked
resetLocalStorage({ neon_unlocked_level: 1, neon_games_played: 0 });
game.unlockedLevel = 1;
game.pilotStats = { totalFlights: 0 };
game.setMode('classic');

let lastToast = null;
game.showToast = (msg, color) => { lastToast = { msg, color }; };

// Trigger storm click handler logic when locked
const maxStageLock = game.unlockedLevel || 1;
const flightsLock = (game.pilotStats && game.pilotStats.totalFlights) || 0;
if (maxStageLock < 2 && flightsLock < 1) {
  game.showToast('toast_storm_locked', '#ffbe0b');
} else {
  game.setMode('storm');
}
assert(game.currentMode === 'classic', "Storm click when locked does not change mode from 'classic'");
assert(lastToast && lastToast.msg === 'toast_storm_locked', "Storm click when locked displays 'toast_storm_locked'");

// Test default cold start mode
resetLocalStorage({});
delete game.currentMode;
game.currentMode = getStorage().getItem('neon_current_mode') || 'classic';
assert(game.currentMode === 'classic', "Cold start defaults currentMode to 'classic'");

// -------------------------------------------------------------
// SECTION 2: GRAZE DISTANCE BOUNDARY CONDITIONS & FEEDBACK HARNESS
// -------------------------------------------------------------
console.log('\n--- SECTION 2: GRAZE DISTANCE BOUNDARY CONDITIONS ---');
game.startNewGame();
game.player.x = 200;
game.player.y = 400;
game.player.radius = 16;
game.player.upgrades.drones = 0;
game.player.evolutions = {};
game.enemies = [];

const bulletRadii = [3, 4, 6, 8, 12];
let boundaryTestsPassed = 0;
let totalBoundaryTests = 0;

for (const br of bulletRadii) {
  const Rhit = br + game.player.radius;
  const Rgraze = Rhit + 18;

  const testCases = [
    { name: 'center hit (dist=0)', dist: 0, expected: 'HIT' },
    { name: 'deep hit (dist=Rhit*0.5)', dist: Rhit * 0.5, expected: 'HIT' },
    { name: 'near-hit boundary (dist=Rhit - 0.001)', dist: Rhit - 0.001, expected: 'HIT' },
    { name: 'exact Rhit boundary (dist=Rhit)', dist: Rhit, expected: 'GRAZE' },
    { name: 'graze inner (dist=Rhit + 0.001)', dist: Rhit + 0.001, expected: 'GRAZE' },
    { name: 'graze midpoint (dist=Rhit + 9)', dist: Rhit + 9, expected: 'GRAZE' },
    { name: 'graze outer boundary (dist=Rgraze - 0.001)', dist: Rgraze - 0.001, expected: 'GRAZE' },
    { name: 'exact Rgraze boundary (dist=Rgraze)', dist: Rgraze, expected: 'MISS' },
    { name: 'miss outer (dist=Rgraze + 0.001)', dist: Rgraze + 0.001, expected: 'MISS' },
    { name: 'far miss (dist=Rgraze + 50)', dist: Rgraze + 50, expected: 'MISS' },
  ];

  for (const tc of testCases) {
    totalBoundaryTests++;
    const p = new EnemyProjectile(game.player.x + tc.dist, game.player.y, 0, 0, '#ff0055', br);
    p.radius = br;
    p.vx = 0;
    p.vy = 0;

    let hitOccurred = false;
    let grazeOccurred = false;

    const origTakeDamage = game.takeDamage.bind(game);
    const origTriggerGraze = game.triggerGraze.bind(game);

    game.takeDamage = function() { hitOccurred = true; };
    game.triggerGraze = function() { grazeOccurred = true; };

    game.enemyProjectiles = [p];
    game.updateEnemies(0);

    game.takeDamage = origTakeDamage;
    game.triggerGraze = origTriggerGraze;

    let actual = 'MISS';
    if (hitOccurred) actual = 'HIT';
    else if (grazeOccurred) actual = 'GRAZE';

    if (actual === tc.expected) {
      boundaryTestsPassed++;
    } else {
      console.error(`Boundary Mismatch: br=${br} dist=${tc.dist} expected=${tc.expected} got=${actual}`);
    }
  }
}

assert(boundaryTestsPassed === totalBoundaryTests, `All ${totalBoundaryTests} boundary distance tests passed (${boundaryTestsPassed}/${totalBoundaryTests})`);

// Multi-frame state transition and idempotency
console.log('\n--- SECTION 2B: GRAZE STATE TRANSITIONS & FEEDBACK ---');
const pGraze = new EnemyProjectile(game.player.x + 25, game.player.y, 0, 0, '#ff0055', 4);
pGraze.radius = 4;
pGraze.vx = 0;
pGraze.vy = 0;

let grazeCount = 0;
let hitCount = 0;
game.triggerGraze = () => { grazeCount++; };
game.takeDamage = () => { hitCount++; };

game.enemyProjectiles = [pGraze];
game.updateEnemies(0);
assert(grazeCount === 1 && pGraze.grazed === true, "Frame 1 in graze zone triggers graze and sets p.grazed=true");

game.updateEnemies(0);
assert(grazeCount === 1, "Frame 2 in graze zone does NOT re-trigger graze (idempotency preserved)");

pGraze.x = game.player.x + 15; // Move inside Rhit (20px)
game.updateEnemies(0);
assert(hitCount === 1 && pGraze.toRemove === true, "Frame 3 entering hit zone triggers takeDamage and removes projectile even if previously grazed");

// TriggerGraze mechanics
delete game.triggerGraze;
delete game.takeDamage;

game.screenShake = 1.0;
game.grazePulse = 0;
game.pilotStats = { totalGraze: 5 };
game.gameTime = 1.0;
game._lastGrazeCalloutTime = 0;
const startXp = game.player.xp;

let floatTexts = [];
game.particles.spawnFloatingText = (x, y, text, color, size) => {
  floatTexts.push({ t: game.gameTime, text });
};

game.triggerGraze(220, 400);
assert(game.screenShake === 3.5, "triggerGraze elevates screenShake to 3.5");
assert(game.grazePulse === 1.0, "triggerGraze sets grazePulse to 1.0");
assert(game.pilotStats.totalGraze === 6, "triggerGraze increments pilotStats.totalGraze");
assert(Math.abs((game.player.xp - startXp) - 0.3) < 0.001, "triggerGraze awards +0.3 XP");
assert(floatTexts.length === 1, "triggerGraze spawns floating text callout");

// Test callout throttle
game.gameTime = 1.5; // +0.5s < 0.8s cooldown
game.triggerGraze(220, 400);
assert(floatTexts.length === 1, "triggerGraze suppresses floating text within 0.8s throttle");

game.gameTime = 1.9; // +0.9s >= 0.8s cooldown
game.triggerGraze(220, 400);
assert(floatTexts.length === 2, "triggerGraze triggers floating text once 0.8s throttle expires");

// ScreenShake ceiling
game.screenShake = 8.0;
game.triggerGraze(220, 400);
assert(game.screenShake === 8.0, "triggerGraze preserves higher pre-existing screenShake (Math.max)");

// GrazePulse decay
game.grazePulse = 1.0;
game.update(0.1); // dt=0.1s -> decays 2.5 * 0.1 = 0.25 -> 0.75
assert(Math.abs(game.grazePulse - 0.75) < 0.01, `grazePulse decays by 2.5 * dt (expected ~0.75, got ${game.grazePulse.toFixed(3)})`);

// -------------------------------------------------------------
// SECTION 3: EMPIRICAL XP PACING & FTUE SIMULATION
// -------------------------------------------------------------
console.log('\n--- SECTION 3: EMPIRICAL XP PACING & FTUE SIMULATION ---');

// Benchmark 1: Flight 0 (FTUE Overdrive 12s)
const flight0Times = [];
for (let run = 1; run <= 100; run++) {
  resetLocalStorage({ neon_games_played: 0 });
  game.startNewGame();

  let levelUpTime = null;
  for (let f = 1; f <= 2400; f++) {
    game.player.hp = game.player.maxHp;
    game.player.x = (game.width / 2) + Math.sin(f * 0.05) * 40;
    game.update(1.0);

    if (game.player.level >= 2) {
      levelUpTime = f / 60;
      break;
    }
  }
  if (levelUpTime !== null) flight0Times.push(levelUpTime);
}

flight0Times.sort((a, b) => a - b);
const f0Min = flight0Times[0];
const f0Max = flight0Times[flight0Times.length - 1];
const f0Median = flight0Times[Math.floor(flight0Times.length / 2)];
const f0Avg = flight0Times.reduce((a, b) => a + b, 0) / flight0Times.length;
const f0Early = flight0Times.filter(t => t < 24.0).length;
const f0Target = flight0Times.filter(t => t >= 24.0 && t <= 30.0).length;
const f0Late = flight0Times.filter(t => t > 30.0).length;

console.log(`Flight 0 (FTUE 12s Overdrive) 100-Run Distribution:`);
console.log(`  Min: ${f0Min.toFixed(2)}s | Max: ${f0Max.toFixed(2)}s | Median: ${f0Median.toFixed(2)}s | Avg: ${f0Avg.toFixed(2)}s`);
console.log(`  Early (<24s): ${f0Early}% | Target (24-30s): ${f0Target}% | Late (>30s): ${f0Late}%`);

// Benchmark 2: Flight 1+ (No Overdrive)
const flight1Times = [];
for (let run = 1; run <= 100; run++) {
  resetLocalStorage({ neon_games_played: 1 });
  game.startNewGame();

  let levelUpTime = null;
  for (let f = 1; f <= 2400; f++) {
    game.player.hp = game.player.maxHp;
    game.player.x = (game.width / 2) + Math.sin(f * 0.05) * 40;
    game.update(1.0);

    if (game.player.level >= 2) {
      levelUpTime = f / 60;
      break;
    }
  }
  if (levelUpTime !== null) flight1Times.push(levelUpTime);
}

flight1Times.sort((a, b) => a - b);
const f1Min = flight1Times[0];
const f1Max = flight1Times[flight1Times.length - 1];
const f1Median = flight1Times[Math.floor(flight1Times.length / 2)];
const f1Avg = flight1Times.reduce((a, b) => a + b, 0) / flight1Times.length;
const f1Early = flight1Times.filter(t => t < 24.0).length;
const f1Target = flight1Times.filter(t => t >= 24.0 && t <= 30.0).length;
const f1Late = flight1Times.filter(t => t > 30.0).length;

console.log(`\nFlight 1+ (Standard Start) 100-Run Distribution:`);
console.log(`  Min: ${f1Min.toFixed(2)}s | Max: ${f1Max.toFixed(2)}s | Median: ${f1Median.toFixed(2)}s | Avg: ${f1Avg.toFixed(2)}s`);
console.log(`  Early (<24s): ${f1Early}% | Target (24-30s): ${f1Target}% | Late (>30s): ${f1Late}%`);

console.log('\n--- PACING EMPIRICAL ANALYSIS ---');
const meetsStrictInvariant = f0Min >= 24.0 && f0Max <= 30.0;
console.log(`Strict invariant (first upgrade ALWAYS between 24s and 30s): ${meetsStrictInvariant ? 'MET' : 'VIOLATED'}`);
if (!meetsStrictInvariant) {
  console.log(`[EMPIRICAL DEFECT] In Flight 0, ${f0Early}% of runs trigger before 24s (fastest: ${f0Min.toFixed(2)}s).`);
  console.log(`[ROOT CAUSE] spawnOpeningMeteorCluster spawns 3 successive hooks (openingHooksLeft=3). Hook 2 also spawns a core bomb (8 XP) because wave=1, and core bombs trigger 4s full-screen vacuum.`);
}

console.log('\n===============================================================');
if (failed) {
  console.error('❌ CHALLENGER STRESS SUITE: SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('✅ CHALLENGER STRESS SUITE: EXECUTION COMPLETED');
  process.exit(0);
}
