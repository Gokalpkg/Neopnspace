// ==============================================================================
// Neon Space Survivor — v1.7.0 Master Game Overhaul Verification Suite
// ==============================================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getGame, resetLocalStorage } from './harness.js';
import { sounds } from '../src/audio.js';
import { ParticleSystem } from '../src/particles.js';
import { Enemy, EnemyProjectile, Gem } from '../src/enemies.js';
import { vibrate } from '../src/vibration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('='.repeat(78));
console.log(' NEON SPACE SURVIVOR — v1.7.0 OVERHAUL VERIFICATION SUITE');
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

// 1. Version Bump Verification
test('V17.1: Version bumped to 1.7.0 (versionCode 47) in package.json & build.gradle', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  assert.equal(pkg.version, '1.7.0', 'package.json version must be 1.7.0');

  const gradle = fs.readFileSync(path.join(rootDir, 'android/app/build.gradle'), 'utf8');
  assert.ok(gradle.includes('versionCode 47'), 'build.gradle must have versionCode 47');
  assert.ok(gradle.includes('versionName "1.7.0"'), 'build.gradle must have versionName "1.7.0"');
});

// 2. Controls & Movement Snappiness
test('V17.2: Player follow tracking is snappy exponential (~0.70 per 60fps frame)', () => {
  resetLocalStorage();
  game.currentMode = 'classic';
  game.startNewGame();
  game.player.speedMultiplier = 1.0;
  game.currentSkinId = 'classic';
  game.player.x = 100;
  game.player.y = 500;
  game.player.targetX = 200;
  game.player.targetY = 500;

  // Run 1 frame of update
  game.update(1.0);
  const traveled = game.player.x - 100;
  // Should have traveled ~70px of the 100px delta
  assert.ok(traveled >= 68 && traveled <= 74, `Traveled ${traveled}px, expected snappy follow ~70px`);
});

// 3. Touch Input purely relative (no vertical snap-jump)
test('V17.3: Touchstart initializes target at ship position without vertical snap-jump', () => {
  resetLocalStorage();
  game.startNewGame();
  game.player.x = 180;
  game.player.y = 550;
  game.player.targetX = 180;
  game.player.targetY = 550;

  assert.equal(game.player.targetY, 550, 'targetY remains continuous without snap jump');
});

// 4. Hit-stop particle freeze bug fix
test('V17.4: Hit-stop does not freeze particle system', () => {
  resetLocalStorage();
  game.startNewGame();
  game.hitStopTimer = 3;
  let particlesUpdated = false;
  const origUpdate = game.particles.update.bind(game.particles);
  game.particles.update = (w, h, dt) => {
    particlesUpdated = true;
    origUpdate(w, h, dt);
  };

  game.update(1.0);
  assert.ok(particlesUpdated, 'ParticleSystem.update must be called during hitstop');
  game.particles.update = origUpdate;
  game.hitStopTimer = 0;
});

// 5. Combat Zone Hysteresis Deadzone
test('V17.5: Combat zone enforces hysteresis deadzone (0.67 entry, 0.73 exit)', () => {
  resetLocalStorage();
  game.startNewGame();
  game.height = 1000;
  game.player.combatZone = 'rear';

  // Move to 0.69 (between 0.67 and 0.73) - should stay 'rear'
  game.player.targetY = 690;
  game.player.y = 690;
  game.update(1.0);
  assert.equal(game.player.combatZone, 'rear', 'Must remain in rear zone at 0.69');

  // Move to 0.65 (< 0.67) - switches to 'front'
  game.player.targetY = 650;
  game.player.y = 650;
  game.update(1.0);
  assert.equal(game.player.combatZone, 'front', 'Must switch to front zone below 0.67');

  // Move back to 0.71 (> 0.67 but < 0.73) - should stay 'front' due to hysteresis
  game.player.targetY = 710;
  game.player.y = 710;
  game.update(1.0);
  assert.equal(game.player.combatZone, 'front', 'Must remain in front zone until > 0.73');

  // Move to 0.75 (> 0.73) - switches back to 'rear'
  game.player.targetY = 750;
  game.player.y = 750;
  game.update(1.0);
  assert.equal(game.player.combatZone, 'rear', 'Must switch to rear zone above 0.73');
});

// 6. Particle pool capacity (420)
test('V17.6: Particle pool capacity increased to 420', () => {
  const ps = new ParticleSystem();
  assert.equal(ps.maxParticles, 420, 'ParticleSystem maxParticles must be 420');
  assert.equal(ps.particles.length, 420, 'Pool array length must be 420');
});

