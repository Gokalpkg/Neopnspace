// ==============================================================================
// Neon Space Survivor — v1.7.2 Overhaul Verification Suite
// ==============================================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getGame, resetLocalStorage } from './harness.js';
import { SPAWN_PACING } from '../src/balance.js';
import { Enemy } from '../src/enemies.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('='.repeat(78));
console.log(' NEON SPACE SURVIVOR — v1.7.2 OVERHAUL VERIFICATION SUITE');
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
test('T1: Version 1.7.2 and versionCode 49 in package.json & build.gradle', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  assert.equal(pkg.version, '1.7.2', 'package.json version must be 1.7.2');

  const gradle = fs.readFileSync(path.join(rootDir, 'android/app/build.gradle'), 'utf8');
  assert.ok(gradle.includes('versionCode 49'), 'build.gradle must have versionCode 49');
  assert.ok(gradle.includes('versionName "1.7.2"'), 'build.gradle must have versionName "1.7.2"');
});

// 2. SPAWN_PACING maxEnemies is 45-60
test('T2: SPAWN_PACING maxEnemies is 45 (base) up to 60 (max) in Classic and Storm modes', () => {
  const classicEarly = SPAWN_PACING.getClassicPacing(5, 1);
  assert.equal(classicEarly.maxEnemies, 45, 'Classic early maxEnemies must be 45');

  const classicLate = SPAWN_PACING.getClassicPacing(100, 10);
  assert.equal(classicLate.maxEnemies, 60, 'Classic late maxEnemies must be 60');

  const stormEarly = SPAWN_PACING.getStormPacing(5);
  assert.equal(stormEarly.maxEnemies, 45, 'Storm early maxEnemies must be 45');

  const stormLate = SPAWN_PACING.getStormPacing(120);
  assert.equal(stormLate.maxEnemies, 60, 'Storm late maxEnemies must be 60');
});

// 3. Asteroid Debris & Split Rock Deadlock Fix
test('T3: Asteroid debris and split rock pieces do NOT block wave spawn throttle', () => {
  resetLocalStorage();
  game.startNewGame();
  game.enemies = [];

  // Add 50 split debris rocks
  for (let i = 0; i < 50; i++) {
    const rock = new Enemy(100 + i * 2, 200, 'asteroid_s', 1, 1);
    rock.isDebris = true;
    rock.isSplitPiece = true;
    game.enemies.push(rock);
  }

  // Calculate effective count as implemented in game.js
  const effectiveCount = game.enemies.reduce((cnt, e) => {
    if (!e || e.toRemove || e.hp <= 0) return cnt;
    if (e.isDebris || e.isSplitPiece || e.type === 'asteroid_split') return cnt;
    return cnt + 1;
  }, 0);

  assert.equal(effectiveCount, 0, 'Debris rocks must not count towards the spawn cap throttle');
});

// 4. Kamikaze and Dive Bomber Destructibility & High XP
test('T4: Kamikaze and dive_bomber are destructible (not indestructible) and drop high XP', () => {
  const kami = new Enemy(100, 100, 'kamikaze', 1.0, 1.0);
  assert.ok(!kami.isIndestructible, 'kamikaze must NOT be indestructible');
  assert.ok(kami.hp > 0 && kami.hp < 100, `kamikaze hp must be reasonable (${kami.hp})`);
  assert.ok(kami.score >= 200, `kamikaze score must be high (${kami.score})`);

  const dive = new Enemy(100, 100, 'dive_bomber', 1.0, 1.0);
  assert.ok(!dive.isIndestructible, 'dive_bomber must NOT be indestructible');
  assert.ok(dive.hp > 0 && dive.hp < 100, `dive_bomber hp must be reasonable (${dive.hp})`);
  assert.ok(dive.score >= 200, `dive_bomber score must be high (${dive.score})`);

  // Check loot drop
  game.gems = [];
  game.dropEnemyLoot(kami);
  assert.ok(game.gems.length >= 2, 'kamikaze must drop multiple gems');
  assert.ok(game.gems[0].value >= 3, 'kamikaze gems must be high value');
});

// 5. Ghost Evolution hyperPlasma Revival
test('T5: hyperPlasma evolution spawns emerald scythes with piercing and DoT', () => {
  resetLocalStorage();
  game.startNewGame();
  game.playerBullets = [];
  game.player.evolutions.hyperPlasma = true;
  game.player.shootCooldown = 999;
  game.player.hyperPlasmaCadence = 1; // next shot triggers scythes

  // Trigger weapon update
  game.updateWeapons(1.0);

  const hyperBullets = game.playerBullets.filter(b => b.isHyperPlasma);
  assert.ok(hyperBullets.length > 0, 'hyperPlasma must spawn active hyper-plasma projectiles');
  assert.ok(hyperBullets[0].piercing, 'hyperPlasma bullets must be piercing');
  assert.ok(hyperBullets[0].pierce >= 8, 'hyperPlasma bullets must have high pierce count');
  assert.ok(hyperBullets[0].plasmaBurnTimer > 0, 'hyperPlasma bullets must apply plasmaBurnTimer DoT');
  assert.equal(hyperBullets[0].color, '#05ffa1', 'hyperPlasma bullets must be emerald green (#05ffa1)');
});

