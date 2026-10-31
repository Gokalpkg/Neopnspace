// ==============================================================================
// 🛡️ NEON SPACE SURVIVOR — ANTI-INSTANT-DEATH & SURVIVABILITY VERIFICATION SUITE
// Verifies:
// 1. Post-Hit Invulnerability (I-Frames: 28 frames on normal hit, blocks same-frame multi-hits)
// 2. Shield-Gating (Absorbs overflow damage on shield break, 42 I-Frames, clears 120px bullets, [KALKAN KIRILDI!])
// 3. Last-Stand / Clutch Gate (Clamps lethal hit to 1 HP, 60 I-Frames, temporalSlowTimer=28, clears 165px bullets, resets >50% HP)
// 4. Damage Source Telemetry & Readable Death Sequence (lastDamageSource/X/Y, 36-frame deathPop, Game Over killer info)
// ==============================================================================

import assert from 'node:assert/strict';
import { getGame } from './harness.js';
import { Enemy, EnemyProjectile } from '../src/enemies.js';

console.log('='.repeat(78));
console.log(' ANTI-INSTANT-DEATH & SURVIVABILITY DEEP VERIFICATION SUITE');
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
// 1. POST-HIT INVULNERABILITY (I-FRAMES) & MULTI-HIT BURST PROTECTION
// ------------------------------------------------------------------------------
test('1.1: Normal hull hit grants 28 invulnerability frames and blocks same-frame multi-hits', () => {
  game.startNewGame();
  game.currentSkinId = 'cyberpunk';
  game.player.hp = 100;
  game.player.maxHp = 100;
  game.player.shield = 0;
  game.player.invulnerableTimer = 0;

  game.takeDamage(15, 180, 500, 'projectile');
  assert.equal(game.player.hp, 85, 'First hit must reduce HP from 100 to 85');
  assert.equal(game.player.invulnerableTimer, 28, 'Normal hit must grant 28 I-frames');

  // Simulate 5 more hits in the exact same frame (0ms apart)
  for (let i = 0; i < 5; i++) {
    game.takeDamage(15, 180, 500, 'projectile');
  }
  assert.equal(game.player.hp, 85, 'Subsequent hits during I-frames must deal 0 damage');
});

test('1.2: Overlapping enemy projectile burst in updateEnemies only hits player once per burst', () => {
  game.startNewGame();
  game.currentSkinId = 'cyberpunk';
  game.player.x = 180;
  game.player.y = 550;
  game.player.hp = 100;
  game.player.maxHp = 100;
  game.player.shield = 0;
  game.player.invulnerableTimer = 0;
  game.enemies = [];

  // Spawn 6 overlapping enemy projectiles right on top of the player
  game.enemyProjectiles = [];
  for (let i = 0; i < 6; i++) {
    const p = new EnemyProjectile(180, 550, 0, 0);
    game.enemyProjectiles.push(p);
  }

  game.updateEnemies(1.0);

  assert.ok(game.player.hp >= 85, `Player HP must only take a single bullet hit (~10 dmg), got ${game.player.hp}`);
  assert.equal(game.player.invulnerableTimer, 28, 'Player must have 28 I-frames active after bullet burst');
});

test('1.3: Overlapping enemy cluster in updateEnemies only damages player once', () => {
  game.startNewGame();
  game.currentSkinId = 'cyberpunk';
  game.player.x = 180;
  game.player.y = 550;
  game.player.hp = 100;
  game.player.maxHp = 100;
  game.player.shield = 0;
  game.player.invulnerableTimer = 0;
  game.enemyProjectiles = [];

  // Spawn 5 overlapping kamikaze enemies directly on the player
  game.enemies = [];
  for (let i = 0; i < 5; i++) {
    const e = new Enemy(180, 550, 'kamikaze', 1.0, 1.0);
    game.enemies.push(e);
  }

  game.updateEnemies(1.0);

  assert.ok(game.player.hp >= 70, `Player must survive 5-enemy cluster with only 1 hit taken, got HP=${game.player.hp}`);
  assert.ok(game.player.invulnerableTimer >= 28, 'Player must have I-frames after enemy collision');
});

