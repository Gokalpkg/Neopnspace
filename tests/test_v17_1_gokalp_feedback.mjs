// ==============================================================================
// Neon Space Survivor — v1.7.1 Playtest Feedback Verification Suite
// ==============================================================================

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getGame, resetLocalStorage } from './harness.js';
import { t, SUPPORTED_LANGUAGES } from '../src/i18n.js';
import { CATALOG } from '../src/catalog-i18n.js';
import { ParticleSystem } from '../src/particles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('='.repeat(78));
console.log(' NEON SPACE SURVIVOR — v1.7.1 PLAYTEST FEEDBACK VERIFICATION SUITE');
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
function isSemverGte(v, target) {
  const [a1, b1, c1] = (v || '0.0.0').split('.').map(n => parseInt(n, 10) || 0);
  const [a2, b2, c2] = target.split('.').map(n => parseInt(n, 10) || 0);
  if (a1 !== a2) return a1 > a2;
  if (b1 !== b2) return b1 > b2;
  return c1 >= c2;
}

test('T1: Version 1.7.1+ and versionCode 48+ in package.json & build.gradle', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  assert.ok(pkg.version && isSemverGte(pkg.version, '1.7.1'), 'package.json version must be 1.7.1 or higher');

  const gradle = fs.readFileSync(path.join(rootDir, 'android/app/build.gradle'), 'utf8');
  const vcMatch = gradle.match(/versionCode\s+(\d+)/);
  const vnMatch = gradle.match(/versionName\s+"([^"]+)"/);

  assert.ok(vcMatch, 'versionCode must exist in build.gradle');
  assert.ok(parseInt(vcMatch[1], 10) >= 48, `build.gradle must have versionCode >= 48 (got ${vcMatch[1]})`);
  assert.ok(vnMatch, 'versionName must exist in build.gradle');
  assert.ok(isSemverGte(vnMatch[1], '1.7.1'), `build.gradle must have versionName >= 1.7.1 (got ${vnMatch[1]})`);
});

// 2. Realistic Jet Banking & Aerodynamic Tilt
test('T2: Maximum tilt angle reaches 0.55 rad (~32 deg) with spring-damper dynamics', () => {
  const gameSrc = fs.readFileSync(path.join(rootDir, 'src/game.js'), 'utf8');
  assert.ok(gameSrc.includes('Math.max(-0.55, Math.min(0.55, dx * 0.024))'), 'targetTilt must be capped at 0.55 rad');
  assert.ok(gameSrc.includes('this.player.tiltVel'), 'aerodynamic spring-damper must track tilt velocity');

  resetLocalStorage();
  game.startNewGame();
  game.player.x = 200;
  game.player.y = 500;
  game.player.targetX = 200;
  game.player.targetY = 500;
  game.player.tilt = 0;
  game.player.tiltVel = 0;

  // Continuous steering right
  for (let f = 0; f < 30; f++) {
    game.player.targetX = game.player.x + 35;
    game.update(1.0);
  }
  assert.ok(game.player.tilt > 0.35, `Jet tilt should bank significantly under maneuver: got ${game.player.tilt}`);
});

// 3. Expanded Movement Boundaries
test('T3: Jet allowed movement boundaries expanded (x: 16 to width-16, y: 36 to height-36)', () => {
  const gameSrc = fs.readFileSync(path.join(rootDir, 'src/game.js'), 'utf8');
  assert.ok(gameSrc.includes('Math.max(16, Math.min(this.width - 16, this.player.x))'), 'x boundary clamping updated to 16px');
  assert.ok(gameSrc.includes('Math.max(36, Math.min(this.height - 36, this.player.y))'), 'y boundary clamping updated to 36px');
});

// 4. Afterburner Flame Particles
test('T4: ParticleSystem defines spawnAfterburner and game activates twin afterburner on maneuver', () => {
  const ps = new ParticleSystem();
  assert.equal(typeof ps.spawnAfterburner, 'function', 'ParticleSystem must define spawnAfterburner');
  ps.spawnAfterburner(100, 200, '#38bdf8');
  assert.ok(ps.getActiveParticleCount() > 0, 'Afterburner particle must be spawned');

  const gameSrc = fs.readFileSync(path.join(rootDir, 'src/game.js'), 'utf8');
  assert.ok(gameSrc.includes('spawnAfterburner'), 'game.js must invoke spawnAfterburner during maneuvers');
});

// 5. Heavy Front Zone (Ağır Balyoz) Cadence & Overhaul
test('T5: HEAVY_CADENCE reduced reloadFrames across all 6 ships', () => {
  const gameSrc = fs.readFileSync(path.join(rootDir, 'src/game.js'), 'utf8');
  
  // Verify chrono reloadFrames 28
  assert.ok(gameSrc.includes('chrono:    { burstCount: 4, burstSpacing: 7,  reloadFrames: 28'), 'Chrono must reload in 28 frames');
  // Verify solar reloadFrames 38
  assert.ok(gameSrc.includes('solar:     { burstCount: 1, burstSpacing: 0,  reloadFrames: 38'), 'Solar must reload in 38 frames');
  // Verify toxic reloadFrames 30
  assert.ok(gameSrc.includes('toxic:     { burstCount: 1, burstSpacing: 0,  reloadFrames: 30'), 'Toxic must reload in 30 frames');
  // Verify vortex reloadFrames 34
  assert.ok(gameSrc.includes('vortex:    { burstCount: 1, burstSpacing: 0,  reloadFrames: 34'), 'Vortex must reload in 34 frames');
  // Verify cyberpunk reloadFrames 28
  assert.ok(gameSrc.includes('cyberpunk: { burstCount: 2, burstSpacing: 5,  reloadFrames: 28'), 'Cyberpunk must reload in 28 frames');
  // Verify phantom reloadFrames 30
  assert.ok(gameSrc.includes('phantom:   { burstCount: 4, burstSpacing: 4,  reloadFrames: 30'), 'Phantom must reload in 30 frames');
});

