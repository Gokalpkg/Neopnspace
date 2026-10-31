// ==============================================================================
// 🏛️ NEON SPACE SURVIVOR - FAZ 1.1 & FAZ 1.2 DEEP VERIFICATION SUITE
// Tests Tether Drone Cooldown, Doomsday Matrix boundary filters, and PoolManager.
// ==============================================================================

import assert from 'node:assert';
import { getGame } from './harness.js';
import { Gem, Enemy } from '../src/enemies.js';
import {
  gemPool,
  shockwavePool,
  rockDebrisPool,
  blastFireballPool,
  particleDebrisPool,
  PoolManager
} from '../src/pool-manager.js';

console.log('='.repeat(78));
console.log(' FAZ 1.1 & FAZ 1.2 DEEP SKEPTICAL VERIFICATION SUITE');
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
    if (err.stack) {
      console.error(err.stack.split('\n').slice(1, 4).join('\n'));
    }
    failed++;
  }
}

const game = getGame();

// ------------------------------------------------------------------------------
// FAZ 1.1: TETHER DRONE COOLDOWN & KNOCKBACK
// ------------------------------------------------------------------------------
test('FAZ 1.1.1: Tether drone laser hit inflicts damage, knockback, and sets 16-frame cooldown', () => {
  game.startNewGame();
  game.player.hp = 100;
  game.player.maxHp = 100;
  game.player.shield = 0;
  game.player.invulnerableTimer = 0;
  game.player.tetherHitCooldown = 0;
  game.player.vy = 0;
  game.player.knockY = 0;
  game.player.x = 200;
  game.player.y = 400;
  game.player.targetX = 200;
  game.player.targetY = 400;

  // Create tether drone pair crossing the player's position
  const droneA = new Enemy(100, 400, 'tether_drone', 1.0, 1.0);
  const droneB = new Enemy(300, 400, 'tether_drone', 1.0, 1.0);
  droneA.isTetherDrone = true;
  droneB.isTetherDrone = true;
  droneA.tetherPartner = droneB;
  droneB.tetherPartner = droneA;
  droneA.hp = 20;
  droneB.hp = 20;
  game.enemies = [droneA, droneB];

  // First collision check
  game.checkTetherCollisions(1.0);

  assert.strictEqual(game.player.tetherHitCooldown, 16, 'tetherHitCooldown must be set to exactly 16');
  assert.ok(game.player.hp < 100, 'Player must take damage (14 dmg)');
  assert.strictEqual(game.player.hp, 86, 'Player HP should be 100 - 14 = 86');
  assert.ok(game.player.vy >= 4.5, 'Player vy must increase by at least 4.5');
  assert.ok(game.player.knockY >= 12, 'Player knockY must be set to at least 12');
});

test('FAZ 1.1.2: Tether cooldown decrements by exactly 1 per frame (not 2 from double decrement)', () => {
  game.startNewGame();
  game.player.tetherHitCooldown = 16;
  const initialHp = game.player.hp;

  // Advance game by 1 frame (dt = 1.0)
  game.update(1.0);

  // If there was a double decrement, tetherHitCooldown would be 14 instead of 15!
  assert.strictEqual(game.player.tetherHitCooldown, 15, `tetherHitCooldown should be 15 after 1 frame (got ${game.player.tetherHitCooldown})`);

  // Colliding again during cooldown must NOT inflict damage
  const droneA = new Enemy(100, game.player.y, 'tether_drone', 1.0, 1.0);
  const droneB = new Enemy(300, game.player.y, 'tether_drone', 1.0, 1.0);
  droneA.isTetherDrone = true;
  droneB.isTetherDrone = true;
  droneA.tetherPartner = droneB;
  droneB.tetherPartner = droneA;
  game.enemies = [droneA, droneB];

  game.checkTetherCollisions(1.0);
  assert.strictEqual(game.player.hp, initialHp, 'Player must NOT take damage while tetherHitCooldown > 0');

  // Remove drones to isolate cooldown decrement
  game.enemies = [];

  // Advance remaining 15 frames
  for (let f = 0; f < 15; f++) {
    game.update(1.0);
  }
  assert.strictEqual(game.player.tetherHitCooldown, 0, 'tetherHitCooldown must reach 0 after 16 total frames');

  // Once cooldown has reached 0, new collision must hit again
  game.enemies = [droneA, droneB];
  game.checkTetherCollisions(1.0);
  assert.strictEqual(game.player.tetherHitCooldown, 16, 'New collision after cooldown must trigger 16-frame cooldown again');
  assert.strictEqual(game.player.hp, initialHp - 14, 'Player must take 14 damage on re-hit');
});