// ------------------------------------------------------------------------------
// 2. SHIELD-GATING (KALKAN KIRILMA KORUMASI)
// ------------------------------------------------------------------------------
test('2.1: Shield-Gate absorbs excess overflow damage, grants 42 I-frames, clears 120px bullets, and spawns [KALKAN KIRILDI!]', () => {
  game.startNewGame();
  game.currentSkinId = 'cyberpunk';
  game.player.x = 180;
  game.player.y = 550;
  game.player.hp = 100;
  game.player.maxHp = 100;
  game.player.shield = 10;
  game.player.maxShield = 50;
  game.player.invulnerableTimer = 0;
  game.particles.floatingTexts = [];

  // Place 2 enemy projectiles within 120px and 1 outside 120px (at 200px distance)
  const nearBullet1 = new EnemyProjectile(180, 500, 0, 2); // 50px away
  const nearBullet2 = new EnemyProjectile(180, 440, 0, 2); // 110px away
  const farBullet = new EnemyProjectile(180, 300, 0, 2);   // 250px away
  game.enemyProjectiles = [nearBullet1, nearBullet2, farBullet];

  // Inflict 45 damage against 10 shield (35 overflow damage must be absorbed by Shield-Gate!)
  game.takeDamage(45, 180, 520, 'sniper');

  assert.equal(game.player.shield, 0, 'Shield must be depleted to 0');
  assert.equal(game.player.hp, 100, 'Shield-Gate must absorb 100% of overflow damage (HP stays 100)');
  assert.equal(game.player.invulnerableTimer, 42, 'Shield break must grant 42 frames of invulnerability');
  assert.equal(game.enemyProjectiles.length, 1, 'Bullets within 120px must be cleared, leaving only the far bullet');
  assert.equal(game.enemyProjectiles[0], farBullet, 'Remaining bullet must be the one outside 120px');

  const hasShieldBreakText = game.particles.floatingTexts.some(ft => ft.text && ft.text.includes('[KALKAN KIRILDI!]'));
  assert.ok(hasShieldBreakText, 'Must spawn [KALKAN KIRILDI!] floating text on shield break');
});

// ------------------------------------------------------------------------------
// 3. LAST-STAND / CLUTCH GATE (SON NEFES KORUMASI)
// ------------------------------------------------------------------------------
test('3.1: Lethal damage triggers Last-Stand (Son Nefes) clamping HP to 1, granting 60 I-frames, temporalSlowTimer=28, and clearing 165px bullets', () => {
  game.startNewGame();
  game.currentSkinId = 'cyberpunk';
  game.player.x = 180;
  game.player.y = 550;
  game.player.hp = 35;
  game.player.maxHp = 100;
  game.player.shield = 0;
  game.player.invulnerableTimer = 0;
  game.player.lastStandUsed = false;
  game.temporalSlowTimer = 0;
  game.particles.floatingTexts = [];

  const bulletInside165 = new EnemyProjectile(180, 400, 0, 2); // 150px away (<= 165px)
  const bulletOutside165 = new EnemyProjectile(180, 350, 0, 2); // 200px away (> 165px)
  game.enemyProjectiles = [bulletInside165, bulletOutside165];

  // Deal 60 damage against 35 HP
  game.takeDamage(60, 180, 530, 'boss_laser');

  assert.equal(game.player.hp, 1, 'Last-Stand must clamp HP to 1 instead of dying');
  assert.equal(game.player.lastStandUsed, true, 'lastStandUsed must be marked true');
  assert.equal(game.player.invulnerableTimer, 60, 'Last-Stand must grant 60 I-frames (1.0s)');
  assert.equal(game.temporalSlowTimer, 28, 'Last-Stand must trigger temporalSlowTimer = 28');
  assert.equal(game.deathPop, 0, 'Player must NOT enter deathPop when saved by Last-Stand');
  assert.equal(game.state, 'PLAYING', 'Game state must remain PLAYING');
  assert.equal(game.enemyProjectiles.length, 1, 'Projectiles within 165px must be cleared');
  assert.equal(game.enemyProjectiles[0], bulletOutside165, 'Projectile outside 165px must remain');

  const hasLastStandText = game.particles.floatingTexts.some(ft => ft.text && ft.text.includes('[SON NEFES! KRİTİK HASAR]'));
  assert.ok(hasLastStandText, 'Must spawn [SON NEFES! KRİTİK HASAR] floating warning');
});