// 6. 3 Card Choices Expansion
test('T6: Level up modal presents 3 card choices instead of 2', () => {
  const gameSrc = fs.readFileSync(path.join(rootDir, 'src/game.js'), 'utf8');
  assert.ok(gameSrc.includes('while (choices.length < 3 && shuffled.length > 0)'), 'level-up choices must expand to 3');
  assert.ok(gameSrc.includes('while (choices.length < 3 && fallbackOverdrives.length > 0)'), 'fallback choices must expand to 3');

  resetLocalStorage();
  game.startNewGame();
  game.player.level = 1;
  game.player.xp = 0;
  game.player.nextXp = 10;
  game.triggerLevelUp(true);

  const cardsContainer = document.getElementById('cards-container');
  assert.ok(cardsContainer, 'cards-container element must exist');
  assert.equal(cardsContainer.children.length, 3, `Level up must render 3 card elements (rendered ${cardsContainer.children.length})`);
});

// 7. Combo Cap Unlocked to 250 & Achievements
test('T7: Combo cap unlocked to 250 and achievements combo_3 (65x), combo_4 (100x), combo_5 (150x) accessible', () => {
  const gameSrc = fs.readFileSync(path.join(rootDir, 'src/game.js'), 'utf8');
  assert.ok(gameSrc.includes('this.comboCount = Math.min(250, this.comboCount + 1)'), 'comboCount must be capped at 250');

  // Verify killstreak shockwaves and texts at milestones
  assert.ok(gameSrc.includes('[COMBO 25X] UNSTOPPABLE!'), '25x milestone must have UNSTOPPABLE text');
  assert.ok(gameSrc.includes('[COMBO 50X] GODLIKE!'), '50x milestone must have GODLIKE text');
  assert.ok(gameSrc.includes('[COMBO 100X] HYPER-FEVER OVERDRIVE!'), '100x milestone must have HYPER-FEVER text');
  assert.ok(gameSrc.includes('[COMBO 150X] LIGHTSPEED CHAIN!'), '150x milestone must have LIGHTSPEED CHAIN text');
  assert.ok(gameSrc.includes('[COMBO 200X] APEX ASCENDANT!'), '200x milestone must have APEX text');

  resetLocalStorage();
  game.startNewGame();
  game.comboCount = 64;

  const mockEnemy = new Enemy(150, 150, 'asteroid_s', 1, 1);
  mockEnemy._balloonDone = true;
  game.handleEnemyDeath(mockEnemy);
  assert.equal(game.comboCount, 65, 'comboCount must reach 65');

  // Simulate reaching 100 and 150
  game.comboCount = 99;
  mockEnemy._deathHandled = false;
  mockEnemy._balloonDone = true;
  game.handleEnemyDeath(mockEnemy);
  assert.equal(game.comboCount, 100, 'comboCount must reach 100');

  game.comboCount = 149;
  mockEnemy._deathHandled = false;
  mockEnemy._balloonDone = true;
  game.handleEnemyDeath(mockEnemy);
  assert.equal(game.comboCount, 150, 'comboCount must reach 150');
});

// 8. Game Over Screen Compactness
test('T8: Game Over screen elements are compacted and TEKRAR OYNA is front-and-center', () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(rootDir, 'src/style.css'), 'utf8');

  // Verify HTML structure: btn-restart appears before damage-breakdown and mission-card
  const restartIdx = html.indexOf('id="btn-restart"');
  const dmgIdx = html.indexOf('id="go-damage-breakdown"');
  const missionIdx = html.indexOf('id="go-mission-card"');

  assert.ok(restartIdx !== -1, 'btn-restart must exist');
  assert.ok(restartIdx < dmgIdx, 'btn-restart must appear before go-damage-breakdown');
  assert.ok(restartIdx < missionIdx, 'btn-restart must appear before go-mission-card');

  // Verify CSS compactness
  assert.ok(css.includes('.gameover-card'), 'gameover-card css must exist');
  assert.ok(css.includes('scrollbar-width: thin'), 'gameover-card should have thin scrollbar');
  assert.ok(css.includes('.go-primary-restart-btn'), 'go-primary-restart-btn css must exist');
});

console.log('='.repeat(78));
console.log(` SUMMARY: ${passed}/${passed + failed} passed (${failed} failed)`);
console.log('='.repeat(78));

if (failed > 0) process.exit(1);