// ------------------------------------------------------------------------------
// FAZ 1.1: DOOMSDAY MATRIX OFF-SCREEN BOUNDARY PROTECTION
// ------------------------------------------------------------------------------
test('FAZ 1.1.3: Doomsday Matrix ignores off-screen enemies (y < 15 or y > height)', () => {
  game.startNewGame();
  game.player.evolutions.doomsdayMatrix = true;
  game.player.x = 200;
  game.player.y = 400;

  // Off-screen enemy above (y = -20)
  const enemyAbove = new Enemy(200, -20, 'scout', 1.0, 1.0);
  enemyAbove.hp = 50;

  // Off-screen enemy below (y = game.height + 50)
  const enemyBelow = new Enemy(200, game.height + 50, 'scout', 1.0, 1.0);
  enemyBelow.hp = 50;

  // On-screen enemy within 300px range (y = 350)
  const enemyOnScreen = new Enemy(200, 350, 'scout', 1.0, 1.0);
  enemyOnScreen.hp = 50;

  game.enemies = [enemyAbove, enemyBelow, enemyOnScreen];

  // Run weapons update for matrix
  game.updateWeapons(1.0);

  // Check tetheredEnemies
  assert.ok(game.tetheredEnemies.includes(enemyOnScreen), 'On-screen enemy must be targeted');
  assert.ok(!game.tetheredEnemies.includes(enemyAbove), 'Off-screen enemy above screen (y < 15) must NOT be targeted');
  assert.ok(!game.tetheredEnemies.includes(enemyBelow), 'Off-screen enemy below screen (y > height) must NOT be targeted');
  assert.strictEqual(enemyAbove.hp, 50, 'Off-screen enemy above must not take damage');
  assert.strictEqual(enemyBelow.hp, 50, 'Off-screen enemy below must not take damage');
  assert.ok(enemyOnScreen.hp < 50, 'On-screen enemy must take matrix damage');
});

test('FAZ 1.1.4: Doomsday Matrix 200-frame burst ignores off-screen enemies', () => {
  game.startNewGame();
  game.player.evolutions.doomsdayMatrix = true;
  game.player.x = 200;
  game.player.y = 400;

  const enemyAbove = new Enemy(200, 10, 'scout', 1.0, 1.0); // y < 15
  enemyAbove.maxHp = 100;
  enemyAbove.hp = 100;
  const enemyOnScreen = new Enemy(200, 350, 'scout', 1.0, 1.0);
  enemyOnScreen.maxHp = 200;
  enemyOnScreen.hp = 200;

  game.enemies = [enemyAbove, enemyOnScreen];
  game.matrixChargeTimer = 199.5; // Almost ready for burst

  game.updateWeapons(1.0); // Triggers burst

  assert.strictEqual(enemyAbove.hp, 100, 'Off-screen enemy (y < 15) must not receive burst damage');
  assert.ok(enemyOnScreen.hp < 100, 'On-screen enemy must receive 120 burst damage');
});

// ------------------------------------------------------------------------------
// FAZ 1.2: POOL MANAGER - GEM POOL
// ------------------------------------------------------------------------------
test('FAZ 1.2.1: GemPool initializes with 120 capacity and pre-allocated gems', () => {
  assert.strictEqual(gemPool.capacity, 120, 'GemPool capacity must be 120');
  assert.strictEqual(gemPool.pool.length, 120, 'GemPool pool length must be 120');
  assert.ok(gemPool.initialized, 'GemPool must be initialized');
  assert.strictEqual(gemPool.getActiveCount(), 0, 'Initially active count should be 0');
});