test('3.2: Last-Stand resets when HP recovers above 50% and can save the player again', () => {
  game.startNewGame();
  game.currentSkinId = 'cyberpunk';
  game.player.hp = 30;
  game.player.maxHp = 100;
  game.player.shield = 0;
  game.player.invulnerableTimer = 0;

  // Trigger first Last-Stand
  game.takeDamage(50, 180, 500, 'kamikaze');
  assert.equal(game.player.hp, 1);
  assert.equal(game.player.lastStandUsed, true);

  // Recover HP to 40% (not > 50% yet)
  game.player.hp = 40;
  game.update(1.0);
  assert.equal(game.player.lastStandUsed, true, 'Recovering to 40% (<= 50%) must NOT reset lastStandUsed');

  // Recover HP to 60% (> 50%)
  game.player.hp = 60;
  game.update(1.0);
  assert.equal(game.player.lastStandUsed, false, 'Recovering above 50% HP must reset lastStandUsed to false');

  // Expire I-frames and take lethal damage again
  game.player.invulnerableTimer = 0;
  game.takeDamage(90, 180, 500, 'kamikaze');
  assert.equal(game.player.hp, 1, 'Reset Last-Stand must save the player a second time at 1 HP');
  assert.equal(game.player.lastStandUsed, true);
});

// ------------------------------------------------------------------------------
// 4. DAMAGE SOURCE TELEMETRY & READABLE DEATH SEQUENCE
// ------------------------------------------------------------------------------
test('4.1: Damage source telemetry records source, X, Y and lethal hit after Last-Stand initiates 36-frame deathPop & Game Over killer badge', () => {
  game.startNewGame();
  game.currentSkinId = 'cyberpunk';
  game.player.x = 180;
  game.player.y = 550;
  game.player.hp = 25;
  game.player.maxHp = 100;
  game.player.shield = 0;
  game.player.invulnerableTimer = 0;
  game.player.hasPhoenix = false;

  // First lethal hit triggers Last-Stand
  game.takeDamage(40, 140, 490, 'tether');
  assert.equal(game.player.hp, 1);
  assert.equal(game.player.lastStandUsed, true);
  assert.equal(game.lastDamageSource, 'tether');
  assert.equal(game.lastDamageX, 140);
  assert.equal(game.lastDamageY, 490);

  // Expire I-frames while still at 1 HP and take second lethal hit
  game.player.invulnerableTimer = 0;
  game.particles.floatingTexts = [];
  game.takeDamage(20, 210, 510, 'boss_laser');

  assert.equal(game.player.hp, 0, 'Second lethal hit without healing must drop HP to 0');
  assert.equal(game.lastDamageSource, 'boss_laser', 'lastDamageSource must record boss_laser');
  assert.equal(game.lastDamageX, 210, 'lastDamageX must record 210');
  assert.equal(game.lastDamageY, 510, 'lastDamageY must record 510');
  assert.equal(game.deathPop, 36, 'deathPop must be 36 frames (600ms readable sequence)');

  const hasFatalText = game.particles.floatingTexts.some(ft => ft.text && ft.text.includes('ÖLÜMCÜL DARBE'));
  assert.ok(hasFatalText, 'Lethal hit must spawn [ÖLÜMCÜL DARBE: ...] floating text');

  // Verify draw() executes drawDeathTelemetry() cleanly during deathPop
  game.draw();

  // Advance 35 frames: still in PLAYING with deathPop > 0
  for (let f = 0; f < 35; f++) {
    game.update(1.0);
  }
  assert.equal(game.state, 'PLAYING', 'Game must remain in PLAYING during first 35 frames of deathPop');
  assert.equal(game.deathPop, 1, 'deathPop must be 1 after 35 frames');

  // 36th frame completes deathPop and triggers gameOver()
  game.update(1.0);
  assert.equal(game.state, 'GAME_OVER', 'Game must transition to GAME_OVER when deathPop reaches 0');

  const killerInfoEl = document.getElementById('go-killer-info');
  assert.ok(killerInfoEl.textContent.includes('BOSS YIKIM LAZERİ'), `Game Over killer badge must display killer label, got: "${killerInfoEl.textContent}"`);
});