test('T6: Front zone weapons fire overwhelming swarm-clearing projectiles', () => {
  const gameSrc = fs.readFileSync(path.join(rootDir, 'src/game.js'), 'utf8');
  // Solar splashRadius 180
  assert.ok(gameSrc.includes('splashRadius: 180'), 'Solar heavy shot must have splashRadius 180');
  // Chrono pierce 99
  assert.ok(gameSrc.includes('isChronoSlug: true, isCrit: true') && gameSrc.includes('pierce: 99'), 'Chrono heavy shot must have pierce 99');
  // Toxic pierce 99 bio acid drill
  assert.ok(gameSrc.includes('isAcidDrill: true') && gameSrc.includes('pierce: 99'), 'Toxic heavy shot must have pierce 99');
  // Vortex 24px orb
  assert.ok(gameSrc.includes('w: 24, h: 24, color: \'#bf5af2\',') && gameSrc.includes('pierce: 12'), 'Vortex heavy shot must have 24px orb with pierce 12');
});

// 6. card_tag Localization in all 9 languages in CATALOG & TRANSLATIONS
test('T7: card_tag_evo and card_tag_free defined in CATALOG and TRANSLATIONS for all 9 languages', () => {
  for (const lang of SUPPORTED_LANGUAGES) {
    const code = lang.code;
    const cat = CATALOG[code];
    assert.ok(cat, `CATALOG must exist for ${code}`);
    assert.ok(cat.card_tag_evo, `card_tag_evo missing from CATALOG for ${code}`);
    assert.ok(cat.card_tag_free, `card_tag_free missing from CATALOG for ${code}`);
    assert.notEqual(cat.card_tag_evo, 'card_tag_evo', `card_tag_evo must be translated in CATALOG for ${code}`);
    assert.notEqual(cat.card_tag_free, 'card_tag_free', `card_tag_free must be translated in CATALOG for ${code}`);
  }
});

// 7. Chest reward card cleanly renders localized tag without raw key bug
test('T8: renderChestRewardCard & createChestRewardCard cleanly render localized tag without raw key bug', () => {
  assert.equal(typeof game.createChestRewardCard, 'function', 'game must define createChestRewardCard');
  assert.equal(typeof game.renderChestRewardCard, 'function', 'game must define renderChestRewardCard');

  const regularCard = game.renderChestRewardCard({
    id: 'laser',
    name: 'PLASMA LASER',
    stat: '+25% DMG',
    desc: 'High-frequency particle beam',
    isEvolution: false
  }, 0);

  const evoCard = game.createChestRewardCard({
    id: 'evo_supernova',
    name: 'SUPERNOVA CORE',
    stat: 'EVOLVED',
    desc: 'Devastating thermonuclear reaction',
    isEvolution: true
  }, 1);

  // Must have card-meta-row with card-level-badge
  assert.ok(regularCard.innerHTML.includes('card-meta-row'), 'Regular card must render card-meta-row');
  assert.ok(regularCard.innerHTML.includes('card-level-badge'), 'Regular card must render card-level-badge');
  assert.ok(evoCard.innerHTML.includes('evolution-tag'), 'Evolution card must render evolution-tag');

  // Must NOT contain the raw key string "card_tag"
  assert.ok(!regularCard.innerHTML.includes('card_tag'), 'Regular card must not show raw "card_tag" key');
  assert.ok(!evoCard.innerHTML.includes('card_tag'), 'Evolution card must not show raw "card_tag" key');

  // Must contain localized tag text
  assert.ok(regularCard.innerHTML.includes('ÜCRETSİZ GELİŞTİRME') || regularCard.innerHTML.includes('FREE UPGRADE'), 'Regular card must render translated free upgrade tag');
  assert.ok(evoCard.innerHTML.includes('EFSANEVİ EVRİM') || evoCard.innerHTML.includes('LEGENDARY EVOLUTION'), 'Evolution card must render translated evolution tag');
});

// 8. Live Health & Shield in Modals
test('T9: HTML contains live vitals in level-modal and lucky-chest-modal', () => {
  const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert.ok(html.includes('id="modal-hp-text"'), 'index.html must have #modal-hp-text');
  assert.ok(html.includes('id="modal-shield-text"'), 'index.html must have #modal-shield-text');
  assert.ok(html.includes('id="chest-modal-hp-text"'), 'index.html must have #chest-modal-hp-text');
  assert.ok(html.includes('id="chest-modal-shield-text"'), 'index.html must have #chest-modal-shield-text');
});

test('T10: updateModalVitals synchronizes live player HP and Shield to modal indicator elements', () => {
  resetLocalStorage();
  game.startNewGame();
  game.player.hp = 85;
  game.player.maxHp = 100;
  game.player.shield = 24;
  game.player.maxShield = 30;

  game.updateModalVitals();

  const hpEl = document.getElementById('modal-hp-text');
  const shEl = document.getElementById('modal-shield-text');
  const chestHpEl = document.getElementById('chest-modal-hp-text');
  const chestShEl = document.getElementById('chest-modal-shield-text');

  assert.equal(hpEl.textContent, '85 / 100');
  assert.equal(shEl.textContent, '24 / 30');
  assert.equal(chestHpEl.textContent, '85 / 100');
  assert.equal(chestShEl.textContent, '24 / 30');
});

console.log('='.repeat(78));
console.log(` SUMMARY: ${passed}/${passed + failed} passed (${failed} failed)`);
console.log('='.repeat(78));

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