test('FAZ 1.2.2: GemPool acquire, reset and release lifecycle', () => {
  gemPool.releaseAll();
  const g1 = gemPool.acquire(150, 250, 8);

  assert.ok(g1 instanceof Gem, 'Acquired gem must be instance of Gem');
  assert.strictEqual(g1.active, true, 'Acquired gem must be active');
  assert.strictEqual(g1.x, 150, 'Gem x must match');
  assert.strictEqual(g1.y, 250, 'Gem y must match');
  assert.strictEqual(g1.value, 8, 'Gem value must match');
  assert.strictEqual(g1.toRemove, false, 'Gem toRemove must be false');
  assert.strictEqual(g1.color, '#ffbe0b', 'Gem value 8 must have gold color #ffbe0b');
  assert.strictEqual(gemPool.getActiveCount(), 1, 'Active count must be 1');

  gemPool.release(g1);
  assert.strictEqual(g1.active, false, 'Released gem must have active = false');
  assert.strictEqual(g1.toRemove, true, 'Released gem must have toRemove = true');
  assert.strictEqual(gemPool.getActiveCount(), 0, 'Active count must be 0 after release');
});

test('FAZ 1.2.3: GemPool saturation beyond 120 expands safely without duplicate references', () => {
  gemPool.releaseAll();
  const acquired = [];

  // Acquire all 120
  for (let i = 0; i < 120; i++) {
    acquired.push(gemPool.acquire(i * 2, i * 3, 1));
  }
  assert.strictEqual(gemPool.getActiveCount(), 120, '120 gems should be active');

  // Acquire 121st and 122nd beyond capacity
  const extra1 = gemPool.acquire(999, 888, 5);
  const extra2 = gemPool.acquire(777, 666, 15);

  assert.ok(extra1 !== extra2, 'Extra gems must be distinct objects, not duplicate references');
  assert.ok(!acquired.includes(extra1), 'Extra gem must not stomp an active on-screen gem');
  assert.ok(!acquired.includes(extra2), 'Extra gem must not stomp an active on-screen gem');
  assert.strictEqual(extra1.x, 999);
  assert.strictEqual(extra2.x, 777);

  gemPool.releaseAll();
  assert.strictEqual(gemPool.getActiveCount(), 0, 'All gems must be released');
});

test('FAZ 1.2.4: new Gem() and Gem.spawn() return pooled instances', () => {
  gemPool.releaseAll();
  const g = new Gem(50, 75, 3);
  assert.strictEqual(g.active, true);
  assert.strictEqual(g.x, 50);
  assert.strictEqual(g.y, 75);
  assert.strictEqual(g.value, 3);
  assert.strictEqual(gemPool.getActiveCount(), 1);

  Gem.release(g);
  assert.strictEqual(gemPool.getActiveCount(), 0);
});

// ------------------------------------------------------------------------------
// FAZ 1.2: POOL MANAGER - VFX POOLS (Shockwave, RockDebris, Fireball, Shards)
// ------------------------------------------------------------------------------
test('FAZ 1.2.5: ShockwavePool (40 cap) acquire, FIFO round-robin fallback and releaseAll', () => {
  shockwavePool.releaseAll();
  assert.strictEqual(shockwavePool.capacity, 40);

  const sw = shockwavePool.acquire(100, 200, '#00f0ff', 120);
  assert.strictEqual(sw.active, true);
  assert.strictEqual(sw.x, 100);
  assert.strictEqual(sw.y, 200);
  assert.strictEqual(sw.color, '#00f0ff');
  assert.strictEqual(sw.maxRadius, 120);
  assert.strictEqual(shockwavePool.getActiveCount(), 1);

  // Fill up to 40
  for (let i = 1; i < 40; i++) {
    shockwavePool.acquire(i, i, '#bf5af2', 80);
  }
  assert.strictEqual(shockwavePool.getActiveCount(), 40);

  // 41st and 42nd use round-robin fallback (indices 0 and 1)
  const sw41 = shockwavePool.acquire(410, 410, '#ffffff', 50);
  const sw42 = shockwavePool.acquire(420, 420, '#ffffff', 60);
  assert.ok(sw41 !== sw42, 'Round-robin fallback must cycle slots rather than stomping index 0 twice');

  shockwavePool.releaseAll();
  assert.strictEqual(shockwavePool.getActiveCount(), 0);
});