test('1.4: Continuous Boss collision does NOT infinitely refresh invulnerableTimer', () => {
  game.startNewGame();
  game.currentSkinId = 'cyberpunk';
  game.player.x = 180;
  game.player.y = 140;
  game.player.targetX = 180;
  game.player.targetY = 140;
  game.player.hp = 100;
  game.player.maxHp = 100;
  game.player.shield = 0;
  game.player.invulnerableTimer = 0;
  game.enemyProjectiles = [];

  const boss = new Enemy(180, 140, 'boss_dreadnought', 1.0, 1.0);
  game.enemies = [boss];

  // Frame 1: Boss collides with player, dealing damage and granting 30 I-frames
  game.updateEnemies(1.0);
  const hpAfterFirstHit = game.player.hp;
  assert.ok(hpAfterFirstHit < 100, 'First Boss collision must damage player');
  assert.equal(game.player.invulnerableTimer, 30, 'First Boss collision must grant 30 I-frames');

  // Next 29 frames while still overlapping Boss: invulnerableTimer must count down to 1, NOT stay stuck at 30
  for (let f = 0; f < 29; f++) {
    boss.x = game.player.x;
    boss.y = game.player.y;
    game.player.invulnerableTimer = Math.max(0, game.player.invulnerableTimer - 1);
    game.updateEnemies(1.0);
  }
  assert.equal(game.player.invulnerableTimer, 1, 'invulnerableTimer must decay down to 1 even while overlapping Boss');
  assert.equal(game.player.hp, hpAfterFirstHit, 'No extra damage while invulnerableTimer > 0');

  // Frame 30: invulnerableTimer reaches 0 and Boss hits again
  boss.x = game.player.x;
  boss.y = game.player.y;
  game.player.invulnerableTimer = 0;
  game.updateEnemies(1.0);
  assert.ok(game.player.hp < hpAfterFirstHit || game.player.lastStandUsed, 'Boss must be able to hit player again once I-frames expire');
});

test('4.2: Actual enemy types in enemies.js map to localized Turkish labels and EnemyProjectile preserves shooter sourceType', () => {
  const actualTypes = [
    ['cruiser', 'ZIRHLI KRUVAZÖR'],
    ['dive_bomber', 'DALIŞ BOMBARDIMANCISI'],
    ['shield_vanguard', 'KALKANLI MUHAFIZ'],
    ['elite_scout', 'ELİT KESKİN NİŞANCI'],
    ['asteroid_cryo', 'BUZUL METEORU'],
    ['asteroid_purple', 'DOMİNO METEORU'],
    ['asteroid_vortex', 'GİRDAP METEORU'],
    ['boss_dreadnought', 'KARA MUHAFIZ (BOSS)']
  ];
  for (const [type, expected] of actualTypes) {
    assert.equal(game.getDamageSourceLabel(type), expected, `Label for ${type} must be ${expected}`);
  }

  // Verify Enemy firing a projectile tags it with sourceType
  const cruiser = new Enemy(180, 120, 'cruiser', 1.0, 1.0);
  cruiser.shootTimer = 1;
  const projs = [];
  cruiser.update(180, 500, projs, 360, 640, 2.0);
  assert.ok(projs.length > 0, 'Cruiser must fire projectiles');
  assert.equal(projs[0].sourceType, 'cruiser', 'Spawned EnemyProjectile must record shooter sourceType');
});

test('4.3: Modal transitions (pauseGame, openMerchant, triggerLevelUp, triggerLuckyChest) are blocked during 36-frame deathPop', () => {
  game.startNewGame();
  game.currentSkinId = 'cyberpunk';
  game.player.hp = 1;
  game.player.maxHp = 100;
  game.player.shield = 0;
  game.player.invulnerableTimer = 0;
  game.player.lastStandUsed = true;
  game.player.hasPhoenix = false;
  game.triggerMerchantSignal();

  // Lethal hit starts 36-frame deathPop
  game.takeDamage(50, 180, 500, 'cruiser');
  assert.equal(game.deathPop, 36);
  assert.equal(game.merchantSignalTimer, 0, 'Merchant signal timer must be cleared on lethal hit');

  // Attempt to pause or open modals during deathPop
  game.pauseGame();
  assert.equal(game.state, 'PLAYING', 'pauseGame must be ignored during deathPop');
  game.openMerchant();
  assert.equal(game.modalTransition, null, 'openMerchant must not start modalTransition during deathPop');
  game.triggerLevelUp();
  assert.equal(game.modalTransition, null, 'triggerLevelUp must not start modalTransition during deathPop');
  game.triggerLuckyChest();
  assert.equal(game.modalTransition, null, 'triggerLuckyChest must not start modalTransition during deathPop');
});