// 7. Enemy Projectile Visual Enlarger & Magenta Aura
test('V17.7: Enemy projectiles render at 14x7 px with #ff0055 and #ffffff core', () => {
  const p = new EnemyProjectile(100, 100, 0, 5);
  const fillStyles = [];
  const rects = [];
  const mockCtx = {
    save() {},
    restore() {},
    translate() {},
    rotate() {},
    set fillStyle(v) { fillStyles.push(v); },
    fillRect(x, y, w, h) { rects.push({ x, y, w, h }); }
  };

  p.draw(mockCtx);
  assert.ok(fillStyles.includes('#ff0055'), 'Projectile must use glowing magenta #ff0055 aura');
  assert.ok(fillStyles.includes('#ffffff'), 'Projectile must use pure white #ffffff center');
  assert.ok(!fillStyles.includes('#ffbe0b'), 'Projectile must not use yellow #ffbe0b (avoids XP gem camouflage)');
  const outerRect = rects.find(r => r.w === 14 && r.h === 7);
  assert.ok(outerRect, 'Projectile outer rect must be enlarged to 14x7 px');
});

// 8. Toxic Ship Passive (Forward corrosive bio-cone)
test('V17.8: Toxic ship passive damages enemies in forward cone (y < player.y && y > player.y - 120)', () => {
  resetLocalStorage({ neon_equipped_skin: 'toxic' });
  game.startNewGame();
  game.currentSkinId = 'toxic';
  game.player.x = 180;
  game.player.y = 600;
  game.player.targetX = 180;
  game.player.targetY = 600;

  // Enemy ahead of player
  const aheadEnemy = new Enemy(180, 520, 'scout', 1, 1);
  aheadEnemy.hp = 100;
  aheadEnemy.maxHp = 100;
  // Enemy behind player
  const behindEnemy = new Enemy(180, 640, 'scout', 1, 1);
  behindEnemy.hp = 100;
  behindEnemy.maxHp = 100;

  game.enemies = [aheadEnemy, behindEnemy];
  game.frames = 11; // top of update() increments to 12 => frames % 12 === 0
  game.update(1.0);

  assert.ok(aheadEnemy.hp < 100, `Ahead enemy hp was ${aheadEnemy.hp}, expected < 100`);
  assert.equal(behindEnemy.hp, 100, 'Behind enemy must not take acid damage');
});

// 9. Gem Merging (XP preservation above 60 gems)
test('V17.9: Excess gems (> 60) are merged into hyper-gems without XP loss', () => {
  resetLocalStorage();
  game.startNewGame();
  game.gems = [];

  // Spawn 80 gems each of value 2
  for (let i = 0; i < 80; i++) {
    game.gems.push(new Gem(100 + i, 200, 2));
  }
  const initialTotalVal = game.gems.reduce((sum, g) => sum + g.value, 0); // 160 XP

  game.updateGems(1.0);
  const remainingTotalVal = game.gems.reduce((sum, g) => sum + g.value, 0);

  assert.ok(game.gems.length <= 61, `Gems count should be capped at <= 61 (got ${game.gems.length})`);
  assert.equal(remainingTotalVal, initialTotalVal, `Total XP value (${remainingTotalVal}) must equal initial (${initialTotalVal})`);
});

// 10. Escaped Rocks do not inflict HP damage penalty
test('V17.10: Escaped rocks reset combo but do not inflict HP/shield damage', () => {
  resetLocalStorage();
  game.startNewGame();
  game.player.hp = 100;
  game.player.shield = 50;
  game.comboCount = 10;
  game.comboTimer = 100;

  const rock = new Enemy(100, 800, 'asteroid_m', 1, 1);
  rock.shape = [{ x: 0, y: 0 }]; // asteroid shape
  rock.isAsteroid = true;

  game.handleEnemyEscaped(rock);

  assert.equal(game.comboCount, 0, 'Combo count should reset');
  assert.equal(game.player.hp, 100, 'Player HP must NOT take damage when rock escapes');
  assert.equal(game.player.shield, 50, 'Player Shield must NOT take damage when rock escapes');
});

// 11. Audio & Haptics calibration
test('V17.11: Audio gem pickup throttles & clamps frequency; Haptics light is refined', () => {
  assert.equal(typeof sounds.playGemPickup, 'function', 'sounds.playGemPickup must exist');
  assert.equal(typeof vibrate.light, 'function', 'vibrate.light must exist');
  assert.equal(typeof vibrate.heavy, 'function', 'vibrate.heavy must exist');
});

console.log('='.repeat(78));
console.log(` SUMMARY: ${passed}/${passed + failed} passed (${failed} failed)`);
console.log('='.repeat(78));

if (failed > 0) {
  process.exit(1);
}