test('FAZ 1.2.6: RockDebrisPool (24 cap) initializes 5-vertex polygons and acquires cleanly', () => {
  rockDebrisPool.releaseAll();
  assert.strictEqual(rockDebrisPool.capacity, 24);

  const template = [{ x: 1, y: 0 }, { x: 0.5, y: 1 }, { x: -0.5, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }];
  const rk = rockDebrisPool.acquire(50, 60, 2, -3, 0.5, 0.05, 1.0, 0.04, template, 8, '#334155', '#94a3b8', '#38bdf8');

  assert.strictEqual(rk.active, true);
  assert.strictEqual(rk.x, 50);
  assert.strictEqual(rk.y, 60);
  assert.strictEqual(rk.polygon.length, 5);
  assert.strictEqual(rockDebrisPool.getActiveCount(), 1);

  rockDebrisPool.releaseAll();
  assert.strictEqual(rockDebrisPool.getActiveCount(), 0);
});

test('FAZ 1.2.7: BlastFireballPool (16 cap) accepts zero-allocation scalar arguments and cfg', () => {
  blastFireballPool.releaseAll();
  assert.strictEqual(blastFireballPool.capacity, 16);

  // Scalar argument call (Zero GC)
  const b1 = blastFireballPool.acquire(80, 90, 10, 50, 3.5, 1.0, 0.04, true, '#ffffff', '#ffbe0b', '#ff3d00');
  assert.strictEqual(b1.active, true);
  assert.strictEqual(b1.x, 80);
  assert.strictEqual(b1.y, 90);
  assert.strictEqual(b1.radius, 10);
  assert.strictEqual(b1.maxRadius, 50);
  assert.strictEqual(b1.isBomb, true);
  assert.strictEqual(b1.colorMid, '#ffbe0b');

  // Object config call (backward-compatible)
  const b2 = blastFireballPool.acquire({ x: 30, y: 40, radius: 5, maxRadius: 30, growSpeed: 2.0 });
  assert.strictEqual(b2.active, true);
  assert.strictEqual(b2.x, 30);
  assert.strictEqual(b2.y, 40);

  blastFireballPool.releaseAll();
  assert.strictEqual(blastFireballPool.getActiveCount(), 0);
});

test('FAZ 1.2.8: ParticleDebrisPool (32 cap) acquire and releaseAll', () => {
  particleDebrisPool.releaseAll();
  assert.strictEqual(particleDebrisPool.capacity, 32);

  const p = particleDebrisPool.acquire(10, 20, 1, 2, 3, '#ff0055', 1.0, 0.05);
  assert.strictEqual(p.active, true);
  assert.strictEqual(p.x, 10);
  assert.strictEqual(p.y, 20);
  assert.strictEqual(particleDebrisPool.getActiveCount(), 1);

  particleDebrisPool.releaseAll();
  assert.strictEqual(particleDebrisPool.getActiveCount(), 0);
});

test('FAZ 1.2.9: PoolManager umbrella releaseAll cleans all pools and provides stats', () => {
  gemPool.acquire(1, 1, 1);
  shockwavePool.acquire(1, 1);
  rockDebrisPool.acquire(1, 1, 0, 0, 0, 0, 1, 0.05, null, 5, '#000', '#fff', '#0ff');
  blastFireballPool.acquire(1, 1, 1, 10, 1);
  particleDebrisPool.acquire(1, 1, 0, 0, 1, '#fff');

  const statsBefore = PoolManager.getStats();
  assert.strictEqual(statsBefore.gems, `1 / ${gemPool.capacity}`);
  assert.strictEqual(statsBefore.shockwaves, `1 / ${shockwavePool.capacity}`);

  PoolManager.releaseAll();

  const statsAfter = PoolManager.getStats();
  assert.strictEqual(statsAfter.gems, `0 / ${gemPool.capacity}`);
  assert.strictEqual(statsAfter.shockwaves, `0 / ${shockwavePool.capacity}`);
  assert.strictEqual(statsAfter.rockDebris, `0 / ${rockDebrisPool.capacity}`);
  assert.strictEqual(statsAfter.blastFireballs, `0 / ${blastFireballPool.capacity}`);
  assert.strictEqual(statsAfter.particleDebris, `0 / ${particleDebrisPool.capacity}`);
});

console.log('='.repeat(78));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
console.log('='.repeat(78));

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