test('5.1: Multi-layer survivability chain: Phantom Phase -> Shield-Gate -> Last-Stand -> Phoenix (Lv2) -> Last-Stand -> Death', () => {
  game.startNewGame();
  game.currentSkinId = 'phantom';
  game.player.phaseCooldown = 0;
  game.player.phaseTimer = 0;
  game.player.invulnerableTimer = 0;
  game.player.hp = 50;
  game.player.maxHp = 100;
  game.player.shield = 20;
  game.player.maxShield = 50;
  game.player.lastStandUsed = false;
  game.player.hasPhoenix = true;
  game.player.phoenixUsed = false;
  game.techUpgrades = { ...game.techUpgrades, phoenix: 2 }; // Lv2 revives at 60% HP (> 50%)

  // Layer 1: Phantom Phase Shield absorbs Hit 1 completely
  game.takeDamage(100, 180, 500, 'sniper');
  assert.ok(game.player.phaseTimer > 0, 'Phantom Phase Shield must activate on Hit 1');
  assert.equal(game.player.shield, 20, 'Shield must remain 20 after Phase Shield deflect');
  assert.equal(game.player.hp, 50, 'HP must remain 50 after Phase Shield deflect');

  // Expire Phase Shield (while keeping phaseCooldown > 0)
  game.player.phaseTimer = 0;

  // Layer 2: Shield-Gate absorbs 100 damage against 20 shield with 0 hull spillover
  game.takeDamage(100, 180, 500, 'sniper');
  assert.equal(game.player.shield, 0, 'Shield must break to 0');
  assert.equal(game.player.hp, 50, 'Shield-Gate must prevent hull damage');
  assert.equal(game.player.invulnerableTimer, 42, 'Shield-Gate must grant 42 I-frames');

  // Expire Shield-Gate I-frames
  game.player.invulnerableTimer = 0;

  // Layer 3: Last-Stand clamps lethal 100 damage to 1 HP
  game.takeDamage(100, 180, 500, 'boss_laser');
  assert.equal(game.player.hp, 1, 'Last-Stand must clamp HP to 1');
  assert.equal(game.player.lastStandUsed, true, 'lastStandUsed must be true');
  assert.equal(game.player.phoenixUsed, false, 'Phoenix must NOT be consumed when Last-Stand saves player');
  assert.equal(game.player.invulnerableTimer, 60, 'Last-Stand must grant 60 I-frames');

  // Expire Last-Stand I-frames
  game.player.invulnerableTimer = 0;

  // Layer 4: Phoenix Shield (Lv2 = 60% HP) triggers on next lethal hit and resets Last-Stand (> 50% HP)
  game.takeDamage(100, 180, 500, 'boss_laser');
  assert.equal(game.player.phoenixUsed, true, 'Phoenix must trigger when Last-Stand is already used');
  assert.equal(game.player.hp, 60, 'Phoenix Lv2 must revive player to 60 HP (60%)');
  assert.equal(game.player.shield, 50, 'Phoenix must restore full shield');
  assert.equal(game.player.lastStandUsed, false, 'Phoenix reviving above 50% HP must reset lastStandUsed to false');

  // Deplete shield & I-frames, then verify Last-Stand saves player a 2nd time
  game.player.shield = 0;
  game.player.invulnerableTimer = 0;
  game.takeDamage(100, 180, 500, 'kamikaze');
  assert.equal(game.player.hp, 1, 'Reset Last-Stand after Phoenix Lv2 must save player a 2nd time');
  assert.equal(game.player.lastStandUsed, true);

  // Verify suspend/resume preserves lastStandUsed and phoenixUsed
  game.writeSuspendSnapshot();
  const snap = JSON.parse(localStorage.getItem('neon_suspended_run'));
  assert.equal(snap.lastStandUsed, true, 'Suspended run snapshot must persist lastStandUsed');
  assert.equal(snap.phoenixUsed, true, 'Suspended run snapshot must persist phoenixUsed');
});

console.log('='.repeat(78));
console.log(` SUMMARY: ${passed}/${passed + failed} tests passed (${failed} failed)`);
console.log('='.repeat(78));

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
